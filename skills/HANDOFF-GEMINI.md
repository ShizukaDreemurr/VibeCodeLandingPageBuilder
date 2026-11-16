# BÀN GIAO TẠM — GEMINI (ANTIGRAVITY) → CLAUDE (OPUS)

- **Nhánh làm việc:** `ag/tam-thoi` (tạo từ `origin/claude/serene-ramanujan-7wxqwr` tại `d13aff2`)
- **Nhánh chuẩn:** `claude/serene-ramanujan-7wxqwr` — chưa đụng, chưa đẩy gì lên nhánh chuẩn.
- **Phạm vi:** Chỉ chỉnh trong `skills/`. Không đụng app Xclipse ở gốc repo.

---

## 1. Danh sách commit trên `ag/tam-thoi`

1. `f8bf6f9` — `gh-pages-deploy: add Next.js static export & GitHub Actions guide (05-nextjs.md)`:
   - Tạo `skills/gh-pages-deploy/references/05-nextjs.md` hướng dẫn `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, `basePath`/`assetPrefix`, tạo `out/.nojekyll`, workflow GitHub Actions (`actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`), và bảng xử lý lỗi hay gặp.
   - Cập nhật mục lục `Tài liệu & script` trong `skills/gh-pages-deploy/SKILL.md`.
2. `ee08335`..`7b013eb` — Tạo và cập nhật `skills/HANDOFF-GEMINI.md` trên `ag/tam-thoi`.
3. `cf3fb32` — `proxy: compare ALLOWED_ORIGINS case-insensitively in worker.js` (sửa lỗi `403 Forbidden` khi trình duyệt gửi `Origin: https://shizukadreemurr.github.io` viết thường).
4. Commit kế tiếp — `starter: set gemini-4-hydrogen as default model in ai.js and smoke.cjs`.

---

## 2. Trạng thái kiểm thử (nói thật, không đoán)

### Đã test
- `bash skills/gh-pages-deploy/scripts/preflight.sh skills/vibe-sprint/starter`: đạt (`0 loi, 0 canh bao`, `36 file, ~352 KB`). Đã xóa `.nojekyll` tạm sau khi test để giữ `starter/` sạch.
- `node skills/firebase-setup/scripts/check-firebase-config.mjs skills/vibe-sprint/starter`: chạy đúng, xác nhận `firestore.rules` đạt và báo đúng 4 trường config trống khi Firebase đang tắt.
- `node skills/vibe-sprint/scripts/scan-secrets.mjs skills`: đạt (`Lộ: 0`).
- **Cloudflare Worker Proxy (`https://vibe-gemini-proxy.xclipse.workers.dev`):** Nguyên đã deploy, kiểm tra `/health` trả `{"ok":true}`, và gọi `POST /gemini/gemini-4-hydrogen` từ `https://shizukadreemurr.github.io/xclipse-pages-test/` trả `200 OK` với JSON thật.
- **Deploy GitHub Pages thật (`skills/gh-pages-deploy`):** Đã chạy thử trọn luồng trên repo public nháp `ShizukaDreemurr/xclipse-pages-test` (nhánh `main`, bật `data-hero="fluted"` và `proxyUrl: 'https://vibe-gemini-proxy.xclipse.workers.dev'`): `preflight.sh` đạt (`0 loi, 0 canh bao`), `gh api` bật Pages thành công, `pages/builds/latest` trả về `status: "built"`, `error: null` tại `https://shizukadreemurr.github.io/xclipse-pages-test/`.
- **Playwright `skills/vibe-sprint/starter/tests/smoke.cjs`:** Chạy trên `http://localhost:8212/` sau khi đổi mặc định sang `gemini-4-hydrogen` -> `TẤT CẢ ĐẠT` (bao gồm `Gemini: header key + đổi model khi 429` và `Proxy: gọi /gemini/<model> không gửi key, đổi model khi 429`).

### Chưa test (cần Nguyên thao tác / xác nhận)
- **Thiết lập Firebase thật (`skills/firebase-setup`):** Chưa chạy thử với tài khoản Google rảnh (cần Nguyên tự đăng nhập Google / Firebase Console).

---

## 3. Lỗi đang dở
- Không có lỗi code nào đang dở trên `ag/tam-thoi`.

---

## 4. Câu hỏi cần Nguyên hoặc Claude quyết
1. **Claude / Nguyên:** Có muốn điền sẵn `proxyUrl: 'https://vibe-gemini-proxy.xclipse.workers.dev'` vào `starter/js/config.js` (hoặc chỉ bật lúc thi) không?
2. **Nguyên:** Bạn có đồng ý cho tạo 1 repo GitHub **public** nháp (ví dụ `xclipse-pages-test` — ai cũng xem được code) để Antigravity chạy test thật trọn luồng `gh-pages-deploy` không?
