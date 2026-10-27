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

  // Icon nét từ icons.js (nếu chưa nạp thì bỏ qua)
  function ico(name, size) {
    if (!root.EP.icons) return null;
    var n = root.EP.icons.node(name, size || 16);
    n.classList.add('lp-ic');
    return n;
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

    var statusBadge = h('span', { class: 'lp-badge' });
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
      if (st.hidden && !required) {
        if (editable) node.classList.add('lp-el-hidden'); else node.hidden = true;
      }
    }
    function makeEditable(node, key, opt) {
      node.contentEditable = 'true';
      node.spellcheck = false;
      var original = node.textContent;
      node.addEventListener('blur', function () {
        var v = node.textContent.replace(/\s+/g, ' ').trim();
        if (!v) { node.textContent = original; return; } // không cho để trống
        if (v === original) return;
        if (opt.field && opts.onEditContent) opts.onEditContent(opt.field, v);
        else if (opts.onEditText) opts.onEditText(key, v);
      });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !opt.multiline) { e.preventDefault(); node.blur(); }
        if (e.key === 'Escape') { node.textContent = original; node.blur(); }
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

    // HERO (có ảnh nền nếu người dùng tải lên)
    mark(statusBadge, 'hero.badge', 'Nhãn trạng thái', 'box', { required: true });
    var ctaText = txt('hero.cta', (st.ctaText || '').trim() || L.submit);
    var cta = mark(h('a', { class: 'lp-cta', href: '#lp-register', text: ctaText }), 'hero.cta', 'Nút chính', 'button', { def: L.submit });
    var hero = h('section', { class: 'lp-hero' + (images.hero ? ' has-image' : '') }, [
      editableText('h1', { class: 'lp-headline' }, 'headline', content.headline, 'Tiêu đề chính'),
      TX('p', { class: 'lp-eyebrow' }, 'hero.eyebrow', 'Tên sự kiện', ev.name),
      mark(h('p', { class: 'lp-meta' }, [
        h('span', { class: 'lp-meta-item' }, [ico('calendar'), TX('span', {}, 'hero.date', 'Thời gian', fmtDate(ev.startAt))]),
        h('span', { class: 'lp-meta-item' }, [ico('pin'), TX('span', {}, 'hero.location', 'Địa điểm', ev.location)])
      ]), 'hero.meta', 'Dòng thời gian & địa điểm', 'box'),
      h('div', { class: 'lp-hero-action' }, [cta, statusBadge]),
      imageButton('hero', images.hero ? 'Đổi ảnh bìa' : 'Thêm ảnh bìa')
    ]);
    if (images.hero) hero.style.setProperty('--lp-hero-image', 'url("' + images.hero.replace(/"/g, '') + '")');
    mark(hero, 'hero', 'Phần đầu trang', 'box', { required: true });

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

    var about = h('section', { class: 'lp-section' }, [
      TX('h2', {}, 'about.title', 'Tiêu đề phần giới thiệu', L.about),
      editableText('p', {}, 'description', content.description, 'Đoạn giới thiệu')
    ]);

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
          ? h('img', { class: 'lp-avatar', src: photo, alt: s.name })
          : h('div', { class: 'lp-avatar', 'aria-hidden': 'true', text: s.name.trim().split(/\s+/).pop().charAt(0).toUpperCase() });
        mark(avatar, 'speaker.avatar.' + i, 'Ảnh diễn giả', 'box');
        return h('div', { class: 'lp-speaker' }, [
          avatar, imageButton('speaker:' + i, photo ? 'Đổi ảnh' : '+ Ảnh'),
          TX('strong', {}, 'speaker.name.' + i, 'Tên diễn giả', s.name),
          s.title ? TX('span', {}, 'speaker.title.' + i, 'Chức danh diễn giả', s.title) : null
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
      if (cells.length) gallery = h('section', { class: 'lp-section' }, [TX('h2', {}, 'gallery.title', 'Tiêu đề album', 'Khoảnh khắc của chúng mình'), h('div', { class: 'lp-gallery' }, cells)]);
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

    var offer = ev.earlyBird ? h('section', { class: 'lp-section lp-offer' }, [
      TX('h2', {}, 'offer.title', 'Tiêu đề ưu đãi', L.offer), TX('p', {}, 'offer.text', 'Nội dung ưu đãi', ev.earlyBird, { multiline: true }),
      ev.earlyBirdUntil ? TX('p', { class: 'lp-offer-until' }, 'offer.until', 'Hạn ưu đãi', 'Áp dụng đến ' + fmtDate(ev.earlyBirdUntil)) : null
    ]) : null;

    // FORM ĐĂNG KÝ / XÁC NHẬN THAM DỰ
    var formMsg = h('p', { class: 'lp-form-msg', role: 'status', 'aria-live': 'polite' });
    var submitText = txt('form.submit', L.submit);
    var submitBtn = mark(h('button', { type: 'submit', class: 'lp-submit', text: submitText }), 'form.submit', 'Nút gửi đăng ký', 'button', { required: true, def: L.submit });
    var form = h('form', { class: 'lp-form', novalidate: true }, [
      field('name', txt('form.label.name', 'Họ và tên'), 'text', 'Nguyễn Văn A'),
      field('phone', txt('form.label.phone', 'Số điện thoại'), 'tel', '0912345678'),
      field('email', txt('form.label.email', 'Email'), 'email', 'ten@gmail.com'),
      h('label', { class: 'lp-consent' }, [
        h('input', { type: 'checkbox', name: 'consent' }),
        TX('span', {}, 'form.consent', 'Dòng đồng ý', ' Tôi đồng ý để ban tổ chức dùng thông tin này để liên hệ xác nhận tham dự.', { multiline: true })
      ]),
      h('p', { class: 'lp-error', 'data-error-for': 'consent' }),
      submitBtn, formMsg
    ]);
    [['name', 'Họ và tên'], ['phone', 'Số điện thoại'], ['email', 'Email']].forEach(function (f) {
      mark(form.querySelector('label[for="lp-' + f[0] + '"]'), 'form.label.' + f[0], 'Nhãn ô ' + f[1], 'text', { def: f[1] });
    });
    mark(form, 'form', 'Khung form đăng ký', 'box', { required: true });
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
      TX('h2', {}, 'register.title', 'Tiêu đề phần đăng ký', L.register), form, formClosed
    ]);

    // CHÂN TRANG: ghi nguồn studio (thiệp cưới) + đường dẫn "Tạo trang như thế này" (phễu lan truyền)
    var footerChildren = [TX('p', {}, 'footer.info', 'Dòng chân trang', ev.name + ' · ' + ev.location)];
    if (ev.studioName) {
      footerChildren.push(h('p', { class: 'lp-credit' }, [
        'Ảnh cưới: ', h('strong', { text: ev.studioName }),
        isSafeUrl(ev.studioUrl) ? h('a', { class: 'lp-credit-cta', href: ev.studioUrl, target: '_blank', rel: 'noopener', 'data-funnel': 'studio', text: 'Đặt lịch chụp' }) : null
      ]));
    }
    if (opts.appUrl) {
      footerChildren.push(h('a', { class: 'lp-made-with', href: opts.appUrl, target: '_blank', rel: 'noopener', 'data-funnel': 'app', text: 'Tạo trang như thế này miễn phí bằng Xclipse →' }));
    }
    var footer = mark(h('footer', { class: 'lp-footer' }, footerChildren), 'footer', 'Chân trang', 'box', { required: true });

    var byKey = { countdown: countdownSection, about: about, benefits: benefits, speakers: speakers, gallery: gallery, agenda: agenda, offer: offer, register: register };
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
        submitBtn.textContent = status.waitlist ? 'Vào danh sách chờ' : submitText;
      }
    }

    // Hiệu ứng: chỉ ở trang xem (không làm phiền khi đang soạn)
    var lastCount = null;
    function retrigger(el, cls) {
      el.classList.remove(cls);
      void el.offsetWidth; // ép trình duyệt chạy lại animation
      el.classList.add(cls);
    }
    if (!editable && st.motion !== 'off') {
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
