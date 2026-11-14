# 01 - Spec từ đề (coordinator tự làm, <= 5 phút)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Dùng khi vừa nhận đề. Coordinator (Sonnet) đọc prompt này như self-prompt, KHÔNG spawn agent. Kết quả: `spec-nhanh.md` ở gốc repo và bảng chia việc để điền vào 02-08. Nếu muốn second opinion: spawn song song 1 agent Sonnet với cùng prompt rồi so sánh (rẻ, nhanh).

```
You are the coordinator of a 60-minute contest sprint. Time budget for this step: 5 minutes. Output files only; no app code.

INPUT
- Contest brief (verbatim): {{DE_TEXT}}   (Đề số {{DE_SO}})
- Starter kit (already in repo {{REPO}}): skills/vibe-sprint/starter/ = vanilla JS, window.EP namespace, features/<name>/ plug-in pattern (clone features/_example), js/form.js validation, js/ai.js (mock + Gemini), charts.js, export.js, demo.js (?demo=1), tests/smoke.cjs.
- Deck kit: skills/vibe-sprint/deck/ (data-driven deck.html). Docs templates: skills/vibe-sprint/templates/.

DO
1. Read the brief twice. List every explicit requirement (R1..Rn), every scoring criterion, and the prohibited/required items (e.g. must use AI, must have demo video, deadline, format). Quote them.
2. Decide the product in ONE sentence: "{{APP_NAME}} giúp <ai> <làm gì> để <kết quả đo được>". Choose a Vietnamese app name, 3 brand colors (hex, with light+dark variants) fitting the domain, one font pair.
3. Split into 3-6 features (max 8). For each: FEATURE_NAME (kebab-case), one-line description, user-visible screens, data it reads/writes (localStorage key), which scoring criterion it earns, priority (P0 must ship / P1 / P2), and 3-5 ACCEPTANCE checks that are mechanically testable (selector or visible text + expected result), e.g. "Submit empty form -> 3 red errors with Vietnamese text; fill sample -> success toast and row appears in table".
4. Cross-cutting: shell (nav, home/landing view, brand), AI (what 1-3 AI interactions, mock output examples, Gemini optional), demo data plan (entities, counts 8-30 rows, realistic Vietnamese names/places/amounts, 2-3 edge cases such as overdue / empty / very long text), charts needed (which numbers), export needed (CSV/PDF/print).
5. Port + owner table: assign each agent a port from 8211-8230 and owned paths (no overlaps). List conflict hotspots (index.html script tags, css braces, feature registry).
6. Demo flow: a 3-minute story script outline (5 beats) that touches every P0 feature.
7. Risks and cut-lines: what to drop first if behind at minute 35 / 45 / 55.

WRITE `spec-nhanh.md` (Vietnamese, <= 150 lines) with sections: Đề & tiêu chí chấm / Sản phẩm / Brand / Feature table / AI / Demo data / Chart & export / Port & sở hữu / Kịch bản demo / Cắt giảm. Then print a ready-to-paste table: FEATURE_NAME | PORT | OWNED_PATHS | ACCEPTANCE.
Do not ask questions; make reasonable assumptions and write them under "Giả định".
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
```

**Sau bước này**: đọc lại `spec-nhanh.md` 30 giây, sửa nếu thiếu yêu cầu bắt buộc của đề, rồi spawn đợt 1 (02-05, 07, 08) trong một message.
