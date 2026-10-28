// SEO: thẻ <head> của app, JSON-LD, robots/sitemap/404, một h1 mỗi màn, file HTML xuất, ô "SEO & chia sẻ",
// checklist SEO, ảnh có alt + width/height, hàm JSON-LD Event (thay cho trang ?e= cần Firebase).
// Chạy: node tests/e2e-seo.cjs   (cần máy chủ tĩnh: python3 -m http.server 8000 ở thư mục gốc repo)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const BASE = process.env.BASE || 'http://localhost:8000/';
let failed = 0;
function check(name, ok, extra) { if (!ok) failed++; console.log((ok ? '✓ ' : '✗ ') + name + (extra !== undefined ? '  [' + extra + ']' : '')); }

(async () => {
  const browser = require('./auto-tab.cjs')(await chromium.launch());
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && errs.push(m.text()));

  // ---------- A. Trang app ----------
  await p.goto(BASE);
  const head = await p.evaluate(() => {
    const m = (s, a) => { const e = document.querySelector(s); return e ? e.getAttribute(a || 'content') : null; };
    return {
      lang: document.documentElement.lang, title: document.title,
      desc: m('meta[name="description"]'), robots: m('meta[name="robots"]'), canonical: m('link[rel="canonical"]', 'href'),
      theme: m('meta[name="theme-color"]'), ogType: m('meta[property="og:type"]'), ogSite: m('meta[property="og:site_name"]'),
      ogTitle: m('meta[property="og:title"]'), ogDesc: m('meta[property="og:description"]'), ogUrl: m('meta[property="og:url"]'),
      ogImage: m('meta[property="og:image"]'), ogLocale: m('meta[property="og:locale"]'), tw: m('meta[name="twitter:card"]'),
      icon: m('link[rel="icon"]', 'href'), touch: m('link[rel="apple-touch-icon"]', 'href'),
      preG: !!document.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]'),
      preS: !!document.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]'),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent),
      skip: !!document.querySelector('a.skip-link[href^="#"]')
    };
  });
  check('lang=vi', head.lang === 'vi');
  check('title 50-60 ký tự', head.title.length >= 50 && head.title.length <= 60, head.title.length);
  check('description 150-160 ký tự', head.desc && head.desc.length >= 150 && head.desc.length <= 160, head.desc && head.desc.length);
  check('canonical đúng', head.canonical === 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/', head.canonical);
  check('robots index,follow', head.robots === 'index,follow');
  check('theme-color', /^#[0-9a-f]{6}$/i.test(head.theme || ''));
  check('OG đủ thẻ', head.ogType === 'website' && head.ogSite === 'Xclipse' && head.ogTitle && head.ogDesc && head.ogUrl === head.canonical && /og-image\.jpg$/.test(head.ogImage) && head.ogLocale === 'vi_VN');
  check('Twitter card summary_large_image', head.tw === 'summary_large_image');
  check('favicon + apple-touch-icon', !!head.icon && !!head.touch);
  check('preconnect fonts', head.preG && head.preS);
  check('skip link', head.skip);
  let types = [];
  try { types = head.ld.map(t => JSON.parse(t)['@type']); check('JSON-LD parse được', true, types.join(',')); } catch (e) { check('JSON-LD parse được', false, e.message); }
  check('JSON-LD có WebApplication + Organization + WebSite', ['WebApplication', 'Organization', 'WebSite'].every(t => types.includes(t)));
  const wa = head.ld.map(t => JSON.parse(t)).find(o => o['@type'] === 'WebApplication') || {};
  check('WebApplication: offers 0 VND, inLanguage vi, Web', wa.offers && wa.offers.price === '0' && wa.offers.priceCurrency === 'VND' && wa.inLanguage === 'vi' && wa.operatingSystem === 'Web' && wa.applicationCategory === 'BusinessApplication');

  const og = await p.request.get(new URL(head.ogImage.replace('https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/', ''), BASE).href);
  check('og-image tải được, < 200 KB', og.ok() && (await og.body()).length < 200 * 1024, (await og.body()).length);

  const robots = await p.request.get(BASE + 'robots.txt');
  const rt = await robots.text();
  check('robots.txt: allow + Sitemap URL đầy đủ', robots.ok() && /Allow: \//.test(rt) && /Sitemap: https:\/\/shizukadreemurr\.github\.io\/VibeCodeLandingPageBuilder\/sitemap\.xml/.test(rt));
  const sm = await p.request.get(BASE + 'sitemap.xml');
  const st = await sm.text();
  check('sitemap.xml: URL gốc, lastmod, priority 1.0', sm.ok() && st.includes('<loc>https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/</loc>') && /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(st) && st.includes('<priority>1.0</priority>'));
  const nf = await (await p.request.get(BASE + '404.html')).text();
  check('404.html: noindex + lang vi + link về trang chủ', /<meta name="robots" content="noindex">/.test(nf) && /<html lang="vi">/.test(nf) && /href="\/VibeCodeLandingPageBuilder\/"/.test(nf));

  // ---------- Một h1 hiện mỗi màn ----------
  await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(800);
  const h1s = async () => p.evaluate(() => [...document.querySelectorAll('h1')].filter(h => h.getClientRects().length && getComputedStyle(h).visibility !== 'hidden').map(h => h.textContent.trim().slice(0, 30)));
  for (const t of ['events', 'builder', 'editor', 'admin', 'brand']) {
    await p.evaluate(tab => document.querySelector('[data-tab="' + tab + '"]').click(), t);
    await p.waitForTimeout(300);
    if (t === 'admin' && await p.isVisible('.admin-pick')) await p.click('.admin-pick >> nth=0');
    const v = await h1s();
    check('đúng 1 h1 hiện ở tab ' + t, v.length === 1, v.join(' | '));
  }
  // thứ tự heading trong trang landing
  await p.evaluate(() => document.querySelector('[data-tab="editor"]').click());
  const lpH = await p.evaluate(() => [...document.querySelectorAll('#landing h1, #landing h2, #landing h3')].map(h => h.tagName));
  check('landing: 1 h1, còn lại h2, không đảo thứ tự', lpH.filter(x => x === 'H1').length === 1 && lpH[0] === 'H1' && !lpH.includes('H3'), lpH.join(''));

  // ---------- Hình ảnh: alt + width/height ----------
  await p.evaluate(() => { document.querySelector('[data-tab="editor"]').click(); });
  const appImgs = await p.evaluate(() => [...document.querySelectorAll('img')].filter(i => !i.closest('#landing')).filter(i => !i.hasAttribute('alt')).length);
  check('mọi <img> của app có alt', appImgs === 0, appImgs);

  // ---------- Ô SEO & chia sẻ ----------
  await p.evaluate(() => window.EP.workspace.show('publish'));
  const evName = await p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => /event|state/i.test(k) && /startAt/.test(localStorage.getItem(k)))) || '{}'));
  const c0 = await p.textContent('#seo-title-count');
  check('SEO: ô tiêu đề có gợi ý mặc định + đếm ký tự', (await p.getAttribute('#seo-title', 'placeholder')).length > 5 && /^\d+\/60 ký tự/.test(c0), c0);
  check('SEO: preview Google + Facebook có chữ', (await p.textContent('#serp-title')).length > 5 && (await p.getAttribute('#fb-img', 'src')).includes('-thumb.jpg'));
  await p.fill('#seo-title', 'Quá ngắn');
  const cShort = await p.evaluate(() => [document.getElementById('seo-title-count').textContent, document.getElementById('seo-title-count').className]);
  check('SEO: tiêu đề < 30 -> cảnh báo', /8\/60/.test(cShort[0]) && /is-bad/.test(cShort[1]), cShort.join(' '));
  const goodTitle = 'Workshop AI Marketing 2026 – Học cùng chuyên gia hàng đầu';
  await p.fill('#seo-title', goodTitle);
  const cGood = await p.evaluate(() => [document.getElementById('seo-title-count').textContent, document.getElementById('seo-title-count').className]);
  check('SEO: tiêu đề ' + goodTitle.length + ' ký tự -> ok', cGood[0].startsWith(goodTitle.length + '/60') && /is-ok/.test(cGood[1]), cGood.join(' '));
  await p.fill('#seo-title', goodTitle + ' và nhiều hơn thế nữa cho bạn');
  check('SEO: tiêu đề > 60 -> cảnh báo', /is-bad/.test(await p.getAttribute('#seo-title-count', 'class')));
  await p.fill('#seo-title', goodTitle);
  const goodDesc = 'Tham gia workshop AI Marketing để học cách dùng AI tăng doanh số, viết nội dung nhanh gấp ba lần. Số chỗ có hạn, đăng ký miễn phí ngay hôm nay nhé các bạn!';
  await p.fill('#seo-desc', goodDesc);
  const cd = await p.evaluate(() => [document.getElementById('seo-desc-count').textContent, document.getElementById('seo-desc-count').className]);
  check('SEO: mô tả ' + goodDesc.length + ' ký tự đếm đúng', cd[0].startsWith(goodDesc.length + '/160'), cd.join(' '));
  check('SEO: preview đổi theo ô nhập', (await p.textContent('#serp-title')) === goodTitle && (await p.textContent('#fb-desc')) === goodDesc);
  await p.waitForTimeout(900);
  const saved = await p.evaluate(() => JSON.stringify(Object.keys(localStorage).map(k => localStorage.getItem(k)).filter(v => v && v.includes('"seo"'))));
  check('SEO: đã lưu vào state.event.seo', saved.includes('Workshop AI Marketing 2026') );
  await p.reload(); await p.evaluate(() => window.EP.workspace.show('publish')).catch(() => {});
  await p.click('[data-tab="editor"]'); await p.evaluate(() => window.EP.workspace.show('publish'));
  check('SEO: giữ nguyên sau khi tải lại', (await p.inputValue('#seo-title')) === goodTitle && (await p.inputValue('#seo-desc')) === goodDesc);

  // ---------- Export ----------
  const html = await p.evaluate(() => window.EP.exportHtml());
  const ex = await p.evaluate(h => {
    const d = new DOMParser().parseFromString(h, 'text/html');
    const m = (s, a) => { const e = d.querySelector(s); return e ? e.getAttribute(a || 'content') : null; };
    return {
      title: d.title, desc: m('meta[name="description"]'), robots: m('meta[name="robots"]'), ogTitle: m('meta[property="og:title"]'), ogDesc: m('meta[property="og:description"]'),
      ogImage: m('meta[property="og:image"]'), ogType: m('meta[property="og:type"]'), tw: m('meta[name="twitter:card"]'), vp: m('meta[name="viewport"]'), theme: m('meta[name="theme-color"]'),
      lang: d.documentElement.lang, pre: !!d.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]'),
      ld: [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent),
      h1: d.querySelectorAll('h1').length,
      imgs: [...d.querySelectorAll('img')].map(i => ({ alt: i.hasAttribute('alt'), w: i.getAttribute('width'), h: i.getAttribute('height'), lazy: i.getAttribute('loading') }))
    };
  }, html);
  const sev = await p.evaluate(() => ({ name: document.querySelector('#f-name').value, startAt: document.querySelector('#f-startAt').value }));
  check('export: <title> = tiêu đề SEO đã sửa', ex.title === goodTitle, ex.title);
  check('export: meta description = mô tả SEO', ex.desc === goodDesc);
  check('export: OG + Twitter + viewport + lang + theme-color + preconnect', ex.ogTitle === goodTitle && ex.ogDesc === goodDesc && ex.ogType === 'website' && /^https?:\/\/.+-thumb\.jpg$/.test(ex.ogImage || '') && ex.tw === 'summary_large_image' && /width=device-width/.test(ex.vp) && ex.lang === 'vi' && /^#/.test(ex.theme) && ex.pre, ex.ogImage);
  check('export: robots', ex.robots === 'index,follow');
  const evLd = ex.ld.map(t => { try { return JSON.parse(t); } catch (e) { return null; } });
  check('export: JSON-LD parse được', evLd.length >= 1 && evLd.every(Boolean), ex.ld.length);
  const E = evLd.find(o => o && o['@type'] === 'Event') || {};
  check('export: Event.name đúng', E.name === sev.name, E.name);
  check('export: Event.startDate = giờ nhập + 07:00', E.startDate === sev.startAt + ':00+07:00', E.startDate + ' vs ' + sev.startAt);
  check('export: Event có location, offers 0 VND, organizer, performer, mode', E.location && E.offers && E.offers.priceCurrency === 'VND' && E.offers.availability && E.organizer && E.organizer.name && E.performer && E.performer.length > 0 && /AttendanceMode/.test(E.eventAttendanceMode), E.eventAttendanceMode);
  check('export: không dùng ảnh dataURL trong og:image', !/^data:/.test(ex.ogImage || ''));
  check('export: 1 h1', ex.h1 === 1, ex.h1);
  check('export: mọi ảnh có alt + width/height', ex.imgs.every(i => i.alt && i.w && i.h), JSON.stringify(ex.imgs));

  // ---------- Hàm JSON-LD (thay cho trang ?e= cần Firebase) ----------
  const u = await p.evaluate(() => {
    const S = window.EP.seo;
    const base = { name: 'Hội thảo X', startAt: '2026-12-05T09:30', location: '12 Nguyễn Huệ, Quận 1, TP.HCM', capacity: 50, speakers: [{ name: 'An', title: 'CEO' }], brand: { name: 'Công ty ABC' }, images: { hero: 'https://example.com/h.jpg' } };
    const c = { description: 'Mô tả ngắn cho sự kiện.' };
    const off = S.eventJsonLd(base, c, { url: 'https://x.vn/?e=1', image: S.imageFor(base, { hero: 'assets/templates/a.svg' }) });
    const on = S.eventJsonLd(Object.assign({}, base, { location: 'Trực tuyến qua Zoom' }), c, { url: 'https://x.vn/?e=1' });
    const full = S.eventJsonLd(base, c, { url: 'https://x.vn/?e=1', count: 50 });
    const mix = S.eventJsonLd(Object.assign({}, base, { location: 'Khách sạn Rex, Quận 1 và trực tuyến qua Zoom' }), c, {});
    const thumb = S.imageFor({ images: { hero: 'data:image/png;base64,AAAA' } }, { hero: 'assets/templates/beauty.svg' });
    const faq = S.faqJsonLd([{ q: 'Có mất phí không?', a: 'Không.' }]);
    return { off, on, full, mix, thumb, faq, noFaq: S.faqJsonLd([]), d: S.defaults(base, c), cnt: S.counters('x'.repeat(55), 'title'), cnt2: S.counters('x'.repeat(20), 'title') };
  });
  check('JSON-LD Event: offline → Place + OfflineEventAttendanceMode', u.off.location['@type'] === 'Place' && u.off.eventAttendanceMode.endsWith('OfflineEventAttendanceMode') && u.off.startDate === '2026-12-05T09:30:00+07:00' && u.off.image[0] === 'https://example.com/h.jpg');
  check('JSON-LD Event: Zoom → VirtualLocation + Online', u.on.location['@type'] === 'VirtualLocation' && u.on.eventAttendanceMode.endsWith('OnlineEventAttendanceMode'));
  check('JSON-LD Event: vừa offline vừa online → Mixed', u.mix.eventAttendanceMode.endsWith('MixedEventAttendanceMode'));
  check('JSON-LD Event: đủ chỗ → SoldOut, còn chỗ → InStock', u.full.offers.availability.endsWith('SoldOut') && u.off.offers.availability.endsWith('InStock'));
  check('JSON-LD Event: organizer = brand, performer = diễn giả', u.off.organizer.name === 'Công ty ABC' && u.off.performer[0].name === 'An');
  check('og:image không dùng dataURL → ảnh thu nhỏ của mẫu', /\/assets\/templates\/beauty-thumb\.jpg$/.test(u.thumb), u.thumb);
  check('FAQPage từ Q/A; rỗng → null', u.faq['@type'] === 'FAQPage' && u.faq.mainEntity[0].acceptedAnswer.text === 'Không.' && u.noFaq === null);
  check('defaults: tiêu đề = tên + ngày/nơi ≤ 60', /Hội thảo X – 05\/12\/2026/.test(u.d.title) && u.d.title.length <= 60, u.d.title);
  check('counters: 55 ok, 20 bad', u.cnt.level === 'ok' && u.cnt2.level === 'bad');

  // applyHead (dùng ở trang ?e=): cập nhật <head> đang chạy
  const ah = await p.evaluate(() => {
    window.EP.seo.applyHead({ title: 'T áp dụng', description: 'D áp dụng', url: 'https://x.vn/?e=abc', image: 'https://x.vn/i.jpg', jsonld: [{ '@context': 'https://schema.org', '@type': 'Event', name: 'N' }] });
    const m = (s, a) => document.querySelector(s).getAttribute(a || 'content');
    return { t: document.title, d: m('meta[name="description"]'), c: m('link[rel="canonical"]', 'href'), og: m('meta[property="og:image"]'), u: m('meta[property="og:url"]'), ld: document.querySelectorAll('script[data-xc-jsonld]').length };
  });
  check('applyHead: title/description/canonical/og:image/og:url/JSON-LD', ah.t === 'T áp dụng' && ah.d === 'D áp dụng' && ah.c === 'https://x.vn/?e=abc' && ah.og === 'https://x.vn/i.jpg' && ah.u === ah.c && ah.ld === 1);

  // Bật khối FAQ → file xuất có thêm FAQPage
  await p.click('[data-tab="editor"]');
  await p.click('#block-lib [data-block="faq"]'); await p.waitForTimeout(500);
  const html2 = await p.evaluate(() => window.EP.exportHtml());
  const lds = await p.evaluate(h => [...new DOMParser().parseFromString(h, 'text/html').querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)['@type']), html2);
  check('export: bật FAQ → có FAQPage cùng Event', lds.includes('FAQPage') && lds.includes('Event'), lds.join(','));

  // ---------- Checklist ----------
  await p.click('[data-tab="editor"]');
  if (await p.isVisible('#btn-publish')) {
    await p.click('#btn-publish'); await p.waitForTimeout(300);
    const items = await p.$$eval('#checklist li', l => l.map(x => x.textContent));
    const seo = items.filter(t => /SEO/.test(t));
    check('checklist có ≥ 5 mục SEO', seo.length >= 5, seo.length);
    check('checklist: tiêu đề, mô tả, ảnh chia sẻ, H1, ảnh diễn giả, FAQ', ['tiêu đề Google', 'mô tả', 'ảnh để hiện|ảnh chia sẻ', 'H1', 'diễn giả', 'FAQ'].every(k => items.some(t => new RegExp(k, 'i').test(t))));
    check('checklist SEO không chặn xuất bản', !(await p.$$eval('#checklist li.is-block', l => l.some(x => /SEO/.test(x.textContent)))));
    await p.click('#btn-check-cancel');
  } else check('nút Xuất bản hiện để mở checklist', false);

  // ---------- Ảnh trong landing (ảnh diễn giả, logo, album cưới) ----------
  const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const lpImgs = await p.evaluate(png => {
    const box = document.createElement('div'); document.body.appendChild(box);
    const ev = { id: 'x', name: 'Thiệp cưới An & Bình', startAt: '2026-12-05T09:30', location: 'Nhà hàng Hoa Sen', capacity: 100, speakers: [{ name: 'An', title: 'Cô dâu' }, { name: 'Bình', title: 'Chú rể' }],
      agenda: [{ time: '09:30', title: 'Đón khách' }], templateId: 'wedding-redgold', studioName: 'Studio X', studioUrl: 'https://studio.example.com', images: { speakers: { 0: png }, gallery: [png, png] },
      brand: { name: 'ABC', logo: png, website: 'https://abc.example.com', fanpage: 'https://fb.com/abc' } };
    window.EP.landingRenderer.render(box, { event: ev, content: { headline: 'Tiêu đề thử', description: 'm', benefits: ['a', 'b', 'c'], source: 'x' }, now: () => new Date(), getCount: () => 0, editable: false, appUrl: 'https://x/', onRegister: () => ({ ok: false, errors: {} }) });
    const imgs = [...box.querySelectorAll('img')].map(i => ({ cls: i.className, alt: i.getAttribute('alt'), w: i.getAttribute('width'), h: i.getAttribute('height'), lazy: i.getAttribute('loading') }));
    const ext = [...box.querySelectorAll('a[target="_blank"]')].map(a => a.rel);
    box.remove(); return { imgs, ext };
  }, PNG);
  check('landing: mọi <img> có alt + width/height (' + lpImgs.imgs.length + ' ảnh)', lpImgs.imgs.length >= 4 && lpImgs.imgs.every(i => i.alt && i.w && i.h), JSON.stringify(lpImgs.imgs));
  check('landing: alt ảnh diễn giả = tên, ảnh album "Ảnh sự kiện N", logo = tên thương hiệu', lpImgs.imgs.some(i => i.alt === 'An') && lpImgs.imgs.some(i => i.alt === 'Ảnh sự kiện 1') && lpImgs.imgs.some(i => i.alt === 'ABC'));
  check('landing: ảnh ngoài hero lazy (avatar, album)', lpImgs.imgs.filter(i => /lp-avatar/.test(i.cls) || /^Ảnh sự kiện/.test(i.alt)).every(i => i.lazy === 'lazy'));
  check('landing: link người dùng nhập có rel noopener nofollow', lpImgs.ext.filter(r => /nofollow/.test(r)).length >= 3, lpImgs.ext.join(','));
  const exLinks = await p.evaluate(() => [...document.querySelectorAll('#landing a[target="_blank"]')].filter(a => !/noopener/.test(a.rel)).length);
  check('landing (trình soạn): link ngoài đều rel=noopener', exLinks === 0);

  check('không có lỗi trang', errs.length === 0, errs.join(' | '));
  await browser.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
