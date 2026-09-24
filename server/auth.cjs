// Admin authentication: scrypt password hashes + opaque session tokens in an httpOnly cookie.
const crypto = require('crypto');
const { run, get } = require('./db.cjs');

const COOKIE_NAME = 'gl_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const COOKIE_SECURE = process.env.COOKIE_SECURE === '1'; // set to 1 when served over HTTPS

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [algo, saltHex, hashHex] = String(stored).split('$');
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookieHeader(value, maxAgeMs) {
  const attrs = [`${COOKIE_NAME}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${Math.floor(maxAgeMs / 1000)}`];
  if (COOKIE_SECURE) attrs.push('Secure');
  return attrs.join('; ');
}

async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await run('DELETE FROM admin_sessions WHERE expires_at < ?', [Date.now()]);
  await run('INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [sha256(token), userId, Date.now() + SESSION_TTL_MS]);
  await run('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
  res.setHeader('Set-Cookie', cookieHeader(token, SESSION_TTL_MS));
}

async function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) await run('DELETE FROM admin_sessions WHERE token_hash = ?', [sha256(token)]);
  res.setHeader('Set-Cookie', cookieHeader('', 0));
}

async function requireAdmin(req, res, next) {
  try {
    const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: 'Not signed in' });
    const row = await get(
      `SELECT u.id, u.username, u.display_name FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      [sha256(token), Date.now()]
    );
    if (!row) return res.status(401).json({ success: false, message: 'Your session has expired' });
    req.admin = { id: row.id, username: row.username, displayName: row.display_name };
    next();
  } catch (e) {
    next(e);
  }
}

// CSRF defence for cookie-authenticated writes: only accept JSON or multipart from same-origin XHR.
// Cross-site HTML forms cannot send application/json; SameSite=Lax blocks cookies on cross-site POSTs.
function requireSafeWrite(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const ct = String(req.headers['content-type'] || '');
  const ok = ct.startsWith('application/json') || (ct.startsWith('multipart/form-data') && req.headers['x-requested-with'] === 'fetch');
  if (!ok && req.headers['content-length'] !== '0' && req.headers['content-length'] !== undefined) {
    return res.status(415).json({ success: false, message: 'Invalid Content-Type' });
  }
  next();
}

// Simple in-memory login throttle: max 10 failures per IP per 15 minutes.
const failures = new Map();
function loginThrottled(ip) {
  const f = failures.get(ip);
  if (!f) return false;
  if (Date.now() - f.first > 15 * 60 * 1000) { failures.delete(ip); return false; }
  return f.count >= 10;
}
function recordFailure(ip) {
  const f = failures.get(ip);
  if (!f || Date.now() - f.first > 15 * 60 * 1000) failures.set(ip, { first: Date.now(), count: 1 });
  else f.count++;
}
const clearFailures = (ip) => failures.delete(ip);

module.exports = {
  hashPassword, verifyPassword, createSession, destroySession, requireAdmin, requireSafeWrite,
  loginThrottled, recordFailure, clearFailures,
};
