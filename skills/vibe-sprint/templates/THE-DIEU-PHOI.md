# Thẻ điều phối của Nguyên (1 trang): {{TEN_APP}}

> In khổ A4, đặt cạnh bàn phím. **Một dòng = một việc.** Cột "Gõ cho Claude Code" là câu **copy-dán nguyên văn** (sửa chỗ `{{...}}`). Cột "Gửi đi đâu" chỉ file prompt và nơi gửi. Chi tiết quy trình: `references/14-quy-trinh-slide-song-song.md`.
> **Giờ T+ tính từ lúc đề công bố.** Cổng (bảng gốc ở `SKILL.md`): 8211 của Claude (điều phối), 8212–8231 agent Claude, **8240–8249 Gemini**, **8000 cấm**.

> **12:40–13:00 (trước T+0):** xác nhận với BTC kênh và định dạng nộp bài (giới hạn dung lượng ZIP), trình duyệt giám khảo dùng chấm, và thử link trên mạng phòng thi (`*.workers.dev`, `xclipsex.github.io`).

## 1. Mốc giờ, câu gõ, nơi gửi, kiểm

| T+ | Gõ cho Claude Code | Gửi đi đâu (file → nơi) | Kiểm trước khi sang mốc sau |
|---|---|---|---|
| **0** | `Đề đây: {{DÁN ĐỀ}}. Đọc docs/PROGRESS.md và references/00-the-le-chung-ket.md, rồi làm spec 1 trang theo prompts/01 (5 tính năng + tiêu chí nghiệm thu), mở file dữ liệu BTC và liệt kê sheet/cột. Chưa spawn agent code cho đến khi tôi duyệt spec và Schema Contract.` | — (đọc đề to cho DA, Dũng; **DA** viết 5 dòng bối cảnh/người dùng/UI; **Dũng** viết 5 tính năng + 1 quy tắc + ca sai + ca biên) | có `docs/spec-nhanh.md` nháp |
| **5** (cổng) | `Spec + Schema Contract + Giả định đã duyệt. Dán contract vào docs/spec-nhanh.md mục 0 và danh sách giả định (có nguồn). Chọn starter + tokens, kiểm UI 3 màn 2 phút, ghi 5 dòng vào docs/PROGRESS.md.` | — | **Chưa có contract + giả định thì chưa gửi prompt nào** |
| **8** | `Điền hai prompt từ docs/spec-nhanh.md: prompts/14 (khung slide, bản 11) và prompts/16 (Gemini: việc ag/ui = tính năng {{F4}}, ag/data, ag/docs; thêm ag/biz nếu Bảng Kinh tế). Đưa tôi hai khối đã điền, số chưa có để [SỐ: …]. Rồi spawn đợt 1: shell, AI, data, feature F1–F3, giả định (prompts/13), docs, QA.` | — | 2 khối đã điền; số nào bịa thì sửa |
| **10** | (dán khối) | **prompts/14 Phần 1 → Claude Design** (dự án mới; đính kèm `brand/icons/sprite.svg`, `brand/logo-light.jpg`, `brand/logo-dark.jpg`). **prompts/16 MASTER + B1…B4 → Gemini Antigravity** (mỗi việc 1 cuộc trò chuyện, nhánh `ag/<x>`, cổng 8240+) | ghi giờ gửi vào `docs/PROGRESS.md` |
| **15–20** | `Kiểm khung slide theo prompts/14 mục 9. Tôi dán danh sách tiêu đề + số slide; đối chiếu tiêu đề kiểu đặt tên, không từ cấm, ghi chú 5 dòng.` (hoặc tự kiểm) | sửa chữ bằng **1–2 tin gộp** cho Claude Design; **xuất PDF khung → DA, Dũng** | đủ slide + P1–P3 + ô `[ẢNH: …]` |
| **20** | `Báo cáo trạng thái: nhánh Claude nào chạy, nhánh ag/* nào đã push (git branch -a), test hiện tại, cái gì chậm hơn mốc.` | Gemini: nhắc commit đầu tiên | mỗi nhánh có commit chạy được |
| **25** | `Merge đợt 1 theo thứ tự data → AI → shell → feature (ag/* cuối cùng của từng nhóm), chạy node --check + smoke, chụp ảnh thử, báo 4 mục.` | — | app chạy dù thiếu tính năng |
| **35** | `Gom chỉnh sửa lời/tiêu đề từ buổi luyện thành 1 danh sách (docs/slide-chinh-sua.md); đưa tôi bản tin để gửi Claude Design.` | **một tin duy nhất → Claude Design** | khung v2 |
| **40** | `Merge hết nhánh Claude và ag/*, đặt showPlayground: false (js/config.js), chạy node --check js/*.js features/*/feature.js, smoke, mobile 360 + 390, scan-secrets. Test đỏ thì cô lập tính năng, rút gọn, không sửa lan man.` | — | test xanh, secret sạch |
| **44** | `KHÓA GIAO DIỆN từ bây giờ: chỉ sửa lỗi, không đổi bố cục/nhãn/thứ tự tab. Ghi vào docs/DECISIONS.md.` | báo cả đội | — |
| **45** | `Điền bảng slot của prompts/15 (cột Cách đến trạng thái) từ app thật, đưa tôi khối hoàn chỉnh kèm hash commit. Đồng thời spawn 1 agent Sonnet chạy dự phòng: node tools/shots-mobile.cjs + node deck/tools/capture.cjs theo tên slot, kiểm tỉ lệ 9:19,5, đóng ZIP có manifest.txt.` | **prompts/15 → Claude Sonnet trong Chrome** (link Pages hoặc `http://localhost:8211/`) | 2 ZIP; dùng cái đạt trước |
| **48** | `node tools/bump-version.cjs, quét secret, push nop-bai, deploy Pages; mở link ẩn danh; báo link + hash commit.` | — | link online chạy |
| **50** | `Nhận ZIP ảnh: kiểm manifest.txt, 5 ảnh ngẫu nhiên, cỡ 1170×2532, đúng sáng/tối. Rồi tôi gửi Phần 2 cho Claude Design.` | **tải ZIP lên đúng dự án Claude Design → dán prompts/14 Phần 2**; đưa số thật (ca đạt, giây phản hồi, hòa vốn) | báo cáo thiếu ảnh = rỗng |
| **50–55** | `Chụp minh chứng thời điểm chốt: ảnh điện thoại dọc 360 + 390 (sáng/tối) + 1 desktop + hash commit đang chạy trên link; lưu docs/minh-chung/ (node scripts/nop-bai.mjs --url <link>). Không commit mã thêm sau khi chụp.` | DA quay video demo dọc 45 giây | ảnh + hash khớp link |
| **55** | `Hoàn thiện README (khai báo khung chuẩn bị trước + công cụ AI: Claude, Gemini Antigravity), bảng kiểm thử chỉ ca đã chạy thật. Nộp 4 món: link · mã nguồn · README · minh chứng.` | **xuất PDF + PPTX + PNG từng slide → gửi kỹ thuật viên** kèm bảng ở mục 2 | mở link ẩn danh lần cuối |
| **60** | — | nghỉ 1 phút; DA, Dũng nói lại trên deck thật cùng Nguyên | **không đẩy thêm commit** |

## 2. Giao cho kỹ thuật viên của BTC (đưa 1 tờ giấy + file)

**File:** PDF (bản chính) + PPTX (phụ) + video dọc `demo-doc-45s.mp4` (nếu có). **Tờ giấy (in từ bảng dưới, điền số slide cuối):**

| Người nói nói | Anh/chị làm |
|---|---|
| **"Mời chuyển slide."** | sang slide kế |
| **"Mời lùi một slide."** | lùi 1 slide |
| **"Mời chuyển đến slide N."** | nhảy tới slide N |
| **"Mời phát video demo."** / **"Mời quay lại slide."** | bật / tắt video (ở slide demo) |
| **"Mời mở bản chạy thật."** | mở link {{LINK_DEMO}} (nếu cho phép) |

Slide cuối của từng người: **Diệu Anh** → slide {{SLIDE_CUOI_DA}} · **Dũng** → slide {{SLIDE_CUOI_DUNG}} · **Nguyên** → slide {{SLIDE_CUOI_NGUYEN}} (có thêm phụ lục P1–P3 ở cuối, **ẩn khi chiếu**). Nghe không rõ cue thì **giữ nguyên**, người nói nhắc lại. Họp 2 phút trước giờ vào phòng: tập 3 lần "Mời chuyển slide" với mic thật. Liên hệ Nguyên: {{SDT_NGUYEN}}.

## 3. Bảng sự cố (xử lý trong ≤ 3 phút, không sửa lan man)

| Sự cố | Làm ngay | Người |
|---|---|---|
| **Mất mạng / Pages chưa lên** | chạy `python3 -m http.server 8211`, demo và chụp ảnh trên localhost; slide dùng PDF offline; nói với BGK "link online đang cập nhật" | Nguyên + Claude |
| **Gemini trễ hoặc hỏng** (quá mốc 10 phút) | Claude respawn bản nhỏ hơn của việc đó; Gemini sang việc khác; **không chờ** | Claude |
| **Gemini AI / Worker proxy lỗi** (trong app) | app chuyển **chế độ mô phỏng có nhãn** `{{MOCK_NOTICE}}`; ghi `docs/DECISIONS.md`; **không** ghi "AI thật" trong README/slide | Claude |
| **Claude Code hết lượt** | mở cuộc trò chuyện Gemini mới, dán **prompts/16 mục B5** (tiếp quản điều phối) + `docs/PROGRESS.md`; Nguyên dùng thẻ này làm danh sách việc; ưu tiên: test xanh → deploy → minh chứng → nộp 4 món | Nguyên + Gemini |
| **Claude Design chậm/hết lượt** (quá T+18 chưa có khung, hoặc T+55 chưa có ảnh) | dùng **`deck/` dự phòng**: spawn agent deck (`prompts/07`), `node deck/tools/export.cjs` → PDF + PNG; **cùng bảng slot ảnh** | Claude |
| **Chrome không chụp/lưu được hoặc không đặt được khung 390px** | dùng ZIP của agent Claude Code (`shots-mobile.cjs`, `capture.cjs`); không sửa Chrome quá 3 phút | Claude |
| **Ảnh sai theme/tràn ngang/có thông tin nhạy cảm** | chụp lại **đúng slot đó**; ảnh lộ khóa/email thật thì xóa khỏi ZIP và đổi dữ liệu mẫu | Claude |
| **Test đỏ phút T+40–48** | cô lập tính năng gây lỗi, tắt hoặc rút gọn; không cắt test + deploy + nộp | Claude |
| **Lộ khóa API** | **dừng push**; báo đội; thu hồi khóa ở nhà cung cấp; xóa khỏi lịch sử trước khi nộp (`node scripts/scan-secrets.mjs .`) | Nguyên |
| **BTC báo thời lượng 5 hoặc 3 phút** | chọn bản 7/5 slide; nhắn Claude Design dựng bản đó (prompts/14 mục 7B/7C) **hoặc** dùng cue "Mời chuyển đến slide N"; đưa kỹ thuật viên tờ mới | Nguyên |
| **Hết giờ chưa xong** | ưu tiên: (1) nộp đủ 4 món đúng phút 60, link chạy, 3 tính năng lõi; (2) minh chứng chốt; (3) nhãn mô phỏng; (4) phần còn lại nói thật là chưa làm | Nguyên |

## 4. Ba câu nhớ

1. **Không contract, không spawn.** Không giờ T+44 thì không đổi giao diện.
2. **Gemini chỉ đẩy nhánh `ag/<x>`; Claude merge.** Cổng 8240+, không 8000.
3. **Slide không ai tự bấm:** mọi slide có dòng "Cue kỹ thuật" ở ghi chú; người nói nói "Mời chuyển slide." ngay sau con số `S`.
