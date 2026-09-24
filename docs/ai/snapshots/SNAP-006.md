# SNAP-006 — Thêm mục "Về chúng tôi" trên trang chủ
- Ngày: 2026-09-24 · Người làm: Claude Code (Sonnet 5) · Commit: sẽ ghi ở commit sau (RULES §4.6); SNAP-005 = `587e587`
- Lệnh RULES §3: lint ✅ 0 lỗi (8 cảnh báo) · build ✅ · check-cms-schema ✅ 152 trường + 4 danh sách
- Kiểm thử E2E: `npx playwright test -c tests/e2e` ✅ 3/3 (đã thêm bước Về chúng tôi)

## Đã làm
- Component mới `src/components/AboutSection.jsx` (`id="about"`, đặt giữa Hero và Dịch vụ, cùng phong cách các mục khác) → link `#about` ở Navbar cuộn đúng.
- Section CMS `about` (9 trường: nhãn, tiêu đề, 2 đoạn, điểm nổi bật, 3 số liệu, ảnh, alt) trong `shared/defaultContent.json` + `src/admin/schema.js`.
- Ảnh mặc định dùng lại `/images/landscape_design.png` (không đụng `public/images`).
- E2E: sửa tiêu đề trong CMS → hiện ở trang chủ; bấm menu → `#about` lên đầu khung nhìn.

## Lưu ý
- Chữ mặc định là nội dung mẫu tôi soạn (số liệu 8+/500+/24/7 là giả định) → PO cần sửa trong CMS `/admin/content/about`. DB đang chạy tự lấy mặc định cho section mới.
- `npm run build` từng báo "memory allocation failed" do máy gần cạn RAM ảo (không do code); chạy lại là đạt.
