# Xử lý sự cố GitHub Pages

| Triệu chứng | Nguyên nhân thường gặp | Cách kiểm | Cách sửa |
|---|---|---|---|
| **404** "There isn't a GitHub Pages site here" | Chưa bật Pages | Settings -> Pages | Bật: Deploy from a branch |
| 404 | Sai nhánh/thư mục nguồn | Pages hiện branch/folder nào? | Chọn đúng nhánh chứa `index.html`, `/ (root)` hay `/docs` |
| 404 | Thiếu `index.html` ở nguồn | `get_file_contents` / xem repo | Đưa `index.html` lên gốc (hoặc `/docs`) |
| 404 | Repo private trên gói free | Pages báo "Upgrade or make public" | Xin xác nhận rồi đổi public |
| 404 trên file con | Sai hoa thường (`Logo.PNG` vs `logo.png`) | So tên file trong repo với code | Đổi tên cho khớp, tránh dấu cách |
| 404 dù vừa bật | Build chưa xong | Actions -> pages-build-deployment | Chờ 1–5 phút, chạy `verify-pages.sh` |
| **Trang trắng** | Đường dẫn tuyệt đối `/js/app.js` | F12 -> Network 404; `preflight.sh` | Đổi thành `js/app.js` / `./js/app.js` |
| Trang trắng | Lỗi JS | F12 -> Console | Sửa lỗi; thử bằng `python3 -m http.server` |
| Trang trắng khi mở `file://` | ES module / fetch bị CORS | Console báo CORS | Không mở file trực tiếp; dùng link Pages hoặc server cục bộ |
| Hiện README thay vì app | Không có `index.html` ở nguồn | Xem gốc repo | Thêm `index.html` |
| **Vẫn bản cũ** | Cache trình duyệt/CDN (tới ~10 phút) | Mở tab ẩn danh | Ctrl+Shift+R, thêm `?v=2`, đợi build mới xong |
| Bản cũ dù đã hard reload | Đẩy lên nhánh khác nguồn Pages | So nhánh đã push với nhánh trong Pages | Push đúng nhánh hoặc đổi nguồn |
| **Actions đỏ** (pages-build-deployment) | Jekyll lỗi (front matter, `{{`, `{%`) | Mở log lỗi | Thêm `.nojekyll` ở gốc, commit |
| Actions đỏ | File > 100 MB / site > 1 GB | Log | Giảm dung lượng, loại file nặng |
| **Push 403** | App "Claude" chưa cài trên repo | https://github.com/apps/claude/installations/select_target | Cài app, cấp quyền repo |
| Push 403 / từ chối | Push sai nhánh (cloud session chỉ cho nhánh phiên) | `git branch --show-current` | Push nhánh `claude/...` được chỉ định |
| `non-fast-forward` | Nhánh có commit mới | | `git pull --no-edit origin <nhánh>` rồi push; không force-push |
| **Firebase `auth/unauthorized-domain`** | Domain chưa nằm trong danh sách | Console báo lỗi | Firebase Console -> Authentication -> Settings -> Authorized domains -> Add domain `<user>.github.io` |
| Firestore `permission-denied` | Rules chặn | Firebase Console -> Rules | Sửa rules (đúng quyền tối thiểu, không `allow read, write: if true` cho dữ liệu nhạy cảm) |
| Ảnh/font không hiện | Sai đường dẫn/hoa thường | Network tab | Sửa đường dẫn |
| Form/API gọi `http://` bị chặn | Mixed content (Pages là https) | Console | Dùng `https://` |
| CSS tải nhưng sai | `<base href="/">` | Xem `<head>` | Bỏ hoặc đổi `<base href="./">` |

## Lệnh hữu ích
```bash
gh api repos/OWNER/REPO/pages                     # cấu hình Pages hiện tại
gh api repos/OWNER/REPO/pages/builds/latest       # build mới nhất (status, error)
gh run list --workflow pages-build-deployment -L 3
curl -sI https://OWNER.github.io/REPO/ | head -5
```
Nếu vẫn không ra: chụp màn hình Settings -> Pages và log Actions, gửi cho giảng viên/đội hỗ trợ (đừng gửi token).

## App tĩnh cần gọi AI (Gemini) mà không lộ key

GitHub Pages không giữ được bí mật: mọi key trong JS/repo đều công khai. Dùng proxy Cloudflare Worker trong `skills/vibe-sprint/proxy/` (xem `proxy/README.md`): key là secret trên Cloudflare, trang chỉ biết URL `https://vibe-gemini-proxy.<subdomain>.workers.dev`. Lỗi thường gặp: trình duyệt báo CORS/403 = `ALLOWED_ORIGINS` thiếu origin của trang (chỉ tên miền, không có tên repo, không có `/` cuối); sau khi sửa `wrangler.toml` phải `npx wrangler deploy` lại.
