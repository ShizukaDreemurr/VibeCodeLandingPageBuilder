# 08 - Docs agent (Haiku)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8226. Spawn sớm để dựng khung, spawn/gửi tiếp lần 2 khi QA xong để điền số liệu thật. Chủ của `README.md`, `docs/**`. `scripts/new-project.sh` đã chép sẵn mẫu vào dự án (README.md từ `README-du-thi.md`, `CLAUDE.md`, và `docs/spec-nhanh.md, PROGRESS.md, DECISIONS.md, BANG-KIEM-THU.md, MINH-CHUNG-AI.md, KICH-BAN-DEMO.md, HOI-DAP.md, CHECKLIST-CHUNG-KET.md`); agent điền vào các file đó, không tạo tên khác. Nguyên tắc cứng: **không bịa kết quả**.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}", live URL {{LIVE_URL}}, repo {{REPO_URL}}. Team: {{TEAM}}. Submission requirements are in docs/spec-nhanh.md (section "Đề & tiêu chí chấm").
MOCK NOTICE: README, docs and screenshots must quote the organizers' wording VERBATIM: "{{MOCK_NOTICE}}" (copy it, never retype or paraphrase; the qualifier wording "Bản demo vòng loại - Dữ liệu mô phỏng AI" must NOT be used unless the coordinator's {{MOCK_NOTICE}} is exactly that). Never write "AI thật" when the screenshot/test ran in mock mode. All documents in Vietnamese, professional, concise.

YOU OWN ONLY: README.md, docs/** (the template files are already there; fill them). Do NOT edit app code.

DELIVERABLES
1. README.md (from the README-du-thi template): tên, mô tả 1 câu, link demo, ảnh hero (PORTRAIT phone screenshot only, 390x844@3x = 1170x2532, light and dark; use the team's own deck/assets/*-mobile-*.png from the deck agent, or capture your own with `node tools/shots-mobile.cjs http://localhost:{{PORT}}/ shots-mobile` / `node deck/tools/capture.cjs`; no landscape or desktop shots in README/docs except one clearly labelled desktop evidence shot; deck/example/assets/ holds only the Xclipse sample images, never use them for the contest app), tính năng (table feature -> lợi ích), cách chạy (`python3 -m http.server 8211` then open http://localhost:8211/ ; no build), kiểm thử (`node tests/smoke.cjs http://localhost:8211/`), công nghệ, cấu trúc thư mục (index.html, css/, js/, features/, tests/, tools/), AI (mock vs Gemini vs copy-dán + the verbatim notice), nhóm, giấy phép, plus the sections the finals rules require (see templates/README-du-thi.md mục 13-17 and `node scripts/nop-bai.mjs` checks): "Dữ liệu" (BTC file / sample / simulated, each labelled), "Giả định & cách tính", "Khung chuẩn bị trước" with the sentence "khung `vibe-sprint` chung (không chứa logic của đề) được chuẩn bị trước giờ thi; toàn bộ tính năng, dữ liệu và giao diện theo đề được xây trong 60 phút thi", "Công cụ AI", and the closing-time evidence (docs/minh-chung/ + commit hash). Do not leave any `<...>` or `{{...}}` in README.md.
2. docs/BANG-KIEM-THU.md (fill the template's TC/M1–M5 tables, mobile checked at BOTH 360 and 390): table ID | Chức năng | Bước | Kết quả mong đợi | Kết quả thực tế | Đạt/Không | Ngày giờ. Source of truth: qa/*-report.md and the outputs of `node tests/smoke.cjs http://localhost:{{PORT}}/` and the other tests/*.cjs. RUN the tests yourself now and paste real counts. Rows you did not run must say "Chưa kiểm" - never PASS by assumption. Add summary line "X/Y đạt".
3. docs/MINH-CHUNG-AI.md: evidence of AI use. Source: docs/ai-prompts.md (prompt specs from the AI agent) and, if available, the session transcript (search for the prompts actually sent to the AI/agents; path given by coordinator: {{TRANSCRIPT_PATH}}; extract only prompts sent to AI, trimmed, no secrets/keys/personal data), plus screenshots of the AI feature in the app (PORTRAIT phone screenshots, 390x844@3x, mock notice visible; captured by a Sonnet agent in phone emulation, never by hand). Format per docs/MINH-CHUNG-AI.md (template). Each item: mục đích / prompt (rút gọn) / kết quả / chỉnh sửa của nhóm.
4. docs/KICH-BAN-DEMO.md: script {{PITCH_MINUTES}} minutes: table Thời gian | Màn hình | Thao tác | Lời nói | Điểm nhấn (maps to scoring criterion). Include the exact click path, `?demo=1` URL, fallback if network fails (offline works), and a 20-second version.
5. docs/HOI-DAP.md: 15 likely judge Q&A (tính mới, tính khả thi, AI dùng ở đâu, dữ liệu thật hay mẫu, bảo mật, mở rộng, chi phí, so với đối thủ, hạn chế) with honest 2-3 sentence answers; admit mock data explicitly.
6. docs/CHECKLIST-CHUNG-KET.md is the day-of checklist: fill its `<...>` fields (product name, sample-data button name) and tick only what is really done; its section G table lists the 4 submission items (link demo, source code, README, closing-time evidence) with status and path. Do NOT create a second checklist file.

VERIFY
Check all internal links/paths exist (script it), screenshots referenced exist, no placeholder `{{...}}`/`<…>`/TODO left (`grep -rn '<…>\|{{\|TODO' README.md docs`), numbers match test outputs, Vietnamese diacritics intact. If PDF export of a doc is required, render and LOOK at page 1.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: files, which table rows are real vs "Chưa kiểm", missing inputs you need from the coordinator.
```
