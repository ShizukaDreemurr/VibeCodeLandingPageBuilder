/* T5 (xuất): Báo cáo text để copy + CSV */
(function (root) {
  'use strict';
  var EP = root.EP, M = EP.metrics, P = EP.profit;
  function build() {
    var rows = P.products.list().map(function (r) { return Object.assign({ c: P.calc(r) }, r); }).sort(function (a, b) { return b.c.total - a.c.total; });
    var total = rows.reduce(function (s, r) { return s + r.c.total; }, 0), fixed = rows.reduce(function (s, r) { return s + M.num(r.fixed); }, 0);
    var lines = ['BÁO CÁO LÃI LỖ - ' + EP.fmt.today(), '------------------------------'];
    if (!rows.length) return lines.concat('Chưa có sản phẩm.').join('\n');
    rows.forEach(function (r, i) {
      lines.push((i + 1) + '. ' + r.name + ': lãi ' + M.vnd(r.c.unit) + '/đơn, biên ' + EP.fmt.percent(r.c.margin, 1) + ', ' + EP.fmt.number(r.qty) + ' đơn -> ' + M.vnd(r.c.total) + (r.c.unit < 0 ? ' [ĐANG LỖ]' : ''));
    });
    lines.push('------------------------------', 'Tổng lãi gộp: ' + M.vnd(total), 'Chi phí cố định: ' + M.vnd(fixed), 'Lãi ròng dự kiến: ' + M.vnd(total - fixed));
    var loss = rows.filter(function (r) { return r.c.unit < 0; });
    if (loss.length) lines.push('Cần xử lý: ' + loss.map(function (r) { return r.name; }).join(', '));
    return lines.join('\n');
  }
  EP.register({
    id: 'bao-cao', label: 'Báo cáo', icon: 'print', order: 50,
    title: 'Báo cáo lãi lỗ', desc: 'Tổng hợp thành văn bản để dán vào Zalo, email hoặc tải CSV mở bằng Excel.',
    actions: function () { return '<button type="button" class="btn" data-act="csv">' + EP.ui.icon('download') + 'Tải CSV</button><button type="button" class="btn btn-primary" data-act="copy">' + EP.ui.icon('copy') + 'Sao chép báo cáo</button>'; },
    render: function (el) {
      el.innerHTML = '<div class="card"><pre id="bc-text" style="white-space:pre-wrap;margin:0;font:inherit" tabindex="0" aria-label="Nội dung báo cáo"></pre></div>';
      var pre = el.querySelector('#bc-text');
      function refresh() { pre.textContent = build(); }
      el.closest('.view').querySelector('.view-actions').onclick = function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        var rows = P.products.list();
        if (b.getAttribute('data-act') === 'copy') EP.ui.copy(build(), 'Đã sao chép báo cáo.');
        else if (!rows.length) EP.ui.toast('Chưa có dữ liệu để xuất.', { type: 'warn' });
        else EP.export.csv('lai-lo-' + EP.fmt.today() + '.csv', rows, [
          { key: 'name', label: 'Sản phẩm' }, { key: 'price', label: 'Giá bán' }, { key: 'cost', label: 'Giá vốn' }, { key: 'feePct', label: 'Phí sàn %' },
          { key: 'shipping', label: 'Ship' }, { key: 'ads', label: 'Quảng cáo' }, { key: 'qty', label: 'Đơn/tháng' },
          { label: 'Lãi/đơn', key: 'unit', value: function (r) { return Math.round(P.calc(r).unit); } }, { label: 'Biên lãi %', key: 'm', value: function (r) { return M.round(P.calc(r).margin, 1); } },
          { label: 'Tổng lãi/tháng', key: 't', value: function (r) { return Math.round(P.calc(r).total); } }]);
      };
      P.products.onChange(function () { if (root.document.body.contains(el)) refresh(); });
      EP.bus.on('demo:reset', refresh); EP.bus.on('restore', refresh);
      refresh();
    }
  });
})(window);
