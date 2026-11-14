#!/usr/bin/env bash
# new-project.sh: tạo thư mục dự án sprint 60 phút từ bộ mẫu vibe-sprint.
#
# Cách dùng:
#   scripts/new-project.sh <tên-thư-mục> ["Tên sản phẩm"] [thư-mục-cha]
#   BRANCH=nop-bai scripts/new-project.sh xclipse-event "Xclipse" ~/contest
#
# Tên thư mục: chữ thường, số, gạch nối (ví dụ: xclipse-event).
# Mặc định: tên sản phẩm = tên thư mục; thư mục cha = thư mục hiện tại; nhánh = nop-bai.
#
# Làm gì:
#   1. Chép templates/ vào dự án: CLAUDE.md và README.md ở gốc, các tài liệu còn lại vào docs/.
#   2. Chép scripts/scan-secrets.mjs vào scripts/ của dự án.
#   3. Tạo khung web tối thiểu (index.html, css/, js/) nếu chưa có thư mục starter/.
#   4. Thay <Tên sản phẩm> bằng tên thật, đặt tên nhánh trong CLAUDE.md.
#   5. git init với nhánh đã chọn (không commit, để đội tự commit sau khi kiểm tra).

set -euo pipefail

usage() {
  sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
  exit 2
}

[ $# -ge 1 ] || usage
[ "${1:-}" != "-h" ] && [ "${1:-}" != "--help" ] || usage

SLUG="$1"
PRODUCT="${2:-$SLUG}"
PARENT="${3:-$PWD}"
BRANCH="${BRANCH:-nop-bai}"

if ! [[ "$SLUG" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Tên thư mục chỉ gồm chữ thường, số và gạch nối: '$SLUG'" >&2
  exit 2
fi
if ! [[ "$BRANCH" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]]; then
  echo "Tên nhánh không hợp lệ: '$BRANCH'" >&2
  exit 2
fi

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$SKILL_DIR/templates"
SCRIPTS="$SKILL_DIR/scripts"
STARTER="$SKILL_DIR/starter"

for f in CLAUDE.md README-du-thi.md spec-nhanh.md PROGRESS.md DECISIONS.md BANG-KIEM-THU.md \
         MINH-CHUNG-AI.md KICH-BAN-DEMO.md HOI-DAP.md CHECKLIST-CHUNG-KET.md; do
  [ -f "$TPL/$f" ] || { echo "Thiếu mẫu: $TPL/$f" >&2; exit 1; }
done

TARGET="$PARENT/$SLUG"
if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null)" ]; then
  echo "Thư mục đã tồn tại và không trống: $TARGET" >&2
  exit 1
fi

mkdir -p "$TARGET/docs/minh-chung-ai" "$TARGET/scripts"

# 1. Tài liệu
cp "$TPL/CLAUDE.md" "$TARGET/CLAUDE.md"
cp "$TPL/README-du-thi.md" "$TARGET/README.md"
for f in spec-nhanh.md PROGRESS.md DECISIONS.md BANG-KIEM-THU.md MINH-CHUNG-AI.md \
         KICH-BAN-DEMO.md HOI-DAP.md CHECKLIST-CHUNG-KET.md; do
  cp "$TPL/$f" "$TARGET/docs/$f"
done

# 2. Công cụ kiểm tra bí mật
cp "$SCRIPTS/scan-secrets.mjs" "$TARGET/scripts/scan-secrets.mjs"

# 3. Khung web: chép starter/ (không ghi đè), rồi bổ sung các tệp nền còn thiếu
if [ -d "$STARTER" ]; then
  while IFS= read -r -d '' rel; do
    rel="${rel#./}"
    if [ ! -e "$TARGET/$rel" ]; then
      mkdir -p "$(dirname "$TARGET/$rel")"
      cp "$STARTER/$rel" "$TARGET/$rel"
    fi
  done < <(cd "$STARTER" && find . -type f -print0)
fi

# ensure_file <đường-dẫn-tương-đối>: đọc nội dung từ stdin, chỉ ghi nếu tệp chưa có
ensure_file() {
  local path="$TARGET/$1"
  if [ -e "$path" ]; then
    return 0
  fi
  mkdir -p "$(dirname "$path")"
  cat > "$path"
}

ensure_file index.html <<'HTML'
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>__PRODUCT__</title>
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <main class="wrap">
    <h1>__PRODUCT__</h1>
    <p>Khung ứng dụng sprint. Thay nội dung này bằng tính năng T1.</p>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
HTML
ensure_file css/app.css <<'CSS'
:root { --bg: #ffffff; --fg: #1b1b1f; --accent: #2563eb; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0f1115; --fg: #e8e8ec; --accent: #60a5fa; }
}
:root[data-theme="dark"] { --bg: #0f1115; --fg: #e8e8ec; --accent: #60a5fa; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: system-ui, "Be Vietnam Pro", sans-serif;
}
.wrap { max-width: 640px; margin: 0 auto; padding: 16px; }
CSS
ensure_file js/app.js <<'JS'
// Tính năng T1 đến T5 viết ở đây, theo docs/spec-nhanh.md.
JS
ensure_file .env.example <<'ENV'
# Chỉ ghi TÊN biến, không ghi giá trị.
# Giá trị điền vào .env.local (file này đã nằm trong .gitignore).
# GEMINI_API_KEY=
ENV
ensure_file .gitignore <<'GI'
.env
.env.local
node_modules/
.DS_Store
undefined/
GI

# 4. Thay tên sản phẩm và nhánh
ESC_PRODUCT="$(printf '%s' "$PRODUCT" | sed -e 's/[\/&|]/\\&/g')"
ESC_BRANCH="$(printf '%s' "$BRANCH" | sed -e 's/[\/&|]/\\&/g')"
while IFS= read -r -d '' file; do
  sed -i -e "s|<Tên sản phẩm>|$ESC_PRODUCT|g" -e "s|__PRODUCT__|$ESC_PRODUCT|g" \
         -e "s|<tên nhánh>|$ESC_BRANCH|g" "$file"
done < <(find "$TARGET" -type f \( -name '*.md' -o -name '*.html' \) -print0)

# 5. Git (không commit)
if command -v git >/dev/null 2>&1; then
  git -C "$TARGET" init -q
  git -C "$TARGET" symbolic-ref HEAD "refs/heads/$BRANCH"
  GIT_NOTE="đã git init, nhánh $BRANCH (chưa commit)"
else
  GIT_NOTE="KHÔNG có git: cài git rồi chạy 'git init' trong thư mục dự án"
fi

# Đếm chỗ còn <…> cần điền (bỏ qua ví dụ dạng code)
LEFT="$(grep -ohE '<[^<>[:space:]][^<>]*>' "$TARGET/CLAUDE.md" "$TARGET/README.md" "$TARGET"/docs/*.md 2>/dev/null | wc -l | tr -d ' ')"

cat <<EOF

Đã tạo dự án: $TARGET
  Tên sản phẩm: $PRODUCT
  Nhánh nộp:    $BRANCH
  Git:          $GIT_NOTE
  Chỗ còn <…> cần điền: khoảng $LEFT

Các bước tiếp theo:
  1. cd "$TARGET"
  2. Mở docs/spec-nhanh.md, điền trong 5 phút đầu, chốt 5 tính năng và phần ngoài phạm vi.
  3. Mở docs/PROGRESS.md, ghi T0 (giờ bắt đầu) và làm theo run-sheet.
  4. Trước mỗi lần commit: node scripts/scan-secrets.mjs .
  5. Tạo repo trên GitHub, rồi:
       git add . && git commit -m "Khởi tạo dự án"
       git remote add origin <URL repo>
       git push -u origin $BRANCH
  6. Bật GitHub Pages: Settings → Pages → Deploy from a branch → $BRANCH, thư mục /(root).
  7. Điền các mục <…> còn lại trong README.md và docs/ (lệnh tìm: grep -rn '<' README.md docs).
EOF
