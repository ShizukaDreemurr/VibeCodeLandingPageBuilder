# Album Hình Ảnh Theo Ngành Nghề — Xclipse (Chung Kết VIBE-CODING 2026)

> **Mục tiêu:** Chuẩn bị sẵn bộ hình ảnh đồng bộ phong cách thị giác Xclipse (ánh sáng sạch, bố cục hiện đại, không chữ thừa, tối ưu dung lượng `.webp`/`.jpg`) theo các nhóm ngành có khả năng xuất hiện trong đề thi 60 phút, để khi code xong khung app chỉ cần gắn vào là giao diện có tính *signature* ngay.

---

## 1. Bản đồ Ngành nghề (Đối chiếu từ [de-moi-du-doan.md](../catalog/de-moi-du-doan.md))

| STT | Nhóm ngành | Các dạng đề có thể gặp | Ảnh có sẵn / Đã chuẩn bị | Thư mục lưu |
|---|---|---|---|---|
| 1 | **Thương mại điện tử & Bán lẻ** | Tính lợi nhuận sản phẩm, Tồn kho, Flash Sale, Giỏ hàng & Voucher, Mô tả sản phẩm sàn TMĐT | Bộ ảnh đóng gói đơn hàng, kho gọn gàng, sản phẩm công nghệ/tiêu dùng trên nền sạch | `album/ecommerce/` |
| 2 | **Công nghệ, SaaS & Dữ liệu** | Chấm điểm Lead, Phân khúc khách hàng, Chatbot tra cứu đơn, Dashboard KPI | Ảnh không gian làm việc hiện đại, màn hình phân tích dữ liệu, ánh sáng Cobalt/Cyan | `album/tech-saas/` |
| 3 | **F&B & Cửa hàng dịch vụ** | Landing page khai trương, Ưu đãi thành viên, Đặt bàn/Đặt hàng nhanh | **Đã có sẵn 8 ảnh thật** từ dự án vòng 1: `assets/demo/moc-*.webp` (hero, about, barista, beans, gift, acoustic, opening, tasting) | `assets/demo/` |
| 4 | **Giáo dục & Đào tạo / Workshop** | Khóa học ngắn hạn, Hội thảo kỹ năng, Đăng ký sự kiện SME | Ảnh lớp học/workshop tương tác, giảng viên chia sẻ, không khí chuyên nghiệp | `album/education/` |
| 5 | **Thời trang, Mỹ phẩm & Làm đẹp** | Flash sale mỹ phẩm, Ra mắt BST, Lịch hẹn spa/salon | Ảnh sản phẩm skincare/thời trang tối giản, ánh sáng tự nhiên mềm mại | `album/beauty-retail/` |
| 6 | **Chăm sóc khách hàng & Nhân sự** | Phân loại đánh giá khách hàng, Phản hồi khiếu nại, Cổng hỗ trợ SME | Ảnh chân dung đội ngũ tư vấn thân thiện, không gian hỗ trợ khách hàng | `album/support/` |

---

## 2. Quy chuẩn Hình ảnh Signature của Xclipse
Để mọi bức ảnh khi đưa vào app đều giữ đúng "chất" Exynos/Xclipse mà vẫn thân thiện với doanh nghiệp SME:
1. **Ánh sáng & Tông màu:** Ưu tiên ảnh có độ tương phản rõ, ánh sáng định hướng sạch sẽ (tông trắng/xám sáng cho Light Mode, hoặc tông tối sâu có điểm sáng xanh/hổ phách cho Dark Mode).
2. **Tỷ lệ khung hình chuẩn (để không vỡ layout 60 phút):**
   - **Hero Banner:** `16:9` (ví dụ `1280×720 px`), vùng bên trái/phía trên thoáng để đặt chữ tiêu đề.
   - **Thẻ sản phẩm / Tính năng (Card):** `4:3` hoặc `1:1` (`800×600 px` hoặc `600×600 px`).
   - **Avatar / Diễn giả / Nhân viên CSKH:** `1:1` (`400×400 px`), khuôn mặt nằm chính giữa.
3. **Dung lượng nhẹ:** Nén `< 120 KB/ảnh` (định dạng `.webp` hoặc `.jpg` chất lượng 82%) để trang GitHub Pages tải tức thì trên 4G.
4. **Minh bạch nguồn ảnh:** Nếu dùng ảnh tạo bằng AI trong album minh họa, ghi rõ chú thích *"Ảnh minh họa tạo bằng AI"* trong `README.md` và phần khai báo khi nộp bài.

---

## 3. Cách gắn nhanh vào App trong 60 phút thi
1. Khi bốc được đề, xác định đề thuộc nhóm ngành nào trong bảng mục 1.
2. Copy 2–4 ảnh phù hợp nhất từ `skills/vibe-sprint/brand/album/<nganh>/` (hoặc `assets/demo/` nếu là F&B) vào thư mục `assets/` của project mới.
3. Dùng thẻ `<img>` kèm thuộc tính `loading="lazy"` và `object-fit: cover` để ảnh tự khớp khung trên cả Desktop (`1280px`) và Mobile (`390px`), tuyệt đối không bị méo hình.
4. Luôn đặt sẵn **fallback SVG/Gradient** (nền `#EEF2F7` ở Light Mode hoặc `#10141E` ở Dark Mode) đề phòng đường dẫn lỗi.

---

## 4. Checklist chuẩn bị Album trước giờ G (Thứ Hai 16/11)
- [x] **F&B (`assets/demo/`):** Đã có đủ 8 ảnh `.webp` chất lượng cao.
- [x] **TMĐT & Bán lẻ / Công nghệ & SaaS / Giáo dục:** Đã có ảnh mẫu minh họa đi kèm trong `album/`.
- [ ] **Thành viên nhóm bổ sung thêm (nếu muốn ảnh chụp thật):** Mỗi ngành chọn 2–3 ảnh từ nguồn miễn phí bản quyền (Unsplash/Pexels) hoặc ảnh thật của nhóm, nén về `.webp` < 120 KB và lưu vào đúng thư mục `album/<nganh>/`.
