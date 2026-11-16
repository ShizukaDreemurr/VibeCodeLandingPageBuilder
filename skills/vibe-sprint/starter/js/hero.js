/* hero.js — Khởi tạo hiệu ứng kính sọc dọc (Fluted Glass) & quả cầu 3D cho Hero.
   MẶC ĐỊNH TẮT: chỉ chạy khi <html data-hero="fluted"> được bật.
   Tự tắt chuyển động khi người dùng bật prefers-reduced-motion: reduce. */
(function () {
  'use strict';

  if (document.documentElement.getAttribute('data-hero') !== 'fluted') return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function enhanceHero() {
    var visuals = document.querySelectorAll('.hero-visual');
    if (!visuals.length) return;

    visuals.forEach(function (vis) {
      if (vis.dataset.flutedInit === '1') return;
      vis.dataset.flutedInit = '1';

      var orb = document.createElement('div');
      orb.className = 'hero-orb';

      var flutes = document.createElement('div');
      flutes.className = 'hero-flutes';
      for (var i = 0; i < 8; i++) {
        var bar = document.createElement('div');
        bar.className = 'hero-flute';
        flutes.appendChild(bar);
      }

      vis.appendChild(orb);
      vis.appendChild(flutes);

      var hero = vis.closest('.hero');
      if (hero && !reduceMotion) {
        hero.addEventListener('pointermove', function (e) {
          if (window.innerWidth < 760) return;
          var r = hero.getBoundingClientRect();
          if (!r.width || !r.height) return;
          var rx = ((e.clientX - r.left) / r.width - 0.5) * 16;
          var ry = ((e.clientY - r.top) / r.height - 0.5) * 12;
          orb.style.transform = 'translate3d(' + rx.toFixed(1) + 'px, calc(-50% + ' + ry.toFixed(1) + 'px), 0)';
        });
        hero.addEventListener('pointerleave', function () {
          orb.style.transform = 'translate3d(0, -50%, 0)';
        });
      }
    });
  }

  function init() {
    enhanceHero();
    var views = document.getElementById('views');
    if (views && window.MutationObserver) {
      new MutationObserver(enhanceHero).observe(views, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
