---
name: firebase-setup
description: Dựng Firebase (gói Spark miễn phí) cho app web tĩnh của đội sinh viên - tạo project, thêm web app, lấy config dán vào js/config.js, bật Firestore + đăng nhập Google, thêm Authorized domains cho GitHub Pages, deploy firestore.rules owner-only, rồi test đăng nhập trên link Pages. Tự chọn đường MCP Firebase, firebase-tools CLI hoặc trình duyệt console. Dùng khi người dùng nói "cài Firebase", "tạo project Firebase", "bật đăng nhập Google", "lấy firebaseConfig", "Firestore rules", "auth/unauthorized-domain", "permission-denied", "popup bị chặn", or "set up Firebase", "enable Google sign-in", "deploy Firestore rules", "Firebase config for GitHub Pages", "fix Firebase auth error".
---

# firebase-setup - từ "chưa có gì" đến đăng nhập Google + Firestore chạy trên GitHub Pages

Dành cho app tĩnh (HTML/CSS/JS thuần, không build), ví dụ `skills/vibe-sprint/starter`. Module Firebase của starter đọc cấu hình ở `js/config.js`:

```js
firebase: { enabled: false, config: { apiKey: '', authDomain: '', projectId: '', appId: '' }, emulator: false }
```
và có sẵn `js/firebase.js`, `firestore.rules` (mẫu `users/{uid}/**` chỉ chủ sở hữu). Skill này không sửa starter; nó giúp **điền** các giá trị trên và dựng phía Firebase cho khớp.

Nguyên tắc: Spark miễn phí, **không bao giờ bật billing**, không Cloud Functions. Không xin/lưu mật khẩu, mã 2FA, service account key. Người dùng tự đăng nhập Google.

## 1. Chọn đường (route picker)

Làm theo thứ tự, không hỏi nếu tự phát hiện được:

1. **Đường A - Firebase MCP server.** Chạy ToolSearch với query `firebase`. Nếu thấy các tool như `firebase_login`, `firebase_create_project`, `firebase_create_app`, `firebase_get_sdk_config`, `firebase_get_security_rules`, `firebase_deploy`, `firebase_init`, `developerknowledge_*` (tên thật có thể có tiền tố `mcp__plugin_firebase_firebase__`) -> đọc `references/01-mcp.md`.
2. **Đường B - firebase-tools CLI.** Có shell + Node (`node -v`; dùng `npx firebase-tools@latest ...`, không cần cài global) -> `references/02-cli.md`.
3. **Đường C - trình duyệt** tại `console.firebase.google.com` (Claude in Chrome / browser-use / computer-use, hoặc người dùng tự bấm theo hướng dẫn) -> `references/03-console-browser.md`.

Có thể kết hợp: A/B tạo project + deploy rules, C để bật Google provider và Authorized domains nếu tool không làm được. Nếu không có gì: đưa `references/03` làm hướng dẫn tay cho người dùng.

## 2. Quy trình end-to-end

| # | Bước | Ai làm |
|---|------|--------|
| 1 | Đăng nhập Google (Firebase) | **NGƯỜI DÙNG** |
| 2 | Tạo project (Spark, không billing), đặt ID dạng `ten-nhom-2026` | Claude/tool (người dùng chấp nhận Terms) |
| 3 | Thêm web app -> lấy `apiKey, authDomain, projectId, appId` | Claude/tool |
| 4 | Dán config vào `js/config.js`, đặt `enabled: true` | Claude |
| 5 | Bật Firestore: Production mode, vùng `asia-southeast1` | Claude/tool hoặc người dùng |
| 6 | Bật Authentication -> Google provider (nhập support email) | Thường là **NGƯỜI DÙNG** |
| 7 | Authorized domains: thêm `<user>.github.io` (và `localhost`, thường có sẵn) | Thường là **NGƯỜI DÙNG** |
| 8 | Deploy `firestore.rules` (owner-only) | Claude/tool |
| 9 | Deploy web lên GitHub Pages (skill `gh-pages-deploy`) | Claude |
| 10 | Test đăng nhập trên link Pages + ghi/đọc 1 tài liệu | Claude + người dùng |

Config web (`apiKey`...) là **công khai theo thiết kế**, được phép commit; thứ bảo vệ dữ liệu là Authentication + rules. Chi tiết xem `vibe-sprint/references/07-cookbook-code-mau.md` mục **G** (G1 dựng project, G3 đăng nhập, G4 rules).

### Danh sách việc THỦ CÔNG (MANUAL) - người dùng phải tự làm

- [ ] **Đăng nhập Google** (hộp thoại/URL do `firebase_login` hoặc `firebase login --no-localhost` đưa ra). Claude không nhập mật khẩu/2FA hộ.
- [ ] **Chấp nhận Terms of Service** của Firebase/Google Cloud khi tạo project lần đầu.
- [ ] **Bật Google provider** (Authentication -> Sign-in method -> Google -> Enable + chọn support email) nếu tool không làm được (CLI và hầu hết MCP không có lệnh này).
- [ ] **Thêm Authorized domain** `<user>.github.io` nếu tool không làm được.
- [ ] **Billing: KHÔNG BAO GIỜ.** Gặp màn hình đòi nâng lên Blaze/nhập thẻ -> dừng, báo người dùng, chọn cách khác (không dùng Functions, Storage bucket mặc định mới cần Blaze).
- [ ] Mở link Pages bằng Chrome thường để thử đăng nhập thật (popup cần người bấm).

## 3. Kiểm tra nhanh

```bash
node skills/firebase-setup/scripts/check-firebase-config.mjs <duong-dan-toi-js/config.js-hoac-thu-muc-du-an>
```
Kiểm tra: các trường không rỗng, `projectId` hợp lệ, `authDomain = <projectId>.firebaseapp.com`, `apiKey` dạng `AIza...`, cảnh báo nếu `enabled: false`, có `firestore.rules` và không phải `allow read, write: if true`. Mã thoát 0 = ổn, 1 = có lỗi.

## 4. Bảo mật

- Rules mẫu owner-only (xem `references/04-rules-va-test.md`): mọi thứ mặc định bị chặn, chỉ `request.auth.uid == uid` được đọc/ghi `users/{uid}/**`. Cấm `allow read, write: if true` (chế độ test hết hạn 30 ngày và ai cũng xoá được dữ liệu).
- **Không bao giờ** commit service account JSON, private key, token CLI (`firebase login:ci`), `.env` có secret. `apiKey` web thì được. `scripts/scan-secrets.mjs` của vibe-sprint vẫn chạy trước khi đẩy.
- App Check (tuỳ chọn): chống lạm dụng quota từ nơi khác; với bài tập/đồ án thì không bắt buộc, ghi một dòng trong README là đủ.
- Test rules bằng emulator trước khi deploy (`references/04`).
- Chỉ lưu dữ liệu cá nhân tối thiểu; không lưu mật khẩu hay dữ liệu nhạy cảm tự do trong Firestore.

## 5. Gỡ lỗi

Tra `references/05-loi-thuong-gap.md`. Các lỗi hay gặp: `auth/unauthorized-domain` (thiếu Authorized domain), popup bị chặn (dùng `signInWithRedirect`), `permission-denied` (rules hoặc chưa đăng nhập), vượt quota Spark, sai `projectId`, CDN bị chặn (vendor sẵn file SDK), iOS Safari + redirect (cookie bên thứ ba; mẹo `authDomain`).

## 6. Liên kết

- Deploy web: skill `skills/gh-pages-deploy` (đưa code lên GitHub Pages, lấy link `https://<user>.github.io/<repo>/`). Lấy tên miền ở bước 7 từ chính link đó.
- Cookbook: `skills/vibe-sprint/references/07-cookbook-code-mau.md` mục G.
- Đề nếu đã quy định localStorage là nơi lưu chính thì Firebase chỉ là **tuỳ chọn** và phải mô tả đúng như vậy.
