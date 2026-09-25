# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-012` — Theme Light v2 (premium) · 2026-09-25 |
| **Phase** | Phase 2 – Theme thứ 2 — xong (Classic + Light v2) |
| **Sức khỏe** | 🟢 E2E 4/4 · check-cms-schema 157 trường + 4 danh sách · lint 0 lỗi (8 cảnh báo cũ) |
| **Demo** | Render Free `greenland-demo.onrender.com` (nội dung từ `shared/defaultContent.json`, D20) |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | PO duyệt theme Light v2 (`/?theme=light`), chọn theme cho khách trong CMS → Theme | PO | PO chốt theme |
| 2 | Muốn Render dùng theme đã chọn: `npm run content:export` → push | PO | Render hiện đúng theme |

## Vướng mắc / chờ PO quyết định
- (không có)

## Rủi ro đang theo dõi
- Antigravity từng sửa ngoài phạm vi (SNAP-005) → bắt buộc kiểm tra `git diff --stat` trước khi commit Bước B.
- Render Free xóa dữ liệu khi ngủ/deploy; theme đang chọn trên Render = giá trị trong `shared/defaultContent.json` (hiện `classic`).
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
- `npm audit` báo lỗ hổng ở công cụ cài đặt của sqlite3 (không chạy lúc website hoạt động).
