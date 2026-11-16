# Bảng kiểm thử: <Tên sản phẩm>

**Đội:** <Tên đội> · **Bảng:** <A / B> · **Thử ngày:** <dd/mm/yyyy>, <giờ> · **Môi trường:** <bản online GitHub Pages / local>, <trình duyệt, cỡ màn hình>

Chỉ ghi kết quả đã chạy thật. Ca nào là test tự động, ca nào thử tay, ca nào dùng AI thật hay mô phỏng: ghi rõ ở cột "Dữ liệu và bước thử" hoặc ngay dưới bảng.

## Yêu cầu tối thiểu

| Bảng | Tổng | Bắt buộc |
|---|---|---|
| **A** (Công nghệ) | ≥ 6 ca | 2 ca bình thường · 2 ca đầu vào sai · 2 ca biên hoặc sự cố |
| **B** (Kinh tế) | ≥ 3 ca | 1 ca bình thường · 1 ca thiếu hoặc sai · 1 ca biên |

Ghi chú chung kết: ca mobile 360px và 390px (TC07, TC08) là bắt buộc, kiểm đủ 5 tiêu chí của thể lệ.

Mẹo: đặt "Loại ca" đúng nhãn ở cột 2 để BTC dò nhanh. Một ca có thể đáp ứng cả Bảng A và Bảng B; ghi chú ở cột "Loại ca" (ví dụ: `Bình thường (A, B)`).

## Bảng ca kiểm thử

| Mã ca | Loại ca | Dữ liệu và bước thử | Kỳ vọng | Kết quả thực tế | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| TC01 | Bình thường (A, B) | <Dữ liệu mẫu, ví dụ: bấm "Điền dữ liệu mẫu" → "<nút tạo>"> | <Hiện đủ <n> phần, có nhãn chế độ> | <Ghi đúng điều quan sát được, kèm ngày> | <Đạt / Chưa đạt> |
| TC02 | Bình thường (A) | <…> | <…> | <…> | <…> |
| TC03 | Đầu vào sai (A, B) | <Bỏ trống trường bắt buộc, ví dụ: tên sự kiện> | <Báo lỗi ngay dưới ô, không tạo dữ liệu> | <…> | <…> |
| TC04 | Đầu vào sai (A) | <Định dạng sai, ví dụ: SĐT "12345", email "abc"> | <Báo lỗi từng ô, không lưu> | <…> | <…> |
| TC05 | Biên hoặc sự cố (A, B) | <Trùng dữ liệu, ví dụ: đăng ký lại cùng SĐT> | <Báo đã có, không ghi thêm> | <…> | <…> |
| TC06 | Biên hoặc sự cố (A) | <Hết chỗ, sự kiện đã qua, hoặc AI trả JSON lỗi> | <Chuyển danh sách chờ / hiện "<trạng thái>" / bù bằng bản mô phỏng và báo rõ> | <…> | <…> |

| TC07 | Mobile 360px | Mở bản online ở rộng 360px (DevTools hoặc điện thoại), đi trọn luồng chính: nhập → kết quả → lưu → xem lại | 5 tiêu chí: không cuộn ngang; nút/ô nhập đủ to, không chồng; chữ đọc được; luồng chính làm xong; tab/điều hướng rõ vị trí | <Ghi đúng điều quan sát được, kèm ảnh `docs/minh-chung-chot/`> | <…> |
| TC08 | Mobile 390px | Như TC07 ở rộng 390px | Như TC07 | <…> | <…> |
| TC09 | Dữ liệu mẫu có nhãn (B) | Bấm "<Điền dữ liệu mẫu>" và nạp file BTC (nếu có) | Mọi số mẫu/mô phỏng có nhãn rõ cạnh số | <…> | <…> |
| TC10 | Giả định và hòa vốn (B) | Đổi 1 giả định ±20%, xem kịch bản, hòa vốn, ưu đãi có lỗ không | Số đổi đúng theo công thức; mẫu số 0 hiện "Không đủ dữ liệu" | <…> | <…> |

Thêm ca nếu có thời gian (TC11 trở đi), ưu tiên ca liên quan đến luồng chấm điểm chính.

## Kiểm thử tự động (nếu có)

- Lệnh: `<lệnh test>`: <số ca đạt>/<tổng số ca>, không lỗi console.
- File test: `tests/<tên file>`.

## Chưa kiểm chứng

- <Ví dụ: gọi AI thật chưa thử vì không có key. Cách thử: nhập key vào ô <…>, bấm <…>.>
- <Ví dụ: thử trên điện thoại thật chưa làm, mới thử bằng giả lập.>
