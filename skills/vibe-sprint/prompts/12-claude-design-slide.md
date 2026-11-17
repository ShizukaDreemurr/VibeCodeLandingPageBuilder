# Prompt chuẩn gửi Claude Design — Thiết kế bộ Slide Chung kết (Team Xclipse)

> **Lưu ý (mới):** luồng chính hiện là `14-claude-design-khung-slide.md` (khung trước, ảnh sau, kèm CSS nhúng đủ và cue cho kỹ thuật viên). Prompt này chỉ dùng khi bỏ qua luồng đó. Hai điểm của 14 áp dụng cả ở đây: tiêu đề **đặt tên** (không khẳng định/khoa trương), ghi chú người nói **5 dòng** (thêm dòng `Cue kỹ thuật: Mời chuyển slide.` trước dòng Chuyền mic), vì thành viên không tự bấm slide.
>
> **Cách dùng:** Khi app đã hoàn thiện (mốc T+45), điền các biến `{{...}}` bên dưới rồi **copy toàn bộ khối prompt** gửi cho **Claude Design** để xuất bộ slide đồng bộ 100% với giao diện app Xclipse.
>
> **Ảnh phải có TRƯỚC khi gửi.** Chung kết chấm app trên điện thoại (360–390px) nên mọi ảnh app là **ảnh điện thoại DỌC**. Ảnh do **agent Claude Sonnet** chụp: agent tự mở web app bằng giả lập điện thoại (Playwright: 390×844 @3x = 1170×2532, kèm 360×780), sáng + tối, bằng `node tools/shots-mobile.cjs <URL> shots-mobile` (starter) hoặc `node deck/tools/capture.cjs deck/tools/capture.json` (hoặc `--starter-shots <URL>`). Không chụp tay, không nhờ Gemini chụp. Đặt tên theo bảng slot (`NN-ten-slot-mobile-light.png` / `-dark.png`) rồi dán danh sách vào `{{DANH_SACH_ANH}}`.

---

```markdown
Bạn là **Chuyên gia Thiết kế Trình chiếu (Slide UI/UX Designer)** của đội **Xclipse** (`{{TRUONG}}`) tại Chung kết **VIBE-CODING 2026 (`{{BANG}}`)**.

Hãy thiết kế một bộ slide thuyết trình **`{{SLIDE_COUNT}}` trang (5 / 7 / 11 trang, khớp `{{PITCH_MINUTES}}` phút: 3 phút = 5 slide, 5 phút = 7 slide, 10 phút = 11 slide; xem mục 3) (tỉ lệ 16:9 · 1920×1080px)** cho sản phẩm vừa hoàn thành dưới đây. Yêu cầu **TUÂN THỦ KHẮT KHE** bộ Theme chuẩn hóa và quy tắc trình bày của Xclipse — không tự ý sáng tạo màu hoặc phong cách khác.

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
  - **Không nhồi chữ:** Mỗi slide tối đa **3–4 khối thông tin**, mỗi gạch đầu dòng **≤ 14 từ**, cỡ chữ nội dung tối thiểu `24px` (chú thích ≥ 22px) trên khung 1920×1080 để hội trường nhìn rõ từ xa.
  - Thẻ nội dung bo góc `18px–22px`, nền `#FFFFFF`, viền mảnh `1px solid rgba(7, 45, 89, 0.10)`, bóng đổ cực nhẹ `0 10px 28px rgba(7, 45, 89, 0.08)`.
- **Trình bày Ảnh chụp App thật: CHỈ ẢNH ĐIỆN THOẠI DỌC (YÊU CẦU CỨNG, thể lệ chấm trên điện thoại):**
  - Mọi ảnh app là **ảnh chụp điện thoại dọc tỉ lệ 9:19,5** (1170×2532px, tức 390×844 @3x; có thể kèm bản 360×780), đặt **bên trong khung điện thoại** (bo góc ~44px, viền Navy `#072D59`, Dynamic Island/notch, bóng đổ nhẹ). Khung điện thoại luôn đứng dọc; ảnh hiển thị đủ chiều dọc của màn hình, bám mép trên, không cắt xén mất thanh tab dưới hay số liệu.
  - **TUYỆT ĐỐI KHÔNG** cắt ảnh thành ngang/vuông, không kéo giãn, không đặt ảnh app vào khung cửa sổ trình duyệt/laptop, không dùng ảnh desktop. Ảnh desktop **không** đưa vào slide (chỉ làm minh chứng chốt).
  - **Tối đa 3 điện thoại mỗi slide** (1 điện thoại + 3 chú thích đánh số; 2 điện thoại cạnh nhau, ví dụ Sáng/Tối; 3 điện thoại cạnh nhau, ví dụ ca thường/ca sai/ca biên; hoặc luồng 3 bước 1 → 2 → 3 có mũi tên). Phần còn lại của slide chỉ là chữ gọn.
  - Slide có ảnh app dùng bố cục chia ngang: chữ ở một bên, điện thoại dọc ở bên kia, điện thoại cao gần hết chiều cao slide (≥ 640px) để đọc được từ xa.
- **Minh bạch dữ liệu/AI (Bắt buộc theo thể lệ):**
  - Ghi rõ nhãn dữ liệu mẫu/mô phỏng: `{{MOCK_NOTICE}}` (nguyên văn nếu đề/BTC đưa câu; không thì câu rõ nghĩa của đội). Số mô phỏng phải nhận diện được là mẫu/mô phỏng.
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
- **Thời lượng pitch (BTC báo, giống nhau cho mọi đội) và số slide:** `{{PITCH_MINUTES}}` phút → `{{SLIDE_COUNT}}` slide (3→5, 5→7, 10→11)
- **Bảng thi:** `{{BANG}}` (Kinh tế hoặc Kỹ thuật)
- **Người nói & mốc giờ:** theo bản đã chọn ở mục 3 (`{{NGUOI_1}}` đầu · `{{NGUOI_2}}` giữa · `{{NGUOI_3}}` cuối)
- **Giả định & cách tính (Kinh tế):** `{{GIA_DINH}}` (3 giả định chính + nguồn) · `{{KICH_BAN}}` (cơ sở / xấu nhất) · `{{HOA_VON}}` (điểm hòa vốn) · `{{UU_DAI_LO}}` (ưu đãi lỗ khi nào)
- **Ảnh minh chứng:** ảnh chụp thật của app, **chỉ ảnh điện thoại DỌC** (9:19,5; 390×844@3x = 1170×2532; kèm 360×780), sáng + tối, do agent Claude Sonnet chụp bằng giả lập điện thoại
- **Điểm AI & Minh bạch:** `{{MO_TA_AI}}` (Nhãn nguyên văn: `{{MOCK_NOTICE}}`)
- **Kết quả kiểm thử thật (`smoke.cjs` + thủ công):** `{{KET_QUA_TEST}}`
- **Link demo online & GitHub:** `{{LINK_DEMO}}` · `{{LINK_REPO}}`
- **Danh sách ảnh chụp màn hình đính kèm (toàn bộ là ảnh dọc, đặt tên `NN-ten-mobile-light|dark.png`):** `{{DANH_SACH_ANH}}`
  Tên theo bảng slot 01–13 của `14-claude-design-khung-slide.md` mục 6: `01-tong-quan-mobile-light.png` · `02-nhap-lieu-mobile-light.png` · `03-ket-qua-mobile-light.png` · `04-luu-xem-lai-mobile-light.png` · `05-tinh-nang-1-mobile-light.png` … `09-tinh-nang-5-mobile-light.png` · `10-ca-sai-mobile-light.png` · `11-ca-bien-mobile-light.png` · `01-tong-quan-mobile-dark.png` (đủ cặp light/dark)

---

## 3. CẤU TRÚC SLIDE THEO THỜI LƯỢNG (CHỌN ĐÚNG MỘT BẢN: 11 / 7 / 5 SLIDE · 3 NGƯỜI NÓI)

> Thời lượng pitch BTC báo sau. Dựng bản đúng `{{PITCH_MINUTES}}`; nếu chưa biết, dựng bản 11 slide và đánh dấu slide có thể gộp. **Bảng Kinh tế: bắt buộc có slide "Giả định & cách tính" ở cả ba bản** (nội dung ở dưới). Người nói giữ nguyên: Diệu Anh đầu · Dũng giữa · Nguyên cuối.

### Slide "Giả định & cách tính" (bắt buộc cho Bảng Kinh tế; Bảng Kỹ thuật dùng chỗ này cho "Quy tắc nghiệp vụ & quyết định kỹ thuật")
- Tiêu đề: `Giả định & cách tính` (một cụm nhấn bằng Playfair Italic).
- Bố cục 3 khối: **(a) Bảng giả định** (tối đa 4 dòng: giả định · giá trị · nguồn), **(b) 3 kịch bản** (lạc quan / cơ sở / bi quan: lãi hoặc lỗ, thanh ngang có số) và **(c) điểm hòa vốn + ưu đãi**: 1 công thức dạng chữ (ví dụ `Hòa vốn = Chi phí cố định / (Giá − Biến phí)`) và 1 dòng `Ưu đãi lỗ khi …`.
- **Điểm tựa thị giác: 1 con số lớn** là điểm hòa vốn (`{{HOA_VON}}`) hoặc lãi kịch bản xấu nhất; chữ gọn, mỗi dòng ≤ 12 từ. Số mô phỏng/giả định gắn nhãn nhỏ ngay cạnh ("Giả định", "Mô phỏng", "Dữ liệu mẫu (BTC)").

### Bản 11 slide (10 phút)



**Diệu Anh (slide 1–3, 00:00–02:30): bài toán, nỗi đau, UI/UX sơ bộ**
1. **Slide 1 — Bìa (Fluted Glass Hero):** Tên sản phẩm (`Be Vietnam Pro` + `Playfair Display` italic), Tagline, Đội Xclipse · `{{TRUONG}}` · VIBE-CODING 2026. Điểm tựa: 1 con số mục tiêu lớn hoặc 1 điện thoại dọc chứa ảnh màn hình chính.
2. **Slide 2 — Bài toán & Nỗi đau từ đề bài:** 1 persona + **1 con số nỗi đau lớn** (ví dụ "40 phút/ngày") và tối đa 2 ý phụ.
3. **Slide 3 — Giải pháp & UI/UX sơ bộ:** 1 câu giải pháp + 1 điện thoại dọc (ảnh màn hình chính 390×844) kèm 3 chú thích đánh số về UI/UX; số lớn: thời gian/thao tác hoàn thành.

**Vũ Trí Dũng (slide 4–7, 02:30–06:15): tính năng chính + demo**
4. **Slide 4 — Tính năng lõi:** 5 tính năng cùng 1 lưới icon, nhấn 1 quy tắc nghiệp vụ; số lớn: "5/5 tính năng chạy thật".
5. **Slide 5 — Luồng sử dụng 3 bước:** Sơ đồ (`Nhập/Chọn` → `Xử lý / AI gợi ý` → `Kết quả / Xuất báo cáo`) dựng bằng 3 điện thoại dọc (ảnh từng bước) nối bằng mũi tên 1 → 2 → 3; số lớn: thời gian từ đầu đến kết quả.
6. **Slide 6 — Demo trực tiếp (ca thường):** 1 điện thoại dọc (ảnh app thật) + dòng 3 thao tác ngắn + số lớn: giây phản hồi; có QR/link tới `{{LINK_DEMO}}`.
7. **Slide 7 — Demo ca sai/biên + Mobile `390px` & Sáng/Tối:** 3 điện thoại dọc cạnh nhau (ca sai · ca biên · giao diện Tối); số lớn: số ca lỗi bắt được; không tràn ngang, thao tác 1 chạm.

**Nguyên (slide 8–11, 06:15–09:45): kỹ thuật, tổng kết, phản biện**
8. **Slide 8 — Kiến trúc & AI/proxy & Minh bạch AI:** 1 sơ đồ duy nhất (UI → logic → AI qua proxy/mô phỏng → lưu trữ), nhãn `{{MOCK_NOTICE}}` nguyên văn, ghi công cụ AI đội dùng (Claude Opus/Sonnet/Haiku/Design cùng Gemini/Antigravity); số lớn: số module hoặc điểm kiểm soát AI.
9. **Slide 9 — Kiểm thử & Bảo mật:** kết quả `smoke.cjs` (số ca đạt/tổng), quét `scan-secrets.mjs`; **số lớn** "N/M ca đạt".
10. **Slide 10 — Giả định & cách tính (Kinh tế bắt buộc; Kỹ thuật: Giá trị đo được & giới hạn):** theo khung "Giả định & cách tính" ở trên, kèm 1 giới hạn nói thẳng và bước tiếp theo.
11. **Slide 11 — Kết (Fluted Glass Navy):** QR tới `{{LINK_DEMO}}`, 1 câu chốt, lời cảm ơn, mời hỏi đáp.

### Bản 7 slide (5 phút)
Diệu Anh: **1** Bìa + bài toán (số nỗi đau lớn) · **2** Giải pháp + UI/UX (1 điện thoại dọc màn chính). Dũng: **3** 5 tính năng + luồng 3 bước · **4** Demo (ca thường, ca sai/biên, mobile 360px; tối đa 3 điện thoại dọc). Nguyên: **5 Giả định & cách tính (bắt buộc Kinh tế)** · **6** Kỹ thuật + kiểm thử + bảo mật + nhãn `{{MOCK_NOTICE}}` · **7** Kết (QR, mời hỏi đáp). Mốc cứng: 00:40 / 01:15 / 01:55 / 02:55 / 03:50 / 04:30 / 04:50.

### Bản 5 slide (3 phút)
Diệu Anh: **1** Bài toán + giải pháp + ảnh màn chính. Dũng: **2** Demo ca thường (1 điện thoại dọc) · **3** Ca sai + mobile 360px (2–3 điện thoại dọc). Nguyên: **4 Giả định & cách tính (bắt buộc Kinh tế, không bao giờ bỏ)** · **5** Kiểm thử + nhãn `{{MOCK_NOTICE}}` + QR + kết. Mốc cứng: 00:40 / 01:20 / 01:45 / 02:25 / 02:50.

Mọi bản: giữ nguyên bộ theme, quy tắc 1 điểm tựa/slide, 3 neo `V · T · S` trong speaker notes. Slide phụ "Dự phòng" (ảnh dọc chụp 5 tính năng, tối đa 3 điện thoại mỗi slide) ở cuối, không tính vào số slide.

## 4. YÊU CẦU CHO NGƯỜI NÓI (PITCH `{{PITCH_MINUTES}}` PHÚT, 3 NGƯỜI)

- **Số slide khớp thời lượng:** 10 phút = 11 slide, 5 phút = 7 slide, 3 phút = 5 slide (xem mục 3). Bản 11 slide: **Diệu Anh** slide 1–3 · **Vũ Trí Dũng** slide 4–7 · **Nguyên** slide 8–11 (kỹ thuật, giả định & cách tính, tổng kết). Đổi tên người theo `{{NGUOI_1}}`, `{{NGUOI_2}}`, `{{NGUOI_3}}` nếu cần.
- **Speaker notes mỗi slide (bắt buộc)** theo đúng khuôn 5 dòng (dòng 4 mới: Cue kỹ thuật):
  1. `Người nói: <tên>`
  2. `Mốc giờ: <mm:ss–mm:ss> (cứng <mm:ss>)`
  3. `3 neo: V <1 câu vấn đề> · T <1 thao tác/điểm nhấn> · S <1 con số>`
  4. `Cue kỹ thuật: Mời chuyển slide.` (hoặc "Mời phát video demo." ở slide demo)
  5. `Chuyền mic: <1 câu cố định>` (chỉ ở slide cuối của mỗi người; còn lại ghi "—")
- **KHÔNG đặt tên người nói lên slide** (không name tag ở góc). Giữ slide sạch; tên người chỉ nằm trong speaker notes.
- **Mỗi slide có đúng 1 điểm tựa thị giác:** hoặc **1 con số lớn** (≥ 120px, `tabular-nums`, màu Navy/Coral) hoặc **1 ảnh chụp app thật dạng điện thoại dọc**. Con số lớn chính là neo `S` của slide đó; không đặt quá 1 con số to cạnh tranh nhau.
- Mỗi slide tối đa 3 khối thông tin tương ứng 3 neo; chữ gọn để người nói chỉ cần liếc con số là nhớ ý.
- Slide 6–7 (demo): điện thoại dọc + dòng thao tác ngắn; slide phụ "Dự phòng" ở cuối bộ (ảnh dọc chụp 5 tính năng) không tính vào số slide.
- Xuất kèm PDF dự phòng và ảnh PNG từng slide.
- **Tự kiểm trước khi trả:** không có ảnh nào bị cắt ngang/vuông; mọi ảnh app nằm trong khung điện thoại dọc; mỗi slide ≤ 3 điện thoại.

*Lưu ý xuất bản: Giữ đồng nhất header/footer (số trang + tên sản phẩm) ở các slide nội dung, căn lưới thẳng hàng tuyệt đối, và kèm speaker notes theo khuôn ở mục 4.*
```
