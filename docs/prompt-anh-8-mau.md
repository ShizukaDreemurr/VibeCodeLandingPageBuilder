# Prompt tạo ảnh cho 7 landing page mẫu còn lại

Bộ này đi kèm `prompt-anh-moc-coffee.md` (Mộc Coffee đã có ảnh). Dùng trong **Gemini**. Với mỗi trang: dán **đoạn phong cách** vào một cuộc trò chuyện mới, rồi gửi lần lượt 5 prompt. Tải ảnh bản lớn nhất, chuyển sang **WebP**, đặt đúng tên file rồi bỏ vào `assets/demo/`.

Sau khi đủ ảnh của một trang, thêm khoá của trang đó vào mảng `READY_PICS` trong `js/demo-data.js` (ví dụ `['coffee', 'ai']`) và tăng `VERSION`. Trang sẽ tự hiện ảnh và mục album.

Quy ước chung cho mọi prompt: ảnh chân thực (photorealistic), người Việt Nam, không chữ, không logo, không watermark, không biển hiệu đọc được, bàn tay và ngón tay tự nhiên (đủ 5 ngón), khuôn mặt không méo.

| Khoá | Trang | Tiền tố file |
|---|---|---|
| `ai` | Workshop AI Marketing 2026 | `ai-` |
| `edu` | Hội thảo Du học Úc & Canada 2027 | `edu-` |
| `beauty` | Workshop Chăm sóc da mùa hanh khô | `beauty-` |
| `wedding` | Lễ cưới Minh Anh & Hoàng Nam | `wedding-` |
| `finance` | Webinar Quản lý tài chính cá nhân 2026 | `finance-` |
| `hackathon` | Hackathon 48 giờ 2026 | `hackathon-` |
| `demoday` | Demo Day Startup 2026 | `demoday-` |

Mỗi trang cần 5 file: `<khoá>-hero.webp` (16:9), `<khoá>-about.webp` (4:3), `<khoá>-gift.webp` (1:1), `<khoá>-g1.webp` (4:3), `<khoá>-g2.webp` (4:3).

---

## 1. Workshop AI Marketing 2026 (`ai`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Workshop AI Marketing 2026" của TechUp Academy, sáng thứ Bảy 5/12/2026 tại Hà Nội. Giữ phong cách đồng nhất: hiện đại, năng động, thực chiến. Bảng màu: xanh navy đậm (#1E2A78), hồng cánh sen làm điểm nhấn (#D6336C), nền trắng xanh nhạt (#F4F5FB). Ánh sáng ban ngày trong phòng hội thảo, sạch, có chút phản chiếu màn hình. Nhiếp ảnh kiểu tạp chí công nghệ, máy full-frame 35mm, hậu cảnh mờ. Người Việt 22–40 tuổi, trang phục smart casual, biểu cảm tự nhiên, không nhìn thẳng ống kính. TUYỆT ĐỐI KHÔNG: chữ, logo, watermark, chữ trên màn hình đọc được, hiệu ứng 3D/hoạt hình, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`ai-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Hội trường workshop hiện đại ở Hà Nội, khoảng 40 người trẻ ngồi theo bàn nhóm, mỗi người có laptop, đang chăm chú làm theo hướng dẫn từ sân khấu nhỏ. Ánh sáng xanh navy dịu từ màn hình chiếu lớn (nội dung màn hình mờ, không đọc được chữ), điểm hồng nhẹ từ đèn trang trí. Bố cục: đám đông và sân khấu lệch sang PHẢI khung hình; nửa TRÁI để thoáng, tối và ít chi tiết (tường tối màu navy, vài bóng người mờ) vì sẽ đặt tiêu đề chữ trắng lên đó. Không chữ, không logo.
```

**`ai-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Cận cảnh một bàn làm việc nhóm: hai người trẻ (một nam, một nữ) cùng nhìn vào một laptop, người nữ đang chỉ vào màn hình, bên cạnh là sổ tay giấy ghi chú chi chít (không đọc được chữ), ly cà phê và điện thoại. Hậu cảnh là hội trường mờ. Tông xanh navy và trắng, điểm hồng nhạt từ giấy ghi chú. Chủ thể nằm ở 2/3 dưới khung hình. Không chữ, không logo.
```

**`ai-gift.webp` – 1:1** (quà: giảm 30% học phí, bộ 30 prompt)
```
Ảnh vuông 1:1. Tấm thẻ ưu đãi cứng màu hồng cánh sen đặt trên bàn gỗ sáng, cạnh một cuốn sổ tay bìa xanh navy, một cây bút và một chiếc laptop mở hé hiện ra ánh sáng dịu (màn hình không đọc được). Thẻ để trống hoàn toàn, KHÔNG có chữ hay số. Chụp góc 45 độ từ trên xuống, ánh sáng cửa sổ mềm, hậu cảnh mờ.
```

**`ai-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Giờ thực hành trong workshop: khoảng 8 học viên trẻ ngồi quanh bàn dài, gõ laptop và trao đổi với nhau, một giảng viên nữ đứng cạnh bàn cúi xuống chỉ bài cho một bạn. Nụ cười tự nhiên, không khí tập trung. Tông navy – trắng, ánh sáng ban ngày. Không chữ, không logo.
```

**`ai-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Giờ giải lao networking: các học viên đứng quanh bàn cà phê và bánh ngọt, cầm ly giấy trơn, trò chuyện và trao đổi danh thiếp (danh thiếp để trống). Phòng sáng, phía sau thấy màn hình chiếu mờ. Tông navy – trắng, điểm hồng nhẹ. Không chữ, không logo.
```

---

## 2. Hội thảo Du học Úc & Canada 2027 (`edu`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Hội thảo Định hướng Du học Úc & Canada 2027", chiều thứ Bảy 12/12/2026 tại TP.HCM. Giữ phong cách đồng nhất: tin cậy, ấm áp, hy vọng. Bảng màu: xanh dương đậm (#0B4F8A), cam đất làm điểm nhấn (#C2410C), nền xanh nhạt (#EEF6FC). Ánh sáng chiều dịu, vàng nhẹ. Nhiếp ảnh kiểu tạp chí giáo dục, máy full-frame 35–50mm, hậu cảnh mờ. Người Việt: học sinh 16–19 tuổi, phụ huynh 40–50 tuổi, chuyên gia 30–45 tuổi, trang phục lịch sự giản dị. TUYỆT ĐỐI KHÔNG: chữ, logo, quốc kỳ có chữ, watermark, hiệu ứng hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`edu-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Một gia đình Việt (bố hoặc mẹ và con gái 17 tuổi) ngồi hàng ghế đầu trong hội trường hội thảo du học, cùng nhìn lên sân khấu với vẻ háo hức, trên tay cầm bộ tài liệu bìa xanh dương (không chữ). Phía sau là hội trường đông người, ánh sáng chiều vàng nhẹ qua cửa sổ lớn. Bố cục: gia đình đặt lệch PHẢI; nửa TRÁI khung hình thoáng, tông xanh dương đậm và tối, ít chi tiết vì sẽ đặt tiêu đề chữ trắng lên đó. Không chữ, không logo.
```

**`edu-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Một chuyên gia tư vấn nữ khoảng 38 tuổi ngồi bàn tròn cùng một học sinh nam 18 tuổi và mẹ của em, đang giở bản đồ lộ trình hồ sơ trên giấy (không đọc được chữ), bên cạnh là laptop và tách trà. Không khí thân thiện, tin cậy. Tông xanh dương – cam đất nhẹ, ánh sáng cửa sổ dịu. Không chữ, không logo.
```

**`edu-gift.webp` – 1:1** (quà: bộ hồ sơ học bổng mẫu)
```
Ảnh vuông 1:1. Một bộ hồ sơ học bổng: bìa kẹp hồ sơ màu xanh dương đậm đặt trên bàn gỗ sáng, bên trong thấy vài tờ giấy trắng (không có chữ), kèm bút máy, một chiếc kẹp giấy màu cam đất và một tấm thẻ trắng trống. Chụp góc 45 độ từ trên xuống, ánh sáng cửa sổ mềm, hậu cảnh mờ. Không chữ, không logo.
```

**`edu-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Cựu sinh viên nữ khoảng 24 tuổi đứng chia sẻ trên sân khấu nhỏ, cầm micro, cười tự tin; khán giả phụ huynh và học sinh phía trước nghe chăm chú, một số ghi chép. Ánh sáng chiều ấm, tông xanh dương. Không chữ, không logo, màn hình chiếu phía sau chỉ là nền xanh trơn.
```

**`edu-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Các gian tư vấn trong giờ giải lao: ba bàn tư vấn trải khăn trắng, mỗi bàn có một chuyên viên đang trò chuyện với một phụ huynh và con, tờ rơi để trống trên bàn. Phòng sáng, đông vừa phải, không khí thoải mái. Tông xanh dương – trắng, điểm cam đất. Không chữ, không logo.
```

---

## 3. Workshop Chăm sóc da mùa hanh khô (`beauty`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Workshop Chăm sóc da mùa hanh khô" tại Lumi Skin Studio, Quận 1, TP.HCM, chiều 2/12/2026. Giữ phong cách đồng nhất: dịu dàng, sạch, sang nhẹ, tin cậy y khoa. Bảng màu: hồng đậm (#9D174D), hồng sen (#BE185D), nền hồng phấn rất nhạt (#FDF2F8), kèm kem và trắng ngà. Ánh sáng cửa sổ mềm, tông ấm, da hiện kết cấu thật, không làm mịn quá mức. Nhiếp ảnh kiểu tạp chí làm đẹp, máy full-frame 50–85mm, khẩu độ lớn. Người Việt, phụ nữ 25–45 tuổi, bác sĩ mặc áo blouse trắng. TUYỆT ĐỐI KHÔNG: chữ, logo, nhãn sản phẩm có chữ, watermark, hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`beauty-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Phòng chăm sóc da yên tĩnh: một phụ nữ Việt khoảng 32 tuổi, da sáng khỏe, mặc áo choàng spa trắng, ngồi cạnh cửa sổ lớn, tay chạm nhẹ lên má, khẽ mỉm cười nhìn ra ngoài. Trên bàn nhỏ có tách trà thảo mộc, cành hoa khô và lọ thuỷ tinh trơn không nhãn. Bố cục: người lệch PHẢI; nửa TRÁI để thoáng, tông hồng đậm – nâu ấm mờ, ít chi tiết vì sẽ đặt tiêu đề chữ trắng lên đó. Không chữ, không logo.
```

**`beauty-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Bác sĩ da liễu nữ khoảng 40 tuổi, áo blouse trắng, dùng thiết bị soi da cầm tay kiểm tra da mặt cho một khách nữ đang ngồi, màn hình soi da hiển thị mờ (không đọc được). Không gian studio sáng, tông hồng phấn – trắng ngà. Biểu cảm chuyên nghiệp, ân cần. Không chữ, không logo.
```

**`beauty-gift.webp` – 1:1** (quà: voucher 300.000đ)
```
Ảnh vuông 1:1. Một phong bì giấy màu hồng phấn có dây ruy băng kem, bên trên đặt tấm thẻ voucher trắng ngà trống hoàn toàn (KHÔNG chữ, số hay logo), cạnh đó là cành hoa khô và một viên đá spa nhỏ. Đặt trên mặt đá cẩm thạch trắng, ánh sáng cửa sổ mềm từ bên trái, chụp góc 45 độ, hậu cảnh mờ.
```

**`beauty-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Nhóm khoảng 10 phụ nữ Việt ngồi quanh bàn dài trong studio, mỗi người có tách trà thảo mộc, đang chăm chú nghe bác sĩ giải thích và ghi chép vào sổ nhỏ. Ánh sáng ấm, tông hồng phấn – kem. Không chữ, không logo, bảng trình chiếu phía sau chỉ là nền trơn.
```

**`beauty-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Phòng liệu trình riêng: một khách nữ nằm thư giãn trên giường spa, mắt nhắm, chuyên viên đang đắp mặt nạ dưỡng dịu cho khách bằng thao tác nhẹ nhàng. Nến thơm, khăn bông cuộn, ánh đèn vàng ấm. Tông hồng – kem. Bàn tay chuyên viên tự nhiên. Không chữ, không logo.
```

---

## 4. Lễ cưới Minh Anh & Hoàng Nam (`wedding`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho thiệp cưới online "Minh Anh & Hoàng Nam", lễ thành hôn 11:00 ngày 20/12/2026 tại Trung tâm Tiệc cưới Riverside, Long Biên, Hà Nội. Giữ phong cách đồng nhất: trang trọng, ấm cúng, lãng mạn kiểu Việt. Bảng màu: đỏ rượu vang đậm (#7F1D1D), vàng đồng (#A16207), kem ấm (#FBEFE1, #FFFAF3). Ánh sáng ấm, mềm, như ánh nến và nắng cuối ngày. Nhiếp ảnh cưới kiểu tạp chí, máy full-frame 50–85mm, khẩu độ lớn, màu film nhẹ. Cô dâu chú rể là người Việt khoảng 28 tuổi; cô dâu mặc áo dài cưới hoặc váy cưới giản dị, chú rể mặc vest tối màu. TUYỆT ĐỐI KHÔNG: chữ, logo, watermark, biển tên đọc được, hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`wedding-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Cô dâu chú rể người Việt nắm tay nhau đi dọc lối đi rải hoa trong sảnh tiệc cưới, nhìn nhau cười, ánh đèn chùm vàng ấm và hoa hồng đỏ – kem hai bên lối. Bố cục: đôi uyên ương lệch PHẢI, chụp từ xa vừa; nửa TRÁI khung hình thoáng, tối màu đỏ rượu vang mờ với ánh đèn bokeh, vì sẽ đặt tiêu đề chữ trắng lên đó. Không chữ, không logo.
```

**`wedding-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Cận cảnh hai bàn tay cô dâu chú rể đan vào nhau, đeo nhẫn cưới giản dị, cô dâu cầm bó hoa hồng kem và hoa baby trắng nhỏ. Nền mờ là ánh nến và rèm cưới màu kem. Tông đỏ rượu – vàng đồng – kem. Bàn tay và ngón tay tự nhiên, đủ 5 ngón. Không chữ, không logo.
```

**`wedding-gift.webp` – 1:1** (lời nhắn từ gia đình)
```
Ảnh vuông 1:1. Bàn trang trí lối vào tiệc cưới: một chiếc hộp lụa đỏ rượu vang nhỏ cột nơ vàng đồng, cạnh đó là tấm thiệp giấy kem trống hoàn toàn (KHÔNG chữ), vài cành hoa hồng kem và một chân nến thuỷ tinh. Đặt trên khăn ren trắng ngà, ánh nến ấm, chụp góc 45 độ, hậu cảnh mờ.
```

**`wedding-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Khoảnh khắc đón khách: cô dâu chú rể đứng trước cổng hoa trắng – đỏ, chào đón người thân đến dự, một bà cụ nắm tay cô dâu cười hiền. Ánh nắng trưa dịu, hoa cổng cầu kỳ nhưng không có chữ. Tông đỏ rượu – kem. Không chữ, không logo.
```

**`wedding-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Bàn tiệc cưới tròn trang trí tinh tế: khăn bàn kem, hoa hồng đỏ – kem ở giữa, ly pha lê, nến thắp, thẻ tên trống (không chữ). Phía sau là sảnh tiệc ấm áp với ánh đèn bokeh vàng. Không có người hoặc chỉ có bóng người rất mờ. Tông đỏ rượu – vàng đồng.
```

---

## 5. Webinar Quản lý tài chính cá nhân 2026 (`finance`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Webinar Quản lý tài chính cá nhân 2026" (trực tuyến qua Zoom, tối 25/10/2026). Giữ phong cách đồng nhất: bình tĩnh, rõ ràng, đáng tin cậy, không phô trương. Bảng màu: xanh lục đậm (#065F46), xanh dương (#0369A1), nền xanh bạc hà rất nhạt (#ECFDF5), trắng. Ánh sáng đèn bàn ấm buổi tối kết hợp ánh sáng màn hình dịu. Nhiếp ảnh kiểu tạp chí kinh doanh, máy full-frame 35–50mm, hậu cảnh mờ. Người Việt 25–40 tuổi, trang phục ở nhà lịch sự. TUYỆT ĐỐI KHÔNG: chữ, logo, số liệu hoặc biểu đồ đọc được, tiền thật có hình, watermark, hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`finance-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Một người đi làm Việt khoảng 30 tuổi ngồi tại bàn làm việc ở nhà vào buổi tối, đeo tai nghe, xem webinar trên laptop, tay cầm bút ghi chép vào sổ, cạnh đó là máy tính cầm tay và ly trà. Đèn bàn vàng ấm, cửa sổ tối có ánh đèn thành phố mờ. Bố cục: người và bàn lệch PHẢI; nửa TRÁI khung hình thoáng, tông xanh lục đậm tối và ít chi tiết vì sẽ đặt tiêu đề chữ trắng lên đó. Màn hình không đọc được. Không chữ, không logo.
```

**`finance-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Hai vợ chồng trẻ người Việt ngồi bàn ăn nhà mình lúc tối, cùng nhìn vào laptop và một cuốn sổ ngân sách, người vợ đang ghi chép, người chồng chỉ vào màn hình. Hai con heo đất gốm nhỏ và hũ thuỷ tinh đựng tiền xu trên bàn. Tông xanh lục – kem, ánh đèn ấm. Không chữ, không số đọc được, không logo.
```

**`finance-gift.webp` – 1:1** (quà: e-book kế hoạch 12 tháng)
```
Ảnh vuông 1:1. Một chiếc máy tính bảng đặt trên bàn gỗ sáng, màn hình hiện trang bìa sách điện tử màu xanh lục đậm với hoạ tiết lá cây tối giản (KHÔNG có chữ), cạnh đó là bút chì, kính cận và một chậu cây nhỏ. Chụp góc 45 độ từ trên xuống, ánh sáng cửa sổ mềm, hậu cảnh mờ.
```

**`finance-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Góc làm việc buổi tối: laptop mở hiện cuộc họp video nhiều ô nhỏ (khuôn mặt mờ, không rõ), bảng tính xanh lục không đọc được, sổ tay và máy tính cầm tay bên cạnh. Ánh đèn bàn ấm. Tông xanh lục – xanh dương. Không chữ, không logo.
```

**`finance-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Người phụ nữ Việt khoảng 35 tuổi ngồi sofa, laptop đặt trên đầu gối, mỉm cười nhẹ nhõm khi nhìn màn hình, bên cạnh là tách trà và sổ ghi chép. Phòng khách ấm cúng buổi tối, ánh sáng đèn vàng. Tông xanh lục – kem. Không chữ, không logo.
```

---

## 6. Hackathon 48 giờ 2026 (`hackathon`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Hackathon 48 giờ 2026", ngày 12–13/12/2026 tại Hà Nội. Giữ phong cách đồng nhất: năng lượng cao, tập trung, tinh thần đồng đội. Bảng màu: chàm đậm (#1E1B4B), xanh ngọc teal làm điểm nhấn (#0F766E), nền xanh lam rất nhạt (#EEF0FB). Ánh sáng: ánh đèn LED màu chàm và teal xen ánh màn hình, không gian làm việc thâu đêm, có chút tương phản. Nhiếp ảnh kiểu tạp chí công nghệ, máy full-frame 35mm, khẩu độ lớn, hạt film nhẹ. Người Việt 18–35 tuổi, áo hoodie và áo thun đồng phục đội, biểu cảm tập trung hoặc phấn khích. TUYỆT ĐỐI KHÔNG: chữ, logo, mã nguồn đọc được trên màn hình, watermark, hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`hackathon-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Một không gian hackathon rộng về đêm: nhiều nhóm 4 người ngồi quanh các bàn dài, laptop sáng, đèn LED chàm và teal chạy dọc trần. Một bạn nữ giơ tay ăn mừng khi build chạy được, đồng đội quay sang cười. Bố cục: nhóm chính lệch PHẢI; nửa TRÁI khung hình thoáng, tối màu chàm với bokeh đèn mờ, ít chi tiết vì sẽ đặt tiêu đề chữ trắng lên đó. Màn hình không đọc được. Không chữ, không logo.
```

**`hackathon-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Nhóm 4 bạn trẻ người Việt vây quanh một bảng trắng vẽ sơ đồ kiến trúc bằng bút nhiều màu (nét vẽ là hình khối và mũi tên, KHÔNG có chữ), một bạn đang chỉ vào bảng, người khác ghi chú trên laptop. Ánh sáng đèn trần trắng ấm với điểm teal. Tông chàm – teal. Không chữ, không logo.
```

**`hackathon-gift.webp` – 1:1** (quà: áo hoodie + credit đám mây)
```
Ảnh vuông 1:1. Một chiếc áo hoodie màu chàm đậm gấp gọn đặt trên bàn gỗ tối, bên trên là tấm thẻ kim loại màu teal trống hoàn toàn (KHÔNG chữ hay logo), cạnh đó là chiếc cốc giữ nhiệt trơn và dây đeo thẻ. Chụp góc 45 độ từ trên xuống, ánh sáng nghiêng mềm, hậu cảnh mờ có ánh LED teal.
```

**`hackathon-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Mentor nam khoảng 35 tuổi cúi xuống cạnh bàn của một đội, chỉ vào màn hình laptop (không đọc được), cả đội lắng nghe và gật đầu. Hộp pizza và lon nước trên bàn. Ánh sáng đêm, tông chàm – teal. Không chữ, không logo.
```

**`hackathon-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Khoảnh khắc demo: một thành viên nữ đứng trước màn hình chiếu lớn thuyết trình sản phẩm (nội dung màn hình mờ, không đọc được), ban giám khảo ba người ngồi hàng đầu ghi chép, khán giả phía sau. Ánh đèn sân khấu chàm – teal. Không chữ, không logo.
```

---

## 7. Demo Day Startup 2026 (`demoday`)

**Phong cách (dán trước):**

```
Tôi cần bộ 5 ảnh chân thực (photorealistic) cho landing page "Demo Day Startup 2026", tối 18/12/2026 tại TP.HCM. Giữ phong cách đồng nhất: sang, có uy tín, sân khấu ánh sáng spotlight. Bảng màu: tím mận đậm (#3B0A45), cam hổ phách làm điểm nhấn (#B45309), kem ấm và trắng. Ánh sáng: ánh spotlight ấm trên sân khấu, hậu cảnh tím mận tối, bokeh vàng cam. Nhiếp ảnh kiểu tạp chí kinh doanh, máy full-frame 35–85mm, khẩu độ lớn. Người Việt 25–50 tuổi, trang phục smart casual hoặc vest không cà vạt. TUYỆT ĐỐI KHÔNG: chữ, logo, slide đọc được, watermark, hoạt hình/3D, bàn tay dị dạng, khuôn mặt méo. Bạn xác nhận rồi tôi gửi từng ảnh.
```

**`demoday-hero.webp` – 16:9**
```
Ảnh bìa ngang 16:9. Một nhà sáng lập nữ Việt khoảng 32 tuổi đứng pitch trên sân khấu dưới ánh spotlight ấm, tay cầm clicker, phía sau là màn hình chiếu nền tím mận (không có chữ), khán giả và nhà đầu tư là bóng người mờ ở hàng ghế. Bố cục: diễn giả lệch PHẢI; nửa TRÁI khung hình thoáng, tím mận đậm với bokeh vàng cam, ít chi tiết vì sẽ đặt tiêu đề chữ trắng lên đó. Không chữ, không logo.
```

**`demoday-about.webp` – 4:3**
```
Ảnh 4:3 ngang. Ba nhà đầu tư (hai nam, một nữ, 40–50 tuổi) ngồi hàng ghế đầu, một người ghi chú vào sổ da, một người khoanh tay lắng nghe, người còn lại nghiêng đầu đặt câu hỏi. Ánh sáng sân khấu hắt từ phía trước, nền tím mận tối. Biểu cảm chăm chú, chuyên nghiệp. Không chữ, không logo.
```

**`demoday-gift.webp` – 1:1** (quà: hồ sơ 10 startup + vé networking)
```
Ảnh vuông 1:1. Một cuốn sổ hồ sơ bìa da màu tím mận đậm đặt trên bàn gỗ tối, bên trên là tấm vé mời màu kem viền vàng đồng trống hoàn toàn (KHÔNG chữ, số hay logo), cạnh đó là bút kim loại và ly rượu vang trong suốt mờ phía sau. Chụp góc 45 độ, ánh sáng spotlight ấm nghiêng, hậu cảnh bokeh vàng cam.
```

**`demoday-g1.webp` – 4:3**
```
Ảnh 4:3 ngang. Gian trưng bày sản phẩm giờ giải lao: một đội startup 3 người đứng cạnh bàn demo (thiết bị và mô hình sản phẩm trơn, không logo), giới thiệu cho hai khách tham quan, một người cầm thử sản phẩm. Ánh đèn ấm, hậu cảnh tím mận mờ. Không chữ, không logo.
```

**`demoday-g2.webp` – 4:3**
```
Ảnh 4:3 ngang. Giờ networking cuối sự kiện: khoảng 15 người Việt đứng thành vài nhóm nhỏ, cầm ly nước, trò chuyện cởi mở và bắt tay nhau trong sảnh có ánh đèn vàng cam, hậu cảnh tím mận. Không khí thân thiện, chuyên nghiệp. Bàn tay bắt tay tự nhiên. Không chữ, không logo.
```

---

**Mẹo chung**
- Ảnh có chữ lạ hoặc bàn tay lỗi: *"Tạo lại ảnh này, bỏ hết chữ và sửa bàn tay cho tự nhiên."*
- Lệch tông màu: *"Giữ đúng bảng màu như ảnh bìa."*
- Gemini không cho chọn tỉ lệ: thêm *"tỉ lệ khung hình 16:9"* (hoặc 4:3, 1:1) vào cuối prompt, rồi cắt lại khi chuyển sang WebP.
- Ảnh do AI tạo: ghi rõ "ảnh minh hoạ tạo bằng Gemini" trong README / minh chứng AI.
