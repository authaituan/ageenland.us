// C8 — Nạp dữ liệu cũ (server/backups/d1-import.sql, tạo bằng cf:export-sqlite) vào D1 + đẩy ảnh server/uploads/* lên R2.
// An toàn: từ chối nếu database đích đã có tài khoản admin / báo giá / liên hệ (tránh nạp 2 lần). Nội dung mặc định (nếu có) bị thay.
// Cách dùng: npm run cf:import                (thử trên local)
//            npm run cf:import -- --remote    (Cloudflare — dữ liệu THẬT)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, BACKUP_DIR, migrate, query, execFile, r2Put, target, confirmRemote, flag, main } from './lib.mjs';

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

main(async () => {
  const file = path.join(BACKUP_DIR, 'd1-import.sql');
  if (!fs.existsSync(file)) throw new Error('Chưa có server/backups/d1-import.sql — chạy "npm run cf:export-sqlite" trước.');
  await confirmRemote('nạp dữ liệu cũ vào database và kho ảnh');

  migrate();
  const busy = query(`SELECT (SELECT COUNT(*) FROM admin_users) AS admins, (SELECT COUNT(*) FROM quotes) AS quotes, (SELECT COUNT(*) FROM contacts) AS contacts`)[0];
  if ((busy.admins || busy.quotes || busy.contacts) && !flag('--force')) {
    throw new Error(`Database ${target} đã có dữ liệu (admin ${busy.admins}, báo giá ${busy.quotes}, liên hệ ${busy.contacts}) — dừng để tránh nạp trùng.`);
  }
  const reset = ['site_settings', 'services', 'frequency_options', 'projects', 'testimonials'].map((t) => `DELETE FROM ${t};`).join('\n');
  execFile(`${reset}\n${fs.readFileSync(file, 'utf8')}`);

  const counts = query(`SELECT
    (SELECT COUNT(*) FROM admin_users) AS admin_users, (SELECT COUNT(*) FROM site_settings) AS site_settings,
    (SELECT COUNT(*) FROM services) AS services, (SELECT COUNT(*) FROM frequency_options) AS frequency_options,
    (SELECT COUNT(*) FROM projects) AS projects, (SELECT COUNT(*) FROM testimonials) AS testimonials,
    (SELECT COUNT(*) FROM quotes) AS quotes, (SELECT COUNT(*) FROM contacts) AS contacts`)[0];
  console.log(`Database ${target} sau khi nạp:`);
  console.table(counts);
  const expectedFile = path.join(BACKUP_DIR, 'd1-import.counts.json');
  if (fs.existsSync(expectedFile)) {
    const expected = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));
    const wrong = Object.entries(expected).filter(([t, n]) => counts[t] !== n);
    if (wrong.length) throw new Error(`Số dòng không khớp file xuất: ${wrong.map(([t, n]) => `${t} ${counts[t]}/${n}`).join(', ')}`);
    console.log('Số dòng khớp với file xuất ✔');
  }

  const upDir = path.join(ROOT, 'server', 'uploads');
  const images = fs.existsSync(upDir) ? fs.readdirSync(upDir).filter((f) => TYPES[path.extname(f).toLowerCase()]) : [];
  for (const f of images) r2Put(f, path.join(upDir, f), TYPES[path.extname(f).toLowerCase()]);
  console.log(`Ảnh đã đẩy lên R2 ${target}: ${images.length ? images.join(', ') : '(không có)'}`);
  console.log('Mật khẩu admin cũ (scrypt) không dùng được trên Worker — đặt lại: npm run admin:create -- <tên>' + (target === 'local' ? '' : ' --remote'));
});
