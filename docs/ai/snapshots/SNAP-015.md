# SNAP-015 — Logo mới + tên miền chính agreenland.us
- Ngày: 2026-09-29 · Người làm: Claude (code, xử lý ảnh) + PO (dashboard) · Commit: (ghi ở lần commit kế tiếp)
- Logo: ảnh PO gửi → tách nền đen, ghép biểu tượng chữ A + chữ GreenLand thành 1 ảnh ngang `public/images/brand/logo.png` (theo mẫu PO, bỏ dòng "Landscaping & gardens"); favicon 64 px + apple-touch-icon 180 px từ biểu tượng A. Trường CMS mới `brand.logo_image`: có ảnh → chỉ hiện ảnh (tên chữ + dòng phụ ẩn, tên dùng làm alt); trống → lá + chữ như cũ (D34). Sửa: Navbar/Footer Classic, `Logo` trong Light `ui.jsx`, `schema.js`, `defaultContent.json`, `index.html`.
- Tên miền: `agreenland.us` gắn vào Worker (gỡ Worker cũ `dawn-lab-f49a`), `www` chuyển 301; `truelander.us` vẫn chạy (D35).
- Kiểm tra: lint 0 lỗi (8 cảnh báo cũ) ✅ · build ✅ · check-cms-schema 158 + 4 ✅ · E2E 4/4 ✅ · ảnh chụp 2 theme (desktop 1440, mobile 390, menu trong suốt / khi cuộn, footer) ✅
- Dữ liệu thật: không cần sửa — `brand.logo_image` chưa có trong DB nên tự lấy giá trị mặc định.
