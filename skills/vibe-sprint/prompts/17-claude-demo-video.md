# Prompt 17 — Video demo dọc ≤ 2 phút, dựng SONG SONG với app (~10 agent, bắt đầu sớm từ T+8)

> **Dành cho điều phối viên (Claude Code chính).** Có đề là làm video luôn, song song với app; **không đợi T+45**. **Chỉ một video**: `demo-<app>.mp4` ≤ 2:00, **độ phân giải gốc 1170×2532** (390×844 × `--scale 3`; `--scale 4` ra 1560×3376; tỉ lệ 9:19,5, **không đệm 1080×1920, không cắt, không phóng to**), phụ đề tiếng Việt đốt sẵn, chấm chạm hiện rõ. Quay bằng CDP screencast ở DPR 3 nên **nét** (recordVideo chỉ quay cỡ CSS 390×844, phóng lên bị mờ; chỉ là đường lùi khi CDP lỗi). Bản sao `00-demo-video.mp4` + `00-demo-video-poster.png` (cùng độ phân giải) nhúng vào **slide video** (người nói nói "Mời dừng video." để cắt sớm).
>
> **Video làm 3 việc:** (1) **minh chứng thời điểm chốt**; (2) **slide video** ngay trước phần tính năng của Dũng; (3) **dự phòng sân khấu** ("Mời phát video demo.").
>
> **Vì sao sớm và song song:** quay mỗi scene ngay khi tính năng của nó đã merge và qua smoke thì đến T+45 gần như chỉ còn ghép. Mỗi scene một agent, cổng riêng. **Mốc: V1/V2 từ T+8–10; scene agent T+20–44 (mỗi tính năng xong là spawn); quay lại scene đổi + ghép T+45–50; giao Claude Design T+50.**
>
> **Điều kiện:** `node scripts/doctor.mjs` báo có ffmpeg + Playwright. Nguồn quay: `http://localhost:8211/` (hoặc Pages) có tính năng đã merge. Mỗi scene agent chạy server riêng `python3 -m http.server <cổng>` trong repo (cổng **8232–8239**, không dùng 8000), hoặc dùng chung link Pages.

## Kế hoạch điều phối theo dòng thời gian (~10 agent)

| Mốc | Agent | Model | Việc | Đầu ra | Cổng |
|---|---|---|---|---|---|
| **T+8–10** | **V1** Storyboard | Haiku | Từ `docs/spec-nhanh.md` viết `docs/storyboard-demo.json`: **mỗi tính năng = 1 scene** + intro/outro (thẻ) + ca sai/Tối; caption kiểu định danh ≤ 12 từ (Prompt 1). Selector chưa chắc thì ghi `"todo": true` và sửa lúc scene agent quay | `docs/storyboard-demo.json` | — |
| **T+10** | **V2** Thẻ | Haiku | Dựng ngay thẻ đầu/cuối `--cards-only` (chỉ cần tên app, tagline, link, nhãn mô phỏng) | `out/scenes/title.mp4`, `end.mp4` | — |
| **T+20–44** | **V3–V9** Scene (tối đa 6–8 agent cả cuộc) | Haiku/Sonnet | **Điều phối spawn 1 scene agent ngay khi tính năng k được merge và qua smoke**: `--scene <id>` trên `localhost:8211` hoặc Pages; sửa selector nếu cần. Chỉ quay lại scene khi **tính năng của nó đổi**; luôn giữ clip mới nhất của mỗi scene | `out/scenes/<id>.mp4` + `<id>.json` | 8232–8239 (mỗi agent một cổng) |
| **T+40–45** | **V9** Caption (có thể gộp vào V1) | Haiku | Soát caption cuối (≤ 12 từ, định danh, đủ dấu); giọng đọc nếu đội muốn | sửa storyboard + `<id>.json`; `docs/loi-thoai-video.txt` | — |
| **T+45** (UI khóa) | Các scene agent đang rảnh | Haiku | **Một đợt cuối chạy song song: chỉ quay lại scene có tính năng đã đổi sau lần quay trước** (so hash commit) | clip mới nhất | 8232–8239 |
| **T+46–50** | **V10** Ghép + QA | Sonnet | `--assemble`, QA (≤ 2:00, độ phân giải = gốc, khung hình), lưu `docs/minh-chung/00-demo-video.mp4` + poster; **T+50 giao Claude Design (slide video)** | `docs/minh-chung/...` | — |

**Dự phòng lỗi:** scene lỗi (selector, trang không tải) thì scene agent thử lại 1 lần với storyboard đã sửa; vẫn lỗi thì **bỏ scene**: `--assemble` tự bỏ scene thiếu và cảnh báo, ghép phần còn lại (**thiếu scene vẫn ghép, không chặn nộp**). V10 ghi scene bị bỏ vào báo cáo. Nếu < 3 scene quay được hoặc script hỏng hẳn: **biến thể B** (cuối file) và báo điều phối.

## Lệnh dùng chung (storyboard là `docs/storyboard-demo.json`)

```bash
# Scene agent (V3–V9): quay đúng 1 scene, trên cổng riêng (8232–8239); thêm --scale 4 nếu cần nét hơn
node tools/demo-video.cjs --url http://localhost:80XX/ --storyboard docs/storyboard-demo.json --scene <id> --out out
# V2: thẻ đầu/cuối (chạy sớm, T+10)
node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --cards-only --out out
# V10: ghép (thêm --voice loi-thoai.mp3 nếu có giọng; --max 120 mặc định)
node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --assemble --out out
```
Ra `out/demo-<app>.mp4`, `out/demo-<app>-contact.png`, `out/demo-<app>.srt`, `out/00-demo-video.mp4` (bản sao), `out/00-demo-video-poster.png`. Mỗi scene độc lập tự nạp `?demo=1` (nên storyboard phải cho **mỗi scene tự đứng được**: không giả định dữ liệu vừa thêm ở scene trước).

## Prompt 1 (V1, Haiku, T+8–10): điền storyboard

```markdown
Bạn là agent V1 Storyboard của đội Xclipse. KHÔNG sửa mã app. Đầu vào: `docs/spec-nhanh.md` (5 tính năng theo thứ tự), `tools/demo-video.example.json` (mẫu), mã trong `features/*/feature.js` (để lấy selector thật). App: **{{TEN_APP}}**, link **{{LINK_DEMO}}**.
Việc: tạo `docs/storyboard-demo.json` theo mẫu:
- `app`, `tagline` (≤ 12 từ), `link` (link thật, hiện ở thẻ cuối), `notice` = `EP.config.mockNotice` nguyên văn.
- **Mỗi tính năng của đề = 1 scene**, đúng thứ tự trong spec; thêm 1 scene ca nhập sai và 1 scene giao diện Tối. Tổng 6–8 scene. Mỗi scene có `id` duy nhất (chữ thường, gạch ngang), `hash` (route `#/<tab>`), `caption`, `minDuration` 8–16 giây, `actions`.
- **Mỗi scene phải tự đứng được** (mở trang bằng `?demo=1`, dữ liệu mẫu có sẵn; không dựa vào dữ liệu thêm ở scene khác).
- `caption`: **1 dòng ≤ 12 từ, kiểu định danh** (nêu tên việc, không khen). `[từ]` tô màu san hô. Khi scene hiện số liệu hoặc kết quả AI mô phỏng, caption nêu "dữ liệu mẫu" / "mô phỏng".
- **Ngày, giờ, địa điểm, giá, tên người lấy từ form/dữ liệu mẫu của app, không bịa trong caption.**
- `actions` chỉ dùng: `{"tap":sel}` `{"type":[sel,text]}` `{"scroll":y}` `{"wait":ms}` `{"theme":"dark|light"}` `{"eval":js}`. Kiểm tra từng selector bằng Playwright (mở `?demo=1`, đếm phần tử) trước khi ghi.
- Tổng `minDuration` của các scene ≤ 105 giây (thẻ đầu 3s + cuối 4s ≤ 120 giây).
Báo: danh sách `id` scene theo thứ tự và scene nào chưa chắc selector. Không đưa khóa API/mật khẩu vào file.
```

## Prompt V3–V9 (Agent quay scene, Haiku/Sonnet), thay `<id>` và cổng

```markdown
Bạn là agent Quay scene `<id>`. KHÔNG sửa mã app. Điều phối chỉ spawn bạn khi tính năng của scene này đã merge và qua smoke; `docs/storyboard-demo.json` do V1 làm. Chạy server riêng nếu không dùng Pages: `python3 -m http.server 80XX` trong thư mục app (cổng 8232–8239, KHÔNG dùng 8000).
Lệnh: `node tools/demo-video.cjs --url {{LINK_DEMO_HOAC_localhost:80XX}} --storyboard docs/storyboard-demo.json --scene <id> --out out`
Sau đó đọc `out/scenes/<id>.json` (dur, caption) và trích 2 khung hình của `out/scenes/<id>.mp4` (`ffmpeg -ss 3 -i ... -frames:v 1`): có thấy chấm chạm khi bấm, không trang trắng, không toast/khóa/email thật? Lỗi (cảnh báo "hành động lỗi") thì sửa selector/`wait` của scene `<id>` trong storyboard và quay lại ĐÚNG 1 lần. Báo: `id`, thời lượng, ổn/lỗi, đã sửa gì. Tắt server khi xong.
```

## Prompt V2, V9 (Haiku)

```markdown
V2 (T+10): chạy `node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --cards-only --out out`; xem `out/scenes/title.png` và `end.png`: tên app, tagline, link đúng, đủ dấu tiếng Việt. Báo đường dẫn.

V9 (T+40): đọc `docs/storyboard-demo.json`. Soát `caption` từng scene: ≤ 12 từ, kiểu định danh, đủ dấu, không số/ngày/tên bịa (so với form và `docs/spec-nhanh.md`). Sửa trực tiếp trong storyboard VÀ trong `out/scenes/<id>.json` (trường caption) nếu scene đã quay. Nếu đội muốn giọng: viết `docs/loi-thoai-video.txt`, 1 câu mỗi scene, tổng ≤ 110 giây (~2,2 từ/giây). KHÔNG làm danh sách cắt/bản ngắn (chỉ có một video). Giọng đọc do đội thu hoặc công cụ TTS của đội; không đưa API key vào repo.
```

## Prompt V10 (Agent ghép + QA, Sonnet)

```markdown
Bạn là agent V10 Ghép + QA. KHÔNG sửa mã app. Từ T+46, khi đợt quay lại cuối (T+45) xong (hoặc quá T+49):
1. `node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --assemble --out out` (thêm `--voice loi-thoai.mp3` nếu có). Scene thiếu thì script tự bỏ qua và cảnh báo; ghi tên scene bị bỏ.
2. QA bằng ffprobe và ảnh: `demo-<app>.mp4` **≤ 120 giây** và **độ phân giải gốc** (`ffprobe` ra 1170×2532 khi `--scale 3`; KHÔNG 1080×1920, không có viền đệm); trích 1 khung hình PNG nguyên cỡ để kiểm chữ sắc nét; xem `out/demo-<app>-contact.png` + trích 5 khung hình đều nhau: phụ đề đủ dấu, không tràn, thấy chấm chạm, nhãn "Dữ liệu mô phỏng AI · Dữ liệu mẫu" hiện trên thẻ đầu/cuối và trong app, không khóa/email thật. Lỗi nhỏ: sửa storyboard, quay lại scene liên quan và ghép lại ĐÚNG 1 lần.
3. **Lưu đúng tên:** `docs/minh-chung/demo-{{TEN_APP_SLUG}}.mp4` + `.srt` + `-contact.png` · `docs/minh-chung/00-demo-video.mp4` (bản sao) · `docs/minh-chung/00-demo-video-poster.png` · và chép `00-demo-video.mp4` + poster vào `deck/assets/`. Không commit mp4 nếu `.gitignore` chặn.
4. Báo (≤ 8 dòng): đường dẫn, thời lượng thật, độ phân giải, scene bị bỏ, hash commit, thời gian dựng; "Dữ liệu trong video là **dữ liệu mẫu / mô phỏng**" khi đang chạy mô phỏng (không ghi "AI thật").
```

## Giọng đọc tuỳ chọn

Video mặc định **không tiếng** (đủ làm minh chứng, sân khấu có người nói). Có giọng: V9 viết kịch bản, đội thu hoặc dùng TTS; lưu `loi-thoai.mp3` **ngoài repo**; V10 chạy thêm `--voice`. Script tự chuẩn hoá **-16 LUFS** và đặt giọng bắt đầu sau thẻ đầu.

## Biến thể B: Claude trong Chrome (khi Playwright/ffmpeg hỏng)

```markdown
Bạn là Claude trong Chrome. Hãy giúp tôi quay video demo DỌC của {{TEN_APP}} ({{LINK_DEMO}}, thêm ?demo=1).
1. DevTools → thanh thiết bị → Responsive 390 × 844, DPR 3, zoom 100%. Cửa sổ ẩn danh, tắt thông báo.
2. Tôi bật ghi màn hình (Windows: Win+G; macOS: ⇧⌘5, chọn vùng chỉ khung điện thoại). Khi tôi nói "bắt đầu", bạn lần lượt: [liệt kê scene: bấm gì, gõ gì, cuộn tới đâu], dừng 1,5 giây sau mỗi bước; bấm chậm.
3. Tổng ≤ 120 giây. Không tên người thật, không khóa API, không thông báo hệ thống.
4. Sau khi dừng ghi, nhắc tôi lưu `demo-{{TEN_APP_SLUG}}.mp4` (và bản sao `00-demo-video.mp4`) và chụp ảnh bìa `00-demo-video-poster.png`.
```
Thêm chữ bằng CapCut/Clipchamp hoặc để nguyên (người nói thuyết minh). Ghi trong báo cáo: "quay tay, không có phụ đề đốt".
