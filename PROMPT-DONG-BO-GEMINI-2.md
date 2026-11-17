# ĐỒNG BỘ LẦN 2: CLAUDE (OPUS) → GEMINI ANTIGRAVITY (bổ sung cho `PROMPT-DONG-BO-GEMINI.md`)

Đọc file đồng bộ lần 1 trước, rồi đọc file này. Nếu hai file nói khác nhau thì **theo file này**.

## 1. Quyết định mới của đội (Nguyên chốt)
- **Không diễn tập đề rehearsal, không luyện hỏi đáp với giám khảo giả.** Thời gian còn ít, dồn hết cho skill và quy trình.
- **Không dùng điện thoại thật để demo.** Ảnh app do **Claude Sonnet 5.5 chạy trong Chrome** tự mở web, ép khung 390×844 (thêm 360×780) và tự chụp.
- **Nhóm không tự bấm chuyển slide.** Slide xuất xong gửi bộ phận kỹ thuật của BTC. Người nói báo chuyển bằng câu cố định: "Mời chuyển slide" / "Slide tiếp theo".
- **Hôm thi, Claude được dùng thoải mái** (2 phiên × 5 giờ), điều phối nhiều agent cùng lúc. **Gemini Antigravity chạy song song**, nhận việc qua mega prompt Claude viết.
- **Key Gemini:** key dùng trong chat khác với key nằm trong Worker. Không cần thu hồi. Worker vẫn chạy bình thường.
- **GitHub Pages của `Xclipse-ChungKet` đã bật** (nhánh `nop-bai`).

## 2. Quy trình làm slide song song (mới) → `references/14-quy-trinh-slide-song-song.md`
| Mốc | Việc | Ai làm / công cụ |
|---|---|---|
| T+0–5 | Đọc đề, mở file BTC, viết spec + hợp đồng dữ liệu + danh sách giả định | Claude (Opus) |
| T+5–10 | Viết **mega prompt giao việc cho Gemini** (`prompts/16`) | Claude → Gemini |
| ~T+10 | Viết **mega prompt dựng khung slide chưa có ảnh** (`prompts/14`), gửi Claude Design | Claude → Nguyên dán vào Claude Design |
| T+20 | Diệu Anh và Dũng **tập nói trên khung slide** | Thành viên |
| ~T+45 | App xong → gửi **prompt chụp ảnh** (`prompts/15`) cho Claude Sonnet trong Chrome → ra **file zip ảnh** đặt tên đúng từng ô | Claude Sonnet (Chrome) |
| T+50 | Nguyên tải zip lên **đúng dự án Claude Design đó** → dùng prompt "Phần 2: chèn ảnh" | Claude Design |
| T+55 | Xuất PDF/PPTX gửi bộ phận kỹ thuật; nộp 4 mục bằng `scripts/nop-bai.mjs` | Nguyên |

Dự phòng: Claude Design chậm thì dùng `deck/` tự xuất. Chụp bằng Chrome lỗi thì dùng `starter/tools/shots-mobile.cjs`.

## 3. Quy chuẩn viết slide (bắt buộc, đã ghi vào `prompts/14` và `references/05`)
- **Tiêu đề và phụ đề kiểu định danh**, không khẳng định hay cảm xúc. Ví dụ: "Bối cảnh các SME hiện nay", không viết "Nỗi đau của các SME hiện nay: tay ngang". Không dùng từ sáo rỗng.
- **Mật độ chữ:** không quá nhiều, không quá ít, để người đang run nhìn vào vẫn đọc được. Khoảng 3–5 gạch đầu dòng, mỗi dòng ≤ 14 chữ, kèm 1 con số chính.
- **Lời văn đơn giản nhưng sâu**, thể hiện hiểu biết của người phụ trách từng phần:
  - **Diệu Anh:** bối cảnh, người dùng, UI/UX.
  - **Vũ Trí Dũng:** tính năng, nghiệp vụ, demo.
  - **Nguyên:** kỹ thuật, giả định và mô hình kinh doanh, tổng kết.
- **Ảnh:** mọi ảnh app là **ảnh điện thoại dọc 9:19.5 đặt trong khung máy**. Không cắt thành ngang hay vuông. Tối đa 3 máy mỗi slide.
- **Mega prompt Claude Design đã nhúng sẵn toàn bộ mã giao diện:** token màu, font, khoảng cách, bo góc, đổ bóng, khung điện thoại, các mẫu bố cục, icon Xclipse. Kèm bảng quy chuẩn từng slide cho bản 11/7/5 slide, để Claude Design **chỉ làm theo, không tự đoán thiết kế**.

## 4. Những gì Claude đang làm (3 agent Sonnet). Gemini chưa sửa các file này
1. **Làm lại app ưu tiên điện thoại tuyệt đối** (`skills/vibe-sprint/starter/` + repo `Xclipse-ChungKet`):
   - quy chuẩn `references/13-chuan-mobile.md`;
   - tab dưới đáy, thanh hành động chính dính đáy, form trượt lên từ đáy;
   - test riêng cho điện thoại ở 360 và 390;
   - script `tools/shots-mobile.cjs`.
2. **Bộ mega prompt và quy trình:**
   - `prompts/14-claude-design-khung-slide.md` (khung slide; phần 2 là chèn ảnh);
   - `prompts/15-sonnet-chrome-chup-anh.md` (chụp ảnh dọc, ra zip kèm `manifest.txt`);
   - `prompts/16-gemini-antigravity-giao-viec.md` (**prompt Gemini sẽ nhận hôm thi**, gồm 4 mẫu giao việc con: UI/tính năng, dữ liệu/nhập file, tài liệu/README/minh chứng, rà giả định kinh doanh);
   - `references/14`, **`templates/THE-DIEU-PHOI.md`** (thẻ 1 trang cho Nguyên: mốc nào gõ gì, gửi prompt nào đi đâu, gặp sự cố thì làm gì);
   - cập nhật SKILL.md, kịch bản và thẻ nhắc (câu báo chuyển slide).
3. **Điền sẵn thông tin đội và 2 script:**
   - README và các file mẫu đã có Xclipse, 3 thành viên kèm vai trò, link repo và Pages, mục "Khung chuẩn bị trước", mục "Công cụ AI". Tên trường để `{{TRUONG}}`, Nguyên sẽ điền.
   - `scripts/doctor.mjs`: kiểm tra máy trước giờ thi.
   - `scripts/nop-bai.mjs`: một lệnh lúc chốt bài gồm mã commit và giờ chốt, quét key, kiểm README, chụp minh chứng dọc 390/360 kèm 1 ảnh máy tính, nén source, in 4 mục nộp bài.

Khi 3 agent xong, Claude ghép, đóng gói lại `xclipse-skills-final.zip` và báo commit mới. Gemini nạp lại bản đó.

## 5. Vai trò của Gemini hôm thi
- **Nhận mega prompt từ Claude** (theo mẫu `prompts/16`) ngay sau T+5. Làm đúng phần được giao, trên nhánh `ag/<việc>`, chỉ sửa file trong bảng chia việc.
- **Bám hợp đồng dữ liệu** (`docs/spec-nhanh.md` mục 0): tên trường, tên hàm, kiểu trả về. Không tự đặt tên mới.
- **Trả kết quả:** đẩy lên nhánh `ag/<việc>`, kèm báo cáo ngắn gồm đã xong · chưa test · lệnh chạy thử · file đã sửa.
- **Không làm các việc này:** chụp ảnh app, dựng slide, đẩy thẳng lên `nop-bai`, sửa `index.html` hay các file không được giao.

## 6. Việc Gemini làm ngay hôm nay (không đụng file ở mục 4)
1. **Dò lại `references/12-khung-kinh-doanh-cho-de.md`:** đối chiếu từng trích dẫn (file + mục) và từng con số với 10 file trong `references/kien-thuc/`. Sửa qua nhánh `ag/kien-thuc-review`, chỉ được sửa `references/12` và `templates/HOI-DAP.md` mục G.
2. **Sau khi Claude báo xong, đọc `prompts/16`** để nắm cách nhận việc hôm thi. Nếu muốn mẫu giao việc nào rõ hơn, góp ý qua nhánh `ag/prompt16-review`.
3. **Thử Firebase thật** theo `skills/firebase-setup`, chỉ khi đội quyết định dùng.

## 7. Quy tắc giữ nguyên
- Không ghi key vào file, commit hay chat. Trước khi đẩy code chạy `node skills/vibe-sprint/scripts/scan-secrets.mjs skills`.
- Không bật trả phí. Không dùng cổng 8000 (dùng 8211–8236).
- Repo thi chỉ chứa khung chung, không làm sẵn tính năng đoán theo đề.
- Cái gì chưa test thì ghi rõ "chưa test". Không bịa số liệu: thiếu nguồn thì ghi "giả định cần nêu nguồn".
