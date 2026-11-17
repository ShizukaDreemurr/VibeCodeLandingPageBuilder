# Thư viện AGENT PROMPT cho vibe-sprint (60 phút)

Dành cho **coordinator** (Claude điều phối). Mỗi file `NN-*.md` = hướng dẫn tiếng Việt cho coordinator + một khối prompt trong ```` ``` ```` để copy, điền `{{...}}`, rồi gửi qua tool `Agent`. Thân prompt viết bằng tiếng Anh (agent Sonnet/Haiku bám lệnh kỹ thuật tốt hơn), nội dung hiển thị cho người dùng luôn là tiếng Việt.

## Chính sách: xả láng tài nguyên

- Khi chạy skill này, **token/usage KHÔNG phải ràng buộc**. Thời gian (60 phút) mới là ràng buộc duy nhất.
- **Tối đa hoá số agent Sonnet/Haiku 5.5 chạy song song**, không đặt trần cứng. Thông thường **8-15 agent đồng thời**: 1 agent/feature + shell + AI + data + deck + docs + 2-3 agent QA / second-opinion.
- **Mỗi prompt phải tự đủ ngữ cảnh** (đề, stack, file được sở hữu, port, tiêu chí nghiệm thu, cách verify). Agent không thấy hội thoại của bạn. Thà dài còn hơn thiếu.
- **Khuyến khích agent kiểm chứng thừa**: thêm agent "second opinion" review/QA cùng một feature, agent chụp ảnh độc lập, agent chạy lại test.
- **Re-spawn thay vì chờ**: agent im > 8 phút, chạy sai hướng, hoặc báo lỗi mơ hồ -> spawn agent mới (prompt đã sửa) song song, dùng kết quả nào xong tốt trước. Dùng `11-emergency.md`.
- **Coordinator chỉ điều phối**: viết spec, spawn, merge, chạy test tổng, push. Không tự code feature (trừ sửa xung đột merge / hotfix 1-2 dòng).
- Mỗi prompt template có dòng header: *"Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt."*

## Nhãn dữ liệu mẫu/mô phỏng (thể lệ chung kết: ghi rõ, không còn câu cố định; đề đưa câu nào thì nguyên văn)

- Câu `Bản demo vòng loại - Dữ liệu mô phỏng AI` là câu của **vòng loại** (chỉ là ghi chú lịch sử, đừng dùng lại). Mặc định của starter trong `js/config.js` là `Dữ liệu mô phỏng AI · Dữ liệu mẫu` (chỗ giữ). Thể lệ chung kết chỉ yêu cầu **nhận diện rõ** dữ liệu mẫu/mô phỏng.
- Coordinator đọc đề chung kết/thể lệ, tìm câu nhãn BTC yêu cầu và **chép nguyên văn từng chữ, từng dấu** vào biến `{{MOCK_NOTICE}}` của mọi prompt (shell, AI, feature, QA, docs, deck). Đề không đưa câu nào: dùng câu rõ nghĩa của đội (ví dụ `Dữ liệu mẫu/mô phỏng, không phải số liệu thật`) và ghi vào `docs/DECISIONS.md`. **Cấm viết sẵn mã riêng cho đề; mọi agent chỉ dùng khung chung và viết tính năng sau khi đề công bố.**
- Chỉ **một nơi** được đặt câu này: `mockNotice` trong `js/config.js` (do shell agent sửa). Không ai khác hardcode câu nhãn vào JS/HTML/CSS. `tests/smoke.cjs` và `mobile-suite.cjs` tự đọc `EP.config.mockNotice` nên **không cần sửa test**; đổi câu thì sửa README, bảng kiểm thử, slide cho khớp.
- Mọi kết quả mock phải hiển thị cạnh nhãn này (dùng `EP.ai.noticeHtml(result)`, chân trang tự hiện khi ở chế độ mock).

## Schema Contract (bắt buộc, T+5, trước khi spawn)

Đợt đầu chạy thật (`references/09`) hỏng vì hai agent đặt hai tên cho cùng một trường (`promoCost` vs `adSpend`, `clickToOrderPct` vs `cr`). Vì vậy **trước khi spawn bất kỳ agent nào**, điều phối viên viết khối **Schema Contract** 10-15 dòng vào `docs/spec-nhanh.md` mục 0 (mẫu ở `templates/spec-nhanh.md`): tên entity + trường + kiểu, tên hàm + hình dạng giá trị trả về, tên collection, id `EP.*` (`EP.register` id, `EP.aiSpecs.<tên>`, `EP.demo` collection). **Mọi prompt agent (feature, shell, AI, data, QA, polish) dán khối này nguyên văn vào `{{SCHEMA_CONTRACT}}` và cấm tự đặt tên.** Đổi contract giữa chừng: điều phối sửa một chỗ rồi gửi bản mới cho mọi agent đang chạy.

Quy tắc đi kèm: **Code tính số, AI diễn giải** (mọi con số do hàm thuần tính; mẫu số = 0 thì trả `Không đủ dữ liệu`, không bao giờ 0%/NaN); app **mở trống**, có nút **Điền dữ liệu mẫu**; test logic nhanh bằng node `vm` (`starter/tests/unit-template.cjs` → `tests/<feature>.cjs`); chạy theo **3 đợt** (1 lõi, 2 nâng cấp, 3 micro-features) và luôn có agent đang chạy, xem `references/02`.

## Bản đồ prompt theo pha

| Phút | Pha | File | Model | Ghi chú |
|---|---|---|---|---|
| 0-5 | Spec | `01-spec-from-de.md` | Sonnet (coordinator tự làm) | đề -> `docs/spec-nhanh.md` + Schema Contract + Giả định (cổng T+5) |
| 5-8 | Starter + UI tokens | `03-shell-brand-agent.md` (kiểm UI 2 phút) | Claude chính / Sonnet | chưa spawn feature trước khi có Contract |
| 8 | Spawn đợt 1 | 02, 03, 04, 05, 07, 08, 13 | xem dưới | gửi TẤT CẢ trong một message (song song) |
| 8-40 | Build | `02-feature-agent.md` x N | Sonnet | mỗi feature 1 agent, 1 worktree; merge đợt 1 ở T+25 |
| 8-25 | Shell/brand | `03-shell-brand-agent.md` | Sonnet | |
| 8-25 | AI | `04-ai-agent.md` | Sonnet | |
| 8-20 | Data demo | `05-data-demo-agent.md` | Haiku | |
| 8-40 | Giả định & mô hình KD (Bảng Kinh tế) | `13-business-agent.md` | Sonnet | cổng 8231 |
| 8-50 | Docs | `08-docs-agent.md` | Haiku | điền số liệu thật sau QA |
| 10 | Khung slide + Gemini | `14-claude-design-khung-slide.md` + `16-gemini-antigravity-giao-viec.md` | Claude Design + Gemini Antigravity | điền biến T+8, gửi đồng thời T+10 (sau Contract); ảnh chèn ở T+50 (Phần 2) |
| 10-40 | Gemini song song | `16-gemini-antigravity-giao-viec.md` | Gemini Antigravity | nhánh `ag/<x>`, cổng 8240+, file sở hữu riêng; bản cuối T+40 |
| 20-45 | Deck dự phòng | `07-deck-agent.md` | Sonnet | chỉ khi Claude Design chậm (> T+18); cần app đã merge một phần để chụp ảnh |
| 25-40 | QA | `06-qa-agent.md` x 2-3 | Haiku/Sonnet | chạy trên nhánh đã merge; chia theo nhóm feature / viewport (360 và 390) |
| 40-48 | Merge hết + deploy | `09-merge-deploy.md` | coordinator | test xanh, `showPlayground:false`, bump, quét secret, push; T+44 khóa giao diện |
| 45 | Chụp ảnh slot | `15-sonnet-chrome-chup-anh.md` | Sonnet trong Chrome | + 1 agent Claude Code dự phòng (`shots-mobile.cjs`) |
| 48-50 | Polish | `10-polish-agent.md` x 2-3 | Sonnet | chia theo view; **sau T+50 không thêm tính năng** |
| 50-55 | Minh chứng chốt | `scripts/nop-bai.mjs` | coordinator + QA | ảnh 360/390 sáng-tối + hash commit |
| bất kỳ | Cấp cứu | `11-emergency.md` | Sonnet | |
| 55-60 | Nộp 4 món | `09-merge-deploy.md` mục G | coordinator | kiểm tra link ẩn danh, nộp |

> **Luồng slide mới (T+10):** `14` (khung, Claude Design) và `16` (Gemini) gửi cùng lúc; thành viên không tự bấm slide nên ghi chú có dòng **Cue kỹ thuật**. `12-claude-design-slide.md` là bản một lần khi đã có đủ ảnh; khi lệch với 14 thì theo 14. Chi tiết: `references/14-quy-trinh-slide-song-song.md`.

## Chọn model

- **Sonnet**: feature, UI, integration, AI module, deck, polish, QA cần sửa bug logic.
- **Haiku**: docs, demo data, sửa nhỏ (copy, CSS 1-2 chỗ), QA chạy checklist + chụp ảnh + báo cáo.
- Không chắc -> Sonnet. Đang bị nghẽn -> thêm agent, không đổi sang model yếu hơn.

## Bảng port (mỗi agent một port riêng; KHÔNG BAO GIỜ dùng 8000)

Đây là bảng DUY NHẤT; `SKILL.md` và `references/02` dùng cùng số này.

| Port | Dành cho |
|---|---|
| 8211 | coordinator / bản merge chính |
| 8212 | 03 shell-brand |
| 8213 | 04 AI |
| 8214 | 05 data-demo |
| 8215-8216 | 10 polish #1..#2 |
| 8217-8224 | 02 feature F1..F8 |
| 8225 | 07 deck |
| 8226 | 08 docs (chụp minh chứng) |
| 8227-8229 | 06 QA #1..#3 |
| 8230 | 11 emergency / dự phòng |
| 8231 | 13 giả định & mô hình kinh doanh |
| 8240-8249 | 16 Gemini Antigravity (`ag/ui` 8240, `ag/data` 8241, `ag/docs` 8242, `ag/biz` 8243) |

Agent phải tự `kill` server của mình khi xong. Test hardcode port khác -> chạy bản copy tạm, không commit.

## Worktree vs sở hữu thư mục

- **Mặc định: `isolation: "worktree"`** cho mọi agent sửa code. Agent bắt đầu bằng `git reset --hard {{BRANCH}}` (nhánh gốc của coordinator), commit lên nhánh worktree của nó, KHÔNG push.
- **Chế độ không-commit** (khi coordinator tự merge thủ công, hoặc repo không cho worktree): bỏ `isolation`, giao mỗi agent một **thư mục sở hữu** riêng và ghi rõ "KHÔNG commit, KHÔNG git add; chỉ sửa file trong danh sách". Coordinator commit một lần sau khi gộp.
- Quy tắc sở hữu (ghi vào từng prompt). Cấu trúc thật của starter: `index.html`, `css/tokens.css`, `css/app.css`, `js/*.js`, `features/<tên>/feature.js`, `tests/smoke.cjs`, `tools/bump-version.cjs`.
  - Feature agent: chỉ `features/{{FEATURE_NAME}}/**`, `css/{{FEATURE_NAME}}.css` (nếu thật cần, trong `@layer components`), `tests/{{FEATURE_NAME}}.cjs` + MỘT dòng `<script src="features/{{FEATURE_NAME}}/feature.js">` (và một dòng `<link>` nếu có css riêng) trong `index.html`. Không sửa `js/*.js` chung, `css/app.css`, `tests/smoke.cjs`.
  - Shell agent: `index.html` (trừ dòng của feature), `js/config.js` (appName, tagline, prefix, **mockNotice**), `css/tokens.css` (preset/brand), `css/app.css`. KHÔNG sửa `js/app.js` trừ khi thật bắt buộc (nó đã tự dựng Tổng quan/Cài đặt từ `EP.register`).
  - AI agent: `js/ai-specs.js` (file mới: `EP.aiSpecs = { <tên>: { id, prompt, schema, mock } }`, nạp sau `js/mock.js` và trước `features/`), `docs/ai-prompts.md`, `tests/ai.cjs`. **Không sửa `js/ai.js`** (framework 3 chế độ đã đủ; gặp lỗi thì báo coordinator).
  - Data agent: `js/demo-data.js` (file mới: các `EP.demo.register(<collection>, { version, seed })`, nạp SAU `features/`, trước `js/app.js`, nên thắng bản demo tạm trong feature), `tests/demo.cjs`. Không sửa `js/demo.js`.
  - Deck agent: `deck/**` (chủ yếu `deck/deck.data.js`, `deck/assets/**`, `deck/out/**`). Docs agent: `docs/**`, `README.md`, `qa/**` chỉ đọc.
  - Polish/QA: chỉ file coordinator chỉ định, sửa nhỏ.

## Parallelism

- Trần cứng: không. Điển hình 8-15 đồng thời. Với 5 feature: 5 feature + shell + AI + data + deck + docs + 2 QA = 12.
- Gửi tất cả `Agent` call của một đợt **trong cùng một message** và `run_in_background: true`.
- Chỉ phụ thuộc thật mới tuần tự: QA/deck-chụp-ảnh cần code đã merge; docs số liệu cần QA xong.

## Thứ tự merge (xem chi tiết `09`)

1. data-demo (ít xung đột) -> 2. AI -> 3. shell-brand -> 4. feature F1..Fn (theo độ ưu tiên điểm chấm) -> 5. polish -> 6. docs/deck (thư mục riêng, hầu như không xung đột).
Điểm nóng xung đột: thẻ `<script>` trong `index.html`, dấu `}` trong `css/*.css`, danh sách đăng ký feature, `?v=` cache bust.

## Mẫu phrasing đã chứng minh hiệu quả (từ phiên điều phối thật)

- Mở đầu mỗi prompt: tên repo + stack + cách chạy (`python3 -m http.server <port>`), "FIRST run `git reset --hard <branch>`". Thứ tự nạp script của starter: config, version, icons, core, ui, form, charts, export, ai, demo, firebase (tuỳ chọn), mô-đun (mock, metrics, match, calc, scenario, import, checklist, quiz, chat, timeslot), lucian, mobile, [ai-specs.js do AI agent thêm], features, hero, [demo-data.js do Data agent thêm sau features], app (cuối). `index.html` của starter chưa có hai thẻ ai-specs/demo-data: shell agent thêm (xem `03` tác vụ 5).
- "Serve from YOUR worktree root (never port 8000; kill when done)".
- Nêu rõ vùng cấm: "Do NOT touch X; another agent is changing Y".
- Verify: `node tests/smoke.cjs http://localhost:<port>/ --shots <thư-mục>` (đã gồm mobile 360×780 + 390×844) + Playwright chụp 360x780, 390x844 (chính) và 1440x900 (phụ), **tự mở ảnh ra xem**, không tràn ngang, không lỗi console.
- Chạy test cụ thể bằng lệnh đầy đủ; "update tests only if selectors you intentionally changed break them".
- "Check CSS brace balance" và `node --check` mọi JS; trước push coordinator chạy `node tools/bump-version.cjs` và `node scripts/scan-secrets.mjs .`.
- Kết thúc: "Commit on your worktree branch, message ending with trailer lines below. Do NOT push or bump version. Report briefly: files changed, verified vs not verified, test results."
- Trailer commit (điền theo system-reminder của phiên hiện tại):
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  ```

## Biến chung

`{{DE_SO}}` số đề, `{{DE_TEXT}}` nguyên văn đề, `{{REPO}}` đường dẫn repo tuyệt đối, `{{BRANCH}}` nhánh gốc, `{{PORT}}`, `{{FEATURE_NAME}}`, `{{FEATURE_DESC}}`, `{{ACCEPTANCE}}`, `{{APP_NAME}}`, `{{BRAND_COLORS}}`, `{{SESSION_URL}}`, `{{SCHEMA_CONTRACT}}` (khối Schema Contract dán nguyên văn từ `docs/spec-nhanh.md` mục 0), `{{OWNED_PATHS}}`, `{{COMMIT_MODE}}` (`commit-on-worktree` | `no-commit`), `{{MOCK_NOTICE}}` (câu nhãn mô phỏng chép NGUYÊN VĂN từ đề/BTC, xem cảnh báo ở trên), `{{FEATURE_LIST}}`, `{{DOMAIN}}`, `{{AI_USES}}`, `{{SCHEMAS}}`, `{{QA_SCOPE}}`, `{{POLISH_SCOPE}}`, `{{PITCH_MINUTES}}`, `{{SLIDE_COUNT}}`, `{{LIVE_URL}}`, `{{REPO_URL}}`, `{{TEAM}}`, `{{TRANSCRIPT_PATH}}`, `{{MINUTES}}`, `{{OLD_BRANCH}}`, `{{ACCEPTANCE_MIN}}` (chỉ ở `11-emergency.md`), `{{REPO_SLUG}}`, `{{BRANCH_LIST}}` (chỉ ở `09-merge-deploy.md`), `{{BANG}}`, `{{GIA_DINH}}`, `{{KICH_BAN}}`, `{{HOA_VON}}`, `{{UU_DAI_LO}}` (chỉ ở `12-claude-design-slide.md`; `{{PITCH_MINUTES}}` = 10, 5 hoặc 3 và `{{SLIDE_COUNT}}` = 11, 7 hoặc 5).

## Khối chuẩn chèn vào mọi prompt (đã có sẵn trong từng file)

```
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
```
