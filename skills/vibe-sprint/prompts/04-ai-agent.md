# 04 - AI agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8213. Chủ của `js/ai.js`. Điền `{{AI_USES}}` = danh sách 1-3 tương tác AI từ spec (tên hàm, input, output JSON). Feature agent chỉ gọi `EP.ai.<tên>` nên **chốt chữ ký hàm trong spec trước** và dán vào prompt feature. Mock phải đủ tốt để demo thắng điểm; Gemini là tuỳ chọn khi có key.

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}" ({{FEATURE_DESC}}). Domain: {{DOMAIN}}. Judges must SEE AI value in the demo, with no network and no API key, and also be able to switch to real Gemini.

YOU OWN ONLY: js/ai.js, js/ai-mock-data.js (new), tests/ai.cjs (new) and docs/ai-prompts.md (new). Do NOT edit features/*, index.html (except if starter requires a script tag for js/ai-mock-data.js: add ONE line), css.

AI INTERACTIONS TO PROVIDE (keep these exact function names/signatures; they are the contract for feature agents):
{{AI_USES}}
Each returns a Promise of JSON with the shape given above, and also supports an options `{signal, onChunk}` for streaming-like typing effect if the starter supports it.

TASKS
1. Read js/ai.js (mock + Gemini path) fully. Keep its public API stable; extend, don't rewrite.
2. For each interaction write a prompt spec: system prompt (role, domain, output schema as strict JSON, Vietnamese output, length limits, forbid markdown fences), user prompt template with {{placeholders}} filled from the app data, and 1 few-shot example. Put them in js/ai.js as constants AND in docs/ai-prompts.md (the docs agent reuses them as "minh chứng AI").
3. Mock outputs: deterministic-looking but varied (seeded by input hash), REALISTIC for the domain: real-sounding Vietnamese terms, plausible numbers/units/dates, references to the user's actual input (echo names/values), 3+ distinct variants per interaction, a short simulated latency 600-1400ms with a typing/skeleton state. No lorem ipsum, no "AI generated text" filler, no English leaks.
4. Gemini path: when localStorage `ep.geminiKey` (or the starter's key name) is set, call the Gemini REST API (`generativelanguage.googleapis.com`, model gemini-2.0-flash or the starter default) with the prompt spec; request JSON (responseMimeType application/json), parse defensively (strip fences, try/catch), validate against the schema, on ANY failure fall back to mock and set a non-blocking notice. Never log or persist the key beyond localStorage; never commit a key. Timeout 15s.
5. Notice text (must be visible wherever AI output appears, via a small pill component EP.ai.notice()): mock -> "Bản demo vòng loại - Dữ liệu mô phỏng AI" ; Gemini live -> "Kết quả do Gemini tạo - hãy kiểm tra trước khi dùng" ; fallback -> "Không kết nối được AI - đang dùng dữ liệu mô phỏng". Plus a settings snippet (EP.ai.settingsUI()) to paste/clear the key.
6. Safety/UX: sanitize output before inserting (textContent, never innerHTML with AI text), max lengths, empty-input guard with Vietnamese message.

VERIFY
Write tests/ai.cjs (node + playwright): call each interaction in the page with 3 different inputs, assert JSON schema, assert variants differ, assert Vietnamese diacritics present, assert fallback works when Gemini key invalid (route fetch to fail). Screenshot the notice pill (light/dark) at 390 and 1440 and LOOK. Run tests/smoke.cjs and tests/ai.cjs until green.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push, no version bump.
REPORT briefly: API contract (function signatures), files, verified vs not, test results.
```
