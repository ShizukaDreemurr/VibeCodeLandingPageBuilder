# Kiểm thử tự động (Playwright)

| File | Kiểm tra | Cách chạy |
|---|---|---|
| `e2e-local.cjs` | Lõi 5 tính năng, quy tắc nghiệp vụ, AI copy-prompt, mobile (chế độ localStorage) | `node tests/e2e-local.cjs <thư-mục-ảnh>` |
| `e2e-sheet.cjs` + `mock-sheet-server.cjs` | Đồng bộ Google Sheet: 2 thiết bị, trùng, mất mạng rồi gửi lại (máy chủ giả lập) | chạy `node tests/mock-sheet-server.cjs` rồi `node tests/e2e-sheet.cjs` |
| `e2e-templates.cjs` | Thư viện mẫu (lọc, đổi mẫu giữ nội dung), mẫu thiệp cưới, ô ảnh (bìa, diễn giả, album), ghi nguồn studio | `node tests/e2e-templates.cjs <thư-mục-có-photo.jpg>` |
| `e2e-picker.cjs` | Bộ chọn mẫu: lọc đúng (khớp đủ / gần đúng), số lượng tuỳ chọn, tìm không dấu, sắp xếp, xoá bộ lọc, trạng thái rỗng, nhớ bộ lọc, áp mẫu, không tràn ngang ở 390px | `node tests/e2e-picker.cjs` |
| `e2e-builder.cjs` | Bố cục (đổi thứ tự, ẩn/hiện, phần bắt buộc), sửa chữ trực tiếp, xem thử trạng thái (sắp hết chỗ, hết chỗ, hết ưu đãi, đã diễn ra) | `node tests/e2e-builder.cjs` |
| `e2e-style.cjs` | Chế độ Đơn giản/Studio, ô màu nhận hex/rgb/rgba/hsl/tên màu, thanh trượt (kẹp giới hạn), ô tìm font (danh sách, lọc, font Google tuỳ ý, báo font không tồn tại), màu riêng từng phần, hoàn tác, lưu sau khi tải lại | `node tests/e2e-style.cjs`
| `e2e-inspector.cjs` | Bấm phần tử trong bản xem trước để chỉnh: sửa chữ tại chỗ, cỡ/đậm/nghiêng/căn lề/màu, nút, ẩn (trừ phần bắt buộc), chọn cả phần qua đường dẫn, Studio có ô mã màu | `e2e-image-editor.cjs` | Trình chỉnh ảnh: tải ảnh diễn giả tự mở trình chỉnh (khung 1:1), xoay/thu phóng bằng thanh trượt ↔ ô số (kẹp giới hạn), nút ±90°, khung cắt (ô số, mũi tên, kéo, tay nắm), Huỷ/Esc/Enter, thanh công cụ nổi có Chỉnh/Đổi/Xoá ảnh và ẩn điều khiển chữ, ảnh bìa có sẵn của mẫu lưu thành ảnh mới, hoàn tác, không tràn ngang ở 390px | `node tests/e2e-image-editor.cjs <thư-mục-có-photo.jpg> [thư-mục-lưu-ảnh-chụp]`
| `e2e-admin.cjs` | Tab Danh sách đăng ký: màn chọn landing page (đếm đăng ký, trạng thái, nhóm Đã kết thúc, tìm kiếm khi >6 trang, trạng thái rỗng), chi tiết + CSV chỉ của trang đã chọn, nhớ lựa chọn sau khi tải lại, menu CSV mở đúng trang, trình soạn thảo không bị đổi, không tràn ngang 390px | `node tests/e2e-admin.cjs [thư-mục-lưu-ảnh-chụp]` (cần `python3 -m http.server 8000`) |
| `e2e-features.cjs` độ đậm, về mặc định, hoàn tác, lưu | `node tests/e2e-inspector.cjs`
| `e2e-workspace.cjs` | Trang Thiết kế dạng phần mềm: thả nổi panel, gộp tab, kéo vạch chia cột, thu phóng (25–150%, vừa khung, Ctrl+/−/0), menu Cửa sổ (ẩn/hiện, bố cục có sẵn, khôi phục), lưu bố cục | `node tests/e2e-workspace.cjs`
| `e2e-brand.cjs` | Brand DNA: tạo thương hiệu (tên, khẩu hiệu, logo, màu, font, nút, giọng văn, liên hệ có kiểm tra), xem trước, chọn ở bước 1 tự áp dụng, áp dụng/gỡ trong Thiết kế, AI prompt có khối thương hiệu, xoá thương hiệu trang vẫn giữ | `node tests/e2e-brand.cjs <thư-mục-có-photo.jpg>`
| `e2e-images.cjs` | Tự nén ảnh: ảnh 16MB về dưới trần từng loại ô (bìa/album/diễn giả), logo WebP giữ nền trong suốt, vượt giới hạn trang thì tự nén lại ảnh nặng nhất | `node tests/e2e-images.cjs <thư-mục-có-big.png-và-logo.png>`
| `e2e-features.cjs` | Sự kiện của tôi (mở, nhân bản, xoá), chăm sóc lead (trạng thái, gọi/Zalo), số liệu, checklist trước xuất bản | `node tests/e2e-features.cjs` |
| `e2e-gjs.cjs` | 10 tính năng học từ GrapesJS: thư viện khối (FAQ, cảm nhận, tài trợ, video, bản đồ, kêu gọi), định dạng đoạn chữ + link (có lọc mã độc), chỉnh riêng theo thiết bị, màu khi rê chuột, panel Cấu trúc, phím tắt + sao chép định dạng, xem trước toàn màn hình, xuất file HTML, cách ly CSS, biến dữ liệu `{con_cho}`… | `node tests/e2e-gjs.cjs` |
| `e2e-firebase.cjs` | Firebase: xuất bản, link/QR, khách đăng ký, số đếm tức thì, trùng SĐT/email, hết chỗ, đăng ký đồng thời, người lạ không đọc được danh sách | `python3 -m http.server 8000` rồi trong thư mục có `firebase.json`: `npx firebase emulators:exec --only firestore,auth "node tests/e2e-firebase.cjs"` |
| `../firebase/rules.test.mjs` | 21 ca quy tắc bảo mật Firestore | xem `firebase/README.md` |

Ghi chú: các test Firebase chạy trên **Firebase Emulator** (`?emulator=1`), không đụng dữ liệu thật.

`auto-tab.cjs`: ứng dụng chia tab (Thông tin / Thiết kế trang / Quản lý); helper này tự mở đúng tab trước khi test click/điền vào một phần tử.
