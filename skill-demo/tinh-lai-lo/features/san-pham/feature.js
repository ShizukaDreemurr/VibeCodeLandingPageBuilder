/* T1 + T5 (lưu): Nhập và quản lý sản phẩm. Cũng đặt công thức lợi nhuận dùng chung: EP.profit */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, M = EP.metrics;
  var products = EP.collection('products');

  /* Công thức một chỗ duy nhất (code tính, AI không tự tính số). Mọi giá trị là VND / đơn. */
  EP.profit = {
    products: products,
    calc: function (p) {
      var price = M.num(p.price), cost = M.num(p.cost), fee = price * M.num(p.feePct) / 100;
      var ship = M.num(p.shipping), ads = M.num(p.ads), qty = M.num(p.qty), fixed = M.num(p.fixed);
      var unit = price - cost - fee - ship - ads;
      return {
        fee: fee, unit: unit, margin: M.div(unit, price) * 100, qty: qty,
        total: unit * qty, revenue: price * qty,
        breakEven: unit > 0 ? Math.ceil(fixed / unit) : null,   // null = không bao giờ hòa vốn
        minPrice: EP.profit.priceFor(p, 0)
      };
    },
    /* Giá bán tối thiểu để đạt biên lãi mong muốn (marginPct, mặc định 0 = hòa vốn trên mỗi đơn) */
    priceFor: function (p, marginPct) {
      var rate = 1 - M.num(p.feePct) / 100 - M.num(marginPct) / 100;
      return rate <= 0 ? null : Math.ceil((M.num(p.cost) + M.num(p.shipping) + M.num(p.ads)) / rate);
    },
    tone: function (u) { return u < 0 ? 'negative' : u === 0 ? 'warning' : 'positive'; }
  };

  var SCHEMA = {
    name:     { label: 'Tên sản phẩm', type: 'text', rules: { required: true, maxLength: 80 }, span2: true, autocomplete: 'off' },
    price:    { label: 'Giá bán (₫)', type: 'number', rules: { required: true, min: 1000, max: 1e9, integer: true } },
    cost:     { label: 'Giá vốn (₫)', type: 'number', rules: { required: true, min: 0, max: 1e9, integer: true } },
    feePct:   { label: 'Phí sàn (%)', type: 'number', rules: { required: true, min: 0, max: 50 }, hint: 'Gồm phí cố định, thanh toán, hoa hồng' },
    shipping: { label: 'Phí vận chuyển / đơn (₫)', type: 'number', rules: { required: true, min: 0, max: 1e7, integer: true } },
    ads:      { label: 'Quảng cáo / đơn (₫)', type: 'number', rules: { required: true, min: 0, max: 1e7, integer: true } },
    qty:      { label: 'Số đơn dự kiến / tháng', type: 'number', rules: { required: true, min: 0, max: 1e6, integer: true } },
    fixed:    { label: 'Chi phí cố định / tháng (₫)', type: 'number', rules: { min: 0, max: 1e9, integer: true }, hint: 'Mặt bằng, đóng gói... Không bắt buộc' }
  };
  EP.profit.SCHEMA = SCHEMA;

  EP.demo.register('products', { version: 1, rows: [
    { name: 'Áo thun cotton basic', price: 159000, cost: 62000, feePct: 12, shipping: 18000, ads: 12000, qty: 320, fixed: 4000000 },
    { name: 'Túi tote canvas in hình', price: 119000, cost: 45000, feePct: 12, shipping: 15000, ads: 9000, qty: 210, fixed: 1500000 },
    { name: 'Son dưỡng môi 4g', price: 89000, cost: 38000, feePct: 14, shipping: 17000, ads: 8000, qty: 540, fixed: 2000000 },
    { name: 'Tai nghe bluetooth mini', price: 249000, cost: 185000, feePct: 13, shipping: 22000, ads: 25000, qty: 90, fixed: 3000000 },
    { name: 'Ốp lưng điện thoại', price: 69000, cost: 21000, feePct: 14, shipping: 16000, ads: 6000, qty: 700, fixed: 1000000 }
  ] });

  var COLS = [
    { key: 'name', label: 'Sản phẩm', sort: true, render: function (r) { return '<div class="cell-main">' + esc(r.name) + '</div><div class="cell-sub">Vốn ' + esc(M.vnd(r.cost)) + ' · phí sàn ' + esc(EP.fmt.percent(r.feePct, 1)) + '</div>'; } },
    { key: 'price', label: 'Giá bán', sort: true, type: 'number', num: true, render: function (r) { return esc(M.vnd(r.price)); } },
    { key: 'unit', label: 'Lãi / đơn', sort: true, type: 'number', num: true, value: function (r) { return EP.profit.calc(r).unit; }, render: function (r) { var c = EP.profit.calc(r); return EP.ui.badge(M.vnd(c.unit), EP.profit.tone(c.unit)); } },
    { key: 'margin', label: 'Biên lãi', sort: true, type: 'number', num: true, value: function (r) { return EP.profit.calc(r).margin; }, render: function (r) { return esc(EP.fmt.percent(EP.profit.calc(r).margin, 1)); } },
    { key: 'qty', label: 'Đơn / tháng', sort: true, type: 'number', num: true, render: function (r) { return esc(EP.fmt.number(r.qty)); } }
  ];

  EP.register({
    id: 'san-pham', label: 'Sản phẩm', icon: 'list', order: 10,
    title: 'Danh sách sản phẩm', desc: 'Nhập giá vốn, giá bán, phí sàn, ship, quảng cáo. Lãi mỗi đơn tự tính, dữ liệu lưu trong trình duyệt.',
    summary: function () {
      var rows = products.list(), total = rows.reduce(function (s, r) { return s + EP.profit.calc(r).total; }, 0), loss = rows.filter(function (r) { return EP.profit.calc(r).unit < 0; }).length;
      return [{ label: 'Sản phẩm đang theo dõi', value: String(rows.length), hint: loss ? loss + ' sản phẩm đang lỗ' : 'Không có sản phẩm lỗ' },
              { label: 'Lãi dự kiến / tháng', value: M.vndShort(total), hint: 'Chưa trừ chi phí cố định' }];
    },
    actions: function () { return '<button type="button" class="btn btn-primary" data-act="add">' + EP.ui.icon('plus') + 'Thêm sản phẩm</button>'; },
    render: function (el) {
      el.innerHTML = '<div class="card pad-0 flat"><div data-slot="table"></div></div>';
      var table = EP.ui.table(el.querySelector('[data-slot="table"]'), {
        caption: 'Danh sách sản phẩm', columns: COLS, rows: [], sort: { key: 'unit', dir: 'asc' },
        actions: function (r) { return '<button type="button" class="btn btn-sm btn-ghost" data-act="edit" aria-label="Sửa ' + esc(r.name) + '">' + EP.ui.icon('edit') + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="delete" aria-label="Xóa ' + esc(r.name) + '">' + EP.ui.icon('trash') + '</button>'; },
        empty: { title: 'Chưa có sản phẩm nào', text: 'Thêm sản phẩm đầu tiên để xem lãi lỗ từng đơn.', action: { label: 'Thêm sản phẩm', act: 'add' } },
        onAction: function (act, id) { if (act === 'edit') openForm(products.get(id)); else if (act === 'delete') remove(id); },
        onEmptyAction: function () { openForm(); }
      });
      function refresh() { table.setRows(products.list()); }
      function openForm(row) {
        var fid = 'sp-form-' + EP.uid();
        var d = EP.ui.dialog({ title: row ? 'Sửa sản phẩm' : 'Thêm sản phẩm', size: 'wide',
          body: '<form class="form" id="' + fid + '" novalidate>' + EP.form.render(SCHEMA, row || { feePct: 12, shipping: 0, ads: 0, qty: 100, fixed: 0 }) + '</form><p class="muted mt-3" data-slot="live" aria-live="polite"></p>',
          actions: [{ label: 'Hủy', value: null }, { label: row ? 'Lưu thay đổi' : 'Thêm sản phẩm', variant: 'primary', type: 'submit', form: fid, id: 'sp-save' }] });
        var f = d.body.querySelector('form'), live = d.body.querySelector('[data-slot="live"]');
        function preview() {
          var vals = {}; Array.prototype.forEach.call(f.elements, function (x) { if (x.name) vals[x.name] = x.value === '' ? '' : (x.type === 'number' ? Number(x.value) : x.value); });
          if (!vals.price) { live.textContent = ''; return; }
          var c = EP.profit.calc(vals); live.textContent = 'Lãi mỗi đơn: ' + M.vnd(c.unit) + ' (biên ' + EP.fmt.percent(c.margin, 1) + ')' + (c.unit < 0 ? ' - đang lỗ!' : '');
        }
        f.addEventListener('input', preview); preview();
        EP.form.bind(f, SCHEMA, { onSubmit: function (v) {
          v.fixed = v.fixed || 0;
          if (M.num(v.cost) >= M.num(v.price)) { EP.ui.toast('Lưu ý: giá vốn không thấp hơn giá bán, sản phẩm này sẽ lỗ.', { type: 'warn' }); }
          if (row) products.update(row.id, v); else products.add(v);
          d.close(true); EP.ui.toast(row ? 'Đã lưu thay đổi.' : 'Đã thêm sản phẩm.', { type: 'success' });
        } });
      }
      function remove(id) {
        var r = products.get(id); if (!r) return;
        EP.ui.confirm({ title: 'Xóa sản phẩm này?', message: '"' + r.name + '" sẽ bị xóa khỏi danh sách.', confirmLabel: 'Xóa', danger: true }).then(function (ok) {
          if (!ok) return; products.remove(id);
          EP.ui.toast('Đã xóa "' + r.name + '".', { type: 'success', action: { label: 'Hoàn tác', onClick: function () { products.add(r); } } });
        });
      }
      el.closest('.view').querySelector('.view-actions').onclick = function (e) { if (e.target.closest('[data-act="add"]')) openForm(); };
      products.onChange(function () { if (root.document.body.contains(el)) refresh(); });
      EP.bus.on('demo:reset', refresh); EP.bus.on('restore', refresh);
      refresh();
    }
  });
})(window);
