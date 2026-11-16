# Run-sheet pitch 10 / 5 / 3 phút: {{TEN_APP}}

> Nguồn sự thật cho cả đội. `CUE-CARDS.md` sinh ra từ bảng này: **sửa ở đây trước, rồi cập nhật thẻ**. Điền mọi `{{...}}` bằng nội dung thật của app; không bịa số (chỉ dùng số đã chạy thật, có trong `BANG-KIEM-THU.md`).
> Phiên bản đội: 3 người, vai cố định. Diệu Anh mở (bài toán, nỗi đau, UI/UX sơ bộ) · Vũ Trí Dũng giữa (tính năng + demo) · Nguyên, trưởng nhóm, cuối (kỹ thuật, tổng kết, phản biện, Q&A) và là **neo dự phòng**.
> Mỗi slide chỉ có **3 neo**: `V` = 1 câu vấn đề · `T` = 1 thao tác/điểm nhấn · `S` = 1 con số chứng minh. Mỗi neo ≤ 15 giây. Hết mốc giờ của slide thì **chuyển ngay**, dù chưa nói hết.

> **Thời lượng pitch do BTC báo sau (giống nhau cho mọi đội).** Có 3 bản: **10 phút** (mục 1–5, 11 slide), **5 phút** (mục 6.1, 7 slide), **3 phút** (mục 6.2, 5 slide). Chọn bản ngay khi BTC báo; vai Diệu Anh / Dũng / Nguyên giữ nguyên ở cả ba bản. **Round 1 không có Q&A**; Q&A chỉ ở vòng phản biện (đội được chọn), nơi Bảng Kinh tế phải trình bày thêm **giả định và cách tính**.
> **Bảng Kinh tế: slide/đoạn "Giả định & cách tính" là BẮT BUỘC trong cả ba bản** (10 phút: slide 10; 5 phút: slide 5; 3 phút: slide 4). Bảng Kỹ thuật dùng cùng vị trí cho "Quy tắc nghiệp vụ & quyết định kỹ thuật".

## 1. Bảng run-sheet (11 slide, tổng 10:00)

| # | Người nói | Mốc giờ (mốc cứng chuyển slide) | 3 neo (V · T · S) | Câu chuyền mic (cuối phần) |
|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (cứng 00:40) | V: {{NHOM_NGUOI_DUNG}} đang mất {{VIEC_TON_THOI_GIAN}} · T: tên app + 1 câu hứa · S: {{SO_MUC_TIEU}} | — |
| 2 | Diệu Anh | 00:35–01:30 (cứng 01:35) | V: {{NOI_DAU_CHINH}} · T: kể 1 tình huống có giờ/số của {{PERSONA}} · S: {{SO_NOI_DAU}} | — |
| 3 | Diệu Anh | 01:30–02:30 (cứng 02:35) | V: giải pháp một câu: {{GIAI_PHAP_1_CAU}} · T: chỉ vào 3 ghim số trên ảnh điện thoại dọc, nêu 1 điểm UI/UX ({{DIEM_UI}}) · S: {{SO_THAO_TAC_HOAN_THANH}} | "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay cho mọi người xem." |
| 4 | Dũng | 02:30–03:15 (cứng 03:20) | V: 5 tính năng giải đúng đề · T: nhấn 1 quy tắc nghiệp vụ {{QUY_TAC_CHINH}} · S: {{SO_TINH_NANG}} tính năng chạy thật | — |
| 5 | Dũng | 03:15–03:55 (cứng 04:00) | V: người dùng đi qua bao nhiêu bước · T: chỉ đúng {{SO_BUOC}} bước trên slide · S: {{THOI_GIAN_LUONG_CHINH}} từ đầu đến kết quả | "Giờ mình **bấm thật**." (chuyển sang demo) |
| 6 | Dũng | 03:55–05:10 (cứng 05:15) | V: ca bình thường · T: {{THAO_TAC_1}} → {{THAO_TAC_2}} → {{THAO_TAC_3}} (mỗi thao tác ≤ 25 giây) · S: kết quả hiện sau {{GIAY_PHAN_HOI}} giây | — |
| 7 | Dũng | 05:10–06:15 (cứng 06:20) | V: ca nhập sai + ca biên · T: {{CA_SAI}} báo lỗi ngay; {{CA_BIEN}}; 360/390px + Sáng/Tối trên điện thoại · S: {{SO_CA_LOI_BAT_DUOC}} ca lỗi được chặn | "Phần bên trong chạy thế nào, mình xin nhường **Nguyên**." |
| 8 | Nguyên | 06:15–07:15 (cứng 07:20) | V: kiến trúc + AI/proxy gọn trong 1 hình · T: chỉ chỗ key KHÔNG nằm trong mã/trình duyệt, và nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} | — |
| 9 | Nguyên | 07:15–08:15 (cứng 08:20) | V: kiểm thử + bảo mật · T: chỉ 1 ca đã bắt lỗi thật ({{CA_BAT_LOI}}) · S: {{SO_CA_DAT}}/{{TONG_CA}} ca đạt, quét key: {{KET_QUA_QUET}} | — |
| 10 | Nguyên | 08:15–09:00 (cứng 09:05) | **Giả định & cách tính (Kinh tế bắt buộc):** V: số trong app dựa trên giả định nào · T: chỉ bảng giả định (giá trị + nguồn), 3 kịch bản, điểm hòa vốn và dòng "ưu đãi có lỗ không"; nói thẳng 1 giới hạn · S: {{SO_HOA_VON}} (điểm hòa vốn) hoặc {{SO_GIA_TRI}} | — |
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

### 3.2. Bản rút gọn 2:00 (bỏ slide 9; **Bảng Kinh tế giữ slide 10**)

| Slide | Thời lượng | 3 neo |
|---|---|---|
| 8 | 00:40 | V: kiến trúc + AI/proxy trong 1 hình · T: key không lộ + nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} |
| 9 (Kỹ thuật) hoặc 10 (Kinh tế) | 00:40 | Kỹ thuật: V kiểm thử + bảo mật · T 1 ca bắt lỗi thật · S {{SO_CA_DAT}}/{{TONG_CA}}. **Kinh tế:** V số dựa trên giả định nào · T bảng giả định + hòa vốn + ưu đãi có lỗ không · S {{SO_HOA_VON}} |
| 11 | 00:40 | V: tổng kết 1 câu · T: QR + link · S: {{SO_NHO_NHAT}} |

Nhảy slide: Kinh tế bỏ slide 9, bấm `→` hai lần từ slide 8 sang 10; Kỹ thuật bỏ slide 10, bấm `→` hai lần từ 9 sang 11.

### 3.3. Bản khẩn cấp 1:00 (chỉ 2 slide)

| Slide | Thời lượng | Nói gì |
|---|---|---|
| 9 hoặc 10 | 00:25 | Kỹ thuật: "Đội kiểm thử {{TONG_CA}} ca, đạt {{SO_CA_DAT}}, key không nằm trong mã." · **Kinh tế:** "Mọi con số dựa trên {{SO_GIA_DINH}} giả định có nguồn; hòa vốn ở {{SO_HOA_VON}}; kịch bản xấu nhất vẫn {{KET_QUA_XAU_NHAT}}." (đọc đúng 1 con số trên slide) |
| 11 | 00:35 | Tổng kết 1 câu + QR + "Đội xin nhận câu hỏi." |

Phần kỹ thuật bị bỏ sẽ trả lời ở Q&A (xem `HOI-DAP.md`, các câu gắn Nguyên).

## 4. Chi tiết demo (slide 6–7, của Dũng)

### 4.0. Demo trên điện thoại (giám khảo chấm app trên điện thoại, nên demo cũng trên điện thoại)

| Việc | Cách làm |
|---|---|
| **Phát màn hình điện thoại lên máy chiếu** (ưu tiên) | Android: `scrcpy` (cáp USB, bật gỡ lỗi USB; `scrcpy --max-size 1280 --stay-awake`). iPhone: **QuickTime** (File > New Movie Recording > chọn iPhone, cáp Lightning/USB-C) hoặc **AirPlay** tới laptop (nếu có sẵn ứng dụng nhận). Thử ở phòng thi trước giờ, mang đủ cáp/đầu chuyển. |
| **Dự phòng 1: Chrome DevTools device mode** | Mở link online trên laptop, F12 > bật Device Toolbar (Ctrl+Shift+M) > **390 × 844** (đặt thêm 360 × 780 cho ca 7c), DPR 3, giả lập cảm ứng. Khung dọc nằm giữa màn chiếu, zoom 100%. |
| **Dự phòng 2: ảnh/video DỌC** | Ảnh chụp dọc 390×844@3x do agent Sonnet chụp sẵn (slide phụ "Dự phòng") + video quay màn hình điện thoại **theo chiều dọc** 30 giây, mở sẵn ở tab/app riêng. Không dùng ảnh ngang. |
| **Ai cầm điện thoại** | **Dũng** cầm và thao tác điện thoại (tay thuận cầm, ngón cái bấm); **Nguyên** giữ laptop (slide, tab video/DevTools dự phòng, đồng hồ). Diệu Anh không cầm gì ngoài mic. Chuyền điện thoại đồng thời với mic ở câu "Giờ mình **bấm thật**." |
| **Thứ tự demo = thứ tự tab dưới cùng** | Đi từ trái sang phải theo thanh tab dưới của app (ví dụ Tổng quan > Mục > Mô-đun); mỗi tab 1 thao tác ≤ 25 giây, người xem luôn biết đang ở đâu. Sau tab cuối mới làm ca sai/biên. |
| **Chuẩn bị máy** | Pin ≥ 80%, bật Không làm phiền, độ sáng tối đa, tắt xoay tự động (giữ dọc), khóa màn hình không tự tắt, trình duyệt toàn màn hình, link đã mở sẵn, dữ liệu mẫu đã nạp. |

Chuẩn bị 60 giây trước giờ: điện thoại đã phát lên máy chiếu (mục 4.0) hoặc DevTools 390×844 đã mở, tab link online đã tải, dữ liệu mẫu nạp (`{{LENH_NAP_DU_LIEU}}` hoặc `?demo=1`), zoom 100%, tắt thông báo, video 30 giây mở sẵn ở tab khác, ảnh chụp dọc trong slide phụ.

| Thao tác (slide) | Làm gì trên màn hình | Nói 1 câu | Tính năng |
|---|---|---|---|
| 6a (≤ 25s) | {{THAO_TAC_1}} | {{CAU_NOI_1}} | T1 |
| 6b (≤ 25s) | {{THAO_TAC_2}} (chỉ nhãn chế độ AI nếu có) | {{CAU_NOI_2}} | T2 |
| 6c (≤ 25s) | {{THAO_TAC_3}} | {{CAU_NOI_3}} | T3/T4 |
| 7a (≤ 25s) | Cố tình nhập sai: {{CA_SAI}} | "Báo lỗi ngay, không lưu dữ liệu sai." | Kiểm tra đầu vào |
| 7b (≤ 25s) | Ca biên: {{CA_BIEN}} | {{CAU_NOI_BIEN}} | Nghiệp vụ |
| 7c (≤ 15s) | Ngay trên điện thoại: chuyển Sáng/Tối 1 lần, chỉ thanh tab dưới (nếu có máy 360px thì cho xem 1 màn) | "Dùng được trên điện thoại." | Responsive |

### Dự phòng khi demo lỗi (quy tắc: lỗi > 10 giây thì chuyển, không sửa trên sân khấu)

| Tình huống | Làm ngay | Câu nói bình tĩnh |
|---|---|---|
| Trang online không tải | Phím chuyển sang tab video DỌC 30 giây (quay trên điện thoại) | "Mạng đang chậm, em chuyển sang bản quay sẵn của đúng bản này." |
| AI không trả kết quả | Chuyển chế độ mô phỏng, chỉ nhãn | "Đang dùng chế độ mô phỏng, có nhãn rõ trên giao diện." |
| Form không lưu | Tải lại, nạp dữ liệu mẫu, làm tiếp từ thao tác đang dở | — |
| Mất mạng hoàn toàn | Bản local (`{{LENH_CHAY_LOCAL}}`) mở trong DevTools 390×844, hoặc ảnh dọc trong slide phụ | "Em xin dùng ảnh chụp, thao tác y hệt." |
| Phát màn hình điện thoại hỏng (cáp/AirPlay) | Chuyển DevTools device mode 390×844 trên laptop, Nguyên thao tác | "Em chuyển sang giả lập điện thoại 390 pixel, cùng bản đang chạy." |
| Lố giờ | Bỏ thao tác 7b, giữ 7a | "Ca biên có trong bảng kiểm thử." |

## 5. Sau buổi tập
- [ ] Ghi lại slide nào vượt mốc cứng; cắt lời, không cắt neo `S` (con số).
- [ ] Tập đủ 2 lần có đồng hồ, 1 lần cố ý trễ 40 giây ở Diệu Anh để Nguyên tập chọn bản rút gọn.
- [ ] Cập nhật `CUE-CARDS.md` và in lại nếu sửa bảng.

## 6. Bản 5 phút và 3 phút (khi BTC báo thời lượng ngắn)

Mỗi bản chạy **cùng ba người, cùng câu mở và câu chuyền mic** như bản 10 phút; chỉ gộp slide. Luật: mỗi slide vẫn 3 neo `V · T · S`, có **1 con số lớn hoặc 1 ảnh app thật**; lố mốc cứng thì chuyển ngay. Đệm 15 giây cuối. Bản ngắn không có demo "ca sai" riêng: gộp vào slide demo.

### 6.1. Bản 5 phút (7 slide, tổng 4:45 + đệm 15 giây)

| # | Người nói | Mốc giờ (cứng) | Nội dung | 3 neo (V · T · S) | Chuyền mic |
|---|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (00:40) | Bìa + bài toán | V: {{NHOM_NGUOI_DUNG}} mất {{VIEC_TON_THOI_GIAN}} · T: tên app + 1 câu hứa · S: {{SO_NOI_DAU}} | — |
| 2 | Diệu Anh | 00:35–01:10 (01:15) | Giải pháp + UI/UX | V: {{GIAI_PHAP_1_CAU}} · T: chỉ ảnh màn chính, 1 điểm {{DIEM_UI}} · S: {{SO_THAO_TAC_HOAN_THANH}} | "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay." |
| 3 | Dũng | 01:10–01:50 (01:55) | 5 tính năng + luồng 3 bước | V: 5 tính năng giải đúng đề · T: nhấn {{QUY_TAC_CHINH}} · S: {{THOI_GIAN_LUONG_CHINH}} | "Giờ mình **bấm thật**." |
| 4 | Dũng | 01:50–02:50 (02:55) | Demo: ca thường → ca sai/biên → mobile 360px | V: dùng thật · T: {{THAO_TAC_1}} → {{CA_SAI}} → thu 360px (mỗi bước ≤ 20 giây) · S: {{GIAY_PHAN_HOI}} giây | "Cách tính bên trong và giả định, mình xin nhường **Nguyên**." |
| 5 | Nguyên | 02:50–03:45 (03:50) | **Giả định & cách tính (bắt buộc)** | V: số trong app dựa trên giả định nào · T: bảng giả định có nguồn, 3 kịch bản, hòa vốn, ưu đãi có lỗ không · S: {{SO_HOA_VON}} | — |
| 6 | Nguyên | 03:45–04:25 (04:30) | Kỹ thuật + kiểm thử + bảo mật | V: tin được vì sao · T: nhãn `{{MOCK_NOTICE}}`, key không lộ, 1 ca bắt lỗi · S: {{SO_CA_DAT}}/{{TONG_CA}} | — |
| 7 | Nguyên | 04:25–04:45 (04:50) | Kết | V: tổng kết 1 câu · T: QR + link · S: {{SO_NHO_NHAT}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." (nếu có Q&A) |

Điểm kiểm: 01:10 Diệu Anh chuyền; 02:50 Dũng chuyền. Trễ > 15 giây ở điểm kiểm 01:10: Dũng bỏ nửa slide 3 (chỉ nói 1 quy tắc). Nguyên vào ≥ 03:10: bỏ slide 6, gộp 1 câu kỹ thuật vào slide 7.

### 6.2. Bản 3 phút (5 slide, tổng 2:45 + đệm 15 giây)

| # | Người nói | Mốc giờ (cứng) | Nội dung | 3 neo (V · T · S) | Chuyền mic |
|---|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (00:40) | Bài toán + giải pháp 1 câu | V: {{NHOM_NGUOI_DUNG}} mất {{VIEC_TON_THOI_GIAN}} · T: tên app + ảnh màn chính · S: {{SO_NOI_DAU}} → {{SO_MUC_TIEU}} | "Em xin gửi **Dũng** làm thử ngay." |
| 2 | Dũng | 00:35–01:15 (01:20) | Demo ca thường (1 luồng) | V: dùng thật · T: {{THAO_TAC_1}} → {{THAO_TAC_2}} → kết quả · S: {{GIAY_PHAN_HOI}} giây | — |
| 3 | Dũng | 01:15–01:40 (01:45) | 1 ca sai + mobile 360px | V: chặn lỗi, dùng được trên điện thoại · T: {{CA_SAI}} báo lỗi; thu 360px · S: {{SO_CA_LOI_BAT_DUOC}} | "Cách tính và giả định, mình xin nhường **Nguyên**." |
| 4 | Nguyên | 01:40–02:20 (02:25) | **Giả định & cách tính (bắt buộc)** | V: số dựa trên giả định nào · T: 3 giả định chính có nguồn + hòa vốn + ưu đãi có lỗ không · S: {{SO_HOA_VON}} | — |
| 5 | Nguyên | 02:20–02:45 (02:50) | Kiểm thử + kết | V: tin được · T: nhãn `{{MOCK_NOTICE}}`, key không lộ, QR · S: {{SO_CA_DAT}}/{{TONG_CA}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." |

Điểm kiểm: 00:35 và 01:40. Trễ ở 01:40 quá 15 giây: Nguyên chỉ nói 1 giả định + hòa vốn rồi sang slide 5. **Không bao giờ bỏ slide 4** (Kinh tế). Slide 3 có thể bỏ nếu cần bù giờ (nói 1 câu "ca sai báo lỗi ngay, chạy tốt ở 360px").
Bảng Kỹ thuật: slide 4 thành "Quy tắc nghiệp vụ + quyết định kỹ thuật" (kiến trúc 1 hình, 1 lựa chọn đánh đổi).

### 6.3. "Giả định & cách tính": khung 50 giây dùng cho cả ba bản (Bảng Kinh tế)

1. **Câu 1 (≤ 8 giây):** "Mọi con số trong app đến từ {{SO_GIA_DINH}} giả định, hiển thị ngay cạnh số, và chỉnh được."
2. **Chỉ vào bảng giả định (≤ 15 giây):** đọc 3 giả định quan trọng nhất kèm nguồn: "{{GIA_DINH_1}} lấy từ {{NGUON_1}}".
3. **Kịch bản + hòa vốn (≤ 15 giây):** "Cơ sở lãi {{LAI_CO_SO}}, xấu nhất {{LAI_XAU_NHAT}}; hòa vốn ở {{SO_HOA_VON}} {{DON_VI}}."
4. **Ưu đãi (≤ 8 giây):** "Ưu đãi {{UU_DAI}} giữ biên {{BIEN_SAU_UU_DAI}}, lỗ khi {{DIEU_KIEN_LO}}."
5. **Giới hạn (≤ 4 giây):** "Giả định {{GIA_DINH_YEU_NHAT}} chưa có số thật, đội sẽ kiểm bằng {{CACH_KIEM}}."
