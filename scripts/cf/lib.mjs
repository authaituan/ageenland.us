// Tiện ích dùng chung cho các lệnh quản trị D1/R2 (chạy bằng Node trên máy, gọi wrangler).
// Mặc định thao tác trên dữ liệu LOCAL (.wrangler/state). Thêm --remote để thao tác trên Cloudflare (dữ liệu thật).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DB_NAME = 'greenland-db';
export const BUCKET = 'greenland-uploads';
export const BACKUP_DIR = path.join(ROOT, 'server', 'backups');

const WRANGLER = path.join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

export const args = process.argv.slice(2);
export const flag = (name) => args.includes(name);
export const positional = () => args.filter((a) => !a.startsWith('--'));
export const REMOTE = flag('--remote');
export const target = REMOTE ? 'Cloudflare (dữ liệu THẬT)' : 'local';

// Cấu hình wrangler.jsonc (bỏ chú thích // trước khi đọc JSON).
export function wranglerConfig() {
  const text = fs.readFileSync(path.join(ROOT, 'wrangler.jsonc'), 'utf8');
  return JSON.parse(text.replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*/g, (m, str) => str || ''));
}

function locationArgs() {
  if (REMOTE) return ['--remote'];
  const out = ['--local'];
  if (process.env.CF_PERSIST_DIR) out.push('--persist-to', process.env.CF_PERSIST_DIR);
  return out;
}

export function wrangler(cmdArgs, { capture = false } = {}) {
  const r = spawnSync(process.execPath, [WRANGLER, ...cmdArgs], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    if (capture) process.stderr.write(`${r.stdout || ''}${r.stderr || ''}`);
    throw new Error(`wrangler ${cmdArgs.slice(0, 3).join(' ')} thất bại (mã ${r.status})`);
  }
  return r.stdout;
}

// Chạy 1 file SQL (nhiều lệnh).
export function execFile(sql) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'greenland-sql-')), 'run.sql');
  fs.writeFileSync(file, sql);
  try {
    wrangler(['d1', 'execute', DB_NAME, ...locationArgs(), '--file', file, '--yes'], { capture: true });
  } finally {
    fs.rmSync(path.dirname(file), { recursive: true, force: true });
  }
}

// Chạy 1 câu truy vấn, trả về mảng dòng.
export function query(sql) {
  const out = wrangler(['d1', 'execute', DB_NAME, ...locationArgs(), '--command', sql, '--json'], { capture: true });
  const parsed = JSON.parse(out.slice(out.indexOf('[')));
  return parsed[0]?.results || [];
}

export function migrate() {
  wrangler(['d1', 'migrations', 'apply', DB_NAME, ...locationArgs()], { capture: true });
}

export function r2Put(key, file, contentType) {
  const a = ['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, ...locationArgs()];
  if (contentType) a.push('--content-type', contentType);
  wrangler(a, { capture: true });
}

// Giá trị SQL an toàn (chuỗi đặt trong nháy đơn, nhân đôi nháy bên trong).
export function lit(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${String(v).replace(/'/g, "''")}'`;
}

export const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');

export function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write('*'); };
    rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(answer); });
  });
}

export async function confirmRemote(action) {
  if (!REMOTE || flag('--yes')) return;
  const a = await ask(`Sắp ${action} trên Cloudflare (dữ liệu THẬT). Gõ "yes" để tiếp tục: `);
  if (a.trim().toLowerCase() !== 'yes') { console.log('Đã huỷ.'); process.exit(1); }
}

export function main(fn) {
  fn().catch((e) => { console.error(`[lỗi] ${e.message}`); process.exit(1); });
}
