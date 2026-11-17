/* hero.js - Chuyển động nhẹ cho quả cầu 3D của hero "Tầm nhìn Thông minh" (MẶC ĐỊNH BẬT; tắt bằng <html data-hero="plain">).
   Máy tính: quả cầu lệch nhẹ theo con trỏ. Điện thoại: tự trôi nhẹ (CSS) + nghiêng máy (deviceorientation, nếu không đòi xin quyền) + thị sai nhẹ khi cuộn.
   Một vòng rAF duy nhất, làm mượt bằng nội suy (lerp), CHỈ chạy khi hero đang thấy và tab đang hiện; dừng hẳn khi đã tới đích.
   Chỉ ghi transform; hero ngoài màn hình hoặc tab ẩn thì tạm dừng cả hoạt ảnh CSS (class is-off / is-hidden). Tôn trọng prefers-reduced-motion. */
(function () {
  'use strict';
  var doc = document, de = doc.documentElement;
  if (de.getAttribute('data-hero') === 'plain') return;
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;

  var tx = 0, ty = 0, sy = 0;          /* đích: con trỏ/nghiêng (tx,ty) + thị sai cuộn (sy) */
  var cx = 0, cy = 0, cs = 0;          /* hiện tại (đã làm mượt) */
  var raf = 0, visible = false, hero = null, wrap = null, io = null;

  function frame() {
    raf = 0;
    if (!wrap || !wrap.isConnected) { wrap = doc.querySelector('.hero-orb-wrap'); if (!wrap) return; }
    cx += (tx - cx) * .14; cy += (ty - cy) * .14; cs += (sy - cs) * .16;
    var done = Math.abs(tx - cx) < .05 && Math.abs(ty - cy) < .05 && Math.abs(sy - cs) < .05;
    if (done) { cx = tx; cy = ty; cs = sy; }
    wrap.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + (cy + cs).toFixed(2) + 'px,0)';
    if (done) wrap.classList.remove('is-live'); else { wrap.classList.add('is-live'); kick(); }
  }
  function kick() { if (!raf && visible && !doc.hidden) raf = requestAnimationFrame(frame); }
  function set(x, y) { tx = x; ty = y; kick(); }

  /* hero thấy / không thấy: bật-tắt vòng rAF và hoạt ảnh CSS */
  function watch() {
    var h = doc.querySelector('.hero');
    if (h === hero) return;
    if (io && hero) io.unobserve(hero);
    hero = h; wrap = h && h.querySelector('.hero-orb-wrap');
    if (!hero) { visible = false; return; }
    if ('IntersectionObserver' in window) {
      io = io || new IntersectionObserver(function (es) {
        var e = es[es.length - 1]; visible = e.isIntersecting; hero.classList.toggle('is-off', !visible);
        if (visible) { onScroll(); kick(); }
      }, { rootMargin: '40px' });
      io.observe(hero);
    } else visible = true;
  }
  function onScroll() {
    if (!visible || !hero) return;
    var r = hero.getBoundingClientRect(), p = Math.max(-1, Math.min(1, -r.top / Math.max(1, r.height)));
    sy = p * 26; kick();   /* thị sai: quả cầu trôi chậm hơn nội dung ~26px trên cả chiều cao hero */
  }
  window.addEventListener('scroll', function () { if (visible) onScroll(); }, { passive: true });
  doc.addEventListener('visibilitychange', function () { de.classList.toggle('is-hidden', doc.hidden); if (!doc.hidden) kick(); });

  doc.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || window.innerWidth < 900 || !visible || !hero) return;
    var r = hero.getBoundingClientRect(); if (!r.width || !r.height || e.clientY < r.top - 80 || e.clientY > r.bottom + 80) return;
    set(((e.clientX - r.left) / r.width - .5) * 18, ((e.clientY - r.top) / r.height - .5) * 14);
  }, { passive: true });

  // Nghiêng máy (Android/Chrome không cần xin quyền; iOS đòi quyền thì bỏ qua, vẫn có chuyển động trôi bằng CSS)
  var DO = window.DeviceOrientationEvent;
  if (DO && typeof DO.requestPermission !== 'function' && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null || e.beta == null || doc.hidden || !visible) return;
      var g = Math.max(-25, Math.min(25, e.gamma)) / 25, b = Math.max(-25, Math.min(25, e.beta - 45)) / 25;
      set(g * 10, b * 8);
    }, { passive: true });
  }

  /* hero được dựng khi view Tổng quan render (sau hero.js): theo dõi bằng MutationObserver nhẹ + tín hiệu route */
  if (window.MutationObserver) new MutationObserver(function () { if (!hero || !hero.isConnected || !doc.querySelector('.hero')) watch(); }).observe(doc.getElementById('views') || doc.body, { childList: true, subtree: true });
  if (window.EP && EP.bus) EP.bus.on('route', function () { setTimeout(watch, 0); });
  watch();
})();
