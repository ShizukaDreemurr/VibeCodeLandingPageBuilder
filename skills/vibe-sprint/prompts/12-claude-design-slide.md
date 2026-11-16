# Prompt chuẩn gửi Claude Design — Thiết kế bộ Slide Chung kết (Team Xclipse)

> **Cách dùng:** Khi app đã hoàn thiện (mốc T+45), điền các biến `{{...}}` bên dưới rồi **copy toàn bộ khối prompt** gửi cho **Claude Design** để xuất bộ slide đồng bộ 100% với giao diện app Xclipse.

---

```markdown
Bạn là **Chuyên gia Thiết kế Trình chiếu (Slide UI/UX Designer)** của đội **Xclipse (FPT Polytechnic Hà Nội)** tại Chung kết **VIBE-CODING 2026 (Bảng B – Kinh tế)**.

Hãy thiết kế một bộ slide thuyết trình **10–12 trang (tỉ lệ 16:9 · 1920×1080px)** cho sản phẩm vừa hoàn thành dưới đây. Yêu cầu **TUÂN THỦ KHẮT KHE** bộ Theme chuẩn hóa và quy tắc trình bày của Xclipse — không tự ý sáng tạo màu hoặc phong cách khác.

---

## 1. BỘ THEME CHUẨN HÓA XCLIPSE (BẮT BUỘC TUYỆT ĐỐI)

### A. Bảng màu cố định (Strict Palette)
- **Nền sáng chủ đạo (Slide nội dung):** `#F5FBFF` (Ice White) & thẻ nổi `#FFFFFF`; vùng nhấn nhạt `#DBF2FC` (Ice Sky) và `#EAF6FD`.
- **Màu chính (Slide bìa, Slide kết, Tiêu đề, Số liệu KPI):** `#072D59` (Deep Navy) & `#0E4A8A`.
- **Màu nhấn (Nút/Tag nổi bật, Badge, Vạch tiến độ, Điểm nhấn 3D):** `#FD6E88` (Coral Pink).
  - *Quy tắc tương phản:* Chữ hồng nhỏ trên nền trắng/sáng **bắt buộc** dùng `#C93252` hoặc `#D93656` (tuyệt đối không đặt chữ `#FD6E88` mảnh lên nền trắng).
- **Màu trạng thái (nếu cần):** Xanh đạt `#0B7A70`, viền mảnh `rgba(7, 45, 89, 0.12)`.
- **CẤM TUYỆT ĐỐI:** Không dùng tím neon, không dùng nền đen tuyền `#000000`, không dùng phong cách gaming/cyberpunk, không tự ý pha thêm cam hoặc xanh lá ngoài bảng màu trên.

### B. Hệ thống Chữ (Typography)
- **Tiêu đề chính:** `Be Vietnam Pro` (Bold 700–800, tracking `-0.025em`) kết hợp **1–2 từ khóa nhấn** dùng `Playfair Display` **Italic Bold 700** (đồng bộ với phong cách *"Giải pháp thông minh"* của app).
- **Nội dung & Nhãn:** `Be Vietnam Pro` (Regular 400 / Medium 500), **tiếng Việt có dấu chuẩn 100%**, không lỗi font dấu.
- **Số liệu / KPI / Mã:** Bật `tabular-nums` (hoặc `IBM Plex Mono` cho mã/URL).

### C. Ngôn ngữ Thiết kế & Kỷ luật Bố cục (Layout Discipline)
- **Slide Bìa (Slide 1) & Slide Kết (Slide cuối):**
  - Nền chia 2 mảng hoặc chuyển sắc từ `#DBF2FC` sang `#072D59`, kèm họa tiết **kính sọc dọc (*Fluted Glass*) + quả cầu 3D hồng-xanh (`#FD6E88` / `#072D59`)** tinh tế ở nửa phải hoặc góc (tuyệt đối không che chữ).
- **Slide Nội dung (Slide 2–11):**
  - Lề an toàn tối thiểu **`72px`** ở cả 4 cạnh. Khoảng trắng thoáng đạt (**≥ 30% diện tích slide**).
  - **Không nhồi chữ:** Mỗi slide tối đa **3–4 khối thông tin**, mỗi gạch đầu dòng **≤ 12 từ**, cỡ chữ nội dung tối thiểu `22px` trên khung 1920×1080 để hội trường nhìn rõ từ xa.
  - Thẻ nội dung bo góc `18px–22px`, nền `#FFFFFF`, viền mảnh `1px solid rgba(7, 45, 89, 0.10)`, bóng đổ cực nhẹ `0 10px 28px rgba(7, 45, 89, 0.08)`.
- **Trình bày Ảnh chụp App thật (Desktop & Mobile 390px):**
  - Đặt trong khung thiết bị/khung cửa sổ sạch sẽ (bo góc `16px`, viền Navy mảnh), **không cắt xén mất thanh điều hướng hay số liệu**.
  - Slide Demo Mobile bắt buộc đặt khung điện thoại `390px` cạnh phần giải thích ngắn gọn (2–3 ý).
- **Minh bạch AI (Bắt buộc theo thể lệ):**
  - Ghi rõ nhãn mô phỏng AI **NGUYÊN VĂN** theo đề/BTC: `{{MOCK_NOTICE}}`
  - Ghi rõ công cụ AI đội sử dụng: **Claude (Opus / Sonnet / Haiku / Claude Design)** phối hợp cùng **Gemini / Antigravity**.

---

## 2. DỮ LIỆU ĐẦU VÀO CỦA SẢN PHẨM VỪA LÀM

- **Tên sản phẩm:** `{{TEN_APP}}`
- **Tagline (1 câu):** `{{TAGLINE}}`
- **Đề bài chung kết (tóm tắt 2–3 dòng):** `{{DE_BAI}}`
- **Đối tượng người dùng & Nỗi đau chính:** `{{NGUOI_DUNG_VA_NOI_DAU}}`
- **5 tính năng cốt lõi đã chạy thật:**
  1. `{{TINH_NANG_1}}`
  2. `{{TINH_NANG_2}}`
  3. `{{TINH_NANG_3}}`
  4. `{{TINH_NANG_4}}`
  5. `{{TINH_NANG_5}}`
- **Điểm AI & Minh bạch:** `{{MO_TA_AI}}` (Nhãn nguyên văn: `{{MOCK_NOTICE}}`)
- **Kết quả kiểm thử thật (`smoke.cjs` + thủ công):** `{{KET_QUA_TEST}}`
- **Link demo online & GitHub:** `{{LINK_DEMO}}` · `{{LINK_REPO}}`
- **Danh sách ảnh chụp màn hình đính kèm:** `{{DANH_SACH_ANH}}`

---

## 3. CẤU TRÚC 11 SLIDE BẮT BUỘC (THỜI LƯỢNG THUYẾT TRÌNH 5–7 PHÚT)

1. **Slide 1 — Bìa (Fluted Glass Hero):** Tên sản phẩm (`Be Vietnam Pro` + `Playfair Display` italic), Tagline, Đội Xclipse · FPT Polytechnic Hà Nội · VIBE-CODING 2026.
2. **Slide 2 — Bài toán & Nỗi đau từ đề bài:** 3 con số/vấn đề thực tế mà người dùng đang gặp phải.
3. **Slide 3 — Giải pháp & Luồng sử dụng 3 bước:** Sơ đồ 3 bước trực quan (`Nhập/Chọn` → `Xử lý / AI gợi ý` → `Kết quả / Xuất báo cáo`).
4. **Slide 4 — Tổng quan Giao diện Desktop:** Ảnh chụp màn hình Trang chủ (`#DBF2FC · #072D59 · #FD6E88`) + 3 chú thích điểm nổi bật.
5. **Slide 5 — Tính năng lõi 1 & 2:** Ảnh chụp màn hình thật + giải thích giá trị kinh doanh (không liệt kê kỹ thuật khô khan).
6. **Slide 6 — Tính năng lõi 3 & 4:** Ảnh chụp màn hình thật + biểu đồ/số liệu minh họa.
7. **Slide 7 — Tích hợp AI & Minh bạch dữ liệu:** Cơ chế AI thực chiến (Gemini API + Mock fallback có nhãn `{{MOCK_NOTICE}}`), kèm ảnh chụp kết quả AI.
8. **Slide 8 — Trải nghiệm Mobile `390px` & Sáng/Tối:** Ảnh chụp mobile song song Light/Dark Mode, nhấn mạnh không tràn ngang & thao tác 1 chạm.
9. **Slide 9 — Chất lượng & Kiểm thử thực tế:** Kết quả chạy `smoke.cjs` (số ca đạt), quét bảo mật `scan-secrets.mjs`, hiệu năng/offline-ready.
10. **Slide 10 — Khai báo AI & Phân công phát triển:** Minh bạch quy trình phối hợp **Claude (Opus/Sonnet/Haiku/Design) + Gemini/Antigravity** và giá trị kinh tế thực tế cho doanh nghiệp/người dùng.
11. **Slide 11 — Kết & Demo trực tiếp (Fluted Glass Navy):** QR code tới `{{LINK_DEMO}}`, thông điệp chốt và lời cảm ơn Ban Giám Khảo.

*Lưu ý xuất bản: Giữ đồng nhất header/footer (số trang + tên sản phẩm) ở các slide nội dung, căn lưới thẳng hàng tuyệt đối, và kèm ghi chú thuyết trình ngắn (2–3 câu/slide) cho người nói.*
```
