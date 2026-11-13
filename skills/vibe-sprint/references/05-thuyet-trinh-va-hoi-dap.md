# 05 — Thuyết trình, demo trực tiếp và hỏi đáp

Thời lượng tổng thường ~5–7 phút trình bày + 5 phút hỏi đáp (xác nhận lại với BTC ngay khi bốc đề). Slide dựng từ `deck/` bởi deck agent, dùng ảnh chụp **thật** từ app đã deploy.

## Cấu trúc 5–7 phút (8–9 slide, mỗi slide 30–50 giây)

| # | Slide | Nội dung | Giờ |
|---|---|---|---|
| 1 | Tên đội + app + khẩu hiệu 1 dòng | Đề số, bảng thi | 0:15 |
| 2 | Vấn đề & người dùng | 1 persona, 1 nỗi đau có số/ví dụ thật | 0:45 |
| 3 | Giải pháp trong 1 câu + 5 tính năng | Biểu tượng + 1 dòng mỗi tính năng | 0:45 |
| 4–5 | **Demo trực tiếp** (xem kịch bản) | Chạy app thật | 2:30 |
| 6 | AI: dùng để xây và để cải thiện | Quá trình thử → sửa prompt → kết quả tốt hơn; mock có nhãn; kiểm soát đầu ra | 0:45 |
| 7 | Chất lượng | Test (số ca đạt), mobile, sáng/tối, validation | 0:30 |
| 8 | Giới hạn thật + hướng phát triển | Nói thật phần mô phỏng, localStorage... | 0:30 |
| 9 | Cảm ơn + link/QR app | | 0:10 |

Luật slide: một ý mỗi slide, chữ ≥ 28pt, ảnh chụp app thật thay vì minh hoạ chung, tiếng Việt có dấu, không đọc nguyên slide.

## Kịch bản demo trực tiếp (2–2.5 phút)

1. Mở **link online** (tab đã tải sẵn, đã tải trước dữ liệu demo). Cửa sổ trình duyệt 100% zoom, đóng thông báo/tab khác.
2. Nói 1 câu bối cảnh người dùng ("Chị Lan là chủ quán...").
3. Đi **đúng luồng 5 tính năng theo thứ tự đề**, mỗi cái 20–30 giây, tập trung kết quả thấy được.
4. Chèn **1 ca đầu vào sai** (email sai → thấy cảnh báo) và **1 ca biên** (trùng/hết hạn) — để lộ nghiệp vụ.
5. Chỉ nhãn mô phỏng AI (nếu dùng mock) hoặc gọi AI thật bằng key sẵn lưu.
6. Chuyển Sáng/Tối 1 lần, thu nhỏ cửa sổ/điện thoại thật để thấy mobile.
7. Kết: quay về slide giới hạn.

Tập demo **ít nhất 2 lần đầy đủ** ở T+52→58 với đồng hồ. Phân vai: 1 người nói, 1 người thao tác (hoặc 1 người làm cả hai nếu ít người).

## Phương án dự phòng (chuẩn bị trước T+52)

- **Video quay màn hình ≤ 2 phút** (5 tính năng) lưu sẵn trên máy + USB/điện thoại; mở được offline.
- **Bản local:** `python3 -m http.server 8080` trong thư mục app (hoặc mở `index.html` bằng `file://` nếu app không cần server).
- **Ảnh chụp 5 tính năng** trong slide phụ ("Dự phòng") nếu cả hai đều hỏng.
- Quy tắc: demo hỏng >10 giây → chuyển sang dự phòng, **đừng sửa trực tiếp trên sân khấu**. Nói bình tĩnh: "Mạng đang chậm, em chuyển sang bản quay sẵn".
- Dữ liệu demo đặt lại bằng nút "Khôi phục dữ liệu mẫu" trước khi vào phòng.

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
