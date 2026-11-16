# Deck kit — slide pitch cho chung kết 60 phút

Một file `deck.html` (không phụ thuộc thư viện, 16:9, chạy offline). Bạn **chỉ sửa dữ liệu**, không sửa layout.

Phím: `←/→/Space` chuyển slide · `N` ghi chú + đồng hồ · `F` toàn màn hình · vuốt/bấm trên điện thoại · `Ctrl+P` in PDF. Link thẳng slide: `deck.html#6`.

## Quy trình 5 phút

1. **Sao chép mẫu**: `cp template.data.js deck.data.js` (xem bản hoàn chỉnh: `deck.html?data=example.data.js`).
2. **Điền các ô** đánh số `[1]`–`[11]` trong `deck.data.js`: tên app · tagline · đề/bảng/đội · persona+nỗi đau · tình huống · giải pháp một câu · 5 tính năng · link live + video · AI thật/mô phỏng/kiểm soát · bảng kiểm thử · 3–4 con số. QR tự sinh từ `meta.liveUrl`.
3. **Chụp ảnh** (app chạy local, ví dụ `python3 -m http.server 8225` (cổng deck trong bảng cổng của skill; không dùng 8000) ở thư mục gốc app):
   `cp tools/capture.example.json tools/capture.json`, sửa `base` (file mẫu ghi `http://localhost:8225/`, đổi thành cổng bạn đang dùng) và `views`, rồi `node tools/capture.cjs tools/capture.json`.
   File mẫu nhắm vào route của starter (`#/home`, `#/example`): đổi `example` thành id feature thật, đổi selector theo form của bạn. Bước (`steps`): `click`, `fill:[sel,text]`, `select:[sel,value]`, `press`, `wait`, `waitFor`, `hide`, `scroll`, `eval`, `optionalClick`, `storage`.
   Nhanh 1 ảnh: `node tools/capture.cjs --url http://localhost:8225/ --name home --mobile`. Ảnh ra `assets/` (1600x1000; mobile 390x844 đuôi `-m`).
4. **Xem thử**: mở `deck.html`; ảnh thiếu hiện khung nhắc.
5. **Xuất**: `node tools/export.cjs` (dùng `deck.data.js`) → `out/<tên>.pdf` (1 trang/slide), `out/png/slide-NN.png` (1920x1080, `--scale 2` cho 4K). Có `pptxgenjs` (`npm i pptxgenjs` trong `deck/`) thì ra thêm `.pptx` (mỗi slide là ảnh + ghi chú). Mang theo cả PDF dự phòng khi trình chiếu.

Yêu cầu: Node + Playwright (`npm i -g playwright && npx playwright install chromium`). `out/` đã được git-ignore. PDF ví dụ: `example/Xclipse-example.pdf`; ảnh của ví dụ nằm ở `example/assets/` (thư mục `deck/assets/` dành cho ảnh của đội bạn, ban đầu trống; `new-project.sh` không chép `example/`).

## Loại slide (`type`) và trường chính

| type | Trường |
|---|---|
| cover | app, tagline, de, bang, event, team, members[], date, image |
| problem | title, persona{name,role,photo}, pains[], scenarioLabel, scenario, stat{value,label} |
| solution | oneLiner, bullets[{icon,text}], image |
| features | title, items[{icon,title,desc}] (5) |
| demo | title, url, image, iframe:true, live:'auto', caption, qrLabel |
| flow | title, steps[{icon,title,desc}] (3–5), note |
| ai | real[], mock[], controls[], pipeline{steps[{label,sub,kind}], fallbackAt, fallback{label,sub}} |
| quality | rows[{id,kind,case,result,status:pass/warn/fail,label}], summary{value,label}, legend[] |
| metrics | items[{value,prefix,suffix,decimals,label,sub}] (đếm lên), note |
| roadmap | items[{when,title,desc,tag}] (≤4) |
| team | members[{name,role,did,photo}], stack[] |
| thanks | title, subtitle, cta, url, videoUrl, qrLabel |

Mọi slide: `eyebrow`, `title`, `notes` (bấm N), `time`, và `speaker` (người nói, chỉ hiện trong ghi chú, không lên slide). Khuôn `notes` cho pitch 3 người: dòng `Người nói`, dòng `Mốc giờ`, ba dòng neo `V` (vấn đề) / `T` (thao tác, điểm nhấn) / `S` (con số), dòng `Chuyền mic`; xem `template.data.js` và `templates/KICH-BAN-DEMO.md`. Chữ: `**đậm**`, `{{nhấn gradient}}`. Đổi màu theo đề: `meta.accent` / `meta.accent2`. Dữ liệu cũng có thể dán JSON vào thẻ `<script id="deck-data">` trong `deck.html`. Thứ tự nạp: JSON inline > `?data=` > `deck.data.js` > `example.data.js`.

Demo trực tiếp: `iframe:true` thêm nút "Chạy trực tiếp"; nếu app chặn iframe hoặc mất mạng, ảnh `image` vẫn hiện. Trung thực: không ghi "thật" cho tình huống dựng sẵn, nêu rõ AI mô phỏng.

## Kịch bản thuyết trình 10 phút (11 slide, 3 người nói)

| Slide | Người nói | Nội dung | Mốc giờ |
|---|---|---|---|
| 1 cover | Diệu Anh | Chào, tên app, 1 câu hứa | 00:00–00:35 |
| 2 problem | Diệu Anh | Persona + nỗi đau + 1 con số | 00:35–01:30 |
| 3 solution | Diệu Anh | Giải pháp một câu, UI/UX sơ bộ | 01:30–02:30 |
| 4 features | Dũng | 5 tính năng, 1 quy tắc nghiệp vụ | 02:30–03:15 |
| 5 flow | Dũng | Luồng 3–5 bước | 03:15–03:55 |
| 6 demo | Dũng | Demo ca thường (mỗi thao tác ≤ 25s) | 03:55–05:10 |
| 7 demo | Dũng | Ca sai, ca biên, mobile | 05:10–06:15 |
| 8 ai | Nguyên | Kiến trúc, AI/proxy, nhãn mô phỏng | 06:15–07:15 |
| 9 quality | Nguyên | Kiểm thử, bảo mật | 07:15–08:15 |
| 10 metrics | Nguyên | Con số kiểm chứng, giới hạn | 08:15–09:00 |
| 11 thanks | Nguyên | Tổng kết, QR, mời hỏi đáp | 09:00–09:45 |

Đệm 15 giây cuối. Nguyên rút gọn: bản 2:00 bỏ slide 10, bản 1:00 chỉ slide 9 rồi 11. Bấm `N` để xem người nói, mốc giờ, 3 neo và đồng hồ. Cần slide Roadmap/Team thì thêm loại `roadmap`/`team` vào cuối (ngoài 10 phút) hoặc dùng ở bản dài. Tập nói 2 lần với đồng hồ. Thẻ in tay: `templates/CUE-CARDS.md`.

## Cấu trúc

`deck.html` · `template.data.js` · `example.data.js` (Xclipse, Đề 8 Bảng B) · `assets/` (ảnh của bạn) · `tools/capture.cjs`, `tools/capture.example.json`, `tools/export.cjs` · `example/` (PDF + ảnh của bản ví dụ Xclipse).
