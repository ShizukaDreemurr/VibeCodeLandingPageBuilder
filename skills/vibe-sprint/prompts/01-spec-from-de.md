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
