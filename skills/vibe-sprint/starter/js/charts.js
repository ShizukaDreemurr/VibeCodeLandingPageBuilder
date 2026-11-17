/* charts.js - biểu đồ SVG không thư viện, tự đổi màu theo giao diện (đọc biến --chart-* trong CSS),
   tự vẽ lại khi đổi kích thước, có aria-label mô tả và bảng số cho trình đọc màn hình.
     EP.charts.bar(el,   [{ label, value, color? }], { unit:'', format:fn, height:220 })
     EP.charts.line(el,  [{ label, value }],          { unit:'', format:fn, height:220, area:true })
     EP.charts.donut(el, [{ label, value, color? }],  { unit:'', format:fn, centerLabel:'Tổng' })
     EP.charts.tornado(el, [{ label, low, high }],    { format:fn, lowLabel:'Giảm 10%', highLabel:'Tăng 10%' })   // độ nhạy: low/high = mức thay đổi KPI khi giảm/tăng giả định
   Dữ liệu rỗng -> trạng thái trống. Gọi lại hàm trên cùng el để cập nhật. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, NS = 'http://www.w3.org/2000/svg';
  var COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];
  function col(d, i) { return d.color || COLORS[i % COLORS.length]; }
  function fmtDefault(v) { return EP.fmt.number(v, Math.abs(v) < 10 && v % 1 ? 1 : 0); }
  function nice(max) {
    if (max <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(max))), n = max / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function cut(s, n) { s = String(s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; }
  function summary(kind, data, o) {
    var f = o.format || fmtDefault;
    return kind + ': ' + data.map(function (d) { return d.label + ' ' + f(d.value) + (o.unit ? ' ' + o.unit : ''); }).join(', ');
  }
  function table(data, o) {
    var f = o.format || fmtDefault;
    return '<table class="sr-only"><caption>' + esc(o.title || 'Dữ liệu biểu đồ') + '</caption><tbody>' + data.map(function (d) { return '<tr><th scope="row">' + esc(d.label) + '</th><td>' + esc(f(d.value)) + '</td></tr>'; }).join('') + '</tbody></table>';
  }

  /* Mỗi biểu đồ lưu cấu hình để vẽ lại khi đổi kích thước */
  var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(EP.debounce(function (list) {
    list.forEach(function (e) { var el = e.target; if (el._chart && Math.abs(el._chart.w - el.clientWidth) > 8) draw(el); });
  }, 120)) : null;

  function mount(el, kind, data, o) {
    el.classList.add('chart');
    el._chart = { kind: kind, data: data || [], o: o || {}, w: 0 };
    if (ro && !el._observed) { ro.observe(el); el._observed = true; }
    draw(el);
  }
  function draw(el) {
    var c = el._chart, data = c.data, o = c.o;
    c.w = el.clientWidth || 320;
    var total = data.reduce(function (s, d) { return s + (Number(d.value) || 0); }, 0);
    if (!data.length || (c.kind === 'donut' && total <= 0)) { el.innerHTML = EP.ui.empty({ icon: 'chart', title: 'Chưa có dữ liệu để vẽ biểu đồ' }); return; }
    el.innerHTML = c.kind === 'bar' ? bar(data, o, c.w) : c.kind === 'line' ? line(data, o, c.w) : c.kind === 'tornado' ? tornado(data, o, c.w) : donut(data, o, c.w);
  }

  function frame(w, h, label, inner) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + esc(label) + '">' + inner + '</svg>';
  }
  function axes(w, h, m, max, f, min) {
    var s = '', i, steps = 4, ch = h - m.t - m.b; min = min || 0;
    for (i = 0; i <= steps; i++) {
      var y = m.t + ch - ch * i / steps;
      s += '<line class="grid-line" x1="' + m.l + '" x2="' + (w - m.r) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (m.l - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + esc(f(min + (max - min) * i / steps)) + '</text>';
    }
    return s;
  }

  /* Khoảng trục: luôn gồm số 0, chia đúng 4 khoảng bằng nhau, số 0 nằm trên một vạch, bước "đẹp" (1, 2, 2.5, 5 x 10^k).
     Chỉ dương: 0..4 bước (vd 0..8 bước 2, không còn nhãn lẻ 3,8). Có âm: vd -20k..60k bước 20k. */
  function range(data) {
    var v = data.map(function (d) { return Number(d.value) || 0; }), mx = Math.max.apply(null, v.concat(0)), mn = Math.min.apply(null, v.concat(0));
    if (mx === 0 && mn === 0) return { max: 1, min: 0 };
    var span = mx - mn, p = Math.pow(10, Math.floor(Math.log10(span / 4))), steps = [], a, b, i, st, k;
    for (i = 0; i < 3; i++) [1, 2, 2.5, 5].forEach(function (m) { if (m !== 2.5 || p >= 10 || p < 1) steps.push(m * p * Math.pow(10, i)); });
    for (i = 0; i < steps.length; i++) { st = steps[i]; a = Math.ceil(mx / st - 1e-9); b = Math.ceil(-mn / st - 1e-9); if (a + b <= 4) break; }
    while (a + b < 4) { k = mn < 0 && (mx <= 0 || -mn / (b * st) > mx / (a * st)) ? 'b' : 'a'; if (k === 'a') a++; else b++; }
    return { max: a * st, min: -b * st };
  }

  function bar(data, o, w) {
    var h = o.height || 220, f = o.format || fmtDefault, R = range(data), max = R.max, min = R.min, span = (max - min) || 1;
    var m = { l: 40, r: 8, t: 22, b: 30 }, cw = w - m.l - m.r, ch = h - m.t - m.b, band = cw / data.length, bw = Math.min(56, band * .62);
    var s = axes(w, h, m, max, f, min), y0 = m.t + ch * max / span;
    data.forEach(function (d, i) {
      var v = Number(d.value) || 0, bh = Math.abs(ch * v / span), x = m.l + band * i + (band - bw) / 2, y = v >= 0 ? y0 - bh : y0;
      s += '<rect class="ch-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(bh, 0) + '" rx="6" style="fill:' + col(d, i) + ';animation-delay:' + i * 60 + 'ms"><title>' + esc(d.label + ': ' + f(v) + (o.unit ? ' ' + o.unit : '')) + '</title></rect>';
      s += '<text class="val" x="' + (x + bw / 2) + '" y="' + (v >= 0 ? y - 6 : y + bh + 14) + '" text-anchor="middle">' + esc(f(v)) + '</text>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(cut(d.label, Math.floor(band / 6.5))) + '</text>';
    });
    return frame(w, h, summary('Biểu đồ cột', data, o), s) + table(data, o);
  }

  function line(data, o, w) {
    var h = o.height || 220, f = o.format || fmtDefault, R = range(data), max = R.max, min = R.min, span = (max - min) || 1;
    var m = { l: 40, r: 14, t: 18, b: 30 }, cw = w - m.l - m.r, ch = h - m.t - m.b, n = data.length;
    function X(i) { return m.l + (n === 1 ? cw / 2 : cw * i / (n - 1)); }
    function Y(v) { return m.t + ch - ch * ((Number(v) || 0) - min) / span; }
    var s = axes(w, h, m, max, f, min), pts = data.map(function (d, i) { return X(i) + ',' + Y(d.value); });
    var color = o.color || 'var(--chart-1)';
    if (o.area !== false && n > 1) s += '<path d="M' + X(0) + ',' + Y(0) + ' L' + pts.join(' L') + ' L' + X(n - 1) + ',' + Y(0) + 'Z" style="fill:' + color + ';opacity:.12"/>';
    s += '<polyline class="ch-line" points="' + pts.join(' ') + '" style="stroke:' + color + '"/>';
    var every = Math.ceil(n / Math.max(2, Math.floor(cw / 56)));
    data.forEach(function (d, i) {
      s += '<circle class="ch-dot" cx="' + X(i) + '" cy="' + Y(d.value) + '" r="4.5" style="fill:' + color + '"><title>' + esc(d.label + ': ' + f(d.value) + (o.unit ? ' ' + o.unit : '')) + '</title></circle>';
      if (i % every === 0) s += '<text x="' + X(i) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(cut(d.label, 9)) + '</text>';
    });
    return frame(w, h, summary('Biểu đồ đường', data, o), s) + table(data, o);
  }

  function donut(data, o, w) {
    var f = o.format || fmtDefault, size = Math.min(220, Math.max(140, w)), r = size / 2 - 18, C = 2 * Math.PI * r, cx = size / 2;
    var total = data.reduce(function (s, d) { return s + (Number(d.value) || 0); }, 0), off = 0;
    var s = '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="var(--chart-grid)" stroke-width="22"/>';
    data.forEach(function (d, i) {
      var v = Number(d.value) || 0; if (v <= 0) return;
      var len = C * v / total, gap = data.length > 1 ? Math.min(3, len / 4) : 0;
      s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke-width="22" style="stroke:' + col(d, i) + '" stroke-dasharray="' + Math.max(len - gap, 0.5) + ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"><title>' + esc(d.label + ': ' + f(v) + ' (' + Math.round(v / total * 100) + '%)') + '</title></circle>';
      off += len;
    });
    s += '<text class="donut-total" x="' + cx + '" y="' + (cx + 4) + '" text-anchor="middle">' + esc(f(total)) + '</text><text x="' + cx + '" y="' + (cx + 22) + '" text-anchor="middle">' + esc(o.centerLabel || 'Tổng') + '</text>';
    var legend = '<ul class="chart-legend">' + data.map(function (d, i) { return '<li><i style="background:' + col(d, i) + '"></i>' + esc(d.label) + ' <b>' + esc(f(d.value)) + '</b></li>'; }).join('') + '</ul>';
    return '<div class="donut-wrap">' + frame(size, size, summary('Biểu đồ tròn', data, o), s) + legend + '</div>' + table(data, o);
  }

  /* Tornado (độ nhạy): mỗi giả định một làn ngang; thanh "giảm" và "tăng" toả ra hai phía vạch 0 (phải = KPI tăng, trái = KPI giảm).
     Màu theo hướng đổi của GIẢ ĐỊNH (chú giải), vị trí theo tác động lên KPI; giá trị in ngay đầu thanh nên không phụ thuộc màu. */
  function tornado(data, o, w) {
    var f = o.format || fmtDefault, pad = 56, lane = 50, top = 8, h = top + lane * data.length + 6;
    var lo = 0, hi = 0;
    data.forEach(function (d) { lo = Math.min(lo, d.low, d.high); hi = Math.max(hi, d.low, d.high); });
    var span = (hi - lo) || 1, pw = Math.max(40, w - pad * 2);
    function X(v) { return pad + (v - lo) / span * pw; }
    var zero = X(0), s = '<line class="grid-line" x1="' + zero + '" x2="' + zero + '" y1="' + top + '" y2="' + (h - 6) + '" style="stroke-width:1.5"/>';
    data.forEach(function (d, i) {
      var y = top + lane * i, by = y + 22, bh = 18;
      s += '<text x="' + Math.max(4, Math.min(zero, w - 4)) + '" y="' + (y + 13) + '" text-anchor="' + (zero > w * .72 ? 'end' : zero < w * .28 ? 'start' : 'middle') + '" style="font-weight:600;fill:var(--text)">' + esc(cut(d.label, Math.floor(w / 6.4))) + '</text>';
      [{ v: d.low, c: 'var(--chart-2)', t: o.lowLabel || 'Giảm' }, { v: d.high, c: 'var(--chart-1)', t: o.highLabel || 'Tăng' }]
        .sort(function (a, b) { return Math.abs(b.v) - Math.abs(a.v); })
        .forEach(function (b) {
          var x = Math.min(zero, X(b.v)), bw = Math.max(Math.abs(X(b.v) - zero), 1.5);
          s += '<rect class="ch-bar" x="' + x + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="4" style="fill:' + b.c + '"><title>' + esc(d.label + ' (' + b.t + '): ' + f(b.v)) + '</title></rect>';
        });
      [d.low, d.high].forEach(function (v) {
        var right = v >= 0;
        s += '<text class="val" x="' + (X(v) + (right ? 5 : -5)) + '" y="' + (by + 13) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(f(v)) + '</text>';
      });
    });
    var legend = '<ul class="chart-legend"><li><i style="background:var(--chart-2)"></i>' + esc(o.lowLabel || 'Giảm') + '</li><li><i style="background:var(--chart-1)"></i>' + esc(o.highLabel || 'Tăng') + '</li></ul>';
    var tbl = '<div class="sr-only"><p>' + esc(o.title || 'Độ nhạy') + '</p><ul>' + data.map(function (d) { return '<li>' + esc(d.label + ' - ' + (o.lowLabel || 'Giảm') + ': ' + f(d.low) + '; ' + (o.highLabel || 'Tăng') + ': ' + f(d.high)) + '</li>'; }).join('') + '</ul></div>';
    var sum = 'Biểu đồ tornado: ' + data.map(function (d) { return d.label + ' (' + f(d.low) + ' / ' + f(d.high) + ')'; }).join(', ');
    return frame(w, h, sum, s) + legend + tbl;
  }

  EP.charts = {
    tornado: function (el, data, o) { mount(el, 'tornado', data, o); },
    bar: function (el, data, o) { mount(el, 'bar', data, o); },
    line: function (el, data, o) { mount(el, 'line', data, o); },
    donut: function (el, data, o) { mount(el, 'donut', data, o); },
    /** Đếm theo một khoá: EP.charts.countBy(rows, 'status', { a: 'Mới' }) -> [{label, value}] */
    countBy: function (rows, key, labels) {
      var m = {}, order = [];
      rows.forEach(function (r) { var k = r[key] == null || r[key] === '' ? '(trống)' : r[key]; if (!(k in m)) { m[k] = 0; order.push(k); } m[k]++; });
      return order.map(function (k) { return { label: (labels && labels[k]) || k, value: m[k] }; });
    }
  };
})(window);
