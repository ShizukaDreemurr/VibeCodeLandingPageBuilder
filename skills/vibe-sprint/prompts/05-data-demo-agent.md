# 05 - Data demo agent (Haiku)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8214. Chủ của `js/demo.js` (+ `data/`). Cần schema từng feature (key localStorage, trường) -> lấy từ bảng feature trong `spec-nhanh.md` và dán vào `{{SCHEMAS}}`. Nếu feature agent đổi schema, báo coordinator sửa lại ở bước merge (hoặc spawn lại agent này sau merge).

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}", domain {{DOMAIN}}. Opening the app with `?demo=1` must seed realistic Vietnamese demo data so judges see a living product in 1 click.

YOU OWN ONLY: js/demo.js, data/** (new, optional JSON), tests/demo.cjs (new). Do NOT edit features/*, css, index.html, js/ai.js.

SCHEMAS (localStorage key -> fields) you must fill:
{{SCHEMAS}}

TASKS
1. Read js/demo.js and how the starter seeds (version flag, idempotent, `?demo=1` seeds once, `?demo=0` or a "Xoá dữ liệu mẫu" button clears). Keep that mechanism; bump the demo VERSION constant when data changes.
2. Produce realistic data: 12-30 rows per main entity. Real-sounding Vietnamese full names (mixed regions), real districts/cities (no real private persons, no real brands/phone numbers: use 09xx xxx xxx style fake numbers like 0901 234 567 only with obviously fake patterns, emails @example.com), plausible amounts in VND (formatted 1.250.000 ₫), dates relative to today (generate with Date so charts always look current: last 30 days, a few future items), mixed statuses (done / in progress / overdue / cancelled), 2-3 edge cases (very long name, empty optional field, zero value) and one "hero" record that is perfect for the demo script.
3. Time series for charts: 30 days with a believable trend (weekly seasonality, one spike, one dip), not random noise.
4. Consistency: foreign keys valid, totals add up, no duplicate ids, sorted sensibly, Vietnamese diacritics correct (NFC).
5. Provide `EP.demo.reset()` and `EP.demo.seed()` if the starter lacks them.

VERIFY
Playwright: open http://localhost:{{PORT}}/?demo=1 at 1440x900 and 390x844, visit every route, screenshot and LOOK: no `undefined`/`NaN`/`[object Object]`/English placeholders, no overflow from long names, charts non-empty. tests/demo.cjs asserts counts and no NaN text on each route. Run tests/smoke.cjs too.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly (<= 10 lines): entities x counts, files, verified vs not, test results.
```
