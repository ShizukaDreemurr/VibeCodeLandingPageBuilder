# 02 - Đường B: firebase-tools CLI

Không cần cài global; luôn dùng `npx firebase-tools@latest` (Node 18+).

```bash
cd <thu-muc-app>                       # có index.html, js/config.js
npx firebase-tools@latest --version

# 1. Đăng nhập (MANUAL: người dùng mở URL, đăng nhập, dán mã lại)
npx firebase-tools@latest login --no-localhost
npx firebase-tools@latest login:list

# 2. Tạo project (Spark; CLI không gắn billing)
npx firebase-tools@latest projects:create ten-nhom-2026 --display-name "Ten Nhom"
#   Lỗi 'Terms of Service' hoặc 'permission' -> MANUAL: người dùng mở console.firebase.google.com, tạo/accept rồi chạy tiếp.
npx firebase-tools@latest projects:list

# 3. Thêm web app và lấy config
npx firebase-tools@latest apps:create web "Ten App" --project ten-nhom-2026
npx firebase-tools@latest apps:list --project ten-nhom-2026
npx firebase-tools@latest apps:sdkconfig web <APP_ID> --project ten-nhom-2026
#   In ra firebaseConfig: lấy apiKey, authDomain, projectId, appId dán vào js/config.js (enabled: true)

# 4. Firestore: tạo database (nếu chưa có) rồi deploy rules
npx firebase-tools@latest firestore:databases:create "(default)" --location asia-southeast1 --project ten-nhom-2026
cat > firebase.json <<'JSON'
{ "firestore": { "rules": "firestore.rules" } }
JSON
npx firebase-tools@latest deploy --only firestore:rules --project ten-nhom-2026

# 5. Emulator để test (cần Java 11+ cho Firestore emulator)
npx firebase-tools@latest emulators:start --only auth,firestore --project demo-ten-nhom
```

Ghi chú:
- `firestore:databases:create` có thể không có ở bản cũ -> dùng `@latest`, hoặc tạo database ở console (`03`).
- Nếu `firebase.json` đã có thì thêm khoá `firestore` thay vì ghi đè; thêm khối `emulators` (`auth` 9099, `firestore` 8080 hoặc cổng starter dùng) khi cần.
- CLI **không** bật được Google provider và Authorized domains theo cách đơn giản -> **MANUAL** ở console (`03`, mục 4 và 5).
- Không dùng `firebase login:ci` (sinh token dài hạn, dễ lộ). Không `firebase init hosting` / `deploy` hosting: web đi qua GitHub Pages.
- Project id bắt đầu `demo-` cho emulator: không đụng dữ liệu thật.
- Sau khi xong: `node skills/firebase-setup/scripts/check-firebase-config.mjs .`
