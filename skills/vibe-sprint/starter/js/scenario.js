/* scenario.js - EP.scenario: mô hình kinh doanh "giả định -> 3 kịch bản -> hòa vốn -> độ nhạy -> cách tính" dùng cho đề kinh tế.
   Chung cho mọi đề: bạn chỉ khai báo GIẢ ĐỊNH và một hàm compute thuần (không chạm DOM); giao diện, hòa vốn, tornado, CSV, sao chép cho slide có sẵn.

     var sc = EP.scenario.mount(el, {
       id: 'shop',                         // khoá lưu (localStorage qua EP.store: 'scn_shop'); đổi id khi đổi bộ giả định
       title: 'Mô hình kinh doanh',
       tag: 'assumption',                  // nhãn mặc định: 'assumption' = Giả định | 'sample' = Dữ liệu mẫu | 'mock' = Mô phỏng
       note: 'Số liệu minh hoạ, thay bằng số của đề.',
       unitLabel: 'đơn',                   // đơn vị của "điểm hòa vốn" (đơn, khách, vé, suất...)
       assumptions: [{ key, label, unit: '₫'|'%'|'đơn'..., value, min, max, step, why, source?: 'assumption'|'sample'|'mock', better: 'up'|'down'|null, sens?: false }],
         // unit '₫' -> ô tiền vi-VN (1.250.000); '%' -> số phần trăm (2,5 nghĩa là 2,5%, hàm compute tự chia 100); khác -> số.
         // better: giá trị CAO hơn là tốt ('up') hay xấu ('down'); dùng để tự sinh kịch bản Xấu/Tốt (± biên độ, mặc định 15%).
       scenarios: [{ id, label, adjust: { key: hệ-số-nhân | { set: n } } }],   // tuỳ chọn; bỏ qua = Xấu/Cơ sở/Tốt tự sinh từ better
       compute: function (a) { return { revenue, profit, ..., fixed, unitContribution, unitPrice, investment }; },
         // a = { key: số }. Hàm THUẦN. Nếu trả fixed + unitContribution (+ unitPrice) -> tự có điểm hòa vốn (đơn + doanh thu);
         // trả investment (+ profit) -> tự có thời gian hoàn vốn (tháng). Chia cho 0 -> "Không đủ dữ liệu".
       outputs: [{ key, label, format: 'money'|'percent'|'number'|'ratio', kpi: true (chọn được cho tornado), card: true (thẻ KPI), good?: 'up'|'down' }],
       kpi: 'profit',                      // KPI mặc định của tornado
       explain: [{ label, formula: 'Doanh thu = ...', live: function (a, r, F) { return '...số thật...'; } }]
     });
     sc.values() / sc.setValue(key, n, { source }) / sc.results() -> { bad, base, good } / sc.compute(a) / sc.breakEven(id)
     sc.sensitivity(kpiKey, pct) / sc.csvRows() / sc.toText() / sc.exportCsv() / sc.copyText() / sc.reset()

   Hàm thuần dùng độc lập (kiểm thử được): EP.scenario.breakEven(fixed, unitContribution, unitPrice), .spread(assumptions, spread),
   .evaluate(cfg, values), .sensitivity(cfg, values, kpiKey, pct), .fmt(kind, v). */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, M = EP.metrics, NO_DATA = 'Không đủ dữ liệu';
  var TAGS = { assumption: 'Giả định', sample: 'Dữ liệu mẫu', mock: 'Mô phỏng' };
  var TONES = { assumption: 'warning', sample: 'accent', mock: '' };
  var instances = {};

  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function kindOf(a) { return a.kind || (a.unit === '₫' ? 'money' : a.unit === '%' ? 'percent' : 'number'); }

  /* ---------- định dạng ---------- */
  function fmt(kind, v, short) {
    if (!isNum(v)) return NO_DATA;
    if (kind === 'money') return short ? M.vndShort(v) : M.vnd(v);
    if (kind === 'percent') return EP.fmt.percent(v, 1);
    if (kind === 'ratio') return EP.fmt.number(v, 2) + 'x';
    return EP.fmt.number(v, Math.abs(v) < 100 && v % 1 ? 1 : 0);
  }
  function signed(kind, v) { return (v > 0 ? '+' : v < 0 ? '-' : '') + fmt(kind, Math.abs(v), true).replace(/^-/, ''); }
  var F = { money: M.vnd, short: M.vndShort, percent: function (n) { return EP.fmt.percent(n, 1); }, number: function (n) { return EP.fmt.number(n, Math.abs(n) < 100 && n % 1 ? 1 : 0); }, fmt: fmt };

  /* ---------- hàm thuần ---------- */
  /** Hòa vốn = chi phí cố định / lãi góp mỗi đơn vị. Lãi góp <= 0 hoặc thiếu số -> ok:false (UI hiện "Không đủ dữ liệu"). */
  function breakEven(fixed, contrib, price) {
    fixed = Number(fixed); contrib = Number(contrib); price = Number(price);
    if (!isFinite(fixed) || !isFinite(contrib) || fixed < 0) return { ok: false, units: null, revenue: null, reason: 'Thiếu chi phí cố định hoặc lãi góp.' };
    if (contrib <= 0) return { ok: false, units: null, revenue: null, reason: 'Lãi góp mỗi đơn vị <= 0: bán thêm cũng không hòa vốn.' };
    var units = fixed / contrib;
    return { ok: true, units: units, revenue: isFinite(price) && price > 0 ? units * price : null, reason: '' };
  }

  function baseValues(assumptions, saved) {
    var v = {};
    assumptions.forEach(function (a) { v[a.key] = saved && isNum(saved[a.key]) ? saved[a.key] : a.value; });
    return v;
  }

  /** Sinh 3 kịch bản từ `better`: Xấu = bất lợi ±spread, Tốt = có lợi ±spread. Trả [{id,label,adjust}] với adjust = hệ số nhân. */
  function spread(assumptions, s) {
    s = isNum(s) ? s : 0.15;
    function mk(id, label, g) {
      var adj = {};
      assumptions.forEach(function (a) { if (a.better === 'up') adj[a.key] = 1 + g * s; else if (a.better === 'down') adj[a.key] = 1 - g * s; });
      return { id: id, label: label, adjust: adj };
    }
    return [mk('bad', 'Xấu', -1), mk('base', 'Cơ sở', 0), mk('good', 'Tốt', 1)];
  }

  function applyScenario(assumptions, base, scn) {
    var out = {};
    assumptions.forEach(function (a) {
      var v = base[a.key], adj = scn.adjust && scn.adjust[a.key];
      if (adj != null) {
        if (typeof adj === 'object' && isNum(adj.set)) v = adj.set;
        else if (isNum(adj)) v = v * adj;
      }
      if (isNum(a.min) && a.min >= 0 && v < 0) v = 0;
      out[a.key] = v;
    });
    return out;
  }

  /** Chạy compute + bổ sung hòa vốn / hoàn vốn. Lỗi trong compute -> { error }. */
  function evaluate(cfg, values) {
    var r;
    try { r = Object.assign({}, cfg.compute(Object.assign({}, values)) || {}); } catch (e) { return { error: String(e && e.message || e) }; }
    var be = breakEven(r.fixed, r.unitContribution, r.unitPrice);
    r.be = be; r.beUnits = be.ok ? be.units : null; r.beRevenue = be.ok ? be.revenue : null;
    r.paybackMonths = isNum(r.investment) && isNum(r.profit) && r.profit > 0 && r.investment >= 0 ? r.investment / r.profit : null;
    return r;
  }

  /** Độ nhạy: đổi từng giả định ±pct% (giữ nguyên các giả định khác), đo mức thay đổi của KPI. Sắp xếp theo biên độ giảm dần. */
  function sensitivity(cfg, values, kpiKey, pct) {
    var base = evaluate(cfg, values)[kpiKey], p = pct / 100, rows = [];
    if (!isNum(base)) return rows;
    cfg.assumptions.forEach(function (a) {
      if (a.sens === false || !isNum(values[a.key]) || values[a.key] === 0) return;
      var lo = Object.assign({}, values), hi = Object.assign({}, values);
      lo[a.key] = values[a.key] * (1 - p); hi[a.key] = values[a.key] * (1 + p);
      var kl = evaluate(cfg, lo)[kpiKey], kh = evaluate(cfg, hi)[kpiKey];
      if (!isNum(kl) || !isNum(kh)) return;
      var dl = kl - base, dh = kh - base;
      if (Math.abs(dl) < 1e-9 && Math.abs(dh) < 1e-9) return;
      rows.push({ key: a.key, label: a.label, low: dl, high: dh, swing: Math.max(Math.abs(dl), Math.abs(dh)) });
    });
    rows.sort(function (x, y) { return y.swing - x.swing; });
    return rows;
  }

  /* ---------- giao diện ---------- */
  function mount(el, cfg) {
    var id = cfg.id || 'scenario', skey = 'scn_' + id, unit = cfg.unitLabel || 'đơn';
    var A = cfg.assumptions, byKey = {};
    A.forEach(function (a) { byKey[a.key] = a; });
    var outputs = (cfg.outputs || []).slice();
    var builtins = [{ key: 'beUnits', label: 'Điểm hòa vốn (' + unit + ')', format: 'number', kpi: true, card: true, good: 'down' },
      { key: 'beRevenue', label: 'Doanh thu hòa vốn', format: 'money', kpi: false, good: 'down' },
      { key: 'paybackMonths', label: 'Thời gian hoàn vốn (tháng)', format: 'number', kpi: false, good: 'down' }];
    builtins.forEach(function (b) { if (!outputs.some(function (o) { return o.key === b.key; })) outputs.push(b); });
    var kpis = outputs.filter(function (o) { return o.kpi; });
    var saved = EP.store.read(skey, null) || {};
    var st = {
      values: baseValues(A, saved.values),
      src: Object.assign({}, saved.src || {}),
      spread: isNum(saved.spread) ? saved.spread : (isNum(cfg.spread) ? cfg.spread : 15),
      view: 'base', kpi: kpis.some(function (o) { return o.key === saved.kpi; }) ? saved.kpi : (cfg.kpi || (kpis[0] && kpis[0].key)), pct: saved.pct === 20 ? 20 : 10
    };
    var mqNarrow = root.matchMedia ? root.matchMedia('(max-width: 560px)') : { matches: false };

    function persist() { EP.store.write(skey, { values: st.values, src: st.src, spread: st.spread, kpi: st.kpi, pct: st.pct }); }
    function scenarios() { return cfg.scenarios && cfg.scenarios.length ? cfg.scenarios : spread(A, st.spread / 100); }
    function scenValues(scn) { return applyScenario(A, st.values, scn); }
    function results() { var o = {}; scenarios().forEach(function (s) { o[s.id] = evaluate(cfg, scenValues(s)); }); return o; }
    function srcOf(key) { return st.src[key] || byKey[key].source || cfg.tag || 'assumption'; }
    function outDef(key) { return outputs.filter(function (o) { return o.key === key; })[0]; }
    function csvRows() {
      var sc = scenarios(), rs = results(), rows = [];
      function cols(get) { var o = {}; sc.forEach(function (s, i) { o['s' + i] = get(s); }); return o; }
      A.forEach(function (a) {
        rows.push(Object.assign({ group: 'Giả định', name: a.label, unit: a.unit || '' }, cols(function (s) { return scenValues(s)[a.key]; }), { tag: TAGS[srcOf(a.key)] || srcOf(a.key), note: a.why || '' }));
      });
      outputs.forEach(function (o) {
        if (!sc.some(function (s) { return isNum(rs[s.id][o.key]); })) return;
        rows.push(Object.assign({ group: 'Kết quả', name: o.label, unit: o.format === 'money' ? '₫' : o.format === 'percent' ? '%' : o.format === 'ratio' ? 'lần' : '' },
          cols(function (s) { var v = rs[s.id][o.key]; return isNum(v) ? v : NO_DATA; }), { tag: 'Tính từ giả định', note: '' }));
      });
      return rows;
    }
    function csvCols() {
      var c = [{ key: 'group', label: 'Nhóm' }, { key: 'name', label: 'Chỉ tiêu' }, { key: 'unit', label: 'Đơn vị' }];
      scenarios().forEach(function (s, i) { c.push({ key: 's' + i, label: s.label }); });
      c.push({ key: 'tag', label: 'Nhãn' }, { key: 'note', label: 'Lý do / nguồn' });
      return c;
    }
    function toText() {
      var sc = scenarios(), rs = results(), L = [];
      L.push((cfg.title || 'Mô hình kinh doanh').toUpperCase() + ' - ' + (TAGS[cfg.tag || 'assumption'] || 'Giả định') + ', không phải số liệu thật');
      L.push('', 'GIẢ ĐỊNH (kịch bản cơ sở):');
      A.forEach(function (a) { L.push('- ' + a.label + ': ' + fmt(kindOf(a), st.values[a.key]) + (kindOf(a) === 'number' && a.unit ? ' ' + a.unit : '') + ' [' + TAGS[srcOf(a.key)] + ']' + (a.why ? ' - ' + a.why : '')); });
      L.push('', 'KẾT QUẢ (' + sc.map(function (s) { return s.label; }).join(' | ') + '):');
      outputs.forEach(function (o) { if (sc.some(function (s) { return isNum(rs[s.id][o.key]); })) L.push('- ' + o.label + ': ' + sc.map(function (s) { return fmt(o.format, rs[s.id][o.key]); }).join(' | ')); });
      return L.join('\n');
    }

    /* --- khung --- */
    var uid = 'sc-' + id;
    el.classList.add('sc');
    el.innerHTML =
      '<div class="card sc-head"><div class="card-head"><h2 class="section-title">' + esc(cfg.title || 'Mô hình kinh doanh') + '</h2><div class="row" data-slot="tags"></div></div>' +
      '<p class="muted" data-slot="note"></p>' +
      '<div class="row mt-3"><button class="btn btn-sm" type="button" data-act="reset" aria-label="Đặt lại giả định">' + EP.ui.icon('refresh') + 'Đặt lại</button>' +
      '<button class="btn btn-sm" type="button" data-act="csv">' + EP.ui.icon('download') + 'Xuất CSV</button>' +
      '<button class="btn btn-sm" type="button" data-act="copy">' + EP.ui.icon('copy') + 'Sao chép cho slide</button></div></div>' +
      '<div class="card"><div class="card-head"><h2 class="section-title">Bảng giả định (sửa được)</h2><label class="sc-spread muted" for="' + uid + '-spread">Biên độ kịch bản Xấu/Tốt <input class="sc-spread-in" id="' + uid + '-spread" type="number" min="0" max="50" step="1" inputmode="numeric"> %</label></div>' +
      '<div class="sc-grid" data-slot="assump"></div></div>' +
      '<div class="card" aria-live="polite"><div class="card-head"><h2 class="section-title">Kết quả theo kịch bản</h2><div data-slot="view"></div></div>' +
      '<div class="grid kpis" data-slot="cards"></div><div class="sc-tablewrap mt-3" data-slot="table"></div>' +
      '<h3 class="sc-sub mt-3" data-slot="chart-title"></h3><div data-slot="chart"></div></div>' +
      '<div class="card"><div class="card-head"><h2 class="section-title">Độ nhạy: giả định nào quyết định kết quả?</h2></div>' +
      '<div class="row sc-ctl"><div data-slot="kpi-pick"></div><div data-slot="pct-pick"></div></div>' +
      '<p class="muted mt-2" data-slot="sens-note"></p><div class="mt-3" data-slot="tornado"></div></div>' +
      '<div class="card"><details class="sc-explain" open><summary class="section-title">Cách tính (công thức và số liệu hiện tại)</summary><dl class="sc-dl" data-slot="explain"></dl></details></div>';
    var $ = function (s) { return el.querySelector('[data-slot="' + s + '"]'); };

    $('tags').innerHTML = EP.ui.badge(TAGS[cfg.tag || 'assumption'], TONES[cfg.tag || 'assumption']) + EP.ui.badge('Giả định có thể sửa', '');
    $('note').textContent = cfg.note || 'Mọi con số là giả định minh hoạ để trình bày logic, không phải số liệu thật. Thay bằng số liệu của đề hoặc của BTC.';

    /* --- bảng giả định --- */
    /* Số nguyên lớn (lượt truy cập, ₫...) hiện có dấu chấm nghìn kiểu vi-VN; số nhỏ / có phần thập phân giữ ô số thường */
    function grouped(a) { var k = kindOf(a); return k === 'money' || (k === 'number' && Math.max(Math.abs(a.max || 0), Math.abs(a.value || 0)) >= 10000 && !(a.step && a.step % 1)); }
    function inputValue(a, v) { return grouped(a) ? EP.fmt.number(v, 0) : String(Math.round(v * 1e6) / 1e6); }
    $('assump').innerHTML = A.map(function (a) {
      var k = kindOf(a), iid = uid + '-' + a.key, t = srcOf(a.key);
      var inp = grouped(a)
        ? '<input class="input" id="' + iid + '" data-key="' + esc(a.key) + '" type="text" inputmode="numeric" data-lx-money placeholder=" " autocomplete="off" value="' + esc(inputValue(a, st.values[a.key])) + '">'
        : '<input class="input" id="' + iid + '" data-key="' + esc(a.key) + '" type="number" inputmode="decimal" placeholder=" " step="' + esc(a.step || 'any') + '" value="' + esc(inputValue(a, st.values[a.key])) + '">';
      return '<div class="sc-row" data-row="' + esc(a.key) + '"><div class="field">' + inp + '<label class="label" for="' + iid + '">' + esc(a.label) + (a.unit ? '<span class="sr-only"> (' + esc(a.unit) + ')</span>' : '') + '</label>' + (a.unit ? '<span class="sc-unit" aria-hidden="true">' + esc(a.unit) + '</span>' : '') + '</div>' +
        (isNum(a.min) && isNum(a.max) ? '<input class="sc-range" type="range" data-range="' + esc(a.key) + '" min="' + a.min + '" max="' + a.max + '" step="' + (a.step || 'any') + '" value="' + st.values[a.key] + '" aria-label="Kéo để chỉnh ' + esc(a.label) + '">' : '') +
        '<div class="sc-why"><span data-tag>' + EP.ui.badge(TAGS[t], TONES[t]) + '</span><span class="muted">' + esc(a.why || '') + '</span></div><div class="field-msg" data-msg></div></div>';
    }).join('');
    $('assump').parentNode.querySelector('.sc-spread-in').value = st.spread;
    $('assump').parentNode.querySelector('.sc-spread').hidden = !!(cfg.scenarios && cfg.scenarios.length);

    function readInput(a, inp) {
      var raw = inp.value;
      if (raw === '' || raw == null) return NaN;
      return grouped(a) ? Number(String(raw).replace(/[^\d]/g, '')) : Number(String(raw).replace(',', '.'));
    }
    function checkMsg(a, v, row) {
      var m = row.querySelector('[data-msg]'), txt = '';
      if (!isNum(v)) txt = 'Nhập một con số. Đang dùng giá trị trước: ' + fmt(kindOf(a), st.values[a.key]) + '.';
      else if (v < 0) txt = 'Giá trị âm có thể làm kết quả sai.';
      else if ((isNum(a.min) && v < a.min) || (isNum(a.max) && v > a.max)) txt = 'Ngoài khoảng gợi ý ' + fmt(kindOf(a), a.min) + ' đến ' + fmt(kindOf(a), a.max) + '. Hãy giải thích nếu cố ý.';
      m.textContent = txt; m.style.color = txt ? 'var(--pill-warning-ink, var(--text-muted))' : '';
    }
    function setSrc(key, tag) {
      st.src[key] = tag;
      var row = el.querySelector('[data-row="' + key + '"] [data-tag]');
      if (row) row.innerHTML = EP.ui.badge(TAGS[tag], TONES[tag]);
    }
    $('assump').addEventListener('input', function (e) {
      var t = e.target, key = t.getAttribute('data-key') || t.getAttribute('data-range'); if (!key) return;
      var a = byKey[key], row = t.closest('.sc-row'), v;
      if (t.hasAttribute('data-range')) {
        v = Number(t.value); var inp = row.querySelector('[data-key]'); inp.value = inputValue(a, v);
        if (EP.lucian && EP.lucian.refresh) EP.lucian.refresh(row);
      } else {
        v = readInput(a, t);
        var rg = row.querySelector('[data-range]'); if (rg && isNum(v)) rg.value = v;
      }
      checkMsg(a, v, row);
      if (isNum(v)) { st.values[key] = v; if (srcOf(key) !== 'assumption') setSrc(key, 'assumption'); persist(); update(); }
    });
    el.querySelector('.sc-spread-in').addEventListener('input', function (e) {
      var v = Number(e.target.value); if (!isFinite(v)) return;
      st.spread = Math.max(0, Math.min(50, v)); persist(); update();
    });

    /* --- chọn kịch bản / KPI / mức ± --- */
    var viewSeg = EP.ui.segmented($('view'), { label: 'Kịch bản đang xem', name: uid + '-view', value: st.view, options: scenarios().map(function (s) { return { value: s.id, label: s.label }; }), onChange: function (v) { st.view = v; update(); } });
    var kpiSeg = kpis.length > 1 ? EP.ui.segmented($('kpi-pick'), { label: 'Chỉ tiêu cần đo độ nhạy', name: uid + '-kpi', value: st.kpi, options: kpis.map(function (o) { return { value: o.key, label: o.label }; }), onChange: function (v) { st.kpi = v; persist(); update(); } }) : null;
    var pctSeg = EP.ui.segmented($('pct-pick'), { label: 'Mức thay đổi', name: uid + '-pct', value: String(st.pct), options: [{ value: '10', label: '±10%' }, { value: '20', label: '±20%' }], onChange: function (v) { st.pct = Number(v); persist(); update(); } });

    /* --- vẽ phần kết quả --- */
    function cellText(o, v) { return fmt(o.format, v, mqNarrow.matches && o.format === 'money'); }
    function drawResults() {
      var sc = scenarios(), rs = results(), cur = rs[st.view] || rs[sc[0].id], curScn = sc.filter(function (s) { return s.id === st.view; })[0] || sc[0];
      var cards = outputs.filter(function (o) { return o.card; });
      $('cards').innerHTML = cards.map(function (o) {
        var v = cur[o.key], bad = o.key === 'profit' && isNum(v) && v < 0;
        return EP.ui.kpi({ label: o.label, value: isNum(v) ? fmt(o.format, v, o.format === 'money') : NO_DATA, hint: isNum(v) && o.format === 'money' ? fmt('money', v) : (bad ? 'Đang lỗ' : curScn.label), tone: bad ? 'negative' : '' });
      }).join('');
      var shown = outputs.filter(function (o) { return sc.some(function (s) { return isNum(rs[s.id][o.key]) || o.key === 'beUnits'; }); });
      $('table').innerHTML = '<div class="table-wrap"><table class="sc-table"><caption class="sr-only">Kết quả theo kịch bản</caption><thead><tr><th scope="col">Chỉ tiêu</th>' +
        sc.map(function (s) { return '<th scope="col" class="num' + (s.id === st.view ? ' is-cur' : '') + '">' + esc(s.label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        shown.map(function (o) {
          return '<tr><th scope="row">' + esc(o.label) + '</th>' + sc.map(function (s) {
            var v = rs[s.id][o.key], neg = isNum(v) && v < 0 && (o.format === 'money' || o.format === 'percent');
            return '<td class="num' + (s.id === st.view ? ' is-cur' : '') + (neg ? ' neg' : '') + (isNum(v) ? '' : ' nodata') + '" title="' + esc(fmt(o.format, v)) + '">' + esc(cellText(o, v)) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
      var k = outDef(st.kpi) || kpis[0];
      if (k) {
        $('chart-title').textContent = k.label + ' theo kịch bản';
        EP.charts.bar($('chart'), sc.map(function (s) { var v = rs[s.id][k.key]; return { label: s.label, value: isNum(v) ? v : 0 }; }), { height: 200, format: function (v) { return fmt(k.format, v, true); }, title: k.label + ' theo kịch bản' });
      }
    }
    function drawTornado() {
      var k = outDef(st.kpi); if (!k) { $('tornado').innerHTML = ''; return; }
      var rows = sensitivity(cfg, st.values, st.kpi, st.pct), f = function (v) { return signed(k.format, v); };
      $('sens-note').textContent = 'Đo ' + k.label + ' khi đổi từng giả định ±' + st.pct + '% (các giả định khác giữ nguyên, kịch bản cơ sở). Thanh dài nhất = rủi ro lớn nhất, cần có số liệu chắc nhất và kế hoạch dự phòng.';
      if (!rows.length) { $('tornado').innerHTML = EP.ui.empty({ icon: 'chart', title: 'Chưa đo được độ nhạy', text: 'Chỉ tiêu này đang là "' + NO_DATA + '" hoặc không đổi theo giả định.' }); return; }
      EP.charts.tornado($('tornado'), rows.map(function (r) { return { label: r.label, low: r.low, high: r.high }; }), { format: f, lowLabel: 'Giảm ' + st.pct + '%', highLabel: 'Tăng ' + st.pct + '%', title: 'Độ nhạy của ' + k.label });
    }
    function drawExplain() {
      var rs = results(), cur = rs.base || rs[Object.keys(rs)[0]], a = st.values, items = [];
      (cfg.explain || []).forEach(function (x) { var live = ''; try { live = x.live ? x.live(a, cur, F) : ''; } catch (e) { live = ''; } items.push([x.label, x.formula, live]); });
      var be = cur.be;
      if (be) items.push(['Điểm hòa vốn', 'Hòa vốn (' + unit + ') = Chi phí cố định ÷ Lãi góp mỗi ' + unit + ';  Doanh thu hòa vốn = Hòa vốn × Giá bán',
        be.ok ? F.money(cur.fixed) + ' ÷ ' + F.money(cur.unitContribution) + ' = ' + F.number(be.units) + ' ' + unit + (be.revenue != null ? ' ≈ ' + F.money(be.revenue) : '') : NO_DATA + ': ' + be.reason]);
      if (isNum(cur.investment)) items.push(['Thời gian hoàn vốn', 'Hoàn vốn (tháng) = Vốn ban đầu ÷ Lợi nhuận mỗi tháng', isNum(cur.paybackMonths) ? F.money(cur.investment) + ' ÷ ' + F.money(cur.profit) + ' = ' + F.number(cur.paybackMonths) + ' tháng' : NO_DATA + ': lợi nhuận tháng <= 0 nên chưa hoàn vốn.']);
      var auto = !(cfg.scenarios && cfg.scenarios.length), sp = st.spread;
      items.push(['Kịch bản', auto ? 'Xấu / Tốt = mỗi giả định bất lợi / có lợi đổi ±' + sp + '%; Cơ sở = số bạn nhập' : 'Mỗi kịch bản là một bộ hệ số nhân hoặc giá trị cố định do nhóm khai báo',
        auto ? A.filter(function (x) { return x.better; }).map(function (x) { return x.label + (x.better === 'up' ? ' ↓/↑' : ' ↑/↓'); }).join(', ') + ' (bên trái = Xấu)' : scenarios().map(function (s) { return s.label; }).join(', ')]);
      items.push(['Độ nhạy', 'ΔKPI = KPI(giả định × (1 ± %)) - KPI(cơ sở), đổi MỘT giả định mỗi lần', 'Đang đo ±' + st.pct + '% trên ' + ((outDef(st.kpi) || {}).label || '')]);
      $('explain').innerHTML = items.map(function (it) {
        return '<div class="sc-ex"><dt>' + esc(it[0]) + '</dt><dd><code>' + esc(it[1] || '') + '</code>' + (it[2] ? '<span class="sc-live">' + esc(it[2]) + '</span>' : '') + '</dd></div>';
      }).join('');
    }
    var raf = 0;
    function update() { if (raf) return; raf = root.requestAnimationFrame ? root.requestAnimationFrame(function () { raf = 0; drawAll(); }) : (drawAll(), 0); }
    function drawAll() { drawResults(); drawTornado(); drawExplain(); EP.bus.emit('scenario:change', { id: id }); }
    drawAll();
    if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', drawResults);

    /* --- hành động --- */
    function exportCsv() { EP.export.csv((EP.config.prefix + 'kich-ban-' + id + '.csv').replace(/^_+/, ''), csvRows(), csvCols()); }
    function copyText(btn) { return EP.ui.copy(toText(), 'Đã sao chép bản tóm tắt để dán vào slide.'); }
    function reset() {
      A.forEach(function (a) { st.values[a.key] = a.value; delete st.src[a.key]; });
      persist();
      A.forEach(function (a) {
        var row = el.querySelector('[data-row="' + a.key + '"]'), inp = row.querySelector('[data-key]'), rg = row.querySelector('[data-range]');
        inp.value = inputValue(a, a.value); if (rg) rg.value = a.value; checkMsg(a, a.value, row); setSrc(a.key, srcOf(a.key)); delete st.src[a.key];
      });
      if (EP.lucian && EP.lucian.refresh) EP.lucian.refresh(el);
      update();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || !el.contains(b)) return;
      var act = b.getAttribute('data-act');
      if (act === 'csv') exportCsv(); else if (act === 'copy') copyText(b); else if (act === 'reset') { reset(); EP.ui.toast('Đã đặt lại giả định mặc định.', { type: 'success' }); }
    });

    var api = {
      id: id, assumptions: A, outputs: outputs,
      values: function () { return Object.assign({}, st.values); },
      setValue: function (key, v, o) {
        var a = byKey[key]; if (!a || !isNum(Number(v))) return false;
        st.values[key] = Number(v); setSrc(key, (o && o.source) || 'assumption'); persist();
        var row = el.querySelector('[data-row="' + key + '"]'), inp = row.querySelector('[data-key]'), rg = row.querySelector('[data-range]');
        inp.value = inputValue(a, Number(v)); if (rg) rg.value = Number(v);
        if (EP.lucian && EP.lucian.refresh) EP.lucian.refresh(row);
        checkMsg(a, Number(v), row); update(); return true;
      },
      compute: function (vals) { return evaluate(cfg, vals || st.values); },
      scenarios: scenarios, scenarioValues: function (sid) { return scenValues(scenarios().filter(function (s) { return s.id === sid; })[0]); },
      results: results,
      breakEven: function (sid) { return results()[sid || 'base'].be; },
      sensitivity: function (kpiKey, pct) { return sensitivity(cfg, st.values, kpiKey || st.kpi, pct || st.pct); },
      csvRows: csvRows, csvCols: csvCols, toText: toText, exportCsv: exportCsv, copyText: copyText, reset: reset, refresh: update
    };
    instances[id] = api;
    return api;
  }

  EP.scenario = { mount: mount, get: function (id) { return instances[id] || null; }, breakEven: breakEven, spread: spread, evaluate: evaluate, sensitivity: sensitivity, applyScenario: applyScenario, fmt: fmt, NO_DATA: NO_DATA, TAGS: TAGS };
})(window);
