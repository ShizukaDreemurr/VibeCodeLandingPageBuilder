/* demo.js - nạp dữ liệu mẫu ở lần mở đầu tiên để giám khảo thấy app "có hồn" ngay.
     EP.demo.register('items', { version: 1, rows: [ {...}, ... ] })   // hoặc seed: function () { return [...]; }
   - Lần đầu (chưa có cờ phiên bản): nạp mẫu.
   - Tăng `version`: nạp lại mẫu NẾU người dùng chưa sửa gì (mọi dòng còn cờ _demo). Dòng người dùng tự thêm/sửa được giữ nguyên.
   - ?demo=1 trên URL: xoá collection đó rồi nạp lại từ đầu (dùng khi quay video/trình bày).
   - EP.demo.reset(): làm giống ?demo=1 (nút "Nạp lại dữ liệu demo" ở Cài đặt). */
(function (root) {
  'use strict';
  var EP = root.EP, regs = {};

  function rowsOf(r) { return (typeof r.seed === 'function' ? r.seed() : r.rows || []).map(function (x, i) { return Object.assign({ id: 'demo' + (i + 1), createdAt: Date.now() - (i + 1) * 3600e3, _demo: true }, x); }); }
  function seed(name, r, force) {
    var col = EP.collection(name), flagKey = 'demo_v_' + name, seen = EP.store.read(flagKey, 0), rows = col.list();
    var untouched = rows.every(function (x) { return x._demo; });
    if (force || (!seen && (rows.length === 0)) || (seen && seen !== r.version && untouched)) {
      col.replace(rowsOf(r));
      EP.store.write(flagKey, r.version);
    } else if (!seen) {
      EP.store.write(flagKey, r.version);   // đã có dữ liệu thật: không đè, chỉ đánh dấu
    }
  }
  EP.demo = {
    register: function (name, def) { regs[name] = def; },
    run: function () {
      var force = /[?&]demo=1(?:&|$)/.test(root.location.search);
      Object.keys(regs).forEach(function (n) { seed(n, regs[n], force); });
      if (force && root.history && root.history.replaceState) {
        var u = new URL(root.location.href); u.searchParams.delete('demo'); root.history.replaceState(null, '', u.pathname + u.search + u.hash);
      }
    },
    reset: function () { Object.keys(regs).forEach(function (n) { seed(n, regs[n], true); }); EP.bus.emit('demo:reset'); },
    names: function () { return Object.keys(regs); }
  };
})(window);
