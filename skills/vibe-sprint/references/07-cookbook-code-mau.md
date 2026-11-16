# 07 — Cookbook: đoạn mã mẫu chép-dán (mỗi đoạn ≤ 15 dòng)

Rút từ code thật của Xclipse (`js/`, `css/`, `tools/`, `tests/`, `firebase/`, `s/`) và từ các lỗi đã gặp. Dán đoạn liên quan vào prompt agent. Đoạn nào starter đã có sẵn thì ghi rõ `starter` để dùng bản của starter, không viết lại. Cổng thi tự chọn trong bảng cổng (không 8000). Biến `{{...}}` là chỗ phải điền.

Mục lục: A Phát hành & cache · B Sáng/tối & chuyển động · C Gotcha CSS/mobile · D Form, dữ liệu, tiện ích · E AI · F SEO & chia sẻ · G Firebase, Pages, Sheet · H Test, minh chứng, git · I Dữ liệu sinh hàng loạt.

---

## A. Phát hành & cache

### A1. Cache-busting `?v=` (cốt lõi của `tools/bump-version.cjs`, starter đã có bản đầy đủ)
```js
// node tools/bump-version.cjs  (đọc version trong js/version.js rồi gắn ?v= cho mọi js/css nội bộ)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const v = fs.readFileSync(path.join(root, 'js/version.js'), 'utf8').match(/version: '([^']+)'/)[1];
['index.html', '404.html'].forEach((name) => {
  const f = path.join(root, name); if (!fs.existsSync(f)) return;
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace(/(<script (?:defer )?src="(?:js|features)\/[\w./-]+\.js)(\?v=[^"]*)?"/g, '$1?v=' + v + '"')
    .replace(/(<link rel="stylesheet" href="css\/[\w.-]+\.css)(\?v=[^"]*)?"/g, '$1?v=' + v + '"'));
});
```
Gotcha: **hotfix nào cũng phải bump** (đã có lần vá xong mà "chưa tăng số phiên bản nên máy khách còn bản cũ"). Sau push: đóng tab, mở lại, Ctrl+Shift+R, đọc số phiên bản ở chân trang.

### A2. Chân trang hiện phiên bản + commit đang chạy trên nhánh Pages (`js/version.js` của Xclipse)
```js
// Chỉ hỏi GitHub khi chạy trên *.github.io; cache sessionStorage 10 phút; lỗi mạng thì chỉ hiện số phiên bản.
if (!/github\.io$/.test(location.hostname)) return;
fetch('https://api.github.com/repos/{{owner}}/{{repo}}/commits/{{nhánh-pages}}', { headers: { Accept: 'application/vnd.github+json' } })
  .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then((d) => { el.textContent = 'commit ' + String(d.sha).slice(0, 7); el.href = d.html_url; })
  .catch(() => { /* hết lượt GitHub: bỏ qua, không báo lỗi */ });
```

---

## B. Giao diện sáng/tối & chuyển động

### B1. Chống nháy sáng/tối: script **đồng bộ trong `<head>`**, trước CSS (`starter/index.html` đã có)
```html
<script>(function(d){try{var t=localStorage.getItem('ep_theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})(document.documentElement);</script>
```
Khoá phải trùng `<prefix>theme`; đổi `prefix` thì đổi luôn chuỗi này. Không chọn gì = bỏ attribute, CSS theo `prefers-color-scheme`.

### B2. CSS 3 chỗ cho mỗi bộ màu (sáng, tối theo hệ thống, tối thủ công)
```css
:root { --bg: #fff; --text: #16151b; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0b0c12; --text: #eceaf4; } }
:root[data-theme="dark"] { --bg: #0b0c12; --text: #eceaf4; }
body { background: var(--bg); color: var(--text); }   /* nền body theo biến: hết chớp trắng khi đổi tab */
```

### B3. Đổi sáng/tối bằng vòng tròn loang (View Transitions) — MỘT hàm cho mọi nút (`EP.theme`, starter có sẵn)
```js
function setTheme(mode, origin) {                     // mode: 'light' | 'dark' | 'system'
  const de = document.documentElement, apply = () => mode === 'system' ? de.removeAttribute('data-theme') : de.setAttribute('data-theme', mode);
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
  const vv = visualViewport, r = origin && origin.getBoundingClientRect();
  const w = Math.max(innerWidth, de.clientWidth, vv ? vv.width + vv.offsetLeft : 0);   // thanh địa chỉ Android co/giãn
  const h = Math.max(innerHeight, de.clientHeight, vv ? vv.height + vv.offsetTop : 0);
  const x = r ? r.left + r.width / 2 : w / 2, y = r ? r.top + r.height / 2 : 0;
  const rad = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;    // tới góc xa nhất
  de.setAttribute('data-vt', 'theme');
  const t = document.startViewTransition(apply);
  t.ready.then(() => de.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
    { duration: 550, easing: 'ease-in-out', fill: 'both', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  t.finished.finally(() => de.removeAttribute('data-vt'));   // mỗi lần chỉ dọn cờ của chính nó
}
```
Quy tắc rút từ 4 lần vỡ: **chỉ MỘT animation trên `::view-transition-new(root)`**; tâm = giữa nút bấm; bán kính theo `visualViewport` (nếu không, góc dưới trái không đổi màu trên Android); dọn cờ `data-vt` theo từng transition (đổi theme ngay sau chuyển tab từng làm hiệu ứng biến mất); máy bật "giảm chuyển động" thì đổi ngay.

### B4. CSS đi kèm vòng tròn (không có thì thanh trên bị nhân đôi/ma)
```css
.topbar { view-transition-name: topbar; }
html[data-vt="theme"] body * { view-transition-name: none !important; }  /* bỏ mọi tên riêng khi đổi theme */
html[data-vt="theme"]::view-transition-group(root) { animation: none; }
html[data-vt="theme"]::view-transition-old(root),
html[data-vt="theme"]::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html[data-vt="theme"]::view-transition-old(root) { z-index: 1; } html[data-vt="theme"]::view-transition-new(root) { z-index: 2; }
html.motion-off *, html.motion-off *::before, html.motion-off *::after { animation: none !important; transition: none !important; }
```

### B5. Cài đặt hiệu ứng 3 mức + tôn trọng "giảm chuyển động"
```js
// pref: 'on' (mặc định, luôn có) | 'system' (theo máy) | 'off'. Toggle class html.motion-off (CSS ở B4).
const mq = matchMedia('(prefers-reduced-motion: reduce)'); let pref = 'on';
try { pref = localStorage.getItem('ep_motion') || 'on'; } catch (e) {}
const reduced = () => pref === 'off' || (pref === 'system' && mq.matches);
const apply = () => document.documentElement.classList.toggle('motion-off', reduced());
mq.addEventListener('change', apply); apply();
```
Gotcha: người dùng Android bật "Xoá hiệu ứng động/Giảm chuyển động" sẽ **không thấy** vòng tròn. Khi họ báo "mất animation", hỏi cài đặt này trước.

### B6. Gộp vẽ lại thanh trượt (≤1 lần mỗi khung hình) và debounce ô tìm kiếm
```js
let raf = 0; const onSlide = (v) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => render(v)); };
const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
search.addEventListener('input', debounce(() => renderList(search.value)));
```

### B7. FLIP: thẻ trượt nhường chỗ khi kéo thả/đổi bố cục (chỉ `transform`)
```js
const before = new Map([...cards].map((n) => [n.dataset.id, n.getBoundingClientRect()]));
reorder();                                                       // đổi DOM
cards.forEach((n) => { const a = before.get(n.dataset.id), b = n.getBoundingClientRect(); if (!a) return;
  const dx = a.left - b.left, dy = a.top - b.top;
  if (dx || dy) n.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }); });
```
Đừng dời thẻ bằng `top/left` từng nhích chuột (trình duyệt reflow cả trang; từng đo 317 ms khựng) và đừng để `transform: scale` đè lên khi kéo.

### B8. Hiện dần theo cuộn: lắng nghe **đúng khung đang cuộn** và hiện trước khi vào màn hình
```js
const scroller = (el) => { for (let n = el.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (/(auto|scroll)/.test(o) && n.scrollHeight > n.clientHeight) return n; } return null; };
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
  { root: scroller(container), threshold: 0, rootMargin: '0px 0px 25% 0px' });   // 25%: vuốt nhanh không thấy khoảng trắng
container.querySelectorAll('.reveal').forEach((n) => io.observe(n));
```
Lỗi cũ: xem trước trong dialog tự cuộn bên trong, observer chỉ nghe `window` nên timeline không chạy. Reveal ≤ 450 ms, quãng trượt nhỏ.

### B9. Số chạy lên (count-up), chỉ khi ≥ 10 và không giảm chuyển động
```js
function countUp(el, to, ms = 700) {
  if (reduced() || !Number.isFinite(to) || to < 10) { el.textContent = to.toLocaleString('vi-VN'); return; }
  const t0 = performance.now();
  (function tick(now) { const p = Math.min(1, (now - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('vi-VN'); if (p < 1) requestAnimationFrame(tick); })(t0);
}
```

---

## C. Gotcha CSS / mobile (mỗi mục từng là lỗi thật)

### C1. `@layer`: khai báo thứ tự một lần, CSS mới luôn vào `components`
```css
/* css/tokens.css (dòng đầu) */  @layer reset, tokens, base, components, utilities;
/* css/<tên>.css */              @layer components { .order-row { display: flex; gap: var(--gap); } }
/* Nội dung người dùng/xem trước (landing) để NGOÀI layer hoặc layer riêng nằm sau: tránh CSS app đè nó */
```
Sau merge đếm ngoặc: `python3 -c "s=open('css/app.css').read();print(s.count('{'),s.count('}'))"`.

### C2. `[hidden]` luôn thắng (bài học từ file HTML xuất bị hiện lại khối ẩn)
```css
[hidden] { display: none !important; }
.landing [hidden] { display: none !important; }   /* trong file xuất: .offer, .countdown, .btn display:flex sẽ đè hidden nếu thiếu dòng này */
```

### C3. Ô tích bị dính kiểu ô nhập (khung xám): chỉ áp kiểu cho ô chữ
```css
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]), select, textarea { border: 1px solid var(--control); min-height: var(--control-h); padding: 0 12px; }
input[type="checkbox"], input[type="radio"] { width: 18px; height: 18px; accent-color: var(--accent); }
.check { display: flex; gap: 8px; align-items: center; cursor: pointer; }   /* bấm vào chữ cũng tích: <label class="check"><input type="checkbox"> ... */
```

### C4. Điều khiển chỉ hiện khi rê chuột thì **biến mất trên cảm ứng**: mở sẵn + đưa nút khỏi đè ảnh
```css
@media (hover: none) {
  .card .acts { opacity: 1; }
  .tpl-tile .tile-actions { position: static; display: flex; gap: 8px; }  /* hai nút xuống hàng chân thẻ, không che ảnh xem trước */
}
```

### C5. Lưới 3 mục không được lẻ "2+1" trên mobile: 1 cột, hoặc đếm số phần tử bằng `:has()`
```css
.speakers { display: grid; grid-template-columns: 1fr; gap: 12px; }                 /* điện thoại: mỗi người một hàng */
@media (min-width: 640px) {
  .speakers { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }
  .speakers:has(> :nth-child(3):last-child) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .speakers:has(> :nth-child(2):last-child) { grid-template-columns: repeat(2, minmax(0, 220px)); justify-content: center; }
}
```

### C6. Dải trắng lạ cuối trang mobile: thanh CTA dính **đang ẩn** vẫn chiếm chỗ
```css
.sticky-wrap { position: sticky; bottom: 0; height: 0; }            /* khung 0px, thanh con absolute: ẩn đi không kéo dài trang */
.sticky { position: absolute; inset: auto 0 0; transform: translateY(110%); visibility: hidden; transition: transform .25s, visibility 0s .25s; }
.sticky.is-on { transform: none; visibility: visible; transition-delay: 0s; }
html, body { background: var(--bg); }                               /* vùng thừa nếu còn cũng cùng màu nền */
```
Các nguyên nhân khác của dải trắng: `min-height: 100vh` (dùng `100dvh`) và tên thương hiệu trong nút xuống dòng (`white-space: nowrap`).

### C7. Dialog/bottom sheet mobile + toast ở mép trên (không che ô nhập) + chống zoom iOS
```css
@media (max-width: 760px) {
  dialog.sheet { inset: auto 0 0 0; width: 100%; max-height: 90dvh; border-radius: 16px 16px 0 0; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); overscroll-behavior: contain; overflow-y: auto; }
  .toasts { top: 8px; bottom: auto; }
  input, select, textarea { font-size: 16px; }    /* <16px: iOS tự phóng to khi chạm ô */
  .btn, .tab { min-height: 44px; }
  .tabs { overflow-x: auto; scroll-snap-type: x proximity; overscroll-behavior-x: contain; }
}
```
Tab đang chọn phải tự cuộn vào giữa dải: `activeTab.scrollIntoView({ inline: 'center', block: 'nearest' })`.

### C8. Dấu tiếng Việt chạm nhau: tăng line-height tiêu đề; thanh nổi bo góc khớp khung
```css
.hero h1 { line-height: 1.28; }         /* 1.1 làm dấu "ệ", "ữ" của dòng trên chạm dòng dưới; mục tiêu ≥ 1.25 cho tiêu đề lớn */
.section h2 { line-height: 1.3; }
.brand-name, .btn .brand { white-space: nowrap; }
@media (max-width: 760px) { .preview-bar { border-radius: 24px; flex-wrap: nowrap; } .preview-bar .title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
```
Thanh dạng viên thuốc 999px rớt 2 dòng trên điện thoại sẽ cắt chữ: dùng hình chữ nhật bo 24px, một hàng, cắt chữ bằng `…`.

### C9. Vùng "luôn sáng" (landing/xem trước/giấy) không bị màn tối rò vào
```css
.landing, dialog.lp-reg, .paper { color-scheme: light; }
.landing input, .landing textarea { background: #fff; color: #16193a; border: 1px solid #d6d9e6; color-scheme: light; }
```

### C10. Khung cuộn lồng làm điện thoại "nuốt" cú vuốt nhanh
```css
.landing { overflow: visible; }               /* BỎ overflow:auto/scroll ở khung landing: chỉ để một thanh cuộn của cả trang */
.hero-bg { will-change: transform; }          /* ảnh bìa trôi bằng transform, KHÔNG animate background-position (vẽ lại ảnh lớn mỗi khung) */
.countdown { display: grid; grid-template-columns: repeat(4, 1fr); }   /* 4 ô đếm ngược luôn một hàng, hết "3+1" */
```

### C11. Màn Thiết kế khoá một màn hình để thanh trên và thanh công cụ không tách nhau khi zoom/cuộn
```css
.editor.view:not([hidden]) { height: calc(100dvh - var(--topbar-h, 56px)); min-height: 0; overflow: hidden; }
html.is-editor, html.is-editor body { height: 100%; overflow: hidden; overscroll-behavior: none; }
.editor .toolbar { position: sticky; top: 0; z-index: 20; }   /* chỉ MỘT container cố định, không sticky lồng sticky */
```

### C12. Icon: SVG nét, không emoji; mọi mục menu đều có icon, dấu ✓ nằm bên phải để icon thẳng cột
```html
<button class="mb-item"><svg class="ic" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span>Tạo trang mới</span><kbd>Ctrl+N</kbd><svg class="ck" hidden>…</svg></button>
```

---

## D. Form, dữ liệu, tiện ích

### D1. SĐT Việt Nam + email + thông báo tiếng Việt chuẩn (`starter/js/form.js` đã có; mẫu thông báo)
```js
const VN_MOBILE = /^0(3|5|7|8|9)\d{8}$/, EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalizePhone = (v) => { let d = String(v || '').trim().replace(/[\s.\-()]/g, '');
  if (d.startsWith('+84')) d = '0' + d.slice(3); else if (/^84\d{9}$/.test(d)) d = '0' + d.slice(2); return d; };
const phone = (v) => !String(v || '').trim() ? 'Vui lòng nhập số điện thoại.'
  : VN_MOBILE.test(normalizePhone(v)) ? '' : 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678).';
const email = (v) => !String(v || '').trim() ? 'Vui lòng nhập email.' : EMAIL.test(v.trim()) ? '' : 'Email không đúng định dạng (ví dụ: ten@gmail.com).';
const required = (v, nhãn) => String(v || '').trim() ? '' : 'Vui lòng nhập ' + nhãn + '.';
const maxLen = (v, n, nhãn) => String(v || '').trim().length > n ? nhãn + ' tối đa ' + n + ' ký tự.' : '';
```
Mẫu câu lỗi: nói **thiếu gì + ví dụ đúng**, đặt ngay dưới ô, `aria-live`, ô viền đỏ; không `alert()`. Xem thêm `references/08`.

### D2. Chặn đăng ký trùng / bấm đúp / hết chỗ → danh sách chờ / sự kiện đã qua
```js
function register(ev, input, count, now = new Date()) {
  const errors = validate(input); if (Object.keys(errors).length) return { ok: false, errors };
  const phone = normalizePhone(input.phone), mail = input.email.trim().toLowerCase();
  if (list(ev.id).some((r) => r.phone === phone || r.email === mail)) return { ok: false, errors: { form: 'Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.' } };
  if (now >= new Date(ev.startAt)) return { ok: false, errors: { form: 'Sự kiện đã diễn ra, không thể đăng ký thêm.' } };
  const waitlist = ev.capacity > 0 && count >= ev.capacity;                       // đủ chỗ: vẫn nhận nhưng vào danh sách chờ
  const rec = { id: newId('reg'), name: input.name.trim(), phone, email: mail, status: waitlist ? 'waitlist' : 'new', createdAt: now.toISOString() };
  return write(ev.id, [...list(ev.id), rec]) ? { ok: true, waitlist, record: rec } : { ok: false, errors: { form: 'Không lưu được dữ liệu (trình duyệt hết dung lượng hoặc chặn lưu trữ).' } };
}
// Nút gửi: khoá + "Đang gửi…" ngay lúc bấm để chặn bấm đúp; mở lại ở finally.
```

### D3. Trạng thái theo thời gian, không bao giờ đếm số âm
```js
const status = (ev, n, now = new Date()) => now >= new Date(ev.startAt) ? { code: 'ended', label: 'Sự kiện đã diễn ra', canRegister: false }
  : ev.capacity && n >= ev.capacity ? { code: 'full', label: 'Đã hết chỗ – vào danh sách chờ', canRegister: true, waitlist: true }
  : ev.capacity && n >= Math.ceil(ev.capacity * 0.9) ? { code: 'almost', label: 'Chỉ còn ' + (ev.capacity - n) + ' chỗ', canRegister: true }
  : { code: 'open', label: 'Đang mở đăng ký', canRegister: true };
const left = (ev, now = new Date()) => { const ms = new Date(ev.startAt) - now; return ms <= 0 ? null : { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) }; };
```
Đã qua: **mọi** nút đăng ký (hero, cuối trang, thanh dính, file HTML xuất) đổi thành nhãn "Sự kiện đã diễn ra" không bấm được; thanh dính vô hiệu. Cho phép truyền `now` giả để demo/test "tua thời gian".

### D4. localStorage an toàn (try/catch + rơi về bộ nhớ) và bộ sưu tập CRUD (`EP.store`/`EP.collection` của starter)
```js
const mem = {};
const store = {
  read(k, d) { try { const v = localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
  write(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); return true; } catch (e) { mem[k] = v; return false; } }   // false = hết dung lượng/bị chặn
};
const orders = EP.collection('orders');          // starter: add/update/remove/get/list/onChange
orders.add({ name: 'Đơn 1', total: 120000 }); orders.onChange(() => renderTable());
```
Ghi vào README/app: dữ liệu localStorage **chỉ nằm trên một trình duyệt**.

### D5. Dữ liệu demo có version, không bao giờ ghi đè dữ liệu người dùng; tự động hoá thì phải `?demo=1`
```js
EP.demo.register('orders', { version: 2, rows: [{ name: 'Nguyễn Văn An', total: 1250000, date: '2026-12-05' }] });   // ngày CỐ ĐỊNH, tương lai gần
// Bên trong: chỉ nạp khi collection rỗng, hoặc version tăng mà người dùng chưa sửa dòng nào. ?demo=1 hoặc nút "Nạp lại dữ liệu demo" mới xoá rồi nạp lại.
const auto = navigator.webdriver && !/[?&]demo=1\b/.test(location.search);
if (auto) return;      // Xclipse: trình duyệt tự động bỏ qua demo/popup (popup cần ?popup=1) để test ổn định
```
Hai lỗi thật: (1) khách tải lại bị đè trang đang làm bằng demo; (2) bấm "Điền dữ liệu mẫu" bị loader trang demo ghi đè (nút này phải tạo bản ghi **mới**, id mới). Test tự động luôn mở `?demo=1`.

### D6. CSV mở đúng tiếng Việt trong Excel + chống chèn công thức (`EP.export.csv` của starter)
```js
const cell = (v) => { let s = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;   // chặn công thức độc
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = '﻿' + [cols.map((c) => cell(c.label)), ...rows.map((r) => cols.map((c) => cell(c.value ? c.value(r) : r[c.key])))].map((a) => a.join(',')).join('\r\n');
const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: name });
a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
```
SĐT bắt đầu bằng 0 sẽ mất số 0 trong Excel nếu để trần: ghi `'0912…` hoặc định dạng text.

### D7. File lịch `.ics` ("Thêm vào lịch" sau khi đăng ký)
```js
const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), e = (t) => String(t || '').replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n');
const s = new Date(ev.startAt), end = new Date(s.getTime() + 2 * 36e5);
const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//{{app}}//VI', 'BEGIN:VEVENT', 'UID:' + ev.id + '@{{app}}', 'DTSTAMP:' + f(new Date()),
  'DTSTART:' + f(s), 'DTEND:' + f(end), 'SUMMARY:' + e(ev.name), 'LOCATION:' + e(ev.location), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })), download: 'su-kien.ics' }); a.click();
```

### D8. Tự nén ảnh theo trần dung lượng từng loại ô (localStorage ~5MB, tài liệu Firestore ≤ 1MB)
```js
const SLOTS = { hero: { w: 1600, q: .82, max: 320e3 }, gallery: { w: 1000, q: .8, max: 150e3 }, avatar: { w: 320, h: 320, q: .85, max: 40e3 }, logo: { w: 480, q: .9, max: 60e3, alpha: true } };
async function compress(file, slot) {
  const bmp = await createImageBitmap(file), cfg = SLOTS[slot]; let w = Math.min(cfg.w, bmp.width), q = cfg.q;
  const type = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : (cfg.alpha ? 'image/png' : 'image/jpeg');
  for (;;) { const c = Object.assign(document.createElement('canvas'), { width: w, height: cfg.h || Math.round(bmp.height * w / bmp.width) });
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); const url = c.toDataURL(type, q);
    if (url.length <= cfg.max || (q <= .42 && w <= 120)) return url;
    if (q > .42) q -= .08; else w = Math.round(w * .85); }             // hạ chất lượng từng bậc, chưa đủ thì thu nhỏ
}
```
Nhận ảnh gốc tới 25 MB, chỉ JPG/PNG/WebP, báo "đã nén từ X xuống Y". Quá ngân sách cả trang → nén lại ảnh nặng nhất, không báo "đầy".

### D9. Kho ảnh/tệp lớn dùng IndexedDB (localStorage không đủ), kiểu Canva: tab "Đã tải lên" + nút tải thêm
```js
const open = () => new Promise((ok, no) => { const r = indexedDB.open('{{prefix}}media', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('files', { keyPath: 'id' }); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
async function putFile(file) { const db = await open(), rec = { id: crypto.randomUUID(), name: file.name, blob: file, at: Date.now() };
  await new Promise((ok, no) => { const t = db.transaction('files', 'readwrite'); t.objectStore('files').put(rec); t.oncomplete = ok; t.onerror = () => no(t.error); }); return rec; }
// Mọi chỗ chọn ảnh dùng CHUNG một bộ chọn: EP.media.open({ slot }) -> File. IndexedDB lỗi (ẩn danh cũ) thì rơi về <input type=file>.
```

### D10. Tìm không dấu tiếng Việt (gõ "cuoi" ra "cưới") và slug
```js
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hit = (item, q) => norm(item.name + ' ' + item.tags.join(' ')).includes(norm(q));
```
Bộ lọc: hiện số kết quả cho từng lựa chọn, nhóm "Khớp đủ" trước rồi "Gần đúng (N)" kèm "Khớp k/n", nút xoá bộ lọc, trạng thái rỗng có hướng dẫn.

### D11. Chặn link độc (`javascript:`) và HTML chèn vào
```js
const safeUrl = (u) => /^https?:\/\/\S+$/i.test(String(u || '').trim()) ? u.trim() : '';        // chỉ http(s); lỗi: 'Link phải bắt đầu bằng https://'
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
el.innerHTML = '<a href="' + esc(safeUrl(link)) + '" rel="noopener noreferrer" target="_blank">' + esc(label) + '</a>';
// Soạn chữ có link: lọc thẻ, chỉ cho <b><i><u><s><a href=http(s)>; còn lại textContent.
```

### D12. Kiểm tra tương phản WCAG (làm đậm tới khi chữ trắng đọc được) cho bảng màu người dùng chọn
```js
const lum = ([r, g, b]) => { const f = (v) => (v /= 255) <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const ensureDark = (rgb) => { let c = rgb.slice(); for (let i = 0; i < 60 && ratio(c, [255, 255, 255]) < 4.5; i++) c = c.map((v) => v * .92); return c; };   // chữ thường ≥ 4.5:1
```
Ô nhập màu nhận hex, rgb(), rgba(), hsl(), tên màu; kẹp mọi thông số trong giới hạn; hiện chỉ số tương phản cạnh ô.

### D13. Chăm sóc khách (CRM nhẹ): trạng thái + Gọi/Zalo + chọn landing trước rồi mới hiện số liệu
```js
const LEAD = { new: 'Mới', contacted: 'Đã liên hệ', won: 'Chốt', lost: 'Huỷ' };
const callHref = (p) => 'tel:' + p, zaloHref = (p) => 'https://zalo.me/' + p.replace(/^0/, '84');
// Màn "Danh sách đăng ký": bước 1 chọn landing (đang hoạt động / đã kết thúc); số liệu, danh sách, CSV CHỈ của trang đã chọn, nhớ lựa chọn sau khi tải lại.
```
Số liệu: số 0 không tô màu, `font-variant-numeric: tabular-nums`, đường xu hướng đoạn cuối (hôm nay, chưa hết ngày) vẽ nét đứt + tooltip "hôm nay, chưa hết ngày". Số lượt xem/bấm công khai có thể bị cộng khống: ghi rõ "chỉ tham khảo".

---

## E. AI

### E1. Một cửa gọi AI: `prompt` + `schema` + `mock` (starter `EP.ai.generate`)
```js
const res = await EP.ai.generate({
  prompt: (input) => 'Bạn là ... Chỉ dùng dữ kiện dưới đây, KHÔNG bịa ngày, giá, tên.\n' + JSON.stringify(input) + '\nChỉ trả về một khối JSON: {"headline":"...","benefits":["...","...","..."]}',
  schema: { headline: { type: 'string', max: 90 }, benefits: { type: 'array', of: 'string', min: 3, max: 3 } },
  mock: (input) => ({ headline: input.name + ' – ' + input.date, benefits: ['…', '…', '…'] })
}, { input: formValues });
el.innerHTML = EP.esc(res.data.headline) + EP.ai.noticeHtml(res);          // mock thì luôn kèm nhãn
```

### E2. Rút JSON chịu lỗi (lời dẫn, ```json, nháy cong, dấu phẩy thừa)
```js
function extractJson(text) {
  const s0 = String(text || '').replace(/```(?:json)?/gi, ''), a = s0.indexOf('{'), b = s0.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('Không tìm thấy khối JSON trong kết quả.');
  try { return JSON.parse(s0.slice(a, b + 1).replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, '$1')); }
  catch (e) { throw new Error('JSON bị lỗi cú pháp: ' + e.message); }
}
```

### E3. Kiểm soát đầu ra: thiếu trường thì bù bằng mock **và nói rõ**, dư thì cắt, quá dài thì cắt `…`
```js
const trimTo = (t, n) => { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; };
function normalize(raw, mock) { const warnings = [], o = raw || {};
  let h = o.headline || o.title; if (!h) { warnings.push(CFG.mockNotice + ': thiếu headline, đã dùng bản thay thế.'); h = mock.headline; }
  let b = [].concat(o.benefits || []).filter(Boolean).map(String); if (b.length > 3) warnings.push('AI trả về ' + b.length + ' ý, chỉ giữ 3 ý đầu.');
  while (b.length < 3) { warnings.push('Thiếu ý số ' + (b.length + 1) + ', đã bù bằng bản thay thế.'); b.push(mock.benefits[b.length]); }
  return { data: { headline: trimTo(h, 90), benefits: b.slice(0, 3).map((x) => trimTo(x, 110)) }, warnings }; }
```
Ca kiểm thử bắt buộc: dán kết quả có lời dẫn + ```json + nháy cong + dấu phẩy thừa + chỉ 2 ý → app vẫn đọc được, bù ý thứ 3, báo rõ.

### E4. Nhãn mô phỏng: một nguồn duy nhất, hiển thị ở mọi nơi, không xuống dòng xấu
```js
// js/config.js:  mockNotice: '<CÂU NGUYÊN VĂN TỪ ĐỀ/BTC>'   (vòng loại: 'Bản demo vòng loại - Dữ liệu mô phỏng AI'; chung kết PHẢI kiểm tra lại)
const noticeHtml = (res) => res.mock ? '<p class="mock-pill" role="note">' + EP.esc(EP.config.mockNotice) + '</p>' : '';
```
```css
.mock-pill { display: inline-flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; margin: 8px 0; padding: 4px 10px; border-radius: 999px;
  background: var(--warn-soft, #fff4e5); color: var(--warn, #8a4b00); font-size: 13px; line-height: 1.35; }
@media (max-width: 760px) { .toolbar .mock-pill { white-space: normal; } }  /* nhãn ở thanh công cụ: desktop 1 dòng, hẹp thì xuống dòng riêng, đừng để thành 4 dòng nhỏ */
```
Nhãn xuất hiện ở: ghi chú trong app, chân trang, cảnh báo khi fallback, checklist trước xuất bản, README, bảng kiểm thử, slide. Đổi câu → sửa 2 assert trong `tests/smoke.cjs` (starter đã đọc từ `EP.config`).

### E5. Gọi Gemini bằng key người dùng nhập + dịch lỗi + tự đổi model
```js
const URL_G = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', FALLBACKS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
const fail = (msg, kind) => Object.assign(new Error(msg), { kind });
async function call(key, model, prompt, ms = 60000) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  const res = await fetch(URL_G.replace('{model}', encodeURIComponent(model)), { method: 'POST', signal: ac.signal,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },     // key ở header, không ở URL
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: .8, responseMimeType: 'application/json' } }) }
  ).catch((e) => { throw fail(e.name === 'AbortError' ? 'Model "' + model + '" phản hồi quá lâu.' : 'Không kết nối được tới Gemini. Kiểm tra mạng.', e.name === 'AbortError' ? 'timeout' : 'network'); }).finally(() => clearTimeout(t));
  if ([400, 401, 403].includes(res.status)) throw fail('API key không hợp lệ hoặc chưa được cấp quyền.', 'key');
  if (res.status === 404) throw fail('Model "' + model + '" không còn mở cho tài khoản này.', 'model');
  if (res.status === 429) throw fail('Model "' + model + '" đã hết lượt miễn phí hoặc cần bật thanh toán.', 'quota');
  if (res.status >= 500) throw fail('Model "' + model + '" của Google đang quá tải.', 'server');
  const d = await res.json(); return d.candidates[0].content.parts.filter((p) => !p.thought).map((p) => p.text || '').join('');   // bỏ phần "thought"
}
// generate(): lỗi 'key'/'network' thì báo luôn; lỗi 'model'/'quota'/'timeout'/'server' thì thử model kế trong FALLBACKS + onSwitch(model, lý do).
```
Gotcha: tên model `-preview` đổi/gỡ không báo; **đối chiếu** `ai.google.dev/gemini-api/docs/models` trước khi tin bảng model (bảng của skill/tài liệu có mục "(?) chưa xác minh"). Model **tạo ảnh/video không có gói miễn phí** (429 `limit: 0`): app phải nói rõ và có ảnh thay thế. Ảnh AI gắn nhãn "AI" + ghi "Ảnh minh hoạ tạo bằng AI". Ô key: `type=password`, mặc định chỉ giữ trong bộ nhớ trang, tick "Nhớ key" mới lưu localStorage; không bao giờ vào code/commit/ảnh chụp.

### E6. Khối prompt chống bịa + cấm sáo rỗng (rút từ vòng sửa "văn AI chung chung")
```text
Bạn là copywriter người Việt 10 năm viết landing page cho {{ngành}}. Viết như người thật nói với một người bạn đang cân nhắc có đi hay không.
THÔNG TIN (chỉ dùng những gì ở đây): Tên: ... | Thời gian: ... | Địa điểm: ... | Ưu đãi: ...
- headline ≤ 12 từ/90 ký tự, theo 4U (có ích, có lý do làm ngay, khác biệt, cụ thể bằng chi tiết thật). Mô tả theo AIDA/PAS, 2–3 câu, gọi người đọc là "bạn".
- 3 lợi ích theo FAB: viết thành KẾT QUẢ/CẢM GIÁC cụ thể; F&B dùng ngôn ngữ giác quan; mỗi ý bắt đầu bằng động từ hoặc kết quả.
- CẤM: "đẳng cấp", "tinh tế", "nâng tầm", "trải nghiệm tuyệt vời", "không thể bỏ lỡ", "hành trình", "khám phá", "độc quyền", "bùng nổ", "đột phá", "hàng đầu", emoji, nhiều dấu chấm than.
- KHÔNG bịa ngày giờ, địa điểm, giá, số liệu, giải thưởng, tên người. Thiếu dữ kiện thì viết khéo quanh những gì có. Khan hiếm/gấp rút chỉ khi gắn với sức chứa hoặc hạn THẬT.
Chỉ trả về một khối JSON, không giải thích, không markdown: {"headline":"...","description":"...","benefits":["...","...","..."]}
```

---

## F. SEO & chia sẻ

### F1. Bộ meta đầy đủ cho `<head>` (tiêu đề ≤ 60, mô tả 140–160, ảnh OG JPEG 1200×630, URL tuyệt đối)
```html
<title>{{Tiêu đề ≤ 60 ký tự}}</title>
<meta name="description" content="{{140–160 ký tự}}"><link rel="canonical" href="{{URL trang thật}}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{{app}}"><meta property="og:locale" content="vi_VN">
<meta property="og:title" content="{{...}}"><meta property="og:description" content="{{...}}"><meta property="og:url" content="{{URL}}">
<meta property="og:image" content="https://{{user}}.github.io/{{repo}}/assets/og/{{id}}.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{{mô tả ảnh}}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://.../og/{{id}}.jpg">
<meta name="theme-color" content="#131416"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
```
Ảnh OG phải là URL **http(s) công khai** (ảnh dataURL/ảnh tải lên máy không hiện); JPEG là định dạng Zalo đọc ổn định nhất.

### F2. Facebook/Zalo KHÔNG chạy JS → trang chia sẻ tĩnh `s/<id>/index.html` (meta có sẵn) rồi chuyển người thật sang trang chính
```js
// tools/build-share-pages.cjs: mở app bằng Playwright, lấy dữ liệu từng trang, ghi file tĩnh. Chạy lại mỗi khi đổi nội dung trang mẫu.
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title><meta name="description" content="${esc(t.desc)}">
<meta property="og:title" content="${esc(t.ogTitle)}"><meta property="og:description" content="${esc(t.ogDesc)}"><meta property="og:image" content="${PROD}assets/og/${id}.jpg">
<meta property="og:url" content="${PROD}s/${id}/"><link rel="canonical" href="${PROD}?e=${id}">
<script type="application/ld+json">${JSON.stringify(eventJsonLd)}</script>
<script>location.replace('../../?e=${id}')</script></head><body><a href="../../?e=${id}">${esc(t.title)}</a></body></html>`;
fs.mkdirSync(`s/${id}`, { recursive: true }); fs.writeFileSync(`s/${id}/index.html`, html);
```
GitHub Pages không tự sinh file này và Firebase Functions cần gói trả phí: **chạy script ở máy rồi commit** thư mục `s/`. Link copy/QR trong app trỏ tới `/s/<id>/`, không phải `?e=<id>`. Thử: dán **link mới** (Facebook nhớ bản xem trước cũ) rồi vào Sharing Debugger (`developers.facebook.com/tools/debug`) bấm "Scrape Again"; Zalo cũng cache một thời gian. Chưa thử thật trên Facebook/Zalo thì nói "chưa thử".

### F3. Link chia sẻ ẩn khung app trước khi tải (khách không thấy builder nháy lên)
```html
<script>(function(d){try{if(/[?&]e=/.test(location.search))d.className+=' boot-public';}catch(e){}})(document.documentElement);</script>
<style>.boot-public .topbar, .boot-public .app-footer, .boot-public .skip-link, .boot-public main.view { display: none !important; }</style>
```
Sau khi JS dựng xong trang công khai thì gỡ class và hiện đúng view.

### F4. JSON-LD `Event` (giờ có múi +07:00) và checklist nhanh
```json
{"@context":"https://schema.org","@type":"Event","name":"{{tên}}","startDate":"2026-11-28T08:00:00+07:00","eventStatus":"https://schema.org/EventScheduled",
 "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","location":{"@type":"Place","name":"{{nơi}}","address":"{{địa chỉ}}"},
 "image":["{{URL ảnh}}"],"description":"{{...}}","offers":{"@type":"Offer","price":"0","priceCurrency":"VND","availability":"https://schema.org/InStock"}}
```
Mỗi màn đúng một `h1`; ảnh có `alt` mô tả + `width/height`; diễn giả: `alt="Diễn giả {{tên}} – {{chức danh}}"`, album: `alt="Hình ảnh {{tên sự kiện}} – ảnh N"`; `robots.txt`, `sitemap.xml` (có link `s/<id>/`), `404.html` có `noindex`; trang nháp/riêng tư `noindex`.

---

## G. Firebase, GitHub Pages, Google Sheet

> Bản dựng sẵn, TẮT mặc định: `starter/js/firebase.js` + `starter/firestore.rules` (đăng nhập Google, đồng bộ `EP.collection` -> `users/{uid}/...`, dịch lỗi tiếng Việt). Các mẫu G1-G4 dưới đây dùng cho trường hợp riêng; nếu chỉ cần lưu theo tài khoản thì bật module trong `starter/js/config.js`, xem `starter/README.md` mục "Bật Firebase trong 5 phút".

Mặc định 60 phút: **localStorage**. Chỉ dùng Firebase khi đề cần dữ liệu chung nhiều máy. **Đề đã quy định nơi lưu (vd localStorage) thì đó là bản chính; Firebase/Sheet là tuỳ chọn và phải được mô tả đúng là tuỳ chọn** (Xclipse từng bị cô nhận xét "chưa đúng tính năng" vì giới thiệu Firebase như nơi lưu chính).

### G1. Dựng project Firebase (người dùng tự bấm; hướng dẫn đánh số, không bao giờ xin key/service account)
```text
1. console.firebase.google.com → Add project (gói Spark, KHÔNG bật billing, KHÔNG dùng Cloud Functions vì cần trả phí).
2. Build → Firestore Database → Create database → vị trí asia-southeast1 → Production mode.
3. Build → Authentication → Get started → Sign-in method → Google → Enable.
4. Authentication → Settings → Authorized domains → Add domain: <tài-khoản>.github.io   (thiếu bước này: lỗi auth/unauthorized-domain)
5. Project settings → Your apps → Web (</>) → copy firebaseConfig (apiKey, projectId, appId...) dán vào js/firebase-config.js.
6. Firestore → Rules → dán nội dung firebase/firestore.rules → Publish   (hoặc: npx firebase deploy --only firestore:rules --project <id>).
```
`firebaseConfig` là cấu hình web **công khai theo thiết kế**; thứ bảo vệ dữ liệu là rules + Authentication. `scripts/scan-secrets.mjs` sẽ in dòng [CHO PHÉP] cho `js/firebase-config.js`; ghi chú điều này trong README để giám khảo khỏi hiểu nhầm. Không đưa service account/private key.

### G2. Khởi tạo Firebase compat (vendor sẵn, không CDN) + emulator + rơi về localStorage khi mất mạng
```html
<script src="vendor/firebase/firebase-app-compat.js"></script><script src="vendor/firebase/firebase-auth-compat.js"></script>
<script src="vendor/firebase/firebase-firestore-compat.js"></script><script src="js/firebase-config.js"></script>
```
```js
let db = null, auth = null, available = !!(window.firebase && window.EP_FIREBASE_CONFIG);
if (available) { try { firebase.initializeApp(window.EP_FIREBASE_CONFIG); db = firebase.firestore(); auth = firebase.auth();
  if (new URLSearchParams(location.search).get('emulator') === '1') { db.useEmulator('127.0.0.1', 8085); auth.useEmulator('http://127.0.0.1:9099'); } } catch (e) { available = false; } }
const withTimeout = (p, ms = 12000) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error('Máy chủ phản hồi quá lâu, vui lòng thử lại.')), ms); p.then((v) => { clearTimeout(t); ok(v); }, (e) => { clearTimeout(t); no(e); }); });
// !available (mở file://, mất mạng): toàn app tự dùng localStorage như cũ.
```

### G3. Đăng nhập Google + dịch lỗi ra hướng dẫn tiếng Việt
```js
function signIn() {
  if (location.protocol === 'file:') return Promise.reject(new Error('Đăng nhập Google cần mở app qua đường dẫn web (GitHub Pages hoặc localhost), không mở trực tiếp file.'));
  const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
  return auth.signInWithPopup(p).catch((e) => { throw new Error(({
    'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập. Bấm biểu tượng chặn popup, chọn "Luôn cho phép", rồi bấm lại.',
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất. Hãy bấm lại.',
    'auth/unauthorized-domain': 'Tên miền chưa được phép: thêm vào Firebase → Authentication → Settings → Authorized domains.',
    'auth/operation-not-allowed': 'Đăng nhập Google chưa được bật (Authentication → Sign-in method).',
    'auth/internal-error': 'Google từ chối đăng nhập trên trình duyệt này. Thử Chrome thông thường (không phải trình duyệt tự động).' })[e.code] || 'Không đăng nhập được: ' + e.message); });
}
```
Mở trang khi đã từng đăng nhập: đặt cờ `localStorage.ep_signed_in` trong script `<head>` để vào thẳng "Sự kiện của tôi", đừng chớp màn khác.

### G4. Rules: khách chỉ **gửi**, chủ sự kiện mới đọc; mã bản ghi = SĐT chống trùng; đếm chỗ trong cùng batch
```text
function isOwner(e) { return request.auth != null && get(/databases/$(database)/documents/events/$(e)).data.ownerUid == request.auth.uid; }
match /events/{e} { allow read: if true;                                        // nội dung + số đếm công khai
  allow create: if request.auth != null && request.resource.data.ownerUid == request.auth.uid && request.resource.data.name.size() <= 120;
  allow update, delete: if request.auth != null && resource.data.ownerUid == request.auth.uid;
  match /stats/{d} { allow read: if d == 'public';                              // { count, waitlist, lastRegId }: không kèm tên/SĐT
    allow update: if isOwner(e) || (request.resource.data.lastRegId != resource.data.lastRegId
        && existsAfter(/databases/$(database)/documents/events/$(e)/registrations/$(request.resource.data.lastRegId))
        && request.resource.data.count == resource.data.count + 1); }           // khách chỉ tăng đúng 1, cùng lúc tạo bản ghi
  match /registrations/{phone} { allow read, delete: if isOwner(e);
    allow create: if phone == request.resource.data.phone && request.resource.data.phone.matches('^0[35789][0-9]{8}$')
      && request.resource.data.keys().hasOnly(['name','phone','email','status','createdAt']) && request.resource.data.createdAt == request.time; } }  // cùng SĐT không tạo được lần 2
```
Bản đầy đủ có `emails/{email}` (khoá chống trùng email), `metrics/funnel` (mỗi lần chỉ `+1` một trường), kiểm sự kiện chưa diễn ra, đúng trạng thái `new/waitlist` theo sức chứa: `firebase/firestore.rules` trong repo Xclipse.

### G5. Ghi đăng ký nguyên tử + thử lại khi đụng đồng thời; chạy test rules trên emulator
```js
const batch = db.batch(), ev = db.collection('events').doc(id);
batch.set(ev.collection('registrations').doc(rec.phone), { name: rec.name, phone: rec.phone, email: rec.email, status, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
batch.set(ev.collection('emails').doc(rec.email), { regId: rec.phone });
batch.update(ev.collection('stats').doc('public'), status === 'new' ? { count: stats.count + 1, lastRegId: rec.phone } : { waitlist: stats.waitlist + 1, lastRegId: rec.phone });
await withTimeout(batch.commit());          // permission-denied: đọc lại stats; nếu số đếm đã đổi (người khác vừa gửi) thì thử lại ≤ 3 lần, không đổi thì báo "đã đăng ký rồi"
```
```bash
cd firebase && npm i -D firebase-tools @firebase/rules-unit-testing firebase
echo '{"firestore":{"rules":"firestore.rules"},"emulators":{"firestore":{"port":8085}}}' > firebase.json
npx firebase emulators:exec --only firestore --project demo-ep "node rules.test.mjs"   # cần Java + Node; 33/33 phải qua trước khi Publish
```
Mẫu một ca: `await assertFails(getDocs(collection(anon, 'events', 'e1', 'registrations')))` (người lạ đọc danh sách → bị từ chối). Subagent trong sandbox thường **không có emulator/quyền Firebase**: điều phối viên tự chạy test Firebase sau merge, rồi báo rõ phần chưa chạy.

### G6. GitHub Pages: dựng một lần, mỗi lần push là web đổi (nhánh Pages = nhánh production)
```text
1. Repo đã kết nối Claude GitHub App (claude.ai/connect-github); mở phiên MỚI có chọn repo (không thấy repo/không push được → làm lại bước này).
2. Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: claude/<tên> (hoặc main) → /(root) → Save.
3. Link: https://<tài-khoản>.github.io/<repo>/ (1–5 phút lần đầu; tab Actions → pages-build-deployment xanh là xong).
4. index.html ở GỐC; đường dẫn tương đối (css/app.css, không /css/app.css); thêm .nojekyll nếu có thư mục bắt đầu bằng "_".
5. Link 404: sai nhánh/thư mục hoặc thiếu index.html ở gốc. Web trắng: app dùng React/Vite cần build → làm bản HTML/JS thuần.
```
```bash
touch .nojekyll && git add -A && git commit -m "..." && git push -u origin <nhánh>      # Claude không tự tạo PR nếu không được yêu cầu
```
**Không push bản ghép chưa test lên nhánh Pages**: web đổi ngay. Ghép và test ở nhánh khác/thư mục khác, xanh rồi mới đẩy.

### G7. Google Sheet tuỳ chọn qua Apps Script (POST `text/plain` để khỏi preflight CORS)
```js
// Client
fetch(APPS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ eventId, eventName, capacity, record }) }).then((r) => r.json());
// Apps Script (Code.gs): khoá để 2 người cùng gửi không lệch số chỗ; gửi lại cùng id thì không ghi trùng; dấu ' giữ số 0 đầu và chặn công thức
function doPost(e) { const lock = LockService.getScriptLock(); try { lock.waitLock(10000); const r = JSON.parse(e.postData.contents).record;
  // ...nếu đã có hàng cùng r.id → trả { ok:true }; nếu trùng SĐT/email → { ok:false, duplicate:true }
  sheet.appendRow([new Date(), r.id, r.name, "'" + r.phone, r.email, status]); return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
} finally { lock.releaseLock(); } }
```
Deploy: Triển khai → Ứng dụng web → chạy bằng "Tôi", ai có link cũng truy cập; URL phải dạng `https://script.google.com/macros/s/.../exec`. Mất mạng: hàng đợi, thử lại mỗi 15 giây, hiển thị cột "đã đồng bộ". Số đếm qua Sheet có độ trễ ~15 giây: ghi vào "Giới hạn".

---

## H. Test, minh chứng, git

### H1. Khung Playwright `.cjs`: URL từ `argv`, bắt lỗi console, **thoát mã ≠ 0 khi FAIL** (starter `tests/smoke.cjs` đã có bản đầy đủ)
```js
const { chromium } = (() => { try { return require('playwright'); } catch (e) { return require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); } })();
const URL = (process.argv.find((a) => /^https?:/.test(a)) || 'http://localhost:8211/').replace(/\/?$/, '/');   // KHÔNG hardcode 8000
let failed = 0; const ok = (name, cond, extra) => { if (!cond) failed++; console.log(cond ? '  ok  ' : '  FAIL', name, cond ? '' : JSON.stringify(extra)); };
(async () => { const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(), errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL + '?demo=1'); /* ...các ca... */ ok('không lỗi console', errs.length === 0, errs);
  await b.close(); process.exit(failed ? 1 : 0); })();
```
Gotcha: nhiều test cũ của Xclipse chỉ **in** kết quả, điều phối viên phải grep "lỗi/fail" — test phải tự trả mã thoát. Test hỏng sau khi đổi tab mặc định/hành vi khách → dùng helper mở đúng tab trước khi thao tác (`tests/auto-tab.cjs`), không dựa vào tab đầu.

### H2. Mobile 390px không tràn ngang, ở mọi tab, sáng và tối
```js
await p.setViewportSize({ width: 390, height: 844 });
for (const scheme of ['light', 'dark']) { await p.emulateMedia({ colorScheme: scheme });
  for (const t of tabs) { await p.goto(URL + '#/' + t); await p.waitForTimeout(350);
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok('390 ' + scheme + ' ' + t + ' không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw, o);
    if (SHOTS) await p.screenshot({ path: SHOTS + '/mobile-' + scheme + '-' + t + '.png', fullPage: true }); } }
// Thêm: vùng chạm ≥ 44px: await p.$$eval('button,a,input', (n) => n.filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height < 40; }).length) === 0
// Thử cả 360px và hộp thoại đang mở. Sau khi sửa tràn ngang phải chụp lại ảnh, không chỉ tin con số.
```

### H3. Chờ đúng thứ cần chờ (không `waitForTimeout` cố định) — chữa "Esc lúc được lúc không"
```js
await p.keyboard.press('Escape');
await p.waitForFunction(() => !document.querySelector('dialog[open], .preview-dialog:not([hidden])'));   // chờ dialog đóng hẳn
await p.waitForFunction(() => !document.documentElement.hasAttribute('data-vt'), null, { timeout: 4000 }); // chờ chuyển cảnh xong trước khi đo màu
// Ưu tiên xử lý Esc ở listener đầu tiên (capture) để không phần nào khác nuốt phím.
```

### H4. Chụp giữa lúc đang chuyển cảnh để chứng minh hiệu ứng thật sự chạy (không chỉ "test qua")
```js
await p.click('#btn-theme');
for (const ms of [0, 120, 240, 360, 480, 600]) { await p.waitForTimeout(ms ? 120 : 0); await p.screenshot({ path: SHOTS + '/theme-' + String(ms).padStart(3, '0') + '.png' }); }
// Xem lại cả dãy: vòng tròn phải lớn dần đều, tâm ở nút bấm, không nhảy/khựng. Thử viewport điện thoại: { width: 412, height: 915 }, isMobile: true, hasTouch: true.
```
Trình duyệt tự động không vuốt/đổi thanh địa chỉ như máy thật: **ghi "chưa thử trên điện thoại thật"** và nhờ người dùng thử rồi gửi ảnh.

### H5. Ảnh minh chứng ca kiểm thử có thanh chú thích (mã ca · mô tả · ngày · Đạt)
```js
await p.evaluate(({ id, desc, date }) => { const b = document.createElement('div');
  b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:10px 16px;background:#072D59;color:#fff;font:600 14px system-ui';
  b.textContent = id + ' · ' + desc + ' · ' + date + ' · Đạt'; document.body.appendChild(b); }, { id: 'TC05', desc: 'Đăng ký trùng SĐT', date: '16/11/2026' });
await p.screenshot({ path: 'docs/evidence/kiem-thu/TC05.png' });
```
Chỉ gắn "Đạt" sau khi ca đã chạy thật. Bảng kiểm thử: cột Mã ca · Loại · Dữ liệu và bước · Kỳ vọng · Kết quả thực tế (ngày chạy) · Đạt/Chưa. Mục "Chưa kiểm chứng" liệt kê rõ (Gemini thật, Apps Script thật...).

### H6. Minh chứng AI: **lưu ngay lúc làm**, đừng để sau
```text
Lịch sử chat bị nén/mất sau vài ngày (Xclipse mất đoạn chat gốc của 5 vòng đầu, phải thay bằng 5 vòng còn lại). Mỗi lần có vòng "yêu cầu → lỗi → yêu cầu sửa → kết quả":
1) chụp luôn đoạn chat thật (không dựng lại); 2) ghi 1 dòng vào docs/MINH-CHUNG-AI.md (mục tiêu / prompt / vấn đề / prompt sửa / kết quả kiểm tra lại);
3) ≤ 5 ảnh, che key/email/SĐT; 4) ca "AI nói rõ chưa thử trên máy thật" là bằng chứng tốt, giữ nguyên.
```

### H7. Số liệu trong README phải khớp app (đã sai "172 mẫu" một lần)
```js
// tests: so số ghi trong README với số thật
const n = await p.evaluate(() => EP.templates.list.length);
const m = require('fs').readFileSync('README.md', 'utf8').match(/(\d+) mẫu/);
ok('README ghi đúng số mẫu', m && Number(m[1]) === n, { readme: m && m[1], app: n });
```

### H8. `.gitignore` tối thiểu (từng lọt `undefined/`, ảnh chụp, video quay màn hình)
```gitignore
undefined/
shots*/
demo-video/
.env.local
node_modules/
.claude/
.agents/
deck/out/
```
Test phải nhận thư mục ảnh qua `--shots <thư-mục>`; thư mục `undefined/` xuất hiện nghĩa là đường dẫn ảnh bị `undefined`.

### H9. Giải xung đột merge hay gặp (xem bảng ở `references/02`)
```bash
git merge --no-ff <nhánh-agent> || true; git status --short | grep '^UU'
# index.html: GIỮ CẢ HAI dòng <script> mới (mỗi tag một dòng), js/app.js luôn cuối, js/demo-data.js sau các feature
grep -n '<<<<<<<\|>>>>>>>' index.html css/*.css js/*.js          # còn dấu xung đột = chưa xong
python3 -c "s=open('css/app.css').read();print('{',s.count('{'),'}',s.count('}'))"   # hai số phải bằng nhau
node tools/bump-version.cjs --stamp && node --check js/*.js features/*/feature.js   # version: lấy số cao hơn rồi stamp MỘT lần
git add -A && git commit --no-edit
```
CSS trong `@layer components { ... }`: xung đột làm lệch ngoặc `}` → toàn bộ CSS phía sau không áp dụng; mở app xem trước khi tin.

### H10. Commit/push/pull đúng kiểu repo thi
```bash
git add -A && git commit -m "v2.9.2: single theme reveal animation, preview bar mobile fix" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_<id>"
git pull --no-edit origin <nhánh> && git push -u origin <nhánh>          # push lỗi mạng: thử lại tối đa 4 lần, chờ 2s/4s/8s/16s
```
Stop-hook của môi trường nhắc "có thay đổi chưa commit" thì commit + push ngay, đừng để agent kết thúc với cây bẩn.

---

## I. Dữ liệu sinh hàng loạt và việc lặp theo từng ảnh

### I1. Chia dữ liệu lớn cho nhiều agent + **bắt buộc kèm validator** (cách ra 165 mẫu: 4 agent × ~25 mẫu/đợt)
```text
Mỗi agent ghi tools/tpl/partN.json + chạy check<N>.validate.py. Validator kiểm: JSON hợp lệ; id duy nhất, kebab-case, đúng tiền tố x<N>-, không trùng danh sách có sẵn;
enum hợp lệ (tag, motif, nhãn); WCAG: chữ/nền ≥ 7:1, màu chính/nhấn trên nền trắng ≥ 4.5:1, chữ phụ ≥ 4.5:1; ngày: earlyBirdDays < startDays; agenda 3–5 mục.
Điều phối viên gộp bằng tools/build-templates.cjs (JSON → js/templates-data.js + ảnh SVG), chạy lại test, KHÔNG sửa tay file sinh.
```
Cảnh báo phân bố: một tag chiếm 22/25 mẫu thì bộ lọc vô nghĩa; chia lại nhãn (`tools/extra-tags.json`) rồi kiểm số lượng mỗi lựa chọn.

### I2. Ảnh đại diện mẫu = ảnh chụp phần hero (tắt animation, đợi font + ảnh nền)
```js
await p.evaluate(() => { document.body.innerHTML = '<style>*,*::before,*::after{animation:none!important;transition:none!important}</style><div id="shot" class="landing" style="width:1120px"></div>'; /* render mẫu vào #shot */ });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
await p.screenshot({ path: 'assets/templates/' + id + '-thumb.jpg', type: 'jpeg', quality: 78, clip: { x: 0, y: 0, width: 1120, height: Math.min(630, box.height) } });
```
Ngữ cảnh `deviceScaleFactor: 0.5` để ảnh nhẹ. Ảnh do Gemini tạo: soạn **một file prompt tự đủ ngữ cảnh cho từng ảnh** (không "xem prompt trên"), gồm cả ảnh OG 1200×630; giao 1 Haiku/ảnh để xoá watermark góc dưới phải; trang chưa có ảnh vẫn hiển thị bình thường (không khung vỡ); ghi nguồn "ảnh minh hoạ tạo bằng AI" trong README.
