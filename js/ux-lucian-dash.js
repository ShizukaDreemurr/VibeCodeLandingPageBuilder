/* ux-lucian-dash.js — thành phần bảng điều khiển chuyển thể từ Lucian Lab UI (MIT, © 2026 Seokwoooo)
   cho "Sự kiện của tôi" và "Danh sách đăng ký". EP.dash: odometer, rings, minis, spark, glow, overview, table.
   Mọi màu lấy từ token của app; hoạt ảnh tắt khi EP.motion.reduce() (prefers-reduced-motion / html.motion-off). */
(function (root) {
  var EP = root.EP = root.EP || {};
  var dash = EP.dash = EP.dash || {};
  var doc = root.document;
  var NS = 'http://www.w3.org/2000/svg';
  function reduced() { return EP.motion ? EP.motion.reduce() : false; }
  function h(tag, cls, html) { var n = doc.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function sv(tag, attrs) { var n = doc.createElementNS(NS, tag); if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function fmt(n) { return Number(n).toLocaleString('vi-VN'); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  // Chạy hàm f(t:0..1) theo thời gian; trả về hàm huỷ. Giảm chuyển động: nhảy thẳng tới cuối.
  function tween(dur, f, done) {
    if (reduced()) { f(1); if (done) done(); return function () {}; }
    var t0 = performance.now(), id = 0, dead = false;
    (function step(n) {
      if (dead) return;
      var t = Math.min(1, (n - t0) / dur);
      f(t);
      if (t < 1) id = requestAnimationFrame(step); else if (done) done();
    })(t0);
    return function () { dead = true; cancelAnimationFrame(id); };
  }
  dash.tween = tween; dash.fmt = fmt;

  // ---------- Odometer: mỗi chữ số là một cột 0-9 cuộn riêng (Lucian 098 KPI count-up, 059 event RSVP card; MIT © 2026 Seokwoooo) ----------
  function odometer(host, n) {
    n = Math.max(0, Math.round(Number(n) || 0));
    var str = fmt(n);
    host.classList.add('xl-od');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', str);
    var shape = String(host._shape || '');
    var nshape = str.replace(/\d/g, '0');
    if (shape !== nshape) {
      host.innerHTML = '';
      str.split('').forEach(function (ch, i) {
        var s;
        if (/\d/.test(ch)) {
          s = h('span', 'xl-od-col'); s.setAttribute('aria-hidden', 'true');
          s.style.setProperty('--d', 0); s.style.setProperty('--i', i);
          for (var k = 0; k < 10; k++) s.appendChild(h('i', null, String(k)));
        } else { s = h('span', 'xl-od-sym', esc(ch)); s.setAttribute('aria-hidden', 'true'); }
        host.appendChild(s);
      });
      void host.offsetWidth;
      host._shape = nshape;
    }
    var cols = host.querySelectorAll('.xl-od-col'), j = 0;
    str.split('').forEach(function (ch) { if (/\d/.test(ch)) cols[j++].style.setProperty('--d', ch); });
  }
  dash.odometer = odometer;

  // ---------- Vòng hoạt động nhiều lớp, vượt 100% thì vòng thứ hai chạy tiếp (Lucian 099 activity rings; MIT © 2026 Seokwoooo) ----------
  // items: [{label, color, value, goal, text, sub}] → p = value / goal. Trả về {update(items)}.
  function rings(host, items, o) {
    o = o || {};
    host.innerHTML = '';
    host.classList.add('xl-rings-w');
    var SW = 16, RADII = [70, 51, 32];
    var svg = sv('svg', { 'class': 'xl-rg', viewBox: '0 0 164 164', 'aria-hidden': 'true' });
    var lg = h('div', 'xl-lg'); lg.setAttribute('role', 'group'); lg.setAttribute('aria-label', o.ariaLabel || 'Chỉ số');
    var rs = items.map(function (it, i) {
      var g = sv('g', { 'class': 'xl-r' }), rad = RADII[i] || 20, C = 2 * Math.PI * rad;
      g.style.setProperty('--c', it.color);
      ['t', 'a', 'b'].forEach(function (c) { g.appendChild(sv('circle', { 'class': c, cx: 82, cy: 82, r: rad, 'stroke-width': SW, 'stroke-dasharray': c === 't' ? '' : '0 ' + C })); });
      g.appendChild(sv('circle', { 'class': 'cap', r: SW / 2 }));
      svg.appendChild(g);
      return { g: g, r: rad, C: C, a: g.querySelector('.a'), b: g.querySelector('.b'), cap: g.querySelector('.cap'), p: 0 };
    });
    var btns = items.map(function (it, i) {
      var b = h('button', 'xl-it'); b.type = 'button'; b.style.setProperty('--c', it.color);
      b.innerHTML = '<small><i aria-hidden="true"></i><span></span></small><b></b><em></em>';
      b.addEventListener('pointerenter', function () { hi(i); });
      b.addEventListener('focus', function () { hi(i); });
      b.addEventListener('pointerleave', function () { if (doc.activeElement !== b) hi(-1); });
      b.addEventListener('blur', function () { hi(-1); });
      lg.appendChild(b);
      return b;
    });
    function hi(i) {
      host.classList.toggle('has', i >= 0);
      rs.forEach(function (r, k) { r.g.classList.toggle('on', k === i); });
      btns.forEach(function (b, k) { b.classList.toggle('on', k === i); });
    }
    function draw(r, p) {
      var a = Math.min(p, 1), b = Math.max(0, Math.min(p - 1, 1));
      r.a.setAttribute('stroke-dasharray', (a * r.C).toFixed(2) + ' ' + r.C.toFixed(2));
      r.b.setAttribute('stroke-dasharray', (b * r.C).toFixed(2) + ' ' + r.C.toFixed(2));
      r.b.style.display = b > 0 ? '' : 'none';
      // Điểm đầu vòng: bắt đầu ở 12 giờ (svg đã xoay -90°), nên dùng góc tương đối
      var ang = p * Math.PI * 2;
      r.cap.setAttribute('cx', (82 + Math.cos(ang) * r.r).toFixed(2)); r.cap.setAttribute('cy', (82 + Math.sin(ang) * r.r).toFixed(2));
      r.g.classList.toggle('over', p > 1.02);
      r.g.classList.toggle('on0', p > 0.001);
    }
    var cancel = function () {};
    function update(next, instant) {
      items = next;
      var from = rs.map(function (r) { return r.p; });
      var to = items.map(function (it) { return it.goal ? it.value / it.goal : 0; });
      items.forEach(function (it, i) {
        btns[i].querySelector('span').textContent = it.label;
        btns[i].querySelector('b').innerHTML = esc(it.text);
        btns[i].querySelector('em').textContent = it.sub || '';
        btns[i].setAttribute('aria-label', it.label + ': ' + it.text + (it.sub ? ', ' + it.sub : ''));
      });
      cancel();
      cancel = tween(instant ? 1 : 1100, function (t) {
        rs.forEach(function (r, k) {
          var tt = Math.max(0, Math.min(1, (t * 1100 - k * 110) / 1100)), p = from[k] + (to[k] - from[k]) * easeOut(instant ? t : tt);
          if (r.p < 1 && p >= 1 && !reduced()) { r.g.classList.remove('fl'); void r.g.getBoundingClientRect(); r.g.classList.add('fl'); }
          r.p = p; draw(r, p);
        });
      });
    }
    var top = h('div', 'xl-rg-top'); top.appendChild(svg); top.appendChild(lg);
    host.appendChild(top);
    rs.forEach(function (r) { draw(r, 0); });
    update(items);
    return { update: update };
  }
  dash.rings = rings;

  // Dải vòng nhỏ chọn từng mục, phím mũi tên di chuyển (Lucian 099 activity rings, dải 7 ngày; MIT © 2026 Seokwoooo)
  // items: [{label, fracs:[0..1], aria}] ; onPick(index)
  function minis(host, items, onPick) {
    host.innerHTML = '';
    host.classList.add('xl-mi');
    host.setAttribute('role', 'group');
    var bs = items.map(function (it, i) {
      var b = h('button', 'xl-d'); b.type = 'button'; b.setAttribute('aria-label', it.aria || it.label);
      b.tabIndex = i === 0 ? 0 : -1;
      var s = sv('svg', { viewBox: '0 0 30 30', 'aria-hidden': 'true' });
      it.fracs.forEach(function (f, k) {
        var rad = [13, 9, 5][k], C = 2 * Math.PI * rad;
        s.appendChild(sv('circle', { 'class': 't', cx: 15, cy: 15, r: rad }));
        s.appendChild(sv('circle', { 'class': 'v', cx: 15, cy: 15, r: rad, 'stroke-dasharray': (Math.min(1, f) * C).toFixed(2) + ' ' + C.toFixed(2) }));
      });
      b.appendChild(s); b.appendChild(h('span', null, esc(it.label)));
      b.addEventListener('click', function () { onPick(i); });
      host.appendChild(b);
      return b;
    });
    host.addEventListener('keydown', function (e) {
      var j = bs.indexOf(doc.activeElement); if (j < 0) return;
      var to = e.key === 'ArrowRight' ? j + 1 : e.key === 'ArrowLeft' ? j - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : null;
      if (to === null) return;
      e.preventDefault(); to = Math.max(0, Math.min(bs.length - 1, to));
      bs.forEach(function (b, k) { b.tabIndex = k === to ? 0 : -1; }); bs[to].focus();
    });
  }
  dash.minis = minis;

  // ---------- Đường xu hướng có đầu chấm, chuyển hình khi đổi chỉ số (Lucian 098 KPI count-up; MIT © 2026 Seokwoooo) ----------
  function spark(host, o) {
    o = o || {};
    var W = 340, H = 112, uid = 'xs' + Math.random().toString(36).slice(2, 7);
    host.innerHTML = '';
    host.classList.add('xl-sp');
    var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', preserveAspectRatio: 'none' });
    var defs = sv('defs'), gd = sv('linearGradient', { id: uid, x1: 0, y1: 0, x2: 0, y2: 1 });
    gd.appendChild(sv('stop', { offset: 0, 'stop-opacity': 0.28 })); gd.appendChild(sv('stop', { offset: 1, 'stop-opacity': 0 }));
    defs.appendChild(gd); svg.appendChild(defs);
    var ar = sv('path', { 'class': 'xl-ar', fill: 'url(#' + uid + ')' }), ln = sv('path', { 'class': 'xl-ln' });
    var cur = sv('line', { 'class': 'xl-cur', y1: 0, y2: H }), hd = h('span', 'xl-hd');
    svg.appendChild(ar); svg.appendChild(ln); svg.appendChild(cur);
    host.appendChild(svg); host.appendChild(hd);
    var tag = h('span', 'xl-sp-tag'); tag.hidden = true; host.appendChild(tag);
    var vals = [], ys = [], cancel = function () {}, STEP = 0;
    function Y(v, mx) { return 10 + (1 - (mx ? v / mx : 0)) * (H - 22); }
    function paint() {
      var n = ys.length; if (!n) return;
      STEP = n > 1 ? (W - 10) / (n - 1) : 0;
      var p = ys.map(function (y, i) { return (i ? 'L' : 'M') + (i * STEP).toFixed(1) + ' ' + y.toFixed(1); }).join('');
      ln.setAttribute('d', p); ar.setAttribute('d', p + 'L' + ((n - 1) * STEP).toFixed(1) + ' ' + (H + 4) + 'L0 ' + (H + 4) + 'Z');
      hd.style.left = (((n - 1) * STEP) / W * 100).toFixed(2) + '%'; hd.style.top = (ys[n - 1] / H * 100).toFixed(2) + '%';
    }
    function set(values, animate) {
      vals = values.slice();
      var mx = Math.max.apply(null, vals.concat([1]));
      var to = vals.map(function (v) { return Y(v, mx); });
      var from = ys.length === to.length ? ys.slice() : to.map(function () { return H - 6; });
      cancel();
      if (!animate) { ys = to; paint(); return; }
      cancel = tween(650, function (t) { var e = easeIO(t); ys = from.map(function (y, i) { return y + (to[i] - y) * e; }); paint(); });
    }
    function at(e) {
      var r = svg.getBoundingClientRect(); if (!vals.length) return;
      var i = Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (vals.length - 1));
      cur.setAttribute('x1', i * STEP); cur.setAttribute('x2', i * STEP); host.classList.add('scrub');
      tag.hidden = false; tag.textContent = (o.tip ? o.tip(i, vals[i], vals.length) : fmt(vals[i]));
      var px = i * STEP / W * r.width, tw = tag.offsetWidth;
      tag.style.transform = 'translateX(' + Math.max(2, Math.min(r.width - tw - 2, px - tw / 2)).toFixed(0) + 'px)';
    }
    host.addEventListener('pointermove', at);
    host.addEventListener('pointerleave', function () { host.classList.remove('scrub'); tag.hidden = true; });
    return { set: set };
  }
  dash.spark = spark;

  // ---------- Viền phát sáng theo con trỏ trên nhiều thẻ cùng lúc (Lucian 228 glow-border cards; MIT © 2026 Seokwoooo) ----------
  function glow(container, cardSel) {
    if (!container || container._glow) return;
    container._glow = true;
    container.classList.add('xl-glow');
    function apply(e, o) {
      container.querySelectorAll(cardSel).forEach(function (c) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--cx', (e.clientX - r.left).toFixed(0) + 'px');
        c.style.setProperty('--cy', (e.clientY - r.top).toFixed(0) + 'px');
        c.style.setProperty('--xl-o', o);
      });
    }
    container.addEventListener('pointermove', function (e) { apply(e, 1); });
    container.addEventListener('pointerleave', function () { container.querySelectorAll(cardSel).forEach(function (c) { c.style.setProperty('--xl-o', 0); }); });
  }
  dash.glow = glow;

  // ---------- Vòng tròn nhỏ một lớp cho thẻ (từ 099) ----------
  dash.ringSvg = function (frac, size) {
    var C = 2 * Math.PI * 15, s = sv('svg', { 'class': 'xl-rs', viewBox: '0 0 36 36', width: size || 44, height: size || 44, 'aria-hidden': 'true' });
    s.appendChild(sv('circle', { 'class': 't', cx: 18, cy: 18, r: 15 }));
    var a = sv('circle', { 'class': 'a', cx: 18, cy: 18, r: 15, 'stroke-dasharray': '0 ' + C.toFixed(2) });
    s.appendChild(a);
    s._set = function (f) {
      f = Math.max(0, Math.min(1, f || 0));
      var from = s._f || 0; s._f = f;
      tween(800, function (t) { var v = from + (f - from) * easeOut(t); a.setAttribute('stroke-dasharray', (v * C).toFixed(2) + ' ' + C.toFixed(2)); });
      s.classList.toggle('full', f >= 0.999);
    };
    s._set(frac);
    return s;
  };

  // ---------- Khối tổng quan: KPI có đường xu hướng + vòng + dải vòng nhỏ ----------
  // cfg: { title, live, metrics:[{key,name,total,series:[..14],unit,delta}], rings:[...], miniTitle, minis:[...], onMini, ringsTitle, summary }
  function overview(host, cfg) {
    var sig = JSON.stringify([cfg.title, cfg.metrics.map(function (m) { return [m.key, m.total, m.series]; }), cfg.rings.map(function (r) { return [r.value, r.goal]; }), cfg.minis.map(function (m) { return m.fracs; })]);
    if (host._sig === sig) return;
    var first = !host._built;
    host._sig = sig;
    if (first) {
      host._built = true;
      host.classList.add('xl-ov');
      host.innerHTML =
        '<section class="xl-card xl-kpi" aria-label="Số liệu chính">' +
          '<div class="xl-kh"><span class="xl-live" aria-hidden="true"></span><span class="xl-kt"></span></div>' +
          '<div class="xl-big"><span class="xl-bigv"></span><span class="xl-bigu"></span></div>' +
          '<div class="xl-dl"><span class="xl-bd"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1.5L9 7.5H1z"/></svg><b></b></span><span class="xl-dt"></span></div>' +
          '<div class="xl-spw"></div><div class="xl-tabs" role="group" aria-label="Chỉ số"></div>' +
        '</section>' +
        '<section class="xl-card xl-ringc" aria-label="Tổng quan dạng vòng">' +
          '<div class="xl-rh"><b class="xl-rt"></b><span class="xl-rs2"></span></div><div class="xl-rw"></div>' +
          '<div class="xl-mih"></div><div class="xl-mw"></div><p class="xl-sum"></p>' +
        '</section>';
      host._sp = spark(host.querySelector('.xl-spw'), { tip: function (i, v, n) { return fmt(v) + ' · ' + (host._cur && host._cur.tipLabel ? host._cur.tipLabel(i, n) : ''); } });
      host._k = 0;
    }
    host.classList.toggle('is-live', !!cfg.live);
    host.querySelector('.xl-kt').textContent = cfg.title;
    var tabs = host.querySelector('.xl-tabs');
    if (host._k >= cfg.metrics.length) host._k = 0;
    function show(k, anim) {
      host._k = k;
      var m = host._cur = cfg.metrics[k];
      var bigv = host.querySelector('.xl-bigv');
      odometer(bigv, m.total);
      host.querySelector('.xl-bigu').textContent = m.unit || '';
      var bd = host.querySelector('.xl-bd'), d = m.delta || { v: 0, text: '' };
      bd.classList.toggle('dn', d.v < 0); bd.classList.toggle('flat', d.v === 0);
      bd.querySelector('b').textContent = d.text;
      host.querySelector('.xl-dt').textContent = m.deltaNote || '';
      host._sp.set(m.series, anim);
      Array.prototype.forEach.call(tabs.children, function (b, i) { b.setAttribute('aria-pressed', String(i === k)); });
    }
    tabs.innerHTML = '';
    cfg.metrics.forEach(function (m, i) {
      var b = h('button', 'xl-tb'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<small></small><b></b>'; b.querySelector('small').textContent = m.name; b.querySelector('b').textContent = fmt(m.total);
      b.addEventListener('click', function () { if (i !== host._k) { odometerReset(host.querySelector('.xl-bigv')); show(i, true); } });
      tabs.appendChild(b);
    });
    function odometerReset(el) { el._shape = ''; }
    show(host._k, !first || true);
    host.querySelector('.xl-rt').textContent = cfg.ringsTitle || 'Tổng quan';
    host.querySelector('.xl-rs2').textContent = cfg.ringsNote || '';
    if (!host._rg) host._rg = rings(host.querySelector('.xl-rw'), cfg.rings, { ariaLabel: cfg.ringsTitle }); else host._rg.update(cfg.rings);
    var mih = host.querySelector('.xl-mih'), mw = host.querySelector('.xl-mw');
    mih.textContent = cfg.minis.length ? cfg.miniTitle || '' : '';
    mw.hidden = !cfg.minis.length;
    if (cfg.minis.length) minis(mw, cfg.minis, cfg.onMini || function () {});
    host.querySelector('.xl-sum').innerHTML = cfg.summary || '';
  }
  dash.overview = overview;

  // Gom đăng ký theo ngày (n ngày gần nhất, tính tới hôm nay) cho đường xu hướng
  dash.daily = function (regs, n, pred, end) {
    var out = [], base = end ? new Date(end) : new Date(); base.setHours(0, 0, 0, 0);
    for (var i = 0; i < n; i++) out.push(0);
    regs.forEach(function (r) {
      if (pred && !pred(r)) return;
      var d = new Date(r.createdAt); if (isNaN(d)) return;
      d.setHours(0, 0, 0, 0);
      var k = Math.round((base - d) / 86400000);
      if (k >= 0 && k < n) out[n - 1 - k]++;
    });
    return out;
  };
  dash.delta = function (series) {
    var n = series.length, w = Math.floor(n / 2), a = 0, b = 0;
    for (var i = 0; i < w; i++) { b += series[i]; a += series[n - w + i]; }
    var diff = a - b;
    return { v: diff, text: (diff > 0 ? '+' : diff < 0 ? '−' : '') + Math.abs(diff), note: 'so với ' + w + ' ngày trước đó' };
  };

  // ---------- Bảng đăng ký: tiêu đề sắp xếp, chip lọc, tìm kiếm, dòng mới sáng lên, dòng trượt về chỗ (Lucian 227 live orders table; MIT © 2026 Seokwoooo) ----------
  var tstate = { evId: null, status: 'all', lead: 'all', q: '', sort: { k: 'stt', d: 1 }, seen: {} };
  function table(wrap, evId) {
    if (!wrap) return;
    var tb = wrap.querySelector('tbody'), t = wrap.querySelector('table');
    if (tstate.evId !== evId) { tstate = { evId: evId, status: 'all', lead: 'all', q: '', sort: { k: 'stt', d: 1 }, seen: null }; }
    var rows = Array.prototype.slice.call(tb.querySelectorAll('tr[data-rid]'));
    // dòng mới (đăng ký tới sau lần vẽ đầu) sáng lên
    var first = tstate.seen === null; if (first) tstate.seen = {};
    rows.forEach(function (tr) {
      if (!first && !tstate.seen[tr.dataset.rid] && !reduced()) tr.classList.add('is-new');
      tstate.seen[tr.dataset.rid] = 1;
    });
    var bar = wrap.querySelector('.xl-tbar');
    if (!bar) {
      bar = h('div', 'xl-tbar');
      bar.innerHTML =
        '<div class="xl-tbar-top"><b class="xl-tcount" aria-live="polite"></b>' +
        '<label class="xl-tsearch"><span class="sr-only">Tìm trong danh sách</span><input type="search" placeholder="Tìm tên, số điện thoại, email" autocomplete="off"></label></div>' +
        '<div class="xl-chips" role="group" aria-label="Lọc theo trạng thái" data-g="status"></div>' +
        '<div class="xl-chips" role="group" aria-label="Lọc theo chăm sóc" data-g="lead"></div>';
      wrap.insertBefore(bar, wrap.firstChild);
      var STATUS = [['all', 'Tất cả'], ['new', 'Đã đăng ký'], ['waitlist', 'Danh sách chờ']];
      var LEAD = [['all', 'Mọi chăm sóc'], ['new', 'Mới'], ['contacted', 'Đã liên hệ'], ['won', 'Chốt tham dự'], ['lost', 'Huỷ']];
      function chips(g, list, key) {
        var box = bar.querySelector('[data-g=' + g + ']');
        list.forEach(function (c) {
          var b = h('button', 'xl-chip'); b.type = 'button'; b.setAttribute('data-v', c[0]);
          b.innerHTML = '<span></span><em></em>'; b.querySelector('span').textContent = c[1];
          b.addEventListener('click', function () { tstate[key] = c[0]; apply(); });
          box.appendChild(b);
        });
      }
      chips('status', STATUS, 'status'); chips('lead', LEAD, 'lead');
      bar.querySelector('input').addEventListener('input', function (e) { tstate.q = e.target.value; apply(); });
      // tiêu đề cột có nút sắp xếp
      var heads = t.querySelectorAll('thead th'), keys = { 0: 'stt', 1: 'name', 4: 'ts', 5: 'status' };
      Array.prototype.forEach.call(heads, function (th, i) {
        if (!keys[i]) return;
        var lab = th.textContent, b = h('button', 'xl-th'); b.type = 'button'; b.setAttribute('data-k', keys[i]);
        b.innerHTML = '<span></span><svg viewBox="0 0 9 9" aria-hidden="true"><path d="M2 3.5l2.5 2.5L7 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        b.firstChild.textContent = lab; th.textContent = ''; th.appendChild(b);
        b.addEventListener('click', function () { var s = tstate.sort; tstate.sort = { k: keys[i], d: s.k === keys[i] ? -s.d : 1 }; apply(true); });
      });
    }
    function val(tr, k) {
      if (k === 'name') return tr.dataset.name || '';
      if (k === 'ts') return +tr.dataset.ts || 0;
      if (k === 'status') return tr.dataset.status || '';
      return +tr.dataset.i || 0;
    }
    function apply(slide) {
      var list = Array.prototype.slice.call(tb.querySelectorAll('tr[data-rid]'));
      var q = tstate.q.trim().toLowerCase();
      var tops = {};
      if (slide && !reduced()) list.forEach(function (tr) { tops[tr.dataset.rid] = tr.getBoundingClientRect().top; });
      var shown = 0;
      list.forEach(function (tr) {
        var sel = tr.querySelector('.lead-select'), lead = sel ? sel.value : 'new';
        var ok = (tstate.status === 'all' || tr.dataset.status === tstate.status) && (tstate.lead === 'all' || lead === tstate.lead) &&
          (!q || (tr.dataset.name + ' ' + tr.dataset.phone + ' ' + tr.dataset.email).toLowerCase().indexOf(q) >= 0);
        tr.hidden = !ok; if (ok) shown++;
      });
      var s = tstate.sort;
      list.sort(function (a, b) {
        var x = val(a, s.k), y = val(b, s.k), c = typeof x === 'string' ? x.localeCompare(y, 'vi') : x - y;
        return (c || (+a.dataset.i - +b.dataset.i)) * s.d;
      });
      list.forEach(function (tr) { tb.appendChild(tr); });
      if (slide && !reduced()) list.forEach(function (tr) {
        if (tr.hidden || tops[tr.dataset.rid] == null || !tr.animate) return;
        var dy = tops[tr.dataset.rid] - tr.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) tr.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.3,1.1,.4,1)' });
      });
      bar.querySelector('.xl-tcount').textContent = shown === list.length ? list.length + ' đăng ký' : shown + ' / ' + list.length + ' đăng ký';
      // đếm trên chip
      var cnt = { status: {}, lead: {} };
      list.forEach(function (tr) {
        var sel = tr.querySelector('.lead-select'), lead = sel ? sel.value : 'new';
        cnt.status.all = (cnt.status.all || 0) + 1; cnt.status[tr.dataset.status] = (cnt.status[tr.dataset.status] || 0) + 1;
        cnt.lead.all = (cnt.lead.all || 0) + 1; cnt.lead[lead] = (cnt.lead[lead] || 0) + 1;
      });
      ['status', 'lead'].forEach(function (g) {
        bar.querySelectorAll('[data-g=' + g + '] .xl-chip').forEach(function (b) {
          var v = b.getAttribute('data-v'); b.setAttribute('aria-pressed', String(tstate[g] === v)); b.querySelector('em').textContent = cnt[g][v] || 0;
        });
      });
      bar.querySelectorAll('.xl-th').forEach(function (b) { b.setAttribute('aria-sort', s.k === b.getAttribute('data-k') ? (s.d > 0 ? 'ascending' : 'descending') : 'none'); });
      var none = wrap.querySelector('.xl-none');
      if (!list.length) { if (none) none.remove(); return; }
      if (!shown) { if (!none) { none = h('p', 'xl-none', 'Không có đăng ký nào khớp bộ lọc.'); wrap.appendChild(none); } } else if (none) none.remove();
    }
    bar.querySelector('input').value = tstate.q;
    bar.hidden = !rows.length;
    apply(false);
    // chăm sóc đổi → đếm chip cập nhật
    rows.forEach(function (tr) { var sel = tr.querySelector('.lead-select'); if (sel && !sel._xl) { sel._xl = 1; sel.addEventListener('change', function () { apply(false); }); } });
  }
  dash.table = table;
})(window);
