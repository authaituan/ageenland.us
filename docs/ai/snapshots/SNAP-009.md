# SNAP-009 — Ảnh nền Hero rõ màu, lớp phủ chỉnh trong CMS
- Ngày: 2026-09-24 · Người làm: Claude (Opus 5.5, phiên PO) · Commit: sẽ ghi ở commit sau (RULES §4.6); SNAP-008 = `08efd68`
- Lệnh RULES §3: lint ✅ 0 lỗi · build ✅ · check-cms-schema ✅ 156 trường + 4 danh sách · test:e2e ✅ 3/3

## Thay đổi
- `src/components/Hero.jsx`: bỏ `opacity-35 mix-blend-luminosity` + 2 lớp phủ tối; thay bằng 1 lớp gradient xanh (trái đậm → phải nhạt) + dải mờ ở đáy.
- CMS Hero banner: thêm `overlay_strength` (0–100, mặc định 80) và `background_position` (mặc định center) — `shared/defaultContent.json`, `src/admin/schema.js`.
- `server/content.cjs`: lưu nội dung CMS từ chối trường lạ (báo "restart server") thay vì âm thầm bỏ qua; đọc settings bỏ các trường cũ không còn dùng. Nguyên nhân: PO build lại web nhưng server cũ vẫn chạy → ô Overlay strength không lưu.
- Cổng: server đọc `GREENLAND_PORT` (không đọc `PORT` chung nữa) — máy PO có sẵn biến `PORT=4545` khiến server mới chạy sang 4545 trong khi server cũ vẫn giữ 5454 (`server/index.cjs`, `vite.config.js`, `tests/e2e/playwright.config.mjs`, README).
- Ảnh gợi ý (Unsplash License, dùng thương mại miễn phí): c-5-QE5kBYk · Cxr73PWFP_o · 5d0e2Y7Bclw · zXH4Y7bRu3Y · 5SmkFguk5Hw · Khlaq9XVRxg. Chưa thêm vào repo — PO chọn rồi tải lên qua CMS.
