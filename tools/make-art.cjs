// make-art.cjs — vẽ ảnh nền (hero) cho từng mẫu landing page dưới dạng SVG.
// Mỗi mẫu có "họa tiết" (motif) + biến thể; màu lấy từ bảng màu của mẫu; ngẫu nhiên có hạt giống theo id
// nên chạy lại vẫn ra đúng ảnh cũ. Chạy: node tools/make-art.cjs <templates.json> <thư-mục-ra>
const fs = require('fs');
const path = require('path');

function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hex(c) { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); }
function toHex(a) { return '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); }

const W = 1600, H = 900;

function draw(t) {
  const th = t.theme, R = rng(t.id), v = (t.art && t.art.variant) || 0, motif = (t.art && t.art.motif) || 'grid';
  const P = th.primary, A = th.accent, S = th.surface || '#ffffff';
  const dark = mix(P, '#000000', 0.45), light = mix(S, '#ffffff', 0.4), acc2 = mix(A, '#ffffff', 0.35);
  const r = (a, b) => a + R() * (b - a);
  const pick = arr => arr[Math.floor(R() * arr.length)];
  const cols = [A, acc2, light, mix(P, '#ffffff', 0.35)];
  const out = [];
  const add = s => out.push(s);
  const op = (o) => `opacity="${o.toFixed(2)}"`;

  // Nền: chuyển màu chéo + quầng sáng
  const ang = [0, 25, 60, 120][v];
  add(`<defs>
  <linearGradient id="bg" gradientTransform="rotate(${ang} .5 .5)"><stop offset="0" stop-color="${mix(P, '#ffffff', 0.08)}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
  <radialGradient id="glow" cx="${[0.78, 0.2, 0.7, 0.5][v]}" cy="${[0.3, 0.25, 0.75, 0.15][v]}" r="0.6"><stop offset="0" stop-color="${A}" stop-opacity=".55"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></radialGradient>
  <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="${dark}" stop-opacity=".85"/><stop offset=".55" stop-color="${dark}" stop-opacity="0"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${18 + v * 4}"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>`);
  // Mảng màu mờ
  for (let i = 0; i < 4; i++) add(`<circle cx="${r(700, 1600)}" cy="${r(0, 900)}" r="${r(120, 320)}" fill="${pick(cols)}" ${op(r(0.08, 0.22))} filter="url(#soft)"/>`);

  const g = [];
  const X0 = 760; // họa tiết chủ yếu nửa phải (chữ nằm bên trái)
  switch (motif) {
    case 'circuit': for (let i = 0; i < 26; i++) { let x = r(X0, W), y = r(40, 860); let d = `M${x} ${y}`; for (let k = 0; k < 4; k++) { if (R() > .5) x += r(-160, 160); else y += r(-120, 120); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; } g.push(`<path d="${d}" stroke="${pick(cols)}" stroke-width="3" fill="none" ${op(r(.35, .8))}/><circle cx="${x}" cy="${y}" r="7" fill="${A}"/>`); } break;
    case 'books': for (let i = 0; i < 9; i++) { const w = r(46, 80), h = r(260, 420), x = X0 + 60 + i * 86, y = 860 - h; g.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${pick(cols)}" ${op(r(.5, .9))} transform="rotate(${i === 7 ? -12 : 0} ${x} ${y + h})"/><rect x="${x + 8}" y="${y + 30}" width="${w - 16}" height="10" fill="${dark}" opacity=".35"/>`); } break;
    case 'petals': for (let i = 0; i < 22; i++) { const x = r(X0, W), y = r(0, H), s = r(.6, 1.8), a = r(0, 360); g.push(`<path d="M0 0 C 30 -40 70 -40 90 0 C 70 40 30 40 0 0Z" transform="translate(${x} ${y}) rotate(${a}) scale(${s})" fill="${pick([A, acc2, light])}" ${op(r(.35, .85))}/>`); } break;
    case 'coffee': for (let i = 0; i < 3; i++) { const x = X0 + 120 + i * 260, y = 480 + (i % 2) * 110; g.push(`<path d="M${x} ${y} h190 v150 a95 95 0 0 1 -190 0z" fill="${pick(cols)}" ${op(.75)}/><path d="M${x + 170} ${y + 30} a40 40 0 0 1 0 80" stroke="${light}" stroke-width="14" fill="none" opacity=".6"/>`); for (let k = 0; k < 3; k++) g.push(`<path d="M${x + 45 + k * 40} ${y - 30} c -20 -40 20 -60 0 -110" stroke="${light}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".45"/>`); } break;
    case 'chart': { let x = X0 + 40; for (let i = 0; i < 10; i++) { const h = 120 + i * r(20, 55); g.push(`<rect x="${x}" y="${850 - h}" width="54" height="${h}" rx="8" fill="${i % 3 ? light : A}" ${op(i % 3 ? .35 : .85)}/>`); x += 78; } let d = `M${X0 + 40} 640`; for (let i = 1; i < 10; i++) d += ` L${X0 + 40 + i * 78} ${640 - i * r(30, 52)}`; g.push(`<path d="${d}" stroke="${A}" stroke-width="8" fill="none" stroke-linejoin="round"/>`); break; }
    case 'rings': for (let i = 0; i < 2; i++) g.push(`<circle cx="${1060 + i * 230}" cy="${430 + i * 40}" r="250" stroke="${i ? A : light}" stroke-width="22" fill="none" opacity=".8"/>`); for (let i = 0; i < 30; i++) g.push(`<circle cx="${r(X0, W)}" cy="${r(0, H)}" r="${r(2, 6)}" fill="${light}" ${op(r(.3, .9))}/>`); break;
    case 'spotlight': for (let i = 0; i < 5; i++) { const x = X0 + 80 + i * 180; g.push(`<path d="M${x} -20 L${x - 160} 900 L${x + 160} 900Z" fill="${pick([A, light, acc2])}" ${op(r(.12, .28))}/>`); } g.push(`<rect x="${X0}" y="760" width="${W - X0}" height="140" fill="${dark}" opacity=".7"/>`); for (let i = 0; i < 40; i++) g.push(`<circle cx="${r(X0, W)}" cy="${r(780, 880)}" r="${r(10, 22)}" fill="${dark}"/>`); break;
    case 'mountains': for (let l = 0; l < 3; l++) { let d = `M${X0 - 200} 900`; for (let x = X0 - 200; x <= W + 100; x += r(140, 260)) d += ` L${x.toFixed(0)} ${(r(380, 640) + l * 90).toFixed(0)}`; d += ` L${W + 100} 900Z`; g.push(`<path d="${d}" fill="${[light, acc2, dark][l]}" ${op([.3, .45, .8][l])}/>`); } g.push(`<circle cx="1320" cy="230" r="70" fill="${A}" opacity=".85"/>`); break;
    case 'waves': for (let l = 0; l < 6; l++) { const y = 380 + l * 85; let d = `M${X0 - 300} ${y}`; for (let x = X0 - 300; x < W + 200; x += 200) d += ` q 100 ${l % 2 ? -60 : 60} 200 0`; g.push(`<path d="${d}" stroke="${pick(cols)}" stroke-width="${10 + l * 2}" fill="none" ${op(.25 + l * .1)} stroke-linecap="round"/>`); } break;
    case 'skyline': { let x = X0 - 40; while (x < W) { const w = r(60, 130), h = r(220, 600); g.push(`<rect x="${x}" y="${900 - h}" width="${w}" height="${h}" fill="${R() > .7 ? A : light}" ${op(r(.25, .55))}/>`); for (let yy = 900 - h + 20; yy < 880; yy += 36) for (let xx = x + 12; xx < x + w - 12; xx += 24) if (R() > .45) g.push(`<rect x="${xx}" y="${yy}" width="10" height="16" fill="${light}" opacity=".6"/>`); x += w + 10; } break; }
    case 'house': for (let i = 0; i < 3; i++) { const x = X0 + 80 + i * 250, y = 470 + (i % 2) * 70, s = 1 - i * .1; g.push(`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 120 L120 0 L240 120Z" fill="${A}" opacity=".9"/><rect x="25" y="120" width="190" height="200" fill="${light}" opacity=".7"/><rect x="95" y="210" width="50" height="110" fill="${dark}" opacity=".6"/><rect x="45" y="150" width="40" height="40" fill="${dark}" opacity=".4"/><rect x="155" y="150" width="40" height="40" fill="${dark}" opacity=".4"/></g>`); } break;
    case 'leaves': for (let i = 0; i < 16; i++) { const x = r(X0, W), y = r(0, H), a = r(0, 360), s = r(.8, 2.2); g.push(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0 C 40 -50 110 -40 140 0 C 110 40 40 50 0 0Z" fill="${pick([A, acc2, light])}" ${op(r(.35, .8))}/><path d="M0 0 L140 0" stroke="${dark}" stroke-width="2" opacity=".35"/></g>`); } break;
    case 'confetti': for (let i = 0; i < 70; i++) { const x = r(X0 - 100, W), y = r(0, H); g.push(R() > .5 ? `<rect x="${x}" y="${y}" width="${r(10, 26)}" height="${r(5, 10)}" fill="${pick(cols)}" transform="rotate(${r(0, 180)} ${x} ${y})" ${op(r(.5, 1))}/>` : `<circle cx="${x}" cy="${y}" r="${r(4, 10)}" fill="${pick(cols)}" ${op(r(.5, 1))}/>`); } break;
    case 'palette': for (let i = 0; i < 12; i++) { const x = r(X0, W - 100), y = r(80, 820); g.push(`<path d="M${x} ${y} c ${r(60, 200)} ${r(-80, 80)} ${r(120, 260)} ${r(-60, 60)} ${r(240, 380)} ${r(-40, 40)}" stroke="${pick(cols)}" stroke-width="${r(20, 54)}" fill="none" stroke-linecap="round" ${op(r(.4, .85))}/>`); } break;
    case 'track': for (let i = 0; i < 7; i++) g.push(`<path d="M${X0 - 100} ${300 + i * 60} C ${X0 + 300} ${260 + i * 60}, ${W - 300} ${520 + i * 50}, ${W + 100} ${460 + i * 55}" stroke="${i % 3 ? light : A}" stroke-width="${i % 3 ? 4 : 10}" fill="none" ${op(i % 3 ? .4 : .85)} stroke-dasharray="${i % 3 ? '30 18' : ''}"/>`); break;
    case 'hearts': for (let i = 0; i < 18; i++) { const x = r(X0, W), y = r(0, H), s = r(.5, 2); g.push(`<path d="M0 30 C 0 0 40 0 40 30 C 40 0 80 0 80 30 C 80 60 40 80 40 100 C 40 80 0 60 0 30Z" transform="translate(${x} ${y}) scale(${s}) rotate(${r(-20, 20)})" fill="${pick([A, acc2, light])}" ${op(r(.35, .85))}/>`); } break;
    case 'globe': g.push(`<circle cx="1180" cy="450" r="300" stroke="${light}" stroke-width="6" fill="none" opacity=".7"/>`); for (let i = 1; i < 6; i++) g.push(`<ellipse cx="1180" cy="450" rx="${i * 55}" ry="300" stroke="${light}" stroke-width="3" fill="none" opacity=".45"/><path d="M880 ${450 - 300 + i * 100} H1480" stroke="${light}" stroke-width="3" opacity=".35"/>`); g.push(`<path d="M820 640 C 1000 420, 1300 760, 1560 300" stroke="${A}" stroke-width="7" fill="none" stroke-dasharray="18 14"/>`); break;
    case 'notes': for (let i = 0; i < 5; i++) g.push(`<path d="M${X0 - 80} ${260 + i * 34} H${W}" stroke="${light}" stroke-width="3" opacity=".45"/>`); for (let i = 0; i < 12; i++) { const x = r(X0, W - 60), y = r(180, 760); g.push(`<g fill="${pick([A, light, acc2])}" ${op(r(.55, .95))}><ellipse cx="${x}" cy="${y}" rx="26" ry="19" transform="rotate(-20 ${x} ${y})"/><rect x="${x + 20}" y="${y - 130}" width="8" height="130"/>${R() > .5 ? `<path d="M${x + 28} ${y - 130} q 50 20 40 70" stroke="currentColor" stroke-width="8" fill="none"/>` : ''}</g>`); } break;
    case 'gift': for (let i = 0; i < 4; i++) { const x = X0 + 40 + i * 205, s = r(190, 280), y = 860 - s; g.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="10" fill="${pick(cols)}" opacity=".75"/><rect x="${x + s / 2 - 12}" y="${y}" width="24" height="${s}" fill="${dark}" opacity=".35"/><rect x="${x}" y="${y + s / 3}" width="${s}" height="22" fill="${dark}" opacity=".3"/>`); } break;
    case 'grid': for (let x = X0; x < W; x += 80) for (let y = 40; y < H; y += 80) if (R() > .35) g.push(`<rect x="${x}" y="${y}" width="${R() > .8 ? 150 : 64}" height="64" rx="10" fill="${pick(cols)}" ${op(r(.12, .55))}/>`); break;
    case 'sun': g.push(`<circle cx="1220" cy="${[600, 450, 380, 520][v]}" r="190" fill="${A}" opacity=".9"/>`); for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; g.push(`<path d="M${1220 + Math.cos(a) * 230} ${[600, 450, 380, 520][v] + Math.sin(a) * 230} L${1220 + Math.cos(a) * 330} ${[600, 450, 380, 520][v] + Math.sin(a) * 330}" stroke="${acc2}" stroke-width="10" stroke-linecap="round" opacity=".6"/>`); } break;
    case 'stars': for (let i = 0; i < 90; i++) g.push(`<circle cx="${r(X0 - 200, W)}" cy="${r(0, H)}" r="${r(1, 4)}" fill="${light}" ${op(r(.3, 1))}/>`); for (let i = 0; i < 6; i++) { const x = r(X0, W), y = r(60, 800), s = r(14, 34); g.push(`<path d="M${x} ${y - s} L${x + s * .3} ${y - s * .3} L${x + s} ${y} L${x + s * .3} ${y + s * .3} L${x} ${y + s} L${x - s * .3} ${y + s * .3} L${x - s} ${y} L${x - s * .3} ${y - s * .3}Z" fill="${A}" opacity=".9"/>`); } break;
    case 'bubbles': for (let i = 0; i < 26; i++) g.push(`<circle cx="${r(X0, W)}" cy="${r(0, H)}" r="${r(14, 110)}" fill="${pick(cols)}" ${op(r(.12, .45))} stroke="${light}" stroke-width="2" stroke-opacity=".4"/>`); break;
    case 'ribbon': for (let i = 0; i < 4; i++) { const y = 200 + i * 160; g.push(`<path d="M${X0 - 100} ${y} C ${X0 + 250} ${y - 160}, ${W - 400} ${y + 200}, ${W + 80} ${y - 40}" stroke="${pick(cols)}" stroke-width="${r(40, 80)}" fill="none" stroke-linecap="round" ${op(r(.35, .75))}/>`); } break;
    default: break;
  }
  if (v === 1 || v === 3) add(`<g transform="translate(${X0 + W} 0) scale(-1 1)">${g.join('')}</g>`); // lật gương trong nửa phải cho đa dạng
  else add(`<g>${g.join('')}</g>`);
  add(`<rect width="${W}" height="${H}" fill="url(#fade)"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${out.join('\n')}</svg>\n`;
}

module.exports = { draw };
if (require.main === module) {
  const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const dir = process.argv[3];
  fs.mkdirSync(dir, { recursive: true });
  list.forEach(t => fs.writeFileSync(path.join(dir, t.id + '.svg'), draw(t)));
  console.log('wrote', list.length, 'svg');
}
