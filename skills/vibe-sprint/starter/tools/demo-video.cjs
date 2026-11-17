#!/usr/bin/env node
// demo-video.cjs: quay video demo DỌC <= 2 phút từ storyboard JSON (Node + Playwright + ffmpeg, không cần npm gói nào thêm).
// Video này vừa là minh chứng thời điểm chốt (BTC), vừa là phương án dự phòng trên sân khấu ("Mời phát video demo").
//
//   node tools/demo-video.cjs --url http://localhost:8211/                          (dùng tools/demo-video.example.json)
//   node tools/demo-video.cjs --url https://xclipsex.github.io/Xclipse-ChungKet/ --storyboard docs/storyboard.json
//   node tools/demo-video.cjs --url ... --voice loi-thoai.mp3 --max 120 --no-cards --out out
//
// CHẠY SONG SONG nhiều agent (prompts/17): mỗi agent quay 1 scene trên cổng riêng, rồi 1 agent ghép:
//   node tools/demo-video.cjs --url http://localhost:8232/ --storyboard docs/storyboard-demo.json --scene home        (ra out/scenes/home.mp4 + home.json)
//   node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --cards-only                                   (ra out/scenes/title.mp4, end.mp4)
//   node tools/demo-video.cjs --storyboard docs/storyboard-demo.json --assemble [--voice x.mp3]                      (ghép các scene có sẵn; scene thiếu thì bỏ qua + cảnh báo)
//   --assemble cũng ra 00-demo-video.mp4 (bản sao để nhúng vào slide video của deck) + 00-demo-video-poster.png (ảnh bìa cùng độ phân giải); chỉ MỘT video <= 2 phút.
// Cờ: --scene <id[,id]> · --assemble · --cards-only · --url <gốc app> · --storyboard <file> · --voice <mp3/wav, tuỳ chọn> · --max <giây, mặc định 120> · --no-cards · --out <thư mục, mặc định out> · --scale <1-4, mặc định 3: độ nét> · --keep (giữ file tạm)
// Ra: out/demo-<app>.mp4 (độ phân giải gốc 390x844 x scale: scale 3 = 1170x2532, scale 4 = 1560x3376; tỉ lệ 9:19.5 giữ nguyên, KHÔNG đệm/cắt/phóng to; H.264 high, crf 18, 30fps) · out/demo-<app>-contact.png · out/demo-<app>.srt
//
// Storyboard (JSON):
//   { "app": "Xclipse", "tagline": "...", "link": "https://...", "notice": "Dữ liệu mô phỏng AI · Dữ liệu mẫu",
//     "title": {"text": "...", "sub": "...", "seconds": 3}, "end": {"text": "...", "sub": "...", "seconds": 4},
//     "scenes": [ { "id": "home", "hash": "#/home", "colorScheme": "light", "caption": "Dòng định danh <= 12 từ", "minDuration": 5,
//        "actions": [ {"tap": "selector"} | {"type": ["selector", "text"]} | {"scroll": 600} | {"wait": 800} | {"theme": "dark"} | {"eval": "js"} ] } ] }
// Chú thích: scene đầu tự thêm ?demo=1 (nạp dữ liệu mẫu); các scene sau giữ trạng thái trình duyệt của scene trước (localStorage) nên dữ liệu vừa thêm vẫn còn.
// Quay bằng CDP screencast (Page.startScreencast) ở deviceScaleFactor = --scale nên nét; nếu CDP lỗi thì lùi về recordVideo (phóng lên bằng lanczos, kém nét hơn).
// Chữ phụ đề được dựng bằng Chromium (phông Be Vietnam Pro trong fonts/) rồi ghép bằng ffmpeg, nên không cần cài phông vào hệ thống.
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(execFileSync('npm', ['root', '-g']).toString().trim() + '/playwright')); }

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const ROOT = path.resolve(__dirname, '..');
const BASE = val('--url', 'http://localhost:8211/').replace(/[?#].*$/, '').replace(/\/?$/, '/');
const SB_FILE = path.resolve(val('--storyboard', path.join(__dirname, 'demo-video.example.json')));
const VOICE = val('--voice', '');
const MAX = +val('--max', 120);
const CARDS = !flag('--no-cards');
const OUT = path.resolve(val('--out', 'out'));
const FF = process.env.FFMPEG || 'ffmpeg';
const SCENE_ARG = val('--scene', '');
const ASSEMBLE_ONLY = flag('--assemble'), CARDS_ONLY = flag('--cards-only');
const SCENES = path.join(OUT, 'scenes');

// Độ phân giải gốc = khung nhìn 390x844 x SCALE (giữ tỉ lệ ~9:19.5, không đệm, không cắt, không phóng to).
const VW = 390, VH = 844;
const SCALE = Math.max(1, Math.min(4, +val('--scale', 3) || 3));
const W = Math.round(VW * SCALE / 2) * 2, H = Math.round(VH * SCALE / 2) * 2;
const FPS = 30;
const CAP_BOX = 190;   // dải chữ phụ đề (px CSS) sát đáy khung nhìn, nằm trên thanh tab dưới

const sb = JSON.parse(fs.readFileSync(SB_FILE, 'utf8'));
const appName = sb.app || 'App';
const slug = appName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app';
const NOTICE = sb.notice === undefined ? 'Dữ liệu mô phỏng AI · Dữ liệu mẫu' : sb.notice;
const TMP = path.join(OUT, '.tmp-' + slug + '-' + process.pid);   // riêng từng tiến trình để chạy song song không giẫm lên nhau
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(SCENES, { recursive: true });
const log = (...a) => console.log('[demo-video]', ...a);
const warn = (...a) => console.warn('[demo-video] CẢNH BÁO:', ...a);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function ff(a) {
  const r = spawnSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', ...a], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('ffmpeg lỗi: ' + (r.stderr || r.error || '').toString().slice(-600));
}
function probeDur(f) {
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
}

// ---- Giao diện thương hiệu (navy / ice / coral), phông từ fonts/ của starter ----
const fontsDir = [path.join(ROOT, 'fonts'), path.join(ROOT, 'starter', 'fonts')].find((d) => fs.existsSync(d));
const fontCss = fontsDir ? [400, 600, 700, 800].map((w) => {
  const f = path.join(fontsDir, `be-vietnam-pro-vietnamese-${w}-normal.woff2`), l = path.join(fontsDir, `be-vietnam-pro-latin-${w}-normal.woff2`);
  const ext = path.join(fontsDir, `be-vietnam-pro-latin-ext-${w}-normal.woff2`);
  return [f, ext, l].filter(fs.existsSync).map((p) => `@font-face{font-family:'BVP';font-weight:${w};src:url('file://${p}') format('woff2')}`).join('');
}).join('') : '';
const BRAND = { navy: '#072D59', ice: '#DBF2FC', coral: '#FD6E88' };
const BASE_CSS = `${fontCss}*{box-sizing:border-box;margin:0}html,body{width:${VW}px;height:${VH}px}body{font-family:'BVP','Be Vietnam Pro',system-ui,sans-serif;color:#fff;overflow:hidden}`;
const bgGradient = `radial-gradient(320px 250px at 85% 8%, rgba(253,110,136,.28), transparent 60%), radial-gradient(360px 320px at 5% 95%, rgba(219,242,252,.16), transparent 60%), linear-gradient(165deg, #0B3A73 0%, ${BRAND.navy} 55%, #041B38 100%)`;

// Mọi trang dựng ở khung nhìn 390x844 với deviceScaleFactor = SCALE nên ảnh ra đúng WxH.
async function renderHtml(browser, html, file, transparent, clip) {
  const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: SCALE });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot(Object.assign({ path: file, omitBackground: !!transparent }, clip ? { clip } : {}));
  await page.close();
}
const cardHtml = (kind, c) => `<style>${BASE_CSS}body{background:${bgGradient};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 32px}
.mark{width:66px;height:66px;border-radius:50%;background:${BRAND.coral};color:${BRAND.navy};font-weight:800;font-size:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px rgba(253,110,136,.18);margin-bottom:26px}
h1{font-size:${kind === 'title' ? 33 : 29}px;line-height:1.12;font-weight:800;letter-spacing:-.4px}p{margin-top:13px;font-size:16px;line-height:1.4;color:${BRAND.ice};font-weight:500}
.link{margin-top:26px;padding:9px 18px;border-radius:999px;background:${BRAND.ice};color:${BRAND.navy};font-size:15px;font-weight:700}
.note{position:absolute;bottom:44px;left:0;right:0;font-size:12px;color:rgba(219,242,252,.75)}</style>
<div class="mark">${esc((appName[0] || 'X').toUpperCase())}</div><h1>${esc(c.text || appName)}</h1>${c.sub ? `<p>${esc(c.sub)}</p>` : ''}
${kind === 'end' && sb.link ? `<div class="link">${esc(sb.link.replace(/^https?:\/\//, ''))}</div>` : ''}
${NOTICE ? `<div class="note">${esc(NOTICE)}</div>` : ''}`;
const captionHtml = (t) => `<style>${BASE_CSS}body{background:transparent}.c{position:absolute;left:14px;right:14px;top:${VH - CAP_BOX}px;height:${CAP_BOX - 84}px;display:flex;align-items:flex-end;justify-content:center}
.c span{background:rgba(4,27,56,.88);border:1px solid rgba(219,242,252,.35);color:#fff;font-size:17px;font-weight:700;line-height:1.3;text-align:center;padding:8px 16px;border-radius:14px}
.c b{color:${BRAND.coral}}</style><div class="c"><span>${esc(t).replace(/\[(.+?)\]/g, '<b>$1</b>')}</span></div>`;

// ---- Chấm chạm hiện rõ trên video ----
const TAP_INIT = `(() => {
  const css = document.createElement('style');
  css.textContent = '@keyframes __rip{0%{transform:translate(-50%,-50%) scale(.3);opacity:.95}100%{transform:translate(-50%,-50%) scale(1.5);opacity:0}}' +
    '.__tap{position:fixed;z-index:2147483647;pointer-events:none;width:64px;height:64px;border-radius:50%;background:rgba(253,110,136,.55);border:3px solid #fff;box-shadow:0 0 0 2px rgba(7,45,89,.6),0 4px 16px rgba(7,45,89,.4);animation:__rip .7s ease-out forwards}';
  const add = () => (document.head || document.documentElement).appendChild(css);
  document.head ? add() : document.addEventListener('DOMContentLoaded', add);
  window.__tap = (x, y) => { const d = document.createElement('div'); d.className = '__tap'; d.style.left = x + 'px'; d.style.top = y + 'px'; (document.body || document.documentElement).appendChild(d); setTimeout(() => d.remove(), 800); };
  const on = (e) => { const t = (e.touches && e.touches[0]) || e; if (t && t.clientX != null) window.__tap(t.clientX, t.clientY); };
  document.addEventListener('touchstart', on, true);
  document.addEventListener('mousedown', on, true);
})();`;

async function runAction(page, a) {
  if (a.tap) {
    const loc = page.locator(a.tap).first();
    await loc.scrollIntoViewIfNeeded({ timeout: 8000 });
    const b = await loc.boundingBox();
    if (b) { await page.evaluate(([x, y]) => window.__tap && window.__tap(x, y), [b.x + b.width / 2, b.y + b.height / 2]); await page.waitForTimeout(320); }
    await loc.tap({ timeout: 8000 });
    await page.waitForTimeout(500);
  } else if (a.type) {
    const [sel, text] = a.type, loc = page.locator(sel).first();
    await loc.scrollIntoViewIfNeeded({ timeout: 8000 });
    const b = await loc.boundingBox();
    if (b) { await page.evaluate(([x, y]) => window.__tap && window.__tap(x, y), [b.x + Math.min(b.width / 2, 120), b.y + b.height / 2]); await page.waitForTimeout(280); }
    await loc.tap({ timeout: 8000 }); await loc.fill('');
    await loc.pressSequentially(text, { delay: 55 });
    await page.waitForTimeout(350);
  } else if (a.scroll !== undefined) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), a.scroll);
    await page.waitForTimeout(900);
  } else if (a.wait !== undefined) await page.waitForTimeout(a.wait);
  else if (a.theme) { await page.evaluate((m) => window.EP && EP.theme && EP.theme.set(m), a.theme); await page.waitForTimeout(900); }
  else if (a.eval) { await page.evaluate(a.eval); await page.waitForTimeout(400); }
  else warn('hành động không hiểu:', JSON.stringify(a));
}

// ---- Quay 1 scene -> out/scenes/<id>.mp4 (cắt phần tải trang) + <id>.json ----
// mode "cdp": CDP screencast ở deviceScaleFactor = SCALE (nét, WxH gốc). mode "video": lùi về recordVideo của Playwright (390x844, phóng lên WxH).
async function recordScene(browser, i, storage, standalone, mode = 'cdp') {
  const scenes = sb.scenes, s = scenes[i], id = s.id || 'scene' + i, vdir = path.join(TMP, 'rec-' + id);
  fs.rmSync(vdir, { recursive: true, force: true }); fs.mkdirSync(vdir, { recursive: true });
  const cdpMode = mode === 'cdp';
  const ctx = await browser.newContext(Object.assign({
    viewport: { width: VW, height: VH }, deviceScaleFactor: cdpMode ? SCALE : 1, isMobile: true, hasTouch: true, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh',
    colorScheme: s.colorScheme || 'light', storageState: standalone ? undefined : storage
  }, cdpMode ? {} : { recordVideo: { dir: vdir, size: { width: VW, height: VH } } }));
  const created = Date.now();
  await ctx.addInitScript(TAP_INIT);
  const page = await ctx.newPage();
  const frames = [];   // { t: giây (đồng hồ máy), f: file jpg }
  let cdp = null;
  if (cdpMode) {
    try {
      cdp = await ctx.newCDPSession(page);
      let n = 0, chain = Promise.resolve();
      cdp.on('Page.screencastFrame', (ev) => {
        const f = path.join(vdir, 'f' + String(n++).padStart(6, '0') + '.jpg');
        fs.writeFileSync(f, Buffer.from(ev.data, 'base64'));
        frames.push({ t: ev.metadata && ev.metadata.timestamp ? ev.metadata.timestamp : Date.now() / 1000, f });
        chain = chain.then(() => cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId })).catch(() => {});   // báo đã nhận để Chrome gửi tiếp
      });
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: VW * SCALE, maxHeight: VH * SCALE, everyNthFrame: 1 });
    } catch (e) { warn(`scene ${id}: CDP screencast lỗi (${e.message.split('\n')[0]}), lùi về recordVideo`); await ctx.close(); return recordScene(browser, i, storage, standalone, 'video'); }
  }
  const url = s.url ? (/^https?:/.test(s.url) ? s.url : BASE + s.url.replace(/^\//, '')) : BASE + (i === 0 || s.demo || standalone ? '?demo=1' : '') + (s.hash || '');
  try { await page.goto(url, { waitUntil: 'load', timeout: 20000 }); await page.waitForSelector('html[data-ready="1"]', { timeout: 8000 }).catch(() => {}); }
  catch (e) { warn(`scene ${id}: không mở được ${url} (${e.message.split('\n')[0]})`); }
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(700);
  const tStart = (Date.now() - created) / 1000, tStartWall = Date.now() / 1000;
  const tAct = Date.now();
  for (const a of s.actions || []) {
    try { await runAction(page, a); } catch (e) { warn(`scene ${id}: hành động ${JSON.stringify(a)} lỗi: ${e.message.split('\n')[0]}`); }
  }
  const spent = (Date.now() - tAct) / 1000, minD = s.minDuration || 4;
  if (spent < minD) await page.waitForTimeout((minD - spent) * 1000 + 300); else await page.waitForTimeout(700);
  const dur = (Date.now() - created) / 1000 - tStart, tEndWall = Date.now() / 1000;
  const st = await ctx.storageState();
  if (cdp) { await cdp.send('Page.stopScreencast').catch(() => {}); await page.waitForTimeout(150); }
  await ctx.close();
  const outMp4 = path.join(SCENES, id + '.mp4');
  const enc = ['-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p'];
  if (cdpMode) {
    if (frames.length < 2) { warn(`scene ${id}: CDP không trả khung hình, lùi về recordVideo`); return recordScene(browser, i, storage, standalone, 'video'); }
    // Chrome chỉ gửi khung khi màn hình đổi (tốc độ biến thiên): dựng danh sách concat theo mốc thời gian rồi ép 30fps cố định.
    let k = 0; while (k + 1 < frames.length && frames[k + 1].t <= tStartWall) k++;
    const use = frames.slice(k), list = [];
    use.forEach((fr, j) => {
      const a = Math.max(fr.t, tStartWall), b = j + 1 < use.length ? use[j + 1].t : tEndWall;
      list.push(`file '${fr.f}'`, `duration ${Math.max(0.001, b - a).toFixed(4)}`);
    });
    list.push(`file '${use[use.length - 1].f}'`);   // dòng cuối lặp lại để duration cuối được tính
    const lf = path.join(vdir, 'list.txt'); fs.writeFileSync(lf, list.join('\n'));
    ff(['-f', 'concat', '-safe', '0', '-i', lf, '-vf', `scale=${W}:${H}:flags=lanczos,fps=${FPS},format=yuv420p`, '-fps_mode', 'cfr', '-r', String(FPS), ...enc, outMp4]);
    log(`scene ${id}: ${use.length} khung CDP`);
  } else {
    const webm = fs.readdirSync(vdir).filter((f) => f.endsWith('.webm'))[0];
    ff(['-ss', tStart.toFixed(3), '-i', path.join(vdir, webm), '-t', dur.toFixed(3), '-vf', `scale=${W}:${H}:flags=lanczos,fps=${FPS},format=yuv420p`, ...enc, outMp4]);
  }
  fs.writeFileSync(path.join(SCENES, id + '.json'), JSON.stringify({ id, caption: s.caption || '', dur: probeDur(outMp4), w: W, h: H, mode }));
  log(`scene ${id}: ${dur.toFixed(1)}s -> scenes/${id}.mp4 (${mode}, ${W}x${H})`);
  return st;
}

// ---- Thẻ đầu / cuối -> out/scenes/title.mp4, end.mp4 ----
async function renderCards(browser) {
  const tTitle = (sb.title && sb.title.seconds) || 3, tEnd = (sb.end && sb.end.seconds) || 4;
  const mk = async (kind, secs, c) => {
    const png = path.join(SCENES, kind + '.png'), mp4 = path.join(SCENES, kind + '.mp4');
    await renderHtml(browser, cardHtml(kind, c), png, false);
    ff(['-loop', '1', '-t', String(secs), '-i', png, '-vf', `fade=t=in:st=0:d=0.4,fade=t=out:st=${secs - 0.4}:d=0.4,fps=${FPS},format=yuv420p`, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'fast', '-crf', '18', mp4]);
  };
  if (sb.title !== false) await mk('title', tTitle, Object.assign({ text: appName, sub: sb.tagline || '' }, sb.title || {}));
  if (sb.end !== false) await mk('end', tEnd, Object.assign({ text: appName, sub: sb.tagline || '' }, sb.end || {}));
  log('thẻ đầu/cuối xong');
}

// ---- Ghép: scene có sẵn -> mp4 cuối ----
// o = { ids: [..] hoặc null (mọi scene theo storyboard), max, cards: bool, name: tên file ra, voice }
async function assemble(browser, o) {
  const tag = o.name;
  const wanted = (o.ids || sb.scenes.map((s) => s.id)).filter(Boolean);
  const clips = [];
  for (const id of wanted) {
    const mp = path.join(SCENES, id + '.mp4'), jp = path.join(SCENES, id + '.json');
    if (!fs.existsSync(mp) || !fs.existsSync(jp)) { warn(`thiếu scene "${id}" (chưa quay hoặc lỗi): bỏ qua, ghép phần còn lại`); continue; }
    const j = JSON.parse(fs.readFileSync(jp, 'utf8'));
    clips.push({ id, caption: j.caption, src: mp, dur: j.dur });
  }
  if (!clips.length) { warn('không có scene nào để ghép'); return null; }
  const haveTitle = o.cards && sb.title !== false && fs.existsSync(path.join(SCENES, 'title.mp4'));
  const haveEnd = o.cards && sb.end !== false && fs.existsSync(path.join(SCENES, 'end.mp4'));
  if (o.cards && (!haveTitle || !haveEnd) && (sb.title !== false || sb.end !== false)) { await renderCards(browser); }
  const title = o.cards && sb.title !== false && fs.existsSync(path.join(SCENES, 'title.mp4')) ? path.join(SCENES, 'title.mp4') : null;
  const end = o.cards && sb.end !== false && fs.existsSync(path.join(SCENES, 'end.mp4')) ? path.join(SCENES, 'end.mp4') : null;
  const tTitle = title ? probeDur(title) : 0, tEnd = end ? probeDur(end) : 0;
  const body = clips.reduce((a, c) => a + c.dur, 0), budget = o.max - tTitle - tEnd - 0.5;
  let speed = 1;
  if (body > budget) {
    speed = body / budget;
    if (speed > 1.5) warn(`Các scene dài ${body.toFixed(0)}s, vượt ngân sách ${budget.toFixed(0)}s. Tăng tốc tối đa 1.5x rồi cắt đuôi. Hãy rút storyboard.`);
    else warn(`Tăng tốc ${speed.toFixed(2)}x để vừa ${o.max}s.`);
    speed = Math.min(speed, 1.5);
  }
  const parts = [];
  for (let i = 0; i < clips.length; i++) {
    const c = clips[i], f = path.join(TMP, `${tag}-scene-${i}.mp4`);
    ff(['-i', c.src, '-vf', `setpts=PTS/${speed},scale=${W}:${H}:flags=lanczos,fps=${FPS},format=yuv420p`, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'fast', '-crf', '18', f]);
    c.out = probeDur(f); parts.push(f);
  }
  let totalBody = clips.reduce((a, c) => a + c.out, 0);
  if (totalBody > budget) {
    const cut = totalBody - budget, last = clips[clips.length - 1], nf = path.join(TMP, tag + '-last-trim.mp4');
    const keep = Math.max(1.5, last.out - cut);
    ff(['-i', parts[parts.length - 1], '-t', keep.toFixed(3), '-c', 'copy', nf]);
    parts[parts.length - 1] = nf; last.out = keep; totalBody = clips.reduce((a, c) => a + c.out, 0);
    warn('Đã cắt đuôi scene cuối để vừa giới hạn.');
  }
  const bodyFile = path.join(TMP, tag + '-body.mp4');
  fs.writeFileSync(path.join(TMP, tag + '-list.txt'), parts.map((p) => `file '${p}'`).join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(TMP, tag + '-list.txt'), '-c', 'copy', bodyFile]);
  const caps = []; let tcur = 0;
  clips.forEach((c) => { if (c.caption) caps.push({ text: c.caption, a: tcur + 0.3, b: tcur + c.out - 0.2 }); tcur += c.out; });
  // Chữ phụ đề: ảnh PNG trong suốt cùng độ phân giải (dải đáy khung nhìn), chồng thẳng lên video gốc, không khung đệm.
  const capPngs = [], capY = (VH - CAP_BOX) * SCALE;
  for (let i = 0; i < caps.length; i++) { const p = path.join(TMP, `${tag}-cap-${i}.png`); await renderHtml(browser, captionHtml(caps[i].text), p, true, { x: 0, y: VH - CAP_BOX, width: VW, height: CAP_BOX }); capPngs.push(p); }
  const inputs = ['-i', bodyFile];
  capPngs.forEach((p) => inputs.push('-framerate', String(FPS), '-loop', '1', '-i', p));
  let fc = '[0:v]setpts=PTS-STARTPTS[l0]', last = 'l0';
  caps.forEach((c, i) => { fc += `;[${last}][${1 + i}:v]overlay=0:${capY}:enable='between(t,${c.a.toFixed(2)},${c.b.toFixed(2)})'[l${i + 1}]`; last = 'l' + (i + 1); });
  fc += `;[${last}]format=yuv420p[vout]`;
  const main = path.join(TMP, tag + '-main.mp4');
  ff([...inputs, '-filter_complex', fc, '-map', '[vout]', '-t', totalBody.toFixed(3), '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'fast', '-crf', '18', '-r', String(FPS), main]);
  const seq = [title, main, end].filter(Boolean);
  fs.writeFileSync(path.join(TMP, tag + '-seq.txt'), seq.map((p) => `file '${p}'`).join('\n'));
  const silent = path.join(TMP, tag + '-all.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(TMP, tag + '-seq.txt'), '-c', 'copy', silent]);
  const total = probeDur(silent), outMp4 = path.join(OUT, tag + '.mp4');
  if (o.voice) {
    if (!fs.existsSync(o.voice)) { console.error('Không thấy file giọng: ' + o.voice); process.exit(2); }
    ff(['-i', silent, '-i', o.voice, '-filter_complex', `[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,adelay=${Math.round(tTitle * 1000)}|${Math.round(tTitle * 1000)},apad[a]`, '-map', '0:v', '-map', '[a]', '-t', total.toFixed(3), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', outMp4]);
  } else {
    ff(['-i', silent, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', total.toFixed(3), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', outMp4]);
  }
  const tc = (t) => { const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  fs.writeFileSync(path.join(OUT, tag + '.srt'), caps.map((c, i) => `${i + 1}\n${tc(c.a + tTitle)} --> ${tc(c.b + tTitle)}\n${c.text.replace(/[\[\]]/g, '')}\n`).join('\n'));
  const cols = 8, every = Math.max(1, total / cols);
  ff(['-i', outMp4, '-vf', `fps=1/${every.toFixed(3)},scale=200:432,tile=${cols}x1:padding=8:color=0x072D59`, '-frames:v', '1', path.join(OUT, tag + '-contact.png')]);
  const w = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', outMp4]).toString().trim();
  log(`XONG: ${outMp4}  ${w}  ${total.toFixed(1)}s  (${clips.length}/${wanted.length} scene)`);
  if (total > o.max + 0.05) warn(`Video dài hơn ${o.max}s.`);
  return { file: outMp4, total, offset: tTitle };
}

(async () => {
  const t0 = Date.now();
  if (spawnSync(FF, ['-version']).status !== 0) { console.error('Không thấy ffmpeg. Cài: sudo apt install ffmpeg · brew install ffmpeg · winget install ffmpeg'); process.exit(2); }
  const scenes = sb.scenes || [];
  if (!scenes.length) { console.error('Storyboard không có scene nào.'); process.exit(2); }
  const browser = await chromium.launch();
  const keep = () => { if (!flag('--keep')) fs.rmSync(TMP, { recursive: true, force: true }); };

  if (CARDS_ONLY) { await renderCards(browser); await browser.close(); keep(); return; }
  if (SCENE_ARG) {   // một hoặc vài scene, độc lập (mỗi scene tự nạp ?demo=1)
    for (const id of SCENE_ARG.split(',')) {
      const i = scenes.findIndex((s) => s.id === id);
      if (i < 0) { console.error('Không có scene "' + id + '" trong storyboard.'); process.exit(2); }
      await recordScene(browser, i, undefined, true);
    }
    await browser.close(); keep(); return;
  }
  if (!ASSEMBLE_ONLY) {   // chế độ mặc định: quay tuần tự (giữ dữ liệu giữa các scene) rồi ghép
    let storage;
    for (let i = 0; i < scenes.length; i++) storage = await recordScene(browser, i, storage, false);
  }
  const full = await assemble(browser, { ids: null, max: MAX, cards: CARDS, name: `demo-${slug}`, voice: VOICE });
  if (full) {   // bản sao tên cố định cho slide video + ảnh bìa (khung hình sau thẻ đầu)
    fs.copyFileSync(full.file, path.join(OUT, '00-demo-video.mp4'));
    ff(['-ss', Math.min(full.offset + 4, full.total - 1).toFixed(2), '-i', full.file, '-frames:v', '1', path.join(OUT, '00-demo-video-poster.png')]);
    log('slide video: 00-demo-video.mp4 + 00-demo-video-poster.png');
  }
  await browser.close();
  log(`tổng thời gian ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  keep();
})().catch((e) => { console.error(e); process.exit(1); });
