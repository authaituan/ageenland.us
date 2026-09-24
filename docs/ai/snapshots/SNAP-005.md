# SNAP-005 — Xử lý tồn đọng §8 (nội dung mặc định + báo cáo)
- Ngày: 2026-09-24 · Người làm: Claude Code (Sonnet 5) · Commit: sẽ ghi ở commit sau (RULES §4.6)
- Lệnh RULES §3: lint ✅ 0 lỗi (8 cảnh báo) · build ✅ · check-cms-schema ✅ 143 trường + 4 danh sách · test:e2e ✅ 3/3

## Từng mục §8
- `($m^2$)` → `(m²)`: **đã sửa** (`shared/defaultContent.json`).
- Chính tả "Thi Thiết Kế" → "Thiết Kế", "Tới Tự Động" → "Tưới Tự Động": **đã sửa** (cùng file).
- Link `#about` không có section: **chuyển việc** (STATUS #1: thêm mục Về chúng tôi).
- Ảnh `public/images/*.png`: **còn** (không đổi ảnh). 6 ảnh, thực chất là JPEG 1024×1024 đặt đuôi `.png`, nặng: after_garden 1,10MB · before_garden 1,38MB · hero 0,99MB · landscape_design 1,10MB · lawn_care 1,22MB · tree_planting 1,14MB (~6,8MB tổng).
  Đề xuất: xuất WebP 1024px chất lượng ~80 (dự kiến 80–150KB/ảnh), đổi đuôi đúng định dạng, cập nhật đường dẫn trong `defaultContent.json`.
- Lưu ý: PO sửa nội dung đang chạy qua CMS (DB); sửa `defaultContent.json` chỉ đổi nội dung mặc định/seed, không ghi đè DB đang chạy.
