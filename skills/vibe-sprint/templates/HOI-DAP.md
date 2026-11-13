# Chuẩn bị hỏi đáp: <Tên sản phẩm> (Bảng B)

> 20 câu hỏi giám khảo hay hỏi, với khung trả lời. Thay `<…>` bằng số liệu thật của đội. Đừng học thuộc: trả lời theo cấu trúc **Trả lời trực tiếp → Bằng chứng (chỗ trên app hoặc file) → Giới hạn nếu có**.
> Đừng bịa số. Chưa làm thì nói chưa làm, kèm cách đội sẽ làm.

## A. Cách dùng

**1. Người dùng thật của sản phẩm là ai, và họ dùng trong bao lâu?**
- Trả lời: <persona>, dùng khoảng <n> phút từ lúc nhập đến lúc có trang kết quả.
- Bằng chứng: bấm "<Điền dữ liệu mẫu>" rồi tính từ form đến kết quả.

**2. Một người chưa biết gì về sản phẩm, làm sao biết bắt đầu từ đâu?**
- Trả lời: <màn hình đầu tiên có gì>, <nút chính nằm ở đâu>.
- Bằng chứng: <có hướng dẫn ngắn / dữ liệu mẫu có sẵn>.

**3. Kết quả đầu ra dùng được ngay hay phải chỉnh tay?**
- Trả lời: <dùng được ngay / cần chỉnh <phần nào>, chỉnh bằng cách nào>.
- Giới hạn: <…>.

**4. Sau khi có kết quả, người dùng đưa cho khách bằng cách nào?**
- Trả lời: <link, QR, xuất file, tải về>.
- Bằng chứng: <bấm thử đường đi đó trên app>.

## B. Nghiệp vụ

**5. Nhập thiếu hoặc sai thì app xử lý thế nào?**
- Trả lời: báo lỗi ngay dưới từng ô, không tạo dữ liệu. <Liệt kê quy tắc chính.>
- Bằng chứng: TC03 và TC04 trong `BANG-KIEM-THU.md`.

**6. Hai người (hoặc một người bấm hai lần) cùng gửi, có bị ghi trùng không?**
- Trả lời: <trùng theo khoá nào: SĐT, email>, <trùng thì báo đã có>.
- Bằng chứng: TC05.

**7. Hết chỗ thì sao?**
- Trả lời: <danh sách chờ / báo hết>, nút đổi thành <…>.
- Bằng chứng: TC06.

**8. Sự kiện đã diễn ra thì trang hiện gì?**
- Trả lời: nhãn "<Sự kiện đã diễn ra>", không đếm số âm, ẩn form.
- Bằng chứng: <ca thử đặt thời gian quá khứ>.

**9. Vì sao chọn quy tắc này, không chọn quy tắc khác?**
- Trả lời: <lý do theo nghiệp vụ, ví dụ: một SĐT chỉ là một người tham dự>.
- Ghi chú: quyết định này ghi ở `DECISIONS.md` mục <Dxx>.

## C. Dữ liệu thật hay mô phỏng

**10. AI trong app là thật hay mô phỏng?**
- Trả lời: <chế độ mặc định là gì>. Khi chạy <chế độ AI thật>, app dùng <model>. Khi không có key, app <chuyển sang mô phỏng và hiện nhãn>.
- Bằng chứng: nhãn "<câu nhãn>" trên giao diện.

**11. Làm sao giám khảo biết nội dung không phải do công thức sinh ra?**
- Trả lời: mục chế độ hiện trên giao diện và trong README; kết quả thật có <dấu hiệu, ví dụ: câu văn không lặp mẫu>.
- Giới hạn: <…>.

**12. API key được lưu ở đâu? Có bị lộ không?**
- Trả lời: <key nằm trong trình duyệt của người dùng / biến môi trường máy chủ>. Không có key nào trong mã nguồn.
- Bằng chứng: `scripts/scan-secrets.mjs` (kết quả đã chạy, <n> chỗ flag, <lý do>).

**13. Dữ liệu của người dùng lưu ở đâu, mất khi nào?**
- Trả lời: <localStorage trên một trình duyệt / Firestore có đăng nhập>. Xoá dữ liệu trình duyệt thì mất.
- Giới hạn: không đồng bộ giữa các máy nếu chưa xuất bản.

## D. Vòng cải thiện bằng AI

**14. AI viết sai hoặc trả về sai định dạng thì làm gì?**
- Trả lời: tách JSON khỏi lời dẫn, kiểm tra đủ trường; thiếu thì bù bằng bản mô phỏng và báo rõ.
- Bằng chứng: TC06 hoặc vòng <n> trong `MINH-CHUNG-AI.md`.

**15. Đội đã dùng AI để cải thiện sản phẩm như thế nào? Cho một ví dụ.**
- Trả lời: vòng <n>: vấn đề <…> → yêu cầu sửa <…> → kiểm tra lại <kết quả đo được>.
- Bằng chứng: ảnh <n> trong `MINH-CHUNG-AI.md`.

**16. Phần nào AI viết, phần nào đội tự kiểm tra?**
- Trả lời: AI viết mã và prompt; đội tự mở app, thử trên <thiết bị>, và chạy <lệnh test>. Kết quả nằm ở `BANG-KIEM-THU.md`.

## E. Giới hạn và mở rộng

**17. Sản phẩm có chạy được với nhiều người cùng lúc không?**
- Trả lời: <có / chưa: lý do, ví dụ: localStorage chỉ một máy>. Khi xuất bản dùng <Firestore> thì số đếm chung.
- Giới hạn: <…>.

**18. Nếu làm thêm một tuần, đội sẽ làm gì trước?**
- Trả lời: <việc ưu tiên 1 và lý do>, <việc ưu tiên 2>. Không ưu tiên <tính năng ngoài đề>.

**19. Vì sao không làm tính năng <X> trong đề?**
- Trả lời: <nằm trong phần "Ngoài phạm vi" của `spec-nhanh.md`, lý do: thời gian 60 phút / đề không yêu cầu>.

**20. Bảo mật và quyền truy cập thế nào?**
- Trả lời: <ai xem được gì>. Ghi chú đã kiểm thử: <ca bảo mật nếu có>.
- Giới hạn: <chưa kiểm tra bằng tài khoản thứ ba, v.v.>.
