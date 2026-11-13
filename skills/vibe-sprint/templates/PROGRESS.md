# Run-sheet 60 phút: <Tên sản phẩm>

> Claude cập nhật file này sau mỗi mốc và nhắc đội các mục "Việc cần làm" còn ô chưa tick.
> Giờ tính từ lúc bắt đầu sprint (T0 = <hh:mm>). Mốc nào trễ hơn 5 phút: ghi vào "Quyết định" và cắt phạm vi, không kéo dài mốc sau.

**Đội:** <Tên đội> · **T0:** <hh:mm> · **Hạn nộp:** <hh:mm>
**Cập nhật lần cuối:** <hh:mm>, <đã xong gì, đang làm gì>

## Mốc thời gian

| Thời gian | Việc | Đầu ra | ☐ |
|---|---|---|---|
| 00:00–00:05 | Đọc đề, điền `spec-nhanh.md`, chốt 5 tính năng và phần ngoài phạm vi | Spec 1 trang, có Input→Quy tắc→Output→Lưu trữ | ☐ |
| 00:05–00:10 | Tạo repo bằng `scripts/new-project.sh`, kiểm tra `CLAUDE.md`, push nhánh, bật GitHub Pages | Link Pages mở được (trang trắng cũng được) | ☐ |
| 00:10–00:25 | Làm T1 (nhập liệu có kiểm tra lỗi) và T2 (AI, có chế độ mô phỏng) | Hai tính năng chạy được với dữ liệu mẫu | ☐ |
| 00:25–00:40 | Làm T3, T4, T5. Kiểm tra từng tính năng theo "kiểm tra chấp nhận" | Năm tính năng đều chạy, kể cả khi còn xấu | ☐ |
| 00:40–00:48 | Kiểm thử: chạy `<lệnh test>`, điền `BANG-KIEM-THU.md` (≥ 6 ca A, ≥ 3 ca B). Chạy `scripts/scan-secrets.mjs` | Bảng kiểm thử có kết quả thật; không lộ secret | ☐ |
| 00:48–00:53 | Viết `MINH-CHUNG-AI.md` (1 trang, ≤ 5 ảnh), điền `README-du-thi.md` | Hai tài liệu đủ mục, không còn `<…>` | ☐ |
| 00:53–00:56 | Duyệt `KICH-BAN-DEMO.md`, quay video backup 2 phút, xuất slide PDF | File MP4 và PDF trên máy và USB | ☐ |
| 00:56–00:58 | Commit và push nhánh; mở link Pages ở cửa sổ ẩn danh | Link chạy được, đúng phiên bản | ☐ |
| 00:58–00:60 | Điền form nộp bài, đối chiếu `CHECKLIST-CHUNG-KET.md` | Đã nộp, có ảnh màn hình xác nhận | ☐ |

## Việc cần làm (đội)

- [ ] <Việc> (ví dụ: lấy key Gemini trước T0 nếu muốn chạy AI thật)  
      Cách làm: 1) <…> 2) <…>
- [ ] <Việc> 

## Quyết định trong sprint

Ghi vào `DECISIONS.md` khi đổi phạm vi. Ở đây chỉ ghi tóm tắt: `[hh:mm] Dxx: <việc đã cắt hoặc đổi>`.

- [hh:mm] <…>

## Phạm vi cắt nếu trễ

Thứ tự cắt, từ dưới lên. Không cắt luồng chính (T1 → T2 → kết quả hiện được):

1. <Tính năng phụ, ví dụ: xuất CSV>
2. <Hiệu ứng, ảnh đẹp>
3. <Quản trị, trang nâng cao>

## Ghi chú cần nhớ

- <Lệnh chạy, cổng, URL Pages>
- <Giới hạn: dữ liệu localStorage chỉ trên một máy>
- <Tài khoản, thiết bị, dây sạc đã kiểm tra (xem CHECKLIST-CHUNG-KET.md)>
