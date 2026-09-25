# CODEMAP — Loại việc nào, đọc file nào
> Chỉ đọc dòng đúng loại việc. Đường dẫn tính từ gốc repo.

## Sơ đồ hệ thống
```
Trình duyệt ─┬─ /        → src/main.jsx → src/App.jsx (chọn theme) → src/themes/<classic|light>/*   (nội dung: src/site/SiteContext.jsx · logic form: src/site/forms.js)
             └─ /admin   → src/admin/AdminApp.jsx → pages.jsx / fields.jsx / schema.js
                   │ gọi API qua src/lib/api.js
                   ▼
Express  server/index.cjs ─┬─ server/routes/public.cjs  (/api/site, /api/quotes, /api/contact, /api/leads)
                           ├─ server/routes/admin.cjs   (/api/admin/*, cần đăng nhập)
                           ├─ server/auth.cjs           (đăng nhập, phiên, CSRF)
                           ├─ server/content.cjs        (mô hình nội dung, tính giá)
                           └─ server/db.cjs ──► SQLite  (schema, migration, seed từ shared/defaultContent.json)
```

## Bảng tra
| Loại việc | Đọc | Kiểm tra bằng |
|---|---|---|
| Sửa giao diện 1 khu vực trang chủ | `src/themes/<theme>/<Khu>.jsx` (Light thêm `light.css`, `ui.jsx`), `src/index.css` (chung) | Trình duyệt `:5455` (theme khác: `:5455/?theme=light`) |
| Thêm / đổi theme, logic form dùng chung | `shared/themes.json`, `src/App.jsx`, `src/site/forms.js`, `server/content.cjs` (validateSection) | `npm run test:e2e` |
| Thêm/sửa trường nội dung CMS | `shared/defaultContent.json`, `src/admin/schema.js`, component dùng trường đó | `node scripts/check-cms-schema.mjs` |
| Màn hình quản trị | `src/admin/*` | `:5455/admin` |
| API công khai (báo giá, liên hệ) | `server/routes/public.cjs`, `server/content.cjs` | curl / form trên trang |
| API quản trị | `server/routes/admin.cjs`, `server/auth.cjs` | Chưa đăng nhập phải trả 401 |
| Đăng nhập, bảo mật | `server/auth.cjs`, `server/scripts/*` | `npm run admin:check` |
| Database, seed | `server/db.cjs`, `shared/defaultContent.json`, `server/scripts/reset-content.cjs` | `npm run content:reset` (tự sao lưu DB vào `server/backups/`) |
| Tính giá | `server/content.cjs`, `src/site/forms.js` (useQuoteForm) | Giá lưu DB = giá server tính |
| Cổng, chạy, build, deploy | `package.json`, `vite.config.js`, `scripts/dev-all.cjs`, `server/index.cjs`, `README.md`, `deploy/` (DEPLOY.md, PM2, nginx, backup) | `npm run build && npm start` |
| Kiểm thử E2E (toàn luồng CMS) | `tests/e2e/cms.spec.mjs`, `tests/e2e/server.cjs` | `npm run test:e2e` (máy mới: `npm run test:e2e:install` trước) |
| Kế hoạch Phase CMS | `docs/ADMIN_CMS_PLAN.md` (chỉ mục được chỉ định) | — |
