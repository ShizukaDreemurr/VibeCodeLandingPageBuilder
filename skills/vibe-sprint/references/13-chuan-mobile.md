# 13. Chuẩn mobile (điện thoại dọc) cho app thi

Chung kết chấm app **trên điện thoại ở 360-390px**, dọc. Máy tính chỉ là phụ. Tài liệu này là chuẩn cứng: mọi agent giao diện đọc trước khi viết CSS. Starter (`starter/css/mobile.css`, `js/core.js`, `js/ui.js`, `js/mobile.js`) đã làm sẵn phần lớn; feature mới chỉ cần **dùng đúng thành phần** và không phá các quy tắc dưới.

Năm tiêu chí chấm: (1) không tràn ngang, (2) nút/ô nhập đủ lớn và không chồng nhau, (3) chữ đọc được ở zoom mặc định, (4) mọi luồng chính làm được trên điện thoại, (5) điều hướng rõ, biết đang ở đâu. Cuối file có bảng ánh xạ từng tiêu chí sang cách kiểm tra bằng test.

## 1. Khung nhìn mục tiêu

- Thiết kế và kiểm thử ở **360×780** (Android phổ biến) và **390×844** (iPhone), **dọc**, `deviceScaleFactor` 3. Meta bắt buộc: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Không bao giờ khóa zoom (`user-scalable=no`).
- Chiều ngang ngang (landscape) không bắt buộc đẹp, nhưng **không được vỡ**: không tràn, thanh tab dưới tự thấp lại (`max-height: 440px`), sheet vẫn cuộn được.
- Máy tính từ `min-width: 768px` trở lên: mở rộng vừa phải (tab ngang trên đầu, hộp thoại giữa màn hình, thanh hành động thành nhóm nút nổi góc phải). Viết CSS **mobile-first**: mặc định là điện thoại, `@media (min-width: 768px)` mới thêm.

## 2. Chữ

| Vai trò | Cỡ | Ghi chú |
|---|---|---|
| Thân (đoạn văn, ô bảng, nút) | **16px**, line-height 1.5 | Không nhỏ hơn 14px cho nội dung chính |
| Ô nhập (`input`, `select`, `textarea`) | **≥ 16px** | Dưới 16px thì iOS tự phóng to khi focus, làm vỡ bố cục |
| Chữ phụ (mô tả dưới số, thông báo lỗi dưới ô) | 13-14px | Sàn cứng 12px, chỉ cho nhãn/huy hiệu/trục biểu đồ |
| H1 mỗi màn hình | 26px, đậm | Đúng một `<h1>` mỗi view |
| Tiêu đề thẻ (`.section-title`) | 18px | |
| Số liệu lớn (KPI) | 22-30px, `tabular-nums` | Cho phép xuống dòng, **không cắt số** |

- Màu chữ đạt tương phản **AA**: 4.5:1 cho chữ thường, 3:1 cho chữ ≥ 24px hoặc 18.5px đậm và viền ô nhập. Token của starter đã chỉnh sẵn cho sáng và tối; đừng tự thêm màu xám nhạt.
- **Tiếng Việt:** để trình duyệt tự ngắt dòng (`overflow-wrap: break-word`, `text-wrap: balance` cho tiêu đề, `pretty` cho đoạn). Không `text-overflow: ellipsis` cho **số, tiền, ngày, tên người, tên sản phẩm**. Ellipsis chỉ cho nhãn phụ mà chạm vào xem được đầy đủ. Dấu thanh cần chỗ: line-height ≥ 1.3 cho tiêu đề, 1.5 cho thân.
- Phông hệ thống hoặc Be Vietnam Pro (có dấu đủ). Không dùng phông trang trí không có chữ có dấu.

## 3. Vùng chạm và khoảng cách

- **Mọi phần tử chạm ≥ 48×48px** (nút, link độc lập, ô nhập, công tắc, nhãn chọn, chip lọc, tab). Biến `--touch: 48px` trong `tokens.css`. Nút icon nhỏ về hình thì vẫn phải có hộp 48×48 (`.icon-btn`, `.btn-sm` đã ép).
- **Cách nhau ≥ 8px** giữa hai phần tử chạm cạnh nhau (`gap: 8px`). Nút xóa không được sát nút sửa.
- Ngoại lệ duy nhất: link nằm giữa đoạn văn (inline).
- Radio/checkbox: vùng chạm là **cả nhãn** (`label.check` cao ≥ 48px), không phải cái ô vuông 20px.
- Thanh trượt (`input[type=range]`) cao 48px, núm 28px.
- Mọi phần tử chạm có trạng thái **focus rõ** (`:focus-visible`, viền 2px màu nhấn) và trạng thái **nhấn** (`:active`, thu nhỏ nhẹ). Không có chức năng chỉ hiện khi rê chuột (`:hover`): mọi thứ rê mới thấy phải có cách chạm.

## 4. Bố cục

- **Một cột.** Thẻ chiếm hết bề rộng, lề trang **16px** hai bên. Lưới KPI **2 cột** (khoảng cách 10px). Không có lưới 3 cột trở lên trên điện thoại.
- Phần quan trọng nhất lên đầu; nút chính ở **vùng ngón cái** (nửa dưới màn hình).
- Thanh trên **mỏng** (≤ 64px): logo + tên app + nút giao diện. Sticky nhưng không chiếm quá 8% chiều cao màn hình; không đặt bộ lọc, tab, banner dính ở đầu.
- Không có layout shift: khung có chiều cao ổn định trong lúc tải, dùng skeleton (`EP.ui.skeleton`) thay vì để nhảy.
- Hero: gọn (≤ 220px cao), giữ gradient thương hiệu, **không** kính mờ nặng (`backdrop-filter`) trên điện thoại.

## 5. Điều hướng: thanh tab dưới (bottom tab bar)

Điện thoại **không** dùng tab viên thuốc trên đầu. Dùng thanh tab dưới, `EP.register` tự dựng:

- **3 đến 5 mục**, mỗi mục **icon + nhãn chữ** (nhãn ≥ 12px, ngắn ≤ 10 ký tự). Quá 5 tab thì ô thứ 5 là "Thêm" mở bottom sheet liệt kê phần còn lại.
- Mục đang chọn: viên nền (pill) quanh icon, icon dạng duotone, nhãn đậm, `aria-current="page"`. **Không chỉ dựa vào màu**.
- Cố định đáy, chừa `env(safe-area-inset-bottom)` cho iPhone. Hộp mỗi mục ≥ 48px, thực tế cao 64px.
- Chạm lại tab đang mở: cuộn lên đầu. Đổi tab: nhớ vị trí cuộn của tab đó, chuyển cảnh trượt/mờ ≤ 220ms (tắt khi `prefers-reduced-motion`).
- Tab ngang trên đầu (`#tabs`) chỉ hiện từ 768px.
- Điều hướng con trong một view (ví dụ chọn mô-đun) dùng `EP.ui.segmented` cuộn ngang, có mờ mép báo "còn nữa", mục đang chọn tự cuộn vào giữa.

## 6. Thanh hành động chính (sticky bottom action bar)

Hành động chính của màn hình (Thêm, Lưu, Tạo bằng AI) đặt trong thanh dính ngay trên thanh tab dưới:

```js
EP.ui.actionBar(el, [
  { label: 'Xuất CSV', icon: 'download', iconOnly: true, act: 'export', onClick: exportCsv },
  { label: 'Thêm mục', icon: 'plus', variant: 'primary', act: 'add', onClick: openForm }
]);
```

- Tối đa 3 nút; nút `primary` rộng nhất, nút phụ dạng icon (có `aria-label`). Hai nút không chồng, mỗi nút ≥ 48px.
- Thanh chỉ hiện khi view của nó đang mở; `<html>` có class `has-abar` để CSS **chừa chỗ cuối trang** (nội dung cuối không bị che).
- Nút trong hộp thoại/sheet: thanh nút dính đáy sheet, `padding-bottom: safe-area`.
- Toast nằm **trên** các thanh dưới, không che tab.

## 7. Form, hộp thoại, bottom sheet

- Form **một cột**. Nhãn nổi trong ô (có sẵn), lỗi hiện dưới ô, focus nhảy vào ô lỗi đầu tiên.
- Thuộc tính bàn phím (`EP.form` tự thêm theo `type`): `type: 'tel'` → `inputmode="tel"`; `'email'` → `inputmode="email"`; `'number'` → `inputmode="numeric"` (nguyên) / `"decimal"`; `'money'` → `inputmode="numeric"` và tự chấm nghìn; `enterkeyhint="next"` cho ô giữa, `"done"` cho ô cuối; `autocomplete` đúng nghĩa (`name`, `email`, `tel`, `street-address`, `postal-code`) khi form liên quan người dùng. Tắt `autocapitalize` và `spellcheck` cho email/URL.
- **Hộp thoại = bottom sheet** trên điện thoại: bám đáy, rộng hết màn hình, bo góc trên 24px, có **tay nắm** và **kéo xuống để đóng** (`EP.ui.dialog` làm sẵn), cao tối đa 92% màn hình, thân sheet cuộn riêng, nút dính đáy. Chạm nền mờ hoặc nút X cũng đóng. Form dài đặt trong sheet, không chuyển trang.
- Xác nhận nguy hiểm (xóa): `EP.ui.confirm({ danger: true })`: hai nút ngang hàng ≥ 48px, nút hủy bên trái.

## 8. Bảng, biểu đồ, dữ liệu

- **Bảng → thẻ** trên điện thoại (`EP.ui.table` tự chuyển; ô đầu là tiêu đề thẻ, ô khác là cặp nhãn - giá trị, nút thao tác ở cuối thẻ). Bảng chỉ cuộn ngang khi thật sự cần (xem trước file Excel, mô hình kinh doanh), và **cuộn trong khung của nó**, không làm trang tràn.
- Biểu đồ (`EP.charts.*`) vẽ theo bề rộng khung, nên ở 360px chữ trục vẫn **≥ 12px**; giới hạn nhãn (cắt `…` chỉ trên trục; giá trị đầy đủ có trong bảng ẩn cho trình đọc màn hình và trong chú giải). Mỗi biểu đồ có tiêu đề, đơn vị, và nhãn mô phỏng nếu là số giả lập.
- Danh sách dài: cuộn mượt theo trang (không lồng nhiều vùng cuộn dọc); danh sách rất dài (> 100 dòng) phân trang hoặc "Xem thêm".
- Ô tìm kiếm cao 48px, `type="search"`, `enterkeyhint="search"`.

## 9. Chuyển động và hiệu năng

- Chuyển cảnh tab: trượt + mờ ≤ 220ms, bấm nút: spring nhỏ (`transform`, ≤ 400ms). **Chỉ animate `transform` và `opacity`.** Tôn trọng `prefers-reduced-motion` (không trượt, không spring).
- Điện thoại tầm thấp: **không** `backdrop-filter`/blur lớn, không `background-attachment: fixed`, không bóng đổ lớn chồng nhiều lớp, không video nền. Mục tiêu **60fps khi cuộn**.
- **Nội dung đầu tiên hiện trong < 1 giây** (4G): không CDN bắt buộc, không phông ngoài chặn render, ảnh có `width`/`height` và `loading="lazy"`, ảnh ≤ 200KB sau khi nén. Skeleton cho phần chờ AI.
- Không chặn luồng chính > 50ms bằng JS đồng bộ; việc nặng chạy sau khung hình đầu.

## 10. Giao diện tối

Sáng/tối theo hệ thống, có nút đổi. Tối cũng phải **đạt AA**: chữ chính ≥ 4.5:1, viền ô nhập ≥ 3:1, trạng thái (thành công/lỗi/cảnh báo) không chỉ phân biệt bằng màu (kèm chữ hoặc icon). Kiểm tra ảnh chụp cả hai theme trước khi nộp.

## 11. Danh sách kiểm (tick trước khi nộp) và cách test chứng minh

Chạy: `node tests/smoke.cjs http://localhost:8211/` (đã gồm `tests/mobile-suite.cjs`, chạy riêng được). Ảnh cho slide: `node tools/shots-mobile.cjs http://localhost:8211/ shots-mobile`.

| # | Tiêu chí chấm | Điều kiện | Test kiểm (360×780 và 390×844) |
|---|---|---|---|
| 1 | Không tràn ngang | Mọi view và mọi mô-đun con, sáng và tối: `scrollWidth ≤ clientWidth`; bảng/xem trước cuộn trong khung | `audit(...)`: "không tràn ngang" cho từng tab, từng đoạn của sân chơi; tối: "không tràn ngang" |
| 2 | Nút/ô nhập lớn, không chồng nhau | Mọi phần tử chạm ≥ 48×48; không hai hộp chạm cắt nhau (nhóm cố định và nhóm trong trang tính riêng, phần bị cắt bởi vùng cuộn không tính); thanh dưới không che cuối trang; toast không che tab | "mọi nút/ô nhập ≥ 48×48", "không chồng nhau", "cuối trang không bị thanh dưới che", "toast nằm trên thanh tab" |
| 3 | Chữ đọc được | Nội dung ≥ 14px (thân 16px), chú thích/nhãn ≥ 12px, ô nhập ≥ 16px, chữ SVG tính theo tỉ lệ co | "chữ nội dung ≥ 14px, chú thích ≥ 12px", "ô nhập ≥ 16px" |
| 4 | Luồng chính bằng chạm | Thêm qua bottom sheet (kéo đóng được, bàn phím đúng loại), AI mô phỏng có nhãn, lưu, xem lại, xóa có xác nhận, kịch bản kinh doanh, nhập file | "luồng chính" và "luồng ... kịch bản kinh doanh + nhập file" (chỉ `tap`, bàn phím ảo) |
| 5 | Điều hướng rõ | Thanh tab dưới 3-5 mục, icon + nhãn, đúng 1 mục `aria-current="page"` khớp view hiện tại, URL đổi, thanh trên ≤ 64px, nhớ vị trí cuộn | "thanh tab dưới ...", "đúng 1 mục ... aria-current", "nhớ vị trí cuộn" |

Test đỏ ở dòng nào, sửa đúng chỗ đó; **không nới ngưỡng** để test xanh. Hai ngoại lệ có chủ ý đã nằm trong test: link inline giữa đoạn văn, và chữ chú thích dùng sàn 12px (không phải 14px) cho nhãn tab, huy hiệu, trục biểu đồ, thông báo lỗi dưới ô.

## 12. Chép nhanh khi viết feature mới

1. Nút chính của màn hình → `EP.ui.actionBar(el, [...])`, không đặt nút chính ở đầu trang.
2. Form → `EP.form.render(SCHEMA)` trong `EP.ui.dialog` (tự thành sheet), đúng `type` để có bàn phím đúng.
3. Danh sách → `EP.ui.table` với `render` cho ô đầu là tên + dòng phụ (`.cell-main` + `.cell-sub`) và `label` cho mọi cột (để thành thẻ).
4. Số liệu mô phỏng → `EP.ai.noticeHtml(result)`; số lớn → `EP.ui.kpi`.
5. Icon → `EP.ui.icon('tên')` (bộ Xclipse `js/icons.js`, tên trong `XcIcons.names`); tab → `icon:` trong `EP.register`.
6. Chạy `node tests/smoke.cjs ...` và xem ảnh `tools/shots-mobile.cjs` ở cả sáng và tối trước khi commit.
