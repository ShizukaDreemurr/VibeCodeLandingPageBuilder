/* lucian.js - LỚP LUCIAN: một plug-in nạp SAU ui.js/form.js/charts.js/ai.js và TRƯỚC các feature (xem index.html).
   Nâng cấp toàn cục: không cần gọi tay, mọi feature mới nhận được ngay. Vi tương tác chuyển thể từ Lucian Lab UI
   (MIT, (c) 2026 Seokwoooo; xem vendor/lucian/LICENSE). Không phụ thuộc thư viện ngoài. Tôn trọng prefers-reduced-motion.

   TỰ ĐỘNG (chỉ cần dùng đúng HTML/API cũ):
     .seg, [role=tablist], .bnav, .tabs   viên trượt lò xo dưới lựa chọn đang chọn (MỘT bộ máy: lx.pill)
     .field input[data-max]     bộ đếm ký tự (EP.form tự gắn từ rules.maxLength); textarea tự giãn
     [data-invalid]             rung nhẹ khi vừa báo lỗi và mỗi lần bấm gửi mà còn lỗi
     select.input               hộp chọn tuỳ biến trên máy có chuột (cảm ứng dùng bộ chọn gốc); tắt bằng data-native
     .kpi-value, [data-countup] đếm lên khi xuất hiện (nội dung thật không đổi)
     .table-wrap                thẻ xếp dọc trên di động; EP.ui.table(el,{sticky:true}) tiêu đề dính; {cards:false} tắt thẻ
     .btn-cta, [data-roll]      nhãn cuộn khi rê; [data-copy] sao chép rồi biến thành dấu tích
     .card[data-tilt]           nghiêng 3D theo con trỏ (chỉ chuột)
     EP.ai.generate(...)        thanh tiến trình không xác định ở mép trên khi AI đang chạy
   OPT-IN BẰNG API:
     EP.ui.confirm({ ..., hold: true | ms })     nút xác nhận phải GIỮ (mặc định 900ms) - dùng cho thao tác xoá
     EP.lucian.aiLoading(host, { title, steps }) -> { stop(html?) }   khung chờ AI có chữ đổi theo bước
     EP.lucian.fmt.{money, compact, percent, signed, number, parse}   định dạng vi-VN
     EP.lucian.countUp(el, { ms }), .progress.start()/done(), .tilt(el), .select(el), .hold(btn, { ms }), .shake(el), .refresh(root) */
(function (root) {
  'use strict';
  var EP = root.EP, doc = root.document;
  if (!EP || !EP.ui) { if (root.console) console.warn('[lucian] Cần nạp sau js/ui.js.'); return; }
  var ui = EP.ui, esc = EP.esc, cfg = EP.config || {}, LOC = cfg.locale || 'vi-VN';
  var lx = EP.lucian = { version: '1.0.0' };

  function reduced() { return EP.reduced ? EP.reduced() : false; }
  function mq(q) { return !!(root.matchMedia && root.matchMedia(q).matches); }
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function all(r, sel) { var a = $$(sel, r); if (r.matches && r.matches(sel)) a.unshift(r); return a; }
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  var SVG_CHECK = '<svg class="lx-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M5 12.5l5 5 9-10"/></svg>';

  /* ============ Định dạng vi-VN ============ */
  var fmt = lx.fmt = {
    /** fmt.number(1234567.8, 1) -> '1.234.567,8' */
    number: function (n, d) { d = d == null ? 0 : d; return Number(n || 0).toLocaleString(LOC, { minimumFractionDigits: d, maximumFractionDigits: d }); },
    /** fmt.money(1250000) -> '1.250.000 ₫' */
    money: function (n) { return Number(n || 0).toLocaleString(LOC, { style: 'currency', currency: cfg.currency || 'VND', maximumFractionDigits: 0 }); },
    /** fmt.compact(1250000) -> '1,3 tr' ; 2500000000 -> '2,5 tỷ' ; 12500 -> '12,5 nghìn' */
    compact: function (n, unit) {
      n = Number(n || 0); var a = Math.abs(n), u = unit ? ' ' + unit : '';
      function f(v) { return v.toLocaleString(LOC, { maximumFractionDigits: v >= 100 ? 0 : 1 }); }
      if (a >= 1e9) return f(n / 1e9) + ' tỷ' + u;
      if (a >= 1e6) return f(n / 1e6) + ' tr' + u;
      if (a >= 1e4) return f(n / 1e3) + ' nghìn' + u;
      return fmt.number(n, 0) + u;
    },
    /** fmt.percent(12.34) -> '12,3%' */
    percent: function (n, d) { return Number(n || 0).toLocaleString(LOC, { maximumFractionDigits: d == null ? 1 : d }) + '%'; },
    /** fmt.signed(12.5, 1, '%') -> '+12,5%' ; fmt.signed(-3) -> '-3' */
    signed: function (n, d, suffix) { n = Number(n || 0); return (n > 0 ? '+' : n < 0 ? '-' : '') + Math.abs(n).toLocaleString(LOC, { maximumFractionDigits: d == null ? 1 : d }) + (suffix || ''); },
    /** fmt.parse('1.234,5') -> 1234.5 ; '1,234.5' -> 1234.5 ; '12.5' -> 12.5 ; '1.250.000' -> 1250000 */
    parse: function (s) {
      s = String(s == null ? '' : s).replace(/[^\d.,\-]/g, '');
      if (!s) return NaN;
      var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
      if (lc >= 0 && ld >= 0) { var dec = lc > ld ? ',' : '.'; s = dec === ',' ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, ''); }
      else if (lc >= 0) { s = (s.match(/,/g) || []).length > 1 ? s.replace(/,/g, '') : s.replace(',', '.'); }
      else if (ld >= 0) { if ((s.match(/\./g) || []).length > 1 || /^-?\d{1,3}\.\d{3}$/.test(s)) s = s.replace(/\./g, ''); }
      return Number(s);
    }
  };
  if (EP.fmt) { ['compact', 'signed', 'parse'].forEach(function (k) { if (!EP.fmt[k]) EP.fmt[k] = fmt[k]; }); }

  /* ============ Đếm lên (KPI) ============ */
  function parseNumText(text) {
    var groups = text.match(/\d[\d.,]*/g);
    if (!groups || groups.length !== 1) return null;   /* nhiều số (ngày, tỉ số, khoảng) -> không đếm */
    var m = /\d[\d.,]*/.exec(text), raw = m[0].replace(/[.,]+$/, '');
    var val = fmt.parse(raw); if (!isFinite(val)) return null;
    var dec = 0, ci = raw.lastIndexOf(','), di = raw.lastIndexOf('.');
    if (ci >= 0) dec = raw.length - ci - 1;
    else if (di >= 0 && !/^\d{1,3}(\.\d{3})+$/.test(raw)) dec = raw.length - di - 1;
    return { rawPre: text.slice(0, m.index), post: text.slice(m.index + raw.length), val: Math.abs(val), dec: dec };
  }
  /** lx.countUp(el, { ms: 900 }) - nội dung thật của el giữ nguyên; chữ đếm vẽ bằng ::after (data-lx-now). */
  lx.countUp = function (el, o) {
    o = o || {};
    if (!el || el._lxCu || reduced()) return;
    var text = el.textContent, p = parseNumText(text);
    if (!p || Math.abs(p.val) < 2) return;
    el._lxCu = 1;
    var ms = o.ms || 900, t0 = 0;
    function show(v) { el.setAttribute('data-lx-now', p.rawPre + v.toLocaleString(LOC, { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) + p.post); }
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / ms), v = p.val * ease(k);
      if (!el.isConnected) return;
      if (k < 1) { show(p.dec ? v : Math.round(v)); root.requestAnimationFrame(frame); }
      else { el.classList.remove('lx-counting'); el.removeAttribute('data-lx-now'); }
    }
    el.setAttribute('aria-label', text);
    show(0); el.classList.add('lx-counting');
    root.requestAnimationFrame(frame);
  };
  var cuIO = ('IntersectionObserver' in root) ? new IntersectionObserver(function (list) {
    list.forEach(function (e) { if (e.isIntersecting) { cuIO.unobserve(e.target); lx.countUp(e.target); } });
  }, { threshold: 0.2 }) : null;
  var routeStamp = (root.performance ? performance.now() : 0);
  function queueCount(el) {
    if (el._lxQ) return; el._lxQ = 1;
    var explicit = el.hasAttribute('data-countup');
    /* chỉ đếm khi view vừa hiện/tải trang (render lại do gõ phím thì hiện ngay, khỏi nhấp nháy) */
    if (!explicit && (performance.now() - routeStamp) > 900) return;
    if (cuIO) cuIO.observe(el); else lx.countUp(el);
  }
  if (EP.bus) EP.bus.on('route', function () { routeStamp = performance.now(); });

  /* ============ Thanh tiến trình không xác định ============ */
  var bar = null, barN = 0;
  function ensureBar() { if (bar) return bar; bar = doc.createElement('div'); bar.className = 'lx-bar'; bar.setAttribute('aria-hidden', 'true'); bar.innerHTML = '<i></i>'; doc.body.appendChild(bar); return bar; }
  lx.progress = {
    start: function () { barN++; ensureBar().classList.add('on'); },
    done: function () { barN = Math.max(0, barN - 1); if (!barN && bar) bar.classList.remove('on'); }
  };
  if (EP.ai && typeof EP.ai.generate === 'function' && !EP.ai._lxWrapped) {
    var gen0 = EP.ai.generate;
    EP.ai.generate = function () {
      lx.progress.start();
      var p; try { p = gen0.apply(this, arguments); } catch (e) { lx.progress.done(); throw e; }
      if (p && p.then) p.then(function () { lx.progress.done(); }, function () { lx.progress.done(); }); else lx.progress.done();
      return p;
    };
    EP.ai._lxWrapped = true;
  }
  /** Khung chờ AI: lx.aiLoading(host, { title: 'AI đang viết', steps: ['...','...'] }) -> { stop(htmlTuyChon) } */
  lx.aiLoading = function (host, o) {
    o = o || {};
    var steps = o.steps || ['Đang đọc dữ liệu bạn nhập…', 'Đang soạn nội dung…', 'Đang kiểm tra cấu trúc kết quả…'], i = 0;
    host.innerHTML = '<div class="lx-ai-load" role="status" aria-live="polite"><div class="lx-ai-head"><span class="lx-ai-ico">' + ui.icon('sparkles') + '</span><b>' + esc(o.title || 'AI đang xử lý') + '</b><span class="lx-ai-step" data-step>' + esc(steps[0]) + '</span></div>' +
      '<div class="lx-ind-bar" aria-hidden="true"><i></i></div><div class="skeleton" aria-hidden="true"><div class="sk title"></div><div class="sk" style="width:92%"></div><div class="sk" style="width:78%"></div><div class="sk block"></div></div></div>';
    var stepEl = $('[data-step]', host);
    var timer = setInterval(function () { i = (i + 1) % steps.length; if (stepEl) { stepEl.style.animation = 'none'; void stepEl.offsetWidth; stepEl.style.animation = ''; stepEl.textContent = steps[i]; } }, o.every || 1400);
    return { stop: function (html) { clearInterval(timer); if (html != null) host.innerHTML = html; else if (host.querySelector('.lx-ai-load')) host.innerHTML = ''; } };
  };

  /* ============ Rung ô lỗi ============ */
  lx.shake = function (field) {
    if (!field || reduced()) return;
    field.classList.remove('lx-shake'); void field.offsetWidth; field.classList.add('lx-shake');
    setTimeout(function () { field.classList.remove('lx-shake'); }, 520);
  };

  /* ============ Viên trượt DÙNG CHUNG (.seg, [role=tablist], thanh tab dưới .bnav, tab máy tính .tabs) ============
     Một bộ máy duy nhất: tự gắn cho mọi nhóm xuất hiện sau này (MutationObserver ở dưới), đo bằng offsetLeft/offsetTop
     (không bị ảnh hưởng bởi transform của hộp thoại đang trượt vào), đo lại khi: đổi lựa chọn (change / thuộc tính / .checked gán bằng JS),
     đổi kích thước (ResizeObserver), vừa hiện ra từ display:none (IntersectionObserver), phông tải xong, đổi giao diện, quay màn hình.
     Chỉ animate transform trên chính viên trượt (Web Animations, từ vị trí ĐANG HIỂN THỊ nên bấm dồn không bị giật). */
  var PILL_KINDS = [
    { sel: '.seg', item: 'label', active: function (g) { var c = $('input:checked', g); return c && c.closest('label'); } },
    { sel: '.tabs', item: '.tab', active: function (g) { return $('.tab[aria-current="page"]', g); }, cls: 'tabs-pill lx-ind-tab' },
    { sel: '.bnav', item: '.bnav-item', active: function (g) { return $('.bnav-item[aria-current="page"]', g); }, target: '.bnav-ic', cls: 'lx-ind-nav' },
    { sel: '[role="tablist"]', item: '[role="tab"]', active: function (g) { return $('[role="tab"][aria-selected="true"], [role="tab"][aria-current]', g); } }
  ];
  var pillSet = [];
  function offsetIn(el, group) { var x = 0, y = 0, n = el; while (n && n !== group) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return n === group ? { x: x, y: y } : null; }
  function curState(ind) { /* vị trí đang hiển thị (kể cả giữa chừng animation) từ ma trận tính toán */
    try { var m = root.getComputedStyle(ind).transform; if (m && m !== 'none') { var v = m.match(/matrix\(([^)]+)\)/); if (v) { v = v[1].split(',').map(parseFloat); return { x: v[4], sx: v[0] }; } } } catch (e) { /* bỏ qua */ }
    return null;
  }
  function pillPlace(g, animate) {
    var P = g._lxPill; if (!P) return;
    var ind = P.ind, k = P.kind, act = k.active(g), tgt = act && (k.target ? $(k.target, act) : act);
    if (!tgt || !tgt.offsetWidth || !g.offsetWidth) { ind.style.opacity = '0'; P.x = null; return; }
    var o = offsetIn(tgt, g); if (!o) return;
    var x = o.x, y = o.y, w = tgt.offsetWidth, h = tgt.offsetHeight, ox = P.x, ow = P.w;
    var moved = ox != null && (Math.abs(ox - x) > .5 || Math.abs(ow - w) > .5);
    var from = animate && moved && ind._lxAnim ? curState(ind) : null;
    if (ind._lxAnim) { try { ind._lxAnim.cancel(); } catch (e) { /* bỏ qua */ } ind._lxAnim = null; }
    ind.style.width = w + 'px'; ind.style.height = h + 'px'; ind.style.top = y + 'px'; ind.style.transform = 'translateX(' + x + 'px)'; ind.style.opacity = '1';
    g.classList.add('lx-ready');
    if (animate && moved && !reduced() && ind.animate) {
      var fx = from ? from.x : ox, fs = from ? from.sx : ow / w;
      /* giữa chặng viên giãn ra phủ cả hai ô (cảm giác "kéo dài" rồi co lại), kết thúc bằng lò xo */
      var mid = Math.min(1 + Math.abs(x - fx) / w * .5 + .06, 2.4);
      var a = ind._lxAnim = ind.animate([
        { transform: 'translateX(' + fx + 'px) scaleX(' + fs + ')', offset: 0, easing: 'cubic-bezier(.3,.7,.3,1)' },
        { transform: 'translateX(' + (x + (fx - x) * .35) + 'px) scaleX(' + Math.max(mid, 1) + ')', offset: .38, easing: 'cubic-bezier(.34,1.4,.64,1)' },
        { transform: 'translateX(' + x + 'px) scaleX(1)', offset: 1 }
      ], { duration: 300 });
      ind.classList.add('is-moving');
      a.onfinish = a.oncancel = function () { if (ind._lxAnim === a) ind._lxAnim = null; ind.classList.remove('is-moving'); };
    }
    P.x = x; P.w = w;
    if (animate && g.scrollWidth > g.clientWidth + 1 && k.sel === '.seg') { g.scrollTo({ left: x - (g.clientWidth - w) / 2, behavior: reduced() ? 'auto' : 'smooth' }); }
  }
  function pillQueue(g, animate) { /* gộp nhiều tín hiệu trong cùng một khung hình thành một lần đo */
    var P = g._lxPill; if (!P) return; if (animate) P.anim = true;
    if (P.raf) return;
    P.raf = root.requestAnimationFrame(function () { P.raf = 0; var an = P.anim; P.anim = false; pillPlace(g, an); });
  }
  function enhancePill(g) {
    if (g._lxPill) return;
    var kind = PILL_KINDS.filter(function (k) { return g.matches(k.sel); })[0]; if (!kind) return;
    var ind = null;
    if (!ind) { ind = doc.createElement('span'); ind.className = 'lx-ind' + (kind.cls ? ' ' + kind.cls : ''); g.insertBefore(ind, g.firstChild); } 
    ind.setAttribute('aria-hidden', 'true');
    g._lx = 1; g._lxInd = ind;
    var P = g._lxPill = { kind: kind, ind: ind, x: null, w: 0, raf: 0, anim: false };
    pillSet.push(g);
    pillPlace(g, false);
    g.addEventListener('change', function () { pillQueue(g, true); });
    g.addEventListener('click', function () { pillQueue(g, true); }, true);
    if (root.MutationObserver) { P.mo = new MutationObserver(function (ms) { if (!ind.parentNode) g.insertBefore(ind, g.firstChild); if (P.ro) $$(kind.item, g).forEach(function (l) { P.ro.observe(l); }); pillQueue(g, ms.some(function (m) { return m.type === 'attributes'; })); }); P.mo.observe(g, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-current', 'aria-selected', 'checked', 'hidden'] }); }
    if ('ResizeObserver' in root) { P.ro = new ResizeObserver(function () { pillQueue(g, false); }); P.ro.observe(g); $$(kind.item, g).forEach(function (l) { P.ro.observe(l); }); }
    if ('IntersectionObserver' in root) { P.io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) pillQueue(g, false); }); P.io.observe(g); }
  }
  function enhanceSeg(seg) { enhancePill(seg); }
  /** lx.pill.refresh(root?, animate?) - đo lại mọi viên trượt trong root (đã tự động; gọi tay chỉ khi đổi DOM theo cách lạ) */
  lx.pill = {
    refresh: function (r, animate) { pillSet = pillSet.filter(function (g) { return g.isConnected; }); pillSet.forEach(function (g) { if (!r || r === doc || r.contains(g) || r === g) pillQueue(g, !!animate); }); },
    place: function (g, animate) { if (g._lxPill) pillPlace(g, !!animate); }
  };
  /* radio.checked = true gán bằng JS (EP.ui.segmented().set, EP.form.set, đồng bộ nút chọn giao diện) không phát sự kiện: bắt ở setter */
  try {
    var cd = Object.getOwnPropertyDescriptor(root.HTMLInputElement.prototype, 'checked');
    if (cd && cd.set && !cd.set._lx) {
      var cset = function (v) { cd.set.call(this, v); if (this.type === 'radio') { var g = this.closest && this.closest('.seg'); if (g && g._lxPill) pillQueue(g, true); } };
      cset._lx = 1; Object.defineProperty(root.HTMLInputElement.prototype, 'checked', { configurable: true, enumerable: cd.enumerable, get: cd.get, set: cset });
    }
  } catch (e) { /* bỏ qua */ }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { lx.pill.refresh(); });
  if (EP.bus) { EP.bus.on('theme', function () { root.requestAnimationFrame(function () { lx.pill.refresh(); }); }); EP.bus.on('route', function () { lx.pill.refresh(); }); }
  root.addEventListener('resize', function () { lx.pill.refresh(); });
  root.addEventListener('orientationchange', function () { setTimeout(function () { lx.pill.refresh(); }, 120); });

  /* ============ Ô nhập: bộ đếm, tự giãn, tiền ============ */
  function counterUpdate(inp) {
    var c = inp._lxCounter, max = Number(inp.getAttribute('data-max')), n = inp.value.length;
    if (!c || !max) return;
    c.textContent = n + '/' + max;
    c.classList.toggle('is-near', n >= max * 0.9 && n <= max);
    c.classList.toggle('is-over', n > max);
  }
  function grow(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, 320) + 'px'; }
  function money(inp) {
    var raw = inp.value, digits = raw.replace(/[^\d]/g, ''), caret = inp.selectionStart, before = raw.slice(0, caret == null ? raw.length : caret).replace(/[^\d]/g, '').length;
    var out = digits ? Number(digits).toLocaleString(LOC) : '';
    if (out === raw) return;
    inp.value = out;
    if (document.activeElement === inp && caret != null) { var pos = 0, seen = 0; while (pos < out.length && seen < before) { if (/\d/.test(out.charAt(pos))) seen++; pos++; } try { inp.setSelectionRange(pos, pos); } catch (e) { /* bỏ qua */ } }
  }
  lx.money = function (inp) { return inp ? (fmt.parse(inp.value) || 0) : 0; };
  function enhanceInput(inp) {
    if (inp._lx) return; inp._lx = 1;
    var field = inp.closest('.field');
    if (inp.hasAttribute('data-max') && field) {
      var c = doc.createElement('span'); c.className = 'lx-counter'; c.setAttribute('aria-hidden', 'true');
      field.appendChild(c); field.classList.add('lx-has-counter'); inp._lxCounter = c; counterUpdate(inp);
      inp.addEventListener('input', function () { counterUpdate(inp); });
    }
    if (inp.tagName === 'TEXTAREA' && !inp.hasAttribute('data-fixed')) { grow(inp); inp.addEventListener('input', function () { grow(inp); }); }
    if (inp.hasAttribute('data-lx-money')) {
      inp.setAttribute('inputmode', 'numeric'); if (!inp.placeholder) inp.placeholder = ' ';
      money(inp); inp.addEventListener('input', function () { money(inp); });
    }
  }

  /* ============ Hộp chọn tuỳ biến cho <select> ============ */
  var openBox = null;
  function closeBox(instant) {
    var b = openBox; if (!b) return; openBox = null;
    b.sel.setAttribute('aria-expanded', 'false'); b.sel.removeAttribute('aria-activedescendant');
    doc.removeEventListener('pointerdown', b.onDoc, true); root.removeEventListener('resize', b.onClose); doc.removeEventListener('scroll', b.onScroll, true);
    if (instant || reduced()) b.ul.remove(); else { b.ul.classList.add('is-out'); setTimeout(function () { b.ul.remove(); }, 160); }
  }
  function openSelect(sel) {
    if (openBox && openBox.sel === sel) { closeBox(); return; }
    closeBox(true);
    var opts = $$('option', sel).filter(function (o) { return !o.hidden && o.label !== ''; }), uid = EP.uid();
    if (!opts.length) return;
    var ul = doc.createElement('ul'); ul.className = 'lx-listbox'; ul.setAttribute('role', 'listbox'); ul.id = 'lb-' + uid;
    var act = Math.max(0, opts.findIndex(function (o) { return o.value === sel.value; }));
    ul.innerHTML = opts.map(function (o, i) { return '<li role="option" id="lb-' + uid + '-' + i + '" data-i="' + i + '" aria-selected="' + (o.value === sel.value) + '"' + (o.disabled ? ' aria-disabled="true"' : '') + '>' + esc(o.textContent) + '</li>'; }).join('');
    doc.body.appendChild(ul);
    var r = sel.getBoundingClientRect(), vh = root.innerHeight, h = Math.min(ul.scrollHeight, 280), below = vh - r.bottom, up = below < h + 16 && r.top > below;
    ul.style.width = r.width + 'px'; ul.style.left = Math.max(8, Math.min(r.left, root.innerWidth - r.width - 8)) + 'px';
    ul.style.maxHeight = Math.max(120, Math.min(280, (up ? r.top : below) - 14)) + 'px';
    if (up) { ul.style.bottom = (vh - r.top + 6) + 'px'; ul.style.setProperty('--lx-origin', '50% 100%'); } else ul.style.top = (r.bottom + 6) + 'px';
    sel.setAttribute('aria-expanded', 'true'); sel.setAttribute('aria-controls', ul.id);
    function mark(i) {
      act = (i + opts.length) % opts.length;
      $$('li', ul).forEach(function (li, k) { li.classList.toggle('is-active', k === act); });
      var li = ul.children[act]; sel.setAttribute('aria-activedescendant', li.id); if (li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
    }
    function choose(i) {
      var o = opts[i]; if (!o || o.disabled) return;
      var changed = sel.value !== o.value; sel.value = o.value; closeBox(); sel.focus();
      if (changed) { sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    var buf = '', bufT = 0;
    var box = openBox = {
      sel: sel, ul: ul, mark: mark, choose: choose,
      onDoc: function (e) { if (!ul.contains(e.target) && e.target !== sel) closeBox(); },
      onClose: function () { closeBox(true); },
      onScroll: function (e) { if (!ul.contains(e.target)) closeBox(true); },
      key: function (e) {
        var k = e.key;
        if (k === 'ArrowDown') mark(act + 1); else if (k === 'ArrowUp') mark(act - 1); else if (k === 'Home') mark(0); else if (k === 'End') mark(opts.length - 1);
        else if (k === 'Enter' || k === ' ') choose(act);
        else if (k === 'Escape' || k === 'Tab') { closeBox(); if (k === 'Escape') e.stopPropagation(); return; }
        else if (k.length === 1 && !e.ctrlKey && !e.metaKey) { clearTimeout(bufT); buf += k.toLowerCase(); bufT = setTimeout(function () { buf = ''; }, 700); var f = opts.findIndex(function (o) { return o.textContent.toLowerCase().indexOf(buf) === 0; }); if (f >= 0) mark(f); }
        else return;
        e.preventDefault();
      }
    };
    ul.addEventListener('pointermove', function (e) { var li = e.target.closest('li'); if (li) mark(Number(li.getAttribute('data-i'))); });
    ul.addEventListener('pointerdown', function (e) { e.preventDefault(); });
    ul.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) choose(Number(li.getAttribute('data-i'))); });
    doc.addEventListener('pointerdown', box.onDoc, true); root.addEventListener('resize', box.onClose); doc.addEventListener('scroll', box.onScroll, true);
    mark(act);
  }
  lx.select = function (sel) {
    if (!sel || sel._lxSel || sel.multiple || sel.size > 1 || sel.hasAttribute('data-native')) return; sel._lxSel = 1;
    sel.setAttribute('aria-haspopup', 'listbox'); sel.setAttribute('aria-expanded', 'false');
    sel.addEventListener('mousedown', function (e) { if (e.button || mq('(pointer: coarse)') || sel.disabled) return; e.preventDefault(); sel.focus(); openSelect(sel); });
    sel.addEventListener('keydown', function (e) {
      if (openBox && openBox.sel === sel) { openBox.key(e); return; }
      if (mq('(pointer: coarse)')) return;
      if (e.key === ' ' || e.key === 'Enter' || (e.altKey && e.key === 'ArrowDown')) { e.preventDefault(); openSelect(sel); }
    });
    sel.addEventListener('blur', function () { if (openBox && openBox.sel === sel) setTimeout(function () { if (openBox && openBox.sel === sel && doc.activeElement !== sel) closeBox(); }, 0); });
  };

  /* ============ Giữ để xác nhận ============ */
  /** lx.hold(btn, { ms: 900 }) - nút chỉ "bấm" khi giữ đủ ms (chuột, cảm ứng, giữ Enter/Space). Bấm lướt qua chỉ nhắc nhở. */
  lx.hold = function (btn, o) {
    o = o || {};
    if (!btn || btn._lxHold) return; btn._lxHold = 1;
    var ms = o.ms || 900, txt = o.label || btn.textContent.trim(), raf = 0, t0 = 0, parent = btn.parentNode;
    btn.classList.add('lx-hold'); btn.innerHTML = '<span class="lx-h-base">' + esc(txt) + '</span><span class="lx-h-fill" aria-hidden="true">' + esc(txt) + '</span>';
    btn.style.setProperty('--p', 0);
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / ms); btn.style.setProperty('--p', p);
      if (p >= 1) { raf = 0; btn.classList.remove('is-holding'); btn.classList.add('is-done'); btn._lxOk = true; try { btn.click(); } finally { btn._lxOk = false; } }
      else raf = root.requestAnimationFrame(tick);
    }
    function begin() { if (raf || btn.disabled) return; t0 = 0; btn.classList.add('is-holding'); raf = root.requestAnimationFrame(tick); }
    function cancel() { if (!raf) return; root.cancelAnimationFrame(raf); raf = 0; btn.classList.remove('is-holding'); btn.style.setProperty('--p', 0); }
    btn.addEventListener('pointerdown', function (e) { if (e.button > 0) return; begin(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); begin(); } });
    btn.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') cancel(); });
    btn.addEventListener('blur', cancel);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    parent.addEventListener('click', function (e) {
      if (!e.target.closest || e.target.closest('.lx-hold') !== btn || btn._lxOk) return;
      e.stopImmediatePropagation(); e.preventDefault();
      if (!raf && !reduced()) { btn.classList.remove('lx-nudge'); void btn.offsetWidth; btn.classList.add('lx-nudge'); setTimeout(function () { btn.classList.remove('lx-nudge'); }, 450); }
    }, true);
  };

  /* ============ Nghiêng 3D (chuột) ============ */
  var tiltEl = null, tiltRaf = 0;
  lx.tilt = function (card, on) { if (card) { if (on === false) card.removeAttribute('data-tilt'); else card.setAttribute('data-tilt', ''); } };
  function tiltReset(c) { if (c) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); } }
  doc.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || reduced()) return;
    var c = e.target.closest && e.target.closest('.card[data-tilt]');
    if (tiltEl && tiltEl !== c) { tiltReset(tiltEl); tiltEl = null; }
    if (!c) return;
    tiltEl = c; var x = e.clientX, y = e.clientY;
    if (tiltRaf) return;
    tiltRaf = root.requestAnimationFrame(function () {
      tiltRaf = 0; if (!tiltEl) return;
      var r = tiltEl.getBoundingClientRect(), px = (x - r.left) / r.width - .5, py = (y - r.top) / r.height - .5;
      tiltEl.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg'); tiltEl.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
    });
  }, { passive: true });

  /* ============ Nhãn cuộn + sao chép thành dấu tích ============ */
  function enhanceRoll(btn) {
    if (btn._lxRoll) return; btn._lxRoll = 1;
    var tn = null; for (var i = 0; i < btn.childNodes.length; i++) { var n = btn.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) { tn = n; break; } }
    if (!tn) return;
    var span = doc.createElement('span'), txt = tn.nodeValue.trim();
    span.className = 'lx-roll'; span.innerHTML = '<span class="lx-roll-a">' + esc(txt) + '</span><span class="lx-roll-b" aria-hidden="true">' + esc(txt) + '</span>';
    btn.replaceChild(span, tn);
  }
  function copyQuiet(text) {
    function fb() { var ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; doc.body.appendChild(ta); ta.select(); var r = false; try { r = doc.execCommand('copy'); } catch (e) { r = false; } ta.remove(); return r; }
    if (root.navigator.clipboard && root.isSecureContext) return root.navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fb(); });
    return Promise.resolve(fb());
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]'); if (!b || b.classList.contains('is-copied')) return;
    var src = b.getAttribute('data-copy'), text = src;
    if (/^[#.][\w-]/.test(src)) { var t = $(src); if (t) text = t.value != null && t.tagName !== 'DIV' ? t.value : t.textContent; }
    copyQuiet(text).then(function (ok) {
      if (!ok) { ui.toast('Không sao chép được, hãy chọn và copy thủ công.', { type: 'error' }); return; }
      var html = b.innerHTML, w = b.offsetWidth;
      b.style.minWidth = w + 'px'; b.classList.add('is-copied'); b.innerHTML = SVG_CHECK + '<span>' + esc(b.getAttribute('data-copied') || 'Đã chép') + '</span>';
      setTimeout(function () { b.classList.remove('is-copied'); b.innerHTML = html; b.style.minWidth = ''; }, 1700);
    });
  });

  /* ============ Vuốt để gạt toast ============ */
  (function () {
    var cur = null, sx = 0, sy = 0, dx = 0, t0 = 0, moved = false;
    doc.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('.toasts .toast'); if (!t || e.target.closest('button')) return;
      cur = t; sx = e.clientX; sy = e.clientY; dx = 0; t0 = e.timeStamp; moved = false;
    });
    doc.addEventListener('pointermove', function (e) {
      if (!cur) return;
      var mx = e.clientX - sx; if (!moved && Math.abs(mx) < 6) return;
      if (!moved && Math.abs(e.clientY - sy) > Math.abs(mx)) { cur = null; return; }
      moved = true; dx = mx; cur.classList.add('is-drag');
      try { cur.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
      cur.style.setProperty('--tx', dx + 'px'); cur.style.setProperty('--rot', (dx / 28).toFixed(2) + 'deg');
    });
    function end(e) {
      if (!cur) return; var t = cur; cur = null; if (!moved) return;
      t.classList.remove('is-drag');
      var v = Math.abs(dx) / Math.max(1, e.timeStamp - t0);
      if (Math.abs(dx) > 90 || v > .6) {
        t.classList.add('lx-fly'); t.style.setProperty('--tx', (dx > 0 ? 130 : -130) + '%');
        var x = $('[data-t-x]', t); setTimeout(function () { if (x) x.click(); else t.remove(); }, reduced() ? 0 : 260);
      } else { t.style.setProperty('--tx', '0px'); t.style.setProperty('--rot', '0deg'); }
    }
    doc.addEventListener('pointerup', end); doc.addEventListener('pointercancel', end);
  })();

  /* ============ Bọc API ui ============ */
  var toast0 = ui.toast;
  ui.toast = function (msg, o) {
    var close = toast0.apply(this, arguments), host = doc.getElementById('toasts'), t = host && host.lastElementChild;
    if (t) t.style.setProperty('--lx-life', ((o && o.duration) || (o && o.type === 'error' ? 6500 : 3800)) + 'ms');
    return close;
  };
  Object.keys(toast0).forEach(function (k) { ui.toast[k] = toast0[k]; });

  var holdNext = null, dlg0 = ui.dialog;
  ui.dialog = function (o) {
    var hold = holdNext; holdNext = null;
    var api = dlg0.apply(this, arguments), el = api.el, close0 = api.close, closing = false;
    api.close = function (v) {
      if (closing) return; closing = true;
      if (reduced() || !el.open) return close0(v);
      el.classList.add('lx-out'); setTimeout(function () { close0(v); }, 210);
    };
    el.addEventListener('cancel', function (e) { e.preventDefault(); api.close(undefined); });
    if (hold) {
      var ok = $('#confirm-ok', el);
      if (ok) {
        var label = ok.textContent.trim();
        lx.hold(ok, { ms: hold, label: 'Giữ để ' + label.charAt(0).toLowerCase() + label.slice(1) });
        var hint = doc.createElement('p'); hint.className = 'lx-hold-hint'; hint.id = 'lx-hold-' + EP.uid();
        hint.textContent = 'Nhấn và giữ nút khoảng ' + (hold / 1000).toLocaleString(LOC, { maximumFractionDigits: 1 }) + ' giây để xác nhận (bàn phím: giữ Enter hoặc Space).';
        api.body.appendChild(hint); ok.setAttribute('aria-describedby', hint.id);
      }
    }
    return api;
  };
  var confirm0 = ui.confirm;
  ui.confirm = function (o) { holdNext = o && o.hold ? (o.hold === true ? 900 : Number(o.hold)) : null; try { return confirm0.apply(this, arguments); } finally { holdNext = null; } };

  var table0 = ui.table;
  ui.table = function (el, o) {
    if (o && o.sticky) el.setAttribute('data-lx-sticky', '');
    if (o && o.cards === false) el.setAttribute('data-lx-cards', 'off');
    return table0.apply(this, arguments);
  };

  /* ============ Quét và nâng cấp DOM (idempotent) ============ */
  function enhance(r) {
    r = r || doc;
    all(r, '.seg, .bnav, .tabs, [role="tablist"]').forEach(enhancePill);
    all(r, '.field input, .field textarea, input[data-lx-money]').forEach(enhanceInput);
    all(r, 'select.input').forEach(lx.select);
    all(r, '.btn-cta, .btn[data-roll]').forEach(enhanceRoll);
    all(r, '.kpi-value, [data-countup], .score-big').forEach(queueCount);
    all(r, '.table-wrap').forEach(function (w) {
      if (w._lxC) return; w._lxC = 1;
      if (w.parentNode && w.parentNode.getAttribute('data-lx-cards') === 'off') return;
      if (w.querySelector('td[data-label]')) w.classList.add('lx-cards');
    });
    all(r, '.chart svg').forEach(function (s) {
      if (s._lx) return; s._lx = 1;
      var ln = $('.ch-line', s); if (ln) ln.setAttribute('pathLength', '1');
      $$(':scope > path[style*="opacity"]', s).forEach(function (p) { p.classList.add('ch-area'); });
      $$('.ch-dot', s).forEach(function (d, i) { d.style.animationDelay = (ln ? 500 + i * 45 : i * 40) + 'ms'; });
    });
  }
  lx.enhance = enhance;
  /** lx.refresh(root) - gọi sau khi đổi giá trị bằng JS (EP.form.set/reset đã tự gọi): đếm ký tự, giãn textarea, tiền, viên trượt */
  lx.refresh = function (r) {
    r = r || doc;
    $$('input[data-max], textarea[data-max]', r).forEach(counterUpdate);
    $$('textarea.input', r).forEach(function (t) { if (t._lx && !t.hasAttribute('data-fixed')) grow(t); });
    $$('input[data-lx-money]', r).forEach(money);
    lx.pill.refresh(r, true);
  };
  var pending = [], sched = 0;
  function flush() { sched = 0; var list = pending; pending = []; list.forEach(function (n) { if (n.isConnected) enhance(n); }); }
  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      if (m.type === 'attributes') {
        if (m.attributeName === 'data-invalid' && m.oldValue == null && m.target.hasAttribute('data-invalid')) lx.shake(m.target);
        return;
      }
      m.addedNodes.forEach(function (n) { if (n.nodeType === 1) pending.push(n); });
    });
    if (pending.length && !sched) sched = root.requestAnimationFrame(flush);
  });
  mo.observe(doc.body || doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-invalid'], attributeOldValue: true });

  doc.addEventListener('submit', function (e) { var f = e.target; setTimeout(function () { if (f && f.querySelectorAll) f.querySelectorAll('[data-invalid]').forEach(lx.shake); }, 0); }, true);
  doc.addEventListener('reset', function (e) { setTimeout(function () { lx.refresh(e.target); }, 0); }, true);
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openBox) closeBox(); });

  /* Nút giao diện: biểu tượng xoay vào ngay khi bấm (hiệu ứng loang 650ms ở core.js giữ nguyên) */
  var tb = doc.getElementById('btn-theme');
  if (tb) {
    var spinT = 0;
    tb.addEventListener('click', function () { if (reduced()) return; tb.classList.add('lx-spin'); clearTimeout(spinT); spinT = setTimeout(function () { tb.classList.remove('lx-spin'); }, 1300); });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { enhance(doc); }); else enhance(doc);
})(window);
