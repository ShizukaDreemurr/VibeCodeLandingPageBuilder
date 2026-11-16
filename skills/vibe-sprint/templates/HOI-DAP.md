# Chuẩn bị hỏi đáp: <Tên sản phẩm> (Bảng B)

> 30 câu hỏi giám khảo hay hỏi (20 câu chung + 10 câu mô hình kinh doanh ở mục F, **Q&A chỉ có ở vòng phản biện; Bảng Kinh tế phải trình bày giả định và cách tính**), với khung trả lời. Mỗi câu gắn người trả lời: `[DA]` Diệu Anh, `[Dũng]` Vũ Trí Dũng, `[Nguyên]` Nguyên. Câu không có chủ hoặc câu bẫy: **Nguyên bắt**. Luôn nói **câu trả lời ngắn (1 câu) trước**, rồi mới bằng chứng. Thay `<…>` bằng số liệu thật của đội. Đừng học thuộc: trả lời theo cấu trúc **Trả lời ngắn 1 câu → Bằng chứng (chỗ trên app hoặc file) → Giới hạn nếu có**.
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
