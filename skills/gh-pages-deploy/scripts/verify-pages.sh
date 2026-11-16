#!/usr/bin/env bash
# Cho den khi URL GitHub Pages tra HTTP 200 (toi da 10 phut), in status + <title>.
# Dung: bash verify-pages.sh <url> [giay-toi-da=600]
URL="$1"; MAX="${2:-600}"
[ -n "$URL" ] || { echo "Dung: $0 <url> [giay]"; exit 2; }
START=$(date +%s); N=0
while :; do
  N=$((N+1))
  TMP=$(mktemp)
  CODE=$(curl -sL -m 20 -o "$TMP" -w '%{http_code}' "${URL}$([[ $URL == *\?* ]] && echo '&' || echo '?')v=$(date +%s)" 2>/dev/null)
  [ -z "$CODE" ] && CODE=000
  TITLE=$(tr '\n' ' ' < "$TMP" | sed -n 's/.*<title[^>]*>\([^<]*\)<\/title>.*/\1/Ip' | head -1)
  rm -f "$TMP"
  echo "[$(( $(date +%s)-START ))s] lan $N: HTTP $CODE  title: ${TITLE:-<khong co>}"
  if [ "$CODE" = "200" ]; then echo "OK: $URL dang chay"; exit 0; fi
  [ $(( $(date +%s)-START )) -ge "$MAX" ] && { echo "HET GIO sau ${MAX}s. Xem references/04-troubleshooting.md"; exit 1; }
  sleep 15
done
