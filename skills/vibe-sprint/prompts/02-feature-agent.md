# 02 - Feature agent (mỗi feature một agent, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

> **Schema Contract bắt buộc.** Dán NGUYÊN VĂN khối **Schema Contract** (`{{SCHEMA_CONTRACT}}`, lấy từ `docs/spec-nhanh.md` mục 0) vào prompt này. Tên trường, tên hàm, tên collection, id `EP.*` phải đúng từng chữ như contract; **không tự đặt tên mới**. Thiếu tên thì dừng và hỏi điều phối, không đoán.

Spawn: `Agent(subagent_type:"general-purpose", model:"sonnet", isolation:"worktree", run_in_background:true, description:"Feature {{FEATURE_NAME}}")`. Một message chứa tất cả feature agent. Điền toàn bộ `{{}}` từ `docs/spec-nhanh.md` (`{{MOCK_NOTICE}}` = câu nhãn chép nguyên văn từ đề/BTC; xem `00-README.md`; câu vòng loại chỉ là lịch sử). Port theo bảng ở `SKILL.md`/`00-README.md` (feature F1..F8 = 8217-8224). Muốn second opinion: spawn thêm 1 agent cùng feature với port khác và chọn bản tốt hơn.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP namespace, no build step). FIRST run `git reset --hard {{BRANCH}}`. Serve with `python3 -m http.server {{PORT}}` from YOUR worktree root (never port 8000; kill the server when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

SCHEMA CONTRACT (verbatim from docs/spec-nhanh.md section 0; do NOT invent or rename any field, function, collection or EP.* id; if something is missing, stop and report instead of guessing)
{{SCHEMA_CONTRACT}}

RULES: (1) Any ratio/percent/average guards denominator = 0 and returns "Không đủ dữ liệu" (never 0%, NaN, Infinity). (2) Numbers are computed by code in a pure function; AI only interprets. (3) Put pure logic in a function you can unit-test with node `vm`: write tests/{{FEATURE_NAME}}.cjs from tests/unit-template.cjs (runs in about 1 second, no browser).

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
4. Mobile-first (phones are what judges score): works at 360x780 and 390x844 (portrait), then 1440x900; no horizontal overflow; tap targets >= 48px, 8px apart; body 16px, inputs >= 16px; primary action via `EP.ui.actionBar(el, [...])`; forms/confirmations in `EP.ui.dialog` (becomes a bottom sheet); tables get a `label` per column (becomes cards); correct `type` in EP.form for the right keyboard (read references/13-chuan-mobile.md); keyboard focusable, visible focus ring, labels on inputs.
5. Verify with Playwright (`require('playwright')`, or `require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`, chromium.launch()): open http://localhost:{{PORT}}/?demo=1, go to `#/{{FEATURE_NAME}}`, walk through EVERY acceptance item, take screenshots at 390x844 and 360x780 (+ 1440x900) in light and dark, then OPEN the screenshots and LOOK at them (layout, clipping, contrast, Vietnamese diacritics). Fix what you see. Assert zero console errors / page errors.
6. Run `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-{{FEATURE_NAME}}` until green (shots dir is gitignored; do not commit screenshots). Write tests/{{FEATURE_NAME}}.cjs (URL from argv, same Playwright loader as tests/smoke.cjs) that asserts your acceptance items; run it. smoke.cjs reads EP.config.mockNotice, so a changed `mockNotice` must not break it; if it does, report it, do not edit smoke.cjs.
7. Check JS syntax (`node --check features/{{FEATURE_NAME}}/feature.js`) and CSS brace balance for any CSS you wrote.

GIT ({{COMMIT_MODE}})
- commit-on-worktree: commit on your worktree branch, message ending with the trailer lines:
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  Do NOT push, do NOT bump version.
- no-commit: do not commit or `git add`; leave changes in the working tree.

REPORT (brief, <= 15 lines): files changed; each acceptance item PASS/FAIL; what you VERIFIED (screenshots looked at, tests run with result) vs what you did NOT verify; any shared-file edit you wanted but did not make; known issues.
```
