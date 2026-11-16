/* mobile.js - vi chỉnh cho điện thoại (nạp sau lucian.js, trước features).
   1) Thanh .seg / .chips cuộn ngang: gắn data-fade="start|end|both" để CSS làm mờ mép (báo còn mục để vuốt), cuộn mục đang chọn vào giữa.
   2) Đặt theme-color theo giao diện hiện tại (thanh trạng thái điện thoại ăn theo nền app).
   Không gọi mạng, không phụ thuộc API khác ngoài EP.bus. */
(function (root) {
  'use strict';
  var doc = root.document, EP = root.EP;
  function fade(el) {
    var max = el.scrollWidth - el.clientWidth, x = el.scrollLeft, f = '';
    if (max > 4) f = x > 4 ? (x < max - 4 ? 'both' : 'start') : 'end';
    if (f) el.setAttribute('data-fade', f); else el.removeAttribute('data-fade');
  }
  function scan() { Array.prototype.forEach.call(doc.querySelectorAll('.seg'), function (el) { fade(el); }); }
  doc.addEventListener('scroll', function (e) { if (e.target && e.target.classList && e.target.classList.contains('seg')) fade(e.target); }, true);
  doc.addEventListener('change', function (e) {
    var t = e.target, seg = t && t.closest && t.closest('.seg');
    if (seg && t.type === 'radio') {
      var l = t.closest('label'); if (!l) return;
      var left = l.offsetLeft - (seg.clientWidth - l.offsetWidth) / 2;
      try { seg.scrollTo({ left: left, behavior: EP && EP.reduced && EP.reduced() ? 'auto' : 'smooth' }); } catch (x) { seg.scrollLeft = left; }
    }
  });
  var t; function later() { clearTimeout(t); t = setTimeout(scan, 80); }
  if (root.MutationObserver) new MutationObserver(later).observe(doc.getElementById('views') || doc.body, { childList: true, subtree: true });
  root.addEventListener('resize', later);
  if (EP && EP.bus) EP.bus.on('route', later);
  later();
})(window);
