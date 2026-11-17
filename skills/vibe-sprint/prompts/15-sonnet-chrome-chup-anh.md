# Prompt 15 — Claude Sonnet trong Chrome: chụp ảnh điện thoại dọc cho slide và đóng gói ZIP

> **Dành cho điều phối viên.** Gửi ở **T+45** (khi app đã merge, đã deploy, link chạy được), cho **Claude Sonnet 5.5 chạy trong Chrome** (tiện ích *Claude in Chrome*, trên máy của Nguyên hoặc máy phụ). Kết quả là **một file ZIP ảnh** đặt đúng tên theo bảng slot của prompt 14 (mục 6), để T+50 tải lên **cùng dự án Claude Design** (Phần 2 của prompt 14).
>
> **Vì sao dùng Chrome thật:** ảnh phải là **ảnh app đang chạy trên link thật** (đúng thứ giám khảo thấy), ở **khung điện thoại dọc**, sáng và tối. Nếu Claude in Chrome không lưu được file PNG hay tạo được ZIP, **agent phải dừng và báo ngay** (bước 0 của prompt), đừng chờ.
>
> **Làm song song cho chắc ăn (khuyến nghị bắt buộc, vì dùng token không giới hạn):** cùng lúc gửi prompt này cho Claude in Chrome, **spawn 1 agent Sonnet trong Claude Code** chạy phương án dự phòng ở mục "Dự phòng: chạy bằng Claude Code" bên dưới. Ai xong và đạt bảng tự kiểm trước thì dùng ZIP đó; ZIP còn lại giữ làm đối chiếu.
>
> **Chuẩn bị trước khi gửi (2 phút):**
> 1. Link app mở được (**Pages nếu đã lên, hoặc `http://localhost:8211/` ngay trên máy Nguyên** khi Pages chưa kịp; Chrome mở được cả hai); ghi **hash commit** đang chạy (`git rev-parse --short HEAD`, trùng số phiên bản hiển thị trên app) vào ô `{{COMMIT}}`.
> 2. Điền **bảng slot** (cột "Cách đến trạng thái") theo app thật: route `#/<id>` của từng tab (`EP.router.list()`), nút/ô cần bấm/điền cho trạng thái bước 1, 2, 3, ca sai, ca biên. Cột này **bắt buộc** cụ thể; chỗ nào để mơ hồ thì Sonnet đoán sai.
> 3. Mở Chrome **không đăng nhập tài khoản nào quan trọng** (hồ sơ khách hoặc cửa sổ ẩn danh có bật tiện ích). Tắt thông báo hệ thống. Ô khóa API của app **để trống**.
> 4. Biết sẵn Chrome **không thu cửa sổ nhỏ hơn khoảng 500px**; vì thế phải dùng **thanh thiết bị của DevTools** (cách M1) hay cửa sổ pop-up (cách M2). Nếu tiện ích không điều khiển được DevTools, **Nguyên bật tay 15 giây:** F12 → Ctrl+Shift+M (macOS: ⌥⌘I rồi ⇧⌘M) → chọn **Dimensions: Responsive**, đặt **390 × 844**, bấm ⋮ → bật **Add device pixel ratio** → **3** (và **Add device type → Mobile**); xong nói với Sonnet "đã bật khung 390 × 844".
> 5. Gửi khối prompt dưới đây, đã thay `{{...}}`. Ghi giờ gửi vào `docs/PROGRESS.md`. Dự kiến 8–12 phút cho ~25 ảnh 390px + 8 ảnh 360px (slot 01, 03, 10, 12 × sáng/tối) + 1 ảnh desktop.
>
> **Sau khi nhận ZIP (T+50):** xem nhanh 5 ảnh ngẫu nhiên + `manifest.txt` (có đủ cột kiểm tra không?), rồi chuyển sang Phần 2 của prompt 14. Cũng **lưu bản sao ZIP ngoài repo hoặc trong `docs/minh-chung/`** (nếu đội đồng ý) làm một phần minh chứng thời điểm chốt (kèm hash commit); minh chứng chính do `node scripts/nop-bai.mjs` tạo ở T+50–55.

---

```markdown
Bạn là **Claude Sonnet trong Chrome**. Nhiệm vụ: **chụp ảnh màn hình điện thoại DỌC** của một web app đang chạy, **đặt tên đúng từng ảnh**, kiểm tra, và **đóng gói thành một file ZIP**. Ảnh sẽ dùng làm ảnh slide thuyết trình nên **độ chính xác của tên file và tỉ lệ ảnh quan trọng hơn tốc độ**.

## THÔNG TIN

- App: **{{TEN_APP}}** · Link app: **{{LINK_DEMO}}** (có thể là Pages hoặc `http://localhost:8211/`; dùng đúng link này; chỉ thêm `?demo=1` và `#/...` như bảng dưới) · Commit đang chạy: **{{COMMIT}}**
- Tên ZIP: **`{{TEN_APP_SLUG}}-slide-anh.zip`**
- Ngày, giờ, múi giờ: ghi trong `manifest.txt` theo `Asia/Ho_Chi_Minh`.

## QUY TẮC AN TOÀN

1. **Chỉ làm việc trên link của app ở trên.** Không mở trang khác, không đăng nhập, không gửi form ra ngoài, không bấm quảng cáo/liên kết ngoài.
2. **Không nhập hay hiển thị khóa API, mật khẩu, token, email, số điện thoại thật.** Chỉ dùng **dữ liệu mẫu** của app (nút "Điền dữ liệu mẫu" hoặc `?demo=1`). Màn hình Cài đặt có ô khóa: **để trống**; nếu ô đang có nội dung thì **không chụp** màn đó và ghi vào báo cáo.
3. **Không chỉnh sửa mã nguồn, không sửa dữ liệu thật.** Mọi thao tác chỉ là bấm, nhập dữ liệu mẫu, đổi giao diện sáng/tối.
4. **Không bịa.** Nếu một công cụ không làm được (lưu file PNG, tạo ZIP, đặt khung điện thoại), **dừng và báo** đúng việc không làm được. Tuyệt đối không dán ảnh từ nguồn khác, không dùng ảnh desktop thay cho ảnh điện thoại, không đổi tên ảnh sai trạng thái cho đủ số.

## BƯỚC 0 — KIỂM TRA KHẢ NĂNG (làm trước tiên, trả lời ngắn từng dòng)

Trả lời **Có/Không** cho: (a) mở được link app trong tab mới; (b) chạy được JavaScript trong trang (để đọc `window.innerWidth`, bật sáng/tối); (c) **lưu được ảnh chụp thành file PNG có tên do tôi đặt** (qua tải xuống, đổi tên) — nếu công cụ chỉ trả ảnh vào hội thoại mà không lưu thành file thì trả lời **Không**; (d) tạo được **file ZIP** (hoặc có cách đóng gói). Nếu (a), (b) hoặc (c) là **Không** → **DỪNG, báo lý do**, tôi sẽ chạy phương án dự phòng. Nếu chỉ (d) là Không → vẫn chụp và đặt tên đủ, dừng ở thư mục ảnh, báo đường dẫn để tôi nén.

## BƯỚC 1 — ĐẶT KHUNG ĐIỆN THOẠI DỌC (không được bỏ qua)

Mục tiêu: **cửa sổ nhìn của trang rộng đúng 390px, cao 844px** (sau đó 360×780). Kiểm tra bằng JavaScript trong trang:
`({w:innerWidth,h:innerHeight,dpr:devicePixelRatio,ready:document.documentElement.dataset.ready})`
Chấp nhận khi `w` = 390 (±1), `h` = 844 (±40), hiển thị đúng bố cục điện thoại (thanh tab dưới, một cột). Thử lần lượt:

- **M1 — Thanh thiết bị của DevTools (ưu tiên):** F12 → Ctrl+Shift+M (macOS: ⌥⌘I → ⇧⌘M) → *Dimensions: Responsive* → `390` × `844`, *DPR* `3`, *Mobile*. Chụp bằng **DevTools → ⋮ → Capture screenshot** (chỉ vùng nhìn, không "full size") hoặc Ctrl+Shift+P → *Capture screenshot*; file về thư mục Tải xuống rồi **đổi tên**. (Tôi có thể đã bật sẵn khung này; kiểm `innerWidth` trước.)
- **M2 — Cửa sổ pop-up:** từ tab app chạy `window.open(location.href,'xcshot','popup=yes,width=390,height=844')`; kiểm `innerWidth` trong cửa sổ mới. Nếu lớn hơn 391 do Chrome giữ cỡ tối thiểu → bỏ M2.
- **M3 — Công cụ đổi kích thước cửa sổ của tiện ích** (nếu có): đặt cỡ ngoài, rồi chỉnh lại cho tới khi `innerWidth` = 390. Nếu Chrome không cho nhỏ tới mức đó → bỏ M3.

Nếu **không** đạt `innerWidth` ≈ 390 bằng cách nào → **DỪNG và báo** "không đặt được khung điện thoại" (đừng chụp ảnh rộng rồi cắt). Ghi vào `manifest.txt` cách nào đã dùng và `dpr` thật.

## BƯỚC 2 — CHUẨN BỊ TRẠNG THÁI TRƯỚC KHI CHỤP

Với **mỗi ảnh**, theo đúng thứ tự:
1. Mở `{{LINK_DEMO}}?demo=1#/<route>` theo bảng slot (cột "Cách đến trạng thái"). Chờ `document.documentElement.dataset.ready === '1'` và `document.fonts.ready`; chờ thêm **1 giây** cho hiệu ứng vào.
2. **Giao diện sáng/tối:** chạy `EP.theme.apply('light')` hoặc `EP.theme.apply('dark')` (áp ngay, không hiệu ứng). Nếu không có `EP.theme`, bấm nút đổi giao diện `#btn-theme` (chu kỳ Theo hệ thống → Sáng → Tối) cho tới khi thuộc tính `document.documentElement.getAttribute('data-theme')` đúng giá trị cần. **Kiểm lại** bằng đọc thuộc tính đó **trước mỗi ảnh**; chờ 600 ms sau khi đổi.
3. Thực hiện các thao tác của slot (bấm "Điền dữ liệu mẫu", điền ô, bấm gửi, mở hộp thoại…). Chờ kết quả hiện xong (không còn khung xám đang tải `.skeleton`, không còn vòng quay).
4. **Dọn màn hình để ảnh sạch:** chạy
   `document.head.insertAdjacentHTML('beforeend','<style id="xc-shot">html{scrollbar-width:none}::-webkit-scrollbar{display:none}#toasts,.toasts{display:none!important}*{caret-color:transparent!important}</style>'); document.activeElement && document.activeElement.blur(); window.scrollTo(0,0);`
   Đóng mọi hộp thoại/thông báo **không thuộc slot**. Con trỏ chuột đưa ra ngoài vùng trang. Nếu còn animation lặp, thêm `*{animation:none!important}` rồi chờ 300 ms.
5. **Kiểm nhanh trước khi chụp:** không có thanh cuộn ngang (`document.documentElement.scrollWidth <= innerWidth`); thanh tab dưới nhìn thấy đủ; chữ không bị cắt; dữ liệu mẫu có hiện (trừ slot yêu cầu trống); **không có thông tin cá nhân hay khóa**.
6. Chụp **vùng nhìn của trang** (viewport, không "toàn trang"), lưu PNG, **đổi tên đúng** theo bảng. Ảnh 390px phải có **tỉ lệ rộng/cao trong 0,458–0,466** (9:19,5). Ảnh DPR 3 là 1170×2532; DPR thấp hơn vẫn nhận nhưng ghi vào `manifest.txt`.

## BƯỚC 3 — BẢNG SLOT (danh sách ảnh bắt buộc; tên file đúng từng ký tự)

**Quy ước tên:** `NN-ten-slot-mobile-light.png` / `NN-ten-slot-mobile-dark.png` (390px) · `NN-ten-slot-mobile360-light.png` / `…360-dark.png` (360px). **Chụp cả Sáng và Tối cho mọi dòng**, trừ dòng ghi khác. Bảng này **giống hệt bảng slot trong prompt 14, mục 6** (thêm cột cách đến trạng thái).

| NN | Tên slot | Màn hình / trạng thái | Cách đến trạng thái (điền theo app) | Theme |
|---|---|---|---|---|
| 01 | `01-tong-quan` | Tab Tổng quan, đã nạp dữ liệu mẫu | `#/home` · `?demo=1` · chờ KPI hiện số | S + T |
| 02 | `02-nhap-lieu` | Form nhập đã điền dữ liệu mẫu, **chưa gửi** (bước 1) | `{{ROUTE_TINH_NANG_CHINH}}` · bấm `{{NUT_THEM}}` · điền: `{{CAC_O_VA_GIA_TRI_MAU}}` | S + T |
| 03 | `03-ket-qua` | Kết quả xử lý/AI có nhãn mô phỏng (bước 2) | như 02 rồi bấm `{{NUT_GUI}}` · chờ `{{DAU_HIEU_XONG}}` | S + T |
| 04 | `04-luu-xem-lai` | Danh sách đã lưu / báo cáo (bước 3) | `{{ROUTE_DANH_SACH}}` · chờ ≥ 3 dòng | S + T |
| 05 | `05-tinh-nang-1` | Màn hình tính năng 1 | `{{ROUTE_TN1}}` · `{{THAO_TAC_TN1}}` | S + T |
| 06 | `06-tinh-nang-2` | Màn hình tính năng 2 | `{{ROUTE_TN2}}` · `{{THAO_TAC_TN2}}` | S + T |
| 07 | `07-tinh-nang-3` | Màn hình tính năng 3 | `{{ROUTE_TN3}}` · `{{THAO_TAC_TN3}}` | S + T |
| 08 | `08-tinh-nang-4` | Màn hình tính năng 4 | `{{ROUTE_TN4}}` · `{{THAO_TAC_TN4}}` | S + T |
| 09 | `09-tinh-nang-5` | Màn hình tính năng 5 | `{{ROUTE_TN5}}` · `{{THAO_TAC_TN5}}` | S + T |
| 10 | `10-ca-sai` | Ca nhập sai: thông báo lỗi dưới ô, **không lưu** | form như 02 · nhập `{{GIA_TRI_SAI}}` · bấm gửi · chờ lỗi hiện | S + T |
| 11 | `11-ca-bien` | Ca biên (trùng/hết hạn/giá trị biên) | `{{THAO_TAC_CA_BIEN}}` | S + T |
| 12 | `12-gia-dinh` | Tab Giả định và kịch bản (Kinh tế) hoặc Quy tắc nghiệp vụ (Kỹ thuật) | `{{ROUTE_GIA_DINH}}` · chờ bảng + 3 kịch bản | S + T |
| 13 | `13-nhan-mo-phong` | Màn thấy rõ nhãn `{{MOCK_NOTICE}}` | chân trang hoặc khung kết quả AI | chỉ S |

**Ba bộ ảnh:**
1. **Bộ chính (gốc ZIP): 390×844**, Sáng rồi Tối cho mọi dòng → khoảng 25 ảnh.
2. **Bộ chứng cứ `360/`: 360×780**, Sáng và Tối, cho **slot 01, 03, 10, 12** (tên `NN-ten-slot-mobile360-light|dark.png`) — dùng ở slide "360px" và làm minh chứng. Đặt lại khung 360×780, kiểm `innerWidth` = 360, tải lại trang rồi chụp.
3. **Bộ `desktop/`: 1 ảnh** (`00-desktop-tong-quan.png`, màn Tổng quan 1440×900) làm chứng cứ. **Tuyệt đối không dùng ảnh desktop cho slide**; Claude Design sẽ bỏ qua thư mục này.

**Thứ tự làm việc gợi ý (tiết kiệm thao tác):** hết bộ Sáng ở 390px (01→13), bật Tối rồi chạy lại từ 01→12, rồi đổi sang 360px, rồi 1 ảnh desktop. Mỗi lần đổi khung phải kiểm lại `innerWidth`.

## BƯỚC 4 — TỰ KIỂM TRA TỪNG ẢNH (ghi kết quả vào manifest)

Đánh dấu **đạt/không đạt** cho từng ảnh theo checklist, rồi **chụp lại** các ảnh không đạt (tối đa 2 lần mỗi ảnh):

1. **Dọc 9:19,5:** rộng/cao trong 0,458–0,466; không bị cắt đáy/đỉnh; thấy đủ thanh tab dưới.
2. **Không tràn ngang:** không thanh cuộn ngang, không chữ/nút lòi ra mép.
3. **Đúng theme:** ảnh `-light` thật sự sáng (`data-theme` = `light`), ảnh `-dark` thật sự tối. Không lẫn.
4. **Đúng trạng thái slot:** ví dụ `10-ca-sai` **phải thấy** thông báo lỗi; `02-nhap-lieu` **phải thấy** form đã điền; `01-tong-quan` **không** ở trạng thái rỗng.
5. **Sạch:** không toast, không con trỏ nhập, không thanh cuộn, không hộp thoại thừa, không khung xám đang tải.
6. **An toàn:** không khóa API, mật khẩu, email, số điện thoại thật, tên người thật; nhãn dữ liệu mẫu/mô phỏng hiện rõ ở màn có kết quả AI.
7. **Tên file đúng từng ký tự** theo bảng (chữ thường, dấu gạch ngang, không dấu tiếng Việt, không khoảng trắng).

## BƯỚC 5 — ĐÓNG GÓI

Tạo thư mục `{{TEN_APP_SLUG}}-slide-anh/` rồi nén thành **`{{TEN_APP_SLUG}}-slide-anh.zip`** với cấu trúc **phẳng**:

```
{{TEN_APP_SLUG}}-slide-anh.zip
├─ 00-demo-video-poster.png (ảnh bìa video demo, cùng độ phân giải video: 1170×2532: Chụp tab Tổng quan sáng, dữ liệu mẫu; nếu `prompts/17` đã dựng video thì dùng khung hình từ video)
├─ 00-demo-video.mp4 (nếu đã có từ prompts/17: chép vào ZIP, KHÔNG tự quay)
├─ 01-tong-quan-mobile-light.png … (bộ chính 390px, tất cả ở gốc)
├─ 360/            (bộ 360px)
├─ desktop/        (1 ảnh chứng cứ)
└─ manifest.txt
```

`manifest.txt` (văn bản thường, UTF-8) gồm: dòng đầu `App | Link | Commit | Ngày giờ (Asia/Ho_Chi_Minh) | Cách đặt khung (M1/M2/M3) | innerWidth×innerHeight | DPR`; sau đó **mỗi ảnh một dòng**: `tên-file | slot | theme | cỡ pixel | tỉ lệ | đạt/không đạt | ghi chú`; cuối cùng là danh sách **ảnh thiếu hoặc không đạt** và lý do (để trống nếu không có).

## BÁO CÁO CUỐI (ngắn)

1. Đường dẫn ZIP và thư mục ảnh. 2. Số ảnh đã chụp / số cần có (ví dụ 25/25 · 8/8 · 1/1). 3. Danh sách ảnh thiếu hoặc không đạt và nguyên nhân. 4. Cách đặt khung điện thoại đã dùng và `innerWidth` thật. 5. Những gì **chưa kiểm** (nói thật). Không khen, không giải thích dài.
```

---

## Dự phòng: chạy bằng Claude Code (Playwright, chắc ăn nhất)

Dùng khi Claude in Chrome không lưu được PNG/ZIP, không đặt được khung 390px, hoặc làm **song song** để có bản đối chiếu. Spawn **1 agent Sonnet** (cổng 8225 theo bảng cổng của skill, hoặc dùng thẳng link Pages), chạy trong thư mục dự án (đã có `tools/shots-mobile.cjs` của starter và `deck/tools/capture.cjs`):

```bash
# 1) Chụp mọi tab, sáng + tối, 390x844 @3x -> shots-mobile/NN-<tab>-light|dark.png (chạy nhanh, tên theo tab)
node tools/shots-mobile.cjs {{LINK_DEMO}} shots-mobile
node tools/shots-mobile.cjs {{LINK_DEMO}} shots-mobile-360 --width 360 --height 780

# 2) Chụp đúng TÊN SLOT (khuyên dùng): chép deck/tools/capture.example.json -> deck/tools/capture.json,
#    mỗi dòng bảng slot ở trên là một "view" (name = "05-tinh-nang-1"), themes ["light","dark"], steps theo cột "Cách đến trạng thái"
node deck/tools/capture.cjs deck/tools/capture.json          # ra deck/assets/NN-ten-mobile-light|dark.png (1170x2532)
```

Mẫu `deck/tools/capture.json` (điền `base` bằng link thật; mỗi view một slot; `steps` gồm `click`, `fill`, `waitFor`, `hide`, `wait`):

```json
{ "base": "{{LINK_DEMO}}", "out": "../assets", "mobile": [390, 844], "scale": 3, "themes": ["light", "dark"],
  "views": [
    { "name": "01-tong-quan", "url": "index.html?demo=1#/home", "settle": 1200, "steps": [ { "hide": "#toasts" }, { "wait": 400 } ] },
    { "name": "10-ca-sai", "url": "index.html?demo=1#/{{ROUTE_TINH_NANG_CHINH}}",
      "steps": [ { "click": "{{NUT_THEM}}" }, { "fill": ["{{O_NHAP}}", "{{GIA_TRI_SAI}}"] }, { "click": "{{NUT_GUI}}" }, { "waitFor": ".error, [role=alert]" }, { "wait": 400 } ] }
  ] }
```

Bộ 360px: chạy lại với `"mobile": [360, 780]` và `"out": "../assets/360"` cho slot 01, 03, 10, 12 (đổi tên thành `…-mobile360-…` bằng `mv`). Ảnh desktop: một view riêng với `"devices": ["desktop"]` (chỉ chứng cứ).

**Kiểm tỉ lệ + đóng gói ZIP bằng Python/Node (không cần Chrome):**

```bash
# in cỡ pixel từng ảnh (rộng, cao) và tỉ lệ; phải trong 0,458–0,466
for f in deck/assets/*-mobile-*.png; do node -e "const b=require('fs').readFileSync(process.argv[1]);const w=b.readUInt32BE(16),h=b.readUInt32BE(20);console.log(process.argv[1],w+'x'+h,(w/h).toFixed(3))" "$f"; done

# ZIP cấu trúc phẳng + 360/ + desktop/ + manifest.txt
python3 - <<'PY'
import glob, os, zipfile
name = "{{TEN_APP_SLUG}}-slide-anh.zip"
with zipfile.ZipFile(name, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(glob.glob("deck/assets/[0-9][0-9]-*-mobile-*.png")): z.write(f, os.path.basename(f))
    for f in sorted(glob.glob("deck/assets/360/*.png")): z.write(f, "360/" + os.path.basename(f))
    for f in sorted(glob.glob("deck/assets/*-desktop.png")): z.write(f, "desktop/" + os.path.basename(f))
    z.write("manifest.txt")
print(name, "đã tạo")
PY
```

Ghi `manifest.txt` bằng tay hoặc để agent sinh (cùng khuôn ở Bước 5). **Không** commit ZIP vào repo ứng dụng (CLAUDE.md của dự án cấm đưa gói ZIP nộp bài vào repo); chỉ lưu bản sao vào `docs/minh-chung/` khi đội đồng ý.

## Sự cố thường gặp

| Hiện tượng | Xử lý |
|---|---|
| `innerWidth` không xuống 390 | dùng M1 (DevTools thủ công, Nguyên bật 15 giây) hoặc chuyển sang phương án Claude Code |
| Ảnh Tối vẫn sáng | đọc `data-theme`; gọi `EP.theme.apply('dark')`; nếu app không có `EP.theme` thì bấm `#btn-theme` thêm một lần; chờ 600 ms |
| Ảnh có toast/thanh cuộn | chạy lại bước "Dọn màn hình" (Bước 2.4) rồi chụp lại |
| Ảnh chụp ra 1170×2532 nhưng tỉ lệ lệch | khung cao khác 844: đặt lại 390×844 rồi chụp lại, không cắt ảnh |
| Chrome hỏi tải nhiều file | cho phép "Tải xuống nhiều tệp" cho trang; đổi tên từng tệp sau khi tải |
| Không tạo được ZIP trong Chrome | dừng ở thư mục ảnh, báo đường dẫn; Nguyên nén tay: Windows chọn tất cả → chuột phải → *Gửi tới → Thư mục nén*; macOS chuột phải → *Nén* |
