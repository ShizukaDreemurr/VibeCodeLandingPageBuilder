# Đặc tả nhanh: <Tên sản phẩm>

> Tối đa 1 trang. Viết trong 5 phút đầu sprint. Sau khi chốt, không thêm tính năng ngoài danh sách này trừ khi ghi thành quyết định mới trong `DECISIONS.md`.

**Đề số:** <số> · **Bảng:** <A / B> · **Đề bài gốc (dán nguyên văn):** <…>

## 1. Bài toán và persona

- **Persona:** <vai trò cụ thể, ví dụ: marketer tổ chức workshop>
- **Họ muốn làm gì:** <…>
- **Vấn đề hiện tại:** <họ đang làm bằng tay, chậm hoặc sai ở đâu>
- **Giá trị sau khi dùng:** <đo được: giảm số bước, gom dữ liệu về một chỗ…>

## 2. Năm tính năng (MVP)

Mỗi tính năng ghi đủ 4 mục: **Input → Quy tắc → Output → Lưu trữ**, cuối cùng là một **kiểm tra chấp nhận** (làm được thì tick).

### T1. <Nhập dữ liệu đầu vào>
- **Input:** <từng trường, kiểu dữ liệu, bắt buộc hay không>
- **Quy tắc:** nếu <thiếu / sai định dạng> thì <báo lỗi ngay dưới ô>; nếu <…> thì <…>
- **Output:** <màn hình hoặc kết quả hiển thị>
- **Lưu trữ:** <localStorage / Firestore / không lưu>
- **Kiểm tra chấp nhận:** ☐ <bước thử> → <kết quả mong đợi>

### T2. <AI phân tích, tạo hoặc gợi ý>
- **Input:** <dữ liệu từ T1 gửi cho AI>
- **Quy tắc:** AI chỉ viết nội dung. <Dữ liệu nào lấy từ form, không để AI bịa>; JSON thiếu trường thì <bù bằng bản mô phỏng và báo rõ>
- **Output:** <cấu trúc kết quả>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T3. <Lưu, xem, sửa, xoá lịch sử>
- **Input:** <…>
- **Quy tắc:** <ví dụ: xoá phải hỏi xác nhận; trùng thì chỉ ghi một lần>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T4. <Tính năng nghiệp vụ theo đề>
- **Input:** <…>
- **Quy tắc:** nếu <…> thì <…>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T5. <Tính năng theo đề hoặc quản trị>
- **Input:** <…>
- **Quy tắc:** nếu <…> thì <…>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

## 3. AI làm gì

| Việc AI làm | Gửi AI gì | AI trả về (JSON) | Code tự tính, AI không được viết | Chế độ mô phỏng trả gì |
|---|---|---|---|---|
| <ví dụ: viết tiêu đề và 3 lợi ích> | <tên, mô tả ngắn> | <{"headline", "benefits": [...]}> | <ngày, giờ, địa điểm, giá, tên người> | <ghép câu từ công thức theo giọng văn> |

- Ba chế độ: **AI thật** (người dùng tự nhập key, key chỉ ở trình duyệt hoặc máy chủ) · **Copy prompt** (dán kết quả về) · **Mô phỏng** (có nhãn: `<câu nhãn đúng nguyên văn đề>`).

## 4. Ngoài phạm vi
- <…>
- <…>
(Ghi rõ những gì KHÔNG làm, để không bị kéo thêm yêu cầu giữa sprint.)

## 5. Dữ liệu mẫu
- Nút **"<Điền dữ liệu mẫu>"** điền: <tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi>
- Có sẵn <n> bản ghi đăng ký mẫu để demo danh sách và số đếm.
- Dùng đúng dữ liệu này khi quay video và khi làm bảng kiểm thử, để kết quả lặp lại được.

## 6. Giả định (chọn mặc định, chủ dự án xác nhận hoặc sửa)
1. <…>
2. <…>
