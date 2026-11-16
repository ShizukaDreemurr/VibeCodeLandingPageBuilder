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
