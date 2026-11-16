/* hero.js - Chuyển động nhẹ cho quả cầu 3D của hero "Tầm nhìn Thông minh" (MẶC ĐỊNH BẬT; tắt bằng <html data-hero="plain">).
   Máy tính: quả cầu lệch nhẹ theo con trỏ. Điện thoại: tự trôi nhẹ (CSS) + nghiêng máy (deviceorientation, nếu trình duyệt không đòi xin quyền).
   Chỉ ghi transform vào .hero-orb-wrap qua requestAnimationFrame; tôn trọng prefers-reduced-motion (không gắn gì cả). */
(function () {
  'use strict';
  var de = document.documentElement;
  if (de.getAttribute('data-hero') === 'plain') return;
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;

  var tx = 0, ty = 0, raf = 0;
  function paint() {
    raf = 0;
    var w = document.querySelector('.hero-orb-wrap');
    if (w) w.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
  }
  function set(x, y) { tx = x; ty = y; if (!raf) raf = requestAnimationFrame(paint); }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || window.innerWidth < 900) return;
    var hero = document.querySelector('.hero'); if (!hero) return;
    var r = hero.getBoundingClientRect(); if (!r.width || !r.height || e.clientY < r.top - 80 || e.clientY > r.bottom + 80) return;
    set(((e.clientX - r.left) / r.width - .5) * 18, ((e.clientY - r.top) / r.height - .5) * 14);
  }, { passive: true });

  // Nghiêng máy (Android/Chrome không cần xin quyền; iOS đòi quyền thì bỏ qua, vẫn có chuyển động trôi bằng CSS)
  var DO = window.DeviceOrientationEvent;
  if (DO && typeof DO.requestPermission !== 'function' && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null || e.beta == null || document.hidden) return;
      var g = Math.max(-25, Math.min(25, e.gamma)) / 25, b = Math.max(-25, Math.min(25, e.beta - 45)) / 25;
      set(g * 10, b * 8);
    }, { passive: true });
  }
})();
