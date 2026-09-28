// Tạo hoặc đặt lại mật khẩu tài khoản admin (thay server/scripts/create-admin.cjs).
// Cách dùng: npm run admin:create -- <username> ["Tên hiển thị"] [--remote]
// Mật khẩu gõ ở dòng nhắc (ẩn) hoặc lấy từ biến ADMIN_PASSWORD (dùng cho kiểm thử tự động).
import { query, execFile, lit, positional, ask, wranglerConfig, target, main } from './lib.mjs';
import { hashPassword, iterationsFrom, MIN_PASSWORD_LENGTH } from '../../worker/password.js';

main(async () => {
  const [username, displayName] = positional();
  if (!username || !/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
    throw new Error('Cách dùng: npm run admin:create -- <username> ["Tên hiển thị"] [--remote]  (username 3-40 ký tự a-z, 0-9, . _ -)');
  }
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await ask(`Mật khẩu (tối thiểu ${MIN_PASSWORD_LENGTH} ký tự): `, { hidden: true });
    const again = await ask('Nhập lại mật khẩu: ', { hidden: true });
    if (password !== again) throw new Error('Mật khẩu nhập lại không khớp.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Mật khẩu tối thiểu ${MIN_PASSWORD_LENGTH} ký tự.`);

  const hash = await hashPassword(password, iterationsFrom(wranglerConfig().vars?.PBKDF2_ITERATIONS));
  const existing = query(`SELECT id FROM admin_users WHERE username = ${lit(username)}`)[0];
  if (existing) {
    execFile(`UPDATE admin_users SET password_hash = ${lit(hash)}, display_name = COALESCE(${lit(displayName || null)}, display_name) WHERE id = ${existing.id};
DELETE FROM admin_sessions WHERE user_id = ${existing.id};`);
    console.log(`Đã đặt lại mật khẩu cho "${username}" (${target}).`);
  } else {
    execFile(`INSERT INTO admin_users (username, password_hash, display_name) VALUES (${lit(username)}, ${lit(hash)}, ${lit(displayName || username)});`);
    console.log(`Đã tạo tài khoản admin "${username}" (${target}).`);
  }
});
