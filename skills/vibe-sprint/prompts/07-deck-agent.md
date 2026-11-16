# 07 - Deck agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8225. Bắt đầu sớm với nội dung chữ (từ spec); phần chụp ảnh chạy sau khi app đã merge/ổn định (spawn lần 2 hoặc gửi `send_message` tiếp). Chủ của `deck/`. Nếu cần bản 2: spawn song song 1 agent thiết kế lại cho second opinion.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve the APP with `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}": {{FEATURE_DESC}}. Features: {{FEATURE_LIST}}. Brand/look {{BRAND_COLORS}} (brand kit: skills/vibe-sprint/brand/; deck accent via meta.accent / meta.accent2). Mock notice, if the deck mentions it, must be the organizers' VERBATIM wording: "{{MOCK_NOTICE}}" (the qualifier wording "Bản demo vòng loại - Dữ liệu mô phỏng AI" must not be assumed for the finals). Deck language: Vietnamese. Presentation time: {{PITCH_MINUTES}} minutes, so ~{{SLIDE_COUNT}} slides.

YOU OWN ONLY: `deck/` in the project root (the coordinator copies it from skills/vibe-sprint/deck/ with `cp -r`): your data file `deck/deck.data.js` (create from `deck/template.data.js`), `deck/tools/capture.json` (from capture.example.json), `deck/assets/**`, `deck/out/**` (git-ignored). Do NOT edit deck.html or deck/tools/*.cjs (layout is fixed; you only edit data), and do NOT touch app code.

DECK KIT: data-driven deck.html (content lives in deck.data.js, 12 slide types: cover, problem, solution, features, demo, flow, ai, quality, metrics, roadmap, team, thanks), tools/capture.cjs (screenshots of the live app), tools/export.cjs (PDF/PNG/PPTX). Read deck/README.md, template.data.js, example.data.js and both tools first. Preview: open deck/deck.html (it loads deck.data.js; `deck.html?data=example.data.js` shows the finished example).

TASKS
1. Fill `deck/deck.data.js` (the 12 numbered [1]..[12] fields of template.data.js) with a story arc that maps to the scoring criteria in docs/spec-nhanh.md, using the kit's slide order: cover / problem / solution / features (5) / flow / demo (url + image, QR auto-generated from meta.liveUrl) / ai (real vs mock vs controls; say honestly what is mock) / quality (rows from the real qa/*-report.md, or "chưa đo" if absent - never invent) / metrics (3-4 verifiable numbers) / roadmap / team / thanks. Max 12 slides, <= 25 words per slide body, one idea per slide, speaker `notes` in Vietnamese (20-30s per slide).
2. `cp deck/tools/capture.example.json deck/tools/capture.json`; set `base` to http://localhost:{{PORT}}/ and one `views` entry per feature (url like `index.html?demo=1#/<feature-id>`, optional `steps`/`selector`, `devices: ["desktop","mobile"]`). Run `node deck/tools/capture.cjs deck/tools/capture.json` (quick single shot: `node deck/tools/capture.cjs --url http://localhost:{{PORT}}/ --name home --mobile`). Images land in deck/assets/ (desktop 1600x1000; mobile `-m` 390x844). OPEN each PNG and LOOK: no console banners, no empty states, Vietnamese text sharp. Re-capture until good.
3. Open deck/deck.html in Playwright at 1920x1080, screenshot every slide, LOOK for overflow, orphan lines, low contrast, inconsistent spacing; fix data/CSS in deck/ only.
4. Run `node deck/tools/export.cjs` (uses deck.data.js; `--name <tên>`, `--scale 2` for 4K) -> deck/out/<name>.pdf and deck/out/png/slide-NN.png (and .pptx if pptxgenjs is installed in deck/); verify the PDF page count equals the slide count and the size is < 20MB; open slide PNGs 1 and 3 and LOOK.
5. Rehearse: press N in deck.html to see notes + timer; total target is {{PITCH_MINUTES}} minutes.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: slide list (titles), output paths (deck/deck.html, deck/deck.data.js, deck/out/*.pdf, deck/assets/*), verified vs not (which slides eyeballed), which fields are still placeholder.
```
