# Đường A — Claude Code (git + gh hoặc GitHub MCP)

## Phát hiện
```bash
git --version; gh --version; gh auth status     # gh đã đăng nhập?
git remote -v; git branch --show-current
```
Hoặc thấy tool `mcp__github__*` (create_repository, create_branch, push_files, get_file_contents, actions_list...).

## Claude Code trên web (cloud session)
- Chỉ push được lên **nhánh của phiên** (thường `claude/<tên>-<id>`). Không push `main` trừ khi được cho phép.
- GitHub App "Claude" phải cài trên repo: https://github.com/apps/claude/installations/select_target . Người dùng tự kết nối GitHub tại claude.ai -> Settings (Connectors).
- Không cần đổi nhánh: Pages phục vụ từ **bất kỳ nhánh nào**, kể cả `claude/<x>`. Bật Pages với đúng nhánh đó.
- Repo chưa có trong phiên: dùng tool add_repo nếu có, hoặc nhờ người dùng thêm repo.

## Các bước (repo đã có, đang ở trong repo)
1. `bash scripts/preflight.sh .` (hoặc thư mục con chứa app). Sửa lỗi.
2. Hỏi xác nhận: repo public? (free plan bắt buộc public cho Pages).
3. Commit + push:
```bash
git add -A && git commit -m "Deploy static app to GitHub Pages"
git pull --no-edit origin "$(git branch --show-current)"
git push -u origin HEAD
```
4. Bật Pages (nhánh hiện tại, thư mục `/` hoặc `/docs`):
```bash
B=$(git branch --show-current)
gh api -X POST repos/OWNER/REPO/pages -f "source[branch]=$B" -f "source[path]=/" \
 || gh api -X PUT repos/OWNER/REPO/pages -f "source[branch]=$B" -f "source[path]=/"
```
   Không có `gh`/quyền API -> hướng dẫn UI (xem `03-route-browser.md` phần Pages).
5. Kiểm: `bash scripts/verify-pages.sh https://OWNER.github.io/REPO/`

## Chưa có repo
```bash
gh repo create TEN-REPO --public --source=. --remote=origin --push   # SAU khi người dùng xác nhận public
```
Hoặc MCP: `create_repository` (name, private=false, autoInit=true) rồi push (xem file 02 để push bằng `push_files`, hoặc `git remote add origin ... && git push -u origin main`).

## Chỉ có GitHub MCP (có git nhưng không có gh)
- Tạo nhánh/repo: `create_repository`, `create_branch`.
- Đẩy file: dùng `git push` nếu remote có sẵn; nếu không, `push_files` (xem 02).
- Trạng thái build: `actions_list` (method `list_workflow_runs`, workflow `pages-build-deployment`), `actions_get`, `get_job_logs` khi fail.
- Bật Pages: MCP thường không có endpoint -> UI.

## Lỗi hay gặp
- `403` / `Permission denied` khi push: app Claude chưa cài, hoặc đang push nhánh không phải nhánh phiên.
- `non-fast-forward`: `git pull --no-edit origin <nhánh>` rồi push lại. KHÔNG force-push nhánh của người khác.
- Remote URL có token: gỡ ngay (`git remote set-url origin https://github.com/O/R.git`).
