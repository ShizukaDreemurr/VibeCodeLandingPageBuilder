# Bảng kiểm thử — Xclipse (Đề 8, Bảng B)

Kết quả thực tế lấy từ các lần chạy kiểm thử tự động bằng trình duyệt thật (Playwright/Chromium) ngày 26–27/10/2026; ca có ghi "thiết bị thật" do nhóm thử trên GitHub Pages + điện thoại. Mã script tương ứng nằm trong `tests/`.

| Mã ca | Loại ca | Dữ liệu và bước thử | Kỳ vọng | Kết quả thực tế | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| TC01 | Bình thường | Bấm "Điền dữ liệu mẫu" → "✨ Tạo landing page" (AI mô phỏng) | Trang hiện đủ hero, đếm ngược, giới thiệu, 3 lợi ích, diễn giả, agenda, ưu đãi, form; có dòng "Bản demo vòng loại – Dữ liệu mô phỏng AI" | Đúng như kỳ vọng; 3 lợi ích, 5 mục agenda | Đạt |
| TC02 | Nhập thiếu | Để trống tên sự kiện, bấm "Tạo landing page" | Báo "Vui lòng nhập tên sự kiện." dưới ô, không tạo trang | Hiện đúng thông báo, ô viền đỏ | Đạt |
| TC03 | Nhập sai | Form đăng ký: SĐT "12345", email "abc" | Báo lỗi SĐT và email ngay dưới từng ô, không lưu | "Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)." và "Email không đúng định dạng…" | Đạt |
| TC04 | Bình thường | Đăng ký với SĐT "+84 912 345 678", email hợp lệ, tick đồng ý | Đăng ký thành công, SĐT lưu dạng 0912345678, số đăng ký +1 | "Đăng ký thành công!", số đếm = 1 | Đạt |
| TC05 | Biên – trùng | Đăng ký lại cùng SĐT 0912345678 với email khác | Báo đã đăng ký, không ghi thêm | "Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.", số đếm giữ nguyên | Đạt |
| TC06 | Thời gian thực | Mở 2 tab, đăng ký ở tab 2 | Tab 1 tự tăng số đăng ký không cần tải lại | Tab 1 tăng từ 1 lên 2 | Đạt |
| TC07 | Biên – đã qua | Sửa thời gian sự kiện về quá khứ | Hiện "Sự kiện đã diễn ra", không đếm số âm, ẩn form | Đúng như kỳ vọng, nhãn trạng thái "Sự kiện đã diễn ra" | Đạt |
| TC08 | Biên – hết chỗ | Số chỗ = 2, đã có 2 người, đăng ký người thứ 3 | Chuyển vào danh sách chờ, nút đổi thành "Vào danh sách chờ" | "Sự kiện đã đủ chỗ. Bạn đã được thêm vào danh sách chờ…" | Đạt |
| TC09 | Sự cố AI | Chế độ copy prompt, dán kết quả có lời dẫn, \`\`\`json, nháy cong, dấu phẩy thừa, chỉ 2 lợi ích | App vẫn đọc được, bù lợi ích thứ 3 và báo rõ | "Đã dùng kết quả AI. Lưu ý: Thiếu lợi ích số 3, đã bù bằng bản mô phỏng." | Đạt |
| TC10 | Bình thường | Bấm "+ Tạo trang mới" | Form trống, trang cũ vẫn trong "Sự kiện của tôi" | Đúng như kỳ vọng | Đạt |
| TC11 | Bình thường | Đổi mẫu sang "Thiệp cưới Online" sau khi đã tạo trang | Giao diện đổi, nội dung giữ nguyên, nhãn đổi sang "Xác nhận tham dự" | Đúng như kỳ vọng | Đạt |
| TC12 | Nhập sai | Thiệp cưới: link đặt lịch studio = "javascript:alert(1)" | Báo lỗi, không chèn link | "Link đặt lịch phải bắt đầu bằng https://" | Đạt |
| TC13 | Bình thường – thiết bị thật | Xuất bản trên GitHub Pages, quét QR bằng điện thoại, đăng ký | Trang mở trên điện thoại, số đếm tăng | Trang hiển thị đầy đủ, "1 người đã đăng ký" | Đạt |
| TC14 | Bảo mật | Tài khoản Google khác cố đọc danh sách đăng ký của sự kiện (Firebase Emulator) | Bị từ chối | `permission-denied` | Đạt |
| TC15 | Biên – đồng thời | Hai khách đăng ký cùng lúc khi gần hết chỗ (Firebase Emulator) | Không vượt số chỗ, cả hai được xử lý đúng | Không vượt chỗ, cả hai vào danh sách chờ đúng quy tắc | Đạt |

**Kiểm thử tự động bổ sung**: 33 ca quy tắc bảo mật Firestore (`firebase/rules.test.mjs`); đồng bộ Google Sheet khi mất mạng rồi phục hồi (`tests/e2e-sheet.cjs`); builder, xem thử trạng thái, ảnh, lead (`tests/`). Tất cả đạt, không có lỗi console.

**Chưa kiểm chứng**: gọi Gemini API thật trong môi trường phát triển (không có key); Google Sheet với Apps Script thật.
