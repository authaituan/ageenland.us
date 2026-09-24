# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-003` — Nghiệm thu Phase CMS xong (S10) · 2026-09-24 |
| **Phase** | Phase 1 – Admin CMS ([kế hoạch](../ADMIN_CMS_PLAN.md)) — code + nghiệm thu đạt; PO đã xác nhận đăng nhập OK (bản chạy thật local, `http://localhost:5454/admin`). Deploy **hoãn** (chỉ chạy local) |
| **Sức khỏe** | 🟢 Checklist §9 đạt 7/7 · `npm run test:e2e` đạt 3/3 |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | ~~PO xác nhận đăng nhập~~ — xong 2026-09-24 | PO | ✅ |
| 2 | Chuyển Tailwind từ CDN sang đóng gói trong build (bỏ `<script cdn.tailwindcss.com>` ở `index.html`) | Antigravity · Gemini 3.1 Pro | Ảnh chụp trước/sau giống nhau; `npm run test:e2e` đạt |
| 3 | Xác minh tồn đọng §8 kế hoạch (link `#about`, ký hiệu `$m^2$`, chính tả, ảnh PNG nặng) — mục nào còn thì sửa | Antigravity · Gemini 3.6 Flash | Mỗi mục: đã sửa / còn |
| 4 | Deploy lên hosting — **hoãn** đến khi PO quyết định (Q1) | Claude Code · Sonnet 5 | Website chạy HTTPS, có sao lưu DB + ảnh |

## Vướng mắc / chờ PO quyết định
- **Q1** (hoãn) Hosting thật — chỉ cần khi PO muốn deploy; hiện chỉ chạy local, không chặn việc #2–#3.
- (Q2 avatar, Q3 SĐT: đã bỏ — là nội dung sửa được trong CMS, xem DECISIONS D9.)

## Rủi ro đang theo dõi
- Tailwind + font đang tải từ máy chủ bên ngoài (CDN) — mất mạng là mất giao diện; nên xong việc #2 trước khi deploy.
- Chưa có quy trình sao lưu DB + ảnh upload (cần trước deploy).
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
