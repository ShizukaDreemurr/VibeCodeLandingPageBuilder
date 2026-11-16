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
| T+0→5 | Đọc đề, viết spec 1 trang, 5 tính năng + tiêu chí nghiệm thu (`references/01`) | Điều phối + 1 agent research (Haiku) song song | `docs/spec-nhanh.md` |
| T+5→8 | Chọn starter + UI tokens; kiểm tra UI 2 phút (bảng màu, font, bố cục 3 màn) | Điều phối | `docs/PROGRESS.md` (ghi 5 dòng kiểm UI) |
| T+8→40 | **Song song** (xem bảng agent dưới) | N agent tính năng + deck + docs + data/demo + QA | Mỗi agent commit trên worktree/thư mục riêng |
| T+25 | Merge đợt 1 (khung + dữ liệu), chạy test nhanh, chụp ảnh | Điều phối | App chạy được dù tính năng chưa đủ |
| T+40→48 | Merge hết, chạy toàn bộ test, `node tools/bump-version.cjs`, `node scripts/scan-secrets.mjs .`, push, deploy Pages | Điều phối + agent QA | Link online chạy |
| T+48→52 | Polish + kiểm tra mobile 390px, sáng/tối, trạng thái rỗng/lỗi | 2–3 agent polish/QA song song | Ảnh chụp sạch |
| T+52→60 | Tập thuyết trình + demo, chuẩn bị video dự phòng và Q&A (`references/05`) | Cả đội | Slide + kịch bản demo |

Trễ giờ: **cắt tính năng phụ, không cắt test + deploy + slide.** Tại T+40 mà tính năng nào chưa chạy → dùng bản rút gọn nhưng chạy được.

## Kế hoạch agent song song (T+8→T+40)

| Agent | Model | Việc | Prompt | Cổng |
|---|---|---|---|---|
| Shell/UI + brand | Sonnet | `index.html`, preset/tokens (`<html data-preset>`), `js/config.js`, trang chủ, điều hướng, trạng thái rỗng/lỗi | `prompts/03-shell-brand-agent.md` | 8212 |
| AI | Sonnet | Đặc tả AI cho từng tương tác (`prompt` + `schema` + `mock` cho `EP.ai.generate`), mock có nhãn, Gemini bằng key người dùng nhập | `prompts/04-ai-agent.md` | 8213 |
| Data/demo | Haiku | Dữ liệu demo thật, sạch, tiếng Việt (`EP.demo.register`) | `prompts/05-data-demo-agent.md` | 8214 |
| Polish #1, #2 | Sonnet | Motion, a11y, tương phản, copy | `prompts/10-polish-agent.md` | 8215, 8216 |
| Feature 1…N (mỗi tính năng 1 agent) | Sonnet | Một tính năng (`features/<tên>/feature.js` + `EP.register`) + validation + test | `prompts/02-feature-agent.md` | 8217–8224 |
| Deck | Sonnet | Slide từ `deck/` (điền `deck.data.js`, chụp ảnh, xuất PDF) | `prompts/07-deck-agent.md` | 8225 |
| Docs | Haiku | README, bảng kiểm thử, minh chứng AI, kịch bản demo, hỏi đáp | `prompts/08-docs-agent.md` | 8226 |
| QA / second opinion #1–#3 | Sonnet + Haiku | Chụp ảnh, chạy test, thử đầu vào sai, mobile | `prompts/06-qa-agent.md` | 8227–8229 |
| Cấp cứu / dự phòng | Sonnet | Re-spawn bản rút gọn, bản demo dự phòng | `prompts/11-emergency.md` | 8230 |
| Điều phối (bản merge) | Claude chính | Merge, test, deploy | `prompts/09-merge-deploy.md` | 8211 |

### Bảng cổng (một bảng duy nhất, dùng ở mọi nơi)

| Cổng | Vai |
|---|---|
| **8211** | Điều phối viên / bản merge chính |
| 8212–8216 | Hỗ trợ: 8212 shell/brand · 8213 AI · 8214 data/demo · 8215–8216 polish #1–#2 |
| 8217–8224 | Feature agent F1…F8 |
| 8225–8230 | 8225 deck · 8226 docs · 8227–8229 QA #1–#3 · 8230 cấp cứu/dự phòng |
| **8000** | **CẤM** (nhiều agent từng dùng chung, server phục vụ nhầm worktree của nhau) |

Mỗi agent chỉ dùng cổng của mình, kill server khi xong. Xung đột chi tiết xem `prompts/00-README.md` và `references/02`.

Haiku cho việc ngắn, rõ, ít suy luận (dữ liệu, docs, QA lặp). Sonnet cho mọi thứ có logic hoặc giao diện. Chi tiết quy trình: `references/02-dieu-phoi-agent.md`. Prompt thật nằm trong `prompts/` (đọc `prompts/00-README.md` trước): copy khối prompt, điền các biến `{{DE_TEXT}}`, `{{FEATURE_NAME}}`, `{{PORT}}`, `{{REPO}}`... rồi gửi.

## Cổng duyệt (tối thiểu)

1. **Spec (T+5):** 5 tính năng + tiêu chí nghiệm thu, đội đọc lướt 1 phút rồi đi. Không họp dài.
2. **UI (T+8, 2 phút):** tokens + 3 màn chính hợp lý trước khi spawn feature agent.
3. **Test + deploy (T+48):** test xanh, quét secret sạch, link online mở được. **Không bỏ cổng này.**

## Luật

1. **Spec là chuẩn.** Không làm ngoài đề; đề không nói thì chọn mặc định đơn giản, ghi 1 dòng vào `docs/spec-nhanh.md` (mục Giả định). Lõi chạy trọn vẹn trước, tính năng thêm sau.
2. **Mock luôn có nhãn, và nhãn phải NGUYÊN VĂN theo đề/BTC.** Mọi nội dung AI mô phỏng hiện nhãn trên UI + README. Xem khung cảnh báo ngay dưới. Điểm AI: chỉ mock tối đa 4/15 (Bảng A) — nếu thời gian cho phép thêm đường gọi AI thật bằng key người dùng nhập (Gemini hoặc copy-dán, có sẵn trong `EP.ai`).
3. **Không secret:** key không vào code/chat/commit; ô nhập key hiện `***`, lưu localStorage của người dùng. Quét trước khi push: `node scripts/scan-secrets.mjs .` (xem `references/06`).
4. **Mobile-first**, kiểm tra 390px, không tràn ngang.
5. **UI tiếng Việt có dấu**, kiểm tra validation (tên trống, email/SĐT sai, trùng, biên).
6. **Chỉ báo kết quả thật** (test đã chạy, ảnh đã chụp). Không ghi "Đạt" cho ca chưa thử.
7. **Điều phối viên không viết code tính năng**; chỉ sửa merge conflict nhỏ và cấu hình.

## CẢNH BÁO: nhãn mô phỏng AI phải chép NGUYÊN VĂN từ đề/BTC

> **Câu `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của VÒNG LOẠI.** Starter đang đặt sẵn câu này làm mặc định (`mockNotice` trong `js/config.js`) cho vui chân, **không có nghĩa chung kết dùng đúng câu đó**.
>
> 1. Ngay ở T+0, tìm trong đề chung kết / thể lệ / thông báo BTC xem có yêu cầu **câu nhãn mô phỏng** nào không. Nếu có: **chép nguyên văn từng chữ, từng dấu** (không sửa chính tả, không viết lại cho "hay hơn", không đổi dấu gạch).
> 2. Đặt câu đó vào MỘT chỗ: `mockNotice` trong `js/config.js` (nguồn duy nhất; `EP.ai.MOCK_NOTICE`, chân trang, `EP.ai.noticeHtml` đều đọc từ đây). Sau đó sửa **hai dòng assert** trong `tests/smoke.cjs` đang so với câu vòng loại (tìm `Bản demo vòng loại`), chép câu mới vào README, bảng kiểm thử và slide.
> 3. Đề không nói gì và không hỏi được BTC: dùng `Dữ liệu mô phỏng AI` kèm ghi chú "chưa xác nhận wording BTC" trong `docs/DECISIONS.md`. **Đừng giả định, đừng tự nghĩ ra câu.**

## Dùng các thư mục đi kèm

Mọi thứ nằm trong `skills/vibe-sprint/` (gọi tắt `<SKILL>`). Đường dẫn dưới đây đều có thật:

- `starter/` — khung app vanilla HTML/CSS/JS (namespace `window.EP`, không build, không CDN): `index.html`, `css/tokens.css` (preset **xclipse** mặc định / **lucian** qua `<html data-preset>`), `css/app.css`, `js/*.js`, `features/_example` (mẫu CRUD + form + AI + biểu đồ), `features/_playground`, `tests/smoke.cjs`, `tools/bump-version.cjs`. Chép ra thư mục làm việc, không sửa tại chỗ. API chính (đọc `starter/README.md` mục 2):
  - `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })`: tab + h1 + KPI Tổng quan.
  - `EP.collection(name)` (`add/update/remove/get/list/onChange`), `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })`, `EP.ui.table(el, { columns, rows, actions, onAction })`, `EP.ui.dialog/confirm/toast`, `EP.charts.bar/line/donut`, `EP.demo.register(name, { version, rows | seed })`, `EP.export.csv/backup/print`.
  - AI một cửa: `EP.ai.generate({ prompt, schema, mock }, { input })` (chế độ mock / gemini / paste; kèm `EP.ai.noticeHtml(result)`). Mô-đun nhỏ: `mock, metrics, match, calc, checklist, quiz, chat, timeslot` (bảng ở `catalog/module-map.md`).
- `deck/` — khung slide: sửa dữ liệu `deck/deck.data.js` (chép từ `template.data.js`), chụp ảnh `node tools/capture.cjs`, xuất `node tools/export.cjs` → `deck/out/<tên>.pdf`. Xem `deck/README.md`.
- `brand/` — bộ nhận diện Xclipse: `01-bo-nhan-dien-xclipse.md`, `02-giong-dieu-va-noi-dung.md`, `03-album-anh-nganh-nghe.md`, logo (`logo-light.jpg`, `logo-dark.jpg`), album ảnh theo ngành (`brand/album/`), bộ UI mẫu `xclipse-ui-ux-*.html`. Shell/deck agent đọc khi cần màu, giọng điệu, ảnh hero.
- `templates/` — mẫu docs: `spec-nhanh.md`, `README-du-thi.md`, `BANG-KIEM-THU.md`, `MINH-CHUNG-AI.md`, `KICH-BAN-DEMO.md`, `HOI-DAP.md`, `PROGRESS.md`, `DECISIONS.md`, `CLAUDE.md`, `CHECKLIST-CHUNG-KET.md`.
- `prompts/` — prompt tự đủ ngữ cảnh cho từng loại agent (`00-README.md` là mục lục + bảng cổng).
- `catalog/` — gợi ý theo loại đề (`de-bai-vong-1.md`, `de-moi-du-doan.md`, `module-map.md`).
- `scripts/` — `new-project.sh`, `scan-secrets.mjs`.
- `references/` — đọc theo nhu cầu: `01` đọc đề → spec · `02` điều phối agent · `03` chuẩn chất lượng Xclipse · `04` bài học lỗi · `05` thuyết trình + hỏi đáp · `06` hồ sơ + triển khai.

### Lệnh thật (không có tên giữ chỗ)

```
# 1. Tạo dự án mới (chép templates -> CLAUDE.md, README.md, docs/*; starter/ -> gốc dự án; scan-secrets -> scripts/; git init)
bash <SKILL>/scripts/new-project.sh <thư-mục> ["Tên sản phẩm"] [thư-mục-cha]     # nhánh mặc định nop-bai, đổi bằng BRANCH=...
cp -r <SKILL>/deck <thư-mục>/deck          # new-project.sh KHÔNG chép deck/ và brand/; chép tay phần cần (brand/ chỉ để đọc)

# 2. Chạy thử (trong thư mục dự án, cổng theo bảng, không 8000)
python3 -m http.server 8211                                   # mở http://localhost:8211/  (thêm ?demo=1 để nạp lại dữ liệu mẫu)

# 3. Kiểm thử (cần Playwright)
node tests/smoke.cjs http://localhost:8211/ [--shots thu-muc-anh]

# 4. Trước khi push
node --check js/*.js features/*/feature.js
node tools/bump-version.cjs            # tăng patch + gắn ?v= (hoặc: minor | major | 1.2.3 | --stamp)
node scripts/scan-secrets.mjs . [.env.local]     # kết quả phải sạch; chỉ in tên mẫu/biến + vị trí, không in giá trị
```

## Nếu sự cố

- **Mất mạng / Pages chưa lên:** chạy `file://` hoặc `python3 -m http.server 8211` và demo trên localhost; có video quay sẵn làm dự phòng. App không được phụ thuộc CDN/font ngoài khi demo — dùng font hệ thống dự phòng.
- **Pages trễ 1–10 phút:** tiếp tục polish, demo từ localhost, nói rõ "link online đang cập nhật".
- **Agent kẹt >5 phút / vòng lặp:** kill, spawn lại với phạm vi nhỏ hơn + trích đúng đoạn lỗi.
- **Merge conflict nặng:** lấy bản của agent tính năng, chạy lại agent kia rebase (xem `references/02`).
- **Test đỏ phút T+45:** cô lập tính năng gây lỗi, tắt/rút gọn thay vì sửa lan man.
- **Hết giờ mà chưa xong:** ưu tiên (1) link chạy + 3 tính năng lõi, (2) slide, (3) mock có nhãn, (4) phần còn lại nói thật là chưa làm.
