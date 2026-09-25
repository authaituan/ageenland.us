// Xuất nội dung CMS đang có trong database ra shared/defaultContent.json (nội dung mặc định / dữ liệu seed),
// để bản cài mới — ví dụ Render free, nơi database bị xóa mỗi lần khởi động lại — hiện đúng nội dung của anh.
// Ảnh đã tải lên (/uploads/...) được chép vào public/images/cms/ và đổi đường dẫn tương ứng.
// Chỉ xuất nội dung hiển thị (chữ, ảnh, dịch vụ, giá, dự án, đánh giá); KHÔNG xuất tài khoản admin, báo giá, liên hệ.
// Cách dùng:  npm run content:export   → rồi commit + push (shared/defaultContent.json và public/images/cms/)
const fs = require('fs');
const path = require('path');
const { init, db } = require('../db.cjs');
const { getSite } = require('../content.cjs');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULTS_FILE = path.join(ROOT, 'shared', 'defaultContent.json');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const CMS_IMG_DIR = path.join(ROOT, 'public', 'images', 'cms');

(async () => {
  await init();
  const site = await getSite();
  const copied = [];
  const missing = [];

  // Thay mọi chuỗi "/uploads/<file>" bằng "/images/cms/<file>" và chép file ảnh
  const fixImages = (value) => {
    if (typeof value === 'string' && value.startsWith('/uploads/')) {
      const name = path.basename(value);
      const src = path.join(UPLOAD_DIR, name);
      if (!fs.existsSync(src)) { missing.push(value); return value; }
      fs.mkdirSync(CMS_IMG_DIR, { recursive: true });
      fs.copyFileSync(src, path.join(CMS_IMG_DIR, name));
      copied.push(name);
      return `/images/cms/${name}`;
    }
    if (Array.isArray(value)) return value.map(fixImages);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fixImages(v)]));
    return value;
  };
  const out = fixImages(site);

  // Sao lưu file cũ trước khi ghi đè
  const backupDir = path.join(__dirname, '..', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backup = path.join(backupDir, `defaultContent-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.copyFileSync(DEFAULTS_FILE, backup);

  fs.writeFileSync(DEFAULTS_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`Đã xuất nội dung CMS ra ${path.relative(ROOT, DEFAULTS_FILE)} (bản cũ: ${path.relative(ROOT, backup)})`);
  console.log(`Ảnh chép vào public/images/cms/: ${copied.length ? [...new Set(copied)].join(', ') : '(không có)'}`);
  if (missing.length) console.warn(`[cảnh báo] Không tìm thấy file ảnh: ${missing.join(', ')}`);
  console.log('Tiếp theo: git add shared/defaultContent.json public/images/cms && git commit && git push');
  db.close();
})().catch((e) => { console.error(e); process.exit(1); });
