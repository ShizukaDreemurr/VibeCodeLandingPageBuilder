# Kiểm thử tự động (Playwright)

| File | Kiểm tra | Cách chạy |
|---|---|---|
| `e2e-local.cjs` | Lõi 5 tính năng, quy tắc nghiệp vụ, AI copy-prompt, mobile (chế độ localStorage) | `node tests/e2e-local.cjs <thư-mục-ảnh>` |
| `e2e-sheet.cjs` + `mock-sheet-server.cjs` | Đồng bộ Google Sheet: 2 thiết bị, trùng, mất mạng rồi gửi lại (máy chủ giả lập) | chạy `node tests/mock-sheet-server.cjs` rồi `node tests/e2e-sheet.cjs` |
| `e2e-templates.cjs` | Thư viện mẫu (lọc, đổi mẫu giữ nội dung), mẫu thiệp cưới, ô ảnh (bìa, diễn giả, album), ghi nguồn studio | `node tests/e2e-templates.cjs <thư-mục-có-photo.jpg>` |
| `e2e-builder.cjs` | Bố cục (đổi thứ tự, ẩn/hiện, phần bắt buộc), sửa chữ trực tiếp, xem thử trạng thái (sắp hết chỗ, hết chỗ, hết ưu đãi, đã diễn ra) | `node tests/e2e-builder.cjs` |
| `e2e-features.cjs` | Sự kiện của tôi (mở, nhân bản, xoá), chăm sóc lead (trạng thái, gọi/Zalo), số liệu, checklist trước xuất bản | `node tests/e2e-features.cjs` |
| `e2e-firebase.cjs` | Firebase: xuất bản, link/QR, khách đăng ký, số đếm tức thì, trùng SĐT/email, hết chỗ, đăng ký đồng thời, người lạ không đọc được danh sách | `python3 -m http.server 8000` rồi trong thư mục có `firebase.json`: `npx firebase emulators:exec --only firestore,auth "node tests/e2e-firebase.cjs"` |
| `../firebase/rules.test.mjs` | 21 ca quy tắc bảo mật Firestore | xem `firebase/README.md` |

Ghi chú: các test Firebase chạy trên **Firebase Emulator** (`?emulator=1`), không đụng dữ liệu thật.
