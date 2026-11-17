# Bảng kiểm thử — Xclipse (Đề 8, Bảng B)

Kết quả thực tế lấy từ các lần chạy kiểm thử tự động bằng trình duyệt thật (Playwright/Chromium) ngày 26–27/10/2026; ca có ghi "thiết bị thật" do nhóm thử trên GitHub Pages + điện thoại. Mã script tương ứng nằm trong `tests/`.

**Chạy lại ngày 09/11/2026** (Chromium thật qua Playwright, màn hình 1440x900, giao diện sáng, bản mới nhất): TC01, TC02, TC03, TC04, TC05, TC07, TC08, tức đủ 3 loại ca bắt buộc của Bảng B. Mỗi ca có ảnh chụp kết quả trong `docs/evidence/kiem-thu/` (có dòng chú thích mã ca và ngày). Không có lỗi trên console trong cả lượt chạy. Bản in: [bang-kiem-thu.pdf](evidence/bang-kiem-thu.pdf).

## Ca bắt buộc theo Bảng B (tối thiểu 3)

| Yêu cầu | Ca đáp ứng | Mô tả ngắn |
|---|---|---|
| Ca bình thường | **TC01**, TC04 | Tạo trang bằng dữ liệu mẫu; đăng ký hợp lệ |
| Ca nhập thiếu / sai | **TC02**, TC03 | Bỏ trống tên sự kiện; SĐT và email sai định dạng |
| Ca biên | **TC05**, TC07, TC08 | Đăng ký trùng SĐT; sự kiện đã diễn ra; đủ chỗ → danh sách chờ |

Lưu ý: dòng cảnh báo mô phỏng AI trong giao diện đã được đổi thành đúng câu "Bản demo vòng loại - Dữ liệu mô phỏng AI" (xem README, mục 1 và checklist nộp bài).

| Mã ca | Loại ca | Dữ liệu và bước thử | Kỳ vọng | Kết quả thực tế | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| TC01 | Bình thường | Bấm "Điền dữ liệu mẫu" → "✨ Tạo landing page" (AI mô phỏng) | Trang hiện đủ hero, đếm ngược, giới thiệu, 3 lợi ích, diễn giả, agenda, ưu đãi, form; có dòng cảnh báo mô phỏng AI | 09/11/2026: trang có 8 phần (đếm ngược, giới thiệu, 3 lợi ích, diễn giả, hình ảnh, chương trình, ưu đãi, form); dòng cảnh báo trên thanh công cụ đúng câu "Bản demo vòng loại - Dữ liệu mô phỏng AI". Lưu ý: ở màn 1440px dòng này bị xuống 4 dòng nhỏ trên thanh công cụ nên khó đọc. Ảnh: [TC01](evidence/kiem-thu/TC01-binh-thuong-tao-trang.png) | Đạt |
| TC02 | Nhập thiếu | Để trống tên sự kiện, bấm "Tạo landing page" | Báo "Vui lòng nhập tên sự kiện." dưới ô, không tạo trang | 09/11/2026: bấm "Tạo landing page" khi form trống: hiện "Vui lòng nhập tên sự kiện." dưới ô tên (kèm báo thiếu thời gian, địa điểm, diễn giả), ô viền đỏ, không tạo trang. Ảnh: [TC02](evidence/kiem-thu/TC02-nhap-thieu.png) | Đạt |
| TC03 | Nhập sai | Form đăng ký: SĐT "12345", email "abc" | Báo lỗi SĐT và email ngay dưới từng ô, không lưu | 09/11/2026: "Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)." và "Email không đúng định dạng (ví dụ: ten@gmail.com)." dưới từng ô; không có đăng ký nào được lưu. Ảnh: [TC03](evidence/kiem-thu/TC03-nhap-sai.png) | Đạt |
| TC04 | Bình thường | Đăng ký với SĐT "+84 912 345 678", email hợp lệ, tick đồng ý | Đăng ký thành công, SĐT lưu dạng 0912345678, số đăng ký +1 | 09/11/2026: "Đăng ký thành công! Hẹn gặp bạn tại sự kiện."; số đếm từ 0 lên 1; SĐT lưu là 0912345678. Ảnh: [TC04](evidence/kiem-thu/TC04-dang-ky-hop-le.png) | Đạt |
| TC05 | Biên – trùng | Đăng ký lại cùng SĐT 0912345678 với email khác | Báo đã đăng ký, không ghi thêm | 09/11/2026: "Bạn đã đăng ký rồi bằng số điện thoại hoặc email này."; số đếm giữ nguyên 1, chỉ có 1 bản ghi. Ảnh: [TC05](evidence/kiem-thu/TC05-trung-sdt.png) | Đạt |
| TC06 | Thời gian thực | Mở 2 tab, đăng ký ở tab 2 | Tab 1 tự tăng số đăng ký không cần tải lại | Tab 1 tăng từ 1 lên 2 | Đạt |
| TC07 | Biên – đã qua | Sửa thời gian sự kiện về quá khứ | Hiện "Sự kiện đã diễn ra", không đếm số âm, ẩn form | 09/11/2026 (đặt sự kiện 20/10/2026): nhãn trạng thái và khối đếm ngược đổi thành "Sự kiện đã diễn ra", không có số âm, form đăng ký bị ẩn. Lưu ý: nút "Đăng ký tham gia" ở phần đầu trang vẫn hiển thị. Ảnh: [TC07](evidence/kiem-thu/TC07-su-kien-da-qua.png) | Đạt (còn 1 điểm nhỏ ở nút phần đầu trang) |
| TC08 | Biên – hết chỗ | Số chỗ = 2, đã có 2 người, đăng ký người thứ 3 | Chuyển vào danh sách chờ, nút đổi thành "Vào danh sách chờ" | 09/11/2026 (số chỗ 2): người thứ 3 nhận "Sự kiện đã đủ chỗ. Bạn đã được thêm vào danh sách chờ, ban tổ chức sẽ liên hệ nếu có chỗ trống."; nút là "Vào danh sách chờ"; số đăng ký giữ 2. Ảnh: [TC08](evidence/kiem-thu/TC08-het-cho.png) | Đạt |
| TC09 | Sự cố AI | Chế độ copy prompt, dán kết quả có lời dẫn, \`\`\`json, nháy cong, dấu phẩy thừa, chỉ 2 lợi ích | App vẫn đọc được, bù lợi ích thứ 3 và báo rõ | "Đã dùng kết quả AI. Lưu ý: Thiếu lợi ích số 3, đã bù bằng bản mô phỏng." | Đạt |
| TC10 | Bình thường | Bấm "+ Tạo trang mới" | Form trống, trang cũ vẫn trong "Sự kiện của tôi" | Đúng như kỳ vọng | Đạt |
| TC11 | Bình thường | Đổi mẫu sang "Thiệp cưới Online" sau khi đã tạo trang | Giao diện đổi, nội dung giữ nguyên, nhãn đổi sang "Xác nhận tham dự" | Đúng như kỳ vọng | Đạt |
| TC12 | Nhập sai | Thiệp cưới: link đặt lịch studio = "javascript:alert(1)" | Báo lỗi, không chèn link | "Link đặt lịch phải bắt đầu bằng https://" | Đạt |
| TC13 | Bình thường – thiết bị thật | Xuất bản trên GitHub Pages, quét QR bằng điện thoại, đăng ký | Trang mở trên điện thoại, số đếm tăng | Trang hiển thị đầy đủ, "1 người đã đăng ký" | Đạt |
| TC14 | Bảo mật | Tài khoản Google khác cố đọc danh sách đăng ký của sự kiện (Firebase Emulator) | Bị từ chối | `permission-denied` | Đạt |
| TC15 | Biên – đồng thời | Hai khách đăng ký cùng lúc khi gần hết chỗ (Firebase Emulator) | Không vượt số chỗ, cả hai được xử lý đúng | Không vượt chỗ, cả hai vào danh sách chờ đúng quy tắc | Đạt |

**Kiểm thử tự động bổ sung**: 33 ca quy tắc bảo mật Firestore (`firebase/rules.test.mjs`); đồng bộ Google Sheet khi mất mạng rồi phục hồi (`tests/e2e-sheet.cjs`); builder, xem thử trạng thái, ảnh, lead (`tests/`). Tất cả đạt, không có lỗi console.

**Chưa kiểm chứng**: gọi Gemini API thật trong môi trường phát triển (không có key); Google Sheet với Apps Script thật.
