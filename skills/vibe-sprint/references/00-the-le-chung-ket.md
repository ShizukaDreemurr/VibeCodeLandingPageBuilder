# 00 — Thể lệ Chung kết VIBE-CODING 2026 (đọc đầu tiên) và hệ quả cho quy trình

> Nguồn: Thể lệ Chung kết VIBE-CODING 2026 do BTC công bố. Đây là bản tóm tắt để làm việc; **khi thể lệ/đề thật khác bản này, thể lệ/đề thật thắng**, ghi chênh lệch vào `docs/DECISIONS.md`.

## 1. Lịch và thể thức

| Mốc | Việc |
|---|---|
| 13:15–14:15 | **60 phút làm bài** (đề bốc tại chỗ, chưa công bố trước) |
| 14:15 | Chốt: nộp đủ 4 món (mục 3). Sau giờ này **không sửa** (trừ khung sửa sự cố do BTC mở) |
| 14:15–14:45 | Giám khảo kiểm tra sản phẩm |
| 14:45–15:45 | Thuyết trình + hỏi đáp. **Thời lượng mỗi đội BTC báo sau, giống nhau cho mọi đội** |

- **Vòng 1 không có Q&A.** Q&A chỉ ở **"vòng phản biện"** với các đội được chọn. Bảng Kinh tế ở vòng phản biện **phải trình bày thêm giả định và cách tính nghiệp vụ**.
- Thời lượng pitch chưa biết → chuẩn bị 3 bản (10 / 5 / 3 phút) trong `templates/KICH-BAN-DEMO.md`; chọn bản ngay khi BTC báo.

## 2. Được và cấm

| Được | Cấm |
|---|---|
| Dùng công cụ AI, nền tảng, thư viện, tài liệu tham khảo | **Chuẩn bị sẵn sản phẩm hoàn chỉnh hoặc tính năng làm riêng cho đề (đề chưa công bố)** |
| Chuẩn bị máy, tài khoản, khung/scaffold chung | Mang vào mã/dữ liệu/giao diện viết riêng cho một đề cụ thể |

- Mọi thứ **tính là sản phẩm** phải được làm/hoàn thiện **trong giờ thi**. BTC có thể **yêu cầu đội giải thích** (nên giữ nhật ký commit, minh chứng AI, ảnh chụp theo thời gian).
- BTC phát **1 file dữ liệu mẫu cho mỗi bảng ở đầu giờ** (chỉ chứa sheet của bảng đó). Số liệu mô phỏng phải **ghi rõ là dữ liệu mẫu/mô phỏng**. Thể lệ hiện **không còn** câu nhãn cố định; đề có đưa câu nào thì dùng nguyên văn.

## 3. Nộp bài lúc phút 60 (4 món, bắt buộc)

1. **Link demo / cách mở** (link online bắt buộc).
2. **Mã nguồn** (khớp bản demo).
3. **README**: cài đặt/chạy, công nghệ, dữ liệu mẫu/tài khoản.
4. **Minh chứng quá trình**: ảnh chụp hoặc video quay màn hình thể hiện sản phẩm **tại thời điểm chốt**.

Không sửa sau khi nộp (trừ khung sự cố). Tính điểm bộ hồ sơ: Kinh tế 9 điểm (link 2, mã nguồn 3 khớp demo, README 2, minh chứng chốt 2); Kỹ thuật 9 điểm.

## 4. Mobile 360–390px (5 tiêu chí)

1. Không tràn, không cuộn ngang.
2. Nút/ô nhập đủ to cho ngón tay, không chồng nhau.
3. Chữ đọc được ở zoom mặc định.
4. Mọi luồng chính làm được trên điện thoại.
5. Điều hướng/tab rõ, biết đang ở đâu.

## 5. Thang điểm

| Hạng mục | **Bảng Kinh tế** | **Bảng Kỹ thuật** |
|---|---|---|
| Tính năng cốt lõi | 27 | 35 |
| Kỹ thuật/ổn định | | 18 |
| Mobile | 10 | 10 |
| UI/UX/hoàn thiện | 5 | 7 (UX) |
| Thực tế của cơ chế kinh doanh/khuyến mãi | 10 | |
| **Phân tích mô hình kinh doanh** | **22** | |
| **Số liệu dự phòng và giả định** | **17** | |
| Mở rộng/sáng tạo | | 10 |
| Thuyết trình/demo | | 11 |
| Hồ sơ nộp | 9 | 9 (+4 thưởng ngoại vi/QR) |

- Điểm các giám khảo lấy **trung bình, làm tròn 1 chữ số thập phân**. Xếp loại: **90+ / 75+ / 60+**.
- Đồng điểm: so **tính năng cốt lõi** trước, rồi **trọng tâm của bảng**.
- Kinh tế: 22 + 17 + 10 = **49 điểm** nằm ở mô hình, giả định, cơ chế thực tế. Làm đẹp UI chỉ đáng 5.

## 6. Hệ quả cho quy trình của đội

| Thể lệ nói | Ta làm |
|---|---|
| Cấm chuẩn bị sẵn tính năng cho đề | `starter/` là **khung chung** (token, form, bảng, biểu đồ, `EP.ai`, `EP.scenario`, `EP.importer`...), không có logic của đề nào. README **khai báo** điều này (mục "Khung chuẩn bị trước"). Không chép code/dữ liệu đã viết cho một đề dự đoán (catalog chỉ để luyện, không dùng lại code) |
| Làm tính năng trong giờ thi, BTC có thể hỏi | Commit nhỏ, thông điệp rõ theo giờ; giữ `docs/MINH-CHUNG-AI.md`; ghi giờ vào `PROGRESS.md` |
| File dữ liệu BTC phát lúc đầu | T+0 mở ngay, đọc sheet/cột/định dạng, đưa vào Schema Contract; app đọc được file này (`EP.importer`, `js/import.js`) và có "Điền dữ liệu mẫu" từ chính nó |
| Số liệu mô phỏng phải ghi rõ | Mọi số/bảng không phải của BTC có nhãn "Dữ liệu mẫu/mô phỏng" ngay cạnh số; README mục Dữ liệu liệt kê nguồn từng bộ |
| Nộp 4 món ở phút 60, không sửa sau | **T+50–55 chụp minh chứng chốt** (ảnh/quay màn hình + hash commit); **T+55–60 nộp 4 món**. Không còn tính năng mới sau T+50 |
| Link online bắt buộc | Pages/Netlify chạy từ T+40; thử cửa sổ ẩn danh; chuẩn bị phương án dự phòng (`SKILL.md` mục Nếu sự cố) |
| Mã nguồn phải khớp demo | Nộp đúng commit đang chạy trên link; không push sau khi chụp minh chứng; ghi hash vào README |
| Mobile 5 tiêu chí | Kiểm ở **360 và 390px**, đủ 5 tiêu chí (`templates/CHECKLIST-CHUNG-KET.md`) |
| Kinh tế: 22+17+10 điểm | Giao 1 agent riêng **"Giả định & mô hình kinh doanh"** (`references/11-mo-hinh-kinh-doanh.md`, `EP.scenario`, `EP.importer`): danh sách giả định có nguồn, kịch bản (lạc quan/cơ sở/bi quan), hòa vốn, độ nhạy, dự phòng, kiểm tra ưu đãi có lỗ không |
| Vòng phản biện Kinh tế | Slide/đoạn **"Giả định & cách tính"** bắt buộc trong cả ba bản pitch; 10 câu hỏi mô hình trong `templates/HOI-DAP.md` mục F |
| Thời lượng pitch chưa biết | 3 bản 10 / 5 / 3 phút, vai Diệu Anh / Dũng / Nguyên giữ nguyên |
| Đồng điểm xét tính năng cốt lõi | Cắt tính năng phụ, không cắt lõi; lõi chạy trọn trước khi làm đẹp |

## 7. Việc phải làm ở T+0

- [ ] Đọc đề và thể lệ bản phát: bảng thi, giờ nộp, có câu nhãn nào không.
- [ ] Mở file dữ liệu mẫu của bảng mình, ghi tên sheet/cột vào spec.
- [ ] Ghi vào `docs/DECISIONS.md`: mọi chênh lệch giữa thể lệ này và thể lệ phát tại chỗ.
