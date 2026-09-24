# SNAP-007 — Nén 6 ảnh public/images
- Ngày: 2026-09-24 · Người làm: Claude Code (Sonnet 5) · Commit: sẽ ghi ở commit sau (RULES §4.6); SNAP-006 = `e71ad3f`
- Lệnh RULES §3: lint ✅ 0 lỗi (8 cảnh báo) · build ✅ · check-cms-schema ✅ 152 trường + 4 danh sách
- Kiểm thử E2E: `npm run test:e2e` ✅ 3/3 · trang chủ: đủ 6 ảnh tải được (1024×1024)

## Đã làm
- Nén lại đúng định dạng JPEG (sharp + mozjpeg, quality 75, progressive), giữ 1024×1024, ghi đè cùng tên `.png` (CSDL lưu `/images/*.png`). Không đổi WebP, không đổi code.
- Công cụ chạy tạm ngoài repo; ảnh gốc sao lưu ngoài repo.

| Ảnh | Trước (B) | Sau (B) |
|---|---|---|
| after_garden | 1.098.126 | 198.066 |
| before_garden | 1.384.166 | 290.604 |
| hero | 991.678 | 165.791 |
| landscape_design | 1.103.115 | 199.860 |
| lawn_care | 1.224.099 | 238.704 |
| tree_planting | 1.136.399 | 221.202 |
| **Tổng** | **6.937.583** | **1.314.227 (−81,1%)** |
