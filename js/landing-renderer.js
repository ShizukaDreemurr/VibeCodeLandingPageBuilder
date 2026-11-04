/*
 * landing-renderer.js — dựng landing page từ dữ liệu sự kiện + nội dung + mẫu (template).
 * Mọi chữ người dùng nhập đều đi qua textContent (không chèn HTML) để tránh lỗi bảo mật.
 */
(function (root) {
  var ES = root.EP.eventStatus;
  var T = root.EP.templates;
  var GALLERY_SLOTS = 6;
  var scopeSeq = 0;

  // Thứ tự mặc định các phần giữa hero và footer. locked = bắt buộc theo đề, không cho ẩn.
  var SECTIONS = [
    { key: 'countdown', label: 'Đếm ngược + số đăng ký', locked: true },
    { key: 'about', label: 'Giới thiệu' },
    { key: 'benefits', label: '3 lợi ích' },
    { key: 'speakers', label: 'Diễn giả' },
    { key: 'gallery', label: 'Hình ảnh sự kiện (album)' },
    { key: 'agenda', label: 'Chương trình (agenda)', locked: true },
    { key: 'offer', label: 'Ưu đãi đăng ký sớm' },
    { key: 'register', label: 'Form đăng ký', locked: true },
    // Khối thêm (thư viện khối): mặc định ẩn, bật trong bảng "Khối"
    { key: 'faq', label: 'Hỏi đáp (FAQ)', optional: true, block: true },
    { key: 'testimonials', label: 'Cảm nhận người tham dự', optional: true, block: true },
    { key: 'sponsors', label: 'Nhà tài trợ / đối tác', optional: true, block: true },
    { key: 'video', label: 'Video giới thiệu', optional: true, block: true },
    { key: 'map', label: 'Bản đồ địa điểm', optional: true, block: true },
    { key: 'cta2', label: 'Lời kêu gọi cuối trang', optional: true, block: true }
  ];
  // Mục mặc định của khối danh sách (người dùng sửa chữ tại chỗ, thêm/bớt mục)
  var BLOCK_ITEMS = {
    faq: [['Sự kiện có mất phí không?', 'Hoàn toàn miễn phí, bạn chỉ cần đăng ký trước để giữ chỗ.'],
      ['Tôi có nhận được xác nhận không?', 'Có. Ban tổ chức sẽ liên hệ qua số điện thoại hoặc email bạn để lại.'],
      ['Có thể đi cùng bạn bè không?', 'Được, mỗi người vui lòng đăng ký riêng để ban tổ chức chuẩn bị đủ chỗ.']],
    testimonials: [['“Nội dung thực tế, ra về là áp dụng được ngay.”', 'Minh Anh · khách mời năm trước'],
      ['“Tổ chức chu đáo, gặp được nhiều người cùng chí hướng.”', 'Quốc Bảo · khách mời năm trước']],
    sponsors: [['Đối tác 1'], ['Đối tác 2'], ['Đối tác 3'], ['Đối tác 4']]
  };
  var MAX_ITEMS = 8;
  function blockCount(ev, key) {
    var b = (ev.blocks || {})[key];
    var n = b && b.count != null ? Number(b.count) : BLOCK_ITEMS[key].length;
    return Math.max(1, Math.min(MAX_ITEMS, n || 0));
  }
  // Link YouTube/Vimeo → địa chỉ nhúng an toàn
  function videoEmbed(url) {
    url = String(url || '').trim();
    var m = url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1];
    m = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d{5,12})/i);
    if (m) return 'https://player.vimeo.com/video/' + m[1];
    return '';
  }

  // Ghép cấu hình người dùng với danh sách mặc định (thêm phần mới, bỏ phần lạ)
  function normalizeSections(config) {
    var known = {};
    SECTIONS.forEach(function (s) { known[s.key] = s; });
    var out = [];
    (config || []).forEach(function (c) {
      if (known[c.key] && !out.some(function (o) { return o.key === c.key; })) {
        out.push({ key: c.key, visible: known[c.key].locked ? true : c.visible !== false });
      }
    });
    SECTIONS.forEach(function (s) {
      if (!out.some(function (o) { return o.key === s.key; })) out.push({ key: s.key, visible: !s.optional });
    });
    return out;
  }

  // h('div', {class: 'x'}, [con...]) — tạo phần tử an toàn
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k];
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  // Icon nét từ icons.js (nếu chưa nạp thì bỏ qua)
  function ico(name, size) {
    if (!root.EP.icons) return null;
    var n = root.EP.icons.node(name, size || 16);
    n.classList.add('lp-ic');
    return n;
  }

  function giftIcon() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '26'); svg.setAttribute('height', '26');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
    ['M20 12v9H4v-9', 'M2 7h20v5H2z', 'M12 21V7', 'M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z'].forEach(function (d) {
      var path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); svg.appendChild(path);
    });
    return svg;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function isSafeUrl(url) { return /^https?:\/\/\S+$/i.test(url || ''); }

  function field(name, label, type, placeholder, idp) {
    idp = idp || 'lp-';
    return h('div', { class: 'lp-field' }, [
      h('label', { for: idp + name, text: label }),
      h('input', { id: idp + name, name: name, type: type, placeholder: placeholder, autocomplete: 'on' }),
      h('p', { class: 'lp-error', 'data-error-for': name, 'aria-live': 'polite' })
    ]);
  }

  // Chuyển động bổ sung cho trang xem (không chạy khi soạn). Hàm TỰ CHỨA: file HTML xuất nhúng nguyên văn hàm này.
  // Cổng từ Lucian Lab (MIT, © 2026 Seokwoooo): #319 aurora, #226 lưới sáng, #100 đồng hồ lật, #214 + #228 thẻ bento phát sáng viền,
  // #318 đường vẽ theo cuộn, #207 bức tường nhận xét, #298 vé xé, #389 album dạng ngăn; cùng Text Motion, thanh tiến độ, count-up, ripple.
  // Màu luôn lấy từ biến --lp-*; chuyển động chỉ transform/opacity (ngoại lệ: nét SVG của #318, flex của #389, canvas của #319).
  function motionInit(root) {
    if (!root || root.__mo) return;
    var de = document.documentElement;
    var calm = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || de.classList.contains('motion-off') || root.classList.contains('st-motion-off');
    root.__mo = 1;
    function mk(tag, cls) { var e = document.createElement(tag); e.className = cls; return e; }
    function q1(s, r) { return (r || root).querySelector(s); }
    function qa(s, r) { return [].slice.call((r || root).querySelectorAll(s)); }
    var rafs = {};
    function later(key, fn) { if (!rafs[key]) rafs[key] = requestAnimationFrame(function () { rafs[key] = 0; fn(); }); }

    // ---- Hero: aurora (#319) + lưới sáng theo con trỏ (#226) ----
    var hero = q1('.lp-hero');
    if (hero && !q1('.lp-fx-aurora', hero)) {
      var cv = mk('canvas', 'lp-fx lp-fx-aurora'); cv.width = 72; cv.height = 72; cv.setAttribute('aria-hidden', 'true');
      var grid = mk('div', 'lp-fx lp-fx-grid'); grid.setAttribute('aria-hidden', 'true');
      var glow = mk('div', 'lp-fx lp-fx-gridlit'); glow.setAttribute('aria-hidden', 'true');
      hero.appendChild(cv); hero.appendChild(grid); hero.appendChild(glow); hero.classList.add('has-fx');
      var cx = cv.getContext && cv.getContext('2d');
      if (cx) {
        var cs = getComputedStyle(root);
        var norm = function (c, fb) { var t = document.createElement('canvas').getContext('2d'); t.fillStyle = '#000'; t.fillStyle = (c || '').trim() || fb; var v = t.fillStyle; if (v.charAt(0) !== '#') { var m = v.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; } var n = parseInt(v.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
        var mixc = function (a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };
        var acc = norm(cs.getPropertyValue('--lp-accent'), '#d6336c'), pri = norm(cs.getPropertyValue('--lp-primary'), '#222'), wht = [255, 255, 255];
        // Năm vầng sáng lấy từ màu chính / nhấn của trang (không dùng màu cố định)
        var col = [acc, mixc(pri, wht, 0.45), mixc(acc, wht, 0.5), mixc(pri, acc, 0.5), mixc(acc, pri, 0.35)];
        var B = [0, 1, 2, 3, 4].map(function (i) { return { bx: 0.2 + (i * 0.37) % 0.7, by: 0.25 + (i * 0.53) % 0.6, r: 0.38 + (i % 3) * 0.08, ph: i * 1.7, sp: 0.18 + i * 0.03 }; });
        var ptr = null, follow = { x: 0.5, y: 0.5 }, S = 72;
        var draw = function (t) {
          cx.clearRect(0, 0, S, S); cx.globalCompositeOperation = 'lighter';
          B.forEach(function (b, i) {
            var x = b.bx + Math.sin(t * b.sp + b.ph) * 0.18, y = b.by + Math.cos(t * b.sp * 0.8 + b.ph * 1.3) * 0.16;
            if (ptr) { x += (ptr.x - x) * 0.18; y += (ptr.y - y) * 0.18; }
            if (i === 0) { x = follow.x; y = follow.y; }
            var c = col[i].map(Math.round).join(','), g = cx.createRadialGradient(x * S, y * S, 0, x * S, y * S, b.r * S);
            g.addColorStop(0, 'rgba(' + c + ',.85)'); g.addColorStop(1, 'rgba(' + c + ',0)');
            cx.fillStyle = g; cx.fillRect(0, 0, S, S);
          });
        };
        draw(2); // một khung tĩnh cho người tắt chuyển động
        if (!calm) {
          var vis = true, raf = 0, last = 0, t = 2;
          var frame = function (now) {
            raf = 0; if (!hero.isConnected || !vis) return;
            var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
            var aim = ptr || { x: 0.3 + Math.sin(t * 0.21) * 0.15, y: 0.35 + Math.cos(t * 0.17) * 0.12 };
            follow.x += (aim.x - follow.x) * (1 - Math.pow(0.15, dt)); follow.y += (aim.y - follow.y) * (1 - Math.pow(0.15, dt));
            draw(t); raf = requestAnimationFrame(frame);
          };
          var go = function () { if (!raf && vis) { last = performance.now(); raf = requestAnimationFrame(frame); } };
          if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; go(); }).observe(hero); else go();
          hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect(); ptr = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
            if (e.pointerType !== 'touch') { hero.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px'); }
          }, { passive: true });
          hero.addEventListener('pointerleave', function () { ptr = null; hero.style.setProperty('--mx', '-300px'); hero.style.setProperty('--my', '-300px'); });
        }
      }
    }
    if (calm) return;

    // ---- Tiêu đề tách từ, thanh tiến độ cuộn, count-up, ripple ----
    var hl = root.querySelector('.lp-headline');
    if (hl && hl.childNodes.length === 1 && hl.firstChild.nodeType === 3 && hl.textContent.trim()) {
      var words = hl.textContent.trim().split(/\s+/);
      hl.setAttribute('aria-label', words.join(' '));
      hl.textContent = '';
      words.forEach(function (w, i) {
        var s = mk('span', 'lp-word'); s.setAttribute('aria-hidden', 'true'); s.textContent = w; s.style.animationDelay = (0.12 + Math.min(i, 14) * 0.045) + 's';
        hl.appendChild(s); if (i < words.length - 1) hl.appendChild(document.createTextNode(' '));
      });
    }
    var bar = q1('.lp-progress') || mk('div', 'lp-progress'); bar.setAttribute('aria-hidden', 'true');
    if (!bar.parentNode) root.appendChild(bar);
    var tick = 0;
    function prog() {
      tick = 0;
      var max = de.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, (window.pageYOffset || de.scrollTop) / max)) : 0) + ')';
    }
    addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(prog); }, { passive: true });
    prog();
    var chip = root.querySelector('.lp-chip-text');
    if (chip && 'IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        cio.disconnect();
        var m = chip.textContent.match(/^([\d.,]+)(.*)$/);
        if (!m) return;
        var to = parseInt(m[1].replace(/[^\d]/g, ''), 10), rest = m[2], t0 = performance.now();
        if (!(to > 1)) return;
        chip.__cu = 1;
        (function step(t) {
          var k = Math.min(1, Math.max(0, (t - t0) / 900)), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          chip.textContent = v.toLocaleString('vi-VN') + rest;
          if (k < 1) requestAnimationFrame(step); else chip.__cu = 0;
        })(t0);
      }, { threshold: 0.4 });
      cio.observe(chip);
    }
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.lp-cta, .lp-submit, .lp-sticky-btn');
      if (!b || b.disabled) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = mk('span', 'lp-ripple');
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 650);
    });

    // ---- Đếm ngược: đồng hồ lật (#100 flip-clock-timer). Ô .lp-cd-num gốc vẫn giữ chữ (đọc được, file xuất vẫn cập nhật) ----
    if (!root.classList.contains('st-countdown-minimal') && Element.prototype.animate) {
      qa('.lp-cd-box').forEach(function (box) {
        var num = q1('.lp-cd-num', box);
        if (!num || q1('.lp-flip', box)) return;
        var wrap = mk('span', 'lp-flip'); wrap.setAttribute('aria-hidden', 'true');
        var cards = [];
        var build = function (str) {
          wrap.textContent = ''; cards = [];
          str.split('').forEach(function (ch) {
            var f = mk('span', 'lp-fl'); f.innerHTML = '<span class="lp-fl-t"><b></b></span><span class="lp-fl-b"><b></b></span><span class="lp-fl-ft"><b></b></span><span class="lp-fl-fb"><b></b></span>';
            wrap.appendChild(f);
            var c = { v: ch, t: f.children[0].firstChild, b: f.children[1].firstChild, ft: f.children[2], fb: f.children[3] };
            c.t.textContent = c.b.textContent = c.ft.firstChild.textContent = c.fb.firstChild.textContent = ch;
            cards.push(c);
          });
        };
        // Nửa trên mang số cũ gập xuống bản lề, rồi nửa dưới mang số mới bật ra
        var flip = function (c, v) {
          if (c.v === v) return;
          var old = c.v; c.v = v;
          c.t.textContent = v; c.ft.firstChild.textContent = old; c.fb.firstChild.textContent = v; c.b.textContent = old;
          c.ft.getAnimations().forEach(function (a) { a.cancel(); }); c.fb.getAnimations().forEach(function (a) { a.cancel(); });
          c.ft.animate([{ transform: 'perspective(320px) rotateX(0deg)', filter: 'brightness(1)' }, { transform: 'perspective(320px) rotateX(-90deg)', filter: 'brightness(.6)' }], { duration: 240, easing: 'cubic-bezier(.55,0,.9,.6)' });
          var a = c.fb.animate([{ transform: 'perspective(320px) rotateX(90deg)', filter: 'brightness(1.5)' }, { transform: 'perspective(320px) rotateX(0deg)', filter: 'brightness(1)' }], { duration: 300, delay: 240, easing: 'cubic-bezier(.2,.9,.3,1.25)', fill: 'forwards' });
          a.onfinish = function () { c.b.textContent = c.v; a.cancel(); };
        };
        var sync = function () {
          var s = num.textContent.trim(); if (!s) return;
          if (s.length !== cards.length) build(s); else s.split('').forEach(function (ch, i) { flip(cards[i], ch); });
        };
        build(num.textContent.trim() || '00');
        box.insertBefore(wrap, num.nextSibling); box.classList.add('has-flip');
        new MutationObserver(sync).observe(num, { childList: true, characterData: true, subtree: true });
      });
    }

    // ---- Thẻ bento / diễn giả: viền phát sáng theo con trỏ (#228 glow-border-cards, #214 bento-features) ----
    var lit = qa('.lp-benefits li, .lp-speaker, .lp-quote');
    if (lit.length && window.matchMedia && matchMedia('(hover: hover)').matches) {
      var gp = null;
      var gl = function () {
        lit.forEach(function (el) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--cx', (gp ? gp.x - r.left : -400).toFixed(0) + 'px'); el.style.setProperty('--cy', (gp ? gp.y - r.top : -400).toFixed(0) + 'px');
          el.style.setProperty('--o', gp && Math.abs(gp.x - (r.left + r.width / 2)) < r.width / 2 + 260 && Math.abs(gp.y - (r.top + r.height / 2)) < r.height / 2 + 260 ? '1' : '0');
        });
      };
      root.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; gp = { x: e.clientX, y: e.clientY }; later('gl', gl); }, { passive: true });
      root.addEventListener('pointerleave', function () { gp = null; later('gl', gl); });
    }

    // ---- Chương trình: đường vẽ theo cuộn (#318 scroll-draw-route) ----
    var ag = q1('.lp-agenda');
    if (ag && ag.children.length && !q1('.lp-route', ag)) {
      var NS = 'http://www.w3.org/2000/svg', lis = [].slice.call(ag.children);
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'lp-route'); svg.setAttribute('aria-hidden', 'true');
      var guide = document.createElementNS(NS, 'path'), route = document.createElementNS(NS, 'path'), pl = document.createElementNS(NS, 'path'), dg = document.createElementNS(NS, 'g');
      guide.setAttribute('class', 'lp-route-guide'); route.setAttribute('class', 'lp-route-line'); pl.setAttribute('class', 'lp-route-pl'); pl.setAttribute('d', 'M7 0L-5 -5L-2 0L-5 5z');
      svg.appendChild(guide); svg.appendChild(route); svg.appendChild(dg); svg.appendChild(pl);
      ag.insertBefore(svg, ag.firstChild); ag.classList.add('has-route');
      var L = 0, table = [], stops = [], PX = [13, 25];
      var layout = function () {
        var H = ag.offsetHeight; if (!H) return;
        svg.setAttribute('viewBox', '0 0 40 ' + H); svg.setAttribute('height', H);
        dg.textContent = '';
        var pts = lis.map(function (li, i) { var f = q1('.lp-agenda-time', li) || li; return [PX[i % 2], li.offsetTop + Math.round(f.offsetHeight / 2)]; });
        var d = 'M' + pts[0][0] + ' ' + pts[0][1];
        for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2; d += ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1]; }
        if (pts.length === 1) d += ' l0 0.1';
        guide.setAttribute('d', d); route.setAttribute('d', d);
        L = route.getTotalLength(); route.style.strokeDasharray = L + ' ' + L;
        table = []; for (var s = 0; s <= 240; s++) { var p = route.getPointAtLength(L * s / 240); table.push([p.y, L * s / 240]); }
        stops = pts.map(function (pt, i) {
          var c = document.createElementNS(NS, 'circle'), cc = document.createElementNS(NS, 'circle');
          c.setAttribute('class', 'lp-route-dot'); c.setAttribute('cx', pt[0]); c.setAttribute('cy', pt[1]); c.setAttribute('r', 8);
          cc.setAttribute('class', 'lp-route-dotc'); cc.setAttribute('cx', pt[0]); cc.setAttribute('cy', pt[1]); cc.setAttribute('r', 4);
          dg.appendChild(c); dg.appendChild(cc);
          return { c: c, cc: cc, li: lis[i], y: pt[1] };
        });
        paint();
      };
      var lenAt = function (y) {
        if (!table.length || y <= table[0][0]) return 0;
        for (var i = 1; i < table.length; i++) if (table[i][0] >= y) return table[i - 1][1] + (table[i][1] - table[i - 1][1]) * (y - table[i - 1][0]) / Math.max(0.01, table[i][0] - table[i - 1][0]);
        return L;
      };
      var paint = function () {
        if (!L) return;
        var y = innerHeight * 0.62 - ag.getBoundingClientRect().top, len = Math.max(0, Math.min(L, lenAt(y)));
        route.style.strokeDashoffset = (L - len).toFixed(1);
        var p = route.getPointAtLength(len), q = route.getPointAtLength(Math.min(L, len + 2));
        pl.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI).toFixed(1) + ')');
        stops.forEach(function (s) { var on = y >= s.y - 2; s.c.classList.toggle('on', on); s.cc.classList.toggle('on', on); s.li.classList.toggle('is-on', on); });
      };
      layout();
      addEventListener('scroll', function () { later('rt', paint); }, { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(function () { later('rl', layout); }).observe(ag); else addEventListener('resize', layout);
    }

    // ---- Nhận xét: bức tường cuộn dọc (#207 testimonial-columns) ----
    var wall = q1('.lp-quotes');
    if (wall && wall.children.length >= 3 && !wall.__wall) {
      wall.__wall = 1;
      var figs = [].slice.call(wall.children), nCols = 0;
      var cloneFig = function (f) { var c = f.cloneNode(true); c.setAttribute('aria-hidden', 'true'); [c].concat(qa('[data-el]', c)).forEach(function (n) { n.removeAttribute('data-el'); }); return c; };
      var buildWall = function () {
        var w = wall.clientWidth || root.clientWidth, n = w >= 860 ? 3 : (w >= 560 ? 2 : 1);
        if (n === nCols) return; nCols = n;
        wall.textContent = ''; wall.classList.add('is-wall'); wall.style.setProperty('--n', n);
        var H = 420, cols = [];
        for (var c = 0; c < n; c++) {
          var co = mk('div', 'lp-wall-col'), tr = mk('div', 'lp-wall-tr'); co.appendChild(tr); wall.appendChild(co);
          cols.push({ co: co, tr: tr, items: figs.filter(function (_, i) { return i % n === c; }) });
        }
        cols.forEach(function (c, ci) {
          c.items.forEach(function (f) { c.tr.appendChild(f); });
          var base = [].slice.call(c.tr.children), guard = 0;
          while (c.tr.offsetHeight < H && guard++ < 6) base.forEach(function (f) { c.tr.appendChild(cloneFig(f)); });
          [].slice.call(c.tr.children).forEach(function (f) { c.tr.appendChild(cloneFig(f)); });
          c.tr.style.setProperty('--t', Math.max(18, Math.round(c.tr.offsetHeight / 2 / 18)) + (ci % 2 ? 6 : 0) + 's'); c.tr.style.setProperty('--dir', ci % 2 ? 'reverse' : 'normal');
        });
      };
      buildWall();
      if ('ResizeObserver' in window) new ResizeObserver(function () { later('wl', buildWall); }).observe(root);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { wall.classList.toggle('is-off', !es[0].isIntersecting); }).observe(wall);
    }

    // ---- Ưu đãi: vé xé cuống (#298 coupon-tear) ----
    var ocard = q1('.lp-offer-card'), claim = q1('.lp-offer-claim');
    if (ocard && claim) claim.addEventListener('click', function () {
      ocard.classList.add('is-torn');
      setTimeout(function () { ocard.classList.remove('is-torn'); }, 2200);
    });

    // ---- Album: ngăn ảnh mở rộng khi rê chuột (#389 accordion-image-panels), chỉ khi khung rộng và có từ 3 ảnh ----
    var gal = q1('.lp-gallery');
    if (gal) {
      var gits = qa('.lp-gallery-item:not(.is-empty)', gal);
      if (gits.length >= 3) {
        gits.forEach(function (it, i) {
          if (!q1('.lp-acc-n', it)) { var nn = mk('span', 'lp-acc-n'); nn.setAttribute('aria-hidden', 'true'); nn.textContent = (i < 9 ? '0' : '') + (i + 1); it.appendChild(nn); }
          var on = function () { gits.forEach(function (x) { x.classList.toggle('on', x === it); }); };
          it.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') on(); });
          it.addEventListener('focusin', on);
        });
        gits[0].classList.add('on');
        var accFit = function () { var want = root.clientWidth >= 760; if (want === gal.classList.contains('is-acc')) return; gal.classList.add('lp-acc-init'); gal.classList.toggle('is-acc', want); void gal.offsetWidth; requestAnimationFrame(function () { requestAnimationFrame(function () { gal.classList.remove('lp-acc-init'); }); }); };
        accFit();
        if ('ResizeObserver' in window) new ResizeObserver(function () { later('af', accFit); }).observe(root);
      }
    }
  }

  // Xem ảnh toàn màn hình (album). Hàm TỰ CHỨA, không dùng biến ngoài: file HTML xuất nhúng nguyên văn hàm này.
  function lightboxInit(root) {
    if (!root || root.__lb) return;
    var items = [].slice.call(root.querySelectorAll('.lp-gallery-open'));
    if (!items.length) return;
    root.__lb = 1;
    var box = null, img, count, prevBtn, nextBtn, idx = 0, opener = null, sx = null;
    function mk(tag, cls, txt, label) {
      var e = document.createElement(tag); e.className = cls;
      if (txt) e.textContent = txt;
      if (label) { e.setAttribute('aria-label', label); e.type = 'button'; }
      return e;
    }
    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].querySelector('img');
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      count.textContent = (idx + 1) + ' / ' + items.length;
      img.classList.remove('is-in'); void img.offsetWidth; img.classList.add('is-in');
      prevBtn.hidden = nextBtn.hidden = items.length < 2;
    }
    function close() {
      if (!box) return;
      document.removeEventListener('keydown', onKey, true);
      box.remove(); box = null; document.documentElement.classList.remove('lp-lb-open');
      if (opener && opener.focus) opener.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'Tab') { var f = [].slice.call(box.querySelectorAll('button:not([hidden])')); if (!f.length) return; var k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    }
    function open(i) {
      opener = document.activeElement;
      box = mk('div', 'lp-lightbox'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Xem ảnh sự kiện');
      img = mk('img', 'lp-lb-img'); count = mk('span', 'lp-lb-count');
      var x = mk('button', 'lp-lb-btn lp-lb-x', '✕', 'Đóng');
      prevBtn = mk('button', 'lp-lb-btn lp-lb-prev', '‹', 'Ảnh trước'); nextBtn = mk('button', 'lp-lb-btn lp-lb-next', '›', 'Ảnh sau');
      box.appendChild(img); box.appendChild(count); box.appendChild(x); box.appendChild(prevBtn); box.appendChild(nextBtn);
      x.addEventListener('click', close);
      prevBtn.addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
      nextBtn.addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (e) {
        if (sx == null) return;
        var dx = e.changedTouches[0].clientX - sx; sx = null;
        if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      });
      (root.classList.contains('landing') ? root : document.body).appendChild(box);
      document.documentElement.classList.add('lp-lb-open');
      document.addEventListener('keydown', onKey, true);
      show(i); x.focus();
    }
    items.forEach(function (b, i) { b.addEventListener('click', function (e) { e.preventDefault(); open(i); }); });
  }

  /*
   * opts: {
   *   event, content, getCount(), onRegister(formData) → result | Promise, now(),
   *   editable: true ở chế độ soạn (hiện nút đổi ảnh), onPickImage(slot) → được gọi khi bấm ô ảnh,
   *   appUrl: đường dẫn về app (dòng "Tạo trang như thế này")
   * }
   * Trả về { update() } để cập nhật đếm ngược, số đăng ký, trạng thái mà không vẽ lại cả trang.
   */
  function render(container, opts) {
    var ev = opts.event;
    var content = opts.content;
    var tpl = T.get(ev.templateId);
    var L = T.labels(tpl.id);
    var images = ev.images || {};
    var editable = !!opts.editable;

    container.innerHTML = '';
    container.className = 'landing tpl-' + tpl.id + (editable ? ' is-editable' : '');
    var vars = T.cssVars(tpl.id);
    container.removeAttribute('style');
    Object.keys(vars).forEach(function (k) { container.style.setProperty(k, vars[k]); });
    var st = root.EP.pageStyle ? root.EP.pageStyle.apply(container, tpl.theme, ev.style) : { sections: {}, motion: 'full', ctaText: '' };

    // Nút đổi ảnh (chỉ ở chế độ soạn)
    function imageButton(slot, label) {
      if (!editable) return null;
      return h('button', {
        type: 'button', class: 'lp-img-btn', 'data-slot': slot,
        onclick: function (e) { e.preventDefault(); if (opts.onPickImage) opts.onPickImage(slot); }
      }, [ico('image', 14), label]);
    }

    // Nút "Chỉnh" ảnh (xoay, cắt, thu phóng…) cạnh nút đổi ảnh, chỉ khi đã có ảnh
    function editButton(slot) {
      if (!editable) return null;
      return h('button', {
        type: 'button', class: 'lp-img-btn lp-img-edit', 'data-edit-slot': slot, title: 'Xoay, cắt, thu phóng, chỉnh sáng…',
        onclick: function (e) { e.preventDefault(); if (opts.onEditImage) opts.onEditImage(slot); }
      }, [ico('pencil', 14), 'Chỉnh']);
    }

    var statusBadge = h('span', { class: 'lp-badge' });
    var chipText = h('span', { class: 'lp-chip-text' });
    var proofChip = h('span', { class: 'lp-chip', hidden: true }, [h('i', { class: 'lp-chip-dot', 'aria-hidden': 'true' }), chipText]);
    var countText = h('strong', { class: 'lp-count' });
    var cdBoxes = {};
    var countdownEl = h('div', { class: 'lp-countdown', role: 'timer' },
      ['days', 'hours', 'minutes', 'seconds'].map(function (unit, i) {
        cdBoxes[unit] = h('span', { class: 'lp-cd-num', text: '00' });
        return h('div', { class: 'lp-cd-box' }, [cdBoxes[unit], h('span', { class: 'lp-cd-label', text: ['ngày', 'giờ', 'phút', 'giây'][i] })]);
      }));
    var endedEl = h('p', { class: 'lp-ended', text: 'Sự kiện đã diễn ra', hidden: true });

    // ---------- Phần tử có thể chọn & chỉnh trong bản xem trước ----------
    // Mỗi phần tử có mã (data-el). Chữ sửa lưu ở ev.texts[mã], kiểu riêng ở ev.elStyles[mã].
    // Chữ do AI viết (headline, description, benefits:i) lưu thẳng vào content như cũ.
    var texts = ev.texts || {};
    var elStyles = ev.elStyles || {};
    var rich = ev.rich || {};
    var LU = root.EP.lpUtils;
    // Phạm vi CSS riêng của trang này: kiểu khi rê chuột + kiểu theo thiết bị (container query)
    var scope = String(++scopeSeq);
    container.setAttribute('data-lp-scope', scope);
    if (LU) {
      var css = LU.buildCss(scope, ev, editable);
      if (css) container.appendChild(h('style', { text: css }));
    }
    function txt(key, def) { return texts[key] != null && texts[key] !== '' ? texts[key] : def; }

    // kind: 'text' (sửa chữ tại chỗ) | 'button' (sửa chữ qua bảng) | 'box' (chỉ đổi kiểu)
    function mark(node, key, label, kind, opt) {
      opt = opt || {};
      node.setAttribute('data-el', key);
      if (editable) {
        node.setAttribute('data-el-label', label);
        node.setAttribute('data-el-kind', kind || 'text');
        if (opt.required) node.setAttribute('data-el-required', '');
        if (opt.def != null) node.setAttribute('data-el-default', opt.def);
      }
      applyElStyle(node, elStyles[key], opt.required);
      if ((kind || 'text') === 'text' || kind === 'button') fill(node, key);
      if (editable && (kind || 'text') === 'text') makeEditable(node, key, opt);
      return node;
    }
    function applyElStyle(node, st, required) {
      if (!st) return;
      var col = st.color && /^[#a-z0-9(),.%\s/-]+$/i.test(st.color) ? st.color : '';
      var bg = st.background && /^[#a-z0-9(),.%\s/-]+$/i.test(st.background) ? st.background : '';
      if (col) node.style.color = col;
      if (bg) node.style.background = bg;
      if (st.fontSize) node.style.fontSize = 'min(' + Math.max(10, Math.min(96, Number(st.fontSize))) + 'px, 12cqi)';
      if (st.fontWeight) node.style.fontWeight = String(Math.max(100, Math.min(900, Number(st.fontWeight))));
      if (st.italic) node.style.fontStyle = 'italic';
      if (st.underline) node.style.textDecoration = 'underline';
      if (st.upper) node.style.textTransform = 'uppercase';
      if (st.align && /^(left|center|right)$/.test(st.align)) node.style.textAlign = st.align;
      if (st.letterSpacing != null && st.letterSpacing !== '') node.style.letterSpacing = Math.max(-0.1, Math.min(0.5, Number(st.letterSpacing))) + 'em';
      var num = function (v, a, b) { v = Number(v); return v === v && v !== null && st != null ? Math.max(a, Math.min(b, v)) : null; };
      var set = function (prop, v, unit) { if (v != null && v !== '' && !isNaN(Number(v))) node.style[prop] = v + (unit || ''); };
      if (st.fontFamily && /^[A-Za-z0-9 ]{2,40}$/.test(st.fontFamily)) {
        var PSx = root.EP.pageStyle, fam = PSx ? PSx.fontFamilyName('', st.fontFamily) : { google: st.fontFamily, fallback: 'sans-serif' };
        if (PSx) PSx.loadFont(fam);
        node.style.fontFamily = "'" + fam.google + "', " + fam.fallback;
      }
      if (st.lineHeight !== '' && st.lineHeight != null) set('lineHeight', num(st.lineHeight, 0.8, 3));
      if (st.wordSpacing !== '' && st.wordSpacing != null) set('wordSpacing', num(st.wordSpacing, -0.2, 1), 'em');
      if (st.textIndent !== '' && st.textIndent != null) set('textIndent', num(st.textIndent, 0, 120), 'px');
      if (st.marginTop !== '' && st.marginTop != null) set('marginTop', num(st.marginTop, -40, 160), 'px');
      if (st.marginBottom !== '' && st.marginBottom != null) set('marginBottom', num(st.marginBottom, -40, 160), 'px');
      var ox = st.offsetX !== '' && st.offsetX != null ? num(st.offsetX, -200, 200) : null;
      var oy = st.offsetY !== '' && st.offsetY != null ? num(st.offsetY, -200, 200) : null;
      if (ox || oy) { node.style.position = 'relative'; node.style.left = (ox || 0) + 'px'; node.style.top = (oy || 0) + 'px'; }
      if (st.hidden && !required) {
        if (editable) node.classList.add('lp-el-hidden'); else node.hidden = true;
      }
    }
    // Chữ có định dạng (ev.rich[mã], đã lọc) + biến động {con_cho}…
    function fill(node, key) {
      var r = rich[key];
      // Chỉ dùng bản định dạng khi chữ gốc chưa đổi (vd. AI viết lại thì bỏ định dạng cũ)
      if (r && r.html && LU && r.plain === node.textContent.replace(/\s+/g, ' ').trim()) node.innerHTML = LU.sanitizeRich(r.html);
      if (LU) LU.expandVars(node, editable);
    }
    function makeEditable(node, key, opt) {
      node.contentEditable = 'true';
      node.spellcheck = false;
      var originalHtml = node.innerHTML;
      var before = LU ? LU.serialize(node) : { plain: node.textContent, html: null };
      node.addEventListener('blur', function () {
        var now = LU ? LU.serialize(node) : { plain: node.textContent.replace(/\s+/g, ' ').trim(), html: null };
        if (!now.plain) { node.innerHTML = originalHtml; return; } // không cho để trống
        if (now.plain === before.plain && now.html === before.html) return;
        if (opt.field && opts.onEditContent) opts.onEditContent(opt.field, now.plain, now.html);
        else if (opts.onEditText) opts.onEditText(key, now.plain, now.html);
      });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !opt.multiline) { e.preventDefault(); node.blur(); }
        if (e.key === 'Enter' && opt.multiline && e.shiftKey) { e.preventDefault(); document.execCommand('insertLineBreak'); }
        if (e.key === 'Escape') { node.innerHTML = originalHtml; node.blur(); }
      });
      // Dán chữ thuần, không mang theo định dạng
      node.addEventListener('paste', function (e) {
        e.preventDefault();
        var t = (e.clipboardData || root.clipboardData).getData('text');
        document.execCommand('insertText', false, t);
      });
    }
    // Chữ do AI viết
    function editableText(tag, attrs, field, text, label) {
      attrs.text = text;
      var node = h(tag, attrs);
      node.setAttribute('data-field', field);
      return mark(node, field, label, 'text', { field: field, multiline: tag === 'p', def: text });
    }
    function TX(tag, attrs, key, label, def, opt) {
      attrs.text = txt(key, def);
      opt = opt || {}; opt.def = def;
      return mark(h(tag, attrs), key, label, opt.kind || 'text', opt);
    }

    // Brand DNA: logo ở đầu trang, dòng tổ chức + liên hệ ở chân trang
    var brand = ev.brand && ev.brand.name ? ev.brand : null;
    function brandLogo() {
      if (!brand || !brand.logo || !/^data:image\/(png|jpeg|webp);base64,/.test(brand.logo)) return null;
      var logo = mark(h('img', { class: 'lp-logo', src: brand.logo, alt: brand.name, width: 160, height: 56, decoding: 'async' }), 'brand.logo', 'Logo thương hiệu', 'box');
      if (editable) logo.setAttribute('data-el-image', 'logo');
      return logo;
    }
    function brandFooter() {
      if (!brand) return null;
      var parts = [h('span', {}, ['Tổ chức bởi ', h('strong', { text: brand.name })])];
      if (brand.hotline) parts.push(h('a', { href: 'tel:' + brand.hotline, text: brand.hotline }));
      if (brand.website && isSafeUrl(brand.website)) parts.push(h('a', { href: brand.website, target: '_blank', rel: 'noopener nofollow', text: brand.website.replace(/^https?:\/\//, '').replace(/\/$/, '') }));
      if (brand.fanpage && isSafeUrl(brand.fanpage)) parts.push(h('a', { href: brand.fanpage, target: '_blank', rel: 'noopener nofollow', text: 'Fanpage' }));
      var line = h('p', { class: 'lp-brand-line' }, parts);
      var wrap = h('div', { class: 'lp-brand' }, [line, brand.tagline ? TX('p', { class: 'lp-brand-tagline' }, 'brand.tagline', 'Khẩu hiệu thương hiệu', brand.tagline) : null]);
      return mark(wrap, 'brand.footer', 'Thông tin thương hiệu', 'box');
    }

    // HERO (có ảnh nền nếu người dùng tải lên)
    mark(statusBadge, 'hero.badge', 'Nhãn trạng thái', 'box', { required: true });
    var ctaText = txt('hero.cta', (st.ctaText || '').trim() || L.submit);
    var cta = mark(h('a', { class: 'lp-cta', href: '#lp-register', text: ctaText }), 'hero.cta', 'Nút chính', 'button', { def: L.submit });
    // Ảnh bìa: ảnh người dùng tải lên, không có thì dùng ảnh vẽ sẵn của mẫu
    var heroArt = !images.hero && !images.noTplHero && tpl.hero ? new URL(tpl.hero, document.baseURI).href : ''; // đường dẫn tuyệt đối: url() trong biến CSS tính theo file CSS
    var heroSrc = images.hero || heroArt;
    var hero = h('section', { class: 'lp-hero' + (heroSrc ? ' has-image' : '') + (heroArt ? ' has-art' : '') }, [
      brandLogo(),
      editableText('h1', { class: 'lp-headline' }, 'headline', content.headline, 'Tiêu đề chính'),
      TX('p', { class: 'lp-eyebrow' }, 'hero.eyebrow', 'Tên sự kiện', ev.name),
      mark(h('p', { class: 'lp-meta' }, [
        h('span', { class: 'lp-meta-item' }, [ico('calendar'), TX('span', {}, 'hero.date', 'Thời gian', fmtDate(ev.startAt))]),
        h('span', { class: 'lp-meta-item' }, [ico('pin'), TX('span', {}, 'hero.location', 'Địa điểm', ev.location)])
      ]), 'hero.meta', 'Dòng thời gian & địa điểm', 'box'),
      h('div', { class: 'lp-hero-action' }, [cta, statusBadge, proofChip]),
      imageButton('hero', images.hero || heroArt ? 'Đổi ảnh bìa' : 'Thêm ảnh bìa'),
      heroSrc ? editButton('hero') : null
    ]);
    if (heroSrc) hero.style.setProperty('--lp-hero-image', 'url("' + heroSrc.replace(/"/g, '') + '")');
    mark(hero, 'hero', 'Phần đầu trang', 'box', { required: true });
    if (editable && heroSrc) hero.setAttribute('data-el-image', 'hero');

    var cdLabels = ['ngày', 'giờ', 'phút', 'giây'];
    Object.keys(cdBoxes).forEach(function (u, i) {
      var label = cdBoxes[u].nextSibling;
      label.textContent = txt('cd.label.' + i, cdLabels[i]);
      mark(label, 'cd.label.' + i, 'Chữ dưới ô đếm', 'text', { def: cdLabels[i] });
    });
    mark(countdownEl, 'cd.boxes', 'Đồng hồ đếm ngược', 'box', { required: true });
    var countdownSection = h('section', { class: 'lp-section lp-countdown-section' }, [
      TX('h2', {}, 'countdown.title', 'Tiêu đề phần đếm ngược', L.countdown), countdownEl, endedEl,
      mark(h('p', { class: 'lp-social-proof' }, [countText, TX('span', {}, 'countdown.suffix', 'Chữ sau số đăng ký', L.countSuffix)]), 'countdown.proof', 'Dòng số người đăng ký', 'box', { required: true })
    ]);

    var aboutText = editableText('p', {}, 'description', content.description, 'Đoạn giới thiệu');
    var aboutPhoto = null, aboutKids;
    if (images.about) {
      aboutPhoto = h('figure', { class: 'lp-about-media' }, [
        mark(h('img', { src: images.about, alt: 'Ảnh giới thiệu sự kiện', width: 800, height: 600, loading: 'lazy', decoding: 'async' }), 'about.img', 'Ảnh giới thiệu', 'box'),
        imageButton('about', 'Đổi ảnh'), editButton('about')
      ]);
      if (editable) aboutPhoto.querySelector('img').setAttribute('data-el-image', 'about');
      aboutKids = [h('div', { class: 'lp-about has-media' }, [aboutPhoto, h('div', { class: 'lp-about-body' }, [aboutText])])];
    } else aboutKids = [aboutText, editable ? h('p', { class: 'lp-slot-add' }, [imageButton('about', '+ Thêm ảnh giới thiệu')]) : null];
    var about = h('section', { class: 'lp-section' + (aboutPhoto ? ' lp-about-section' : '') }, [TX('h2', {}, 'about.title', 'Tiêu đề phần giới thiệu', L.about)].concat(aboutKids));

    var benefits = h('section', { class: 'lp-section' }, [
      TX('h2', {}, 'benefits.title', 'Tiêu đề phần lợi ích', L.benefits),
      h('ul', { class: 'lp-benefits' }, content.benefits.map(function (b, i) { return editableText('li', {}, 'benefits:' + i, b, 'Lợi ích ' + (i + 1)); }))
    ]);

    var speakerPhotos = images.speakers || {};
    var speakers = h('section', { class: 'lp-section' }, [
      TX('h2', {}, 'speakers.title', 'Tiêu đề phần diễn giả', L.speakers),
      h('div', { class: 'lp-speakers' }, ev.speakers.map(function (s, i) {
        var photo = speakerPhotos[i];
        var avatar = photo
          ? h('img', { class: 'lp-avatar', src: photo, alt: 'Diễn giả ' + s.name + (s.title ? ' – ' + s.title : ''), width: 64, height: 64, loading: 'lazy', decoding: 'async' })
          : h('div', { class: 'lp-avatar', 'aria-hidden': 'true', text: s.name.trim().split(/\s+/).pop().charAt(0).toUpperCase() });
        mark(avatar, 'speaker.avatar.' + i, 'Ảnh diễn giả', 'box');
        if (editable && photo) avatar.setAttribute('data-el-image', 'speaker:' + i);
        return h('div', { class: 'lp-speaker' }, [
          avatar, imageButton('speaker:' + i, photo ? 'Đổi ảnh' : '+ Ảnh'), photo ? editButton('speaker:' + i) : null,
          h('div', { class: 'lp-speaker-info' }, [
            TX('strong', {}, 'speaker.name.' + i, 'Tên diễn giả', s.name),
            s.title ? TX('span', {}, 'speaker.title.' + i, 'Chức danh diễn giả', s.title) : null
          ])
        ]);
      }))
    ]);

    // ALBUM ẢNH (mọi mẫu): 1–6 ảnh, bấm để xem toàn màn hình. Trang công khai không có ảnh thì không có phần này.
    var gallery = null;
    var pics = images.gallery || [], filled = 0, lastFilled = -1;
    for (var gi = 0; gi < GALLERY_SLOTS; gi++) if (pics[gi]) { filled++; lastFilled = gi; }
    if (filled || editable) {
      var cells = [];
      var shown = editable ? Math.min(GALLERY_SLOTS, Math.max(tpl.wedding ? 4 : 2, lastFilled + 2)) : GALLERY_SLOTS;
      for (var g = 0; g < shown; g++) {
        if (pics[g]) {
          var gAlt = (ev.name ? 'Hình ảnh ' + ev.name : 'Hình ảnh sự kiện') + ' – ảnh ' + (cells.length + 1);
          var gimg = h('img', { src: pics[g], alt: gAlt, width: 400, height: 300, loading: 'lazy', decoding: 'async' });
          if (editable) { gimg.setAttribute('data-el-image', 'gallery:' + g); gimg.setAttribute('data-el', 'gallery.img.' + g); gimg.setAttribute('data-el-label', 'Ảnh album ' + (g + 1)); gimg.setAttribute('data-el-kind', 'box'); }
          cells.push(h('div', { class: 'lp-gallery-item' }, [
            editable ? gimg : h('button', { type: 'button', class: 'lp-gallery-open', 'aria-label': 'Phóng to hình ảnh sự kiện ' + (cells.length + 1) }, [gimg]),
            imageButton('gallery:' + g, 'Đổi'), editButton('gallery:' + g)
          ]));
        }
        else if (editable) cells.push(h('div', { class: 'lp-gallery-item is-empty' }, [imageButton('gallery:' + g, '+ Thêm ảnh')]));
      }
      gallery = h('section', { class: 'lp-section lp-gallery-section' }, [
        TX('h2', {}, 'gallery.title', 'Tiêu đề album', tpl.wedding ? 'Khoảnh khắc của chúng mình' : 'Hình ảnh sự kiện'),
        h('div', { class: 'lp-gallery' + (editable ? ' is-editing' : ''), 'data-count': editable ? null : String(filled) }, cells)
      ]);
    }

    var agenda = ev.agenda && ev.agenda.length ? h('section', { class: 'lp-section' }, [
      TX('h2', {}, 'agenda.title', 'Tiêu đề phần chương trình', L.agenda),
      h('ol', { class: 'lp-agenda' }, ev.agenda.map(function (a, i) {
        return h('li', {}, [
          TX('span', { class: 'lp-agenda-time' }, 'agenda.time.' + i, 'Giờ trong chương trình', a.time),
          TX('span', {}, 'agenda.item.' + i, 'Hoạt động trong chương trình', a.title)
        ]);
      }))
    ]) : null;

    var offerLeft = h('p', { class: 'lp-offer-left', hidden: true });
    // Vé ưu đãi: phần chính + cuống vé (xé khi bấm). Cảm hứng Lucian #298 (coupon-tear). Cuống là nút .lp-cta nên mở popup đăng ký ở cả bản xem lẫn file xuất.
    var offerClaim = mark(h('a', { class: 'lp-cta lp-offer-claim', href: '#lp-register', text: txt('offer.claim', 'Nhận ưu đãi') }), 'offer.claim', 'Nút nhận ưu đãi', 'button', { def: 'Nhận ưu đãi' });
    var offer = ev.earlyBird ? h('section', { class: 'lp-section lp-offer' }, [
      TX('h2', {}, 'offer.title', 'Tiêu đề ưu đãi', L.offer),
      h('div', { class: 'lp-offer-card' }, [
        h('div', { class: 'lp-offer-main' }, [
          images.offer
            ? h('figure', { class: 'lp-offer-photo' }, [
              (function (im) { if (editable) im.setAttribute('data-el-image', 'offer'); return im; })(mark(h('img', { src: images.offer, alt: 'Ảnh quà tặng / ưu đãi', width: 96, height: 96, loading: 'lazy', decoding: 'async' }), 'offer.img', 'Ảnh quà tặng / ưu đãi', 'box')),
              imageButton('offer', 'Đổi'), editButton('offer')
            ])
            : h('span', { class: 'lp-offer-ico', 'aria-hidden': 'true' }, [giftIcon()]),
          h('div', { class: 'lp-offer-body' }, [
            TX('p', { class: 'lp-offer-text' }, 'offer.text', 'Nội dung ưu đãi', ev.earlyBird, { multiline: true }),
            ev.earlyBirdUntil ? TX('p', { class: 'lp-offer-until' }, 'offer.until', 'Hạn ưu đãi', 'Áp dụng đến ' + fmtDate(ev.earlyBirdUntil)) : null,
            !images.offer && editable ? h('p', { class: 'lp-slot-add' }, [imageButton('offer', '+ Thêm ảnh quà tặng')]) : null
          ])
        ]),
        h('div', { class: 'lp-offer-stub' }, [offerLeft, offerClaim])
      ])
    ]) : null;

    // FORM ĐĂNG KÝ / XÁC NHẬN THAM DỰ
    // Một bộ dựng dùng cho cả form trong trang (main) lẫn form trong popup đăng ký: cùng kiểm tra, cùng đường gửi (opts.onRegister).
    var submitText = txt('form.submit', L.submit);
    var insts = [];
    function buildReg(isMain) {
      var idp = isMain ? 'lp-' : 'lpp-';
      var formMsg = h('p', { class: 'lp-form-msg', role: 'status', 'aria-live': 'polite' });
      var submitBtn = h('button', { type: 'submit', class: 'lp-submit', text: submitText });
      if (isMain) mark(submitBtn, 'form.submit', 'Nút gửi đăng ký', 'button', { required: true, def: L.submit });
      var consentDef = ' Tôi đồng ý để ban tổ chức dùng thông tin này để liên hệ xác nhận tham dự.';
      var form = h('form', { class: 'lp-form', novalidate: true }, [
        field('name', txt('form.label.name', 'Họ và tên'), 'text', 'Nguyễn Văn A', idp),
        field('phone', txt('form.label.phone', 'Số điện thoại'), 'tel', '0912345678', idp),
        field('email', txt('form.label.email', 'Email'), 'email', 'ten@gmail.com', idp),
        h('label', { class: 'lp-consent' }, [
          h('input', { type: 'checkbox', name: 'consent' }),
          isMain ? TX('span', {}, 'form.consent', 'Dòng đồng ý', consentDef, { multiline: true }) : h('span', { text: txt('form.consent', consentDef) })
        ]),
        h('p', { class: 'lp-error', 'data-error-for': 'consent' }),
        submitBtn, formMsg
      ]);
      if (isMain) {
        [['name', 'Họ và tên'], ['phone', 'Số điện thoại'], ['email', 'Email']].forEach(function (f) {
          mark(form.querySelector('label[for="lp-' + f[0] + '"]'), 'form.label.' + f[0], 'Nhãn ô ' + f[1], 'text', { def: f[1] });
        });
        mark(form, 'form', 'Khung form đăng ký', 'box', { required: true });
      }
      var closed = h('p', { class: 'lp-closed', hidden: true, text: 'Sự kiện đã diễn ra. Cảm ơn bạn đã quan tâm!' });
      var inst = { main: isMain, form: form, submitBtn: submitBtn, formMsg: formMsg, closed: closed };
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitBtn.disabled) return; // chặn bấm liên tục
        submitBtn.disabled = true;
        var data = {
          name: form.elements.name.value, phone: form.elements.phone.value,
          email: form.elements.email.value, consent: form.elements.consent.checked
        };
        submitBtn.textContent = 'Đang gửi…';
        // onRegister có thể trả kết quả ngay hoặc Promise (khi chờ máy chủ)
        Promise.resolve(opts.onRegister(data)).then(function (r) { showResult(inst, r); }, function () {
          showResult(inst, { ok: false, errors: { form: 'Có lỗi xảy ra, vui lòng thử lại.' } });
        });
      });
      insts.push(inst);
      return inst;
    }
    var mainReg = buildReg(true);
    var form = mainReg.form, submitBtn = mainReg.submitBtn, formClosed = mainReg.closed;

    // Popup "Đăng ký thành công": tự chứa (file HTML xuất không nạp popup.js); chỉ ở trang xem, không ở chế độ soạn
    function successPopup(waitlist) {
      var q = root.location ? root.location.search : '';
      if (editable || !container.isConnected || !document.createElement('dialog').showModal) return;
      if (root.navigator && root.navigator.webdriver && !/[?&]popup=1\b/.test(q)) return;
      var calm = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-off');
      var old = container.querySelector('dialog.lp-pop'); if (old) old.remove();
      var prev = document.activeElement;
      var dlg = h('dialog', { class: 'lp-pop' + (waitlist ? ' is-waitlist' : ''), 'aria-labelledby': 'lp-pop-t' });
      var closeBtn = h('button', { type: 'button', class: 'lp-pop-btn is-ghost', text: 'Đóng' });
      var icon = h('div', { class: 'lp-pop-icon', 'aria-hidden': 'true', text: waitlist ? '…' : '✓' });
      var when = fmtDate(ev.startAt);
      var rows = [h('li', {}, [ico('calendar'), h('span', { text: when })]), h('li', {}, [ico('pin'), h('span', { text: ev.location || '' })])];
      var shareBtn = h('button', { type: 'button', class: 'lp-pop-btn is-ghost' });
      var url = (opts.shareUrl || (root.location && /^https?:/.test(root.location.protocol) ? root.location.href.split('#')[0] : '')) || '';
      var canShare = !!(root.navigator && navigator.share);
      shareBtn.textContent = canShare ? 'Chia sẻ cho bạn bè' : 'Sao chép link để chia sẻ';
      shareBtn.addEventListener('click', function () {
        if (canShare) { navigator.share({ title: ev.name, text: ev.name + ' · ' + when, url: url || undefined }).catch(function () {}); return; }
        var done = function () { shareBtn.textContent = 'Đã sao chép link ✓'; };
        if (navigator.clipboard && url) navigator.clipboard.writeText(url).then(done, done); else done();
      });
      var calBtn = h('button', { type: 'button', class: 'lp-pop-btn is-primary', text: 'Thêm vào lịch' });
      calBtn.addEventListener('click', function () {
        var d = new Date(ev.startAt), e2 = new Date(d.getTime() + 2 * 3600 * 1000);
        var f = function (x) { return x.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); };
        var esc = function (t) { return String(t || '').replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n'); };
        var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Xclipse//VI', 'BEGIN:VEVENT', 'UID:' + (ev.id || 'event') + '@xclipse',
          'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(d), 'DTEND:' + f(e2), 'SUMMARY:' + esc(ev.name), 'LOCATION:' + esc(ev.location), url ? 'URL:' + url : '', 'END:VEVENT', 'END:VCALENDAR']
          .filter(Boolean).join('\r\n');
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        a.download = String(ev.name || 'su-kien').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.ics';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        calBtn.textContent = 'Đã tải file lịch ✓';
      });
      var card = h('div', { class: 'lp-pop-card' }, [
        icon,
        h('h2', { id: 'lp-pop-t', class: 'lp-pop-title', text: waitlist ? 'Bạn đã vào danh sách chờ' : 'Đăng ký thành công!' }),
        h('p', { class: 'lp-pop-sub', text: waitlist ? 'Ban tổ chức sẽ liên hệ ngay nếu có chỗ trống cho ' + ev.name + '.' : 'Hẹn gặp bạn tại ' + ev.name + '.' }),
        h('ul', { class: 'lp-pop-meta' }, rows),
        h('div', { class: 'lp-pop-actions' }, [calBtn, shareBtn, closeBtn])
      ]);
      if (!calm && !waitlist) {
        // Pháo giấy: 44 mảnh bắn lên rồi rơi (transform/opacity). Cảm hứng Lucian #320 (scratch-card: confetti bắn theo góc ngẫu nhiên, MIT © 2026 Seokwoooo); màu theo --lp-*
        var dots = [];
        for (var i = 0; i < 44; i++) {
          var ang = (i / 44) * 6.2832 + ((i * 7) % 5) * 0.09, dist = 70 + (i * 53) % 120;
          dots.push(h('i', { style: '--dx:' + Math.round(Math.cos(ang) * dist) + 'px;--dy:' + Math.round(Math.sin(ang) * dist - 70) + 'px;--r:' + (((i * 97) % 14) * 60 - 360) + 'deg;--c:' + (i % 5) + ';--dl:' + (i % 6) * 18 + 'ms' }));
        }
        card.appendChild(h('div', { class: 'lp-pop-burst', 'aria-hidden': 'true' }, dots));
      }
      dlg.appendChild(card);
      container.appendChild(dlg);
      function close() {
        if (!dlg.isConnected) return;
        if (dlg.open) dlg.close();
        dlg.remove();
        if (prev && prev.focus && prev.isConnected) { try { prev.focus(); } catch (x) {} }
      }
      closeBtn.addEventListener('click', close);
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
      dlg.addEventListener('mousedown', function (e) { if (e.target === dlg) close(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = dlg.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      dlg.showModal();
      calBtn.focus();
    }

    function showResult(inst, result) {
      var form = inst.form, formMsg = inst.formMsg, submitBtn = inst.submitBtn;
      form.querySelectorAll('[data-error-for]').forEach(function (p) { p.textContent = ''; });
      form.querySelectorAll('input').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      formMsg.className = 'lp-form-msg';
      if (result.ok) {
        formMsg.textContent = result.waitlist
          ? 'Sự kiện đã đủ chỗ. Bạn đã được thêm vào danh sách chờ, ban tổ chức sẽ liên hệ nếu có chỗ trống.'
          : L.success;
        formMsg.classList.add('is-success');
        form.reset();
        if (!inst.main) closeReg(); // đóng popup đăng ký (trả tiêu điểm) rồi mới hiện popup thành công
        successPopup(!!result.waitlist);
      } else {
        Object.keys(result.errors).forEach(function (k) {
          var p = form.querySelector('[data-error-for="' + k + '"]');
          if (p) { p.textContent = result.errors[k]; if (form.elements[k]) form.elements[k].setAttribute('aria-invalid', 'true'); }
        });
        if (result.errors.form) { formMsg.textContent = result.errors.form; formMsg.classList.add('is-error'); }
      }
      update();
      submitBtn.disabled = !ES.getStatus(ev, opts.getCount(), opts.now()).canRegister;
    }

    // ---------- Popup đăng ký (mở từ mọi nút .lp-cta và thanh dính; không mở khi đang soạn) ----------
    var regDlg = null, regInst = null, regPrev = null;
    var regSeats = h('p', { class: 'lp-reg-seats', hidden: true });
    function buildRegDialog() {
      regInst = buildReg(false);
      var rows = [h('li', {}, [ico('calendar'), h('span', { text: fmtDate(ev.startAt) })]), h('li', {}, [ico('pin'), h('span', { text: ev.location || '' })])];
      var dlg = h('dialog', { class: 'lp-reg', 'aria-labelledby': 'lp-reg-t', 'aria-modal': 'true', role: 'dialog' });
      var closeBtn = h('button', { type: 'button', class: 'lp-reg-x', 'aria-label': 'Đóng' }, [ico('x', 18)]);
      closeBtn.addEventListener('click', function () { closeReg(); });
      var offerLine = ev.earlyBird ? h('p', { class: 'lp-reg-offer' }, [h('span', { class: 'lp-reg-offer-ico', 'aria-hidden': 'true' }, [giftIcon()]), h('span', { text: txt('offer.text', ev.earlyBird) })]) : null;
      var card = h('div', { class: 'lp-reg-card', tabindex: '-1' }, [
        closeBtn,
        h('p', { class: 'lp-reg-kicker', text: ev.name }),
        h('h2', { id: 'lp-reg-t', class: 'lp-reg-title', text: txt('register.title', L.register) }),
        h('ul', { class: 'lp-reg-meta' }, rows),
        offerLine, regSeats,
        regInst.form, regInst.closed,
        h('p', { class: 'lp-reg-trust' }, [h('span', { 'aria-hidden': 'true', class: 'lp-reg-lock' }, [ico('lock', 14)]), h('span', { text: 'Chúng tôi chỉ dùng thông tin để xác nhận chỗ' })])
      ]);
      dlg.appendChild(card);
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeReg(); });
      dlg.addEventListener('mousedown', function (e) { if (e.target === dlg) closeReg(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = Array.prototype.filter.call(dlg.querySelectorAll('button, input, a[href]'), function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      return dlg;
    }
    function openReg() {
      if (editable || regDlg) return;
      if (!document.createElement('dialog').showModal) { var r = container.querySelector('#lp-register'); if (r && r.scrollIntoView) r.scrollIntoView(); return; }
      regPrev = document.activeElement;
      regDlg = buildRegDialog();
      container.appendChild(regDlg);
      update();
      regDlg.showModal();
      var first = regInst.form.hidden ? regDlg.querySelector('.lp-reg-x') : regInst.form.elements.name;
      var coarse = root.matchMedia && root.matchMedia('(pointer: coarse)').matches;
      (coarse ? regDlg.querySelector('.lp-reg-card') : first).focus();
    }
    function closeReg() {
      if (!regDlg) return;
      var dlg = regDlg, prev = regPrev, inst = regInst;
      regDlg = regInst = regPrev = null;
      insts.splice(insts.indexOf(inst), 1);
      if (dlg.open) dlg.close();
      dlg.remove();
      if (prev && prev.focus && prev.isConnected) { try { prev.focus(); } catch (x) {} }
    }
    // Bản xuất HTML: giữ sẵn popup trong mã nguồn (script của file xuất tự mở/đóng)
    if (opts.keepPopup && !editable) { var kd = buildRegDialog(); container.appendChild(kd); regDlg = null; regInst = null; }

    var register = h('section', { class: 'lp-section lp-register', id: 'lp-register' }, [
      TX('h2', {}, 'register.title', 'Tiêu đề phần đăng ký', L.register), form, formClosed
    ]);

    // Thanh CTA dính đáy (điện thoại): hiện khi cuộn qua hero, ẩn gần form đăng ký / chân trang
    var stickyInfo1 = h('strong', { class: 'lp-sticky-main' }), stickyInfo2 = h('span', { class: 'lp-sticky-sub' });
    var stickyBtn = h('button', { type: 'button', class: 'lp-sticky-btn', text: ctaText });
    var sticky = h('div', { class: 'lp-sticky', 'aria-hidden': 'true' }, [h('div', { class: 'lp-sticky-info' }, [stickyInfo1, stickyInfo2]), stickyBtn]);
    var stickyWrap = h('div', { class: 'lp-sticky-wrap' }, [sticky]);

    // ---------- Thư viện khối ----------
    var blocks = ev.blocks || {};
    function listBlock(key, cls, title, itemFn) {
      var n = blockCount(ev, key), defs = BLOCK_ITEMS[key], items = [];
      for (var i = 0; i < n; i++) items.push(itemFn(i, defs[i] || defs[defs.length - 1]));
      var list = h('div', { class: cls }, items);
      if (editable) list.setAttribute('data-block-list', key);
      return h('section', { class: 'lp-section lp-block-' + key }, [TX('h2', {}, key + '.title', 'Tiêu đề khối', title), list]);
    }
    var faq = listBlock('faq', 'lp-faq', 'Câu hỏi thường gặp', function (i, d) {
      var q = TX('summary', {}, 'faq.q.' + i, 'Câu hỏi ' + (i + 1), d[0]);
      var item = h('details', { class: 'lp-faq-item', open: editable ? true : null }, [q, TX('p', {}, 'faq.a.' + i, 'Trả lời ' + (i + 1), d[1], { multiline: true })]);
      // Đang soạn: bấm vào câu hỏi để sửa chứ không gập lại
      if (editable) q.addEventListener('click', function (e) { e.preventDefault(); });
      return item;
    });
    var testimonials = listBlock('testimonials', 'lp-quotes', 'Mọi người nói gì', function (i, d) {
      return h('figure', { class: 'lp-quote' }, [
        TX('blockquote', {}, 'testimonials.q.' + i, 'Lời nhận xét ' + (i + 1), d[0], { multiline: true }),
        TX('figcaption', {}, 'testimonials.by.' + i, 'Người nhận xét ' + (i + 1), d[1])
      ]);
    });
    var sponsors = listBlock('sponsors', 'lp-sponsors', 'Đồng hành cùng sự kiện', function (i, d) {
      return TX('span', { class: 'lp-sponsor' }, 'sponsors.name.' + i, 'Tên đối tác ' + (i + 1), d[0]);
    });
    var vSrc = videoEmbed((blocks.video || {}).url);
    var video = h('section', { class: 'lp-section lp-block-video' }, [
      TX('h2', {}, 'video.title', 'Tiêu đề khối video', 'Xem nhanh về sự kiện'),
      mark(h('div', { class: 'lp-video' }, [vSrc
        ? h('iframe', { src: vSrc, title: 'Video giới thiệu', loading: 'lazy', allow: 'encrypted-media; picture-in-picture', allowfullscreen: true, referrerpolicy: 'strict-origin-when-cross-origin' })
        : h('p', { class: 'lp-video-empty', text: editable ? 'Dán link YouTube/Vimeo trong bảng chỉnh khối này' : 'Video sẽ được cập nhật sớm' })]), 'video.frame', 'Khung video', 'box')
    ]);
    var mapQ = String((blocks.map || {}).query || ev.location || '').slice(0, 200);
    var map = h('section', { class: 'lp-section lp-block-map' }, [
      TX('h2', {}, 'map.title', 'Tiêu đề khối bản đồ', 'Đường đến sự kiện'),
      TX('p', { class: 'lp-map-addr' }, 'map.addr', 'Địa chỉ hiển thị', ev.location),
      mark(h('div', { class: 'lp-map' }, [mapQ ? h('iframe', { src: 'https://maps.google.com/maps?q=' + encodeURIComponent(mapQ) + '&output=embed', title: 'Bản đồ ' + mapQ, loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade' }) : null]), 'map.frame', 'Khung bản đồ', 'box')
    ]);
    var cta2 = h('section', { class: 'lp-section lp-cta2' }, [
      TX('h2', {}, 'cta2.title', 'Tiêu đề kêu gọi', 'Chỉ còn {con_cho} chỗ – giữ chỗ ngay'),
      TX('p', {}, 'cta2.text', 'Nội dung kêu gọi', 'Đã có {so_dang_ky} người đăng ký. Sự kiện diễn ra sau {dem_nguoc} ngày nữa.', { multiline: true }),
      mark(h('a', { class: 'lp-cta', href: '#lp-register', text: txt('cta2.btn', 'Đăng ký ngay') }), 'cta2.btn', 'Nút kêu gọi cuối trang', 'button', { def: 'Đăng ký ngay' })
    ]);

    // CHÂN TRANG: ghi nguồn studio (thiệp cưới) + đường dẫn "Tạo trang như thế này" (phễu lan truyền)
    // Tên sự kiện và địa chỉ tách 2 dòng: trên điện thoại không bị ngắt giữa chừng
    var footerChildren = [TX('p', { class: 'lp-foot-name' }, 'footer.info', 'Dòng chân trang', ev.name), TX('p', { class: 'lp-foot-addr' }, 'footer.addr', 'Địa chỉ ở chân trang', ev.location)];
    var bf = brandFooter();
    if (bf) footerChildren.unshift(bf);
    if (ev.studioName) {
      footerChildren.push(h('p', { class: 'lp-credit' }, [
        'Ảnh cưới: ', h('strong', { text: ev.studioName }),
        isSafeUrl(ev.studioUrl) ? h('a', { class: 'lp-credit-cta', href: ev.studioUrl, target: '_blank', rel: 'noopener nofollow', 'data-funnel': 'studio', text: 'Đặt lịch chụp' }) : null
      ]));
    }
    if (opts.appUrl) {
      footerChildren.push(h('a', { class: 'lp-made-with', href: opts.appUrl, target: '_blank', rel: 'noopener', 'data-funnel': 'app' }, [
        h('span', { class: 'lp-mw-spark', 'aria-hidden': 'true', text: '✦' }),
        h('span', { class: 'lp-mw-text' }, ['Tạo trang ', h('span', { class: 'lp-mw-long', text: 'như thế này ' }), h('strong', { text: 'miễn phí' }), ' bằng ', h('span', { class: 'lp-mw-brand', text: 'Xclipse' })]),
        h('span', { class: 'lp-mw-arrow', 'aria-hidden': 'true', text: '→' })
      ]));
    }
    var footer = mark(h('footer', { class: 'lp-footer' }, footerChildren), 'footer', 'Chân trang', 'box', { required: true });

    var byKey = { countdown: countdownSection, about: about, benefits: benefits, speakers: speakers, gallery: gallery, agenda: agenda, offer: offer, register: register,
      faq: faq, testimonials: testimonials, sponsors: sponsors, video: video, map: map, cta2: cta2 };
    container.appendChild(hero);
    normalizeSections(ev.sections).forEach(function (s) {
      if (s.visible && byKey[s.key]) {
        var el = byKey[s.key], sec = st.sections[s.key] || {};
        el.setAttribute('data-section', s.key);
        if (editable) {
          var meta = SECTIONS.filter(function (x) { return x.key === s.key; })[0];
          el.setAttribute('data-el', 'section.' + s.key);
          el.setAttribute('data-el-label', 'Phần: ' + meta.label);
          el.setAttribute('data-el-kind', 'section');
          el.setAttribute('data-el-required', '');
        }
        if (sec.bg && sec.bg !== 'auto') el.classList.add('lp-bg-' + sec.bg);
        if (sec.align && sec.align !== 'auto') el.classList.add('lp-align-' + sec.align);
        if (root.EP.pageStyle) root.EP.pageStyle.sectionInline(el, sec);
        container.appendChild(el);
      }
    });
    container.appendChild(footer);
    if (!editable) lightboxInit(container);
    if (!editable && st.motion !== 'off' && !opts.keepPopup) motionInit(container);
    if (!editable) container.appendChild(stickyWrap);

    // Trang xem: mọi nút CTA mở popup đăng ký (href #lp-register chỉ còn là phương án dự phòng khi không có JS)
    if (!editable) {
      container.querySelectorAll('.lp-cta').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); openReg(); }); });
      stickyBtn.addEventListener('click', function () { if (opts.onFunnel) opts.onFunnel('ctaClicks'); openReg(); });
    }

    // Đang soạn: bấm nút/link không chuyển trang (để chọn & chỉnh)
    if (editable) container.querySelectorAll('a[href]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

    // Đo phễu: bấm nút đăng ký ở đầu trang, bấm đặt lịch studio, bấm "Tạo trang như thế này"
    if (opts.onFunnel) {
      container.querySelectorAll('.lp-cta').forEach(function (a) { a.addEventListener('click', function () { opts.onFunnel('ctaClicks'); }); });
      container.querySelectorAll('[data-funnel="studio"]').forEach(function (a) { a.addEventListener('click', function () { opts.onFunnel('studioClicks'); }); });
      container.querySelectorAll('[data-funnel="app"]').forEach(function (a) { a.addEventListener('click', function () { opts.onFunnel('appClicks'); }); });
    }

    function update() {
      var now = opts.now();
      var count = opts.getCount();
      var status = ES.getStatus(ev, count, now);
      statusBadge.textContent = status.label;
      statusBadge.className = 'lp-badge is-' + status.code;
      if (lastCount != null && count > lastCount) retrigger(countText, 'bump');
      lastCount = count;
      countText.textContent = count.toLocaleString('vi-VN');
      if (LU) LU.refreshVars(container, ev, count, now);

      var cd = ES.countdown(ev, now);
      countdownEl.hidden = !cd;
      endedEl.hidden = !!cd;
      if (cd) Object.keys(cd).forEach(function (u) {
        var v = pad(cd[u]);
        if (cdBoxes[u].textContent && cdBoxes[u].textContent !== v) retrigger(cdBoxes[u], 'tick');
        cdBoxes[u].textContent = v;
      });

      var offerOn = ES.isEarlyBirdActive(ev, now);
      if (offer) offer.hidden = !offerOn;
      insts.forEach(function (inst) {
        inst.form.hidden = !status.canRegister;
        inst.closed.hidden = status.canRegister;
        if (!inst.submitBtn.disabled || inst.submitBtn.textContent !== 'Đang gửi…') {
          inst.submitBtn.textContent = status.waitlist ? 'Vào danh sách chờ' : submitText;
        }
      });

      // Số chỗ còn lại, chip social proof, đếm ngược ưu đãi, thanh dính
      var cap = Number(ev.capacity) || 0, left = cap ? Math.max(0, cap - count) : null;
      var seats = !cap || status.code === 'ended' ? '' : (left > 0 ? 'Còn ' + left.toLocaleString('vi-VN') + ' chỗ' : 'Đã hết chỗ');
      regSeats.textContent = seats; regSeats.hidden = !seats;
      regSeats.className = 'lp-reg-seats' + (left != null && left <= Math.ceil(cap * 0.1) ? ' is-hot' : '');
      if (!chipText.__cu) chipText.textContent = count.toLocaleString('vi-VN') + ' ' + String(L.countSuffix || ' người đã đăng ký').trim();
      proofChip.hidden = !(count > 0) || status.code === 'ended';
      if (ev.earlyBirdUntil && offerOn) {
        var dl = Math.ceil((new Date(ev.earlyBirdUntil) - now) / 86400000);
        offerLeft.textContent = dl <= 1 ? 'Hết hạn hôm nay' : 'Còn ' + dl + ' ngày';
        offerLeft.hidden = false;
      } else offerLeft.hidden = true;
      var cdn = ES.countdown(ev, now), short = '';
      if (cdn) short = cdn.days > 0 ? 'Còn ' + cdn.days + ' ngày' : (cdn.hours > 0 ? 'Còn ' + cdn.hours + ' giờ' : 'Còn ' + cdn.minutes + ' phút');
      stickyInfo1.textContent = seats && left > 0 ? seats : (status.code === 'ended' ? 'Sự kiện đã diễn ra' : (seats || ev.name));
      stickyInfo2.textContent = status.code === 'ended' ? '' : short;
      stickyBtn.textContent = status.code === 'ended' ? 'Xem thông tin' : (status.waitlist ? 'Vào danh sách chờ' : ctaText);
      if (regInst) { /* popup đang mở: form/closed đã cập nhật ở trên */ }
    }

    // Thanh dính: IntersectionObserver (không lắng nghe scroll)
    if (!editable && typeof IntersectionObserver === 'function') {
      var vis = { hero: true, reg: false, foot: false };
      var applySticky = function () {
        var on = !vis.hero && !vis.reg && !vis.foot;
        sticky.classList.toggle('is-on', on);
        sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
        stickyBtn.tabIndex = on ? 0 : -1;
      };
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { vis[en.target === hero ? 'hero' : en.target === footer ? 'foot' : 'reg'] = en.isIntersecting; });
        applySticky();
      }, { threshold: 0 });
      sio.observe(hero); sio.observe(footer);
      if (register.isConnected) sio.observe(register);
      applySticky();
    }

    // Hiệu ứng: chỉ ở trang xem (không làm phiền khi đang soạn)
    var lastCount = null;
    function retrigger(el, cls) {
      el.classList.remove(cls);
      void el.offsetWidth; // ép trình duyệt chạy lại animation
      el.classList.add(cls);
    }
    if (!editable && st.motion !== 'off') {
      var revealEls = Array.prototype.slice.call(container.children).filter(function (el) { return el !== hero && el.tagName !== 'STYLE' && el.tagName !== 'DIALOG' && el !== stickyWrap; });
      revealEls.forEach(function (el) { el.classList.add('lp-reveal'); });
      if (typeof IntersectionObserver === 'function') {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
        }, { threshold: 0, rootMargin: '0px 0px 25% 0px' }); // hiện trước khi phần đó vào màn hình: vuốt nhanh không thấy khoảng trắng
        revealEls.forEach(function (el) { io.observe(el); });
      } else {
        revealEls.forEach(function (el) { el.classList.add('is-in'); });
      }
    }

    update();
    return { update: update };
  }

  root.EP = root.EP || {};
  root.EP.landingRenderer = { render: render, h: h, SECTIONS: SECTIONS, normalizeSections: normalizeSections, BLOCK_ITEMS: BLOCK_ITEMS, MAX_ITEMS: MAX_ITEMS, blockCount: blockCount, videoEmbed: videoEmbed, lightboxInit: lightboxInit, motionInit: motionInit };
})(typeof window !== 'undefined' ? window : globalThis);
