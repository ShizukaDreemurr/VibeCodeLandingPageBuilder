# BÁO CÁO TÌNH HÌNH: CLAUDE (OPUS) → GEMINI ANTIGRAVITY, sáng 17/11 (trước giờ thi 13:15)

File này **thay thế** mọi bản đồng bộ trước (`PROMPT-DONG-BO-GEMINI.md`, `-2.md`). Nếu có chỗ khác nhau thì theo file này.

---

## 1. Mốc chốt (kéo về và nạp lại ngay)

| Thứ | Vị trí | Mốc |
|---|---|---|
| Repo skill | `XclipseX/VibeCodeLandingPageBuilder`, nhánh `claude/serene-ramanujan-7wxqwr` | commit **`19cf161`** |
| App mẫu trong skill | `skills/vibe-sprint/starter/` | v0.1.3 |
| **Repo app thi** | `XclipseX/Xclipse-ChungKet`, nhánh **`nop-bai`** | commit **`1eaa9c3`**, **v0.1.8** |
| Link thi | https://xclipsex.github.io/Xclipse-ChungKet/ (thêm `?demo=1` để có dữ liệu mẫu) | Pages đã bật từ `nop-bai` |
| Gói skill nạp vào Antigravity | `xclipse-skills-final.zip` ở gốc repo skill, khoảng 6,2 MB (gồm vibe-sprint, gh-pages-deploy, firebase-setup) | bản sau motion polish |

Không gắn được tag git (máy chủ GitHub từ chối), nên **2 commit trên là mốc an toàn để quay lại** nếu có gì hỏng.

## 2. Thay đổi từ lần đồng bộ trước (`933c62e` / v0.1.5 → nay)

### 2.1 Skill: rà chéo toàn bộ (commit `f3160b8`)
- Sửa khoảng 43 nhóm lỗi trong 53 file. Chi tiết ở `skills/vibe-sprint/references/AUDIT-2026-11-17.md`.
- **Một bảng cổng duy nhất:** 8211–8231 cho Claude, **8240–8249 cho Gemini**, cấm 8000.
- **Mốc T+ khớp nhau** giữa SKILL.md, references/01, references/14, `THE-DIEU-PHOI`, `PROGRESS`, `KICH-BAN-DEMO`. T+8 điền biến vào prompt 14 và 16, T+10 gửi đi.
- **Thư mục minh chứng thống nhất** là `docs/minh-chung/`, do `scripts/nop-bai.mjs` ghi ra. Sau khi chụp minh chứng chỉ được thêm đúng 1 commit chứa ảnh.
- **Nhãn dữ liệu chuẩn:** **Dữ liệu mẫu (BTC) · Giả định · Mô phỏng**. Câu mock của vòng loại chỉ còn là ghi chú lịch sử. `mockNotice` mặc định là `Dữ liệu mô phỏng AI · Dữ liệu mẫu`.
- **Slide:** thứ tự 11/7/5 slide và tên ô ảnh khớp nhau giữa prompt 12, 14, 15, references/05, `KICH-BAN-DEMO`, `CUE-CARDS` và `deck/template.data.js`.
- **Chuẩn điện thoại có mặt trong mọi prompt:** vùng bấm 48px cách nhau 8px, kiểm ở cả 360 và 390, thanh tab dưới đáy.
- **Model mặc định** gemini-4-hydrogen. Đã sửa ví dụ schema sai trong sổ tay code mẫu.

### 2.2 File mới: `skills/vibe-sprint/KHOI-DONG.md`
Thẻ khởi động 12:40–13:15, gồm checklist chuẩn bị máy, **câu lệnh mở đầu dán cho Claude Code** và cách xử lý sự cố ngay lúc mở đầu. Đầu SKILL.md có đường dẫn tới file này.

### 2.3 App: chỉnh cân đối giao diện (v0.1.6, commit `611eda6`)
Đã xử lý hết 12 lỗi Gemini báo và 10 lỗi Nguyên chụp:
- **Thanh chọn:** rộng hết khung. Từ 3 lựa chọn trở xuống thì chia đều, từ 4 trở lên thì cuộn ngang có mép mờ. Không còn cuộn ngang cả trang ở 360px, kể cả bộ lọc tab Mục.
- **Nhóm nút:** nút chính rộng hết hàng, nút phụ xếp lưới 2 cột, nút chỉ có icon vuông 48px. Nút "Gửi thử" không còn tràn chữ.
- **Thẻ KPI:** số và đơn vị luôn trên một dòng, cỡ chữ tự co và đồng đều trong cùng lưới. Thẻ lẻ trải hết hàng. Chữ "Không đủ dữ liệu" nhỏ và mờ.
- **Ô nhập số:** có dấu chấm ngăn cách kiểu vi-VN, đơn vị nằm trong ô. Nhãn đặt trên ô và được xuống dòng.
- **Bảng kịch bản:** mỗi chỉ tiêu một hàng hai tầng, 3 cột Xấu/Cơ sở/Tốt bằng nhau, số âm màu coral.
- **Số liệu mẫu "Shop online" hợp lý hơn:**
  - Cơ sở lãi 14,75 tr (ROAS 4, biên 9,8%, hòa vốn khoảng 472 đơn);
  - Xấu −3,6 tr;
  - Tốt 35,8 tr.
- **Thanh trên cùng:** cao 48px, cân hai bên.
- **Khoảng cách:** thẻ đệm trong 20px, các phần cách nhau 16px. "Bắt đầu nhanh" thành lưới 2×2. Thanh nút dính đáy nền đặc.
- **Nút AI:** gradient navy–coral, chữ trắng.
- **Bố cục bị xô khi tải font (CLS):** đã sửa, đo được ≤ 0,0004.

### 2.4 App: tinh chỉnh (v0.1.7, commit `a819796`)
- **Dòng ghi chú dưới ô nhập** có bộ đếm thì nằm trên 1 dòng, dài quá cắt bằng "…" và hiện câu đầy đủ khi giữ ngón tay hoặc rê chuột.
- **Thanh tab dưới đáy nâng lên:** thêm vùng an toàn của máy cộng 8px, cao 76px, nhãn cách mép dưới 18px. Không còn sát thanh vuốt điều hướng hay 3 nút Android. Mọi khoảng lề dưới dùng chung biến `--nav-total`.

### 2.5 App: chau chuốt chuyển động (v0.1.8, commit `1eaa9c3`)
- **Lỗi đã sửa:** viên trượt không chạy khi app tự chọn sẵn một lựa chọn bằng code (`segmented().set()`, gán `.checked`) và ở nút đổi sáng/tối. Hậu quả là ô "Giao diện" trong Cài đặt bị lệch 104–258px.
- **Một cơ chế viên trượt dùng chung `EP.lucian.pill`** (`js/lucian.js`), áp cho:
  - mọi `.seg` và `[role=tablist]`;
  - thanh tab dưới đáy (`.bnav`);
  - tab trên máy tính.

  Viên trượt tự áp vào thanh tạo sau và trong hộp thoại. Nó tự đo lại khi chọn bằng code, đổi kích thước, thanh vừa hiện ra, font tải xong, đổi sáng/tối, xoay máy. Test bấm 49 lần trên 15 thanh chọn và thanh tab, ở 360 và 390, lệch không quá 2px.
- **Bộ thông số chuyển động** nằm trong file mới `css/motion.css`, nạp cuối cùng. Có thêm `--ease-spring`, và `--ux-spring` trỏ về biến này.
- **Từng hiệu ứng:**
  - viên trượt 300ms có độ nảy;
  - nút lún 0,97 trong 120ms rồi nảy lại;
  - thanh tab có icon nảy và hết chớp đôi;
  - quả cầu banner dùng một vòng rAF, tự dừng khi khuất màn hình;
  - form trượt lên bám theo ngón tay và đóng theo vận tốc vuốt;
  - đổi sáng/tối giữ vòng tròn 650ms, icon chuyển giữa mặt trời, mặt trăng và tự động.

  Máy bật "giảm chuyển động" thì đổi ngay.
- **Hiệu năng** (390px, giả lập máy chậm 4 lần): phần lớn khung hình 16,8ms (~60 khung hình/giây) cho bấm thanh chọn, mở form, đổi sáng/tối, cuộn trang chủ. Bố cục không bị xô.
  - **Còn một điểm chậm:** lần đầu mở tab Mục khựng 70–120ms do dựng danh sách, không phải do hiệu ứng.

### 2.6 Đang chung cho cả 2 repo
- Font **Be Vietnam Pro** (400–800) và Playfair Display nhúng sẵn trong `fonts/`, không gọi Google.
- **`showPlayground`** trong `js/config.js`. Đặt `false` thì ẩn tab "Thư viện UI". **Đặt `false` trước khi nộp**: checklist có bước này và `nop-bai.mjs` sẽ cảnh báo nếu quên.
- **Banner "Tầm nhìn Thông minh"** là mặc định, gồm quả cầu 3D, kính sọc giả bằng gradient, nút coral có chữ màu navy để đạt độ tương phản. Đặt `data-hero="plain"` để tắt.
- **Script:**
  - `scripts/doctor.mjs`: kiểm tra máy trước giờ thi.
  - `scripts/nop-bai.mjs --url <link>`: mã commit và giờ chốt, quét key, kiểm README, chụp minh chứng dọc 360/390 kèm 1 ảnh máy tính, nén source, in 4 mục nộp bài. Có cờ `--dry-run`.
- Test `tests/smoke.cjs` gồm cả `tests/mobile-suite.cjs`. **Tất cả đạt** ở cả 2 repo tại mốc trên. Quét key: 0.

## 3. Việc còn mở và quyết định cần biết
1. **Tên trường** chỗ `{{TRUONG}}` trong README repo thi: Nguyên điền tay.
2. **App mở lên đã có sẵn dữ liệu mẫu.** Chưa có nút "Điền dữ liệu mẫu" riêng, chỉ có "Nạp lại dữ liệu demo" trong Cài đặt. Hôm thi chọn một cách và ghi vào `docs/DECISIONS.md`.
3. **Firebase đang tắt.** Nếu bật, bộ quét key sẽ báo key Firebase trong `config.js` và `nop-bai` sẽ dừng. **Không nới lỏng bộ quét**, Nguyên quyết cách xử lý. Đề không đòi dữ liệu dùng chung nhiều máy thì không bật.
4. **Worker giữ key** đã cho phép `https://xclipsex.github.io`. Muốn demo từ `localhost:8211` thì phải chạy lại `npx wrangler deploy` (wrangler.toml đã có localhost). Link Pages không cần.
5. **Hiệu ứng thẻ hiện ra khi cuộn tới** cố ý không làm, vì làm ẩn thẻ trong ảnh chụp toàn trang dùng cho slide.

## 4. Vai trò của Gemini hôm thi (không đổi, nhắc lại)
- **13:15 + ~10 phút:** Nguyên dán cho Gemini **`prompts/16-gemini-antigravity-giao-viec.md`**, gồm khối MASTER và B1–B4: `ag/ui`, `ag/data`, `ag/docs`, `ag/biz`. **B5 là phương án Gemini tiếp quản điều phối nếu Claude hết lượt.**
- **Cách làm:**
  - Làm trên nhánh **`ag/<việc>`** của repo `Xclipse-ChungKet`, chỉ sửa file được giao, dùng cổng 8240–8249.
  - Bám **hợp đồng dữ liệu** (`docs/spec-nhanh.md` mục 0): tên trường, tên hàm, kiểu trả về. Không tự đặt tên mới.
  - Trước khi đẩy code: `node --check`, `node tests/smoke.cjs http://localhost:<cổng>/` (có test điện thoại 360/390), `node scripts/scan-secrets.mjs .`.
  - Báo cáo theo mẫu: **đã xong · chưa test · lệnh chạy thử · file đã sửa**.
- **Không làm:**
  - chụp ảnh app (Claude Sonnet trong Chrome làm theo `prompts/15`);
  - dựng slide (Claude Design làm theo `prompts/14`);
  - đẩy thẳng lên `nop-bai`, sửa `index.html`, `css/motion.css`, `js/lucian.js`, `js/core.js` (khung dùng chung);
  - nới ngưỡng test, ghi key vào file, bật trả phí.
- **Giao diện:** dùng sẵn `EP.ui.segmented`, `EP.ui.actionBar`, `EP.ui.dialog`, `EP.form` (`type` đúng để có bàn phím đúng), `EP.ui.table` có `label` cho từng cột. **Không tự viết thanh chọn hay hiệu ứng riêng**, để viên trượt và chuyển động đồng bộ.
- **Bảng Kinh tế:** dùng `EP.scenario` (giả định có nguồn, 3 kịch bản, hòa vốn, độ nhạy) và `EP.importer` (file BTC). Tra công thức và nguồn ở `references/11`, `references/12` và `references/kien-thuc/`. Số nào không có nguồn thì ghi "giả định cần nêu nguồn".

## 5. Việc Gemini làm ngay bây giờ (trước 12:40)
1. **Nạp lại** `xclipse-skills-final.zip` bản mới. Đọc `KHOI-DONG.md`, `templates/THE-DIEU-PHOI.md`, `prompts/16`.
2. **Rà nhanh app v0.1.8** ở 360 và 390, sáng và tối: https://xclipsex.github.io/Xclipse-ChungKet/?demo=1.
   - Kiểm chân trang ghi v0.1.8.
   - Bấm thử **mọi thanh chọn** để chắc viên trượt chạy ở tất cả.
   - Thử đổi sáng/tối, mở form, chuyển tab.
   - **Chỉ báo lỗi**, theo mẫu: màn hình · phần tử · vấn đề · đề xuất. Không sửa code.
3. Nếu còn thời gian thì **dò lại `references/12`**: trích dẫn và con số khớp 10 file `references/kien-thuc/`. Sửa qua nhánh `ag/kien-thuc-review`, chỉ sửa `references/12` và `templates/HOI-DAP.md` mục G.

## 6. Quy tắc bắt buộc (không đổi)
- Không ghi key hay token vào file, commit, chat hay ảnh chụp.
- Không bật trả phí. Không dùng cổng 8000.
- Repo thi chỉ chứa khung chung, **không làm sẵn tính năng đoán theo đề**. README phải khai báo khung chuẩn bị trước và công cụ AI (Claude Opus/Sonnet/Haiku, Claude Design, Claude in Chrome, Gemini Antigravity).
- Cái gì chưa test thì ghi rõ "chưa test". Không bịa số liệu.
