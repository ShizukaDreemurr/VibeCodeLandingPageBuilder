// Bấm vào phần tử trong bản xem trước để chỉnh: chữ, cỡ, đậm, màu, căn lề, ẩn, nút, phần lớn; lưu & xuất ra trang công khai
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const log = (k, v) => console.log(k.padEnd(30), v);
  await p.goto('http://localhost:8000/'); await p.click('[data-tab="builder"]'); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(1000);
  log('selectable elements', await p.locator('#landing [data-el]').count());

  // Tiêu đề phần
  await p.click('#landing [data-el="about.title"]');
  log('inspector shown', await p.isVisible('#inspector') + ' / ' + await p.textContent('#inspector .ins-name'));
  await p.keyboard.press('Control+A'); await p.keyboard.type('Về sự kiện này'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  log('section title edited', await p.textContent('[data-el="about.title"]'));
  await p.click('#inspector [aria-label="Chữ lớn hơn"]'); await p.click('#inspector [aria-label="Chữ lớn hơn"]');
  await p.click('#inspector [aria-label="In nghiêng"]');
  await p.click('#inspector [aria-label="Căn giữa"]');
  await p.click('#inspector .ins-swatch >> nth=1');
  log('title style', await p.getAttribute('[data-el="about.title"]', 'style'));
  log('still selected', await p.locator('.lp-selected').getAttribute('data-el'));

  // Nút chính: sửa chữ qua thanh công cụ + màu nền
  await p.click('#landing .lp-cta');
  log('cta kind', await p.textContent('#inspector .ins-name'));
  await p.fill('#inspector [aria-label="Chữ trên nút"]', 'Giữ chỗ ngay'); await p.press('#inspector [aria-label="Chữ trên nút"]', 'Enter'); await p.waitForTimeout(200);
  log('cta text', await p.textContent('#landing .lp-cta'));

  // Ẩn chức danh diễn giả
  await p.click('#landing [data-el="speaker.title.0"]');
  await p.click('#inspector [aria-label="Ẩn phần tử này khỏi trang"]');
  log('hidden in editor (dimmed)', await p.locator('[data-el="speaker.title.0"].lp-el-hidden').count());

  // Phần tử bắt buộc không có nút ẩn
  await p.click('#landing .lp-submit');
  log('submit hide btn', await p.locator('#inspector [aria-label="Ẩn phần tử này khỏi trang"]').count());

  // Breadcrumb → chọn cả phần
  await p.click('#landing [data-el="benefits:0"]');
  await p.click('#inspector .ins-crumb >> nth=0');
  log('crumb selects section', await p.textContent('#inspector .ins-name'));
  await p.click('#inspector .chip:text("Màu chính")');
  log('section bg', await p.getAttribute('[data-section="benefits"]', 'class'));
  await p.click('#inspector [aria-label="Đưa phần này lên trên"]'); await p.waitForTimeout(300);
  log('order', await p.$$eval('#landing [data-section]', l => l.map(x => x.dataset.section).join(',')));

  // Studio: ô mã màu trong thanh công cụ
  await p.click('.mode-btn[data-mode="studio"]');
  await p.click('#landing [data-el="hero.eyebrow"]');
  const ci = p.locator('#inspector .color-line input[type="text"]').first();
  await ci.fill('hsl(45 100% 60%)'); await ci.press('Enter'); await p.waitForTimeout(200);
  log('studio color', await p.getAttribute('[data-el="hero.eyebrow"]', 'style'));
  await p.selectOption('#inspector [aria-label="Độ đậm"]', '900');
  log('studio weight', await p.getAttribute('[data-el="hero.eyebrow"]', 'style'));
  await p.screenshot({ path: SP + '/inspector.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  log('esc closes', await p.isHidden('#inspector'));

  // Reset
  await p.click('#landing [data-el="about.title"]'); await p.click('#inspector [aria-label="Bỏ mọi chỉnh sửa của phần tử này"]');
  log('reset title', await p.textContent('[data-el="about.title"]') + ' | ' + await p.getAttribute('[data-el="about.title"]', 'style'));
  await p.click('#btn-undo');
  log('undo reset', await p.textContent('[data-el="about.title"]'));

  // Lưu sau khi tải lại
  await p.reload(); await p.click('[data-tab="editor"]');
  log('persist cta', await p.textContent('#landing .lp-cta'));
  log('ERRORS', errs);
  await b.close();
})();
