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

Mặc định cho sprint: **worktree + chia file theo feature** (mỗi tính năng 1 thư mục `features/<tên>/feature.js` đăng ký bằng `EP.register`, tùy chọn 1 file `css/<tên>.css` trong `@layer components`).

## Schema Contract (bắt buộc, T+5, trước khi spawn)

Lỗi thật từ lần chạy thử (`09-case-study-de7-livetrack.md`): hai agent đặt hai tên cho một trường (`promoCost` vs `adSpend`; `clickToOrderPct` vs `cr`), test đỏ ở phút cuối. Cách chặn:

1. Ở T+5, ngay sau spec, điều phối viên viết khối **Schema Contract** 10-15 dòng ở đầu `docs/spec-nhanh.md` (mục 0, mẫu trong `templates/spec-nhanh.md`): entity + tên trường + kiểu; tên hàm + hình dạng giá trị trả về; tên collection; id `EP.*`.
2. **Chưa có contract thì chưa spawn.** Prompt mỗi agent (feature, shell, AI, data, QA, polish) dán contract nguyên văn vào `{{SCHEMA_CONTRACT}}`; agent không được tự đặt tên, thiếu thì dừng và hỏi.
3. Đổi tên giữa chừng = sửa contract một chỗ + gửi bản mới cho mọi agent đang chạy (`SendMessage`). Sau merge, QA grep tên lệch contract.

## Quy tắc tính toán và dữ liệu

- **Code tính số, AI diễn giải.** Mọi con số/tỷ lệ do hàm thuần trong code tính; AI chỉ nhận số đã tính để viết nhận xét. Không để AI tự cộng/chia.
- **Mẫu số = 0 → `Không đủ dữ liệu`.** Mọi tỷ lệ/phần trăm/trung bình đều có guard này; không bao giờ hiện `0%`, `NaN`, `Infinity`.
- **Mở trống, có nút `Điền dữ liệu mẫu`.** Mặc định app trống (thấy trạng thái rỗng đẹp); dữ liệu demo nạp bằng nút (`EP.demo.reset()`), trừ khi đề yêu cầu có sẵn.
- **Test logic nhanh bằng node `vm`:** `tests/<feature>.cjs` (chép `starter/tests/unit-template.cjs`): nạp `js/*.js` vào sandbox với `EP` giả, assert hàm thuần, chạy khoảng 1 giây, không cần trình duyệt. Playwright chỉ dùng cho giao diện.

## Mẫu 3 đợt và pipeline không rảnh

Chạy thật: 50 phút, 16 agent, 3 đợt, 60/60 test.

| Đợt | Nội dung | Ghi chú |
|---|---|---|
| 1 Lõi | khung + dữ liệu + 3-5 tính năng lõi + AI mock | merge sớm (T+25), luôn có bản chạy được |
| 2 Nâng cấp | sâu hơn tính năng lõi, AI thật/paste, polish, test, deck | mỗi agent nhận contract bản mới nhất |
| 3 Micro-features | các tính năng nhỏ 5-8 phút (xuất, lọc, gợi ý, mẹo) | mỗi cái 1 agent, bỏ được nếu trễ |

**Zero-idle:** không để agent nào ngồi chờ và không để điều phối viên chờ. Khi agent đợt N xong, **spawn ngay** việc đợt N+1 (không đợi cả đợt xong); trong lúc chờ thì điều phối merge, chạy test, chụp ảnh. Agent QA/second-opinion chạy ngay sau mỗi merge. Cổng giờ vẫn là T+40.

## Prompt agent — bắt buộc đủ 9 mục + contract

0. **Khối Schema Contract dán nguyên văn** (cấm đặt tên mới).
1. Bối cảnh 3 dòng: app gì, đề gì, vanilla HTML/CSS/JS không build, UI tiếng Việt.
2. Dòng đầu: `git reset --hard <nhánh>` (nếu worktree) hoặc "làm việc trong thư mục X".
3. Việc cần làm: trích đoạn spec của tính năng (Input/Quy tắc/Output/Lưu trữ) + nghiệm thu.
4. **File được sửa / file CẤM đụng** (liệt kê tên). Feature agent chỉ thêm đúng MỘT dòng `<script src="features/<tên>/feature.js"></script>` vào khối FEATURES của `index.html` (trước `js/app.js`), mỗi tag một dòng. Bảng sở hữu file đầy đủ: `prompts/00-README.md`.
5. **Cổng riêng** (xem bảng), chạy `setsid nohup python3 -m http.server <cổng> &` ở gốc worktree của mình; **tuyệt đối không dùng 8000** và không dùng cổng agent khác.
6. Cách verify: `node tests/smoke.cjs http://localhost:<cổng>/ [--shots thư-mục]` + Playwright (`require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`), viewport 360x780 + 390x844 (+ desktop phụ), **chụp ảnh và tự xem lại ảnh**, chạy test của mình (`tests/<feature>.cjs`), nêu lệnh.
7. Quy tắc chất lượng: link tới `references/03` (tokens, sáng/tối, trạng thái rỗng/loading/lỗi, validation, mock có nhãn).
8. Commit (worktree): message ngắn + trailer `Co-Authored-By` theo hệ thống. Không push.
9. Báo cáo cuối: file đã đổi, lệnh test + kết quả thật, ảnh ở đâu, việc chưa xong/giả định.

Dùng file trong `prompts/` làm khuôn rồi điền; đừng viết tay từ đầu.

## Bảng cổng (không bao giờ 8000)

Bảng duy nhất, giống `SKILL.md` (nguồn chính) và `prompts/00-README.md`:

| Vai | Cổng |
|---|---|
| Điều phối (bản merge) | 8211 |
| Shell/brand | 8212 |
| AI | 8213 |
| Data/demo | 8214 |
| Polish #1, #2 | 8215, 8216 |
| Feature F1…F8 | 8217–8224 |
| Deck | 8225 |
| Docs | 8226 |
| QA #1…#3 | 8227–8229 |
| Cấp cứu / dự phòng | 8230 |
| Giả định & mô hình kinh doanh (prompt 13) | 8231 |
| Video demo (prompt 17) | 8232–8239 |
| Gemini Antigravity (`ag/ui` 8240, `ag/data` 8241, `ag/docs` 8242, `ag/biz` 8243, còn lại dự phòng) | 8240–8249 |
| **8000** | **CẤM** |

`tests/smoke.cjs` nhận URL từ tham số dòng lệnh (`node tests/smoke.cjs http://localhost:8211/`; mặc định `http://localhost:8201/` chỉ để chạy tay, đừng dựa vào). Test viết thêm cho feature cũng phải nhận URL từ `argv`, không hardcode cổng.

## Quy trình merge (điều phối viên)

```
git status                      # sạch trước khi merge
git merge --no-ff <nhánh-agent> # lần lượt: shell → data → AI → feature 1..N → deck/docs
node --check js/*.js features/*/feature.js     # mỗi lần merge xong
node tests/smoke.cjs http://localhost:8211/      # test nhanh (+ tests/<feature>.cjs nếu có)
```
Thứ tự: nền (shell/tokens/storage) trước, rồi AI + dữ liệu, rồi các tính năng, cuối cùng docs/deck.

### Xung đột hay gặp và cách giải

| Nơi | Triệu chứng | Cách giải |
|---|---|---|
| `index.html` thẻ `<script>` | Hai nhánh cùng thêm script cuối khối FEATURES | Giữ **cả hai** dòng (mỗi tag một dòng), `js/app.js` luôn cuối; `js/demo-data.js` sau các feature |
| `css/*.css` ngoặc `}` | Merge xong thiếu/thừa `}` làm CSS sau không chạy | Đếm `{`/`}` (`python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"`) hoặc mở app xem; CSS nằm trong `@layer components {}` (thứ tự layer khai báo ở `css/tokens.css`), kiểm tra khối đóng |
| `EP.register` trùng `id` | Hai feature cùng tên tab (bản sau thay bản trước) | Đổi `id` cho khác nhau; mỗi `id` = một đường `#/id` |
| `js/version.js`, `?v=` trong `index.html` | cùng tăng version | Lấy bản cao hơn rồi chạy `node tools/bump-version.cjs` MỘT lần ở cuối (không sửa tay) |
| `js/config.js` `mockNotice` | khác câu nhãn mock | Giữ câu NGUYÊN VĂN từ đề/BTC (xem `prompts/00-README.md`); `tests/smoke.cjs` tự đọc `EP.config.mockNotice` nên không cần sửa test |
| `docs/*` | Hai bản README | Điều phối viên giữ 1 bản, dán mục còn lại |

Conflict phức tạp (>2 file): **không tự vá lâu** — abort merge, spawn agent "rebase nhánh X lên nhánh chính và giải xung đột" với prompt có đúng diff lỗi.

## Reset worktree agent

Trong worktree của agent trước khi làm: `git fetch 2>/dev/null; git reset --hard <nhánh-chính>`; xác nhận bằng `git log -1 --oneline` khớp commit điều phối nêu trong prompt. Nếu agent báo thấy file cũ, lỗi gốc thường là không reset.

## Xác minh sau merge (không bỏ)

1. `node --check` mọi JS (`js/*.js features/*/feature.js`); app mở không lỗi console.
2. Chạy toàn bộ test trên cổng 8211: `node tests/smoke.cjs http://localhost:8211/ --shots shots-merge` + `tests/<feature>.cjs`.
3. Spawn **2 agent QA song song**: (a) luồng 5 tính năng ở **360 và 390px** (điện thoại dọc) + sáng/tối, (b) đầu vào sai/biên + 1 lượt desktop phụ. Họ chụp ảnh, điều phối viên mở xem ảnh.
4. Tốt nhất 1 agent "ý kiến thứ hai" đọc spec và đối chiếu từng nghiệm thu với app thật.
5. Chỉ khi xanh mới `node tools/bump-version.cjs`, `node scripts/scan-secrets.mjs .` (sạch) rồi push.

## Nhịp 60 phút

- T+8 spawn tất cả cùng một tin nhắn (nhiều lệnh gọi song song, background).
- T+25 merge đợt 1 để có bản chạy sớm; agent chưa xong tiếp tục.
- T+40 hết hạn agent: chưa commit = bỏ; spawn QA/polish thay.
- Luôn có bản chạy được trên nhánh chính sau mỗi merge; không để nhánh chính hỏng.

## Mẫu giao việc hay dùng (rút từ Xclipse)

- **Dữ liệu lớn chia theo phần:** mỗi agent một file `partN.json` + validator riêng (id duy nhất, enum hợp lệ, tương phản WCAG, phân bố nhãn); điều phối viên gộp bằng script sinh, không sửa tay file sinh (`07` I1).
- **Việc lặp theo từng ảnh/trang:** 1 Haiku cho mỗi ảnh/trang (xoá watermark, kiểm tra từng landing ở 3 khổ), chạy song song.
- **Lỗi khó tìm nguyên nhân (giật, hiệu ứng mất):** giao Sonnet, không giao Haiku; yêu cầu so với bản còn đúng trước đó và **chụp khung hình giữa lúc chạy** (`07` H4); không chấp nhận "test xanh" thay cho ảnh.
- **Mỗi đợt sửa mobile:** một agent chạy `e2e-mobile` ở 390/360 + đo vùng chạm, một agent chỉ xem ảnh và liệt kê lỗi bố cục; sửa theo cả lớp lỗi ("áp dụng cho mọi landing tương tự").
- **Sau khi gộp:** chạy lại toàn bộ test ở nhánh gộp; test Firebase/emulator do điều phối viên chạy (agent sandbox không có); báo cáo ghi rõ phần chưa thử trên máy thật.
- Quy ước viết dùng chung cho mọi prompt: `references/08-quy-uoc-viet.md`; đoạn mã mẫu: `references/07-cookbook-code-mau.md`.
