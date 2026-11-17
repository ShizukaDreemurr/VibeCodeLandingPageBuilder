// Generates svg/, sprite.svg, xclipse-icons.js, index.html from icons-data.mjs
import fs from 'node:fs';
import { ICONS } from './icons-data.mjs';

const ATTR = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
const CORAL = '#FD6E88';
const dotEl = (dot, mode) => dot
  ? (mode === 'css' ? `<circle cx="${dot[0]}" cy="${dot[1]}" r="1.75" style="fill:var(--xc-accent,${CORAL});stroke:none"/>` : `<circle cx="${dot[0]}" cy="${dot[1]}" r="1.75" fill="${CORAL}" stroke="none"/>`) : '';
const inner = (i, duo, mode) => {
  const [, , d, f, dot] = i;
  let s = '';
  if (duo && f) s += `<g fill="currentColor" fill-opacity=".18" stroke="none">${f}</g>`;
  s += `<g ${ATTR}>${d}</g>`;
  if (duo) s += dotEl(dot, mode);
  return s;
};
const standalone = (i, duo) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${inner(i, duo, 'attr')}</svg>\n`;

fs.mkdirSync('svg/duo', { recursive: true });
for (const i of ICONS) {
  fs.writeFileSync(`svg/${i[0]}.svg`, standalone(i, false));
  fs.writeFileSync(`svg/duo/${i[0]}.svg`, standalone(i, true));
}

// sprite
const sym = (i, duo) => `<symbol id="xc-${i[0]}${duo ? '-duo' : ''}" viewBox="0 0 24 24">${inner(i, duo, 'css')}</symbol>`;
const spriteBody = ICONS.map((i) => sym(i, false) + '\n' + sym(i, true)).join('\n');
fs.writeFileSync('sprite.svg', `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${spriteBody}\n</svg>\n`);

// JS
const map = {};
for (const [n, l, d, f, dot] of ICONS) map[n] = { l, d, f: f || '', dot: dot || null };
const js = `/*! Xclipse icons - 24x24, stroke 1.75, currentColor. Usage: XcIcons.svg('home', {size: 20, duo: true}) */
(function (root) {
  var ICONS = ${JSON.stringify(map)};
  var ATTR = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function body(n, duo) {
    var i = ICONS[n]; if (!i) return '';
    var s = '';
    if (duo && i.f) s += '<g fill="currentColor" fill-opacity=".18" stroke="none">' + i.f + '</g>';
    s += '<g ' + ATTR + '>' + i.d + '</g>';
    if (duo && i.dot) s += '<circle cx="' + i.dot[0] + '" cy="' + i.dot[1] + '" r="1.75" style="fill:var(--xc-accent,#FD6E88);stroke:none"/>';
    return s;
  }
  var XcIcons = {
    names: Object.keys(ICONS),
    labels: Object.keys(ICONS).reduce(function (o, k) { o[k] = ICONS[k].l; return o; }, {}),
    has: function (n) { return !!ICONS[n]; },
    /** Returns an <svg> string. opts: size (px, default 24), duo (bool), title (a11y label), cls */
    svg: function (name, opts) {
      opts = opts || {};
      if (!ICONS[name]) return '';
      var size = opts.size || 24;
      var a11y = opts.title ? 'role="img" aria-label="' + esc(opts.title) + '"' : 'aria-hidden="true"';
      return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' + a11y +
        (opts.cls ? ' class="' + esc(opts.cls) + '"' : '') + '>' + body(name, !!opts.duo) + '</svg>';
    },
    /** Returns a hidden <svg> sprite with <symbol id="xc-NAME"> and "xc-NAME-duo". Insert once, then <svg><use href="#xc-home"/></svg>. */
    sprite: function () {
      var out = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
      Object.keys(ICONS).forEach(function (n) {
        out += '<symbol id="xc-' + n + '" viewBox="0 0 24 24">' + body(n, false) + '</symbol>';
        out += '<symbol id="xc-' + n + '-duo" viewBox="0 0 24 24">' + body(n, true) + '</symbol>';
      });
      return out + '</svg>';
    },
    mount: function () { if (typeof document === 'undefined' || document.getElementById('xc-sprite')) return; var d = document.createElement('div'); d.id = 'xc-sprite'; d.innerHTML = XcIcons.sprite(); document.body.insertBefore(d, document.body.firstChild); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = XcIcons;
  root.XcIcons = XcIcons;
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync('xclipse-icons.js', js);

// ---------- showcase page ----------
const ic = (n, cls = '', duo = false) => `<svg class="ic ${cls}" aria-hidden="true"><use href="#xc-${n}${duo ? '-duo' : ''}"/></svg>`;
const L = Object.fromEntries(ICONS.map((i) => [i[0], i[1]]));
const gridItems = ICONS.map((i) => `<button class="cell" type="button" data-name="${i[0]}" title="Sao chép tên: ${i[0]}">${ic(i[0])}<b>${i[1]}</b><code>${i[0]}</code></button>`).join('');
const pick = ['ai-sparkle', 'calendar', 'ticket', 'chart-bar', 'settings', 'map-pin', 'search', 'user'];
const sizes = [16, 20, 24, 32, 48];
const ramp = sizes.map((s) => `<div class="ramp-row"><span class="ramp-l">${s}px</span><div class="ramp-i">${pick.map((n) => `<svg class="ic" style="width:${s}px;height:${s}px"><use href="#xc-${n}"/></svg>`).join('')}</div></div>`).join('');
const pickTheme = ['home', 'dashboard', 'calendar', 'ticket', 'users', 'wallet', 'chart-line', 'megaphone', 'qr', 'image', 'ai-sparkle', 'mail', 'settings', 'search', 'download', 'share', 'lock', 'moon'];
const themeGrid = (duo) => pickTheme.map((n) => ic(n, '', duo)).join('');
const duoRow = ['home', 'dashboard', 'calendar', 'ticket', 'map-pin', 'users', 'wallet', 'chart-bar', 'chart-pie', 'tag', 'megaphone', 'ai-sparkle', 'qr', 'image', 'moon', 'eye'];
const duoCells = duoRow.map((n) => `<div class="duo-c">${ic(n, 'lg')}${ic(n, 'lg', true)}<code>${n}</code></div>`).join('');

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bộ icon Xclipse</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap" rel="stylesheet">
<style>
:root{--ice:#DBF2FC;--ice2:#EEF9FE;--navy:#072D59;--navy2:#0B3A72;--coral:#FD6E88;--coral-text:#C93252;--line:rgba(7,45,89,.14);--muted:#41597a;--xc-accent:#FD6E88;
--sans:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--serif:"Playfair Display",Georgia,"Times New Roman",serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--ice2);color:var(--navy);font:400 16px/1.55 var(--sans);-webkit-font-smoothing:antialiased}
.ic{width:24px;height:24px;display:inline-block;flex:none;vertical-align:middle}
.ic.lg{width:32px;height:32px}
code{font:500 11px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
.it{font-family:var(--serif);font-style:italic;font-weight:500}
/* hero */
.hero{position:relative;overflow:hidden;background:var(--ice);border-bottom:1px solid var(--line)}
.hero:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 14px,rgba(7,45,89,.035) 14px 28px);pointer-events:none}
.hero .wrap{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:center;padding-top:72px;padding-bottom:72px}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font:600 12px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--coral-text)}
.eyebrow .ic{width:16px;height:16px}
h1{font:700 clamp(40px,6.2vw,76px)/1.04 var(--sans);letter-spacing:-.025em;margin:18px 0 18px}
h1 .it{color:var(--coral-text);font-weight:600;letter-spacing:-.01em}
.lead{max-width:520px;font-size:18px;color:var(--muted);margin:0 0 28px}
.stats{display:flex;gap:28px;flex-wrap:wrap}
.stats div{display:flex;flex-direction:column}.stats b{font:700 28px/1.1 var(--sans)}.stats span{font-size:13px;color:var(--muted)}
.art{position:relative;aspect-ratio:1;max-width:420px;width:100%;justify-self:center}
.art .c1,.art .c2{position:absolute;border-radius:50%}
.art .c1{width:66%;height:66%;left:4%;top:17%;background:var(--navy)}
.art .c2{width:66%;height:66%;right:4%;top:17%;background:var(--coral);mix-blend-mode:normal;clip-path:circle(50% at 50% 50%)}
.art .c1:after{content:"";position:absolute;inset:0;border-radius:50%;background:repeating-linear-gradient(90deg,rgba(219,242,252,.10) 0 6px,transparent 6px 12px)}
.art .c3{position:absolute;width:66%;height:66%;left:4%;top:17%;border-radius:50%;background:var(--navy);clip-path:circle(50% at 50% 50%);-webkit-mask:none}
.art .lens{position:absolute;left:34%;top:17%;width:36%;height:66%;overflow:hidden}
.art .chip{position:absolute;display:grid;place-items:center;width:56px;height:56px;border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(7,45,89,.16);color:var(--navy)}
.art .chip .ic{width:28px;height:28px}
/* sections */
section{padding:64px 0;border-bottom:1px solid var(--line)}
section.dark-s{background:var(--navy);color:var(--ice);border-bottom:0}
.sh{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:32px}
h2{font:700 clamp(26px,3.4vw,38px)/1.12 var(--sans);letter-spacing:-.02em;margin:0}
h2 .it{color:var(--coral-text)}
.sh p{margin:6px 0 0;color:var(--muted);max-width:560px}
.sh .hint{font-size:13px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(9,1fr);gap:0;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:#fff}
.cell{appearance:none;border:0;background:#fff;font:inherit;color:var(--navy);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px 8px 16px;text-align:center;border-right:1px solid var(--line);border-bottom:1px solid var(--line);margin:0 -1px -1px 0;transition:background .15s}
.cell:hover,.cell:focus-visible{background:var(--ice);outline:none}
.cell .ic{width:32px;height:32px;margin-bottom:6px}
.cell b{font:600 13px/1.25 var(--sans)}
.cell code{color:var(--muted);font-weight:400}
.cell.ok:after{content:"Đã chép";position:absolute}
.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:var(--navy);color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;opacity:0;transition:.2s;pointer-events:none;z-index:9}
.toast.on{opacity:1;transform:translate(-50%,0)}
/* ramp */
.ramp{background:#fff;border:1px solid var(--line);border-radius:20px;padding:12px 24px}
.ramp-row{display:flex;align-items:center;gap:24px;padding:14px 0;border-bottom:1px dashed var(--line)}
.ramp-row:last-child{border:0}
.ramp-l{width:48px;font:600 13px var(--sans);color:var(--muted)}
.ramp-i{display:flex;gap:28px;align-items:center;flex-wrap:wrap}
/* themes */
.themes{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.panel{border-radius:20px;padding:28px;border:1px solid var(--line)}
.panel.light{background:#fff;color:var(--navy)}
.panel.dark{background:var(--navy);color:var(--ice);border-color:var(--navy)}
.panel h3{margin:0 0 18px;font:600 14px var(--sans);letter-spacing:.04em;text-transform:uppercase;opacity:.75}
.icrow{display:grid;grid-template-columns:repeat(6,1fr);gap:22px 8px;justify-items:center}
.panel.dark .stack{color:var(--coral)}
.sizes{display:flex;gap:14px;align-items:center;margin-top:24px;padding-top:20px;border-top:1px solid currentColor;border-color:rgba(127,150,180,.3)}
.sizes .ic{width:16px;height:16px}.sizes .ic.m{width:20px;height:20px}
.sizes span{font-size:13px;opacity:.7;margin-right:auto}
/* duo */
.duo{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
.duo-c{background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px 10px 12px;display:grid;grid-template-columns:auto auto;justify-content:center;gap:10px 16px;text-align:center}
.duo-c code{grid-column:1/-1;color:var(--muted);font-weight:400}
/* mockup */
.stage{background:linear-gradient(135deg,var(--ice),#c9e9f8);border-radius:28px;padding:32px;border:1px solid var(--line)}
.app{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(7,45,89,.18);border:1px solid var(--line)}
.top{display:flex;align-items:center;gap:16px;padding:12px 20px;border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:10px;font:700 17px var(--sans);letter-spacing:-.01em}
.brand i{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--navy);color:var(--ice)}
.brand i .ic{width:22px;height:22px}
.sbox{flex:1;max-width:420px;display:flex;align-items:center;gap:10px;background:var(--ice2);border:1px solid var(--line);border-radius:12px;padding:8px 12px;color:var(--muted);font-size:14px}
.sbox .ic{width:20px;height:20px}
.top .sp{flex:1}
.ib{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;color:var(--navy);position:relative}
.ib .ic{width:20px;height:20px}
.ib.b:after{content:"";position:absolute;top:8px;right:8px;width:8px;height:8px;border-radius:50%;background:var(--coral);border:2px solid #fff}
.avatar{width:34px;height:34px;border-radius:50%;background:var(--navy);color:var(--ice);display:grid;place-items:center;font:600 13px var(--sans)}
.body{display:grid;grid-template-columns:220px 1fr}
.side{padding:16px 12px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:2px;background:#fbfdff}
.nv{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;font:500 14.5px var(--sans);color:var(--muted)}
.nv .ic{width:20px;height:20px}
.nv.on{background:var(--navy);color:#fff}
.nv.on .ic{color:var(--coral)}
.nv small{margin-left:auto;font:600 11px var(--sans);background:var(--ice);color:var(--navy);padding:2px 8px;border-radius:99px}
.main{padding:24px;min-width:0}
.mh{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.mh h4{margin:0;font:700 24px/1.2 var(--sans);letter-spacing:-.015em}
.mh h4 .it{color:var(--coral-text)}
.mh p{margin:4px 0 0;font-size:14px;color:var(--muted);display:flex;gap:14px;flex-wrap:wrap}
.mh p span{display:inline-flex;align-items:center;gap:6px}.mh p .ic{width:16px;height:16px}
.btns{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;border-radius:12px;padding:10px 16px;font:600 14px var(--sans);border:1px solid var(--line);background:#fff;color:var(--navy)}
.btn .ic{width:18px;height:18px}
.btn.p{background:var(--navy);color:#fff;border-color:var(--navy)}
.btn.c{background:var(--coral);border-color:var(--coral);color:var(--navy)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.kpi{border:1px solid var(--line);border-radius:16px;padding:16px;background:#fff}
.kpi .ki{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--ice);color:var(--navy);margin-bottom:14px}
.kpi .ki .ic{width:22px;height:22px}
.kpi span{display:block;font-size:13px;color:var(--muted)}
.kpi b{display:block;font:700 26px/1.2 var(--sans);letter-spacing:-.02em}
.kpi em{font:600 12px var(--sans);font-style:normal;color:#0a7d4f;display:inline-flex;align-items:center;gap:4px}
.kpi em .ic{width:14px;height:14px}
.rows{margin-top:18px;border:1px solid var(--line);border-radius:16px;overflow:hidden}
.rw{display:flex;align-items:center;gap:14px;padding:12px 16px;border-bottom:1px solid var(--line);font-size:14px}
.rw:last-child{border:0}
.rw .ic{width:20px;height:20px;color:var(--muted)}
.rw b{font-weight:600}.rw .g{margin-left:auto;color:var(--muted);display:flex;align-items:center;gap:6px}
.tag{font:600 12px var(--sans);padding:3px 10px;border-radius:99px;background:var(--ice);color:var(--navy)}
.tag.ok{background:#d9f5e8;color:#0a6a43}.tag.w{background:#ffe3e8;color:var(--coral-text)}
/* rules */
.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.rule{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px}
.rule h3{margin:12px 0 6px;font:700 17px var(--sans)}
.rule p{margin:0;color:var(--muted);font-size:14.5px}
.rule .demo{height:132px;border-radius:14px;background:var(--ice2);display:grid;place-items:center;position:relative;overflow:hidden}
.rule .demo svg{width:112px;height:112px}
footer{padding:36px 0 48px;color:var(--muted);font-size:14px}
footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
/* responsive */
@media(max-width:900px){
 .hero .wrap{grid-template-columns:1fr;padding-top:48px;padding-bottom:40px}
 .art{max-width:300px}
 .themes{grid-template-columns:1fr}
 .grid{grid-template-columns:repeat(6,1fr)}
 .rules{grid-template-columns:1fr}
 .kpis{grid-template-columns:repeat(2,1fr)}
 .body{grid-template-columns:1fr}
 .side{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);padding:10px}
 .nv{white-space:nowrap;flex:none}.nv small{display:none}
}
@media(max-width:560px){
 .wrap{padding:0 16px}
 section{padding:44px 0}
 .grid{grid-template-columns:repeat(3,1fr);border-radius:16px}
 .cell{padding:16px 4px 12px}.cell .ic{width:28px;height:28px}.cell b{font-size:12px}.cell code{font-size:10px}
 .ramp{padding:6px 16px}.ramp-row{gap:12px;flex-wrap:wrap}.ramp-i{gap:16px}
 .icrow{grid-template-columns:repeat(6,1fr);gap:18px 4px}
 .panel{padding:20px 14px}
 .stage{padding:12px;border-radius:20px}
 .top{padding:10px 12px;gap:8px}.sbox{display:none}.brand{font-size:15px}
 .main{padding:16px 14px}
 .mh h4{font-size:20px}
 .kpis{gap:10px}.kpi{padding:12px}.kpi b{font-size:21px}
 .rw .g{display:none}
 .duo{grid-template-columns:repeat(2,1fr)}
 .lead{font-size:16px}
}
</style>
</head>
<body>
<div id="sprite" aria-hidden="true">${fs.readFileSync('sprite.svg', 'utf8').replace(/\n/g, '')}</div>

<header class="hero">
 <div class="wrap">
  <div>
   <span class="eyebrow">${ic('ai-sparkle')} Xclipse Design System</span>
   <h1>Bộ icon <span class="it">Xclipse</span></h1>
   <p class="lead">${ICONS.length} icon nét mảnh, bo tròn, vẽ trên lưới 24 × 24 cho trang sự kiện và mini-app kinh doanh. Dấu ấn nhật thực nằm kín đáo trong từng nét vẽ, đọc rõ từ 16 px.</p>
   <div class="stats"><div><b>${ICONS.length}</b><span>icon</span></div><div><b>1,75 px</b><span>độ dày nét</span></div><div><b>24 × 24</b><span>lưới cơ sở</span></div><div><b>2 kiểu</b><span>nét &amp; duotone</span></div></div>
  </div>
  <div class="art" aria-hidden="true">
   <svg viewBox="0 0 400 400" width="100%" height="100%"><defs>
     <pattern id="fl" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="6" height="12" fill="#DBF2FC" fill-opacity=".12"/></pattern>
     <clipPath id="ca"><circle cx="150" cy="200" r="120"/></clipPath></defs>
     <circle cx="250" cy="200" r="120" fill="#FD6E88"/>
     <circle cx="150" cy="200" r="120" fill="#072D59"/>
     <circle cx="150" cy="200" r="120" fill="url(#fl)"/>
     <g clip-path="url(#ca)"><circle cx="250" cy="200" r="120" fill="none" stroke="#DBF2FC" stroke-width="2.5"/></g>
     <g transform="translate(150 200)" fill="none" stroke="#DBF2FC" stroke-width="7" stroke-linecap="round"><path d="M-40 -40 40 40M40 -40 18 -18M-18 18-40 40"/></g>
   </svg>
   <span class="chip" style="left:2%;top:6%">${ic('calendar', '', true)}</span>
   <span class="chip" style="right:0;top:14%">${ic('ticket', '', true)}</span>
   <span class="chip" style="left:8%;bottom:6%">${ic('chart-bar', '', true)}</span>
   <span class="chip" style="right:6%;bottom:4%">${ic('ai-sparkle', '', true)}</span>
  </div>
 </div>
</header>

<section id="bo-icon"><div class="wrap">
 <div class="sh"><div><h2>Toàn bộ <span class="it">${ICONS.length} icon</span></h2><p>Nhấn vào một icon để sao chép tên dùng trong <code>XcIcons.svg('tên')</code>.</p></div><span class="hint">Nét 1,75 · bo tròn · currentColor</span></div>
 <div class="grid" id="grid">${gridItems}</div>
</div></section>

<section><div class="wrap">
 <div class="sh"><div><h2>Đọc rõ ở <span class="it">mọi cỡ</span></h2><p>Được căn theo pixel để vẫn sắc nét ở 16 px và 20 px, kích thước thường dùng trong thanh công cụ và nút bấm.</p></div></div>
 <div class="ramp">${ramp}</div>
</div></section>

<section><div class="wrap">
 <div class="sh"><div><h2>Sáng &amp; <span class="it">tối</span></h2><p>Icon dùng <code>currentColor</code> nên tự đổi theo màu chữ. Chỉ chấm nhấn coral được giữ nguyên.</p></div></div>
 <div class="themes">
  <div class="panel light"><h3>Nền sáng</h3><div class="icrow">${themeGrid(false)}</div>
   <div class="sizes"><span>Nền sáng, 16 · 20 px</span>${['home', 'ticket', 'qr'].map((n) => ic(n)).join('')}${['home', 'ticket', 'qr'].map((n) => ic(n, 'm')).join('')}</div></div>
  <div class="panel dark"><h3>Nền tối</h3><div class="icrow">${themeGrid(false)}</div>
   <div class="sizes"><span>Nền tối, 16 · 20 px</span>${['home', 'ticket', 'qr'].map((n) => ic(n)).join('')}${['home', 'ticket', 'qr'].map((n) => ic(n, 'm')).join('')}</div></div>
 </div>
</div></section>

<section><div class="wrap">
 <div class="sh"><div><h2>Biến thể <span class="it">duotone</span></h2><p>Lớp nền 18% cùng chấm nhấn coral cho trạng thái nổi bật. Mỗi cặp: nét thường và duotone.</p></div></div>
 <div class="duo">${duoCells}</div>
</div></section>

<section><div class="wrap">
 <div class="sh"><div><h2>Trong <span class="it">giao diện thật</span></h2><p>Thanh trên, thanh bên, nút, thẻ chỉ số và danh sách của một mini-app kinh doanh.</p></div></div>
 <div class="stage"><div class="app">
  <div class="top"><div class="brand"><i>${ic('x-mark')}</i>Xclipse</div>
   <div class="sbox">${ic('search')}Tìm sự kiện, khách mời, vé…</div><div class="sp"></div>
   <span class="ib">${ic('moon')}</span><span class="ib b">${ic('mail')}</span><span class="avatar">LN</span></div>
  <div class="body">
   <nav class="side">
    <span class="nv">${ic('home')}Tổng quan</span>
    <span class="nv on">${ic('calendar')}Sự kiện<small>12</small></span>
    <span class="nv">${ic('ticket')}Vé &amp; voucher</span>
    <span class="nv">${ic('users')}Khách mời</span>
    <span class="nv">${ic('chart-bar')}Báo cáo</span>
    <span class="nv">${ic('megaphone')}Chiến dịch</span>
    <span class="nv">${ic('settings')}Cài đặt</span>
   </nav>
   <div class="main">
    <div class="mh"><div><h4>Đêm nhạc <span class="it">Nhật thực</span> 2026</h4>
      <p><span>${ic('clock')}19:30, 12/12/2026</span><span>${ic('map-pin')}Nhà hát Thành phố, TP.HCM</span></p></div>
     <div class="btns"><span class="btn">${ic('export')}Xuất CSV</span><span class="btn">${ic('share')}Chia sẻ</span><span class="btn p">${ic('plus')}Tạo sự kiện</span></div></div>
    <div class="kpis">
     <div class="kpi"><div class="ki">${ic('wallet')}</div><span>Doanh thu</span><b>128,4 tr</b><em>${ic('chart-line')}+18%</em></div>
     <div class="kpi"><div class="ki">${ic('ticket')}</div><span>Vé đã bán</span><b>1.284</b><em>${ic('chart-line')}+9%</em></div>
     <div class="kpi"><div class="ki">${ic('users')}</div><span>Khách mời</span><b>96</b><em>${ic('check')}Đã xác nhận</em></div>
     <div class="kpi"><div class="ki">${ic('qr')}</div><span>Check-in</span><b>72%</b><em>${ic('refresh')}Cập nhật</em></div>
    </div>
    <div class="rows">
     <div class="rw">${ic('ai-sparkle')}<b>Gợi ý nội dung bằng AI</b><span class="tag">Mới</span><span class="g">${ic('arrow-right')}</span></div>
     <div class="rw">${ic('tag')}<b>Voucher EARLYBIRD</b><span class="tag ok">Đang chạy</span><span class="g">${ic('eye')}412 lượt xem</span></div>
     <div class="rw">${ic('alert')}<b>Hạn đăng ký còn 3 ngày</b><span class="tag w">Cần xử lý</span><span class="g">${ic('more')}</span></div>
    </div>
   </div>
  </div>
 </div></div>
</div></section>

<section class="dark-s"><div class="wrap">
 <div class="sh"><div><h2>Nguyên tắc <span class="it" style="color:var(--coral)">thiết kế</span></h2><p style="color:#a9c6de">Sáu quy tắc để mọi icon mới đồng bộ với bộ hiện tại.</p></div></div>
 <div class="rules">
  ${[
    ['Lưới 24 × 24', 'Vùng vẽ 20 × 20, lề 2 px. Toạ độ nguyên hoặc nửa pixel để nét sắc ở 16 px và 20 px.', 'M4 4h16v16H4zM2 2h20v20H2z'],
    ['Nét 1,75 px', 'Đầu nét và góc nối bo tròn, màu currentColor. Không dùng nền đặc, trừ biến thể duotone.', 'M5 17 12 6l7 11'],
    ['Bo góc 2', 'Mọi góc hình khối dùng bán kính 2. Các chi tiết nhỏ (hộp thư, vé) dùng bán kính 1 khi cần giữ hình.', 'M5 5h8a6 6 0 0 1 6 6v8'],
    ['Dấu nhật thực', 'Một khoảng cắt tròn hoặc cung lệch, đặt ở nơi tự nhiên: vé, voucher, ai-sparkle, mặt trăng. Không lạm dụng.', 'M9 4a8 8 0 1 0 8 8'],
    ['Duotone', 'Lớp nền cùng màu ở độ mờ 18% và tối đa một chấm nhấn coral #FD6E88. Chữ coral nhỏ dùng #C93252.', 'M12 4a8 8 0 1 0 0 16z'],
    ['Đọc rõ ở 16 px', 'Tối đa hai lớp chi tiết, khoảng hở giữa các nét ≥ 2 px. Kiểm tra từng icon ở 16, 20 và 24 px.', 'M6 12h12M12 6v12'],
  ].map(([t, p, d], k) => `<div class="rule" style="background:rgba(219,242,252,.06);border-color:rgba(219,242,252,.18)"><div class="demo" style="background:rgba(219,242,252,.08);color:#DBF2FC"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/>${k === 4 ? '<circle cx="17" cy="7" r="1.75" fill="#FD6E88" stroke="none"/>' : ''}</svg></div><h3>${t}</h3><p style="color:#a9c6de">${p}</p></div>`).join('')}
 </div>
</div></section>

<footer style="background:var(--navy);color:#a9c6de"><div class="wrap"><span>© Xclipse · Bộ icon v1.0</span><span><code>XcIcons.svg('home', {size: 20, duo: true})</code></span></div></footer>
<div class="toast" id="toast" role="status"></div>
<script>
(function(){var t=document.getElementById('toast'),to;document.getElementById('grid').addEventListener('click',function(e){var c=e.target.closest('.cell');if(!c)return;var n=c.dataset.name;try{navigator.clipboard.writeText(n)}catch(_){}t.textContent='Đã chọn: '+n;t.classList.add('on');clearTimeout(to);to=setTimeout(function(){t.classList.remove('on')},1400)})})();
</script>
</body>
</html>
`;
fs.writeFileSync('index.html', html);
console.log('built', ICONS.length);
