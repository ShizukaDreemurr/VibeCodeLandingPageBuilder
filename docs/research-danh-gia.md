# Đánh giá dữ liệu research Gemini (docs/research-gemini.md)

## Dùng được ngay
- 3 trục phân loại: 12 ngành, 11 loại sự kiện, 8 mục đích; 12 tổ hợp phổ biến tại VN.
- Trường bắt buộc/tuỳ chọn theo loại sự kiện; form đăng ký 3–5 trường, dùng dropdown thay ô tự do.
- 2 bộ thứ tự section mẫu (Conference, Bootcamp); mẫu headline/sub/CTA theo mục đích; công thức 3 bullet lợi ích.
- FOMO hợp đạo đức: đếm ngược theo mốc thật (không reset khi F5), số chỗ còn lại thật.
- CRO: 1 CTA chính, sticky CTA trên mobile, FAQ dạng accordion, ngày giờ/địa điểm ở màn hình đầu.
- Ý nghĩa màu theo văn hoá VN; 10 cặp font Google Fonts có tiếng Việt; icon Lucide/Remix.

## Cần sửa / lưu ý
1. **Khối JSON cuối bị thiếu**: chỉ có 4/16 bảng màu, 6/11 loại sự kiện, 4/8 mục đích, 4/10 cặp font → sẽ dựng lại JSON từ các bảng trong báo cáo.
2. **Tỉ lệ tương phản ghi "Đạt" không chính xác** (đã tự tính lại theo công thức WCAG):
   - PAL_05: text phụ `#38BDF8` trên nền `#F0F9FF` chỉ **2.0:1** → phải đổi (vd `#0369A1`).
   - Chữ trắng trên nút màu primary < 4.5:1 ở PAL_03 (3.5), PAL_04 (3.2), PAL_07 (4.2), PAL_12 (3.6), PAL_13 (4.1), PAL_16 (3.7) → làm đậm màu nút hoặc dùng chữ tối.
   - Màu accent trên nền sáng hầu hết < 4.5:1 → accent chỉ dùng trang trí/icon/viền, không dùng cho chữ nhỏ.
3. **Số liệu thống kê** (vd "video tăng chuyển đổi 86%", "sticky CTA +14–22%", CVR 13.4%) chưa kiểm chứng nguồn gốc → không đưa con số cụ thể vào bài thuyết trình nếu chưa tra lại.
4. **Danh sách landing page thực tế VN** có thể không chính xác chi tiết → nhóm mở thử từng trang trước khi trích dẫn.
5. **Thiếu chân dung khách hàng mục tiêu** (marketer sự kiện: độ tuổi, gu thẩm mỹ) như cô yêu cầu → cần research bổ sung.
6. Một số tính năng vượt phạm vi Đề 8 (cổng thanh toán, sơ đồ ghế, QR check-in, reCAPTCHA) → không làm, có thể nhắc như hướng phát triển.
