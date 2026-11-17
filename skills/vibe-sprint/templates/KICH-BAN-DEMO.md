# Run-sheet pitch 10 / 5 / 3 phút: {{TEN_APP}}

> Nguồn sự thật cho cả đội. `CUE-CARDS.md` sinh ra từ bảng này: **sửa ở đây trước, rồi cập nhật thẻ**. Điền mọi `{{...}}` bằng nội dung thật của app; không bịa số (chỉ dùng số đã chạy thật, có trong `BANG-KIEM-THU.md`).
> Phiên bản đội: 3 người, vai cố định. Diệu Anh mở (bài toán, nỗi đau, UI/UX sơ bộ) · Vũ Trí Dũng giữa (tính năng + demo) · Nguyên, trưởng nhóm, cuối (kỹ thuật, tổng kết, phản biện, Q&A) và là **neo dự phòng**.
> **Thành viên không tự bấm slide**: kỹ thuật viên của BTC đổi slide khi nghe cue (mục 1.1). Mỗi slide chỉ có **3 neo**: `V` = 1 câu vấn đề · `T` = 1 thao tác/điểm nhấn · `S` = 1 con số chứng minh. Mỗi neo ≤ 15 giây. Hết mốc giờ của slide thì **chuyển ngay**, dù chưa nói hết.

> **Thời lượng pitch do BTC báo sau (giống nhau cho mọi đội).** Có 3 bản: **10 phút** (mục 1–5, 12 slide), **5 phút** (mục 6.1, 8 slide), **3 phút** (mục 6.2, 6 slide); mỗi bản có **1 slide video demo** đặt ngay trước phần tính năng/demo của Dũng. Chọn bản ngay khi BTC báo; vai Diệu Anh / Dũng / Nguyên giữ nguyên ở cả ba bản. **Round 1 không có Q&A**; Q&A chỉ ở vòng phản biện (đội được chọn), nơi Bảng Kinh tế phải trình bày thêm **giả định và cách tính**.
> **Bảng Kinh tế: slide/đoạn "Giả định & cách tính" là BẮT BUỘC trong cả ba bản** (10 phút: slide 11; 5 phút: slide 6; 3 phút: slide 5). Bảng Kỹ thuật dùng cùng vị trí cho "Quy tắc nghiệp vụ & quyết định kỹ thuật".

## 1. Bảng run-sheet (12 slide, tổng 10:00; slide 4 = video demo; phát ≈ 45 giây rồi "Mời dừng video.")

| # | Người nói | Mốc giờ (mốc cứng chuyển slide) | 3 neo (V · T · S) | Câu chuyền mic (cuối phần) |
|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (cứng 00:40) | V: {{NHOM_NGUOI_DUNG}} đang mất {{VIEC_TON_THOI_GIAN}} · T: tên app + 1 câu hứa · S: {{SO_MUC_TIEU}} | — |
| 2 | Diệu Anh | 00:35–01:30 (cứng 01:35) | V: {{NOI_DAU_CHINH}} · T: kể 1 tình huống có giờ/số của {{PERSONA}} · S: {{SO_NOI_DAU}} | — |
| 3 | Diệu Anh | 01:30–02:30 (cứng 02:35) | V: giải pháp một câu: {{GIAI_PHAP_1_CAU}} · T: chỉ vào 3 ghim số trên ảnh điện thoại dọc, nêu 1 điểm UI/UX ({{DIEM_UI}}) · S: {{SO_THAO_TAC_HOAN_THANH}} | "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay cho mọi người xem." |
| 4 | Dũng | 02:30–03:15 (cứng 03:20) | **VIDEO demo** (`00-demo-video.mp4` ≤ 2:00, tự phát khi tới slide, tắt tiếng; kỹ thuật viên phát, Dũng nói "Mời dừng video." sau ≈ 45 giây): V: nhìn app chạy trước khi đi vào tính năng · T: chỉ 1 thao tác trong video, thuyết minh theo nhịp · S: {{SO_GIAY_LUONG_CHINH}} giây từ nhập đến kết quả | — |
| 5 | Dũng | 03:15–03:45 (cứng 03:50) | V: 5 tính năng giải đúng đề · T: nhấn 1 quy tắc nghiệp vụ {{QUY_TAC_CHINH}} · S: {{SO_TINH_NANG}} tính năng chạy thật | — |
| 6 | Dũng | 03:45–04:15 (cứng 04:20) | V: người dùng đi qua bao nhiêu bước · T: chỉ đúng {{SO_BUOC}} bước trên slide · S: {{THOI_GIAN_LUONG_CHINH}} từ đầu đến kết quả | "Giờ mình xem **bản chạy thật**." (chuyển sang demo) |
| 7 | Dũng | 04:15–05:15 (cứng 05:20) | V: ca bình thường · T: {{THAO_TAC_1}} → {{THAO_TAC_2}} → {{THAO_TAC_3}} (mỗi thao tác ≤ 25 giây) · S: kết quả hiện sau {{GIAY_PHAN_HOI}} giây | — |
| 8 | Dũng | 05:15–06:15 (cứng 06:20) | V: ca nhập sai + ca biên · T: {{CA_SAI}} báo lỗi ngay; {{CA_BIEN}}; 360/390px + Sáng/Tối trên ảnh dọc · S: {{SO_CA_LOI_BAT_DUOC}} ca lỗi được chặn | "Phần bên trong chạy thế nào, mình xin nhường **Nguyên**." |
| 9 | Nguyên | 06:15–07:15 (cứng 07:20) | V: kiến trúc + AI/proxy gọn trong 1 hình · T: chỉ chỗ key KHÔNG nằm trong mã/trình duyệt, và nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} | — |
| 10 | Nguyên | 07:15–08:15 (cứng 08:20) | V: kiểm thử + bảo mật · T: chỉ 1 ca đã bắt lỗi thật ({{CA_BAT_LOI}}) · S: {{SO_CA_DAT}}/{{TONG_CA}} ca đạt, quét key: {{KET_QUA_QUET}} | — |
| 11 | Nguyên | 08:15–09:00 (cứng 09:05) | **Giả định & cách tính (Kinh tế bắt buộc):** V: số trong app dựa trên giả định nào · T: chỉ bảng giả định (giá trị + nguồn), 3 kịch bản, điểm hòa vốn và dòng "ưu đãi có lỗ không"; nói thẳng 1 giới hạn · S: {{SO_HOA_VON}} (điểm hòa vốn) hoặc {{SO_GIA_TRI}} | — |
| 12 | Nguyên | 09:00–09:45 (cứng 09:50) | V: tổng kết 1 câu · T: QR + link, mời hỏi đáp · S: lặp lại {{SO_NHO_NHAT}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." |

Đệm an toàn: **09:45–10:00** (15 giây) cho sự cố. Nếu chạy đúng giờ, kết thúc sớm hơn là tốt.

Slide 7–8 (demo) là ngoại lệ so với trần 45 giây: chia theo **thao tác**, mỗi thao tác ≤ 25 giây, tổng hai slide ≤ 2:00 (video ở slide 4 đã cho giám khảo thấy luồng chính nên demo trực tiếp ngắn lại).

### 1.1. Cue kỹ thuật theo slide (thành viên không tự bấm; kỹ thuật viên BTC đổi slide khi nghe cue)

Nói cue **ngay sau con số `S`**, dừng 1 giây chờ slide đổi, rồi mới nói neo `V` kế tiếp. Slide cuối của mỗi người: câu chuyền mic **trước**, cue **sau**. Dòng cue này nằm ở **dòng 4** của ghi chú người nói (xem `references/05`, `references/14`).

| Slide | Cue nói cuối slide |
|---|---|
| 1, 2 | "Mời chuyển slide." |
| 3 | (chuyền mic) "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay cho mọi người xem." → "Mời chuyển slide." |
| 4 (video) | "Mời phát video demo." (nếu video chưa tự chạy) · thuyết minh theo nhịp · "Mời chuyển slide." |
| 5 | "Mời chuyển slide." |
| 6 | "Giờ mình xem **bản chạy thật**." → "Mời chuyển slide." |
| 7 (demo) | đầu slide, sau neo `V`: "Mời mở bản chạy thật." (hoặc "Mời phát video demo." nếu bản chạy thật lỗi) · cuối: "Mời quay lại slide." → "Mời chuyển slide." |
| 8 | (chuyền mic) "Phần bên trong chạy thế nào, mình xin nhường **Nguyên**." → "Mời chuyển slide." |
| 9, 10, 11 | "Mời chuyển slide." (bản rút gọn 2:00: từ 9 sang phần kế dùng "Mời chuyển đến slide {{SO_SLIDE_DICH}}.") |
| 12 | (chốt) "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." — không cần cue; kỹ thuật viên giữ slide 12 |

Lùi: "Mời lùi một slide." Nhảy: "Mời chuyển đến slide N." Không nghe cue thì kỹ thuật viên giữ nguyên; nói lại "Mời chuyển slide, xin cảm ơn." Bản 5 phút: cue tương tự theo bảng 6.1; bản 3 phút: theo bảng 6.2 (chuyền mic ở slide 1 và 3).

## 2. Mốc theo dõi giờ (người giữ đồng hồ: Nguyên, nhìn đồng hồ phím `N` hoặc đồng hồ tay)

| Điểm kiểm | Đúng giờ | Nếu trễ |
|---|---|---|
| Diệu Anh chuyền mic | 02:30 | trễ > 20 giây: Dũng bỏ slide 6 (nói gộp vào slide 5) |
| Dũng chuyền mic | 06:15 | trễ > 30 giây: Dũng rút slide 8 còn 1 thao tác, hoặc Nguyên chọn bản ngắn |
| Nguyên bắt đầu | 06:15 | xem mục 3 để chọn bản |

## 3. Phần của Nguyên: 3 phiên bản (chọn theo giờ vào phần)

Quy tắc chọn: Nguyên nhìn đồng hồ ngay khi nhận mic.
- Vào **≤ 06:30** → bản đầy đủ 3:30.
- Vào **06:31–07:45** → bản rút gọn 2:00.
- Vào **> 07:45** → bản khẩn cấp 1:00.
- Mọi bản đều **kết thúc trước 09:45** và **luôn có slide 12**.

### 3.1. Bản đầy đủ 3:30 (06:15–09:45)
Slide 9 → 10 → 11 → 12, theo bảng ở mục 1.

### 3.2. Bản rút gọn 2:00 (bỏ slide 10; **Bảng Kinh tế giữ slide 11**)

| Slide | Thời lượng | 3 neo |
|---|---|---|
| 9 | 00:40 | V: kiến trúc + AI/proxy trong 1 hình · T: key không lộ + nhãn `{{MOCK_NOTICE}}` · S: {{SO_MODULE_HOAC_DIEM_AI}} |
| 10 (Kỹ thuật) hoặc 11 (Kinh tế) | 00:40 | Kỹ thuật: V kiểm thử + bảo mật · T 1 ca bắt lỗi thật · S {{SO_CA_DAT}}/{{TONG_CA}}. **Kinh tế:** V số dựa trên giả định nào · T bảng giả định + hòa vốn + ưu đãi có lỗ không · S {{SO_HOA_VON}} |
| 12 | 00:40 | V: tổng kết 1 câu · T: QR + link · S: {{SO_NHO_NHAT}} |

Nhảy slide: Kinh tế bỏ slide 10, Nguyên (hoặc người nói) nói "Mời chuyển đến slide 11."; Kỹ thuật bỏ slide 11, nói "Mời chuyển đến slide 12."

### 3.3. Bản khẩn cấp 1:00 (chỉ 2 slide)

| Slide | Thời lượng | Nói gì |
|---|---|---|
| 10 hoặc 11 | 00:25 | Kỹ thuật: "Đội kiểm thử {{TONG_CA}} ca, đạt {{SO_CA_DAT}}, key không nằm trong mã." · **Kinh tế:** "Mọi con số dựa trên {{SO_GIA_DINH}} giả định có nguồn; hòa vốn ở {{SO_HOA_VON}}; kịch bản xấu nhất vẫn {{KET_QUA_XAU_NHAT}}." (đọc đúng 1 con số trên slide) |
| 12 | 00:35 | Tổng kết 1 câu + QR + "Đội xin nhận câu hỏi." |

Phần kỹ thuật bị bỏ sẽ trả lời ở Q&A (xem `HOI-DAP.md`, các câu gắn Nguyên).

## 4. Chi tiết demo (slide 7–8, của Dũng)

### 4.0. Demo do kỹ thuật viên chiếu (không ai trong đội cầm điện thoại)

| Việc | Cách làm |
|---|---|
| **Phương án 1: video dọc** (ưu tiên) | **Claude dựng video từ storyboard (`prompts/17`, `node tools/demo-video.cjs`)** ở T+45–50: **một video ≤ 2:00** `docs/minh-chung/demo-<app>.mp4` (cũng là minh chứng thời điểm chốt) và bản sao `00-demo-video.mp4` **nhúng sẵn trong slide 4** (tự phát khi tới slide; hết ý thì nói "Mời dừng video."). Không dựng được thì quay tay từ Chrome DevTools 390 × 844 (prompts/17 mục B). Giao kỹ thuật viên cùng PDF/PPTX. Dũng nói "Mời phát video demo." rồi **thuyết minh đúng nhịp** từng thao tác (≤ 25 giây mỗi cái); kết "Mời quay lại slide." |
| **Phương án 2: ảnh dọc đánh số** | Slide 6–8 có ảnh điện thoại dọc (luồng 3 bước, ca sai, ca biên, giao diện Tối). Kỹ thuật viên không thao tác; người nói chỉ theo ghim số. |
| **Phương án 3: bản chạy thật** | "Mời mở bản chạy thật." Chỉ khi BTC cho kỹ thuật viên mở link {{LINK_DEMO}} và làm từng thao tác theo lời ("Mời bấm Điền dữ liệu mẫu"). Rủi ro cao hơn; luôn có phương án 1–2 đứng sau. |
| **Ai làm gì** | **Dũng** chỉ nói; **Nguyên** giữ đồng hồ, đứng gần kỹ thuật viên; Diệu Anh cầm mic. Không ai cầm điện thoại hay clicker. |
| **Thứ tự demo = thứ tự tab dưới cùng** | Đi từ trái sang phải theo thanh tab dưới của app (ví dụ Tổng quan > Mục > Mô-đun); mỗi tab 1 thao tác ≤ 25 giây. Sau tab cuối mới làm ca sai/biên. |
| **Chuẩn bị** | Video và PDF đã giao; QR + link trên slide 7 và 11 quét được; dữ liệu mẫu đã nạp nếu dùng bản chạy thật. |

Chuẩn bị 60 giây trước giờ: kỹ thuật viên đã mở PDF/PPTX ở slide 1 và video demo dọc sẵn sàng; đã tập cue 3 lần với mic thật; (nếu dùng bản chạy thật) link tải xong, dữ liệu mẫu nạp (`{{LENH_NAP_DU_LIEU}}` hoặc `?demo=1`); ảnh dọc dự phòng trong slide phụ P2–P3.

| Thao tác (slide) | Làm gì trên màn hình | Nói 1 câu | Tính năng |
|---|---|---|---|
| 8a (≤ 25s) | {{THAO_TAC_1}} | {{CAU_NOI_1}} | T1 |
| 8b (≤ 25s) | {{THAO_TAC_2}} (chỉ nhãn chế độ AI nếu có) | {{CAU_NOI_2}} | T2 |
| 8c (≤ 25s) | {{THAO_TAC_3}} | {{CAU_NOI_3}} | T3/T4 |
| 8a (≤ 25s) | Cố tình nhập sai: {{CA_SAI}} | "Báo lỗi ngay, không lưu dữ liệu sai." | Kiểm tra đầu vào |
| 8b (≤ 25s) | Ca biên: {{CA_BIEN}} | {{CAU_NOI_BIEN}} | Nghiệp vụ |
| 8c (≤ 15s) | Trên ảnh dọc: giao diện Tối cạnh giao diện Sáng, chỉ thanh tab dưới; nếu có ảnh 360px thì chỉ 1 màn | "Dùng được trên điện thoại, cả Sáng lẫn Tối." | Responsive |

### Dự phòng khi demo lỗi (quy tắc: lỗi > 10 giây thì chuyển, không sửa trên sân khấu)

| Tình huống | Làm ngay | Câu nói bình tĩnh |
|---|---|---|
| Bản chạy thật không tải / mất tiếng | "Mời phát video demo." (video dọc đã giao kỹ thuật viên) | "Mạng đang chậm, em chuyển sang bản quay sẵn của đúng bản này." |
| AI không trả kết quả | Chuyển chế độ mô phỏng, chỉ nhãn | "Đang dùng chế độ mô phỏng, có nhãn rõ trên giao diện." |
| Form không lưu | Tải lại, nạp dữ liệu mẫu, làm tiếp từ thao tác đang dở | — |
| Mất mạng hoàn toàn | PDF/video offline của kỹ thuật viên; ảnh dọc ở slide 6–8 và slide phụ P2–P3 | "Em xin dùng ảnh chụp, thao tác y hệt." |
| Video không phát được | "Mời quay lại slide." rồi nói theo ảnh dọc ở slide 6–8 | "Em xin dùng ảnh chụp từng bước, cùng bản đang chạy." |
| Kỹ thuật viên không nghe rõ cue | Nhắc lại "Mời chuyển slide, xin cảm ơn."; Nguyên ra hiệu tay / nhắc trực tiếp | — |
| Lố giờ | Bỏ thao tác 7b, giữ 7a | "Ca biên có trong bảng kiểm thử." |

## 5. Sau buổi tập
- [ ] Ghi lại slide nào vượt mốc cứng; cắt lời, không cắt neo `S` (con số).
- [ ] Tập cue với kỹ thuật viên (hoặc Nguyên đóng vai): "Mời chuyển slide." nghe rõ ở cự ly thật.
- [ ] Tập đủ 2 lần có đồng hồ, 1 lần cố ý trễ 40 giây ở Diệu Anh để Nguyên tập chọn bản rút gọn.
- [ ] Cập nhật `CUE-CARDS.md` và in lại nếu sửa bảng.

## 6. Bản 5 phút và 3 phút (khi BTC báo thời lượng ngắn)

Mỗi bản chạy **cùng ba người, cùng câu mở và câu chuyền mic** như bản 10 phút; chỉ gộp slide. Luật: mỗi slide vẫn 3 neo `V · T · S`, có **1 con số lớn hoặc 1 ảnh app thật**; lố mốc cứng thì chuyển ngay. Đệm 15 giây cuối. Bản ngắn không có demo "ca sai" riêng: gộp vào slide demo.

### 6.1. Bản 5 phút (8 slide, tổng 4:45 + đệm 15 giây)

| # | Người nói | Mốc giờ (cứng) | Nội dung | 3 neo (V · T · S) | Chuyền mic |
|---|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (00:40) | Bìa + bài toán | V: {{NHOM_NGUOI_DUNG}} mất {{VIEC_TON_THOI_GIAN}} · T: tên app + 1 câu hứa · S: {{SO_NOI_DAU}} | — |
| 2 | Diệu Anh | 00:35–01:10 (01:15) | Giải pháp + UI/UX | V: {{GIAI_PHAP_1_CAU}} · T: chỉ ảnh màn chính, 1 điểm {{DIEM_UI}} · S: {{SO_THAO_TAC_HOAN_THANH}} | "Em xin gửi **Dũng** đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay." |
| 3 | Dũng | 01:10–01:40 (01:45) | **VIDEO demo** (phát ≈ 30 giây rồi "Mời dừng video.") | V: nhìn app chạy · T: chỉ 1 thao tác trong video · S: {{GIAY_PHAN_HOI}} giây | — |
| 4 | Dũng | 01:40–02:05 (02:10) | 5 tính năng + luồng 3 bước | V: 5 tính năng giải đúng đề · T: nhấn {{QUY_TAC_CHINH}} · S: {{THOI_GIAN_LUONG_CHINH}} | "Giờ mình xem **bản chạy thật**." |
| 5 | Dũng | 02:05–02:50 (02:55) | Demo: ca thường → ca sai/biên → mobile 360px | V: dùng thật · T: {{THAO_TAC_1}} → {{CA_SAI}} → thu 360px (mỗi bước ≤ 20 giây) · S: {{GIAY_PHAN_HOI}} giây | "Cách tính bên trong và giả định, mình xin nhường **Nguyên**." |
| 6 | Nguyên | 02:50–03:45 (03:50) | **Giả định & cách tính (bắt buộc)** | V: số trong app dựa trên giả định nào · T: bảng giả định có nguồn, 3 kịch bản, hòa vốn, ưu đãi có lỗ không · S: {{SO_HOA_VON}} | — |
| 7 | Nguyên | 03:45–04:25 (04:30) | Kỹ thuật + kiểm thử + bảo mật | V: tin được vì sao · T: nhãn `{{MOCK_NOTICE}}`, key không lộ, 1 ca bắt lỗi · S: {{SO_CA_DAT}}/{{TONG_CA}} | — |
| 8 | Nguyên | 04:25–04:45 (04:50) | Kết | V: tổng kết 1 câu · T: QR + link · S: {{SO_NHO_NHAT}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." (nếu có Q&A) |

Điểm kiểm: 01:10 Diệu Anh chuyền; 02:50 Dũng chuyền. Trễ > 15 giây ở điểm kiểm 01:10: Dũng bỏ nửa slide 4 (chỉ nói 1 quy tắc). Nguyên vào ≥ 03:10: bỏ slide 7, gộp 1 câu kỹ thuật vào slide 8.

### 6.2. Bản 3 phút (6 slide, tổng 2:45 + đệm 15 giây)

| # | Người nói | Mốc giờ (cứng) | Nội dung | 3 neo (V · T · S) | Chuyền mic |
|---|---|---|---|---|---|
| 1 | Diệu Anh | 00:00–00:35 (00:40) | Bài toán + giải pháp 1 câu | V: {{NHOM_NGUOI_DUNG}} mất {{VIEC_TON_THOI_GIAN}} · T: tên app + ảnh màn chính · S: {{SO_NOI_DAU}} → {{SO_MUC_TIEU}} | "Em xin gửi **Dũng** làm thử ngay." |
| 2 | Dũng | 00:35–01:05 (01:10) | **VIDEO demo** (phát ≈ 30 giây rồi "Mời dừng video."), thay cho demo trực tiếp | V: nhìn app chạy · T: chỉ 1 thao tác trong video · S: {{GIAY_PHAN_HOI}} giây | — |
| 3 | Dũng | 01:05–01:20 (01:25) | Demo ca thường (1 luồng, ngắn) | V: dùng thật · T: {{THAO_TAC_1}} → {{THAO_TAC_2}} → kết quả · S: {{GIAY_PHAN_HOI}} giây | — |
| 4 | Dũng | 01:20–01:40 (01:45) | 1 ca sai + mobile 360px | V: chặn lỗi, dùng được trên điện thoại · T: {{CA_SAI}} báo lỗi; thu 360px · S: {{SO_CA_LOI_BAT_DUOC}} | "Cách tính và giả định, mình xin nhường **Nguyên**." |
| 5 | Nguyên | 01:40–02:20 (02:25) | **Giả định & cách tính (bắt buộc)** | V: số dựa trên giả định nào · T: 3 giả định chính có nguồn + hòa vốn + ưu đãi có lỗ không · S: {{SO_HOA_VON}} | — |
| 6 | Nguyên | 02:20–02:45 (02:50) | Kiểm thử + kết | V: tin được · T: nhãn `{{MOCK_NOTICE}}`, key không lộ, QR · S: {{SO_CA_DAT}}/{{TONG_CA}} | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." |

Điểm kiểm: 00:35 và 01:40. Trễ ở 01:40 quá 15 giây: Nguyên chỉ nói 1 giả định + hòa vốn rồi sang slide 6. **Không bao giờ bỏ slide 5** (Kinh tế). Slide 4 có thể bỏ nếu cần bù giờ (nói 1 câu "ca sai báo lỗi ngay, chạy tốt ở 360px").
Bảng Kỹ thuật: slide 5 thành "Quy tắc nghiệp vụ + quyết định kỹ thuật" (kiến trúc 1 hình, 1 lựa chọn đánh đổi).

### 6.3. "Giả định & cách tính": khung 50 giây dùng cho cả ba bản (Bảng Kinh tế)

1. **Câu 1 (≤ 8 giây):** "Mọi con số trong app đến từ {{SO_GIA_DINH}} giả định, hiển thị ngay cạnh số, và chỉnh được."
2. **Chỉ vào bảng giả định (≤ 15 giây):** đọc 3 giả định quan trọng nhất kèm nguồn: "{{GIA_DINH_1}} lấy từ {{NGUON_1}}".
3. **Kịch bản + hòa vốn (≤ 15 giây):** "Cơ sở lãi {{LAI_CO_SO}}, xấu nhất {{LAI_XAU_NHAT}}; hòa vốn ở {{SO_HOA_VON}} {{DON_VI}}."
4. **Ưu đãi (≤ 8 giây):** "Ưu đãi {{UU_DAI}} giữ biên {{BIEN_SAU_UU_DAI}}, lỗ khi {{DIEU_KIEN_LO}}."
5. **Giới hạn (≤ 4 giây):** "Giả định {{GIA_DINH_YEU_NHAT}} chưa có số thật, đội sẽ kiểm bằng {{CACH_KIEM}}."
