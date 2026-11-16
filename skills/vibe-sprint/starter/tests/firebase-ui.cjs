// Kiểm tra giao diện/đồng bộ khi BẬT Firebase, KHÔNG cần mạng: chặn config.js để bật + cấu hình giả, và thay SDK gstatic bằng bản giả
// (Auth + Firestore trong bộ nhớ). Chạy:  node tests/firebase-ui.cjs http://localhost:8215/ [--shots thu-muc-anh]
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }
const args = process.argv.slice(2);
const URL = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:8215/').replace(/\/?$/, '/');
const si = args.indexOf('--shots'); const SHOTS = si >= 0 ? args[si + 1] : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
let failed = 0;
const ok = (n, c, x) => { if (c) console.log('  ok  ', n); else { failed++; console.log('  FAIL', n, x === undefined ? '' : JSON.stringify(x)); } };

const FAKE_SDK = `
(function(){
  var db = window.__fakeDb = {}; window.__fakeFailWrites = false; window.__signInError = null; window.__sets = 0;
  var listeners = [], user = null;
  function path(p){ return p.join('/'); }
  function col(p){ return { doc: function(id){ return docRef(p.concat(id)); }, get: function(){ var pre = path(p) + '/', docs = Object.keys(db).filter(function(k){ return k.indexOf(pre) === 0 && k.slice(pre.length).indexOf('/') < 0; }).map(function(k){ return { id: k.slice(pre.length), data: function(){ return JSON.parse(JSON.stringify(db[k])); } }; }); return Promise.resolve({ forEach: function(f){ docs.forEach(f); } }); } }; }
  function docRef(p){ return { collection: function(n){ return col(p.concat(n)); }, set: function(v){ if (window.__fakeFailWrites) return Promise.reject({ code: 'unavailable' }); window.__sets++; db[path(p)] = v; return Promise.resolve(); }, delete: function(){ delete db[path(p)]; return Promise.resolve(); } }; }
  function fire(){ listeners.forEach(function(f){ f(user); }); }
  function GP(){ } GP.prototype.setCustomParameters = function(){};
  var authObj = { GoogleAuthProvider: GP };
  function auth(){ return { onAuthStateChanged: function(f){ listeners.push(f); setTimeout(function(){ f(user); }, 0); }, getRedirectResult: function(){ return Promise.resolve(null); },
    signInWithPopup: function(){ if (window.__signInError) return Promise.reject({ code: window.__signInError }); user = { uid: 'u1', email: 'test@example.com', displayName: 'Nguyễn Test', photoURL: '' }; fire(); return Promise.resolve({ user: user }); },
    signInWithRedirect: function(){ return Promise.resolve(); }, signOut: function(){ user = null; fire(); return Promise.resolve(); }, useEmulator: function(){} }; }
  auth.GoogleAuthProvider = GP;
  function firestore(){ return { collection: function(n){ return col([n]); }, useEmulator: function(){} }; }
  window.firebase = { apps: [], initializeApp: function(c){ window.__fbConfig = c; this.apps.push(c); }, auth: auth, firestore: firestore };
})();`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = [], cdn = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.route('**/js/config.js*', async (route) => {
    const r = await route.fetch(); let body = await r.text();
    body = body.replace(/firebase: \{[^\n]*\}/, "firebase: { enabled: true, config: { apiKey: 'fake', authDomain: 'fake.firebaseapp.com', projectId: 'fake-proj', appId: '1:2:web:3' }, emulator: false }");
    await route.fulfill({ response: r, body });
  });
  await page.route(/gstatic\.com\/firebasejs\/.*/, (route) => {
    cdn.push(route.request().url());
    route.fulfill({ status: 200, contentType: 'application/javascript', body: /firebase-app-compat/.test(route.request().url()) ? FAKE_SDK : '/* stub */' });
  });

  console.log('# Bật Firebase (SDK giả)');
  await page.goto(URL + '?demo=1'); await page.waitForSelector('html[data-ready="1"]');
  await page.waitForFunction(() => window.firebase && window.__fbConfig);
  ok('SDK nạp từ gstatic bản ghim 10.14.1', cdn.length === 3 && cdn.every((u) => /firebasejs\/10\.14\.1\//.test(u)), cdn);
  ok('có nút Đăng nhập trên thanh trên', await page.isVisible('#btn-auth'));
  ok('nhãn: chưa đăng nhập, lưu trên máy', /lưu trên máy này/.test(await page.textContent('#ft-storage')));
  ok('EP.auth.enabled', await page.evaluate(() => EP.auth.enabled === true && EP.auth.user() === null));
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'on-desktop-signed-out.png') });

  console.log('# Lỗi đăng nhập dịch tiếng Việt');
  await page.evaluate(() => { window.__signInError = 'auth/unauthorized-domain'; });
  await page.click('#btn-auth');
  await page.waitForSelector('.toast, [role="alert"], #toasts > *');
  const tx = await page.textContent('#toasts');
  ok('unauthorized-domain -> hướng dẫn thêm github.io vào Authorized domains', /Authorized domains/.test(tx) && /github\.io/.test(tx), tx);
  for (const [code, re] of [['auth/popup-closed-by-user', /đóng cửa sổ/], ['auth/network-request-failed', /mạng/]]) {
    ok('dịch ' + code, await page.evaluate(([c, s]) => new RegExp(s).test(EP.auth.translateError({ code: c })), [code, re.source]));
  }

  console.log('# Đăng nhập + đồng bộ');
  await page.evaluate(() => { window.__signInError = null; });
  const before = await page.evaluate(() => EP.collection('items').count());
  ok('có dữ liệu demo cục bộ', before > 0, before);
  // Bản ghi chỉ có trên "máy chủ" (mới hơn/mới) để thử kéo về
  await page.evaluate(() => { window.__fakeDb['users/u1/items/remote1'] = { id: 'remote1', createdAt: 5, updatedAt: 9, title: 'Từ máy chủ' }; });
  await page.click('#btn-auth');
  await page.waitForFunction(() => EP.auth.user() && EP.auth.user().email === 'test@example.com');
  await page.waitForFunction(() => EP.auth.status().state === 'synced');
  ok('nhãn có email + Đã đồng bộ', /test@example\.com.*Đã đồng bộ/.test(await page.textContent('#ft-storage')));
  ok('bản ghi từ máy chủ được gộp về local', await page.evaluate(() => !!EP.collection('items').get('remote1')));
  ok('bản ghi local được đẩy lên users/u1/items/', await page.evaluate((n) => Object.keys(window.__fakeDb).filter((k) => /^users\/u1\/items\//.test(k)).length === n + 1, before));
  // ghi xuôi + retry
  await page.evaluate(() => { window.__fakeFailWrites = true; EP.collection('items').add({ title: 'Ngoại tuyến' }); });
  await page.waitForFunction(() => EP.auth.status().state === 'offline');
  ok('mất mạng: báo chờ, dữ liệu vẫn ở local', await page.evaluate(() => EP.collection('items').list().some((r) => r.title === 'Ngoại tuyến')));
  await page.evaluate(() => { window.__fakeFailWrites = false; window.dispatchEvent(new Event('online')); });
  await page.waitForFunction(() => EP.auth.status().state === 'synced', null, { timeout: 8000 });
  ok('retry thành công sau khi có mạng', await page.evaluate(() => Object.keys(window.__fakeDb).some((k) => window.__fakeDb[k].title === 'Ngoại tuyến')));
  await page.evaluate(() => { var c = EP.collection('items'); c.remove(c.list().filter((r) => r.title === 'Ngoại tuyến')[0].id); });
  await page.waitForFunction(() => EP.auth.status().state === 'synced' && !Object.keys(window.__fakeDb).some((k) => window.__fakeDb[k].title === 'Ngoại tuyến'));
  ok('xoá local được xoá trên máy chủ', true);
  if (SHOTS) { await page.waitForTimeout(300); await page.screenshot({ path: path.join(SHOTS, 'on-desktop-signed-in.png') }); }

  console.log('# Mobile 390px');
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(250);
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok('không tràn ngang khi đã đăng nhập (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw);
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'on-mobile-signed-in.png') });
  await page.click('#btn-auth'); await page.click('#confirm-ok').catch(() => {});
  await page.waitForFunction(() => EP.auth.user() === null, null, { timeout: 5000 }).then(() => ok('đăng xuất qua nút', true), () => ok('đăng xuất qua nút', false));
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'on-mobile-signed-out.png') });
  const o2 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok('không tràn ngang khi chưa đăng nhập', o2.sw <= o2.cw);

  console.log('# Lỗi');
  ok('không có lỗi trang/console', errors.length === 0, errors);
  await browser.close();
  console.log(failed ? '\n' + failed + ' kiểm tra THẤT BẠI' : '\nTẤT CẢ ĐẠT');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
