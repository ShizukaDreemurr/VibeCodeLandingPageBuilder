# 07 - Deck agent (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Port 8225. Bắt đầu sớm với nội dung chữ (từ spec); phần chụp ảnh chạy sau khi app đã merge/ổn định (spawn lần 2 hoặc gửi `send_message` tiếp). Chủ của `deck/`. Nếu cần bản 2: spawn song song 1 agent thiết kế lại cho second opinion.

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve the APP with `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

CONTEXT
Contest Đề {{DE_SO}}: {{DE_TEXT}}. App "{{APP_NAME}}": {{FEATURE_DESC}}. Features: {{FEATURE_LIST}}. Brand/look {{BRAND_COLORS}} (brand kit: skills/vibe-sprint/brand/; deck accent via meta.accent / meta.accent2). Mock notice, if the deck mentions it, must be the organizers' VERBATIM wording: "{{MOCK_NOTICE}}" (the qualifier wording "Bản demo vòng loại - Dữ liệu mô phỏng AI" must not be assumed for the finals). Deck language: Vietnamese. Presentation time: {{PITCH_MINUTES}} minutes, so ~{{SLIDE_COUNT}} slides.

YOU OWN ONLY: `deck/` in the project root (the coordinator copies it from skills/vibe-sprint/deck/ with `cp -r`): your data file `deck/deck.data.js` (create from `deck/template.data.js`), `deck/tools/capture.json` (from capture.example.json), `deck/assets/**`, `deck/out/**` (git-ignored). Do NOT edit deck.html or deck/tools/*.cjs (layout is fixed; you only edit data), and do NOT touch app code.

PORTRAIT-ONLY SCREENSHOTS (hard rule): finals judges score the app on PHONES (360-390px), so every app image on a slide is a PORTRAIT phone screenshot (9:19.5, 390x844 @3x = 1170x2532) shown inside the deck's phone frame. NEVER landscape/square/desktop shots in slides, never crop them to landscape, max 3 phones per slide. You (a Sonnet agent) capture them yourself by opening the web app in phone emulation (Playwright isMobile + hasTouch), light AND dark; nobody captures by hand.

DECK KIT: data-driven deck.html (content lives in deck.data.js, slide types: cover, problem, solution, features, demo, flow, ai, quality, metrics, roadmap, team, thanks, plus the portrait-phone layouts `phone` (1 phone + 3 numbered callouts), `phones-2`, `phones-3`, `phone-steps` (flow 1>2>3 with arrows); `cover` and `demo` with `device:'phone'` also show a phone), tools/capture.cjs (screenshots of the live app), tools/export.cjs (PDF/PNG/PPTX). Read deck/README.md, template.data.js, example.data.js and both tools first. Preview: open deck/deck.html (it loads deck.data.js; `deck.html?data=example.data.js` shows the finished example).

TASKS
1. Fill `deck/deck.data.js` (the 11 numbered [1]..[11] fields of template.data.js) with a story arc that maps to the scoring criteria in docs/spec-nhanh.md, using the kit's slide order: cover (phone) / problem / phone (solution + 3 callouts) / features (5) / phone-steps (flow, 3 portrait shots) / demo (device:'phone', url + portrait image, QR auto-generated from meta.liveUrl) / phones-3 (wrong input, edge case, dark theme) / ai (real vs mock vs controls; say honestly what is mock) / quality (rows from the real qa/*-report.md, or "chưa đo" if absent - never invent) / metrics (3-4 verifiable numbers) / roadmap / team / thanks. Slide sets are 11 / 7 / 5 by pitch length (10 / 5 / 3 minutes; speakers Diệu Anh 1–3 · Dũng 4–7 · Nguyên 8–11 for 11 slides; see references/05 and templates/KICH-BAN-DEMO.md), the deck kit has no `assumptions` type so the mandatory "Giả định & cách tính" slide (slide 10 / 5 / 4) uses `metrics`; <= 25 words per slide body, one idea per slide; speaker `notes` in Vietnamese with 5 lines: Người nói · Mốc giờ · V/T/S anchors · Cue kỹ thuật ("Mời chuyển slide.") · Chuyền mic. Image names follow the slot table in prompts/14 section 6 (01-tong-quan, 02-nhap-lieu, 03-ket-qua, 04-luu-xem-lai, 05..09-tinh-nang-N, 10-ca-sai, 11-ca-bien, 12-gia-dinh, 13-nhan-mo-phong).
2. `cp deck/tools/capture.example.json deck/tools/capture.json`; set `base` to http://localhost:{{PORT}}/ and one `views` entry per feature (url like `index.html?demo=1#/<feature-id>`, optional `steps`, `themes: ["light","dark"]`; do NOT use `selector`/`fullPage` for slide images, they break the 9:19.5 ratio). Defaults are already phone emulation: 390x844, deviceScaleFactor 3, isMobile+hasTouch. Run `node deck/tools/capture.cjs deck/tools/capture.json` (quick single shot: `node deck/tools/capture.cjs --url http://localhost:{{PORT}}/ --name 05-tinh-nang-1 --theme both`; every tab at once: `node deck/tools/capture.cjs --starter-shots http://localhost:{{PORT}}/`, which runs starter tools/shots-mobile.cjs into deck/assets/auto/). Images land in deck/assets/ as `NN-ten-mobile-light.png` / `-dark.png` (1170x2532). Also capture one 360x780 set (`"mobile": [360, 780]`) for the evidence docs. OPEN each PNG and LOOK: no console banners, no empty states, no horizontal scroll, Vietnamese text sharp. Re-capture until good. A desktop shot (`devices: ["desktop"]`) is evidence only, never put it in a slide.
3. Open deck/deck.html in Playwright at 1920x1080, screenshot every slide, LOOK for overflow, orphan lines, low contrast, inconsistent spacing; fix data/CSS in deck/ only.
4. Run `node deck/tools/export.cjs` (uses deck.data.js; `--name <tên>`, `--scale 2` for 4K) -> deck/out/<name>.pdf and deck/out/png/slide-NN.png (and .pptx if pptxgenjs is installed in deck/); verify the PDF page count equals the slide count and the size is < 20MB; open slide PNGs 1, 3 and every phone slide and LOOK (phones upright, not cropped to landscape, <= 3 per slide).
5. Rehearse: press N in deck.html to see notes + timer; total target is {{PITCH_MINUTES}} minutes.

GIT ({{COMMIT_MODE}}): worktree commit ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT briefly: slide list (titles), output paths (deck/deck.html, deck/deck.data.js, deck/out/*.pdf, deck/assets/*), verified vs not (which slides eyeballed), which fields are still placeholder.
```
