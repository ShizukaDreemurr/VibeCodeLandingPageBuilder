# 04 — Bài học và lỗi thường gặp (triệu chứng → nguyên nhân → cách sửa)

Rút từ lịch sử Xclipse. Đọc nhanh trước T+8, dán các dòng liên quan vào prompt agent.

## Quy trình agent / git

| Triệu chứng | Nguyên nhân | Cách sửa / phòng |
|---|---|---|
| Ảnh chụp của agent không có thay đổi vừa code; "chạy được" mà thật ra sai trang | Nhiều agent cùng dùng cổng 8000, server phục vụ **worktree của người khác** | Mỗi agent cổng riêng (bảng ở `02`), không bao giờ 8000; kiểm tra `curl localhost:<cổng>/js/version.js` thấy đúng nhánh |
| Agent thấy code cũ / thiếu file | Worktree bắt đầu từ commit cũ | Dòng đầu prompt `git reset --hard <nhánh>`; so `git log -1` |
| Test fail dù tính năng đúng | Test **hardcode cổng 8000** | Test lấy URL từ `argv[2]`/`BASE_URL`; điều phối viên truyền URL |
| Merge xong app trắng | Xung đột ở `index.html` (hai dòng `<script>` đè nhau / thứ tự sai) | Giữ cả hai script, đúng thứ tự phụ thuộc; mỗi agent thêm script ở neo riêng |
| CSS sau điểm merge không áp dụng | Thiếu/thừa `}` trong `app.css` sau merge | Đếm ngoặc; khối `@layer app {}` phải đóng; chạy lại ảnh chụp |
| Hai agent sửa cùng hàm/file | Prompt không chia file | Chia sở hữu file; liệt kê "file CẤM đụng" |
| Agent dừng giữa chừng không báo | Chạm giới hạn/API lỗi | Kiểm tra commit của nó, spawn lại phần còn lại (prompt kèm "đã làm gì rồi") |
| Agent báo "xong" nhưng chưa thử | Không bắt buộc verify | Prompt yêu cầu ảnh + lệnh test + kết quả; QA agent kiểm lại |

## CSS / animation

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Kiểu của app đè lên landing/xem trước (hoặc ngược lại) | CSS app **nằm ngoài `@layer`** nên thắng độ ưu tiên | Toàn bộ CSS app trong `@layer app {}`; nội dung người dùng/xem trước ngoài layer |
| Thanh trên hiện bóng ma khi đổi theme/tab | `view-transition` bắt cả phần tử cố định | Gán `view-transition-name` riêng cho thanh, dọn token sau mỗi chuyển |
| Hiệu ứng đổi theme giật, chạy hai lần | **Hai animation trên cùng một pseudo** (`::view-transition-new(root)`) | Chỉ một WAAPI animation cho mỗi pseudo; dọn khi `finished` |
| Cuộn nhanh trên điện thoại bị kẹt | Hiệu ứng scroll/observer nặng, `scroll-snap` lỗi | Chỉ `transform/opacity`, observer nhẹ, giảm hiệu ứng ở mobile, thử vuốt thật |
| Animation giật nhẹ | Animate layout (`width/top`) hoặc `transition: all` | Chỉ thuộc tính composite; liệt kê thuộc tính cụ thể |
| Chớp trắng khi đổi tab | Nền chưa theo theme | `body` có nền theo biến; ép nền trước khi render |
| Thanh/toolbar tách khỏi header khi cuộn hoặc zoom | Sticky lồng nhau | Một container cố định; khoá chiều cao màn thiết kế |
| Input trong landing hiện kiểu tối | Màn tối "rò" vào vùng sáng | `color-scheme: light` cho vùng nội dung người dùng |
| Chữ nút "Tạo bằng X" xuống dòng | Không `nowrap` | `white-space: nowrap` cho tên thương hiệu trong nút |
| Khoảng trắng lạ cuối trang mobile | `min-height`/`100vh` + thanh địa chỉ | Dùng `100dvh`, kiểm tra footer ở 390px |

## Cache / triển khai / chia sẻ

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Đã push mà trang vẫn bản cũ | Trình duyệt/Pages giữ cache | Bump `?v=` mọi script/css (script bump), Ctrl+F5, chờ 1–10 phút, kiểm tra `version.js` ở chân trang |
| Facebook/Zalo hiện sai tiêu đề/ảnh | **Bot không chạy JS**, meta gắn bằng JS | Tạo HTML tĩnh `s/<id>/index.html` có sẵn OG + chuyển hướng bằng JS cho người thật; ảnh JPEG 1200x630 |
| Ảnh tải lên máy không hiện trên link chia sẻ | Ảnh là dataURL/local | OG chỉ nhận URL http(s) công khai |
| Khách tải lại trang bị mất trang đang làm (bị ghi đè bằng demo) | Seed demo chạy không kiểm tra | Chỉ seed khi chưa có dữ liệu; có cờ "đã seed"; test riêng |
| Máy giám khảo có dữ liệu demo cũ | Không có version dữ liệu | `demoVersion` tự cập nhật bản mới mà không đụng dữ liệu người dùng |
| Link online chạy nhưng demo bị trắng ở mạng trường | CDN/font ngoài bị chặn | Không phụ thuộc CDN; font fallback hệ thống |
| Ngày demo "còn 17 giờ" / số âm khi chấm | Ngày tương đối hoặc ngày cũ | Ngày cố định tương lai gần; sự kiện đã qua ghi rõ "đã diễn ra" |

## AI / dữ liệu

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Nhãn mô phỏng bị bác/chấm trừ | Sai câu chữ BTC yêu cầu | Lấy **nguyên văn** từ đề; vòng loại: `Bản demo vòng loại - Dữ liệu mô phỏng AI`; chung kết kiểm tra lại, đừng suy diễn |
| Nhãn mô phỏng xuống dòng/che nút | CSS | `flex-wrap`, chạy ảnh mobile |
| Tạo ảnh bằng Gemini báo 429 `limit: 0` | **Key miễn phí không tạo được ảnh** (cần billing) | Văn bản dùng Flash miễn phí được; ảnh: dùng ảnh có sẵn/SVG/gradient, thông báo rõ trong app |
| Tên model đổi/gỡ (-preview) | Không ổn định | Danh sách model dự phòng, tự thử model kế khi 404; luôn có mock |
| AI trả JSON kèm văn bản/code fence | Đầu ra tự do | Parser tách JSON, sửa lỗi phổ biến, kiểm schema, thiếu trường bù bằng mock, cảnh báo có nhãn |
| Nội dung mock sáo rỗng ("nâng tầm chuyên môn") | Công thức đơn điệu | Nhiều mẫu câu, lấy dữ kiện từ input, cấm cụm sáo rỗng; dữ liệu chính xác không để AI bịa |
| Key lộ trong repo/ảnh | Dán vào code/chat | Ô nhập riêng, `***`, localStorage; quét secret trước push; ảnh minh chứng không lộ key |

## Sản phẩm / thời gian

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Hết giờ mà tính năng thứ 5 dang dở | Thêm tính năng ngoài đề, làm polish sớm | Lõi trước; polish sau T+40; cắt phụ |
| Điểm kiểm thử thấp | Ghi "Đạt" cho ca chưa chạy | Chỉ ghi ca đã chạy thật |
| Thư mục rác trong repo (`undefined/`, ảnh chụp) | Test ghi ảnh vào đường dẫn undefined | Test nhận thư mục ảnh qua `argv`, `.gitignore` thư mục ảnh |
| Quá nhiều hiệu ứng làm chậm bản trình diễn | Quá đà | 1–2 hiệu ứng nhấn, còn lại tinh tế; test trên máy yếu |
| Mobile bị bỏ quên | Chỉ test desktop | QA 390px bắt buộc ở T+48 |
