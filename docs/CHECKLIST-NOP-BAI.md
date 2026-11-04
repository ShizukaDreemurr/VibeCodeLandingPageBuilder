# Checklist nộp bài — Xclipse (Đề 8, Bảng B – Kinh tế)

Hạn nộp: **23:59 ngày 09/11/2026** tại https://vibecoding.info.vn/nop-bai

Ký hiệu: ✅ đã xong trong repo · ⬜ còn phải làm (nhóm)

## Bước 1 — Kiểm tra repo (đã xong)

- ✅ Xoá thư mục `undefined/` (ảnh chụp thử) và thêm vào `.gitignore`.
- ✅ README cập nhật theo sản phẩm hiện tại, 5 tính năng của đề đứng đầu, có mục Nguồn tham khảo/khai báo, link demo và cách chạy local.
- ✅ Ghi chú: `js/firebase-config.js` là cấu hình Firebase Web (công khai theo thiết kế, bảo vệ bằng `firebase/firestore.rules`); khoá Gemini do người dùng nhập, không lưu trong mã nguồn.
- ✅ `docs/minh-chung-ai.md` khoảng 450 từ, 5 vị trí ảnh.
- ✅ `docs/bang-kiem-thu.md`: 15 ca, có 3 nhóm ca bắt buộc (bình thường / nhập thiếu-sai / biên) và cột "Kết quả thực tế".
- ✅ **Kiểm tra đúng số lượng mẫu**: README ghi 172 mẫu, khớp với thư viện trong app (`EP.templates.list.length` = 172: 165 mẫu trong `tools/templates.json` + mẫu dựng sẵn trong `js/templates.js` và Mộc Coffee).

## Bước 2 — Sửa trước khi nộp (cần làm)

- ✅ **Câu cảnh báo mô phỏng AI**: giao diện (`index.html`, `#mock-note`) và mọi thông báo mô phỏng trong `js/` đều dùng đúng câu `Bản demo vòng loại - Dữ liệu mô phỏng AI`.
- ⬜ Chạy lại `tests/e2e-local.cjs` và `firebase/rules.test.mjs` sau khi sửa để chắc kết quả trong `docs/bang-kiem-thu.md` còn đúng.
- ⬜ Dòng "Chưa kiểm chứng" trong bảng kiểm thử: nếu có Gemini key thật hoặc Apps Script thật thì thử và cập nhật kết quả; nếu không thì giữ nguyên ghi chú.

## Bước 3 — Video demo (≤ 2 phút)

- ⬜ Quay màn hình thao tác thật trên bản xuất bản GitHub Pages (không quay bản mock tĩnh).
- ⬜ Thể hiện đủ 5 tính năng: form nhập, AI sinh nội dung, render landing page, đăng ký + số đếm thời gian thực, tạo trang mới.
- ⬜ Thời lượng ≤ 2:00; kiểm tra lại trước khi tải lên.
- ⬜ Điền link video vào README (mục 1) và vào form nộp bài.

## Bước 4 — Source ZIP

- ⬜ Tạo file ZIP từ repo (không kèm `.git`, không kèm khoá bí mật; `.gitignore` đã loại `undefined/`).
- ⬜ Kiểm tra trong ZIP có `README.md` ở thư mục gốc.
- ⬜ Tải ZIP lên Google Drive (hoặc nơi lưu khác) và bật quyền **"Bất kỳ ai có liên kết đều xem được"**; mở link ở cửa sổ ẩn danh để chắc chắn truy cập được.
- ⬜ Điền link vào README (mục 1) và vào form nộp bài.

## Bước 5 — Minh chứng dùng AI

- ⬜ Chọn tối đa **5 ảnh** chụp hội thoại hoặc màn hình (ưu tiên: bảng màu WCAG, sửa JSON AI, đồng bộ Sheet, kiểm thử bảo mật Firestore, đăng nhập/xuất bản).
- ⬜ Thay các `[Ảnh x]` trong `docs/minh-chung-ai.md` bằng ảnh thật (hoặc đính kèm riêng khi nộp).
- ⬜ Đọc lại để đảm bảo ≤ 1 trang; ảnh không lộ key, email hay SĐT thật.

## Bước 6 — Bảng kiểm thử Bảng B

- ⬜ Chạy lại các ca TC01–TC15 và cập nhật cột "Kết quả thực tế" nếu có thay đổi.
- ⬜ Đảm bảo ít nhất 3 ca bắt buộc (bình thường, nhập thiếu/sai, biên) còn đạt.

## Bước 7 — Thông tin khai báo

- ⬜ Khai báo đầy đủ trên form nộp bài: AI đã dùng (Claude, Gemini, Firebase AI agent...), Lucian Lab UI elements (MIT © 2026 Seokwoooo), ảnh demo do Gemini tạo.
- ⬜ Mô tả AI thật và AI mô phỏng: nói rõ chế độ nào là Gemini API thật, chế độ nào là mô phỏng, và chế độ copy prompt.
- ⬜ Kiểm tra mục "Giới hạn hiện tại" trong README khớp với những gì sẽ trình bày khi chấm.

## Bước 8 — Đăng nhập cổng và nộp bài

- ⬜ Đăng nhập tài khoản của đội tại https://vibecoding.info.vn.
- ⬜ Chọn **Bảng B – Kinh tế** và **Đề số 8**.
- ⬜ Điền tên đội, link demo, link video, link Source ZIP, link minh chứng AI (nếu có mục riêng).
- ⬜ Xem lại toàn bộ thông tin, nộp trước 23:59 ngày 09/11/2026.
- ⬜ Lưu ảnh màn hình xác nhận đã nộp.

## Bước 9 — Sau khi nộp

- ⬜ Không sửa tính năng sau hạn nộp (theo thể lệ, bản nộp là căn cứ chấm).
- ⬜ Giữ nguyên tag/commit đã nộp để đối chiếu nếu cần.
