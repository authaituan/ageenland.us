# RULES — Quy tắc cho Developer

## 1. Code
- Giữ stack hiện tại; thêm thư viện mới phải ghi vào DECISIONS.
- Không đổi layout/CSS nếu việc không yêu cầu. Nội dung hiển thị phải sửa được từ CMS (không viết cứng chữ vào JSX).
- Thêm trường nội dung → sửa đồng thời `shared/defaultContent.json` + `src/admin/schema.js`.
- Giá luôn do server tính; `/api/admin/*` luôn cần đăng nhập.
- Không commit: `server/database.sqlite`, `server/uploads/`, `.env`, mật khẩu, khóa bí mật.
- Viết chú thích theo phong cách file đang sửa (tiếng Việt, ngắn).

## 2. Chạy
`npm run dev:all` → web `:5455`, CMS `:5455/admin`, API `:5454`. Production: `npm run build && npm start` (`:5454`).

## 3. Kiểm tra trước khi báo xong
```
npm run lint
npm run build
node scripts/check-cms-schema.mjs
```
Ghi kết quả (pass/fail) vào snapshot. Lệnh nào không chạy được → ghi lý do, không được bỏ qua im lặng.

## 4. Cập nhật tài liệu (Definition of Done)
1. Tạo `docs/ai/snapshots/SNAP-<số kế tiếp>.md` theo mẫu `SNAP-002.md` (≤ 15 dòng).
2. Ghi đè `docs/ai/STATUS.md`: snapshot hiện tại, việc tiếp theo, vướng mắc (≤ 40 dòng).
3. Có quyết định kỹ thuật mới → thêm 1 dòng vào `DECISIONS.md`.
4. Thêm/đổi file quan trọng → sửa 1 dòng trong `CODEMAP.md`.
5. Commit: `SNAP-<số>: <tóm tắt>`.

## 5. Giữ tài liệu gọn (tiết kiệm token)
- Chỉ đường, không chép: ghi `file:dòng`, không dán code.
- Giới hạn: README_AI ≤ 80 dòng · STATUS ≤ 40 · snapshot ≤ 15 · mỗi dòng DECISIONS 1 câu.
- Nội dung lỗi thời → xóa (git giữ lịch sử). Khi `snapshots/` > 30 file → gộp cũ vào `snapshots/ARCHIVE.md` 1 dòng/snapshot.
