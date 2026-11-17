# 04 - Rules owner-only và cách test

## Mẫu `firestore.rules` (khớp starter: `users/{uid}/**` chỉ chủ sở hữu)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // Mọi đường dẫn khác: mặc định bị chặn.
  }
}
```
Mở rộng thường gặp (chỉ khi đề cần): đọc công khai nhưng chỉ chủ ghi:
```
match /public/{docId} {
  allow read: if true;
  allow create: if request.auth != null && request.resource.data.ownerUid == request.auth.uid;
  allow update, delete: if request.auth != null && resource.data.ownerUid == request.auth.uid;
}
```
Tránh: `allow read, write: if true;` và "test mode" (`request.time < ...`): script `check-firebase-config.mjs` sẽ báo lỗi mẫu đầu.

## Deploy
- MCP: `firebase_deploy` (chỉ firestore rules), kiểm `firebase_get_security_rules`.
- CLI: `npx firebase-tools@latest deploy --only firestore:rules --project <id>`.
- Tay: Console -> Firestore -> Rules -> Publish.

## Test bằng emulator
```bash
npm i -D @firebase/rules-unit-testing firebase   # trong thư mục test, không commit node_modules
npx firebase-tools@latest emulators:exec --only firestore --project demo-test "node --test tests/rules.test.mjs"
```
`tests/rules.test.mjs`:
```js
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { test, before, after } from 'node:test';
let env;
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-test',
  firestore: { rules: readFileSync('firestore.rules', 'utf8') } }); });
after(() => env.cleanup());
test('chủ ghi/đọc được dữ liệu của mình', async () => {
  const db = env.authenticatedContext('alice').firestore();
  await assertSucceeds(db.doc('users/alice/notes/1').set({ t: 'x' }));
  await assertSucceeds(db.doc('users/alice/notes/1').get());
});
test('người khác không đọc/ghi được', async () => {
  const db = env.authenticatedContext('bob').firestore();
  await assertFails(db.doc('users/alice/notes/1').get());
  await assertFails(db.doc('users/alice/notes/1').set({ t: 'y' }));
});
test('chưa đăng nhập bị chặn', async () => {
  await assertFails(env.unauthenticatedContext().firestore().doc('users/alice/notes/1').get());
});
```
Cần Java 11+ cho emulator. Starter có `emulator: true` trong `js/config.js` để app trỏ vào emulator khi chạy local.

## Bí mật
Không bao giờ để trong repo: service account JSON, `firebase login:ci` token, `.env` có khoá riêng. `apiKey` trong web config thì công khai được. App Check (reCAPTCHA v3/Enterprise) là lớp thêm, tuỳ chọn.
