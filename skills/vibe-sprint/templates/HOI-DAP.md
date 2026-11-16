# Chuẩn bị hỏi đáp: <Tên sản phẩm> (Bảng B)

> 40 câu hỏi giám khảo hay hỏi (20 câu chung + 10 câu mô hình kinh doanh ở mục F + 14 câu khung kiến thức ở mục G, **Q&A chỉ có ở vòng phản biện; Bảng Kinh tế phải trình bày giả định và cách tính**), với khung trả lời. Mỗi câu gắn người trả lời: `[DA]` Diệu Anh, `[Dũng]` Vũ Trí Dũng, `[Nguyên]` Nguyên. Câu không có chủ hoặc câu bẫy: **Nguyên bắt**. Luôn nói **câu trả lời ngắn (1 câu) trước**, rồi mới bằng chứng. Thay `<…>` bằng số liệu thật của đội. Đừng học thuộc: trả lời theo cấu trúc **Trả lời ngắn 1 câu → Bằng chứng (chỗ trên app hoặc file) → Giới hạn nếu có**.
> Đừng bịa số. Chưa làm thì nói chưa làm, kèm cách đội sẽ làm.

## A. Cách dùng

**1. Người dùng thật của sản phẩm là ai, và họ dùng trong bao lâu?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Persona> dùng, mất khoảng <n> phút từ nhập đến có kết quả.
- Trả lời: <persona>, dùng khoảng <n> phút từ lúc nhập đến lúc có trang kết quả.
- Bằng chứng: bấm "<Điền dữ liệu mẫu>" rồi tính từ form đến kết quả.

**2. Một người chưa biết gì về sản phẩm, làm sao biết bắt đầu từ đâu?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Màn hình đầu đã có <nút chính>, bấm một lần là ra kết quả mẫu.
- Trả lời: <màn hình đầu tiên có gì>, <nút chính nằm ở đâu>.
- Bằng chứng: <có hướng dẫn ngắn / dữ liệu mẫu có sẵn>.

**3. Kết quả đầu ra dùng được ngay hay phải chỉnh tay?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Dùng được ngay / chỉnh nhẹ ở <phần nào>>.
- Trả lời: <dùng được ngay / cần chỉnh <phần nào>, chỉnh bằng cách nào>.
- Giới hạn: <…>.

**4. Sau khi có kết quả, người dùng đưa cho khách bằng cách nào?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Bằng <link/QR/xuất file>, một thao tác.
- Trả lời: <link, QR, xuất file, tải về>.
- Bằng chứng: <bấm thử đường đi đó trên app>.

## B. Nghiệp vụ

**5. Nhập thiếu hoặc sai thì app xử lý thế nào?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): App báo lỗi ngay dưới ô sai và không lưu dữ liệu sai.
- Trả lời: báo lỗi ngay dưới từng ô, không tạo dữ liệu. <Liệt kê quy tắc chính.>
- Bằng chứng: TC03 và TC04 trong `BANG-KIEM-THU.md`.

**6. Hai người (hoặc một người bấm hai lần) cùng gửi, có bị ghi trùng không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Không ghi trùng: trùng theo <khoá> thì báo "đã có".
- Trả lời: <trùng theo khoá nào: SĐT, email>, <trùng thì báo đã có>.
- Bằng chứng: TC05.

**7. Hết chỗ thì sao?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Hết chỗ thì <báo hết / vào danh sách chờ>, nút chuyển trạng thái.
- Trả lời: <danh sách chờ / báo hết>, nút đổi thành <…>.
- Bằng chứng: TC06.

**8. Sự kiện đã diễn ra thì trang hiện gì?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Hiện nhãn "<Sự kiện đã diễn ra>", ẩn form, không đếm số âm.
- Trả lời: nhãn "<Sự kiện đã diễn ra>", không đếm số âm, ẩn form.
- Bằng chứng: <ca thử đặt thời gian quá khứ>.

**9. Vì sao chọn quy tắc này, không chọn quy tắc khác?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Vì <lý do nghiệp vụ một câu>.
- Trả lời: <lý do theo nghiệp vụ, ví dụ: một SĐT chỉ là một người tham dự>.
- Ghi chú: quyết định này ghi ở `DECISIONS.md` mục <Dxx>.

## C. Dữ liệu thật hay mô phỏng

**10. AI trong app là thật hay mô phỏng?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Thật / mô phỏng> theo chế độ hiện trên giao diện, luôn có nhãn.
- Trả lời: <chế độ mặc định là gì>. Khi chạy <chế độ AI thật>, app dùng <model>. Khi không có key, app <chuyển sang mô phỏng và hiện nhãn>.
- Bằng chứng: nhãn "<câu nhãn>" trên giao diện.

**11. Làm sao giám khảo biết nội dung không phải do công thức sinh ra?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Có nhãn chế độ trên giao diện và trong README; kết quả thật có <dấu hiệu>.
- Trả lời: mục chế độ hiện trên giao diện và trong README; kết quả thật có <dấu hiệu, ví dụ: câu văn không lặp mẫu>.
- Giới hạn: <…>.

**12. API key được lưu ở đâu? Có bị lộ không?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Key do người dùng/máy chủ giữ, không có trong mã nguồn.
- Trả lời: <key nằm trong trình duyệt của người dùng / biến môi trường máy chủ>. Không có key nào trong mã nguồn.
- Bằng chứng: `scripts/scan-secrets.mjs` (kết quả đã chạy, <n> chỗ flag, <lý do>).

**13. Dữ liệu của người dùng lưu ở đâu, mất khi nào?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Lưu trong <localStorage / Firestore>; xoá dữ liệu trình duyệt thì mất.
- Trả lời: <localStorage trên một trình duyệt / Firestore có đăng nhập>. Xoá dữ liệu trình duyệt thì mất.
- Giới hạn: không đồng bộ giữa các máy nếu chưa xuất bản.

## D. Vòng cải thiện bằng AI

**14. AI viết sai hoặc trả về sai định dạng thì làm gì?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Tách JSON, kiểm đủ trường, thiếu thì bù bằng bản mô phỏng và báo rõ.
- Trả lời: tách JSON khỏi lời dẫn, kiểm tra đủ trường; thiếu thì bù bằng bản mô phỏng và báo rõ.
- Bằng chứng: TC06 hoặc vòng <n> trong `MINH-CHUNG-AI.md`.

**15. Đội đã dùng AI để cải thiện sản phẩm như thế nào? Cho một ví dụ.** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Có: vòng <n> sửa lỗi <…>, đo lại thấy <kết quả>.
- Trả lời: vòng <n>: vấn đề <…> → yêu cầu sửa <…> → kiểm tra lại <kết quả đo được>.
- Bằng chứng: ảnh <n> trong `MINH-CHUNG-AI.md`.

**16. Phần nào AI viết, phần nào đội tự kiểm tra?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): AI viết mã và prompt; đội tự mở app, test trên <thiết bị> và chạy <lệnh test>.
- Trả lời: AI viết mã và prompt; đội tự mở app, thử trên <thiết bị>, và chạy <lệnh test>. Kết quả nằm ở `BANG-KIEM-THU.md`.

## E. Giới hạn và mở rộng

**17. Sản phẩm có chạy được với nhiều người cùng lúc không?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Có / chưa>; hiện <giới hạn>, hướng xử lý <…>.
- Trả lời: <có / chưa: lý do, ví dụ: localStorage chỉ một máy>. Khi xuất bản dùng <Firestore> thì số đếm chung.
- Giới hạn: <…>.

**18. Nếu làm thêm một tuần, đội sẽ làm gì trước?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Việc ưu tiên 1 là <…> vì <lý do>.
- Trả lời: <việc ưu tiên 1 và lý do>, <việc ưu tiên 2>. Không ưu tiên <tính năng ngoài đề>.

**19. Vì sao không làm tính năng <X> trong đề?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Nằm ngoài phạm vi 60 phút, ghi ở `spec-nhanh.md`; sẽ làm <…>.
- Trả lời: <nằm trong phần "Ngoài phạm vi" của `spec-nhanh.md`, lý do: thời gian 60 phút / đề không yêu cầu>.

**20. Bảo mật và quyền truy cập thế nào?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Ai xem được gì>; đã kiểm thử <ca bảo mật>.
- Trả lời: <ai xem được gì>. Ghi chú đã kiểm thử: <ca bảo mật nếu có>.
- Giới hạn: <chưa kiểm tra bằng tài khoản thứ ba, v.v.>.

## F. Mô hình kinh doanh, giả định và cách tính (Bảng Kinh tế, vòng phản biện)

Cấu trúc: **kết luận 1 câu → số trong app → giới hạn**. Chỉ nêu số có trong app (bảng giả định, kịch bản, hòa vốn). Giả định chưa có số thật thì nói là giả định.

**21. Các giả định lấy từ đâu?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Giả định chia 3 loại: số của BTC, số công khai có nguồn, số đội tự đặt, và loại nào cũng ghi nhãn trong app.
- Trả lời: <file BTC: sheet <…>> · <nguồn công khai: biểu phí <…> ngày <…>> · <đội đặt: <…>, lý do <…>>. Mở bảng giả định cho giám khảo xem cột "Nguồn".
- Giới hạn: <giả định nào chưa có nguồn thật và đội kiểm bằng cách nào>.

**22. Vì sao chọn tỉ lệ đó (ví dụ <x>%) chứ không phải số khác?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Vì <lý do một câu: mức trung bình ngành / số liệu BTC / thận trọng>, và đội có kịch bản cho mức khác.
- Trả lời: <x>% lấy từ <nguồn>; chọn mức thận trọng vì <…>; đổi sang <y>% thì lợi nhuận đổi <z> (xem độ nhạy).
- Giới hạn: <chưa có dữ liệu thật của riêng shop>.

**23. Nếu chi phí tăng 20% thì sao?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Lợi nhuận giảm còn <…>, hòa vốn dịch từ <a> lên <b>, vẫn <còn lãi / lỗ>.
- Trả lời: bấm kịch bản "chi phí +20%" trong app: biên từ <…> xuống <…>; điều chỉnh <giá/ưu đãi> để giữ biên.
- Bằng chứng: bảng độ nhạy trong app.

**24. Khi nào hòa vốn?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Hòa vốn ở <n> <đơn/sản phẩm/tháng>, tính bằng chi phí cố định chia cho phần đóng góp mỗi đơn.
- Trả lời: chi phí cố định <…> / (giá <…> − biến phí <…>) = <n>. Có đường hòa vốn trong app; đổi giả định thì số đổi theo.
- Giới hạn: giả định giá và sản lượng ổn định trong kỳ tính.

**25. Chương trình ưu đãi/khuyến mãi này có làm lỗ không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Không lỗ nếu <điều kiện>; lỗ khi <điều kiện>, và app cảnh báo ngay.
- Trả lời: biên sau ưu đãi = <…>; đơn tối thiểu <…>, trần giảm <…>, cộng dồn: <có/không>. Ví dụ đơn <…> còn lãi <…>.
- Bằng chứng: dòng "ưu đãi có lỗ không" trong app, ca TC10.

**26. Dự phòng bao nhiêu và vì sao?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Dự phòng <x>% chi phí, vì giả định <yếu nhất> biến động nhất.
- Trả lời: <x>% = <căn cứ: biến động giá, tỉ lệ hoàn/hủy…>; kịch bản xấu nhất vẫn <lãi/lỗ> <…>.
- Giới hạn: <chưa kiểm bằng dữ liệu thật nhiều tháng>.

**27. Giả định nào nhạy nhất, nếu sai thì hỏng ở đâu?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Giả định> nhạy nhất: đổi 10% thì lợi nhuận đổi <z>%.
- Trả lời: từ bảng độ nhạy: <xếp hạng 3 giả định>. Giả định này đội sẽ kiểm trước bằng <cách>.

**28. Đơn vị mô hình: lãi mỗi đơn, mỗi khách hay mỗi tháng? Có tính chi phí cố định không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Tính theo <đơn vị>, có cộng chi phí cố định <…> để ra hòa vốn.
- Trả lời: <biến phí gồm: giá vốn, phí sàn, ship, QC>; <cố định gồm: …>. Mẫu số 0 thì app báo "Không đủ dữ liệu", không ra số ảo.

**29. Con số nào là thật, con số nào là mô phỏng? Có dùng dữ liệu BTC không?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Số từ file BTC ghi "Dữ liệu BTC", số đội đặt ghi "Giả định", số sinh ra ghi "Mô phỏng".
- Trả lời: nạp file BTC (sheet <…>) bằng <nút>; dữ liệu mẫu của đội do <…> tạo trong giờ thi; nhãn: "<câu nhãn>".
- Bằng chứng: README mục Dữ liệu.

**30. Mô hình này có mở rộng/thực tế với người bán thật không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Có với <quy mô>, vì <cơ chế khuyến mãi thực tế: điều kiện, trần>; chưa kiểm với <…>.
- Trả lời: <nhóm người bán đầu tiên>, <cách thu thập số thật để thay giả định>, <rủi ro: …>.
- Giới hạn: giả định chưa kiểm thị trường thật, đội nói rõ khi trình bày.

## G. Khung kiến thức: USP, phân khúc, định vị, kênh, phí sàn, voucher (Bảng Kinh tế, vòng phản biện)

Cấu trúc như mục F. Số dẫn từ giáo trình (`references/kien-thuc/`, trích trong `references/12`) chỉ là **tham chiếu có nguồn**; số của đề/BTC và số đội đặt ghi nhãn đúng. Thay `<…>` bằng số thật trong app.

**31. USP của sản phẩm là gì, vì sao khách chọn bạn mà không chọn đối thủ?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Một câu USP: dành cho <khách>, giúp <kết quả> bằng <cơ chế> thay vì <cách thông thường>>.
- Trả lời: USP đạt vì nó quan trọng với khách, khác đối thủ và có bằng chứng ngay trong app (<số/chức năng>). Đội đã kiểm 7 tiêu chí (cụ thể, khác biệt, quan trọng, dễ hiểu, đáng tin, bền, dùng được trong marketing).
- Giới hạn: <bằng chứng nào chưa có dữ liệu thật>. (Nguồn: kien-thuc/02 §2.2)

**32. USP của bạn có phải chỉ là khẩu hiệu "chất lượng, uy tín" không?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Không: đội nói cụ thể <con số/cam kết> và có chỗ chứng minh trong app.
- Trả lời: "chất lượng, chuyên nghiệp" ai cũng nói được nên không tính. Câu của đội dùng <công thức: kết quả + khác biệt + bằng chứng>; cam kết nào cũng khớp vận hành (không hứa quá năng lực).
- Giới hạn: <lời hứa còn phải kiểm với vận hành thật>. (Nguồn: kien-thuc/02 §2.1, §2.6 Promise Gap)

**33. Vì sao chọn phân khúc này, không phục vụ cả thị trường?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Vì nguồn lực nhỏ phải tập trung vào nhóm tiếp cận được, cần gấp và chi trả được.
- Trả lời: đội chấm <các phân khúc> theo quy mô, cấp thiết, khả năng chi trả, tiếp cận, phù hợp sản phẩm; chọn <A> làm trọng tâm, <B> thử nghiệm, chưa phục vụ <C>.
- Giới hạn: số khách của phân khúc là giả định `<tên ô>`, đội kiểm bằng <cách>. (Nguồn: kien-thuc/01 §2.1-2.3)

**34. Khách hàng điển hình (persona) của bạn là ai, bằng chứng đâu?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): <Persona> cần <việc>, bị cản bởi <rào cản>; sản phẩm gỡ đúng rào cản đó.
- Trả lời: persona dựng từ <dữ liệu BTC / giả thuyết>; phần chưa kiểm ghi là "Giả thuyết" trong app, đội sẽ kiểm bằng phỏng vấn/bán thử.
- Giới hạn: chưa có phỏng vấn thật trong 60 phút. (Nguồn: kien-thuc/01 §3.2, §3.4)

**35. Định vị của bạn khác đối thủ ở đâu?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Đối thủ nhấn <X>, đội chọn <Y> vì khách quan tâm <Y> và đội làm được.
- Trả lời: định vị phải nhất quán với năng lực, phù hợp khách, khác đối thủ (tam giác định vị); đối thủ gồm cả cách tự làm hoặc không làm gì.
- Giới hạn: <chưa so với đối thủ nào ngoài các đối thủ đã nêu>. (Nguồn: kien-thuc/02 §1.3, §2.3)

**36. Chọn kênh bán/quảng bá nào và vì sao? Đo hiệu quả thế nào?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Kênh <A> để <vai trò>, kênh <B> để <vai trò>; đo bằng CAC và tỉ lệ chuyển đổi, không đo lượt thích.
- Trả lời: mỗi kênh có vai trò (kéo khách, giáo dục, tạo niềm tin, chuyển đổi, giữ chân); chấm theo khách, ý định, nguồn lực, chi phí; kênh yếu sẽ dừng theo ngưỡng <…>.
- Giới hạn: CPC/CR của kênh là giả định `<tên ô>`. (Nguồn: kien-thuc/04 §III.4-5, §III.7.3)

**37. Phí sàn bao nhiêu, lấy ở đâu?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Đội dùng <x>% phí sàn, giáo trình ghi mức trung bình khoảng 5,5-6% và nói sàn đổi phí nhiều lần nên đội để khoảng <min-max>.
- Trả lời: phí sàn, phí thanh toán, trợ giá và thuế <1% TNCN + 0,5% GTGT nếu đề dùng> đều là dòng riêng trong bảng giả định, có nhãn nguồn; chưa có số của đề thì ghi "Giả định" và yêu cầu kiểm lại biểu phí hiện hành.
- Giới hạn: <phí hiện hành có thể khác>. (Nguồn: kien-thuc/05 §1.3, §4.1, §5.2)

**38. Voucher/khuyến mãi này có lỗ không và có bị lạm dụng không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Không lỗ khi <đơn tối thiểu/mức giảm>, vì sau ưu đãi vẫn còn lãi góp <…>; có trần ngân sách <…> và giới hạn <…> mỗi khách.
- Trả lời: dùng công thức giá `C0 / (1 − (F+M+R))` để tìm mức giảm tối đa; không chồng nhiều chương trình; chống lạm dụng bằng giới hạn mỗi khách/lượt/thời hạn (sàn quét trùng IP/thiết bị, đơn rỗng, lạm dụng Freeship/hoàn xu).
- Giới hạn: tỉ lệ khách vốn sẽ mua (cannibalization) là giả định `<tên ô>`, chưa kiểm thị trường thật. (Nguồn: kien-thuc/05 §3.2, §7.3, §6.5)

**39. Quảng cáo trả phí có đáng không? ROAS bao nhiêu thì hòa vốn?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): ROAS hòa vốn = 1 ÷ biên gộp, tức <…>; kịch bản cơ sở đạt <…>, kịch bản xấu <…>.
- Trả lời: CPC thực tế = chi phí ads ÷ click; chi phí mỗi đơn = CPC ÷ CR; giá thầu trần = giá bán × %chi phí ads chịu được × %CR. Ngân sách ads có trần theo ngày vì sàn có thể tiêu hết rất nhanh; tháng đầu coi là giai đoạn máy học.
- Giới hạn: CPC và CR là giả định `<tên ô>`. (Nguồn: kien-thuc/05 §8.3-8.4; references/11 §3 công thức ROAS)

**40. Mô hình có phễu sản phẩm không: món nào kéo khách, món nào ra lãi?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Có: gói <dùng thử> kéo khách, gói <chủ lực> ra doanh thu, gói <nối tiếp/VIP> tăng giá trị mỗi khách.
- Trả lời: mỗi tầng có giá, giá vốn, tỉ trọng và chỉ số riêng trong app; AOV tính từ tỉ trọng các gói; gói dùng thử có trần lỗ = CAC chấp nhận.
- Giới hạn: tỉ trọng gói là giả định `<tên ô>`. (Nguồn: kien-thuc/02 §3.1; kien-thuc/05 §3.2, §5.3)

**41. Câu tiêu đề/lời kêu gọi của bạn dựa trên công thức nào, có hứa quá không?** `[DA]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Dùng khung <PAS/BAB/AIDA>: nêu <vấn đề> rồi <kết quả cụ thể>, không hứa số đội không chứng minh được.
- Trả lời: tiêu đề theo "đối tượng + vấn đề/kết quả + mức cụ thể"; kiểm 4C (rõ, ngắn, thuyết phục, đáng tin) và trả lời 5 rào cản (tiền, thời gian, thích, tin, cần). CTA gắn USP thay vì "Tìm hiểu thêm".
- Giới hạn: chưa chạy A/B với khách thật. (Nguồn: kien-thuc/03 Phần 2 mục 4, 7, 8; Phần 3 §3.2)

**42. Giả định về hành vi khách (tỉ lệ mua, bỏ giỏ) đội kiểm chứng bằng cách nào?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Hiện là giả định có nhãn; đội sẽ kiểm bằng <phỏng vấn/bán thử/khảo sát nhỏ> rồi thay số.
- Trả lời: bằng chứng mạnh dần: đoán, khách nói, hành vi, khách trả tiền, mua lại; số trong app đang ở mức <…>. Kế hoạch: phỏng vấn sâu hoặc khảo sát thí điểm 15-30 người, cỡ mẫu lớn hơn khi triển khai thật.
- Giới hạn: chưa có mẫu thật trong 60 phút. (Nguồn: kien-thuc/01 §3.4; kien-thuc/07 Phần II Ch.4, Ch.6)

**43. Tiền mặt còn đủ trả chi phí mỗi tháng không, hay chỉ lãi trên giấy?** `[Nguyên]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Tháng <n> là tháng dòng tiền thấp nhất, còn <…>; đội có <hạn mức/cắt chi> dự phòng.
- Trả lời: dòng tiền vào theo chính sách thu tiền (ví dụ trong giáo trình thu 50% tháng này, 35% tháng sau, 15% hai tháng sau; của đội: <…>), dòng tiền ra theo lịch nhập hàng và chi phí cố định; 3 kịch bản lạc quan / cơ sở / bi quan.
- Giới hạn: tỷ lệ thu tiền là giả định `<tên ô>`. (Nguồn: kien-thuc/10 Ch.1 §1.3, Ch.3 §3.2)

**44. Giá bán được tính thế nào, có vừa lãi vừa cạnh tranh không?** `[Dũng]`
- Trả lời ngắn (nói trước, ≤ 10 giây): Giá = giá vốn ÷ (1 − (phí sàn + marketing + lãi kỳ vọng)) = <…>, đội so với giá đối thủ <…>.
- Trả lời: chọn <hớt váng/thâm nhập> vì <cầu co giãn hay không, có hiệu ứng quy mô không>; hòa vốn quảng cáo = ngân sách ÷ lãi gộp mỗi đơn vị. Giáo trình lưu ý giá niêm yết cao không đồng nghĩa lãi ròng cao (ví dụ Nike lãi ròng 5,3% trên giá sỉ).
- Giới hạn: giá đối thủ lấy ngày <…>. (Nguồn: kien-thuc/05 §3.2; kien-thuc/08 Bài 8-9, Case 4)
