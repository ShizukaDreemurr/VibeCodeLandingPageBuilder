# 03 — Chuẩn chất lượng Xclipse (checklist rút gọn)

Dán mục liên quan vào prompt mọi agent. Tick trước khi merge.

## Kiến trúc
- [ ] Vanilla HTML/CSS/JS, **không build**, global namespace 1 tên (vd `window.APP`), script `defer` theo thứ tự phụ thuộc.
- [ ] Mỗi tính năng 1 file JS (`js/<tên>.js`); logic thuần (validator, tính toán) tách khỏi DOM để test.
- [ ] CSS: `css/tokens.css` (biến) + `css/app.css`. **Toàn bộ CSS app trong `@layer app {}`**, kiểm tra mỗi khối đóng đủ `}`.
- [ ] Lưu trữ qua 1 module `storage.js` (try/catch, có khoá phiên bản dữ liệu); ghi rõ localStorage chỉ trên 1 máy.
- [ ] 1 cửa gọi AI (`ai-service.js`): mock mặc định, thật khi có key.

## Design tokens (Lucian Lab style, rút gọn)
- [ ] Biến: `--ground --surface --raised --border --text --text-muted --primary --accent --accent-ink --accent-soft --success --warn --danger --overlay`, font, radius, spacing, easing `--ux-ease: cubic-bezier(.2,.8,.2,1)`.
- [ ] Nút chính màu gần đen / hoặc accent, một màu nhấn duy nhất; không bóng nặng; viền 1px mờ.
- [ ] Chữ ≥ 14px, ô nhập ≥ 16px (tránh iOS zoom). Font: Be Vietnam Pro / IBM Plex Sans + fallback hệ thống (hỗ trợ tiếng Việt).
- [ ] Tương phản AA: chữ thường ≥ 4.5:1, viền ô nhập ≥ 3:1. Đo, không đoán.

## Sáng / tối
- [ ] `prefers-color-scheme` làm mặc định, nút chuyển Sáng/Tối/Hệ thống, nhớ lựa chọn (try/catch).
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
- [ ] Hành động xoá: xác nhận bằng dialog tự làm (Huỷ giữ / Đồng ý xoá), không `confirm()` gốc.

## Validation và nghiệp vụ
- [ ] Tên trống, email sai, SĐT sai (chấp nhận +84/0, chuẩn hoá), số âm, ngày quá khứ, quá dài: đều có thông báo.
- [ ] Trùng → ghi 1 lần; bấm đúp → 1 lần; hết hạn/đủ chỗ → trạng thái đúng, ẩn nút.
- [ ] Không bao giờ hiện `undefined`, `NaN`, `Invalid Date`, số âm.
- [ ] Chuỗi người dùng nhập luôn `textContent`/escape, chặn HTML/JS chèn vào.

## Dữ liệu demo
- [ ] Mở lần đầu thấy ngay nội dung đầy đủ, sạch, thật: 3–6 bản ghi tiếng Việt thực tế (tên, số liệu, ngày cố định tương lai gần).
- [ ] Nút "Xoá/Khôi phục dữ liệu mẫu". Demo **không được ghi đè dữ liệu người dùng đang làm** (khách tải lại trang vẫn giữ trang của mình).
- [ ] Test tự động seed demo qua `?demo=1`, không dựa vào lần mở đầu.

## Mobile
- [ ] 390px và 360px: không tràn ngang (`scrollWidth <= innerWidth`), vùng chạm ≥ 44px, tab cuộn ngang, dialog dạng bottom sheet.
- [ ] Lưới 3 mục: 1 cột hoặc 3 cột đều, không để lẻ 2+1. Không khoảng trắng lạ cuối trang.
- [ ] Sticky bar không che nội dung; chữ nút không xuống dòng xấu (`white-space: nowrap` cho thương hiệu).

## Truy cập (a11y)
- [ ] Một `h1` mỗi màn; thứ tự heading đúng; link "bỏ qua tới nội dung".
- [ ] Mọi `input` có `label`; `aria-live` cho toast/lỗi; focus nhìn thấy; dialog giữ focus + Esc đóng + trả focus.
- [ ] Ảnh có `alt` mô tả tiếng Việt, có `width/height`.

## SEO / chia sẻ (nếu có link công khai)
- [ ] `title` ≤ 60, `description` 140–160, canonical, OG/Twitter (ảnh 1200x630 JPEG), `lang="vi"`, favicon, `robots.txt`, `sitemap.xml`, `404.html`.
- [ ] Facebook/Zalo **không chạy JS** → meta phải nằm sẵn trong HTML tĩnh (trang chia sẻ riêng), không gắn bằng JS.

## Phát hành
- [ ] `js/version.js` + chân trang hiện phiên bản; mỗi lần phát hành chạy script bump `?v=<phiên bản>` cho mọi `<script>/<link>` nội bộ.
- [ ] README: đề số, 5 tính năng, cách chạy, AI thật/mock + nhãn, giới hạn, nguồn tham khảo, không lộ key.

## Kiểm thử (Playwright, `.cjs`)
- [ ] Test nhận URL từ `argv`, không cổng cứng; ảnh lưu vào thư mục `argv`.
- [ ] Mỗi tính năng ≥ 3 ca: thường / sai / biên; thêm test mobile 390px không tràn ngang; test sáng/tối không lỗi console.
- [ ] Chạy tự động mặc định bỏ qua popup chào/demo (cờ `?popup=1`, `?demo=1`) để test ổn định.
- [ ] Chỉ ghi kết quả đã chạy thật vào bảng kiểm thử, kèm lệnh và ngày.
