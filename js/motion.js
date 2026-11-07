/* motion.js — hiệu ứng dùng chung cho toàn app. Tôn trọng "giảm chuyển động" của hệ điều hành. */
(function (root) {
  // Cài đặt hiệu ứng của app: 'on' (mặc định, luôn có), 'system' (theo "giảm chuyển động" của máy), 'off'
  var mq = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var pref = 'on';
  try { pref = localStorage.getItem('ep_motion') || 'on'; } catch (e) { /* bỏ qua */ }
  function reduced() { return pref === 'off' || (pref === 'system' && mq.matches); }
  function applyPref() { if (root.document) document.documentElement.classList.toggle('motion-off', reduced()); }
  function setPref(v) { pref = v; try { localStorage.setItem('ep_motion', v); } catch (e) { /* bỏ qua */ } applyPref(); }
  applyPref();
  if (mq.addEventListener) mq.addEventListener('change', applyPref);

  // Chuyển cảnh mượt (View Transitions) khi trình duyệt hỗ trợ; không thì đổi ngay
  function transition(update, kind) {
    var de = document.documentElement;
    if (reduced() || !document.startViewTransition) { update(); return; }
    if (kind) de.setAttribute('data-vt', kind);
    var t;
    try { t = document.startViewTransition(update); } catch (e) { de.removeAttribute('data-vt'); update(); return; }
    var clean = function () { if (activeVT !== t) return; activeVT = null; de.removeAttribute('data-vt'); };
    activeVT = t;
    t.finished.then(clean, clean);
  }
  var activeVT = null;

  // FLIP: ghi vị trí các phần tử, đổi bố cục, rồi trượt từ chỗ cũ sang chỗ mới
  function flipRecord(nodes) {
    var m = new Map();
    Array.prototype.forEach.call(nodes, function (n) { if (n.dataset.flip) m.set(n.dataset.flip, n.getBoundingClientRect()); });
    return m;
  }
  function flipPlay(before, nodes) {
    if (reduced()) return;
    Array.prototype.forEach.call(nodes, function (n) {
      var a = before.get(n.dataset.flip);
      var b = n.getBoundingClientRect();
      if (!a || !n.animate) {
        if (n.animate) n.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
        return;
      }
      var dx = a.left - b.left, dy = a.top - b.top;
      var resized = Math.abs(a.width - b.width) > 1 || Math.abs(a.height - b.height) > 1;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !resized) return;
      var kf = [{ transform: 'translate3d(' + dx + 'px,' + dy + 'px,0)' }, { transform: 'none' }];
      if (resized) { kf[0].opacity = 0.6; kf[1].opacity = 1; }
      n.animate(kf, { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    });
  }

  // Đánh số thứ tự để CSS xuất hiện lần lượt (animation-delay theo --i)
  function stagger(nodes, max) {
    Array.prototype.forEach.call(nodes, function (n, i) { n.style.setProperty('--i', Math.min(i, max || 12)); n.classList.add('mo-stagger'); });
  }

  // Chạy lại một animation CSS bằng class
  function replay(el, cls) {
    if (!el || reduced()) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', function done() { el.classList.remove(cls); el.removeEventListener('animationend', done); });
  }

  // Số chạy từ 0 lên giá trị thật
  function countUp(el, to, ms) {
    if (reduced() || typeof to !== 'number' || !isFinite(to) || to < 10) {
      el.textContent = typeof to === 'number' ? to.toLocaleString('vi-VN') : to;
      if (to > 0) replay(el, 'mo-pop');
      return;
    }
    var start = performance.now(), dur = ms || 700;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * e).toLocaleString('vi-VN');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Thu gọn rồi mới xoá (thẻ sự kiện, phần trên trang…)
  function collapse(el, done) {
    if (!el || reduced() || !el.animate) { done(); return; }
    var h = el.offsetHeight;
    el.style.overflow = 'hidden';
    var a = el.animate([
      { opacity: 1, transform: 'none', height: h + 'px' },
      { opacity: 0, transform: 'scale(0.96)', height: h + 'px', offset: 0.6 },
      { opacity: 0, transform: 'scale(0.96)', height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' }
    ], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' });
    a.onfinish = done;
  }

  // Đổi chữ nút trong chốc lát (✓ Đã copy) rồi trả lại
  function morph(btn, text, ms) {
    if (!btn) return;
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = text;
    replay(btn, 'mo-morph');
    clearTimeout(btn._moT);
    btn._moT = setTimeout(function () { btn.textContent = old; replay(btn, 'mo-morph'); }, ms || 1600);
  }

  // Thanh gạch chân trượt theo tab đang chọn
  function indicator(nav) {
    if (!nav) return;
    var bar = nav.querySelector('.tab-indicator');
    if (!bar) { bar = document.createElement('span'); bar.className = 'tab-indicator'; bar.setAttribute('aria-hidden', 'true'); nav.appendChild(bar); }
    var act = nav.querySelector('.is-active');
    if (!act) { bar.style.opacity = '0'; return; }
    bar.style.opacity = '1';
    bar.style.width = act.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + act.offsetLeft + 'px)';
  }

  // ---------- Giao diện sáng/tối: MỘT hàm dùng chung cho mọi nút (thanh trên, Reels, bảng lệnh) ----------
  // Hiệu ứng: vòng tròn loang ra từ nút vừa bấm (View Transitions); không hỗ trợ / giảm chuyển động thì đổi ngay.
  var THEME_L = { system: 'Theo hệ thống', light: 'Sáng', dark: 'Tối' }, THEME_NEXT = { system: 'light', light: 'dark', dark: 'system' };
  function themeGet() { try { var t = localStorage.getItem('ep_theme'); return t === 'light' || t === 'dark' ? t : 'system'; } catch (e) { return 'system'; } }
  function themeIsDark() {
    var a = document.documentElement.getAttribute('data-theme');
    if (a) return a === 'dark';
    return !!(root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function themeApply(m) {
    var de = document.documentElement;
    if (m === 'system') de.removeAttribute('data-theme'); else de.setAttribute('data-theme', m);
    var b = document.getElementById('btn-theme');
    if (b) { b.dataset.mode = m; var t = 'Giao diện: ' + THEME_L[m]; b.title = t; b.setAttribute('aria-label', t + '. Bấm để đổi'); }
  }
  function themeSet(mode, origin) {
    if (mode !== 'light' && mode !== 'dark') mode = 'system';
    try { if (mode === 'system') localStorage.removeItem('ep_theme'); else localStorage.setItem('ep_theme', mode); } catch (e) { /* bỏ qua */ }
    var de = document.documentElement;
    if (!document.startViewTransition || reduced()) { themeApply(mode); return; }
    // Chuyển cảnh thật sự đang chạy (tab/thiết bị/giao diện) thì bỏ qua nó; mỗi chuyển cảnh có "thẻ" riêng để dọn đúng phần của mình
    if (activeVT) { try { activeVT.skipTransition(); } catch (e) { /* bỏ qua */ } activeVT = null; }
    // Toạ độ tâm nút theo viewport bố cục (cùng hệ với ảnh chụp chuyển cảnh); bán kính lấy kích thước lớn nhất có thể (thanh địa chỉ Android co/giãn, zoom)
    var vv = root.visualViewport, r = origin && origin.getBoundingClientRect ? origin.getBoundingClientRect() : null;
    var w = Math.max(root.innerWidth || 0, de.clientWidth || 0, vv ? vv.width + vv.offsetLeft : 0);
    var h = Math.max(root.innerHeight || 0, de.clientHeight || 0, vv ? vv.height + vv.offsetTop : 0);
    var hasR = r && (r.width || r.height);
    var x = hasR ? r.left + r.width / 2 : w / 2, y = hasR ? r.top + r.height / 2 : 0;
    var rad = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
    de.setAttribute('data-vt', 'theme');
    var t;
    var done = function () {
      if (activeVT !== t && activeVT) return; // đã có chuyển cảnh mới hơn: để nó tự dọn
      if (activeVT === t) activeVT = null;
      de.removeAttribute('data-vt');
    };
    try { t = document.startViewTransition(function () { themeApply(mode); }); } catch (e) { activeVT = null; done(); themeApply(mode); return; }
    activeVT = t;
    // Chạy vòng tròn bằng Web Animations: không phụ thuộc selector CSS/data-vt nên không thể "mất" hiệu ứng
    t.ready.then(function () {
      try {
        de.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 550, easing: 'ease-in-out', fill: 'both', pseudoElement: '::view-transition-new(root)' });
      } catch (e) { /* bỏ qua */ }
    }, function () { /* bị bỏ qua */ });
    t.finished.then(done, done);
  }
  root.EP = root.EP || {};
  root.EP.theme = {
    get: themeGet, isDark: themeIsDark, set: themeSet, apply: themeApply,
    cycle: function (origin) { themeSet(THEME_NEXT[themeGet()], origin); },
    toggle: function (origin) { themeSet(themeIsDark() ? 'light' : 'dark', origin); }
  };

  root.EP.motion = { reduce: reduced, pref: function () { return pref; }, setPref: setPref, transition: transition, flipRecord: flipRecord, flipPlay: flipPlay, stagger: stagger, replay: replay, countUp: countUp, collapse: collapse, morph: morph, indicator: indicator };
})(typeof window !== 'undefined' ? window : globalThis);
