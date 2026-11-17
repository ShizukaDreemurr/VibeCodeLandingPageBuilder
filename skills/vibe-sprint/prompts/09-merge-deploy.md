# 09 - Merge + Deploy (checklist cho coordinator, không spawn)

**Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.**

Coordinator tự làm, hoặc giao một agent Sonnet "merge-helper" với prompt cuối trang khi nhiều nhánh. Chạy ở T+25 (đợt 1), T+40→48 (merge hết + deploy) và kiểm lại ở T+55.

## A. Trước khi merge
- [ ] Mỗi agent đã báo cáo; đọc phần "verified vs not". Agent chưa verify -> spawn QA (06) hoặc re-spawn.
- [ ] `git branch -a` / danh sách worktree: ghi nhánh từng agent.
- [ ] Làm việc trên nhánh tích hợp `{{BRANCH}}` (sạch, `git status` không đổi).

## B. Thứ tự merge
1. data-demo -> 2. ai -> 3. shell-brand -> 4. feature theo ưu tiên P0 trước -> 5. polish -> 6. docs, deck.
Mỗi nhánh: `git merge --no-ff <branch>` (hoặc `git cherry-pick`), chạy `node tests/smoke.cjs http://localhost:{{PORT}}/` sau mỗi 1-2 nhánh (coordinator serve cổng 8211: `python3 -m http.server 8211`, không 8000).

## C. Điểm nóng xung đột và cách xử lý
| File | Triệu chứng | Cách xử lý |
|---|---|---|
| `index.html` thẻ `<script>` | cả hai phía thêm dòng cạnh nhau | giữ CẢ HAI, mỗi tag một dòng, đúng thứ tự: config, version, core, ui, form, charts, export, ai, demo, mô-đun (mock...timeslot), `js/ai-specs.js`, `features/*/feature.js`, `js/demo-data.js`, `js/app.js` CUỐI |
| `css/*.css` | dấu `}` lệch, block bị cắt | giữ cả hai block; sau merge chạy kiểm tra cân bằng ngoặc: `python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"` |
| `<script>` trùng của cùng một feature, `EP.register` trùng `id` | hai agent cùng tên tab | giữ MỘT dòng script; đổi `id` cho khác nhau (id là đường `#/id`, bản đăng ký sau thay bản trước) |
| `js/demo-data.js` / feature `EP.demo.register(..., { version })` | hai agent cùng bump | lấy số lớn hơn +1; bản trong `demo-data.js` thắng bản trong feature |
| `js/config.js` `mockNotice` | khác câu nhãn | luôn lấy câu NGUYÊN VĂN từ đề/BTC; `tests/smoke.cjs` tự đọc `EP.config.mockNotice` nên không cần sửa test |
| `?v=` cache bust, `js/version.js` | khác nhau | không sửa tay; chạy `node tools/bump-version.cjs` một lần (bước E) |
Marker conflict `<<<<<<<` còn sót: `grep -rn '^<<<<<<<\|^>>>>>>>' --include=*.{js,css,html,md,json,cjs} .` phải rỗng.

## D. Sau mỗi đợt merge
- [ ] `node --check js/*.js features/*/feature.js`; `node tests/smoke.cjs http://localhost:{{PORT}}/ --shots shots-merge`; chạy `node tests/<feature>.cjs http://localhost:{{PORT}}/` từng feature (và `tests/ai.cjs`, `tests/demo.cjs` nếu có).
- [ ] Playwright: mở `?demo=1`, đi qua mọi route ở 1440x900 và 390x844, chụp và XEM; không lỗi console.
- [ ] Nếu đỏ: gửi lỗi (stack + repro) cho agent QA/feature tương ứng, spawn agent sửa mới song song thay vì chờ.

## E. Bump version + cache bust
- Chạy `node tools/bump-version.cjs` (tăng patch; hoặc `minor` / `major` / `1.2.3` / `--stamp` để chỉ gắn lại `?v=`). Lệnh này cập nhật `js/version.js` (`EP.version`, hiện ở chân trang và Cài đặt) và gắn `?v=<phiên bản>` cho mọi `js/…`, `features/…` và `css/…` trong `index.html` (và `404.html` nếu có). Không dùng `sed` thủ công.
- Tăng `version` trong `EP.demo.register(...)` nếu dữ liệu mẫu đổi.
- Đặt `showPlayground: false` trong `js/config.js` (ẩn tab Mô-đun/`devOnly`), chạy lại smoke.
- Quét secret: `node scripts/scan-secrets.mjs .` (thêm `.env.local` làm tham số 2 nếu có); phải sạch, mã thoát 0.

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

## G. T+50→55 minh chứng chốt, T+55→60 nộp 4 món
- [ ] `node scripts/nop-bai.mjs --url {{LIVE_URL}}` (sau khi push bản cuối): ảnh 390/360 sáng-tối + 1 desktop vào `docs/minh-chung/<thời điểm>/`, hash commit, ZIP, in 4 món; không còn [ LỖI ].
- [ ] `docs/CHECKLIST-CHUNG-KET.md` mục G: 4 món đều tick; không đẩy thêm commit mã sau khi chụp.
- [ ] Link demo mở được từ điện thoại (390px), `?demo=1` hoạt động.
- [ ] Bản PDF deck (`deck/out/*.pdf`, thư mục `out/` bị git-ignore nên nộp/mang theo riêng), README, `docs/BANG-KIEM-THU.md`, `docs/MINH-CHUNG-AI.md` đã commit và push.
- [ ] Tag/backup: `git tag submit-{{DE_SO}} && git push origin submit-{{DE_SO}}`.
- [ ] Đóng mọi server cổng 8211-8231 và 8240-8249; không để key Gemini trong repo: `node scripts/scan-secrets.mjs .` sạch (và `grep -rn "AIza" .` rỗng).
- [ ] Câu nhãn mock trong `js/config.js`, README và slide đúng NGUYÊN VĂN đề/BTC (câu vòng loại chỉ là lịch sử, không dùng nếu đề chung kết khác).

## Prompt cho merge-helper (tuỳ chọn, Sonnet, khi có > 6 nhánh)

```
Repo {{REPO}}, integration branch {{BRANCH}}. Không cần tiết kiệm token: đọc đủ file, chụp ảnh kiểm tra, chạy lại test đến khi đạt.
Merge these worktree branches in this order, one at a time with `git merge --no-ff`: {{BRANCH_LIST}}.
After each merge resolve conflicts by KEEPING BOTH sides for: <script> tags in index.html (one per line, dependency order: config, version, core, ui, form, charts, export, ai, demo, modules, js/ai-specs.js, features/*/feature.js, js/demo-data.js, js/app.js last), CSS blocks (verify { and } counts equal), duplicate EP.register ids. For any other conflict prefer the later branch only if its owner is listed as owning that file; otherwise stop and report.
After each merge: `node --check` on all js (js/*.js features/*/feature.js), run `node tests/smoke.cjs http://localhost:{{PORT}}/` (serve on {{PORT}}, never 8000), fix trivial breakages. Final: no conflict markers (grep), tests green, screenshots of #home and each feature at 1440x900 and 390x844 viewed by you.
After the final merge run `node tools/bump-version.cjs` and `node scripts/scan-secrets.mjs .` (must be clean). Commit trailer: Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com> / Claude-Session: {{SESSION_URL}}. Do not push. Report briefly: merge order result, conflicts and how resolved, test results.
```
