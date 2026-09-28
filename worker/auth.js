// Đăng nhập admin: mật khẩu PBKDF2 (worker/password.js) + phiên đăng nhập lưu D1, token trong cookie httpOnly.
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { run, get } from './db.js';
import { sha256Hex, randomHex } from './password.js';

const COOKIE_NAME = 'gl_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

const json = (c, status, message) => c.json({ success: false, message }, status);
// Chỉ gắn Secure khi chạy https (Cloudflare); localhost http vẫn đăng nhập được.
const isHttps = (c) => new URL(c.req.url).protocol === 'https:';
const cookieOpts = (c, maxAgeMs) => ({ path: '/', httpOnly: true, sameSite: 'Lax', secure: isHttps(c), maxAge: Math.floor(maxAgeMs / 1000) });

export const clientIp = (c) => c.req.header('cf-connecting-ip') || 'local';

export async function createSession(c, userId) {
  const token = randomHex(32);
  await run('DELETE FROM admin_sessions WHERE expires_at < ?', [Date.now()]);
  await run('INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [await sha256Hex(token), userId, Date.now() + SESSION_TTL_MS]);
  await run('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
  setCookie(c, COOKIE_NAME, token, cookieOpts(c, SESSION_TTL_MS));
}

export async function destroySession(c) {
  const token = getCookie(c, COOKIE_NAME);
  if (token) await run('DELETE FROM admin_sessions WHERE token_hash = ?', [await sha256Hex(token)]);
  deleteCookie(c, COOKIE_NAME, cookieOpts(c, 0));
}

export async function requireAdmin(c, next) {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return json(c, 401, 'Not signed in');
  const row = await get(
    `SELECT u.id, u.username, u.display_name FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
    [await sha256Hex(token), Date.now()]
  );
  if (!row) return json(c, 401, 'Your session has expired');
  c.set('admin', { id: row.id, username: row.username, displayName: row.display_name });
  await next();
}

// Chống CSRF cho thao tác ghi dùng cookie: chỉ nhận JSON, hoặc multipart kèm X-Requested-With: fetch (giống bản Express).
export async function requireSafeWrite(c, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(c.req.method)) return next();
  const ct = c.req.header('content-type') || '';
  const len = c.req.header('content-length');
  const ok = ct.startsWith('application/json') || (ct.startsWith('multipart/form-data') && c.req.header('x-requested-with') === 'fetch');
  if (!ok && len !== '0' && len !== undefined) return json(c, 415, 'Invalid Content-Type');
  await next();
}

// Tối đa 10 lần sai / IP / 15 phút — lưu D1 (bảng login_failures) thay cho Map trong RAM.
export async function loginThrottled(ip) {
  const f = await get('SELECT first_at, count FROM login_failures WHERE ip = ?', [ip]);
  if (!f) return false;
  if (Date.now() - f.first_at > FAIL_WINDOW_MS) { await run('DELETE FROM login_failures WHERE ip = ?', [ip]); return false; }
  return f.count >= MAX_FAILURES;
}
export async function recordFailure(ip) {
  const now = Date.now();
  await run(
    `INSERT INTO login_failures (ip, first_at, count) VALUES (?, ?, 1)
     ON CONFLICT(ip) DO UPDATE SET
       count = CASE WHEN ? - first_at > ? THEN 1 ELSE count + 1 END,
       first_at = CASE WHEN ? - first_at > ? THEN ? ELSE first_at END`,
    [ip, now, now, FAIL_WINDOW_MS, now, FAIL_WINDOW_MS, now]
  );
}
export const clearFailures = (ip) => run('DELETE FROM login_failures WHERE ip = ?', [ip]);
