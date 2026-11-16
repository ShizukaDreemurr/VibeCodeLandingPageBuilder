// Bộ kiểm thử ĐIỆN THOẠI (gọi từ tests/smoke.cjs; chạy riêng: node tests/mobile-suite.cjs http://localhost:8211/).
// Khung nhìn 360x780 và 390x844, dọc, deviceScaleFactor 3, isMobile + hasTouch. Ánh xạ 5 tiêu chí chấm chung kết:
//   (1) không tràn ngang  (2) nút/ô nhập >= 48px, không chồng nhau  (3) chữ đọc được  (4) luồng chính làm được chỉ bằng chạm  (5) điều hướng rõ, biết đang ở đâu.
// Chuẩn đầy đủ: skills/vibe-sprint/references/13-chuan-mobile.md
const path = require('path');

const VIEWPORTS = [{ width: 360, height: 780 }, { width: 390, height: 844 }];
const MIN_TOUCH = 47.5;   // 48px, chừa sai số làm tròn
const MIN_FONT_BODY = 14; // chữ nội dung chính
const MIN_FONT_FINE = 12; // chú thích, nhãn, huy hiệu: sàn cứng
const MIN_INPUT_FONT = 16; // < 16px thì iOS tự phóng to khi focus

/* Chạy trong trang: trả về danh sách phần tử tương tác (hộp chạm) và phần tử chữ. */
function collect() {
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) { if (n.hidden) return false; }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const inFixed = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return true; return false; };
  const label = (el) => (el.getAttribute('aria-label') || el.textContent || el.name || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 28);
  const modal = document.querySelector('dialog[open]');
  const scope = (el) => !modal || modal.contains(el); // khi có hộp thoại modal, phần nền bị khoá nên không tính
  const targets = [];
  document.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"], [role="switch"], [role="tab"]').forEach((el) => {
    if (el.classList.contains('skip-link') || !scope(el)) return;
    if (el.matches('input[type="hidden"]')) return;
    if (el.closest('[inert]')) return;
    let box = el;
    // radio/checkbox/file: hộp chạm thật là nhãn hoặc vùng thả bao quanh
    if (el.matches('input[type="radio"], input[type="checkbox"], input[type="file"]')) { box = el.closest('label') || el.closest('.im-drop') || el; if (!vis(box) && !vis(el)) return; }
    else if (!vis(el)) return;
    // liên kết nằm trong đoạn văn (inline) được miễn (WCAG 2.5.8 ngoại lệ "inline")
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') return;
    if (el.closest('.sr-only')) return;
    const r = box.getBoundingClientRect();
    // phần bị cắt bởi vùng cuộn/ẩn tràn của tổ tiên (vd. thân bottom sheet đang cuộn) không thật sự chồng lên gì
    let cl = r.left, ct = r.top, cr = r.right, cb = r.bottom;
    for (let n = box.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflowY + cs.overflowX)) { const q = n.getBoundingClientRect(); cl = Math.max(cl, q.left); ct = Math.max(ct, q.top); cr = Math.min(cr, q.right); cb = Math.min(cb, q.bottom); }
    }
    if (cr <= cl || cb <= ct) return;
    targets.push({ ox: cl, oy: ct + window.scrollY, ow: cr - cl, oh: cb - ct, id: label(box), tag: el.tagName.toLowerCase() + (el.type ? ':' + el.type : ''), x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height, fixed: inFixed(box), key: box.tagName + '|' + Math.round(r.left) + '|' + Math.round(r.top + window.scrollY) + '|' + Math.round(r.width) });
  });
  // gộp trùng (radio cùng nhãn)
  const seen = {}, uniq = targets.filter((t) => (seen[t.key] ? false : (seen[t.key] = 1)));
  // chữ: mỗi phần tử có text node trực tiếp, đang hiển thị
  const fine = '.cell-sub, .field-msg, .kpi-foot, .badge, .chip, .table th, .stepper li, .label, .bnav-lb, .footer, .mock-badge, .sc-why, .sc-table th, .sc-table td.nodata, .kpi-label, .lx-counter, .toast, .im-prev, .delta, .hero-eyebrow, .chart-legend, .ai-notice, .muted, .t-msg, .dlg-foot, .sc-sub, .kv, .sc-ex code, .cell-main, .field-legend, .req, pre, code, .prompt-box';
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const done = new Set();
  for (let n; (n = walker.nextNode());) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || !scope(el) || done.has(el) || /^(SCRIPT|STYLE|NOSCRIPT|OPTION|TITLE)$/.test(el.tagName)) continue;
    if (el.closest('.sr-only, [hidden], svg, dialog:not([open]), .skip-link')) continue;
    if (!vis(el)) continue;
    done.add(el);
    const cs = getComputedStyle(el);
    texts.push({ t: n.nodeValue.trim().slice(0, 24), fs: parseFloat(cs.fontSize), fine: el.matches(fine) || !!el.closest(fine) });
  }
  // chữ trong SVG (biểu đồ): kích thước hiệu dụng = fontSize x tỉ lệ co của svg
  document.querySelectorAll('svg text').forEach((tx) => {
    const svg = tx.ownerSVGElement; if (!svg || !vis(svg)) return;
    const vb = svg.viewBox && svg.viewBox.baseVal, sc = vb && vb.width ? svg.getBoundingClientRect().width / vb.width : 1;
    texts.push({ t: 'svg:' + tx.textContent.trim().slice(0, 16), fs: parseFloat(getComputedStyle(tx).fontSize) * sc, fine: true });
  });
  const inputs = [];
  document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="hidden"]), select, textarea').forEach((el) => { if (vis(el)) inputs.push({ id: label(el), fs: parseFloat(getComputedStyle(el).fontSize) }); });
  return { targets: uniq, texts, inputs, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
}


/* Chạy trong trang: kiểm tra hero "Tầm nhìn Thông minh" (phần tử, hiệu năng, tương phản AA). */
function heroCheck() {
  const q = (s) => document.querySelector(s);
  const parse = (c) => (c.match(/rgba?\(([^)]+)\)/g) || []).map((x) => x.replace(/rgba?\(|\)/g, '').split(',').map((n) => parseFloat(n)));
  const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const hero = q('.hero'); if (!hero) return { missing: true };
  const title = q('.hero-title'), cta = q('.btn-cta'), flutes = document.querySelectorAll('.hero-flute');
  const dark = getComputedStyle(document.documentElement).colorScheme.indexOf('dark') === 0;
  // nền chữ = gradient băng/navy của hero (sóng xanh ở đáy nằm dưới chữ nên không tính)
  const bgImg = getComputedStyle(hero).backgroundImage; const bgStops = parse(bgImg.slice(bgImg.lastIndexOf('linear-gradient'))).filter((c) => c.length < 4 || c[3] > .9);
  const bgWorst = bgStops.reduce((w, c) => { const r = ratio(parse(getComputedStyle(title).color)[0], c); return r < w ? r : w; }, 99);
  const ctaStops = parse(getComputedStyle(cta).backgroundImage).filter((c) => c.length < 4 || c[3] > .9);
  const ctaTxt = parse(getComputedStyle(cta).color)[0];
  const ctaWorst = ctaStops.reduce((w, c) => Math.min(w, ratio(ctaTxt, c)), 99);
  const fl = flutes[0] ? getComputedStyle(flutes[0]) : null, wrap = q('.hero-flutes') ? getComputedStyle(q('.hero-flutes')) : null;
  const orb = q('.hero-orb') ? getComputedStyle(q('.hero-orb')) : null;
  const r = hero.getBoundingClientRect(), cr = cta.getBoundingClientRect(), tools = q('.hero-tools');
  return { dark, orb: !!q('.hero-orb'), streak: !!q('.hero-streak'), flutes: flutes.length, tools: !!tools && tools.querySelectorAll('li').length, title: !!title && !!title.querySelector('em'),
    titleEmFont: title ? getComputedStyle(title.querySelector('em')).fontFamily : '', ctaH: Math.round(cr.height), ctaPill: parseFloat(getComputedStyle(cta).borderRadius) >= 24,
    ctaThumb: cr.bottom < window.innerHeight, bd: (fl && (fl.backdropFilter || fl.webkitBackdropFilter) || 'none') + '|' + (wrap && (wrap.backdropFilter || 'none')),
    orbAnim: orb ? orb.animationName : '', headRatio: bgWorst, ctaRatio: ctaWorst, hw: Math.round(r.width), vw: document.documentElement.clientWidth };
}

function overlaps(list) {
  const bad = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j];
    const ix = Math.min(a.ox + a.ow, b.ox + b.ow) - Math.max(a.ox, b.ox), iy = Math.min(a.oy + a.oh, b.oy + b.oh) - Math.max(a.oy, b.oy);
    if (ix > 2 && iy > 2) bad.push(a.id + ' x ' + b.id);
  }
  return bad;
}

module.exports = async function mobileSuite({ browser, URL, ok, SHOTS, errors, fixtures }) {
  for (const vp of VIEWPORTS) {
    const tag = vp.width + 'px';
    console.log('# Điện thoại ' + vp.width + 'x' + vp.height + ' (dọc, 3x, chạm)');
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh' });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && errors) errors.push('mobile console: ' + m.text()); });
    page.on('pageerror', (e) => { if (errors) errors.push('mobile pageerror: ' + e.message); });
    await page.goto(URL + '?demo=1', { waitUntil: 'load' });
    await page.waitForSelector('html[data-ready="1"]');
    const tabs = await page.evaluate(() => EP.router.list().map((v) => v.id));
    const CFG = await page.evaluate(() => ({ notice: EP.config.mockNotice }));
    const settle = (ms) => page.waitForTimeout(ms || 450);
    const audit = async (name, opts) => {
      opts = opts || {};
      await page.evaluate(() => window.scrollTo(0, 0));
      const d = await page.evaluate(collect);
      ok(tag + ' ' + name + ': không tràn ngang (' + d.sw + '/' + d.cw + ')', d.sw <= d.cw);
      const small = d.targets.filter((t) => t.w < MIN_TOUCH || t.h < MIN_TOUCH).map((t) => t.tag + '"' + t.id + '" ' + Math.round(t.w) + 'x' + Math.round(t.h));
      ok(tag + ' ' + name + ': mọi nút/ô nhập >= 48x48 (' + d.targets.length + ' phần tử)', small.length === 0, small.slice(0, 6));
      const ov = overlaps(d.targets.filter((t) => t.fixed)).concat(overlaps(d.targets.filter((t) => !t.fixed)));
      ok(tag + ' ' + name + ': các phần tử chạm không chồng nhau', ov.length === 0, ov.slice(0, 6));
      const tiny = d.texts.filter((t) => t.fs < (t.fine ? MIN_FONT_FINE : MIN_FONT_BODY) - 0.05).map((t) => t.t + ' ' + t.fs.toFixed(1) + 'px' + (t.fine ? '' : ' (nội dung)'));
      ok(tag + ' ' + name + ': chữ nội dung >= 14px, chú thích >= 12px', tiny.length === 0, tiny.slice(0, 6));
      const smallIn = d.inputs.filter((t) => t.fs < MIN_INPUT_FONT).map((t) => t.id + ' ' + t.fs + 'px');
      ok(tag + ' ' + name + ': ô nhập >= 16px (không bị iOS phóng to)', smallIn.length === 0, smallIn);
    };
    const tapNav = async (id) => { await page.tap('#bt-' + id); await page.waitForFunction((i) => !document.getElementById('view-' + i).hidden && document.getElementById('view-' + i).querySelector('.view-body').children.length > 0, id); await settle(); };

    // ---- (5) điều hướng: thanh tab dưới ----
    const nav = await page.evaluate(() => { const n = document.getElementById('bnav'), r = n.getBoundingClientRect(), cs = getComputedStyle(n); return { shown: cs.display !== 'none', pos: cs.position, bottom: Math.round(innerHeight - r.bottom), items: n.querySelectorAll('.bnav-item').length, desk: getComputedStyle(document.getElementById('tabs')).display }; });
    ok(tag + ' thanh tab dưới hiện, dính đáy màn hình', nav.shown && nav.pos === 'fixed' && nav.bottom === 0, nav);
    ok(tag + ' thanh tab dưới có 3 đến 5 mục, tab ngang của máy tính bị ẩn', nav.items >= 3 && nav.items <= 5 && nav.desk === 'none', nav);
    ok(tag + ' thanh tab có đủ icon + nhãn chữ', await page.evaluate(() => Array.from(document.querySelectorAll('.bnav-item')).every((a) => a.querySelector('svg') && a.querySelector('.bnav-lb').textContent.trim().length > 0)));
    ok(tag + ' thanh trên mỏng (<= 64px)', (await page.evaluate(() => document.querySelector('.topbar').getBoundingClientRect().height)) <= 64);

    // ---- mọi view: aria-current + 5 kiểm tra ----
    for (const t of tabs) {
      await tapNav(t);
      const cur = await page.$$eval('#bnav [aria-current="page"]', (a) => a.map((x) => x.getAttribute('data-nav') || x.id));
      ok(tag + ' tab ' + t + ': đúng 1 mục thanh tab dưới có aria-current (mục ' + (cur[0] || '?') + ')', cur.length === 1 && (cur[0] === t || cur[0] === 'bnav-more'), cur);
      ok(tag + ' tab ' + t + ': router ở đúng tab, URL #/' + t, (await page.evaluate(() => EP.router.current())) === t && (t === 'home' || (await page.evaluate(() => location.hash)).indexOf('#/' + t) === 0));
      await audit('tab ' + t);
      // cuối trang không bị thanh tab dưới / thanh hành động che
      const cover = await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); const last = document.querySelector('.footer'); const fixed = Array.from(document.querySelectorAll('.bnav, .abar')).filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').map((e) => e.getBoundingClientRect().top).filter((v) => v > 0); const lastChild = Array.from(last.querySelectorAll('span')).filter((s) => s.offsetParent).pop() || last; return { bottom: lastChild.getBoundingClientRect().bottom, nav: Math.min.apply(null, fixed) }; });
      ok(tag + ' tab ' + t + ': cuối trang không bị thanh dưới che', cover.bottom <= cover.nav + 1, cover);
    }
    // phân đoạn của sân chơi
    if (tabs.includes('playground')) {
      await tapNav('playground');
      const segs = await page.$$eval('#view-playground [data-slot="pick"] input', (r) => r.map((x) => x.value));
      for (const s of segs) {
        await page.tap('#view-playground [data-slot="pick"] label:has(input[value="' + s + '"])'); await settle(500);
        await audit('mô-đun ' + s);
      }
    }
    // ---- hero "Tầm nhìn Thông minh": đủ phần tử, nhẹ, không tràn, tương phản AA (sáng + tối) ----
    if (tabs.includes('home')) {
      await page.goto(URL + '#/home'); await settle(350);
      for (const scheme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: scheme }); await settle(200);
        const h = await page.evaluate(heroCheck);
        const hn = tag + ' hero ' + scheme + ': ';
        ok(hn + 'có quả cầu, vệt hồng, 8 thanh kính sọc, hàng công cụ, tiêu đề + chữ nghiêng', !h.missing && h.orb && h.streak && h.flutes === 8 && h.tools >= 1 && h.title, h);
        ok(hn + 'không backdrop-filter trên điện thoại, chỉ animate transform/opacity', h.bd.split('|').every((x) => x === 'none' || x === '') && /hero-float|none/.test(h.orbAnim), h.bd + ' ' + h.orbAnim);
        ok(hn + 'không tràn ngang, hero vừa khung (' + h.hw + '/' + h.vw + ')', h.hw <= h.vw);
        ok(hn + 'nút CTA viên thuốc >= 48px, nằm trong tầm ngón cái (màn hình đầu)', h.ctaH >= 48 && h.ctaPill && h.ctaThumb, h);
        ok(hn + 'tiêu đề tương phản >= 4.5:1 (' + h.headRatio.toFixed(1) + ') và CTA >= 4.5:1 (' + h.ctaRatio.toFixed(1) + ')', h.headRatio >= 4.5 && h.ctaRatio >= 4.5, h);
      }
      await page.emulateMedia({ colorScheme: 'light' });
    }
    // chế độ tối: tràn ngang + chữ
    await page.emulateMedia({ colorScheme: 'dark' });
    for (const t of tabs) {
      await page.goto(URL + '#/' + t); await settle(350);
      const d = await page.evaluate(collect);
      ok(tag + ' tối ' + t + ': không tràn ngang, ô nhập >= 16px', d.sw <= d.cw && d.inputs.every((i) => i.fs >= MIN_INPUT_FONT), [d.sw, d.cw]);
    }
    await page.emulateMedia({ colorScheme: 'light' });

    // ---- (4) luồng chính chỉ bằng chạm ----
    if (tabs.includes('example')) {
      console.log('  luồng chính ' + tag + ': thêm mục (bottom sheet) -> AI mô phỏng -> kết quả -> lưu -> xem lại');
      await page.goto(URL + '#/home'); await page.waitForSelector('html[data-ready="1"]'); await tapNav('example');
      const count = () => page.$$eval('#view-example .table tbody tr', (r) => r.length);
      const n0 = await count();
      ok(tag + ' thanh hành động chính hiện ngay trên thanh tab dưới', await page.evaluate(() => { const a = document.querySelector('.abar:not([hidden])'), n = document.getElementById('bnav'); if (!a) return false; const ar = a.getBoundingClientRect(), nr = n.getBoundingClientRect(); return Math.abs(ar.bottom - nr.top) <= 1 && getComputedStyle(a.parentElement).position === 'fixed'; }));
      await page.tap('.abar:not([hidden]) [data-act="add"]');
      await page.waitForSelector('dialog[open] form');
      await settle(700);
      const sheet = await page.evaluate(() => { const d = document.querySelector('dialog[open]'), r = d.getBoundingClientRect(); return { l: Math.round(r.left), w: Math.round(r.width), b: Math.round(innerHeight - r.bottom), h: Math.round(r.height), vh: innerHeight, grip: !!d.querySelector('.dlg-grip') && getComputedStyle(d.querySelector('.dlg-grip')).display !== 'none' }; });
      ok(tag + ' form mở dạng bottom sheet (full rộng, sát đáy, có tay nắm)', sheet.l === 0 && sheet.w === vp.width && sheet.b === 0 && sheet.grip && sheet.h <= sheet.vh * 0.93, sheet);
      await audit('form thêm mục (sheet)');
      const cols = await page.evaluate(() => new Set(Array.from(document.querySelectorAll('dialog[open] .field')).map((f) => Math.round(f.getBoundingClientRect().left))).size);
      ok(tag + ' form một cột', cols === 1, cols);
      const hints = await page.evaluate(() => ({ email: document.querySelector('dialog [name="email"]').getAttribute('inputmode'), phone: document.querySelector('dialog [name="phone"]').getAttribute('inputmode'), qty: document.querySelector('dialog [name="qty"]').getAttribute('inputmode'), ek: !!document.querySelector('dialog input[enterkeyhint]') }));
      ok(tag + ' bàn phím đúng loại (email / tel / numeric) + enterkeyhint', hints.email === 'email' && hints.phone === 'tel' && hints.qty === 'numeric' && hints.ek, hints);
      // kéo tay nắm xuống để đóng
      const g = await (await page.$('dialog[open] .dlg-grip')).boundingBox();
      await page.mouse.move(g.x + g.width / 2, g.y + 2); await page.mouse.down();
      for (let k = 1; k <= 8; k++) await page.mouse.move(g.x + g.width / 2, g.y + 2 + k * 30);
      await page.mouse.up();
      await page.waitForSelector('dialog[open]', { state: 'detached', timeout: 3000 }).catch(() => {});
      ok(tag + ' kéo tay nắm xuống thì sheet đóng', (await page.$('dialog[open]')) === null);
      // mở lại, nhập bằng chạm, lưu
      await page.tap('.abar:not([hidden]) [data-act="add"]'); await page.waitForSelector('dialog[open] form'); await settle(600);
      for (const [n, v] of [['name', 'Mục chạm trên điện thoại'], ['email', 'mobile@example.vn'], ['phone', '0912345678'], ['qty', '9']]) { await page.tap('dialog [name="' + n + '"]'); await page.keyboard.type(v); }
      await page.fill('dialog [name="due"]', await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 9); return EP.fmt.today().slice(0, 0) + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }));
      await page.tap('#ex-save');
      await page.waitForSelector('dialog[open]', { state: 'detached', timeout: 4000 });
      ok(tag + ' lưu từ sheet: số dòng +1 và có toast', (await count()) === n0 + 1 && (await page.$('.toast')) !== null, [n0, await count()]);
      const toastPos = await page.evaluate(() => { const t = document.querySelector('.toast'), n = document.querySelector('.bnav').getBoundingClientRect(); return t ? t.getBoundingClientRect().bottom <= n.top + 1 : false; });
      ok(tag + ' toast nằm trên thanh tab dưới (không che tab)', toastPos);
      ok(tag + ' mục mới hiện dạng thẻ (bảng -> thẻ)', await page.evaluate(() => { const r = document.querySelector('#view-example .table-wrap'); return r.classList.contains('lx-cards') && getComputedStyle(document.querySelector('#view-example .table tbody tr')).display === 'grid'; }));
      // AI mô phỏng
      await page.evaluate(() => document.getElementById('ex-ai-form').scrollIntoView({ block: 'center' }));
      await page.tap('#ex-ai-form textarea'); await page.keyboard.type('Chuẩn bị tài liệu họp khách hàng cuối tuần này');
      await page.tap('#ex-ai-go');
      await page.waitForSelector('#view-example .ai-result', { timeout: 15000 });
      ok(tag + ' kết quả AI hiện + nhãn mô phỏng: "' + CFG.notice + '"', (await page.textContent('#view-example .ai-result')).includes(CFG.notice));
      await audit('kết quả AI');
      const n1 = await count();
      await page.tap('#view-example [data-act="ai-save"]'); await settle(300);
      ok(tag + ' lưu gợi ý AI thành mục mới', (await count()) === n1 + 1, [n1, await count()]);
      // thao tác trong thẻ: xoá có xác nhận bằng sheet
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.tap('#view-example [data-act="delete"] >> nth=0'); await page.waitForSelector('dialog[open]'); await settle(500);
      await page.waitForFunction(() => { const d = document.querySelector('dialog[open]'); return d && Math.round(innerHeight - d.getBoundingClientRect().bottom) === 0; }, null, { timeout: 2500 }).catch(() => {});
      const cf = await page.evaluate(() => { const d = document.querySelector('dialog[open]'); return { gap: Math.round(innerHeight - d.getBoundingClientRect().bottom), hs: Array.from(d.querySelectorAll('.dlg-foot .btn')).map((b) => Math.round(b.getBoundingClientRect().height)) }; });
      ok(tag + ' xác nhận xoá dạng bottom sheet, 2 nút >= 48px', cf.gap === 0 && cf.hs.length === 2 && cf.hs.every((h) => h >= 48), cf);
      await page.tap('dialog[open] .dlg-foot .btn >> nth=0'); await page.waitForSelector('dialog[open]', { state: 'detached' });
      // quay lại tab khác rồi về: khôi phục vị trí cuộn
      await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(100);
      await tapNav('home'); await tapNav('example');
      ok(tag + ' quay lại tab: nhớ vị trí cuộn', (await page.evaluate(() => Math.round(scrollY))) >= 300, await page.evaluate(() => scrollY));
    }
    if (tabs.includes('playground')) {
      console.log('  luồng ' + tag + ': kịch bản kinh doanh + nhập file');
      await page.goto(URL + '#/home'); await page.waitForSelector('html[data-ready="1"]'); await tapNav('playground');
      await page.tap('#view-playground [data-slot="pick"] label:has-text("Kinh doanh")'); await page.waitForSelector('#view-playground .sc-table'); await settle(500);
      const before = await page.textContent('#view-playground .sc-table');
      const first = await page.$('#view-playground .sc-row input[data-lx-money], #view-playground .sc-row input.input');
      if (first) { await first.tap(); await page.keyboard.press('Control+A'); await page.keyboard.type('30000000'); await settle(300); }
      ok(tag + ' kịch bản: sửa giả định bằng bàn phím số, bảng 3 kịch bản vẫn vừa khung', await page.evaluate(() => { const t = document.querySelector('#view-playground .sc-table').getBoundingClientRect(); return t.left >= 0 && t.right <= document.documentElement.clientWidth; }) && before.length > 0);
      ok(tag + ' kịch bản: ô giả định tiền có inputmode numeric', await page.evaluate(() => !!document.querySelector('#view-playground input[data-lx-money][inputmode="numeric"], #view-playground .sc-row input[inputmode]')));
      const scTabs = await page.$$('#view-playground .sc [role="tab"], #view-playground .sc .seg label');
      if (scTabs.length) { await scTabs[scTabs.length > 1 ? 1 : 0].tap(); await settle(300); }
      await audit('kịch bản (sau khi sửa)');
      await page.tap('#view-playground [data-slot="pick"] label:has-text("Nhập file")'); await page.waitForSelector('#view-playground [data-file]'); await settle(400);
      if (fixtures) {
        await page.setInputFiles('#view-playground [data-file]', path.join(fixtures, 'mau-btc.xlsx'));
        await page.waitForSelector('#view-playground .im-prev table', { timeout: 10000 });
        await settle(400);
        await audit('nhập file (xem trước)');
        await page.evaluate(() => document.querySelector('#view-playground [data-act="import"]').scrollIntoView({ block: 'center' }));
        await page.tap('#view-playground [data-act="import"]'); await settle(500);
        ok(tag + ' nhập file xong bằng chạm: có thông báo / dữ liệu vào bộ nhớ', await page.evaluate(() => EP.collection('btc_sample').count() > 0 || !!document.querySelector('.toast')));
      }
    }
    if (SHOTS) {
      for (const t of tabs) { await page.goto(URL + '#/' + t); await settle(500); await page.screenshot({ path: path.join(SHOTS, 'phone-' + vp.width + '-' + t + '.png') }); }
    }
    await ctx.close();
  }
};

if (require.main === module) {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }
  const args = process.argv.slice(2), URL = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:8211/').replace(/\/?$/, '/');
  let failed = 0;
  const ok = (n, c, x) => { if (c) console.log('  ok  ', n); else { failed++; console.log('  FAIL', n, x === undefined ? '' : JSON.stringify(x)); } };
  (async () => { const browser = await chromium.launch(); const errors = []; await module.exports({ browser, URL, ok, SHOTS: null, errors, fixtures: path.join(__dirname, 'fixtures') }); errors.forEach((e) => ok(e, false)); await browser.close(); console.log(failed ? '\n' + failed + ' THẤT BẠI' : '\nĐIỆN THOẠI: TẤT CẢ ĐẠT'); process.exit(failed ? 1 : 0); })();
}
