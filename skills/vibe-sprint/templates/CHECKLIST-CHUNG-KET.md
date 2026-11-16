# Checklist chung kết: <Tên sản phẩm>

> Khớp Thể lệ Chung kết VIBE-CODING 2026 (`references/00-the-le-chung-ket.md`). Làm 60 phút (13:15–14:15), nộp **4 món** lúc phút 60, sau đó không sửa (trừ khung sự cố BTC mở). Tick từng dòng, không dựa vào trí nhớ. Thể lệ phát tại chỗ khác bản này thì làm theo bản phát tại chỗ và ghi vào `DECISIONS.md`.

## A. Trước giờ thi (chuẩn bị được phép: máy, tài khoản, khung chung)

- [ ] Laptop sạc đầy, trình duyệt cập nhật, Playwright chạy được, hotspot điện thoại thử trước.
- [ ] Tài khoản cần dùng (GitHub, hosting, AI) đã đăng nhập sẵn; không cần nhớ mật khẩu lúc thi.
- [ ] Khung `vibe-sprint` chung đã sẵn sàng. **Trong khung KHÔNG có mã, dữ liệu hay giao diện viết riêng cho một đề cụ thể** (thể lệ cấm chuẩn bị sẵn tính năng cho đề).
- [ ] Đã đọc `references/00`; cả đội biết phân vai (điều phối, agent giả định/mô hình, QA, nộp bài).

## B. T+0→5 (đọc đề)

- [ ] Đọc đề và thể lệ phát tại chỗ; xác nhận **bảng thi**, giờ nộp, câu nhãn (nếu đề có đưa).
- [ ] **Mở file dữ liệu mẫu BTC của bảng mình**; ghi tên sheet/cột vào spec.
- [ ] Spec + Schema Contract + danh sách Giả định xong trước khi spawn agent.

## C. Dữ liệu và nhãn

- [ ] Mọi số liệu/nội dung mô phỏng hoặc mẫu có nhãn rõ cạnh nơi hiển thị (UI + README).
- [ ] Phân biệt ba loại: **Dữ liệu BTC** · **Giả định của đội** · **Mô phỏng**.
- [ ] Đề có đưa câu nhãn thì chép nguyên văn (`mockNotice` trong `js/config.js`, 2 assert `tests/smoke.cjs`, README, bảng kiểm thử, slide khớp nhau).
- [ ] Nút "Điền dữ liệu mẫu" chạy; app mở được từ trạng thái trống.
- [ ] Không còn API key trong mã/ảnh; `node scripts/scan-secrets.mjs .` sạch.

## D. Bảng Kinh tế: mô hình và giả định (49/100 điểm)

- [ ] **Danh sách giả định** hiện trong app, mỗi giả định có giá trị, đơn vị, nguồn/lý do, chỉnh được.
- [ ] **Kịch bản** (lạc quan/cơ sở/bi quan) với số khác nhau thấy được.
- [ ] **Điểm hòa vốn** tính bằng code, có công thức hiển thị, mẫu số 0 thì báo "Không đủ dữ liệu".
- [ ] **Phân tích độ nhạy** (đổi 1 giả định ±10–20%, xem lãi/lỗ đổi thế nào).
- [ ] **Dự phòng** (chi phí/doanh thu lệch) có số cụ thể và lý do.
- [ ] Cơ chế khuyến mãi/ưu đãi **thực tế**: có điều kiện, trần, và dòng "có lỗ không".
- [ ] Slide/đoạn pitch **"Giả định & cách tính"** có mặt (vòng phản biện Kinh tế bắt buộc nêu).
- [ ] *(Bảng Kỹ thuật: bỏ mục D; thay bằng kiểm tra ổn định, lỗi biên, mở rộng.)*

## E. Mobile 360px VÀ 390px (5 tiêu chí thể lệ)

Kiểm ở cả hai độ rộng, mọi màn chính:
Ca thử chi tiết: bảng M1–M5 trong `BANG-KIEM-THU.md`; agent Sonnet thử bằng giả lập điện thoại rồi chụp ảnh dọc.
- [ ] 1. Không tràn ngang, không cuộn ngang (cả bảng, biểu đồ, dialog).
- [ ] 2. Nút/ô nhập đủ to cho ngón tay (≥ 44px), không chồng nhau.
- [ ] 3. Chữ đọc được ở zoom mặc định (ô nhập ≥ 16px).
- [ ] 4. **Mọi luồng chính** làm trọn được trên điện thoại (nhập → kết quả → lưu → xem lại).
- [ ] 5. Điều hướng/tab rõ, luôn biết đang ở đâu.

## F. T+50→55: minh chứng thời điểm chốt (món 4)

- [ ] Sau T+50 **không thêm tính năng**; không push sau khi chụp.
- [ ] **Agent Claude Sonnet chụp** (không chụp tay, không nhờ Gemini): mở web app trên link đã chốt bằng giả lập điện thoại và chụp **ảnh điện thoại DỌC** từng màn chính (mỗi tab), **sáng + tối**, ở **360×780** và **390×844** (DPR 3): `node tools/shots-mobile.cjs <URL> docs/minh-chung-chot/390` và `... --width 360 --height 780` cho bản 360 (hoặc `node deck/tools/capture.cjs`).
- [ ] Thêm **1 ảnh desktop** (làm chứng cứ, không đưa vào slide), rồi mở từng ảnh kiểm: không tràn ngang, không banner lỗi, đúng bản đã chốt.
- [ ] **Hoặc/và** video quay luồng chính **theo chiều dọc** trên điện thoại (không quay ngang), hiển thị rõ phiên bản/ngày giờ.
- [ ] Ghi **hash commit** đang chạy trên link vào README và `PROGRESS.md`: `git rev-parse --short HEAD`.
- [ ] Lưu ở `docs/minh-chung-chot/` (và bản sao ngoài repo, đề phòng).

## G. T+55→60: nộp 4 món

| # | Món | Kiểm tra | Xong |
|---|---|---|---|
| 1 | **Link demo / cách mở** | Mở ở cửa sổ ẩn danh + điện thoại; bản mới nhất; link online bắt buộc | [ ] |
| 2 | **Mã nguồn** | Đúng commit đang chạy trên link; không `.env*`, không key, không `.git` nếu nộp ZIP | [ ] |
| 3 | **README** | Cài đặt/chạy, công nghệ, dữ liệu mẫu/tài khoản, mục Giả định & cách tính, khai báo khung chuẩn bị trước, không còn `<…>` | [ ] |
| 4 | **Minh chứng chốt** | Ảnh điện thoại dọc 360 + 390 (sáng/tối) + 1 ảnh desktop, hoặc video dọc, thấy sản phẩm lúc chốt + hash commit | [ ] |

- [ ] Bản nộp đã chạy `node tools/bump-version.cjs`; phiên bản trên app khớp README.
- [ ] Đã nộp đủ 4 món trước 14:15. Chụp màn hình xác nhận nộp.

## H. README bắt buộc có (kiểm nhanh)

- [ ] Công nghệ + phiên bản; cách chạy local.
- [ ] Mục **Dữ liệu**: file BTC dùng thế nào / dữ liệu mẫu / dữ liệu mô phỏng, ghi rõ.
- [ ] Mục **Giả định & cách tính** (công thức, nguồn con số).
- [ ] Mục **Khung chuẩn bị trước**: "khung vibe-sprint chung chuẩn bị trước giờ thi; mọi tính năng theo đề làm trong 60 phút thi; không có mã riêng cho đề trước giờ thi".
- [ ] Mục **Minh chứng thời điểm chốt** (đường dẫn + hash).

## I. Sau khi nộp (14:15–14:45 giám khảo kiểm tra)

- [ ] **Không sửa** sản phẩm; chỉ dùng khung sự cố nếu BTC mở và ghi lại mọi thay đổi.
- [ ] Máy demo: điện thoại đã phát lên máy chiếu (Android `scrcpy`; iPhone QuickTime/AirPlay; dự phòng Chrome DevTools 390×844), link mở sẵn, bản local dự phòng, video DỌC 30 giây, README, bảng kiểm thử, cáp/đầu chuyển.
- [ ] Chọn bản pitch **10/5/3 phút** khi BTC báo thời lượng; cả bản có phần "Giả định & cách tính".
- [ ] Zoom 100%, tắt thông báo, sạc laptop, dữ liệu mẫu đã nạp.
- [ ] BTC có thể yêu cầu **giải thích** cách làm: mở lịch sử commit, `MINH-CHUNG-AI.md`, trả lời trung thực.
- [ ] Vòng phản biện (đội được chọn): Bảng Kinh tế trình bày giả định và cách tính; xem `HOI-DAP.md` mục F.

**Khi mạng hoặc app lỗi:** chuyển video/bản local, nói rõ đó là bản quay/bản chạy của đúng bản đã nộp; lỗi một tính năng thì nói thẳng, đi tiếp.

## J. Sau buổi chấm

- [ ] Ghi câu hỏi giám khảo và câu trả lời; ghi lỗi + mốc giờ.
- [ ] Giữ nguyên commit/tag đã nộp; lưu file đã nộp và ảnh xác nhận nộp.
