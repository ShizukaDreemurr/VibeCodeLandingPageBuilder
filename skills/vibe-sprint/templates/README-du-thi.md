# <Tên sản phẩm>: <Tên cuộc thi>

> Điền các mục `<…>`. Ghi đúng công nghệ đã dùng và đúng phiên bản. Xoá dòng mẫu nào không áp dụng.
> Nếu có chế độ AI mô phỏng, giữ nguyên câu cảnh báo dưới đây (đúng nguyên văn thể lệ nếu có).

> **<Câu cảnh báo mô phỏng AI, đúng nguyên văn thể lệ>**: khi dùng chế độ AI mô phỏng (offline), nội dung do công thức sinh ra, không phải kết quả từ mô hình AI thật.

## 1. Thông tin bài nộp

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | <Tên đội> |
| Bảng thi | <Bảng …> |
| Đề bài | Đề số <số>: <tên đề> |
| Demo trực tuyến | <URL GitHub Pages> |
| Video demo (≤ 2 phút) | <URL video> |
| Source ZIP | <tên gói hoặc URL> |
| Minh chứng dùng AI | `docs/MINH-CHUNG-AI.md` |
| Bảng kiểm thử | `docs/BANG-KIEM-THU.md` (mục 11) |
| Liên hệ | <email> |

## 2. Tính năng chính

Đúng năm tính năng theo đề, theo thứ tự đề bài:

1. **<Nhập dữ liệu đầu vào>**: <trường nào, kiểm tra lỗi ra sao>
2. **<AI phân tích, tạo hoặc gợi ý>**: <AI làm gì, chế độ nào>
3. **<Lưu, xem, sửa, xoá lịch sử>**: <lưu ở đâu>
4. **<Tính năng nghiệp vụ theo đề>**: <quy tắc chính>
5. **<Tính năng theo đề hoặc quản trị>**: <…>

## 3. Công nghệ sử dụng

| Lớp | Công nghệ (kèm phiên bản) |
|---|---|
| Giao diện | <HTML/CSS/JS thuần, hoặc React x.y, Next.js x.y, Tailwind x.y> |
| Thư viện | <…> |
| Lưu trữ | <localStorage / Cloud Firestore / Supabase (Postgres, RLS) / Google Sheet> |
| Đăng nhập | <không / Firebase Authentication bằng Google> |
| Triển khai | <GitHub Pages / Vercel / cPanel> |
| Kiểm thử | <Playwright (Chromium), Vitest…> |

## 4. Tích hợp AI

- **Chế độ đang dùng:** <AI thật: tên model | copy prompt | mô phỏng>. Thiếu key thì app hiện nhãn "<câu nhãn>".
- **AI làm gì:** <…>. Ngày, giờ, địa điểm, giá và tên người luôn lấy từ form, không để AI tự viết.
- **Kiểm soát đầu ra:** <tách JSON khỏi lời dẫn, kiểm tra đủ trường, thiếu thì bù bằng bản mô phỏng và báo rõ>.
- **Bảo mật khoá:** <key do người dùng nhập và chỉ lưu trong trình duyệt của họ | khoá nằm trong biến môi trường máy chủ>. Trong mã nguồn không có key nào. `.env.example` chỉ có tên biến.

## 5. Cài đặt và chạy local

```bash
# 1. Lấy mã nguồn
git clone <URL repo> && cd <thư mục>

# 2. Cài thư viện (nếu có)
<lệnh cài>

# 3. Cấu hình (nếu có): copy file mẫu rồi điền giá trị của riêng bạn
cp .env.example .env.local

# 4. Chạy
<lệnh chạy, ví dụ: python3 -m http.server 8000>   # rồi mở http://localhost:8000

# 5. Kiểm thử
<lệnh test>
```

Cách nhanh nhất để thử: mở trực tiếp `index.html` trên trình duyệt (nếu app không cần server).

## 6. Cấu trúc thư mục

```text
<Tên thư mục>/
├── index.html        # <khung ứng dụng>
├── css/              # <…>
├── js/               # <…>
├── tests/            # <kiểm thử tự động>
└── docs/             # <tài liệu nộp bài>
```

## 7. Truy cập và phân quyền
- <Người tạo trang có cần đăng nhập không>
- <Vai trò, trang quản trị nếu có>

## 8. Giới hạn hiện tại
- <Phần nào là mô phỏng>
- <Dữ liệu lưu ở đâu, mất khi nào (ví dụ: xoá dữ liệu trình duyệt thì mất)>
- <Phần chưa làm hoặc chưa kiểm chứng (ví dụ: chưa gọi AI thật vì không có key)>

## 9. Nguồn tham khảo và khai báo sử dụng
- <Thư viện, font, icon, mẫu giao diện: ghi tên, giấy phép>
- <Công cụ AI đã dùng để xây dựng: Claude (model), Gemini (ảnh mockup)…>
- <Ảnh demo: nguồn và cách tạo>

## 10. Minh chứng dùng AI
- Tệp: `docs/MINH-CHUNG-AI.md`, ảnh trong `docs/minh-chung-ai/`.
- Tóm tắt một vòng thử và cải thiện: <vấn đề → yêu cầu sửa → kết quả kiểm tra lại>.

## 11. Bảng kiểm thử
Chép bảng từ `docs/BANG-KIEM-THU.md` (ít nhất các ca bắt buộc của bảng đăng ký).

## 12. Hồ sơ bàn giao
- Source ZIP gồm mã nguồn, README, minh chứng AI, bảng kiểm thử. Không kèm `.git`, không kèm `.env.local`.
- Tài khoản hoặc dữ liệu demo: <có / không; nếu có, ghi cách lấy>.
- Dữ liệu mẫu: bấm **"<Điền dữ liệu mẫu>"** trong app.
