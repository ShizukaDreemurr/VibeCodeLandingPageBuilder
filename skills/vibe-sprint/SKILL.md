---
name: vibe-sprint
description: Chạy nước rút 60 phút cho chung kết VIBE-CODING 2026 (đội bốc đề MỚI, phải nộp app mini chạy được + bộ slide thuyết trình). Dùng khi người dùng nói "đề chung kết", "vibe coding 60 phút", "làm app nhanh từ đề", "quay đề mới", "bốc đề", "slide thuyết trình đề", "sprint 60 phút", "làm app trong 1 tiếng", hoặc dán một đề bài và cần ra app + slide + demo thật nhanh. Điều phối nhiều subagent Sonnet/Haiku song song, giữ chất lượng như app Xclipse (HTML/CSS/JS thuần, không build, GitHub Pages, mock AI có nhãn, sáng/tối, mobile, test Playwright).
---

# vibe-sprint — 60 phút từ đề lạ đến app + slide chạy được

## Chính sách tài nguyên: xả láng

Khi skill này chạy, **usage/token KHÔNG phải ràng buộc. Thời gian là ràng buộc duy nhất.**

- Điều phối viên (Claude chính) **chỉ điều phối**: lập kế hoạch, spawn, merge, test, deploy, báo cáo. **Không tự viết code tính năng.**
- Spawn **càng nhiều subagent Sonnet và Haiku 5.5 chạy cùng lúc càng tốt**: mỗi tính năng một agent, thêm agent khung/UI-tokens, AI mock, dữ liệu demo, deck, docs, QA, polish, research.
- Mỗi agent nhận prompt **đầy đủ ngữ cảnh, dài cũng được** (file cần sửa, file cấm đụng, cổng riêng, cách verify). Không rút gọn để tiết kiệm.
- **Không tiết kiệm kiểm chứng**: chụp ảnh màn hình, chạy test, chạy lại sau merge. Thích spawn thêm agent QA / "ý kiến thứ hai" hơn là làm tuần tự.
- Agent kẹt hoặc chậm → **kill và spawn lại bản nhỏ hơn**, đừng chờ.

## Người dùng là ai

- Đội sinh viên (FPT Polytechnic Hà Nội), thi chung kết 17/11/2026, **60 phút**, bốc **đề mới** tại chỗ. Phải nộp: app mini chạy được + slide + demo/hỏi đáp.
- Có thể không rành code. Việc họ phải tự làm (bấm GitHub, dán key) → hướng dẫn tiếng Việt, đánh số, nói rõ bấm đâu. **Không bao giờ xin dán key vào chat.**
- UI tiếng Việt có dấu; code/biến tiếng Anh; giờ `Asia/Ho_Chi_Minh`. Báo kết quả thật: chưa thử thì nói chưa thử.

## Run-sheet 60 phút

| Phút | Việc | Ai làm | Đầu ra |
|---|---|---|---|
| T+0→5 | Đọc đề, viết spec 1 trang, 5 tính năng + tiêu chí nghiệm thu (`references/01`) | Điều phối + 1 agent research (Haiku) song song | `docs/spec.md` |
| T+5→8 | Chọn starter + UI tokens; kiểm tra UI 2 phút (bảng màu, font, bố cục 3 màn) | Điều phối | `docs/ui-check.md` (5 dòng) |
| T+8→40 | **Song song** (xem bảng agent dưới) | N agent tính năng + deck + docs + data/demo + QA | Mỗi agent commit trên worktree/thư mục riêng |
| T+25 | Merge đợt 1 (khung + dữ liệu), chạy test nhanh, chụp ảnh | Điều phối | App chạy được dù tính năng chưa đủ |
| T+40→48 | Merge hết, chạy toàn bộ test, bump `?v=`, quét secret, push, deploy Pages | Điều phối + agent QA | Link online chạy |
| T+48→52 | Polish + kiểm tra mobile 390px, sáng/tối, trạng thái rỗng/lỗi | 2–3 agent polish/QA song song | Ảnh chụp sạch |
| T+52→60 | Tập thuyết trình + demo, chuẩn bị video dự phòng và Q&A (`references/05`) | Cả đội | Slide + kịch bản demo |

Trễ giờ: **cắt tính năng phụ, không cắt test + deploy + slide.** Tại T+40 mà tính năng nào chưa chạy → dùng bản rút gọn nhưng chạy được.

## Kế hoạch agent song song (T+8→T+40)

| Agent | Model | Việc | Prompt |
|---|---|---|---|
| Shell/UI | Sonnet | Khung app, tokens, sáng/tối, điều hướng, trạng thái rỗng/lỗi | `prompts/` (file shell) |
| Feature 1…N (mỗi tính năng 1 agent) | Sonnet | Một tính năng + validation + test | `prompts/` (file feature) |
| AI mock | Sonnet | Lớp AI 1 cửa: mock có nhãn + (tuỳ chọn) Gemini bằng key người dùng nhập | `prompts/` (file ai) |
| Data/demo | Haiku | Dữ liệu demo thật, sạch, tiếng Việt | `prompts/` (file demo-data) |
| Deck | Sonnet | Slide từ `deck/` | `prompts/` (file deck) |
| Docs | Haiku | README, bảng kiểm thử, minh chứng AI | `templates/` + `prompts/` |
| QA / second opinion | Sonnet + Haiku | Chụp ảnh, chạy test, thử đầu vào sai, mobile | `prompts/` (file qa) |
| Polish | Sonnet | Motion, a11y, tương phản, copy | `prompts/` (file polish) |

Haiku cho việc ngắn, rõ, ít suy luận (dữ liệu, docs, QA lặp). Sonnet cho mọi thứ có logic hoặc giao diện. Chi tiết quy trình: `references/02-dieu-phoi-agent.md`. Prompt thật nằm trong `prompts/` — chạy `ls prompts/` rồi điền `{{ĐỀ}}`, `{{SPEC}}`, cổng, đường dẫn.

## Cổng duyệt (tối thiểu)

1. **Spec (T+5):** 5 tính năng + tiêu chí nghiệm thu, đội đọc lướt 1 phút rồi đi. Không họp dài.
2. **UI (T+8, 2 phút):** tokens + 3 màn chính hợp lý trước khi spawn feature agent.
3. **Test + deploy (T+48):** test xanh, quét secret sạch, link online mở được. **Không bỏ cổng này.**

## Luật

1. **Spec là chuẩn.** Không làm ngoài đề; đề không nói thì chọn mặc định đơn giản, ghi 1 dòng vào `docs/spec.md`. Lõi chạy trọn vẹn trước, tính năng thêm sau.
2. **Mock luôn có nhãn.** Mọi nội dung AI mô phỏng hiện nhãn trên UI + README. **Hỏi/đọc đề xem BTC yêu cầu nguyên văn câu nào**; vòng loại dùng đúng câu `Bản demo vòng loại - Dữ liệu mô phỏng AI` (chung kết có thể khác, **đừng giả định**, lấy từ đề; chưa biết thì dùng "Dữ liệu mô phỏng AI" kèm ghi chú). Điểm AI: chỉ mock tối đa 4/15 (Bảng A) — nếu thời gian cho phép thêm đường gọi AI thật bằng key người dùng nhập.
3. **Không secret:** key không vào code/chat/commit; ô nhập key hiện `***`, lưu localStorage của người dùng. Quét trước khi push (`references/06`).
4. **Mobile-first**, kiểm tra 390px, không tràn ngang.
5. **UI tiếng Việt có dấu**, kiểm tra validation (tên trống, email/SĐT sai, trùng, biên).
6. **Chỉ báo kết quả thật** (test đã chạy, ảnh đã chụp). Không ghi "Đạt" cho ca chưa thử.
7. **Điều phối viên không viết code tính năng**; chỉ sửa merge conflict nhỏ và cấu hình.

## Dùng các thư mục đi kèm

Mọi thứ nằm trong `skills/vibe-sprint/`. Chạy `ls` từng thư mục để biết tên file thật (do nhiều người viết):

- `starter/` — khung app vanilla HTML/CSS/JS: tokens, sáng/tối, toast, dialog, storage, mock AI. Chép ra thư mục làm việc, không sửa tại chỗ.
- `deck/` — khung slide thuyết trình; deck agent điền nội dung từ spec + ảnh chụp thật.
- `templates/` — mẫu docs: spec, README, bảng kiểm thử, minh chứng AI, CHECKLIST.
- `prompts/` — prompt tự đủ ngữ cảnh cho từng loại agent.
- `catalog/` — gợi ý theo loại đề (tính năng điển hình, dữ liệu mẫu, rủi ro).
- `scripts/` — tiện ích (quét secret, bump version, serve); đọc đầu file trước khi chạy.
- `references/` — đọc theo nhu cầu: `01` đọc đề → spec · `02` điều phối agent · `03` chuẩn chất lượng Xclipse · `04` bài học lỗi · `05` thuyết trình + hỏi đáp · `06` hồ sơ + triển khai.

## Nếu sự cố

- **Mất mạng / Pages chưa lên:** chạy `file://` hoặc `python3 -m http.server 8080` và demo trên localhost; có video quay sẵn làm dự phòng. App không được phụ thuộc CDN/font ngoài khi demo — dùng font hệ thống dự phòng.
- **Pages trễ 1–10 phút:** tiếp tục polish, demo từ localhost, nói rõ "link online đang cập nhật".
- **Agent kẹt >5 phút / vòng lặp:** kill, spawn lại với phạm vi nhỏ hơn + trích đúng đoạn lỗi.
- **Merge conflict nặng:** lấy bản của agent tính năng, chạy lại agent kia rebase (xem `references/02`).
- **Test đỏ phút T+45:** cô lập tính năng gây lỗi, tắt/rút gọn thay vì sửa lan man.
- **Hết giờ mà chưa xong:** ưu tiên (1) link chạy + 3 tính năng lõi, (2) slide, (3) mock có nhãn, (4) phần còn lại nói thật là chưa làm.
