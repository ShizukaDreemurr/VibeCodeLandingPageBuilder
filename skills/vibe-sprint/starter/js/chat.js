/* chat.js - giao diện chatbot: bong bóng, đang gõ..., gợi ý nhanh (quick reply), nút hành động (chuyển sang form khi bot không biết).
     var chat = EP.chat.mount(el, {
       title: 'Trợ lý đặt món', greeting: 'Xin chào! Mình giúp gì được cho bạn?',
       quick: ['Giá bao nhiêu?', 'Giờ mở cửa'],
       reply: function (text, ctx) { return { text: '...', quick: [...], action: { label: 'Để lại thông tin', onClick: fn } }; },   // đồng bộ hoặc Promise
       delay: 500
     });
     chat.say('Bot nói'), chat.user('Người dùng nói'), chat.clear()
   Bộ trả lời dựng sẵn từ FAQ (khớp từ khoá không dấu):
     reply: EP.chat.faqReply(entries, { fallback: 'Mình chưa rõ ý bạn.', action: { label: 'Để lại số điện thoại', onClick: fn }, quick: [...] }) */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  function faqReply(entries, o) {
    o = o || {};
    return function (text) {
      var m = EP.match.faq(entries, text, { threshold: o.threshold });
      if (m) return { text: m.entry.a, quick: m.entry.quick || o.quick };
      return { text: o.fallback || 'Mình chưa rõ ý bạn. Bạn có thể diễn đạt lại hoặc để lại thông tin để nhân viên hỗ trợ nhé.', quick: o.quick, action: o.action, unknown: true };
    };
  }

  function mount(el, o) {
    el.innerHTML = '<div class="card pad-0 flat chat"><div class="chat-log" role="log" aria-live="polite" aria-label="' + esc(o.title || 'Cuộc trò chuyện') + '"></div><div class="chat-quick"></div>' +
      '<form class="chat-form" novalidate><label class="sr-only" for="chat-in-' + el.id + '">Tin nhắn</label><input class="input" id="chat-in-' + el.id + '" autocomplete="off" placeholder="Nhập câu hỏi của bạn..." maxlength="300"><button class="btn btn-primary" type="submit" aria-label="Gửi">' + EP.ui.icon('send') + '<span class="hide-sm">Gửi</span></button></form></div>';
    var log = el.querySelector('.chat-log'), quick = el.querySelector('.chat-quick'), form = el.querySelector('form'), input = form.querySelector('input'), busy = false;
    function bubble(kind, text) {
      var b = document.createElement('div'); b.className = 'bubble ' + kind; b.textContent = text; log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
    }
    function setQuick(list) {
      quick.innerHTML = (list || []).map(function (q) { return '<button type="button" class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('');
    }
    function action(a) {
      if (!a) return;
      var wrap = document.createElement('div'); wrap.className = 'bubble bot'; wrap.innerHTML = '<button type="button" class="btn btn-sm btn-primary">' + esc(a.label) + '</button>';
      wrap.querySelector('button').addEventListener('click', function () { a.onClick({ say: say }); });
      log.appendChild(wrap); log.scrollTop = log.scrollHeight;
    }
    function say(text, ex) { bubble('bot', text); if (ex) { setQuick(ex.quick); action(ex.action); } }
    function send(text) {
      text = String(text || '').trim(); if (!text || busy) return;
      busy = true; bubble('user', text); setQuick([]);
      var t = document.createElement('div'); t.className = 'bubble bot typing'; t.setAttribute('aria-label', 'Bot đang trả lời'); t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); log.scrollTop = log.scrollHeight;
      Promise.all([Promise.resolve().then(function () { return o.reply(text, { say: say }); }), EP.sleep(o.delay == null ? 450 : o.delay)]).then(function (r) {
        t.remove(); var res = r[0] || { text: '...' }; say(res.text, res);
      }, function () { t.remove(); say('Xin lỗi, có lỗi xảy ra. Bạn thử lại nhé.'); }).then(function () { busy = false; });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; send(v); });
    quick.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) send(b.getAttribute('data-q')); });
    say(o.greeting || 'Xin chào! Mình có thể giúp gì cho bạn?', { quick: o.quick });
    return { say: say, user: function (t) { bubble('user', t); }, send: send, clear: function () { log.innerHTML = ''; setQuick([]); } };
  }
  EP.chat = { mount: mount, faqReply: faqReply };
})(window);
