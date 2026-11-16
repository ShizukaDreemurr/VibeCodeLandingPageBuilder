---
name: gh-pages-deploy
description: Đưa app web tĩnh (HTML/CSS/JS thuần, không build) lên GitHub và lấy link GitHub Pages chạy được, tự chọn đường đi phù hợp (Claude Code + git/gh/GitHub MCP, chỉ GitHub MCP, hoặc điều khiển trình duyệt). Dùng khi người dùng nói "deploy", "đưa lên GitHub Pages", "lấy link web", "đẩy code lên GitHub", "publish app", "xuất bản web", "link github.io", "Pages bị 404", "trang trắng sau khi deploy", or "deploy static site to GitHub Pages", "publish to github.io", "push to GitHub and get a live URL".
---

# gh-pages-deploy — từ thư mục HTML/CSS/JS đến link `https://<user>.github.io/<repo>/`

Dành cho app tĩnh kiểu Xclipse hoặc `skills/vibe-sprint/starter` (không build, không server). Có 3 đường; chọn đường **khả dụng nhất**, không hỏi người dùng nếu tự phát hiện được.

## 1. Chọn đường (decision tree)

1. Có shell + `git` (và `gh` hoặc GitHub MCP / connector)? -> **Đường A** (`references/01-route-claude-code.md`).
   - Nhận biết: chạy `git --version && gh auth status`; hoặc thấy tool `mcp__github__*`.
2. Không có shell, nhưng có tool GitHub MCP (`create_repository`, `push_files`...) hoặc connector GitHub của claude.ai? -> **Đường B** (`references/02-route-mcp-only.md`).
3. Có công cụ trình duyệt (Claude in Chrome / computer-use / browser-use MCP)? -> **Đường C** (`references/03-route-browser.md`).
4. Không có gì ở trên -> nói thẳng, đưa người dùng 6 bước thủ công (file `03` đọc như hướng dẫn tay) và kèm danh sách file đã chuẩn bị.

Có thể kết hợp: A/B để đẩy code, C để bật Pages nếu API/MCP không bật được. Người dùng phải **tự đăng nhập** GitHub; không bao giờ gõ mật khẩu/token/mã 2FA hộ.

## 2. Preflight (luôn làm trước khi đẩy)

Chạy `bash scripts/preflight.sh <thư-mục-app>` (có shell) hoặc tự kiểm tay:

- [ ] `index.html` ở gốc (hoặc ở `/docs` nếu chọn nguồn `/docs`).
- [ ] Đường dẫn **tương đối** (`css/app.css`, `./js/app.js`), KHÔNG bắt đầu bằng `/` (`src="/js/x.js"` sẽ vỡ vì site nằm ở `/<repo>/`).
- [ ] Có file rỗng `.nojekyll` ở gốc (tránh Jekyll bỏ file bắt đầu bằng `_`, và tránh build lỗi).
- [ ] Tên file **phân biệt hoa thường** (`Logo.png` khác `logo.png`); tránh dấu cách/tiếng Việt có dấu trong tên file.
- [ ] Không có bí mật: quét `AIza`, `sk-`, `ghp_`, `github_pat_`, `-----BEGIN`. Firebase web config (`apiKey: "AIza..."`) là công khai theo thiết kế, nhưng **Firestore/Storage rules phải chặn truy cập trái phép**. Key AI (OpenAI/Gemini/Anthropic) thì TUYỆT ĐỐI không để trong repo.
- [ ] Giới hạn: site <= 1 GB, mỗi file < 100 MB (khuyến nghị < 25 MB), repo gợi ý < 1 GB; upload web tối đa 100 file / 25 MB mỗi lần.
- [ ] Tên repo: chữ thường, gạch ngang, không dấu (ví dụ `xclipse-demo`).

## 3. Bật Pages

Gói free: repo phải **public** (xác nhận với người dùng trước, xem mục An toàn).

**UI:** repo -> Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch" -> Branch: chọn `main` (hoặc `claude/<x>`) + folder `/ (root)` -> Save.

**API** (nếu có `gh` hoặc MCP hỗ trợ gọi REST):
```bash
gh api -X POST repos/OWNER/REPO/pages -f "source[branch]=main" -f "source[path]=/"
# đã bật rồi (409) -> cập nhật:
gh api -X PUT repos/OWNER/REPO/pages -f "source[branch]=main" -f "source[path]=/"
```
`source.path` chỉ nhận `/` hoặc `/docs`. Pages có thể phục vụ từ **bất kỳ nhánh nào**, kể cả `claude/<x>`. Đường B thường không gọi được API này -> hướng dẫn người dùng bật bằng UI.

## 4. Kiểm chứng

- URL: `https://<user>.github.io/<repo>/` (repo dạng `<user>.github.io` thì URL gốc).
- Chạy `bash scripts/verify-pages.sh <url>`: lặp curl tối đa 10 phút, in HTTP status + `<title>`.
- Trạng thái build: Actions -> workflow **pages-build-deployment** xanh; hoặc `gh run list --workflow pages-build-deployment -L 3`, `gh api repos/O/R/pages/builds/latest`, MCP `actions_list`.
- Thường 1–5 phút lần đầu. Thấy bản cũ: hard reload (Ctrl+Shift+R) hoặc thêm `?v=2`.
- Báo người dùng: link, nhánh/thư mục nguồn, thời điểm build xong, và cảnh báo nếu cần (Firebase domain, key).

## 5. Lỗi thường gặp (tóm tắt; chi tiết ở `references/04-troubleshooting.md`)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| 404 | Chưa bật Pages / sai nhánh / thiếu `index.html` ở nguồn / repo private (free) / sai hoa thường | Kiểm Settings -> Pages, đúng branch + folder, public, tên file |
| Trang trắng | Đường dẫn tuyệt đối `/...`, lỗi JS (F12 Console), mở bằng `file://` bị CORS/module | Đổi sang tương đối; chạy qua link Pages hoặc `python3 -m http.server` |
| Vẫn bản cũ | Cache CDN/trình duyệt | Hard reload, `?v=`, đợi build xong |
| Actions fail | Jekyll lỗi | Thêm `.nojekyll`, commit lại |
| Push 403 | App Claude chưa cài trên repo / đẩy sai nhánh | Cài app, chỉ push nhánh được chỉ định |
| Firebase `auth/unauthorized-domain` | Domain chưa được phép | Firebase Console -> Authentication -> Settings -> Authorized domains -> thêm `<user>.github.io` |

## 6. An toàn (bắt buộc)

- **Hỏi xác nhận** trước khi tạo repo public hoặc đổi repo sang public; nói rõ "ai cũng xem được code".
- Không tự đổi default branch, visibility, hay xóa repo/nhánh khi chưa được hỏi và đồng ý.
- Không bao giờ ghi token/mật khẩu vào file, commit, URL remote, hay chat. Dùng `gh auth` / connector đã đăng nhập sẵn.
- Không force-push nhánh của người khác; không ghi đè repo đã có nội dung mà chưa xem và hỏi.
- Nếu preflight tìm thấy bí mật: dừng, báo người dùng, chỉ đẩy tiếp khi đã gỡ.

## Tài liệu & script

- `references/01-route-claude-code.md`, `02-route-mcp-only.md`, `03-route-browser.md`, `04-troubleshooting.md`
- `scripts/preflight.sh <dir>`: kiểm tra + tạo `.nojekyll` + in số file/dung lượng.
- `scripts/verify-pages.sh <url> [giây-tối-đa]`: chờ đến khi HTTP 200 và in `<title>`.
