# 06 — Hồ sơ nộp và triển khai

## Triển khai GitHub Pages (nhánh nộp `nop-bai` hoặc `claude/*`)

`scripts/new-project.sh` tạo nhánh mặc định `nop-bai` (đổi bằng `BRANCH=...`); Xclipse luyện tập chạy Pages từ nhánh `claude/<tên>`. Skill `gh-pages-deploy` làm các bước dưới nếu bạn muốn tự động. Cách làm nhanh (chi tiết cùng `starter/README.md` mục 5):

1. Repo của đội đã có nhánh nộp (ở chung kết: `nop-bai`; hoặc nhánh `claude/<tên>` do Claude Code tạo). Đẩy code app (file `index.html` ở **gốc** repo hoặc thư mục Pages đã chọn).
2. GitHub → repo → **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*; Branch = nhánh nộp (`nop-bai` hoặc `claude/<tên>`), thư mục `/ (root)`; Save. (Nếu repo không cho chọn nhánh này, đội tạo nhánh `main`/`gh-pages` từ nhánh làm việc và chọn nhánh đó.)
3. Link: `https://<tài-khoản>.github.io/<tên-repo>/`. Lần đầu chờ 1–5 phút; xem tab **Actions** (pages-build-deployment) xanh là xong.
4. Tạo `.nojekyll` ở gốc: thư mục `features/_example` và `features/_playground` của starter bắt đầu bằng `_` nên Jekyll sẽ bỏ qua (nếu còn giữ). Tốt nhất xoá hai thư mục mẫu đó khi đã có feature thật.
4b. Chuẩn bị một lần: repo kết nối Claude GitHub App (`claude.ai/connect-github`), mở phiên **mới** có chọn repo; không push được/không thấy repo → làm lại bước này. Claude không tự tạo Pull Request nếu không được yêu cầu (Pages lấy thẳng từ nhánh). Link 404 = sai nhánh/thư mục hoặc không có `index.html` ở gốc; web trắng = app cần build (React/Vite) → làm bản HTML/JS thuần.
4c. **Nhánh Pages là nhánh production**: mỗi push là web đổi. Ghép và test ở nhánh khác, chỉ đẩy khi xanh (chi tiết: `07` G6).
5. Đường dẫn trong app phải **tương đối** (`css/app.css`, không `/css/app.css`) vì Pages nằm dưới `/<tên-repo>/`.
6. Kiểm tra: mở link ở cửa sổ ẩn danh + trên điện thoại; chân trang hiện đúng phiên bản.

Trước khi push (điều phối viên):

```
node --check js/*.js features/*/feature.js
node tools/bump-version.cjs       # tăng patch trong js/version.js + gắn ?v= (minor | major | 1.2.3 | --stamp)
node scripts/scan-secrets.mjs .   # phải sạch (mã thoát 0)
# chạy test đầy đủ trên http://localhost:8211/
node tests/smoke.cjs http://localhost:8211/ --shots shots-final
git add -A && git commit -m "..." && git push -u origin <nhánh>
```

## Cache

- Mọi `<script src>` và `<link href>` nội bộ có `?v=<phiên bản>`; `node tools/bump-version.cjs` làm việc này mỗi lần phát hành.
- Sau push, trang cũ có thể còn 1–10 phút: Ctrl+F5, kiểm tra phiên bản ở chân trang; nếu chưa đổi → xem Actions.
- Khi demo ở giám khảo: mở link trước, nhấn tải lại cứng, xác nhận phiên bản.

## Firebase (tuỳ chọn, chỉ khi đề cần dữ liệu chung nhiều thiết bị)

- 60 phút: **mặc định localStorage**, ghi rõ giới hạn. Firebase chỉ khi đề yêu cầu đồng bộ; cấu hình web Firebase công khai được nhưng phải có rules bảo vệ; tuyệt đối không đưa service account/secret.
- Starter có sẵn module Firebase **tuỳ chọn, tắt mặc định** (`js/firebase.js`, `firestore.rules`, `firebase.json`; bật trong `js/config.js`, xem `starter/README.md` mục 5b và skill `firebase-setup`); không bắt buộc. Repo VibeCodeLandingPageBuilder còn có `firebase/` (rules đầy đủ + `rules.test.mjs` 33 ca) để tham khảo, không nằm trong skill.
- **Làm Firebase từ đầu:** `references/07-cookbook-code-mau.md` mục G (dựng project 6 bước kể cả **Authorized domains = `<tài-khoản>.github.io`**, khởi tạo compat không CDN + emulator `?emulator=1`, đăng nhập Google + dịch lỗi, rules khách-chỉ-gửi/chủ-đọc/chống trùng bằng mã bản ghi = SĐT, ghi batch + thử lại, test rules bằng emulator 33 ca, Publish rules bằng `npx firebase deploy --only firestore:rules` hoặc dán vào Console). Cấu hình web Firebase công khai được; **không** đưa service account, **không** bật billing, **không** dùng Cloud Functions (trả phí).
- **Đề đã quy định nơi lưu (thường localStorage) thì đó là bản chính**; Firebase/Google Sheet chỉ là tuỳ chọn và phải được nói đúng như vậy trong README và khi trình bày (đã bị nhận xét "chưa đúng tính năng" vì làm ngược).
- Rules mới phải **Publish lên dự án thật** thì tính năng mới chạy trên web; ghi vào danh sách việc người dùng phải tự làm (đánh số).
- Môi trường agent thường không có emulator/quyền Firebase: điều phối viên chạy test Firebase ở máy có Java sau merge và báo phần chưa chạy.

## Bộ 4 món nộp lúc phút 60 (thể lệ chung kết)

(1) link demo/cách mở (online bắt buộc) · (2) mã nguồn khớp bản demo · (3) README (cài chạy, công nghệ, dữ liệu mẫu/tài khoản, khai báo khung chuẩn bị trước) · (4) minh chứng tại thời điểm chốt: ảnh/quay màn hình + hash commit, làm ở T+50–55 bằng `node scripts/nop-bai.mjs --url <link>` và lưu `docs/minh-chung/<thời điểm>/`. Nộp ở T+55–60, **không push thêm mã** sau đó (chỉ được thêm 1 commit chứa riêng ảnh minh chứng). Chi tiết `references/00`.

## Hồ sơ nhanh (điền từ `templates/`)

| Hồ sơ | Làm thế nào trong ~5 phút | Ai |
|---|---|---|
| README | Chép mẫu: đề số, tên đội, bảng, link demo, 5 tính năng, cách chạy local, AI dùng (xây + trong sản phẩm), nhãn mô phỏng nguyên văn, giới hạn, nguồn tham khảo/khai báo template-thư viện-AI, **không key** | Docs agent (Haiku) |
| Bảng kiểm thử | Từ bảng nghiệm thu spec: chạy ca thật, ghi kết quả thực tế + ngày + lệnh. B ≥3 ca, A ≥6 ca (2 thường, 2 sai, 2 biên) | QA agent chạy, Docs agent ghi |
| Minh chứng AI | ≤1 trang + 5 ảnh: prompt đội gửi AI, kết quả, lỗi, prompt sửa, kết quả sau; chụp từ hội thoại thật; che key/email/SĐT | Đội chụp, Docs agent ghép |
| Video ≤2 phút | Quay màn hình thao tác thật trên link online, đủ 5 tính năng (nếu đề yêu cầu) | Đội |
| Source | Đẩy repo; nếu cần ZIP: `git archive HEAD -o app.zip` (không `.git`, không `.env*`, không `node_modules`); giải nén thử ở thư mục mới và mở | Điều phối |
| Slide | `deck/` → `node tools/export.cjs` (trong `deck/`) → `deck/out/<tên>.pdf` (thư mục `out/` git-ignore, mang theo riêng) | Deck agent |

Ghi hồ sơ thật: ca chưa thử thì ghi "Chưa kiểm chứng", không ghi "Đạt".

## Quét secret trước khi push/nộp

`scripts/scan-secrets.mjs` (đã được `new-project.sh` chép vào `scripts/` của dự án) quét thư mục theo mẫu key phổ biến (AIza…, AQ., sk-…, ghp_…, AKIA…, private key, token dài), và nếu có `.env.local` thì tìm đúng các GIÁ TRỊ bí mật của file đó; **chỉ in tên mẫu/biến, vị trí và số dòng, không in giá trị**. Mã thoát: 0 sạch, 1 có chỗ lộ, 2 sai cách dùng.

```
node scripts/scan-secrets.mjs . .env.local     # có file env
node scripts/scan-secrets.mjs .                # không có
# chạy từ skill nếu chưa chép:  node skills/vibe-sprint/scripts/scan-secrets.mjs <thư-mục-app> [<.env.local>]
```
Có thể quét thêm bằng grep mẫu phổ biến:

```
git ls-files -z | xargs -0 grep -nEI "AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|api[_-]?key['\"]?\s*[:=]\s*['\"][^'\"]{12,}" | cut -c1-120
```
Kết quả phải rỗng (trừ `js/firebase-config.js` công khai có chủ ý: script in dòng [CHO PHÉP], ghi chú trong README). Kiểm tra cả ảnh chụp minh chứng (không lộ key). Lỡ lộ key → thu hồi/tạo key mới, không chỉ xoá commit.

## Checklist T+48 trước khi nói "xong"

- [ ] Test xanh (kết quả thật) trên bản đã merge.
- [ ] `node scripts/scan-secrets.mjs .` sạch.
- [ ] `node tools/bump-version.cjs` đã chạy (phiên bản + `?v=`); link online mở ở ẩn danh, đúng phiên bản.
- [ ] Mobile **360 và 390px** đủ 5 tiêu chí (không tràn, nút to, chữ đọc được, luồng chính làm được, điều hướng rõ); sáng/tối ổn.
- [ ] Dữ liệu/AI mô phỏng có nhãn rõ (câu đề đưa thì nguyên văn; không có thì câu rõ nghĩa của đội), khớp ở `js/config.js`, README, bảng kiểm thử, slide và `tests/smoke.cjs`.
- [ ] README khai báo khung vibe-sprint chuẩn bị trước, tính năng theo đề làm trong giờ thi.
- [ ] README + bảng kiểm thử + minh chứng đủ; không key.
- [ ] Video/bản local/ảnh dự phòng sẵn sàng.

## Gemini mà không để key trong trình duyệt (proxy)

Trang tĩnh trên GitHub Pages không giấu được key. Nếu cần AI thật mà không muốn mỗi người dùng tự nhập key, dùng proxy Cloudflare Worker ở `skills/vibe-sprint/proxy/` (miễn phí, 5 bước, key chỉ là secret trên Cloudflare). Sau khi deploy, điền `ai.proxyUrl` trong `js/config.js`; `js/ai.js` tự gọi qua proxy và Cài đặt ghi "Đang dùng máy chủ trung gian của đội — không cần nhập key". Xem `proxy/README.md`. Nhớ: `ALLOWED_ORIGINS` phải có đúng origin trang nộp bài; `APP_TOKEN` chỉ là làm rào; Firebase Functions cần gói Blaze nên không dùng.
