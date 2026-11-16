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
#   2. Chép scripts/scan-secrets.mjs, doctor.mjs, nop-bai.mjs vào scripts/ của dự án.
#   3. Chép khung web starter/ và bộ slide deck/ (không chép deck/out, deck/example).
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
         MINH-CHUNG-AI.md KICH-BAN-DEMO.md HOI-DAP.md CUE-CARDS.md CHECKLIST-CHUNG-KET.md; do
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
         KICH-BAN-DEMO.md HOI-DAP.md CUE-CARDS.md CHECKLIST-CHUNG-KET.md; do
  cp "$TPL/$f" "$TARGET/docs/$f"
done

# 2. Công cụ: quét bí mật, kiểm tra máy (doctor), chốt bài (nop-bai)
for f in scan-secrets.mjs doctor.mjs nop-bai.mjs; do
  [ -f "$SCRIPTS/$f" ] && cp "$SCRIPTS/$f" "$TARGET/scripts/$f"
done

# 3. Khung web: chép starter/ (bắt buộc), không ghi đè tệp đã có
[ -d "$STARTER" ] || { echo "Thiếu khung web: $STARTER" >&2; exit 1; }
while IFS= read -r -d '' rel; do
  rel="${rel#./}"
  if [ ! -e "$TARGET/$rel" ]; then
    mkdir -p "$(dirname "$TARGET/$rel")"
    cp "$STARTER/$rel" "$TARGET/$rel"
  fi
done < <(cd "$STARTER" && find . -type f -print0)

# 3b. Bộ slide: chép deck/ (bỏ out/ là sản phẩm xuất, example/ là bản Xclipse mẫu, node_modules/)
DECK="$SKILL_DIR/deck"
if [ -d "$DECK" ]; then
  while IFS= read -r -d '' rel; do
    rel="${rel#./}"
    mkdir -p "$(dirname "$TARGET/deck/$rel")"
    cp "$DECK/$rel" "$TARGET/deck/$rel"
  done < <(cd "$DECK" && find . \( -path ./out -o -path ./example -o -path ./node_modules \) -prune -o -type f -print0)
fi

# 3c. Tệp nền: chỉ ghi nếu starter chưa có
[ -e "$TARGET/.env.example" ] || cat > "$TARGET/.env.example" <<'ENV'
# Chỉ ghi TÊN biến, không ghi giá trị.
# Giá trị điền vào .env.local (file này đã nằm trong .gitignore).
# GEMINI_API_KEY=
ENV
[ -e "$TARGET/.gitignore" ] || cat > "$TARGET/.gitignore" <<'GI'
.env
.env.local
node_modules/
.DS_Store
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

# Đếm chỗ còn <…> cần điền (bỏ qua ví dụ dạng code): "ngay" = CLAUDE.md + spec, "sau" = README + docs còn lại
count_ph() { grep -ohE '<[^<>[:space:]][^<>]*>' "$@" 2>/dev/null | wc -l | tr -d ' '; }
NOW_FILES=("$TARGET/CLAUDE.md" "$TARGET/docs/spec-nhanh.md")
LATER_FILES=("$TARGET/README.md")
for f in "$TARGET"/docs/*.md; do [ "$f" = "$TARGET/docs/spec-nhanh.md" ] || LATER_FILES+=("$f"); done
LEFT_NOW="$(count_ph "${NOW_FILES[@]}")"
LEFT_LATER="$(count_ph "${LATER_FILES[@]}")"

cat <<EOF

Đã tạo dự án: $TARGET
  Tên sản phẩm: $PRODUCT
  Nhánh nộp:    $BRANCH
  Git:          $GIT_NOTE
  Chỗ còn <…>: $LEFT_NOW điền ngay (CLAUDE.md, docs/spec-nhanh.md), $LEFT_LATER để sau (README.md, docs/ còn lại)

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
  7. Điền các mục <…> còn lại trong README.md và docs/ khi có thông tin (lệnh tìm: grep -rn '<' README.md docs).
  8. Bộ slide nằm ở deck/ (xem deck/README.md): cp deck/template.data.js deck/deck.data.js rồi điền.
EOF
