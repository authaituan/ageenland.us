// Chẩn đoán đăng nhập: kiểm tra username + mật khẩu với database (không qua trình duyệt).
// Cách dùng: npm run admin:check -- <username> [--remote]
import { query, lit, positional, ask, target, main } from './lib.mjs';
import { verifyPassword } from '../../worker/password.js';

main(async () => {
  const [username] = positional();
  const users = query('SELECT username FROM admin_users ORDER BY id');
  console.log(`Database: ${target}`);
  console.log(`Tài khoản đang có: ${users.map((u) => u.username).join(', ') || '(chưa có)'}`);
  if (!username) { console.log('Cách dùng: npm run admin:check -- <username> [--remote]'); return; }
  const user = query(`SELECT password_hash FROM admin_users WHERE username = ${lit(username)}`)[0];
  if (!user) { console.log(`KHÔNG TỒN TẠI tài khoản "${username}"`); return; }
  if (!String(user.password_hash).startsWith('pbkdf2$')) {
    console.log('Mật khẩu đang lưu theo kiểu cũ (scrypt, bản Express) → không đăng nhập được. Đặt lại: npm run admin:create -- ' + username);
    return;
  }
  // Nhập hiện rõ để thấy chính xác ký tự đã gõ (kiểm tra bộ gõ tiếng Việt)
  const pw = await ask('Gõ mật khẩu (sẽ HIỆN RÕ để kiểm tra): ');
  console.log(`Đã nhận ${pw.length} ký tự: ${JSON.stringify(pw)}`);
  console.log((await verifyPassword(pw, user.password_hash)).ok ? 'KẾT QUẢ: ĐÚNG mật khẩu' : 'KẾT QUẢ: SAI mật khẩu');
});
