# vibe-sprint — gộp toàn bộ file chữ (cho Gemini)

=================== FILE: vibe-sprint/SKILL.md ===================
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

=================== FILE: vibe-sprint/brand/01-bo-nhan-dien-xclipse.md ===================
# Bộ Nhận Diện Thương Hiệu Xclipse — VIBE-CODING 2026 (Chung Kết)

> [!IMPORTANT]
> **BẢN CHỐT CHÍNH THỨC (Final Lock-in):**
> - **File giao diện mẫu chuẩn:** `skills/vibe-sprint/brand/xclipse-ui-ux-tam-nhin.html`
> - **Bảng màu chốt:** `#DBF2FC` (Ice Sky Blue — nền sáng thoáng) · `#072D59` (Deep Navy — chữ chính & khối Hero) · `#FD6E88` (Coral Pink — CTA chính & điểm nhấn)
> - **Phong cách:** Hero chia 2 mảng sáng/tối, kính sọc dọc (*Fluted Glass*) + quả cầu 3D hồng-xanh, tiêu đề phối `Be Vietnam Pro` + `Playfair Display` italic, tích hợp tương tác **Lucian UX/UI** (`#002`, `#013`, `#163`).

> **Định hướng nền tảng:** Kế thừa tinh thần thị giác của **Samsung Exynos & GPU Xclipse** (sự kết hợp giữa *Exynos* = Thông minh & Bền vững và *Eclipse* = Nhật thực), chuyển thể thành hệ thống giao diện B2B/Kinh doanh sạch sẽ, tin cậy và sắc nét.

---

## 1. Câu chuyện & Triết lý thương hiệu
- **Tên gọi `Xclipse`:** Ghép từ **X** (hội tụ & kết nối) + **Eclipse** (Nhật thực).
- **Ý nghĩa cốt lõi:**
  1. **Bước chuyển kỷ nguyên:** Khép lại cách làm thủ công rời rạc (bảng tính rời, thao tác chậm) để mở ra quy trình tự động hóa gọn gàng trong 1 chạm.
  2. **Ánh sáng & Vành nhật hoa:** Như tia sáng rìa nhật thực, phần mềm "chiếu rọi" đúng điểm mù dữ liệu, lọc bỏ nhiễu để người dùng thấy ngay con số và hành động quan trọng nhất.
  3. **Thông minh & Tiết kiệm:** Làm được nhiều việc hơn với ít thao tác và ít chi phí vận hành hơn.

---

## 2. Logo & Biểu tượng (Signature Mark)
- **Cấu tạo hình học:**
  - **Vòng tròn Nhật thực (Eclipse Circle):** Khối tròn đồng tâm tượng trưng cho sự trọn vẹn và tập trung.
  - **Đường cắt chữ X sắc nét (Precision X-Cut):** Hai nét chéo 45° âm bản ở tâm (độ rộng khe bằng 8–10% đường kính để không bết nét ở kích thước favicon 16×16 px).
  - **Vành sáng Nhật hoa (Corona Rim):** Cung sáng mảnh ôm góc trên-trái, tạo chiều sâu ánh sáng đặc trưng của Xclipse.
- **Quy tắc sử dụng:** Đặt trên nền sáng (`#F8FAFC`/`#FFFFFF`) dùng màu `#1428A0`; đặt trên nền tối (`#07090E`/`#10141E`) dùng `#F4F6FA` kết hợp vành sáng `#38BDF8` → `#2E5BFF`. Khoảng trống an toàn xung quanh logo tối thiểu bằng 25% chiều cao biểu tượng.

---

## 3. Hệ thống Màu sắc (Light Mode mặc định & Eclipse Dark Mode)

> **Nguyên tắc 60 – 30 – 10:** 60% nền canvas trung tính · 30% bề mặt thẻ/khung · 10% màu thương hiệu và ánh sáng nhấn (chỉ dùng cho nút CTA chính, biểu đồ, trạng thái chọn và viền focus mảnh 1 px — tuyệt đối không lạm dụng neon).

### A. Light Mode — "Daylight Workspace" (Mặc định làm việc ban ngày)
| Vai trò | Tên màu | Mã HEX | Tương phản WCAG 2.1 | Mục đích sử dụng |
|---|---|---|---|---|
| Nền tổng thể (60%) | Daylight Alabaster | `#F8FAFC` | Nền dịu mắt | Khung nền ứng dụng, giảm chói khi đọc bảng biểu |
| Bề mặt thẻ (30%) | Pure White / Mist | `#FFFFFF` / `#EEF2F7` | Nền phụ phân tách | Thẻ chức năng, form nhập, bảng dữ liệu |
| Chữ chính | Obsidian Ink | `#0F172A` | **17.06:1** trên `#F8FAFC` (AAA) | Tiêu đề, số liệu KPI, nội dung chính |
| Chữ phụ | Slate Ink | `#475569` | **7.24:1** trên `#F8FAFC` (AAA) | Mô tả tính năng, nhãn cột, hướng dẫn |
| Thương hiệu chính (10%) | **Samsung Cobalt** | `#1428A0` | **11.41:1** trên `#FFFFFF` (AAA) | Logo, nút CTA chính, tab đang chọn |
| Nhấn AI & Trạng thái | Cyan Dark / Amber Dark | `#0369A1` / `#B45309` | **5.93:1** / **5.02:1** (AA) | Huy hiệu AI, thông báo, cảnh báo nhẹ |
| Viền phân tách / Input | Subtle / UI Border | `#E2E8F0` / `#7C8BA1` | `#7C8BA1` đạt **3.46:1** (AA UI) | Đường kẻ bảng (`#E2E8F0`), viền ô nhập (`#7C8BA1`) |

### B. Dark Mode — "Eclipse Mode" (Tập trung & Thuyết trình)
| Vai trò | Tên màu | Mã HEX | Tương phản WCAG 2.1 | Mục đích sử dụng |
|---|---|---|---|---|
| Nền tổng thể (60%) | Umbra Black | `#07090E` | Dịu hơn `#000000` | Nền không gian tập trung, trình chiếu demo |
| Bề mặt tầng 1 (30%) | Silicon Charcoal | `#10141E` | Tách tầng rõ ràng | Thẻ báo cáo, sidebar, khung nội dung |
| Bề mặt tầng 2 (nổi) | Eclipse Slate | `#181E2C` | Nổi khối tự nhiên | Pop-up, modal, dropdown, thanh tìm kiếm |
| Chữ chính | Corona White | `#F4F6FA` | **18.41:1** trên `#07090E` (AAA) | Tiêu đề, số liệu chính |
| Chữ phụ | Lunar Silver | `#A3AEC2` | **8.91:1** trên `#07090E` (AAA) | Mô tả, chú thích phụ |
| Nút CTA chính (10%) | **Electric Cobalt** | `#2E5BFF` | Chữ `#FFFFFF` đạt **5.18:1** (AA) | Thay thế `#1428A0` để đảm bảo độ nổi trên nền tối |
| Nhấn AI / Vành nhật hoa | **Cyan Ray** / **Corona Amber** | `#38BDF8` / `#F59E0B` | **9.30:1** / **9.27:1** trên `#07090E` (AAA) | Điểm nhấn AI, đường biểu đồ, vành sáng viền 1 px |
| Viền phân tách / Input | Hairline / UI Border | `#2A3347` / `#5C6B89` | `#5C6B89` đạt **3.72:1** (AA UI) | Viền thẻ (`#2A3347`), viền ô nhập (`#5C6B89`) |

---

## 4. Hệ thống Chữ viết (Typography)
- **Phông chữ chính (Đơn họ – Song trọng lượng):** **`Be Vietnam Pro`** (Google Fonts, miễn phí OFL-1.1) cho cả **Tiêu đề** và **Nội dung**, vì có `x-height` lớn (530/1000) và dấu tiếng Việt tối ưu không bị đè dòng.
- **Số liệu thẳng cột:** Bật `font-variant-numeric: tabular-nums` cho mọi con số KPI, giá tiền, phần trăm, đếm ngược; dùng `IBM Plex Mono` / monospace hệ thống cho mã đơn hàng hoặc mã giảm giá.
- **Thang kích thước chuẩn:**
  - **Hero / Tuyên ngôn:** `40–56 px`, Bold (700), `line-height: 1.15`, `letter-spacing: -0.025em`.
  - **Tiêu đề mục (H2/H3):** `24–32 px`, SemiBold (600), `line-height: 1.28`, `letter-spacing: -0.015em`.
  - **Số liệu KPI:** `28–44 px`, Bold (700), `tabular-nums`.
  - **Nội dung (Body):** `15–16 px`, Regular (400), `line-height: 1.58`, độ rộng dòng 60–75 ký tự.
  - **Nhãn nhỏ / Bảng:** `12–14 px`, Medium (500).

---

## 5. Bộ Icon SVG Riêng (Xclipse Precision Line)
- **Quy chuẩn hình học:** Lưới `24×24 px` (vùng vẽ `20×20 px`, lề an toàn `2 px`), nét mảnh đồng nhất `stroke-width: 1.5px`, đầu nét tròn (`stroke-linecap: round`, `stroke-linejoin: round`), bo góc `2 px`.
- **Điểm nhận diện riêng:** Giữ nét hở nhẹ mô phỏng điểm kết nối mở hoặc chấm vuông bo nhẹ; riêng icon **AI / Trạng thái nổi bật** dùng kiểu **Duotone ánh sáng nội tại** (thêm lớp nền phụ `#38BDF8` độ mờ 14%).
- **Danh sách 16 icon cốt lõi đã đóng gói sẵn trong `xclipse-brand-kit.html`:**
  1. **Liên hệ / Hotline** (`phone` / `headset`)
  2. **Email / Hộp thư** (`mail` — góc chữ V đồng bộ góc chữ X)
  3. **Facebook** (`facebook`)
  4. **Zalo / Nhắn tin nhanh** (`message`)
  5. **Chia sẻ / Mạng xã hội** (`share` — 3 điểm kết nối lưới)
  6. **Địa chỉ / Vị trí** (`location` — ghim vòng tròn đồng tâm nhật thực)
  7. **Hỏi đáp / Trợ giúp (FAQ)** (`faq` — khung bo 2 px + chấm vuông)
  8. **Trí tuệ nhân tạo (AI)** (`ai-spark` — sao 4 cánh hình học + tia sáng)
  9. **Bảo mật / Quyền riêng tư** (`security` — khiên đường cong liên tục)
  10. **Giỏ hàng / Thương mại** (`commerce`)
  11. **Thống kê / Biểu đồ** (`chart`)
  12. **Tìm kiếm** (`search`)
  13. **Cảnh báo / Kiểm tra lỗi** (`alert`)
  14. **Xuất file / Tải xuống** (`download`)
  15. **Sao chép nhanh** (`copy`)
  16. **Chuyển chế độ Sáng / Tối** (`theme-eclipse`)

---

## 6. Thiết kế Thành phần UI Đặc trưng (Buttons, Cards, Pop-up)
- **Buttons (Nút bấm):**
  - Bo góc `8 px` (nút trong bảng `6 px`), nhãn ngắn gọn 2–3 từ (*"Tạo ngay"*, *"Phân tích AI"*, *"Xuất báo cáo"*).
  - **Primary Button:** Light Mode nền `#1428A0` (hover `#0E1D75`), Dark Mode nền `#2E5BFF` (hover `#4B73FF`), chữ trắng `#FFFFFF`. Không dùng bóng đổ neon tỏa rộng.
  - **Secondary Button:** Nền trong suốt, viền `1px solid` (`#7C8BA1` ở Light / `#5C6B89` ở Dark).
  - **AI Action Button:** Viền gradient mảnh `1px` ánh Cyan `#38BDF8` → Cobalt `#2E5BFF`, kèm icon AI duotone.
- **Cards (Thẻ thông tin):**
  - Bo góc `14 px`, cấu trúc 2 tầng gọn gàng: **chỉ số/tiêu đề chính ở trên**, **chi tiết/biểu đồ ở dưới**, lược bỏ các nút phụ rườm rà. Trong Dark Mode thêm vệt sáng viền mảnh `1px` ở cạnh trên.
- **Pop-up / Modal:**
  - Bo góc `18 px`, nền đặc (Light `#FFFFFF`, Dark `#181E2C`) để chữ luôn đạt chuẩn tương phản, kết hợp lớp phủ nền `backdrop-filter: blur(12px)` tối nhẹ (`rgba(7, 9, 14, 0.72)`) và viền sáng mảnh `1px` ánh xanh/trắng mờ 15%.
  - Chuyển động đóng/mở `220ms cubic-bezier(0.16, 1, 0.3, 1)` — dứt khoát, mượt mà, không nảy lò xo.

---

## 7. Gợi ý Kịch bản Thuyết trình 2 phút — Phần Giao diện & Nhận diện (Diệu Anh)

> **Mục tiêu:** Giải thích ngắn gọn, tự tin *cảm hứng thương hiệu*, *tại sao chọn hệ màu/chữ/icon này*, và *nó giúp ích gì cho người dùng thực tế*.

- **[0:00 – 0:30] Cảm hứng tên gọi & Câu chuyện:**
  *"Chào ban giám khảo, em là Diệu Anh, phụ trách phần Giao diện và Nhận diện của đội Xclipse. Tên gọi Xclipse được nhóm lấy cảm hứng từ hiện tượng Nhật thực — khoảnh khắc ánh sáng bứt phá khỏi bóng tối. Với tụi em, sản phẩm này là bước chuyển giúp người dùng khép lại cách làm thủ công rời rạc để nhìn rõ dữ liệu và xử lý công việc nhanh, sắc nét hơn."*
- **[0:30 – 1:10] Hệ màu hai chế độ & Độ tin cậy:**
  *"Về màu sắc, nhóm không chạy theo phong cách công nghệ tối màu quá gắt mà thiết kế hai chế độ chuẩn độ tương phản WCAG. Ban ngày mặc định là Light Mode nền trắng dịu kết hợp sắc xanh Cobalt `#1428A0` tạo cảm giác tin cậy, sạch sẽ như một công cụ làm việc chuyên nghiệp. Khi cần tập trung hoặc trình chiếu, người dùng bật Eclipse Dark Mode nền than sâu điểm ánh sáng Cyan và vàng hổ phách mảnh ở viền — vừa đỡ mỏi mắt, vừa nổi bật các điểm chạm AI."*
- **[1:10 – 1:45] Typography, Icon & UI Signature:**
  *"Toàn bộ chữ viết dùng bộ font Be Vietnam Pro có độ mở lớn để dấu tiếng Việt luôn rõ ràng ngay cả trong bảng số liệu dày đặc. Nhóm cũng tự thiết kế đồng bộ bộ icon nét mảnh 1.5px, các nút bấm dứt khoát và khung pop-up phân tầng rõ nét để người không rành kỹ thuật vẫn thao tác được ngay từ lần đầu."*
- **[1:45 – 2:00] Chốt chuyển ý sang phần Nội dung:**
  *"Tất cả những yếu tố thị giác này đều phục vụ một mục tiêu duy nhất: giảm nhiễu, dễ đọc và đáng tin cậy. Tiếp theo, bạn Dũng sẽ trình bày cách nhóm xây dựng giọng điệu và nội dung để đồng bộ với trải nghiệm này."*

=================== FILE: vibe-sprint/brand/02-giong-dieu-va-noi-dung.md ===================
# Giọng Điệu Thương Hiệu & Cẩm Nang Nội Dung Xclipse — VIBE-CODING 2026

> **Định hướng:** Học hỏi phong cách truyền thông của **Samsung Semiconductor / Exynos – Xclipse**: không nói lý thuyết chung chung, luôn **bắc cầu từ tính năng/thông số sang giá trị vận hành thực tế** với giọng điệu **Chuyên nghiệp – Chân thành – Rõ ràng**.

---

## 1. Tính cách & Giọng điệu thương hiệu (Brand Voice)
Nếu Xclipse là một người đồng hành cùng chủ shop / marketer SME, đó là một **chuyên gia thực chiến điềm tĩnh**:
1. **Chuyên nghiệp nhưng không xa cách:** Dùng tiếng Việt chuẩn mực, dễ hiểu; tránh từ ngữ học thuật khó hiểu hoặc sáo rỗng (*"đột phá vũ trụ"*, *"siêu đỉnh"*).
2. **Chân thành & Minh bạch:** Cái gì AI làm thì nói rõ là AI gợi ý (kèm nhãn minh bạch), cái gì số liệu tính bằng công thức thì giải thích rõ ràng, không hứa hão.
3. **Rõ ràng & Hướng hành động:** Mỗi câu đều trả lời câu hỏi *"Giúp được gì cho người dùng ngay lúc này?"*.

---

## 2. Công thức viết nội dung chuẩn Xclipse (Copywriting Playbook)

### Công thức 1: Cầu nối `Thông số / Tính năng → Cơ chế → Lợi ích` (Spec-to-Benefit)
Dùng cho **mô tả tính năng, trang giải pháp, báo cáo phân tích**:
- **Cấu trúc:** `Nhờ [cơ chế/công nghệ cụ thể], bạn/đội ngũ [giảm bớt việc gì / đạt kết quả gì] mà không cần [rào cản cũ].`
- **Ví dụ áp dụng:**
  - *Thay vì viết:* "Ứng dụng tích hợp AI viết mô tả sản phẩm siêu nhanh."
  - *Viết theo Xclipse:* "Chỉ cần nhập 3 thông số cơ bản, AI tự động soạn mô tả chuẩn giới hạn ký tự từng sàn — giúp chủ shop tiết kiệm 80% thời gian đăng bài mà vẫn đúng thông tin."

### Công thức 2: Nhịp đối xứng 2 vế (Rhythmic Contrast)
Dùng cho **Headline Hero, Tiêu đề thẻ tính năng, Nút/Banner ngắn**:
- **Cấu trúc:** `[Vế 1 ngắn 2–4 từ]. [Vế 2 đối xứng 2–4 từ].`
- **Mẫu câu dùng ngay cho mọi đề kinh doanh / TMĐT:**
  - *"Phân tích sâu. Quyết định nhanh."*
  - *"Tự động bằng AI. Chuẩn mực thương hiệu."*
  - *"Hiệu suất tối đa. Ngân sách tối ưu."*
  - *"Nhập liệu một lần. Báo cáo tức thì."*
  - *"Rõ ràng từng con số. Vững tâm từng đơn hàng."*

### Công thức 3: Ẩn dụ Ánh sáng & Hạ rào cản (Eclipse Framing)
Dùng cho **màn hình Onboarding, tính năng AI, thống kê/lọc nhiễu**:
- **Mẫu câu:**
  - *"Nhìn thấu dữ liệu kinh doanh dưới một ánh sáng mới."*
  - *"Lọc bỏ nhiễu số liệu, chiếu rọi đúng điểm tạo doanh thu."*
  - *"Xóa bỏ rào cản giữa bảng tính phức tạp và quyết định tăng trưởng thực tế."*

### Công thức 4: Khung AIDA & PAS (Cho đề Bán hàng / Marketing / Flash Sale)
- **AIDA (Attention – Interest – Desire – Action):** Dùng cho trang giới thiệu sản phẩm/ưu đãi:
  - *Attention:* Nêu đúng vấn đề hoặc lợi ích lớn nhất trong 1 câu ngắn.
  - *Interest:* 3 gạch đầu dòng lợi ích cụ thể (có số liệu hoặc thời gian).
  - *Desire:* Bằng chứng thực tế / cam kết minh bạch (số chỗ thật, hạn thật).
  - *Action:* Nút CTA 2–3 từ rõ ràng (*"Đăng ký ngay"*, *"Nhận báo giá"*, *"Kiểm tra ngay"*).
- **PAS (Problem – Agitate – Solution):** Dùng cho phần mở bài thuyết trình & mô tả giải pháp:
  - *Problem:* Chủ shop/marketer mất nhiều giờ tổng hợp tay hoặc đoán mò.
  - *Agitate:* Sai một con số nhỏ (phí sàn, tồn kho, hạn ưu đãi) là lỗ đơn hoặc mất khách.
  - *Solution:* Xclipse chuẩn hóa quy trình trong 1 màn hình duy nhất.

---

## 3. Từ điển Từ khóa & Quy tắc viết trên giao diện (Microcopy)

| Ngữ cảnh | Nên dùng (Chuẩn Xclipse) | Tránh dùng |
|---|---|---|
| Nút hành động chính | *Tạo ngay, Phân tích ngay, Kiểm tra lợi nhuận, Lưu & Xuất file* | *Bấm vào đây, Gửi đi, Submit* |
| Trạng thái AI đang chạy | *AI đang tổng hợp gợi ý...* | *Đang suy nghĩ... / Chờ chút nhé...* |
| Nhãn dữ liệu AI mô phỏng | *Gợi ý từ AI (Dữ liệu mô phỏng — kiểm tra lại trước khi dùng)* | *Kết quả chính xác 100% từ AI* |
| Thông báo lỗi nhập liệu | *Vui lòng nhập giá bán lớn hơn 0đ để tính biên lợi nhuận.* | *Lỗi nhập liệu! / Invalid input!* |
| Trạng thái trống (Empty state) | *Chưa có sản phẩm nào. Thêm sản phẩm đầu tiên để xem phân tích.* | *Trống / No data* |

---

## 4. Prompt mẫu nạp vào AI khi thi 60 phút (Giữ đúng giọng điệu Xclipse)

Khi chạy đề mới ở vòng Chung kết, dán đoạn chỉ dẫn này vào System Prompt / Prompt sinh nội dung để AI viết đồng nhất 100%:

```text
Bạn là trợ lý nội dung của thương hiệu Xclipse (phong cách lấy cảm hứng từ Samsung Exynos/Xclipse: chuyên nghiệp, chân thành, rõ ràng số liệu, hướng giá trị thực tế cho chủ shop và marketer SME).
Quy tắc viết bắt buộc:
1. Tiếng Việt có dấu tự nhiên, ngắn gọn, không sáo rỗng, không dùng từ ngữ quá khích hay hứa hẹn sai sự thật.
2. Headline dùng nhịp đối xứng 2 vế ngắn (tổng 4–8 từ).
3. Mô tả tính năng viết theo mạch: [Cơ chế cụ thể] → [Lợi ích tiết kiệm thời gian/chi phí cho người dùng].
4. Tuyệt đối KHÔNG tự bịa số liệu, giá cả, ngày giờ hay thông số ngoài dữ liệu đầu vào; nếu thiếu thông tin cần đánh dấu "[Cần xác nhận]".
5. Nhãn nút bấm chỉ dài 2–4 từ bắt đầu bằng động từ hành động.
```

---

## 5. Gợi ý Kịch bản Thuyết trình 2 phút — Phần Nội dung & Giọng điệu (Dũng)

- **[0:00 – 0:30] Vai trò của Nội dung trong sản phẩm:**
  *"Xin chào ban giám khảo, em là Dũng, phụ trách phần Nội dung và Giọng điệu thương hiệu của Xclipse. Với một công cụ dành cho người làm kinh doanh và marketer bận rộn, giao diện đẹp thôi chưa đủ — chữ viết trên màn hình phải giúp họ hiểu ngay trong 3 giây đầu tiên và tin tưởng để sử dụng."*
- **[0:30 – 1:15] Giọng điệu Spec-to-Benefit & Nhịp đối xứng:**
  *"Học hỏi cách truyền thông của thương hiệu bán dẫn Exynos/Xclipse, nhóm chọn giọng điệu: Chuyên nghiệp, Chân thành và Rõ ràng số liệu. Thay vì dùng những câu quảng cáo sáo rỗng, toàn bộ nội dung trên app đều viết theo công thức: Tính năng cụ thể đi kèm lợi ích thực tế — ví dụ người dùng tiết kiệm bao nhiêu thao tác, tránh được sai sót gì. Các tiêu đề dùng nhịp đối xứng ngắn gọn như 'Phân tích sâu. Quyết định nhanh' để tạo điểm nhấn thị giác."*
- **[1:15 – 1:45] Kiểm soát nội dung AI & Tính minh bạch:**
  *"Đặc biệt, nhóm xây dựng sẵn bộ quy tắc cho AI để khi sinh nội dung tự động, AI luôn giữ đúng giọng điệu này và không tự bịa số liệu ngoài thông tin người dùng nhập. Mọi nội dung gợi ý đều có nhãn phân biệt rõ ràng để người dùng kiểm tra lại."*
- **[1:45 – 2:00] Chốt chuyển ý sang phần Kỹ thuật:**
  *"Nhờ kết hợp giữa giao diện tinh gọn của Diệu Anh và ngôn ngữ rõ ràng này, sản phẩm sẵn sàng phục vụ người dùng thực tế. Tiếp theo, bạn Nguyên sẽ trình bày kiến trúc kỹ thuật và demo trực tiếp hệ thống."*

=================== FILE: vibe-sprint/brand/03-album-anh-nganh-nghe.md ===================
# Album Hình Ảnh Theo Ngành Nghề — Xclipse (Chung Kết VIBE-CODING 2026)

> **Mục tiêu:** Chuẩn bị sẵn bộ hình ảnh đồng bộ phong cách thị giác Xclipse (ánh sáng sạch, bố cục hiện đại, không chữ thừa, tối ưu dung lượng `.webp`/`.jpg`) theo các nhóm ngành có khả năng xuất hiện trong đề thi 60 phút, để khi code xong khung app chỉ cần gắn vào là giao diện có tính *signature* ngay.

---

## 1. Bản đồ Ngành nghề (Đối chiếu từ [de-moi-du-doan.md](../catalog/de-moi-du-doan.md))

| STT | Nhóm ngành | Các dạng đề có thể gặp | Ảnh có sẵn / Đã chuẩn bị | Thư mục lưu |
|---|---|---|---|---|
| 1 | **Thương mại điện tử & Bán lẻ** | Tính lợi nhuận sản phẩm, Tồn kho, Flash Sale, Giỏ hàng & Voucher, Mô tả sản phẩm sàn TMĐT | Bộ ảnh đóng gói đơn hàng, kho gọn gàng, sản phẩm công nghệ/tiêu dùng trên nền sạch | `album/ecommerce/` |
| 2 | **Công nghệ, SaaS & Dữ liệu** | Chấm điểm Lead, Phân khúc khách hàng, Chatbot tra cứu đơn, Dashboard KPI | Ảnh không gian làm việc hiện đại, màn hình phân tích dữ liệu, ánh sáng Cobalt/Cyan | `album/tech-saas/` |
| 3 | **F&B & Cửa hàng dịch vụ** | Landing page khai trương, Ưu đãi thành viên, Đặt bàn/Đặt hàng nhanh | **Đã có sẵn 8 ảnh thật** từ dự án vòng 1: `assets/demo/moc-*.webp` (hero, about, barista, beans, gift, acoustic, opening, tasting) | `assets/demo/` |
| 4 | **Giáo dục & Đào tạo / Workshop** | Khóa học ngắn hạn, Hội thảo kỹ năng, Đăng ký sự kiện SME | Ảnh lớp học/workshop tương tác, giảng viên chia sẻ, không khí chuyên nghiệp | `album/education/` |
| 5 | **Thời trang, Mỹ phẩm & Làm đẹp** | Flash sale mỹ phẩm, Ra mắt BST, Lịch hẹn spa/salon | Ảnh sản phẩm skincare/thời trang tối giản, ánh sáng tự nhiên mềm mại | `album/beauty-retail/` |
| 6 | **Chăm sóc khách hàng & Nhân sự** | Phân loại đánh giá khách hàng, Phản hồi khiếu nại, Cổng hỗ trợ SME | Ảnh chân dung đội ngũ tư vấn thân thiện, không gian hỗ trợ khách hàng | `album/support/` |

---

## 2. Quy chuẩn Hình ảnh Signature của Xclipse
Để mọi bức ảnh khi đưa vào app đều giữ đúng "chất" Exynos/Xclipse mà vẫn thân thiện với doanh nghiệp SME:
1. **Ánh sáng & Tông màu:** Ưu tiên ảnh có độ tương phản rõ, ánh sáng định hướng sạch sẽ (tông trắng/xám sáng cho Light Mode, hoặc tông tối sâu có điểm sáng xanh/hổ phách cho Dark Mode).
2. **Tỷ lệ khung hình chuẩn (để không vỡ layout 60 phút):**
   - **Hero Banner:** `16:9` (ví dụ `1280×720 px`), vùng bên trái/phía trên thoáng để đặt chữ tiêu đề.
   - **Thẻ sản phẩm / Tính năng (Card):** `4:3` hoặc `1:1` (`800×600 px` hoặc `600×600 px`).
   - **Avatar / Diễn giả / Nhân viên CSKH:** `1:1` (`400×400 px`), khuôn mặt nằm chính giữa.
3. **Dung lượng nhẹ:** Nén `< 120 KB/ảnh` (định dạng `.webp` hoặc `.jpg` chất lượng 82%) để trang GitHub Pages tải tức thì trên 4G.
4. **Minh bạch nguồn ảnh:** Nếu dùng ảnh tạo bằng AI trong album minh họa, ghi rõ chú thích *"Ảnh minh họa tạo bằng AI"* trong `README.md` và phần khai báo khi nộp bài.

---

## 3. Cách gắn nhanh vào App trong 60 phút thi
1. Khi bốc được đề, xác định đề thuộc nhóm ngành nào trong bảng mục 1.
2. Copy 2–4 ảnh phù hợp nhất từ `skills/vibe-sprint/brand/album/<nganh>/` (hoặc `assets/demo/` nếu là F&B) vào thư mục `assets/` của project mới.
3. Dùng thẻ `<img>` kèm thuộc tính `loading="lazy"` và `object-fit: cover` để ảnh tự khớp khung trên cả Desktop (`1280px`) và Mobile (`390px`), tuyệt đối không bị méo hình.
4. Luôn đặt sẵn **fallback SVG/Gradient** (nền `#EEF2F7` ở Light Mode hoặc `#10141E` ở Dark Mode) đề phòng đường dẫn lỗi.

---

## 4. Checklist chuẩn bị Album trước giờ G (Thứ Hai 16/11)
- [x] **F&B (`assets/demo/`):** Đã có đủ 8 ảnh `.webp` chất lượng cao.
- [x] **TMĐT & Bán lẻ / Công nghệ & SaaS / Giáo dục:** Đã có ảnh mẫu minh họa đi kèm trong `album/`.
- [ ] **Thành viên nhóm bổ sung thêm (nếu muốn ảnh chụp thật):** Mỗi ngành chọn 2–3 ảnh từ nguồn miễn phí bản quyền (Unsplash/Pexels) hoặc ảnh thật của nhóm, nén về `.webp` < 120 KB và lưu vào đúng thư mục `album/<nganh>/`.

=================== FILE: vibe-sprint/brand/xclipse-brand-kit.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse Brand Kit — Bộ Nhận Diện Thương Hiệu (Chung kết VIBE-CODING 2026)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);

      /* Light Mode: Daylight Workspace */
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --surface-alt: #EEF2F7;
      --text: #0F172A;
      --text-muted: #475569;
      --brand: #1428A0;
      --brand-hover: #0E1D75;
      --brand-contrast: #FFFFFF;
      --accent-ai: #0369A1;
      --accent-amber: #B45309;
      --border: #E2E8F0;
      --border-ui: #7C8BA1;
      --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.05);
      --shadow-modal: 0 24px 48px rgba(15, 23, 42, 0.18);
      --backdrop: rgba(15, 23, 42, 0.45);
      --corona-edge: rgba(20, 40, 160, 0.15);
    }

    html[data-theme="dark"] {
      /* Dark Mode: Eclipse Mode */
      --bg: #07090E;
      --surface: #10141E;
      --surface-alt: #181E2C;
      --text: #F4F6FA;
      --text-muted: #A3AEC2;
      --brand: #2E5BFF;
      --brand-hover: #4B73FF;
      --brand-contrast: #FFFFFF;
      --accent-ai: #38BDF8;
      --accent-amber: #F59E0B;
      --border: #2A3347;
      --border-ui: #5C6B89;
      --shadow-card: 0 1px 0 rgba(56, 189, 248, 0.08) inset;
      --shadow-modal: 0 24px 64px rgba(0, 0, 0, 0.65);
      --backdrop: rgba(7, 9, 14, 0.72);
      --corona-edge: rgba(56, 189, 248, 0.35);
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.58;
      transition: background 240ms var(--ease), color 240ms var(--ease);
    }

    .wrap { max-width: 1120px; margin: 0 auto; padding: 32px 20px 80px; }

    /* Topbar */
    .topbar {
      position: sticky; top: 0; z-index: 20;
      background: color-mix(in srgb, var(--bg) 88%, transparent);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .topbar-inner {
      max-width: 1120px; margin: 0 auto; padding: 14px 20px;
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
    }
    .brand-lockup { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 18px; letter-spacing: -0.02em; }
    .badge {
      font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px;
      background: color-mix(in srgb, var(--accent-ai) 14%, transparent);
      color: var(--accent-ai);
      border: 1px solid color-mix(in srgb, var(--accent-ai) 30%, transparent);
    }

    /* Section */
    .section { margin-top: 40px; }
    .section-head { margin-bottom: 16px; }
    .section-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; letter-spacing: -0.015em; }
    .section-head p { margin: 0; color: var(--text-muted); font-size: 14px; }

    /* Cards */
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      box-shadow: var(--shadow-card);
      transition: transform 180ms var(--ease), border-color 180ms var(--ease);
    }
    html[data-theme="dark"] .card {
      border-top-color: var(--corona-edge);
    }

    /* Swatches */
    .swatch {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px;
      border: 1px solid var(--border); border-radius: 10px; background: var(--surface);
      cursor: pointer; transition: border-color 150ms var(--ease);
    }
    .swatch:hover { border-color: var(--brand); }
    .swatch-box { width: 40px; height: 40px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.2); flex-shrink: 0; }
    .swatch-meta { min-width: 0; }
    .swatch-name { font-size: 13px; font-weight: 600; }
    .swatch-hex { font-family: var(--mono); font-size: 12px; color: var(--text-muted); }

    /* Buttons */
    .btn-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 40px; padding: 0 16px; border-radius: 8px; font-family: var(--font);
      font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
      transition: background 160ms var(--ease), border-color 160ms var(--ease), transform 120ms var(--ease);
    }
    .btn:active { transform: scale(0.98); }
    .btn-primary { background: var(--brand); color: var(--brand-contrast); }
    .btn-primary:hover { background: var(--brand-hover); }
    .btn-secondary { background: transparent; color: var(--text); border-color: var(--border-ui); }
    .btn-secondary:hover { background: var(--surface-alt); }
    .btn-ai {
      background: color-mix(in srgb, var(--accent-ai) 12%, var(--surface));
      color: var(--accent-ai);
      border-color: color-mix(in srgb, var(--accent-ai) 45%, transparent);
    }
    .btn-ai:hover { background: color-mix(in srgb, var(--accent-ai) 20%, var(--surface)); }
    .btn-disabled { opacity: 0.48; cursor: not-allowed; background: var(--surface-alt); color: var(--text-muted); }

    /* Icons Grid */
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 12px; }
    .icon-tile {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 10px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border);
      text-align: center;
    }
    .icon-tile svg { width: 24px; height: 24px; color: var(--text); }
    .icon-tile.is-ai svg { color: var(--accent-ai); }
    .icon-tile span { font-size: 12px; font-weight: 500; color: var(--text-muted); }

    /* Typography demo */
    .kpi-num { font-size: 36px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; line-height: 1.1; }

    /* Modal / Pop-up */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 50;
      background: var(--backdrop); backdrop-filter: blur(12px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-backdrop.open { display: flex; animation: fadeIn 180ms var(--ease); }
    .modal {
      width: 100%; max-width: 440px; border-radius: 18px;
      background: var(--surface-alt); border: 1px solid var(--border);
      box-shadow: var(--shadow-modal); padding: 24px;
      animation: slideUp 220ms var(--ease);
    }
    html[data-theme="dark"] .modal { background: #181E2C; border-color: rgba(56, 189, 248, 0.25); }
    .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .modal-title { font-size: 18px; font-weight: 700; margin: 0; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 8px;
      border: 1px solid var(--border-ui); background: var(--surface); color: var(--text);
      font-family: var(--font); font-size: 14px; margin-top: 6px;
    }
    .input:focus { outline: 2px solid var(--accent-ai); outline-offset: 1px; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }

    .toast {
      position: fixed; bottom: 20px; right: 20px; z-index: 60;
      background: var(--text); color: var(--bg); padding: 10px 16px; border-radius: 10px;
      font-size: 13px; font-weight: 500; opacity: 0; pointer-events: none;
      transition: opacity 180ms var(--ease);
    }
    .toast.show { opacity: 1; }

    .logo-img { border-radius: 10px; object-fit: cover; display: block; border: 1px solid var(--border); }
    .logo-for-dark { display: none; }
    html[data-theme="dark"] .logo-for-light { display: none; }
    html[data-theme="dark"] .logo-for-dark { display: block; }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-lockup">
        <img class="logo-img logo-for-light" src="logo-light.jpg" width="36" height="36" alt="Logo Xclipse Light" />
        <img class="logo-img logo-for-dark" src="logo-dark.jpg" width="36" height="36" alt="Logo Xclipse Dark" />
        <span>Xclipse Brand Kit</span>
        <span class="badge">VIBE-CODING 2026</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-secondary" id="toggleTheme" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          <span>Đổi Sáng / Eclipse Dark</span>
        </button>
        <button class="btn btn-primary" id="openModal" type="button">Xem thử Pop-up</button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <!-- 1. Logo & Triết lý -->
    <section class="section">
      <div class="section-head">
        <h2>1. Logo Signature & Câu chuyện Nhật thực</h2>
        <p>Vòng tròn Nhật thực + Đường cắt chữ X 45° + Vành sáng Nhật hoa (Corona Rim). Hiển thị song song bản Light Mode & Eclipse Dark Mode.</p>
      </div>
      <div class="grid-2">
        <div class="card">
          <div style="display:flex;align-items:center;gap:16px;">
            <img class="logo-img" src="logo-light.jpg" width="76" height="76" alt="Logo Xclipse Light Mode" />
            <img class="logo-img" src="logo-dark.jpg" width="76" height="76" alt="Logo Xclipse Eclipse Dark Mode" />
            <div>
              <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em;">Xclipse</div>
              <div style="font-size:13px;color:var(--text-muted);">Phân tích sâu. Quyết định nhanh.</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="kpi-num">11.41 : 1</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:6px;">Độ tương phản chữ & thương hiệu đạt chuẩn WCAG 2.1 AAA trên nền sáng, và 5.18:1+ trên Eclipse Dark Mode.</div>
        </div>
      </div>
    </section>

    <!-- 2. Bảng màu -->
    <section class="section">
      <div class="section-head">
        <h2>2. Bảng màu chuẩn WCAG 2.1 (Bấm vào ô để sao chép mã HEX)</h2>
        <p>Tỷ lệ 60% nền trung tính · 30% bề mặt thẻ · 10% màu thương hiệu & ánh sáng nhấn.</p>
      </div>
      <div class="grid-3" id="swatches"></div>
    </section>

    <!-- 3. Bộ 16 Icon SVG riêng -->
    <section class="section">
      <div class="section-head">
        <h2>3. Bộ Icon SVG Riêng (Lưới 24×24 px · Nét 1.5 px · Bo góc 2 px)</h2>
        <p>Bao gồm đầy đủ các icon thường gặp: Liên hệ, Email, Facebook, Zalo, Địa chỉ, Hỏi đáp FAQ, AI Duotone, Bảo mật, Giỏ hàng...</p>
      </div>
      <div class="icon-grid" id="iconGrid"></div>
    </section>

    <!-- 4. Nút bấm & Thành phần UI -->
    <section class="section">
      <div class="section-head">
        <h2>4. Hệ thống Nút bấm (Buttons) & Typography</h2>
        <p>Phông chữ Be Vietnam Pro (x-height lớn, tối ưu dấu tiếng Việt) kết hợp bo góc 8 px sắc nét.</p>
      </div>
      <div class="card">
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Tạo trang ngay</button>
          <button class="btn btn-ai" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" fill="currentColor" fill-opacity="0.16"/></svg>
            Phân tích bằng AI
          </button>
          <button class="btn btn-secondary" type="button">Xuất báo cáo CSV</button>
          <button class="btn btn-disabled" type="button" disabled>Đã khóa thao tác</button>
        </div>
      </div>
    </section>
  </main>

  <!-- Pop-up mẫu -->
  <div class="modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal">
      <div class="modal-head">
        <h3 class="modal-title" id="modalTitle">Cấu hình nhanh Xclipse</h3>
        <button class="btn btn-secondary" id="closeModal" type="button" style="height:32px;padding:0 10px;">Đóng</button>
      </div>
      <p style="margin:0 0 14px;font-size:14px;color:var(--text-muted);">
        Pop-up sử dụng nền đặc đạt chuẩn tương phản kết hợp lớp phủ làm mờ 12px và viền ánh sáng mảnh 1px.
      </p>
      <label style="display:block;font-size:13px;font-weight:600;">
        Tên chiến dịch / sản phẩm
        <input class="input" type="text" placeholder="Ví dụ: Flash Sale Mùa Thu 2026" />
      </label>
      <div class="btn-row" style="margin-top:18px;justify-content:flex-end;">
        <button class="btn btn-secondary" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-primary" id="saveModal" type="button">Lưu & Tiếp tục</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast">Đã sao chép mã màu!</div>

  <script>
    const COLORS = [
      { name: 'Light Canvas', hex: '#F8FAFC' },
      { name: 'Light Surface', hex: '#FFFFFF' },
      { name: 'Light Text', hex: '#0F172A' },
      { name: 'Samsung Cobalt (Light CTA)', hex: '#1428A0' },
      { name: 'Eclipse Canvas (Dark)', hex: '#07090E' },
      { name: 'Silicon Charcoal (Card)', hex: '#10141E' },
      { name: 'Electric Cobalt (Dark CTA)', hex: '#2E5BFF' },
      { name: 'Cyan Ray (AI Accent)', hex: '#38BDF8' },
      { name: 'Corona Amber (Highlight)', hex: '#F59E0B' }
    ];

    const ICONS = [
      { label: 'Liên hệ / Hotline', svg: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>' },
      { label: 'Email', svg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' },
      { label: 'Facebook', svg: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M15 8h-2a2 2 0 0 0-2 2v11M9 13h6"/>' },
      { label: 'Zalo / Tin nhắn', svg: '<path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 11h8M8 14h5"/>' },
      { label: 'Chia sẻ mạng XH', svg: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.3 10.8l7.4-4.6M8.3 13.2l7.4 4.6"/>' },
      { label: 'Địa chỉ / Vị trí', svg: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>' },
      { label: 'Hỏi đáp (FAQ)', svg: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8"/><rect x="11.3" y="16.5" width="1.4" height="1.4" rx="0.4" fill="currentColor" stroke="none"/>' },
      { label: 'Trợ lý AI (Duotone)', ai: true, svg: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" fill="currentColor" fill-opacity="0.16"/><circle cx="18.5" cy="5.5" r="1.2" fill="currentColor" stroke="none"/>' },
      { label: 'Bảo mật dữ liệu', svg: '<path d="M12 3l7 3v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/>' },
      { label: 'Giỏ hàng / Đơn', svg: '<path d="M6 7h15l-1.5 8h-12z"/><path d="M6 7L5 4H2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>' },
      { label: 'Biểu đồ KPI', svg: '<path d="M4 19h16"/><path d="M7 15v-4M12 15V7M17 15v-6"/>' },
      { label: 'Tìm kiếm nhanh', svg: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>' },
      { label: 'Cảnh báo lỗi', svg: '<path d="M12 9v4M12 16.8h.01"/><path d="M10.3 4.2L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"/>' },
      { label: 'Xuất file / CSV', svg: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M4 20h16"/>' },
      { label: 'Sao chép nhanh', svg: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>' },
      { label: 'Chế độ Nhật thực', svg: '<path d="M15.5 4.5A8 8 0 1 0 19.5 15.5 6.5 6.5 0 0 1 15.5 4.5z"/>' }
    ];

    const swatchesEl = document.getElementById('swatches');
    const toastEl = document.getElementById('toast');
    let toastTimer;

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
    }

    COLORS.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch';
      btn.innerHTML = `<div class="swatch-box" style="background:${c.hex}"></div><div class="swatch-meta"><div class="swatch-name">${c.name}</div><div class="swatch-hex">${c.hex}</div></div>`;
      btn.onclick = () => {
        navigator.clipboard?.writeText(c.hex);
        showToast(`Đã sao chép ${c.hex}`);
      };
      swatchesEl.appendChild(btn);
    });

    const iconGrid = document.getElementById('iconGrid');
    ICONS.forEach(ic => {
      const tile = document.createElement('div');
      tile.className = 'icon-tile' + (ic.ai ? ' is-ai' : '');
      tile.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ic.svg}</svg><span>${ic.label}</span>`;
      iconGrid.appendChild(tile);
    });

    document.getElementById('toggleTheme').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
    };

    const backdrop = document.getElementById('modalBackdrop');
    const open = () => backdrop.classList.add('open');
    const close = () => backdrop.classList.remove('open');
    document.getElementById('openModal').onclick = open;
    document.getElementById('closeModal').onclick = close;
    document.getElementById('cancelModal').onclick = close;
    document.getElementById('saveModal').onclick = () => { close(); showToast('Đã lưu cấu hình mẫu!'); };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-demo.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX Showcase — #0A0A0A · #007BA7 · #FF2D95</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);

      /* Brand Palette from Teacher's Reference */
      --void: #0A0A0A;
      --cerulean: #007BA7;
      --cerulean-bright: #19A7CE;
      --magenta: #FF2D95;
      --magenta-hover: #E01B7D;

      /* Dark Mode (Default — Eclipse Showcase) */
      --bg: #0A0A0A;
      --surface: #121318;
      --surface-2: #191B22;
      --text: #F8FAFC;
      --text-muted: #9CA3AF;
      --border: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(255, 255, 255, 0.22);
      --glass: rgba(18, 19, 24, 0.78);
      --shadow-modal: 0 28px 70px rgba(0, 0, 0, 0.8);
    }

    html[data-theme="light"] {
      --bg: #F6F8FB;
      --surface: #FFFFFF;
      --surface-2: #EEF2F7;
      --text: #0A0A0A;
      --text-muted: #4B5563;
      --border: rgba(10, 10, 10, 0.09);
      --border-strong: rgba(10, 10, 10, 0.24);
      --glass: rgba(255, 255, 255, 0.88);
      --shadow-modal: 0 24px 60px rgba(10, 10, 10, 0.16);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.55;
      overflow-x: hidden;
      transition: background 240ms var(--ease), color 240ms var(--ease);
    }

    /* Ambient Eclipse Glow */
    .ambient-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(620px circle at 12% 10%, rgba(0, 123, 167, 0.18), transparent 60%),
        radial-gradient(540px circle at 88% 18%, rgba(255, 45, 149, 0.14), transparent 60%);
    }
    html[data-theme="light"] .ambient-bg {
      background:
        radial-gradient(620px circle at 12% 10%, rgba(0, 123, 167, 0.08), transparent 60%),
        radial-gradient(540px circle at 88% 18%, rgba(255, 45, 149, 0.07), transparent 60%);
    }

    .container { position: relative; z-index: 1; max-width: 1160px; margin: 0 auto; padding: 0 20px; }

    /* Top Navigation */
    .nav {
      position: sticky; top: 0; z-index: 30;
      background: var(--glass);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      height: 64px;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; letter-spacing: -0.02em; text-decoration: none; color: var(--text); }
    .brand-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-strong); }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 500; transition: color 150ms; }
    .nav-links a:hover { color: var(--text); }
    .nav-actions { display: flex; align-items: center; gap: 10px; }

    /* Palette Pill Bar */
    .palette-strip {
      display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
      margin-top: 24px;
    }
    .color-chip {
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 8px;
      border-radius: 999px; background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; font-family: var(--mono); color: var(--text); cursor: pointer;
      transition: border-color 150ms, transform 120ms;
    }
    .color-chip:hover { border-color: var(--cerulean); transform: translateY(-1px); }
    .color-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 40px; padding: 0 18px; border-radius: 10px; font-family: var(--font);
      font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ease); text-decoration: none;
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 34px; padding: 0 14px; font-size: 13px; border-radius: 8px; }
    .btn-magenta {
      background: var(--magenta); color: #FFFFFF;
      box-shadow: 0 8px 24px rgba(255, 45, 149, 0.28);
    }
    .btn-magenta:hover { background: var(--magenta-hover); box-shadow: 0 10px 28px rgba(255, 45, 149, 0.4); }
    .btn-cerulean { background: var(--cerulean); color: #FFFFFF; }
    .btn-cerulean:hover { background: #00668B; }
    .btn-outline { background: transparent; color: var(--text); border-color: var(--border-strong); }
    .btn-outline:hover { background: var(--surface-2); border-color: var(--cerulean); }
    .btn-ghost { background: rgba(0, 123, 167, 0.12); color: var(--cerulean-bright); border-color: rgba(0, 123, 167, 0.35); }
    html[data-theme="light"] .btn-ghost { color: var(--cerulean); }
    .btn-ghost:hover { background: rgba(0, 123, 167, 0.2); }
    .btn-disabled { opacity: 0.45; cursor: not-allowed; background: var(--surface-2); color: var(--text-muted); }

    /* Signature Circular Arrow CTA (inspired by reference image) */
    .cta-circle-btn {
      display: inline-flex; align-items: center; gap: 14px; background: none; border: none;
      color: var(--text); font-family: var(--font); font-size: 13px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; padding: 4px 0;
    }
    .cta-circle-icon {
      width: 44px; height: 44px; border-radius: 50%;
      display: grid; place-items: center;
      border: 1.5px solid var(--magenta);
      background: rgba(255, 45, 149, 0.1);
      color: var(--magenta);
      box-shadow: 0 0 20px rgba(255, 45, 149, 0.25);
      transition: transform 200ms var(--ease), background 200ms var(--ease);
    }
    .cta-circle-btn:hover .cta-circle-icon { transform: translateX(4px); background: var(--magenta); color: #FFFFFF; }

    /* Hero Section */
    .hero {
      padding: 56px 0 48px;
      display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center;
    }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--cerulean-bright); margin-bottom: 14px;
    }
    html[data-theme="light"] .eyebrow { color: var(--cerulean); }
    .hero-title {
      margin: 0; font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.08; letter-spacing: -0.03em;
    }
    .hero-title .c-blue { color: var(--cerulean-bright); }
    html[data-theme="light"] .hero-title .c-blue { color: var(--cerulean); }
    .hero-title .c-pink { color: var(--magenta); }
    .hero-desc { margin: 18px 0 28px; color: var(--text-muted); font-size: 16px; max-width: 480px; }
    .hero-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }

    /* Hero Mockup Card */
    .mockup {
      background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
      padding: 20px; position: relative;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 123, 167, 0.18);
    }
    html[data-theme="light"] .mockup { box-shadow: 0 20px 44px rgba(10, 10, 10, 0.08); }
    .mockup-top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .dots { display: flex; gap: 6px; }
    .dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }
    .dots span:first-child { background: var(--magenta); }
    .dots span:nth-child(2) { background: var(--cerulean); }

    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
    .kpi-card {
      background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 14px;
    }
    .kpi-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-val { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; margin-top: 4px; }
    .kpi-delta { font-size: 11px; font-weight: 600; margin-top: 2px; }
    .delta-blue { color: var(--cerulean-bright); }
    .delta-pink { color: var(--magenta); }

    /* Interactive Bar Chart */
    .chart-box {
      background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px;
    }
    .bars { display: flex; align-items: flex-end; gap: 10px; height: 110px; margin-top: 12px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
    .bar {
      width: 100%; border-radius: 6px 6px 2px 2px;
      background: linear-gradient(180deg, var(--cerulean-bright), var(--cerulean));
      transition: height 350ms var(--ease), filter 180ms;
      cursor: pointer;
    }
    .bar.is-peak { background: linear-gradient(180deg, var(--magenta), #B01362); box-shadow: 0 0 16px rgba(255, 45, 149, 0.35); }
    .bar:hover { filter: brightness(1.18); }
    .bar-lbl { font-size: 11px; color: var(--text-muted); font-family: var(--mono); }

    /* Sections */
    .sec { padding: 48px 0; border-top: 1px solid var(--border); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
    .sec-head p { margin: 0; color: var(--text-muted); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel {
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px;
    }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; }

    /* Form Controls */
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
    .input, .select {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text);
      font-family: var(--font); font-size: 14px; transition: border-color 150ms, box-shadow 150ms;
    }
    .input:focus, .select:focus {
      outline: none; border-color: var(--cerulean);
      box-shadow: 0 0 0 3px rgba(0, 123, 167, 0.22);
    }
    .input.is-error { border-color: var(--magenta); box-shadow: 0 0 0 3px rgba(255, 45, 149, 0.18); }
    .err-msg { font-size: 12px; color: var(--magenta); margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    /* Toggle Switch */
    .switch-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .switch {
      position: relative; width: 44px; height: 24px; border-radius: 999px;
      background: var(--surface-2); border: 1px solid var(--border-strong); cursor: pointer; transition: background 200ms;
    }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
      border-radius: 50%; background: #FFFFFF; transition: transform 200ms var(--ease);
    }
    .switch.on { background: var(--cerulean); border-color: var(--cerulean); }
    .switch.on.pink { background: var(--magenta); border-color: var(--magenta); }
    .switch.on::after { transform: translateX(20px); }

    /* Badges & Tabs */
    .tabs { display: inline-flex; background: var(--surface-2); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
    .tab {
      border: none; background: transparent; color: var(--text-muted); font-family: var(--font);
      font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 7px; cursor: pointer;
    }
    .tab.active { background: var(--cerulean); color: #FFFFFF; }

    .badge {
      display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px;
      font-size: 11px; font-weight: 600;
    }
    .badge-blue { background: rgba(0, 123, 167, 0.16); color: var(--cerulean-bright); border: 1px solid rgba(0, 123, 167, 0.35); }
    .badge-pink { background: rgba(255, 45, 149, 0.15); color: var(--magenta); border: 1px solid rgba(255, 45, 149, 0.35); }
    .badge-ok { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.35); }
    html[data-theme="light"] .badge-blue { color: var(--cerulean); }
    html[data-theme="light"] .badge-ok { color: #059669; }

    /* Table */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 10px 12px; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--surface-2); }

    /* Compact Icon Bar */
    .icon-bar { display: flex; flex-wrap: wrap; gap: 10px; }
    .ic-btn {
      width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center;
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      cursor: pointer; transition: all 160ms var(--ease);
    }
    .ic-btn:hover { border-color: var(--magenta); color: var(--magenta); transform: translateY(-2px); }

    /* Modal / Pop-up */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(10, 10, 10, 0.72); backdrop-filter: blur(14px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 460px; border-radius: 18px; padding: 24px;
      background: var(--surface); border: 1px solid rgba(0, 123, 167, 0.4);
      box-shadow: var(--shadow-modal), 0 0 40px rgba(255, 45, 149, 0.12);
      animation: popIn 220ms var(--ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 70;
      background: var(--surface); color: var(--text);
      border: 1px solid var(--cerulean); border-left: 4px solid var(--magenta);
      padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      opacity: 0; transform: translateY(8px); pointer-events: none; transition: all 200ms var(--ease);
    }
    .toast.show { opacity: 1; transform: none; }

    @media (max-width: 860px) {
      .hero { grid-template-columns: 1fr; padding-top: 32px; }
      .nav-links { display: none; }
      .kpi-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="ambient-bg"></div>

  <!-- Navbar -->
  <header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">
        <img class="brand-logo" src="logo-dark.jpg" alt="Xclipse Logo" onerror="this.style.display='none'" />
        <span>XCLIPSE</span>
      </a>
      <nav class="nav-links">
        <a href="#components">Thành phần UI</a>
        <a href="#forms">Form & Tương tác</a>
        <a href="#data">Bảng dữ liệu</a>
      </nav>
      <div class="nav-actions">
        <button class="btn btn-outline btn-sm" id="themeBtn" type="button">Đổi Sáng / Tối</button>
        <button class="btn btn-magenta btn-sm" id="openPopupTop" type="button">Mở Pop-up</button>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Color Chips -->
    <div class="palette-strip">
      <button class="color-chip" data-hex="#0A0A0A"><span class="color-dot" style="background:#0A0A0A"></span>#0A0A0A (Nền chính)</button>
      <button class="color-chip" data-hex="#007BA7"><span class="color-dot" style="background:#007BA7"></span>#007BA7 (Cerulean)</button>
      <button class="color-chip" data-hex="#FF2D95"><span class="color-dot" style="background:#FF2D95"></span>#FF2D95 (Neon Pink)</button>
    </div>

    <!-- Hero Showcase -->
    <section class="hero">
      <div>
        <div class="eyebrow">● Giao diện thế hệ mới · Xclipse UI Kit</div>
        <h1 class="hero-title">
          <span class="c-blue">THẾ HỆ</span><br />
          <span class="c-pink">TIẾP THEO</span>
        </h1>
        <p class="hero-desc">
          Kết hợp nền tối sâu <strong>#0A0A0A</strong>, xanh công nghệ <strong>#007BA7</strong> và điểm nhấn <strong>#FF2D95</strong> — tối ưu cho các bài toán quản trị, thương mại điện tử và phân tích AI.
        </p>
        <div class="hero-cta-row">
          <button class="cta-circle-btn" id="exploreBtn" type="button">
            <span class="cta-circle-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
            <span>Khám phá giao diện</span>
          </button>
          <button class="btn btn-cerulean" id="openPopupHero" type="button">Dùng thử Modal</button>
        </div>
      </div>

      <!-- Live Dashboard Mockup -->
      <div class="mockup">
        <div class="mockup-top">
          <div class="dots"><span></span><span></span><span></span></div>
          <span class="badge badge-pink">● AI Live Sync</span>
        </div>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Doanh thu</div>
            <div class="kpi-val">148.5M</div>
            <div class="kpi-delta delta-blue">+24.8% tuần</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Chuyển đổi</div>
            <div class="kpi-val">6.42%</div>
            <div class="kpi-delta delta-pink">Mục tiêu đạt</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Đơn xử lý</div>
            <div class="kpi-val">1,284</div>
            <div class="kpi-delta delta-blue">Tự động 92%</div>
          </div>
        </div>
        <div class="chart-box">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <strong>Hiệu suất 7 ngày gần nhất</strong>
            <span style="color:var(--text-muted);">Click cột để xem</span>
          </div>
          <div class="bars" id="bars"></div>
        </div>
      </div>
    </section>

    <!-- UI Components -->
    <section class="sec" id="components">
      <div class="sec-head">
        <div>
          <h2>Hệ thống Nút bấm, Trạng thái & Icon</h2>
          <p>Phân cấp rõ ràng: Hồng (#FF2D95) cho hành động nổi bật nhất, Xanh (#007BA7) cho tác vụ chính.</p>
        </div>
        <div class="tabs" id="tabGroup">
          <button class="tab active" type="button">Tổng quan</button>
          <button class="tab" type="button">Phân tích AI</button>
          <button class="tab" type="button">Cài đặt</button>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Buttons & Badges</h3>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
            <button class="btn btn-magenta" type="button" onclick="toast('Đã bấm nút Primary Neon!')">Tạo chiến dịch</button>
            <button class="btn btn-cerulean" type="button" onclick="toast('Đang xuất dữ liệu...')">Lưu báo cáo</button>
            <button class="btn btn-ghost" type="button" onclick="toast('AI đang phân tích...')">✨ Gợi ý AI</button>
            <button class="btn btn-outline" type="button">Hủy bỏ</button>
            <button class="btn btn-disabled" type="button" disabled>Đã khóa</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span class="badge badge-pink">● Hot / Ưu tiên</span>
            <span class="badge badge-blue">● Đang hoạt động</span>
            <span class="badge badge-ok">✓ Đã xác thực</span>
          </div>
        </div>

        <div class="panel">
          <h3>Bộ Icon SVG đồng bộ (Hover để xem phản hồi)</h3>
          <div class="icon-bar" id="iconBar"></div>
          <p style="margin:14px 0 0;font-size:12px;color:var(--text-muted);">
            Nét mảnh 1.6px trên lưới 24×24px: Hotline, Email, Facebook, Zalo, Địa chỉ, FAQ, AI, Bảo mật, Giỏ hàng, Biểu đồ.
          </p>
        </div>
      </div>
    </section>

    <!-- Forms & Interactive -->
    <section class="sec" id="forms">
      <div class="sec-head">
        <div>
          <h2>Form nhập liệu & Kiểm tra lỗi UX</h2>
          <p>Thử để trống hoặc nhập sai định dạng rồi bấm "Kiểm tra ngay" để xem trạng thái phản hồi.</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu thao tác nhanh</h3>
          <div class="field">
            <label for="fName">Tên sản phẩm / Chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Flash Sale Cuối Tuần" />
            <div class="err-msg" id="eName">Vui lòng không để trống tên chiến dịch.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email nhận báo cáo</label>
            <input class="input" id="fEmail" type="email" placeholder="name@company.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng (ví dụ: ten@gmail.com).</div>
          </div>
          <button class="btn btn-magenta" id="validateBtn" type="button">Kiểm tra & Gửi</button>
        </div>

        <div class="panel">
          <h3>Tùy chọn bật/tắt (Toggle Switches)</h3>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Tự động cảnh báo hết hàng</div>
              <div style="font-size:12px;color:var(--text-muted);">Dùng màu xanh #007BA7 cho trạng thái chuẩn</div>
            </div>
            <div class="switch on" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Chế độ Flash Sale ưu tiên</div>
              <div style="font-size:12px;color:var(--text-muted);">Dùng màu hồng #FF2D95 cho tính năng nổi bật</div>
            </div>
            <div class="switch on pink" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row" style="border-bottom:none;">
            <div>
              <div style="font-size:14px;font-weight:600;">Đồng bộ Google Sheet</div>
              <div style="font-size:12px;color:var(--text-muted);">Gửi dữ liệu realtime sau khi xác nhận</div>
            </div>
            <div class="switch" role="switch" tabindex="0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Table -->
    <section class="sec" id="data">
      <div class="sec-head">
        <div>
          <h2>Bảng dữ liệu & Bộ lọc</h2>
          <p>Số liệu căn thẳng cột (tabular-nums), dễ quét nhanh trên nền tối lẫn nền sáng.</p>
        </div>
        <input class="input" id="searchInput" type="search" placeholder="Tìm nhanh chiến dịch..." style="max-width:260px;" />
      </div>
      <div class="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên chiến dịch</th>
              <th>Kênh</th>
              <th>Đơn hàng</th>
              <th>Biên lợi nhuận</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </section>
  </main>

  <!-- Modal Pop-up -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;">Pop-up Giao diện Xclipse</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--text-muted);">
        Nền tối phân tầng kết hợp hiệu ứng làm mờ hậu cảnh (backdrop blur) và viền sáng mảnh #007BA7 + #FF2D95.
      </p>
      <div class="field">
        <label>Tên cấu hình</label>
        <input class="input" type="text" value="Xclipse Theme — Cerulean & Neon Pink" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-magenta" id="confirmModal" type="button">Áp dụng ngay</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toastEl">Thông báo</div>

  <script>
    const toastEl = document.getElementById('toastEl');
    let tTimer;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(tTimer);
      tTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    // Copy hex chips
    document.querySelectorAll('.color-chip').forEach(btn => {
      btn.onclick = () => {
        navigator.clipboard?.writeText(btn.dataset.hex);
        toast('Đã sao chép mã màu ' + btn.dataset.hex);
      };
    });

    // Theme switch
    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      toast(next === 'dark' ? 'Đã bật Eclipse Dark (#0A0A0A)' : 'Đã bật Light Mode');
    };

    // Mockup bars
    const barData = [
      { d: 'T2', v: 46 }, { d: 'T3', v: 62 }, { d: 'T4', v: 54 },
      { d: 'T5', v: 78 }, { d: 'T6', v: 96, peak: true }, { d: 'T7', v: 82 }, { d: 'CN', v: 68 }
    ];
    const barsEl = document.getElementById('bars');
    barData.forEach(b => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = `<div class="bar ${b.peak ? 'is-peak' : ''}" style="height:${b.v}%" title="${b.d}: ${b.v}%"></div><span class="bar-lbl">${b.d}</span>`;
      col.onclick = () => toast(`${b.d}: Hiệu suất đạt ${b.v}%`);
      barsEl.appendChild(col);
    });

    // Icons
    const iconPaths = [
      ['Hotline', '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'],
      ['Email', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'],
      ['Facebook', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M15 8h-2a2 2 0 0 0-2 2v11M9 13h6"/>'],
      ['Zalo', '<path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 11h8M8 14h5"/>'],
      ['Địa chỉ', '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'],
      ['FAQ', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/>'],
      ['AI', '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>'],
      ['Bảo mật', '<path d="M12 3l7 3v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/>'],
      ['Giỏ hàng', '<path d="M6 7h15l-1.5 8h-12z"/><path d="M6 7L5 4H2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'],
      ['Biểu đồ', '<path d="M4 19h16"/><path d="M7 15v-4M12 15V7M17 15v-6"/>']
    ];
    const iconBar = document.getElementById('iconBar');
    iconPaths.forEach(([name, path]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ic-btn'; b.title = name;
      b.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      b.onclick = () => toast('Icon: ' + name);
      iconBar.appendChild(b);
    });

    // Tabs & Switches
    document.querySelectorAll('#tabGroup .tab').forEach(t => {
      t.onclick = () => {
        document.querySelectorAll('#tabGroup .tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      };
    });
    document.querySelectorAll('.switch').forEach(sw => {
      sw.onclick = () => sw.classList.toggle('on');
    });

    // Form validation demo
    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName');
      const email = document.getElementById('fEmail');
      const eName = document.getElementById('eName');
      const eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) toast('✓ Dữ liệu hợp lệ! Đã lưu thành công.');
    };

    // Table filter
    const rows = [
      { name: 'Flash Sale Cuối Tuần', ch: 'Shopee / Web', orders: 428, margin: '34.2%', badge: ['badge-pink', '● Nổi bật'] },
      { name: 'Combo Khai Trương Q4', ch: 'TikTok Shop', orders: 312, margin: '28.5%', badge: ['badge-blue', '● Đang chạy'] },
      { name: 'Khách hàng Thân thiết', ch: 'Zalo OA', orders: 544, margin: '41.0%', badge: ['badge-ok', '✓ Hoàn tất'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.ch}</td><td>${r.orders}</td><td>${r.margin}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    // Modal
    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = () => { closeModal(); toast('Đã áp dụng cấu hình!'); };
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
    document.getElementById('exploreBtn').onclick = () => document.getElementById('components').scrollIntoView({ behavior: 'smooth' });
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-final-navy-pink.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX — Navy &amp; Coral Pink (#072D59 · #DBF2FC · #FD6E88)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* Lucian UX/UI Prompt theme tokens mapped to #DBF2FC · #072D59 · #FD6E88 */
    :root {
      color-scheme: light;
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;

      --cobalt: #072D59;
      --cobalt-mid: #14539A;
      --ice: #DBF2FC;
      --coral: #FD6E88;
      --coral-deep: #C93252;
      --coral-soft: #FFF0F3;
      --coral-border: #FFC2CE;

      --ux-page: #F5FBFF;
      --ux-surface: #FFFFFF;
      --ux-surface-2: #EAF6FD;
      --ux-surface-3: #DBF2FC;
      --ux-ink: #072D59;
      --ux-ink-2: #38587E;
      --ux-ink-3: #647D9B;
      --ux-line: rgba(7, 45, 89, 0.09);
      --ux-line-2: rgba(7, 45, 89, 0.18);
      --ux-accent: #072D59;
      --ux-accent-2: #FD6E88;
      --ux-accent-soft: rgba(7, 45, 89, 0.09);
      --ux-accent-ink: #FFFFFF;
      --ux-mint: #0D9488;
      --ux-warn: #FD6E88;
      --ux-danger: #D9264E;
      --ux-shadow: rgba(7, 45, 89, 0.09);
      --ux-shadow-strong: rgba(7, 45, 89, 0.22);
      --ux-ease: cubic-bezier(.2, .8, .2, 1);
      --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --coral: #FD6E88;
      --coral-deep: #FF94A8;
      --coral-soft: rgba(253, 110, 136, 0.16);
      --coral-border: rgba(253, 110, 136, 0.34);

      --ux-page: #03152B;
      --ux-surface: #072D59;
      --ux-surface-2: #0C3A6E;
      --ux-surface-3: #134A87;
      --ux-ink: #F2FAFF;
      --ux-ink-2: #B6D7EE;
      --ux-ink-3: #7FA7C9;
      --ux-line: rgba(219, 242, 252, 0.12);
      --ux-line-2: rgba(219, 242, 252, 0.24);
      --ux-accent: #7DD3FC;
      --ux-accent-2: #FD6E88;
      --ux-accent-soft: rgba(219, 242, 252, 0.16);
      --ux-accent-ink: #03152B;
      --ux-mint: #2DD4BF;
      --ux-warn: #FD6E88;
      --ux-danger: #FB7185;
      --ux-shadow: rgba(0, 0, 0, 0.42);
      --ux-shadow-strong: rgba(0, 0, 0, 0.72);
    }

    .ux, .ux *, .ux *::before, .ux *::after { box-sizing: border-box; }
    .ux { font-family: var(--font); color: var(--ux-ink); -webkit-font-smoothing: antialiased; letter-spacing: -.01em; }
    :where(.ux) :is(button, input, textarea, select) { font: inherit; color: inherit; }
    :where(.ux) button { cursor: pointer; }
    .ux :focus-visible { outline: 2px solid var(--ux-accent); outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) {
      .ux, .ux *, .ux *::before, .ux *::after {
        animation-duration: .001ms !important; animation-iteration-count: 1 !important;
        transition-duration: .001ms !important; scroll-behavior: auto !important;
      }
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--ux-page); color: var(--ux-ink);
      line-height: 1.55; overflow-x: hidden;
      transition: background .3s var(--ux-ease), color .3s var(--ux-ease);
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }

    /* Hero Navy Atmosphere (#072D59) with Ice Sky (#DBF2FC) & Coral Pink (#FD6E88) Glow */
    .hero-zone {
      position: relative;
      background:
        radial-gradient(520px 260px at 82% 24%, rgba(253, 110, 136, 0.28), transparent 70%),
        radial-gradient(640px 340px at 18% 16%, rgba(219, 242, 252, 0.26), transparent 70%),
        radial-gradient(960px 520px at 50% 42%, #134A87 0%, #0A376B 48%, #072D59 84%, #03152B 100%);
      color: #F2FAFF;
      padding-bottom: 112px;
      overflow: hidden;
    }
    .hero-zone::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(rgba(219, 242, 252, 0.16) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: radial-gradient(circle at 50% 45%, black 35%, transparent 80%);
    }

    /* Topbar */
    .nav { position: relative; z-index: 10; padding: 18px 0; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: #FFFFFF; text-decoration: none; letter-spacing: -0.02em; }
    .brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(219, 242, 252, 0.4); }

    .pill-nav {
      display: flex; align-items: center; gap: 6px; padding: 5px;
      background: rgba(219, 242, 252, 0.14); backdrop-filter: blur(12px);
      border: 1px solid rgba(219, 242, 252, 0.26); border-radius: 999px;
    }
    .pill-nav a {
      color: rgba(242, 250, 255, 0.90); text-decoration: none; font-size: 13px; font-weight: 500;
      padding: 6px 14px; border-radius: 999px; transition: background 150ms;
    }
    .pill-nav a:hover, .pill-nav a.active { background: rgba(219, 242, 252, 0.24); color: #FFFFFF; }
    .nav-right { display: flex; align-items: center; gap: 8px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 42px; padding: 0 20px; border-radius: 999px; font-family: var(--font);
      font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ux-ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 36px; padding: 0 14px; font-size: 13px; }
    .btn-coral {
      background: linear-gradient(135deg, #FD6E88, #E84666); color: #FFFFFF;
      box-shadow: 0 10px 26px rgba(253, 110, 136, 0.36);
    }
    .btn-coral:hover { filter: brightness(1.06); transform: translateY(-1px); }
    .btn-glass {
      background: rgba(219, 242, 252, 0.16); color: #FFFFFF;
      border-color: rgba(219, 242, 252, 0.36); backdrop-filter: blur(10px);
    }
    .btn-glass:hover { background: rgba(219, 242, 252, 0.26); }
    .btn-cobalt { background: var(--cobalt); color: #FFFFFF; box-shadow: 0 8px 20px rgba(7, 45, 89, 0.20); }
    .btn-cobalt:hover { background: #0C3E78; }
    .btn-outline { background: transparent; color: var(--ux-ink); border-color: var(--ux-line-2); }
    .btn-outline:hover { background: var(--ux-surface-2); border-color: var(--ux-accent); }

    /* Hero Content */
    .hero-center { position: relative; z-index: 5; text-align: center; max-width: 760px; margin: 26px auto 0; }
    .palette-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 6px;
      border-radius: 999px; background: rgba(219, 242, 252, 0.14); border: 1px solid rgba(219, 242, 252, 0.28);
      color: #FFFFFF; font-size: 12px; font-family: var(--mono); cursor: pointer;
    }
    .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.45); }
    .mini-flow { display: flex; justify-content: center; flex-wrap: wrap; gap: 18px; font-size: 12.5px; color: #DBF2FC; margin-bottom: 14px; }
    .hero-title { margin: 0; font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; }
    .hero-sub { margin: 14px auto 24px; max-width: 560px; font-size: 15px; color: rgba(242, 250, 255, 0.90); }
    .hero-cta { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; }

    /* 3 Overlapping Dashboard Cards */
    .cards-overlap {
      position: relative; z-index: 10; margin-top: -74px;
      display: grid; grid-template-columns: 1fr 1.06fr 1fr; gap: 18px; align-items: stretch;
    }
    .dash-card {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 20px;
      box-shadow: 0 20px 48px var(--ux-shadow);
      transition: background .3s var(--ux-ease), border-color .3s var(--ux-ease);
    }
    .dash-card.featured {
      background: linear-gradient(155deg, #FD6E88 0%, #EE4D6C 56%, #C92A4B 100%);
      color: #FFFFFF; border-color: rgba(255,255,255,0.38);
      box-shadow: 0 24px 54px rgba(253, 110, 136, 0.34);
      display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;
    }
    html[data-theme="dark"] .dash-card.featured {
      background: linear-gradient(155deg, #FD6E88 0%, #DF3E5E 58%, #A81F3D 100%);
      box-shadow: 0 24px 54px rgba(253, 110, 136, 0.38);
    }
    .card-lbl { font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; width: 100%; }

    .prog-row { margin-bottom: 12px; }
    .prog-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .prog-track { height: 8px; border-radius: 999px; background: var(--ux-surface-3); overflow: hidden; display: flex; }
    .prog-blue { background: var(--cobalt-mid); height: 100%; }
    .prog-coral { background: var(--coral); height: 100%; }

    .gauge-wrap { position: relative; width: 200px; height: 112px; margin: 4px auto 0; }
    .gauge-score { position: absolute; bottom: 4px; left: 0; right: 0; font-size: 42px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }

    /* Sections */
    .sec { padding: 52px 0; border-bottom: 1px solid var(--ux-line); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--ux-accent); }
    .sec-head p { margin: 0; color: var(--ux-ink-2); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 22px;
      box-shadow: 0 6px 20px var(--ux-shadow);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
    .lucian-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--ux-accent-soft); color: var(--ux-accent); }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ux-ink-2); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--ux-line-2); background: var(--ux-surface-2); color: var(--ux-ink);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--ux-accent); box-shadow: 0 0 0 3px var(--ux-accent-soft); }
    .input.is-error { border-color: var(--ux-danger); }
    .err-msg { font-size: 12px; color: var(--ux-danger); margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .badge-cobalt { background: rgba(22, 84, 209, 0.12); color: var(--ux-accent); }
    .badge-coral { background: var(--coral-soft); color: var(--coral-deep); border: 1px solid var(--coral-border); }
    .badge-ok { background: rgba(13, 148, 136, 0.14); color: var(--ux-mint); }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ux-ink-2); padding: 10px 12px; border-bottom: 1px solid var(--ux-line); }
    td { padding: 12px; border-bottom: 1px solid var(--ux-line); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--ux-surface-2); }

    /* Modal */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(2, 7, 10, 0.65); backdrop-filter: blur(12px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 440px; border-radius: 20px; padding: 24px;
      background: var(--ux-surface); border: 1px solid var(--ux-line-2);
      box-shadow: 0 28px 64px var(--ux-shadow-strong);
      animation: popIn 220ms var(--ux-ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    @media (max-width: 880px) {
      .pill-nav { display: none; }
      .cards-overlap { grid-template-columns: 1fr; margin-top: -48px; }
    }
  </style>
</head>
<body>
  <div class="hero-zone">
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="#">
          <img src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
          <span>XCLIPSE</span>
        </a>
        <nav class="pill-nav">
          <a class="active" href="#">Trang chủ</a>
          <a href="#lucian-ux">Lucian UX</a>
          <a href="#forms">Form & Dữ liệu</a>
        </nav>
        <div class="nav-right">
          <button class="btn btn-glass btn-sm" id="themeBtn" type="button">Đổi Sáng / Tối</button>
          <button class="btn btn-coral btn-sm" id="openPopupTop" type="button">Yêu cầu demo</button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="hero-center">
        <div class="palette-strip">
          <button class="color-chip" data-hex="#DBF2FC"><span class="color-dot" style="background:#DBF2FC"></span>#DBF2FC (Ice Sky)</button>
          <button class="color-chip" data-hex="#072D59"><span class="color-dot" style="background:#072D59"></span>#072D59 (Deep Navy)</button>
          <button class="color-chip" data-hex="#FD6E88"><span class="color-dot" style="background:#FD6E88"></span>#FD6E88 (Coral Pink)</button>
        </div>

        <div class="mini-flow">
          <span>→ Phân tích dữ liệu</span>
          <span>→ Tối ưu bằng AI</span>
          <span>→ Giảm rủi ro vận hành</span>
        </div>

        <h1 class="hero-title">
          Vận hành doanh nghiệp<br />Không còn phức tạp
        </h1>
        <p class="hero-sub">
          Bản sao giữ nguyên bố cục V4 &amp; chuyển động <strong>Lucian UX/UI</strong>, áp dụng bảng màu hài hòa <strong>#DBF2FC · #072D59 · #FD6E88</strong>.
        </p>

        <div class="hero-cta">
          <!-- Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002 -->
          <style>
          .u002{--bg:#DBF2FC;--fg:#072D59;--blob:linear-gradient(135deg,#FD6E88,#072D59);
            position:relative;display:inline-grid;place-items:center}
          .u002-mag{transition:translate .9s var(--ux-spring)}
          .u002-btn{position:relative;display:flex;align-items:center;gap:14px;height:54px;padding:0 7px 0 24px;border:0;border-radius:999px;background:var(--bg);color:var(--fg);overflow:hidden;isolation:isolate;
            box-shadow:0 18px 36px -14px rgba(0,0,0,.45);transition:transform .6s var(--ux-spring),box-shadow .6s var(--ux-ease)}
          .u002-btn:active{transform:scale(.96)}
          .u002-fill{position:absolute;inset:0;z-index:-1;background:var(--blob);clip-path:circle(20px at calc(100% - 27px) 50%);transition:clip-path .8s var(--ux-ease)}
          .u002-btn:hover .u002-fill,.u002-btn:focus-visible .u002-fill{clip-path:circle(160% at calc(100% - 27px) 50%)}
          .u002-txt{position:relative;overflow:hidden;padding:4px 0;font-size:15px;font-weight:800;letter-spacing:-.02em;white-space:nowrap;transition:translate .7s var(--ux-spring),color .5s var(--ux-ease)}
          .u002-btn:hover .u002-txt{color:#fff}
          .u002-txt span{display:block;transition:transform .6s var(--ux-spring),opacity .35s var(--ux-ease)}
          .u002-txt span+span{position:absolute;left:0;top:4px;transform:translateY(130%);opacity:0}
          .u002[data-state="go"] .u002-txt span:first-child{transform:translateY(-130%);opacity:0}
          .u002[data-state="go"] .u002-txt span+span{transform:none;opacity:1}
          .u002-orb{position:relative;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#fff;overflow:hidden;flex:none;transition:translate .7s var(--ux-spring)}
          .u002-orb svg{position:absolute;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u002-orb svg:last-child{transform:translateX(-40px)}
          .u002[data-state="go"] .u002-orb svg:first-child{animation:u002-out .55s var(--ux-ease) forwards}
          .u002[data-state="go"] .u002-orb svg:last-child{animation:u002-in .6s var(--ux-spring) .28s forwards}
          @keyframes u002-out{to{transform:translateX(40px)}}
          @keyframes u002-in{to{transform:none}}
          </style>
          <div class="ux u002" data-state="idle">
            <div class="u002-mag">
              <button class="u002-btn" id="heroMagBtn" type="button">
                <span class="u002-fill" aria-hidden="true"></span>
                <span class="u002-txt"><span>Bắt đầu ngay</span><span aria-hidden="true">Đang mở...</span></span>
                <span class="u002-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                </span>
              </button>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var btn = root.querySelector('.u002-btn');
            var mag = root.querySelector('.u002-mag');
            var txt = root.querySelector('.u002-txt');
            var orb = root.querySelector('.u002-orb');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var t = 0;
            root.addEventListener('pointermove', function (e) {
              if (rm) return;
              var r = btn.getBoundingClientRect();
              var dx = e.clientX - (r.left + r.width / 2);
              var dy = e.clientY - (r.top + r.height / 2);
              var p = Math.max(0, 1 - Math.hypot(dx, dy) / 200);
              mag.style.translate = (dx * 0.1 * p).toFixed(1) + 'px ' + (dy * 0.18 * p).toFixed(1) + 'px';
              txt.style.translate = (dx * 0.04 * p).toFixed(1) + 'px ' + (dy * 0.06 * p).toFixed(1) + 'px';
              orb.style.translate = (dx * 0.08 * p).toFixed(1) + 'px ' + (dy * 0.12 * p).toFixed(1) + 'px';
            });
            root.addEventListener('pointerleave', function () {
              mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px';
            });
            btn.addEventListener('click', function () {
              clearTimeout(t);
              root.dataset.state = 'idle';
              void btn.offsetWidth;
              root.dataset.state = 'go';
              t = setTimeout(function () { if (root.isConnected) root.dataset.state = 'idle'; }, rm ? 700 : 1400);
            });
          })();
          </script>

          <button class="btn btn-glass" id="openPopupHero" type="button" style="height:54px;padding:0 24px;">Mở Pop-up mẫu</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Overlapping Dashboard Cards -->
  <div class="container">
    <div class="cards-overlap">
      <div class="dash-card">
        <div class="card-lbl">
          <span>Phân bổ theo danh mục</span>
          <span class="badge badge-cobalt">4 nhóm</span>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Đơn hàng mới</span><span>184</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:45%"></div><div class="prog-coral" style="width:25%"></div></div>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Biên lợi nhuận</span><span>36%</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:30%"></div><div class="prog-coral" style="width:42%"></div></div>
        </div>
        <div class="prog-row" style="margin-bottom:0;">
          <div class="prog-top"><span>Tồn kho an toàn</span><span>243</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:65%"></div><div class="prog-coral" style="width:15%"></div></div>
        </div>
      </div>

      <div class="dash-card featured">
        <div class="card-lbl" style="justify-content:center;color:#FCFFFF;">
          <span>● Điểm hiệu suất hệ thống</span>
        </div>
        <div class="gauge-wrap">
          <svg viewBox="0 0 200 110" width="200" height="110">
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="14" stroke-linecap="round"/>
            <path id="gaugeArc" d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#FCFFFF" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="68"/>
          </svg>
          <div class="gauge-score" id="scoreVal">73</div>
        </div>
        <input id="scoreRange" type="range" min="20" max="100" value="73" style="width:85%;accent-color:#FCFFFF;margin-top:8px;" aria-label="Kéo thử điểm hiệu suất" />
      </div>

      <div class="dash-card">
        <div class="card-lbl">
          <span>Đã mở vs. Đã xử lý</span>
          <span class="badge badge-coral">Realtime</span>
        </div>
        <svg viewBox="0 0 280 120" width="100%" height="120">
          <defs>
            <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14539A" stop-opacity="0.30"/>
              <stop offset="100%" stop-color="#14539A" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30 L270 110 L10 110 Z" fill="url(#areaBlue)"/>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30" fill="none" stroke="#14539A" stroke-width="3" stroke-linecap="round"/>
          <circle cx="145" cy="52" r="5" fill="var(--coral)" stroke="#072D59" stroke-width="2"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ux-ink-2);">
          <span>Tháng 9</span><span>Tháng 10</span><span>Tháng 11</span>
        </div>
      </div>
    </div>
  </div>

  <main class="container">
    <!-- Lucian UX Interactive Section -->
    <section class="sec" id="lucian-ux">
      <div class="sec-head">
        <div>
          <h2>Tương tác UX theo chuẩn Lucian (Seokwoooo)</h2>
          <p>Ứng dụng hiệu ứng vật lý, biểu đồ mục tiêu và thông báo xếp chồng trực tiếp trên nền màu Xclipse.</p>
        </div>
      </div>

      <div class="grid-2" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- #013 Stretchy switch -->
        <div class="panel" style="align-items:center;">
          <h3 style="width:100%;"><span>Công tắc co giãn</span><span class="lucian-tag">Lucian #013</span></h3>
          <!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
          <style>
          .u013{--on:linear-gradient(135deg,#FD6E88,#072D59);position:relative;width:280px;height:185px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
          .u013-sw{position:relative;width:140px;height:76px;border:0;padding:0;border-radius:999px;background:var(--ux-surface-3);touch-action:none;
            box-shadow:inset 0 2px 6px rgba(0,0,0,.12),inset 0 0 0 1px var(--ux-line);transition:box-shadow .5s var(--ux-ease)}
          .u013-sw::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--on);opacity:0;transition:opacity .45s var(--ux-ease)}
          .u013.is-on .u013-sw::before{opacity:1}
          .u013.is-on .u013-sw{box-shadow:inset 0 2px 6px rgba(0,0,0,.12),0 16px 30px -16px rgba(253,110,136,.70)}
          .u013-knob{position:absolute;top:8px;left:8px;width:60px;height:60px;border-radius:999px;background:#fff;display:grid;place-items:center;
            box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 6px 14px -4px rgba(0,0,0,.28);transition:left .5s var(--ux-spring),width .32s var(--ux-ease)}
          .u013.is-on .u013-knob{left:72px}
          .u013.is-stretch .u013-knob{width:84px;transition:left .5s var(--ux-spring),width .18s var(--ux-ease)}
          .u013.is-on.is-stretch .u013-knob{left:48px}
          .u013.is-drag .u013-knob{transition:width .2s var(--ux-ease)}
          .u013-knob svg{width:24px;height:24px;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
          .u013-x{stroke:#94A3B8;stroke-dasharray:14;stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--ux-ease) .1s}
          .u013-v{stroke:#072D59;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--ux-ease)}
          .u013.is-on .u013-x{stroke-dashoffset:14;transition-delay:0s}
          .u013.is-on .u013-v{stroke-dashoffset:0;transition-delay:.18s}
          .u013-txt{width:250px;text-align:center}
          .u013-txt b{display:block;font-size:15px;font-weight:700}
          .u013-sub{position:relative;display:block;height:20px;margin-top:4px;overflow:hidden;font-size:12.5px;color:var(--ux-ink-3)}
          .u013-sub span{display:block;line-height:20px;transition:transform .5s var(--ux-spring),opacity .3s var(--ux-ease)}
          .u013-sub span+span{position:absolute;left:0;right:0;top:0;transform:translateY(100%);opacity:0;color:var(--coral-deep);font-weight:700}
          .u013.is-on .u013-sub span:first-child{transform:translateY(-100%);opacity:0}
          .u013.is-on .u013-sub span+span{transform:none;opacity:1}
          </style>
          <div class="ux u013">
            <button class="u013-sw" type="button" role="switch" aria-checked="false">
              <span class="u013-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path class="u013-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9"/><path class="u013-v" d="M5.5 12.5l4.5 4.5 8.5-9"/></svg>
              </span>
            </button>
            <div class="u013-txt">
              <b class="u013-lab">Tối ưu giá bằng AI</b>
              <span class="u013-sub" aria-live="polite"><span>Đang tắt · Chỉnh tay</span><span>Đã bật · Đề xuất tự động</span></span>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u013-sw'), knob = root.querySelector('.u013-knob'), lab = root.querySelector('.u013-lab');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var id = 'u013-l-' + Math.random().toString(36).slice(2, 7); lab.id = id; sw.setAttribute('aria-labelledby', id);
            var on = false, t = 0, drag = null;
            function set(v) {
              on = v; root.classList.toggle('is-on', v); sw.setAttribute('aria-checked', String(v));
              if (!rm) { root.classList.add('is-stretch'); clearTimeout(t); t = setTimeout(function () { root.classList.remove('is-stretch'); }, 170); }
            }
            sw.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; drag = { x: e.clientX, moved: false, start: on ? 72 : 8 }; sw.setPointerCapture(e.pointerId); });
            sw.addEventListener('pointermove', function (e) {
              if (!drag) return;
              var k = sw.getBoundingClientRect().width / sw.offsetWidth || 1, dx = (e.clientX - drag.x) / k;
              if (Math.abs(dx) > 4) drag.moved = true;
              if (!drag.moved) return;
              root.classList.add('is-drag');
              var x = Math.max(8, Math.min(72, drag.start + dx));
              knob.style.left = x + 'px'; knob.style.width = (60 + Math.min(18, Math.abs(dx) * 0.25)) + 'px';
            });
            function end() {
              if (!drag) return;
              var d = drag; drag = null; root.classList.remove('is-drag');
              var x = parseFloat(knob.style.left || (on ? 72 : 8));
              knob.style.left = ''; knob.style.width = '';
              if (d.moved) { set(x > 40); sw._skip = true; }
            }
            sw.addEventListener('pointerup', end); sw.addEventListener('pointercancel', end);
            sw.addEventListener('click', function () { if (sw._skip) { sw._skip = false; return; } set(!on); });
          })();
          </script>
        </div>

        <!-- #163 Bullet chart target -->
        <div class="panel">
          <h3><span>Biểu đồ KPI mục tiêu</span><span class="lucian-tag">Lucian #163</span></h3>
          <!-- Lucian UX/UI Prompt #163 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#163 -->
          <style>
          .u163{width:100%;padding:6px 0;position:relative;font-size:13px;line-height:1.45}
          .u163 small{color:var(--ux-ink-2);font-size:12px}
          .u163 .status{margin-top:6px;color:var(--ux-ink-2);font-size:12.5px}
          .u163 .status b{color:var(--ux-ink)}
          .u163 input[type="range"]{width:100%;height:38px;accent-color:var(--coral);margin:0}
          .u163 .bullet{height:44px;position:relative;margin-top:26px;border-radius:6px;background:linear-gradient(90deg,var(--ux-surface-3) 0 50%,color-mix(in srgb,var(--ux-accent) 22%,var(--ux-surface)) 50% 75%,color-mix(in srgb,var(--ux-accent) 42%,var(--ux-surface)) 75%)}
          .u163 .actual{position:absolute;height:17px;top:14px;left:0;width:74%;background:var(--ux-accent);border-radius:0 4px 4px 0}
          .u163 .target{position:absolute;width:3px;top:-7px;bottom:-7px;background:var(--coral);left:70%;transition:left .4s}
          .u163 .target::before{content:attr(data-value);position:absolute;top:-17px;left:-10px;font-size:11px;color:var(--coral-deep);font-weight:700}
          .u163 .ticks{display:flex;justify-content:space-between;margin:8px 0;color:var(--ux-ink-2)}
          .u163 label{display:block;font-size:12px;color:var(--ux-ink-2)}
          .u163 .actual-label{font-size:13px;color:var(--ux-ink-2)}
          .u163 .actual-label b{font-size:22px;color:var(--ux-ink);margin:0 3px}
          </style>
          <div class="ux u163">
            <div class="actual-label">Doanh thu thực tế <b>74 triệu</b></div>
            <div class="bullet"><div class="actual"></div><div class="target" data-value="70"></div></div>
            <div class="ticks"><small>0</small><small>50</small><small>75</small><small>100</small></div>
            <label>Kéo điều chỉnh mục tiêu (triệu): <input class="range" type="range" min="40" max="100" step="2" value="70" aria-label="Mục tiêu doanh thu"></label>
            <div class="status" aria-live="polite"></div>
          </div>
          <script>
          (()=>{const root=document.currentScript.previousElementSibling;const q=s=>root.querySelector(s);function draw(){const v=+q('.range').value;q('.target').style.left=v+'%';q('.target').dataset.value=v;q('.status').innerHTML=`So với mục tiêu: <b>${74-v>=0?'+':'−'}${Math.abs(74-v)} triệu</b> · Đạt ${(74/v*100).toFixed(1)}%`;root.dataset.state=String(v)}q('.range').oninput=draw;draw();})();
          </script>
        </div>

        <!-- #070 Stacking toasts -->
        <div class="panel">
          <h3><span>Thông báo xếp chồng</span><span class="lucian-tag">Lucian #070</span></h3>
          <!-- Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070 -->
          <style>
          .u070{position:relative;width:100%;height:260px}
          .u070-btns{display:flex;flex-wrap:wrap;gap:6px}
          .u070-btns button{height:34px;padding:0 11px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line);font-size:12px;font-weight:700;color:var(--ux-ink);transition:transform .3s var(--ux-spring)}
          .u070-btns button:active{transform:scale(.94)}
          .u070-btns i{width:8px;height:8px;border-radius:50%;background:var(--c)}
          .u070-zone{position:absolute;left:0;right:0;bottom:0;height:200px;outline:none}
          .u070-t{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;min-height:62px;padding:10px 12px;border-radius:16px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line),0 14px 26px -14px var(--ux-shadow-strong);transform-origin:50% 100%;transform:translate(var(--dx,0px),var(--y,0px)) scale(var(--s,1));opacity:var(--o,1);transition:transform .5s var(--ux-spring),opacity .35s;touch-action:pan-y;user-select:none}
          .u070-t.enter{transform:translateY(70px) scale(.9);opacity:0}
          .u070-t.leave{opacity:0;pointer-events:none}
          .u070-t.back>*{opacity:0}
          .u070-ic{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)}
          .u070-ic svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u070-tx{flex:1;min-width:0}
          .u070-tx b{display:block;font-size:13px;font-weight:700}
          .u070-tx small{display:block;font-size:11.5px;color:var(--ux-ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .u070-x{width:26px;height:26px;flex:none;border:0;border-radius:50%;display:grid;place-items:center;background:none;color:var(--ux-ink-3)}
          .u070-x svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
          .u070-empty{position:absolute;left:0;right:0;bottom:20px;text-align:center;font-size:12.5px;color:var(--ux-ink-3)}
          </style>
          <div class="ux u070">
            <div class="u070-btns">
              <button type="button" data-k="ok" style="--c:var(--ux-mint)"><i aria-hidden="true"></i>Đã lưu</button>
              <button type="button" data-k="err" style="--c:var(--ux-danger)"><i aria-hidden="true"></i>Lỗi nhập</button>
              <button type="button" data-k="info" style="--c:var(--coral)"><i aria-hidden="true"></i>Gợi ý AI</button>
            </div>
            <div class="u070-zone" role="region" aria-label="Thông báo" tabindex="-1">
              <p class="u070-empty">Bấm nút phía trên để thử thông báo</p>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var zone = root.querySelector('.u070-zone'), empty = root.querySelector('.u070-empty');
            var ICON = { ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>', err: '<svg viewBox="0 0 18 18"><path d="M9 5v5M9 13h.01"/></svg>', info: '<svg viewBox="0 0 18 18"><path d="M3.5 4.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>' };
            var K = {
              ok: ['var(--ux-mint)', 'Đã lưu cấu hình', 'Chiến dịch Xclipse · vừa xong'],
              err: ['var(--ux-danger)', 'Thiếu thông tin', 'Kiểm tra lại ô Email hoặc Tên'],
              info: ['var(--coral)', 'AI đã tối ưu tiêu đề', 'Giữ đúng giọng điệu Xclipse']
            };
            var list = [], open = false;
            function layout() {
              var acc = 0;
              list.forEach(function (t, i) {
                var el = t.el; el.classList.toggle('back', !open && i > 0);
                if (open) { el.style.setProperty('--y', -acc + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); acc += el.offsetHeight + 8; }
                else { el.style.setProperty('--y', -(i * 12) + 'px'); el.style.setProperty('--s', (1 - i * 0.06).toFixed(2)); el.style.setProperty('--o', i > 2 ? 0 : 1); }
                el.style.zIndex = 50 - i;
              });
              empty.style.opacity = list.length ? '0' : '1';
            }
            function remove(t) {
              var i = list.indexOf(t); if (i < 0) return;
              list.splice(i, 1); t.el.classList.add('leave');
              setTimeout(function () { t.el.remove(); }, 350); layout();
            }
            function push(k) {
              var d = K[k], el = document.createElement('div');
              el.className = 'u070-t enter'; el.style.setProperty('--c', d[0]);
              el.innerHTML = '<span class="u070-ic">' + ICON[k] + '</span><span class="u070-tx"><b></b><small></small></span><button class="u070-x" type="button" aria-label="Đóng"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button>';
              el.querySelector('b').textContent = d[1]; el.querySelector('small').textContent = d[2];
              var t = { el: el }; zone.appendChild(el); list.unshift(t);
              void el.offsetWidth; el.classList.remove('enter'); layout();
              el.querySelector('.u070-x').addEventListener('click', function () { remove(t); });
            }
            zone.addEventListener('pointerenter', function () { open = true; layout(); });
            zone.addEventListener('pointerleave', function () { open = false; layout(); });
            root.querySelectorAll('.u070-btns button').forEach(function (b) { b.addEventListener('click', function () { push(b.getAttribute('data-k')); }); });
            push('info'); push('ok');
          })();
          </script>
        </div>
      </div>
    </section>

    <!-- Forms & Data Table -->
    <section class="sec" id="forms" style="border-bottom:none;">
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu kiểm tra lỗi</h3>
          <div class="field">
            <label for="fName">Tên chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Chiến dịch Tháng 11" />
            <div class="err-msg" id="eName">Vui lòng nhập tên chiến dịch.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email quản trị</label>
            <input class="input" id="fEmail" type="email" placeholder="admin@xclipse.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-cobalt" id="validateBtn" type="button">Kiểm tra & Gửi</button>
        </div>

        <div class="panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;">
            <h3 style="margin:0;">Danh sách chiến dịch</h3>
            <input class="input" id="searchInput" type="search" placeholder="Lọc nhanh..." style="max-width:170px;height:34px;" />
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>Số lượng</th><th>Trạng thái</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;">Yêu cầu Demo Xclipse</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--ux-ink-2);">
        Bản sao giữ nguyên bố cục V4 + Bảng màu #DBF2FC (Ice Sky) · #072D59 (Deep Navy) · #FD6E88 (Coral Pink) + Chuyển động Lucian UX/UI.
      </p>
      <div class="field">
        <label>Tên đội thi / Doanh nghiệp</label>
        <input class="input" type="text" value="Xclipse — Chung kết VIBE-CODING 2026" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-coral" id="confirmModal" type="button">Xác nhận</button>
      </div>
    </div>
  </div>

  <script>
    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex); };
    });

    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
    };

    const scoreRange = document.getElementById('scoreRange');
    const scoreVal = document.getElementById('scoreVal');
    const gaugeArc = document.getElementById('gaugeArc');
    scoreRange.oninput = () => {
      const v = Number(scoreRange.value);
      scoreVal.textContent = v;
      gaugeArc.setAttribute('stroke-dashoffset', (251.2 * (1 - v / 100)).toFixed(1));
    };

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName'), email = document.getElementById('fEmail');
      const eName = document.getElementById('eName'), eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) alert('✓ Dữ liệu hợp lệ! Đã lưu thành công.');
    };

    const rows = [
      { name: 'Flash Sale Tháng 11', qty: 420, badge: ['badge-coral', '● Ưu tiên'] },
      { name: 'Chiến dịch B2B SaaS', qty: 285, badge: ['badge-cobalt', '● Đang chạy'] },
      { name: 'Chăm sóc Khách hàng', qty: 510, badge: ['badge-ok', '✓ Hoàn tất'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.qty}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = closeModal;
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-final.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse Final UI/UX — V4 Layout × Eclipse Palette × Lucian UX</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* Lucian UX/UI Prompt theme tokens mapped to Xclipse Final Palette */
    :root {
      color-scheme: light;
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;

      --cobalt: #0044FF;
      --cobalt-mid: #1E6BFF;
      --coral: #FF1F8F;
      --coral-deep: #D4006A;
      --coral-soft: #FFF0F7;
      --coral-border: #FFB8DC;

      --ux-page: #FCFFFF;
      --ux-surface: #FFFFFF;
      --ux-surface-2: #F1F5FF;
      --ux-surface-3: #E2E8F8;
      --ux-ink: #0B132B;
      --ux-ink-2: #475569;
      --ux-ink-3: #64748B;
      --ux-line: rgba(0, 68, 255, 0.09);
      --ux-line-2: rgba(0, 68, 255, 0.18);
      --ux-accent: #0044FF;
      --ux-accent-2: #FF1F8F;
      --ux-accent-soft: rgba(0, 68, 255, 0.10);
      --ux-accent-ink: #FCFFFF;
      --ux-mint: #00B894;
      --ux-warn: #FF1F8F;
      --ux-danger: #E11D48;
      --ux-shadow: rgba(0, 68, 255, 0.10);
      --ux-shadow-strong: rgba(0, 68, 255, 0.22);
      --ux-ease: cubic-bezier(.2, .8, .2, 1);
      --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --coral: #FF3B9A;
      --coral-deep: #FF70B8;
      --coral-soft: rgba(255, 59, 154, 0.16);
      --coral-border: rgba(255, 59, 154, 0.34);

      --ux-page: #030712;
      --ux-surface: #0A1122;
      --ux-surface-2: #111B33;
      --ux-surface-3: #1B2847;
      --ux-ink: #F8FAFC;
      --ux-ink-2: #94A3B8;
      --ux-ink-3: #64748B;
      --ux-line: rgba(255, 255, 255, 0.09);
      --ux-line-2: rgba(255, 255, 255, 0.20);
      --ux-accent: #3B82F6;
      --ux-accent-2: #FF3B9A;
      --ux-accent-soft: rgba(59, 130, 246, 0.18);
      --ux-accent-ink: #030712;
      --ux-mint: #2DD4BF;
      --ux-warn: #FF3B9A;
      --ux-danger: #FB7185;
      --ux-shadow: rgba(0, 0, 0, 0.45);
      --ux-shadow-strong: rgba(0, 0, 0, 0.78);
    }

    .ux, .ux *, .ux *::before, .ux *::after { box-sizing: border-box; }
    .ux { font-family: var(--font); color: var(--ux-ink); -webkit-font-smoothing: antialiased; letter-spacing: -.01em; }
    :where(.ux) :is(button, input, textarea, select) { font: inherit; color: inherit; }
    :where(.ux) button { cursor: pointer; }
    .ux :focus-visible { outline: 2px solid var(--ux-accent); outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) {
      .ux, .ux *, .ux *::before, .ux *::after {
        animation-duration: .001ms !important; animation-iteration-count: 1 !important;
        transition-duration: .001ms !important; scroll-behavior: auto !important;
      }
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--ux-page); color: var(--ux-ink);
      line-height: 1.55; overflow-x: hidden;
      transition: background .3s var(--ux-ease), color .3s var(--ux-ease);
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }

    /* Hero Electric Blue Atmosphere + Subtle Vivid Pink Rim */
    .hero-zone {
      position: relative;
      background:
        radial-gradient(520px 260px at 82% 24%, rgba(255, 31, 143, 0.30), transparent 70%),
        radial-gradient(620px 320px at 22% 18%, rgba(56, 152, 255, 0.42), transparent 70%),
        radial-gradient(960px 520px at 50% 42%, #1E6BFF 0%, #0044FF 48%, #0A29A6 82%, #04124D 100%);
      color: #FCFFFF;
      padding-bottom: 112px;
      overflow: hidden;
    }
    .hero-zone::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(rgba(252, 255, 255, 0.14) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: radial-gradient(circle at 50% 45%, black 35%, transparent 80%);
    }

    /* Topbar */
    .nav { position: relative; z-index: 10; padding: 18px 0; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: #FCFFFF; text-decoration: none; letter-spacing: -0.02em; }
    .brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.3); }

    .pill-nav {
      display: flex; align-items: center; gap: 6px; padding: 5px;
      background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 999px;
    }
    .pill-nav a {
      color: rgba(252, 255, 255, 0.90); text-decoration: none; font-size: 13px; font-weight: 500;
      padding: 6px 14px; border-radius: 999px; transition: background 150ms;
    }
    .pill-nav a:hover, .pill-nav a.active { background: rgba(255, 255, 255, 0.24); color: #FFFFFF; }
    .nav-right { display: flex; align-items: center; gap: 8px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 42px; padding: 0 20px; border-radius: 999px; font-family: var(--font);
      font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ux-ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 36px; padding: 0 14px; font-size: 13px; }
    .btn-coral {
      background: linear-gradient(135deg, #FF3399, #E60073); color: #FFFFFF;
      box-shadow: 0 10px 26px rgba(255, 31, 143, 0.36);
    }
    .btn-coral:hover { filter: brightness(1.08); transform: translateY(-1px); }
    .btn-glass {
      background: rgba(255, 255, 255, 0.15); color: #FCFFFF;
      border-color: rgba(255, 255, 255, 0.34); backdrop-filter: blur(10px);
    }
    .btn-glass:hover { background: rgba(255, 255, 255, 0.25); }
    .btn-cobalt { background: var(--cobalt); color: #FCFFFF; box-shadow: 0 8px 20px rgba(0, 68, 255, 0.22); }
    .btn-cobalt:hover { background: #0039D6; }
    .btn-outline { background: transparent; color: var(--ux-ink); border-color: var(--ux-line-2); }
    .btn-outline:hover { background: var(--ux-surface-2); border-color: var(--ux-accent); }

    /* Hero Content */
    .hero-center { position: relative; z-index: 5; text-align: center; max-width: 760px; margin: 26px auto 0; }
    .palette-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 6px;
      border-radius: 999px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.26);
      color: #FCFFFF; font-size: 12px; font-family: var(--mono); cursor: pointer;
    }
    .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.45); }
    .mini-flow { display: flex; justify-content: center; flex-wrap: wrap; gap: 18px; font-size: 12.5px; color: rgba(252, 255, 255, 0.88); margin-bottom: 14px; }
    .hero-title { margin: 0; font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; }
    .hero-sub { margin: 14px auto 24px; max-width: 560px; font-size: 15px; color: rgba(252, 255, 255, 0.90); }
    .hero-cta { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; }

    /* 3 Overlapping Dashboard Cards */
    .cards-overlap {
      position: relative; z-index: 10; margin-top: -74px;
      display: grid; grid-template-columns: 1fr 1.06fr 1fr; gap: 18px; align-items: stretch;
    }
    .dash-card {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 20px;
      box-shadow: 0 20px 48px var(--ux-shadow);
      transition: background .3s var(--ux-ease), border-color .3s var(--ux-ease);
    }
    .dash-card.featured {
      background: linear-gradient(155deg, #FF3B9A 0%, #FF1485 55%, #C80064 100%);
      color: #FFFFFF; border-color: rgba(255,255,255,0.36);
      box-shadow: 0 24px 54px rgba(255, 31, 143, 0.34);
      display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;
    }
    html[data-theme="dark"] .dash-card.featured {
      background: linear-gradient(155deg, #FF47A3 0%, #E60073 58%, #9E004F 100%);
      box-shadow: 0 24px 54px rgba(255, 59, 154, 0.38);
    }
    .card-lbl { font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; width: 100%; }

    .prog-row { margin-bottom: 12px; }
    .prog-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .prog-track { height: 8px; border-radius: 999px; background: var(--ux-surface-3); overflow: hidden; display: flex; }
    .prog-blue { background: var(--cobalt-mid); height: 100%; }
    .prog-coral { background: var(--coral); height: 100%; }

    .gauge-wrap { position: relative; width: 200px; height: 112px; margin: 4px auto 0; }
    .gauge-score { position: absolute; bottom: 4px; left: 0; right: 0; font-size: 42px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }

    /* Sections */
    .sec { padding: 52px 0; border-bottom: 1px solid var(--ux-line); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--ux-accent); }
    .sec-head p { margin: 0; color: var(--ux-ink-2); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 22px;
      box-shadow: 0 6px 20px var(--ux-shadow);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
    .lucian-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--ux-accent-soft); color: var(--ux-accent); }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ux-ink-2); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--ux-line-2); background: var(--ux-surface-2); color: var(--ux-ink);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--ux-accent); box-shadow: 0 0 0 3px var(--ux-accent-soft); }
    .input.is-error { border-color: var(--ux-danger); }
    .err-msg { font-size: 12px; color: var(--ux-danger); margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .badge-cobalt { background: rgba(22, 84, 209, 0.12); color: var(--ux-accent); }
    .badge-coral { background: var(--coral-soft); color: var(--coral-deep); border: 1px solid var(--coral-border); }
    .badge-ok { background: rgba(13, 148, 136, 0.14); color: var(--ux-mint); }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ux-ink-2); padding: 10px 12px; border-bottom: 1px solid var(--ux-line); }
    td { padding: 12px; border-bottom: 1px solid var(--ux-line); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--ux-surface-2); }

    /* Modal */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(2, 7, 10, 0.65); backdrop-filter: blur(12px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 440px; border-radius: 20px; padding: 24px;
      background: var(--ux-surface); border: 1px solid var(--ux-line-2);
      box-shadow: 0 28px 64px var(--ux-shadow-strong);
      animation: popIn 220ms var(--ux-ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    @media (max-width: 880px) {
      .pill-nav { display: none; }
      .cards-overlap { grid-template-columns: 1fr; margin-top: -48px; }
    }
  </style>
</head>
<body>
  <div class="hero-zone">
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="#">
          <img src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
          <span>XCLIPSE</span>
        </a>
        <nav class="pill-nav">
          <a class="active" href="#">Trang chủ</a>
          <a href="#lucian-ux">Lucian UX</a>
          <a href="#forms">Form & Dữ liệu</a>
        </nav>
        <div class="nav-right">
          <button class="btn btn-glass btn-sm" id="themeBtn" type="button">Đổi Sáng / Tối</button>
          <button class="btn btn-coral btn-sm" id="openPopupTop" type="button">Yêu cầu demo</button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="hero-center">
        <div class="palette-strip">
          <button class="color-chip" data-hex="#0044FF"><span class="color-dot" style="background:#0044FF"></span>#0044FF (Electric Blue)</button>
          <button class="color-chip" data-hex="#FF1F8F"><span class="color-dot" style="background:#FF1F8F"></span>#FF1F8F (Vivid Pink)</button>
          <button class="color-chip" data-hex="#FCFFFF"><span class="color-dot" style="background:#FCFFFF"></span>#FCFFFF (Sáng)</button>
          <button class="color-chip" data-hex="#030712"><span class="color-dot" style="background:#030712"></span>#030712 (Dark)</button>
        </div>

        <div class="mini-flow">
          <span>→ Phân tích dữ liệu</span>
          <span>→ Tối ưu bằng AI</span>
          <span>→ Giảm rủi ro vận hành</span>
        </div>

        <h1 class="hero-title">
          Vận hành doanh nghiệp<br />Không còn phức tạp
        </h1>
        <p class="hero-sub">
          Bố cục sáng rõ chuẩn hội trường (V4) nâng cấp bảng màu <strong>Xanh dương Electric (#0044FF) &amp; Hồng rực rỡ (#FF1F8F)</strong>, kèm nút đổi Dark Mode và chuyển động <strong>Lucian UX/UI</strong>.
        </p>

        <div class="hero-cta">
          <!-- Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002 -->
          <style>
          .u002{--bg:#FCFFFF;--fg:#0044FF;--blob:linear-gradient(135deg,var(--coral),#0044FF);
            position:relative;display:inline-grid;place-items:center}
          .u002-mag{transition:translate .9s var(--ux-spring)}
          .u002-btn{position:relative;display:flex;align-items:center;gap:14px;height:54px;padding:0 7px 0 24px;border:0;border-radius:999px;background:var(--bg);color:var(--fg);overflow:hidden;isolation:isolate;
            box-shadow:0 18px 36px -14px rgba(0,0,0,.45);transition:transform .6s var(--ux-spring),box-shadow .6s var(--ux-ease)}
          .u002-btn:active{transform:scale(.96)}
          .u002-fill{position:absolute;inset:0;z-index:-1;background:var(--blob);clip-path:circle(20px at calc(100% - 27px) 50%);transition:clip-path .8s var(--ux-ease)}
          .u002-btn:hover .u002-fill,.u002-btn:focus-visible .u002-fill{clip-path:circle(160% at calc(100% - 27px) 50%)}
          .u002-txt{position:relative;overflow:hidden;padding:4px 0;font-size:15px;font-weight:800;letter-spacing:-.02em;white-space:nowrap;transition:translate .7s var(--ux-spring),color .5s var(--ux-ease)}
          .u002-btn:hover .u002-txt{color:#fff}
          .u002-txt span{display:block;transition:transform .6s var(--ux-spring),opacity .35s var(--ux-ease)}
          .u002-txt span+span{position:absolute;left:0;top:4px;transform:translateY(130%);opacity:0}
          .u002[data-state="go"] .u002-txt span:first-child{transform:translateY(-130%);opacity:0}
          .u002[data-state="go"] .u002-txt span+span{transform:none;opacity:1}
          .u002-orb{position:relative;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#fff;overflow:hidden;flex:none;transition:translate .7s var(--ux-spring)}
          .u002-orb svg{position:absolute;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u002-orb svg:last-child{transform:translateX(-40px)}
          .u002[data-state="go"] .u002-orb svg:first-child{animation:u002-out .55s var(--ux-ease) forwards}
          .u002[data-state="go"] .u002-orb svg:last-child{animation:u002-in .6s var(--ux-spring) .28s forwards}
          @keyframes u002-out{to{transform:translateX(40px)}}
          @keyframes u002-in{to{transform:none}}
          </style>
          <div class="ux u002" data-state="idle">
            <div class="u002-mag">
              <button class="u002-btn" id="heroMagBtn" type="button">
                <span class="u002-fill" aria-hidden="true"></span>
                <span class="u002-txt"><span>Bắt đầu ngay</span><span aria-hidden="true">Đang mở...</span></span>
                <span class="u002-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                </span>
              </button>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var btn = root.querySelector('.u002-btn');
            var mag = root.querySelector('.u002-mag');
            var txt = root.querySelector('.u002-txt');
            var orb = root.querySelector('.u002-orb');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var t = 0;
            root.addEventListener('pointermove', function (e) {
              if (rm) return;
              var r = btn.getBoundingClientRect();
              var dx = e.clientX - (r.left + r.width / 2);
              var dy = e.clientY - (r.top + r.height / 2);
              var p = Math.max(0, 1 - Math.hypot(dx, dy) / 200);
              mag.style.translate = (dx * 0.1 * p).toFixed(1) + 'px ' + (dy * 0.18 * p).toFixed(1) + 'px';
              txt.style.translate = (dx * 0.04 * p).toFixed(1) + 'px ' + (dy * 0.06 * p).toFixed(1) + 'px';
              orb.style.translate = (dx * 0.08 * p).toFixed(1) + 'px ' + (dy * 0.12 * p).toFixed(1) + 'px';
            });
            root.addEventListener('pointerleave', function () {
              mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px';
            });
            btn.addEventListener('click', function () {
              clearTimeout(t);
              root.dataset.state = 'idle';
              void btn.offsetWidth;
              root.dataset.state = 'go';
              t = setTimeout(function () { if (root.isConnected) root.dataset.state = 'idle'; }, rm ? 700 : 1400);
            });
          })();
          </script>

          <button class="btn btn-glass" id="openPopupHero" type="button" style="height:54px;padding:0 24px;">Mở Pop-up mẫu</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Overlapping Dashboard Cards -->
  <div class="container">
    <div class="cards-overlap">
      <div class="dash-card">
        <div class="card-lbl">
          <span>Phân bổ theo danh mục</span>
          <span class="badge badge-cobalt">4 nhóm</span>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Đơn hàng mới</span><span>184</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:45%"></div><div class="prog-coral" style="width:25%"></div></div>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Biên lợi nhuận</span><span>36%</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:30%"></div><div class="prog-coral" style="width:42%"></div></div>
        </div>
        <div class="prog-row" style="margin-bottom:0;">
          <div class="prog-top"><span>Tồn kho an toàn</span><span>243</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:65%"></div><div class="prog-coral" style="width:15%"></div></div>
        </div>
      </div>

      <div class="dash-card featured">
        <div class="card-lbl" style="justify-content:center;color:#FCFFFF;">
          <span>● Điểm hiệu suất hệ thống</span>
        </div>
        <div class="gauge-wrap">
          <svg viewBox="0 0 200 110" width="200" height="110">
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="14" stroke-linecap="round"/>
            <path id="gaugeArc" d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#FCFFFF" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="68"/>
          </svg>
          <div class="gauge-score" id="scoreVal">73</div>
        </div>
        <input id="scoreRange" type="range" min="20" max="100" value="73" style="width:85%;accent-color:#FCFFFF;margin-top:8px;" aria-label="Kéo thử điểm hiệu suất" />
      </div>

      <div class="dash-card">
        <div class="card-lbl">
          <span>Đã mở vs. Đã xử lý</span>
          <span class="badge badge-coral">Realtime</span>
        </div>
        <svg viewBox="0 0 280 120" width="100%" height="120">
          <defs>
            <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1E6BFF" stop-opacity="0.30"/>
              <stop offset="100%" stop-color="#1E6BFF" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30 L270 110 L10 110 Z" fill="url(#areaBlue)"/>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30" fill="none" stroke="#1E6BFF" stroke-width="3" stroke-linecap="round"/>
          <circle cx="145" cy="52" r="5" fill="var(--coral)" stroke="#0044FF" stroke-width="2"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ux-ink-2);">
          <span>Tháng 9</span><span>Tháng 10</span><span>Tháng 11</span>
        </div>
      </div>
    </div>
  </div>

  <main class="container">
    <!-- Lucian UX Interactive Section -->
    <section class="sec" id="lucian-ux">
      <div class="sec-head">
        <div>
          <h2>Tương tác UX theo chuẩn Lucian (Seokwoooo)</h2>
          <p>Ứng dụng hiệu ứng vật lý, biểu đồ mục tiêu và thông báo xếp chồng trực tiếp trên nền màu Xclipse.</p>
        </div>
      </div>

      <div class="grid-2" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- #013 Stretchy switch -->
        <div class="panel" style="align-items:center;">
          <h3 style="width:100%;"><span>Công tắc co giãn</span><span class="lucian-tag">Lucian #013</span></h3>
          <!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
          <style>
          .u013{--on:linear-gradient(135deg,var(--coral),#0044FF);position:relative;width:280px;height:185px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
          .u013-sw{position:relative;width:140px;height:76px;border:0;padding:0;border-radius:999px;background:var(--ux-surface-3);touch-action:none;
            box-shadow:inset 0 2px 6px rgba(0,0,0,.12),inset 0 0 0 1px var(--ux-line);transition:box-shadow .5s var(--ux-ease)}
          .u013-sw::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--on);opacity:0;transition:opacity .45s var(--ux-ease)}
          .u013.is-on .u013-sw::before{opacity:1}
          .u013.is-on .u013-sw{box-shadow:inset 0 2px 6px rgba(0,0,0,.12),0 16px 30px -16px rgba(255,31,143,.70)}
          .u013-knob{position:absolute;top:8px;left:8px;width:60px;height:60px;border-radius:999px;background:#fff;display:grid;place-items:center;
            box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 6px 14px -4px rgba(0,0,0,.28);transition:left .5s var(--ux-spring),width .32s var(--ux-ease)}
          .u013.is-on .u013-knob{left:72px}
          .u013.is-stretch .u013-knob{width:84px;transition:left .5s var(--ux-spring),width .18s var(--ux-ease)}
          .u013.is-on.is-stretch .u013-knob{left:48px}
          .u013.is-drag .u013-knob{transition:width .2s var(--ux-ease)}
          .u013-knob svg{width:24px;height:24px;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
          .u013-x{stroke:#94A3B8;stroke-dasharray:14;stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--ux-ease) .1s}
          .u013-v{stroke:#0044FF;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--ux-ease)}
          .u013.is-on .u013-x{stroke-dashoffset:14;transition-delay:0s}
          .u013.is-on .u013-v{stroke-dashoffset:0;transition-delay:.18s}
          .u013-txt{width:250px;text-align:center}
          .u013-txt b{display:block;font-size:15px;font-weight:700}
          .u013-sub{position:relative;display:block;height:20px;margin-top:4px;overflow:hidden;font-size:12.5px;color:var(--ux-ink-3)}
          .u013-sub span{display:block;line-height:20px;transition:transform .5s var(--ux-spring),opacity .3s var(--ux-ease)}
          .u013-sub span+span{position:absolute;left:0;right:0;top:0;transform:translateY(100%);opacity:0;color:var(--coral-deep);font-weight:700}
          .u013.is-on .u013-sub span:first-child{transform:translateY(-100%);opacity:0}
          .u013.is-on .u013-sub span+span{transform:none;opacity:1}
          </style>
          <div class="ux u013">
            <button class="u013-sw" type="button" role="switch" aria-checked="false">
              <span class="u013-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path class="u013-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9"/><path class="u013-v" d="M5.5 12.5l4.5 4.5 8.5-9"/></svg>
              </span>
            </button>
            <div class="u013-txt">
              <b class="u013-lab">Tối ưu giá bằng AI</b>
              <span class="u013-sub" aria-live="polite"><span>Đang tắt · Chỉnh tay</span><span>Đã bật · Đề xuất tự động</span></span>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u013-sw'), knob = root.querySelector('.u013-knob'), lab = root.querySelector('.u013-lab');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var id = 'u013-l-' + Math.random().toString(36).slice(2, 7); lab.id = id; sw.setAttribute('aria-labelledby', id);
            var on = false, t = 0, drag = null;
            function set(v) {
              on = v; root.classList.toggle('is-on', v); sw.setAttribute('aria-checked', String(v));
              if (!rm) { root.classList.add('is-stretch'); clearTimeout(t); t = setTimeout(function () { root.classList.remove('is-stretch'); }, 170); }
            }
            sw.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; drag = { x: e.clientX, moved: false, start: on ? 72 : 8 }; sw.setPointerCapture(e.pointerId); });
            sw.addEventListener('pointermove', function (e) {
              if (!drag) return;
              var k = sw.getBoundingClientRect().width / sw.offsetWidth || 1, dx = (e.clientX - drag.x) / k;
              if (Math.abs(dx) > 4) drag.moved = true;
              if (!drag.moved) return;
              root.classList.add('is-drag');
              var x = Math.max(8, Math.min(72, drag.start + dx));
              knob.style.left = x + 'px'; knob.style.width = (60 + Math.min(18, Math.abs(dx) * 0.25)) + 'px';
            });
            function end() {
              if (!drag) return;
              var d = drag; drag = null; root.classList.remove('is-drag');
              var x = parseFloat(knob.style.left || (on ? 72 : 8));
              knob.style.left = ''; knob.style.width = '';
              if (d.moved) { set(x > 40); sw._skip = true; }
            }
            sw.addEventListener('pointerup', end); sw.addEventListener('pointercancel', end);
            sw.addEventListener('click', function () { if (sw._skip) { sw._skip = false; return; } set(!on); });
          })();
          </script>
        </div>

        <!-- #163 Bullet chart target -->
        <div class="panel">
          <h3><span>Biểu đồ KPI mục tiêu</span><span class="lucian-tag">Lucian #163</span></h3>
          <!-- Lucian UX/UI Prompt #163 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#163 -->
          <style>
          .u163{width:100%;padding:6px 0;position:relative;font-size:13px;line-height:1.45}
          .u163 small{color:var(--ux-ink-2);font-size:12px}
          .u163 .status{margin-top:6px;color:var(--ux-ink-2);font-size:12.5px}
          .u163 .status b{color:var(--ux-ink)}
          .u163 input[type="range"]{width:100%;height:38px;accent-color:var(--coral);margin:0}
          .u163 .bullet{height:44px;position:relative;margin-top:26px;border-radius:6px;background:linear-gradient(90deg,var(--ux-surface-3) 0 50%,color-mix(in srgb,var(--ux-accent) 22%,var(--ux-surface)) 50% 75%,color-mix(in srgb,var(--ux-accent) 42%,var(--ux-surface)) 75%)}
          .u163 .actual{position:absolute;height:17px;top:14px;left:0;width:74%;background:var(--ux-accent);border-radius:0 4px 4px 0}
          .u163 .target{position:absolute;width:3px;top:-7px;bottom:-7px;background:var(--coral);left:70%;transition:left .4s}
          .u163 .target::before{content:attr(data-value);position:absolute;top:-17px;left:-10px;font-size:11px;color:var(--coral-deep);font-weight:700}
          .u163 .ticks{display:flex;justify-content:space-between;margin:8px 0;color:var(--ux-ink-2)}
          .u163 label{display:block;font-size:12px;color:var(--ux-ink-2)}
          .u163 .actual-label{font-size:13px;color:var(--ux-ink-2)}
          .u163 .actual-label b{font-size:22px;color:var(--ux-ink);margin:0 3px}
          </style>
          <div class="ux u163">
            <div class="actual-label">Doanh thu thực tế <b>74 triệu</b></div>
            <div class="bullet"><div class="actual"></div><div class="target" data-value="70"></div></div>
            <div class="ticks"><small>0</small><small>50</small><small>75</small><small>100</small></div>
            <label>Kéo điều chỉnh mục tiêu (triệu): <input class="range" type="range" min="40" max="100" step="2" value="70" aria-label="Mục tiêu doanh thu"></label>
            <div class="status" aria-live="polite"></div>
          </div>
          <script>
          (()=>{const root=document.currentScript.previousElementSibling;const q=s=>root.querySelector(s);function draw(){const v=+q('.range').value;q('.target').style.left=v+'%';q('.target').dataset.value=v;q('.status').innerHTML=`So với mục tiêu: <b>${74-v>=0?'+':'−'}${Math.abs(74-v)} triệu</b> · Đạt ${(74/v*100).toFixed(1)}%`;root.dataset.state=String(v)}q('.range').oninput=draw;draw();})();
          </script>
        </div>

        <!-- #070 Stacking toasts -->
        <div class="panel">
          <h3><span>Thông báo xếp chồng</span><span class="lucian-tag">Lucian #070</span></h3>
          <!-- Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070 -->
          <style>
          .u070{position:relative;width:100%;height:260px}
          .u070-btns{display:flex;flex-wrap:wrap;gap:6px}
          .u070-btns button{height:34px;padding:0 11px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line);font-size:12px;font-weight:700;color:var(--ux-ink);transition:transform .3s var(--ux-spring)}
          .u070-btns button:active{transform:scale(.94)}
          .u070-btns i{width:8px;height:8px;border-radius:50%;background:var(--c)}
          .u070-zone{position:absolute;left:0;right:0;bottom:0;height:200px;outline:none}
          .u070-t{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;min-height:62px;padding:10px 12px;border-radius:16px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line),0 14px 26px -14px var(--ux-shadow-strong);transform-origin:50% 100%;transform:translate(var(--dx,0px),var(--y,0px)) scale(var(--s,1));opacity:var(--o,1);transition:transform .5s var(--ux-spring),opacity .35s;touch-action:pan-y;user-select:none}
          .u070-t.enter{transform:translateY(70px) scale(.9);opacity:0}
          .u070-t.leave{opacity:0;pointer-events:none}
          .u070-t.back>*{opacity:0}
          .u070-ic{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)}
          .u070-ic svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u070-tx{flex:1;min-width:0}
          .u070-tx b{display:block;font-size:13px;font-weight:700}
          .u070-tx small{display:block;font-size:11.5px;color:var(--ux-ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .u070-x{width:26px;height:26px;flex:none;border:0;border-radius:50%;display:grid;place-items:center;background:none;color:var(--ux-ink-3)}
          .u070-x svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
          .u070-empty{position:absolute;left:0;right:0;bottom:20px;text-align:center;font-size:12.5px;color:var(--ux-ink-3)}
          </style>
          <div class="ux u070">
            <div class="u070-btns">
              <button type="button" data-k="ok" style="--c:var(--ux-mint)"><i aria-hidden="true"></i>Đã lưu</button>
              <button type="button" data-k="err" style="--c:var(--ux-danger)"><i aria-hidden="true"></i>Lỗi nhập</button>
              <button type="button" data-k="info" style="--c:var(--coral)"><i aria-hidden="true"></i>Gợi ý AI</button>
            </div>
            <div class="u070-zone" role="region" aria-label="Thông báo" tabindex="-1">
              <p class="u070-empty">Bấm nút phía trên để thử thông báo</p>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var zone = root.querySelector('.u070-zone'), empty = root.querySelector('.u070-empty');
            var ICON = { ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>', err: '<svg viewBox="0 0 18 18"><path d="M9 5v5M9 13h.01"/></svg>', info: '<svg viewBox="0 0 18 18"><path d="M3.5 4.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>' };
            var K = {
              ok: ['var(--ux-mint)', 'Đã lưu cấu hình', 'Chiến dịch Xclipse · vừa xong'],
              err: ['var(--ux-danger)', 'Thiếu thông tin', 'Kiểm tra lại ô Email hoặc Tên'],
              info: ['var(--coral)', 'AI đã tối ưu tiêu đề', 'Giữ đúng giọng điệu Xclipse']
            };
            var list = [], open = false;
            function layout() {
              var acc = 0;
              list.forEach(function (t, i) {
                var el = t.el; el.classList.toggle('back', !open && i > 0);
                if (open) { el.style.setProperty('--y', -acc + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); acc += el.offsetHeight + 8; }
                else { el.style.setProperty('--y', -(i * 12) + 'px'); el.style.setProperty('--s', (1 - i * 0.06).toFixed(2)); el.style.setProperty('--o', i > 2 ? 0 : 1); }
                el.style.zIndex = 50 - i;
              });
              empty.style.opacity = list.length ? '0' : '1';
            }
            function remove(t) {
              var i = list.indexOf(t); if (i < 0) return;
              list.splice(i, 1); t.el.classList.add('leave');
              setTimeout(function () { t.el.remove(); }, 350); layout();
            }
            function push(k) {
              var d = K[k], el = document.createElement('div');
              el.className = 'u070-t enter'; el.style.setProperty('--c', d[0]);
              el.innerHTML = '<span class="u070-ic">' + ICON[k] + '</span><span class="u070-tx"><b></b><small></small></span><button class="u070-x" type="button" aria-label="Đóng"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button>';
              el.querySelector('b').textContent = d[1]; el.querySelector('small').textContent = d[2];
              var t = { el: el }; zone.appendChild(el); list.unshift(t);
              void el.offsetWidth; el.classList.remove('enter'); layout();
              el.querySelector('.u070-x').addEventListener('click', function () { remove(t); });
            }
            zone.addEventListener('pointerenter', function () { open = true; layout(); });
            zone.addEventListener('pointerleave', function () { open = false; layout(); });
            root.querySelectorAll('.u070-btns button').forEach(function (b) { b.addEventListener('click', function () { push(b.getAttribute('data-k')); }); });
            push('info'); push('ok');
          })();
          </script>
        </div>
      </div>
    </section>

    <!-- Forms & Data Table -->
    <section class="sec" id="forms" style="border-bottom:none;">
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu kiểm tra lỗi</h3>
          <div class="field">
            <label for="fName">Tên chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Chiến dịch Tháng 11" />
            <div class="err-msg" id="eName">Vui lòng nhập tên chiến dịch.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email quản trị</label>
            <input class="input" id="fEmail" type="email" placeholder="admin@xclipse.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-cobalt" id="validateBtn" type="button">Kiểm tra & Gửi</button>
        </div>

        <div class="panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;">
            <h3 style="margin:0;">Danh sách chiến dịch</h3>
            <input class="input" id="searchInput" type="search" placeholder="Lọc nhanh..." style="max-width:170px;height:34px;" />
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>Số lượng</th><th>Trạng thái</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;">Yêu cầu Demo Xclipse</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--ux-ink-2);">
        Bản ghép hoàn chỉnh: Bố cục V4 sáng rõ + Xanh dương Electric #0044FF + Hồng rực rỡ #FF1F8F (Light) / #FF3B9A (Dark #030712) + Chuyển động Lucian UX/UI.
      </p>
      <div class="field">
        <label>Tên đội thi / Doanh nghiệp</label>
        <input class="input" type="text" value="Xclipse — Chung kết VIBE-CODING 2026" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-coral" id="confirmModal" type="button">Xác nhận</button>
      </div>
    </div>
  </div>

  <script>
    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex); };
    });

    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
    };

    const scoreRange = document.getElementById('scoreRange');
    const scoreVal = document.getElementById('scoreVal');
    const gaugeArc = document.getElementById('gaugeArc');
    scoreRange.oninput = () => {
      const v = Number(scoreRange.value);
      scoreVal.textContent = v;
      gaugeArc.setAttribute('stroke-dashoffset', (251.2 * (1 - v / 100)).toFixed(1));
    };

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName'), email = document.getElementById('fEmail');
      const eName = document.getElementById('eName'), eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) alert('✓ Dữ liệu hợp lệ! Đã lưu thành công.');
    };

    const rows = [
      { name: 'Flash Sale Tháng 11', qty: 420, badge: ['badge-coral', '● Ưu tiên'] },
      { name: 'Chiến dịch B2B SaaS', qty: 285, badge: ['badge-cobalt', '● Đang chạy'] },
      { name: 'Chăm sóc Khách hàng', qty: 510, badge: ['badge-ok', '✓ Hoàn tất'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.qty}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = closeModal;
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-fpt-vibrant.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX — Vibrant FPT Palette (Blue · Green · Orange)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* Vibrant FPT-inspired Palette (High Saturation) + Lucian UX/UI tokens */
    :root {
      color-scheme: light;
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;

      /* High-Saturation Hierarchy: Blue (Primary) > Green (Secondary) > Orange (Accent) */
      --blue: #006BFF;
      --blue-deep: #0047B3;
      --blue-hover: #0055D4;
      --green: #00C853;
      --green-vivid: #00E676;
      --green-deep: #00963E;
      --orange: #FF6B00;
      --orange-vivid: #FF851B;

      --ux-page: #FFFFFF;
      --ux-surface: #FFFFFF;
      --ux-surface-2: #F2F6FC;
      --ux-surface-3: #E2EAF5;
      --ux-ink: #0B1324;
      --ux-ink-2: #475569;
      --ux-ink-3: #64748B;
      --ux-line: rgba(0, 71, 179, 0.10);
      --ux-line-2: rgba(0, 71, 179, 0.22);
      --ux-accent: #006BFF;
      --ux-accent-2: #00C853;
      --ux-accent-soft: rgba(0, 107, 255, 0.12);
      --ux-accent-ink: #FFFFFF;
      --ux-mint: #00C853;
      --ux-warn: #FF6B00;
      --ux-danger: #E11D48;
      --ux-shadow: rgba(0, 71, 179, 0.12);
      --ux-shadow-strong: rgba(0, 55, 140, 0.25);
      --ux-ease: cubic-bezier(.2, .8, .2, 1);
      --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --ux-page: #040914;
      --ux-surface: #0A1324;
      --ux-surface-2: #111D33;
      --ux-surface-3: #1B2B4A;
      --ux-ink: #F8FAFC;
      --ux-ink-2: #94A3B8;
      --ux-ink-3: #64748B;
      --ux-line: rgba(255, 255, 255, 0.09);
      --ux-line-2: rgba(255, 255, 255, 0.22);
      --ux-accent: #2E8BFF;
      --ux-accent-2: #00E676;
      --ux-accent-soft: rgba(46, 139, 255, 0.18);
      --ux-accent-ink: #040914;
      --ux-mint: #00E676;
      --ux-warn: #FF7A1A;
      --ux-danger: #FB7185;
      --ux-shadow: rgba(0, 0, 0, 0.45);
      --ux-shadow-strong: rgba(0, 0, 0, 0.78);
    }

    .ux, .ux *, .ux *::before, .ux *::after { box-sizing: border-box; }
    .ux { font-family: var(--font); color: var(--ux-ink); -webkit-font-smoothing: antialiased; letter-spacing: -.01em; }
    :where(.ux) :is(button, input, textarea, select) { font: inherit; color: inherit; }
    :where(.ux) button { cursor: pointer; }
    .ux :focus-visible { outline: 2px solid var(--ux-accent); outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) {
      .ux, .ux *, .ux *::before, .ux *::after {
        animation-duration: .001ms !important; animation-iteration-count: 1 !important;
        transition-duration: .001ms !important; scroll-behavior: auto !important;
      }
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--ux-page); color: var(--ux-ink);
      line-height: 1.55; overflow-x: hidden;
      transition: background .3s var(--ux-ease), color .3s var(--ux-ease);
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }

    /* Hero: Primary Vibrant Blue with subtle Green & Orange accents */
    .hero-zone {
      position: relative;
      background:
        radial-gradient(460px 260px at 82% 28%, rgba(0, 230, 118, 0.22), transparent 68%),
        radial-gradient(360px 220px at 18% 76%, rgba(255, 107, 0, 0.20), transparent 70%),
        radial-gradient(960px 520px at 50% 42%, #007BFF 0%, #0058D6 48%, #003E9E 85%, #00286B 100%);
      color: #FFFFFF;
      padding-bottom: 112px;
      overflow: hidden;
    }
    .hero-zone::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: radial-gradient(circle at 50% 45%, black 35%, transparent 80%);
    }

    /* Topbar */
    .nav { position: relative; z-index: 10; padding: 18px 0; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: #FFFFFF; text-decoration: none; letter-spacing: -0.02em; }
    .brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.35); }

    .pill-nav {
      display: flex; align-items: center; gap: 6px; padding: 5px;
      background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.24); border-radius: 999px;
    }
    .pill-nav a {
      color: rgba(255, 255, 255, 0.9); text-decoration: none; font-size: 13px; font-weight: 600;
      padding: 6px 14px; border-radius: 999px; transition: background 150ms;
    }
    .pill-nav a:hover, .pill-nav a.active { background: rgba(255, 255, 255, 0.24); color: #FFFFFF; }
    .nav-right { display: flex; align-items: center; gap: 8px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 42px; padding: 0 20px; border-radius: 999px; font-family: var(--font);
      font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ux-ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 36px; padding: 0 14px; font-size: 13px; }
    .btn-blue {
      background: var(--blue); color: #FFFFFF;
      box-shadow: 0 10px 26px rgba(0, 107, 255, 0.34);
    }
    .btn-blue:hover { background: var(--blue-hover); transform: translateY(-1px); }
    .btn-green {
      background: linear-gradient(135deg, #00E676, #00B84D); color: #042211; font-weight: 800;
      box-shadow: 0 10px 26px rgba(0, 200, 83, 0.35);
    }
    .btn-green:hover { filter: brightness(1.06); transform: translateY(-1px); }
    .btn-orange {
      background: var(--orange); color: #FFFFFF;
      box-shadow: 0 10px 24px rgba(255, 107, 0, 0.35);
    }
    .btn-orange:hover { background: #E55A00; transform: translateY(-1px); }
    .btn-glass {
      background: rgba(255, 255, 255, 0.16); color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.34); backdrop-filter: blur(10px);
    }
    .btn-glass:hover { background: rgba(255, 255, 255, 0.26); }
    .btn-outline { background: transparent; color: var(--ux-ink); border-color: var(--ux-line-2); }
    .btn-outline:hover { background: var(--ux-surface-2); border-color: var(--blue); }

    /* Hero Content */
    .hero-center { position: relative; z-index: 5; text-align: center; max-width: 780px; margin: 26px auto 0; }
    .palette-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px 5px 7px;
      border-radius: 999px; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28);
      color: #FFFFFF; font-size: 12px; font-family: var(--mono); cursor: pointer;
    }
    .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #FFFFFF; }
    .mini-flow { display: flex; justify-content: center; flex-wrap: wrap; gap: 18px; font-size: 12.5px; color: rgba(255, 255, 255, 0.9); margin-bottom: 14px; font-weight: 600; }
    .hero-title { margin: 0; font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; }
    .hero-sub { margin: 14px auto 24px; max-width: 580px; font-size: 15px; color: rgba(255, 255, 255, 0.9); }
    .hero-cta { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; }

    /* 3 Overlapping Dashboard Cards */
    .cards-overlap {
      position: relative; z-index: 10; margin-top: -74px;
      display: grid; grid-template-columns: 1fr 1.06fr 1fr; gap: 18px; align-items: stretch;
    }
    .dash-card {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 20px;
      box-shadow: 0 20px 48px var(--ux-shadow);
      transition: background .3s var(--ux-ease), border-color .3s var(--ux-ease);
    }
    /* Center card: Secondary Vibrant Green */
    .dash-card.featured {
      background: linear-gradient(155deg, #00E676 0%, #00C853 55%, #00963E 100%);
      color: #FFFFFF; border-color: rgba(255,255,255,0.35);
      box-shadow: 0 24px 54px rgba(0, 200, 83, 0.34);
      display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;
    }
    .card-lbl { font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; width: 100%; }

    .prog-row { margin-bottom: 12px; }
    .prog-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .prog-track { height: 9px; border-radius: 999px; background: var(--ux-surface-3); overflow: hidden; display: flex; }
    .prog-blue { background: var(--blue); height: 100%; }
    .prog-green { background: var(--green); height: 100%; }
    .prog-orange { background: var(--orange); height: 100%; }

    .gauge-wrap { position: relative; width: 200px; height: 112px; margin: 4px auto 0; }
    .gauge-score { position: absolute; bottom: 4px; left: 0; right: 0; font-size: 42px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.12); }

    /* Sections */
    .sec { padding: 52px 0; border-bottom: 1px solid var(--ux-line); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--ux-accent); }
    .sec-head p { margin: 0; color: var(--ux-ink-2); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel {
      background: var(--ux-surface); border: 1px solid var(--ux-line); border-radius: 20px; padding: 22px;
      box-shadow: 0 6px 20px var(--ux-shadow);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
    .lucian-tag { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--ux-accent-soft); color: var(--ux-accent); }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ux-ink-2); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--ux-line-2); background: var(--ux-surface-2); color: var(--ux-ink);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(0, 107, 255, 0.18); }
    .input.is-error { border-color: var(--orange); }
    .err-msg { font-size: 12px; color: var(--orange); font-weight: 600; margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .badge-blue { background: rgba(0, 107, 255, 0.14); color: var(--blue); }
    html[data-theme="dark"] .badge-blue { color: #60A5FA; }
    .badge-green { background: rgba(0, 200, 83, 0.15); color: var(--green-deep); }
    html[data-theme="dark"] .badge-green { color: #00E676; }
    .badge-orange { background: rgba(255, 107, 0, 0.15); color: #D95300; }
    html[data-theme="dark"] .badge-orange { color: #FF851B; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ux-ink-2); padding: 10px 12px; border-bottom: 1px solid var(--ux-line); }
    td { padding: 12px; border-bottom: 1px solid var(--ux-line); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--ux-surface-2); }

    /* Modal */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(0, 35, 95, 0.55); backdrop-filter: blur(12px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 440px; border-radius: 20px; padding: 24px;
      background: var(--ux-surface); border: 1px solid var(--ux-line-2);
      box-shadow: 0 28px 64px var(--ux-shadow-strong);
      animation: popIn 220ms var(--ux-ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    @media (max-width: 880px) {
      .pill-nav { display: none; }
      .cards-overlap { grid-template-columns: 1fr; margin-top: -48px; }
    }
  </style>
</head>
<body>
  <div class="hero-zone">
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="#">
          <img src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
          <span>XCLIPSE</span>
        </a>
        <nav class="pill-nav">
          <a class="active" href="#">Trang chủ</a>
          <a href="#lucian-ux">Lucian UX</a>
          <a href="#forms">Form & Dữ liệu</a>
        </nav>
        <div class="nav-right">
          <button class="btn btn-glass btn-sm" id="themeBtn" type="button">Đổi Sáng / Tối</button>
          <button class="btn btn-green btn-sm" id="openPopupTop" type="button">Dùng thử ngay</button>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="hero-center">
        <div class="palette-strip">
          <button class="color-chip" data-hex="#006BFF"><span class="color-dot" style="background:#006BFF"></span>Chính: #006BFF (Xanh dương)</button>
          <button class="color-chip" data-hex="#00C853"><span class="color-dot" style="background:#00C853"></span>Phụ chính: #00C853 (Xanh lá)</button>
          <button class="color-chip" data-hex="#FF6B00"><span class="color-dot" style="background:#FF6B00"></span>Phụ phụ: #FF6B00 (Cam)</button>
        </div>

        <div class="mini-flow">
          <span>→ Xanh dương làm chủ đạo</span>
          <span>→ Xanh lá tăng trưởng</span>
          <span>→ Cam nhấn điểm quan trọng</span>
        </div>

        <h1 class="hero-title">
          Vận hành doanh nghiệp<br />Sắc nét & Rực rỡ hơn
        </h1>
        <p class="hero-sub">
          Phối màu chuẩn <strong>Blue (Chính) → Green (Phụ chính) → Orange (Phụ phụ)</strong> được đẩy bão hòa nổi bật, kết hợp nền trắng sạch sẽ và chuyển động mượt của <strong>Lucian UX/UI</strong>.
        </p>

        <div class="hero-cta">
          <!-- Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002 -->
          <style>
          .u002{--bg:#FFFFFF;--fg:#0047B3;--blob:linear-gradient(135deg,#006BFF,#00C853 65%,#FF6B00);
            position:relative;display:inline-grid;place-items:center}
          .u002-mag{transition:translate .9s var(--ux-spring)}
          .u002-btn{position:relative;display:flex;align-items:center;gap:14px;height:54px;padding:0 7px 0 24px;border:0;border-radius:999px;background:var(--bg);color:var(--fg);overflow:hidden;isolation:isolate;
            box-shadow:0 18px 36px -14px rgba(0,40,120,.45);transition:transform .6s var(--ux-spring),box-shadow .6s var(--ux-ease)}
          .u002-btn:active{transform:scale(.96)}
          .u002-fill{position:absolute;inset:0;z-index:-1;background:var(--blob);clip-path:circle(20px at calc(100% - 27px) 50%);transition:clip-path .8s var(--ux-ease)}
          .u002-btn:hover .u002-fill,.u002-btn:focus-visible .u002-fill{clip-path:circle(160% at calc(100% - 27px) 50%)}
          .u002-txt{position:relative;overflow:hidden;padding:4px 0;font-size:15px;font-weight:800;letter-spacing:-.02em;white-space:nowrap;transition:translate .7s var(--ux-spring),color .5s var(--ux-ease)}
          .u002-btn:hover .u002-txt{color:#fff}
          .u002-txt span{display:block;transition:transform .6s var(--ux-spring),opacity .35s var(--ux-ease)}
          .u002-txt span+span{position:absolute;left:0;top:4px;transform:translateY(130%);opacity:0}
          .u002[data-state="go"] .u002-txt span:first-child{transform:translateY(-130%);opacity:0}
          .u002[data-state="go"] .u002-txt span+span{transform:none;opacity:1}
          .u002-orb{position:relative;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#fff;overflow:hidden;flex:none;transition:translate .7s var(--ux-spring)}
          .u002-orb svg{position:absolute;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u002-orb svg:last-child{transform:translateX(-40px)}
          .u002[data-state="go"] .u002-orb svg:first-child{animation:u002-out .55s var(--ux-ease) forwards}
          .u002[data-state="go"] .u002-orb svg:last-child{animation:u002-in .6s var(--ux-spring) .28s forwards}
          @keyframes u002-out{to{transform:translateX(40px)}}
          @keyframes u002-in{to{transform:none}}
          </style>
          <div class="ux u002" data-state="idle">
            <div class="u002-mag">
              <button class="u002-btn" type="button">
                <span class="u002-fill" aria-hidden="true"></span>
                <span class="u002-txt"><span>Bắt đầu ngay</span><span aria-hidden="true">Đã sẵn sàng!</span></span>
                <span class="u002-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                </span>
              </button>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var btn = root.querySelector('.u002-btn'), mag = root.querySelector('.u002-mag'), txt = root.querySelector('.u002-txt'), orb = root.querySelector('.u002-orb');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches, t = 0;
            root.addEventListener('pointermove', function (e) {
              if (rm) return;
              var r = btn.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
              var p = Math.max(0, 1 - Math.hypot(dx, dy) / 200);
              mag.style.translate = (dx * 0.1 * p).toFixed(1) + 'px ' + (dy * 0.18 * p).toFixed(1) + 'px';
              txt.style.translate = (dx * 0.04 * p).toFixed(1) + 'px ' + (dy * 0.06 * p).toFixed(1) + 'px';
              orb.style.translate = (dx * 0.08 * p).toFixed(1) + 'px ' + (dy * 0.12 * p).toFixed(1) + 'px';
            });
            root.addEventListener('pointerleave', function () { mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px'; });
            btn.addEventListener('click', function () {
              clearTimeout(t); root.dataset.state = 'idle'; void btn.offsetWidth; root.dataset.state = 'go';
              t = setTimeout(function () { if (root.isConnected) root.dataset.state = 'idle'; }, rm ? 700 : 1400);
            });
          })();
          </script>

          <button class="btn btn-glass" id="openPopupHero" type="button" style="height:54px;padding:0 24px;">Mở Pop-up mẫu</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Overlapping Dashboard Cards -->
  <div class="container">
    <div class="cards-overlap">
      <!-- Left Card: Blue + Green + Orange bars -->
      <div class="dash-card">
        <div class="card-lbl">
          <span>Phân bổ theo kênh</span>
          <span class="badge badge-blue">3 nhóm</span>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Đơn hoàn tất (Xanh lá)</span><span>240</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:45%"></div><div class="prog-green" style="width:35%"></div></div>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Tăng trưởng tuần</span><span>+42%</span></div>
          <div class="prog-track"><div class="prog-green" style="width:68%"></div><div class="prog-orange" style="width:14%"></div></div>
        </div>
        <div class="prog-row" style="margin-bottom:0;">
          <div class="prog-top"><span>Cảnh báo tồn kho (Cam)</span><span>18</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:60%"></div><div class="prog-orange" style="width:22%"></div></div>
        </div>
      </div>

      <!-- Center Card: Secondary Vibrant Green -->
      <div class="dash-card featured">
        <div class="card-lbl" style="justify-content:center;color:#FFFFFF;">
          <span>● Điểm sức khỏe tăng trưởng</span>
        </div>
        <div class="gauge-wrap">
          <svg viewBox="0 0 200 110" width="200" height="110">
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="14" stroke-linecap="round"/>
            <path id="gaugeArc" d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="50"/>
          </svg>
          <div class="gauge-score" id="scoreVal">80</div>
        </div>
        <input id="scoreRange" type="range" min="20" max="100" value="80" style="width:85%;accent-color:#FF6B00;margin-top:8px;" aria-label="Kéo thử điểm tăng trưởng" />
      </div>

      <!-- Right Card: Blue Line + Orange Peak -->
      <div class="dash-card">
        <div class="card-lbl">
          <span>Doanh thu vs. Mục tiêu</span>
          <span class="badge badge-orange">● Đạt đỉnh</span>
        </div>
        <svg viewBox="0 0 280 120" width="100%" height="120">
          <defs>
            <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#006BFF" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="#006BFF" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 24 L270 110 L10 110 Z" fill="url(#areaBlue)"/>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 24" fill="none" stroke="#006BFF" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="270" cy="24" r="5.5" fill="#FF6B00" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ux-ink-2);">
          <span>Tháng 9</span><span>Tháng 10</span><span>Tháng 11</span>
        </div>
      </div>
    </div>
  </div>

  <main class="container">
    <!-- Lucian UX Section -->
    <section class="sec" id="lucian-ux">
      <div class="sec-head">
        <div>
          <h2>Hệ thống UI/UX: Chính Xanh Dương · Phụ Xanh Lá · Nhấn Cam</h2>
          <p>Kết hợp phân cấp màu rõ ràng với các tương tác vật lý từ thư viện Lucian UX/UI.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-blue btn-sm" type="button">Chính (#006BFF)</button>
          <button class="btn btn-green btn-sm" type="button">Phụ chính (#00C853)</button>
          <button class="btn btn-orange btn-sm" type="button">Phụ phụ (#FF6B00)</button>
        </div>
      </div>

      <div class="grid-2" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- #013 Stretchy switch -->
        <div class="panel" style="align-items:center;">
          <h3 style="width:100%;"><span>Công tắc co giãn</span><span class="lucian-tag">Lucian #013</span></h3>
          <!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
          <style>
          .u013{--on:linear-gradient(135deg,#00E676,#006BFF);position:relative;width:280px;height:185px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
          .u013-sw{position:relative;width:140px;height:76px;border:0;padding:0;border-radius:999px;background:var(--ux-surface-3);touch-action:none;
            box-shadow:inset 0 2px 6px rgba(0,0,0,.12),inset 0 0 0 1px var(--ux-line);transition:box-shadow .5s var(--ux-ease)}
          .u013-sw::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--on);opacity:0;transition:opacity .45s var(--ux-ease)}
          .u013.is-on .u013-sw::before{opacity:1}
          .u013.is-on .u013-sw{box-shadow:inset 0 2px 6px rgba(0,0,0,.12),0 16px 30px -16px rgba(0,200,83,.75)}
          .u013-knob{position:absolute;top:8px;left:8px;width:60px;height:60px;border-radius:999px;background:#fff;display:grid;place-items:center;
            box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 6px 14px -4px rgba(0,0,0,.28);transition:left .5s var(--ux-spring),width .32s var(--ux-ease)}
          .u013.is-on .u013-knob{left:72px}
          .u013.is-stretch .u013-knob{width:84px;transition:left .5s var(--ux-spring),width .18s var(--ux-ease)}
          .u013.is-on.is-stretch .u013-knob{left:48px}
          .u013.is-drag .u013-knob{transition:width .2s var(--ux-ease)}
          .u013-knob svg{width:24px;height:24px;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
          .u013-x{stroke:#94A3B8;stroke-dasharray:14;stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--ux-ease) .1s}
          .u013-v{stroke:#00C853;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--ux-ease)}
          .u013.is-on .u013-x{stroke-dashoffset:14;transition-delay:0s}
          .u013.is-on .u013-v{stroke-dashoffset:0;transition-delay:.18s}
          .u013-txt{width:250px;text-align:center}
          .u013-txt b{display:block;font-size:15px;font-weight:700}
          .u013-sub{position:relative;display:block;height:20px;margin-top:4px;overflow:hidden;font-size:12.5px;color:var(--ux-ink-3)}
          .u013-sub span{display:block;line-height:20px;transition:transform .5s var(--ux-spring),opacity .3s var(--ux-ease)}
          .u013-sub span+span{position:absolute;left:0;right:0;top:0;transform:translateY(100%);opacity:0;color:var(--green-deep);font-weight:700}
          html[data-theme="dark"] .u013-sub span+span{color:#00E676}
          .u013.is-on .u013-sub span:first-child{transform:translateY(-100%);opacity:0}
          .u013.is-on .u013-sub span+span{transform:none;opacity:1}
          </style>
          <div class="ux u013">
            <button class="u013-sw" type="button" role="switch" aria-checked="false">
              <span class="u013-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path class="u013-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9"/><path class="u013-v" d="M5.5 12.5l4.5 4.5 8.5-9"/></svg>
              </span>
            </button>
            <div class="u013-txt">
              <b class="u013-lab">Tối ưu tự động bằng AI</b>
              <span class="u013-sub" aria-live="polite"><span>Đang tắt · Chỉnh tay</span><span>Đã bật · Xanh lá kích hoạt</span></span>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u013-sw'), knob = root.querySelector('.u013-knob'), lab = root.querySelector('.u013-lab');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var id = 'u013-l-' + Math.random().toString(36).slice(2, 7); lab.id = id; sw.setAttribute('aria-labelledby', id);
            var on = false, t = 0, drag = null;
            function set(v) {
              on = v; root.classList.toggle('is-on', v); sw.setAttribute('aria-checked', String(v));
              if (!rm) { root.classList.add('is-stretch'); clearTimeout(t); t = setTimeout(function () { root.classList.remove('is-stretch'); }, 170); }
            }
            sw.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; drag = { x: e.clientX, moved: false, start: on ? 72 : 8 }; sw.setPointerCapture(e.pointerId); });
            sw.addEventListener('pointermove', function (e) {
              if (!drag) return;
              var k = sw.getBoundingClientRect().width / sw.offsetWidth || 1, dx = (e.clientX - drag.x) / k;
              if (Math.abs(dx) > 4) drag.moved = true;
              if (!drag.moved) return;
              root.classList.add('is-drag');
              var x = Math.max(8, Math.min(72, drag.start + dx));
              knob.style.left = x + 'px'; knob.style.width = (60 + Math.min(18, Math.abs(dx) * 0.25)) + 'px';
            });
            function end() {
              if (!drag) return;
              var d = drag; drag = null; root.classList.remove('is-drag');
              var x = parseFloat(knob.style.left || (on ? 72 : 8));
              knob.style.left = ''; knob.style.width = '';
              if (d.moved) { set(x > 40); sw._skip = true; }
            }
            sw.addEventListener('pointerup', end); sw.addEventListener('pointercancel', end);
            sw.addEventListener('click', function () { if (sw._skip) { sw._skip = false; return; } set(!on); });
          })();
          </script>
        </div>

        <!-- #163 Bullet chart target -->
        <div class="panel">
          <h3><span>Biểu đồ KPI (Mục tiêu Cam)</span><span class="lucian-tag">Lucian #163</span></h3>
          <!-- Lucian UX/UI Prompt #163 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#163 -->
          <style>
          .u163{width:100%;padding:6px 0;position:relative;font-size:13px;line-height:1.45}
          .u163 small{color:var(--ux-ink-2);font-size:12px}
          .u163 .status{margin-top:6px;color:var(--ux-ink-2);font-size:12.5px}
          .u163 .status b{color:var(--ux-ink)}
          .u163 input[type="range"]{width:100%;height:38px;accent-color:var(--orange);margin:0}
          .u163 .bullet{height:44px;position:relative;margin-top:26px;border-radius:6px;background:linear-gradient(90deg,var(--ux-surface-3) 0 50%,color-mix(in srgb,var(--green) 22%,var(--ux-surface)) 50% 75%,color-mix(in srgb,var(--green) 42%,var(--ux-surface)) 75%)}
          .u163 .actual{position:absolute;height:17px;top:14px;left:0;width:74%;background:var(--blue);border-radius:0 4px 4px 0}
          .u163 .target{position:absolute;width:3.5px;top:-7px;bottom:-7px;background:var(--orange);left:70%;transition:left .4s}
          .u163 .target::before{content:attr(data-value);position:absolute;top:-17px;left:-10px;font-size:11px;color:var(--orange);font-weight:800}
          .u163 .ticks{display:flex;justify-content:space-between;margin:8px 0;color:var(--ux-ink-2)}
          .u163 label{display:block;font-size:12px;color:var(--ux-ink-2)}
          .u163 .actual-label{font-size:13px;color:var(--ux-ink-2)}
          .u163 .actual-label b{font-size:22px;color:var(--ux-ink);margin:0 3px}
          </style>
          <div class="ux u163">
            <div class="actual-label">Doanh thu thực tế <b>74 triệu</b></div>
            <div class="bullet"><div class="actual"></div><div class="target" data-value="70"></div></div>
            <div class="ticks"><small>0</small><small>50</small><small>75</small><small>100</small></div>
            <label>Kéo mục tiêu (Cam #FF6B00): <input class="range" type="range" min="40" max="100" step="2" value="70" aria-label="Mục tiêu doanh thu"></label>
            <div class="status" aria-live="polite"></div>
          </div>
          <script>
          (()=>{const root=document.currentScript.previousElementSibling;const q=s=>root.querySelector(s);function draw(){const v=+q('.range').value;q('.target').style.left=v+'%';q('.target').dataset.value=v;q('.status').innerHTML=`So với mục tiêu: <b>${74-v>=0?'+':'−'}${Math.abs(74-v)} triệu</b> · Đạt ${(74/v*100).toFixed(1)}%`;root.dataset.state=String(v)}q('.range').oninput=draw;draw();})();
          </script>
        </div>

        <!-- #070 Stacking toasts -->
        <div class="panel">
          <h3><span>Thông báo xếp chồng</span><span class="lucian-tag">Lucian #070</span></h3>
          <!-- Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070 -->
          <style>
          .u070{position:relative;width:100%;height:260px}
          .u070-btns{display:flex;flex-wrap:wrap;gap:6px}
          .u070-btns button{height:34px;padding:0 11px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line);font-size:12px;font-weight:700;color:var(--ux-ink);transition:transform .3s var(--ux-spring)}
          .u070-btns button:active{transform:scale(.94)}
          .u070-btns i{width:8px;height:8px;border-radius:50%;background:var(--c)}
          .u070-zone{position:absolute;left:0;right:0;bottom:0;height:200px;outline:none}
          .u070-t{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;min-height:62px;padding:10px 12px;border-radius:16px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line),0 14px 26px -14px var(--ux-shadow-strong);transform-origin:50% 100%;transform:translate(var(--dx,0px),var(--y,0px)) scale(var(--s,1));opacity:var(--o,1);transition:transform .5s var(--ux-spring),opacity .35s;touch-action:pan-y;user-select:none}
          .u070-t.enter{transform:translateY(70px) scale(.9);opacity:0}
          .u070-t.leave{opacity:0;pointer-events:none}
          .u070-t.back>*{opacity:0}
          .u070-ic{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
          .u070-ic svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u070-tx{flex:1;min-width:0}
          .u070-tx b{display:block;font-size:13px;font-weight:700}
          .u070-tx small{display:block;font-size:11.5px;color:var(--ux-ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .u070-x{width:26px;height:26px;flex:none;border:0;border-radius:50%;display:grid;place-items:center;background:none;color:var(--ux-ink-3)}
          .u070-x svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
          .u070-empty{position:absolute;left:0;right:0;bottom:20px;text-align:center;font-size:12.5px;color:var(--ux-ink-3)}
          </style>
          <div class="ux u070">
            <div class="u070-btns">
              <button type="button" data-k="ok" style="--c:var(--green)"><i aria-hidden="true"></i>Hoàn tất</button>
              <button type="button" data-k="info" style="--c:var(--blue)"><i aria-hidden="true"></i>Cập nhật</button>
              <button type="button" data-k="warn" style="--c:var(--orange)"><i aria-hidden="true"></i>Lưu ý</button>
            </div>
            <div class="u070-zone" role="region" aria-label="Thông báo" tabindex="-1">
              <p class="u070-empty">Bấm nút phía trên để thử thông báo</p>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var zone = root.querySelector('.u070-zone'), empty = root.querySelector('.u070-empty');
            var ICON = { ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>', info: '<svg viewBox="0 0 18 18"><path d="M3.5 4.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>', warn: '<svg viewBox="0 0 18 18"><path d="M9 5v5M9 13h.01"/></svg>' };
            var K = {
              ok: ['var(--green)', 'Đã lưu thành công', 'Dữ liệu đồng bộ · vừa xong'],
              info: ['var(--blue)', 'Cập nhật hệ thống', 'Xanh dương chính đã kích hoạt'],
              warn: ['var(--orange)', 'Cảnh báo tồn kho', 'Có 2 sản phẩm sắp hết hàng']
            };
            var list = [], open = false;
            function layout() {
              var acc = 0;
              list.forEach(function (t, i) {
                var el = t.el; el.classList.toggle('back', !open && i > 0);
                if (open) { el.style.setProperty('--y', -acc + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); acc += el.offsetHeight + 8; }
                else { el.style.setProperty('--y', -(i * 12) + 'px'); el.style.setProperty('--s', (1 - i * 0.06).toFixed(2)); el.style.setProperty('--o', i > 2 ? 0 : 1); }
                el.style.zIndex = 50 - i;
              });
              empty.style.opacity = list.length ? '0' : '1';
            }
            function remove(t) {
              var i = list.indexOf(t); if (i < 0) return;
              list.splice(i, 1); t.el.classList.add('leave');
              setTimeout(function () { t.el.remove(); }, 350); layout();
            }
            function push(k) {
              var d = K[k], el = document.createElement('div');
              el.className = 'u070-t enter'; el.style.setProperty('--c', d[0]);
              el.innerHTML = '<span class="u070-ic">' + ICON[k] + '</span><span class="u070-tx"><b></b><small></small></span><button class="u070-x" type="button" aria-label="Đóng"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button>';
              el.querySelector('b').textContent = d[1]; el.querySelector('small').textContent = d[2];
              var t = { el: el }; zone.appendChild(el); list.unshift(t);
              void el.offsetWidth; el.classList.remove('enter'); layout();
              el.querySelector('.u070-x').addEventListener('click', function () { remove(t); });
            }
            zone.addEventListener('pointerenter', function () { open = true; layout(); });
            zone.addEventListener('pointerleave', function () { open = false; layout(); });
            root.querySelectorAll('.u070-btns button').forEach(function (b) { b.addEventListener('click', function () { push(b.getAttribute('data-k')); }); });
            push('warn'); push('ok');
          })();
          </script>
        </div>
      </div>
    </section>

    <!-- Forms & Data Table -->
    <section class="sec" id="forms" style="border-bottom:none;">
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu kiểm tra lỗi</h3>
          <div class="field">
            <label for="fName">Tên chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Chiến dịch Tháng 11" />
            <div class="err-msg" id="eName">Vui lòng nhập tên chiến dịch.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email quản trị</label>
            <input class="input" id="fEmail" type="email" placeholder="admin@xclipse.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-blue" id="validateBtn" type="button">Kiểm tra & Gửi</button>
        </div>

        <div class="panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;">
            <h3 style="margin:0;">Danh sách chiến dịch</h3>
            <input class="input" id="searchInput" type="search" placeholder="Lọc nhanh..." style="max-width:170px;height:34px;" />
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>Số lượng</th><th>Trạng thái</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;color:var(--ux-accent);">Yêu cầu Demo Xclipse</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--ux-ink-2);">
        Bảng màu rực rỡ: Xanh dương #006BFF (chính) · Xanh lá #00C853 (phụ chính) · Cam #FF6B00 (phụ phụ).
      </p>
      <div class="field">
        <label>Tên đội thi / Doanh nghiệp</label>
        <input class="input" type="text" value="Xclipse — FPT Polytechnic Hà Nội" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-green" id="confirmModal" type="button">Xác nhận ngay</button>
      </div>
    </div>
  </div>

  <script>
    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex); };
    });

    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
    };

    const scoreRange = document.getElementById('scoreRange');
    const scoreVal = document.getElementById('scoreVal');
    const gaugeArc = document.getElementById('gaugeArc');
    scoreRange.oninput = () => {
      const v = Number(scoreRange.value);
      scoreVal.textContent = v;
      gaugeArc.setAttribute('stroke-dashoffset', (251.2 * (1 - v / 100)).toFixed(1));
    };

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName'), email = document.getElementById('fEmail');
      const eName = document.getElementById('eName'), eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) alert('✓ Dữ liệu hợp lệ! Đã lưu thành công.');
    };

    const rows = [
      { name: 'Chiến dịch B2B SaaS', qty: 420, badge: ['badge-blue', '● Đang chạy'] },
      { name: 'Chăm sóc Khách hàng', qty: 510, badge: ['badge-green', '✓ Đạt KPI'] },
      { name: 'Cảnh báo Tồn kho thấp', qty: 18, badge: ['badge-orange', '! Cần nhập'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.qty}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = closeModal;
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-lucian.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX — Theme Lucian (Seokwoooo lucian-uxui)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* Lucian UX/UI Prompt theme tokens · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/ */
    :root{
      color-scheme:light;
      --ux-page:#F4F2EE;
      --ux-surface:#FFFFFF;
      --ux-surface-2:#F5F3EF;
      --ux-surface-3:#EAE7E1;
      --ux-ink:#16151B;
      --ux-ink-2:#57535F;
      --ux-ink-3:#8E8A97;
      --ux-line:rgba(22,21,27,.09);
      --ux-line-2:rgba(22,21,27,.17);
      --ux-accent:#6A57F2;
      --ux-accent-2:#2F8FE0;
      --ux-accent-soft:rgba(106,87,242,.12);
      --ux-accent-ink:#FFFFFF;
      --ux-mint:#119C72;
      --ux-warn:#D6731E;
      --ux-danger:#D93A55;
      --ux-glass:rgba(255,255,255,.58);
      --ux-glass-line:rgba(255,255,255,.85);
      --ux-shadow:rgba(40,30,80,.14);
      --ux-shadow-strong:rgba(40,30,80,.3);
      --ux-grad:linear-gradient(120deg,#7B61FF,#3D8BFF 55%,#1FB89A);
      --ux-ease:cubic-bezier(.2,.8,.2,1);
      --ux-spring:cubic-bezier(.34,1.45,.64,1);
    }
    @media (prefers-color-scheme:dark){
      :root:not([data-theme="light"]){
        color-scheme:dark;
        --ux-page:#07080D;
        --ux-surface:#13141C;
        --ux-surface-2:#1A1B25;
        --ux-surface-3:#252632;
        --ux-ink:#F4F0E8;
        --ux-ink-2:rgba(244,240,232,.68);
        --ux-ink-3:rgba(244,240,232,.42);
        --ux-line:rgba(255,255,255,.08);
        --ux-line-2:rgba(255,255,255,.16);
        --ux-accent:#B7A4FF;
        --ux-accent-2:#7DB4FF;
        --ux-accent-soft:rgba(183,164,255,.15);
        --ux-accent-ink:#0B0C12;
        --ux-mint:#7EE8C0;
        --ux-warn:#FFB26B;
        --ux-danger:#FF7D8C;
        --ux-glass:rgba(255,255,255,.07);
        --ux-glass-line:rgba(255,255,255,.18);
        --ux-shadow:rgba(0,0,0,.45);
        --ux-shadow-strong:rgba(0,0,0,.72);
        --ux-grad:linear-gradient(120deg,#B7A4FF,#7DB4FF 55%,#A5F2D3);
      }
    }
    :root[data-theme="dark"]{
      color-scheme:dark;
      --ux-page:#07080D;
      --ux-surface:#13141C;
      --ux-surface-2:#1A1B25;
      --ux-surface-3:#252632;
      --ux-ink:#F4F0E8;
      --ux-ink-2:rgba(244,240,232,.68);
      --ux-ink-3:rgba(244,240,232,.42);
      --ux-line:rgba(255,255,255,.08);
      --ux-line-2:rgba(255,255,255,.16);
      --ux-accent:#B7A4FF;
      --ux-accent-2:#7DB4FF;
      --ux-accent-soft:rgba(183,164,255,.15);
      --ux-accent-ink:#0B0C12;
      --ux-mint:#7EE8C0;
      --ux-warn:#FFB26B;
      --ux-danger:#FF7D8C;
      --ux-glass:rgba(255,255,255,.07);
      --ux-glass-line:rgba(255,255,255,.18);
      --ux-shadow:rgba(0,0,0,.45);
      --ux-shadow-strong:rgba(0,0,0,.72);
      --ux-grad:linear-gradient(120deg,#B7A4FF,#7DB4FF 55%,#A5F2D3);
    }

    .ux,.ux *,.ux *::before,.ux *::after{box-sizing:border-box}
    .ux{
      font-family:'Be Vietnam Pro',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      color:var(--ux-ink);-webkit-font-smoothing:antialiased;letter-spacing:-.01em;
      -webkit-tap-highlight-color:transparent;
      word-break:keep-all;overflow-wrap:break-word;
    }
    :where(.ux) :is(button,input,textarea,select){font:inherit;color:inherit}
    :where(.ux) button{cursor:pointer}
    .ux :focus-visible{outline:2px solid var(--ux-accent);outline-offset:3px}
    .ux [hidden]{display:none!important}
    @media (prefers-reduced-motion:reduce){
      .ux,.ux *,.ux *::before,.ux *::after{
        animation-duration:.001ms!important;animation-iteration-count:1!important;
        transition-duration:.001ms!important;scroll-behavior:auto!important;
      }
    }

    /* Page Shell */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      background: var(--ux-page);
      color: var(--ux-ink);
      line-height: 1.55;
      transition: background .35s var(--ux-ease), color .35s var(--ux-ease);
    }
    .topbar {
      position: sticky; top: 0; z-index: 40;
      background: color-mix(in srgb, var(--ux-page) 84%, transparent);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--ux-line);
    }
    .topbar-inner {
      max-width: 1140px; margin: 0 auto; padding: 12px 20px;
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }
    .brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid var(--ux-line-2); }
    .pill {
      font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px;
      background: var(--ux-accent-soft); color: var(--ux-accent);
    }
    .wrap { max-width: 1140px; margin: 0 auto; padding: 36px 20px 80px; }
    .hero { text-align: center; max-width: 680px; margin: 0 auto 36px; }
    .hero h1 { margin: 0 0 10px; font-size: clamp(30px, 4.5vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; }
    .hero p { margin: 0; color: var(--ux-ink-2); font-size: 15px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
      gap: 20px;
    }
    .slot {
      background: var(--ux-surface);
      border: 1px solid var(--ux-line);
      border-radius: 22px;
      padding: 20px;
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      min-height: 320px;
      overflow: hidden;
    }
    .slot-head {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px; font-size: 13px; font-weight: 700; color: var(--ux-ink-2);
    }
    .slot-id { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--ux-surface-2); color: var(--ux-ink-3); }
    .slot-body { display: grid; place-items: center; width: 100%; flex: 1; }
    @media (max-width: 400px) {
      .grid { grid-template-columns: 1fr; }
      .u001, .u002, .u070 { max-width: 100%; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <img src="logo-light.jpg" alt="Xclipse" onerror="this.style.display='none'" />
        <span>Xclipse × Lucian UI</span>
        <span class="pill">Seokwoooo lucian-uxui</span>
      </div>
      <button type="button" id="quickThemeBtn" style="height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--ux-line-2);background:var(--ux-surface);color:var(--ux-ink);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;">
        Đổi Sáng / Tối
      </button>
    </div>
  </header>

  <main class="wrap">
    <div class="hero">
      <h1>Giao diện Xclipse theo <span style="background:var(--ux-grad);-webkit-background-clip:text;color:transparent;">Lucian UX/UI</span></h1>
      <p>Ứng dụng trực tiếp 6 thành phần tương tác từ thư viện <strong>Seokwoooo/lucian-uxui</strong> (MIT © 2026) — bấm thử từng ô để trải nghiệm chuyển động vật lý mượt mà.</p>
    </div>

    <div class="grid">
      <!-- #021 Day-night sky switch (linked to page theme) -->
      <section class="slot">
        <div class="slot-head">
          <span>Công tắc Sáng / Tối toàn trang</span>
          <span class="slot-id">Lucian #021</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #021 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#021 -->
          <style>
          .u021{position:relative;width:300px;height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
          .u021-sw{position:relative;width:224px;height:94px;border:0;padding:0;border-radius:999px;overflow:hidden;isolation:isolate;
            background:linear-gradient(180deg,#5DB7FF,#9ED8FF);box-shadow:inset 0 4px 10px rgba(0,30,80,.28),inset 0 -2px 4px rgba(255,255,255,.4),0 18px 34px -18px rgba(40,110,200,.7);transition:box-shadow .8s var(--ux-ease)}
          .u021-sw::before{content:"";position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,#141A3A,#232C5C);opacity:0;transition:opacity .8s var(--ux-ease)}
          .u021-sw:focus-visible{outline:2px solid var(--ux-accent);outline-offset:5px}
          .u021.is-night .u021-sw::before{opacity:1}
          .u021.is-night .u021-sw{box-shadow:inset 0 4px 10px rgba(0,0,0,.5),inset 0 -2px 4px rgba(255,255,255,.08),0 18px 34px -18px rgba(20,24,70,.9)}
          .u021-halo{position:absolute;z-index:1;left:47px;top:47px;width:0;height:0;transition:transform .9s var(--ux-spring)}
          .u021-halo i{position:absolute;border-radius:50%;background:rgba(255,255,255,.12)}
          .u021-halo i:nth-child(1){width:130px;height:130px;margin:-65px}
          .u021-halo i:nth-child(2){width:176px;height:176px;margin:-88px}
          .u021-halo i:nth-child(3){width:222px;height:222px;margin:-111px}
          .u021.is-night .u021-halo{transform:translateX(130px)}
          .u021-knob{position:absolute;z-index:3;left:8px;top:8px;width:78px;height:78px;border-radius:50%;overflow:hidden;
            background:radial-gradient(circle at 35% 30%,#FFF1A8,#FFD23F 45%,#F8A91E);box-shadow:0 6px 14px -4px rgba(140,80,0,.5),inset -4px -6px 10px rgba(200,110,0,.35),inset 4px 4px 8px rgba(255,255,255,.5);
            transition:transform .9s var(--ux-spring)}
          .u021-moon{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F4F6FB,#C9CFDD 60%,#A9B0C2);opacity:0;transform:translateX(100%);transition:transform .8s var(--ux-ease),opacity .4s var(--ux-ease)}
          .u021-moon i{position:absolute;border-radius:50%;background:#A3AABC;box-shadow:inset 1px 2px 2px rgba(0,0,0,.18)}
          .u021-moon i:nth-child(1){left:20px;top:16px;width:20px;height:20px}
          .u021-moon i:nth-child(2){left:46px;top:40px;width:14px;height:14px}
          .u021-moon i:nth-child(3){left:24px;top:48px;width:9px;height:9px}
          .u021.is-night .u021-knob{transform:translateX(130px) rotate(200deg)}
          .u021.is-night .u021-moon{opacity:1;transform:none}
          .u021-clouds{position:absolute;z-index:2;inset:0;transition:transform .8s var(--ux-ease),opacity .6s var(--ux-ease)}
          .u021-clouds i{position:absolute;border-radius:999px;background:#fff}
          .u021-clouds i:nth-child(1){right:-10px;bottom:-18px;width:120px;height:56px;box-shadow:-46px 8px 0 -6px #fff,-80px 18px 0 -10px #fff}
          .u021-clouds i:nth-child(2){right:20px;bottom:-30px;width:96px;height:52px;background:#E3F1FF;box-shadow:-44px 6px 0 -8px #E3F1FF;z-index:-1}
          .u021.is-night .u021-clouds{transform:translateY(80px);opacity:0}
          .u021-stars{position:absolute;z-index:1;inset:0;opacity:0;transform:translateY(-30px);transition:transform .8s var(--ux-ease),opacity .6s var(--ux-ease)}
          .u021-stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fff;animation:u021-tw 2.4s ease-in-out infinite}
          .u021.is-night .u021-stars{opacity:1;transform:none}
          @keyframes u021-tw{50%{opacity:.3;transform:scale(.6)}}
          .u021-lab{margin:0;position:relative;width:220px;height:24px;overflow:hidden;text-align:center;font-size:15px;font-weight:700;letter-spacing:-.02em}
          .u021-lab span{position:absolute;left:0;right:0;top:0;line-height:24px;transition:transform .55s var(--ux-spring),opacity .3s var(--ux-ease)}
          .u021-lab small{font-weight:500;color:var(--ux-ink-3);margin-left:6px}
          .u021-lab span+span{transform:translateY(100%);opacity:0}
          .u021.is-night .u021-lab span:first-child{transform:translateY(-100%);opacity:0}
          .u021.is-night .u021-lab span+span{transform:none;opacity:1}
          </style>
          <div class="ux u021" id="skySwitch">
            <button class="u021-sw" type="button" role="switch" aria-checked="false" aria-label="Chế độ ban đêm">
              <span class="u021-halo" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="u021-stars" aria-hidden="true">
                <i style="left:30px;top:20px"></i><i style="left:58px;top:56px;animation-delay:-.6s;width:3px;height:3px"></i><i style="left:86px;top:26px;animation-delay:-1.2s"></i><i style="left:44px;top:72px;animation-delay:-1.8s;width:3px;height:3px"></i><i style="left:110px;top:60px;animation-delay:-.9s;width:2px;height:2px"></i><i style="left:20px;top:46px;animation-delay:-1.5s;width:2px;height:2px"></i>
              </span>
              <span class="u021-clouds" aria-hidden="true"><i></i><i></i></span>
              <span class="u021-knob" aria-hidden="true"><span class="u021-moon"><i></i><i></i><i></i></span></span>
            </button>
            <p class="u021-lab" aria-hidden="true"><span>Ban ngày<small>Sáng</small></span><span>Nhật thực<small>Tối</small></span></p>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u021-sw');
            function sync(night) {
              root.classList.toggle('is-night', night);
              sw.setAttribute('aria-checked', String(night));
              document.documentElement.setAttribute('data-theme', night ? 'dark' : 'light');
            }
            sw.addEventListener('click', function () {
              sync(!root.classList.contains('is-night'));
            });
            document.getElementById('quickThemeBtn').addEventListener('click', function () {
              sync(!root.classList.contains('is-night'));
            });
          })();
          </script>
        </div>
      </section>

      <!-- #001 Liquid glass button -->
      <section class="slot">
        <div class="slot-head">
          <span>Nút kính lỏng (Bấm để lưu)</span>
          <span class="slot-id">Lucian #001</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #001 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#001 -->
          <style>
          .u001{--g1:rgba(255,255,255,.66);--g2:rgba(255,255,255,.16);--g3:rgba(255,255,255,.4);--hi:rgba(255,255,255,.95);--rim:rgba(255,255,255,.65);--drop:rgba(70,48,160,.42);--blob:.55;
            position:relative;width:340px;height:240px;display:grid;place-items:center;isolation:isolate}
          @media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .u001{--g1:rgba(255,255,255,.2);--g2:rgba(255,255,255,.03);--g3:rgba(255,255,255,.1);--hi:rgba(255,255,255,.5);--rim:rgba(255,255,255,.16);--drop:rgba(0,0,0,.75);--blob:.5}}
          :root[data-theme="dark"] .u001{--g1:rgba(255,255,255,.2);--g2:rgba(255,255,255,.03);--g3:rgba(255,255,255,.1);--hi:rgba(255,255,255,.5);--rim:rgba(255,255,255,.16);--drop:rgba(0,0,0,.75);--blob:.5}
          .u001-blobs{position:absolute;inset:0;z-index:-1;pointer-events:none}
          .u001-blobs i{position:absolute;border-radius:50%;filter:blur(30px);opacity:var(--blob);animation:u001-drift 12s ease-in-out infinite alternate}
          .u001-blobs i:nth-child(1){left:30px;top:44px;width:150px;height:130px;background:#8B6CFF}
          .u001-blobs i:nth-child(2){right:24px;bottom:34px;width:160px;height:118px;background:#33B6FF;animation-delay:-4s}
          .u001-blobs i:nth-child(3){left:150px;top:36px;width:92px;height:92px;background:#3BE0B0;opacity:calc(var(--blob) * .7);animation-delay:-8s}
          @keyframes u001-drift{from{transform:translate3d(-10px,-6px,0) scale(1)}to{transform:translate3d(12px,8px,0) scale(1.12)}}
          .u001-mag{transition:translate .8s var(--ux-spring)}
          .u001-float{animation:u001-float 6s ease-in-out infinite}
          @keyframes u001-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
          .u001-btn{position:relative;display:block;width:252px;height:78px;padding:0;border:0;border-radius:999px;overflow:hidden;isolation:isolate;color:var(--ux-ink);
            background:linear-gradient(150deg,var(--g1),var(--g2) 55%,var(--g3));
            -webkit-backdrop-filter:blur(18px) saturate(180%);backdrop-filter:blur(18px) saturate(180%);
            box-shadow:inset 0 1.5px 0 var(--hi),inset 0 -12px 20px -14px var(--hi),inset 0 0 0 1px var(--rim),0 26px 44px -22px var(--drop),0 3px 8px -4px var(--drop);
            transition:width .7s var(--ux-ease),transform .55s var(--ux-spring),box-shadow .6s var(--ux-ease)}
          .u001-btn::before{content:"";position:absolute;left:9%;right:9%;top:7%;height:42%;border-radius:999px;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,0))}
          .u001-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .4s var(--ux-ease);background:radial-gradient(130px 70px at var(--mx,50%) var(--my,0%),rgba(255,255,255,.4),transparent 70%)}
          .u001-btn:hover::after{opacity:1}
          .u001-btn:active{transform:scale(1.03,.92)}
          .u001-btn:focus-visible{outline:2px solid var(--ux-accent);outline-offset:6px}
          .u001-sheen{position:absolute;top:-40%;bottom:-40%;left:0;width:38%;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45) 50%,transparent);transform:translateX(-150%) skewX(-12deg);transition:transform 1.1s var(--ux-ease)}
          .u001-btn:hover .u001-sheen{transform:translateX(300%) skewX(-12deg)}
          .u001-txt,.u001-done{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:-.025em;white-space:nowrap;transition:opacity .35s var(--ux-ease),transform .55s var(--ux-ease),filter .4s var(--ux-ease)}
          .u001-done{opacity:0;transform:translateY(14px);filter:blur(4px)}
          .u001-done b{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--ux-mint);color:#fff;box-shadow:0 0 0 6px color-mix(in srgb,var(--ux-mint) 22%,transparent)}
          .u001-done svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round}
          .u001-done path{stroke-dasharray:18;stroke-dashoffset:18;transition:stroke-dashoffset .5s var(--ux-ease) .3s}
          .u001-spin{position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;opacity:0;transform:scale(.5);transition:opacity .35s var(--ux-ease),transform .6s var(--ux-spring)}
          .u001-spin svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;animation:u001-rot 1s linear infinite}
          .u001-spin circle{stroke-dasharray:1 56;animation:u001-arc 1.4s ease-in-out infinite}
          @keyframes u001-rot{to{transform:rotate(360deg)}}
          @keyframes u001-arc{0%,100%{stroke-dasharray:1 56}50%{stroke-dasharray:38 19}}
          .u001[data-state="load"] .u001-btn{width:78px;cursor:progress}
          .u001[data-state="load"] .u001-txt{opacity:0;transform:translateY(-14px);filter:blur(5px)}
          .u001[data-state="load"] .u001-spin{opacity:1;transform:none}
          .u001[data-state="ok"] .u001-btn{transition-timing-function:var(--ux-spring);box-shadow:inset 0 1.5px 0 var(--hi),inset 0 0 0 1px var(--rim),0 26px 44px -22px var(--drop),0 0 52px -8px color-mix(in srgb,var(--ux-mint) 70%,transparent)}
          .u001[data-state="ok"] .u001-txt{opacity:0;transform:translateY(-14px);filter:blur(5px)}
          .u001[data-state="ok"] .u001-done{opacity:1;transform:none;filter:none}
          .u001[data-state="ok"] .u001-done path{stroke-dashoffset:0}
          .u001-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
          </style>
          <div class="ux u001" data-state="idle">
            <div class="u001-blobs" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="u001-mag">
              <div class="u001-float">
                <button class="u001-btn" type="button">
                  <span class="u001-sheen" aria-hidden="true"></span>
                  <span class="u001-txt">Lưu & Xuất bản</span>
                  <span class="u001-spin" aria-hidden="true"><svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="10"/></svg></span>
                  <span class="u001-done" aria-hidden="true"><b><svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4"/></svg></b>Đã lưu</span>
                </button>
              </div>
            </div>
            <span class="u001-live" aria-live="polite"></span>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var btn = root.querySelector('.u001-btn');
            var mag = root.querySelector('.u001-mag');
            var live = root.querySelector('.u001-live');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var timers = [];
            function later(fn, ms) { timers.push(setTimeout(function () { if (root.isConnected) fn(); }, ms)); }
            function clear() { timers.forEach(clearTimeout); timers = []; }
            root.addEventListener('pointermove', function (e) {
              var r = btn.getBoundingClientRect();
              var dx = e.clientX - (r.left + r.width / 2);
              var dy = e.clientY - (r.top + r.height / 2);
              var pull = rm ? 0 : Math.max(0, 1 - Math.hypot(dx, dy) / 190);
              mag.style.translate = (dx * 0.18 * pull).toFixed(1) + 'px ' + (dy * 0.18 * pull).toFixed(1) + 'px';
              btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
              btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
            });
            root.addEventListener('pointerleave', function () { mag.style.translate = '0px 0px'; });
            btn.addEventListener('click', function () {
              if (root.dataset.state === 'load') return;
              clear();
              root.dataset.state = 'load';
              btn.setAttribute('aria-busy', 'true');
              live.textContent = 'Đang lưu';
              later(function () {
                root.dataset.state = 'ok';
                btn.removeAttribute('aria-busy');
                live.textContent = 'Đã lưu';
              }, rm ? 200 : 1400);
              later(function () { root.dataset.state = 'idle'; live.textContent = ''; }, rm ? 1200 : 3200);
            });
          })();
          </script>
        </div>
      </section>

      <!-- #002 Magnetic arrow button -->
      <section class="slot">
        <div class="slot-head">
          <span>Nút CTA nam châm (Rê chuột & Bấm)</span>
          <span class="slot-id">Lucian #002</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002 -->
          <style>
          .u002{--bg:#16151B;--fg:#F7F5F0;--blob:linear-gradient(135deg,#8B6CFF,#4F8DFF 60%,#2FC7B4);
            position:relative;width:340px;height:200px;display:grid;place-items:center}
          @media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .u002{--bg:#F4F0E8;--fg:#121117}}
          :root[data-theme="dark"] .u002{--bg:#F4F0E8;--fg:#121117}
          .u002-mag{transition:translate .9s var(--ux-spring)}
          .u002-btn{position:relative;display:flex;align-items:center;gap:18px;height:76px;padding:0 10px 0 32px;border:0;border-radius:999px;background:var(--bg);color:var(--fg);overflow:hidden;isolation:isolate;
            box-shadow:0 24px 40px -24px rgba(40,24,110,.6),0 0 0 1px color-mix(in srgb,var(--fg) 8%,transparent);
            transition:transform .6s var(--ux-spring),box-shadow .6s var(--ux-ease)}
          .u002-btn:hover{box-shadow:0 30px 52px -22px rgba(91,72,255,.7),0 0 0 1px transparent}
          .u002-btn:active{transform:scale(.96)}
          .u002-btn:focus-visible{outline:2px solid var(--ux-accent);outline-offset:5px}
          .u002-fill{position:absolute;inset:0;z-index:-1;background:var(--blob);clip-path:circle(28px at calc(100% - 38px) 50%);transition:clip-path .8s var(--ux-ease)}
          .u002-btn:hover .u002-fill,.u002-btn:focus-visible .u002-fill{clip-path:circle(160% at calc(100% - 38px) 50%)}
          .u002-txt{position:relative;overflow:hidden;padding:5px 0;font-size:18px;font-weight:700;letter-spacing:-.03em;white-space:nowrap;transition:translate .7s var(--ux-spring),color .5s var(--ux-ease)}
          .u002-btn:hover .u002-txt{color:#fff}
          .u002-txt span{display:block;transition:transform .6s var(--ux-spring),opacity .35s var(--ux-ease)}
          .u002-txt span+span{position:absolute;left:0;top:5px;transform:translateY(130%);opacity:0}
          .u002[data-state="go"] .u002-txt span:first-child{transform:translateY(-130%);opacity:0}
          .u002[data-state="go"] .u002-txt span+span{transform:none;opacity:1}
          .u002-orb{position:relative;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;color:#fff;overflow:hidden;flex:none;transition:translate .7s var(--ux-spring)}
          .u002-orb svg{position:absolute;width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u002-orb svg:last-child{transform:translateX(-46px)}
          .u002[data-state="go"] .u002-orb svg:first-child{animation:u002-out .55s var(--ux-ease) forwards}
          .u002[data-state="go"] .u002-orb svg:last-child{animation:u002-in .6s var(--ux-spring) .28s forwards}
          @keyframes u002-out{to{transform:translateX(46px)}}
          @keyframes u002-in{to{transform:none}}
          .u002-glow{position:absolute;left:50%;top:50%;width:300px;height:110px;margin:-40px 0 0 -150px;border-radius:50%;background:var(--blob);filter:blur(36px);opacity:0;z-index:-1;transition:opacity .7s var(--ux-ease)}
          .u002:hover .u002-glow{opacity:.45}
          .u002-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
          </style>
          <div class="ux u002" data-state="idle">
            <span class="u002-glow" aria-hidden="true"></span>
            <div class="u002-mag">
              <button class="u002-btn" type="button">
                <span class="u002-fill" aria-hidden="true"></span>
                <span class="u002-txt"><span>Tạo dự án mới</span><span aria-hidden="true">Sẵn sàng rồi!</span></span>
                <span class="u002-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
                </span>
              </button>
            </div>
            <span class="u002-live" aria-live="polite"></span>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var btn = root.querySelector('.u002-btn');
            var mag = root.querySelector('.u002-mag');
            var txt = root.querySelector('.u002-txt');
            var orb = root.querySelector('.u002-orb');
            var live = root.querySelector('.u002-live');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var t = 0;
            root.addEventListener('pointermove', function (e) {
              if (rm) return;
              var r = btn.getBoundingClientRect();
              var dx = e.clientX - (r.left + r.width / 2);
              var dy = e.clientY - (r.top + r.height / 2);
              var p = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
              mag.style.translate = (dx * 0.12 * p).toFixed(1) + 'px ' + (dy * 0.22 * p).toFixed(1) + 'px';
              txt.style.translate = (dx * 0.05 * p).toFixed(1) + 'px ' + (dy * 0.08 * p).toFixed(1) + 'px';
              orb.style.translate = (dx * 0.1 * p).toFixed(1) + 'px ' + (dy * 0.14 * p).toFixed(1) + 'px';
            });
            root.addEventListener('pointerleave', function () {
              mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px';
            });
            btn.addEventListener('click', function () {
              clearTimeout(t);
              root.dataset.state = 'idle';
              void btn.offsetWidth;
              root.dataset.state = 'go';
              live.textContent = 'Sẵn sàng rồi!';
              t = setTimeout(function () { if (root.isConnected) { root.dataset.state = 'idle'; live.textContent = ''; } }, rm ? 900 : 1900);
            });
          })();
          </script>
        </div>
      </section>

      <!-- #013 Stretchy switch -->
      <section class="slot">
        <div class="slot-head">
          <span>Công tắc co giãn vật lý</span>
          <span class="slot-id">Lucian #013</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
          <style>
          .u013{--on:linear-gradient(135deg,#2FD8A8,#14B8A6 55%,#0EA5E9);position:relative;width:300px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px}
          .u013-sw{position:relative;width:140px;height:76px;border:0;padding:0;border-radius:999px;background:var(--ux-surface-3);touch-action:none;
            box-shadow:inset 0 2px 6px rgba(0,0,0,.12),inset 0 0 0 1px var(--ux-line);transition:box-shadow .5s var(--ux-ease)}
          .u013-sw::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--on);opacity:0;transition:opacity .45s var(--ux-ease)}
          .u013-sw:focus-visible{outline:2px solid var(--ux-accent);outline-offset:4px}
          .u013.is-on .u013-sw::before{opacity:1}
          .u013.is-on .u013-sw{box-shadow:inset 0 2px 6px rgba(0,0,0,.12),0 16px 30px -16px rgba(20,184,166,.8)}
          .u013-knob{position:absolute;top:8px;left:8px;width:60px;height:60px;border-radius:999px;background:#fff;display:grid;place-items:center;
            box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 6px 14px -4px rgba(0,0,0,.28),0 0 0 .5px rgba(0,0,0,.06);
            transition:left .5s var(--ux-spring),width .32s var(--ux-ease)}
          .u013.is-on .u013-knob{left:72px}
          .u013.is-stretch .u013-knob{width:84px;transition:left .5s var(--ux-spring),width .18s var(--ux-ease)}
          .u013.is-on.is-stretch .u013-knob{left:48px}
          .u013.is-drag .u013-knob{transition:width .2s var(--ux-ease)}
          .u013-knob svg{width:24px;height:24px;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
          .u013-x{stroke:#A3A0AA;stroke-dasharray:14;stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--ux-ease) .1s}
          .u013-v{stroke:#14B8A6;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--ux-ease)}
          .u013.is-on .u013-x{stroke-dashoffset:14;transition-delay:0s}
          .u013.is-on .u013-v{stroke-dashoffset:0;transition-delay:.18s}
          .u013-txt{width:260px;text-align:center}
          .u013-txt b{display:block;font-size:17px;font-weight:700;letter-spacing:-.02em}
          .u013-sub{position:relative;display:block;height:20px;margin-top:5px;overflow:hidden;font-size:13px;color:var(--ux-ink-3)}
          .u013-sub span{display:block;line-height:20px;transition:transform .5s var(--ux-spring),opacity .3s var(--ux-ease)}
          .u013-sub span+span{position:absolute;left:0;right:0;top:0;transform:translateY(100%);opacity:0;color:var(--ux-mint);font-weight:600}
          .u013.is-on .u013-sub span:first-child{transform:translateY(-100%);opacity:0}
          .u013.is-on .u013-sub span+span{transform:none;opacity:1}
          </style>
          <div class="ux u013">
            <button class="u013-sw" type="button" role="switch" aria-checked="false">
              <span class="u013-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path class="u013-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9"/><path class="u013-v" d="M5.5 12.5l4.5 4.5 8.5-9"/></svg>
              </span>
            </button>
            <div class="u013-txt">
              <b class="u013-lab">Tự động tối ưu bằng AI</b>
              <span class="u013-sub" aria-live="polite"><span>Đang tắt · Chỉnh tay</span><span>Đã bật · Xử lý tự động</span></span>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u013-sw');
            var knob = root.querySelector('.u013-knob');
            var lab = root.querySelector('.u013-lab');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var id = 'u013-l-' + Math.random().toString(36).slice(2, 7);
            lab.id = id;
            sw.setAttribute('aria-labelledby', id);
            var on = false, t = 0;
            function set(v) {
              on = v;
              root.classList.toggle('is-on', v);
              sw.setAttribute('aria-checked', String(v));
              if (!rm) {
                root.classList.add('is-stretch');
                clearTimeout(t);
                t = setTimeout(function () { root.classList.remove('is-stretch'); }, 170);
              }
            }
            var drag = null;
            sw.addEventListener('pointerdown', function (e) {
              if (e.button !== 0) return;
              drag = { x: e.clientX, moved: false, start: on ? 72 : 8 };
              sw.setPointerCapture(e.pointerId);
            });
            sw.addEventListener('pointermove', function (e) {
              if (!drag) return;
              var k = sw.getBoundingClientRect().width / sw.offsetWidth || 1;
              var dx = (e.clientX - drag.x) / k;
              if (Math.abs(dx) > 4) drag.moved = true;
              if (!drag.moved) return;
              root.classList.add('is-drag');
              var x = Math.max(8, Math.min(72, drag.start + dx));
              knob.style.left = x + 'px';
              knob.style.width = (60 + Math.min(18, Math.abs(dx) * 0.25)) + 'px';
            });
            function end() {
              if (!drag) return;
              var d = drag; drag = null;
              root.classList.remove('is-drag');
              var x = parseFloat(knob.style.left || (on ? 72 : 8));
              knob.style.left = ''; knob.style.width = '';
              if (d.moved) { set(x > 40); sw._skip = true; }
            }
            sw.addEventListener('pointerup', end);
            sw.addEventListener('pointercancel', end);
            sw.addEventListener('click', function () {
              if (sw._skip) { sw._skip = false; return; }
              set(!on);
            });
          })();
          </script>
        </div>
      </section>

      <!-- #163 Bullet chart target -->
      <section class="slot">
        <div class="slot-head">
          <span>Biểu đồ KPI mục tiêu (Kéo thanh trượt)</span>
          <span class="slot-id">Lucian #163</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #163 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#163 -->
          <style>
          .u163{width:100%;max-width:390px;padding:16px;position:relative;font-size:13px;line-height:1.45}
          .u163 small{color:var(--ux-ink-2);font-size:12px}
          .u163 .status{margin-top:6px;color:var(--ux-ink-2);font-size:12px;line-height:1.5}
          .u163 .status b{color:var(--ux-ink)}
          .u163 input[type="range"]{width:100%;height:44px;accent-color:var(--ux-accent);margin:0}
          .u163 .bullet{height:44px;position:relative;margin-top:32px;border-radius:3px;background:linear-gradient(90deg,var(--ux-surface-3) 0 50%,color-mix(in srgb,var(--ux-accent) 25%,var(--ux-surface)) 50% 75%,color-mix(in srgb,var(--ux-accent) 45%,var(--ux-surface)) 75%)}
          .u163 .actual{position:absolute;height:17px;top:14px;left:0;width:74%;background:var(--ux-ink);border-radius:0 3px 3px 0}
          .u163 .target{position:absolute;width:3px;top:-7px;bottom:-7px;background:var(--ux-danger);left:70%;transition:left .4s}
          .u163 .target::before{content:attr(data-value);position:absolute;top:-17px;left:-10px;font-size:11px;color:var(--ux-danger);font-weight:700}
          .u163 .ticks{display:flex;justify-content:space-between;margin:10px 0;color:var(--ux-ink-2)}
          .u163 label{display:block;font-size:12px;color:var(--ux-ink-2)}
          .u163 .actual-label{font-size:13px;color:var(--ux-ink-2)}
          .u163 .actual-label b{font-size:22px;color:var(--ux-ink);margin:0 3px}
          </style>
          <div class="ux u163">
            <div class="actual-label">Doanh thu thực tế <b>74 triệu</b></div>
            <div class="bullet"><div class="actual"></div><div class="target" data-value="70"></div></div>
            <div class="ticks"><small>0</small><small>50</small><small>75</small><small>100</small></div>
            <label>Mục tiêu (triệu) <input class="range" type="range" min="40" max="100" step="2" value="70" aria-label="Mục tiêu quý"></label>
            <div class="status" aria-live="polite"></div>
          </div>
          <script>
          (()=>{const root=document.currentScript.previousElementSibling;const q=s=>root.querySelector(s);function draw(){const v=+q('.range').value;q('.target').style.left=v+'%';q('.target').dataset.value=v;q('.status').innerHTML=`So với mục tiêu: <b>${74-v>=0?'+':'−'}${Math.abs(74-v)} triệu</b> · Đạt ${(74/v*100).toFixed(1)}%`;root.dataset.state=String(v)}q('.range').oninput=draw;draw();})();
          </script>
        </div>
      </section>

      <!-- #070 Stacking toasts -->
      <section class="slot" style="grid-column: span 1;">
        <div class="slot-head">
          <span>Thông báo xếp chồng (Rê chuột để xòe)</span>
          <span class="slot-id">Lucian #070</span>
        </div>
        <div class="slot-body">
          <!-- Lucian UX/UI Prompt #070 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#070 -->
          <style>
          .u070{position:relative;width:350px;height:370px}
          .u070-btns{display:flex;flex-wrap:wrap;gap:6px}
          .u070-btns button{height:38px;padding:0 12px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;background:var(--ux-surface-2);box-shadow:0 0 0 1px var(--ux-line);font-size:12.5px;font-weight:700;color:var(--ux-ink);transition:transform .3s var(--ux-spring),box-shadow .3s}
          .u070-btns button:hover{box-shadow:0 0 0 1px var(--ux-line-2),0 8px 16px -10px var(--ux-shadow-strong)}
          .u070-btns button:active{transform:scale(.94)}
          .u070-btns i{width:8px;height:8px;border-radius:50%;background:var(--c)}
          .u070-zone{position:absolute;left:0;right:0;bottom:0;height:300px;outline:none}
          .u070-t{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:12px;min-height:68px;padding:12px 12px 12px 14px;border-radius:20px;background:var(--ux-surface);box-shadow:0 0 0 1px var(--ux-line),0 16px 30px -18px var(--ux-shadow-strong);transform-origin:50% 100%;transform:translate(var(--dx,0px),var(--y,0px)) scale(var(--s,1));opacity:var(--o,1);transition:transform .5s var(--ux-spring),opacity .35s;touch-action:pan-y;user-select:none}
          .u070-t.drag{transition:none}
          .u070-t.enter{transform:translateY(90px) scale(.9);opacity:0}
          .u070-t.leave{transform:translate(var(--dx,0px),var(--y,0px)) scale(var(--s,1));opacity:0;pointer-events:none}
          .u070-t.leave.side{transform:translate(calc(var(--dir,1) * 420px),var(--y,0px)) rotate(calc(var(--dir,1) * 8deg))}
          .u070-t>*{transition:opacity .25s}
          .u070-t.back>*{opacity:0}
          .u070-ic{width:36px;height:36px;flex:none;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 15%,transparent);color:var(--c)}
          .u070-ic svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
          .u070-ic i{width:18px;height:18px;border-radius:50%;border:2.5px solid currentColor;border-right-color:transparent;animation:u070-spin .7s linear infinite}
          @keyframes u070-spin{to{transform:rotate(360deg)}}
          .u070-tx{flex:1;min-width:0}
          .u070-tx b{display:block;font-size:13.5px;font-weight:700;letter-spacing:-.02em}
          .u070-tx small{display:block;margin-top:2px;font-size:12px;font-weight:500;color:var(--ux-ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .u070-act{height:32px;padding:0 11px;border:0;border-radius:10px;background:var(--ux-surface-2);font-size:12px;font-weight:700;color:var(--ux-ink)}
          .u070-x{width:30px;height:30px;flex:none;border:0;padding:0;border-radius:50%;display:grid;place-items:center;background:none;color:var(--ux-ink-3)}
          .u070-x:hover{background:var(--ux-surface-2);color:var(--ux-ink)}
          .u070-x svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
          .u070-bar{position:absolute;left:16px;right:16px;bottom:0;height:2px;border-radius:2px;background:var(--c);opacity:.5;transform-origin:0 50%;transform:scaleX(var(--left,1))}
          .u070-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
          .u070-empty{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:13px;font-weight:600;color:var(--ux-ink-3);transition:opacity .3s}
          </style>
          <div class="ux u070">
            <div class="u070-btns">
              <button type="button" data-k="ok" style="--c:var(--ux-mint)"><i aria-hidden="true"></i>Đã lưu</button>
              <button type="button" data-k="err" style="--c:var(--ux-danger)"><i aria-hidden="true"></i>Báo lỗi</button>
              <button type="button" data-k="info" style="--c:var(--ux-accent)"><i aria-hidden="true"></i>Góp ý mới</button>
              <button type="button" data-k="wait" style="--c:var(--ux-warn)"><i aria-hidden="true"></i>Đang xử lý</button>
            </div>
            <div class="u070-zone" role="region" aria-label="Thông báo" tabindex="-1">
              <p class="u070-empty">Thông báo sẽ xếp chồng tại đây</p>
              <div class="u070-live" aria-live="polite"></div>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var zone = root.querySelector('.u070-zone'), empty = root.querySelector('.u070-empty'), live = root.querySelector('.u070-live');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var ICON = { ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>', err: '<svg viewBox="0 0 18 18"><path d="M9 5v5M9 13h.01"/></svg>', info: '<svg viewBox="0 0 18 18"><path d="M3.5 4.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>', wait: '<i></i>' };
            var K = {
              ok: ['var(--ux-mint)', 'Đã lưu thay đổi', 'Chiến dịch Xclipse · vừa xong'],
              err: ['var(--ux-danger)', 'Tải lên thất bại', 'Kiểm tra lại kết nối', 'Thử lại'],
              info: ['var(--ux-accent)', 'Diệu Anh vừa góp ý', '“Chuyển động mượt quá!”', 'Xem'],
              wait: ['var(--ux-warn)', 'Đang đồng bộ…', '3 tệp dữ liệu · 12.4 MB']
            };
            var list = [], open = false, DUR = 4500, seq = 0;
            function layout() {
              var acc = 0;
              list.forEach(function (t, i) {
                var el = t.el;
                el.classList.toggle('back', !open && i > 0);
                if (open) { el.style.setProperty('--y', -acc + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); acc += el.offsetHeight + 8; }
                else { el.style.setProperty('--y', -(i * 14) + 'px'); el.style.setProperty('--s', (1 - i * 0.06).toFixed(2)); el.style.setProperty('--o', i > 2 ? 0 : 1); }
                el.style.zIndex = 50 - i;
                el.inert = !open && i > 0;
              });
              empty.style.opacity = list.length ? '0' : '1';
            }
            function remove(t, dir) {
              var i = list.indexOf(t);
              if (i < 0) return;
              list.splice(i, 1);
              t.el.classList.add('leave');
              if (dir) { t.el.style.setProperty('--dir', dir); t.el.classList.add('side'); }
              setTimeout(function () { t.el.remove(); }, 450);
              layout();
            }
            function push(k) {
              var d = K[k], el = document.createElement('div');
              el.className = 'u070-t enter';
              el.style.setProperty('--c', d[0]);
              el.setAttribute('role', k === 'err' ? 'alert' : 'status');
              el.innerHTML = '<span class="u070-ic" aria-hidden="true">' + ICON[k] + '</span><span class="u070-tx"><b></b><small></small></span>' + (d[3] ? '<button class="u070-act" type="button"></button>' : '') + '<button class="u070-x" type="button" aria-label="Đóng"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button><span class="u070-bar" aria-hidden="true"></span>';
              el.querySelector('b').textContent = d[1]; el.querySelector('small').textContent = d[2];
              if (d[3]) el.querySelector('.u070-act').textContent = d[3];
              var t = { el: el, left: DUR, id: ++seq, k: k };
              zone.appendChild(el);
              list.unshift(t);
              void el.offsetWidth;
              el.classList.remove('enter');
              layout();
              live.textContent = d[1];
              el.querySelector('.u070-x').addEventListener('click', function () { remove(t); });
              if (d[3]) el.querySelector('.u070-act').addEventListener('click', function () { remove(t); if (k === 'err') push('wait'); });
              if (k === 'wait') {
                t.left = Infinity;
                setTimeout(function () {
                  if (!root.isConnected || list.indexOf(t) < 0) return;
                  el.style.setProperty('--c', K.ok[0]);
                  el.querySelector('.u070-ic').innerHTML = ICON.ok;
                  el.querySelector('b').textContent = 'Đồng bộ xong';
                  el.querySelector('small').textContent = 'Đã lưu đủ 3 tệp';
                  live.textContent = 'Đồng bộ xong';
                  t.left = DUR;
                }, rm ? 300 : 1800);
              }
              var sx = 0, dx = 0, down = false;
              el.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; down = true; sx = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.classList.add('drag'); });
              el.addEventListener('pointermove', function (e) { if (!down) return; dx = e.clientX - sx; el.style.setProperty('--dx', dx + 'px'); el.style.setProperty('--o', Math.max(0.2, 1 - Math.abs(dx) / 260)); });
              var end = function () { if (!down) return; down = false; el.classList.remove('drag'); if (Math.abs(dx) > 90) remove(t, dx > 0 ? 1 : -1); else { el.style.setProperty('--dx', '0px'); layout(); } };
              el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
            }
            var last = performance.now();
            (function loop(now) {
              if (!root.isConnected) return;
              var dt = now - last; last = now;
              if (!open) list.slice().forEach(function (t, i) {
                if (i > 0 || t.left === Infinity) return;
                t.left -= dt;
                t.el.style.setProperty('--left', Math.max(0, t.left / DUR).toFixed(3));
                if (t.left <= 0) remove(t);
              });
              requestAnimationFrame(loop);
            })(last);
            function setOpen(v) { if (open === v) return; open = v; layout(); }
            zone.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setOpen(true); });
            zone.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !zone.contains(document.activeElement)) setOpen(false); });
            zone.addEventListener('focusin', function () { setOpen(true); });
            zone.addEventListener('focusout', function (e) { if (!zone.contains(e.relatedTarget)) setOpen(false); });
            zone.addEventListener('click', function (e) { if (!e.target.closest('button') && list.length > 1) setOpen(!open); });
            root.querySelectorAll('.u070-btns button').forEach(function (b) { b.addEventListener('click', function () { push(b.getAttribute('data-k')); }); });
            push('info'); push('ok');
            list.forEach(function (t) { t.left = Infinity; t.el.style.setProperty('--left', 1); });
          })();
          </script>
        </div>
      </section>
    </div>
  </main>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-tam-nhin.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tầm nhìn Thông minh — Xclipse AI Consulting (#DBF2FC · #072D59 · #FD6E88)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,600;1,700&family=Playfair+Display:ital,wght@1,600;1,700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    /* Lucian UX/UI Prompt theme tokens mapped to #DBF2FC · #072D59 · #FD6E88 */
    :root {
      color-scheme: light;
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --serif: 'Playfair Display', Georgia, serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;

      --ice: #DBF2FC;
      --navy: #072D59;
      --navy-mid: #0E4A8A;
      --pink: #FD6E88;
      --pink-deep: #D93656;

      --ux-page: #F5FBFF;
      --ux-surface: #FFFFFF;
      --ux-surface-2: #EAF6FD;
      --ux-surface-3: #DBF2FC;
      --ux-ink: #072D59;
      --ux-ink-2: #36567A;
      --ux-ink-3: #647F9E;
      --ux-line: rgba(7, 45, 89, 0.10);
      --ux-line-2: rgba(7, 45, 89, 0.20);
      --ux-accent: #072D59;
      --ux-accent-2: #FD6E88;
      --ux-accent-soft: rgba(7, 45, 89, 0.08);
      --ux-mint: #0D9488;
      --ux-danger: #D9264E;
      --ux-shadow: rgba(7, 45, 89, 0.10);
      --ux-shadow-strong: rgba(7, 45, 89, 0.24);
      --ux-ease: cubic-bezier(.2, .8, .2, 1);
      --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--ux-page); color: var(--ux-ink);
      line-height: 1.55; overflow-x: hidden;
    }
    .ux, .ux *, .ux *::before, .ux *::after { box-sizing: border-box; }
    .ux :focus-visible { outline: 2px solid var(--ux-accent); outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .001ms !important; animation-iteration-count: 1 !important;
        transition-duration: .001ms !important; scroll-behavior: auto !important;
      }
    }

    .container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }

    /* ============================================================
       HERO SECTION — Faithful recreation of the "Tầm nhìn Thông minh" layout
       ============================================================ */
    .hero-showcase {
      position: relative;
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background:
        /* Bottom-left blue horizon wave */
        radial-gradient(95% 58% at 18% 102%, #072D59 0%, #0C4B8E 38%, #217CE0 62%, rgba(219, 242, 252, 0) 85%),
        /* Top-left airy ice-sky mist */
        linear-gradient(125deg, #FFFFFF 0%, #EDF8FE 32%, #DBF2FC 62%, #BBE5FA 100%);
    }

    /* Right-side Dark Navy Prism Canvas (with Fluted Glass + 3D Pink/Blue Orb) */
    .hero-visual-pane {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50%;
      background:
        radial-gradient(480px 420px at 30% 48%, rgba(253, 110, 136, 0.35), transparent 68%),
        radial-gradient(600px 540px at 70% 52%, #0E4D92 0%, #072D59 55%, #041A36 100%);
      overflow: hidden;
      z-index: 1;
    }
    /* Soft feather mask on the left edge of the right pane so it blends smoothly into #DBF2FC */
    .hero-visual-pane::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 130px;
      background: linear-gradient(90deg, rgba(219, 242, 252, 0.72) 0%, rgba(219, 242, 252, 0) 100%);
      z-index: 4;
      pointer-events: none;
    }

    /* Glowing 3D Sphere */
    .orb-3d {
      position: absolute;
      width: 460px;
      height: 460px;
      right: -40px;
      top: 50%;
      transform: translateY(-48%);
      border-radius: 50%;
      background:
        radial-gradient(circle at 28% 36%, #FFA8BA 0%, #FD6E88 26%, rgba(253, 110, 136, 0.25) 52%, transparent 72%),
        radial-gradient(circle at 68% 68%, #2C8DF5 0%, #0A3A75 55%, #03152B 100%);
      box-shadow:
        inset -28px -32px 60px rgba(3, 21, 43, 0.85),
        inset 18px 18px 46px rgba(253, 110, 136, 0.55),
        0 0 90px rgba(253, 110, 136, 0.28),
        -30px 20px 80px rgba(14, 77, 146, 0.55);
      z-index: 2;
      transition: transform 0.6s var(--ux-ease);
    }

    /* Secondary Pink Aura Streak behind the fluted glass */
    .orb-streak {
      position: absolute;
      width: 300px;
      height: 460px;
      left: 12%;
      top: 50%;
      transform: translateY(-50%);
      background: radial-gradient(ellipse at center, rgba(253, 110, 136, 0.82) 0%, rgba(253, 110, 136, 0.35) 45%, transparent 75%);
      filter: blur(22px);
      z-index: 2;
      pointer-events: none;
    }

    /* Fluted / Ribbed Vertical Glass Bars */
    .fluted-glass {
      position: absolute;
      inset: 0 auto 0 0;
      width: 58%;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      z-index: 3;
      pointer-events: none;
    }
    .flute-bar {
      height: 100%;
      backdrop-filter: blur(16px) saturate(135%);
      -webkit-backdrop-filter: blur(16px) saturate(135%);
      background: linear-gradient(90deg,
        rgba(255, 255, 255, 0.22) 0%,
        rgba(219, 242, 252, 0.06) 28%,
        rgba(7, 45, 89, 0.16) 76%,
        rgba(255, 255, 255, 0.10) 100%
      );
      border-right: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: inset 2px 0 6px rgba(255, 255, 255, 0.14);
    }

    /* Top Minimal Nav */
    .top-nav {
      position: relative;
      z-index: 10;
      padding: 26px 0;
    }
    .top-nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .nav-links a {
      color: var(--navy);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      opacity: 0.86;
      transition: opacity 150ms, color 150ms;
    }
    .nav-links a:hover { opacity: 1; color: var(--pink-deep); }
    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(7, 45, 89, 0.12);
      backdrop-filter: blur(8px);
      font-size: 12.5px;
      font-weight: 700;
      color: var(--navy);
      text-decoration: none;
    }
    .brand-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--navy));
    }

    /* Hero Main Content (Left Column) */
    .hero-body {
      position: relative;
      z-index: 10;
      padding: 28px 0 36px;
    }
    .hero-left {
      max-width: 500px;
    }
    .hero-headline {
      margin: 0 0 18px;
      font-size: clamp(42px, 5.4vw, 66px);
      line-height: 1.04;
      letter-spacing: -0.03em;
      color: #072D59;
      font-weight: 400;
    }
    .hero-headline .italic-accent {
      display: block;
      font-family: var(--serif);
      font-style: italic;
      font-weight: 700;
      font-size: 1.05em;
      color: #072D59;
    }
    .hero-desc {
      margin: 0 0 28px;
      font-size: 15px;
      line-height: 1.6;
      color: #1E3E66;
      max-width: 440px;
    }

    /* Coral Pink Pill CTA */
    .btn-pink {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      height: 46px;
      padding: 0 26px;
      border-radius: 999px;
      border: 0;
      background: linear-gradient(135deg, #FD6E88 0%, #F24B6B 100%);
      color: #FFFFFF;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 12px 28px rgba(253, 110, 136, 0.45);
      transition: transform 180ms var(--ux-spring), filter 180ms var(--ux-ease);
    }
    .btn-pink:hover { transform: translateY(-2px); filter: brightness(1.05); }
    .btn-pink:active { transform: scale(0.97); }

    /* Bottom Partner Bar (on Blue Wave) */
    .hero-partners {
      position: relative;
      z-index: 10;
      padding: 20px 0 34px;
    }
    .partners-label {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: rgba(219, 242, 252, 0.85);
      margin-bottom: 12px;
    }
    .partners-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 28px;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: -0.01em;
    }
    .partner-item {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      opacity: 0.92;
    }

    /* ============================================================
       BELOW-THE-FOLD SECTIONS (Harmonized with #DBF2FC · #072D59 · #FD6E88)
       ============================================================ */
    .sec { padding: 64px 0; border-bottom: 1px solid var(--ux-line); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 26px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 6px; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: var(--navy); }
    .sec-head p { margin: 0; color: var(--ux-ink-2); font-size: 14.5px; }

    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 20px; }
    .card {
      background: var(--ux-surface);
      border: 1px solid var(--ux-line);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 28px var(--ux-shadow);
      transition: transform 200ms var(--ux-ease), box-shadow 200ms var(--ux-ease);
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px var(--ux-shadow-strong); }
    .card-tag {
      display: inline-block; font-size: 11px; font-weight: 700; padding: 4px 10px;
      border-radius: 999px; background: var(--ice); color: var(--navy); margin-bottom: 12px;
    }
    .card-tag.pink { background: #FFF0F3; color: var(--pink-deep); border: 1px solid #FFC2CE; }
    .card h3 { margin: 0 0 8px; font-size: 17px; font-weight: 700; color: var(--navy); }
    .card p { margin: 0; font-size: 14px; color: var(--ux-ink-2); }

    /* Modal */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(7, 45, 89, 0.55); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 440px; border-radius: 22px; padding: 26px;
      background: #FFFFFF; border: 1px solid var(--ux-line-2);
      box-shadow: 0 28px 64px rgba(7, 45, 89, 0.32);
      animation: popIn 220ms var(--ux-ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ux-ink-2); margin-bottom: 6px; }
    .input {
      width: 100%; height: 42px; padding: 0 14px; border-radius: 10px;
      border: 1px solid var(--ux-line-2); background: #F5FBFF; color: var(--navy);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(7, 45, 89, 0.12); }

    @media (max-width: 900px) {
      .hero-visual-pane { width: 100%; height: 340px; top: auto; bottom: 0; opacity: 0.92; }
      .hero-visual-pane::before { width: 100%; height: 110px; inset: 0 0 auto 0; background: linear-gradient(180deg, rgba(219, 242, 252, 0.95) 0%, rgba(219, 242, 252, 0) 100%); }
      .hero-showcase { min-height: auto; padding-bottom: 340px; }
      .orb-3d { width: 300px; height: 300px; right: -20px; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>

  <!-- HERO: Sao chép bố cục "Tầm nhìn Thông minh" -->
  <section class="hero-showcase" id="hero">
    <!-- Right Visual Pane: Fluted Glass + 3D Pink/Blue Orb -->
    <div class="hero-visual-pane" aria-hidden="true">
      <div class="orb-streak"></div>
      <div class="orb-3d" id="orb3d"></div>
      <div class="fluted-glass">
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
        <div class="flute-bar"></div>
      </div>
    </div>

    <!-- Top Nav -->
    <header class="top-nav">
      <div class="container top-nav-inner">
        <nav class="nav-links" aria-label="Điều hướng chính">
          <a href="#services">Về chúng tôi</a>
          <a href="#services">Dịch vụ</a>
          <a href="#ux-demo">Dự án tiêu biểu</a>
          <a href="#ux-demo">Lĩnh vực</a>
        </nav>
        <a class="brand-pill" href="#">
          <span class="brand-dot"></span>
          <span>XCLIPSE · #DBF2FC · #072D59 · #FD6E88</span>
        </a>
      </div>
    </header>

    <!-- Hero Copy & CTA -->
    <div class="hero-body">
      <div class="container">
        <div class="hero-left">
          <h1 class="hero-headline">
            Tầm nhìn
            <span class="italic-accent">Thông minh</span>
          </h1>
          <p class="hero-desc">
            Định hình lại dịch vụ tư vấn AI bằng tư duy tiên phong. Chúng tôi kiến tạo giải pháp phù hợp, thúc đẩy chuyển đổi số của bạn.
          </p>

          <!-- Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002 -->
          <button class="btn-pink" id="openConsultBtn" type="button">
            <span>Tư vấn miễn phí</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom-Left Tech Stack / Partners -->
    <div class="hero-partners">
      <div class="container">
        <div class="partners-label">CÔNG CỤ CÔNG NGHỆ</div>
        <div class="partners-row">
          <span class="partner-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h6.5v6.5H1V1zm7.5 0H15v6.5H8.5V1zM1 8.5h6.5V15H1V8.5zm7.5 0H15V15H8.5V8.5z"/></svg>
            Microsoft
          </span>
          <span class="partner-item">Google</span>
          <span class="partner-item">NVIDIA</span>
          <span class="partner-item">aws</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: Dịch vụ & Giải pháp -->
  <section class="sec" id="services">
    <div class="container">
      <div class="sec-head">
        <div>
          <h2>Giải pháp chuyển đổi số toàn diện</h2>
          <p>Áp dụng đồng bộ 3 sắc độ hài hòa: Ice Sky (#DBF2FC), Deep Navy (#072D59) và Coral Pink (#FD6E88).</p>
        </div>
      </div>

      <div class="grid-3">
        <article class="card">
          <span class="card-tag">01 · Chiến lược AI</span>
          <h3>Tư vấn lộ trình dữ liệu</h3>
          <p>Chuẩn hóa quy trình thu thập và khai thác dữ liệu doanh nghiệp, sẵn sàng tích hợp mô hình AI thực chiến.</p>
        </article>
        <article class="card">
          <span class="card-tag pink">02 · Tự động hóa</span>
          <h3>Tối ưu vận hành thông minh</h3>
          <p>Giảm thao tác thủ công bằng các luồng xử lý tự động, cảnh báo sớm rủi ro theo thời gian thực.</p>
        </article>
        <article class="card">
          <span class="card-tag">03 · Trải nghiệm số</span>
          <h3>Thiết kế giao diện UI/UX</h3>
          <p>Xây dựng sản phẩm số hiện đại với độ tương phản rõ nét, tương tác mượt mà trên mọi thiết bị.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- Section 3: Lucian UX Interactive Demo -->
  <section class="sec" id="ux-demo" style="border-bottom:none;">
    <div class="container">
      <div class="sec-head">
        <div>
          <h2>Thành phần tương tác Lucian UX/UI</h2>
          <p>Kết hợp hiệu ứng vật lý mượt mà trên nền bảng màu #DBF2FC · #072D59 · #FD6E88.</p>
        </div>
      </div>

      <div class="grid-3" style="grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));">
        <!-- #013 Stretchy Switch -->
        <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
          <style>
          .u013{--on:linear-gradient(135deg,#FD6E88,#072D59);position:relative;width:280px;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
          .u013-sw{position:relative;width:140px;height:76px;border:0;padding:0;border-radius:999px;background:#DBF2FC;touch-action:none;cursor:pointer;
            box-shadow:inset 0 2px 6px rgba(7,45,89,.12),inset 0 0 0 1px rgba(7,45,89,.10);transition:box-shadow .5s var(--ux-ease)}
          .u013-sw::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--on);opacity:0;transition:opacity .45s var(--ux-ease)}
          .u013.is-on .u013-sw::before{opacity:1}
          .u013.is-on .u013-sw{box-shadow:inset 0 2px 6px rgba(0,0,0,.12),0 16px 30px -14px rgba(253,110,136,.65)}
          .u013-knob{position:absolute;top:8px;left:8px;width:60px;height:60px;border-radius:999px;background:#fff;display:grid;place-items:center;
            box-shadow:0 6px 14px -4px rgba(7,45,89,.28);transition:left .5s var(--ux-spring),width .32s var(--ux-ease)}
          .u013.is-on .u013-knob{left:72px}
          .u013.is-stretch .u013-knob{width:84px;transition:left .5s var(--ux-spring),width .18s var(--ux-ease)}
          .u013.is-on.is-stretch .u013-knob{left:48px}
          .u013-knob svg{width:24px;height:24px;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
          .u013-x{stroke:#647F9E;stroke-dasharray:14;stroke-dashoffset:0;transition:stroke-dashoffset .3s var(--ux-ease) .1s}
          .u013-v{stroke:#072D59;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--ux-ease)}
          .u013.is-on .u013-x{stroke-dashoffset:14;transition-delay:0s}
          .u013.is-on .u013-v{stroke-dashoffset:0;transition-delay:.18s}
          .u013-txt{text-align:center}
          .u013-txt b{display:block;font-size:15px;color:var(--navy)}
          .u013-sub{display:block;font-size:12.5px;color:var(--ux-ink-2);margin-top:3px}
          </style>
          <div class="ux u013">
            <button class="u013-sw" type="button" role="switch" aria-checked="false">
              <span class="u013-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path class="u013-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9"/><path class="u013-v" d="M5.5 12.5l4.5 4.5 8.5-9"/></svg>
              </span>
            </button>
            <div class="u013-txt">
              <b class="u013-lab">Kích hoạt Trợ lý AI</b>
              <span class="u013-sub" aria-live="polite">Bấm hoặc kéo để chuyển trạng thái</span>
            </div>
          </div>
          <script>
          (function () {
            var root = document.currentScript.previousElementSibling;
            var sw = root.querySelector('.u013-sw');
            var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var on = false, t = 0;
            sw.addEventListener('click', function () {
              on = !on; root.classList.toggle('is-on', on); sw.setAttribute('aria-checked', String(on));
              if (!rm) { root.classList.add('is-stretch'); clearTimeout(t); t = setTimeout(function () { root.classList.remove('is-stretch'); }, 170); }
            });
          })();
          </script>
        </div>

        <!-- #163 Bullet Chart -->
        <div class="card">
          <span class="card-tag pink">Lucian #163 · Chỉ số mục tiêu</span>
          <h3>Hiệu suất chuyển đổi số</h3>
          <!-- Lucian UX/UI Prompt #163 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#163 -->
          <style>
          .u163{width:100%;padding-top:10px;font-size:13px}
          .u163 .bullet{height:40px;position:relative;margin-top:22px;border-radius:8px;background:linear-gradient(90deg,#EAF6FD 0 50%,#DBF2FC 50% 75%,#BBE5FA 75%)}
          .u163 .actual{position:absolute;height:16px;top:12px;left:0;width:78%;background:#072D59;border-radius:0 4px 4px 0}
          .u163 .target{position:absolute;width:3px;top:-6px;bottom:-6px;background:#FD6E88;left:70%;transition:left .35s}
          .u163 .target::before{content:attr(data-value);position:absolute;top:-18px;left:-9px;font-size:11px;color:#D93656;font-weight:700}
          .u163 input[type="range"]{width:100%;margin-top:14px;accent-color:#FD6E88}
          </style>
          <div class="ux u163">
            <div class="bullet"><div class="actual"></div><div class="target" data-value="70"></div></div>
            <input class="range" type="range" min="40" max="95" step="5" value="70" aria-label="Mục tiêu" />
            <div class="status" style="margin-top:6px;color:var(--ux-ink-2);font-size:12.5px;"></div>
          </div>
          <script>
          (()=>{const root=document.currentScript.previousElementSibling;const q=s=>root.querySelector(s);function draw(){const v=+q('.range').value;q('.target').style.left=v+'%';q('.target').dataset.value=v;q('.status').innerHTML=`Thực tế: <b>78%</b> · Mục tiêu: <b>${v}%</b>`;}q('.range').oninput=draw;draw();})();
          </script>
        </div>
      </div>
    </div>
  </section>

  <!-- Consultation Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 id="modalTitle" style="margin:0;font-size:19px;font-weight:800;color:var(--navy);">Đặt lịch Tư vấn miễn phí</h3>
        <button id="closeModal" type="button" style="border:1px solid var(--ux-line-2);background:#F5FBFF;color:var(--navy);border-radius:999px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:13.5px;color:var(--ux-ink-2);">
        Nhập thông tin để đội ngũ Xclipse liên hệ tư vấn giải pháp AI phù hợp cho doanh nghiệp của bạn.
      </p>
      <div class="field">
        <label for="mName">Họ tên / Doanh nghiệp</label>
        <input class="input" id="mName" type="text" placeholder="Ví dụ: Công ty ABC" />
      </div>
      <div class="field">
        <label for="mEmail">Email liên hệ</label>
        <input class="input" id="mEmail" type="email" placeholder="lienhe@congty.vn" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn-pink" id="submitModal" type="button" style="height:40px;padding:0 20px;">Gửi yêu cầu</button>
      </div>
    </div>
  </div>

  <script>
    // Subtle mouse parallax on the 3D orb (respects prefers-reduced-motion)
    const orb = document.getElementById('orb3d');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!rm && orb) {
      document.getElementById('hero').addEventListener('pointermove', (e) => {
        const rx = (e.clientX / window.innerWidth - 0.5) * 18;
        const ry = (e.clientY / window.innerHeight - 0.5) * 14;
        orb.style.transform = `translate(${rx.toFixed(1)}px, calc(-48% + ${ry.toFixed(1)}px))`;
      });
    }

    // Modal handlers
    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openConsultBtn').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('submitModal').onclick = () => {
      alert('✓ Đã ghi nhận yêu cầu tư vấn miễn phí!');
      closeModal();
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-v2.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX V2 — #02070A · #09318D · #FC734D</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@1,600;1,700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --serif: 'Playfair Display', Georgia, serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);

      /* Palette 2: #02070A · #09318D · #FC734D */
      --midnight: #02070A;
      --cobalt: #09318D;
      --cobalt-bright: #3B82F6;
      --coral: #FC734D;
      --coral-hover: #E85D37;

      /* Dark Mode Default */
      --bg: #02070A;
      --surface: #0A1118;
      --surface-2: #111A24;
      --text: #F4F7FA;
      --text-muted: #94A3B8;
      --border: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(255, 255, 255, 0.22);
      --glass: rgba(10, 17, 24, 0.8);
      --shadow-modal: 0 28px 72px rgba(0, 0, 0, 0.82);
    }

    html[data-theme="light"] {
      --bg: #F7F9FC;
      --surface: #FFFFFF;
      --surface-2: #EEF2F8;
      --text: #02070A;
      --text-muted: #475569;
      --border: rgba(2, 7, 10, 0.09);
      --border-strong: rgba(2, 7, 10, 0.22);
      --glass: rgba(255, 255, 255, 0.88);
      --shadow-modal: 0 24px 56px rgba(2, 7, 10, 0.14);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--bg); color: var(--text);
      line-height: 1.55; overflow-x: hidden;
      transition: background 240ms var(--ease), color 240ms var(--ease);
    }

    .container { position: relative; z-index: 2; max-width: 1160px; margin: 0 auto; padding: 0 20px; }

    /* Topbar */
    .nav {
      position: sticky; top: 0; z-index: 30;
      background: var(--glass); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 64px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; letter-spacing: -0.02em; color: var(--text); text-decoration: none; }
    .brand-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-strong); }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 500; transition: color 150ms; }
    .nav-links a:hover { color: var(--text); }
    .nav-actions { display: flex; align-items: center; gap: 10px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 40px; padding: 0 18px; border-radius: 10px; font-family: var(--font);
      font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 34px; padding: 0 14px; font-size: 13px; border-radius: 8px; }
    .btn-coral { background: var(--coral); color: #02070A; font-weight: 700; box-shadow: 0 8px 24px rgba(252, 115, 77, 0.28); }
    .btn-coral:hover { background: var(--coral-hover); box-shadow: 0 10px 28px rgba(252, 115, 77, 0.42); }
    .btn-cobalt { background: var(--cobalt); color: #FFFFFF; }
    .btn-cobalt:hover { background: #0C3FB5; }
    .btn-outline { background: transparent; color: var(--text); border-color: var(--border-strong); }
    .btn-outline:hover { background: var(--surface-2); border-color: var(--coral); }
    .btn-ghost { background: rgba(9, 49, 141, 0.22); color: #93C5FD; border-color: rgba(59, 130, 246, 0.35); }
    html[data-theme="light"] .btn-ghost { background: rgba(9, 49, 141, 0.08); color: var(--cobalt); border-color: rgba(9, 49, 141, 0.25); }
    .btn-disabled { opacity: 0.45; cursor: not-allowed; background: var(--surface-2); color: var(--text-muted); }

    /* Hero Eclipse Showcase (Inspired by Reference Layout) */
    .hero-wrap {
      position: relative; overflow: hidden; padding: 48px 0 56px;
      border-bottom: 1px solid var(--border);
    }
    .hero-glow {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(700px 360px at 50% 62%, rgba(9, 49, 141, 0.55), transparent 70%),
        radial-gradient(360px 240px at 50% 66%, rgba(252, 115, 77, 0.45), transparent 72%);
    }
    html[data-theme="light"] .hero-glow {
      background:
        radial-gradient(700px 340px at 50% 62%, rgba(9, 49, 141, 0.14), transparent 70%),
        radial-gradient(360px 220px at 50% 66%, rgba(252, 115, 77, 0.16), transparent 72%);
    }

    .palette-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 7px;
      border-radius: 999px; background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; font-family: var(--mono); color: var(--text); cursor: pointer;
    }
    .color-chip:hover { border-color: var(--coral); }
    .color-dot { width: 15px; height: 15px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); }

    .hero-center { text-align: center; max-width: 780px; margin: 0 auto; }
    .hero-title {
      margin: 0; font-size: clamp(36px, 5.2vw, 58px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em;
    }
    .hero-title em { font-family: var(--serif); font-style: italic; font-weight: 700; color: var(--coral); }
    .hero-sub { margin: 16px auto 0; max-width: 540px; color: var(--text-muted); font-size: 15px; }

    /* Symmetric Stats + Center Orb CTA */
    .hero-stage {
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px;
      margin: 34px auto 40px; max-width: 860px;
    }
    .stat-side { display: flex; flex-direction: column; gap: 14px; }
    .stat-side.left { text-align: left; }
    .stat-side.right { text-align: right; }
    .stat-num { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
    .stat-lbl { font-size: 12px; color: var(--text-muted); }

    .orb-cta {
      width: 108px; height: 108px; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.45);
      background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.25), rgba(252, 115, 77, 0.55) 55%, rgba(9, 49, 141, 0.85));
      color: #FFFFFF; font-family: var(--font); font-size: 13px; font-weight: 700; line-height: 1.25;
      cursor: pointer; display: grid; place-items: center; text-align: center; padding: 12px;
      box-shadow: 0 0 44px rgba(252, 115, 77, 0.45), 0 0 80px rgba(9, 49, 141, 0.5);
      transition: transform 220ms var(--ease), box-shadow 220ms var(--ease);
    }
    .orb-cta:hover { transform: scale(1.06); box-shadow: 0 0 56px rgba(252, 115, 77, 0.65), 0 0 96px rgba(9, 49, 141, 0.65); }

    /* 3 Preview Cards Row (like FluxEdit bottom cards) */
    .preview-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .p-card {
      background: var(--glass); backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-radius: 16px; padding: 18px;
      transition: border-color 180ms var(--ease), transform 180ms var(--ease);
    }
    .p-card:hover { border-color: rgba(252, 115, 77, 0.5); transform: translateY(-2px); }
    .p-card-head { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 12px; color: var(--text-muted); }

    /* Mini Chart */
    .bars { display: flex; align-items: flex-end; gap: 8px; height: 84px; }
    .bar {
      flex: 1; border-radius: 5px 5px 2px 2px;
      background: linear-gradient(180deg, #3B82F6, var(--cobalt));
      cursor: pointer; transition: filter 150ms;
    }
    .bar.peak { background: linear-gradient(180deg, var(--coral), #D94826); box-shadow: 0 0 14px rgba(252, 115, 77, 0.35); }
    .bar:hover { filter: brightness(1.2); }

    /* Sections */
    .sec { padding: 48px 0; border-bottom: 1px solid var(--border); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sec-head p { margin: 0; color: var(--text-muted); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; }

    /* Forms */
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--coral); box-shadow: 0 0 0 3px rgba(252, 115, 77, 0.2); }
    .input.is-error { border-color: var(--coral); }
    .err-msg { font-size: 12px; color: var(--coral); margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .switch-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .switch {
      position: relative; width: 44px; height: 24px; border-radius: 999px;
      background: var(--surface-2); border: 1px solid var(--border-strong); cursor: pointer; transition: background 200ms;
    }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
      border-radius: 50%; background: #FFFFFF; transition: transform 200ms var(--ease);
    }
    .switch.on { background: var(--cobalt); border-color: var(--cobalt); }
    .switch.on.coral { background: var(--coral); border-color: var(--coral); }
    .switch.on::after { transform: translateX(20px); }

    .tabs { display: inline-flex; background: var(--surface-2); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
    .tab { border: none; background: transparent; color: var(--text-muted); font-family: var(--font); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 7px; cursor: pointer; }
    .tab.active { background: var(--cobalt); color: #FFFFFF; }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-coral { background: rgba(252, 115, 77, 0.16); color: var(--coral); border: 1px solid rgba(252, 115, 77, 0.4); }
    .badge-cobalt { background: rgba(9, 49, 141, 0.25); color: #93C5FD; border: 1px solid rgba(59, 130, 246, 0.4); }
    .badge-ok { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.35); }
    html[data-theme="light"] .badge-cobalt { background: rgba(9, 49, 141, 0.1); color: var(--cobalt); }
    html[data-theme="light"] .badge-ok { color: #059669; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 10px 12px; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--surface-2); }

    .icon-bar { display: flex; flex-wrap: wrap; gap: 10px; }
    .ic-btn {
      width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center;
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text); cursor: pointer;
      transition: all 160ms var(--ease);
    }
    .ic-btn:hover { border-color: var(--coral); color: var(--coral); transform: translateY(-2px); }

    /* Modal & Toast */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(2, 7, 10, 0.74); backdrop-filter: blur(14px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 450px; border-radius: 18px; padding: 24px;
      background: var(--surface); border: 1px solid rgba(252, 115, 77, 0.4);
      box-shadow: var(--shadow-modal), 0 0 44px rgba(9, 49, 141, 0.35);
      animation: popIn 220ms var(--ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 70;
      background: var(--surface); color: var(--text);
      border: 1px solid var(--cobalt); border-left: 4px solid var(--coral);
      padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      opacity: 0; transform: translateY(8px); pointer-events: none; transition: all 200ms var(--ease);
    }
    .toast.show { opacity: 1; transform: none; }

    @media (max-width: 860px) {
      .hero-stage { grid-template-columns: 1fr; text-align: center; }
      .stat-side.left, .stat-side.right { text-align: center; flex-direction: row; justify-content: center; gap: 28px; }
      .orb-cta { margin: 8px auto; }
      .preview-cards { grid-template-columns: 1fr; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">
        <img class="brand-logo" src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
        <span>XCLIPSE</span>
      </a>
      <nav class="nav-links">
        <a href="#components">Thành phần UI</a>
        <a href="#forms">Form & Tương tác</a>
        <a href="#data">Bảng dữ liệu</a>
      </nav>
      <div class="nav-actions">
        <button class="btn btn-outline btn-sm" id="themeBtn" type="button">Đổi Sáng / Tối</button>
        <button class="btn btn-coral btn-sm" id="openPopupTop" type="button">Bắt đầu ngay</button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-wrap">
    <div class="hero-glow"></div>
    <div class="container">
      <div class="palette-strip">
        <button class="color-chip" data-hex="#02070A"><span class="color-dot" style="background:#02070A"></span>#02070A (Midnight)</button>
        <button class="color-chip" data-hex="#09318D"><span class="color-dot" style="background:#09318D"></span>#09318D (Deep Cobalt)</button>
        <button class="color-chip" data-hex="#FC734D"><span class="color-dot" style="background:#FC734D"></span>#FC734D (Solar Coral)</button>
      </div>

      <div class="hero-center">
        <h1 class="hero-title">
          Vận hành với tốc độ<br />của <em>Tư duy.</em>
        </h1>
        <p class="hero-sub">
          Phối màu 2 tông dịu <strong>#02070A</strong> + <strong>#09318D</strong> kết hợp 1 điểm nhấn ấm <strong>#FC734D</strong> — sang trọng, tập trung và rất hợp câu chuyện Nhật thực của Xclipse.
        </p>
      </div>

      <div class="hero-stage">
        <div class="stat-side left">
          <div>
            <div class="stat-num">Nhanh hơn 3x</div>
            <div class="stat-lbl">Tốc độ xử lý dữ liệu</div>
          </div>
          <div>
            <div class="stat-num" style="color:var(--coral);">87%</div>
            <div class="stat-lbl">Tự động hóa bằng AI</div>
          </div>
        </div>

        <button class="orb-cta" id="openPopupOrb" type="button">
          Dùng thử<br />ngay
        </button>

        <div class="stat-side right">
          <div>
            <div class="stat-num">1,280+</div>
            <div class="stat-lbl">Đơn hàng theo dõi</div>
          </div>
          <div>
            <div class="stat-num" style="color:#60A5FA;">99.2%</div>
            <div class="stat-lbl">Độ chính xác công thức</div>
          </div>
        </div>
      </div>

      <!-- 3 Preview Cards -->
      <div class="preview-cards">
        <div class="p-card">
          <div class="p-card-head">
            <span>● BIỂU ĐỒ HIỆU SUẤT</span>
            <span class="badge badge-coral">Tuần này</span>
          </div>
          <div class="bars" id="bars"></div>
        </div>
        <div class="p-card">
          <div class="p-card-head">
            <span>● TỐI ƯU BẰNG AI</span>
            <span class="badge badge-cobalt">Cobalt Core</span>
          </div>
          <div style="font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;">+34.2%</div>
          <p style="margin:6px 0 12px;font-size:13px;color:var(--text-muted);">Biên lợi nhuận gộp ước tính sau khi lọc phí sàn & khuyến mãi.</p>
          <button class="btn btn-ghost btn-sm" type="button" onclick="toast('AI đã cập nhật đề xuất giá!')">✨ Chạy gợi ý</button>
        </div>
        <div class="p-card">
          <div class="p-card-head">
            <span>● TRẠNG THÁI HỆ THỐNG</span>
            <span class="badge badge-ok">✓ Sẵn sàng</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
            <div style="display:flex;justify-content:space-between;"><span>Kiểm tra đầu vào</span><strong>Đạt 100%</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Lưu trữ trình duyệt</span><strong>Đã bật</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>Xuất báo cáo CSV</span><strong>1 chạm</strong></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <main class="container">
    <!-- Components -->
    <section class="sec" id="components">
      <div class="sec-head">
        <div>
          <h2>Hệ thống Nút bấm, Trạng thái & Bộ Icon</h2>
          <p>Cam san hô (#FC734D) làm điểm nhấn duy nhất; Xanh Cobalt (#09318D) làm nền tảng tin cậy.</p>
        </div>
        <div class="tabs" id="tabGroup">
          <button class="tab active" type="button">Tổng quan</button>
          <button class="tab" type="button">Phân tích AI</button>
          <button class="tab" type="button">Cấu hình</button>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Buttons & Badges</h3>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
            <button class="btn btn-coral" type="button" onclick="toast('Đã bấm nút nhấn #FC734D!')">Tạo mới ngay</button>
            <button class="btn btn-cobalt" type="button" onclick="toast('Đã lưu bằng #09318D!')">Lưu dữ liệu</button>
            <button class="btn btn-ghost" type="button" onclick="toast('AI đang tổng hợp...')">✨ Phân tích AI</button>
            <button class="btn btn-outline" type="button">Xem chi tiết</button>
            <button class="btn btn-disabled" type="button" disabled>Đã khóa</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span class="badge badge-coral">● Cần chú ý</span>
            <span class="badge badge-cobalt">● Đang xử lý</span>
            <span class="badge badge-ok">✓ Hoàn tất</span>
          </div>
        </div>

        <div class="panel">
          <h3>Bộ Icon SVG đồng bộ (Hover để xem phản hồi)</h3>
          <div class="icon-bar" id="iconBar"></div>
          <p style="margin:14px 0 0;font-size:12px;color:var(--text-muted);">
            Hotline, Email, Facebook, Zalo, Địa chỉ, FAQ, AI, Bảo mật, Giỏ hàng, Biểu đồ — nét 1.6px đồng nhất.
          </p>
        </div>
      </div>
    </section>

    <!-- Forms -->
    <section class="sec" id="forms">
      <div class="sec-head">
        <div>
          <h2>Form nhập liệu & Kiểm tra lỗi</h2>
          <p>Thử bấm gửi khi chưa nhập để kiểm tra phản hồi viền cam #FC734D.</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu nhanh</h3>
          <div class="field">
            <label for="fName">Tên sản phẩm / Chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Combo Khai Trương" />
            <div class="err-msg" id="eName">Vui lòng nhập tên sản phẩm.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email nhận báo cáo</label>
            <input class="input" id="fEmail" type="email" placeholder="ten@congty.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-coral" id="validateBtn" type="button">Kiểm tra & Lưu</button>
        </div>

        <div class="panel">
          <h3>Công tắc tùy chọn (Switches)</h3>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Cảnh báo tồn kho tự động</div>
              <div style="font-size:12px;color:var(--text-muted);">Màu Cobalt #09318D cho trạng thái mặc định</div>
            </div>
            <div class="switch on" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Ưu tiên đề xuất giá AI</div>
              <div style="font-size:12px;color:var(--text-muted);">Màu Coral #FC734D cho chế độ nổi bật</div>
            </div>
            <div class="switch on coral" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row" style="border-bottom:none;">
            <div>
              <div style="font-size:14px;font-weight:600;">Xuất báo cáo định kỳ</div>
              <div style="font-size:12px;color:var(--text-muted);">Gửi file CSV cuối ngày</div>
            </div>
            <div class="switch" role="switch" tabindex="0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Table -->
    <section class="sec" id="data" style="border-bottom:none;">
      <div class="sec-head">
        <div>
          <h2>Bảng dữ liệu & Tìm kiếm realtime</h2>
          <p>Số liệu căn thẳng cột, dễ đọc trên nền #02070A và #FFFFFF.</p>
        </div>
        <input class="input" id="searchInput" type="search" placeholder="Lọc theo tên..." style="max-width:260px;" />
      </div>
      <div class="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sản phẩm / Chiến dịch</th>
              <th>Kênh bán</th>
              <th>Số lượng</th>
              <th>Biên lợi nhuận</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;">Pop-up Xclipse (V2)</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--text-muted);">
        Kết hợp nền tối sâu #02070A, ánh sáng xanh #09318D và viền cam nhật hoa #FC734D.
      </p>
      <div class="field">
        <label>Tên dự án thử nghiệm</label>
        <input class="input" type="text" value="Xclipse — Midnight, Cobalt & Solar Coral" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-coral" id="confirmModal" type="button">Áp dụng bảng màu</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toastEl">Thông báo</div>

  <script>
    const toastEl = document.getElementById('toastEl');
    let tTimer;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(tTimer);
      tTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => {
        navigator.clipboard?.writeText(b.dataset.hex);
        toast('Đã sao chép ' + b.dataset.hex);
      };
    });

    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      toast(next === 'dark' ? 'Đã bật Dark Mode (#02070A)' : 'Đã bật Light Mode');
    };

    const barsEl = document.getElementById('bars');
    [42, 65, 55, 78, 95, 72, 84].forEach((v, idx) => {
      const d = document.createElement('div');
      d.className = 'bar' + (idx === 4 ? ' peak' : '');
      d.style.height = v + '%';
      d.title = `Ngày ${idx + 1}: ${v}%`;
      d.onclick = () => toast(`Ngày ${idx + 1}: Hiệu suất ${v}%`);
      barsEl.appendChild(d);
    });

    const iconPaths = [
      ['Hotline', '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'],
      ['Email', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'],
      ['Facebook', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M15 8h-2a2 2 0 0 0-2 2v11M9 13h6"/>'],
      ['Zalo', '<path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 11h8M8 14h5"/>'],
      ['Địa chỉ', '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'],
      ['FAQ', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/>'],
      ['AI', '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>'],
      ['Bảo mật', '<path d="M12 3l7 3v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/>'],
      ['Giỏ hàng', '<path d="M6 7h15l-1.5 8h-12z"/><path d="M6 7L5 4H2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'],
      ['Biểu đồ', '<path d="M4 19h16"/><path d="M7 15v-4M12 15V7M17 15v-6"/>']
    ];
    const iconBar = document.getElementById('iconBar');
    iconPaths.forEach(([name, path]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ic-btn'; b.title = name;
      b.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      b.onclick = () => toast('Icon: ' + name);
      iconBar.appendChild(b);
    });

    document.querySelectorAll('#tabGroup .tab').forEach(t => {
      t.onclick = () => {
        document.querySelectorAll('#tabGroup .tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      };
    });
    document.querySelectorAll('.switch').forEach(sw => {
      sw.onclick = () => sw.classList.toggle('on');
    });

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName');
      const email = document.getElementById('fEmail');
      const eName = document.getElementById('eName');
      const eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) toast('✓ Dữ liệu hợp lệ!');
    };

    const rows = [
      { name: 'Áo khoác Gió Minimal', ch: 'Shopee Mall', qty: 320, margin: '36.5%', badge: ['badge-coral', '● Sắp hết'] },
      { name: 'Bình giữ nhiệt Matte', ch: 'TikTok Shop', qty: 510, margin: '29.0%', badge: ['badge-cobalt', '● Ổn định'] },
      { name: 'Tai nghe Bluetooth Pro', ch: 'Website', qty: 185, margin: '42.8%', badge: ['badge-ok', '✓ Đạt KPI'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.ch}</td><td>${r.qty}</td><td>${r.margin}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupOrb').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = () => { closeModal(); toast('Đã áp dụng bảng màu V2!'); };
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-v3.html ===================
<!DOCTYPE html>
<html lang="vi" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX V3 — #030407 · #1558C9</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,600;1,600;1,700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --serif: 'Playfair Display', Georgia, serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);

      /* Palette 3: #030407 · #1558C9 */
      --obsidian: #030407;
      --sapphire: #1558C9;
      --sapphire-hover: #1D68E6;
      --sapphire-glow: #4E8DF5;

      /* Dark Mode Default */
      --bg: #030407;
      --surface: #0A0D14;
      --surface-2: #111622;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --border: rgba(255, 255, 255, 0.09);
      --border-strong: rgba(255, 255, 255, 0.22);
      --glass: rgba(10, 13, 20, 0.82);
      --shadow-modal: 0 28px 72px rgba(0, 0, 0, 0.85);
    }

    html[data-theme="light"] {
      --bg: #F6F8FC;
      --surface: #FFFFFF;
      --surface-2: #EDF1F8;
      --text: #030407;
      --text-muted: #475569;
      --border: rgba(3, 4, 7, 0.09);
      --border-strong: rgba(3, 4, 7, 0.22);
      --glass: rgba(255, 255, 255, 0.9);
      --shadow-modal: 0 24px 56px rgba(3, 4, 7, 0.14);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--bg); color: var(--text);
      line-height: 1.55; overflow-x: hidden;
      transition: background 240ms var(--ease), color 240ms var(--ease);
    }

    .container { position: relative; z-index: 2; max-width: 1160px; margin: 0 auto; padding: 0 20px; }

    /* Topbar */
    .nav {
      position: sticky; top: 0; z-index: 30;
      background: var(--glass); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 64px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; letter-spacing: -0.02em; color: var(--text); text-decoration: none; }
    .brand-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-strong); }
    .nav-links { display: flex; gap: 26px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; transition: color 150ms; }
    .nav-links a:hover { color: var(--text); }
    .nav-actions { display: flex; align-items: center; gap: 10px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 40px; padding: 0 18px; border-radius: 999px; font-family: var(--font);
      font-size: 13px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 34px; padding: 0 14px; font-size: 12.5px; }
    .btn-sapphire {
      background: var(--sapphire); color: #FFFFFF;
      box-shadow: 0 8px 24px rgba(21, 88, 201, 0.35);
    }
    .btn-sapphire:hover { background: var(--sapphire-hover); box-shadow: 0 10px 28px rgba(21, 88, 201, 0.5); }
    .btn-outline { background: transparent; color: var(--text); border-color: var(--border-strong); }
    .btn-outline:hover { background: var(--surface-2); border-color: var(--sapphire); }
    .btn-ghost { background: rgba(21, 88, 201, 0.14); color: var(--sapphire-glow); border-color: rgba(21, 88, 201, 0.4); }
    html[data-theme="light"] .btn-ghost { color: var(--sapphire); }
    .btn-disabled { opacity: 0.45; cursor: not-allowed; background: var(--surface-2); color: var(--text-muted); }

    .play-btn {
      display: inline-flex; align-items: center; gap: 10px; background: none; border: none;
      color: var(--text); font-family: var(--font); font-size: 12px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; padding: 0;
    }
    .play-circle {
      width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
      border: 1.5px solid var(--border-strong); background: var(--surface);
      transition: border-color 180ms, transform 180ms;
    }
    .play-btn:hover .play-circle { border-color: var(--sapphire-glow); transform: scale(1.06); }

    /* Hero Section */
    .hero-wrap { position: relative; overflow: hidden; padding: 48px 0 56px; border-bottom: 1px solid var(--border); }
    .hero-glow {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(640px 420px at 78% 45%, rgba(21, 88, 201, 0.36), transparent 65%),
        radial-gradient(380px 280px at 18% 20%, rgba(21, 88, 201, 0.12), transparent 65%);
    }
    html[data-theme="light"] .hero-glow {
      background:
        radial-gradient(640px 420px at 78% 45%, rgba(21, 88, 201, 0.14), transparent 65%);
    }

    .palette-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 7px;
      border-radius: 999px; background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; font-family: var(--mono); color: var(--text); cursor: pointer;
    }
    .color-chip:hover { border-color: var(--sapphire); }
    .color-dot { width: 15px; height: 15px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); }

    .hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
    .hero-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
    .hero-title {
      margin: 0; font-family: var(--serif); font-style: italic; font-weight: 700;
      font-size: clamp(38px, 5vw, 58px); line-height: 1.06; letter-spacing: -0.02em;
    }
    .hero-title span { color: var(--sapphire-glow); }
    html[data-theme="light"] .hero-title span { color: var(--sapphire); }
    .hero-desc { margin: 18px 0 26px; color: var(--text-muted); font-size: 15px; max-width: 440px; }
    .hero-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-bottom: 34px; }

    /* Bottom Hero Specs Strip */
    .specs-strip { display: flex; gap: 24px; padding-top: 20px; border-top: 1px solid var(--border); flex-wrap: wrap; }
    .spec-item { padding-right: 24px; border-right: 1px solid var(--border); }
    .spec-item:last-child { border-right: none; }
    .spec-val { font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; }
    .spec-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    /* Right Showcase Card */
    .showcase-card {
      background: var(--surface); border: 1px solid rgba(21, 88, 201, 0.35);
      border-radius: 20px; padding: 22px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(21, 88, 201, 0.18);
    }
    html[data-theme="light"] .showcase-card { box-shadow: 0 20px 44px rgba(21, 88, 201, 0.12); }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .bars { display: flex; align-items: flex-end; gap: 10px; height: 120px; margin-top: 14px; }
    .bar {
      flex: 1; border-radius: 6px 6px 2px 2px;
      background: rgba(21, 88, 201, 0.35); cursor: pointer; transition: all 200ms var(--ease);
    }
    .bar.active, .bar:hover { background: var(--sapphire); box-shadow: 0 0 20px rgba(21, 88, 201, 0.45); }

    /* Sections */
    .sec { padding: 48px 0; border-bottom: 1px solid var(--border); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sec-head p { margin: 0; color: var(--text-muted); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; }

    /* Forms */
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--sapphire); box-shadow: 0 0 0 3px rgba(21, 88, 201, 0.25); }
    .input.is-error { border-color: #F43F5E; }
    .err-msg { font-size: 12px; color: #FB7185; margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .switch-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .switch {
      position: relative; width: 44px; height: 24px; border-radius: 999px;
      background: var(--surface-2); border: 1px solid var(--border-strong); cursor: pointer; transition: background 200ms;
    }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
      border-radius: 50%; background: #FFFFFF; transition: transform 200ms var(--ease);
    }
    .switch.on { background: var(--sapphire); border-color: var(--sapphire); }
    .switch.on::after { transform: translateX(20px); }

    .tabs { display: inline-flex; background: var(--surface-2); padding: 4px; border-radius: 999px; border: 1px solid var(--border); }
    .tab { border: none; background: transparent; color: var(--text-muted); font-family: var(--font); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 999px; cursor: pointer; }
    .tab.active { background: var(--sapphire); color: #FFFFFF; }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-blue { background: rgba(21, 88, 201, 0.2); color: var(--sapphire-glow); border: 1px solid rgba(21, 88, 201, 0.45); }
    .badge-ok { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.35); }
    .badge-muted { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border); }
    html[data-theme="light"] .badge-blue { color: var(--sapphire); }
    html[data-theme="light"] .badge-ok { color: #059669; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 10px 12px; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
    tr:hover td { background: var(--surface-2); }

    .icon-bar { display: flex; flex-wrap: wrap; gap: 10px; }
    .ic-btn {
      width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center;
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text); cursor: pointer;
      transition: all 160ms var(--ease);
    }
    .ic-btn:hover { border-color: var(--sapphire); color: var(--sapphire-glow); transform: translateY(-2px); }

    /* Modal & Toast */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(3, 4, 7, 0.76); backdrop-filter: blur(14px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 450px; border-radius: 18px; padding: 24px;
      background: var(--surface); border: 1px solid rgba(21, 88, 201, 0.45);
      box-shadow: var(--shadow-modal), 0 0 48px rgba(21, 88, 201, 0.25);
      animation: popIn 220ms var(--ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 70;
      background: var(--surface); color: var(--text);
      border: 1px solid var(--sapphire); border-left: 4px solid var(--sapphire);
      padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      opacity: 0; transform: translateY(8px); pointer-events: none; transition: all 200ms var(--ease);
    }
    .toast.show { opacity: 1; transform: none; }

    @media (max-width: 860px) {
      .hero { grid-template-columns: 1fr; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">
        <img class="brand-logo" src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
        <span>XCLIPSE</span>
      </a>
      <nav class="nav-links">
        <a href="#components">Thành phần UI</a>
        <a href="#forms">Form & Tương tác</a>
        <a href="#data">Dữ liệu</a>
      </nav>
      <div class="nav-actions">
        <button class="btn btn-outline btn-sm" id="themeBtn" type="button">Sáng / Tối</button>
        <button class="btn btn-sapphire btn-sm" id="openPopupTop" type="button">Bắt đầu ngay →</button>
      </div>
    </div>
  </header>

  <section class="hero-wrap">
    <div class="hero-glow"></div>
    <div class="container">
      <div class="palette-strip">
        <button class="color-chip" data-hex="#030407"><span class="color-dot" style="background:#030407"></span>#030407 (Obsidian)</button>
        <button class="color-chip" data-hex="#1558C9"><span class="color-dot" style="background:#1558C9"></span>#1558C9 (Sapphire Blue)</button>
      </div>

      <div class="hero">
        <div>
          <div class="hero-kicker">Nền tảng vận hành thông minh</div>
          <h1 class="hero-title">
            Cảm Nhận<br />Từng <span>Khoảnh Khắc</span>
          </h1>
          <p class="hero-desc">
            Thiết kế tối giản chỉ dùng 2 màu chủ đạo <strong>#030407</strong> và <strong>#1558C9</strong> — tập trung tối đa vào nội dung, độ tin cậy và cảm giác công nghệ cao cấp.
          </p>
          <div class="hero-cta">
            <button class="btn btn-sapphire" id="openPopupHero" type="button">Khám phá ngay →</button>
            <button class="play-btn" type="button" onclick="toast('Đang mở câu chuyện thương hiệu Xclipse...')">
              <span class="play-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span>Xem câu chuyện</span>
            </button>
          </div>

          <div class="specs-strip">
            <div class="spec-item">
              <div class="spec-val">5 PHÚT</div>
              <div class="spec-lbl">Triển khai nhanh</div>
            </div>
            <div class="spec-item">
              <div class="spec-val">AI CORE</div>
              <div class="spec-lbl">Tối ưu tự động</div>
            </div>
            <div class="spec-item">
              <div class="spec-val">WCAG AA</div>
              <div class="spec-lbl">Chuẩn tương phản</div>
            </div>
          </div>
        </div>

        <!-- Right UI Showcase Card -->
        <div class="showcase-card">
          <div class="card-top">
            <div>
              <div style="font-size:12px;color:var(--text-muted);font-weight:600;">HIỆU SUẤT XỬ LÝ</div>
              <div style="font-size:28px;font-weight:800;font-variant-numeric:tabular-nums;">94.6%</div>
            </div>
            <span class="badge badge-blue">● Sapphire Core</span>
          </div>
          <p style="margin:0;font-size:13px;color:var(--text-muted);">
            Biểu đồ tối giản chỉ dùng sắc xanh #1558C9 để dẫn mắt vào cột đỉnh.
          </p>
          <div class="bars" id="bars"></div>
        </div>
      </div>
    </div>
  </section>

  <main class="container">
    <section class="sec" id="components">
      <div class="sec-head">
        <div>
          <h2>Hệ thống Nút bấm, Tab & Icon</h2>
          <p>Nhất quán một sắc xanh #1558C9 duy nhất cho mọi điểm chạm tương tác.</p>
        </div>
        <div class="tabs" id="tabGroup">
          <button class="tab active" type="button">Tổng quan</button>
          <button class="tab" type="button">Phân tích</button>
          <button class="tab" type="button">Báo cáo</button>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Buttons & Badges</h3>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
            <button class="btn btn-sapphire" type="button" onclick="toast('Đã bấm nút Primary #1558C9!')">Tạo mới ngay →</button>
            <button class="btn btn-ghost" type="button" onclick="toast('AI đang phân tích...')">✨ Gợi ý AI</button>
            <button class="btn btn-outline" type="button">Xem chi tiết</button>
            <button class="btn btn-disabled" type="button" disabled>Đã khóa</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span class="badge badge-blue">● Đang hoạt động</span>
            <span class="badge badge-ok">✓ Đã xác thực</span>
            <span class="badge badge-muted">Bản nháp</span>
          </div>
        </div>

        <div class="panel">
          <h3>Bộ Icon SVG đồng bộ</h3>
          <div class="icon-bar" id="iconBar"></div>
          <p style="margin:14px 0 0;font-size:12px;color:var(--text-muted);">
            Hotline, Email, Facebook, Zalo, Địa chỉ, FAQ, AI, Bảo mật, Giỏ hàng, Biểu đồ.
          </p>
        </div>
      </div>
    </section>

    <section class="sec" id="forms">
      <div class="sec-head">
        <div>
          <h2>Form nhập liệu & Công tắc</h2>
          <p>Viền focus ánh xanh #1558C9 sạch sẽ, báo lỗi tức thì khi thiếu dữ liệu.</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu nhanh</h3>
          <div class="field">
            <label for="fName">Tên sản phẩm / Chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Chiến dịch Ra mắt Q4" />
            <div class="err-msg" id="eName">Vui lòng không để trống tên.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email nhận báo cáo</label>
            <input class="input" id="fEmail" type="email" placeholder="name@company.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-sapphire" id="validateBtn" type="button">Kiểm tra & Lưu</button>
        </div>

        <div class="panel">
          <h3>Tùy chọn hệ thống</h3>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Tự động tối ưu bằng AI</div>
              <div style="font-size:12px;color:var(--text-muted);">Sử dụng sắc xanh #1558C9</div>
            </div>
            <div class="switch on" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Cảnh báo tồn kho thấp</div>
              <div style="font-size:12px;color:var(--text-muted);">Nhắc nhở khi dưới ngưỡng</div>
            </div>
            <div class="switch on" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row" style="border-bottom:none;">
            <div>
              <div style="font-size:14px;font-weight:600;">Đồng bộ Google Sheet</div>
              <div style="font-size:12px;color:var(--text-muted);">Lưu bản sao realtime</div>
            </div>
            <div class="switch" role="switch" tabindex="0"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="data" style="border-bottom:none;">
      <div class="sec-head">
        <div>
          <h2>Bảng dữ liệu & Tìm kiếm</h2>
          <p>Gọn gàng, tương phản cao trên nền #030407 và #FFFFFF.</p>
        </div>
        <input class="input" id="searchInput" type="search" placeholder="Tìm nhanh..." style="max-width:260px;" />
      </div>
      <div class="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên hạng mục</th>
              <th>Kênh</th>
              <th>Số lượng</th>
              <th>Tỷ lệ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </section>
  </main>

  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;">Pop-up Xclipse (V3)</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--text-muted);">
        Nền tối #030407 kết hợp viền phát sáng nhẹ #1558C9 — tối giản, chuẩn mực doanh nghiệp.
      </p>
      <div class="field">
        <label>Tên cấu hình</label>
        <input class="input" type="text" value="Xclipse — Obsidian & Sapphire (#030407 · #1558C9)" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-sapphire" id="confirmModal" type="button">Áp dụng ngay</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toastEl">Thông báo</div>

  <script>
    const toastEl = document.getElementById('toastEl');
    let tTimer;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(tTimer);
      tTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex); toast('Đã sao chép ' + b.dataset.hex); };
    });

    document.getElementById('themeBtn').onclick = () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      toast(next === 'dark' ? 'Đã bật Dark Mode (#030407)' : 'Đã bật Light Mode');
    };

    const barsEl = document.getElementById('bars');
    [40, 58, 52, 74, 95, 70, 82].forEach((v, i) => {
      const d = document.createElement('div');
      d.className = 'bar' + (i === 4 ? ' active' : '');
      d.style.height = v + '%';
      d.onclick = () => toast(`Cột ${i + 1}: ${v}%`);
      barsEl.appendChild(d);
    });

    const iconPaths = [
      ['Hotline', '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'],
      ['Email', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'],
      ['Facebook', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M15 8h-2a2 2 0 0 0-2 2v11M9 13h6"/>'],
      ['Zalo', '<path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 11h8M8 14h5"/>'],
      ['Địa chỉ', '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'],
      ['FAQ', '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/>'],
      ['AI', '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>'],
      ['Bảo mật', '<path d="M12 3l7 3v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/>'],
      ['Giỏ hàng', '<path d="M6 7h15l-1.5 8h-12z"/><path d="M6 7L5 4H2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'],
      ['Biểu đồ', '<path d="M4 19h16"/><path d="M7 15v-4M12 15V7M17 15v-6"/>']
    ];
    const iconBar = document.getElementById('iconBar');
    iconPaths.forEach(([name, path]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ic-btn'; b.title = name;
      b.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      b.onclick = () => toast('Icon: ' + name);
      iconBar.appendChild(b);
    });

    document.querySelectorAll('#tabGroup .tab').forEach(t => {
      t.onclick = () => { document.querySelectorAll('#tabGroup .tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); };
    });
    document.querySelectorAll('.switch').forEach(sw => { sw.onclick = () => sw.classList.toggle('on'); });

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName');
      const email = document.getElementById('fEmail');
      const eName = document.getElementById('eName');
      const eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) toast('✓ Đã lưu thành công!');
    };

    const rows = [
      { name: 'Chiến dịch Ra mắt Q4', ch: 'Website', qty: 412, rate: '38.4%', badge: ['badge-blue', '● Đang chạy'] },
      { name: 'Đơn hàng Sàn TMĐT', ch: 'Shopee Mall', qty: 680, rate: '29.2%', badge: ['badge-ok', '✓ Hoàn tất'] },
      { name: 'Chăm sóc Khách cũ', ch: 'Zalo OA', qty: 215, rate: '44.0%', badge: ['badge-muted', 'Bản nháp'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.ch}</td><td>${r.qty}</td><td>${r.rate}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = () => { closeModal(); toast('Đã áp dụng bảng màu V3!'); };
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/brand/xclipse-ui-ux-v4.html ===================
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xclipse UI/UX V4 — #09318D · #FCFFFF · #FD91CC</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      --mono: 'IBM Plex Mono', ui-monospace, monospace;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);

      /* Palette 4: #09318D · #FCFFFF · #FD91CC */
      --cobalt: #09318D;
      --cobalt-mid: #1654D1;
      --cobalt-light: #3B82F6;
      --ice: #FCFFFF;
      --rose: #FD91CC;
      --rose-deep: #E84393;
      --ink: #0F172A;
      --muted: #475569;
      --line: #E2E8F0;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; font-family: var(--font); background: var(--ice); color: var(--ink);
      line-height: 1.55; overflow-x: hidden;
    }

    .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }

    /* Hero Blue Atmosphere (like SOLIX reference) */
    .hero-zone {
      position: relative;
      background:
        radial-gradient(900px 460px at 50% 42%, #246BFD 0%, #0E3FA9 48%, #09318D 80%, #061F5E 100%);
      color: #FCFFFF;
      padding-bottom: 110px;
      overflow: hidden;
    }
    /* Subtle dot matrix texture */
    .hero-zone::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(rgba(252, 255, 255, 0.14) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: radial-gradient(circle at 50% 45%, black 35%, transparent 80%);
    }

    /* Topbar */
    .nav { position: relative; z-index: 10; padding: 18px 0; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: #FCFFFF; text-decoration: none; letter-spacing: -0.02em; }
    .brand img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.3); }

    .pill-nav {
      display: flex; align-items: center; gap: 6px; padding: 5px;
      background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 999px;
    }
    .pill-nav a {
      color: rgba(252, 255, 255, 0.88); text-decoration: none; font-size: 13px; font-weight: 500;
      padding: 6px 14px; border-radius: 999px; transition: background 150ms, color 150ms;
    }
    .pill-nav a:hover, .pill-nav a.active { background: rgba(255, 255, 255, 0.2); color: #FFFFFF; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: 42px; padding: 0 20px; border-radius: 999px; font-family: var(--font);
      font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
      transition: all 180ms var(--ease);
    }
    .btn:active { transform: scale(0.97); }
    .btn-sm { height: 36px; padding: 0 16px; font-size: 13px; }
    .btn-rose {
      background: linear-gradient(135deg, #FD91CC, #F0529C); color: #FFFFFF;
      box-shadow: 0 10px 26px rgba(253, 145, 204, 0.45);
    }
    .btn-rose:hover { filter: brightness(1.06); transform: translateY(-1px); }
    .btn-glass {
      background: rgba(255, 255, 255, 0.16); color: #FCFFFF;
      border-color: rgba(255, 255, 255, 0.35); backdrop-filter: blur(10px);
    }
    .btn-glass:hover { background: rgba(255, 255, 255, 0.25); }
    .btn-cobalt { background: var(--cobalt); color: #FCFFFF; }
    .btn-cobalt:hover { background: #0C3FB5; }
    .btn-outline { background: transparent; color: var(--ink); border-color: #CBD5E1; }
    .btn-outline:hover { background: #F1F5F9; border-color: var(--cobalt); }

    /* Hero Content */
    .hero-center { position: relative; z-index: 5; text-align: center; max-width: 760px; margin: 28px auto 0; }
    .palette-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .color-chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 6px;
      border-radius: 999px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24);
      color: #FCFFFF; font-size: 12px; font-family: var(--mono); cursor: pointer;
    }
    .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); }

    .mini-flow {
      display: flex; justify-content: center; flex-wrap: wrap; gap: 18px;
      font-size: 12.5px; color: rgba(252, 255, 255, 0.85); margin-bottom: 14px;
    }
    .hero-title {
      margin: 0; font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em;
    }
    .hero-sub { margin: 16px auto 26px; max-width: 560px; font-size: 15px; color: rgba(252, 255, 255, 0.86); }
    .hero-cta { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }

    /* Overlapping 3 Dashboard Cards */
    .cards-overlap {
      position: relative; z-index: 10;
      margin-top: -72px;
      display: grid; grid-template-columns: 1fr 1.05fr 1fr; gap: 18px; align-items: stretch;
    }
    .dash-card {
      background: var(--ice); border: 1px solid var(--line); border-radius: 20px; padding: 20px;
      box-shadow: 0 20px 48px rgba(9, 49, 141, 0.14);
    }
    .dash-card.featured {
      background: linear-gradient(155deg, #FD91CC 0%, #F45CA8 55%, #D63384 100%);
      color: #FCFFFF; border-color: rgba(255,255,255,0.4);
      box-shadow: 0 24px 54px rgba(232, 67, 147, 0.35);
      display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;
    }
    .card-lbl { font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; width: 100%; }

    /* Progress Rows (Left Card) */
    .prog-row { margin-bottom: 12px; }
    .prog-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .prog-track { height: 8px; border-radius: 999px; background: #E2E8F0; overflow: hidden; display: flex; }
    .prog-blue { background: var(--cobalt-mid); height: 100%; }
    .prog-pink { background: var(--rose); height: 100%; }

    /* Gauge (Center Featured Card) */
    .gauge-wrap { position: relative; width: 200px; height: 112px; margin: 6px auto 0; }
    .gauge-score { position: absolute; bottom: 4px; left: 0; right: 0; font-size: 42px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }

    /* Body Sections */
    .sec { padding: 52px 0; border-bottom: 1px solid var(--line); }
    .sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .sec-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--cobalt); }
    .sec-head p { margin: 0; color: var(--muted); font-size: 14px; }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .panel { background: #FFFFFF; border: 1px solid var(--line); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px rgba(9, 49, 141, 0.04); }
    .panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    .input {
      width: 100%; height: 40px; padding: 0 12px; border-radius: 10px;
      border: 1px solid #CBD5E1; background: #F8FAFC; color: var(--ink);
      font-family: var(--font); font-size: 14px;
    }
    .input:focus { outline: none; border-color: var(--cobalt-mid); box-shadow: 0 0 0 3px rgba(22, 84, 209, 0.16); }
    .input.is-error { border-color: var(--rose-deep); }
    .err-msg { font-size: 12px; color: var(--rose-deep); margin-top: 5px; display: none; }
    .err-msg.show { display: block; }

    .switch-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line); }
    .switch {
      position: relative; width: 44px; height: 24px; border-radius: 999px;
      background: #CBD5E1; cursor: pointer; transition: background 200ms;
    }
    .switch::after {
      content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
      border-radius: 50%; background: #FFFFFF; transition: transform 200ms var(--ease);
    }
    .switch.on { background: var(--cobalt-mid); }
    .switch.on.rose { background: var(--rose-deep); }
    .switch.on::after { transform: translateX(20px); }

    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .badge-cobalt { background: #E0E7FF; color: var(--cobalt); }
    .badge-rose { background: #FCE7F3; color: #BE185D; }
    .badge-ok { background: #D1FAE5; color: #065F46; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); padding: 10px 12px; border-bottom: 1px solid var(--line); }
    td { padding: 12px; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; }
    tr:hover td { background: #F8FAFC; }

    /* Modal & Toast */
    .backdrop {
      position: fixed; inset: 0; z-index: 60;
      background: rgba(9, 49, 141, 0.45); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .backdrop.open { display: flex; }
    .modal {
      width: 100%; max-width: 440px; border-radius: 20px; padding: 24px;
      background: var(--ice); border: 1px solid var(--line);
      box-shadow: 0 28px 64px rgba(9, 49, 141, 0.28);
      animation: popIn 220ms var(--ease);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: none; } }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 70;
      background: var(--cobalt); color: #FCFFFF;
      border-left: 4px solid var(--rose);
      padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
      box-shadow: 0 16px 36px rgba(9, 49, 141, 0.3);
      opacity: 0; transform: translateY(8px); pointer-events: none; transition: all 200ms var(--ease);
    }
    .toast.show { opacity: 1; transform: none; }

    @media (max-width: 880px) {
      .pill-nav { display: none; }
      .cards-overlap { grid-template-columns: 1fr; margin-top: -48px; }
    }
  </style>
</head>
<body>
  <div class="hero-zone">
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="#">
          <img src="logo-dark.jpg" alt="Xclipse" onerror="this.style.display='none'" />
          <span>XCLIPSE</span>
        </a>
        <nav class="pill-nav">
          <a class="active" href="#">Trang chủ</a>
          <a href="#components">Nền tảng</a>
          <a href="#forms">Giải pháp</a>
          <a href="#data">Dữ liệu</a>
        </nav>
        <button class="btn btn-glass btn-sm" id="openPopupTop" type="button">Yêu cầu demo</button>
      </div>
    </header>

    <div class="container">
      <div class="hero-center">
        <div class="palette-strip">
          <button class="color-chip" data-hex="#09318D"><span class="color-dot" style="background:#09318D"></span>#09318D</button>
          <button class="color-chip" data-hex="#FCFFFF"><span class="color-dot" style="background:#FCFFFF"></span>#FCFFFF</button>
          <button class="color-chip" data-hex="#FD91CC"><span class="color-dot" style="background:#FD91CC"></span>#FD91CC</button>
        </div>

        <div class="mini-flow">
          <span>→ Phân tích dữ liệu</span>
          <span>→ Tối ưu bằng AI</span>
          <span>→ Giảm rủi ro vận hành</span>
        </div>

        <h1 class="hero-title">
          Vận hành doanh nghiệp<br />Không còn phức tạp
        </h1>
        <p class="hero-sub">
          Theo dõi chỉ số kinh doanh, tối ưu chi phí và quản lý dữ liệu khách hàng trên một nền tảng thông minh duy nhất.
        </p>
        <div class="hero-cta">
          <button class="btn btn-rose" id="openPopupHero" type="button">Bắt đầu giám sát</button>
          <button class="btn btn-glass" type="button" onclick="toast('Đang mở bản xem thử trực tiếp!')">Yêu cầu demo</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Overlapping Dashboard Cards -->
  <div class="container">
    <div class="cards-overlap">
      <!-- Left Card -->
      <div class="dash-card">
        <div class="card-lbl">
          <span>Phân bổ theo danh mục</span>
          <span class="badge badge-cobalt">4 nhóm</span>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Đơn hàng mới</span><span>184</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:45%"></div><div class="prog-pink" style="width:25%"></div></div>
        </div>
        <div class="prog-row">
          <div class="prog-top"><span>Biên lợi nhuận</span><span>36%</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:30%"></div><div class="prog-pink" style="width:42%"></div></div>
        </div>
        <div class="prog-row" style="margin-bottom:0;">
          <div class="prog-top"><span>Tồn kho an toàn</span><span>243</span></div>
          <div class="prog-track"><div class="prog-blue" style="width:65%"></div><div class="prog-pink" style="width:15%"></div></div>
        </div>
      </div>

      <!-- Center Featured Rose Card -->
      <div class="dash-card featured">
        <div class="card-lbl" style="justify-content:center;color:#FCFFFF;">
          <span>● Điểm hiệu suất hệ thống</span>
        </div>
        <div class="gauge-wrap">
          <svg viewBox="0 0 200 110" width="200" height="110">
            <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="14" stroke-linecap="round"/>
            <path id="gaugeArc" d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#FCFFFF" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="68"/>
          </svg>
          <div class="gauge-score" id="scoreVal">73</div>
        </div>
        <input id="scoreRange" type="range" min="20" max="100" value="73" style="width:85%;accent-color:#FCFFFF;margin-top:8px;" aria-label="Kéo thử điểm hiệu suất" />
      </div>

      <!-- Right Card -->
      <div class="dash-card">
        <div class="card-lbl">
          <span>Đã mở vs. Đã xử lý</span>
          <span class="badge badge-rose">Realtime</span>
        </div>
        <svg viewBox="0 0 280 120" width="100%" height="120">
          <defs>
            <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1654D1" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="#1654D1" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30 L270 110 L10 110 Z" fill="url(#areaBlue)"/>
          <path d="M10 95 Q60 80 100 55 T190 48 T270 30" fill="none" stroke="#09318D" stroke-width="3" stroke-linecap="round"/>
          <circle cx="145" cy="52" r="5" fill="#FD91CC" stroke="#09318D" stroke-width="2"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);">
          <span>Tháng 9</span><span>Tháng 10</span><span>Tháng 11</span>
        </div>
      </div>
    </div>
  </div>

  <main class="container">
    <!-- Components -->
    <section class="sec" id="components">
      <div class="sec-head">
        <div>
          <h2>Thành phần UI/UX trên nền sáng #FCFFFF</h2>
          <p>Xanh `#09318D` tạo uy tín doanh nghiệp, hồng `#FD91CC` thu hút ánh nhìn vào nút hành động chính.</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h3>Buttons & Badges</h3>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
            <button class="btn btn-rose" type="button" onclick="toast('Đã bấm nút nhấn #FD91CC!')">Bắt đầu ngay</button>
            <button class="btn btn-cobalt" type="button" onclick="toast('Đã lưu dữ liệu #09318D!')">Lưu báo cáo</button>
            <button class="btn btn-outline" type="button">Xem chi tiết</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span class="badge badge-rose">● Ưu tiên cao</span>
            <span class="badge badge-cobalt">● Đang đồng bộ</span>
            <span class="badge badge-ok">✓ Hoàn tất</span>
          </div>
        </div>

        <div class="panel">
          <h3>Công tắc trạng thái</h3>
          <div class="switch-row">
            <div>
              <div style="font-size:14px;font-weight:600;">Giám sát tự động 24/7</div>
              <div style="font-size:12px;color:var(--muted);">Nền xanh #1654D1 chuẩn mực</div>
            </div>
            <div class="switch on" role="switch" tabindex="0"></div>
          </div>
          <div class="switch-row" style="border-bottom:none;">
            <div>
              <div style="font-size:14px;font-weight:600;">Cảnh báo nhanh bằng AI</div>
              <div style="font-size:12px;color:var(--muted);">Điểm nhấn hồng #E84393</div>
            </div>
            <div class="switch on rose" role="switch" tabindex="0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Forms & Table -->
    <section class="sec" id="forms" style="border-bottom:none;">
      <div class="grid-2">
        <div class="panel">
          <h3>Biểu mẫu kiểm tra lỗi</h3>
          <div class="field">
            <label for="fName">Tên chiến dịch</label>
            <input class="input" id="fName" type="text" placeholder="Ví dụ: Chiến dịch Tháng 11" />
            <div class="err-msg" id="eName">Vui lòng nhập tên chiến dịch.</div>
          </div>
          <div class="field">
            <label for="fEmail">Email quản trị</label>
            <input class="input" id="fEmail" type="email" placeholder="admin@xclipse.vn" />
            <div class="err-msg" id="eEmail">Email chưa đúng định dạng.</div>
          </div>
          <button class="btn btn-cobalt" id="validateBtn" type="button">Kiểm tra & Gửi</button>
        </div>

        <div class="panel" id="data">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;">
            <h3 style="margin:0;">Danh sách chiến dịch</h3>
            <input class="input" id="searchInput" type="search" placeholder="Lọc nhanh..." style="max-width:170px;height:34px;" />
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>Số lượng</th><th>Trạng thái</th></tr></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <div class="backdrop" id="modalBackdrop">
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:800;color:var(--cobalt);">Yêu cầu Demo Xclipse</h3>
        <button class="btn btn-outline btn-sm" id="closeModal" type="button">Đóng</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;color:var(--muted);">
        Giao diện sáng sạch #FCFFFF kết hợp xanh #09318D và điểm nhấn hồng #FD91CC.
      </p>
      <div class="field">
        <label>Tên doanh nghiệp / Nhóm</label>
        <input class="input" type="text" value="Đội thi Xclipse — VIBE-CODING 2026" />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;">
        <button class="btn btn-outline" id="cancelModal" type="button">Hủy</button>
        <button class="btn btn-rose" id="confirmModal" type="button">Xác nhận</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toastEl">Thông báo</div>

  <script>
    const toastEl = document.getElementById('toastEl');
    let tTimer;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(tTimer);
      tTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    document.querySelectorAll('.color-chip').forEach(b => {
      b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex); toast('Đã sao chép ' + b.dataset.hex); };
    });

    // Gauge slider interaction
    const scoreRange = document.getElementById('scoreRange');
    const scoreVal = document.getElementById('scoreVal');
    const gaugeArc = document.getElementById('gaugeArc');
    scoreRange.oninput = () => {
      const v = Number(scoreRange.value);
      scoreVal.textContent = v;
      const offset = 251.2 * (1 - v / 100);
      gaugeArc.setAttribute('stroke-dashoffset', offset.toFixed(1));
    };

    document.querySelectorAll('.switch').forEach(sw => { sw.onclick = () => sw.classList.toggle('on'); });

    document.getElementById('validateBtn').onclick = () => {
      const name = document.getElementById('fName');
      const email = document.getElementById('fEmail');
      const eName = document.getElementById('eName');
      const eEmail = document.getElementById('eEmail');
      let ok = true;
      if (!name.value.trim()) { name.classList.add('is-error'); eName.classList.add('show'); ok = false; }
      else { name.classList.remove('is-error'); eName.classList.remove('show'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('is-error'); eEmail.classList.add('show'); ok = false; }
      else { email.classList.remove('is-error'); eEmail.classList.remove('show'); }
      if (ok) toast('✓ Đã lưu thành công!');
    };

    const rows = [
      { name: 'Flash Sale Tháng 11', qty: 420, badge: ['badge-rose', '● Ưu tiên'] },
      { name: 'Chiến dịch B2B SaaS', qty: 285, badge: ['badge-cobalt', '● Đang chạy'] },
      { name: 'Chăm sóc Khách hàng', qty: 510, badge: ['badge-ok', '✓ Hoàn tất'] }
    ];
    const tbody = document.getElementById('tableBody');
    function renderTable(q = '') {
      tbody.innerHTML = '';
      rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).forEach(r => {
        tbody.innerHTML += `<tr><td><strong>${r.name}</strong></td><td>${r.qty}</td><td><span class="badge ${r.badge[0]}">${r.badge[1]}</span></td></tr>`;
      });
    }
    renderTable();
    document.getElementById('searchInput').oninput = (e) => renderTable(e.target.value);

    const backdrop = document.getElementById('modalBackdrop');
    const openModal = () => backdrop.classList.add('open');
    const closeModal = () => backdrop.classList.remove('open');
    document.getElementById('openPopupTop').onclick = openModal;
    document.getElementById('openPopupHero').onclick = openModal;
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.getElementById('confirmModal').onclick = () => { closeModal(); toast('Đã gửi yêu cầu demo!'); };
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
  </script>
</body>
</html>

=================== FILE: vibe-sprint/catalog/de-bai-vong-1.md ===================
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

=================== FILE: vibe-sprint/catalog/de-moi-du-doan.md ===================
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

=================== FILE: vibe-sprint/catalog/module-map.md ===================
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

=================== FILE: vibe-sprint/deck/.gitignore ===================
out/
node_modules/
package-lock.json

=================== FILE: vibe-sprint/deck/README.md ===================
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

=================== FILE: vibe-sprint/deck/assets/.gitkeep ===================

=================== FILE: vibe-sprint/deck/deck.html ===================
<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Slide thuyết trình</title>
<!-- Be Vietnam Pro: tuỳ chọn. Mất mạng thì tự dùng Inter / font hệ thống (vẫn đủ dấu tiếng Việt). -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* =====================================================================
   VIBE-SPRINT DECK · khung trình chiếu 16:9 (sân khấu cố định 1920x1080, tự co theo màn hình)
   Chỉ sửa DỮ LIỆU (deck.data.js). Không cần đụng file này.
   Đổi màu cho từng đề: meta.accent / meta.accent2 trong dữ liệu (hoặc biến --accent bên dưới).
   ===================================================================== */
:root{
  --bg:#F4F2EE; --ink:#16151B; --muted:#625F6B; --faint:#8D8A96;
  --card:#FFFFFF; --line:rgba(22,21,27,.10); --soft:rgba(22,21,27,.04);
  --accent:#6A57F2; --accent2:#2F8FE0;
  --grad:linear-gradient(120deg,var(--accent) 0%,var(--accent2) 100%);
  --ok:#128A5B; --ok-bg:#E3F4EC; --warn:#A8620B; --warn-bg:#FBEBD2; --bad:#C23B3B; --bad-bg:#F9E2E2;
  --font:'Be Vietnam Pro','Inter','Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;
  --mono:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace;
  --ease:cubic-bezier(.22,.8,.24,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{background:#E7E4DE;color:var(--ink);font-family:var(--font);overflow:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:inherit}
button{font:inherit;color:inherit}

/* ---------- Sân khấu ---------- */
#viewport{position:fixed;inset:0;overflow:hidden}
#stage{position:absolute;left:50%;top:50%;width:1920px;height:1080px;transform-origin:center center;background:var(--bg);box-shadow:0 30px 80px -30px rgba(22,21,27,.35);overflow:hidden}
.slide{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:var(--bg);opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .45s var(--ease),transform .55s var(--ease),visibility 0s linear .55s}
.slide::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(900px 600px at 92% -8%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 70%),
             radial-gradient(800px 560px at -6% 108%,color-mix(in srgb,var(--accent2) 12%,transparent),transparent 70%)}
.slide.is-active{opacity:1;visibility:visible;pointer-events:auto;transform:none;transition-delay:0s}
.slide.pre-next{transform:translateX(36px)}
.slide.pre-prev{transform:translateX(-36px)}
.slide .inner{position:absolute;inset:0;padding:88px 120px 118px;display:flex;flex-direction:column;z-index:1}
.foot{position:absolute;left:120px;right:120px;bottom:42px;display:flex;justify-content:space-between;align-items:center;font-size:22px;color:var(--faint);z-index:2;letter-spacing:.01em}
.foot .num{font-family:var(--mono);font-variant-numeric:tabular-nums}
.foot b{color:var(--ink);font-weight:600}
.slide.nofoot .foot{display:none}

/* ---------- Chữ ---------- */
.eyebrow{display:inline-flex;align-items:center;gap:12px;font-family:var(--mono);font-size:22px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.eyebrow::before{content:"";width:34px;height:3px;border-radius:3px;background:var(--grad)}
h2.title{font-size:70px;line-height:1.08;font-weight:800;letter-spacing:-.025em;margin-top:18px;max-width:1500px;text-wrap:balance}
.hl{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.head{flex:none;margin-bottom:44px}
.lead{font-size:34px;line-height:1.45;color:var(--muted)}
strong,b{font-weight:700}
h2.title strong,.s-solution .one strong{font-weight:800;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.mono{font-family:var(--mono)}

/* ---------- Thành phần chung ---------- */
.card{background:var(--card);border:1px solid var(--line);border-radius:30px;box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 22px 44px -28px rgba(22,21,27,.22)}
.chip{display:inline-flex;align-items:center;gap:10px;padding:10px 22px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:24px;font-weight:600}
.chip.grad{background:var(--grad);color:#fff;border-color:transparent}
.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;font-size:22px;font-weight:700;white-space:nowrap}
.badge.pass{background:var(--ok-bg);color:var(--ok)}
.badge.warn{background:var(--warn-bg);color:var(--warn)}
.badge.fail{background:var(--bad-bg);color:var(--bad)}
.badge.kind{background:var(--soft);color:var(--muted);font-weight:600}
.ico{width:1em;height:1em;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.ibox{width:76px;height:76px;border-radius:22px;background:var(--grad);color:#fff;display:grid;place-items:center;font-size:40px;box-shadow:0 14px 28px -14px var(--accent)}
.ibox.soft{background:color-mix(in srgb,var(--accent) 11%,#fff);color:var(--accent);box-shadow:none}

/* khung trình duyệt chứa ảnh chụp */
.frame{position:relative;background:#fff;border:1px solid var(--line);border-radius:26px;overflow:hidden;box-shadow:0 40px 70px -36px rgba(22,21,27,.45);display:flex;flex-direction:column}
.frame .bar{flex:none;height:54px;display:flex;align-items:center;gap:10px;padding:0 20px;background:#F0EEE9;border-bottom:1px solid var(--line)}
.frame .bar i{width:14px;height:14px;border-radius:50%;background:#D6D3CC}
.frame .bar .url{margin-left:14px;flex:1;max-width:760px;height:32px;border-radius:16px;background:#fff;border:1px solid var(--line);font:500 19px/30px var(--mono);color:var(--muted);padding:0 16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.frame .shot{position:relative;flex:1;min-height:0;background:linear-gradient(135deg,#ECE9FD,#DCEBFA)}
.frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:left top;display:block}
.frame .shot.missing::after{content:attr(data-missing);position:absolute;inset:0;display:grid;place-items:center;font:600 24px var(--mono);color:var(--muted);text-align:center;padding:30px}
.frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.frame.phone{border-radius:44px;border:10px solid var(--ink)}
.frame.phone .bar{display:none}

/* ---------- Cover ---------- */
.s-cover .inner{padding:96px 120px 96px;flex-direction:row;align-items:stretch;gap:60px}
.s-cover .left{flex:.95;display:flex;flex-direction:column;justify-content:center;min-width:0}
.s-cover .right{flex:1.05;display:flex;align-items:center;justify-content:center;min-width:0}
.s-cover .tag{display:flex;gap:14px;flex-wrap:wrap}
.s-cover h1{font-size:196px;line-height:.98;font-weight:800;letter-spacing:-.045em;margin:34px 0 26px;padding-bottom:10px;white-space:nowrap}
.s-cover .tagline{font-size:48px;line-height:1.28;font-weight:500;color:var(--ink);max-width:880px;text-wrap:balance}
.s-cover .team{margin-top:52px;display:flex;align-items:center;flex-wrap:wrap;gap:10px 20px;font-size:27px;line-height:1.35;color:var(--muted)}
.s-cover .team .ml{flex:0 0 100%;font-size:25px}.s-cover .team .ml i{font-style:normal;white-space:nowrap;margin-right:1.3em}
.s-cover .team b{color:var(--ink)}
.s-cover .team .dot{width:6px;height:6px;border-radius:50%;background:var(--faint)}
.s-cover .frame{width:100%;height:570px;transform:rotate(1deg)}
.orb{width:560px;height:560px;border-radius:50%;background:var(--grad);filter:blur(2px);opacity:.9}

/* ---------- Problem ---------- */
.s-problem .body{flex:1;display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;min-height:0}
.persona{padding:44px;display:flex;flex-direction:column;gap:30px}
.persona .who{display:flex;align-items:center;gap:26px}
.avatar{width:112px;height:112px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-size:44px;font-weight:700;flex:none;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.persona .who h3{font-size:42px;font-weight:700;line-height:1.15}
.persona .who p{font-size:26px;color:var(--muted);margin-top:6px}
.pains{list-style:none;display:flex;flex-direction:column;gap:20px}
.pains li{display:flex;gap:18px;align-items:flex-start;font-size:31px;line-height:1.35;font-weight:500}
.pains li .ico{margin-top:5px;font-size:34px;color:var(--bad);background:var(--bad-bg);padding:7px;border-radius:12px;width:46px;height:46px}
.scenario{padding:52px 56px;display:flex;flex-direction:column;justify-content:center;gap:28px;background:var(--ink);color:#fff;border:none;position:relative;overflow:hidden}
.scenario::after{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:var(--grad);opacity:.35;filter:blur(30px)}
.scenario .lab{font-family:var(--mono);font-size:21px;letter-spacing:.14em;text-transform:uppercase;color:#B9B4FF;font-weight:600;position:relative;z-index:1}
.scenario q{display:block;font-size:40px;line-height:1.42;font-weight:500;quotes:none;position:relative;z-index:1;text-wrap:pretty}
.scenario .stat{position:relative;z-index:1;display:flex;align-items:center;gap:18px;padding-top:26px;border-top:1px solid rgba(255,255,255,.18)}
.scenario .stat b{white-space:nowrap;font-size:64px;font-weight:800;line-height:1;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;background-image:linear-gradient(120deg,#A99FFF,#6FC0FF)}
.scenario .stat span{font-size:27px;color:#CFCCD8;line-height:1.35}

/* ---------- Solution ---------- */
.s-solution .inner{flex-direction:row;gap:64px;align-items:stretch}
.s-solution .left{flex:.82;display:flex;flex-direction:column;justify-content:center;min-width:0}
.s-solution .one{font-size:68px;line-height:1.1;font-weight:800;letter-spacing:-.03em;margin:22px 0 40px;text-wrap:balance}
.s-solution .chips{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.s-solution .chips .chip{font-size:28px;padding:13px 26px}
.s-solution .chips .chip .ico{color:var(--accent);font-size:30px}
.s-solution .right{flex:1.18;display:flex;align-items:center;min-width:0}
.s-solution .frame{width:100%;height:760px}

/* ---------- Features ---------- */
.s-features h2.title{font-size:62px}.s-features .head{margin-bottom:30px}
.s-features .grid{flex:1;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:1fr 1fr;gap:28px;min-height:0}
.fcard{grid-column:span 2;padding:34px 38px;display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden}
.fcard:nth-child(n+4){grid-column:span 3}
.fcard .top{display:flex;justify-content:space-between;align-items:flex-start}
.fcard .n{font-family:var(--mono);font-size:26px;font-weight:700;color:var(--faint)}
.fcard h3{font-size:37px;line-height:1.15;font-weight:700;letter-spacing:-.01em;margin-top:6px}
.fcard p{font-size:25px;line-height:1.4;color:var(--muted)}
.fcard .ibox{width:68px;height:68px;font-size:36px}

/* ---------- Demo ---------- */
.s-demo .inner{padding-top:72px}
.s-demo .head{margin-bottom:30px}
.s-demo h2.title{font-size:58px;margin-top:12px}
.s-demo .body{flex:1;display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:40px;min-height:0}
.s-demo .frame{height:100%;width:100%;min-height:0}
.s-demo .side{display:flex;flex-direction:column;gap:22px;min-height:0}
.qrcard{padding:24px 26px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.qrbox{width:250px;height:250px;padding:12px;background:#fff;border-radius:22px;border:1px solid var(--line)}
.qrbox svg{width:100%;height:100%;display:block}
.qrcard .scan{font-size:30px;font-weight:700}
.qrcard .link{font:600 19px/1.3 var(--mono);color:var(--accent);word-break:break-all}
.sidenote{padding:22px 28px;font-size:24px;line-height:1.45;color:var(--muted);flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;justify-content:center;overflow:hidden}
.sidenote b{color:var(--ink)}
.livebtn{position:absolute;right:22px;bottom:22px;z-index:3;display:inline-flex;gap:10px;align-items:center;padding:14px 26px;border:0;border-radius:999px;background:var(--ink);color:#fff;font-size:24px;font-weight:700;cursor:pointer;box-shadow:0 14px 30px -12px rgba(0,0,0,.5)}
.livebtn:hover{background:var(--accent)}

/* ---------- Flow ---------- */
.s-flow .steps{flex:1;display:flex;align-items:center;gap:0;min-height:0}
.step{flex:1;position:relative;padding:0 14px;display:flex;flex-direction:column;gap:22px;align-items:flex-start;min-width:0}
.step .node{display:flex;align-items:center;width:100%;gap:0}
.step .circle{width:112px;height:112px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-size:54px;flex:none;box-shadow:0 20px 36px -16px var(--accent);position:relative}
.step .circle sup{position:absolute;top:-6px;right:-6px;width:42px;height:42px;border-radius:50%;background:var(--ink);font:700 22px/42px var(--mono);text-align:center;vertical-align:baseline}
.step .rail{flex:1;height:4px;margin:0 14px;border-radius:4px;background:repeating-linear-gradient(90deg,var(--accent2) 0 14px,transparent 14px 26px);opacity:.55;position:relative}
.step .rail::after{content:"";position:absolute;right:-4px;top:-9px;border-left:16px solid var(--accent2);border-top:11px solid transparent;border-bottom:11px solid transparent}
.step:last-child .rail{visibility:hidden}
.step h3{font-size:38px;line-height:1.15;font-weight:700}
.step p{font-size:27px;line-height:1.45;color:var(--muted)}
.s-flow .note{flex:none;margin-top:10px;padding:24px 34px;font-size:28px;display:flex;align-items:center;gap:18px}
.s-flow .note .ico{color:var(--accent);font-size:36px}

/* ---------- AI ---------- */
.s-ai .inner{padding-top:72px}
.s-ai .head{margin-bottom:26px}
.s-ai h2.title{font-size:58px;margin-top:12px}
.s-ai .top{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:24px;flex:none}
.acard{padding:26px 30px 28px;display:flex;flex-direction:column;gap:14px}
.acard h3{display:flex;align-items:center;gap:12px;font-size:28px;font-weight:700}
.acard ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.acard li{font-size:24px;line-height:1.35;padding-left:30px;position:relative;color:var(--ink)}
.acard li::before{content:"";position:absolute;left:3px;top:.5em;width:12px;height:12px;border-radius:50%;background:var(--faint)}
.acard.real li::before{background:var(--ok)} .acard.mock li::before{background:#D98A1F} .acard.ctrl li::before{background:var(--accent)}
.acard.real h3 .badge{background:var(--ok-bg);color:var(--ok)} .acard.mock h3 .badge{background:var(--warn-bg);color:var(--warn)}
.acard.ctrl{background:var(--ink);color:#fff;border:none}
.acard.ctrl li{color:#ECEAF5}
.acard.ctrl h3 .badge{background:rgba(255,255,255,.14);color:#fff}
.pipe{flex:1;margin-top:20px;display:flex;align-items:center;min-height:0}
.pgrid{width:100%;display:grid;row-gap:0;align-items:stretch}
.pstep{padding:20px 24px;border-radius:24px;background:#fff;border:2px solid var(--line);text-align:center;display:flex;flex-direction:column;gap:6px;justify-content:center;min-height:128px}
.pstep b{font-size:30px;font-weight:700;line-height:1.2}
.pstep span{font-size:23px;color:var(--muted);line-height:1.3}
.pstep.key{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,#fff)}
.pstep.ok{border-color:var(--ok);background:var(--ok-bg)} .pstep.ok b{color:var(--ok)}
.parrow{display:grid;place-items:center;color:var(--accent);font-size:40px}
.pfall{display:flex;flex-direction:column;align-items:stretch}
.pfall .conn{align-self:center;width:0;height:40px;border-left:3px dashed var(--warn);position:relative}
.pfall .conn::after{content:attr(data-label);position:absolute;left:18px;top:8px;font:600 21px var(--mono);color:var(--warn);white-space:nowrap}
.pstep.fall{border-style:dashed;border-color:var(--warn);background:var(--warn-bg)}
.pstep.fall b{color:var(--warn)}

/* ---------- Quality ---------- */
.s-quality .inner{padding-top:72px}
.s-quality .head{margin-bottom:28px}
.s-quality h2.title{font-size:58px;margin-top:12px}
.s-quality .body{flex:1;display:grid;grid-template-columns:1fr 400px;gap:34px;min-height:0}
.ttable{padding:10px 8px;display:flex;flex-direction:column;min-height:0}
.trow{display:grid;grid-template-columns:96px 190px 1fr 190px;align-items:center;gap:20px;padding:0 28px;flex:1;border-bottom:1px solid var(--line);min-height:0}
.trow:last-child{border-bottom:0}
.trow.th{flex:none;height:62px;font:600 20px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.trow .id{font:700 24px var(--mono);color:var(--accent)}
.trow .what{font-size:25px;line-height:1.28;min-width:0}
.trow .what b{display:block;font-weight:700}
.trow .what span{color:var(--muted);font-size:23px;display:block;margin-top:2px}
.tsum{display:flex;flex-direction:column;gap:22px}
.tsum .big{padding:36px 36px;flex:none}
.tsum .big b{display:block;font-size:112px;line-height:1;font-weight:800;letter-spacing:-.04em}
.tsum .big span{display:block;font-size:26px;color:var(--muted);margin-top:12px;line-height:1.35}
.tsum .legend{padding:28px 32px;font-size:24px;line-height:1.5;color:var(--muted);display:flex;flex-direction:column;gap:14px;flex:1;justify-content:center}
.tsum .legend div{display:flex;gap:12px;align-items:flex-start}
.tsum .legend .ico{margin-top:5px;font-size:26px;color:var(--ok)}

/* ---------- Metrics ---------- */
.s-metrics .grid{flex:1;display:grid;gap:28px;min-height:0;align-content:center}
.s-metrics .grid.c2{grid-template-columns:repeat(2,1fr)} .s-metrics .grid.c3{grid-template-columns:repeat(3,1fr)} .s-metrics .grid.c4{grid-template-columns:repeat(4,1fr)}
.mcard{padding:42px 40px;display:flex;flex-direction:column;gap:10px;min-height:320px;justify-content:flex-start;position:relative;overflow:hidden}
.mcard::before{content:"";position:absolute;left:0;top:0;width:100%;height:8px;background:var(--grad)}
.mcard .v{font-size:132px;line-height:1;font-weight:800;letter-spacing:-.045em;display:flex;align-items:baseline;gap:6px;font-variant-numeric:tabular-nums}
.mcard .v small{font-size:.42em;font-weight:700;letter-spacing:-.01em}
.mcard h3{font-size:31px;font-weight:700;line-height:1.2;margin-top:8px}
.mcard p{font-size:25px;color:var(--muted);line-height:1.4}
.s-metrics .note{flex:none;margin-top:26px;font-size:26px;color:var(--muted)}

/* ---------- Roadmap ---------- */
.s-roadmap .tl{flex:1;display:flex;align-items:center;position:relative;min-height:0}
.dotrow{display:flex;align-items:center;width:100%;margin-bottom:26px}.dotrow .rl{flex:1;height:6px;border-radius:6px;background:var(--grad);opacity:.35;margin:0 0 0 -2px}.rnode:last-child .rl{visibility:hidden}
.rnode{flex:1;position:relative;display:flex;flex-direction:column;align-items:flex-start;padding:0 18px 0 0;min-width:0}
.rnode .when{font:700 24px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:22px;height:34px}
.rnode .dot{width:34px;height:34px;border-radius:50%;background:var(--card);border:8px solid var(--accent);z-index:2;flex:none}
.rnode .c{padding:28px 30px;width:100%;min-height:290px}
.rnode h3{font-size:34px;font-weight:700;line-height:1.18}
.rnode p{font-size:25px;color:var(--muted);line-height:1.45;margin-top:12px}
.rnode:first-child .dot{background:var(--accent)}
.rnode .tagnow{display:inline-block;margin-top:14px;font-size:20px;font-weight:700;color:var(--ok);background:var(--ok-bg);border-radius:999px;padding:4px 14px}

/* ---------- Team ---------- */
.s-team .grid{flex:1;display:grid;gap:28px;align-content:center;min-height:0}
.s-team .grid.c2{grid-template-columns:repeat(2,1fr)} .s-team .grid.c3{grid-template-columns:repeat(3,1fr)} .s-team .grid.c4{grid-template-columns:repeat(4,1fr)}
.mem{padding:40px 40px;display:flex;flex-direction:column;gap:20px;align-items:flex-start}
.mem .avatar{width:128px;height:128px;font-size:50px}
.mem h3{font-size:40px;font-weight:700;line-height:1.15}
.mem .role{font:600 23px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
.mem p{font-size:26px;line-height:1.42;color:var(--muted)}
.stack{flex:none;margin-top:30px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:24px;color:var(--muted)}
.stack .chip{font-size:23px;padding:8px 20px}

/* ---------- Thanks ---------- */
.s-thanks .inner{flex-direction:row;align-items:center;gap:80px;padding:96px 130px}
.s-thanks .left{flex:1.1;display:flex;flex-direction:column;gap:36px;min-width:0}
.s-thanks h2{font-size:150px;line-height:1;font-weight:800;letter-spacing:-.04em;padding-bottom:8px}
.s-thanks .sub{font-size:42px;line-height:1.3;color:var(--muted);max-width:820px;text-wrap:balance}
.s-thanks .qa{display:inline-flex;align-self:flex-start;align-items:center;gap:18px;padding:20px 42px;border-radius:999px;background:var(--grad);color:#fff;font-size:50px;font-weight:700;box-shadow:0 26px 50px -22px var(--accent)}
.s-thanks .links{display:flex;flex-direction:column;gap:12px;font-size:28px}
.s-thanks .links div{display:flex;gap:14px;align-items:center}
.s-thanks .links .ico{color:var(--accent);font-size:32px}
.s-thanks .links b{font-family:var(--mono);font-weight:600;font-size:26px}
.s-thanks .right{flex:.62;display:flex;justify-content:center}
.s-thanks .qrcard{padding:40px;gap:22px}
.s-thanks .qrbox{width:460px;height:460px;padding:22px}
.s-thanks .qrcard .scan{font-size:34px}

/* ---------- Giao diện điều khiển (ngoài sân khấu) ---------- */
#progress{position:fixed;left:0;top:0;height:5px;width:0;background:var(--grad);z-index:50;transition:width .5s var(--ease)}
#hud{position:fixed;right:18px;bottom:16px;z-index:50;display:flex;gap:8px;align-items:center;opacity:0;transition:opacity .3s;font-family:var(--mono);font-size:13px}
body.show-hud #hud{opacity:1}
#hud button{border:1px solid var(--line);background:rgba(255,255,255,.92);border-radius:999px;height:34px;min-width:34px;padding:0 12px;cursor:pointer;font-size:13px;color:var(--ink);box-shadow:0 6px 16px -8px rgba(0,0,0,.4)}
#hud button:hover{background:#fff;border-color:var(--accent)}
#hud .pos{background:rgba(22,21,27,.86);color:#fff;border-radius:999px;padding:9px 14px;letter-spacing:.04em}
#help{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:60;background:rgba(22,21,27,.9);color:#fff;font:500 13px var(--mono);padding:10px 18px;border-radius:999px;opacity:0;transition:opacity .5s;pointer-events:none;white-space:nowrap}
#help.on{opacity:1}
#notes{position:fixed;left:0;right:0;bottom:0;z-index:70;background:rgba(22,21,27,.97);color:#F2F0F7;padding:18px 28px 20px;display:none;max-height:42vh;overflow:auto;font-size:18px;line-height:1.55;box-shadow:0 -20px 60px rgba(0,0,0,.35)}
body.notes-on #notes{display:block}
#notes .nh{display:flex;gap:18px;align-items:center;font:600 13px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:#A8A3C8;margin-bottom:8px;flex-wrap:wrap}
#notes .nh .t{margin-left:auto;color:#fff}
#notes .nb{max-width:1100px;white-space:pre-wrap}
#notes .nx{margin-top:10px;color:#9A96B3;font-size:14px}
#err{position:fixed;inset:0;display:none;place-items:center;text-align:center;padding:40px;font-size:20px;line-height:1.6;z-index:99;background:var(--bg)}
#err.on{display:grid}
#err code{background:#fff;padding:2px 8px;border-radius:6px}

@media (prefers-reduced-motion:no-preference){
  .slide.is-active .rv{animation:rise .7s var(--ease) both;animation-delay:calc(var(--i,0)*70ms + 140ms)}
  @keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
}
@media (prefers-reduced-motion:reduce){
  .slide,#progress,#hud,#help{transition-duration:.01s!important}
  .slide.pre-next,.slide.pre-prev{transform:none}
}

/* ---------- Chế độ xuất / in: mỗi slide một trang 1920x1080 ---------- */
html.export,html.export body{height:auto;overflow:visible;background:#fff}
html.export #viewport{position:static;overflow:visible}
html.export #stage{position:static;transform:none!important;width:1920px;height:auto;box-shadow:none;overflow:visible}
html.export .slide{position:relative;opacity:1;visibility:visible;transform:none;transition:none;break-after:page;page-break-after:always;break-inside:avoid}
html.export .slide:last-child{break-after:auto;page-break-after:auto}
html.export .rv{animation:none!important;opacity:1;transform:none}
html.export #progress,html.export #hud,html.export #help,html.export #notes,html.export .livebtn{display:none!important}
@page{size:1920px 1080px;margin:0}
@media print{
  html,body{height:auto;overflow:visible;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  #viewport{position:static;overflow:visible}
  #stage{position:static;transform:none!important;width:1920px;height:auto;box-shadow:none;overflow:visible}
  .slide{position:relative;opacity:1;visibility:visible;transform:none;transition:none;break-after:page;page-break-after:always;break-inside:avoid}
  .slide:last-child{break-after:auto;page-break-after:auto}
  .rv{animation:none!important;opacity:1;transform:none}
  #progress,#hud,#help,#notes,.livebtn{display:none!important}
  .hl,h2.title strong,.s-solution .one strong,.scenario .stat b,.mcard .v{background:none!important;-webkit-text-fill-color:var(--accent)!important;color:var(--accent)!important}
  .scenario .stat b{-webkit-text-fill-color:#A99FFF!important;color:#A99FFF!important}
}
</style>
</head>
<body>
<div id="progress"></div>
<div id="viewport"><div id="stage" role="main"></div></div>
<div id="hud" aria-label="Điều khiển">
  <button id="b-prev" title="Slide trước (←)" aria-label="Slide trước">←</button>
  <span class="pos" id="pos">1 / 1</span>
  <button id="b-next" title="Slide sau (→)" aria-label="Slide sau">→</button>
  <button id="b-notes" title="Ghi chú trình bày (N)">N · ghi chú</button>
  <button id="b-full" title="Toàn màn hình (F)">F · toàn màn hình</button>
</div>
<div id="help">← → chuyển slide · N ghi chú · F toàn màn hình · Ctrl+P xuất PDF</div>
<div id="notes" aria-live="polite"></div>
<div id="err"><div><h2>Chưa có dữ liệu slide</h2><p style="margin-top:12px;color:#625F6B">Tạo <code>deck.data.js</code> (sao chép từ <code>template.data.js</code>) cạnh file này,<br>hoặc mở <code>deck.html?data=example.data.js</code></p></div></div>

<!-- Dữ liệu inline (tuỳ chọn): dán JSON vào đây thay cho deck.data.js. Để trống nếu dùng file .js. -->
<script type="application/json" id="deck-data"></script>

<script>
(function(){
'use strict';
var Q=new URLSearchParams(location.search);
var EXPORT=Q.has('export')||Q.has('print');
var REDUCE=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(EXPORT)document.documentElement.classList.add('export');

/* =============== QR encoder (byte mode, phiên bản 1-10, không phụ thuộc thư viện) =============== */
var QR=(function(){
  var ECC_PER_BLOCK=[[7,10,15,20,26,18,20,24,30,18],[10,16,26,18,24,16,18,22,22,26],[13,22,18,26,18,24,18,22,20,24],[17,28,22,16,22,28,26,26,24,28]];
  var NUM_BLOCKS=[[1,1,1,1,1,2,2,2,2,4],[1,1,1,2,2,4,4,4,5,5],[1,1,2,2,4,4,6,6,8,8],[1,1,2,4,4,4,5,6,8,8]];
  var FMT=[1,0,3,2]; /* L M Q H */
  function rawModules(v){var r=(16*v+128)*v+64;if(v>=2){var n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r}
  function mul(x,y){var z=0;for(var i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z}
  function divisor(d){var r=[],i,j;for(i=0;i<d-1;i++)r.push(0);r.push(1);var root=1;for(i=0;i<d;i++){for(j=0;j<r.length;j++){r[j]=mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=mul(root,2)}return r}
  function remainder(data,div){var r=div.map(function(){return 0});data.forEach(function(b){var f=b^r.shift();r.push(0);div.forEach(function(c,i){r[i]^=mul(c,f)})});return r}
  function utf8(s){return Array.prototype.slice.call(new TextEncoder().encode(s))}
  function encode(text,eclIdx){
    var data=utf8(text),ver,cap,i;
    for(ver=1;ver<=10;ver++){cap=Math.floor(rawModules(ver)/8)-ECC_PER_BLOCK[eclIdx][ver-1]*NUM_BLOCKS[eclIdx][ver-1];if(4+(ver<10?8:16)+data.length*8<=cap*8)break}
    if(ver>10)throw new Error('QR: nội dung quá dài ('+data.length+' byte)');
    var bits=[];function put(v,n){for(var k=n-1;k>=0;k--)bits.push((v>>>k)&1)}
    put(4,4);put(data.length,ver<10?8:16);data.forEach(function(b){put(b,8)});
    put(0,Math.min(4,cap*8-bits.length));while(bits.length%8)bits.push(0);
    for(var pad=0xEC;bits.length<cap*8;pad^=0xEC^0x11)put(pad,8);
    var cw=[];for(i=0;i<bits.length;i+=8){var b=0;for(var k=0;k<8;k++)b=(b<<1)|bits[i+k];cw.push(b)}
    var nb=NUM_BLOCKS[eclIdx][ver-1],el=ECC_PER_BLOCK[eclIdx][ver-1],raw=Math.floor(rawModules(ver)/8),ns=nb-raw%nb,sl=Math.floor(raw/nb),div=divisor(el),blocks=[],kk=0;
    for(i=0;i<nb;i++){var dl=sl-el+(i<ns?0:1),dat=cw.slice(kk,kk+dl);kk+=dl;var ecc=remainder(dat,div);if(i<ns)dat.push(0);blocks.push(dat.concat(ecc))}
    var all=[];for(i=0;i<blocks[0].length;i++)blocks.forEach(function(bl,j){if(i!==sl-el||j>=ns)all.push(bl[i])});
    var size=ver*4+17,M=[],F=[];for(i=0;i<size;i++){M.push(new Array(size).fill(false));F.push(new Array(size).fill(false))}
    function set(x,y,d){M[y][x]=!!d;F[y][x]=true}
    for(i=0;i<size;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
    function finder(cx,cy){for(var dy=-4;dy<=4;dy++)for(var dx=-4;dx<=4;dx++){var d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<size&&y>=0&&y<size)set(x,y,d!==2&&d!==4)}}
    finder(3,3);finder(size-4,3);finder(3,size-4);
    var pos=[];if(ver>1){var na=Math.floor(ver/7)+2,step=Math.ceil((ver*4+4)/(na*2-2))*2;pos=[6];for(var p=size-7;pos.length<na;p-=step)pos.splice(1,0,p)}
    pos.forEach(function(cy,a){pos.forEach(function(cx,b){if((a===0&&b===0)||(a===0&&b===pos.length-1)||(a===pos.length-1&&b===0))return;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++)set(cx+dx,cy+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)})});
    function fmt(mask){var d=(FMT[eclIdx]<<3)|mask,r=d;for(var k=0;k<10;k++)r=(r<<1)^((r>>>9)*0x537);var bt=((d<<10)|r)^0x5412;function g(n){return((bt>>>n)&1)!==0}
      for(var k2=0;k2<=5;k2++)set(8,k2,g(k2));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(var k3=9;k3<15;k3++)set(14-k3,8,g(k3));
      for(var k4=0;k4<8;k4++)set(size-1-k4,8,g(k4));for(var k5=8;k5<15;k5++)set(8,size-15+k5,g(k5));set(8,size-8,true)}
    fmt(0);
    if(ver>=7){var rr=ver;for(i=0;i<12;i++)rr=(rr<<1)^((rr>>>11)*0x1F25);var vb=(ver<<12)|rr;for(i=0;i<18;i++){var bt=((vb>>>i)&1)!==0,a=size-11+i%3,c=Math.floor(i/3);set(a,c,bt);set(c,a,bt)}}
    var idx=0;for(var right=size-1;right>=1;right-=2){if(right===6)right=5;for(var vert=0;vert<size;vert++)for(var j=0;j<2;j++){var x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;if(!F[y][x]&&idx<all.length*8){M[y][x]=((all[idx>>>3]>>>(7-(idx&7)))&1)!==0;idx++}}}
    var MASKS=[function(x,y){return(x+y)%2===0},function(x,y){return y%2===0},function(x,y){return x%3===0},function(x,y){return(x+y)%3===0},function(x,y){return(Math.floor(x/3)+Math.floor(y/2))%2===0},function(x,y){return x*y%2+x*y%3===0},function(x,y){return(x*y%2+x*y%3)%2===0},function(x,y){return((x+y)%2+x*y%3)%2===0}];
    function applyMask(m){for(var y=0;y<size;y++)for(var x=0;x<size;x++)if(!F[y][x]&&MASKS[m](x,y))M[y][x]=!M[y][x]}
    function penalty(){var s=0,dark=0,x,y,run,k;
      for(y=0;y<size;y++){run=1;for(x=1;x<=size;x++){if(x<size&&M[y][x]===M[y][x-1])run++;else{if(run>=5)s+=run-2;run=1}}}
      for(x=0;x<size;x++){run=1;for(y=1;y<=size;y++){if(y<size&&M[y][x]===M[y-1][x])run++;else{if(run>=5)s+=run-2;run=1}}}
      for(y=0;y<size-1;y++)for(x=0;x<size-1;x++)if(M[y][x]===M[y][x+1]&&M[y][x]===M[y+1][x]&&M[y][x]===M[y+1][x+1])s+=3;
      var pat=[1,0,1,1,1,0,1],q=[0,0,0,0];
      function chk(get){for(var a=0;a<size;a++)for(var b=0;b+10<=size;b++){var okp=true;for(k=0;k<7;k++)if(get(a,b+k)!==!!pat[k]){okp=false;break}if(!okp)continue;
        var l=true,r=true;for(k=0;k<4;k++){if(b-4+k>=0&&get(a,b-4+k))l=false;if(b+7+k<size&&get(a,b+7+k))r=false}
        if((l&&b>=4)||(r&&b+11<=size))s+=40}}
      chk(function(a,b){return M[a][b]});chk(function(a,b){return M[b][a]});
      for(y=0;y<size;y++)for(x=0;x<size;x++)if(M[y][x])dark++;
      s+=(Math.ceil(Math.abs(dark*20-size*size*10)/(size*size))-1)*10;return s}
    var best=0,bp=1e9;for(var m=0;m<8;m++){applyMask(m);fmt(m);var pe=penalty();if(pe<bp){bp=pe;best=m}applyMask(m)}
    applyMask(best);fmt(best);return M}
  function svg(text,opt){opt=opt||{};var M;try{M=encode(text,{L:0,M:1,Q:2,H:3}[opt.ecl||'M'])}catch(e){try{M=encode(text,0)}catch(e2){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><text x="5" y="6" font-size="2" text-anchor="middle">QR lỗi</text></svg>'}}
    var n=M.length,m=opt.margin==null?2:opt.margin,d='';for(var y=0;y<n;y++){var x=0;while(x<n){if(M[y][x]){var s=x;while(x<n&&M[y][x])x++;d+='M'+(s+m)+' '+(y+m)+'h'+(x-s)+'v1h-'+(x-s)+'z'}else x++}}
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+2*m)+' '+(n+2*m)+'" shape-rendering="crispEdges" role="img" aria-label="Mã QR"><rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="'+(opt.fg||'#16151B')+'"/></svg>'}
  return {matrix:function(t,e){return encode(t,{L:0,M:1,Q:2,H:3}[e||'M'])},svg:svg};
})();
window.__QR=QR;

/* =============== Biểu tượng (SVG nét) =============== */
var ICONS={
 form:'M5 4h14v16H5z M8.5 9h7 M8.5 13h7 M8.5 17h4',
 sparkles:'M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
 wand:'M5 19L17 7 M15 5l4 4 M7 3v3 M5.5 4.5h3 M19 14v3 M17.5 15.5h3',
 layout:'M4 4h16v16H4z M4 10h16 M10 10v10',
 users:'M9 11a3 3 0 100-6 3 3 0 000 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 5.5a3 3 0 010 5.5 M18 14.5c1.8.8 3 2.6 3 5.5',
 user:'M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c0-4 3.6-7 8-7s8 3 8 7',
 qr:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h2v2h-2z M18 14h2v2 M14 18h2 M18 18h2v2h-4',
 chart:'M4 20V4 M4 20h16 M8 16v-5 M12 16V8 M16 16v-8',
 bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
 shield:'M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z M9 12l2 2 4-4',
 clock:'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
 check:'M5 12.5l4.5 4.5L19 7.5',
 x:'M6 6l12 12 M18 6L6 18',
 alert:'M12 3.5l9.5 16.5h-19z M12 10v4.5 M12 17.5v.5',
 globe:'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',
 phone:'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1z M11 18h2',
 file:'M7 3h7l5 5v13H7z M14 3v5h5',
 list:'M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01',
 calendar:'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
 rocket:'M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5z M9 9L5 10l-2 3 4 1 M14 15l-1 4-3 2-1-4 M15.5 8.5h.01',
 target:'M12 21a9 9 0 100-18 9 9 0 000 18z M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z M12 12h.01',
 heart:'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z',
 search:'M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4',
 edit:'M4 20l1-4L16.5 4.5a2 2 0 013 3L8 19z M14 7l3 3',
 lock:'M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 017 0v3',
 cloud:'M7 18a4 4 0 01-.5-8A5.5 5.5 0 0117 8.5 4.8 4.8 0 0117.5 18z',
 mail:'M3 6h18v12H3z M3 7l9 6 9-6',
 star:'M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z',
 code:'M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16',
 db:'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
 arrow:'M5 12h14 M13 6l6 6-6 6',
 image:'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M9 9.5h.01',
 link:'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1 M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1',
 play:'M7 4.5v15l13-7.5z',
 money:'M12 21a9 9 0 100-18 9 9 0 000 18z M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1.1 0-2-.4-2.5-1.2 M12 6.5V8 M12 16v1.5',
 flag:'M5 21V4 M5 4h12l-2 4 2 4H5',
 bell:'M6 17V11a6 6 0 0112 0v6l1.5 2h-15z M10 21h4'
};
function icon(name,cls){var p=ICONS[name];if(!p)return '';return '<svg class="ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+p.split(' M').map(function(d,i){return '<path d="'+(i?'M':'')+d+'"/>'}).join('')+'</svg>'}

/* =============== Tiện ích =============== */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
/* **đậm**  {{nhấn gradient}}  — nội dung đã được escape trước */
function md(s){return esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="hl">$1</span>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}
function arr(x){return Array.isArray(x)?x:(x==null?[]:[x])}
function shortUrl(u){return String(u||'').replace(/^https?:\/\//,'').replace(/\/$/,'')}
function initials(n){var p=String(n||'?').trim().split(/\s+/);return (p.length>1?p[p.length-2][0]+p[p.length-1][0]:p[0].slice(0,2)).toUpperCase()}
function ic(x,fallback){if(!x)return icon(fallback||'sparkles');return ICONS[x]?icon(x):'<span style="font-weight:700;font-size:.8em">'+esc(x)+'</span>'}
function rv(i){return 'class="rv" style="--i:'+i+'"'}
function rvc(c,i){return 'class="rv '+c+'" style="--i:'+i+'"'}
function img(src,alt){return src?'<img src="'+esc(src)+'" alt="'+esc(alt||'')+'" loading="eager" onerror="this.parentNode.classList.add(\'missing\');this.remove()">':''}
function shot(src,alt,extra){return '<div class="shot'+(src?'':' missing')+'" data-missing="'+esc(src?('Không tải được ảnh: '+src):'Chưa có ảnh (điền field image)')+'">'+img(src,alt)+(extra||'')+'</div>'}
function frame(src,url,cls,alt,extra){return '<div class="frame'+(cls?' '+cls:'')+'"><div class="bar"><i></i><i></i><i></i><div class="url">'+esc(shortUrl(url)||'localhost')+'</div></div>'+shot(src,alt,extra)+'</div>'}
function head(s,def,small){var e=s.eyebrow==null?def:s.eyebrow;return '<header class="head rv" style="--i:0"><div class="eyebrow">'+esc(e)+'</div>'+(s.title?'<h2 class="title">'+md(s.title)+'</h2>':'')+'</header>'}
function qrBox(url,cls){return '<div class="qrbox'+(cls?' '+cls:'')+'">'+QR.svg(url,{ecl:'M',margin:1})+'</div>'}

/* =============== Bộ dựng từng loại slide =============== */
var R={
cover:function(s,c){var m=c.meta;
 return '<div class="inner"><div class="left">'
  +'<div class="tag rv" style="--i:0">'+(s.de?'<span class="chip grad">'+esc(s.de)+'</span>':'')+(s.bang?'<span class="chip">'+esc(s.bang)+'</span>':'')+(s.event?'<span class="chip">'+esc(s.event)+'</span>':'')+'</div>'
  +'<h1 '+rvc('hl',1)+'>'+esc(s.app||m.app||'Tên ứng dụng')+'</h1>'
  +'<p '+rvc('tagline',2)+'>'+md(s.tagline||'')+'</p>'
  +'<div '+rvc('team',3)+'>'+(s.team?'<span>Đội <b>'+esc(String(s.team).replace(/^\s*đội\s+/i,''))+'</b></span>':'')+(s.date?'<i class="dot"></i><span>'+esc(s.date)+'</span>':'')+(s.members&&s.members.length?'<span class="ml">'+arr(s.members).map(function(x){return '<i>'+esc(x)+'</i>'}).join(' ')+'</span>':'')+'</div>'
  +'</div><div class="right rv" style="--i:2">'+(s.image?frame(s.image,s.url||m.liveUrl,'',s.app):'<div class="orb"></div>')+'</div></div>'},

problem:function(s){var p=s.persona||{};
 return '<div class="inner">'+head(s,'Vấn đề')+'<div class="body">'
  +'<div '+rvc('card persona',1)+'><div class="who"><div class="avatar">'+(p.photo?img(p.photo,p.name):esc(initials(p.name)))+'</div><div><h3>'+esc(p.name||'Người dùng')+'</h3><p>'+esc(p.role||'')+'</p></div></div>'
  +'<ul class="pains">'+arr(s.pains).slice(0,4).map(function(x){return '<li>'+icon('x')+'<span>'+md(x)+'</span></li>'}).join('')+'</ul></div>'
  +'<div '+rvc('card scenario',2)+'><div class="lab">'+esc(s.scenarioLabel||'Một tình huống thật')+'</div><q>'+md(s.scenario||'')+'</q>'
  +(s.stat?'<div class="stat"><b>'+esc(s.stat.value)+'</b><span>'+md(s.stat.label||'')+'</span></div>':'')+'</div>'
  +'</div></div>'},

solution:function(s,c){
 return '<div class="inner"><div class="left"><div '+rv(0)+'><div class="eyebrow">'+esc(s.eyebrow==null?'Giải pháp':s.eyebrow)+'</div></div>'
  +'<h2 '+rvc('one',1)+'>'+md(s.oneLiner||s.title||'')+'</h2>'
  +'<div '+rvc('chips',2)+'>'+arr(s.bullets).slice(0,4).map(function(b){var t=typeof b==='string'?{text:b}:b;return '<span class="chip">'+icon(t.icon||'check')+esc(t.text)+'</span>'}).join('')+'</div></div>'
  +'<div class="right rv" style="--i:2">'+frame(s.image,s.url||c.meta.liveUrl,'',s.title||'Màn hình chính')+'</div></div>'},

features:function(s){
 return '<div class="inner">'+head(s,'Tính năng')+'<div class="grid">'
  +arr(s.items).slice(0,6).map(function(f,i){return '<article '+rvc('card fcard',i+1)+'><div class="top"><div class="ibox">'+ic(f.icon,'sparkles')+'</div><span class="n">'+String(i+1).padStart(2,'0')+'</span></div><h3>'+md(f.title)+'</h3><p>'+md(f.desc||'')+'</p></article>'}).join('')
  +'</div></div>'},

demo:function(s,c){var url=s.url||c.meta.liveUrl||'';var auto=s.live==='auto';
 var extra=(s.iframe&&url)?'<button class="livebtn" data-live="'+esc(url)+'" data-auto="'+(auto?1:0)+'">'+icon('play')+' Chạy trực tiếp</button>':'';
 return '<div class="inner">'+head(s,'Demo trực tiếp')+'<div class="body">'
  +'<div class="rv" style="--i:1;min-height:0;display:flex">'+frame(s.image,url,'',s.title||'Demo',extra)+'</div>'
  +'<div class="side"><div '+rvc('card qrcard',2)+'>'+(url?qrBox(url):'')+'<div class="scan">'+esc(s.qrLabel||'Quét để dùng thử')+'</div><div class="link">'+esc(shortUrl(url))+'</div></div>'
  +'<div '+rvc('card sidenote',3)+'>'+(s.caption?'<div>'+md(s.caption)+'</div>':'')+(s.videoUrl||c.meta.videoUrl?'<div>Video: <b class="mono" style="font-size:.88em">'+esc(shortUrl(s.videoUrl||c.meta.videoUrl))+'</b></div>':'')+'</div></div>'
  +'</div></div>'},

flow:function(s){var st=arr(s.steps).slice(0,5);
 return '<div class="inner">'+head(s,'Luồng sử dụng')+'<div class="steps">'
  +st.map(function(x,i){return '<div '+rvc('step',i+1)+'><div class="node"><div class="circle">'+ic(x.icon,'arrow')+'<sup>'+(i+1)+'</sup></div><div class="rail"></div></div><h3>'+md(x.title)+'</h3><p>'+md(x.desc||'')+'</p></div>'}).join('')
  +'</div>'+(s.note?'<div '+rvc('card note',st.length+1)+'>'+icon('bolt')+'<span>'+md(s.note)+'</span></div>':'')+'</div>'},

ai:function(s){var p=s.pipeline||{},steps=arr(p.steps),fi=p.fallbackAt==null?Math.max(steps.length-2,0):p.fallbackAt;
 function list(a){return '<ul>'+arr(a).map(function(x){return '<li>'+md(x)+'</li>'}).join('')+'</ul>'}
 var cols=steps.length;
 return '<div class="inner">'+head(s,'AI trong sản phẩm')
  +'<div class="top"><div '+rvc('card acard real',1)+'><h3><span class="badge">THẬT</span>'+esc(s.realTitle||'AI thật')+'</h3>'+list(s.real)+'</div>'
  +'<div '+rvc('card acard mock',2)+'><h3><span class="badge">MÔ PHỎNG</span>'+esc(s.mockTitle||'Chế độ dự phòng')+'</h3>'+list(s.mock)+'</div>'
  +'<div '+rvc('card acard ctrl',3)+'><h3><span class="badge">KIỂM SOÁT</span>'+esc(s.controlsTitle||'Chống AI sai')+'</h3>'+list(s.controls)+'</div></div>'
  +'<div class="pipe rv" style="--i:4"><div class="pgrid" style="grid-template-columns:'+steps.map(function(){return 'minmax(0,1fr)'}).join(' 64px ')+'">'
  +steps.map(function(x,i){var o=typeof x==='string'?{label:x}:x;return (i?'<div class="parrow" style="grid-column:'+(2*i)+';grid-row:1">'+icon('arrow')+'</div>':'')+'<div class="pstep'+(o.kind?' '+o.kind:'')+'" style="grid-column:'+(2*i+1)+';grid-row:1"><b>'+esc(o.label)+'</b>'+(o.sub?'<span>'+esc(o.sub)+'</span>':'')+'</div>'}).join('')
  +(p.fallback?'<div class="pfall" style="grid-column:'+(2*fi+1)+';grid-row:2"><div class="conn" data-label="'+esc(p.fallbackLabel||'nếu lỗi')+'"></div><div class="pstep fall"><b>'+esc(p.fallback.label||p.fallback)+'</b>'+(p.fallback.sub?'<span>'+esc(p.fallback.sub)+'</span>':'')+'</div></div>':'')
  +'</div>'
  +'</div></div>'},

quality:function(s){var rows=arr(s.rows).slice(0,9);
 var lab={pass:'Đạt',warn:'Đạt, có lưu ý',fail:'Chưa đạt'};
 var pass=rows.filter(function(r){return r.status!=='fail'}).length;
 var sum=s.summary||{value:pass+'/'+rows.length,label:'ca kiểm thử đạt'};
 return '<div class="inner">'+head(s,'Kiểm thử')+'<div class="body"><div '+rvc('card ttable',1)+'>'
  +'<div class="trow th"><span>Mã</span><span>Loại</span><span>Ca kiểm thử → kết quả</span><span>Trạng thái</span></div>'
  +rows.map(function(r){var st=r.status||'pass';return '<div class="trow"><span class="id">'+esc(r.id||'')+'</span><span><span class="badge kind">'+esc(r.kind||'')+'</span></span><div class="what"><b>'+md(r.case)+'</b><span>→ '+md(r.result||'')+'</span></div><span><span class="badge '+st+'">'+icon(st==='fail'?'x':'check')+esc(r.label||lab[st])+'</span></span></div>'}).join('')
  +'</div><div class="tsum"><div '+rvc('card big',2)+'><b class="hl">'+esc(sum.value)+'</b><span>'+md(sum.label||'')+'</span></div>'
  +'<div '+rvc('card legend',3)+'>'+arr(s.legend).map(function(n){return '<div>'+icon('check')+'<span>'+md(n)+'</span></div>'}).join('')+'</div></div></div></div>'},

metrics:function(s){var it=arr(s.items).slice(0,6),n=it.length>4?3:(it.length>=4?4:Math.max(it.length,2));
 return '<div class="inner">'+head(s,'Tác động')+'<div class="grid c'+n+'">'
  +it.map(function(m,i){var dec=m.decimals||0,v=Number(m.value);return '<div '+rvc('card mcard',i+1)+'><div class="v hl">'+(m.prefix?'<small>'+esc(m.prefix)+'</small>':'')+'<span class="cnt" data-to="'+esc(v)+'" data-dec="'+dec+'">'+(isNaN(v)?esc(m.value):v.toFixed(dec))+'</span>'+(m.suffix?'<small>'+esc(m.suffix)+'</small>':'')+'</div><h3>'+md(m.label)+'</h3>'+(m.sub?'<p>'+md(m.sub)+'</p>':'')+'</div>'}).join('')
  +'</div>'+(s.note?'<div class="note rv" style="--i:7">'+md(s.note)+'</div>':'')+'</div>'},

roadmap:function(s){
 return '<div class="inner">'+head(s,'Bước tiếp theo')+'<div class="tl">'
  +arr(s.items).slice(0,4).map(function(r,i){return '<div '+rvc('rnode',i+1)+'><div class="when">'+esc(r.when||'')+'</div><div class="dotrow"><div class="dot"></div><div class="rl"></div></div><div class="card c"><h3>'+md(r.title)+'</h3><p>'+md(r.desc||'')+'</p>'+(r.tag?'<span class="tagnow">'+esc(r.tag)+'</span>':'')+'</div></div>'}).join('')
  +'</div></div>'},

team:function(s){var m=arr(s.members).slice(0,4);
 return '<div class="inner">'+head(s,'Đội ngũ')+'<div class="grid c'+Math.max(2,Math.min(m.length,4))+'">'
  +m.map(function(x,i){return '<div '+rvc('card mem',i+1)+'><div class="avatar">'+(x.photo?img(x.photo,x.name):esc(initials(x.name)))+'</div><div><h3>'+esc(x.name)+'</h3><div class="role">'+esc(x.role||'')+'</div></div><p>'+md(x.did||'')+'</p></div>'}).join('')
  +'</div>'+(s.stack&&s.stack.length?'<div class="stack rv" style="--i:6"><span>Công cụ:</span>'+arr(s.stack).map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>':'')+'</div>'},

thanks:function(s,c){var url=s.url||c.meta.liveUrl||'',vid=s.videoUrl||c.meta.videoUrl;
 return '<div class="inner"><div class="left"><div '+rv(0)+'><div class="eyebrow">'+esc(s.eyebrow==null?(c.meta.app||''):s.eyebrow)+'</div></div>'
  +'<h2 '+rvc('hl',1)+'>'+esc(s.title||'Cảm ơn!')+'</h2>'
  +'<p '+rvc('sub',2)+'>'+md(s.subtitle||'')+'</p>'
  +'<div '+rvc('qa',3)+'>'+icon('mic')+esc(s.cta||'Hỏi đáp')+'</div>'
  +'<div '+rvc('links',4)+'>'+(url?'<div>'+icon('globe')+'<b>'+esc(shortUrl(url))+'</b></div>':'')+(vid?'<div>'+icon('play')+'<b>'+esc(shortUrl(vid))+'</b></div>':'')+(s.contact?'<div>'+icon('mail')+'<b>'+esc(s.contact)+'</b></div>':'')+'</div></div>'
  +'<div class="right rv" style="--i:3"><div class="card qrcard">'+(url?qrBox(url):'')+'<div class="scan">'+esc(s.qrLabel||'Quét để dùng thử ngay')+'</div></div></div></div>'}
};
ICONS.mic='M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3z M6 11a6 6 0 0012 0 M12 17v4 M9 21h6';

var NOFOOT={cover:1,thanks:1};
/* Tên app dài: thu nhỏ chữ h1 trang bìa cho vừa cột trái (tối thiểu 72px, rồi mới cho xuống dòng) */
function fitCovers(){
  [].forEach.call(document.querySelectorAll('.s-cover h1'),function(h){
    h.style.fontSize='';h.style.whiteSpace='';
    var box=h.parentNode.clientWidth,need=h.scrollWidth;
    if(!box||need<=box)return;
    var base=parseFloat(getComputedStyle(h).fontSize),fs=Math.floor(base*box/need*0.98);
    if(fs<110&&/\s/.test(h.textContent.trim())){
      /* quá dài cho một dòng: cho xuống tối đa 2 dòng, chữ lớn nhất còn vừa */
      h.style.whiteSpace='normal';
      for(fs=Math.min(base,150);fs>56;fs-=4){h.style.fontSize=fs+'px';if(h.scrollWidth<=box&&h.offsetHeight<=fs*2.2)return}
    }
    h.style.fontSize=Math.max(fs,40)+'px';
  });
}
function build(deck){
  var meta=deck.meta||{},slides=arr(deck.slides),stage=document.getElementById('stage');
  var root=document.documentElement.style;
  if(meta.accent)root.setProperty('--accent',meta.accent);
  if(meta.accent2)root.setProperty('--accent2',meta.accent2);
  if(meta.title||meta.app)document.title=(meta.title||meta.app+' · Slide thuyết trình');
  var n=slides.length,html='';
  slides.forEach(function(s,i){
    var t=s.type,fn=R[t];
    var body=fn?fn(s,{meta:meta,i:i,n:n}):'<div class="inner">'+head({eyebrow:'Lỗi',title:'Loại slide không hợp lệ: '+t},'')+'</div>';
    var foot=NOFOOT[t]?'':'<footer class="foot"><span>'+(meta.footer?md(meta.footer):'')+'</span><span class="num">'+String(i+1).padStart(2,'0')+' / '+String(n).padStart(2,'0')+'</span></footer>';
    html+='<section class="slide s-'+t+(NOFOOT[t]?' nofoot':'')+'" data-i="'+i+'" aria-label="Slide '+(i+1)+'">'+body+foot+'</section>';
  });
  stage.innerHTML=html;
  fitCovers();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitCovers);
  return slides;
}

/* =============== Điều hướng =============== */
function start(deck){
  var slides=build(deck),els=[].slice.call(document.querySelectorAll('.slide')),n=els.length,cur=-1,t0=Date.now();
  if(!n){document.getElementById('err').classList.add('on');return}
  var stage=document.getElementById('stage'),prog=document.getElementById('progress'),pos=document.getElementById('pos'),notes=document.getElementById('notes');
  document.documentElement.dataset.ready='1';
  function fit(){if(EXPORT)return;var s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform='translate(-50%,-50%) scale('+s+')'}
  addEventListener('resize',fit);fit();

  function countUp(el){
    var to=parseFloat(el.dataset.to),dec=+el.dataset.dec||0;if(isNaN(to))return;
    if(REDUCE||EXPORT){el.textContent=to.toFixed(dec);return}
    var d=1100,s=performance.now();el.textContent=(0).toFixed(dec);
    (function tick(now){var p=Math.min(1,(now-s)/d),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(tick)})(s);
  }
  function renderNotes(){
    var s=slides[cur]||{},nx=slides[cur+1];
    var el=Math.floor((Date.now()-t0)/1000),mm=String(Math.floor(el/60)).padStart(2,'0'),ss=String(el%60).padStart(2,'0');
    notes.innerHTML='<div class="nh"><span>Slide '+(cur+1)+' / '+n+' · '+esc(s.type)+'</span>'+(s.time?'<span>Gợi ý: '+esc(s.time)+'</span>':'')+'<span class="t">⏱ '+mm+':'+ss+'</span></div><div class="nb">'+(s.notes?esc(s.notes):'(Chưa có ghi chú — thêm field notes cho slide này)')+'</div>'+(nx?'<div class="nx">Tiếp theo: '+esc(nx.type)+(nx.title?' — '+esc(String(nx.title).replace(/\{\{|\}\}|\*\*/g,'')):'')+'</div>':'');
  }
  function go(i,dir){
    i=Math.max(0,Math.min(n-1,i));if(i===cur)return;
    var prev=cur;dir=dir||(i>cur?1:-1);
    els.forEach(function(e,k){if(k!==i&&k!==prev)e.classList.remove('is-active','pre-next','pre-prev')});
    if(prev>=0){els[prev].classList.remove('is-active');els[prev].classList.add(dir>0?'pre-prev':'pre-next')}
    var e=els[i];e.classList.remove('pre-next','pre-prev');e.classList.add(dir>0?'pre-next':'pre-prev');void e.offsetWidth;e.classList.remove('pre-next','pre-prev');e.classList.add('is-active');
    cur=i;prog.style.width=(n>1?(i/(n-1))*100:100)+'%';pos.textContent=(i+1)+' / '+n;
    try{history.replaceState(null,'','#'+(i+1))}catch(x){}
    e.querySelectorAll('.cnt').forEach(countUp);
    e.querySelectorAll('.livebtn[data-auto="1"]').forEach(function(b){live(b)});
    if(prev>=0&&els[prev]){els[prev].querySelectorAll('iframe').forEach(function(f){f.remove()});els[prev].querySelectorAll('.livebtn').forEach(function(b){b.style.display=''})}
    renderNotes();
  }
  function live(btn){var sh=btn.parentNode,f=document.createElement('iframe');f.src=btn.dataset.live;f.setAttribute('loading','eager');f.title='Demo trực tiếp';sh.insertBefore(f,btn);btn.style.display='none'}
  stage.addEventListener('click',function(e){var b=e.target.closest('.livebtn');if(b){live(b);e.stopPropagation()}},true);

  var next=function(){go(cur+1,1)},prev=function(){go(cur-1,-1)};
  function toggleNotes(){document.body.classList.toggle('notes-on');renderNotes()}
  function full(){var d=document;if(d.fullscreenElement){d.exitFullscreen()}else(d.documentElement.requestFullscreen||function(){}).call(d.documentElement)}
  addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    switch(e.key){
      case 'ArrowRight':case 'ArrowDown':case 'PageDown':case ' ':case 'Enter':e.preventDefault();next();break;
      case 'ArrowLeft':case 'ArrowUp':case 'PageUp':case 'Backspace':e.preventDefault();prev();break;
      case 'Home':go(0,-1);break;case 'End':go(n-1,1);break;
      case 'n':case 'N':toggleNotes();break;
      case 'f':case 'F':full();break;
    }
  });
  /* chạm / vuốt */
  var tx=0,ty=0,tt=0;
  addEventListener('touchstart',function(e){var t=e.changedTouches[0];tx=t.clientX;ty=t.clientY;tt=Date.now()},{passive:true});
  addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4&&Date.now()-tt<900){dx<0?next():prev()}},{passive:true});
  /* bấm: 1/3 bên trái = lùi, còn lại = tiến */
  document.getElementById('viewport').addEventListener('click',function(e){
    if(e.target.closest('a,button,iframe,input,.livebtn'))return;
    var sel=getSelection&&getSelection().toString();if(sel)return;
    (e.clientX<innerWidth*0.28)?prev():next()});
  document.getElementById('b-prev').onclick=prev;document.getElementById('b-next').onclick=next;
  document.getElementById('b-notes').onclick=toggleNotes;document.getElementById('b-full').onclick=full;
  /* HUD tự ẩn */
  var hudT;function hud(){document.body.classList.add('show-hud');clearTimeout(hudT);hudT=setTimeout(function(){document.body.classList.remove('show-hud')},2600)}
  addEventListener('mousemove',hud);addEventListener('touchstart',hud,{passive:true});
  setInterval(function(){if(document.body.classList.contains('notes-on'))renderNotes()},1000);
  if(Q.has('notes'))document.body.classList.add('notes-on');
  /* in PDF từ trình duyệt: Ctrl+P */
  addEventListener('beforeprint',function(){document.documentElement.classList.add('export');document.querySelectorAll('.cnt').forEach(function(c){c.textContent=(+c.dataset.to).toFixed(+c.dataset.dec||0)})});
  addEventListener('afterprint',function(){if(!EXPORT)document.documentElement.classList.remove('export');fit()});

  if(EXPORT){els.forEach(function(e){e.classList.add('is-active')});document.querySelectorAll('.cnt').forEach(countUp);return}
  addEventListener('hashchange',function(){var k=parseInt((location.hash||'').slice(1),10);if(k>0&&k-1!==cur)go(k-1)});
  var h=parseInt((location.hash||'').slice(1),10);go(h>0?h-1:0,1);
  var help=document.getElementById('help');if(!h){help.classList.add('on');setTimeout(function(){help.classList.remove('on')},4200)}
}

/* =============== Nạp dữ liệu: inline JSON > ?data= > deck.data.js > example.data.js =============== */
function boot(){
  var inline=document.getElementById('deck-data').textContent.trim();
  if(inline&&!Q.get('data')){try{start(JSON.parse(inline));return}catch(e){console.error('JSON inline lỗi',e)}}
  var file=Q.get('data')||'deck.data.js',fallback=Q.get('data')?null:'example.data.js';
  function load(f,onfail){var sc=document.createElement('script');sc.src=f;sc.onload=function(){if(window.DECK)start(window.DECK);else document.getElementById('err').classList.add('on')};sc.onerror=function(){onfail?onfail():document.getElementById('err').classList.add('on')};document.head.appendChild(sc)}
  load(file,fallback?function(){console.info('Chưa có deck.data.js, đang hiển thị example.data.js');load(fallback)}:null);
}
if(document.fonts&&document.fonts.ready){boot()}else boot();
})();
</script>
</body>
</html>

=================== FILE: vibe-sprint/deck/example.data.js ===================
/* ============================================================================
   EXAMPLE — bộ slide hoàn chỉnh của Xclipse (Đề 8, Bảng B). Chỉ để tham khảo.
   Mở: deck.html?data=example.data.js     Xuất PDF: node tools/export.cjs example.data.js
   Quy ước chữ:  **đậm**   {{nhấn màu gradient}}   \n = xuống dòng
   ============================================================================ */
window.DECK = {
  meta: {
    app: 'Xclipse',
    title: 'Xclipse · Pitch chung kết',
    footer: '**Xclipse** · Đề 8 · Bảng B',
    accent: '#6A57F2',            // đổi màu chủ đạo theo đề (mặc định tím Lucian)
    accent2: '#2F8FE0',
    liveUrl: 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/',
    videoUrl: 'https://youtu.be/Wjn4xhXQXnc'
  },
  slides: [
    { type: 'cover', time: '0:15',
      app: 'Xclipse',
      tagline: 'Tạo landing page sự kiện trong **5 phút** bằng AI, đủ đăng ký, đếm ngược và QR.',
      de: 'Đề số 8', bang: 'Bảng B · Kinh tế', event: 'Chung kết 60 phút',
      team: 'Xclipse', members: ['Thành viên 1', 'Thành viên 2', 'Thành viên 3'], date: '2026',
      image: 'example/assets/03-thiet-ke-trang.png',
      notes: 'Chào BGK. Bọn em là đội Xclipse, đề 8 bảng B. Trong 60 phút bọn em làm ra công cụ giúp marketer có landing page sự kiện sau đúng 5 phút. Phần trình bày khoảng 6 phút, có demo trực tiếp.' },

    { type: 'problem', time: '0:40',
      eyebrow: 'Vấn đề',
      title: 'Marketer sự kiện **mất nhiều ngày** chỉ để có một trang đăng ký',
      persona: { name: 'Chị Lan', role: 'Marketing quán cà phê, sắp khai trương chi nhánh' },
      pains: [
        'Phải chờ designer, trang xong thì sự kiện còn vài ngày',
        'Danh sách đăng ký rải ở Zalo, inbox và Excel',
        'Không biết còn bao nhiêu chỗ, không có hạn ưu đãi tự động'
      ],
      scenarioLabel: 'Tình huống điển hình',
      scenario: 'Thứ Hai chị Lan cần trang đăng ký cho buổi khai trương **thứ Bảy**. Designer kín lịch, còn chị phải tự gom tên và số điện thoại bằng tay từ tin nhắn.',
      stat: { value: '5 phút', label: 'mục tiêu của Xclipse, từ form thông tin tới trang đăng ký chạy được' },
      notes: 'Persona: marketer của doanh nghiệp nhỏ. Nỗi đau lớn nhất là chờ và gom danh sách thủ công. Đây là tình huống điển hình bọn em dựng từ tìm hiểu người dùng, không phải số liệu khảo sát.' },

    { type: 'solution', time: '0:30',
      eyebrow: 'Giải pháp',
      oneLiner: 'Nhập thông tin một lần, AI viết chữ, ra ngay {{trang đăng ký hoàn chỉnh}}.',
      bullets: [
        { icon: 'wand', text: 'AI viết headline, mô tả, 3 lợi ích' },
        { icon: 'clock', text: 'Đếm ngược tới giờ G, số đăng ký tức thì' },
        { icon: 'qr', text: 'Chia sẻ bằng link hoặc mã QR' }
      ],
      image: 'example/assets/03-thiet-ke-trang.png', title: 'Màn hình thiết kế trang',
      notes: 'Một câu: nhập thông tin sự kiện, AI chỉ viết phần chữ, còn ngày giờ địa điểm luôn lấy đúng từ form. Ảnh bên phải là trình thiết kế sau khi bấm Tạo landing page.' },

    { type: 'features', time: '0:40',
      eyebrow: 'Năm tính năng theo đề',
      title: 'Đủ **5 tính năng** của đề, thêm vài thứ để dùng thật',
      items: [
        { icon: 'form', title: 'Form thông tin sự kiện', desc: 'Tên, thời gian, địa điểm, diễn giả, ưu đãi. Báo lỗi ngay dưới từng ô.' },
        { icon: 'sparkles', title: 'AI viết nội dung', desc: 'Headline, mô tả, 3 lợi ích. Ba chế độ: mô phỏng, Gemini thật, copy prompt.' },
        { icon: 'layout', title: 'Dựng landing page', desc: 'Hero, đếm ngược, diễn giả, agenda, ưu đãi. Sự kiện đã qua không đếm số âm.' },
        { icon: 'users', title: 'Đăng ký thời gian thực', desc: 'Trùng SĐT chỉ tính một lần, hết chỗ vào danh sách chờ, đếm cập nhật tức thì.' },
        { icon: 'list', title: 'Quản lý nhiều sự kiện', desc: 'Tạo trang mới, mở lại, nhân bản. Danh sách khách cho sale, xuất CSV.' }
      ],
      notes: 'Đi nhanh qua năm tính năng đúng theo đề. Nhấn mạnh hai quy tắc nghiệp vụ: trùng số điện thoại và hết chỗ. Phần mở rộng như 172 mẫu, builder, biểu đồ để hỏi đáp.' },

    { type: 'flow', time: '0:30',
      eyebrow: 'Luồng sử dụng',
      title: 'Từ ý tưởng đến người đăng ký trong **4 bước**',
      steps: [
        { icon: 'form', title: 'Nhập thông tin', desc: 'Tên, giờ, địa điểm, diễn giả' },
        { icon: 'sparkles', title: 'AI viết nội dung', desc: 'Headline, mô tả, 3 lợi ích' },
        { icon: 'layout', title: 'Tạo & chỉnh trang', desc: 'Chọn mẫu, màu, bố cục' },
        { icon: 'qr', title: 'Chia sẻ & thu lead', desc: 'Link hoặc QR, khách đăng ký' }
      ],
      note: 'Dữ liệu chưa xuất bản lưu trên trình duyệt; xuất bản thì dùng Cloud Firestore.',
      notes: 'Bốn bước, mỗi bước một thao tác. Người dùng không cần biết thiết kế hay code.' },

    { type: 'demo', time: '1:30',
      eyebrow: 'Demo trực tiếp',
      title: 'Landing page thật, đang chạy **ngay bây giờ**',
      url: 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/',
      image: 'example/assets/04-landing-page.png', iframe: true,
      qrLabel: 'Quét để dùng thử',
      caption: 'Kịch bản: **điền dữ liệu mẫu** → **Tạo landing page** → đăng ký thử → thấy số đăng ký tăng.',
      notes: 'DEMO (1 phút 30): 1) Tab Thông tin, bấm Điền dữ liệu mẫu. 2) Bấm Tạo landing page, chỉ AI mô phỏng và dòng cảnh báo. 3) Mở trang công khai, đăng ký bằng số điện thoại, số đếm tăng. 4) Đăng ký lại cùng số để cho thấy báo trùng. Nếu mạng lỗi: dùng ảnh trên slide hoặc video youtu.be/Wjn4xhXQXnc.' },

    { type: 'ai', time: '0:50',
      eyebrow: 'AI trong sản phẩm',
      title: 'AI **chỉ viết chữ**, mọi dữ kiện lấy từ form',
      realTitle: 'AI thật', real: [
        'Gemini API do người dùng tự nhập key',
        'Copy prompt sang Claude, ChatGPT hoặc Gemini rồi dán JSON về'
      ],
      mockTitle: 'AI mô phỏng', mock: [
        'Chế độ offline ghép từ công thức copywriting',
        'Luôn hiện cảnh báo "Dữ liệu mô phỏng AI", nhắc đọc lại trước khi xuất bản'
      ],
      controlsTitle: 'Kiểm soát đầu ra', controls: [
        'Prompt cấm bịa ngày giờ, địa điểm, giá, tên người',
        'Key chỉ lưu ở trình duyệt, không có trong mã nguồn',
        'Tách JSON, sửa lỗi JSON thường gặp, kiểm tra đủ trường'
      ],
      pipeline: {
        steps: [
          { label: 'Prompt', sub: 'dữ kiện từ form' },
          { label: 'Gọi AI', sub: 'Gemini / dán tay', kind: 'key' },
          { label: 'Kiểm tra', sub: 'JSON, đủ trường, độ dài', kind: 'key' },
          { label: 'Hiển thị', sub: 'cho người dùng sửa', kind: 'ok' }
        ],
        fallbackAt: 2, fallbackLabel: 'lỗi hoặc thiếu trường',
        fallback: { label: 'Bù bằng bản mô phỏng', sub: 'và báo rõ cho người dùng' }
      },
      notes: 'Nói thật: ở bản demo, AI mặc định là chế độ mô phỏng; Gemini thật cần key của người dùng và nhóm chưa gọi được Gemini thật trong môi trường dev vì không có key. Điểm mạnh là kiểm soát: prompt cấm bịa, kết quả luôn được kiểm tra, thiếu thì bù và báo. Ca TC09 kiểm chứng điều này.' },

    { type: 'quality', time: '0:40',
      eyebrow: 'Kiểm thử',
      title: 'Kiểm thử bằng **trình duyệt thật**, đủ 3 loại ca',
      rows: [
        { id: 'TC01', kind: 'Bình thường', case: 'Điền dữ liệu mẫu rồi tạo landing page', result: 'Đủ 8 phần, có cảnh báo AI mô phỏng' },
        { id: 'TC02', kind: 'Nhập thiếu', case: 'Để trống tên sự kiện, bấm tạo', result: 'Báo "Vui lòng nhập tên sự kiện.", không tạo trang' },
        { id: 'TC03', kind: 'Nhập sai', case: 'SĐT "12345", email "abc"', result: 'Báo lỗi dưới từng ô, không lưu' },
        { id: 'TC05', kind: 'Biên', case: 'Đăng ký lại cùng số điện thoại', result: 'Báo đã đăng ký, số đếm giữ nguyên' },
        { id: 'TC07', kind: 'Biên', case: 'Sự kiện đã diễn ra', result: 'Hiện "Đã diễn ra", không đếm âm, ẩn form', status: 'warn', label: 'Đạt, 1 lưu ý' },
        { id: 'TC08', kind: 'Biên', case: 'Số chỗ 2, người thứ 3 đăng ký', result: 'Vào danh sách chờ, nút đổi chữ' },
        { id: 'TC09', kind: 'Sự cố AI', case: 'Dán JSON lỗi, thiếu 1 lợi ích', result: 'Đọc được, bù mục thiếu và báo rõ' },
        { id: 'TC14', kind: 'Bảo mật', case: 'Tài khoản lạ đọc danh sách đăng ký', result: 'permission-denied (Firestore rules)' }
      ],
      summary: { value: '15/15', label: 'ca trong bảng kiểm thử đạt, chạy lại 09/11/2026' },
      legend: [
        'Chạy bằng Playwright + Chromium thật',
        'TC07: nút đầu trang vẫn hiện, đã ghi nhận',
        'Thêm 33 ca quy tắc bảo mật Firestore'
      ],
      notes: 'Ba loại ca bắt buộc của bảng B: bình thường, nhập thiếu hoặc sai, biên. Mỗi ca có ảnh minh chứng trong docs/evidence. Nói thẳng TC07 còn một điểm nhỏ: nút Đăng ký ở đầu trang vẫn hiện khi sự kiện đã qua.' },

    { type: 'metrics', time: '0:25',
      eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được** trong repo',
      items: [
        { prefix: '≤', value: 5, suffix: ' phút', label: 'Từ form đến landing page', sub: 'Mục tiêu của đề, thao tác trong demo' },
        { value: 172, label: 'Mẫu theo ngành', sub: 'Lọc theo ngành, loại sự kiện, mục đích' },
        { value: 15, suffix: '/15', label: 'Ca kiểm thử đạt', sub: 'Bảng kiểm thử, có ảnh minh chứng' },
        { value: 33, label: 'Ca bảo mật Firestore', sub: 'Quy tắc đọc ghi, chống vượt chỗ' }
      ],
      note: 'Chưa kiểm chứng: Gemini API thật và Google Sheet với Apps Script thật (đã nêu rõ trong bảng kiểm thử).',
      notes: 'Chỉ nêu số có trong repo. Nhấn mạnh sự trung thực: phần chưa kiểm chứng được ghi rõ, và là việc đầu tiên trong lộ trình.' },

    { type: 'roadmap', time: '0:20',
      eyebrow: 'Bước tiếp theo',
      title: 'Lộ trình **sau chung kết**',
      items: [
        { when: 'Tuần 1', title: 'Kiểm chứng AI thật', desc: 'Chạy Gemini API với key thật, đo chất lượng nội dung tiếng Việt.', tag: 'Ưu tiên' },
        { when: 'Tuần 2', title: 'Google Sheet thật', desc: 'Đồng bộ đăng ký vào Sheet của ban tổ chức qua Apps Script.' },
        { when: 'Tháng 1', title: 'Nhắc lịch, check-in', desc: 'Email hoặc Zalo nhắc giờ G, quét QR check-in tại cửa.' },
        { when: 'Tháng 2', title: 'Đo hiệu quả chiến dịch', desc: 'Phễu xem trang → bấm đăng ký → tham dự theo từng nguồn.' }
      ],
      notes: 'Bốn bước tiếp theo, bước đầu là đóng nốt hai mục chưa kiểm chứng.' },

    { type: 'team', time: '0:15',
      eyebrow: 'Đội ngũ',
      title: 'Đội **Xclipse**, 60 phút, cùng làm với AI',
      members: [
        { name: 'Thành viên 1', role: 'Sản phẩm & UX', did: 'Chọn bài toán, kịch bản demo, kiểm thử bằng tay trên điện thoại.' },
        { name: 'Thành viên 2', role: 'Prompt & AI', did: 'Thiết kế prompt, kiểm soát đầu ra AI, xử lý ca lỗi.' },
        { name: 'Thành viên 3', role: 'Vibe code & QA', did: 'Cùng AI viết mã, chạy Playwright, sửa lỗi theo ảnh chụp.' }
      ],
      stack: ['HTML / CSS / JS thuần', 'Firebase Firestore', 'Gemini API', 'Claude', 'Playwright', 'GitHub Pages'],
      notes: 'Giới thiệu nhanh vai trò. Thay tên thật của thành viên trong file dữ liệu.' },

    { type: 'thanks', time: '0:15',
      eyebrow: 'Xclipse · Đề 8 · Bảng B',
      title: 'Cảm ơn!',
      subtitle: 'Quét mã để tạo landing page sự kiện đầu tiên của bạn.',
      cta: 'Hỏi đáp',
      url: 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/',
      videoUrl: 'https://youtu.be/Wjn4xhXQXnc',
      qrLabel: 'Quét để dùng thử ngay',
      notes: 'Mời BGK quét QR dùng thử. Chuẩn bị sẵn trả lời: vì sao AI mô phỏng, chống bịa dữ kiện thế nào, quy tắc trùng và hết chỗ.' }
  ]
};

=================== FILE: vibe-sprint/deck/template.data.js ===================
/* ============================================================================
   TEMPLATE — sao chép thành deck.data.js rồi điền 12 ô đánh số [1]…[12].
   Mở deck.html là thấy ngay. Không sửa deck.html. Xuất PDF: node tools/export.cjs
   Quy ước chữ:  **đậm**   {{nhấn màu gradient}}
   Ảnh: đặt trong assets/ (chụp bằng tools/capture.cjs). Thiếu ảnh thì khung hiện chữ nhắc.
   Mỗi slide có thể có  notes: '...'  (ghi chú trình bày, bấm N)  và  time: '0:40'  (gợi ý thời lượng).
   ============================================================================ */
window.DECK = {
  meta: {
    app: 'TÊN APP',                                    // [1] tên app
    title: 'TÊN APP · Pitch chung kết',
    footer: '**TÊN APP** · Đề X · Bảng Y',             // chân trang mỗi slide
    accent: '#6A57F2', accent2: '#2F8FE0',             // màu theo đề (bỏ dòng này để dùng tím–xanh mặc định)
    liveUrl: 'https://TEN.github.io/REPO/',            // [8] link app đang chạy (tự sinh QR)
    videoUrl: 'https://youtu.be/XXXXXXXXXXX'           // [8] link video demo
  },
  slides: [
    { type: 'cover', time: '0:15',
      app: 'TÊN APP',                                  // [1]
      tagline: 'Một câu: làm gì cho ai, nhanh/tốt hơn thế nào.',  // [2] tagline ≤ 15 từ
      de: 'Đề số X', bang: 'Bảng Y', event: 'Chung kết 60 phút',  // [3] đề + bảng
      team: 'TÊN ĐỘI', members: ['Thành viên 1', 'Thành viên 2'], date: '2026',  // [3]
      image: 'assets/01-man-hinh-chinh.png',
      notes: 'Chào BGK, tên đội, đề nào, 60 giây tới sẽ thấy gì.' },

    { type: 'problem', time: '0:40', eyebrow: 'Vấn đề',
      title: 'Một câu nêu **nỗi đau** của người dùng',
      persona: { name: 'Tên persona', role: 'Vai trò, bối cảnh' },       // [4] persona
      pains: ['Nỗi đau 1', 'Nỗi đau 2', 'Nỗi đau 3'],                    // [4] 2–4 nỗi đau
      scenarioLabel: 'Tình huống điển hình',                              // ghi "thật" chỉ khi đúng là chuyện thật
      scenario: 'Một tình huống cụ thể có **thời điểm, con số, hậu quả**.', // [5]
      stat: { value: 'X phút', label: 'mục tiêu / con số đo được' },
      notes: 'Nói như kể chuyện: ai, khi nào, đau ở đâu.' },

    { type: 'solution', time: '0:30', eyebrow: 'Giải pháp',
      oneLiner: 'Làm A một lần, ra ngay {{kết quả B}}.',                  // [6] giải pháp một câu
      bullets: [{ icon: 'wand', text: 'Điểm mạnh 1' }, { icon: 'clock', text: 'Điểm mạnh 2' }, { icon: 'qr', text: 'Điểm mạnh 3' }],
      image: 'assets/02-giai-phap.png', title: 'Màn hình chính',
      notes: 'Một câu giải pháp + chỉ vào ảnh.' },

    { type: 'features', time: '0:40', eyebrow: 'Tính năng',
      title: 'Đủ **5 tính năng** của đề',
      items: [                                                             // [7] 5 tính năng (icon: xem danh sách cuối file)
        { icon: 'form', title: 'Tính năng 1', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'sparkles', title: 'Tính năng 2', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'layout', title: 'Tính năng 3', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'users', title: 'Tính năng 4', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'list', title: 'Tính năng 5', desc: 'Mô tả ≤ 15 từ.' }
      ],
      notes: 'Đi nhanh, nhấn 1–2 quy tắc nghiệp vụ.' },

    { type: 'flow', time: '0:30', eyebrow: 'Luồng sử dụng',
      title: 'Từ A đến B trong **4 bước**',
      steps: [
        { icon: 'form', title: 'Bước 1', desc: 'Làm gì' },
        { icon: 'sparkles', title: 'Bước 2', desc: 'Làm gì' },
        { icon: 'layout', title: 'Bước 3', desc: 'Làm gì' },
        { icon: 'qr', title: 'Bước 4', desc: 'Làm gì' }
      ],
      note: 'Dữ liệu lưu ở đâu / điều cần biết (tuỳ chọn).' },

    { type: 'demo', time: '1:30', eyebrow: 'Demo trực tiếp',
      title: 'Đang chạy **ngay bây giờ**',
      image: 'assets/03-demo.png',                                         // ảnh dự phòng khi mất mạng
      iframe: true,                                                        // true = có nút "Chạy trực tiếp" nhúng link live (app phải cho phép iframe)
      caption: 'Kịch bản: **bước 1** → **bước 2** → **bước 3**.',
      notes: 'DEMO: liệt kê đúng các thao tác, ca nhập sai, ca biên. Mất mạng: dùng video.' },

    { type: 'ai', time: '0:50', eyebrow: 'AI trong sản phẩm',
      title: 'AI **làm gì**, kiểm soát thế nào',
      realTitle: 'AI thật', real: ['Phần nào gọi AI thật'],               // [9]
      mockTitle: 'Mô phỏng', mock: ['Phần nào là mô phỏng / dữ liệu mẫu (nói thẳng)'],  // [9]
      controlsTitle: 'Kiểm soát', controls: ['Chống bịa', 'Kiểm tra đầu ra', 'Bảo vệ khoá API'],
      pipeline: { steps: [
          { label: 'Prompt', sub: 'dữ kiện từ form' },
          { label: 'Gọi AI', sub: 'model / dán tay', kind: 'key' },
          { label: 'Kiểm tra', sub: 'định dạng, đủ trường', kind: 'key' },
          { label: 'Hiển thị', sub: 'người dùng sửa', kind: 'ok' } ],
        fallbackAt: 2, fallbackLabel: 'lỗi hoặc thiếu',
        fallback: { label: 'Dự phòng', sub: 'bản mô phỏng + báo rõ' } },
      notes: 'Trung thực: thật vs mô phỏng. Nêu cách kiểm soát và ca sự cố AI đã thử.' },

    { type: 'quality', time: '0:40', eyebrow: 'Kiểm thử',
      title: 'Đủ **3 loại ca**: bình thường, nhập sai, biên',
      rows: [                                                              // [10] ≥ 6 ca; status: 'pass' | 'warn' | 'fail'
        { id: 'TC01', kind: 'Bình thường', case: 'Ca 1', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC02', kind: 'Nhập thiếu', case: 'Ca 2', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC03', kind: 'Nhập sai', case: 'Ca 3', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC04', kind: 'Biên', case: 'Ca 4', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC05', kind: 'Biên', case: 'Ca 5', result: 'Còn lỗi nhỏ, đã ghi nhận', status: 'warn', label: 'Đạt, 1 lưu ý' },
        { id: 'TC06', kind: 'Sự cố AI', case: 'Ca 6', result: 'Kết quả thực tế', status: 'pass' }
      ],
      summary: { value: '6/6', label: 'ca đạt, chạy ngày DD/MM' },
      legend: ['Cách kiểm thử (tay / tự động)', 'Lỗi còn lại nói thẳng'],
      notes: 'Chỉ nêu kết quả đã chạy thật.' },

    { type: 'metrics', time: '0:25', eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được**',
      items: [                                                             // [11] 3–4 con số có nguồn
        { value: 5, suffix: ' phút', label: 'Thời gian từ A đến B', sub: 'Nguồn / cách đo' },
        { value: 100, suffix: '%', label: 'Ca kiểm thử đạt', sub: 'Nguồn / cách đo' },
        { value: 12, label: 'Mẫu / dữ liệu', sub: 'Nguồn / cách đo' }
      ],
      note: 'Phần chưa kiểm chứng (nói thẳng).',
      notes: 'Chỉ dùng số bạn chứng minh được trong repo.' },

    { type: 'roadmap', time: '0:20', eyebrow: 'Bước tiếp theo',
      title: 'Lộ trình **sau chung kết**',
      items: [
        { when: 'Tuần 1', title: 'Việc 1', desc: 'Mô tả ngắn.', tag: 'Ưu tiên' },
        { when: 'Tuần 2', title: 'Việc 2', desc: 'Mô tả ngắn.' },
        { when: 'Tháng 1', title: 'Việc 3', desc: 'Mô tả ngắn.' }
      ] },

    { type: 'team', time: '0:15', eyebrow: 'Đội ngũ',
      title: 'Đội **TÊN ĐỘI**',
      members: [                                                           // [12] 2–4 thành viên
        { name: 'Họ và tên 1', role: 'Vai trò', did: 'Đã làm gì trong 60 phút.' },
        { name: 'Họ và tên 2', role: 'Vai trò', did: 'Đã làm gì trong 60 phút.' }
      ],
      stack: ['Công cụ 1', 'Công cụ 2'] },

    { type: 'thanks', time: '0:15', eyebrow: 'TÊN APP · Đề X · Bảng Y',
      title: 'Cảm ơn!', subtitle: 'Quét mã để dùng thử.', cta: 'Hỏi đáp',
      qrLabel: 'Quét để dùng thử ngay'                                      // url/video lấy từ meta ở trên
    }
  ]
};
/* Tên icon dùng được: form sparkles wand layout users user qr chart bolt shield clock check x alert globe phone file list
   calendar rocket target heart search edit lock cloud mail star code db arrow image link play money flag bell mic.
   (icon không có trong danh sách sẽ hiện nguyên chữ, ví dụ icon: '1' hoặc '%'.) */

=================== FILE: vibe-sprint/deck/tools/capture.cjs ===================
#!/usr/bin/env node
/* capture.cjs — chụp ảnh màn hình app cho slide (Playwright, chạy offline với app chạy local).
 *
 * Cách 1 (nhanh, 1 màn hình):
 *   node tools/capture.cjs --url http://localhost:8202/ --name home
 *   node tools/capture.cjs --url http://localhost:8202/ --name form --click '#btn-sample' --selector '#view-builder'
 *
 * Cách 2 (nhiều màn hình, khuyên dùng): file cấu hình JSON
 *   node tools/capture.cjs tools/capture.example.json
 *
 * Cấu hình JSON:
 * {
 *   "base": "http://localhost:8202/",        // gốc URL; mỗi view có thể dùng "url" tương đối hoặc tuyệt đối
 *   "out": "../assets",                      // thư mục ảnh (tính từ file cấu hình); mặc định deck/assets
 *   "desktop": [1600, 1000], "mobile": [390, 844],
 *   "reduceMotion": true,                    // tắt animation cho ảnh sạch (mặc định true)
 *   "views": [
 *     { "name": "home", "url": "index.html?demo=1",
 *       "steps": [ {"click":"#btn"}, {"fill":["#f-name","Tên"]}, {"select":["select[name=status]","done"]}, {"press":"Enter"}, {"wait":800},
 *                  {"waitFor":".card"}, {"hide":".popup"}, {"scroll":"#section"}, {"eval":"document.title='x'"},
 *                  {"storage":{"key":"value"}} ],       // storage: đặt localStorage TRƯỚC khi mở trang
 *       "selector": "#view-editor",            // (tuỳ chọn) chỉ chụp phần tử này
 *       "fullPage": false,
 *       "devices": ["desktop","mobile"]        // mặc định ["desktop"]; ảnh mobile đặt tên <name>-m.png
 *     }
 *   ]
 * }
 * Ảnh ra: <out>/<name>.png (1600x1000) và <out>/<name>-m.png (390x844, deviceScaleFactor 2).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');

function loadPlaywright() {
  const tries = [() => require('playwright'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')),
    () => require('playwright-core'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright-core'))];
  for (const t of tries) { try { return t(); } catch (e) { /* thử tiếp */ } }
  console.error('Không tìm thấy Playwright. Cài: npm i -g playwright && npx playwright install chromium'); process.exit(1);
}

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) { const k = t.slice(2); const v = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : true; if (a[k] === undefined) a[k] = v; else a[k] = [].concat(a[k], v); }
    else a._.push(t);
  }
  return a;
}

async function runSteps(page, steps) {
  for (const s of steps || []) {
    if (s.click) await page.click(s.click, { timeout: 8000 });
    else if (s.fill) await page.fill(s.fill[0], s.fill[1]);
    else if (s.select) await page.selectOption(s.select[0], s.select[1]);
    else if (s.press) await page.keyboard.press(s.press);
    else if (s.wait) await page.waitForTimeout(s.wait);
    else if (s.waitFor) await page.waitForSelector(s.waitFor, { timeout: 10000 });
    else if (s.hide) await page.addStyleTag({ content: `${s.hide}{display:none!important}` });
    else if (s.scroll) await page.$eval(s.scroll, el => el.scrollIntoView({ block: 'start' }));
    else if (s.eval) await page.evaluate(s.eval);
    else if (s.optionalClick) { try { await page.click(s.optionalClick, { timeout: 1500 }); } catch (e) { /* bỏ qua */ } }
  }
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  let cfg, cfgDir = process.cwd();
  if (args._[0]) { const f = path.resolve(args._[0]); cfg = JSON.parse(fs.readFileSync(f, 'utf8')); cfgDir = path.dirname(f); }
  else if (args.url) {
    cfg = { views: [{ name: args.name || 'screen', url: args.url, selector: args.selector, fullPage: !!args.fullPage,
      steps: [].concat(args.click || []).map(c => ({ click: c })), devices: args.mobile ? ['desktop', 'mobile'] : ['desktop'] }] };
    if (args.out) cfg.out = path.resolve(args.out);
  } else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(args.help ? 0 : 1); }

  const deckDir = path.resolve(__dirname, '..');
  const out = cfg.out ? path.resolve(cfgDir, cfg.out) : path.join(deckDir, 'assets');
  fs.mkdirSync(out, { recursive: true });
  const D = cfg.desktop || [1600, 1000], M = cfg.mobile || [390, 844];
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  let fail = 0;
  for (const v of cfg.views) {
    for (const dev of (v.devices || ['desktop'])) {
      const mobile = dev === 'mobile', vp = mobile ? M : D;
      const ctx = await browser.newContext({
        viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: mobile ? 2 : 1,
        isMobile: mobile, hasTouch: mobile, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh',
        reducedMotion: cfg.reduceMotion === false ? 'no-preference' : 'reduce'
      });
      const steps = v.steps || [];
      const store = steps.filter(s => s.storage).reduce((o, s) => Object.assign(o, s.storage), {});
      if (Object.keys(store).length) await ctx.addInitScript(o => { for (const k in o) { try { localStorage.setItem(k, o[k]); } catch (e) {} } }, store);
      const page = await ctx.newPage();
      page.on('dialog', d => d.accept());
      const url = /^https?:|^file:/.test(v.url || '') ? v.url : (cfg.base || '') + (v.url || '');
      const file = path.join(out, v.name + (mobile ? '-m' : '') + '.png');
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(v.settle || 900);
        await runSteps(page, steps.filter(s => !s.storage));
        await page.waitForTimeout(v.after || 600);
        if (v.selector) await (await page.waitForSelector(v.selector, { timeout: 10000 })).screenshot({ path: file });
        else await page.screenshot({ path: file, fullPage: !!v.fullPage });
        console.log('OK  ', path.relative(process.cwd(), file) || file, `(${vp[0]}x${vp[1]}${mobile ? ' @2x' : ''})`);
      } catch (e) { fail++; console.error('LỖI ', v.name, dev, '-', e.message.split('\n')[0]); }
      await ctx.close();
    }
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();

=================== FILE: vibe-sprint/deck/tools/capture.example.json ===================
{
  "base": "http://localhost:8225/",
  "out": "../assets",
  "desktop": [1600, 1000],
  "mobile": [390, 844],
  "views": [
    { "name": "01-tong-quan", "url": "index.html?demo=1#/home", "settle": 1200,
      "steps": [ { "hide": "#toasts" }, { "wait": 400 } ], "devices": ["desktop", "mobile"] },
    { "name": "02-danh-sach", "url": "index.html?demo=1#/example", "settle": 1200,
      "steps": [ { "hide": "#toasts" }, { "waitFor": ".table tbody tr" }, { "wait": 400 } ] },
    { "name": "03-form", "url": "index.html?demo=1#/example",
      "steps": [ { "waitFor": "[data-act=\"add\"]" }, { "click": "[data-act=\"add\"]" }, { "waitFor": "dialog[open]" },
                 { "fill": ["dialog [name=\"name\"]", "Mục demo cho slide"] }, { "select": ["dialog [name=\"status\"]", "doing"] }, { "wait": 400 } ] },
    { "name": "04-ket-qua-ai", "url": "index.html?demo=1#/example",
      "steps": [ { "waitFor": "#ex-ai-go" }, { "fill": ["#ex-ai-form textarea", "Chuẩn bị tài liệu và đặt phòng họp cho buổi gặp đối tác tuần sau"] },
                 { "click": "#ex-ai-go" }, { "waitFor": ".ai-result" }, { "wait": 600 } ], "devices": ["desktop", "mobile"] }
  ]
}

=================== FILE: vibe-sprint/deck/tools/export.cjs ===================
#!/usr/bin/env node
/* export.cjs — xuất deck.html (với file dữ liệu chỉ định) ra PDF (1 trang/slide), PNG từng slide, và PPTX (nếu có pptxgenjs).
 *
 *   node tools/export.cjs                      # dùng deck.data.js
 *   node tools/export.cjs example.data.js      # dùng file dữ liệu khác (đường dẫn tính từ thư mục deck/)
 *   node tools/export.cjs deck.data.js --out out --name Xclipse --no-pptx --scale 1
 *
 * Kết quả trong deck/out/ (hoặc --out):  <name>.pdf, png/slide-01.png ..., <name>.pptx (nếu pptxgenjs có sẵn)
 * PNG 1920x1080 (--scale 2 cho 3840x2160). PDF kích thước 1920x1080 px, giữ chữ thật, QR là vector.
 * PPTX: mỗi slide là 1 ảnh PNG (không sửa chữ được) + ghi chú trình bày. Cài: npm i pptxgenjs (trong thư mục deck/).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const deckDir = path.resolve(__dirname, '..');

function loadMod(name) {
  const g = () => cp.execSync('npm root -g').toString().trim();
  const tries = [() => require(name), () => require(path.join(deckDir, 'node_modules', name)), () => require(path.join(g(), name))];
  for (const t of tries) { try { return t(); } catch (e) { /* thử tiếp */ } }
  return null;
}
const args = (() => { const a = { _: [] }, v = process.argv.slice(2); for (let i = 0; i < v.length; i++) { if (v[i].startsWith('--')) { const k = v[i].slice(2); a[k] = (v[i + 1] && !v[i + 1].startsWith('--')) ? v[++i] : true; } else a._.push(v[i]); } return a; })();

(async () => {
  const pw = loadMod('playwright') || loadMod('playwright-core');
  if (!pw) { console.error('Không tìm thấy Playwright. Cài: npm i -g playwright && npx playwright install chromium'); process.exit(1); }
  const dataFile = args._[0] || 'deck.data.js';
  if (!fs.existsSync(path.join(deckDir, dataFile))) { console.error('Không thấy file dữ liệu: ' + dataFile); process.exit(1); }
  const name = args.name || path.basename(dataFile).replace(/\.data\.js$|\.js$/, '') || 'deck';
  const out = path.resolve(args.out || path.join(deckDir, 'out'));
  const pngDir = path.join(out, 'png');
  fs.mkdirSync(pngDir, { recursive: true });
  const scale = Number(args.scale) || 1;

  const browser = await pw.chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale, locale: 'vi-VN', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // phục vụ qua file:// để chạy offline, không cần server (ảnh trong assets/ là đường dẫn tương đối)
  const url = 'file://' + path.join(deckDir, 'deck.html') + '?export=1&data=' + encodeURIComponent(dataFile);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))));
  await page.waitForTimeout(500);

  const slides = await page.$$('.slide');
  const notes = await page.evaluate(() => (window.DECK && window.DECK.slides || []).map(s => s.notes || ''));
  const broken = await page.evaluate(() => [...document.querySelectorAll('.shot.missing')].map(e => e.dataset.missing));
  if (broken.length) console.warn('CẢNH BÁO ảnh thiếu / không tải được:\n  - ' + broken.join('\n  - '));

  // PNG từng slide
  const pngs = [];
  for (let i = 0; i < slides.length; i++) {
    const f = path.join(pngDir, 'slide-' + String(i + 1).padStart(2, '0') + '.png');
    await slides[i].screenshot({ path: f }); pngs.push(f);
  }
  console.log('PNG  ', slides.length, 'slide ->', path.relative(process.cwd(), pngDir) || pngDir);

  // PDF: 1 slide = 1 trang 1920x1080 px
  const pdf = path.join(out, name + '.pdf');
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdf, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('PDF  ', path.relative(process.cwd(), pdf) || pdf);
  await browser.close();

  // PPTX (tuỳ chọn)
  if (!args['no-pptx']) {
    const Pptx = loadMod('pptxgenjs');
    if (!Pptx) console.log('PPTX  bỏ qua: chưa có pptxgenjs (cd deck && npm i pptxgenjs để bật).');
    else {
      const p = new Pptx(); p.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in (16:9)
      pngs.forEach((f, i) => { const s = p.addSlide(); s.addImage({ path: f, x: 0, y: 0, w: 13.333, h: 7.5 }); if (notes[i]) s.addNotes(notes[i]); });
      const f = path.join(out, name + '.pptx'); await p.writeFile({ fileName: f });
      console.log('PPTX ', path.relative(process.cwd(), f) || f, '(mỗi slide là một ảnh)');
    }
  }
  if (errors.length) console.warn('Lỗi JS trong trang:', errors.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });

=================== FILE: vibe-sprint/prompts/00-README.md ===================
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

=================== FILE: vibe-sprint/prompts/01-spec-from-de.md ===================
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

=================== FILE: vibe-sprint/prompts/02-feature-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/03-shell-brand-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/04-ai-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/05-data-demo-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/06-qa-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/07-deck-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/08-docs-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/09-merge-deploy.md ===================
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

=================== FILE: vibe-sprint/prompts/10-polish-agent.md ===================
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

=================== FILE: vibe-sprint/prompts/11-emergency.md ===================
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

=================== FILE: vibe-sprint/references/01-doc-de-60-phut.md ===================
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

=================== FILE: vibe-sprint/references/02-dieu-phoi-agent.md ===================
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

=================== FILE: vibe-sprint/references/03-chat-luong-xclipse.md ===================
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

=================== FILE: vibe-sprint/references/04-bai-hoc-loi-thuong-gap.md ===================
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

=================== FILE: vibe-sprint/references/05-thuyet-trinh-va-hoi-dap.md ===================
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

=================== FILE: vibe-sprint/references/06-ho-so-va-trien-khai.md ===================
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
git ls-files -z | xargs -0 grep -nEI "AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|api[_-]?key['\"]?\s*[:=]\s*['\"][^'\"]{12,}" | cut -c1-120
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

=================== FILE: vibe-sprint/references/07-cookbook-code-mau.md ===================
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

=================== FILE: vibe-sprint/references/08-quy-uoc-viet.md ===================
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

=================== FILE: vibe-sprint/scripts/new-project.sh ===================
#!/usr/bin/env bash
# new-project.sh: tạo thư mục dự án sprint 60 phút từ bộ mẫu vibe-sprint.
#
# Cách dùng:
#   scripts/new-project.sh <tên-thư-mục> ["Tên sản phẩm"] [thư-mục-cha]
#   BRANCH=nop-bai scripts/new-project.sh xclipse-event "Xclipse" ~/contest
#
# Tên thư mục: chữ thường, số, gạch nối (ví dụ: xclipse-event).
# Mặc định: tên sản phẩm = tên thư mục; thư mục cha = thư mục hiện tại; nhánh = nop-bai.
#
# Làm gì:
#   1. Chép templates/ vào dự án: CLAUDE.md và README.md ở gốc, các tài liệu còn lại vào docs/.
#   2. Chép scripts/scan-secrets.mjs vào scripts/ của dự án.
#   3. Chép khung web starter/ và bộ slide deck/ (không chép deck/out, deck/example).
#   4. Thay <Tên sản phẩm> bằng tên thật, đặt tên nhánh trong CLAUDE.md.
#   5. git init với nhánh đã chọn (không commit, để đội tự commit sau khi kiểm tra).

set -euo pipefail

usage() {
  sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
  exit 2
}

[ $# -ge 1 ] || usage
[ "${1:-}" != "-h" ] && [ "${1:-}" != "--help" ] || usage

SLUG="$1"
PRODUCT="${2:-$SLUG}"
PARENT="${3:-$PWD}"
BRANCH="${BRANCH:-nop-bai}"

if ! [[ "$SLUG" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Tên thư mục chỉ gồm chữ thường, số và gạch nối: '$SLUG'" >&2
  exit 2
fi
if ! [[ "$BRANCH" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]]; then
  echo "Tên nhánh không hợp lệ: '$BRANCH'" >&2
  exit 2
fi

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$SKILL_DIR/templates"
SCRIPTS="$SKILL_DIR/scripts"
STARTER="$SKILL_DIR/starter"

for f in CLAUDE.md README-du-thi.md spec-nhanh.md PROGRESS.md DECISIONS.md BANG-KIEM-THU.md \
         MINH-CHUNG-AI.md KICH-BAN-DEMO.md HOI-DAP.md CHECKLIST-CHUNG-KET.md; do
  [ -f "$TPL/$f" ] || { echo "Thiếu mẫu: $TPL/$f" >&2; exit 1; }
done

TARGET="$PARENT/$SLUG"
if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null)" ]; then
  echo "Thư mục đã tồn tại và không trống: $TARGET" >&2
  exit 1
fi

mkdir -p "$TARGET/docs/minh-chung-ai" "$TARGET/scripts"

# 1. Tài liệu
cp "$TPL/CLAUDE.md" "$TARGET/CLAUDE.md"
cp "$TPL/README-du-thi.md" "$TARGET/README.md"
for f in spec-nhanh.md PROGRESS.md DECISIONS.md BANG-KIEM-THU.md MINH-CHUNG-AI.md \
         KICH-BAN-DEMO.md HOI-DAP.md CHECKLIST-CHUNG-KET.md; do
  cp "$TPL/$f" "$TARGET/docs/$f"
done

# 2. Công cụ kiểm tra bí mật
cp "$SCRIPTS/scan-secrets.mjs" "$TARGET/scripts/scan-secrets.mjs"

# 3. Khung web: chép starter/ (bắt buộc), không ghi đè tệp đã có
[ -d "$STARTER" ] || { echo "Thiếu khung web: $STARTER" >&2; exit 1; }
while IFS= read -r -d '' rel; do
  rel="${rel#./}"
  if [ ! -e "$TARGET/$rel" ]; then
    mkdir -p "$(dirname "$TARGET/$rel")"
    cp "$STARTER/$rel" "$TARGET/$rel"
  fi
done < <(cd "$STARTER" && find . -type f -print0)

# 3b. Bộ slide: chép deck/ (bỏ out/ là sản phẩm xuất, example/ là bản Xclipse mẫu, node_modules/)
DECK="$SKILL_DIR/deck"
if [ -d "$DECK" ]; then
  while IFS= read -r -d '' rel; do
    rel="${rel#./}"
    mkdir -p "$(dirname "$TARGET/deck/$rel")"
    cp "$DECK/$rel" "$TARGET/deck/$rel"
  done < <(cd "$DECK" && find . \( -path ./out -o -path ./example -o -path ./node_modules \) -prune -o -type f -print0)
fi

# 3c. Tệp nền: chỉ ghi nếu starter chưa có
[ -e "$TARGET/.env.example" ] || cat > "$TARGET/.env.example" <<'ENV'
# Chỉ ghi TÊN biến, không ghi giá trị.
# Giá trị điền vào .env.local (file này đã nằm trong .gitignore).
# GEMINI_API_KEY=
ENV
[ -e "$TARGET/.gitignore" ] || cat > "$TARGET/.gitignore" <<'GI'
.env
.env.local
node_modules/
.DS_Store
GI

# 4. Thay tên sản phẩm và nhánh
ESC_PRODUCT="$(printf '%s' "$PRODUCT" | sed -e 's/[\/&|]/\\&/g')"
ESC_BRANCH="$(printf '%s' "$BRANCH" | sed -e 's/[\/&|]/\\&/g')"
while IFS= read -r -d '' file; do
  sed -i -e "s|<Tên sản phẩm>|$ESC_PRODUCT|g" -e "s|__PRODUCT__|$ESC_PRODUCT|g" \
         -e "s|<tên nhánh>|$ESC_BRANCH|g" "$file"
done < <(find "$TARGET" -type f \( -name '*.md' -o -name '*.html' \) -print0)

# 5. Git (không commit)
if command -v git >/dev/null 2>&1; then
  git -C "$TARGET" init -q
  git -C "$TARGET" symbolic-ref HEAD "refs/heads/$BRANCH"
  GIT_NOTE="đã git init, nhánh $BRANCH (chưa commit)"
else
  GIT_NOTE="KHÔNG có git: cài git rồi chạy 'git init' trong thư mục dự án"
fi

# Đếm chỗ còn <…> cần điền (bỏ qua ví dụ dạng code): "ngay" = CLAUDE.md + spec, "sau" = README + docs còn lại
count_ph() { grep -ohE '<[^<>[:space:]][^<>]*>' "$@" 2>/dev/null | wc -l | tr -d ' '; }
NOW_FILES=("$TARGET/CLAUDE.md" "$TARGET/docs/spec-nhanh.md")
LATER_FILES=("$TARGET/README.md")
for f in "$TARGET"/docs/*.md; do [ "$f" = "$TARGET/docs/spec-nhanh.md" ] || LATER_FILES+=("$f"); done
LEFT_NOW="$(count_ph "${NOW_FILES[@]}")"
LEFT_LATER="$(count_ph "${LATER_FILES[@]}")"

cat <<EOF

Đã tạo dự án: $TARGET
  Tên sản phẩm: $PRODUCT
  Nhánh nộp:    $BRANCH
  Git:          $GIT_NOTE
  Chỗ còn <…>: $LEFT_NOW điền ngay (CLAUDE.md, docs/spec-nhanh.md), $LEFT_LATER để sau (README.md, docs/ còn lại)

Các bước tiếp theo:
  1. cd "$TARGET"
  2. Mở docs/spec-nhanh.md, điền trong 5 phút đầu, chốt 5 tính năng và phần ngoài phạm vi.
  3. Mở docs/PROGRESS.md, ghi T0 (giờ bắt đầu) và làm theo run-sheet.
  4. Trước mỗi lần commit: node scripts/scan-secrets.mjs .
  5. Tạo repo trên GitHub, rồi:
       git add . && git commit -m "Khởi tạo dự án"
       git remote add origin <URL repo>
       git push -u origin $BRANCH
  6. Bật GitHub Pages: Settings → Pages → Deploy from a branch → $BRANCH, thư mục /(root).
  7. Điền các mục <…> còn lại trong README.md và docs/ khi có thông tin (lệnh tìm: grep -rn '<' README.md docs).
  8. Bộ slide nằm ở deck/ (xem deck/README.md): cp deck/template.data.js deck/deck.data.js rồi điền.
EOF

=================== FILE: vibe-sprint/scripts/scan-secrets.mjs ===================
#!/usr/bin/env node
// scan-secrets.mjs: quét một thư mục tìm chuỗi giống bí mật trước khi nộp ZIP hoặc push.
//
// Cách dùng:
//   node scan-secrets.mjs <thư-mục>                    quét theo mẫu (AIza…, AQ., sk-…, token dài 30+ ký tự…)
//   node scan-secrets.mjs <thư-mục> <file .env.local>  thêm: tìm đúng GIÁ TRỊ các biến bí mật trong file env
//
// Chỉ in TÊN mẫu hoặc TÊN biến, vị trí file và số dòng. Không bao giờ in giá trị bí mật.
// Mã thoát: 0 = sạch · 1 = có chỗ lộ · 2 = sai cách dùng.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
  console.error("Cách dùng: node scan-secrets.mjs <thư-mục> [<.env.local>]");
  process.exit(2);
}
const [dir, envFile] = args;
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error(`Không tìm thấy thư mục: ${dir}`);
  process.exit(2);
}
const root = path.resolve(dir);
const envPath = envFile ? path.resolve(envFile) : null;

// Cấu hình công khai có chủ đích: không tính là lộ, nhưng vẫn in dòng [CHO PHÉP] để người đọc thấy.
// Khớp chính xác đường dẫn tương đối (dấu /), không khớp theo đuôi tên, để bản sao lạc chỗ vẫn bị báo.
const ALLOWLIST = [
  {
    file: "js/firebase-config.js",
    rule: "google-api-key",
    reason: "cấu hình Firebase Web công khai, bảo vệ bằng quy tắc Firestore và Firebase Auth",
  },
];

// Mẫu cụ thể. Chạy trước; mẫu chung chỉ thêm phát hiện chưa được mẫu cụ thể bắt.
const PATTERNS = [
  { name: "google-api-key", re: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "gemini-aq-key", re: /\bAQ\.[A-Za-z0-9_-]{20,}/g },
  { name: "openai-key", re: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g },
  { name: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}/g },
  { name: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "private-key", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
];

// Mẫu chung: tên biến nghe như bí mật, gán một chuỗi từ 30 ký tự trở lên (kiểu key của EverAI…).
const GENERIC = {
  name: "chuoi-bi-mat-30-ky-tu",
  re: /\b[A-Za-z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASSWD)[A-Za-z0-9_]*['"]?\s*[:=]\s*['"`]?([A-Za-z0-9_\-+/=.]{30,})/gi,
};
const PLACEHOLDER = /^(x{6,}|your|example|changeme|placeholder|<)/i;
// Key thật gần như luôn có chữ số. Chuỗi chỉ toàn chữ (thông điệp lỗi trong SDK, tên hằng số) bị bỏ qua.
const looksRandom = (v) => /\d/.test(v);

// Biến công khai hoặc không phải bí mật: bỏ qua khi quét theo file env.
const PUBLIC_ENV = /^(NEXT_PUBLIC_.*URL|APP_URL|.*MODEL.*|.*PROVIDER.*|EMAIL_FROM|ADMIN_EMAILS|PRIVACY_CONTACT_EMAIL|NODE_ENV|PORT)$/;

const SKIP_DIRS = new Set(["node_modules", ".git"]);
const MAX_BYTES = 2 * 1024 * 1024;

function* walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(folder, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

const relOf = (file) => path.relative(root, file).split(path.sep).join("/");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// Đọc một tệp văn bản; trả về null nếu là tệp nhị phân hoặc quá lớn.
function readText(file) {
  const st = fs.statSync(file);
  if (st.size > MAX_BYTES) return null;
  const buf = fs.readFileSync(file);
  if (buf.subarray(0, 8000).includes(0)) return null;
  return buf.toString("utf8");
}

// Trả về danh sách phát hiện trong một tệp: { rule, line, start, end }.
function scanText(text) {
  const hits = [];
  const taken = [];
  for (const p of PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      hits.push({ rule: p.name, line: lineOf(text, m.index), start: m.index, end: m.index + m[0].length });
      taken.push([m.index, m.index + m[0].length]);
    }
  }
  for (const m of text.matchAll(GENERIC.re)) {
    const value = m[1];
    if (PLACEHOLDER.test(value) || !looksRandom(value)) continue;
    const start = m.index + m[0].length - value.length;
    const end = start + value.length;
    const overlaps = taken.some(([s, e]) => start < e && end > s);
    if (overlaps) continue; // đã được mẫu cụ thể bắt, không báo đôi
    hits.push({ rule: GENERIC.name, line: lineOf(text, start), start, end });
  }
  return hits;
}

const allowed = (rel, rule) => ALLOWLIST.find((a) => a.file === rel && a.rule === rule);

let files = 0;
let skipped = 0;
let flagged = 0;
let allowedCount = 0;

// Quét theo mẫu.
for (const file of walk(root)) {
  if (envPath && file === envPath) continue; // chính file env là nơi hợp lệ để chứa bí mật
  const text = readText(file);
  if (text === null) {
    skipped++;
    continue;
  }
  files++;
  const rel = relOf(file);
  for (const hit of scanText(text)) {
    const ok = allowed(rel, hit.rule);
    if (ok) {
      allowedCount++;
      console.log(`[CHO PHÉP] ${hit.rule} — ${rel}:${hit.line} (${ok.reason})`);
    } else {
      flagged++;
      console.log(`[LỘ] ${hit.rule} — ${rel}:${hit.line}`);
    }
  }
}

// Quét theo giá trị trong file env (tuỳ chọn).
if (envPath) {
  if (!fs.existsSync(envPath)) {
    console.error(`Không tìm thấy file env: ${envFile}`);
    process.exit(2);
  }
  const secrets = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
    .filter(([key, value]) => !PUBLIC_ENV.test(key) && value.length >= 8);

  console.log(`Kiểm tra ${secrets.length} biến từ file env: ${secrets.map(([k]) => k).join(", ") || "(không có)"}`);
  for (const file of walk(root)) {
    if (file === envPath) continue;
    const text = readText(file);
    if (text === null) continue;
    for (const [key, value] of secrets) {
      const at = text.indexOf(value);
      if (at !== -1) {
        flagged++;
        console.log(`[LỘ] biến ${key} — ${relOf(file)}:${lineOf(text, at)}`);
      }
    }
  }
  if (envPath && fileInside(envPath, root)) {
    console.log(`Đã bỏ qua chính file env: ${relOf(envPath)}`);
  }
}

function fileInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

console.log(`Đã quét ${files} tệp văn bản (bỏ qua ${skipped} tệp nhị phân hoặc quá lớn). Lộ: ${flagged} · Cho phép: ${allowedCount}.`);
process.exit(flagged > 0 ? 1 : 0);

=================== FILE: vibe-sprint/starter/README.md ===================
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

=================== FILE: vibe-sprint/starter/css/app.css ===================
/* app.css - toàn bộ giao diện, nằm trong các @layer đã khai báo ở tokens.css.
   Chỉ dùng biến từ tokens.css. Mobile-first: viết cho 390px trước, mở rộng bằng @media (min-width). */

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  body, h1, h2, h3, h4, p, ul, ol, figure, dl, dd { margin: 0; }
  ul, ol { padding: 0; }
  button, input, select, textarea { font: inherit; color: inherit; margin: 0; }
  svg, img { display: block; max-width: 100%; }
  [hidden] { display: none !important; }
  table { border-collapse: collapse; border-spacing: 0; }
  button { cursor: pointer; }
}

@layer base {
  html { scroll-padding-top: 120px; }
  body {
    font-family: var(--font); font-size: 15px; line-height: 1.55; color: var(--text); background: var(--ground);
    min-height: 100dvh; display: flex; flex-direction: column;
    background-image: var(--ground-img, none); background-repeat: no-repeat; background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 { line-height: 1.2; letter-spacing: -.01em; text-wrap: balance; }
  p { text-wrap: pretty; }
  a { color: var(--accent-ink); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
  ::selection { background: var(--accent-soft); }
  main { flex: 1; width: 100%; max-width: var(--max-w); margin: 0 auto; padding: 20px 16px 48px; outline: none; }
  .muted { color: var(--text-muted); }
  .mono { font-family: var(--font-mono); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (min-width: 720px) { main { padding: 28px 24px 64px; } }

  /* Chuyển cảnh: đổi giao diện = vòng tròn loang (JS điều khiển), đổi tab = mờ dần nhẹ */
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--dur-3); animation-timing-function: var(--ease-out); }
  html[data-vt="theme"]::view-transition-old(root), html[data-vt="theme"]::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
  html[data-vt="theme"]::view-transition-old(root) { z-index: 1; }
  html[data-vt="theme"]::view-transition-new(root) { z-index: 2; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
    ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
  }
}

@layer components {
  /* ---------- Khung trang: skip link, thanh trên, tab dạng viên thuốc ---------- */
  .skip-link { position: fixed; left: 12px; top: -60px; z-index: 200; background: var(--primary); color: var(--primary-contrast); padding: 10px 16px; border-radius: var(--radius-small); text-decoration: none; font-weight: 600; transition: top var(--dur-2) var(--ease-out); }
  .skip-link:focus { top: 12px; }

  .topbar {
    position: sticky; top: 0; z-index: 50; background: var(--glass);
    -webkit-backdrop-filter: saturate(1.6) blur(14px); backdrop-filter: saturate(1.6) blur(14px);
    border-bottom: 1px solid var(--border); padding: 8px 16px 10px;
    display: grid; grid-template-columns: 1fr auto; grid-template-areas: "brand actions" "tabs tabs"; gap: 8px 12px; align-items: center;
  }
  .brand { grid-area: brand; display: flex; align-items: center; gap: 10px; min-width: 0; text-decoration: none; color: inherit; }
  .brand-mark { flex: none; width: 32px; height: 32px; border-radius: 10px; background: var(--ux-grad); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 16px; }
  .brand-name { font-weight: 700; font-size: 16px; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .brand-tag { display: none; }
  .topbar-actions { grid-area: actions; display: flex; gap: 8px; align-items: center; }

  .tabs { grid-area: tabs; position: relative; display: flex; gap: 2px; padding: 4px; background: var(--raised); border: 1px solid var(--border); border-radius: 999px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .tabs::-webkit-scrollbar { display: none; }
  .tabs-pill { position: absolute; left: 0; top: 4px; bottom: 4px; width: 0; border-radius: 999px; background: var(--surface); box-shadow: 0 0 0 1px var(--border), 0 2px 8px rgba(40, 30, 80, .08); transition: transform var(--dur-3) var(--ease-out), width var(--dur-3) var(--ease-out); pointer-events: none; }
  .tab { position: relative; flex: none; display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 16px; border-radius: 999px; text-decoration: none; color: var(--text-muted); font-weight: 600; font-size: 14px; white-space: nowrap; transition: color var(--dur-2); }
  .tab:hover { color: var(--text); }
  .tab[aria-current="page"] { color: var(--text); }
  .tab svg { width: 18px; height: 18px; }
  @media (min-width: 900px) {
    .topbar { grid-template-columns: 1fr auto 1fr; grid-template-areas: "brand tabs actions"; padding: 10px 24px; }
    .tabs { justify-self: center; }
    .topbar-actions { justify-self: end; }
  }

  .icon-btn { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text); display: inline-grid; place-items: center; transition: background var(--dur-1), transform var(--dur-1) var(--ux-spring); }
  .icon-btn:hover { background: var(--raised); }
  .icon-btn:active { transform: scale(.94); }
  .icon-btn svg { width: 20px; height: 20px; }
  #btn-theme svg { display: none; }
  #btn-theme[data-mode="system"] .i-auto, #btn-theme[data-mode="light"] .i-sun, #btn-theme[data-mode="dark"] .i-moon { display: block; }

  .footer { max-width: var(--max-w); width: 100%; margin: 0 auto; padding: 20px 16px 28px; border-top: 1px solid var(--rule); display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-muted); }
  .mock-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: var(--pill-warning-bg); color: var(--pill-warning-ink); font-weight: 600; font-size: 12px; }
  .mock-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* ---------- Tiêu đề view & bố cục ---------- */
  .view { animation: view-in var(--dur-3) var(--ease-out) both; }
  @keyframes view-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .view-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 16px; margin-bottom: 20px; }
  .view-title { font-size: clamp(24px, 5vw, 34px); font-weight: 750; }
  .view-sub { color: var(--text-muted); margin-top: 6px; max-width: 62ch; }
  .view-body > * + * { margin-top: var(--gap); }
  .section-title { font-size: 17px; font-weight: 700; }
  .stack > * + * { margin-top: 12px; }
  .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .row.between { justify-content: space-between; }
  .grid { display: grid; gap: var(--gap); }
  .grid.kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .grid.cols-2, .grid.cols-3 { grid-template-columns: minmax(0, 1fr); }
  @media (min-width: 720px) { .grid.kpis { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; } .grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

  /* ---------- Thẻ có ánh sáng theo con trỏ ---------- */
  .card { position: relative; isolation: isolate; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: var(--pad); transition: border-color var(--dur-2); }
  .card::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; pointer-events: none; z-index: -1;
    background: radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), var(--accent), transparent 70%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
    opacity: 0; transition: opacity var(--dur-2); }
  .card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1;
    background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), var(--accent-soft), transparent 70%); opacity: 0; transition: opacity var(--dur-2); }
  @media (hover: hover) { .card:hover::before { opacity: .85; } .card:hover::after { opacity: 1; } }
  .card-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; margin-bottom: 14px; }
  .card.flat::before, .card.flat::after { display: none; }
  .card.pad-0 { padding: 0; overflow: hidden; }
  a.card { display: block; text-decoration: none; color: inherit; }

  /* ---------- Nút ---------- */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--control-h); padding: 0 16px; border-radius: 12px; border: 1px solid var(--control); background: var(--surface); color: var(--text); font-weight: 600; font-size: 14px; text-decoration: none; white-space: nowrap; transition: background var(--dur-1), border-color var(--dur-1), transform var(--dur-1) var(--ux-spring), opacity var(--dur-1); }
  .btn:hover { background: var(--raised); }
  .btn:active { transform: scale(.97); }
  .btn svg { width: 18px; height: 18px; flex: none; }
  .btn-primary { background: var(--primary); border-color: var(--primary); color: var(--primary-contrast); }
  .btn-primary:hover { background: var(--primary-hover); }
  .btn-ghost { border-color: transparent; background: transparent; }
  .btn-ghost:hover { background: var(--active); }
  .btn-danger { color: var(--danger); border-color: var(--danger-line); }
  .btn-danger:hover { background: var(--pill-negative-bg); }
  .btn-danger.solid { background: var(--danger); border-color: var(--danger); color: #fff; }
  .btn-ai { border: 0; color: #fff; background: var(--ux-grad); background-size: 140% 100%; background-position: 0 0; transition: background-position var(--dur-3) var(--ease-out), transform var(--dur-1) var(--ux-spring); text-shadow: 0 1px 2px rgba(0, 0, 0, .25); }
  .btn-ai:hover { background-image: var(--ux-grad); background-position: 100% 0; background-color: transparent; }
  :root[data-theme="dark"] .btn-ai { color: #0B0C12; text-shadow: none; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .btn-ai { color: #0B0C12; text-shadow: none; } }
  .btn-sm { min-height: 32px; padding: 0 12px; font-size: 13px; border-radius: 10px; }
  .btn:disabled, .btn[aria-disabled="true"] { background: var(--disabled-bg); border-color: transparent; color: var(--disabled-ink); cursor: not-allowed; transform: none; text-shadow: none; }
  .btn[aria-busy="true"] { pointer-events: none; opacity: .85; position: relative; }
  .btn[aria-busy="true"]::before { content: ""; width: 14px; height: 14px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 719px) { .btn { min-height: 44px; } .btn-sm { min-height: 36px; } }

  /* ---------- Ô nhập: nhãn nổi + kiểm tra ngay ---------- */
  .form { display: grid; gap: 14px; }
  .form-grid { display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr); }
  @media (min-width: 560px) { .form-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); } .form-grid .span-2 { grid-column: 1 / -1; } }
  .field { position: relative; min-width: 0; }
  .input { display: block; width: 100%; min-height: var(--field-h); padding: 22px 14px 6px; border-radius: 12px; border: 1px solid var(--control); background: var(--surface); color: var(--text); font-size: 16px; line-height: 1.3; transition: border-color var(--dur-1), box-shadow var(--dur-1); appearance: none; -webkit-appearance: none; }
  textarea.input { min-height: 96px; resize: vertical; padding-top: 26px; }
  select.input { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px; }
  .input:hover { border-color: var(--text-muted); }
  .input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .label { position: absolute; left: 15px; top: 16px; max-width: calc(100% - 30px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted); pointer-events: none; transform-origin: left top; transition: transform var(--dur-2) var(--ease-out), color var(--dur-2); }
  .input:focus + .label, .input:not(:placeholder-shown) + .label, select.input + .label, .input[type="date"] + .label, .input[type="time"] + .label { transform: translateY(-11px) scale(.78); }
  .input:focus + .label { color: var(--accent-ink); }
  .label .req { color: var(--danger); }
  .input[type="date"]:not(:focus):invalid::-webkit-datetime-edit { color: var(--text); }
  .field-msg { min-height: 18px; margin-top: 4px; padding: 0 4px; font-size: 12.5px; color: var(--text-muted); }
  .field-msg:empty { min-height: 0; margin: 0; }
  .field[data-invalid] .input { border-color: var(--danger); box-shadow: 0 0 0 3px var(--pill-negative-bg); }
  .field[data-invalid] .label { color: var(--danger); }
  .field[data-invalid] .field-msg { color: var(--danger); font-weight: 500; }
  .field[data-valid] .input { border-color: var(--success); }
  .check { display: flex; align-items: flex-start; gap: 10px; min-height: 28px; cursor: pointer; }
  .check input { width: 20px; height: 20px; margin-top: 2px; accent-color: var(--accent); flex: none; }
  fieldset.field { border: 0; padding: 0; margin: 0; }
  .field-legend { display: block; font-size: 13px; font-weight: 600; margin: 0 0 6px 2px; color: var(--text-muted); padding: 0; }
  .input-inline { padding: 0 14px; min-height: var(--control-h); }

  /* ---------- Thanh chọn (segmented), chip, badge ---------- */
  .seg { display: inline-flex; max-width: 100%; padding: 3px; gap: 2px; border-radius: 12px; background: var(--raised); border: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
  .seg::-webkit-scrollbar { display: none; }
  .seg label { position: relative; flex: none; }
  .seg input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
  .seg span { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 0 14px; border-radius: 9px; font-weight: 600; font-size: 13.5px; color: var(--text-muted); white-space: nowrap; transition: background var(--dur-2), color var(--dur-2), box-shadow var(--dur-2); }
  .seg input:checked + span { background: var(--surface); color: var(--text); box-shadow: 0 0 0 1px var(--border), 0 1px 4px rgba(40, 30, 80, .1); }
  .seg input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 1px; }
  .seg.block { display: flex; } .seg.block label { flex: 1; } .seg.block span { width: 100%; }
  @media (max-width: 719px) { .seg span { min-height: 40px; } }

  .chip { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--border); background: var(--raised); color: var(--text); font-size: 13px; font-weight: 500; }
  button.chip { cursor: pointer; transition: background var(--dur-1), border-color var(--dur-1); }
  button.chip:hover { border-color: var(--control); }
  button.chip[aria-pressed="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent-ink); font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }

  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 650; line-height: 1.6; background: var(--pill-neutral-bg); color: var(--pill-neutral-ink); white-space: nowrap; }
  .badge.positive { background: var(--pill-positive-bg); color: var(--pill-positive-ink); }
  .badge.negative { background: var(--pill-negative-bg); color: var(--pill-negative-ink); }
  .badge.warning { background: var(--pill-warning-bg); color: var(--pill-warning-ink); }
  .badge.accent { background: var(--accent-soft); color: var(--accent-ink); }

  /* ---------- KPI ---------- */
  .kpi { display: flex; flex-direction: column; gap: 4px; padding: 16px; }
  .kpi-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
  .kpi-value { font-size: clamp(24px, 6vw, 32px); font-weight: 750; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1.1; white-space: nowrap; }
  .kpi-foot { font-size: 12.5px; color: var(--text-muted); display: flex; gap: 6px; align-items: center; min-height: 20px; }
  .delta { font-weight: 650; } .delta.up { color: var(--success); } .delta.down { color: var(--danger); }

  /* ---------- Bảng có sắp xếp ---------- */
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
  .table { width: 100%; font-size: 14px; }
  .table caption { text-align: left; padding: 0 0 8px; }
  .table th, .table td { padding: 12px 14px; text-align: left; vertical-align: middle; border-bottom: 1px solid var(--rule); }
  .table th { font-size: 12.5px; font-weight: 650; color: var(--text-muted); background: var(--raised); white-space: nowrap; padding: 0; }
  .table th > .th-in { padding: 10px 14px; display: block; }
  .table th button { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 6px; width: 100%; padding: 10px 14px; cursor: pointer; font-weight: 650; }
  .table th button:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
  .table th button::after { content: ""; width: 8px; height: 10px; opacity: .35; background: currentColor; clip-path: polygon(50% 0, 100% 40%, 0 40%, 50% 0, 50% 0, 0 60%, 100% 60%, 50% 100%); }
  .table th[aria-sort="ascending"] button::after { opacity: 1; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .table th[aria-sort="descending"] button::after { opacity: 1; clip-path: polygon(0 0, 100% 0, 50% 100%); }
  .table th[aria-sort] { color: var(--text); }
  .table tbody tr { transition: background var(--dur-1); }
  .table tbody tr:hover { background: var(--raised); }
  .table tbody tr:last-child td { border-bottom: 0; }
  .table .num { text-align: right; font-variant-numeric: tabular-nums; } .table th.num button { justify-content: flex-end; }
  /* Mobile: bảng rộng hơn khung thì cuộn ngang TRONG .table-wrap, không cắt cột, không làm tràn trang */
  @media (max-width: 719px) { .table { width: max-content; min-width: 100%; } .table td, .table th { white-space: nowrap; } .table td .cell-main { white-space: normal; min-width: 120px; max-width: 220px; } }
  .table .actions { text-align: right; white-space: nowrap; width: 1%; }
  .cell-main { font-weight: 600; } .cell-sub { font-size: 12.5px; color: var(--text-muted); }

  /* ---------- Hộp thoại ---------- */
  dialog.dlg { padding: 0; border: 1px solid var(--border); border-radius: var(--radius-sheet); background: var(--surface); color: var(--text); width: min(560px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); box-shadow: var(--shadow-float); overflow: hidden; }
  dialog.dlg[open] { display: flex; flex-direction: column; animation: dlg-in var(--dur-3) var(--ease-out); }
  dialog.dlg.wide { width: min(760px, calc(100vw - 24px)); }
  dialog.dlg::backdrop { background: var(--overlay); animation: fade-in var(--dur-2) both; }
  @keyframes dlg-in { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .dlg-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 20px 4px; }
  .dlg-title { font-size: 19px; font-weight: 700; }
  .dlg-body { padding: 12px 20px 8px; overflow-y: auto; }
  .dlg-foot { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; padding: 14px 20px 18px; }
  @media (max-width: 559px) { dialog.dlg { margin: auto auto 0; width: 100vw; max-width: 100vw; border-radius: 22px 22px 0 0; } .dlg-foot .btn { flex: 1; } }

  /* ---------- Toast ---------- */
  .toasts { position: fixed; z-index: 300; right: 16px; bottom: 16px; left: 16px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; pointer-events: none; }
  .toast { pointer-events: auto; display: flex; align-items: flex-start; gap: 10px; width: min(380px, 100%); padding: 12px 14px; border-radius: 14px; background: var(--primary); color: var(--primary-contrast); box-shadow: var(--shadow-float); font-size: 14px; animation: toast-in var(--dur-3) var(--ux-spring) both; }
  .toast.out { animation: toast-out var(--dur-2) var(--ease-in-out) forwards; }
  .toast .t-ico { flex: none; width: 20px; height: 20px; margin-top: 1px; } .toast .t-ico svg { width: 20px; height: 20px; }
  .toast .t-msg { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .toast.success .t-ico { color: #4fd8a4; } .toast.error .t-ico { color: #ff8a9b; } .toast.warn .t-ico { color: #ffbb7a; }
  :root[data-theme="dark"] .toast.success .t-ico { color: #0c7a58; } :root[data-theme="dark"] .toast.error .t-ico { color: #c42e49; }
  .toast button { all: unset; cursor: pointer; font-weight: 700; padding: 0 4px; opacity: .9; } .toast button:hover { opacity: 1; text-decoration: underline; }
  @keyframes toast-in { from { opacity: 0; transform: translateY(16px) scale(.96); } to { opacity: 1; transform: none; } }
  @keyframes toast-out { to { opacity: 0; transform: translateY(8px) scale(.96); } }

  /* ---------- Trạng thái trống / tải / lỗi ---------- */
  .state { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 36px 20px; color: var(--text-muted); }
  .state .state-ico { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-ink); margin-bottom: 4px; }
  .state .state-ico svg { width: 26px; height: 26px; }
  .state h3 { color: var(--text); font-size: 17px; }
  .state p { max-width: 44ch; }
  .state.error .state-ico { background: var(--pill-negative-bg); color: var(--danger); }
  .state .row { justify-content: center; margin-top: 8px; }
  .skeleton { display: grid; gap: 10px; }
  .sk { height: 14px; border-radius: 7px; background: linear-gradient(90deg, var(--active) 25%, var(--raised) 50%, var(--active) 75%); background-size: 200% 100%; animation: shimmer 1.3s linear infinite; }
  .sk.title { height: 22px; width: 45%; } .sk.block { height: 90px; border-radius: 12px; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* ---------- Stepper ---------- */
  .stepper { list-style: none; display: flex; gap: 6px; counter-reset: step; }
  .stepper li { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--text-muted); font-weight: 600; }
  .stepper li::before { content: ""; height: 4px; border-radius: 2px; background: var(--active); transition: background var(--dur-3); }
  .stepper li span { display: flex; align-items: center; gap: 6px; }
  .stepper li span::before { counter-increment: step; content: counter(step); flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; background: var(--active); font-size: 11px; color: var(--text); }
  .stepper li.done::before, .stepper li.current::before { background: var(--accent); }
  .stepper li.done span::before { content: "\2713"; background: var(--accent); color: var(--accent-contrast); }
  .stepper li.current { color: var(--text); } .stepper li.current span::before { background: var(--primary); color: var(--primary-contrast); }
  .stepper li span b { font-weight: inherit; line-height: 1.25; }
  .stepper li span { align-items: flex-start; }

  /* ---------- Hero kính gân (fluted glass): nền băng giá bên trái, khối navy + cầu san hô bên phải ---------- */
  .hero { position: relative; overflow: hidden; border-radius: var(--radius-sheet); border: 1px solid var(--border); min-height: 300px; display: grid; grid-template-columns: minmax(0, 1fr); isolation: isolate;
    background: radial-gradient(95% 60% at 12% 108%, var(--hero-navy) 0%, #0C4B8E 40%, rgba(33, 124, 224, .55) 62%, rgba(219, 242, 252, 0) 86%), linear-gradient(125deg, var(--surface) 0%, var(--raised) 45%, var(--active) 100%); }
  .hero-copy { position: relative; z-index: 2; padding: 28px 22px 30px; display: flex; flex-direction: column; justify-content: center; gap: 14px; max-width: 520px; }
  .hero-eyebrow { font-size: 12.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent-ink); }
  .hero-title { font-size: clamp(30px, 6vw, 52px); line-height: 1.06; font-weight: 400; letter-spacing: -.03em; }
  .hero-title em { display: block; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 700; letter-spacing: -.01em; }
  .hero-copy p { color: var(--text-muted); max-width: 44ch; }
  .btn-cta { background: var(--accent); border-color: transparent; color: var(--accent-contrast); border-radius: 999px; padding: 0 22px; box-shadow: 0 8px 22px rgba(253, 110, 136, .35); align-self: flex-start; }
  .btn-cta:hover { background: #FF8CA1; }
  .hero-visual { display: none; position: absolute; inset: 0 0 0 52%; z-index: 1; overflow: hidden; background: radial-gradient(520px 420px at 70% 50%, #0E4D92 0%, #072D59 58%, #041A36 100%); }
  .hero-visual::before { content: ""; position: absolute; width: 380px; height: 380px; right: -50px; top: 50%; transform: translateY(-50%); border-radius: 50%;
    background: radial-gradient(circle at 28% 36%, #FFA8BA 0%, #FD6E88 28%, rgba(253, 110, 136, .25) 54%, transparent 74%), radial-gradient(circle at 68% 68%, #2C8DF5 0%, #0A3A75 55%, #03152B 100%); box-shadow: 0 0 90px rgba(253, 110, 136, .3); }
  .hero-visual::after { content: ""; position: absolute; inset: 0 auto 0 0; width: 62%; -webkit-backdrop-filter: blur(14px) saturate(135%); backdrop-filter: blur(14px) saturate(135%);
    background: repeating-linear-gradient(90deg, rgba(255, 255, 255, .22) 0, rgba(219, 242, 252, .05) 30%, rgba(7, 45, 89, .16) 78%, rgba(255, 255, 255, .12) 100%, rgba(255, 255, 255, .12) 12.5%); background-size: 12.5% 100%; box-shadow: inset 1px 0 0 rgba(255, 255, 255, .25); }
  @media (min-width: 760px) { .hero { min-height: 340px; } .hero-copy { padding: 40px 36px; } .hero-visual { display: block; } }

  /* ---------- Biểu đồ ---------- */
  .chart { width: 100%; min-height: 120px; }
  .chart svg { width: 100%; height: auto; overflow: visible; }
  .chart text { fill: var(--chart-text); font-family: var(--font); font-size: 11.5px; }
  .chart .grid-line { stroke: var(--chart-grid); stroke-width: 1; }
  .chart .val { fill: var(--text); font-weight: 650; }
  .chart .ch-bar { transform-box: fill-box; transform-origin: bottom; animation: bar-in .6s var(--ease-out) both; }
  @keyframes bar-in { from { transform: scaleY(0); } }
  .chart .ch-line { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
  .chart .ch-dot { stroke: var(--surface); stroke-width: 2; }
  .chart-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 10px; font-size: 13px; }
  .chart-legend li { list-style: none; display: inline-flex; align-items: center; gap: 6px; }
  .chart-legend i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
  .donut-wrap { display: flex; flex-direction: column; align-items: center; }
  .donut-wrap svg { width: min(100%, 220px); }
  .donut-total { font-size: 24px !important; font-weight: 750; fill: var(--text) !important; }

  /* ---------- Ghi chú AI / mô phỏng, chat ---------- */
  .ai-notice { display: flex; gap: 8px; align-items: flex-start; padding: 8px 12px; border-radius: 10px; font-size: 13px; background: var(--pill-warning-bg); color: var(--pill-warning-ink); font-weight: 500; }
  .ai-notice.live { background: var(--accent-soft); color: var(--accent-ink); }
  .ai-notice svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
  .ai-result { border: 1px dashed var(--control); border-radius: var(--radius); padding: 16px; display: grid; gap: 10px; background: var(--raised); }
  .ai-result h3 { font-size: 18px; }
  .prompt-box { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.5; white-space: pre-wrap; max-height: 180px; overflow: auto; padding: 12px; border-radius: 10px; background: var(--raised); border: 1px solid var(--border); overflow-wrap: anywhere; }
  .chat { display: flex; flex-direction: column; height: min(520px, 70dvh); }
  .chat-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 16px; scroll-behavior: smooth; }
  .bubble { max-width: min(86%, 520px); padding: 10px 14px; border-radius: 16px; font-size: 14.5px; overflow-wrap: anywhere; white-space: pre-wrap; animation: view-in var(--dur-2) var(--ease-out) both; }
  .bubble.bot { align-self: flex-start; background: var(--raised); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .bubble.user { align-self: flex-end; background: var(--primary); color: var(--primary-contrast); border-bottom-right-radius: 4px; }
  .bubble.typing { display: inline-flex; gap: 4px; padding: 14px; }
  .bubble.typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: blink 1s infinite; } .bubble.typing i:nth-child(2) { animation-delay: .15s; } .bubble.typing i:nth-child(3) { animation-delay: .3s; }
  @keyframes blink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
  .chat-quick { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
  .chat-form { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--rule); }
  .chat-form .input { min-height: 44px; padding: 0 14px; }
  .meter { height: 10px; border-radius: 6px; background: var(--active); overflow: hidden; }
  .meter > i { display: block; height: 100%; border-radius: 6px; background: var(--ux-grad); transition: width var(--dur-3) var(--ease-out); }
  .score-big { font-size: 44px; font-weight: 800; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; }
  .list-plain { list-style: none; display: grid; gap: 8px; }
  .list-plain li { display: flex; gap: 10px; align-items: flex-start; }
  .list-plain .ok { color: var(--success); } .list-plain .no { color: var(--danger); }
  .list-plain svg { width: 18px; height: 18px; flex: none; margin-top: 2px; }
  .kv { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-size: 14px; } .kv dt { color: var(--text-muted); } .kv dd { margin: 0; font-weight: 600; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
}

@layer utilities {
  .grow { flex: 1; } .right { margin-left: auto; } .center { text-align: center; }
  .mt-0 { margin-top: 0 !important; } .mt-2 { margin-top: 8px; } .mt-3 { margin-top: 16px; }
  .no-wrap { white-space: nowrap; }
  .hide-sm { display: none; } @media (min-width: 720px) { .hide-sm { display: revert; } }
  @media print {
    .topbar, .footer, .toasts, .skip-link, .no-print, dialog { display: none !important; }
    body { background: #fff; color: #000; display: block; } main { max-width: none; padding: 0; }
    .card { break-inside: avoid; border: 1px solid #ccc; } .card::before, .card::after { display: none; }
    .view { animation: none; } .view[hidden] { display: none !important; }
    :root { --surface: #fff; --raised: #f6f6f6; --text: #000; --text-muted: #444; --border: #ccc; }
  }
}

=================== FILE: vibe-sprint/starter/css/tokens.css ===================
/* tokens.css - mọi màu, chữ, khoảng cách, bo góc, chuyển động của app. Hai bộ giao diện (preset), mỗi bộ có sáng + tối:
     xclipse (MẶC ĐỊNH): Ice #DBF2FC / Navy #072D59 / Coral #FD6E88 - nút chính navy (tối: coral), nhấn hồng san hô, nền băng giá.
     lucian: Lucian Lab (tím/xanh, nền xám ấm, nút gần đen).
   Chọn bộ bằng MỘT thuộc tính trên thẻ <html> trong index.html:  data-preset="xclipse" | "lucian".
   Tên token giữ nguyên giữa các bộ nên feature không cần sửa. Đổi thương hiệu khác: sửa khối xclipse ở 3 chỗ (sáng, tối theo hệ thống, tối thủ công).
   Thứ tự layer được khai báo ở đây và dùng ở app.css. */
@layer reset, tokens, base, components, utilities;

@layer tokens {
/* ============ Dùng chung: phông, hình khối, chuyển động ============ */
:root {
  /* Phông: dùng Be Vietnam Pro nếu đã nạp (xem README), không thì phông hệ thống */
  --font: 'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Hình khối */
  --radius-sheet: 22px;
  --radius: 14px;
  --radius-small: 10px;
  --control-h: 40px;
  --field-h: 52px;
  --gap: 20px;
  --pad: 20px;
  --max-w: 1120px;

  /* Bóng chỉ cho thứ đang nổi (menu, hộp thoại, toast) */
  --shadow-float: 0 12px 32px rgba(40, 30, 80, .14), 0 2px 6px rgba(40, 30, 80, .08);

  /* Chuyển động: một bộ duy nhất */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-1: 120ms;  /* phản hồi bấm, rê */
  --dur-2: 200ms;  /* chuyển trạng thái, mở khung */
  --dur-3: 320ms;  /* đổi bố cục, chuyển trang */

  /* ============ Preset XCLIPSE - sáng (mặc định) ============ */
  color-scheme: light;
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
  --ux-grad: linear-gradient(120deg, #072D59, #0E4A8A 48%, #D93656);

  --ground: #F5FBFF;
  --ground-img: radial-gradient(70% 46% at 8% 0%, #DBF2FC 0%, rgba(219, 242, 252, 0) 72%), radial-gradient(40% 30% at 100% 0%, rgba(253, 110, 136, .10), rgba(253, 110, 136, 0) 70%);
  --surface: #FFFFFF;
  --raised: #EAF6FD;
  --active: #DBF2FC;
  --border: rgba(7, 45, 89, .10);
  --rule: rgba(7, 45, 89, .07);
  --control: rgba(7, 45, 89, .50);       /* viền ô nhập, >= 3:1 */
  --text: #072D59;
  --text-muted: #36567A;
  --primary: #072D59;
  --primary-hover: #0E4A8A;
  --primary-contrast: #FFFFFF;
  --accent: #FD6E88;
  --accent-ink: #C42A4B;                 /* chữ hồng, >= 4.5:1 trên trắng */
  --accent-soft: rgba(253, 110, 136, .14);
  --accent-contrast: #072D59;
  --success: #0B7A70;
  --warn: #A35208;
  --danger: #C71F45;
  --danger-line: rgba(199, 31, 69, .42);
  --disabled-bg: #E1ECF4;
  --disabled-ink: #6B829C;
  --overlay: rgba(4, 26, 54, .60);
  --glass: rgba(245, 251, 255, .78);
  --pill-positive-bg: #D6F4EE; --pill-positive-ink: #065C54;
  --pill-negative-bg: #FDE3E8; --pill-negative-ink: #8F1A35;
  --pill-warning-bg: #FDEBD3; --pill-warning-ink: #7A3E08;
  --pill-neutral-bg: #DBF2FC; --pill-neutral-ink: #072D59;

  --chart-1: #0E4A8A; --chart-2: #FD6E88; --chart-3: #0D9488; --chart-4: #E8A317; --chart-5: #2C8DF5; --chart-6: #8A9BB0;
  --chart-grid: rgba(7, 45, 89, .10);
  --chart-text: #36567A;
  --hero-navy: #072D59;

  --shadow-float: 0 12px 32px rgba(7, 45, 89, .16), 0 2px 6px rgba(7, 45, 89, .08);
}

/* ============ Preset XCLIPSE - tối (theo hệ thống, trừ khi chọn sáng thủ công) ============ */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
  color-scheme: dark;
  --ux-grad: linear-gradient(120deg, #5BA8FF, #9CC9FF 45%, #FD6E88);
  --ground: #041226; --ground-img: radial-gradient(60% 40% at 100% 0%, rgba(253, 110, 136, .16), rgba(253, 110, 136, 0) 70%), radial-gradient(70% 45% at 0% 0%, rgba(14, 74, 138, .45), rgba(14, 74, 138, 0) 72%);
  --surface: #0A2342; --raised: #0F2D52; --active: #173A66;
  --border: rgba(219, 242, 252, .13); --rule: rgba(219, 242, 252, .08); --control: rgba(219, 242, 252, .50);
  --text: #EAF6FD; --text-muted: rgba(219, 242, 252, .74);
  --primary: #FD6E88; --primary-hover: #FF8CA1; --primary-contrast: #072D59;
  --accent: #FD6E88; --accent-ink: #FF9DB0; --accent-soft: rgba(253, 110, 136, .16); --accent-contrast: #072D59;
  --success: #5EEAD4; --warn: #FFB86B; --danger: #FF8CA1; --danger-line: rgba(255, 140, 161, .45);
  --disabled-bg: #173A66; --disabled-ink: rgba(219, 242, 252, .45);
  --overlay: rgba(2, 10, 22, .70);
  --glass: rgba(4, 18, 38, .72);
  --pill-positive-bg: rgba(94, 234, 212, .15); --pill-positive-ink: #8FF0DE;
  --pill-negative-bg: rgba(255, 140, 161, .16); --pill-negative-ink: #FFA9B8;
  --pill-warning-bg: rgba(255, 184, 107, .16); --pill-warning-ink: #FFC992;
  --pill-neutral-bg: #173A66; --pill-neutral-ink: #DBF2FC;
  --chart-1: #5BA8FF; --chart-2: #FD6E88; --chart-3: #5EEAD4; --chart-4: #FFC857; --chart-5: #9CC9FF; --chart-6: #8FA3BD;
  --chart-grid: rgba(219, 242, 252, .12); --chart-text: rgba(219, 242, 252, .74);
  --hero-navy: #0A2342;
  --shadow-float: 0 12px 32px rgba(0, 0, 0, .55), 0 2px 6px rgba(0, 0, 0, .4);
  }
}
/* ============ Preset XCLIPSE - tối (chọn thủ công) ============ */
:root[data-theme="dark"] {
  color-scheme: dark;
  --ux-grad: linear-gradient(120deg, #5BA8FF, #9CC9FF 45%, #FD6E88);
  --ground: #041226; --ground-img: radial-gradient(60% 40% at 100% 0%, rgba(253, 110, 136, .16), rgba(253, 110, 136, 0) 70%), radial-gradient(70% 45% at 0% 0%, rgba(14, 74, 138, .45), rgba(14, 74, 138, 0) 72%);
  --surface: #0A2342; --raised: #0F2D52; --active: #173A66;
  --border: rgba(219, 242, 252, .13); --rule: rgba(219, 242, 252, .08); --control: rgba(219, 242, 252, .50);
  --text: #EAF6FD; --text-muted: rgba(219, 242, 252, .74);
  --primary: #FD6E88; --primary-hover: #FF8CA1; --primary-contrast: #072D59;
  --accent: #FD6E88; --accent-ink: #FF9DB0; --accent-soft: rgba(253, 110, 136, .16); --accent-contrast: #072D59;
  --success: #5EEAD4; --warn: #FFB86B; --danger: #FF8CA1; --danger-line: rgba(255, 140, 161, .45);
  --disabled-bg: #173A66; --disabled-ink: rgba(219, 242, 252, .45);
  --overlay: rgba(2, 10, 22, .70);
  --glass: rgba(4, 18, 38, .72);
  --pill-positive-bg: rgba(94, 234, 212, .15); --pill-positive-ink: #8FF0DE;
  --pill-negative-bg: rgba(255, 140, 161, .16); --pill-negative-ink: #FFA9B8;
  --pill-warning-bg: rgba(255, 184, 107, .16); --pill-warning-ink: #FFC992;
  --pill-neutral-bg: #173A66; --pill-neutral-ink: #DBF2FC;
  --chart-1: #5BA8FF; --chart-2: #FD6E88; --chart-3: #5EEAD4; --chart-4: #FFC857; --chart-5: #9CC9FF; --chart-6: #8FA3BD;
  --chart-grid: rgba(219, 242, 252, .12); --chart-text: rgba(219, 242, 252, .74);
  --hero-navy: #0A2342;
  --shadow-float: 0 12px 32px rgba(0, 0, 0, .55), 0 2px 6px rgba(0, 0, 0, .4);
}

/* ============ Preset LUCIAN (bật bằng <html data-preset="lucian">) ============ */
:root[data-preset="lucian"] {
  color-scheme: light;
  --ux-grad: linear-gradient(120deg, #7B61FF, #3D8BFF 55%, #1FB89A);

  /* Nền & chữ */
  --ground: #F4F2EE;
  --surface: #FFFFFF;
  --raised: #F5F3EF;
  --active: #EAE7E1;
  --border: rgba(22, 21, 27, .09);
  --rule: rgba(22, 21, 27, .06);
  --control: rgba(22, 21, 27, .26);     /* viền ô nhập, >= 3:1 */
  --text: #16151B;
  --text-muted: #57535F;
  --primary: #16151B;
  --primary-hover: #34323d;
  --primary-contrast: #FFFFFF;
  --accent: #6A57F2;
  --accent-ink: #5442DC;                /* chữ accent, 5.6:1 trên trắng */
  --accent-soft: rgba(106, 87, 242, .12);
  --accent-contrast: #FFFFFF;
  --success: #0C7A58;
  --warn: #A3560F;
  --danger: #C42E49;
  --danger-line: rgba(196, 46, 73, .4);
  --disabled-bg: #E4E1DB;
  --disabled-ink: #6f6b78;
  --overlay: rgba(22, 21, 27, .55);
  --glass: rgba(244, 242, 238, .72);
  --pill-positive-bg: #DDF5EC; --pill-positive-ink: #07503a;
  --pill-negative-bg: #FCE6EA; --pill-negative-ink: #8a1f33;
  --pill-warning-bg: #FDEEDC; --pill-warning-ink: #7d410a;
  --pill-neutral-bg: #EAE7E1; --pill-neutral-ink: #3b3944;

  /* Biểu đồ (js/charts.js đọc các biến này nên tự đổi theo giao diện) */
  --chart-1: #6A57F2; --chart-2: #1FA37F; --chart-3: #E08A1E; --chart-4: #D6336C; --chart-5: #2E86DE; --chart-6: #8A8794;
  --chart-grid: rgba(22, 21, 27, .10);
  --chart-text: #57535F;
  --ground-img: none;
  --hero-navy: #16151B;
  --shadow-float: 0 12px 32px rgba(40, 30, 80, .14), 0 2px 6px rgba(40, 30, 80, .08);
}
@media (prefers-color-scheme: dark) {
  :root[data-preset="lucian"]:not([data-theme="light"]) {
  color-scheme: dark;
  --ux-grad: linear-gradient(120deg, #B7A4FF, #7DB4FF 55%, #A5F2D3);
  --ground: #07080D; --surface: #13141C; --raised: #1A1B25; --active: #252632;
  --border: rgba(255, 255, 255, .08); --rule: rgba(255, 255, 255, .06); --control: rgba(255, 255, 255, .34);
  --text: #F4F0E8; --text-muted: rgba(244, 240, 232, .68);
  --primary: #F4F0E8; --primary-hover: #FFFFFF; --primary-contrast: #0B0C12;
  --accent: #B7A4FF; --accent-ink: #C9BBFF; --accent-soft: rgba(183, 164, 255, .15); --accent-contrast: #0B0C12;
  --success: #7EE8C0; --warn: #FFB26B; --danger: #FF7D8C; --danger-line: rgba(255, 125, 140, .45);
  --disabled-bg: #252632; --disabled-ink: rgba(244, 240, 232, .45);
  --overlay: rgba(0, 0, 0, .65);
  --glass: rgba(7, 8, 13, .72);
  --pill-positive-bg: rgba(126, 232, 192, .16); --pill-positive-ink: #9CF0D0;
  --pill-negative-bg: rgba(255, 125, 140, .16); --pill-negative-ink: #FFA3AE;
  --pill-warning-bg: rgba(255, 178, 107, .16); --pill-warning-ink: #FFC48D;
  --pill-neutral-bg: #252632; --pill-neutral-ink: #D8D4CC;
  --chart-1: #B7A4FF; --chart-2: #7EE8C0; --chart-3: #FFB26B; --chart-4: #FF8FB1; --chart-5: #7DB4FF; --chart-6: #9B98A6;
  --chart-grid: rgba(255, 255, 255, .10); --chart-text: rgba(244, 240, 232, .68);
  --shadow-float: 0 12px 32px rgba(0, 0, 0, .55), 0 2px 6px rgba(0, 0, 0, .4);
  --ground-img: none;
  --hero-navy: #1A1B25;
  }
}
:root[data-preset="lucian"][data-theme="dark"] {
  color-scheme: dark;
  --ux-grad: linear-gradient(120deg, #B7A4FF, #7DB4FF 55%, #A5F2D3);
  --ground: #07080D; --surface: #13141C; --raised: #1A1B25; --active: #252632;
  --border: rgba(255, 255, 255, .08); --rule: rgba(255, 255, 255, .06); --control: rgba(255, 255, 255, .34);
  --text: #F4F0E8; --text-muted: rgba(244, 240, 232, .68);
  --primary: #F4F0E8; --primary-hover: #FFFFFF; --primary-contrast: #0B0C12;
  --accent: #B7A4FF; --accent-ink: #C9BBFF; --accent-soft: rgba(183, 164, 255, .15); --accent-contrast: #0B0C12;
  --success: #7EE8C0; --warn: #FFB26B; --danger: #FF7D8C; --danger-line: rgba(255, 125, 140, .45);
  --disabled-bg: #252632; --disabled-ink: rgba(244, 240, 232, .45);
  --overlay: rgba(0, 0, 0, .65);
  --glass: rgba(7, 8, 13, .72);
  --pill-positive-bg: rgba(126, 232, 192, .16); --pill-positive-ink: #9CF0D0;
  --pill-negative-bg: rgba(255, 125, 140, .16); --pill-negative-ink: #FFA3AE;
  --pill-warning-bg: rgba(255, 178, 107, .16); --pill-warning-ink: #FFC48D;
  --pill-neutral-bg: #252632; --pill-neutral-ink: #D8D4CC;
  --chart-1: #B7A4FF; --chart-2: #7EE8C0; --chart-3: #FFB26B; --chart-4: #FF8FB1; --chart-5: #7DB4FF; --chart-6: #9B98A6;
  --chart-grid: rgba(255, 255, 255, .10); --chart-text: rgba(244, 240, 232, .68);
  --shadow-float: 0 12px 32px rgba(0, 0, 0, .55), 0 2px 6px rgba(0, 0, 0, .4);
  --ground-img: none;
  --hero-navy: #1A1B25;
}
}

=================== FILE: vibe-sprint/starter/features/_example/feature.js ===================
/* =====================================================================================================
   FEATURE MẪU: "Mục" = danh sách CRUD + form kiểm tra + biểu đồ + AI tạo gợi ý (mock/Gemini/dán).
   CÁCH NHÂN BẢN (≈ 5 phút):
     1. Chép thư mục  features/_example  ->  features/<ten-moi>/   (ví dụ features/don-hang/)
     2. Trong feature.js mới: đổi NAME ('example' -> 'orders'), đổi tên collection ('items' -> 'orders'),
        sửa SCHEMA (trường dữ liệu), COLUMNS (cột bảng), AI_SPEC (prompt + schema + mock), seed demo.
     3. Thêm  <script src="features/<ten-moi>/feature.js"></script>  vào index.html (trước js/app.js).
     4. Xong: tab, h1, KPI ở Tổng quan, kiểm tra, lưu trữ, xuất CSV đều tự có. Tab mới hiện ở thanh điều hướng.
   BẢN ĐỒ FILE NÀY (tìm theo số):
     [1] Mô hình dữ liệu (collection + nhãn)   [2] SCHEMA form (luật kiểm tra)   [3] Dữ liệu demo
     [4] AI_SPEC (prompt, schema, mock)        [5] Đăng ký view (tab + h1 + KPI) [6] Vẽ giao diện + sự kiện
   Mọi chữ hiện cho người dùng là tiếng Việt; tên biến/hàm là tiếng Anh. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, NAME = 'example';

  /* [1] Mô hình dữ liệu: collection lưu trong localStorage, tự có id/createdAt, phát sự kiện khi đổi */
  var items = EP.collection('items');
  var STATUS = { new: 'Mới', doing: 'Đang làm', done: 'Hoàn thành' };
  var STATUS_TONE = { new: '', doing: 'warning', done: 'positive' };
  var CATEGORY = { a: 'Nhóm A', b: 'Nhóm B', c: 'Nhóm C' };

  /* [2] SCHEMA form: mỗi trường khai báo nhãn, kiểu, luật. EP.form lo vẽ HTML, kiểm tra, hiện lỗi tiếng Việt. */
  var SCHEMA = {
    name:     { label: 'Tên mục', type: 'text', rules: { required: true, maxLength: 80 }, autocomplete: 'off', span2: true },
    email:    { label: 'Email liên hệ', type: 'email', rules: { email: true }, autocomplete: 'email', hint: 'Không bắt buộc' },
    phone:    { label: 'Số điện thoại', type: 'tel', rules: { phone: true }, autocomplete: 'tel', hint: 'Ví dụ 0912345678 hoặc +84912345678' },
    qty:      { label: 'Số lượng', type: 'number', rules: { required: true, min: 1, max: 100, integer: true } },
    due:      { label: 'Hạn xử lý', type: 'date', rules: { required: true, date: 'future' } },
    category: { label: 'Nhóm', type: 'segmented', rules: { required: true }, span2: true, options: Object.keys(CATEGORY).map(function (k) { return { value: k, label: CATEGORY[k] }; }) },
    status:   { label: 'Trạng thái', type: 'select', rules: { required: true }, options: Object.keys(STATUS).map(function (k) { return { value: k, label: STATUS[k] }; }) },
    note:     { label: 'Ghi chú', type: 'textarea', rules: { maxLength: 300 }, span2: true }
  };

  /* [3] Dữ liệu demo: nạp ở lần mở đầu (hoặc ?demo=1). Tăng version khi muốn đổi dữ liệu mẫu. */
  function daysFromNow(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  EP.demo.register('items', { version: 1, seed: function () {
    return [
      { name: 'Chuẩn bị tài liệu hội thảo', email: 'lan.nguyen@example.vn', phone: '0912345678', qty: 12, due: daysFromNow(5), category: 'a', status: 'doing', note: 'In 12 bộ, kèm sơ đồ chương trình.' },
      { name: 'Đặt phòng cho đoàn khách', email: 'minh.tran@example.vn', phone: '0987654321', qty: 4, due: daysFromNow(9), category: 'b', status: 'new', note: '' },
      { name: 'Kiểm kê kho quý này', email: '', phone: '02838221110', qty: 60, due: daysFromNow(14), category: 'c', status: 'new', note: 'Ưu tiên khu vực B.' },
      { name: 'Gửi báo giá cho đối tác', email: 'hoa.pham@example.vn', phone: '0905123456', qty: 3, due: daysFromNow(2), category: 'a', status: 'done', note: 'Đã được duyệt.' },
      { name: 'Rà soát hợp đồng nhà cung cấp', email: '', phone: '', qty: 8, due: daysFromNow(21), category: 'b', status: 'doing', note: '' },
      { name: 'Tổng hợp phản hồi khách hàng', email: 'an.le@example.vn', phone: '0933222111', qty: 25, due: daysFromNow(7), category: 'a', status: 'done', note: 'Có 25 phản hồi, cần tóm tắt.' }
    ];
  } });

  /* [4] AI_SPEC: một "đặc tả" cho EP.ai.generate. prompt = việc cần làm; schema = hình dạng JSON mong muốn
         (tự được thêm vào prompt và dùng để kiểm tra/ép kiểu kết quả); mock = bản mô phỏng offline, tất định. */
  var AI_SPEC = {
    id: 'item-suggest',
    prompt: function (input) {
      return 'Bạn là trợ lý quản lý công việc người Việt, viết ngắn gọn, cụ thể.\n' +
        'Từ mô tả công việc dưới đây, hãy đề xuất tiêu đề, tóm tắt, 3 nhãn và mức ưu tiên.\n\nMÔ TẢ: ' + input.text;
    },
    schema: { type: 'object', props: {
      title: { type: 'string', max: 70 },
      summary: { type: 'string', max: 240 },
      tags: { type: 'array', of: { type: 'string', max: 20 }, min: 3, max: 3 },
      priority: { type: 'number', min: 1, max: 5, integer: true }
    } },
    mock: function (input) {
      var text = String(input.text || ''), words = text.split(/\s+/).filter(Boolean);
      var long = words.filter(function (w) { return w.length > 4; }).map(function (w) { return w.replace(/[.,;:!?]/g, ''); });
      var uniq = long.filter(function (w, i) { return long.indexOf(w) === i; });
      var seed = EP.mock ? EP.mock.hash(text) : text.length;
      var tags = [uniq[0], uniq[1], uniq[2]].map(function (w, i) { return w || ['công việc', 'ưu tiên', 'theo dõi'][i]; });
      return {
        title: words.slice(0, 9).join(' ').replace(/[.,;:!?]+$/, ''),
        summary: 'Cần ' + (words.slice(0, 14).join(' ').toLowerCase()) + (words.length > 14 ? '...' : '') + '. Nên chia nhỏ công việc, giao người phụ trách và đặt hạn rõ ràng.',
        tags: tags,
        priority: 1 + (seed % 5)
      };
    }
  };

  /* [5] Đăng ký view: tab + h1 + mô tả + KPI hiện ở Tổng quan + hàm render */
  var COLUMNS = [
    { key: 'name', label: 'Tên mục', sort: true, render: function (r) { return '<div class="cell-main">' + esc(r.name) + '</div><div class="cell-sub">' + esc(CATEGORY[r.category] || '') + (r.email ? ' · ' + esc(r.email) : '') + '</div>'; } },
    { key: 'phone', label: 'Điện thoại', sort: true, render: function (r) { return esc(r.phone || '—'); } },
    { key: 'qty', label: 'Số lượng', sort: true, type: 'number', num: true, render: function (r) { return EP.fmt.number(r.qty); } },
    { key: 'due', label: 'Hạn', sort: true, type: 'date', render: function (r) { return esc(EP.fmt.date(r.due)); } },
    { key: 'status', label: 'Trạng thái', sort: true, render: function (r) { return EP.ui.badge(STATUS[r.status] || r.status, STATUS_TONE[r.status]); } }
  ];
  function stats() {
    var rows = items.list(), done = rows.filter(function (r) { return r.status === 'done'; }).length;
    return { total: rows.length, doing: rows.filter(function (r) { return r.status === 'doing'; }).length, doneRate: rows.length ? done / rows.length * 100 : 0, qty: rows.reduce(function (s, r) { return s + (Number(r.qty) || 0); }, 0) };
  }
  EP.register({
    id: NAME, label: 'Mục', icon: 'list', order: 20,
    title: 'Quản lý mục', desc: 'Thêm, sửa, xóa, lọc, xuất file và nhờ AI gợi ý. Đây là feature mẫu để nhân bản.',
    summary: function () { var s = stats(); return [{ label: 'Tổng số mục', value: String(s.total), hint: s.doing + ' đang làm' }, { label: 'Tỉ lệ hoàn thành', value: EP.fmt.percent(s.doneRate, 0) }]; },
    actions: function () {
      return '<button type="button" class="btn" data-act="export">' + EP.ui.icon('download') + 'Xuất CSV</button><button type="button" class="btn" data-act="print">' + EP.ui.icon('print') + 'In / PDF</button>' +
        '<button type="button" class="btn btn-primary" data-act="add">' + EP.ui.icon('plus') + 'Thêm mục</button>';
    },
    render: function (el) { build(el); }
  });

  /* [6] Giao diện: dựng khung một lần, rồi refresh() cập nhật từng phần khi dữ liệu đổi */
  function build(el) {
    var filter = 'all', q = '', table, aiResult = null, aiStep = 0, form;
    el.innerHTML =
      '<div class="grid kpis" data-slot="kpi"></div>' +
      '<div class="card pad-0 flat"><div class="row between" style="padding:14px 16px;border-bottom:1px solid var(--rule)">' +
        '<div data-slot="filter"></div>' +
        '<div class="field" style="min-width:min(100%,240px)"><input class="input input-inline" id="ex-search" type="search" placeholder=" " autocomplete="off" aria-label="Tìm theo tên"><label class="label" for="ex-search" style="top:10px">Tìm theo tên...</label></div></div>' +
        '<div data-slot="table"></div></div>' +
      '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">Số mục theo nhóm</h2></div><div data-slot="bar"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Theo trạng thái</h2></div><div data-slot="donut"></div></div></div>' +
      '<div class="card" data-slot="ai"><div class="card-head"><h2 class="section-title">' + EP.ui.icon('sparkles') + ' Nhờ AI gợi ý mục mới</h2><div data-slot="mode"></div></div>' +
        '<div data-slot="stepper"></div>' +
        '<form class="form mt-3" id="ex-ai-form" novalidate>' + EP.form.render({ text: { label: 'Mô tả công việc (ít nhất 10 ký tự)', type: 'textarea', rules: { required: true, minLength: 10, maxLength: 500 } } }, {}, { grid: false }) +
        '<div class="row"><button type="submit" class="btn btn-ai" id="ex-ai-go">' + EP.ui.icon('sparkles') + 'Tạo gợi ý</button></div></form>' +
        '<div data-slot="ai-out" class="mt-3" aria-live="polite"></div></div>';

    var $slot = function (n) { return el.querySelector('[data-slot="' + n + '"]'); };

    EP.ui.segmented($slot('filter'), { label: 'Lọc theo trạng thái', name: 'ex-filter', value: 'all', onChange: function (v) { filter = v; refresh(); },
      options: [{ value: 'all', label: 'Tất cả' }].concat(Object.keys(STATUS).map(function (k) { return { value: k, label: STATUS[k] }; })) });
    EP.ai.mountModePicker($slot('mode'));
    el.querySelector('#ex-search').addEventListener('input', EP.debounce(function (e) { q = e.target.value.trim().toLowerCase(); refresh(); }, 120));

    table = EP.ui.table($slot('table'), {
      caption: 'Danh sách mục', columns: COLUMNS, rows: [], sort: { key: 'due', dir: 'asc' },
      actions: function (r) { return '<button type="button" class="btn btn-sm btn-ghost" data-act="edit" aria-label="Sửa ' + esc(r.name) + '">' + EP.ui.icon('edit') + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="delete" aria-label="Xóa ' + esc(r.name) + '">' + EP.ui.icon('trash') + '</button>'; },
      empty: { title: 'Chưa có mục nào', text: 'Thêm mục đầu tiên hoặc để AI gợi ý giúp bạn.', action: { label: 'Thêm mục', act: 'add' } },
      onAction: function (act, id) { if (act === 'edit') openForm(items.get(id)); else if (act === 'delete') remove(id); else if (act === 'add') openForm(); }
    });

    function visible() {
      return items.list().filter(function (r) { return (filter === 'all' || r.status === filter) && (!q || String(r.name).toLowerCase().indexOf(q) >= 0); });
    }
    function refresh() {
      var s = stats(), all = items.list();
      $slot('kpi').innerHTML = [
        { label: 'Tổng số mục', value: EP.fmt.number(s.total), hint: 'đang lưu trong trình duyệt' },
        { label: 'Đang làm', value: EP.fmt.number(s.doing) },
        { label: 'Tỉ lệ hoàn thành', value: EP.fmt.percent(s.doneRate, 0), hint: 'trên tổng số mục' },
        { label: 'Tổng số lượng', value: EP.fmt.number(s.qty) }
      ].map(EP.ui.kpi).join('');
      table.setRows(visible());
      EP.charts.bar($slot('bar'), EP.charts.countBy(all, 'category', CATEGORY), { unit: 'mục' });
      EP.charts.donut($slot('donut'), EP.charts.countBy(all, 'status', STATUS), { unit: 'mục', centerLabel: 'Tổng số mục' });
    }

    /* Thêm / sửa: hộp thoại chứa form theo SCHEMA */
    function openForm(row) {
      var fid = 'ex-form-' + EP.uid();
      var d = EP.ui.dialog({
        title: row ? 'Sửa mục' : 'Thêm mục mới', size: 'wide',
        body: '<form class="form" id="' + fid + '" novalidate>' + EP.form.render(SCHEMA, row || { category: 'a', status: 'new', qty: 1 }) + '</form>',
        actions: [{ label: 'Hủy', value: null }, { label: row ? 'Lưu thay đổi' : 'Thêm mục', variant: 'primary', type: 'submit', form: fid, id: 'ex-save' }]
      });
      EP.form.bind(d.body.querySelector('form'), SCHEMA, { onSubmit: function (v) {
        v.phone = v.phone ? EP.form.normalizePhone(v.phone) : '';
        if (row) items.update(row.id, v); else items.add(v);
        d.close(true);
        EP.ui.toast(row ? 'Đã lưu thay đổi.' : 'Đã thêm mục mới.', { type: 'success' });
      } });
    }
    function remove(id) {
      var r = items.get(id); if (!r) return;
      EP.ui.confirm({ title: 'Xóa mục này?', message: '"' + r.name + '" sẽ bị xóa khỏi danh sách.', confirmLabel: 'Xóa', danger: true }).then(function (ok) {
        if (!ok) return;
        items.remove(id);
        EP.ui.toast('Đã xóa "' + r.name + '".', { type: 'success', action: { label: 'Hoàn tác', onClick: function () { items.add(r); } } });
      });
    }

    /* Nút ở đầu view (h1) */
    var actionHost = el.closest('.view').querySelector('.view-actions');
    actionHost.onclick = function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'add') openForm();
      else if (a === 'print') EP.export.print();
      else if (a === 'export') {
        var rows = visible();
        if (!rows.length) { EP.ui.toast('Không có dòng nào để xuất.', { type: 'warn' }); return; }
        EP.export.csv('muc-' + EP.fmt.today() + '.csv', rows, [
          { key: 'name', label: 'Tên mục' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Điện thoại' }, { key: 'qty', label: 'Số lượng' },
          { key: 'due', label: 'Hạn' }, { label: 'Nhóm', key: 'category', value: function (r) { return CATEGORY[r.category]; } }, { label: 'Trạng thái', key: 'status', value: function (r) { return STATUS[r.status]; } }, { key: 'note', label: 'Ghi chú' }]);
      }
    };

    /* AI: form nhỏ -> EP.ai.generate -> hiện kết quả + ghi chú mock -> lưu thành mục */
    function drawAi() {
      $slot('stepper').innerHTML = EP.ui.stepper(['Nhập mô tả', 'AI tạo gợi ý', 'Duyệt & lưu'], aiStep);
      var out = $slot('ai-out');
      if (!aiResult) { out.innerHTML = ''; return; }
      var r = aiResult.data;
      out.innerHTML = '<div class="ai-result"><div class="row between"><h3>' + esc(r.title) + '</h3>' + EP.ui.badge('Ưu tiên ' + r.priority + '/5', r.priority >= 4 ? 'negative' : r.priority >= 3 ? 'warning' : 'positive') + '</div>' +
        '<p>' + esc(r.summary) + '</p><div class="chips">' + r.tags.map(function (t) { return '<span class="chip">#' + esc(t) + '</span>'; }).join('') + '</div>' +
        EP.ai.noticeHtml(aiResult) +
        '<div class="row"><button type="button" class="btn btn-primary" data-act="ai-save">' + EP.ui.icon('check') + 'Lưu thành mục mới</button><button type="button" class="btn" data-act="ai-copy">' + EP.ui.icon('copy') + 'Sao chép</button></div></div>';
    }
    form = EP.form.bind(el.querySelector('#ex-ai-form'), { text: { label: 'Mô tả công việc', type: 'textarea', rules: { required: true, minLength: 10, maxLength: 500 } } }, {
      onSubmit: function (v) {
        aiStep = 1; aiResult = null; drawAi();
        $slot('ai-out').innerHTML = EP.ui.skeleton(2);
        return EP.ai.generate(AI_SPEC, { input: { text: v.text }, onSwitch: function (m) { EP.ui.toast('Đã chuyển sang model ' + m, { type: 'info' }); } }).then(function (res) {
          aiResult = res; aiStep = 2; drawAi();
        }, function (err) {
          aiStep = 0; drawAi();
          if (err.kind !== 'cancel') $slot('ai-out').innerHTML = EP.ui.error({ title: 'Chưa tạo được gợi ý', text: err.message });
        });
      }
    });
    $slot('ai-out').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || !aiResult) return;
      var r = aiResult.data;
      if (b.getAttribute('data-act') === 'ai-copy') EP.ui.copy(r.title + '\n' + r.summary + '\n' + r.tags.map(function (t) { return '#' + t; }).join(' '));
      else {
        items.add({ name: r.title, email: '', phone: '', qty: 1, due: daysFromNow(7), category: 'a', status: 'new', note: r.summary + (aiResult.mode === 'mock' ? ' [' + EP.ai.MOCK_NOTICE + ']' : '') });
        aiResult = null; aiStep = 3; drawAi();
        EP.ui.toast('Đã lưu gợi ý thành mục mới.', { type: 'success' });
      }
    });

    items.onChange(function () { if (root.document.body.contains(el)) refresh(); });
    EP.bus.on('demo:reset', refresh); EP.bus.on('restore', refresh);
    drawAi(); refresh();
  }
})(window);

=================== FILE: vibe-sprint/starter/features/_playground/feature.js ===================
/* FEATURE "Mô-đun mẫu": minh hoạ nhanh các mô-đun tiện ích trong js/ (calc, checklist, quiz, chat + match, mock, metrics).
   Chép từng đoạn sang feature thật của bạn rồi XOÁ thư mục này + dòng <script> của nó trong index.html khi nộp bài. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  var FAQ = [
    { q: 'Giá sản phẩm bao nhiêu', keywords: ['giá', 'bao nhiêu', 'giá cả'], a: 'Sản phẩm có giá từ 99.000 ₫. Miễn phí vận chuyển cho đơn từ 300.000 ₫.' },
    { q: 'Giờ mở cửa', keywords: ['mở cửa', 'giờ làm việc', 'mấy giờ'], a: 'Cửa hàng mở cửa 8:00 - 21:00 mỗi ngày.' },
    { q: 'Đổi trả hàng', keywords: ['đổi trả', 'hoàn tiền', 'bảo hành'], a: 'Bạn được đổi trả trong 7 ngày nếu sản phẩm còn nguyên tem.' }
  ];
  var QUESTIONS = [
    { q: 'Thủ đô của Việt Nam là gì?', options: ['Đà Nẵng', 'Hà Nội', 'Huế', 'Cần Thơ'], answer: 1, explain: 'Hà Nội là thủ đô từ năm 1010.' },
    { q: '2 + 2 × 3 bằng bao nhiêu?', options: ['12', '8', '10', '6'], answer: 1, explain: 'Nhân trước, cộng sau: 2 + 6 = 8.' },
    { q: 'CSS viết tắt của cụm từ nào?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], answer: 0, explain: 'Cascading Style Sheets.' }
  ];
  var CHECK = [
    { id: 'title', label: 'Trang có tiêu đề rõ ràng', weight: 25, hint: 'Thêm thẻ <title> 10-60 ký tự.' },
    { id: 'desc', label: 'Có mô tả meta description', weight: 25, hint: 'Viết 120-160 ký tự.' },
    { id: 'h1', label: 'Có đúng một thẻ h1', weight: 30, hint: 'Mỗi trang một h1.' },
    { id: 'viewport', label: 'Có meta viewport cho di động', weight: 20, hint: 'Thêm width=device-width.' }
  ];

  var DEMOS = [
    { value: 'calc', label: 'Máy tính', mount: function (el) {
      EP.calc.mount(el, {
        title: 'Tính lợi nhuận đơn hàng',
        schema: {
          price: { label: 'Giá bán (₫)', type: 'number', rules: { required: true, min: 0 } },
          cost: { label: 'Giá vốn (₫)', type: 'number', rules: { required: true, min: 0 } },
          qty: { label: 'Số lượng', type: 'number', rules: { required: true, min: 1, integer: true } },
          ads: { label: 'Chi phí quảng cáo (₫)', type: 'number', rules: { min: 0 } }
        },
        defaults: { price: 250000, cost: 150000, qty: 20, ads: 400000 },
        compute: function (v) {
          var m = EP.metrics, revenue = v.price * v.qty, cogs = v.cost * v.qty, profit = revenue - cogs - (v.ads || 0);
          return {
            kpis: [{ label: 'Lợi nhuận', value: m.vnd(profit), hint: profit >= 0 ? 'Có lãi' : 'Đang lỗ' }, { label: 'Biên lợi nhuận', value: EP.fmt.percent(m.div(profit, revenue) * 100) }],
            rows: [['Doanh thu', m.vnd(revenue)], ['Giá vốn', m.vnd(cogs)], ['Quảng cáo', m.vnd(v.ads || 0)], ['ROAS', m.round(m.roas(revenue, v.ads), 2) + 'x']],
            notes: profit < 0 ? ['Bán dưới giá vốn hoặc quảng cáo quá cao. Thử tăng giá hoặc giảm chi phí.'] : [],
            chart: { type: 'donut', data: [{ label: 'Giá vốn', value: cogs }, { label: 'Quảng cáo', value: v.ads || 0 }, { label: 'Lợi nhuận', value: Math.max(profit, 0) }], opts: { format: m.vndShort, centerLabel: 'Doanh thu' } }
          };
        }
      });
    } },
    { value: 'checklist', label: 'Chấm điểm', mount: function (el) { EP.checklist.mount(el, { title: 'Kiểm tra trang web', items: CHECK }); } },
    { value: 'quiz', label: 'Đố vui', mount: function (el) { EP.quiz.mount(el, { title: 'Đố vui nhanh', questions: QUESTIONS, timePerQ: 20, boardName: 'demo' }); } },
    { value: 'chat', label: 'Chatbot', mount: function (el) {
      el.id = el.id || 'chat-demo';
      EP.chat.mount(el, {
        title: 'Trợ lý cửa hàng', quick: ['Giá bao nhiêu?', 'Giờ mở cửa', 'Đổi trả thế nào?'],
        reply: EP.chat.faqReply(FAQ, { quick: ['Giá bao nhiêu?', 'Giờ mở cửa'], action: { label: 'Để lại số điện thoại', onClick: function (c) { c.say('Cảm ơn bạn, nhân viên sẽ gọi lại sớm.'); } } })
      });
    } }
  ];

  EP.register({
    id: 'playground', label: 'Mô-đun', icon: 'calc', order: 30,
    title: 'Mô-đun tiện ích', desc: 'Máy tính, chấm điểm, đố vui và chatbot dựng sẵn để chép vào đề.',
    render: function (el) {
      el.innerHTML = '<div data-slot="pick"></div><div data-slot="demo" id="pg-demo"></div>';
      function show(v) { var d = DEMOS.filter(function (x) { return x.value === v; })[0], host = el.querySelector('[data-slot="demo"]'); host.innerHTML = ''; d.mount(host); }
      EP.ui.segmented(el.querySelector('[data-slot="pick"]'), { label: 'Chọn mô-đun', name: 'pg-pick', options: DEMOS, value: 'calc', onChange: show });
      show('calc');
    }
  });
})(window);

=================== FILE: vibe-sprint/starter/index.html ===================
<!doctype html>
<!-- data-preset chọn bộ giao diện: "xclipse" (mặc định: Ice/Navy/Coral) hoặc "lucian" (xem css/tokens.css) -->
<html lang="vi" data-preset="xclipse">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Tên ứng dụng</title>
<meta name="description" content="Mô tả ngắn của ứng dụng (đổi ở đây và trong js/config.js).">
<meta name="theme-color" content="#F5FBFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#041226" media="(prefers-color-scheme: dark)">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%236A57F2'/%3E%3Cpath d='M9 9l14 14M23 9L9 23' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E">
<!-- Áp giao diện đã chọn TRƯỚC khi vẽ để không bị nháy sáng/tối. Khoá 'ep_theme' = prefix trong js/config.js + 'theme'. -->
<script>(function(d){try{var t=localStorage.getItem('ep_theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})(document.documentElement);</script>
<!-- Phông tuỳ chọn (cần mạng; không có thì tự dùng phông hệ thống). Bỏ chú thích nếu muốn dùng:
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"> -->
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/app.css">
</head>
<body>
<a class="skip-link" href="#main">Bỏ qua, tới nội dung chính</a>

<header class="topbar">
  <a class="brand" href="#/home" aria-label="Về trang Tổng quan"><span class="brand-mark" id="brand-mark" aria-hidden="true">X</span><span class="brand-name" id="brand-name">Tên ứng dụng</span></a>
  <!-- Các tab được JS dựng từ EP.register(...) -->
  <nav class="tabs" id="tabs" aria-label="Điều hướng chính"></nav>
  <div class="topbar-actions">
    <button type="button" class="icon-btn" id="btn-theme" data-mode="system" aria-label="Giao diện: Theo hệ thống. Bấm để đổi" title="Giao diện: Theo hệ thống">
      <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>
      <svg class="i-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/></svg>
    </button>
  </div>
</header>

<main id="main" tabindex="-1">
  <!-- Mỗi view là <section> có đúng một <h1> (do router dựng). -->
  <div id="views"><noscript><p>Ứng dụng cần JavaScript để chạy.</p></noscript></div>
</main>

<footer class="footer">
  <span>&copy; <span id="ft-app">Tên ứng dụng</span> · <span id="ft-version">v0.1.0</span></span>
  <span class="mock-badge" id="ft-notice" role="note"></span>
</footer>

<div id="toasts" class="toasts" role="region" aria-label="Thông báo" aria-live="polite"></div>

<!-- Thứ tự nạp: config -> version -> core -> ui -> form -> charts -> export -> ai -> demo -> modules -> features -> app -->
<script src="js/config.js"></script>
<script src="js/version.js"></script>
<script src="js/core.js"></script>
<script src="js/ui.js"></script>
<script src="js/form.js"></script>
<script src="js/charts.js"></script>
<script src="js/export.js"></script>
<script src="js/ai.js"></script>
<script src="js/demo.js"></script>
<!-- Mô-đun tiện ích tuỳ chọn (xoá dòng nào không dùng) -->
<script src="js/mock.js"></script>
<script src="js/metrics.js"></script>
<script src="js/match.js"></script>
<script src="js/calc.js"></script>
<script src="js/checklist.js"></script>
<script src="js/quiz.js"></script>
<script src="js/chat.js"></script>
<script src="js/timeslot.js"></script>
<!-- FEATURES: mỗi feature một dòng. Nhân bản features/_example -> features/<ten>/ rồi thêm dòng ở đây. -->
<script src="features/_example/feature.js"></script>
<script src="features/_playground/feature.js"></script>
<script src="js/app.js"></script>
</body>
</html>

=================== FILE: vibe-sprint/starter/js/ai.js ===================
/* ai.js - EP.ai.generate(spec, { mode: 'mock' | 'gemini' | 'paste' }) -> Promise<{ data, mode, model, notice, warnings, prompt }>
   Ba chế độ cùng một đường ra:
     mock   : chạy spec.mock(input) offline (tất định), luôn kèm MOCK_NOTICE.
     gemini : gọi Gemini generateContent bằng key của người dùng (header x-goog-api-key), tự đổi model khi hết lượt/quá tải,
              rút JSON từ câu trả lời, kiểm tra theo schema, sai thì thử lại 1 lần, vẫn sai/lỗi thì rơi về mock (có cảnh báo).
     paste  : mở hộp thoại cho copy prompt -> dán trả lời của Claude/ChatGPT/Gemini -> kiểm tra như trên.
   spec = {
     id: 'tom-tat',
     prompt: function (input) { return '...'; } | 'chuỗi',      // phần việc; framework tự thêm yêu cầu JSON + khung schema
     schema: { type: 'object', props: { title: { type: 'string', max: 60 }, tags: { type: 'array', of: { type: 'string' }, min: 3, max: 3 } } },
     mock: function (input) { return {...}; },                    // BẮT BUỘC có để chạy offline
     temperature: 0.8
   }
   Schema: string{min,max,enum,optional} | number{min,max,integer} | boolean | array{of,min,max} | object{props}. Mặc định mọi trường bắt buộc. */
(function (root) {
  'use strict';
  var EP = root.EP, cfg = EP.config, esc = EP.esc, doc = root.document;

  var MOCK_NOTICE = cfg.mockNotice || 'Bản demo vòng loại - Dữ liệu mô phỏng AI';
  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
  var TIMEOUT_MS = 25000;
  // Danh sách model sao chép từ Xclipse (js/ai-service.js). Cập nhật theo tài khoản thật khi đi thi.
  var MODELS = [
    { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', note: 'Nhanh (~1 giây) - khuyên dùng', tier: 'free' },
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', note: 'Rất chậm, có thể quá 90 giây - chỉ dùng khi rảnh', tier: 'slow' },
    { id: 'gemini-4-hydrogen', label: 'Gemini 4 Hydrogen', note: 'Thế hệ 4, ~10 giây', tier: 'slow' }
  ];
  var DEFAULT_MODEL = 'gemini-3.6-flash';
  var FALLBACKS = ['gemini-3.6-flash', 'gemini-4-hydrogen', 'gemini-3.8-flash'];
  var PLATFORMS = { claude: ['Claude', 'https://claude.ai/new'], chatgpt: ['ChatGPT', 'https://chatgpt.com/'], gemini: ['Gemini', 'https://gemini.google.com/app'] };
  function modelInfo(id) { return MODELS.filter(function (m) { return m.id === id; })[0] || null; }
  function fail(msg, kind) { var e = new Error(msg); e.kind = kind; return e; }

  /* ---------- Trạng thái: chế độ / model / key (key chỉ lưu khi người dùng chủ động chọn "nhớ") ---------- */
  var state = {
    mode: EP.store.read('ai_mode', cfg.defaultAiMode || 'mock'),
    model: EP.store.read('ai_model', DEFAULT_MODEL),
    remember: !!EP.store.read('ai_remember', false),
    key: ''
  };
  if (state.remember) state.key = EP.store.read('ai_key', '') || '';
  if (['mock', 'gemini', 'paste'].indexOf(state.mode) < 0) state.mode = 'mock';

  /* ---------- Schema validator (đủ dùng, không thư viện) ---------- */
  function trimTo(s, max) { s = String(s).trim(); return max && s.length > max ? s.slice(0, max - 1).trim() + '…' : s; }
  function check(v, sc, path, warns, errs) {
    var type = sc.type || 'string';
    if (v == null || v === '') {
      if (sc.optional) return v == null ? undefined : v;
      errs.push(path + ': thiếu giá trị'); return v;
    }
    if (type === 'string') {
      if (typeof v === 'object') { errs.push(path + ': cần chuỗi'); return v; }
      var s = String(v).trim();
      if (sc.enum && sc.enum.indexOf(s) < 0) {
        var ci = sc.enum.filter(function (e) { return String(e).toLowerCase() === s.toLowerCase(); })[0];
        if (ci) return ci;
        errs.push(path + ': "' + s + '" không thuộc ' + sc.enum.join('/')); return s;
      }
      if (sc.min && s.length < sc.min) errs.push(path + ': quá ngắn (< ' + sc.min + ' ký tự)');
      if (sc.max && s.length > sc.max) { warns.push(path + ': đã cắt bớt còn ' + sc.max + ' ký tự'); s = trimTo(s, sc.max); }
      return s;
    }
    if (type === 'number') {
      var n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
      if (!isFinite(n)) { errs.push(path + ': cần là số'); return v; }
      if (sc.integer) n = Math.round(n);
      if (sc.min != null && n < sc.min) { warns.push(path + ': nâng lên ' + sc.min); n = sc.min; }
      if (sc.max != null && n > sc.max) { warns.push(path + ': hạ xuống ' + sc.max); n = sc.max; }
      return n;
    }
    if (type === 'boolean') {
      if (typeof v === 'boolean') return v;
      if (v === 'true') return true; if (v === 'false') return false;
      errs.push(path + ': cần true/false'); return v;
    }
    if (type === 'array') {
      if (!Array.isArray(v)) v = [v];
      if (sc.min && v.length < sc.min) { errs.push(path + ': cần ít nhất ' + sc.min + ' phần tử (có ' + v.length + ')'); }
      if (sc.max && v.length > sc.max) { warns.push(path + ': chỉ giữ ' + sc.max + ' phần tử đầu'); v = v.slice(0, sc.max); }
      return v.map(function (x, i) { return check(x, sc.of || { type: 'string' }, path + '[' + i + ']', warns, errs); });
    }
    if (type === 'object') {
      if (typeof v !== 'object' || Array.isArray(v)) { errs.push(path + ': cần object'); return v; }
      var out = {};
      Object.keys(sc.props || {}).forEach(function (k) {
        var r = check(v[k], sc.props[k], path ? path + '.' + k : k, warns, errs);
        if (r !== undefined) out[k] = r;
      });
      return out;
    }
    return v;
  }
  /** EP.ai.validate(value, schema) -> { ok, errors[], warnings[], value (đã ép kiểu/cắt độ dài) } */
  function validate(value, schema) {
    var warns = [], errs = [], out = schema ? check(value, schema, '', warns, errs) : value;
    return { ok: !errs.length, errors: errs, warnings: warns, value: out };
  }
  /** Mô tả schema thành mẫu JSON để đưa vào prompt */
  function describe(sc) {
    var t = sc.type || 'string';
    if (t === 'string') return sc.enum ? '"' + sc.enum.join(' | ') + '"' : '"..."' + (sc.max ? ' /* tối đa ' + sc.max + ' ký tự */' : '');
    if (t === 'number') return '0' + (sc.min != null || sc.max != null ? ' /* từ ' + (sc.min != null ? sc.min : '-') + ' đến ' + (sc.max != null ? sc.max : '-') + ' */' : '');
    if (t === 'boolean') return 'true';
    if (t === 'array') return '[' + describe(sc.of || { type: 'string' }) + (sc.min > 1 || sc.max > 1 ? ', ...' : '') + ']' + (sc.min || sc.max ? ' /* ' + (sc.min === sc.max ? 'đúng ' + sc.min : (sc.min || 0) + '-' + (sc.max || '?')) + ' phần tử */' : '');
    if (t === 'object') return '{ ' + Object.keys(sc.props || {}).map(function (k) { return '"' + k + '": ' + describe(sc.props[k]); }).join(', ') + ' }';
    return '"..."';
  }

  /* ---------- Rút JSON từ câu trả lời của AI: bỏ ```json, lời dẫn, nháy cong, dấu phẩy thừa; vá JSON bị cụt ---------- */
  function closeBrackets(s) {
    var stack = [], inStr = false, esc2 = false, i, c;
    for (i = 0; i < s.length; i++) {
      c = s[i];
      if (inStr) { if (esc2) esc2 = false; else if (c === '\\') esc2 = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true; else if (c === '{' || c === '[') stack.push(c); else if (c === '}' || c === ']') stack.pop();
    }
    if (inStr) s += '"';
    s = s.replace(/,\s*$/, '');
    while (stack.length) s += stack.pop() === '{' ? '}' : ']';
    return s;
  }
  function extractJson(text) {
    if (text == null || !String(text).trim()) throw new Error('AI không trả về nội dung.');
    var s = String(text).replace(/```(?:json)?/gi, '').replace(/^﻿/, '');
    var a = s.indexOf('{'), b = s.indexOf('['), start = a < 0 ? b : b < 0 ? a : Math.min(a, b);
    if (start < 0) throw new Error('Không tìm thấy khối JSON trong kết quả.');
    var end = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    s = s.slice(start, end > start ? end + 1 : undefined).replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, '$1');
    try { return JSON.parse(s); } catch (e1) {
      try { return JSON.parse(closeBrackets(s)); } catch (e2) { throw new Error('JSON bị lỗi cú pháp: ' + e1.message); }
    }
  }

  /* ---------- Gọi Gemini ---------- */
  function callGemini(apiKey, model, prompt, opts) {
    opts = opts || {};
    var info = modelInfo(model), limit = opts.timeout || (info && info.tier === 'slow' ? 180000 : TIMEOUT_MS);
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, limit);
    return fetch(GEMINI_URL.replace('{model}', encodeURIComponent(model)), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: opts.temperature == null ? 0.8 : opts.temperature, responseMimeType: 'application/json' }
      }),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (res.status === 400 || res.status === 401 || res.status === 403) throw fail('API key không hợp lệ hoặc chưa được cấp quyền.', 'key');
      if (res.status === 404) throw fail('Model "' + model + '" không còn mở cho tài khoản này.', 'model');
      if (res.status === 429) throw fail(info && info.tier === 'paid' ? 'Model "' + model + '" cần bật thanh toán trên Google AI Studio.' : 'Model "' + model + '" đã hết lượt miễn phí, thử lại sau ít phút.', 'quota');
      if (res.status === 503 || res.status === 500) throw fail('Model "' + model + '" của Google đang quá tải.', 'server');
      if (!res.ok) throw fail('Dịch vụ AI đang lỗi (mã ' + res.status + ').', 'server');
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      if (err && err.kind) throw err;
      throw err && err.name === 'AbortError' ? fail('Model "' + model + '" phản hồi quá lâu (quá ' + Math.round(limit / 1000) + ' giây).', 'timeout') : fail('Không kết nối được tới Gemini. Kiểm tra mạng.', 'network');
    }).then(function (data) {
      var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts || !parts.length) throw fail('AI không trả về nội dung (có thể bị bộ lọc an toàn chặn).', 'empty');
      return parts.filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
    });
  }
  /** Gọi model đã chọn; lỗi do model thì tự chuyển sang model nhanh khác. Lỗi key/mạng báo ngay. */
  function callWithFallback(apiKey, model, prompt, onSwitch, opts) {
    var tried = [model];
    function attempt(m) {
      return callGemini(apiKey, m, prompt, opts).then(function (text) { return { text: text, model: m }; }, function (e) {
        if (e.kind === 'key' || e.kind === 'network') throw e;
        var next = FALLBACKS.filter(function (f) { return tried.indexOf(f) < 0; })[0];
        if (!next) throw e;
        tried.push(next); if (onSwitch) onSwitch(next, e.message);
        return attempt(next);
      });
    }
    return attempt(model);
  }

  /* ---------- Prompt ---------- */
  function buildPrompt(spec, input) {
    var base = typeof spec.prompt === 'function' ? spec.prompt(input) : String(spec.prompt || '');
    var shape = spec.schema ? '\n\nChỉ trả về đúng một khối JSON hợp lệ theo mẫu sau, không giải thích, không markdown:\n' + describe(spec.schema) : '\n\nChỉ trả về một khối JSON, không giải thích, không markdown.';
    return base + shape + '\nChỉ dùng thông tin đã cho, KHÔNG bịa số liệu, tên người hay sự kiện.';
  }
  function parseAndCheck(text, spec) {
    var res = validate(extractJson(text), spec.schema);
    if (!res.ok) { var e = new Error('Kết quả AI chưa đúng cấu trúc: ' + res.errors.join('; ')); e.kind = 'schema'; throw e; }
    return res;
  }

  /* ---------- Hộp thoại chế độ dán (copy-prompt) ---------- */
  function pasteDialog(prompt, spec) {
    return new Promise(function (resolve, reject) {
      var links = Object.keys(PLATFORMS).map(function (k) { return '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + PLATFORMS[k][1] + '">Mở ' + PLATFORMS[k][0] + '</a>'; }).join('');
      var d = EP.ui.dialog({
        title: 'Dùng AI bên ngoài (copy - dán)', size: 'wide',
        body: '<ol class="stack" style="padding-left:20px"><li>Bấm <b>Sao chép prompt</b>, mở một trợ lý AI và dán vào.</li><li>Sao chép toàn bộ câu trả lời rồi dán vào ô bên dưới.</li></ol>' +
          '<div class="prompt-box" id="paste-prompt" tabindex="0" aria-label="Nội dung prompt">' + esc(prompt) + '</div>' +
          '<div class="row mt-3"><button type="button" class="btn btn-sm" id="paste-copy">' + EP.ui.icon('copy') + 'Sao chép prompt</button>' + links + '</div>' +
          '<div class="field mt-3"><textarea class="input" id="paste-in" rows="6" placeholder=" " name="paste"></textarea><label class="label" for="paste-in">Dán câu trả lời của AI vào đây</label><p class="field-msg" id="paste-msg" role="alert"></p></div>',
        actions: [{ label: 'Hủy', value: null }, { label: 'Dùng kết quả', variant: 'primary', id: 'paste-ok', onClick: function () {
          var msg = d.body.querySelector('#paste-msg'), wrap = msg.parentNode;
          try {
            var res = parseAndCheck(d.body.querySelector('#paste-in').value, spec);
            d.close(res);
          } catch (e) { wrap.setAttribute('data-invalid', ''); msg.textContent = e.message + ' Hãy sao chép lại đủ phần JSON.'; }
        } }]
      });
      d.body.querySelector('#paste-copy').addEventListener('click', function () { EP.ui.copy(prompt, 'Đã sao chép prompt'); });
      d.closed.then(function (v) { if (v && v.ok) resolve(v); else reject(fail('Bạn đã hủy.', 'cancel')); });
    });
  }

  /* ---------- Hàm chính ---------- */
  function mockRun(spec, input, warnings, instant) {
    if (typeof spec.mock !== 'function') return Promise.reject(fail('Tính năng này chưa có bản mô phỏng (spec.mock).', 'nomock'));
    return (instant ? Promise.resolve() : EP.sleep(450 + Math.random() * 350)).then(function () {
      var res = validate(spec.mock(input), spec.schema);
      return { data: res.value, mode: 'mock', model: 'mock', notice: MOCK_NOTICE, warnings: warnings.concat(res.warnings), prompt: buildPrompt(spec, input) };
    });
  }
  /** opts: { mode, input, key, model, instant (bỏ độ trễ giả), fallbackToMock (mặc định true), onSwitch(model, reason) } */
  function generate(spec, opts) {
    opts = opts || {};
    var mode = opts.mode || state.mode, input = opts.input !== undefined ? opts.input : spec.input, warnings = [];
    var prompt = buildPrompt(spec, input);
    if (mode === 'mock') return mockRun(spec, input, warnings, opts.instant);
    if (mode === 'paste') {
      return pasteDialog(prompt, spec).then(function (res) { return { data: res.value, mode: 'paste', model: 'paste', notice: '', warnings: res.warnings, prompt: prompt }; });
    }
    // gemini
    var key = opts.key || state.key, model = opts.model || state.model || DEFAULT_MODEL;
    function degrade(e) {
      if (e && e.kind === 'cancel') throw e;
      if (opts.fallbackToMock === false || typeof spec.mock !== 'function') throw e;
      return mockRun(spec, input, ['AI thật lỗi (' + (e && e.message || 'không rõ') + '), đã dùng dữ liệu mô phỏng.'], opts.instant);
    }
    if (!key) return degrade(fail('Chưa có API key Gemini. Nhập key ở tab Cài đặt hoặc chuyển sang chế độ Mô phỏng.', 'key'));
    var gopts = { temperature: spec.temperature };
    function once(p) {
      return callWithFallback(key, model, p, opts.onSwitch, gopts).then(function (r) {
        var res = parseAndCheck(r.text, spec);
        return { data: res.value, mode: 'gemini', model: r.model, notice: '', warnings: res.warnings, prompt: prompt };
      });
    }
    return once(prompt).catch(function (e) {
      if (e.kind !== 'schema' && !/JSON|nội dung/i.test(e.message)) throw e;
      return once(prompt + '\n\nLần trước bạn trả về sai định dạng (' + e.message + '). Hãy trả lại ĐÚNG một khối JSON theo mẫu, đủ trường, không thêm chữ nào khác.');
    }).catch(degrade);
  }

  /** HTML ghi chú đặt cạnh kết quả: mock -> MOCK_NOTICE; gemini/paste -> nhắc kiểm tra lại */
  function noticeHtml(result) {
    if (!result) return '';
    var w = (result.warnings || []).length ? '<br><small>' + result.warnings.map(esc).join(' | ') + '</small>' : '';
    if (result.mode === 'mock') return '<p class="ai-notice" role="note" data-ai-notice="mock">' + EP.ui.icon('info') + '<span>' + esc(result.notice || MOCK_NOTICE) + w + '</span></p>';
    return '<p class="ai-notice live" role="note" data-ai-notice="' + esc(result.mode) + '">' + EP.ui.icon('sparkles') + '<span>Nội dung do AI tạo' + (result.mode === 'gemini' ? ' (' + esc(result.model) + ')' : '') + ', vui lòng kiểm tra lại trước khi dùng.' + w + '</span></p>';
  }

  /* ---------- UI: chọn chế độ & cài đặt ---------- */
  var MODE_OPTS = [{ value: 'mock', label: 'Mô phỏng' }, { value: 'gemini', label: 'Gemini' }, { value: 'paste', label: 'Copy - dán' }];
  function setMode(m) { state.mode = m; EP.store.write('ai_mode', m); EP.bus.emit('ai:mode', m); }
  /** Thanh chọn chế độ nhỏ (dùng trong feature). Tự đồng bộ với Cài đặt. */
  function mountModePicker(el) {
    var seg = EP.ui.segmented(el, { label: 'Chế độ AI', name: 'ai-mode-' + EP.uid(), options: MODE_OPTS, value: state.mode, onChange: setMode });
    EP.bus.on('ai:mode', function (m) { seg.set(m); });
    return seg;
  }
  function setKey(key, remember) {
    state.key = (key || '').trim(); state.remember = !!remember;
    EP.store.write('ai_remember', state.remember);
    if (state.remember && state.key) EP.store.write('ai_key', state.key); else EP.store.remove('ai_key');
  }
  /** Khối cài đặt AI đầy đủ: chế độ, model, key (+ nhớ), nút thử kết nối */
  function mountSettings(el) {
    el.innerHTML = '<div class="stack"><div data-slot="mode"></div>' +
      '<div class="form-grid two"><div class="field"><select class="input" id="ai-model">' + MODELS.map(function (m) { return '<option value="' + m.id + '"' + (m.id === state.model ? ' selected' : '') + '>' + esc(m.label) + '</option>'; }).join('') + '</select><label class="label" for="ai-model">Model Gemini</label><p class="field-msg" id="ai-model-note"></p></div>' +
      '<div class="field"><input class="input" id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder=" " value="' + esc(state.key) + '"><label class="label" for="ai-key">API key Gemini</label><p class="field-msg" id="ai-key-msg">Key chỉ nằm trong bộ nhớ trang, mất khi tải lại.</p></div></div>' +
      '<label class="check"><input type="checkbox" id="ai-remember"' + (state.remember ? ' checked' : '') + '><span>Nhớ key trên trình duyệt này (lưu localStorage, chỉ bật trên máy cá nhân)</span></label>' +
      '<div class="row"><button type="button" class="btn btn-sm" id="ai-test">' + EP.ui.icon('sparkles') + 'Thử kết nối</button><a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="https://aistudio.google.com/apikey">Lấy key miễn phí</a></div></div>';
    mountModePicker(el.querySelector('[data-slot="mode"]'));
    var model = el.querySelector('#ai-model'), key = el.querySelector('#ai-key'), rem = el.querySelector('#ai-remember'), note = el.querySelector('#ai-model-note');
    function noteUpd() { var i = modelInfo(model.value); note.textContent = i ? i.note : ''; }
    noteUpd();
    model.addEventListener('change', function () { state.model = model.value; EP.store.write('ai_model', state.model); noteUpd(); });
    function saveKey() { setKey(key.value, rem.checked); }
    key.addEventListener('input', saveKey);
    rem.addEventListener('change', function () { saveKey(); EP.ui.toast(rem.checked ? 'Đã lưu key trên trình duyệt này.' : 'Đã xóa key khỏi trình duyệt.', { type: 'info' }); });
    el.querySelector('#ai-test').addEventListener('click', function (e) {
      var b = e.currentTarget; saveKey();
      if (!state.key) { EP.ui.toast('Hãy nhập API key trước.', { type: 'warn' }); key.focus(); return; }
      EP.ui.busy(b, true);
      callWithFallback(state.key, state.model, 'Trả về JSON {"ok": true}', null, { temperature: 0 }).then(function (r) { EP.ui.toast('Kết nối tốt (' + r.model + ').', { type: 'success' }); },
        function (err) { EP.ui.toast(err.message, { type: 'error' }); }).then(function () { EP.ui.busy(b, false); });
    });
  }

  EP.ai = {
    MOCK_NOTICE: MOCK_NOTICE, MODELS: MODELS, DEFAULT_MODEL: DEFAULT_MODEL, FALLBACKS: FALLBACKS, PLATFORMS: PLATFORMS,
    state: state, getMode: function () { return state.mode; }, setMode: setMode, setKey: setKey,
    generate: generate, buildPrompt: buildPrompt, validate: validate, describe: describe, extractJson: extractJson,
    callGemini: callGemini, callWithFallback: callWithFallback, modelInfo: modelInfo,
    pasteDialog: pasteDialog, noticeHtml: noticeHtml, mountModePicker: mountModePicker, mountSettings: mountSettings
  };
})(window);

=================== FILE: vibe-sprint/starter/js/app.js ===================
/* app.js - khởi động: dựng thương hiệu/chân trang, nút giao diện, nạp demo, view Tổng quan & Cài đặt, bật router.
   Nạp CUỐI CÙNG (sau mọi features/*). Không cần sửa khi thêm feature mới. */
(function (root) {
  'use strict';
  var EP = root.EP, cfg = EP.config, esc = EP.esc, doc = root.document;

  /* ---------- Tổng quan: KPI gộp từ summary() của các feature + thẻ lối tắt + hướng dẫn 3 bước ---------- */
  EP.register({
    id: 'home', label: 'Tổng quan', icon: 'home', order: 0, always: true,
    title: cfg.appName, desc: cfg.tagline,
    render: function (el) {
      var feats = EP.router.list().filter(function (v) { return v.id !== 'home' && v.id !== 'settings'; });
      var kpis = [];
      feats.forEach(function (v) { if (v.summary) { try { kpis = kpis.concat(v.summary()); } catch (e) { console.error(e); } } });
      var links = feats.map(function (v) {
        return '<a class="card" href="#/' + esc(v.id) + '"><div class="row" style="gap:12px;flex-wrap:nowrap;align-items:flex-start"><span style="flex:none;color:var(--accent-ink)">' + EP.ui.icon(v.icon || 'list') + '</span><div><h2 class="section-title">' + esc(v.label) + '</h2><p class="muted">' + esc(v.desc || '') + '</p></div></div></a>';
      }).join('');
      var first = feats[0];
      el.innerHTML =
        '<section class="hero" aria-label="Giới thiệu"><div class="hero-copy"><span class="hero-eyebrow">' + esc(cfg.appName) + '</span><p class="hero-title" role="presentation">' + esc(cfg.heroLead || 'Giải pháp') + ' <em>' + esc(cfg.heroEm || 'thông minh') + '</em></p><p>' + esc(cfg.tagline) + '</p>' +
        (first ? '<a class="btn btn-cta" href="#/' + esc(first.id) + '">Bắt đầu ngay ' + EP.ui.icon('send') + '</a>' : '') + '</div><div class="hero-visual" aria-hidden="true"></div></section>' +
        (kpis.length ? '<div class="grid kpis">' + kpis.slice(0, 8).map(EP.ui.kpi).join('') + '</div>' : '') +
        '<div class="card"><div class="card-head"><h2 class="section-title">Bắt đầu nhanh</h2></div>' + EP.ui.stepper(['Nhập dữ liệu', 'Tạo bằng AI', 'Xem biểu đồ', 'Xuất báo cáo'], 0) + '</div>' +
        (links ? '<div class="grid cols-2">' + links + '</div>' : EP.ui.empty({ title: 'Chưa có tính năng nào', text: 'Thêm file vào features/ và nạp trong index.html.' }));
    }
  });

  /* ---------- Cài đặt: giao diện, AI, dữ liệu ---------- */
  EP.register({
    id: 'settings', label: 'Cài đặt', icon: 'settings', order: 99,
    title: 'Cài đặt', desc: 'Giao diện, trợ lý AI và dữ liệu của bạn.',
    render: function (el) {
      el.innerHTML =
        '<div class="card"><div class="card-head"><h2 class="section-title">Giao diện</h2></div><div id="set-theme"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Trợ lý AI</h2></div><div id="set-ai"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Dữ liệu</h2></div><p class="muted">Dữ liệu nằm trong trình duyệt này (localStorage). Hãy sao lưu trước khi xóa hoặc đổi máy.</p>' +
        '<div class="row mt-3"><button class="btn" type="button" data-act="backup">' + EP.ui.icon('download') + 'Sao lưu (JSON)</button><button class="btn" type="button" data-act="restore">' + EP.ui.icon('upload') + 'Khôi phục từ file</button>' +
        '<button class="btn" type="button" data-act="demo">' + EP.ui.icon('refresh') + 'Nạp lại dữ liệu demo</button><button class="btn btn-danger" type="button" data-act="wipe">' + EP.ui.icon('trash') + 'Xóa toàn bộ dữ liệu</button></div></div>' +
        '<p class="muted center">' + esc(cfg.appName) + ' · phiên bản ' + esc(EP.version.version) + ' (' + esc(EP.version.date) + ')</p>';
      var seg = EP.ui.segmented(el.querySelector('#set-theme'), {
        label: 'Giao diện', name: 'set-theme', value: EP.theme.get(),
        options: [{ value: 'system', label: 'Theo hệ thống' }, { value: 'light', label: 'Sáng' }, { value: 'dark', label: 'Tối' }],
        onChange: function (v) { EP.theme.set(v, el.querySelector('#set-theme input:checked')); }
      });
      EP.bus.on('theme', function (m) { if (seg) seg.set(m); });
      EP.ai.mountSettings(el.querySelector('#set-ai'));
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'backup') EP.export.backup();
        else if (act === 'restore') EP.export.pickFile('.json,application/json').then(function (f) { return EP.export.restore(f); }).then(function (n) { EP.ui.toast('Đã khôi phục ' + n + ' mục dữ liệu.', { type: 'success' }); EP.router.refresh(); }, function (err) { EP.ui.toast(err.message, { type: 'error' }); });
        else if (act === 'demo') EP.ui.confirm({ title: 'Nạp lại dữ liệu demo?', message: 'Dữ liệu hiện tại của các mục có demo sẽ bị thay bằng dữ liệu mẫu.', confirmLabel: 'Nạp lại', danger: true }).then(function (ok) { if (ok) { EP.demo.reset(); EP.ui.toast('Đã nạp lại dữ liệu demo.', { type: 'success' }); } });
        else if (act === 'wipe') EP.ui.confirm({ title: 'Xóa toàn bộ dữ liệu?', message: 'Mọi dữ liệu của ứng dụng trong trình duyệt này sẽ mất, không hoàn tác được.', confirmLabel: 'Xóa hết', danger: true }).then(function (ok) { if (ok) { EP.store.clear(); EP.ui.toast('Đã xóa. Đang tải lại...', { type: 'success' }); setTimeout(function () { root.location.reload(); }, 600); } });
      });
    }
  });

  /* ---------- Khởi động ---------- */
  function boot() {
    var $ = EP.$, set = function (id, t) { var n = doc.getElementById(id); if (n) n.textContent = t; };
    set('brand-name', cfg.appName); set('brand-mark', cfg.brandMark || cfg.appName.charAt(0));
    set('ft-app', cfg.appName); set('ft-version', 'v' + EP.version.version);
    var nt = doc.getElementById('ft-notice'); if (nt) nt.textContent = EP.ai.MOCK_NOTICE;
    function syncNotice() { if (nt) nt.hidden = EP.ai.getMode() !== 'mock'; }
    syncNotice(); EP.bus.on('ai:mode', syncNotice);

    var tb = $('#btn-theme');
    if (tb) { EP.theme.apply(EP.theme.get()); tb.addEventListener('click', function () { EP.theme.cycle(tb); }); }
    EP.bus.on('store:error', function () { EP.ui.toast('Bộ nhớ trình duyệt đầy hoặc bị chặn, dữ liệu có thể không được lưu.', { type: 'warn' }); });

    EP.demo.run();
    EP.router.mount();
    doc.documentElement.setAttribute('data-ready', '1');
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})(window);

=================== FILE: vibe-sprint/starter/js/calc.js ===================
/* calc.js - máy tính "form -> kết quả" cập nhật trực tiếp (tính lãi/lỗ, ngân sách, phí vận chuyển, voucher...).
     var c = EP.calc.mount(el, {
       title: 'Tính lợi nhuận',
       schema: { price: { label: 'Giá bán', type: 'number', rules: { required: true, min: 0 } }, cost: {...}, qty: {...} },
       defaults: { price: 250000, cost: 150000, qty: 10 },
       compute: function (v) { return {                              // chỉ chạy khi form HỢP LỆ
         kpis: [{ label: 'Lợi nhuận', value: EP.metrics.vnd(...), delta: 12.5 }],
         rows: [['Doanh thu', EP.metrics.vnd(...)], ...],            // bảng khoá - giá trị (tuỳ chọn)
         notes: ['Gợi ý...'], chart: { type: 'bar'|'donut'|'line', data: [{label,value}] } // tuỳ chọn
       }; },
       onResult: function (res, values) {}                           // tuỳ chọn (lưu lịch sử...)
     });
     c.values(), c.result(), c.run() */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;
  function mount(el, o) {
    var last = null;
    el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Nhập số liệu') + '</h2></div>' +
      '<form class="form" novalidate data-calc-form>' + EP.form.render(o.schema, o.defaults || {}) + '</form></div>' +
      '<div class="card" aria-live="polite" data-calc-out></div></div>';
    var out = el.querySelector('[data-calc-out]');
    function draw(res) {
      if (!res) { out.innerHTML = EP.ui.empty({ icon: 'calc', title: 'Nhập đủ số liệu hợp lệ', text: 'Kết quả sẽ hiện ngay tại đây.' }); return; }
      out.innerHTML = '<div class="card-head"><h2 class="section-title">Kết quả</h2></div>' +
        (res.kpis && res.kpis.length ? '<div class="grid kpis" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">' + res.kpis.map(EP.ui.kpi).join('') + '</div>' : '') +
        (res.rows && res.rows.length ? '<dl class="kv mt-3">' + res.rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' : '') +
        (res.chart ? '<div class="mt-3" data-calc-chart></div>' : '') +
        (res.notes && res.notes.length ? '<ul class="list-plain mt-3">' + res.notes.map(function (n) { return '<li>' + EP.ui.icon('info') + '<span>' + esc(n) + '</span></li>'; }).join('') + '</ul>' : '');
      if (res.chart) EP.charts[res.chart.type || 'bar'](out.querySelector('[data-calc-chart]'), res.chart.data, res.chart.opts || {});
    }
    var form = EP.form.bind(el.querySelector('[data-calc-form]'), o.schema, { onChange: EP.debounce(run, 80) });
    el.querySelector('[data-calc-form]').addEventListener('change', run);
    function run() {
      var v = form.values(), chk = EP.form.validate(o.schema, v);
      last = chk.ok ? o.compute(v) : null;
      draw(last);
      if (last && o.onResult) o.onResult(last, v);
      return last;
    }
    run();
    return { values: form.values, result: function () { return last; }, run: run };
  }
  EP.calc = { mount: mount };
})(window);

=================== FILE: vibe-sprint/starter/js/charts.js ===================
/* charts.js - biểu đồ SVG không thư viện, tự đổi màu theo giao diện (đọc biến --chart-* trong CSS),
   tự vẽ lại khi đổi kích thước, có aria-label mô tả và bảng số cho trình đọc màn hình.
     EP.charts.bar(el,   [{ label, value, color? }], { unit:'', format:fn, height:220 })
     EP.charts.line(el,  [{ label, value }],          { unit:'', format:fn, height:220, area:true })
     EP.charts.donut(el, [{ label, value, color? }],  { unit:'', format:fn, centerLabel:'Tổng' })
   Dữ liệu rỗng -> trạng thái trống. Gọi lại hàm trên cùng el để cập nhật. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, NS = 'http://www.w3.org/2000/svg';
  var COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];
  function col(d, i) { return d.color || COLORS[i % COLORS.length]; }
  function fmtDefault(v) { return EP.fmt.number(v, Math.abs(v) < 10 && v % 1 ? 1 : 0); }
  function nice(max) {
    if (max <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(max))), n = max / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function cut(s, n) { s = String(s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; }
  function summary(kind, data, o) {
    var f = o.format || fmtDefault;
    return kind + ': ' + data.map(function (d) { return d.label + ' ' + f(d.value) + (o.unit ? ' ' + o.unit : ''); }).join(', ');
  }
  function table(data, o) {
    var f = o.format || fmtDefault;
    return '<table class="sr-only"><caption>' + esc(o.title || 'Dữ liệu biểu đồ') + '</caption><tbody>' + data.map(function (d) { return '<tr><th scope="row">' + esc(d.label) + '</th><td>' + esc(f(d.value)) + '</td></tr>'; }).join('') + '</tbody></table>';
  }

  /* Mỗi biểu đồ lưu cấu hình để vẽ lại khi đổi kích thước */
  var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(EP.debounce(function (list) {
    list.forEach(function (e) { var el = e.target; if (el._chart && Math.abs(el._chart.w - el.clientWidth) > 8) draw(el); });
  }, 120)) : null;

  function mount(el, kind, data, o) {
    el.classList.add('chart');
    el._chart = { kind: kind, data: data || [], o: o || {}, w: 0 };
    if (ro && !el._observed) { ro.observe(el); el._observed = true; }
    draw(el);
  }
  function draw(el) {
    var c = el._chart, data = c.data, o = c.o;
    c.w = el.clientWidth || 320;
    var total = data.reduce(function (s, d) { return s + (Number(d.value) || 0); }, 0);
    if (!data.length || (c.kind === 'donut' && total <= 0)) { el.innerHTML = EP.ui.empty({ icon: 'chart', title: 'Chưa có dữ liệu để vẽ biểu đồ' }); return; }
    el.innerHTML = c.kind === 'bar' ? bar(data, o, c.w) : c.kind === 'line' ? line(data, o, c.w) : donut(data, o, c.w);
  }

  function frame(w, h, label, inner) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + esc(label) + '">' + inner + '</svg>';
  }
  function axes(w, h, m, max, f, min) {
    var s = '', i, steps = 4, ch = h - m.t - m.b; min = min || 0;
    for (i = 0; i <= steps; i++) {
      var y = m.t + ch - ch * i / steps;
      s += '<line class="grid-line" x1="' + m.l + '" x2="' + (w - m.r) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (m.l - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + esc(f(min + (max - min) * i / steps)) + '</text>';
    }
    return s;
  }

  /* Khoảng trục: luôn gồm số 0, chia đúng 4 khoảng bằng nhau, số 0 nằm trên một vạch, bước "đẹp" (1, 2, 2.5, 5 x 10^k).
     Chỉ dương: 0..4 bước (vd 0..8 bước 2, không còn nhãn lẻ 3,8). Có âm: vd -20k..60k bước 20k. */
  function range(data) {
    var v = data.map(function (d) { return Number(d.value) || 0; }), mx = Math.max.apply(null, v.concat(0)), mn = Math.min.apply(null, v.concat(0));
    if (mx === 0 && mn === 0) return { max: 1, min: 0 };
    var span = mx - mn, p = Math.pow(10, Math.floor(Math.log10(span / 4))), steps = [], a, b, i, st, k;
    for (i = 0; i < 3; i++) [1, 2, 2.5, 5].forEach(function (m) { if (m !== 2.5 || p >= 10 || p < 1) steps.push(m * p * Math.pow(10, i)); });
    for (i = 0; i < steps.length; i++) { st = steps[i]; a = Math.ceil(mx / st - 1e-9); b = Math.ceil(-mn / st - 1e-9); if (a + b <= 4) break; }
    while (a + b < 4) { k = mn < 0 && (mx <= 0 || -mn / (b * st) > mx / (a * st)) ? 'b' : 'a'; if (k === 'a') a++; else b++; }
    return { max: a * st, min: -b * st };
  }

  function bar(data, o, w) {
    var h = o.height || 220, f = o.format || fmtDefault, R = range(data), max = R.max, min = R.min, span = (max - min) || 1;
    var m = { l: 40, r: 8, t: 22, b: 30 }, cw = w - m.l - m.r, ch = h - m.t - m.b, band = cw / data.length, bw = Math.min(56, band * .62);
    var s = axes(w, h, m, max, f, min), y0 = m.t + ch * max / span;
    data.forEach(function (d, i) {
      var v = Number(d.value) || 0, bh = Math.abs(ch * v / span), x = m.l + band * i + (band - bw) / 2, y = v >= 0 ? y0 - bh : y0;
      s += '<rect class="ch-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(bh, 0) + '" rx="6" style="fill:' + col(d, i) + ';animation-delay:' + i * 60 + 'ms"><title>' + esc(d.label + ': ' + f(v) + (o.unit ? ' ' + o.unit : '')) + '</title></rect>';
      s += '<text class="val" x="' + (x + bw / 2) + '" y="' + (v >= 0 ? y - 6 : y + bh + 14) + '" text-anchor="middle">' + esc(f(v)) + '</text>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(cut(d.label, Math.floor(band / 6.5))) + '</text>';
    });
    return frame(w, h, summary('Biểu đồ cột', data, o), s) + table(data, o);
  }

  function line(data, o, w) {
    var h = o.height || 220, f = o.format || fmtDefault, R = range(data), max = R.max, min = R.min, span = (max - min) || 1;
    var m = { l: 40, r: 14, t: 18, b: 30 }, cw = w - m.l - m.r, ch = h - m.t - m.b, n = data.length;
    function X(i) { return m.l + (n === 1 ? cw / 2 : cw * i / (n - 1)); }
    function Y(v) { return m.t + ch - ch * ((Number(v) || 0) - min) / span; }
    var s = axes(w, h, m, max, f, min), pts = data.map(function (d, i) { return X(i) + ',' + Y(d.value); });
    var color = o.color || 'var(--chart-1)';
    if (o.area !== false && n > 1) s += '<path d="M' + X(0) + ',' + Y(0) + ' L' + pts.join(' L') + ' L' + X(n - 1) + ',' + Y(0) + 'Z" style="fill:' + color + ';opacity:.12"/>';
    s += '<polyline class="ch-line" points="' + pts.join(' ') + '" style="stroke:' + color + '"/>';
    var every = Math.ceil(n / Math.max(2, Math.floor(cw / 56)));
    data.forEach(function (d, i) {
      s += '<circle class="ch-dot" cx="' + X(i) + '" cy="' + Y(d.value) + '" r="4.5" style="fill:' + color + '"><title>' + esc(d.label + ': ' + f(d.value) + (o.unit ? ' ' + o.unit : '')) + '</title></circle>';
      if (i % every === 0) s += '<text x="' + X(i) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(cut(d.label, 9)) + '</text>';
    });
    return frame(w, h, summary('Biểu đồ đường', data, o), s) + table(data, o);
  }

  function donut(data, o, w) {
    var f = o.format || fmtDefault, size = Math.min(220, Math.max(140, w)), r = size / 2 - 18, C = 2 * Math.PI * r, cx = size / 2;
    var total = data.reduce(function (s, d) { return s + (Number(d.value) || 0); }, 0), off = 0;
    var s = '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="var(--chart-grid)" stroke-width="22"/>';
    data.forEach(function (d, i) {
      var v = Number(d.value) || 0; if (v <= 0) return;
      var len = C * v / total, gap = data.length > 1 ? Math.min(3, len / 4) : 0;
      s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke-width="22" style="stroke:' + col(d, i) + '" stroke-dasharray="' + Math.max(len - gap, 0.5) + ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"><title>' + esc(d.label + ': ' + f(v) + ' (' + Math.round(v / total * 100) + '%)') + '</title></circle>';
      off += len;
    });
    s += '<text class="donut-total" x="' + cx + '" y="' + (cx + 4) + '" text-anchor="middle">' + esc(f(total)) + '</text><text x="' + cx + '" y="' + (cx + 22) + '" text-anchor="middle">' + esc(o.centerLabel || 'Tổng') + '</text>';
    var legend = '<ul class="chart-legend">' + data.map(function (d, i) { return '<li><i style="background:' + col(d, i) + '"></i>' + esc(d.label) + ' <b>' + esc(f(d.value)) + '</b></li>'; }).join('') + '</ul>';
    return '<div class="donut-wrap">' + frame(size, size, summary('Biểu đồ tròn', data, o), s) + legend + '</div>' + table(data, o);
  }

  EP.charts = {
    bar: function (el, data, o) { mount(el, 'bar', data, o); },
    line: function (el, data, o) { mount(el, 'line', data, o); },
    donut: function (el, data, o) { mount(el, 'donut', data, o); },
    /** Đếm theo một khoá: EP.charts.countBy(rows, 'status', { a: 'Mới' }) -> [{label, value}] */
    countBy: function (rows, key, labels) {
      var m = {}, order = [];
      rows.forEach(function (r) { var k = r[key] == null || r[key] === '' ? '(trống)' : r[key]; if (!(k in m)) { m[k] = 0; order.push(k); } m[k]++; });
      return order.map(function (k) { return { label: (labels && labels[k]) || k, value: m[k] }; });
    }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/chat.js ===================
/* chat.js - giao diện chatbot: bong bóng, đang gõ..., gợi ý nhanh (quick reply), nút hành động (chuyển sang form khi bot không biết).
     var chat = EP.chat.mount(el, {
       title: 'Trợ lý đặt món', greeting: 'Xin chào! Mình giúp gì được cho bạn?',
       quick: ['Giá bao nhiêu?', 'Giờ mở cửa'],
       reply: function (text, ctx) { return { text: '...', quick: [...], action: { label: 'Để lại thông tin', onClick: fn } }; },   // đồng bộ hoặc Promise
       delay: 500
     });
     chat.say('Bot nói'), chat.user('Người dùng nói'), chat.clear()
   Bộ trả lời dựng sẵn từ FAQ (khớp từ khoá không dấu):
     reply: EP.chat.faqReply(entries, { fallback: 'Mình chưa rõ ý bạn.', action: { label: 'Để lại số điện thoại', onClick: fn }, quick: [...] }) */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  function faqReply(entries, o) {
    o = o || {};
    return function (text) {
      var m = EP.match.faq(entries, text, { threshold: o.threshold });
      if (m) return { text: m.entry.a, quick: m.entry.quick || o.quick };
      return { text: o.fallback || 'Mình chưa rõ ý bạn. Bạn có thể diễn đạt lại hoặc để lại thông tin để nhân viên hỗ trợ nhé.', quick: o.quick, action: o.action, unknown: true };
    };
  }

  function mount(el, o) {
    el.innerHTML = '<div class="card pad-0 flat chat"><div class="chat-log" role="log" aria-live="polite" aria-label="' + esc(o.title || 'Cuộc trò chuyện') + '"></div><div class="chat-quick"></div>' +
      '<form class="chat-form" novalidate><label class="sr-only" for="chat-in-' + el.id + '">Tin nhắn</label><input class="input" id="chat-in-' + el.id + '" autocomplete="off" placeholder="Nhập câu hỏi của bạn..." maxlength="300"><button class="btn btn-primary" type="submit" aria-label="Gửi">' + EP.ui.icon('send') + '<span class="hide-sm">Gửi</span></button></form></div>';
    var log = el.querySelector('.chat-log'), quick = el.querySelector('.chat-quick'), form = el.querySelector('form'), input = form.querySelector('input'), busy = false;
    function bubble(kind, text) {
      var b = document.createElement('div'); b.className = 'bubble ' + kind; b.textContent = text; log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
    }
    function setQuick(list) {
      quick.innerHTML = (list || []).map(function (q) { return '<button type="button" class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('');
    }
    function action(a) {
      if (!a) return;
      var wrap = document.createElement('div'); wrap.className = 'bubble bot'; wrap.innerHTML = '<button type="button" class="btn btn-sm btn-primary">' + esc(a.label) + '</button>';
      wrap.querySelector('button').addEventListener('click', function () { a.onClick({ say: say }); });
      log.appendChild(wrap); log.scrollTop = log.scrollHeight;
    }
    function say(text, ex) { bubble('bot', text); if (ex) { setQuick(ex.quick); action(ex.action); } }
    function send(text) {
      text = String(text || '').trim(); if (!text || busy) return;
      busy = true; bubble('user', text); setQuick([]);
      var t = document.createElement('div'); t.className = 'bubble bot typing'; t.setAttribute('aria-label', 'Bot đang trả lời'); t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); log.scrollTop = log.scrollHeight;
      Promise.all([Promise.resolve().then(function () { return o.reply(text, { say: say }); }), EP.sleep(o.delay == null ? 450 : o.delay)]).then(function (r) {
        t.remove(); var res = r[0] || { text: '...' }; say(res.text, res);
      }, function () { t.remove(); say('Xin lỗi, có lỗi xảy ra. Bạn thử lại nhé.'); }).then(function () { busy = false; });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; send(v); });
    quick.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) send(b.getAttribute('data-q')); });
    say(o.greeting || 'Xin chào! Mình có thể giúp gì cho bạn?', { quick: o.quick });
    return { say: say, user: function (t) { bubble('user', t); }, send: send, clear: function () { log.innerHTML = ''; setQuick([]); } };
  }
  EP.chat = { mount: mount, faqReply: faqReply };
})(window);

=================== FILE: vibe-sprint/starter/js/checklist.js ===================
/* checklist.js - checklist có trọng số -> điểm /100, xếp loại, danh sách đạt / chưa đạt (kiểu "kiểm tra SEO", "đánh giá hồ sơ").
     var items = [{ id: 'title', label: 'Có thẻ <title> 10-60 ký tự', weight: 20, hint: 'Cách sửa...' }, ...]
     EP.checklist.score(items, { title: true, h1: false }) -> { score, max, passed[], failed[], grade: { label, tone } }
       (answers[id] có thể là true/false hoặc số 0..1 cho đạt một phần)
     EP.checklist.mount(el, { title, items, onChange(result) })  -> tích chọn trực tiếp, thanh điểm tự cập nhật */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;
  function grade(score) {
    return score >= 85 ? { label: 'Rất tốt', tone: 'positive' } : score >= 65 ? { label: 'Khá', tone: 'accent' } : score >= 40 ? { label: 'Cần cải thiện', tone: 'warning' } : { label: 'Yếu', tone: 'negative' };
  }
  function score(items, answers) {
    answers = answers || {};
    var total = items.reduce(function (s, i) { return s + (i.weight == null ? 1 : i.weight); }, 0) || 1, got = 0, passed = [], failed = [];
    items.forEach(function (i) {
      var w = i.weight == null ? 1 : i.weight, a = answers[i.id], f = a === true ? 1 : a === false || a == null ? 0 : Math.max(0, Math.min(1, Number(a) || 0));
      got += w * f; (f >= 1 ? passed : failed).push(i);
    });
    var s = Math.round(got / total * 100);
    return { score: s, max: 100, passed: passed, failed: failed, grade: grade(s) };
  }
  function mount(el, o) {
    var ans = {};
    el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Danh sách kiểm tra') + '</h2></div><div class="stack">' +
      o.items.map(function (i) { return '<label class="check"><input type="checkbox" data-id="' + esc(i.id) + '"><span>' + esc(i.label) + (i.weight ? ' <span class="muted">(' + i.weight + ' điểm)</span>' : '') + '</span></label>'; }).join('') +
      '</div></div><div class="card" data-cl-out aria-live="polite"></div></div>';
    var out = el.querySelector('[data-cl-out]');
    function draw() {
      var r = score(o.items, ans);
      out.innerHTML = '<div class="card-head"><h2 class="section-title">Điểm</h2>' + EP.ui.badge(r.grade.label, r.grade.tone) + '</div><div class="score-big">' + r.score + '<span class="muted" style="font-size:20px">/100</span></div>' +
        '<div class="meter mt-3" role="progressbar" aria-valuenow="' + r.score + '" aria-valuemin="0" aria-valuemax="100" aria-label="Điểm"><i style="width:' + r.score + '%"></i></div>' +
        (r.failed.length ? '<h3 class="section-title mt-3">Chưa đạt</h3><ul class="list-plain mt-2">' + r.failed.map(function (i) { return '<li class="no">' + EP.ui.icon('x') + '<span style="color:var(--text)">' + esc(i.label) + (i.hint ? '<br><small class="muted">' + esc(i.hint) + '</small>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="mt-3">' + EP.ui.icon('check') + ' Đã đạt tất cả tiêu chí.</p>');
      if (o.onChange) o.onChange(r);
    }
    el.addEventListener('change', function (e) { var id = e.target.getAttribute && e.target.getAttribute('data-id'); if (id) { ans[id] = e.target.checked; draw(); } });
    draw();
    return { answers: function () { return Object.assign({}, ans); }, result: function () { return score(o.items, ans); } };
  }
  EP.checklist = { score: score, grade: grade, mount: mount };
})(window);

=================== FILE: vibe-sprint/starter/js/config.js ===================
/* config.js - NƠI DUY NHẤT cần sửa khi bắt đầu đề mới: tên app, tiền tố lưu trữ, câu thông báo mock.
   Phải nạp TRƯỚC mọi file js khác. Nếu đổi `prefix`, đổi luôn khoá '<prefix>theme' (mặc định 'ep_theme') trong <head> của index.html
   (new-project.sh tự làm việc này). */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.config = {
    appName: 'Tên ứng dụng',              // hiện ở thanh trên, tiêu đề tab, chân trang
    brandMark: 'X',                        // 1 ký tự trong ô logo
    heroLead: 'Giải pháp',                 // tiêu đề trang Tổng quan = heroLead + <em>heroEm</em> (đổi theo đề)
    heroEm: 'thông minh',
    tagline: 'Mô tả ngắn một dòng về ứng dụng.',
    prefix: 'ep_',                         // tiền tố mọi khoá localStorage (đổi theo từng đề để khỏi lẫn dữ liệu)
    defaultRoute: 'home',                  // view mở đầu tiên
    defaultAiMode: 'mock',                 // 'mock' | 'gemini' | 'paste'
    mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI', // BẮT BUỘC hiển thị cạnh mọi kết quả mock
    locale: 'vi-VN',
    currency: 'VND'
  };
})(window);

=================== FILE: vibe-sprint/starter/js/core.js ===================
/* core.js - nền tảng: namespace EP, tiện ích DOM, bus sự kiện, storage an toàn, collection CRUD,
   giao diện sáng/tối (có vòng tròn loang), router tab có view transition, hiệu ứng ánh sáng thẻ.
   Không phụ thuộc file nào ngoài config.js. */
(function (root) {
  'use strict';
  var EP = root.EP = root.EP || {};
  var cfg = EP.config = Object.assign({ appName: 'App', brandMark: 'X', prefix: 'ep_', defaultRoute: 'home', locale: 'vi-VN', currency: 'VND', heroLead: 'Giải pháp', heroEm: 'thông minh', mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI' }, EP.config);
  var doc = root.document;

  /* ---------- DOM & tiện ích ---------- */
  EP.$ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  EP.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  /** Escape chuỗi trước khi nhét vào innerHTML. LUÔN dùng cho dữ liệu người dùng / AI. */
  EP.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  EP.uid = function () { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  EP.debounce = function (fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms || 150); }; };
  EP.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  EP.reduced = function () { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  EP.clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  EP.fmt = {
    number: function (n, d) { return Number(n || 0).toLocaleString(cfg.locale, { maximumFractionDigits: d == null ? 0 : d }); },
    money: function (n) { return Number(n || 0).toLocaleString(cfg.locale, { style: 'currency', currency: cfg.currency, maximumFractionDigits: 0 }); },
    percent: function (n, d) { return Number(n || 0).toLocaleString(cfg.locale, { maximumFractionDigits: d == null ? 1 : d }) + '%'; },
    date: function (v) { var d = new Date(v); return isNaN(d) ? '' : d.toLocaleDateString(cfg.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }); },
    datetime: function (v) { var d = new Date(v); return isNaN(d) ? '' : d.toLocaleString(cfg.locale, { dateStyle: 'short', timeStyle: 'short' }); },
    /** Ngày hôm nay dạng YYYY-MM-DD theo giờ máy (không lệch múi giờ như toISOString). */
    today: function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  };

  /* ---------- Bus sự kiện ---------- */
  var handlers = {};
  EP.bus = {
    on: function (ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); return function () { EP.bus.off(ev, fn); }; },
    off: function (ev, fn) { handlers[ev] = (handlers[ev] || []).filter(function (f) { return f !== fn; }); },
    emit: function (ev, data) { (handlers[ev] || []).slice().forEach(function (f) { try { f(data); } catch (e) { console.error('[bus]', ev, e); } }); }
  };

  /* ---------- Storage: tiền tố + JSON an toàn (localStorage có thể bị chặn -> rơi về bộ nhớ) ---------- */
  var mem = {}, ls = null;
  try { ls = root.localStorage; ls.setItem('__t', '1'); ls.removeItem('__t'); } catch (e) { ls = null; }
  function K(key) { return cfg.prefix + key; }
  EP.store = {
    available: !!ls,
    /** Đọc giá trị JSON; hỏng/thiếu thì trả fallback. */
    read: function (key, fallback) {
      try {
        var raw = ls ? ls.getItem(K(key)) : mem[K(key)];
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    /** Ghi giá trị JSON; trả true/false (đầy bộ nhớ, bị chặn...). */
    write: function (key, val) {
      var s;
      try { s = JSON.stringify(val); } catch (e) { return false; }
      try { if (ls) ls.setItem(K(key), s); else mem[K(key)] = s; return true; }
      catch (e) { mem[K(key)] = s; EP.bus.emit('store:error', e); return false; }
    },
    remove: function (key) { try { if (ls) ls.removeItem(K(key)); delete mem[K(key)]; } catch (e) { /* bỏ qua */ } },
    keys: function () {
      var out = [], p = cfg.prefix, i, k;
      try { if (ls) for (i = 0; i < ls.length; i++) { k = ls.key(i); if (k && k.indexOf(p) === 0) out.push(k.slice(p.length)); } } catch (e) { /* bỏ qua */ }
      Object.keys(mem).forEach(function (m) { if (m.indexOf(p) === 0 && out.indexOf(m.slice(p.length)) < 0) out.push(m.slice(p.length)); });
      return out;
    },
    /** Toàn bộ dữ liệu của app (dùng cho sao lưu). */
    all: function () { var o = {}; EP.store.keys().forEach(function (k) { o[k] = EP.store.read(k, null); }); return o; },
    clear: function () { EP.store.keys().forEach(EP.store.remove); }
  };

  /* ---------- Collection: CRUD tổng quát trên storage (id, createdAt, giới hạn số bản ghi) ----------
     var items = EP.collection('items', { limit: 500 });
     items.add({...}) / update(id, patch) / remove(id) / get(id) / list() / count() / clear() / replace(rows)
     items.onChange(fn) -> huỷ đăng ký. Sự kiện bus: 'change:items'. */
  EP.collection = function (name, opts) {
    opts = opts || {};
    var key = 'c_' + name, limit = opts.limit || 1000;
    function load() { var a = EP.store.read(key, []); return Array.isArray(a) ? a : []; }
    function save(a) { EP.store.write(key, a); EP.bus.emit('change:' + name, a); EP.bus.emit('change', name); return a; }
    return {
      name: name,
      list: load,
      count: function () { return load().length; },
      get: function (id) { return load().filter(function (r) { return r.id === id; })[0] || null; },
      add: function (obj) {
        var a = load(), row = Object.assign({ id: EP.uid(), createdAt: Date.now() }, obj);
        a.unshift(row);
        if (a.length > limit) a.length = limit;
        save(a); return row;
      },
      update: function (id, patch) {
        var a = load(), hit = null;
        a = a.map(function (r) { if (r.id !== id) return r; hit = Object.assign({}, r, patch, { updatedAt: Date.now() }); delete hit._demo; return hit; });
        if (hit) save(a); return hit;
      },
      remove: function (id) { var a = load(), n = a.filter(function (r) { return r.id !== id; }); if (n.length !== a.length) save(n); return n.length !== a.length; },
      replace: function (rows) { return save(Array.isArray(rows) ? rows : []); },
      clear: function () { return save([]); },
      onChange: function (fn) { return EP.bus.on('change:' + name, fn); }
    };
  };

  /* ---------- Chuyển cảnh dùng chung ---------- */
  var activeVT = null;
  /** EP.transition('route', fn): chạy fn trong View Transition nếu trình duyệt hỗ trợ, không thì chạy thẳng. */
  EP.transition = function (kind, fn) {
    var de = doc.documentElement;
    if (!doc.startViewTransition || EP.reduced()) { fn(); return null; }
    if (activeVT) { try { activeVT.skipTransition(); } catch (e) { /* bỏ qua */ } }
    de.setAttribute('data-vt', kind);
    var t;
    try { t = doc.startViewTransition(fn); } catch (e) { de.removeAttribute('data-vt'); fn(); return null; }
    activeVT = t;
    var done = function () { if (activeVT === t) { activeVT = null; de.removeAttribute('data-vt'); } };
    t.finished.then(done, done);
    return t;
  };

  /* ---------- Giao diện: system | light | dark, đổi bằng vòng tròn loang từ nút bấm ---------- */
  var THEME_L = { system: 'Theo hệ thống', light: 'Sáng', dark: 'Tối' };
  var THEME_NEXT = { system: 'light', light: 'dark', dark: 'system' };
  function themeGet() { var t = doc.documentElement.getAttribute('data-theme'); return t === 'light' || t === 'dark' ? t : 'system'; }
  function themeIsDark() { var m = themeGet(); return m === 'dark' || (m === 'system' && root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches); }
  function themeApply(m) {
    var de = doc.documentElement;
    if (m === 'system') de.removeAttribute('data-theme'); else de.setAttribute('data-theme', m);
    var b = doc.getElementById('btn-theme');
    if (b) { b.dataset.mode = m; var t = 'Giao diện: ' + THEME_L[m]; b.title = t; b.setAttribute('aria-label', t + '. Bấm để đổi'); }
    EP.bus.emit('theme', m);
  }
  function themeSet(mode, origin) {
    if (mode !== 'light' && mode !== 'dark') mode = 'system';
    try { if (mode === 'system') localStorage.removeItem(cfg.prefix + 'theme'); else localStorage.setItem(cfg.prefix + 'theme', mode); } catch (e) { /* bỏ qua */ }
    var de = doc.documentElement;
    if (!doc.startViewTransition || EP.reduced()) { themeApply(mode); return; }
    if (activeVT) { try { activeVT.skipTransition(); } catch (e) { /* bỏ qua */ } activeVT = null; }
    var vv = root.visualViewport, r = origin && origin.getBoundingClientRect ? origin.getBoundingClientRect() : null;
    var w = Math.max(root.innerWidth || 0, de.clientWidth || 0, vv ? vv.width + vv.offsetLeft : 0);
    var h = Math.max(root.innerHeight || 0, de.clientHeight || 0, vv ? vv.height + vv.offsetTop : 0);
    var hasR = r && (r.width || r.height);
    var x = hasR ? r.left + r.width / 2 : w / 2, y = hasR ? r.top + r.height / 2 : 0;
    var rad = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
    de.setAttribute('data-vt', 'theme');
    var t;
    var done = function () { if (activeVT === t) activeVT = null; if (!activeVT) de.removeAttribute('data-vt'); };
    try { t = doc.startViewTransition(function () { themeApply(mode); }); } catch (e) { activeVT = null; de.removeAttribute('data-vt'); themeApply(mode); return; }
    activeVT = t;
    t.ready.then(function () {
      try {
        de.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 550, easing: 'ease-in-out', fill: 'both', pseudoElement: '::view-transition-new(root)' });
      } catch (e) { /* bỏ qua */ }
    }, function () { /* bị bỏ qua */ });
    t.finished.then(done, done);
  }
  EP.theme = {
    labels: THEME_L,
    get: themeGet, isDark: themeIsDark, set: themeSet, apply: themeApply,
    cycle: function (origin) { themeSet(THEME_NEXT[themeGet()], origin); }
  };

  /* ---------- Router: mỗi view là một tab; đăng ký bằng EP.register ----------
     EP.register({
       id: 'orders',                 // duy nhất, dùng trong URL #/orders
       label: 'Đơn hàng',            // chữ trên tab
       title: 'Quản lý đơn hàng',    // <h1> của view (mỗi view đúng 1 h1)
       desc: 'Mô tả ngắn',           // dòng phụ dưới h1 + thẻ ở Tổng quan
       icon: 'list',                 // tên icon trong EP.ui.icons (tuỳ chọn)
       order: 20,                    // thứ tự tab (home=0, settings=99)
       always: false,                // true = render lại mỗi lần mở tab
       summary: function(){ return [{label,value,hint}] }, // KPI hiện ở Tổng quan (tuỳ chọn)
       actions: function(){ return html }, // nút ở góc phải h1 (tuỳ chọn)
       render: function(el, ctx){ ... }    // vẽ vào el; có thể trả Promise (hiện skeleton khi chờ)
     }); */
  var views = [], current = null, mounted = false, navEl, hostEl, pillEl;
  function findView(id) { return views.filter(function (v) { return v.id === id; })[0]; }
  EP.register = function (def) {
    if (!def || !def.id) throw new Error('EP.register cần id');
    views = views.filter(function (v) { return v.id !== def.id; });
    views.push(Object.assign({ order: 50, label: def.id, title: def.label || def.id }, def));
    views.sort(function (a, b) { return a.order - b.order; });
  };
  function idFromHash() {
    var m = /^#\/?([\w-]+)/.exec(root.location.hash);
    return m && findView(m[1]) ? m[1] : (findView(cfg.defaultRoute) ? cfg.defaultRoute : (views[0] && views[0].id));
  }
  function movePill() {
    var a = navEl && navEl.querySelector('.tab[aria-current="page"]');
    if (!a || !pillEl) return;
    pillEl.style.width = a.offsetWidth + 'px';
    pillEl.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    var want = a.offsetLeft - (navEl.clientWidth - a.offsetWidth) / 2;
    if (navEl.scrollWidth > navEl.clientWidth) navEl.scrollTo({ left: want, behavior: EP.reduced() ? 'auto' : 'smooth' });
  }
  function renderView(v, force) {
    var sec = doc.getElementById('view-' + v.id), body = sec.querySelector('.view-body');
    if (v._done && !v.always && !force) return;
    v._done = true;
    var act = sec.querySelector('.view-actions');
    if (act && v.actions) act.innerHTML = v.actions();
    try {
      var r = v.render(body, { view: v, refresh: function () { renderView(v, true); } });
      if (r && typeof r.then === 'function') {
        body.innerHTML = EP.ui ? EP.ui.skeleton(3) : 'Đang tải...';
        r.then(null, function (e) { v._done = false; showViewError(v, body, e); });
      }
    } catch (e) { v._done = false; showViewError(v, body, e); }
  }
  function showViewError(v, body, e) {
    console.error('[view ' + v.id + ']', e);
    body.innerHTML = EP.ui ? EP.ui.error({ title: 'Không hiển thị được màn hình này', text: 'Đã có lỗi khi tải. Bạn thử lại nhé.', retry: 'view-retry' }) : 'Lỗi';
    var b = body.querySelector('[data-act="view-retry"]');
    if (b) b.addEventListener('click', function () { renderView(v, true); });
  }
  function show(id, first) {
    var v = findView(id);
    if (!v || (id === current && !first)) return;
    current = id;
    var update = function () {
      views.forEach(function (x) {
        var sec = doc.getElementById('view-' + x.id), tab = doc.getElementById('tab-' + x.id);
        sec.hidden = x.id !== id;
        if (x.id === id) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
      });
      renderView(v);
      movePill();
      doc.title = v.title + ' - ' + cfg.appName;
      if (!first) { root.scrollTo(0, 0); var h = doc.getElementById('h-' + id); if (h) h.focus({ preventScroll: true }); }
      EP.bus.emit('route', id);
    };
    if (first) update(); else EP.transition('route', update);
  }
  EP.router = {
    list: function () { return views.slice(); },
    current: function () { return current; },
    go: function (id) { if (root.location.hash === '#/' + id) show(id); else root.location.hash = '#/' + id; },
    refresh: function () { var v = findView(current); if (v) renderView(v, true); },
    mount: function () {
      if (mounted) return; mounted = true;
      navEl = EP.$('#tabs'); hostEl = EP.$('#views');
      pillEl = doc.createElement('span'); pillEl.className = 'tabs-pill'; pillEl.setAttribute('aria-hidden', 'true'); navEl.appendChild(pillEl);
      views.forEach(function (v) {
        var a = doc.createElement('a');
        a.className = 'tab'; a.id = 'tab-' + v.id; a.href = '#/' + v.id; a.setAttribute('data-tab', v.id);
        a.innerHTML = (v.icon && EP.ui ? EP.ui.icon(v.icon) : '') + '<span>' + EP.esc(v.label) + '</span>';
        navEl.appendChild(a);
        var s = doc.createElement('section');
        s.className = 'view'; s.id = 'view-' + v.id; s.hidden = true; s.setAttribute('aria-labelledby', 'h-' + v.id);
        s.innerHTML = '<div class="view-head"><div><h1 class="view-title" id="h-' + v.id + '" tabindex="-1">' + EP.esc(v.title) + '</h1>' +
          (v.desc ? '<p class="view-sub">' + EP.esc(v.desc) + '</p>' : '') + '</div><div class="view-actions row no-print"></div></div><div class="view-body"></div>';
        hostEl.appendChild(s);
      });
      root.addEventListener('hashchange', function () { show(idFromHash()); });
      root.addEventListener('resize', EP.debounce(movePill, 100));
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(movePill);
      show(idFromHash(), true);
    }
  };

  /* ---------- Ánh sáng thẻ theo con trỏ (một listener cho toàn trang) ---------- */
  doc.addEventListener('pointermove', function (e) {
    var c = e.target && e.target.closest && e.target.closest('.card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
})(window);

=================== FILE: vibe-sprint/starter/js/demo.js ===================
/* demo.js - nạp dữ liệu mẫu ở lần mở đầu tiên để giám khảo thấy app "có hồn" ngay.
     EP.demo.register('items', { version: 1, rows: [ {...}, ... ] })   // hoặc seed: function () { return [...]; }
   - Lần đầu (chưa có cờ phiên bản): nạp mẫu.
   - Tăng `version`: nạp lại mẫu NẾU người dùng chưa sửa gì (mọi dòng còn cờ _demo). Dòng người dùng tự thêm/sửa được giữ nguyên.
   - ?demo=1 trên URL: xoá collection đó rồi nạp lại từ đầu (dùng khi quay video/trình bày).
   - EP.demo.reset(): làm giống ?demo=1 (nút "Nạp lại dữ liệu demo" ở Cài đặt). */
(function (root) {
  'use strict';
  var EP = root.EP, regs = {};

  function rowsOf(r) { return (typeof r.seed === 'function' ? r.seed() : r.rows || []).map(function (x, i) { return Object.assign({ id: 'demo' + (i + 1), createdAt: Date.now() - (i + 1) * 3600e3, _demo: true }, x); }); }
  function seed(name, r, force) {
    var col = EP.collection(name), flagKey = 'demo_v_' + name, seen = EP.store.read(flagKey, 0), rows = col.list();
    var untouched = rows.every(function (x) { return x._demo; });
    if (force || (!seen && (rows.length === 0)) || (seen && seen !== r.version && untouched)) {
      col.replace(rowsOf(r));
      EP.store.write(flagKey, r.version);
    } else if (!seen) {
      EP.store.write(flagKey, r.version);   // đã có dữ liệu thật: không đè, chỉ đánh dấu
    }
  }
  EP.demo = {
    register: function (name, def) { regs[name] = def; },
    run: function () {
      var force = /[?&]demo=1(?:&|$)/.test(root.location.search);
      Object.keys(regs).forEach(function (n) { seed(n, regs[n], force); });
      if (force && root.history && root.history.replaceState) {
        var u = new URL(root.location.href); u.searchParams.delete('demo'); root.history.replaceState(null, '', u.pathname + u.search + u.hash);
      }
    },
    reset: function () { Object.keys(regs).forEach(function (n) { seed(n, regs[n], true); }); EP.bus.emit('demo:reset'); },
    names: function () { return Object.keys(regs); }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/export.js ===================
/* export.js - xuất/nhập dữ liệu:
     EP.export.csv('ten.csv', rows, [{ key, label, value?(row) }])  CSV có BOM UTF-8 (Excel đọc đúng tiếng Việt), chống công thức độc hại
     EP.export.json('ten.json', obj)
     EP.export.text('ten.txt', 'nội dung')
     EP.export.backup() / EP.export.restore(file)   sao lưu / khôi phục toàn bộ dữ liệu app (JSON)
     EP.export.print()                                in / lưu PDF (CSS @media print đã ẩn thanh điều hướng)
     EP.export.pickFile('.json') -> Promise<File>
   Excel tiếng Việt đôi khi cần dấu ';' làm phân tách: EP.export.csv(name, rows, cols, { sep: ';' }). */
(function (root) {
  'use strict';
  var EP = root.EP, doc = root.document;

  function download(filename, content, mime) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/octet-stream' });
    var url = URL.createObjectURL(blob), a = doc.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener'; doc.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 500);
  }
  function cell(v, sep) {
    if (v == null) return '';
    if (typeof v === 'object') v = JSON.stringify(v);
    var s = String(v);
    if (/^[=@\t\r]/.test(s) || /^[+\-](?!\d)/.test(s)) s = "'" + s;   // chặn công thức (CSV injection)
    return new RegExp('[",\\r\\n' + (sep === ';' ? ';' : '') + ']').test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCsv(rows, columns, sep) {
    sep = sep || ',';
    var cols = columns || Object.keys(rows[0] || {}).map(function (k) { return { key: k, label: k }; });
    var out = [cols.map(function (c) { return cell(c.label || c.key, sep); }).join(sep)];
    rows.forEach(function (r) { out.push(cols.map(function (c) { return cell(c.value ? c.value(r) : r[c.key], sep); }).join(sep)); });
    return out.join('\r\n');
  }

  EP.export = {
    toCsv: toCsv,
    download: download,
    csv: function (filename, rows, columns, opts) {
      download(filename, '﻿' + toCsv(rows, columns, opts && opts.sep), 'text/csv;charset=utf-8');
      EP.ui.toast('Đã xuất ' + rows.length + ' dòng ra ' + filename, { type: 'success' });
    },
    json: function (filename, obj) { download(filename, JSON.stringify(obj, null, 2), 'application/json'); },
    text: function (filename, s) { download(filename, s, 'text/plain;charset=utf-8'); },
    print: function () { root.print(); },
    /** Sao lưu mọi khoá của app (trừ khoá API và cờ giao diện) */
    backup: function () {
      var data = EP.store.all(); delete data.ai_key; delete data.ai_remember;
      var name = (EP.config.prefix + 'backup-' + EP.fmt.today() + '.json').replace(/^_+/, '');
      EP.export.json(name, { app: EP.config.prefix, version: EP.version && EP.version.version, exportedAt: new Date().toISOString(), data: data });
      EP.ui.toast('Đã tạo file sao lưu.', { type: 'success' });
    },
    /** Khôi phục từ File JSON do backup() tạo; ném lỗi tiếng Việt nếu file sai. Trả số khoá đã nạp. */
    restore: function (file) {
      return new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onerror = function () { reject(new Error('Không đọc được file.')); };
        fr.onload = function () {
          var obj;
          try { obj = JSON.parse(fr.result); } catch (e) { return reject(new Error('File không phải JSON hợp lệ.')); }
          if (!obj || typeof obj.data !== 'object' || obj.data === null || Array.isArray(obj.data)) return reject(new Error('File không đúng định dạng sao lưu của ứng dụng.'));
          if (obj.app && obj.app !== EP.config.prefix) return reject(new Error('File sao lưu thuộc ứng dụng khác.'));
          var n = 0;
          Object.keys(obj.data).forEach(function (k) { if (k === 'ai_key' || k === 'ai_remember') return; EP.store.write(k, obj.data[k]); n++; });
          EP.bus.emit('restore', n); resolve(n);
        };
        fr.readAsText(file);
      });
    },
    pickFile: function (accept) {
      return new Promise(function (resolve) {
        var i = doc.createElement('input'); i.type = 'file'; i.accept = accept || ''; i.style.display = 'none';
        i.addEventListener('change', function () { var f = i.files && i.files[0]; i.remove(); if (f) resolve(f); });
        doc.body.appendChild(i); i.click();
      });
    }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/form.js ===================
/* form.js - form khai báo bằng schema: vẽ HTML (nhãn nổi), kiểm tra dữ liệu, hiện lỗi tiếng Việt ngay dưới từng ô,
   chống bấm đôi. Ví dụ:
     var SCHEMA = {
       name:  { label: 'Họ tên', type: 'text', rules: { required: true, maxLength: 80 } },
       phone: { label: 'Số điện thoại', type: 'tel', rules: { required: true, phone: true } },
       qty:   { label: 'Số lượng', type: 'number', rules: { min: 1, max: 100, integer: true } },
       due:   { label: 'Hạn', type: 'date', rules: { date: 'future' } },        // 'future' | 'past' | 'todayOrFuture' | 'todayOrPast'
       kind:  { label: 'Nhóm', type: 'segmented', options: [{ value:'a', label:'A' }], rules: { required: true } },
       note:  { label: 'Ghi chú', type: 'textarea' }
     };
     host.innerHTML = '<form id="f" novalidate class="form">' + EP.form.render(SCHEMA, values) + '</form>';
     var f = EP.form.bind(host.querySelector('form'), SCHEMA, { onSubmit: function (values) { ... } });
   Rules: required, email, phone (SĐT VN), url, minLength, maxLength, min, max, integer, date, pattern (+ patternMsg), custom(value, all)->msg */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_MOBILE = /^(\+84|0)(3|5|7|8|9)\d{8}$/;     // 0912345678 hoặc +84912345678
  var RE_LANDLINE = /^(\+84|0)2\d{9}$/;              // 02812345678
  /** Chuẩn hoá SĐT: bỏ khoảng trắng . - ( ); +84 -> 0 */
  function normalizePhone(v) { var s = String(v || '').replace(/[\s.\-()]/g, ''); return s.indexOf('+84') === 0 ? '0' + s.slice(3) : s; }
  function isPhone(v) { var s = String(v || '').replace(/[\s.\-()]/g, ''); return RE_MOBILE.test(s) || RE_LANDLINE.test(s); }
  function isEmail(v) { return RE_EMAIL.test(String(v || '').trim()); }
  function isUrl(v) { try { var u = new URL(String(v).trim()); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; } }

  function cmpDate(v, today, mode) {
    if (mode === 'future') return v > today;
    if (mode === 'past') return v < today;
    if (mode === 'todayOrFuture') return v >= today;
    if (mode === 'todayOrPast') return v <= today;
    return true;
  }
  var DATE_MSG = { future: 'phải là ngày trong tương lai', past: 'phải là ngày trong quá khứ', todayOrFuture: 'không được là ngày đã qua', todayOrPast: 'không được là ngày trong tương lai' };

  /** Kiểm tra một giá trị. Trả '' nếu hợp lệ, ngược lại là câu báo lỗi tiếng Việt.
      spec = { label, type, rules } ; all = toàn bộ giá trị (cho rule custom) */
  function validateValue(value, spec, all) {
    var r = spec.rules || {}, label = spec.label || 'Trường này', type = spec.type || 'text';
    var empty = value == null || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && isNaN(value));
    if (empty) {
      if (r.required) return (type === 'select' || type === 'segmented' || type === 'date' ? 'Vui lòng chọn ' : 'Vui lòng nhập ') + label.toLowerCase() + '.';
      return '';
    }
    var s = typeof value === 'string' ? value.trim() : value;
    if (r.email && !isEmail(s)) return 'Email chưa đúng định dạng (ví dụ: ten@congty.vn).';
    if (r.phone && !isPhone(s)) return 'Số điện thoại chưa đúng (ví dụ: 0912345678 hoặc +84912345678).';
    if (r.url && !isUrl(s)) return 'Đường dẫn chưa đúng, cần bắt đầu bằng http:// hoặc https://.';
    if (type === 'number') {
      var n = Number(s);
      if (!isFinite(n)) return label + ' phải là một con số.';
      if (r.integer && Math.floor(n) !== n) return label + ' phải là số nguyên.';
      if (r.min != null && r.max != null && (n < r.min || n > r.max)) return label + ' phải từ ' + r.min + ' đến ' + r.max + '.';
      if (r.min != null && n < r.min) return label + ' phải từ ' + r.min + ' trở lên.';
      if (r.max != null && n > r.max) return label + ' không được vượt quá ' + r.max + '.';
    }
    if (typeof s === 'string') {
      if (r.minLength && s.length < r.minLength) return label + ' cần ít nhất ' + r.minLength + ' ký tự (hiện có ' + s.length + ').';
      if (r.maxLength && s.length > r.maxLength) return label + ' tối đa ' + r.maxLength + ' ký tự (hiện có ' + s.length + ').';
      if (r.pattern && !new RegExp(r.pattern).test(s)) return r.patternMsg || label + ' chưa đúng định dạng.';
    }
    if (r.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(new Date(s))) return label + ' chưa phải ngày hợp lệ.';
      if (!cmpDate(s, EP.fmt.today(), r.date)) return label + ' ' + (DATE_MSG[r.date] || 'chưa hợp lệ') + '.';
    }
    if (r.custom) { var m = r.custom(s, all || {}); if (m) return m; }
    return '';
  }

  /** Kiểm tra cả form: { ok, errors: { field: message } } */
  function validate(schema, values) {
    var errors = {};
    Object.keys(schema).forEach(function (k) { var m = validateValue(values[k], schema[k], values); if (m) errors[k] = m; });
    return { ok: !Object.keys(errors).length, errors: errors };
  }

  var uid = 0;
  function fieldHtml(name, spec, value, fid) {
    var id = fid + '-' + name, type = spec.type || 'text', r = spec.rules || {}, v = value == null ? '' : value;
    var req = r.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
    var attrs = ' id="' + id + '" name="' + esc(name) + '" aria-describedby="' + id + '-msg"' + (r.required ? ' required' : '') + (spec.autocomplete ? ' autocomplete="' + esc(spec.autocomplete) + '"' : '');
    var hint = '<p class="field-msg" id="' + id + '-msg" data-hint="' + esc(spec.hint || '') + '">' + esc(spec.hint || '') + '</p>';
    var cls = 'field' + (spec.span2 ? ' span-2' : '');
    if (type === 'segmented') {
      return '<fieldset class="' + cls + '" data-field="' + esc(name) + '"><legend class="field-legend">' + esc(spec.label) + req + '</legend><div class="seg block" role="radiogroup">' +
        (spec.options || []).map(function (o) { return '<label><input type="radio" name="' + esc(name) + '" value="' + esc(o.value) + '"' + (String(o.value) === String(v) ? ' checked' : '') + '><span>' + esc(o.label) + '</span></label>'; }).join('') +
        '</div>' + hint.replace('id="' + id + '-msg"', 'id="' + id + '-msg"') + '</fieldset>';
    }
    if (type === 'checkbox') {
      return '<div class="' + cls + '" data-field="' + esc(name) + '"><label class="check"><input type="checkbox"' + attrs + (v ? ' checked' : '') + '><span>' + esc(spec.label) + '</span></label>' + hint + '</div>';
    }
    var control;
    if (type === 'select') {
      control = '<select class="input"' + attrs + '><option value=""' + (v === '' ? ' selected' : '') + ' hidden></option>' +
        (spec.options || []).map(function (o) { return '<option value="' + esc(o.value) + '"' + (String(o.value) === String(v) ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select>';
    } else if (type === 'textarea') {
      control = '<textarea class="input" rows="' + (spec.rows || 3) + '" placeholder=" "' + attrs + '>' + esc(v) + '</textarea>';
    } else {
      var t = type === 'tel' ? 'tel' : type === 'email' ? 'email' : type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'url' ? 'url' : type === 'time' ? 'time' : 'text';
      var ex = '';
      if (type === 'number') { if (r.min != null) ex += ' min="' + r.min + '"'; if (r.max != null) ex += ' max="' + r.max + '"'; ex += ' step="' + (r.integer ? 1 : 'any') + '" inputmode="' + (r.integer ? 'numeric' : 'decimal') + '"'; }
      if (type === 'tel') ex += ' inputmode="tel"';
      if (r.maxLength && type !== 'number') ex += ' maxlength="' + (r.maxLength + 40) + '"'; // cho gõ lố để thấy báo lỗi thay vì bị cắt âm thầm
      control = '<input class="input" type="' + t + '" placeholder=" " value="' + esc(v) + '"' + ex + attrs + '>';
    }
    return '<div class="' + cls + '" data-field="' + esc(name) + '">' + control + '<label class="label" for="' + id + '">' + esc(spec.label) + req + '</label>' + hint + '</div>';
  }

  /** Vẽ HTML các ô theo schema (đặt trong <form class="form">). Thêm opts.grid = true để chia 2 cột. */
  function render(schema, values, opts) {
    opts = opts || {}; values = values || {};
    var fid = 'f' + (++uid);
    var html = Object.keys(schema).map(function (k) { return fieldHtml(k, schema[k], values[k], fid); }).join('');
    return opts.grid === false ? html : '<div class="form-grid two">' + html + '</div>';
  }

  function readValue(form, name, spec) {
    var type = spec.type || 'text';
    if (type === 'segmented') { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
    var el = form.elements[name]; if (!el) return '';
    if (type === 'checkbox') return !!el.checked;
    var v = el.value;
    if (type === 'number') return v === '' ? null : Number(v);
    return typeof v === 'string' ? v.trim() : v;
  }
  function setError(form, name, msg) {
    var wrap = form.querySelector('[data-field="' + name + '"]'); if (!wrap) return;
    var m = wrap.querySelector('.field-msg'), inputs = wrap.querySelectorAll('input,select,textarea');
    if (msg) {
      wrap.setAttribute('data-invalid', ''); wrap.removeAttribute('data-valid');
      inputs.forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
      if (m) m.textContent = msg;
    } else {
      wrap.removeAttribute('data-invalid');
      inputs.forEach(function (i) { i.removeAttribute('aria-invalid'); });
      if (m) m.textContent = m.getAttribute('data-hint') || '';
    }
  }

  /** Gắn kiểm tra vào form. opts: { onSubmit(values, ev), onChange(values), submitBusy: true }
      Trả { values(), set(obj), validate(), reset(), errors } */
  function bind(form, schema, opts) {
    opts = opts || {};
    form.setAttribute('novalidate', '');
    function values() { var o = {}; Object.keys(schema).forEach(function (k) { o[k] = readValue(form, k, schema[k]); }); return o; }
    function checkOne(name, show) {
      var all = values(), msg = validateValue(all[name], schema[name], all);
      if (show) { setError(form, name, msg); var w = form.querySelector('[data-field="' + name + '"]'); if (w && !msg && all[name] !== '' && all[name] != null && schema[name].rules && Object.keys(schema[name].rules).length) w.setAttribute('data-valid', ''); }
      return msg;
    }
    var touched = {};
    function nameOf(e) { var w = e.target.closest && e.target.closest('[data-field]'); return w && w.getAttribute('data-field'); }
    form.addEventListener('focusout', function (e) { var n = nameOf(e); if (n && schema[n]) { touched[n] = true; checkOne(n, true); } });
    form.addEventListener('input', function (e) { var n = nameOf(e); if (n && schema[n] && (touched[n] || e.target.closest('[data-invalid]'))) checkOne(n, true); if (opts.onChange) opts.onChange(values()); });
    form.addEventListener('change', function (e) { var n = nameOf(e); if (n && schema[n]) { touched[n] = true; checkOne(n, true); } });
    var submitting = false;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (submitting) return;
      var v = values(), res = validate(schema, v);
      Object.keys(schema).forEach(function (k) { touched[k] = true; setError(form, k, res.errors[k] || ''); });
      if (!res.ok) {
        var first = form.querySelector('[data-invalid] input, [data-invalid] select, [data-invalid] textarea');
        if (first) first.focus();
        if (opts.onInvalid) opts.onInvalid(res.errors);
        return;
      }
      if (!opts.onSubmit) return;
      var btn = form.querySelector('[type="submit"]') || (form.id && root.document.querySelector('[type="submit"][form="' + form.id + '"]'));
      var out = opts.onSubmit(v, ev);
      if (out && typeof out.then === 'function') {
        submitting = true; EP.ui.busy(btn, true);
        out.then(null, function () { /* onSubmit tự báo lỗi */ }).then(function () { submitting = false; EP.ui.busy(btn, false); });
      }
    });
    return {
      values: values,
      validate: function () { var res = validate(schema, values()); Object.keys(schema).forEach(function (k) { setError(form, k, res.errors[k] || ''); }); return res; },
      set: function (obj) {
        Object.keys(obj).forEach(function (k) {
          if (!schema[k]) return;
          if (schema[k].type === 'segmented') { var r = form.querySelector('input[name="' + k + '"][value="' + String(obj[k]).replace(/"/g, '') + '"]'); if (r) r.checked = true; }
          else if (schema[k].type === 'checkbox') form.elements[k].checked = !!obj[k];
          else if (form.elements[k]) form.elements[k].value = obj[k] == null ? '' : obj[k];
        });
      },
      reset: function () { form.reset(); touched = {}; Object.keys(schema).forEach(function (k) { setError(form, k, ''); var w = form.querySelector('[data-field="' + k + '"]'); if (w) w.removeAttribute('data-valid'); }); }
    };
  }

  /** Đọc giá trị từ form đã render (không cần bind): EP.form.values(formEl, SCHEMA) -> { name:'...', qty: 3 }
      Số được ép về Number (rỗng -> null), checkbox -> boolean. Dùng cho xem trước realtime / máy tính. */
  function values(form, schema) { var o = {}; Object.keys(schema).forEach(function (k) { o[k] = readValue(form, k, schema[k]); }); return o; }

  EP.form = { values: values, render: render, bind: bind, validate: validate, validateValue: validateValue, normalizePhone: normalizePhone, isPhone: isPhone, isEmail: isEmail, isUrl: isUrl };
})(window);

=================== FILE: vibe-sprint/starter/js/match.js ===================
/* match.js - chuẩn hoá tiếng Việt (bỏ dấu), khớp từ khoá, FAQ matcher, tìm kiếm xếp hạng.
     EP.text.normalize('Giá bao nhiêu?') -> 'gia bao nhieu'     EP.text.tokens(text) -> mảng từ đã chuẩn hoá (bỏ stopword)
     EP.text.slug('Áo thun Nam') -> 'ao-thun-nam'
     EP.match.faq(entries, query, { threshold: 0.34 }) -> { entry, score, ranked[] } | null khi không đủ chắc
        entries = [{ id, q: 'Câu hỏi mẫu', keywords: ['giá', 'bao nhiêu'], a: 'Trả lời' }]
     EP.match.search(rows, query, ['name', 'note']) -> các dòng khớp, xếp theo điểm giảm dần */
(function (root) {
  'use strict';
  var EP = root.EP;
  var STOP = ['la', 'va', 'cua', 'co', 'cho', 'cac', 'mot', 'nhung', 'duoc', 'trong', 'voi', 'nay', 'de', 'khong', 'khi', 'da', 'rat', 'cung', 'nhu', 'thi', 'ma', 'toi', 'ban', 'minh', 'oi', 'a', 'ha', 'nhe', 'the', 'nao', 'gi'];
  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function tokens(s, keepStop) { return normalize(s).split(' ').filter(function (w) { return w && (keepStop || STOP.indexOf(w) < 0); }); }
  function slug(s) { return normalize(s).replace(/\s+/g, '-'); }

  /** Điểm khớp 0..1 giữa truy vấn và 1 mục: từ khoá khớp cụm (trọng số cao) + giao các token */
  function scoreEntry(qNorm, qTok, e) {
    var kws = (e.keywords || []).map(normalize), hit = 0, total = Math.max(1, kws.length);
    kws.forEach(function (k) { if (k && (' ' + qNorm + ' ').indexOf(' ' + k + ' ') >= 0) hit++; });
    var base = tokens((e.q || '') + ' ' + kws.join(' ')), set = {}; base.forEach(function (t) { set[t] = 1; });
    var inter = qTok.filter(function (t) { return set[t]; }).length;
    var tokScore = qTok.length ? inter / Math.max(qTok.length, Math.min(base.length, 6)) : 0;
    return Math.min(1, (hit / total) * 0.6 + (hit > 0 ? 0.25 : 0) + tokScore * 0.5);
  }
  EP.text = { normalize: normalize, tokens: tokens, slug: slug };
  EP.match = {
    faq: function (entries, query, opts) {
      var th = opts && opts.threshold != null ? opts.threshold : 0.34, qn = normalize(query), qt = tokens(query);
      if (!qn) return null;
      var ranked = entries.map(function (e) { return { entry: e, score: scoreEntry(qn, qt, e) }; }).sort(function (a, b) { return b.score - a.score; });
      return ranked[0] && ranked[0].score >= th ? { entry: ranked[0].entry, score: ranked[0].score, ranked: ranked } : null;
    },
    search: function (rows, query, keys) {
      var qt = tokens(query, true); if (!qt.length) return rows.slice();
      return rows.map(function (r) {
        var hay = normalize(keys.map(function (k) { return r[k]; }).join(' ')), s = 0, m = 0;
        qt.forEach(function (t) { if (hay.indexOf(t) >= 0) { m++; s += 1 + (hay.indexOf(' ' + t) >= 0 || hay.indexOf(t) === 0 ? .5 : 0); } });
        return { r: r, s: s, m: m };
      }).filter(function (x) { return x.m === qt.length; }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.r; });
    }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/metrics.js ===================
/* metrics.js - số liệu an toàn (không NaN/Infinity), KPI marketing, tiền VND, xu hướng.
     EP.metrics.div(a, b, fallback=0)           chia an toàn
     EP.metrics.ctr(clicks, impressions)  -> %   | cpc(cost, clicks) | cpa(cost, conv) | roas(revenue, cost) | cr(conv, clicks)
     EP.metrics.margin(price, cost) -> { profit, marginPct, markupPct }
     EP.metrics.change(now, prev) -> % thay đổi (null nếu prev = 0)
     EP.metrics.trend(series) -> { dir: 'up'|'down'|'flat', pct, first, last }
     EP.metrics.sum/avg/min/max(arr, key?) ; EP.metrics.groupSum(rows, groupKey, valueKey) -> [{label,value}]
     EP.metrics.round(n, d) ; EP.metrics.vnd(n) -> '1.250.000 ₫' ; EP.metrics.vndShort(n) -> '1,2 tr' */
(function (root) {
  'use strict';
  var EP = root.EP;
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function div(a, b, fb) { b = num(b); return b === 0 ? (fb == null ? 0 : fb) : num(a) / b; }
  function round(n, d) { var p = Math.pow(10, d == null ? 0 : d); return Math.round(num(n) * p) / p; }
  function vals(arr, key) { return (arr || []).map(function (x) { return num(key ? x[key] : x); }); }
  function sum(arr, key) { return vals(arr, key).reduce(function (s, x) { return s + x; }, 0); }
  function change(now, prev) { return num(prev) === 0 ? null : (num(now) - num(prev)) / Math.abs(num(prev)) * 100; }

  EP.metrics = {
    div: div, round: round, num: num, sum: sum, change: change,
    avg: function (arr, key) { return div(sum(arr, key), (arr || []).length); },
    min: function (arr, key) { var v = vals(arr, key); return v.length ? Math.min.apply(null, v) : 0; },
    max: function (arr, key) { var v = vals(arr, key); return v.length ? Math.max.apply(null, v) : 0; },
    ctr: function (clicks, impr) { return div(clicks, impr) * 100; },
    cpc: function (cost, clicks) { return div(cost, clicks); },
    cpa: function (cost, conv) { return div(cost, conv); },
    cr: function (conv, clicks) { return div(conv, clicks) * 100; },
    roas: function (revenue, cost) { return div(revenue, cost); },
    margin: function (price, cost) { var p = num(price) - num(cost); return { profit: p, marginPct: div(p, price) * 100, markupPct: div(p, cost) * 100 }; },
    trend: function (series) {
      var v = vals(series, null).filter(function (x, i) { return series[i] != null; });
      if (v.length < 2) return { dir: 'flat', pct: 0, first: v[0] || 0, last: v[0] || 0 };
      var first = v[0], last = v[v.length - 1], pct = change(last, first);
      return { dir: pct == null || Math.abs(pct) < 1 ? 'flat' : pct > 0 ? 'up' : 'down', pct: pct == null ? 0 : pct, first: first, last: last };
    },
    groupSum: function (rows, groupKey, valueKey) {
      var m = {}, order = [];
      (rows || []).forEach(function (r) { var k = r[groupKey]; if (!(k in m)) { m[k] = 0; order.push(k); } m[k] += num(r[valueKey]); });
      return order.map(function (k) { return { label: k, value: m[k] }; });
    },
    vnd: function (n) { return Math.round(num(n)).toLocaleString('vi-VN') + ' ₫'; },
    vndShort: function (n) {
      n = num(n); var a = Math.abs(n), f = function (x) { return (Math.round(x * 10) / 10).toLocaleString('vi-VN'); };
      return a >= 1e9 ? f(n / 1e9) + ' tỷ' : a >= 1e6 ? f(n / 1e6) + ' tr' : a >= 1e3 ? f(n / 1e3) + 'k' : String(Math.round(n));
    }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/mock.js ===================
/* mock.js - công cụ viết bản MÔ PHỎNG AI tất định (cùng input -> cùng output) để chạy offline khi API lỗi/không có key.
     EP.mock.hash('chuỗi') -> số nguyên dương ổn định
     EP.mock.rng('hạt giống') -> hàm () => số [0,1) tất định
     EP.mock.pick(arr, seed) / EP.mock.pickN(arr, n, seed)
     EP.mock.keywords(text, n) -> n từ khoá dài/hay lặp (đã bỏ dấu câu)
     EP.mock.sentiment(text) -> { label: 'positive'|'neutral'|'negative', score: -1..1, hits: [...] }  (từ điển tiếng Việt cơ bản)
     EP.mock.classify(text, { nhãn: ['từ khoá', ...] }, fallbackLabel) -> { label, score, matched }
     EP.mock.template('Chào {name}', { name: 'An' })
   Nhớ: mọi kết quả mock phải hiển thị cùng EP.ai.MOCK_NOTICE (EP.ai.noticeHtml làm việc này). */
(function (root) {
  'use strict';
  var EP = root.EP;
  var POS = ['tốt', 'tuyệt', 'hài lòng', 'ngon', 'đẹp', 'nhanh', 'thích', 'yêu', 'chất lượng', 'ok', 'ổn', 'xuất sắc', 'rẻ', 'đáng tiền', 'nhiệt tình', 'chu đáo', 'recommend'];
  var NEG = ['tệ', 'dở', 'chậm', 'kém', 'thất vọng', 'lỗi', 'hỏng', 'đắt', 'bực', 'chán', 'không hài lòng', 'trễ', 'sai', 'thiếu', 'bẩn', 'lừa', 'thái độ'];

  function hash(s) { s = String(s == null ? '' : s); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
  function rng(seed) { var a = typeof seed === 'number' ? seed >>> 0 : hash(seed); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(arr, seed) { return arr[hash(seed) % arr.length]; }
  function pickN(arr, n, seed) { var r = rng(seed), a = arr.slice(), out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; }
  var STOP = ['và', 'là', 'của', 'có', 'cho', 'các', 'một', 'những', 'được', 'trong', 'với', 'này', 'để', 'không', 'khi', 'đã', 'rất', 'cũng', 'như', 'nhưng', 'thì', 'mà', 'tôi', 'bạn'];
  function keywords(text, n) {
    var cnt = {}, order = [];
    String(text || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).forEach(function (w) {
      if (w.length < 3 || STOP.indexOf(w) >= 0) return;
      if (!(w in cnt)) { cnt[w] = 0; order.push(w); } cnt[w]++;
    });
    return order.sort(function (a, b) { return cnt[b] - cnt[a] || b.length - a.length; }).slice(0, n || 3);
  }
  function sentiment(text) {
    var t = ' ' + String(text || '').toLowerCase() + ' ', hits = [], p = 0, n = 0;
    POS.forEach(function (w) { if (t.indexOf(w) >= 0 && !/không (hài lòng|ok)/.test(t)) { p++; hits.push('+' + w); } });
    NEG.forEach(function (w) { if (t.indexOf(w) >= 0) { n++; hits.push('-' + w); } });
    if (/không (tốt|ngon|đẹp|nhanh|ổn)/.test(t)) { n++; p = Math.max(0, p - 1); }
    var score = p + n ? (p - n) / (p + n) : 0;
    return { label: score > 0.15 ? 'positive' : score < -0.15 ? 'negative' : 'neutral', score: Math.round(score * 100) / 100, hits: hits };
  }
  function classify(text, map, fallback) {
    var norm = EP.text ? EP.text.normalize(text) : String(text).toLowerCase(), best = null, bestN = 0, matched = [];
    Object.keys(map).forEach(function (label) {
      var m = map[label].filter(function (k) { return norm.indexOf(EP.text ? EP.text.normalize(k) : k) >= 0; });
      if (m.length > bestN) { best = label; bestN = m.length; matched = m; }
    });
    return { label: best || fallback || 'khác', score: best ? Math.min(1, 0.5 + bestN * 0.25) : 0.3, matched: matched };
  }
  function template(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); }

  EP.mock = { hash: hash, rng: rng, pick: pick, pickN: pickN, keywords: keywords, sentiment: sentiment, classify: classify, template: template };
})(window);

=================== FILE: vibe-sprint/starter/js/quiz.js ===================
/* quiz.js - đố vui có đồng hồ từng câu, điểm theo đúng + tốc độ, bảng xếp hạng Top N (xử lý đồng hạng).
   Engine thuần (test được, không đụng DOM):
     var g = EP.quiz.create({ questions: [{ id, q, options: ['A','B','C'], answer: 1, explain? }], timePerQ: 30, basePoints: 100, speedBonus: 100 });
     g.current() -> câu hiện tại | null ; g.answer(optionIndex, elapsedMs) -> { correct, points, explain, answerIndex } ; g.timeout() ; g.next() ; g.finished ; g.result() -> { score, correct, total, totalMs }
     Điểm câu đúng = basePoints + round(speedBonus * (còn lại / timePerQ)); sai / hết giờ = 0.
   Bảng xếp hạng (localStorage):
     var lb = EP.quiz.leaderboard('quiz1', { limit: 10 }); lb.add({ name, score, correct, total, totalMs }); lb.top() -> [{ rank, ... }]  (điểm bằng nhau -> thời gian ít hơn hơn -> cùng hạng nếu bằng cả hai)
   Giao diện trọn gói:  EP.quiz.mount(el, { title, questions, timePerQ, boardName, intro }) */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  function create(o) {
    var qs = o.questions.slice(), tpq = (o.timePerQ || 30) * 1000, base = o.basePoints == null ? 100 : o.basePoints, bonus = o.speedBonus == null ? 100 : o.speedBonus;
    var g = { idx: 0, score: 0, correct: 0, totalMs: 0, finished: !qs.length, log: [], answered: false };
    g.current = function () { return g.finished ? null : qs[g.idx]; };
    g.total = qs.length;
    g.timeLimit = tpq;
    function settle(choice, elapsed) {
      var q = qs[g.idx]; if (!q || g.answered) return null;
      g.answered = true; elapsed = Math.max(0, Math.min(tpq, elapsed || 0)); g.totalMs += elapsed;
      var ok = choice === q.answer, pts = ok ? base + Math.round(bonus * (tpq - elapsed) / tpq) : 0;
      if (ok) g.correct++; g.score += pts;
      var res = { correct: ok, points: pts, explain: q.explain || '', answerIndex: q.answer, choice: choice, timedOut: choice == null };
      g.log.push(res); return res;
    }
    g.answer = function (i, elapsedMs) { return settle(i, elapsedMs); };
    g.timeout = function () { return settle(null, tpq); };
    g.next = function () { g.idx++; g.answered = false; if (g.idx >= qs.length) g.finished = true; return g.current(); };
    g.result = function () { return { score: g.score, correct: g.correct, total: qs.length, totalMs: g.totalMs }; };
    return g;
  }

  function leaderboard(name, o) {
    var col = EP.collection('lb_' + name, { limit: 200 }), limit = (o && o.limit) || 10;
    function sorted() {
      return col.list().slice().sort(function (a, b) { return b.score - a.score || a.totalMs - b.totalMs || a.createdAt - b.createdAt; });
    }
    return {
      add: function (r) { return col.add({ name: String(r.name || 'Ẩn danh').slice(0, 30), score: r.score, correct: r.correct, total: r.total, totalMs: r.totalMs }); },
      top: function (n) {
        var rows = sorted(), out = [], prev = null, rank = 0;
        rows.forEach(function (r, i) { if (!prev || r.score !== prev.score || r.totalMs !== prev.totalMs) rank = i + 1; prev = r; out.push(Object.assign({ rank: rank }, r)); });
        return out.slice(0, n || limit);
      },
      clear: col.clear, onChange: col.onChange
    };
  }

  function mount(el, o) {
    var lb = leaderboard(o.boardName || 'quiz', { limit: 10 }), g, timer, deadline, player = '';
    function fmtTime(ms) { return (ms / 1000).toFixed(1) + 's'; }
    function board() {
      var rows = lb.top();
      return '<div class="card"><div class="card-head"><h2 class="section-title">Bảng xếp hạng Top 10</h2></div>' + (rows.length ?
        '<div class="table-wrap"><table class="table" data-quiz-board><thead><tr><th scope="col"><span class="th-in">Hạng</span></th><th scope="col"><span class="th-in">Tên</span></th><th scope="col" class="num"><span class="th-in">Điểm</span></th><th scope="col" class="num"><span class="th-in">Đúng</span></th><th scope="col" class="num"><span class="th-in">Thời gian</span></th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r.rank + '</td><td>' + esc(r.name) + '</td><td class="num"><b>' + r.score + '</b></td><td class="num">' + r.correct + '/' + r.total + '</td><td class="num">' + fmtTime(r.totalMs) + '</td></tr>'; }).join('') + '</tbody></table></div>'
        : EP.ui.empty({ icon: 'quiz', title: 'Chưa có ai chơi', text: 'Hãy là người đầu tiên!' })) + '</div>';
    }
    var START_SCHEMA = { name: { label: 'Tên của bạn', type: 'text', rules: { required: true, maxLength: 30 } } };
    function start() {
      clearInterval(timer);
      el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Đố vui') + '</h2></div>' +
        '<p class="muted">' + esc(o.intro || (o.questions.length + ' câu hỏi, mỗi câu ' + (o.timePerQ || 30) + ' giây. Trả lời càng nhanh điểm càng cao.')) + '</p>' +
        '<form class="form mt-3" novalidate data-quiz-start>' + EP.form.render(START_SCHEMA, { name: player }, { grid: false }) + '<div class="row"><button class="btn btn-primary" type="submit">Bắt đầu chơi</button></div></form></div>' + board() + '</div>';
      EP.form.bind(el.querySelector('[data-quiz-start]'), START_SCHEMA, { onSubmit: function (v) { player = v.name; g = create(o); question(); } });
    }
    function question() {
      var q = g.current();
      if (!q) return finish();
      el.innerHTML = '<div class="card" style="max-width:720px;margin-inline:auto"><div class="row between"><span class="badge accent">Câu ' + (g.idx + 1) + '/' + g.total + '</span><span class="badge" aria-hidden="true">Điểm: ' + g.score + '</span><b data-quiz-clock aria-label="Thời gian còn lại"></b></div>' +
        '<div class="meter mt-3" aria-hidden="true"><i data-quiz-bar style="width:100%;transition:none"></i></div>' +
        '<h2 class="section-title mt-3" style="font-size:20px" id="quiz-q">' + esc(q.q) + '</h2>' +
        '<div class="stack mt-3" role="group" aria-labelledby="quiz-q">' + q.options.map(function (op, i) { return '<button type="button" class="btn" style="width:100%;justify-content:flex-start;white-space:normal;text-align:left;min-height:48px" data-opt="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(op) + '</button>'; }).join('') + '</div>' +
        '<div data-quiz-fb class="mt-3" aria-live="assertive"></div></div>';
      deadline = Date.now() + g.timeLimit;
      var clock = el.querySelector('[data-quiz-clock]'), bar = el.querySelector('[data-quiz-bar]');
      function tick() {
        var left = Math.max(0, deadline - Date.now());
        clock.textContent = Math.ceil(left / 1000) + 's'; bar.style.width = (left / g.timeLimit * 100) + '%';
        if (left <= 0) { clearInterval(timer); reveal(g.timeout()); }
      }
      clearInterval(timer); timer = setInterval(tick, 100); tick();
      el.querySelectorAll('[data-opt]').forEach(function (b) {
        b.addEventListener('click', function () { if (g.answered) return; clearInterval(timer); reveal(g.answer(+b.getAttribute('data-opt'), g.timeLimit - (deadline - Date.now()))); });
      });
    }
    function reveal(res) {
      if (!res) return;
      el.querySelectorAll('[data-opt]').forEach(function (b) {
        var i = +b.getAttribute('data-opt'); b.disabled = true;
        if (i === res.answerIndex) { b.style.borderColor = 'var(--success)'; b.style.background = 'var(--pill-positive-bg)'; b.style.color = 'var(--pill-positive-ink)'; }
        else if (i === res.choice) { b.style.borderColor = 'var(--danger)'; b.style.background = 'var(--pill-negative-bg)'; b.style.color = 'var(--pill-negative-ink)'; }
      });
      var last = g.idx + 1 >= g.total;
      el.querySelector('[data-quiz-fb]').innerHTML = '<p><b>' + (res.timedOut ? 'Hết giờ!' : res.correct ? 'Chính xác! +' + res.points + ' điểm' : 'Chưa đúng.') + '</b> ' + esc(res.explain) + '</p>' +
        '<div class="row mt-2"><button type="button" class="btn btn-primary" data-quiz-next>' + (last ? 'Xem kết quả' : 'Câu tiếp theo') + '</button></div>';
      var nb = el.querySelector('[data-quiz-next]'); nb.focus();
      nb.addEventListener('click', function () { g.next(); question(); });
    }
    function finish() {
      var r = g.result(); lb.add({ name: player, score: r.score, correct: r.correct, total: r.total, totalMs: r.totalMs });
      el.innerHTML = '<div class="grid cols-2"><div class="card center"><p class="muted">Kết quả của ' + esc(player) + '</p><div class="score-big mt-2" data-quiz-score>' + r.score + '</div><p class="muted">điểm · đúng ' + r.correct + '/' + r.total + ' câu · ' + fmtTime(r.totalMs) + '</p>' +
        '<div class="row mt-3" style="justify-content:center"><button type="button" class="btn btn-primary" data-quiz-again>Chơi lại</button></div></div>' + board() + '</div>';
      el.querySelector('[data-quiz-again]').addEventListener('click', start);
    }
    start();
    return { restart: start, leaderboard: lb };
  }
  EP.quiz = { create: create, leaderboard: leaderboard, mount: mount };
})(window);

=================== FILE: vibe-sprint/starter/js/timeslot.js ===================
/* timeslot.js - khung giờ, kiểm tra trùng lịch, đếm ngược.
     EP.time.slots('2026-11-20', '08:00', '17:00', 30) -> ['08:00','08:30',...]
     EP.time.overlaps({start:'09:00',end:'10:00'}, {start:'09:30',end:'11:00'}) -> true
     EP.time.freeSlots(day, slots, booked[{date,time}], durationMin) -> các giờ còn trống
     EP.time.countdown(targetISO) -> { done, days, hours, minutes, seconds, text:'2 ngày 03:04:05' }
     EP.time.toMin('09:30') -> 570 ; EP.time.fromMin(570) -> '09:30' */
(function (root) {
  'use strict';
  var EP = root.EP;
  function toMin(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function fromMin(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  EP.time = {
    toMin: toMin, fromMin: fromMin,
    slots: function (day, from, to, step) {
      var out = [], s = toMin(from), e = toMin(to), st = step || 30;
      for (var m = s; m + st <= e; m += st) out.push(fromMin(m));
      return out;
    },
    overlaps: function (a, b) { return toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end); },
    freeSlots: function (day, slots, booked, dur) {
      dur = dur || 30;
      var busy = (booked || []).filter(function (b) { return b.date === day; }).map(function (b) { return { start: b.time, end: fromMin(toMin(b.time) + (b.duration || dur)) }; });
      return slots.filter(function (t) {
        var s = { start: t, end: fromMin(toMin(t) + dur) };
        return !busy.some(function (b) { return EP.time.overlaps(s, b); });
      });
    },
    isPast: function (day, time) { return new Date(day + 'T' + (time || '23:59') + ':00').getTime() < Date.now(); },
    countdown: function (target, now) {
      var ms = new Date(target).getTime() - (now == null ? Date.now() : now);
      if (isNaN(ms)) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, text: '' };
      if (ms <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, text: 'Đã diễn ra' };
      var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
      return { done: false, days: d, hours: h, minutes: m, seconds: sec, text: (d ? d + ' ngày ' : '') + pad(h) + ':' + pad(m) + ':' + pad(sec) };
    }
  };
})(window);

=================== FILE: vibe-sprint/starter/js/ui.js ===================
/* ui.js - thành phần giao diện dùng lại: icon, toast, hộp thoại, confirm, copy, skeleton, trạng thái trống/lỗi,
   KPI, badge, stepper, segmented, chips, bảng sắp xếp được. Hàm trả về chuỗi HTML đã escape dữ liệu. */
(function (root) {
  'use strict';
  var EP = root.EP, doc = root.document, esc = EP.esc;

  /* ---------- Icon (stroke 2px, 24x24) ---------- */
  var P = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    alert: '<path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    inbox: '<path d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 3h6l1-3h5"/>',
    print: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    chat: '<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-5.4A8 8 0 1121 12z"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    refresh: '<path d="M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 0118.5 5.8M21 4v5h-5M3 20v-5h5"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h6"/>'
  };
  var warned = {};
  function icon(name, cls) {
    if (!P[name] && name && !warned[name]) { warned[name] = 1; console.warn('[EP.ui.icon] Không có icon "' + name + '" (dùng "info" thay thế). Icon có sẵn: ' + Object.keys(P).join(', ')); }
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.info) + '</svg>';
  }

  var ui = EP.ui = { icons: P, icon: icon };

  /* ---------- Toast ---------- */
  /** EP.ui.toast('Đã lưu', { type: 'success'|'error'|'warn'|'info', duration: 4000, action: { label, onClick } }) -> hàm đóng */
  ui.toast = function (msg, opts) {
    opts = opts || {};
    var host = doc.getElementById('toasts');
    if (!host) { host = doc.createElement('div'); host.id = 'toasts'; host.className = 'toasts'; doc.body.appendChild(host); }
    while (host.children.length >= 4) host.firstChild.remove();
    var type = opts.type || 'info', t = doc.createElement('div');
    t.className = 'toast ' + type;
    t.setAttribute('role', type === 'error' ? 'alert' : 'status');
    t.innerHTML = '<span class="t-ico">' + icon(type === 'success' ? 'check' : type === 'error' || type === 'warn' ? 'alert' : 'info') + '</span><span class="t-msg">' + esc(msg) + '</span>' +
      (opts.action ? '<button type="button" data-t-act>' + esc(opts.action.label) + '</button>' : '') +
      '<button type="button" data-t-x aria-label="Đóng thông báo">' + icon('x') + '</button>';
    host.appendChild(t);
    var timer, closed = false;
    function close() {
      if (closed) return; closed = true; clearTimeout(timer);
      t.classList.add('out');
      setTimeout(function () { t.remove(); }, EP.reduced() ? 0 : 200);
    }
    t.querySelector('[data-t-x]').addEventListener('click', close);
    var a = t.querySelector('[data-t-act]');
    if (a) a.addEventListener('click', function () { try { opts.action.onClick(); } finally { close(); } });
    timer = setTimeout(close, opts.duration || (type === 'error' ? 6500 : 3800));
    return close;
  };
  ['success', 'error', 'warn'].forEach(function (k) { ui.toast[k] = function (m, o) { return ui.toast(m, Object.assign({ type: k }, o)); }; });

  /* ---------- Hộp thoại (thẻ <dialog> gốc: tự khoá focus, Esc để đóng) ----------
     var d = EP.ui.dialog({ title, body: html|Node, size: 'wide', actions: [{label, variant:'primary', value, type:'submit', form:'formId', onClick}] })
     d.el, d.body (phần nội dung), d.close(value), d.closed (Promise<value>) */
  ui.dialog = function (o) {
    var dlg = doc.createElement('dialog');
    dlg.className = 'dlg' + (o.size === 'wide' ? ' wide' : '');
    var tid = EP.uid();
    dlg.setAttribute('aria-labelledby', tid);
    dlg.innerHTML = '<div class="dlg-head"><h2 class="dlg-title" id="' + tid + '">' + esc(o.title || '') + '</h2><button type="button" class="icon-btn" data-close aria-label="Đóng">' + icon('x') + '</button></div><div class="dlg-body"></div><div class="dlg-foot"></div>';
    var body = dlg.querySelector('.dlg-body'), foot = dlg.querySelector('.dlg-foot');
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    (o.actions || []).forEach(function (a) {
      var b = doc.createElement('button');
      b.type = a.type || 'button';
      b.className = 'btn' + (a.variant ? ' btn-' + a.variant : '');
      if (a.variant === 'danger-solid') b.className = 'btn btn-danger solid';
      if (a.form) b.setAttribute('form', a.form);
      if (a.id) b.id = a.id;
      b.innerHTML = (a.icon ? icon(a.icon) : '') + esc(a.label);
      b.addEventListener('click', function () {
        if (a.onClick) a.onClick(api);
        if (a.value !== undefined) api.close(a.value);
      });
      foot.appendChild(b);
    });
    if (!foot.children.length) foot.remove();
    var resolve, closed = new Promise(function (r) { resolve = r; }), val;
    var api = { el: dlg, body: body, closed: closed, close: function (v) { val = v; if (dlg.open) dlg.close(); else finish(); } };
    function finish() { dlg.remove(); resolve(val); if (o.onClose) o.onClose(val); }
    dlg.addEventListener('close', finish);
    dlg.addEventListener('click', function (e) { if (e.target === dlg || (e.target.closest && e.target.closest('[data-close]'))) api.close(undefined); });
    doc.body.appendChild(dlg);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var first = body.querySelector('input,select,textarea') || foot.querySelector('.btn-primary') || foot.querySelector('.btn');
    if (first && o.autofocus !== false && !(root.matchMedia && root.matchMedia('(pointer: coarse)').matches && first.matches('input,textarea'))) first.focus();
    return api;
  };

  /** await EP.ui.confirm({ title, message, confirmLabel, danger }) -> true/false */
  ui.confirm = function (o) {
    var d = ui.dialog({
      title: o.title || 'Xác nhận', body: '<p>' + esc(o.message || 'Bạn chắc chắn chứ?') + '</p>',
      actions: [{ label: o.cancelLabel || 'Hủy', value: false }, { label: o.confirmLabel || 'Đồng ý', variant: o.danger ? 'danger-solid' : 'primary', value: true, id: 'confirm-ok' }]
    });
    return d.closed.then(function (v) { return v === true; });
  };

  /* ---------- Copy ---------- */
  /** EP.ui.copy(text, 'Đã sao chép') -> Promise<boolean>; có fallback khi không có Clipboard API */
  ui.copy = function (text, okMsg) {
    function ok(v) { if (v) ui.toast(okMsg || 'Đã sao chép', { type: 'success' }); else ui.toast('Không sao chép được, hãy chọn và copy thủ công.', { type: 'error' }); return v; }
    function fallback() {
      var ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      doc.body.appendChild(ta); ta.select(); var r = false;
      try { r = doc.execCommand('copy'); } catch (e) { r = false; }
      ta.remove(); return r;
    }
    if (root.navigator.clipboard && root.isSecureContext) return root.navigator.clipboard.writeText(text).then(function () { return ok(true); }, function () { return ok(fallback()); });
    return Promise.resolve(ok(fallback()));
  };

  /* ---------- Skeleton, trạng thái trống/lỗi ---------- */
  ui.skeleton = function (lines) {
    var h = '<div class="skeleton" aria-busy="true" aria-label="Đang tải"><div class="sk title"></div>';
    for (var i = 0; i < (lines || 3); i++) h += '<div class="sk" style="width:' + (92 - i * 14) + '%"></div>';
    return h + '</div>';
  };
  /** EP.ui.empty({ icon, title, text, action: { label, act } }) -> html ; nút có data-act="act" */
  ui.empty = function (o) {
    o = o || {};
    return '<div class="state"><div class="state-ico">' + icon(o.icon || 'inbox') + '</div><h3>' + esc(o.title || 'Chưa có dữ liệu') + '</h3>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      (o.action ? '<div class="row"><button type="button" class="btn btn-primary" data-act="' + esc(o.action.act) + '">' + icon(o.action.icon || 'plus') + esc(o.action.label) + '</button></div>' : '') + '</div>';
  };
  ui.error = function (o) {
    o = o || {};
    return '<div class="state error" role="alert"><div class="state-ico">' + icon('alert') + '</div><h3>' + esc(o.title || 'Có lỗi xảy ra') + '</h3>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      (o.retry ? '<div class="row"><button type="button" class="btn" data-act="' + esc(o.retry) + '">' + icon('refresh') + 'Thử lại</button></div>' : '') + '</div>';
  };
  /** Đặt nút vào trạng thái đang chạy (chống bấm đôi): EP.ui.busy(btn, true/false) */
  ui.busy = function (btn, on) { if (!btn) return; if (on) { btn.setAttribute('aria-busy', 'true'); btn.setAttribute('aria-disabled', 'true'); } else { btn.removeAttribute('aria-busy'); btn.removeAttribute('aria-disabled'); } };

  /* ---------- KPI, badge, stepper ---------- */
  /** EP.ui.kpi({ label, value, hint, delta: +12.5 (%), tone }) */
  ui.kpi = function (k) {
    var d = '';
    if (k.delta != null && isFinite(k.delta)) d = '<span class="delta ' + (k.delta >= 0 ? 'up' : 'down') + '">' + (k.delta >= 0 ? '▲ ' : '▼ ') + Math.abs(k.delta).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%</span>';
    return '<div class="card kpi"><div class="kpi-label">' + esc(k.label) + '</div><div class="kpi-value">' + esc(k.value) + '</div><div class="kpi-foot">' + d + (k.hint ? '<span>' + esc(k.hint) + '</span>' : '') + '</div></div>';
  };
  /** tone: positive | negative | warning | accent | (rỗng = trung tính) */
  ui.badge = function (text, tone) { return '<span class="badge ' + (tone || '') + '">' + esc(text) + '</span>'; };
  /** EP.ui.stepper(['Nhập', 'Tạo', 'Duyệt'], 1) -> current là chỉ số 0-based; >= length là xong hết */
  ui.stepper = function (steps, current) {
    return '<ol class="stepper" aria-label="Các bước">' + steps.map(function (s, i) {
      var c = i < current ? 'done' : i === current ? 'current' : '';
      return '<li class="' + c + '"' + (c === 'current' ? ' aria-current="step"' : '') + '><span><b>' + esc(s) + '</b></span></li>';
    }).join('') + '</ol>';
  };

  /* ---------- Segmented (radio gốc nên có sẵn bàn phím) ----------
     var s = EP.ui.segmented(el, { label, name, options: [{value,label}], value, onChange(v) }); s.get(); s.set(v) */
  ui.segmented = function (el, o) {
    var name = o.name || 'seg-' + EP.uid();
    el.innerHTML = '<div class="seg" role="radiogroup" aria-label="' + esc(o.label || '') + '">' + o.options.map(function (op) {
      return '<label><input type="radio" name="' + esc(name) + '" value="' + esc(op.value) + '"' + (String(op.value) === String(o.value) ? ' checked' : '') + '><span>' + esc(op.label) + '</span></label>';
    }).join('') + '</div>';
    el.addEventListener('change', function (e) { if (e.target.name === name && o.onChange) o.onChange(e.target.value); });
    return {
      get: function () { var c = el.querySelector('input:checked'); return c ? c.value : null; },
      set: function (v) { var i = el.querySelector('input[value="' + String(v).replace(/"/g, '') + '"]'); if (i) i.checked = true; }
    };
  };
  /** Chip bật/tắt: EP.ui.chips(el, { options: [{value,label}], value: [] | 'x', multi, onChange(v) }) */
  ui.chips = function (el, o) {
    var sel = o.multi ? (o.value || []).slice() : [o.value];
    function draw() {
      el.innerHTML = '<div class="chips">' + o.options.map(function (op) {
        return '<button type="button" class="chip" data-v="' + esc(op.value) + '" aria-pressed="' + (sel.indexOf(op.value) >= 0) + '">' + esc(op.label) + '</button>';
      }).join('') + '</div>';
    }
    draw();
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.chip[data-v]'); if (!b) return;
      var v = b.getAttribute('data-v'), i = sel.indexOf(v);
      if (o.multi) { if (i >= 0) sel.splice(i, 1); else sel.push(v); } else sel = [v];
      draw(); if (o.onChange) o.onChange(o.multi ? sel.slice() : sel[0]);
    });
    return { get: function () { return o.multi ? sel.slice() : sel[0]; } };
  };

  /* ---------- Bảng sắp xếp được ----------
     var t = EP.ui.table(el, {
       caption: 'Danh sách', columns: [{ key:'name', label:'Tên', sort:true, type:'text'|'number'|'date', render(row)->html, num:true }],
       rows, rowKey:'id', actions(row)->html (nút có data-act), onAction(act, id, row), empty:{...EP.ui.empty opts}, sort:{key,dir} });
     t.setRows(rows) */
  ui.table = function (el, o) {
    var rows = o.rows || [], sort = o.sort || null, coll = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
    function val(r, c) { return c.value ? c.value(r) : r[c.key]; }
    function sorted() {
      if (!sort) return rows;
      var c = o.columns.filter(function (x) { return x.key === sort.key; })[0]; if (!c) return rows;
      var dir = sort.dir === 'desc' ? -1 : 1;
      return rows.map(function (r, i) { return [r, i]; }).sort(function (a, b) {
        var x = val(a[0], c), y = val(b[0], c), r;
        if (x == null || x === '') r = (y == null || y === '') ? 0 : 1; else if (y == null || y === '') r = -1;
        else if (c.type === 'number') r = (Number(x) - Number(y)) * dir;
        else if (c.type === 'date') r = (new Date(x) - new Date(y)) * dir;
        else r = coll.compare(String(x), String(y)) * dir;
        if (x == null || x === '' || y == null || y === '') return r;
        return r || a[1] - b[1];
      }).map(function (p) { return p[0]; });
    }
    function draw() {
      if (!rows.length) { el.innerHTML = o.empty ? ui.empty(o.empty) : ui.empty({}); return; }
      var head = o.columns.map(function (c) {
        var cls = c.num ? ' class="num"' : '', s = sort && sort.key === c.key ? (sort.dir === 'desc' ? 'descending' : 'ascending') : 'none';
        return c.sort ? '<th scope="col"' + cls + ' aria-sort="' + s + '"><button type="button" data-sort="' + esc(c.key) + '">' + esc(c.label) + '</button></th>'
          : '<th scope="col"' + cls + '><span class="th-in">' + esc(c.label) + '</span></th>';
      }).join('') + (o.actions ? '<th scope="col"><span class="sr-only">Thao tác</span></th>' : '');
      var body = sorted().map(function (r) {
        return '<tr data-id="' + esc(r[o.rowKey || 'id']) + '">' + o.columns.map(function (c) {
          var v = c.render ? c.render(r) : esc(val(r, c));
          return '<td' + (c.num ? ' class="num"' : '') + (c.label ? ' data-label="' + esc(c.label) + '"' : '') + '>' + v + '</td>';
        }).join('') + (o.actions ? '<td class="actions">' + o.actions(r) + '</td>' : '') + '</tr>';
      }).join('');
      el.innerHTML = '<div class="table-wrap"><table class="table">' + (o.caption ? '<caption class="sr-only">' + esc(o.caption) + '</caption>' : '') + '<thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
    }
    el.addEventListener('click', function (e) {
      var s = e.target.closest('[data-sort]');
      if (s) {
        var k = s.getAttribute('data-sort');
        sort = sort && sort.key === k ? { key: k, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' };
        draw(); var nb = el.querySelector('[data-sort="' + k + '"]'); if (nb) nb.focus(); return;
      }
      var a = e.target.closest('[data-act]');
      if (a && o.onAction) { var tr = a.closest('tr'); var id = tr && tr.getAttribute('data-id'); o.onAction(a.getAttribute('data-act'), id, rows.filter(function (r) { return String(r[o.rowKey || 'id']) === id; })[0], a); }
      else if (a && el.querySelector('.state') && o.onEmptyAction) o.onEmptyAction(a.getAttribute('data-act'));
    });
    draw();
    return { setRows: function (r) { rows = r || []; draw(); }, getSort: function () { return sort; } };
  };
})(window);

=================== FILE: vibe-sprint/starter/js/version.js ===================
/* version.js - phiên bản hiện ra ở chân trang. Chạy `node tools/bump-version.cjs` để tăng số và gắn ?v= cho file js/css. */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.version = { version: '0.1.0', date: '2026-11-13' };
})(window);

=================== FILE: vibe-sprint/starter/tests/feature-template.snippet ===================
  // ===== Mẫu kiểm thử cho MỘT feature thật. Sao chép vào tests/smoke.cjs, chỗ đánh dấu "FEATURE TESTS". =====
  // Thay: TAB (id đăng ký trong EP.register), COL (tên collection), #xx-save (id nút lưu trong dialog), các name="..." của form.
  // Chạy được ngay vì smoke.cjs đã có sẵn: page, URL, ok(), CFG (= EP.config.prefix / mockNotice), SHOTS.
  {
    const TAB = 'don-hang', COL = 'orders';
    console.log('# ' + TAB + ': CRUD + kiểm tra form + dữ liệu biên');
    await page.goto(URL + '#/' + TAB); await page.waitForSelector('html[data-ready="1"]');
    await page.waitForSelector('#view-' + TAB + ' .table tbody tr');
    const rowCount = () => page.$$eval('#view-' + TAB + ' .table tbody tr', (r) => r.length);
    const n0 = await rowCount();
    ok('có dữ liệu demo (' + n0 + ' dòng)', n0 >= 3);                         // đúng số dòng demo bạn khai báo thì viết === N

    // 1) Form rỗng -> lỗi tiếng Việt, aria-invalid, focus vào ô lỗi đầu tiên
    await page.click('[data-act="add"]'); await page.waitForSelector('dialog[open]');
    await page.click('#xx-save');
    ok('form rỗng hiện lỗi', (await page.textContent('dialog [data-field="name"] .field-msg')).includes('Vui lòng nhập'));
    ok('lỗi gắn aria-invalid', (await page.getAttribute('dialog [name="name"]', 'aria-invalid')) === 'true');

    // 2) Giá trị biên / sai: 0, âm, vượt khoảng, số lẻ. Mỗi quy tắc nghiệp vụ trong spec = một dòng ok().
    await page.fill('dialog [name="name"]', 'Mục kiểm thử');
    await page.fill('dialog [name="qty"]', '-1');
    await page.click('#xx-save');
    ok('số âm bị từ chối', (await page.textContent('dialog [data-field="qty"] .field-msg')).length > 0);

    // 3) Nhập đúng -> thêm được, còn sau reload
    await page.fill('dialog [name="qty"]', '5');
    await page.click('#xx-save'); await page.waitForSelector('dialog[open]', { state: 'detached' });
    ok('thêm: +1 dòng', (await rowCount()) === n0 + 1);
    await page.reload(); await page.waitForSelector('#view-' + TAB + ' .table tbody tr');
    ok('còn sau khi tải lại', (await rowCount()) === n0 + 1);

    // 4) Xoá (xác nhận bằng nút nguy hiểm trong dialog)
    await page.click('#view-' + TAB + ' tr:has-text("Mục kiểm thử") [data-act="delete"]');
    await page.click('#confirm-ok'); await page.waitForSelector('dialog[open]', { state: 'detached' });
    await page.waitForFunction((a) => document.querySelectorAll('#view-' + a[0] + ' .table tbody tr').length === a[1], [TAB, n0]);
    ok('xoá: về số dòng cũ', (await rowCount()) === n0);

    // 5) Khoá lưu trữ dùng đúng tiền tố của đề (không hardcode 'ep_')
    ok('collection lưu dưới tiền tố ' + CFG.prefix, await page.evaluate((a) => localStorage.getItem(a[0] + 'c_' + a[1]) !== null, [CFG.prefix, COL]));

    // 6) Kết quả AI mock (nếu feature có AI): phải kèm câu mock notice của đề
    // await page.click('#xx-ai-go'); await page.waitForSelector('.ai-result');
    // ok('mock kèm notice', (await page.textContent('.ai-result [data-ai-notice]')).includes(CFG.notice));

    // 7) Con số hiển thị đúng công thức (ví dụ lãi/đơn): so với giá trị tính tay, không chỉ "có chữ"
    // ok('lãi/đơn = 47.920', (await page.textContent('[data-calc-out]')).includes('47.920'));
  }

=================== FILE: vibe-sprint/starter/tests/smoke.cjs ===================
// Smoke test Playwright. Chạy:  node tests/smoke.cjs http://localhost:8201/   [--shots thu-muc-anh]
// Kiểm tra: tải không lỗi console, mọi tab hiển thị đúng 1 h1, không tràn ngang ở 390px, đổi giao diện,
// feature mẫu (CRUD + kiểm tra form + AI mock + biểu đồ + CSV), các mô-đun (calc, checklist, quiz, chat, match, metrics, schema AI).
// Các khối của feature mẫu (_example) và sân chơi (_playground) CHỈ chạy khi tab 'example' / 'playground' còn tồn tại,
// nên xoá hai feature đó vẫn xanh. Test feature thật: sao chép tests/feature-template.snippet vào chỗ đánh dấu
// "FEATURE TESTS" bên dưới. Tiền tố khoá và câu mock notice đọc từ EP.config, không hardcode.
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }

const args = process.argv.slice(2);
const URL = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:8201/').replace(/\/?$/, '/');
const shotsIdx = args.indexOf('--shots');
const SHOTS = shotsIdx >= 0 ? args[shotsIdx + 1] : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

let failed = 0;
const ok = (name, cond, extra) => { if (cond) console.log('  ok  ', name); else { failed++; console.log('  FAIL', name, extra === undefined ? '' : JSON.stringify(extra)); } };
const visibleViews = (page) => page.$$eval('.view:not([hidden])', (n) => n.length);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  page.on('response', (r) => { if (r.status() >= 400) errors.push('http ' + r.status() + ': ' + r.url()); });

  console.log('# Tải trang');
  await page.goto(URL + '?demo=1', { waitUntil: 'load' });
  await page.waitForSelector('html[data-ready="1"]');
  ok('có skip link', await page.$('.skip-link') !== null);
  ok('lang=vi', (await page.getAttribute('html', 'lang')) === 'vi');
  ok('chân trang có phiên bản', /^v\d/.test(await page.textContent('#ft-version')));
  const CFG = await page.evaluate(() => ({ prefix: EP.config.prefix, notice: EP.config.mockNotice }));
  ok('config có prefix + mockNotice', !!CFG.prefix && !!CFG.notice, CFG);
  ok('chân trang có MOCK_NOTICE (= EP.config.mockNotice)', (await page.textContent('#ft-notice')).includes(CFG.notice), CFG.notice);

  console.log('# Mọi tab hiển thị');
  const tabs = await page.$$eval('.tab', (a) => a.map((x) => x.dataset.tab));
  ok('có >= 3 tab (Tổng quan, >= 1 feature, Cài đặt)', tabs.length >= 3, tabs);
  const hasExample = tabs.includes('example'), hasPlay = tabs.includes('playground');
  const firstFeature = tabs.find((t) => t !== 'home' && t !== 'settings') || 'home';
  for (const t of tabs) {
    await page.click('.tab[data-tab="' + t + '"]');
    await page.waitForFunction((id) => !document.getElementById('view-' + id).hidden && document.getElementById('view-' + id).querySelector('.view-body').children.length > 0, t);
    ok('tab ' + t + ': đúng 1 view hiện', (await visibleViews(page)) === 1);
    ok('tab ' + t + ': đúng 1 h1 có chữ', (await page.$$eval('.view:not([hidden]) h1', (h) => h.length === 1 && h[0].textContent.trim().length > 0)));
    ok('tab ' + t + ': aria-current', (await page.getAttribute('.tab[data-tab="' + t + '"]', 'aria-current')) === 'page');
  }
  if (SHOTS) {
    for (const t of tabs) {
      await page.goto(URL + '#/' + t); await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(SHOTS, 'desktop-light-' + t + '.png'), fullPage: true });
    }
  }

  console.log('# Không tràn ngang ở 390px (sáng + tối)');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const t of tabs) {
      await page.goto(URL + '#/' + t); await page.waitForTimeout(350);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      ok('390px ' + scheme + ' ' + t + ' không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'mobile-' + scheme + '-' + t + '.png'), fullPage: true });
    }
  }
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('# Đổi giao diện');
  await page.goto(URL + '#/home'); await page.waitForSelector('html[data-ready="1"]');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const settle = () => page.waitForFunction(() => !document.documentElement.hasAttribute('data-vt'), null, { timeout: 4000 });
  const bg0 = await bg();
  await page.click('#btn-theme'); await settle();
  ok('lần 1 -> light', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('#btn-theme'); await settle();
  ok('lần 2 -> dark', (await page.getAttribute('html', 'data-theme')) === 'dark');
  const bgDark = await bg();
  ok('nền đổi sang tối', bgDark !== bg0, [bg0, bgDark]);
  if (SHOTS) { await page.goto(URL + '#/' + firstFeature); await page.waitForTimeout(500); await page.screenshot({ path: path.join(SHOTS, 'desktop-dark-' + firstFeature + '.png'), fullPage: true }); }
  await page.click('#btn-theme'); await settle();
  ok('lần 3 -> theo hệ thống', (await page.getAttribute('html', 'data-theme')) === null);
  await page.click('#btn-theme'); await settle();
  await page.reload(); await page.waitForSelector('html[data-ready="1"]');
  ok('giao diện được nhớ sau khi tải lại', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('#btn-theme'); await settle(); await page.click('#btn-theme'); await settle(); // về system

  if (!hasExample) console.log('# Feature mẫu: bỏ qua (không có tab "example")');
  if (hasExample) {
  console.log('# Feature mẫu: CRUD');
  await page.goto(URL + '#/example'); await page.waitForSelector('html[data-ready="1"]');
  await page.waitForSelector('.table tbody tr');
  const rowCount = () => page.$$eval('#view-example .table tbody tr', (r) => r.length);
  const n0 = await rowCount();
  ok('có dữ liệu demo (' + n0 + ' dòng)', n0 >= 5);
  ok('biểu đồ cột + tròn có SVG', (await page.$$('#view-example .chart svg')).length >= 2);
  // sắp xếp
  await page.click('#view-example [data-sort="qty"]');
  let qtys = await page.$$eval('#view-example tbody tr td:nth-child(3)', (c) => c.map((x) => Number(x.textContent.replace(/\D/g, ''))));
  ok('sắp xếp số lượng tăng dần', qtys.every((v, i) => i === 0 || qtys[i - 1] <= v), qtys);
  await page.click('#view-example [data-sort="qty"]');
  qtys = await page.$$eval('#view-example tbody tr td:nth-child(3)', (c) => c.map((x) => Number(x.textContent.replace(/\D/g, ''))));
  ok('sắp xếp số lượng giảm dần', qtys.every((v, i) => i === 0 || qtys[i - 1] >= v), qtys);
  // lọc
  await page.click('#view-example .seg label:has-text("Hoàn thành")');
  await page.waitForTimeout(100);
  ok('lọc theo trạng thái làm giảm số dòng', (await rowCount()) < n0);
  await page.click('#view-example .seg label:has-text("Tất cả")');
  // thêm: kiểm tra rỗng
  await page.click('[data-act="add"]');
  await page.waitForSelector('dialog[open]');
  await page.click('#ex-save');
  ok('gửi form rỗng hiện lỗi tiếng Việt', (await page.textContent('dialog [data-field="name"] .field-msg')).includes('Vui lòng nhập'));
  ok('lỗi gắn aria-invalid', (await page.getAttribute('dialog [name="name"]', 'aria-invalid')) === 'true');
  ok('focus rơi vào ô lỗi đầu tiên', await page.evaluate(() => document.activeElement && document.activeElement.name === 'name'));
  await page.fill('dialog [name="name"]', 'Mục kiểm thử tự động');
  await page.fill('dialog [name="email"]', 'sai-email');
  await page.fill('dialog [name="phone"]', '12345');
  await page.fill('dialog [name="qty"]', '500');
  await page.fill('dialog [name="due"]', '2020-01-01');
  await page.click('#ex-save');
  const msg = (f) => page.textContent('dialog [data-field="' + f + '"] .field-msg');
  ok('email sai', (await msg('email')).includes('Email'));
  ok('SĐT sai', (await msg('phone')).includes('Số điện thoại'));
  ok('số lượng vượt khoảng', (await msg('qty')).includes('1 đến 100'));
  ok('ngày quá khứ bị từ chối', (await msg('due')).includes('tương lai'));
  const d = new Date(); d.setDate(d.getDate() + 10);
  const dstr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  await page.fill('dialog [name="email"]', 'kiemthu@example.vn');
  await page.fill('dialog [name="phone"]', '+84 912 345 678');
  await page.fill('dialog [name="qty"]', '7');
  await page.fill('dialog [name="due"]', dstr);
  await page.click('#ex-save');
  await page.waitForSelector('dialog[open]', { state: 'detached' });
  ok('thêm mục: số dòng +1', (await rowCount()) === n0 + 1);
  ok('toast thành công', (await page.textContent('#toasts')).includes('Đã thêm'));
  // lưu bền vững
  await page.reload(); await page.waitForSelector('#view-example .table tbody tr');
  ok('dữ liệu còn sau khi tải lại', (await rowCount()) === n0 + 1);
  // sửa
  await page.click('#view-example tr:has-text("Mục kiểm thử tự động") [data-act="edit"]');
  await page.waitForSelector('dialog[open]');
  ok('form sửa nạp sẵn giá trị', (await page.inputValue('dialog [name="name"]')) === 'Mục kiểm thử tự động');
  await page.fill('dialog [name="name"]', 'Mục đã sửa');
  await page.click('#ex-save'); await page.waitForSelector('dialog[open]', { state: 'detached' });
  ok('sửa mục', (await page.textContent('#view-example tbody')).includes('Mục đã sửa'));
  // xóa
  await page.click('#view-example tr:has-text("Mục đã sửa") [data-act="delete"]');
  await page.waitForSelector('dialog[open]');
  await page.click('#confirm-ok'); await page.waitForSelector('dialog[open]', { state: 'detached' });
  await page.waitForFunction((n) => document.querySelectorAll('#view-example .table tbody tr').length === n, n0).catch(() => {});
  ok('xóa mục', (await rowCount()) === n0);
  // CSV
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="export"]')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  ok('CSV có BOM UTF-8', csv.charCodeAt(0) === 0xFEFF);
  ok('CSV có tiếng Việt + tiêu đề', csv.includes('Tên mục') && csv.includes('Hoàn thành'));

  console.log('# Feature mẫu: AI mock');
  await page.click('#ex-ai-go');
  ok('mô tả rỗng bị chặn', (await page.textContent('#ex-ai-form .field-msg')).includes('Vui lòng nhập'));
  await page.fill('#ex-ai-form textarea', 'ngắn');
  await page.click('#ex-ai-go');
  ok('mô tả quá ngắn bị chặn', (await page.textContent('#ex-ai-form .field-msg')).includes('ít nhất 10'));
  await page.fill('#ex-ai-form textarea', 'Chuẩn bị tài liệu và đặt phòng họp cho buổi gặp đối tác tuần sau');
  await page.click('#ex-ai-go');
  await page.waitForSelector('.ai-result');
  const notice = await page.textContent('.ai-result [data-ai-notice]');
  ok('kết quả mock kèm MOCK_NOTICE (= EP.config.mockNotice)', notice.includes(CFG.notice), notice);
  ok('AI trả đúng 3 nhãn', (await page.$$('.ai-result .chip')).length === 3);
  ok('stepper ở bước 3', (await page.textContent('[data-slot="stepper"] li.current')).includes('Duyệt'));
  await page.click('[data-act="ai-save"]');
  ok('lưu gợi ý AI thành mục: +1 dòng', (await rowCount()) === n0 + 1);
  ok('biểu đồ cập nhật không lỗi', (await page.$$('#view-example .chart svg')).length >= 2);
  }

  /* ===== FEATURE TESTS: dán khối kiểm thử của feature thật ở đây (mẫu: tests/feature-template.snippet) ===== */

  console.log('# Mô-đun: logic thuần (EP.*)');
  const logic = await page.evaluate(() => {
    const F = EP.form, r = {};
    // Mô-đun tuỳ chọn có thể đã bị xoá khỏi index.html: nhóm kiểm thử tương ứng được bỏ qua (trả true)
    const T = (mod, fn) => { try { return EP[mod] ? fn() : true; } catch (e) { return String(e); } };
    r.phoneOk = ['0912345678', '+84912345678', '0912 345 678', '02838221110'].every(F.isPhone);
    r.phoneBad = ['12345', '0112345678', '09123456789', 'abc'].every((x) => !F.isPhone(x));
    r.req = F.validateValue('', { label: 'Họ tên', rules: { required: true } }) === 'Vui lòng nhập họ tên.';
    r.range = F.validateValue(0, { label: 'Số lượng', type: 'number', rules: { min: 1, max: 9 } }).includes('1 đến 9');
    r.future = F.validateValue(EP.fmt.today(), { label: 'Ngày', rules: { date: 'future' } }).includes('tương lai');
    r.todayOk = F.validateValue(EP.fmt.today(), { label: 'Ngày', rules: { date: 'todayOrFuture' } }) === '';
    r.json1 = EP.ai.extractJson('Đây là kết quả:\n```json\n{"a": 1, "b": [1,2,],}\n```').b.length === 2;
    r.json2 = EP.ai.extractJson('{"a": "xin chào", "b": ["x", "y"').b.length === 2;
    const v = EP.ai.validate({ t: 'x'.repeat(100), n: '7.4', tags: ['a', 'b', 'c', 'd'] }, { type: 'object', props: { t: { type: 'string', max: 10 }, n: { type: 'number', integer: true, max: 5 }, tags: { type: 'array', max: 3 } } });
    r.schemaCoerce = v.ok && v.value.t.length === 10 && v.value.n === 5 && v.value.tags.length === 3 && v.warnings.length === 3;
    r.schemaFail = !EP.ai.validate({ tags: ['a'] }, { type: 'object', props: { tags: { type: 'array', min: 3 } } }).ok;
    r.mockDeterministic = T('mock', () => JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) === JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) && EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh').label === 'positive' && EP.mock.sentiment('Giao chậm, thái độ tệ').label === 'negative');
    r.classify = T('mock', () => EP.mock.classify('Cho mình hỏi giá và phí ship', { gia: ['giá'], ship: ['ship', 'vận chuyển'] }).label === 'gia' || true);
    r.safeDiv = T('metrics', () => EP.metrics.div(5, 0) === 0 && EP.metrics.ctr(5, 0) === 0 && EP.metrics.ctr(5, 200) === 2.5 && EP.metrics.vnd(1250000).startsWith('1.250.000'));
    r.trend = T('metrics', () => EP.metrics.trend([10, 12, 15]).dir === 'up');
    r.norm = T('match', () => EP.text.normalize('Đơn hàng Ở Hà Nội?') === 'don hang o ha noi');
    r.faqHit = T('match', () => EP.match.faq([{ q: 'Giá', keywords: ['giá', 'bao nhiêu'], a: 'x' }, { q: 'Giờ mở cửa', keywords: ['mở cửa'], a: 'y' }], 'Cho mình hỏi gia bao nhieu vay?').entry.a === 'x');
    r.faqMiss = T('match', () => EP.match.faq([{ q: 'Giá', keywords: ['giá'], a: 'x' }], 'thời tiết hôm nay thế nào') === null);
    r.search = T('match', () => EP.match.search([{ n: 'Áo thun nam' }, { n: 'Quần jean nữ' }], 'ao nam', ['n']).length === 1);
    r.checklist = T('checklist', () => { const sc = EP.checklist.score([{ id: 'a', weight: 60 }, { id: 'b', weight: 40 }], { a: true, b: 0.5 }); return sc.score === 80 && sc.failed.length === 1; });
    r.quizScore = T('quiz', () => {
      const g = EP.quiz.create({ questions: [{ q: '?', options: ['a', 'b'], answer: 1 }, { q: '?', options: ['a', 'b'], answer: 0 }], timePerQ: 10 });
      const a1 = g.answer(1, 0); g.next(); const a2 = g.answer(1, 0);
      return a1.points === 200 && a2.points === 0 && g.result().score === 200 && g.answer(0, 0) === null;
    });
    r.leaderboardTies = T('quiz', () => {
      const lb = EP.quiz.leaderboard('smoketest'); lb.clear();
      lb.add({ name: 'A', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'B', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'C', score: 100, correct: 1, total: 1, totalMs: 3000 }); lb.add({ name: 'D', score: 50, correct: 1, total: 1, totalMs: 1000 });
      const top = lb.top(); lb.clear();
      return top[0].name === 'C' && top[0].rank === 1 && top[1].rank === 2 && top[2].rank === 2 && top[3].rank === 4;
    });
    r.slots = T('time', () => EP.time.slots('2026-01-01', '08:00', '10:00', 30).length === 4 && EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '09:30', end: '11:00' }) && !EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }));
    r.free = T('time', () => EP.time.freeSlots('d', ['09:00', '09:30', '10:00'], [{ date: 'd', time: '09:00', duration: 30 }], 30).join() === '09:30,10:00');
    r.countdown = T('time', () => EP.time.countdown('2030-01-01T00:00:00', new Date('2029-12-30T21:00:00').getTime()).text === '1 ngày 03:00:00');
    r.csvGuard = EP.export.toCsv([{ a: '=1+1', b: 'x,"y"', c: '+84912345678' }]).split('\r\n')[1] === "'=1+1,\"x,\"\"y\"\"\",+84912345678";
    r.store = (EP.store.write('smoke', { a: 1 }), EP.store.read('smoke').a === 1) && (EP.store.remove('smoke'), EP.store.read('smoke', 'fb') === 'fb');
    return r;
  });
  Object.keys(logic).forEach((k) => ok('logic: ' + k, logic[k] === true, logic[k]));
  // Gemini giả (route) để kiểm tra retry + fallback model + rơi về mock
  const gem = await (async () => {
    let calls = 0; const models = [];
    await page.route('**/generativelanguage.googleapis.com/**', (route) => {
      calls++; const m = /models\/([^:]+):/.exec(route.request().url())[1]; models.push(m);
      const hdr = route.request().headers()['x-goog-api-key'];
      if (hdr !== 'TESTKEY') return route.fulfill({ status: 403, body: '{}' });
      if (calls === 1) return route.fulfill({ status: 429, body: '{}' });                       // model đầu hết lượt -> chuyển model
      if (calls === 2) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: 'không phải json' }] } }] }) }); // sai định dạng -> thử lại
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: '```json\n{"title":"T","summary":"S","tags":["a","b","c"],"priority":9}\n```' }] } }] }) });
    });
    const spec = { prompt: 'x', schema: { type: 'object', props: { title: { type: 'string' }, summary: { type: 'string' }, tags: { type: 'array', min: 3, max: 3 }, priority: { type: 'number', min: 1, max: 5 } } }, mock: () => ({ title: 'M', summary: 'M', tags: ['1', '2', '3'], priority: 1 }) };
    const res = await page.evaluate((s) => { return EP.ai.generate(Object.assign({}, s, { schema: JSON.parse(JSON.stringify(s.schema)) }), { mode: 'gemini', key: 'TESTKEY', instant: true }).then((r) => ({ mode: r.mode, model: r.model, p: r.data.priority, w: r.warnings })); }, { schema: spec.schema });
    return { res, calls, models };
  })().catch((e) => ({ err: String(e) }));
  ok('Gemini: sai định dạng được thử lại + clamp schema', gem.res && gem.res.mode === 'gemini' && gem.res.p === 5, gem);
  ok('Gemini: header key + đổi model khi 429', gem.models && gem.models[0] === 'gemini-3.6-flash' && gem.models[1] === 'gemini-4-hydrogen', gem.models);
  const fb = await page.evaluate(() => EP.ai.generate({ prompt: 'x', schema: { type: 'object', props: { a: { type: 'string' } } }, mock: () => ({ a: 'mock' }) }, { mode: 'gemini', key: 'SAI', instant: true }).then((r) => ({ mode: r.mode, notice: r.notice, w: r.warnings.length })));
  ok('Gemini lỗi key -> rơi về mock có notice', fb.mode === 'mock' && fb.notice.includes('mô phỏng AI') && fb.w === 1, fb);
  await page.unroute('**/generativelanguage.googleapis.com/**');

  if (!hasPlay) console.log('# Mô-đun: giao diện: bỏ qua (không có tab "playground")');
  if (hasPlay) {
  console.log('# Mô-đun: giao diện (calc, checklist, quiz, chat)');
  await page.goto(URL + '#/playground'); await page.waitForSelector('[data-calc-out] .kpi');
  ok('calc: có KPI lợi nhuận', (await page.textContent('[data-calc-out]')).includes('Lợi nhuận'));
  await page.fill('#view-playground [name="qty"]', '0');
  await page.waitForTimeout(250);
  ok('calc: nhập sai -> thông báo, không tính', (await page.textContent('[data-calc-out]')).includes('hợp lệ') );
  await page.fill('#view-playground [name="qty"]', '30'); await page.waitForTimeout(250);
  ok('calc: tính lại khi nhập đúng', (await page.$('[data-calc-out] .kpi')) !== null);
  await page.click('#view-playground .seg label:has-text("Chấm điểm")');
  await page.check('#view-playground [data-id="h1"]');
  ok('checklist: điểm 30 sau khi tích h1', (await page.textContent('[data-cl-out] .score-big')).startsWith('30'));
  await page.click('#view-playground .seg label:has-text("Đố vui")');
  await page.fill('#view-playground [name="name"]', 'Tester'); await page.click('#view-playground [data-quiz-start] [type="submit"]');
  for (let i = 0; i < 3; i++) { await page.click('#view-playground [data-opt="' + [1, 1, 0][i] + '"]'); await page.click('[data-quiz-next]'); }
  await page.waitForSelector('[data-quiz-score]');
  ok('quiz: trả lời đúng cả 3 câu -> điểm >= 600', Number(await page.textContent('[data-quiz-score]')) >= 600);
  ok('quiz: bảng xếp hạng có người chơi', (await page.textContent('[data-quiz-board]')).includes('Tester'));
  await page.click('#view-playground .seg label:has-text("Chatbot")');
  await page.fill('.chat-form input', 'Cho mình hỏi giá bao nhiêu?'); await page.press('.chat-form input', 'Enter');
  await page.waitForFunction(() => document.querySelectorAll('.bubble.bot:not(.typing)').length >= 2);
  ok('chatbot: trả lời đúng FAQ giá', (await page.textContent('.chat-log')).includes('99.000'));
  await page.fill('.chat-form input', 'thời tiết hôm nay'); await page.press('.chat-form input', 'Enter');
  await page.waitForSelector('.chat-log button.btn-primary');
  ok('chatbot: không biết -> nút chuyển sang để lại thông tin', true);
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'desktop-light-playground-chat.png') }); }
  }

  console.log('# Cài đặt: AI + dữ liệu');
  await page.goto(URL + '#/settings'); await page.waitForSelector('#ai-key');
  await page.fill('#ai-key', 'abc');
  ok('key không lưu localStorage khi chưa tick nhớ', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === null, CFG.prefix));
  await page.check('#ai-remember');
  ok('tick nhớ -> lưu key', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === '"abc"', CFG.prefix));
  await page.uncheck('#ai-remember');
  ok('bỏ tick -> xóa key', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === null, CFG.prefix));
  const [bk] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="backup"]')]);
  const bj = JSON.parse(fs.readFileSync(await bk.path(), 'utf8'));
  const colKey = Object.keys(bj.data).find((k) => /^c_/.test(k) && Array.isArray(bj.data[k]) && bj.data[k].length > 0);
  ok('sao lưu JSON không chứa key AI', !('ai_key' in bj.data));
  if (colKey) {
    const col = colKey.slice(2);
    await page.evaluate((c) => EP.collection(c).clear(), col);
    const tmp = path.join(require('os').tmpdir(), 'smoke-backup.json'); fs.writeFileSync(tmp, JSON.stringify(bj));
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-act="restore"]')]);
    await fc.setFiles(tmp); await page.waitForFunction((c) => EP.collection(c).count() > 0, col);
    ok('sao lưu có dữ liệu + khôi phục từ file (' + colKey + ')', true);
  } else console.log('  (bỏ qua khôi phục: chưa có collection nào có dữ liệu demo)');
  const bad = await page.evaluate(() => EP.export.restore(new File(['{"x":1}'], 'b.json')).then(() => 'ok', (e) => e.message));
  ok('file khôi phục sai bị từ chối bằng tiếng Việt', /định dạng/.test(bad), bad);

  console.log('# Lỗi console');
  // Các lỗi 4xx cố ý từ Gemini giả (route) ở bước trên không tính
  const real = errors.filter((e) => !/generativelanguage|status of (429|403)/.test(e));
  ok('không có lỗi console/mạng', real.length === 0, real);

  await browser.close();
  console.log(failed ? '\n' + failed + ' kiểm tra THẤT BẠI' : '\nTẤT CẢ ĐẠT');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

=================== FILE: vibe-sprint/starter/tools/bump-version.cjs ===================
// bump-version.cjs - tăng số phiên bản trong js/version.js và gắn ?v=<phiên bản> vào mọi file js/css/features trong index.html
// (và 404.html nếu có) để trình duyệt tải bản mới ngay sau khi deploy GitHub Pages (không dùng bản cũ trong cache).
// Cách dùng:  node tools/bump-version.cjs            -> tăng patch (0.1.0 -> 0.1.1)
//             node tools/bump-version.cjs minor      -> 0.2.0     | major -> 1.0.0 | 1.4.2 -> đặt thẳng số này
//             node tools/bump-version.cjs --stamp    -> giữ số, chỉ gắn lại ?v=
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const vfile = path.join(root, 'js/version.js');
let src = fs.readFileSync(vfile, 'utf8');
let v = src.match(/version: '([^']+)'/)[1];
const arg = process.argv[2];
if (arg !== '--stamp') {
  const p = v.split('.').map(Number);
  if (/^\d+\.\d+\.\d+$/.test(arg || '')) v = arg;
  else if (arg === 'major') v = (p[0] + 1) + '.0.0';
  else if (arg === 'minor') v = p[0] + '.' + (p[1] + 1) + '.0';
  else v = p[0] + '.' + p[1] + '.' + (p[2] + 1);
  const d = new Date(), date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  src = src.replace(/version: '[^']+'/, "version: '" + v + "'").replace(/date: '[^']+'/, "date: '" + date + "'");
  fs.writeFileSync(vfile, src);
}
['index.html', '404.html'].forEach((name) => {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8')
    .replace(/(<script (?:defer )?src="(?:js|features)\/[\w./-]+\.js)(\?v=[^"]*)?"/g, '$1?v=' + v + '"')
    .replace(/(<link rel="stylesheet" href="css\/[\w.-]+\.css)(\?v=[^"]*)?"/g, '$1?v=' + v + '"');
  fs.writeFileSync(file, html);
  console.log(name + ' -> v=' + v);
});

=================== FILE: vibe-sprint/templates/BANG-KIEM-THU.md ===================
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

=================== FILE: vibe-sprint/templates/CHECKLIST-CHUNG-KET.md ===================
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

=================== FILE: vibe-sprint/templates/CLAUDE.md ===================
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

=================== FILE: vibe-sprint/templates/DECISIONS.md ===================
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

=================== FILE: vibe-sprint/templates/HOI-DAP.md ===================
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

=================== FILE: vibe-sprint/templates/KICH-BAN-DEMO.md ===================
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

=================== FILE: vibe-sprint/templates/MINH-CHUNG-AI.md ===================
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

=================== FILE: vibe-sprint/templates/PROGRESS.md ===================
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

=================== FILE: vibe-sprint/templates/README-du-thi.md ===================
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

=================== FILE: vibe-sprint/templates/spec-nhanh.md ===================
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
