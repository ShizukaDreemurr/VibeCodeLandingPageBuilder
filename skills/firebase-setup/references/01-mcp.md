# 01 - Đường A: Firebase MCP server

## Nhận biết
ToolSearch query `firebase` -> các tool (tên thật trong phiên này có tiền tố `mcp__plugin_firebase_firebase__`):

| Tool | Dùng để |
|------|---------|
| `firebase_get_environment` | Xem user đang đăng nhập, project hiện tại, thư mục làm việc |
| `firebase_update_environment` | Đặt project active / thư mục dự án |
| `firebase_login` / `firebase_logout` | Đăng nhập (người dùng tự làm theo URL/mã tool trả về) |
| `firebase_list_projects`, `firebase_get_project` | Liệt kê / xem project |
| `firebase_create_project` | Tạo project mới |
| `firebase_list_apps`, `firebase_create_app` | Liệt kê / tạo app (platform `web`) |
| `firebase_get_sdk_config` | Lấy `apiKey, authDomain, projectId, appId...` |
| `firebase_get_security_rules` | Đọc rules đang chạy (Firestore) |
| `firebase_init` | Khởi tạo `firebase.json`, Firestore rules/indexes trong thư mục dự án |
| `firebase_deploy`, `firebase_deploy_status` | Deploy (vd chỉ `firestore:rules`) và theo dõi |
| `firebase_read_resources` | Đọc tài nguyên/hướng dẫn đi kèm server |
| `developerknowledge_search_documents`, `_get_documents`, `_answer_query` | Tra tài liệu chính thức khi không chắc |

Tên tham số có thể khác theo phiên bản: đọc schema do ToolSearch (`select:<tên>`) trả về trước khi gọi, đừng đoán.

## Trình tự
1. `firebase_get_environment` - đã đăng nhập chưa? Nếu chưa -> **MANUAL**: gọi `firebase_login`, đưa URL/mã cho người dùng, chờ họ xác nhận xong, gọi lại `firebase_get_environment`.
2. `firebase_list_projects` - tránh tạo trùng. Chưa có -> `firebase_create_project` (ID `ten-nhom-2026`, chữ thường/số/gạch ngang, 6-30 ký tự). Người dùng có thể phải chấp nhận Terms (**MANUAL**). Không chọn billing account.
3. `firebase_update_environment` đặt project active + thư mục app (thư mục chứa `index.html`).
4. `firebase_create_app` platform web, tên hiển thị = tên app. Rồi `firebase_get_sdk_config` -> dán 4 trường vào `js/config.js`:
   ```js
   firebase: { enabled: true, config: { apiKey: '...', authDomain: '<id>.firebaseapp.com', projectId: '<id>', appId: '...' }, emulator: false }
   ```
5. `firebase_init` chọn Firestore (rules + indexes) trong thư mục dự án; ghi đè `firestore.rules` bằng mẫu owner-only (`04-rules-va-test.md`) nếu starter chưa có.
6. Firestore database: nếu `firebase_init`/deploy báo chưa có database -> tạo database (Production mode, `asia-southeast1`) qua console (`03`, mục 3) hoặc CLI (`02`).
7. `firebase_deploy` chỉ `firestore:rules` (không deploy hosting/functions). Dùng `firebase_deploy_status` đến khi xong, rồi `firebase_get_security_rules` đối chiếu.
8. **Bật Google provider + Authorized domains: MCP thường không có tool** -> chuyển sang `03` (trình duyệt) hoặc nhờ người dùng tự bấm. Đừng giả vờ đã bật.
9. Chạy `scripts/check-firebase-config.mjs`.

## Lưu ý
- Không gọi `firebase_logout` trừ khi người dùng yêu cầu.
- Không gọi tool tạo/ deploy khi chưa chắc project đúng (kiểm `firebase_get_environment`): dễ nhầm sang project cũ của tài khoản.
- Lỗi quyền/Terms từ tool -> đưa nguyên văn lỗi cho người dùng, đừng thử lách.
