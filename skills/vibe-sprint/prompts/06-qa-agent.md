# 06 - QA agent (Haiku checklist / Sonnet nếu cần sửa logic)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Chạy trên **nhánh đã merge** (sau bước merge đầu tiên). Spawn 2-3 agent song song, chia theo `{{QA_SCOPE}}`: (a) nhóm feature A + viewport 390, (b) nhóm feature B + viewport 1440, (c) second-opinion toàn app light/dark + a11y. Port 8225-8227. Haiku cho checklist + sửa lỗi nhỏ; Sonnet khi bug cần hiểu logic.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP). FIRST `git reset --hard {{BRANCH}}` (the merged integration branch). Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
App "{{APP_NAME}}" for contest Đề {{DE_SO}}. Spec: read `spec-nhanh.md` in repo root (acceptance per feature). Your scope: {{QA_SCOPE}}.

DO
1. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` and every tests/*.cjs relevant to your scope (read file heads; if a test hardcodes a port, run a temp copy pointed at {{PORT}} and delete it; never commit port edits). Record PASS/FAIL per test.
2. Per feature in scope, with `?demo=1` AND with empty storage: walk every ACCEPTANCE item from the spec by Playwright, assert it, and record result. Test: submit empty form (errors in Vietnamese, focus on first invalid), invalid formats, very long text, double-click submit, delete then undo/confirm, refresh persists, export works (file non-empty), AI buttons show the notice pill, back/forward, hash routes, unknown route.
3. Screenshots at 1440x900 and 390x844, light AND dark, for each view. OPEN them and LOOK. Check: horizontal overflow (document.scrollingElement.scrollWidth <= innerWidth), clipped/overlapping text, low contrast, broken diacritics, `undefined`/`NaN`/`[object Object]`, English leftovers, stuck skeletons, layout shift, tap targets < 40px, missing focus ring, console/page errors, failed network requests (404 for assets).
4. FIX small bugs yourself (CSS tweaks, copy typos, missing label, off-by-one, null guard) with minimal diffs in the file that owns them. Do NOT refactor, do NOT change features' behavior, do NOT touch files outside what is needed. For bugs > 15 minutes or touching shared architecture: do not fix; report with repro steps.
5. Re-run the failing checks after each fix until green.
6. Write results to `qa/{{PORT}}-report.md` (table: check | viewport | theme | result | evidence screenshot path | note). Real results only: never write PASS for something you did not run. This file feeds the docs agent's bảng kiểm thử.

GIT ({{COMMIT_MODE}}): commit only the fixes + qa report on worktree branch, message ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: counts (checks run / pass / fail / fixed), list of unfixed bugs with repro, verified vs not verified.
```
