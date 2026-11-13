# 02 — Playbook điều phối agent

Rút từ ~160 commit của Xclipse, phần lớn do Sonnet chạy song song và điều phối viên merge.

## Chính sách tài nguyên: xả láng (nhắc lại)

Usage/token **không phải** ràng buộc, chỉ **thời gian** là ràng buộc. Điều phối viên:
- chỉ điều phối (lập kế hoạch, spawn, merge, test, deploy, báo cáo) — **không viết code tính năng**;
- spawn **càng nhiều Sonnet + Haiku 5.5 cùng lúc càng tốt**: 1 agent/tính năng, + shell/UI, AI, dữ liệu demo, deck, docs, QA, polish, research;
- prompt đầy đủ ngữ cảnh dù dài; **không tiết kiệm xác minh** (ảnh chụp, test, chạy lại sau merge);
- ưu tiên spawn thêm agent QA / ý kiến thứ hai thay vì làm tuần tự;
- agent chậm/kẹt → **spawn lại**, đừng chờ.

## Mô hình chọn

| Việc | Model |
|---|---|
| Tính năng có logic, UI, AI, deck, polish, QA phức tạp | Sonnet |
| Dữ liệu demo, README/docs, bảng kiểm thử, QA lặp, research ngắn | Haiku |
| Điều phối | Claude chính, không code |

## Cách cô lập (chọn 1, không trộn)

1. **Worktree** (`isolation: "worktree"`): mỗi agent 1 nhánh riêng. **Bắt buộc dòng đầu prompt: `git reset --hard <nhánh-chính>`** vì worktree có thể bắt đầu từ commit cũ. Agent commit trên nhánh của nó, không push. Điều phối viên `git merge`.
2. **Thư mục rời nhau** (không worktree): mỗi agent sở hữu danh sách file riêng, ghi rõ "không đụng file khác". Phù hợp starter nhỏ. Không commit; điều phối viên commit sau mỗi đợt.

Mặc định cho sprint: **worktree + chia file theo module** (mỗi tính năng 1 file `js/feature-x.js` + 1 đoạn CSS riêng).

## Prompt agent — bắt buộc đủ 9 mục

1. Bối cảnh 3 dòng: app gì, đề gì, vanilla HTML/CSS/JS không build, UI tiếng Việt.
2. Dòng đầu: `git reset --hard <nhánh>` (nếu worktree) hoặc "làm việc trong thư mục X".
3. Việc cần làm: trích đoạn spec của tính năng (Input/Quy tắc/Output/Lưu trữ) + nghiệm thu.
4. **File được sửa / file CẤM đụng** (liệt kê tên). Chèn vào `index.html` chỉ ở đúng điểm neo `<!-- AGENT:feature-x -->`.
5. **Cổng riêng** (xem bảng), chạy `setsid nohup python3 -m http.server <cổng> &`; **tuyệt đối không dùng 8000** và không dùng cổng agent khác.
6. Cách verify: Playwright (`require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`), viewport 390x844 + desktop, **chụp ảnh và tự xem lại ảnh**, chạy test của mình, nêu lệnh.
7. Quy tắc chất lượng: link tới `references/03` (tokens, sáng/tối, trạng thái rỗng/loading/lỗi, validation, mock có nhãn).
8. Commit (worktree): message ngắn + trailer `Co-Authored-By` theo hệ thống. Không push.
9. Báo cáo cuối: file đã đổi, lệnh test + kết quả thật, ảnh ở đâu, việc chưa xong/giả định.

Dùng file trong `prompts/` làm khuôn rồi điền; đừng viết tay từ đầu.

## Bảng cổng (không bao giờ 8000)

| Vai | Cổng |
|---|---|
| Điều phối (bản merge) | 8080 |
| Shell/UI | 8101 |
| Feature 1…N | 8111, 8112, 8113 ... |
| AI | 8121 |
| Demo data | 8131 |
| Deck | 8141 |
| QA | 8151, 8152 ... |
| Polish | 8161, 8162 |

Test không được hardcode cổng: nhận URL từ `argv[2]` hoặc biến môi trường `BASE_URL`, mặc định `http://localhost:8080/`.

## Quy trình merge (điều phối viên)

```
git status                      # sạch trước khi merge
git merge --no-ff <nhánh-agent> # lần lượt: shell → data → AI → feature 1..N → deck/docs
node --check js/*.js            # mỗi lần merge xong
node tests/<test>.cjs http://localhost:8080/   # test nhanh
```
Thứ tự: nền (shell/tokens/storage) trước, rồi AI + dữ liệu, rồi các tính năng, cuối cùng docs/deck.

### Xung đột hay gặp và cách giải

| Nơi | Triệu chứng | Cách giải |
|---|---|---|
| `index.html` thẻ `<script>` | Hai nhánh cùng thêm script cuối danh sách | Giữ **cả hai** dòng, đúng thứ tự phụ thuộc; dùng điểm neo riêng để tránh |
| `css/*.css` ngoặc `}` | Merge xong thiếu/thừa `}` làm CSS sau không chạy | Chạy `node -e` đếm `{`/`}` hoặc mở app xem; bọc trong `@layer app {}` và kiểm tra khối đóng |
| `app.js` hàm trùng | Hai agent sửa cùng hàm | Lấy bản agent sở hữu file; agent kia sửa lại theo bản đó |
| `version.js` | cùng tăng version | Lấy cao hơn, chạy bump 1 lần ở cuối |
| `docs/*` | Hai bản README | Điều phối viên giữ 1 bản, dán mục còn lại |

Conflict phức tạp (>2 file): **không tự vá lâu** — abort merge, spawn agent "rebase nhánh X lên nhánh chính và giải xung đột" với prompt có đúng diff lỗi.

## Reset worktree agent

Trong worktree của agent trước khi làm: `git fetch 2>/dev/null; git reset --hard <nhánh-chính>`; xác nhận bằng `git log -1 --oneline` khớp commit điều phối nêu trong prompt. Nếu agent báo thấy file cũ, lỗi gốc thường là không reset.

## Xác minh sau merge (không bỏ)

1. `node --check` mọi JS; app mở không lỗi console.
2. Chạy toàn bộ test trên cổng 8080.
3. Spawn **2 agent QA song song**: (a) luồng 5 tính năng desktop + sáng/tối, (b) mobile 390px + đầu vào sai/biên. Họ chụp ảnh, điều phối viên mở xem ảnh.
4. Tốt nhất 1 agent "ý kiến thứ hai" đọc spec và đối chiếu từng nghiệm thu với app thật.
5. Chỉ khi xanh mới bump `?v=` rồi push.

## Nhịp 60 phút

- T+8 spawn tất cả cùng một tin nhắn (nhiều lệnh gọi song song, background).
- T+25 merge đợt 1 để có bản chạy sớm; agent chưa xong tiếp tục.
- T+40 hết hạn agent: chưa commit = bỏ; spawn QA/polish thay.
- Luôn có bản chạy được trên nhánh chính sau mỗi merge; không để nhánh chính hỏng.
