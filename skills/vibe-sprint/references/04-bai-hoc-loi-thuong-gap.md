# 04 — Bài học và lỗi thường gặp (triệu chứng → nguyên nhân → cách sửa)

Rút từ lịch sử Xclipse. Đọc nhanh trước T+8, dán các dòng liên quan vào prompt agent.

## Quy trình agent / git

| Triệu chứng | Nguyên nhân | Cách sửa / phòng |
|---|---|---|
| Ảnh chụp của agent không có thay đổi vừa code; "chạy được" mà thật ra sai trang | Nhiều agent cùng dùng cổng 8000, server phục vụ **worktree của người khác** | Mỗi agent cổng riêng (bảng 8211-8230 ở `02`), không bao giờ 8000; kiểm tra `curl localhost:<cổng>/js/version.js` thấy đúng nhánh |
| Agent thấy code cũ / thiếu file | Worktree bắt đầu từ commit cũ | Dòng đầu prompt `git reset --hard <nhánh>`; so `git log -1` |
| Test fail dù tính năng đúng | Test **hardcode cổng 8000** | Test lấy URL từ `argv` (`node tests/smoke.cjs http://localhost:<cổng>/`); điều phối viên truyền URL |
| Merge xong app trắng | Xung đột ở `index.html` (hai dòng `<script>` đè nhau / thứ tự sai) | Giữ cả hai script, đúng thứ tự phụ thuộc; mỗi agent thêm script ở neo riêng |
| CSS sau điểm merge không áp dụng | Thiếu/thừa `}` trong `app.css` sau merge | Đếm ngoặc; khối `@layer components {}` phải đóng; chạy lại ảnh chụp |
| Hai agent sửa cùng hàm/file | Prompt không chia file | Chia sở hữu file; liệt kê "file CẤM đụng" |
| Agent dừng giữa chừng không báo | Chạm giới hạn/API lỗi | Kiểm tra commit của nó, spawn lại phần còn lại (prompt kèm "đã làm gì rồi") |
| Agent báo "xong" nhưng chưa thử | Không bắt buộc verify | Prompt yêu cầu ảnh + lệnh test + kết quả; QA agent kiểm lại |

## CSS / animation

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Kiểu của app đè lên landing/xem trước (hoặc ngược lại) | CSS app **nằm ngoài `@layer`** nên thắng độ ưu tiên | Toàn bộ CSS app trong các `@layer` khai báo ở `css/tokens.css` (`components` cho CSS mới); nội dung người dùng/xem trước ngoài layer |
| Thanh trên hiện bóng ma khi đổi theme/tab | `view-transition` bắt cả phần tử cố định | Gán `view-transition-name` riêng cho thanh, dọn token sau mỗi chuyển |
| Hiệu ứng đổi theme giật, chạy hai lần | **Hai animation trên cùng một pseudo** (`::view-transition-new(root)`) | Chỉ một WAAPI animation cho mỗi pseudo; dọn khi `finished` |
| Cuộn nhanh trên điện thoại bị kẹt | Hiệu ứng scroll/observer nặng, `scroll-snap` lỗi | Chỉ `transform/opacity`, observer nhẹ, giảm hiệu ứng ở mobile, thử vuốt thật |
| Animation giật nhẹ | Animate layout (`width/top`) hoặc `transition: all` | Chỉ thuộc tính composite; liệt kê thuộc tính cụ thể |
| Chớp trắng khi đổi tab | Nền chưa theo theme | `body` có nền theo biến; ép nền trước khi render |
| Thanh/toolbar tách khỏi header khi cuộn hoặc zoom | Sticky lồng nhau | Một container cố định; khoá chiều cao màn thiết kế |
| Input trong landing hiện kiểu tối | Màn tối "rò" vào vùng sáng | `color-scheme: light` cho vùng nội dung người dùng |
| Chữ nút "Tạo bằng X" xuống dòng | Không `nowrap` | `white-space: nowrap` cho tên thương hiệu trong nút |
| Khoảng trắng lạ cuối trang mobile | `min-height`/`100vh` + thanh địa chỉ | Dùng `100dvh`, kiểm tra footer ở 390px |

- **Đổi giao diện (View Transition) bị giật:** snapshot chụp cả `backdrop-filter` và `transition` từng phần tử đang chạy. Khi `html[data-vt="theme"]`: tắt `transition` của mọi phần tử + `backdrop-filter: none` (topbar, hero-flute), callback `startViewTransition` chỉ đổi `data-theme` (lưu/emit/vẽ lại biểu đồ dời sang rAF sau `finished`), bỏ qua click dồn khi đang chạy, clip-path ~480ms `cubic-bezier(.2,.8,.2,1)`; trình duyệt cũ mờ chéo 200ms. Đo bằng rAF delta + CPU 4x, đừng đoán.
## Cache / triển khai / chia sẻ

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Đã push mà trang vẫn bản cũ | Trình duyệt/Pages giữ cache | `node tools/bump-version.cjs` (gắn `?v=` mọi script/css), Ctrl+F5, chờ 1–10 phút, kiểm tra `version.js` ở chân trang |
| Facebook/Zalo hiện sai tiêu đề/ảnh | **Bot không chạy JS**, meta gắn bằng JS | Tạo HTML tĩnh `s/<id>/index.html` có sẵn OG + chuyển hướng bằng JS cho người thật; ảnh JPEG 1200x630 |
| Ảnh tải lên máy không hiện trên link chia sẻ | Ảnh là dataURL/local | OG chỉ nhận URL http(s) công khai |
| Khách tải lại trang bị mất trang đang làm (bị ghi đè bằng demo) | Seed demo chạy không kiểm tra | `js/demo.js` chỉ nạp khi collection rỗng và có cờ phiên bản (`demo_v_<tên>`); đừng tự viết seed ghi đè; test riêng |
| Máy giám khảo có dữ liệu demo cũ | Không có version dữ liệu | Tăng `version` trong `EP.demo.register`: nạp bản mới nếu người dùng chưa sửa dòng nào, dữ liệu người dùng giữ nguyên |
| Link online chạy nhưng demo bị trắng ở mạng trường | CDN/font ngoài bị chặn | Không phụ thuộc CDN; font fallback hệ thống |
| Ngày demo "còn 17 giờ" / số âm khi chấm | Ngày tương đối hoặc ngày cũ | Ngày cố định tương lai gần; sự kiện đã qua ghi rõ "đã diễn ra" |

## AI / dữ liệu

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Nhãn mô phỏng bị bác/chấm trừ | Sai câu chữ BTC yêu cầu | Lấy **nguyên văn** từ đề/BTC (từng chữ, từng dấu) và đặt ở `mockNotice` trong `js/config.js`; `Bản demo vòng loại - Dữ liệu mô phỏng AI` chỉ là câu của vòng loại, **chung kết phải kiểm tra lại từ đề, đừng suy diễn**; đổi câu thì sửa luôn 2 assert trong `tests/smoke.cjs` |
| Nhãn mô phỏng xuống dòng/che nút | CSS | `flex-wrap`, chạy ảnh mobile |
| Tạo ảnh bằng Gemini báo 429 `limit: 0` | **Key miễn phí không tạo được ảnh** (cần billing) | Văn bản dùng Flash miễn phí được; ảnh: dùng ảnh có sẵn/SVG/gradient, thông báo rõ trong app |
| Tên model đổi/gỡ (-preview) | Không ổn định | `EP.ai.MODELS` / `FALLBACKS` trong `js/ai.js` tự thử model kế; cập nhật danh sách theo tài khoản thật; luôn có mock |
| AI trả JSON kèm văn bản/code fence | Đầu ra tự do | `EP.ai.generate` đã có sẵn: tách JSON (`extractJson`), kiểm `schema`, thử lại 1 lần, rơi về `mock` kèm cảnh báo có nhãn; chỉ cần khai báo `schema` chặt + `mock` tốt |
| Nội dung mock sáo rỗng ("nâng tầm chuyên môn") | Công thức đơn điệu | Nhiều mẫu câu, lấy dữ kiện từ input, cấm cụm sáo rỗng; dữ liệu chính xác không để AI bịa |
| Key lộ trong repo/ảnh | Dán vào code/chat | Ô nhập key ở Cài đặt (`type=password`), mặc định chỉ giữ trong bộ nhớ trang, chỉ lưu localStorage khi tick "Nhớ key"; `node scripts/scan-secrets.mjs .` trước push; ảnh minh chứng không lộ key |

## Sản phẩm / thời gian

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Hết giờ mà tính năng thứ 5 dang dở | Thêm tính năng ngoài đề, làm polish sớm | Lõi trước; polish sau T+40; cắt phụ |
| Điểm kiểm thử thấp | Ghi "Đạt" cho ca chưa chạy | Chỉ ghi ca đã chạy thật |
| Thư mục rác trong repo (`undefined/`, ảnh chụp) | Test ghi ảnh vào đường dẫn undefined | Test nhận thư mục ảnh qua `--shots <thư-mục>`, `.gitignore` thư mục ảnh (`shots*/`) |
| Quá nhiều hiệu ứng làm chậm bản trình diễn | Quá đà | 1–2 hiệu ứng nhấn, còn lại tinh tế; test trên máy yếu |
| Mobile bị bỏ quên | Chỉ test desktop | QA 390px bắt buộc ở T+48 |

---

## Bổ sung (đợt 2): lỗi thật còn thiếu ở các bảng trên

Mã `07-…` = đoạn chép-dán tương ứng trong `references/07-cookbook-code-mau.md`; `08-…` = `references/08-quy-uoc-viet.md`.

### Quy trình agent / kiểm chứng

| Triệu chứng | Nguyên nhân | Cách sửa / phòng |
|---|---|---|
| Agent "sửa" bằng cách đổi test cho đi vòng qua lỗi (nút Điền dữ liệu mẫu vẫn bị trang demo ghi đè) | Prompt chỉ yêu cầu "test xanh" | Prompt: "tìm nguyên nhân gốc trước, sửa app; chỉ sửa test khi test lỗi thời và nói rõ". Báo cáo nêu đã chọn đường nào |
| Test cũ chỉ in kết quả, điều phối viên phải grep "lỗi/fail" mới biết hỏng | Không trả mã thoát | Mọi `tests/*.cjs` kết thúc `process.exit(failed ? 1 : 0)` (`07` H1) |
| Một loạt test đỏ sau khi đổi tab mặc định / hành vi khách | Test giả định tab đầu cũ | Helper mở đúng tab trước khi thao tác (`tests/auto-tab.cjs`); test không dựa vào trạng thái mặc định |
| Test "Esc đóng xem trước" lúc được lúc không | Chờ khoảng cố định; listener khác nuốt phím | Chờ dialog đóng hẳn bằng `waitForFunction`; Esc xử lý ở listener capture đầu tiên (`07` H3) |
| Test tự động không thấy dữ liệu mẫu/popup | Code bỏ qua khi `navigator.webdriver` | Đã chủ đích: demo cần `?demo=1`, popup cần `?popup=1`; viết vào comment đầu file để agent sau khỏi tìm |
| Agent trong sandbox không chạy được test Firebase/emulator | Không có Java/emulator/quyền Firebase | Điều phối viên tự chạy sau merge (`07` G5); báo rõ "phần này chưa chạy" cho đến lúc chạy |
| Agent không tái hiện được lỗi (chạy 3/3 lần vẫn qua) | Lỗi phụ thuộc máy thật/thời điểm | Làm biện pháp phòng ngừa + **nói thẳng "chưa xác nhận"**, nhờ người dùng thử trên máy thật và gửi ảnh; không viết "đã sửa" |
| Automation không vuốt/đổi thanh địa chỉ như điện thoại thật | Chrome giả lập khác máy thật | Chụp bằng viewport điện thoại (`isMobile`, `hasTouch`), ghi "chưa thử trên điện thoại thật"; hỏi người dùng đã bật "giảm chuyển động" chưa |
| Sửa lỗi A làm mất tính năng B (đổi theme ngay sau chuyển tab hết hiệu ứng) | Sửa chữa không có test bảo vệ | Mỗi lần sửa thêm 1 test hồi quy + chụp giữa lúc chuyển (`07` H4); so với bản còn đúng trước đó |
| Push bản ghép chưa test làm web thật hỏng ngay | Nhánh Pages = nhánh production | Ghép/test ở nhánh khác; chỉ đẩy sang nhánh Pages khi test xanh (`07` G6) |
| Phiên làm việc bị nén/khởi động lại, mất mạch | Ngữ cảnh đầy | Cập nhật `docs/PROGRESS.md` + `docs/DECISIONS.md` sau mỗi đợt; prompt tiếp nối nêu "đã làm gì rồi" |
| Cây git bẩn khi kết thúc (stop-hook nhắc) | Quên commit | Cuối mỗi đợt: commit + `git pull --no-edit origin <nhánh>` + push |
| Thư mục video quay màn hình/ảnh thử bị commit | `.gitignore` thiếu | `demo-video/`, `shots*/`, `undefined/`, `.agents/`, `.claude/` (`07` H8) |

### Giao diện / mobile / animation (bổ sung)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Vòng tròn đổi sáng/tối không phủ tới góc dưới trái trên Android | Bán kính tính theo `innerHeight` khi thanh địa chỉ co lại | Bán kính theo `visualViewport` + kích thước lớn nhất (`07` B3) |
| Đổi theme ngay sau khi chuyển tab thì mất vòng tròn | Cờ `data-vt` của transition trước xoá cờ của transition sau | Mỗi transition chỉ dọn cờ của chính nó; vòng tròn chạy bằng WAAPI, không phụ thuộc selector CSS |
| Người dùng báo "mất animation" nhưng test vẫn xanh | Máy bật Giảm chuyển động/Xoá hiệu ứng động | Hỏi cài đặt đó trước; có công tắc Bật/Theo máy/Tắt trong app (`07` B5); chụp khung hình để chứng minh |
| Khung xem trước (dialog) không chạy hiệu ứng cuộn (timeline, đếm số) | Observer chỉ nghe cuộn của cả trang, dialog tự cuộn bên trong | `IntersectionObserver` với `root` = khung cuộn gần nhất (`07` B8); tắt hiệu ứng nặng khi lướt Reels nhưng bật lại khi mở xem trước |
| Reels (lướt dọc từng mẫu) chờ ~1 giây mới định khung, giật | Tự viết quán tính JS | `scroll-snap` native + lazy mount từng khung; chỉ hiệu ứng nhẹ khi đang vuốt |
| Landing không cuộn được khi vuốt nhanh trên điện thoại | Khung landing là vùng cuộn lồng; ảnh bìa trôi bằng `background-position` | Bỏ `overflow` ở khung landing, trôi bằng `transform`, hiện nội dung trước khi vào màn hình (`07` B8, C10) |
| Dải trắng cuối trang mobile dù đã dùng `dvh` | Thanh CTA dính đang ẩn vẫn chiếm chỗ (~69px) | Khung dính cao 0 + thanh `position: absolute` (`07` C6) |
| Diễn giả xếp 2+1 ô lẻ; 4 ô đếm ngược thành 3+1 | Lưới `auto-fill` không biết số phần tử | 1 cột trên điện thoại hoặc `:has()` theo số phần tử; đếm ngược `repeat(4, 1fr)` (`07` C5, C10) |
| Hai nút đè lên ảnh xem trước của thẻ mẫu trên điện thoại | Nút chỉ hiện khi rê chuột, đặt chồng lên ảnh | `@media (hover: none)` đưa nút xuống hàng chân thẻ (`07` C4) |
| Đường kẻ thanh bước đi xuyên qua nội dung | Đường dài hơn khoảng giữa hai chấm | Đường chạy đúng từ tâm chấm đầu tới tâm chấm cuối ở mọi bề rộng; nhãn cho phép 2 dòng căn giữa trên mobile |
| Thanh xem trước dạng viên thuốc rớt 2 dòng, cắt mất chữ, lệch góc bo | `border-radius: 999px` + nội dung dài | Điện thoại: hình chữ nhật bo bằng khung bên dưới, một hàng, `…` cho tên dài, nút ✕ chỉ icon (`07` C8) |
| Ô tích (checkbox) có khung xám như ô nhập | Kiểu `input` áp cho mọi loại input | `input:not([type=checkbox])…` và `label.check` bấm chữ cũng tích (`07` C3) |
| Khối đã ẩn (`hidden`) hiện lại trong file HTML xuất | Class có `display:flex` thắng thuộc tính `hidden` | `[hidden] { display: none !important }` cả trong CSS xuất (`07` C2) |
| Dấu tiếng Việt chạm nhau ở tiêu đề lớn | `line-height` 1.1 | Tiêu đề ≥ 1.25–1.3 (`07` C8) |
| Nhãn mô phỏng AI trên thanh công cụ rớt thành 4 dòng nhỏ | Thanh `flex` hẹp, nhãn không `nowrap` | Desktop một dòng (`nowrap`), từ 1101px thanh xuống dòng để nhãn nằm riêng, dưới 1100px rút `…` kèm `title` đầy đủ (`07` E4) |
| Thông báo (toast) che ô nhập trên điện thoại; ô nhập tự phóng to | Toast ở đáy; ô nhập < 16px | Toast ở mép trên mobile; mọi ô nhập `font-size: 16px` (`07` C7) |
| Nút Đăng ký ở đầu trang vẫn hiện khi sự kiện đã qua (form đã ẩn) | Chỉ ẩn form, quên các CTA khác | Mọi CTA (hero, cuối trang, thanh dính, file xuất) đổi thành nhãn không bấm được (`07` D3) |
| Hiệu ứng nặng/giật khi kéo thanh trượt, kéo thả | Vẽ lại mỗi lần nhích chuột; dời bằng `top/left` | ≤ 1 lần vẽ mỗi khung hình (`rAF`), dời bằng `transform` (FLIP) (`07` B6, B7); đo trước/sau, báo số thật |

### Dữ liệu / AI / chia sẻ (bổ sung)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Link chia sẻ thấy một chút khung builder trước khi trang hiện | Khung app hiện trước khi JS biết đây là link công khai | Script `<head>` gắn class `boot-public` ẩn khung (`07` F3) |
| Meta OG đúng nhưng Facebook vẫn hiện bản cũ | Facebook/Zalo cache bản xem trước | Dán **link mới** (`/s/<id>/`), Sharing Debugger → Scrape Again; đừng hứa là đã chạy trên Facebook khi chưa thử (`07` F2) |
| Cần trang chia sẻ riêng nhưng không có máy chủ | Pages tĩnh; Firebase Functions cần trả phí | `tools/build-share-pages.cjs` sinh `s/<id>/index.html` ở máy, commit vào repo; chạy lại khi đổi nội dung |
| Ảnh tải lên bị báo "quá lớn/dung lượng đầy" | Giới hạn localStorage ~5MB, tài liệu Firestore 1MB | Tự nén theo trần từng loại ô, nén lại ảnh nặng nhất khi cả trang vượt ngân sách; báo "từ X xuống Y" (`07` D8); kho ảnh lớn dùng IndexedDB (`07` D9) |
| Tìm "cuoi" không ra "cưới" | So khớp có dấu | Chuẩn hoá `NFD` bỏ dấu + `đ→d` cả hai phía (`07` D10) |
| Bộ lọc chỉ có một nhãn chiếm 22/25 mẫu | Gán nhãn lệch khi agent sinh hàng loạt | Validator của đợt sinh dữ liệu kiểm phân bố; gán lại nhãn riêng rồi mới bật bộ lọc (`07` I1) |
| README ghi "172 mẫu" mà app có số khác | Sửa dữ liệu quên sửa tài liệu | Test so số trong README với `EP…length` (`07` H7) |
| Giới thiệu Firebase/Sheet như nơi lưu chính nên bị nhận xét "chưa đúng tính năng" | Đề quy định localStorage | Bản chính đúng đề; Firebase/Sheet nói rõ là tuỳ chọn trong README và khi trình bày (`07` G mở đầu) |
| Đăng nhập Google lỗi `auth/unauthorized-domain` trên Pages | Chưa thêm `<tài-khoản>.github.io` vào Authorized domains | `07` G1 bước 4; mở qua `file://` cũng không đăng nhập được |
| Tính năng lưu theo tài khoản không chạy trên web thật dù test emulator xanh | Rules mới chưa Publish lên dự án Firebase thật | `npx firebase deploy --only firestore:rules` hoặc dán vào Console → Rules → Publish; ghi vào danh sách việc người dùng phải làm |
| Gemini báo 404 model | Tên `-preview` bị đổi/gỡ; bảng model của tài liệu chưa xác minh | Danh sách model + `FALLBACKS`; đối chiếu `ai.google.dev` khi có mạng; mục "(?)" là chưa xác minh |
| Người dùng dán API key (EverAI, Gemini...) vào chat | Quên quy tắc | Không ghi key vào file/commit/ảnh/README; chỉ dùng trong lệnh tạm nếu bắt buộc, nhắc thu hồi/đổi key sau đó; `scan-secrets` trước push |
| Bản ghi minh chứng AI không còn đoạn chat gốc | Lịch sử bị nén | Chụp và ghi `docs/MINH-CHUNG-AI.md` ngay lúc làm (`07` H6) |
| Bảng A hay B? Hạn nộp 23:59 hay 00:30? | Thông tin lệch giữa thông báo, cô và README | Hỏi/đối chiếu ngay ở T+0; làm theo mốc sớm nhất; ghi quyết định vào `DECISIONS.md` |

## Gemini qua proxy của đội (đọc trước khi demo)

- `ai.proxyUrl` trong `starter/js/config.js` đã **điền sẵn Worker của đội**: `https://vibe-gemini-proxy.xclipse.workers.dev` (không cần nhập key khi demo).
- **`ALLOWED_ORIGINS` trên Worker phải chứa origin Pages của chung kết.** `https://xclipsex.github.io` dùng được cho mọi repo dưới tài khoản đó; **tài khoản khác phải thêm origin vào Worker** (xem `proxy/README.md`), không thì trình duyệt báo CORS/403.
- Model mặc định hiện là **`gemini-4-hydrogen` (~10 giây/lượt)**. Nếu chậm khi demo: vào Cài đặt đổi sang **`gemini-3.6-flash` (~1 giây)**.
