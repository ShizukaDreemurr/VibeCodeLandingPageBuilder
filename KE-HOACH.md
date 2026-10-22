# Kế hoạch — Landing Page Sự Kiện trong 5 phút (Đề 8, VIBE-CODING 2026)

> Trạng thái: **đã chốt kế hoạch, chưa code.** Cập nhật: 2026-10-22.

## 0. Khách hàng mục tiêu (chốt với cô)
- **Marketer chuyên tổ chức sự kiện.** Cần nghiên cứu: độ tuổi, gu thẩm mỹ, thói quen dùng công cụ → làm căn cứ chọn giao diện, template, phong cách, phông chữ.

## 1. Yêu cầu bắt buộc của đề
1. Form nhập: tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi đăng ký sớm.
2. AI sinh headline, đoạn mô tả, 3 bullet lợi ích.
3. Render landing page: hero, đếm ngược giờ G, agenda, form đăng ký.
4. Form đăng ký lưu localStorage + hiển thị số người đã đăng ký theo thời gian thực.
5. Nút "Tạo trang mới".

## 2. Kiến trúc
- **Page = JSON**: `template + dữ liệu form + nội dung (offline/AI) → engine render`.
- Thông tin cần chính xác (ngày giờ, địa điểm, diễn giả) **luôn lấy từ form**, AI chỉ viết phần chữ.
- Web tĩnh HTML/CSS/JS, không cần build, không cần server.

## 3. Cấu trúc trang (9 section + tuỳ chọn)
Hero → Countdown → Mô tả → 3 lợi ích → Diễn giả → Agenda → Ưu đãi early-bird → Form đăng ký (kèm số đăng ký realtime) → Footer.
Tuỳ chọn: FAQ, Testimonial, Nhà tài trợ, Bản đồ, Last-call.

## 4. Thư viện template
- 3 bộ lọc: **Ngành nghề / Loại sự kiện / Mục đích**.
- Template = JSON gắn thẻ (`tags`, `theme`, `sections`, `copyTone`, `sample`, `thumbnail`), không làm ma trận tổ hợp.
- 6–8 template thật; không khớp đủ thì gợi ý mẫu gần nhất ("Phù hợp 2/3").
- "Gợi ý cho tôi" (3 câu hỏi), xem trước, "Dùng mẫu này", "Đổi template" giữ nguyên nội dung.

## 5. Builder — **CHỐT: builder theo section** (không kéo thả tự do)
Lý do: đúng mục tiêu "5 phút" cho người không biết thiết kế, trang luôn đẹp và chuẩn mobile, khớp kiến trúc JSON/template/AI, ít lỗi, kịp tiến độ.
- Panel trái: kéo thả đổi thứ tự section, bật/tắt, "+ Thêm section".
- Sửa chữ trực tiếp trên trang + nút "✨ AI viết lại" từng đoạn.
- Panel phải: bảng màu, cặp font, bo góc, ảnh hero, chữ nút CTA.
- Xem trước Desktop / Tablet / Mobile.
- Undo/Redo, tự lưu localStorage, xuất file HTML.

## 6. Module "Tạo bằng AI"
Luồng: chọn nền tảng + mô hình → app soạn **prompt chuẩn** (dữ liệu form + schema JSON + giọng văn template) → **copy prompt + mở tab** nền tảng → người dùng dán JSON kết quả vào app → app kiểm tra & render.

| Nền tảng | Cách mở |
|---|---|
| Claude | copy + mở claude.ai |
| ChatGPT (Agent) | copy + mở chatgpt.com |
| Gemini | copy + mở gemini.google.com, hoặc dán API key gọi trực tiếp |
| Manus | copy + mở manus.im |
| API key (tuỳ chọn) | gọi trực tiếp, key chỉ lưu localStorage |
| Offline | bộ sinh nội dung bằng template, luôn chạy |

**Đã bỏ Gemini Spark** (chưa có ở Việt Nam, ít phổ biến). Cách chính đã chốt: **phương án dự phòng copy prompt + mở tab**.
Cô nhận định: với ChatGPT và Gemini, copy prompt rồi yêu cầu tạo landing page là dễ, không bị khoá gì.

Gợi ý mô hình theo nhu cầu (nhanh/rẻ — viết hay — agent), cấu hình trong `ai-providers.js`.

Bộ đọc kết quả chịu lỗi: tách JSON khỏi văn bản thừa/code fence, sửa lỗi JSON phổ biến, kiểm tra schema, thiếu trường thì bù bằng bộ sinh offline, báo lỗi kèm "Copy prompt sửa lỗi".

Nâng cao (để sau): một remote MCP server dùng chung cho Claude/ChatGPT/Manus (cơ chế giống LadiPage) — cần hosting.

## 7. Hiệu ứng UX/UI
Countdown mượt, số đăng ký nhảy số, pop-up, scroll reveal, hover, toast, loading/validate.

## 8. Design system
Bảng màu cố định theo template (gợi ý hồng pastel + navy), font **Be Vietnam Pro (đã chốt — hỗ trợ tiếng Việt tốt, không lỗi phông)**, icon SVG một phong cách, chuẩn bo góc/spacing/shadow. Dữ liệu bảng màu/font sẽ bổ sung từ kết quả research Gemini (kiểm tra lại độ tương phản WCAG AA).

## 9. Lộ trình
0. **Viết kịch bản chi tiết** (giao diện, nội dung từng section, tính năng, hiệu ứng) → gửi cô sửa → dùng kịch bản đã duyệt + dữ liệu research để code. Làm xong phần nào gói gọn phần đó.
1. Dựng khung tĩnh 9 section.
2. Tách theme + section theo cấu hình → 1 template chuẩn.
3. Form nhập + binding dữ liệu.
4. Bộ sinh nội dung offline.
5. localStorage + số đăng ký realtime + "Tạo trang mới".
6. Thư viện template + bộ lọc (6–8 mẫu).
7. Module AI đa nền tảng + bộ đọc JSON → test với Claude/ChatGPT/Gemini/Manus.
8. Builder theo section.
9. Hiệu ứng UX/UI, responsive, xuất HTML.
10. (Nâng cao) MCP server, Google Sheet, deploy GitHub Pages.

## 10. Cần hỗ trợ từ nhóm
- Chạy thử prompt AI trên các nền tảng và gửi lại kết quả.
- Kết quả research Gemini (báo cáo + JSON): các loại sự kiện, yêu cầu từng loại, chân dung marketer sự kiện.
- Cô duyệt kịch bản chi tiết.
- Bật GitHub Pages khi deploy; hosting nếu làm MCP server.
