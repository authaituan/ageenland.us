# PHASE 3 — Chuyển GreenLand lên Cloudflare (Worker + D1 + R2) · tên miền `truelander.us`

> Người lập: Claude (Dev B) · 2026-09-28 · Trạng thái: **PO đã duyệt 2026-09-28** (Q1 = b, Q2 = có, Q3 = có) · C0 xong (D1 tạo; R2 chờ PO bật) · C1–C7 xong (SNAP-013) · còn C8
> Bằng chứng: đã đọc `server/*.cjs`, `server/routes/*`, `server/scripts/*`, `src/lib/api.js`, `vite.config.js`, `tests/e2e/*`, `package.json`, `docs/ai/*`.
> Thông số Cloudflare lấy từ tài liệu chính thức (09/2026), link ở §12.

## 1. Mục tiêu và phạm vi
- **Mục tiêu:** website + CMS chạy 24/7 trên Cloudflare tại `https://truelander.us`. Mỗi lần `git push` lên `main`, Cloudflare tự build và deploy (Workers Builds nối với `authaituan/ageenland.us`).
- **Giữ nguyên:**
  - toàn bộ `src/` (2 theme, CMS, `src/lib/api.js` gọi `/api` cùng tên miền);
  - mô hình nội dung, cách tính giá, các lớp bảo mật (401 / 415 / 429, cookie HttpOnly);
  - dữ liệu hiện có: nội dung CMS, báo giá, liên hệ, 2 tài khoản admin (mật khẩu đặt lại theo D31), ảnh đã tải lên.
- **Ngoài phạm vi:** đổi giao diện, thêm tính năng, tối ưu ảnh, đổi thương hiệu, gỡ bỏ `agreenland.us`.

## 2. Hiện trạng: những chỗ không chạy được trên Worker
| # | Vị trí | Lý do | Thay bằng |
|---|---|---|---|
| H1 | `server/db.cjs:4,10`: gói `sqlite3`, file `database.sqlite` | Worker không có ổ đĩa, không chạy module native | D1 (SQLite, giữ nguyên câu SQL) |
| H2 | `server/db.cjs:29,140,181`: `migrate()` + `seed()` chạy khi server khởi động | Worker không có "lúc khởi động" | File migration `.sql` + lệnh seed |
| H3 | `server/routes/admin.cjs:172-189`: multer ghi ảnh ra `server/uploads/` | Không có ổ đĩa | R2 |
| H4 | `server/index.cjs:59`: Express `app.listen` | Worker chạy theo từng request | Hono |
| H5 | `server/auth.cjs:83-96`: đếm đăng nhập sai bằng `Map` trong RAM | Bộ nhớ không giữ giữa các lần chạy | Bảng `login_failures` trong D1 |
| H6 | `server/auth.cjs:7`: cookie `Secure` theo biến `COOKIE_SECURE` | — | Tự bật khi request là https |
| H7 | `server/routes/admin.cjs:20`: `req.ip` | Không có | Header `CF-Connecting-IP` |
| H8 | `server/scripts/*.cjs` mở thẳng file SQLite | Không có file | Gọi qua `wrangler d1 execute --local/--remote` |
| H10 | `server/auth.cjs:11,19`: scrypt (Workers có hỗ trợ) | Quá nặng so với 10 ms CPU của gói Free | PBKDF2 theo D31 |
| H9 | `tests/e2e/server.cjs`: chạy `server/index.cjs` với DB tạm | Server Node bị bỏ | Chạy bản build bằng wrangler với thư mục dữ liệu tạm |

**Không phải sửa:**
- `server/content.cjs`: chỉ gọi `run/get/all`.

## 3. Kiến trúc sau khi chuyển
```
truelander.us ──► Worker "ageenland-us"
                   ├─ /api/*, /uploads/*  → worker/index.js (Hono)
                   │     ├─ routes/public.js · routes/admin.js · auth.js · content.js
                   │     ├─ db.js  ──► D1 "greenland-db"      (binding DB)
                   │     └─ ảnh    ──► R2 "greenland-uploads" (binding UPLOADS)
                   └─ còn lại → dist/ (React build), không khớp file thì trả index.html (SPA, có /admin)
Local: `npm run dev` (Vite + @cloudflare/vite-plugin) chạy đúng Worker trên workerd, D1/R2 giả lập trong `.wrangler/state/`
```
Bản nháp `wrangler.jsonc`, sẽ chốt ở bước C2:
```jsonc
{
  "name": "ageenland-us",                 // phải trùng tên project Workers Builds PO đã tạo
  "main": "./worker/index.js",
  "compatibility_date": "2026-09-26",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "not_found_handling": "single-page-application", "run_worker_first": ["/api/*", "/uploads/*"] },
  "d1_databases": [{ "binding": "DB", "database_name": "greenland-db", "database_id": "<C0>", "migrations_dir": "migrations" }],
  "r2_buckets":   [{ "binding": "UPLOADS", "bucket_name": "greenland-uploads" }],
  "observability": { "enabled": true }
}
```

## 4. Quyết định kỹ thuật mới (ghi vào DECISIONS khi làm)
| # | Quyết định | Thay thế |
|---|---|---|
| D25 | Hosting chính: Cloudflare Worker + D1 + R2 tại `truelander.us`; deploy qua Workers Builds khi push `main` | D10, D19, D20 |
| D26 | Backend dùng Hono (thư viện mới duy nhất) + `@cloudflare/vite-plugin`, `wrangler` (dev); bỏ `express`, `cors`, `multer`, `sqlite3` | D2 (phần backend), D21 |
| D27 | Schema DB chỉ đổi bằng file `migrations/NNNN_*.sql`; không sửa migration đã chạy | `db.cjs` migrate() |
| D28 | Một cổng local duy nhất `5455` (web + API); bỏ cổng 5454 | D5, D18 |
| D29 | Đường dẫn ảnh upload giữ `/uploads/<tên-file>` (file nằm trên R2) để dữ liệu CMS cũ không phải sửa | — |
| D30 | Bỏ `content:export` và bản demo Render sau khi `truelander.us` chạy ổn | D20 |
| D31 | Ở gói Workers Free: băm mật khẩu bằng PBKDF2-SHA256 (Web Crypto), lưu `pbkdf2$<số vòng>$salt$hash` để chỉnh số vòng mà không đổi code; số vòng chọn sao cho đăng nhập < 10 ms CPU. Mật khẩu mới tối thiểu 12 ký tự. Hash scrypt cũ bỏ, 2 admin đặt lại mật khẩu ở C8 | Q1 = b; `auth.cjs:9-21` |
| D32 | Tên miền chính `truelander.us`; `www.truelander.us` chuyển 301 bằng Redirect Rule trên dashboard (Worker không chạy cho trang tĩnh) | Q2 |

## 5. Ánh xạ file
| Hiện tại | Sau khi chuyển | Mức sửa |
|---|---|---|
| `server/index.cjs` | `worker/index.js` | Viết mới (~40 dòng) |
| `server/db.cjs` | `worker/db.js` (lớp D1, giữ tên `run/get/all`) + `migrations/0001_init.sql` | Viết lại |
| `server/content.cjs` | `worker/content.js` | Chuyển sang ESM, logic giữ nguyên; sửa câu báo lỗi dòng 154 ("Restart the server (npm start)") |
| `server/auth.cjs` | `worker/auth.js` | Sửa H5, H6 + đọc/ghi cookie qua Hono |
| `server/routes/public.cjs` | `worker/routes/public.js` | Đổi cú pháp Express → Hono |
| `server/routes/admin.cjs` | `worker/routes/admin.js` | Đổi cú pháp + upload R2 + reorder dùng `batch` |
| `server/scripts/*.cjs` | `scripts/cf/*.mjs` | Viết lại chạy qua wrangler |
| `scripts/dev-all.cjs`, `deploy/*` | Xoá | — |
| `tests/e2e/server.cjs` | Chạy wrangler với thư mục dữ liệu tạm | Viết lại |
| `tests/e2e/cms.spec.mjs` | Giữ; chỉ sửa chỗ nào phụ thuộc cổng/URL | Ít |
| `vite.config.js` | Thêm `cloudflare()`, bỏ proxy `/api`, `/uploads` | Ít |
| `src/**` | **Không đổi** | — |

## 6. Các bước thực hiện
Nhánh `snap-013-cloudflare` → PR → PO merge (WORKFLOW §5). Thực hiện: Claude Code · Opus 5.5.

| Bước | Việc | Ai | Xong khi |
|---|---|---|---|
| **C0** | Chuẩn bị tài khoản (lệnh ở §7.1): `wrangler login`, tạo D1 `greenland-db`, R2 `greenland-uploads`; gửi lại `database_id`. Kiểm tra `truelander.us` → DNS **không có** bản ghi A/AAAA/CNAME cho `@` và `www` (nếu có thì báo lại, chưa xoá vội) | PO | Có `database_id`; biết tình trạng DNS |
| **C1** | Script `scripts/cf/export-sqlite.cjs` đọc `server/database.sqlite` (khi `sqlite3` vẫn còn) → `server/backups/d1-import.sql`, gồm INSERT cho các bảng nội dung, báo giá, liên hệ và `admin_users` (không lấy `admin_sessions`), **không commit**. Kiểm: đếm số dòng mỗi bảng trước và sau | Claude | File SQL khớp số dòng |
| **C2** | Khung Worker: `wrangler.jsonc`, `worker/index.js`, `migrations/0001_init.sql` (schema cuối của `db.cjs:29-138` + bảng `login_failures`), thêm `.wrangler/`, `.dev.vars` vào `.gitignore`, sửa `vite.config.js` | Claude | `npm run dev` → trang chủ `:5455` hiện đúng, `/api/site` trả JSON |
| **C3** | `worker/db.js` (`run` → `{lastID, changes}` từ `meta`; `undefined` → `null`), `worker/content.js`, lệnh `db:seed` sinh SQL từ `shared/defaultContent.json` (thay `seed()`) | Claude | DB trống + seed → `/api/site` giống hệt bản Express (so sánh JSON) |
| **C4** | Routes public + admin + auth trên Hono; throttle dùng D1; cookie `Secure` theo https; reorder dùng `DB.batch()`; băm mật khẩu theo D31 | Claude | Kiểm bằng curl: 401 khi chưa đăng nhập, 415 form khác site, 429 sau 10 lần sai, giá server tính đúng; mật khẩu < 12 ký tự bị từ chối |
| **C5** | Upload R2: kiểm loại file (jpg/png/webp/gif) và ≤ 5 MB như cũ, tên `Date.now()-hex.ext`; `GET /uploads/:name` đọc R2, cache 7 ngày, không có thì 404 | Claude | Upload trong CMS → ảnh hiện trên trang; file .txt bị chặn |
| **C6** | Script mới (§9) + dọn `package.json` (bỏ `server`, `start`, `dev:all`, `content:export` và 4 thư viện cũ) | Claude | Mọi lệnh chạy được với `--local` |
| **C7** | E2E với dữ liệu tạm + `npm run lint`, `npm run build`, `node scripts/check-cms-schema.mjs` | Claude | E2E pass toàn bộ, 0 lỗi lint, ảnh chụp trước/sau trùng |
| **C8** | Đưa lên Cloudflare (§7.2–7.4): áp migration remote, nạp `d1-import.sql`, đẩy ảnh lên R2, **đặt lại mật khẩu 2 admin** (`admin:create -- <user> --remote`), nối Workers Builds, gắn `truelander.us`, **đo CPU lúc đăng nhập** và chỉnh số vòng băm (§8 R1) | PO bấm trên dashboard, Claude hướng dẫn và kiểm tra | Bảng nghiệm thu §10 đạt |
| **C9** | Tài liệu: `README.md`, `RULES §2-3`, `CODEMAP`, `DECISIONS` (D25–D30), `STATUS`, `SNAP-013`; xoá `deploy/` | Claude | RULES §4 đủ |

## 7. Việc PO làm trên máy và dashboard
### 7.1 C0 — PowerShell tại `D:\Dev\agreenland_clone`
```powershell
npx wrangler login                                  # mở trình duyệt, chọn tài khoản Cloudflare đang có truelander.us
npx wrangler d1 create greenland-db                 # gửi lại dòng database_id
npx wrangler r2 bucket create greenland-uploads
```
Nếu R2 yêu cầu bật lần đầu: Dashboard → **R2** → **Purchase/Enable** (gói miễn phí, có thể phải thêm thẻ).

### 7.2 C8 — Nạp dữ liệu thật + đặt lại mật khẩu
```powershell
npm run cf:export-sqlite                 # xuất lại từ server/database.sqlite (lấy dữ liệu mới nhất)
npm run cf:import -- --remote            # áp migration, nạp dữ liệu, kiểm số dòng, đẩy ảnh server/uploads/* lên R2
npm run admin:create -- admin1 --remote  # đặt mật khẩu mới ≥ 12 ký tự
npm run admin:create -- admin --remote
```

### 7.3 C8 — Workers Builds (màn hình "Set up your application")
| Ô | Giá trị |
|---|---|
| Project name | `ageenland-us` (trùng `name` trong `wrangler.jsonc`) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler d1 migrations apply greenland-db --remote && npx wrangler deploy` |
| Enable Preview builds | **Tắt** (xem §8 R3) |

Sau khi tạo: **Settings → Build → API token** → thêm quyền **D1 Edit**. Token mặc định chỉ có Workers Scripts / KV / R2, thiếu D1, nên lệnh migration sẽ lỗi nếu không thêm.

### 7.4 C8 — Gắn tên miền
**Workers & Pages → ageenland-us → Settings → Domains & Routes → Add → Custom domain**: thêm `truelander.us` và `www.truelander.us`. Cloudflare tự tạo DNS và chứng chỉ HTTPS (vài phút).
Sau đó: **truelander.us → Rules → Redirect Rules → Create rule → template "Redirect from WWW to root"** → Deploy (D32).

## 8. Rủi ro và cách xử lý
| # | Rủi ro | Xử lý |
|---|---|---|
| R1 | Gói Free giới hạn **10 ms CPU/request**; hàm băm nhẹ hơn thì dễ dò mật khẩu hơn nếu DB bị lộ | D31: PBKDF2, số vòng đo thực tế ở C8 (Observability → CPU time), mật khẩu ≥ 12 ký tự, giữ khoá 15 phút sau 10 lần sai. Sau này lên Workers Paid chỉ cần tăng số vòng |
| R2 | D1 Free: tối đa 50 truy vấn mỗi request | Hiện nặng nhất là `/api/site` (5 truy vấn). Reorder chuyển sang `batch`. Seed chạy bằng file SQL, không chạy trong request |
| R3 | Preview build (nhánh khác `main`) dùng **chung D1/R2 thật**, nên thử trên nhánh có thể ghi vào dữ liệu khách | Tắt Preview builds. Thử nghiệm làm ở local |
| R4 | Rollback trên dashboard chỉ lùi code, **không lùi DB** | Migration chỉ thêm (D27). Trước migration lớn chạy `npm run db:backup`. D1 Time Travel có sẵn 7 ngày |
| R5 | `truelander.us` đang có DNS/website khác thì gắn tên miền sẽ lỗi | Kiểm ở C0, PO quyết định trước khi xoá bản ghi cũ |
| R6 | Bước nạp dữ liệu (C8) chạy 2 lần sẽ trùng dữ liệu | Script kiểm DB remote phải trống trước khi nạp |
| R7 | `d1-import.sql` chứa dữ liệu khách + hash mật khẩu | Nằm trong `server/backups/` (đã có trong `.gitignore`); xoá sau khi nạp xong |

## 9. Lệnh sau khi chuyển
Xem `README.md` mục "Các lệnh quản trị dữ liệu" (nguồn duy nhất, tránh chép 2 nơi).

## 10. Nghiệm thu (C8)
- [ ] `https://truelander.us` và `https://www.truelander.us` mở được, có HTTPS; 2 theme hiện đúng như local.
- [ ] Nội dung, ảnh upload cũ, danh sách báo giá / liên hệ khớp số dòng với `server/database.sqlite`.
- [ ] Đăng nhập CMS; sửa 1 trường → trang chủ đổi; upload ảnh mới hiện được.
- [ ] Gửi báo giá, liên hệ, form Hero → có trong CMS; giá lưu = giá server tính.
- [ ] Bảo mật: 401 / 415 / 429 đúng; cookie có `HttpOnly; Secure; SameSite=Lax`.
- [ ] Push 1 commit nhỏ → web tự cập nhật; bấm thử Rollback rồi quay lại.
- [ ] Đăng nhập bằng mật khẩu mới (≥ 12 ký tự); CPU lúc đăng nhập < 10 ms (R1).
- [ ] `www.truelander.us` chuyển 301 về `truelander.us`.

## 11. PO đã quyết định (2026-09-28)
| # | Câu hỏi | Quyết định |
|---|---|---|
| Q1 | Đăng nhập vượt 10 ms CPU ở gói Free | **(b)** ở gói Free, đổi hàm băm (D31); 2 admin đặt lại mật khẩu ở C8 |
| Q2 | `www` chuyển về `truelander.us` | **Có** (D32) |
| Q3 | Tắt demo Render, bỏ `content:export` sau nghiệm thu | **Có** (D30) |

## 12. Nguồn (tài liệu Cloudflare, 09/2026)
- Giới hạn Workers (10 ms CPU Free, 100k request/ngày): https://developers.cloudflare.com/workers/platform/limits/
- D1 (Free: 5M dòng đọc, 100k dòng ghi/ngày, 500 MB/DB, 50 truy vấn/request): https://developers.cloudflare.com/d1/platform/pricing/ · https://developers.cloudflare.com/d1/platform/limits/
- R2 (10 GB, tải xuống không mất phí): https://developers.cloudflare.com/r2/pricing/
- `node:crypto` (có scrypt): https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/
- `run_worker_first` + SPA: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- Vite plugin: https://developers.cloudflare.com/workers/vite-plugin/get-started/
- Workers Builds (quyền token): https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
