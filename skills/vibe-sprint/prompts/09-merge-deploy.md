# 09 - Merge + Deploy (checklist cho coordinator, không spawn)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Coordinator tự làm, hoặc giao một agent Sonnet "merge-helper" với prompt cuối trang khi nhiều nhánh. Chạy ở phút ~30-45 và lặp lại ở 55.

## A. Trước khi merge
- [ ] Mỗi agent đã báo cáo; đọc phần "verified vs not". Agent chưa verify -> spawn QA (06) hoặc re-spawn.
- [ ] `git branch -a` / danh sách worktree: ghi nhánh từng agent.
- [ ] Làm việc trên nhánh tích hợp `{{BRANCH}}` (sạch, `git status` không đổi).

## B. Thứ tự merge
1. data-demo -> 2. ai -> 3. shell-brand -> 4. feature theo ưu tiên P0 trước -> 5. polish -> 6. docs, deck.
Mỗi nhánh: `git merge --no-ff <branch>` (hoặc `git cherry-pick`), chạy `node tests/smoke.cjs http://localhost:{{PORT}}/` sau mỗi 1-2 nhánh (server cổng 8211, không 8000).

## C. Điểm nóng xung đột và cách xử lý
| File | Triệu chứng | Cách xử lý |
|---|---|---|
| `index.html` thẻ `<script>` | cả hai phía thêm dòng cạnh nhau | giữ CẢ HAI, mỗi tag một dòng, đúng thứ tự phụ thuộc: shared js (form, ai, charts, export, demo) -> features -> app.js |
| `css/*.css` | dấu `}` lệch, block bị cắt | giữ cả hai block; sau merge chạy kiểm tra cân bằng ngoặc: `python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"` |
| danh sách đăng ký feature / nav | trùng key | giữ cả hai, bỏ trùng |
| `js/demo.js` VERSION | hai agent cùng bump | lấy số lớn hơn +1 |
| `?v=` cache bust | khác nhau | đặt thống nhất một giá trị mới (bước E) |
Marker conflict `<<<<<<<` còn sót: `grep -rn '^<<<<<<<\|^>>>>>>>' --include=*.{js,css,html,md,json,cjs} .` phải rỗng.

## D. Sau mỗi đợt merge
- [ ] `node --check` mọi file js; `node tests/smoke.cjs http://localhost:{{PORT}}/`; chạy test từng feature.
- [ ] Playwright: mở `?demo=1`, đi qua mọi route ở 1440x900 và 390x844, chụp và XEM; không lỗi console.
- [ ] Nếu đỏ: gửi lỗi (stack + repro) cho agent QA/feature tương ứng, spawn agent sửa mới song song thay vì chờ.

## E. Bump version + cache bust
- Tăng hằng số version (ví dụ `EP.VERSION` / `?v=` trong index.html, service worker nếu có) lên cùng một giá trị mới: `grep -rn "?v=" index.html` rồi `sed -i 's/?v=[0-9A-Za-z._-]*/?v={{VERSION}}/g' index.html`.
- Bump VERSION trong demo.js nếu dữ liệu mẫu đổi.

## F. Push + GitHub Pages
- Commit (trailer phiên): 
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: {{SESSION_URL}}
  ```
- `git push origin {{BRANCH}}` (nhánh theo hướng dẫn của người dùng; không force-push).
- Pages: Settings -> Pages đang trỏ đúng nhánh/thư mục? Đợi build (1-2 phút): `gh run list --limit 3` hoặc `gh api repos/{{REPO_SLUG}}/pages/builds/latest`.
- Kiểm tra live: `curl -sI {{LIVE_URL}} | head -1` = 200; mở `{{LIVE_URL}}?demo=1` bằng Playwright, chụp và XEM; kiểm tra file `?v=` mới được tải (không dính cache cũ): xem Network hoặc `curl -s {{LIVE_URL}} | grep -o '?v=[^"]*' | sort -u`.
- Mọi đường dẫn tương đối (không `/` đầu) vì Pages chạy dưới `/<repo>/`. 404 asset -> sửa path.

## G. Phút 55-60 (nộp)
- [ ] `checklist-nop-bai.md` không còn "thiếu".
- [ ] Link demo mở được từ điện thoại (390px), `?demo=1` hoạt động.
- [ ] Bản PDF deck, README, bảng kiểm thử, minh chứng AI đã commit và push.
- [ ] Tag/backup: `git tag submit-{{DE_SO}} && git push origin submit-{{DE_SO}}`.
- [ ] Đóng mọi server cổng 8211-8230; không để key Gemini trong repo (`grep -rn "AIza" .` rỗng).

## Prompt cho merge-helper (tuỳ chọn, Sonnet, khi có > 6 nhánh)

```
Repo {{REPO}}, integration branch {{BRANCH}}. Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
Merge these worktree branches in this order, one at a time with `git merge --no-ff`: {{BRANCH_LIST}}.
After each merge resolve conflicts by KEEPING BOTH sides for: <script> tags in index.html (one per line, dependency order: shared js, features, app.js), CSS blocks (verify { and } counts equal), feature registry lines. For any other conflict prefer the later branch only if its owner is listed as owning that file; otherwise stop and report.
After each merge: node --check on all js, run `node tests/smoke.cjs http://localhost:{{PORT}}/` (serve on {{PORT}}, never 8000), fix trivial breakages. Final: no conflict markers (grep), tests green, screenshots of #home and each feature at 1440x900 and 390x844 viewed by you.
Commit trailer: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> / Claude-Session: {{SESSION_URL}}. Do not push. Report briefly: merge order result, conflicts and how resolved, test results.
```
