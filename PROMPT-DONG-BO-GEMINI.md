# ĐỒNG BỘ TỪ CLAUDE (OPUS) → GEMINI ANTIGRAVITY — trạng thái 16/11 (bản gộp)

## 1. Repo & nhánh (kéo về trước khi làm gì)
- Repo skill: `XclipseX/VibeCodeLandingPageBuilder`, nhánh `claude/serene-ramanujan-7wxqwr`. Tối thiểu phải có `f03011e`.
- Repo app thi: `XclipseX/Xclipse-ChungKet`, nhánh `nop-bai` (≥ `5cc49b4`, phiên bản 0.1.2). Pages: https://xclipsex.github.io/Xclipse-ChungKet/
- Gói chốt: `xclipse-skills-final.zip` ở gốc repo skill (gồm vibe-sprint, gh-pages-deploy, firebase-setup; 7,6 MB, có đủ 10 file kiến thức). **Sẽ đóng gói lại sau đợt làm mobile (mục 4)**, nhớ nạp lại bản đó.
- Quy ước: Gemini đẩy lên nhánh `ag/<tên>`, Claude kiểm rồi ghép vào. Không ép ghi đè (force-push), không sửa file bên kia đang làm.

## 2. Thể lệ chung kết (đã đọc bản chính thức) → `references/00-the-le-chung-ket.md`
- **Thang điểm Bảng Kinh tế:** phần lõi 27 · **dùng trên điện thoại 10** · giao diện 5 · **tính thực tế của cơ chế kinh doanh/ưu đãi 10 · phân tích mô hình kinh doanh 22 · số liệu dự phòng và giả định 17** · hồ sơ 9.
- **Điện thoại:** chấm ở bề ngang **360–390 px**, theo 5 tiêu chí:
  1. không tràn nội dung, không cuộn ngang;
  2. nút và ô nhập dễ bấm bằng ngón tay, không chồng nhau;
  3. chữ dễ đọc ở mức phóng to mặc định;
  4. mọi luồng chính làm được trên điện thoại;
  5. có thanh tab hoặc điều hướng cho biết đang ở đâu.
- **Nộp 4 mục:** link, source, README, minh chứng lúc chốt bài (ảnh hoặc bản ghi màn hình).
- **Dữ liệu:** BTC phát file dữ liệu mẫu nhiều sheet. Không còn câu mock bắt buộc, chỉ cần ghi rõ "dữ liệu mẫu/mô phỏng".
- **Cấm** làm sẵn sản phẩm hoặc tính năng dành riêng cho đề. README phải khai báo bộ khung chuẩn bị trước.
- **Vòng 1 không có hỏi đáp.** Vòng phản biện phải trình bày giả định và cách tính.

## 3. Đã xong và đã đẩy lên
**App mẫu (`starter/`) và app thi:**
- `js/lucian.js` + `css/lucian.css`: lớp UI Lucian áp cho toàn app. Xem `#/playground/ui`.
- **`js/scenario.js` (`EP.scenario`):** bảng giả định kèm lý do, 3 kịch bản xấu/cơ sở/tốt, điểm hòa vốn (chia cho 0 thì hiện "Không đủ dữ liệu"), độ nhạy ±10/20%, khung "Cách tính", xuất CSV. Xem `#/playground/biz`.
- **`js/import.js` (`EP.importer`):** nhập xlsx/xls/csv không cần mạng (SheetJS 0.18.5 trong `js/vendor/`), chọn sheet, tự đoán cột, đọc số kiểu Việt Nam. Xem `#/playground/import`.
- `mockNotice` mặc định: `Dữ liệu mô phỏng AI · Dữ liệu mẫu`. Nếu đề có câu nhãn thì chép nguyên văn.
- Hiệu ứng đổi sáng/tối 650 ms, nhịp ease-in-out.
- Model mặc định gemini-4-hydrogen, gọi qua Worker `vibe-gemini-proxy.xclipse.workers.dev`. Worker đã cho phép `xclipsex.github.io`, ghim vùng chạy us-east-1.
- Bộ icon Xclipse: `brand/icons/` (54 icon, `XcIcons.svg(name)`).

**Tài liệu skill:**
- `references/10-lucian-ui.md`, `11-mo-hinh-kinh-doanh.md` (công thức, giả định theo ngành, ưu đãi thực tế, dự phòng).
- **`references/12-khung-kinh-doanh-cho-de.md`:** sổ tay áp dụng T+0–10, gồm:
  - phân khúc, chân dung khách hàng;
  - USP: công thức, 7 bài kiểm, cách viết lời chào bán;
  - tam giác định vị, phễu 6 vai trò sản phẩm, 4P/5P/7P;
  - kênh truyền thông, phễu web η0–η4;
  - cơ chế sàn thương mại điện tử;
  - kế hoạch kinh doanh, dòng tiền, rủi ro;
  - checklist "Cơ chế ưu đãi thực tế".

  Số liệu có trích nguồn dạng `file 05 §1.3`. Số không có trong tài liệu ghi "giả định cần nêu nguồn".
- **`references/kien-thuc/01…10_*.md`:** 10 file kiến thức đội gửi, kèm `README.md` (mục lục) và **`HANDOFF-GEMINI-KIEN-THUC.md`**. Bạn đọc file này trước tiên.
- **`prompts/13-business-agent.md`:** prompt cho agent "Giả định & mô hình kinh doanh" trong giờ thi. Kết quả ra `docs/assumptions.md`.
- **Kịch bản 60 phút:**
  - T+0: mở file BTC.
  - T+5: hợp đồng dữ liệu và danh sách giả định.
  - T+48–50: kiểm điện thoại ở 360 và 390.
  - T+50–55: minh chứng lúc chốt bài kèm mã commit.
  - T+55–60: nộp 4 mục.
- **Thuyết trình:** 3 bản 10, 5 và 3 phút. Bản nào cũng bắt buộc có slide "Giả định & cách tính". Vai Diệu Anh, Dũng, Nguyên giữ nguyên.
- **Hỏi đáp:** 44 câu (mục G về kinh doanh, marketing), có gắn người trả lời.
- **`prompts/12` (slide Claude Design):** đổi được số slide 11/7/5.

## 4. ĐANG LÀM (Claude + 2 agent Sonnet). Chưa sửa các file dưới đây cho tới khi Claude báo xong
**Đợt "ưu tiên điện thoại tuyệt đối":** app chấm trên điện thoại nên giao diện máy tính chỉ cần dùng được. Slide và thuyết trình **chỉ dùng ảnh điện thoại dọc**, không dùng ảnh ngang hay vuông kiểu máy tính.

- **Agent A, phần app** (`skills/vibe-sprint/starter/` + repo `Xclipse-ChungKet`):
  - **Bộ quy chuẩn `references/13-chuan-mobile.md`:**
    - khung màn hình 360×780 / 390×844;
    - chữ thường 16px, ô nhập ≥ 16px;
    - vùng bấm ≥ 48×48, cách nhau ≥ 8px;
    - nút chính ở vùng ngón cái;
    - checklist đối chiếu 5 tiêu chí của BTC.
  - **Giao diện điện thoại:**
    - thanh tab dưới đáy, dùng icon Xclipse, báo tab đang mở;
    - thanh hành động chính dính đáy (`EP.ui.actionBar`);
    - form và hộp thoại trượt lên từ đáy, vuốt xuống để đóng;
    - ô tiền và số bật bàn phím số;
    - bảng chuyển thành thẻ, biểu đồ vừa 360px;
    - hero gọn, bớt kính mờ.
  - **Độ mượt:** chuyển tab ≤ 220 ms, mỗi tab nhớ vị trí cuộn, không xô lệch bố cục.
  - **Test điện thoại** ở 360 và 390: không cuộn ngang, nút ≥ 48px và không chồng nhau, chữ đủ lớn, làm trọn luồng chính chỉ bằng chạm.
  - **Chụp ảnh app cho slide và minh chứng: Claude Sonnet 5.5 phụ trách.** Agent Sonnet tự mở web (link Pages hoặc localhost) ở chế độ điện thoại dọc 390×844 @3x (và 360×780), chụp từng tab ở cả sáng và tối, đặt tên `NN-tab-mobile-theme.png`, rồi đưa thẳng vào slide và hồ sơ. Script `tools/shots-mobile.cjs` là công cụ của agent này. **Gemini không cần chụp ảnh app.**
- **Agent B, phần slide và thuyết trình** (`deck/`, `prompts/07, 08, 12`, `references/05`, `templates/KICH-BAN-DEMO, CUE-CARDS, CHECKLIST-CHUNG-KET, MINH-CHUNG-AI, BANG-KIEM-THU`):
  - **Slide khung điện thoại:** 1 máy kèm 3 chú thích, 2–3 máy cạnh nhau, các bước 1→2→3. Công cụ chụp mặc định ảnh điện thoại dọc.
  - **`prompts/12`:** bắt buộc ảnh điện thoại dọc trong khung máy, cấm cắt ngang hoặc vuông, tối đa 3 máy mỗi slide. Đặt tên ảnh dạng `04-tinh-nang-1-mobile-light.png`.
  - **Demo trên điện thoại thật:** chiếu màn hình bằng scrcpy (Android) hoặc AirPlay/QuickTime (iPhone). Không chiếu được thì dùng chế độ điện thoại 390×844 trong Chrome. Dự phòng bằng video quay dọc.
  - **Minh chứng lúc chốt bài:** ảnh điện thoại dọc ở 360 và 390, kèm 1 ảnh máy tính, do agent Sonnet chụp.

## 5. Việc Gemini làm ngay (không đụng file ở mục 4)
1. **Đọc** `references/kien-thuc/HANDOFF-GEMINI-KIEN-THUC.md`, 10 file kiến thức và `references/12`.
   - Dò từng trích dẫn nguồn (file + mục) và từng con số trong `references/12`, vì Claude chưa dò tay.
   - Báo chỗ sai hoặc thiếu qua nhánh `ag/kien-thuc-review`. Chỉ sửa `references/12` và `templates/HOI-DAP.md` mục G.
2. **Thử Firebase thật** theo `skills/firebase-setup`, bằng tài khoản Google rảnh, nếu đội quyết dùng.
3. **Sau khi Claude báo đợt mobile xong:** chạy thử đề rehearsal Bảng Kinh tế bằng skill mới trong thư mục nháp (**không đẩy lên repo thi**).
   - Đo thời gian từng mốc, ghi lại chỗ vướng. Chú ý `EP.scenario`, `EP.importer`, `prompts/13`, thanh tab dưới đáy.
   - Gửi Claude danh sách cần sửa.
   - Ảnh chụp app để Claude Sonnet làm, Gemini không cần chụp.

## 6. Quy tắc bắt buộc
- Không ghi key vào file, commit hay chat. Trước khi đẩy code chạy `node skills/vibe-sprint/scripts/scan-secrets.mjs skills`.
- Không bật trả phí. Không dùng cổng 8000 (dùng 8211–8234).
- Repo thi chỉ chứa khung chung, không làm sẵn tính năng đoán theo đề.
- Cái gì chưa test thì ghi rõ "chưa test". Không bịa số liệu: thiếu nguồn thì ghi "giả định cần nêu nguồn".
