# 01 — Đọc đề thành spec trong 5 phút

> Đọc `references/00-the-le-chung-ket.md` trước (thể lệ, 4 món nộp, cấm chuẩn bị sẵn). T+0 mở luôn **file dữ liệu mẫu BTC của bảng mình**; sheet/cột của nó vào Schema Contract. Kinh tế: thêm mục **Giả định** (nguồn từng con số) vào spec.

Mục tiêu: sau 5 phút có `docs/spec-nhanh.md` 1 trang (mẫu: `templates/spec-nhanh.md`, `scripts/new-project.sh` đã chép vào `docs/`; mẫu rút gọn bên dưới dùng cho ghi nhanh) để mọi agent đọc. Spec là chuẩn; không có trong spec thì không làm.

## Quy trình (đồng hồ)

- **0:00–1:30** Đọc đề 2 lần. Gạch: *đề yêu cầu bắt buộc* (thường 5 tính năng), *từ khoá nghiệp vụ* (ngày, trùng, hết hạn, điểm...), *đầu ra phải thấy*. Song song spawn 1 agent Haiku research: 3 app tương tự + dữ liệu mẫu thực tế cho ngành của đề.
- **1:30–3:30** Điền khung bên dưới cho từng tính năng.
- **3:30–5:00** Chốt bảng nghiệm thu, phạm vi "không làm", chốt preset giao diện (`xclipse` mặc định hoặc `lucian`), chia agent theo bảng cổng ở `prompts/00-README.md`. Đội đọc lướt rồi đi.

## Khung BTC: Input → Quy tắc → Output → Lưu trữ

Mỗi tính năng điền đúng 4 dòng:

```
F1 <tên tính năng>
- Input: các ô/nguồn dữ liệu (kiểu, bắt buộc?)
- Quy tắc (nếu/thì): validation, trùng, hết hạn, biên, trạng thái đặc biệt
- Output: người dùng thấy gì (màn hình, số, file)
- Lưu trữ: localStorage (ghi rõ giới hạn 1 máy) / file xuất / Firebase (chỉ khi đề cần)
```

Quy tắc mặc định hay bị chấm (lấy từ buổi đào tạo): tên trống → cảnh báo; email/SĐT sai định dạng → nhắc nhập đúng (+84 chuẩn hoá); bấm 2 lần/trùng → chỉ ghi 1 lần; thời gian đã qua → trạng thái "đã diễn ra/hết hạn", không đếm số âm; danh sách rỗng → trạng thái rỗng có hướng dẫn; localStorage chỉ trên 1 máy → ghi rõ trong app/README.

## 5 tính năng → tiêu chí nghiệm thu

| # | Tính năng | Nghiệm thu (phải kiểm được bằng tay/test trong 30 giây) |
|---|---|---|
| F1 | ... | Ca thường: ... → thấy ...<br>Ca sai: ... → báo lỗi dưới ô<br>Ca biên: ... |
| F2 | ... | ... |
| F3 | ... | ... |
| F4 | ... | ... |
| F5 | ... | ... |

Bảng B cần ≥3 ca kiểm thử (thường, thiếu/sai, biên); Bảng A ≥6 (2 thường, 2 sai, 2 biên). Tạo ngay từ bảng này; tránh nghĩ lại về sau.

## AI trong đề (nếu có)

- AI làm đúng việc đề nói (sinh chữ, phân loại, gợi ý...). Dữ kiện chính xác (ngày, giá, tên) **luôn từ form**, AI chỉ viết chữ.
- Luôn có 3 lớp, starter đã làm sẵn trong `EP.ai.generate({ prompt, schema, mock }, { input })`: (1) một cửa duy nhất, (2) kiểm tra đầu ra theo `schema` (rút JSON chịu lỗi, thử lại 1 lần, lỗi thì rơi về mock kèm cảnh báo), (3) mock có nhãn (`EP.ai.noticeHtml`). Không key → mock. Ba chế độ: mock / gemini (key người dùng nhập) / paste (copy-dán Claude, ChatGPT, Gemini).
- Ghi vào spec: AI nhận gì → trả gì → kiểm tra gì → lỗi thì sao.

## Mẫu rút gọn của `docs/spec-nhanh.md`

```
# <Tên app> — <Đề số / tên đề> (Bảng A/B)
Người dùng chính: <1 câu>  |  Vấn đề: <1 câu>  |  Giá trị: <1 câu>
## 5 tính năng (khung Input→Quy tắc→Output→Lưu trữ)
## Nghiệm thu (bảng trên)
## AI: làm gì / mock thế nào / nhãn dữ liệu mẫu-mô phỏng: "<câu đề đưa (chép nguyên văn) hoặc câu rõ nghĩa của đội>"
## Dữ liệu demo: <3–6 bản ghi thật, tiếng Việt>
## Không làm (ngoài phạm vi)
## Giả định đã chọn (đề không nói)
## Chia việc: agent → file được sửa
```

## Bẫy khi đọc đề

- **Nhãn dữ liệu mẫu/mô phỏng: ghi rõ ràng.** Thể lệ chung kết không còn câu cố định. Đề/BTC có đưa câu nào thì **chép nguyên văn**; không thì dùng câu rõ nghĩa của đội (ví dụ `Dữ liệu mẫu/mô phỏng, không phải số liệu thật`) và ghi vào `docs/DECISIONS.md`. Đặt vào `mockNotice` trong `js/config.js` (`tests/smoke.cjs` tự đọc từ đó, không cần sửa test). Câu vòng loại `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là ghi chú lịch sử, không dùng lại.
- **Không viết sẵn tính năng cho đề** (thể lệ cấm); chỉ dùng khung chung và khai báo trong README.

- **Nơi lưu dữ liệu do đề quy định là bản chính** (vd localStorage). Firebase/Sheet chỉ làm tuỳ chọn và mô tả đúng là tuỳ chọn; mô tả ngược sẽ bị nhận xét "chưa đúng tính năng".
- **Bảng thi (A/B) và hạn nộp**: xác nhận ngay T+0 từ thông báo/BTC (bảng A: ≥6 ca, mock AI chỉ tối đa 4/15; bảng B: ≥3 ca, mock minh bạch vẫn đạt; chung kết dùng thang riêng ở `references/00`). Số liệu lệch giữa các nguồn (23:59 so với 00:30) thì làm theo mốc sớm nhất, ghi vào `docs/DECISIONS.md`.
- Thêm tính năng ngoài đề → mất thời gian, không có điểm. Phạm vi hẹp, lõi chạy trọn.
- Đề trùng lĩnh vực với đề khác → giữ đúng ranh giới đề của mình (ví dụ chỉ làm checklist, không làm công cụ chấm điểm).
- Đề mơ hồ: chọn mặc định đơn giản nhất, ghi "Giả định" trong spec, nói ra khi thuyết trình. Hỏi BTC nếu có thể hỏi, đừng chờ.
- Mục "demo thật": chuẩn bị sẵn dữ liệu để vừa mở app đã thấy nội dung đầy đủ, sạch.
