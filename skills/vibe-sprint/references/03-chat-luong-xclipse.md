# 03 — Chuẩn chất lượng Xclipse (checklist rút gọn)

Dán mục liên quan vào prompt mọi agent. Tick trước khi merge.

## Kiến trúc
- [ ] Vanilla HTML/CSS/JS, **không build, không CDN**, global namespace `window.EP` (đã có sẵn trong `starter/`), script nạp theo thứ tự trong `index.html` (config, version, core, ui, form, charts, export, ai, demo, mô-đun, `js/ai-specs.js`, features, `js/demo-data.js`, **app.js cuối**).
- [ ] Mỗi tính năng 1 thư mục `features/<tên>/feature.js` (IIFE, `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })`); logic thuần (validator, tính toán) tách khỏi DOM để test (mẫu: `features/_example`, mô-đun `js/calc.js`, `quiz.js`...).
- [ ] CSS: `css/tokens.css` (biến + khai báo thứ tự `@layer reset, tokens, base, components, utilities`) + `css/app.css`. **CSS mới đặt trong `@layer components {}`**, chỉ dùng biến trong tokens; kiểm tra mỗi khối đóng đủ `}`.
- [ ] Lưu trữ qua `EP.store` / `EP.collection(name)` (try/catch sẵn, rơi về bộ nhớ khi localStorage bị chặn; khoá = `prefix` trong `js/config.js`); dữ liệu demo qua `EP.demo.register(name, { version, rows | seed })`; ghi rõ localStorage chỉ trên 1 máy.
- [ ] 1 cửa gọi AI: `EP.ai.generate({ prompt, schema, mock }, { input })` (`js/ai.js`): mock mặc định, Gemini khi người dùng nhập key, hoặc copy-dán; kết quả luôn kèm `EP.ai.noticeHtml(result)`.

## Design tokens (`css/tokens.css`, preset `xclipse` mặc định hoặc `lucian`)
- [ ] Chọn bộ giao diện bằng `<html data-preset="xclipse">` (Ice #DBF2FC / Navy #072D59 / Coral #FD6E88) hoặc `"lucian"`; tên token giữ nguyên giữa các bộ. Đổi thương hiệu khác: sửa khối xclipse ở đủ 3 chỗ (sáng, tối theo hệ thống, tối thủ công). Bộ nhận diện: `skills/vibe-sprint/brand/`.
- [ ] Chỉ dùng biến có trong `css/tokens.css` (màu, `--font`, `--radius*`, `--gap`, `--pad`, `--control-h`, `--ease-out`, `--chart-1..6`...); không hard-code màu/cỡ trong feature.
- [ ] Nút chính màu gần đen / hoặc accent, một màu nhấn duy nhất; không bóng nặng; viền 1px mờ.
- [ ] Chữ ≥ 14px, ô nhập ≥ 16px (tránh iOS zoom). Font: Be Vietnam Pro / IBM Plex Sans + fallback hệ thống (hỗ trợ tiếng Việt).
- [ ] Tương phản AA: chữ thường ≥ 4.5:1, viền ô nhập ≥ 3:1. Đo, không đoán.

## Sáng / tối
- [ ] `prefers-color-scheme` làm mặc định, nút `#btn-theme` chuyển Theo hệ thống/Sáng/Tối (`EP.theme`), nhớ lựa chọn (try/catch, khoá `ep_theme`).
- [ ] Mỗi màu dùng biến; kiểm tra tối cho: nút, viền, badge, input, dialog, chart. Vùng "luôn sáng" (xem trước giấy) ép `color-scheme: light`.
- [ ] Không có chớp trắng khi chuyển tab/theme.

## Chuyển động
- [ ] Mọi tương tác chính có phản hồi: hover, press, focus, chuyển tab, mở dialog, toast.
- [ ] Chỉ animate `transform`/`opacity`; thời lượng 150–300 ms; không giật.
- [ ] `prefers-reduced-motion` tắt/giảm hết.
- [ ] **Một hiệu ứng cho mỗi pseudo-element/transition** (xem lỗi view-transition trong `04`). Không animate layout liên tục khi cuộn; không chặn vuốt nhanh trên mobile.

## Trạng thái
- [ ] **Rỗng:** câu giải thích + nút hành động chính + (tuỳ) "Điền dữ liệu mẫu".
- [ ] **Loading:** skeleton hoặc nút `đang xử lý…` khoá bấm; không để 2 lần gửi.
- [ ] **Lỗi:** thông báo tiếng Việt nói rõ cách sửa, ngay dưới ô; lỗi hệ thống dùng toast, không `alert()`.
- [ ] **Thành công:** toast/popup ngắn; số liệu cập nhật tức thì.
- [ ] Hành động xoá: xác nhận bằng `EP.ui.confirm({ title, message, confirmLabel, danger })`, không `confirm()` gốc; lỗi hệ thống dùng `EP.ui.toast(msg, { type })`, trạng thái rỗng/lỗi dùng `EP.ui.empty` / `EP.ui.error`.

## Validation và nghiệp vụ
- [ ] Tên trống, email sai, SĐT sai (chấp nhận +84/0, chuẩn hoá), số âm, ngày quá khứ, quá dài: đều có thông báo.
- [ ] Trùng → ghi 1 lần; bấm đúp → 1 lần; hết hạn/đủ chỗ → trạng thái đúng, ẩn nút.
- [ ] Không bao giờ hiện `undefined`, `NaN`, `Invalid Date`, số âm.
- [ ] Chuỗi người dùng nhập và nội dung AI luôn `textContent` hoặc `EP.esc()` trước khi vào `innerHTML`, chặn HTML/JS chèn vào.

## Dữ liệu demo
- [ ] Mở lần đầu thấy ngay nội dung đầy đủ, sạch, thật: 3–6 bản ghi tiếng Việt thực tế (tên, số liệu, ngày cố định tương lai gần).
- [ ] Nút "Nạp lại dữ liệu demo" (Cài đặt, `EP.demo.reset()`). Demo **không được ghi đè dữ liệu người dùng đang làm**: `js/demo.js` chỉ nạp khi collection rỗng, hoặc khi tăng `version` mà người dùng chưa sửa dòng nào; chỉ `?demo=1` / nút nạp lại mới xoá rồi nạp lại.
- [ ] Test tự động seed demo qua `?demo=1`, không dựa vào lần mở đầu.

## Mobile
- [ ] 390px và 360px: không tràn ngang (`scrollWidth <= innerWidth`), vùng chạm ≥ 44px, tab cuộn ngang, dialog dạng bottom sheet.
- [ ] Lưới 3 mục: 1 cột hoặc 3 cột đều, không để lẻ 2+1. Không khoảng trắng lạ cuối trang.
- [ ] Sticky bar không che nội dung; chữ nút không xuống dòng xấu (`white-space: nowrap` cho thương hiệu).
- [ ] Điều khiển chỉ hiện khi rê chuột phải mở sẵn trên cảm ứng (`@media (hover: none)`); toast ở mép trên; `[hidden]` luôn ẩn thật; tiêu đề lớn `line-height` ≥ 1.25 (dấu tiếng Việt); thanh dính ẩn không kéo dài trang (đoạn mã: `07` C).

## Truy cập (a11y)
- [ ] Một `h1` mỗi màn; thứ tự heading đúng; link "bỏ qua tới nội dung".
- [ ] Mọi `input` có `label`; `aria-live` cho toast/lỗi; focus nhìn thấy; dialog giữ focus + Esc đóng + trả focus.
- [ ] Ảnh có `alt` mô tả tiếng Việt, có `width/height`.

## SEO / chia sẻ (nếu có link công khai)
- [ ] `title` ≤ 60, `description` 140–160, canonical, OG/Twitter (ảnh 1200x630 JPEG), `lang="vi"`, favicon, `robots.txt`, `sitemap.xml`, `404.html`.
- [ ] Facebook/Zalo **không chạy JS** → meta phải nằm sẵn trong HTML tĩnh (trang chia sẻ riêng), không gắn bằng JS.

## Phát hành
- [ ] `js/version.js` (`EP.version`) + chân trang hiện phiên bản; mỗi lần phát hành chạy `node tools/bump-version.cjs` (tăng patch, gắn `?v=<phiên bản>` cho mọi `<script>/<link>` nội bộ trong `index.html`).
- [ ] README: đề số, 5 tính năng, cách chạy, AI thật/mock + nhãn, giới hạn, nguồn tham khảo, không lộ key.

## Kiểm thử (Playwright, `.cjs`)
- [ ] Chạy `node tests/smoke.cjs http://localhost:<cổng>/ [--shots thư-mục]`; test của feature mới (`tests/<tên>.cjs`) cũng nhận URL từ `argv`, không cổng cứng; ảnh lưu vào thư mục `--shots`, thư mục này git-ignore.
- [ ] Câu nhãn mock trong `tests/smoke.cjs` khớp `mockNotice` (nguyên văn từ đề/BTC) trong `js/config.js`.
- [ ] Mỗi tính năng ≥ 3 ca: thường / sai / biên; thêm test mobile 390px không tràn ngang; test sáng/tối không lỗi console.
- [ ] Test mở app bằng `?demo=1` để dữ liệu ổn định (smoke.cjs đã làm sẵn).
- [ ] Chỉ ghi kết quả đã chạy thật vào bảng kiểm thử, kèm lệnh và ngày.
