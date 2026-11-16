/* =====================================================================================================
   FEATURE MẪU: "Mục" = danh sách CRUD + form kiểm tra + biểu đồ + AI tạo gợi ý (mock/Gemini/dán).
   CÁCH NHÂN BẢN (≈ 5 phút):
     1. Chép thư mục  features/_example  ->  features/<ten-moi>/   (ví dụ features/don-hang/)
     2. Trong feature.js mới: đổi NAME ('example' -> 'orders'), đổi tên collection ('items' -> 'orders'),
        sửa SCHEMA (trường dữ liệu), COLUMNS (cột bảng), AI_SPEC (prompt + schema + mock), seed demo.
     3. Thêm  <script src="features/<ten-moi>/feature.js"></script>  vào index.html (trước js/app.js).
     4. Xong: tab, h1, KPI ở Tổng quan, kiểm tra, lưu trữ, xuất CSV đều tự có. Tab mới hiện ở thanh điều hướng.
   BẢN ĐỒ FILE NÀY (tìm theo số):
     [1] Mô hình dữ liệu (collection + nhãn)   [2] SCHEMA form (luật kiểm tra)   [3] Dữ liệu demo
     [4] AI_SPEC (prompt, schema, mock)        [5] Đăng ký view (tab + h1 + KPI) [6] Vẽ giao diện + sự kiện
   Mọi chữ hiện cho người dùng là tiếng Việt; tên biến/hàm là tiếng Anh. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, NAME = 'example';

  /* [1] Mô hình dữ liệu: collection lưu trong localStorage, tự có id/createdAt, phát sự kiện khi đổi */
  var items = EP.collection('items');
  var STATUS = { new: 'Mới', doing: 'Đang làm', done: 'Hoàn thành' };
  var STATUS_TONE = { new: '', doing: 'warning', done: 'positive' };
  var CATEGORY = { a: 'Nhóm A', b: 'Nhóm B', c: 'Nhóm C' };

  /* [2] SCHEMA form: mỗi trường khai báo nhãn, kiểu, luật. EP.form lo vẽ HTML, kiểm tra, hiện lỗi tiếng Việt. */
  var SCHEMA = {
    name:     { label: 'Tên mục', type: 'text', rules: { required: true, maxLength: 80 }, autocomplete: 'off', span2: true },
    email:    { label: 'Email liên hệ', type: 'email', rules: { email: true }, autocomplete: 'email', hint: 'Không bắt buộc' },
    phone:    { label: 'Số điện thoại', type: 'tel', rules: { phone: true }, autocomplete: 'tel', hint: 'Ví dụ 0912345678 hoặc +84912345678' },
    qty:      { label: 'Số lượng', type: 'number', rules: { required: true, min: 1, max: 100, integer: true } },
    due:      { label: 'Hạn xử lý', type: 'date', rules: { required: true, date: 'future' } },
    category: { label: 'Nhóm', type: 'segmented', rules: { required: true }, span2: true, options: Object.keys(CATEGORY).map(function (k) { return { value: k, label: CATEGORY[k] }; }) },
    status:   { label: 'Trạng thái', type: 'select', rules: { required: true }, options: Object.keys(STATUS).map(function (k) { return { value: k, label: STATUS[k] }; }) },
    note:     { label: 'Ghi chú', type: 'textarea', rules: { maxLength: 300 }, span2: true }
  };

  /* [3] Dữ liệu demo: nạp ở lần mở đầu (hoặc ?demo=1). Tăng version khi muốn đổi dữ liệu mẫu. */
  function daysFromNow(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  EP.demo.register('items', { version: 1, seed: function () {
    return [
      { name: 'Chuẩn bị tài liệu hội thảo', email: 'lan.nguyen@example.vn', phone: '0912345678', qty: 12, due: daysFromNow(5), category: 'a', status: 'doing', note: 'In 12 bộ, kèm sơ đồ chương trình.' },
      { name: 'Đặt phòng cho đoàn khách', email: 'minh.tran@example.vn', phone: '0987654321', qty: 4, due: daysFromNow(9), category: 'b', status: 'new', note: '' },
      { name: 'Kiểm kê kho quý này', email: '', phone: '02838221110', qty: 60, due: daysFromNow(14), category: 'c', status: 'new', note: 'Ưu tiên khu vực B.' },
      { name: 'Gửi báo giá cho đối tác', email: 'hoa.pham@example.vn', phone: '0905123456', qty: 3, due: daysFromNow(2), category: 'a', status: 'done', note: 'Đã được duyệt.' },
      { name: 'Rà soát hợp đồng nhà cung cấp', email: '', phone: '', qty: 8, due: daysFromNow(21), category: 'b', status: 'doing', note: '' },
      { name: 'Tổng hợp phản hồi khách hàng', email: 'an.le@example.vn', phone: '0933222111', qty: 25, due: daysFromNow(7), category: 'a', status: 'done', note: 'Có 25 phản hồi, cần tóm tắt.' }
    ];
  } });

  /* [4] AI_SPEC: một "đặc tả" cho EP.ai.generate. prompt = việc cần làm; schema = hình dạng JSON mong muốn
         (tự được thêm vào prompt và dùng để kiểm tra/ép kiểu kết quả); mock = bản mô phỏng offline, tất định. */
  var AI_SPEC = {
    id: 'item-suggest',
    prompt: function (input) {
      return 'Bạn là trợ lý quản lý công việc người Việt, viết ngắn gọn, cụ thể.\n' +
        'Từ mô tả công việc dưới đây, hãy đề xuất tiêu đề, tóm tắt, 3 nhãn và mức ưu tiên.\n\nMÔ TẢ: ' + input.text;
    },
    schema: { type: 'object', props: {
      title: { type: 'string', max: 70 },
      summary: { type: 'string', max: 240 },
      tags: { type: 'array', of: { type: 'string', max: 20 }, min: 3, max: 3 },
      priority: { type: 'number', min: 1, max: 5, integer: true }
    } },
    mock: function (input) {
      var text = String(input.text || ''), words = text.split(/\s+/).filter(Boolean);
      var long = words.filter(function (w) { return w.length > 4; }).map(function (w) { return w.replace(/[.,;:!?]/g, ''); });
      var uniq = long.filter(function (w, i) { return long.indexOf(w) === i; });
      var seed = EP.mock ? EP.mock.hash(text) : text.length;
      var tags = [uniq[0], uniq[1], uniq[2]].map(function (w, i) { return w || ['công việc', 'ưu tiên', 'theo dõi'][i]; });
      return {
        title: words.slice(0, 9).join(' ').replace(/[.,;:!?]+$/, ''),
        summary: 'Cần ' + (words.slice(0, 14).join(' ').toLowerCase()) + (words.length > 14 ? '...' : '') + '. Nên chia nhỏ công việc, giao người phụ trách và đặt hạn rõ ràng.',
        tags: tags,
        priority: 1 + (seed % 5)
      };
    }
  };

  /* [5] Đăng ký view: tab + h1 + mô tả + KPI hiện ở Tổng quan + hàm render */
  var COLUMNS = [
    { key: 'name', label: 'Tên mục', sort: true, render: function (r) { return '<div class="cell-main">' + esc(r.name) + '</div><div class="cell-sub">' + esc(CATEGORY[r.category] || '') + (r.email ? ' · ' + esc(r.email) : '') + '</div>'; } },
    { key: 'phone', label: 'Điện thoại', sort: true, render: function (r) { return esc(r.phone || '—'); } },
    { key: 'qty', label: 'Số lượng', sort: true, type: 'number', num: true, render: function (r) { return EP.fmt.number(r.qty); } },
    { key: 'due', label: 'Hạn', sort: true, type: 'date', render: function (r) { return esc(EP.fmt.date(r.due)); } },
    { key: 'status', label: 'Trạng thái', sort: true, render: function (r) { return EP.ui.badge(STATUS[r.status] || r.status, STATUS_TONE[r.status]); } }
  ];
  function stats() {
    var rows = items.list(), done = rows.filter(function (r) { return r.status === 'done'; }).length;
    return { total: rows.length, doing: rows.filter(function (r) { return r.status === 'doing'; }).length, doneRate: rows.length ? done / rows.length * 100 : 0, qty: rows.reduce(function (s, r) { return s + (Number(r.qty) || 0); }, 0) };
  }
  EP.register({
    id: NAME, label: 'Mục', icon: 'list', order: 20,
    title: 'Quản lý mục', desc: 'Thêm, sửa, xóa, lọc, xuất file và nhờ AI gợi ý. Đây là feature mẫu để nhân bản.',
    summary: function () { var s = stats(); return [{ label: 'Tổng số mục', value: String(s.total), hint: s.doing + ' đang làm' }, { label: 'Tỉ lệ hoàn thành', value: EP.fmt.percent(s.doneRate, 0) }]; },
    actions: function () {
      return '<button type="button" class="btn" data-act="export">' + EP.ui.icon('download') + 'Xuất CSV</button><button type="button" class="btn" data-act="print">' + EP.ui.icon('print') + 'In / PDF</button>' +
        '<button type="button" class="btn btn-primary" data-act="add">' + EP.ui.icon('plus') + 'Thêm mục</button>';
    },
    render: function (el) { build(el); }
  });

  /* [6] Giao diện: dựng khung một lần, rồi refresh() cập nhật từng phần khi dữ liệu đổi */
  function build(el) {
    var filter = 'all', q = '', table, aiResult = null, aiStep = 0, form;
    el.innerHTML =
      '<div class="grid kpis" data-slot="kpi"></div>' +
      '<div class="card pad-0 flat"><div class="row between" style="padding:14px 16px;border-bottom:1px solid var(--rule)">' +
        '<div data-slot="filter"></div>' +
        '<div class="field" style="min-width:min(100%,240px)"><input class="input input-inline" id="ex-search" type="search" placeholder=" " autocomplete="off" aria-label="Tìm theo tên"><label class="label" for="ex-search" style="top:10px">Tìm theo tên...</label></div></div>' +
        '<div data-slot="table"></div></div>' +
      '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">Số mục theo nhóm</h2></div><div data-slot="bar"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Theo trạng thái</h2></div><div data-slot="donut"></div></div></div>' +
      '<div class="card" data-slot="ai"><div class="card-head"><h2 class="section-title">' + EP.ui.icon('sparkles') + ' Nhờ AI gợi ý mục mới</h2><div data-slot="mode"></div></div>' +
        '<div data-slot="stepper"></div>' +
        '<form class="form mt-3" id="ex-ai-form" novalidate>' + EP.form.render({ text: { label: 'Mô tả công việc (ít nhất 10 ký tự)', type: 'textarea', rules: { required: true, minLength: 10, maxLength: 500 } } }, {}, { grid: false }) +
        '<div class="row"><button type="submit" class="btn btn-ai" id="ex-ai-go">' + EP.ui.icon('sparkles') + 'Tạo gợi ý</button></div></form>' +
        '<div data-slot="ai-out" class="mt-3" aria-live="polite"></div></div>';

    var $slot = function (n) { return el.querySelector('[data-slot="' + n + '"]'); };

    EP.ui.segmented($slot('filter'), { label: 'Lọc theo trạng thái', name: 'ex-filter', value: 'all', onChange: function (v) { filter = v; refresh(); },
      options: [{ value: 'all', label: 'Tất cả' }].concat(Object.keys(STATUS).map(function (k) { return { value: k, label: STATUS[k] }; })) });
    EP.ai.mountModePicker($slot('mode'));
    el.querySelector('#ex-search').addEventListener('input', EP.debounce(function (e) { q = e.target.value.trim().toLowerCase(); refresh(); }, 120));

    table = EP.ui.table($slot('table'), {
      caption: 'Danh sách mục', columns: COLUMNS, rows: [], sort: { key: 'due', dir: 'asc' },
      actions: function (r) { return '<button type="button" class="btn btn-sm btn-ghost" data-act="edit" aria-label="Sửa ' + esc(r.name) + '">' + EP.ui.icon('edit') + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="delete" aria-label="Xóa ' + esc(r.name) + '">' + EP.ui.icon('trash') + '</button>'; },
      empty: { title: 'Chưa có mục nào', text: 'Thêm mục đầu tiên hoặc để AI gợi ý giúp bạn.', action: { label: 'Thêm mục', act: 'add' } },
      onAction: function (act, id) { if (act === 'edit') openForm(items.get(id)); else if (act === 'delete') remove(id); else if (act === 'add') openForm(); }
    });

    function visible() {
      return items.list().filter(function (r) { return (filter === 'all' || r.status === filter) && (!q || String(r.name).toLowerCase().indexOf(q) >= 0); });
    }
    function refresh() {
      var s = stats(), all = items.list();
      $slot('kpi').innerHTML = [
        { label: 'Tổng số mục', value: EP.fmt.number(s.total), hint: 'đang lưu trong trình duyệt' },
        { label: 'Đang làm', value: EP.fmt.number(s.doing) },
        { label: 'Tỉ lệ hoàn thành', value: EP.fmt.percent(s.doneRate, 0), hint: 'trên tổng số mục' },
        { label: 'Tổng số lượng', value: EP.fmt.number(s.qty) }
      ].map(EP.ui.kpi).join('');
      table.setRows(visible());
      EP.charts.bar($slot('bar'), EP.charts.countBy(all, 'category', CATEGORY), { unit: 'mục' });
      EP.charts.donut($slot('donut'), EP.charts.countBy(all, 'status', STATUS), { unit: 'mục', centerLabel: 'Tổng số mục' });
    }

    /* Thêm / sửa: hộp thoại chứa form theo SCHEMA */
    function openForm(row) {
      var fid = 'ex-form-' + EP.uid();
      var d = EP.ui.dialog({
        title: row ? 'Sửa mục' : 'Thêm mục mới', size: 'wide',
        body: '<form class="form" id="' + fid + '" novalidate>' + EP.form.render(SCHEMA, row || { category: 'a', status: 'new', qty: 1 }) + '</form>',
        actions: [{ label: 'Hủy', value: null }, { label: row ? 'Lưu thay đổi' : 'Thêm mục', variant: 'primary', type: 'submit', form: fid, id: 'ex-save' }]
      });
      EP.form.bind(d.body.querySelector('form'), SCHEMA, { onSubmit: function (v) {
        v.phone = v.phone ? EP.form.normalizePhone(v.phone) : '';
        if (row) items.update(row.id, v); else items.add(v);
        d.close(true);
        EP.ui.toast(row ? 'Đã lưu thay đổi.' : 'Đã thêm mục mới.', { type: 'success' });
      } });
    }
    function remove(id) {
      var r = items.get(id); if (!r) return;
      EP.ui.confirm({ title: 'Xóa mục này?', message: '"' + r.name + '" sẽ bị xóa khỏi danh sách.', confirmLabel: 'Xóa', danger: true }).then(function (ok) {
        if (!ok) return;
        items.remove(id);
        EP.ui.toast('Đã xóa "' + r.name + '".', { type: 'success', action: { label: 'Hoàn tác', onClick: function () { items.add(r); } } });
      });
    }

    /* Nút ở đầu view (h1) */
    var actionHost = el.closest('.view').querySelector('.view-actions');
    actionHost.onclick = function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'add') openForm();
      else if (a === 'print') EP.export.print();
      else if (a === 'export') {
        var rows = visible();
        if (!rows.length) { EP.ui.toast('Không có dòng nào để xuất.', { type: 'warn' }); return; }
        EP.export.csv('muc-' + EP.fmt.today() + '.csv', rows, [
          { key: 'name', label: 'Tên mục' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Điện thoại' }, { key: 'qty', label: 'Số lượng' },
          { key: 'due', label: 'Hạn' }, { label: 'Nhóm', key: 'category', value: function (r) { return CATEGORY[r.category]; } }, { label: 'Trạng thái', key: 'status', value: function (r) { return STATUS[r.status]; } }, { key: 'note', label: 'Ghi chú' }]);
      }
    };

    /* AI: form nhỏ -> EP.ai.generate -> hiện kết quả + ghi chú mock -> lưu thành mục */
    function drawAi() {
      $slot('stepper').innerHTML = EP.ui.stepper(['Nhập mô tả', 'AI tạo gợi ý', 'Duyệt & lưu'], aiStep);
      var out = $slot('ai-out');
      if (!aiResult) { out.innerHTML = ''; return; }
      var r = aiResult.data;
      out.innerHTML = '<div class="ai-result"><div class="row between"><h3>' + esc(r.title) + '</h3>' + EP.ui.badge('Ưu tiên ' + r.priority + '/5', r.priority >= 4 ? 'negative' : r.priority >= 3 ? 'warning' : 'positive') + '</div>' +
        '<p>' + esc(r.summary) + '</p><div class="chips">' + r.tags.map(function (t) { return '<span class="chip">#' + esc(t) + '</span>'; }).join('') + '</div>' +
        EP.ai.noticeHtml(aiResult) +
        '<div class="row"><button type="button" class="btn btn-primary" data-act="ai-save">' + EP.ui.icon('check') + 'Lưu thành mục mới</button><button type="button" class="btn" data-act="ai-copy">' + EP.ui.icon('copy') + 'Sao chép</button></div></div>';
    }
    form = EP.form.bind(el.querySelector('#ex-ai-form'), { text: { label: 'Mô tả công việc', type: 'textarea', rules: { required: true, minLength: 10, maxLength: 500 } } }, {
      onSubmit: function (v) {
        aiStep = 1; aiResult = null; drawAi();
        $slot('ai-out').innerHTML = EP.ui.skeleton(2);
        return EP.ai.generate(AI_SPEC, { input: { text: v.text }, onSwitch: function (m) { EP.ui.toast('Đã chuyển sang model ' + m, { type: 'info' }); } }).then(function (res) {
          aiResult = res; aiStep = 2; drawAi();
        }, function (err) {
          aiStep = 0; drawAi();
          if (err.kind !== 'cancel') $slot('ai-out').innerHTML = EP.ui.error({ title: 'Chưa tạo được gợi ý', text: err.message });
        });
      }
    });
    $slot('ai-out').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || !aiResult) return;
      var r = aiResult.data;
      if (b.getAttribute('data-act') === 'ai-copy') EP.ui.copy(r.title + '\n' + r.summary + '\n' + r.tags.map(function (t) { return '#' + t; }).join(' '));
      else {
        items.add({ name: r.title, email: '', phone: '', qty: 1, due: daysFromNow(7), category: 'a', status: 'new', note: r.summary + (aiResult.mode === 'mock' ? ' [' + EP.ai.MOCK_NOTICE + ']' : '') });
        aiResult = null; aiStep = 3; drawAi();
        EP.ui.toast('Đã lưu gợi ý thành mục mới.', { type: 'success' });
      }
    });

    items.onChange(function () { if (root.document.body.contains(el)) refresh(); });
    EP.bus.on('demo:reset', refresh); EP.bus.on('restore', refresh);
    drawAi(); refresh();
  }
})(window);
