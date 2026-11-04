/* tpl-gallery.js — khung điều khiển kiểu gallery cho trang "Thư viện mẫu": viên thuốc trượt (mục đích, ngành),
   ô tìm kiếm bung ra, nút tạm dừng chuyển động, đổi giao diện theo vòng tròn và chế độ Reels lướt dọc toàn màn hình.
   Chuyển thể từ Lucian UX/UI Prompt gallery (gallery.js, gallery.css; MIT © 2026 Seokwoooo). */
(function (root) {
  var EP = root.EP = root.EP || {};
  var doc = root.document, de = doc.documentElement;
  var api = null, page = null, wired = false;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var R = function (role) { return page.querySelector('[data-r="' + role + '"]'); };
  var wideQ = root.matchMedia('(min-width: 1100px)');
  var mobileQ = root.matchMedia('(max-width: 760px)');
  function reduced() { return EP.motion ? EP.motion.reduce() : false; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Viên thuốc trượt sau nút đang chọn ---------- */
  function movePill(box, pill, sel, animate) {
    var b = box.querySelector(sel);
    if (!b || !b.offsetWidth) { pill.style.setProperty('--o', '0'); return; }
    if (!animate) box.classList.add('no-anim');
    pill.style.setProperty('--o', '1');
    pill.style.setProperty('--x', b.offsetLeft + 'px');
    pill.style.setProperty('--w', b.offsetWidth + 'px');
    if (!animate) requestAnimationFrame(function () { box.classList.remove('no-anim'); });
  }
  function movePills(animate) {
    if (!page || page.hidden) return;
    var sets = R('sets'), cats = R('chips');
    movePill(sets, $('.lt-sets-pill', sets), '.lt-set.is-active', animate);
    movePill(cats, $('.lt-cats-pill', cats), '.lt-cat.is-active', animate);
    fades();
  }
  // mờ hai đầu hàng chip khi còn nội dung để cuộn
  function fades() {
    var c = R('chips'), wrap = c.parentNode;
    wrap.classList.toggle('can-left', c.scrollLeft > 4);
    wrap.classList.toggle('can-right', c.scrollLeft + c.clientWidth < c.scrollWidth - 4);
  }

  /* ---------- Tìm kiếm: nút tròn bung thành ô nhập ---------- */
  function searchUi() {
    var box = R('searchbox'), btn = R('search-btn'), q = R('search');
    function open() { box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); q.tabIndex = 0; q.focus(); }
    function close() { box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); q.tabIndex = -1; }
    q.tabIndex = -1;
    btn.addEventListener('click', function () { if (box.classList.contains('is-open')) q.focus(); else open(); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (q.value) { q.value = ''; q.dispatchEvent(new Event('input')); } else { close(); btn.focus(); }
      }
    });
    q.addEventListener('blur', function () { setTimeout(function () { if (!q.value && doc.activeElement !== q) close(); }, 120); });
    q.addEventListener('focus', function () { if (!box.classList.contains('is-open')) { box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); } });
    // "/" mở tìm kiếm khi không gõ ở ô nào
    doc.addEventListener('keydown', function (e) {
      if (e.key !== '/' || page.hidden || reelOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], dialog')) return;
      if (doc.querySelector('dialog[open], .pv-overlay:not([hidden])')) return;
      e.preventDefault(); open();
    });
  }

  /* ---------- Bộ lọc, chuyển động, giao diện ---------- */
  function filterUi() {
    var btn = R('filter-btn'), panel = R('panel');
    btn.addEventListener('click', function () {
      var on = panel.hidden;
      panel.hidden = !on;
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on && EP.motion) EP.motion.replay(panel, 'mo-fade');
    });
  }
  function syncMotionBtns() {
    var calm = reduced();
    $$('[data-r="motion-btn"], .lt-hud-motion').forEach(function (b) {
      b.classList.toggle('is-on', !calm);
      b.setAttribute('aria-pressed', String(!calm));
      b.setAttribute('aria-label', calm ? 'Bật lại chuyển động' : 'Tạm dừng chuyển động');
      b.title = b.getAttribute('aria-label');
    });
  }
  function toggleMotion() {
    if (!EP.motion) return;
    EP.motion.setPref(reduced() ? 'on' : 'off');
    syncMotionBtns();
  }
  function isDark() {
    var a = de.getAttribute('data-theme');
    if (a) return a === 'dark';
    return root.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeBtns() {
    var dark = isDark();
    $$('.lt-theme').forEach(function (b) {
      b.classList.toggle('is-dark', dark);
      b.setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    });
  }
  // Đổi sáng/tối: dùng chung EP.theme (vòng tròn loang từ nút bấm); các nút đồng bộ qua MutationObserver
  function toggleTheme(from) { EP.theme.toggle(from); }

  /* ---------- Thanh trên: hiện đường kẻ khi cuộn ---------- */
  function stuckUi() {
    var tb = $('.topbar'), bar = R('bar');
    function upd() {
      tb.classList.toggle('is-stuck', root.scrollY > 4);
      if (bar) bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= (tb.offsetHeight || 0) + 1);
    }
    root.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- Reels: mỗi màn một mẫu, lướt dọc ---------- */
  var reel, hud, slides = [], list = [], cur = -1, opener = null, mounted = {}, mountT = 0, dirty = true;
  var ICON = {
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14.5l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    hand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M7 11l5-5 5 5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>',
    wand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L16 8M14 6l4 4M7 5v2M6 6h2M18 14v2M17 15h2"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="lt-m-play" d="M8.5 6.2v11.6l9.2-5.8z"/><path class="lt-m-pause" d="M8.5 6.5v11M15.5 6.5v11"/></svg>',
    theme: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor"/></svg>'
  };
  function reelOpen() { return doc.body.getAttribute('data-lt-view') === 'reel'; }

  function buildShell() {
    if (reel) return;
    reel = doc.createElement('div');
    reel.className = 'lt-reel'; reel.id = 'tpl-reel';
    reel.setAttribute('role', 'region'); reel.setAttribute('aria-label', 'Lướt từng mẫu landing page'); reel.setAttribute('aria-hidden', 'true');
    hud = doc.createElement('nav');
    hud.className = 'lt-hud'; hud.setAttribute('aria-label', 'Công cụ Reels'); hud.setAttribute('aria-hidden', 'true');
    hud.innerHTML =
      '<button class="lt-hud-b" type="button" data-act="back" aria-label="Quay lại lưới mẫu">' + ICON.grid + '<span>Lưới mẫu</span></button>' +
      '<div class="lt-prog" aria-live="polite"><span data-r="prog-n">001</span><i><b data-r="prog-bar"></b></i><span data-r="prog-t">000</span></div>' +
      '<div class="lt-hud-r">' +
      '<button class="lt-hud-b lt-hud-ic lt-hud-motion" type="button" data-act="motion" aria-pressed="true" aria-label="Tạm dừng chuyển động">' + ICON.play + '</button>' +
      '<button class="lt-hud-b lt-hud-ic lt-theme" type="button" data-act="theme" aria-label="Đổi giao diện">' + ICON.theme + '</button></div>';
    doc.body.appendChild(reel); doc.body.appendChild(hud);
    reel.addEventListener('scroll', onScroll, { passive: true });
    reel.addEventListener('click', onReelClick);
    hud.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      if (b.dataset.act === 'back') close();
      if (b.dataset.act === 'motion') toggleMotion();
      if (b.dataset.act === 'theme') toggleTheme(b);
    });
    syncMotionBtns();
  }
  function slideHtml(t) {
    var goals = api.goals(t);
    return '<div class="lt-slide-bg" aria-hidden="true"></div>' +
      '<div class="lt-slide-stage"><div class="lt-device" data-r="device"><div class="lt-chrome"><i></i><i></i><i></i><span>xclipse.vn/' + esc(t.id) + '</span></div>' +
      '<div class="lt-live"><img class="lt-poster" alt="" src="' + esc(t.thumb) + '"><div class="lt-lp"><div class="landing"></div></div></div></div></div>' +
      '<div class="lt-slide-meta">' +
      '<p class="lt-slide-kick"><b>' + api.num(t) + '</b> · ' + esc(api.desc(t) || 'Mẫu landing page') + (api.isNew(t) ? ' <em class="lt-new">NEW</em>' : '') + '</p>' +
      '<h2 class="lt-slide-t">' + esc(t.name) + '</h2>' +
      '<p class="lt-slide-s">' + (goals.length ? 'Phù hợp để ' + esc(goals.join(', ').toLowerCase()) + '. ' : '') + 'Trang đăng ký có đếm ngược, mã QR và danh sách khách, điền sẵn dữ liệu mẫu.</p>' +
      '<div class="lt-slide-cta"><button class="lt-btn lt-btn--pri" type="button" data-act="use">' + ICON.wand + '<span>Dùng mẫu này</span></button>' +
      '<button class="lt-btn" type="button" data-act="preview">' + ICON.eye + '<span>Xem trước đầy đủ</span></button></div>' +
      '<p class="lt-slide-hint">' + ICON.hand + '<span>Cuộn, vuốt hoặc dùng phím ↑ ↓ để xem mẫu khác</span></p></div>' +
      '<div class="lt-rail">' +
      '<button class="lt-rb" type="button" data-act="prev" aria-label="Mẫu trước"><i>' + ICON.up + '</i><span>Trước</span></button>' +
      '<button class="lt-rb" type="button" data-act="next" aria-label="Mẫu sau"><i>' + ICON.down + '</i><span>Sau</span></button>' +
      '<button class="lt-rb" type="button" data-act="preview"><i>' + ICON.eye + '</i><span>Xem</span></button></div>';
  }
  function build() {
    buildShell();
    unmountAll();
    list = api.list().slice();
    reel.innerHTML = '';
    var frag = doc.createDocumentFragment();
    slides = list.map(function (t, p) {
      var s = doc.createElement('section');
      s.className = 'lt-slide'; s.dataset.p = String(p);
      s.style.setProperty('--h', t.theme.accent); s.style.setProperty('--h2', t.theme.primary);
      s.setAttribute('aria-label', api.num(t) + ' ' + t.name);
      frag.appendChild(s);
      return s;
    });
    reel.appendChild(frag);
    cur = -1; dirty = false;
    $('[data-r="prog-t"]', hud).textContent = String(list.length).padStart(3, '0');
  }
  function fill(p) {
    var s = slides[p];
    if (!s || s._f) return;
    s.innerHTML = slideHtml(list[p]); s._f = true;
  }
  function empty(p) { var s = slides[p]; if (s && s._f && !mounted[p]) { s.innerHTML = ''; s._f = false; } }
  // Khung trình duyệt vừa với vùng stage, giữ tỉ lệ; trang landing vẽ ở bề rộng thật (1280 hoặc 390) rồi thu nhỏ
  function fit(p) {
    var s = slides[p]; if (!s || !s._f) return;
    var st = $('.lt-slide-stage', s), dev = $('.lt-device', s), live = $('.lt-live', s), lp = $('.lt-lp', s);
    var sw = st.clientWidth, sh = st.clientHeight; if (!sw || !sh) return;
    var narrow = mobileQ.matches, boxW = narrow ? 390 : 1280, ratio = narrow ? 390 / 600 : 16 / 10, chrome = 30;
    var fw = Math.min(sw, (sh - chrome) * ratio); fw = Math.max(160, fw);
    var fh = fw / ratio, k = fw / boxW;
    dev.style.width = fw + 'px';
    live.style.height = fh + 'px';
    lp.style.width = boxW + 'px'; lp.style.height = (fh / k) + 'px';
    lp.style.transform = 'scale(' + k.toFixed(4) + ')';
  }
  function mount(p) {
    if (mounted[p] || !slides[p]) return;
    fill(p); fit(p);
    var s = slides[p], lp = $('.lt-lp > .landing', s);
    try {
      api.render(lp, list[p]);
      mounted[p] = true;
      s.classList.add('is-live');
    } catch (e) { lp.innerHTML = ''; /* giữ ảnh chụp làm hình thay thế */ }
  }
  function unmount(p) {
    if (!mounted[p]) return;
    var s = slides[p]; if (s) { var lp = $('.lt-lp > .landing', s); if (lp) lp.innerHTML = ''; s.classList.remove('is-live'); }
    delete mounted[p];
  }
  function unmountAll() { Object.keys(mounted).forEach(function (k) { unmount(+k); }); }
  function setCurrent(p) {
    if (p === cur || p < 0 || p >= slides.length) return;
    if (cur >= 0 && slides[cur]) slides[cur].classList.remove('is-on');
    cur = p;
    for (var k = Math.max(0, p - 2); k <= Math.min(slides.length - 1, p + 2); k++) fill(k);
    slides[p].classList.add('is-on');
    slides.forEach(function (s, k) { if (s._f && Math.abs(k - p) > 4) empty(k); });
    Object.keys(mounted).forEach(function (k) { if (+k !== p) unmount(+k); });
    // chỉ vẽ trang thật cho màn đang xem, chờ dừng cuộn một nhịp để lướt nhanh không bị khựng
    clearTimeout(mountT);
    mountT = setTimeout(function () { if (reelOpen() && cur === p) mount(p); }, reduced() ? 0 : 220);
    for (var j = Math.max(0, p - 1); j <= Math.min(slides.length - 1, p + 1); j++) fit(j);
    var t = list[p];
    $('[data-r="prog-n"]', hud).textContent = api.num(t);
    $('[data-r="prog-bar"]', hud).style.setProperty('--p', ((p + 1) / slides.length).toFixed(4));
  }
  var raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      setCurrent(Math.round(reel.scrollTop / (reel.clientHeight || 1)));
    });
  }
  function goTo(p, smooth) {
    p = Math.max(0, Math.min(slides.length - 1, p));
    reel.scrollTo({ top: p * reel.clientHeight, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
    if (!smooth) setCurrent(p);
  }
  function onReelClick(e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var s = b.closest('.lt-slide'); if (!s) return;
    var p = +s.dataset.p, t = list[p];
    switch (b.dataset.act) {
      case 'use': api.use(t.id); break;
      case 'preview': api.preview(t.id, b); break;
      case 'prev': goTo(p - 1, true); break;
      case 'next': goTo(p + 1, true); break;
    }
  }
  function setInert(on) {
    ['.topbar', '#view-templates', '#app-footer', '.skip-link'].forEach(function (sel) {
      var n = $(sel); if (!n) return;
      if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert');
    });
  }
  function open(startId, from) {
    if (!api) return;
    if (dirty || !slides.length) build();
    if (!slides.length) return;
    opener = from || null;
    var p = Math.max(0, list.findIndex(function (t) { return t.id === startId; }));
    doc.body.setAttribute('data-lt-view', 'reel');
    de.classList.add('lt-lock');
    reel.setAttribute('aria-hidden', 'false'); hud.setAttribute('aria-hidden', 'false');
    setInert(true);
    syncThemeBtns(); syncMotionBtns();
    requestAnimationFrame(function () {
      goTo(p, false);
      var s = slides[p]; s.setAttribute('tabindex', '-1'); s.focus({ preventScroll: true });
      fit(p);
    });
  }
  function close(instant) {
    if (!reel || !reelOpen()) return;
    clearTimeout(mountT);
    doc.body.removeAttribute('data-lt-view');
    de.classList.remove('lt-lock');
    reel.setAttribute('aria-hidden', 'true'); hud.setAttribute('aria-hidden', 'true');
    setInert(false);
    unmountAll();
    cur = -1;
    if (instant !== true && opener && opener.isConnected) opener.focus({ preventScroll: true });
  }
  doc.addEventListener('keydown', function (e) {
    if (!reelOpen() || !slides.length || e.defaultPrevented) return;
    if (api.previewOpen && api.previewOpen()) return;
    if (doc.querySelector('.pv-overlay:not([hidden])')) return;
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); close(); return; }
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    if (e.target.closest && e.target.closest('button') && (k === ' ' || k === 'Enter')) return;
    if (k === 'ArrowDown' || k === 'PageDown' || k === 'j' || (k === ' ' && !e.shiftKey)) { e.preventDefault(); goTo(cur + 1, true); }
    else if (k === 'ArrowUp' || k === 'PageUp' || k === 'k' || (k === ' ' && e.shiftKey)) { e.preventDefault(); goTo(cur - 1, true); }
    else if (k === 'Home') { e.preventDefault(); goTo(0, true); }
    else if (k === 'End') { e.preventDefault(); goTo(slides.length - 1, true); }
  });
  var rT = 0;
  root.addEventListener('resize', function () {
    movePills(false);
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (!reelOpen()) return;
      Object.keys(mounted).forEach(function (k) { fit(+k); });
      for (var j = Math.max(0, cur - 1); j <= Math.min(slides.length - 1, cur + 1); j++) fit(j);
      if (cur >= 0) reel.scrollTop = cur * reel.clientHeight;
    }, 120);
  });

  /* ---------- Giao diện công khai ---------- */
  function init(a) {
    api = a; page = a.root;
    if (wired) return; wired = true;
    searchUi(); filterUi(); stuckUi();
    R('motion-btn').addEventListener('click', toggleMotion);
    R('theme-btn').addEventListener('click', function (e) { toggleTheme(e.currentTarget); });
    R('reel-btn').addEventListener('click', function (e) {
      var l = api.list();
      if (l.length) open(l[0].id, e.currentTarget);
    });
    R('chips').addEventListener('scroll', fades, { passive: true });
    var mq = root.matchMedia('(prefers-color-scheme: dark)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(syncThemeBtns);
    new MutationObserver(syncThemeBtns).observe(de, { attributes: true, attributeFilter: ['data-theme'] });
    new MutationObserver(syncMotionBtns).observe(de, { attributes: true, attributeFilter: ['class'] });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { movePills(false); });
    syncThemeBtns(); syncMotionBtns();
  }
  // gọi mỗi lần danh sách đổi: cập nhật chấm bộ lọc, ô tìm có chữ, vị trí viên thuốc
  var firstSync = true;
  function sync() {
    if (!page) return;
    dirty = true;
    R('filter-btn').classList.toggle('has-on', !!api.filtersOn());
    R('searchbox').classList.toggle('has-q', !!api.query());
    if (api.filtersOn() && R('panel').hidden) { /* chỉ báo bằng chấm, không tự mở */ }
    movePills(!firstSync && !reduced());
    requestAnimationFrame(function () { movePills(false); });
    firstSync = false;
  }
  EP.tplGallery = { init: init, sync: sync, open: open, close: close, isOpen: reelOpen };
})(window);
