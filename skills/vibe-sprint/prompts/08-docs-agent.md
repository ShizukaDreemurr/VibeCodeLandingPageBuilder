# 08 - Docs agent (Haiku)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8216. Spawn sớm để dựng khung, spawn/gửi tiếp lần 2 khi QA xong để điền số liệu thật. Chủ của `README.md`, `docs/**`. Dùng mẫu trong `skills/vibe-sprint/templates/`. Nguyên tắc cứng: **không bịa kết quả**.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}", live URL {{LIVE_URL}}, repo {{REPO_URL}}. Team: {{TEAM}}. Submission requirements are in spec-nhanh.md (section "Đề & tiêu chí chấm"). All documents in Vietnamese, professional, concise.

YOU OWN ONLY: README.md, docs/** (copy templates from skills/vibe-sprint/templates/ into docs/ and fill). Do NOT edit app code.

DELIVERABLES
1. README.md (dự thi): tên, mô tả 1 câu, link demo, ảnh hero (use deck/shots or capture your own), tính năng (table feature -> lợi ích), cách chạy (`python3 -m http.server 8000` is fine for USERS here; no build), công nghệ, cấu trúc thư mục, AI (mock vs Gemini + notice), nhóm, giấy phép.
2. docs/bang-kiem-thu.md: table ID | Chức năng | Bước | Kết quả mong đợi | Kết quả thực tế | Đạt/Không | Ngày giờ. Source of truth: qa/*-report.md and `node tests/*.cjs` outputs. RUN the tests yourself now and paste real counts. Rows you did not run must say "Chưa kiểm" - never PASS by assumption. Add summary line "X/Y đạt".
3. docs/minh-chung-ai.md: evidence of AI use. Source: docs/ai-prompts.md (prompt specs) and, if available, the session transcript (search for the prompts actually sent to the AI/agents; path given by coordinator: {{TRANSCRIPT_PATH}}; extract only prompts sent to AI, trimmed, no secrets/keys/personal data), plus screenshots of the AI feature in the app (mock notice visible). Format per the contest template (templates/). Each item: mục đích / prompt (rút gọn) / kết quả / chỉnh sửa của nhóm.
4. docs/kich-ban-demo.md: script {{PITCH_MINUTES}} minutes: table Thời gian | Màn hình | Thao tác | Lời nói | Điểm nhấn (maps to scoring criterion). Include the exact click path, `?demo=1` URL, fallback if network fails (offline works), and a 20-second version.
5. docs/hoi-dap.md: 15 likely judge Q&A (tính mới, tính khả thi, AI dùng ở đâu, dữ liệu thật hay mẫu, bảo mật, mở rộng, chi phí, so với đối thủ, hạn chế) with honest 2-3 sentence answers; admit mock data explicitly.
6. docs/checklist-nop-bai.md: each required file/link from the brief with status (đã có / thiếu) and path.

VERIFY
Check all internal links/paths exist (script it), screenshots referenced exist, no placeholder `{{...}}`/TODO left (grep), numbers match test outputs, Vietnamese diacritics intact. If PDF export of a doc is required, render and LOOK at page 1.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: files, which table rows are real vs "Chưa kiểm", missing inputs you need from the coordinator.
```
