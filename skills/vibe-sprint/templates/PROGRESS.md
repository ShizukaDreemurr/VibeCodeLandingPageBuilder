# Run-sheet 60 phút: <Tên sản phẩm>

> Claude cập nhật file này sau mỗi mốc và nhắc đội các mục "Việc cần làm" còn ô chưa tick.
> Giờ tính từ lúc bắt đầu sprint (T0 = <hh:mm>). Mốc nào trễ hơn 5 phút: ghi vào "Quyết định" và cắt phạm vi, không kéo dài mốc sau.

**Đội:** <Tên đội> · **T0:** <hh:mm> · **Hạn nộp:** <hh:mm>
**Cập nhật lần cuối:** <hh:mm>, <đã xong gì, đang làm gì>

## Mốc thời gian

| Thời gian | Việc | Đầu ra | ☐ |
|---|---|---|---|
| T+0→5 | Đọc đề + thể lệ phát tại chỗ, mở file dữ liệu mẫu BTC của bảng mình, viết `spec-nhanh.md` (5 tính năng + nghiệm thu) | Spec 1 trang | ☐ |
| **T+5** (cổng) | **Schema Contract** (mục 0 của spec) + danh sách **Giả định** có nguồn. Chưa có thì chưa spawn | Contract + Giả định dán vào mọi prompt | ☐ |
| T+5→8 | Chọn starter + UI tokens, kiểm UI 2 phút (bảng màu, font, 3 màn); điền biến `prompts/14` và `prompts/16` (T+8) | `PROGRESS.md` ghi 5 dòng kiểm UI | ☐ |
| T+8→10 | Spawn đợt 1 (shell, AI, data, feature F1…Fn, giả định & mô hình, docs, QA). **T+10 gửi đồng thời** prompt 14 → Claude Design, prompt 16 → Gemini Antigravity (ghi giờ gửi) | Các agent chạy; khung slide về lúc T+15–20 | ☐ |
| T+20→40 | Luyện nói trên khung slide (Diệu Anh, Dũng; Nguyên đóng kỹ thuật viên). T+25 merge đợt 1, chạy `node tests/smoke.cjs http://localhost:8211/`; T+35 gom chỉnh sửa slide một lần | App chạy được dù chưa đủ tính năng; khung slide v2 | ☐ |
| T+40→48 | Merge hết (data → AI → shell → feature → polish), test xanh, `showPlayground: false`, `node tools/bump-version.cjs`, `node scripts/scan-secrets.mjs .`, push, deploy Pages. **T+44 khóa giao diện** | Link online chạy, quét secret sạch | ☐ |
| T+45 | Gửi `prompts/15` (Claude Sonnet trong Chrome) + agent Sonnet dự phòng chụp ảnh slot 390/360 sáng-tối | ZIP ảnh theo bảng slot | ☐ |
| T+48→50 | Polish cuối + kiểm mobile **360 VÀ 390px** (5 tiêu chí), sáng/tối, trạng thái rỗng/lỗi. **Sau T+50 không thêm tính năng** | Ảnh sạch, `BANG-KIEM-THU.md` có kết quả thật | ☐ |
| **T+50→55** | **Minh chứng thời điểm chốt:** `node scripts/nop-bai.mjs --url <link>` (ảnh 360/390 sáng-tối + 1 desktop + hash commit, ZIP); gửi Phần 2 của prompt 14 cho Claude Design; điền `MINH-CHUNG-AI.md`, `README-du-thi.md`; quay video demo dọc 45 giây | `docs/minh-chung/<thời điểm>/`, deck có ảnh | ☐ |
| **T+55→60** | **Nộp 4 món:** link demo · mã nguồn · README · minh chứng chốt. Xuất PDF + PPTX gửi kỹ thuật viên BTC. Mở link ẩn danh kiểm lần cuối, đối chiếu `CHECKLIST-CHUNG-KET.md`. **Không đẩy thêm commit mã** | Đã nộp, có ảnh xác nhận | ☐ |

## Việc cần làm (đội)

- [ ] <Việc> (ví dụ: lấy key Gemini trước T0 nếu muốn chạy AI thật)  
      Cách làm: 1) <…> 2) <…>
- [ ] <Việc> 

## Quyết định trong sprint

Ghi vào `DECISIONS.md` khi đổi phạm vi. Ở đây chỉ ghi tóm tắt: `[hh:mm] Dxx: <việc đã cắt hoặc đổi>`.

- [hh:mm] <…>

## Phạm vi cắt nếu trễ

Thứ tự cắt, từ dưới lên. Không cắt luồng chính (T1 → T2 → kết quả hiện được):

1. <Tính năng phụ, ví dụ: xuất CSV>
2. <Hiệu ứng, ảnh đẹp>
3. <Quản trị, trang nâng cao>

## Ghi chú cần nhớ

- <Lệnh chạy, cổng, URL Pages>
- <Giới hạn: dữ liệu localStorage chỉ trên một máy>
- <Tài khoản, thiết bị, dây sạc đã kiểm tra (xem CHECKLIST-CHUNG-KET.md)>
