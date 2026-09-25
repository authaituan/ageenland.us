# DECISIONS — Quyết định đã chốt (không lật lại nếu PO chưa đồng ý)
| # | Ngày | Quyết định | Lý do / nguồn |
|---|---|---|---|
| D1 | 2026-09-23 | Mỗi dịch vụ 1 bản ghi; nhãn ở từng vị trí (Hero, Calculator, Footer) là trường riêng | ADMIN_CMS_PLAN §2.2 |
| D2 | 2026-09-23 | Giữ stack React 19 + Vite, Express 5 + SQLite; không thêm router/auth library | ADMIN_CMS_PLAN §3 |
| D3 | 2026-09-23 | Nội dung mặc định và dữ liệu seed chung 1 file `shared/defaultContent.json` | README |
| D4 | 2026-09-23 | 2 tài khoản admin cùng quyền, mật khẩu nhập ở terminal, không lưu trong repo | ADMIN_CMS_PLAN §3 |
| D5 | 2026-09-23 | Cổng cố định 5454 (API) / 5455 (web), báo lỗi khi trùng thay vì tự đổi | README |
| D6 | 2026-09-23 | Giá báo giá do server tính lại, không tin số từ trình duyệt | ADMIN_CMS_PLAN §3 |
| D7 | 2026-09-23 | Bộ tài liệu AI: `README_AI.md` là cổng chào, `docs/ai/STATUS.md` là nguồn sự thật | Thiết lập workflow |
| D8 | 2026-09-24 | Dùng Playwright cho kiểm thử E2E (`tests/e2e/`, DB tạm, chạy bản build) | SNAP-003 |
| D9 | 2026-09-24 | Nội dung sửa được trong CMS (avatar đánh giá, SĐT hotline/Footer, chữ, ảnh, giá…) KHÔNG đưa vào "Vướng mắc / chờ PO quyết định"; chỉ hỏi PO việc bắt buộc phải đổi code | PO |
| D10 | 2026-09-24 | Chỉ phát triển trên máy local, chưa deploy; hosting (Q1) hoãn. Chạy thật local: `npm run build` + `npm start`, admin tại `http://localhost:5454/admin` | PO |
| D11 | 2026-09-24 | Tailwind v3 đóng gói qua PostCSS, bỏ CDN | PO request / STATUS việc #2 |
| D12 | 2026-09-24 | Mục "Về chúng tôi" là section CMS `about`, dùng lại ảnh có sẵn (không thêm ảnh mới) | STATUS việc #1 |
| D13 | 2026-09-24 | Website + CMS chỉ tiếng Anh (không song ngữ); giá USD theo sq ft; định dạng tiền theo `site.locale` + `site.currency_code` trong CMS | PO · SNAP-008 |
| D14 | 2026-09-24 | Giữ tên trường `pricePerM2`/`price_per_m2` (nay là giá/đơn vị diện tích bất kỳ, hiện là sq ft) để không phải migrate DB; giá cho phép số lẻ, làm tròn đến cent | SNAP-008 |
| D15 | 2026-09-24 | Font: DM Sans (chữ thường) + DM Serif Display (tiêu đề, chỉ 1 độ đậm, tắt đậm giả) | PO · SNAP-008 |
| D16 | 2026-09-24 | Menu, footer, nút dùng kiểu chữ sentence case (chỉ viết hoa chữ đầu) | PO · SNAP-008 |
| D17 | 2026-09-24 | Ảnh nền Hero giữ màu thật + 1 lớp phủ xanh đậm dần sang trái; độ đậm (`overlay_strength`) và điểm lấy nét (`background_position`) chỉnh trong CMS | PO · SNAP-009 |
| D18 | 2026-09-25 | Cổng backend đọc biến riêng `GREENLAND_PORT`, không đọc `PORT` chung (tránh bị biến môi trường của dự án khác ghi đè) | SNAP-009 |
| D19 | 2026-09-25 | Deploy: code ở `/opt/greenland`, dữ liệu ở `/var/lib/greenland` (DB_PATH, UPLOAD_DIR), chạy bằng PM2 sau nginx, 1 tiến trình (SQLite) | SNAP-010 |
| D20 | 2026-09-25 | Demo trên Render Free: nội dung lấy từ `shared/defaultContent.json` (cập nhật bằng `npm run content:export`), admin tạo từ biến môi trường; muốn giữ dữ liệu phải dùng gói trả phí + Disk | PO · SNAP-010 |
| D21 | 2026-09-25 | Ghim `sqlite3` 5.1.7 (bản dựng sẵn tương thích glibc cũ của Render); cân nhắc nâng lại khi Render dùng hệ điều hành mới hơn | SNAP-010 |
