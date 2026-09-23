// GreenLand backend: public API, admin CMS API, uploads, and (in production) the built frontend.
const path = require('path');
const fs = require('fs');
const express = require('express');
const { init, DB_PATH } = require('./db.cjs');
const publicRoutes = require('./routes/public.cjs');
const { router: adminRoutes, UPLOAD_DIR } = require('./routes/admin.cjs');

const PORT = process.env.PORT || 5454;
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const DIST_DIR = path.join(__dirname, '..', 'dist');

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY); // e.g. "1" behind nginx
app.use(express.json({ limit: '1mb' }));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API không tồn tại' }));

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', fallthrough: false }));

if (IS_PROD) {
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.warn('[warn] dist/index.html không tồn tại — hãy chạy "npm run build" trước.');
  }
  app.use(express.static(DIST_DIR));
  // Express 5 wildcard syntax; serves the SPA for "/" and "/admin/*".
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

// JSON error handler
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'JSON không hợp lệ' });
  if (err.status === 404 && req.path.startsWith('/uploads')) return res.status(404).end();
  console.error(err);
  res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
});

init()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`GreenLand backend: http://localhost:${PORT} (${IS_PROD ? 'production' : 'development'})`);
      console.log(`Database: ${DB_PATH}`);
      console.log(`Uploads:  ${UPLOAD_DIR}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[lỗi] Cổng ${PORT} đang bị chương trình khác dùng. Tắt chương trình đó hoặc chạy với cổng khác (xem README).`);
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.error('Không khởi tạo được database:', err);
    process.exit(1);
  });
