# 06 — Hồ sơ nộp và triển khai

## Triển khai GitHub Pages (nhánh `claude/*`)

Xclipse chạy GitHub Pages từ nhánh `claude/<tên>`. Cách làm nhanh:

1. Repo của đội đã có nhánh làm việc `claude/<tên>` (do Claude Code tạo). Đẩy code app (file `index.html` ở **gốc** repo hoặc thư mục Pages đã chọn).
2. GitHub → repo → **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*; Branch = `claude/<tên>`, thư mục `/ (root)`; Save. (Nếu repo không cho chọn nhánh này, đội tạo nhánh `main`/`gh-pages` từ nhánh làm việc và chọn nhánh đó.)
3. Link: `https://<tài-khoản>.github.io/<tên-repo>/`. Lần đầu chờ 1–5 phút; xem tab **Actions** (pages-build-deployment) xanh là xong.
4. Tạo `.nojekyll` ở gốc nếu thư mục có tên bắt đầu bằng `_`.
5. Đường dẫn trong app phải **tương đối** (`css/app.css`, không `/css/app.css`) vì Pages nằm dưới `/<tên-repo>/`.
6. Kiểm tra: mở link ở cửa sổ ẩn danh + trên điện thoại; chân trang hiện đúng phiên bản.

Trước khi push (điều phối viên):

```
node --check js/*.js
node scripts/<bump-version>      # sửa js/version.js rồi bump ?v=
# chạy test đầy đủ trên http://localhost:8080/
git add -A && git commit && git push -u origin <nhánh>
```

## Cache

- Mọi `<script src>` và `<link href>` nội bộ có `?v=<phiên bản>`; bump mỗi lần phát hành.
- Sau push, trang cũ có thể còn 1–10 phút: Ctrl+F5, kiểm tra phiên bản ở chân trang; nếu chưa đổi → xem Actions.
- Khi demo ở giám khảo: mở link trước, nhấn tải lại cứng, xác nhận phiên bản.

## Firebase (tuỳ chọn, chỉ khi đề cần dữ liệu chung nhiều thiết bị)

- 60 phút: **mặc định localStorage**, ghi rõ giới hạn. Firebase chỉ khi đề yêu cầu đồng bộ; cấu hình web Firebase công khai được nhưng phải có rules bảo vệ; tuyệt đối không đưa service account/secret.
- Có sẵn tài nguyên trong repo gốc `firebase/` (rules + test) để tham khảo, không bắt buộc.

## Hồ sơ nhanh (điền từ `templates/`)

| Hồ sơ | Làm thế nào trong ~5 phút | Ai |
|---|---|---|
| README | Chép mẫu: đề số, tên đội, bảng, link demo, 5 tính năng, cách chạy local, AI dùng (xây + trong sản phẩm), nhãn mô phỏng nguyên văn, giới hạn, nguồn tham khảo/khai báo template-thư viện-AI, **không key** | Docs agent (Haiku) |
| Bảng kiểm thử | Từ bảng nghiệm thu spec: chạy ca thật, ghi kết quả thực tế + ngày + lệnh. B ≥3 ca, A ≥6 ca (2 thường, 2 sai, 2 biên) | QA agent chạy, Docs agent ghi |
| Minh chứng AI | ≤1 trang + 5 ảnh: prompt đội gửi AI, kết quả, lỗi, prompt sửa, kết quả sau; chụp từ hội thoại thật; che key/email/SĐT | Đội chụp, Docs agent ghép |
| Video ≤2 phút | Quay màn hình thao tác thật trên link online, đủ 5 tính năng (nếu đề yêu cầu) | Đội |
| Source | Đẩy repo; nếu cần ZIP: `git archive HEAD -o app.zip` (không `.git`, không `.env*`, không `node_modules`); giải nén thử ở thư mục mới và mở | Điều phối |
| Slide | `deck/` → xuất PDF dự phòng | Deck agent |

Ghi hồ sơ thật: ca chưa thử thì ghi "Chưa kiểm chứng", không ghi "Đạt".

## Quét secret trước khi push/nộp

Ý tưởng từ skill của thầy: lấy các giá trị bí mật trong `.env.local` (hoặc key đội đang dùng) và tìm chúng trong thư mục sẽ nộp; **chỉ in tên biến và tên tệp, không in giá trị**.

```
node scripts/<scan-secrets>.mjs <thư-mục-app> <đường-dẫn-.env.local>   # nếu có trong scripts/
```
Nếu không có `.env.local`, quét mẫu phổ biến:

```
git ls-files -z | xargs -0 grep -nEI "AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|api[_-]?key['\"]?\s*[:=]\s*['\"][^'\"]{12,}" | cut -c1-120
```
Kết quả phải rỗng (trừ `firebase-config.js` public có chủ ý, ghi chú trong README). Kiểm tra cả ảnh chụp minh chứng (không lộ key). Lỡ lộ key → thu hồi/tạo key mới, không chỉ xoá commit.

## Checklist T+48 trước khi nói "xong"

- [ ] Test xanh (kết quả thật) trên bản đã merge.
- [ ] Quét secret sạch.
- [ ] Phiên bản + `?v=` đã bump; link online mở ở ẩn danh, đúng phiên bản.
- [ ] Mobile 390px không tràn ngang; sáng/tối ổn.
- [ ] Nhãn mô phỏng đúng nguyên văn đề.
- [ ] README + bảng kiểm thử + minh chứng đủ; không key.
- [ ] Video/bản local/ảnh dự phòng sẵn sàng.
