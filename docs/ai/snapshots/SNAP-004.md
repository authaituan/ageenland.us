# SNAP-004 — Đóng gói Tailwind v3 qua PostCSS, bỏ CDN
- Ngày: 2026-09-24 · Người làm: Antigravity (Gemini 3.6 Flash) · Commit: `292fe90`
- Lệnh RULES §3: lint ✅ 0 lỗi (8 cảnh báo) · build ✅ · check-cms-schema ✅ 143 trường + 4 danh sách
- Kiểm thử E2E: `npm run test:e2e` ✅ 3/3 passed (11.0s)

## Thay đổi chính
- Gỡ `@tailwindcss/vite` & `tailwindcss` v4, cài `tailwindcss@3` + `postcss` + `autoprefixer`.
- Tạo `tailwind.config.js` (chứa màu/font từ `index.html`) & `postcss.config.js`.
- Bỏ `<script cdn.tailwindcss.com>` ở `index.html`, import `@tailwind` directives trong `src/index.css`.
- Sửa thứ tự CSS (`@tailwind variants`) — kiểm tra computed style 785/785 phần tử khớp bản CDN.
- Quyết định mới: D11 (DECISIONS.md).
