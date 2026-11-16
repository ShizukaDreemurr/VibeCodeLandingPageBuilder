/* T3: So sánh nhiều sản phẩm, xếp theo tổng lãi hoặc biên lãi */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, M = EP.metrics, P = EP.profit;
  EP.register({
    id: 'so-sanh', label: 'So sánh', icon: 'chart', order: 30,
    title: 'So sánh lợi nhuận sản phẩm', desc: 'Xếp hạng sản phẩm theo tổng lãi hoặc biên lãi để biết nên đẩy hàng nào, ngừng hàng nào.',
    render: function (el) {
      var by = 'total';
      el.innerHTML = '<div class="row between"><div data-slot="by"></div></div><div class="card"><div class="card-head"><h2 class="section-title" data-slot="ct">Tổng lãi / tháng</h2></div><div data-slot="bar"></div></div>' +
        '<div class="card pad-0 flat"><div data-slot="table"></div></div>';
      var $ = function (n) { return el.querySelector('[data-slot="' + n + '"]'); };
      var table = EP.ui.table($('table'), { caption: 'Bảng xếp hạng lợi nhuận', rows: [], sort: { key: 'total', dir: 'desc' },
        empty: { title: 'Chưa có sản phẩm để so sánh', text: 'Vào tab Sản phẩm để thêm.' },
        columns: [
          { key: 'name', label: 'Sản phẩm', sort: true, render: function (r) { return '<div class="cell-main">' + r._rank + '. ' + esc(r.name) + '</div>'; } },
          { key: 'unit', label: 'Lãi / đơn', sort: true, type: 'number', num: true, render: function (r) { return P.calc(r).unit < 0 ? EP.ui.badge(M.vnd(P.calc(r).unit), 'negative') : esc(M.vnd(P.calc(r).unit)); }, value: function (r) { return P.calc(r).unit; } },
          { key: 'margin', label: 'Biên lãi', sort: true, type: 'number', num: true, render: function (r) { return esc(EP.fmt.percent(P.calc(r).margin, 1)); }, value: function (r) { return P.calc(r).margin; } },
          { key: 'total', label: 'Tổng lãi', sort: true, type: 'number', num: true, render: function (r) { return esc(M.vnd(P.calc(r).total)); }, value: function (r) { return P.calc(r).total; } }
        ] });
      function metric(r) { var c = P.calc(r); return by === 'total' ? c.total : by === 'margin' ? c.margin : c.unit; }
      function refresh() {
        var rows = P.products.list().sort(function (a, b) { return metric(b) - metric(a); });
        rows.forEach(function (r, i) { r._rank = i + 1; });
        table.setRows(rows);
        $('ct').textContent = by === 'total' ? 'Tổng lãi / tháng' : by === 'margin' ? 'Biên lãi (%)' : 'Lãi mỗi đơn';
        EP.charts.bar($('bar'), rows.map(function (r) { var v = metric(r); return { label: r.name, value: M.round(v, 1), color: v < 0 ? 'var(--danger)' : undefined }; }),
          { unit: by === 'margin' ? '%' : '₫', format: by === 'margin' ? function (v) { return EP.fmt.percent(v, 1); } : M.vndShort });
      }
      EP.ui.segmented($('by'), { label: 'Xếp theo', name: 'ss-by', value: 'total', onChange: function (v) { by = v; refresh(); },
        options: [{ value: 'total', label: 'Tổng lãi' }, { value: 'margin', label: 'Biên lãi' }, { value: 'unit', label: 'Lãi / đơn' }] });
      P.products.onChange(function () { if (root.document.body.contains(el)) refresh(); });
      EP.bus.on('demo:reset', refresh); EP.bus.on('restore', refresh);
      refresh();
    }
  });
})(window);
