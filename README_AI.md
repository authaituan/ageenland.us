# README_AI — Cổng chào dự án GreenLand (cho mọi AI)

> Bạn là AI mới vào dự án? Đọc file này (≈2 phút), rồi làm theo **Lộ trình đọc** bên dưới. KHÔNG quét toàn bộ repo.

## 1. Dự án là gì
Website giới thiệu dịch vụ cảnh quan **GreenLand** + trang quản trị **CMS** (`/admin`) để chủ doanh nghiệp tự sửa chữ, ảnh, giá, xem báo giá/liên hệ của khách.
Stack: React 19 + Vite + Tailwind 4 · Express 5 + SQLite · Node. Repo: `authaituan/ageenland.us`, nhánh `main`.

## 2. Đang ở đâu → xem [STATUS](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/STATUS.md)
STATUS là **nguồn sự thật duy nhất** về: Snapshot hiện tại, việc đang làm, việc tiếp theo, vướng mắc.

## 3. Bản đồ tài liệu
| File | Khi nào đọc |
|---|---|
| [docs/ai/STATUS.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/STATUS.md) | **Luôn đọc** — snapshot hiện tại + việc tiếp theo |
| [docs/ai/WORKFLOW.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/WORKFLOW.md) | Cần biết ai làm gì, chọn model nào, vòng làm việc |
| [docs/ai/CTO_PROTOCOL.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/CTO_PROTOCOL.md) | Bạn là **CTO** → mẫu báo cáo bắt buộc |
| [docs/ai/CODEMAP.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/CODEMAP.md) | Bạn là **Developer** → loại việc nào đọc file nào |
| [docs/ai/RULES.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/RULES.md) | Trước khi sửa code: quy tắc, lệnh kiểm tra, Definition of Done |
| [docs/ai/DECISIONS.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ai/DECISIONS.md) | Trước khi đề xuất thay đổi lớn (tránh lật lại quyết định cũ) |
| [docs/ai/snapshots/](https://github.com/authaituan/ageenland.us/tree/main/docs/ai/snapshots) | Chỉ khi cần lịch sử — mỗi snapshot 1 file ngắn |
| [docs/ADMIN_CMS_PLAN.md](https://raw.githubusercontent.com/authaituan/ageenland.us/main/docs/ADMIN_CMS_PLAN.md) | Chi tiết Phase CMS — chỉ đọc mục được STATUS/prompt chỉ định |

## 4. Lộ trình đọc (tiết kiệm token)
```
Mọi AI ──► README_AI ──► STATUS ─┬─► CTO ──────► CTO_PROTOCOL ──► (DECISIONS nếu cần) ──► Báo cáo PO
                                 └─► Developer ─► RULES ──► CODEMAP (chỉ 1 dòng đúng loại việc) ──► file code được chỉ định
```
- Không mở: `node_modules/`, `dist/`, `package-lock.json`, `public/images/`, `*.sqlite`, `server/uploads/`.
- Không đọc lại file tài liệu đã đọc trong cùng phiên.

## 5. Vai trò (tóm tắt — chi tiết ở WORKFLOW)
- **PO** (con người): quyết định mục tiêu, duyệt kết quả, chuyển prompt giữa các AI.
- **CTO** (ChatGPT / Gemini / AI được PO chỉ định): phản biện, báo cáo PO, viết prompt cho Developer.
- **Dev A – Antigravity** (Gemini): giao diện, kiểm tra trực quan trên trình duyệt, việc nhanh.
- **Dev B – Claude Code** (Claude): backend, bảo mật, dữ liệu, refactor, review, cập nhật tài liệu.

## 6. Quy tắc vàng
1. Xong mỗi việc → Developer **cập nhật STATUS** và thêm 1 file snapshot (xem RULES §4). Không cập nhật = chưa xong.
2. Một việc chỉ giao cho **một** Developer; không 2 AI sửa cùng file cùng lúc.
3. Tài liệu viết ngắn: chỉ đường đến file, không chép code/nội dung vào tài liệu.
