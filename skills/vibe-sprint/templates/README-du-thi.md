# <Tên sản phẩm>: VIBE-CODING 2026 Chung kết (đội Xclipse)

> Điền các mục `<…>`. Ghi đúng công nghệ đã dùng và đúng phiên bản. Xoá dòng mẫu nào không áp dụng.
> Thể lệ chung kết: README là 1 trong 4 món nộp (cài đặt/chạy, công nghệ, dữ liệu mẫu/tài khoản). Không còn câu nhãn cố định: **ghi rõ phần nào là dữ liệu mẫu/mô phỏng**; đề có đưa câu nhãn thì chép nguyên văn.

> **<Câu nhãn dữ liệu mẫu/mô phỏng (nguyên văn nếu đề đưa; không thì câu rõ nghĩa của đội)>**: khi dùng chế độ mô phỏng (offline), nội dung/số liệu do công thức sinh ra, không phải kết quả thật.

## 1. Thông tin bài nộp

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | Xclipse |
| Thành viên | Diệu Anh · Vũ Trí Dũng · Nguyên (nhóm trưởng) |
| Trường | {{TRUONG}} |
| Cuộc thi | VIBE-CODING 2026 · Chung kết |
| Bảng thi | Bảng B – Kinh tế |
| Đề bài | Đề số <số>: <tên đề> |
| Demo trực tuyến | https://xclipsex.github.io/Xclipse-ChungKet/ |
| Mã nguồn (GitHub) | https://github.com/XclipseX/Xclipse-ChungKet |
| Video demo (≤ 2 phút) | <URL video> |
| Source ZIP | <tên gói hoặc URL> |
| Minh chứng dùng AI | `docs/MINH-CHUNG-AI.md` |
| Bảng kiểm thử | `docs/BANG-KIEM-THU.md` (mục 11) |
| Commit đã nộp (hash) | <git rev-parse --short HEAD, khớp bản đang chạy trên link> |
| Minh chứng thời điểm chốt | `docs/minh-chung-chot/` |
| Liên hệ | <email> |

### Phân vai

| Thành viên | Phụ trách |
|---|---|
| Diệu Anh | Bối cảnh, người dùng, UI/UX |
| Vũ Trí Dũng | Tính năng, nghiệp vụ, demo |
| Nguyên (nhóm trưởng) | Kỹ thuật, giả định và mô hình kinh doanh, tổng kết |

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
git clone https://github.com/XclipseX/Xclipse-ChungKet.git && cd Xclipse-ChungKet

# 2. Cài thư viện (nếu có)
<lệnh cài>

# 3. Cấu hình (nếu có): copy file mẫu rồi điền giá trị của riêng bạn
cp .env.example .env.local

# 4. Chạy
python3 -m http.server 8211   # rồi mở http://localhost:8211/ (thêm ?demo=1 để nạp dữ liệu mẫu)

# 5. Kiểm thử (cần Playwright)
node tests/smoke.cjs http://localhost:8211/
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

## 13. Giả định & cách tính (Bảng Kinh tế bắt buộc; Bảng Kỹ thuật ghi quy tắc nghiệp vụ)
- **Danh sách giả định:** bảng `Giả định · Giá trị · Đơn vị · Nguồn/lý do · Loại (BTC / đội đặt / mô phỏng)`. Ví dụ: `Phí sàn · 6 · % · biểu phí công khai của sàn <ngày> · đội đặt`.
- **Công thức chính:** <lợi nhuận = …; điểm hòa vốn = chi phí cố định / (giá − biến phí); biên sau ưu đãi = …>. Mẫu số 0 thì app hiện "Không đủ dữ liệu".
- **Kịch bản:** <lạc quan / cơ sở / bi quan: đổi những giả định nào, kết quả khác nhau ra sao>.
- **Độ nhạy và dự phòng:** <giả định nào nhạy nhất; dự phòng bao nhiêu % và vì sao>.
- **Cơ chế ưu đãi:** <điều kiện, trần, có lỗ không và ở mức nào>.

## 14. Dữ liệu (file BTC / mẫu / mô phỏng)
| Bộ dữ liệu | Nguồn | Dùng ở đâu | Nhãn trong app |
|---|---|---|---|
| File mẫu BTC phát đầu giờ (sheet: <tên>) | BTC | <màn nhập/nạp: tên nút> | "Dữ liệu BTC" |
| Dữ liệu mẫu của đội (nút "<Điền dữ liệu mẫu>") | Đội tự tạo trong giờ thi | <…> | "Dữ liệu mẫu" |
| Số liệu mô phỏng (AI/công thức) | Sinh bởi <…> | <…> | "<câu nhãn mô phỏng>" |
- Không có tài khoản đăng nhập / tài khoản demo: <…>.

## 15. Khung chuẩn bị trước (khai báo theo thể lệ)
- Trước giờ thi chỉ chuẩn bị **khung chung `vibe-sprint`**: token giao diện, hàm form/bảng/biểu đồ, `EP.ai` (một cửa AI + mô phỏng), `EP.scenario`, `EP.importer`, công cụ kiểm thử và quét key. Khung **không chứa logic, dữ liệu hay giao diện riêng cho đề**.
- **Toàn bộ tính năng, dữ liệu mẫu, giao diện và nội dung theo đề được xây trong 60 phút thi** (13:15–14:15, ngày <dd/mm/yyyy>). Lịch sử commit và `docs/MINH-CHUNG-AI.md` thể hiện quá trình.
- Thư viện/công cụ bên ngoài: xem mục 9.

## 16. Minh chứng thời điểm chốt
- Ảnh/video: `docs/minh-chung-chot/<tên tệp>` chụp lúc <hh:mm>, màn hình: <danh sách>, kích thước: desktop + 360px + 390px.
- Commit đang chạy tại thời điểm chốt: `<hash>`; phiên bản hiển thị trên app: `<x.y.z>`.

## 17. Công cụ AI
- **Claude** (Opus, Sonnet, Haiku): lập kế hoạch, viết mã, kiểm thử, chụp minh chứng. **Claude Design** và **Claude in Chrome**: thiết kế giao diện và kiểm tra trên trình duyệt.
- **Gemini Antigravity**: công cụ AI bổ trợ của đội.
- Mọi phần AI viết đều do đội kiểm tra lại; minh chứng ở `docs/MINH-CHUNG-AI.md`.
