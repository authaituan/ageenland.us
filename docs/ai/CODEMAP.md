# CODEMAP — Loại việc nào, đọc file nào
> Chỉ đọc dòng đúng loại việc. Đường dẫn tính từ gốc repo.

## Sơ đồ hệ thống
```
Trình duyệt ─┬─ /        → src/main.jsx → src/App.jsx (chọn theme) → src/themes/<classic|light>/*   (nội dung: src/site/SiteContext.jsx · logic form: src/site/forms.js)
             └─ /admin   → src/admin/AdminApp.jsx → pages.jsx / fields.jsx / schema.js
                   │ gọi API qua src/lib/api.js
                   ▼
Worker   worker/index.js ─┬─ worker/routes/public.js  (/api/site, /api/quotes, /api/contact, /api/leads)
 (wrangler.jsonc)          ├─ worker/routes/admin.js   (/api/admin/*, cần đăng nhập; upload → R2)
                           ├─ worker/auth.js + password.js (đăng nhập PBKDF2, phiên, CSRF, khoá sau 10 lần sai)
                           ├─ worker/content.js        (mô hình nội dung, tính giá)
                           ├─ worker/db.js ──► D1      (schema: migrations/*.sql · seed: scripts/cf/seed-sql.mjs)
                           └─ /uploads/* ──► R2        (ảnh tải lên)
```

## Bảng tra
| Loại việc | Đọc | Kiểm tra bằng |
|---|---|---|
| Logo, favicon | `src/themes/classic/Navbar.jsx` + `Footer.jsx`, `src/themes/light/ui.jsx` (Logo), `public/images/brand/logo.png`, `public/favicon.png`, `index.html` | CMS → Brand |
| Sửa giao diện 1 khu vực trang chủ | `src/themes/<theme>/<Khu>.jsx` (Light thêm `light.css`, `ui.jsx`), `src/index.css` (chung) | Trình duyệt `:5455` (theme khác: `:5455/?theme=light`) |
| Thêm / đổi theme, logic form dùng chung | `shared/themes.json`, `src/App.jsx`, `src/site/forms.js`, `worker/content.js` (validateSection) | `npm run test:e2e` |
| Thêm/sửa trường nội dung CMS | `shared/defaultContent.json`, `src/admin/schema.js`, component dùng trường đó | `node scripts/check-cms-schema.mjs` |
| Màn hình quản trị | `src/admin/*` | `:5455/admin` |
| API công khai (báo giá, liên hệ) | `worker/routes/public.js`, `worker/content.js` | curl / form trên trang |
| API quản trị, upload ảnh | `worker/routes/admin.js`, `worker/auth.js` | Chưa đăng nhập phải trả 401 |
| Đăng nhập, bảo mật | `worker/auth.js`, `worker/password.js`, `scripts/cf/admin-*.mjs` | `npm run admin:check` |
| Database, seed, sao lưu | `migrations/*.sql`, `worker/db.js`, `shared/defaultContent.json`, `scripts/cf/*` | `npm run content:reset` / `db:backup` (sao lưu vào `server/backups/`) |
| Tính giá | `worker/content.js`, `src/site/forms.js` (useQuoteForm) | Giá lưu DB = giá server tính |
| Cổng, chạy, build, deploy | `package.json`, `vite.config.js`, `wrangler.jsonc`, `worker/index.js`, `README.md`, `docs/plans/PHASE_3_CLOUDFLARE.md` | `npm run build && npx wrangler deploy --dry-run` |
| Kiểm thử E2E (toàn luồng CMS) | `tests/e2e/cms.spec.mjs`, `tests/e2e/server.mjs` | `npm run test:e2e` (máy mới: `npm run test:e2e:install` trước) |
| Kế hoạch Phase CMS | `docs/ADMIN_CMS_PLAN.md` (chỉ mục được chỉ định) | — |
