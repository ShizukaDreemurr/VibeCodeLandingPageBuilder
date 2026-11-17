# 05 - Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| `auth/unauthorized-domain` | Tên miền chưa có trong Authorized domains | Console -> Authentication -> Settings -> Authorized domains -> Add `<user>.github.io` (không kèm `/repo`). Với `localhost` thêm `localhost`. Mở bằng `127.0.0.1` cũng cần thêm riêng. |
| `auth/popup-blocked`, popup không hiện | Trình duyệt chặn / gọi `signInWithPopup` không từ thao tác bấm | Gọi trong handler của nút bấm (không `await` gì trước đó). Dự phòng: bắt lỗi rồi `signInWithRedirect(provider)` và xử lý `getRedirectResult()` khi tải trang. `auth/popup-closed-by-user`: người dùng đóng, cho bấm lại. |
| `auth/operation-not-allowed` | Chưa bật Google provider | Authentication -> Sign-in method -> Google -> Enable + support email. |
| `permission-denied` / "Missing or insufficient permissions" | Rules chặn, hoặc chưa đăng nhập, hoặc ghi sai đường dẫn (không dưới `users/<uid>/`) | Kiểm `auth.currentUser` trước khi ghi; đường dẫn phải là `users/${uid}/...`; deploy lại rules; dùng Rules Playground trong console. Đừng "sửa" bằng `if true`. |
| `resource-exhausted` / quota exceeded | Hết hạn mức Spark (vd 50k đọc/ngày, 20k ghi/ngày) | Giảm đọc (cache, bỏ listener thừa, phân trang); quota reset hằng ngày; **không nâng Blaze**. Vòng lặp ghi bị lỗi code cũng gây ra. |
| Ghi/đọc đi vào project khác, "Not found" | Sai `projectId` / `appId` trong `js/config.js`, hoặc CLI đang trỏ project cũ | Chạy `check-firebase-config.mjs`; `apps:sdkconfig` lấy lại; CLI luôn kèm `--project <id>`. |
| `auth/invalid-api-key`, `auth/api-key-not-valid` | `apiKey` sai/thiếu ký tự, hoặc bị giới hạn referrer trong Google Cloud | Copy lại nguyên khoá `AIza...`; nếu đã giới hạn HTTP referrer, thêm `https://<user>.github.io/*` và `localhost`. |
| SDK không tải, `firebase is not defined` | CDN `gstatic.com` bị chặn (mạng trường/công ty) | Starter (`js/firebase.js`) nạp SDK compat 10.14.1 lười từ gstatic và chỉ khi `firebase.enabled`; bị chặn thì app vẫn chạy bằng localStorage. Muốn offline hoàn toàn: tự tải SDK vào `vendor/firebase/` (như cookbook G2; thư mục này không có sẵn trong skill) và đổi `BASE` trong `js/firebase.js`. |
| Đăng nhập redirect bị lặp/mất phiên trên iOS Safari, Brave | Chặn cookie/lưu trữ bên thứ ba: trang `github.io` và `authDomain` (`*.firebaseapp.com`) khác miền | Ưu tiên `signInWithPopup` (bấm từ cử chỉ người dùng). Với redirect: host trang và `authDomain` cùng miền gốc (cần domain riêng), hoặc dùng Firebase Hosting làm `authDomain`; không thì chấp nhận popup + hướng dẫn cho phép. Ghi vào README là giới hạn đã biết. |
| `auth/internal-error` trong trình duyệt tự động/webview | Google chặn OAuth trong trình duyệt nhúng | Dùng Chrome/Safari thường. |
| Mở `file://` không đăng nhập được | OAuth cần http(s) | Chạy qua GitHub Pages hoặc `npx serve`, localhost. |
| Deploy rules: "Firestore database not found" | Chưa tạo database | Tạo ở `03` mục 3 hoặc `firestore:databases:create`. |
| Đòi billing / Blaze | Dùng tính năng không có trong Spark (Functions, vài loại Storage) | Dừng, bỏ tính năng đó; không nhập thẻ. |

Còn kẹt: dùng `developerknowledge_search_documents` / `developerknowledge_answer_query` (nếu có MCP) hoặc dán nguyên văn mã lỗi (`auth/...`, `permission-denied`) cho Claude kèm ảnh chụp Console -> Authentication.
