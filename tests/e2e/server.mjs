// Máy chủ riêng cho kiểm thử E2E: chạy bản build trên Worker giả lập (vite preview) với D1 + R2 trong thư mục tạm,
// nội dung mặc định + 2 admin thử. Không đụng tới dữ liệu local thật (.wrangler/state).
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'greenland-e2e-'));
const env = { ...process.env, CF_PERSIST_DIR: dir };

const node = (script, args = [], extra = {}) => {
  const r = spawnSync(process.execPath, [path.join(ROOT, script), ...args], { cwd: ROOT, env: { ...env, ...extra }, stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
};
node('scripts/cf/db-setup.mjs');
for (const username of ['admin1', 'admin2']) {
  node('scripts/cf/admin-create.mjs', [username, `E2E ${username}`], { ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD });
}

const vite = spawn(process.execPath, [path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview'], { cwd: ROOT, env, stdio: 'inherit' });
const cleanup = () => {
  if (vite.exitCode === null) vite.kill();
  fs.rmSync(dir, { recursive: true, force: true });
};
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
vite.on('exit', (code) => process.exit(code ?? 0));
