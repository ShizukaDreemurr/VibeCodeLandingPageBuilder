# Các model Google AI Studio / Gemini API (cập nhật 11/2026)

> **Độ tin cậy**: `ai.google.dev` không truy cập được từ môi trường soạn tài liệu này (lỗi DNS), nên bảng dưới được ghép từ kết quả tìm kiếm (trích trang models chính thức qua công cụ tìm kiếm, diễn đàn Google AI Developers, bài tổng hợp của bên thứ ba như aifreeapi.com, dev.to, vercel.com/ai-gateway, openrouter.ai) và từ danh sách model đã dùng trong `js/ai-service.js`. Mục nào ghi **(?)** là chưa xác minh trên trang chính thức; **hãy đối chiếu tại https://ai.google.dev/gemini-api/docs/models và /pricing trước khi dựa vào giá hay tên model.** Các bài bên thứ ba còn mâu thuẫn nhau (đặc biệt về gói miễn phí của model ảnh).

## Quy tắc quan trọng cho Xclipse

- **Model tạo ảnh và video không có gói miễn phí qua API**: key chỉ miễn phí sẽ nhận `429 RESOURCE_EXHAUSTED ... limit: 0`. Cần bật thanh toán (billing) cho dự án Google Cloud gắn với key. Xclipse dịch lỗi này thành "Model tạo ảnh cần bật thanh toán (billing) cho API key – gói miễn phí không hỗ trợ".
- Model văn bản dòng Flash / Flash-Lite có gói miễn phí giới hạn tốc độ; Pro thường cần billing.
- Tên `-preview` có thể đổi hoặc bị gỡ không báo trước; `gemini-2.5-flash-image` được nguồn thứ cấp cho biết dự kiến ngừng ngày 02/10/2026 (?). Xclipse tự thử model kế tiếp khi gặp 404.

## 1. Văn bản / đa phương thức

| Model ID | Vào | Ra | Gói miễn phí | Giá xấp xỉ (?) | Xclipse |
|---|---|---|---|---|---|
| `gemini-4-argon` (?) | văn bản, ảnh, âm thanh, video, PDF | văn bản | Không (?) | cao nhất dòng | Có trong danh sách AI viết nội dung (cần billing) |
| `gemini-3.1-pro-preview` | như trên | văn bản | Không | Pro, cao | Có (cần billing) |
| `gemini-pro-latest` | như trên | văn bản | Không | Pro | Có (alias) |
| `gemini-3.8-flash` (?) | như trên | văn bản | Có, giới hạn | Flash | Có (chậm 1–2 phút) |
| `gemini-3.6-flash` (?) | như trên | văn bản | Có | Flash | Có |
| `gemini-3-flash-preview` | như trên | văn bản | Có | Flash | Có |
| `gemini-flash-latest` | như trên | văn bản | Có | Flash | Có (alias) |
| `gemini-3.5-flash-lite` (?) | như trên | văn bản | Có | rẻ nhất | **Mặc định** viết nội dung và Brand DNA |
| `gemini-3.1-flash-lite` | như trên | văn bản | Có | rẻ | Có (dự phòng) |
| `gemini-flash-lite-latest` | như trên | văn bản | Có | rẻ | Có (dự phòng) |

## 2. Tạo ảnh

| Model ID | Tên thường gọi | Vào | Ra | Gói miễn phí | Giá xấp xỉ | Xclipse |
|---|---|---|---|---|---|---|
| `gemini-3.1-flash-image-preview` | Nano Banana 2 | văn bản (+ ảnh tham chiếu) | ảnh + văn bản | **Không** (429 limit 0) | ~0,045–0,067 USD/ảnh 1K, ~0,151 USD ở 4K (nguồn thứ cấp, mâu thuẫn) | **Mặc định** tạo ảnh |
| `gemini-3.1-flash-image` (?) | bản ổn định của dòng trên | như trên | như trên | Không | như trên (?) | Chưa dùng (chưa chắc ID) |
| `gemini-3.1-flash-lite-image` (?) | Nano Banana lite | như trên | như trên | Không | rẻ hơn (?) | Chưa dùng |
| `gemini-nano-banana-2.1` (?) | Nano Banana 2.1 | như trên | như trên | Không | (?) | Chưa dùng |
| `gemini-3-pro-image-preview` | Nano Banana Pro | văn bản + tới nhiều ảnh | ảnh + văn bản, tới 4K | **Không** | ~0,13–0,24 USD/ảnh (?) | Có (chọn tay) |
| `gemini-2.5-flash-image` | Nano Banana (đời đầu) | văn bản + ảnh | ảnh + văn bản | Không (một số bài nói có, mâu thuẫn) | ~0,039 USD/ảnh | Có, cuối danh sách; dự kiến ngừng 10/2026 (?) |
| `imagen-4.0-generate-001` | Imagen 4 | văn bản | ảnh (1–4/lần) | Không | ~0,04 USD/ảnh | Có; một nguồn ghi Imagen 4 đã ngừng (?) → có thể trả 404 |
| `imagen-4.0-fast-generate-001` | Imagen 4 Fast | văn bản | ảnh | Không | ~0,02 USD/ảnh | Có |
| `imagen-4.0-ultra-generate-001` | Imagen 4 Ultra | văn bản | ảnh | Không | ~0,06 USD/ảnh | Chưa dùng |

Hình dạng API:
- Gemini ảnh gốc: `POST /v1beta/models/{model}:generateContent`, `generationConfig.responseModalities: ["TEXT","IMAGE"]`, tuỳ chọn `generationConfig.imageConfig.aspectRatio` (1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9…). Ảnh nằm ở `candidates[].content.parts[].inlineData{mimeType,data}`. Diễn đàn Google có báo cáo một số bản preview bỏ qua `aspectRatio` (?). Mỗi lần gọi trả 1 ảnh, nên Xclipse gọi song song khi cần nhiều ảnh.
- Imagen: `POST /v1beta/models/{model}:predict`, `instances:[{prompt}]`, `parameters:{sampleCount (1–4), aspectRatio (1:1, 3:4, 4:3, 9:16, 16:9)}`, ảnh ở `predictions[].bytesBase64Encoded`.
- Header xác thực: `x-goog-api-key`.

## 3. Video (Veo)

| Model ID | Vào | Ra | Gói miễn phí | Giá (?) | Xclipse |
|---|---|---|---|---|---|
| `veo-3.1-generate-preview` (?) | văn bản, ảnh | video + âm thanh | Không | tính theo giây video | Không |
| `veo-3.1-fast-generate-preview` (?) | như trên | video | Không | rẻ hơn | Không |
| `veo-3.1-lite-generate-preview` (?) | như trên | video | Không | rẻ nhất | Không |
| `veo-3.0-generate-001` (?) | văn bản, ảnh | video | Không | theo giây | Không |

Trang models còn nhắc "Gemini Omni Flash" (?) — chưa rõ vai trò.

## 4. Âm thanh / TTS / Live

| Model ID | Chức năng | Gói miễn phí | Xclipse |
|---|---|---|---|
| `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts` (?) | văn bản → giọng nói | Flash có giới hạn (?) | Không |
| `gemini-live-2.5-flash-preview`, `gemini-2.5-flash-native-audio-preview` (?) | hội thoại thời gian thực (Live API) | có giới hạn (?) | Không |

## 5. Embedding

| Model ID | Vào | Ra | Gói miễn phí | Xclipse |
|---|---|---|---|---|
| `gemini-embedding-001` | văn bản | vector | Có | Không |
| `gemini-embedding-2` (?) | văn bản, ảnh, âm thanh… | vector | (?) | Không |

## 6. Gemma (mở, chạy qua AI Studio / Gemini API)

| Model ID | Ghi chú | Xclipse |
|---|---|---|
| `gemma-3-27b-it`, `gemma-3-12b-it`, `gemma-3-4b-it` (?) | văn bản (+ ảnh ở bản lớn), miễn phí có giới hạn | Không |
| `gemma-4-*` (?) | thế hệ mới hơn, chưa xác minh | Không |

## Xclipse đang dùng

- Viết nội dung / Brand DNA: `gemini-3.5-flash-lite` (+ dự phòng Flash-Lite) — `js/ai-service.js`, `js/brand-ai.js`.
- Tạo ảnh (tab "Tạo bằng AI" trong Thư viện ảnh): `gemini-3.1-flash-image-preview` mặc định, chọn tay Nano Banana Pro, Nano Banana đời đầu, Imagen 4, Imagen 4 Fast — `js/ai-image.js`. Model trả 404 → tự thử model kế tiếp. Chưa kiểm thử với Google thật (cần key có billing); kiểm thử tự động dùng mock `fetch`.
