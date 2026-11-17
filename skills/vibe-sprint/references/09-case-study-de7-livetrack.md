# Case Study & Kinh Nghiệm Điều Phối Dự Án: Đề 7 — LiveTrack SME

> **Tư liệu chạy thử thật của đội** (50 phút, 16 subagent trong 3 đợt, 60/60 test). Đọc để thấy điều phối thật diễn ra thế nào và lỗi nào đã gặp; số liệu, tên trường và ví dụ chỉ minh hoạ, không phải chuẩn bắt buộc. Bài học then chốt đã rút thành quy tắc: Schema Contract, Code tính số AI diễn giải, đợt 1/2/3 (xem `02-dieu-phoi-agent.md`).

> Tài liệu tổng hợp toàn bộ kiến trúc, quy trình điều phối multi-agent, kết quả kiểm thử và bài học thực chiến từ dự án **LiveTrack SME (Đề 7 – Dashboard theo dõi hiệu quả livestream bán hàng)**, dùng làm tư liệu học tập cho **Gemini Điều phối chính**.

---

## 1. Bối cảnh & Bài toán (Đề 7)

- **Bài toán cốt lõi:** Shop livestream nhiều buổi/tuần nhưng chưa tách bạch được buổi nào bán tốt nhờ **nội dung/kịch bản** và buổi nào doanh thu cao chủ yếu do **chi nhiều tiền quảng bá**.
- **Chân dung khách hàng mục tiêu:** Chủ shop / Quản lý vận hành SME "tay ngang" (TikTok Shop, Shopee Live, Facebook Live), thao tác chủ yếu trên điện thoại, ngân sách **0 đồng** (không có API trả phí realtime).
- **Ràng buộc kỹ thuật (`vibe-sprint-skill.zip`):** HTML/CSS/JS thuần (zero-build), lưu trữ `localStorage`, chạy offline/local/GitHub Pages, AI phân tích có nhãn minh bạch (`AI phân tích nội bộ (Mock có nhãn) · Không dùng API trả phí`), xử lý bắt buộc `Không đủ dữ liệu` khi mẫu số `= 0`.

---

## 2. Quy trình Điều phối Multi-Agent đã thực hiện (3 Đợt — 16 Subagent song song)

Thay vì làm tuần tự, điều phối viên chia việc theo **quyền sở hữu file tách biệt (strict file ownership)** để các subagent chạy song song không xung đột:

### Đợt 1 — Dựng lõi MVP theo Đề 7 (5 subagent song song)
- Giải nén bộ starter `vibe-sprint` vào thư mục `app/`.
- **5 agent song song:**
  1. `Shell & Mobile-First UI`: cấu hình `index.html`, `js/config.js`, `css/custom-live.css` (touch target ≥ 44px, bảng chuyển thành card ở `≤ 767px`).
  2. `Metrics & Demo Data`: xây `js/live-metrics.js` (CR, AOV, CPO, guard mẫu số `= 0` -> `Không đủ dữ liệu`, parser Excel/CSV) và `js/demo-data.js`.
  3. `AI Specs & Report`: xây `js/ai-specs.js` (tính số bằng JS trước khi đưa vào AI, trích dẫn ≥ 1 số liệu thật, không khẳng định nguyên nhân khi thiếu dữ liệu, tạo báo cáo copy gửi quản lý).
  4. `Livestream Feature`: xây `features/livestream/feature.js` (2 lựa chọn nhận phiên + 1 nút phụ *Điền dữ liệu mẫu*, KPI, biểu đồ chuyển chỉ số, AI, copy báo cáo).
  5. `Docs & QA Test`: viết `docs/spec-nhanh.md`, `docs/BANG-KIEM-THU.md`, `tests/livestream.cjs` (Node `vm` sandbox).

### Đợt 2 — Nâng cấp theo yêu cầu thực tế & 2 Theme mẫu (5 subagent song song)
- **Thay đổi từ người dùng:**
  - Web mở đầu **trống hoàn toàn** (`autoSeedDemo: false` trong `config.js` & `demo.js`), chỉ nạp mẫu khi bấm nút phụ hoặc `?demo=1`.
  - Đóng gói offline `js/vendor/xlsx.mini.min.js` (SheetJS) để đọc trực tiếp file **`.xlsx` / `.xls` / `.csv`** trên trình duyệt.
  - Mở rộng bộ chỉ số **Tương tác** (tổng view, đỉnh cao, trung bình, thời gian xem TB, tổng tương tác, follow mới) + **Kinh doanh** + **Danh sách đơn hàng trong phiên & Thống kê số lượng bán theo từng mã (SKU)**.
  - Áp dụng mạnh và cho phép chuyển đổi trực tiếp 2 bộ giao diện: **`xclipse-ui-ux-tam-nhin.html`** (Fluted Glass Hero + Quả cầu 3D hồng-xanh, `#DBF2FC · #072D59 · #FD6E88`, `Playfair Display` italic) và **`xclipse-ui-ux-lucian.html`** (vi tương tác lò xo `--ux-spring`, kính mờ, `tabular-nums`).

### Đợt 3 — Tích hợp 8 Micro-Features từ Gemini Deep Research (6 subagent song song)
Dựa trên báo cáo chiến lược dashboard livestream SME của đội (tệp cục bộ, không đi kèm skill), tách **6 agent song song** tích hợp:
1. `Metrics Engine`: Tỷ lệ bấm giỏ (`clicks/views`), Đơn/1.000 lượt xem, **Quảng bá ăn vào doanh số (%)**, Trần QC hòa vốn & Ước tính lãi/lỗ gộp, 5 nhãn phân loại bình dân, Chẩn đoán đứt gãy phễu 3 chặng (*Xem → Bấm giỏ → Chốt đơn*), Đối chiếu trung bình 14 phiên gần nhất, Đối soát đơn hoàn sau 7 ngày, Lọc kênh.
2. `Settings, Backup & Demo`: Tạo `js/live-settings.js` (lưu Smart Defaults `% Phí sàn` mặc định 22% & `% Giá vốn` mặc định 45%, tự nhớ danh sách Host, **Sao lưu & Khôi phục JSON 1 chạm**, nhắc sao lưu sau 14 ngày).
3. `AI & Zalo Report v3`: Nâng cấp `js/ai-specs.js` đưa ngữ cảnh phiên (Kênh, Host, Khung giờ, Điều mới đã thử), chẩn đoán phễu và mẫu báo cáo Zalo chuẩn chủ shop SME.
4. `CSS Micro-UX v3`: Style cho chip ngữ cảnh 1 chạm, thanh màu *Quảng bá ăn % doanh số*, dải chẩn đoán phễu 3 chặng, nhãn tăng/giảm 14 phiên, ngăn cài đặt & nhắc sao lưu.
5. `Feature UI v3`: Tích hợp toàn bộ vào `features/livestream/feature.js` với ngôn ngữ bình dân dễ hiểu.
6. `QA Test v3`: Mở rộng `tests/livestream.cjs` lên **60 ca kiểm thử**.

---

## 3. Danh sách Tài nguyên & File đã tạo

### Ứng dụng chính (`app/`)
- `app/index.html` — Shell SPA, bộ chuyển preset `Tầm nhìn ↔ Lucian` & `Sáng ↔ Tối`, stamp `?v=0.1.0`.
- `app/css/custom-live.css` — Giao diện hợp nhất *Tầm nhìn × Lucian*, Mobile-first 390px, 203 block CSS cân bằng.
- `app/js/config.js` & `app/js/demo.js` — Cấu hình `live7_`, tắt `autoSeedDemo`.
- `app/js/live-settings.js` — Smart Defaults (phí sàn/giá vốn), nhớ Host, Export/Import JSON backup.
- `app/js/live-metrics.js` — Engine tính toán toàn bộ chỉ số Tương tác, Kinh doanh, SKU, Phễu 3 chặng, Excel/CSV parser.
- `app/js/demo-data.js` — 7 phiên livestream mẫu đầy đủ ngữ cảnh, tương tác, đơn hàng SKU và đơn hoàn.
- `app/js/ai-specs.js` — Đặc tả AI (`prompt` + `schema` + `mock` tất định) & mẫu báo cáo Zalo.
- `app/js/vendor/xlsx.mini.min.js` — Thư viện SheetJS đóng gói offline (279 KB).
- `app/features/livestream/feature.js` — Giao diện & logic màn hình chính Đề 7.
- `app/tests/livestream.cjs` — Bộ unit test độc lập chạy qua Node `vm`.
- `app/docs/spec-nhanh.md` & `app/docs/BANG-KIEM-THU.md` — Đặc tả nhanh & bảng ca kiểm thử TC01–TC18.

### File dữ liệu test ngoài thư mục gốc
- `test_livestream.csv` — File CSV 7 cột cơ bản (5 phiên mẫu).
- `test_livestream.xlsx` — File Excel 7 cột cơ bản (5 phiên mẫu).
- `mau_nhap_livestream_full.xlsx` — File Excel 2 sheet: Sheet 1 đủ 12 cột (Kinh doanh + Tương tác), Sheet 2 danh sách 5 đơn hàng mẫu theo mã SKU.

---

## 4. Kết quả Kiểm chứng Thực tế

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- |
| Cú pháp toàn bộ JS mới/sửa (7 file) | `node --check js/*.js features/livestream/feature.js` | **Đạt** (exit code 0) |
| Kiểm thử tự động nghiệp vụ & edge cases | `node tests/livestream.cjs` | **60 đạt, 0 chưa đạt** |
| Cân bằng dấu ngoặc CSS | Kiểm tra `css/custom-live.css` | **203 / 203** cân bằng |
| Đóng gói chống cache | `node tools/bump-version.cjs --stamp` | `index.html -> v=0.1.0` |
| Quét lộ secret | `node scripts/scan-secrets.mjs .` | **0 secret thật** *(1 cảnh báo giả trong file thư viện nén `xlsx.mini.min.js`)* |
| Máy chủ chạy thử local | `python -m http.server 8211` | Đang phục vụ tại `http://localhost:8211/` |

---

## 5. Kinh nghiệm Vàng rút ra cho Gemini Điều phối chính

1. **Chốt Hợp đồng Dữ liệu (Schema Contract) TRƯỚC khi thả subagent:**
   - *Sự cố đã gặp ở Đợt 1:* Agent Metrics đặt tên trường là `promoCost`, còn Agent Feature đặt là `adSpend`; Agent Test kiểm tra `res.cr` trong khi Metrics trả về `res.clickToOrderPct`.
   - *Quy tắc rút ra:* Trước khi spawn song song, điều phối viên phải định nghĩa rõ trong prompt tên trường JSON chuẩn, tên hàm và kiểu trả về để mọi agent bám đúng 1 hợp đồng duy nhất.
2. **Phân quyền sở hữu file tuyệt đối (Zero-Conflict Parallelism):**
   - Chia mỗi subagent giữ 1–2 file độc lập (`live-metrics.js`, `live-settings.js`, `ai-specs.js`, `custom-live.css`, `feature.js`, `tests/livestream.cjs`). Khi cả 6 agent chạy cùng lúc, **không xảy ra bất kỳ merge conflict nào**.
3. **Pipeline "Không chờ đợi" (Zero-Idle Pipeline):**
   - Trong lúc người dùng chờ Deep Research chạy, điều phối viên chủ động dựng trước bộ khung + logic lõi + test cơ bản. Khi có kết quả nghiên cứu thị trường, chỉ cần bồi đắp 8 micro-features lên nền tảng đã chạy sẵn.
4. **Nguyên tắc "Code tính số, AI diễn giải" & Guard mẫu số `= 0`:**
   - Tuyệt đối không giao AI tự tính tổng hay chia tỷ lệ (dễ bịa số). Toàn bộ chỉ số do JS tính trước, bọc guard mẫu số `= 0` trả về `Không đủ dữ liệu`, rồi mới truyền vào `prompt` và `mock`.
5. **Tự chủ Offline 100% cho bài toán 0đ:**
   - Không phụ thuộc API trả phí hay CDN khi demo: tải sẵn `xlsx.mini.min.js` về `js/vendor/`, dùng `localStorage` kèm nút Export/Import JSON 1 chạm để bảo vệ dữ liệu người dùng.
6. **Chạy bộ test Node `vm` sau mỗi đợt tích hợp:**
   - Viết `tests/livestream.cjs` chạy trong ~1 giây mà không cần mở trình duyệt giúp phát hiện ngay lỗi hợp đồng giữa các module ngay sau khi subagent hoàn thành.
7. **UX cho người không chuyên (SME tay ngang):**
   - Dùng ngôn ngữ đời thường (*Tỷ lệ bấm là mua*, *Quảng bá ăn % doanh số*, *Tiền TB 1 đơn*) thay cho thuật ngữ hàn lâm; mở đầu trống sạch thay vì ép dữ liệu giả vào mắt người dùng thật; giữ bảng thành thẻ card trên mobile `390px`.
