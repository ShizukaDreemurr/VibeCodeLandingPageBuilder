# Deck kit — slide pitch cho chung kết 60 phút

Một file `deck.html` (không phụ thuộc thư viện, 16:9, chạy offline). Bạn **chỉ sửa dữ liệu**, không sửa layout.

Phím: `←/→/Space` chuyển slide · `N` ghi chú + đồng hồ · `F` toàn màn hình · vuốt/bấm trên điện thoại · `Ctrl+P` in PDF. Link thẳng slide: `deck.html#6`.

## Quy trình 5 phút

1. **Sao chép mẫu**: `cp template.data.js deck.data.js` (xem bản hoàn chỉnh: `deck.html?data=example.data.js`).
2. **Điền 12 ô** đánh số `[1]`–`[12]` trong `deck.data.js`: tên app · tagline · đề/bảng/đội · persona+nỗi đau · tình huống · giải pháp một câu · 5 tính năng · link live + video · AI thật/mô phỏng/kiểm soát · bảng kiểm thử · 3–4 con số · thành viên. QR tự sinh từ `meta.liveUrl`.
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

Mọi slide: `eyebrow`, `title`, `notes` (bấm N), `time`. Chữ: `**đậm**`, `{{nhấn gradient}}`. Đổi màu theo đề: `meta.accent` / `meta.accent2`. Dữ liệu cũng có thể dán JSON vào thẻ `<script id="deck-data">` trong `deck.html`. Thứ tự nạp: JSON inline > `?data=` > `deck.data.js` > `example.data.js`.

Demo trực tiếp: `iframe:true` thêm nút "Chạy trực tiếp"; nếu app chặn iframe hoặc mất mạng, ảnh `image` vẫn hiện. Trung thực: không ghi "thật" cho tình huống dựng sẵn, nêu rõ AI mô phỏng.

## Kịch bản thuyết trình 5–7 phút (12 slide, ~6:50)

| Slide | Nội dung | Thời gian |
|---|---|---|
| 1 cover | Chào, tên đội, đề, bảng, hứa gì trong 6 phút | 0:15 |
| 2 problem | Persona + nỗi đau + 1 tình huống cụ thể | 0:40 |
| 3 solution | Giải pháp một câu, chỉ vào ảnh | 0:30 |
| 4 features | 5 tính năng, nhấn 1–2 quy tắc nghiệp vụ | 0:40 |
| 5 flow | 3–5 bước dùng | 0:30 |
| 6 demo | Demo live (ca thường, ca sai, ca biên); mất mạng thì video/ảnh | 1:30 |
| 7 ai | Thật vs mô phỏng, prompt→kiểm tra→dự phòng | 0:50 |
| 8 quality | Bảng ca kiểm thử, nói thẳng lỗi còn lại | 0:40 |
| 9 metrics | 3–4 con số kiểm chứng được | 0:25 |
| 10 roadmap | Bước tiếp theo | 0:20 |
| 11 team | Vai trò | 0:15 |
| 12 thanks | QR + link, mời "Hỏi đáp" | 0:15 |

Nếu chỉ có 5 phút: bỏ slide 5 và 11, rút demo còn 1:00. Tập nói 2 lần với đồng hồ (phím N).

## Cấu trúc

`deck.html` · `template.data.js` · `example.data.js` (Xclipse, Đề 8 Bảng B) · `assets/` (ảnh của bạn) · `tools/capture.cjs`, `tools/capture.example.json`, `tools/export.cjs` · `example/` (PDF + ảnh của bản ví dụ Xclipse).
