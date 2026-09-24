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
