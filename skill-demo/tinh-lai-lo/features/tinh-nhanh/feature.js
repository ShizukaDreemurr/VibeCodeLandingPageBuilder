/* T2: Máy tính nhanh lãi lỗ + điểm hòa vốn theo số lượng (không cần lưu sản phẩm) */
(function (root) {
  'use strict';
  var EP = root.EP, M = EP.metrics, SCHEMA = EP.profit.SCHEMA;
  var QUICK = {
    name: { label: 'Tên sản phẩm (tuỳ chọn)', type: 'text', rules: { maxLength: 80 }, span2: true }
  };
  Object.keys(SCHEMA).forEach(function (k) { if (k !== 'name') QUICK[k] = SCHEMA[k]; });
  EP.register({
    id: 'tinh-nhanh', label: 'Tính nhanh', icon: 'calc', order: 20,
    title: 'Tính lãi lỗ và điểm hòa vốn', desc: 'Gõ số, thấy ngay lãi mỗi đơn, biên lợi nhuận và cần bán bao nhiêu đơn để hòa vốn.',
    render: function (el) {
      var host = root.document.createElement('div'); el.appendChild(host);
      EP.calc.mount(host, {
        title: 'Nhập số liệu', schema: QUICK,
        defaults: { price: 159000, cost: 62000, feePct: 12, shipping: 18000, ads: 12000, qty: 300, fixed: 4000000 },
        compute: function (v) {
          var c = EP.profit.calc(v), notes = [], pts = [];
          if (c.unit < 0) notes.push('Mỗi đơn đang lỗ ' + M.vnd(-c.unit) + '. Giá bán tối thiểu để hòa vốn từng đơn: ' + M.vnd(c.minPrice) + '.');
          else if (c.breakEven == null) notes.push('Lãi mỗi đơn bằng 0 nên không thể hòa vốn.');
          else if (c.breakEven > c.qty) notes.push('Cần ' + EP.fmt.number(c.breakEven) + ' đơn để hòa vốn, cao hơn dự kiến ' + EP.fmt.number(c.qty) + ' đơn/tháng: tháng này vẫn lỗ.');
          else notes.push('Dự kiến ' + EP.fmt.number(c.qty) + ' đơn/tháng vượt điểm hòa vốn ' + EP.fmt.number(c.breakEven) + ' đơn.');
          var top = Math.max(c.qty, c.breakEven || 0, 10) * 1.5;
          for (var i = 0; i <= 5; i++) { var q = Math.round(top / 5 * i); pts.push({ label: EP.fmt.number(q) + ' đơn', value: Math.round(c.unit * q - M.num(v.fixed)) }); }
          return {
            kpis: [{ label: 'Lãi mỗi đơn', value: M.vndShort(c.unit), hint: M.vnd(c.unit), tone: EP.profit.tone(c.unit) }, { label: 'Biên lợi nhuận', value: EP.fmt.percent(c.margin, 1) },
                   { label: 'Hòa vốn', value: c.breakEven == null ? 'Không' : EP.fmt.number(c.breakEven) + ' đơn' }],
            rows: [['Phí sàn / đơn', M.vnd(c.fee)], ['Lãi dự kiến / tháng (sau chi phí cố định)', M.vnd(c.total - M.num(v.fixed))], ['Doanh thu dự kiến / tháng', M.vnd(c.revenue)]],
            notes: notes, chart: { type: 'line', data: pts, opts: { unit: '₫', format: M.vndShort, area: true } }
          };
        }
      });
    }
  });
})(window);
