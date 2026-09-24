# CODEMAP — Loại việc nào, đọc file nào
> Chỉ đọc dòng đúng loại việc. Đường dẫn tính từ gốc repo.

## Sơ đồ hệ thống
```
Trình duyệt ─┬─ /        → src/main.jsx → src/App.jsx → src/components/*   (đọc nội dung qua src/site/SiteContext.jsx)
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
| Sửa giao diện 1 khu vực trang chủ | `src/components/<Khu>.jsx`, `src/index.css` | Trình duyệt `:5455` |
| Thêm/sửa trường nội dung CMS | `shared/defaultContent.json`, `src/admin/schema.js`, component dùng trường đó | `node scripts/check-cms-schema.mjs` |
| Màn hình quản trị | `src/admin/*` | `:5455/admin` |
| API công khai (báo giá, liên hệ) | `server/routes/public.cjs`, `server/content.cjs` | curl / form trên trang |
| API quản trị | `server/routes/admin.cjs`, `server/auth.cjs` | Chưa đăng nhập phải trả 401 |
| Đăng nhập, bảo mật | `server/auth.cjs`, `server/scripts/*` | `npm run admin:check` |
| Database, seed | `server/db.cjs`, `shared/defaultContent.json` | Xóa DB local, chạy lại server |
| Tính giá | `server/content.cjs`, `src/components/CostCalculator.jsx` | Giá lưu DB = giá server tính |
| Cổng, chạy, build, deploy | `package.json`, `vite.config.js`, `scripts/dev-all.cjs`, `server/index.cjs`, `README.md` | `npm run build && npm start` |
| Kế hoạch Phase CMS | `docs/ADMIN_CMS_PLAN.md` (chỉ mục được chỉ định) | — |
