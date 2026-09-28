// C1 — Xuất dữ liệu từ database SQLite cũ (bản Express: server/database.sqlite) thành file SQL để nạp vào D1.
// Kết quả: server/backups/d1-import.sql (chứa dữ liệu khách + tài khoản admin → KHÔNG commit, thư mục đã có trong .gitignore).
// Không lấy admin_sessions (phiên đăng nhập cũ) và login_failures.
// Cách dùng: npm run cf:export-sqlite [-- <đường dẫn file .sqlite>]   (cần Node ≥ 22.13, dùng node:sqlite có sẵn)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, BACKUP_DIR, lit, positional, main } from './lib.mjs';

// Thứ tự & cột theo migrations/0001_init.sql.
export const TABLES = {
  admin_users: ['id', 'username', 'password_hash', 'display_name', 'created_at', 'last_login_at'],
  site_settings: ['key', 'value', 'updated_at'],
  services: ['id', 'slug', 'title', 'subtitle', 'description', 'price_per_m2', 'base_price', 'icon', 'image', 'features', 'calc_name', 'hero_emoji', 'hero_label', 'footer_label', 'sort_order', 'is_active', 'updated_at'],
  frequency_options: ['id', 'label', 'discount_pct', 'hint', 'sort_order', 'is_active', 'updated_at'],
  projects: ['id', 'category', 'title', 'description', 'image', 'image_alt', 'sort_order', 'is_active', 'updated_at'],
  testimonials: ['id', 'name', 'role', 'content', 'stars', 'avatar', 'sort_order', 'is_active', 'updated_at'],
  quotes: ['id', 'fullName', 'phone', 'email', 'serviceId', 'serviceName', 'gardenArea', 'frequency', 'address', 'preferredDate', 'notes', 'estimatedCost', 'status', 'createdAt'],
  contacts: ['id', 'name', 'phone', 'email', 'message', 'createdAt', 'status', 'source'],
};

main(async () => {
  const src = path.resolve(positional()[0] || path.join(ROOT, 'server', 'database.sqlite'));
  if (!fs.existsSync(src)) throw new Error(`Không thấy file ${src}`);
  let DatabaseSync;
  try { ({ DatabaseSync } = await import('node:sqlite')); } catch {
    throw new Error('Node chưa có node:sqlite — cần Node 22.13 trở lên (node -v).');
  }
  const db = new DatabaseSync(src, { readOnly: true });
  const lines = [`-- Xuất từ ${path.basename(src)} lúc ${new Date().toISOString()} — nạp bằng: npm run cf:import [-- --remote]`];
  const counts = {};
  for (const [table, cols] of Object.entries(TABLES)) {
    const have = new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name));
    const use = cols.filter((c) => have.has(c));
    const rows = have.size ? db.prepare(`SELECT ${use.join(', ')} FROM ${table} ORDER BY rowid`).all() : [];
    counts[table] = rows.length;
    for (const r of rows) lines.push(`INSERT INTO ${table} (${use.join(', ')}) VALUES (${use.map((c) => lit(r[c])).join(', ')});`);
  }
  db.close();
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const out = path.join(BACKUP_DIR, 'd1-import.sql');
  fs.writeFileSync(out, lines.join('\n') + '\n');
  fs.writeFileSync(path.join(BACKUP_DIR, 'd1-import.counts.json'), JSON.stringify(counts, null, 2) + '\n');
  console.log(`Đã xuất: ${path.relative(ROOT, out)}`);
  console.table(counts);
});
