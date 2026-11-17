# Tổng hợp: Thủ thuật Tối ưu SEO & Tổng quan Thương mại Điện tử

> **Nguồn tài liệu**:
> - **Phần I**: *Thủ thuật tối ưu SEO* (`TAI_LIEU_THAM_KHAO.pdf`)
> - **Phần II**: *Giáo trình Tổng quan Thương mại điện tử* (`8._Gi_o_tr_nh_T_ng_quan_th_ng_m_i_i_n_t_.pdf` — Richard T. Watson, Pierre Berthon, Leyland F. Pitt, George M. Zinkhan; Đại học FPT biên dịch)

---

# PHẦN I: SEO & TỐI ƯU WEBSITE THỰC CHIẾN

## 1. Tối ưu Thẻ Meta Title & Meta Description

### 1.1. Thẻ Meta Title (`<title>`)
Thẻ tiêu đề là thông tin quan trọng nhất Googlebot thu thập, hiển thị tại: (1) thanh trên cùng của trình duyệt, (2) dòng đầu tiên của mỗi kết quả trên SERPs, (3) văn bản mặc định khi đánh dấu trang (bookmark).

| Quy tắc tối ưu chuẩn | Lỗi cần tránh |
| :--- | :--- |
| Đặt **từ khóa quan trọng nhất ở đầu** tiêu đề | Để trống hoặc mặc định `"Tài liệu không tên"` |
| Độ dài **tối đa 65 ký tự** | Dùng **cùng một thẻ title** cho mọi trang |
| Viết hoa chữ cái đầu như tiêu đề sách | Nhồi nhét từ khóa thành chuỗi vô nghĩa |
| Dùng dấu gạch đứng (`\|`) phân cách các cụm từ | Viết kiểu lời rao hàng phản cảm |
| Mỗi trang có một thẻ title riêng, khớp nội dung trang | Lãng phí không gian bằng từ thừa |

**Ví dụ chuẩn về Title mang giá trị thương hiệu**:
- ❌ Kém (nhồi nhét): `<title>Vietnam Travel, Vietnam travel package, vietnam travel guide, vietnam travel deals...</title>`
- ✅ Chuẩn (thu hút click & thương hiệu): `<title>Vietnam Travel Packages with xxx.com.vn</title>`

### 1.2. Thẻ Meta Description & Google Snippet
- **Snippet** là đoạn trích dẫn ngắn dưới tiêu đề trên SERPs (từ khóa tìm kiếm được in đậm).
- Meta Description **không ảnh hưởng trực tiếp** đến thứ hạng tìm kiếm, nhưng **quyết định trực tiếp tỷ lệ nhấp chuột (CTR)**, qua đó tác động gián tiếp đến thứ hạng và traffic.
- Cú pháp: `<meta name="Description" content="informative description here" />`

**Nguyên tắc viết Meta Description chất lượng**:
1. **Duy nhất cho mỗi trang**: Không dùng mô tả trùng lặp trên nhiều URL. Tối thiểu phải viết riêng cho trang chủ và các trang quan trọng/phổ biến.
2. **Chứa thông tin cốt lõi có cấu trúc**: Không nhất thiết phải viết thành câu văn dài; có thể liệt kê thông tin giá trị như tác giả, ngày tháng, giá cả, độ dài, nhà sản xuất.
3. **Tự động hóa có kiểm soát**: Với site cơ sở dữ liệu lớn, có thể lập trình sinh mô tả tự động nhưng phải giàu ngữ nghĩa, tránh spam.
4. **Không nhồi nhét chuỗi từ khóa**: Google sẽ bỏ qua thẻ meta description nếu chỉ chứa hàng dãy từ khóa.

**Ví dụ chuẩn**:
- ❌ Kém (trùng lặp, thiếu dấu cách, khó đọc):
  `<meta name="Description" content="[tên miền]: Search Engine Optimization For Dummies (2nd edition): Books: Nam Nguyen, Peter Kent by Peter Kent, Nam Nguyen" />`
- ✅ Chuẩn (ngắn gọn, tách bạch, giàu thông tin):
  `<meta name="Description" content="Author: Peter Kent, Illustrator: Nam Nguyen, Category: Computer, Price: ..., Length: 400 pages" />`

### 1.3. Thẻ Meta Keywords
- Các máy tìm kiếm lớn (Google, Yahoo, Bing) **không còn dựa vào thẻ Meta Keywords** để xếp hạng vì bị spam quá mức. Một số máy tìm kiếm chỉ dùng với trọng số rất thấp.
- **Khuyến nghị**: Chỉ đặt vài từ khóa chính vào thẻ này rồi bỏ qua; tập trung tối ưu từ khóa vào `<title>`, URL và nội dung hiển thị cho người dùng.

---

## 2. Nghiên cứu & Tối ưu Hóa Từ Khóa (Keyword)

### 2.1. Quy trình 3 bước chọn từ khóa tốt
1. **Xác định sự liên quan**: Nghiên cứu sản phẩm/dịch vụ cốt lõi và dùng **Google Analytics** để xem chủ đề người dùng quan tâm nhất trên site.
2. **Lập danh sách từ khóa tiềm năng**: Định hướng nội dung theo từ khóa, phân bổ tự nhiên (tránh mật độ quá dày gây phạt spam).
3. **Chọn từ khóa chủ đạo**: Kết hợp công cụ gợi ý để chọn từ khóa có lượng tìm kiếm và khả năng cạnh tranh phù hợp.

### 2.2. 2 công cụ tìm từ khóa đơn giản
- **Google Search Box (Autocomplete)**: Gõ từ khóa dự định vào ô tìm kiếm để xem danh sách gợi ý dựa trên tần suất tìm kiếm thực tế của người dùng; click sâu vào từng gợi ý để kiểm tra mức độ cạnh tranh.
- **Google AdWords (Keyword Tool)**: Lấy danh sách từ khóa mở rộng, lượng tìm kiếm và gợi ý liên quan.

### 2.3. Chiến lược từ khóa Long-tail (Đuôi dài)
- Với thị trường cạnh tranh cao, từ khóa ngắn (1–3 từ, VD: `"email software"`) rất khó giữ top bền vững và tốn kém.
- **Giải pháp**: Đánh vào cụm từ khóa **Long-tail (từ 4–5 từ trở lên)** cụ thể hơn (VD: `"Email marketing software solution"`, `"Software for permission-based email marketing"`), viết cả dạng **số ít và số nhiều**.
- **Triển khai**: Viết bài 500–1.000 từ cho mỗi từ khóa long-tail, chèn link với anchor text là chính cụm từ khóa đó (trong thân bài hoặc Resource box), sau đó đăng lên các danh mục bài viết (article directories) và danh bạ web (directory submission).

---

## 3. Tối ưu On-page, Kỹ thuật & Cấu trúc Nội liên kết (Internal Link)

### 3.1. 7 bước tối ưu Cấu trúc Nội liên kết (Internal Link)
Sức mạnh liên kết (link juice) từ trang chủ được chia đều cho các trang được trỏ tới (trỏ 10 trang thì mỗi trang nhận 1/10, trỏ 50 trang chỉ nhận 1/50), đồng thời phụ thuộc vào vị trí đặt link và thẻ định dạng (`<h1>`–`<h3>`, `<b>`, `<strong>`, `<em>`).

1. **Liên kết trực tiếp từ trang chủ**: Các trang quan trọng nhất phải đến được từ trang chủ với ít cú click chuột nhất.
2. **Liên kết chéo giữa các trang con**: Trỏ link từ các bài viết/trang khác trong site về trang muốn đẩy top.
3. **Dùng từ khóa mục tiêu làm Anchor Text**: Giúp máy tìm kiếm hiểu chủ đề trang đích (tuyệt đối tránh `"Click here"`).
4. **Dùng đường dẫn URL tuyệt đối**: Luôn dùng `http://www.website.com/trangchu.html` thay vì `/trangchu.html` để khi bị scraper copy nội dung, bạn tự động nhận được backlink trỏ về.
5. **Gắn `rel="nofollow"` cho trang không quan trọng**: Áp dụng cho trang nội quy, điều khoản, phiên bản in, trang trùng lặp để không thất thoát sức mạnh liên kết.
6. **Dùng `robots.txt` hoặc thẻ `meta robots`**: Chặn bọ tìm kiếm đánh chỉ số trang trùng lặp/không liên quan, tiết kiệm tài nguyên crawl cho trang chính.
7. **Kiểm tra và xử lý lỗi 404**: Chuyển hướng trang 404 về các trang phổ biến/quan trọng và đặt hộp tìm kiếm ngay trên trang 404.

### 3.2. Kỹ thuật chuyển đổi tên miền giữ nguyên Traffic & Ranking
1. **Trỏ DNS**: Trỏ tên miền mới về cùng thư mục chứa dữ liệu với tên miền cũ.
2. **Cấu hình Redirect 301 trong `.htaccess`** (server Linux + `mod_rewrite`) — *bắt buộc dùng 301 (Permanent), không dùng 302*:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ http://www.domainmoi.com/ [R=301,L]
   ```
   *(Lưu bản sao `.htaccessbackup` trước khi sửa).*
3. **Khai báo trong Google Webmaster Tools**: Add cả 2 tên miền vào cùng một tài khoản → vào tên miền cũ → **Site Configuration → Change of Address** → chọn tên miền mới và **Submit**.

### 3.3. Checklist 50 bước SEO chuẩn cho Website Việt (Trích lọc kỹ thuật cốt lõi)
| Nhóm tối ưu | Các thao tác kỹ thuật bắt buộc |
| :--- | :--- |
| **Tên miền & Điều hướng** | • Dùng `.htaccess` Redirect 301 từ `non-www` sang `www` (hoặc ngược lại thống nhất)<br>• Gia hạn tên miền **trên 5 năm**<br>• Mua thêm `.net`, `.org`, `.biz` và redirect về site chính<br>• Click vào Logo phải dẫn về trang chủ; thanh navigation rõ ràng; có trang Sitemap & link ở footer |
| **URL & Mã nguồn** | • Rewrite URL dùng dấu gạch ngang **`-`** thay cho dấu gạch dưới **`_`**<br>• Đảm bảo mọi URL đều chuẩn **canonical**, **không chứa Session ID** (dùng cookie thay thế)<br>• Kiểm tra lỗi HTML bằng **W3C Validator** (`validator.w3.org`)<br>• Tách riêng **CSS** và **JavaScript** ra file ngoài; loại bỏ `<iframe>`, popup, Flash (thay bằng GIF), nhạc/video tự chạy |
| **Nội dung & Hình ảnh** | • Cỡ chữ tiêu chuẩn (không quá nhỏ), kiểm tra lỗi chính tả, cập nhật thường xuyên<br>• Mỗi trang có ít nhất 1 ảnh kèm thẻ **`alt`** mô tả từ khóa; đặt `label=""` cho các form<br>• Trang `About` rõ thông tin liên hệ, chèn Google Maps; có trang `FAQ/Support`, `Điều khoản`, copyright ở footer; dùng email theo tên miền (`support@domain.com`) |
| **Theo dõi & Chia sẻ** | • Gắn mã thống kê (Google Analytics) trên mọi trang<br>• Chèn nút Social Bookmarking/mạng xã hội dưới bài viết<br>• Tạo `favicon.ico` riêng và hộp tìm kiếm nội bộ (đặc biệt trên trang 404) |

---

## 4. Tối ưu Tốc độ Tải trang & Tỷ lệ Chuyển đổi (CRO)

### 4.1. 5 công cụ kiểm tra tốc độ tải trang (Page Speed)
1. **Pingdom Tool (Full page check)**: Tải toàn bộ cấu trúc HTML và objects (ảnh, JS, Flash, RSS, iframe), thống kê thời gian load, tốc độ, số lượng và dung lượng từng object.
2. **Google Page Speed** *(kết hợp Firebug trên Firefox)*: Kiểm tra cấu hình server và code front-end, chấm điểm và đề xuất tối ưu.
3. **Webpagetest.org**: Công cụ trực tuyến hỗ trợ kiểm tra từ server US, UK, New Zealand.
4. **WebsiteOptimiser.com**: Thống kê tiết kiệm băng thông qua nén dữ liệu, cảnh báo kích thước ảnh/JS/Flash làm chậm trang.
5. **Google Webmaster Tools**: Cung cấp biểu đồ thời gian phản hồi của server giúp phát hiện thời điểm quá tải để nâng cấp hosting/server.

### 4.2. Tỷ lệ nhấp chuột (CTR) & Tối ưu Chuyển đổi (Conversion Rate)
- **CTR trên SERPs**: Lượt click tập trung chủ yếu ở **5 kết quả đầu tiên** (vị trí đầu trang 2 — hạng 11 — thường có CTR cao hơn các vị trí cuối trang 1). Nếu một trang ở vị trí thấp (VD: hạng 6) nhận CTR cao bất thường nhờ Title và Meta Description hấp dẫn, Google có xu hướng đẩy trang đó lên cao hơn.
- **4 phương pháp tăng tỷ lệ chuyển đổi trên Website**:
  1. **Dùng Google Analytics tìm "điểm chết"**: Theo dõi thời gian ở lại trang (Time on page) trên các landing page quan trọng; trang nào người dùng thoát nhanh thì bổ sung đồ họa hoặc viết lại nội dung.
  2. **Dùng hình ảnh & video minh họa**: Người dùng thường lướt tiêu đề, ít đọc kỹ toàn văn; hình/video giúp tăng sức hút và truyền tải nhanh.
  3. **Đặt phần quảng bá (CTA) đúng nhịp đọc**: Tốc độ đọc trung bình là **200 từ/phút** → nên đặt khối lăng xê/CTA sau mỗi khoảng **400 từ** (hoặc cuối bài) một cách tinh tế, tránh nhồi nhét gây phản cảm.
  4. **Đơn giản hóa module hướng người dùng**: Ưu tiên thông tin sản phẩm ngắn gọn, chính xác và nút liên hệ dễ thấy, bỏ bớt hiệu ứng rườm rà.

---

## 5. Xây dựng Liên kết (Off-page SEO & Backlink)

### 5.1. Nguyên tắc vàng về Backlink & Anchor Text
- **PageRank (thang 0–10, logarithmic)**: Mỗi backlink là một phiếu bầu; giá trị phiếu bầu phụ thuộc vào độ uy tín/PageRank của trang nguồn và sự liên quan về chủ đề.
- **Quy tắc Anchor Text**:
  - Là một trong 2 yếu tố xếp hạng quan trọng nhất (giúp trang lên top ngay cả khi từ khóa ít xuất hiện trên trang đích).
  - **Phải đa dạng hóa Anchor Text**: Không đặt 100% link text giống hệt nhau trên mọi trang (dễ bị coi là không tự nhiên); cần thêm/bớt từ, đảo vị trí, kết hợp từ khóa phụ.
- **Liên kết sâu (Deep Linking)**: Không chỉ trỏ link về trang chủ (domain cấp cao) mà phải trỏ về các bài viết/trang con bên trong. Giúp Google index sâu, điều hướng người đọc và phát hiện/chống lại *Scraper* (kẻ copy bài qua RSS) nhờ pingback và backlink tự động trỏ về.

### 5.2. 15 thủ thuật xây dựng liên kết cho Website mới
1. Submit thủ công vào **Web Directories** chất lượng (tránh phần mềm tự động).
2. Gửi **thông cáo báo chí (Press Release)** lên các trang PR (VD: PRWeb, PRLeap).
3. **Trao đổi liên kết tương hỗ** có chọn lọc với site cùng chủ đề (liên hệ qua email/diễn đàn).
4. Tạo trang vệ tinh trên **Squidoo Lenses, HubPages** (chèn anchor text trong nội dung phong phú).
5. Đăng ký bài viết/tiêu đề lên **Article Directories** (xếp hạng theo Alexa/PR).
6. Tạo **Social Media Profiles** đồng bộ tên thương hiệu & avatar, chèn link trên profile.
7. Dùng **Social Bookmarking** (Digg, Netscape; tại VN: LinkHay, TagVN, VietKicks) để được bot crawl nhanh.
8. Đặt **chữ ký diễn đàn** trỏ về trang chủ/trang con kết hợp đóng góp bài viết giá trị.
9. Thiết kế **giao diện/Widget miễn phí** gắn link nguồn để thu hút backlink tự nhiên.
10. Lập **hệ thống blog phụ** trên WordPress.com, Blogger, Xanga trỏ về bài viết cụ thể.
11. **Comment giá trị trên blog cùng chủ đề** (xây dựng quan hệ, tuyệt đối không spam từ khóa).
12. **Guest Post (đăng bài lên blog khác)** có kèm link về site mình.
13. **Tổ chức cuộc thi / Giveaway** để blogger đặt anchor text link tham gia.
14. **Hợp tác hỗ trợ dự án** với đối tác tiềm năng để trao đổi liên kết.
15. **Chia sẻ kinh nghiệm chuyên môn** (thiết kế web, viết bài, SEO) cho các webmaster khác để nhận lại niềm tin và liên kết.

### 5.3. So sánh 6 mô hình xây dựng hệ thống Backlink (Link Structures)
| Mô hình | Cấu trúc liên kết | Đặc điểm & Khuyến nghị sử dụng |
| :--- | :--- | :--- |
| **Link Star (Liên kết sao)** | Các site vệ tinh trỏ **trực tiếp** về site mục tiêu Z (không liên kết chéo với nhau). | Dễ làm nhất, truyền **link juice mạnh và hiệu quả nhất**. **Khuyên dùng** khi vệ tinh sạch, không spam và có backlink riêng. |
| **Link Wheel (Bánh xe)** | Vệ tinh nối thành vòng tròn khép kín (A→B→C...→A) và mỗi vệ tinh trỏ 1 link về Z. | Các vệ tinh hỗ trợ index lẫn nhau; phù hợp khi vệ tinh sạch nhưng chưa có backlink riêng. |
| **Double Link Wheel** | Giống Link Wheel nhưng mỗi vệ tinh nối tới cả vệ tinh **trước và sau** nó, cùng trỏ về Z. | Mạng lưới dày đặc hơn, tăng cường sức mạnh nội bộ cho vòng vệ tinh trước khi đẩy về Z. |
| **Link Chain (Chuỗi liên kết)** | Vệ tinh nối nối tiếp nhau (A→B→C...), không khép kín vòng tròn; vệ tinh cuối chỉ trỏ về Z. | Biến thể của Link Wheel, giảm dấu hiệu vòng tròn khép kín nhân tạo. |
| **Link Web (Mạng nhện)** | Mạng liên kết mở: mọi vệ tinh liên kết tự do với Z và với các vệ tinh khác. | Tăng sức mạnh đồng đều cho nhiều nút giao, phù hợp mạng lưới nội dung lớn. |
| **Link Pyramid (Kim tự tháp)** | Tầng dưới (nhiều link yếu/spam) trỏ lên tầng trên (ít site chất lượng), tầng 1 trỏ về Z (VD: 1-1-n). | Mất nhiều thời gian, **ít truyền link juice** về Z. Chỉ dùng khi cần **cách ly backlink spam** khỏi site chính. |

### 5.4. Mạng liên kết tự sở hữu (Interlinking) & Trao đổi liên kết
- **Interlinking** (liên kết giữa các site cùng chủ sở hữu): Tự nhiên nếu số lượng site không quá lớn (Matt Cutts khuyến cáo dưới 2.000 sites), không trỏ hàng loạt cùng một thời điểm, không đặt chung IP bị blacklist, và mỗi site vẫn có nguồn backlink tự nhiên khác. Nên nhóm liên kết theo chủ đề/sản phẩm hoặc đặt trong trang riêng như `"Các sản phẩm/dịch vụ khác"`.
- **Trao đổi tương hỗ (Reciprocal Linking)**: Tránh trao đổi dày đặc cùng ngày, tránh trao đổi với site mới hoặc khác chủ đề, và không để site chỉ toàn link trao đổi.

---

## 6. Những sai lầm, Kỹ thuật Cấm kỵ (Black Hat) & Cách gỡ Blacklist

### 6.1. Các kỹ thuật Black Hat & Lỗi SEO cần tránh tuyệt đối
1. **Hidden Text & Hidden Links**: Chèn từ khóa font siêu nhỏ, trùng màu nền, đẩy ra ngoài màn hình hoặc dùng CSS/HTML giấu chữ → dễ bị phạt nặng hoặc xóa khỏi chỉ mục.
2. **Cloaking**: Hiển thị nội dung khác cho Googlebot so với người dùng thật → bị phát hiện và cấm vĩnh viễn.
3. **Doorway Pages & Nội dung trùng lặp (Duplicate Content)**: Tạo nhiều trang giống nhau để câu traffic, hoặc để cùng 1 bài xuất hiện ở nhiều URL (RSS, category, archive, bản in) gây lãng phí băng thông crawl.
4. **Tham gia Link Farms / FFA (Free For All) / Mua bán liên kết lộ liễu**: Google phát hiện qua từ khóa gần link (`"quảng cáo"`, `"tài trợ"`), đội ngũ kiểm duyệt thủ công và báo cáo từ đối thủ. Cả bên bán và bên mua đều có thể bị tụt PageRank hoặc cấm site.
5. **Session ID trong URL**: Khiến bot rơi vào vòng lặp vô tận và coi mỗi phiên là một trang trùng lặp → phải dùng Cookie.
6. **Thiết kế toàn bộ bằng Flash hoặc lạm dụng JavaScript**: Bot đọc văn bản kém, khó index.
7. **Lạm dụng phần mềm tự động** submit hàng loạt lên 2.000+ công cụ tìm kiếm (99% người dùng chỉ dùng Google, Yahoo, Bing).
8. **5 ảo tưởng sai lầm về SEO**: Tin kết quả lên top trong 24 giờ; nghĩ top 1 là mãi mãi không cần cập nhật; thần thánh hóa thẻ `<meta>`; kỳ vọng đăng ký lên hàng nghìn SE nhỏ; ưu tiên số lượng link hơn sự phù hợp nội dung.

### 6.2. Cách đưa Website ra khỏi Blacklist của Google
- **Dấu hiệu**: Tìm `site:tendomain.com` trên Google không ra kết quả dù đã hoạt động lâu và đã submit sitemap.
- **Quy trình khắc phục**:
  1. Dừng ngay mọi thủ thuật mũ đen (cloaking, link farm, doorway, spam).
  2. Xây dựng thêm backlink chất lượng bằng cách submit vào các danh bạ uy tín (Yahoo, DMOZ...).
  3. Tạo tài khoản **Google Webmaster Tools**, xác minh (verify) quyền sở hữu và gửi lại `sitemap.xml` + `robots.txt`.
  4. Gửi **Reinclusion Request** (yêu cầu xem xét lại) trình bày rõ quá trình phát triển sạch của website (nếu là domain mua lại/backorder, giải thích rõ nguồn gốc mua lại để được duyệt index lại sau khoảng 2 tuần).

---
---

# PHẦN II: TỔNG QUAN THƯƠNG MẠI ĐIỆN TỬ

> *Lưu ý phạm vi tài liệu gốc*: Giáo trình *Tổng quan Thương mại điện tử* (Watson et al., ĐH FPT biên dịch) tiếp cận TMĐT theo **góc độ chiến lược kinh doanh và marketing điện tử** (tập trung vào B2B, B2C, hạ tầng mạng, bảo mật, thanh toán điện tử, chiến lược Web, I2M, phân phối/logistics, dịch vụ số, định giá và tác động xã hội). Các nội dung về mô hình C2C, B2G chi tiết hay hệ thống văn bản pháp luật TMĐT Việt Nam không nằm trong phạm vi giáo trình này (sách chỉ đề cập khía cạnh pháp lý về quyền riêng tư, bản quyền/sở hữu trí tuệ trên Web và quy định trách nhiệm thẻ tín dụng).

---

## 1. Bản chất, Chiến lược & Thách thức của Thương mại Điện tử

### 1.1. Định nghĩa & Phạm vi
- **Thương mại điện tử (TMĐT)** là việc sử dụng các mạng máy tính (đặc biệt là Internet) để nâng cao hiệu suất tổ chức (tăng lợi nhuận, mở rộng thị phần, cải thiện dịch vụ khách hàng, phân phối nhanh hơn).
- Không chỉ là đặt hàng qua danh mục online, TMĐT bao gồm **mọi tương tác và giao dịch điện tử** giữa doanh nghiệp với các bên liên quan: khách hàng, nhà cung ứng, cơ quan chính phủ, tổ chức tài chính, nhân viên và công chúng.

### 1.2. Ma trận đánh giá mức độ cần thiết hiện diện trên Internet
Doanh nghiệp quyết định mức độ đầu tư vào Web dựa trên 2 trục: **(1) Số lượng khách hàng truy cập Web** và **(2) Mức độ giàu thông tin của sản phẩm**.

| Lượng khách hàng trên Web \ Nội dung thông tin sản phẩm | Thông tin Thấp | Thông tin Cao |
| :--- | :--- | :--- |
| **Khách hàng Cao** | Đồ ăn & đồ uống (Cần hiện diện mức vừa/quảng bá) | **Hàng điện tử tiêu dùng** *(Phù hợp nhất — Bắt buộc đầu tư mạnh)* |
| **Khách hàng Thấp** | **Văn phòng phẩm** *(Ít đòi hỏi đầu tư website)* | Sản phẩm công nghiệp (Tập trung B2B, catalog kỹ thuật) |

### 1.3. 3 thách thức chiến lược & cách Internet giải quyết
1. **Rủi ro về nhu cầu (Demand Risk)**: Thị trường thu hẹp hoặc thay đổi nhanh (VD: máy tính cá nhân xóa sổ máy đánh chữ Smith-Corona).
   - *Giải pháp qua Ma trận tăng trưởng Ansoff trên Web*: **Thâm nhập thị trường** (bán tiện lợi hơn để giành thị phần), **Phát triển thị trường** (vượt rào cản địa lý ra toàn cầu, cá nhân hóa 1-1), **Phát triển sản phẩm** (cập nhật theo thời gian thực, thu phí nội dung số), **Đa dạng hóa** (mở dịch vụ tài chính/sản phẩm mới trên nền khách hàng sẵn có).
2. **Rủi ro đổi mới (Innovation Risk)**: Thất bại trong việc cải tiến kịp đối thủ trước áp lực dư thừa cung.
   - *Giải pháp*: Mở kênh giao tiếp liên tục với khách hàng qua email, diễn đàn góp ý tính năng mới, theo dõi nhóm thảo luận về sản phẩm.
3. **Rủi ro thiếu hiệu quả (Inefficiency Risk)**: Chi phí đơn vị cao hơn đối thủ.
   - *Giải pháp*: Số hóa phân phối thông tin (thay thư giấy/tổng đài bằng web & mục FAQ); dùng biểu mẫu tương tác để khách tự nhập dữ liệu đơn hàng và xử lý bất đồng bộ nhằm cân bằng nhân lực.

### 1.4. Miễn trung gian (Disintermediation) & Mạng lưới giá trị
- **Miễn trung gian**: Loại bỏ các khâu trung gian truyền thống (môi giới, đại lý) để nhà sản xuất bán trực tiếp cho người tiêu dùng. Đây không phải lựa chọn nhị nguyên (có/không) mà diễn ra chọn lọc tùy mắt xích trong chuỗi giá trị (dễ dẫn đến chiến lược kinh doanh lai — kết hợp cửa hàng vật lý và Web).
- **Ma trận đe dọa miễn trung gian** dựa trên 2 yếu tố:
  - **Luồng vật lý cao + Tài sản chuyên biệt lớn + Đa dạng luồng thông tin cao** (VD: Manheim Auctions đầu tư trung tâm cải tạo xe và xử lý thủ tục chuyển quyền sở hữu liên bang) → **Mối đe dọa thấp**.
  - **Quy mô nhỏ + Ít tài sản chuyên dụng + Đa dạng giao dịch thấp** (VD: đại lý bán lẻ ô tô truyền thống) → **Mối đe dọa rất cao**.

---

## 2. Hạ tầng Công nghệ, Mạng lưới & EDI

### 2.1. Giao thức Internet (TCP/IP) & Định danh
- **Chuyển mạch gói (Packet Switching)**: **TCP** chia thông điệp thành các gói tin đánh số, truyền qua mạng và ghép lại đúng thứ tự tại máy nhận (tối ưu chia sẻ băng thông hơn chuyển mạch kênh của điện thoại). **IP** thực hiện định tuyến động (dynamic routing) cho từng gói tin.
- **Địa chỉ IP & DNS**: Địa chỉ IP 32-bit gồm 4 nhóm số `0–255` (VD: `128.192.73.60`), được **DNS** (Domain Name Server) phân giải từ tên miền dễ nhớ.

### 2.2. Kiến trúc Hạ tầng TMĐT 5 tầng (từ dưới lên)
1. **Tầng 1 — Cơ sở hạ tầng thông tin quốc gia (NII)**: Mạng viễn thông, cáp, di động, Internet làm đường truyền vật lý.
2. **Tầng 2 — Cơ sở hạ tầng phân phối thông điệp**: Phần mềm gửi/nhận thông điệp không định dạng (Email) và có định dạng (EDI, HTTP).
3. **Tầng 3 — Cơ sở hạ tầng xuất bản điện tử**: Nội dung Web dựa trên 3 trụ cột: **URL** (định vị tài nguyên), **Giao thức mạng (HTTP)**, và **Ngôn ngữ đánh dấu (HTML)** (hoặc **PDF**).
4. **Tầng 4 — Cơ sở hạ tầng dịch vụ kinh doanh**: Hỗ trợ quy trình kinh doanh chung như mã hóa thanh toán thẻ tín dụng, xác thực, chuyển tiền điện tử.
5. **Tầng 5 — Các ứng dụng TMĐT**: Cửa hàng trực tuyến, danh mục sản phẩm (VD: catalog sách trực tuyến chạy trên nền 4 tầng dưới).

**So sánh HTML vs. PDF trong xuất bản điện tử**:
| Tiêu chí | HTML | PDF |
| :--- | :--- | :--- |
| **Bản chất** | Ngôn ngữ đánh dấu (Markup) | Ngôn ngữ mô tả trang (Page Description) |
| **Kiểm soát hiển thị** | Trình duyệt/người đọc có thể đổi font, cỡ chữ | Người tạo cố định bố cục, giữ nguyên bản gốc |
| **Mục đích phù hợp** | Truyền đạt thông tin linh hoạt, tương tác Web | Biểu mẫu pháp lý/thuế, tài liệu in ấn, giữ nhận diện gốc |

### 2.3. 3 hình thái mạng (Network Topologies) trong TMĐT
| Hình thái | Quy mô | Trọng tâm | Cơ chế bảo vệ |
| :--- | :--- | :--- | :--- |
| **Internet** | Toàn cầu | Quan hệ với mọi bên liên quan (khách hàng, công chúng...) | Mở rộng toàn cầu |
| **Intranet** | Nội bộ tổ chức | Giao tiếp, chia sẻ thông tin giữa các nhân viên | **Tường lửa (Firewall)** chặn bên ngoài |
| **Extranet** | Đối tác kinh doanh | Liên kết chuỗi giá trị giữa người mua và nhà cung cấp (B2B) | Giới hạn kết nối giữa các đối tác chỉ định |

### 2.4. Trao đổi dữ liệu điện tử (EDI)
- **Khái niệm**: Trao đổi điện tử các tài liệu kinh doanh chuẩn hóa lặp lại (hóa đơn, đơn giao hàng) giữa các công ty. Chuẩn phổ biến: **ANSI X.12** (Bắc Mỹ) và **EDIFACT** (quốc tế).
- **Ưu điểm**: Giảm giấy tờ, trao đổi thời gian thực, giảm sai sót nhập liệu (nhập 1 lần), phối hợp chuỗi cung ứng tốt hơn, đẩy nhanh dòng tiền.
- **Chuyển dịch**: Trước đây EDI chạy qua mạng giá trị gia tăng (**VAN**) rất đắt đỏ nên chỉ ~100.000 doanh nghiệp lớn dùng được; nay **Internet/Extranet** thay thế VAN với chi phí thấp, giúp doanh nghiệp nhỏ tham gia EDI và bổ sung khả năng đa phương tiện.

---

## 3. Thanh toán Điện tử & An toàn Bảo mật Giao dịch

### 3.1. 3 lớp Bảo mật hệ thống TMĐT
1. **Điều khiển truy cập & Xác thực**:
   - *Trí nhớ cá nhân*: Tên tài khoản, mật khẩu.
   - *Vật sở hữu*: Thẻ nhựa, chìa khóa, địa chỉ IP.
   - *Đặc tính cá nhân (Sinh trắc học)*: Vân tay, giọng nói, chữ ký, kích cỡ bàn tay.
2. **Tường lửa (Firewall)**: Thiết bị/phần mềm đặt giữa mạng nội bộ (Intranet) và Internet để lọc gói tin theo địa chỉ IP hoặc ứng dụng được phép.
3. **Mã hóa (Encryption) & Chữ ký số**:
   - Chống chương trình nghe lén (*sniffer*) chặn số thẻ tín dụng trên đường truyền.
   - **Mã hóa khóa công khai (Public-key cryptography / PGP)**: Mỗi bên có 1 cặp **Khóa công khai (Public key)** (chia sẻ tự do) và **Khóa riêng tư (Private key)** (giữ bí mật tuyệt đối).
     - *Để bảo mật thông điệp*: Người gửi mã hóa bằng **Public key của người nhận** → chỉ người nhận dùng **Private key của mình** giải mã được.
     - *Để xác thực danh tính (Chữ ký số)*: Người gửi ký bằng **Private key của mình** → người nhận dùng **Public key của người gửi** để xác minh đúng danh tính người gửi.

### 3.2. So sánh 4 phương thức Thanh toán Điện tử
| Phương thức | Cơ chế hoạt động | Bảo mật | Xác thực | Ẩn danh | Chia nhỏ được (Micropayment) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Chuyển tiền điện tử (EFT)** | Séc điện tử chuyển tiền giữa tài khoản ngân hàng qua mạng thanh toán bù trừ. | Cao | Cao | **Thấp** (ghi nhận qua ngân hàng) | Có |
| **Tiền mặt số (Digital Cash)** | Thẻ trả trước, **thẻ thông minh (Smart card)** gắn chip lưu giá trị (stored-value); có thể thêm mã PIN. | Trung bình | Cao | **Cao** | Có |
| **Ecash (Digicash)** | Rút tiền số từ ngân hàng lưu trên máy cá nhân, giao dịch qua mạng dùng mã hóa khóa công khai. | Cao | Cao | **Cao** | Có |
| **Thẻ tín dụng (Credit Card)** | Thanh toán từ xa phổ biến nhất; người tiêu dùng được bảo vệ giới hạn rủi ro (VD: tối đa $50 tại Mỹ). | Cao | Cao | **Thấp** | Có (nếu tự động hóa lưu thông tin) |

### 3.3. Bảo mật giao dịch thanh toán: SSL vs. SET
- **SSL (Secure Sockets Layer)**: Do Netscape phát triển, dùng mã hóa khóa công khai để mã hóa đường truyền giữa trình duyệt và Web server. **Ưu điểm**: Đơn giản, chi phí thấp (kết hợp phần mềm chống gian lận). **Nhược điểm**: Người bán vẫn thấy được số thẻ tín dụng của khách hàng.
- **SET (Secure Electronic Transaction)**: Do Visa, MasterCard (và American Express) phát triển dựa trên mật mã và **Chứng chỉ số (Digital Certificate)** do Cơ quan cấp chứng nhận (CA) phát hành.
  - **4 thành phần của SET**: (1) *Ví điện tử* (phía khách hàng), (2) *Merchant server* (phía người bán), (3) *Cổng thanh toán (Payment gateway)*, (4) *Cơ quan cấp chứng nhận (CA)*.
  - **Ưu điểm vượt trội**: Thông tin đơn hàng mã hóa bằng khóa của người bán, còn **thông tin thanh toán mã hóa bằng khóa của ngân hàng** → **người bán không thể giải mã số thẻ tín dụng của khách**, triệt tiêu rủi ro lộ thẻ từ phía người bán giả mạo.

### 3.4. Cookie (Tệp lưu trữ nhỏ ≤ 4KB trên máy khách)
- **4 ứng dụng chính**: (1) Theo dõi lượt truy cập & hành vi xem trang; (2) Lưu trữ thông tin cá nhân/đăng nhập; (3) Tùy biến nội dung theo sở thích; (4) Nhắm mục tiêu quảng cáo tiếp thị lại.

---

## 4. Chiến lược Web & Marketing Điện tử (I2M)

### 4.1. Bản chất truyền thông Web & 8 loại Điểm thu hút (Attractors)
- Web chuyển dịch truyền thông từ **Marketing đẩy** (1 chiều từ người bán) sang **Marketing kéo** (khách hàng chủ động tìm kiếm và tương tác 2 chiều), tạo sân chơi bình đẳng cho doanh nghiệp nhỏ (chi phí gia nhập thấp, *share of voice* ngang bằng).
- **8 loại điểm thu hút trên Web**:
  1. *Công viên giải trí*: Trò chơi, cuộc thi tương tác cao, tạo trải nghiệm thú vị.
  2. *Kho lưu trữ*: Lịch sử công ty, tài liệu giáo dục tạo uy tín (khó bắt chước nhưng ít tương tác).
  3. *Tài trợ độc quyền*: Gắn với sự kiện lớn (thể thao, hòa nhạc), đòi hỏi cập nhật trực tiếp từng phút.
  4. *Hội trường*: Diễn đàn trực tuyến với chuyên gia, phỏng vấn trực tiếp.
  5. *Câu lạc bộ*: Cộng đồng thành viên có cùng sở thích giúp tăng lòng trung thành và hỗ trợ lẫn nhau.
  6. *Cửa hàng quà tặng*: Tặng phần mềm miễn phí (freeware/shareware), bản cập nhật, phiếu giảm giá, ảnh số.
  7. *Nút giao lộ / Cổng thông tin (Portal)*: Công cụ tìm kiếm, danh bạ, trung tâm tin tức hút traffic khổng lồ.
  8. *Trung tâm dịch vụ khách hàng*: Tra cứu tài khoản, theo dõi bưu kiện (UPS/FedEx), FAQ.

### 4.2. Lưới yếu tố thu hút & Sức hấp dẫn bền vững
- Khác với dịch vụ truyền thống (giảm tương tác/tùy biến để hạ chi phí), Web cho phép **tùy biến hàng loạt (Mass Customization)** với chi phí lao động gần như bằng 0 — hướng lên góc trên bên phải (Tương tác cao + Tùy biến cao = **Câu lạc bộ**).
- **Chiến lược giữ sức hấp dẫn bền vững (khó bắt chước)**: Tận dụng hạ tầng IT back-end phức tạp, quan hệ tài trợ độc quyền, kho lưu trữ lịch sử/thương hiệu uy tín, tài sản sở hữu trí tuệ độc quyền; kết hợp **cá nhân hóa thích nghi** (người dùng tự chọn) và **thích ứng** (hệ thống tự học hành vi) để tạo **chi phí chuyển đổi** giữ chân khách hàng.

### 4.3. Mô hình Marketing Tích hợp trên Internet (I2M)
- **I2M (Integrated Internet Marketing)** phối hợp đồng bộ các công nghệ Internet (Email/bảng tin không đồng bộ, Chat đồng bộ, FTP, Telnet, Âm thanh/Video streaming, Trạm tin tức, Công cụ tìm kiếm, Thực tại ảo 360°) với các yếu tố hình ảnh tổ chức (*Bầu khí quyển, Nhân viên, Tránh rác/spam, Tin tức, Dấu hiệu/Logo, Trải nghiệm dùng thử, Truyền miệng, Quan hệ công chúng, Sản phẩm/Dịch vụ, Văn hóa đại chúng*) nhằm truyền tải một thông điệp nhất quán tới mọi bên liên quan.

### 4.4. Mô hình 6 bước chuyển đổi & Đo lường hiệu quả Web
Dòng chảy khách truy cập qua 6 cấp độ: $Q_0$ (Người lướt Web) → $Q_1$ (Người nhận biết site: chủ động $Q_{1a}$ & bị động $Q_{1b}$) → $Q_2$ (Số Hit trên site) → $Q_3$ (Số Visit tương tác chủ động) → $Q_4$ (Số lần mua hàng) → $Q_5$ (Số lần mua lặp lại).

| Chỉ số hiệu quả | Công thức | Ý nghĩa & Biện pháp tối ưu |
| :--- | :--- | :--- |
| **Hiệu quả nhận biết ($\eta_0$)** | $\eta_0 = \frac{Q_1}{Q_0}$ | Mức độ người dùng biết đến URL (in URL lên bao bì, tài liệu, quảng cáo). |
| **Hiệu quả thu hút ($\eta_1$)** | $\eta_1 = \frac{Q_2}{Q_1}$ | Chuyển người nhận biết thành Hit (tên miền dễ nhớ, băng thông mạnh, liên kết hot, banner). |
| **Hiệu quả tiếp xúc ($\eta_2$)** | $\eta_2 = \frac{Q_3}{Q_2}$ | Chuyển Hit thành Visit có tương tác (nội dung dễ đọc, đồ họa/video đẹp, giao diện thân thiện). |
| **Hiệu quả chuyển hóa ($\eta_3$)** | $\eta_3 = \frac{Q_4}{Q_3}$ | Chuyển Visit thành đơn hàng (đơn giản hóa đặt hàng, đa dạng thanh toán an toàn, hội thoại). |
| **Hiệu quả giữ chân ($\eta_4$)** | $\eta_4 = \frac{Q_5}{Q_4}$ | Chuyển người mua thành khách quay lại (làm mới web định kỳ, chăm sóc sau bán, khai phá dữ liệu). |
| **Hiệu quả tổng thể ($\eta_{WAv}$)** | $\eta_{WAv} = \frac{1}{5}\sum_{i=1}^{5} \mu_i \frac{Q_i}{Q_{i-1}}$ | Trung bình có trọng số $\mu_i$ theo mục tiêu ưu tiên của từng chiến dịch. |

*Lưu ý kỹ thuật*: **Bộ nhớ đệm (Cache)** của trình duyệt và **Proxy Server** gây ra hiện tượng **đếm thiếu** $Q_2$ (Hit) và $Q_3$ (Visit), làm sai lệch tính toán $\eta_1, \eta_2, \eta_3$.

---

## 5. Phân phối, Logistics & Dịch vụ trong TMĐT

### 5.1. Ma trận Phân phối Internet (3×3)
Internet tác động lên 3 chức năng cơ bản của kênh phân phối (**Sắp xếp lại & phân loại**, **Định kỳ giao dịch**, **Hoạt động tìm kiếm**) thông qua 3 động lực công nghệ:
1. **Cái "chết" của khoảng cách**: Chi phí truyền tải sản phẩm số hóa không còn phụ thuộc khoảng cách địa lý; catalog B2B cập nhật tức thời thay cho in ấn gửi thư (VD: DuPont, GE Plastics).
2. **Sự đồng nhất về thời gian**: Thị trường ảo mở cửa 24/7/365, xóa bỏ lệch múi giờ và giờ hành chính (VD: đặt chỗ vận tải biển SeaNet, tra cứu dặm bay tức thời).
3. **Không liên quan tới vị trí địa lý**: "3 quy tắc bán lẻ mới: Vị trí không liên quan, không liên quan và không liên quan" (VD: **Dell** bán tùy chỉnh cấu hình trực tuyến, quay vòng tồn kho **30 lần/năm** so với 12 lần/năm của Compaq; **GE** và **Caterpillar** đấu thầu B2B trực tuyến giúp giảm thời gian đấu thầu từ 21 ngày xuống 10 ngày và tiết kiệm 5–20% chi phí).

### 5.2. Tác động dài hạn tới Chuỗi cung ứng & Phân phối
- Chuyển từ **"kênh phân phối"** thụ động sang **"phương tiện phân phối"** tương tác chủ động.
- **Quy luật hàng hóa phổ biến (Commoditization)**: Cạnh tranh và minh bạch giá làm sản phẩm dễ bị chuẩn hóa, mất khác biệt → doanh nghiệp phải chọn thị trường ngách, đổi mới nhanh hoặc tạo trải nghiệm độc đáo.
- **Loại bỏ trung gian & Tái thiết lập trung gian (Reintermediation)**: Các trung gian truyền thống bị thay thế, nhưng xuất hiện các **trung gian điện tử mới** làm tốt hơn chức năng tìm kiếm/so sánh (VD: Priceline.com, so sánh giá vé). Mô hình phân phối chuyển từ tập trung (đầu tư hạ tầng lớn tại trung tâm) sang **mô hình mạng phân tán** (chi phí gia nhập thấp ở mọi điểm).

### 5.3. Quản lý Dịch vụ trực tuyến (Cyberservice)
Web khắc phục 4 nhược điểm truyền thống của dịch vụ:
1. **Tính vô hình**: Cung cấp bằng chứng tức thời (email xác nhận mã thành viên ngay lập tức), hữu hình hóa qua đồ họa/video/webcam trực tiếp, cho dùng thử/lấy mẫu số (tải PDF có watermark), nhân lên ký ức qua đánh giá cộng đồng.
2. **Tính đồng thời**: Tùy biến theo từng cá nhân; biến **khách hàng thành "nhân viên bán thời gian"** tự phục vụ (tự tra cứu vận đơn UPS, tự nhập liệu); công nghiệp hóa dịch vụ (tự động hóa tra cứu danh bạ); thiết kế quy trình **sai hỏng an toàn (fail-safe)** (chọn từ danh sách, nhập email 2 lần, gửi bản sao đơn hàng để khách tự sửa lỗi).
3. **Tính không đồng nhất**: Tiêu chuẩn hóa giao diện và quy trình phục vụ đồng nhất 100%; lắng nghe hội thoại khách hàng (nhóm tin, diễn đàn nội bộ); đo lường chất lượng trực tuyến (SERVQUAL online) để rút ngắn vòng lặp phản hồi.
4. **Tính không lưu trữ được**: Quản lý cung 24/24h không giới hạn nhân sự; định hướng cầu bằng đấu giá giờ chót (lấp đầy 100% ghế máy bay/phòng khách sạn) và bán gói dịch vụ (bundling).

---

## 6. Định giá Điện tử & Tác động Xã hội / Pháp lý

### 6.1. Động lực thị trường & Chi phí giao dịch
- Công nghệ (Công cụ tìm kiếm, Thư mục, Trang so sánh, Shopbot, Tác tử thông minh tự đàm phán) làm giảm mạnh **6 loại chi phí giao dịch** cho người mua: (1) Chi phí tìm kiếm, (2) Chi phí thông tin, (3) Chi phí thương lượng, (4) Chi phí quyết định, (5) Chi phí kiểm soát, (6) Chi phí thực thi/khiếu nại.
- Khách hàng chuyển từ **người chấp nhận giá** sang **người xác định giá** (đấu giá trực tuyến, đặt giá mục tiêu trên Priceline, đấu thầu ngược B2B).

### 6.2. Chiến lược Định giá hiệu quả trên Web
Kết hợp **Phân phối Pareto 80-20** (hạng khách hàng C → B → A → A+) và **Phổ trao đổi** (đưa sản phẩm rời xa vùng *hàng hóa phổ biến* tiến gần vùng *quyến dụ*):
1. **Định giá khác biệt & Tùy biến đại chúng**: Tính giá khác nhau theo giá trị cảm nhận của từng phân khúc khách hàng.
2. **Tạo hàng rào chuyển đổi**: Lưu trữ hồ sơ sở thích/hành vi để phục vụ cá nhân hóa tốt hơn, khiến khách ngại chuyển sang đối thủ dù giá rẻ hơn.
3. **Loại bỏ chi phí thực đơn (Menu Cost)**: Dùng Extranet kết nối kho/giá để cập nhật giá tức thời về gần như bằng 0.
4. **Cạnh tranh bằng Trải nghiệm**: Tạo trải nghiệm thẩm mỹ, giải trí, giáo dục độc nhất.
5. **Tối ưu Tổng chi phí mua sắm ($T = P + O$)**: Khách hàng sẵn sàng trả giá bán trên Web ($P_w$) cao hơn kênh truyền thống ($P_t$) một khoản chênh lệch $\delta = P_w - P_t$ miễn là nhỏ hơn phần chi phí tìm kiếm/giao nhận/cơ hội tiết kiệm được ($O_t - O_w$), để tổng chi phí $T_w < T_t$.
6. **Trao đổi hàng hóa điện tử (B2B)**: Hoán đổi linh kiện/tồn kho dư thừa thay vì bán tháo giá rẻ.
7. **Cực đại doanh thu thay vì cực đại giá**: Bán đấu giá giờ chót chỗ trống/hàng tồn với chi phí cận biên thấp.
8. **Giảm rủi ro cho người mua**: Cung cấp thông tin kịp thời, bảo đảm chất lượng, rút ngắn chu kỳ giao hàng để có thể định giá cao hơn.

### 6.3. Tác động xã hội (Chủ nghĩa Hậu hiện đại) & Các vấn đề Pháp lý trên Web
- **6 đặc trưng hậu hiện đại của Web**: (1) *Phân mảnh* (thị trường ngách, phân mảnh cái tôi qua danh tính ảo); (2) *Phản phân hóa* (xóa nhòa ranh giới thực–ảo, riêng tư–công cộng, làm việc–nghỉ ngơi); (3) *Siêu thực* (bot/tác tử ảo, trang giả mạo khó phân biệt thật–giả); (4) *Nén thời gian & không gian* (đồng bộ toàn cầu 24/7, làm việc từ xa); (5) *Nghịch lý & cóp nhặt* (vừa giải phóng vừa gây nghiện; sao chép mã nguồn/nội dung); (6) *Phản duy thức luận* (mô hình $n-n$ phi tập trung, không ai kiểm soát hoàn toàn Internet).
- **Vấn đề pháp lý & đạo đức được đặt ra trong giáo trình**:
  - **Quyền riêng tư (Privacy)**: Giám sát hành vi nhấp chuột và lập hồ sơ cá nhân gây xung đột giữa cá nhân hóa dịch vụ và xâm phạm đời tư.
  - **Bản quyền & Sở hữu trí tuệ**: Việc sao chép, chắp vá văn bản, hình ảnh, mã nguồn trên siêu văn bản làm thách thức luật bản quyền truyền thống.
  - **Bảo vệ người tiêu dùng trong thanh toán**: Giới hạn trách nhiệm tài chính của chủ thẻ tín dụng khi xảy ra gian lận và yêu cầu lưu vết giao dịch ngân hàng theo luật định (đối với EFT).
