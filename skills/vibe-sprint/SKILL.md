---
name: vibe-sprint
description: Chạy nước rút 60 phút cho chung kết VIBE-CODING 2026 (đọc references/00-the-le-chung-ket.md trước) (đội bốc đề MỚI, phải nộp app mini chạy được + bộ slide thuyết trình). Dùng khi người dùng nói "đề chung kết", "vibe coding 60 phút", "làm app nhanh từ đề", "quay đề mới", "bốc đề", "slide thuyết trình đề", "sprint 60 phút", "làm app trong 1 tiếng", hoặc dán một đề bài và cần ra app + slide + demo thật nhanh. Điều phối nhiều subagent Sonnet/Haiku song song, giữ chất lượng như app Xclipse (HTML/CSS/JS thuần, không build, GitHub Pages, mock AI có nhãn, sáng/tối, mobile, test Playwright).
---

# vibe-sprint — 60 phút từ đề lạ đến app + slide chạy được

> **ĐỌC TRƯỚC: [`references/00-the-le-chung-ket.md`](references/00-the-le-chung-ket.md)** — thể lệ Chung kết 2026: 13:15–14:15 làm bài, nộp **4 món** lúc phút 60 (link demo · mã nguồn · README · minh chứng thời điểm chốt), **cấm chuẩn bị sẵn tính năng cho đề**, mobile 360–390px, thang điểm hai bảng. Mọi mục dưới đây đã khớp thể lệ đó; thể lệ phát tại chỗ khác thì thể lệ phát tại chỗ thắng (ghi vào `docs/DECISIONS.md`).

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
| T+0→5 | Đọc đề + thể lệ phát tại chỗ; **mở file dữ liệu mẫu BTC của bảng mình** (tên sheet, cột, định dạng); viết spec 1 trang, 5 tính năng + tiêu chí nghiệm thu (`references/01`) | Điều phối + 1 agent research (Haiku) song song | `docs/spec-nhanh.md` |
| **T+5 (bắt buộc)** | **Schema Contract** (10-15 dòng, mục 0 của spec: trường + kiểu, tên hàm + hình dạng trả về, collection, id `EP.*`) **và danh sách Giả định** (số nào do BTC cho, số nào đội tự đặt, ghi nguồn/lý do). **Chưa có thì chưa spawn.** | Điều phối | Contract + Giả định dán nguyên văn vào mọi prompt |
| T+5→8 | Chọn starter + UI tokens; kiểm tra UI 2 phút (bảng màu, font, bố cục 3 màn) | Điều phối | `docs/PROGRESS.md` (ghi 5 dòng kiểm UI) |
| T+8→40 | **Song song** (xem bảng agent dưới) | N agent tính năng + deck + docs + data/demo + QA (+ agent Giả định & mô hình nếu Bảng Kinh tế) | Mỗi agent commit trên worktree/thư mục riêng |
| T+25 | Merge đợt 1 (khung + dữ liệu), chạy test nhanh, chụp ảnh | Điều phối | App chạy được dù tính năng chưa đủ |
| T+40→48 | Merge hết, chạy toàn bộ test, `node tools/bump-version.cjs`, `node scripts/scan-secrets.mjs .`, push, deploy Pages | Điều phối + agent QA | Link online chạy |
| T+45 | **Agent Sonnet chụp ảnh điện thoại dọc:** tự mở web app bằng giả lập điện thoại (390×844 @3x và 360×780, sáng + tối) rồi chụp từng tab bằng `starter/tools/shots-mobile.cjs` hoặc `deck/tools/capture.cjs`. Ảnh dọc này dùng cho slide (khung điện thoại, ≤ 3 máy/slide; không dùng ảnh ngang/desktop) và README | 1 agent Sonnet (deck/QA) | `deck/assets/NN-ten-mobile-light|dark.png` |
| T+48→50 | Polish cuối + kiểm tra **mobile 360px VÀ 390px** (5 tiêu chí), sáng/tối, trạng thái rỗng/lỗi. **Sau T+50 không thêm tính năng** | 2–3 agent polish/QA song song | Ảnh chụp sạch |
| **T+50→55** | **Minh chứng thời điểm chốt:** ảnh điện thoại dọc từng màn chính (360 và 390, sáng/tối, agent Sonnet chụp bằng giả lập) + 1 ảnh desktop, hoặc quay dọc màn hình luồng chính, **kèm hash commit đang chạy trên link** (`git rev-parse --short HEAD`, hiện cả phiên bản trên app). Lưu `docs/minh-chung-chot/` | QA agent + điều phối | Ảnh/video + hash |
| **T+55→60** | **Nộp 4 món:** (1) link demo/cách mở, (2) mã nguồn, (3) README (cài chạy, công nghệ, dữ liệu mẫu/tài khoản, khai báo khung chuẩn bị trước), (4) minh chứng chốt. Mở link ở cửa sổ ẩn danh kiểm lần cuối. **Không đẩy thêm commit sau khi chụp minh chứng.** | Điều phối + cả đội | 4 món đã nộp |
| Sau 14:15 | Chuẩn bị pitch (3 bản 10/5/3 phút theo thời lượng BTC báo) + Q&A vòng phản biện (`references/05`) trong lúc giám khảo kiểm tra 14:15–14:45 | Cả đội | Slide + kịch bản demo |

Trễ giờ: **cắt tính năng phụ, không cắt test + deploy + slide.** Tại T+40 mà tính năng nào chưa chạy → dùng bản rút gọn nhưng chạy được.

## Kế hoạch agent song song (T+8→T+40)

| Agent | Model | Việc | Prompt | Cổng |
|---|---|---|---|---|
| Shell/UI + brand | Sonnet | `index.html`, preset/tokens (`<html data-preset>`), `js/config.js`, trang chủ, điều hướng, trạng thái rỗng/lỗi | `prompts/03-shell-brand-agent.md` | 8212 |
| AI | Sonnet | Đặc tả AI cho từng tương tác (`prompt` + `schema` + `mock` cho `EP.ai.generate`), mock có nhãn, Gemini bằng key người dùng nhập | `prompts/04-ai-agent.md` | 8213 |
| Data/demo | Haiku | Dữ liệu demo thật, sạch, tiếng Việt (`EP.demo.register`) | `prompts/05-data-demo-agent.md` | 8214 |
| Polish #1, #2 | Sonnet | Motion, a11y, tương phản, copy | `prompts/10-polish-agent.md` | 8215, 8216 |
| Feature 1…N (mỗi tính năng 1 agent) | Sonnet | Một tính năng (`features/<tên>/feature.js` + `EP.register`) + validation + test | `prompts/02-feature-agent.md` | 8217–8224 |
| Deck | Sonnet | Slide từ `deck/` (điền `deck.data.js`, **chụp ảnh điện thoại dọc 390×844@3x bằng giả lập**, xuất PDF) | `prompts/07-deck-agent.md` | 8225 |
| Docs | Haiku | README, bảng kiểm thử, minh chứng AI, kịch bản demo, hỏi đáp | `prompts/08-docs-agent.md` | 8226 |
| **Giả định & mô hình kinh doanh** (Bảng Kinh tế, bắt buộc) | Sonnet | Danh sách giả định có nguồn, kịch bản lạc quan/cơ sở/bi quan, hòa vốn, độ nhạy, dự phòng, kiểm ưu đãi có lỗ không; dùng `EP.scenario` (`js/scenario.js`) + `EP.importer` (`js/import.js`) của starter; đọc `references/11-mo-hinh-kinh-doanh.md`; nạp file dữ liệu BTC | `prompts/13-business-agent.md` (+ `references/11`, `12`, `kien-thuc/`) | 8231 |
| QA / second opinion #1–#3 | Sonnet + Haiku | Chụp ảnh điện thoại dọc (360 + 390), chạy test, thử đầu vào sai, mobile | `prompts/06-qa-agent.md` | 8227–8229 |
| Cấp cứu / dự phòng | Sonnet | Re-spawn bản rút gọn, bản demo dự phòng | `prompts/11-emergency.md` | 8230 |
| Điều phối (bản merge) | Claude chính | Merge, test, deploy | `prompts/09-merge-deploy.md` | 8211 |

### Bảng cổng (một bảng duy nhất, dùng ở mọi nơi)

| Cổng | Vai |
|---|---|
| **8211** | Điều phối viên / bản merge chính |
| 8212–8216 | Hỗ trợ: 8212 shell/brand · 8213 AI · 8214 data/demo · 8215–8216 polish #1–#2 |
| 8217–8224 | Feature agent F1…F8 |
| 8225–8231 | 8225 deck · 8226 docs · 8227–8229 QA #1–#3 · 8230 cấp cứu/dự phòng · 8231 giả định & mô hình kinh doanh |
| **8000** | **CẤM** (nhiều agent từng dùng chung, server phục vụ nhầm worktree của nhau) |

Mỗi agent chỉ dùng cổng của mình, kill server khi xong. Xung đột chi tiết xem `prompts/00-README.md` và `references/02`.

Haiku cho việc ngắn, rõ, ít suy luận (dữ liệu, docs, QA lặp). Sonnet cho mọi thứ có logic hoặc giao diện. Chi tiết quy trình: `references/02-dieu-phoi-agent.md`. Prompt thật nằm trong `prompts/` (đọc `prompts/00-README.md` trước): copy khối prompt, điền các biến `{{DE_TEXT}}`, `{{FEATURE_NAME}}`, `{{PORT}}`, `{{REPO}}`... rồi gửi.

## Schema Contract, tính số, đợt

- **Schema Contract (T+5):** mọi prompt agent dán nguyên văn, cấm tự đặt tên (lỗi thật: `promoCost` vs `adSpend`, `clickToOrderPct` vs `cr`; xem `references/09`).
- **Code tính số, AI diễn giải;** mẫu số = 0 → `Không đủ dữ liệu`. App **mở trống**, có nút `Điền dữ liệu mẫu`.
- **3 đợt** (1 lõi, 2 nâng cấp, 3 micro-features), **zero-idle** (xong đợt N là spawn ngay đợt N+1). Test logic nhanh bằng node `vm`: `starter/tests/unit-template.cjs`. Chi tiết `references/02`.

## Cổng duyệt (tối thiểu)

1. **Spec (T+5):** 5 tính năng + tiêu chí nghiệm thu, đội đọc lướt 1 phút rồi đi. Không họp dài.
2. **UI (T+8, 2 phút):** tokens + 3 màn chính hợp lý trước khi spawn feature agent.
3. **Test + deploy (T+48):** test xanh, quét secret sạch, link online mở được. **Không bỏ cổng này.**

## Luật

1. **Spec là chuẩn.** Không làm ngoài đề; đề không nói thì chọn mặc định đơn giản, ghi 1 dòng vào `docs/spec-nhanh.md` (mục Giả định). Lõi chạy trọn vẹn trước, tính năng thêm sau.
2. **Dữ liệu/AI mô phỏng luôn gắn nhãn rõ "mẫu/mô phỏng"** trên UI + README. Thể lệ chung kết không còn câu cố định; **đề/BTC đưa câu nào thì chép nguyên văn**. Xem khung ngay dưới. Điểm AI: chỉ mock tối đa 4/15 (Bảng A) — nếu thời gian cho phép thêm đường gọi AI thật bằng key người dùng nhập (Gemini hoặc copy-dán, có sẵn trong `EP.ai`).
3. **Không secret:** key không vào code/chat/commit; ô nhập key hiện `***`, lưu localStorage của người dùng. Quét trước khi push: `node scripts/scan-secrets.mjs .` (xem `references/06`).
4. **Mobile-first**, kiểm tra **360 và 390px** theo 5 tiêu chí (không tràn ngang, nút đủ to, chữ đọc được, luồng chính làm được, điều hướng rõ).
5. **UI tiếng Việt có dấu**, kiểm tra validation (tên trống, email/SĐT sai, trùng, biên).
6. **Chỉ báo kết quả thật** (test đã chạy, ảnh đã chụp). Không ghi "Đạt" cho ca chưa thử.
7. **Điều phối viên không viết code tính năng**; chỉ sửa merge conflict nhỏ và cấu hình.

## Nhãn dữ liệu mẫu/mô phỏng và luật "không chuẩn bị sẵn"

**Nhãn mô phỏng.** Thể lệ chung kết không còn câu nhãn cố định; bắt buộc là **ghi rõ** số liệu/nội dung nào là mẫu hay mô phỏng.

1. T+0: tìm trong đề/thể lệ phát/thông báo BTC xem có **câu** nhãn nào không. **Có thì chép nguyên văn từng chữ, từng dấu** (không sửa, không viết lại).
2. Không có: dùng câu rõ nghĩa của đội, ví dụ `Dữ liệu mẫu/mô phỏng, không phải số liệu thật`, ghi vào `docs/DECISIONS.md`. (`Bản demo vòng loại - Dữ liệu mô phỏng AI` là câu **vòng loại**, đừng dùng lại.)
3. Đặt ở MỘT chỗ: `mockNotice` trong `js/config.js` (`EP.ai.noticeHtml`, chân trang đọc từ đây). Đổi câu thì sửa 2 assert trong `tests/smoke.cjs`, README, bảng kiểm thử, slide.
4. Số từ file BTC ghi "Dữ liệu BTC"; số đội tự đặt ghi "Giả định của đội"; số sinh ra ghi "Mô phỏng". Không để người xem lẫn ba loại.

**Luật không chuẩn bị sẵn (thể lệ cấm).** `starter/` chỉ là **khung chung** chuẩn bị trước (token, form, bảng, biểu đồ, `EP.ai`, `EP.scenario`, `EP.importer`...). **Không viết sẵn mã/dữ liệu/giao diện riêng cho đề dự đoán**; `catalog/` chỉ để luyện, không chép code từ bài luyện sang bài thi. Tính năng của đề chỉ được viết sau khi đề công bố. **README bắt buộc nêu:** "khung `vibe-sprint` chung (không chứa logic của đề) được chuẩn bị trước giờ thi; toàn bộ tính năng, dữ liệu và giao diện theo đề được xây trong 60 phút thi" (mẫu: `templates/README-du-thi.md` mục 10). BTC có thể yêu cầu giải thích, nên giữ lịch sử commit và minh chứng AI.

## Bảng Kinh tế: ưu tiên điểm mô hình

Điểm Kinh tế: lõi 27 · **mô hình kinh doanh 22 · số liệu dự phòng và giả định 17 · cơ chế khuyến mãi thực tế 10** · mobile 10 · UI 5 · hồ sơ 9. Vì thế luôn có một agent **"Giả định & mô hình kinh doanh"** dùng `EP.scenario` + `EP.importer`, và app có sẵn: danh sách giả định (có nguồn), kịch bản, hòa vốn, độ nhạy, dự phòng, kiểm ưu đãi có lỗ không. Chi tiết: `references/11-mo-hinh-kinh-doanh.md`. Pitch có slide "Giả định & cách tính" (`references/05`).

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
- `references/` — **`00` thể lệ chung kết (đọc đầu tiên)** · **`11` mô hình kinh doanh/giả định (Bảng Kinh tế)** · đọc theo nhu cầu: `01` đọc đề → spec · `02` điều phối agent · `03` chuẩn chất lượng Xclipse · `04` bài học lỗi (đã bổ sung đợt 2: quy trình agent, mobile/animation, dữ liệu/AI/chia sẻ) · `05` thuyết trình + hỏi đáp · `06` hồ sơ + triển khai (có Firebase + GitHub Pages) · **`07` cookbook đoạn mã mẫu ≤15 dòng** (cache `?v=`, chống nháy theme, vòng tròn đổi theme, CSS mobile, form/SĐT, nén ảnh, AI schema + mock + nhãn, Gemini, OG/trang chia sẻ tĩnh, Firebase init + rules + deploy, Pages, Sheet, Playwright, ảnh minh chứng, giải merge) · **`08` quy ước viết** (đặt tên, câu chữ tiếng Việt cho UI/lỗi/nút, comment, commit + trailer, thư mục, báo cáo agent). Prompt giao việc nên dán thêm đoạn liên quan của `07`/`08`. **`10` Lucian UI: bảng tra phần tử theo nhu cầu của đề + cách chép trong 5 phút (`references/10-lucian-ui.md`, 22 phần tử ở `vendor/lucian/`)** · **`13` chuẩn mobile (điện thoại dọc 360-390px: tab dưới, vùng chạm 48px, bottom sheet, bảng→thẻ, checklist 5 tiêu chí + test): `references/13-chuan-mobile.md`** · **`09` tư liệu chạy thử thật của đội** (50 phút, 16 subagent, 3 đợt, 60/60 test; lỗi tên trường và bài học điều phối): `references/09-case-study-de7-livetrack.md`.

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
- **Hết giờ mà chưa xong:** ưu tiên (1) nộp đủ 4 món đúng phút 60 với link chạy + 3 tính năng lõi, (2) minh chứng thời điểm chốt, (3) dữ liệu mô phỏng có nhãn, (4) phần còn lại nói thật là chưa làm. Quá 14:15 không sửa, trừ khi BTC mở khung sự cố.
