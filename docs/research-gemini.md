# **KHUNG KIẾN TRÚC VÀ TÀI LIỆU CẤU TRÚC PHÁT TRIỂN CÔNG CỤ TỰ ĐỘNG TẠO LANDING PAGE SỰ KIỆN TẠI THỊ TRƯỜNG VIỆT NAM**

Báo cáo nghiên cứu này cung cấp hệ thống cơ sở dữ liệu chuyên sâu, chuẩn hóa cấu trúc dữ liệu và quy chuẩn thiết kế nhằm phục vụ việc phát triển công cụ tự động tạo giao diện trang đích (Automated Landing Page Builder) dành riêng cho thị trường marketing sự kiện tại Việt Nam giai đoạn 2025–2026. Báo cáo phân tích toàn diện các quy luật chuyển đổi, đặc thụ văn hóa thị giác địa phương, yếu tố phong thủy truyền thống, cũng như các tiêu chuẩn trải nghiệm người dùng (UX) và giao diện (UI) tiên tiến trên toàn cầu1.

## **PHẦN 1 – PHÂN LOẠI SỰ KIỆN VÀ CÁC TỔ HỢP PHỔ BIẾN**

Việc xây dựng một thuật toán sinh giao diện tự động đòi hỏi hệ thống phân loại phải được tổ chức theo ma trận 3 trục độc lập bao gồm Ngành nghề, Loại sự kiện và Mục đích chuyển đổi. Việc kết hợp linh hoạt ba trục này giúp hệ thống đề xuất chính xác bố cục, màu sắc và mẫu nội dung phù hợp cho từng chiến dịch1.

### **1\. Phân loại theo Ngành nghề (Industries)**

> 1. **Công nghệ & Bưu chính Viễn thông (Tech & Telecom)**: Các sự kiện chuyển đổi số, trí tuệ nhân tạo (AI), điện toán đám mây, phần mềm SaaS, chuỗi khối (Web3) và thiết bị viễn thông4. Ngành này đòi hỏi phong cách thiết kế hiện đại, thể hiện tính tiên phong và sự tin cậy cao2.  
> 2. **Giáo dục & Đào tạo (Education & EdTech)**: Tuyển sinh khóa học dài hạn, hội thảo du học, lớp đào tạo kỹ năng ngắn hạn, lập trình bootcamp, chương trình chứng chỉ quốc tế2. Đặc trưng ngành là tập trung vào minh bạch lộ trình, trình độ đội ngũ giảng viên và cam kết đầu ra2.  
> 3. **Làm đẹp, Spa & Thẩm mỹ (Beauty & Aesthetics)**: Workshop chuyển giao công nghệ thẩm mỹ, lễ ra mắt liệu trình làm đẹp, sự kiện tri ân khách hàng thân thiết, khai trương chi nhánh thẩm mỹ viện7. Ngành này yêu cầu tính thẩm mỹ thị giác vượt trội, hình ảnh thực tế chất lượng cao.  
> 4. **F\&B – Thực phẩm & Đồ uống (Food & Beverage)**: Khai trương nhà hàng, quán cafe, lễ hội ẩm thực, sự kiện ra mắt thực đơn mùa mới, workshop pha chế hoặc nấu ăn7. Thiết kế cần kích thích thị giác, màu sắc ấm áp và làm nổi bật các chương trình ưu đãi3.  
> 5. **Bất động sản (Real Estate)**: Lễ mở bán dự án căn hộ, ra mắt biệt thự nghỉ dưỡng, hội thảo phân tích xu hướng đầu tư bất động sản. Ngành đòi hỏi sự sang trọng, đẳng cấp, minh bạch pháp lý và tích hợp sơ đồ mặt bằng trực quan.  
> 6. **Tài chính, Ngân hàng & Bảo hiểm (BFSI)**: Hội thảo quản lý tài sản, ra mắt thẻ tín dụng hoặc ứng dụng đầu tư, webinar tư vấn hoạch định tài chính cá nhân8. Yêu cầu hàng đầu là yếu tố bảo mật, sự minh bạch và tạo dựng niềm tin tuyệt đối2.  
> 7. **Sức khỏe, Y tế & Thể thao (Healthcare & Fitness)**: Giải chạy Marathon, giải đấu thể thao mở rộng, workshop tư vấn dinh dưỡng, lễ khai trương phòng tập Gym/Yoga2. Thiết kế cần truyền tải sự năng động, năng lượng tích cực và tinh thần cộng đồng.  
> 8. **Thời trang & Lối sống (Fashion & Lifestyle)**: Fashion show biểu diễn bộ sưu tập mới, đợt giảm giá đặc quyền (Private Sale), triển lãm xu hướng thời trang. Ngành ưu tiên phong cách thiết kế ấn tượng, tối giản hoặc phá cách để làm nổi bật sản phẩm.  
> 9. **Nghệ thuật, Giải trí & Âm nhạc (Art & Entertainment)**: Đêm nhạc Live Concert, lễ hội âm nhạc ngoài trời, triển lãm nghệ thuật thị giác, buổi gặp gỡ người hâm mộ (Fan meeting)2. Yêu cầu màu sắc bùng nổ, sơ đồ phân hạng vé rõ ràng và trải nghiệm cảm xúc cao2.  
> 10. **Doanh nghiệp & B2B (Corporate & Internal)**: Hội nghị khách hàng B2B, lễ kỷ niệm ngày thành lập công ty, hội nghị tổng kết năm (Gala Dinner), sự kiện truyền thông nội bộ6. Phong cách trang trọng, bám sát bộ nhận diện thương hiệu doanh nghiệp.  
> 11. **Hàng tiêu dùng nhanh (FMCG)**: Sự kiện dùng thử sản phẩm mới tại điểm bán, chiến dịch kích hoạt thương hiệu (Brand Activation), ngày hội gia đình. Yêu cầu màu sắc tươi sáng, tích hợp mini-game hoặc quà tặng tức thì.  
> 12. **Du lịch & Khách sạn (Hospitality & Tourism)**: Hội chợ kích cầu du lịch, lễ mở bán gói nghỉ dưỡng cao cấp, workshop trải nghiệm văn hóa2. Hình ảnh không gian sống động và thông tin gói dịch vụ rõ ràng là yếu tố then chốt2.

### **2\. Phân loại theo Loại sự kiện (Event Types)**

> 1. **Workshop / Lớp học ngắn hạn**: Quy mô từ 20 đến 100 người, thời lượng 2–4 tiếng. Mục tiêu truyền tải kỹ năng thực hành cụ thể hoặc giải quyết một vấn đề chuyên sâu.  
> 2. **Hội thảo / Conference / Summit**: Quy mô từ 100 đến hàng ngàn người, kéo dài từ nửa ngày đến nhiều ngày4. Cấu trúc gồm nhiều phiên chia sẻ parallel tracks và quy tụ nhiều diễn giả4.  
> 3. **Webinar / Sự kiện Trực tuyến**: Diễn ra trên các nền tảng số như Zoom, Google Meet hoặc Livestream8. Chi phí tham dự thấp hoặc miễn phí, hướng tới tập khách hàng rộng lớn trên toàn quốc8.  
> 4. **Lễ Khai trương / Grand Opening**: Sự kiện đánh dấu sự ra mắt của cửa hàng, chi nhánh hoặc địa điểm kinh doanh mới7. Tập trung thu hút sự chú ý của khách hàng tại khu vực địa lý lân cận9.  
> 5. **Lễ Ra mắt Sản phẩm / Product Launch**: Sự kiện giới thiệu sản phẩm hoặc dịch vụ mới ra thị trường, tạo ấn tượng truyền thông mạnh mẽ và kích thích đặt hàng sớm.  
> 6. **Triển lãm / Hội chợ (Exhibition / Expo)**: Quy mô lớn với hàng chục hoặc hàng trăm gian hàng triển lãm, phục vụ cả nhu cầu kết nối B2B lẫn tham quan mua sắm B2C.  
> 7. **Networking / Meetup**: Sự kiện kết nối giao thương, quy mô vừa và nhỏ, đề cao không gian mở để các thành viên trò chuyện và tìm kiếm cơ hội hợp tác.  
> 8. **Live Concert / Lễ hội Âm nhạc**: Sự kiện giải trí quy mô lớn, đòi hỏi hệ thống bán vé chia theo nhiều phân hạng sơ đồ và tích hợp thanh toán trực tuyến.  
> 9. **Khóa học / Bootcamp dài hạn**: Chương trình đào tạo chuyên sâu kéo dài nhiều tuần hoặc nhiều tháng, đòi hỏi quy trình tư vấn và đánh giá đầu vào2.  
> 10. **Cuộc thi / Hackathon**: Sự kiện thi đấu kỹ năng hoặc ý tưởng sáng tạo có lịch trình nhiều vòng đấu, thể lệ phức tạp và cơ cấu giải thưởng lớn10.  
> 11. **Gala Dinner / Lễ Tri ân**: Sự kiện khép kín mang tính chất trang trọng dành cho đối tác VIP, khách hàng thân thiết hoặc nội bộ doanh nghiệp.

### **3\. Phân loại theo Mục đích Sự kiện (Goals)**

> 1. **Bán vé trực tiếp (Direct Ticket Sales)**: Chuyển đổi người xem trang thành người mua vé có thanh toán tiền ngay qua cổng thanh toán tích hợp6.  
> 2. **Thu thập thông tin (Lead Generation)**: Thu thập SĐT, Email và thông tin cá nhân của khách hàng tiềm năng để phục vụ tư vấn chuyên sâu sau đó8.  
> 3. **Tuyển sinh / Chiêu sinh (Student Enrollment)**: Thuyết phục học viên đăng ký tư vấn hoặc giữ chỗ cho các chương trình giáo dục2.  
> 4. **Xây dựng Thương hiệu (Brand Awareness)**: Khẳng định vị thế dẫn đầu trong ngành, truyền thông thông điệp doanh nghiệp đến cộng đồng4.  
> 5. **Tri ân & Chăm sóc Khách hàng (Customer Retention)**: Củng cố mối quan hệ bền chặt với khách hàng hiện hữu thông qua các đặc quyền sự kiện.  
> 6. **Tuyển dụng Nhân sự (Employer Branding)**: Thu hút hồ sơ ứng viên tài năng và quảng bá văn hóa môi trường làm việc10.  
> 7. **Gây quỹ & Tạo tác động Cộng đồng (Fundraising / Community)**: Kêu gọi sự đóng góp tài chính hoặc thu hút thành viên tham gia các hoạt động xã hội.  
> 8. **Truyền thông & Đào tạo Nội bộ (Internal Alignment)**: Thống nhất chiến lược, đào tạo kỹ năng hoặc vinh danh thành tích nhân sự trong tổ chức.

### **4\. Ma trận 12 Tổ hợp Phổ biến nhất tại Thị trường Việt Nam**

| STT | Ngành nghề | Loại sự kiện | Mục đích chính | Tần suất & Đặc điểm chiến dịch tại Việt Nam |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Công nghệ | Conference / Summit | Brand Awareness & Lead Gen | **Rất cao**. Các hội thảo công nghệ lớn như FPT Techday5 hay Vietnam Web Summit4 thu hút hàng ngàn lượt đăng ký, yêu cầu thiết kế hiện đại và đăng ký vé nhanh4. |
| 2 | Giáo dục | Bootcamp / Khóa học | Tuyển sinh (Enrollment) | **Rất cao**. Các trung tâm đào tạo ngắn hạn liên tục đẩy mạnh landing page gom học viên với ưu đãi đăng ký sớm2. |
| 3 | Bất động sản | Lễ mở bán | Bán hàng trực tiếp | **Cao**. Đòi hỏi giao diện sang trọng, tải nhanh trên di động, tích hợp sơ đồ mặt bằng và nút đăng ký nhận căn1. |
| 4 | Làm đẹp / Spa | Workshop / Demo | Thu thập Lead & Bán gói | **Cao**. Đẩy mạnh hình ảnh thực tế trải nghiệm dịch vụ, tặng voucher dùng thử tại chi nhánh7. |
| 5 | Tài chính | Webinar | Thu thập Lead chất lượng | **Cao**. Đề cao sự uy tín, chính xác, tặng e-book hoặc tài liệu phân tích thị trường cho người đăng ký8. |
| 6 | F\&B | Lễ Khai trương | Thu hút khách ghé shop | **Cao**. Tập trung vào yếu tố vị trí địa lý, bản đồ dẫn đường, chương trình đi nhóm tặng quà7. |
| 7 | Sức khỏe / Thể thao | Giải chạy Marathon | Bán vé (Sponsor & Runner) | **Đang tăng nhanh**. Bán vé theo đợt Super Early Bird, Early Bird, Regular; hiển thị bảng chọn size áo runner. |
| 8 | Giải trí | Live Concert | Bán vé trực tiếp | **Cao**. Yêu cầu hiển thị sơ đồ phân hạng ghế ngồi (Seat map) rõ ràng và thanh toán vé điện tử6. |
| 9 | Doanh nghiệp | Gala Dinner / Tri ân | Chăm sóc đối tác/Nội bộ | **Cao (Cuối năm)**. Yêu cầu nhập mã VIP riêng biệt, quy trình xác nhận tham dự qua mã QR tiện lợi. |
| 10 | Công nghệ | Hackathon / Cuộc thi | Tuyển dụng & Branding | **Trung bình \- Cao**. Lịch trình thi đấu nhiều giai đoạn, thể lệ giải thưởng lớn, nổi bật logo nhà tài trợ4. |
| 11 | Thời trang | Private Sale / Launch | Bán hàng & VIP Lead | **Trung bình**. Tạo cảm giác độc bản, đếm ngược thời gian giới hạn số lượng khách mời nhận mã ưu đãi. |
| 12 | FMCG | Brand Activation | Thu lead & Trải nghiệm | **Trung bình**. Quét mã QR nhận quà ngay tại điểm bán, form đăng ký siêu ngắn để không gây ùn tắc1. |

## **PHẦN 2 – CẤU TRÚC THÔNG TIN VÀ TỐI ƯU FORM ĐĂNG KÝ**

Sự thành công của công cụ tự động tạo trang đích phụ thuộc vào việc cấu hình chuẩn xác các trường thông tin đầu vào từ ban tổ chức và tối ưu hóa trải nghiệm điền form của người tham dự để đạt tỷ lệ chuyển đổi cao nhất1.

### **1\. Dữ liệu Đầu vào từ Ban Tổ chức (Organizer Input Schema)**

| Loại sự kiện | Trường thông tin BẮT BUỘC nhập | Trường thông tin TÙY CHỌN nên có |
| :---- | :---- | :---- |
| **Workshop / Lớp học** | Tên sự kiện, Thời gian bắt đầu/kết thúc, Địa điểm trực tiếp hoặc Link trực tuyến, Giá vé (hoặc Miễn phí), 3 lợi ích cốt lõi, Thông tin diễn giả, Form đăng ký. | Tài liệu tặng kèm, Bộ câu hỏi FAQ, Chính sách hoàn hủy vé, Số lượng chỗ ngồi còn lại. |
| **Hội thảo / Conference** | Tên hội thảo, Chủ đề chính, Thời gian, Địa điểm cụ thể, Danh sách diễn giả, Agenda chi tiết từng phiên, Các hạng vé, Logo Nhà tài trợ4, Form đăng ký. | Video highlight kỳ trước11, Sơ đồ vị trí không gian, Hướng dẫn đỗ xe, Khách sạn gợi ý xung quanh. |
| **Webinar** | Tên Webinar, Thời gian phát sóng, Nền tảng (Zoom/Meet/Livestream), Tóm tắt nội dung chia sẻ, Thông tin Speaker, Form đăng ký. | Ebook tài liệu tải về13, Quà tặng khi xem đến cuối buổi, Khảo sát câu hỏi trước sự kiện. |
| **Khai trương / Launch** | Tên sự kiện, Ngày giờ mở cửa, Địa điểm và Bản đồ Google Maps, Chương trình ưu đãi đặc biệt (Voucher/Gift)7, Form đăng ký nhận quà. | Khách mời nổi tiếng (KOLs), Bộ sưu tập hình ảnh sản phẩm/không gian, Lịch trình biểu diễn. |
| **Concert / Giải trí** | Tên Concert, Dàn nghệ sĩ (Lineup), Ngày & Giờ mở cửa/biểu diễn, Địa điểm, Sơ đồ hạng vé, Bảng giá chi tiết, Cổng thanh toán. | Quy định độ tuổi, Danh mục vật dụng cấm mang vào, Hướng dẫn đổi vòng tay/vé cứng. |
| **Cuộc thi / Hackathon** | Tên cuộc thi, Cơ cấu và giá trị giải thưởng, Đối tượng tham gia, Lịch trình các vòng đấu, Hội đồng giám khảo, Thể lệ thi đấu10. | Đơn vị đồng hành truyền thông, Đội ngũ Mentor, FAQ thể lệ, Dự án thắng cuộc mùa trước. |

### **2\. Tối ưu Form Đăng ký Người tham dự (Attendee Form Optimization)**

Tỷ lệ bỏ dở form đăng ký là nguyên nhân hàng đầu làm sụt giảm hiệu quả chiến dịch12. Dữ liệu nghiên cứu thực tế cho thấy có tới 55% người truy cập rời đi nếu gặp form đăng ký phức tạp12. Các sự kiện đạt tỷ lệ chuyển đổi cao thường giữ tổng số câu hỏi dưới mức 20, trong đó các trang đích tối ưu chỉ duy trì form từ 3 đến 5 trường thông tin1.  
Phân tích hiệu suất chuyển đổi theo số lượng trường cho thấy form 3 trường (Họ tên, SĐT, Email) đạt mức chuyển đổi lý tưởng nhất, dao động từ 12% đến 15%12. Khi tăng lên 5 trường, tỷ lệ chuyển đổi bắt đầu giảm nhẹ khoảng 10%12. Nếu form có từ 7 trường trở lên, tỷ lệ hoàn tất form sụt giảm nghiêm trọng từ 30% đến 45%1. Đặc biệt, việc yêu cầu nhập ô tự do như "Chức vụ" hoặc "Tên công ty" trên giao diện di động làm sụt giảm tới 15%–25% tỷ lệ hoàn thành form do ma sát bàn phím gõ tay1.  
Các trường nên thu thập được phân loại theo mục đích sự kiện:

* *Sự kiện B2C / Miễn phí / Cần quy mô lớn*: Chỉ yêu cầu Họ tên, Số điện thoại, Email12. Giữ độ ma sát ở mức tối thiểu để đạt lượt đăng ký cao nhất1.  
* *Sự kiện B2B / Chuyên ngành / VIP*: Yêu cầu Họ tên, Email công việc, Số điện thoại, Tên công ty, Chức vụ12. Bắt buộc thu thập để lọc chất lượng Lead dù có thể làm giảm nhẹ tỷ lệ đăng ký thô12.  
* *Sự kiện Có phí / Bán vé*: Họ tên, Email (nhận vé điện tử), SĐT, Hạng vé lựa chọn, Phương thức thanh toán.

Để khắc phục các điểm ma sát (Friction Points), hệ thống cần thay thế các trường nhập chữ tự do bằng menu chọn sẵn (Dropdown)1. Bỏ hoàn toàn trường yêu cầu địa chỉ nhà riêng trừ khi cần giao quà vật lý. Ngoài ra, việc dùng CAPTCHA hình ảnh phức tạp làm tăng 12% tỷ lệ thoát form, do đó cần thay bằng công nghệ ẩn như Google reCAPTCHA v3.

## **PHẦN 3 – CẤU TRÚC SECTION, COPYWRITING VÀ TÍNH NĂNG UX CRO**

Tỷ lệ chuyển đổi trung bình của landing page sự kiện toàn cầu đạt khoảng 13.4% (trung vị là 5.2%)2. Để đưa trang đích vào top 20% hiệu suất cao nhất (CVR \> 15%), cấu trúc trang và nội dung cần được tối ưu theo tâm lý hành vi2.

### **1\. Thứ tự Section Tối ưu theo Loại Sự kiện**

#### **A. Cấu trúc cho Hội thảo B2B Summit / Conference quy mô lớn**

> 1. **Hero Section**: Tiêu đề truyền cảm hứng, ngày giờ, địa điểm, nút CTA chính ("Đăng ký vé Early Bird") và video ngắn tổng thuật kỳ trước1.  
> 2. **Key Stats (Thống kê ấn tượng)**: Hiển thị các con số bảo chứng quy mô (ví dụ: "50+ Diễn giả | 2,000+ Khách tham dự | 30+ Phiên chia sẻ")4.  
> 3. **Problem & Value Proposition (Thực trạng & Giá trị)**: Lý do sự kiện diễn ra và 3 giá trị lớn nhất người tham dự nhận được2.  
> 4. **Speaker Grid (Đội ngũ diễn giả)**: Ảnh chân dung chuyên nghiệp, tên, chức danh và logo tập đoàn của các diễn giả1.  
> 5. **Agenda / Schedule (Lịch trình tương tác)**: Bảng lịch trình chia theo khung giờ và các phòng thảo luận song song4.  
> 6. **Ticket Pricing Table (Bảng giá vé)**: So sánh quyền lợi giữa các hạng vé Standard, VIP, Executive1.  
> 7. **Sponsors & Partners (Nhà tài trợ)**: Logo các đơn vị đồng hành giúp gia tăng tối đa niềm tin2.  
> 8. **Testimonials / Social Proof (Đánh giá)**: Trích dẫn nhận xét của chuyên gia và khách tham dự mùa trước2.  
> 9. **FAQ & Venue Map (Hỏi đáp & Bản đồ)**: Giải đáp thắc mắc thủ tục và bản đồ di chuyển Google Maps.  
> 10. **Footer & Sticky CTA Bar**: Thanh đăng ký nhanh luôn cố định ở chân màn hình8.

#### **B. Cấu trúc cho Khóa học / Bootcamp / Educational Workshop**

> 1. **Hero Section**: Headline xoáy vào nỗi đau cốt lõi, sub-headline giải pháp và form đăng ký thu gọn ngay bên phải màn hình2.  
> 2. **Nỗi đau & Thực trạng (Agitation)**: Liệt kê các rào cản và khó khăn đối tượng mục tiêu đang gặp phải2.  
> 3. **Lộ trình Đào tạo (Curriculum)**: Lịch trình chi tiết từng buổi học và kết quả đầu ra cam kết2.  
> 4. **Giảng viên / Chuyên gia (Expert Bio)**: Hồ sơ năng lực, thành tựu thực tế và uy tín của người giảng dạy1.  
> 5. **Bằng chứng Thực tế (Student Proof)**: Hình ảnh sản phẩm, con số tăng trưởng hoặc cảm nhận của học viên cũ2.  
> 6. **Bảng giá & Quà tặng Đi kèm (Bonuses)**: Đặt giá niêm yết cạnh giá ưu đãi kèm bộ đếm ngược thời hạn.  
> 7. **Cam kết Chất lượng (Guarantee)**: Cam kết hoàn tiền hoặc học lại miễn phí nếu không đạt chất lượng.  
> 8. **FAQ & Form Đăng ký Cuối trang**2.

### **2\. Công thức Copywriting và Mẫu Nội dung Tối ưu**

#### **A. Mẫu Headline, Sub-headline và Nút CTA theo Mục đích Sự kiện**

| Mục đích sự kiện | Mẫu Headline hiệu quả | Mẫu Sub-headline | 5 Ví dụ Nút CTA Tiếng Việt tối ưu |
| :---- | :---- | :---- | :---- |
| **Bán vé trực tiếp** | Bứt Phá Doanh Số 2026: Chiến Lược Từ Các Tập Đoàn Dẫn Đầu | Hội tụ 20+ Chuyên gia hàng đầu tại TP.HCM. Số lượng vé Early Bird có hạn1. | 1\. Mua Vé Early Bird (Tiết kiệm 30%) 2\. Giữ Chỗ Ngay \- Giá Ưu Đãi 3\. Chọn Hạng Vé Của Bạn 4\. Đăng Ký Tham Dự Ngay 5\. Mua Vé VIP Ngay |
| **Thu thập Lead** | Bí Quyết Ứng Dụng AI Vào Tự Động Hóa Doanh Nghiệp | Nhận trọn bộ Tài liệu hướng dẫn \+ Tham dự Webinar miễn phí cùng Chuyên gia8. | 1\. Nhận Vé Mời Miễn Phí 2\. Đăng Ký Giữ Chỗ Online 3\. Nhận Tài Liệu & Link Zoom 4\. Tải Vé Tham Dự Miễn Phí 5\. Cho Tôi Tham Gia Webinar |
| **Tuyển sinh** | Làm Chủ Kỹ Năng Bất Động Sản Cao Cấp Sau 6 Tuần Đào Tạo | Lộ trình thực chiến 100%. Cam kết kết nối việc làm ngay sau khi hoàn thành2. | 1\. Nhận Lộ Trình & Học Bổng 2\. Tư Vấn Miễn Phí 1-1 3\. Đăng Ký Học Thử Miễn Phí 4\. Giữ Suất Ưu Đãi 50% 5\. Nộp Đơn Tuyển Sinh Ngay |
| **Xây dựng Thương hiệu** | Diễn Đàn Công Nghệ Tương Lai: Định Hình Kỷ Nguyên Mới14 | Sự kiện thường niên quy tụ hơn 5.000 lãnh đạo và chuyên gia công nghệ5. | 1\. Khám Phá Lịch Trình Sự Kiện 2\. Xóa Tan Rào Cản Công Nghệ 3\. Xem Danh Sách Diễn Giả 4\. Đăng Ký Tham Gia Triển Lãm 5\. Trải Nghiệm Công Nghệ Ngay |
| **Tri ân / Nội bộ** | Gala Dinner 2026: Hành Trình Rực Rỡ \- Kết Nối Vươn Xa | Lễ vinh danh và đêm nhạc tri ân toàn thể Đối tác và Cán bộ Nhân viên14. | 1\. Xác Nhận Tham Dự (RSVP) 2\. Đăng Ký Tham Gia Đêm Gala 3\. Tải Thư Mời Của BẠN 4\. Giữ Chỗ Tiệc Tri Ân 5\. Xác Nhận Tham Gia Ngay |

#### **B. Công thức Viết 3 Bullet Lợi ích (3-Bullet Benefit Technique)**

Để tối ưu hóa thói quen đọc lướt trên thiết bị di động, phần lợi ích cần tuân thủ cấu trúc 3 ý đắt giá gồm: Hành động/Kỹ năng nhận được, Lợi ích đo lường được, và Loại bỏ rủi ro thời gian hoặc công sức1.

* *Bullet 1 (Giá trị cốt lõi)*: Nắm vững toàn bộ tư duy chiến lược marketing mới nhất năm 2026 chỉ sau 1 ngày học thực chiến2.  
* *Bullet 2 (Tính ứng dụng)*: Sở hữu ngay bộ công cụ 15+ Mẫu Template Landing Page có thể nhân bản và đưa vào vận hành hệ thống lập tức1.  
* *Bullet 3 (Giải tỏa rủi ro)*: Mọi kiến thức đều được đóng gói đơn giản hóa cho người mới, không yêu cầu kinh nghiệm lập trình hay kỹ thuật phức tạp13.

#### **C. Kỹ thuật Tạo Khan hiếm & FOMO Hợp đạo đức (Ethical Urgency)**

Việc sử dụng bộ đếm ngược ảo lặp đi lặp lại khi F5 trang sẽ làm mất niềm tin của khách hàng. Thay vào đó, cần ứng dụng kỹ thuật đếm ngược theo mốc thời gian thực của từng đợt bán vé (như kết thúc đợt Early Bird). Hiển thị con số vé thực tế còn lại trong kho dữ liệu (như "Chỉ còn 12/100 vé VIP dành cho người đăng ký sớm"). Ngoài ra, tích hợp thông báo nhảy (Notification Popup) hiển thị lượt đăng ký thật từ API theo thời gian thực để tạo bảo chứng cộng đồng8.

### **3\. Các Tính năng UX/UI Giúp Tăng Chuyển đổi (CRO Elements)**

Nghiên cứu cho thấy các trang đích chỉ tập trung vào một CTA duy nhất đạt tỷ lệ chuyển đổi trung bình 13.5%, cao hơn đáng kể so với mức 10.5% của các trang chứa từ 5 liên kết trở lên1. Tích hợp video ngắn minh họa ở phần Hero có thể giúp tăng chuyển đổi lên tới 86%11.  
Do lưu lượng truy cập qua thiết bị di động chiếm từ 54.6% đến 61.2% tổng lượng truy cập1, việc bổ sung thanh Sticky CTA cố định ở đáy màn hình điện thoại giúp người dùng bấm đăng ký bất kỳ lúc nào mà không cần cuộn ngược lên đầu trang, giúp nâng tỷ lệ CVR thêm 14%–22%. Đồng thời, việc thu gọn danh sách câu hỏi FAQ thành dạng xổ xuống (Accordion) giúp giảm độ dài trang di động, tránh hiện tượng quá tải thông tin2.

### **4\. Các Lỗi Thường gặp Làm Giảm Chuyển đổi trên Landing Page Sự kiện**

Mất tới 88% người dùng không bao giờ quay lại nếu trang web bị lỗi hoặc tốc độ tải trang quá chậm1. Việc nhồi nhét hình ảnh dung lượng lớn làm trang tải chậm trên 3 giây sẽ khiến tỷ lệ thoát trang tăng vọt1. Một lỗi phổ biến khác là che khuất thông tin Thời gian và Địa điểm tổ chức ở dưới chân trang thay vì đặt ngay tại khung nhìn đầu tiên (Above-the-fold). Ngoài ra, viết đoạn văn xuôi dài trên 350 từ ở phần giới thiệu Hero làm giảm điểm tập trung thị giác, và dùng màu nút CTA chìm vào màu nền khiến người dùng khó nhận biết điểm tương tác2.

## **PHẦN 4 – BẢNG MÀU THIẾT KẾ VÀ YẾU TỐ PHONG THỦY VIỆT NAM**

Màu sắc trong thiết kế web tại Việt Nam không chỉ đảm bảo thẩm mỹ thị giác mà còn chịu ảnh hưởng sâu sắc bởi tâm lý văn hóa và quan niệm ngũ hành phong thủy3. Hệ thống dưới đây gồm 16 bảng màu phối sẵn, đạt chuẩn tương phản WCAG AA (![][image1] cho chữ thường).

### **1\. Hệ thống 16 Bảng màu Chuẩn hóa cho Công cụ**

| ID | Tên bảng màu & Phong cách | Primary | Secondary | Accent | Background | Surface | Text Main | Text Muted | Ngành / Sự kiện phù hợp | WCAG AA | Dark Mode Option |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **PAL\_01** | **Tech Corporate** (Tin cậy, Chuyên nghiệp) | \#1E3A8A | \#3B82F6 | \#F59E0B | \#F8FAFC | \#FFFFFF | \#0F172A | \#475569 | Công nghệ, Tài chính, Summit B2B4 | Đạt (7.2:1) | Primary: \#3B82F6, BG: \#0F172A, Surface: \#1E293B, Text: \#F8FAFC |
| **PAL\_02** | **Khai Trương Thịnh Vượng** (May mắn, Năng lượng) | \#DC2626 | \#B91C1C | \#FBBF24 | \#FFFBEB | \#FFFFFF | \#450A0A | \#78350F | Khai trương, F\&B, Mở bán BĐS, Tết3 | Đạt (5.8:1) | Primary: \#EF4444, BG: \#18181B, Surface: \#27272A, Text: \#FAFAFA |
| **PAL\_03** | **Pastel Nữ Tính** (Nhẹ nhàng, Tinh tế) | \#EC4899 | \#F472B6 | \#10B981 | \#FDF2F8 | \#FFFFFF | \#831843 | \#9D174D | Làm đẹp, Spa, Fashion, Workshop | Đạt (5.1:1) | Primary: \#F472B6, BG: \#1C1917, Surface: \#292524, Text: \#FDF2F8 |
| **PAL\_04** | **Sang Trọng Gala** (Đẳng cấp, VIP) | \#D97706 | \#78350F | \#F59E0B | \#0F172A | \#1E293B | \#F8FAFC | \#94A3B8 | Gala Dinner, Private Sale, Award Show | Đạt (8.4:1) | *Giao diện tối chuẩn hóa sẵn* |
| **PAL\_05** | **Giáo Dục Tri Thức** (Điềm tĩnh, Tập trung) | \#0369A1 | \#0284C7 | \#F97316 | \#F0F9FF | \#FFFFFF | \#0C4A6E | \#38BDF8 | Khóa học, Bootcamp, Webinar2 | Đạt (6.5:1) | Primary: \#38BDF8, BG: \#082F49, Surface: \#0C4A6E, Text: \#F0F9FF |
| **PAL\_06** | **Sức Khỏe Năng Động** (Tươi mới, Bứt phá) | \#15803D | \#22C55E | \#EAB308 | \#F0FDF4 | \#FFFFFF | \#14532D | \#166534 | Giải chạy, Gym, Y tế, Thể thao2 | Đạt (5.6:1) | Primary: \#4ADE80, BG: \#052E16, Surface: \#14532D, Text: \#F0FDF4 |
| **PAL\_07** | **Cyberpunk Tech** (Đột phá, Web3) | \#8B5CF6 | \#A855F7 | \#06B6D4 | \#090D16 | \#111827 | \#F9FAFB | \#9CA3AF | Hackathon, AI Expo, Concert Quẩy10 | Đạt (9.1:1) | *Giao diện tối chuẩn hóa sẵn* |
| **PAL\_08** | **Minimalist Đen Trắng** (Tối giản, Hiện đại) | \#18181B | \#3F3F46 | \#2563EB | \#FAFAFA | \#FFFFFF | \#09090B | \#71717A | Triển lãm Nghệ thuật, Design Show | Đạt (12.5:1) | Primary: \#FAFAFA, BG: \#09090B, Surface: \#18181B, Text: \#FAFAFA |
| **PAL\_09** | **Trà Đạo & Mộc Mạc** (Ấm áp, Truyền thống) | \#78350F | \#92400E | \#059669 | \#FEF3C7 | \#FFFFFF | \#451A03 | \#78350F | F\&B truyền thống, Workshop Thủ công | Đạt (5.3:1) | Primary: \#FBBF24, BG: \#1C1917, Surface: \#292524, Text: \#FEF3C7 |
| **PAL\_10** | **Bất Động Sản Hoàng Gia** (Vững chắc, Phú quý) | \#1E3A8A | \#1E40AF | \#D97706 | \#F8FAFC | \#FFFFFF | \#1E1B4B | \#4338CA | Mở bán Căn hộ, Resort, Biệt thự | Đạt (7.0:1) | Primary: \#60A5FA, BG: \#0F172A, Surface: \#1E293B, Text: \#F8FAFC |
| **PAL\_11** | **Thời Trang Thu Đông** (Trầm ấm, Quý phái) | \#881337 | \#9F1239 | \#F59E0B | \#FFF1F2 | \#FFFFFF | \#4C0519 | \#9F1239 | Fashion Show, Ra mắt Bàn sưu tập | Đạt (6.2:1) | Primary: \#FB7185, BG: \#1F2937, Surface: \#374151, Text: \#FFF1F2 |
| **PAL\_12** | **Cộng Đồng Thiện Nguyện** (Ấm áp, Chân thành) | \#EA580C | \#C2410C | \#0284C7 | \#FFF7ED | \#FFFFFF | \#7C2D12 | \#9A3412 | Gây quỹ, Sự kiện Từ thiện, Ngoại khóa | Đạt (5.4:1) | Primary: \#FB923C, BG: \#1C1917, Surface: \#292524, Text: \#FFF7ED |
| **PAL\_13** | **Đại Nhạc Hội Mùa Hè** (Bùng nổ, Nhiệt đới) | \#0284C7 | \#06B6D4 | \#F43F5E | \#F0F9FF | \#FFFFFF | \#0C4A6E | \#0369A1 | Lễ hội Âm nhạc, EDM, Fan Meeting | Đạt (5.9:1) | Primary: \#38BDF8, BG: \#0F172A, Surface: \#1E293B, Text: \#F0F9FF |
| **PAL\_14** | **Tài Chính Xanh (ESG)** (Bền vững, Đổi mới) | \#047857 | \#059669 | \#0284C7 | \#ECFDF5 | \#FFFFFF | \#064E3B | \#047857 | Hội thảo Tăng trưởng xanh, Investment | Đạt (6.1:1) | Primary: \#34D399, BG: \#064E3B, Surface: \#047857, Text: \#ECFDF5 |
| **PAL\_15** | **Thiếu Nhi & Gia Đình** (Vui tươi, Thân thiện) | \#CA8A04 | \#EAB308 | \#2563EB | \#FEFCE8 | \#FFFFFF | \#713F12 | \#A16207 | Sự kiện Thiếu nhi, Ngày hội Gia đình | Đạt (5.1:1) | Primary: \#FACC15, BG: \#1C1917, Surface: \#292524, Text: \#FEFCE8 |
| **PAL\_16** | **Du Lịch Trải Nghiệm** (Phóng khoáng, Tự do) | \#0D9488 | \#14B8A6 | \#F97316 | \#CCFBF1 | \#FFFFFF | \#134E4A | \#0F766E | Hội chợ Du lịch, Phượt, Retreat | Đạt (5.7:1) | Primary: \#2DD4BF, BG: \#042F2C, Surface: \#134E4A, Text: \#CCFBF1 |

### **2\. Ý nghĩa Văn hóa và Yếu tố Phong thủy Màu sắc**

Văn hóa Việt Nam coi trọng ý nghĩa biểu tượng của màu sắc trong các dịp trọng đại3. Màu Đỏ thuộc hành Hỏa và màu Vàng thuộc hành Kim tượng trưng cho may mắn, tài lộc, hỷ sự và sự phát triển thịnh vượng3. Đây là hai tông màu bắt buộc được ưu tiên khi cấu hình tự động cho các sự kiện Khai trương cửa hàng, Mở bán Bất động sản, Lễ kỷ niệm doanh nghiệp và Sự kiện dịp Tết3.  
Màu Xanh Dương thuộc hành Thủy gợi liên tưởng tới sự bình yên, trí tuệ và bảo chứng chính thống9. Tông màu này rất được ưa chuộng trong các hội thảo Tài chính, Ngân hàng và Giáo dục9. Màu Xanh Lá đại diện cho hành Mộc, biểu thị sự sinh sôi, năng lượng tươi mới và phát triển bền vững, lý tưởng cho các ngành Y tế, Thể thao và Nông nghiệp3.  
Ngược lại, ban tổ chức nên tránh dùng quá nhiều màu Trắng đục hoặc Xám lạnh làm nền chủ đạo trong các sự kiện Khai trương hoặc Tết vì theo quan niệm dân gian, đây là các tông màu thiếu sinh khí3. Tuy nhiên, trong phong cách thiết kế tối giản hiện đại (Minimalism), màu trắng vẫn có thể kết hợp hiệu quả nếu đi kèm với màu nhấn rực rỡ9.

### **3\. Xu hướng Màu sắc Thiết kế Web 2025–2026**

Xu hướng màu sắc nổi bật giai đoạn 2025–2026 là sự lên ngôi của các gam màu kỹ thuật số dồi dào năng lượng như Digital Lavender (Tím hoa oải hương kỹ thuật số) và Neo-Mint (Xanh bạc hà tân tiến). Đồng thời, giao diện tối độ tương phản cao (High-Contrast Dark Mode) kết hợp các chi tiết phát sáng dải màu Neon đang trở thành chuẩn mực cho các sự kiện công nghệ AI, Web3 và Đêm nhạc10.

## **PHẦN 5 – TYPOGRAPHY VÀ PHONG CÁCH GIAO DIỆN UI**

Typography giữ vai trò quyết định đến trải nghiệm đọc và nhịp điệu thị giác. Tất cả cặp phông chữ đề xuất đều miễn phí trên Google Fonts, có sẵn bảng ký tự hiển thị tốt tiếng Việt có dấu17.

### **1\. 10 Cặp Font Tiếng Việt Tối ưu (Heading & Body)**

| STT | Cặp Font (Heading / Body) | Phong cách Thiết kế | Desktop Size (H1 / H2 / Body) | Mobile Size (H1 / H2 / Body) | Ngành / Sự kiện Phù hợp |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | **Montserrat** / **Open Sans** | Hiện đại, Đột phá | 48px / 32px / 16px | 32px / 24px / 15px | Công nghệ, Hội thảo, Startup19 |
| 2 | **Playfair Display** / **Be Vietnam Pro** | Sang trọng, Cổ điển | 52px / 36px / 16px | 34px / 24px / 15px | Gala, Thời trang, Bất động sản VIP18 |
| 3 | **Be Vietnam Pro (Bold)** / **Be Vietnam Pro (Regular)** | Chuẩn bản địa, Tối giản | 44px / 28px / 16px | 30px / 22px / 15px | Mọi loại sự kiện (Chuẩn mực an toàn) |
| 4 | **Roboto Condensed** / **Roboto** | Trang trọng, Cô đọng | 48px / 32px / 16px | 32px / 24px / 15px | Doanh nghiệp, B2B Summit, Y tế19 |
| 5 | **Merriweather** / **Inter** | Học thuật, Tin cậy | 42px / 28px / 16px | 28px / 22px / 15px | Giáo dục, Webinar Tài chính, Khóa học |
| 6 | **Space Grotesk** / **Inter** | Cyberpunk, Hi-Tech | 50px / 34px / 15px | 32px / 24px / 14px | Hackathon, AI Expo, Web310 |
| 7 | **Quicksand (Bold)** / **Quicksand (Regular)** | Thân thiện, Bo tròn | 44px / 28px / 16px | 30px / 22px / 15px | F\&B, Thiếu nhi, Workshop Thể thao |
| 8 | **Plus Jakarta Sans** / **Inter** | SaaS Style, Tinh tế | 46px / 30px / 16px | 32px / 22px / 15px | Product Launch, Công nghệ SaaS |
| 9 | **Cormorant Garamond** / **Noto Serif** | Nghệ thuật, Di sản | 54px / 36px / 17px | 36px / 26px / 15px | Triển lãm Nghệ thuật, Nhạc kịch |
| 10 | **Oswald** / **Lexend** | Mạnh mẽ, Thể thao | 52px / 32px / 16px | 36px / 24px / 15px | Giải chạy Marathon, Fitness Fest |

### **2\. Các Phong cách Thiết kế Giao diện Phổ biến**

Bố cục dạng ô cờ (Bento Grid Architecture) chia trang thành các thẻ thông tin độc lập có kích thước khác nhau. Phong cách này mang lại sự gọn gàng, tính hiện đại cao và đặc biệt thích hợp cho các sự kiện Công nghệ, Hội thảo B2B và Lễ ra mắt sản phẩm4.  
Hiệu ứng kính mờ (Glassmorphism) ứng dụng kỹ thuật làm mờ nền phía sau kết hợp viền bán trong suốt. Phong cách này đem đến cảm giác xa xỉ, hiện đại, thích hợp cho sự kiện Web3, AI Summit và Lễ hội âm nhạc EDM.  
Phong cách Tối giản sắc nét (Clean Minimalism) ưu tiên khoảng trắng rộng, sử dụng cỡ chữ Typography lớn làm điểm nhấn chính và loại bỏ các hiệu ứng cầu kỳ. Đây là lựa chọn tối ưu cho Triển lãm thời trang, Mở bán Bất động sản hạng sang và Hội thảo cấp cao.

### **3\. Bộ Icon Miễn phí Nâng cao**

Công cụ nên tích hợp hệ thống bộ icon mã nguồn mở Remix Icon và Lucide Icons. Hai bộ icon này có dung lượng nhẹ, hỗ trợ đầy đủ dạng nét mảnh (Line) lẫn khối (Fill), tương thích hoàn hảo với các framework lập trình React và Vue.

## **PHẦN 6 – THAM KHẢO VÀ PHÂN TÍCH THỰC TẾ TẠI VIỆT NAM**

Việc đánh giá các landing page sự kiện thực tế thành công tại Việt Nam giúp đúc kết những ưu điểm thiết kế cần đưa vào thuật toán của builder.

| STT | Tên sự kiện | Ngành nghề | Điểm mạnh Kiến trúc & Trải nghiệm Chuyển đổi |
| :---- | :---- | :---- | :---- |
| 1 | **FPT Techday** \[cite: 5, 20\] | Công nghệ | Hero Section nhúng video 3D ấn tượng; Bố cục phân luồng rõ ràng cho khách B2B và khách đăng ký tự do; Tích hợp hệ thống QR Code check-in tự động5. |
| 2 | **Vietnam Web Summit** \[cite: 4\] | Công nghệ | Ma trận Diễn giả ấn tượng tích hợp bộ lọc theo chủ đề bài chia sẻ; Khối danh sách Nhà tài trợ phân cấp (Diamond, Gold, Silver) chuyên nghiệp4. |
| 3 | **Techfest Vietnam** \[cite: 10, 21\] | Startup / Quốc gia | Tích hợp đa ngôn ngữ (Việt \- Anh); Lịch trình chuỗi sự kiện được chia nhỏ theo các Làng công nghệ (Tech Villages) trực quan10. |
| 4 | **VSMC (Sales & Marketing Camp)** | Marketing | Copywriting sắc bén; Bảng so sánh quyền lợi các hạng vé (Standard vs VIP) rõ ràng kèm đồng hồ đếm ngược thời hạn ưu đãi1. |
| 5 | **MindX Coding Bootcamp** \[cite: 2, 6\] | Giáo dục | Form đăng ký luôn hiện hữu; Hiển thị minh chứng học viên thành công kèm con số tăng trưởng thu nhập thực tế giúp củng cố niềm tin2. |
| 6 | **Aquafina VIFW** | Thời trang | Giao diện tràn màn hình tôn vinh bộ sưu tập; Nút CTA dẫn trực tiếp tới cổng mua vé nhanh chóng. |
| 7 | **VPBank Hanoi Marathon** | Thể thao | Bảng hiển thị cự ly (42km, 21km, 10km) trực quan; Sơ đồ đường chạy (Route map) chi tiết kèm các trạm tiếp nước. |
| 8 | **Shopee University Workshop** | E-commerce | Bố cục tối giản; Nhấn mạnh yếu tố "Miễn Phí" \+ "Số lượng chỗ ngồi có hạn"; Form điền siêu ngắn chỉ 2 trường1. |
| 9 | **Sun Group BĐS Launching** | Bất động sản | Đồ họa phối cảnh 3D đẳng cấp; Video teaser nhúng mượt mà; Form đăng ký riêng tư dạng "Nhận Thư Mời VIP". |
| 10 | **FE Credit FinTech Webinar** | Tài chính | Sử dụng gam màu xanh tin cậy; Tích hợp khối câu hỏi khảo sát nhanh trước sự kiện để tăng tương tác tương tác người dùng8. |
| 11 | **SABECO Chill Fest** | F\&B / Giải trí | Phong cách Cyberpunk trẻ trung; Tích hợp Mini-game quay số may mắn nhận vé Fanzone ngay trên trang đích. |
| 12 | **VinUni Admission Day** | Giáo dục | Phong cách Sang trọng Học thuật; Lịch trình dẫn tour campus minh bạch; Hệ thống đặt lịch hẹn tư vấn 1-1 tối ưu. |

## **PHẦN 7 – TỔNG HỢP DỮ LIỆU CẤU TRÚC JSON (DÙNG CHO LẬP TRÌNH)**

Khối dữ liệu JSON dưới đây đóng gói toàn bộ danh mục phân loại, trường dữ liệu, công thức copywriting, bảng màu chuẩn WCAG AA và cặp phông chữ đã được nghiên cứu. Lập trình viên có thể sử dụng trực tiếp khối dữ liệu này làm dữ liệu khởi tạo hệ thống (Database Seeder).

JSON  
{  
  "industries": \[  
    {  
      "id": "ind\_tech",  
      "name": "Công nghệ & Bưu chính Viễn thông",  
      "description": "Dành cho các sự kiện chuyển đổi số, công nghệ phần mềm, AI, Web3, phần cứng"  
    },  
    {  
      "id": "ind\_edu",  
      "name": "Giáo dục & Đào tạo",  
      "description": "Dành cho tuyển sinh khóa học, hội thảo du học, bootcamp, chứng chỉ chuyên môn"  
    },  
    {  
      "id": "ind\_beauty",  
      "name": "Làm đẹp, Spa & Thẩm mỹ",  
      "description": "Dành cho workshop chuyển giao công nghệ làm đẹp, ra mắt liệu trình mới"  
    },  
    {  
      "id": "ind\_fnb",  
      "name": "F\&B \- Thực phẩm & Đồ uống",  
      "description": "Dành cho khai trương quán, lễ hội ẩm thực, ra mắt menu mới"  
    },  
    {  
      "id": "ind\_realestate",  
      "name": "Bất động sản",  
      "description": "Dành cho lễ mở bán dự án, ra mắt căn hộ mẫu, hội thảo đầu tư BĐS"  
    },  
    {  
      "id": "ind\_finance",  
      "name": "Tài chính, Ngân hàng & Bảo hiểm",  
      "description": "Dành cho hội thảo quản lý tài sản, ra mắt ứng dụng tài chính, webinar đầu tư"  
    },  
    {  
      "id": "ind\_health",  
      "name": "Sức khỏe, Y tế & Thể thao",  
      "description": "Dành cho giải chạy marathon, hội thảo y tế, khai trương phòng tập"  
    },  
    {  
      "id": "ind\_fashion",  
      "name": "Thời trang & Lối sống",  
      "description": "Dành cho Fashion show, ra mắt bộ sưu tập mới, đợt giảm giá riêng tư"  
    },  
    {  
      "id": "ind\_entertainment",  
      "name": "Nghệ thuật, Giải trí & Âm nhạc",  
      "description": "Dành cho Live concert, lễ hội âm nhạc, triển lãm nghệ thuật"  
    },  
    {  
      "id": "ind\_corporate",  
      "name": "Doanh nghiệp & B2B",  
      "description": "Dành cho hội nghị đại lý, lễ kỷ niệm thành lập, Gala Dinner, Town Hall"  
    }  
  \],  
  "eventTypes": \[  
    {  
      "id": "type\_workshop",  
      "name": "Workshop / Lớp học ngắn hạn",  
      "requiredFields": \["eventName", "startDate", "locationOrLink", "speakers", "ticketPrice", "benefits"\],  
      "optionalFields": \["giftBonus", "faq", "refundPolicy"\],  
      "recommendedSections": \["hero", "benefits", "speaker", "agenda", "pricing", "faq", "registrationForm"\]  
    },  
    {  
      "id": "type\_conference",  
      "name": "Hội thảo / Conference / Summit",  
      "requiredFields": \["eventName", "startDate", "location", "speakers", "agendaTracks", "ticketPackages", "sponsors"\],  
      "optionalFields": \["highlightVideo", "venueMap", "hotelGuide"\],  
      "recommendedSections": \["hero", "keyStats", "valueProp", "speakerGrid", "agendaFilter", "pricingTable", "sponsors", "faq", "stickyCTA"\]  
    },  
    {  
      "id": "type\_webinar",  
      "name": "Webinar / Trực tuyến",  
      "requiredFields": \["eventName", "startDate", "platform", "topicSummary", "speakers"\],  
      "optionalFields": \["ebookBonus", "preQuestions"\],  
      "recommendedSections": \["hero", "agitation", "topicDetails", "speakerBio", "bonuses", "registrationForm", "faq"\]  
    },  
    {  
      "id": "type\_grand\_opening",  
      "name": "Lễ Khai trương / Grand Opening",  
      "requiredFields": \["eventName", "openDate", "address", "promotions"\],  
      "optionalFields": \["specialGuests", "spaceGallery", "performanceSchedule"\],  
      "recommendedSections": \["hero", "promoHighlights", "locationMap", "countdown", "gallery", "registrationForm"\]  
    },  
    {  
      "id": "type\_concert",  
      "name": "Live Concert / Lễ hội Âm nhạc",  
      "requiredFields": \["eventName", "lineup", "showDate", "location", "seatMap", "ticketTiers", "paymentGateways"\],  
      "optionalFields": \["ageLimit", "prohibitedItems", "wristbandGuide"\],  
      "recommendedSections": \["heroVideo", "lineupGrid", "seatMapVisual", "ticketTiers", "venueInfo", "termsConditions", "stickyCTA"\]  
    },  
    {  
      "id": "type\_hackathon",  
      "name": "Cuộc thi / Hackathon",  
      "requiredFields": \["eventName", "prizePool", "eligibility", "timeline", "judges", "rules"\],  
      "optionalFields": \["partners", "mentors", "pastWinners"\],  
      "recommendedSections": \["hero", "prizeHighlight", "timelineRounds", "judgesGrid", "rulesAccordion", "registrationForm"\]  
    }  
  \],  
  "goals": \[  
    {  
      "id": "goal\_ticket\_sales",  
      "name": "Bán vé trực tiếp",  
      "ctaExamples": \[  
        "Mua Vé Early Bird (Tiết kiệm 30%)",  
        "Giữ Chỗ Ngay \- Giá Ưu Đãi",  
        "Chọn Hạng Vé Của Bạn",  
        "Đăng Ký Tham Dự Ngay",  
        "Mua Vé VIP Ngay"  
      \],  
      "headlineFormulas": \[  
        "\[Tên Sự Kiện\]: Khám Phá Bí Quyết \[Mục Tiêu\] Cùng \[Số Lượng\] Chuyên Gia",  
        "Sở Hữu Tấm Vé Đến Với \[Tên Sự Kiện\] Lớn Nhất Năm 2026"  
      \]  
    },  
    {  
      "id": "goal\_lead\_gen",  
      "name": "Thu thập thông tin (Lead Generation)",  
      "ctaExamples": \[  
        "Nhận Vé Mời Miễn Phí",  
        "Đăng Ký Giữ Chỗ Online",  
        "Nhận Tài Liệu & Link Zoom",  
        "Tải Vé Tham Dự Miễn Phí",  
        "Cho Tôi Tham Gia Webinar"  
      \],  
      "headlineFormulas": \[  
        "Tham Gia Webinar Miễn Phí: Làm Chủ \[Kỹ Năng\] Trong \[Thời Gian\]",  
        "Tải Ngay Vé Mời Tham Dự \[Tên Sự Kiện\] Dành Cho \[Đối Tượng\]"  
      \]  
    },  
    {  
      "id": "goal\_student\_recruitment",  
      "name": "Tuyển sinh / Chiêu sinh",  
      "ctaExamples": \[  
        "Nhận Lộ Trình & Học Bổng",  
        "Tư Vấn Miễn Phí 1-1",  
        "Đăng Ký Học Thử Miễn Phí",  
        "Giữ Suất Ưu Đãi 50%",  
        "Nộp Đơn Tuyển Sinh Ngay"  
      \],  
      "headlineFormulas": \[  
        "Bứt Phá Sức Mạnh \[Kỹ Năng\]: Lộ Trình Thực Chiến \[Số\] Tháng",  
        "Trở Thành \[Nghề Nghiệp\] Chuyên Nghiệp Cùng \[Tên Khóa Học\]"  
      \]  
    },  
    {  
      "id": "goal\_brand\_awareness",  
      "name": "Xây dựng Thương hiệu",  
      "ctaExamples": \[  
        "Khám Phá Lịch Trình Sự Kiện",  
        "Xóa Tan Rào Cản Công Nghệ",  
        "Xem Danh Sách Diễn Giả",  
        "Đăng Ký Tham Gia Triển Lãm",  
        "Trải Nghiệm Công Nghệ Ngay"  
      \],  
      "headlineFormulas": \[  
        "Diễn Đàn \[Tên Ngành\] 2026: Định Hình Tương Lai \[Lĩnh Vực\]",  
        "Sự Kiện Thường Niên Lớn Nhất Năm Của \[Tên Thương Hiệu\]"  
      \]  
    }  
  \],  
  "popularCombos": \[  
    { "industry": "ind\_tech", "type": "type\_conference", "goal": "goal\_brand\_awareness" },  
    { "industry": "ind\_edu", "type": "type\_workshop", "goal": "goal\_student\_recruitment" },  
    { "industry": "ind\_realestate", "type": "type\_grand\_opening", "goal": "goal\_ticket\_sales" },  
    { "industry": "ind\_beauty", "type": "type\_workshop", "goal": "goal\_lead\_gen" },  
    { "industry": "ind\_finance", "type": "type\_webinar", "goal": "goal\_lead\_gen" },  
    { "industry": "ind\_fnb", "type": "type\_grand\_opening", "goal": "goal\_lead\_gen" },  
    { "industry": "ind\_health", "type": "type\_conference", "goal": "goal\_ticket\_sales" },  
    { "industry": "ind\_entertainment", "type": "type\_concert", "goal": "goal\_ticket\_sales" },  
    { "industry": "ind\_corporate", "type": "type\_conference", "goal": "goal\_brand\_awareness" },  
    { "industry": "ind\_tech", "type": "type\_hackathon", "goal": "goal\_brand\_awareness" }  
  \],  
  "palettes": \[  
    {  
      "id": "PAL\_01",  
      "name": "Tech Corporate",  
      "mood": "Tin cậy, Chuyên nghiệp, Công nghệ",  
      "colors": {  
        "primary": "\#1E3A8A",  
        "secondary": "\#3B82F6",  
        "accent": "\#F59E0B",  
        "background": "\#F8FAFC",  
        "surface": "\#FFFFFF",  
        "text": "\#0F172A",  
        "textMuted": "\#475569"  
      },  
      "suitableFor": {  
        "industries": \["ind\_tech", "ind\_finance", "ind\_corporate"\],  
        "types": \["type\_conference", "type\_webinar"\],  
        "goals": \["goal\_brand\_awareness", "goal\_lead\_gen"\]  
      },  
      "contrastAA": true  
    },  
    {  
      "id": "PAL\_02",  
      "name": "Khai Trương Thịnh Vượng",  
      "mood": "May mắn, Năng lượng, Thu hút tài lộc",  
      "colors": {  
        "primary": "\#DC2626",  
        "secondary": "\#B91C1C",  
        "accent": "\#FBBF24",  
        "background": "\#FFFBEB",  
        "surface": "\#FFFFFF",  
        "text": "\#450A0A",  
        "textMuted": "\#78350F"  
      },  
      "suitableFor": {  
        "industries": \["ind\_fnb", "ind\_realestate", "ind\_beauty"\],  
        "types": \["type\_grand\_opening"\],  
        "goals": \["goal\_ticket\_sales", "goal\_lead\_gen"\]  
      },  
      "contrastAA": true  
    },  
    {  
      "id": "PAL\_04",  
      "name": "Sang Trọng Gala",  
      "mood": "Đẳng cấp, VIP, Huyền bí",  
      "colors": {  
        "primary": "\#D97706",  
        "secondary": "\#78350F",  
        "accent": "\#F59E0B",  
        "background": "\#0F172A",  
        "surface": "\#1E293B",  
        "text": "\#F8FAFC",  
        "textMuted": "\#94A3B8"  
      },  
      "suitableFor": {  
        "industries": \["ind\_fashion", "ind\_realestate", "ind\_corporate"\],  
        "types": \["type\_conference"\],  
        "goals": \["goal\_brand\_awareness"\]  
      },  
      "contrastAA": true  
    },  
    {  
      "id": "PAL\_07",  
      "name": "Cyberpunk Tech",  
      "mood": "Đột phá, Hiện đại, Web3",  
      "colors": {  
        "primary": "\#8B5CF6",  
        "secondary": "\#A855F7",  
        "accent": "\#06B6D4",  
        "background": "\#090D16",  
        "surface": "\#111827",  
        "text": "\#F9FAFB",  
        "textMuted": "\#9CA3AF"  
      },  
      "suitableFor": {  
        "industries": \["ind\_tech", "ind\_entertainment"\],  
        "types": \["type\_hackathon", "type\_concert"\],  
        "goals": \["goal\_ticket\_sales", "goal\_brand\_awareness"\]  
      },  
      "contrastAA": true  
    }  
  \],  
  "fontPairs": \[  
    {  
      "heading": "Montserrat",  
      "body": "Open Sans",  
      "style": "Modern Clean",  
      "suitableFor": \["ind\_tech", "ind\_corporate", "ind\_finance"\]  
    },  
    {  
      "heading": "Playfair Display",  
      "body": "Be Vietnam Pro",  
      "style": "Luxury Serif",  
      "suitableFor": \["ind\_fashion", "ind\_realestate", "ind\_beauty"\]  
    },  
    {  
      "heading": "Be Vietnam Pro",  
      "body": "Be Vietnam Pro",  
      "style": "Native Universal",  
      "suitableFor": \["ind\_edu", "ind\_fnb", "ind\_health", "ind\_corporate"\]  
    },  
    {  
      "heading": "Space Grotesk",  
      "body": "Inter",  
      "style": "Cyberpunk Tech",  
      "suitableFor": \["ind\_tech", "ind\_entertainment"\]  
    }  
  \]  
}

#### **Works cited**

> 1. Event Website Templates for Unforgettable Experiences \- Muffin Group, [https\://muffingroup.com/blog/event-website-templates/](https://muffingroup.com/blog/event-website-templates/)  
> 2. Landing Page Conversion Rate: Average, Good & How to Improve, [https\://landingi.com/landing-page/conversion-rate-a/](https://landingi.com/landing-page/conversion-rate-a/)  
> 3. TRANG TRÍ TẾT THEO PHONG THUỶ 2026 \- Minh Hi Party, [https\://minhhiparty.com/trang-tri-tet-theo-phong-thuy-2026/](https://minhhiparty.com/trang-tri-tet-theo-phong-thuy-2026/)  
> 4. Chuỗi sự kiện Vietnam Web Summit tiếp tục mạnh mẽ lăn bánh, [https\://topdev.vn/blog/chuoi-su-kien-web-summit-tiep-tuc-manh-me-lan-banh/](https://topdev.vn/blog/chuoi-su-kien-web-summit-tiep-tuc-manh-me-lan-banh/)  
> 5. Techday 2024 'rầm rộ' trở lại, mở cổng đăng ký cho người FPT, [https\://chungta.vn/made-by-fpt/techday-2024-ram-ro-tro-lai-mo-cong-dang-ky-cho-nguoi-fpt-1139231.html](https://chungta.vn/made-by-fpt/techday-2024-ram-ro-tro-lai-mo-cong-dang-ky-cho-nguoi-fpt-1139231.html)  
> 6. High Converting Landing Page: 17 Examples for Inspiration \- Landingi, [https\://landingi.com/landing-page/high-converting-examples/](https://landingi.com/landing-page/high-converting-examples/)  
> 7. Kệ hoa mini để bàn mừng khai trương, sự kiện \- FLoLi, [https\://floli.vn/tu-van/ke-hoa-mini-de-ban-mung-khai-truong-su-kien-398.html](https://floli.vn/tu-van/ke-hoa-mini-de-ban-mung-khai-truong-su-kien-398.html)  
> 8. CRO Design, Website & Landing Page Optimization Blog \- Apexure, [https\://www\.apexure.com/blog/](https://www.apexure.com/blog/)  
> 9. Người sinh vào mùa Xuân nên mặc màu gì để hút tài hút lộc, tiền, [https\://kenh14.vn/nguoi-sinh-vao-mua-xuan-nen-mac-mau-gi-de-hut-tai-hut-loc-tien-bac-doi-dao-quanh-nam-215250519172246604.chn](https://kenh14.vn/nguoi-sinh-vao-mua-xuan-nen-mac-mau-gi-de-hut-tai-hut-loc-tien-bac-doi-dao-quanh-nam-215250519172246604.chn)  
> 10. Techfest Vietnam 2025 to spotlight startups and spirit of innovation, [https\://english.vov.vn/en/society/techfest-vietnam-2025-to-spotlight-startups-and-spirit-of-innovation-post1236357.vov](https://english.vov.vn/en/society/techfest-vietnam-2025-to-spotlight-startups-and-spirit-of-innovation-post1236357.vov)  
> 11. 40 best landing page examples of 2026 (for your swipe file), [https\://unbounce.com/landing-page-examples/best-landing-page-examples/](https://unbounce.com/landing-page-examples/best-landing-page-examples/)  
> 12. Lead Capture Form: How to Build One That Converts \- Elfsight, [https\://elfsight.com/blog/how-to-create-a-lead-capture-form/](https://elfsight.com/blog/how-to-create-a-lead-capture-form/)  
> 13. What is the best landing page builder in 2024 \- Graphic Designer, [https\://www\.javonisaac.com/blog/what-is-the-best-landing-page-builder-in-2024](https://www.javonisaac.com/blog/what-is-the-best-landing-page-builder-in-2024)  
> 14. Tập đoàn FPT công bố sự kiện FPT Techday 2024 với chủ đề Future, [https\://fpt.com/vi/tin-tuc/fpt-cong-bo-dien-dan-cong-nghe-quoc-te-voi-chu-de-future-now](https://fpt.com/vi/tin-tuc/fpt-cong-bo-dien-dan-cong-nghe-quoc-te-voi-chu-de-future-now)  
> 15. Mùng 1 Tết 2026 mặc màu gì để may mắn theo tuổi, theo mệnh, [https\://dienthoaivui.com.vn/tin-tuc/mung-1-tet-mac-mau-gi](https://dienthoaivui.com.vn/tin-tuc/mung-1-tet-mac-mau-gi)  
> 16. Mùng 1 Tết 2026 mặc màu gì để cả năm may mắn, rước lộc tài?, [https\://canifa.com/blog/mung-1-tet-mac-mau-gi](https://canifa.com/blog/mung-1-tet-mac-mau-gi)  
> 17. Top Vietnamese Fonts for Creative Editing and Design | 2025 trải, [https\://www\.lemon8-app.com/experience/svn-tingler-script?region=vn](https://www.lemon8-app.com/experience/svn-tingler-script?region=vn)  
> 18. Essential Guide to Vietnamese Fonts and Usage Tips \- Lemon8 App, [https\://www\.lemon8-app.com/experience/serif-font?region=vn](https://www.lemon8-app.com/experience/serif-font?region=vn)  
> 19. Top Vietnamese Fonts for Stylish and Effective Design | 2025 trải, [https\://www\.lemon8-app.com/experience/different-fonts-to-choose-from?region=vn](https://www.lemon8-app.com/experience/different-fonts-to-choose-from?region=vn)  
> 20. 4 điểm nhấn không thể bỏ qua của FPT Techday 2023 \- FPT Telecom, [https\://fpt.vn/tin-tuc/4-diem-nhan-khong-the-bo-qua-cua-fpt-techday-2023-9394.html](https://fpt.vn/tin-tuc/4-diem-nhan-khong-the-bo-qua-cua-fpt-techday-2023-9394.html)  
> 21. Vietnam Fintech Summit: Home, [https\://vietnamfintechsummit.com/](https://vietnamfintechsummit.com/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAWCAYAAACIXmHDAAAB90lEQVR4Xu2XzysFURTHj7DwIxtFllYWSkr2YmWBsrGRBQvWFmz4B9hZSQoL/wJlJRYWFjZKKQuKQimFosT5dub25h1vzL3z7njkfuq7eOfcuXPn++6cc4coEAgE/h71OpAD96whHSxBD+ua1cdqZLWxVln7hSHeaWJ96GASHSSDl3XCEzMk89uahbFxwWjftLDeqfg+TjSz3li7rCqVy0od65bczNpjrbCmWLXF6Vy4pAxmGRpYj6wTVrXKuXJD8ie4mLWlgzlTllkG/KuY6I5kh7gyzhojqT0/YRbehgEdtMCLWQYs4ohkt2HX2QCjsauAq1nHJPVkjuRBbGvWBcl9ZnUiBa9mAXSMF9aOTiRwToV642rWgYq9khiRxijJfdBBXfBmVjvJRBs68Q3DJB3Q4GJWKbZJrm/VCU+UbVYXyQQLOpFCDX19bVzMQkPRnXie7K/PQmazRkgunNAJS3B+uVJCg8CcD9HvpLoHkzBOL3w9iv0asyZJLujXCQ+Yg6Z+WNTBRRXDuFMVO4ziaR0Z+SUdtMDJrE2SU3xe9JIsZlrFn6N43EQcSDtjv9EkMGYtFkvCPDReWxfMzq8oplaZ188sCnEwSPLFoA++ZyRHBzPe9jOsm+x2IDBre6JCucA6EXPtpoEkzNe9jVDA/zXBrECgYnwCe0yEKBMlU8IAAAAASUVORK5CYII=>