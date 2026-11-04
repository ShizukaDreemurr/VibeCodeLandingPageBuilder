/*
 * charts.js — biểu đồ SVG thuần cho tab "Danh sách đăng ký" (không dùng thư viện ngoài).
 * EP.charts: lineChart, barChart, donutChart, horizontalBars (vẽ vào một phần tử), analyze (tính số liệu),
 * renderSummary (dựng cả lưới thẻ "Tóm tắt"). Mọi biểu đồ có <title>, role="img", aria-label và bảng số liệu thay thế (<details>).
 * Hoạt ảnh nằm ở css/app.css (lớp .ch-*), tắt khi html.motion-off.
 */
(function (root) {
  var NS = 'http://www.w3.org/2000/svg';
  var doc = root.document;
  var PALETTE = ['var(--accent)', 'var(--text)', 'color-mix(in srgb, var(--text) 50%, var(--surface))', 'color-mix(in srgb, var(--accent) 50%, var(--surface))', 'color-mix(in srgb, var(--text) 28%, var(--surface))', 'color-mix(in srgb, var(--accent) 25%, var(--surface))'];

  // Đầu số di động Việt Nam → nhà mạng (3 chữ số đầu, tính cả số 0)
  var CARRIER_PREFIX = {
    'Viettel': ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
    'Vinaphone': ['088', '091', '094', '081', '082', '083', '084', '085'],
    'Mobifone': ['089', '090', '093', '070', '076', '077', '078', '079'],
    'Vietnamobile': ['092', '056', '058'],
    'Gmobile': ['099', '059']
  };
  var CARRIER_OF = {};
  Object.keys(CARRIER_PREFIX).forEach(function (n) { CARRIER_PREFIX[n].forEach(function (p) { CARRIER_OF[p] = n; }); });

  function carrierOf(phone) {
    var p = String(phone || '').replace(/[^\d+]/g, '');
    if (p.indexOf('+84') === 0) p = '0' + p.slice(3); else if (p.indexOf('84') === 0 && p.length >= 11) p = '0' + p.slice(2);
    return CARRIER_OF[p.slice(0, 3)] || 'Khác';
  }

  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmt(n) { return Number(n).toLocaleString('vi-VN'); }
  function pct(v, t) { return t ? (v / t * 100).toFixed(1).replace('.', ',') + '%' : '0%'; }

  function niceMax(v) {
    if (v <= 4) return 4;
    var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }

  // ---------- Khung chung: svg + tooltip ----------
  function frame(host, o, w, hgt) {
    host.innerHTML = '';
    host.classList.add('ch-host');
    var label = o.ariaLabel || o.title || 'Biểu đồ';
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + hgt, role: 'img', 'aria-label': label, 'class': 'ch-svg', preserveAspectRatio: 'xMidYMid meet' });
    svg.appendChild(el('title', null, label));
    host.appendChild(svg);
    var tip = h('div', 'ch-tip'); tip.hidden = true;
    host.appendChild(tip);
    function show(e) {
      var t = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (!t || !host.contains(t)) { tip.hidden = true; return; }
      tip.textContent = t.getAttribute('data-tip'); tip.hidden = false;
      var hr = host.getBoundingClientRect();
      var x = e.clientX - hr.left, y = e.clientY - hr.top;
      tip.style.left = Math.max(4, Math.min(x + 12, hr.width - tip.offsetWidth - 4)) + 'px';
      tip.style.top = Math.max(0, y - tip.offsetHeight - 10) + 'px';
    }
    host.addEventListener('mousemove', show);
    host.addEventListener('mouseover', show);
    host.addEventListener('mouseleave', function () { tip.hidden = true; });
    return svg;
  }

  function dataTable(host, rows, head) {
    var d = h('details', 'ch-data');
    d.appendChild(h('summary', null, 'Xem bảng số liệu'));
    var t = h('table', 'ch-table');
    var tr = h('tr'); head.forEach(function (c) { tr.appendChild(h('th', null, c)); });
    var th = h('thead'); th.appendChild(tr); t.appendChild(th);
    var tb = h('tbody');
    rows.forEach(function (r) { var x = h('tr'); r.forEach(function (c) { x.appendChild(h('td', null, String(c))); }); tb.appendChild(x); });
    t.appendChild(tb); d.appendChild(t); host.appendChild(d);
  }

  function emptyState(host, text) {
    host.innerHTML = '';
    host.classList.remove('ch-host');
    host.appendChild(h('p', 'ch-empty', text || 'Chưa có dữ liệu để vẽ biểu đồ.'));
  }

  function axisY(svg, max, W, L, R, T, ih) {
    for (var g = 0; g <= 4; g++) {
      var gy = T + ih * g / 4;
      svg.appendChild(el('line', { x1: L, x2: W - R, y1: gy, y2: gy, 'class': 'ch-grid' }));
      svg.appendChild(el('text', { x: L - 6, y: gy + 4, 'text-anchor': 'end', 'class': 'ch-axis' }, fmt(Math.round(max * (4 - g) / 4 * 10) / 10)));
    }
  }

  // Tooltip gắn vào một phần tử (dùng cho phím mũi tên / chạm), cùng kiểu với tooltip khi rê chuột
  function tipFor(host, node) {
    var tip = host.querySelector('.ch-tip'); if (!tip || !node) return;
    tip.textContent = node.getAttribute('data-tip') || ''; tip.hidden = false;
    var hr = host.getBoundingClientRect(), r = node.getBoundingClientRect();
    tip.style.left = Math.max(4, Math.min(r.left - hr.left + r.width / 2 - tip.offsetWidth / 2, hr.width - tip.offsetWidth - 4)) + 'px';
    tip.style.top = Math.max(0, r.top - hr.top - tip.offsetHeight - 8) + 'px';
  }
  function head(host, big, sub, delta) {
    var old = host.querySelector('.ch-lh'); if (old) old.remove();
    var d = h('div', 'ch-lh');
    d.appendChild(h('b', 'ch-lh-v', big));
    d.appendChild(h('span', 'ch-lh-s', sub));
    var dl = h('em', 'ch-lh-d' + (delta && delta.v < 0 ? ' dn' : '')); dl.textContent = delta ? delta.text : ''; d.appendChild(dl);
    host.insertBefore(d, host.firstChild);
    return d;
  }
  function deltaOf(cur, prev) {
    if (prev == null) return null;
    var diff = cur - prev;
    return { v: diff, text: (diff > 0 ? '+' : diff < 0 ? '−' : '±') + fmt(Math.abs(diff)) + ' so với kỳ trước' };
  }
  function escH(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function tweenFn() { return root.EP && root.EP.dash ? root.EP.dash.tween : function (d, f) { f(1); return function () {}; }; }

  // ---------- Đường / vùng: rê hoặc chạm để dò từng ngày, phím mũi tên, chọn khoảng ngày ----------
  // Chuyển thể từ Lucian 096 (line-chart scrub, MIT © 2026 Seokwoooo). o: { points:[{label,value}], ariaLabel, unit, empty }
  function lineChart(host, o) {
    var all = o.points || [];
    if (!all.length || !all.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var range = 0; // 0 = tất cả
    function render() {
      var pts = range ? all.slice(-range) : all;
      var W = host.clientWidth > 640 ? 1000 : 520, H = host.clientWidth > 640 ? 250 : 230, L = 38, R = 14, T = 14, B = 28;
      var svg = frame(host, o, W, H);
      var max = niceMax(Math.max.apply(null, pts.map(function (p) { return p.value; })));
      var iw = W - L - R, ih = H - T - B;
      function X(i) { return L + (pts.length === 1 ? iw / 2 : iw * i / (pts.length - 1)); }
      function Y(v) { return T + ih - ih * v / max; }
      var gid = 'chg' + Math.random().toString(36).slice(2, 7);
      var defs = el('defs'), lg = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
      lg.appendChild(el('stop', { offset: 0, 'stop-color': 'var(--accent)', 'stop-opacity': 0.3 })); lg.appendChild(el('stop', { offset: 1, 'stop-color': 'var(--accent)', 'stop-opacity': 0 }));
      defs.appendChild(lg); svg.appendChild(defs);
      axisY(svg, max, W, L, R, T, ih);
      var step = Math.max(1, Math.ceil(pts.length / 6));
      pts.forEach(function (p, i) {
        if (i % step === 0) svg.appendChild(el('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', 'class': 'ch-axis' }, p.label));
      });
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.value).toFixed(1); }).join(' ');
      if (pts.length > 1) {
        svg.appendChild(el('path', { d: d + ' L' + X(pts.length - 1).toFixed(1) + ' ' + (T + ih) + ' L' + X(0).toFixed(1) + ' ' + (T + ih) + ' Z', 'class': 'ch-area', style: 'fill:url(#' + gid + ')' }));
        svg.appendChild(el('path', { d: d, 'class': 'ch-line', pathLength: 1, fill: 'none' }));
      }
      var cur = el('line', { 'class': 'ch-cur', y1: T, y2: T + ih }); svg.appendChild(cur);
      var last = pts.length - 1;
      svg.appendChild(el('circle', { cx: X(last), cy: Y(pts[last].value), r: 5, 'class': 'ch-ring' }));
      var wcol = pts.length > 1 ? iw / (pts.length - 1) : iw, groups = [];
      pts.forEach(function (p, i) {
        var gp = el('g', { 'class': 'ch-pt', 'data-tip': p.label + ': ' + fmt(p.value) + ' ' + (o.unit || 'người'), 'data-v': p.value });
        gp.appendChild(el('rect', { x: X(i) - wcol / 2, y: T, width: wcol, height: ih, 'class': 'ch-hit' }));
        gp.appendChild(el('circle', { cx: X(i), cy: Y(p.value), r: pts.length === 1 ? 5 : 4.5, 'class': 'ch-dot' }));
        svg.appendChild(gp); groups.push(gp);
      });
      // Đầu biểu đồ: số của ngày đang dò (mặc định: ngày mới nhất)
      var curI = last;
      function setAt(i, on) {
        curI = i;
        var p = pts[i];
        head(host, fmt(p.value) + ' ' + (o.unit || 'người'), (on ? p.label : 'Mới nhất · ' + p.label), deltaOf(p.value, i ? pts[i - 1].value : null));
        host.classList.toggle('is-scrub', on);
        groups.forEach(function (g, k) { g.classList.toggle('is-on', on && k === i); });
        if (on) { cur.setAttribute('x1', X(i)); cur.setAttribute('x2', X(i)); }
      }
      svg.setAttribute('tabindex', '0');
      svg.addEventListener('pointermove', function (e) {
        var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W;
        var i = pts.length === 1 ? 0 : Math.round((x - L) / iw * (pts.length - 1));
        setAt(Math.max(0, Math.min(pts.length - 1, i)), true);
      });
      svg.addEventListener('pointerleave', function () { if (doc.activeElement !== svg) setAt(last, false); });
      svg.addEventListener('keydown', function (e) {
        var s = { ArrowLeft: -1, ArrowRight: 1, Home: -999, End: 999 }[e.key];
        if (e.key === 'Escape') { setAt(last, false); svg.blur(); return; }
        if (s === undefined) return;
        e.preventDefault(); setAt(Math.max(0, Math.min(pts.length - 1, curI + s)), true); tipFor(host, groups[curI]);
      });
      svg.addEventListener('blur', function () { setAt(last, false); host.querySelector('.ch-tip').hidden = true; });
      setAt(last, false);
      if (all.length > 14) {
        var chips = h('div', 'ch-range'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Khoảng ngày');
        [[14, '14 ngày'], [30, '30 ngày'], [0, 'Tất cả']].forEach(function (r) {
          if (r[0] && r[0] >= all.length) return;
          var b = h('button', 'ch-range-b', r[1]); b.type = 'button'; b.setAttribute('aria-pressed', String(range === r[0]));
          b.addEventListener('click', function () { range = r[0]; render(); });
          chips.appendChild(b);
        });
        host.insertBefore(chips, host.firstChild.nextSibling);
      }
      dataTable(host, pts.map(function (p) { return [p.label, p.value]; }), [o.labelHead || 'Ngày', o.valueHead || 'Số người']);
    }
    render();
  }

  // ---------- Cột đứng: rê để làm nổi cột, đường trung bình, ghim bằng bấm, phím mũi tên ----------
  // Chuyển thể từ Lucian 095 (bar chart hover, MIT © 2026 Seokwoooo). o: { items:[{label,tick,value}], tickEvery }
  function barChart(host, o) {
    var items = o.items || [];
    if (!items.length || !items.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var W = 520, H = 230, L = 38, R = 8, T = 14, B = 28;
    var svg = frame(host, o, W, H);
    var peak = Math.max.apply(null, items.map(function (p) { return p.value; }));
    var max = niceMax(peak);
    var iw = W - L - R, ih = H - T - B, slot = iw / items.length, bw = slot * 0.68;
    axisY(svg, max, W, L, R, T, ih);
    var mean = items.reduce(function (s, p) { return s + p.value; }, 0) / items.length;
    var ay = T + ih - ih * mean / max;
    svg.appendChild(el('line', { x1: L, x2: W - R, y1: ay, y2: ay, 'class': 'ch-avg' }));
    svg.appendChild(el('text', { x: W - R, y: ay - 4, 'text-anchor': 'end', 'class': 'ch-avg-t' }, 'TB ' + (Math.round(mean * 10) / 10).toString().replace('.', ',')));
    var groups = [], pin = -1, peakI = -1;
    items.forEach(function (p, i) {
      var x = L + slot * i + (slot - bw) / 2, bh = ih * p.value / max;
      var gp = el('g', { 'data-tip': p.label + ': ' + fmt(p.value) + ' ' + (o.unit || 'người'), 'data-v': p.value, 'class': 'ch-bargrp' });
      gp.appendChild(el('rect', { x: L + slot * i, y: T, width: slot, height: ih, 'class': 'ch-hit' }));
      if (p.value > 0) {
        if (p.value === peak && peakI < 0) peakI = i;
        var r = el('rect', { x: x, y: T + ih - bh, width: bw, height: bh, rx: 3, 'class': 'ch-bar' + (p.value === peak ? ' is-peak' : '') });
        r.style.animationDelay = (i * 18) + 'ms';
        gp.appendChild(r);
      }
      gp.setAttribute('tabindex', '-1'); gp.setAttribute('role', 'img'); gp.setAttribute('aria-label', p.label + ': ' + fmt(p.value) + ' ' + (o.unit || 'người'));
      svg.appendChild(gp); groups.push(gp);
      if (i % (o.tickEvery || 1) === 0) svg.appendChild(el('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', 'class': 'ch-axis' }, p.tick || p.label));
    });
    groups[Math.max(0, peakI)].setAttribute('tabindex', '0');
    function hl(i) {
      var idx = i >= 0 ? i : pin;
      host.classList.toggle('has-on', idx >= 0);
      groups.forEach(function (g, k) { g.classList.toggle('on', k === idx); g.classList.toggle('pin', k === pin); });
      if (idx >= 0) head(host, fmt(items[idx].value) + ' ' + (o.unit || 'người'), items[idx].label, idx ? deltaOf(items[idx].value, items[idx - 1].value) : null);
      else head(host, fmt(items[peakI].value) + ' ' + (o.unit || 'người'), 'Cao nhất · ' + items[peakI].label, null);
    }
    hl(-1);
    groups.forEach(function (g, i) {
      g.addEventListener('pointerenter', function () { hl(i); });
      g.addEventListener('focus', function () { hl(i); tipFor(host, g.querySelector('.ch-bar') || g); });
      g.addEventListener('click', function () { pin = pin === i ? -1 : i; hl(i); });
    });
    svg.addEventListener('pointerleave', function () { hl(-1); });
    svg.addEventListener('focusout', function (e) { if (!svg.contains(e.relatedTarget)) { hl(-1); host.querySelector('.ch-tip').hidden = true; } });
    svg.addEventListener('keydown', function (e) {
      var j = groups.indexOf(doc.activeElement); if (j < 0) return;
      var to = e.key === 'ArrowRight' ? j + 1 : e.key === 'ArrowLeft' ? j - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? groups.length - 1 : null;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin = pin === j ? -1 : j; hl(j); return; }
      if (to === null) return;
      e.preventDefault(); to = Math.max(0, Math.min(groups.length - 1, to));
      groups.forEach(function (g, k) { g.setAttribute('tabindex', k === to ? '0' : '-1'); }); groups[to].focus();
    });
    dataTable(host, items.map(function (p) { return [p.label, p.value]; }), [o.labelHead || 'Nhóm', o.valueHead || 'Số người']);
  }

  // ---------- Bánh vòng: rê thì mảnh nở ra và tâm đổi số; bấm mục chú giải để bỏ/thêm, các mảnh còn lại chia lại vòng ----------
  // Chuyển thể từ Lucian 097 (donut hover expand, MIT © 2026 Seokwoooo). o: { items:[{label,value}], centerLabel }
  function donutChart(host, o) {
    var items = (o.items || []).filter(function (p) { return p.value > 0; });
    var total0 = items.reduce(function (s, p) { return s + p.value; }, 0);
    if (!total0) return emptyState(host, o.empty);
    host.innerHTML = '';
    var wrap = h('div', 'ch-donut-wrap'); host.appendChild(wrap);
    var box = h('div', 'ch-donut-box'); wrap.appendChild(box);
    var svg = frame(box, o, 160, 160);
    svg.classList.add('ch-donut');
    var C = 80, r = 56;
    var on = items.map(function () { return true; }), act = -1, lis = [];
    svg.appendChild(el('circle', { cx: C, cy: C, r: r, fill: 'none', 'class': 'ch-donut-track', 'stroke-width': 24 }));
    var fr = items.map(function (p) { return p.value / total0; });
    var segs = items.map(function (p, i) {
      var seg = el('circle', { cx: C, cy: C, r: r, fill: 'none', 'stroke-width': 24, pathLength: 100, transform: 'rotate(-90 ' + C + ' ' + C + ')', 'class': 'ch-seg', 'data-v': p.value, tabindex: 0,
        'data-tip': p.label + ': ' + fmt(p.value) + ' (' + pct(p.value, total0) + ')' });
      seg.setAttribute('role', 'img'); seg.setAttribute('aria-label', p.label + ': ' + fmt(p.value) + ' (' + pct(p.value, total0) + ')');
      seg.style.stroke = PALETTE[i % PALETTE.length];
      seg.style.animationDelay = (i * 140) + 'ms';
      var share = fr[i] * 100;
      seg.setAttribute('stroke-dasharray', share.toFixed(3) + ' ' + (100 - share).toFixed(3));
      svg.appendChild(seg);
      return seg;
    });
    var accs = []; (function () { var a = 0; fr.forEach(function (f) { accs.push(a); a += f * 100; }); })();
    segs.forEach(function (sg, i) { sg.setAttribute('stroke-dashoffset', (-accs[i]).toFixed(3)); });
    var tL = el('text', { x: C, y: C - 14, 'text-anchor': 'middle', 'class': 'ch-axis ch-d-l' });
    var tN = el('text', { x: C, y: C + 6, 'text-anchor': 'middle', 'class': 'ch-donut-num' });
    var tS = el('text', { x: C, y: C + 22, 'text-anchor': 'middle', 'class': 'ch-axis ch-d-s' });
    svg.appendChild(tL); svg.appendChild(tN); svg.appendChild(tS);
    function tot() { return items.reduce(function (s, p, i) { return s + (on[i] ? p.value : 0); }, 0); }
    function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
    function paint() {
      var acc = 0;
      segs.forEach(function (sg, i) {
        var share = fr[i] * 100;
        sg.setAttribute('stroke-dasharray', share.toFixed(3) + ' ' + (100 - share).toFixed(3));
        sg.setAttribute('stroke-dashoffset', (-acc).toFixed(3));
        var mid = (acc + share / 2) / 100 * Math.PI * 2;
        sg.style.setProperty('--tx', (Math.cos(mid) * 3.2).toFixed(2) + 'px'); sg.style.setProperty('--ty', (Math.sin(mid) * 3.2).toFixed(2) + 'px');
        acc += share;
      });
    }
    function label() {
      var T = tot();
      if (act >= 0 && on[act]) { tL.textContent = trunc(items[act].label, 14); tN.textContent = fmt(items[act].value); tS.textContent = pct(items[act].value, T) + ' tổng'; }
      else { tL.textContent = ''; tN.textContent = fmt(T); tS.textContent = on.every(Boolean) ? (o.centerLabel || 'tổng') : 'đang chọn'; }
    }
    var cancelM = function () {};
    function morph() {
      cancelM();
      var T = tot(), to = items.map(function (p, i) { return on[i] ? p.value / T : 0; }), from = fr.slice();
      cancelM = tweenFn()(560, function (t) {
        var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        fr = from.map(function (v, i) { return v + (to[i] - v) * e; }); paint();
      });
    }
    function focus(i) {
      if (i === act) return;
      act = i;
      box.classList.toggle('has', i >= 0 && on[i]);
      segs.forEach(function (sg, k) { sg.classList.toggle('on', k === i && on[k]); });
      lis.forEach(function (li, k) { li.classList.toggle('on', k === i); });
      label();
    }
    var ul = h('ul', 'ch-legend'); wrap.appendChild(ul);
    lis = items.map(function (p, i) {
      var li = h('li'); var b = h('button', 'ch-lg-btn'); b.type = 'button'; b.setAttribute('aria-pressed', 'true');
      var sw = h('i', 'ch-sw'); sw.style.background = PALETTE[i % PALETTE.length];
      b.appendChild(sw); b.appendChild(h('span', 'ch-lg-name', p.label));
      b.appendChild(h('b', null, fmt(p.value))); b.appendChild(h('em', null, pct(p.value, total0)));
      b.addEventListener('pointerenter', function () { focus(i); });
      b.addEventListener('focus', function () { focus(i); });
      b.addEventListener('click', function () {
        if (on[i] && on.filter(Boolean).length === 1) return;
        on[i] = !on[i]; li.classList.toggle('off', !on[i]); b.setAttribute('aria-pressed', String(on[i]));
        b.title = on[i] ? 'Bấm để bỏ khỏi biểu đồ' : 'Bấm để thêm lại';
        var T = tot();
        items.forEach(function (q, k) { lis[k].querySelector('em').textContent = on[k] ? pct(q.value, T) : '—'; });
        morph(); act = -2; focus(on[i] ? i : -1);
      });
      b.title = 'Bấm để bỏ khỏi biểu đồ';
      li.appendChild(b); ul.appendChild(li);
      return li;
    });
    segs.forEach(function (sg, i) { sg.addEventListener('pointerenter', function () { focus(i); }); sg.addEventListener('focus', function () { focus(i); }); sg.addEventListener('blur', function () { focus(-1); }); });
    svg.addEventListener('pointerleave', function () { focus(-1); });
    ul.addEventListener('pointerleave', function () { if (!ul.contains(doc.activeElement)) focus(-1); });
    ul.addEventListener('focusout', function (e) { if (!ul.contains(e.relatedTarget)) focus(-1); });
    paint(); label();
    dataTable(host, items.map(function (p) { return [p.label, p.value, pct(p.value, total0)]; }), ['Trạng thái', 'Số người', 'Tỉ lệ']);
  }

  // ---------- Phễu: bậc hình thang, bấm một bậc để xem tỉ lệ rơi rụng ----------
  // Chuyển thể từ Lucian 160 (funnel conversion, MIT © 2026 Seokwoooo). o: { items:[{label,value}] }
  function funnelChart(host, o) {
    var items = o.items || [];
    if (!items.length || !items.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var W = 520, RH = 50, GAP = 6, H = items.length * (RH + GAP) - GAP + 2, top = items[0].value || 1;
    var svg = frame(host, o, W, H);
    svg.classList.add('ch-funnel');
    function wOf(i) { return (0.56 + 0.44 * Math.min(1, (items[i].value || 0) / top)) * W; }
    var rows = [], sel = -1;
    var stat = h('p', 'ch-fstat'); stat.setAttribute('aria-live', 'polite');
    items.forEach(function (p, i) {
      var w0 = wOf(i), w1 = i < items.length - 1 ? wOf(i + 1) : w0 * 0.94, y = i * (RH + GAP), cx = W / 2;
      var gp = el('g', { 'class': 'ch-hrow ch-frow ch-f' + Math.min(i, 3), 'data-v': p.value, 'data-tip': p.label + ': ' + fmt(p.value) + (i ? ' (' + pct(p.value, items[i - 1].value) + ' bước trước)' : ''), tabindex: 0, role: 'button', 'aria-pressed': 'false' });
      gp.setAttribute('aria-label', p.label + ': ' + fmt(p.value));
      gp.appendChild(el('path', { 'class': 'ch-fbar', d: 'M' + (cx - w0 / 2) + ' ' + y + 'L' + (cx + w0 / 2) + ' ' + y + 'L' + (cx + w1 / 2) + ' ' + (y + RH) + 'L' + (cx - w1 / 2) + ' ' + (y + RH) + 'Z' }));
      gp.appendChild(el('text', { x: cx - w1 / 2 + 16, y: y + RH / 2 + 4.5, 'class': 'ch-ft' }, p.label));
      gp.appendChild(el('text', { x: cx + w1 / 2 - 16, y: y + RH / 2 + 4.5, 'text-anchor': 'end', 'class': 'ch-ft ch-fv' }, fmt(p.value)));
      gp.style.animationDelay = (i * 90) + 'ms';
      svg.appendChild(gp); rows.push(gp);
    });
    host.appendChild(stat);
    function say() {
      if (sel < 0) {
        var last = items[items.length - 1];
        stat.innerHTML = items.length > 1 ? 'Tỉ lệ chuyển đổi cuối: <b>' + pct(last.value, items[0].value) + '</b>' : 'Bấm một bậc để xem chi tiết.';
        return;
      }
      var p = items[sel];
      stat.innerHTML = sel === 0 ? '<b>' + escH(p.label) + '</b>: ' + fmt(p.value) + ' (bước đầu của phễu).' : '<b>' + escH(p.label) + '</b>: ' + pct(p.value, items[sel - 1].value) + ' đi tiếp từ "' + escH(items[sel - 1].label) + '", rơi ' + pct(Math.max(0, items[sel - 1].value - p.value), items[sel - 1].value) + ' (' + fmt(Math.max(0, items[sel - 1].value - p.value)) + ' người).';
    }
    rows.forEach(function (g, i) {
      function toggle() { sel = sel === i ? -1 : i; rows.forEach(function (x, k) { x.setAttribute('aria-pressed', String(k === sel)); x.classList.toggle('on', k === sel); }); host.classList.toggle('has-on', sel >= 0); say(); }
      g.addEventListener('click', toggle);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var n = rows[i + (e.key === 'ArrowDown' ? 1 : -1)]; if (n) n.focus(); }
      });
    });
    say();
    dataTable(host, items.map(function (p, i) { return [p.label, p.value, i ? pct(p.value, items[i - 1].value) : '—']; }), [o.labelHead || 'Bước', 'Số người', 'Tỉ lệ so với bước trước']);
  }

  // ---------- Thanh ngang ----------
  // o: { items:[{label,value}], total (mẫu số tính %), scaleMax }
  function horizontalBars(host, o) {
    var items = (o.items || []).filter(function (p) { return p.value > 0 || o.keepZero; });
    if (!items.length || !items.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var total = o.total || items.reduce(function (s, p) { return s + p.value; }, 0);
    var max = o.scaleMax || Math.max.apply(null, items.map(function (p) { return p.value; }));
    var rowH = 34, LBL = 120, W = 520, VAL = 96, H = items.length * rowH + 4;
    var svg = frame(host, o, W, H);
    svg.classList.add('ch-hbars');
    items.forEach(function (p, i) {
      var y = i * rowH + 4, bw = Math.max(p.value ? 2 : 0, (W - LBL - VAL) * p.value / max);
      var gp = el('g', { 'data-tip': p.label + ': ' + fmt(p.value) + ' (' + pct(p.value, total) + ')', 'data-v': p.value, 'class': 'ch-hrow' });
      gp.appendChild(el('rect', { x: 0, y: y, width: W, height: rowH - 4, 'class': 'ch-hit' }));
      gp.appendChild(el('text', { x: 0, y: y + 17, 'class': 'ch-lbl' }, p.label.length > 18 ? p.label.slice(0, 17) + '…' : p.label));
      gp.appendChild(el('rect', { x: LBL, y: y + 4, width: W - LBL - VAL, height: 16, rx: 3, 'class': 'ch-track' }));
      var b = el('rect', { x: LBL, y: y + 4, width: bw, height: 16, rx: 3, 'class': 'ch-bar ch-hbar' });
      b.style.animationDelay = (i * 60) + 'ms';
      gp.appendChild(b);
      gp.appendChild(el('text', { x: W, y: y + 17, 'text-anchor': 'end', 'class': 'ch-val' }, fmt(p.value) + ' · ' + pct(p.value, total)));
      svg.appendChild(gp);
    });
    dataTable(host, items.map(function (p) { return [p.label, p.value, pct(p.value, total)]; }), [o.labelHead || 'Nhóm', 'Số người', 'Tỉ lệ']);
  }

  // ---------- Tính số liệu từ danh sách đăng ký ----------
  function dayKey(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayLabel(d) { return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }

  function analyze(regs, m, opts) {
    opts = opts || {};
    var LEAD = opts.leadText || {}, STATUS = opts.statusText || {};
    var out = { total: regs.length };
    var dates = regs.map(function (r) { return new Date(r.createdAt); }).filter(function (d) { return !isNaN(d); });
    var days = [];
    if (dates.length) {
      var min = new Date(Math.min.apply(null, dates)), max = new Date(Math.max.apply(null, dates));
      var cur = new Date(min.getFullYear(), min.getMonth(), min.getDate()), end = new Date(max.getFullYear(), max.getMonth(), max.getDate());
      var idx = {};
      for (var n = 0; cur <= end && n < 400; n++) { idx[dayKey(cur)] = days.length; days.push({ label: dayLabel(cur), value: 0 }); cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1); }
      dates.forEach(function (d) { var i = idx[dayKey(d)]; if (i != null) days[i].value++; });
    }
    out.days = days;
    out.hours = [];
    for (var hr = 0; hr < 24; hr++) out.hours.push({ label: hr + 'h–' + (hr + 1) + 'h', tick: String(hr), value: 0 });
    dates.forEach(function (d) { out.hours[d.getHours()].value++; });
    var st = {};
    regs.forEach(function (r) { var k = r.status || 'new'; st[k] = (st[k] || 0) + 1; });
    out.status = Object.keys(st).map(function (k) { return { label: STATUS[k] || k, value: st[k] }; }).sort(function (a, b) { return b.value - a.value; });
    var ld = {};
    regs.forEach(function (r) { var k = r.leadStatus || 'new'; ld[k] = (ld[k] || 0) + 1; });
    out.lead = Object.keys(LEAD).map(function (k) { return { label: LEAD[k], value: ld[k] || 0, key: k }; });
    var cr = {}, dm = {};
    regs.forEach(function (r) {
      var c = carrierOf(r.phone); cr[c] = (cr[c] || 0) + 1;
      var e = String(r.email || ''), at = e.lastIndexOf('@');
      var d = at >= 0 ? e.slice(at + 1).toLowerCase() : 'không rõ'; dm[d] = (dm[d] || 0) + 1;
    });
    out.carriers = Object.keys(cr).map(function (k) { return { label: k, value: cr[k] }; })
      .sort(function (a, b) { return (a.label === 'Khác') - (b.label === 'Khác') || b.value - a.value; });
    var dl = Object.keys(dm).map(function (k) { return { label: k, value: dm[k] }; }).sort(function (a, b) { return b.value - a.value; });
    out.domains = dl.slice(0, 5);
    if (dl.length > 5) out.domains.push({ label: 'Khác', value: dl.slice(5).reduce(function (s, p) { return s + p.value; }, 0) });
    var confirmed = regs.filter(function (r) { return r.status === 'new'; }).length;
    out.funnel = m ? [{ label: 'Lượt xem trang', value: m.views || 0 }, { label: 'Bấm nút đăng ký', value: m.ctaClicks || 0 }, { label: 'Đăng ký thành công', value: confirmed }]
      : [{ label: 'Đăng ký thành công', value: confirmed }];
    out.hasMetrics = !!m;
    return out;
  }

  function top(items) { return items.reduce(function (b, p) { return !b || p.value > b.value ? p : b; }, null); }

  // ---------- Lưới thẻ "Tóm tắt" ----------
  var lastKey = null;
  function card(grid, id, title, insight) {
    var c = h('section', 'ch-card'); c.setAttribute('data-chart', id);
    var head = h('div', 'ch-head'); head.appendChild(h('h3', null, title)); c.appendChild(head);
    c.appendChild(h('p', 'ch-insight', insight));
    var body = h('div', 'ch-body'); c.appendChild(body);
    grid.appendChild(c);
    return { card: c, head: head, body: body };
  }

  function renderSummary(grid, regs, m, opts) {
    opts = opts || {};
    var a = analyze(regs, m, opts);
    var key = JSON.stringify(a);
    if (key === lastKey && grid.childNodes.length) return;
    lastKey = key;
    grid.innerHTML = '';
    var none = !a.total;
    var nodata = 'Chưa có ai đăng ký.';

    var dTop = top(a.days);
    var c1 = card(grid, 'daily', 'Đăng ký theo ngày', none ? nodata : 'Ngày đăng ký nhiều nhất: ' + dTop.label + ' (' + fmt(dTop.value) + ' người).');
    c1.card.classList.add('ch-wide');
    var cum = false;
    var tg = h('label', 'ch-toggle'); var cb = h('input'); cb.type = 'checkbox';
    tg.appendChild(cb); tg.appendChild(document.createTextNode(' Cộng dồn'));
    if (!none) c1.head.appendChild(tg);
    function drawDaily() {
      var run = 0;
      var pts = a.days.map(function (d) { run += d.value; return { label: d.label, value: cum ? run : d.value }; });
      lineChart(c1.body, { points: pts, ariaLabel: (cum ? 'Đăng ký cộng dồn theo ngày' : 'Đăng ký theo ngày') + ', tổng ' + a.total + ' người', empty: nodata });
    }
    cb.addEventListener('change', function () { cum = cb.checked; drawDaily(); });
    drawDaily();

    var hTop = top(a.hours);
    var c2 = card(grid, 'hours', 'Khung giờ đăng ký', none ? nodata : 'Nhiều người đăng ký nhất lúc ' + hTop.label.replace('–', ' – ') + ' (' + fmt(hTop.value) + ' người).');
    barChart(c2.body, { items: a.hours, tickEvery: 3, ariaLabel: 'Số đăng ký theo giờ trong ngày', labelHead: 'Khung giờ', empty: nodata });

    var sTop = top(a.status);
    var c3 = card(grid, 'status', 'Trạng thái', none ? nodata : sTop.label + ' chiếm ' + pct(sTop.value, a.total) + ' (' + fmt(sTop.value) + '/' + fmt(a.total) + ').');
    donutChart(c3.body, { items: a.status, ariaLabel: 'Tỉ lệ theo trạng thái đăng ký, tổng ' + a.total + ' người', empty: nodata });

    var won = a.lead.filter(function (p) { return p.key === 'won'; })[0];
    var wonN = won ? won.value : 0;
    var c4 = card(grid, 'lead', 'Chăm sóc khách', none ? nodata : fmt(wonN) + ' người đã chốt tham dự (' + pct(wonN, a.total) + ').');
    horizontalBars(c4.body, { items: a.lead, total: a.total, keepZero: true, ariaLabel: 'Số khách theo trạng thái chăm sóc', labelHead: 'Chăm sóc', empty: nodata });

    var f = a.funnel, ok = f[f.length - 1].value;
    var fi;
    if (!a.hasMetrics) fi = 'Chưa có số liệu lượt xem (chỉ ghi nhận khi trang đã xuất bản).';
    else if (!f[0].value) fi = 'Chưa có lượt xem nào được ghi nhận.';
    else fi = 'Tỉ lệ chuyển đổi từ lượt xem: ' + pct(ok, f[0].value) + (f[1].value ? '; ' + pct(ok, f[1].value) + ' lượt bấm nút đã đăng ký xong.' : '.');
    var c5 = card(grid, 'funnel', 'Phễu chuyển đổi', fi);
    funnelChart(c5.body, { items: f, ariaLabel: 'Phễu chuyển đổi: ' + f.map(function (p) { return p.label + ' ' + p.value; }).join(', '), labelHead: 'Bước', empty: 'Chưa có dữ liệu phễu.' });

    var c6 = card(grid, 'reach', 'Nhà mạng và tên miền email', none ? nodata : 'Nhà mạng nhiều nhất: ' + a.carriers[0].label + ' (' + fmt(a.carriers[0].value) + '); tên miền email phổ biến nhất: ' + a.domains[0].label + ' (' + fmt(a.domains[0].value) + ').');
    c6.card.classList.add('ch-wide');
    var cols = h('div', 'ch-two'); c6.body.appendChild(cols);
    var s1 = h('div', 'ch-sub'); s1.setAttribute('data-sub', 'carrier'); s1.appendChild(h('h4', null, 'Nhà mạng (theo đầu số)'));
    var b1 = h('div'); s1.appendChild(b1); cols.appendChild(s1);
    var s2 = h('div', 'ch-sub'); s2.setAttribute('data-sub', 'domain'); s2.appendChild(h('h4', null, 'Tên miền email'));
    var b2 = h('div'); s2.appendChild(b2); cols.appendChild(s2);
    horizontalBars(b1, { items: a.carriers, total: a.total, ariaLabel: 'Số người theo nhà mạng', labelHead: 'Nhà mạng', empty: nodata });
    horizontalBars(b2, { items: a.domains, total: a.total, ariaLabel: 'Số người theo tên miền email', labelHead: 'Tên miền', empty: nodata });
  }

  function reset() { lastKey = null; }

  root.EP = root.EP || {};
  root.EP.charts = { lineChart: lineChart, barChart: barChart, donutChart: donutChart, horizontalBars: horizontalBars, funnelChart: funnelChart,
    analyze: analyze, carrierOf: carrierOf, renderSummary: renderSummary, reset: reset, CARRIER_PREFIX: CARRIER_PREFIX };
})(window);
