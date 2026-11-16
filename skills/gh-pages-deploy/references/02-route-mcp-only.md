# Đường B — Chỉ GitHub MCP / connector (không có shell, ví dụ claude.ai chat)

## Quy trình
1. `get_me` -> lấy `login` (chủ sở hữu). Không có tool này: hỏi người dùng username.
2. Preflight bằng tay (không chạy được script): kiểm `index.html`, đường dẫn `/`, bí mật (đọc file), thêm `.nojekyll` (nội dung rỗng; nếu tool không nhận chuỗi rỗng thì dùng một dòng trống `"\n"`).
3. **Xác nhận public** với người dùng, rồi `create_repository` (name chữ thường-gạch-ngang, `private: false`, `autoInit: true` để có nhánh `main`). Repo đã tồn tại: `get_file_contents` ở gốc để xem trước, hỏi trước khi ghi đè.
4. `push_files` theo lô (owner, repo, branch `main`, message, `files: [{path, content}]`):
   - Mỗi lô ~10–20 file hoặc < ~1 MB nội dung để tránh lỗi quá lớn; file lớn đẩy riêng.
   - Đẩy `index.html` + `.nojekyll` ở lô đầu.
   - Không đẩy `node_modules`, `tests/`, `.git`, file `.env`.
5. Kiểm lại: `get_file_contents` liệt kê gốc, so với danh sách đã chuẩn bị.
6. Bật Pages: MCP thường **không** có tool này. Hướng dẫn người dùng (UI tiếng Anh):
   `https://github.com/OWNER/REPO/settings/pages` -> Build and deployment -> Source: **Deploy from a branch** -> Branch: `main`, folder `/ (root)` -> **Save**.
7. Kiểm: `actions_list` (workflow `pages-build-deployment`) hoặc nhờ người dùng mở `https://OWNER.github.io/REPO/` sau 1–5 phút. Nếu có `WebFetch`/curl thì tự kiểm.

## Hạn chế (nói rõ với người dùng)
- `push_files` nhận **văn bản**; file nhị phân (png, jpg, woff2, mp3, zip) qua MCP thường hỏng hoặc không hỗ trợ. Một số server nhận base64 nhưng chậm và giới hạn kích thước.
- Cách né: dùng SVG/emoji/CSS thay ảnh; nhúng ảnh nhỏ dạng data URI trong CSS (<= vài chục KB); ảnh/video lớn -> Đường C (upload web kéo-thả) hoặc để người dùng upload tay.
- Mỗi lệnh `push_files` là một commit; lô quá lớn có thể timeout -> chia nhỏ.
- Không có shell nên không chạy được `preflight.sh`/`verify-pages.sh`; tự kiểm theo checklist trong SKILL.md.
- Không tự bật Pages, không đổi default branch.
