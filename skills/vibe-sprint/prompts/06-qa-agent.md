# 06 - QA agent (Haiku checklist / Sonnet nếu cần sửa logic)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

> **Schema Contract bắt buộc.** Dán NGUYÊN VĂN khối **Schema Contract** (`{{SCHEMA_CONTRACT}}`, lấy từ `docs/spec-nhanh.md` mục 0) vào prompt này. Tên trường, tên hàm, tên collection, id `EP.*` phải đúng từng chữ như contract; **không tự đặt tên mới**. Thiếu tên thì dừng và hỏi điều phối, không đoán.

Chạy trên **nhánh đã merge** (sau bước merge đầu tiên). Spawn 2-3 agent song song, chia theo `{{QA_SCOPE}}`: (a) nhóm feature A + điện thoại 390×844, (b) nhóm feature B + điện thoại 360×780, (c) second-opinion toàn app light/dark + a11y. Port 8227-8229 (QA #1..#3). Haiku cho checklist + sửa lỗi nhỏ; Sonnet khi bug cần hiểu logic.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP). FIRST `git reset --hard {{BRANCH}}` (the merged integration branch). Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

SCHEMA CONTRACT (verbatim from docs/spec-nhanh.md section 0; do NOT invent or rename any field, function, collection or EP.* id; if something is missing, stop and report instead of guessing)
{{SCHEMA_CONTRACT}}

RULE: also grep the code for names that differ from the contract (e.g. two spellings of one field) and report each mismatch with file:line; check every ratio with denominator 0 shows "Không đủ dữ liệu".

CONTEXT
App "{{APP_NAME}}" for contest Đề {{DE_SO}}. Spec: read `docs/spec-nhanh.md` (acceptance per feature). Your scope: {{QA_SCOPE}}.
MOCK NOTICE: the exact string in js/config.js `mockNotice` must equal the organizers' wording given by the coordinator: "{{MOCK_NOTICE}}" (verbatim; "Bản demo vòng loại - Dữ liệu mô phỏng AI" was the qualifier wording, history only). Check it appears in the footer (#ft-notice, mock mode) and next to every AI output, in README/docs/slides; tests/smoke.cjs reads EP.config.mockNotice so it needs no edit.

DO
1. Run `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-qa-{{PORT}}` and every tests/*.cjs relevant to your scope (they take the URL from argv; if one hardcodes a port, run a temp copy pointed at {{PORT}} and delete it; never commit port edits). Record PASS/FAIL per test.
2. Per feature in scope, with `?demo=1` AND with empty storage: walk every ACCEPTANCE item from the spec by Playwright, assert it, and record result. Test: submit empty form (errors in Vietnamese, focus on first invalid), invalid formats, very long text, double-click submit, delete then undo/confirm, refresh persists, export works (file non-empty), AI buttons show the notice pill, back/forward, hash routes, unknown route.
3. Screenshots at 390x844 and 360x780 (portrait phone emulation, DPR 3, isMobile + hasTouch) plus one 1440x900, light AND dark, for each view. OPEN them and LOOK. Check: horizontal overflow (document.scrollingElement.scrollWidth <= innerWidth), clipped/overlapping text, low contrast, broken diacritics, `undefined`/`NaN`/`[object Object]`, English leftovers, stuck skeletons, layout shift, tap targets < 48px, missing focus ring, console/page errors, failed network requests (404 for assets).
4. FIX small bugs yourself (CSS tweaks, copy typos, missing label, off-by-one, null guard) with minimal diffs in the file that owns them. Do NOT refactor, do NOT change features' behavior, do NOT touch files outside what is needed. For bugs > 15 minutes or touching shared architecture: do not fix; report with repro steps.
5. Re-run the failing checks after each fix until green.
6. Write results to `qa/{{PORT}}-report.md` (table: check | viewport | theme | result | evidence screenshot path | note). Real results only: never write PASS for something you did not run. This file feeds the docs agent's docs/BANG-KIEM-THU.md.

GIT ({{COMMIT_MODE}}): commit only the fixes + qa report on worktree branch, message ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: counts (checks run / pass / fail / fixed), list of unfixed bugs with repro, verified vs not verified.
```
