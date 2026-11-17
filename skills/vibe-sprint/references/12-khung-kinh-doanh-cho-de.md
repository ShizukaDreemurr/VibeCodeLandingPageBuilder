# 12. Khung kinh doanh cho đề Bảng Kinh tế (dùng trong T+0 đến T+10)

Chưng cất từ `kien-thuc/` (đủ 10 file 01-10, xem mục 11). Dùng cùng `11-mo-hinh-kinh-doanh.md` (công thức, `EP.scenario`). Tài liệu này **không chứa số liệu của đề nào**; chỉ có khung hỏi, mẫu điền, và số liệu **có nguồn trong giáo trình**. Số không có trong nguồn đánh dấu **"giả định cần nêu nguồn"**: bắt buộc ghi nhãn Giả định + lý do + khoảng min-max trong app.

Trích dẫn: `05 §4.4` = file `05_Kinh_Doanh_Tren_San_TMDT_DOM204.md` mục 4.4. Điểm chấm liên quan: mô hình KD 22 · giả định/dự phòng 17 · cơ chế ưu đãi thực tế 10.

## 0. Thứ tự áp dụng trong T+0-10

| Phút | Việc | Khung (mục dưới) | Ra cái gì |
|---|---|---|---|
| T+0-2 | Đề thuộc loại nào? Ai mua, ai trả tiền, bán qua đâu | §1 phân khúc, §7 kênh | 1 dòng "khách hàng - kênh - tiền vào ở đâu" |
| T+2-4 | Persona + USP một câu | §2, §3 | Persona 1 thẻ, USP 1 câu |
| T+4-6 | Định vị + phễu sản phẩm/giá | §4, §5, §6 | Bảng gói/giá, thang giá |
| T+5 (bắt buộc) | Danh sách giả định có nguồn, dán vào Schema Contract | §8, §9, §11 | `assumptions[]` với `why` + `source` |
| T+6-10 | Ưu đãi/khuyến mãi (nếu đề có) + rủi ro | §10, §9 | Thẻ "Cơ chế ưu đãi", ma trận rủi ro |

Nguyên tắc: **bắt đầu hẹp, kiểm chứng thật, mở rộng đúng lúc** (`01 §2.5`). Không chạy đủ 10 khung; đề không nói tới kênh thì bỏ §7.

---

## 1. Phân khúc và STP (chọn ai để phục vụ)

**Là gì:** chia thị trường thành nhóm giống nhau, rồi dồn nguồn lực vào 1-2 nhóm; xác định luôn nhóm **không** phục vụ (`01 §2.1, §2.3`).

**5 điều kiện phân khúc có giá trị (đạt cả 5):** đo lường được · đủ lớn/có giá trị · tiếp cận được · khác biệt rõ · có khả năng phục vụ (`01 §2.1`).

**Mẫu điền (chấm thang 1-5, trọng số gợi ý cho startup: tiếp cận 20, cấp thiết 20, phù hợp sản phẩm 15, khả năng chi trả 15, quy mô 10, tăng trưởng 10, cạnh tranh 10; `01 §2.3`):**

| Phân khúc | Vấn đề | Tiếp cận | Cấp thiết | Chi trả | Phù hợp SP | Quy mô | Tăng trưởng | Cạnh tranh | Điểm = Σ(điểm x trọng số) | Tầng |
|---|---|---|---|---|---|---|---|---|---|---|
| A | | | | | | | | | | Trọng tâm |
| B | | | | | | | | | | Thứ cấp / Thử nghiệm / Loại |

Phân khúc theo **vấn đề + bối cảnh**, không chỉ tuổi/giới (`01 §2.4`). 4 tầng: Primary · Secondary · Experimental · Excluded.

**Gắn vào app:** màn "Khách hàng mục tiêu" (thẻ phân khúc + lý do chọn); giả định `segmentShare` (% khách thuộc phân khúc trọng tâm) và `reachable` (số khách tiếp cận được) trong `assumptions[]` (**giả định cần nêu nguồn**, lấy từ BTC nếu có).

**Nói khi pitch:** "Chúng tôi chọn phân khúc <A> vì tiếp cận được qua <kênh>, có nhu cầu cấp thiết, chi trả được; chưa phục vụ <C> để không dàn trải."

**Bổ sung từ 08/10:** 5 mức phân đoạn (đại trà, phân đoạn, ngách, địa phương, cá nhân hóa) và 4 tiêu chí phân đoạn hiệu quả: xác định/đo được, đủ lớn để sinh lời, ổn định/có tăng trưởng, tiếp cận/phục vụ được (`08 Bài 4 §4.1`); 3 chiến lược mục tiêu: không phân biệt, tập trung, đa phân đoạn (`08 Bài 4 §4.2`). Chiến lược cạnh tranh của SME: Porter 4 hướng (dẫn đầu chi phí, khác biệt hóa, tập trung chi phí, **tập trung khác biệt hóa**); tập trung khác biệt hóa là phổ biến và hiệu quả nhất cho SME, tránh "mắc kẹt ở giữa" (`10 Ch.1 §1.1`). Bộ ba câu hỏi chiến lược: khách mục tiêu là ai · giá trị mang lại · duy trì năng lực cốt lõi thế nào (`10 Ch.1 §1.1`).

## 2. Persona (một thẻ, không phải tiểu sử)

**Là gì:** chân dung gắn với quyết định mua; tối đa 2-4 persona, phân biệt người mua và người dùng (`01 §3.1, §3.3`). Khung 12 lớp: WHO → CONTEXT → JOB → PROBLEM → DESIRE → MOTIVATION → TRIGGER → ALTERNATIVE → BARRIER → DECISION → BEHAVIOR → VALUE (`01 §3.2`).

**Mẫu rút gọn (7 ô, đủ cho 60 phút):**

```
Persona <tên vai trò>: <ai, bối cảnh>.
Việc cần làm (JOB): <kết quả muốn>.   Nỗi đau (PROBLEM): <triệu chứng → nguyên nhân>.
Sự kiện kích hoạt (TRIGGER): <...>.   Đang dùng thay thế (ALTERNATIVE, kể cả "không làm gì"): <...>.
Rào cản (BARRIER): <giá/niềm tin/thời gian>.   Tiêu chí chọn Top 3 (DECISION): <...>.
Giá trị kinh tế (VALUE): AOV <...>, tần suất <...>, chi phí phục vụ <...>.
```

Thông tin chưa kiểm chứng ghi rõ là **Giả thuyết** (`01 §3.4`); thứ bậc bằng chứng: đoán < khách nói < hành vi < khách trả tiền < mua lại.

**Hành vi mua (`07` Phần I Ch.6 §6.1):** nhận diện nhu cầu → tìm kiếm thông tin → đánh giá (tập gợi nhớ / không phù hợp / trơ) → mua → hành vi sau mua (bất hòa nhận thức) → thải bỏ. Mức tham gia thấp (hàng rẻ, mua thường xuyên: thói quen, bốc đồng) khác mức cao (giá cao, rủi ro: tìm hiểu kỹ) (`07` Ch.3 §3.3). B2B có trung tâm mua hàng 7 vai trò (`10 Ch.2 §2.2`). Kiểm chứng persona: phỏng vấn sâu 30 phút - 2 giờ, nhóm tập trung 8-12 người, thử bảng hỏi trên 15-30 người trước khi triển khai (`07` Phần II Ch.2 §2.2, Ch.6); cỡ mẫu tham khảo 300-500 cho nghiên cứu giải quyết vấn đề (`07` Ch.4 §4.2). Trong 60 phút: ghi rõ phần nào là giả thuyết và sẽ kiểm bằng cách nào.

**Gắn vào app:** thẻ persona ở màn đầu hoặc màn hồ sơ khách; `AOV`, `purchaseFreq`, `churn` trong `assumptions[]` lấy từ ô VALUE.

**Nói khi pitch:** 1 câu: "<Persona> muốn <JOB> nhưng bị <BARRIER>; sản phẩm gỡ đúng rào cản đó."

## 3. USP: công thức và 7 bài kiểm

**Là gì:** một lý do mua có tính khác biệt, trả lời "vì sao chọn bạn thay vì đối thủ, tự làm, hoặc không làm gì" (`02 §2.1`).

**Công thức tư duy:** USP mạnh = Quan trọng (relevant) x Khác biệt (distinctive) x Đáng tin (credible); một yếu tố bằng 0 thì cả USP bằng 0 (`02 §2.2`).

**5 công thức viết (chọn 1; `02 §2.5`):**
1. `Dành cho [khách], chúng tôi giúp [kết quả] bằng [cơ chế] thay vì [cách thông thường].`
2. `[Kết quả] + [khác biệt] + [bằng chứng].`
3. `Không [nỗi đau phổ biến], chỉ [giá trị khác biệt].`
4. `[Sản phẩm] dành riêng cho [phân khúc].`
5. `Cách [kết quả] mà không cần [hy sinh lớn].`

**7 bài kiểm (đạt ≥ 6/7 mới dùng; `02 §2.2`):** cụ thể · khác biệt · quan trọng · dễ hiểu · đáng tin (có bằng chứng) · bền (khó sao chép) · dùng được trong marketing (ra được content/offer). Test nhanh: "Khách nên chọn chúng tôi thay vì [thay thế] vì ..." mà vế sau chỉ là "uy tín, chất lượng, chuyên nghiệp" là **chưa đạt**.

**Quy tắc:** 1 USP chính + 2-3 USP hỗ trợ (`02 §2.4`); nói cụ thể thay vì "nhanh nhất" ("hoàn thiện trong 7 ngày"); tránh tuyệt đối khó chứng minh (rủi ro niềm tin và pháp lý quảng cáo, `02 §2.1`). 12 nguồn tạo USP: sản phẩm, kết quả, tốc độ, tiện lợi, chuyên môn, phân khúc, phương pháp, dịch vụ, trải nghiệm, giá/mô hình giá, phân phối, cam kết (`02 §2.4`). Mỗi USP phải khớp vận hành: tránh **Promise Gap** (`02 §2.6`).

**Từ USP sang câu chữ (`03` Phần 2-3):**
- Chọn một khung viết: FAB (tính năng → ưu điểm → lợi ích, nhấn **Benefits**), PAS (vấn đề → xoáy sâu → giải pháp), BAB (trước → sau → cầu nối), AIDA (chú ý → quan tâm → khao khát → hành động), 4P Picture-Promise-Prove-Push (`03` Phần 2 mục 1, 2, 3, 7, 10). Kiểm bằng 4C: rõ ràng, ngắn gọn, thuyết phục, đáng tin (`03` Phần 2 mục 4).
- Trả lời 5 rào cản ngầm trong nội dung bán: không đủ tiền · không có thời gian · không thích · không tin · không cần (`03` Phần 2 mục 8); và 3 Whys: vì sao tốt nhất, vì sao tôi phải mua, vì sao tôi phải tin bạn (`03` Phần 2 mục 9).
- Tiêu đề = Đối tượng + Vấn đề/Kết quả + Góc tiếp cận + Mức cụ thể (`03` §3.2); tiêu đề trang đích = Audience + Outcome + Difference, rõ quan trọng hơn bí ẩn (`03` §3.5); ưu tiên Outcome > Benefit > Mechanism > Feature (`03` §3.4); kiểm 3 giây: dành cho ai, vấn đề gì, vì sao xem tiếp (`03` §3.6); tránh từ hứa quá như "đột phá", "đảm bảo thành công" (`03` §3.4).
- CTA gắn USP thay vì "Tìm hiểu thêm" (`02 §2.6`); đặt khối CTA khoảng mỗi 400 từ (tốc độ đọc ~200 từ/phút) (`09` Phần I §4.2).

**Gắn vào app:** một dải USP ở đầu trang chủ + trang kết quả ("Vì sao chọn <tên>: ..."); mỗi lời hứa trong USP phải có ô giả định hoặc con số kiểm được (vd "giao trong 2 giờ" → `deliveryHours`). Bằng chứng nhỏ nhất: số tính từ dữ liệu BTC.

**Nói khi pitch:** đọc đúng một câu USP, rồi chỉ tay vào chỗ app chứng minh nó (demo, số, cam kết).

## 4. Tam giác định vị

**Là gì:** định vị phải thỏa 3 đỉnh cùng lúc: **nhất quán** với thương hiệu/năng lực · **phù hợp** với nhóm mục tiêu · **khác biệt** với đối thủ (`02 §1.3`). Một thương hiệu chỉ đại diện một định vị (`02 §1.1`).

**Mẫu điền:**

```
Với <phân khúc>, <tên> là <loại sản phẩm/mức giá> giúp <lợi ích chính>.
Nhất quán vì: <năng lực thật>.  Phù hợp vì: <nhu cầu khách quan tâm>.  Khác biệt vì: <đối thủ A nhấn X, ta nhấn Y>.
Bảng đối thủ (6 cột; 02 §2.3): Đối thủ | Nhấn mạnh | Giá | Khách mục tiêu | Điểm mạnh | Khoảng trống.
Gồm cả đối thủ gián tiếp: tự làm, freelancer, thay thế, "không làm gì", công cụ miễn phí.
```

Câu tuyên bố định vị (`07` Phần I Ch.1 §1.4): `Dành cho [khách mục tiêu], [sản phẩm] là [danh mục/khung tham chiếu] mang lại [khác biệt/lợi ích chính] bởi vì [lý do để tin].` 5 tiêu chí kiểm: phù hợp · khác biệt · đáng tin · khả thi · bền vững. 5 hướng định vị: theo đặc điểm, lợi ích, dịp dùng, người dùng, chống lại đối thủ (`08 Bài 4 §4.3`).

**Gắn vào app:** thẻ "So sánh với cách hiện tại" (cách thông thường vs của chúng tôi theo thời gian/chi phí/rủi ro); không cần sơ đồ phức tạp. Số so sánh phải trung thực, có cơ sở (`02 §2.6`).

**Nói khi pitch:** "Đối thủ nhấn <X>, khoảng trống là <Y>; chúng tôi đứng ở <Y>."

## 5. Hệ sinh thái sản phẩm và phễu (6 vai trò)

**Là gì:** không bán một món lẻ mà bán một thang: dùng thử → chiến lược (chủ lực) → nối tiếp → móc nối (cross-sell) → giá cao (VIP) → thay thế (rẻ/lẻ/combo) (`02 §3.1`). Trên sàn có thêm nhóm **chim mồi** (neo giá so sánh) và **upsell** (`05 §5.3`).

**Mẫu điền (mỗi dòng một sản phẩm/gói thật của đề):**

| Vai trò | Sản phẩm/gói | Giá | Giá vốn | Vai trò trong tiền | Chỉ số theo dõi |
|---|---|---|---|---|---|
| Dùng thử / phễu | | thấp hoặc 0 | | kéo khách, chấp nhận lỗ có trần = CAC | tỉ lệ lên gói chính |
| Chiến lược / chủ lực | | | | doanh thu chính | CR, biên gộp |
| Nối tiếp | | | | tăng LTV | mua lại |
| Móc nối / cross-sell | | | | tăng AOV | số món/đơn |
| Giá cao / VIP | | | | tối ưu biên | % khách lên VIP |
| Thay thế (rẻ, lẻ, combo) | | | | giữ khách ngân sách thấp | không ăn gói chính |

Combo = các món **ngang hàng** giá ưu đãi; Mua kèm Deal Sốc = có **món chính và món phụ** (`05 §3.2`). Chọn hàng phụ giá trị thấp, biên tốt (`05 §7.1`).

**Gắn vào app:** màn danh mục/gói (bảng trên) và `assumptions[]`: `mixTrial`, `mixCore`, `mixVip` (tỉ trọng doanh số; **giả định cần nêu nguồn**), `attachRate` (tỉ lệ mua kèm; **giả định**). Tính AOV = Σ(tỉ trọng x giá).

**Nói khi pitch:** "Gói dùng thử hạ rào cản, gói chủ lực mang tiền, gói nối tiếp giữ khách; mỗi tầng có chỉ số riêng."

## 6. 4P / 5P / 7P và công thức giá bán

**Là gì:** 4P (sản phẩm, giá, phân phối, xúc tiến); 5P thêm Personnel (`02 §1.1`); 7P cho dịch vụ thêm con người, quy trình, bằng chứng hữu hình (`06 B3 §3`). Chọn 4P cho hàng hóa, 7P cho dịch vụ.

**Mẫu điền:** mỗi P một câu + một con số kiểm được.

```
Product: <lõi + phần gia tăng (freeship, cam kết)>   Price: <mức + vì sao, 02 §2.6: USP tạo logic cho giá cao hơn>
Place: <kênh bán, kho, thời gian giao>   Promotion: <công cụ + ngân sách trần>   (7P) People/Process/Evidence: <...>
```

**Công thức định giá bán lẻ có lãi (`05 §3.2`):**

```
Giá bán lẻ = C0 / (1 - (F + M + R))
C0 = giá vốn + đóng gói/vận hành trực tiếp;  F = % phí sàn;  M = % marketing;  R = % lợi nhuận kỳ vọng/rủi ro
```

Chia cho (1 - tổng %) nên F + M + R phải < 100%; kiểm trước khi tính. Công thức tổng quát: Lợi nhuận = Giá x Lượng - Tổng chi phí (`01 §1.8`); 6 bước đặt giá: mục tiêu → nhận thức giá thị trường → giá đối thủ → nền tảng định giá → phương pháp → chốt (`01 §1.8`).

Lưu ý pháp lý giá niêm yết: nâng giá "ảo" để giảm sâu **không quá 50%** (`05 §3.2`); sửa giá gốc **trước ít nhất 7 ngày** mới tham gia khuyến mãi, hoặc chỉnh % khuyến mãi thay vì giá gốc (`05 §6.5`).

**Định giá theo chi phí (`08 Bài 8 §8.2`):** giá sàn = biến phí đơn vị C; giá hòa vốn BEP = C + F/Q; giá cộng lãi = BEP / (1 − tỷ lệ lãi kỳ vọng); giá mục tiêu theo ROI = C + F/E(Q) + r x K/E(Q) (r = suất sinh lời mục tiêu, K = vốn đầu tư). Hòa vốn quảng cáo: sản lượng hòa vốn = ngân sách quảng cáo / lãi gộp mỗi đơn vị (ví dụ 1,5 tỷ / 60.000đ = 25.000 đơn vị; `08 Bài 9 §9.2`, mục Money).

**Hớt váng hay thâm nhập (`08 Bài 8 §8.3`):** hớt váng khi cầu ít co giãn, sản phẩm độc đáo khó sao chép, phân khúc cao đủ lớn; thâm nhập khi cầu co giãn mạnh, có hiệu ứng quy mô, muốn chiếm thị phần nhanh. Chọn một và nêu lý do.

**Tổng chi phí của khách T = P + O (`09` Phần II §6.2):** khách chấp nhận giá web P_w cao hơn kênh truyền thống P_t miễn chênh lệch nhỏ hơn phần chi phí tìm kiếm/giao nhận tiết kiệm được (O_t − O_w), tức T_w < T_t. Dùng để biện minh giá/phí ship khi giao tận nơi.

**Cấu trúc giá thật (ví dụ minh họa, `08 Case 4`):** giày bán lẻ $100 → giá sỉ $50; Nike lãi ròng $5 (5,3%), Adidas $2 (2,5%) trên $50; nhà bán lẻ giảm giá trung bình 24% dịp sale. Bài học: giá niêm yết cao không đồng nghĩa biên ròng cao. Số liệu BCTC 2015 của giáo trình, **không** dùng làm giả định của đề.

**Gắn vào app:** ô giả định `cogs`, `feePct`, `mktPct`, `marginTarget` + dòng "Giá đề xuất = ..." trong panel Cách tính; so với giá của đề (giá của đề luôn thắng, `CLAUDE.md`).

**Nói khi pitch:** đọc công thức với số thật, "giá này đã trừ phí sàn và marketing mà vẫn còn <R>%".

## 7. Kênh và ma trận nội dung

**Là gì:** mỗi kênh có **vai trò**: Discovery · Education · Trust · Conversion · Retention (`04 §III.5.1`). Kênh sở hữu (owned) để tích lũy, kênh thuê (paid) để mở rộng (`04 §III.4 bước 8`).

**8 bước chọn kênh, bản 60 phút (`04 §III.4`):** khách dùng kênh để làm gì → giai đoạn hành trình → mức ý định (thấp/trung/cao) → loại sản phẩm (giá thấp nhanh vs giá cao chậm) → hợp thông điệp-định dạng → nguồn lực → chi phí/CAC → mức kiểm soát. Chấm **Channel Fit** (thang 1-5, **nhân** các yếu tố nên một yếu tố bằng 0 là hỏng; `04 §III.5.2`).

**Mẫu điền (ma trận kênh):**

| Kênh | Vai trò | Khách (1-5) | Ý định | Niềm tin | Chuyển đổi | Nguồn lực | Chi phí/tháng | KPI |
|---|---|---|---|---|---|---|---|---|

**Content mix gợi ý (`04 §I.7.2`):** 20% thu hút · 30% giáo dục · 20% tạo niềm tin · 20% chuyển đổi · 10% duy trì cộng đồng. Các biến thể: 80-20 (80% thông tin/giải trí, 20% quảng bá), 50-25-20-5, quy tắc 1/3 (`04 §II bước 7`). Đây là **tỉ lệ gợi ý của giáo trình, đổi theo ngành**; ghi là giả định nếu dùng trong mô hình.

**Mẫu lịch nội dung:** Ngày | Nền tảng | Chủ đề (pillar) | Góc (angle) | Định dạng | Mục tiêu | CTA | Người phụ trách (`04 §I.8 bước 6`). 3-5 pillar; 13 góc; đo theo vai trò nội dung (`04 §I.9.2`). Test kênh: đổi **một biến mỗi lần**; tiêu chí giữ/mở rộng/điều chỉnh/dừng (`04 §III.7.3`); kế hoạch 90 ngày: 30 nghiên cứu, 30 test, 30 tập trung (`04 §III.7.4`).

**Phễu web 5 hiệu quả (`09` Phần II §4.4):** η0 = Q1/Q0 nhận biết · η1 = Q2/Q1 thu hút (hit) · η2 = Q3/Q2 tiếp xúc (visit tương tác) · η3 = Q4/Q3 chuyển hóa (mua) · η4 = Q5/Q4 giữ chân (mua lặp lại); tổng thể η_WAv = (1/5) Σ μ_i x Q_i/Q_(i-1), μ_i là trọng số theo mục tiêu chiến dịch. Mẫu số = 0 → "Không đủ dữ liệu". Cache/proxy làm đếm thiếu Q2, Q3: ghi vào giới hạn. Tên trường Q0..Q5 do Schema Contract quyết định.

**Bán hàng B2B/tư vấn (`08 Bài 12`):** phễu Leads → Suspects → Prospects → Customers, sàng lọc BANT (Budget, Authority, Need, Time) (§12.4); 6 bước bán hàng và kỹ thuật FEBA (Feature, Evidence, Benefit, Agreement) (§12.3); ví dụ chuyển đổi 10:1 cải thiện lên 5:1 giảm nửa công sức (§12.4).

**Ngân sách tham chiếu (đây là benchmark của giáo trình, không phải số của đề):** marketing thường 2-10% doanh thu gộp (`10 Ch.2 §2.3`); nghiên cứu ~2% doanh thu, tới 10% khi ra sản phẩm mới (`06 B5 §4`); content marketing trung bình 26% (B2B) và 22% (B2C) ngân sách marketing, giai đoạn khởi đầu ~19%, tăng dần 10-20%/năm theo dữ liệu, ~70% nội dung B2B không được dùng (`03` Phần 4 §4.7). Tần suất gợi ý: blog ≥ 1 lần/tuần, mạng xã hội 2-3 lần/tuần, bản tin email ≥ 1 lần/tuần, video 1 lần/3-4 tuần (`03` §1.3). GRP = Reach x Frequency (`08 Bài 9 §9.2`, mục Media). Đẩy (Push: bán hàng cá nhân, khuyến mại cho trung gian) hay kéo (Pull: quảng cáo, khuyến mại người dùng cuối) (`01 §1.9`).

**Trang web cơ bản (`09` Phần I §1.1-1.2):** title ≤ 65 ký tự, từ khóa chính đặt đầu, mỗi trang một title riêng; meta description không đổi thứ hạng nhưng quyết định CTR, viết riêng cho từng trang.

**Gắn vào app:** bảng kênh với `cpc`, `cr`, `channelBudget` trong `assumptions[]`; lịch nội dung là màn riêng nếu đề yêu cầu. KPI: Reach → Lead → CPL → CAC → AOV → LTV; **không** chỉ đo like (vanity metrics, `04 §II bước 1`).

**Nói khi pitch:** "Kênh <A> kéo người mới, kênh <B> chuyển đổi, kênh <C> giữ khách; chúng tôi đo bằng CAC chứ không bằng lượt thích."

## 8. Cơ chế sàn TMĐT: phí, quảng cáo, voucher (chỉ dùng khi đề có bán qua sàn)

### 8.1 Số liệu **có trong nguồn**

| Mục | Số trong giáo trình | Nguồn | Cách dùng |
|---|---|---|---|
| Phí hoa hồng/phí cố định sàn | trung bình **5,5% - 6%** tùy thời điểm và chính sách; sàn đổi phí ít nhất 3 lần (2025), 2 lần (2026) | `05 §1.3`, `05 §4.1` | `feePct` mặc định, ghi "kiểm lại biểu phí hiện hành", để khoảng min-max rộng |
| Thuế người bán Shopee | tự khấu trừ **1% TNCN + 0,5% GTGT** trên đơn thành công (theo bài, "quy định hiện hành được đề cập") | `05 §5.2` | dòng thuế riêng; ghi nguồn |
| Các phí sàn khác | phí thanh toán, trợ giá (Freeship Extra, Voucher Extra) nằm trong "chi phí sàn bắt buộc"; **không có % trong nguồn** | `05 §4.4` | giả định cần nêu nguồn |
| Công thức doanh thu | GMV = Số đơn x AOV = Traffic x CR x AOV. Ví dụ 10.000 x 2% x 300.000đ = 60.000.000đ | `05 §4.2` | cấu trúc `compute()` |
| Hòa vốn | Số đơn hòa vốn = FC / (Giá - chi phí biến đổi). Ví dụ giá 200.000, vốn 100.000, biến đổi khác 50.000 → 50.000/đơn; FC 8.000.000 → 160 đơn, GMV 32.000.000/tháng | `05 §4.4`, `06 B8 §2` | kiểm tay test |
| GMV khác lợi nhuận | GMV tính cả đơn hủy/hoàn, chưa trừ phí | `05 §10.2` | không dùng GMV làm KPI lãi |
| ROAS | Doanh thu từ ads / Chi phí ads (ví dụ chi 50.000đ thu 1.700.000đ) | `05 §8.3` | KPI ads |
| CTR | click / hiển thị x 100% (ví dụ 2,91% là mức ổn) | `05 §8.3` | |
| CPC thực tế | Tổng chi phí ads / Tổng click | `05 §8.3` | khác giá thầu cài đặt |
| Giá thầu khoán | Giá thầu CPC = Giá bán x %Chi phí ads chịu được x %CR dự kiến (ví dụ 200.000 x 20% x 2% = 800đ) | `05 §8.3` | tính CPC trần |
| ROAS hòa vốn | = 1 / biên gộp (dòng trong `11 §3`) | `11` | |
| Target ROAS GMV Max | ví dụ 5-20 tùy biên lãi; đặt quá cao (20-30) quảng cáo không cắn tiền; muốn đẩy GMV thì hạ ROAS target | `05 §8.4` | ví dụ minh họa |
| Learning phase | Shopee/TikTok GMV Max ~7 ngày hoặc 50-100 đơn | `05 §8.1, §8.2` | kịch bản xấu: tháng đầu ads kém |
| Mức tiêu ads | Shopee có thể tiêu hết 1 triệu trong 1 giờ; chia ngân sách ngày | `05 §8.3` | ngân sách trần theo ngày |
| Giá thầu sàn khởi điểm | ví dụ 720đ/click | `05 §8.3` | ví dụ, không phải chuẩn |
| Ngày sale | Mega Sale ngày trùng tháng (9/9, 11/11...), Mini Spike Day 15 và 25 hàng tháng | `05 §1.3` | mùa vụ/kịch bản tốt |
| Affiliate | CPS/CPO/CPC/CPL; ~25% doanh thu người bán Shopee, ~60% TikTok Shop đến từ affiliate; hoa hồng chỉ trả khi đơn thành công | `05 §10.3` | kênh có chi phí biến đổi, không cố định |
| Chi tiêu giữ chân | tìm khách mới đắt gấp **6-7 lần** giữ khách cũ; bán cho khách cũ 60-70% vs khách mới 5-20% | `01 §4.5` (trích Bain, Marketing Metrics) | lý do để chi cho follower/voucher khách cũ |
| Thuế TNDN | chuẩn 20%; 15% (doanh thu ≤ 3 tỷ/năm), 17% (3-50 tỷ) | `06 B7 §3` | dòng thuế nếu đề hỏi sau thuế |
| Chi phí nghiên cứu | khoảng 2% doanh thu (ổn định), đến 10% khi ra sản phẩm mới | `06 B5 §4` | giả định chi phí nghiên cứu |

### 8.2 Số **không có** trong nguồn (đừng bịa, ghi "giả định cần nêu nguồn")

CR theo ngành, AOV, CPC theo ngành, tỉ lệ hoàn/hủy, tỉ lệ dùng voucher, % cannibalization, % giảm voucher thông dụng, phí vận chuyển, % hoa hồng affiliate cụ thể, giá vốn, lương. Nếu đề/BTC không đưa: đặt mức thận trọng, ghi lý do và khoảng min-max; nói thẳng "chưa kiểm với dữ liệu thật" (`11 §1`).

### 8.3 Mẫu điền

```
GMV = Traffic x CR x AOV.  Phí/đơn = AOV x feePct.  Marketing/đơn = CPC / CR.
Lãi góp/đơn = Giá - giá vốn - đóng gói - phí sàn - thuế - CPC/CR - chi phí ưu đãi bình quân.
Hòa vốn (đơn) = FC / lãi góp.  ROAS hòa vốn = 1 / biên gộp (sau phí sàn nếu đề tính vậy).
```

Tư duy theo giai đoạn gian hàng: **khởi động** = tạo traffic và dữ liệu (đừng đánh giá bằng doanh thu); **tăng trưởng** = tối ưu CR; **ổn định** = kiểm soát chi phí và lợi nhuận (`05 §4.3`). Lõi KPI: traffic (CTR), chuyển đổi (CR, giỏ hàng), doanh thu (GMV, AOV), vận hành (hoàn đơn, thời gian xử lý, phản hồi chat) (`05 §4.5`).

**Chẩn đoán phễu (đưa vào "nếu xấu đi thì sao"; `05 §11.4`):** traffic cao CR thấp → trang sản phẩm/giá/đánh giá chưa thuyết phục; traffic thấp CR cao → thiếu hiển thị; live đông mà doanh thu thấp → xem click giỏ, giữ chân, thanh toán (phí ship/voucher).

**Gắn vào app:** `assumptions[]` (traffic, cr, aov, cogs, feePct, taxPct, cpc, returnPct, voucherCostPerOrder, fixed); màn Kênh bán/Ads với ROAS và CPC tính từ giả định; panel Cách tính liệt kê công thức trên.

**Nói khi pitch:** "Mỗi đơn còn lãi <x>đ sau phí sàn, thuế, quảng cáo và ưu đãi; hòa vốn ở <n> đơn/tháng; rủi ro số 1 là CPC/CR."

## 9. Quản trị và kế hoạch cơ bản (khung cho phần kế hoạch + rủi ro)

**SMART (`06 B2 §2`, `01 §1.4`):** mỗi mục tiêu có số, thời hạn. Mẫu: "Tăng <chỉ số> từ <a> lên <b> trong <n> tháng, đo bằng <báo cáo>".

**Kế hoạch ngắn (`06 B2 §3-4`, `05 §4.1`):** trên sàn kế hoạch **ngắn hạn, linh hoạt** (tháng/quý), không như kế hoạch nhiều năm. 3 chiến lược cạnh tranh Porter: dẫn đầu chi phí, khác biệt hóa, tập trung (`06 B2 §3`). SME nên **tập trung** (`01 §2.4`).

**Dự báo khi chưa có dữ liệu:** ngoại suy đơn giản từ giả định logic (ví dụ "tháng đầu 20 đơn/ngày"), nghiên cứu thị trường, ý kiến chuyên gia (`06 B2 §4 bước 2`); ghi nhãn Giả định, không giả vờ chính xác.

**SWOT:** chọn 3-5 ý, tách nội bộ (S, W) với bên ngoài (O, T) (`06 B3 §2`).

**Ma trận rủi ro (đọc ngay cho điểm "số liệu dự phòng"; `06 B11 §2`):**

| Rủi ro | Xác suất (1-5) | Ảnh hưởng (1-5) | Điểm | Tín hiệu cảnh báo sớm | Người phụ trách | Kế hoạch ứng phó |
|---|---|---|---|---|---|---|

Rủi ro tiêu biểu từ giáo trình: đổi phí sàn (`05 §4.1`), tiêu thốc ngân sách ads, learning phase, hoàn/hủy, phạt vận hành (Sao Quả Tạ; `05 §11.1`), phụ thuộc khách hàng lớn hoặc nhà cung cấp (`06 B9 §3`). Lãi trên sổ nhưng thiếu tiền mặt là rủi ro dòng tiền (`06 B7 §1`).

**KPI kết quả và KPI dẫn dắt (`06 B11 §1`):** doanh thu tháng (kết quả) vs số lead/ngày (dẫn dắt).

**Khung SME từ `10`:**
- KHKD 12 phần: bìa, mục lục, tóm tắt điều hành (viết sau cùng, đặt đầu), thông tin doanh nghiệp, mục tiêu SMART, tầm nhìn-sứ mệnh, yếu tố then chốt thành công (3-5), ngành/thị trường + SWOT, sản phẩm/dịch vụ, marketing, đội ngũ, tài chính + phụ lục (dự phóng 3-5 năm: cân đối kế toán, kết quả kinh doanh, lưu chuyển tiền tệ, hòa vốn) (`10 Ch.1 §1.3`).
- **Lập kế hoạch kịch bản:** ít nhất 3 kịch bản lạc quan / cơ sở / bi quan (`10 Ch.1 §1.3`), khớp `11 §1`.
- Lãi/lỗ: Lợi nhuận gộp = Doanh thu − COGS; EBIT = Lợi nhuận gộp − chi phí hoạt động; EBT = EBIT + thu nhập lãi − chi phí lãi vay; Lợi nhuận ròng = EBT − thuế (`10 Ch.3 §3.2`).
- **Dự báo dòng tiền 3-12 tháng, 5 bước (`10 Ch.3 §3.2`):** dự báo doanh thu năm theo tăng trưởng lịch sử → phân bổ theo tỷ trọng mùa vụ → dòng tiền vào theo chính sách bán chịu (ví dụ thu 50% tháng này, 35% tháng sau, 15% hai tháng sau) → dòng tiền ra theo lịch đặt hàng (ví dụ trả 60% ngay, 40% tháng kế) cộng chi phí cố định → tìm tháng dòng tiền âm để chuẩn bị hạn mức hoặc cắt chi. Các tỷ lệ 50/35/15 và 60/40 là **ví dụ của giáo trình**, không phải chuẩn.
- 5 biện pháp dòng tiền dương: thu nợ nhanh hơn, giảm tồn kho dư, trì hoãn trả trong giới hạn hợp đồng, kiểm soát chi phí (thuê thay vì mua), dùng dự báo để đàm phán hạn mức dự phòng (`10 Ch.3 §3.4`). Lãi trên sổ vẫn có thể phá sản vì thiếu tiền mặt: nếu đề có bán chịu hoặc tồn kho, thêm dòng "tiền mặt cuối tháng" cạnh lợi nhuận.
- **Doanh thu mất do sai sót đơn hàng (`10 Ch.4 §4.4`):** = Số đơn/năm x %đơn lỗi x AOV x %khách bỏ đi vì lỗi. Dùng làm dòng rủi ro vận hành (hai tỷ lệ: **giả định cần nêu nguồn**).
- Thanh khoản: hệ số hiện hành = TS ngắn hạn / Nợ ngắn hạn (kỳ vọng ≥ 1,5-2,0 tùy ngành); thanh toán nhanh trừ tồn kho; số ngày phải thu = Phải thu / (Doanh thu/365) (`10 Ch.3 §3.3`; `06 B8 §3`).
- Nhà cung cấp quyền lực cao, chi phí chuyển đổi cao, hoặc phụ thuộc một khách lớn là rủi ro chuỗi (`10 Ch.4 §4.3`); ma trận rủi ro `06 B11 §2`.

**Gắn vào app:** màn Rủi ro (bảng trên) liên kết với tornado; dự phòng 10-15% ở `11 §5` (là quy tắc đội, không phải số của giáo trình).

**Nói khi pitch:** "3 rủi ro lớn nhất, tín hiệu báo sớm, ai theo dõi, và kế hoạch ứng phó."

## 10. Cơ chế ưu đãi thực tế (checklist cho 10 điểm)

Giám khảo hỏi: "Nếu là chủ cửa hàng, có dám chạy không?" Mỗi mục có ô trong app và một dòng trong `docs`:

- [ ] **Mục tiêu chọn đúng một trong ba:** tăng traffic, tăng CR, hoặc tăng AOV; chọn công cụ tương ứng (`05 §7.3`). Voucher/flash sale = tăng CR; combo/deal sốc = tăng AOV (`05 §7.1`).
- [ ] **Ngân sách trần:** ngân sách = ads + giảm giá + hoa hồng; chạm trần thì dừng; hiện "Còn lại" (`05 §7.3` dự toán ngân sách; ngưỡng trần là **giả định của đội**).
- [ ] **Điều kiện áp dụng:** đơn tối thiểu để khuyến khích mua thêm (`05 §7.1`), khách mới/cũ, nhóm sản phẩm, khung giờ (flash sale ngắn tạo khan hiếm, chọn hàng chủ lực và cân biên; `05 §7.1`).
- [ ] **Sàn lãi tối thiểu (margin floor):** sau ưu đãi vẫn có lãi góp > 0 (`11 §4 mục 5`). Dùng công thức giá `C0 / (1 - (F+M+R))` để tìm mức giảm tối đa (`05 §3.2`); nếu thấp hơn thì gọi đây là chi phí thu hút khách và so với CAC (`01 §2.5`, 10 chỉ số theo dõi).
- [ ] **Không lỗ kép:** không chồng nhiều chương trình cùng lúc; kiểm tra điều kiện áp dụng (`05 §7.3`). Voucher shop + voucher sàn + Freeship + hoàn xu cộng dồn thế nào, ghi rõ.
- [ ] **Cannibalization:** phần khách vốn đã mua giá đầy đủ. Giáo trình nhắc "giảm giá chỉ có tác dụng ngắn hạn" (`02 §1.2`, trích Hanssens) nhưng **không có % cụ thể**; tỉ lệ này là **giả định cần nêu nguồn** (công thức ở `11 §4`).
- [ ] **Chống lạm dụng:** giới hạn mỗi khách/lượt/thời hạn. Giáo trình liệt kê hành vi lạm dụng sàn quét: trùng IP/thiết bị, mua lặp, đơn rỗng, lạm dụng mã Freeship/hoàn xu; tự đặt đơn để trục lợi bị khóa shop (`05 §6.5`). Ghi vào luật ưu đãi: mỗi SĐT/tài khoản tối đa <n> lần.
- [ ] **Giá niêm yết minh bạch:** không nâng giá ảo quá 50%; không sửa giá gốc sát ngày khuyến mãi (`05 §3.2, §6.5`).
- [ ] **Bảo vệ lợi ích khách:** quyền đổi trả 15 ngày làm tăng tỉ lệ hoàn (`05 §1.1`); tính `returnPct` vào mô hình.
- [ ] **Hiệu quả đo được:** theo dõi CR, AOV, chi phí marketing và tắt/nhân rộng chương trình (`05 §7.3`); **không** chỉ đo lượt dùng.
- [ ] **Tần suất cao, giá trị linh hoạt tốt hơn một đợt lớn ngắn hạn** (xu hướng voucher liên tục của sàn, `05 §1.1`): lý do để đặt trần theo tuần thay vì một cú lớn.
- [ ] **Kết luận bằng chữ:** "Chạy khi <điều kiện>, dừng khi <ngưỡng>" (`11 §4`).
- [ ] **7 bước chương trình khuyến mại (`08 Bài 10 §10.2`):** mục tiêu → chọn công cụ → thiết kế quy mô/điều kiện → thử nghiệm trước → triển khai (tính lead time và sell-in time) → kiểm soát → đánh giá bằng so sánh doanh số trước-trong-sau.
- [ ] **Rủi ro khuyến mại (`08 Bài 10 §10.2`):** giảm giá trị cảm nhận thương hiệu, khách chỉ chờ giảm giá mới mua, giảm biên lợi nhuận. Ghi vào ma trận rủi ro.
- [ ] **Cannibalization nội dòng (`08 Bài 5 §5.2`, `Bài 6 §6.1`):** mở rộng dòng/combo có thể "nuốt" sản phẩm khác; kiểm ở bước sàng lọc. Giáo trình chỉ nêu khái niệm, không có tỷ lệ.
- [ ] **Tâm lý giá:** neo giá (giá đầu tiên neo cảm nhận; `07` Phần I Ch.2 §2.3), chim mồi cùng cơ chế (`05 §5.3`), "chưa hết đâu" và bằng chứng xã hội (`07` Ch.5 §5.3). Dùng trung thực: thuyết phục cung cấp thông tin đúng, thao túng là cắt xén sự thật (`08 Bài 12 §12.5`).
- [ ] **Giữ chân bằng củng cố tích cực:** tích điểm, hoàn tiền, quà tặng (`07` Ch.2 §2.1); giữ khách rẻ hơn tìm mới (`01 §4.5`, `06 B4 §1`).

Ngân sách và các ngưỡng số (trần, % giảm, đơn tối thiểu, số lần/khách) là **do đội đặt**; ghi nhãn Giả định + lý do trong app.

## 11. Nguồn kiến thức (10 file, đã đủ)

| File | Có | Mục nên mở khi cần |
|---|---|---|
| 01 | Có | §1.5 phân khúc nền, §2 chọn phân khúc, §3 persona, §4 hành trình, §4.5 benchmark giữ chân |
| 02 | Có | §1.3 tam giác, §2.2 USP, §2.5 công thức, §3 hệ sinh thái sản phẩm |
| 03 | Có | Phần 2 công thức viết (FAB/PAS/BAB/AIDA/4C), Phần 3 tiêu đề, Phần 4 §4.7 ngân sách content |
| 04 | Có | §I.7 nội dung, §III.4-5 chọn/chấm kênh, §III.7 đo lường |
| 05 | Có | §1.3, §3.2, §4, §7, §8, §6.5, §11.4 |
| 06 | Có | B2 kế hoạch, B7 kế toán/thuế, B8 hòa vốn, B11 KPI/rủi ro |
| 07 | Có | Phần I Ch.6 quy trình mua, Ch.3 mức tham gia, Ch.5 thuyết phục; Phần II nghiên cứu (mẫu, bảng hỏi) |
| 08 | Có | Bài 4 STP, Bài 8 giá, Bài 9 5M/ngân sách quảng cáo, Bài 10 khuyến mại, Bài 12 bán hàng, Case 4 cấu trúc giá |
| 09 | Có | Phần I SEO/trang web, Phần II §4.4 phễu web η, §6.2 định giá T = P + O |
| 10 | Có | Ch.1 KHKD 12 phần + kịch bản + Porter, Ch.3 kế toán/dòng tiền/chỉ số, Ch.4 SCM, Ch.2 ngân sách marketing |

File mới sau này: thêm hàng vào đây và vào `kien-thuc/README.md`.

## 12. Pitch 3 phút: sơ đồ nói (ghép từ các khung)

1. USP một câu + phân khúc/persona (20 giây).
2. Phễu sản phẩm và cách kiếm tiền (30 giây).
3. 3-4 giả định có nguồn, nói "đây là giả định" ra miệng (40 giây).
4. Demo kéo một giả định, chỉ hòa vốn (40 giây).
5. Kịch bản xấu, tornado, ma trận rủi ro (30 giây).
6. Cơ chế ưu đãi: trần, điều kiện, kiểm lãi, chống lạm dụng, kết luận chạy/dừng (20 giây).
