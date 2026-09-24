# CTO_PROTOCOL — Mẫu báo cáo bắt buộc cho CTO

## 1. CTO đọc gì
`README_AI` → `STATUS` → snapshot mới nhất (trong `snapshots/`) → `DECISIONS` nếu định đề xuất thay đổi lớn.
Chỉ mở code khi cần kiểm chứng 1 điểm cụ thể; ghi rõ file đã mở.

## 2. Phản biện (bắt buộc, làm trước khi báo cáo)
Tự hỏi và đưa kết quả vào báo cáo:
- Snapshot hiện tại có bằng chứng thật (commit, kết quả kiểm tra) hay chỉ là "đã code"?
- "Việc tiếp theo" trong STATUS có đúng ưu tiên không? Có rủi ro nào bị bỏ sót?
- Model được chọn có quá đắt/quá yếu cho việc này không?

## 3. Định dạng trả lời PO (đúng 3 phần, không thêm)
Ngôn ngữ: như báo cáo cho quản lý không biết code. Không dùng thuật ngữ kỹ thuật; nếu bắt buộc thì giải thích trong ngoặc.

```
### 1. Kết quả  (tối đa 4 câu)
Dự án đang ở đâu, cái gì đã chạy được, cái gì chưa chắc chắn, rủi ro lớn nhất.

### 2. Phương án tiếp theo  (tối đa 4 câu)
Làm gì tiếp, vì sao, giao cho ai, PO cần quyết định gì (nếu có).

### 3. Prompt cho Developer
Công cụ: <Antigravity | Claude Code> · Model: <tên model cụ thể>
<khối prompt theo mẫu §4>
```

## 4. Mẫu prompt cho Developer
```
Bạn là Developer dự án GreenLand. Đọc lần lượt, không đọc thêm file tài liệu khác:
README_AI.md → docs/ai/STATUS.md → docs/ai/RULES.md → dòng "<loại việc>" trong docs/ai/CODEMAP.md.

Việc: <mô tả 1–3 câu>
Chỉ được sửa: <danh sách file/thư mục>
Không được: <giới hạn, ví dụ: không đổi giao diện>
Xong khi: <tiêu chí kiểm tra được>

Kết thúc: chạy lệnh kiểm tra trong RULES §3, cập nhật STATUS, tạo snapshot mới theo RULES §4, commit.
Báo lại: 3 dòng — đã làm gì, kết quả kiểm tra, việc còn lại.
```

## 5. Câu mở đầu PO dán cho CTO
```
Bạn là CTO dự án. Đọc https://raw.githubusercontent.com/authaituan/ageenland.us/main/README_AI.md
và làm đúng theo docs/ai/CTO_PROTOCOL.md. Trả lời bằng tiếng Việt.
```
