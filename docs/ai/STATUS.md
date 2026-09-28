# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-013` — Backend chuyển sang Cloudflare Worker + D1 + R2 (chưa deploy) · 2026-09-28 |
| **Phase** | Phase 3 – Chuyển lên Cloudflare (Worker + D1 + R2, `truelander.us`) — C1–C7 xong, còn C8–C9: [`docs/plans/PHASE_3_CLOUDFLARE.md`](../plans/PHASE_3_CLOUDFLARE.md) |
| **Sức khỏe** | 🟢 E2E 4/4 · check-cms-schema 157 trường + 4 danh sách · lint 0 lỗi (8 cảnh báo cũ) |
| **Demo** | Render Free `greenland-demo.onrender.com` (bản Express cũ, tắt sau nghiệm thu — D30) |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | Bật R2 trên dashboard + `npx wrangler r2 bucket create greenland-uploads` | PO | Lệnh báo tạo bucket thành công |
| 2 | Review + merge PR `snap-013-cloudflare` | PO | Có trên `main` |
| 3 | C8: nối Workers Builds, `cf:import --remote`, `admin:create --remote` × 2, gắn `truelander.us`, Redirect Rule www, đo CPU đăng nhập (PHASE_3 §7.2–7.4) | PO + Claude | PHASE_3 §10 đạt |
| 4 | Tắt Render demo (D30) | PO | Sau khi #3 đạt |

## Vướng mắc / chờ PO quyết định
- (không có)

## Rủi ro đang theo dõi
- Antigravity từng sửa ngoài phạm vi (SNAP-005) → bắt buộc kiểm tra `git diff --stat` trước khi commit Bước B.
- Preview builds dùng chung D1/R2 thật → giữ TẮT (PHASE_3 R3). Rollback không lùi DB → migration chỉ thêm (D27).
- Token build mặc định thiếu quyền D1 → thêm D1 Edit, nếu không deploy lỗi ở bước migration.
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
