# 07 - Deck agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8215. Bắt đầu sớm với nội dung chữ (từ spec); phần chụp ảnh chạy sau khi app đã merge/ổn định (spawn lần 2 hoặc gửi `send_message` tiếp). Chủ của `deck/`. Nếu cần bản 2: spawn song song 1 agent thiết kế lại cho second opinion.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve the APP with `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}": {{FEATURE_DESC}}. Features: {{FEATURE_LIST}}. Brand colors {{BRAND_COLORS}}. Deck language: Vietnamese. Presentation time: {{PITCH_MINUTES}} minutes, so ~{{SLIDE_COUNT}} slides.

YOU OWN ONLY: skills/vibe-sprint/deck/** copy as `deck/` at repo root if the starter says so (read deck/README), including deck data file, deck/shots/**, deck/out/**. Do NOT touch app code.

DECK KIT: data-driven deck.html (content lives in the data file, not in HTML), tools/capture.cjs (screenshots of the live app), tools/export.cjs (PDF). Read all three first.

TASKS
1. Fill deck data with a story arc that maps to the scoring criteria in spec-nhanh.md: 1 Title (name + tagline + team) / 2 Vấn đề (one real, concrete pain with a number) / 3 Giải pháp (one sentence + hero screenshot) / 4-7 One slide per P0 feature (screenshot + 2 bullets, benefit not tech) / 8 AI (what, mock vs Gemini, notice) / 9 Kiến trúc & công nghệ (small diagram, vanilla JS, no backend, offline) / 10 Kết quả kiểm thử (real numbers from qa reports, or "chưa đo" if absent - never invent) / 11 Tác động & mở rộng / 12 Demo + QR/link + cảm ơn. Max 12 slides, <= 25 words per slide body, one idea per slide.
2. Configure tools/capture.cjs list with routes/selectors for each feature (use ?demo=1), viewports 1440x900 (desktop) and 390x844 (mobile frame), light theme. Run it against http://localhost:{{PORT}}/ . OPEN each PNG and LOOK: crop out dev noise, no console banners, no empty states, Vietnamese text sharp. Re-capture until good.
3. Open deck.html in Playwright at 1920x1080, screenshot every slide, LOOK for overflow, orphan lines, low contrast, inconsistent spacing; fix data/CSS in deck/ only.
4. Run tools/export.cjs -> PDF; verify page count equals slide count, fonts embedded, file size < 20MB; render PDF page 1 and 3 to PNG and LOOK.
5. Speaker notes (Vietnamese, 20-30s per slide) in the data file if the kit supports it.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: slide list (titles), output paths (html, pdf, shots), verified vs not (which slides eyeballed), what data is still placeholder.
```
