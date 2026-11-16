/* app.js - khởi động: dựng thương hiệu/chân trang, nút giao diện, nạp demo, view Tổng quan & Cài đặt, bật router.
   Nạp CUỐI CÙNG (sau mọi features/*). Không cần sửa khi thêm feature mới. */
(function (root) {
  'use strict';
  var EP = root.EP, cfg = EP.config, esc = EP.esc, doc = root.document;

  /* ---------- Tổng quan: KPI gộp từ summary() của các feature + thẻ lối tắt + hướng dẫn 3 bước ---------- */
  EP.register({
    id: 'home', label: 'Tổng quan', icon: 'home', order: 0, always: true,
    title: cfg.appName, desc: cfg.tagline,
    render: function (el) {
      var feats = EP.router.list().filter(function (v) { return v.id !== 'home' && v.id !== 'settings'; });
      var kpis = [];
      feats.forEach(function (v) { if (v.summary) { try { kpis = kpis.concat(v.summary()); } catch (e) { console.error(e); } } });
      var links = feats.map(function (v) {
        return '<a class="card" href="#/' + esc(v.id) + '"><div class="row" style="gap:12px;flex-wrap:nowrap;align-items:flex-start"><span style="flex:none;color:var(--accent-ink)">' + EP.ui.icon(v.icon || 'list') + '</span><div><h2 class="section-title">' + esc(v.label) + '</h2><p class="muted">' + esc(v.desc || '') + '</p></div></div></a>';
      }).join('');
      var first = feats[0];
      el.innerHTML =
        '<section class="hero" aria-label="Giới thiệu"><div class="hero-copy"><span class="hero-eyebrow">' + esc(cfg.appName) + '</span><p class="hero-title" role="presentation">' + esc(cfg.heroLead || 'Giải pháp') + ' <em>' + esc(cfg.heroEm || 'thông minh') + '</em></p><p>' + esc(cfg.tagline) + '</p>' +
        (first ? '<a class="btn btn-cta" href="#/' + esc(first.id) + '">Bắt đầu ngay ' + EP.ui.icon('send') + '</a>' : '') + '</div><div class="hero-visual" aria-hidden="true"></div></section>' +
        (kpis.length ? '<div class="grid kpis">' + kpis.slice(0, 8).map(EP.ui.kpi).join('') + '</div>' : '') +
        '<div class="card"><div class="card-head"><h2 class="section-title">Bắt đầu nhanh</h2></div>' + EP.ui.stepper(['Nhập dữ liệu', 'Tạo bằng AI', 'Xem biểu đồ', 'Xuất báo cáo'], 0) + '</div>' +
        (links ? '<div class="grid cols-2">' + links + '</div>' : EP.ui.empty({ title: 'Chưa có tính năng nào', text: 'Thêm file vào features/ và nạp trong index.html.' }));
    }
  });

  /* ---------- Cài đặt: giao diện, AI, dữ liệu ---------- */
  EP.register({
    id: 'settings', label: 'Cài đặt', icon: 'settings', order: 99,
    title: 'Cài đặt', desc: 'Giao diện, trợ lý AI và dữ liệu của bạn.',
    render: function (el) {
      el.innerHTML =
        '<div class="card"><div class="card-head"><h2 class="section-title">Giao diện</h2></div><div id="set-theme"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Trợ lý AI</h2></div><div id="set-ai"></div></div>' +
        '<div class="card"><div class="card-head"><h2 class="section-title">Dữ liệu</h2></div><p class="muted">Dữ liệu nằm trong trình duyệt này (localStorage). Hãy sao lưu trước khi xóa hoặc đổi máy.</p>' +
        '<div class="row mt-3"><button class="btn" type="button" data-act="backup">' + EP.ui.icon('download') + 'Sao lưu (JSON)</button><button class="btn" type="button" data-act="restore">' + EP.ui.icon('upload') + 'Khôi phục từ file</button>' +
        '<button class="btn" type="button" data-act="demo">' + EP.ui.icon('refresh') + 'Nạp lại dữ liệu demo</button><button class="btn btn-danger" type="button" data-act="wipe">' + EP.ui.icon('trash') + 'Xóa toàn bộ dữ liệu</button></div></div>' +
        '<p class="muted center">' + esc(cfg.appName) + ' · phiên bản ' + esc(EP.version.version) + ' (' + esc(EP.version.date) + ')</p>';
      var seg = EP.ui.segmented(el.querySelector('#set-theme'), {
        label: 'Giao diện', name: 'set-theme', value: EP.theme.get(),
        options: [{ value: 'system', label: 'Theo hệ thống' }, { value: 'light', label: 'Sáng' }, { value: 'dark', label: 'Tối' }],
        onChange: function (v) { EP.theme.set(v, el.querySelector('#set-theme input:checked')); }
      });
      EP.bus.on('theme', function (m) { if (seg) seg.set(m); });
      EP.ai.mountSettings(el.querySelector('#set-ai'));
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'backup') EP.export.backup();
        else if (act === 'restore') EP.export.pickFile('.json,application/json').then(function (f) { return EP.export.restore(f); }).then(function (n) { EP.ui.toast('Đã khôi phục ' + n + ' mục dữ liệu.', { type: 'success' }); EP.router.refresh(); }, function (err) { EP.ui.toast(err.message, { type: 'error' }); });
        else if (act === 'demo') EP.ui.confirm({ title: 'Nạp lại dữ liệu demo?', message: 'Dữ liệu hiện tại của các mục có demo sẽ bị thay bằng dữ liệu mẫu.', confirmLabel: 'Nạp lại', danger: true }).then(function (ok) { if (ok) { EP.demo.reset(); EP.ui.toast('Đã nạp lại dữ liệu demo.', { type: 'success' }); } });
        else if (act === 'wipe') EP.ui.confirm({ title: 'Xóa toàn bộ dữ liệu?', message: 'Mọi dữ liệu của ứng dụng trong trình duyệt này sẽ mất, không hoàn tác được.', confirmLabel: 'Xóa hết', danger: true }).then(function (ok) { if (ok) { EP.store.clear(); EP.ui.toast('Đã xóa. Đang tải lại...', { type: 'success' }); setTimeout(function () { root.location.reload(); }, 600); } });
      });
    }
  });

  /* ---------- Khởi động ---------- */
  function boot() {
    var $ = EP.$, set = function (id, t) { var n = doc.getElementById(id); if (n) n.textContent = t; };
    set('brand-name', cfg.appName); set('brand-mark', cfg.brandMark || cfg.appName.charAt(0));
    set('ft-app', cfg.appName); set('ft-version', 'v' + EP.version.version);
    var nt = doc.getElementById('ft-notice'); if (nt) nt.textContent = EP.ai.MOCK_NOTICE;
    function syncNotice() { if (nt) nt.hidden = EP.ai.getMode() !== 'mock'; }
    syncNotice(); EP.bus.on('ai:mode', syncNotice);

    var tb = $('#btn-theme');
    if (tb) { EP.theme.apply(EP.theme.get()); tb.addEventListener('click', function () { EP.theme.cycle(tb); }); }
    EP.bus.on('store:error', function () { EP.ui.toast('Bộ nhớ trình duyệt đầy hoặc bị chặn, dữ liệu có thể không được lưu.', { type: 'warn' }); });

    EP.demo.run();
    EP.router.mount();
    doc.documentElement.setAttribute('data-ready', '1');
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
