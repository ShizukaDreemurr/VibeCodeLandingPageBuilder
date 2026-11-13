# 03 - Shell + Brand agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn đợt 1, port 8212. Agent này là chủ của `index.html`, nav, trang chủ/landing, màu thương hiệu. Feature agent chỉ thêm một dòng script nên merge shell trước feature. Nếu chưa biết danh sách feature cuối, đưa danh sách dự kiến từ spec (nav sẽ đọc từ registry nên thêm/bớt dễ).

```
Repo: {{REPO}} (vanilla JS, window.EP, no build). FIRST run `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}
Product: "{{APP_NAME}}" - {{FEATURE_DESC}}. Brand colors: {{BRAND_COLORS}}. Vietnamese UI.
Planned features (nav items, in order): {{FEATURE_LIST}}.

YOU OWN: index.html, css/app.css (brand/tokens/layout), js/app.js (shell, router, nav), assets/** (logo/favicon svg). Do NOT touch features/*/ (other agents), js/ai.js, js/demo.js data content, deck/, docs/.

TASKS
1. Rename the app everywhere ("{{APP_NAME}}": <title>, header, meta description, og tags, favicon, footer, localStorage key prefix if the starter derives it from the name). grep the starter's old name to make sure none remains.
2. Design tokens: set --brand, --brand-2, --accent, surface/text/border tokens from {{BRAND_COLORS}} for light AND dark (prefers-color-scheme + a toggle button if the starter has one). Verify AA contrast for text and buttons. One font pair via system stack or a single Google Font with display=swap.
3. Nav: top bar (desktop) and bottom/tab or hamburger (390px) listing the features from the EP feature registry (do not hard-code feature internals; read the registry so features added later appear automatically; keep a static fallback list). Active-state indicator, keyboard accessible, hash routes.
4. Home/landing view (#home): hero with the one-sentence value proposition, 3 benefit cards, a primary CTA "Dùng thử với dữ liệu mẫu" -> `?demo=1`, a KPI strip that reads real numbers from the data layer (zero-safe), a "Cách hoạt động" 3-step strip, footer with team + contest line. Make it look designed (spacing scale, one accent, subtle motion respecting prefers-reduced-motion), not generic.
5. Demo banner when ?demo=1: small dismissible pill "Dữ liệu mẫu - xoá để bắt đầu".
6. Leave clear mount points `<div id="view-<feature>">` pattern as in the starter so features plug in without editing index.html further.
7. Keep the exact script-tag block in index.html in a clearly commented, alphabetically ordered "FEATURES" section, one tag per line (reduces merge conflicts). Keep CSS balanced; end each logical block with a comment marker.

VERIFY
Playwright screenshots at 1440x900 and 390x844, light and dark, of #home and nav on each existing route; OPEN and LOOK at them. No horizontal overflow, no console errors. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` until green; update tests only if selectors you intentionally changed break them.

GIT ({{COMMIT_MODE}}): commit on worktree branch ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
Do NOT push or bump version.
REPORT briefly: files changed, list of tokens/IDs other agents must know (view id pattern, nav registry API), verified vs not verified, test results.
```
