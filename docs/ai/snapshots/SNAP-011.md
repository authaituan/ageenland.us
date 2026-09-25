# SNAP-011 — 2 giao diện (theme) chọn trong CMS: Classic + Light
- Ngày: 2026-09-25 · Người làm: Claude (Opus 5.5, phiên PO) · Commit: sẽ ghi ở commit sau (RULES §4.6)
- Kiểm tra: E2E 4/4 (thêm bài đổi theme) · check-cms-schema 157 trường + 4 danh sách · lint 8 cảnh báo (như cũ) · ảnh chụp Classic trước/sau refactor trùng khớp từng pixel (desktop 1440 + mobile 390)

## Đã làm
- CMS → **Theme**: chọn Classic / Light, nút Preview mở `/?theme=<id>` (xem trước, không đổi cho khách). Lưu ở `settings.theme.active`; server từ chối id không có trong `shared/themes.json`.
- `src/components/*` → `src/themes/classic/*` (giữ nguyên giao diện); `src/App.jsx` chọn theme; theme Light tải riêng (lazy) khi được dùng.
- Logic form Hero / báo giá / liên hệ tách ra `src/site/forms.js`, cả 2 theme dùng chung.
- Theme Light (`src/themes/light/*`): bản thiết kế riêng của GreenLand, nền sáng, cảm hứng bố cục chung từ template Landscape 128 (không chép thiết kế/chữ/ảnh — template có bản quyền). Dùng đúng nội dung CMS hiện có (PO chọn phương án a: không thêm Team/Pricing/Blog).
- Việc giao Antigravity chỉnh thẩm mỹ theme Light: `docs/ai/tasks/TASK-LIGHT-THEME.md`.
