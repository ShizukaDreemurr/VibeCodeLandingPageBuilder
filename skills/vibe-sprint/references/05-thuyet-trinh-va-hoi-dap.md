# 05 — Thuyết trình, demo trực tiếp và hỏi đáp

Thời lượng tổng thường ~5–7 phút trình bày + 5 phút hỏi đáp (xác nhận lại với BTC ngay khi bốc đề). Slide dựng từ `deck/` bởi deck agent (`node deck/tools/capture.cjs` chụp ảnh **thật** từ app, `node deck/tools/export.cjs` xuất PDF dự phòng vào `deck/out/`).

## Cấu trúc 5–7 phút (12 slide của `deck/`, ~6:50)

Dựng bằng `deck/` (điền dữ liệu `deck/deck.data.js`, không sửa layout; chi tiết ở `deck/README.md`). Phím: `←/→` chuyển, `N` ghi chú + đồng hồ, `F` toàn màn hình, `Ctrl+P` in PDF.

| # | Slide (`type`) | Nội dung | Giờ |
|---|---|---|---|
| 1 | cover | Chào, tên đội + app + khẩu hiệu 1 dòng, đề số, bảng thi | 0:15 |
| 2 | problem | 1 persona, 1 nỗi đau có số/ví dụ thật | 0:40 |
| 3 | solution | Giải pháp trong 1 câu, chỉ vào ảnh | 0:30 |
| 4 | features | 5 tính năng, nhấn 1–2 quy tắc nghiệp vụ | 0:40 |
| 5 | flow | 3–5 bước dùng | 0:30 |
| 6 | demo | **Demo trực tiếp** (xem kịch bản); mất mạng thì video/ảnh | 1:30 |
| 7 | ai | AI để xây vs AI trong sản phẩm; thật vs mô phỏng (nhãn nguyên văn đề/BTC); prompt → kiểm tra → dự phòng | 0:50 |
| 8 | quality | Bảng ca kiểm thử (số thật), mobile, sáng/tối, nói thẳng lỗi còn lại | 0:40 |
| 9 | metrics | 3–4 con số kiểm chứng được | 0:25 |
| 10 | roadmap | Giới hạn thật + bước tiếp theo | 0:20 |
| 11 | team | Vai trò | 0:15 |
| 12 | thanks | QR + link, mời "Hỏi đáp" | 0:15 |

Chỉ có 5 phút: bỏ slide 5 và 11, rút demo còn 1:00. Slide AI: nếu app dùng mock, ghi đúng câu nhãn mà BTC yêu cầu (chép nguyên văn, không dùng câu vòng loại `Bản demo vòng loại - Dữ liệu mô phỏng AI` nếu đề chung kết khác).

Luật slide: một ý mỗi slide, chữ ≥ 28pt, ảnh chụp app thật thay vì minh hoạ chung, tiếng Việt có dấu, không đọc nguyên slide.

## Kịch bản demo trực tiếp (2–2.5 phút)

1. Mở **link online** (tab đã tải sẵn, đã tải trước dữ liệu demo). Cửa sổ trình duyệt 100% zoom, đóng thông báo/tab khác.
2. Nói 1 câu bối cảnh người dùng ("Chị Lan là chủ quán...").
3. Đi **đúng luồng 5 tính năng theo thứ tự đề**, mỗi cái 20–30 giây, tập trung kết quả thấy được.
4. Chèn **1 ca đầu vào sai** (email sai → thấy cảnh báo) và **1 ca biên** (trùng/hết hạn) — để lộ nghiệp vụ.
5. Chỉ nhãn mô phỏng AI (nếu dùng mock; đúng câu BTC yêu cầu) hoặc gọi AI thật bằng key nhập sẵn ở Cài đặt (tick "Nhớ key" chỉ trên máy cá nhân).
6. Chuyển Sáng/Tối 1 lần, thu nhỏ cửa sổ/điện thoại thật để thấy mobile.
7. Kết: quay về slide giới hạn.

Tập demo **ít nhất 2 lần đầy đủ** ở T+52→58 với đồng hồ. Phân vai: 1 người nói, 1 người thao tác (hoặc 1 người làm cả hai nếu ít người).

## Phương án dự phòng (chuẩn bị trước T+52)

- **Video quay màn hình ≤ 2 phút** (5 tính năng) lưu sẵn trên máy + USB/điện thoại; mở được offline.
- **Bản local:** `python3 -m http.server 8211` trong thư mục app (rồi mở `http://localhost:8211/?demo=1`) (hoặc mở `index.html` bằng `file://` nếu app không cần server).
- **Ảnh chụp 5 tính năng** trong slide phụ ("Dự phòng") nếu cả hai đều hỏng.
- Quy tắc: demo hỏng >10 giây → chuyển sang dự phòng, **đừng sửa trực tiếp trên sân khấu**. Nói bình tĩnh: "Mạng đang chậm, em chuyển sang bản quay sẵn".
- Dữ liệu demo đặt lại bằng nút "Nạp lại dữ liệu demo" ở Cài đặt (hoặc mở `?demo=1`) trước khi vào phòng.

## Hỏi đáp Bảng B (cách dùng, nghiệp vụ, quá trình cải thiện AI)

Chuẩn bị 1 câu trả lời 20–30 giây cho từng câu; ai trả lời đã phân sẵn.

**Cách dùng**
- Người dùng bắt đầu từ đâu, mất bao lâu để hoàn thành việc chính? (đo bằng số thật: "dưới 3 phút")
- Ai là người dùng chính, họ dùng mỗi ngày/tuần ra sao?
- Nếu người dùng nhập sai thì sao? (chỉ ca validation đã demo)

**Nghiệp vụ**
- Quy tắc nghiệp vụ chính là gì, vì sao chọn vậy? (nêu theo Input→Quy tắc→Output→Lưu trữ)
- Xử lý trùng / hết hạn / hết chỗ / dữ liệu rỗng thế nào?
- Dữ liệu lưu ở đâu, mất khi nào? (nói thật: localStorage trên 1 máy; hướng phát triển: cloud)
- Khác gì cách làm thủ công / công cụ hiện có? Giá trị đo được?

**Quá trình cải thiện AI**
- Prompt đầu tiên là gì, lỗi gì xuất hiện, sửa thế nào? Cho **một ví dụ trước/sau thật** (có ảnh trong minh chứng AI).
- AI nào dùng để *xây* (Claude Code...) và AI nào dùng *trong sản phẩm*? Phần nào mock?
- Kiểm soát đầu ra: schema/parse JSON chịu lỗi, thiếu trường thì bù, dữ kiện chính xác lấy từ form không để AI bịa.
- Khi AI sai thì app xử lý ra sao? Nhãn mô phỏng ở đâu?
- Cách chia việc cho nhiều agent song song, kiểm chứng bằng test và ảnh chụp.

**Bảng A bổ sung** (nếu thi bảng A): vì sao chọn vanilla/không build; cách tách module; cách test (số ca, e2e); bảo mật key (không vào code, `***`, người dùng tự nhập); xử lý lỗi mạng/AI; thiết kế dữ liệu.

**Mẹo trả lời:** nhận giới hạn trước khi bị hỏi; chỉ nói điều đã chạy thật; "chưa làm, sẽ làm như sau..." tốt hơn nói quá. Không nói "AI làm hết".

## Việc cần có trước khi vào phòng

- [ ] Link online mở được trên điện thoại (QR trên slide cuối).
- [ ] Video dự phòng + bản local chạy.
- [ ] 1 người học thuộc 3 số: số tính năng đạt, số ca kiểm thử đạt, thời gian hoàn thành luồng chính.
- [ ] Phân vai nói/thao tác, tập đủ giờ.
