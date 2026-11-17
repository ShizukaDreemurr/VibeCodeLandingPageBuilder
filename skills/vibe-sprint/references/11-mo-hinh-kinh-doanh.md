# 11. Mô hình kinh doanh: lấy điểm bảng Kinh tế (49 điểm) trong 60 phút

Bảng Kinh tế chấm: lõi 27 · di động 10 · giao diện 5 · **tính thực tế của cơ chế kinh doanh/khuyến mãi 10 · phân tích mô hình kinh doanh 22 · số liệu dự phòng và giả định 17** · hồ sơ nộp 9. Ba mục in đậm là **49 điểm** nằm ở cách bạn nghĩ về tiền, không nằm ở số dòng code. Một app đẹp nhưng không nói được "vì sao con số này", "nếu xấu đi thì sao", "bao giờ hòa vốn" sẽ mất gần một nửa điểm.

Tài liệu này không chứa số liệu của đề nào cả. Nó cho bạn **khung hỏi**, **công thức**, **cách trình bày**, và cách dựng nhanh bằng `EP.scenario` + `EP.importer` có sẵn trong starter.

## 1. Quy tắc vàng

1. **Mỗi con số có một lý do một dòng** ("Giả định: ... vì ..."). Số không lý do = số bịa.
2. **Ba kịch bản** (xấu / cơ sở / tốt), không chỉ một. Nói rõ cái gì đổi giữa các kịch bản.
3. **Điểm hòa vốn** và **thời gian hoàn vốn** luôn có (hoặc nói thẳng "chưa hòa vốn trong kịch bản xấu").
4. **Độ nhạy**: chỉ ra 2-3 giả định "đau" nhất, và có kế hoạch cho chúng.
5. **Dự phòng 10-15%** trên chi phí, nằm trong bảng, không nói miệng.
6. **Nhãn trung thực**: số mô phỏng ghi "Mô phỏng", số lấy từ file BTC ghi "Dữ liệu mẫu (BTC)" (nhãn `Dữ liệu mẫu` của `EP.scenario`), số tự đặt ghi "Giả định". Không bao giờ để số giả trông như số thật.
7. Giờ, địa điểm, giá, tên người lấy từ form/đề, không để AI viết. AI chỉ giải thích và gợi ý.

## 2. Danh sách giả định cần nêu, theo loại đề

Chép các dòng phù hợp vào bảng giả định (`assumptions` của `EP.scenario`). Cột "Thường là" chỉ là gợi ý để định hướng, **luôn thay bằng số của đề / BTC / nguồn bạn trích được**.

| Loại đề | Giả định bắt buộc nêu |
|---|---|
| **Bán lẻ** (cửa hàng, shop) | Số khách/ngày, tỉ lệ mua, giá trung bình mỗi đơn (AOV), số món mỗi đơn, giá vốn, hao hụt/hàng lỗi %, chi phí cố định (thuê, lương, điện), vốn hàng tồn, tăng trưởng theo tháng |
| **F&B** (quán cà phê, nhà hàng) | Số khách giờ cao điểm / thấp điểm, chi tiêu mỗi khách, giá vốn nguyên liệu % (thường 25-35% doanh thu), hao hụt nguyên liệu, số ca và lương, thuê mặt bằng, mùa vụ (mưa, lễ), phí app giao hàng % |
| **Thương mại điện tử** | Lượt truy cập, tỉ lệ chuyển đổi (CR), AOV, giá vốn, phí sàn + thanh toán %, phí vận chuyển và ai chịu, tỉ lệ hoàn/hủy %, CPC hoặc CPA quảng cáo, tỉ lệ khách mua lại |
| **Dịch vụ / thuê bao** | Số khách mới/tháng, giá gói, tỉ lệ rời bỏ (churn) %, chi phí phục vụ mỗi khách, chi phí thu hút khách (CAC), công suất tối đa (số buổi, số chỗ) |
| **Sự kiện** | Sức chứa, giá vé từng hạng, tỉ lệ lấp đầy, chi phí cố định (địa điểm, âm thanh), chi phí biến đổi mỗi khách, tài trợ, tỉ lệ không đến (no-show), hạn bán sớm |
| **Khuyến mãi / voucher** | Ngân sách tối đa, mức giảm, điều kiện áp dụng, giới hạn mỗi khách, tỉ lệ dùng voucher (redemption), tỉ lệ khách vốn dĩ sẽ mua (cannibalization), khách mới thật sự thu về, thời hạn |

Mỗi giả định đi kèm: **giá trị · đơn vị · khoảng min-max hợp lý · lý do/nguồn · hướng tốt/xấu** (cao hơn là tốt hay xấu). Trong `EP.scenario` chính là các trường `value, unit, min, max, why, better`.

## 3. Công thức lõi

Viết công thức ra màn hình ("Cách tính") cùng số thật. Ký hiệu: P giá bán, V giá vốn mỗi đơn vị, Q số lượng, F chi phí cố định.

| Chỉ tiêu | Công thức | Ghi chú |
|---|---|---|
| Doanh thu | P × Q | Trừ giảm giá/khuyến mãi nếu có |
| Giá vốn hàng bán (COGS) | V × Q | |
| Lợi nhuận gộp | Doanh thu − COGS | |
| Biên lợi nhuận gộp | Lợi nhuận gộp ÷ Doanh thu | % |
| Lợi nhuận ròng | Doanh thu − COGS − phí sàn − quảng cáo − F | Trước thuế |
| Biên lợi nhuận ròng | Lợi nhuận ròng ÷ Doanh thu | |
| AOV (giá trị đơn TB) | Doanh thu ÷ Số đơn | |
| CR (tỉ lệ chuyển đổi) | Số đơn ÷ Lượt truy cập | |
| CPC | Chi phí quảng cáo ÷ Số lượt nhấp | |
| CPO / CPA (chi phí mỗi đơn) | Chi phí quảng cáo ÷ Số đơn = CPC ÷ CR | |
| ROAS | Doanh thu từ quảng cáo ÷ Chi phí quảng cáo | ROAS hòa vốn = 1 ÷ biên gộp |
| CAC | Tổng chi phí thu hút khách ÷ Số khách mới | |
| LTV | AOV × Biên gộp × Số lần mua / khách (hoặc giá gói × biên gộp ÷ churn) | Ổn khi LTV ÷ CAC ≥ 3 |
| Lãi góp mỗi đơn vị (contribution) | P − V − biến phí khác (phí sàn, CPA) | |
| **Điểm hòa vốn (đơn vị)** | F ÷ Lãi góp mỗi đơn vị | Lãi góp ≤ 0 thì **không bao giờ hòa vốn**: hiện "Không đủ dữ liệu" hoặc nêu lý do, không chia |
| Điểm hòa vốn (doanh thu) | Hòa vốn (đơn vị) × P | |
| **Thời gian hoàn vốn** | Vốn ban đầu ÷ Lợi nhuận mỗi tháng | Lợi nhuận tháng ≤ 0 thì chưa hoàn vốn |
| NPV đơn giản | Σ (Dòng tiền tháng t ÷ (1 + r)^t) − Vốn ban đầu | r = lãi suất chiết khấu theo tháng (vd 12%/năm ≈ 1%/tháng); chỉ dùng khi đề hỏi đầu tư nhiều tháng |

Lưu ý chia cho 0: số đơn = 0, doanh thu = 0, lãi góp ≤ 0 đều là trường hợp có thật khi người dùng kéo kịch bản xấu. App phải hiện chữ "Không đủ dữ liệu", không hiện NaN, Infinity hay "−∞". (Bẫy: `EP.metrics.div(a, b, null)` vẫn trả 0 vì `null` bị coi là "không có giá trị dự phòng". Cần giá trị rỗng thì tự viết `b > 0 ? a / b : null`.)

## 4. Cơ chế khuyến mãi: làm sao cho "thực tế" (10 điểm)

Giám khảo kinh tế hỏi: "Nếu mình là chủ cửa hàng, có dám chạy khuyến mãi này không?" Trả lời bằng 5 mục, đặt trong một thẻ "Cơ chế khuyến mãi":

1. **Ngân sách trần**: tổng tiền tối đa bỏ ra (vd 10.000.000 ₫). Khi chạm trần thì dừng. Ghi trên màn hình "Còn lại: ...".
2. **Giới hạn**: tối đa mỗi khách, tối đa số lượt, thời hạn, khung giờ. Không có giới hạn = lỗ không đáy.
3. **Điều kiện áp dụng**: đơn tối thiểu, nhóm sản phẩm, khách mới hay cũ, không cộng dồn với mã khác. Điều kiện nên làm AOV tăng chứ không chỉ cho không tiền.
4. **Cannibalization** (ăn doanh thu của chính mình): một phần khách vốn đã định mua giá đầy đủ. Đặt tỉ lệ này thành giả định (vd 40%) và tính **doanh thu tăng thêm thật** = lượt dùng × (1 − tỉ lệ cannibalization) × giá trị đơn.
5. **Kiểm tra lãi**: đơn sau khuyến mãi vẫn còn lãi góp > 0? Nếu không, nêu rõ đây là chi phí thu hút khách và so với CAC thị trường.

Công thức nên có sẵn: Chi phí khuyến mãi = lượt dùng × mức giảm. Doanh thu tăng thêm = lượt dùng × (1 − cannibalization) × AOV. ROI khuyến mãi = (Lợi nhuận gộp tăng thêm − Chi phí khuyến mãi) ÷ Chi phí khuyến mãi. Và một câu kết luận bằng chữ: "Chạy khi ..., dừng khi ...".

## 5. Số liệu dự phòng (17 điểm)

- **Quỹ dự phòng 10-15% trên tổng chi phí** là một dòng riêng trong bảng, kèm "Lợi nhuận sau dự phòng". Nếu lợi nhuận mất dấu dương sau dự phòng, nói luôn.
- **Kịch bản xấu bắt buộc**: giảm lượng khách/CR, tăng giá vốn và chi phí quảng cáo cùng lúc (mặc định ±15% trong `EP.scenario.spread`). Hiện rõ lỗ bao nhiêu và còn trụ được bao nhiêu tháng với vốn hiện có (vốn ÷ lỗ mỗi tháng).
- **Kế hoạch ứng phó** cho từng rủi ro lớn nhất lấy từ biểu đồ độ nhạy: "Nếu CPC tăng 20%: giảm ngân sách quảng cáo/chuyển kênh tự nhiên; nếu giá vốn tăng: nâng giá 5% hoặc đổi nhà cung cấp".
- **Điểm kích hoạt**: ngưỡng nào thì đổi kế hoạch (vd CR dưới 1,5% hai tuần liền thì dừng quảng cáo).
- **Nêu rõ giới hạn của mô hình** ("mô hình tuyến tính, chưa tính mùa vụ"). Thừa nhận giới hạn được điểm hơn giả vờ chính xác.

## 6. Trình bày giả định trên màn hình và khi thuyết trình

**Trên màn hình**
- Một bảng giả định sửa được ở đầu trang, mỗi dòng có nhãn **Giả định / Dữ liệu mẫu / Mô phỏng** và lý do.
- Kết quả đặt cạnh nhau 3 kịch bản; kịch bản đang xem được tô nhẹ.
- Panel "Cách tính" liệt kê công thức kèm số hiện tại (giám khảo thích kiểm lại bằng máy tính).
- Biểu đồ độ nhạy (tornado): thanh dài nhất là rủi ro số 1.
- Nút "Xuất CSV" và "Sao chép cho slide" để số trong app và số trong slide **khớp từng chữ số**.

**Khi thuyết trình (gợi ý 3 phút cho phần kinh tế)**
1. 20 giây: mô hình kiếm tiền ở đâu (một câu, nêu 3 dòng tiền chính).
2. 40 giây: 3-4 giả định quan trọng nhất và vì sao chọn số đó. Nói "đây là giả định" ra miệng.
3. 60 giây: demo kéo một giả định (vd giá bán), kết quả đổi theo. Chỉ vào điểm hòa vốn.
4. 40 giây: kịch bản xấu và biểu đồ độ nhạy: "rủi ro lớn nhất là X, mình xử lý bằng Y".
5. 20 giây: khuyến mãi có ngân sách trần và điều kiện, doanh thu tăng thêm thật là bao nhiêu.

Câu hỏi hay gặp của giám khảo: "Số này lấy ở đâu?" (trả lời: giả định + lý do + khoảng min-max), "Nếu khách ít hơn 30% thì sao?" (kéo kịch bản, chỉ độ nhạy), "Sao biết mình lãi?" (mở Cách tính, đọc công thức), "Khuyến mãi có bị lạm dụng không?" (giới hạn mỗi khách + ngân sách trần).

## 7. Dùng `EP.scenario` và `EP.importer` trong 10 phút

Cả hai là **mô-đun chung**, không gắn với đề nào. Ví dụ chạy được nằm ở tab Mô-đun > **Kinh doanh** và **Nhập file** (`#/playground/biz`, `#/playground/import`), mã ở `features/_playground/feature.js` (SHOP, mountBiz, mountImport).

### 7.1 Dựng mô hình (6 phút)

Trong view của feature, thay các số/nhãn của SHOP bằng giả định của đề:

```js
var sc = EP.scenario.mount(el, {
  id: 'ten-de',                       // khoá lưu; đổi id khi đổi bộ giả định
  title: 'Mô hình kinh doanh',
  unitLabel: 'vé',                    // đơn vị của điểm hòa vốn
  assumptions: [
    { key: 'price', label: 'Giá vé', unit: '₫', value: 150000, min: 50000, max: 500000, step: 5000, better: 'up', why: 'Giả định: ... vì ...' },
    { key: 'fill',  label: 'Tỉ lệ lấp đầy', unit: '%', value: 70, min: 30, max: 100, step: 1, better: 'up', why: '...' },
    { key: 'fixed', label: 'Chi phí cố định', unit: '₫', value: 40000000, better: 'down', why: '...' }
  ],
  compute: function (a) {               // hàm THUẦN: nhận số, trả số (phần trăm đã là 70 chứ không phải 0,7)
    var q = a.capacity * a.fill / 100, revenue = q * a.price;
    return { revenue: revenue, profit: revenue - q * a.varCost - a.fixed,
             fixed: a.fixed, unitContribution: a.price - a.varCost, unitPrice: a.price };   // có 3 trường này là tự có điểm hòa vốn
  },
  outputs: [{ key: 'revenue', label: 'Doanh thu', format: 'money', card: true },
            { key: 'profit', label: 'Lợi nhuận', format: 'money', kpi: true, card: true }],
  kpi: 'profit',
  explain: [{ label: 'Doanh thu', formula: 'Doanh thu = Vé bán × Giá vé', live: function (a, r, F) { return F.money(r.revenue); } }]
});
```

Bạn nhận được: bảng giả định có ô tiền vi-VN + thanh trượt + cảnh báo ngoài khoảng, 3 kịch bản tự sinh từ `better` (biên độ chỉnh được), bảng kết quả, hòa vốn (chặn chia 0 thành "Không đủ dữ liệu"), hoàn vốn nếu trả thêm `investment` (+ `profit`), tornado ±10%/±20% theo KPI chọn được, panel Cách tính, lưu tự động (`localStorage`), `sc.exportCsv()`, `sc.copyText()`. Cần kịch bản riêng: truyền `scenarios: [{ id, label, adjust: { price: 0.9, fixed: { set: 50000000 } } }]`.

Quy tắc đặt `better`: `'up'` nếu giá trị cao hơn là tốt (giá bán, lượng khách, CR), `'down'` nếu cao hơn là xấu (giá vốn, CPC, chi phí cố định), bỏ trống nếu không đổi theo kịch bản. `sens: false` để loại một giả định khỏi tornado (vd quỹ dự phòng).

Ghi nhãn: `tag: 'mock'` cho cả mô hình là mô phỏng, hoặc từng dòng `source: 'sample'` khi số lấy từ file BTC (`sc.setValue('price', 43000, { source: 'sample' })`).

### 7.2 Nhập file mẫu của BTC (4 phút)

```js
EP.importer.mount(el, {
  collection: EP.collection('btc_sample'),
  tag: 'Dữ liệu mẫu từ BTC',
  fields: [
    { key: 'day',   label: 'Ngày',     type: 'date',   required: true, aliases: ['ngay ban'] },
    { key: 'name',  label: 'Sản phẩm', type: 'text',   required: true, aliases: ['ten hang', 'mon'] },
    { key: 'qty',   label: 'Số lượng', type: 'number', aliases: ['sl'] },
    { key: 'price', label: 'Đơn giá',  type: 'money',  aliases: ['gia'] }
  ],                                   // aliases viết thường, không dấu
  onImport: function (rows) { /* tính trung bình, vẽ biểu đồ, đưa vào giả định */ }
});
```

Luồng người dùng: chọn file (.xlsx / .xls / .csv, kéo thả được) → chọn sheet → xem trước 20 dòng → cột được tự đoán theo tên (sửa được) → báo "N dòng hợp lệ, M lỗi, K dòng trống" kèm số dòng và lý do → nhập vào collection, mỗi dòng gắn `tag`. Hiểu số `1.234.567,5` và ngày `dd/mm/yyyy`; sheet có số/ngày dạng chữ vẫn đọc được. File Excel đọc bằng SheetJS đã nhúng sẵn (`js/vendor/`, Apache-2.0, nạp lười khi cần), chạy offline.

Mẹo cuộc thi: (1) nhập xong **tính ngay** một đại lượng từ dữ liệu (giá TB, tổng doanh thu, mùa cao điểm) và đưa nó vào giả định với `sc.setValue(key, value, { source: 'sample' })`, để giám khảo thấy số liệu BTC thật sự được dùng; (2) nếu file có cột lạ, thêm `aliases` thay vì sửa file; (3) cột không ghép được thì bỏ qua, không chặn nhập; (4) nếu file lỗi hàng loạt, báo bằng tiếng Việt và cho tải file mẫu về (`sampleUrl`).

### 7.3 Kiểm thử và nộp

- Chạy `node tests/smoke.cjs http://localhost:8211/` (đã có kiểm tra hòa vốn, chia 0, dấu của độ nhạy, CSV, nhập xlsx/csv, 360px/390px không tràn ngang). Khi đổi compute của đề, thêm vài `ok(...)` kiểm đúng một kịch bản bằng tay tính.
- Xóa phần SHOP/mountBiz cùng thư mục `_playground` khi nộp (nếu không dùng), hoặc giữ như ví dụ nhưng đừng để lẫn với dữ liệu của đề. Luật chung kết cấm dựng sẵn tính năng cho đề chưa biết: chỉ mô-đun chung này được phép có sẵn, logic của đề phải viết trong giờ thi.
- Ghi vào `docs/MINH-CHUNG-AI.md` / bảng kiểm thử đúng sự thật: số nào là giả định, số nào từ file BTC, phần nào là mô phỏng.

## 8. Checklist cuối cùng cho 49 điểm

- [ ] Mỗi giả định có giá trị, đơn vị, khoảng hợp lý, lý do một dòng, nhãn Giả định/Dữ liệu mẫu/Mô phỏng.
- [ ] 3 kịch bản, nói rõ cái gì đổi; kịch bản xấu thật sự xấu.
- [ ] Doanh thu, giá vốn, lợi nhuận, biên, hòa vốn (đơn vị và doanh thu), hoàn vốn; chia 0 xử lý đúng.
- [ ] Độ nhạy chỉ ra giả định rủi ro nhất + kế hoạch ứng phó.
- [ ] Dự phòng 10-15% có dòng riêng trong bảng.
- [ ] Khuyến mãi: ngân sách trần, giới hạn, điều kiện, cannibalization, kiểm lãi.
- [ ] Số trong app = số trong slide (dùng Xuất CSV / Sao chép cho slide).
- [ ] Mở ở 360-390px: bảng giả định, bảng kết quả, tornado đều đọc được, không tràn ngang.
- [ ] Nói được 3 phút phần kinh tế theo mục 6.

## 9. Liên kết khung kiến thức

Tài liệu này cho công thức và cách dựng `EP.scenario`. **Khung hỏi và số liệu có nguồn** nằm ở:

- `12-khung-kinh-doanh-cho-de.md`: thứ tự khung trong T+0-10 (phân khúc/STP, persona, USP + 7 bài kiểm, tam giác định vị, phễu sản phẩm, 4P/5P/7P + công thức giá bán lẻ, kênh + nội dung, cơ chế sàn TMĐT, kế hoạch/rủi ro) và checklist "Cơ chế ưu đãi thực tế" (mục 10 của file đó). Mỗi khung có mẫu điền, ô giả định tương ứng và câu nói khi pitch.
- `kien-thuc/README.md`: mục lục các file giáo trình (đủ 10 file 01-10) kèm "dùng khi nào".

Gợi ý nối với các mục trên:

| Cần | Mở |
|---|---|
| Danh sách giả định theo loại đề (mục 2) có số mẫu từ giáo trình | `12` mục 8.1 (phí sàn 5,5-6%, thuế 1% + 0,5%, công thức ads) và 8.2 (số không có trong nguồn) |
| Công thức lõi (mục 3) kiểm chéo | `kien-thuc/05` §4.2, §4.4, §8.3; `kien-thuc/06` Bài 8 §2 |
| Cơ chế khuyến mãi (mục 4) | `12` mục 10; `kien-thuc/05` §7, §6.5 |
| Dự phòng, rủi ro, kế hoạch ứng phó (mục 5) | `12` mục 9; `kien-thuc/06` Bài 11 §2 |
| Một câu USP, vì sao chọn chúng tôi | `12` mục 3; `kien-thuc/02` §2 |
| Viết USP thành tiêu đề/CTA/trang đích | `12` mục 3 (khối "Từ USP sang câu chữ"); `kien-thuc/03` Phần 2-3 |
| Dòng tiền theo tháng, kịch bản, báo cáo lãi/lỗ | `12` mục 9; `kien-thuc/10` Ch.1 §1.3, Ch.3 |
| Giá bán, hòa vốn quảng cáo, hớt váng/thâm nhập | `12` mục 6; `kien-thuc/08` Bài 8-9 |
| Phễu web (nhận biết → mua lặp lại) | `12` mục 7; `kien-thuc/09` Phần II §4.4 |
| Kiểm chứng giả định (phỏng vấn, khảo sát, cỡ mẫu) | `12` mục 2; `kien-thuc/07` Phần II |

Quy tắc dùng: số trong giáo trình chỉ là **ví dụ/giá trị tham chiếu có nguồn**; số của đề/BTC luôn thắng; số không có trong nguồn ghi "giả định cần nêu nguồn". Prompt cho agent "Giả định & mô hình kinh doanh": `prompts/13-business-agent.md`.
