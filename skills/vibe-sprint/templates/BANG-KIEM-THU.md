# Bảng kiểm thử: <Tên sản phẩm>

**Đội:** <Tên đội> · **Bảng:** <A / B> · **Thử ngày:** <dd/mm/yyyy>, <giờ> · **Môi trường:** <bản online GitHub Pages / local>, <trình duyệt, cỡ màn hình>

Chỉ ghi kết quả đã chạy thật. Ca nào là test tự động, ca nào thử tay, ca nào dùng AI thật hay mô phỏng: ghi rõ ở cột "Dữ liệu và bước thử" hoặc ngay dưới bảng.

## Yêu cầu tối thiểu

| Bảng | Tổng | Bắt buộc |
|---|---|---|
| **A** (Công nghệ) | ≥ 6 ca | 2 ca bình thường · 2 ca đầu vào sai · 2 ca biên hoặc sự cố |
| **B** (Kinh tế) | ≥ 3 ca | 1 ca bình thường · 1 ca thiếu hoặc sai · 1 ca biên |

Ghi chú chung kết: ca mobile 360px và 390px (TC07, TC08) là bắt buộc, kiểm đủ 5 tiêu chí của thể lệ bằng bảng M1–M5 bên dưới. Ảnh minh chứng là **ảnh điện thoại dọc**, do agent Claude Sonnet chụp bằng giả lập điện thoại.

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
| TC07 | Mobile 360px | Mở bản online ở rộng 360px (giả lập điện thoại 360×780 hoặc máy thật), đi trọn luồng chính: nhập → kết quả → lưu → xem lại | 5 tiêu chí: không cuộn ngang; nút/ô nhập đủ to, không chồng; chữ đọc được; luồng chính làm xong; tab/điều hướng rõ vị trí | <Ghi đúng điều quan sát được, kèm ảnh dọc `docs/minh-chung-chot/`, xem bảng M1–M5> | <…> |
| TC08 | Mobile 390px | Như TC07 ở rộng 390px | Như TC07 | <…> | <…> |
| TC09 | Dữ liệu mẫu có nhãn (B) | Bấm "<Điền dữ liệu mẫu>" và nạp file BTC (nếu có) | Mọi số mẫu/mô phỏng có nhãn rõ cạnh số | <…> | <…> |
| TC10 | Giả định và hòa vốn (B) | Đổi 1 giả định ±20%, xem kịch bản, hòa vốn, ưu đãi có lỗ không | Số đổi đúng theo công thức; mẫu số 0 hiện "Không đủ dữ liệu" | <…> | <…> |

Thêm ca nếu có thời gian (TC11 trở đi), ưu tiên ca liên quan đến luồng chấm điểm chính.

## Mobile: 5 tiêu chí của thể lệ (chạy ở 360 VÀ 390px, giả lập điện thoại dọc)

Giám khảo chấm app trên điện thoại. Agent Claude Sonnet mở app bằng giả lập điện thoại (Playwright isMobile + hasTouch; 360×780 và 390×844, DPR 3), thử từng ca bên dưới rồi chụp **ảnh dọc** (`node tools/shots-mobile.cjs <URL> shots-mobile --width 360 --height 780` và bản 390×844). Mỗi ô "Kết quả thực tế" ghi điều quan sát được ở **cả 360 và 390**, kèm tên ảnh. Ghi rõ "giả lập" nếu chưa thử trên máy thật.

| Mã ca | Tiêu chí | Cách thử (mỗi màn chính, ở 360 và 390px) | Kỳ vọng | Kết quả thực tế (360 / 390) | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| M1 | Không tràn ngang | Mỗi tab, mỗi dialog/bottom sheet; kiểm `document.documentElement.scrollWidth <= innerWidth`, vuốt ngang thử | Không có thanh cuộn ngang; bảng/biểu đồ co hoặc cuộn trong khung riêng | <…> | <…> |
| M2 | Nút/ô nhập đủ to | Đo chiều cao nút, ô nhập, tab dưới (≥ 44px); bấm thử từng nút bằng cảm ứng | Mọi mục bấm ≥ 44px, không chồng nhau, khoảng cách đủ | <…> | <…> |
| M3 | Chữ đọc được | Không zoom; ô nhập ≥ 16px (iOS không tự phóng to); độ tương phản chữ ở Sáng và Tối | Chữ nội dung ≥ 14px, ô nhập ≥ 16px, đọc rõ cả hai giao diện | <…> | <…> |
| M4 | Luồng chính trọn vẹn | Nhập (có "Điền dữ liệu mẫu") → AI/mô phỏng → kết quả → lưu → xem lại, chỉ dùng cảm ứng | Làm xong không cần chuột/bàn phím vật lý, không bước nào bị khuất | <…> | <…> |
| M5 | Điều hướng rõ | Tab dưới/thanh điều hướng: tab đang chọn nổi bật, đi hết các tab, nút Quay lại | Luôn biết đang ở đâu; không tab nào bị cắt ở 360px | <…> | <…> |

Ảnh dọc kèm theo (đặt ở `docs/minh-chung-chot/`): `NN-tab-light.png` và `NN-tab-dark.png` ở 360 và 390, cộng 1 ảnh desktop.

## Kiểm thử tự động (nếu có)

- Lệnh: `<lệnh test>`: <số ca đạt>/<tổng số ca>, không lỗi console.
- File test: `tests/<tên file>`.

## Chưa kiểm chứng

- <Ví dụ: gọi AI thật chưa thử vì không có key. Cách thử: nhập key vào ô <…>, bấm <…>.>
- <Ví dụ: thử trên điện thoại thật chưa làm, mới thử bằng giả lập điện thoại 360×780 / 390×844.>
