/* FEATURE "Mô-đun mẫu": minh hoạ nhanh các mô-đun tiện ích trong js/ (calc, checklist, quiz, chat + match, mock, metrics).
   Chép từng đoạn sang feature thật của bạn rồi XOÁ thư mục này + dòng <script> của nó trong index.html khi nộp bài. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  var FAQ = [
    { q: 'Giá sản phẩm bao nhiêu', keywords: ['giá', 'bao nhiêu', 'giá cả'], a: 'Sản phẩm có giá từ 99.000 ₫. Miễn phí vận chuyển cho đơn từ 300.000 ₫.' },
    { q: 'Giờ mở cửa', keywords: ['mở cửa', 'giờ làm việc', 'mấy giờ'], a: 'Cửa hàng mở cửa 8:00 - 21:00 mỗi ngày.' },
    { q: 'Đổi trả hàng', keywords: ['đổi trả', 'hoàn tiền', 'bảo hành'], a: 'Bạn được đổi trả trong 7 ngày nếu sản phẩm còn nguyên tem.' }
  ];
  var QUESTIONS = [
    { q: 'Thủ đô của Việt Nam là gì?', options: ['Đà Nẵng', 'Hà Nội', 'Huế', 'Cần Thơ'], answer: 1, explain: 'Hà Nội là thủ đô từ năm 1010.' },
    { q: '2 + 2 × 3 bằng bao nhiêu?', options: ['12', '8', '10', '6'], answer: 1, explain: 'Nhân trước, cộng sau: 2 + 6 = 8.' },
    { q: 'CSS viết tắt của cụm từ nào?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], answer: 0, explain: 'Cascading Style Sheets.' }
  ];
  var CHECK = [
    { id: 'title', label: 'Trang có tiêu đề rõ ràng', weight: 25, hint: 'Thêm thẻ <title> 10-60 ký tự.' },
    { id: 'desc', label: 'Có mô tả meta description', weight: 25, hint: 'Viết 120-160 ký tự.' },
    { id: 'h1', label: 'Có đúng một thẻ h1', weight: 30, hint: 'Mỗi trang một h1.' },
    { id: 'viewport', label: 'Có meta viewport cho di động', weight: 20, hint: 'Thêm width=device-width.' }
  ];


  /* ---------- Thư viện UI: mỗi thẻ là một mẫu để chép (lớp Lucian: css/lucian.css + js/lucian.js) ---------- */
  function code(t) { return '<pre class="lx-code" aria-label="Mã mẫu">' + esc(t) + '</pre>'; }
  function sec(id, title, sub, body, cls) { return '<section class="card ' + (cls || '') + '" id="lx-' + id + '" aria-labelledby="lx-' + id + '-h"><div class="card-head"><h2 class="section-title" id="lx-' + id + '-h">' + esc(title) + '</h2></div>' + (sub ? '<p class="muted" style="margin:-6px 0 14px">' + sub + '</p>' : '') + body + '</section>'; }
  var TABLE_ROWS = [
    { id: 1, name: 'Cà phê muối', cat: 'Đồ uống', qty: 128, price: 35000, day: '2026-11-02' },
    { id: 2, name: 'Bánh mì que', cat: 'Đồ ăn', qty: 342, price: 12000, day: '2026-11-03' },
    { id: 3, name: 'Trà đào cam sả', cat: 'Đồ uống', qty: 96, price: 42000, day: '2026-11-05' },
    { id: 4, name: 'Xôi xéo', cat: 'Đồ ăn', qty: 77, price: 25000, day: '2026-11-06' },
    { id: 5, name: 'Sinh tố bơ', cat: 'Đồ uống', qty: 54, price: 48000, day: '2026-11-07' },
    { id: 6, name: 'Bánh cuốn', cat: 'Đồ ăn', qty: 211, price: 30000, day: '2026-11-08' },
    { id: 7, name: 'Nước cam ép', cat: 'Đồ uống', qty: 160, price: 38000, day: '2026-11-09' },
    { id: 8, name: 'Chè khúc bạch', cat: 'Tráng miệng', qty: 63, price: 32000, day: '2026-11-10' },
    { id: 9, name: 'Phở cuốn', cat: 'Đồ ăn', qty: 88, price: 55000, day: '2026-11-11' },
    { id: 10, name: 'Matcha đá xay', cat: 'Đồ uống', qty: 45, price: 52000, day: '2026-11-12' }
  ];
  var UI_SCHEMA = {
    name: { label: 'Tên khách', type: 'text', rules: { required: true, maxLength: 30 }, hint: 'Gõ quá 30 ký tự để thấy bộ đếm đổi màu.' },
    price: { label: 'Số tiền (₫)', type: 'money', rules: { required: true, min: 1000 }, hint: 'Gõ 1250000 -> 1.250.000 ngay khi gõ.' },
    kind: { label: 'Nhóm khách', type: 'select', rules: { required: true }, options: [{ value: 'new', label: 'Khách mới' }, { value: 'back', label: 'Khách quay lại' }, { value: 'vip', label: 'Khách thân thiết' }] },
    phone: { label: 'Số điện thoại', type: 'tel', rules: { required: true, phone: true } },
    note: { label: 'Ghi chú', type: 'textarea', span2: true, rules: { maxLength: 80 } },
    vip: { label: 'Gửi tin nhắn cảm ơn', type: 'checkbox', switch: true, span2: true }
  };

  function mountUi(el) {
    var lx = EP.lucian;
    if (!lx) { el.innerHTML = EP.ui.error({ title: 'Chưa nạp js/lucian.js', text: 'Thêm css/lucian.css và js/lucian.js vào index.html.' }); return; }
    var M = EP.metrics;
    el.innerHTML = '<div class="lx-demo-grid">' +
      sec('btn', 'Nút', 'Ấn lò xo, nhãn cuộn khi rê, sao chép thành dấu tích, giữ để xác nhận, đang chạy.',
        '<div class="row"><button type="button" class="btn btn-primary">Lưu</button><button type="button" class="btn btn-cta" data-act="cta">Bắt đầu ngay</button><button type="button" class="btn btn-ai" data-act="ai">' + EP.ui.icon('sparkles') + 'Viết bằng AI</button></div>' +
        '<div class="row mt-3"><button type="button" class="btn" data-copy="https://ten-mien.vn/don-hang/123">' + EP.ui.icon('copy') + 'Sao chép liên kết</button><button type="button" class="btn" data-act="busy">Chạy 2 giây</button><button type="button" class="btn btn-danger" data-act="hold">' + EP.ui.icon('trash') + 'Xóa dữ liệu mẫu</button></div>' +
        code('<button class="btn btn-cta">Nhãn cuộn</button>   // .btn-cta hoặc data-roll\n<button class="btn" data-copy="chuỗi hoặc #selector">Sao chép</button>\nEP.ui.confirm({ title, message, danger: true, hold: true })   // giữ 0,9 giây\nEP.ui.busy(btn, true)   // vệt sáng chạy ngang')) +
      sec('sw', 'Công tắc, ô tích, chip, thanh chọn', 'Công tắc bóp khi giữ, ô tích vẽ dấu, viên trượt lò xo dưới lựa chọn.',
        '<form class="form" id="lx-sw-form" novalidate>' + EP.form.render({
          s1: { label: 'Thông báo qua email', type: 'checkbox', switch: true, span2: true },
          s2: { label: 'Chế độ gọn', type: 'checkbox', switch: true, span2: true },
          c1: { label: 'Tôi đồng ý điều khoản', type: 'checkbox', span2: true }
        }, { s1: true }, { grid: false }) + '</form>' +
        '<div class="mt-3" data-slot="chips"></div><div class="mt-3" data-slot="seg"></div>' +
        code("{ type: 'checkbox', switch: true }          // EP.form: công tắc\n<input type=\"checkbox\" role=\"switch\">          // HTML thuần\nEP.ui.segmented(el, { options, value, onChange })   // viên trượt tự gắn")) +
      sec('in', 'Ô nhập', 'Nhãn nổi, kiểm tra ngay, rung khi lỗi, đếm ký tự, tiền vi-VN, hộp chọn tuỳ biến, textarea tự giãn.',
        '<form class="form" id="lx-form" novalidate>' + EP.form.render(UI_SCHEMA, { kind: 'new' }) + '<div class="row"><button type="submit" class="btn btn-primary">Gửi thử (để trống cho thấy hiệu ứng rung)</button></div></form>' +
        code("{ type: 'money', rules: { min: 1000 } }       // đọc về là Number\n{ type: 'text', rules: { maxLength: 30 } }     // tự có bộ đếm 12/30\n{ type: 'select', options }                    // hộp chọn Lucian trên chuột"), 'span-2') +
      sec('kpi', 'KPI đếm lên và định dạng vi-VN', 'Số đếm từ 0, nội dung thật không đổi (đọc màn hình và kiểm thử vẫn thấy giá trị cuối).',
        '<div class="grid kpis" data-slot="kpis"></div><div class="row mt-3"><button type="button" class="btn btn-sm" data-act="recount">' + EP.ui.icon('refresh') + 'Đếm lại</button></div>' +
        '<dl class="kv mt-3" data-slot="fmt"></dl>' +
        code("EP.ui.kpi({ label, value: EP.lucian.fmt.money(n), delta: 12.5 })\nEP.lucian.fmt.{money, compact, percent, signed, number, parse}\n<span data-countup>1.284</span>   // đếm ở bất kỳ chỗ nào"), 'span-2') +
      sec('card', 'Thẻ', 'Thẻ liên kết nổi lên khi rê; data-tilt nghiêng 3D theo chuột (tự tắt trên cảm ứng).',
        '<div class="grid cols-2" style="gap:12px"><a class="card" href="#/playground"><b>Thẻ liên kết</b><p class="muted">Rê chuột: nổi lên, viền sáng theo con trỏ.</p></a><div class="card" data-lift tabindex="0"><b>data-lift</b><p class="muted">Nổi lên nhưng không phải liên kết.</p></div><div class="card" data-tilt tabindex="0"><b>data-tilt</b><p class="muted">Nghiêng theo chuột.</p></div><div class="card flat"><b>.card.flat</b><p class="muted">Không hiệu ứng.</p></div></div>' +
        code('<a class="card" href="#/x">…</a>     // tự nổi lên\n<div class="card" data-tilt>…</div>')) +
      sec('tbl', 'Bảng', 'Hàng hiện dần, rê có vạch nhấn, tiêu đề dính, sắp xếp; ≤ 720px biến thành thẻ xếp dọc (nút sắp xếp thành chip).',
        '<div data-slot="table"></div>' +
        code("EP.ui.table(el, { columns, rows, sticky: true })   // tiêu đề dính + cuộn trong khung\nEP.ui.table(el, { ..., cards: false })       // tắt thẻ trên di động"), 'span-2') +
      sec('state', 'Trạng thái trống, lỗi và chờ AI', 'Biểu tượng trôi nhẹ; thanh tiến trình mép trên tự chạy khi EP.ai.generate đang gọi.',
        '<div class="grid cols-2" style="gap:12px"><div class="card flat" data-slot="empty"></div><div class="card flat" data-slot="err"></div></div><div class="row mt-3"><button type="button" class="btn btn-ai" data-act="aiload">' + EP.ui.icon('sparkles') + 'Giả lập AI chạy 3 giây</button></div><div class="mt-3" data-slot="ai" aria-live="polite"></div>' +
        code("var w = EP.lucian.aiLoading(box, { title: 'AI đang viết', steps: ['Đọc…', 'Soạn…'] });\nEP.ai.generate(...).then(r => w.stop(htmlKetQua));   // thanh mép trên tự chạy"), 'span-2') +
      sec('msg', 'Toast và hộp thoại', 'Toast xếp chồng, vuốt ngang để gạt (chuột hoặc ngón tay), thanh thời gian; hộp thoại vào/ra bằng lò xo, di động là bottom sheet.',
        '<div class="row"><button type="button" class="btn" data-act="toasts">Bắn 3 toast</button><button type="button" class="btn" data-act="dlg">Mở hộp thoại</button><button type="button" class="btn" data-act="toast-act">Toast có nút Hoàn tác</button></div>' +
        code("EP.ui.toast.success('Đã lưu', { action: { label: 'Hoàn tác', onClick } })\nEP.ui.dialog({ title, body, actions })")) +
      sec('step', 'Stepper', 'Thanh đầy dần, dấu tích bật ra, bước hiện tại có vòng thở.',
        '<div data-slot="stepper"></div><div class="row mt-3"><button type="button" class="btn btn-sm" data-act="prev">Lùi</button><button type="button" class="btn btn-sm btn-primary" data-act="next">Tiếp</button></div>' +
        code("EP.ui.stepper(['Nhập', 'AI', 'Xem', 'Lưu'], currentIndex)")) +
      sec('chart', 'Biểu đồ vẽ dần', 'Cột mọc lên, đường tự vẽ, điểm bật ra, vòng tròn quét. Đổi kích thước tự vẽ lại.',
        '<div class="grid cols-3" style="gap:16px"><div><div data-slot="c-bar"></div></div><div><div data-slot="c-line"></div></div><div><div data-slot="c-donut"></div></div></div><div class="row mt-3"><button type="button" class="btn btn-sm" data-act="redraw">' + EP.ui.icon('refresh') + 'Vẽ lại</button></div>' +
        code("EP.charts.bar(el, [{ label, value }])   // line, donut: cùng chữ ký; hiệu ứng tự có"), 'span-2') +
      sec('theme', 'Giao diện sáng/tối', 'Nút mặt trời/mặt trăng ở góc phải trên giữ hiệu ứng loang tròn 650ms; biểu tượng xoay vào bằng lò xo.',
        '<div class="row"><button type="button" class="btn" data-act="theme">' + EP.ui.icon('sun') + 'Đổi giao diện (loang tròn)</button></div>' + code('EP.theme.cycle(buttonEl)   // system -> light -> dark')) +
      '</div>';

    var $q = function (s) { return el.querySelector(s); };
    /* chip + segmented */
    EP.ui.chips($q('[data-slot="chips"]'), { options: [{ value: 'a', label: 'Giao nhanh' }, { value: 'b', label: 'Tặng quà' }, { value: 'c', label: 'Xuất hóa đơn' }], value: ['a'], multi: true });
    EP.ui.segmented($q('[data-slot="seg"]'), { label: 'Chu kỳ', name: 'lx-seg', value: 'week', options: [{ value: 'day', label: 'Ngày' }, { value: 'week', label: 'Tuần' }, { value: 'month', label: 'Tháng' }, { value: 'year', label: 'Năm' }] });
    /* form */
    EP.form.bind($q('#lx-form'), UI_SCHEMA, { onSubmit: function (v) { EP.ui.toast.success('Đã nhận: ' + v.name + ' - ' + M.vnd(v.price)); } });
    /* KPI */
    function drawKpi() {
      $q('[data-slot="kpis"]').innerHTML = [
        { label: 'Doanh thu', value: M.vnd(128450000), delta: 12.5, hint: 'so với tuần trước' },
        { label: 'Số đơn', value: EP.fmt.number(1284), delta: -3.2 },
        { label: 'Tỉ lệ chốt', value: EP.fmt.percent(18.4) },
        { label: 'Giá trị TB', value: M.vnd(100039), hint: 'mỗi đơn' }
      ].map(EP.ui.kpi).join('');
      $$('.kpi-value', $q('[data-slot="kpis"]')).forEach(function (n) { n.setAttribute('data-countup', ''); });
    }
    function $$(s, c) { return Array.prototype.slice.call((c || el).querySelectorAll(s)); }
    drawKpi();
    var F = lx.fmt;
    $q('[data-slot="fmt"]').innerHTML = [['money(1250000)', F.money(1250000)], ['compact(2500000000)', F.compact(2500000000)], ['compact(1250000)', F.compact(1250000)], ['percent(12.34)', F.percent(12.34)], ['signed(-3.5, 1, \'%\')', F.signed(-3.5, 1, '%')], ['parse(\'1.234,5\')', F.number(F.parse('1.234,5'), 1)]]
      .map(function (r) { return '<dt class="mono">' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    /* bảng */
    EP.ui.table($q('[data-slot="table"]'), {
      caption: 'Món bán chạy', sticky: true, rows: TABLE_ROWS, rowKey: 'id', sort: { key: 'qty', dir: 'desc' },
      columns: [
        { key: 'name', label: 'Món', sort: true, render: function (r) { return '<span class="cell-main">' + esc(r.name) + '</span>'; } },
        { key: 'cat', label: 'Nhóm', sort: true, render: function (r) { return EP.ui.badge(r.cat, r.cat === 'Đồ uống' ? 'accent' : ''); } },
        { key: 'qty', label: 'Đã bán', sort: true, type: 'number', num: true, render: function (r) { return esc(EP.fmt.number(r.qty)); } },
        { key: 'price', label: 'Đơn giá', sort: true, type: 'number', num: true, render: function (r) { return esc(M.vnd(r.price)); } },
        { key: 'day', label: 'Ngày', sort: true, type: 'date', render: function (r) { return esc(EP.fmt.date(r.day)); } }
      ],
      actions: function () { return '<button type="button" class="btn btn-sm btn-ghost" data-act="row">Chi tiết</button>'; },
      onAction: function (act, id, row) { EP.ui.toast('Đã chọn: ' + row.name); }
    });
    /* trống + lỗi + stepper */
    $q('[data-slot="empty"]').innerHTML = EP.ui.empty({ icon: 'inbox', title: 'Chưa có đơn nào', text: 'Tạo đơn đầu tiên để bắt đầu.', action: { label: 'Thêm đơn', act: 'noop' } });
    $q('[data-slot="err"]').innerHTML = EP.ui.error({ title: 'Không tải được', text: 'Kiểm tra mạng rồi thử lại.', retry: 'noop' });
    var step = 1;
    function drawStep() { $q('[data-slot="stepper"]').innerHTML = EP.ui.stepper(['Nhập dữ liệu', 'Tạo bằng AI', 'Xem biểu đồ', 'Lưu'], step); }
    drawStep();
    /* biểu đồ */
    function drawCharts() {
      EP.charts.bar($q('[data-slot="c-bar"]'), [{ label: 'T2', value: 12 }, { label: 'T3', value: 19 }, { label: 'T4', value: 8 }, { label: 'T5', value: 24 }, { label: 'T6', value: 17 }], { height: 200 });
      EP.charts.line($q('[data-slot="c-line"]'), [{ label: 'T1', value: 10 }, { label: 'T2', value: 18 }, { label: 'T3', value: 14 }, { label: 'T4', value: 26 }, { label: 'T5', value: 22 }, { label: 'T6', value: 31 }], { height: 200 });
      EP.charts.donut($q('[data-slot="c-donut"]'), [{ label: 'Đồ uống', value: 54 }, { label: 'Đồ ăn', value: 31 }, { label: 'Tráng miệng', value: 15 }], { centerLabel: 'Đơn' });
    }
    drawCharts();
    /* hành động */
    var toastN = 0;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'busy') { EP.ui.busy(b, true); setTimeout(function () { EP.ui.busy(b, false); }, 2000); }
      else if (act === 'hold') EP.ui.confirm({ title: 'Xóa dữ liệu mẫu?', message: 'Thao tác nguy hiểm nên nút xác nhận phải được giữ.', confirmLabel: 'Xóa', danger: true, hold: true }).then(function (ok) { if (ok) EP.ui.toast.success('Đã xóa (giả lập).'); else EP.ui.toast('Đã hủy.'); });
      else if (act === 'recount') drawKpi();
      else if (act === 'aiload') {
        var w = lx.aiLoading($q('[data-slot="ai"]'), { title: 'AI đang viết gợi ý' }); lx.progress.start();
        setTimeout(function () { lx.progress.done(); w.stop('<div class="ai-result"><h3>Xong rồi</h3><p>Đây là nơi hiện kết quả AI sau khi gọi xong.</p></div>'); }, 3000);
      }
      else if (act === 'toasts') { ['Đã lưu đơn hàng', 'Đã gửi email xác nhận', 'Đã đồng bộ 3 mục'].forEach(function (m, i) { setTimeout(function () { EP.ui.toast.success(m + ' (' + (++toastN) + ')'); }, i * 220); }); }
      else if (act === 'toast-act') EP.ui.toast.success('Đã xóa 1 mục', { action: { label: 'Hoàn tác', onClick: function () { EP.ui.toast('Đã hoàn tác'); } } });
      else if (act === 'dlg') EP.ui.dialog({ title: 'Hộp thoại lò xo', body: '<p>Vào bằng lò xo, ra bằng làm mờ nhanh. Trên màn hình nhỏ nó trượt lên như bottom sheet.</p>', actions: [{ label: 'Đóng', value: false }, { label: 'Đồng ý', variant: 'primary', value: true }] });
      else if (act === 'next' || act === 'prev') { step = Math.max(0, Math.min(4, step + (act === 'next' ? 1 : -1))); drawStep(); }
      else if (act === 'redraw') drawCharts();
      else if (act === 'theme') EP.theme.cycle(b);
      else if (act === 'cta' || act === 'ai') EP.ui.toast('Nút này chỉ để xem hiệu ứng.');
    });
  }

  var DEMOS = [
    { value: 'calc', label: 'Máy tính', mount: function (el) {
      EP.calc.mount(el, {
        title: 'Tính lợi nhuận đơn hàng',
        schema: {
          price: { label: 'Giá bán (₫)', type: 'number', rules: { required: true, min: 0 } },
          cost: { label: 'Giá vốn (₫)', type: 'number', rules: { required: true, min: 0 } },
          qty: { label: 'Số lượng', type: 'number', rules: { required: true, min: 1, integer: true } },
          ads: { label: 'Chi phí quảng cáo (₫)', type: 'number', rules: { min: 0 } }
        },
        defaults: { price: 250000, cost: 150000, qty: 20, ads: 400000 },
        compute: function (v) {
          var m = EP.metrics, revenue = v.price * v.qty, cogs = v.cost * v.qty, profit = revenue - cogs - (v.ads || 0);
          return {
            kpis: [{ label: 'Lợi nhuận', value: m.vnd(profit), hint: profit >= 0 ? 'Có lãi' : 'Đang lỗ' }, { label: 'Biên lợi nhuận', value: EP.fmt.percent(m.div(profit, revenue) * 100) }],
            rows: [['Doanh thu', m.vnd(revenue)], ['Giá vốn', m.vnd(cogs)], ['Quảng cáo', m.vnd(v.ads || 0)], ['ROAS', m.round(m.roas(revenue, v.ads), 2) + 'x']],
            notes: profit < 0 ? ['Bán dưới giá vốn hoặc quảng cáo quá cao. Thử tăng giá hoặc giảm chi phí.'] : [],
            chart: { type: 'donut', data: [{ label: 'Giá vốn', value: cogs }, { label: 'Quảng cáo', value: v.ads || 0 }, { label: 'Lợi nhuận', value: Math.max(profit, 0) }], opts: { format: m.vndShort, centerLabel: 'Doanh thu' } }
          };
        }
      });
    } },
    { value: 'checklist', label: 'Chấm điểm', mount: function (el) { EP.checklist.mount(el, { title: 'Kiểm tra trang web', items: CHECK }); } },
    { value: 'quiz', label: 'Đố vui', mount: function (el) { EP.quiz.mount(el, { title: 'Đố vui nhanh', questions: QUESTIONS, timePerQ: 20, boardName: 'demo' }); } },
    { value: 'ui', label: 'Thư viện UI', mount: mountUi },
    { value: 'chat', label: 'Chatbot', mount: function (el) {
      el.id = el.id || 'chat-demo';
      EP.chat.mount(el, {
        title: 'Trợ lý cửa hàng', quick: ['Giá bao nhiêu?', 'Giờ mở cửa', 'Đổi trả thế nào?'],
        reply: EP.chat.faqReply(FAQ, { quick: ['Giá bao nhiêu?', 'Giờ mở cửa'], action: { label: 'Để lại số điện thoại', onClick: function (c) { c.say('Cảm ơn bạn, nhân viên sẽ gọi lại sớm.'); } } })
      });
    } }
  ];

  EP.register({
    id: 'playground', label: 'Mô-đun', icon: 'calc', order: 30,
    title: 'Mô-đun tiện ích', desc: 'Máy tính, chấm điểm, đố vui, chatbot và Thư viện UI (lớp Lucian) dựng sẵn để chép vào đề.',
    render: function (el) {
      el.innerHTML = '<div data-slot="pick"></div><div data-slot="demo" id="pg-demo"></div>';
      function show(v) { var d = DEMOS.filter(function (x) { return x.value === v; })[0], host = el.querySelector('[data-slot="demo"]'); host.innerHTML = ''; d.mount(host); }
      var start = /\/ui\b/.test(root.location.hash) ? 'ui' : 'calc';   /* #/playground/ui mở thẳng Thư viện UI */
      EP.ui.segmented(el.querySelector('[data-slot="pick"]'), { label: 'Chọn mô-đun', name: 'pg-pick', options: DEMOS, value: start, onChange: show });
      show(start);
    }
  });
})(window);
