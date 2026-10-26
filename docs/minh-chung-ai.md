# Minh chứng dùng AI để xây dựng và cải thiện sản phẩm — Xclipse

> Bản nháp để nhóm hoàn thiện (tối đa 1 trang + 5 ảnh). Mỗi vòng: mục tiêu → yêu cầu cho AI → vấn đề phát hiện khi thử → yêu cầu sửa → kết quả kiểm tra lại. Nhóm thay `[Ảnh x]` bằng ảnh chụp hội thoại/màn hình tương ứng.

**Công cụ AI đã dùng**: Claude (lập kế hoạch, viết mã, kiểm thử), Gemini Deep Research (nghiên cứu thị trường, bảng màu), Gemini (tạo ảnh mockup giao diện), AI agent trên trình duyệt (thiết lập Firebase, GitHub Pages).

| # | Mục tiêu | Yêu cầu cho AI | Vấn đề phát hiện khi thử | Yêu cầu sửa | Kết quả kiểm tra lại |
|---|---|---|---|---|---|
| 1 | Bảng màu cho các mẫu trang | Gemini Deep Research đề xuất 16 bảng màu "đạt chuẩn WCAG AA" | Claude tự tính lại độ tương phản: nhiều bảng **không đạt** (VD chữ phụ 2.0:1, chữ trắng trên nút 3.2:1) | Chọn lại màu, tính lại theo công thức WCAG trước khi dùng | 6 mẫu trong app đều ≥ 4.5:1 `[Ảnh 1]` |
| 2 | AI viết nội dung đúng thông tin | Prompt yêu cầu trả JSON headline/mô tả/3 lợi ích | AI hay thêm lời dẫn, \`\`\`json, nháy cong, thiếu ý | Thêm bộ đọc chịu lỗi + kiểm tra trường + bù và báo rõ; cấm AI bịa ngày giờ, địa điểm | Kết quả dán từ ChatGPT/Claude vẫn dựng được trang `[Ảnh 2]` |
| 3 | Chống đăng ký trùng giữa nhiều thiết bị (Google Sheet) | Viết đồng bộ Google Sheet | Khi thử 2 thiết bị: trùng trên Sheet nhưng form vẫn báo "thành công" | Form chờ Sheet xác nhận trước khi báo kết quả | Báo đúng "đã đăng ký rồi" `[Ảnh 3]` |
| 4 | Bảo mật dữ liệu khách trên Firebase | Viết quy tắc bảo mật Firestore | Cần chứng minh người lạ không đọc được danh sách | Chạy 33 ca kiểm thử trên Firebase Emulator | 33/33 đạt; người lạ bị `permission-denied` `[Ảnh 4]` |
| 5 | Đăng nhập Google khi xuất bản | Agent tự đăng nhập để kiểm thử | Bấm đăng nhập "không phản hồi", không có thông báo | Thêm thông báo trạng thái + dịch lỗi đăng nhập sang tiếng Việt; người thật đăng nhập | Xuất bản, quét QR trên điện thoại, số đếm tăng `[Ảnh 5]` |

**Bài học**: không tin ngay "đã đạt chuẩn" hay "đã hoàn thành" — luôn tự đo lại (độ tương phản), thử ở điều kiện thật (2 thiết bị, mất mạng, người lạ truy cập) rồi mới chốt.
