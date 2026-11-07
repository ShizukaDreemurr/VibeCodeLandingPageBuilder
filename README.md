# Xclipse — Tạo landing page sự kiện trong 5 phút

> Cuộc thi VIBE-CODING 2026 · Bảng B – Kinh tế · Đề số 8

Marketer tổ chức workshop, hội thảo hay khai trương thường phải chờ designer làm landing page, rồi tự gom danh sách đăng ký bằng tay. **Xclipse** cho phép nhập thông tin sự kiện, để AI viết nội dung, chọn mẫu theo ngành và có ngay trang đăng ký hoàn chỉnh. Trang xuất bản bằng link hoặc QR, số người đăng ký cập nhật tức thì, danh sách khách gom về một nơi để sale chăm sóc.

> **Bản demo vòng loại - Dữ liệu mô phỏng AI**: khi dùng chế độ AI mô phỏng (offline), nội dung do công thức sinh ra, không phải kết quả từ mô hình AI thật.

## 1. Thông tin bài nộp

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | Xclipse |
| Bảng thi | Bảng B - Kinh tế |
| Đề bài | Đề số 8 — Tạo landing page sự kiện trong 5 phút |
| Demo trực tuyến | https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/ |
| Video demo (≤ 2 phút) | `<URL – nhóm điền trước hạn nộp>` |
| Source ZIP | `<URL – nhóm điền, quyền truy cập: ai có link đều xem được>` |
| Minh chứng dùng AI | `docs/minh-chung-ai.md` (kèm ảnh chụp chọn lọc) |
| Bảng kiểm thử | `docs/bang-kiem-thu.md` |

Tiêu chí vòng loại: https://vibecoding.info.vn/tieu-chi-cham-thi

## 2. Năm tính năng theo đề

1. **Form nhập thông tin sự kiện**: tên, thời gian, địa điểm, diễn giả, ưu đãi đăng ký sớm (agenda, số chỗ, hạn ưu đãi). Kiểm tra lỗi từng ô, báo lỗi ngay dưới ô nhập.
2. **AI sinh headline, mô tả và 03 lợi ích** với 3 chế độ: AI mô phỏng (offline), **Gemini API thật** (người dùng tự nhập key) hoặc **copy prompt** sang Claude / ChatGPT / Gemini rồi dán kết quả JSON về. AI chỉ viết chữ; ngày giờ, địa điểm, diễn giả luôn lấy từ form.
3. **Dựng landing page hoàn chỉnh**: hero, đếm ngược đến giờ G, giới thiệu, lợi ích, diễn giả, agenda, ưu đãi, form đăng ký. Sự kiện đã qua hiển thị "Sự kiện đã diễn ra" và không đếm số âm.
4. **Form đăng ký và số người đăng ký theo thời gian thực**: lưu trên trình duyệt (localStorage) khi chưa xuất bản; khi xuất bản dùng Cloud Firestore, số đếm cập nhật ngay trên mọi thiết bị. Quy tắc: trùng SĐT/email chỉ ghi nhận 1 lần, hết chỗ thì vào danh sách chờ, hết hạn ưu đãi tự ẩn, sự kiện đã diễn ra thì ẩn form.
5. **Tạo trang mới và quản lý nhiều sự kiện**: nút "Tạo trang mới" để làm sự kiện khác; trang cũ vẫn nằm trong "Sự kiện của tôi" (mở lại, nhân bản, xoá).

## 3. Tính năng mở rộng

- **Giao diện theo phong cách Lucian** (xem mục 9) với chế độ **sáng / tối**.
- **Thư viện 172 mẫu** lọc theo ngành, loại sự kiện và mục đích (công nghệ, giáo dục, F&B, bất động sản, thiệp cưới, thôi nôi, mừng thọ…), có xem trước và chế độ xem dạng **Reels**. Đổi mẫu giữ nguyên nội dung. Mẫu **Mộc Coffee** dùng ảnh thật (`assets/demo/moc-*.webp`).
- **Builder theo section**: đổi thứ tự, ẩn/hiện (phần bắt buộc bị khoá), sửa chữ trực tiếp trên trang, chỉnh màu/font/nút.
- **Thư viện media**: tải, cắt và nén ảnh bìa, ảnh diễn giả, album; tự nén theo ngân sách dung lượng.
- **Brand DNA bằng Gemini từ tài liệu**: tải PDF, TXT, MD hoặc ảnh guideline, Gemini đọc và tạo bộ nhận diện (màu, font, giọng văn); người dùng xem lại trước khi lưu.
- **SEO và chia sẻ**: thẻ title, description, Open Graph, JSON-LD Event; mỗi trang xuất bản có **trang tĩnh chia sẻ `s/<id>/`** (meta sẵn trong HTML để Facebook/Zalo đọc được), kèm sitemap và checklist SEO.
- **Danh sách đăng ký cho sale**: trạng thái chăm sóc (Mới / Đã liên hệ / Chốt / Huỷ), nút Gọi / Zalo, xuất CSV mở bằng Excel.
- **Bảng số liệu và biểu đồ**: đăng ký theo ngày, khung giờ, trạng thái, nguồn; phễu lượt xem → bấm đăng ký; tất cả là SVG tự vẽ, không thư viện biểu đồ ngoài.
- **Tuỳ chọn Google Sheet**: ghi mỗi lượt đăng ký vào Sheet của ban tổ chức qua Apps Script (`integrations/google-sheet/Code.gs`).

## 4. Công nghệ

| Lớp | Công nghệ |
|---|---|
| Giao diện | HTML / CSS / JS thuần, không framework, không cần bước build |
| Thư viện | Firebase JS SDK (compat: app, auth, firestore), qrcode-generator — đóng gói trong `vendor/`; font Be Vietnam Pro, Playfair Display (Google Fonts) |
| Lưu trữ | localStorage (mặc định); Cloud Firestore khi xuất bản; Google Sheet (tuỳ chọn) |
| Đăng nhập | Firebase Authentication bằng Google, chỉ dùng cho chủ sự kiện khi xuất bản |
| AI | Gemini API (người dùng nhập key), copy prompt, AI mô phỏng |
| Kiểm thử | Playwright (Chromium) trong `tests/`; quy tắc Firestore trong `firebase/rules.test.mjs` |
| Triển khai | GitHub Pages |

## 5. Tích hợp AI

- **Gemini**: mặc định `gemini-3.5-flash-lite`, có thể chọn model khác; khi model lỗi hoặc hết lượt thì chuyển sang model nhanh miễn phí. Key do người dùng nhập, **chỉ lưu trong trình duyệt của họ** (localStorage), hiển thị dạng ẩn, **không có key nào trong mã nguồn**. Key được gửi trực tiếp từ trình duyệt tới Google, không qua máy chủ của nhóm.
- **Tạo ảnh bằng AI** (Thư viện ảnh → tab "Tạo bằng AI"): Gemini ảnh gốc (Nano Banana) hoặc Imagen, dùng chính key Gemini của người dùng. Model tạo ảnh **cần bật thanh toán (billing)**, key miễn phí sẽ báo lỗi 429 "limit: 0". Ảnh AI lưu riêng ở tab "Ảnh AI", có nhãn "AI" và nhắc ghi "Ảnh minh hoạ tạo bằng AI". Danh sách model: `docs/gemini-models.md`.
- **Copy prompt**: prompt chuẩn được sao chép sẵn; người dùng dán JSON kết quả về app.
- **AI mô phỏng**: nội dung ghép từ công thức copywriting theo giọng văn (trang trọng / trẻ trung / gấp rút). Giao diện hiển thị cảnh báo mô phỏng; checklist xuất bản nhắc đọc lại nếu còn nội dung mô phỏng.
- **Kiểm soát đầu ra AI**: tách JSON khỏi lời dẫn và markdown, sửa lỗi JSON thường gặp, kiểm tra đủ trường và độ dài; thiếu trường thì bù bằng bản mô phỏng và báo rõ. Prompt cấm AI bịa ngày giờ, địa điểm, giá, tên người.

## 6. Chạy trực tuyến và chạy cục bộ

**Trực tuyến**: https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/

**Chạy cục bộ**: yêu cầu trình duyệt hiện đại.

1. Giải nén Source ZIP (hoặc `git clone` repo).
2. Cách nhanh nhất: mở trực tiếp `index.html` trên trình duyệt. Tạo trang, AI mô phỏng, copy prompt và đăng ký lưu localStorage đều chạy được.
3. Để dùng đăng nhập Google và xuất bản: chạy server tĩnh ở thư mục gốc rồi mở địa chỉ đó, ví dụ `python3 -m http.server 8000` → http://localhost:8000 hoặc `npx serve .`.
4. Cấu hình Firebase mẫu nằm trong `js/firebase-config.js` (xem mục 7). Gemini: vào phần AI trong app và nhập key của riêng bạn.

Chạy kiểm thử tự động: xem `tests/README.md` và `firebase/README.md`.

## 7. Lưu ý về khoá và cấu hình

- `js/firebase-config.js` chứa **cấu hình Firebase Web** (apiKey, projectId, appId…). Đây là cấu hình công khai theo thiết kế của Firebase, **không phải bí mật**; việc truy cập dữ liệu được quyết định bởi quy tắc bảo mật `firebase/firestore.rules` và Firebase Authentication.
- **Khoá Gemini không nằm trong mã nguồn**: người dùng tự nhập và chỉ lưu trong trình duyệt của họ.
- Source ZIP không chứa mật khẩu, token hay khoá bí mật.

## 8. Cấu trúc thư mục

```text
VibeCodeLandingPageBuilder/
├── index.html               # khung ứng dụng
├── css/                     # tokens.css (màu, sáng/tối), app.css (công cụ), landing.css (trang sự kiện)
├── js/
│   ├── app.js               # điều phối giao diện
│   ├── templates.js, templates-data.js  # thư viện mẫu (sinh từ tools/templates.json)
│   ├── content-generator.js # AI mô phỏng
│   ├── ai-service.js        # Gemini, copy prompt, đọc kết quả AI
│   ├── ai-image.js          # Tạo ảnh Gemini/Imagen (EP.aiImage)
│   ├── brand-ai.js          # Brand DNA từ tài liệu bằng Gemini
│   ├── media-library.js     # thư viện media
│   ├── charts.js            # biểu đồ SVG
│   ├── landing-renderer.js  # dựng landing page
│   ├── cloud.js             # Firebase: xuất bản, đăng ký dùng chung, đo phễu
│   ├── sheet-sync.js        # Google Sheet (tuỳ chọn)
│   └── firebase-config.js   # cấu hình Firebase Web (công khai)
├── s/                       # trang tĩnh chia sẻ theo sự kiện (s/<id>/)
├── tools/                   # script sinh mẫu, ảnh, trang chia sẻ
├── firebase/                # quy tắc Firestore + kiểm thử
├── integrations/google-sheet/Code.gs
├── vendor/                  # thư viện bên thứ ba đóng gói sẵn
├── tests/                   # kiểm thử tự động (Playwright)
└── docs/                    # tiêu chí, kiểm thử, minh chứng AI, checklist nộp bài
```

## 9. Truy cập và phân quyền

- Người tạo trang **không cần đăng nhập** khi làm việc trên trình duyệt.
- Xuất bản và xem danh sách đăng ký trên đám mây cần đăng nhập Google; chỉ tài khoản đã xuất bản trang mới đọc, sửa trạng thái chăm sóc hoặc xoá danh sách.
- Khách tham dự chỉ **gửi** đăng ký, không đọc được danh sách; số đếm công khai không kèm thông tin cá nhân.

## 10. Giới hạn hiện tại

- Chế độ localStorage: dữ liệu chỉ nằm trên trình duyệt hiện tại; xoá dữ liệu trình duyệt hoặc đổi thiết bị sẽ mất. Dùng chung nhiều thiết bị cần xuất bản (cần mạng).
- Ảnh lưu kèm dữ liệu sự kiện có giới hạn dung lượng (khoảng 900KB mỗi sự kiện).
- Số lượt xem và lượt bấm là số liệu công khai, có thể bị cộng khống; chỉ dùng tham khảo.
- AI mô phỏng không phải kết quả AI thật. Gemini cần người dùng tự có key.
- Google Sheet là tuỳ chọn; số đếm qua Sheet cập nhật khoảng 15 giây mỗi lần.
- Chưa kiểm chứng gọi Gemini API thật và Apps Script thật trong môi trường phát triển.

## 11. Nguồn tham khảo và khai báo sử dụng

- **Lucian Lab** — bố cục và design token giao diện chuyển thể từ Lucian UX/UI Prompt gallery, giấy phép **MIT © 2026 Seokwoooo** (ghi chú trong `index.html` và `css/tokens.css`).
- **Ảnh demo** (ví dụ mẫu Mộc Coffee trong `assets/demo/`): tạo bằng **Gemini**, dùng làm dữ liệu minh hoạ.
- **Gemini API** (Google): tạo nội dung và Brand DNA khi người dùng nhập key.
- **Firebase** (Authentication, Cloud Firestore; Firebase JS SDK, Apache-2.0).
- **Playwright** — kiểm thử tự động trình duyệt thật (`tests/`).
- Google Fonts (Be Vietnam Pro, Playfair Display); qrcode-generator (MIT).
- Công cụ AI đã dùng để xây dựng: xem `docs/minh-chung-ai.md`.
- Nghiên cứu nhóm: `docs/research-gemini.md`, `docs/tam-sam-som.md`, `docs/nghien-cuu-pheu-thiep-cuoi.md`.

## 12. Minh chứng và kiểm thử

- Minh chứng dùng AI (≤ 1 trang, ảnh chọn lọc): `docs/minh-chung-ai.md`.
- Bảng kiểm thử Bảng B (≥ 3 ca bắt buộc đánh dấu ở đầu file, có cột kết quả thực tế): `docs/bang-kiem-thu.md`.

## 13. Bàn giao

- Source ZIP chứa mã nguồn và README này; không có khoá bí mật.
- Video tối đa 2 phút thể hiện thao tác thực tế và đủ 5 tính năng.
- Dữ liệu demo: bấm **"Điền dữ liệu mẫu"** trong app.
- Bản nộp trước 23:59 ngày 09/11/2026 là căn cứ chấm.
