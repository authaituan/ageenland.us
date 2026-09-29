# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-015` — Logo mới + tên miền chính `agreenland.us` · 2026-09-29 |
| **Phase** | Phase 3 – Cloudflare (Worker + D1 + R2) — xong: [`docs/plans/PHASE_3_CLOUDFLARE.md`](../plans/PHASE_3_CLOUDFLARE.md) |
| **Sức khỏe** | 🟢 E2E 4/4 · check-cms-schema 158 trường + 4 danh sách · lint 0 lỗi (8 cảnh báo cũ) |
| **Chạy thật** | `https://agreenland.us` (chính) + `https://truelander.us` (song song, D35) · push `main` → tự deploy |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | Tắt service Render `greenland-demo` (D30) | PO | Render đã xoá/tạm dừng |
| 2 | Khi bỏ `truelander.us`: gỡ khỏi Worker, tạo DNS proxied + Redirect Rule 301 `truelander.us/*` → `https://agreenland.us/${1}` | PO + Claude | Link cũ tự về agreenland.us |
| 3 | Sao lưu định kỳ: `npm run db:backup` (D1 tự giữ 7 ngày) | PO | Có file trong `server/backups/` |

## Vướng mắc / chờ PO quyết định
- (không có)

## Rủi ro đang theo dõi
- Antigravity từng sửa ngoài phạm vi (SNAP-005) → bắt buộc kiểm tra `git diff --stat` trước khi commit Bước B.
- Preview builds dùng chung D1/R2 thật → giữ TẮT (PHASE_3 R3). Rollback không lùi DB → migration chỉ thêm (D27).
- Deploy không chạy migration (D33) → đổi schema phải `npm run db:migrate:remote` trước khi push.
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
