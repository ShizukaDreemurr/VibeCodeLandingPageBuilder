---
name: vibe-sprint
description: Chạy nước rút 60 phút cho chung kết VIBE-CODING 2026 (đội bốc đề MỚI, phải nộp app mini chạy được + bộ slide thuyết trình). Dùng khi người dùng nói "đề chung kết", "vibe coding 60 phút", "làm app nhanh từ đề", "quay đề mới", "bốc đề", "slide thuyết trình đề", "sprint 60 phút", "làm app trong 1 tiếng", hoặc dán một đề bài và cần ra app + slide + demo thật nhanh. Điều phối nhiều subagent Sonnet/Haiku song song, giữ chất lượng như app Xclipse (HTML/CSS/JS thuần, không build, GitHub Pages, mock AI có nhãn, sáng/tối, mobile, test Playwright).
---

# vibe-sprint — bản hướng dẫn rút gọn cho Gemini (chỉ tài liệu, không có code chạy)

=================== FILE: SKILL.md ===================
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
- `references/` — đọc theo nhu cầu: `01` đọc đề → spec · `02` điều phối agent · `03` chuẩn chất lượng Xclipse · `04` bài học lỗi (đã bổ sung đợt 2: quy trình agent, mobile/animation, dữ liệu/AI/chia sẻ) · `05` thuyết trình + hỏi đáp · `06` hồ sơ + triển khai (có Firebase + GitHub Pages) · **`07` cookbook đoạn mã mẫu ≤15 dòng** (cache `?v=`, chống nháy theme, vòng tròn đổi theme, CSS mobile, form/SĐT, nén ảnh, AI schema + mock + nhãn, Gemini, OG/trang chia sẻ tĩnh, Firebase init + rules + deploy, Pages, Sheet, Playwright, ảnh minh chứng, giải merge) · **`08` quy ước viết** (đặt tên, câu chữ tiếng Việt cho UI/lỗi/nút, comment, commit + trailer, thư mục, báo cáo agent). Prompt giao việc nên dán thêm đoạn liên quan của `07`/`08`.

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

=================== FILE: catalog/de-bai-vong-1.md ===================
# 10 đề bài chính thức — VIBE-CODING 2026 (vòng loại)

Nguồn: https://vibecoding.info.vn/de-bai (lấy ngày 13/11/2026). Phần "5 tính năng" là nguyên văn từ trang BTC.
Ghi chú chung: mỗi đội nhận 1 đề qua quay số; có thể trùng đề. Các đề khác Đề 8 đều cho phép AI mock nếu ghi chú rõ trong app và README. Bảng A: chỉ mock thì tối đa 4/15 ở nhóm "Tích hợp AI". Bảng B: mock minh bạch vẫn đạt 100.

Quy ước "MVP 45 phút": luồng cốt lõi chạy được trọn vẹn đủ 5 tính năng, dữ liệu mẫu có sẵn, AI có thể mock. Phần còn lại là polish.

---

## Đề 01 — Website & thương hiệu: AI tư vấn chọn gói Hosting / Domain

- **Bối cảnh / người dùng:** chủ shop online nhỏ, không rành kỹ thuật, cần chọn gói hosting/domain theo quy mô và ngân sách.
- **5 tính năng (verbatim):**
  1. Form nhập nhu cầu: loại website (bán hàng/giới thiệu/blog), lượng truy cập ước tính mỗi tháng, ngân sách, có cần mua kèm tên miền không.
  2. AI phân tích và gợi ý 01 gói phù hợp nhất + 02 gói thay thế, giải thích lý do bằng tiếng Việt đơn giản, dễ hiểu với người không rành kỹ thuật.
  3. Bảng so sánh 03 gói được gợi ý (giá, dung lượng, băng thông, tính năng nổi bật).
  4. Nút "Đăng ký tư vấn": mở form nhập tên + số điện thoại, lưu vào danh sách khách hàng (localStorage).
  5. Mục FAQ dạng accordion với 05 câu hỏi thường gặp về hosting/domain.
- **BTC giải thích thêm:** 03 gói do đội tự định nghĩa trong dữ liệu mẫu (tên, giá, thông số), có thể tham khảo nhà tài trợ. Form đăng ký chỉ lưu localStorage.
- **AI làm gì:** nhận bộ nhu cầu đã chuẩn hóa, chọn 1 gói + 2 gói thay thế, trả về JSON (id gói, lý do ngắn). Có thể làm rule-based (ngân sách + lượng truy cập → gói) và để AI chỉ viết lời giải thích.
- **Dữ liệu lưu:** `plans[]` (3 gói mẫu), `leads[]` (tên, SĐT, thời gian, gói được gợi ý), `faq[]` (5 câu).
- **Bẫy thường gặp:** AI chọn gói ngoài danh sách 3 gói (phải kiểm tra id trả về); SĐT sai định dạng; so sánh bảng không khớp dữ liệu gói; không ghi rõ gói là "dữ liệu mẫu".
- **MVP 45 phút:** form + rule chọn gói (ngân sách/traffic) → bảng 3 gói → nút tư vấn lưu localStorage → FAQ accordion; AI = mock câu giải thích.

## Đề 02 — Nội dung & chiến dịch: Trình tạo caption quảng cáo bằng AI

- **Bối cảnh / người dùng:** chủ shop và marketer cần nhiều nội dung đăng fanpage mỗi ngày.
- **5 tính năng (verbatim):**
  1. Form nhập: tên sản phẩm, mô tả ngắn, đối tượng khách hàng, tông giọng (hài hước / trang trọng / trẻ trung).
  2. AI sinh 03 caption + 03 headline + 05 hashtag phù hợp với đầu vào.
  3. Nút copy từng nội dung, nút "Tạo lại" để sinh bộ nội dung mới.
  4. Lịch sử các lần tạo (lưu localStorage): xem lại, xóa từng mục.
  5. Bộ đếm ký tự cho từng caption, cảnh báo khi vượt giới hạn chuẩn của Facebook/Instagram.
- **BTC giải thích thêm:** tông giọng chọn 1 trong 3 mức có sẵn. Ngưỡng cảnh báo do đội quy định và ghi rõ (ví dụ 2.200 ký tự Instagram).
- **AI làm gì:** trả JSON `{captions:[3], headlines:[3], hashtags:[5]}`; "Tạo lại" gọi lại với cùng input.
- **Dữ liệu lưu:** `history[]` (input + output + thời điểm), ngưỡng ký tự theo kênh.
- **Bẫy thường gặp:** AI trả thiếu/thừa số lượng (phải validate đếm); hashtag có dấu cách/ký tự đặc biệt; copy trên iOS Safari cần fallback; đếm ký tự emoji sai.
- **MVP 45 phút:** form → gọi AI (hoặc mock trả JSON cố định) → render 3+3+5 kèm nút copy → bộ đếm ký tự → history localStorage có xóa.

## Đề 03 — Tương tác & khách hàng: Minigame quiz thu lead cho fanpage

- **Bối cảnh / người dùng:** fanpage muốn tăng tương tác và thu số điện thoại khách.
- **5 tính năng (verbatim):**
  1. Trang tạo quiz: nhập 05 câu hỏi trắc nghiệm (mỗi câu 04 đáp án), hoặc nhờ AI gợi ý câu hỏi theo chủ đề cho trước.
  2. Trang chơi: hiển thị từng câu hỏi, đếm ngược 30 giây mỗi câu, tính điểm theo đáp án đúng và tốc độ trả lời.
  3. Màn hình kết quả + form nhập tên/số điện thoại để nhận quà (lưu localStorage).
  4. Bảng xếp hạng top 10 người chơi điểm cao nhất.
  5. Nút chia sẻ kết quả (copy nội dung để đăng Facebook).
- **BTC giải thích thêm:** "trang quản trị" và "trang chơi" là 2 màn hình trong cùng app, không đăng nhập. Hết 30 giây tự chuyển câu và tính là sai. AI gợi ý câu hỏi có thể nhập tay hoặc mock.
- **AI làm gì:** sinh 5 câu hỏi + 4 đáp án + đáp án đúng theo chủ đề, JSON có kiểm tra (đúng 1 đáp án đúng, không trùng).
- **Dữ liệu lưu:** `quiz` (5 câu), `players[]` (tên, SĐT, điểm, thời gian), leaderboard tính từ players.
- **Bẫy thường gặp:** timer không dừng khi chuyển trang / hết giờ bị chạy 2 lần; công thức điểm tốc độ (phải ghi rõ trong app); điểm bằng nhau khi xếp hạng; AI trả đáp án đúng không khớp index.
- **MVP 45 phút:** nhập 5 câu (hoặc preset) → màn chơi có timer 30s → tính điểm → form lead → bảng top 10. AI: nút "gợi ý" trả preset theo chủ đề.

## Đề 04 — Tương tác & khách hàng: Chatbot FAQ & đặt lịch tư vấn

- **Bối cảnh / người dùng:** doanh nghiệp nhỏ cần kênh trả lời khách 24/7 không đủ nhân sự trực.
- **5 tính năng (verbatim):**
  1. Khung chat trả lời 08–10 câu hỏi thường gặp từ bộ kiến thức có sẵn (dữ liệu mẫu do đội tự xây dựng).
  2. AI diễn đạt lại câu trả lời cho tự nhiên và gợi ý 03 câu hỏi liên quan sau mỗi lượt trả lời.
  3. Khi không trả lời được, chatbot chủ động đề xuất đặt lịch tư vấn với nhân viên.
  4. Form đặt lịch: chọn ngày/giờ, nhập tên + số điện thoại, lưu danh sách lịch hẹn (localStorage).
  5. Trang quản trị đơn giản: xem danh sách lịch hẹn đã đặt, xóa lịch đã xử lý.
- **BTC giải thích thêm:** bộ 08–10 câu hỏi do đội soạn, liệt kê trong README. "AI diễn đạt lại" được phép mock có chú thích. Trang quản trị không cần đăng nhập.
- **AI làm gì:** (a) diễn đạt lại đáp án từ KB; (b) sinh 3 câu gợi ý liên quan; (c) có thể phân loại ý định để quyết định "không trả lời được".
- **Dữ liệu lưu:** `faq[]` (8–10 câu + keywords), `chat[]` (tùy chọn), `bookings[]`.
- **Bẫy thường gặp:** khớp câu hỏi bằng từ khóa không bỏ dấu tiếng Việt (phải chuẩn hóa); bot "bịa" khi KB không có câu trả lời; đặt lịch quá khứ hoặc trùng khung giờ; trang quản trị lộ ra ngoài không cảnh báo.
- **MVP 45 phút:** KB 8 câu + match từ khóa (có bỏ dấu) → bong bóng chat → fallback "Đặt lịch" → form lịch lưu localStorage → trang admin liệt kê và xóa. AI: diễn đạt lại = mock thay đổi câu chào.

## Đề 05 — Website & thương hiệu: Kiểm tra nhanh phân tích website

- **Bối cảnh / người dùng:** doanh nghiệp nhỏ muốn biết website của mình có chuẩn marketing không.
- **5 tính năng (verbatim):**
  1. Nhập URL website → kiểm tra tự động các yếu tố cơ bản phía client (có thẻ title, meta description, viewport mobile, favicon hay không…).
  2. Hiển thị điểm số /100 kèm checklist từng hạng mục đạt/chưa đạt.
  3. AI nhận xét bằng tiếng Việt: 03 điểm mạnh và 03 điểm cần cải thiện của website.
  4. Nút xuất báo cáo dạng text để copy gửi khách hàng.
  5. Lịch sử các website đã kiểm tra (lưu localStorage), xem lại/xóa.
- **BTC giải thích thêm:** chỉ kiểm tra những gì làm được phía trình duyệt. Vì CORS, đội chọn 1 trong 3 cách và ghi trong README: (a) fetch trực tiếp (ghi rõ hạn chế), (b) người dùng dán HTML để phân tích, (c) phân tích website mẫu có sẵn. Thang điểm và trọng số do đội công bố trong app.
- **AI làm gì:** nhận bảng kết quả checklist (JSON) và sinh 3 điểm mạnh + 3 điểm cần cải thiện; không cần AI để chấm điểm (rule).
- **Dữ liệu lưu:** `checks[]` (url, HTML hoặc kết quả, điểm, checklist, thời điểm), `weights` (trọng số công bố).
- **Bẫy thường gặp:** fetch URL ngoài bị CORS (cần chọn cách b hoặc c và nói rõ); đọc title/meta bằng regex thay vì DOMParser; điểm không cộng đúng 100; quên `viewport` và `favicon` khi dán HTML.
- **MVP 45 phút:** ô dán HTML (cách b) → DOMParser kiểm tra 6–8 mục → điểm /100 có trọng số → checklist → nút copy báo cáo text → lịch sử localStorage. AI = mock 3+3 nhận xét theo mục chưa đạt.
- **Lưu ý:** `docs/vibecoding-tong-hop-bai-viet.md` ghi Đề 5 là công cụ chấm điểm URL; phần "checklist trước xuất bản" cho trang của chính mình thuộc sản phẩm nhóm mình (Đề 8 / repo), nên tránh để hai thứ lẫn lộn trong README và demo.

## Đề 06 — Nội dung & chiến dịch: Trình tạo email marketing bằng AI

- **Bối cảnh / người dùng:** marketer, chủ shop cần soạn email chiến dịch nhanh.
- **5 tính năng (verbatim):**
  1. Form nhập: mục tiêu chiến dịch (ra mắt sản phẩm / khuyến mãi / chăm sóc khách hàng), tên thương hiệu, nội dung ưu đãi.
  2. AI viết 03 mẫu email, mỗi mẫu gồm: subject line + nội dung + nút kêu gọi hành động (CTA).
  3. Khung preview hiển thị email như trong hộp thư thật.
  4. Nút copy từng mẫu, nút "Viết lại theo tông khác" (trang trọng/hài hước/khẩn cấp).
  5. AI gợi ý thời điểm gửi tốt nhất theo ngành hàng đã nhập.
- **BTC giải thích thêm:** 03 mẫu phải khác nhau rõ rệt về cách viết. "Viết lại" đổi sang đúng 1 trong 3 tông cho trước. Preview chỉ cần khung thư đơn giản.
- **AI làm gì:** trả JSON 3 email có cấu trúc `{subject, body, cta}`; viết lại theo tông; gợi ý giờ gửi (có thể là bảng rule theo ngành).
- **Dữ liệu lưu:** `campaigns[]` (input + 3 mẫu), tông giọng, bảng giờ gửi theo ngành.
- **Bẫy thường gặp:** 3 mẫu na ná nhau (kiểm tra độ khác nhau, ví dụ so khớp cấu trúc câu mở đầu); subject quá dài; preview vỡ trên mobile; "viết lại" làm mất CTA.
- **MVP 45 phút:** form → mock/AI trả 3 mẫu có cấu trúc → preview khung thư → copy từng mẫu → nút đổi tông (tái sinh từ mẫu gốc) → bảng giờ gửi theo ngành.

## Đề 07 — Dữ liệu & hiệu quả: Dashboard KPI chiến dịch mini

- **Bối cảnh / người dùng:** marketer theo dõi quảng cáo hằng ngày, không rành Excel.
- **5 tính năng (verbatim):**
  1. Form nhập số liệu theo ngày: reach, click, chi phí, số đơn hàng (cho phép nhập nhiều dòng, lưu localStorage).
  2. Vẽ biểu đồ đường/cột thể hiện reach, chi phí, đơn hàng theo ngày.
  3. Tự động tính các chỉ số: CTR, CPC, chi phí trên mỗi đơn hàng.
  4. AI nhận xét xu hướng (tăng/giảm) và đưa 03 gợi ý cải thiện chiến dịch.
  5. Nút xuất báo cáo tóm tắt dạng text để copy gửi sếp/khách hàng.
- **BTC giải thích thêm:** số liệu nhập tay, không cần API quảng cáo. Công thức do đội định nghĩa và ghi trong app/README (ví dụ CTR = click / reach). Được dùng thư viện vẽ biểu đồ (ví dụ Chart.js).
- **AI làm gì:** nhận bảng tổng hợp (đã tính sẵn bằng code) và trả xu hướng + 3 gợi ý. Không để AI tự tính số.
- **Dữ liệu lưu:** `rows[]` (ngày, reach, click, cost, orders), công thức ghi trong README.
- **Bẫy thường gặp:** chia cho 0 (reach = 0, đơn = 0); nhập nhiều dòng cùng ngày (cần gộp hay cảnh báo trùng); định dạng tiền VND; ngày không sắp xếp làm biểu đồ sai.
- **MVP 45 phút:** bảng nhập nhiều dòng → hàm metric an toàn chia 0 → biểu đồ đường (Chart.js hoặc SVG có sẵn) → card CTR/CPC/CPA → AI mock xu hướng → copy báo cáo text.

## Đề 08 — Website & thương hiệu: Tạo landing page sự kiện trong 5 phút

- **Bối cảnh / người dùng:** marketer tổ chức workshop/sự kiện, cần landing page nhanh không nhờ designer.
- **5 tính năng (verbatim):**
  1. Form nhập: tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi đăng ký sớm.
  2. AI sinh headline, đoạn mô tả và 03 bullet lợi ích khi tham dự.
  3. Render landing page hoàn chỉnh: phần hero, đếm ngược đến giờ G, chương trình (agenda), form đăng ký.
  4. Form đăng ký lưu danh sách (localStorage) và hiển thị số người đã đăng ký theo thời gian thực trên trang.
  5. Nút "Tạo trang mới" để làm lại từ đầu với sự kiện khác.
- **BTC giải thích thêm:** landing hiển thị ngay trong app (dưới form hoặc trang xem trước), không cần URL riêng. Sự kiện đã qua → "Sự kiện đã diễn ra", không đếm ngược số âm. Danh sách đăng ký hiển thị công khai số người trên trang.
- **Quy tắc nghiệp vụ trong buổi đào tạo (tài liệu `docs/tieu-chi-cham-thi.md`):** tên trống/email sai/SĐT sai → cảnh báo; bấm 2 lần chỉ ghi nhận 1; API key nhập ô riêng, hiện dạng ***.
- **AI làm gì:** headline + mô tả + 3 bullet từ thông tin đã nhập; không bịa số liệu. Repo đã có sẵn bản mô phỏng offline (`js/content-generator.js`).
- **Dữ liệu lưu:** `events[]`, `registrations[]` (gắn eventId, chống trùng theo SĐT/email), trạng thái sự kiện tính theo thời gian hiện tại.
- **Bẫy thường gặp:** đếm ngược số âm; đăng ký trùng; timezone khi so thời gian; số người đăng ký không cập nhật khi mở ở tab khác (localStorage là per-máy, phải ghi giới hạn).
- **MVP 45 phút:** Đề này đã gần như có sẵn trong repo (event-status, registrations, validators, landing-renderer, content-generator). Việc còn lại: đối chiếu đủ 5 tính năng, kiểm tra các ca biên ở trên, README ghi rõ giới hạn localStorage.

## Đề 09 — Nội dung & chiến dịch: AI gợi ý ý tưởng chiến dịch marketing

- **Bối cảnh / người dùng:** người làm marketing bí ý tưởng, cần gợi ý theo ngân sách.
- **5 tính năng (verbatim):**
  1. Form nhập: ngành hàng, tên sản phẩm, mức ngân sách (03 mức: thấp/trung bình/cao), mục tiêu chiến dịch.
  2. AI đề xuất 05 ý tưởng chiến dịch, mỗi ý tưởng gồm: tên chiến dịch, kênh triển khai, nội dung chính.
  3. Mỗi ý tưởng kèm timeline triển khai 04 tuần tóm tắt.
  4. Nút "Lưu vào shortlist" cho từng ý tưởng yêu thích.
  5. Trang shortlist: xem lại các ý tưởng đã lưu, xóa, copy tóm tắt để gửi team.
- **BTC giải thích thêm:** 3 mức ngân sách là lựa chọn có sẵn, đội tự định nghĩa khoảng tiền minh họa. Timeline dạng danh sách tuần 1–4, không cần Gantt. Shortlist lưu localStorage.
- **AI làm gì:** trả JSON `{ideas:[5 × {name, channel, content, weeks:[4]}]}`; validate đủ 5 mục và 4 tuần.
- **Dữ liệu lưu:** `shortlist[]` (idea + thời điểm lưu), bảng khoảng ngân sách theo mức.
- **Bẫy thường gặp:** AI trả 4 hoặc 6 ý tưởng; kênh không khớp ngành; ý tưởng trùng nhau; lưu trùng cùng một ý tưởng khi bấm nhiều lần.
- **MVP 45 phút:** form (select 3 mức) → mock 5 ý tưởng cố định theo ngành → card có timeline 4 tuần → lưu shortlist localStorage → trang shortlist có xóa và copy text.

## Đề 10 — Website & thương hiệu: Kiểm tra & gợi ý tên thương hiệu + tên miền

- **Bối cảnh / người dùng:** người khởi nghiệp online đặt tên thương hiệu và chọn tên miền.
- **5 tính năng (verbatim):**
  1. Nhập tên thương hiệu mong muốn.
  2. AI đánh giá: độ dễ nhớ, độ dễ đọc/phát âm, và gợi ý 05 biến thể tên miền (.com/.vn/.shop…).
  3. Kiểm tra tình trạng tên miền ở chế độ demo (mock theo quy tắc đơn giản, ghi rõ "kết quả demo").
  4. AI gợi ý 03 slogan và 01 câu tagline cho thương hiệu.
  5. Nút copy toàn bộ thông tin + nút kêu gọi hành động "Đăng ký tên miền" dẫn về trang nhà tài trợ.
- **BTC giải thích thêm:** kết quả kiểm tra tên miền là mô phỏng và BẮT BUỘC ghi "kết quả demo, không phải dữ liệu thật". Link đăng ký dùng link BTC cung cấp, nếu chưa có thì link demo + ghi README.
- **AI làm gì:** đánh giá (điểm dễ nhớ, dễ đọc) + biến thể tên miền + slogan/tagline; không được dùng AI để nói tên miền "còn trống" thật.
- **Dữ liệu lưu:** `lastCheck` (tên, kết quả demo), link nhà tài trợ trong cấu hình.
- **Bẫy thường gặp:** quên nhãn "demo" (bị trừ điểm chính xác nghiệp vụ); tên có dấu/khoảng trắng chuyển thành domain không hợp lệ; biến thể có ký tự không hợp lệ; nút CTA mở link sai.
- **MVP 45 phút:** input tên → chuẩn hóa thành slug → mock đánh giá + 5 biến thể (.com/.vn/.shop) → kiểm tra demo có nhãn → 3 slogan + 1 tagline → nút copy + CTA.

---

## Điểm chung cần tránh ở mọi đề

- Đừng làm thêm tính năng ngoài 5 tính năng (BTC nhấn mạnh giữ phạm vi); luồng chính chạy trọn trước.
- Mọi kết quả AI được validate (số lượng, định dạng) trước khi hiển thị; có nhãn "AI" hoặc "mock/demo".
- Dữ liệu localStorage: wrap try/catch, ghi giới hạn trong README.
- Giao diện dùng được trên điện thoại (Bảng A có 5 điểm, Bảng B có 10 điểm cho giao diện).

=================== FILE: catalog/de-moi-du-doan.md ===================
# Dự đoán đề chung kết (10 hướng) — chỉ để luyện tập

**Cảnh báo:** đây là dự đoán, không phải thông tin của BTC. Tài liệu nội bộ (`docs/tieu-chi-cham-thi.md`) ghi rằng bộ tiêu chí vòng loại không quy định tiêu chí vòng chung kết, và BTC sẽ thông báo trước thi. Lịch chung kết theo notes là 17/11/2026. Dùng các hướng dưới đây để tập phản xạ: chọn 5 tính năng, dựng luồng chính, giải thích AI và dữ liệu. Không đưa vào hồ sơ như một đề chính thức.

Hướng chung dự đoán: thương mại điện tử và kinh doanh, theo cách các đề vòng 1 làm (form → AI/mock → kết quả → lưu localStorage → copy báo cáo). Mỗi hướng có 5 tính năng, AI đóng vai trò gì, dữ liệu gì, và bẫy cần chuẩn bị.

---

## 1. Tính lợi nhuận từng sản phẩm bán online

- **Bối cảnh:** chủ shop trên sàn hoặc website muốn biết mỗi đơn còn lãi bao nhiêu sau phí.
- **5 tính năng:**
  1. Nhập sản phẩm: giá vốn, giá bán, phí sàn (%), phí vận chuyển, chi phí quảng cáo trên đơn.
  2. Tính lợi nhuận gộp, biên lợi nhuận và điểm hòa vốn theo số lượng.
  3. Bảng so sánh nhiều sản phẩm, sắp xếp theo lợi nhuận.
  4. AI đề xuất mức giá bán tối thiểu và 2 phương án khuyến mãi không làm lỗ.
  5. Lưu danh sách sản phẩm (localStorage), xuất báo cáo text để copy.
- **AI làm gì:** đề xuất giá và giải thích; công thức tính do code làm, AI không tự tính số.
- **Dữ liệu:** `products[]`, công thức phí ghi trong app.
- **Dữ liệu demo gợi ý:** 5 sản phẩm: 2 lỗ, 3 lãi (ví dụ 1 sản phẩm lỗ nặng vì phí sàn + ship, 1 lãi mỏng sát hòa vốn), tên và giá có thật (áo thun 89.000 đ, tai nghe 159.000 đ). Có đủ ca để demo cảnh báo lỗ, biểu đồ có cả cột âm, và AI đề xuất giá tối thiểu cho sản phẩm lỗ.
- **Bẫy:** đơn vị phần trăm và VND; chia cho 0 khi giá bán = 0; AI đề xuất giá dưới giá vốn.

## 2. Quản lý tồn kho và cảnh báo hết hàng

- **Bối cảnh:** shop nhỏ hay hết hàng hoặc tồn quá nhiều vì không theo dõi.
- **5 tính năng:**
  1. Form nhập sản phẩm: SKU, tên, tồn đầu, số lượng nhập, số lượng bán theo ngày.
  2. Danh sách tồn kho hiện tại, lọc theo "sắp hết" và "tồn lâu".
  3. Ngưỡng cảnh báo tồn tối thiểu do người dùng đặt cho từng sản phẩm.
  4. AI dự báo ngày hết hàng dựa trên tốc độ bán 7 ngày gần nhất và đề xuất số lượng nhập.
  5. Xuất danh sách cần nhập hàng dạng text hoặc CSV.
- **AI làm gì:** diễn giải dự báo và đề xuất; tốc độ bán do code tính.
- **Dữ liệu:** `skus[]`, `movements[]` (ngày, loại nhập/bán, số lượng).
- **Dữ liệu demo gợi ý:** 6 SKU: 2 sắp hết (dưới ngưỡng), 1 tồn lâu không bán, 3 bình thường; 14 ngày lịch sử nhập/bán, trong đó 1 SKU mới chỉ có 3 ngày dữ liệu (để demo ca chưa đủ 7 ngày) và 1 SKU suýt âm tồn.
- **Bẫy:** tồn âm khi nhập bán nhiều hơn tồn; đơn vị ngày khi chưa đủ 7 ngày dữ liệu; trùng SKU.

## 3. Phân loại và phản hồi đánh giá khách hàng

- **Bối cảnh:** chủ shop có nhiều đánh giá nhưng không có thời gian đọc và trả lời từng cái.
- **5 tính năng:**
  1. Dán hoặc nhập danh sách đánh giá (mỗi dòng một đánh giá, có số sao tùy chọn).
  2. AI phân loại từng đánh giá: tích cực / tiêu cực / trung tính, và chủ đề (giao hàng, chất lượng, giá, dịch vụ).
  3. Thống kê: tỉ lệ từng nhóm, chủ đề bị phàn nàn nhiều nhất.
  4. AI soạn câu trả lời lịch sự cho từng đánh giá tiêu cực, có nút copy và sửa.
  5. Lọc danh sách theo nhóm và lưu lịch sử phân loại (localStorage).
- **AI làm gì:** phân loại và soạn trả lời; thống kê do code làm; phải trả JSON đúng nhãn cho phép.
- **Dữ liệu:** `reviews[]` (nội dung, sao, nhãn AI, nhãn người sửa).
- **Dữ liệu demo gợi ý:** 12 đánh giá: 5 tích cực, 4 tiêu cực (giao chậm, chất lượng, giá), 3 trung tính; có 1 đánh giá không dấu, 1 đánh giá mâu thuẫn (5 sao nhưng chê), 1 đánh giá rất ngắn ("ok").
- **Bẫy:** AI trả nhãn ngoài danh sách; đánh giá tiếng Việt không dấu; câu trả lời hứa hẹn quá mức (hoàn tiền, đổi hàng không có chính sách thật).

## 4. Chatbot tra cứu đơn hàng và chính sách

- **Bối cảnh:** shop nhận nhiều câu hỏi "đơn của tôi đâu", "đổi trả thế nào" lặp lại mỗi ngày.
- **5 tính năng:**
  1. Khung chat với các câu hỏi chung (đổi trả, phí ship, thời gian giao) từ bộ FAQ mẫu.
  2. Tra cứu đơn theo mã đơn và số điện thoại, dữ liệu đơn mẫu do đội tự tạo.
  3. AI diễn đạt lại câu trả lời và gợi ý 3 câu hỏi liên quan.
  4. Khi không trả lời được, chatbot đề nghị chuyển sang form để lại lời nhắn cho nhân viên.
  5. Trang quản trị xem và đánh dấu các yêu cầu đã xử lý.
- **AI làm gì:** diễn đạt lại; không được bịa thông tin đơn hàng.
- **Dữ liệu:** `orders[]` mẫu, `faq[]`, `tickets[]`.
- **Dữ liệu demo gợi ý:** 5 đơn mẫu: 2 đã giao, 1 đang giao, 1 chờ xác nhận, 1 đã hủy; 6 câu FAQ (đổi trả, ship, giờ làm việc, thanh toán, bảo hành, hủy đơn); 2 câu hỏi demo biết trước là chatbot không trả lời được để bật luồng để lại lời nhắn.
- **Bẫy:** chatbot tự "biết" đơn mà không khớp mã; số điện thoại trong tra cứu phải che bớt khi hiển thị; khớp từ khóa không bỏ dấu.

## 5. Viết mô tả sản phẩm cho sàn thương mại điện tử

- **Bối cảnh:** chủ shop có hàng trăm sản phẩm chưa có mô tả, mỗi sàn yêu cầu giới hạn khác nhau.
- **5 tính năng:**
  1. Form nhập: tên sản phẩm, thông số, chất liệu, đối tượng, điểm nổi bật, sàn đích.
  2. AI viết tiêu đề, mô tả ngắn và 5 gạch đầu dòng theo giới hạn ký tự của sàn đã chọn.
  3. Bộ đếm ký tự, cảnh báo khi vượt giới hạn.
  4. Gợi ý 5 từ khóa tìm kiếm, có nút copy từng từ.
  5. Lịch sử mô tả đã tạo, xem lại và xóa (localStorage).
- **AI làm gì:** viết nội dung; không bịa thông số sản phẩm (phải đánh dấu chỗ cần xác nhận).
- **Dữ liệu:** `drafts[]`, bảng giới hạn ký tự theo sàn (ghi trong app).
- **Dữ liệu demo gợi ý:** 4 sản phẩm thuộc 2 nhóm (thời trang, đồ gia dụng) và 2 sàn đích có giới hạn ký tự khác nhau; 1 sản phẩm cố tình thiếu thông số để demo chỗ AI đánh dấu "cần xác nhận", 1 sản phẩm có tên rất dài để demo cảnh báo vượt giới hạn.
- **Bẫy:** AI thêm thông số không có trong đầu vào; vượt giới hạn sau khi copy; từ khóa lặp.

## 6. Phân khúc khách hàng và soạn tin khuyến mãi

- **Bối cảnh:** shop có danh sách khách mua hàng nhưng gửi tin khuyến mãi cho tất cả mọi người.
- **5 tính năng:**
  1. Nhập danh sách khách (tên, số lần mua, tổng chi tiêu, ngày mua gần nhất) — nhập tay hoặc dán từ bảng.
  2. Phân nhóm: khách mới, khách trung thành, khách lâu không quay lại (ngưỡng do đội đặt).
  3. Chọn nhóm và mục tiêu, AI soạn tin SMS hoặc Zalo đúng giới hạn ký tự.
  4. Ước tính số tin gửi và chi phí theo đơn giá tin do người dùng nhập.
  5. Xuất danh sách nhóm dạng CSV và lưu chiến dịch đã soạn.
- **AI làm gì:** soạn tin; phân nhóm do rule.
- **Dữ liệu:** `customers[]`, `segments` (ngưỡng), `campaigns[]`.
- **Dữ liệu demo gợi ý:** 15 khách: 5 mới (1 lần mua), 5 trung thành (từ 4 lần, chi tiêu cao), 5 lâu không quay lại (trên 90 ngày); 1 cặp khách trùng SĐT và 1 khách thiếu ngày mua để demo kiểm tra dữ liệu.
- **Bẫy:** ngày mua không đúng định dạng; khách có SĐT trùng; tin vượt giới hạn SMS (70 ký tự có dấu) — cần đếm đúng.

## 7. Chấm điểm lead và kịch bản chốt sales

- **Bối cảnh:** đội sales nhỏ nhận nhiều lead nhưng không biết ưu tiên gọi ai trước.
- **5 tính năng:**
  1. Form nhập lead: nguồn, ngân sách, nhu cầu, thời gian dự kiến mua, mức độ quan tâm.
  2. Chấm điểm lead theo thang 100 với trọng số công bố trong app.
  3. Phân loại: nóng / ấm / lạnh.
  4. AI soạn kịch bản gọi và tin nhắn theo nhóm lead, có chỗ để sales tự sửa.
  5. Danh sách lead sắp xếp theo điểm, đánh dấu đã liên hệ, xuất CSV.
- **AI làm gì:** kịch bản và giải thích điểm; điểm do công thức.
- **Dữ liệu:** `leads[]`, `weights`, `status`.
- **Dữ liệu demo gợi ý:** 8 lead: 2 nóng (điểm từ 80), 3 ấm, 2 lạnh, 1 thiếu trường (điểm chưa đủ dữ liệu); 1 cặp lead trùng số điện thoại; trọng số mặc định cộng đúng 100.
- **Bẫy:** điểm không cộng đúng 100 khi thiếu trường; lead trùng số điện thoại; kịch bản có lời hứa không đúng sản phẩm.

## 8. Landing page flash sale với mã giảm giá và đếm ngược

- **Bối cảnh:** shop muốn chạy một đợt giảm giá ngắn hạn với số lượng có hạn.
- **5 tính năng:**
  1. Form tạo đợt sale: tên sản phẩm, giá gốc, giá sale, số lượng, thời gian bắt đầu và kết thúc.
  2. Landing render: hero, giá, đếm ngược đến hết đợt, số lượng còn lại.
  3. Form đặt hàng: tên, SĐT, địa chỉ, mã giảm giá; kiểm tra mã hợp lệ và còn hạn.
  4. Khi hết hàng hoặc hết đợt, nút đặt bị khóa và hiển thị trạng thái rõ ràng.
  5. Danh sách đơn đặt (localStorage) và nút xuất CSV.
- **AI làm gì:** viết headline và mô tả từ thông tin nhập; không tạo số lượng hay mức giảm giả.
- **Dữ liệu:** `sale`, `coupons[]`, `orders[]`.
- **Dữ liệu demo gợi ý:** 1 đợt sale 48 giờ, 3 mã giảm (1 còn hạn, 1 hết lượt dùng, 1 hết hạn), tồn kho 5 sản phẩm trong đó 1 chỉ còn 2 suất để demo ca hết chỗ khi hai người đặt cùng lúc; đồng hồ đếm ngược theo giờ Việt Nam.
- **Bẫy:** "số lượng còn lại" phải phản ánh thật (không đếm ngược giả, theo quy tắc BTC ở đề 8 vòng 1); đặt hai lần làm âm tồn; múi giờ đếm ngược.

## 9. Giỏ hàng và checkout tính phí ship và voucher

- **Bối cảnh:** khách bỏ giỏ vì không biết tổng tiền cuối cùng trước khi thanh toán.
- **5 tính năng:**
  1. Chọn sản phẩm và số lượng vào giỏ, có bảng giá sản phẩm mẫu.
  2. Nhập mã voucher: loại theo % hoặc số tiền, có điều kiện đơn tối thiểu và hạn dùng.
  3. Phí ship theo khu vực (3 vùng, bảng do đội đặt) và miễn phí ship theo ngưỡng.
  4. Tổng tiền hiển thị theo thời gian thực: tạm tính, giảm giá, phí ship, tổng.
  5. Đặt hàng: lưu đơn (localStorage), hiện mã đơn và tóm tắt có nút copy.
- **AI làm gì:** gợi ý thêm sản phẩm để đủ ngưỡng miễn phí ship; tổng tiền do code tính.
- **Dữ liệu:** `products[]`, `vouchers[]`, `shippingZones`, `orders[]`.
- **Dữ liệu demo gợi ý:** 6 sản phẩm, 3 voucher (1 phần trăm, 1 trừ thẳng, 1 vượt tổng đơn để demo chặn âm tiền), 3 vùng ship (nội thành, ngoại thành, tỉnh); 1 giỏ mẫu có tổng lẻ để kiểm tra làm tròn VND.
- **Bẫy:** làm tròn VND; voucher cộng dồn; giảm giá vượt tổng đơn (âm tiền); làm mới trang mất giỏ.

## 10. Lịch nội dung và kế hoạch chiến dịch đa kênh

- **Bối cảnh:** nhóm marketing nhỏ cần biết đăng gì, ở kênh nào, vào ngày nào trong tháng.
- **5 tính năng:**
  1. Form nhập chiến dịch: mục tiêu, kênh (Facebook, Instagram, TikTok, email), ngân sách, thời gian chạy.
  2. AI đề xuất lịch 4 tuần: mỗi bài có ngày, kênh, loại nội dung, chủ đề.
  3. Hiển thị lịch dạng bảng theo tuần, có lọc theo kênh.
  4. Đánh dấu bài đã đăng hoặc đã duyệt; bài quá hạn được tô màu.
  5. Xuất lịch dạng CSV hoặc file ICS để thêm vào lịch điện thoại.
- **AI làm gì:** đề xuất lịch và chủ đề; không hứa về hiệu quả.
- **Dữ liệu:** `campaigns[]`, `posts[]` (ngày, kênh, trạng thái).
- **Dữ liệu demo gợi ý:** 3 chiến dịch trên 4 kênh, 12 bài trải 4 tuần: 3 đã đăng, 2 quá hạn (tô màu), 7 chờ duyệt; 1 cặp bài trùng ngày cùng kênh và 1 chiến dịch bắt đầu 28/2 để demo ngày cuối tháng.
- **Bẫy:** ngày không tồn tại (30/2); múi giờ khi xuất ICS; bài trùng ngày trên cùng kênh; lịch không đủ 4 tuần.

---

## Cách dùng để tập

- Mỗi thành viên bốc một hướng ngẫu nhiên, dựng MVP 45 phút theo mẫu vòng 1.
- Chốt 5 tính năng trước, ghi vào README, rồi mới bắt đầu code.
- Tập câu hỏi vấn đáp cho Bảng B: "người dùng là ai", "AI làm gì và bạn kiểm soát đầu ra thế nào", "dữ liệu nằm đâu".
- Đề bài vòng chung kết nếu khác hẳn các hướng trên thì ưu tiên giữ luồng cốt lõi, không thêm tính năng ngoài phạm vi.

=================== FILE: catalog/module-map.md ===================
# Ma trận module: năng lực lặp lại giữa 10 đề vòng 1

Đọc cùng `de-bai-vong-1.md`. Đề số = đề trong mục đó.

**Lưu ý về nguồn module:** cột "Module hiện có trong repo" bên dưới là các file của repo Xclipse/VibeCodeLandingPageBuilder (tham khảo ý tưởng, KHÔNG nằm trong skill). Bộ `starter/` của skill đã làm sẵn phần lớn cột "Module nên thêm"; dùng bảng ánh xạ này thay vì viết lại:

| Năng lực (số ở bảng 1) | Có sẵn trong `starter/` |
|---|---|
| 1 Form + validation | `js/form.js`: `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })`, luật required/email/phone/url/min/max/date/pattern/custom, chống bấm đôi |
| 2 List / CRUD localStorage | `js/core.js`: `EP.collection(name)` (add/update/remove/get/list/onChange), `EP.store`; bảng `EP.ui.table` (`js/ui.js`) |
| 3, 4 AI sinh chữ / phân loại | `js/ai.js`: `EP.ai.generate({ prompt, schema, mock }, { input })` (mock / gemini / paste, kiểm schema, rơi về mock), `js/mock.js` (hash, rng, sentiment, classify) |
| 5 Dashboard / biểu đồ | `js/charts.js` (`EP.charts.bar/line/donut`), `js/metrics.js` (CTR/CPC/CPA/ROAS, VND, xu hướng) |
| 6 Lịch | `js/timeslot.js` (`EP.time.slots/overlaps/freeSlots/countdown`) |
| 7 Export | `js/export.js` (`EP.export.csv/json/text/backup/print`), `EP.ui.copy` |
| 8 Chatbot UI | `js/chat.js` (`EP.chat.mount`, `EP.chat.faqReply`) |
| 9 Landing / xem trước | không có; tự làm trong feature (xem `brand/` để lấy ảnh hero và màu) |
| 10 Đăng ký + đếm | `EP.collection` + `EP.demo.register` + KPI qua `summary()`; không có Sheet/Firebase |
| 11 Tìm kiếm / lọc | `js/match.js` (`EP.text.normalize`, `EP.match.faq`, `EP.match.search`) |
| 12 Chấm điểm / quiz | `js/quiz.js` (`EP.quiz.create/leaderboard/mount`), `js/checklist.js` (`EP.checklist.score/mount`) |
| 13 Ngân sách / tính toán | `js/calc.js` (`EP.calc.mount`), `js/metrics.js` |
| 14 SEO checker | không có; ví dụ checklist ở `features/_playground` |
| 15 Upload ảnh | không có (không đề nào cần) |

Ký hiệu: ✔ = đề yêu cầu trực tiếp; ◐ = có thể dùng đến / phụ.

## 1. Ma trận năng lực

| # | Năng lực | Đề | Module hiện có trong repo | Còn thiếu | Module nên thêm |
|---|---|---|---|---|---|
| 1 | Form + validation | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | `js/validators.js` (tên, email, SĐT VN, trùng lặp qua `registrations.js`) | Validator theo schema chung (số, khoảng, enum/select, URL, ngày/giờ); khóa nút chống bấm 2 lần chung cho mọi form; thông báo lỗi dưới từng ô | `form-schema.js` |
| 2 | List / CRUD có localStorage | 2, 3, 4, 5, 7, 8, 9 | `js/storage.js` (wrapper localStorage, có chỗ đổi sang cloud), `js/registrations.js` (CRUD theo sự kiện) | Wrapper CRUD tổng quát (id, createdAt, xóa theo id, giới hạn số bản ghi); bảng có nút xóa dùng lại được | `collection-store.js` |
| 3 | AI text generation | 1, 2, 3, 4, 5, 6, 8, 9, 10 | `js/ai-service.js` (gọi Gemini, kiểm soát đầu ra), `js/content-generator.js` (mô phỏng offline, theo công thức copy) | Gọi AI trả JSON theo schema + thử lại khi sai số lượng + chuyển sang mock tự động; nhãn "AI thật / mock" hiển thị chung; mock theo từng loại đầu ra không chỉ copywriting | `ai-json.js` + `mock-ai.js` |
| 4 | AI classification / analysis | 1 (chọn gói), 4 (khớp ý định), 5 (nhận xét điểm mạnh/yếu), 7 (xu hướng), 10 (đánh giá tên) | Không có. `ai-service.js` có phần soạn prompt nhưng chưa có khuôn phân tích | Khuôn prompt phân tích kèm dữ liệu đã tính sẵn (AI không tự tính số); phân loại có nhãn cố định | (gộp vào `ai-json.js`, thêm `prompt-templates.js`) |
| 5 | Dashboard / biểu đồ | 7 (chính), 5 (thanh điểm, tùy chọn) | `js/charts.js` (line, bar, donut, horizontal bars bằng SVG, không cần thư viện, có bảng số thay thế) | Đã đủ cho biểu đồ đường/cột; thiếu thẻ KPI (CTR, CPC…) và bộ tính chỉ số an toàn chia 0 | `metrics.js` |
| 6 | Lịch / lên lịch | 4 (chọn ngày giờ, không trùng), 8 (thời gian sự kiện, đếm ngược), 6 (gợi ý giờ gửi) | `js/event-status.js` (trạng thái đã diễn ra/sắp diễn ra), `validators.js` (kiểm tra thời gian) | Bộ sinh khung giờ; kiểm tra trùng lịch; so sánh múi giờ | `timeslot.js` |
| 7 | Export CSV / PDF / text | Text copy: 2, 5, 6, 7, 9, 10. CSV: 8 (danh sách đăng ký, dùng được). PDF: không đề nào yêu cầu | `js/app.js` có `exportCsv()` (BOM UTF-8, lọc theo bảng quản trị, đã có ở Đề 8); `js/brand-ai.js` có chữ PDF (không phải export) | Hàm copy clipboard dùng lại được (có fallback khi không có Clipboard API); bộ dựng báo cáo text; CSV tách khỏi `app.js` để dùng cho các đề khác | `export.js` (copy + text + CSV) |
| 8 | Chatbot UI | 4 (chính) | Không có. `ai-service.js` nhắc tới "chat" chỉ ở mức đường dẫn mở ChatGPT | Bong bóng chat, gợi ý nhanh (quick reply), chuyển sang form khi không trả lời được | `chatbot-ui.js` |
| 9 | Landing / trang xem trước | 8 (chính), 6 (khung preview email) | `js/landing-renderer.js`, `js/templates.js`, `js/templates-data.js`, `js/page-style.js`, `js/tpl-gallery.js`, `js/seo.js` (SEO khi xuất HTML) | Khung xem trước có chuyển desktop/mobile dùng chung; khung "hộp thư" cho email (Đề 6) | `preview-frame.js` |
| 10 | Đăng ký + bộ đếm | 8 (chính), 1 (lưu khách tư vấn), 3 (lưu người chơi), 4 (lưu lịch hẹn) | `js/registrations.js` (chống trùng SĐT/email, hết chỗ → chờ, sự kiện đã qua → không nhận), `js/sheet-sync.js` (đồng bộ Google Sheet, đếm chung) | Dùng cho lead không gắn sự kiện (Đề 1, 3, 4); đếm công khai không cần Sheet | `lead-list.js` (có thể gộp vào `collection-store.js`) |
| 11 | Tìm kiếm / lọc | 4 (khớp FAQ), 2 và 9 (lọc lịch sử/shortlist, không bắt buộc) | Không có riêng. `js/popup.js`, `js/workspace.js` có chữ "filter" nhưng là giao diện của app, không dùng lại được | Khớp từ khóa tiếng Việt có bỏ dấu; xếp hạng điểm khớp đơn giản | `faq-match.js` |
| 12 | Chấm điểm / quiz / xếp hạng | 3 (timer 30s, điểm theo tốc độ, top 10), 5 (điểm /100 có trọng số) | Không có | Bộ đếm ngược theo câu có tự chuyển; công thức điểm (đúng + tốc độ); bảng xếp hạng có xử lý điểm bằng nhau; checklist có trọng số | `quiz-engine.js`, `score-checklist.js` |
| 13 | Ngân sách / tính toán | 7 (CTR, CPC, CPA), 9 (3 mức ngân sách), 1 (lọc theo ngân sách), 5 (trọng số) | `js/validators.js` có số, chưa có tính toán | Hàm tiền VND (định dạng, làm tròn); hàm chia an toàn; bảng khoảng ngân sách | `metrics.js` (dùng chung với Đề 7) |
| 14 | SEO checker / kiểm tra trang | 5 (chính) | `js/seo.js` là SEO cho trang của chính app, không phải công cụ kiểm tra URL ngoài | Phân tích HTML dán vào bằng `DOMParser` (title, meta description, viewport, favicon, h1); cảnh báo CORS và cách xử lý | `page-audit.js` |
| 15 | Upload ảnh | Không đề nào yêu cầu | `js/images.js`, `js/media-library.js`, `js/image-editor.js`, `js/ai-image.js` (có sẵn, không cần cho vòng 1) | Không cần thêm | (bỏ qua) |

Năng lực xuyên suốt (không nằm trong 15 mục trên nhưng đề nào cũng cần):
- **Nhãn AI / demo:** mọi kết quả mock phải ghi "mock" hoặc "kết quả demo"; đề 10 bắt buộc.
- **Dữ liệu localStorage an toàn:** try/catch quanh đọc/ghi (có thể bị chặn ở chế độ riêng tư); ghi giới hạn trong README.
- **Mobile 16px và không cuộn ngang:** Bảng A 5 điểm, Bảng B 10 điểm cho giao diện.
- **Escape nội dung người dùng:** dùng `textContent`, không chèn HTML thô (repo đã làm ở `landing-renderer.js`).

## 2. Module còn thiếu, theo mức ưu tiên

Ưu tiên cao (dùng cho ≥5 đề):
1. `form-schema.js`: khai báo trường (text/number/select/range/email/tel/url/date), kiểm tra, hiện lỗi, khóa bấm đôi. Dùng ở 1–10.
2. `ai-json.js`: gọi AI (hoặc mock), parse JSON, kiểm tra số lượng/khóa, thử lại 1 lần, rơi về mock và gắn nhãn. Dùng ở 1, 2, 3, 4, 5, 6, 8, 9, 10.
3. `collection-store.js`: CRUD có id, xóa theo id, giới hạn số bản ghi, bọc localStorage. Dùng ở 2, 3, 4, 5, 7, 8, 9.
4. `mock-ai.js`: bộ mock tất định (cùng input → cùng output) cho từng loại đầu ra, có nhãn. Cần để chạy offline khi API lỗi.
5. `metrics.js`: chia an toàn, CTR/CPC/CPA, VND, xu hướng tăng/giảm. Dùng ở 3, 5, 7, 9.

Ưu tiên trung bình:
6. `quiz-engine.js`: timer mỗi câu, tự chuyển khi hết giờ (tính sai), điểm theo đúng + tốc độ, top N. Dùng ở 3.
7. `export.js`: copy clipboard có fallback, dựng báo cáo text, CSV có BOM. Dùng ở 2, 5, 6, 7, 8, 9, 10.
8. `faq-match.js`: chuẩn hóa tiếng Việt (bỏ dấu, chữ thường), khớp theo từ khóa, trả về "không biết" khi điểm thấp. Dùng ở 4 (và 1 cho FAQ).
9. `chatbot-ui.js`: bong bóng chat, quick reply, chuyển sang form đặt lịch. Dùng ở 4.
10. `score-checklist.js`: checklist có trọng số → điểm /100 và danh sách đạt/chưa đạt. Dùng ở 5.

Ưu tiên thấp:
11. `preview-frame.js`: khung xem trước desktop/mobile, khung hộp thư cho email. Dùng ở 6, 8.
12. `timeslot.js`: sinh khung giờ, kiểm tra trùng. Dùng ở 4, có thể 8.
13. `page-audit.js`: phân tích HTML dán vào (DOMParser) cho đề 5; không fetch URL ngoài vì CORS.

## 3. Gợi ý thứ tự xây sẵn (nếu còn thời gian chuẩn bị)

1. `form-schema.js` + `collection-store.js` (nền cho hầu hết đề).
2. `ai-json.js` + `mock-ai.js` (để mọi đề có đường chạy khi không có API).
3. `metrics.js` + `export.js` (rẻ, dùng được nhiều).
4. `quiz-engine.js`, `chatbot-ui.js`, `faq-match.js`, `score-checklist.js` (cần cho các đề đặc thù).

Không cần xây trước: `preview-frame.js`, `timeslot.js`, `page-audit.js` (chỉ xây khi bốc đúng đề đó).

=================== FILE: prompts/00-README.md ===================
# Thư viện AGENT PROMPT cho vibe-sprint (60 phút)

Dành cho **coordinator** (Claude điều phối). Mỗi file `NN-*.md` = hướng dẫn tiếng Việt cho coordinator + một khối prompt trong ```` ``` ```` để copy, điền `{{...}}`, rồi gửi qua tool `Agent`. Thân prompt viết bằng tiếng Anh (agent Sonnet/Haiku bám lệnh kỹ thuật tốt hơn), nội dung hiển thị cho người dùng luôn là tiếng Việt.

## Chính sách: xả láng tài nguyên

- Khi chạy skill này, **token/usage KHÔNG phải ràng buộc**. Thời gian (60 phút) mới là ràng buộc duy nhất.
- **Tối đa hoá số agent Sonnet/Haiku 5.5 chạy song song**, không đặt trần cứng. Thông thường **8-15 agent đồng thời**: 1 agent/feature + shell + AI + data + deck + docs + 2-3 agent QA / second-opinion.
- **Mỗi prompt phải tự đủ ngữ cảnh** (đề, stack, file được sở hữu, port, tiêu chí nghiệm thu, cách verify). Agent không thấy hội thoại của bạn. Thà dài còn hơn thiếu.
- **Khuyến khích agent kiểm chứng thừa**: thêm agent "second opinion" review/QA cùng một feature, agent chụp ảnh độc lập, agent chạy lại test.
- **Re-spawn thay vì chờ**: agent im > 8 phút, chạy sai hướng, hoặc báo lỗi mơ hồ -> spawn agent mới (prompt đã sửa) song song, dùng kết quả nào xong tốt trước. Dùng `11-emergency.md`.
- **Coordinator chỉ điều phối**: viết spec, spawn, merge, chạy test tổng, push. Không tự code feature (trừ sửa xung đột merge / hotfix 1-2 dòng).
- Mỗi prompt template có dòng header: *"Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt."*

## CẢNH BÁO: nhãn mô phỏng AI phải chép NGUYÊN VĂN từ đề/BTC

- Câu `Bản demo vòng loại - Dữ liệu mô phỏng AI` là câu của **vòng loại**. Starter đặt sẵn câu này làm mặc định trong `js/config.js` (`mockNotice`), **chung kết có thể khác, đừng giả định**.
- Coordinator đọc đề chung kết/thể lệ, tìm câu nhãn BTC yêu cầu và **chép nguyên văn từng chữ, từng dấu** vào biến `{{MOCK_NOTICE}}` của mọi prompt (shell, AI, feature, QA, docs, deck). Chưa tìm thấy/chưa hỏi được: dùng `Dữ liệu mô phỏng AI` và ghi chú "chưa xác nhận wording BTC" trong `docs/DECISIONS.md`.
- Chỉ **một nơi** được đặt câu này: `mockNotice` trong `js/config.js` (do shell agent sửa). Không ai khác hardcode câu nhãn vào JS/HTML/CSS. Đổi câu thì phải sửa luôn hai dòng assert trong `tests/smoke.cjs` (tìm `Bản demo vòng loại`), README, bảng kiểm thử, slide.
- Mọi kết quả mock phải hiển thị cạnh nhãn này (dùng `EP.ai.noticeHtml(result)`, chân trang tự hiện khi ở chế độ mock).

## Bản đồ prompt theo pha

| Phút | Pha | File | Model | Ghi chú |
|---|---|---|---|---|
| 0-5 | Spec | `01-spec-from-de.md` | Sonnet (coordinator tự làm) | đề -> `docs/spec-nhanh.md`, chia feature, acceptance, kế hoạch data |
| 5-8 | Spawn đợt 1 | 02, 03, 04, 05, 07, 08 | xem dưới | gửi TẤT CẢ trong một message (song song) |
| 8-35 | Build | `02-feature-agent.md` x N | Sonnet | mỗi feature 1 agent, 1 worktree |
| 8-25 | Shell/brand | `03-shell-brand-agent.md` | Sonnet | |
| 8-25 | AI | `04-ai-agent.md` | Sonnet | |
| 8-20 | Data demo | `05-data-demo-agent.md` | Haiku | |
| 20-45 | Deck | `07-deck-agent.md` | Sonnet | cần app đã merge một phần để chụp ảnh; dựng khung từ phút 8 |
| 8-50 | Docs | `08-docs-agent.md` | Haiku | điền số liệu thật sau QA |
| 30-45 | QA | `06-qa-agent.md` x 2-3 | Haiku/Sonnet | chạy trên nhánh đã merge; chia theo nhóm feature / viewport |
| 35-45 | Merge + deploy | `09-merge-deploy.md` | coordinator | |
| 45-55 | Polish | `10-polish-agent.md` x 2-3 | Sonnet | chia theo view |
| bất kỳ | Cấp cứu | `11-emergency.md` | Sonnet | |
| 55-60 | Nộp | `09-merge-deploy.md` mục cuối | coordinator | kiểm tra link, nộp |

## Chọn model

- **Sonnet**: feature, UI, integration, AI module, deck, polish, QA cần sửa bug logic.
- **Haiku**: docs, demo data, sửa nhỏ (copy, CSS 1-2 chỗ), QA chạy checklist + chụp ảnh + báo cáo.
- Không chắc -> Sonnet. Đang bị nghẽn -> thêm agent, không đổi sang model yếu hơn.

## Bảng port (mỗi agent một port riêng; KHÔNG BAO GIỜ dùng 8000)

Đây là bảng DUY NHẤT; `SKILL.md` và `references/02` dùng cùng số này.

| Port | Dành cho |
|---|---|
| 8211 | coordinator / bản merge chính |
| 8212 | 03 shell-brand |
| 8213 | 04 AI |
| 8214 | 05 data-demo |
| 8215-8216 | 10 polish #1..#2 |
| 8217-8224 | 02 feature F1..F8 |
| 8225 | 07 deck |
| 8226 | 08 docs (chụp minh chứng) |
| 8227-8229 | 06 QA #1..#3 |
| 8230 | 11 emergency / dự phòng |

Agent phải tự `kill` server của mình khi xong. Test hardcode port khác -> chạy bản copy tạm, không commit.

## Worktree vs sở hữu thư mục

- **Mặc định: `isolation: "worktree"`** cho mọi agent sửa code. Agent bắt đầu bằng `git reset --hard {{BRANCH}}` (nhánh gốc của coordinator), commit lên nhánh worktree của nó, KHÔNG push.
- **Chế độ không-commit** (khi coordinator tự merge thủ công, hoặc repo không cho worktree): bỏ `isolation`, giao mỗi agent một **thư mục sở hữu** riêng và ghi rõ "KHÔNG commit, KHÔNG git add; chỉ sửa file trong danh sách". Coordinator commit một lần sau khi gộp.
- Quy tắc sở hữu (ghi vào từng prompt). Cấu trúc thật của starter: `index.html`, `css/tokens.css`, `css/app.css`, `js/*.js`, `features/<tên>/feature.js`, `tests/smoke.cjs`, `tools/bump-version.cjs`.
  - Feature agent: chỉ `features/{{FEATURE_NAME}}/**`, `css/{{FEATURE_NAME}}.css` (nếu thật cần, trong `@layer components`), `tests/{{FEATURE_NAME}}.cjs` + MỘT dòng `<script src="features/{{FEATURE_NAME}}/feature.js">` (và một dòng `<link>` nếu có css riêng) trong `index.html`. Không sửa `js/*.js` chung, `css/app.css`, `tests/smoke.cjs`.
  - Shell agent: `index.html` (trừ dòng của feature), `js/config.js` (appName, tagline, prefix, **mockNotice**), `css/tokens.css` (preset/brand), `css/app.css`. KHÔNG sửa `js/app.js` trừ khi thật bắt buộc (nó đã tự dựng Tổng quan/Cài đặt từ `EP.register`).
  - AI agent: `js/ai-specs.js` (file mới: `EP.aiSpecs = { <tên>: { id, prompt, schema, mock } }`, nạp sau `js/mock.js` và trước `features/`), `docs/ai-prompts.md`, `tests/ai.cjs`. **Không sửa `js/ai.js`** (framework 3 chế độ đã đủ; gặp lỗi thì báo coordinator).
  - Data agent: `js/demo-data.js` (file mới: các `EP.demo.register(<collection>, { version, seed })`, nạp SAU `features/`, trước `js/app.js`, nên thắng bản demo tạm trong feature), `tests/demo.cjs`. Không sửa `js/demo.js`.
  - Deck agent: `deck/**` (chủ yếu `deck/deck.data.js`, `deck/assets/**`, `deck/out/**`). Docs agent: `docs/**`, `README.md`, `qa/**` chỉ đọc.
  - Polish/QA: chỉ file coordinator chỉ định, sửa nhỏ.

## Parallelism

- Trần cứng: không. Điển hình 8-15 đồng thời. Với 5 feature: 5 feature + shell + AI + data + deck + docs + 2 QA = 12.
- Gửi tất cả `Agent` call của một đợt **trong cùng một message** và `run_in_background: true`.
- Chỉ phụ thuộc thật mới tuần tự: QA/deck-chụp-ảnh cần code đã merge; docs số liệu cần QA xong.

## Thứ tự merge (xem chi tiết `09`)

1. data-demo (ít xung đột) -> 2. AI -> 3. shell-brand -> 4. feature F1..Fn (theo độ ưu tiên điểm chấm) -> 5. polish -> 6. docs/deck (thư mục riêng, hầu như không xung đột).
Điểm nóng xung đột: thẻ `<script>` trong `index.html`, dấu `}` trong `css/*.css`, danh sách đăng ký feature, `?v=` cache bust.

## Mẫu phrasing đã chứng minh hiệu quả (từ phiên điều phối thật)

- Mở đầu mỗi prompt: tên repo + stack + cách chạy (`python3 -m http.server <port>`), "FIRST run `git reset --hard <branch>`". Thứ tự nạp script của starter: config, version, core, ui, form, charts, export, ai, demo, mô-đun (mock, metrics, match, calc, checklist, quiz, chat, timeslot), ai-specs, features, demo-data, app.
- "Serve from YOUR worktree root (never port 8000; kill when done)".
- Nêu rõ vùng cấm: "Do NOT touch X; another agent is changing Y".
- Verify: `node tests/smoke.cjs http://localhost:<port>/ --shots <thư-mục>` + Playwright chụp 1440x900 và 390x844, **tự mở ảnh ra xem**, không tràn ngang, không lỗi console.
- Chạy test cụ thể bằng lệnh đầy đủ; "update tests only if selectors you intentionally changed break them".
- "Check CSS brace balance" và `node --check` mọi JS; trước push coordinator chạy `node tools/bump-version.cjs` và `node scripts/scan-secrets.mjs .`.
- Kết thúc: "Commit on your worktree branch, message ending with trailer lines below. Do NOT push or bump version. Report briefly: files changed, verified vs not verified, test results."
- Trailer commit (điền theo system-reminder của phiên hiện tại):
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  ```

## Biến chung

`{{DE_SO}}` số đề, `{{DE_TEXT}}` nguyên văn đề, `{{REPO}}` đường dẫn repo tuyệt đối, `{{BRANCH}}` nhánh gốc, `{{PORT}}`, `{{FEATURE_NAME}}`, `{{FEATURE_DESC}}`, `{{ACCEPTANCE}}`, `{{APP_NAME}}`, `{{BRAND_COLORS}}`, `{{SESSION_URL}}`, `{{OWNED_PATHS}}`, `{{COMMIT_MODE}}` (`commit-on-worktree` | `no-commit`), `{{MOCK_NOTICE}}` (câu nhãn mô phỏng chép NGUYÊN VĂN từ đề/BTC, xem cảnh báo ở trên), `{{FEATURE_LIST}}`, `{{DOMAIN}}`, `{{AI_USES}}`, `{{SCHEMAS}}`, `{{QA_SCOPE}}`, `{{POLISH_SCOPE}}`, `{{PITCH_MINUTES}}`, `{{SLIDE_COUNT}}`, `{{LIVE_URL}}`, `{{REPO_URL}}`, `{{TEAM}}`, `{{TRANSCRIPT_PATH}}`, `{{MINUTES}}`, `{{OLD_BRANCH}}`, `{{ACCEPTANCE_MIN}}` (chỉ ở `11-emergency.md`), `{{REPO_SLUG}}`, `{{BRANCH_LIST}}` (chỉ ở `09-merge-deploy.md`).

## Khối chuẩn chèn vào mọi prompt (đã có sẵn trong từng file)

```
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
```

=================== FILE: prompts/01-spec-from-de.md ===================
# 01 - Spec từ đề (coordinator tự làm, <= 5 phút)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Dùng khi vừa nhận đề. Coordinator (Sonnet) đọc prompt này như self-prompt, KHÔNG spawn agent. Kết quả: `docs/spec-nhanh.md` (mẫu có sẵn ở `templates/spec-nhanh.md`, `scripts/new-project.sh` đã chép vào `docs/`) và bảng chia việc để điền vào 02-08. Nếu muốn second opinion: spawn song song 1 agent Sonnet với cùng prompt rồi so sánh (rẻ, nhanh).

```
You are the coordinator of a 60-minute contest sprint. Time budget for this step: 5 minutes. Output files only; no app code.

INPUT
- Contest brief (verbatim): {{DE_TEXT}}   (Đề số {{DE_SO}})
- Starter kit (already copied into {{REPO}} by scripts/new-project.sh; source skills/vibe-sprint/starter/) = vanilla JS, window.EP namespace, no build. Plug-in pattern: clone features/_example -> features/<name>/feature.js and call EP.register({id,label,title,desc,icon,order,summary(),actions(),render(el)}); data via EP.collection(name); forms via EP.form.render/bind; tables via EP.ui.table; charts via EP.charts.bar/line/donut; demo data via EP.demo.register(name,{version,rows|seed}) (?demo=1 reseeds); export via EP.export.csv/backup/print; AI via EP.ai.generate({prompt,schema,mock},{input}); tests/smoke.cjs. Presets: xclipse (default) or lucian via <html data-preset>.
- Brand kit: skills/vibe-sprint/brand/ (Xclipse colors, voice, logos, industry photo album). Deck kit: skills/vibe-sprint/deck/ (data-driven deck.html). Docs templates: skills/vibe-sprint/templates/ (already in docs/ of the project).
- MOCK NOTICE: the exact wording must be copied VERBATIM from the finals brief/organizer. "Bản demo vòng loại - Dữ liệu mô phỏng AI" was the QUALIFIER wording only. Quote the finals wording in the spec (section AI); if the brief does not say, write "Dữ liệu mô phỏng AI" and flag it as unconfirmed.

DO
1. Read the brief twice. List every explicit requirement (R1..Rn), every scoring criterion, and the prohibited/required items (e.g. must use AI, must have demo video, deadline, format). Quote them.
2. Decide the product in ONE sentence: "{{APP_NAME}} giúp <ai> <làm gì> để <kết quả đo được>". Choose a Vietnamese app name and the look: default is preset xclipse (Ice #DBF2FC / Navy #072D59 / Coral #FD6E88, see brand/01-bo-nhan-dien-xclipse.md); only pick lucian or custom brand colors (hex, light+dark) if the domain clearly needs it. Font: Be Vietnam Pro + system fallback.
3. Split into 3-6 features (max 8). For each: FEATURE_NAME (kebab-case), one-line description, user-visible screens, data it reads/writes (EP.collection name), which scoring criterion it earns, priority (P0 must ship / P1 / P2), and 3-5 ACCEPTANCE checks that are mechanically testable (selector or visible text + expected result), e.g. "Submit empty form -> 3 red errors with Vietnamese text; fill sample -> success toast and row appears in table".
4. Cross-cutting: shell (nav, home/landing view, brand), AI (what 1-3 AI interactions, mock output examples, Gemini optional), demo data plan (entities, counts 8-30 rows, realistic Vietnamese names/places/amounts, 2-3 edge cases such as overdue / empty / very long text), charts needed (which numbers), export needed (CSV/PDF/print).
5. Port + owner table: use the fixed port table from prompts/00-README.md (8211 coordinator; 8212 shell, 8213 AI, 8214 data, 8215-8216 polish; 8217-8224 features F1..F8; 8225 deck, 8226 docs, 8227-8229 QA, 8230 emergency; NEVER 8000) and the owned paths from the same file (no overlaps). List conflict hotspots (index.html script tags, css braces).
6. Demo flow: a 3-minute story script outline (5 beats) that touches every P0 feature.
7. Risks and cut-lines: what to drop first if behind at minute 35 / 45 / 55.

WRITE `docs/spec-nhanh.md` (Vietnamese, <= 150 lines) with sections: Đề & tiêu chí chấm / Sản phẩm / Brand / Feature table / AI / Demo data / Chart & export / Port & sở hữu / Kịch bản demo / Cắt giảm. Then print a ready-to-paste table: FEATURE_NAME | PORT | OWNED_PATHS | ACCEPTANCE.
Do not ask questions; make reasonable assumptions and write them under "Giả định".
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
```

**Sau bước này**: đọc lại `docs/spec-nhanh.md` 30 giây, sửa nếu thiếu yêu cầu bắt buộc của đề, rồi spawn đợt 1 (02-05, 07, 08) trong một message.

=================== FILE: prompts/02-feature-agent.md ===================
# 02 - Feature agent (mỗi feature một agent, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn: `Agent(subagent_type:"general-purpose", model:"sonnet", isolation:"worktree", run_in_background:true, description:"Feature {{FEATURE_NAME}}")`. Một message chứa tất cả feature agent. Điền toàn bộ `{{}}` từ `docs/spec-nhanh.md` (`{{MOCK_NOTICE}}` = câu nhãn chép nguyên văn từ đề/BTC; xem cảnh báo ở `00-README.md`, không dùng câu vòng loại nếu đề chung kết khác). Port theo bảng ở 00 (feature F1..F8 = 8217-8224). Muốn second opinion: spawn thêm 1 agent cùng feature với port khác và chọn bản tốt hơn.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP namespace, no build step). FIRST run `git reset --hard {{BRANCH}}`. Serve with `python3 -m http.server {{PORT}}` from YOUR worktree root (never port 8000; kill the server when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT (self-contained)
Contest: Đề {{DE_SO}}. App "{{APP_NAME}}". Brief summary: {{DE_TEXT}}. UI text is Vietnamese (with diacritics), code/comments English. Look: use ONLY the CSS variables from css/tokens.css (preset set by the shell agent; never hard-code colors; must work in light and dark).
MOCK NOTICE (verbatim from the organizers, do NOT retype or paraphrase it; it lives in js/config.js `mockNotice` and is shown by EP.ai.noticeHtml(result)): "{{MOCK_NOTICE}}".

YOUR FEATURE: {{FEATURE_NAME}} - {{FEATURE_DESC}}
ACCEPTANCE (all must pass and be verified by you):
{{ACCEPTANCE}}

OWNERSHIP
You own ONLY: features/{{FEATURE_NAME}}/** , tests/{{FEATURE_NAME}}.cjs, and (only if you truly need extra CSS) css/{{FEATURE_NAME}}.css written inside `@layer components { ... }` and scoped under `.{{FEATURE_NAME}}-root`. Plus exactly ONE added line in index.html: `<script src="features/{{FEATURE_NAME}}/feature.js"></script>` inside the FEATURES block, before js/app.js (and one `<link rel="stylesheet" href="css/{{FEATURE_NAME}}.css">` after css/app.css if you made that css file). Do NOT edit js/*.js, css/app.css, css/tokens.css, tests/smoke.cjs, or other features' folders. Other agents are changing: shell/brand (index.html, js/config.js, css), AI specs (js/ai-specs.js), demo data (js/demo-data.js). If you need a shared helper that is missing, write it privately inside your folder and mention it in the report.

THE REAL STARTER API (read the sources, do not guess names)
- Register the tab: `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })` (id is also the URL hash `#/id`; one h1 per view is built by the router from `title`; `summary()` returns [{label,value,hint}] KPIs for the Tổng quan page; `actions()` returns HTML buttons next to the h1).
- Data: `var rows = EP.collection('<name>')` -> add/update/remove/get/list/count/clear/replace/onChange (stored in localStorage under the prefix from js/config.js; never hardcode a storage key).
- Forms: `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })` (rules: required, email, phone, url, minLength, maxLength, min, max, integer, date, pattern, custom).
- Tables: `EP.ui.table(el, { columns, rows, actions, onAction })`; dialogs `EP.ui.dialog / EP.ui.confirm / EP.ui.toast`; always `EP.esc()` any user/AI text put into innerHTML.
- Charts: `EP.charts.bar / line / donut(el, [{label, value}])`. Export: `EP.export.csv(name, rows, cols)`, `EP.export.print()`.
- AI: ONLY via `EP.ai.generate(spec, { input })` where spec = EP.aiSpecs.<name> written by the AI agent (contract: {{AI_USES}}); render the result with `EP.ai.noticeHtml(result)` next to the output and `EP.ai.mountModePicker(el)` for the mode switch. Never call fetch/Gemini yourself. Until the AI agent's spec exists, define a local `AI_SPEC` in your feature exactly like features/_example (prompt, schema, mock) and switch to EP.aiSpecs.<name> when it lands.
- Demo data: `EP.demo.register('<collection>', { version: 1, seed: function () { return [...]; } })` with 3 rows is enough from you (the data agent registers the full set in js/demo-data.js later; its registration wins). `?demo=1` reseeds.

HOW
1. Read fully: features/_example/feature.js (clone this pattern exactly; the numbered map [1]..[6] at the top tells you what to change), js/core.js (EP.register/collection/router), js/form.js, js/ui.js, js/ai.js (read only), js/charts.js, js/export.js, js/demo.js, and the head comment of any optional module you use (js/mock.js, metrics.js, match.js, calc.js, checklist.js, quiz.js, chat.js, timeslot.js), plus tests/smoke.cjs.
2. `cp -r features/_example features/{{FEATURE_NAME}}`; in the copy change NAME ('example' -> '{{FEATURE_NAME}}'), the collection name, SCHEMA, COLUMNS, AI_SPEC/EP.aiSpecs reference, and the demo seed; remove everything of the example you do not need. Ids/classes you add are prefixed `{{FEATURE_NAME}}-`.
3. Implement the screens: list/table with empty state, create/edit form with validation, delete with EP.ui.confirm, search/filter if relevant, a chart or KPI strip if the spec says so, export button if spec says so. Include loading/empty/error states.
4. Responsive: works at 390x844 and 1440x900, no horizontal overflow, tap targets >= 40px, keyboard focusable, visible focus ring, labels on inputs.
5. Verify with Playwright (`require('playwright')`, or `require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`, chromium.launch()): open http://localhost:{{PORT}}/?demo=1, go to `#/{{FEATURE_NAME}}`, walk through EVERY acceptance item, take screenshots at 1440x900 and 390x844 in light and dark, then OPEN the screenshots and LOOK at them (layout, clipping, contrast, Vietnamese diacritics). Fix what you see. Assert zero console errors / page errors.
6. Run `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-{{FEATURE_NAME}}` until green (shots dir is gitignored; do not commit screenshots). Write tests/{{FEATURE_NAME}}.cjs (URL from argv, same Playwright loader as tests/smoke.cjs) that asserts your acceptance items; run it. If smoke.cjs fails only on the mock-notice assertion because js/config.js `mockNotice` was changed by the shell agent, report it, do not edit smoke.cjs.
7. Check JS syntax (`node --check features/{{FEATURE_NAME}}/feature.js`) and CSS brace balance for any CSS you wrote.

GIT ({{COMMIT_MODE}})
- commit-on-worktree: commit on your worktree branch, message ending with the trailer lines:
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  Do NOT push, do NOT bump version.
- no-commit: do not commit or `git add`; leave changes in the working tree.

REPORT (brief, <= 15 lines): files changed; each acceptance item PASS/FAIL; what you VERIFIED (screenshots looked at, tests run with result) vs what you did NOT verify; any shared-file edit you wanted but did not make; known issues.
```

=================== FILE: prompts/03-shell-brand-agent.md ===================
# 03 - Shell + Brand agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn đợt 1, port 8212. Agent này là chủ của `index.html`, `js/config.js` (gồm câu nhãn mock), `css/tokens.css`, giao diện/preset. Tab tự dựng từ `EP.register` nên feature agent chỉ thêm một dòng script; merge shell trước feature. Điền `{{MOCK_NOTICE}}` bằng câu nhãn chép NGUYÊN VĂN từ đề/BTC (xem cảnh báo ở `00-README.md`).

```
Repo: {{REPO}} (vanilla JS, window.EP, no build). FIRST run `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}
Product: "{{APP_NAME}}" - {{FEATURE_DESC}}. Brand/look: {{BRAND_COLORS}} (default = preset xclipse: Ice #DBF2FC / Navy #072D59 / Coral #FD6E88; alternative preset lucian). Vietnamese UI.
Planned features (tabs, in order): {{FEATURE_LIST}}.
MOCK NOTICE (copied VERBATIM from the organizers' brief by the coordinator; never retype, paraphrase or "improve"): "{{MOCK_NOTICE}}".
The starter is already in the repo root (copied from skills/vibe-sprint/starter/). Brand kit for reference: skills/vibe-sprint/brand/ (01-bo-nhan-dien-xclipse.md, 02-giong-dieu-va-noi-dung.md, logo-light.jpg / logo-dark.jpg, album/ industry hero photos, xclipse-ui-ux-*.html samples).

YOU OWN: index.html (everything except the one-line <script>/<link> additions of feature agents), js/config.js, css/tokens.css, css/app.css (brand/layout only), assets/** (logo/favicon). Do NOT touch features/*/ (other agents), js/ai.js, js/demo.js, js/core.js, js/app.js (it already builds the Tổng quan + Cài đặt views from EP.register; only if truly broken, report instead of editing), deck/, docs/.

TASKS
1. js/config.js: set appName, brandMark (1 char), tagline, prefix (localStorage key prefix; the theme choice is always stored under the literal key 'ep_theme' by js/core.js and the inline script in <head>, so leave that key alone), defaultRoute, defaultAiMode ('mock'), and `mockNotice` = the VERBATIM string given above. Then update the two assertions in tests/smoke.cjs that compare against the qualifier string 'Bản demo vòng loại - Dữ liệu mô phỏng AI' (grep for it) so they compare with the new notice; this is the only smoke.cjs edit allowed. Also update <title> and <meta description> in index.html; grep the starter's old name ('Tên ứng dụng') to make sure none remains.
2. Look: keep data-preset="xclipse" on <html> unless the spec says otherwise (lucian = alternative). A different brand: edit the xclipse block in css/tokens.css in ALL THREE places (light, dark via prefers-color-scheme, manual dark via data-theme). Token NAMES stay unchanged so features keep working. Verify AA contrast for text/buttons in light and dark. Fonts: system stack or the optional Be Vietnam Pro link already in index.html (commented; it needs network, the demo must work offline).
3. Tabs come from EP.register in each feature (router builds nav, sections, h1, KPI on Tổng quan). Do not hard-code feature internals in index.html. Check the nav at 390px (scrolls horizontally, active pill moves) and that Tổng quan (#/home) and Cài đặt (#/settings) look designed: hero copy via cfg.tagline, KPI strip, 3-4 step stepper, shortcut cards. If you want a custom hero/landing look, do it with CSS in css/app.css (@layer components) and brand assets, not by rewriting js/app.js.
4. Remove `features/_example` and `features/_playground` (folders AND their two <script> lines) only when the coordinator tells you real features have merged; until then keep them so smoke.cjs still has a target.
5. Prepare stubs so other agents have a place to plug in, in this order inside index.html: after the optional modules add `<script src="js/ai-specs.js"></script>` (create js/ai-specs.js containing `window.EP = window.EP || {}; EP.aiSpecs = EP.aiSpecs || {};`); then the commented "FEATURES" block, one `<script src="features/<name>/feature.js"></script>` per line, alphabetical; then `<script src="js/demo-data.js"></script>` (create js/demo-data.js as an empty IIFE stub with a comment) ; then `<script src="js/app.js"></script>` LAST. Add `shots*/` and `qa/` to .gitignore if not present.
6. Demo pill: when the URL has ?demo=1 the framework reseeds and removes the param itself (js/demo.js); do not re-implement. A small "Dữ liệu mẫu" hint on Tổng quan is optional.

VERIFY
`node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-shell` until green, plus Playwright screenshots at 1440x900 and 390x844, light and dark, of #/home, #/settings and the nav on each existing route; OPEN and LOOK at them. No horizontal overflow, no console errors. Check CSS brace balance and `node --check` for JS you touched.

GIT ({{COMMIT_MODE}}): commit on worktree branch ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
Do NOT push or bump version.
REPORT briefly: files changed, the final mockNotice string now in js/config.js, the script-tag order in index.html, verified vs not verified, test results.
```

=================== FILE: prompts/04-ai-agent.md ===================
# 04 - AI agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8213. Starter đã có sẵn lớp AI hoàn chỉnh `js/ai.js` (`EP.ai.generate`, 3 chế độ mock / gemini / paste, kiểm tra schema, đổi model, rơi về mock). Việc của agent này là viết **đặc tả AI cho từng tương tác** (prompt + schema + mock chất lượng cao) trong file mới `js/ai-specs.js`, KHÔNG viết lại `ai.js`. Điền `{{AI_USES}}` = danh sách 1-3 tương tác AI từ spec (tên spec, input, output JSON). Feature agent chỉ gọi `EP.ai.generate(EP.aiSpecs.<tên>, { input })` nên **chốt tên + input + schema trong spec trước** và dán vào prompt feature. Mock phải đủ tốt để demo thắng điểm; Gemini là tuỳ chọn khi có key.

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}" ({{FEATURE_DESC}}). Domain: {{DOMAIN}}. Judges must SEE AI value in the demo, with no network and no API key, and also be able to switch to real Gemini or copy-paste mode (both already implemented in js/ai.js).
MOCK NOTICE: the exact wording comes VERBATIM from the organizers' brief and is already set (or will be set by the shell agent) in js/config.js `mockNotice`: "{{MOCK_NOTICE}}". Never hardcode, retype or paraphrase it anywhere; always show it through EP.ai.noticeHtml(result) / EP.ai.MOCK_NOTICE. (The qualifier-round wording was "Bản demo vòng loại - Dữ liệu mô phỏng AI"; do NOT assume the finals use it.)

YOU OWN ONLY: js/ai-specs.js (the shell agent creates a stub `EP.aiSpecs = EP.aiSpecs || {}`; fill it), tests/ai.cjs (new) and docs/ai-prompts.md (new). Do NOT edit js/ai.js (read it fully; if you find a real bug, report it with a repro instead), features/*, index.html (the shell agent already added the script tag; if missing add exactly ONE line `<script src="js/ai-specs.js"></script>` after the optional modules and before the features), css.

THE REAL API (js/ai.js; do not invent names)
- `EP.ai.generate(spec, { input, mode?, key?, model?, instant?, fallbackToMock?, onSwitch? })` -> Promise<{ data, mode, model, notice, warnings, prompt }>. mode defaults to the user's choice in Cài đặt ('mock' | 'gemini' | 'paste').
- spec = { id, prompt: function (input) -> string | string, schema, mock: function (input) -> object, temperature? }. The framework appends the JSON-shape instructions and the "do not invent numbers/names" line to the prompt automatically, then validates/coerces the result against `schema`, retries once on a bad shape, and falls back to spec.mock with a warning.
- schema types: string{min,max,enum,optional}, number{min,max,integer}, boolean, array{of,min,max}, object{props}; every field is required unless optional:true.
- Rendering: `EP.ai.noticeHtml(result)` (mock -> the MOCK_NOTICE pill; gemini/paste -> "kiểm tra lại" note), `EP.ai.mountModePicker(el)`, `EP.ai.mountSettings(el)` (already used in the Cài đặt view), `EP.ai.getMode()`, `EP.ai.validate(value, schema)`, `EP.ai.extractJson(text)`.
- Gemini key: entered by the user in Cài đặt, kept in page memory (localStorage only if they tick "Nhớ key"); sent in header x-goog-api-key; model list/fallbacks in EP.ai.MODELS / FALLBACKS (default gemini-3.6-flash; list: 3.6 Flash, 3.8 Flash, 4 Hydrogen — no Lite, no Pro). Never log, commit or hard-code a key.
- Helpers for mocks (js/mock.js): EP.mock.hash / rng / pick / pickN / keywords / sentiment / classify / template; (js/match.js) EP.text.normalize, EP.match.faq / search; (js/metrics.js) EP.metrics.*.

AI INTERACTIONS TO PROVIDE (keep these exact spec names, input shapes and schemas; they are the contract for feature agents):
{{AI_USES}}

TASKS
1. Read js/ai.js and features/_example/feature.js ([4] AI_SPEC) fully, plus js/mock.js. Extend by adding specs, never rewrite the framework.
2. For each interaction write `EP.aiSpecs.<name> = { id, prompt, schema, mock, temperature }`: prompt in Vietnamese (role, domain, input fields interpolated from `input`, length limits; exact facts such as dates, prices, names always come from the input/form, the AI only writes text), a strict schema with enum/min/max, and a mock that is deterministic for the same input (seed with EP.mock.hash(JSON.stringify(input))) yet varied across inputs: 3+ distinct phrasings, REALISTIC for the domain (real-sounding Vietnamese terms, plausible numbers/units), echoing the user's actual input values, no lorem ipsum, no English leaks, no clichés. The framework already adds the 450-800ms fake latency and the notice; do not add your own.
3. Put the same prompts (as readable text, with the schema and one good/bad example) in docs/ai-prompts.md; the docs agent reuses it as "minh chứng AI".
4. Safety/UX: text inserted into innerHTML must go through EP.esc; empty-input guard messages in Vietnamese belong to the feature form (EP.form rules), mention them to the feature agents in your report.

VERIFY
Write tests/ai.cjs (node + Playwright; URL from argv, same loader as tests/smoke.cjs): in the page call `EP.ai.generate(EP.aiSpecs.<name>, { input, mode: 'mock', instant: true })` with 3 different inputs per spec, assert the result passes `EP.ai.validate(..., spec.schema).ok`, assert same input -> same output, different inputs -> different outputs, assert Vietnamese diacritics present, assert `EP.ai.noticeHtml(result)` contains `EP.ai.MOCK_NOTICE`, and assert a Gemini call with an invalid key (route the fetch to 400) degrades to mock with a warning. Screenshot the notice pill (light/dark, 390 and 1440) in a feature that uses it and LOOK. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` and tests/ai.cjs until green.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push, no version bump.
REPORT briefly: API contract (function signatures), files, verified vs not, test results.
```

=================== FILE: prompts/05-data-demo-agent.md ===================
# 05 - Data demo agent (Haiku)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8214. Starter đã có `js/demo.js` (`EP.demo.register(collection, { version, rows | seed })`, tự nạp ở lần mở đầu, `?demo=1` nạp lại từ đầu, nút "Nạp lại dữ liệu demo" ở Cài đặt gọi `EP.demo.reset()`). Agent này viết dữ liệu demo đầy đủ trong file mới `js/demo-data.js` (nạp SAU các feature, TRƯỚC `js/app.js`, nên bản đăng ký của nó thắng bản 3 dòng tạm của feature agent). Cần schema từng feature (tên collection `EP.collection('<tên>')`, trường) -> lấy từ bảng feature trong `docs/spec-nhanh.md` và dán vào `{{SCHEMAS}}`. Nếu feature agent đổi schema, báo coordinator sửa lại ở bước merge (hoặc spawn lại agent này sau merge).

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}", domain {{DOMAIN}}. Opening the app must show realistic Vietnamese demo data on the first visit, and `?demo=1` reseeds it, so judges see a living product in 1 click.

YOU OWN ONLY: js/demo-data.js (the shell agent creates an empty stub and the script tag after features and before js/app.js; if the tag is missing add exactly ONE line), tests/demo.cjs (new). Do NOT edit js/demo.js, features/*, css, js/ai.js.

HOW THE STARTER SEEDS (read js/demo.js fully): `EP.demo.register('<collection>', { version: 1, seed: function () { return [ {...}, ... ]; } })` (or `rows: [...]`). Every row gets id 'demo<N>', createdAt and `_demo: true` automatically. First visit with an empty collection -> seed; raising `version` reseeds ONLY if the user has not edited/added rows (rows still flagged _demo); `?demo=1` in the URL wipes that collection and reseeds; the user's own rows are never overwritten silently. `EP.demo.reset()` = force reseed of all registered collections. Raise `version` whenever you change the data.

SCHEMAS (collection name -> fields) you must fill:
{{SCHEMAS}}

TASKS
1. Read js/demo.js, features/_example/feature.js ([3] demo) and each real feature's SCHEMA/collection name. One `EP.demo.register` per collection, in js/demo-data.js.
2. Produce realistic data: 12-30 rows per main entity. Real-sounding Vietnamese full names (mixed regions), real districts/cities (no real private persons or real phone numbers: use obviously fake patterns like 0901234567 or example.com emails), plausible amounts in VND, dates generated relative to today with new Date() (store as YYYY-MM-DD; last 30 days plus a few future items; use EP.fmt.today() style local dates), mixed statuses (done / in progress / overdue / cancelled), 2-3 edge cases (very long name, empty optional field, zero value) and one "hero" record that is perfect for the demo script.
3. Time series for charts: 30 days with a believable trend (weekly seasonality, one spike, one dip), not random noise; use a seeded rng (EP.mock.rng('seed')) so reloading gives the same numbers.
4. Consistency: values must satisfy the feature's SCHEMA rules (EP.form would accept them), foreign keys valid, totals add up, no duplicate ids, sorted sensibly, Vietnamese diacritics correct (NFC).

VERIFY
Playwright: open http://localhost:{{PORT}}/?demo=1 at 1440x900 and 390x844, visit every route (`#/<id>`), screenshot and LOOK: no `undefined`/`NaN`/`[object Object]`/English placeholders, no overflow from long names, charts non-empty. tests/demo.cjs asserts counts per collection (`EP.collection(name).count()`) and no NaN text on each route. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` too.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly (<= 10 lines): entities x counts, files, verified vs not, test results.
```

=================== FILE: prompts/06-qa-agent.md ===================
# 06 - QA agent (Haiku checklist / Sonnet nếu cần sửa logic)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Chạy trên **nhánh đã merge** (sau bước merge đầu tiên). Spawn 2-3 agent song song, chia theo `{{QA_SCOPE}}`: (a) nhóm feature A + viewport 390, (b) nhóm feature B + viewport 1440, (c) second-opinion toàn app light/dark + a11y. Port 8227-8229 (QA #1..#3). Haiku cho checklist + sửa lỗi nhỏ; Sonnet khi bug cần hiểu logic.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP). FIRST `git reset --hard {{BRANCH}}` (the merged integration branch). Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
App "{{APP_NAME}}" for contest Đề {{DE_SO}}. Spec: read `docs/spec-nhanh.md` (acceptance per feature). Your scope: {{QA_SCOPE}}.
MOCK NOTICE: the exact string in js/config.js `mockNotice` must equal the organizers' wording given by the coordinator: "{{MOCK_NOTICE}}" (verbatim; the qualifier wording was "Bản demo vòng loại - Dữ liệu mô phỏng AI"). Check it appears in the footer (#ft-notice, mock mode) and next to every AI output, in README/docs/slides, and that tests/smoke.cjs asserts the same string.

DO
1. Run `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-qa-{{PORT}}` and every tests/*.cjs relevant to your scope (they take the URL from argv; if one hardcodes a port, run a temp copy pointed at {{PORT}} and delete it; never commit port edits). Record PASS/FAIL per test.
2. Per feature in scope, with `?demo=1` AND with empty storage: walk every ACCEPTANCE item from the spec by Playwright, assert it, and record result. Test: submit empty form (errors in Vietnamese, focus on first invalid), invalid formats, very long text, double-click submit, delete then undo/confirm, refresh persists, export works (file non-empty), AI buttons show the notice pill, back/forward, hash routes, unknown route.
3. Screenshots at 1440x900 and 390x844, light AND dark, for each view. OPEN them and LOOK. Check: horizontal overflow (document.scrollingElement.scrollWidth <= innerWidth), clipped/overlapping text, low contrast, broken diacritics, `undefined`/`NaN`/`[object Object]`, English leftovers, stuck skeletons, layout shift, tap targets < 40px, missing focus ring, console/page errors, failed network requests (404 for assets).
4. FIX small bugs yourself (CSS tweaks, copy typos, missing label, off-by-one, null guard) with minimal diffs in the file that owns them. Do NOT refactor, do NOT change features' behavior, do NOT touch files outside what is needed. For bugs > 15 minutes or touching shared architecture: do not fix; report with repro steps.
5. Re-run the failing checks after each fix until green.
6. Write results to `qa/{{PORT}}-report.md` (table: check | viewport | theme | result | evidence screenshot path | note). Real results only: never write PASS for something you did not run. This file feeds the docs agent's docs/BANG-KIEM-THU.md.

GIT ({{COMMIT_MODE}}): commit only the fixes + qa report on worktree branch, message ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: counts (checks run / pass / fail / fixed), list of unfixed bugs with repro, verified vs not verified.
```

=================== FILE: prompts/07-deck-agent.md ===================
# 07 - Deck agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8225. Bắt đầu sớm với nội dung chữ (từ spec); phần chụp ảnh chạy sau khi app đã merge/ổn định (spawn lần 2 hoặc gửi `send_message` tiếp). Chủ của `deck/`. Nếu cần bản 2: spawn song song 1 agent thiết kế lại cho second opinion.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve the APP with `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}": {{FEATURE_DESC}}. Features: {{FEATURE_LIST}}. Brand/look {{BRAND_COLORS}} (brand kit: skills/vibe-sprint/brand/; deck accent via meta.accent / meta.accent2). Mock notice, if the deck mentions it, must be the organizers' VERBATIM wording: "{{MOCK_NOTICE}}" (the qualifier wording "Bản demo vòng loại - Dữ liệu mô phỏng AI" must not be assumed for the finals). Deck language: Vietnamese. Presentation time: {{PITCH_MINUTES}} minutes, so ~{{SLIDE_COUNT}} slides.

YOU OWN ONLY: `deck/` in the project root (the coordinator copies it from skills/vibe-sprint/deck/ with `cp -r`): your data file `deck/deck.data.js` (create from `deck/template.data.js`), `deck/tools/capture.json` (from capture.example.json), `deck/assets/**`, `deck/out/**` (git-ignored). Do NOT edit deck.html or deck/tools/*.cjs (layout is fixed; you only edit data), and do NOT touch app code.

DECK KIT: data-driven deck.html (content lives in deck.data.js, 12 slide types: cover, problem, solution, features, demo, flow, ai, quality, metrics, roadmap, team, thanks), tools/capture.cjs (screenshots of the live app), tools/export.cjs (PDF/PNG/PPTX). Read deck/README.md, template.data.js, example.data.js and both tools first. Preview: open deck/deck.html (it loads deck.data.js; `deck.html?data=example.data.js` shows the finished example).

TASKS
1. Fill `deck/deck.data.js` (the 12 numbered [1]..[12] fields of template.data.js) with a story arc that maps to the scoring criteria in docs/spec-nhanh.md, using the kit's slide order: cover / problem / solution / features (5) / flow / demo (url + image, QR auto-generated from meta.liveUrl) / ai (real vs mock vs controls; say honestly what is mock) / quality (rows from the real qa/*-report.md, or "chưa đo" if absent - never invent) / metrics (3-4 verifiable numbers) / roadmap / team / thanks. Max 12 slides, <= 25 words per slide body, one idea per slide, speaker `notes` in Vietnamese (20-30s per slide).
2. `cp deck/tools/capture.example.json deck/tools/capture.json`; set `base` to http://localhost:{{PORT}}/ and one `views` entry per feature (url like `index.html?demo=1#/<feature-id>`, optional `steps`/`selector`, `devices: ["desktop","mobile"]`). Run `node deck/tools/capture.cjs deck/tools/capture.json` (quick single shot: `node deck/tools/capture.cjs --url http://localhost:{{PORT}}/ --name home --mobile`). Images land in deck/assets/ (desktop 1600x1000; mobile `-m` 390x844). OPEN each PNG and LOOK: no console banners, no empty states, Vietnamese text sharp. Re-capture until good.
3. Open deck/deck.html in Playwright at 1920x1080, screenshot every slide, LOOK for overflow, orphan lines, low contrast, inconsistent spacing; fix data/CSS in deck/ only.
4. Run `node deck/tools/export.cjs` (uses deck.data.js; `--name <tên>`, `--scale 2` for 4K) -> deck/out/<name>.pdf and deck/out/png/slide-NN.png (and .pptx if pptxgenjs is installed in deck/); verify the PDF page count equals the slide count and the size is < 20MB; open slide PNGs 1 and 3 and LOOK.
5. Rehearse: press N in deck.html to see notes + timer; total target is {{PITCH_MINUTES}} minutes.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: slide list (titles), output paths (deck/deck.html, deck/deck.data.js, deck/out/*.pdf, deck/assets/*), verified vs not (which slides eyeballed), which fields are still placeholder.
```

=================== FILE: prompts/08-docs-agent.md ===================
# 08 - Docs agent (Haiku)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8226. Spawn sớm để dựng khung, spawn/gửi tiếp lần 2 khi QA xong để điền số liệu thật. Chủ của `README.md`, `docs/**`. `scripts/new-project.sh` đã chép sẵn mẫu vào dự án (README.md từ `README-du-thi.md`, `CLAUDE.md`, và `docs/spec-nhanh.md, PROGRESS.md, DECISIONS.md, BANG-KIEM-THU.md, MINH-CHUNG-AI.md, KICH-BAN-DEMO.md, HOI-DAP.md, CHECKLIST-CHUNG-KET.md`); agent điền vào các file đó, không tạo tên khác. Nguyên tắc cứng: **không bịa kết quả**.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}", live URL {{LIVE_URL}}, repo {{REPO_URL}}. Team: {{TEAM}}. Submission requirements are in docs/spec-nhanh.md (section "Đề & tiêu chí chấm").
MOCK NOTICE: README, docs and screenshots must quote the organizers' wording VERBATIM: "{{MOCK_NOTICE}}" (copy it, never retype or paraphrase; the qualifier wording "Bản demo vòng loại - Dữ liệu mô phỏng AI" must NOT be used unless the coordinator's {{MOCK_NOTICE}} is exactly that). Never write "AI thật" when the screenshot/test ran in mock mode. All documents in Vietnamese, professional, concise.

YOU OWN ONLY: README.md, docs/** (the template files are already there; fill them). Do NOT edit app code.

DELIVERABLES
1. README.md (from the README-du-thi template): tên, mô tả 1 câu, link demo, ảnh hero (use the team's own deck/assets/*.png from the deck agent, or capture your own; deck/example/assets/ holds only the Xclipse sample images, never use them for the contest app), tính năng (table feature -> lợi ích), cách chạy (`python3 -m http.server 8211` then open http://localhost:8211/ ; no build), kiểm thử (`node tests/smoke.cjs http://localhost:8211/`), công nghệ, cấu trúc thư mục (index.html, css/, js/, features/, tests/, tools/), AI (mock vs Gemini vs copy-dán + the verbatim notice), nhóm, giấy phép.
2. docs/BANG-KIEM-THU.md: table ID | Chức năng | Bước | Kết quả mong đợi | Kết quả thực tế | Đạt/Không | Ngày giờ. Source of truth: qa/*-report.md and the outputs of `node tests/smoke.cjs http://localhost:{{PORT}}/` and the other tests/*.cjs. RUN the tests yourself now and paste real counts. Rows you did not run must say "Chưa kiểm" - never PASS by assumption. Add summary line "X/Y đạt".
3. docs/MINH-CHUNG-AI.md: evidence of AI use. Source: docs/ai-prompts.md (prompt specs from the AI agent) and, if available, the session transcript (search for the prompts actually sent to the AI/agents; path given by coordinator: {{TRANSCRIPT_PATH}}; extract only prompts sent to AI, trimmed, no secrets/keys/personal data), plus screenshots of the AI feature in the app (mock notice visible). Format per docs/MINH-CHUNG-AI.md (template). Each item: mục đích / prompt (rút gọn) / kết quả / chỉnh sửa của nhóm.
4. docs/KICH-BAN-DEMO.md: script {{PITCH_MINUTES}} minutes: table Thời gian | Màn hình | Thao tác | Lời nói | Điểm nhấn (maps to scoring criterion). Include the exact click path, `?demo=1` URL, fallback if network fails (offline works), and a 20-second version.
5. docs/HOI-DAP.md: 15 likely judge Q&A (tính mới, tính khả thi, AI dùng ở đâu, dữ liệu thật hay mẫu, bảo mật, mở rộng, chi phí, so với đối thủ, hạn chế) with honest 2-3 sentence answers; admit mock data explicitly.
6. docs/CHECKLIST-CHUNG-KET.md is the day-of checklist: fill its `<...>` fields (product name, sample-data button name). Also create docs/CHECKLIST-NOP-BAI.md: each required file/link from the brief with status (đã có / thiếu) and path.

VERIFY
Check all internal links/paths exist (script it), screenshots referenced exist, no placeholder `{{...}}`/`<…>`/TODO left (`grep -rn '<…>\|{{\|TODO' README.md docs`), numbers match test outputs, Vietnamese diacritics intact. If PDF export of a doc is required, render and LOOK at page 1.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: files, which table rows are real vs "Chưa kiểm", missing inputs you need from the coordinator.
```

=================== FILE: prompts/09-merge-deploy.md ===================
# 09 - Merge + Deploy (checklist cho coordinator, không spawn)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Coordinator tự làm, hoặc giao một agent Sonnet "merge-helper" với prompt cuối trang khi nhiều nhánh. Chạy ở phút ~30-45 và lặp lại ở 55.

## A. Trước khi merge
- [ ] Mỗi agent đã báo cáo; đọc phần "verified vs not". Agent chưa verify -> spawn QA (06) hoặc re-spawn.
- [ ] `git branch -a` / danh sách worktree: ghi nhánh từng agent.
- [ ] Làm việc trên nhánh tích hợp `{{BRANCH}}` (sạch, `git status` không đổi).

## B. Thứ tự merge
1. data-demo -> 2. ai -> 3. shell-brand -> 4. feature theo ưu tiên P0 trước -> 5. polish -> 6. docs, deck.
Mỗi nhánh: `git merge --no-ff <branch>` (hoặc `git cherry-pick`), chạy `node tests/smoke.cjs http://localhost:{{PORT}}/` sau mỗi 1-2 nhánh (coordinator serve cổng 8211: `python3 -m http.server 8211`, không 8000).

## C. Điểm nóng xung đột và cách xử lý
| File | Triệu chứng | Cách xử lý |
|---|---|---|
| `index.html` thẻ `<script>` | cả hai phía thêm dòng cạnh nhau | giữ CẢ HAI, mỗi tag một dòng, đúng thứ tự: config, version, core, ui, form, charts, export, ai, demo, mô-đun (mock...timeslot), `js/ai-specs.js`, `features/*/feature.js`, `js/demo-data.js`, `js/app.js` CUỐI |
| `css/*.css` | dấu `}` lệch, block bị cắt | giữ cả hai block; sau merge chạy kiểm tra cân bằng ngoặc: `python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"` |
| `<script>` trùng của cùng một feature, `EP.register` trùng `id` | hai agent cùng tên tab | giữ MỘT dòng script; đổi `id` cho khác nhau (id là đường `#/id`, bản đăng ký sau thay bản trước) |
| `js/demo-data.js` / feature `EP.demo.register(..., { version })` | hai agent cùng bump | lấy số lớn hơn +1; bản trong `demo-data.js` thắng bản trong feature |
| `js/config.js` `mockNotice` | khác câu nhãn | luôn lấy câu NGUYÊN VĂN từ đề/BTC; khớp với assert trong `tests/smoke.cjs` |
| `?v=` cache bust, `js/version.js` | khác nhau | không sửa tay; chạy `node tools/bump-version.cjs` một lần (bước E) |
Marker conflict `<<<<<<<` còn sót: `grep -rn '^<<<<<<<\|^>>>>>>>' --include=*.{js,css,html,md,json,cjs} .` phải rỗng.

## D. Sau mỗi đợt merge
- [ ] `node --check js/*.js features/*/feature.js`; `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-merge`; chạy `node tests/<feature>.cjs http://localhost:{{PORT}}/` từng feature (và `tests/ai.cjs`, `tests/demo.cjs` nếu có).
- [ ] Playwright: mở `?demo=1`, đi qua mọi route ở 1440x900 và 390x844, chụp và XEM; không lỗi console.
- [ ] Nếu đỏ: gửi lỗi (stack + repro) cho agent QA/feature tương ứng, spawn agent sửa mới song song thay vì chờ.

## E. Bump version + cache bust
- Chạy `node tools/bump-version.cjs` (tăng patch; hoặc `minor` / `major` / `1.2.3` / `--stamp` để chỉ gắn lại `?v=`). Lệnh này cập nhật `js/version.js` (`EP.version`, hiện ở chân trang và Cài đặt) và gắn `?v=<phiên bản>` cho mọi `js/…`, `features/…` và `css/…` trong `index.html` (và `404.html` nếu có). Không dùng `sed` thủ công.
- Tăng `version` trong `EP.demo.register(...)` nếu dữ liệu mẫu đổi.
- Quét secret: `node scripts/scan-secrets.mjs .` (thêm `.env.local` làm tham số 2 nếu có); phải sạch, mã thoát 0.

## F. Push + GitHub Pages
- Commit (trailer phiên): 
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  ```
- `git push origin {{BRANCH}}` (nhánh theo hướng dẫn của người dùng; không force-push).
- Pages: Settings -> Pages đang trỏ đúng nhánh/thư mục? Đợi build (1-2 phút): `gh run list --limit 3` hoặc `gh api repos/{{REPO_SLUG}}/pages/builds/latest`.
- Kiểm tra live: `curl -sI {{LIVE_URL}} | head -1` = 200; mở `{{LIVE_URL}}?demo=1` bằng Playwright, chụp và XEM; kiểm tra file `?v=` mới được tải (không dính cache cũ): xem Network hoặc `curl -s {{LIVE_URL}} | grep -o '?v=[^"]*' | sort -u`.
- Mọi đường dẫn tương đối (không `/` đầu) vì Pages chạy dưới `/<repo>/`. 404 asset -> sửa path.

## G. Phút 55-60 (nộp)
- [ ] `docs/CHECKLIST-NOP-BAI.md` không còn "thiếu".
- [ ] Link demo mở được từ điện thoại (390px), `?demo=1` hoạt động.
- [ ] Bản PDF deck (`deck/out/*.pdf`, thư mục `out/` bị git-ignore nên nộp/mang theo riêng), README, `docs/BANG-KIEM-THU.md`, `docs/MINH-CHUNG-AI.md` đã commit và push.
- [ ] Tag/backup: `git tag submit-{{DE_SO}} && git push origin submit-{{DE_SO}}`.
- [ ] Đóng mọi server cổng 8211-8230; không để key Gemini trong repo: `node scripts/scan-secrets.mjs .` sạch (và `grep -rn "AIza" .` rỗng).
- [ ] Câu nhãn mock trong `js/config.js`, README và slide đúng NGUYÊN VĂN đề/BTC (không còn câu vòng loại nếu đề chung kết khác).

## Prompt cho merge-helper (tuỳ chọn, Sonnet, khi có > 6 nhánh)

```
Repo {{REPO}}, integration branch {{BRANCH}}. Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
Merge these worktree branches in this order, one at a time with `git merge --no-ff`: {{BRANCH_LIST}}.
After each merge resolve conflicts by KEEPING BOTH sides for: <script> tags in index.html (one per line, dependency order: config, version, core, ui, form, charts, export, ai, demo, modules, js/ai-specs.js, features/*/feature.js, js/demo-data.js, js/app.js last), CSS blocks (verify { and } counts equal), duplicate EP.register ids. For any other conflict prefer the later branch only if its owner is listed as owning that file; otherwise stop and report.
After each merge: `node --check` on all js (js/*.js features/*/feature.js), run `node tests/smoke.cjs http://localhost:{{PORT}}/` (serve on {{PORT}}, never 8000), fix trivial breakages. Final: no conflict markers (grep), tests green, screenshots of #home and each feature at 1440x900 and 390x844 viewed by you.
After the final merge run `node tools/bump-version.cjs` and `node scripts/scan-secrets.mjs .` (must be clean). Commit trailer: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> / Claude-Session: {{SESSION_URL}}. Do not push. Report briefly: merge order result, conflicts and how resolved, test results.
```

=================== FILE: prompts/10-polish-agent.md ===================
# 10 - Polish agent (10 phút cuối, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn 2-3 agent song song, mỗi agent một view/nhóm file riêng ({{POLISH_SCOPE}}) để không đè nhau. Port 8215-8216 (polish #1..#2). Chỉ chạy khi nhánh tích hợp xanh test. Thời hạn cứng: 8 phút, rồi coordinator merge.

```
Repo: {{REPO}} (vanilla JS mini-app "{{APP_NAME}}", window.EP; look = preset in css/tokens.css, edit only via existing tokens, CSS inside `@layer components`). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

TIME BOX: 8 minutes. Only low-risk, high-visibility changes. Scope (you may edit only these): {{POLISH_SCOPE}}.

CHECKLIST (do in this order, screenshot before/after at 1440x900 and 390x844, light and dark, and LOOK at each):
1. Visual hierarchy: one clear primary action per screen, heading sizes (h1 >= 28px desktop), consistent spacing scale (4/8/12/16/24/32), aligned grids, no orphan single-word lines, consistent radius/shadow.
2. Empty states: every list/table/chart with no data shows an icon-or-illustration (inline SVG), one-line explanation, and a primary button ("Thêm ... đầu tiên" or "Nạp dữ liệu mẫu").
3. Loading/AI states: skeleton or typing indicator, never a blank flash.
4. Motion (subtle, 150-300ms, ease-out): button press, card hover lift, list item enter fade/slide, number count-up on KPI, toast slide. Only transform/opacity. Respect `prefers-reduced-motion: reduce` (disable all). No layout-shifting animation.
5. Copy: Vietnamese, friendly, specific, consistent terms (one word per concept), correct diacritics, sentence case, error messages say how to fix; remove leftover English/lorem/"TODO"/starter names ('Tên ứng dụng', 'Mục', 'Mô-đun mẫu'). Do NOT reword the mock notice: it is the organizers' VERBATIM wording ("{{MOCK_NOTICE}}") from js/config.js.
6. Details: favicon + title, focus rings, hover/active/disabled states, tap target >= 40px, long-text truncation with title attr, number/date formatting vi-VN (1.250.000 ₫, 13/11/2026), table alignment (numbers right).
7. Contrast AA in both themes; dark mode has no white flashes or unreadable charts.
Do NOT change behavior, data schema, IDs/selectors used by tests, or add dependencies. If a change needs more than 3 minutes, skip it and list it.

VERIFY: `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-polish-{{PORT}}` plus feature tests in scope, zero console errors, CSS braces balanced, `node --check` for JS.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: what changed per item (1-7), skipped items, verified vs not, test results.
```

=================== FILE: prompts/11-emergency.md ===================
# 11 - Cấp cứu: agent kẹt / hết giờ (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

## Khi nào dùng
- Agent im > 8 phút, lặp lỗi, hoặc báo "gần xong" lần thứ hai không có commit.
- Đồng hồ: phút 35 chưa có feature P0 nào chạy; phút 45 chưa merge; phút 52 test đỏ.
- Quy tắc: **không chờ**. Gửi `interrupt_session` nếu cần, **spawn agent mới ngay** (prompt dưới), lấy kết quả nào xong trước. Giữ nhánh cũ làm nguồn tham khảo/cherry-pick.

## Bảng cắt giảm (theo thời gian còn lại)
| Còn lại | Hành động |
|---|---|
| > 25 phút | Re-spawn feature với prompt ngắn hơn, chỉ P0 acceptance; thêm 1 agent second-opinion |
| 15-25 phút | Cắt P2, bỏ Gemini (chỉ mock + notice), bỏ export/chart phụ; một màn hình chính + form + bảng |
| 8-15 phút | Feature chưa xong -> ẩn khỏi nav, ship mock tĩnh có dữ liệu `?demo=1`; deck/docs dùng ảnh đã có |
| < 8 phút | Đóng băng code. Chỉ sửa lỗi chặn demo. Quay về bản merge xanh gần nhất (`git reset --hard <tag/commit xanh>`), push, kiểm tra Pages, nộp |

## Prompt: re-spawn feature rút gọn ("ship mock")

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

EMERGENCY. Hard deadline: {{MINUTES}} minutes from now; stop and report at that time even if unfinished. A previous agent got stuck on feature "{{FEATURE_NAME}}" ({{FEATURE_DESC}}); its branch {{OLD_BRANCH}} may contain reusable pieces (inspect with `git diff {{BRANCH}}..{{OLD_BRANCH}} --stat`; copy only what works, do not debug its internals).
Goal: a demo-able version, not a complete one. Minimum acceptance (ONLY these): {{ACCEPTANCE_MIN}}.
Rules: `cp -r features/_example features/{{FEATURE_NAME}}` (EP.register + EP.collection + EP.form pattern); own ONLY features/{{FEATURE_NAME}}/**; one `<script src="features/{{FEATURE_NAME}}/feature.js">` line in index.html before js/app.js. Use static/mock data via `EP.demo.register('<collection>', { version: 1, seed })` (reseeded by ?demo=1) where real logic is hard; real form validation via EP.form is still required if the feature has a form; show `EP.ai.noticeHtml(result)` if AI output is mock (the notice text is the organizers' VERBATIM wording set in js/config.js; never retype it). Skip charts/export/edge cases. Get a vertical slice working within 5 minutes first, commit it, then improve.
Verify with Playwright at 390x844 and 1440x900 (open the screenshots and LOOK), run `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-emergency`.
GIT ({{COMMIT_MODE}}): commit early and often on the worktree branch, trailer:
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT in <= 8 lines: what works (verified), what is mock, what is missing.
```

## Prompt: fallback demo (khi app hỏng nặng)

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve on {{PORT}} (8230 for emergency work; never 8000).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
Deadline {{MINUTES}} minutes. Build `demo-fallback.html` (single self-contained file, inline CSS/JS, no network): a click-through walkthrough of "{{APP_NAME}}" using real screenshots from deck/assets/ or the qa/ and shots-* folders (embed as relative files) plus mock interactive widgets for the 3 key moments from docs/KICH-BAN-DEMO.md. Vietnamese, brand colors {{BRAND_COLORS}}, works at 390 and 1440, keyboard arrows move between steps. Banner: "Bản trình diễn dự phòng - dữ liệu mô phỏng" (this is a generic fallback banner, NOT the mock notice for AI results: any AI output shown must carry the organizers' VERBATIM notice "{{MOCK_NOTICE}}"). Verify with Playwright screenshots (LOOK), commit with the standard trailer, report in <= 5 lines.
```

## Prompt: khôi phục bản xanh

Coordinator làm tay: `git log --oneline -15`, tìm commit gần nhất có smoke xanh (`git stash; git checkout <sha>; node tests/smoke.cjs http://localhost:8211/`), `git reset --hard <sha>` trên nhánh tích hợp, chạy lại 09 mục D-F (gồm `node tools/bump-version.cjs` và `node scripts/scan-secrets.mjs .`).

=================== FILE: references/01-doc-de-60-phut.md ===================
# 01 — Đọc đề thành spec trong 5 phút

Mục tiêu: sau 5 phút có `docs/spec-nhanh.md` 1 trang (mẫu: `templates/spec-nhanh.md`, `scripts/new-project.sh` đã chép vào `docs/`; mẫu rút gọn bên dưới dùng cho ghi nhanh) để mọi agent đọc. Spec là chuẩn; không có trong spec thì không làm.

## Quy trình (đồng hồ)

- **0:00–1:30** Đọc đề 2 lần. Gạch: *đề yêu cầu bắt buộc* (thường 5 tính năng), *từ khoá nghiệp vụ* (ngày, trùng, hết hạn, điểm...), *đầu ra phải thấy*. Song song spawn 1 agent Haiku research: 3 app tương tự + dữ liệu mẫu thực tế cho ngành của đề.
- **1:30–3:30** Điền khung bên dưới cho từng tính năng.
- **3:30–5:00** Chốt bảng nghiệm thu, phạm vi "không làm", chốt preset giao diện (`xclipse` mặc định hoặc `lucian`), chia agent theo bảng cổng ở `prompts/00-README.md`. Đội đọc lướt rồi đi.

## Khung BTC: Input → Quy tắc → Output → Lưu trữ

Mỗi tính năng điền đúng 4 dòng:

```
F1 <tên tính năng>
- Input: các ô/nguồn dữ liệu (kiểu, bắt buộc?)
- Quy tắc (nếu/thì): validation, trùng, hết hạn, biên, trạng thái đặc biệt
- Output: người dùng thấy gì (màn hình, số, file)
- Lưu trữ: localStorage (ghi rõ giới hạn 1 máy) / file xuất / Firebase (chỉ khi đề cần)
```

Quy tắc mặc định hay bị chấm (lấy từ buổi đào tạo): tên trống → cảnh báo; email/SĐT sai định dạng → nhắc nhập đúng (+84 chuẩn hoá); bấm 2 lần/trùng → chỉ ghi 1 lần; thời gian đã qua → trạng thái "đã diễn ra/hết hạn", không đếm số âm; danh sách rỗng → trạng thái rỗng có hướng dẫn; localStorage chỉ trên 1 máy → ghi rõ trong app/README.

## 5 tính năng → tiêu chí nghiệm thu

| # | Tính năng | Nghiệm thu (phải kiểm được bằng tay/test trong 30 giây) |
|---|---|---|
| F1 | ... | Ca thường: ... → thấy ...<br>Ca sai: ... → báo lỗi dưới ô<br>Ca biên: ... |
| F2 | ... | ... |
| F3 | ... | ... |
| F4 | ... | ... |
| F5 | ... | ... |

Bảng B cần ≥3 ca kiểm thử (thường, thiếu/sai, biên); Bảng A ≥6 (2 thường, 2 sai, 2 biên). Tạo ngay từ bảng này; tránh nghĩ lại về sau.

## AI trong đề (nếu có)

- AI làm đúng việc đề nói (sinh chữ, phân loại, gợi ý...). Dữ kiện chính xác (ngày, giá, tên) **luôn từ form**, AI chỉ viết chữ.
- Luôn có 3 lớp, starter đã làm sẵn trong `EP.ai.generate({ prompt, schema, mock }, { input })`: (1) một cửa duy nhất, (2) kiểm tra đầu ra theo `schema` (rút JSON chịu lỗi, thử lại 1 lần, lỗi thì rơi về mock kèm cảnh báo), (3) mock có nhãn (`EP.ai.noticeHtml`). Không key → mock. Ba chế độ: mock / gemini (key người dùng nhập) / paste (copy-dán Claude, ChatGPT, Gemini).
- Ghi vào spec: AI nhận gì → trả gì → kiểm tra gì → lỗi thì sao.

## Mẫu rút gọn của `docs/spec-nhanh.md`

```
# <Tên app> — <Đề số / tên đề> (Bảng A/B)
Người dùng chính: <1 câu>  |  Vấn đề: <1 câu>  |  Giá trị: <1 câu>
## 5 tính năng (khung Input→Quy tắc→Output→Lưu trữ)
## Nghiệm thu (bảng trên)
## AI: làm gì / mock thế nào / nhãn nguyên văn: "<câu BTC yêu cầu, CHÉP TỪ ĐỀ CHUNG KẾT>"
## Dữ liệu demo: <3–6 bản ghi thật, tiếng Việt>
## Không làm (ngoài phạm vi)
## Giả định đã chọn (đề không nói)
## Chia việc: agent → file được sửa
```

## Bẫy khi đọc đề

- **Nhãn mô phỏng AI: chép NGUYÊN VĂN từ đề/BTC.** Câu của vòng loại là `Bản demo vòng loại - Dữ liệu mô phỏng AI`; chung kết có thể đổi chữ, đừng giả định. Tìm câu này ngay ở phút 0-1.5, ghi vào spec, rồi đặt vào `mockNotice` trong `js/config.js` (và sửa 2 assert trong `tests/smoke.cjs`). Không tìm thấy: dùng `Dữ liệu mô phỏng AI` và ghi "chưa xác nhận" vào `docs/DECISIONS.md`.

- **Nơi lưu dữ liệu do đề quy định là bản chính** (vd localStorage). Firebase/Sheet chỉ làm tuỳ chọn và mô tả đúng là tuỳ chọn; mô tả ngược sẽ bị nhận xét "chưa đúng tính năng".
- **Bảng thi (A/B) và hạn nộp**: xác nhận ngay T+0 từ thông báo/BTC (bảng A: ≥6 ca, mock AI chỉ tối đa 4/15; bảng B: ≥3 ca, mock minh bạch vẫn đạt). Số liệu lệch giữa các nguồn (23:59 so với 00:30) thì làm theo mốc sớm nhất, ghi vào `docs/DECISIONS.md`.
- Thêm tính năng ngoài đề → mất thời gian, không có điểm. Phạm vi hẹp, lõi chạy trọn.
- Đề trùng lĩnh vực với đề khác → giữ đúng ranh giới đề của mình (ví dụ chỉ làm checklist, không làm công cụ chấm điểm).
- Đề mơ hồ: chọn mặc định đơn giản nhất, ghi "Giả định" trong spec, nói ra khi thuyết trình. Hỏi BTC nếu có thể hỏi, đừng chờ.
- Mục "demo thật": chuẩn bị sẵn dữ liệu để vừa mở app đã thấy nội dung đầy đủ, sạch.

=================== FILE: references/02-dieu-phoi-agent.md ===================
# 02 — Playbook điều phối agent

Rút từ ~160 commit của Xclipse, phần lớn do Sonnet chạy song song và điều phối viên merge.

## Chính sách tài nguyên: xả láng (nhắc lại)

Usage/token **không phải** ràng buộc, chỉ **thời gian** là ràng buộc. Điều phối viên:
- chỉ điều phối (lập kế hoạch, spawn, merge, test, deploy, báo cáo) — **không viết code tính năng**;
- spawn **càng nhiều Sonnet + Haiku 5.5 cùng lúc càng tốt**: 1 agent/tính năng, + shell/UI, AI, dữ liệu demo, deck, docs, QA, polish, research;
- prompt đầy đủ ngữ cảnh dù dài; **không tiết kiệm xác minh** (ảnh chụp, test, chạy lại sau merge);
- ưu tiên spawn thêm agent QA / ý kiến thứ hai thay vì làm tuần tự;
- agent chậm/kẹt → **spawn lại**, đừng chờ.

## Mô hình chọn

| Việc | Model |
|---|---|
| Tính năng có logic, UI, AI, deck, polish, QA phức tạp | Sonnet |
| Dữ liệu demo, README/docs, bảng kiểm thử, QA lặp, research ngắn | Haiku |
| Điều phối | Claude chính, không code |

## Cách cô lập (chọn 1, không trộn)

1. **Worktree** (`isolation: "worktree"`): mỗi agent 1 nhánh riêng. **Bắt buộc dòng đầu prompt: `git reset --hard <nhánh-chính>`** vì worktree có thể bắt đầu từ commit cũ. Agent commit trên nhánh của nó, không push. Điều phối viên `git merge`.
2. **Thư mục rời nhau** (không worktree): mỗi agent sở hữu danh sách file riêng, ghi rõ "không đụng file khác". Phù hợp starter nhỏ. Không commit; điều phối viên commit sau mỗi đợt.

Mặc định cho sprint: **worktree + chia file theo feature** (mỗi tính năng 1 thư mục `features/<tên>/feature.js` đăng ký bằng `EP.register`, tùy chọn 1 file `css/<tên>.css` trong `@layer components`).

## Prompt agent — bắt buộc đủ 9 mục

1. Bối cảnh 3 dòng: app gì, đề gì, vanilla HTML/CSS/JS không build, UI tiếng Việt.
2. Dòng đầu: `git reset --hard <nhánh>` (nếu worktree) hoặc "làm việc trong thư mục X".
3. Việc cần làm: trích đoạn spec của tính năng (Input/Quy tắc/Output/Lưu trữ) + nghiệm thu.
4. **File được sửa / file CẤM đụng** (liệt kê tên). Feature agent chỉ thêm đúng MỘT dòng `<script src="features/<tên>/feature.js"></script>` vào khối FEATURES của `index.html` (trước `js/app.js`), mỗi tag một dòng. Bảng sở hữu file đầy đủ: `prompts/00-README.md`.
5. **Cổng riêng** (xem bảng), chạy `setsid nohup python3 -m http.server <cổng> &` ở gốc worktree của mình; **tuyệt đối không dùng 8000** và không dùng cổng agent khác.
6. Cách verify: `node tests/smoke.cjs http://localhost:<cổng>/ [--shots thư-mục]` + Playwright (`require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`), viewport 390x844 + desktop, **chụp ảnh và tự xem lại ảnh**, chạy test của mình (`tests/<feature>.cjs`), nêu lệnh.
7. Quy tắc chất lượng: link tới `references/03` (tokens, sáng/tối, trạng thái rỗng/loading/lỗi, validation, mock có nhãn).
8. Commit (worktree): message ngắn + trailer `Co-Authored-By` theo hệ thống. Không push.
9. Báo cáo cuối: file đã đổi, lệnh test + kết quả thật, ảnh ở đâu, việc chưa xong/giả định.

Dùng file trong `prompts/` làm khuôn rồi điền; đừng viết tay từ đầu.

## Bảng cổng (không bao giờ 8000)

Bảng duy nhất, giống `SKILL.md` và `prompts/00-README.md`:

| Vai | Cổng |
|---|---|
| Điều phối (bản merge) | 8211 |
| Shell/brand | 8212 |
| AI | 8213 |
| Data/demo | 8214 |
| Polish #1, #2 | 8215, 8216 |
| Feature F1…F8 | 8217–8224 |
| Deck | 8225 |
| Docs | 8226 |
| QA #1…#3 | 8227–8229 |
| Cấp cứu / dự phòng | 8230 |

`tests/smoke.cjs` nhận URL từ tham số dòng lệnh (`node tests/smoke.cjs http://localhost:8211/`; mặc định `http://localhost:8201/` chỉ để chạy tay, đừng dựa vào). Test viết thêm cho feature cũng phải nhận URL từ `argv`, không hardcode cổng.

## Quy trình merge (điều phối viên)

```
git status                      # sạch trước khi merge
git merge --no-ff <nhánh-agent> # lần lượt: shell → data → AI → feature 1..N → deck/docs
node --check js/*.js features/*/feature.js     # mỗi lần merge xong
node tests/smoke.cjs http://localhost:8211/      # test nhanh (+ tests/<feature>.cjs nếu có)
```
Thứ tự: nền (shell/tokens/storage) trước, rồi AI + dữ liệu, rồi các tính năng, cuối cùng docs/deck.

### Xung đột hay gặp và cách giải

| Nơi | Triệu chứng | Cách giải |
|---|---|---|
| `index.html` thẻ `<script>` | Hai nhánh cùng thêm script cuối khối FEATURES | Giữ **cả hai** dòng (mỗi tag một dòng), `js/app.js` luôn cuối; `js/demo-data.js` sau các feature |
| `css/*.css` ngoặc `}` | Merge xong thiếu/thừa `}` làm CSS sau không chạy | Đếm `{`/`}` (`python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"`) hoặc mở app xem; CSS nằm trong `@layer components {}` (thứ tự layer khai báo ở `css/tokens.css`), kiểm tra khối đóng |
| `EP.register` trùng `id` | Hai feature cùng tên tab (bản sau thay bản trước) | Đổi `id` cho khác nhau; mỗi `id` = một đường `#/id` |
| `js/version.js`, `?v=` trong `index.html` | cùng tăng version | Lấy bản cao hơn rồi chạy `node tools/bump-version.cjs` MỘT lần ở cuối (không sửa tay) |
| `js/config.js` `mockNotice` | khác câu nhãn mock | Giữ câu NGUYÊN VĂN từ đề/BTC (xem cảnh báo ở `prompts/00-README.md`); khớp assert trong `tests/smoke.cjs` |
| `docs/*` | Hai bản README | Điều phối viên giữ 1 bản, dán mục còn lại |

Conflict phức tạp (>2 file): **không tự vá lâu** — abort merge, spawn agent "rebase nhánh X lên nhánh chính và giải xung đột" với prompt có đúng diff lỗi.

## Reset worktree agent

Trong worktree của agent trước khi làm: `git fetch 2>/dev/null; git reset --hard <nhánh-chính>`; xác nhận bằng `git log -1 --oneline` khớp commit điều phối nêu trong prompt. Nếu agent báo thấy file cũ, lỗi gốc thường là không reset.

## Xác minh sau merge (không bỏ)

1. `node --check` mọi JS (`js/*.js features/*/feature.js`); app mở không lỗi console.
2. Chạy toàn bộ test trên cổng 8211: `node tests/smoke.cjs http://localhost:8211/ --shots shots-merge` + `tests/<feature>.cjs`.
3. Spawn **2 agent QA song song**: (a) luồng 5 tính năng desktop + sáng/tối, (b) mobile 390px + đầu vào sai/biên. Họ chụp ảnh, điều phối viên mở xem ảnh.
4. Tốt nhất 1 agent "ý kiến thứ hai" đọc spec và đối chiếu từng nghiệm thu với app thật.
5. Chỉ khi xanh mới `node tools/bump-version.cjs`, `node scripts/scan-secrets.mjs .` (sạch) rồi push.

## Nhịp 60 phút

- T+8 spawn tất cả cùng một tin nhắn (nhiều lệnh gọi song song, background).
- T+25 merge đợt 1 để có bản chạy sớm; agent chưa xong tiếp tục.
- T+40 hết hạn agent: chưa commit = bỏ; spawn QA/polish thay.
- Luôn có bản chạy được trên nhánh chính sau mỗi merge; không để nhánh chính hỏng.

## Mẫu giao việc hay dùng (rút từ Xclipse)

- **Dữ liệu lớn chia theo phần:** mỗi agent một file `partN.json` + validator riêng (id duy nhất, enum hợp lệ, tương phản WCAG, phân bố nhãn); điều phối viên gộp bằng script sinh, không sửa tay file sinh (`07` I1).
- **Việc lặp theo từng ảnh/trang:** 1 Haiku cho mỗi ảnh/trang (xoá watermark, kiểm tra từng landing ở 3 khổ), chạy song song.
- **Lỗi khó tìm nguyên nhân (giật, hiệu ứng mất):** giao Sonnet, không giao Haiku; yêu cầu so với bản còn đúng trước đó và **chụp khung hình giữa lúc chạy** (`07` H4); không chấp nhận "test xanh" thay cho ảnh.
- **Mỗi đợt sửa mobile:** một agent chạy `e2e-mobile` ở 390/360 + đo vùng chạm, một agent chỉ xem ảnh và liệt kê lỗi bố cục; sửa theo cả lớp lỗi ("áp dụng cho mọi landing tương tự").
- **Sau khi gộp:** chạy lại toàn bộ test ở nhánh gộp; test Firebase/emulator do điều phối viên chạy (agent sandbox không có); báo cáo ghi rõ phần chưa thử trên máy thật.
- Quy ước viết dùng chung cho mọi prompt: `references/08-quy-uoc-viet.md`; đoạn mã mẫu: `references/07-cookbook-code-mau.md`.

=================== FILE: references/03-chat-luong-xclipse.md ===================
# 03 — Chuẩn chất lượng Xclipse (checklist rút gọn)

Dán mục liên quan vào prompt mọi agent. Tick trước khi merge.

## Kiến trúc
- [ ] Vanilla HTML/CSS/JS, **không build, không CDN**, global namespace `window.EP` (đã có sẵn trong `starter/`), script nạp theo thứ tự trong `index.html` (config, version, core, ui, form, charts, export, ai, demo, mô-đun, `js/ai-specs.js`, features, `js/demo-data.js`, **app.js cuối**).
- [ ] Mỗi tính năng 1 thư mục `features/<tên>/feature.js` (IIFE, `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })`); logic thuần (validator, tính toán) tách khỏi DOM để test (mẫu: `features/_example`, mô-đun `js/calc.js`, `quiz.js`...).
- [ ] CSS: `css/tokens.css` (biến + khai báo thứ tự `@layer reset, tokens, base, components, utilities`) + `css/app.css`. **CSS mới đặt trong `@layer components {}`**, chỉ dùng biến trong tokens; kiểm tra mỗi khối đóng đủ `}`.
- [ ] Lưu trữ qua `EP.store` / `EP.collection(name)` (try/catch sẵn, rơi về bộ nhớ khi localStorage bị chặn; khoá = `prefix` trong `js/config.js`); dữ liệu demo qua `EP.demo.register(name, { version, rows | seed })`; ghi rõ localStorage chỉ trên 1 máy.
- [ ] 1 cửa gọi AI: `EP.ai.generate({ prompt, schema, mock }, { input })` (`js/ai.js`): mock mặc định, Gemini khi người dùng nhập key, hoặc copy-dán; kết quả luôn kèm `EP.ai.noticeHtml(result)`.

## Design tokens (`css/tokens.css`, preset `xclipse` mặc định hoặc `lucian`)
- [ ] Chọn bộ giao diện bằng `<html data-preset="xclipse">` (Ice #DBF2FC / Navy #072D59 / Coral #FD6E88) hoặc `"lucian"`; tên token giữ nguyên giữa các bộ. Đổi thương hiệu khác: sửa khối xclipse ở đủ 3 chỗ (sáng, tối theo hệ thống, tối thủ công). Bộ nhận diện: `skills/vibe-sprint/brand/`.
- [ ] Chỉ dùng biến có trong `css/tokens.css` (màu, `--font`, `--radius*`, `--gap`, `--pad`, `--control-h`, `--ease-out`, `--chart-1..6`...); không hard-code màu/cỡ trong feature.
- [ ] Nút chính màu gần đen / hoặc accent, một màu nhấn duy nhất; không bóng nặng; viền 1px mờ.
- [ ] Chữ ≥ 14px, ô nhập ≥ 16px (tránh iOS zoom). Font: Be Vietnam Pro / IBM Plex Sans + fallback hệ thống (hỗ trợ tiếng Việt).
- [ ] Tương phản AA: chữ thường ≥ 4.5:1, viền ô nhập ≥ 3:1. Đo, không đoán.

## Sáng / tối
- [ ] `prefers-color-scheme` làm mặc định, nút `#btn-theme` chuyển Theo hệ thống/Sáng/Tối (`EP.theme`), nhớ lựa chọn (try/catch, khoá `ep_theme`).
- [ ] Mỗi màu dùng biến; kiểm tra tối cho: nút, viền, badge, input, dialog, chart. Vùng "luôn sáng" (xem trước giấy) ép `color-scheme: light`.
- [ ] Không có chớp trắng khi chuyển tab/theme.

## Chuyển động
- [ ] Mọi tương tác chính có phản hồi: hover, press, focus, chuyển tab, mở dialog, toast.
- [ ] Chỉ animate `transform`/`opacity`; thời lượng 150–300 ms; không giật.
- [ ] `prefers-reduced-motion` tắt/giảm hết.
- [ ] **Một hiệu ứng cho mỗi pseudo-element/transition** (xem lỗi view-transition trong `04`). Không animate layout liên tục khi cuộn; không chặn vuốt nhanh trên mobile.

## Trạng thái
- [ ] **Rỗng:** câu giải thích + nút hành động chính + (tuỳ) "Điền dữ liệu mẫu".
- [ ] **Loading:** skeleton hoặc nút `đang xử lý…` khoá bấm; không để 2 lần gửi.
- [ ] **Lỗi:** thông báo tiếng Việt nói rõ cách sửa, ngay dưới ô; lỗi hệ thống dùng toast, không `alert()`.
- [ ] **Thành công:** toast/popup ngắn; số liệu cập nhật tức thì.
- [ ] Hành động xoá: xác nhận bằng `EP.ui.confirm({ title, message, confirmLabel, danger })`, không `confirm()` gốc; lỗi hệ thống dùng `EP.ui.toast(msg, { type })`, trạng thái rỗng/lỗi dùng `EP.ui.empty` / `EP.ui.error`.

## Validation và nghiệp vụ
- [ ] Tên trống, email sai, SĐT sai (chấp nhận +84/0, chuẩn hoá), số âm, ngày quá khứ, quá dài: đều có thông báo.
- [ ] Trùng → ghi 1 lần; bấm đúp → 1 lần; hết hạn/đủ chỗ → trạng thái đúng, ẩn nút.
- [ ] Không bao giờ hiện `undefined`, `NaN`, `Invalid Date`, số âm.
- [ ] Chuỗi người dùng nhập và nội dung AI luôn `textContent` hoặc `EP.esc()` trước khi vào `innerHTML`, chặn HTML/JS chèn vào.

## Dữ liệu demo
- [ ] Mở lần đầu thấy ngay nội dung đầy đủ, sạch, thật: 3–6 bản ghi tiếng Việt thực tế (tên, số liệu, ngày cố định tương lai gần).
- [ ] Nút "Nạp lại dữ liệu demo" (Cài đặt, `EP.demo.reset()`). Demo **không được ghi đè dữ liệu người dùng đang làm**: `js/demo.js` chỉ nạp khi collection rỗng, hoặc khi tăng `version` mà người dùng chưa sửa dòng nào; chỉ `?demo=1` / nút nạp lại mới xoá rồi nạp lại.
- [ ] Test tự động seed demo qua `?demo=1`, không dựa vào lần mở đầu.

## Mobile
- [ ] 390px và 360px: không tràn ngang (`scrollWidth <= innerWidth`), vùng chạm ≥ 44px, tab cuộn ngang, dialog dạng bottom sheet.
- [ ] Lưới 3 mục: 1 cột hoặc 3 cột đều, không để lẻ 2+1. Không khoảng trắng lạ cuối trang.
- [ ] Sticky bar không che nội dung; chữ nút không xuống dòng xấu (`white-space: nowrap` cho thương hiệu).
- [ ] Điều khiển chỉ hiện khi rê chuột phải mở sẵn trên cảm ứng (`@media (hover: none)`); toast ở mép trên; `[hidden]` luôn ẩn thật; tiêu đề lớn `line-height` ≥ 1.25 (dấu tiếng Việt); thanh dính ẩn không kéo dài trang (đoạn mã: `07` C).

## Truy cập (a11y)
- [ ] Một `h1` mỗi màn; thứ tự heading đúng; link "bỏ qua tới nội dung".
- [ ] Mọi `input` có `label`; `aria-live` cho toast/lỗi; focus nhìn thấy; dialog giữ focus + Esc đóng + trả focus.
- [ ] Ảnh có `alt` mô tả tiếng Việt, có `width/height`.

## SEO / chia sẻ (nếu có link công khai)
- [ ] `title` ≤ 60, `description` 140–160, canonical, OG/Twitter (ảnh 1200x630 JPEG), `lang="vi"`, favicon, `robots.txt`, `sitemap.xml`, `404.html`.
- [ ] Facebook/Zalo **không chạy JS** → meta phải nằm sẵn trong HTML tĩnh (trang chia sẻ riêng), không gắn bằng JS.

## Phát hành
- [ ] `js/version.js` (`EP.version`) + chân trang hiện phiên bản; mỗi lần phát hành chạy `node tools/bump-version.cjs` (tăng patch, gắn `?v=<phiên bản>` cho mọi `<script>/<link>` nội bộ trong `index.html`).
- [ ] README: đề số, 5 tính năng, cách chạy, AI thật/mock + nhãn, giới hạn, nguồn tham khảo, không lộ key.

## Kiểm thử (Playwright, `.cjs`)
- [ ] Chạy `node tests/smoke.cjs http://localhost:<cổng>/ [--shots thư-mục]`; test của feature mới (`tests/<tên>.cjs`) cũng nhận URL từ `argv`, không cổng cứng; ảnh lưu vào thư mục `--shots`, thư mục này git-ignore.
- [ ] Câu nhãn mock trong `tests/smoke.cjs` khớp `mockNotice` (nguyên văn từ đề/BTC) trong `js/config.js`.
- [ ] Mỗi tính năng ≥ 3 ca: thường / sai / biên; thêm test mobile 390px không tràn ngang; test sáng/tối không lỗi console.
- [ ] Test mở app bằng `?demo=1` để dữ liệu ổn định (smoke.cjs đã làm sẵn).
- [ ] Chỉ ghi kết quả đã chạy thật vào bảng kiểm thử, kèm lệnh và ngày.

=================== FILE: references/04-bai-hoc-loi-thuong-gap.md ===================
# 04 — Bài học và lỗi thường gặp (triệu chứng → nguyên nhân → cách sửa)

Rút từ lịch sử Xclipse. Đọc nhanh trước T+8, dán các dòng liên quan vào prompt agent.

## Quy trình agent / git

| Triệu chứng | Nguyên nhân | Cách sửa / phòng |
|---|---|---|
| Ảnh chụp của agent không có thay đổi vừa code; "chạy được" mà thật ra sai trang | Nhiều agent cùng dùng cổng 8000, server phục vụ **worktree của người khác** | Mỗi agent cổng riêng (bảng 8211-8230 ở `02`), không bao giờ 8000; kiểm tra `curl localhost:<cổng>/js/version.js` thấy đúng nhánh |
| Agent thấy code cũ / thiếu file | Worktree bắt đầu từ commit cũ | Dòng đầu prompt `git reset --hard <nhánh>`; so `git log -1` |
| Test fail dù tính năng đúng | Test **hardcode cổng 8000** | Test lấy URL từ `argv` (`node tests/smoke.cjs http://localhost:<cổng>/`); điều phối viên truyền URL |
| Merge xong app trắng | Xung đột ở `index.html` (hai dòng `<script>` đè nhau / thứ tự sai) | Giữ cả hai script, đúng thứ tự phụ thuộc; mỗi agent thêm script ở neo riêng |
| CSS sau điểm merge không áp dụng | Thiếu/thừa `}` trong `app.css` sau merge | Đếm ngoặc; khối `@layer components {}` phải đóng; chạy lại ảnh chụp |
| Hai agent sửa cùng hàm/file | Prompt không chia file | Chia sở hữu file; liệt kê "file CẤM đụng" |
| Agent dừng giữa chừng không báo | Chạm giới hạn/API lỗi | Kiểm tra commit của nó, spawn lại phần còn lại (prompt kèm "đã làm gì rồi") |
| Agent báo "xong" nhưng chưa thử | Không bắt buộc verify | Prompt yêu cầu ảnh + lệnh test + kết quả; QA agent kiểm lại |

## CSS / animation

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Kiểu của app đè lên landing/xem trước (hoặc ngược lại) | CSS app **nằm ngoài `@layer`** nên thắng độ ưu tiên | Toàn bộ CSS app trong các `@layer` khai báo ở `css/tokens.css` (`components` cho CSS mới); nội dung người dùng/xem trước ngoài layer |
| Thanh trên hiện bóng ma khi đổi theme/tab | `view-transition` bắt cả phần tử cố định | Gán `view-transition-name` riêng cho thanh, dọn token sau mỗi chuyển |
| Hiệu ứng đổi theme giật, chạy hai lần | **Hai animation trên cùng một pseudo** (`::view-transition-new(root)`) | Chỉ một WAAPI animation cho mỗi pseudo; dọn khi `finished` |
| Cuộn nhanh trên điện thoại bị kẹt | Hiệu ứng scroll/observer nặng, `scroll-snap` lỗi | Chỉ `transform/opacity`, observer nhẹ, giảm hiệu ứng ở mobile, thử vuốt thật |
| Animation giật nhẹ | Animate layout (`width/top`) hoặc `transition: all` | Chỉ thuộc tính composite; liệt kê thuộc tính cụ thể |
| Chớp trắng khi đổi tab | Nền chưa theo theme | `body` có nền theo biến; ép nền trước khi render |
| Thanh/toolbar tách khỏi header khi cuộn hoặc zoom | Sticky lồng nhau | Một container cố định; khoá chiều cao màn thiết kế |
| Input trong landing hiện kiểu tối | Màn tối "rò" vào vùng sáng | `color-scheme: light` cho vùng nội dung người dùng |
| Chữ nút "Tạo bằng X" xuống dòng | Không `nowrap` | `white-space: nowrap` cho tên thương hiệu trong nút |
| Khoảng trắng lạ cuối trang mobile | `min-height`/`100vh` + thanh địa chỉ | Dùng `100dvh`, kiểm tra footer ở 390px |

## Cache / triển khai / chia sẻ

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Đã push mà trang vẫn bản cũ | Trình duyệt/Pages giữ cache | `node tools/bump-version.cjs` (gắn `?v=` mọi script/css), Ctrl+F5, chờ 1–10 phút, kiểm tra `version.js` ở chân trang |
| Facebook/Zalo hiện sai tiêu đề/ảnh | **Bot không chạy JS**, meta gắn bằng JS | Tạo HTML tĩnh `s/<id>/index.html` có sẵn OG + chuyển hướng bằng JS cho người thật; ảnh JPEG 1200x630 |
| Ảnh tải lên máy không hiện trên link chia sẻ | Ảnh là dataURL/local | OG chỉ nhận URL http(s) công khai |
| Khách tải lại trang bị mất trang đang làm (bị ghi đè bằng demo) | Seed demo chạy không kiểm tra | `js/demo.js` chỉ nạp khi collection rỗng và có cờ phiên bản (`demo_v_<tên>`); đừng tự viết seed ghi đè; test riêng |
| Máy giám khảo có dữ liệu demo cũ | Không có version dữ liệu | Tăng `version` trong `EP.demo.register`: nạp bản mới nếu người dùng chưa sửa dòng nào, dữ liệu người dùng giữ nguyên |
| Link online chạy nhưng demo bị trắng ở mạng trường | CDN/font ngoài bị chặn | Không phụ thuộc CDN; font fallback hệ thống |
| Ngày demo "còn 17 giờ" / số âm khi chấm | Ngày tương đối hoặc ngày cũ | Ngày cố định tương lai gần; sự kiện đã qua ghi rõ "đã diễn ra" |

## AI / dữ liệu

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Nhãn mô phỏng bị bác/chấm trừ | Sai câu chữ BTC yêu cầu | Lấy **nguyên văn** từ đề/BTC (từng chữ, từng dấu) và đặt ở `mockNotice` trong `js/config.js`; `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của vòng loại, **chung kết phải kiểm tra lại từ đề, đừng suy diễn**; đổi câu thì sửa luôn 2 assert trong `tests/smoke.cjs` |
| Nhãn mô phỏng xuống dòng/che nút | CSS | `flex-wrap`, chạy ảnh mobile |
| Tạo ảnh bằng Gemini báo 429 `limit: 0` | **Key miễn phí không tạo được ảnh** (cần billing) | Văn bản dùng Flash miễn phí được; ảnh: dùng ảnh có sẵn/SVG/gradient, thông báo rõ trong app |
| Tên model đổi/gỡ (-preview) | Không ổn định | `EP.ai.MODELS` / `FALLBACKS` trong `js/ai.js` tự thử model kế; cập nhật danh sách theo tài khoản thật; luôn có mock |
| AI trả JSON kèm văn bản/code fence | Đầu ra tự do | `EP.ai.generate` đã có sẵn: tách JSON (`extractJson`), kiểm `schema`, thử lại 1 lần, rơi về `mock` kèm cảnh báo có nhãn; chỉ cần khai báo `schema` chặt + `mock` tốt |
| Nội dung mock sáo rỗng ("nâng tầm chuyên môn") | Công thức đơn điệu | Nhiều mẫu câu, lấy dữ kiện từ input, cấm cụm sáo rỗng; dữ liệu chính xác không để AI bịa |
| Key lộ trong repo/ảnh | Dán vào code/chat | Ô nhập key ở Cài đặt (`type=password`), mặc định chỉ giữ trong bộ nhớ trang, chỉ lưu localStorage khi tick "Nhớ key"; `node scripts/scan-secrets.mjs .` trước push; ảnh minh chứng không lộ key |

## Sản phẩm / thời gian

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Hết giờ mà tính năng thứ 5 dang dở | Thêm tính năng ngoài đề, làm polish sớm | Lõi trước; polish sau T+40; cắt phụ |
| Điểm kiểm thử thấp | Ghi "Đạt" cho ca chưa chạy | Chỉ ghi ca đã chạy thật |
| Thư mục rác trong repo (`undefined/`, ảnh chụp) | Test ghi ảnh vào đường dẫn undefined | Test nhận thư mục ảnh qua `--shots <thư-mục>`, `.gitignore` thư mục ảnh (`shots*/`) |
| Quá nhiều hiệu ứng làm chậm bản trình diễn | Quá đà | 1–2 hiệu ứng nhấn, còn lại tinh tế; test trên máy yếu |
| Mobile bị bỏ quên | Chỉ test desktop | QA 390px bắt buộc ở T+48 |

---

## Bổ sung (đợt 2): lỗi thật còn thiếu ở các bảng trên

Mã `07-…` = đoạn chép-dán tương ứng trong `references/07-cookbook-code-mau.md`; `08-…` = `references/08-quy-uoc-viet.md`.

### Quy trình agent / kiểm chứng

| Triệu chứng | Nguyên nhân | Cách sửa / phòng |
|---|---|---|
| Agent "sửa" bằng cách đổi test cho đi vòng qua lỗi (nút Điền dữ liệu mẫu vẫn bị trang demo ghi đè) | Prompt chỉ yêu cầu "test xanh" | Prompt: "tìm nguyên nhân gốc trước, sửa app; chỉ sửa test khi test lỗi thời và nói rõ". Báo cáo nêu đã chọn đường nào |
| Test cũ chỉ in kết quả, điều phối viên phải grep "lỗi/fail" mới biết hỏng | Không trả mã thoát | Mọi `tests/*.cjs` kết thúc `process.exit(failed ? 1 : 0)` (`07` H1) |
| Một loạt test đỏ sau khi đổi tab mặc định / hành vi khách | Test giả định tab đầu cũ | Helper mở đúng tab trước khi thao tác (`tests/auto-tab.cjs`); test không dựa vào trạng thái mặc định |
| Test "Esc đóng xem trước" lúc được lúc không | Chờ khoảng cố định; listener khác nuốt phím | Chờ dialog đóng hẳn bằng `waitForFunction`; Esc xử lý ở listener capture đầu tiên (`07` H3) |
| Test tự động không thấy dữ liệu mẫu/popup | Code bỏ qua khi `navigator.webdriver` | Đã chủ đích: demo cần `?demo=1`, popup cần `?popup=1`; viết vào comment đầu file để agent sau khỏi tìm |
| Agent trong sandbox không chạy được test Firebase/emulator | Không có Java/emulator/quyền Firebase | Điều phối viên tự chạy sau merge (`07` G5); báo rõ "phần này chưa chạy" cho đến lúc chạy |
| Agent không tái hiện được lỗi (chạy 3/3 lần vẫn qua) | Lỗi phụ thuộc máy thật/thời điểm | Làm biện pháp phòng ngừa + **nói thẳng "chưa xác nhận"**, nhờ người dùng thử trên máy thật và gửi ảnh; không viết "đã sửa" |
| Automation không vuốt/đổi thanh địa chỉ như điện thoại thật | Chrome giả lập khác máy thật | Chụp bằng viewport điện thoại (`isMobile`, `hasTouch`), ghi "chưa thử trên điện thoại thật"; hỏi người dùng đã bật "giảm chuyển động" chưa |
| Sửa lỗi A làm mất tính năng B (đổi theme ngay sau chuyển tab hết hiệu ứng) | Sửa chữa không có test bảo vệ | Mỗi lần sửa thêm 1 test hồi quy + chụp giữa lúc chuyển (`07` H4); so với bản còn đúng trước đó |
| Push bản ghép chưa test làm web thật hỏng ngay | Nhánh Pages = nhánh production | Ghép/test ở nhánh khác; chỉ đẩy sang nhánh Pages khi test xanh (`07` G6) |
| Phiên làm việc bị nén/khởi động lại, mất mạch | Ngữ cảnh đầy | Cập nhật `docs/PROGRESS.md` + `docs/DECISIONS.md` sau mỗi đợt; prompt tiếp nối nêu "đã làm gì rồi" |
| Cây git bẩn khi kết thúc (stop-hook nhắc) | Quên commit | Cuối mỗi đợt: commit + `git pull --no-edit origin <nhánh>` + push |
| Thư mục video quay màn hình/ảnh thử bị commit | `.gitignore` thiếu | `demo-video/`, `shots*/`, `undefined/`, `.agents/`, `.claude/` (`07` H8) |

### Giao diện / mobile / animation (bổ sung)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Vòng tròn đổi sáng/tối không phủ tới góc dưới trái trên Android | Bán kính tính theo `innerHeight` khi thanh địa chỉ co lại | Bán kính theo `visualViewport` + kích thước lớn nhất (`07` B3) |
| Đổi theme ngay sau khi chuyển tab thì mất vòng tròn | Cờ `data-vt` của transition trước xoá cờ của transition sau | Mỗi transition chỉ dọn cờ của chính nó; vòng tròn chạy bằng WAAPI, không phụ thuộc selector CSS |
| Người dùng báo "mất animation" nhưng test vẫn xanh | Máy bật Giảm chuyển động/Xoá hiệu ứng động | Hỏi cài đặt đó trước; có công tắc Bật/Theo máy/Tắt trong app (`07` B5); chụp khung hình để chứng minh |
| Khung xem trước (dialog) không chạy hiệu ứng cuộn (timeline, đếm số) | Observer chỉ nghe cuộn của cả trang, dialog tự cuộn bên trong | `IntersectionObserver` với `root` = khung cuộn gần nhất (`07` B8); tắt hiệu ứng nặng khi lướt Reels nhưng bật lại khi mở xem trước |
| Reels (lướt dọc từng mẫu) chờ ~1 giây mới định khung, giật | Tự viết quán tính JS | `scroll-snap` native + lazy mount từng khung; chỉ hiệu ứng nhẹ khi đang vuốt |
| Landing không cuộn được khi vuốt nhanh trên điện thoại | Khung landing là vùng cuộn lồng; ảnh bìa trôi bằng `background-position` | Bỏ `overflow` ở khung landing, trôi bằng `transform`, hiện nội dung trước khi vào màn hình (`07` B8, C10) |
| Dải trắng cuối trang mobile dù đã dùng `dvh` | Thanh CTA dính đang ẩn vẫn chiếm chỗ (~69px) | Khung dính cao 0 + thanh `position: absolute` (`07` C6) |
| Diễn giả xếp 2+1 ô lẻ; 4 ô đếm ngược thành 3+1 | Lưới `auto-fill` không biết số phần tử | 1 cột trên điện thoại hoặc `:has()` theo số phần tử; đếm ngược `repeat(4, 1fr)` (`07` C5, C10) |
| Hai nút đè lên ảnh xem trước của thẻ mẫu trên điện thoại | Nút chỉ hiện khi rê chuột, đặt chồng lên ảnh | `@media (hover: none)` đưa nút xuống hàng chân thẻ (`07` C4) |
| Đường kẻ thanh bước đi xuyên qua nội dung | Đường dài hơn khoảng giữa hai chấm | Đường chạy đúng từ tâm chấm đầu tới tâm chấm cuối ở mọi bề rộng; nhãn cho phép 2 dòng căn giữa trên mobile |
| Thanh xem trước dạng viên thuốc rớt 2 dòng, cắt mất chữ, lệch góc bo | `border-radius: 999px` + nội dung dài | Điện thoại: hình chữ nhật bo bằng khung bên dưới, một hàng, `…` cho tên dài, nút ✕ chỉ icon (`07` C8) |
| Ô tích (checkbox) có khung xám như ô nhập | Kiểu `input` áp cho mọi loại input | `input:not([type=checkbox])…` và `label.check` bấm chữ cũng tích (`07` C3) |
| Khối đã ẩn (`hidden`) hiện lại trong file HTML xuất | Class có `display:flex` thắng thuộc tính `hidden` | `[hidden] { display: none !important }` cả trong CSS xuất (`07` C2) |
| Dấu tiếng Việt chạm nhau ở tiêu đề lớn | `line-height` 1.1 | Tiêu đề ≥ 1.25–1.3 (`07` C8) |
| Nhãn mô phỏng AI trên thanh công cụ rớt thành 4 dòng nhỏ | Thanh `flex` hẹp, nhãn không `nowrap` | Desktop một dòng (`nowrap`), từ 1101px thanh xuống dòng để nhãn nằm riêng, dưới 1100px rút `…` kèm `title` đầy đủ (`07` E4) |
| Thông báo (toast) che ô nhập trên điện thoại; ô nhập tự phóng to | Toast ở đáy; ô nhập < 16px | Toast ở mép trên mobile; mọi ô nhập `font-size: 16px` (`07` C7) |
| Nút Đăng ký ở đầu trang vẫn hiện khi sự kiện đã qua (form đã ẩn) | Chỉ ẩn form, quên các CTA khác | Mọi CTA (hero, cuối trang, thanh dính, file xuất) đổi thành nhãn không bấm được (`07` D3) |
| Hiệu ứng nặng/giật khi kéo thanh trượt, kéo thả | Vẽ lại mỗi lần nhích chuột; dời bằng `top/left` | ≤ 1 lần vẽ mỗi khung hình (`rAF`), dời bằng `transform` (FLIP) (`07` B6, B7); đo trước/sau, báo số thật |

### Dữ liệu / AI / chia sẻ (bổ sung)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Link chia sẻ thấy một chút khung builder trước khi trang hiện | Khung app hiện trước khi JS biết đây là link công khai | Script `<head>` gắn class `boot-public` ẩn khung (`07` F3) |
| Meta OG đúng nhưng Facebook vẫn hiện bản cũ | Facebook/Zalo cache bản xem trước | Dán **link mới** (`/s/<id>/`), Sharing Debugger → Scrape Again; đừng hứa là đã chạy trên Facebook khi chưa thử (`07` F2) |
| Cần trang chia sẻ riêng nhưng không có máy chủ | Pages tĩnh; Firebase Functions cần trả phí | `tools/build-share-pages.cjs` sinh `s/<id>/index.html` ở máy, commit vào repo; chạy lại khi đổi nội dung |
| Ảnh tải lên bị báo "quá lớn/dung lượng đầy" | Giới hạn localStorage ~5MB, tài liệu Firestore 1MB | Tự nén theo trần từng loại ô, nén lại ảnh nặng nhất khi cả trang vượt ngân sách; báo "từ X xuống Y" (`07` D8); kho ảnh lớn dùng IndexedDB (`07` D9) |
| Tìm "cuoi" không ra "cưới" | So khớp có dấu | Chuẩn hoá `NFD` bỏ dấu + `đ→d` cả hai phía (`07` D10) |
| Bộ lọc chỉ có một nhãn chiếm 22/25 mẫu | Gán nhãn lệch khi agent sinh hàng loạt | Validator của đợt sinh dữ liệu kiểm phân bố; gán lại nhãn riêng rồi mới bật bộ lọc (`07` I1) |
| README ghi "172 mẫu" mà app có số khác | Sửa dữ liệu quên sửa tài liệu | Test so số trong README với `EP…length` (`07` H7) |
| Giới thiệu Firebase/Sheet như nơi lưu chính nên bị nhận xét "chưa đúng tính năng" | Đề quy định localStorage | Bản chính đúng đề; Firebase/Sheet nói rõ là tuỳ chọn trong README và khi trình bày (`07` G mở đầu) |
| Đăng nhập Google lỗi `auth/unauthorized-domain` trên Pages | Chưa thêm `<tài-khoản>.github.io` vào Authorized domains | `07` G1 bước 4; mở qua `file://` cũng không đăng nhập được |
| Tính năng lưu theo tài khoản không chạy trên web thật dù test emulator xanh | Rules mới chưa Publish lên dự án Firebase thật | `npx firebase deploy --only firestore:rules` hoặc dán vào Console → Rules → Publish; ghi vào danh sách việc người dùng phải làm |
| Gemini báo 404 model | Tên `-preview` bị đổi/gỡ; bảng model của tài liệu chưa xác minh | Danh sách model + `FALLBACKS`; đối chiếu `ai.google.dev` khi có mạng; mục "(?)" là chưa xác minh |
| Người dùng dán API key (EverAI, Gemini...) vào chat | Quên quy tắc | Không ghi key vào file/commit/ảnh/README; chỉ dùng trong lệnh tạm nếu bắt buộc, nhắc thu hồi/đổi key sau đó; `scan-secrets` trước push |
| Bản ghi minh chứng AI không còn đoạn chat gốc | Lịch sử bị nén | Chụp và ghi `docs/MINH-CHUNG-AI.md` ngay lúc làm (`07` H6) |
| Bảng A hay B? Hạn nộp 23:59 hay 00:30? | Thông tin lệch giữa thông báo, cô và README | Hỏi/đối chiếu ngay ở T+0; làm theo mốc sớm nhất; ghi quyết định vào `DECISIONS.md` |

=================== FILE: references/05-thuyet-trinh-va-hoi-dap.md ===================
# 05 — Thuyết trình, demo trực tiếp và hỏi đáp

Thời lượng tổng thường ~5–7 phút trình bày + 5 phút hỏi đáp (xác nhận lại với BTC ngay khi bốc đề). Slide dựng từ `deck/` bởi deck agent (`node deck/tools/capture.cjs` chụp ảnh **thật** từ app, `node deck/tools/export.cjs` xuất PDF dự phòng vào `deck/out/`).

## Cấu trúc 5–7 phút (12 slide của `deck/`, ~6:50)

Dựng bằng `deck/` (điền dữ liệu `deck/deck.data.js`, không sửa layout; chi tiết ở `deck/README.md`). Phím: `←/→` chuyển, `N` ghi chú + đồng hồ, `F` toàn màn hình, `Ctrl+P` in PDF.

| # | Slide (`type`) | Nội dung | Giờ |
|---|---|---|---|
| 1 | cover | Chào, tên đội + app + khẩu hiệu 1 dòng, đề số, bảng thi | 0:15 |
| 2 | problem | 1 persona, 1 nỗi đau có số/ví dụ thật | 0:40 |
| 3 | solution | Giải pháp trong 1 câu, chỉ vào ảnh | 0:30 |
| 4 | features | 5 tính năng, nhấn 1–2 quy tắc nghiệp vụ | 0:40 |
| 5 | flow | 3–5 bước dùng | 0:30 |
| 6 | demo | **Demo trực tiếp** (xem kịch bản); mất mạng thì video/ảnh | 1:30 |
| 7 | ai | AI để xây vs AI trong sản phẩm; thật vs mô phỏng (nhãn nguyên văn đề/BTC); prompt → kiểm tra → dự phòng | 0:50 |
| 8 | quality | Bảng ca kiểm thử (số thật), mobile, sáng/tối, nói thẳng lỗi còn lại | 0:40 |
| 9 | metrics | 3–4 con số kiểm chứng được | 0:25 |
| 10 | roadmap | Giới hạn thật + bước tiếp theo | 0:20 |
| 11 | team | Vai trò | 0:15 |
| 12 | thanks | QR + link, mời "Hỏi đáp" | 0:15 |

Chỉ có 5 phút: bỏ slide 5 và 11, rút demo còn 1:00. Slide AI: nếu app dùng mock, ghi đúng câu nhãn mà BTC yêu cầu (chép nguyên văn, không dùng câu vòng loại `Bản demo vòng loại - Dữ liệu mô phỏng AI` nếu đề chung kết khác).

Luật slide: một ý mỗi slide, chữ ≥ 28pt, ảnh chụp app thật thay vì minh hoạ chung, tiếng Việt có dấu, không đọc nguyên slide.

## Kịch bản demo trực tiếp (2–2.5 phút)

1. Mở **link online** (tab đã tải sẵn, đã tải trước dữ liệu demo). Cửa sổ trình duyệt 100% zoom, đóng thông báo/tab khác.
2. Nói 1 câu bối cảnh người dùng ("Chị Lan là chủ quán...").
3. Đi **đúng luồng 5 tính năng theo thứ tự đề**, mỗi cái 20–30 giây, tập trung kết quả thấy được.
4. Chèn **1 ca đầu vào sai** (email sai → thấy cảnh báo) và **1 ca biên** (trùng/hết hạn) — để lộ nghiệp vụ.
5. Chỉ nhãn mô phỏng AI (nếu dùng mock; đúng câu BTC yêu cầu) hoặc gọi AI thật bằng key nhập sẵn ở Cài đặt (tick "Nhớ key" chỉ trên máy cá nhân).
6. Chuyển Sáng/Tối 1 lần, thu nhỏ cửa sổ/điện thoại thật để thấy mobile.
7. Kết: quay về slide giới hạn.

Tập demo **ít nhất 2 lần đầy đủ** ở T+52→58 với đồng hồ. Phân vai: 1 người nói, 1 người thao tác (hoặc 1 người làm cả hai nếu ít người).

## Phương án dự phòng (chuẩn bị trước T+52)

- **Video quay màn hình ≤ 2 phút** (5 tính năng) lưu sẵn trên máy + USB/điện thoại; mở được offline.
- **Bản local:** `python3 -m http.server 8211` trong thư mục app (rồi mở `http://localhost:8211/?demo=1`) (hoặc mở `index.html` bằng `file://` nếu app không cần server).
- **Ảnh chụp 5 tính năng** trong slide phụ ("Dự phòng") nếu cả hai đều hỏng.
- Quy tắc: demo hỏng >10 giây → chuyển sang dự phòng, **đừng sửa trực tiếp trên sân khấu**. Nói bình tĩnh: "Mạng đang chậm, em chuyển sang bản quay sẵn".
- Dữ liệu demo đặt lại bằng nút "Nạp lại dữ liệu demo" ở Cài đặt (hoặc mở `?demo=1`) trước khi vào phòng.

## Hỏi đáp Bảng B (cách dùng, nghiệp vụ, quá trình cải thiện AI)

Chuẩn bị 1 câu trả lời 20–30 giây cho từng câu; ai trả lời đã phân sẵn.

**Cách dùng**
- Người dùng bắt đầu từ đâu, mất bao lâu để hoàn thành việc chính? (đo bằng số thật: "dưới 3 phút")
- Ai là người dùng chính, họ dùng mỗi ngày/tuần ra sao?
- Nếu người dùng nhập sai thì sao? (chỉ ca validation đã demo)

**Nghiệp vụ**
- Quy tắc nghiệp vụ chính là gì, vì sao chọn vậy? (nêu theo Input→Quy tắc→Output→Lưu trữ)
- Xử lý trùng / hết hạn / hết chỗ / dữ liệu rỗng thế nào?
- Dữ liệu lưu ở đâu, mất khi nào? (nói thật: localStorage trên 1 máy; hướng phát triển: cloud)
- Khác gì cách làm thủ công / công cụ hiện có? Giá trị đo được?

**Quá trình cải thiện AI**
- Prompt đầu tiên là gì, lỗi gì xuất hiện, sửa thế nào? Cho **một ví dụ trước/sau thật** (có ảnh trong minh chứng AI).
- AI nào dùng để *xây* (Claude Code...) và AI nào dùng *trong sản phẩm*? Phần nào mock?
- Kiểm soát đầu ra: schema/parse JSON chịu lỗi, thiếu trường thì bù, dữ kiện chính xác lấy từ form không để AI bịa.
- Khi AI sai thì app xử lý ra sao? Nhãn mô phỏng ở đâu?
- Cách chia việc cho nhiều agent song song, kiểm chứng bằng test và ảnh chụp.

**Bảng A bổ sung** (nếu thi bảng A): vì sao chọn vanilla/không build; cách tách module; cách test (số ca, e2e); bảo mật key (không vào code, `***`, người dùng tự nhập); xử lý lỗi mạng/AI; thiết kế dữ liệu.

**Mẹo trả lời:** nhận giới hạn trước khi bị hỏi; chỉ nói điều đã chạy thật; "chưa làm, sẽ làm như sau..." tốt hơn nói quá. Không nói "AI làm hết".

## Việc cần có trước khi vào phòng

- [ ] Link online mở được trên điện thoại (QR trên slide cuối).
- [ ] Video dự phòng + bản local chạy.
- [ ] 1 người học thuộc 3 số: số tính năng đạt, số ca kiểm thử đạt, thời gian hoàn thành luồng chính.
- [ ] Phân vai nói/thao tác, tập đủ giờ.

=================== FILE: references/06-ho-so-va-trien-khai.md ===================
# 06 — Hồ sơ nộp và triển khai

## Triển khai GitHub Pages (nhánh `claude/*`)

Xclipse chạy GitHub Pages từ nhánh `claude/<tên>`; `scripts/new-project.sh` tạo nhánh mặc định `nop-bai` (đổi bằng `BRANCH=...`). Cách làm nhanh (chi tiết cùng `starter/README.md` mục 5):

1. Repo của đội đã có nhánh làm việc `claude/<tên>` (do Claude Code tạo). Đẩy code app (file `index.html` ở **gốc** repo hoặc thư mục Pages đã chọn).
2. GitHub → repo → **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*; Branch = `claude/<tên>`, thư mục `/ (root)`; Save. (Nếu repo không cho chọn nhánh này, đội tạo nhánh `main`/`gh-pages` từ nhánh làm việc và chọn nhánh đó.)
3. Link: `https://<tài-khoản>.github.io/<tên-repo>/`. Lần đầu chờ 1–5 phút; xem tab **Actions** (pages-build-deployment) xanh là xong.
4. Tạo `.nojekyll` ở gốc: thư mục `features/_example` và `features/_playground` của starter bắt đầu bằng `_` nên Jekyll sẽ bỏ qua (nếu còn giữ). Tốt nhất xoá hai thư mục mẫu đó khi đã có feature thật.
4b. Chuẩn bị một lần: repo kết nối Claude GitHub App (`claude.ai/connect-github`), mở phiên **mới** có chọn repo; không push được/không thấy repo → làm lại bước này. Claude không tự tạo Pull Request nếu không được yêu cầu (Pages lấy thẳng từ nhánh). Link 404 = sai nhánh/thư mục hoặc không có `index.html` ở gốc; web trắng = app cần build (React/Vite) → làm bản HTML/JS thuần.
4c. **Nhánh Pages là nhánh production**: mỗi push là web đổi. Ghép và test ở nhánh khác, chỉ đẩy khi xanh (chi tiết: `07` G6).
5. Đường dẫn trong app phải **tương đối** (`css/app.css`, không `/css/app.css`) vì Pages nằm dưới `/<tên-repo>/`.
6. Kiểm tra: mở link ở cửa sổ ẩn danh + trên điện thoại; chân trang hiện đúng phiên bản.

Trước khi push (điều phối viên):

```
node --check js/*.js features/*/feature.js
node tools/bump-version.cjs       # tăng patch trong js/version.js + gắn ?v= (minor | major | 1.2.3 | --stamp)
node scripts/scan-secrets.mjs .   # phải sạch (mã thoát 0)
# chạy test đầy đủ trên http://localhost:8211/
node tests/smoke.cjs http://localhost:8211/ --shots shots-final
git add -A && git commit -m "..." && git push -u origin <nhánh>
```

## Cache

- Mọi `<script src>` và `<link href>` nội bộ có `?v=<phiên bản>`; `node tools/bump-version.cjs` làm việc này mỗi lần phát hành.
- Sau push, trang cũ có thể còn 1–10 phút: Ctrl+F5, kiểm tra phiên bản ở chân trang; nếu chưa đổi → xem Actions.
- Khi demo ở giám khảo: mở link trước, nhấn tải lại cứng, xác nhận phiên bản.

## Firebase (tuỳ chọn, chỉ khi đề cần dữ liệu chung nhiều thiết bị)

- 60 phút: **mặc định localStorage**, ghi rõ giới hạn. Firebase chỉ khi đề yêu cầu đồng bộ; cấu hình web Firebase công khai được nhưng phải có rules bảo vệ; tuyệt đối không đưa service account/secret.
- Repo VibeCodeLandingPageBuilder (không nằm trong skill này) có thư mục `firebase/` (`firestore.rules`, `rules.test.mjs`) để tham khảo; starter KHÔNG có sẵn Firebase, không bắt buộc.
- **Làm Firebase từ đầu:** `references/07-cookbook-code-mau.md` mục G (dựng project 6 bước kể cả **Authorized domains = `<tài-khoản>.github.io`**, khởi tạo compat không CDN + emulator `?emulator=1`, đăng nhập Google + dịch lỗi, rules khách-chỉ-gửi/chủ-đọc/chống trùng bằng mã bản ghi = SĐT, ghi batch + thử lại, test rules bằng emulator 33 ca, Publish rules bằng `npx firebase deploy --only firestore:rules` hoặc dán vào Console). Cấu hình web Firebase công khai được; **không** đưa service account, **không** bật billing, **không** dùng Cloud Functions (trả phí).
- **Đề đã quy định nơi lưu (thường localStorage) thì đó là bản chính**; Firebase/Google Sheet chỉ là tuỳ chọn và phải được nói đúng như vậy trong README và khi trình bày (đã bị nhận xét "chưa đúng tính năng" vì làm ngược).
- Rules mới phải **Publish lên dự án thật** thì tính năng mới chạy trên web; ghi vào danh sách việc người dùng phải tự làm (đánh số).
- Môi trường agent thường không có emulator/quyền Firebase: điều phối viên chạy test Firebase ở máy có Java sau merge và báo phần chưa chạy.

## Hồ sơ nhanh (điền từ `templates/`)

| Hồ sơ | Làm thế nào trong ~5 phút | Ai |
|---|---|---|
| README | Chép mẫu: đề số, tên đội, bảng, link demo, 5 tính năng, cách chạy local, AI dùng (xây + trong sản phẩm), nhãn mô phỏng nguyên văn, giới hạn, nguồn tham khảo/khai báo template-thư viện-AI, **không key** | Docs agent (Haiku) |
| Bảng kiểm thử | Từ bảng nghiệm thu spec: chạy ca thật, ghi kết quả thực tế + ngày + lệnh. B ≥3 ca, A ≥6 ca (2 thường, 2 sai, 2 biên) | QA agent chạy, Docs agent ghi |
| Minh chứng AI | ≤1 trang + 5 ảnh: prompt đội gửi AI, kết quả, lỗi, prompt sửa, kết quả sau; chụp từ hội thoại thật; che key/email/SĐT | Đội chụp, Docs agent ghép |
| Video ≤2 phút | Quay màn hình thao tác thật trên link online, đủ 5 tính năng (nếu đề yêu cầu) | Đội |
| Source | Đẩy repo; nếu cần ZIP: `git archive HEAD -o app.zip` (không `.git`, không `.env*`, không `node_modules`); giải nén thử ở thư mục mới và mở | Điều phối |
| Slide | `deck/` → `node tools/export.cjs` (trong `deck/`) → `deck/out/<tên>.pdf` (thư mục `out/` git-ignore, mang theo riêng) | Deck agent |

Ghi hồ sơ thật: ca chưa thử thì ghi "Chưa kiểm chứng", không ghi "Đạt".

## Quét secret trước khi push/nộp

`scripts/scan-secrets.mjs` (đã được `new-project.sh` chép vào `scripts/` của dự án) quét thư mục theo mẫu key phổ biến (AIza…, AQ., sk-…, ghp_…, AKIA…, private key, token dài), và nếu có `.env.local` thì tìm đúng các GIÁ TRỊ bí mật của file đó; **chỉ in tên mẫu/biến, vị trí và số dòng, không in giá trị**. Mã thoát: 0 sạch, 1 có chỗ lộ, 2 sai cách dùng.

```
node scripts/scan-secrets.mjs . .env.local     # có file env
node scripts/scan-secrets.mjs .                # không có
# chạy từ skill nếu chưa chép:  node skills/vibe-sprint/scripts/scan-secrets.mjs <thư-mục-app> [<.env.local>]
```
Có thể quét thêm bằng grep mẫu phổ biến:

```
git ls-files -z | xargs -0 grep -nEI "[mẫu key Google] khóa riêng]"]?\s*[:=]\s*['\"][^'\"]{12,}" | cut -c1-120
```
Kết quả phải rỗng (trừ `js/firebase-config.js` công khai có chủ ý: script in dòng [CHO PHÉP], ghi chú trong README). Kiểm tra cả ảnh chụp minh chứng (không lộ key). Lỡ lộ key → thu hồi/tạo key mới, không chỉ xoá commit.

## Checklist T+48 trước khi nói "xong"

- [ ] Test xanh (kết quả thật) trên bản đã merge.
- [ ] `node scripts/scan-secrets.mjs .` sạch.
- [ ] `node tools/bump-version.cjs` đã chạy (phiên bản + `?v=`); link online mở ở ẩn danh, đúng phiên bản.
- [ ] Mobile 390px không tràn ngang; sáng/tối ổn.
- [ ] Nhãn mô phỏng đúng **nguyên văn đề/BTC** (từng chữ, từng dấu; không mặc định câu vòng loại `Bản demo vòng loại - Dữ liệu mô phỏng AI`), khớp ở `js/config.js`, README, bảng kiểm thử, slide và `tests/smoke.cjs`.
- [ ] README + bảng kiểm thử + minh chứng đủ; không key.
- [ ] Video/bản local/ảnh dự phòng sẵn sàng.

=================== FILE: references/07-cookbook-code-mau.md ===================
# 07 — Cookbook: đoạn mã mẫu chép-dán (mỗi đoạn ≤ 15 dòng)

Rút từ code thật của Xclipse (`js/`, `css/`, `tools/`, `tests/`, `firebase/`, `s/`) và từ các lỗi đã gặp. Dán đoạn liên quan vào prompt agent. Đoạn nào starter đã có sẵn thì ghi rõ `starter` để dùng bản của starter, không viết lại. Cổng thi tự chọn trong bảng cổng (không 8000). Biến `{{...}}` là chỗ phải điền.

Mục lục: A Phát hành & cache · B Sáng/tối & chuyển động · C Gotcha CSS/mobile · D Form, dữ liệu, tiện ích · E AI · F SEO & chia sẻ · G Firebase, Pages, Sheet · H Test, minh chứng, git · I Dữ liệu sinh hàng loạt.

---

## A. Phát hành & cache

### A1. Cache-busting `?v=` (cốt lõi của `tools/bump-version.cjs`, starter đã có bản đầy đủ)
```js
// node tools/bump-version.cjs  (đọc version trong js/version.js rồi gắn ?v= cho mọi js/css nội bộ)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const v = fs.readFileSync(path.join(root, 'js/version.js'), 'utf8').match(/version: '([^']+)'/)[1];
['index.html', '404.html'].forEach((name) => {
  const f = path.join(root, name); if (!fs.existsSync(f)) return;
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace(/(<script (?:defer )?src="(?:js|features)\/[\w./-]+\.js)(\?v=[^"]*)?"/g, '$1?v=' + v + '"')
    .replace(/(<link rel="stylesheet" href="css\/[\w.-]+\.css)(\?v=[^"]*)?"/g, '$1?v=' + v + '"'));
});
```
Gotcha: **hotfix nào cũng phải bump** (đã có lần vá xong mà "chưa tăng số phiên bản nên máy khách còn bản cũ"). Sau push: đóng tab, mở lại, Ctrl+Shift+R, đọc số phiên bản ở chân trang.

### A2. Chân trang hiện phiên bản + commit đang chạy trên nhánh Pages (`js/version.js` của Xclipse)
```js
// Chỉ hỏi GitHub khi chạy trên *.github.io; cache sessionStorage 10 phút; lỗi mạng thì chỉ hiện số phiên bản.
if (!/github\.io$/.test(location.hostname)) return;
fetch('https://api.github.com/repos/{{owner}}/{{repo}}/commits/{{nhánh-pages}}', { headers: { Accept: 'application/vnd.github+json' } })
  .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then((d) => { el.textContent = 'commit ' + String(d.sha).slice(0, 7); el.href = d.html_url; })
  .catch(() => { /* hết lượt GitHub: bỏ qua, không báo lỗi */ });
```

---

## B. Giao diện sáng/tối & chuyển động

### B1. Chống nháy sáng/tối: script **đồng bộ trong `<head>`**, trước CSS (`starter/index.html` đã có)
```html
<script>(function(d){try{var t=localStorage.getItem('ep_theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})(document.documentElement);</script>
```
Khoá phải trùng `<prefix>theme`; đổi `prefix` thì đổi luôn chuỗi này. Không chọn gì = bỏ attribute, CSS theo `prefers-color-scheme`.

### B2. CSS 3 chỗ cho mỗi bộ màu (sáng, tối theo hệ thống, tối thủ công)
```css
:root { --bg: #fff; --text: #16151b; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0b0c12; --text: #eceaf4; } }
:root[data-theme="dark"] { --bg: #0b0c12; --text: #eceaf4; }
body { background: var(--bg); color: var(--text); }   /* nền body theo biến: hết chớp trắng khi đổi tab */
```

### B3. Đổi sáng/tối bằng vòng tròn loang (View Transitions) — MỘT hàm cho mọi nút (`EP.theme`, starter có sẵn)
```js
function setTheme(mode, origin) {                     // mode: 'light' | 'dark' | 'system'
  const de = document.documentElement, apply = () => mode === 'system' ? de.removeAttribute('data-theme') : de.setAttribute('data-theme', mode);
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
  const vv = visualViewport, r = origin && origin.getBoundingClientRect();
  const w = Math.max(innerWidth, de.clientWidth, vv ? vv.width + vv.offsetLeft : 0);   // thanh địa chỉ Android co/giãn
  const h = Math.max(innerHeight, de.clientHeight, vv ? vv.height + vv.offsetTop : 0);
  const x = r ? r.left + r.width / 2 : w / 2, y = r ? r.top + r.height / 2 : 0;
  const rad = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;    // tới góc xa nhất
  de.setAttribute('data-vt', 'theme');
  const t = document.startViewTransition(apply);
  t.ready.then(() => de.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
    { duration: 550, easing: 'ease-in-out', fill: 'both', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  t.finished.finally(() => de.removeAttribute('data-vt'));   // mỗi lần chỉ dọn cờ của chính nó
}
```
Quy tắc rút từ 4 lần vỡ: **chỉ MỘT animation trên `::view-transition-new(root)`**; tâm = giữa nút bấm; bán kính theo `visualViewport` (nếu không, góc dưới trái không đổi màu trên Android); dọn cờ `data-vt` theo từng transition (đổi theme ngay sau chuyển tab từng làm hiệu ứng biến mất); máy bật "giảm chuyển động" thì đổi ngay.

### B4. CSS đi kèm vòng tròn (không có thì thanh trên bị nhân đôi/ma)
```css
.topbar { view-transition-name: topbar; }
html[data-vt="theme"] body * { view-transition-name: none !important; }  /* bỏ mọi tên riêng khi đổi theme */
html[data-vt="theme"]::view-transition-group(root) { animation: none; }
html[data-vt="theme"]::view-transition-old(root),
html[data-vt="theme"]::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html[data-vt="theme"]::view-transition-old(root) { z-index: 1; } html[data-vt="theme"]::view-transition-new(root) { z-index: 2; }
html.motion-off *, html.motion-off *::before, html.motion-off *::after { animation: none !important; transition: none !important; }
```

### B5. Cài đặt hiệu ứng 3 mức + tôn trọng "giảm chuyển động"
```js
// pref: 'on' (mặc định, luôn có) | 'system' (theo máy) | 'off'. Toggle class html.motion-off (CSS ở B4).
const mq = matchMedia('(prefers-reduced-motion: reduce)'); let pref = 'on';
try { pref = localStorage.getItem('ep_motion') || 'on'; } catch (e) {}
const reduced = () => pref === 'off' || (pref === 'system' && mq.matches);
const apply = () => document.documentElement.classList.toggle('motion-off', reduced());
mq.addEventListener('change', apply); apply();
```
Gotcha: người dùng Android bật "Xoá hiệu ứng động/Giảm chuyển động" sẽ **không thấy** vòng tròn. Khi họ báo "mất animation", hỏi cài đặt này trước.

### B6. Gộp vẽ lại thanh trượt (≤1 lần mỗi khung hình) và debounce ô tìm kiếm
```js
let raf = 0; const onSlide = (v) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => render(v)); };
const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
search.addEventListener('input', debounce(() => renderList(search.value)));
```

### B7. FLIP: thẻ trượt nhường chỗ khi kéo thả/đổi bố cục (chỉ `transform`)
```js
const before = new Map([...cards].map((n) => [n.dataset.id, n.getBoundingClientRect()]));
reorder();                                                       // đổi DOM
cards.forEach((n) => { const a = before.get(n.dataset.id), b = n.getBoundingClientRect(); if (!a) return;
  const dx = a.left - b.left, dy = a.top - b.top;
  if (dx || dy) n.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); });
```
Đừng dời thẻ bằng `top/left` từng nhích chuột (trình duyệt reflow cả trang; từng đo 317 ms khựng) và đừng để `transform: scale` đè lên khi kéo.

### B8. Hiện dần theo cuộn: lắng nghe **đúng khung đang cuộn** và hiện trước khi vào màn hình
```js
const scroller = (el) => { for (let n = el.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (/(auto|scroll)/.test(o) && n.scrollHeight > n.clientHeight) return n; } return null; };
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
  { root: scroller(container), threshold: 0, rootMargin: '0px 0px 25% 0px' });   // 25%: vuốt nhanh không thấy khoảng trắng
container.querySelectorAll('.reveal').forEach((n) => io.observe(n));
```
Lỗi cũ: xem trước trong dialog tự cuộn bên trong, observer chỉ nghe `window` nên timeline không chạy. Reveal ≤ 450 ms, quãng trượt nhỏ.

### B9. Số chạy lên (count-up), chỉ khi ≥ 10 và không giảm chuyển động
```js
function countUp(el, to, ms = 700) {
  if (reduced() || !Number.isFinite(to) || to < 10) { el.textContent = to.toLocaleString('vi-VN'); return; }
  const t0 = performance.now();
  (function tick(now) { const p = Math.min(1, (now - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('vi-VN'); if (p < 1) requestAnimationFrame(tick); })(t0);
}
```

---

## C. Gotcha CSS / mobile (mỗi mục từng là lỗi thật)

### C1. `@layer`: khai báo thứ tự một lần, CSS mới luôn vào `components`
```css
/* css/tokens.css (dòng đầu) */  @layer reset, tokens, base, components, utilities;
/* css/<tên>.css */              @layer components { .order-row { display: flex; gap: var(--gap); } }
/* Nội dung người dùng/xem trước (landing) để NGOÀI layer hoặc layer riêng nằm sau: tránh CSS app đè nó */
```
Sau merge đếm ngoặc: `python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"`.

### C2. `[hidden]` luôn thắng (bài học từ file HTML xuất bị hiện lại khối ẩn)
```css
[hidden] { display: none !important; }
.landing [hidden] { display: none !important; }   /* trong file xuất: .offer, .countdown, .btn display:flex sẽ đè hidden nếu thiếu dòng này */
```

### C3. Ô tích bị dính kiểu ô nhập (khung xám): chỉ áp kiểu cho ô chữ
```css
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]), select, textarea { border: 1px solid var(--control); min-height: var(--control-h); padding: 0 12px; }
input[type="checkbox"], input[type="radio"] { width: 18px; height: 18px; accent-color: var(--accent); }
.check { display: flex; gap: 8px; align-items: center; cursor: pointer; }   /* bấm vào chữ cũng tích: <label class="check"><input type="checkbox"> ... */
```

### C4. Điều khiển chỉ hiện khi rê chuột thì **biến mất trên cảm ứng**: mở sẵn + đưa nút khỏi đè ảnh
```css
@media (hover: none) {
  .card .acts { opacity: 1; }
  .tpl-tile .tile-actions { position: static; display: flex; gap: 8px; }  /* hai nút xuống hàng chân thẻ, không che ảnh xem trước */
}
```

### C5. Lưới 3 mục không được lẻ "2+1" trên mobile: 1 cột, hoặc đếm số phần tử bằng `:has()`
```css
.speakers { display: grid; grid-template-columns: 1fr; gap: 12px; }                 /* điện thoại: mỗi người một hàng */
@media (min-width: 640px) {
  .speakers { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }
  .speakers:has(> :nth-child(3):last-child) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .speakers:has(> :nth-child(2):last-child) { grid-template-columns: repeat(2, minmax(0, 220px)); justify-content: center; }
}
```

### C6. Dải trắng lạ cuối trang mobile: thanh CTA dính **đang ẩn** vẫn chiếm chỗ
```css
.sticky-wrap { position: sticky; bottom: 0; height: 0; }            /* khung 0px, thanh con absolute: ẩn đi không kéo dài trang */
.sticky { position: absolute; inset: auto 0 0; transform: translateY(110%); visibility: hidden; transition: transform .25s, visibility 0s .25s; }
.sticky.is-on { transform: none; visibility: visible; transition-delay: 0s; }
html, body { background: var(--bg); }                               /* vùng thừa nếu còn cũng cùng màu nền */
```
Các nguyên nhân khác của dải trắng: `min-height: 100vh` (dùng `100dvh`) và tên thương hiệu trong nút xuống dòng (`white-space: nowrap`).

### C7. Dialog/bottom sheet mobile + toast ở mép trên (không che ô nhập) + chống zoom iOS
```css
@media (max-width: 760px) {
  dialog.sheet { inset: auto 0 0 0; width: 100%; max-height: 90dvh; border-radius: 16px 16px 0 0; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); overscroll-behavior: contain; overflow-y: auto; }
  .toasts { top: 8px; bottom: auto; }
  input, select, textarea { font-size: 16px; }    /* <16px: iOS tự phóng to khi chạm ô */
  .btn, .tab { min-height: 44px; }
  .tabs { overflow-x: auto; scroll-snap-type: x proximity; overscroll-behavior-x: contain; }
}
```
Tab đang chọn phải tự cuộn vào giữa dải: `activeTab.scrollIntoView({ inline: 'center', block: 'nearest' })`.

### C8. Dấu tiếng Việt chạm nhau: tăng line-height tiêu đề; thanh nổi bo góc khớp khung
```css
.hero h1 { line-height: 1.28; }         /* 1.1 làm dấu "ệ", "ữ" của dòng trên chạm dòng dưới; mục tiêu ≥ 1.25 cho tiêu đề lớn */
.section h2 { line-height: 1.3; }
.brand-name, .btn .brand { white-space: nowrap; }
@media (max-width: 760px) { .preview-bar { border-radius: 24px; flex-wrap: nowrap; } .preview-bar .title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
```
Thanh dạng viên thuốc 999px rớt 2 dòng trên điện thoại sẽ cắt chữ: dùng hình chữ nhật bo 24px, một hàng, cắt chữ bằng `…`.

### C9. Vùng "luôn sáng" (landing/xem trước/giấy) không bị màn tối rò vào
```css
.landing, dialog.lp-reg, .paper { color-scheme: light; }
.landing input, .landing textarea { background: #fff; color: #16193a; border: 1px solid #d6d9e6; color-scheme: light; }
```

### C10. Khung cuộn lồng làm điện thoại "nuốt" cú vuốt nhanh
```css
.landing { overflow: visible; }               /* BỎ overflow:auto/scroll ở khung landing: chỉ để một thanh cuộn của cả trang */
.hero-bg { will-change: transform; }          /* ảnh bìa trôi bằng transform, KHÔNG animate background-position (vẽ lại ảnh lớn mỗi khung) */
.countdown { display: grid; grid-template-columns: repeat(4, 1fr); }   /* 4 ô đếm ngược luôn một hàng, hết "3+1" */
```

### C11. Màn Thiết kế khoá một màn hình để thanh trên và thanh công cụ không tách nhau khi zoom/cuộn
```css
.editor.view:not([hidden]) { height: calc(100dvh - var(--topbar-h, 56px)); min-height: 0; overflow: hidden; }
html.is-editor, html.is-editor body { height: 100%; overflow: hidden; overscroll-behavior: none; }
.editor .toolbar { position: sticky; top: 0; z-index: 20; }   /* chỉ MỘT container cố định, không sticky lồng sticky */
```

### C12. Icon: SVG nét, không emoji; mọi mục menu đều có icon, dấu ✓ nằm bên phải để icon thẳng cột
```html
<button class="mb-item"><svg class="ic" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span>Tạo trang mới</span><kbd>Ctrl+N</kbd><svg class="ck" hidden>…</svg></button>
```

---

## D. Form, dữ liệu, tiện ích

### D1. SĐT Việt Nam + email + thông báo tiếng Việt chuẩn (`starter/js/form.js` đã có; mẫu thông báo)
```js
const VN_MOBILE = /^0(3|5|7|8|9)\d{8}$/, EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalizePhone = (v) => { let d = String(v || '').trim().replace(/[\s.\-()]/g, '');
  if (d.startsWith('+84')) d = '0' + d.slice(3); else if (/^84\d{9}$/.test(d)) d = '0' + d.slice(2); return d; };
const phone = (v) => !String(v || '').trim() ? 'Vui lòng nhập số điện thoại.'
  : VN_MOBILE.test(normalizePhone(v)) ? '' : 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678).';
const email = (v) => !String(v || '').trim() ? 'Vui lòng nhập email.' : EMAIL.test(v.trim()) ? '' : 'Email không đúng định dạng (ví dụ: ten@gmail.com).';
const required = (v, nhãn) => String(v || '').trim() ? '' : 'Vui lòng nhập ' + nhãn + '.';
const maxLen = (v, n, nhãn) => String(v || '').trim().length > n ? nhãn + ' tối đa ' + n + ' ký tự.' : '';
```
Mẫu câu lỗi: nói **thiếu gì + ví dụ đúng**, đặt ngay dưới ô, `aria-live`, ô viền đỏ; không `alert()`. Xem thêm `references/08`.

### D2. Chặn đăng ký trùng / bấm đúp / hết chỗ → danh sách chờ / sự kiện đã qua
```js
function register(ev, input, count, now = new Date()) {
  const errors = validate(input); if (Object.keys(errors).length) return { ok: false, errors };
  const phone = normalizePhone(input.phone), mail = input.email.trim().toLowerCase();
  if (list(ev.id).some((r) => r.phone === phone || r.email === mail)) return { ok: false, errors: { form: 'Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.' } };
  if (now >= new Date(ev.startAt)) return { ok: false, errors: { form: 'Sự kiện đã diễn ra, không thể đăng ký thêm.' } };
  const waitlist = ev.capacity > 0 && count >= ev.capacity;                       // đủ chỗ: vẫn nhận nhưng vào danh sách chờ
  const rec = { id: newId('reg'), name: input.name.trim(), phone, email: mail, status: waitlist ? 'waitlist' : 'new', createdAt: now.toISOString() };
  return write(ev.id, [...list(ev.id), rec]) ? { ok: true, waitlist, record: rec } : { ok: false, errors: { form: 'Không lưu được dữ liệu (trình duyệt hết dung lượng hoặc chặn lưu trữ).' } };
}
// Nút gửi: khoá + "Đang gửi…" ngay lúc bấm để chặn bấm đúp; mở lại ở finally.
```

### D3. Trạng thái theo thời gian, không bao giờ đếm số âm
```js
const status = (ev, n, now = new Date()) => now >= new Date(ev.startAt) ? { code: 'ended', label: 'Sự kiện đã diễn ra', canRegister: false }
  : ev.capacity && n >= ev.capacity ? { code: 'full', label: 'Đã hết chỗ – vào danh sách chờ', canRegister: true, waitlist: true }
  : ev.capacity && n >= Math.ceil(ev.capacity * 0.9) ? { code: 'almost', label: 'Chỉ còn ' + (ev.capacity - n) + ' chỗ', canRegister: true }
  : { code: 'open', label: 'Đang mở đăng ký', canRegister: true };
const left = (ev, now = new Date()) => { const ms = new Date(ev.startAt) - now; return ms <= 0 ? null : { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) }; };
```
Đã qua: **mọi** nút đăng ký (hero, cuối trang, thanh dính, file HTML xuất) đổi thành nhãn "Sự kiện đã diễn ra" không bấm được; thanh dính vô hiệu. Cho phép truyền `now` giả để demo/test "tua thời gian".

### D4. localStorage an toàn (try/catch + rơi về bộ nhớ) và bộ sưu tập CRUD (`EP.store`/`EP.collection` của starter)
```js
const mem = {};
const store = {
  read(k, d) { try { const v = localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
  write(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); return true; } catch (e) { mem[k] = v; return false; } }   // false = hết dung lượng/bị chặn
};
const orders = EP.collection('orders');          // starter: add/update/remove/get/list/onChange
orders.add({ name: 'Đơn 1', total: 120000 }); orders.onChange(() => renderTable());
```
Ghi vào README/app: dữ liệu localStorage **chỉ nằm trên một trình duyệt**.

### D5. Dữ liệu demo có version, không bao giờ ghi đè dữ liệu người dùng; tự động hoá thì phải `?demo=1`
```js
EP.demo.register('orders', { version: 2, rows: [{ name: 'Nguyễn Văn An', total: 1250000, date: '2026-12-05' }] });   // ngày CỐ ĐỊNH, tương lai gần
// Bên trong: chỉ nạp khi collection rỗng, hoặc version tăng mà người dùng chưa sửa dòng nào. ?demo=1 hoặc nút "Nạp lại dữ liệu demo" mới xoá rồi nạp lại.
const auto = navigator.webdriver && !/[?&]demo=1\b/.test(location.search);
if (auto) return;      // Xclipse: trình duyệt tự động bỏ qua demo/popup (popup cần ?popup=1) để test ổn định
```
Hai lỗi thật: (1) khách tải lại bị đè trang đang làm bằng demo; (2) bấm "Điền dữ liệu mẫu" bị loader trang demo ghi đè (nút này phải tạo bản ghi **mới**, id mới). Test tự động luôn mở `?demo=1`.

### D6. CSV mở đúng tiếng Việt trong Excel + chống chèn công thức (`EP.export.csv` của starter)
```js
const cell = (v) => { let s = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;   // chặn công thức độc
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = '﻿' + [cols.map((c) => cell(c.label)), ...rows.map((r) => cols.map((c) => cell(c.value ? c.value(r) : r[c.key])))].map((a) => a.join(',')).join('\r\n');
const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: name });
a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
```
SĐT bắt đầu bằng 0 sẽ mất số 0 trong Excel nếu để trần: ghi `'0912…` hoặc định dạng text.

### D7. File lịch `.ics` ("Thêm vào lịch" sau khi đăng ký)
```js
const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), e = (t) => String(t || '').replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n');
const s = new Date(ev.startAt), end = new Date(s.getTime() + 2 * 36e5);
const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//{{app}}//VI', 'BEGIN:VEVENT', 'UID:' + ev.id + '@{{app}}', 'DTSTAMP:' + f(new Date()),
  'DTSTART:' + f(s), 'DTEND:' + f(end), 'SUMMARY:' + e(ev.name), 'LOCATION:' + e(ev.location), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })), download: 'su-kien.ics' }); a.click();
```

### D8. Tự nén ảnh theo trần dung lượng từng loại ô (localStorage ~5MB, tài liệu Firestore ≤ 1MB)
```js
const SLOTS = { hero: { w: 1600, q: .82, max: 320e3 }, gallery: { w: 1000, q: .8, max: 150e3 }, avatar: { w: 320, h: 320, q: .85, max: 40e3 }, logo: { w: 480, q: .9, max: 60e3, alpha: true } };
async function compress(file, slot) {
  const bmp = await createImageBitmap(file), cfg = SLOTS[slot]; let w = Math.min(cfg.w, bmp.width), q = cfg.q;
  const type = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : (cfg.alpha ? 'image/png' : 'image/jpeg');
  for (;;) { const c = Object.assign(document.createElement('canvas'), { width: w, height: cfg.h || Math.round(bmp.height * w / bmp.width) });
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); const url = c.toDataURL(type, q);
    if (url.length <= cfg.max || (q <= .42 && w <= 120)) return url;
    if (q > .42) q -= .08; else w = Math.round(w * .85); }             // hạ chất lượng từng bậc, chưa đủ thì thu nhỏ
}
```
Nhận ảnh gốc tới 25 MB, chỉ JPG/PNG/WebP, báo "đã nén từ X xuống Y". Quá ngân sách cả trang → nén lại ảnh nặng nhất, không báo "đầy".

### D9. Kho ảnh/tệp lớn dùng IndexedDB (localStorage không đủ), kiểu Canva: tab "Đã tải lên" + nút tải thêm
```js
const open = () => new Promise((ok, no) => { const r = indexedDB.open('{{prefix}}media', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('files', { keyPath: 'id' }); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
async function putFile(file) { const db = await open(), rec = { id: crypto.randomUUID(), name: file.name, blob: file, at: Date.now() };
  await new Promise((ok, no) => { const t = db.transaction('files', 'readwrite'); t.objectStore('files').put(rec); t.oncomplete = ok; t.onerror = () => no(t.error); }); return rec; }
// Mọi chỗ chọn ảnh dùng CHUNG một bộ chọn: EP.media.open({ slot }) -> File. IndexedDB lỗi (ẩn danh cũ) thì rơi về <input type=file>.
```

### D10. Tìm không dấu tiếng Việt (gõ "cuoi" ra "cưới") và slug
```js
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hit = (item, q) => norm(item.name + ' ' + item.tags.join(' ')).includes(norm(q));
```
Bộ lọc: hiện số kết quả cho từng lựa chọn, nhóm "Khớp đủ" trước rồi "Gần đúng (N)" kèm "Khớp k/n", nút xoá bộ lọc, trạng thái rỗng có hướng dẫn.

### D11. Chặn link độc (`javascript:`) và HTML chèn vào
```js
const safeUrl = (u) => /^https?:\/\/\S+$/i.test(String(u || '').trim()) ? u.trim() : '';        // chỉ http(s); lỗi: 'Link phải bắt đầu bằng https://'
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
el.innerHTML = '<a href="' + esc(safeUrl(link)) + '" rel="noopener noreferrer" target="_blank">' + esc(label) + '</a>';
// Soạn chữ có link: lọc thẻ, chỉ cho <b><i><u><s><a href=http(s)>; còn lại textContent.
```

### D12. Kiểm tra tương phản WCAG (làm đậm tới khi chữ trắng đọc được) cho bảng màu người dùng chọn
```js
const lum = ([r, g, b]) => { const f = (v) => (v /= 255) <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const ensureDark = (rgb) => { let c = rgb.slice(); for (let i = 0; i < 60 && ratio(c, [255, 255, 255]) < 4.5; i++) c = c.map((v) => v * .92); return c; };   // chữ thường ≥ 4.5:1
```
Ô nhập màu nhận hex, rgb(), rgba(), hsl(), tên màu; kẹp mọi thông số trong giới hạn; hiện chỉ số tương phản cạnh ô.

### D13. Chăm sóc khách (CRM nhẹ): trạng thái + Gọi/Zalo + chọn landing trước rồi mới hiện số liệu
```js
const LEAD = { new: 'Mới', contacted: 'Đã liên hệ', won: 'Chốt', lost: 'Huỷ' };
const callHref = (p) => 'tel:' + p, zaloHref = (p) => 'https://zalo.me/' + p.replace(/^0/, '84');
// Màn "Danh sách đăng ký": bước 1 chọn landing (đang hoạt động / đã kết thúc); số liệu, danh sách, CSV CHỈ của trang đã chọn, nhớ lựa chọn sau khi tải lại.
```
Số liệu: số 0 không tô màu, `font-variant-numeric: tabular-nums`, đường xu hướng đoạn cuối (hôm nay, chưa hết ngày) vẽ nét đứt + tooltip "hôm nay, chưa hết ngày". Số lượt xem/bấm công khai có thể bị cộng khống: ghi rõ "chỉ tham khảo".

---

## E. AI

### E1. Một cửa gọi AI: `prompt` + `schema` + `mock` (starter `EP.ai.generate`)
```js
const res = await EP.ai.generate({
  prompt: (input) => 'Bạn là ... Chỉ dùng dữ kiện dưới đây, KHÔNG bịa ngày, giá, tên.\n' + JSON.stringify(input) + '\nChỉ trả về một khối JSON: {"headline":"...","benefits":["...","...","..."]}',
  schema: { headline: { type: 'string', max: 90 }, benefits: { type: 'array', of: 'string', min: 3, max: 3 } },
  mock: (input) => ({ headline: input.name + ' – ' + input.date, benefits: ['…', '…', '…'] })
}, { input: formValues });
el.innerHTML = EP.esc(res.data.headline) + EP.ai.noticeHtml(res);          // mock thì luôn kèm nhãn
```

### E2. Rút JSON chịu lỗi (lời dẫn, ```json, nháy cong, dấu phẩy thừa)
```js
function extractJson(text) {
  const s0 = String(text || '').replace(/```(?:json)?/gi, ''), a = s0.indexOf('{'), b = s0.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('Không tìm thấy khối JSON trong kết quả.');
  try { return JSON.parse(s0.slice(a, b + 1).replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, '$1')); }
  catch (e) { throw new Error('JSON bị lỗi cú pháp: ' + e.message); }
}
```

### E3. Kiểm soát đầu ra: thiếu trường thì bù bằng mock **và nói rõ**, dư thì cắt, quá dài thì cắt `…`
```js
const trimTo = (t, n) => { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; };
function normalize(raw, mock) { const warnings = [], o = raw || {};
  let h = o.headline || o.title; if (!h) { warnings.push(CFG.mockNotice + ': thiếu headline, đã dùng bản thay thế.'); h = mock.headline; }
  let b = [].concat(o.benefits || []).filter(Boolean).map(String); if (b.length > 3) warnings.push('AI trả về ' + b.length + ' ý, chỉ giữ 3 ý đầu.');
  while (b.length < 3) { warnings.push('Thiếu ý số ' + (b.length + 1) + ', đã bù bằng bản thay thế.'); b.push(mock.benefits[b.length]); }
  return { data: { headline: trimTo(h, 90), benefits: b.slice(0, 3).map((x) => trimTo(x, 110)) }, warnings }; }
```
Ca kiểm thử bắt buộc: dán kết quả có lời dẫn + ```json + nháy cong + dấu phẩy thừa + chỉ 2 ý → app vẫn đọc được, bù ý thứ 3, báo rõ.

### E4. Nhãn mô phỏng: một nguồn duy nhất, hiển thị ở mọi nơi, không xuống dòng xấu
```js
// js/config.js:  mockNotice: '<CÂU NGUYÊN VĂN TỪ ĐỀ/BTC>'   (vòng loại: 'Bản demo vòng loại - Dữ liệu mô phỏng AI'; chung kết PHẢI kiểm tra lại)
const noticeHtml = (res) => res.mock ? '<p class="mock-pill" role="note">' + EP.esc(EP.config.mockNotice) + '</p>' : '';
```
```css
.mock-pill { display: inline-flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; margin: 8px 0; padding: 4px 10px; border-radius: 999px;
  background: var(--warn-soft, #fff4e5); color: var(--warn, #8a4b00); font-size: 13px; line-height: 1.35; }
@media (max-width: 760px) { .toolbar .mock-pill { white-space: normal; } }  /* nhãn ở thanh công cụ: desktop 1 dòng, hẹp thì xuống dòng riêng, đừng để thành 4 dòng nhỏ */
```
Nhãn xuất hiện ở: ghi chú trong app, chân trang, cảnh báo khi fallback, checklist trước xuất bản, README, bảng kiểm thử, slide. Đổi câu → sửa 2 assert trong `tests/smoke.cjs` (starter đã đọc từ `EP.config`).

### E5. Gọi Gemini bằng key người dùng nhập + dịch lỗi + tự đổi model
```js
const URL_G = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', FALLBACKS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
const fail = (msg, kind) => Object.assign(new Error(msg), { kind });
async function call(key, model, prompt, ms = 60000) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  const res = await fetch(URL_G.replace('{model}', encodeURIComponent(model)), { method: 'POST', signal: ac.signal,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },     // key ở header, không ở URL
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: .8, responseMimeType: 'application/json' } }) }
  ).catch((e) => { throw fail(e.name === 'AbortError' ? 'Model "' + model + '" phản hồi quá lâu.' : 'Không kết nối được tới Gemini. Kiểm tra mạng.', e.name === 'AbortError' ? 'timeout' : 'network'); }).finally(() => clearTimeout(t));
  if ([400, 401, 403].includes(res.status)) throw fail('API key không hợp lệ hoặc chưa được cấp quyền.', 'key');
  if (res.status === 404) throw fail('Model "' + model + '" không còn mở cho tài khoản này.', 'model');
  if (res.status === 429) throw fail('Model "' + model + '" đã hết lượt miễn phí hoặc cần bật thanh toán.', 'quota');
  if (res.status >= 500) throw fail('Model "' + model + '" của Google đang quá tải.', 'server');
  const d = await res.json(); return d.candidates[0].content.parts.filter((p) => !p.thought).map((p) => p.text || '').join('');   // bỏ phần "thought"
}
// generate(): lỗi 'key'/'network' thì báo luôn; lỗi 'model'/'quota'/'timeout'/'server' thì thử model kế trong FALLBACKS + onSwitch(model, lý do).
```
Gotcha: tên model `-preview` đổi/gỡ không báo; **đối chiếu** `ai.google.dev/gemini-api/docs/models` trước khi tin bảng model (bảng của skill/tài liệu có mục "(?) chưa xác minh"). Model **tạo ảnh/video không có gói miễn phí** (429 `limit: 0`): app phải nói rõ và có ảnh thay thế. Ảnh AI gắn nhãn "AI" + ghi "Ảnh minh hoạ tạo bằng AI". Ô key: `type=password`, mặc định chỉ giữ trong bộ nhớ trang, tick "Nhớ key" mới lưu localStorage; không bao giờ vào code/commit/ảnh chụp.

### E6. Khối prompt chống bịa + cấm sáo rỗng (rút từ vòng sửa "văn AI chung chung")
```text
Bạn là copywriter người Việt 10 năm viết landing page cho {{ngành}}. Viết như người thật nói với một người bạn đang cân nhắc có đi hay không.
THÔNG TIN (chỉ dùng những gì ở đây): Tên: ... | Thời gian: ... | Địa điểm: ... | Ưu đãi: ...
- headline ≤ 12 từ/90 ký tự, theo 4U (có ích, có lý do làm ngay, khác biệt, cụ thể bằng chi tiết thật). Mô tả theo AIDA/PAS, 2–3 câu, gọi người đọc là "bạn".
- 3 lợi ích theo FAB: viết thành KẾT QUẢ/CẢM GIÁC cụ thể; F&B dùng ngôn ngữ giác quan; mỗi ý bắt đầu bằng động từ hoặc kết quả.
- CẤM: "đẳng cấp", "tinh tế", "nâng tầm", "trải nghiệm tuyệt vời", "không thể bỏ lỡ", "hành trình", "khám phá", "độc quyền", "bùng nổ", "đột phá", "hàng đầu", emoji, nhiều dấu chấm than.
- KHÔNG bịa ngày giờ, địa điểm, giá, số liệu, giải thưởng, tên người. Thiếu dữ kiện thì viết khéo quanh những gì có. Khan hiếm/gấp rút chỉ khi gắn với sức chứa hoặc hạn THẬT.
Chỉ trả về một khối JSON, không giải thích, không markdown: {"headline":"...","description":"...","benefits":["...","...","..."]}
```

---

## F. SEO & chia sẻ

### F1. Bộ meta đầy đủ cho `<head>` (tiêu đề ≤ 60, mô tả 140–160, ảnh OG JPEG 1200×630, URL tuyệt đối)
```html
<title>{{Tiêu đề ≤ 60 ký tự}}</title>
<meta name="description" content="{{140–160 ký tự}}"><link rel="canonical" href="{{URL trang thật}}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{{app}}"><meta property="og:locale" content="vi_VN">
<meta property="og:title" content="{{...}}"><meta property="og:description" content="{{...}}"><meta property="og:url" content="{{URL}}">
<meta property="og:image" content="https://{{user}}.github.io/{{repo}}/assets/og/{{id}}.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{{mô tả ảnh}}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://.../og/{{id}}.jpg">
<meta name="theme-color" content="#131416"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
```
Ảnh OG phải là URL **http(s) công khai** (ảnh dataURL/ảnh tải lên máy không hiện); JPEG là định dạng Zalo đọc ổn định nhất.

### F2. Facebook/Zalo KHÔNG chạy JS → trang chia sẻ tĩnh `s/<id>/index.html` (meta có sẵn) rồi chuyển người thật sang trang chính
```js
// tools/build-share-pages.cjs: mở app bằng Playwright, lấy dữ liệu từng trang, ghi file tĩnh. Chạy lại mỗi khi đổi nội dung trang mẫu.
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title><meta name="description" content="${esc(t.desc)}">
<meta property="og:title" content="${esc(t.ogTitle)}"><meta property="og:description" content="${esc(t.ogDesc)}"><meta property="og:image" content="${PROD}assets/og/${id}.jpg">
<meta property="og:url" content="${PROD}s/${id}/"><link rel="canonical" href="${PROD}?e=${id}">
<script type="application/ld+json">${JSON.stringify(eventJsonLd)}</script>
<script>location.replace('../../?e=${id}')</script></head><body><a href="../../?e=${id}">${esc(t.title)}</a></body></html>`;
fs.mkdirSync(`s/${id}`, { recursive: true }); fs.writeFileSync(`s/${id}/index.html`, html);
```
GitHub Pages không tự sinh file này và Firebase Functions cần gói trả phí: **chạy script ở máy rồi commit** thư mục `s/`. Link copy/QR trong app trỏ tới `/s/<id>/`, không phải `?e=<id>`. Thử: dán **link mới** (Facebook nhớ bản xem trước cũ) rồi vào Sharing Debugger (`developers.facebook.com/tools/debug`) bấm "Scrape Again"; Zalo cũng cache một thời gian. Chưa thử thật trên Facebook/Zalo thì nói "chưa thử".

### F3. Link chia sẻ ẩn khung app trước khi tải (khách không thấy builder nháy lên)
```html
<script>(function(d){try{if(/[?&]e=/.test(location.search))d.className+=' boot-public';}catch(e){}})(document.documentElement);</script>
<style>.boot-public .topbar, .boot-public .app-footer, .boot-public .skip-link, .boot-public main.view { display: none !important; }</style>
```
Sau khi JS dựng xong trang công khai thì gỡ class và hiện đúng view.

### F4. JSON-LD `Event` (giờ có múi +07:00) và checklist nhanh
```json
{"@context":"https://schema.org","@type":"Event","name":"{{tên}}","startDate":"2026-11-28T08:00:00+07:00","eventStatus":"https://schema.org/EventScheduled",
 "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","location":{"@type":"Place","name":"{{nơi}}","address":"{{địa chỉ}}"},
 "image":["{{URL ảnh}}"],"description":"{{...}}","offers":{"@type":"Offer","price":"0","priceCurrency":"VND","availability":"https://schema.org/InStock"}}
```
Mỗi màn đúng một `h1`; ảnh có `alt` mô tả + `width/height`; diễn giả: `alt="Diễn giả {{tên}} – {{chức danh}}"`, album: `alt="Hình ảnh {{tên sự kiện}} – ảnh N"`; `robots.txt`, `sitemap.xml` (có link `s/<id>/`), `404.html` có `noindex`; trang nháp/riêng tư `noindex`.

---

## G. Firebase, GitHub Pages, Google Sheet

Mặc định 60 phút: **localStorage**. Chỉ dùng Firebase khi đề cần dữ liệu chung nhiều máy. **Đề đã quy định nơi lưu (vd localStorage) thì đó là bản chính; Firebase/Sheet là tuỳ chọn và phải được mô tả đúng là tuỳ chọn** (Xclipse từng bị cô nhận xét "chưa đúng tính năng" vì giới thiệu Firebase như nơi lưu chính).

### G1. Dựng project Firebase (người dùng tự bấm; hướng dẫn đánh số, không bao giờ xin key/service account)
```text
1. console.firebase.google.com → Add project (gói Spark, KHÔNG bật billing, KHÔNG dùng Cloud Functions vì cần trả phí).
2. Build → Firestore Database → Create database → vị trí asia-southeast1 → Production mode.
3. Build → Authentication → Get started → Sign-in method → Google → Enable.
4. Authentication → Settings → Authorized domains → Add domain: <tài-khoản>.github.io   (thiếu bước này: lỗi auth/unauthorized-domain)
5. Project settings → Your apps → Web (</>) → copy firebaseConfig (apiKey, projectId, appId...) dán vào js/firebase-config.js.
6. Firestore → Rules → dán nội dung firebase/firestore.rules → Publish   (hoặc: npx firebase deploy --only firestore:rules --project <id>).
```
`firebaseConfig` là cấu hình web **công khai theo thiết kế**; thứ bảo vệ dữ liệu là rules + Authentication. `scripts/scan-secrets.mjs` sẽ in dòng [CHO PHÉP] cho `js/firebase-config.js`; ghi chú điều này trong README để giám khảo khỏi hiểu nhầm. Không đưa service account/private key.

### G2. Khởi tạo Firebase compat (vendor sẵn, không CDN) + emulator + rơi về localStorage khi mất mạng
```html
<script src="vendor/firebase/firebase-app-compat.js"></script><script src="vendor/firebase/firebase-auth-compat.js"></script>
<script src="vendor/firebase/firebase-firestore-compat.js"></script><script src="js/firebase-config.js"></script>
```
```js
let db = null, auth = null, available = !!(window.firebase && window.EP_FIREBASE_CONFIG);
if (available) { try { firebase.initializeApp(window.EP_FIREBASE_CONFIG); db = firebase.firestore(); auth = firebase.auth();
  if (new URLSearchParams(location.search).get('emulator') === '1') { db.useEmulator('127.0.0.1', 8085); auth.useEmulator('http://127.0.0.1:9099'); } } catch (e) { available = false; } }
const withTimeout = (p, ms = 12000) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error('Máy chủ phản hồi quá lâu, vui lòng thử lại.')), ms); p.then((v) => { clearTimeout(t); ok(v); }, (e) => { clearTimeout(t); no(e); }); });
// !available (mở file://, mất mạng): toàn app tự dùng localStorage như cũ.
```

### G3. Đăng nhập Google + dịch lỗi ra hướng dẫn tiếng Việt
```js
function signIn() {
  if (location.protocol === 'file:') return Promise.reject(new Error('Đăng nhập Google cần mở app qua đường dẫn web (GitHub Pages hoặc localhost), không mở trực tiếp file.'));
  const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
  return auth.signInWithPopup(p).catch((e) => { throw new Error(({
    'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập. Bấm biểu tượng chặn popup, chọn "Luôn cho phép", rồi bấm lại.',
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất. Hãy bấm lại.',
    'auth/unauthorized-domain': 'Tên miền chưa được phép: thêm vào Firebase → Authentication → Settings → Authorized domains.',
    'auth/operation-not-allowed': 'Đăng nhập Google chưa được bật (Authentication → Sign-in method).',
    'auth/internal-error': 'Google từ chối đăng nhập trên trình duyệt này. Thử Chrome thông thường (không phải trình duyệt tự động).' })[e.code] || 'Không đăng nhập được: ' + e.message); });
}
```
Mở trang khi đã từng đăng nhập: đặt cờ `localStorage.ep_signed_in` trong script `<head>` để vào thẳng "Sự kiện của tôi", đừng chớp màn khác.

### G4. Rules: khách chỉ **gửi**, chủ sự kiện mới đọc; mã bản ghi = SĐT chống trùng; đếm chỗ trong cùng batch
```text
function isOwner(e) { return request.auth != null && get(/databases/$(database)/documents/events/$(e)).data.ownerUid == request.auth.uid; }
match /events/{e} { allow read: if true;                                        // nội dung + số đếm công khai
  allow create: if request.auth != null && request.resource.data.ownerUid == request.auth.uid && request.resource.data.name.size() <= 120;
  allow update, delete: if request.auth != null && resource.data.ownerUid == request.auth.uid;
  match /stats/{d} { allow read: if d == 'public';                              // { count, waitlist, lastRegId }: không kèm tên/SĐT
    allow update: if isOwner(e) || (request.resource.data.lastRegId != resource.data.lastRegId
        && existsAfter(/databases/$(database)/documents/events/$(e)/registrations/$(request.resource.data.lastRegId))
        && request.resource.data.count == resource.data.count + 1); }           // khách chỉ tăng đúng 1, cùng lúc tạo bản ghi
  match /registrations/{phone} { allow read, delete: if isOwner(e);
    allow create: if phone == request.resource.data.phone && request.resource.data.phone.matches('^0[35789][0-9]{8}$')
      && request.resource.data.keys().hasOnly(['name','phone','email','status','createdAt']) && request.resource.data.createdAt == request.time; } }  // cùng SĐT không tạo được lần 2
```
Bản đầy đủ có `emails/{email}` (khoá chống trùng email), `metrics/funnel` (mỗi lần chỉ `+1` một trường), kiểm sự kiện chưa diễn ra, đúng trạng thái `new/waitlist` theo sức chứa: `firebase/firestore.rules` trong repo Xclipse.

### G5. Ghi đăng ký nguyên tử + thử lại khi đụng đồng thời; chạy test rules trên emulator
```js
const batch = db.batch(), ev = db.collection('events').doc(id);
batch.set(ev.collection('registrations').doc(rec.phone), { name: rec.name, phone: rec.phone, email: rec.email, status, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
batch.set(ev.collection('emails').doc(rec.email), { regId: rec.phone });
batch.update(ev.collection('stats').doc('public'), status === 'new' ? { count: stats.count + 1, lastRegId: rec.phone } : { waitlist: stats.waitlist + 1, lastRegId: rec.phone });
await withTimeout(batch.commit());          // permission-denied: đọc lại stats; nếu số đếm đã đổi (người khác vừa gửi) thì thử lại ≤ 3 lần, không đổi thì báo "đã đăng ký rồi"
```
```bash
cd firebase && npm i -D firebase-tools @firebase/rules-unit-testing firebase
echo '{"firestore":{"rules":"firestore.rules"},"emulators":{"firestore":{"port":8085}}}' > firebase.json
npx firebase emulators:exec --only firestore --project demo-ep "node rules.test.mjs"   # cần Java + Node; 33/33 phải qua trước khi Publish
```
Mẫu một ca: `await assertFails(getDocs(collection(anon, 'events', 'e1', 'registrations')))` (người lạ đọc danh sách → bị từ chối). Subagent trong sandbox thường **không có emulator/quyền Firebase**: điều phối viên tự chạy test Firebase sau merge, rồi báo rõ phần chưa chạy.

### G6. GitHub Pages: dựng một lần, mỗi lần push là web đổi (nhánh Pages = nhánh production)
```text
1. Repo đã kết nối Claude GitHub App (claude.ai/connect-github); mở phiên MỚI có chọn repo (không thấy repo/không push được → làm lại bước này).
2. Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: claude/<tên> (hoặc main) → /(root) → Save.
3. Link: https://<tài-khoản>.github.io/<repo>/ (1–5 phút lần đầu; tab Actions → pages-build-deployment xanh là xong).
4. index.html ở GỐC; đường dẫn tương đối (css/app.css, không /css/app.css); thêm .nojekyll nếu có thư mục bắt đầu bằng "_".
5. Link 404: sai nhánh/thư mục hoặc thiếu index.html ở gốc. Web trắng: app dùng React/Vite cần build → làm bản HTML/JS thuần.
```
```bash
touch .nojekyll && git add -A && git commit -m "..." && git push -u origin <nhánh>      # Claude không tự tạo PR nếu không được yêu cầu
```
**Không push bản ghép chưa test lên nhánh Pages**: web đổi ngay. Ghép và test ở nhánh khác/thư mục khác, xanh rồi mới đẩy.

### G7. Google Sheet tuỳ chọn qua Apps Script (POST `text/plain` để khỏi preflight CORS)
```js
// Client
fetch(APPS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ eventId, eventName, capacity, record }) }).then((r) => r.json());
// Apps Script (Code.gs): khoá để 2 người cùng gửi không lệch số chỗ; gửi lại cùng id thì không ghi trùng; dấu ' giữ số 0 đầu và chặn công thức
function doPost(e) { const lock = LockService.getScriptLock(); try { lock.waitLock(10000); const r = JSON.parse(e.postData.contents).record;
  // ...nếu đã có hàng cùng r.id → trả { ok:true }; nếu trùng SĐT/email → { ok:false, duplicate:true }
  sheet.appendRow([new Date(), r.id, r.name, "'" + r.phone, r.email, status]); return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
} finally { lock.releaseLock(); } }
```
Deploy: Triển khai → Ứng dụng web → chạy bằng "Tôi", ai có link cũng truy cập; URL phải dạng `https://script.google.com/macros/s/.../exec`. Mất mạng: hàng đợi, thử lại mỗi 15 giây, hiển thị cột "đã đồng bộ". Số đếm qua Sheet có độ trễ ~15 giây: ghi vào "Giới hạn".

---

## H. Test, minh chứng, git

### H1. Khung Playwright `.cjs`: URL từ `argv`, bắt lỗi console, **thoát mã ≠ 0 khi FAIL** (starter `tests/smoke.cjs` đã có bản đầy đủ)
```js
const { chromium } = (() => { try { return require('playwright'); } catch (e) { return require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); } })();
const URL = (process.argv.find((a) => /^https?:/.test(a)) || 'http://localhost:8211/').replace(/\/?$/, '/');   // KHÔNG hardcode 8000
let failed = 0; const ok = (name, cond, extra) => { if (!cond) failed++; console.log(cond ? '  ok  ' : '  FAIL', name, cond ? '' : JSON.stringify(extra)); };
(async () => { const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(), errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL + '?demo=1'); /* ...các ca... */ ok('không lỗi console', errs.length === 0, errs);
  await b.close(); process.exit(failed ? 1 : 0); })();
```
Gotcha: nhiều test cũ của Xclipse chỉ **in** kết quả, điều phối viên phải grep "lỗi/fail" — test phải tự trả mã thoát. Test hỏng sau khi đổi tab mặc định/hành vi khách → dùng helper mở đúng tab trước khi thao tác (`tests/auto-tab.cjs`), không dựa vào tab đầu.

### H2. Mobile 390px không tràn ngang, ở mọi tab, sáng và tối
```js
await p.setViewportSize({ width: 390, height: 844 });
for (const scheme of ['light', 'dark']) { await p.emulateMedia({ colorScheme: scheme });
  for (const t of tabs) { await p.goto(URL + '#/' + t); await p.waitForTimeout(350);
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok('390 ' + scheme + ' ' + t + ' không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw, o);
    if (SHOTS) await p.screenshot({ path: SHOTS + '/mobile-' + scheme + '-' + t + '.png', fullPage: true }); } }
// Thêm: vùng chạm ≥ 44px: await p.$$eval('button,a,input', (n) => n.filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height < 40; }).length) === 0
// Thử cả 360px và hộp thoại đang mở. Sau khi sửa tràn ngang phải chụp lại ảnh, không chỉ tin con số.
```

### H3. Chờ đúng thứ cần chờ (không `waitForTimeout` cố định) — chữa "Esc lúc được lúc không"
```js
await p.keyboard.press('Escape');
await p.waitForFunction(() => !document.querySelector('dialog[open], .preview-dialog:not([hidden])'));   // chờ dialog đóng hẳn
await p.waitForFunction(() => !document.documentElement.hasAttribute('data-vt'), null, { timeout: 4000 }); // chờ chuyển cảnh xong trước khi đo màu
// Ưu tiên xử lý Esc ở listener đầu tiên (capture) để không phần nào khác nuốt phím.
```

### H4. Chụp giữa lúc đang chuyển cảnh để chứng minh hiệu ứng thật sự chạy (không chỉ "test qua")
```js
await p.click('#btn-theme');
for (const ms of [0, 120, 240, 360, 480, 600]) { await p.waitForTimeout(ms ? 120 : 0); await p.screenshot({ path: SHOTS + '/theme-' + String(ms).padStart(3, '0') + '.png' }); }
// Xem lại cả dãy: vòng tròn phải lớn dần đều, tâm ở nút bấm, không nhảy/khựng. Thử viewport điện thoại: { width: 412, height: 915 }, isMobile: true, hasTouch: true.
```
Trình duyệt tự động không vuốt/đổi thanh địa chỉ như máy thật: **ghi "chưa thử trên điện thoại thật"** và nhờ người dùng thử rồi gửi ảnh.

### H5. Ảnh minh chứng ca kiểm thử có thanh chú thích (mã ca · mô tả · ngày · Đạt)
```js
await p.evaluate(({ id, desc, date }) => { const b = document.createElement('div');
  b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:10px 16px;background:#072D59;color:#fff;font:600 14px system-ui';
  b.textContent = id + ' · ' + desc + ' · ' + date + ' · Đạt'; document.body.appendChild(b); }, { id: 'TC05', desc: 'Đăng ký trùng SĐT', date: '16/11/2026' });
await p.screenshot({ path: 'docs/evidence/kiem-thu/TC05.png' });
```
Chỉ gắn "Đạt" sau khi ca đã chạy thật. Bảng kiểm thử: cột Mã ca · Loại · Dữ liệu và bước · Kỳ vọng · Kết quả thực tế (ngày chạy) · Đạt/Chưa. Mục "Chưa kiểm chứng" liệt kê rõ (Gemini thật, Apps Script thật...).

### H6. Minh chứng AI: **lưu ngay lúc làm**, đừng để sau
```text
Lịch sử chat bị nén/mất sau vài ngày (Xclipse mất đoạn chat gốc của 5 vòng đầu, phải thay bằng 5 vòng còn lại). Mỗi lần có vòng "yêu cầu → lỗi → yêu cầu sửa → kết quả":
1) chụp luôn đoạn chat thật (không dựng lại); 2) ghi 1 dòng vào docs/MINH-CHUNG-AI.md (mục tiêu / prompt / vấn đề / prompt sửa / kết quả kiểm tra lại);
3) ≤ 5 ảnh, che key/email/SĐT; 4) ca "AI nói rõ chưa thử trên máy thật" là bằng chứng tốt, giữ nguyên.
```

### H7. Số liệu trong README phải khớp app (đã sai "172 mẫu" một lần)
```js
// tests: so số ghi trong README với số thật
const n = await p.evaluate(() => EP.templates.list.length);
const m = require('fs').readFileSync('README.md', 'utf8').match(/(\d+) mẫu/);
ok('README ghi đúng số mẫu', m && Number(m[1]) === n, { readme: m && m[1], app: n });
```

### H8. `.gitignore` tối thiểu (từng lọt `undefined/`, ảnh chụp, video quay màn hình)
```gitignore
undefined/
shots*/
demo-video/
.env.local
node_modules/
.claude/
.agents/
deck/out/
```
Test phải nhận thư mục ảnh qua `--shots <thư-mục>`; thư mục `undefined/` xuất hiện nghĩa là đường dẫn ảnh bị `undefined`.

### H9. Giải xung đột merge hay gặp (xem bảng ở `references/02`)
```bash
git merge --no-ff <nhánh-agent> || true; git status --short | grep '^UU'
# index.html: GIỮ CẢ HAI dòng <script> mới (mỗi tag một dòng), js/app.js luôn cuối, js/demo-data.js sau các feature
grep -n '<<<<<<<\|>>>>>>>' index.html css/*.css js/*.js          # còn dấu xung đột = chưa xong
python3 -c "s=open('css/app.css').read();print('{',s.count('{'),'}',s.count('}'))"   # hai số phải bằng nhau
node tools/bump-version.cjs --stamp && node --check js/*.js features/*/feature.js   # version: lấy số cao hơn rồi stamp MỘT lần
git add -A && git commit --no-edit
```
CSS trong `@layer components { ... }`: xung đột làm lệch ngoặc `}` → toàn bộ CSS phía sau không áp dụng; mở app xem trước khi tin.

### H10. Commit/push/pull đúng kiểu repo thi
```bash
git add -A && git commit -m "v2.9.2: single theme reveal animation, preview bar mobile fix" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_<id>"
git pull --no-edit origin <nhánh> && git push -u origin <nhánh>          # push lỗi mạng: thử lại tối đa 4 lần, chờ 2s/4s/8s/16s
```
Stop-hook của môi trường nhắc "có thay đổi chưa commit" thì commit + push ngay, đừng để agent kết thúc với cây bẩn.

---

## I. Dữ liệu sinh hàng loạt và việc lặp theo từng ảnh

### I1. Chia dữ liệu lớn cho nhiều agent + **bắt buộc kèm validator** (cách ra 165 mẫu: 4 agent × ~25 mẫu/đợt)
```text
Mỗi agent ghi tools/tpl/partN.json + chạy check<N>.validate.py. Validator kiểm: JSON hợp lệ; id duy nhất, kebab-case, đúng tiền tố x<N>-, không trùng danh sách có sẵn;
enum hợp lệ (tag, motif, nhãn); WCAG: chữ/nền ≥ 7:1, màu chính/nhấn trên nền trắng ≥ 4.5:1, chữ phụ ≥ 4.5:1; ngày: earlyBirdDays < startDays; agenda 3–5 mục.
Điều phối viên gộp bằng tools/build-templates.cjs (JSON → js/templates-data.js + ảnh SVG), chạy lại test, KHÔNG sửa tay file sinh.
```
Cảnh báo phân bố: một tag chiếm 22/25 mẫu thì bộ lọc vô nghĩa; chia lại nhãn (`tools/extra-tags.json`) rồi kiểm số lượng mỗi lựa chọn.

### I2. Ảnh đại diện mẫu = ảnh chụp phần hero (tắt animation, đợi font + ảnh nền)
```js
await p.evaluate(() => { document.body.innerHTML = '<style>*,*::before,*::after{animation:none!important;transition:none!important}</style><div id="shot" class="landing" style="width:1120px"></div>'; /* render mẫu vào #shot */ });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
await p.screenshot({ path: 'assets/templates/' + id + '-thumb.jpg', type: 'jpeg', quality: 78, clip: { x: 0, y: 0, width: 1120, height: Math.min(630, box.height) } });
```
Ngữ cảnh `deviceScaleFactor: 0.5` để ảnh nhẹ. Ảnh do Gemini tạo: soạn **một file prompt tự đủ ngữ cảnh cho từng ảnh** (không "xem prompt trên"), gồm cả ảnh OG 1200×630; giao 1 Haiku/ảnh để xoá watermark góc dưới phải; trang chưa có ảnh vẫn hiển thị bình thường (không khung vỡ); ghi nguồn "ảnh minh hoạ tạo bằng AI" trong README.

=================== FILE: references/08-quy-uoc-viet.md ===================
# 08 — Quy ước viết: đặt tên, câu chữ tiếng Việt, comment, commit, thư mục

Dán mục liên quan vào prompt mọi agent để code và chữ của 10 agent trông như một người viết. Rút từ ~190 commit và các vòng góp ý thật của Xclipse (thầy/cô, người dùng, giám khảo).

## 1. Đặt tên

| Thứ | Quy ước | Ví dụ |
|---|---|---|
| Biến, hàm, file code, class CSS, id DOM | Tiếng Anh, `camelCase` (JS), `kebab-case` (file/CSS/id) | `normalizePhone`, `order-row`, `btn-theme` |
| Thư mục feature | `features/<tên-kebab>/feature.js` (+ tuỳ chọn `css/<tên>.css`) | `features/don-hang/feature.js` |
| `EP.register({ id })` | kebab, **duy nhất**, = đường `#/id` | `id: 'orders'` |
| Khoá localStorage | `<prefix>` + tên ngắn; `prefix` ở `js/config.js` (đổi theo từng đề) | `ep_theme`, `ep_motion`, `ep_events` |
| Collection | số nhiều, snake/kebab | `orders`, `regs_<eventId>` |
| Id sinh ra | `<loại>_<ngẫu nhiên>` | `reg_k3j9x`, `evt_…` |
| Id dữ liệu demo | tiền tố `demo_` (để nhận ra và xoá/khôi phục được) | `demo_evt_coffee` |
| Mẫu/template sinh hàng loạt | `x<đợt>-<kebab>` | `x3-ev-launch` |
| File test | `tests/<tên>.cjs` (feature) hoặc `e2e-<chủ-đề>.cjs`; nhận URL từ `argv` | `tests/e2e-mobile.cjs [url] [thư-mục-ảnh]` |
| Mã ca kiểm thử | `TC01…` liên tục, ghi loại ca | `TC05 Biên – trùng` |
| Tệp ảnh minh chứng | `docs/evidence/kiem-thu/TC05.png`, `docs/evidence/ai/anh-1.png` | |
| Tên file tài liệu | tiếng Việt không dấu, kebab, **chữ HOA cho tài liệu nộp** | `docs/bang-kiem-thu.md`, `docs/CHECKLIST-NOP-BAI.md` |
| Phiên bản | semver `x.y.z` trong `js/version.js`; patch = sửa lỗi/nhỏ, minor = tính năng, major = đổi lớn | `2.9.2` |
| Cổng | theo bảng cổng của skill; **không 8000** | `8217` |

- `kebab-case` không dấu, không khoảng trắng, không chữ hoa trong tên file ảnh/asset đưa lên web (GitHub Pages phân biệt hoa/thường).
- Tên thương hiệu trong nút/logo: `white-space: nowrap`. Tên thương hiệu viết một kiểu duy nhất xuyên suốt (Xclipse, không Eclipse/XClipse).

## 2. Câu chữ giao diện tiếng Việt

**Nguyên tắc chung:** tiếng Việt **có dấu**, tự nhiên như người nói, ngắn, cụ thể. Không dịch word-by-word. Một ý một câu. Không emoji trong UI (dùng icon SVG), không nhiều dấu chấm than.

| Loại | Quy tắc | Mẫu |
|---|---|---|
| Xưng hô | Gọi người dùng là **"bạn"**; không "quý khách" trừ ngữ cảnh trang trọng (thiệp cưới, sự kiện doanh nghiệp lớn); app không xưng "tôi/mình" | "Bạn đã đăng ký rồi bằng số điện thoại hoặc email này." |
| Nút | **Động từ + đối tượng**, ≤ 4 từ, viết hoa chữ đầu | "Tạo trang mới", "Dùng mẫu này", "Xuất CSV", "Điền dữ liệu mẫu" |
| Nút đang xử lý | Động từ + "…", khoá bấm | "Đang gửi…", "AI đang viết…" |
| Nút xác nhận xoá | Nêu rõ hành động, không "OK" | "Đồng ý xoá" / "Huỷ, giữ lại" |
| Lỗi nhập | **Thiếu gì + ví dụ đúng**, ngay dưới ô, không đổ lỗi | "Vui lòng nhập tên sự kiện." · "Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)." · "Email không đúng định dạng (ví dụ: ten@gmail.com)." |
| Lỗi giới hạn | Nêu con số | "Họ tên tối đa 80 ký tự." · "Số chỗ phải là số nguyên từ 1 đến 100.000." |
| Lỗi quan hệ | Nói điều kiện | "Hạn ưu đãi phải trước giờ bắt đầu sự kiện." |
| Lỗi hệ thống | Toast, nói cách thử lại; **không hiện stack/mã thô** | "Kết nối chậm hoặc mất mạng. Hãy thử lại." |
| Lỗi AI/dịch vụ | Nói nguyên nhân + việc đang làm | "Model … đã hết lượt miễn phí, thử lại sau ít phút." · "AI trả về 4 ý, chỉ giữ 3 ý đầu." |
| Thành công | Ngắn, có số liệu cập nhật | "Đăng ký thành công! Hẹn gặp bạn tại sự kiện." |
| Trạng thái rỗng | Giải thích + nút hành động | "Chưa có đơn nào. Bấm “Điền dữ liệu mẫu” hoặc “Thêm đơn”." |
| Trạng thái thời gian | Không bao giờ số âm | "Sự kiện đã diễn ra" (thay vì "-2 ngày") |
| Thiếu chỗ | Đếm thật, không khan hiếm giả | "Chỉ còn 12 chỗ" chỉ khi thật |
| Cảnh báo mô phỏng AI | **Nguyên văn từ đề/BTC**, từng chữ từng dấu | xem `SKILL.md` mục CẢNH BÁO |
| Chưa làm | Nói thật | "Chưa kiểm chứng"; không ghi "Đạt" cho ca chưa chạy |

**Định dạng số/ngày (vi-VN, giờ `Asia/Ho_Chi_Minh`):**
- Tiền: `1.250.000 ₫` (`toLocaleString('vi-VN')`); đồng "đ"/"₫" nhất quán một kiểu trong cả app.
- Ngày: `28/11/2026`, giờ `08:00`; ngày dài: `Thứ Bảy, 28/11/2026`. `toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })`.
- Thời gian trong JSON-LD/dữ liệu: ISO có múi `+07:00`.
- Số liệu căn phải, `font-variant-numeric: tabular-nums`; số 0 không tô màu nhấn; tiêu đề cột xám.
- **Ngày demo cố định tương lai gần**, không "hôm nay + 3 ngày" (chấm lúc khác sẽ thành "còn 17 giờ"/đã qua).

**Viết nội dung marketing (landing, AI mock, dữ liệu demo)** — rút từ vòng sửa "văn AI, chung chung":
- Headline theo 4U (có ích, có lý do làm ngay, khác biệt, cụ thể bằng chi tiết thật), ≤ 12 từ/90 ký tự. Mô tả theo AIDA/PAS, 2–3 câu. Lợi ích theo FAB, viết thành **kết quả/cảm giác** cụ thể.
- Dùng chi tiết thật của người dùng (tên diễn giả, địa điểm, số chỗ, giờ). Khi người dùng gửi bản chữ của họ (như bản Mộc Coffee), **chép nguyên văn họ chỉnh**, không "cải thiện" lại.
- **Cấm sáo rỗng:** "đẳng cấp", "tinh tế", "nâng tầm", "trải nghiệm tuyệt vời", "không thể bỏ lỡ", "hành trình", "khám phá", "độc quyền", "bùng nổ", "đột phá", "hàng đầu".
- Khan hiếm/gấp rút chỉ khi gắn với sức chứa hoặc hạn thật. Một lời kêu gọi hành động duy nhất mỗi trang.
- Mock AI: nhiều mẫu câu, lấy dữ kiện từ input; mock phải đọc như người viết, không công thức đơn điệu.
- Chữ trên nút CTA ở chân trang kiểu "Tạo trang như thế này miễn phí bằng X": một dòng, thương hiệu `nowrap`.
- Alt ảnh: tiếng Việt mô tả, có tên đối tượng: `Diễn giả <tên> – <chức danh>`, `Hình ảnh <tên sự kiện> – ảnh N`. Ảnh AI tạo ghi "Ảnh minh hoạ tạo bằng AI".

## 3. Comment trong code

- Tên API công khai và hàm: tiếng Anh. **Comment: tiếng Việt ngắn hoặc tiếng Anh ngắn, một thứ trong một file**; ưu tiên giải thích **vì sao**, không nhắc lại **cái gì**.
- Đầu mỗi file JS: khối 3–6 dòng nói file làm gì, quy tắc nghiệp vụ, khoá lưu trữ, nguồn tham khảo/giấy phép (xem mục 6). Ví dụ đầu `registrations.js`: "Quy tắc: không đăng ký trùng (cùng SĐT hoặc email), hết chỗ → danh sách chờ, sự kiện đã diễn ra → không nhận".
- Mọi chỗ "kỳ lạ" phải có comment lý do, vì chính chúng đã gây lỗi: "chỉ MỘT animation trên pseudo này", "text/plain để khỏi preflight CORS", "cho phép truyền `now` giả để demo tua thời gian", "dấu ' giữ số 0 đầu và chặn chèn công thức".
- Mỗi `catch (e) { /* bỏ qua */ }` phải có chú thích vì sao nuốt lỗi (localStorage bị chặn, không có mạng...). Không nuốt lỗi nghiệp vụ.
- Không để `console.log` gỡ lỗi, không để `TODO` không chủ; việc chưa làm ghi vào `docs/DECISIONS.md` hoặc "Giới hạn" của README.
- Mỗi file ≤ khoảng 400 dòng cho feature; file `app.js` phình (Xclipse có 4000+ dòng) là món nợ: chia theo mô-đun từ đầu.

## 4. Commit, nhánh, phiên bản

- **Tiêu đề commit:** một dòng, thì hiện tại/mệnh lệnh, nói **kết quả**; tiếng Anh hoặc tiếng Việt, **đồng nhất trong một đợt**. Có thể mở đầu bằng phiên bản: `v2.9.2: single theme reveal animation, preview bar mobile fix`.
- **Thân commit** (khi đổi nhiều nơi): gạch đầu dòng theo khu vực (`css:`, `ui:`, `deck:`, `tests:`), nêu **nguyên nhân gốc** của lỗi, không chỉ triệu chứng.
- **Trailer** cuối commit (nếu hệ thống/người dùng yêu cầu), nguyên văn:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_<id>
```
  Trailer lấy từ chỉ dẫn của phiên làm việc; không tự bịa tên mô hình hoặc id phiên.
- Mỗi lần phát hành: `node tools/bump-version.cjs` (version + `?v=`), ghi `notes` ngắn trong `js/version.js`, commit, push. Hotfix cũng bump.
- Worktree của agent: commit trên nhánh của nó, **không push**; điều phối viên `git merge --no-ff` (message gộp: `Merge <nhánh> ...` hoặc câu tóm tắt tính năng đã gộp).
- Nhánh: làm trên `claude/<tên>` hoặc nhánh nộp; không push thẳng `main` nếu đội chưa đồng ý; **không tạo Pull Request nếu người dùng không yêu cầu**.
- Trước push: `git pull --no-edit origin <nhánh>` rồi push; nhánh Pages là nhánh production nên chỉ đẩy bản đã test (xem `07` G6).
- Stop-hook nhắc "có thay đổi chưa commit": commit + push, đừng kết thúc với cây bẩn.

## 5. Cấu trúc thư mục và quy tắc "cái gì để đâu"

```
index.html               khung app; thứ tự script cố định; một dòng <script> cho mỗi feature
css/                     tokens.css (biến + @layer), app.css (khung), <tên>.css (feature, trong @layer components), landing.css (nội dung người dùng)
js/                      core, ui, form, charts, export, ai, demo, mô-đun, version.js, config.js; app.js CUỐI
features/<tên>/          feature.js (+ tests nhỏ); xoá _example/_playground khi đã có feature thật
tests/                   *.cjs, nhận URL qua argv; ảnh vào --shots <thư-mục> (git-ignore)
tools/                   bump-version.cjs, build-*.cjs, make-thumbs.cjs (script chạy ở máy dev, không nạp vào web)
scripts/                 new-project.sh, scan-secrets.mjs
docs/                    spec-nhanh.md, PROGRESS.md, DECISIONS.md, bang-kiem-thu.md, minh-chung-ai.md, CHECKLIST-NOP-BAI.md, evidence/{ai,kiem-thu}/
assets/                  favicon, og/<id>.jpg (1200×630), demo/*.webp, templates/*-thumb.jpg
s/<id>/index.html        trang chia sẻ tĩnh sinh bởi tools/build-share-pages.cjs (commit vào repo)
firebase/                firestore.rules + rules.test.mjs (+ README chạy emulator), chỉ khi đề cần
vendor/                  thư viện bên thứ ba đóng gói sẵn + README ghi phiên bản/giấy phép; không CDN
integrations/            mã chạy ở nơi khác (Apps Script Code.gs)
```

- **Đường dẫn tương đối** trong HTML/CSS/JS (Pages nằm dưới `/<repo>/`); URL tuyệt đối chỉ ở meta OG/canonical/sitemap.
- **File sinh ra** (`js/templates-data.js`, `s/*`, thumbnail) không sửa tay: sửa nguồn rồi chạy script, ghi lệnh trong `docs/README` hoặc đầu script.
- **Không commit:** `.env*` (trừ `.env.example` chỉ có tên biến), `node_modules/`, ảnh chụp thử (`shots*/`, `undefined/`), video quay màn hình (`demo-video/`), `deck/out/`, công cụ cài cục bộ của agent (`.agents/`, `.claude/`). Không commit ZIP nộp bài (tạo bằng `git archive HEAD -o app.zip`).
- **README** ở gốc: đề số + bảng thi + link demo/video; 5 tính năng đúng thứ tự đề **đứng đầu**; tính năng mở rộng ở mục sau; công nghệ; tích hợp AI (thật/mô phỏng + nhãn nguyên văn); chạy trực tuyến/cục bộ; lưu ý khoá (Firebase config công khai là chủ đích; key Gemini không trong code); cấu trúc thư mục; giới hạn thật; nguồn tham khảo/khai báo. **Số liệu trong README (số mẫu, số ca, số tính năng) phải khớp app** (kiểm bằng test, xem `07` H7).
- **Giới hạn thật** phải có: localStorage một máy, ảnh có giới hạn dung lượng, số lượt xem công khai có thể cộng khống, mô phỏng không phải AI thật, phần "Chưa kiểm chứng".

## 6. Khai báo nguồn và giấy phép

- Giao diện/ý tưởng chuyển thể từ repo mở: ghi giấy phép **ở 3 nơi**: comment đầu file CSS/HTML dùng nó, README mục "Nguồn tham khảo/khai báo", form nộp bài. Ví dụ: "Lucian Lab — MIT © 2026 Seokwoooo".
- Ghi công cụ AI **đã dùng để xây** (Claude Code...) và AI **trong sản phẩm** (Gemini qua key người dùng, mô phỏng). Ảnh demo tạo bằng AI: nói rõ.
- Thư viện đóng gói sẵn: `vendor/README.md` ghi tên, phiên bản (Firebase compat 12.19.0, qrcode-generator 1.4.4), giấy phép (Apache-2.0, MIT).

## 7. Cách agent báo cáo và làm việc với người dùng

- **Báo cáo cuối của agent (4 mục):** đã xong · còn mô phỏng · cách chạy thử (lệnh + cổng) · cách xem bằng mắt (ảnh ở đâu). Kèm: file đã đổi, kết quả test **thật**, giả định đã chọn, việc chưa làm.
- **Nói thật mức độ chắc chắn:** "đã chụp từng khung hình trên giả lập Pixel 7", "chưa thử trên điện thoại thật", "không tái hiện được lỗi, đã làm 2 việc phòng ngừa", "chưa thử dán link lên Facebook/Zalo thật". Không viết "đã sửa" khi chỉ đoán nguyên nhân.
- **Sửa nguyên nhân gốc, không sửa test cho qua:** nếu test hỏng vì bug thật thì sửa app; nếu vì test lỗi thời (đổi tab mặc định...) thì sửa test và ghi rõ vì sao. Báo cáo phải nói đã chọn đường nào.
- **Hướng dẫn việc người dùng phải tự làm** (bấm GitHub, Firebase, dán key vào ô app): đánh số 1–N, nói rõ bấm đâu, kết quả mong đợi, và cách kiểm tra. Không dùng thuật ngữ trần.
- **Không bao giờ xin dán key/mật khẩu vào chat.** Người dùng lỡ dán key vào chat: **không ghi vào file/commit/ảnh**, nhắc thu hồi/tạo key mới sau khi dùng xong.
- Người dùng nhờ "xem file X đã đủ thể lệ chưa / nộp bài cần gì": đối chiếu từng mục thể lệ với repo, lập bảng ✅/⬜ (như `docs/CHECKLIST-NOP-BAI.md`), nêu mâu thuẫn (ví dụ bảng A/B, hạn nộp 23:59 so với 00:30) và đề nghị làm sớm hơn mốc sớm nhất.
- Giữ `docs/PROGRESS.md` và `docs/DECISIONS.md` cập nhật: phiên làm việc bị nén/khởi động lại thì đó là bộ nhớ duy nhất; mỗi quyết định có mã `Dxx`.
- Khi nhận phản hồi kiểu "UI đẹp nhưng...": liệt kê từng lỗi người dùng nêu, sửa **cả lớp lỗi tương tự** ở mọi trang ("áp dụng cho tất cả landing page tương tự"), chụp lại cả ba khổ (máy tính, tablet, điện thoại) trước khi báo xong.

## 8. Quy ước UI cố định (tóm tắt để agent không phải đoán)

- Icon SVG nét (`stroke="currentColor"`), cùng một bộ; mọi mục menu/tab/nút công cụ đều có icon; trạng thái đang chọn (✓) đặt bên phải để icon thẳng cột.
- Một màu nhấn; nút chính gần đen hoặc accent; viền 1px mờ; không bóng nặng; không gradient/glow trừ nút CTA có chủ đích.
- Vùng chạm ≥ 44px, ô nhập ≥ 16px, chữ ≥ 14px; chữ thường tương phản ≥ 4.5:1; viền ô nhập ≥ 3:1.
- Chuyển động 120/200/320 ms, `ease-out` mũ; chỉ `transform/opacity`; mọi chức năng có phản hồi; có công tắc hiệu ứng (Bật/Theo máy/Tắt).
- Mỗi màn: đúng một `h1` + một dòng mô tả; xoá = hộp xác nhận riêng (hoặc giữ-để-xoá), không `confirm()`/`alert()` gốc; lưu tự động có chỉ báo "Đã lưu".
- Phím tắt: Esc đóng dialog (ưu tiên cao nhất, trả focus), Ctrl+Z/Ctrl+Shift+Z hoàn tác/làm lại, Ctrl+K bảng lệnh, Ctrl+/− thu phóng.

=================== FILE: templates/BANG-KIEM-THU.md ===================
# Bảng kiểm thử: <Tên sản phẩm>

**Đội:** <Tên đội> · **Bảng:** <A / B> · **Thử ngày:** <dd/mm/yyyy>, <giờ> · **Môi trường:** <bản online GitHub Pages / local>, <trình duyệt, cỡ màn hình>

Chỉ ghi kết quả đã chạy thật. Ca nào là test tự động, ca nào thử tay, ca nào dùng AI thật hay mô phỏng: ghi rõ ở cột "Dữ liệu và bước thử" hoặc ngay dưới bảng.

## Yêu cầu tối thiểu

| Bảng | Tổng | Bắt buộc |
|---|---|---|
| **A** (Công nghệ) | ≥ 6 ca | 2 ca bình thường · 2 ca đầu vào sai · 2 ca biên hoặc sự cố |
| **B** (Kinh tế) | ≥ 3 ca | 1 ca bình thường · 1 ca thiếu hoặc sai · 1 ca biên |

Mẹo: đặt "Loại ca" đúng nhãn ở cột 2 để BTC dò nhanh. Một ca có thể đáp ứng cả Bảng A và Bảng B; ghi chú ở cột "Loại ca" (ví dụ: `Bình thường (A, B)`).

## Bảng ca kiểm thử

| Mã ca | Loại ca | Dữ liệu và bước thử | Kỳ vọng | Kết quả thực tế | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| TC01 | Bình thường (A, B) | <Dữ liệu mẫu, ví dụ: bấm "Điền dữ liệu mẫu" → "<nút tạo>"> | <Hiện đủ <n> phần, có nhãn chế độ> | <Ghi đúng điều quan sát được, kèm ngày> | <Đạt / Chưa đạt> |
| TC02 | Bình thường (A) | <…> | <…> | <…> | <…> |
| TC03 | Đầu vào sai (A, B) | <Bỏ trống trường bắt buộc, ví dụ: tên sự kiện> | <Báo lỗi ngay dưới ô, không tạo dữ liệu> | <…> | <…> |
| TC04 | Đầu vào sai (A) | <Định dạng sai, ví dụ: SĐT "12345", email "abc"> | <Báo lỗi từng ô, không lưu> | <…> | <…> |
| TC05 | Biên hoặc sự cố (A, B) | <Trùng dữ liệu, ví dụ: đăng ký lại cùng SĐT> | <Báo đã có, không ghi thêm> | <…> | <…> |
| TC06 | Biên hoặc sự cố (A) | <Hết chỗ, sự kiện đã qua, hoặc AI trả JSON lỗi> | <Chuyển danh sách chờ / hiện "<trạng thái>" / bù bằng bản mô phỏng và báo rõ> | <…> | <…> |

Thêm ca nếu có thời gian (TC07 trở đi), ưu tiên ca liên quan đến luồng chấm điểm chính.

## Kiểm thử tự động (nếu có)

- Lệnh: `<lệnh test>`: <số ca đạt>/<tổng số ca>, không lỗi console.
- File test: `tests/<tên file>`.

## Chưa kiểm chứng

- <Ví dụ: gọi AI thật chưa thử vì không có key. Cách thử: nhập key vào ô <…>, bấm <…>.>
- <Ví dụ: thử trên điện thoại thật chưa làm, mới thử bằng giả lập.>

=================== FILE: templates/CHECKLIST-CHUNG-KET.md ===================
# Checklist chung kết: <Tên sản phẩm>

> Dùng cho ngày chấm trực tiếp. In ra hoặc để trên màn hình phụ. Tick từng dòng, không dựa vào trí nhớ.

> **CẢNH BÁO: câu nhãn mô phỏng AI phải chép NGUYÊN VĂN từ đề/BTC của chung kết.** `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của VÒNG LOẠI (starter đặt sẵn làm mặc định trong `js/config.js`), chung kết có thể khác. Đối chiếu từng chữ, từng dấu với đề trước khi quay video/nộp; chỗ cần khớp: `mockNotice` trong `js/config.js`, 2 assert trong `tests/smoke.cjs`, README, bảng kiểm thử, slide, ảnh minh chứng.

## Trước khi đi (trước 1 ngày)

**Thiết bị**
- [ ] Laptop chạy demo: đã cập nhật hệ điều hành, đã đóng ứng dụng nặng không cần.
- [ ] Điện thoại để xem bản responsive: đã đăng nhập sẵn, cỡ chữ mặc định.
- [ ] Máy dự phòng (nếu có): đã cài trình duyệt, đã mở link Pages.
- [ ] Dây sạc laptop, dây sạc điện thoại, adapter HDMI hoặc USB-C nếu cần chiếu màn hình.
- [ ] Chuột, bộ chuyển đổi, tai nghe nếu có thuyết trình giọng nói.

**Mạng**
- [ ] Đã thử điểm phát wifi (hotspot) từ điện thoại. Ghi lại tên và mật khẩu hotspot ở chỗ dễ thấy.
- [ ] Biết cách bật hotspot trên điện thoại chính và điện thoại dự phòng.

**Tài khoản và dữ liệu**
- [ ] Các tài khoản cần dùng (Google, Firebase, GitHub, hosting) đã đăng nhập sẵn trên trình duyệt của máy chạy demo.
- [ ] Mật khẩu hoặc mã 2 lớp đã sẵn sàng, không cần nhớ lại lúc chấm.
- [ ] Dữ liệu mẫu đã có trong app; biết nút "<Điền dữ liệu mẫu>" ở đâu.
- [ ] Đã tắt chế độ lưu mật khẩu tự động cho tài khoản không cần thiết.

**Sản phẩm**
- [ ] Link GitHub Pages chạy đúng bản đã nộp. Đã thử ở cửa sổ ẩn danh.
- [ ] Nhánh và tag/commit đã nộp được ghi lại trong `PROGRESS.md`.
- [ ] Không còn `<…>` trong README, bảng kiểm thử, minh chứng AI.
- [ ] Câu nhãn mô phỏng AI khớp **nguyên văn** đề/BTC chung kết (không phải câu vòng loại nếu đề đổi chữ): mở app ở chế độ Mô phỏng, đọc chân trang và nhãn cạnh kết quả AI, so từng chữ với đề.
- [ ] Đã chạy `node tools/bump-version.cjs` và `node scripts/scan-secrets.mjs .` (sạch) trên bản nộp.

**Dự phòng**
- [ ] Video backup 2 phút (MP4) đã có trên máy chạy demo và trên USB.
- [ ] Slide hoặc tài liệu tóm tắt dạng PDF trên USB. Mở thử được trên máy khác.
- [ ] Ảnh chụp màn hình các màn hình chính (đề phòng mất mạng).

## Trong ngày (trước khi vào phòng và khi đang chấm)

- [ ] Mở sẵn: link Pages, bảng kiểm thử, README, `KICH-BAN-DEMO.md`, video backup (tab riêng).
- [ ] Zoom trình duyệt ở **100%**. Thử phóng to 110% và thu về 90% xem bố cục có vỡ không; để ở 100% khi chấm.
- [ ] Tắt thông báo hệ thống, chế độ tập trung (không nhận tin nhắn trong lúc demo).
- [ ] Kiểm tra độ sáng màn hình và cỡ chữ đủ đọc từ chỗ giám khảo ngồi.
- [ ] Tắt tab không cần thiết, đóng cửa sổ có tài khoản cá nhân không liên quan.
- [ ] Điện thoại để chế độ máy bay khi không cần, trừ khi đang dùng hotspot.
- [ ] Đã chạy lại dữ liệu mẫu ngay trước khi vào, để demo không bắt đầu với form trống.
- [ ] Đang cắm sạc laptop.
- [ ] Biết ai trong đội trả lời câu nào trong `HOI-DAP.md`.

**Khi mạng hoặc app lỗi:**
- [ ] Chuyển sang video backup và nói rõ đó là bản quay thao tác thật.
- [ ] Nếu chỉ một tính năng lỗi: bỏ qua, nói thẳng và tiếp tục mốc sau.
- [ ] Không khởi động lại máy trước mặt giám khảo nếu chưa cần.

## Sau khi chấm

- [ ] Ghi lại câu hỏi giám khảo đã hỏi và câu trả lời (để làm `HOI-DAP.md` đúng hơn).
- [ ] Ghi lại lỗi xảy ra, kèm mốc giờ và cách xử lý.
- [ ] Không sửa tính năng sau giờ nộp nếu thể lệ yêu cầu bản nộp là căn cứ chấm.
- [ ] Giữ nguyên tag/commit đã nộp để đối chiếu.
- [ ] Lưu ảnh màn hình xác nhận đã nộp bài và các file đã dùng (ZIP, PDF, MP4).
- [ ] Đóng gói các file đã nộp vào một thư mục để tra cứu sau này.

=================== FILE: templates/CLAUDE.md ===================
# Hướng dẫn cho Claude: <Tên sản phẩm>

Dự án thi sprint 60 phút. Tài liệu nằm trong `docs/`: `spec-nhanh.md` (phạm vi), `PROGRESS.md` (run-sheet), `DECISIONS.md` (quyết định), `BANG-KIEM-THU.md`, `MINH-CHUNG-AI.md`, `KICH-BAN-DEMO.md`, `HOI-DAP.md`, `CHECKLIST-CHUNG-KET.md`.

## Đầu mỗi phiên
1. Đọc `docs/PROGRESS.md`. Nếu có mục "Việc cần làm" còn ô chưa tick, nhắc đội ngay, kèm cách làm ngắn.
2. Đọc `docs/spec-nhanh.md` trước khi viết mã. Không làm tính năng nằm ngoài danh sách.

## Quy tắc sản phẩm
- **Giao diện tiếng Việt có dấu.** Mã nguồn, tên biến, tên file bằng tiếng Anh.
- **Phạm vi:** chỉ làm đúng 5 tính năng của đề. Thêm tính năng khác chỉ khi đội đồng ý và ghi thành `Dxx` trong `DECISIONS.md`.
- **Luồng chính chạy trọn trước khi làm đẹp.** Nhập → AI (hoặc mô phỏng) → kết quả → lưu → xem lại.
- **Dữ liệu mẫu:** có nút "<Điền dữ liệu mẫu>" để demo và kiểm thử lặp lại được.
- **Ngày, giờ, địa điểm, giá, tên người:** luôn lấy từ form, không để AI viết.
- **Giờ hiển thị:** `Asia/Ho_Chi_Minh`.

## Mô phỏng và AI
- AI chỉ gọi qua `EP.ai.generate({ prompt, schema, mock }, { input })` (`js/ai.js`, một chỗ duy nhất); đặc tả prompt/schema/mock để trong `js/ai-specs.js` hoặc ở đầu feature. Không tự `fetch` tới Gemini.
- Kết quả AI luôn qua bước kiểm tra cấu trúc (đủ trường, đúng kiểu). Thiếu thì bù bằng bản mô phỏng và báo rõ cho người dùng.
- Luôn có chế độ mô phỏng. Khi đang dùng mô phỏng, giao diện hiện nhãn: `<câu nhãn đúng nguyên văn đề>` (đặt ở `mockNotice` trong `js/config.js`, hiển thị bằng `EP.ai.noticeHtml`). **Chép từng chữ từ đề chung kết/BTC; `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của vòng loại.** Đổi câu thì sửa luôn 2 assert trong `tests/smoke.cjs`.
- Không được ghi "AI thật" trong README, video hay bảng kiểm thử khi thực tế đang chạy mô phỏng.

## Bảo mật
- **Không bao giờ** đưa API key, mật khẩu hay token vào mã nguồn, README, commit, ảnh chụp hay khung chat.
- Key nằm trong `.env.local` (đã có trong `.gitignore`) hoặc do người dùng nhập ô riêng trên app, lưu trong trình duyệt của họ.
- `.env.example` chỉ có tên biến, không có giá trị.
- Trước khi commit, chạy `node scripts/scan-secrets.mjs . .env.local` (nếu có file env) hoặc `node scripts/scan-secrets.mjs .`. Nếu bị flag, dừng lại và báo đội.
- Không đưa secret ra phía client. Route hoặc hàm có dữ liệu cá nhân phải kiểm tra đăng nhập và quyền.

## Quy trình mỗi bước
1. Kế hoạch ≤ 10 dòng, nêu rõ file sẽ sửa.
2. Làm thay đổi nhỏ nhất đủ để tính năng chạy.
3. Chạy `node tests/smoke.cjs http://localhost:8211/` (và `node --check js/*.js features/*/feature.js`). Không commit khi test đỏ.
4. Báo 4 mục: **đã xong · còn mô phỏng · cách chạy thử · cách xem bằng mắt**.
5. Commit và push (xem "Git và triển khai").

## Phiên bản
- Mỗi lần push lên nhánh nộp: chạy `node tools/bump-version.cjs` (tăng số trong `js/version.js` và gắn `?v=` vào `index.html`).

## Kiểm thử
- Kiểm thử luồng chính bằng `node tests/smoke.cjs http://localhost:8211/` trước mỗi lần push.
- Cập nhật `docs/BANG-KIEM-THU.md` khi kết quả thay đổi. Chỉ ghi kết quả đã chạy thật.

## Git và triển khai
- Làm việc trên nhánh `<tên nhánh>`. Không push thẳng `main` khi chưa có sự đồng ý của đội.
- Commit nhỏ, thông điệp tiếng Việt hoặc tiếng Anh ngắn, mô tả việc đã làm.
- Push: `git push -u origin <tên nhánh>`.
- GitHub Pages: vào **Settings → Pages**, chọn Source là nhánh `<tên nhánh>` và thư mục `/ (root)`. Sau khi push, chờ 1–2 phút rồi mở link ở cửa sổ ẩn danh để chắc là bản mới nhất.
- Không đưa gói ZIP nộp bài vào repo. Tạo gói ZIP khi đội đồng ý.

## Môi trường
- Chạy local: `python3 -m http.server 8211` (cổng 8211, **không dùng 8000**), mở `http://localhost:8211/?demo=1`.
- Kiểm thử: `node tests/smoke.cjs http://localhost:8211/ [--shots thư-mục-ảnh]` (cần Playwright).
- Link Pages: `<URL>`.

=================== FILE: templates/DECISIONS.md ===================
# Các quyết định đã chốt

Mỗi quyết định một mục, đánh số tăng dần, không sửa số cũ. Đổi quyết định cũ thì thêm mục mới ghi "thay một phần Dxx".
Ghi ngay khi quyết định, không đợi cuối sprint. Viết ngắn, tối đa 4 dòng mỗi mục.

Ví dụ (xoá khi dùng thật):

## D1: Chế độ AI mặc định là mô phỏng (<hh:mm>, <đội quyết định | giám khảo hướng dẫn | chủ dự án đồng ý>)

- Bối cảnh: chưa có API key lúc chạy thử; nộp bài cần chạy được không cần mạng.
- Cách làm: AI mô phỏng ghép câu từ công thức; có nhãn "<câu nhãn>" trên giao diện; AI thật là tuỳ chọn, người dùng tự nhập key.
- Ảnh hưởng / chưa làm: chưa gọi AI thật; ghi ở mục "Chưa kiểm chứng" của bảng kiểm thử.

---

## D2: <Tiêu đề quyết định> (<hh:mm>, <người quyết định>)

- Bối cảnh: <vì sao phải quyết>
- Cách làm: <đã làm gì>
- Ảnh hưởng / chưa làm: <tính năng nào bị ảnh hưởng, việc nào để sau>

=================== FILE: templates/HOI-DAP.md ===================
# Chuẩn bị hỏi đáp: <Tên sản phẩm> (Bảng B)

> 20 câu hỏi giám khảo hay hỏi, với khung trả lời. Thay `<…>` bằng số liệu thật của đội. Đừng học thuộc: trả lời theo cấu trúc **Trả lời trực tiếp → Bằng chứng (chỗ trên app hoặc file) → Giới hạn nếu có**.
> Đừng bịa số. Chưa làm thì nói chưa làm, kèm cách đội sẽ làm.

## A. Cách dùng

**1. Người dùng thật của sản phẩm là ai, và họ dùng trong bao lâu?**
- Trả lời: <persona>, dùng khoảng <n> phút từ lúc nhập đến lúc có trang kết quả.
- Bằng chứng: bấm "<Điền dữ liệu mẫu>" rồi tính từ form đến kết quả.

**2. Một người chưa biết gì về sản phẩm, làm sao biết bắt đầu từ đâu?**
- Trả lời: <màn hình đầu tiên có gì>, <nút chính nằm ở đâu>.
- Bằng chứng: <có hướng dẫn ngắn / dữ liệu mẫu có sẵn>.

**3. Kết quả đầu ra dùng được ngay hay phải chỉnh tay?**
- Trả lời: <dùng được ngay / cần chỉnh <phần nào>, chỉnh bằng cách nào>.
- Giới hạn: <…>.

**4. Sau khi có kết quả, người dùng đưa cho khách bằng cách nào?**
- Trả lời: <link, QR, xuất file, tải về>.
- Bằng chứng: <bấm thử đường đi đó trên app>.

## B. Nghiệp vụ

**5. Nhập thiếu hoặc sai thì app xử lý thế nào?**
- Trả lời: báo lỗi ngay dưới từng ô, không tạo dữ liệu. <Liệt kê quy tắc chính.>
- Bằng chứng: TC03 và TC04 trong `BANG-KIEM-THU.md`.

**6. Hai người (hoặc một người bấm hai lần) cùng gửi, có bị ghi trùng không?**
- Trả lời: <trùng theo khoá nào: SĐT, email>, <trùng thì báo đã có>.
- Bằng chứng: TC05.

**7. Hết chỗ thì sao?**
- Trả lời: <danh sách chờ / báo hết>, nút đổi thành <…>.
- Bằng chứng: TC06.

**8. Sự kiện đã diễn ra thì trang hiện gì?**
- Trả lời: nhãn "<Sự kiện đã diễn ra>", không đếm số âm, ẩn form.
- Bằng chứng: <ca thử đặt thời gian quá khứ>.

**9. Vì sao chọn quy tắc này, không chọn quy tắc khác?**
- Trả lời: <lý do theo nghiệp vụ, ví dụ: một SĐT chỉ là một người tham dự>.
- Ghi chú: quyết định này ghi ở `DECISIONS.md` mục <Dxx>.

## C. Dữ liệu thật hay mô phỏng

**10. AI trong app là thật hay mô phỏng?**
- Trả lời: <chế độ mặc định là gì>. Khi chạy <chế độ AI thật>, app dùng <model>. Khi không có key, app <chuyển sang mô phỏng và hiện nhãn>.
- Bằng chứng: nhãn "<câu nhãn>" trên giao diện.

**11. Làm sao giám khảo biết nội dung không phải do công thức sinh ra?**
- Trả lời: mục chế độ hiện trên giao diện và trong README; kết quả thật có <dấu hiệu, ví dụ: câu văn không lặp mẫu>.
- Giới hạn: <…>.

**12. API key được lưu ở đâu? Có bị lộ không?**
- Trả lời: <key nằm trong trình duyệt của người dùng / biến môi trường máy chủ>. Không có key nào trong mã nguồn.
- Bằng chứng: `scripts/scan-secrets.mjs` (kết quả đã chạy, <n> chỗ flag, <lý do>).

**13. Dữ liệu của người dùng lưu ở đâu, mất khi nào?**
- Trả lời: <localStorage trên một trình duyệt / Firestore có đăng nhập>. Xoá dữ liệu trình duyệt thì mất.
- Giới hạn: không đồng bộ giữa các máy nếu chưa xuất bản.

## D. Vòng cải thiện bằng AI

**14. AI viết sai hoặc trả về sai định dạng thì làm gì?**
- Trả lời: tách JSON khỏi lời dẫn, kiểm tra đủ trường; thiếu thì bù bằng bản mô phỏng và báo rõ.
- Bằng chứng: TC06 hoặc vòng <n> trong `MINH-CHUNG-AI.md`.

**15. Đội đã dùng AI để cải thiện sản phẩm như thế nào? Cho một ví dụ.**
- Trả lời: vòng <n>: vấn đề <…> → yêu cầu sửa <…> → kiểm tra lại <kết quả đo được>.
- Bằng chứng: ảnh <n> trong `MINH-CHUNG-AI.md`.

**16. Phần nào AI viết, phần nào đội tự kiểm tra?**
- Trả lời: AI viết mã và prompt; đội tự mở app, thử trên <thiết bị>, và chạy <lệnh test>. Kết quả nằm ở `BANG-KIEM-THU.md`.

## E. Giới hạn và mở rộng

**17. Sản phẩm có chạy được với nhiều người cùng lúc không?**
- Trả lời: <có / chưa: lý do, ví dụ: localStorage chỉ một máy>. Khi xuất bản dùng <Firestore> thì số đếm chung.
- Giới hạn: <…>.

**18. Nếu làm thêm một tuần, đội sẽ làm gì trước?**
- Trả lời: <việc ưu tiên 1 và lý do>, <việc ưu tiên 2>. Không ưu tiên <tính năng ngoài đề>.

**19. Vì sao không làm tính năng <X> trong đề?**
- Trả lời: <nằm trong phần "Ngoài phạm vi" của `spec-nhanh.md`, lý do: thời gian 60 phút / đề không yêu cầu>.

**20. Bảo mật và quyền truy cập thế nào?**
- Trả lời: <ai xem được gì>. Ghi chú đã kiểm thử: <ca bảo mật nếu có>.
- Giới hạn: <chưa kiểm tra bằng tài khoản thứ ba, v.v.>.

=================== FILE: templates/KICH-BAN-DEMO.md ===================
# Kịch bản demo trực tiếp: <Tên sản phẩm> (2 phút)

> Demo trên bản online đã xuất bản, không demo trên bản mô tả. Chuẩn bị sẵn: tab đã mở đúng trang, dữ liệu mẫu đã nạp, cỡ chữ trình duyệt 100%, cửa sổ điện thoại đã đăng nhập (nếu cần).
> Lời thoại mẫu ở cuối file. Đọc to một lần trước giờ chấm để chắc vừa 2 phút.

## Trước khi bắt đầu (30 giây trước)
- [ ] Mở link Pages, đã tải xong, không có lỗi đỏ trong console.
- [ ] Đã bấm "<Điền dữ liệu mẫu>" một lần, nếu cần làm lại thì tải lại trang.
- [ ] Mạng ổn định. Nếu không chắc, mở sẵn video backup ở tab khác.

## Bảng thời gian

| Mốc | Làm gì trên màn hình | Nói gì (tóm tắt) | Tính năng |
|---|---|---|---|
| 0:00–0:10 | Trang chủ, giới thiệu sản phẩm và người dùng | Ai dùng, giải quyết việc gì | Mở đầu |
| 0:10–0:30 | Nhập form. Bỏ trống một ô để cho thấy báo lỗi, rồi điền đúng | Quy tắc kiểm tra lỗi | T1 |
| 0:30–0:50 | Bấm nút AI. Chỉ chỗ có nhãn chế độ mô phỏng hoặc AI thật | AI viết gì, cái gì lấy từ form | T2 |
| 0:50–1:10 | Trang kết quả hiện đủ phần, bật xem trên điện thoại (thu nhỏ cửa sổ) | Kết quả dùng được ngay | T4 (dựng trang) |
| 1:10–1:30 | Điền form đăng ký, bấm gửi, cho thấy số đếm tăng | Chống trùng, hết chỗ, lưu ở đâu | T4 (đăng ký) |
| 1:30–1:45 | Mở danh sách đã lưu, sửa hoặc xoá một mục | Xem, sửa, xoá lịch sử | T3 |
| 1:45–2:00 | Tạo mới một mục, quay về danh sách | Kết thúc, cảm ơn | T5 |

> Chỉnh các mốc theo 5 tính năng của đề. Mỗi tính năng có đúng một lần thao tác và một câu giải thích. Không dành quá 20 giây cho một tính năng.

## Phương án dự phòng (nếu lỗi giữa chừng)

| Tình huống | Làm gì ngay |
|---|---|
| Trang Pages không tải | Mở video backup (`demo-video/<tên file>.mp4`) ở tab khác, nói: "Đây là bản quay thao tác thật của bản đang chạy." |
| AI không trả kết quả | Chuyển sang chế độ mô phỏng (nút <…>), nói rõ "Đang dùng chế độ mô phỏng, nội dung do công thức sinh ra." |
| Form không lưu | Tải lại trang, bấm "<Điền dữ liệu mẫu>" để có dữ liệu sẵn, tiếp tục từ mốc đang dở. |
| Mất mạng hoàn toàn | Mở bản chạy local (`<lệnh chạy>`) hoặc slide PDF trên USB, giải thích phần đang dở. |
| Vượt thời gian | Bỏ phần T5, nói "Tính năng này có trong spec, em xin bỏ qua vì hết giờ." |

## Lời thoại mẫu (tham khảo, đọc được trong 2 phút)

Mốc đọc khoảng 2,85 từ/giây. Mỗi cảnh nên dài hơn thời gian đọc một chút để có khoảng lặng.

```text
[0:00] Xin chào, đây là <Tên sản phẩm>, giúp <persona> <việc làm> trong <thời gian>.
[0:10] Bước một, nhập <thông tin>. Nếu thiếu hoặc sai, ứng dụng báo lỗi ngay dưới từng ô.
[0:30] Bước hai, AI <việc AI làm>. Ứng dụng có chế độ <AI thật / mô phỏng>, có ghi chú rõ ràng.
[0:50] Bước ba, <kết quả>. Trang hiển thị đẹp trên điện thoại.
[1:10] Bước bốn, khách đăng ký. <Quy tắc chống trùng>. Số đếm cập nhật ngay.
[1:35] Bước năm, <tính năng quản lý>. Mọi mục được lưu, mở lại, sửa hoặc xoá được.
[1:50] <Tên sản phẩm>: <một câu tóm tắt giá trị>. Cảm ơn ban giám khảo đã theo dõi.
```

## Sau khi demo
- [ ] Ghi lại mốc nào bị trễ để trả lời câu hỏi về phạm vi trong `HOI-DAP.md`.
- [ ] Lưu lại link và ảnh màn hình của trang đã chạy.

=================== FILE: templates/MINH-CHUNG-AI.md ===================
# Minh chứng dùng AI để xây dựng và cải thiện sản phẩm: <Tên sản phẩm>

**Đội:** <Tên đội> · **Công cụ AI:** <Claude (model) để lập kế hoạch và viết mã; Gemini để tạo ảnh mockup; …>

> Tối đa **1 trang A4** và **5 ảnh**. Mỗi ảnh là ảnh chụp thật cuộc trò chuyện hoặc màn hình. Che API key, email và số điện thoại thật trước khi chụp hoặc nộp.

Mỗi vòng trả lời đủ 5 mục: **mục tiêu → yêu cầu cho AI → vấn đề phát hiện khi thử → yêu cầu sửa → kết quả kiểm tra lại**. Kết quả phải là thứ đo được hoặc quan sát được, không ghi "đã tốt hơn".

## Vòng 1: <tên vấn đề, ví dụ: bố cục form bị vỡ trên điện thoại>

| Mục | Nội dung |
|---|---|
| Mục tiêu | <…> |
| Yêu cầu cho AI | <Nhóm đã gửi gì: mô tả, ảnh n, đoạn prompt chính> |
| Vấn đề khi thử | <Nhóm thấy gì, ở cỡ màn hình nào> (ảnh 1) |
| Yêu cầu sửa | <Nhóm yêu cầu AI sửa cụ thể điều gì> |
| Kết quả kiểm tra lại | <Ví dụ: "ô SĐT không tràn ở 390px; test e2e-mobile đạt"> |

## Vòng 2: <tên vấn đề, ví dụ: AI trả JSON lỗi làm trang không hiện>

| Mục | Nội dung |
|---|---|
| Mục tiêu | <…> |
| Yêu cầu cho AI | <…> |
| Vấn đề khi thử | <…> (ảnh 2) |
| Yêu cầu sửa | <…> |
| Kết quả kiểm tra lại | <…> |

## Vòng 3: <tên vấn đề>

| Mục | Nội dung |
|---|---|
| Mục tiêu | <…> |
| Yêu cầu cho AI | <…> (ảnh 3) |
| Vấn đề khi thử | <…> |
| Yêu cầu sửa | <…> |
| Kết quả kiểm tra lại | <…> |

## Ảnh minh chứng (tối đa 5)

1. <Mô tả ngắn: ví dụ "Vòng 1, prompt gửi kèm ảnh chụp lỗi">

   ![<mô tả>](minh-chung-ai/anh-1.png)

2. <…>

   ![<mô tả>](minh-chung-ai/anh-2.png)

## Bài học (2–3 dòng)

<AI làm nhanh và chia việc được, nhưng cái gì đã được đội thử tay và kiểm tra lại trên thiết bị thật. Mô tả lỗi cụ thể kèm ảnh giúp AI sửa đúng chỗ.>

=================== FILE: templates/PROGRESS.md ===================
# Run-sheet 60 phút: <Tên sản phẩm>

> Claude cập nhật file này sau mỗi mốc và nhắc đội các mục "Việc cần làm" còn ô chưa tick.
> Giờ tính từ lúc bắt đầu sprint (T0 = <hh:mm>). Mốc nào trễ hơn 5 phút: ghi vào "Quyết định" và cắt phạm vi, không kéo dài mốc sau.

**Đội:** <Tên đội> · **T0:** <hh:mm> · **Hạn nộp:** <hh:mm>
**Cập nhật lần cuối:** <hh:mm>, <đã xong gì, đang làm gì>

## Mốc thời gian

| Thời gian | Việc | Đầu ra | ☐ |
|---|---|---|---|
| 00:00–00:05 | Đọc đề, điền `spec-nhanh.md`, chốt 5 tính năng và phần ngoài phạm vi | Spec 1 trang, có Input→Quy tắc→Output→Lưu trữ | ☐ |
| 00:05–00:10 | Tạo repo bằng `scripts/new-project.sh`, kiểm tra `CLAUDE.md`, push nhánh, bật GitHub Pages | Link Pages mở được (trang trắng cũng được) | ☐ |
| 00:10–00:25 | Làm T1 (nhập liệu có kiểm tra lỗi) và T2 (AI, có chế độ mô phỏng) | Hai tính năng chạy được với dữ liệu mẫu | ☐ |
| 00:25–00:40 | Làm T3, T4, T5. Kiểm tra từng tính năng theo "kiểm tra chấp nhận" | Năm tính năng đều chạy, kể cả khi còn xấu | ☐ |
| 00:40–00:48 | Kiểm thử: chạy `node tests/smoke.cjs http://localhost:8211/`, điền `BANG-KIEM-THU.md` (≥ 6 ca A, ≥ 3 ca B). Chạy `node scripts/scan-secrets.mjs .` | Bảng kiểm thử có kết quả thật; không lộ secret | ☐ |
| 00:48–00:53 | Viết `MINH-CHUNG-AI.md` (1 trang, ≤ 5 ảnh), điền `README-du-thi.md` | Hai tài liệu đủ mục, không còn `<…>` | ☐ |
| 00:53–00:56 | Duyệt `KICH-BAN-DEMO.md`, quay video backup 2 phút, xuất slide PDF | File MP4 và PDF trên máy và USB | ☐ |
| 00:56–00:58 | Commit và push nhánh; mở link Pages ở cửa sổ ẩn danh | Link chạy được, đúng phiên bản | ☐ |
| 00:58–00:60 | Điền form nộp bài, đối chiếu `CHECKLIST-CHUNG-KET.md` | Đã nộp, có ảnh màn hình xác nhận | ☐ |

## Việc cần làm (đội)

- [ ] <Việc> (ví dụ: lấy key Gemini trước T0 nếu muốn chạy AI thật)  
      Cách làm: 1) <…> 2) <…>
- [ ] <Việc> 

## Quyết định trong sprint

Ghi vào `DECISIONS.md` khi đổi phạm vi. Ở đây chỉ ghi tóm tắt: `[hh:mm] Dxx: <việc đã cắt hoặc đổi>`.

- [hh:mm] <…>

## Phạm vi cắt nếu trễ

Thứ tự cắt, từ dưới lên. Không cắt luồng chính (T1 → T2 → kết quả hiện được):

1. <Tính năng phụ, ví dụ: xuất CSV>
2. <Hiệu ứng, ảnh đẹp>
3. <Quản trị, trang nâng cao>

## Ghi chú cần nhớ

- <Lệnh chạy, cổng, URL Pages>
- <Giới hạn: dữ liệu localStorage chỉ trên một máy>
- <Tài khoản, thiết bị, dây sạc đã kiểm tra (xem CHECKLIST-CHUNG-KET.md)>

=================== FILE: templates/README-du-thi.md ===================
# <Tên sản phẩm>: <Tên cuộc thi>

> Điền các mục `<…>`. Ghi đúng công nghệ đã dùng và đúng phiên bản. Xoá dòng mẫu nào không áp dụng.
> Nếu có chế độ AI mô phỏng, giữ nguyên câu cảnh báo dưới đây. **Câu này phải chép NGUYÊN VĂN từ đề/thể lệ chung kết** (câu vòng loại `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ đúng cho vòng loại; đừng dùng lại nếu đề chung kết khác).

> **<Câu cảnh báo mô phỏng AI, đúng nguyên văn thể lệ>**: khi dùng chế độ AI mô phỏng (offline), nội dung do công thức sinh ra, không phải kết quả từ mô hình AI thật.

## 1. Thông tin bài nộp

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | <Tên đội> |
| Bảng thi | <Bảng …> |
| Đề bài | Đề số <số>: <tên đề> |
| Demo trực tuyến | <URL GitHub Pages> |
| Video demo (≤ 2 phút) | <URL video> |
| Source ZIP | <tên gói hoặc URL> |
| Minh chứng dùng AI | `docs/MINH-CHUNG-AI.md` |
| Bảng kiểm thử | `docs/BANG-KIEM-THU.md` (mục 11) |
| Liên hệ | <email> |

## 2. Tính năng chính

Đúng năm tính năng theo đề, theo thứ tự đề bài:

1. **<Nhập dữ liệu đầu vào>**: <trường nào, kiểm tra lỗi ra sao>
2. **<AI phân tích, tạo hoặc gợi ý>**: <AI làm gì, chế độ nào>
3. **<Lưu, xem, sửa, xoá lịch sử>**: <lưu ở đâu>
4. **<Tính năng nghiệp vụ theo đề>**: <quy tắc chính>
5. **<Tính năng theo đề hoặc quản trị>**: <…>

## 3. Công nghệ sử dụng

| Lớp | Công nghệ (kèm phiên bản) |
|---|---|
| Giao diện | <HTML/CSS/JS thuần, hoặc React x.y, Next.js x.y, Tailwind x.y> |
| Thư viện | <…> |
| Lưu trữ | <localStorage / Cloud Firestore / Supabase (Postgres, RLS) / Google Sheet> |
| Đăng nhập | <không / Firebase Authentication bằng Google> |
| Triển khai | <GitHub Pages / Vercel / cPanel> |
| Kiểm thử | <Playwright (Chromium), Vitest…> |

## 4. Tích hợp AI

- **Chế độ đang dùng:** <AI thật: tên model | copy prompt | mô phỏng>. Thiếu key thì app hiện nhãn "<câu nhãn>".
- **AI làm gì:** <…>. Ngày, giờ, địa điểm, giá và tên người luôn lấy từ form, không để AI tự viết.
- **Kiểm soát đầu ra:** <tách JSON khỏi lời dẫn, kiểm tra đủ trường, thiếu thì bù bằng bản mô phỏng và báo rõ>.
- **Bảo mật khoá:** <key do người dùng nhập và chỉ lưu trong trình duyệt của họ | khoá nằm trong biến môi trường máy chủ>. Trong mã nguồn không có key nào. `.env.example` chỉ có tên biến.

## 5. Cài đặt và chạy local

```bash
# 1. Lấy mã nguồn
git clone <URL repo> && cd <thư mục>

# 2. Cài thư viện (nếu có)
<lệnh cài>

# 3. Cấu hình (nếu có): copy file mẫu rồi điền giá trị của riêng bạn
cp .env.example .env.local

# 4. Chạy
python3 -m http.server 8211   # rồi mở http://localhost:8211/ (thêm ?demo=1 để nạp dữ liệu mẫu)

# 5. Kiểm thử (cần Playwright)
node tests/smoke.cjs http://localhost:8211/
```

Cách nhanh nhất để thử: mở trực tiếp `index.html` trên trình duyệt (nếu app không cần server).

## 6. Cấu trúc thư mục

```text
<Tên thư mục>/
├── index.html        # <khung ứng dụng>
├── css/              # <…>
├── js/               # <…>
├── tests/            # <kiểm thử tự động>
└── docs/             # <tài liệu nộp bài>
```

## 7. Truy cập và phân quyền
- <Người tạo trang có cần đăng nhập không>
- <Vai trò, trang quản trị nếu có>

## 8. Giới hạn hiện tại
- <Phần nào là mô phỏng>
- <Dữ liệu lưu ở đâu, mất khi nào (ví dụ: xoá dữ liệu trình duyệt thì mất)>
- <Phần chưa làm hoặc chưa kiểm chứng (ví dụ: chưa gọi AI thật vì không có key)>

## 9. Nguồn tham khảo và khai báo sử dụng
- <Thư viện, font, icon, mẫu giao diện: ghi tên, giấy phép>
- <Công cụ AI đã dùng để xây dựng: Claude (model), Gemini (ảnh mockup)…>
- <Ảnh demo: nguồn và cách tạo>

## 10. Minh chứng dùng AI
- Tệp: `docs/MINH-CHUNG-AI.md`, ảnh trong `docs/minh-chung-ai/`.
- Tóm tắt một vòng thử và cải thiện: <vấn đề → yêu cầu sửa → kết quả kiểm tra lại>.

## 11. Bảng kiểm thử
Chép bảng từ `docs/BANG-KIEM-THU.md` (ít nhất các ca bắt buộc của bảng đăng ký).

## 12. Hồ sơ bàn giao
- Source ZIP gồm mã nguồn, README, minh chứng AI, bảng kiểm thử. Không kèm `.git`, không kèm `.env.local`.
- Tài khoản hoặc dữ liệu demo: <có / không; nếu có, ghi cách lấy>.
- Dữ liệu mẫu: bấm **"<Điền dữ liệu mẫu>"** trong app.

=================== FILE: templates/spec-nhanh.md ===================
# Đặc tả nhanh: <Tên sản phẩm>

> Tối đa 1 trang. Viết trong 5 phút đầu sprint. Sau khi chốt, không thêm tính năng ngoài danh sách này trừ khi ghi thành quyết định mới trong `DECISIONS.md`.

**Đề số:** <số> · **Bảng:** <A / B> · **Đề bài gốc (dán nguyên văn):** <…>

## 1. Bài toán và persona

- **Persona:** <vai trò cụ thể, ví dụ: marketer tổ chức workshop>
- **Họ muốn làm gì:** <…>
- **Vấn đề hiện tại:** <họ đang làm bằng tay, chậm hoặc sai ở đâu>
- **Giá trị sau khi dùng:** <đo được: giảm số bước, gom dữ liệu về một chỗ…>

## 2. Năm tính năng (MVP)

Mỗi tính năng ghi đủ 4 mục: **Input → Quy tắc → Output → Lưu trữ**, cuối cùng là một **kiểm tra chấp nhận** (làm được thì tick).

### T1. <Nhập dữ liệu đầu vào>
- **Input:** <từng trường, kiểu dữ liệu, bắt buộc hay không>
- **Quy tắc:** nếu <thiếu / sai định dạng> thì <báo lỗi ngay dưới ô>; nếu <…> thì <…>
- **Output:** <màn hình hoặc kết quả hiển thị>
- **Lưu trữ:** <localStorage / Firestore / không lưu>
- **Kiểm tra chấp nhận:** ☐ <bước thử> → <kết quả mong đợi>

### T2. <AI phân tích, tạo hoặc gợi ý>
- **Input:** <dữ liệu từ T1 gửi cho AI>
- **Quy tắc:** AI chỉ viết nội dung. <Dữ liệu nào lấy từ form, không để AI bịa>; JSON thiếu trường thì <bù bằng bản mô phỏng và báo rõ>
- **Output:** <cấu trúc kết quả>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T3. <Lưu, xem, sửa, xoá lịch sử>
- **Input:** <…>
- **Quy tắc:** <ví dụ: xoá phải hỏi xác nhận; trùng thì chỉ ghi một lần>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T4. <Tính năng nghiệp vụ theo đề>
- **Input:** <…>
- **Quy tắc:** nếu <…> thì <…>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

### T5. <Tính năng theo đề hoặc quản trị>
- **Input:** <…>
- **Quy tắc:** nếu <…> thì <…>
- **Output:** <…>
- **Lưu trữ:** <…>
- **Kiểm tra chấp nhận:** ☐ <…>

## 3. AI làm gì

| Việc AI làm | Gửi AI gì | AI trả về (JSON) | Code tự tính, AI không được viết | Chế độ mô phỏng trả gì |
|---|---|---|---|---|
| <ví dụ: viết tiêu đề và 3 lợi ích> | <tên, mô tả ngắn> | <{"headline", "benefits": [...]}> | <ngày, giờ, địa điểm, giá, tên người> | <ghép câu từ công thức theo giọng văn> |

- Ba chế độ: **AI thật** (người dùng tự nhập key, key chỉ ở trình duyệt hoặc máy chủ) · **Copy prompt** (dán kết quả về) · **Mô phỏng** (có nhãn: `<câu nhãn đúng nguyên văn đề>`).

## 4. Ngoài phạm vi
- <…>
- <…>
(Ghi rõ những gì KHÔNG làm, để không bị kéo thêm yêu cầu giữa sprint.)

## 5. Dữ liệu mẫu
- Nút **"<Điền dữ liệu mẫu>"** điền: <tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi>
- Có sẵn <n> bản ghi đăng ký mẫu để demo danh sách và số đếm.
- Dùng đúng dữ liệu này khi quay video và khi làm bảng kiểm thử, để kết quả lặp lại được.

## 6. Giả định (chọn mặc định, chủ dự án xác nhận hoặc sửa)
1. <…>
2. <…>

=================== FILE: starter/README.md ===================
# Vibe Sprint Starter

Bộ khung web app thuần HTML/CSS/JS (không build, không CDN) cho cuộc thi 60 phút. Giao diện tiếng Việt, sáng/tối, mobile-first, có sẵn: tab, form kiểm tra, bảng sắp xếp, biểu đồ, AI (mô phỏng / Gemini / copy-dán), xuất CSV, sao lưu JSON, dữ liệu demo.

## 1. Bắt đầu (5 phút)

1. Chép **nội dung thư mục `starter/`** vào gốc repo mới (có `index.html` ở gốc).
2. Sửa `js/config.js`: `appName`, `brandMark`, `tagline`, `heroLead` + `heroEm` (tiêu đề hero ở Tổng quan, vd `'Mỗi đơn hàng,'` + `'lãi hay lỗ?'`; chữ nhấn gradient là `heroEm`), `prefix` (tiền tố khoá localStorage; khoá giao diện là `<prefix>theme`, nên **đổi `prefix` thì sửa luôn `'ep_theme'` trong đoạn script ở `<head>` của `index.html` thành `'<prefix>theme'`**, nếu không giao diện đã chọn bị nháy sáng/tối khi tải lại), `mockNotice`. **`mockNotice` phải chép NGUYÊN VĂN từ đề/BTC của kỳ thi bạn đang thi.** Giá trị có sẵn `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của vòng loại; chung kết có thể khác, đừng giả định. `tests/smoke.cjs` đọc `EP.config.mockNotice` và `EP.config.prefix` nên không cần sửa test khi đổi hai giá trị này.
3. Sửa `<title>` và `<meta description>` trong `index.html`. Giao diện mặc định là preset **xclipse** (Ice `#DBF2FC` / Navy `#072D59` / Coral `#FD6E88`, có hero kính gân). Đổi sang Lucian bằng `<html data-preset="lucian">` trong `index.html`; tên token giữ nguyên nên feature không phải sửa. Thương hiệu khác: sửa khối xclipse trong `css/tokens.css` (cả 3 khối: sáng, tối theo hệ thống, tối thủ công).
4. Chạy thử: `python3 -m http.server 8211` rồi mở `http://localhost:8211/` (bảng cổng của skill: 8211 điều phối, 8212-8230 các agent, **không dùng 8000**).
5. Nhân bản feature (mục 2). Khi đã có feature thật, xoá `features/_example` và `features/_playground` **cùng với hai dòng `<script src="features/_example/feature.js">` và `<script src="features/_playground/feature.js">` trong `index.html`** (xoá thư mục mà quên dòng script thì trình duyệt báo 404 và smoke test đỏ). Smoke test tự bỏ qua các khối của hai feature này khi tab của chúng không còn.

Thứ tự nạp script trong `index.html`: config, version, core, ui, form, charts, export, ai, demo, mô-đun tuỳ chọn (mock, metrics, match, calc, checklist, quiz, chat, timeslot), features, **app.js cuối cùng**. Mô-đun không dùng thì xoá dòng `<script>` tương ứng.

## 2. Thêm một feature (5 phút)

```
cp -r features/_example features/don-hang      # đổi NAME 'example' -> 'orders', collection 'items' -> 'orders'
```
Thêm `<script src="features/don-hang/feature.js"></script>` trước `js/app.js` (và sau `js/domain.js` nếu có, xem dưới). Mỗi feature là một file IIFE gọi:

| Việc | API |
|---|---|
| Đăng ký tab + h1 + KPI tổng quan | `EP.register({ id, label, title, desc, icon, order, summary(), actions(), render(el) })` |
| Dữ liệu CRUD lưu localStorage | `var rows = EP.collection('orders')` -> `add/update/remove/get/list/onChange` |
| Form khai báo | `EP.form.render(SCHEMA, values)` + `EP.form.bind(form, SCHEMA, { onSubmit })`; đọc giá trị không cần bind: `EP.form.values(formEl, SCHEMA)` (số -> Number, rỗng -> null, checkbox -> boolean) |
| Bảng sắp xếp | `EP.ui.table(el, { columns, rows, actions, onAction })` |
| Hộp thoại / xác nhận / toast | `EP.ui.dialog`, `EP.ui.confirm`, `EP.ui.toast` |
| Biểu đồ | `EP.charts.bar / line / donut(el, [{label, value}])`; bar/line hỗ trợ giá trị âm (đường 0 làm gốc, cột âm đi xuống, vạch chia đẹp) |
| AI | `EP.ai.generate({ prompt, schema, mock }, { input })` |
| Dữ liệu demo | `EP.demo.register('orders', { version: 1, rows: [...] })` |
| Xuất | `EP.export.csv(name, rows, cols)`, `EP.export.backup()`, `EP.export.print()` |

Icon có sẵn: xem `EP.ui.icons` (có `file`, `print`, `chart`, `calc`, `chat`...); tên không có sẽ rơi về `info` và in `console.warn` liệt kê tên hợp lệ.

`features/_example/feature.js` có chú thích đánh số [1]..[6] cho từng bước. Router tự dựng tab, section, đúng một `<h1>` mỗi view, chuyển cảnh, và KPI ở Tổng quan (qua `summary()`).

### Logic nghiệp vụ dùng chung giữa các feature (`js/domain.js`)
Khi hai feature trở lên cùng tính một công thức (lãi/lỗ, điểm, giá tối thiểu...), **đừng chép công thức vào từng feature**: viết một lần trong `js/domain.js` rồi để mọi feature và test gọi chung.
```js
/* js/domain.js: hàm thuần, không đụng DOM, không đọc localStorage */
(function (root) {
  'use strict';
  var EP = root.EP;
  EP.domain = {
    /** Lãi một đơn = giá bán - giá vốn - phí sàn - ship - quảng cáo. Luôn trả số hữu hạn (chia an toàn). */
    profitPerOrder: function (p) { return p.price - p.cost - p.price * p.feePct / 100 - p.shipping - p.ads; }
  };
})(window);
```
Nạp **sau `js/config.js`/`core.js`/`metrics.js` và TRƯỚC mọi `features/*`** trong `index.html`: `<script src="js/domain.js"></script>`. Feature dùng `EP.domain.profitPerOrder(...)`; `tests/smoke.cjs` thêm vài dòng `EP.domain.*` trong khối `page.evaluate` (ca thường, ca biên 0 và âm) để công thức sai bị bắt ngay. Dữ liệu demo cũng nên chọn để có cả ca lãi lẫn ca lỗ.

### AI trong 3 chế độ
`EP.ai.generate(spec, { mode })` với `mode` = `mock` | `gemini` | `paste` (mặc định lấy từ chọn của người dùng ở Cài đặt).
- **mock**: chạy `spec.mock(input)` offline, tất định. Luôn hiển thị `EP.ai.MOCK_NOTICE` (= `mockNotice` trong `config.js`, mặc định là câu vòng loại "Bản demo vòng loại - Dữ liệu mô phỏng AI", nhớ thay bằng câu nguyên văn của đề chung kết) bằng `EP.ai.noticeHtml(result)`; chân trang cũng hiện khi đang ở chế độ mock.
- **gemini**: key người dùng nhập ở Cài đặt (nằm trong bộ nhớ trang, chỉ lưu localStorage nếu tick "Nhớ key"), gửi qua header `x-goog-api-key`, tự đổi model khi 429/quá tải (danh sách trong `ai.js`), rút JSON, kiểm tra schema, sai thì thử lại 1 lần, vẫn lỗi thì rơi về mock kèm cảnh báo.
- **paste**: hộp thoại cho copy prompt, dán câu trả lời của Claude/ChatGPT/Gemini, kiểm tra như trên.
Schema: `string{min,max,enum}`, `number{min,max,integer}`, `boolean`, `array{of,min,max}`, `object{props}`; trường nào cũng bắt buộc trừ `optional:true`. Kết quả được cắt/ép kiểu tự động.

### Mô-đun tiện ích (đều nhỏ, có chú thích đầu file, demo ở tab "Mô-đun")
`mock.js` (hash/rng/sentiment/classify tất định), `metrics.js` (chia an toàn, CTR/CPC/CPA/ROAS, VND, xu hướng), `match.js` (bỏ dấu tiếng Việt, FAQ matcher, tìm kiếm), `calc.js` (form -> kết quả trực tiếp), `checklist.js` (chấm điểm có trọng số /100), `quiz.js` (đồng hồ, điểm theo tốc độ, Top 10 đồng hạng), `chat.js` (bong bóng chat + quick reply + FAQ bot), `timeslot.js` (khung giờ, trùng lịch, đếm ngược).

## 3. Quy ước
- Chữ hiện cho người dùng: **tiếng Việt có dấu**; tên biến, hàm, file, comment code: tiếng Anh hoặc tiếng Việt ngắn gọn, nhưng API công khai dùng tiếng Anh.
- Mọi kết quả mô phỏng AI phải kèm `MOCK_NOTICE` (cấu hình ở `js/config.js`).
- Dữ liệu người dùng/AI nhúng vào HTML phải qua `EP.esc()`.
- Màu, cỡ, khoảng cách chỉ dùng biến trong `tokens.css`; CSS mới đặt trong `@layer components`.
- Mobile 390px không được cuộn ngang; nút/ô nhập >= 40px; mỗi view đúng một `<h1>`.
- Không để key API trong code hoặc repo.

## 4. Kiểm thử
```
python3 -m http.server 8211 &        # tại thư mục gốc app
node tests/smoke.cjs http://localhost:8211/ [--shots thu-muc-anh]
```
Cần Playwright (`npm i -D playwright` hoặc cài global). Test kiểm: không lỗi console, mọi tab (1 h1), không tràn ngang 390px sáng/tối, đổi giao diện, CRUD + kiểm tra form của feature mẫu, AI mock + MOCK_NOTICE, CSV có BOM, sao lưu/khôi phục, Gemini giả (retry, đổi model, rơi về mock), logic các mô-đun. Khi thêm feature, chép `tests/feature-template.snippet` (CRUD + form + biên + khoá theo `prefix` + mock notice) vào chỗ `FEATURE TESTS` của `tests/smoke.cjs` rồi đổi tên tab/collection/selector. Smoke test chạy đúng cả khi đã xoá `_example`/`_playground` và các mô-đun tuỳ chọn.

## 5. Phiên bản và deploy GitHub Pages
1. `node tools/bump-version.cjs` (tăng patch; hoặc `minor`, `major`, `1.2.3`, `--stamp`): cập nhật `js/version.js` và gắn `?v=` vào mọi js/css trong `index.html` để không dính cache cũ.
2. Commit và push lên nhánh `main`.
3. GitHub: Settings -> Pages -> Source: *Deploy from a branch* -> `main` / `(root)`. Đợi ~1 phút, mở `https://<user>.github.io/<repo>/`.
4. Đường dẫn trong app là tương đối nên chạy được ở thư mục con `/<repo>/`. Routing dùng `#/tab` nên không cần cấu hình 404.
5. Trước khi nộp: chạy smoke test, mở bản deploy trên điện thoại, kiểm tra `?demo=1` nạp lại dữ liệu mẫu.

## 6. Cấu trúc
```
index.html            vỏ app: skip link, tab, nút giao diện, chân trang, toast
css/tokens.css        biến thiết kế sáng/tối + khai báo @layer
css/app.css           toàn bộ thành phần
js/                   config, version, core, ui, form, charts, export, ai, demo, app + mô-đun
features/_example     feature mẫu đầy đủ (CRUD + form + AI + biểu đồ)
features/_playground  demo calc/checklist/quiz/chat
tests/smoke.cjs       Playwright smoke test (+ tests/feature-template.snippet: khối mẫu cho feature thật)
tools/bump-version.cjs
```

=================== FILE: deck/README.md ===================
# Deck kit — slide pitch cho chung kết 60 phút

Một file `deck.html` (không phụ thuộc thư viện, 16:9, chạy offline). Bạn **chỉ sửa dữ liệu**, không sửa layout.

Phím: `←/→/Space` chuyển slide · `N` ghi chú + đồng hồ · `F` toàn màn hình · vuốt/bấm trên điện thoại · `Ctrl+P` in PDF. Link thẳng slide: `deck.html#6`.

## Quy trình 5 phút

1. **Sao chép mẫu**: `cp template.data.js deck.data.js` (xem bản hoàn chỉnh: `deck.html?data=example.data.js`).
2. **Điền 12 ô** đánh số `[1]`–`[12]` trong `deck.data.js`: tên app · tagline · đề/bảng/đội · persona+nỗi đau · tình huống · giải pháp một câu · 5 tính năng · link live + video · AI thật/mô phỏng/kiểm soát · bảng kiểm thử · 3–4 con số · thành viên. QR tự sinh từ `meta.liveUrl`.
3. **Chụp ảnh** (app chạy local, ví dụ `python3 -m http.server 8225` (cổng deck trong bảng cổng của skill; không dùng 8000) ở thư mục gốc app):
   `cp tools/capture.example.json tools/capture.json`, sửa `base` (file mẫu ghi `http://localhost:8225/`, đổi thành cổng bạn đang dùng) và `views`, rồi `node tools/capture.cjs tools/capture.json`.
   File mẫu nhắm vào route của starter (`#/home`, `#/example`): đổi `example` thành id feature thật, đổi selector theo form của bạn. Bước (`steps`): `click`, `fill:[sel,text]`, `select:[sel,value]`, `press`, `wait`, `waitFor`, `hide`, `scroll`, `eval`, `optionalClick`, `storage`.
   Nhanh 1 ảnh: `node tools/capture.cjs --url http://localhost:8225/ --name home --mobile`. Ảnh ra `assets/` (1600x1000; mobile 390x844 đuôi `-m`).
4. **Xem thử**: mở `deck.html`; ảnh thiếu hiện khung nhắc.
5. **Xuất**: `node tools/export.cjs` (dùng `deck.data.js`) → `out/<tên>.pdf` (1 trang/slide), `out/png/slide-NN.png` (1920x1080, `--scale 2` cho 4K). Có `pptxgenjs` (`npm i pptxgenjs` trong `deck/`) thì ra thêm `.pptx` (mỗi slide là ảnh + ghi chú). Mang theo cả PDF dự phòng khi trình chiếu.

Yêu cầu: Node + Playwright (`npm i -g playwright && npx playwright install chromium`). `out/` đã được git-ignore. PDF ví dụ: `example/Xclipse-example.pdf`; ảnh của ví dụ nằm ở `example/assets/` (thư mục `deck/assets/` dành cho ảnh của đội bạn, ban đầu trống; `new-project.sh` không chép `example/`).

## Loại slide (`type`) và trường chính

| type | Trường |
|---|---|
| cover | app, tagline, de, bang, event, team, members[], date, image |
| problem | title, persona{name,role,photo}, pains[], scenarioLabel, scenario, stat{value,label} |
| solution | oneLiner, bullets[{icon,text}], image |
| features | title, items[{icon,title,desc}] (5) |
| demo | title, url, image, iframe:true, live:'auto', caption, qrLabel |
| flow | title, steps[{icon,title,desc}] (3–5), note |
| ai | real[], mock[], controls[], pipeline{steps[{label,sub,kind}], fallbackAt, fallback{label,sub}} |
| quality | rows[{id,kind,case,result,status:pass/warn/fail,label}], summary{value,label}, legend[] |
| metrics | items[{value,prefix,suffix,decimals,label,sub}] (đếm lên), note |
| roadmap | items[{when,title,desc,tag}] (≤4) |
| team | members[{name,role,did,photo}], stack[] |
| thanks | title, subtitle, cta, url, videoUrl, qrLabel |

Mọi slide: `eyebrow`, `title`, `notes` (bấm N), `time`. Chữ: `**đậm**`, `{{nhấn gradient}}`. Đổi màu theo đề: `meta.accent` / `meta.accent2`. Dữ liệu cũng có thể dán JSON vào thẻ `<script id="deck-data">` trong `deck.html`. Thứ tự nạp: JSON inline > `?data=` > `deck.data.js` > `example.data.js`.

Demo trực tiếp: `iframe:true` thêm nút "Chạy trực tiếp"; nếu app chặn iframe hoặc mất mạng, ảnh `image` vẫn hiện. Trung thực: không ghi "thật" cho tình huống dựng sẵn, nêu rõ AI mô phỏng.

## Kịch bản thuyết trình 5–7 phút (12 slide, ~6:50)

| Slide | Nội dung | Thời gian |
|---|---|---|
| 1 cover | Chào, tên đội, đề, bảng, hứa gì trong 6 phút | 0:15 |
| 2 problem | Persona + nỗi đau + 1 tình huống cụ thể | 0:40 |
| 3 solution | Giải pháp một câu, chỉ vào ảnh | 0:30 |
| 4 features | 5 tính năng, nhấn 1–2 quy tắc nghiệp vụ | 0:40 |
| 5 flow | 3–5 bước dùng | 0:30 |
| 6 demo | Demo live (ca thường, ca sai, ca biên); mất mạng thì video/ảnh | 1:30 |
| 7 ai | Thật vs mô phỏng, prompt→kiểm tra→dự phòng | 0:50 |
| 8 quality | Bảng ca kiểm thử, nói thẳng lỗi còn lại | 0:40 |
| 9 metrics | 3–4 con số kiểm chứng được | 0:25 |
| 10 roadmap | Bước tiếp theo | 0:20 |
| 11 team | Vai trò | 0:15 |
| 12 thanks | QR + link, mời "Hỏi đáp" | 0:15 |

Nếu chỉ có 5 phút: bỏ slide 5 và 11, rút demo còn 1:00. Tập nói 2 lần với đồng hồ (phím N).

## Cấu trúc

`deck.html` · `template.data.js` · `example.data.js` (Xclipse, Đề 8 Bảng B) · `assets/` (ảnh của bạn) · `tools/capture.cjs`, `tools/capture.example.json`, `tools/export.cjs` · `example/` (PDF + ảnh của bản ví dụ Xclipse).
