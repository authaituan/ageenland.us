# STATUS — Trạng thái hiện tại
> Giới hạn: ≤ 40 dòng. Ghi đè nội dung cũ, lịch sử đã nằm trong `snapshots/`.

| Mục | Giá trị |
|---|---|
| **Snapshot hiện tại** | `SNAP-003` — Nghiệm thu Phase CMS xong (S10) · 2026-09-24 |
| **Phase** | Phase 1 – Admin CMS ([kế hoạch](../ADMIN_CMS_PLAN.md)) — code + nghiệm thu đạt, **chờ deploy** |
| **Sức khỏe** | 🟢 Checklist §9 đạt 7/7 · `npm run test:e2e` đạt 3/3 |

## Việc tiếp theo (theo thứ tự ưu tiên)
| # | Việc | Giao cho | Tiêu chí xong |
|---|---|---|---|
| 1 | PO chạy `npm run dev:all`, mở `http://localhost:5455/admin`, xác nhận đăng nhập được trên máy mình | PO | PO báo "đăng nhập OK" |
| 2 | Chuyển Tailwind từ CDN sang đóng gói trong build (bỏ `<script cdn.tailwindcss.com>` ở `index.html`) | Antigravity · Gemini 3.1 Pro | Ảnh chụp trước/sau giống nhau; `npm run test:e2e` đạt |
| 3 | Xác minh tồn đọng §8 kế hoạch (link `#about`, ký hiệu `$m^2$`, chính tả, ảnh PNG nặng) — mục nào còn thì sửa | Antigravity · Gemini 3.6 Flash | Mỗi mục: đã sửa / còn |
| 4 | Deploy lên hosting (sau khi có Q1) | Claude Code · Sonnet 5 | Website chạy HTTPS, có sao lưu DB + ảnh |

## Vướng mắc / chờ PO quyết định
- **Q1** Hosting thật (VPS / Render / …)? Ảnh upload cần ổ đĩa bền vững. → chặn việc #4.
- **Q2** Avatar khách hàng trong phần Đánh giá: ảnh thật hay chữ cái đầu tên?
- **Q3** SĐT hotline (khu Liên hệ) và SĐT Footer đang là 2 ô sửa riêng — gộp thành 1 hay giữ riêng?

## Rủi ro đang theo dõi
- Tailwind + font đang tải từ máy chủ bên ngoài (CDN) — không nên dùng khi chạy thật; phải xong việc #2 trước deploy.
- Chưa có quy trình sao lưu DB + ảnh upload.
- Lint còn 8 cảnh báo (không phải lỗi), chưa xử lý.
