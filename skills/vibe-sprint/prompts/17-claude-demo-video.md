# Prompt 17 — Video demo dọc ≤ 2 phút do ~10 agent dựng song song

> **Dành cho điều phối viên (Claude Code chính).** Gửi ở **T+45**, song song với chụp ảnh (prompt 15), sau khi **giao diện đã khóa (T+44)**. **Chỉ một video**: `demo-<app>.mp4` ≤ 2:00, dọc 1080×1920, phụ đề tiếng Việt đốt sẵn, chấm chạm hiện rõ. Bản sao tên cố định `00-demo-video.mp4` + ảnh bìa `00-demo-video-poster.png` được nhúng vào **slide video** (người nói nói "Mời dừng video." để cắt sớm khi hết giờ).
>
> **Video làm 3 việc:** (1) **minh chứng thời điểm chốt** (BTC yêu cầu ảnh hoặc quay màn hình); (2) **slide video** ngay trước phần tính năng của Dũng; (3) **dự phòng sân khấu** ("Mời phát video demo.").
>
> **Vì sao song song:** quay tuần tự ~80 giây video mất 2–3 phút; chia mỗi scene cho 1 agent (cổng riêng) thì quay xong trong ~25 giây, phần còn lại là ghép. Dùng token không giới hạn nên chạy hết 10 agent. **Mốc: tất cả bắt đầu T+45, xong T+52.**
>
> **Điều kiện:** `node scripts/doctor.mjs` báo có ffmpeg + Playwright; app đã khóa; link Pages (hoặc `http://localhost:8211/`) mở được. Nhóm agent dùng **chung một link** (Pages) hoặc mỗi agent tự chạy `python3 -m http.server <cổng>` trong repo (cổng 8232–8237, **không dùng 8000**).

## Kế hoạch điều phối

| Agent | Model | Việc | Đầu ra | Cổng |
|---|---|---|---|---|
| **1** | Haiku | Điền `docs/storyboard-demo.json` từ `docs/spec-nhanh.md` (mục "Prompt 1" bên dưới). **Chạy trước, xong T+47**; các agent 2–10 chờ file này | `docs/storyboard-demo.json` | — |
| **2–7** | Haiku/Sonnet | **Mỗi agent quay 1 scene** (`--scene <id>`), agent k lấy scene thứ k trong storyboard (6 scene: tính năng 1–5 + ca sai/Tối; ít scene hơn thì bớt agent) | `out/scenes/<id>.mp4` + `<id>.json` | 8232–8237 |
| **8** | Haiku | Dựng thẻ đầu/cuối (`--cards-only`) | `out/scenes/title.mp4`, `end.mp4` | — |
| **9** | Haiku | Viết **caption cuối** (≤ 12 từ/dòng, kiểu định danh, soát dấu) và, nếu đội muốn, **kịch bản giọng đọc** (TTS) | sửa `caption` trong storyboard; `docs/loi-thoai-video.txt` | — |
| **10** | Sonnet | **Ghép + QA + lưu** (`--assemble`) | `docs/minh-chung/...` đúng tên | — |

**Thứ tự giờ:** T+45 gửi prompt; T+45–47 agent 1 điền storyboard; T+47–49 agent 2–8 chạy song song (≈ 1–2 phút); agent 9 soát caption **trước T+48** (agent 10 ghép lại sau khi caption sửa; caption nằm trong `<id>.json` nên agent 9 sửa cả hai nơi, hoặc agent 2–7 chạy lại scene sau khi storyboard chốt); T+49–52 agent 10 ghép + QA; T+52 báo điều phối.

**Dự phòng lỗi:** scene nào lỗi (selector, trang không tải) thì **agent đó thử lại 1 lần** với storyboard đã sửa; vẫn lỗi thì **bỏ scene đó**: `--assemble` tự bỏ qua scene thiếu và cảnh báo, ghép phần còn lại. Agent 10 ghi scene bị bỏ vào báo cáo. Nếu < 3 scene quay được hoặc script hỏng hẳn: dùng **biến thể B** (quay tay bằng Claude trong Chrome, cuối file này) và báo điều phối.

## Lệnh dùng chung (storyboard là `docs/storyboard-demo.json`)

```bash
# Agent k (2–7): quay đúng 1 scene, trên cổng riêng của mình
node tools/demo-video.cjs --url http://localhost:80XX/ --storyboard docs/storyboard-demo.json --scene <id> --out out
# Agent 8: thẻ đầu/cuối
node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --cards-only --out out
# Agent 10: ghép (thêm --voice loi-thoai.mp3 nếu có giọng; --max 120 mặc định)
node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --assemble --out out
```
Ra `out/demo-<app>.mp4`, `out/demo-<app>-contact.png`, `out/demo-<app>.srt`, `out/00-demo-video.mp4` (bản sao), `out/00-demo-video-poster.png`. Mỗi scene độc lập tự nạp `?demo=1` (nên storyboard phải cho **mỗi scene tự đứng được**: không giả định dữ liệu vừa thêm ở scene trước).

## Prompt 1 (Agent 1, Haiku): điền storyboard

```markdown
Bạn là agent Storyboard của đội Xclipse. KHÔNG sửa mã app. Đầu vào: `docs/spec-nhanh.md` (5 tính năng theo thứ tự), `tools/demo-video.example.json` (mẫu), mã trong `features/*/feature.js` (để lấy selector thật). App: **{{TEN_APP}}**, link **{{LINK_DEMO}}**.
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

## Prompt 2–7 (Agent quay scene, Haiku/Sonnet), thay `<id>` và cổng

```markdown
Bạn là agent Quay scene `<id>`. KHÔNG sửa mã app. Chờ `docs/storyboard-demo.json` (agent 1 làm). Chạy server riêng nếu không dùng Pages: `python3 -m http.server 80XX` trong thư mục app (cổng 8232–8237, KHÔNG dùng 8000).
Lệnh: `node tools/demo-video.cjs --url {{LINK_DEMO_HOAC_localhost:80XX}} --storyboard docs/storyboard-demo.json --scene <id> --out out`
Sau đó đọc `out/scenes/<id>.json` (dur, caption) và trích 2 khung hình của `out/scenes/<id>.mp4` (`ffmpeg -ss 3 -i ... -frames:v 1`): có thấy chấm chạm khi bấm, không trang trắng, không toast/khóa/email thật? Lỗi (cảnh báo "hành động lỗi") thì sửa selector/`wait` của scene `<id>` trong storyboard và quay lại ĐÚNG 1 lần. Báo: `id`, thời lượng, ổn/lỗi, đã sửa gì. Tắt server khi xong.
```

## Prompt 8, 9 (Haiku)

```markdown
Agent 8: chạy `node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --cards-only --out out`; xem `out/scenes/title.png` và `end.png`: tên app, tagline, link đúng, đủ dấu tiếng Việt. Báo đường dẫn.

Agent 9: đọc `docs/storyboard-demo.json`. Soát `caption` từng scene: ≤ 12 từ, kiểu định danh, đủ dấu, không số/ngày/tên bịa (so với form và `docs/spec-nhanh.md`). Sửa trực tiếp trong storyboard VÀ trong `out/scenes/<id>.json` (trường caption) nếu scene đã quay. Nếu đội muốn giọng: viết `docs/loi-thoai-video.txt`, 1 câu mỗi scene, tổng ≤ 110 giây (~2,2 từ/giây). KHÔNG làm danh sách cắt/bản ngắn (chỉ có một video). Giọng đọc do đội thu hoặc công cụ TTS của đội; không đưa API key vào repo.
```

## Prompt 10 (Agent ghép + QA, Sonnet)

```markdown
Bạn là agent Ghép + QA. KHÔNG sửa mã app. Khi agent 2–9 báo xong (hoặc quá T+51):
1. `node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --assemble --out out` (thêm `--voice loi-thoai.mp3` nếu có). Scene thiếu thì script tự bỏ qua và cảnh báo; ghi tên scene bị bỏ.
2. QA bằng ffprobe và ảnh: `demo-<app>.mp4` **≤ 120 giây** và **1080×1920**; xem `out/demo-<app>-contact.png` + trích 5 khung hình đều nhau: phụ đề đủ dấu, không tràn, thấy chấm chạm, nhãn "Dữ liệu mô phỏng AI · Dữ liệu mẫu" ở chân khung, không khóa/email thật. Lỗi nhỏ: sửa storyboard, quay lại scene liên quan và ghép lại ĐÚNG 1 lần.
3. **Lưu đúng tên:** `docs/minh-chung/demo-{{TEN_APP_SLUG}}.mp4` + `.srt` + `-contact.png` · `docs/minh-chung/00-demo-video.mp4` (bản sao) · `docs/minh-chung/00-demo-video-poster.png` · và chép `00-demo-video.mp4` + poster vào `deck/assets/`. Không commit mp4 nếu `.gitignore` chặn.
4. Báo (≤ 8 dòng): đường dẫn, thời lượng thật, độ phân giải, scene bị bỏ, hash commit, thời gian dựng; "Dữ liệu trong video là **dữ liệu mẫu / mô phỏng**" khi đang chạy mô phỏng (không ghi "AI thật").
```

## Giọng đọc tuỳ chọn

Video mặc định **không tiếng** (đủ làm minh chứng, sân khấu có người nói). Có giọng: agent 9 viết kịch bản, đội thu hoặc dùng TTS; lưu `loi-thoai.mp3` **ngoài repo**; agent 10 chạy thêm `--voice`. Script tự chuẩn hoá **-16 LUFS** và đặt giọng bắt đầu sau thẻ đầu.

## Biến thể B: Claude trong Chrome (khi Playwright/ffmpeg hỏng)

```markdown
Bạn là Claude trong Chrome. Hãy giúp tôi quay video demo DỌC của {{TEN_APP}} ({{LINK_DEMO}}, thêm ?demo=1).
1. DevTools → thanh thiết bị → Responsive 390 × 844, DPR 3, zoom 100%. Cửa sổ ẩn danh, tắt thông báo.
2. Tôi bật ghi màn hình (Windows: Win+G; macOS: ⇧⌘5, chọn vùng chỉ khung điện thoại). Khi tôi nói "bắt đầu", bạn lần lượt: [liệt kê scene: bấm gì, gõ gì, cuộn tới đâu], dừng 1,5 giây sau mỗi bước; bấm chậm.
3. Tổng ≤ 120 giây. Không tên người thật, không khóa API, không thông báo hệ thống.
4. Sau khi dừng ghi, nhắc tôi lưu `demo-{{TEN_APP_SLUG}}.mp4` (và bản sao `00-demo-video.mp4`) và chụp ảnh bìa `00-demo-video-poster.png`.
```
Thêm chữ bằng CapCut/Clipchamp hoặc để nguyên (người nói thuyết minh). Ghi trong báo cáo: "quay tay, không có phụ đề đốt".
