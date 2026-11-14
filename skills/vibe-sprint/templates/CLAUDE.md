# Hướng dẫn cho Claude: <Tên sản phẩm>

Dự án thi sprint 60 phút. Tài liệu nằm trong `docs/`: `spec-nhanh.md` (phạm vi), `PROGRESS.md` (run-sheet), `DECISIONS.md` (quyết định), `BANG-KIEM-THU.md`, `MINH-CHUNG-AI.md`, `KICH-BAN-DEMO.md`, `HOI-DAP.md`, `CHECKLIST-CHUNG-KET.md`.

## Đầu mỗi phiên
1. Đọc `docs/PROGRESS.md`. Nếu có mục "Việc cần làm" còn ô chưa tick, nhắc đội ngay, kèm cách làm ngắn.
2. Đọc `docs/spec-nhanh.md` trước khi viết mã. Không làm tính năng nằm ngoài danh sách.

## Quy tắc sản phẩm
- **Giao diện tiếng Việt có dấu.** Mã nguồn, tên biến, tên file bằng tiếng Anh.
- **Phạm vi:** chỉ làm đúng 5 tính năng của đề. Thêm tính năng khác chỉ khi đội đồng ý và ghi thành `Dxx` trong `DECISIONS.md`.
- **Luồng chính chạy trọn trước khi làm đẹp.** Nhập → AI (hoặc mô phỏng) → kết quả → lưu → xem lại.
- **Dữ liệu mẫu:** có nút "<Điền dữ liệu mẫu>" để demo và kiểm thử lặp lại được.
- **Ngày, giờ, địa điểm, giá, tên người:** luôn lấy từ form, không để AI viết.
- **Giờ hiển thị:** `Asia/Ho_Chi_Minh`.

## Mô phỏng và AI
- AI chỉ gọi từ `<js/ai-service.js | lib/ai/client.ts>` (một chỗ duy nhất). Prompt đặt ở một file riêng.
- Kết quả AI luôn qua bước kiểm tra cấu trúc (đủ trường, đúng kiểu). Thiếu thì bù bằng bản mô phỏng và báo rõ cho người dùng.
- Luôn có chế độ mô phỏng. Khi đang dùng mô phỏng, giao diện hiện nhãn: `<câu nhãn đúng nguyên văn đề>`.
- Không được ghi "AI thật" trong README, video hay bảng kiểm thử khi thực tế đang chạy mô phỏng.

## Bảo mật
- **Không bao giờ** đưa API key, mật khẩu hay token vào mã nguồn, README, commit, ảnh chụp hay khung chat.
- Key nằm trong `.env.local` (đã có trong `.gitignore`) hoặc do người dùng nhập ô riêng trên app, lưu trong trình duyệt của họ.
- `.env.example` chỉ có tên biến, không có giá trị.
- Trước khi commit, chạy `node scripts/scan-secrets.mjs . .env.local` (nếu có file env) hoặc `node scripts/scan-secrets.mjs .`. Nếu bị flag, dừng lại và báo đội.
- Không đưa secret ra phía client. Route hoặc hàm có dữ liệu cá nhân phải kiểm tra đăng nhập và quyền.

## Quy trình mỗi bước
1. Kế hoạch ≤ 10 dòng, nêu rõ file sẽ sửa.
2. Làm thay đổi nhỏ nhất đủ để tính năng chạy.
3. Chạy `<lệnh test>` (và `<lệnh lint>` nếu có). Không commit khi test đỏ.
4. Báo 4 mục: **đã xong · còn mô phỏng · cách chạy thử · cách xem bằng mắt**.
5. Commit và push (xem "Git và triển khai").

## Phiên bản
- Mỗi lần push lên nhánh nộp: tăng số phiên bản trong `<js/version.js>` và chạy `<node tools/bump-version.cjs>` nếu dự án có. Nếu không có cơ chế này, ghi phiên bản vào tiêu đề README.

## Kiểm thử
- Kiểm thử luồng chính bằng `<lệnh test>` trước mỗi lần push.
- Cập nhật `docs/BANG-KIEM-THU.md` khi kết quả thay đổi. Chỉ ghi kết quả đã chạy thật.

## Git và triển khai
- Làm việc trên nhánh `<tên nhánh>`. Không push thẳng `main` khi chưa có sự đồng ý của đội.
- Commit nhỏ, thông điệp tiếng Việt hoặc tiếng Anh ngắn, mô tả việc đã làm.
- Push: `git push -u origin <tên nhánh>`.
- GitHub Pages: vào **Settings → Pages**, chọn Source là nhánh `<tên nhánh>` và thư mục `/ (root)`. Sau khi push, chờ 1–2 phút rồi mở link ở cửa sổ ẩn danh để chắc là bản mới nhất.
- Không đưa gói ZIP nộp bài vào repo. Tạo gói ZIP khi đội đồng ý.

## Môi trường
- Chạy local: `<lệnh chạy>` (cổng `<8000>`).
- Kiểm thử: `<lệnh test>`.
- Link Pages: `<URL>`.
