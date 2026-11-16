# 10. Lucian UI: chọn phần tử nào cho đề nào, và cách đưa vào trong 5 phút

Lucian Lab UI (MIT, (c) 2026 Seokwoooo) là thư viện 400 phần tử giao diện, mỗi phần tử là một file HTML tự chứa (HTML + CSS + JS, token `--ux-*`, sáng/tối, chuột/cảm ứng/bàn phím, tôn trọng giảm chuyển động). Starter đã có **lớp Lucian** (`css/lucian.css` + `js/lucian.js`) nâng cấp sẵn các thành phần phổ biến cho mọi feature, xem README mục "Lớp Lucian" và tab Mô-đun > "Thư viện UI". Tài liệu này dành cho khi đề cần thứ **chưa có sẵn** trong lớp đó.

22 phần tử được chép sẵn ở `vendor/lucian/elements/NNN-*.html` (kèm `LICENSE`). Các số còn lại: tra trong repo Lucian gốc (`src/elements/NNN-*.html`, danh mục `idx.txt`).

## Bảng tra: nhu cầu của đề -> số phần tử

| Nhu cầu hay gặp trong đề | Dùng ngay từ lớp Lucian của starter | Phần tử Lucian để chép thêm (số) |
|---|---|---|
| Form nhập liệu (đăng ký, đặt lịch, đơn hàng) | `EP.form` (nhãn nổi, rung lỗi, đếm ký tự, `type:'money'`, công tắc) | 025 nhãn nổi, 028 textarea đếm ký tự, 035 ô tiền, 244 nhảy tới ô lỗi, 026 mã OTP, 034 tự gợi ý, 032 kéo thả tệp |
| Chọn một / nhiều (nhóm, tuỳ chọn, bộ lọc) | segmented, chip, `select` tuỳ biến | 031 listbox, 047 segmented, 019 chip nhiều lựa chọn, 015 thẻ radio, 013 công tắc bóp, 023 danh sách công tắc cài đặt |
| Dashboard / KPI | `EP.ui.kpi` đếm lên, vi-VN | 098 KPI đếm lên, 082 vòng tiến độ, 099 vòng hoạt động, 299 thanh hạn mức đổi màu |
| Biểu đồ | `EP.charts.bar/line/donut` vẽ dần | 095 cột có rê, 096 đường có rà soát (scrub), 097 donut nở ra, 158 cầu lãi lỗ, 160 phễu chuyển đổi, 151 lưới đóng góp, 154 radar |
| Bảng dữ liệu | `EP.ui.table` (sticky, thẻ trên di động) | 227 bảng đơn mới đẩy vào, 217 bảng so sánh gói, 178 chọn hàng loạt, 255 kanban kéo thả |
| Câu trả lời AI có nguồn | `EP.lucian.aiLoading`, thanh tiến trình tự chạy | **224 câu trả lời AI có trích dẫn**, 086 AI trả lời chảy ra, 235 tóm tắt AI, 079 skeleton chuyển sang nội dung |
| Giỏ hàng, thanh toán | KPI + bảng + `EP.ui.confirm({hold:true})` | **240 ngăn kéo giỏ hàng**, 051 thêm vào giỏ, 230 mã giảm giá, 293 khay so sánh, 265 giao hàng trước giờ chốt |
| Máy tính / ước tính giá | `EP.calc`, ô tiền, KPI đếm lên | **278 máy tính giá theo ghế**, 133 đổi đơn vị, 134 chia hoá đơn, 135 co giãn công thức |
| Quy trình nhiều bước (wizard) | `EP.ui.stepper` (thanh đầy, dấu tích) | **042 wizard stepper**, 063 đăng ký từng câu một, 087 thanh bước tuyến tính |
| Đặt lịch / chọn giờ | `EP.timeslot` | 279 nút đặt lịch tách đôi theo giờ, 362 trống giờ cuộn, 109 giờ rảnh |
| Thông báo, hoàn tác | `EP.ui.toast` xếp chồng, vuốt gạt | 070 toast xếp chồng, 071 snackbar hoàn tác, 074 chuông thông báo |
| Trạng thái trống / lỗi / chờ | `EP.ui.empty/error/skeleton` | 088 trống nổi, 090 lỗi và thử lại, 083 thanh không xác định, 091 mất mạng |
| Nút hành động nguy hiểm / xác nhận | `EP.ui.confirm({ hold: true })` | 003 giữ để xoá, 008 sao chép thành dấu tích, 009 nhãn cuộn, 269 gõ để xoá |
| Điều hướng, tab | tab trượt (có sẵn), `.seg` | 039 tab viên trượt, 041 tab dưới di động, 044 FAQ accordion, 046 command palette |
| Đánh giá, xã hội | | 016 chấm sao, 261 thanh phân bố sao, 253 toast mua gần đây |
| Khuyến mãi, gamification | | 331 vòng quay, 298 phiếu xé, 320 cào thẻ, 372 lên cấp XP |

Chữ in đậm = phần tử đề vòng chung kết hay "đụng" nhất.

## Đưa một phần tử vào app trong 5 phút

1. Mở file `vendor/lucian/elements/NNN-*.html`. Có 3 khối: `<style>`, markup, `<script>`. Class đều có tiền tố `uNNN-` nên chép vào cạnh code của bạn không đụng nhau.
2. **CSS**: dán khối `<style>` vào cuối `css/lucian.css` hoặc một file `features/<ten>/<ten>.css` (bọc trong `@layer components { ... }` nếu muốn thua utilities). Token `--ux-*` đã trỏ sang token của app, không cần sửa màu.
3. **Markup**: đưa vào chuỗi HTML của `render(el)` của feature. Chữ Hàn/Anh trong mẫu: đổi sang tiếng Việt có dấu. Dữ liệu tên người, giá, ngày: lấy từ form/collection, **không** để chữ mẫu.
4. **JS**: dán khối `<script>` vào feature, đổi `document.querySelector(...)` thành `el.querySelector(...)` (el là gốc view) và chạy sau khi gán `innerHTML`. Bỏ phần demo (dữ liệu giả).
5. Kiểm tra: tối/sáng, bàn phím (Tab, Enter, Esc), 390px không tràn ngang, `prefers-reduced-motion` (tắt hiệu ứng nhưng vẫn dùng được), vùng chạm >= 44px. Chạy `node tests/smoke.cjs`.
6. Ghi nguồn một dòng ở đầu đoạn đã chép: `/* Lucian #NNN <tên>, MIT (c) 2026 Seokwoooo */`.

## Quy tắc đưa vào đề thi
- Ưu tiên **dùng lớp Lucian có sẵn** (không cần chép gì). Chỉ chép thêm phần tử khi nó **là** tính năng của đề (vd giỏ hàng, máy tính giá), không chép để trang trí.
- Không đổi tên token; không thêm CDN; không thêm phụ thuộc. Số/tiền dùng `EP.lucian.fmt` (vi-VN).
- Hiệu ứng phải tắt được bằng `prefers-reduced-motion`; không chặn thao tác bằng hoạt ảnh dài (> 600ms).
