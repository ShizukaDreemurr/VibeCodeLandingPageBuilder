# 14. Quy trình slide song song với việc xây app (60 phút)

Vì sao có tài liệu này: **thành viên không tự bấm slide** (bộ phận kỹ thuật của BTC bấm theo hiệu lệnh bằng lời) và **slide cần có sớm** để Diệu Anh và Dũng tập nói. Nếu đợi app xong rồi mới làm slide, họ chỉ có vài phút tập. Vì vậy slide được làm **hai pha**: khung (chữ + bố cục + ô ảnh đặt tên sẵn) ở **T+10**, ảnh ở **T+45→50**.

Tài liệu đi cùng: `prompts/14-claude-design-khung-slide.md` (khung + chèn ảnh) · `prompts/15-sonnet-chrome-chup-anh.md` (chụp ảnh, ZIP) · `prompts/16-gemini-antigravity-giao-viec.md` (Gemini song song) · `templates/THE-DIEU-PHOI.md` (thẻ 1 trang cho Nguyên) · `references/05` (cách nói, tiêu đề, cue) · `templates/KICH-BAN-DEMO.md`, `templates/CUE-CARDS.md`.

## 1. Bốn luồng chạy song song

| Luồng | Ai/Gì | Từ | Đầu ra |
|---|---|---|---|
| **A. App** | Claude Code điều phối + nhiều agent Sonnet/Haiku (`prompts/02…13`) | T+5 | app chạy được, đã merge (T+40→48) |
| **B. Gemini** | Gemini Antigravity trên nhánh `ag/<x>` (`prompts/16`) | T+10 | tính năng riêng / dữ liệu / tài liệu / rà soát giả định đẩy lên `ag/<x>` |
| **C. Slide** | Claude Design (khung T+10; chèn ảnh T+50) + Sonnet trong Chrome (chụp T+45) | T+10 | PDF + PPTX + PNG từng slide (T+55) |
| **D. Luyện nói** | Diệu Anh, Dũng (Nguyên làm "kỹ thuật viên" khi tập) | T+20 | nói đúng giờ, đúng cue, thuộc 3 neo |

## 2. Dòng thời gian từ T+0 đến T+60 (và sau đó)

| Mốc | Việc | Ai | Dùng | Kiểm / cổng |
|---|---|---|---|---|
| **T+0** | Đọc đề + thể lệ phát tại chỗ; mở file dữ liệu BTC. **Nguyên đọc đề to cho cả đội.** Claude Code chạy `prompts/01` (spec) + 1 agent research (Haiku). Cùng lúc **DA** viết 5 dòng thô: ai dùng, làm gì hằng ngày, đang tốn gì (kèm nguồn), 3 ràng buộc giao diện điện thoại; **Dũng** viết 5 tính năng thô + 1 quy tắc nghiệp vụ + 1 ca sai + 1 ca biên (dán vào `docs/spec-nhanh.md` mục Người dùng/Demo, hoặc nhắn thẳng cho Nguyên) | Nguyên, DA, Dũng, Claude | `prompts/01` | — |
| **T+3→5** | Soạn **bản nháp prompt 16** (Gemini) từ mẫu: đề, phạm vi, bảng sở hữu file; chọn **2–4 việc** tách rời giao cho Gemini (mục 5 của `prompts/16`) | Nguyên + Claude | `prompts/16` | — |
| **T+5** | **Cổng bắt buộc:** `docs/spec-nhanh.md` (5 tính năng + tiêu chí) + **Schema Contract** + **danh sách Giả định** có nguồn. Chưa có thì **chưa gửi prompt nào** | Nguyên + Claude | `prompts/00` | cổng spec |
| **T+5→8** | Chọn starter + UI tokens; kiểm 3 màn 2 phút (SKILL.md) | Claude | `prompts/03` | cổng UI |
| **T+8→10** | **Điền biến prompt 14** (mục "Biến cần điền": persona, tính năng, giả định, nhãn mô phỏng; số chưa có = `[SỐ: …]`) và **điền prompt 16** (dán Schema Contract) | Nguyên | 14, 16 | 3 phút |
| **T+10** | **Gửi đồng thời:** (1) prompt 14 Phần 1 → **Claude Design** (dự án `<APP> · Slide chung kết`, đính kèm `sprite.svg` + 2 logo); (2) prompt 16 MASTER + TASK → **Gemini Antigravity** (mỗi việc một cuộc trò chuyện, nhánh `ag/<x>`, cổng 8240+); (3) spawn đợt 1 agent Claude (02–08, 13) | Nguyên + Claude | 14, 16, 02–13 | ghi giờ gửi vào `docs/PROGRESS.md` |
| **T+15→20** | **Nhận khung slide.** Nguyên kiểm 2 phút bằng mắt (bảng kiểm Phần 1 mục 9: tiêu đề đặt tên, ô `[ẢNH: …]`, ghi chú 5 dòng, không từ cấm), sửa chữ bằng 1–2 tin nhắn gộp cho Claude Design. **Xuất PDF khung** gửi DA, Dũng | Nguyên | 14 | đủ 11 slide + P1–P3 |
| **T+20→40** | **Luyện nói trên khung** (mục 4). Gemini: T+20 commit đầu, T+30 chạy trọn luồng; Claude: T+25 merge đợt 1 | DA, Dũng (luyện), Claude + Gemini (xây) | 05, KICH-BAN-DEMO | 3 vòng tập |
| **T+35** | **Một lần duy nhất** gom chỉnh sửa lời/tiêu đề từ buổi tập → gửi Claude Design một tin (đừng gửi từng chỉnh sửa lẻ) | Nguyên | 14 | khung v2 |
| **T+40→44** | Merge hết (data → AI → shell → feature → polish), test xanh. **T+44: KHÓA GIAO DIỆN** (UI freeze): sau đó polish chỉ sửa lỗi, không đổi bố cục/nhãn/thứ tự tab, để ảnh chụp không lỗi thời | Claude + Nguyên | 09 | test xanh, quét secret sạch |
| **T+45** | **Gửi prompt 15** cho **Claude Sonnet trong Chrome** (link: Pages nếu đã lên, **hoặc `http://localhost:8211/` trên máy Nguyên**; ghi hash commit). **Song song:** spawn 1 agent Sonnet chạy dự phòng `shots-mobile.cjs`/`capture.cjs` (mục 6) **và nhóm 10 agent Video demo song song** (`prompts/17`, `node tools/demo-video.cjs`, cổng 8232–8237; xong T+52): **một video** `demo-<app>.mp4` ≤ 2:00 (minh chứng + dự phòng) + bản sao `00-demo-video.mp4` và `00-demo-video-poster.png` (cho slide video) | Nguyên + Claude | 15 | hai ZIP, dùng cái đạt trước |
| **T+48** | Bump version, push, deploy Pages (SKILL.md); mở link ẩn danh | Claude | 09 | link chạy |
| **T+50** | **Nhận ZIP** (kiểm `manifest.txt`, 5 ảnh ngẫu nhiên, đủ ảnh 390/360/desktop, đúng sáng/tối). Tải ZIP vào **cùng dự án Claude Design**, gửi **Phần 2** (chèn ảnh + cập nhật số). Song song: **Dũng đọc to số thật** (số ca đạt, số giây phản hồi, hòa vốn) để Nguyên điền `{{DANH_SACH_SO_CAP_NHAT}}` | Nguyên, Dũng | 14 (P2) | báo cáo thiếu ảnh = rỗng |
| **T+50→55** | **Minh chứng thời điểm chốt** (ảnh 360/390 sáng-tối + 1 desktop + hash commit; `docs/minh-chung/`, tạo bằng `node scripts/nop-bai.mjs --url <link>`); **kiểm video demo** do agent dựng (xem contact sheet, 3 khung hình; mục 3.3); video + ảnh bìa chèn vào **slide video** (đặt ngay trước slide tính năng) cùng đợt chèn ảnh. Claude Design trả deck có ảnh | Claude (QA), DA (video) | 06, SKILL.md | không commit thêm sau khi chụp |
| **T+55** | **Xuất PDF + PPTX + PNG từng slide** (slide video: PDF/PNG hiện ảnh bìa + nút play, PPTX nhúng mp4) → kiểm 3 phút (đối chiếu số với `BANG-KIEM-THU.md`) → **gửi bộ phận kỹ thuật** kèm "Bảng hiệu lệnh" (`templates/THE-DIEU-PHOI.md`) và video; **nộp 4 món** (link · mã nguồn · README · minh chứng) | Nguyên + Claude | 14, THE-DIEU-PHOI | link ẩn danh mở được |
| **T+60 → giờ thuyết trình** | BTC báo **thời lượng** → chọn bản 11/7/5 (nếu cần: nhắn Claude Design dựng bản 7 hoặc 5 theo `prompts/14` mục 7B/7C và gửi lại PDF/PPTX; hoặc dùng cue "Mời chuyển đến slide N"). Luyện lại 2 vòng có đồng hồ trên **deck thật**, có Nguyên đóng vai kỹ thuật viên | cả đội | 05, KICH-BAN-DEMO, HOI-DAP | — |

**Lưu ý đồng bộ:** ảnh slide chụp ở T+45 là bản **đã khóa giao diện**. Nếu sau đó polish lỡ đổi bố cục, chụp lại **chỉ các slot bị ảnh hưởng** (bảng slot, prompt 14 mục 6), đừng chụp lại tất cả. **Minh chứng chốt (T+50→55)** luôn là ảnh của bản đang chạy trên link với hash commit thật, không dùng lại ảnh slide.

## 3. Ai làm gì (vai người)

| Người | Luồng | Việc cụ thể |
|---|---|---|
| **Nguyên** (điều phối, trưởng nhóm) | A, B, C | đọc đề; duyệt spec + contract; điền và **gửi prompt 14, 16, 15**; kiểm khung và ZIP; giữ đồng hồ khi luyện (vai kỹ thuật viên); xuất PDF/PPTX; **nộp 4 món**; làm việc với kỹ thuật viên BTC |
| **Diệu Anh** | D (+ nội dung) | T+0 viết bối cảnh/người dùng/UI-UX thô; T+20 luyện slide 1–3 (bản 11); quay video demo dọc (T+50) |
| **Vũ Trí Dũng** | D (+ nội dung) | T+0 viết tính năng/nghiệp vụ/ca sai/biên thô; luyện slide 4–7; đọc số thật cho Nguyên (T+50) |
| **Claude Code** | A | điều phối, spawn, merge, test, deploy, minh chứng; sinh `docs/*`; chạy dự phòng chụp ảnh |
| **Gemini Antigravity** | B | các việc tách rời trong `prompts/16`, nhánh `ag/<x>` |
| **Claude Design** | C | khung slide (T+10) và chèn ảnh (T+50); xuất PDF/PPTX |
| **Claude Sonnet trong Chrome** | C | chụp ảnh điện thoại dọc + ZIP (T+45) |
| **Kỹ thuật viên BTC** | trình chiếu | nhận PDF/PPTX + video + bảng hiệu lệnh; đổi slide/phát video theo **lời** người nói |

### 3.1. Hiệu lệnh kỹ thuật viên (một bảng cho cả đội và kỹ thuật viên)

Người nói **nói to, rõ, ngay sau con số `S`** của slide, rồi **dừng 1 giây** cho slide đổi trước khi vào neo `V` của slide kế.

| Người nói nói | Kỹ thuật viên làm |
|---|---|
| **"Mời chuyển slide."** | sang slide kế |
| **"Mời lùi một slide."** | lùi 1 slide |
| **"Mời chuyển đến slide 10."** (chọn bản rút gọn) | nhảy tới slide số 10 |
| **"Mời phát video demo."** | bật video demo dọc (đang ở slide demo) |
| **"Mời quay lại slide."** | dừng video, trở lại slide |
| **"Mời mở bản chạy thật."** | mở link bản chạy thật (nếu BTC cho phép thao tác; xem 3.2) |
| **"Mời dừng ở đây."** | giữ nguyên màn hình hiện tại |

Quy tắc: (a) mọi cue nằm ở **dòng 4** của ghi chú người nói và in lại trên `CUE-CARDS.md`; (b) cue là **câu cố định**, không đổi tùy hứng, để kỹ thuật viên nghe quen; (c) slide cuối của mỗi người: nói **câu chuyền mic trước, "Mời chuyển slide" sau**; (d) kỹ thuật viên **không đoán**: không nghe cue thì giữ nguyên, người nói nhắc lại cue lần hai (câu "Mời chuyển slide, xin cảm ơn."); (e) **Nguyên đứng gần kỹ thuật viên hoặc ra hiệu tay** nếu cần nhắc; (f) buổi họp 2 phút với kỹ thuật viên trước giờ vào phòng: đọc bảng hiệu lệnh, tập 3 lần "Mời chuyển slide" với tiếng mic thật.

### 3.2. Demo khi không ai trong đội cầm điện thoại

Demo do **kỹ thuật viên chiếu** một trong ba thứ, theo thứ tự ưu tiên:

1. **Video demo dọc (≤ 2:00)** (không tiếng, quay từ DevTools 390×844 hoặc từ điện thoại ghi hình màn hình) — chiếu bằng cue "Mời phát video demo." Người nói **thuyết minh trực tiếp** đúng nhịp thao tác (mốc ≤ 25 giây mỗi thao tác).
2. **Ảnh điện thoại dọc ở slide 5–7** (các bước đã đánh số) — người nói đi theo ghim số; kỹ thuật viên không cần thao tác gì.
3. **Bản chạy thật** (`"Mời mở bản chạy thật."`): chỉ dùng nếu BTC cho phép kỹ thuật viên mở link và **làm từng thao tác theo lời** ("Mời bấm Điền dữ liệu mẫu"). Rủi ro cao (độ trễ, lỗi nghe), nên luôn có phương án 1–2 đứng sau.

Slide demo (6, 7) luôn có **QR + link** để giám khảo tự mở trên điện thoại của họ. Dự phòng cuối: ảnh trong slide phụ P2–P3.

### 3.3. Video demo dọc (T+45→55): dựng tự động, quay tay chỉ là dự phòng

**Cách chính:** agent Video demo chạy `prompts/17` (storyboard JSON → `node tools/demo-video.cjs` → mp4 dọc 1080×1920 có phụ đề tiếng Việt, chấm chạm, thẻ đầu/cuối). Ra **một video ≤ 2:00** (minh chứng thời điểm chốt, lưu `docs/minh-chung/`) và bản sao `00-demo-video.mp4` + `00-demo-video-poster.png` (nhúng vào slide video; người nói nói "Mời dừng video" để cắt sớm). **T+50:** kiểm contact sheet + 3 khung hình; T+55: giao kỹ thuật viên cùng PDF/PPTX làm dự phòng ("Mời phát video demo.").

**Dự phòng quay tay (nếu Playwright/ffmpeg hỏng):** 
Mở link trên Chrome, bật **DevTools → thanh thiết bị 390 × 844**, dữ liệu mẫu (`?demo=1`), zoom 100%. Quay màn hình **chỉ vùng khung điện thoại** (Windows: Win+G; macOS: ⇧⌘5 chọn vùng) trong **45 giây**: luồng chính 3 thao tác + 1 ca sai. Không tiếng, không tên người, không thông báo hệ thống. Lưu `demo-doc-45s.mp4` (tỉ lệ dọc). Người quay: Diệu Anh; người thao tác chuột: Dũng. Nếu quay hỏng, dùng ảnh dọc trong slide.

## 4. Luyện nói trên khung (T+20→40)

1. **Vòng 1 (T+20–25) — đọc ghi chú:** Diệu Anh và Dũng đọc thầm khung slide của mình + 5 dòng ghi chú; sửa tiêu đề/gạch nào **họ không nói trôi chảy được** (ghi vào `docs/slide-chinh-sua.md`, một lần gom ở T+35).
2. **Vòng 2 (T+25–32) — nói với đồng hồ:** nói to từng slide theo **3 neo V · T · S**, kết thúc bằng **đúng câu cue** ("Mời chuyển slide."); **Nguyên đóng vai kỹ thuật viên**, đổi slide trên PDF chỉ khi nghe cue; mỗi người đọc slide lẫn **một câu mở thuộc lòng** và **một câu chuyền mic**.
3. **Vòng 3 (T+32–40) — chạy phần mình đủ thời lượng:** DA: 00:00–02:30; Dũng: 02:30–06:15 (slide demo nói theo **ảnh** vì chưa có ảnh thật, dùng ô `[ẢNH: …]`; thao tác chỉ mô tả bằng lời). Quên lời: đọc số trên slide rồi nói vì sao nó quan trọng; **không xin lỗi, không im quá 3 giây**.
4. **Tập "lạc kịch bản":** một người bỏ một câu bất kỳ, cả đội vẫn đúng mốc cứng.
5. **Tập với tiếng mic:** nói cue ở cự ly và âm lượng thật; nhờ người thứ ba nghe có rõ chữ "chuyển" và "slide" không.
6. Sau T+50 (đã có ảnh): **vòng 4** nói lại trên PDF có ảnh, 1 vòng đủ ba bản (10/5/3 phút) nếu còn giờ.

**Điều kiện để chuyển sang giai đoạn sau:** DA và Dũng mỗi người nói đúng giờ hai lần liên tiếp (±15 giây), cue rõ, không đọc nguyên slide.

## 5. Danh sách kiểm theo giai đoạn

**Trước khi gửi prompt 14 (T+10):** [ ] spec + contract + giả định đã dán vào biến · [ ] số chưa có ghi `[SỐ: …]` · [ ] `sprite.svg` + 2 logo đã đính kèm dự án Claude Design · [ ] bản 11 slide (chưa biết thời lượng) · [ ] nhãn `{{MOCK_NOTICE}}` nguyên văn.
**Trước khi gửi prompt 16 (T+10):** [ ] bảng sở hữu file (mỗi việc 1 nhánh `ag/<x>`, 1 cổng 8240+) · [ ] Schema Contract đã dán · [ ] cấm 8000, 8211–8231 · [ ] mốc T+20/30/40/45 · [ ] không việc nào chạm `index.html` hay `js/*.js` chung.
**Khi nhận khung (T+15–20):** [ ] đủ số slide + P1–P3 · [ ] tiêu đề kiểu đặt tên, không từ cấm · [ ] mỗi slide 3–5 gạch ≤ 14 từ + 1 số · [ ] ghi chú 5 dòng ở mọi slide, dòng 4 là cue · [ ] ô ảnh ghi đúng tên file theo bảng slot · [ ] không có tên người trên slide.
**Trước prompt 15 (T+45):** [ ] giao diện đã khóa · [ ] link/localhost chạy, `?demo=1` có dữ liệu · [ ] bảng slot đã điền cột "Cách đến trạng thái" · [ ] hash commit ghi lại · [ ] agent dự phòng đã chạy.
**Khi nhận ZIP (T+50):** [ ] `manifest.txt` đủ cột và không có ảnh "không đạt" · [ ] 5 ảnh ngẫu nhiên đúng theme, không toast, không khóa/email thật · [ ] đủ ảnh 390 (≈25), 360 (8), 1 desktop (desktop chỉ làm minh chứng, không đưa vào slide) · [ ] tên đúng `NN-ten-mobile-light|dark.png`.
**Khi nhận deck có ảnh (T+55):** [ ] mọi ô ảnh có ảnh (hoặc danh sách thiếu) · [ ] không còn `[ẢNH:`, `[SỐ:`, `{{` · [ ] PDF = số slide + phụ lục · [ ] số khớp `BANG-KIEM-THU.md` · [ ] nhãn mô phỏng đúng nguyên văn · [ ] ghi chú còn nguyên trong PPTX.
**Giao kỹ thuật viên:** [ ] PDF + PPTX (cả hai) · [ ] video dọc `demo-<app>.mp4` (nếu có) · [ ] Bảng hiệu lệnh + số slide cuối của từng người · [ ] họp 2 phút tập cue · [ ] số điện thoại/kênh liên lạc của Nguyên.

## 6. Khi sự cố (phương án dự phòng)

| Sự cố | Nhận biết | Làm ngay |
|---|---|---|
| **Claude Design chậm/hết lượt** | quá **T+18** chưa có khung hoặc báo giới hạn | chuyển ngay sang **`deck/` của skill**: spawn agent deck (`prompts/07`, điền `deck/deck.data.js` từ `template.data.js`; loại slide `cover/phone/phones-3/phone-steps/features/demo/ai/quality/metrics/thanks`; slide "Giả định & cách tính" dùng loại `metrics` (giá trị + nhãn nguồn) hoặc `quality`, deck kit chưa có loại `assumptions`), xuất `node deck/tools/export.cjs` → PDF + PNG (+ PPTX nếu có `pptxgenjs`). Dùng **cùng bảng slot ảnh**, cùng ghi chú 5 dòng. Ảnh vào `deck/assets/`. Không chờ Claude Design quá 5 phút nữa |
| **Claude Design xong khung nhưng chèn ảnh lỗi/chậm quá T+55** | báo thiếu ảnh hoặc không phản hồi | (1) chèn tay các ô thiếu bằng giao diện Claude Design (kéo thả file); (2) hoặc xuất bản `deck/` có ảnh từ ZIP; (3) hoặc gửi **PDF khung + thư mục ảnh** và chiếu slide ảnh dọc rời trong cue "Mời phát video demo" |
| **Chrome không chụp/lưu PNG hoặc không đặt được khung 390px** | Bước 0/1 của prompt 15 báo "Không" | dùng **ZIP của agent Claude Code** (`node tools/shots-mobile.cjs <URL> shots-mobile` và `node deck/tools/capture.cjs deck/tools/capture.json`), đóng ZIP bằng script trong prompt 15; không cố sửa Chrome quá 3 phút |
| **Tên file ZIP sai/lệch** | Claude Design báo thiếu slot dù có ảnh | script đổi tên theo bảng slot (map `NN-<tab>` → tên slot); chạy lại Phần 2 |
| **Ảnh sai theme/tràn ngang** | tự kiểm không đạt | chụp lại **đúng slot đó** (không chụp lại cả bộ) |
| **Gemini trễ/hỏng** | quá mốc 10 phút không phản hồi | Claude respawn bản nhỏ hơn của việc đó; Gemini đổi sang việc khác; **không chờ** |
| **Claude Code hết lượt** | không phản hồi/giới hạn | **bàn giao Gemini** bằng `prompts/16` mục B5 (tiếp quản điều phối); Nguyên dùng `templates/THE-DIEU-PHOI.md` làm danh sách việc |
| **Mất mạng** | trang không tải | chạy `localhost:8211`; slide: PDF/PPTX offline; chụp ảnh bằng agent Claude Code (Playwright chạy offline với app local); Gemini/Claude Design không dùng được → dùng bản `deck/` đã xuất sẵn |
| **Kỹ thuật viên không mở được PPTX** | lỗi định dạng | đưa **PDF**; PDF là bản chính, PPTX phụ |
| **Kỹ thuật viên không thể phát video** | không có trình phát | slide 5–7 đã có ảnh dọc từng bước; người nói thuyết minh theo ảnh |
| **Thời lượng đổi (3 hoặc 5 phút)** | BTC báo | cue **"Mời chuyển đến slide N"** theo bảng của Nguyên (`CUE-CARDS.md` thẻ phụ), hoặc dựng bản 7/5 trong Claude Design (10 phút còn lại trước giờ thuyết trình) |

## 7. Quy ước tên và nguồn sự thật

- **Một bảng slot duy nhất** (prompt 14 mục 6) quyết định tên ảnh; prompt 15 và `capture.json` sao chép từ đó. Đổi tên slot = sửa bảng ở prompt 14 **rồi** cập nhật prompt 15 và `deck.data.js`.
- Tên ảnh: `NN-ten-slot-mobile-light|dark.png` (390), `NN-ten-slot-mobile360-light|dark.png` (360). `NN` là số của **slot**, không phải số slide.
- Ghi chú người nói 5 dòng: `Người nói` · `Mốc giờ` · `3 neo V·T·S` · `Cue kỹ thuật` · `Chuyền mic`. Nguồn sự thật cho mốc giờ và neo vẫn là `templates/KICH-BAN-DEMO.md`; slide, thẻ in và ghi chú **sinh từ đó**.
- Phong cách chữ: tiêu đề **đặt tên**, 3–5 gạch ≤ 14 từ, 1 số; chi tiết `references/05` mục "Viết slide" và `prompts/14` mục 3.
