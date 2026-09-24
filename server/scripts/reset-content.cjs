// Đặt lại toàn bộ NỘI DUNG website (chữ, ảnh, dịch vụ & giá, tần suất, dự án, đánh giá) về mặc định
// trong shared/defaultContent.json. Giữ nguyên tài khoản admin, báo giá và liên hệ của khách.
// Luôn sao lưu file database trước khi làm.
// Cách dùng:  npm run content:reset                  (giữ báo giá + liên hệ)
//             npm run content:reset -- --with-requests (xóa luôn báo giá + liên hệ, ví dụ dữ liệu thử)
const fs = require('fs');
const path = require('path');
const { init, run, db, DB_PATH } = require('../db.cjs');

(async () => {
  const withRequests = process.argv.includes('--with-requests');
  if (fs.existsSync(DB_PATH)) {
    const dir = path.join(path.dirname(DB_PATH), 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = path.join(dir, `database-${stamp}.sqlite`);
    fs.copyFileSync(DB_PATH, backup);
    console.log(`Đã sao lưu database: ${backup}`);
  }
  await init();
  for (const t of ['site_settings', 'services', 'frequency_options', 'projects', 'testimonials']) await run(`DELETE FROM ${t}`);
  if (withRequests) {
    await run('DELETE FROM quotes');
    await run('DELETE FROM contacts');
    console.log('Đã xóa toàn bộ báo giá và liên hệ.');
  }
  await init(); // seed lại nội dung mặc định
  console.log('Đã đặt lại nội dung website về mặc định (shared/defaultContent.json).');
  db.close();
})().catch((e) => { console.error(e); process.exit(1); });
