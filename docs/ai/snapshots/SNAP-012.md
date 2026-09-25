# SNAP-012 — Theme Light v2 (premium)
- Ngày: 2026-09-25 · Người làm: Antigravity (giao diện) + Claude (review, sửa) · Commit: `824d4da`
- Kiểm tra: E2E 4/4 · lint 0 lỗi (8 cảnh báo cũ) · phạm vi chỉ `src/themes/light/` ✅ · không cuộn ngang ở 390px ✅ · mọi khối hiện đủ sau khi cuộn ✅

## Đã làm (theo `docs/ai/tasks/TASK-LIGHT-THEME.md` v2)
- Hero ảnh tràn màn hình, menu trong suốt → nền trắng khi cuộn, form đặt lịch nổi đè mép Hero.
- Tiêu đề DM Sans 800 + từ nhấn DM Serif nghiêng; màu nhấn vàng #E5A93B.
- Thêm `IntroBento.jsx` (giới thiệu + lưới ảnh từ ảnh CMS), dải xanh đậm "Về chúng tôi", số thứ tự vòng tròn vàng, `useReveal.js` (hiện dần khi cuộn, tắt khi giảm chuyển động).

## Claude review sửa
- `useReveal`: effect phụ thuộc object mới mỗi lần render → khởi tạo lại observer liên tục; đổi thành chạy 1 lần.
- `About.jsx`: bỏ tiêu đề trùng với khối giới thiệu (cùng `about.title`), phóng to đoạn `paragraph2`.
- Ghi chú: ảnh chụp toàn trang không cuộn sẽ thấy khoảng trắng — do hiệu ứng chỉ chạy khi cuộn tới, không phải lỗi.

## Sửa sau khi lên Render (kiểm tra trên màn hình 1366×641)
- Hero: nhãn đầu Hero bị menu che — `pt-32` đặt chung với `.container` nên bị `padding: 0 1.5rem` ghi đè. Form nổi không đè lên Hero vì `-mt-*` bị `margin: 0 auto` ghi đè. Tương tự `About.jsx` (`pt-16`). → chuyển khoảng cách dọc ra thẻ bao ngoài; ghi chú thêm trong `light.css`.
