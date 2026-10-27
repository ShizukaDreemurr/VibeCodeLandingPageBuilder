// make-thumbs.cjs — chụp phần đầu trang (hero) của từng mẫu với dữ liệu mẫu, làm ảnh đại diện ở trang chọn mẫu.
// Cần server tĩnh ở gốc dự án:  python3 -m http.server 8000   rồi   node tools/make-thumbs.cjs [url]
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const URL = process.argv[2] || 'http://localhost:8000/';
const OUT = path.join(__dirname, '..', 'assets/templates');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1120, height: 630 }, deviceScaleFactor: 0.5 })).newPage();
  await p.goto(URL);
  await p.evaluate(() => document.fonts.ready);
  const ids = await p.evaluate(() => EP.templates.list.map(t => t.id));
  for (const id of ids) {
    await p.evaluate((id) => {
      document.body.innerHTML = '<style>*,*::before,*::after{animation:none!important;transition:none!important}</style><div id="shot" class="landing" style="width:1120px"></div>';
      document.body.style.margin = '0';
      const t = EP.templates.get(id), s = t.sample();
      const ev = Object.assign({ id: 'thumb', templateId: id, images: {} }, s);
      const content = EP.contentGenerator.generate(ev, 'formal');
      if (!t.wedding) content.headline = ev.name; // ảnh đại diện: tiêu đề là tên sự kiện mẫu
      EP.landingRenderer.render(document.getElementById('shot'), {
        event: ev, content: content, now: () => new Date(), getCount: () => 0, editable: false, onRegister: () => ({ ok: true })
      });
    }, id);
    // Chờ ảnh nền vẽ sẵn tải xong rồi mới chụp
    await p.evaluate((id) => new Promise((ok) => { const i = new Image(); i.onload = i.onerror = () => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(ok); i.src = EP.templates.get(id).hero; }), id);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(200);
    const hero = await p.$('#shot .lp-hero');
    const box = await hero.boundingBox();
    await p.screenshot({ path: path.join(OUT, id + '-thumb.jpg'), type: 'jpeg', quality: 78, clip: { x: 0, y: 0, width: 1120, height: Math.min(630, box.height) } });
  }
  console.log('chụp', ids.length, 'ảnh đại diện');
  await b.close();
})();
