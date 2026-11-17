#!/usr/bin/env bash
# Kiểm tra thư mục app tĩnh trước khi đẩy lên GitHub Pages.
# Dùng: bash preflight.sh <thư-mục-app>   (mặc định: thư mục hiện tại)
# Thoát 0 = OK (có thể có cảnh báo), 1 = có lỗi chặn.
DIR="${1:-.}"
[ -d "$DIR" ] || { echo "LOI: khong thay thu muc '$DIR'"; exit 1; }
cd "$DIR" || exit 1
ERR=0; WARN=0
ok(){ echo "[OK]   $*"; }
warn(){ echo "[CANH BAO] $*"; WARN=$((WARN+1)); }
err(){ echo "[LOI]  $*"; ERR=$((ERR+1)); }
EXCL=(--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=tests --exclude-dir=vendor)

# 1. index.html
if [ -f index.html ]; then ok "index.html o goc"
elif [ -f docs/index.html ]; then ok "index.html o /docs (chon nguon /docs khi bat Pages)"
else err "thieu index.html o goc (hoac /docs)"; fi

# 2. duong dan tuyet doi
ABS=$(grep -rnE "${EXCL[@]}" --include='*.html' --include='*.css' --include='*.js' \
  -e '(src|href|action)=["'"'"']/[^/]' -e 'url\(["'"'"']?/[^/)]' . 2>/dev/null | head -20)
if [ -n "$ABS" ]; then
  err "duong dan bat dau bang '/' (se vo tren github.io/<repo>/):"; echo "$ABS" | sed 's/^/        /'
else ok "khong co duong dan tuyet doi"; fi

# 3. bi mat
SEC=$(grep -rnIE "${EXCL[@]}" -e 'AIza[0-9A-Za-z_-]{20,}' -e 'sk-[A-Za-z0-9_-]{20,}' \
  -e 'ghp_[A-Za-z0-9]{20,}' -e 'github_pat_[A-Za-z0-9_]{20,}' -e '-----BEGIN [A-Z ]*PRIVATE KEY' . 2>/dev/null \
  | cut -c1-140 | head -20)
if [ -n "$SEC" ]; then
  warn "co chuoi giong khoa/bi mat (AIza = Firebase web config thi cong khai duoc, nhung PHAI co rules bao ve; sk-/ghp_/BEGIN KEY thi KHONG duoc dua len):"
  echo "$SEC" | grep -qE 'sk-|ghp_|github_pat_|BEGIN' && err "co khoa KHONG phai Firebase (sk-/ghp_/KEY) - go ra truoc khi day"
  echo "$SEC" | sed -E 's/(AIza|sk-|ghp_|github_pat_)[A-Za-z0-9_-]{6}[A-Za-z0-9_-]*/\1******/g; s/^/        /'
else ok "khong thay chuoi bi mat"; fi
[ -f .env ] && err "co file .env - khong duoc dua len"

# 4. .nojekyll
if [ -f .nojekyll ]; then ok ".nojekyll da co"; else : > .nojekyll; ok "da tao .nojekyll"; fi

# 5. ten file
BAD=$(find . -path ./.git -prune -o -type f -print | grep -E '[[:space:]]|[^ -~]' | head -10)
[ -n "$BAD" ] && { warn "ten file co dau cach/ky tu la (nen doi):"; echo "$BAD" | sed 's/^/        /'; }
DUP=$(find . -path ./.git -prune -o -type f -print | tr 'A-Z' 'a-z' | sort | uniq -d | head)
[ -n "$DUP" ] && warn "ten file chi khac hoa/thuong: $DUP"

# 6. kich thuoc
N=$(find . -path ./.git -prune -o -type f -print | wc -l)
SZ=$(du -sk --exclude=.git . | cut -f1)
echo "[INFO] $N file, $((SZ/1024)) MB (~${SZ} KB)"
[ "$SZ" -gt 1000000 ] && err "site > 1 GB"
BIG=$(find . -path ./.git -prune -o -type f -size +25M -print)
[ -n "$BIG" ] && warn "file > 25 MB (upload web gioi han 25 MB; hard limit 100 MB): $BIG"
[ "$N" -gt 100 ] && warn "> 100 file: upload web phai chia nhieu lan"
echo "---- Ket qua: $ERR loi, $WARN canh bao"
[ "$ERR" -eq 0 ]
