# TASK-LIGHT-THEME — Chỉnh thẩm mỹ theme Light (giao Antigravity)

## Bối cảnh (đọc xong mục này là đủ, KHÔNG quét repo)
- Website có 2 giao diện chọn trong CMS → Theme: `classic` (nền xanh đậm) và `light` (nền sáng). Bản Light đã chạy được đầy đủ; việc này chỉ là **làm đẹp**.
- Xem Light khi chạy dev: `npm run dev:all` → `http://localhost:5455/?theme=light` (không cần đổi CMS).
- Nguồn cảm hứng bố cục: https://landscape-128.webflow.io/ — template **có bản quyền**: chỉ tham khảo cách bố trí chung (khoảng trắng rộng, ảnh bo góc lớn, khối chữ–ảnh xen kẽ, số thứ tự 01/02/03, footer nhiều cột). **Không** chép chữ, ảnh, logo, icon, màu nhận diện hay mã của họ.

## Phạm vi — CHỈ được sửa
`src/themes/light/*` (LightApp.jsx, Navbar, Hero, Services, About, Calculator, Portfolio, Testimonials, Contact, Footer, ui.jsx, light.css). Được thêm file mới trong thư mục này.

## Cấm
- Sửa bất kỳ file nào ngoài `src/themes/light/` (kể cả `src/index.css`, `tailwind.config.js`, `src/themes/classic/*`, `src/site/*`, `shared/*`, `server/*`, `package.json`).
- Đổi tên trường nội dung (`settings.xxx.yyy`) hoặc viết chữ cố định lên giao diện — mọi chữ/ảnh phải lấy từ `useSite()`.
- Tự gửi form / tự tính giá: phải dùng `useLeadForm`, `useQuoteForm`, `useContactForm` từ `src/site/forms.js`.
- Xóa hoặc đổi các `id` section: `about`, `services`, `calculator`, `portfolio`, `testimonials`, `contact`.
- Thêm thư viện, font, ảnh mới vào repo.

## Lưu ý kỹ thuật (đã gặp)
- `.container` (index.css) có `padding: 0 1.5rem` và thắng `pt-/pb-/py-` → đặt khoảng cách dọc ở phần tử bao ngoài.
- `.lt-btn` có `display: inline-flex` và thắng `hidden` → muốn ẩn theo màn hình thì bọc nút trong thẻ khác.
- Bảng màu ghi ở đầu `ui.jsx` và `light.css`.

## Việc cần làm
1. Rà từng section ở 1440px và 390px, chỉnh khoảng cách, cỡ chữ, bo góc, hiệu ứng hover cho đồng đều và sang hơn.
2. Hero: cân lại tỉ lệ ảnh/chữ trên desktop; mobile không để tiêu đề quá dài.
3. Thêm hiệu ứng nhẹ khi cuộn (chỉ CSS, tôn trọng `prefers-reduced-motion`).

## Tiêu chí xong
- `npm run build` và `npm run test:e2e` đều pass.
- `git diff --stat` chỉ có file trong `src/themes/light/`.
- Gửi PO 2 ảnh chụp toàn trang (1440px, 390px) của `/?theme=light`, và xác nhận `/` (Classic) không đổi.
- KHÔNG tự cập nhật STATUS/SNAP — Claude Code sẽ review và cập nhật.
