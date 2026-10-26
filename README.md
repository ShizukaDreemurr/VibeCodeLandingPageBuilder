# Xclipse — Tạo landing page sự kiện trong 5 phút — Cuộc thi Vibe Coding 2026

> Marketer tổ chức workshop, hội thảo hay khai trương thường phải chờ designer làm landing page, sửa đi sửa lại trên điện thoại, rồi tự gom danh sách đăng ký bằng tay. **Xclipse** giúp họ nhập thông tin sự kiện, để AI viết nội dung, chọn mẫu theo ngành và có ngay một trang đăng ký hoàn chỉnh — xuất bản bằng link/QR, số người đăng ký cập nhật tức thì, danh sách khách gom về một nơi để sale chăm sóc.

## 1. Thông tin chung

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | Xclipse |
| Bảng thi | Bảng B - Kinh tế |
| Đề bài bốc thăm | Đề số 8 — Tạo landing page sự kiện trong 5 phút |
| Demo online | https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/ |
| Video demo (≤ 02 phút) | `<URL – nhóm điền>` |
| Source ZIP | `<URL – nhóm điền>` |
| Minh chứng dùng AI | `docs/minh-chung-ai.md` (+ ảnh chụp) |
| Bảng kiểm thử | `docs/bang-kiem-thu.md` |

> Tiêu chí vòng loại: https://vibecoding.info.vn/tieu-chi-cham-thi
> Không có khóa API hay mật khẩu trong bài nộp. Cấu hình Firebase trong `js/firebase-config.js` là cấu hình web công khai theo thiết kế của Firebase; dữ liệu được bảo vệ bằng quy tắc `firebase/firestore.rules`.

## 2. Tính năng chính

**5 yêu cầu của đề**
1. **Form nhập**: tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi đăng ký sớm (kèm agenda, số chỗ, hạn ưu đãi), có kiểm tra lỗi từng ô.
2. **AI sinh headline, đoạn mô tả và 03 lợi ích** — 3 chế độ: AI mô phỏng (offline, có ghi chú minh bạch), **Gemini API thật**, hoặc **copy prompt sang Claude/ChatGPT/Gemini/Manus** rồi dán kết quả. AI chỉ viết chữ; ngày giờ, địa điểm, diễn giả luôn lấy từ form.
3. **Render landing page hoàn chỉnh**: hero, đếm ngược đến giờ G, giới thiệu, lợi ích, diễn giả, agenda, ưu đãi, form đăng ký. Sự kiện đã qua → hiển thị "Sự kiện đã diễn ra" (không đếm số âm).
4. **Form đăng ký lưu danh sách (localStorage)** và **hiển thị số người đã đăng ký theo thời gian thực** (cập nhật ngay cả khi mở nhiều tab).
5. **Nút "Tạo trang mới"** để làm lại với sự kiện khác (trang cũ vẫn lưu trong "Sự kiện của tôi").

**Quy tắc nghiệp vụ**: tên trống → cảnh báo; SĐT Việt Nam (nhận cả +84) và email sai định dạng → cảnh báo; **đăng ký trùng SĐT/email chỉ ghi nhận 1 lần**; hết chỗ → **danh sách chờ**; hết hạn ưu đãi → tự ẩn phần ưu đãi; sự kiện đã diễn ra → ẩn form; chặn bấm gửi liên tục.

**Mở rộng giúp marketer & sale**
- **Thư viện 6 mẫu** theo ngành / loại / mục đích (Tech, Giáo dục, Làm đẹp, Khai trương, Webinar Tài chính, **Thiệp cưới**), đổi mẫu giữ nguyên nội dung; bảng màu đạt chuẩn tương phản WCAG AA.
- **Builder theo section**: kéo thả / mũi tên đổi thứ tự, ẩn hiện (phần bắt buộc bị khoá), **sửa chữ trực tiếp trên trang**.
- **Ô ảnh tuỳ chỉnh**: ảnh bìa, ảnh diễn giả, album ảnh cưới — tự cắt, nén.
- **Xem thử trạng thái**: sắp hết chỗ / hết chỗ / hết ưu đãi / đã diễn ra, không ảnh hưởng dữ liệu thật.
- **Xuất bản bằng link + mã QR** (Firebase): khách đăng ký từ mọi thiết bị, số đếm cập nhật tức thì; **checklist trước khi xuất bản**.
- **Sự kiện của tôi**: quản lý nhiều sự kiện, mở lại, nhân bản, xoá.
- **Danh sách đăng ký cho sale**: trạng thái chăm sóc (Mới / Đã liên hệ / Chốt / Huỷ), nút Gọi / Zalo, xuất CSV mở bằng Excel.
- **Đo phễu**: lượt xem, tỉ lệ chuyển đổi, lượt bấm nút đăng ký, "Đặt lịch studio", "Tạo trang như thế này".
- **Thiệp cưới cho studio ảnh**: ghi nguồn studio + nút đặt lịch ở cuối thiệp (phễu khách hàng cho studio).
- **Tuỳ chọn Google Sheet**: tự ghi mỗi lượt đăng ký vào Sheet của ban tổ chức.

## 3. Công nghệ sử dụng

| Lớp | Công nghệ |
|---|---|
| Giao diện | HTML/CSS/JS thuần (không framework, không cần build) |
| Thư viện | Firebase JS SDK 12.19.0 (bản compat: app, auth, firestore), qrcode-generator 1.4.4 — đóng gói sẵn trong `vendor/`; font Be Vietnam Pro, Playfair Display (Google Fonts) |
| Lưu trữ | localStorage (mặc định, theo đề); Cloud Firestore khi xuất bản; tuỳ chọn Google Sheet qua Apps Script |
| Đăng nhập | Firebase Authentication — Google (chỉ cho chủ sự kiện) |
| Triển khai | GitHub Pages |

## 4. Tích hợp AI

- **Chế độ**: cả **API thật** và **Mock** (người dùng chọn):
  - API thật: Gemini (`gemini-2.5-flash` mặc định, đổi được model) — người dùng tự nhập API key, key chỉ lưu trong trình duyệt của họ, hiển thị dạng ẩn.
  - Copy prompt: prompt chuẩn được copy sẵn và mở Claude / ChatGPT / Gemini / Manus; người dùng dán JSON kết quả về.
  - Mock: giao diện hiển thị dòng *"Bản demo vòng loại – Dữ liệu mô phỏng AI"*; nội dung ghép từ công thức copywriting theo giọng văn (trang trọng / trẻ trung / gấp rút) và mẫu thiệp cưới.
- **Kiểm soát đầu ra AI**: tách JSON khỏi lời dẫn/markdown, sửa lỗi JSON phổ biến, kiểm tra đủ trường và độ dài, thiếu thì bù bằng bản mô phỏng và báo rõ; AI không được tự bịa ngày giờ, địa điểm, giá, tên người; người dùng sửa trực tiếp trước khi xuất bản; checklist cảnh báo nếu còn nội dung mô phỏng.
- **Bảo mật khoá API**: không có khoá trong mã nguồn. Hạn chế: khi dùng Gemini API, key do người dùng nhập được gọi trực tiếp từ trình duyệt của họ (không qua máy chủ trung gian).

## 5. Cài đặt và chạy local

Yêu cầu: trình duyệt hiện đại.

1. Giải nén file ZIP.
2. Mở trực tiếp `index.html` trên trình duyệt (chạy được ngay: tạo trang, AI mô phỏng, đăng ký lưu localStorage), **hoặc** chạy server tĩnh để dùng thêm đăng nhập Google / xuất bản: `npx serve .` hoặc `python3 -m http.server 8000` rồi mở `http://localhost:8000`.

Kiểm thử tự động: xem `tests/README.md` và `firebase/README.md`.

## 6. Cấu trúc thư mục

```text
VibeCodeLandingPageBuilder/
├── index.html               # khung app
├── css/                     # tokens.css (màu, font), app.css (công cụ), landing.css (trang sự kiện)
├── js/
│   ├── app.js               # điều phối giao diện
│   ├── storage.js           # đọc/ghi localStorage
│   ├── validators.js        # quy tắc kiểm tra dữ liệu
│   ├── event-status.js      # trạng thái: mở / sắp hết / hết chỗ / đã diễn ra
│   ├── registrations.js     # đăng ký, chống trùng, danh sách chờ (local)
│   ├── content-generator.js # AI mô phỏng
│   ├── ai-service.js        # Gemini API, prompt, đọc kết quả AI
│   ├── templates.js         # thư viện mẫu
│   ├── images.js            # chọn, cắt, nén ảnh
│   ├── landing-renderer.js  # dựng landing page
│   ├── cloud.js             # Firebase: xuất bản, đăng ký dùng chung, đo phễu
│   ├── sheet-sync.js        # Google Sheet (tuỳ chọn)
│   └── firebase-config.js   # cấu hình web Firebase (công khai)
├── firebase/                # quy tắc bảo mật Firestore + 33 ca kiểm thử
├── integrations/google-sheet/Code.gs
├── vendor/                  # thư viện bên thứ ba đóng gói sẵn
├── tests/                   # kiểm thử tự động (Playwright)
└── docs/                    # nghiên cứu, tiêu chí, kiểm thử, minh chứng AI
```

## 7. Truy cập và phân quyền

- Người tạo trang **không bắt buộc đăng nhập** khi làm việc trên trình duyệt (localStorage).
- **Xuất bản / xem danh sách đăng ký trên đám mây** cần đăng nhập Google; chỉ tài khoản đã xuất bản trang mới đọc, sửa trạng thái chăm sóc hoặc xoá danh sách (đã kiểm thử bằng Firebase Emulator).
- Khách tham dự chỉ **gửi** đăng ký, không đọc được danh sách; số đếm công khai không kèm thông tin cá nhân.

## 8. Giới hạn hiện tại

- Chế độ localStorage: dữ liệu chỉ nằm trên trình duyệt hiện tại; xoá dữ liệu trình duyệt hoặc đổi thiết bị sẽ mất. Muốn dùng chung nhiều thiết bị phải xuất bản (cần mạng).
- Ảnh lưu kèm dữ liệu sự kiện, tổng khoảng 900KB/sự kiện.
- Bộ đếm lượt xem/lượt bấm là số liệu công khai, có thể bị cộng khống nếu ai đó cố tình gọi trực tiếp; chỉ dùng tham khảo.
- AI mô phỏng không phải kết quả AI thật; Gemini API cần người dùng tự có key.
- Google Sheet là tuỳ chọn, số đếm qua Sheet cập nhật ~15 giây/lần.
- Giao diện đang là bản tạm, sẽ thay theo bộ nhận diện nhóm chọn.

## 9. Nguồn tham khảo

- Đề bài, tiêu chí chấm và mẫu README của Ban tổ chức VIBE-CODING 2026.
- Nghiên cứu nhóm: `docs/research-gemini.md`, `docs/bao-cao-ux-landing-page-su-kien.docx`, `docs/tam-sam-som.md`, `docs/nghien-cuu-pheu-thiep-cuoi.md`.
- Google Fonts (Be Vietnam Pro, Playfair Display); Firebase JS SDK (Apache-2.0); qrcode-generator (MIT).

## 10. Minh chứng dùng AI để xây dựng sản phẩm

Xem `docs/minh-chung-ai.md`: mục tiêu → yêu cầu cho AI → vấn đề phát hiện khi thử → yêu cầu sửa → kết quả kiểm tra lại.

## 11. Bảng kiểm thử

Xem `docs/bang-kiem-thu.md` (15 ca thủ công + bộ kiểm thử tự động trong `tests/`).

## 12. Hồ sơ bàn giao

- Source ZIP chứa mã nguồn và README này; không có khoá bí mật.
- Video tối đa 2 phút thể hiện thao tác thực tế và đủ 5 tính năng.
- Dữ liệu demo: bấm **"Điền dữ liệu mẫu"** trong app (mỗi mẫu có dữ liệu riêng).
- Bản nộp trước hạn là căn cứ chấm; không sửa tính năng sau hạn nộp.
