// API quản trị (/api/admin/*). Mọi route trừ /login cần phiên đăng nhập. Chuyển từ server/routes/admin.cjs.
import { Hono } from 'hono';
import { run, get, all, batch } from '../db.js';
import * as auth from '../auth.js';
import { hashPassword, verifyPassword, iterationsFrom, MIN_PASSWORD_LENGTH } from '../password.js';
import { COLLECTIONS, ICONS, coerce, listCollection, getSettings, saveSection } from '../content.js';
import { readJson } from '../http.js';

const app = new Hono();
const bad = (c, message, status = 400) => c.json({ success: false, message }, status);
const isUnique = (e) => String(e?.message).includes('UNIQUE');

app.use('*', auth.requireSafeWrite);

// ---------- Auth ----------
app.post('/login', async (c) => {
  const ip = auth.clientIp(c);
  if (await auth.loginThrottled(ip)) return bad(c, 'Too many failed sign-in attempts. Try again in 15 minutes.', 429);
  const b = (await readJson(c)) || {};
  const username = String(b.username || '').trim();
  const password = String(b.password || '');
  const user = username ? await get('SELECT * FROM admin_users WHERE username = ?', [username]) : null;
  const check = user ? await verifyPassword(password, user.password_hash) : { ok: false };
  if (!check.ok) {
    await auth.recordFailure(ip);
    return bad(c, 'Incorrect username or password', 401);
  }
  await auth.clearFailures(ip);
  // Số vòng băm trong cấu hình đã đổi → băm lại mật khẩu này theo số vòng mới (D31).
  const target = iterationsFrom(c.env.PBKDF2_ITERATIONS);
  if (check.iterations !== target) {
    await run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await hashPassword(password, target), user.id]);
  }
  await auth.createSession(c, user.id);
  return c.json({ success: true, data: { username: user.username, displayName: user.display_name } });
});

app.use('*', auth.requireAdmin);

app.post('/logout', async (c) => {
  await auth.destroySession(c);
  return c.json({ success: true });
});

app.get('/me', (c) => c.json({ success: true, data: c.get('admin') }));

app.post('/password', async (c) => {
  const { currentPassword, newPassword } = (await readJson(c)) || {};
  if (!newPassword || String(newPassword).length < MIN_PASSWORD_LENGTH) return bad(c, `New password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  const user = await get('SELECT * FROM admin_users WHERE id = ?', [c.get('admin').id]);
  if (!(await verifyPassword(String(currentPassword || ''), user.password_hash)).ok) return bad(c, 'Current password is incorrect');
  await run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await hashPassword(String(newPassword), iterationsFrom(c.env.PBKDF2_ITERATIONS)), user.id]);
  return c.json({ success: true, message: 'Password changed' });
});

// ---------- Dashboard ----------
app.get('/summary', async (c) => {
  const q = await get(`SELECT COUNT(*) AS total, SUM(status = 'Pending') AS pending FROM quotes`);
  const k = await get(`SELECT COUNT(*) AS total, SUM(COALESCE(status,'New') = 'New') AS pending FROM contacts`);
  return c.json({ success: true, data: { quotes: { total: q.total, pending: q.pending || 0 }, contacts: { total: k.total, pending: k.pending || 0 } } });
});

// ---------- Báo giá & liên hệ (dữ liệu khách) ----------
const QUOTE_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const CONTACT_STATUSES = ['New', 'Done'];

app.get('/quotes', async (c) => c.json({ success: true, data: await all('SELECT * FROM quotes ORDER BY createdAt DESC, id DESC') }));
app.patch('/quotes/:id', async (c) => {
  const status = (await readJson(c))?.status;
  if (!QUOTE_STATUSES.includes(status)) return bad(c, 'Invalid status');
  const r = await run('UPDATE quotes SET status = ? WHERE id = ?', [status, c.req.param('id')]);
  if (!r.changes) return bad(c, 'Not found', 404);
  return c.json({ success: true });
});

app.get('/contacts', async (c) => c.json({
  success: true,
  data: await all(`SELECT id, name, phone, email, message, COALESCE(status,'New') AS status, COALESCE(source,'contact') AS source, createdAt FROM contacts ORDER BY createdAt DESC, id DESC`),
}));
app.patch('/contacts/:id', async (c) => {
  const status = (await readJson(c))?.status;
  if (!CONTACT_STATUSES.includes(status)) return bad(c, 'Invalid status');
  const r = await run('UPDATE contacts SET status = ? WHERE id = ?', [status, c.req.param('id')]);
  if (!r.changes) return bad(c, 'Not found', 404);
  return c.json({ success: true });
});

// ---------- Settings ----------
app.get('/settings', async (c) => c.json({ success: true, data: await getSettings() }));
app.put('/settings/:section', async (c) => {
  const r = await saveSection(c.req.param('section'), await readJson(c));
  if (r.error) return bad(c, r.error);
  return c.json({ success: true, data: r.value });
});

// ---------- Danh sách (services, frequency-options, projects, testimonials) ----------
app.get('/meta', (c) => c.json({ success: true, data: { icons: ICONS, quoteStatuses: QUOTE_STATUSES, contactStatuses: CONTACT_STATUSES } }));

app.use('/content/:collection/*', async (c, next) => {
  const def = COLLECTIONS[c.req.param('collection')];
  if (!def) return bad(c, 'Not found', 404);
  c.set('def', def);
  await next();
});
app.use('/content/:collection', async (c, next) => {
  const def = COLLECTIONS[c.req.param('collection')];
  if (!def) return bad(c, 'Not found', 404);
  c.set('def', def);
  await next();
});

app.get('/content/:collection', async (c) => c.json({ success: true, data: await listCollection(c.req.param('collection'), { activeOnly: false }) }));

app.post('/content/:collection', async (c) => {
  const def = c.get('def');
  const { values, error } = coerce(def, (await readJson(c)) || {}, { partial: false });
  if (error) return bad(c, error);
  const max = await get(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM ${def.table}`);
  values.sort_order = max.m + 1;
  const cols = Object.keys(values);
  try {
    const r = await run(`INSERT INTO ${def.table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`, Object.values(values));
    return c.json({ success: true, data: { id: r.lastID } });
  } catch (e) {
    if (isUnique(e)) return bad(c, 'This code (slug) already exists');
    throw e;
  }
});

app.put('/content/:collection/reorder', async (c) => {
  const def = c.get('def');
  const ids = (await readJson(c))?.ids;
  if (!Array.isArray(ids)) return bad(c, 'ids must be a list');
  // 1 lần gọi D1 cho cả danh sách (gói Free giới hạn 50 truy vấn/request).
  await batch(ids.map((id, i) => [`UPDATE ${def.table} SET sort_order = ? WHERE id = ?`, [i, id]]));
  return c.json({ success: true });
});

app.put('/content/:collection/:id', async (c) => {
  const def = c.get('def');
  const { values, error } = coerce(def, (await readJson(c)) || {}, { partial: true });
  if (error) return bad(c, error);
  const cols = Object.keys(values);
  if (!cols.length) return bad(c, 'Nothing to update');
  try {
    const r = await run(
      `UPDATE ${def.table} SET ${cols.map((k) => `${k} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...Object.values(values), c.req.param('id')]
    );
    if (!r.changes) return bad(c, 'Not found', 404);
    return c.json({ success: true });
  } catch (e) {
    if (isUnique(e)) return bad(c, 'This code (slug) already exists');
    throw e;
  }
});

app.delete('/content/:collection/:id', async (c) => {
  const r = await run(`DELETE FROM ${c.get('def').table} WHERE id = ?`, [c.req.param('id')]);
  if (!r.changes) return bad(c, 'Not found', 404);
  return c.json({ success: true });
});

// ---------- Upload ảnh → R2 (đường dẫn công khai vẫn là /uploads/<tên file>, D29) ----------
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
const MAX_UPLOAD = 5 * 1024 * 1024;

app.post('/upload', async (c) => {
  let file = null;
  try { file = (await c.req.formData()).get('file'); } catch { /* không phải multipart */ }
  if (!file || typeof file === 'string' || !ALLOWED[file.type]) return bad(c, 'Only JPG, PNG, WEBP or GIF images are allowed');
  if (file.size > MAX_UPLOAD) return bad(c, 'Images must be 5 MB or smaller');
  const name = `${Date.now()}-${[...crypto.getRandomValues(new Uint8Array(6))].map((b) => b.toString(16).padStart(2, '0')).join('')}${ALLOWED[file.type]}`;
  await c.env.UPLOADS.put(name, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return c.json({ success: true, data: { url: `/uploads/${name}` } });
});

export default app;
