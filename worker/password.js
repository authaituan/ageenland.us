// Băm mật khẩu PBKDF2-SHA256 bằng Web Crypto (D31) — chạy được cả trên Worker lẫn Node (script admin:create).
// Định dạng lưu: pbkdf2$<số vòng>$<salt hex>$<hash hex>. Số vòng nằm trong chuỗi → đổi số vòng không làm hỏng mật khẩu cũ.
// Worker (gói Free) giới hạn 10 ms CPU/request nên không dùng scrypt như bản Express; Workers không cho quá 100000 vòng.
export const DEFAULT_ITERATIONS = 20000;
export const MAX_ITERATIONS = 100000;
export const MIN_PASSWORD_LENGTH = 12;

const enc = new TextEncoder();
const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16)));

export function iterationsFrom(value) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 1000 ? Math.min(n, MAX_ITERATIONS) : DEFAULT_ITERATIONS;
}

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

export async function hashPassword(password, iterations = DEFAULT_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const it = iterationsFrom(iterations);
  return `pbkdf2$${it}$${toHex(salt)}$${toHex(await derive(password, salt, it))}`;
}

// So sánh không phụ thuộc thời gian.
function equal(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Trả { ok, iterations }. Hash kiểu khác (scrypt của bản Express) → ok=false: admin phải đặt lại mật khẩu (npm run admin:create).
export async function verifyPassword(password, stored) {
  const [algo, itStr, saltHex, hashHex] = String(stored || '').split('$');
  const iterations = Number(itStr);
  if (algo !== 'pbkdf2' || !saltHex || !hashHex || !(iterations >= 1 && iterations <= MAX_ITERATIONS)) return { ok: false, iterations: 0 };
  const actual = new Uint8Array(await derive(password, fromHex(saltHex), iterations));
  return { ok: equal(actual, fromHex(hashHex)), iterations };
}

export async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(text)));
}

export function randomHex(bytes) {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)));
}
