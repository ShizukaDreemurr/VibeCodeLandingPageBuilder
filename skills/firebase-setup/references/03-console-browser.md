# 03 - Đường C: trình duyệt, console.firebase.google.com

Người dùng tự đăng nhập Google trong trình duyệt (**MANUAL**). Nhãn dưới đây là giao diện tiếng Anh (đặt ngôn ngữ Google về English nếu UI hiện tiếng Việt). Giao diện có thể đổi nhẹ; tìm theo nhãn.

## 1. Tạo project
`console.firebase.google.com` -> **Create a project** (hoặc **Add project**) -> nhập tên -> **Continue** -> tắt **Enable Gemini in Firebase** (tuỳ) -> Google Analytics: **tắt** cho đơn giản (hoặc bật tuỳ ý) -> **Create project** -> **Continue**. Nếu hỏi chấp nhận Terms: **MANUAL**, người dùng tự tick. Không chọn billing/Blaze.

## 2. Thêm web app và lấy config
Trang project -> biểu tượng **</>** (Web) hoặc **Project settings** (bánh răng) -> **General** -> **Your apps** -> **Add app** -> **Web** -> App nickname -> **Register app** (không cần tick **Firebase Hosting**) -> copy khối `firebaseConfig` (`apiKey, authDomain, projectId, appId`) -> **Continue to console**. Xem lại sau: Project settings -> General -> Your apps -> **SDK setup and configuration** -> **Config**.

## 3. Firestore
**Build** -> **Firestore Database** (có thể nằm trong **All products**) -> **Create database** -> Edition **Standard** -> Database ID `(default)` -> Location **asia-southeast1 (Singapore)** (không đổi được sau này) -> **Next** -> **Start in production mode** -> **Create**.
Rules: tab **Rules** -> dán nội dung `firestore.rules` -> **Publish**.

## 4. Authentication - Google provider
**Build** -> **Authentication** -> **Get started** -> tab **Sign-in method** -> **Google** (Native providers/Additional providers) -> gạt **Enable** -> **Project support email**: chọn email của bạn -> **Save**. (**MANUAL** nếu Claude không điều khiển được trình duyệt.)

## 5. Authorized domains
**Authentication** -> tab **Settings** -> **Authorized domains** -> **Add domain** -> nhập `<user>.github.io` (chỉ tên miền, không có `https://` hay `/repo`) -> **Add**. `localhost` thường đã có sẵn; không có thì thêm. Tên miền mặc định `<projectId>.firebaseapp.com` và `.web.app` tự có.

## 6. Kiểm tra
- Project settings -> General: đúng **Project ID** như trong `js/config.js`.
- Firestore -> **Data**: sau khi đăng nhập thử và ghi, thấy `users/<uid>/...`.
- Authentication -> **Users**: thấy tài khoản vừa đăng nhập.
- Usage and billing: gói phải là **Spark**. Thấy nút **Upgrade** là bình thường; không bấm.
