# Prompt tạo ảnh cho landing page "Khai trương Mộc Coffee Hồ Tây"

Dùng trong **Gemini (web/app, gói Gemini Plus)**. Mỗi prompt dán vào **một cuộc trò chuyện mới** hoặc nối tiếp lần lượt trong cùng một cuộc trò chuyện để giữ phong cách đồng nhất. Tải ảnh về (bản lớn nhất), đặt tên đúng như tên file gợi ý rồi gửi lại.

**Bước đầu (dán trước, một lần)** — để Gemini giữ cùng phong cách cho cả bộ ảnh:

```
Tôi cần một bộ 8 ảnh chụp chân thực (photorealistic) cho landing page sự kiện khai trương quán cà phê "Mộc Coffee" chi nhánh Hồ Tây, Hà Nội, khai trương 8:00 sáng thứ Bảy 28/11/2026. Hãy giữ phong cách đồng nhất cho TẤT CẢ ảnh trong cuộc trò chuyện này:
- Thương hiệu "Mộc": mộc mạc, ấm áp, tối giản kiểu Việt Nam hiện đại. Vật liệu: gỗ sồi/gỗ tếch tự nhiên, gạch nung, tường vữa màu kem, cây xanh, đồ gốm thủ công, đèn vàng ấm.
- Bảng màu chủ đạo: nâu cà phê đậm (#5B3A29), nâu caramel (#B4581B), kem (#FFF8F0), xanh lá cây nhẹ; không dùng màu neon.
- Ánh sáng: nắng sớm mùa đông Hà Nội, dịu, hơi có sương, tông ấm; cảm giác chậm rãi, thư thái.
- Phong cách nhiếp ảnh: như ảnh của tạp chí ẩm thực/lifestyle, chụp bằng máy full-frame ống kính 35mm hoặc 50mm, khẩu độ lớn (f/1.8–f/2.8), hậu cảnh mờ tự nhiên, màu film nhẹ, độ nét cao, chi tiết thật.
- Con người (nếu có): người Việt Nam, 20–40 tuổi, trang phục đời thường lịch sự mùa đông (áo len, áo khoác nhẹ), biểu cảm tự nhiên, không nhìn thẳng ống kính, không tạo dáng giả.
- TUYỆT ĐỐI KHÔNG: chữ, logo, biển hiệu có chữ, watermark, khung viền, hiệu ứng hoạt hình/3D/vẽ tay, bàn tay hay ngón tay bị dị dạng, khuôn mặt méo, đồ vật trôi lơ lửng, màu quá rực.
Bạn xác nhận đã hiểu, rồi tôi sẽ gửi từng ảnh.
```

---

## 1. Ảnh bìa (hero) — `moc-hero.jpg` — tỉ lệ 16:9

```
Ảnh 1 – ảnh bìa ngang, tỉ lệ 16:9, độ phân giải cao.
Cảnh: mặt tiền quán cà phê Mộc mới khai trương bên Hồ Tây, Hà Nội, lúc 7:45 sáng mùa đông. Quán hai tầng nhỏ, mặt tiền gỗ và kính lớn, ánh đèn vàng ấm hắt ra từ bên trong, vài chậu cây xanh và hoa trắng trước cửa, một dải ruy băng đỏ mảnh căng ngang lối vào chuẩn bị cắt băng. Phía sau quán thấy mặt Hồ Tây phủ sương nhẹ, hàng cây và bầu trời hồng nhạt buổi sớm. Vài người khách mặc áo khoác nhẹ đang đứng trò chuyện, cầm ly cà phê bốc hơi.
Bố cục: chủ thể (mặt tiền quán) đặt lệch sang PHẢI khung hình; nửa TRÁI khung hình để thoáng, tối và ít chi tiết (mặt hồ mờ sương, tông nâu đậm) vì sẽ đặt tiêu đề chữ trắng lên đó. Góc máy ngang tầm mắt, hơi chéo.
Không có chữ, không có logo, không có biển hiệu đọc được.
```

## 2. Ảnh giới thiệu — `moc-about.jpg` — tỉ lệ 4:3

```
Ảnh 2 – tỉ lệ 4:3 (ngang).
Cảnh: bên trong quán Mộc nhìn ra Hồ Tây. Một góc ngồi cạnh ô cửa kính lớn: bàn gỗ sồi, hai ghế bành bọc vải màu kem, một ly cà phê sữa trong cốc gốm nâu đặt trên bàn, cạnh đó là cuốn sách mở và chậu cây nhỏ. Ngoài cửa kính là mặt hồ phẳng lặng phủ sương, hàng cây ven hồ, ánh nắng sớm chiếu xiên vào bàn tạo vệt sáng ấm.
Bố cục: chủ thể là bàn và ly cà phê ở 1/3 dưới khung hình, view hồ chiếm nửa trên; độ sâu trường ảnh nông, hồ hơi mờ. Không có người hoặc chỉ có bóng dáng một người rất mờ ở xa.
Không có chữ, logo.
```

## 3. Ảnh quà tặng — `moc-gift.jpg` — tỉ lệ 1:1

```
Ảnh 3 – vuông 1:1.
Cảnh: chụp cận một ly cà phê signature của Mộc: ly thủy tinh dày, lớp cà phê đậm phía dưới, lớp kem sữa béo màu caramel phía trên, có rắc chút bột cacao, giọt nước đọng nhẹ quanh thành ly. Ly đặt trên khay gỗ cùng một chiếc thẻ giấy kraft nhỏ buộc dây gai (thẻ để trống, KHÔNG có chữ) và vài hạt cà phê rang rải bên cạnh. Nền là quầy gỗ ấm, hậu cảnh mờ có ánh đèn vàng.
Ánh sáng: nắng sớm chiếu nghiêng từ bên trái, làm nổi kết cấu lớp kem. Góc chụp 45 độ, chủ thể ở giữa khung.
Không có chữ, logo trên ly hay thẻ.
```

## 4. Album – Barista pha phin — `moc-barista.jpg` — tỉ lệ 4:5 (dọc)

```
Ảnh 4 – tỉ lệ 4:5 (dọc).
Cảnh: barista nam người Việt khoảng 28 tuổi, tạp dề vải màu nâu, đang hướng dẫn một khách nữ trẻ tự tay pha cà phê phin tại quầy gỗ. Hai chiếc phin nhôm đang nhỏ giọt vào cốc thủy tinh, ấm nước đồng cổ ngỗng bên cạnh, hơi nước bốc nhẹ. Cả hai đang cười tự nhiên, nhìn vào phin, không nhìn ống kính.
Bố cục: lấy nét vào tay và phin cà phê ở tiền cảnh, khuôn mặt hơi mờ nhẹ phía sau. Ánh sáng ấm từ đèn treo phía trên.
Chú ý: bàn tay và ngón tay phải tự nhiên, đủ 5 ngón, không dị dạng. Không có chữ, logo.
```

## 5. Album – Nếm thử 3 loại hạt — `moc-tasting.jpg` — tỉ lệ 4:3

```
Ảnh 5 – tỉ lệ 4:3 (ngang).
Cảnh: hoạt động "bịt mắt nếm thử 3 loại hạt cà phê". Trên bàn gỗ dài có 3 chén gốm nhỏ đựng hạt cà phê rang với 3 màu rang khác nhau (sáng, vừa, đậm), trước mỗi chén là một tách cà phê nhỏ. Một vị khách trẻ đeo dải khăn bịt mắt bằng vải lanh màu kem đang nhấp thử một tách, bạn bên cạnh cười thích thú. Không khí vui vẻ, gần gũi.
Bố cục: 3 chén hạt ở tiền cảnh sắc nét, người phía sau hơi mờ. Ánh sáng chiều ấm.
Không có chữ, không có nhãn ghi tên hạt, không logo.
```

## 6. Album – Cắt băng khai trương — `moc-opening.jpg` — tỉ lệ 16:9

```
Ảnh 6 – tỉ lệ 16:9 (ngang).
Cảnh: khoảnh khắc cắt băng khai trương trước cửa quán Mộc lúc 8:00 sáng. Nữ chủ quán khoảng 32 tuổi (áo len màu kem) và barista (tạp dề nâu) cùng cầm kéo cắt dải ruy băng đỏ. Xung quanh khoảng 12–15 khách và hàng xóm vỗ tay, vài người giơ điện thoại chụp lại, một bé gái cầm bóng bay màu kem. Phía sau là cửa kính quán với ánh đèn vàng và chậu hoa trắng.
Bố cục: góc rộng, ngang tầm mắt, mọi người ở trạng thái chuyển động tự nhiên, vui tươi. Ánh nắng sớm từ phía hồ.
Không có chữ, không biển hiệu đọc được, không logo. Khuôn mặt và bàn tay tự nhiên, không méo.
```

## 7. Album – Quà hạt rang mang về — `moc-beans.jpg` — tỉ lệ 1:1

```
Ảnh 7 – vuông 1:1.
Cảnh: những túi giấy kraft nhỏ đựng hạt cà phê rang (khoảng 100g mỗi túi), miệng túi gấp và buộc dây gai, xếp ngay ngắn trong một giỏ mây đặt trên quầy gỗ, bên cạnh là muỗng gỗ múc hạt và vài hạt rơi tự nhiên. Đây là quà tặng "giờ vàng" cho 100 khách đầu tiên lúc 17:00, nên ánh sáng là nắng chiều vàng cam chiếu xiên qua cửa sổ.
Không có chữ, tem, nhãn hay logo trên túi.
```

## 8. Album – Nhạc acoustic bên hồ buổi tối — `moc-acoustic.jpg` — tỉ lệ 4:3

```
Ảnh 8 – tỉ lệ 4:3 (ngang).
Cảnh: buổi tối tại sân hiên quán Mộc nhìn ra Hồ Tây lúc 19:00. Một nam ca sĩ chơi guitar acoustic ngồi trên ghế gỗ cao, cạnh là một nữ ca sĩ cầm micro, dàn đèn bóng tròn treo dây phía trên tỏa ánh vàng. Khoảng 20 khách ngồi các bàn gỗ nhỏ, cầm ly cà phê và trà nóng, lắng nghe. Phía sau là mặt hồ phản chiếu ánh đèn thành phố.
Không khí ấm cúng, chậm rãi. Ánh sáng chủ yếu từ dây đèn và nến trên bàn, tông vàng cam, bầu trời xanh đậm.
Không có chữ, không biển hiệu, không logo.
```

---

**Mẹo:**
- Nếu ảnh có chữ lạ hoặc bàn tay bị lỗi, gửi thêm: *"Tạo lại ảnh này, bỏ hết chữ và sửa bàn tay cho tự nhiên."*
- Nếu tông màu lệch khỏi bộ ảnh: *"Giữ đúng bảng màu nâu cà phê – caramel – kem như ảnh 1."*
- Nếu Gemini không cho chọn tỉ lệ, cứ thêm câu *"tỉ lệ khung hình 16:9"* (hoặc 4:3, 1:1, 4:5) vào cuối prompt; mình sẽ cắt lại cho vừa khung bằng trình chỉnh ảnh của app.
- Đây là ảnh do AI tạo: khi nộp bài nên ghi rõ "ảnh minh họa tạo bằng Gemini" trong README / minh chứng AI.
