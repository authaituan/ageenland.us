// Chẩn đoán đăng nhập: kiểm tra trực tiếp username + mật khẩu với database (không qua trình duyệt).
// Cách dùng: npm run admin:check -- <username>
const readline = require('readline');
const { init, get, all, db, DB_PATH } = require('../db.cjs');
const { verifyPassword } = require('../auth.cjs');

(async () => {
  const username = process.argv[2];
  await init();
  console.log(`Database: ${DB_PATH}`);
  const users = await all('SELECT username FROM admin_users ORDER BY id');
  console.log(`Tài khoản đang có: ${users.map((u) => u.username).join(', ') || '(chưa có)'}`);
  if (!username) { console.log('Cách dùng: npm run admin:check -- <username>'); db.close(); return; }
  const user = await get('SELECT * FROM admin_users WHERE username = ?', [username]);
  if (!user) { console.log(`KHÔNG TỒN TẠI tài khoản "${username}"`); db.close(); return; }
  // Nhập hiện rõ để thấy chính xác ký tự đã gõ (kiểm tra bộ gõ tiếng Việt)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Gõ mật khẩu (sẽ HIỆN RÕ để kiểm tra): ', (pw) => {
    rl.close();
    console.log(`Đã nhận ${pw.length} ký tự: ${JSON.stringify(pw)}`);
    console.log(verifyPassword(pw, user.password_hash) ? 'KẾT QUẢ: ĐÚNG mật khẩu' : 'KẾT QUẢ: SAI mật khẩu');
    db.close();
  });
})().catch((e) => { console.error(e); process.exit(1); });
