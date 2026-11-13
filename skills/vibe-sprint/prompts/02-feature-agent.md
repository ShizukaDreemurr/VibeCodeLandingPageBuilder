# 02 - Feature agent (mỗi feature một agent, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn: `Agent(subagent_type:"general-purpose", model:"sonnet", isolation:"worktree", run_in_background:true, description:"Feature {{FEATURE_NAME}}")`. Một message chứa tất cả feature agent. Điền toàn bộ `{{}}` từ `spec-nhanh.md`. Port theo bảng ở 00 (8217-8224). Muốn second opinion: spawn thêm 1 agent cùng feature với port khác và chọn bản tốt hơn.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP namespace, no build step). FIRST run `git reset --hard {{BRANCH}}`. Serve with `python3 -m http.server {{PORT}}` from YOUR worktree root (never port 8000; kill the server when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT (self-contained)
Contest: Đề {{DE_SO}}. App "{{APP_NAME}}". Brief summary: {{DE_TEXT}}. UI text is Vietnamese (with diacritics), code/comments English. Brand colors: {{BRAND_COLORS}} (use CSS variables from css/app.css, never hard-code colors; must work in light and dark).

YOUR FEATURE: {{FEATURE_NAME}} - {{FEATURE_DESC}}
ACCEPTANCE (all must pass and be verified by you):
{{ACCEPTANCE}}

OWNERSHIP
You own ONLY: features/{{FEATURE_NAME}}/** (and tests/{{FEATURE_NAME}}.cjs). Plus exactly one registration line wherever the starter registers features (see features/_example and index.html: one <script src="features/{{FEATURE_NAME}}/index.js?v=1"> tag and, if used, one entry in the feature list). Do NOT edit js/*.js shared files, css/app.css, index.html beyond that single line, or other features' folders. Other agents are changing the shell/nav (shell agent), js/ai.js (AI agent), js/demo.js (data agent). If you need a shared helper that is missing, write it privately inside your folder and mention it in the report.

HOW
1. Read: features/_example/* (clone this pattern exactly: file layout, EP.register/EP.features API, render + mount + unmount), js/form.js (use EP.form validation for every form: required, Vietnamese error text under field, red state, focus first invalid), js/ai.js (call EP.ai.* only; never fetch Gemini yourself), js/charts.js, js/export.js, js/demo.js (read how ?demo=1 seeds; add your own seed function inside your folder and register it with the demo hook if the starter provides one), tests/smoke.cjs.
2. `cp -r features/_example features/{{FEATURE_NAME}}`, rename identifiers (namespace EP.features.{{FEATURE_NAME}}, DOM ids prefixed `{{FEATURE_NAME}}-`, localStorage key `ep.{{FEATURE_NAME}}`).
3. Implement the screens: list/table with empty state, create/edit form with validation, delete with confirm, search/filter if relevant, a chart or KPI strip if the spec says so, export button if spec says so. Include loading/empty/error states and sensible demo data when ?demo=1.
4. Responsive: works at 390x844 and 1440x900, no horizontal overflow, tap targets >= 40px, keyboard focusable, visible focus ring, labels on inputs.
5. Verify with Playwright (preinstalled; `require('playwright')`, chromium.launch()): open http://localhost:{{PORT}}/?demo=1, navigate to your feature, walk through EVERY acceptance item, take screenshots at 1440x900 and 390x844 in light and dark, then OPEN the screenshots and LOOK at them (layout, clipping, contrast, Vietnamese diacritics). Fix what you see. Assert zero console errors / page errors.
6. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` (read the file head for args) until green. Add a small tests/{{FEATURE_NAME}}.cjs that asserts your acceptance items; run it.
7. Check JS syntax (`node --check`) and CSS brace balance for any CSS you wrote (keep CSS inside your feature folder, scoped under `.{{FEATURE_NAME}}-root`).

GIT ({{COMMIT_MODE}})
- commit-on-worktree: commit on your worktree branch, message ending with the trailer lines:
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  Do NOT push, do NOT bump version.
- no-commit: do not commit or `git add`; leave changes in the working tree.

REPORT (brief, <= 15 lines): files changed; each acceptance item PASS/FAIL; what you VERIFIED (screenshots looked at, tests run with result) vs what you did NOT verify; any shared-file edit you wanted but did not make; known issues.
```
