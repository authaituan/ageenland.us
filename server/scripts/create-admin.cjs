// Create or reset an admin account.
// Usage: npm run admin:create -- <username> ["Tên hiển thị"]
// The password is typed at the prompt (hidden) or taken from ADMIN_PASSWORD (for scripted setups).
const readline = require('readline');
const { init, run, get, db } = require('../db.cjs');
const { hashPassword } = require('../auth.cjs');

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write('*'); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

(async () => {
  const [username, displayName] = process.argv.slice(2);
  if (!username || !/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
    console.error('Cách dùng: npm run admin:create -- <username> ["Tên hiển thị"]  (username 3-40 ký tự a-z, 0-9, . _ -)');
    process.exit(1);
  }
  await init();
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await askHidden('Mật khẩu (tối thiểu 8 ký tự): ');
    const again = await askHidden('Nhập lại mật khẩu: ');
    if (password !== again) { console.error('Mật khẩu nhập lại không khớp.'); process.exit(1); }
  }
  if (password.length < 8) { console.error('Mật khẩu tối thiểu 8 ký tự.'); process.exit(1); }

  const existing = await get('SELECT id FROM admin_users WHERE username = ?', [username]);
  if (existing) {
    await run('UPDATE admin_users SET password_hash = ?, display_name = COALESCE(?, display_name) WHERE id = ?', [hashPassword(password), displayName || null, existing.id]);
    await run('DELETE FROM admin_sessions WHERE user_id = ?', [existing.id]);
    console.log(`Đã đặt lại mật khẩu cho "${username}".`);
  } else {
    await run('INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)', [username, hashPassword(password), displayName || username]);
    console.log(`Đã tạo tài khoản admin "${username}".`);
  }
  db.close();
})().catch((e) => { console.error(e); process.exit(1); });
