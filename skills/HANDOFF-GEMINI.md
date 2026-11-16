# BÀN GIAO TẠM — GEMINI (ANTIGRAVITY) → CLAUDE (OPUS)

- **Nhánh làm việc:** `ag/tam-thoi` (tạo từ `origin/claude/serene-ramanujan-7wxqwr` tại `d13aff2`)
- **Nhánh chuẩn:** `claude/serene-ramanujan-7wxqwr` — chưa đụng, chưa đẩy gì lên nhánh chuẩn.
- **Phạm vi:** Chỉ chỉnh trong `skills/`. Không đụng app Xclipse ở gốc repo.

---

## 1. Danh sách commit trên `ag/tam-thoi`

1. `f8bf6f9` — `gh-pages-deploy: add Next.js static export & GitHub Actions guide (05-nextjs.md)`:
   - Tạo `skills/gh-pages-deploy/references/05-nextjs.md` hướng dẫn `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, `basePath`/`assetPrefix`, tạo `out/.nojekyll`, workflow GitHub Actions (`actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`), và bảng xử lý lỗi hay gặp.
   - Cập nhật mục lục `Tài liệu & script` trong `skills/gh-pages-deploy/SKILL.md`.
2. Commit kế tiếp — `docs: add skills/HANDOFF-GEMINI.md on ag/tam-thoi`.

---

## 2. Trạng thái kiểm thử (nói thật, không đoán)

### Đã test
- `bash skills/gh-pages-deploy/scripts/preflight.sh skills/vibe-sprint/starter`: đạt (`0 loi, 0 canh bao`, `36 file, ~352 KB`). Đã xóa `.nojekyll` tạm sau khi test để giữ `starter/` sạch.
- `node skills/firebase-setup/scripts/check-firebase-config.mjs skills/vibe-sprint/starter`: chạy đúng, xác nhận `firestore.rules` đạt và báo đúng 4 trường config trống khi Firebase đang tắt.
- `node skills/vibe-sprint/scripts/scan-secrets.mjs skills`: đạt (`114 tệp, Lộ: 0`).
- **Cloudflare Worker Proxy (`https://vibe-gemini-proxy.xclipse.workers.dev/health`):** Nguyên đã deploy và kiểm tra `/health` trả về `{"ok":true}`.

### Chưa test (cần Nguyên thao tác / xác nhận)
- **Gọi Gemini qua Proxy từ trình duyệt (`proxyUrl`):** Chưa test gắn `proxyUrl: 'https://vibe-gemini-proxy.xclipse.workers.dev'` vào `starter/js/config.js` để gọi thật từ `https://ShizukaDreemurr.github.io` hoặc `http://localhost:8216` (lưu ý nếu secret cũ từng lộ lên chat thì nhớ thu hồi và `wrangler secret put GEMINI_API_KEY` lại bằng key mới).
- **Deploy GitHub Pages thật (`skills/gh-pages-deploy`):** Chưa tạo repo nháp để chạy thử đẩy + bật Pages + `verify-pages.sh` vì quy tắc mục 6 của `gh-pages-deploy` yêu cầu hỏi xác nhận trước khi tạo repo public.
- **Thiết lập Firebase thật (`skills/firebase-setup`):** Chưa chạy thử với tài khoản Google rảnh (cần Nguyên tự đăng nhập Google / Firebase Console).

---

## 3. Lỗi đang dở
- Không có lỗi code nào đang dở trên `ag/tam-thoi`.

---

## 4. Câu hỏi cần Nguyên hoặc Claude quyết
1. **Claude / Nguyên:** Có muốn điền sẵn `proxyUrl: 'https://vibe-gemini-proxy.xclipse.workers.dev'` vào `starter/js/config.js` (hoặc chỉ bật lúc thi) không?
2. **Nguyên:** Bạn có đồng ý cho tạo 1 repo GitHub **public** nháp (ví dụ `xclipse-pages-test` — ai cũng xem được code) để Antigravity chạy test thật trọn luồng `gh-pages-deploy` không?
