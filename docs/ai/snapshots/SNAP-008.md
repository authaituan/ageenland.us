# SNAP-008 — Tiếng Anh, USD/sq ft, font mới, sentence case
- Ngày: 2026-09-24 · Người làm: Claude (Opus 5.5, phiên PO) · Commit: sẽ ghi ở commit sau (RULES §4.6); SNAP-007 = `97e65b3`
- Lệnh RULES §3: lint ✅ 0 lỗi · build ✅ · check-cms-schema ✅ 154 trường + 4 danh sách · test:e2e ✅ 3/3
- Kiểm tra thêm: chụp trang chủ (desktop + mobile) và CMS với font DM thật — 0 dòng chữ tiếng Việt còn lại; báo giá thử 1.500 sq ft cắt cỏ hàng tuần = $63.75 (server tính)

## Thay đổi chính
- `shared/defaultContent.json`: toàn bộ nội dung tiếng Anh; giá mẫu USD/sq ft; thanh diện tích 200–15.000 sq ft; thêm `site.locale`, `site.currency_code`.
- Menu, footer, nút: sentence case (D16). Font DM Sans + DM Serif Display (D15): `index.html`, `tailwind.config.js`, `src/index.css`.
- `src/lib/format.js` (mới): định dạng tiền theo CMS; dùng ở Services, Calculator, CMS. Giá cho phép số lẻ, làm tròn cent (`server/content.cjs`).
- CMS (`src/admin/*`) và thông báo API (`server/*.cjs`) chuyển tiếng Anh; script dòng lệnh giữ tiếng Việt cho PO.
- `npm run content:reset` (mới, `server/scripts/reset-content.cjs`): sao lưu DB vào `server/backups/` rồi nạp lại nội dung mặc định.
- `tests/e2e/cms.spec.mjs`: cập nhật nhãn tiếng Anh + công thức làm tròn cent.
