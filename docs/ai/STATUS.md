# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-011` — 2 giao diện chọn trong CMS (Classic + Light) · 2026-09-25 |
| **Phase** | Phase 2 – Theme thứ 2. Bước A (hạ tầng + bản Light chạy được) xong; Bước B (chỉnh thẩm mỹ Light) chờ giao |
| **Sức khỏe** | 🟢 E2E 4/4 · check-cms-schema 157 trường + 4 danh sách · lint 0 lỗi (8 cảnh báo cũ) |
| **Demo** | Render Free `greenland-demo.onrender.com` (nội dung từ `shared/defaultContent.json`, D20) |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | PO xem thử: CMS → Theme → Preview "Light" (hoặc `/?theme=light`) | PO | PO duyệt hướng thiết kế hoặc ghi góp ý |
| 2 | Nâng cấp theme Light theo spec v2 `docs/ai/tasks/TASK-LIGHT-THEME.md` (hero tràn màn hình, tiêu đề đậm, màu nhấn vàng, dải xanh đậm, hiệu ứng cuộn) — CHỈ sửa `src/themes/light/` | Antigravity (Gemini) | Đạt tiêu chí trong file task; `git diff --stat` chỉ có `src/themes/light/` |
| 3 | CTO/Claude review diff Bước B, chạy E2E, cập nhật STATUS + SNAP | Claude Code | E2E pass, không file ngoài phạm vi |
| 4 | Muốn Render dùng theme Light: chọn trong CMS local → `npm run content:export` → push | PO | Render hiện Light |

## Vướng mắc / chờ PO quyết định
- (không có)

## Rủi ro đang theo dõi
- Antigravity từng sửa ngoài phạm vi (SNAP-005) → bắt buộc kiểm tra `git diff --stat` trước khi commit Bước B.
- Render Free xóa dữ liệu khi ngủ/deploy; theme đang chọn trên Render = giá trị trong `shared/defaultContent.json` (hiện `classic`).
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
- `npm audit` báo lỗ hổng ở công cụ cài đặt của sqlite3 (không chạy lúc website hoạt động).
