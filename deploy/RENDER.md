# Đưa GreenLand lên Render.com (liên kết GitHub)

Render lấy code thẳng từ GitHub `authaituan/ageenland.us`, tự build và chạy. Mỗi lần `git push` lên `main`, Render tự cập nhật website.

## Chọn gói trước khi làm

| | **Free** (demo) | **Trả phí** (giữ dữ liệu) |
|---|---|---|
| Giá (theo render.com/pricing, 09/2026) | 0đ | máy chủ $7/tháng + ổ đĩa $0.25/GB/tháng |
| Ngủ khi không ai truy cập | Có — sau 15 phút, lần mở đầu tiên chờ ~1 phút | Không |
| Dữ liệu (sửa CMS, ảnh tải lên, báo giá, liên hệ) | **Mất** mỗi lần deploy, khởi động lại hoặc ngủ dậy | Giữ nguyên (ổ đĩa riêng) |
| Nội dung hiển thị | Lấy từ `shared/defaultContent.json` trong GitHub | Như Free lúc đầu, sau đó theo CMS |

→ **Free phù hợp để demo cho người xem.** Muốn đổi nội dung trên bản Free: sửa trong CMS **ở máy local**, chạy `npm run content:export`, rồi push (xem Bước 1). Không dùng bản Free để nhận báo giá thật của khách — dữ liệu sẽ mất.

---

## Bước 1 — Chuẩn bị trên máy (PowerShell, thư mục dự án)

```powershell
cd D:\Dev\agreenland_clone
npm run content:export     # đưa nội dung CMS hiện tại + ảnh đã tải lên vào code (shared/, public/images/cms/)
git add -A
git commit -m "Chuẩn bị deploy Render"
git push
```

Mở GitHub kiểm tra: có thư mục `public/images/cms/` và file `shared/defaultContent.json` mới.

## Bước 2 — Tạo tài khoản Render và nối GitHub

1. Vào **https://render.com** → **Get Started** → **GitHub** để đăng nhập bằng tài khoản GitHub `authaituan`.
2. Khi GitHub hỏi quyền cho Render: chọn **Only select repositories** → chọn **ageenland.us** → **Install & Authorize**.

## Bước 3 — Tạo Web Service

Trên Dashboard Render: **+ New** → **Web Service** → chọn repo **authaituan / ageenland.us** → **Connect**. Điền:

| Ô | Giá trị |
|---|---|
| Name | `greenland-demo` (thành địa chỉ `https://greenland-demo.onrender.com`) |
| Region | **Singapore** (gần Việt Nam) — hoặc **Ohio/Virginia** nếu khách chủ yếu ở Mỹ |
| Branch | `main` |
| Root Directory | *(để trống)* |
| Runtime / Language | **Node** |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Instance Type | **Free** (hoặc Starter nếu chọn gói trả phí) |

## Bước 4 — Biến môi trường (mục **Environment Variables**, bấm *Add Environment Variable*)

| Key | Value | Ghi chú |
|---|---|---|
| `GREENLAND_PORT` | `10000` | Cổng Render dùng |
| `GREENLAND_ADMIN_USER` | `admin` | Tên đăng nhập CMS trên Render |
| `GREENLAND_ADMIN_PASSWORD` | *(mật khẩu mạnh, ≥ 8 ký tự)* | Chỉ lưu trên Render, không đưa vào GitHub |
| `COOKIE_SECURE` | `1` | Render có sẵn HTTPS |
| `TRUST_PROXY` | `1` | Render đứng trước ứng dụng như một proxy |

**Không** thêm `NODE_ENV=production` — nếu thêm, bước build sẽ bỏ qua công cụ build (Vite) và báo lỗi. Lệnh `npm start` đã tự chạy chế độ production.

(Tuỳ chọn) Mục **Advanced → Health Check Path**: `/api/site`.

Bấm **Create Web Service** (hoặc **Deploy Web Service**).

## Bước 5 — Theo dõi và kiểm tra

1. Trang **Logs** chạy build (~2–4 phút). Thành công khi thấy:
   ```
   Đã tạo tài khoản admin "admin" từ biến môi trường.
   GreenLand backend: http://localhost:10000 (production)
   ==> Your service is live 🎉
   ```
2. Mở `https://greenland-demo.onrender.com` → trang chủ.
3. Mở `https://greenland-demo.onrender.com/admin` → đăng nhập bằng `GREENLAND_ADMIN_USER` / `GREENLAND_ADMIN_PASSWORD`.

## Cập nhật về sau

Sửa code hoặc nội dung ở máy local → (nếu sửa nội dung CMS: `npm run content:export`) → `git push`. Render tự deploy lại trong vài phút (tab **Events** để theo dõi).

## Nâng lên gói trả phí để giữ dữ liệu

1. **Settings → Instance Type** → chọn gói trả phí thấp nhất.
2. **Disks → Add Disk**: Name `data`, Mount Path `/var/data`, Size `1` GB → Save.
3. **Environment** thêm: `DB_PATH` = `/var/data/database.sqlite`, `UPLOAD_DIR` = `/var/data/uploads` → Save (Render tự deploy lại).
4. Từ đây sửa CMS, ảnh tải lên, báo giá, liên hệ trên Render đều được giữ lại. Nhớ vẫn sao lưu định kỳ (xem mục Sao lưu trong tab **Disks** của Render).

## Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Build lỗi `vite: not found` | Xoá biến `NODE_ENV` trong Environment |
| Deploy treo "No open ports detected" | Kiểm tra `GREENLAND_PORT` = `10000` |
| Đăng nhập CMS báo sai | Kiểm tra lại 2 biến `GREENLAND_ADMIN_*`; đổi xong bấm **Manual Deploy → Deploy latest commit** |
| Sửa CMS xong một lúc sau mất | Gói Free xoá dữ liệu khi ngủ — dùng `content:export` + push, hoặc nâng gói |
| Lần mở đầu rất chậm | Gói Free đang "ngủ", chờ ~1 phút |
