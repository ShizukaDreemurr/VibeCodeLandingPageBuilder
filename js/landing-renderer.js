/*
 * landing-renderer.js — dựng landing page từ dữ liệu sự kiện + nội dung + mẫu (template).
 * Mọi chữ người dùng nhập đều đi qua textContent (không chèn HTML) để tránh lỗi bảo mật.
 */
(function (root) {
  var ES = root.EP.eventStatus;
  var T = root.EP.templates;
  var GALLERY_SLOTS = 4;

  // Thứ tự mặc định các phần giữa hero và footer. locked = bắt buộc theo đề, không cho ẩn.
  var SECTIONS = [
    { key: 'countdown', label: 'Đếm ngược + số đăng ký', locked: true },
    { key: 'about', label: 'Giới thiệu' },
    { key: 'benefits', label: '3 lợi ích' },
    { key: 'speakers', label: 'Diễn giả' },
    { key: 'gallery', label: 'Album ảnh (thiệp cưới)' },
    { key: 'agenda', label: 'Chương trình (agenda)', locked: true },
    { key: 'offer', label: 'Ưu đãi đăng ký sớm' },
    { key: 'register', label: 'Form đăng ký', locked: true }
  ];

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
      if (!out.some(function (o) { return o.key === s.key; })) out.push({ key: s.key, visible: true });
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

  function pad(n) { return String(n).padStart(2, '0'); }

  function isSafeUrl(url) { return /^https?:\/\/\S+$/i.test(url || ''); }

  function field(name, label, type, placeholder) {
    return h('div', { class: 'lp-field' }, [
      h('label', { for: 'lp-' + name, text: label }),
      h('input', { id: 'lp-' + name, name: name, type: type, placeholder: placeholder, autocomplete: 'on' }),
      h('p', { class: 'lp-error', 'data-error-for': name, 'aria-live': 'polite' })
    ]);
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
    Object.keys(vars).forEach(function (k) { container.style.setProperty(k, vars[k]); });

    // Nút đổi ảnh (chỉ ở chế độ soạn)
    function imageButton(slot, label) {
      if (!editable) return null;
      return h('button', {
        type: 'button', class: 'lp-img-btn', 'data-slot': slot, text: label,
        onclick: function (e) { e.preventDefault(); if (opts.onPickImage) opts.onPickImage(slot); }
      });
    }

    var statusBadge = h('span', { class: 'lp-badge' });
    var countText = h('strong', { class: 'lp-count' });
    var cdBoxes = {};
    var countdownEl = h('div', { class: 'lp-countdown', role: 'timer' },
      ['days', 'hours', 'minutes', 'seconds'].map(function (unit, i) {
        cdBoxes[unit] = h('span', { class: 'lp-cd-num', text: '00' });
        return h('div', { class: 'lp-cd-box' }, [cdBoxes[unit], h('span', { class: 'lp-cd-label', text: ['ngày', 'giờ', 'phút', 'giây'][i] })]);
      }));
    var endedEl = h('p', { class: 'lp-ended', text: 'Sự kiện đã diễn ra', hidden: true });

    // Chữ do AI viết: sửa trực tiếp khi soạn (field = headline | description | benefits:i)
    function editableText(tag, attrs, field, text) {
      attrs.text = text;
      if (editable && opts.onEditContent) {
        attrs.contenteditable = 'true';
        attrs.spellcheck = 'false';
        attrs['data-field'] = field;
        attrs.title = 'Bấm để sửa chữ';
        attrs.onblur = function (e) {
          var v = e.target.textContent.trim();
          if (!v) { e.target.textContent = text; return; } // không cho để trống
          if (v !== text) opts.onEditContent(field, v);
        };
        attrs.onkeydown = function (e) { if (e.key === 'Enter' && tag !== 'p') { e.preventDefault(); e.target.blur(); } };
      }
      return h(tag, attrs);
    }

    // HERO (có ảnh nền nếu người dùng tải lên)
    var hero = h('section', { class: 'lp-hero' + (images.hero ? ' has-image' : '') }, [
      statusBadge,
      h('p', { class: 'lp-eyebrow', text: ev.name }),
      editableText('h1', { class: 'lp-headline' }, 'headline', content.headline),
      h('p', { class: 'lp-meta' }, [h('span', { text: '🗓 ' + fmtDate(ev.startAt) }), h('span', { text: '📍 ' + ev.location })]),
      h('a', { class: 'lp-cta', href: '#lp-register', text: L.submit }),
      imageButton('hero', images.hero ? '🖼 Đổi ảnh bìa' : '🖼 Thêm ảnh bìa')
    ]);
    if (images.hero) hero.style.setProperty('--lp-hero-image', 'url("' + images.hero.replace(/"/g, '') + '")');

    var countdownSection = h('section', { class: 'lp-section lp-countdown-section' }, [
      h('h2', { text: L.countdown }), countdownEl, endedEl,
      h('p', { class: 'lp-social-proof' }, [countText, L.countSuffix])
    ]);

    var about = h('section', { class: 'lp-section' }, [h('h2', { text: L.about }), editableText('p', {}, 'description', content.description)]);

    var benefits = h('section', { class: 'lp-section' }, [
      h('h2', { text: L.benefits }),
      h('ul', { class: 'lp-benefits' }, content.benefits.map(function (b, i) { return editableText('li', {}, 'benefits:' + i, b); }))
    ]);

    var speakerPhotos = images.speakers || {};
    var speakers = h('section', { class: 'lp-section' }, [
      h('h2', { text: L.speakers }),
      h('div', { class: 'lp-speakers' }, ev.speakers.map(function (s, i) {
        var photo = speakerPhotos[i];
        var avatar = photo
          ? h('img', { class: 'lp-avatar', src: photo, alt: s.name })
          : h('div', { class: 'lp-avatar', 'aria-hidden': 'true', text: s.name.trim().split(/\s+/).pop().charAt(0).toUpperCase() });
        return h('div', { class: 'lp-speaker' }, [
          avatar, imageButton('speaker:' + i, photo ? 'Đổi ảnh' : '+ Ảnh'),
          h('strong', { text: s.name }), s.title ? h('span', { text: s.title }) : null
        ]);
      }))
    ]);

    // ALBUM ẢNH (mẫu thiệp cưới)
    var gallery = null;
    if (tpl.wedding) {
      var pics = images.gallery || [];
      var cells = [];
      for (var g = 0; g < GALLERY_SLOTS; g++) {
        if (pics[g]) cells.push(h('div', { class: 'lp-gallery-item' }, [h('img', { src: pics[g], alt: 'Ảnh cưới ' + (g + 1), loading: 'lazy' }), imageButton('gallery:' + g, 'Đổi')]));
        else if (editable) cells.push(h('div', { class: 'lp-gallery-item is-empty' }, [imageButton('gallery:' + g, '+ Thêm ảnh cưới')]));
      }
      if (cells.length) gallery = h('section', { class: 'lp-section' }, [h('h2', { text: 'Khoảnh khắc của chúng mình' }), h('div', { class: 'lp-gallery' }, cells)]);
    }

    var agenda = ev.agenda && ev.agenda.length ? h('section', { class: 'lp-section' }, [
      h('h2', { text: L.agenda }),
      h('ol', { class: 'lp-agenda' }, ev.agenda.map(function (a) {
        return h('li', {}, [h('span', { class: 'lp-agenda-time', text: a.time }), h('span', { text: a.title })]);
      }))
    ]) : null;

    var offer = ev.earlyBird ? h('section', { class: 'lp-section lp-offer' }, [
      h('h2', { text: L.offer }), h('p', { text: ev.earlyBird }),
      ev.earlyBirdUntil ? h('p', { class: 'lp-offer-until', text: 'Áp dụng đến ' + fmtDate(ev.earlyBirdUntil) }) : null
    ]) : null;

    // FORM ĐĂNG KÝ / XÁC NHẬN THAM DỰ
    var formMsg = h('p', { class: 'lp-form-msg', role: 'status', 'aria-live': 'polite' });
    var submitBtn = h('button', { type: 'submit', class: 'lp-submit', text: L.submit });
    var form = h('form', { class: 'lp-form', novalidate: true }, [
      field('name', 'Họ và tên', 'text', 'Nguyễn Văn A'),
      field('phone', 'Số điện thoại', 'tel', '0912345678'),
      field('email', 'Email', 'email', 'ten@gmail.com'),
      h('label', { class: 'lp-consent' }, [
        h('input', { type: 'checkbox', name: 'consent' }),
        ' Tôi đồng ý để ban tổ chức dùng thông tin này để liên hệ xác nhận tham dự.'
      ]),
      h('p', { class: 'lp-error', 'data-error-for': 'consent' }),
      submitBtn, formMsg
    ]);
    var formClosed = h('p', { class: 'lp-closed', hidden: true, text: 'Sự kiện đã diễn ra. Cảm ơn bạn đã quan tâm!' });

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
      Promise.resolve(opts.onRegister(data)).then(showResult, function () {
        showResult({ ok: false, errors: { form: 'Có lỗi xảy ra, vui lòng thử lại.' } });
      });
    });

    function showResult(result) {
      form.querySelectorAll('[data-error-for]').forEach(function (p) { p.textContent = ''; });
      form.querySelectorAll('input').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      formMsg.className = 'lp-form-msg';
      if (result.ok) {
        formMsg.textContent = result.waitlist
          ? 'Sự kiện đã đủ chỗ. Bạn đã được thêm vào danh sách chờ, ban tổ chức sẽ liên hệ nếu có chỗ trống.'
          : L.success;
        formMsg.classList.add('is-success');
        form.reset();
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

    var register = h('section', { class: 'lp-section lp-register', id: 'lp-register' }, [
      h('h2', { text: L.register }), form, formClosed
    ]);

    // CHÂN TRANG: ghi nguồn studio (thiệp cưới) + đường dẫn "Tạo trang như thế này" (phễu lan truyền)
    var footerChildren = [h('p', { text: ev.name + ' · ' + ev.location })];
    if (ev.studioName) {
      footerChildren.push(h('p', { class: 'lp-credit' }, [
        'Ảnh cưới: ', h('strong', { text: ev.studioName }),
        isSafeUrl(ev.studioUrl) ? h('a', { class: 'lp-credit-cta', href: ev.studioUrl, target: '_blank', rel: 'noopener', 'data-funnel': 'studio', text: 'Đặt lịch chụp' }) : null
      ]));
    }
    if (opts.appUrl) {
      footerChildren.push(h('a', { class: 'lp-made-with', href: opts.appUrl, target: '_blank', rel: 'noopener', 'data-funnel': 'app', text: 'Tạo trang như thế này miễn phí bằng Xclipse →' }));
    }
    var footer = h('footer', { class: 'lp-footer' }, footerChildren);

    var byKey = { countdown: countdownSection, about: about, benefits: benefits, speakers: speakers, gallery: gallery, agenda: agenda, offer: offer, register: register };
    container.appendChild(hero);
    normalizeSections(ev.sections).forEach(function (s) {
      if (s.visible && byKey[s.key]) container.appendChild(byKey[s.key]);
    });
    container.appendChild(footer);

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

      var cd = ES.countdown(ev, now);
      countdownEl.hidden = !cd;
      endedEl.hidden = !!cd;
      if (cd) Object.keys(cd).forEach(function (u) {
        var v = pad(cd[u]);
        if (cdBoxes[u].textContent && cdBoxes[u].textContent !== v) retrigger(cdBoxes[u], 'tick');
        cdBoxes[u].textContent = v;
      });

      if (offer) offer.hidden = !ES.isEarlyBirdActive(ev, now);
      form.hidden = !status.canRegister;
      formClosed.hidden = status.canRegister;
      if (!submitBtn.disabled || submitBtn.textContent !== 'Đang gửi…') {
        submitBtn.textContent = status.waitlist ? 'Vào danh sách chờ' : L.submit;
      }
    }

    // Hiệu ứng: chỉ ở trang xem (không làm phiền khi đang soạn)
    var lastCount = null;
    function retrigger(el, cls) {
      el.classList.remove(cls);
      void el.offsetWidth; // ép trình duyệt chạy lại animation
      el.classList.add(cls);
    }
    if (!editable) {
      var revealEls = Array.prototype.slice.call(container.children).filter(function (el) { return el !== hero; });
      revealEls.forEach(function (el) { el.classList.add('lp-reveal'); });
      if (typeof IntersectionObserver === 'function') {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
      } else {
        revealEls.forEach(function (el) { el.classList.add('is-in'); });
      }
    }

    update();
    return { update: update };
  }

  root.EP = root.EP || {};
  root.EP.landingRenderer = { render: render, h: h, SECTIONS: SECTIONS, normalizeSections: normalizeSections };
})(typeof window !== 'undefined' ? window : globalThis);
