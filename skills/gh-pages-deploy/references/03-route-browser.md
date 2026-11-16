# Đường C — Điều khiển trình duyệt (Claude in Chrome / computer-use / browser-use MCP)

Giao diện GitHub là tiếng Anh; dùng đúng nhãn bên dưới.

## Nguyên tắc
- Người dùng **tự đăng nhập** github.com (và 2FA). Thấy trang "Sign in": dừng, nhờ người dùng đăng nhập, rồi tiếp tục. Không gõ mật khẩu/token/mã hộ.
- Chụp ảnh sau mỗi bước chính để chắc đã đúng.
- Hỏi xác nhận trước khi chọn **Public**.

## 1. Tạo repo
1. Mở https://github.com/new
2. Owner: tài khoản người dùng. **Repository name**: `ten-repo` (chữ thường, gạch ngang).
3. Chọn **Public**. Không tick "Add a README" nếu định dùng upload (tick cũng được, sẽ có nhánh `main` sẵn).
4. Bấm **Create repository**.

## 2. Upload file
1. Ở trang repo trống: link **uploading an existing file** (hoặc repo đã có: **Add file** -> **Upload files**). Trực tiếp: `https://github.com/OWNER/REPO/upload/main`.
2. Kéo-thả file/thư mục vào khung "Drag files here", hoặc **choose your files**. Với thư mục, kéo cả thư mục để giữ cấu trúc.
3. Giới hạn web: **tối đa 100 file / 25 MB mỗi lần upload** (mỗi file <= 25 MB). Dự án lớn: chia nhiều lượt, mỗi lượt commit riêng. Tốt nhất nén bớt ảnh trước.
4. Nhớ có `index.html` và `.nojekyll` (file ẩn bắt đầu bằng dấu chấm có thể không hiện khi chọn; tạo qua **Add file** -> **Create new file**, tên `.nojekyll`, **Commit changes...** -> **Commit changes**).
5. Cuối trang: **Commit directly to the `main` branch** -> **Commit changes**.
6. Với browser-use MCP: dùng `set_input_files` trên `input[type=file]` thay vì kéo-thả nếu kéo-thả không hoạt động.

## 3. Bật Pages
1. `https://github.com/OWNER/REPO/settings/pages` (hoặc **Settings** -> **Pages** ở thanh bên "Code and automation").
2. **Build and deployment** -> **Source**: **Deploy from a branch**.
3. **Branch**: chọn `main` (hoặc nhánh khác) và folder **/ (root)** (hoặc **/docs**) -> **Save**.
4. Tải lại trang sau ít giây: xuất hiện "Your site is live at https://OWNER.github.io/REPO/" (hoặc "Your site is ready to be published" khi đang build).

## 4. Chờ build
1. Tab **Actions** -> workflow **pages-build-deployment** -> chờ dấu xanh (thường 1–5 phút). Đỏ: mở log, xem `04-troubleshooting.md`.
2. Mở URL, kiểm tiêu đề và chức năng chính; F12 -> Console không có lỗi đỏ.
3. Thấy bản cũ: Ctrl+Shift+R hoặc thêm `?v=2`.

## Ghi chú
- Repo private trên gói free: mục Pages hiện "Upgrade or make this repository public". Cần xác nhận người dùng rồi mới **Settings** -> **General** -> **Danger Zone** -> **Change visibility** -> **Make public** (nhập tên repo để xác nhận do người dùng đồng ý).
- Firebase: thêm `OWNER.github.io` vào Authorized domains (xem 04).
