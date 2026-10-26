# Tiêu chí chấm & yêu cầu nộp bài — VIBE-CODING 2026 (tóm tắt để đối chiếu)

Nguồn: docs/vibecoding-tong-hop-bai-viet.md (tóm tắt từ vibecoding.info.vn) + buổi đào tạo 1.

## Mốc thời gian
- Nộp bài: 00:00–23:59 **09/11/2026** (sản phẩm tại hạn nộp là căn cứ, không sửa sau hạn).
- Chung kết: 17/11/2026.

## Bảng A (Công nghệ) — 100đ
Chức năng & đúng nghiệp vụ 25 · Thiết kế kỹ thuật & chất lượng mã 20 · **Tích hợp AI & kiểm soát đầu ra 15 (chỉ mock → tối đa 4/15)** · Kiểm thử, ổn định & xử lý lỗi 15 · Làm chủ Vibe Coding & phản biện kỹ thuật 15 · Giao diện & trải nghiệm mobile 5 · Triển khai & bàn giao 5.
Đi tiếp: tổng ≥60 và chức năng ≥15/25. Link online hỏng không được khôi phục điểm triển khai.

## Bảng B (Kinh tế) — 100đ
Chức năng (5 tính năng dùng được) 30 · Hiểu bài toán & giá trị sử dụng 15 · Sử dụng AI để xây & cải thiện 20 · Độ đúng nghiệp vụ & nội dung đầu ra 15 · Giao diện & trải nghiệm 10 · Kiểm tra & xử lý lỗi cơ bản 5 · Demo & bàn giao 5.
AI thật hoặc mock minh bạch đều có thể đạt 100. Đi tiếp: tổng ≥60 và chức năng ≥18/30.

## Hồ sơ nộp
1. Source ZIP + README (đề số, công nghệ, tính năng, cách chạy, AI dùng, giới hạn, nguồn tham khảo; KHÔNG lộ API key).
2. Video ≤ 2 phút, thao tác thật, đủ 5 tính năng.
3. Minh chứng AI ≤ 1 trang + 5 ảnh/hội thoại (quá trình thử & cải thiện).
4. Bảng kiểm thử: A ≥ 6 ca (2 bình thường, 2 đầu vào sai, 2 biên/sự cố); B ≥ 3 ca (1 bình thường, 1 thiếu/sai, 1 biên).
5. Hỏi đáp 5 phút (A: kỹ thuật; B: cách dùng, nghiệp vụ, quá trình cải thiện AI).

## Nguyên tắc chấm đáng chú ý
- Không cộng điểm vì model trả phí, nhiều công nghệ hay video đẹp.
- Được dùng AI, thư viện, template nếu khai báo.
- Hướng dẫn BTC nhấn mạnh: không tự thêm yêu cầu ngoài đề, giữ phạm vi, luồng cốt lõi chạy trọn vẹn trước.

## Quy tắc nghiệp vụ được nêu trong buổi đào tạo (áp dụng cho Đề 8)
- Khung mô tả mỗi chức năng: **Input → Quy tắc (nếu/thì) → Output → Lưu trữ**.
- Tên trống → cảnh báo; email sai định dạng → cảnh báo; SĐT sai định dạng / +84 → nhắc nhập đúng.
- Sự kiện đã qua → ẩn nút đăng ký + thông báo.
- Bấm đăng ký 2 lần / trùng → chỉ ghi nhận 1 lần.
- localStorage chỉ lưu trên một máy — ghi rõ giới hạn.
- API key: nhập qua ô riêng trên app, hiển thị dạng ***, không đưa vào code/chat.

## Giải thích Đề 8 chính thức của BTC (thư viện đề bài)
- Landing page hiển thị ngay trong app (dưới form hoặc trang xem trước), **không cần tạo URL riêng**.
- Thời gian sự kiện đã qua → hiển thị **"Sự kiện đã diễn ra"** thay vì đếm ngược số âm.
- Danh sách đăng ký lưu localStorage, hiển thị công khai số người đã đăng ký trên trang.
- Các đề khác cho phép AI mock nếu ghi chú trong app và README.

## Trùng lặp với đề khác — tránh làm thành tính năng chính
- Đề 2 (caption), Đề 6 (email marketing): không làm bài đăng/email.
- Đề 5 (chấm điểm website /100): "coach chấm điểm" chỉ làm dạng **checklist trước xuất bản** cho trang của chính mình, không làm công cụ chấm điểm URL.
- Đề 7 (dashboard KPI): thống kê chỉ ở mức tối thiểu cho trang (lượt xem, đăng ký, tỉ lệ).

## Ghi chú từ báo cáo UX (docs/bao-cao-ux-landing-page-su-kien.docx)
- Persona chính (giả thuyết): marketer in-house SME; chủ cơ sở đào tạo/trainer.
- MVP: AI tạo bản nháp từ brief (không bịa thông tin ngoài brief, đánh dấu phần cần xác nhận) · section editor + undo + preview mobile/desktop · form chống gửi lặp + xuất dữ liệu · checklist trước xuất bản · analytics tối thiểu (view, bắt đầu điền form, gửi thành công, tỉ lệ) · thông báo thu thập dữ liệu, xoá/tải dữ liệu.
- Không dùng khan hiếm giả; countdown/số chỗ chỉ khi phản ánh trạng thái thật.
