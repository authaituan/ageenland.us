# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-009` — Ảnh nền Hero kiểu ảnh thật + lớp phủ chỉnh được trong CMS · 2026-09-24 |
| **Phase** | Phase 1 – Admin CMS — xong. Deploy **hoãn** (chỉ chạy local) |
| **Sức khỏe** | 🟢 E2E 3/3 · check-cms-schema 154 trường + 4 danh sách · lint 0 lỗi |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | PO chạy `npm run content:reset` trên máy để DB đang chạy chuyển sang nội dung tiếng Anh (tự sao lưu DB cũ), rồi `npm run build` + `npm start` | PO | Trang chủ + CMS hiện tiếng Anh, giá dạng $ |
| 2 | PO tải ảnh nền Hero (6 ảnh Unsplash gợi ý, xem SNAP-009), chọn 1 ảnh trong CMS → Hero banner → Background image | PO | Hero dùng ảnh mới |
| 2b | PO sửa giá mẫu (USD/sq ft), địa chỉ, SĐT, email thật trong CMS | PO | — (D9: nội dung CMS) |
| 3 | Deploy lên hosting — **hoãn** đến khi PO quyết định (Q1) | Claude Code · Sonnet 5 | Website chạy HTTPS, có sao lưu DB + ảnh |

## Vướng mắc / chờ PO quyết định
- **Q1** (hoãn) Hosting thật — chỉ cần khi PO muốn deploy; hiện chỉ chạy local, không chặn việc #1.

## Rủi ro đang theo dõi
- Chưa có quy trình sao lưu DB + ảnh upload (cần trước deploy).
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
- Giá dịch vụ, địa chỉ, SĐT (Austin, TX · (555) 123-4567), số liệu thống kê trong nội dung tiếng Anh là **mẫu** — PO sửa trong CMS (D9).
- Báo giá cũ tạo trước SNAP-008 lưu số tiền VND nhưng CMS nay hiển thị theo USD — xóa bằng `npm run content:reset -- --with-requests` nếu chỉ là dữ liệu thử.
