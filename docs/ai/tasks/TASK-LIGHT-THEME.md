# TASK-LIGHT-THEME (v2) — Nâng theme Light lên mức "premium" (giao Antigravity)

## Bối cảnh (đọc xong file này là đủ, KHÔNG quét repo)
- Website có 2 giao diện chọn trong CMS → Theme: `classic` và `light`. Light đã chạy đầy đủ (nội dung, form, báo giá); việc này là **nâng cấp thẩm mỹ** theo spec bên dưới.
- Chạy: `npm run dev:all` → xem `http://localhost:5455/?theme=light` (không cần đổi CMS). Classic: `http://localhost:5455/`.
- Tham khảo cảm giác: https://landscape-128.webflow.io/ — template **có bản quyền**. Chỉ học *nguyên tắc* (ảnh tràn màn hình, tiêu đề đậm cỡ lớn, nhiều khoảng trắng, thẻ đổ bóng mềm, số thứ tự trong vòng tròn màu nhấn, dải màu đậm xen kẽ, hiệu ứng hiện dần khi cuộn). **Không** chép chữ, ảnh, logo, icon, mã, và không dùng lại màu teal/vàng của họ — dùng bảng màu GreenLand bên dưới.

## Vì sao bản hiện tại "chưa xuất sắc" (CTO đã so sánh)
1. Hero chia đôi chữ–ảnh, ảnh nằm trong khung → thiếu cảm giác "wow". Bản tham khảo dùng ảnh tràn toàn màn hình, tiêu đề trắng rất lớn.
2. Tiêu đề dùng DM Serif mảnh → thiếu lực. Cần tiêu đề sans đậm, cỡ lớn, khoảng cách chữ khít.
3. Thiếu 1 màu nhấn ấm → mọi thứ cùng tông xanh, phẳng.
4. Các section có nhịp giống nhau (nền trắng/kem xen kẽ) → cần 1–2 dải màu đậm tạo nhịp, ảnh chồng lên mép dải.
5. Không có chuyển động khi cuộn.

## Bảng màu & chữ (chỉ khai báo trong `light.css` / `ui.jsx`)
| Vai trò | Giá trị |
|---|---|
| Nền chính | `#FFFFFF` · nền phụ `#F4F6F0` |
| Chữ | `#16241B` · chữ phụ `#5B6B60` · viền `#E6E8E0` |
| Xanh thương hiệu | `#183B29` (dải đậm, footer, nút chính) · `#2E6A45` (chữ nhấn) |
| **Màu nhấn ấm (mới)** | `#E5A93B` (vàng hổ phách GreenLand – đã có trong `--gold-accent`) · hover `#D39527` |
| Bóng thẻ | `0 12px 40px rgba(24, 59, 41, 0.08)` |

- Tiêu đề (h1–h3) trong theme Light: **DM Sans 800**, `letter-spacing: -0.02em`, `line-height: 1.05` (đã tải sẵn DM Sans 300–800, không cần font mới). Ghi đè trong `light.css` bằng selector `body[data-theme="light"] h1, … h3`.
- Từ nhấn trong tiêu đề (`title_highlight`): **DM Serif Display italic**, màu `#2E6A45` (trên nền đậm hoặc trên ảnh: `#E5A93B`). Đây là "chữ ký" riêng của GreenLand.
- Cỡ chữ: h1 `clamp(2.75rem, 6vw, 5.75rem)` · h2 `clamp(2rem, 4vw, 3.25rem)` · h3 `1.5rem` · đoạn văn 17px, line-height 1.7.
- Khoảng cách section: `py-24 lg:py-32`. Bo góc: thẻ 20px, ảnh lớn 24px, nút tròn hẳn.

## Việc cần làm (theo thứ tự ưu tiên)
1. **Navbar**: trong suốt, chữ trắng khi nằm trên Hero; cuộn quá 40px → nền trắng, chữ tối, có bóng nhẹ (chuyển mượt 300ms). Menu chữ 14px, `tracking-wide`. Nút CTA màu vàng `#E5A93B`, chữ `#16241B`. Mobile: nút burger trắng trên Hero.
2. **Hero tràn màn hình**: `min-h-[100svh]`, ảnh nền `h.background_image` + `h.background_position`; lớp phủ gradient tối từ dưới-trái, độ đậm theo `h.overlay_strength` (0–100, giống Classic) để chữ trắng luôn đọc rõ (tương phản ≥ 4.5:1). Chữ trắng căn trái-dưới: badge, h1 lớn, mô tả, 2 nút (chính: vàng; phụ: viền trắng), dãy `value_props`, dãy `stats` chữ trắng. **Form đặt lịch nhanh**: thẻ trắng nổi đè lên mép dưới Hero (desktop kéo lên ~50% chiều cao thẻ), mobile nằm ngay dưới Hero.
3. **Đoạn giới thiệu + lưới ảnh (bento)** ngay sau Hero: tiêu đề `about.title` + `about.title_highlight` căn giữa, `about.paragraph1` căn giữa (max-w 3xl). Bên dưới là lưới ảnh 2 hàng kích thước xen kẽ (vd. hàng 1: 2/4 + 1/4 + 1/4; hàng 2: 1/4 + 1/4 + 2/4), ghép từ ảnh **đã có trong CMS**, bỏ ảnh trùng: `about.image`, `portfolio.after_image`, `projects[].image`, `services[].image`, `hero.background_image`. Đủ bao nhiêu ảnh thì hiện bấy nhiêu (tối thiểu 3). Hover: ảnh phóng nhẹ 1.05.
4. **Dịch vụ**: thẻ trắng, không viền, đổ bóng mềm; ảnh bo góc nằm trong thẻ (padding 12px); icon trong vòng tròn nền `#F4F6F0`; tiêu đề đậm; giá dạng pill nhỏ; nút cuối thẻ là link chữ gạch chân + mũi tên (`card_button`). Hover: thẻ nhấc lên 6px, bóng đậm hơn.
5. **Dải xanh đậm "Về chúng tôi"**: nền `#183B29` tràn ngang; ảnh `about.image` bo góc lớn **chồng ra ngoài mép trên/dưới** dải (desktop); bên phải chữ trắng: `about.badge`, `about.paragraph2`, `about.stats` (số màu vàng). Dưới dải: `about.highlights` thành lưới 3 cột, mỗi mục có **số trong vòng tròn vàng** (1, 2, 3…), chữ đậm. (Section này giữ `id="about"`; nếu tách đoạn giới thiệu ở mục 3 ra riêng thì đoạn đó không mang id.)
6. **Báo giá**: nền `#F4F6F0`; 2 thẻ trắng đổ bóng; nút chọn dịch vụ/tần suất đang chọn: nền `#183B29` chữ trắng; ô tổng tiền nền `#183B29`, số tiền màu vàng cỡ lớn.
7. **Dự án**: thanh trước/sau lớn bo 24px, tay kéo tròn màu vàng; thẻ dự án kiểu "hồ sơ": ảnh 4:3 bo 20px, tiêu đề đậm, `category` chữ phụ bên dưới.
8. **Đánh giá**: thẻ trắng đổ bóng, dấu ngoặc kép lớn màu vàng nhạt, sao màu vàng.
9. **Liên hệ**: giữ bố cục 2 cột; khối thông tin nền `#183B29` với icon vàng.
10. **Footer**: nền `#183B29` (hoặc đậm hơn `#12301F`), logo lớn, 4 cột, dòng cuối viền mảnh.
11. **Chuyển động**: tạo hook `useReveal` (IntersectionObserver) trong `src/themes/light/` — phần tử hiện dần + trượt lên 24px khi vào màn hình, thẻ trong lưới trễ lần lượt 80ms. Tắt hoàn toàn khi `prefers-reduced-motion: reduce`. Nội dung phải hiện đủ nếu JS/IntersectionObserver lỗi (mặc định hiện, chỉ ẩn khi hook đã chạy). Nút: nhấc 1–2px khi hover.

## Phạm vi — CHỈ được sửa / thêm
`src/themes/light/*` (được thêm file mới trong thư mục này, vd. `useReveal.js`).

## Cấm
- Sửa bất kỳ file nào ngoài `src/themes/light/` (kể cả `src/index.css`, `index.html`, `tailwind.config.js`, `src/themes/classic/*`, `src/site/*`, `shared/*`, `server/*`, `tests/*`, `package.json`).
- Viết chữ cố định lên giao diện — mọi chữ/ảnh lấy từ `useSite()` (tên trường giữ nguyên). Không thêm mục Team / Pricing / Blog (quyết định D23).
- Tự gửi form / tự tính giá: phải dùng `useLeadForm`, `useQuoteForm`, `useContactForm` (`src/site/forms.js`).
- Đổi/xóa `id` section: `about`, `services`, `calculator`, `portfolio`, `testimonials`, `contact`. Đổi thứ tự ô trong form Liên hệ (tên → điện thoại → email → nội dung) vì bài kiểm thử dựa vào đó.
- Thêm thư viện, font, ảnh mới.

## Lưu ý kỹ thuật (đã gặp)
- `.container` (index.css) có `padding: 0 1.5rem` và thắng `pt-/pb-/py-` → đặt khoảng cách dọc ở phần tử bao ngoài.
- `.lt-btn` có `display: inline-flex` và thắng `hidden` → muốn ẩn theo màn hình thì bọc nút trong thẻ khác.
- `index.css` đặt `h1,h2,h3 { font-family: serif; font-weight: 400 }` → phải ghi đè trong `light.css` với selector có `body[data-theme="light"]`.
- Navbar đè lên Hero: khi bấm menu, section không được bị navbar che (dùng `scroll-margin-top` cho section).

## Tiêu chí xong
- `npm run build` và `npm run test:e2e` đều pass.
- `git diff --stat` chỉ có file trong `src/themes/light/`.
- Không có thanh cuộn ngang ở 390px; chữ trên ảnh Hero đọc rõ với ảnh sáng lẫn tối.
- Gửi PO ảnh chụp toàn trang `/?theme=light` ở 1440px và 390px, và xác nhận `/` (Classic) không đổi.
- KHÔNG commit, KHÔNG sửa STATUS/SNAP — Claude Code sẽ review và cập nhật.
