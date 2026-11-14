# 10 - Polish agent (10 phút cuối, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Spawn 2-3 agent song song, mỗi agent một view/nhóm file riêng ({{POLISH_SCOPE}}) để không đè nhau. Port 8228-8229. Chỉ chạy khi nhánh tích hợp xanh test. Thời hạn cứng: 8 phút, rồi coordinator merge.

```
Repo: {{REPO}} (vanilla JS mini-app "{{APP_NAME}}", window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

TIME BOX: 8 minutes. Only low-risk, high-visibility changes. Scope (you may edit only these): {{POLISH_SCOPE}}.

CHECKLIST (do in this order, screenshot before/after at 1440x900 and 390x844, light and dark, and LOOK at each):
1. Visual hierarchy: one clear primary action per screen, heading sizes (h1 >= 28px desktop), consistent spacing scale (4/8/12/16/24/32), aligned grids, no orphan single-word lines, consistent radius/shadow.
2. Empty states: every list/table/chart with no data shows an icon-or-illustration (inline SVG), one-line explanation, and a primary button ("Thêm ... đầu tiên" or "Nạp dữ liệu mẫu").
3. Loading/AI states: skeleton or typing indicator, never a blank flash.
4. Motion (subtle, 150-300ms, ease-out): button press, card hover lift, list item enter fade/slide, number count-up on KPI, toast slide. Only transform/opacity. Respect `prefers-reduced-motion: reduce` (disable all). No layout-shifting animation.
5. Copy: Vietnamese, friendly, specific, consistent terms (one word per concept), correct diacritics, sentence case, error messages say how to fix; remove leftover English/lorem/"TODO"/starter names.
6. Details: favicon + title, focus rings, hover/active/disabled states, tap target >= 40px, long-text truncation with title attr, number/date formatting vi-VN (1.250.000 ₫, 13/11/2026), table alignment (numbers right).
7. Contrast AA in both themes; dark mode has no white flashes or unreadable charts.
Do NOT change behavior, data schema, IDs/selectors used by tests, or add dependencies. If a change needs more than 3 minutes, skip it and list it.

VERIFY: `node tests/smoke.cjs http://localhost:{{PORT}}/` plus feature tests in scope, zero console errors, CSS braces balanced, `node --check` for JS.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: what changed per item (1-7), skipped items, verified vs not, test results.
```
