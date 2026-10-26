# Kiểm thử tự động (Playwright)

| File | Kiểm tra | Cách chạy |
|---|---|---|
| `e2e-local.cjs` | Lõi 5 tính năng, quy tắc nghiệp vụ, AI copy-prompt, mobile (chế độ localStorage) | `node tests/e2e-local.cjs <thư-mục-ảnh>` |
| `e2e-sheet.cjs` + `mock-sheet-server.cjs` | Đồng bộ Google Sheet: 2 thiết bị, trùng, mất mạng rồi gửi lại (máy chủ giả lập) | chạy `node tests/mock-sheet-server.cjs` rồi `node tests/e2e-sheet.cjs` |
| `e2e-firebase.cjs` | Firebase: xuất bản, link/QR, khách đăng ký, số đếm tức thì, trùng SĐT/email, hết chỗ, đăng ký đồng thời, người lạ không đọc được danh sách | `python3 -m http.server 8000` rồi trong thư mục có `firebase.json`: `npx firebase emulators:exec --only firestore,auth "node tests/e2e-firebase.cjs"` |
| `../firebase/rules.test.mjs` | 21 ca quy tắc bảo mật Firestore | xem `firebase/README.md` |

Ghi chú: các test Firebase chạy trên **Firebase Emulator** (`?emulator=1`), không đụng dữ liệu thật.
