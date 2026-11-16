# Run-sheet pitch 10 phút: {{TEN_APP}}

> Nguồn sự thật cho cả đội. `CUE-CARDS.md` sinh ra từ bảng này: **sửa ở đây trước, rồi cập nhật thẻ**. Điền mọi `{{...}}` bằng nội dung thật của app; không bịa số (chỉ dùng số đã chạy thật, có trong `BANG-KIEM-THU.md`).
> Phiên bản đội: 3 người, vai cố định. Diệu Anh mở (bài toán, nỗi đau, UI/UX sơ bộ) · Vũ Trí Dũng giữa (tính năng + demo) · Nguyên, trưởng nhóm, cuối (kỹ thuật, tổng kết, phản biện, Q&A) và là **neo dự phòng**.
> Mỗi slide chỉ có **3 neo**: `V` = 1 câu vấn đề · `T` = 1 thao tác/điểm nhấn · `S` = 1 con số chứng minh. Mỗi neo ≤ 15 giây. Hết mốc giờ của slide thì **chuyển ngay**, dù chưa nói hết.

## 1. Bảng run-sheet (11 slide, tổng 10:00)

| # | Người nói | Mốc giờ (mốc cứng chuyển slide) | 3 neo (V · T · S) | Câu chuyền mic (cuối phần) |
|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (cứng 00:40) | V: {{NHOM_NGUOI_DUNG}} đang mất {{VIEC_TON_THOI_GIAN}} · T: tên app + 1 câu hứa · S: {{SO_MUC_TIEU}} | — |
| 2 | Diệu Anh | 00:35–01:30 (cứng 01:35) | V: {{NOI_DAU_CHINH}} · T: kể 1 tình huống có giờ/số của {{PERSONA}} · S: {{SO_NOI_DAU}} | — |
| 3 | Diệu Anh | 01:30–02:30 (cứng 02:35) | V: giải pháp một câu: {{GIAI_PHAP_1_CAU}} · T: chỉ vào ảnh màn hình chính, nêu 1 điểm UI/UX ({{DIEM_UI}}) · S: {{SO_THAO_TAC_HOAN_THANH}} | "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay cho mọi người xem." |
| 4 | Dũng | 02:30–03:15 (cứng 03:20) | V: 5 tính năng giải đúng đề · T: nhấn 1 quy tắc nghiệp vụ {{QUY_TAC_CHINH}} · S: {{SO_TINH_NANG}} tính năng chạy thật | — |
| 5 | Dũng | 03:15–03:55 (cứng 04:00) | V: người dùng đi qua bao nhiêu bước · T: chỉ đúng {{SO_BUOC}} bước trên slide · S: {{THOI_GIAN_LUONG_CHINH}} từ đầu đến kết quả | "Giờ mình **bấm thật**." (chuyển sang demo) |
| 6 | Dũng | 03:55–05:10 (cứng 05:15) | V: ca bình thường · T: {{THAO_TAC_1}} → {{THAO_TAC_2}} → {{THAO_TAC_3}} (mỗi thao tác ≤ 25 giây) · S: kết quả hiện sau {{GIAY_PHAN_HOI}} giây | — |
| 7 | Dũng | 05:10–06:15 (cứng 06:20) | V: ca nhập sai + ca biên · T: {{CA_SAI}} báo lỗi ngay; {{CA_BIEN}}; mobile 390px · S: {{SO_CA_LOI_BAT_DUOC}} ca lỗi được chặn | "Phần bên trong chạy thế nào, mình xin nhường **Nguyên**." |
| 8 | Nguyên | 06:15–07:15 (cứng 07:20) | V: kiến trúc + AI/proxy gọn trong 1 hình · T: chỉ chỗ key KHÔNG nằm trong mã/trình duyệt, và nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} | — |
| 9 | Nguyên | 07:15–08:15 (cứng 08:20) | V: kiểm thử + bảo mật · T: chỉ 1 ca đã bắt lỗi thật ({{CA_BAT_LOI}}) · S: {{SO_CA_DAT}}/{{TONG_CA}} ca đạt, quét key: {{KET_QUA_QUET}} | — |
| 10 | Nguyên | 08:15–09:00 (cứng 09:05) | V: giá trị đo được · T: nói thẳng 1 giới hạn + bước tiếp theo · S: {{SO_GIA_TRI}} | — |
| 11 | Nguyên | 09:00–09:45 (cứng 09:50) | V: tổng kết 1 câu · T: QR + link, mời hỏi đáp · S: lặp lại {{SO_NHO_NHAT}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." |

Đệm an toàn: **09:45–10:00** (15 giây) cho sự cố. Nếu chạy đúng giờ, kết thúc sớm hơn là tốt.

Slide 6–7 (demo) là ngoại lệ so với trần 45 giây: chia theo **thao tác**, mỗi thao tác ≤ 25 giây, tổng hai slide ≤ 2:20.

## 2. Mốc theo dõi giờ (người giữ đồng hồ: Nguyên, nhìn đồng hồ phím `N` hoặc đồng hồ tay)

| Điểm kiểm | Đúng giờ | Nếu trễ |
|---|---|---|
| Diệu Anh chuyền mic | 02:30 | trễ > 20 giây: Dũng bỏ slide 5 (nói gộp vào slide 4) |
| Dũng chuyền mic | 06:15 | trễ > 30 giây: Dũng rút slide 7 còn 1 thao tác, hoặc Nguyên chọn bản ngắn |
| Nguyên bắt đầu | 06:15 | xem mục 3 để chọn bản |

## 3. Phần của Nguyên: 3 phiên bản (chọn theo giờ vào phần)

Quy tắc chọn: Nguyên nhìn đồng hồ ngay khi nhận mic.
- Vào **≤ 06:30** → bản đầy đủ 3:30.
- Vào **06:31–07:45** → bản rút gọn 2:00.
- Vào **> 07:45** → bản khẩn cấp 1:00.
- Mọi bản đều **kết thúc trước 09:45** và **luôn có slide 11**.

### 3.1. Bản đầy đủ 3:30 (06:15–09:45)
Slide 8 → 9 → 10 → 11, theo bảng ở mục 1.

### 3.2. Bản rút gọn 2:00 (bỏ slide 10)

| Slide | Thời lượng | 3 neo |
|---|---|---|
| 8 | 00:40 | V: kiến trúc + AI/proxy trong 1 hình · T: key không lộ + nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} |
| 9 | 00:40 | V: kiểm thử + bảo mật · T: 1 ca bắt lỗi thật · S: {{SO_CA_DAT}}/{{TONG_CA}} |
| 11 | 00:40 | V: tổng kết 1 câu · T: QR + link · S: {{SO_NHO_NHAT}} |

Nhảy slide 10: bấm `→` hai lần liên tiếp (slide 10 chỉ lướt qua).

### 3.3. Bản khẩn cấp 1:00 (chỉ 2 slide)

| Slide | Thời lượng | Nói gì |
|---|---|---|
| 9 | 00:25 | "Đội kiểm thử {{TONG_CA}} ca, đạt {{SO_CA_DAT}}, key không nằm trong mã." (đọc đúng 1 con số trên slide) |
| 11 | 00:35 | Tổng kết 1 câu + QR + "Đội xin nhận câu hỏi." |

Phần kỹ thuật bị bỏ sẽ trả lời ở Q&A (xem `HOI-DAP.md`, các câu gắn Nguyên).

## 4. Chi tiết demo (slide 6–7, của Dũng)

Chuẩn bị 60 giây trước giờ: tab link online đã tải, dữ liệu mẫu nạp (`{{LENH_NAP_DU_LIEU}}` hoặc `?demo=1`), zoom 100%, tắt thông báo, video 30 giây mở sẵn ở tab khác, ảnh chụp trong slide phụ.

| Thao tác (slide) | Làm gì trên màn hình | Nói 1 câu | Tính năng |
|---|---|---|---|
| 6a (≤ 25s) | {{THAO_TAC_1}} | {{CAU_NOI_1}} | T1 |
| 6b (≤ 25s) | {{THAO_TAC_2}} (chỉ nhãn chế độ AI nếu có) | {{CAU_NOI_2}} | T2 |
| 6c (≤ 25s) | {{THAO_TAC_3}} | {{CAU_NOI_3}} | T3/T4 |
| 7a (≤ 25s) | Cố tình nhập sai: {{CA_SAI}} | "Báo lỗi ngay, không lưu dữ liệu sai." | Kiểm tra đầu vào |
| 7b (≤ 25s) | Ca biên: {{CA_BIEN}} | {{CAU_NOI_BIEN}} | Nghiệp vụ |
| 7c (≤ 15s) | Thu nhỏ cửa sổ 390px, chuyển Sáng/Tối 1 lần | "Dùng được trên điện thoại." | Responsive |

### Dự phòng khi demo lỗi (quy tắc: lỗi > 10 giây thì chuyển, không sửa trên sân khấu)

| Tình huống | Làm ngay | Câu nói bình tĩnh |
|---|---|---|
| Trang online không tải | Phím chuyển sang tab video 30 giây | "Mạng đang chậm, em chuyển sang bản quay sẵn của đúng bản này." |
| AI không trả kết quả | Chuyển chế độ mô phỏng, chỉ nhãn | "Đang dùng chế độ mô phỏng, có nhãn rõ trên giao diện." |
| Form không lưu | Tải lại, nạp dữ liệu mẫu, làm tiếp từ thao tác đang dở | — |
| Mất mạng hoàn toàn | Bản local (`{{LENH_CHAY_LOCAL}}`) hoặc ảnh chụp trong slide phụ | "Em xin dùng ảnh chụp, thao tác y hệt." |
| Lố giờ | Bỏ thao tác 7b, giữ 7a | "Ca biên có trong bảng kiểm thử." |

## 5. Sau buổi tập
- [ ] Ghi lại slide nào vượt mốc cứng; cắt lời, không cắt neo `S` (con số).
- [ ] Tập đủ 2 lần có đồng hồ, 1 lần cố ý trễ 40 giây ở Diệu Anh để Nguyên tập chọn bản rút gọn.
- [ ] Cập nhật `CUE-CARDS.md` và in lại nếu sửa bảng.
