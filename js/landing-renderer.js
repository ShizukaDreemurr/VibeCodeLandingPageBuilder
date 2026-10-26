/*
 * landing-renderer.js — dựng landing page từ dữ liệu sự kiện + nội dung.
 * Mọi chữ người dùng nhập đều đi qua textContent (không chèn HTML) để tránh lỗi bảo mật.
 */
(function (root) {
  var ES = root.EP.eventStatus;

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

  function field(name, label, type, placeholder) {
    return h('div', { class: 'lp-field' }, [
      h('label', { for: 'lp-' + name, text: label }),
      h('input', { id: 'lp-' + name, name: name, type: type, placeholder: placeholder, autocomplete: 'on' }),
      h('p', { class: 'lp-error', 'data-error-for': name, 'aria-live': 'polite' })
    ]);
  }

  /*
   * opts: { event, content, getCount(), onRegister(formData) → result, now() }
   * Trả về { update() } để cập nhật đếm ngược, số đăng ký, trạng thái mà không vẽ lại cả trang.
   */
  function render(container, opts) {
    var ev = opts.event;
    var content = opts.content;
    container.innerHTML = '';

    var statusBadge = h('span', { class: 'lp-badge' });
    var countText = h('strong', { class: 'lp-count' });
    var cdBoxes = {};
    var countdownEl = h('div', { class: 'lp-countdown', role: 'timer' },
      ['days', 'hours', 'minutes', 'seconds'].map(function (unit, i) {
        cdBoxes[unit] = h('span', { class: 'lp-cd-num', text: '00' });
        return h('div', { class: 'lp-cd-box' }, [cdBoxes[unit], h('span', { class: 'lp-cd-label', text: ['ngày', 'giờ', 'phút', 'giây'][i] })]);
      }));
    var endedEl = h('p', { class: 'lp-ended', text: 'Sự kiện đã diễn ra', hidden: true });

    // HERO
    var hero = h('section', { class: 'lp-hero' }, [
      statusBadge,
      h('p', { class: 'lp-eyebrow', text: ev.name }),
      h('h1', { class: 'lp-headline', text: content.headline }),
      h('p', { class: 'lp-meta' }, [h('span', { text: '🗓 ' + fmtDate(ev.startAt) }), h('span', { text: '📍 ' + ev.location })]),
      h('a', { class: 'lp-cta', href: '#lp-register', text: 'Đăng ký tham gia' })
    ]);

    // ĐẾM NGƯỢC + SỐ ĐĂNG KÝ
    var countdownSection = h('section', { class: 'lp-section lp-countdown-section' }, [
      h('h2', { text: 'Đếm ngược đến giờ G' }), countdownEl, endedEl,
      h('p', { class: 'lp-social-proof' }, [countText, ' người đã đăng ký'])
    ]);

    var about = h('section', { class: 'lp-section' }, [h('h2', { text: 'Giới thiệu' }), h('p', { text: content.description })]);

    var benefits = h('section', { class: 'lp-section' }, [
      h('h2', { text: 'Bạn nhận được gì khi tham dự?' }),
      h('ul', { class: 'lp-benefits' }, content.benefits.map(function (b) { return h('li', { text: b }); }))
    ]);

    var speakers = h('section', { class: 'lp-section' }, [
      h('h2', { text: 'Diễn giả' }),
      h('div', { class: 'lp-speakers' }, ev.speakers.map(function (s) {
        return h('div', { class: 'lp-speaker' }, [
          h('div', { class: 'lp-avatar', 'aria-hidden': 'true', text: s.name.trim().split(/\s+/).pop().charAt(0).toUpperCase() }),
          h('strong', { text: s.name }), s.title ? h('span', { text: s.title }) : null
        ]);
      }))
    ]);

    var agenda = ev.agenda && ev.agenda.length ? h('section', { class: 'lp-section' }, [
      h('h2', { text: 'Chương trình' }),
      h('ol', { class: 'lp-agenda' }, ev.agenda.map(function (a) {
        return h('li', {}, [h('span', { class: 'lp-agenda-time', text: a.time }), h('span', { text: a.title })]);
      }))
    ]) : null;

    var offer = ev.earlyBird ? h('section', { class: 'lp-section lp-offer' }, [
      h('h2', { text: 'Ưu đãi đăng ký sớm' }), h('p', { text: ev.earlyBird }),
      ev.earlyBirdUntil ? h('p', { class: 'lp-offer-until', text: 'Áp dụng đến ' + fmtDate(ev.earlyBirdUntil) }) : null
    ]) : null;

    // FORM ĐĂNG KÝ
    var formMsg = h('p', { class: 'lp-form-msg', role: 'status', 'aria-live': 'polite' });
    var submitBtn = h('button', { type: 'submit', class: 'lp-submit', text: 'Đăng ký tham gia' });
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
      // onRegister có thể trả kết quả ngay hoặc Promise (khi chờ Google Sheet)
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
          : 'Đăng ký thành công! Hẹn gặp bạn tại sự kiện.';
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
      h('h2', { text: 'Đăng ký tham gia' }), form, formClosed
    ]);

    var footer = h('footer', { class: 'lp-footer', text: ev.name + ' · ' + ev.location });

    [hero, countdownSection, about, benefits, speakers, agenda, offer, register, footer]
      .forEach(function (s) { if (s) container.appendChild(s); });

    function update() {
      var now = opts.now();
      var count = opts.getCount();
      var status = ES.getStatus(ev, count, now);
      statusBadge.textContent = status.label;
      statusBadge.className = 'lp-badge is-' + status.code;
      countText.textContent = count.toLocaleString('vi-VN');

      var cd = ES.countdown(ev, now);
      countdownEl.hidden = !cd;
      endedEl.hidden = !!cd;
      if (cd) Object.keys(cd).forEach(function (u) { cdBoxes[u].textContent = pad(cd[u]); });

      if (offer) offer.hidden = !ES.isEarlyBirdActive(ev, now);
      form.hidden = !status.canRegister;
      formClosed.hidden = status.canRegister;
      submitBtn.textContent = status.waitlist ? 'Vào danh sách chờ' : 'Đăng ký tham gia';
    }

    update();
    return { update: update };
  }

  root.EP = root.EP || {};
  root.EP.landingRenderer = { render: render, h: h };
})(typeof window !== 'undefined' ? window : globalThis);
