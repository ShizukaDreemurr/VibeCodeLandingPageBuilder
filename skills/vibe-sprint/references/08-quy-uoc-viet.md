# 08 — Quy ước viết: đặt tên, câu chữ tiếng Việt, comment, commit, thư mục

Dán mục liên quan vào prompt mọi agent để code và chữ của 10 agent trông như một người viết. Rút từ ~190 commit và các vòng góp ý thật của Xclipse (thầy/cô, người dùng, giám khảo).

## 1. Đặt tên

| Thứ | Quy ước | Ví dụ |
|---|---|---|
| Biến, hàm, file code, class CSS, id DOM | Tiếng Anh, `camelCase` (JS), `kebab-case` (file/CSS/id) | `normalizePhone`, `order-row`, `btn-theme` |
| Thư mục feature | `features/<tên-kebab>/feature.js` (+ tuỳ chọn `css/<tên>.css`) | `features/don-hang/feature.js` |
| `EP.register({ id })` | kebab, **duy nhất**, = đường `#/id` | `id: 'orders'` |
| Khoá localStorage | `<prefix>` + tên ngắn; `prefix` ở `js/config.js` (đổi theo từng đề) | `ep_theme`, `ep_motion`, `ep_events` |
| Collection | số nhiều, snake/kebab | `orders`, `regs_<eventId>` |
| Id sinh ra | `<loại>_<ngẫu nhiên>` | `reg_k3j9x`, `evt_…` |
| Id dữ liệu demo | tiền tố `demo_` (để nhận ra và xoá/khôi phục được) | `demo_evt_coffee` |
| Mẫu/template sinh hàng loạt | `x<đợt>-<kebab>` | `x3-ev-launch` |
| File test | `tests/<tên>.cjs` (feature) hoặc `e2e-<chủ-đề>.cjs`; nhận URL từ `argv` | `tests/e2e-mobile.cjs [url] [thư-mục-ảnh]` |
| Mã ca kiểm thử | `TC01…` liên tục, ghi loại ca | `TC05 Biên – trùng` |
| Tệp ảnh minh chứng | `docs/evidence/kiem-thu/TC05.png`, `docs/evidence/ai/anh-1.png` | |
| Tên file tài liệu | tiếng Việt không dấu, kebab, **chữ HOA cho tài liệu nộp** | `docs/BANG-KIEM-THU.md`, `docs/CHECKLIST-CHUNG-KET.md` |
| Phiên bản | semver `x.y.z` trong `js/version.js`; patch = sửa lỗi/nhỏ, minor = tính năng, major = đổi lớn | `2.9.2` |
| Cổng | theo bảng cổng của skill; **không 8000** | `8217` |

- `kebab-case` không dấu, không khoảng trắng, không chữ hoa trong tên file ảnh/asset đưa lên web (GitHub Pages phân biệt hoa/thường).
- Tên thương hiệu trong nút/logo: `white-space: nowrap`. Tên thương hiệu viết một kiểu duy nhất xuyên suốt (Xclipse, không Eclipse/XClipse).

## 2. Câu chữ giao diện tiếng Việt

**Nguyên tắc chung:** tiếng Việt **có dấu**, tự nhiên như người nói, ngắn, cụ thể. Không dịch word-by-word. Một ý một câu. Không emoji trong UI (dùng icon SVG), không nhiều dấu chấm than.

| Loại | Quy tắc | Mẫu |
|---|---|---|
| Xưng hô | Gọi người dùng là **"bạn"**; không "quý khách" trừ ngữ cảnh trang trọng (thiệp cưới, sự kiện doanh nghiệp lớn); app không xưng "tôi/mình" | "Bạn đã đăng ký rồi bằng số điện thoại hoặc email này." |
| Nút | **Động từ + đối tượng**, ≤ 4 từ, viết hoa chữ đầu | "Tạo trang mới", "Dùng mẫu này", "Xuất CSV", "Điền dữ liệu mẫu" |
| Nút đang xử lý | Động từ + "…", khoá bấm | "Đang gửi…", "AI đang viết…" |
| Nút xác nhận xoá | Nêu rõ hành động, không "OK" | "Đồng ý xoá" / "Huỷ, giữ lại" |
| Lỗi nhập | **Thiếu gì + ví dụ đúng**, ngay dưới ô, không đổ lỗi | "Vui lòng nhập tên sự kiện." · "Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)." · "Email không đúng định dạng (ví dụ: ten@gmail.com)." |
| Lỗi giới hạn | Nêu con số | "Họ tên tối đa 80 ký tự." · "Số chỗ phải là số nguyên từ 1 đến 100.000." |
| Lỗi quan hệ | Nói điều kiện | "Hạn ưu đãi phải trước giờ bắt đầu sự kiện." |
| Lỗi hệ thống | Toast, nói cách thử lại; **không hiện stack/mã thô** | "Kết nối chậm hoặc mất mạng. Hãy thử lại." |
| Lỗi AI/dịch vụ | Nói nguyên nhân + việc đang làm | "Model … đã hết lượt miễn phí, thử lại sau ít phút." · "AI trả về 4 ý, chỉ giữ 3 ý đầu." |
| Thành công | Ngắn, có số liệu cập nhật | "Đăng ký thành công! Hẹn gặp bạn tại sự kiện." |
| Trạng thái rỗng | Giải thích + nút hành động | "Chưa có đơn nào. Bấm “Điền dữ liệu mẫu” hoặc “Thêm đơn”." |
| Trạng thái thời gian | Không bao giờ số âm | "Sự kiện đã diễn ra" (thay vì "-2 ngày") |
| Thiếu chỗ | Đếm thật, không khan hiếm giả | "Chỉ còn 12 chỗ" chỉ khi thật |
| Cảnh báo mô phỏng AI | **Nguyên văn từ đề/BTC**, từng chữ từng dấu | xem `SKILL.md` mục "Nhãn dữ liệu mẫu/mô phỏng" |
| Chưa làm | Nói thật | "Chưa kiểm chứng"; không ghi "Đạt" cho ca chưa chạy |

**Định dạng số/ngày (vi-VN, giờ `Asia/Ho_Chi_Minh`):**
- Tiền: `1.250.000 ₫` (`toLocaleString('vi-VN')`); đồng "đ"/"₫" nhất quán một kiểu trong cả app.
- Ngày: `28/11/2026`, giờ `08:00`; ngày dài: `Thứ Bảy, 28/11/2026`. `toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })`.
- Thời gian trong JSON-LD/dữ liệu: ISO có múi `+07:00`.
- Số liệu căn phải, `font-variant-numeric: tabular-nums`; số 0 không tô màu nhấn; tiêu đề cột xám.
- **Ngày demo cố định tương lai gần**, không "hôm nay + 3 ngày" (chấm lúc khác sẽ thành "còn 17 giờ"/đã qua).

**Viết nội dung marketing (landing, AI mock, dữ liệu demo)** — rút từ vòng sửa "văn AI, chung chung":
- Headline theo 4U (có ích, có lý do làm ngay, khác biệt, cụ thể bằng chi tiết thật), ≤ 12 từ/90 ký tự. Mô tả theo AIDA/PAS, 2–3 câu. Lợi ích theo FAB, viết thành **kết quả/cảm giác** cụ thể.
- Dùng chi tiết thật của người dùng (tên diễn giả, địa điểm, số chỗ, giờ). Khi người dùng gửi bản chữ của họ (như bản Mộc Coffee), **chép nguyên văn họ chỉnh**, không "cải thiện" lại.
- **Cấm sáo rỗng:** "đẳng cấp", "tinh tế", "nâng tầm", "trải nghiệm tuyệt vời", "không thể bỏ lỡ", "hành trình", "khám phá", "độc quyền", "bùng nổ", "đột phá", "hàng đầu".
- Khan hiếm/gấp rút chỉ khi gắn với sức chứa hoặc hạn thật. Một lời kêu gọi hành động duy nhất mỗi trang.
- Mock AI: nhiều mẫu câu, lấy dữ kiện từ input; mock phải đọc như người viết, không công thức đơn điệu.
- Chữ trên nút CTA ở chân trang kiểu "Tạo trang như thế này miễn phí bằng X": một dòng, thương hiệu `nowrap`.
- Alt ảnh: tiếng Việt mô tả, có tên đối tượng: `Diễn giả <tên> – <chức danh>`, `Hình ảnh <tên sự kiện> – ảnh N`. Ảnh AI tạo ghi "Ảnh minh hoạ tạo bằng AI".

## 3. Comment trong code

- Tên API công khai và hàm: tiếng Anh. **Comment: tiếng Việt ngắn hoặc tiếng Anh ngắn, một thứ trong một file**; ưu tiên giải thích **vì sao**, không nhắc lại **cái gì**.
- Đầu mỗi file JS: khối 3–6 dòng nói file làm gì, quy tắc nghiệp vụ, khoá lưu trữ, nguồn tham khảo/giấy phép (xem mục 6). Ví dụ đầu `registrations.js`: "Quy tắc: không đăng ký trùng (cùng SĐT hoặc email), hết chỗ → danh sách chờ, sự kiện đã diễn ra → không nhận".
- Mọi chỗ "kỳ lạ" phải có comment lý do, vì chính chúng đã gây lỗi: "chỉ MỘT animation trên pseudo này", "text/plain để khỏi preflight CORS", "cho phép truyền `now` giả để demo tua thời gian", "dấu ' giữ số 0 đầu và chặn chèn công thức".
- Mỗi `catch (e) { /* bỏ qua */ }` phải có chú thích vì sao nuốt lỗi (localStorage bị chặn, không có mạng...). Không nuốt lỗi nghiệp vụ.
- Không để `console.log` gỡ lỗi, không để `TODO` không chủ; việc chưa làm ghi vào `docs/DECISIONS.md` hoặc "Giới hạn" của README.
- Mỗi file ≤ khoảng 400 dòng cho feature; file `app.js` phình (Xclipse có 4000+ dòng) là món nợ: chia theo mô-đun từ đầu.

## 4. Commit, nhánh, phiên bản

- **Tiêu đề commit:** một dòng, thì hiện tại/mệnh lệnh, nói **kết quả**; tiếng Anh hoặc tiếng Việt, **đồng nhất trong một đợt**. Có thể mở đầu bằng phiên bản: `v2.9.2: single theme reveal animation, preview bar mobile fix`.
- **Thân commit** (khi đổi nhiều nơi): gạch đầu dòng theo khu vực (`css:`, `ui:`, `deck:`, `tests:`), nêu **nguyên nhân gốc** của lỗi, không chỉ triệu chứng.
- **Trailer** cuối commit (nếu hệ thống/người dùng yêu cầu), nguyên văn:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_<id>
```
  Trailer lấy từ chỉ dẫn của phiên làm việc; không tự bịa tên mô hình hoặc id phiên.
- Mỗi lần phát hành: `node tools/bump-version.cjs` (version + `?v=`), ghi `notes` ngắn trong `js/version.js`, commit, push. Hotfix cũng bump.
- Worktree của agent: commit trên nhánh của nó, **không push**; điều phối viên `git merge --no-ff` (message gộp: `Merge <nhánh> ...` hoặc câu tóm tắt tính năng đã gộp).
- Nhánh: làm trên `claude/<tên>` hoặc nhánh nộp; không push thẳng `main` nếu đội chưa đồng ý; **không tạo Pull Request nếu người dùng không yêu cầu**.
- Trước push: `git pull --no-edit origin <nhánh>` rồi push; nhánh Pages là nhánh production nên chỉ đẩy bản đã test (xem `07` G6).
- Stop-hook nhắc "có thay đổi chưa commit": commit + push, đừng kết thúc với cây bẩn.

## 5. Cấu trúc thư mục và quy tắc "cái gì để đâu"

```
index.html               khung app; thứ tự script cố định; một dòng <script> cho mỗi feature
css/                     tokens.css (biến + @layer), app.css (khung), <tên>.css (feature, trong @layer components), landing.css (nội dung người dùng)
js/                      core, ui, form, charts, export, ai, demo, mô-đun, version.js, config.js; app.js CUỐI
features/<tên>/          feature.js (+ tests nhỏ); xoá _example/_playground khi đã có feature thật
tests/                   *.cjs, nhận URL qua argv; ảnh vào --shots <thư-mục> (git-ignore)
tools/                   bump-version.cjs, build-*.cjs, make-thumbs.cjs (script chạy ở máy dev, không nạp vào web)
scripts/                 new-project.sh, scan-secrets.mjs, doctor.mjs, nop-bai.mjs
docs/                    spec-nhanh.md, PROGRESS.md, DECISIONS.md, BANG-KIEM-THU.md, MINH-CHUNG-AI.md, CHECKLIST-CHUNG-KET.md, minh-chung/ (ảnh chốt, do nop-bai.mjs ghi), minh-chung-ai/, evidence/{ai,kiem-thu}/
assets/                  favicon, og/<id>.jpg (1200×630), demo/*.webp, templates/*-thumb.jpg
s/<id>/index.html        trang chia sẻ tĩnh sinh bởi tools/build-share-pages.cjs (commit vào repo)
firebase/                firestore.rules + rules.test.mjs (+ README chạy emulator), chỉ khi đề cần
vendor/                  thư viện bên thứ ba đóng gói sẵn + README ghi phiên bản/giấy phép; không CDN
integrations/            mã chạy ở nơi khác (Apps Script Code.gs)
```

- **Đường dẫn tương đối** trong HTML/CSS/JS (Pages nằm dưới `/<repo>/`); URL tuyệt đối chỉ ở meta OG/canonical/sitemap.
- **File sinh ra** (`js/templates-data.js`, `s/*`, thumbnail) không sửa tay: sửa nguồn rồi chạy script, ghi lệnh trong `README.md` hoặc đầu script.
- **Không commit:** `.env*` (trừ `.env.example` chỉ có tên biến), `node_modules/`, ảnh chụp thử (`shots*/`, `undefined/`), video quay màn hình (`demo-video/`), `deck/out/`, công cụ cài cục bộ của agent (`.agents/`, `.claude/`). Không commit ZIP nộp bài (tạo bằng `git archive HEAD -o app.zip`).
- **README** ở gốc: đề số + bảng thi + link demo/video; 5 tính năng đúng thứ tự đề **đứng đầu**; tính năng mở rộng ở mục sau; công nghệ; tích hợp AI (thật/mô phỏng + nhãn nguyên văn); chạy trực tuyến/cục bộ; lưu ý khoá (Firebase config công khai là chủ đích; key Gemini không trong code); cấu trúc thư mục; giới hạn thật; nguồn tham khảo/khai báo. **Số liệu trong README (số mẫu, số ca, số tính năng) phải khớp app** (kiểm bằng test, xem `07` H7).
- **Giới hạn thật** phải có: localStorage một máy, ảnh có giới hạn dung lượng, số lượt xem công khai có thể cộng khống, mô phỏng không phải AI thật, phần "Chưa kiểm chứng".

## 6. Khai báo nguồn và giấy phép

- Giao diện/ý tưởng chuyển thể từ repo mở: ghi giấy phép **ở 3 nơi**: comment đầu file CSS/HTML dùng nó, README mục "Nguồn tham khảo/khai báo", form nộp bài. Ví dụ: "Lucian Lab — MIT © 2026 Seokwoooo".
- Ghi công cụ AI **đã dùng để xây** (Claude Code...) và AI **trong sản phẩm** (Gemini qua key người dùng, mô phỏng). Ảnh demo tạo bằng AI: nói rõ.
- Thư viện đóng gói sẵn: `vendor/README.md` ghi tên, phiên bản (Firebase compat 12.19.0, qrcode-generator 1.4.4), giấy phép (Apache-2.0, MIT).

## 7. Cách agent báo cáo và làm việc với người dùng

- **Báo cáo cuối của agent (4 mục):** đã xong · còn mô phỏng · cách chạy thử (lệnh + cổng) · cách xem bằng mắt (ảnh ở đâu). Kèm: file đã đổi, kết quả test **thật**, giả định đã chọn, việc chưa làm.
- **Nói thật mức độ chắc chắn:** "đã chụp từng khung hình trên giả lập Pixel 7", "chưa thử trên điện thoại thật", "không tái hiện được lỗi, đã làm 2 việc phòng ngừa", "chưa thử dán link lên Facebook/Zalo thật". Không viết "đã sửa" khi chỉ đoán nguyên nhân.
- **Sửa nguyên nhân gốc, không sửa test cho qua:** nếu test hỏng vì bug thật thì sửa app; nếu vì test lỗi thời (đổi tab mặc định...) thì sửa test và ghi rõ vì sao. Báo cáo phải nói đã chọn đường nào.
- **Hướng dẫn việc người dùng phải tự làm** (bấm GitHub, Firebase, dán key vào ô app): đánh số 1–N, nói rõ bấm đâu, kết quả mong đợi, và cách kiểm tra. Không dùng thuật ngữ trần.
- **Không bao giờ xin dán key/mật khẩu vào chat.** Người dùng lỡ dán key vào chat: **không ghi vào file/commit/ảnh**, nhắc thu hồi/tạo key mới sau khi dùng xong.
- Người dùng nhờ "xem file X đã đủ thể lệ chưa / nộp bài cần gì": đối chiếu từng mục thể lệ với repo, lập bảng ✅/⬜ (như `docs/CHECKLIST-CHUNG-KET.md`), nêu mâu thuẫn (ví dụ bảng A/B, hạn nộp 23:59 so với 00:30) và đề nghị làm sớm hơn mốc sớm nhất.
- Giữ `docs/PROGRESS.md` và `docs/DECISIONS.md` cập nhật: phiên làm việc bị nén/khởi động lại thì đó là bộ nhớ duy nhất; mỗi quyết định có mã `Dxx`.
- Khi nhận phản hồi kiểu "UI đẹp nhưng...": liệt kê từng lỗi người dùng nêu, sửa **cả lớp lỗi tương tự** ở mọi trang ("áp dụng cho tất cả landing page tương tự"), chụp lại cả ba khổ (máy tính, tablet, điện thoại) trước khi báo xong.

## 8. Quy ước UI cố định (tóm tắt để agent không phải đoán)

- Icon SVG nét (`stroke="currentColor"`), cùng một bộ; mọi mục menu/tab/nút công cụ đều có icon; trạng thái đang chọn (✓) đặt bên phải để icon thẳng cột.
- Một màu nhấn; nút chính gần đen hoặc accent; viền 1px mờ; không bóng nặng; không gradient/glow trừ nút CTA có chủ đích.
- Vùng chạm ≥ 48px (cách nhau ≥ 8px), ô nhập ≥ 16px, thân 16px (nội dung ≥ 14px); chữ thường tương phản ≥ 4.5:1; viền ô nhập ≥ 3:1.
- Chuyển động 120/200/320 ms, `ease-out` mũ; chỉ `transform/opacity`; mọi chức năng có phản hồi; có công tắc hiệu ứng (Bật/Theo máy/Tắt).
- Mỗi màn: đúng một `h1` + một dòng mô tả; xoá = hộp xác nhận riêng (hoặc giữ-để-xoá), không `confirm()`/`alert()` gốc; lưu tự động có chỉ báo "Đã lưu".
- Phím tắt: Esc đóng dialog (ưu tiên cao nhất, trả focus), Ctrl+Z/Ctrl+Shift+Z hoàn tác/làm lại, Ctrl+K bảng lệnh, Ctrl+/− thu phóng.
