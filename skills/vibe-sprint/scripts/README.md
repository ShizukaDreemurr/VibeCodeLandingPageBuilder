# scripts/: công cụ dòng lệnh của vibe-sprint

Chỉ cần Node 18+. `new-project.sh` chép ba file `.mjs` dưới đây vào `scripts/` của dự án mới.

| Tệp | Dùng khi nào | Lệnh |
|---|---|---|
| `new-project.sh` | Đầu giờ: tạo dự án từ bộ mẫu | `scripts/new-project.sh <tên> ["Tên sản phẩm"] [thư-mục-cha]` |
| `scan-secrets.mjs` | Trước mỗi commit và lúc nộp | `node scripts/scan-secrets.mjs . [.env.local]` |
| `doctor.mjs` | Trước giờ thi, ở nhà | `node scripts/doctor.mjs` |
| `nop-bai.mjs` | Phút 55–60, lúc chốt bài | `node scripts/nop-bai.mjs --url <link demo>` |

## doctor.mjs
Bảng **ĐẠT / LƯU Ý / LỖI** bằng tiếng Việt: phiên bản Node, git user, chạm được remote (`git ls-remote`), Playwright (và Chromium), pptxgenjs (chỉ cần khi xuất .pptx), skill `~/.claude/skills/vibe-sprint`, Worker proxy AI (`/health`), link GitHub Pages, nhánh `nop-bai` trên repo chung kết. Mạng bị chặn chỉ cho LƯU Ý. Mã thoát 1 nếu có LỖI. Cờ: `--repo <URL>`, `--json`.

## nop-bai.mjs
Một lệnh lúc chốt, theo thứ tự:
1. Git sạch và HEAD khớp `origin/<nhánh>` (đã push).
2. In hash commit và giờ ISO theo Asia/Ho_Chi_Minh (+07:00).
3. Chạy `scan-secrets` (thêm `.env.local` nếu có).
4. Kiểm README có đủ: link demo, cách chạy, công nghệ, dữ liệu mẫu/BTC, giả định & cách tính, khung chuẩn bị trước, công cụ AI (và cảnh báo còn `<…>`/`{{…}}`).
5. Chụp ảnh dọc 390×844 và 360×780 @3x, sáng/tối, mọi tab, cộng 1 ảnh desktop, vào `docs/minh-chung/<thời điểm>/`, mỗi ảnh có thanh chú thích (commit, phiên bản, giờ, cỡ máy, URL) và `manifest.json`.
6. Tạo ZIP mã nguồn ở thư mục cha của repo (bỏ `.git`, `node_modules`, `.env*`, `*.zip`).
7. In 4 món nộp: link demo, link mã nguồn + ZIP, link README, thư mục minh chứng.

Cờ: `--url`, `--no-shots`, `--no-demo` (mặc định thêm `?demo=1` khi chụp), `--dry-run` (ghi vào thư mục tạm, lỗi git chỉ là lưu ý; dùng để thử), `--out`, `--zip-dir`. Mã thoát 1 nếu có LỖI. Thư mục minh chứng cần commit riêng (`git add docs/minh-chung`) nếu muốn có link trên GitHub; ZIP đừng commit.
