#!/usr/bin/env node
/* capture.cjs — chụp ảnh màn hình app cho slide (Playwright, chạy offline với app chạy local).
 *
 * QUY TẮC CHUNG KẾT: giám khảo chấm app trên ĐIỆN THOẠI (360–390px) → mọi ảnh trong slide là ảnh DỌC.
 * Mặc định chụp giả lập điện thoại: 390x844, deviceScaleFactor 3 (PNG 1170x2532, tỉ lệ 9:19,5), isMobile + hasTouch.
 * Ảnh desktop chỉ chụp khi bạn yêu cầu rõ ("devices":["desktop"]) và chỉ dùng làm chứng cứ, KHÔNG đưa vào slide.
 *
 * Cách 1 (nhanh, 1 màn hình, dọc):
 *   node tools/capture.cjs --url http://localhost:8225/ --name 05-tinh-nang-1
 *   node tools/capture.cjs --url http://localhost:8225/ --name 05-tinh-nang-1 --click '#btn-sample' --theme dark
 *   node tools/capture.cjs --url http://localhost:8225/ --name home --desktop      (thêm 1 ảnh desktop làm chứng cứ)
 *
 * Cách 2 (nhiều màn hình, khuyên dùng): file cấu hình JSON
 *   node tools/capture.cjs tools/capture.example.json
 *
 * Cách 3 (tự chụp từng tab, sáng + tối) bằng công cụ của starter nếu có (tools/shots-mobile.cjs):
 *   node tools/capture.cjs --starter-shots http://localhost:8225/            -> assets/auto/NN-tab-light|dark.png
 *   (hoặc đặt "starterShots": true trong file cấu hình; có thể kết hợp với "views" ở trên)
 *
 * Cấu hình JSON:
 * {
 *   "base": "http://localhost:8225/",        // gốc URL; mỗi view có thể dùng "url" tương đối hoặc tuyệt đối
 *   "out": "../assets",                      // thư mục ảnh (tính từ file cấu hình); mặc định deck/assets
 *   "mobile": [390, 844], "scale": 3,        // mặc định; muốn kiểm tra cỡ nhỏ: [360, 780]
 *   "desktop": [1440, 900],                  // chỉ dùng khi view có "desktop" trong devices
 *   "themes": ["light"],                     // mặc định; ["light","dark"] chụp cả hai (ảnh đuôi -light / -dark)
 *   "reduceMotion": true,                    // tắt animation cho ảnh sạch (mặc định true)
 *   "starterShots": false,                   // true = chạy thêm starter/tools/shots-mobile.cjs vào <out>/auto
 *   "views": [
 *     { "name": "05-tinh-nang-1", "url": "index.html?demo=1#/example",
 *       "steps": [ {"click":"#btn"}, {"fill":["#f-name","Tên"]}, {"select":["select[name=status]","done"]}, {"press":"Enter"}, {"wait":800},
 *                  {"waitFor":".card"}, {"hide":".popup"}, {"scroll":"#section"}, {"eval":"document.title='x'"},
 *                  {"storage":{"key":"value"}} ],       // storage: đặt localStorage TRƯỚC khi mở trang
 *       "selector": "#view-editor",            // (tuỳ chọn) chỉ chụp phần tử này (ảnh có thể không còn 9:19,5, tránh dùng cho slide)
 *       "fullPage": false,
 *       "themes": ["light","dark"],            // (tuỳ chọn) ghi đè theo view
 *       "devices": ["mobile"]                  // mặc định ["mobile"]; thêm "desktop" nếu cần ảnh chứng cứ
 *     }
 *   ]
 * }
 * Tên ảnh ra:  <name>-mobile-light.png, <name>-mobile-dark.png (1170x2532)  ·  <name>-desktop.png (chỉ khi yêu cầu).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const PHONE = [390, 844], SCALE = 3;

function loadPlaywright() {
  const tries = [() => require('playwright'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')),
    () => require('playwright-core'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright-core'))];
  for (const t of tries) { try { return t(); } catch (e) { /* thử tiếp */ } }
  console.error('Không tìm thấy Playwright. Cài: npm i -g playwright && npx playwright install chromium'); process.exit(1);
}

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) { const k = t.slice(2); const v = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : true; if (a[k] === undefined) a[k] = v; else a[k] = [].concat(a[k], v); }
    else a._.push(t);
  }
  return a;
}

async function runSteps(page, steps) {
  for (const s of steps || []) {
    if (s.click) await page.click(s.click, { timeout: 8000 });
    else if (s.fill) await page.fill(s.fill[0], s.fill[1]);
    else if (s.select) await page.selectOption(s.select[0], s.select[1]);
    else if (s.press) await page.keyboard.press(s.press);
    else if (s.wait) await page.waitForTimeout(s.wait);
    else if (s.waitFor) await page.waitForSelector(s.waitFor, { timeout: 10000 });
    else if (s.hide) await page.addStyleTag({ content: `${s.hide}{display:none!important}` });
    else if (s.scroll) await page.$eval(s.scroll, el => el.scrollIntoView({ block: 'start' }));
    else if (s.eval) await page.evaluate(s.eval);
    else if (s.optionalClick) { try { await page.click(s.optionalClick, { timeout: 1500 }); } catch (e) { /* bỏ qua */ } }
  }
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  let cfg, cfgDir = process.cwd();
  if (args._[0]) { const f = path.resolve(args._[0]); cfg = JSON.parse(fs.readFileSync(f, 'utf8')); cfgDir = path.dirname(f); }
  else if (args.url) {
    cfg = { themes: args.theme === 'both' ? ['light', 'dark'] : [args.theme || 'light'],
      views: [{ name: args.name || 'screen', url: args.url, selector: args.selector, fullPage: !!args.fullPage,
      steps: [].concat(args.click || []).map(c => ({ click: c })), devices: args.desktop ? ['mobile', 'desktop'] : ['mobile'] }] };
    if (args.out) cfg.out = path.resolve(args.out);
  } else if (args['starter-shots']) {
    cfg = { views: [] }; if (args.out) cfg.out = path.resolve(args.out);
  } else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(args.help ? 0 : 1); }

  const deckDir = path.resolve(__dirname, '..');
  const out = cfg.out ? path.resolve(cfgDir, cfg.out) : path.join(deckDir, 'assets');
  fs.mkdirSync(out, { recursive: true });
  const D = cfg.desktop || [1440, 900], M = cfg.mobile || PHONE, DPR = Number(cfg.scale) || SCALE;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  let fail = 0;
  for (const v of cfg.views) {
    for (const dev of (v.devices || ['mobile'])) {
     const mobile = dev === 'mobile', vp = mobile ? M : D;
     for (const theme of (mobile ? (v.themes || cfg.themes || ['light']) : ['light'])) {
      const ctx = await browser.newContext({
        viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: mobile ? DPR : 1,
        isMobile: mobile, hasTouch: mobile, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh', colorScheme: theme,
        reducedMotion: cfg.reduceMotion === false ? 'no-preference' : 'reduce'
      });
      // ép giao diện sáng/tối theo cách starter lưu (ep_theme + data-theme); app khác vẫn theo colorScheme ở trên
      await ctx.addInitScript(t => { try { localStorage.setItem('ep_theme', t); } catch (e) {} document.addEventListener('DOMContentLoaded', () => document.documentElement.setAttribute('data-theme', t)); }, theme);
      const steps = v.steps || [];
      const store = steps.filter(s => s.storage).reduce((o, s) => Object.assign(o, s.storage), {});
      if (Object.keys(store).length) await ctx.addInitScript(o => { for (const k in o) { try { localStorage.setItem(k, o[k]); } catch (e) {} } }, store);
      const page = await ctx.newPage();
      page.on('dialog', d => d.accept());
      const url = /^https?:|^file:/.test(v.url || '') ? v.url : (cfg.base || '') + (v.url || '');
      const file = path.join(out, v.name + (mobile ? '-mobile-' + theme : '-desktop') + '.png');
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(v.settle || 900);
        await runSteps(page, steps.filter(s => !s.storage));
        await page.waitForTimeout(v.after || 600);
        if (v.selector) await (await page.waitForSelector(v.selector, { timeout: 10000 })).screenshot({ path: file });
        else await page.screenshot({ path: file, fullPage: !!v.fullPage });
        console.log('OK  ', path.relative(process.cwd(), file) || file, `(${vp[0]}x${vp[1]}${mobile ? ' @' + DPR + 'x, ' + theme : ' desktop — chỉ làm chứng cứ, không đưa vào slide'})`);
      } catch (e) { fail++; console.error('LỖI ', v.name, dev, '-', e.message.split('\n')[0]); }
      await ctx.close();
     }
    }
  }
  await browser.close();

  // tuỳ chọn: chụp từng tab sáng + tối bằng công cụ của starter
  if (args['starter-shots'] || cfg.starterShots) {
    const cands = [path.join(deckDir, '..', 'tools', 'shots-mobile.cjs'), path.join(deckDir, '..', 'starter', 'tools', 'shots-mobile.cjs'), path.join(deckDir, '..', '..', 'starter', 'tools', 'shots-mobile.cjs')];
    const sh = cands.find(f => fs.existsSync(f));
    const base = typeof args['starter-shots'] === 'string' ? args['starter-shots'] : (cfg.base || args.url);
    if (!sh) { console.error('LỖI  không thấy tools/shots-mobile.cjs của starter (đã tìm:', cands.map(f => path.relative(process.cwd(), f)).join(', '), ')'); fail++; }
    else if (!base) { console.error('LỖI  thiếu URL app: dùng --starter-shots http://localhost:8225/ hoặc "base" trong cấu hình'); fail++; }
    else {
      const dir = path.join(out, 'auto');
      const r = cp.spawnSync(process.execPath, [sh, base, dir], { stdio: 'inherit' });
      if (r.status) fail++; else console.log('OK   shots-mobile ->', path.relative(process.cwd(), dir) || dir, '(NN-tab-light|dark.png, 390x844 @3x)');
    }
  }
  process.exit(fail ? 1 : 0);
})();
