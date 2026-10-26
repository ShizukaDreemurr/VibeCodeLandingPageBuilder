# Kết nối Google Sheet để nhận danh sách đăng ký

Mỗi lượt đăng ký trên landing page sẽ **tự ghi thêm một dòng vào Google Sheet**, và số người đăng ký hiển thị trên trang được **đồng bộ giữa mọi thiết bị** (cập nhật khoảng 15 giây/lần). Không cần server hay database riêng.

Nếu không kết nối, app vẫn chạy bình thường với localStorage.

## Cài đặt (khoảng 5 phút, làm 1 lần)
1. Tạo một Google Sheet mới (ví dụ đặt tên "Đăng ký sự kiện").
2. Trên Sheet, chọn **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mặc định, dán toàn bộ nội dung file `integrations/google-sheet/Code.gs`, bấm **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
   - Bấm **Triển khai**, cấp quyền khi Google hỏi (chọn tài khoản → Nâng cao → Đi tới dự án → Cho phép).
5. Copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
6. Trong EventPage AI: mở **Kết nối Google Sheet (tuỳ chọn)** → dán URL → **Kiểm tra kết nối** → bấm **✨ Tạo landing page** để lưu.

Mỗi sự kiện tự tạo một tab riêng trong Sheet, gồm các cột: Thời gian, Mã đăng ký, Họ tên, Số điện thoại, Email, Trạng thái, Sự kiện.

## Cách hoạt động
| Tình huống | App xử lý |
|---|---|
| Đăng ký bình thường | Lưu trên máy, gửi lên Sheet, chờ Sheet xác nhận rồi báo thành công |
| Trùng số điện thoại/email đã đăng ký **từ thiết bị khác** | Sheet phát hiện trùng → báo "Bạn đã đăng ký rồi" |
| Hai người đăng ký cùng lúc khi gần hết chỗ | Apps Script khoá ghi tuần tự (LockService) → không vượt số chỗ |
| Mất mạng / Sheet lỗi | Vẫn nhận đăng ký, lưu trên máy, hiện "Chờ gửi" và **tự gửi lại** mỗi 15 giây |
| Gửi lại bản ghi đã gửi | Sheet nhận ra mã đăng ký → không ghi trùng |

Xem báo cáo: dùng trực tiếp Google Sheet (lọc, biểu đồ) hoặc nối Sheet với **Looker Studio** (miễn phí) để có dashboard tự cập nhật.

## Giới hạn
- Số đăng ký trên trang cập nhật theo chu kỳ ~15 giây, không tức thì như Firebase.
- Apps Script miễn phí có hạn mức lượt gọi mỗi ngày; đủ cho sự kiện vừa và nhỏ (hàng nghìn lượt đăng ký).
- Ai có URL Apps Script đều gửi được dữ liệu vào Sheet → không công khai URL ở nơi khác ngoài landing page.
- Dữ liệu cá nhân (tên, SĐT, email) nằm trong Google Drive của người tạo Sheet; người tạo chịu trách nhiệm bảo mật theo quy định bảo vệ dữ liệu cá nhân.

## Kiểm thử đã làm
Kiểm thử bằng một máy chủ giả lập cùng API (không phải Google thật): đăng ký, trùng giữa 2 thiết bị, đồng bộ số đếm, mất kết nối rồi tự gửi lại. **Chưa chạy với Apps Script thật** — nhóm cần thử theo các bước trên trước khi demo.
