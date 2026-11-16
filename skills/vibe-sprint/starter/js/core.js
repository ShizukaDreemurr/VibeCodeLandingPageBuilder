/* core.js - nền tảng: namespace EP, tiện ích DOM, bus sự kiện, storage an toàn, collection CRUD,
   giao diện sáng/tối (có vòng tròn loang), router tab có view transition, hiệu ứng ánh sáng thẻ.
   Không phụ thuộc file nào ngoài config.js. */
(function (root) {
  'use strict';
  var EP = root.EP = root.EP || {};
  var cfg = EP.config = Object.assign({ appName: 'App', brandMark: 'X', prefix: 'ep_', defaultRoute: 'home', locale: 'vi-VN', currency: 'VND', heroLead: 'Giải pháp', heroEm: 'thông minh', mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI' }, EP.config);
  var doc = root.document;

  /* ---------- DOM & tiện ích ---------- */
  EP.$ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  EP.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  /** Escape chuỗi trước khi nhét vào innerHTML. LUÔN dùng cho dữ liệu người dùng / AI. */
  EP.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  EP.uid = function () { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  EP.debounce = function (fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms || 150); }; };
  EP.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  EP.reduced = function () { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  EP.clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  EP.fmt = {
    number: function (n, d) { return Number(n || 0).toLocaleString(cfg.locale, { maximumFractionDigits: d == null ? 0 : d }); },
    money: function (n) { return Number(n || 0).toLocaleString(cfg.locale, { style: 'currency', currency: cfg.currency, maximumFractionDigits: 0 }); },
    percent: function (n, d) { return Number(n || 0).toLocaleString(cfg.locale, { maximumFractionDigits: d == null ? 1 : d }) + '%'; },
    date: function (v) { var d = new Date(v); return isNaN(d) ? '' : d.toLocaleDateString(cfg.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }); },
    datetime: function (v) { var d = new Date(v); return isNaN(d) ? '' : d.toLocaleString(cfg.locale, { dateStyle: 'short', timeStyle: 'short' }); },
    /** Ngày hôm nay dạng YYYY-MM-DD theo giờ máy (không lệch múi giờ như toISOString). */
    today: function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  };

  /* ---------- Bus sự kiện ---------- */
  var handlers = {};
  EP.bus = {
    on: function (ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); return function () { EP.bus.off(ev, fn); }; },
    off: function (ev, fn) { handlers[ev] = (handlers[ev] || []).filter(function (f) { return f !== fn; }); },
    emit: function (ev, data) { (handlers[ev] || []).slice().forEach(function (f) { try { f(data); } catch (e) { console.error('[bus]', ev, e); } }); }
  };

  /* ---------- Storage: tiền tố + JSON an toàn (localStorage có thể bị chặn -> rơi về bộ nhớ) ---------- */
  var mem = {}, ls = null;
  try { ls = root.localStorage; ls.setItem('__t', '1'); ls.removeItem('__t'); } catch (e) { ls = null; }
  function K(key) { return cfg.prefix + key; }
  EP.store = {
    available: !!ls,
    /** Đọc giá trị JSON; hỏng/thiếu thì trả fallback. */
    read: function (key, fallback) {
      try {
        var raw = ls ? ls.getItem(K(key)) : mem[K(key)];
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    /** Ghi giá trị JSON; trả true/false (đầy bộ nhớ, bị chặn...). */
    write: function (key, val) {
      var s;
      try { s = JSON.stringify(val); } catch (e) { return false; }
      try { if (ls) ls.setItem(K(key), s); else mem[K(key)] = s; return true; }
      catch (e) { mem[K(key)] = s; EP.bus.emit('store:error', e); return false; }
    },
    remove: function (key) { try { if (ls) ls.removeItem(K(key)); delete mem[K(key)]; } catch (e) { /* bỏ qua */ } },
    keys: function () {
      var out = [], p = cfg.prefix, i, k;
      try { if (ls) for (i = 0; i < ls.length; i++) { k = ls.key(i); if (k && k.indexOf(p) === 0) out.push(k.slice(p.length)); } } catch (e) { /* bỏ qua */ }
      Object.keys(mem).forEach(function (m) { if (m.indexOf(p) === 0 && out.indexOf(m.slice(p.length)) < 0) out.push(m.slice(p.length)); });
      return out;
    },
    /** Toàn bộ dữ liệu của app (dùng cho sao lưu). */
    all: function () { var o = {}; EP.store.keys().forEach(function (k) { o[k] = EP.store.read(k, null); }); return o; },
    clear: function () { EP.store.keys().forEach(EP.store.remove); }
  };

  /* ---------- Collection: CRUD tổng quát trên storage (id, createdAt, giới hạn số bản ghi) ----------
     var items = EP.collection('items', { limit: 500 });
     items.add({...}) / update(id, patch) / remove(id) / get(id) / list() / count() / clear() / replace(rows)
     items.onChange(fn) -> huỷ đăng ký. Sự kiện bus: 'change:items'. */
  EP.collection = function (name, opts) {
    opts = opts || {};
    var key = 'c_' + name, limit = opts.limit || 1000;
    function load() { var a = EP.store.read(key, []); return Array.isArray(a) ? a : []; }
    function save(a) { EP.store.write(key, a); EP.bus.emit('change:' + name, a); EP.bus.emit('change', name); return a; }
    return {
      name: name,
      list: load,
      count: function () { return load().length; },
      get: function (id) { return load().filter(function (r) { return r.id === id; })[0] || null; },
      add: function (obj) {
        var a = load(), row = Object.assign({ id: EP.uid(), createdAt: Date.now() }, obj);
        a.unshift(row);
        if (a.length > limit) a.length = limit;
        save(a); return row;
      },
      update: function (id, patch) {
        var a = load(), hit = null;
        a = a.map(function (r) { if (r.id !== id) return r; hit = Object.assign({}, r, patch, { updatedAt: Date.now() }); delete hit._demo; return hit; });
        if (hit) save(a); return hit;
      },
      remove: function (id) { var a = load(), n = a.filter(function (r) { return r.id !== id; }); if (n.length !== a.length) save(n); return n.length !== a.length; },
      replace: function (rows) { return save(Array.isArray(rows) ? rows : []); },
      clear: function () { return save([]); },
      onChange: function (fn) { return EP.bus.on('change:' + name, fn); }
    };
  };

  /* ---------- Chuyển cảnh dùng chung ---------- */
  var activeVT = null;
  /** EP.transition('route', fn): chạy fn trong View Transition nếu trình duyệt hỗ trợ, không thì chạy thẳng. */
  EP.transition = function (kind, fn) {
    var de = doc.documentElement;
    if (!doc.startViewTransition || EP.reduced()) { fn(); return null; }
    if (activeVT) { try { activeVT.skipTransition(); } catch (e) { /* bỏ qua */ } }
    de.setAttribute('data-vt', kind);
    var t;
    try { t = doc.startViewTransition(fn); } catch (e) { de.removeAttribute('data-vt'); fn(); return null; }
    activeVT = t;
    var done = function () { if (activeVT === t) { activeVT = null; de.removeAttribute('data-vt'); } };
    if (t.ready) t.ready.then(function () {}, function () {});
    t.finished.then(done, done);
    return t;
  };

  /* ---------- Giao diện: system | light | dark, đổi bằng vòng tròn loang từ nút bấm ---------- */
  var THEME_L = { system: 'Theo hệ thống', light: 'Sáng', dark: 'Tối' };
  var THEME_NEXT = { system: 'light', light: 'dark', dark: 'system' };
  function themeGet() { var t = doc.documentElement.getAttribute('data-theme'); return t === 'light' || t === 'dark' ? t : 'system'; }
  function themeIsDark() { var m = themeGet(); return m === 'dark' || (m === 'system' && root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches); }
  /* Gọn nhất có thể trong callback của View Transition: chỉ đổi thuộc tính + nhãn nút. Lưu trữ và phát sự kiện dời ra sau. */
  function themeApply(m, quiet) {
    var de = doc.documentElement;
    if (m === 'system') de.removeAttribute('data-theme'); else de.setAttribute('data-theme', m);
    var b = doc.getElementById('btn-theme');
    if (b) { b.dataset.mode = m; var t = 'Giao diện: ' + THEME_L[m]; b.title = t; b.setAttribute('aria-label', t + '. Bấm để đổi'); }
    if (!quiet) EP.bus.emit('theme', m);
  }
  function themeStore(mode) {
    try { if (mode === 'system') localStorage.removeItem(cfg.prefix + 'theme'); else localStorage.setItem(cfg.prefix + 'theme', mode); } catch (e) { /* bỏ qua */ }
  }
  var themeBusy = false, THEME_MS = 650, THEME_EASE = 'cubic-bezier(.45,0,.25,1)';
  function themeSet(mode, origin) {
    if (mode !== 'light' && mode !== 'dark') mode = 'system';
    var de = doc.documentElement;
    if (themeBusy) { EP.bus.emit('theme', themeGet()); return; } /* bấm dồn: bỏ qua khi đang chạy, đồng bộ lại nút chọn */
    if (EP.reduced()) { themeStore(mode); themeApply(mode); return; }
    if (!doc.startViewTransition) { /* trình duyệt cũ: mờ chéo màu 200ms */
      de.setAttribute('data-vt', 'fade'); themeBusy = true;
      themeStore(mode); themeApply(mode);
      setTimeout(function () { themeBusy = false; if (de.getAttribute('data-vt') === 'fade') de.removeAttribute('data-vt'); }, 260);
      return;
    }
    if (activeVT) { try { activeVT.skipTransition(); } catch (e) { /* bỏ qua */ } activeVT = null; }
    var vv = root.visualViewport, r = origin && origin.getBoundingClientRect ? origin.getBoundingClientRect() : null;
    var w = Math.max(root.innerWidth || 0, de.clientWidth || 0, vv ? vv.width + vv.offsetLeft : 0);
    var h = Math.max(root.innerHeight || 0, de.clientHeight || 0, vv ? vv.height + vv.offsetTop : 0);
    var hasR = r && (r.width || r.height);
    var x = hasR ? r.left + r.width / 2 : w / 2, y = hasR ? r.top + r.height / 2 : 0;
    var rad = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
    themeStore(mode); /* ghi sớm (vài micro giây) để tải lại giữa chừng vẫn nhớ */
    de.setAttribute('data-vt', 'theme');
    themeBusy = true;
    var t, finished = false;
    var done = function () {
      if (finished) return; finished = true; themeBusy = false;
      if (activeVT === t) activeVT = null;
      if (!activeVT) de.removeAttribute('data-vt');
      /* việc nặng chạy sau khi hoạt ảnh xong, không chen vào khung hình */
      root.requestAnimationFrame(function () { EP.bus.emit('theme', mode); });
    };
    try { t = doc.startViewTransition(function () { themeApply(mode, true); }); } catch (e) { activeVT = null; themeBusy = false; de.removeAttribute('data-vt'); themeApply(mode); return; }
    activeVT = t;
    t.ready.then(function () {
      try {
        de.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: THEME_MS, easing: THEME_EASE, fill: 'both', pseudoElement: '::view-transition-new(root)' });
      } catch (e) { /* bỏ qua */ }
    }, function () { /* bị bỏ qua */ });
    t.finished.then(done, done);
  }
  EP.theme = {
    labels: THEME_L,
    get: themeGet, isDark: themeIsDark, set: themeSet, apply: themeApply,
    cycle: function (origin) { themeSet(THEME_NEXT[themeGet()], origin); }
  };

  /* ---------- Router: mỗi view là một tab; đăng ký bằng EP.register ----------
     EP.register({
       id: 'orders',                 // duy nhất, dùng trong URL #/orders
       label: 'Đơn hàng',            // chữ trên tab
       title: 'Quản lý đơn hàng',    // <h1> của view (mỗi view đúng 1 h1)
       desc: 'Mô tả ngắn',           // dòng phụ dưới h1 + thẻ ở Tổng quan
       icon: 'list',                 // tên icon trong EP.ui.icons (tuỳ chọn)
       order: 20,                    // thứ tự tab (home=0, settings=99)
       always: false,                // true = render lại mỗi lần mở tab
       summary: function(){ return [{label,value,hint}] }, // KPI hiện ở Tổng quan (tuỳ chọn)
       actions: function(){ return html }, // nút ở góc phải h1 (tuỳ chọn)
       render: function(el, ctx){ ... }    // vẽ vào el; có thể trả Promise (hiện skeleton khi chờ)
     }); */
  var views = [], current = null, mounted = false, navEl, hostEl, pillEl;
  function findView(id) { return views.filter(function (v) { return v.id === id; })[0]; }
  EP.register = function (def) {
    if (!def || !def.id) throw new Error('EP.register cần id');
    views = views.filter(function (v) { return v.id !== def.id; });
    views.push(Object.assign({ order: 50, label: def.id, title: def.label || def.id }, def));
    views.sort(function (a, b) { return a.order - b.order; });
  };
  function idFromHash() {
    var m = /^#\/?([\w-]+)/.exec(root.location.hash);
    return m && findView(m[1]) ? m[1] : (findView(cfg.defaultRoute) ? cfg.defaultRoute : (views[0] && views[0].id));
  }
  function movePill() {
    var a = navEl && navEl.querySelector('.tab[aria-current="page"]');
    if (!a || !pillEl) return;
    pillEl.style.width = a.offsetWidth + 'px';
    pillEl.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    var want = a.offsetLeft - (navEl.clientWidth - a.offsetWidth) / 2;
    if (navEl.scrollWidth > navEl.clientWidth) navEl.scrollTo({ left: want, behavior: EP.reduced() ? 'auto' : 'smooth' });
  }
  function renderView(v, force) {
    var sec = doc.getElementById('view-' + v.id), body = sec.querySelector('.view-body');
    if (v._done && !v.always && !force) return;
    v._done = true;
    var act = sec.querySelector('.view-actions');
    if (act && v.actions) act.innerHTML = v.actions();
    try {
      var r = v.render(body, { view: v, refresh: function () { renderView(v, true); } });
      if (r && typeof r.then === 'function') {
        body.innerHTML = EP.ui ? EP.ui.skeleton(3) : 'Đang tải...';
        r.then(null, function (e) { v._done = false; showViewError(v, body, e); });
      }
    } catch (e) { v._done = false; showViewError(v, body, e); }
  }
  function showViewError(v, body, e) {
    console.error('[view ' + v.id + ']', e);
    body.innerHTML = EP.ui ? EP.ui.error({ title: 'Không hiển thị được màn hình này', text: 'Đã có lỗi khi tải. Bạn thử lại nhé.', retry: 'view-retry' }) : 'Lỗi';
    var b = body.querySelector('[data-act="view-retry"]');
    if (b) b.addEventListener('click', function () { renderView(v, true); });
  }
  function show(id, first) {
    var v = findView(id);
    if (!v || (id === current && !first)) return;
    current = id;
    var update = function () {
      views.forEach(function (x) {
        var sec = doc.getElementById('view-' + x.id), tab = doc.getElementById('tab-' + x.id);
        sec.hidden = x.id !== id;
        if (x.id === id) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
      });
      renderView(v);
      movePill();
      doc.title = v.title + ' - ' + cfg.appName;
      if (!first) { root.scrollTo(0, 0); var h = doc.getElementById('h-' + id); if (h) h.focus({ preventScroll: true }); }
      EP.bus.emit('route', id);
    };
    if (first) update(); else EP.transition('route', update);
  }
  EP.router = {
    list: function () { return views.slice(); },
    current: function () { return current; },
    go: function (id) { if (root.location.hash === '#/' + id) show(id); else root.location.hash = '#/' + id; },
    refresh: function () { var v = findView(current); if (v) renderView(v, true); },
    mount: function () {
      if (mounted) return; mounted = true;
      navEl = EP.$('#tabs'); hostEl = EP.$('#views');
      pillEl = doc.createElement('span'); pillEl.className = 'tabs-pill'; pillEl.setAttribute('aria-hidden', 'true'); navEl.appendChild(pillEl);
      views.forEach(function (v) {
        var a = doc.createElement('a');
        a.className = 'tab'; a.id = 'tab-' + v.id; a.href = '#/' + v.id; a.setAttribute('data-tab', v.id);
        a.innerHTML = (v.icon && EP.ui ? EP.ui.icon(v.icon) : '') + '<span>' + EP.esc(v.label) + '</span>';
        navEl.appendChild(a);
        var s = doc.createElement('section');
        s.className = 'view'; s.id = 'view-' + v.id; s.hidden = true; s.setAttribute('aria-labelledby', 'h-' + v.id);
        s.innerHTML = '<div class="view-head"><div><h1 class="view-title" id="h-' + v.id + '" tabindex="-1">' + EP.esc(v.title) + '</h1>' +
          (v.desc ? '<p class="view-sub">' + EP.esc(v.desc) + '</p>' : '') + '</div><div class="view-actions row no-print"></div></div><div class="view-body"></div>';
        hostEl.appendChild(s);
      });
      root.addEventListener('hashchange', function () { show(idFromHash()); });
      root.addEventListener('resize', EP.debounce(movePill, 100));
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(movePill);
      show(idFromHash(), true);
    }
  };

  /* ---------- Ánh sáng thẻ theo con trỏ (một listener cho toàn trang) ---------- */
  doc.addEventListener('pointermove', function (e) {
    var c = e.target && e.target.closest && e.target.closest('.card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
})(window);
