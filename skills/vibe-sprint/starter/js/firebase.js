/* firebase.js - Firebase TUỲ CHỌN (đăng nhập Google + đồng bộ EP.collection lên Firestore). TẮT mặc định.
   Nạp SAU core.js/ui.js, TRƯỚC features. Khi EP.config.firebase.enabled !== true: KHÔNG tải SDK, KHÔNG gọi mạng,
   chỉ đặt nhãn "Dữ liệu lưu trên máy này" và EP.auth là bản rỗng (user() = null).
   API: EP.auth.enabled | user() | signIn() | signOut() | onChange(cb) -> huỷ | ready (Promise) | status().
   Đồng bộ: users/{uid}/{collection}/{id}. localStorage luôn là bản chính (offline vẫn chạy); ghi xuôi lên Firestore có retry;
   đăng nhập xong thì kéo về và gộp theo updatedAt (createdAt nếu chưa sửa) - bản mới hơn thắng.
   Giới hạn đã biết: xoá khi đang đăng xuất không lan lên máy chủ (lần đăng nhập sau bản ghi có thể quay lại). */
(function (root) {
  'use strict';
  var EP = root.EP = root.EP || {}, cfg = EP.config || {}, fb = cfg.firebase || {}, doc = root.document;
  var VERSION = '10.14.1', BASE = 'https://www.gstatic.com/firebasejs/' + VERSION + '/';
  var listeners = [], curUser = null, state = 'idle', pendingCount = 0, sdkReady = null;
  var T_LABEL_LOCAL = 'Dữ liệu lưu trên máy này';

  function emit() { var u = curUser; listeners.slice().forEach(function (f) { try { f(u); } catch (e) { console.error('[auth]', e); } }); if (EP.bus) EP.bus.emit('auth', u); }
  function setLabel(t) { var n = doc.getElementById('ft-storage'); if (n) n.textContent = t; }
  function whenDom(fn) { if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn); else fn(); }

  /* ---------- Bản rỗng khi tắt ---------- */
  var auth = EP.auth = {
    enabled: false, ready: Promise.resolve(null),
    user: function () { return curUser; },
    signIn: function () { return Promise.reject(new Error('Firebase đang tắt. Bật trong js/config.js (firebase.enabled).')); },
    signOut: function () { return Promise.resolve(); },
    onChange: function (cb) { listeners.push(cb); return function () { listeners = listeners.filter(function (f) { return f !== cb; }); }; },
    status: function () { return { state: 'off', pending: 0 }; },
    translateError: function (e) { return e && e.message ? e.message : String(e); }
  };

  if (fb.enabled !== true) { whenDom(function () { setLabel(T_LABEL_LOCAL); }); return; }

  /* ---------- Dịch lỗi sang tiếng Việt ---------- */
  var ERR = {
    'auth/unauthorized-domain': function () { return 'Tên miền "' + root.location.hostname + '" chưa được phép đăng nhập. Vào Firebase console → Authentication → Settings → Authorized domains → Add domain, thêm <tài-khoản>.github.io (chỉ tên miền, không có /tên-repo), rồi thử lại.'; },
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất. Hãy bấm đăng nhập lại.',
    'auth/cancelled-popup-request': 'Đã có một cửa sổ đăng nhập đang mở. Hãy hoàn tất hoặc đóng nó rồi thử lại.',
    'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập. Cho phép popup cho trang này rồi bấm lại.',
    'auth/network-request-failed': 'Không có mạng hoặc mạng chập chờn. Dữ liệu vẫn lưu trên máy này; hãy kiểm tra kết nối rồi đăng nhập lại.',
    'auth/operation-not-allowed': 'Đăng nhập Google chưa được bật. Vào Firebase console → Authentication → Sign-in method → Google → Enable.',
    'auth/operation-not-supported-in-this-environment': 'Trình duyệt này không hỗ trợ đăng nhập bằng cửa sổ. Hãy mở bằng Chrome/Safari thông thường qua https.',
    'auth/invalid-api-key': 'apiKey Firebase không hợp lệ. Kiểm tra lại firebase.config trong js/config.js.',
    'auth/api-key-not-valid': 'apiKey Firebase không hợp lệ. Kiểm tra lại firebase.config trong js/config.js.',
    'auth/configuration-not-found': 'Chưa bật Authentication cho project này (Firebase console → Authentication → Get started).',
    'auth/internal-error': 'Google từ chối đăng nhập trên trình duyệt này. Thử trình duyệt thông thường (không phải trình duyệt nhúng/tự động).',
    'auth/too-many-requests': 'Thử quá nhiều lần. Đợi vài phút rồi thử lại.',
    'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hoá.',
    'auth/web-storage-unsupported': 'Trình duyệt đang chặn bộ nhớ (cookie/localStorage) nên không đăng nhập được. Tắt chế độ ẩn danh hoặc cho phép lưu trữ.',
    'permission-denied': 'Firestore từ chối ghi/đọc. Kiểm tra đã dán firestore.rules và đã đăng nhập đúng tài khoản.',
    'unavailable': 'Không kết nối được máy chủ Firebase. Dữ liệu vẫn lưu trên máy này và sẽ tự đồng bộ khi có mạng.',
    'failed-precondition': 'Firestore chưa được tạo. Vào Firebase console → Firestore Database → Create database.'
  };
  function translate(e) {
    if (!e) return 'Có lỗi không xác định.';
    var h = ERR[e.code] || ERR[String(e.code || '').replace(/^firestore\//, '')];
    if (typeof h === 'function') return h();
    if (h) return h;
    if (e.code === 'sdk-load') return e.message;
    if (/network|Failed to fetch|offline/i.test(e.message || '')) return ERR['auth/network-request-failed'];
    return 'Không đăng nhập/đồng bộ được' + (e.code ? ' (' + e.code + ')' : '') + '. Dữ liệu vẫn an toàn trên máy này.';
  }
  auth.translateError = translate;

  /* ---------- Nạp SDK compat từ CDN (chỉ khi bật) ---------- */
  function loadScript(src) {
    return new Promise(function (ok, no) {
      var s = doc.createElement('script'); s.src = src; s.async = false; s.crossOrigin = 'anonymous';
      s.onload = ok; s.onerror = function () { var e = new Error('Không tải được Firebase SDK (kiểm tra mạng hoặc trình chặn quảng cáo).'); e.code = 'sdk-load'; no(e); };
      doc.head.appendChild(s);
    });
  }
  function loadSdk() {
    if (sdkReady) return sdkReady;
    sdkReady = loadScript(BASE + 'firebase-app-compat.js').then(function () {
      return Promise.all([loadScript(BASE + 'firebase-auth-compat.js'), loadScript(BASE + 'firebase-firestore-compat.js')]);
    }).then(function () {
      var f = root.firebase; if (!f) { var e = new Error('Firebase SDK tải xong nhưng không khởi tạo được.'); e.code = 'sdk-load'; throw e; }
      var c = fb.config || {};
      if (!c.apiKey || !c.projectId) { var e2 = new Error('Chưa điền firebase.config (apiKey, projectId...) trong js/config.js.'); e2.code = 'sdk-load'; throw e2; }
      if (!f.apps.length) f.initializeApp(c);
      var a = f.auth(), d = f.firestore();
      if (fb.emulator) { try { a.useEmulator('http://127.0.0.1:9099', { disableWarnings: true }); d.useEmulator('127.0.0.1', 8080); } catch (e3) { /* đã khởi tạo */ } }
      ctx = { f: f, auth: a, db: d };
      return ctx;
    });
    sdkReady.catch(function () { /* lỗi hiện khi người dùng bấm đăng nhập / ở nhãn */ });
    return sdkReady;
  }

  /* ---------- Đồng bộ Firestore ---------- */
  var names = [], snap = {}, queue = {}, timer = null, fails = 0, applying = false, flushing = false, ctx = null;
  function skey(n) { return 'c_' + n; }
  function stamp(r) { return (r && (r.updatedAt || r.createdAt)) || 0; }
  function readRows(n) { var a = EP.store.read(skey(n), []); return Array.isArray(a) ? a : []; }
  function ref(n, id) { return ctx.db.collection('users').doc(curUser.uid).collection(n).doc(id); }
  function status() { return { state: state, pending: pendingCount }; }
  auth.status = status;
  function setState(s) {
    state = s; pendingCount = Object.keys(queue).length;
    if (!curUser) return;
    var t = s === 'synced' ? 'Đã đồng bộ' : s === 'syncing' ? 'Đang đồng bộ (' + pendingCount + ')' : s === 'offline' ? 'Chờ mạng, ' + pendingCount + ' thay đổi chưa gửi' : s === 'error' ? 'Lỗi đồng bộ, dữ liệu vẫn lưu trên máy này' : '';
    setLabel('Đăng nhập: ' + (curUser.email || curUser.name) + (t ? ' · ' + t : ''));
    if (EP.bus) EP.bus.emit('sync', status());
  }
  function enqueue(n, id, op, row) { queue[n + '/' + id] = { n: n, id: id, op: op, row: row }; setState('syncing'); schedule(0); }
  function schedule(ms) { if (timer) clearTimeout(timer); timer = setTimeout(flush, ms); }
  function withTimeout(p, ms) { return new Promise(function (ok, no) { var t = setTimeout(function () { no(Object.assign(new Error('timeout'), { code: 'unavailable' })); }, ms || 15000); p.then(function (v) { clearTimeout(t); ok(v); }, function (e) { clearTimeout(t); no(e); }); }); }
  function flush() {
    timer = null;
    if (flushing || !curUser || !ctx) return;
    var keys = Object.keys(queue); if (!keys.length) { setState('synced'); return; }
    flushing = true;
    var uid = curUser.uid, job = queue[keys[0]];
    var p = job.op === 'del' ? ref(job.n, job.id).delete() : ref(job.n, job.id).set(JSON.parse(JSON.stringify(job.row)));
    withTimeout(p).then(function () {
      if (queue[keys[0]] === job) delete queue[keys[0]];
      fails = 0; flushing = false;
      if (!curUser || curUser.uid !== uid) return;
      if (Object.keys(queue).length) { setState('syncing'); schedule(0); } else setState('synced');
    }, function (e) {
      flushing = false; fails++;
      if (e && e.code === 'permission-denied' && fails === 1 && EP.ui) EP.ui.toast(translate(e), { type: 'error', duration: 8000 });
      setState(e && e.code === 'permission-denied' ? 'error' : 'offline');
      schedule(Math.min(60000, 2000 * Math.pow(2, Math.min(fails, 5))));
    });
  }
  /** So bản local với ảnh chụp lần trước -> xếp hàng ghi/xoá phần khác biệt. */
  function diff(n) {
    if (applying || !curUser || !ctx) return;
    var rows = readRows(n), old = snap[n] || {}, now = {}, big = 0;
    rows.forEach(function (r) {
      if (!r || typeof r.id !== 'string') return;
      var s = JSON.stringify(r); now[r.id] = s;
      if (old[r.id] === s) return;
      if (s.length > 900000) { big++; return; }
      enqueue(n, r.id, 'set', r);
    });
    Object.keys(old).forEach(function (id) { if (!(id in now)) enqueue(n, id, 'del'); });
    snap[n] = now;
    if (big && EP.ui) EP.ui.toast(big + ' bản ghi quá lớn (>900 KB, thường do ảnh) nên chỉ lưu trên máy này.', { type: 'warn' });
  }
  /** Kéo từ Firestore, gộp theo updatedAt, đẩy phần local mới hơn/chưa có lên. */
  function reconcile(n) {
    if (!curUser || !ctx) return Promise.resolve();
    var uid = curUser.uid;
    return withTimeout(ctx.db.collection('users').doc(uid).collection(n).get(), 20000).then(function (qs) {
      if (!curUser || curUser.uid !== uid) return;
      var remote = {}, local = readRows(n), byId = {}, out = [], changed = false;
      qs.forEach(function (d) { remote[d.id] = Object.assign({}, d.data(), { id: d.id }); });
      local.forEach(function (r) { if (r && typeof r.id === 'string') byId[r.id] = r; });
      Object.keys(remote).forEach(function (id) {
        var l = byId[id], r = remote[id];
        if (!l || stamp(r) > stamp(l)) { byId[id] = r; changed = true; }
      });
      Object.keys(byId).forEach(function (id) { out.push(byId[id]); });
      out.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
      if (changed) {
        applying = true;
        try { EP.store.write(skey(n), out); EP.bus.emit('change:' + n, out); EP.bus.emit('change', n); } finally { applying = false; }
      }
      snap[n] = {};
      out.forEach(function (r) {
        var s = JSON.stringify(r); snap[n][r.id] = s;
        var rr = remote[r.id];
        if ((!rr || stamp(r) > stamp(rr)) && s.length <= 900000) enqueue(n, r.id, 'set', r);
      });
    }, function (e) { setState(e && e.code === 'permission-denied' ? 'error' : 'offline'); if (EP.ui && e && e.code === 'permission-denied') EP.ui.toast(translate(e), { type: 'error', duration: 8000 }); });
  }
  function reconcileAll() { setState('syncing'); return Promise.all(names.map(reconcile)).then(function () { if (!Object.keys(queue).length) setState('synced'); }); }

  /* Theo dõi các collection được tạo (features nạp sau file này) */
  if (typeof EP.collection === 'function') {
    var origCol = EP.collection;
    EP.collection = function (name) {
      if (names.indexOf(name) < 0) { names.push(name); if (curUser && ctx) reconcile(name); }
      return origCol.apply(this, arguments);
    };
  }
  if (EP.bus) EP.bus.on('change', function (n) { if (names.indexOf(n) >= 0) diff(n); });
  root.addEventListener('online', function () { if (Object.keys(queue).length) schedule(0); });

  /* ---------- Đăng nhập ---------- */
  function mobile() { return /Android|iPhone|iPad|iPod|Mobile/i.test(root.navigator.userAgent || ''); }
  function toUser(u) { return u ? { uid: u.uid, email: u.email || '', name: u.displayName || u.email || 'Người dùng', photo: u.photoURL || '' } : null; }
  function onUser(u) {
    var nu = toUser(u), same = (nu && curUser && nu.uid === curUser.uid) || (!nu && !curUser);
    curUser = nu;
    if (same) { renderBtn(); return; }
    if (!nu) { queue = {}; snap = {}; state = 'idle'; setLabel(T_LABEL_LOCAL + ' (chưa đăng nhập)'); }
    renderBtn(); emit();
    if (nu) reconcileAll();
  }
  auth.enabled = true;
  auth.user = function () { return curUser; };
  auth.signIn = function () {
    if (root.location.protocol === 'file:') return Promise.reject(new Error('Đăng nhập Google cần mở app qua địa chỉ web (GitHub Pages hoặc localhost), không mở trực tiếp file.'));
    return loadSdk().then(function (c) {
      var p = new c.f.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
      if (mobile()) return c.auth.signInWithRedirect(p);
      return c.auth.signInWithPopup(p).catch(function (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) return c.auth.signInWithRedirect(p);
        throw e;
      });
    }).then(function () { return curUser; }, function (e) { var er = new Error(translate(e)); er.code = e && e.code; throw er; });
  };
  auth.signOut = function () { return loadSdk().then(function (c) { return c.auth.signOut(); }).then(function () { return null; }, function (e) { throw new Error(translate(e)); }); };
  auth.ready = new Promise(function (ok) { auth._ok = ok; });

  /* ---------- Nút trên thanh trên ---------- */
  var btn = null;
  function renderBtn() {
    if (!btn) return;
    var u = curUser, g = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>';
    if (u) {
      btn.className = 'btn btn-auth is-in'; btn.title = u.email + ' - bấm để đăng xuất'; btn.setAttribute('aria-label', 'Đăng xuất ' + u.email);
      btn.innerHTML = '<span class="auth-av" aria-hidden="true">' + EP.esc((u.name || '?').charAt(0).toUpperCase()) + '</span><span class="auth-txt">' + EP.esc(u.name.split(' ').pop()) + '</span>';
    } else {
      btn.className = 'btn btn-auth'; btn.title = 'Đăng nhập Google để đồng bộ dữ liệu'; btn.setAttribute('aria-label', 'Đăng nhập Google để đồng bộ dữ liệu');
      btn.innerHTML = g + '<span class="auth-txt">Đăng nhập</span>';
    }
  }
  function mountBtn() {
    var host = doc.querySelector('.topbar-actions'); if (!host || btn) return;
    btn = doc.createElement('button'); btn.type = 'button'; btn.id = 'btn-auth';
    host.insertBefore(btn, host.firstChild);
    renderBtn();
    btn.addEventListener('click', function () {
      if (curUser) {
        var go = function () { auth.signOut().then(function () { EP.ui.toast('Đã đăng xuất. Dữ liệu vẫn còn trên máy này.', { type: 'info' }); }, function (e) { EP.ui.toast(e.message, { type: 'error' }); }); };
        if (EP.ui && EP.ui.confirm) EP.ui.confirm({ title: 'Đăng xuất?', message: 'Dữ liệu trên máy này được giữ nguyên, chỉ ngừng đồng bộ.', confirmLabel: 'Đăng xuất' }).then(function (y) { if (y) go(); }); else go();
      } else {
        btn.disabled = true;
        auth.signIn().then(null, function (e) { EP.ui.toast(e.message, { type: 'error', duration: 10000 }); }).then(function () { btn.disabled = false; });
      }
    });
  }
  var st = doc.createElement('style');
  st.textContent = '@layer components{.btn-auth{min-height:40px;padding:0 12px;gap:8px;white-space:nowrap}.btn-auth svg{width:18px;height:18px}.auth-av{width:24px;height:24px;border-radius:50%;display:inline-grid;place-items:center;background:var(--accent);color:#fff;font-size:12px;font-weight:700}@media(max-width:560px){.btn-auth .auth-txt{display:none}.btn-auth{padding:0 10px}}}';
  doc.head.appendChild(st);

  whenDom(function () {
    mountBtn(); setLabel(T_LABEL_LOCAL + ' (chưa đăng nhập)');
    if (root.location.protocol === 'file:') { auth._ok(null); return; }
    /* Tải SDK ngay để khôi phục phiên đã đăng nhập + nhận kết quả redirect (nút vẫn dùng được nếu tải lỗi) */
    loadSdk().then(function (c) {
      c.auth.getRedirectResult().catch(function (e) { EP.ui.toast(translate(e), { type: 'error', duration: 10000 }); });
      c.auth.onAuthStateChanged(function (u) { onUser(u); auth._ok(curUser); });
    }, function (e) { setLabel(T_LABEL_LOCAL + ' (không tải được Firebase)'); auth._ok(null); console.warn('[firebase]', e.message); });
  });
})(window);
