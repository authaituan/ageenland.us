// Admin API (/api/admin/*). Every route except /login requires a valid session.
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { run, get, all } = require('../db.cjs');
const auth = require('../auth.cjs');
const { COLLECTIONS, ICONS, coerce, listCollection, getSettings, saveSection } = require('../content.cjs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const router = express.Router();
router.use(auth.requireSafeWrite);

// ---------- Auth ----------
router.post('/login', async (req, res, next) => {
  try {
    const ip = req.ip;
    if (auth.loginThrottled(ip)) return res.status(429).json({ success: false, message: 'Đăng nhập sai quá nhiều lần. Thử lại sau 15 phút.' });
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');
    const user = username ? await get('SELECT * FROM admin_users WHERE username = ?', [username]) : null;
    if (!user || !auth.verifyPassword(password, user.password_hash)) {
      auth.recordFailure(ip);
      return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    auth.clearFailures(ip);
    await auth.createSession(res, user.id);
    res.json({ success: true, data: { username: user.username, displayName: user.display_name } });
  } catch (e) { next(e); }
});

router.use(auth.requireAdmin);

router.post('/logout', async (req, res, next) => {
  try { await auth.destroySession(req, res); res.json({ success: true }); } catch (e) { next(e); }
});

router.get('/me', (req, res) => res.json({ success: true, data: req.admin }));

router.post('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || String(newPassword).length < 8) return res.status(400).json({ success: false, message: 'Mật khẩu mới tối thiểu 8 ký tự' });
    const user = await get('SELECT * FROM admin_users WHERE id = ?', [req.admin.id]);
    if (!auth.verifyPassword(String(currentPassword || ''), user.password_hash)) return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    await run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [auth.hashPassword(String(newPassword)), user.id]);
    res.json({ success: true, message: 'Đã đổi mật khẩu' });
  } catch (e) { next(e); }
});

// ---------- Dashboard ----------
router.get('/summary', async (req, res, next) => {
  try {
    const q = await get(`SELECT COUNT(*) AS total, SUM(status = 'Pending') AS pending FROM quotes`);
    const c = await get(`SELECT COUNT(*) AS total, SUM(COALESCE(status,'New') = 'New') AS pending FROM contacts`);
    res.json({ success: true, data: { quotes: { total: q.total, pending: q.pending || 0 }, contacts: { total: c.total, pending: c.pending || 0 } } });
  } catch (e) { next(e); }
});

// ---------- Quotes & contacts (customer data) ----------
const QUOTE_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const CONTACT_STATUSES = ['New', 'Done'];

router.get('/quotes', async (req, res, next) => {
  try { res.json({ success: true, data: await all('SELECT * FROM quotes ORDER BY createdAt DESC, id DESC') }); } catch (e) { next(e); }
});
router.patch('/quotes/:id', async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (!QUOTE_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    const r = await run('UPDATE quotes SET status = ? WHERE id = ?', [status, req.params.id]);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

router.get('/contacts', async (req, res, next) => {
  try {
    res.json({ success: true, data: await all(`SELECT id, name, phone, email, message, COALESCE(status,'New') AS status, COALESCE(source,'contact') AS source, createdAt FROM contacts ORDER BY createdAt DESC, id DESC`) });
  } catch (e) { next(e); }
});
router.patch('/contacts/:id', async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (!CONTACT_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    const r = await run('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---------- Settings ----------
router.get('/settings', async (req, res, next) => {
  try { res.json({ success: true, data: await getSettings() }); } catch (e) { next(e); }
});
router.put('/settings/:section', async (req, res, next) => {
  try {
    const r = await saveSection(req.params.section, req.body);
    if (r.error) return res.status(400).json({ success: false, message: r.error });
    res.json({ success: true, data: r.value });
  } catch (e) { next(e); }
});

// ---------- Collections (services, frequency-options, projects, testimonials) ----------
router.get('/meta', (req, res) => res.json({ success: true, data: { icons: ICONS, quoteStatuses: QUOTE_STATUSES, contactStatuses: CONTACT_STATUSES } }));

router.param('collection', (req, res, next, name) => {
  if (!COLLECTIONS[name]) return res.status(404).json({ success: false, message: 'Không tồn tại' });
  req.def = COLLECTIONS[name];
  next();
});

router.get('/content/:collection', async (req, res, next) => {
  try { res.json({ success: true, data: await listCollection(req.params.collection, { activeOnly: false }) }); } catch (e) { next(e); }
});

router.post('/content/:collection', async (req, res, next) => {
  try {
    const { values, error } = coerce(req.def, req.body || {}, { partial: false });
    if (error) return res.status(400).json({ success: false, message: error });
    const max = await get(`SELECT COALESCE(MAX(sort_order), -1) AS m FROM ${req.def.table}`);
    values.sort_order = max.m + 1;
    const cols = Object.keys(values);
    const r = await run(`INSERT INTO ${req.def.table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`, Object.values(values));
    res.json({ success: true, data: { id: r.lastID } });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(400).json({ success: false, message: 'Mã (slug) đã tồn tại' });
    next(e);
  }
});

router.put('/content/:collection/reorder', async (req, res, next) => {
  try {
    const ids = req.body?.ids;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids phải là danh sách' });
    for (let i = 0; i < ids.length; i++) await run(`UPDATE ${req.def.table} SET sort_order = ? WHERE id = ?`, [i, ids[i]]);
    res.json({ success: true });
  } catch (e) { next(e); }
});

router.put('/content/:collection/:id', async (req, res, next) => {
  try {
    const { values, error } = coerce(req.def, req.body || {}, { partial: true });
    if (error) return res.status(400).json({ success: false, message: error });
    const cols = Object.keys(values);
    if (!cols.length) return res.status(400).json({ success: false, message: 'Không có dữ liệu cập nhật' });
    const r = await run(
      `UPDATE ${req.def.table} SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...Object.values(values), req.params.id]
    );
    if (!r.changes) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(400).json({ success: false, message: 'Mã (slug) đã tồn tại' });
    next(e);
  }
});

router.delete('/content/:collection/:id', async (req, res, next) => {
  try {
    const r = await run(`DELETE FROM ${req.def.table} WHERE id = ?`, [req.params.id]);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---------- Image upload ----------
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, !!ALLOWED[file.mimetype]),
});

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.code === 'LIMIT_FILE_SIZE' ? 'Ảnh tối đa 5MB' : err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF' });
    res.json({ success: true, data: { url: `/uploads/${req.file.filename}` } });
  });
});

module.exports = { router, UPLOAD_DIR };
