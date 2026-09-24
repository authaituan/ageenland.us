# GreenLand – Website cảnh quan + CMS quản trị

- **Website**: React 19 + Vite. Toàn bộ nội dung lấy từ CMS qua `GET /api/site`. Nếu API lỗi, website dùng nội dung mặc định trong `shared/defaultContent.json`.
- **Backend**: Express 5 + SQLite, file chạy là `server/index.cjs`.
- **CMS**: truy cập tại `/admin`. Đăng nhập bằng tài khoản admin, sửa được mọi chữ, ảnh, giá và danh sách hiển thị trên website.

## Chạy lần đầu (máy local)

```bash
npm install
npm run admin:create -- admin1 "Tên người quản trị 1"   # nhập mật khẩu khi được hỏi
npm run admin:create -- admin2 "Tên người quản trị 2"
```

## Chạy khi phát triển

Cách gọn nhất là 1 cửa sổ terminal chạy cả backend lẫn website (Ctrl+C để tắt cả hai):

```bash
npm run dev:all
```

Hoặc tách ra 2 cửa sổ:

```bash
npm run server   # backend  → http://localhost:5454
npm run dev      # website  → http://localhost:5455   ·   CMS → http://localhost:5455/admin
```

### Chạy song song với dự án khác

Dự án này dùng cổng **5454** (backend) và **5455** (website), nên không đụng dự án chạy ở 3000/5000/5173. Nếu vẫn bị trùng, đổi cổng khi chạy (PowerShell):

```powershell
$env:API_PORT=6464; $env:PORT=6464; $env:WEB_PORT=6465; npm run dev:all
```

Khi cổng đang bận, chương trình sẽ báo lỗi rõ ràng chứ không tự nhảy sang cổng khác. Nhờ vậy website không vô tình gọi nhầm API của dự án khác.

## Chạy như môi trường thật (production)

```bash
npm run build
npm start        # website + CMS + API cùng cổng 5454 → http://localhost:5454
```

## Biến môi trường (tùy chọn, dùng khi deploy Linux)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `5454` | Cổng backend |
| `API_PORT` | `5454` | Cổng backend mà website dev (Vite) chuyển `/api` tới |
| `WEB_PORT` | `5455` | Cổng website khi `npm run dev` |
| `DB_PATH` | `server/database.sqlite` | File database |
| `UPLOAD_DIR` | `server/uploads` | Thư mục lưu ảnh tải lên |
| `COOKIE_SECURE` | (trống) | Đặt `1` khi chạy HTTPS |
| `TRUST_PROXY` | (trống) | Đặt `1` khi chạy sau nginx |
| `ADMIN_PASSWORD` | (trống) | Chỉ dùng cho `admin:create` khi chạy bằng script |

**Sao lưu:** cần sao lưu định kỳ 2 thứ: file `DB_PATH` và thư mục `UPLOAD_DIR`.

## Đặt lại nội dung website về mặc định

```bash
npm run content:reset                    # thay toàn bộ nội dung CMS bằng shared/defaultContent.json, giữ báo giá + liên hệ
npm run content:reset -- --with-requests # xóa luôn báo giá + liên hệ (dữ liệu thử)
```

Lệnh luôn sao lưu database vào `server/backups/` trước khi làm. Tài khoản admin được giữ nguyên.

## Quên mật khẩu

Chạy lại lệnh `npm run admin:create -- <username>` để đặt mật khẩu mới. Mọi phiên đăng nhập cũ của tài khoản đó sẽ bị đăng xuất.

## Cấu trúc

```
shared/defaultContent.json   Nội dung mặc định: dữ liệu seed ban đầu cho DB, đồng thời là nội dung dự phòng của website
server/index.cjs             Khởi động server
server/db.cjs                Schema, migration, seed
server/content.cjs           Mô hình nội dung, tính giá phía server
server/auth.cjs              Đăng nhập, phiên, chống CSRF
server/routes/public.cjs     /api/site, /api/quotes, /api/contact, /api/leads
server/routes/admin.cjs      /api/admin/* (bắt buộc đăng nhập)
src/site/SiteContext.jsx     Nạp nội dung CMS cho website
src/admin/                   Giao diện CMS
scripts/check-cms-schema.mjs Kiểm tra mọi nội dung đều có ô sửa trong CMS
```

Khi thêm một trường nội dung mới vào `shared/defaultContent.json`, cần thêm ô sửa tương ứng trong `src/admin/schema.js`. Sau đó chạy `node scripts/check-cms-schema.mjs` để kiểm tra.
