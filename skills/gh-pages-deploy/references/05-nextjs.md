# Đường D — Next.js xuất tĩnh lên GitHub Pages

> GitHub Pages chỉ phục vụ **tệp tĩnh (HTML/CSS/JS)**. Nếu dự án dùng Next.js, bắt buộc bật **Static Export (`output: 'export'`)**, tắt tối ưu ảnh phía server, xử lý `basePath` (nếu là Project Page), và thêm `.nojekyll` để thư mục `_next/` không bị bỏ qua.

---

## 1. Cấu hình `next.config.mjs` (hoặc `next.config.js`)

```js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'TEN-REPO'; // Đổi thành tên repo GitHub (nếu dùng User Page TEN.github.io thì để trống '')

const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // Bắt buộc: GitHub Pages không có Image Optimization Server
  trailingSlash: true,           // Giúp đường dẫn /gioi-thieu/ ra /gioi-thieu/index.html (tránh 404 khi F5)
  basePath: isProd && repo ? `/${repo}` : '',
  assetPrefix: isProd && repo ? `/${repo}/` : '',
};

export default nextConfig;
```

### Giới hạn cần tránh khi dùng `output: 'export'`
- **Không dùng** API Routes (`app/api/**` hoặc `pages/api/**`), Server Actions, Middleware, `cookies()`, `headers()`, hay `getServerSideProps`.
- Mọi route động (`[id]/page.tsx`) bắt buộc phải khai báo `generateStaticParams()` (hoặc chuyển sang query `?id=...` đọc ở client).
- Nếu gọi AI/API ngoài: gọi từ client qua proxy trung gian (như Cloudflare Worker) thay vì viết route `/api/*` trong Next.js.

---

## 2. Tạo file `.nojekyll` sau khi build

Mặc định GitHub Pages chạy **Jekyll**, và Jekyll **bỏ qua mọi thư mục bắt đầu bằng dấu gạch dưới (`_`)** — tức là toàn bộ CSS/JS trong `out/_next/` sẽ bị mất dẫn đến trang trắng hoặc vỡ giao diện.

Trong `package.json`, thêm `touch out/.nojekyll` vào script build (hoặc tạo trong GitHub Actions):
```json
{
  "scripts": {
    "build": "next build && node -e \"require('fs').writeFileSync('out/.nojekyll', '')\""
  }
}
```
*(Dùng `node -e` chạy được trên cả Windows lẫn Linux/macOS, không bị lỗi thiếu lệnh `touch` trên Windows.)*

---

## 3. Deploy tự động bằng GitHub Actions (Khuyên dùng)

Không cần commit thư mục `out/` vào Git. Tạo file `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy Next.js static site to GitHub Pages

on:
  push:
    branches: ["main"] # Đổi thành nhánh bạn đang làm nếu không phải main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Ensure .nojekyll exists
        run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Bật nguồn GitHub Actions trên GitHub
1. Vào repo trên GitHub → **Settings** → **Pages**.
2. Ở mục **Build and deployment → Source**, đổi từ *Deploy from a branch* sang **GitHub Actions**.
3. Push code lên nhánh đã cấu hình (hoặc vào tab **Actions** → bấm **Run workflow**).
4. Kiểm tra link sống bằng: `bash scripts/verify-pages.sh https://TEN-USER.github.io/TEN-REPO/`

---

## 4. Lỗi hay gặp với Next.js trên GitHub Pages

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Trang mở lên toàn chữ thô, mất hết CSS/JS, Console báo 404 `_next/static/...` | Thiếu `.nojekyll` trong `out/` | Thêm `out/.nojekyll` ở bước build hoặc Actions |
| 404 ảnh / asset ở `https://user.github.io/repo/` | Thiếu `basePath` hoặc dùng đường dẫn tuyệt đối `/logo.png` | Đặt `basePath: '/TEN-REPO'` và dùng đường dẫn tương đối hoặc `next/image` kèm `basePath` |
| `Error: Image Optimization using the default loader is not compatible with { output: 'export' }` | Quên tắt tối ưu ảnh server | Thêm `images: { unoptimized: true }` vào `next.config.*` |
| F5 ở trang con `/about` bị 404 | Thiếu `trailingSlash: true` | Bật `trailingSlash: true` để tạo `out/about/index.html` |
