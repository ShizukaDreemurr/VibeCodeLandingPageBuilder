# Bộ Nhận Diện Thương Hiệu Xclipse — VIBE-CODING 2026 (Chung Kết)

> [!IMPORTANT]
> **BẢN CHỐT CHÍNH THỨC (Final Lock-in):**
> - **File giao diện mẫu chuẩn:** `skills/vibe-sprint/brand/xclipse-ui-ux-tam-nhin.html`
> - **Bảng màu chốt:** `#DBF2FC` (Ice Sky Blue — nền sáng thoáng) · `#072D59` (Deep Navy — chữ chính & khối Hero) · `#FD6E88` (Coral Pink — CTA chính & điểm nhấn)
> - **Phong cách:** Hero chia 2 mảng sáng/tối, kính sọc dọc (*Fluted Glass*) + quả cầu 3D hồng-xanh, tiêu đề phối `Be Vietnam Pro` + `Playfair Display` italic, tích hợp tương tác **Lucian UX/UI** (`#002`, `#013`, `#163`).

> **Định hướng nền tảng:** Kế thừa tinh thần thị giác của **Samsung Exynos & GPU Xclipse** (sự kết hợp giữa *Exynos* = Thông minh & Bền vững và *Eclipse* = Nhật thực), chuyển thể thành hệ thống giao diện B2B/Kinh doanh sạch sẽ, tin cậy và sắc nét.

---

## 1. Câu chuyện & Triết lý thương hiệu
- **Tên gọi `Xclipse`:** Ghép từ **X** (hội tụ & kết nối) + **Eclipse** (Nhật thực).
- **Ý nghĩa cốt lõi:**
  1. **Bước chuyển kỷ nguyên:** Khép lại cách làm thủ công rời rạc (bảng tính rời, thao tác chậm) để mở ra quy trình tự động hóa gọn gàng trong 1 chạm.
  2. **Ánh sáng & Vành nhật hoa:** Như tia sáng rìa nhật thực, phần mềm "chiếu rọi" đúng điểm mù dữ liệu, lọc bỏ nhiễu để người dùng thấy ngay con số và hành động quan trọng nhất.
  3. **Thông minh & Tiết kiệm:** Làm được nhiều việc hơn với ít thao tác và ít chi phí vận hành hơn.

---

## 2. Logo & Biểu tượng (Signature Mark)
- **Cấu tạo hình học:**
  - **Vòng tròn Nhật thực (Eclipse Circle):** Khối tròn đồng tâm tượng trưng cho sự trọn vẹn và tập trung.
  - **Đường cắt chữ X sắc nét (Precision X-Cut):** Hai nét chéo 45° âm bản ở tâm (độ rộng khe bằng 8–10% đường kính để không bết nét ở kích thước favicon 16×16 px).
  - **Vành sáng Nhật hoa (Corona Rim):** Cung sáng mảnh ôm góc trên-trái, tạo chiều sâu ánh sáng đặc trưng của Xclipse.
- **Quy tắc sử dụng:** Đặt trên nền sáng (`#F8FAFC`/`#FFFFFF`) dùng màu `#1428A0`; đặt trên nền tối (`#07090E`/`#10141E`) dùng `#F4F6FA` kết hợp vành sáng `#38BDF8` → `#2E5BFF`. Khoảng trống an toàn xung quanh logo tối thiểu bằng 25% chiều cao biểu tượng.

---

## 3. Hệ thống Màu sắc (Light Mode mặc định & Eclipse Dark Mode)

> **Nguyên tắc 60 – 30 – 10:** 60% nền canvas trung tính · 30% bề mặt thẻ/khung · 10% màu thương hiệu và ánh sáng nhấn (chỉ dùng cho nút CTA chính, biểu đồ, trạng thái chọn và viền focus mảnh 1 px — tuyệt đối không lạm dụng neon).

### A. Light Mode — "Daylight Workspace" (Mặc định làm việc ban ngày)
| Vai trò | Tên màu | Mã HEX | Tương phản WCAG 2.1 | Mục đích sử dụng |
|---|---|---|---|---|
| Nền tổng thể (60%) | Daylight Alabaster | `#F8FAFC` | Nền dịu mắt | Khung nền ứng dụng, giảm chói khi đọc bảng biểu |
| Bề mặt thẻ (30%) | Pure White / Mist | `#FFFFFF` / `#EEF2F7` | Nền phụ phân tách | Thẻ chức năng, form nhập, bảng dữ liệu |
| Chữ chính | Obsidian Ink | `#0F172A` | **17.06:1** trên `#F8FAFC` (AAA) | Tiêu đề, số liệu KPI, nội dung chính |
| Chữ phụ | Slate Ink | `#475569` | **7.24:1** trên `#F8FAFC` (AAA) | Mô tả tính năng, nhãn cột, hướng dẫn |
| Thương hiệu chính (10%) | **Samsung Cobalt** | `#1428A0` | **11.41:1** trên `#FFFFFF` (AAA) | Logo, nút CTA chính, tab đang chọn |
| Nhấn AI & Trạng thái | Cyan Dark / Amber Dark | `#0369A1` / `#B45309` | **5.93:1** / **5.02:1** (AA) | Huy hiệu AI, thông báo, cảnh báo nhẹ |
| Viền phân tách / Input | Subtle / UI Border | `#E2E8F0` / `#7C8BA1` | `#7C8BA1` đạt **3.46:1** (AA UI) | Đường kẻ bảng (`#E2E8F0`), viền ô nhập (`#7C8BA1`) |

### B. Dark Mode — "Eclipse Mode" (Tập trung & Thuyết trình)
| Vai trò | Tên màu | Mã HEX | Tương phản WCAG 2.1 | Mục đích sử dụng |
|---|---|---|---|---|
| Nền tổng thể (60%) | Umbra Black | `#07090E` | Dịu hơn `#000000` | Nền không gian tập trung, trình chiếu demo |
| Bề mặt tầng 1 (30%) | Silicon Charcoal | `#10141E` | Tách tầng rõ ràng | Thẻ báo cáo, sidebar, khung nội dung |
| Bề mặt tầng 2 (nổi) | Eclipse Slate | `#181E2C` | Nổi khối tự nhiên | Pop-up, modal, dropdown, thanh tìm kiếm |
| Chữ chính | Corona White | `#F4F6FA` | **18.41:1** trên `#07090E` (AAA) | Tiêu đề, số liệu chính |
| Chữ phụ | Lunar Silver | `#A3AEC2` | **8.91:1** trên `#07090E` (AAA) | Mô tả, chú thích phụ |
| Nút CTA chính (10%) | **Electric Cobalt** | `#2E5BFF` | Chữ `#FFFFFF` đạt **5.18:1** (AA) | Thay thế `#1428A0` để đảm bảo độ nổi trên nền tối |
| Nhấn AI / Vành nhật hoa | **Cyan Ray** / **Corona Amber** | `#38BDF8` / `#F59E0B` | **9.30:1** / **9.27:1** trên `#07090E` (AAA) | Điểm nhấn AI, đường biểu đồ, vành sáng viền 1 px |
| Viền phân tách / Input | Hairline / UI Border | `#2A3347` / `#5C6B89` | `#5C6B89` đạt **3.72:1** (AA UI) | Viền thẻ (`#2A3347`), viền ô nhập (`#5C6B89`) |

---

## 4. Hệ thống Chữ viết (Typography)
- **Phông chữ chính (Đơn họ – Song trọng lượng):** **`Be Vietnam Pro`** (Google Fonts, miễn phí OFL-1.1) cho cả **Tiêu đề** và **Nội dung**, vì có `x-height` lớn (530/1000) và dấu tiếng Việt tối ưu không bị đè dòng.
- **Số liệu thẳng cột:** Bật `font-variant-numeric: tabular-nums` cho mọi con số KPI, giá tiền, phần trăm, đếm ngược; dùng `IBM Plex Mono` / monospace hệ thống cho mã đơn hàng hoặc mã giảm giá.
- **Thang kích thước chuẩn:**
  - **Hero / Tuyên ngôn:** `40–56 px`, Bold (700), `line-height: 1.15`, `letter-spacing: -0.025em`.
  - **Tiêu đề mục (H2/H3):** `24–32 px`, SemiBold (600), `line-height: 1.28`, `letter-spacing: -0.015em`.
  - **Số liệu KPI:** `28–44 px`, Bold (700), `tabular-nums`.
  - **Nội dung (Body):** `15–16 px`, Regular (400), `line-height: 1.58`, độ rộng dòng 60–75 ký tự.
  - **Nhãn nhỏ / Bảng:** `12–14 px`, Medium (500).

---

## 5. Bộ Icon SVG Riêng (Xclipse Precision Line)
- **Quy chuẩn hình học:** Lưới `24×24 px` (vùng vẽ `20×20 px`, lề an toàn `2 px`), nét mảnh đồng nhất `stroke-width: 1.5px`, đầu nét tròn (`stroke-linecap: round`, `stroke-linejoin: round`), bo góc `2 px`.
- **Điểm nhận diện riêng:** Giữ nét hở nhẹ mô phỏng điểm kết nối mở hoặc chấm vuông bo nhẹ; riêng icon **AI / Trạng thái nổi bật** dùng kiểu **Duotone ánh sáng nội tại** (thêm lớp nền phụ `#38BDF8` độ mờ 14%).
- **Danh sách 16 icon cốt lõi đã đóng gói sẵn trong `xclipse-brand-kit.html`:**
  1. **Liên hệ / Hotline** (`phone` / `headset`)
  2. **Email / Hộp thư** (`mail` — góc chữ V đồng bộ góc chữ X)
  3. **Facebook** (`facebook`)
  4. **Zalo / Nhắn tin nhanh** (`message`)
  5. **Chia sẻ / Mạng xã hội** (`share` — 3 điểm kết nối lưới)
  6. **Địa chỉ / Vị trí** (`location` — ghim vòng tròn đồng tâm nhật thực)
  7. **Hỏi đáp / Trợ giúp (FAQ)** (`faq` — khung bo 2 px + chấm vuông)
  8. **Trí tuệ nhân tạo (AI)** (`ai-spark` — sao 4 cánh hình học + tia sáng)
  9. **Bảo mật / Quyền riêng tư** (`security` — khiên đường cong liên tục)
  10. **Giỏ hàng / Thương mại** (`commerce`)
  11. **Thống kê / Biểu đồ** (`chart`)
  12. **Tìm kiếm** (`search`)
  13. **Cảnh báo / Kiểm tra lỗi** (`alert`)
  14. **Xuất file / Tải xuống** (`download`)
  15. **Sao chép nhanh** (`copy`)
  16. **Chuyển chế độ Sáng / Tối** (`theme-eclipse`)

---

## 6. Thiết kế Thành phần UI Đặc trưng (Buttons, Cards, Pop-up)
- **Buttons (Nút bấm):**
  - Bo góc `8 px` (nút trong bảng `6 px`), nhãn ngắn gọn 2–3 từ (*"Tạo ngay"*, *"Phân tích AI"*, *"Xuất báo cáo"*).
  - **Primary Button:** Light Mode nền `#1428A0` (hover `#0E1D75`), Dark Mode nền `#2E5BFF` (hover `#4B73FF`), chữ trắng `#FFFFFF`. Không dùng bóng đổ neon tỏa rộng.
  - **Secondary Button:** Nền trong suốt, viền `1px solid` (`#7C8BA1` ở Light / `#5C6B89` ở Dark).
  - **AI Action Button:** Viền gradient mảnh `1px` ánh Cyan `#38BDF8` → Cobalt `#2E5BFF`, kèm icon AI duotone.
- **Cards (Thẻ thông tin):**
  - Bo góc `14 px`, cấu trúc 2 tầng gọn gàng: **chỉ số/tiêu đề chính ở trên**, **chi tiết/biểu đồ ở dưới**, lược bỏ các nút phụ rườm rà. Trong Dark Mode thêm vệt sáng viền mảnh `1px` ở cạnh trên.
- **Pop-up / Modal:**
  - Bo góc `18 px`, nền đặc (Light `#FFFFFF`, Dark `#181E2C`) để chữ luôn đạt chuẩn tương phản, kết hợp lớp phủ nền `backdrop-filter: blur(12px)` tối nhẹ (`rgba(7, 9, 14, 0.72)`) và viền sáng mảnh `1px` ánh xanh/trắng mờ 15%.
  - Chuyển động đóng/mở `220ms cubic-bezier(0.16, 1, 0.3, 1)` — dứt khoát, mượt mà, không nảy lò xo.

---

## 7. Gợi ý Kịch bản Thuyết trình 2 phút — Phần Giao diện & Nhận diện (Diệu Anh)

> **Mục tiêu:** Giải thích ngắn gọn, tự tin *cảm hứng thương hiệu*, *tại sao chọn hệ màu/chữ/icon này*, và *nó giúp ích gì cho người dùng thực tế*.

- **[0:00 – 0:30] Cảm hứng tên gọi & Câu chuyện:**
  *"Chào ban giám khảo, em là Diệu Anh, phụ trách phần Giao diện và Nhận diện của đội Xclipse. Tên gọi Xclipse được nhóm lấy cảm hứng từ hiện tượng Nhật thực — khoảnh khắc ánh sáng bứt phá khỏi bóng tối. Với tụi em, sản phẩm này là bước chuyển giúp người dùng khép lại cách làm thủ công rời rạc để nhìn rõ dữ liệu và xử lý công việc nhanh, sắc nét hơn."*
- **[0:30 – 1:10] Hệ màu hai chế độ & Độ tin cậy:**
  *"Về màu sắc, nhóm không chạy theo phong cách công nghệ tối màu quá gắt mà thiết kế hai chế độ chuẩn độ tương phản WCAG. Ban ngày mặc định là Light Mode nền trắng dịu kết hợp sắc xanh Cobalt `#1428A0` tạo cảm giác tin cậy, sạch sẽ như một công cụ làm việc chuyên nghiệp. Khi cần tập trung hoặc trình chiếu, người dùng bật Eclipse Dark Mode nền than sâu điểm ánh sáng Cyan và vàng hổ phách mảnh ở viền — vừa đỡ mỏi mắt, vừa nổi bật các điểm chạm AI."*
- **[1:10 – 1:45] Typography, Icon & UI Signature:**
  *"Toàn bộ chữ viết dùng bộ font Be Vietnam Pro có độ mở lớn để dấu tiếng Việt luôn rõ ràng ngay cả trong bảng số liệu dày đặc. Nhóm cũng tự thiết kế đồng bộ bộ icon nét mảnh 1.5px, các nút bấm dứt khoát và khung pop-up phân tầng rõ nét để người không rành kỹ thuật vẫn thao tác được ngay từ lần đầu."*
- **[1:45 – 2:00] Chốt chuyển ý sang phần Nội dung:**
  *"Tất cả những yếu tố thị giác này đều phục vụ một mục tiêu duy nhất: giảm nhiễu, dễ đọc và đáng tin cậy. Tiếp theo, bạn Dũng sẽ trình bày cách nhóm xây dựng giọng điệu và nội dung để đồng bộ với trải nghiệm này."*
