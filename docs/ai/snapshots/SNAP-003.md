# SNAP-003 — S10 Nghiệm thu Phase CMS
- Ngày: 2026-09-24 · Người làm: Claude Code (Opus 5.5) · Kiểm thử: `npm run test:e2e` → 3/3 đạt (9 bước, `tests/e2e/cms.spec.mjs`)
- Lệnh RULES §3: lint ✅ 0 lỗi (8 cảnh báo) · build ✅ · check-cms-schema ✅ 143 trường + 4 danh sách

| Checklist §9 `ADMIN_CMS_PLAN.md` | KQ | Bằng chứng |
|---|---|---|
| Mọi text/ảnh trên `/` sửa được trong CMS | ✅ | check-cms-schema; grep chữ tiếng Việt viết cứng trong `src/components` → 0 |
| Giao diện trước/sau giống khi dữ liệu = seed | ✅* | *Theo ảnh chụp của CTO (mobile trùng pixel, desktop chỉ khác nút "Quản Lý API" đã gỡ); chưa tự lặp lại |
| Tắt backend → `/` hiện nội dung mặc định | ✅ | e2e: chặn mọi `/api` → hiện tiêu đề mặc định |
| `/api/admin/*` trả 401 khi chưa đăng nhập | ✅ | e2e: me, quotes, contacts, settings → 401 |
| Không còn `localhost:5000` trong `src/` | ✅ | grep → 0 |
| Giá lưu DB = giá server tính | ✅ | e2e: gửi `estimatedCost: 1` → DB lưu 127500 |
| `NODE_ENV=production` phục vụ `/` và `/admin` | ✅ | curl `:5461` `/`, `/admin`, `/admin/quotes` → 200 |

- Ghi chú: dịch vụ mới được tạo qua API admin (đã đăng nhập), không bấm form CMS; hotline khu Liên hệ và SĐT Footer là 2 ô riêng (kế hoạch S8 mong đợi 1).
