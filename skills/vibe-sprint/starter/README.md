# Vibe Sprint Starter

Bộ khung web app thuần HTML/CSS/JS (không build, không CDN) cho cuộc thi 60 phút. Giao diện tiếng Việt, sáng/tối, mobile-first, có sẵn: tab, form kiểm tra, bảng sắp xếp, biểu đồ, AI (mô phỏng / Gemini / copy-dán), xuất CSV, sao lưu JSON, dữ liệu demo.

## 1. Bắt đầu (5 phút)

1. Chép **nội dung thư mục `starter/`** vào gốc repo mới (có `index.html` ở gốc).
2. Sửa `js/config.js`: `appName`, `brandMark`, `tagline`, `heroLead` + `heroEm` (tiêu đề hero ở Tổng quan, vd `'Mỗi đơn hàng,'` + `'lãi hay lỗ?'`; chữ nhấn gradient là `heroEm`), `prefix` (tiền tố khoá localStorage; khoá giao diện là `<prefix>theme`, nên **đổi `prefix` thì sửa luôn `'ep_theme'` trong đoạn script ở `<head>` của `index.html` thành `'<prefix>theme'`**, nếu không giao diện đã chọn bị nháy sáng/tối khi tải lại), `mockNotice`. **`mockNotice` phải chép NGUYÊN VĂN từ đề/BTC của kỳ thi bạn đang thi.** Giá trị có sẵn `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của vòng loại; chung kết có thể khác, đừng giả định. `tests/smoke.cjs` đọc `EP.config.mockNotice` và `EP.config.prefix` nên không cần sửa test khi đổi hai giá trị này.
3. Sửa `<title>` và `<meta description>` trong `index.html`. Giao diện mặc định là preset **xclipse** (Ice `#DBF2FC` / Navy `#072D59` / Coral `#FD6E88`, có hero kính gân). Đổi sang Lucian bằng `<html data-preset="lucian">` trong `index.html`; tên token giữ nguyên nên feature không phải sửa. Thương hiệu khác: sửa khối xclipse trong `css/tokens.css` (cả 3 khối: sáng, tối theo hệ thống, tối thủ công).
4. Chạy thử: `python3 -m http.server 8211` rồi mở `http://localhost:8211/` (bảng cổng của skill: 8211 điều phối, 8212-8230 các agent, **không dùng 8000**).
5. Nhân bản feature (mục 2). Khi đã có feature thật, xoá `features/_example` và `features/_playground` **cùng với hai dòng `<script src="features/_example/feature.js">` và `<script src="features/_playground/feature.js">` trong `index.html`** (xoá thư mục mà quên dòng script thì trình duyệt báo 404 và smoke test đỏ). Smoke test tự bỏ qua các khối của hai feature này khi tab của chúng không còn.

Thứ tự nạp script trong `index.html`: config, version, **icons**, core, ui, form, charts, export, ai, demo, mô-đun tuỳ chọn (mock, metrics, match, calc, scenario, import, checklist, quiz, chat, timeslot), **lucian, mobile**, features, **app.js cuối cùng**. Mô-đun không dùng thì xoá dòng `<script>` tương ứng.

## 2. Thêm một feature (5 phút)

```
cp -r features/_example features/don-hang      # đổi NAME 'example' -> 'orders', collection 'items' -> 'orders'
```
Thêm `<script src="features/don-hang/feature.js"></script>` trước `js/app.js` (và sau `js/domain.js` nếu có, xem dưới). Mỗi feature là một file IIFE gọi:

| Việc | API |
|---|---|
| Đăng ký tab + h1 + KPI tổng quan | `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })` |
| Dữ liệu CRUD lưu localStorage | `var rows = EP.collection('orders')` -> `add/update/remove/get/list/onChange` |
| Form khai báo | `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })`; đọc giá trị không cần bind: `EP.form.values(formEl, SCHEMA)` (số -> Number, rỗng -> null, checkbox -> boolean) |
| Bảng sắp xếp | `EP.ui.table(el, { columns, rows, actions, onAction })` |
| Hộp thoại / xác nhận / toast | `EP.ui.dialog`, `EP.ui.confirm`, `EP.ui.toast` |
| Biểu đồ | `EP.charts.bar / line / donut(el, [{label, value}])`; bar/line hỗ trợ giá trị âm (đường 0 làm gốc, cột âm đi xuống, vạch chia đẹp) |
| AI | `EP.ai.generate({ prompt, schema, mock }, { input })` |
| Dữ liệu demo | `EP.demo.register('orders', { version: 1, rows: [...] })` |
| Xuất | `EP.export.csv(name, rows, cols)`, `EP.export.backup()`, `EP.export.print()` |

Icon có sẵn: xem `EP.ui.icons` (có `file`, `print`, `chart`, `calc`, `chat`...); tên không có sẽ rơi về `info` và in `console.warn` liệt kê tên hợp lệ.

`features/_example/feature.js` có chú thích đánh số [1]..[6] cho từng bước. Router tự dựng tab, section, đúng một `<h1>` mỗi view, chuyển cảnh, và KPI ở Tổng quan (qua `summary()`).

### Logic nghiệp vụ dùng chung giữa các feature (`js/domain.js`)
Khi hai feature trở lên cùng tính một công thức (lãi/lỗ, điểm, giá tối thiểu...), **đừng chép công thức vào từng feature**: viết một lần trong `js/domain.js` rồi để mọi feature và test gọi chung.
```js
/* js/domain.js: hàm thuần, không đụng DOM, không đọc localStorage */
(function (root) {
  'use strict';
  var EP = root.EP;
  EP.domain = {
    /** Lãi một đơn = giá bán - giá vốn - phí sàn - ship - quảng cáo. Luôn trả số hữu hạn (chia an toàn). */
    profitPerOrder: function (p) { return p.price - p.cost - p.price * p.feePct / 100 - p.shipping - p.ads; }
  };
})(window);
```
Nạp **sau `js/config.js`/`core.js`/`metrics.js` và TRƯỚC mọi `features/*`** trong `index.html`: `<script src="js/domain.js"></script>`. Feature dùng `EP.domain.profitPerOrder(...)`; `tests/smoke.cjs` thêm vài dòng `EP.domain.*` trong khối `page.evaluate` (ca thường, ca biên 0 và âm) để công thức sai bị bắt ngay. Dữ liệu demo cũng nên chọn để có cả ca lãi lẫn ca lỗ.

### AI trong 3 chế độ
`EP.ai.generate(spec, { mode })` với `mode` = `mock` | `gemini` | `paste` (mặc định lấy từ chọn của người dùng ở Cài đặt).
- **mock**: chạy `spec.mock(input)` offline, tất định. Luôn hiển thị `EP.ai.MOCK_NOTICE` (= `mockNotice` trong `config.js`, mặc định "Dữ liệu mô phỏng AI · Dữ liệu mẫu"; nếu đề hoặc BTC đưa câu nhãn thì chép nguyên văn) bằng `EP.ai.noticeHtml(result)`; chân trang cũng hiện khi đang ở chế độ mock.
- **gemini**: key người dùng nhập ở Cài đặt (nằm trong bộ nhớ trang, chỉ lưu localStorage nếu tick "Nhớ key"), gửi qua header `x-goog-api-key`, tự đổi model khi 429/quá tải (danh sách trong `ai.js`), rút JSON, kiểm tra schema, sai thì thử lại 1 lần, vẫn lỗi thì rơi về mock kèm cảnh báo.
  - Tuỳ chọn: đặt `ai.proxyUrl` trong `js/config.js` (URL Cloudflare Worker, xem `../proxy/README.md`) thì chế độ gemini gọi qua máy chủ trung gian, không cần nhập key.
  - **`proxyUrl` đã điền sẵn Worker của đội** (`https://vibe-gemini-proxy.xclipse.workers.dev`). `ALLOWED_ORIGINS` trên Worker phải chứa origin Pages của chung kết: `https://xclipsex.github.io` dùng được cho mọi repo dưới tài khoản đó; tài khoản khác phải được thêm vào Worker.
  - Model mặc định là `gemini-4-hydrogen` (~10 giây). Nếu chậm khi demo, vào Cài đặt đổi sang `gemini-3.6-flash` (~1 giây).
- **paste**: hộp thoại cho copy prompt, dán câu trả lời của Claude/ChatGPT/Gemini, kiểm tra như trên.
Schema: `string{min,max,enum}`, `number{min,max,integer}`, `boolean`, `array{of,min,max}`, `object{props}`; trường nào cũng bắt buộc trừ `optional:true`. Kết quả được cắt/ép kiểu tự động.

### Mô-đun tiện ích (đều nhỏ, có chú thích đầu file, demo ở tab "Mô-đun")
`mock.js` (hash/rng/sentiment/classify tất định), `metrics.js` (chia an toàn, CTR/CPC/CPA/ROAS, VND, xu hướng), `match.js` (bỏ dấu tiếng Việt, FAQ matcher, tìm kiếm), `calc.js` (form -> kết quả trực tiếp), `checklist.js` (chấm điểm có trọng số /100), `quiz.js` (đồng hồ, điểm theo tốc độ, Top 10 đồng hạng), `chat.js` (bong bóng chat + quick reply + FAQ bot), `timeslot.js` (khung giờ, trùng lịch, đếm ngược).

### Kinh doanh: `EP.scenario` và `EP.importer` (bảng Kinh tế, đọc kỹ `../references/11-mo-hinh-kinh-doanh.md`)
- `js/scenario.js` (`EP.scenario.mount(el, { assumptions, compute, outputs, explain })`): bảng giả định sửa được (ô tiền vi-VN, thanh trượt, lý do, nhãn Giả định / Dữ liệu mẫu / Mô phỏng), 3 kịch bản Xấu/Cơ sở/Tốt tự sinh từ `better` (hoặc tự khai báo), hòa vốn (chặn chia 0: "Không đủ dữ liệu"), hoàn vốn, độ nhạy tornado ±10%/±20% (`EP.charts.tornado`), panel "Cách tính" kèm số thật, xuất CSV (BOM) và sao chép cho slide, lưu bằng `EP.store`. Hàm thuần `EP.scenario.breakEven/evaluate/sensitivity/spread` dùng được không cần giao diện.
- `js/import.js` (`EP.importer.mount(el, { collection, tag, fields })`): nhập .xlsx/.xls/.csv offline (SheetJS 0.18.5 Apache-2.0 trong `js/vendor/`, nạp lười): chọn sheet, xem trước 20 dòng, ghép cột tự đoán theo tên Việt/Anh không dấu, kiểm tra (số `1.234.567,5`, ngày `dd/mm/yyyy`, dòng trống), nạp vào collection kèm nhãn "Dữ liệu mẫu từ BTC". File thử đa-sheet: `tests/fixtures/mau-btc.xlsx|csv` (sinh lại bằng `node tests/fixtures/make-fixtures.cjs`).
- Ví dụ chạy được: tab Mô-đun > **Kinh doanh** (`#/playground/biz`) và **Nhập file** (`#/playground/import`). Đây là mô-đun chung, không gắn đề nào: logic của đề viết trong giờ thi.

## 2b. Lớp Lucian (vi tương tác cho mọi thành phần)

`css/lucian.css` + `js/lucian.js` là MỘT lớp cắm thêm (nạp sau `app.css`/`ui.js`, trước features) chuyển thể từ thư viện Lucian Lab UI (MIT, (c) 2026 Seokwoooo; giấy phép ở `../vendor/lucian/LICENSE`). Viết HTML/API như cũ là nhận được nâng cấp; không phải gọi gì. Token `--ux-*` của Lucian được ánh xạ sang token của app (`--surface`, `--text`, `--accent`...) nên tự đổi sáng/tối. Xem trực tiếp: tab **Mô-đun > Thư viện UI** (mở thẳng bằng `#/playground/ui`). Đưa phần tử Lucian khác vào: `references/10-lucian-ui.md`.

| Thành phần | Tự động có | Dùng thêm bằng API |
|---|---|---|
| Nút | ấn lò xo, nổi nhẹ khi rê, vệt sáng khi `aria-busy` | `.btn-cta` / `data-roll`: nhãn cuộn khi rê; `data-copy="chuỗi|#selector"`: sao chép rồi thành dấu tích; `EP.ui.confirm({ ..., danger: true, hold: true })` (hoặc `hold: 1200` ms): phải **giữ** nút để xác nhận |
| Công tắc / ô tích / chip | ô tích vẽ dấu, chip bật ra | `{ type:'checkbox', switch:true }` trong `EP.form` hoặc `<input type="checkbox" role="switch">`: công tắc bóp |
| Tab, segmented | viên trượt lò xo (topbar và `.seg`) | không cần |
| Ô nhập | nhãn nổi lò xo, **rung khi báo lỗi**, dấu hợp lệ, đếm ký tự `12/30` (từ `rules.maxLength`), textarea tự giãn | `{ type:'money' }`: gõ ra `1.250.000`, `EP.form.values` trả Number |
| Select | hộp chọn tuỳ biến trên máy có chuột (cảm ứng dùng bộ chọn gốc); bàn phím đủ | `data-native` trên select để tắt |
| Thẻ | `a.card` nổi lên khi rê | `data-lift` nổi lên; `data-tilt` nghiêng 3D (chỉ chuột, tắt trên cảm ứng) |
| KPI | **đếm lên** khi view hiện (chữ thật giữ nguyên cho đọc màn hình/test), `tabular-nums` | `data-countup` ở bất kỳ phần tử nào; `EP.lucian.countUp(el)` |
| Bảng | hàng hiện dần, vạch nhấn khi rê, **thẻ xếp dọc ở <= 720px** (nút sắp xếp thành chip) | `EP.ui.table(el, { sticky: true })` tiêu đề dính; `{ cards: false }` tắt thẻ |
| Trống / lỗi / chờ | biểu tượng trôi nhẹ; thanh tiến trình mép trên tự chạy khi `EP.ai.generate` đang gọi | `var w = EP.lucian.aiLoading(box, { title, steps }); ... w.stop(htmlKetQua)` |
| Toast | xếp chồng (cũ lùi sau), **vuốt ngang để gạt**, thanh thời gian | như `EP.ui.toast` |
| Hộp thoại | lò xo vào, mờ ra; bottom sheet trên di động | như `EP.ui.dialog` |
| Stepper | thanh đầy dần, dấu tích bật, vòng thở ở bước hiện tại | như `EP.ui.stepper` |
| Biểu đồ | cột mọc, đường tự vẽ, điểm bật, vòng tròn quét | như `EP.charts.*` |
| Giao diện sáng/tối | biểu tượng xoay vào; **hiệu ứng loang 650ms ở `core.js` giữ nguyên** | `EP.theme.cycle(btn)` |
| Định dạng vi-VN | | `EP.lucian.fmt.money(1250000)` = `1.250.000 ₫`, `.compact(2.5e9)` = `2,5 tỷ`, `.percent`, `.signed(-3.5,1,'%')`, `.number`, `.parse('1.234,5')` |

Quy tắc đã tuân thủ: sáng/tối, `prefers-reduced-motion` (hoạt ảnh về ~0, không có phần tử bị ẩn chờ), `:focus-visible`, vùng chạm >= 44px khi màn <= 720px hoặc cảm ứng, không tràn ngang ở 390px, không CDN. Gỡ lớp này: xoá `css/lucian.css` + `js/lucian.js` và hai dòng trong `index.html` (form.js vẫn chạy, chỉ mất hiệu ứng). Kiểm thử: khối "Lớp Lucian" trong `tests/smoke.cjs` chạy khi còn tab `playground`.

## 2c. Chuẩn điện thoại (360-390px dọc; đọc `../references/13-chuan-mobile.md`)

Chung kết chấm trên điện thoại, nên starter **viết cho điện thoại trước** (`css/mobile.css` nạp cuối; từ 768px mới mở rộng cho máy tính):

| Việc | Có sẵn |
|---|---|
| Điều hướng | **Thanh tab dưới** (`#bnav`) tự dựng từ `EP.register` (icon Xclipse + nhãn, `aria-current`, viên nền trượt, spring khi nhấn); > 5 tab thì ô "Thêm" mở sheet. Thanh trên mỏng (logo + nút giao diện). Chuyển tab trượt/mờ ≤ 220ms, nhớ vị trí cuộn từng tab, chạm lại tab = lên đầu |
| Nút chính | `EP.ui.actionBar(el, [{ label, icon, variant:'primary', act, onClick }, { label, icon, iconOnly:true, ... }])`: thanh dính trên thanh tab, tối đa 3 nút, nội dung cuối trang tự chừa chỗ |
| Hộp thoại | `EP.ui.dialog` / `EP.ui.confirm` = **bottom sheet** có tay nắm, **kéo xuống để đóng**; từ 768px là hộp giữa màn hình |
| Form | một cột; `EP.form` tự thêm `inputmode`/`enterkeyhint`/`autocomplete` theo `type` (`tel`, `email`, `number`, `money` → bàn phím số) |
| Bảng, biểu đồ | bảng tự thành thẻ (ô đầu là tiêu đề thẻ; nhớ truyền `label` cho cột); biểu đồ vẽ theo bề rộng, chữ trục ≥ 12px |
| Vùng chạm, chữ | mọi nút/ô nhập ≥ 48px, cách nhau ≥ 8px, thân 16px, ô nhập ≥ 16px (iOS không phóng to) |
| Hiệu năng | không `backdrop-filter`/`background-attachment: fixed` trên điện thoại, tôn trọng `prefers-reduced-motion` |
| Icon | `js/icons.js` (bộ Xclipse 54 icon); tên cũ của `EP.ui.icon` được ánh xạ, tên Xclipse dùng trực tiếp (`XcIcons.names`) |

Bộ kiểm thử điện thoại `tests/mobile-suite.cjs` chạy trong `tests/smoke.cjs` (hoặc riêng: `node tests/mobile-suite.cjs http://localhost:8211/`) ở 360×780 và 390×844 (dọc, 3x, chạm): không tràn ngang ở mọi view và mô-đun, nút/ô nhập ≥ 48px và không chồng nhau, chữ ≥ 14px (chú thích ≥ 12px), ô nhập ≥ 16px, thanh tab dưới có `aria-current`, luồng chính (thêm bằng sheet, AI mô phỏng, lưu, kịch bản, nhập file) chỉ bằng chạm.

### Ảnh điện thoại dọc cho slide

```
node tools/shots-mobile.cjs http://localhost:8211/ shots-mobile
```
Ra `shots-mobile/NN-<tab>-light.png` và `NN-<tab>-dark.png` (390×844 @3x = 1170×2532, đúng khung điện thoại dọc, có thanh tab dưới), dữ liệu demo tự nạp. Tuỳ chọn: `--width 360 --height 780` (cỡ khác), `--full` (cả trang dài), `--all` (thêm từng mục con của tab Mô-đun), `--sheet` (thêm ảnh bottom sheet của nút `[data-act="add"]`). Dán ảnh vào slide theo khung dọc, đừng kéo giãn; ảnh có số liệu mô phỏng thì giữ nguyên nhãn mô phỏng trong khung.

## 3. Quy ước
- Chữ hiện cho người dùng: **tiếng Việt có dấu**; tên biến, hàm, file, comment code: tiếng Anh hoặc tiếng Việt ngắn gọn, nhưng API công khai dùng tiếng Anh.
- Mọi kết quả mô phỏng AI phải kèm `MOCK_NOTICE` (cấu hình ở `js/config.js`).
- Dữ liệu người dùng/AI nhúng vào HTML phải qua `EP.esc()`.
- Màu, cỡ, khoảng cách chỉ dùng biến trong `tokens.css`; CSS mới đặt trong `@layer components`.
- Mobile 390px không được cuộn ngang; nút/ô nhập >= 40px; mỗi view đúng một `<h1>`.
- Không để key API trong code hoặc repo.

## 4. Kiểm thử
```
python3 -m http.server 8211 &        # tại thư mục gốc app
node tests/smoke.cjs http://localhost:8211/ [--shots thu-muc-anh]
```
Cần Playwright (`npm i -D playwright` hoặc cài global). Test kiểm: không lỗi console, mọi tab (1 h1), không tràn ngang 390px sáng/tối, đổi giao diện, CRUD + kiểm tra form của feature mẫu, AI mock + MOCK_NOTICE, CSV có BOM, sao lưu/khôi phục, kịch bản + hòa vốn + độ nhạy + nhập xlsx/csv (360/390px), Gemini giả (retry, đổi model, rơi về mock), logic các mô-đun. Test logic nhanh không cần trình duyệt: chép `tests/unit-template.cjs` thành `tests/<feature>.cjs` (node `vm`, ~1 giây, `node tests/<feature>.cjs`). Khi thêm feature, chép `tests/feature-template.snippet` (CRUD + form + biên + khoá theo `prefix` + mock notice) vào chỗ `FEATURE TESTS` của `tests/smoke.cjs` rồi đổi tên tab/collection/selector. Smoke test chạy đúng cả khi đã xoá `_example`/`_playground` và các mô-đun tuỳ chọn.

## 5. Phiên bản và deploy GitHub Pages
1. `node tools/bump-version.cjs` (tăng patch; hoặc `minor`, `major`, `1.2.3`, `--stamp`): cập nhật `js/version.js` và gắn `?v=` vào mọi js/css trong `index.html` để không dính cache cũ.
2. Commit và push lên nhánh `main`.
3. GitHub: Settings -> Pages -> Source: *Deploy from a branch* -> `main` / `(root)`. Đợi ~1 phút, mở `https://<user>.github.io/<repo>/`.
4. Đường dẫn trong app là tương đối nên chạy được ở thư mục con `/<repo>/`. Routing dùng `#/tab` nên không cần cấu hình 404.
5. Trước khi nộp: đặt `showPlayground: false` trong `js/config.js` (ẩn tab Mô-đun/Thư viện UI và route `#/playground`; view đăng ký bằng `EP.register({ devOnly: true, ... })` cũng bị ẩn theo), rồi chạy smoke test, mở bản deploy trên điện thoại, kiểm tra `?demo=1` nạp lại dữ liệu mẫu.

## 5b. Bật Firebase trong 5 phút (tuỳ chọn, TẮT mặc định)
Mặc định app chỉ dùng localStorage và **không gọi mạng**. Chỉ bật khi đề cần dữ liệu theo tài khoản/nhiều máy.
1. console.firebase.google.com -> Add project (gói Spark, không bật billing) -> Build -> **Firestore Database** (Production mode) và **Authentication -> Sign-in method -> Google -> Enable**.
2. Authentication -> Settings -> **Authorized domains** -> Add `<tài-khoản>.github.io` (chỉ tên miền, không kèm `/tên-repo`). Thiếu bước này sẽ báo "Tên miền chưa được phép".
3. Project settings -> Your apps -> Web (`</>`) -> chép `apiKey, authDomain, projectId, appId` vào `js/config.js`: `firebase: { enabled: true, config: {...}, emulator: false }`. Các giá trị này công khai theo thiết kế; dữ liệu được bảo vệ bởi rules.
4. Firestore -> Rules -> dán `firestore.rules` -> Publish (hoặc `npx firebase-tools deploy --only firestore:rules --project <id>`).
5. Mở app qua https/localhost (không mở file://): có nút **Đăng nhập** trên thanh trên. Đăng nhập xong, mọi `EP.collection` tự đồng bộ vào `users/{uid}/{collection}/{id}`.

Cách hoạt động: localStorage vẫn là bản chính (offline dùng bình thường); ghi xuôi lên Firestore có thử lại khi mất mạng; khi đăng nhập thì kéo về và gộp theo `updatedAt` (bản mới hơn thắng). Xoá lúc đang đăng xuất không lan lên máy chủ. Bản ghi > 900 KB (thường do ảnh) chỉ ở máy. API: `EP.auth.user() / signIn() / signOut() / onChange(cb)`; SDK compat 10.14.1 nạp từ gstatic chỉ khi bật. Lỗi được dịch ra tiếng Việt (unauthorized-domain, popup-closed, mạng...). Trên điện thoại tự dùng đăng nhập chuyển trang (redirect).

Thử trên máy bằng emulator: copy `.firebaserc.example` -> `.firebaserc`, `npx firebase-tools emulators:start --only auth,firestore`, đặt `emulator: true`.

Kiểm thử:
```
node tests/smoke.cjs http://localhost:8215/         # Firebase tắt: khẳng định 0 request tới googleapis/gstatic/firebase
node tests/firebase-ui.cjs http://localhost:8215/   # Firebase bật + SDK giả (chặn CDN): nút, dịch lỗi, đồng bộ, retry, mobile 390px
npm i -D @firebase/rules-unit-testing firebase
npx firebase-tools emulators:exec --only firestore --project demo-ep "node tests/firebase-rules.test.mjs"   # cần Java; không có emulator thì tự bỏ qua
```
Không kiểm thử được tự động: đăng nhập Google thật (cần tài khoản + project thật) và SDK thật từ CDN; test giao diện dùng SDK giả. Máy không có emulator/Java thì `firebase-rules.test.mjs` tự bỏ qua và ghi "chưa chạy được trong sandbox" (đã chạy xanh 12/12 khi có emulator).

## 6. Cấu trúc
```
index.html            vỏ app: skip link, tab, nút giao diện, chân trang, toast
css/tokens.css        biến thiết kế sáng/tối + khai báo @layer
css/app.css           toàn bộ thành phần
css/lucian.css        lớp Lucian: vi tương tác (mục 2b)
css/mobile.css        chuẩn điện thoại: tab dưới, sheet, thanh hành động, cỡ chạm (mục 2c); nạp cuối
js/mobile.js          mờ mép thanh cuộn ngang (.seg), cuộn mục chọn vào giữa
js/icons.js           bộ icon Xclipse (XcIcons)
tools/shots-mobile.cjs  chụp ảnh điện thoại dọc cho slide
tests/mobile-suite.cjs  kiểm thử điện thoại 360/390 (chạy trong smoke.cjs)
js/                   config, version, core, ui, form, charts, export, ai, demo, app + mô-đun
features/_example     feature mẫu đầy đủ (CRUD + form + AI + biểu đồ)
js/lucian.js          lớp Lucian (bọc EP.ui/EP.ai, quét DOM)
js/scenario.js        EP.scenario: giả định, 3 kịch bản, hòa vốn, tornado, Cách tính (+ css/biz.css)
js/import.js          EP.importer: nhập xlsx/xls/csv (+ js/vendor/xlsx.full.min.js, tests/fixtures/)
features/_playground  demo calc/kinh doanh/nhập file/checklist/quiz/chat + Thư viện UI
tests/smoke.cjs       Playwright smoke test (+ tests/feature-template.snippet: khối mẫu cho feature thật)
js/firebase.js        Firebase tuỳ chọn (tắt mặc định): đăng nhập Google + đồng bộ Firestore
firestore.rules, firebase.json, .firebaserc.example   rules + cấu hình emulator
tests/firebase-ui.cjs, tests/firebase-rules.test.mjs
tools/bump-version.cjs
```
