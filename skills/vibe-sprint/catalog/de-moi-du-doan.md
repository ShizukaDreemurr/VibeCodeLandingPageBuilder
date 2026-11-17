# Dự đoán đề chung kết (10 hướng) — chỉ để luyện tập

**Cảnh báo:** đây là dự đoán, không phải thông tin của BTC. Tài liệu nội bộ (`docs/tieu-chi-cham-thi.md`) ghi rằng bộ tiêu chí vòng loại không quy định tiêu chí vòng chung kết, và BTC sẽ thông báo trước thi. Lịch chung kết theo notes là 17/11/2026. Dùng các hướng dưới đây để tập phản xạ: chọn 5 tính năng, dựng luồng chính, giải thích AI và dữ liệu. Không đưa vào hồ sơ như một đề chính thức.

Hướng chung dự đoán: thương mại điện tử và kinh doanh, theo cách các đề vòng 1 làm (form → AI/mock → kết quả → lưu localStorage → copy báo cáo). Mỗi hướng có 5 tính năng, AI đóng vai trò gì, dữ liệu gì, và bẫy cần chuẩn bị.

---

## 1. Tính lợi nhuận từng sản phẩm bán online

- **Bối cảnh:** chủ shop trên sàn hoặc website muốn biết mỗi đơn còn lãi bao nhiêu sau phí.
- **5 tính năng:**
  1. Nhập sản phẩm: giá vốn, giá bán, phí sàn (%), phí vận chuyển, chi phí quảng cáo trên đơn.
  2. Tính lợi nhuận gộp, biên lợi nhuận và điểm hòa vốn theo số lượng.
  3. Bảng so sánh nhiều sản phẩm, sắp xếp theo lợi nhuận.
  4. AI đề xuất mức giá bán tối thiểu và 2 phương án khuyến mãi không làm lỗ.
  5. Lưu danh sách sản phẩm (localStorage), xuất báo cáo text để copy.
- **AI làm gì:** đề xuất giá và giải thích; công thức tính do code làm, AI không tự tính số.
- **Dữ liệu:** `products[]`, công thức phí ghi trong app.
- **Dữ liệu demo gợi ý:** 5 sản phẩm: 2 lỗ, 3 lãi (ví dụ 1 sản phẩm lỗ nặng vì phí sàn + ship, 1 lãi mỏng sát hòa vốn), tên và giá có thật (áo thun 89.000 đ, tai nghe 159.000 đ). Có đủ ca để demo cảnh báo lỗ, biểu đồ có cả cột âm, và AI đề xuất giá tối thiểu cho sản phẩm lỗ.
- **Bẫy:** đơn vị phần trăm và VND; chia cho 0 khi giá bán = 0; AI đề xuất giá dưới giá vốn.
- **Giả định cần nêu (Bảng Kinh tế):** Phí sàn (%) lấy từ biểu phí công khai của sàn (ghi nguồn + ngày); phí ship trung bình theo đơn; tỉ lệ hoàn/hủy 3-8%; chi phí quảng cáo/đơn; giá vốn do shop cung cấp. 3 kịch bản: phí sàn +2 điểm %, ship +20%, giá bán -10%.
- **Cơ chế ưu đãi thực tế:** Giảm giá/voucher chỉ an toàn khi biên sau ưu đãi còn > 0: giá sàn = (giá vốn + ship + QC) / (1 - phí sàn% - biên tối thiểu%). Hiện dòng 'ưu đãi tối đa không lỗ' cho từng sản phẩm; freeship chỉ khi đơn vượt ngưỡng.

## 2. Quản lý tồn kho và cảnh báo hết hàng

- **Bối cảnh:** shop nhỏ hay hết hàng hoặc tồn quá nhiều vì không theo dõi.
- **5 tính năng:**
  1. Form nhập sản phẩm: SKU, tên, tồn đầu, số lượng nhập, số lượng bán theo ngày.
  2. Danh sách tồn kho hiện tại, lọc theo "sắp hết" và "tồn lâu".
  3. Ngưỡng cảnh báo tồn tối thiểu do người dùng đặt cho từng sản phẩm.
  4. AI dự báo ngày hết hàng dựa trên tốc độ bán 7 ngày gần nhất và đề xuất số lượng nhập.
  5. Xuất danh sách cần nhập hàng dạng text hoặc CSV.
- **AI làm gì:** diễn giải dự báo và đề xuất; tốc độ bán do code tính.
- **Dữ liệu:** `skus[]`, `movements[]` (ngày, loại nhập/bán, số lượng).
- **Dữ liệu demo gợi ý:** 6 SKU: 2 sắp hết (dưới ngưỡng), 1 tồn lâu không bán, 3 bình thường; 14 ngày lịch sử nhập/bán, trong đó 1 SKU mới chỉ có 3 ngày dữ liệu (để demo ca chưa đủ 7 ngày) và 1 SKU suýt âm tồn.
- **Bẫy:** tồn âm khi nhập bán nhiều hơn tồn; đơn vị ngày khi chưa đủ 7 ngày dữ liệu; trùng SKU.
- **Giả định cần nêu (Bảng Kinh tế):** Tốc độ bán lấy từ 7 ngày gần nhất (ghi rõ nếu < 7 ngày); thời gian giao hàng của nhà cung cấp (lead time); tồn an toàn = số ngày cover do đội chọn; vốn bị khóa = tồn × giá vốn. Kịch bản: bán nhanh +30%, lead time +3 ngày.
- **Cơ chế ưu đãi thực tế:** Xả hàng tồn lâu: giảm giá theo bậc, dừng ở mức giá vốn + chi phí lưu kho; so lỗ khi giữ tồn (vốn chết) với lỗ khi giảm sâu. Combo hàng chậm + hàng chạy chỉ khi biên gộp > 0.

## 3. Phân loại và phản hồi đánh giá khách hàng

- **Bối cảnh:** chủ shop có nhiều đánh giá nhưng không có thời gian đọc và trả lời từng cái.
- **5 tính năng:**
  1. Dán hoặc nhập danh sách đánh giá (mỗi dòng một đánh giá, có số sao tùy chọn).
  2. AI phân loại từng đánh giá: tích cực / tiêu cực / trung tính, và chủ đề (giao hàng, chất lượng, giá, dịch vụ).
  3. Thống kê: tỉ lệ từng nhóm, chủ đề bị phàn nàn nhiều nhất.
  4. AI soạn câu trả lời lịch sự cho từng đánh giá tiêu cực, có nút copy và sửa.
  5. Lọc danh sách theo nhóm và lưu lịch sử phân loại (localStorage).
- **AI làm gì:** phân loại và soạn trả lời; thống kê do code làm; phải trả JSON đúng nhãn cho phép.
- **Dữ liệu:** `reviews[]` (nội dung, sao, nhãn AI, nhãn người sửa).
- **Dữ liệu demo gợi ý:** 12 đánh giá: 5 tích cực, 4 tiêu cực (giao chậm, chất lượng, giá), 3 trung tính; có 1 đánh giá không dấu, 1 đánh giá mâu thuẫn (5 sao nhưng chê), 1 đánh giá rất ngắn ("ok").
- **Bẫy:** AI trả nhãn ngoài danh sách; đánh giá tiếng Việt không dấu; câu trả lời hứa hẹn quá mức (hoàn tiền, đổi hàng không có chính sách thật).
- **Giả định cần nêu (Bảng Kinh tế):** Chi phí xử lý 1 đánh giá thủ công (phút × lương giờ); tỉ lệ tiêu cực hiện tại; ước tính doanh thu giữ được khi phản hồi nhanh (ghi là giả định, nêu cách ước tính). Kịch bản: tỉ lệ tiêu cực +5 điểm %.
- **Cơ chế ưu đãi thực tế:** Quà xin lỗi/hoàn tiền cho khách tiêu cực: chi phí mỗi ca so với giá trị vòng đời khách giữ lại; đặt trần hoàn tiền theo biên đơn. Không hứa chính sách đổi/hoàn mà shop chưa có.

## 4. Chatbot tra cứu đơn hàng và chính sách

- **Bối cảnh:** shop nhận nhiều câu hỏi "đơn của tôi đâu", "đổi trả thế nào" lặp lại mỗi ngày.
- **5 tính năng:**
  1. Khung chat với các câu hỏi chung (đổi trả, phí ship, thời gian giao) từ bộ FAQ mẫu.
  2. Tra cứu đơn theo mã đơn và số điện thoại, dữ liệu đơn mẫu do đội tự tạo.
  3. AI diễn đạt lại câu trả lời và gợi ý 3 câu hỏi liên quan.
  4. Khi không trả lời được, chatbot đề nghị chuyển sang form để lại lời nhắn cho nhân viên.
  5. Trang quản trị xem và đánh dấu các yêu cầu đã xử lý.
- **AI làm gì:** diễn đạt lại; không được bịa thông tin đơn hàng.
- **Dữ liệu:** `orders[]` mẫu, `faq[]`, `tickets[]`.
- **Dữ liệu demo gợi ý:** 5 đơn mẫu: 2 đã giao, 1 đang giao, 1 chờ xác nhận, 1 đã hủy; 6 câu FAQ (đổi trả, ship, giờ làm việc, thanh toán, bảo hành, hủy đơn); 2 câu hỏi demo biết trước là chatbot không trả lời được để bật luồng để lại lời nhắn.
- **Bẫy:** chatbot tự "biết" đơn mà không khớp mã; số điện thoại trong tra cứu phải che bớt khi hiển thị; khớp từ khóa không bỏ dấu.
- **Giả định cần nêu (Bảng Kinh tế):** Số câu hỏi lặp mỗi ngày; thời gian trả lời thủ công mỗi câu; tỉ lệ chatbot tự giải quyết (giả định, chưa đo thật); lương giờ nhân viên CSKH. Kịch bản: tỉ lệ tự giải quyết 40/60/80%.
- **Cơ chế ưu đãi thực tế:** Ưu đãi bồi thường chậm đơn (voucher nhỏ) chỉ dùng cho đơn trễ thật; tính chi phí voucher so với chi phí mất khách. Có trần số voucher mỗi tháng.

## 5. Viết mô tả sản phẩm cho sàn thương mại điện tử

- **Bối cảnh:** chủ shop có hàng trăm sản phẩm chưa có mô tả, mỗi sàn yêu cầu giới hạn khác nhau.
- **5 tính năng:**
  1. Form nhập: tên sản phẩm, thông số, chất liệu, đối tượng, điểm nổi bật, sàn đích.
  2. AI viết tiêu đề, mô tả ngắn và 5 gạch đầu dòng theo giới hạn ký tự của sàn đã chọn.
  3. Bộ đếm ký tự, cảnh báo khi vượt giới hạn.
  4. Gợi ý 5 từ khóa tìm kiếm, có nút copy từng từ.
  5. Lịch sử mô tả đã tạo, xem lại và xóa (localStorage).
- **AI làm gì:** viết nội dung; không bịa thông số sản phẩm (phải đánh dấu chỗ cần xác nhận).
- **Dữ liệu:** `drafts[]`, bảng giới hạn ký tự theo sàn (ghi trong app).
- **Dữ liệu demo gợi ý:** 4 sản phẩm thuộc 2 nhóm (thời trang, đồ gia dụng) và 2 sàn đích có giới hạn ký tự khác nhau; 1 sản phẩm cố tình thiếu thông số để demo chỗ AI đánh dấu "cần xác nhận", 1 sản phẩm có tên rất dài để demo cảnh báo vượt giới hạn.
- **Bẫy:** AI thêm thông số không có trong đầu vào; vượt giới hạn sau khi copy; từ khóa lặp.
- **Giả định cần nêu (Bảng Kinh tế):** Số sản phẩm cần viết mô tả; phút/mô tả khi làm tay; chi phí gọi AI mỗi mô tả (hoặc 0 khi dùng mô phỏng, nói rõ); tỉ lệ cần sửa tay sau AI. Kịch bản: tỉ lệ sửa tay 20/40/60%.
- **Cơ chế ưu đãi thực tế:** Ưu đãi gói 'viết mô tả hàng loạt' (nếu có): giá/mô tả giảm theo bậc nhưng giữ biên > chi phí AI + công kiểm duyệt; ghi điểm hòa vốn theo số mô tả/tháng.

## 6. Phân khúc khách hàng và soạn tin khuyến mãi

- **Bối cảnh:** shop có danh sách khách mua hàng nhưng gửi tin khuyến mãi cho tất cả mọi người.
- **5 tính năng:**
  1. Nhập danh sách khách (tên, số lần mua, tổng chi tiêu, ngày mua gần nhất) — nhập tay hoặc dán từ bảng.
  2. Phân nhóm: khách mới, khách trung thành, khách lâu không quay lại (ngưỡng do đội đặt).
  3. Chọn nhóm và mục tiêu, AI soạn tin SMS hoặc Zalo đúng giới hạn ký tự.
  4. Ước tính số tin gửi và chi phí theo đơn giá tin do người dùng nhập.
  5. Xuất danh sách nhóm dạng CSV và lưu chiến dịch đã soạn.
- **AI làm gì:** soạn tin; phân nhóm do rule.
- **Dữ liệu:** `customers[]`, `segments` (ngưỡng), `campaigns[]`.
- **Dữ liệu demo gợi ý:** 15 khách: 5 mới (1 lần mua), 5 trung thành (từ 4 lần, chi tiêu cao), 5 lâu không quay lại (trên 90 ngày); 1 cặp khách trùng SĐT và 1 khách thiếu ngày mua để demo kiểm tra dữ liệu.
- **Bẫy:** ngày mua không đúng định dạng; khách có SĐT trùng; tin vượt giới hạn SMS (70 ký tự có dấu) — cần đếm đúng.
- **Giả định cần nêu (Bảng Kinh tế):** Đơn giá SMS/Zalo (nhà mạng, ghi nguồn); tỉ lệ phản hồi/chuyển đổi theo nhóm (giả định, cho khoảng min-max); giá trị đơn trung bình; biên sau ưu đãi. Kịch bản: chuyển đổi 1/3/5%.
- **Cơ chế ưu đãi thực tế:** Mã giảm cho nhóm 'lâu không quay lại': tính chi phí = số khách nhận × tỉ lệ dùng × mức giảm; so với biên đơn quay lại. Kiểm ưu đãi có lỗ không và số tin gửi hòa vốn (chi phí tin / biên mỗi đơn).

## 7. Chấm điểm lead và kịch bản chốt sales

- **Bối cảnh:** đội sales nhỏ nhận nhiều lead nhưng không biết ưu tiên gọi ai trước.
- **5 tính năng:**
  1. Form nhập lead: nguồn, ngân sách, nhu cầu, thời gian dự kiến mua, mức độ quan tâm.
  2. Chấm điểm lead theo thang 100 với trọng số công bố trong app.
  3. Phân loại: nóng / ấm / lạnh.
  4. AI soạn kịch bản gọi và tin nhắn theo nhóm lead, có chỗ để sales tự sửa.
  5. Danh sách lead sắp xếp theo điểm, đánh dấu đã liên hệ, xuất CSV.
- **AI làm gì:** kịch bản và giải thích điểm; điểm do công thức.
- **Dữ liệu:** `leads[]`, `weights`, `status`.
- **Dữ liệu demo gợi ý:** 8 lead: 2 nóng (điểm từ 80), 3 ấm, 2 lạnh, 1 thiếu trường (điểm chưa đủ dữ liệu); 1 cặp lead trùng số điện thoại; trọng số mặc định cộng đúng 100.
- **Bẫy:** điểm không cộng đúng 100 khi thiếu trường; lead trùng số điện thoại; kịch bản có lời hứa không đúng sản phẩm.
- **Giả định cần nêu (Bảng Kinh tế):** Tỉ lệ chốt theo nhóm nóng/ấm/lạnh (giả định có khoảng); thời gian gọi mỗi lead; giá trị hợp đồng trung bình; chi phí mua lead. Kịch bản: tỉ lệ chốt -30%, chi phí lead +20%.
- **Cơ chế ưu đãi thực tế:** Chiết khấu để chốt lead nóng: chỉ khi biên sau chiết khấu > chi phí mua + công sales; đặt trần chiết khấu theo nhóm. Hoa hồng sales (nếu có) tính vào biên.

## 8. Landing page flash sale với mã giảm giá và đếm ngược

- **Bối cảnh:** shop muốn chạy một đợt giảm giá ngắn hạn với số lượng có hạn.
- **5 tính năng:**
  1. Form tạo đợt sale: tên sản phẩm, giá gốc, giá sale, số lượng, thời gian bắt đầu và kết thúc.
  2. Landing render: hero, giá, đếm ngược đến hết đợt, số lượng còn lại.
  3. Form đặt hàng: tên, SĐT, địa chỉ, mã giảm giá; kiểm tra mã hợp lệ và còn hạn.
  4. Khi hết hàng hoặc hết đợt, nút đặt bị khóa và hiển thị trạng thái rõ ràng.
  5. Danh sách đơn đặt (localStorage) và nút xuất CSV.
- **AI làm gì:** viết headline và mô tả từ thông tin nhập; không tạo số lượng hay mức giảm giả.
- **Dữ liệu:** `sale`, `coupons[]`, `orders[]`.
- **Dữ liệu demo gợi ý:** 1 đợt sale 48 giờ, 3 mã giảm (1 còn hạn, 1 hết lượt dùng, 1 hết hạn), tồn kho 5 sản phẩm trong đó 1 chỉ còn 2 suất để demo ca hết chỗ khi hai người đặt cùng lúc; đồng hồ đếm ngược theo giờ Việt Nam.
- **Bẫy:** "số lượng còn lại" phải phản ánh thật (không đếm ngược giả, theo quy tắc BTC ở đề 8 vòng 1); đặt hai lần làm âm tồn; múi giờ đếm ngược.
- **Giả định cần nêu (Bảng Kinh tế):** Số lượng sale có hạn (thật, không đếm ngược giả); giá gốc, giá vốn, giá sale; tỉ lệ dùng mã; chi phí quảng cáo cho đợt. Kịch bản: bán hết 50/80/100% số lượng; QC +30%.
- **Cơ chế ưu đãi thực tế:** Điểm hòa vốn của đợt flash sale = (chi phí QC + cố định) / (giá sale - giá vốn - phí); cảnh báo khi giá sale thấp hơn giá vốn + phí; mã giảm cộng dồn không được đẩy biên âm; mỗi mã có hạn lượt dùng.

## 9. Giỏ hàng và checkout tính phí ship và voucher

- **Bối cảnh:** khách bỏ giỏ vì không biết tổng tiền cuối cùng trước khi thanh toán.
- **5 tính năng:**
  1. Chọn sản phẩm và số lượng vào giỏ, có bảng giá sản phẩm mẫu.
  2. Nhập mã voucher: loại theo % hoặc số tiền, có điều kiện đơn tối thiểu và hạn dùng.
  3. Phí ship theo khu vực (3 vùng, bảng do đội đặt) và miễn phí ship theo ngưỡng.
  4. Tổng tiền hiển thị theo thời gian thực: tạm tính, giảm giá, phí ship, tổng.
  5. Đặt hàng: lưu đơn (localStorage), hiện mã đơn và tóm tắt có nút copy.
- **AI làm gì:** gợi ý thêm sản phẩm để đủ ngưỡng miễn phí ship; tổng tiền do code tính.
- **Dữ liệu:** `products[]`, `vouchers[]`, `shippingZones`, `orders[]`.
- **Dữ liệu demo gợi ý:** 6 sản phẩm, 3 voucher (1 phần trăm, 1 trừ thẳng, 1 vượt tổng đơn để demo chặn âm tiền), 3 vùng ship (nội thành, ngoại thành, tỉnh); 1 giỏ mẫu có tổng lẻ để kiểm tra làm tròn VND.
- **Bẫy:** làm tròn VND; voucher cộng dồn; giảm giá vượt tổng đơn (âm tiền); làm mới trang mất giỏ.
- **Giả định cần nêu (Bảng Kinh tế):** Bảng phí ship theo vùng (đội đặt, ghi nguồn tham khảo hãng ship); ngưỡng freeship; điều kiện voucher; giá vốn; tỉ lệ bỏ giỏ hiện tại. Kịch bản: ship thực +15%, tỉ lệ dùng voucher +10 điểm %.
- **Cơ chế ưu đãi thực tế:** Freeship + voucher: đơn nhỏ vừa freeship vừa giảm có thể lỗ; kiểm biên từng đơn mẫu, cảnh báo đơn lỗ; ngưỡng freeship phải ≥ giá trị đơn mà biên còn dương sau ship. Voucher không cộng dồn hoặc có trần giảm.

## 10. Lịch nội dung và kế hoạch chiến dịch đa kênh

- **Bối cảnh:** nhóm marketing nhỏ cần biết đăng gì, ở kênh nào, vào ngày nào trong tháng.
- **5 tính năng:**
  1. Form nhập chiến dịch: mục tiêu, kênh (Facebook, Instagram, TikTok, email), ngân sách, thời gian chạy.
  2. AI đề xuất lịch 4 tuần: mỗi bài có ngày, kênh, loại nội dung, chủ đề.
  3. Hiển thị lịch dạng bảng theo tuần, có lọc theo kênh.
  4. Đánh dấu bài đã đăng hoặc đã duyệt; bài quá hạn được tô màu.
  5. Xuất lịch dạng CSV hoặc file ICS để thêm vào lịch điện thoại.
- **AI làm gì:** đề xuất lịch và chủ đề; không hứa về hiệu quả.
- **Dữ liệu:** `campaigns[]`, `posts[]` (ngày, kênh, trạng thái).
- **Dữ liệu demo gợi ý:** 3 chiến dịch trên 4 kênh, 12 bài trải 4 tuần: 3 đã đăng, 2 quá hạn (tô màu), 7 chờ duyệt; 1 cặp bài trùng ngày cùng kênh và 1 chiến dịch bắt đầu 28/2 để demo ngày cuối tháng.
- **Bẫy:** ngày không tồn tại (30/2); múi giờ khi xuất ICS; bài trùng ngày trên cùng kênh; lịch không đủ 4 tuần.
- **Giả định cần nêu (Bảng Kinh tế):** Ngân sách mỗi kênh và giá mỗi lượt tiếp cận/click (giả định, ghi khoảng); tỉ lệ chuyển đổi mỗi kênh; giá trị đơn trung bình; tần suất đăng. Không hứa hiệu quả, chỉ ước tính theo kịch bản. Kịch bản: CPC +20%, chuyển đổi -30%.
- **Cơ chế ưu đãi thực tế:** Ưu đãi theo kênh (mã riêng cho TikTok/Facebook/email): mỗi mã tính chi phí trên đơn so với biên; kênh có ROI < 1 ở kịch bản cơ sở thì đề xuất giảm ngân sách; ghi điểm hòa vốn ngân sách chiến dịch.

---

## Cách dùng để tập

- **Luật chung kết:** thể lệ **cấm chuẩn bị sẵn tính năng cho đề**. Các hướng này chỉ để luyện phản xạ; không chép code/dữ liệu từ bài luyện sang bài thi. Với mỗi hướng, tập nêu **Giả định cần nêu** và **Cơ chế ưu đãi thực tế** (đáng 49/100 điểm Bảng Kinh tế: mô hình 22 + giả định/dự phòng 17 + cơ chế 10), dùng `EP.scenario`/`references/11-mo-hinh-kinh-doanh.md`.

- Mỗi thành viên bốc một hướng ngẫu nhiên, dựng MVP 45 phút theo mẫu vòng 1.
- Chốt 5 tính năng trước, ghi vào README, rồi mới bắt đầu code.
- Tập câu hỏi vấn đáp cho Bảng B: "người dùng là ai", "AI làm gì và bạn kiểm soát đầu ra thế nào", "dữ liệu nằm đâu".
- Đề bài vòng chung kết nếu khác hẳn các hướng trên thì ưu tiên giữ luồng cốt lõi, không thêm tính năng ngoài phạm vi.
