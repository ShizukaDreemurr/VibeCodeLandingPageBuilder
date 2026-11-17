# Khởi động ngày thi (12:40 → 13:15) và câu lệnh mở đầu

> Đọc file này trước khi đọc bất cứ thứ gì khác. Sau 13:15 thì dùng `templates/THE-DIEU-PHOI.md` (bản đã copy sang `docs/THE-DIEU-PHOI.md` nếu có) để biết từng mốc phải gõ gì.

## A. Chuẩn bị máy (12:40–13:05), tick từng ô
- [ ] Sạc laptop, có wifi BTC và **điểm phát 4G dự phòng**.
- [ ] Cài skill (nếu máy chưa có): giải nén `xclipse-skills-final.zip` vào `~/.claude/skills/` → có `vibe-sprint/`, `gh-pages-deploy/`, `firebase-setup/`.
- [ ] Repo thi: `git clone https://github.com/XclipseX/Xclipse-ChungKet.git && cd Xclipse-ChungKet && git checkout nop-bai && git pull` (hoặc `git pull` nếu đã clone).
- [ ] `npm i -g pptxgenjs` (hoặc bỏ qua, chỉ ảnh hưởng xuất PPTX) · Playwright có sẵn: `npx playwright --version`.
- [ ] `node scripts/doctor.mjs` (chạy ở gốc repo thi; nếu chưa có `scripts/` thì `node ~/.claude/skills/vibe-sprint/scripts/doctor.mjs`) → không có dòng **LỖI**.
- [ ] `python3 -m http.server 8211` trong repo thi → mở `http://localhost:8211/?demo=1` (giả lập 390px) thấy banner "Tầm nhìn", thanh tab dưới đáy.
- [ ] Mở link thật trên điện thoại / chế độ 390px: https://xclipsex.github.io/Xclipse-ChungKet/ (chân trang ghi phiên bản mới nhất).
- [ ] Mở sẵn 5 tab: **Claude Code** (terminal ở thư mục repo thi) · **Claude Design** (claude.ai) · **Claude in Chrome** · **Gemini Antigravity** · **link Pages**.
- [ ] Gemini đã nhận `PROMPT-DONG-BO-GEMINI.md` + `PROMPT-DONG-BO-GEMINI-2.md` và nạp zip mới.
- [ ] In / mở sẵn: `templates/THE-DIEU-PHOI.md`, `templates/CUE-CARDS.md`.
- [ ] Ghi tên trường thật vào chỗ `{{TRUONG}}` trong `README.md` của repo thi (1 phút).

## B. Câu lệnh mở đầu cho Claude Code (dán NGUYÊN khối khi có đề, kèm đề + file dữ liệu BTC)

```
Kích hoạt skill vibe-sprint. Chính sách tài nguyên: xả láng — usage/token không phải ràng buộc, chỉ thời gian là ràng buộc; bạn CHỈ điều phối, spawn tối đa agent Sonnet/Haiku song song, không tự viết code tính năng.

Bối cảnh cố định:
- Chung kết VIBE-CODING 2026, Bảng B – Kinh tế, 60 phút. Đội Xclipse: Diệu Anh (bối cảnh, người dùng, UI/UX), Vũ Trí Dũng (tính năng, nghiệp vụ, demo), Nguyên (kỹ thuật, giả định & mô hình kinh doanh, tổng kết; người điều phối).
- Làm trong repo hiện tại (XclipseX/Xclipse-ChungKet, nhánh nop-bai). Khung vibe-sprint đã có sẵn: KHÔNG chạy new-project.sh, KHÔNG tạo repo mới. Link Pages: https://xclipsex.github.io/Xclipse-ChungKet/
- Đọc trước, theo thứ tự: CLAUDE.md của repo, ~/.claude/skills/vibe-sprint/SKILL.md, references/00-the-le-chung-ket.md, references/13-chuan-mobile.md, references/11 + 12 (kinh doanh), templates/THE-DIEU-PHOI.md.
- Ưu tiên điểm Bảng Kinh tế: phần lõi 27 · điện thoại 10 · giao diện 5 · cơ chế kinh doanh/ưu đãi thực tế 10 · phân tích mô hình kinh doanh 22 · số liệu dự phòng & giả định 17 · hồ sơ 9. Dùng EP.scenario (giả định, 3 kịch bản, hòa vốn, độ nhạy) và EP.importer (file BTC).
- Mobile-first 360–390px dọc là chuẩn chấm. Slide chỉ dùng ảnh điện thoại dọc. Nhóm không bấm slide (kỹ thuật viên bấm theo câu "Mời chuyển slide").
- Không làm sẵn tính năng ngoài đề; README khai báo khung chuẩn bị trước + công cụ AI (Claude Opus/Sonnet/Haiku, Claude Design, Claude in Chrome, Gemini Antigravity).
- Trước khi nộp (T+40–48): đặt showPlayground: false trong js/config.js; chốt bài (T+50–55, sau khi đã push bản cuối): node scripts/nop-bai.mjs --url https://xclipsex.github.io/Xclipse-ChungKet/ (ảnh minh chứng vào docs/minh-chung/).

Việc ngay (T+0 → T+5): đọc đề dưới đây, mở file dữ liệu BTC (liệt kê sheet/cột), viết docs/spec-nhanh.md gồm: 5 tính năng + tiêu chí nghiệm thu, mục 0 Schema Contract (tên trường, tên hàm, kiểu trả về), danh sách giả định có nguồn (references/12 §0 và §8.1–8.2; loại đề → giả định: references/11 §2), nhãn dữ liệu mẫu/mô phỏng (chép nguyên văn nếu đề có). Đưa tôi duyệt trong ≤ 5 phút. Sau khi tôi gõ "duyệt", làm tiếp theo THE-DIEU-PHOI: T+8 điền prompts/14 (khung slide) + prompts/16 (Gemini) cho tôi dán đi, đồng thời spawn đợt 1.

ĐỀ:
<<<DÁN ĐỀ Ở ĐÂY>>>
FILE DỮ LIỆU BTC: <<<đường dẫn file>>>
```

## C. Nếu sự cố ngay lúc mở đầu
| Sự cố | Làm ngay |
|---|---|
| Claude Code không thấy skill | Dán thêm: "Đọc skill tại `<đường dẫn thư mục giải nén>/vibe-sprint/SKILL.md`." |
| Mất mạng | Bật điểm phát 4G; app vẫn chạy local cổng 8211, AI chạy chế độ mô phỏng có nhãn. |
| Claude hết lượt | Gửi Gemini `prompts/16` khối B5 (Gemini tiếp quản điều phối). |
| `doctor` báo LỖI git | `gh auth login` hoặc đăng nhập GitHub Desktop; thử `git push --dry-run`. |
