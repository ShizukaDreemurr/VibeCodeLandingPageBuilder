# 03 - Shell + Brand agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

> **Schema Contract bắt buộc.** Dán NGUYÊN VĂN khối **Schema Contract** (`{{SCHEMA_CONTRACT}}`, lấy từ `docs/spec-nhanh.md` mục 0) vào prompt này. Tên trường, tên hàm, tên collection, id `EP.*` phải đúng từng chữ như contract; **không tự đặt tên mới**. Thiếu tên thì dừng và hỏi điều phối, không đoán.

Spawn đợt 1, port 8212. Agent này là chủ của `index.html`, `js/config.js` (gồm câu nhãn mock), `css/tokens.css`, giao diện/preset. Tab tự dựng từ `EP.register` nên feature agent chỉ thêm một dòng script; merge shell trước feature. Điền `{{MOCK_NOTICE}}` bằng câu nhãn chép NGUYÊN VĂN từ đề/BTC (xem cảnh báo ở `00-README.md`).

```
Repo: {{REPO}} (vanilla JS, window.EP, no build). FIRST run `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

SCHEMA CONTRACT (verbatim from docs/spec-nhanh.md section 0; do NOT invent or rename any field, function, collection or EP.* id; if something is missing, stop and report instead of guessing)
{{SCHEMA_CONTRACT}}

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
