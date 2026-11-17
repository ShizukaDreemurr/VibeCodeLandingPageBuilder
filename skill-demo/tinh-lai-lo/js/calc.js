/* calc.js - máy tính "form -> kết quả" cập nhật trực tiếp (tính lãi/lỗ, ngân sách, phí vận chuyển, voucher...).
     var c = EP.calc.mount(el, {
       title: 'Tính lợi nhuận',
       schema: { price: { label: 'Giá bán', type: 'number', rules: { required: true, min: 0 } }, cost: {...}, qty: {...} },
       defaults: { price: 250000, cost: 150000, qty: 10 },
       compute: function (v) { return {                              // chỉ chạy khi form HỢP LỆ
         kpis: [{ label: 'Lợi nhuận', value: EP.metrics.vnd(...), delta: 12.5 }],
         rows: [['Doanh thu', EP.metrics.vnd(...)], ...],            // bảng khoá - giá trị (tuỳ chọn)
         notes: ['Gợi ý...'], chart: { type: 'bar'|'donut'|'line', data: [{label,value}] } // tuỳ chọn
       }; },
       onResult: function (res, values) {}                           // tuỳ chọn (lưu lịch sử...)
     });
     c.values(), c.result(), c.run() */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;
  function mount(el, o) {
    var last = null;
    el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Nhập số liệu') + '</h2></div>' +
      '<form class="form" novalidate data-calc-form>' + EP.form.render(o.schema, o.defaults || {}) + '</form></div>' +
      '<div class="card" aria-live="polite" data-calc-out></div></div>';
    var out = el.querySelector('[data-calc-out]');
    function draw(res) {
      if (!res) { out.innerHTML = EP.ui.empty({ icon: 'calc', title: 'Nhập đủ số liệu hợp lệ', text: 'Kết quả sẽ hiện ngay tại đây.' }); return; }
      out.innerHTML = '<div class="card-head"><h2 class="section-title">Kết quả</h2></div>' +
        (res.kpis && res.kpis.length ? '<div class="grid kpis" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">' + res.kpis.map(EP.ui.kpi).join('') + '</div>' : '') +
        (res.rows && res.rows.length ? '<dl class="kv mt-3">' + res.rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' : '') +
        (res.chart ? '<div class="mt-3" data-calc-chart></div>' : '') +
        (res.notes && res.notes.length ? '<ul class="list-plain mt-3">' + res.notes.map(function (n) { return '<li>' + EP.ui.icon('info') + '<span>' + esc(n) + '</span></li>'; }).join('') + '</ul>' : '');
      if (res.chart) EP.charts[res.chart.type || 'bar'](out.querySelector('[data-calc-chart]'), res.chart.data, res.chart.opts || {});
    }
    var form = EP.form.bind(el.querySelector('[data-calc-form]'), o.schema, { onChange: EP.debounce(run, 80) });
    el.querySelector('[data-calc-form]').addEventListener('change', run);
    function run() {
      var v = form.values(), chk = EP.form.validate(o.schema, v);
      last = chk.ok ? o.compute(v) : null;
      draw(last);
      if (last && o.onResult) o.onResult(last, v);
      return last;
    }
    run();
    return { values: form.values, result: function () { return last; }, run: run };
  }
  EP.calc = { mount: mount };
})(window);
