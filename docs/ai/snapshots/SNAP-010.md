# SNAP-010 — Đóng gói phát hành + hướng dẫn deploy
- Ngày: 2026-09-25 · Người làm: Claude (Opus 5.5, phiên PO) · Commit: sẽ ghi ở commit sau (RULES §4.6)
- Kiểm tra: build ✅ · cài sạch từ gói (`npm ci --omit=dev`, không kéo dev deps) ✅ · chạy production với DB/ảnh tách thư mục ✅ (/, /admin, /api/site, /uploads, đăng nhập sai 401, form liên hệ) · `deploy/backup.sh` ✅ · PM2 config nạp được ✅

## Thêm
- `deploy/DEPLOY.md` (Ubuntu VPS: Node 22, PM2, nginx, HTTPS certbot, sao lưu cron, cập nhật, cPanel), `deploy/ecosystem.config.cjs`, `deploy/nginx-greenland.conf`, `deploy/backup.sh`.
- Gói (không commit, thư mục `release/` bị .gitignore): `greenland-app-*.zip` (code đã build), `greenland-data-*.zip` (DB + ảnh; đã xóa phiên đăng nhập và 1 báo giá thử VND), `greenland-full-backup-*.zip` (toàn bộ mã nguồn + DB gốc + ảnh + bản sao lưu cũ).

## Render.com (bổ sung)
- `deploy/RENDER.md`: hướng dẫn Render (Free = demo, dữ liệu mất khi ngủ/deploy; trả phí + Disk `/var/data`).
- `server/index.cjs`: tạo admin từ `GREENLAND_ADMIN_USER` / `GREENLAND_ADMIN_PASSWORD` nếu chưa có (hosting không có shell). Đã thử: build `npm ci && npm run build`, `npm start` cổng 10000, đăng nhập được, cookie Secure.
- `npm run content:export` (`server/scripts/export-content.cjs`): xuất nội dung CMS trong DB ra `shared/defaultContent.json`, chép ảnh `/uploads` sang `public/images/cms/`.
- `.node-version` = 22.
- Render lỗi `GLIBC_2.38 not found` (sqlite3 6.0.1 dựng sẵn cho glibc mới hơn máy Render) → ghim `sqlite3@5.1.7` (bản dựng sẵn chỉ cần GLIBC 2.4, API giống hệt). E2E 3/3. `npm audit` báo lỗ hổng ở công cụ cài đặt (node-gyp/tar) của sqlite3, không chạy lúc website hoạt động.
