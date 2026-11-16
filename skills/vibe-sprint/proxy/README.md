# Proxy Gemini (Cloudflare Worker, gói miễn phí)

Mục đích: web app tĩnh trên GitHub Pages gọi được Gemini mà **key không bao giờ nằm trong trình duyệt hay repo**. Key chỉ nằm ở máy chủ Cloudflare (dạng secret). Trình duyệt gọi `POST https://<worker>/gemini/<model>`, worker thêm header `x-goog-api-key` rồi chuyển tiếp tới Google.

Giới hạn có chủ ý: chỉ 3 model (`gemini-3.6-flash`, `gemini-4-hydrogen`, `gemini-3.8-flash`), chỉ origin trong `ALLOWED_ORIGINS`, body tối đa 32 KB, 30 request/phút/IP, timeout 25 giây. `GET /health` trả `{"ok":true}`.

## Triển khai trong 5 bước

Cần Node.js và một tài khoản Cloudflare miễn phí. Chạy trong thư mục `skills/vibe-sprint/proxy/`.

1. **Đăng nhập Cloudflare** (bạn tự làm trên trình duyệt): `npx wrangler login`
2. **Đặt key Gemini làm secret**: `npx wrangler secret put GEMINI_API_KEY`. Dán key vào **ô nhập trong terminal** khi được hỏi. Không dán key vào chat, vào file hay vào lệnh.
3. **Sửa `ALLOWED_ORIGINS`** trong `wrangler.toml`: danh sách origin được phép, cách nhau dấu phẩy, không có dấu `/` cuối. Ví dụ `https://TEN-GITHUB.github.io,http://localhost:8216`. (Origin chỉ gồm tên miền, không có tên repo.)
4. **Triển khai**: `npx wrangler deploy`. Kiểm tra: mở `https://vibe-gemini-proxy.<subdomain>.workers.dev/health` thấy `{"ok":true}`.
5. **Dán URL vào app**: trong `js/config.js` đặt `ai: { proxyUrl: 'https://vibe-gemini-proxy.<subdomain>.workers.dev', appToken: '' }`, chạy `node tools/bump-version.cjs`, rồi push. Tab Cài đặt sẽ hiện "Đang dùng máy chủ trung gian của đội — không cần nhập key".

Đổi key sau này: chạy lại bước 2 rồi `npx wrangler deploy`. Thu hồi: xoá key ở Google AI Studio.

## Làm rào thêm (tuỳ chọn)

- `APP_TOKEN`: `npx wrangler secret put APP_TOKEN`, rồi đặt cùng giá trị vào `appToken` trong `config.js`. Worker từ chối request thiếu header `X-App-Token`. **Chỉ là làm rào**: token nằm trong JS của trang nên ai xem mã nguồn cũng thấy được. Nó chỉ cản các script vô tình, không cản người cố ý.
- `RATE_LIMIT` (trong `[vars]`): số request/phút/IP. Bộ đếm nằm trong RAM của từng isolate Cloudflare nên **chỉ là best-effort** (nhiều isolate = nhiều bộ đếm, khởi động lại là về 0). Muốn chặn chắc chắn hơn hãy dùng Cloudflare Rate Limiting rules hoặc đặt hạn mức (quota) cho key ở Google AI Studio.
- Origin chỉ ngăn trình duyệt của trang khác dùng proxy; script ngoài trình duyệt vẫn có thể giả header `Origin`. Vì vậy hãy đặt hạn mức thấp cho key dùng cho proxy.

## Thử trên máy (không cần Cloudflare)

```bash
GEMINI_API_KEY="$(cat /đường/dẫn/file/key)" node tests/proxy-local.mjs           # kiểm tra logic + 1 lời gọi thật
GEMINI_API_KEY="$(cat /đường/dẫn/file/key)" node tests/proxy-local.mjs --serve   # proxy ở http://localhost:8787
```
Rồi đặt `proxyUrl: 'http://localhost:8787'` ở bản sao `config.js` và phục vụ app ở cổng 8216 (nằm trong `ALLOWED_ORIGINS` mặc định của harness). Hoặc `npx wrangler dev` với file `.dev.vars` đặt **ngoài repo** (bản sao tạm), không commit.

## Phương án khác

- **Vercel**: tạo `api/gemini.js` (Edge/Node function) làm đúng các việc như `worker.js`, đặt `GEMINI_API_KEY` trong Project Settings -> Environment Variables, `proxyUrl` trỏ tới `https://<project>.vercel.app/api` (cần chỉnh đường dẫn `/gemini/<model>` cho khớp).
- **Firebase Functions**: cần gói Blaze (thẻ thanh toán), **đừng dùng** cho cuộc thi.

## Không bao giờ

Đưa key vào `wrangler.toml`, `.dev.vars` trong repo, `config.js`, ảnh chụp hay log. Trước khi push: `git grep -n "AIza"` và `node skills/vibe-sprint/scripts/scan-secrets.mjs .` phải sạch.
