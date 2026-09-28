// Đặt lại NỘI DUNG website (chữ, ảnh, dịch vụ & giá, tần suất, dự án, đánh giá) về shared/defaultContent.json.
// Giữ tài khoản admin, báo giá và liên hệ. Luôn sao lưu database vào server/backups/ trước.
// Cách dùng: npm run content:reset [-- --remote] [--with-requests]   (--with-requests: xoá luôn báo giá + liên hệ)
import { execFile, flag, target, confirmRemote, main } from './lib.mjs';
import { backup } from './db-backup.mjs';
import { seedSql } from './seed-sql.mjs';

main(async () => {
  const withRequests = flag('--with-requests');
  await confirmRemote(`đặt lại nội dung về mặc định${withRequests ? ' và XOÁ báo giá + liên hệ' : ''}`);
  console.log(`Đã sao lưu: ${backup()}`);
  const tables = ['site_settings', 'services', 'frequency_options', 'projects', 'testimonials', ...(withRequests ? ['quotes', 'contacts'] : [])];
  execFile(tables.map((t) => `DELETE FROM ${t};`).join('\n') + '\n' + seedSql());
  if (withRequests) console.log('Đã xóa toàn bộ báo giá và liên hệ.');
  console.log(`Đã đặt lại nội dung website (${target}) về mặc định (shared/defaultContent.json).`);
});
