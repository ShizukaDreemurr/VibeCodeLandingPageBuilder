# 11 - Cấp cứu: agent kẹt / hết giờ (Sonnet)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

## Khi nào dùng
- Agent im > 8 phút, lặp lỗi, hoặc báo "gần xong" lần thứ hai không có commit.
- Đồng hồ: phút 35 chưa có feature P0 nào chạy; phút 45 chưa merge; phút 52 test đỏ.
- Quy tắc: **không chờ**. Gửi `interrupt_session` nếu cần, **spawn agent mới ngay** (prompt dưới), lấy kết quả nào xong trước. Giữ nhánh cũ làm nguồn tham khảo/cherry-pick.

## Bảng cắt giảm (theo thời gian còn lại)
| Còn lại | Hành động |
|---|---|
| > 25 phút | Re-spawn feature với prompt ngắn hơn, chỉ P0 acceptance; thêm 1 agent second-opinion |
| 15-25 phút | Cắt P2, bỏ Gemini (chỉ mock + notice), bỏ export/chart phụ; một màn hình chính + form + bảng |
| 8-15 phút | Feature chưa xong -> ẩn khỏi nav, ship mock tĩnh có dữ liệu `?demo=1`; deck/docs dùng ảnh đã có |
| < 8 phút | Đóng băng code. Chỉ sửa lỗi chặn demo. Quay về bản merge xanh gần nhất (`git reset --hard <tag/commit xanh>`), push, kiểm tra Pages, nộp |

## Prompt: re-spawn feature rút gọn ("ship mock")

```
Repo: {{REPO}} (vanilla JS, window.EP). FIRST `git reset --hard {{BRANCH}}`. Serve `python3 -m http.server {{PORT}}` from YOUR worktree root (never 8000; kill when done).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.

EMERGENCY. Hard deadline: {{MINUTES}} minutes from now; stop and report at that time even if unfinished. A previous agent got stuck on feature "{{FEATURE_NAME}}" ({{FEATURE_DESC}}); its branch {{OLD_BRANCH}} may contain reusable pieces (inspect with `git diff {{BRANCH}}..{{OLD_BRANCH}} --stat`; copy only what works, do not debug its internals).
Goal: a demo-able version, not a complete one. Minimum acceptance (ONLY these): {{ACCEPTANCE_MIN}}.
Rules: clone features/_example into features/{{FEATURE_NAME}}; own ONLY features/{{FEATURE_NAME}}/**; one registration line elsewhere. Use static/mock data seeded under ?demo=1 where real logic is hard; real form validation via EP.form is still required if the feature has a form; show EP.ai notice if AI output is mock. Skip charts/export/edge cases. Get a vertical slice working within 5 minutes first, commit it, then improve.
Verify with Playwright at 390x844 and 1440x900 (open the screenshots and LOOK), run `node tests/smoke.cjs http://localhost:{{PORT}}/`.
GIT ({{COMMIT_MODE}}): commit early and often on the worktree branch, trailer:
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: {{SESSION_URL}}
No push/version bump.
REPORT in <= 8 lines: what works (verified), what is mock, what is missing.
```

## Prompt: fallback demo (khi app hỏng nặng)

```
Repo: {{REPO}}. FIRST `git reset --hard {{BRANCH}}`. Serve on {{PORT}} (never 8000).
Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
Deadline {{MINUTES}} minutes. Build `demo-fallback.html` (single self-contained file, inline CSS/JS, no network): a click-through walkthrough of "{{APP_NAME}}" using real screenshots from deck/shots/ or qa evidence (embed as relative files) plus mock interactive widgets for the 3 key moments from docs/kich-ban-demo.md. Vietnamese, brand colors {{BRAND_COLORS}}, works at 390 and 1440, keyboard arrows move between steps. Banner: "Bản trình diễn dự phòng - dữ liệu mô phỏng". Verify with Playwright screenshots (LOOK), commit with the standard trailer, report in <= 5 lines.
```

## Prompt: khôi phục bản xanh

Coordinator làm tay: `git log --oneline -15`, tìm commit gần nhất có smoke xanh (`git stash; git checkout <sha>; node tests/smoke.cjs ...`), `git reset --hard <sha>` trên nhánh tích hợp, chạy lại 09 mục D-F.
