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

## Bản đồ prompt theo pha

| Phút | Pha | File | Model | Ghi chú |
|---|---|---|---|---|
| 0-5 | Spec | `01-spec-from-de.md` | Sonnet (coordinator tự làm) | đề -> `spec-nhanh.md`, chia feature, acceptance, kế hoạch data |
| 5-8 | Spawn đợt 1 | 02, 03, 04, 05, 07, 08 | xem dưới | gửi TẤT CẢ trong một message (song song) |
| 8-35 | Build | `02-feature-agent.md` x N | Sonnet | mỗi feature 1 agent, 1 worktree |
| 8-25 | Shell/brand | `03-shell-brand-agent.md` | Sonnet | |
| 8-25 | AI | `04-ai-agent.md` | Sonnet | |
| 8-20 | Data demo | `05-data-demo-agent.md` | Haiku | |
| 20-45 | Deck | `07-deck-agent.md` | Sonnet | cần app đã merge một phần để chụp ảnh; dựng khung từ phút 8 |
| 8-50 | Docs | `08-docs-agent.md` | Haiku | điền số liệu thật sau QA |
| 30-45 | QA | `06-qa-agent.md` x 2-3 | Haiku/Sonnet | chạy trên nhánh đã merge; chia theo nhóm feature / viewport |
| 35-45 | Merge + deploy | `09-merge-deploy.md` | coordinator | |
| 45-55 | Polish | `10-polish-agent.md` x 2-3 | Sonnet | chia theo view |
| bất kỳ | Cấp cứu | `11-emergency.md` | Sonnet | |
| 55-60 | Nộp | `09-merge-deploy.md` mục cuối | coordinator | kiểm tra link, nộp |

## Chọn model

- **Sonnet**: feature, UI, integration, AI module, deck, polish, QA cần sửa bug logic.
- **Haiku**: docs, demo data, sửa nhỏ (copy, CSS 1-2 chỗ), QA chạy checklist + chụp ảnh + báo cáo.
- Không chắc -> Sonnet. Đang bị nghẽn -> thêm agent, không đổi sang model yếu hơn.

## Bảng port (mỗi agent một port riêng; KHÔNG BAO GIỜ dùng 8000)

| Port | Dành cho |
|---|---|
| 8211 | coordinator / bản merge chính |
| 8212 | 03 shell-brand |
| 8213 | 04 AI |
| 8214 | 05 data-demo |
| 8215 | 07 deck |
| 8216 | 08 docs (chụp minh chứng) |
| 8217-8224 | 02 feature F1..F8 |
| 8225-8227 | 06 QA #1..#3 |
| 8228-8229 | 10 polish #1..#2 |
| 8230 | 11 emergency / dự phòng |

Agent phải tự `kill` server của mình khi xong. Test hardcode port khác -> chạy bản copy tạm, không commit.

## Worktree vs sở hữu thư mục

- **Mặc định: `isolation: "worktree"`** cho mọi agent sửa code. Agent bắt đầu bằng `git reset --hard {{BRANCH}}` (nhánh gốc của coordinator), commit lên nhánh worktree của nó, KHÔNG push.
- **Chế độ không-commit** (khi coordinator tự merge thủ công, hoặc repo không cho worktree): bỏ `isolation`, giao mỗi agent một **thư mục sở hữu** riêng và ghi rõ "KHÔNG commit, KHÔNG git add; chỉ sửa file trong danh sách". Coordinator commit một lần sau khi gộp.
- Quy tắc sở hữu (ghi vào từng prompt):
  - Feature agent: chỉ `features/{{FEATURE_NAME}}/**` + 1 dòng đăng ký (xem 02). Không sửa `js/`, `css/` chung.
  - Shell agent: `index.html` (nav, view home), `css/app.css` phần brand, `js/app.js`.
  - AI agent: `js/ai.js`, `features/*/ai-*.js` do mình tạo.
  - Data agent: `js/demo.js`, `data/**`.
  - Deck agent: `deck/**`. Docs agent: `docs/**`, `templates/**` (bản điền), `README.md`.
  - Polish/QA: chỉ file coordinator chỉ định, sửa nhỏ.

## Parallelism

- Trần cứng: không. Điển hình 8-15 đồng thời. Với 5 feature: 5 feature + shell + AI + data + deck + docs + 2 QA = 12.
- Gửi tất cả `Agent` call của một đợt **trong cùng một message** và `run_in_background: true`.
- Chỉ phụ thuộc thật mới tuần tự: QA/deck-chụp-ảnh cần code đã merge; docs số liệu cần QA xong.

## Thứ tự merge (xem chi tiết `09`)

1. data-demo (ít xung đột) -> 2. AI -> 3. shell-brand -> 4. feature F1..Fn (theo độ ưu tiên điểm chấm) -> 5. polish -> 6. docs/deck (thư mục riêng, hầu như không xung đột).
Điểm nóng xung đột: thẻ `<script>` trong `index.html`, dấu `}` trong `css/*.css`, danh sách đăng ký feature, `?v=` cache bust.

## Mẫu phrasing đã chứng minh hiệu quả (từ phiên điều phối thật)

- Mở đầu mỗi prompt: tên repo + stack + cách chạy (`python3 -m http.server <port>`), "FIRST run `git reset --hard <branch>`".
- "Serve from YOUR worktree root (never port 8000; kill when done)".
- Nêu rõ vùng cấm: "Do NOT touch X; another agent is changing Y".
- Verify bằng Playwright: chụp 1440x900 và 390x844, **tự mở ảnh ra xem**, không tràn ngang, không lỗi console.
- Chạy test cụ thể bằng lệnh đầy đủ; "update tests only if selectors you intentionally changed break them".
- "Check CSS brace balance."
- Kết thúc: "Commit on your worktree branch, message ending with trailer lines below. Do NOT push or bump version. Report briefly: files changed, verified vs not verified, test results."
- Trailer commit (điền theo system-reminder của phiên hiện tại):
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  ```

## Biến chung

`{{DE_SO}}` số đề, `{{DE_TEXT}}` nguyên văn đề, `{{REPO}}` đường dẫn repo tuyệt đối, `{{BRANCH}}` nhánh gốc, `{{PORT}}`, `{{FEATURE_NAME}}`, `{{FEATURE_DESC}}`, `{{ACCEPTANCE}}`, `{{APP_NAME}}`, `{{BRAND_COLORS}}`, `{{SESSION_URL}}`, `{{OWNED_PATHS}}`, `{{COMMIT_MODE}}` (`commit-on-worktree` | `no-commit`).

## Khối chuẩn chèn vào mọi prompt (đã có sẵn trong từng file)

```
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
```
