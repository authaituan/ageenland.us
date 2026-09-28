# GreenLand – Website cảnh quan + CMS quản trị

- **Website**: React 19 + Vite. Toàn bộ nội dung lấy từ CMS qua `GET /api/site`. Nếu API lỗi, website dùng nội dung mặc định trong `shared/defaultContent.json`.
- **Backend**: Cloudflare Worker (Hono) + D1 (database SQLite) + R2 (ảnh tải lên), mã nguồn trong `worker/`.
- **CMS**: truy cập tại `/admin`. Đăng nhập bằng tài khoản admin, sửa được mọi chữ, ảnh, giá và danh sách hiển thị trên website.
- **Chạy thật**: `https://truelander.us` — mỗi lần `git push` lên `main`, Cloudflare tự build và deploy.

## Chạy lần đầu (máy local)

Cần Node ≥ 22.13.

```bash
npm install
npm run admin:create -- admin1 "Tên người quản trị 1"   # nhập mật khẩu (≥ 12 ký tự) khi được hỏi
```

## Chạy khi phát triển

```bash
npm run dev      # website → http://localhost:5455   ·   CMS → http://localhost:5455/admin   ·   API → /api
```

- Một cổng duy nhất `5455` cho cả website, CMS và API. Code backend chạy trên bản giả lập Cloudflare (workerd), giống hệt khi chạy thật.
- Trước khi chạy, lệnh tự áp migration và nạp nội dung mặc định còn thiếu vào database local.
- Database + ảnh local nằm trong `.wrangler/state/` (không commit). Dữ liệu local và dữ liệu thật trên Cloudflare là **hai nơi riêng**.
- Cổng bận → báo lỗi rõ ràng, không tự nhảy cổng. Đổi cổng (PowerShell): `$env:WEB_PORT=6465; npm run dev`.

## Các lệnh quản trị dữ liệu

Mặc định thao tác trên dữ liệu **local**. Thêm `--remote` để thao tác trên **Cloudflare (dữ liệu thật)**. Mọi lệnh `--remote` sẽ hỏi xác nhận.

| Lệnh | Việc |
|---|---|
| `npm run admin:create -- <user> ["Tên"] [--remote]` | Tạo tài khoản / đặt lại mật khẩu. Phiên đăng nhập cũ của tài khoản đó bị đăng xuất |
| `npm run admin:check -- <user> [--remote]` | Kiểm tra đăng nhập trực tiếp với database |
| `npm run content:reset [-- --remote] [--with-requests]` | Đặt lại nội dung về `shared/defaultContent.json` (tự sao lưu trước; `--with-requests` xoá luôn báo giá + liên hệ) |
| `npm run db:backup` | Sao lưu database **thật** → `server/backups/remote-<ngày>.sql` (`-- --local` cho bản local) |
| `npm run db:pull` | Chép database thật về local để thử (ghi đè local; không chép ảnh) |
| `npm run db:setup` | Áp migration + nạp nội dung mặc định còn thiếu (tự chạy trước `npm run dev`) |
| `npm run db:migrate:remote` | Áp migration lên database thật — chạy trước khi push code cần bảng/cột mới |

**Sao lưu:** D1 tự giữ lịch sử 7 ngày (Time Travel). Muốn giữ lâu hơn: `npm run db:backup` định kỳ.

## Đưa lên Cloudflare

Tự động: push lên `main` → Workers Builds chạy `npm run build`, rồi `npx wrangler deploy` (xem tiến trình: Workers & Pages → ageenland-us → Deployments).
Thủ công (máy đã `npx wrangler login`): `npm run deploy`.

Cấu hình ở `wrangler.jsonc`. Các bước thiết lập lần đầu và chuyển dữ liệu từ bản Express cũ: `docs/plans/PHASE_3_CLOUDFLARE.md` §7.

## Đổi cấu trúc database

Thêm file mới `migrations/000N_ten.sql` (không sửa file đã chạy). `npm run dev` tự áp ở local. Lên Cloudflare: chạy `npm run db:migrate:remote` **trước** khi push code dùng bảng/cột mới (deploy tự động không chạy migration).
Lưu ý: Rollback trên dashboard chỉ lùi code, không lùi database — chỉ thêm bảng/cột, và chạy `npm run db:backup` trước thay đổi lớn.

## Quên mật khẩu

`npm run admin:create -- <username> --remote` (trên máy đã `npx wrangler login`).

## Cấu trúc

```
shared/defaultContent.json   Nội dung mặc định: dữ liệu seed cho DB, đồng thời là nội dung dự phòng của website
wrangler.jsonc               Cấu hình Cloudflare: Worker, D1, R2, số vòng băm mật khẩu
migrations/                  Schema database (D1)
worker/index.js              Điểm vào Worker: /api/*, /uploads/*
worker/db.js                 Kết nối D1 (run / get / all / batch)
worker/content.js            Mô hình nội dung, tính giá phía server
worker/auth.js               Đăng nhập, phiên, chống CSRF, giới hạn đăng nhập sai
worker/password.js           Băm mật khẩu PBKDF2 (dùng chung cho Worker và script)
worker/routes/public.js      /api/site, /api/quotes, /api/contact, /api/leads
worker/routes/admin.js       /api/admin/* (bắt buộc đăng nhập), upload ảnh lên R2
scripts/cf/                  Lệnh quản trị dữ liệu (admin, sao lưu, nạp dữ liệu)
src/site/SiteContext.jsx     Nạp nội dung CMS cho website
src/site/forms.js            Logic form Hero / báo giá / liên hệ (mọi theme dùng chung)
src/App.jsx                  Chọn giao diện theo CMS → Theme (xem trước: /?theme=light)
src/themes/classic/          Giao diện Classic (nền xanh đậm)
src/themes/light/            Giao diện Light (nền sáng)
shared/themes.json           Danh sách theme
src/admin/                   Giao diện CMS
scripts/check-cms-schema.mjs Kiểm tra mọi nội dung đều có ô sửa trong CMS
```

Khi thêm một trường nội dung mới vào `shared/defaultContent.json`, cần thêm ô sửa tương ứng trong `src/admin/schema.js`. Sau đó chạy `node scripts/check-cms-schema.mjs` để kiểm tra.
