/* motion.js — hiệu ứng dùng chung cho toàn app. Tôn trọng "giảm chuyển động" của hệ điều hành. */
(function (root) {
  var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Đánh số thứ tự để CSS xuất hiện lần lượt (animation-delay theo --i)
  function stagger(nodes, max) {
    Array.prototype.forEach.call(nodes, function (n, i) { n.style.setProperty('--i', Math.min(i, max || 12)); n.classList.add('mo-stagger'); });
  }

  // Chạy lại một animation CSS bằng class
  function replay(el, cls) {
    if (!el || reduce) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', function done() { el.classList.remove(cls); el.removeEventListener('animationend', done); });
  }

  // Số chạy từ 0 lên giá trị thật
  function countUp(el, to, ms) {
    if (reduce || typeof to !== 'number' || !isFinite(to) || to < 10) {
      el.textContent = typeof to === 'number' ? to.toLocaleString('vi-VN') : to;
      if (to > 0) replay(el, 'mo-pop');
      return;
    }
    var start = performance.now(), dur = ms || 700;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * e).toLocaleString('vi-VN');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Thu gọn rồi mới xoá (thẻ sự kiện, phần trên trang…)
  function collapse(el, done) {
    if (!el || reduce || !el.animate) { done(); return; }
    var h = el.offsetHeight;
    el.style.overflow = 'hidden';
    var a = el.animate([
      { opacity: 1, transform: 'none', height: h + 'px' },
      { opacity: 0, transform: 'scale(0.96)', height: h + 'px', offset: 0.6 },
      { opacity: 0, transform: 'scale(0.96)', height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' }
    ], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' });
    a.onfinish = done;
  }

  // Đổi chữ nút trong chốc lát (✓ Đã copy) rồi trả lại
  function morph(btn, text, ms) {
    if (!btn) return;
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = text;
    replay(btn, 'mo-morph');
    clearTimeout(btn._moT);
    btn._moT = setTimeout(function () { btn.textContent = old; replay(btn, 'mo-morph'); }, ms || 1600);
  }

  // Thanh gạch chân trượt theo tab đang chọn
  function indicator(nav) {
    if (!nav) return;
    var bar = nav.querySelector('.tab-indicator');
    if (!bar) { bar = document.createElement('span'); bar.className = 'tab-indicator'; bar.setAttribute('aria-hidden', 'true'); nav.appendChild(bar); }
    var act = nav.querySelector('.is-active');
    if (!act) { bar.style.opacity = '0'; return; }
    bar.style.opacity = '1';
    bar.style.width = act.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + act.offsetLeft + 'px)';
  }

  root.EP = root.EP || {};
  root.EP.motion = { reduce: reduce, stagger: stagger, replay: replay, countUp: countUp, collapse: collapse, morph: morph, indicator: indicator };
})(typeof window !== 'undefined' ? window : globalThis);
