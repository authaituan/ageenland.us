// Áp migration + nạp nội dung mặc định (chỉ phần còn thiếu). Chạy lại bao nhiêu lần cũng được.
// Cách dùng: npm run db:setup            (local — tự chạy trước npm run dev)
//            npm run db:setup -- --remote (Cloudflare — thường KHÔNG cần: dữ liệu thật nạp bằng cf:import)
import { migrate, execFile, target, confirmRemote, main } from './lib.mjs';
import { seedSql } from './seed-sql.mjs';

main(async () => {
  await confirmRemote('áp migration và nạp nội dung mặc định còn thiếu');
  migrate();
  execFile(seedSql());
  console.log(`Database ${target}: đã áp migration + nạp nội dung mặc định còn thiếu.`);
});
