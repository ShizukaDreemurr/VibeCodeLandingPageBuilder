# Firebase (Firestore + Google Sign-in)

- `firestore.rules` — quy tắc bảo mật (khách chỉ gửi đăng ký; chỉ chủ sự kiện đọc danh sách; chống trùng SĐT/email; đếm chỗ chính xác).
- `rules.test.mjs` — 33 ca kiểm thử quy tắc trên Firestore Emulator.

Chạy kiểm thử (cần Java + Node):
```bash
cd firebase
npm i -D firebase-tools @firebase/rules-unit-testing firebase
echo '{"firestore":{"rules":"firestore.rules"},"emulators":{"firestore":{"port":8085}}}' > firebase.json
npx firebase emulators:exec --only firestore --project demo-ep "node rules.test.mjs"
```
