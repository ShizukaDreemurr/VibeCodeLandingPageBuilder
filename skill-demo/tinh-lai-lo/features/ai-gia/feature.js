/* T4: AI đề xuất giá bán tối thiểu + 2 phương án khuyến mãi không làm lỗ.
   Số liệu do code tính (EP.profit.priceFor); AI chỉ viết lời giải thích. Mọi giá AI trả về bị kẹp lại >= giá hòa vốn. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, M = EP.metrics, P = EP.profit;

  function plan(p) {   // phần số do code quyết định
    var c = P.calc(p), floor = P.priceFor(p, 0), target = P.priceFor(p, 15);
    var promos = [], disc = [10, 20];
    disc.forEach(function (d) {
      var price = Math.round(M.num(p.price) * (1 - d / 100));
      var q = Object.assign({}, p, { price: price }), u = P.calc(q).unit;
      promos.push({ discountPct: d, price: price, unitProfit: Math.round(u), safe: price >= floor && u >= 0 });
    });
    return { current: p.price, unit: c.unit, floor: floor, target: target, promos: promos };
  }
  var SPEC = {
    id: 'goi-y-gia',
    prompt: function (i) {
      return 'Bạn là cố vấn bán hàng online cho shop nhỏ tại Việt Nam, nói ngắn gọn, dễ hiểu.\nSản phẩm: ' + i.name + '. Giá bán ' + i.price + '₫, giá vốn ' + i.cost + '₫, phí sàn ' + i.feePct + '%, ship ' + i.shipping + '₫, quảng cáo ' + i.ads + '₫ mỗi đơn.\n' +
        'Giá hòa vốn mỗi đơn đã tính sẵn là ' + i.floor + '₫; giá mục tiêu biên 15% là ' + i.target + '₫. KHÔNG tự tính lại số, KHÔNG đề xuất giá dưới ' + i.floor + '₫.\nViết: nhận định ngắn, lời khuyên cho mỗi phương án khuyến mãi (giảm ' + i.promos[0].discountPct + '% và ' + i.promos[1].discountPct + '%).';
    },
    schema: { type: 'object', props: {
      verdict: { type: 'string', max: 240 },
      minPrice: { type: 'number', min: 0 },
      options: { type: 'array', min: 2, max: 2, of: { type: 'object', props: { title: { type: 'string', max: 60 }, price: { type: 'number', min: 0 }, advice: { type: 'string', max: 200 } } } }
    } },
    mock: function (i) {   // tất định, phụ thuộc đúng đầu vào
      var losing = i.unit < 0, m = i.price ? i.unit / i.price * 100 : 0;
      return {
        verdict: losing ? i.name + ' đang lỗ ' + M.vnd(-i.unit) + ' mỗi đơn ở giá ' + M.vnd(i.price) + '. Nên nâng giá lên tối thiểu ' + M.vnd(i.floor) + ' hoặc cắt chi phí quảng cáo.'
          : i.name + ' lãi ' + M.vnd(i.unit) + ' mỗi đơn (biên ' + EP.fmt.percent(m, 1) + '). Giá hòa vốn là ' + M.vnd(i.floor) + ', để biên 15% nên bán ở ' + M.vnd(i.target) + ' trở lên.',
        minPrice: i.floor,
        options: i.promos.map(function (p) {
          if (!p.safe) return { title: 'Không nên giảm ' + p.discountPct + '%, giữ tối thiểu ' + M.vnd(i.floor), price: Math.max(p.price, i.floor), advice: 'Giảm ' + p.discountPct + '% còn ' + M.vnd(p.price) + ' thấp hơn giá hòa vốn ' + M.vnd(i.floor) + ', mỗi đơn sẽ lỗ. Chỉ nên dùng để xả hàng tồn.' };
          return { title: 'Giảm ' + p.discountPct + '% còn ' + M.vnd(p.price), price: p.price,
            advice: p.safe ? 'Vẫn lãi ' + M.vnd(p.unitProfit) + '/đơn. Phù hợp chạy flash sale ngắn, cần bán thêm ' + (p.unitProfit > 0 ? Math.ceil(i.unit / p.unitProfit * 100 - 100) : 0) + '% số đơn để bù.' : 'Mức giảm này làm lỗ hoặc sát giá vốn, chỉ nên dùng để xả hàng tồn.' };
        })
      };
    }
  };

  EP.register({
    id: 'ai-gia', label: 'AI gợi ý giá', icon: 'sparkles', order: 40,
    title: 'AI gợi ý giá và khuyến mãi', desc: 'Chọn sản phẩm, AI đề xuất giá tối thiểu và 2 phương án khuyến mãi không làm lỗ.',
    render: function (el) {
      var last = null, ctx = null;
      el.innerHTML = '<div class="card"><div class="card-head"><h2 class="section-title">' + EP.ui.icon('sparkles') + ' Chọn sản phẩm</h2><div data-slot="mode"></div></div>' +
        '<form class="form" id="ag-form" novalidate><div class="field"><select class="input" id="ag-pick" name="pid" aria-label="Sản phẩm"></select></div>' +
        '<div class="row"><button type="submit" class="btn btn-ai" id="ag-go">' + EP.ui.icon('sparkles') + 'Gợi ý giá</button></div></form>' +
        '<div data-slot="out" class="mt-3" aria-live="polite"></div></div>';
      var $ = function (n) { return el.querySelector('[data-slot="' + n + '"]'); };
      var sel = el.querySelector('#ag-pick'), out = $('out');
      EP.ai.mountModePicker($('mode'));
      function fillSel() {
        var rows = P.products.list(), keep = sel.value;
        sel.innerHTML = rows.length ? rows.map(function (r) { return '<option value="' + esc(r.id) + '">' + esc(r.name) + '</option>'; }).join('') : '<option value="">(chưa có sản phẩm)</option>';
        if (keep) sel.value = keep;
        el.querySelector('#ag-go').disabled = !rows.length;
      }
      function draw() {
        if (!last) { out.innerHTML = ''; return; }
        var r = last.res.data, c = last.ctx, floor = c.floor;
        out.innerHTML = '<div class="ai-result"><h3>' + esc(c.name) + '</h3><p>' + esc(r.verdict) + '</p>' +
          '<div class="grid kpis" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">' + [
            { label: 'Giá hiện tại', value: M.vnd(c.price) }, { label: 'Giá tối thiểu (hòa vốn)', value: M.vnd(floor), tone: 'warning' }, { label: 'Giá mục tiêu (biên 15%)', value: M.vnd(c.target), tone: 'positive' }].map(EP.ui.kpi).join('') + '</div>' +
          '<div class="grid cols-2 mt-3">' + r.options.map(function (o) { return '<div class="card flat"><h4>' + esc(o.title) + '</h4><p>' + esc(o.advice) + '</p></div>'; }).join('') + '</div>' +
          EP.ai.noticeHtml(last.res) +
          '<div class="row"><button type="button" class="btn" data-act="copy">' + EP.ui.icon('copy') + 'Sao chép</button></div></div>';
      }
      EP.form.bind(el.querySelector('#ag-form'), {}, { onSubmit: function () {
        var p = P.products.get(sel.value); if (!p) { EP.ui.toast('Hãy chọn một sản phẩm.', { type: 'warn' }); return; }
        var pl = plan(p), input = { name: p.name, price: p.price, cost: p.cost, feePct: p.feePct, shipping: p.shipping, ads: p.ads, unit: pl.unit, floor: pl.floor, target: pl.target, promos: pl.promos };
        if (pl.floor == null) { out.innerHTML = EP.ui.error({ title: 'Không tính được giá', text: 'Phí sàn quá cao nên không có mức giá nào hòa vốn.' }); return; }
        out.innerHTML = EP.ui.skeleton(2); last = null;
        return EP.ai.generate(SPEC, { input: input, onSwitch: function (m) { EP.ui.toast('Đã chuyển sang model ' + m, { type: 'info' }); } }).then(function (res) {
          var d = res.data, warn = res.warnings || [];
          // Kiểm soát: AI không được đề xuất giá dưới hòa vốn
          d.minPrice = Math.max(M.num(d.minPrice), input.floor);
          d.options.forEach(function (o) { if (M.num(o.price) < input.floor) { o.price = input.floor; o.advice = 'Giá AI đề xuất thấp hơn hòa vốn nên đã nâng lên ' + M.vnd(input.floor) + '. ' + o.advice; if (warn.indexOf('Đã chỉnh giá AI thấp hơn hòa vốn.') < 0) warn = warn.concat('Đã chỉnh giá AI thấp hơn hòa vốn.'); } });
          res.warnings = warn; last = { res: res, ctx: input }; draw();
        }, function (err) { if (err.kind !== 'cancel') out.innerHTML = EP.ui.error({ title: 'Chưa tạo được gợi ý', text: err.message }); });
      } });
      out.addEventListener('click', function (e) {
        if (!e.target.closest('[data-act="copy"]') || !last) return;
        var r = last.res.data; EP.ui.copy(last.ctx.name + '\n' + r.verdict + '\n' + r.options.map(function (o) { return '- ' + o.title + ': ' + o.advice; }).join('\n') + '\n[' + EP.ai.MOCK_NOTICE + ']');
      });
      P.products.onChange(function () { if (root.document.body.contains(el)) fillSel(); });
      EP.bus.on('demo:reset', fillSel); EP.bus.on('restore', fillSel);
      fillSel();
    }
  });
})(window);
