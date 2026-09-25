# SNAP-012 — Theme Light v2 (premium)
- Ngày: 2026-09-25 · Người làm: Antigravity (giao diện) + Claude (review, sửa) · Commit: sẽ ghi ở commit sau (RULES §4.6)
- Kiểm tra: E2E 4/4 · lint 0 lỗi (8 cảnh báo cũ) · phạm vi chỉ `src/themes/light/` ✅ · không cuộn ngang ở 390px ✅ · mọi khối hiện đủ sau khi cuộn ✅

## Đã làm (theo `docs/ai/tasks/TASK-LIGHT-THEME.md` v2)
- Hero ảnh tràn màn hình, menu trong suốt → nền trắng khi cuộn, form đặt lịch nổi đè mép Hero.
- Tiêu đề DM Sans 800 + từ nhấn DM Serif nghiêng; màu nhấn vàng #E5A93B.
- Thêm `IntroBento.jsx` (giới thiệu + lưới ảnh từ ảnh CMS), dải xanh đậm "Về chúng tôi", số thứ tự vòng tròn vàng, `useReveal.js` (hiện dần khi cuộn, tắt khi giảm chuyển động).

## Claude review sửa
- `useReveal`: effect phụ thuộc object mới mỗi lần render → khởi tạo lại observer liên tục; đổi thành chạy 1 lần.
- `About.jsx`: bỏ tiêu đề trùng với khối giới thiệu (cùng `about.title`), phóng to đoạn `paragraph2`.
- Ghi chú: ảnh chụp toàn trang không cuộn sẽ thấy khoảng trắng — do hiệu ứng chỉ chạy khi cuộn tới, không phải lỗi.
