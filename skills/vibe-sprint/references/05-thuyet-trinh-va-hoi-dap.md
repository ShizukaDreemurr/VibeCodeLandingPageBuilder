# 05 — Thuyết trình, demo trực tiếp và hỏi đáp

Pitch chung kết **10 phút** (xác nhận lại với BTC ngay khi bốc đề; thời lượng khác thì co giãn theo tỉ lệ ở run-sheet) + hỏi đáp. Đội 3 người, **vai cố định**:

| Người | Vị trí | Thời lượng | Slide | Phần việc |
|---|---|---|---|---|
| Diệu Anh | Đầu | ~2:30–3:00 | 1–3 | bài toán, nỗi đau, giới thiệu sơ bộ UI/UX |
| Vũ Trí Dũng | Giữa | ~3:30–4:00 | 4–7 | tính năng chính + demo thao tác |
| Nguyên (trưởng nhóm) | Cuối | ~3:00–3:30 + Q&A | 8–11 | kỹ thuật (kiến trúc, AI/proxy, kiểm thử, bảo mật), tổng kết, phản biện |

Nguyên là **neo dự phòng**: nếu hai bạn trước lố giờ, Nguyên rút gọn phần kỹ thuật bằng bản 3:30 / 2:00 / 1:00 (xem `templates/KICH-BAN-DEMO.md` mục 3).

Tài liệu đi kèm: `templates/KICH-BAN-DEMO.md` (run-sheet nguồn sự thật), `templates/CUE-CARDS.md` (thẻ in tay), `templates/HOI-DAP.md` (câu hỏi gắn người trả lời), `prompts/12-claude-design-slide.md` (slide), `deck/` (khung slide).

## Vì sao không học thuộc kịch bản dài

Rehearsal thực tế: một bạn run, vấp khi lạc khỏi bản thuộc, và chậm phản ứng khi đổi slide, nên cả đội lố giờ. Kịch bản thuộc lòng đổ vỡ ngay khi quên một câu. Thay bằng:

1. **Chỉ thuộc 3 thứ**: câu mở của mình, câu chuyền mic, và 3 neo của mỗi slide.
2. **Nói theo neo**, mỗi lần nói lại một cách khác cũng được, miễn đủ ý.
3. **Giờ do slide quyết định**, không do lời nói quyết định (mốc cứng bên dưới).

## Cue Card: 3 neo mỗi slide

Mỗi slide đúng 3 neo, mỗi neo ≤ 15 giây (slide ≈ 45 giây):

| Ký hiệu | Neo | Ví dụ (điền theo app) |
|---|---|---|
| **V** | 1 câu vấn đề (vì sao slide này tồn tại) | "Chủ quán mất 40 phút mỗi tối để tính lãi lỗ." |
| **T** | 1 thao tác hoặc điểm nhấn (chỉ vào đâu, bấm gì) | "Bấm Nhập doanh thu, chỉ ô báo lỗi đỏ." |
| **S** | 1 con số chứng minh, **đã in to trên slide** | "40 phút xuống còn 3 phút." |

Quy tắc viết neo: mỗi neo ≤ 12 từ, là cụm từ không phải câu văn; con số `S` phải có thật trong repo (`BANG-KIEM-THU.md`, đo thời gian thật). Thẻ in sẵn ở `templates/CUE-CARDS.md`; thẻ sinh từ run-sheet, sửa run-sheet trước.

## Mốc giờ cứng theo slide

Run-sheet 11 slide: Diệu Anh 00:00–02:30 (slide 1–3), Dũng 02:30–06:15 (slide 4–7), Nguyên 06:15–09:45 (slide 8–11), đệm 15 giây cuối.

- Mỗi slide có **mốc cứng**; thường ≤ 45 giây, tối đa 60 giây cho slide bài toán/giải pháp/kỹ thuật. Slide demo chia theo thao tác, mỗi thao tác ≤ 25 giây.
- **Lố mốc cứng là chuyển ngay**, kể cả đang nói dở: nói câu chuyền slide rồi bấm. Ưu tiên giữ neo `S` (con số), bỏ lời giải thích.
- Người giữ đồng hồ: Nguyên (đồng hồ phím `N` trong `deck.html`, hoặc đồng hồ tay). Điểm kiểm 02:30 và 06:15.
- Trễ ở điểm kiểm: Diệu Anh trễ > 20 giây thì Dũng gộp slide 5 vào slide 4; vào phần Nguyên trễ thì chọn bản rút gọn theo bảng của run-sheet (≤ 06:30 đủ 3:30 · ≤ 07:45 rút gọn 2:00 · sau đó 1:00).

## Câu chuyền mic (cố định 1 câu, điền chỗ trống)

Chuyền mic là điểm dễ đứng hình nhất, nên **đúng một câu, thuộc lòng, không ứng biến**:

| Từ → Đến | Mẫu câu (điền `{...}`) |
|---|---|
| Diệu Anh → Dũng | "Em xin gửi **Dũng** đi vào {tính năng nổi bật} và làm thử ngay cho mọi người xem." |
| Dũng (slide 5 → demo) | "Giờ mình **bấm thật**." |
| Dũng → Nguyên | "Phần bên trong chạy thế nào, mình xin nhường **Nguyên**." |
| Nguyên → BGK | "Cảm ơn ban giám khảo, đội xin nhận câu hỏi." |

Người nhận mic **luôn bắt đầu bằng câu mở của mình** (1 câu thuộc lòng, ví dụ trong thẻ) rồi mới vào neo. Người vừa nói xong lùi 1 bước, đứng yên nhìn slide.

## Chống run (cho người dễ căng thẳng)

1. **Thở 4-4-4** trước khi nhận mic: hít 4 giây, giữ 4 giây, thở ra 4 giây, lặp 2 vòng (làm được cả lúc đứng chờ).
2. **Chỉ 1 câu mở thuộc lòng.** Mọi thứ sau đó là nói theo neo.
3. **Nhìn neo trên slide**, không nhìn giấy dài, không nhìn đồng đội. Slide có số to chính là cue.
4. **Nếu quên: đọc con số trên slide rồi nói vì sao nó quan trọng** ("con số 3 phút này cho thấy người dùng không phải học gì thêm"). Không xin lỗi, không im lặng quá 3 giây.
5. Nói chậm hơn bình thường 10%, dừng nửa nhịp sau mỗi con số.
6. Sai một chữ thì bỏ qua, đi tiếp. Khán giả không biết kịch bản của bạn.
7. Tập "lạc khỏi kịch bản": mỗi buổi tập, 1 người bị yêu cầu bỏ một câu bất kỳ, cả đội vẫn giữ đúng mốc giờ.

## Bấm chuyển slide (clicker)

- **Người nói tự bấm slide của mình**, bấm ngay khi nói xong câu cuối của neo `S`. Một người một clicker; chuyền clicker cùng lúc với mic.
- Nếu không có clicker thứ hai: **Nguyên bấm theo hiệu tay** của người nói (người nói giơ 1 ngón tay = "bấm tới", 2 ngón = "lùi"). Hiệu tay thống nhất trước khi vào phòng.
- Slide đổi, **nói ngay câu đầu của neo `V`** mới (đừng chờ). Tập đúng thao tác "bấm → nhìn slide → nói neo V" 10 lần liền.
- Mở sẵn `deck.html` toàn màn hình (`F`), kiểm tra phím `←/→` chạy, đã mở PDF dự phòng ở cửa sổ khác.
- Bấm nhầm: không giải thích, bấm lại, nói neo của slide hiện tại.

## Demo lỗi: phương án dự phòng (chuẩn bị trước T+52)

- **Video quay màn hình 30 giây** (luồng chính) lưu máy + USB/điện thoại, mở sẵn ở tab riêng, mở được offline.
- **Ảnh chụp** các tính năng trong slide phụ ("Dự phòng") nếu cả hai đều hỏng; chụp từ app thật bằng `deck/tools/capture.cjs`.
- **Bản local:** `python3 -m http.server 8211` trong thư mục app (mở `http://localhost:8211/?demo=1`) hoặc `file://` nếu app không cần server.
- Quy tắc: demo hỏng **> 10 giây thì chuyển ngay** sang video/ảnh, **không sửa trên sân khấu**. Câu nói bình tĩnh: "Mạng đang chậm, em chuyển sang bản quay sẵn của đúng bản này."
- Dữ liệu demo đặt lại bằng "Nạp lại dữ liệu demo" ở Cài đặt (hoặc `?demo=1`) trước khi vào phòng.
- Luồng demo (slide 6–7): thao tác mỗi cái ≤ 25 giây; luôn có 1 ca nhập sai và 1 ca biên; xem bảng chi tiết ở `KICH-BAN-DEMO.md` mục 4. Nhãn mô phỏng AI chép **nguyên văn** theo đề/BTC (`{{MOCK_NOTICE}}`).

## Luật slide

Một ý mỗi slide, chữ ≥ 28pt (trên 1920×1080 chữ nội dung ≥ 22px), mỗi slide có **1 con số lớn hoặc 1 ảnh chụp app thật** làm điểm tựa thị giác, ghi chú người nói nằm trong notes (không đặt tên người nói lên slide), tiếng Việt có dấu, không đọc nguyên slide. Dựng bằng `deck/` (điền `deck/deck.data.js`; `notes` có người nói + mốc giờ + 3 neo) hoặc `prompts/12-claude-design-slide.md`.

## Hỏi đáp: ai trả lời câu gì

Chuẩn bị mỗi câu: **1 câu trả lời ngắn trước (≤ 10 giây)**, rồi mới bằng chứng và giới hạn (tổng 20–30 giây). `templates/HOI-DAP.md` gắn sẵn người trả lời cho từng câu.

| Loại câu hỏi | Người trả lời | Ví dụ |
|---|---|---|
| Người dùng, bối cảnh, nỗi đau, UI/UX | **Diệu Anh** | Ai dùng? Bắt đầu từ đâu? Vì sao giao diện này? |
| Tính năng, nghiệp vụ, thao tác, xử lý ca sai/biên | **Dũng** | Trùng/hết chỗ/hết hạn xử lý sao? Khác gì làm thủ công? |
| Kỹ thuật, AI/proxy, kiểm thử, bảo mật, dữ liệu, mở rộng | **Nguyên** | Key lưu ở đâu? AI thật hay mô phỏng? Test bao nhiêu ca? |
| Câu không rõ của ai, câu "vì sao đội chọn…", câu bẫy, câu ngoài phạm vi | **Nguyên** | Nguyên là **lưới bắt** mọi câu còn lại |

Luật phối hợp:
- Ai được hỏi trực tiếp thì tự trả lời; không rõ thì nhìn Nguyên, Nguyên chỉ định hoặc nhận luôn.
- Trả lời xong 20–30 giây là dừng; ai có bổ sung thì nói "em bổ sung một ý" (tối đa 1 người bổ sung).
- Không hiểu câu hỏi: nhắc lại bằng lời mình ("Em hiểu câu hỏi là … đúng không ạ?") để câu giờ và xác nhận.
- Nhận giới hạn trước khi bị hỏi; chỉ nói điều đã chạy thật; "chưa làm, sẽ làm như sau…" tốt hơn nói quá. Không nói "AI làm hết".

Các nhóm câu thường gặp (đầy đủ ở `HOI-DAP.md`): cách dùng; nghiệp vụ; dữ liệu thật hay mô phỏng; vòng cải thiện bằng AI (prompt đầu, lỗi, sửa, ví dụ trước/sau thật); giới hạn và mở rộng; bảng A: vì sao vanilla, tách module, số ca test, bảo mật key.

## Việc cần có trước khi vào phòng

- [ ] Link online mở được trên điện thoại (QR trên slide cuối).
- [ ] Video dự phòng 30 giây + bản local chạy; ảnh dự phòng trong slide phụ.
- [ ] In `CUE-CARDS.md` (3 thẻ, mỗi người một thẻ), kiểm tra mốc giờ khớp run-sheet.
- [ ] Mỗi người thuộc: câu mở, câu chuyền, và con số `S` của slide mình; Nguyên thuộc cả ba bản 3:30 / 2:00 / 1:00.
- [ ] Thống nhất hiệu tay (bấm tới / lùi / cắt) và ai giữ clicker.
- [ ] Tập đủ 2 lần có đồng hồ, trong đó 1 lần cố ý trễ 40 giây để Nguyên tập chọn bản rút gọn.
