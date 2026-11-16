# Bàn giao cho Gemini Antigravity: trạng thái kiến thức Bảng Kinh tế

Cập nhật theo phiên Claude Code hiện tại. Mục đích: bạn biết file kiến thức nào đã có, đã chưng cất vào đâu, phần nào của skill/app dùng chúng, và việc còn mở.

## 1. Các file kiến thức (đủ 10, giữ nguyên văn, không sửa)

Thư mục: `skills/vibe-sprint/references/kien-thuc/`. Mục lục + "dùng khi nào": `README.md` cùng thư mục.

| File | Nội dung chính |
|---|---|
| `01_Chien_Luoc_Marketing_Phan_Khuc_Khach_Hang.md` | 4P, phân khúc/chọn phân khúc, persona 12 lớp, customer journey |
| `02_Dinh_Vi_Thuong_Hieu_USP_Chien_Luoc_San_Pham.md` | Định vị, USP (công thức, 7 bài kiểm), phễu 6 nhóm sản phẩm |
| `03_Content_Marketing_Va_Copywriting.md` | Content marketing, 13 công thức viết, tiêu đề, ngân sách content |
| `04_Social_Media_Va_Kenh_Truyen_Thong.md` | Social media, chọn kênh, Channel Fit, đo lường, 90 ngày |
| `05_Kinh_Doanh_Tren_San_TMDT_DOM204.md` | Shopee/TikTok Shop: phí, công thức giá, ads, voucher, hòa vốn |
| `06_Nhap_Mon_Quan_Tri_Kinh_Doanh.md` | Quản trị, kế hoạch, kế toán/thuế, chi phí, KPI, rủi ro |
| `07_Hanh_Vi_Nguoi_Tieu_Dung_Va_Nghien_Cuu_Marketing.md` | Hành vi người tiêu dùng, nghiên cứu marketing |
| `08_Marketing_Can_Ban_Ban_Hang_Va_Case_Studies.md` | Marketing căn bản, giá, 5M, khuyến mại, bán hàng, 7 case |
| `09_SEO_Va_Tong_Quan_TMDT.md` | SEO, phễu web η0-η4, định giá điện tử T = P + O |
| `10_Quan_Tri_Doanh_Nghiep_Vua_Va_Nho_SME.md` | KHKD 12 phần, kịch bản, dòng tiền, chỉ số tài chính, SCM |

## 2. Đã chưng cất vào đâu (đường dẫn trong `skills/vibe-sprint/`)

| Việc | File | Ghi chú |
|---|---|---|
| Sổ tay thi nhanh: khung nào, thứ tự trong T+0-10, mẫu điền, ô giả định, câu pitch | `references/12-khung-kinh-doanh-cho-de.md` | Mục 8 phân tách **số có nguồn** (cột "Nguồn") và **số không có trong nguồn** (ghi "giả định cần nêu nguồn"). Mục 10 = checklist "Cơ chế ưu đãi thực tế". Mục 11 = bảng nguồn 01-10. |
| Liên kết với công thức/`EP.scenario` | `references/11-mo-hinh-kinh-doanh.md` mục 9 "Liên kết khung kiến thức" | Chỉ thêm cuối file, không sửa phần cũ. |
| Hỏi đáp giám khảo | `templates/HOI-DAP.md` mục G (câu 31-44) | Gắn người trả lời `[DA]` / `[Dũng]` / `[Nguyên]`, trả lời ngắn trước, có nguồn từng câu. |
| Prompt cho agent "Giả định & mô hình kinh doanh" | `prompts/13-business-agent.md` | Có `{{SCHEMA_CONTRACT}}` và luật "không làm sẵn tính năng cho đề"; đọc 11, 12 và đúng mục của `kien-thuc/`. |
| Gọi từ điều phối | `SKILL.md`, bảng agent, dòng "Giả định & mô hình kinh doanh" | Trỏ tới prompt 13. |

## 3. Phần nào của app/skill dùng kiến thức này

- App (starter): `EP.scenario` (`js/scenario.js`) nhận giả định có `why`/`source`, 3 kịch bản, hòa vốn, độ nhạy; `EP.importer` (`js/import.js`) nạp dữ liệu BTC. Agent 13 điền giả định theo `12`, không sửa module chung.
- Trên màn hình đề thi: bảng giả định (nhãn Giả định / Dữ liệu BTC / Mô phỏng), thẻ "Cơ chế ưu đãi", ma trận rủi ro, dòng USP, (nếu đề cần) bảng dòng tiền theo tháng và phễu web η.
- Hồ sơ nộp: `docs/assumptions.md` (mục "Giả định & cách tính") do agent 13 viết; `HOI-DAP.md` do agent docs điền số thật.

## 4. Lưu ý quan trọng

- Số trong giáo trình (phí sàn 5,5-6%, thuế 1% + 0,5%, ngân sách marketing 2-10% doanh thu...) là **tham chiếu có nguồn**, không phải số của đề. Số của đề/BTC luôn thắng; phí sàn đổi nhiều lần mỗi năm (`05 §4.1`).
- Số **không** có trong nguồn: CR theo ngành, AOV, CPC, tỉ lệ hoàn/hủy, tỉ lệ dùng voucher, tỉ lệ cannibalization, giá vốn. Phải đặt thận trọng và nêu lý do.
- Luật chung kết: kiến thức chung được trích; logic, số liệu, giao diện của đề phải viết trong 60 phút.
- Ví dụ Nike/Adidas (08 Case 4), Vertu, OMO... là case minh họa để pitch, không dùng làm giả định.

## 5. Việc còn mở

- Chưa chạy thử prompt 13 trên một đề thật; nên thử một lần ở buổi luyện (không chép code sang bài thi).
- Nếu giáo trình có bản cập nhật biểu phí sàn, sửa mục 8.1 của `12` (một chỗ duy nhất) và ghi ngày.
- Các mục `12` chưa được kiểm bằng tay từng trích dẫn mục; nếu thấy lệch số mục, sửa trong `12` chứ không sửa file gốc.
