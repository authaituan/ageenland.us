# SNAP-013 — Chuyển backend sang Cloudflare Worker + D1 + R2 (PHASE_3 C1–C7)
- Ngày: 2026-09-28 · Người làm: Claude (Opus 5.5) · Nhánh: `snap-013-cloudflare` · Commit: (ghi ở lần commit kế tiếp)
- Đã làm: `server/*.cjs` (Express + sqlite3 + multer) → `worker/` (Hono) + `migrations/0001_init.sql` (D1) + upload R2; `wrangler.jsonc`; `vite.config.js` dùng `@cloudflare/vite-plugin` (1 cổng 5455); lệnh dữ liệu `scripts/cf/*`; E2E chạy trên Worker giả lập (`tests/e2e/server.mjs`); xoá `deploy/`, `scripts/dev-all.cjs`, `content:export`.
- Mật khẩu: PBKDF2 20000 vòng (≈ 3 ms), ≥ 12 ký tự (D31) — sửa 1 dòng `src/admin/pages.jsx:381` (nhắc 12 ký tự). `src/` khác không đổi.
- Kiểm tra: lint 0 lỗi (8 cảnh báo cũ) ✅ · build ✅ · check-cms-schema 157 + 4 ✅ · E2E 4/4 ✅ · `wrangler deploy --dry-run` ✅ (97 KiB)
- So khớp: nạp dữ liệu thật (`cf:export-sqlite` → `cf:import`) vào local → 11 API (`/api/site` + 10 API admin) trả JSON **giống hệt** bản Express. 401/415/429/404, JSON lỗi 400, giá server tính, upload chặn file sai loại/> 5 MB ✅
- Còn lại: C8 (PO bật R2, nối Workers Builds, nạp dữ liệu remote, đặt lại mật khẩu 2 admin, gắn tên miền, đo CPU đăng nhập) · C9 nghiệm thu PHASE_3 §10.
