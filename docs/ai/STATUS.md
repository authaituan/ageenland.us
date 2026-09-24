# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-006` — Thêm mục "Về chúng tôi" (CMS sửa được) · 2026-09-24 |
| **Phase** | Phase 1 – Admin CMS ([kế hoạch](../ADMIN_CMS_PLAN.md)) — code + nghiệm thu đạt; PO đã xác nhận đăng nhập OK (bản chạy thật local, `http://localhost:5454/admin`). Deploy **hoãn** (chỉ chạy local) |
| **Sức khỏe** | 🟢 Checklist §9 đạt 7/7 · E2E đạt 3/3 · check-cms-schema 152 trường |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | Tối ưu 6 ảnh `public/images` (JPEG đặt đuôi .png, ~1MB/ảnh → WebP, xem SNAP-005) | Antigravity · Gemini 3.6 Flash | Ảnh nhẹ hơn ≥ 80%, giao diện không đổi, E2E đạt |
| 2 | Deploy lên hosting — **hoãn** đến khi PO quyết định (Q1) | Claude Code · Sonnet 5 | Website chạy HTTPS, có sao lưu DB + ảnh |

## Vướng mắc / chờ PO quyết định
- **Q1** (hoãn) Hosting thật — chỉ cần khi PO muốn deploy; hiện chỉ chạy local, không chặn việc #1.

## Rủi ro đang theo dõi
- Chưa có quy trình sao lưu DB + ảnh upload (cần trước deploy).
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
- Nội dung mặc định mục Về chúng tôi (số liệu 8+/500+/24/7…) là mẫu — PO sửa trong CMS `/admin/content/about` (D9: không cần dev).
