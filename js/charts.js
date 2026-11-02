/*
 * charts.js — biểu đồ SVG thuần cho tab "Danh sách đăng ký" (không dùng thư viện ngoài).
 * EP.charts: lineChart, barChart, donutChart, horizontalBars (vẽ vào một phần tử), analyze (tính số liệu),
 * renderSummary (dựng cả lưới thẻ "Tóm tắt"). Mọi biểu đồ có <title>, role="img", aria-label và bảng số liệu thay thế (<details>).
 * Hoạt ảnh nằm ở css/app.css (lớp .ch-*), tắt khi html.motion-off.
 */
(function (root) {
  var NS = 'http://www.w3.org/2000/svg';
  var PALETTE = ['var(--accent)', 'var(--text)', '#8a8d93', '#e58aae', '#b9bbc0', '#f3c4d5']; // dẫn xuất từ tokens.css

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

  // ---------- Đường / vùng ----------
  // o: { points:[{label,value}], ariaLabel, unit, empty }
  function lineChart(host, o) {
    var pts = o.points || [];
    if (!pts.length || !pts.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var W = host.clientWidth > 640 ? 1000 : 520, H = host.clientWidth > 640 ? 250 : 230, L = 38, R = 14, T = 14, B = 28;
    var svg = frame(host, o, W, H);
    var max = niceMax(Math.max.apply(null, pts.map(function (p) { return p.value; })));
    var iw = W - L - R, ih = H - T - B;
    function X(i) { return L + (pts.length === 1 ? iw / 2 : iw * i / (pts.length - 1)); }
    function Y(v) { return T + ih - ih * v / max; }
    axisY(svg, max, W, L, R, T, ih);
    var step = Math.max(1, Math.ceil(pts.length / 6));
    pts.forEach(function (p, i) {
      if (i % step === 0) svg.appendChild(el('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', 'class': 'ch-axis' }, p.label));
    });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.value).toFixed(1); }).join(' ');
    if (pts.length > 1) {
      svg.appendChild(el('path', { d: d + ' L' + X(pts.length - 1).toFixed(1) + ' ' + (T + ih) + ' L' + X(0).toFixed(1) + ' ' + (T + ih) + ' Z', 'class': 'ch-area' }));
      svg.appendChild(el('path', { d: d, 'class': 'ch-line', pathLength: 1, fill: 'none' }));
    }
    var wcol = pts.length > 1 ? iw / (pts.length - 1) : iw;
    pts.forEach(function (p, i) {
      var gp = el('g', { 'class': 'ch-pt', 'data-tip': p.label + ': ' + fmt(p.value) + ' ' + (o.unit || 'người'), 'data-v': p.value });
      gp.appendChild(el('rect', { x: X(i) - wcol / 2, y: T, width: wcol, height: ih, 'class': 'ch-hit' }));
      gp.appendChild(el('circle', { cx: X(i), cy: Y(p.value), r: pts.length === 1 ? 5 : 4, 'class': 'ch-dot' }));
      svg.appendChild(gp);
    });
    dataTable(host, pts.map(function (p) { return [p.label, p.value]; }), [o.labelHead || 'Ngày', o.valueHead || 'Số người']);
  }

  // ---------- Cột đứng ----------
  // o: { items:[{label,tick,value}], tickEvery }
  function barChart(host, o) {
    var items = o.items || [];
    if (!items.length || !items.some(function (p) { return p.value > 0; })) return emptyState(host, o.empty);
    var W = 520, H = 230, L = 38, R = 8, T = 14, B = 28;
    var svg = frame(host, o, W, H);
    var peak = Math.max.apply(null, items.map(function (p) { return p.value; }));
    var max = niceMax(peak);
    var iw = W - L - R, ih = H - T - B, slot = iw / items.length, bw = slot * 0.68;
    axisY(svg, max, W, L, R, T, ih);
    items.forEach(function (p, i) {
      var x = L + slot * i + (slot - bw) / 2, bh = ih * p.value / max;
      var gp = el('g', { 'data-tip': p.label + ': ' + fmt(p.value) + ' ' + (o.unit || 'người'), 'data-v': p.value, 'class': 'ch-bargrp' });
      gp.appendChild(el('rect', { x: L + slot * i, y: T, width: slot, height: ih, 'class': 'ch-hit' }));
      if (p.value > 0) {
        var r = el('rect', { x: x, y: T + ih - bh, width: bw, height: bh, rx: 2, 'class': 'ch-bar' + (p.value === peak ? ' is-peak' : '') });
        r.style.animationDelay = (i * 18) + 'ms';
        gp.appendChild(r);
      }
      svg.appendChild(gp);
      if (i % (o.tickEvery || 1) === 0) svg.appendChild(el('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', 'class': 'ch-axis' }, p.tick || p.label));
    });
    dataTable(host, items.map(function (p) { return [p.label, p.value]; }), [o.labelHead || 'Nhóm', o.valueHead || 'Số người']);
  }

  // ---------- Bánh vòng ----------
  // o: { items:[{label,value}], centerLabel }
  function donutChart(host, o) {
    var items = (o.items || []).filter(function (p) { return p.value > 0; });
    var total = items.reduce(function (s, p) { return s + p.value; }, 0);
    if (!total) return emptyState(host, o.empty);
    host.innerHTML = '';
    var wrap = h('div', 'ch-donut-wrap'); host.appendChild(wrap);
    var box = h('div', 'ch-donut-box'); wrap.appendChild(box);
    var svg = frame(box, o, 160, 160);
    svg.classList.add('ch-donut');
    var C = 80, r = 56, acc = 0;
    svg.appendChild(el('circle', { cx: C, cy: C, r: r, fill: 'none', 'class': 'ch-donut-track', 'stroke-width': 24 }));
    items.forEach(function (p, i) {
      var share = p.value / total * 100;
      var seg = el('circle', { cx: C, cy: C, r: r, fill: 'none', 'stroke-width': 24, pathLength: 100,
        'stroke-dasharray': share.toFixed(3) + ' ' + (100 - share).toFixed(3), 'stroke-dashoffset': (-acc).toFixed(3),
        transform: 'rotate(-90 ' + C + ' ' + C + ')', 'class': 'ch-seg', 'data-v': p.value,
        'data-tip': p.label + ': ' + fmt(p.value) + ' (' + pct(p.value, total) + ')' });
      seg.style.stroke = PALETTE[i % PALETTE.length];
      seg.style.animationDelay = (i * 140) + 'ms';
      svg.appendChild(seg);
      acc += share;
    });
    svg.appendChild(el('text', { x: C, y: C + 4, 'text-anchor': 'middle', 'class': 'ch-donut-num' }, fmt(total)));
    svg.appendChild(el('text', { x: C, y: C + 22, 'text-anchor': 'middle', 'class': 'ch-axis' }, o.centerLabel || 'tổng'));
    var ul = h('ul', 'ch-legend'); wrap.appendChild(ul);
    items.forEach(function (p, i) {
      var li = h('li'); var sw = h('i', 'ch-sw'); sw.style.background = PALETTE[i % PALETTE.length];
      li.appendChild(sw); li.appendChild(h('span', 'ch-lg-name', p.label));
      li.appendChild(h('b', null, fmt(p.value))); li.appendChild(h('em', null, pct(p.value, total)));
      ul.appendChild(li);
    });
    dataTable(host, items.map(function (p) { return [p.label, p.value, pct(p.value, total)]; }), ['Trạng thái', 'Số người', 'Tỉ lệ']);
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
    horizontalBars(c5.body, { items: f, keepZero: true, scaleMax: Math.max(1, f[0].value), total: Math.max(1, f[0].value), ariaLabel: 'Phễu chuyển đổi: ' + f.map(function (p) { return p.label + ' ' + p.value; }).join(', '), labelHead: 'Bước', empty: 'Chưa có dữ liệu phễu.' });

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
  root.EP.charts = { lineChart: lineChart, barChart: barChart, donutChart: donutChart, horizontalBars: horizontalBars,
    analyze: analyze, carrierOf: carrierOf, renderSummary: renderSummary, reset: reset, CARRIER_PREFIX: CARRIER_PREFIX };
})(window);
