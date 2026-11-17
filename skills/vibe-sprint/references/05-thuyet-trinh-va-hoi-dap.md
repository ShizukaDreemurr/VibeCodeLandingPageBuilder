# 05 — Thuyết trình, demo trực tiếp và hỏi đáp

> Thể lệ chung kết: thuyết trình + Q&A diễn ra 14:45–15:45; **thời lượng mỗi đội BTC báo sau, giống nhau cho mọi đội**. **Vòng 1 không có Q&A**; Q&A chỉ ở **vòng phản biện** với đội được chọn, và **Bảng Kinh tế phải trình bày thêm giả định và cách tính nghiệp vụ**. Vì vậy có **ba bản: 10 phút (11 slide), 5 phút (7 slide), 3 phút (5 slide)**, chọn ngay khi BTC báo (`templates/KICH-BAN-DEMO.md` mục 1, 6.1, 6.2). **Bảng Kinh tế: slide/đoạn "Giả định & cách tính" bắt buộc trong cả ba bản** (khung 50 giây ở mục 6.3 của run-sheet: số giả định + nguồn, 3 kịch bản, hòa vốn, ưu đãi có lỗ không, giả định yếu nhất).

| Bản | Slide | Diệu Anh | Dũng | Nguyên | Slide Giả định |
|---|---|---|---|---|---|
| 10 phút | 12 | 1–3 (00:00–02:30) | 4–8 (02:30–06:15; slide 4 = video, phát ≈ 45 giây) | 9–12 (06:15–09:45) | slide 11 |
| 5 phút | 8 | 1–2 (00:00–01:10) | 3–5 (01:10–02:50; slide 3 = video, phát ≈ 30 giây) | 6–8 (02:50–04:45) | slide 6 |
| 3 phút | 6 | 1 (00:00–00:35) | 2–4 (00:35–01:40; slide 2 = video, phát ≈ 30 giây) | 5–6 (01:40–02:45) | slide 5 |

Phần còn lại của tài liệu này mô tả **bản 10 phút** (co giãn theo tỉ lệ cho bản 5 và 3 phút) + hỏi đáp. Đội 3 người, **vai cố định**:

| Người | Vị trí | Thời lượng | Slide | Phần việc |
|---|---|---|---|---|
| Diệu Anh | Đầu | ~2:30–3:00 | 1–3 | bài toán, nỗi đau, giới thiệu sơ bộ UI/UX |
| Vũ Trí Dũng | Giữa | ~3:30–4:00 | 4–7 | tính năng chính + demo thao tác |
| Nguyên (trưởng nhóm) | Cuối | ~3:00–3:30 + Q&A (nếu vào vòng phản biện) | 8–11 | kỹ thuật (kiến trúc, AI/proxy, kiểm thử, bảo mật), **giả định & cách tính (Kinh tế)**, tổng kết, phản biện |

Nguyên là **neo dự phòng**: nếu hai bạn trước lố giờ, Nguyên rút gọn phần kỹ thuật bằng bản 3:30 / 2:00 / 1:00 (xem `templates/KICH-BAN-DEMO.md` mục 3).

Tài liệu đi kèm: `templates/KICH-BAN-DEMO.md` (run-sheet nguồn sự thật), `templates/CUE-CARDS.md` (thẻ in tay), `templates/HOI-DAP.md` (câu hỏi gắn người trả lời), `prompts/14-claude-design-khung-slide.md` (slide), `references/14-quy-trinh-slide-song-song.md` (quy trình), `deck/` (khung slide).

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

Run-sheet 12 slide: Diệu Anh 00:00–02:30 (slide 1–3), Dũng 02:30–06:15 (slide 4–8, mở bằng **slide video**), Nguyên 06:15–09:45 (slide 9–12), đệm 15 giây cuối.

- Mỗi slide có **mốc cứng**; thường ≤ 45 giây, tối đa 60 giây cho slide bài toán/giải pháp/kỹ thuật. Slide demo chia theo thao tác, mỗi thao tác ≤ 25 giây.
- **Lố mốc cứng là chuyển ngay**, kể cả đang nói dở: nói câu chuyền slide rồi bấm. Ưu tiên giữ neo `S` (con số), bỏ lời giải thích.
- Người giữ đồng hồ: Nguyên (đồng hồ phím `N` trong `deck.html`, hoặc đồng hồ tay). Điểm kiểm 02:30 và 06:15.
- Trễ ở điểm kiểm: Diệu Anh trễ > 20 giây thì Dũng gộp slide 5 vào slide 4; vào phần Nguyên trễ thì chọn bản rút gọn theo bảng của run-sheet (≤ 06:30 đủ 3:30 · ≤ 07:45 rút gọn 2:00 · sau đó 1:00).

## Câu chuyền mic (cố định 1 câu, điền chỗ trống)

Chuyền mic là điểm dễ đứng hình nhất, nên **đúng một câu, thuộc lòng, không ứng biến**:

| Từ → Đến | Mẫu câu (điền `{...}`) |
|---|---|
| Diệu Anh → Dũng | "Em xin gửi **Dũng** đi vào {tính năng nổi bật} và làm thử ngay cho mọi người xem." |
| Dũng (slide 5 → demo) | "Giờ mình xem **bản chạy thật**." |
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

## Chuyển slide bằng lời (kỹ thuật viên của BTC bấm)

**Thành viên không tự bấm slide.** File slide (PDF + PPTX) giao cho bộ phận kỹ thuật của BTC; kỹ thuật viên đổi slide khi **nghe câu hiệu lệnh**. Quy tắc:

- **Mỗi slide có dòng "Cue kỹ thuật"** (dòng 4 của ghi chú người nói, in lại trong `templates/CUE-CARDS.md`). Câu chuẩn: **"Mời chuyển slide."** · lùi: **"Mời lùi một slide."** · nhảy: **"Mời chuyển đến slide N."** · video: **"Mời phát video demo."** / **"Mời quay lại slide."** · bản chạy thật: **"Mời mở bản chạy thật."**
- **Nói cue ngay sau con số `S`**, to và rõ, rồi **dừng 1 giây** chờ slide đổi; sau đó mới nói neo `V` của slide mới (đừng chờ lâu hơn 2 giây; slide chưa đổi thì nhắc lại: "Mời chuyển slide, xin cảm ơn.").
- **Slide cuối của mỗi người:** nói **câu chuyền mic trước, cue sau**, để slide của người kế đã sẵn khi họ mở lời.
- Cue là **câu cố định, không đổi theo hứng**; kỹ thuật viên không đoán ý. Bị trễ mốc cứng: nói thẳng cue, bỏ lời giải thích.
- Nguyên đứng gần kỹ thuật viên (hoặc ra hiệu tay) để nhắc khi cần; **họp 2 phút với kỹ thuật viên trước khi vào phòng** và tập 3 lần "Mời chuyển slide." bằng mic thật. Tờ hiệu lệnh để giao: `templates/THE-DIEU-PHOI.md` mục 2.
- Tập "nói neo → nói cue → dừng 1 giây → neo V mới" 10 lần liền khi luyện (Nguyên đóng vai kỹ thuật viên).
- Nói nhầm cue: không giải thích, nói lại đúng cue. Slide hiện sai: "Mời lùi một slide." hoặc "Mời chuyển đến slide N."
- Mở sẵn PDF dự phòng trên máy kỹ thuật viên; đã kiểm slide cuối có QR.

## Demo (không ai trong đội cầm điện thoại)

Chung kết chấm app ở 360–390px, nên slide và demo đều dùng **điện thoại dọc**, không dùng ảnh ngang/desktop làm hình đại diện. **Demo do kỹ thuật viên chiếu**, theo thứ tự ưu tiên:

1. **Video demo dọc** (không tiếng; **dựng tự động bằng `tools/demo-video.cjs`, prompts/17**, hoặc quay từ DevTools 390×844; cùng một file ≤ 2:00 **nhúng sẵn trong slide 4** (phát ≈ 45 giây rồi "Mời dừng video.") và là dự phòng toàn màn hình): cue **"Mời phát video demo."**; người nói thuyết minh đúng nhịp, mỗi thao tác ≤ 25 giây; kết thúc **"Mời quay lại slide."**
2. **Ảnh điện thoại dọc đánh số trong slide 5–7** (luồng 3 bước, ca sai/biên, giao diện tối): kỹ thuật viên không thao tác, người nói đi theo ghim số.
3. **Bản chạy thật qua link** ("Mời mở bản chạy thật."): chỉ khi BTC cho kỹ thuật viên thao tác theo lời ("Mời bấm Điền dữ liệu mẫu"); rủi ro cao hơn, luôn có 1–2 đứng sau. QR + link luôn có trên slide để giám khảo tự mở.

- **Slide:** mọi ảnh app là ảnh điện thoại dọc 9:19,5 (390×844@3x = 1170×2532) trong khung điện thoại (loại `phone`, `phones-2`, `phones-3`, `phone-steps`; tối đa 3 điện thoại mỗi slide). Ảnh do **Claude Sonnet trong Chrome** (khung điện thoại, sáng + tối, thêm bộ 360×780) hoặc agent Claude Code (`starter/tools/shots-mobile.cjs`, `deck/tools/capture.cjs`) chụp; không chụp tay. Chi tiết: `prompts/15-sonnet-chrome-chup-anh.md`.
- **Ai làm gì:** Diệu Anh và Dũng chỉ nói; Nguyên điều phối, giữ đồng hồ, đứng gần kỹ thuật viên. Không ai cầm điện thoại hay clicker.
- **Thứ tự demo theo thanh tab dưới:** trái sang phải, mỗi tab 1 thao tác ≤ 25 giây; ca sai/biên sau cùng; kết bằng giao diện Tối.

## Demo lỗi: phương án dự phòng (chuẩn bị trước T+52)

- **Video quay màn hình theo chiều DỌC, ≤ 2:00** (luồng chính), giao cho kỹ thuật viên cùng PDF/PPTX, mở được offline.
- **Ảnh chụp dọc** (390×844@3x) các tính năng trong slide phụ ("Dự phòng") nếu cả hai đều hỏng; agent Sonnet chụp từ app thật bằng `deck/tools/capture.cjs` hoặc `starter/tools/shots-mobile.cjs`.
- **Bản local:** `python3 -m http.server 8211` trong thư mục app (mở `http://localhost:8211/?demo=1`) hoặc `file://` nếu app không cần server.
- Quy tắc: demo hỏng **> 10 giây thì chuyển ngay** sang video/ảnh, **không sửa trên sân khấu**. Câu nói bình tĩnh: "Mạng đang chậm, mời phát video demo." (nói đúng cue)
- Dữ liệu demo đặt lại bằng "Nạp lại dữ liệu demo" ở Cài đặt (hoặc `?demo=1`) trước khi vào phòng.
- Luồng demo (slide 6–7): thao tác mỗi cái ≤ 25 giây; luôn có 1 ca nhập sai và 1 ca biên; xem bảng chi tiết ở `KICH-BAN-DEMO.md` mục 4. Nhãn mô phỏng AI chép **nguyên văn** theo đề/BTC (`{{MOCK_NOTICE}}`).

## Viết slide (luật nội dung, áp cho cả Claude Design và `deck/`)

**1. Tiêu đề và phụ đề là TÊN GỌI, không phải tuyên bố.** Đặt tên cho nội dung của slide ("Bối cảnh các SME hiện nay"), không viết câu cảm xúc hay khẳng định ("Nỗi đau của các SME hiện nay: tay ngang"). Phụ đề xác định phạm vi ("Chân dung người dùng và cách họ làm việc hiện nay"). Cụm danh từ, ≤ 8 từ, không dấu chấm than. Không từ khoa trương: đột phá, cách mạng, siêu, tuyệt đối, hoàn hảo, số 1, tốt nhất, vượt trội, bùng nổ, thay đổi cuộc chơi, "wow", "100%" (trừ kết quả đã đo). Lý lẽ và cảm xúc để cho gạch đầu dòng và lời nói. 15 cặp trước/sau nằm ở `prompts/14` mục 3.1.

**2. Mật độ: vừa đủ để làm prompt nhắc.** Mỗi slide nội dung **3–5 gạch đầu dòng, mỗi gạch ≤ 14 từ, cộng 1 con số chính** (số + đơn vị + nhãn nguồn: `Dữ liệu mẫu (BTC)` / `Giả định` / `Mô phỏng`). Đủ để người đang run liếc vào là nhớ thứ tự ý; không đủ để đọc thay. Gạch là cụm có thông tin cụ thể (ai · làm gì · bao nhiêu · nguồn), chữ đời thường.

**3. Chiều sâu theo phần của từng người (chữ đơn giản, hiểu biết thật):**
- **Diệu Anh:** *ai* (vai trò, quy mô, thiết bị) · *làm gì hằng ngày* (tần suất, công cụ hiện dùng) · *cái giá hiện nay* (thời gian/tiền/sai sót, có nguồn) · *quyết định giao diện = ràng buộc → xử lý* (một tay, 360–390px, vùng ngón cái, tab dưới, tương phản, Sáng/Tối, tiếng Việt có dấu). Không viết "giao diện đẹp, thân thiện".
- **Dũng:** mỗi tính năng **đầu vào → quy tắc → kết quả**, gắn với việc của người dùng; ít nhất 1 quy tắc nghiệp vụ có số cụ thể (ngưỡng, công thức, điều kiện từ chối); ca nhập sai và ca biên xử lý ra sao; demo đi theo ảnh có ghim số.
- **Nguyên:** kiến trúc 4 khối (giao diện → logic tính → AI qua proxy/mô phỏng → lưu trữ), rõ cái gì thật/mô phỏng, khóa API ở đâu; giả định có **giá trị + nguồn + nhãn**; 3 kịch bản; hòa vốn kèm công thức chữ; điều kiện ưu đãi lỗ; 1 giới hạn nói thẳng; tổng kết chỉ lặp lại kết quả đã đo.

**4. Một điểm tựa thị giác mỗi slide:** 1 con số lớn (≥ 120px) hoặc ảnh điện thoại dọc (≤ 3 máy; số S hiện dạng "số nhấn" cạnh ảnh); chữ nội dung ≥ 24px trên 1920×1080; ghi chú người nói **5 dòng** (Người nói · Mốc giờ · 3 neo V·T·S · **Cue kỹ thuật** · Chuyền mic); không đặt tên người nói lên slide; tiếng Việt có dấu; không đọc nguyên slide. Dựng bằng **Claude Design theo `prompts/14`** (khung ở T+10, ảnh ở T+50, quy trình `references/14-quy-trinh-slide-song-song.md`) hoặc `deck/` (dự phòng).

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

Bảng Kinh tế: mục F của `HOI-DAP.md` có 10 câu về giả định, hòa vốn, ưu đãi, dự phòng, độ nhạy; Nguyên trả lời phần lớn, Dũng trả lời hòa vốn và ưu đãi.

Các nhóm câu thường gặp (đầy đủ ở `HOI-DAP.md`): cách dùng; nghiệp vụ; dữ liệu thật hay mô phỏng; vòng cải thiện bằng AI (prompt đầu, lỗi, sửa, ví dụ trước/sau thật); giới hạn và mở rộng; bảng A: vì sao vanilla, tách module, số ca test, bảo mật key.

## Việc cần có trước khi vào phòng

- [ ] Link online mở được trên điện thoại (QR trên slide cuối).
- [ ] PDF + PPTX + video dọc đã giao kỹ thuật viên; đã họp 2 phút tập cue "Mời chuyển slide."
- [ ] Video dọc ≤ 2:00 + bản local chạy; ảnh dự phòng trong slide phụ P2–P3.
- [ ] In `CUE-CARDS.md` (3 thẻ, mỗi người một thẻ), kiểm tra mốc giờ khớp run-sheet.
- [ ] Mỗi người thuộc: câu mở, câu chuyền, và con số `S` của slide mình; Nguyên thuộc cả ba bản 3:30 / 2:00 / 1:00 và khung "Giả định & cách tính".
- [ ] Đã tập đủ cả ba bản pitch (10 / 5 / 3 phút) ít nhất 1 lần; biết cách chọn bản trong 10 giây khi BTC báo thời lượng.
- [ ] Thống nhất câu hiệu lệnh (chuyển / lùi / nhảy / video) và hiệu tay nhắc kỹ thuật viên; không ai giữ clicker.
- [ ] Tập đủ 2 lần có đồng hồ, trong đó 1 lần cố ý trễ 40 giây để Nguyên tập chọn bản rút gọn.
