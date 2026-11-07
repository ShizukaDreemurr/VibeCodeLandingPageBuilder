# Prompt cho Gemini Deep Research — nghiên cứu thư viện mẫu landing page sự kiện

Dán nguyên khối dưới đây vào Gemini (chế độ **Deep Research**). Kết quả JSON ở cuối báo cáo có thể đưa thẳng vào `tools/templates.json` (đúng cấu trúc app đang dùng) sau khi nhóm đọc lại.

---

Bạn là chuyên gia nghiên cứu thị trường sự kiện và thiết kế landing page tại Việt Nam. Hãy nghiên cứu sâu (ưu tiên nguồn 2024–2026, có trích dẫn) để xây dựng **thư viện mẫu landing page đăng ký sự kiện** cho ứng dụng Xclipse — công cụ giúp marketer và người tổ chức sự kiện tại Việt Nam tạo trang đăng ký trong 5 phút.

## Bối cảnh sản phẩm
- Người dùng: marketer in-house SME, chủ cơ sở đào tạo/trainer, chủ cửa hàng F&B/spa, người tổ chức sự kiện cá nhân (cưới, thôi nôi, mừng thọ, họp lớp).
- Mỗi trang có cố định các phần: phần đầu (tiêu đề, thời gian, địa điểm, nút đăng ký), đếm ngược, giới thiệu, 3 lợi ích, diễn giả/khách mời, chương trình (agenda), ưu đãi đăng ký sớm, form đăng ký (họ tên, SĐT, email), chân trang. Có thể bật thêm: FAQ, cảm nhận, nhà tài trợ, video, bản đồ, lời kêu gọi cuối trang.
- Bộ lọc mẫu hiện có 3 chiều: **Ngành nghề** (tech, education, beauty, fnb, finance, personal, health, realestate, travel, entertainment, community, retail, art, corporate), **Loại sự kiện** (workshop, seminar, webinar, opening, launch, wedding, concert, exhibition, networking, training, party, sports, charity, tour, birthday), **Mục đích** (lead, enroll, sales, brand, gratitude, community, recruit, fundraise).

## Câu hỏi nghiên cứu
1. **Bức tranh sự kiện tại Việt Nam**: những loại sự kiện nào được tổ chức nhiều nhất theo từng ngành (B2B, B2C, cá nhân, cộng đồng)? Mùa cao điểm trong năm (Tết, 8/3, 20/10, trung thu, mùa cưới, mùa tuyển sinh, Black Friday…)? Quy mô khách điển hình?
2. **Hành vi người đăng ký**: kênh đến trang (Facebook, Zalo, TikTok, email), tỉ lệ xem trên điện thoại, điều gì khiến họ bấm đăng ký hoặc bỏ đi, thông tin nào bắt buộc phải thấy ngay ở phần đầu trang.
3. **Phân tích đối thủ / tham chiếu**: LadiPage, Eventbrite, Ticketbox, Luma, Meetup, Canva, Wix, các trang sự kiện nổi bật tại Việt Nam. Họ phân loại mẫu thế nào, có bộ lọc gì, mẫu nào phổ biến nhất, điểm mạnh/yếu.
4. **Thiết kế theo ngành**: với mỗi ngành/loại sự kiện, gợi ý bảng màu (đạt tương phản WCAG AA: chữ trắng trên màu chính ≥ 4.5:1), kiểu chữ (một trong: Playfair Display, Montserrat, Lora, Nunito, hoặc mặc định Be Vietnam Pro), giọng văn, cách gọi các phần (ví dụ "Diễn giả" / "Huấn luyện viên" / "Cô dâu & Chú rể"), chữ trên nút đăng ký, và dạng ưu đãi đăng ký sớm phù hợp văn hoá Việt Nam.
5. **Danh mục mẫu đề xuất**: đề xuất **80 mẫu** bao phủ đều các ngành × loại × mục đích ở trên, ưu tiên mẫu có nhu cầu thật cao tại Việt Nam. Không trùng với các mẫu đã có (danh sách bên dưới).
6. **Bộ lọc**: có nên thêm chiều lọc khác không (quy mô, hình thức online/offline, miễn phí/có phí, đối tượng khách, mùa/dịp lễ)? Đề xuất giá trị cụ thể.

Các mẫu đã có (không lặp lại): Tech Workshop AI marketing, hội thảo du học, workshop chăm sóc da, khai trương quán cà phê, webinar tài chính cá nhân, 4 kiểu thiệp cưới, hackathon, demo day startup, bootcamp lập trình, trại hè thiếu nhi, CLB tiếng Anh, ngày hội tuyển sinh, marathon, khai trương gym, retreat yoga, khám sức khoẻ miễn phí, mở bán dự án BĐS, open house căn hộ, hội thảo chứng khoán, webinar bảo hiểm, tiệc tất niên, ngày hội việc làm, đào tạo lãnh đạo, chạy bộ gây quỹ, gala gây quỹ, hiến máu, CLB sách, webinar an ninh mạng, hội nghị khách hàng, tài chính cho SME, ngày hội mẹ và bé, lễ ăn hỏi, thôi nôi, mừng thọ, họp lớp, đêm nhạc live, hài độc thoại, công chiếu phim, triển lãm nghệ thuật, workshop nhiếp ảnh, workshop gốm, thư pháp đầu xuân, ra mắt bộ sưu tập thời trang, chợ phiên pop-up, khai trương buffet, thưởng thức rượu vang, trà đạo, lớp nấu ăn, khai trương salon, giới thiệu tour du lịch, staycation, lễ hội trung thu, ra mắt sách.

## Định dạng kết quả
1. Báo cáo tiếng Việt, có trích dẫn nguồn cho từng nhận định số liệu.
2. Bảng tổng hợp 80 mẫu: tên mẫu · ngành · loại · mục đích · lý do có nhu cầu (kèm nguồn) · mùa cao điểm.
3. **Khối JSON cuối cùng** — mảng 80 phần tử, mỗi phần tử đúng cấu trúc sau (chỉ dùng các giá trị liệt kê ở trên cho tags; màu hex; tiếng Việt có dấu đầy đủ; tên người/địa điểm/thương hiệu là giả định hợp lý, không dùng thương hiệu thật):

```json
{
  "id": "kebab-case-khong-dau",
  "name": "Tên mẫu ngắn 2–4 từ",
  "tags": { "industry": ["..."], "type": ["..."], "goal": ["..."] },
  "theme": { "primary": "#hex", "accent": "#hex", "surface": "#hex", "bg": "#hex", "text": "#hex", "muted": "#hex", "headingFont": "'Montserrat', sans-serif" },
  "labels": { "speakers": "...", "submit": "...", "countSuffix": " ... đã đăng ký" },
  "art": { "motif": "circuit|books|petals|coffee|chart|rings|spotlight|mountains|waves|skyline|house|leaves|confetti|palette|track|hearts|globe|notes|gift|grid|sun|stars|bubbles|ribbon", "variant": 0 },
  "sample": {
    "name": "Tên sự kiện mẫu", "startDays": 14, "startHour": 9,
    "location": "Địa điểm cụ thể tại Việt Nam", "capacity": 150,
    "speakers": [{ "name": "...", "title": "..." }],
    "agenda": [{ "time": "09:00", "title": "..." }],
    "earlyBird": "Ưu đãi đăng ký sớm", "earlyBirdDays": 7
  }
}
```

Ràng buộc màu: chữ trắng trên `primary` và `accent` ≥ 4.5:1; `text` trên `bg` ≥ 7:1; `muted` trên `bg` và `surface` ≥ 4.5:1. Hãy tự kiểm tra trước khi xuất.
