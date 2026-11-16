# Vibe Sprint Starter

Bộ khung web app thuần HTML/CSS/JS (không build, không CDN) cho cuộc thi 60 phút. Giao diện tiếng Việt, sáng/tối, mobile-first, có sẵn: tab, form kiểm tra, bảng sắp xếp, biểu đồ, AI (mô phỏng / Gemini / copy-dán), xuất CSV, sao lưu JSON, dữ liệu demo.

## 1. Bắt đầu (5 phút)

1. Chép **nội dung thư mục `starter/`** vào gốc repo mới (có `index.html` ở gốc).
2. Sửa `js/config.js`: `appName`, `brandMark`, `tagline`, `prefix` (khoá localStorage, đổi theo đề; nếu đổi thì đổi cả `'ep_theme'` trong `<head>` của `index.html` thành `<prefix>theme`), `mockNotice`.
3. Sửa `<title>` và `<meta description>` trong `index.html`. Giao diện mặc định là preset **xclipse** (Ice `#DBF2FC` / Navy `#072D59` / Coral `#FD6E88`, có hero kính gân). Đổi sang Lucian bằng `<html data-preset="lucian">` trong `index.html`; tên token giữ nguyên nên feature không phải sửa. Thương hiệu khác: sửa khối xclipse trong `css/tokens.css` (cả 3 khối: sáng, tối theo hệ thống, tối thủ công).
4. Chạy thử: `python3 -m http.server 8201` rồi mở `http://localhost:8201/`.
5. Nhân bản feature (mục 2), xoá `features/_example` và `features/_playground` (và hai dòng `<script>` của chúng) khi đã có feature thật.

Thứ tự nạp script trong `index.html`: config, version, core, ui, form, charts, export, ai, demo, mô-đun tuỳ chọn (mock, metrics, match, calc, checklist, quiz, chat, timeslot), features, **app.js cuối cùng**. Mô-đun không dùng thì xoá dòng `<script>` tương ứng.

## 2. Thêm một feature (5 phút)

```
cp -r features/_example features/don-hang      # đổi NAME 'example' -> 'orders', collection 'items' -> 'orders'
```
Thêm `<script src="features/don-hang/feature.js"></script>` trước `js/app.js`. Mỗi feature là một file IIFE gọi:

| Việc | API |
|---|---|
| Đăng ký tab + h1 + KPI tổng quan | `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })` |
| Dữ liệu CRUD lưu localStorage | `var rows = EP.collection('orders')` -> `add/update/remove/get/list/onChange` |
| Form khai báo | `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })` |
| Bảng sắp xếp | `EP.ui.table(el, { columns, rows, actions, onAction })` |
| Hộp thoại / xác nhận / toast | `EP.ui.dialog`, `EP.ui.confirm`, `EP.ui.toast` |
| Biểu đồ | `EP.charts.bar / line / donut(el, [{label, value}])` |
| AI | `EP.ai.generate({ prompt, schema, mock }, { input })` |
| Dữ liệu demo | `EP.demo.register('orders', { version: 1, rows: [...] })` |
| Xuất | `EP.export.csv(name, rows, cols)`, `EP.export.backup()`, `EP.export.print()` |

`features/_example/feature.js` có chú thích đánh số [1]..[6] cho từng bước. Router tự dựng tab, section, đúng một `<h1>` mỗi view, chuyển cảnh, và KPI ở Tổng quan (qua `summary()`).

### AI trong 3 chế độ
`EP.ai.generate(spec, { mode })` với `mode` = `mock` | `gemini` | `paste` (mặc định lấy từ chọn của người dùng ở Cài đặt).
- **mock**: chạy `spec.mock(input)` offline, tất định. Luôn hiển thị `EP.ai.MOCK_NOTICE` ("Bản demo vòng loại - Dữ liệu mô phỏng AI") bằng `EP.ai.noticeHtml(result)`; chân trang cũng hiện khi đang ở chế độ mock.
- **gemini**: key người dùng nhập ở Cài đặt (nằm trong bộ nhớ trang, chỉ lưu localStorage nếu tick "Nhớ key"), gửi qua header `x-goog-api-key`, tự đổi model khi 429/quá tải (danh sách trong `ai.js`), rút JSON, kiểm tra schema, sai thì thử lại 1 lần, vẫn lỗi thì rơi về mock kèm cảnh báo.
- **paste**: hộp thoại cho copy prompt, dán câu trả lời của Claude/ChatGPT/Gemini, kiểm tra như trên.
Schema: `string{min,max,enum}`, `number{min,max,integer}`, `boolean`, `array{of,min,max}`, `object{props}`; trường nào cũng bắt buộc trừ `optional:true`. Kết quả được cắt/ép kiểu tự động.

### Mô-đun tiện ích (đều nhỏ, có chú thích đầu file, demo ở tab "Mô-đun")
`mock.js` (hash/rng/sentiment/classify tất định), `metrics.js` (chia an toàn, CTR/CPC/CPA/ROAS, VND, xu hướng), `match.js` (bỏ dấu tiếng Việt, FAQ matcher, tìm kiếm), `calc.js` (form -> kết quả trực tiếp), `checklist.js` (chấm điểm có trọng số /100), `quiz.js` (đồng hồ, điểm theo tốc độ, Top 10 đồng hạng), `chat.js` (bong bóng chat + quick reply + FAQ bot), `timeslot.js` (khung giờ, trùng lịch, đếm ngược).

## 3. Quy ước
- Chữ hiện cho người dùng: **tiếng Việt có dấu**; tên biến, hàm, file, comment code: tiếng Anh hoặc tiếng Việt ngắn gọn, nhưng API công khai dùng tiếng Anh.
- Mọi kết quả mô phỏng AI phải kèm `MOCK_NOTICE` (cấu hình ở `js/config.js`).
- Dữ liệu người dùng/AI nhúng vào HTML phải qua `EP.esc()`.
- Màu, cỡ, khoảng cách chỉ dùng biến trong `tokens.css`; CSS mới đặt trong `@layer components`.
- Mobile 390px không được cuộn ngang; nút/ô nhập >= 40px; mỗi view đúng một `<h1>`.
- Không để key API trong code hoặc repo.

## 4. Kiểm thử
```
python3 -m http.server 8201 &        # tại thư mục gốc app
node tests/smoke.cjs http://localhost:8201/ [--shots thu-muc-anh]
```
Cần Playwright (`npm i -D playwright` hoặc cài global). Test kiểm: không lỗi console, mọi tab (1 h1), không tràn ngang 390px sáng/tối, đổi giao diện, CRUD + kiểm tra form của feature mẫu, AI mock + MOCK_NOTICE, CSV có BOM, sao lưu/khôi phục, Gemini giả (retry, đổi model, rơi về mock), logic các mô-đun. Khi thêm feature, thêm 5-10 dòng kiểm thử vào `tests/smoke.cjs`.

## 5. Phiên bản và deploy GitHub Pages
1. `node tools/bump-version.cjs` (tăng patch; hoặc `minor`, `major`, `1.2.3`, `--stamp`): cập nhật `js/version.js` và gắn `?v=` vào mọi js/css trong `index.html` để không dính cache cũ.
2. Commit và push lên nhánh `main`.
3. GitHub: Settings -> Pages -> Source: *Deploy from a branch* -> `main` / `(root)`. Đợi ~1 phút, mở `https://<user>.github.io/<repo>/`.
4. Đường dẫn trong app là tương đối nên chạy được ở thư mục con `/<repo>/`. Routing dùng `#/tab` nên không cần cấu hình 404.
5. Trước khi nộp: chạy smoke test, mở bản deploy trên điện thoại, kiểm tra `?demo=1` nạp lại dữ liệu mẫu.

## 6. Cấu trúc
```
index.html            vỏ app: skip link, tab, nút giao diện, chân trang, toast
css/tokens.css        biến thiết kế sáng/tối + khai báo @layer
css/app.css           toàn bộ thành phần
js/                   config, version, core, ui, form, charts, export, ai, demo, app + mô-đun
features/_example     feature mẫu đầy đủ (CRUD + form + AI + biểu đồ)
features/_playground  demo calc/checklist/quiz/chat
tests/smoke.cjs       Playwright smoke test
tools/bump-version.cjs
```
