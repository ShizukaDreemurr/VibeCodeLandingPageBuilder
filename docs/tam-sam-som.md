# Ước tính quy mô thị trường TAM / SAM / SOM (bổ sung mục 4.1 báo cáo UX)

> Tổng hợp ngày 26/10/2026. Phương pháp **từ dưới lên (bottom-up)** như mục 4.1 đề xuất: số tài khoản phù hợp × doanh thu/năm mỗi tài khoản.
> Mỗi biến ghi rõ **[Nguồn]** (có dẫn chứng) hoặc **[Giả định]** (cần kiểm chứng bằng phỏng vấn). Kết quả là **ước tính có kịch bản**, không phải số liệu thị trường đã xác minh.

## 1. Định nghĩa (giải thích cho nhóm)
| Chỉ số | Nghĩa | Câu hỏi trả lời |
|---|---|---|
| **TAM** – Total Addressable Market | Tổng doanh thu nếu **mọi** khách hàng phù hợp ở Việt Nam đều dùng sản phẩm | "Bánh lớn nhất có thể là bao nhiêu?" |
| **SAM** – Serviceable Available Market | Phần TAM sản phẩm **thực sự phục vụ được** với năng lực hiện tại (khu vực, ngôn ngữ, loại sự kiện, kênh tiếp cận) | "Phần bánh mình với tới được?" |
| **SOM** – Serviceable Obtainable Market | Phần SAM **có thể giành được trong 12–24 tháng** sau khi tính tỉ lệ tiếp cận, kích hoạt, trả phí | "Thực tế mình ăn được bao nhiêu?" |

Công thức (theo mục 4.1):
- TAM = Σ (số tài khoản phù hợp của từng phân khúc × doanh thu năm/tài khoản)
- SAM = TAM × tỉ lệ phục vụ được
- SOM = số tài khoản trong SAM × tỉ lệ tiếp cận × tỉ lệ kích hoạt × tỉ lệ trả phí × doanh thu năm/tài khoản

## 2. Dữ liệu đầu vào
### 2.1 Số tài khoản phù hợp
| Phân khúc | Biến | Thấp | Cơ sở | Cao | Căn cứ |
|---|---|---|---|---|---|
| A. Doanh nghiệp (SME) tổ chức sự kiện | Số DN đang hoạt động | 840.000 | 840.000 | 940.000 | **[Nguồn]** cuối 2024 có ~839.000 DN (Sách trắng DN 2026 – Cục Thống kê) hoặc 940.078 DN (Bộ KH&ĐT); SME ~98% — [Báo Pháp luật](https://doanhnhan.baophapluat.vn/khoi-doanh-nghiep-vua-boc-lo-khoang-trong-quy-mo-chi-chiem-3-7-tong-so-luong-toan-nganh.html), [Đầu tư](https://baodautu.vn/chiem-gan-98-tong-so-doanh-nghiep-doanh-nghiep-nho-va-vua-dang-o-dau-trong-nen-kinh-te-d249574.html) |
| | % DN tổ chức sự kiện cần trang đăng ký ≥ vài lần/năm | 5% | 10% | 15% | **[Giả định]** — kiểm chứng qua bài đăng Threads/Facebook |
| | → Số tài khoản A | 42.000 | 84.000 | 141.000 | Tính |
| B. Trung tâm đào tạo / trainer | Số đơn vị | 6.500 | 10.000 | 15.000 | **[Nguồn + Giả định]** riêng TP.HCM có **1.961 trung tâm ngoại ngữ – tin học** được cấp phép (8/2025) — [Đại biểu Nhân dân](https://daibieunhandan.vn/tp-ho-chi-minh-nang-cao-chat-luong-nhan-su-tai-cac-trung-tam-ngoai-ngu-tin-hoc-10388655); nhân lên cả nước và cộng trainer tự do là **giả định** |
| C. Studio ảnh cưới | Số studio | 3.000 | 5.000 | 8.000 | **[Giả định]** — chưa có thống kê chính thức; nguồn ngành chỉ nói "số lượng rất lớn, cạnh tranh mạnh" — [businessup.vn](https://businessup.vn/tram-doc/ke-hoach-digital-marketing-dich-vu-chup-hinh-cuoi/) |

### 2.2 Giá (doanh thu/tài khoản)
**[Giả định]** lấy từ khoảng giá thử nghiệm trong báo cáo UX (mục 10), chưa kiểm chứng:
| Phân khúc | Thấp | Cơ sở | Cao |
|---|---|---|---|
| A. SME (gói Growth) | 199.000đ/tháng | 299.000đ/tháng | 399.000đ/tháng |
| B. Trainer (gói Starter) | 100.000đ/tháng | 200.000đ/tháng | 300.000đ/tháng |
| C. Studio | 99.000đ/tháng | 199.000đ/tháng | 299.000đ/tháng |

Đối chiếu thực tế: LadiPage (builder đa năng, không chuyên sự kiện) được ước tính doanh thu khoảng **3,9 triệu USD năm 2025** — [GetLatka](https://getlatka.com/companies/ladipage.vn) (**ước tính của bên thứ ba**). Dùng để kiểm tra độ hợp lý của TAM, không dùng làm dữ liệu đầu vào.

### 2.3 Tỉ lệ phục vụ và chuyển đổi — **[Giả định]**
| Biến | Thấp | Cơ sở | Cao | Lý do |
|---|---|---|---|---|
| SAM / TAM | 30% | 40% | 50% | Giai đoạn đầu tập trung Hà Nội, TP.HCM; sự kiện dạng workshop, hội thảo, webinar, khai trương, thiệp cưới |
| Tỉ lệ tiếp cận (24 tháng) | 10% | 20% | 30% | Kênh: cộng đồng marketing, phễu thiệp cưới, nội dung |
| Tỉ lệ kích hoạt (tạo ≥1 trang) | 20% | 30% | 40% | |
| Tỉ lệ trả phí | 5% | 10% | 15% | Mô hình freemium |

## 3. Kết quả
| Chỉ số | Thấp | **Cơ sở** | Cao |
|---|---|---|---|
| Số tài khoản phù hợp (A+B+C) | 51.500 | **99.000** | 164.000 |
| TAM (tỷ đồng/năm) | 111,7 | **337,3** | 757,8 |
| — trong đó SME | 100,3 | 301,4 | 675,1 |
| — trainer | 7,8 | 24,0 | 54,0 |
| — studio cưới | 3,6 | 11,9 | 28,7 |
| SAM (tỷ đồng/năm) | 33,5 | **134,9** | 378,9 |
| Tài khoản trả phí sau 24 tháng | ~15 | **~237** | ~1.476 |
| SOM (tỷ đồng/năm) | 0,03 | **0,81** | 6,82 |

Cách tính ví dụ (cơ sở): TAM = 84.000 × 299.000 × 12 + 10.000 × 200.000 × 12 + 5.000 × 199.000 × 12 ≈ 337 tỷ; SOM = 39.600 tài khoản SAM × 20% × 30% × 10% ≈ 237 tài khoản × ~3,4 triệu/năm ≈ 0,81 tỷ.

## 4. Đọc kết quả thế nào
- **TAM cơ sở ~337 tỷ/năm** cùng bậc với doanh thu ước tính của LadiPage (~3,9 triệu USD ≈ 100 tỷ đồng) → con số hợp lý, không bị thổi phồng.
- **SME là phân khúc lớn nhất (~90% TAM)** → khớp quyết định chọn marketer in-house làm khách hàng chính.
- **Studio cưới nhỏ về doanh thu trực tiếp** (~12 tỷ) nhưng giá trị nằm ở **phễu lan truyền** (mỗi thiệp tới vài trăm người — xem `nghien-cuu-pheu-thiep-cuoi.md`), không phải doanh thu thuê bao.
- **SOM nhạy nhất với tỉ lệ trả phí và tiếp cận** → đây là 2 giả định cần kiểm chứng đầu tiên.

## 5. Giả định cần kiểm chứng (ưu tiên)
1. % doanh nghiệp tổ chức sự kiện cần trang đăng ký — hỏi trong bài đăng Threads/Facebook.
2. Mức giá chấp nhận — hỏi "hiện anh/chị trả bao nhiêu cho LadiPage/thuê ngoài?".
3. Số studio ảnh cưới — đếm nhanh trên Google Maps/Facebook tại Hà Nội, TP.HCM rồi ngoại suy.
4. Tỉ lệ trả phí freemium — tham chiếu thêm số liệu công khai của SaaS tương tự nếu tìm được nguồn tin cậy.

## 6. Giới hạn
- Số DN đang hoạt động khác nhau giữa hai cơ quan (839 nghìn vs 940 nghìn) do khác phương pháp; dùng cả hai làm cận dưới/cận trên.
- Không có thống kê toàn quốc về trung tâm đào tạo và studio cưới → các con số này là giả định có ghi rõ.
- Không trộn số doanh nghiệp với số cá nhân nên không có tính trùng; trainer tự do có thể trùng một phần với phân khúc A (đã chấp nhận vì nhỏ).
