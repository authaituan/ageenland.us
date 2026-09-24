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
