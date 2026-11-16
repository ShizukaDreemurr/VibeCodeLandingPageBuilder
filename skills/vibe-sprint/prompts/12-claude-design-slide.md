# Prompt chuẩn gửi Claude Design — Thiết kế bộ Slide Chung kết (Team Xclipse)

> **Cách dùng:** Khi app đã hoàn thiện (mốc T+45), điền các biến `{{...}}` bên dưới rồi **copy toàn bộ khối prompt** gửi cho **Claude Design** để xuất bộ slide đồng bộ 100% với giao diện app Xclipse.

---

```markdown
Bạn là **Chuyên gia Thiết kế Trình chiếu (Slide UI/UX Designer)** của đội **Xclipse** (`{{TRUONG}}`) tại Chung kết **VIBE-CODING 2026 (Bảng B – Kinh tế)**.

Hãy thiết kế một bộ slide thuyết trình **11 trang (khớp 10 phút) (tỉ lệ 16:9 · 1920×1080px)** cho sản phẩm vừa hoàn thành dưới đây. Yêu cầu **TUÂN THỦ KHẮT KHE** bộ Theme chuẩn hóa và quy tắc trình bày của Xclipse — không tự ý sáng tạo màu hoặc phong cách khác.

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

- **Trường / đơn vị của đội:** `{{TRUONG}}` (không dùng tên địa điểm tổ chức chung kết thay cho trường)
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
- **Người nói & mốc giờ:** `{{NGUOI_1}}` (slide 1–3, 00:00–02:30) · `{{NGUOI_2}}` (slide 4–7, 02:30–06:15) · `{{NGUOI_3}}` (slide 8–11, 06:15–09:45)
- **Điểm AI & Minh bạch:** `{{MO_TA_AI}}` (Nhãn nguyên văn: `{{MOCK_NOTICE}}`)
- **Kết quả kiểm thử thật (`smoke.cjs` + thủ công):** `{{KET_QUA_TEST}}`
- **Link demo online & GitHub:** `{{LINK_DEMO}}` · `{{LINK_REPO}}`
- **Danh sách ảnh chụp màn hình đính kèm:** `{{DANH_SACH_ANH}}`

---

## 3. CẤU TRÚC 11 SLIDE BẮT BUỘC (THỜI LƯỢNG THUYẾT TRÌNH 10 PHÚT · 3 NGƯỜI NÓI)

**Diệu Anh (slide 1–3, 00:00–02:30): bài toán, nỗi đau, UI/UX sơ bộ**
1. **Slide 1 — Bìa (Fluted Glass Hero):** Tên sản phẩm (`Be Vietnam Pro` + `Playfair Display` italic), Tagline, Đội Xclipse · `{{TRUONG}}` · VIBE-CODING 2026. Điểm tựa: 1 con số mục tiêu lớn hoặc ảnh màn hình chính.
2. **Slide 2 — Bài toán & Nỗi đau từ đề bài:** 1 persona + **1 con số nỗi đau lớn** (ví dụ "40 phút/ngày") và tối đa 2 ý phụ.
3. **Slide 3 — Giải pháp & UI/UX sơ bộ:** 1 câu giải pháp + ảnh chụp màn hình chính (desktop) trong khung thiết bị, 1–2 chú thích điểm UI/UX; số lớn: thời gian/thao tác hoàn thành.

**Vũ Trí Dũng (slide 4–7, 02:30–06:15): tính năng chính + demo**
4. **Slide 4 — Tính năng lõi:** 5 tính năng cùng 1 lưới icon, nhấn 1 quy tắc nghiệp vụ; số lớn: "5/5 tính năng chạy thật".
5. **Slide 5 — Luồng sử dụng 3 bước:** Sơ đồ (`Nhập/Chọn` → `Xử lý / AI gợi ý` → `Kết quả / Xuất báo cáo`); số lớn: thời gian từ đầu đến kết quả.
6. **Slide 6 — Demo trực tiếp (ca thường):** khung ảnh app thật + dòng 3 thao tác ngắn + số lớn: giây phản hồi; có QR/link tới `{{LINK_DEMO}}`.
7. **Slide 7 — Demo ca sai/biên + Mobile `390px` & Sáng/Tối:** ảnh mobile cạnh ảnh báo lỗi; số lớn: số ca lỗi bắt được; không tràn ngang, thao tác 1 chạm.

**Nguyên (slide 8–11, 06:15–09:45): kỹ thuật, tổng kết, phản biện**
8. **Slide 8 — Kiến trúc & AI/proxy & Minh bạch AI:** 1 sơ đồ duy nhất (UI → logic → AI qua proxy/mô phỏng → lưu trữ), nhãn `{{MOCK_NOTICE}}` nguyên văn, ghi công cụ AI đội dùng (Claude Opus/Sonnet/Haiku/Design cùng Gemini/Antigravity); số lớn: số module hoặc điểm kiểm soát AI.
9. **Slide 9 — Kiểm thử & Bảo mật:** kết quả `smoke.cjs` (số ca đạt/tổng), quét `scan-secrets.mjs`; **số lớn** "N/M ca đạt".
10. **Slide 10 — Giá trị đo được & giới hạn:** 3 con số kiểm chứng được, 1 giới hạn nói thẳng, bước tiếp theo.
11. **Slide 11 — Kết (Fluted Glass Navy):** QR tới `{{LINK_DEMO}}`, 1 câu chốt, lời cảm ơn, mời hỏi đáp.

## 4. YÊU CẦU CHO NGƯỜI NÓI (PITCH 10 PHÚT, 3 NGƯỜI)

- **Số slide khớp 10 phút = 11 slide**, ánh xạ người nói: **Diệu Anh** slide 1–3 (bài toán, nỗi đau, UI/UX sơ bộ) · **Vũ Trí Dũng** slide 4–7 (tính năng + demo) · **Nguyên** slide 8–11 (kỹ thuật, tổng kết). Đổi tên người theo `{{NGUOI_1}}`, `{{NGUOI_2}}`, `{{NGUOI_3}}` nếu cần.
- **Speaker notes mỗi slide (bắt buộc)** theo đúng khuôn 4 dòng:
  1. `Người nói: <tên>`
  2. `Mốc giờ: <mm:ss–mm:ss> (cứng <mm:ss>)`
  3. `3 neo: V <1 câu vấn đề> · T <1 thao tác/điểm nhấn> · S <1 con số>`
  4. `Chuyền mic: <1 câu cố định>` (chỉ ở slide cuối của mỗi người; còn lại ghi "—")
- **KHÔNG đặt tên người nói lên slide** (không name tag ở góc). Giữ slide sạch; tên người chỉ nằm trong speaker notes.
- **Mỗi slide có đúng 1 điểm tựa thị giác:** hoặc **1 con số lớn** (≥ 120px, `tabular-nums`, màu Navy/Coral) hoặc **1 ảnh chụp app thật**. Con số lớn chính là neo `S` của slide đó; không đặt quá 1 con số to cạnh tranh nhau.
- Mỗi slide tối đa 3 khối thông tin tương ứng 3 neo; chữ gọn để người nói chỉ cần liếc con số là nhớ ý.
- Slide 6–7 (demo): khung ảnh app + dòng thao tác ngắn; slide phụ "Dự phòng" ở cuối bộ (ảnh chụp 5 tính năng) không tính vào 11 slide.
- Xuất kèm PDF dự phòng và ảnh PNG từng slide.

*Lưu ý xuất bản: Giữ đồng nhất header/footer (số trang + tên sản phẩm) ở các slide nội dung, căn lưới thẳng hàng tuyệt đối, và kèm speaker notes theo khuôn ở mục 4.*
```
