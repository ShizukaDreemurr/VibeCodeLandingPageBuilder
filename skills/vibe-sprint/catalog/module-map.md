# Ma trận module: năng lực lặp lại giữa 10 đề vòng 1

Đọc cùng `de-bai-vong-1.md`. Đề số = đề trong mục đó.

**Lưu ý về nguồn module:** các đường dẫn `starter/js/form.js`, `ai.js`, `charts.js`, `export.js`, `features/_example` KHÔNG tồn tại trong repo này (đã kiểm tra nhánh hiện tại). Bảng dưới ánh xạ tới các file thật trong `js/` của repo `VibeCodeLandingPageBuilder`. Nếu team có bộ starter riêng ngoài repo, cần đối chiếu lại cột "Module hiện có".

Ký hiệu: ✔ = đề yêu cầu trực tiếp; ◐ = có thể dùng đến / phụ.

## 1. Ma trận năng lực

| # | Năng lực | Đề | Module hiện có trong repo | Còn thiếu | Module nên thêm |
|---|---|---|---|---|---|
| 1 | Form + validation | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `js/validators.js` (tên, email, SĐT VN, trùng lặp qua `registrations.js`) | Validator theo schema chung (số, khoảng, enum/select, URL, ngày/giờ); khóa nút chống bấm 2 lần chung cho mọi form; thông báo lỗi dưới từng ô | `form-schema.js` |
| 2 | List / CRUD có localStorage | 2, 3, 4, 5, 7, 8, 9 | `js/storage.js` (wrapper localStorage, có chỗ đổi sang cloud), `js/registrations.js` (CRUD theo sự kiện) | Wrapper CRUD tổng quát (id, createdAt, xóa theo id, giới hạn số bản ghi); bảng có nút xóa dùng lại được | `collection-store.js` |
| 3 | AI text generation | 1, 2, 3, 4, 5, 6, 8, 9, 10 | `js/ai-service.js` (gọi Gemini, kiểm soát đầu ra), `js/content-generator.js` (mô phỏng offline, theo công thức copy) | Gọi AI trả JSON theo schema + thử lại khi sai số lượng + chuyển sang mock tự động; nhãn "AI thật / mock" hiển thị chung; mock theo từng loại đầu ra không chỉ copywriting | `ai-json.js` + `mock-ai.js` |
| 4 | AI classification / analysis | 1 (chọn gói), 4 (khớp ý định), 5 (nhận xét điểm mạnh/yếu), 7 (xu hướng), 10 (đánh giá tên) | Không có. `ai-service.js` có phần soạn prompt nhưng chưa có khuôn phân tích | Khuôn prompt phân tích kèm dữ liệu đã tính sẵn (AI không tự tính số); phân loại có nhãn cố định | (gộp vào `ai-json.js`, thêm `prompt-templates.js`) |
| 5 | Dashboard / biểu đồ | 7 (chính), 5 (thanh điểm, tùy chọn) | `js/charts.js` (line, bar, donut, horizontal bars bằng SVG, không cần thư viện, có bảng số thay thế) | Đã đủ cho biểu đồ đường/cột; thiếu thẻ KPI (CTR, CPC…) và bộ tính chỉ số an toàn chia 0 | `metrics.js` |
| 6 | Lịch / lên lịch | 4 (chọn ngày giờ, không trùng), 8 (thời gian sự kiện, đếm ngược), 6 (gợi ý giờ gửi) | `js/event-status.js` (trạng thái đã diễn ra/sắp diễn ra), `validators.js` (kiểm tra thời gian) | Bộ sinh khung giờ; kiểm tra trùng lịch; so sánh múi giờ | `timeslot.js` |
| 7 | Export CSV / PDF / text | Text copy: 2, 5, 6, 7, 9, 10. CSV: 8 (danh sách đăng ký, dùng được). PDF: không đề nào yêu cầu | `js/app.js` có `exportCsv()` (BOM UTF-8, lọc theo bảng quản trị, đã có ở Đề 8); `js/brand-ai.js` có chữ PDF (không phải export) | Hàm copy clipboard dùng lại được (có fallback khi không có Clipboard API); bộ dựng báo cáo text; CSV tách khỏi `app.js` để dùng cho các đề khác | `export.js` (copy + text + CSV) |
| 8 | Chatbot UI | 4 (chính) | Không có. `ai-service.js` nhắc tới "chat" chỉ ở mức đường dẫn mở ChatGPT | Bong bóng chat, gợi ý nhanh (quick reply), chuyển sang form khi không trả lời được | `chatbot-ui.js` |
| 9 | Landing / trang xem trước | 8 (chính), 6 (khung preview email) | `js/landing-renderer.js`, `js/templates.js`, `js/templates-data.js`, `js/page-style.js`, `js/tpl-gallery.js`, `js/seo.js` (SEO khi xuất HTML) | Khung xem trước có chuyển desktop/mobile dùng chung; khung "hộp thư" cho email (Đề 6) | `preview-frame.js` |
| 10 | Đăng ký + bộ đếm | 8 (chính), 1 (lưu khách tư vấn), 3 (lưu người chơi), 4 (lưu lịch hẹn) | `js/registrations.js` (chống trùng SĐT/email, hết chỗ → chờ, sự kiện đã qua → không nhận), `js/sheet-sync.js` (đồng bộ Google Sheet, đếm chung) | Dùng cho lead không gắn sự kiện (Đề 1, 3, 4); đếm công khai không cần Sheet | `lead-list.js` (có thể gộp vào `collection-store.js`) |
| 11 | Tìm kiếm / lọc | 4 (khớp FAQ), 2 và 9 (lọc lịch sử/shortlist, không bắt buộc) | Không có riêng. `js/popup.js`, `js/workspace.js` có chữ "filter" nhưng là giao diện của app, không dùng lại được | Khớp từ khóa tiếng Việt có bỏ dấu; xếp hạng điểm khớp đơn giản | `faq-match.js` |
| 12 | Chấm điểm / quiz / xếp hạng | 3 (timer 30s, điểm theo tốc độ, top 10), 5 (điểm /100 có trọng số) | Không có | Bộ đếm ngược theo câu có tự chuyển; công thức điểm (đúng + tốc độ); bảng xếp hạng có xử lý điểm bằng nhau; checklist có trọng số | `quiz-engine.js`, `score-checklist.js` |
| 13 | Ngân sách / tính toán | 7 (CTR, CPC, CPA), 9 (3 mức ngân sách), 1 (lọc theo ngân sách), 5 (trọng số) | `js/validators.js` có số, chưa có tính toán | Hàm tiền VND (định dạng, làm tròn); hàm chia an toàn; bảng khoảng ngân sách | `metrics.js` (dùng chung với Đề 7) |
| 14 | SEO checker / kiểm tra trang | 5 (chính) | `js/seo.js` là SEO cho trang của chính app, không phải công cụ kiểm tra URL ngoài | Phân tích HTML dán vào bằng `DOMParser` (title, meta description, viewport, favicon, h1); cảnh báo CORS và cách xử lý | `page-audit.js` |
| 15 | Upload ảnh | Không đề nào yêu cầu | `js/images.js`, `js/media-library.js`, `js/image-editor.js`, `js/ai-image.js` (có sẵn, không cần cho vòng 1) | Không cần thêm | (bỏ qua) |

Năng lực xuyên suốt (không nằm trong 15 mục trên nhưng đề nào cũng cần):
- **Nhãn AI / demo:** mọi kết quả mock phải ghi "mock" hoặc "kết quả demo"; đề 10 bắt buộc.
- **Dữ liệu localStorage an toàn:** try/catch quanh đọc/ghi (có thể bị chặn ở chế độ riêng tư); ghi giới hạn trong README.
- **Mobile 16px và không cuộn ngang:** Bảng A 5 điểm, Bảng B 10 điểm cho giao diện.
- **Escape nội dung người dùng:** dùng `textContent`, không chèn HTML thô (repo đã làm ở `landing-renderer.js`).

## 2. Module còn thiếu, theo mức ưu tiên

Ưu tiên cao (dùng cho ≥5 đề):
1. `form-schema.js`: khai báo trường (text/number/select/range/email/tel/url/date), kiểm tra, hiện lỗi, khóa bấm đôi. Dùng ở 1–10.
2. `ai-json.js`: gọi AI (hoặc mock), parse JSON, kiểm tra số lượng/khóa, thử lại 1 lần, rơi về mock và gắn nhãn. Dùng ở 1, 2, 3, 4, 5, 6, 8, 9, 10.
3. `collection-store.js`: CRUD có id, xóa theo id, giới hạn số bản ghi, bọc localStorage. Dùng ở 2, 3, 4, 5, 7, 8, 9.
4. `mock-ai.js`: bộ mock tất định (cùng input → cùng output) cho từng loại đầu ra, có nhãn. Cần để chạy offline khi API lỗi.
5. `metrics.js`: chia an toàn, CTR/CPC/CPA, VND, xu hướng tăng/giảm. Dùng ở 3, 5, 7, 9.

Ưu tiên trung bình:
6. `quiz-engine.js`: timer mỗi câu, tự chuyển khi hết giờ (tính sai), điểm theo đúng + tốc độ, top N. Dùng ở 3.
7. `export.js`: copy clipboard có fallback, dựng báo cáo text, CSV có BOM. Dùng ở 2, 5, 6, 7, 8, 9, 10.
8. `faq-match.js`: chuẩn hóa tiếng Việt (bỏ dấu, chữ thường), khớp theo từ khóa, trả về "không biết" khi điểm thấp. Dùng ở 4 (và 1 cho FAQ).
9. `chatbot-ui.js`: bong bóng chat, quick reply, chuyển sang form đặt lịch. Dùng ở 4.
10. `score-checklist.js`: checklist có trọng số → điểm /100 và danh sách đạt/chưa đạt. Dùng ở 5.

Ưu tiên thấp:
11. `preview-frame.js`: khung xem trước desktop/mobile, khung hộp thư cho email. Dùng ở 6, 8.
12. `timeslot.js`: sinh khung giờ, kiểm tra trùng. Dùng ở 4, có thể 8.
13. `page-audit.js`: phân tích HTML dán vào (DOMParser) cho đề 5; không fetch URL ngoài vì CORS.

## 3. Gợi ý thứ tự xây sẵn (nếu còn thời gian chuẩn bị)

1. `form-schema.js` + `collection-store.js` (nền cho hầu hết đề).
2. `ai-json.js` + `mock-ai.js` (để mọi đề có đường chạy khi không có API).
3. `metrics.js` + `export.js` (rẻ, dùng được nhiều).
4. `quiz-engine.js`, `chatbot-ui.js`, `faq-match.js`, `score-checklist.js` (cần cho các đề đặc thù).

Không cần xây trước: `preview-frame.js`, `timeslot.js`, `page-audit.js` (chỉ xây khi bốc đúng đề đó).
