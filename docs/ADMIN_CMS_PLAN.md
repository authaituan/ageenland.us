# PHASE: ADMIN CMS — Kế hoạch triển khai chi tiết

- Repo: `authaituan/ageenland.us` · Baseline audit: commit `54cdacc` (main)
- Mục tiêu: **mọi nội dung hiển thị trên frontend đều sửa được từ CMS**, giao diện giữ nguyên 100%.
- Nguyên tắc: không đổi layout/CSS, không thêm framework nặng, giữ stack hiện tại (React 19 + Vite, Express 5 + SQLite).

---

## 1. Hiện trạng đã audit (evidence)

| # | Sự thật runtime | Bằng chứng |
|---|---|---|
| E1 | Backend chạy thật là `server/index.cjs`; `server/index.js` crash (`require is not defined in ES module scope`) | `package.json` `"type":"module"`, chạy thử |
| E2 | `NODE_ENV=production` crash: `PathError ... *` | `server/index.cjs` `app.get('*')`, Express 5 |
| E3 | Frontend gọi cứng `http://localhost:5000` | AdminModal, ContactSection, CostCalculator, ServicesSection |
| E4 | Admin hiện tại = popup xem/đổi trạng thái báo giá, không đăng nhập | `AdminModal.jsx`, `GET/PATCH /api/quotes` |
| E5 | Bảng `contacts` chỉ INSERT, không có API đọc | `server/index.cjs` dòng 236 |
| E6 | Danh sách dịch vụ tồn tại ở **4 nơi** với tên khác nhau | server `SERVICES`, `CostCalculator.SERVICE_RATES`, `Hero.jsx` `<select>`, `Footer.jsx` links |
| E7 | Portfolio hiển thị dữ liệu viết cứng trong JSX, **khác** `PROJECTS` trên server (không được gọi) | `Portfolio.jsx` dòng 65–136 |
| E8 | Hero stats hiển thị `99.4%`, server `/api/stats` trả `99%` (không được gọi) | `Hero.jsx`, `server/index.cjs` |

**Quy tắc seed:** dữ liệu khởi tạo CMS lấy theo **nội dung đang hiển thị trên UI** (runtime first), không lấy theo mảng không được dùng trên server.

---

## 2. Inventory nội dung cần quản trị (toàn bộ text/ảnh đang show)

### 2.1 Nội dung đơn lẻ → bảng `site_settings` (key/value, nhóm theo section)

| Section | Trường | Giá trị hiện tại (seed) | File |
|---|---|---|---|
| **Chung / SEO** | `site.title` | GreenLand - Cảnh Quan & Chăm Sóc Sân Vườn Cao Cấp | `index.html` |
| | `site.meta_description` | (mới, chưa có) | — |
| | `brand.name_part1` / `name_part2` | Green / Land | Navbar, Footer |
| | `brand.tagline` | Cảnh Quan & Sân Vườn | Navbar |
| **Liên hệ** | `contact.phone_display` / `phone_tel` | 0988 123 456 / 0988123456 | ContactSection, Footer |
| | `contact.email` | contact@agreenland.vn | ContactSection, Footer |
| | `contact.address_full` | Khu Đô Thị Ecopark, Phường Phụng Công, Văn Giang, Hà Nội / TP.HCM | ContactSection |
| | `contact.address_short` | Ecopark / Thảo Điền / Hà Nội & TP.HCM | Footer |
| | `contact.working_hours` | Thứ 2 - Chủ Nhật (7:30 - 18:30) | ContactSection |
| **Navbar** | `nav.*` (6 nhãn desktop + 6 nhãn mobile + 2 nút CTA) | Về Chúng Tôi, Dịch Vụ, Tính Phí Online… | Navbar |
| **Hero** | `hero.badge`, `hero.title_line1`, `hero.title_highlight`, `hero.title_line2`, `hero.description` | Dịch Vụ Cảnh Quan… / Kiến Tạo Không Gian / Xanh Sang Trọng / & Đẳng Cấp / GreenLand mang đến… | Hero |
| | `hero.value_props` (list 3) | Thi công chuẩn kỹ thuật; Báo giá tự động 60s; Bảo hành cây & thảm cỏ | Hero |
| | `hero.cta_primary`, `hero.cta_secondary` | Ước Tính Chi Phí Ngay / Xem Các Dịch Vụ | Hero |
| | `hero.background_image` | /images/hero.png | Hero |
| | `hero.form_title`, `hero.form_subtitle`, `hero.form_button`, `hero.trust_left`, `hero.trust_right` | Đăng Ký Khảo Sát Miễn Phí… | Hero |
| **Hero stats** | list 3 × {value, label} | 45,000+ / m² Cảnh quan đã thi công; 99.4% / Khách hàng hài lòng; 15 Phút / Phản hồi khảo sát tận nơi | Hero |
| **Services header** | `services.badge`, `title`, `title_highlight`, `description`, `card_button` | Dịch Vụ Cảnh Quan Chuyên Nghiệp… | ServicesSection |
| **Calculator header** | `calc.badge`, `title`, `title_highlight`, `description`, `step2_title` | Công Cụ Báo Giá Tức Thì… | CostCalculator |
| **Portfolio header** | `portfolio.badge`, `title`, `title_highlight`, `description`, `label_before`, `label_after`, `hint` | Dự Án Đã Thi Công… | Portfolio |
| **Before/After** | `portfolio.before_image`, `portfolio.after_image` | /images/before_garden.png, /images/after_garden.png | Portfolio |
| **Testimonials header** | `testimonials.badge`, `title`, `title_highlight`, `description` | Phản Hồi Từ Khách Hàng… | Testimonials |
| **Contact header** | `contact_section.badge`, `title`, `title_highlight`, `description`, `form_title`, `form_button` | Liên Hệ Với Chúng Tôi… | ContactSection |
| **Footer** | `footer.about`, `footer.copyright`, `footer.bottom_note`, tiêu đề 3 cột | Đơn vị hàng đầu… / © 2026 GreenLand Inc… | Footer |
| **Thông báo** | `msg.quote_success`, `msg.contact_success` | Cảm ơn bạn! Yêu cầu báo giá… | server |

### 2.2 Nội dung dạng danh sách → bảng riêng

| Bảng | Trường | Dùng ở | Seed |
|---|---|---|---|
| `services` | id(slug), title, subtitle, description, price_per_m2, base_price, icon, image, features(JSON), **calc_name**, **hero_label**, **hero_emoji**, **footer_label**, sort_order, is_active | ServicesSection (`title`), CostCalculator (`calc_name`), Hero select (`hero_emoji` + `hero_label`), Footer (`footer_label`) | 6 dịch vụ; mỗi trường nhãn seed **đúng chữ đang hiển thị ở vị trí đó** (D1) |
| `frequency_options` | label, discount_pct, sort_order | CostCalculator | Lần đầu 0 · Hàng tuần 15 · 2 tuần/lần 10 · Hàng tháng 5 |
| `projects` | category_label, title, description, image, sort_order, is_active | Portfolio (3 thẻ) | 3 thẻ **đang hiển thị** trong `Portfolio.jsx` |
| `testimonials` | name, role, content, stars, avatar, sort_order, is_active | Testimonials | 3 đánh giá hiện tại |

→ Sau phase này, **1 bản ghi / dịch vụ** (giải quyết E6): giá dùng chung cho Services, Calculator và server; tên hiển thị ở từng vị trí vẫn giữ riêng như hiện tại và sửa được trong cùng một form.

### 2.3 Dữ liệu vận hành (đã có bảng, cần màn hình)

| Bảng | Chức năng CMS |
|---|---|
| `quotes` | Danh sách, lọc trạng thái, đổi trạng thái (có sẵn logic) |
| `contacts` | **Mới:** xem danh sách, đánh dấu đã xử lý (thêm cột `status`) |

---

## 3. Kiến trúc đề xuất (tối giản)

```
Frontend public (/)      ── GET /api/site  (1 request, toàn bộ nội dung) ──┐
                                                                          │
Admin SPA (/admin)       ── /api/admin/*  (cookie session, bắt buộc login)├─► Express (server/index.cjs) ─► SQLite
                                                                          │
Ảnh upload               ── /uploads/*  (static)                          ┘
```

**Quyết định kỹ thuật:**

| Hạng mục | Chọn | Lý do |
|---|---|---|
| Routing admin | Kiểm tra `location.pathname.startsWith('/admin')` trong `main.jsx`, render `<AdminApp/>` | Không cần thêm react-router |
| Auth | **2 tài khoản admin** (D4), đăng nhập bằng username + mật khẩu, cùng quyền; mật khẩu hash bằng `crypto.scrypt` (built-in Node); session token ngẫu nhiên lưu bảng `admin_sessions`; cookie `httpOnly`, `SameSite=Lax` | Không thêm thư viện auth |
| Upload ảnh | `multer` → `server/uploads/`, giới hạn 5MB, chỉ jpg/png/webp | Thư viện nhỏ, chuẩn |
| Nạp nội dung FE | `SiteContext` gọi `GET /api/site` 1 lần; **mỗi component giữ nội dung hiện tại làm fallback** | API lỗi → UI vẫn y như cũ |
| Giá báo giá | Server **tự tính lại** `estimatedCost` từ `services` + `frequency_options` | Chống sửa giá từ client |
| Migration | File `server/db/schema.sql` + `server/db/seed.cjs` (chạy idempotent) | Tái tạo DB được |

---

## 4. API spec

### Public (không cần đăng nhập)
| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/site` | `{ settings, services, frequencyOptions, projects, testimonials }` (chỉ `is_active=1`, theo `sort_order`) |
| POST | `/api/quotes` | Giữ nguyên, nhưng server tính lại giá |
| POST | `/api/contact` | Giữ nguyên |

### Admin (bắt buộc session)
| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/admin/login` · `/logout` · GET `/me` | Đăng nhập |
| POST | `/api/admin/password` | Đổi mật khẩu |
| GET / PUT | `/api/admin/settings` | Đọc / lưu hàng loạt key-value |
| GET / POST / PUT / DELETE | `/api/admin/{services\|projects\|testimonials\|frequency-options}[/:id]` | CRUD |
| PUT | `/api/admin/{collection}/reorder` | Lưu thứ tự `[id...]` |
| POST | `/api/admin/upload` | Upload ảnh → trả `{ url }` |
| GET / PATCH | `/api/admin/quotes[/:id]` | **Chuyển** từ `/api/quotes` công khai sang đây |
| GET / PATCH | `/api/admin/contacts[/:id]` | Mới |

**Gỡ bỏ:** `GET /api/quotes`, `PATCH /api/quotes/:id` công khai; `GET /api/services|projects|stats` (thay bằng `/api/site`).

---

## 5. Giao diện CMS (`/admin`)

Tái sử dụng màu/tailwind hiện có, bố cục: sidebar trái + vùng nội dung.

| Menu | Màn hình |
|---|---|
| Tổng quan | Số báo giá mới, số liên hệ mới |
| Báo giá | Bảng + lọc trạng thái (tái dùng logic `AdminModal`) |
| Liên hệ | Bảng tin nhắn, đánh dấu đã xử lý |
| Nội dung trang | Form theo **từng section** (Chung, Liên hệ, Navbar, Hero, Dịch vụ header, Calculator, Portfolio, Testimonials, Liên hệ, Footer) |
| Dịch vụ | Danh sách + form (giá, ảnh, features dạng list, icon chọn từ 6 icon hiện có, ẩn/hiện, sắp xếp) |
| Chu kỳ & giảm giá | Bảng tần suất / % giảm |
| Dự án | CRUD thẻ dự án + ảnh |
| Đánh giá | CRUD + số sao + avatar |
| Tài khoản | Đổi mật khẩu |

Mỗi form có nút **"Xem trang"** mở `/` tab mới để kiểm tra.
Nút "Quản Lý API" trên Navbar public: **gỡ bỏ** (admin vào qua `/admin`).

---

## 6. Thứ tự triển khai (mỗi bước = 1 PR nhỏ, kiểm tra được độc lập)

| Bước | Nội dung | Tiêu chí nghiệm thu |
|---|---|---|
| **S0 – Tiền đề runtime** | Xóa `server/index.js`, giữ `index.cjs`; thêm script `"server": "node server/index.cjs"`; sửa `app.get('*')` → `app.get('/{*splat}')`; thay `http://localhost:5000` bằng `/api` tương đối; `.gitignore` thêm `server/database.sqlite`, `server/uploads/` | `npm run dev` + `npm run server` chạy; `NODE_ENV=production` không crash; form báo giá & liên hệ vẫn gửi được |
| **S1 – Auth** | Bảng `admin_users` (username, password_hash, display_name), `admin_sessions`; login/logout/me; middleware `requireAdmin`; script `npm run admin:create -- <username>` tạo 2 tài khoản, mật khẩu nhập tại terminal (không ghi vào code/repo) | `curl /api/admin/me` không cookie → 401; login đúng → 200 |
| **S2 – Khóa dữ liệu khách** | Chuyển quotes sang `/api/admin/quotes`; thêm `/api/admin/contacts`; gỡ endpoint công khai | `curl /api/quotes` (GET) → 404; dữ liệu chỉ xem được sau login |
| **S3 – Schema + seed** | Tạo 5 bảng nội dung, seed **đúng text đang hiển thị** (mục 2) | Đếm bản ghi: services 6, projects 3, testimonials 3, frequency 4 |
| **S4 – API public `/api/site`** | Endpoint gộp | JSON trả đủ các khóa mục 2.1 |
| **S5 – Frontend đọc CMS** | `SiteContext` + sửa 9 component đọc từ context, fallback giữ nguyên nội dung cũ | **So sánh ảnh chụp trước/sau: không khác pixel nào** |
| **S6 – Giá phía server** | `POST /api/quotes` tính lại `estimatedCost`, `serviceName` lấy từ DB | Gửi `estimatedCost: 1` → DB lưu giá đúng |
| **S7 – Admin shell** | `/admin`: trang login, layout, Báo giá, Liên hệ | Login → xem được báo giá & liên hệ |
| **S8 – Admin nội dung** | Form settings theo section | Sửa SĐT trong CMS → reload `/` thấy SĐT mới ở cả Contact & Footer |
| **S9 – Admin danh sách + upload** | CRUD services/projects/testimonials/frequency, upload ảnh | Thêm dịch vụ mới → xuất hiện ở Services, Calculator, Hero select, Footer |
| **S10 – Nghiệm thu** | Chạy lại toàn bộ checklist mục 8 | Tất cả pass |

Thư viện mới cần cài: chỉ **`multer`** (và `cookie-parser` nếu không tự parse cookie).

---

## 7. Điểm cần anh quyết định trước khi code

1. **Tên dịch vụ chuẩn** (E6): hiện có 3–4 phiên bản tên cho mỗi dịch vụ. Đề xuất lấy tên ở **ServicesSection (server `SERVICES`)** làm chuẩn; Hero select, Calculator, Footer dùng chung. Nếu cần tên ngắn cho Footer → thêm trường `short_title`.
2. **Icon emoji ở Hero select** (🌿🌳✨…): thêm trường `emoji` vào `services` hay bỏ?
3. **Avatar đánh giá** đang lấy từ Unsplash (ảnh người lạ). Đề xuất: upload avatar thật hoặc dùng chữ cái đầu tên.
4. **Tài khoản admin**: 1 người hay nhiều người? (Kế hoạch này giả định 1.)
5. **Hosting đích** (VPS/Render/…)? Ảnh upload lưu trên đĩa server — cần hosting có ổ đĩa bền vững.

---

## 8. Lỗi phát hiện thêm khi audit (ngoài phạm vi, ghi nhận)

| Lỗi | Vị trí | Ghi chú |
|---|---|---|
| Form "Đăng Ký Khảo Sát" ở Hero **không lưu số điện thoại** — chỉ cuộn xuống calculator | `Hero.jsx` `handleQuickRequest` | Mất lead khách hàng. Đề xuất xử lý trong S2 (lưu vào `contacts`) |
| Link "Về Chúng Tôi" (`#about`) không có section tương ứng | Navbar, Footer | Không có `id="about"` trong `src/` |
| Chữ `($m^2$)` hiển thị nguyên ký hiệu LaTeX | `CostCalculator.jsx` mô tả header | Sửa khi đưa vào CMS |
| Chính tả "Thi Kế", "Tới Tự Động" | Portfolio, Footer | Sửa qua CMS sau S8 |
| Ảnh `public/images` ~1–1.4MB/ảnh PNG | `public/images/` | Tối ưu (webp) khi làm upload |

---

## 9. Checklist nghiệm thu cuối phase

- [ ] Không còn text/ảnh nào hiển thị trên `/` mà không sửa được trong CMS (đối chiếu bảng mục 2)
- [ ] Giao diện `/` trước và sau giống hệt khi dữ liệu = seed
- [ ] Tắt backend → `/` vẫn hiển thị nội dung fallback
- [ ] Mọi `/api/admin/*` trả 401 khi chưa đăng nhập
- [ ] Không còn `localhost:5000` trong `src/`
- [ ] Giá lưu trong `quotes` = giá server tính
- [ ] `NODE_ENV=production node server/index.cjs` phục vụ cả `/` và `/admin`
