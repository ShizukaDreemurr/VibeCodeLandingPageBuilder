# 04 - AI agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8213. Starter đã có sẵn lớp AI hoàn chỉnh `js/ai.js` (`EP.ai.generate`, 3 chế độ mock / gemini / paste, kiểm tra schema, đổi model, rơi về mock). Việc của agent này là viết **đặc tả AI cho từng tương tác** (prompt + schema + mock chất lượng cao) trong file mới `js/ai-specs.js`, KHÔNG viết lại `ai.js`. Điền `{{AI_USES}}` = danh sách 1-3 tương tác AI từ spec (tên spec, input, output JSON). Feature agent chỉ gọi `EP.ai.generate(EP.aiSpecs.<tên>, { input })` nên **chốt tên + input + schema trong spec trước** và dán vào prompt feature. Mock phải đủ tốt để demo thắng điểm; Gemini là tuỳ chọn khi có key.

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}" ({{FEATURE_DESC}}). Domain: {{DOMAIN}}. Judges must SEE AI value in the demo, with no network and no API key, and also be able to switch to real Gemini or copy-paste mode (both already implemented in js/ai.js).
MOCK NOTICE: the exact wording comes VERBATIM from the organizers' brief and is already set (or will be set by the shell agent) in js/config.js `mockNotice`: "{{MOCK_NOTICE}}". Never hardcode, retype or paraphrase it anywhere; always show it through EP.ai.noticeHtml(result) / EP.ai.MOCK_NOTICE. (The qualifier-round wording was "Bản demo vòng loại - Dữ liệu mô phỏng AI"; do NOT assume the finals use it.)

YOU OWN ONLY: js/ai-specs.js (the shell agent creates a stub `EP.aiSpecs = EP.aiSpecs || {}`; fill it), tests/ai.cjs (new) and docs/ai-prompts.md (new). Do NOT edit js/ai.js (read it fully; if you find a real bug, report it with a repro instead), features/*, index.html (the shell agent already added the script tag; if missing add exactly ONE line `<script src="js/ai-specs.js"></script>` after the optional modules and before the features), css.

THE REAL API (js/ai.js; do not invent names)
- `EP.ai.generate(spec, { input, mode?, key?, model?, instant?, fallbackToMock?, onSwitch? })` -> Promise<{ data, mode, model, notice, warnings, prompt }>. mode defaults to the user's choice in Cài đặt ('mock' | 'gemini' | 'paste').
- spec = { id, prompt: function (input) -> string | string, schema, mock: function (input) -> object, temperature? }. The framework appends the JSON-shape instructions and the "do not invent numbers/names" line to the prompt automatically, then validates/coerces the result against `schema`, retries once on a bad shape, and falls back to spec.mock with a warning.
- schema types: string{min,max,enum,optional}, number{min,max,integer}, boolean, array{of,min,max}, object{props}; every field is required unless optional:true.
- Rendering: `EP.ai.noticeHtml(result)` (mock -> the MOCK_NOTICE pill; gemini/paste -> "kiểm tra lại" note), `EP.ai.mountModePicker(el)`, `EP.ai.mountSettings(el)` (already used in the Cài đặt view), `EP.ai.getMode()`, `EP.ai.validate(value, schema)`, `EP.ai.extractJson(text)`.
- Gemini key: entered by the user in Cài đặt, kept in page memory (localStorage only if they tick "Nhớ key"); sent in header x-goog-api-key; model list/fallbacks in EP.ai.MODELS / FALLBACKS (default gemini-3.6-flash; list: 3.6 Flash, 3.8 Flash, 4 Hydrogen — no Lite, no Pro). Never log, commit or hard-code a key.
- Helpers for mocks (js/mock.js): EP.mock.hash / rng / pick / pickN / keywords / sentiment / classify / template; (js/match.js) EP.text.normalize, EP.match.faq / search; (js/metrics.js) EP.metrics.*.

AI INTERACTIONS TO PROVIDE (keep these exact spec names, input shapes and schemas; they are the contract for feature agents):
{{AI_USES}}

TASKS
1. Read js/ai.js and features/_example/feature.js ([4] AI_SPEC) fully, plus js/mock.js. Extend by adding specs, never rewrite the framework.
2. For each interaction write `EP.aiSpecs.<name> = { id, prompt, schema, mock, temperature }`: prompt in Vietnamese (role, domain, input fields interpolated from `input`, length limits; exact facts such as dates, prices, names always come from the input/form, the AI only writes text), a strict schema with enum/min/max, and a mock that is deterministic for the same input (seed with EP.mock.hash(JSON.stringify(input))) yet varied across inputs: 3+ distinct phrasings, REALISTIC for the domain (real-sounding Vietnamese terms, plausible numbers/units), echoing the user's actual input values, no lorem ipsum, no English leaks, no clichés. The framework already adds the 450-800ms fake latency and the notice; do not add your own.
3. Put the same prompts (as readable text, with the schema and one good/bad example) in docs/ai-prompts.md; the docs agent reuses it as "minh chứng AI".
4. Safety/UX: text inserted into innerHTML must go through EP.esc; empty-input guard messages in Vietnamese belong to the feature form (EP.form rules), mention them to the feature agents in your report.

VERIFY
Write tests/ai.cjs (node + Playwright; URL from argv, same loader as tests/smoke.cjs): in the page call `EP.ai.generate(EP.aiSpecs.<name>, { input, mode: 'mock', instant: true })` with 3 different inputs per spec, assert the result passes `EP.ai.validate(..., spec.schema).ok`, assert same input -> same output, different inputs -> different outputs, assert Vietnamese diacritics present, assert `EP.ai.noticeHtml(result)` contains `EP.ai.MOCK_NOTICE`, and assert a Gemini call with an invalid key (route the fetch to 400) degrades to mock with a warning. Screenshot the notice pill (light/dark, 390 and 1440) in a feature that uses it and LOOK. Run `node tests/smoke.cjs http://localhost:{{PORT}}/` and tests/ai.cjs until green.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push, no version bump.
REPORT briefly: API contract (function signatures), files, verified vs not, test results.
```
