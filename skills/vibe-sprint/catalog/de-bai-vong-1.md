# 10 đề bài chính thức — VIBE-CODING 2026 (vòng loại)

Nguồn: https://vibecoding.info.vn/de-bai (lấy ngày 13/11/2026). Phần "5 tính năng" là nguyên văn từ trang BTC.
Ghi chú chung: mỗi đội nhận 1 đề qua quay số; có thể trùng đề. Các đề khác Đề 8 đều cho phép AI mock nếu ghi chú rõ trong app và README. Bảng A: chỉ mock thì tối đa 4/15 ở nhóm "Tích hợp AI". Bảng B: mock minh bạch vẫn đạt 100.

Quy ước "MVP 45 phút": luồng cốt lõi chạy được trọn vẹn đủ 5 tính năng, dữ liệu mẫu có sẵn, AI có thể mock. Phần còn lại là polish.

---

## Đề 01 — Website & thương hiệu: AI tư vấn chọn gói Hosting / Domain

- **Bối cảnh / người dùng:** chủ shop online nhỏ, không rành kỹ thuật, cần chọn gói hosting/domain theo quy mô và ngân sách.
- **5 tính năng (verbatim):**
  1. Form nhập nhu cầu: loại website (bán hàng/giới thiệu/blog), lượng truy cập ước tính mỗi tháng, ngân sách, có cần mua kèm tên miền không.
  2. AI phân tích và gợi ý 01 gói phù hợp nhất + 02 gói thay thế, giải thích lý do bằng tiếng Việt đơn giản, dễ hiểu với người không rành kỹ thuật.
  3. Bảng so sánh 03 gói được gợi ý (giá, dung lượng, băng thông, tính năng nổi bật).
  4. Nút "Đăng ký tư vấn": mở form nhập tên + số điện thoại, lưu vào danh sách khách hàng (localStorage).
  5. Mục FAQ dạng accordion với 05 câu hỏi thường gặp về hosting/domain.
- **BTC giải thích thêm:** 03 gói do đội tự định nghĩa trong dữ liệu mẫu (tên, giá, thông số), có thể tham khảo nhà tài trợ. Form đăng ký chỉ lưu localStorage.
- **AI làm gì:** nhận bộ nhu cầu đã chuẩn hóa, chọn 1 gói + 2 gói thay thế, trả về JSON (id gói, lý do ngắn). Có thể làm rule-based (ngân sách + lượng truy cập → gói) và để AI chỉ viết lời giải thích.
- **Dữ liệu lưu:** `plans[]` (3 gói mẫu), `leads[]` (tên, SĐT, thời gian, gói được gợi ý), `faq[]` (5 câu).
- **Bẫy thường gặp:** AI chọn gói ngoài danh sách 3 gói (phải kiểm tra id trả về); SĐT sai định dạng; so sánh bảng không khớp dữ liệu gói; không ghi rõ gói là "dữ liệu mẫu".
- **MVP 45 phút:** form + rule chọn gói (ngân sách/traffic) → bảng 3 gói → nút tư vấn lưu localStorage → FAQ accordion; AI = mock câu giải thích.

## Đề 02 — Nội dung & chiến dịch: Trình tạo caption quảng cáo bằng AI

- **Bối cảnh / người dùng:** chủ shop và marketer cần nhiều nội dung đăng fanpage mỗi ngày.
- **5 tính năng (verbatim):**
  1. Form nhập: tên sản phẩm, mô tả ngắn, đối tượng khách hàng, tông giọng (hài hước / trang trọng / trẻ trung).
  2. AI sinh 03 caption + 03 headline + 05 hashtag phù hợp với đầu vào.
  3. Nút copy từng nội dung, nút "Tạo lại" để sinh bộ nội dung mới.
  4. Lịch sử các lần tạo (lưu localStorage): xem lại, xóa từng mục.
  5. Bộ đếm ký tự cho từng caption, cảnh báo khi vượt giới hạn chuẩn của Facebook/Instagram.
- **BTC giải thích thêm:** tông giọng chọn 1 trong 3 mức có sẵn. Ngưỡng cảnh báo do đội quy định và ghi rõ (ví dụ 2.200 ký tự Instagram).
- **AI làm gì:** trả JSON `{captions:[3], headlines:[3], hashtags:[5]}`; "Tạo lại" gọi lại với cùng input.
- **Dữ liệu lưu:** `history[]` (input + output + thời điểm), ngưỡng ký tự theo kênh.
- **Bẫy thường gặp:** AI trả thiếu/thừa số lượng (phải validate đếm); hashtag có dấu cách/ký tự đặc biệt; copy trên iOS Safari cần fallback; đếm ký tự emoji sai.
- **MVP 45 phút:** form → gọi AI (hoặc mock trả JSON cố định) → render 3+3+5 kèm nút copy → bộ đếm ký tự → history localStorage có xóa.

## Đề 03 — Tương tác & khách hàng: Minigame quiz thu lead cho fanpage

- **Bối cảnh / người dùng:** fanpage muốn tăng tương tác và thu số điện thoại khách.
- **5 tính năng (verbatim):**
  1. Trang tạo quiz: nhập 05 câu hỏi trắc nghiệm (mỗi câu 04 đáp án), hoặc nhờ AI gợi ý câu hỏi theo chủ đề cho trước.
  2. Trang chơi: hiển thị từng câu hỏi, đếm ngược 30 giây mỗi câu, tính điểm theo đáp án đúng và tốc độ trả lời.
  3. Màn hình kết quả + form nhập tên/số điện thoại để nhận quà (lưu localStorage).
  4. Bảng xếp hạng top 10 người chơi điểm cao nhất.
  5. Nút chia sẻ kết quả (copy nội dung để đăng Facebook).
- **BTC giải thích thêm:** "trang quản trị" và "trang chơi" là 2 màn hình trong cùng app, không đăng nhập. Hết 30 giây tự chuyển câu và tính là sai. AI gợi ý câu hỏi có thể nhập tay hoặc mock.
- **AI làm gì:** sinh 5 câu hỏi + 4 đáp án + đáp án đúng theo chủ đề, JSON có kiểm tra (đúng 1 đáp án đúng, không trùng).
- **Dữ liệu lưu:** `quiz` (5 câu), `players[]` (tên, SĐT, điểm, thời gian), leaderboard tính từ players.
- **Bẫy thường gặp:** timer không dừng khi chuyển trang / hết giờ bị chạy 2 lần; công thức điểm tốc độ (phải ghi rõ trong app); điểm bằng nhau khi xếp hạng; AI trả đáp án đúng không khớp index.
- **MVP 45 phút:** nhập 5 câu (hoặc preset) → màn chơi có timer 30s → tính điểm → form lead → bảng top 10. AI: nút "gợi ý" trả preset theo chủ đề.

## Đề 04 — Tương tác & khách hàng: Chatbot FAQ & đặt lịch tư vấn

- **Bối cảnh / người dùng:** doanh nghiệp nhỏ cần kênh trả lời khách 24/7 không đủ nhân sự trực.
- **5 tính năng (verbatim):**
  1. Khung chat trả lời 08–10 câu hỏi thường gặp từ bộ kiến thức có sẵn (dữ liệu mẫu do đội tự xây dựng).
  2. AI diễn đạt lại câu trả lời cho tự nhiên và gợi ý 03 câu hỏi liên quan sau mỗi lượt trả lời.
  3. Khi không trả lời được, chatbot chủ động đề xuất đặt lịch tư vấn với nhân viên.
  4. Form đặt lịch: chọn ngày/giờ, nhập tên + số điện thoại, lưu danh sách lịch hẹn (localStorage).
  5. Trang quản trị đơn giản: xem danh sách lịch hẹn đã đặt, xóa lịch đã xử lý.
- **BTC giải thích thêm:** bộ 08–10 câu hỏi do đội soạn, liệt kê trong README. "AI diễn đạt lại" được phép mock có chú thích. Trang quản trị không cần đăng nhập.
- **AI làm gì:** (a) diễn đạt lại đáp án từ KB; (b) sinh 3 câu gợi ý liên quan; (c) có thể phân loại ý định để quyết định "không trả lời được".
- **Dữ liệu lưu:** `faq[]` (8–10 câu + keywords), `chat[]` (tùy chọn), `bookings[]`.
- **Bẫy thường gặp:** khớp câu hỏi bằng từ khóa không bỏ dấu tiếng Việt (phải chuẩn hóa); bot "bịa" khi KB không có câu trả lời; đặt lịch quá khứ hoặc trùng khung giờ; trang quản trị lộ ra ngoài không cảnh báo.
- **MVP 45 phút:** KB 8 câu + match từ khóa (có bỏ dấu) → bong bóng chat → fallback "Đặt lịch" → form lịch lưu localStorage → trang admin liệt kê và xóa. AI: diễn đạt lại = mock thay đổi câu chào.

## Đề 05 — Website & thương hiệu: Kiểm tra nhanh phân tích website

- **Bối cảnh / người dùng:** doanh nghiệp nhỏ muốn biết website của mình có chuẩn marketing không.
- **5 tính năng (verbatim):**
  1. Nhập URL website → kiểm tra tự động các yếu tố cơ bản phía client (có thẻ title, meta description, viewport mobile, favicon hay không…).
  2. Hiển thị điểm số /100 kèm checklist từng hạng mục đạt/chưa đạt.
  3. AI nhận xét bằng tiếng Việt: 03 điểm mạnh và 03 điểm cần cải thiện của website.
  4. Nút xuất báo cáo dạng text để copy gửi khách hàng.
  5. Lịch sử các website đã kiểm tra (lưu localStorage), xem lại/xóa.
- **BTC giải thích thêm:** chỉ kiểm tra những gì làm được phía trình duyệt. Vì CORS, đội chọn 1 trong 3 cách và ghi trong README: (a) fetch trực tiếp (ghi rõ hạn chế), (b) người dùng dán HTML để phân tích, (c) phân tích website mẫu có sẵn. Thang điểm và trọng số do đội công bố trong app.
- **AI làm gì:** nhận bảng kết quả checklist (JSON) và sinh 3 điểm mạnh + 3 điểm cần cải thiện; không cần AI để chấm điểm (rule).
- **Dữ liệu lưu:** `checks[]` (url, HTML hoặc kết quả, điểm, checklist, thời điểm), `weights` (trọng số công bố).
- **Bẫy thường gặp:** fetch URL ngoài bị CORS (cần chọn cách b hoặc c và nói rõ); đọc title/meta bằng regex thay vì DOMParser; điểm không cộng đúng 100; quên `viewport` và `favicon` khi dán HTML.
- **MVP 45 phút:** ô dán HTML (cách b) → DOMParser kiểm tra 6–8 mục → điểm /100 có trọng số → checklist → nút copy báo cáo text → lịch sử localStorage. AI = mock 3+3 nhận xét theo mục chưa đạt.
- **Lưu ý:** `docs/vibecoding-tong-hop-bai-viet.md` ghi Đề 5 là công cụ chấm điểm URL; phần "checklist trước xuất bản" cho trang của chính mình thuộc sản phẩm nhóm mình (Đề 8 / repo), nên tránh để hai thứ lẫn lộn trong README và demo.

## Đề 06 — Nội dung & chiến dịch: Trình tạo email marketing bằng AI

- **Bối cảnh / người dùng:** marketer, chủ shop cần soạn email chiến dịch nhanh.
- **5 tính năng (verbatim):**
  1. Form nhập: mục tiêu chiến dịch (ra mắt sản phẩm / khuyến mãi / chăm sóc khách hàng), tên thương hiệu, nội dung ưu đãi.
  2. AI viết 03 mẫu email, mỗi mẫu gồm: subject line + nội dung + nút kêu gọi hành động (CTA).
  3. Khung preview hiển thị email như trong hộp thư thật.
  4. Nút copy từng mẫu, nút "Viết lại theo tông khác" (trang trọng/hài hước/khẩn cấp).
  5. AI gợi ý thời điểm gửi tốt nhất theo ngành hàng đã nhập.
- **BTC giải thích thêm:** 03 mẫu phải khác nhau rõ rệt về cách viết. "Viết lại" đổi sang đúng 1 trong 3 tông cho trước. Preview chỉ cần khung thư đơn giản.
- **AI làm gì:** trả JSON 3 email có cấu trúc `{subject, body, cta}`; viết lại theo tông; gợi ý giờ gửi (có thể là bảng rule theo ngành).
- **Dữ liệu lưu:** `campaigns[]` (input + 3 mẫu), tông giọng, bảng giờ gửi theo ngành.
- **Bẫy thường gặp:** 3 mẫu na ná nhau (kiểm tra độ khác nhau, ví dụ so khớp cấu trúc câu mở đầu); subject quá dài; preview vỡ trên mobile; "viết lại" làm mất CTA.
- **MVP 45 phút:** form → mock/AI trả 3 mẫu có cấu trúc → preview khung thư → copy từng mẫu → nút đổi tông (tái sinh từ mẫu gốc) → bảng giờ gửi theo ngành.

## Đề 07 — Dữ liệu & hiệu quả: Dashboard KPI chiến dịch mini

- **Bối cảnh / người dùng:** marketer theo dõi quảng cáo hằng ngày, không rành Excel.
- **5 tính năng (verbatim):**
  1. Form nhập số liệu theo ngày: reach, click, chi phí, số đơn hàng (cho phép nhập nhiều dòng, lưu localStorage).
  2. Vẽ biểu đồ đường/cột thể hiện reach, chi phí, đơn hàng theo ngày.
  3. Tự động tính các chỉ số: CTR, CPC, chi phí trên mỗi đơn hàng.
  4. AI nhận xét xu hướng (tăng/giảm) và đưa 03 gợi ý cải thiện chiến dịch.
  5. Nút xuất báo cáo tóm tắt dạng text để copy gửi sếp/khách hàng.
- **BTC giải thích thêm:** số liệu nhập tay, không cần API quảng cáo. Công thức do đội định nghĩa và ghi trong app/README (ví dụ CTR = click / reach). Được dùng thư viện vẽ biểu đồ (ví dụ Chart.js).
- **AI làm gì:** nhận bảng tổng hợp (đã tính sẵn bằng code) và trả xu hướng + 3 gợi ý. Không để AI tự tính số.
- **Dữ liệu lưu:** `rows[]` (ngày, reach, click, cost, orders), công thức ghi trong README.
- **Bẫy thường gặp:** chia cho 0 (reach = 0, đơn = 0); nhập nhiều dòng cùng ngày (cần gộp hay cảnh báo trùng); định dạng tiền VND; ngày không sắp xếp làm biểu đồ sai.
- **MVP 45 phút:** bảng nhập nhiều dòng → hàm metric an toàn chia 0 → biểu đồ đường (Chart.js hoặc SVG có sẵn) → card CTR/CPC/CPA → AI mock xu hướng → copy báo cáo text.

## Đề 08 — Website & thương hiệu: Tạo landing page sự kiện trong 5 phút

- **Bối cảnh / người dùng:** marketer tổ chức workshop/sự kiện, cần landing page nhanh không nhờ designer.
- **5 tính năng (verbatim):**
  1. Form nhập: tên sự kiện, thời gian, địa điểm, diễn giả, ưu đãi đăng ký sớm.
  2. AI sinh headline, đoạn mô tả và 03 bullet lợi ích khi tham dự.
  3. Render landing page hoàn chỉnh: phần hero, đếm ngược đến giờ G, chương trình (agenda), form đăng ký.
  4. Form đăng ký lưu danh sách (localStorage) và hiển thị số người đã đăng ký theo thời gian thực trên trang.
  5. Nút "Tạo trang mới" để làm lại từ đầu với sự kiện khác.
- **BTC giải thích thêm:** landing hiển thị ngay trong app (dưới form hoặc trang xem trước), không cần URL riêng. Sự kiện đã qua → "Sự kiện đã diễn ra", không đếm ngược số âm. Danh sách đăng ký hiển thị công khai số người trên trang.
- **Quy tắc nghiệp vụ trong buổi đào tạo (tài liệu `docs/tieu-chi-cham-thi.md`):** tên trống/email sai/SĐT sai → cảnh báo; bấm 2 lần chỉ ghi nhận 1; API key nhập ô riêng, hiện dạng ***.
- **AI làm gì:** headline + mô tả + 3 bullet từ thông tin đã nhập; không bịa số liệu. Repo đã có sẵn bản mô phỏng offline (`js/content-generator.js`).
- **Dữ liệu lưu:** `events[]`, `registrations[]` (gắn eventId, chống trùng theo SĐT/email), trạng thái sự kiện tính theo thời gian hiện tại.
- **Bẫy thường gặp:** đếm ngược số âm; đăng ký trùng; timezone khi so thời gian; số người đăng ký không cập nhật khi mở ở tab khác (localStorage là per-máy, phải ghi giới hạn).
- **MVP 45 phút:** Đề này đã gần như có sẵn trong repo (event-status, registrations, validators, landing-renderer, content-generator). Việc còn lại: đối chiếu đủ 5 tính năng, kiểm tra các ca biên ở trên, README ghi rõ giới hạn localStorage.

## Đề 09 — Nội dung & chiến dịch: AI gợi ý ý tưởng chiến dịch marketing

- **Bối cảnh / người dùng:** người làm marketing bí ý tưởng, cần gợi ý theo ngân sách.
- **5 tính năng (verbatim):**
  1. Form nhập: ngành hàng, tên sản phẩm, mức ngân sách (03 mức: thấp/trung bình/cao), mục tiêu chiến dịch.
  2. AI đề xuất 05 ý tưởng chiến dịch, mỗi ý tưởng gồm: tên chiến dịch, kênh triển khai, nội dung chính.
  3. Mỗi ý tưởng kèm timeline triển khai 04 tuần tóm tắt.
  4. Nút "Lưu vào shortlist" cho từng ý tưởng yêu thích.
  5. Trang shortlist: xem lại các ý tưởng đã lưu, xóa, copy tóm tắt để gửi team.
- **BTC giải thích thêm:** 3 mức ngân sách là lựa chọn có sẵn, đội tự định nghĩa khoảng tiền minh họa. Timeline dạng danh sách tuần 1–4, không cần Gantt. Shortlist lưu localStorage.
- **AI làm gì:** trả JSON `{ideas:[5 × {name, channel, content, weeks:[4]}]}`; validate đủ 5 mục và 4 tuần.
- **Dữ liệu lưu:** `shortlist[]` (idea + thời điểm lưu), bảng khoảng ngân sách theo mức.
- **Bẫy thường gặp:** AI trả 4 hoặc 6 ý tưởng; kênh không khớp ngành; ý tưởng trùng nhau; lưu trùng cùng một ý tưởng khi bấm nhiều lần.
- **MVP 45 phút:** form (select 3 mức) → mock 5 ý tưởng cố định theo ngành → card có timeline 4 tuần → lưu shortlist localStorage → trang shortlist có xóa và copy text.

## Đề 10 — Website & thương hiệu: Kiểm tra & gợi ý tên thương hiệu + tên miền

- **Bối cảnh / người dùng:** người khởi nghiệp online đặt tên thương hiệu và chọn tên miền.
- **5 tính năng (verbatim):**
  1. Nhập tên thương hiệu mong muốn.
  2. AI đánh giá: độ dễ nhớ, độ dễ đọc/phát âm, và gợi ý 05 biến thể tên miền (.com/.vn/.shop…).
  3. Kiểm tra tình trạng tên miền ở chế độ demo (mock theo quy tắc đơn giản, ghi rõ "kết quả demo").
  4. AI gợi ý 03 slogan và 01 câu tagline cho thương hiệu.
  5. Nút copy toàn bộ thông tin + nút kêu gọi hành động "Đăng ký tên miền" dẫn về trang nhà tài trợ.
- **BTC giải thích thêm:** kết quả kiểm tra tên miền là mô phỏng và BẮT BUỘC ghi "kết quả demo, không phải dữ liệu thật". Link đăng ký dùng link BTC cung cấp, nếu chưa có thì link demo + ghi README.
- **AI làm gì:** đánh giá (điểm dễ nhớ, dễ đọc) + biến thể tên miền + slogan/tagline; không được dùng AI để nói tên miền "còn trống" thật.
- **Dữ liệu lưu:** `lastCheck` (tên, kết quả demo), link nhà tài trợ trong cấu hình.
- **Bẫy thường gặp:** quên nhãn "demo" (bị trừ điểm chính xác nghiệp vụ); tên có dấu/khoảng trắng chuyển thành domain không hợp lệ; biến thể có ký tự không hợp lệ; nút CTA mở link sai.
- **MVP 45 phút:** input tên → chuẩn hóa thành slug → mock đánh giá + 5 biến thể (.com/.vn/.shop) → kiểm tra demo có nhãn → 3 slogan + 1 tagline → nút copy + CTA.

---

## Điểm chung cần tránh ở mọi đề

- Đừng làm thêm tính năng ngoài 5 tính năng (BTC nhấn mạnh giữ phạm vi); luồng chính chạy trọn trước.
- Mọi kết quả AI được validate (số lượng, định dạng) trước khi hiển thị; có nhãn "AI" hoặc "mock/demo".
- Dữ liệu localStorage: wrap try/catch, ghi giới hạn trong README.
- Giao diện dùng được trên điện thoại (Bảng A có 5 điểm, Bảng B có 10 điểm cho giao diện).
