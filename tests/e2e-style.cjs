// Bảng Giao diện: chế độ Đơn giản & Studio, ô màu nhận mọi mã màu, thanh trượt, font Google tuỳ ý, màu từng phần, hoàn tác
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const log = (k, v) => console.log(k.padEnd(30), v);
  const v = (name) => p.evaluate(n => document.querySelector('#landing').style.getPropertyValue(n), name);
  await p.goto('http://localhost:8000/'); await p.click('[data-tab="builder"]'); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(1000);

  // Đơn giản
  log('default mode', await p.getAttribute('.mode-btn.is-active', 'data-mode'));
  log('simple has groups', await p.locator('#style-panel details').count());
  log('simple gear', await p.locator('.section-item .gear').count());
  await p.click('.palette:nth-child(3)');
  await p.click('#style-panel .chip:text("Viên thuốc")');
  await p.click('#style-panel .chip:text("Bo tròn")');
  log('simple classes', (await p.getAttribute('#landing', 'class')).match(/st-(button|radius)-\w+/g).join(' '));
  await p.fill('[aria-label="Màu chính – mã màu"]', '#ffdd00'); await p.press('[aria-label="Màu chính – mã màu"]', 'Enter');
  log('simple auto-darken', await v('--lp-primary'));

  // Studio
  await p.click('.mode-btn[data-mode="studio"]');
  log('studio groups', await p.locator('#style-panel details').count());
  log('studio gear', await p.locator('.section-item .gear').count());
  await p.fill('[aria-label="Màu chính – mã màu"]', '#ffdd00'); await p.press('[aria-label="Màu chính – mã màu"]', 'Enter');
  log('studio free primary', await v('--lp-primary') + ' badge ' + await p.locator('.color-field .cr-badge').first().textContent());
  for (const [label, input] of [['Màu nhấn', 'rgb(200, 30, 60)'], ['Màu chữ phần đầu trang', 'hsl(232 60% 20%)'], ['Màu chữ nội dung', 'rgba(20,20,20,.9)'], ['Màu nền trang', 'seashell']]) {
    await p.fill('[aria-label="' + label + ' – mã màu"]', input); await p.press('[aria-label="' + label + ' – mã màu"]', 'Enter');
  }
  log('accent rgb()', await v('--lp-accent'));
  log('hero text hsl()', await v('--lp-hero-text'));
  log('text rgba()', await v('--lp-text'));
  log('bg named', await v('--lp-bg'));
  await p.fill('[aria-label="Màu chữ phụ – mã màu"]', 'xyz');
  log('invalid flagged', await p.locator('.color-line input.is-invalid').count() + ' err shown ' + await p.isVisible('.color-err >> visible=true'));
  await p.click('details[data-group="Chữ"] > summary');
  await p.fill('[aria-label="Cỡ tiêu đề lớn"]', '58'); await p.press('[aria-label="Cỡ tiêu đề lớn"]', 'Tab');
  await p.click('[aria-label="Tăng cỡ tiêu đề lớn"]'); await p.click('[aria-label="Tăng cỡ tiêu đề lớn"]');
  await p.selectOption('[aria-label="Font tiêu đề – độ đậm"]', '500');
  await p.fill('[aria-label="Thụt đầu dòng đoạn văn (số)"]', '24'); await p.press('[aria-label="Thụt đầu dòng đoạn văn (số)"]', 'Tab');
  await p.fill('[aria-label="Giãn từ (số)"]', '0.1'); await p.press('[aria-label="Giãn từ (số)"]', 'Tab');
  await p.selectOption('[aria-label="Font nội dung – độ đậm"]', '300');
  await p.click('details[data-group="Chữ"] .chip:text("Đều hai bên")');
  log('indent / word / body weight', await v('--lp-indent') + ' / ' + await v('--lp-ws') + ' / ' + await v('--lp-bw') + ' / ' + await v('--lp-balign'));
  log('indent applied', await p.$eval('[data-field="description"]', e => getComputedStyle(e).textIndent + ' ' + getComputedStyle(e).textAlign));
  log('h1 / weight', await v('--lp-h1') + ' / ' + await v('--lp-hw'));
  await p.click('[aria-label="Font tiêu đề"]');
  log('font list options', await p.locator('.combo-list .combo-opt').count());
  await p.keyboard.type('pacif');
  log('filtered', await p.locator('.combo-list .combo-opt').allTextContents());
  await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  log('picked from list', await v('--lp-heading-font') + ' link ' + await p.locator('link[href*="Pacifico"]').count());
  await p.click('[aria-label="Font nội dung"]'); await p.keyboard.type('Inconsolata'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
  log('custom google font', await v('--lp-body-font'));
  await p.click('[aria-label="Font nội dung"]'); await p.keyboard.type('Khongcofontnay'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
  log('missing font note', await p.textContent('.font-field:has([aria-label="Font nội dung"]) .combo-note'));
  await p.click('details[data-group="Bố cục & hiệu ứng"] > summary');
  await p.fill('[aria-label="Khoảng cách trên/dưới mỗi phần (số)"]', '200'); await p.press('[aria-label="Khoảng cách trên/dưới mỗi phần (số)"]', 'Tab');
  log('clamped pad', await v('--lp-pad'));
  await p.click('.section-item[data-key="benefits"] .gear');
  await p.fill('.section-item[data-key="benefits"] [aria-label="Màu nền riêng – mã màu"]', '#222'); await p.press('.section-item[data-key="benefits"] [aria-label="Màu nền riêng – mã màu"]', 'Enter');
  await p.fill('.section-item[data-key="benefits"] [aria-label="Màu chữ riêng – mã màu"]', 'white'); await p.press('.section-item[data-key="benefits"] [aria-label="Màu chữ riêng – mã màu"]', 'Enter');
  log('section colors', await p.getAttribute('[data-section="benefits"]', 'style'));
  await p.screenshot({ path: SP + '/studio.png' });
  await p.click('#btn-undo'); await p.click('#btn-undo');
  log('undo section colors', await p.getAttribute('[data-section="benefits"]', 'style'));
  await p.reload(); await p.click('[data-tab="editor"]');
  log('persist mode', await p.getAttribute('.mode-btn.is-active', 'data-mode'));
  log('persist h1', await v('--lp-h1'));
  log('ERRORS', errs);
  await b.close();
})();
