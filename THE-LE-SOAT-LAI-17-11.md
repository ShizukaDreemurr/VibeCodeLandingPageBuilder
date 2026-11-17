# SOÁT LẠI THỂ LỆ CHUNG KẾT VIBE-CODING 2026 (17/11)

- **Nguồn đối chiếu gốc:** `Thể lệ và tiêu chí chấm Chung kết | VIBE-CODING 2026` (file HTML chính thức của BTC).
- **Bản tóm tắt đối chiếu:** `skills/vibe-sprint/references/00-the-le-chung-ket.md` (commit `18f132a`).
- **Hiện trạng app thi đối chiếu:** `XclipseX/Xclipse-ChungKet`, nhánh `nop-bai`, commit `d8b7416` (`v0.1.9`).
- **Người thực hiện:** Gemini (Antigravity) — nhánh `ag/the-le-review`.

---

## A. Đối chiếu bản tóm tắt của Claude (8 mục) với thể lệ gốc

| # | Nội dung tóm tắt | Kết luận | Trích nguyên văn từ thể lệ gốc |
|---|---|---|---|
| **1** | Lịch: ổn định 12:40–13:00 · thi 13:15–14:15 (60 phút, 2 bảng cùng lúc) · giám khảo chấm 14:15–14:45 · trình bày + hỏi đáp 14:45–15:45. Thời lượng trình bày BTC chốt sau. | **ĐÚNG** *(nhưng `00-the-le-chung-ket.md` đang **THIẾU** 3 mốc: `12:40–13:00`, `13:00–13:15`, `15:45–16:05`)* | Mục 7: *"12:40–13:00 \| 20 phút \| Ổn định tổ chức"*, *"13:00–13:15 \| 15 phút \| Văn nghệ, phát biểu"*, *"13:15–14:15 \| 60 phút \| Thi xây dựng mini app, hai bảng đồng thời"*, *"14:15–14:45 \| 30 phút \| Giám khảo kiểm tra và chấm sản phẩm"*, *"14:45–15:45 \| 60 phút \| Trình bày, demo và hỏi đáp"*, *"15:45–16:05 \| 20 phút \| BTC rà soát điểm và thống nhất kết quả"*. *"Thời lượng trình bày mỗi đội được Ban tổ chức chốt sau khi xác nhận số đội, bảo đảm các đội trong cùng bảng được đối xử như nhau. Nếu lịch thực tế thay đổi, Ban tổ chức thông báo trước phần thi tương ứng."* |
| **2** | Được dùng AI, nền tảng, thư viện, tài liệu. Cấm chuẩn bị sẵn sản phẩm hoàn chỉnh hoặc chức năng làm riêng cho đề chưa công bố. BTC có thể mời giải trình. | **ĐÚNG** *(bổ sung thêm từ Mục 1: bắt buộc **giao diện tiếng Việt**)* | Mục 2: *"Trong thời gian thi, đội được sử dụng công cụ trí tuệ nhân tạo, nền tảng, thư viện lập trình và tài liệu tham khảo."* · *"Không được chuẩn bị trước sản phẩm hoàn chỉnh hoặc chức năng được xây dựng riêng để đáp ứng đề thi chưa công bố. Mọi phần được tính là sản phẩm dự thi phải do đội tạo hoặc hoàn thiện trong thời gian thi. Khi có căn cứ hợp lý về việc sử dụng sản phẩm làm sẵn, Ban tổ chức mời đội giải trình và xem xét thông tin liên quan trước khi quyết định."* Mục 1: *"Sản phẩm là ứng dụng web, giao diện tiếng Việt, có thể thao tác và trình bày trực tiếp."* |
| **3** | Nộp 4 mục khi hết 60 phút: link demo hoặc cách mở; source; README (cài đặt/chạy, công nghệ, dữ liệu mẫu/tài khoản); minh chứng quá trình (ảnh hoặc bản ghi màn hình tại thời điểm chốt). Không sửa sau khi nộp, trừ thời gian khắc phục sự cố. Bắt buộc có link trực tuyến. | **ĐÚNG** *(bổ sung từ Phụ lục A: không yêu cầu đăng nhập cá nhân/khóa bí mật)* | Mục 3: *"Khi hết 60 phút, đội chốt sản phẩm và nộp đủ bốn hạng mục: (1) link demo hoặc cách mở sản phẩm; (2) source code; (3) README hướng dẫn cài đặt/chạy, mô tả công nghệ và tài khoản hoặc dữ liệu mẫu nếu cần; (4) minh chứng quá trình làm bài, gồm ảnh chụp hoặc bản ghi màn hình thể hiện sản phẩm tại thời điểm chốt. BTC công bố trước kênh và định dạng nhận bài. Đội không chỉnh sửa sản phẩm sau khi nộp, trừ thời gian khắc phục sự cố theo quy định. Đội nộp đường dẫn trực tuyến."* |
| **4** | BTC phát file dữ liệu mẫu theo bảng khi phát đề. Số liệu giả lập phải ghi rõ là dữ liệu mẫu hoặc mô phỏng. | **ĐÚNG** | Mục 3: *"Ban tổ chức cung cấp một file dữ liệu mẫu cho từng bảng khi phát đề. Các đội trong cùng bảng nhận cùng dữ liệu để tích hợp và chạy thử. Ban tổ chức chỉ gửi cho mỗi đội các sheet thuộc bảng của đội đó."* · *"Số liệu giả lập trong sản phẩm phải được nhận biết rõ là dữ liệu mẫu hoặc dữ liệu mô phỏng."* |
| **5** | Điện thoại 360–390px với 5 tiêu chí: không tràn/cuộn ngang; nút và ô nhập dễ bấm, không chồng nhau; chữ dễ đọc ở mức phóng to mặc định; luồng chính làm trọn trên điện thoại; có thanh tab hoặc điều hướng rõ. | **ĐÚNG** | Mục 4: *"Giám khảo kiểm tra sản phẩm trên khung hiển thị rộng 360–390 px. Cả hai bảng được đánh giá theo cùng năm yêu cầu sau: Bố cục hiển thị trọn vẹn, không tràn nội dung và không phải cuộn ngang. Nút bấm và ô nhập đủ dễ thao tác bằng ngón tay; các nút quan trọng không chồng lấn. Chữ dễ đọc ở mức phóng đại mặc định, không cần phóng to màn hình. Các luồng chính theo đề đều thao tác được trên điện thoại, không phụ thuộc vào máy tính. Thanh điều hướng hoặc tab rõ ràng, giúp người dùng biết mình đang ở đâu và chuyển giữa các màn hình chính."* |
| **6** | Vòng 1 không có hỏi đáp. Vòng phản biện cho đội được chọn; Bảng Kinh tế trình bày thêm giả định và cách tính kinh doanh. | **ĐÚNG** | Mục 5 & Phụ lục A: *"Vòng 1 không có mục hỏi đáp và không chấm điểm trả lời câu hỏi. Với các đội được chọn vào vòng phản biện, Ban giám khảo chấm phần trình bày và trả lời theo bộ tiêu chí riêng của vòng này; bảng Kinh tế trình bày thêm các giả định và cách tính kinh doanh theo đề."* |
| **7** | Thang điểm Bảng Kinh tế: phần lõi 27 · điện thoại 10 · giao diện/trải nghiệm/hoàn thiện 5 · tính thực tế cơ chế kinh doanh/ưu đãi 10 · phân tích mô hình kinh doanh 22 · số liệu dự phòng và giả định 17 · hồ sơ 9 (link 2 · source khớp demo 3 · README 2 · minh chứng lúc chốt 2). Tối đa 100. Đồng điểm thì ưu tiên phần lõi, rồi tiêu chí trọng tâm của bảng. | **ĐÚNG** | Phụ lục A: *"Hoàn thành phần lõi theo đề được phát tại giờ thi: 27 \| Khả năng sử dụng trên điện thoại: 10 \| Giao diện, trải nghiệm và độ hoàn thiện: 5 \| Tính thực tế của cơ chế kinh doanh/ưu đãi: 10 \| Phân tích mô hình kinh doanh: 22 \| Số liệu dự phòng và giả định: 17 \| Hồ sơ nộp bài: 9 \| Tổng: 100"*. *"Tiêu chí Hồ sơ nộp bài (9 điểm): link demo hoặc hướng dẫn mở sản phẩm (2 điểm); source code đầy đủ, truy cập được và tương ứng với bản demo (3 điểm); README có hướng dẫn cài đặt/chạy, công nghệ sử dụng và dữ liệu mẫu hoặc thông tin cần thiết (2 điểm); minh chứng bản nộp tại thời điểm chốt, chẳng hạn ảnh chụp màn hình hoặc bản ghi ngắn (2 điểm)."* Mục 6: *"Nếu bằng tổng điểm, ưu tiên điểm hoàn thành phần lõi; nếu vẫn bằng, ưu tiên tiêu chí trọng tâm của bảng; nếu vẫn bằng thì đồng hạng."* |
| **8** | Điểm là trung bình các giám khảo, làm tròn 1 chữ số thập phân. Xếp loại: 90+ Xuất sắc · 75–89 Tốt · 60–74 Đạt. | **ĐÚNG** *(thiếu ghi chú: `< 60 Chưa đạt`, điểm sau trừ `≥ 0`)* | Mục 6 & Phụ lục A: *"Điểm của đội là trung bình cộng điểm cuối của các Ban giám khảo, làm tròn đến một chữ số thập phân. Điểm sau các khoản trừ không thấp hơn 0."* · *"90–100 Xuất sắc; 75–89 Tốt; 60–74 Đạt; dưới 60 Chưa đạt."* |

---

## B. Các điểm thể lệ CÓ nhưng skill CHƯA xử lý (hoặc chưa ghi rõ)

1. **"Không yêu cầu thông tin đăng nhập cá nhân hoặc khóa bí mật" (Phụ lục A — Hồ sơ nộp bài):**
   - App hiện tại có Cloudflare Worker proxy nên không cần nhập Gemini key, nhưng `00-the-le-chung-ket.md` và `CHECKLIST-CHUNG-KET.md` chưa nhấn mạnh quy tắc: **tuyệt đối không khóa app sau màn hình đăng nhập cá nhân hoặc đòi người chấm nhập API key** (nếu đề có vai trò quản trị/đăng nhập, phải mở sẵn chế độ dùng ngay không cần tài khoản cá nhân, hoặc cấp tài khoản demo công khai trong README).
2. **Kiểm tra kênh/định dạng nộp bài & điều kiện mạng/thiết bị/trình duyệt trước giờ thi (Mục 3):**
   - Thể lệ: *"BTC công bố trước kênh và định dạng nhận bài"* và *"Ban tổ chức công bố trước địa điểm, điều kiện mạng, thiết bị và trình duyệt dùng trong phần chấm."*
   - `KHOI-DONG.md` / `THE-DIEU-PHOI.md` chưa có mục kiểm tra lúc `12:40–13:00` (ổn định tổ chức): xác nhận link form nộp bài của BTC, giới hạn dung lượng file ZIP, trình duyệt giám khảo dùng khi chấm, và mạng hội trường có chặn `*.workers.dev` không.
3. **Giao diện tiếng Việt bắt buộc (Mục 1):**
   - Thể lệ: *"Sản phẩm là ứng dụng web, giao diện tiếng Việt, có thể thao tác và trình bày trực tiếp."*
   - `CHECKLIST-CHUNG-KET.md` nên có 1 ô kiểm tra rà soát không để sót nhãn tiếng Anh từ khung mẫu (`Playground`, `Import`, `Export`, `Error`, `Loading`...).
4. **Quy tắc trừ điểm, không trừ lặp và quyền rà soát/khiếu nại điểm (Mục 6):**
   - Thể lệ: *"Một sự cố đơn lẻ không bị trừ lặp cho cùng một biểu hiện"* và *"Nếu có chênh lệch đáng kể giữa các phiếu hoặc khiếu nại về phép tính điểm, trưởng Ban giám khảo rà soát căn cứ và thống nhất biên bản trước khi công bố kết quả"* (mốc `15:45–16:05`).
   - Skill chưa ghi lại để đội nắm quyền lợi nếu có tranh chấp/sai sót khi chấm.
5. **Quy định về thời gian khắc phục sự cố sau khi nộp (Mục 3):**
   - Thể lệ: *"Đội không chỉnh sửa sản phẩm sau khi nộp, trừ thời gian khắc phục sự cố theo quy định."*
   - Skill cần ghi rõ: sau 14:15 **tuyệt đối không commit/push**, chỉ sửa nếu BTC chính thức mở khung khắc phục sự cố và chỉ sửa lỗi kỹ thuật chặn mở/chạy (không thêm tính năng).
6. **Lịch trình trong `00-the-le-chung-ket.md`:**
   - Thiếu 3 mốc: `12:40–13:00` (Ổn định tổ chức), `13:00–13:15` (Văn nghệ, phát biểu), `15:45–16:05` (BTC rà soát điểm và thống nhất kết quả).

---

## C. Đối chiếu thể lệ với hiện trạng app `v0.1.9` (`d8b7416`) và quy trình skill

### 1. App thi có chỗ nào dễ bị coi là "chuẩn bị sẵn chức năng cho đề" không?
- **Hiện trạng trên `Xclipse-ChungKet` (`d8b7416`):**
  - Có `features/_example` (màn CRUD mẫu chung), `features/_playground` (gồm ví dụ shop online chung, đang bật `showPlayground: true` trong `js/config.js`), `EP.scenario` (`js/scenario.js`), `EP.importer` (`js/import.js`), `EP.ai` (`js/ai.js`).
- **Đánh giá rủi ro:**
  - Nếu **quên đặt `showPlayground: false`** trước khi nộp, tab `Mô-đun` và route `#/playground` (với ví dụ shop online) sẽ hiển thị trên link demo -> rất dễ gây hiểu nhầm là làm sẵn giao diện/ví dụ không thuộc đề.
  - Dù đã tắt `showPlayground: false`, thư mục `features/_example` và `features/_playground` vẫn tồn tại trong source code ZIP/GitHub.
- **Cách trình bày & giải trình an toàn:**
  1. Bắt buộc đặt `showPlayground: false` trong `js/config.js` trước khi chốt bài (`nop-bai.mjs` đã có cảnh báo mục `3b`).
  2. Giữ `git log` sạch và rõ ràng: các commit trước 13:15 chỉ thuộc khung `vibe-sprint v0.1.9`; toàn bộ `features/<tên-đề>/`, dữ liệu mẫu, giả định và logic nghiệp vụ theo đề đều có commit trong khoảng 13:15–14:15, khớp với `docs/MINH-CHUNG-AI.md`.
  3. **Câu mẫu khuyến nghị bổ sung vào mục `15. Khung chuẩn bị trước` trong `README.md`:**
     > *"Chế độ thử nghiệm nội bộ (`showPlayground`) đã được tắt (`false`) trước khi nộp bài; các mô-đun `EP.ai`, `EP.scenario`, `EP.importer` và thư mục mẫu khung `features/_example`, `features/_playground` thuộc bộ khung kỹ thuật chung `vibe-sprint` (tương đương thư viện UI/tiện ích), không chứa công thức, dữ liệu, giả định hay giao diện nào viết riêng cho đề thi trước 13:15."*

### 2. Minh chứng quá trình (`scripts/nop-bai.mjs`)
- **Hiện trạng:** `nop-bai.mjs` chụp ảnh dọc `390×844` và `360×780` (@3x sáng/tối mọi tab) + `1` ảnh desktop `1440×900`, đóng dấu thanh chú thích gồm **short hash commit, version, giờ ISO `Asia/Ho_Chi_Minh`, URL** và xuất `manifest.json`.
- **Đối chiếu thể lệ:**
  - Về tiêu chí chấm **2 điểm "minh chứng bản nộp tại thời điểm chốt"** (Phụ lục A & Mục 3): **ĐÃ ĐỦ và RẤT TỐT** (vì thể lệ chỉ yêu cầu *"ảnh chụp màn hình hoặc bản ghi ngắn"*).
  - Về **phòng giải trình "quá trình làm bài"** (Mục 2): nên giữ kèm `docs/MINH-CHUNG-AI.md` + `git log` theo từng mốc giờ thi; nếu dư thời gian ở T+55 có thể quay thêm 1 đoạn màn hình ngắn 30–60 giây (tùy chọn, không bắt buộc).

### 3. README (`templates/README-du-thi.md` & `README.md` trong repo thi)
- **Đã đủ các mục thể lệ bắt buộc:** cài đặt/chạy (mục 5), công nghệ (mục 3), dữ liệu mẫu/tài khoản (mục 12, 14), khai báo khung chuẩn bị trước (mục 15), công cụ AI (mục 17).
- **Còn thiếu / cần lưu ý chỉnh:**
  1. Bổ sung 1 câu khẳng định rõ trong mục `4` hoặc `7`: **"Giám khảo mở link là dùng được ngay, không yêu cầu đăng nhập tài khoản cá nhân hay nhập API key."**
  2. Trong bảng mục 1 của `README.md` hiện có `<URL video>` và `<tên gói hoặc URL>` cho Source ZIP: nếu không quay video riêng hoặc nộp ZIP trực tiếp trên cổng BTC, nhớ **điền cụ thể hoặc xóa dòng `<…>`** để `nop-bai.mjs` không báo còn placeholder chưa điền.
  3. Cập nhật câu mẫu mục `15. Khung chuẩn bị trước` như đề xuất ở mục C.1.

### 4. Ảnh hưởng của trình duyệt / thiết bị / mạng khi chấm tới Gemini API, Worker proxy & file BTC
- **Gemini API & Cloudflare Worker (`vibe-gemini-proxy.xclipse.workers.dev`):**
  - Nếu mạng phòng chấm chặn `*.workers.dev` hoặc kết nối chậm, app đã tự fallback sang **chế độ mô phỏng** (kèm nhãn `"Dữ liệu mô phỏng AI · Dữ liệu mẫu"`), không bị lỗi trắng trang hay treo UI. Tuy nhiên đội cần kiểm tra thử link trên mạng hội trường lúc `12:40–13:00`.
- **File BTC (`EP.importer`):**
  - Đọc CSV/XLSX hoàn toàn ở phía trình duyệt bằng `<input type="file">`, tương thích Chrome/Edge/Safari trên cả máy tính và điện thoại. Lúc `12:40–13:00` cần kiểm tra định dạng file mẫu BTC hay dùng (`.xlsx`, `.csv`) và thử nhập trên điện thoại.

---

## D. Danh sách việc đề xuất cập nhật trong skill `vibe-sprint`

*(Chỉ liệt kê để Claude/Nguyên duyệt, chưa tự sửa vào `nop-bai` hay code app)*

| File trong `skills/vibe-sprint/` | Nội dung đề xuất sửa |
|---|---|
| `references/00-the-le-chung-ket.md` | 1) Bổ sung 3 mốc lịch (`12:40–13:00`, `13:00–13:15`, `15:45–16:05`); 2) Ghi rõ quy định *"giao diện tiếng Việt"*, *"không yêu cầu đăng nhập cá nhân hoặc khóa bí mật"*, *"không trừ lặp 1 sự cố"*, *"khung khắc phục sự cố sau giờ nộp"*, xếp loại `< 60 Chưa đạt`. |
| `templates/README-du-thi.md` | 1) Thêm câu *"Không yêu cầu đăng nhập tài khoản cá nhân hay nhập API key"* vào mục 4/7; 2) Bổ sung câu giải trình `showPlayground: false` vào mục 15 `Khung chuẩn bị trước`. |
| `templates/CHECKLIST-CHUNG-KET.md` | Thêm 3 ô kiểm tra: (1) toàn bộ UI tiếng Việt, không sót chữ tiếng Anh; (2) mở ẩn danh dùng được ngay không đòi đăng nhập/key; (3) lúc 12:40–13:00 xác nhận kênh nộp bài BTC & test mạng phòng thi với `workers.dev`. |
| `templates/THE-DIEU-PHOI.md` | Thêm nhắc nhở ở mốc `12:40–13:00`: kiểm tra kênh nộp bài, định dạng ZIP tối đa, trình duyệt chấm của BTC và mạng phòng thi. |

---

## E. Rủi ro cần nhắc đội trước giờ thi
1. **Quên đặt `showPlayground: false` trong `js/config.js`:** sẽ làm lộ tab `Mô-đun` (ví dụ shop online) trên bản nộp chính thức -> dễ bị hỏi hoặc hiểu nhầm chuẩn bị sẵn chức năng.
2. **Sót nhãn tiếng Anh trên UI:** thể lệ yêu cầu rõ *"ứng dụng web, giao diện tiếng Việt"*.
3. **Sửa code hoặc push sau khi đã chụp minh chứng chốt (`nop-bai.mjs`):** làm lệch hash commit giữa bản demo, source ZIP và ảnh minh chứng (mất điểm phần *"source khớp demo"* — 3 điểm).
4. **Mạng hội trường chặn `*.workers.dev`:** cần kiểm tra lúc `12:40–13:00`; nếu chặn thì yên tâm đã có chế độ mô phỏng + copy prompt làm phương án dự phòng.
