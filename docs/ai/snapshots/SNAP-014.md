# SNAP-014 — Lên Cloudflare: truelander.us chạy thật (PHASE_3 C8)
- Ngày: 2026-09-28 · Người làm: PO (dashboard + lệnh) + Claude (hướng dẫn, kiểm tra) · Commit: (ghi ở lần commit kế tiếp)
- Đã làm: bật R2; merge `snap-013-cloudflare`; `cf:import --remote` + đặt lại mật khẩu 2 admin; Workers Builds `ageenland-us` (build `npm run build`, deploy `npx wrangler deploy`, tắt Preview builds); Custom domain `truelander.us`; `www` = DNS proxied + Redirect Rule 301.
- Đổi so với kế hoạch: deploy không chạy migration (D33); `www` không gắn vào Worker (D32).
- Kiểm tra (Claude, từ ngoài): `/api/site` trả nội dung thật (theme classic, 6 dịch vụ, khớp dữ liệu cũ) ✅ · `/api/admin/me` chưa đăng nhập → 401 ✅ · `www` mở được ✅. PO: đăng nhập CMS, sửa, upload ✅.
- Đo thật (Metrics, 24h, 44 request gồm đăng nhập, sửa CMS, upload): CPU time 3 ms, 0 lỗi (không request nào vượt 10 ms) ✅ · tự deploy khi push `main` ✅ (bản 3239c42e).
- Còn lại: tắt Render (D30).
