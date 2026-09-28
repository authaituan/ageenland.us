# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-014` — `truelander.us` chạy thật trên Cloudflare Worker + D1 + R2 · 2026-09-28 |
| **Phase** | Phase 3 – Chuyển lên Cloudflare (Worker + D1 + R2, `truelander.us`) — C0–C8 xong, còn nghiệm thu: [`docs/plans/PHASE_3_CLOUDFLARE.md`](../plans/PHASE_3_CLOUDFLARE.md) |
| **Sức khỏe** | 🟢 E2E 4/4 · check-cms-schema 157 trường + 4 danh sách · lint 0 lỗi (8 cảnh báo cũ) |
| **Chạy thật** | `https://truelander.us` (push `main` → tự deploy) · Render demo cũ: chờ tắt (D30) |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | Ghi CPU time lần đăng nhập (Workers & Pages → ageenland-us → Observability) | PO | < 10 ms; nếu vượt → giảm `PBKDF2_ITERATIONS` trong `wrangler.jsonc` |
| 2 | Tắt service Render `greenland-demo` (D30) | PO | Render đã xoá/tạm dừng |
| 3 | Sao lưu định kỳ: `npm run db:backup` (D1 tự giữ 7 ngày) | PO | Có file trong `server/backups/` |

## Vướng mắc / chờ PO quyết định
- (không có)

## Rủi ro đang theo dõi
- Antigravity từng sửa ngoài phạm vi (SNAP-005) → bắt buộc kiểm tra `git diff --stat` trước khi commit Bước B.
- Preview builds dùng chung D1/R2 thật → giữ TẮT (PHASE_3 R3). Rollback không lùi DB → migration chỉ thêm (D27).
- Deploy không chạy migration (D33) → đổi schema phải `npm run db:migrate:remote` trước khi push.
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
