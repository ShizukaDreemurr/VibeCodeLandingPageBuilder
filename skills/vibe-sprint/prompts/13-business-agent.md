# 13 - Agent "Giả định & mô hình kinh doanh" (Bảng Kinh tế, Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

> **Schema Contract bắt buộc.** Dán NGUYÊN VĂN khối **Schema Contract** (`{{SCHEMA_CONTRACT}}`, lấy từ `docs/spec-nhanh.md` mục 0, kèm danh sách Giả định T+5) vào prompt này. Tên trường, tên hàm, tên collection, id `EP.*` phải đúng từng chữ; **không tự đặt tên mới**. Thiếu tên thì dừng và hỏi điều phối.
>
> **Luật "không làm sẵn tính năng cho đề".** Agent chỉ được dùng khung chung (`EP.scenario`, `EP.importer`, tài liệu `references/11`, `12`, `kien-thuc/`). Mô hình, giả định, dữ liệu của đề phải viết SAU khi đề công bố, trong giờ thi. Không chép số hoặc code từ bài luyện (`catalog/`, `features/_playground`) sang bài thi.

Port 8231. Dùng cho Bảng Kinh tế (mô hình KD 22 · giả định/dự phòng 17 · cơ chế ưu đãi thực tế 10). Chạy song song với feature agent từ T+8; không thay `prompts/02-feature-agent.md` cho các tính năng khác. Điền `{{DE_TEXT}}`, `{{BTC_FILES}}` (tên file/sheet dữ liệu BTC, nếu có), `{{MODEL_FEATURE}}` (id feature của màn mô hình, mặc định `model`), `{{MOCK_NOTICE}}`.

```
Repo: {{REPO}} (vanilla JS mini-app, window.EP, no build). FIRST run `git reset --hard {{BRANCH}}`. Serve with `python3 -m http.server 8231` from YOUR worktree root (never port 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

SCHEMA CONTRACT + ASSUMPTION LIST (verbatim from docs/spec-nhanh.md section 0; do NOT invent or rename any field, function, collection or EP.* id; if something is missing, stop and report instead of guessing)
{{SCHEMA_CONTRACT}}

RULES
1. Code computes numbers (pure `compute(a)` in EP.scenario); AI only narrates. Denominator <= 0 -> return the string "Không đủ dữ liệu" (never 0%, NaN, Infinity; note EP.metrics.div(a,b,null) still returns 0, write `b > 0 ? a / b : null`).
2. "No pre-built features for the contest": do not copy numbers or code from catalog/ or features/_playground. The model for THIS brief is written now, from the brief and BTC files. Only the generic modules (EP.scenario, EP.importer) are reused.
3. Date/time/place/price/person names always come from the brief or the form; AI never writes them.
4. Every number gets a label (same trio as EP.scenario TAGS): "Dữ liệu mẫu (BTC)" (from BTC file, `source: 'sample'`), "Giả định" (our choice), "Mô phỏng" (generated, `tag: 'mock'`). Mock notice text is VERBATIM from the brief and lives only in js/config.js `mockNotice`: "{{MOCK_NOTICE}}"; never retype it, render with EP.ai.noticeHtml.
5. A number that is not in the brief, a BTC file, or a cited source is "giả định cần nêu nguồn": give value, unit, min, max, one-line reason, direction (better up/down). Never present an invented number as a fact.

CONTEXT
Contest brief: {{DE_TEXT}}
BTC data files: {{BTC_FILES}}   Feature owning the model screen: {{MODEL_FEATURE}} (features/{{MODEL_FEATURE}}/feature.js).

READ FIRST (fully, in this order)
- skills/vibe-sprint/references/11-mo-hinh-kinh-doanh.md (formulas, EP.scenario / EP.importer usage, promo mechanism, checklist)
- skills/vibe-sprint/references/12-khung-kinh-doanh-cho-de.md (which framework in which order; fill-in templates; table 8.1 of sourced numbers vs 8.2 of unsourced; promo checklist section 10)
- Only the sections of skills/vibe-sprint/references/kien-thuc/ that section 11 of file 12 points to for THIS brief (all 10 files 01-10 exist; read kien-thuc/README.md for the index). Typical picks: 05 §4.2-4.4, §7, §8.3, §6.5 (marketplace, vouchers, ads); 02 §2.2 and §2.5 (USP) with 03 Phần 2-3 (copy formulas, headline for the USP/CTA line); 06 Bài 8 §2, Bài 11 §2 and 10 Ch.1 §1.3, Ch.3 §3.2 (break-even, 3 scenarios, monthly cash-flow forecast, P&L formulas, risks); 08 Bài 8-10 (price formulas, ad-budget break-even, promotion program 7 steps); 09 Phần II §4.4 (web funnel efficiencies) and §6.2 (T = P + O); 01 §2 and 07 (segment, persona, how to validate assumptions). Cite as `file 05 §4.4`.
- js/scenario.js and js/import.js head comments, features/_playground/feature.js (SHOP, mountBiz, mountImport) for API only.

YOU OWN ONLY: features/{{MODEL_FEATURE}}/** (assumptions + compute + EP.scenario.mount + promo card + risk table), docs/assumptions.md (new, section "Giả định & cách tính"), tests/model.cjs (new, node vm + optional Playwright), and a USP strip (one sentence) inside the same feature view. Do NOT edit js/*.js shared modules, css/app.css, tests/smoke.cjs, or other features. Another agent owns js/config.js and index.html except ONE script line for your feature.

TASKS
1. Fill EP.scenario assumptions (from the Schema Contract list first; add only what the brief needs). For each: key, label, unit, value, min, max, step, better ('up'|'down'|omit), why (one line: "Giả định: ... vì ..." or "Theo file BTC <sheet>: ..."), source ('sample' for BTC, otherwise tag). Include a "Dự phòng" line (10-15% of costs, sens:false) and cost lines taken from references/12 section 8 when the brief sells via a marketplace (platform fee, tax, CPC, CR, return rate, voucher cost per order).
2. If BTC files exist: wire EP.importer, compute at least one quantity from the data (avg price, peak season...) and push it into the assumptions with sc.setValue(key, value, { source: 'sample' }) so judges see the data used.
3. Produce 3 scenarios (xấu / cơ sở / tốt) via `better`, saying in the UI what changes. The bad case must really be bad (volume/CR down, cost/CPC up together).
4a. If the brief sells on credit, holds stock or runs several months: add a monthly cash-flow table (collection and payment schedule are assumptions with reasons; references/12 section 9 and kien-thuc/10 Ch.3 §3.2) and flag negative-cash months. If the brief has a web/landing funnel, show the five stage efficiencies η0..η4 (kien-thuc/09 Phần II §4.4), "Không đủ dữ liệu" when a denominator is 0.
4. Show: revenue, COGS, gross profit and margin, net profit and margin, break-even (units and revenue), payback if there is an investment, months of runway in the bad case (capital / monthly loss), sensitivity (tornado, top 3 assumptions), response plan per top risk (table: Rủi ro | Xác suất | Ảnh hưởng | Tín hiệu sớm | Người phụ trách | Ứng phó; framework 06 Bài 11 §2).
5. Promo mechanism card (only if the brief has promos/vouchers): budget cap with "Còn lại", per-customer/total/time limits, conditions (minimum order, new vs old, no stacking), margin floor check ("ưu đãi có lỗ không"), cannibalization assumption and real incremental revenue, abuse limits, final sentence "Chạy khi ..., dừng khi ...". Follow checklist 10 of references/12.
6. USP line: one sentence from references/12 section 3 (5 formulas, 7-test), plus one line "bằng chứng trong app" and one CTA wording using a copy framework (PAS/BAB/AIDA, 4C check; references/12 section 3 block "Từ USP sang câu chữ"). Keep it tied to a number the app can show.
7. Write docs/assumptions.md "Giả định & cách tính": a table of every assumption (value, unit, min-max, label, reason/source with file+section citation), the formulas with the live numbers of the base scenario, the 3 scenarios side by side, break-even, sensitivity ranking, risk table, promo mechanism, model limits. Numbers must match the app (use sc.copyText / sc.exportCsv output verbatim).
8. Tests: tests/model.cjs runs compute() for the base case and one hand-calculated bad case, divides by zero, break-even with non-positive contribution (must print "Không đủ dữ liệu"), checks that three scenarios are ordered bad <= base <= good on profit. Then Playwright: open http://localhost:8231/?demo=1#/{{MODEL_FEATURE}}, screenshot 360, 390 (portrait phone emulation) and 1440 in light and dark, LOOK at them (no horizontal overflow, assumption table and tornado readable at 390px).

VERIFY
`node --check features/{{MODEL_FEATURE}}/feature.js`; `node tests/model.cjs`; `node tests/smoke.cjs http://localhost:8231/ --shots shots-model` until green; scan: `node scripts/scan-secrets.mjs .` clean.

GIT ({{COMMIT_MODE}}): commit on worktree, message ending with
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
Do NOT push, do NOT bump version.

REPORT (<= 15 lines): files; assumptions count by label (BTC / team / simulated); the 3 scenario profits, break-even, top-3 sensitivity; promo verdict; what is verified vs not; any assumption still lacking a source ("giả định cần nêu nguồn").
```
