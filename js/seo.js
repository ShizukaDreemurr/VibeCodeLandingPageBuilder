/*
 * seo.js — SEO cho (1) trang công khai ?e=<mã>, (2) file HTML xuất ra, (3) ô "SEO & chia sẻ" trong trình soạn.
 *
 * LƯU Ý: bot không chạy JavaScript (một số công cụ chia sẻ, crawler đơn giản) sẽ KHÔNG thấy
 * thẻ meta / JSON-LD mà applyHead() chèn lúc chạy ở trang ?e=<mã>. Bản "Tải file HTML" thì chứa
 * toàn bộ thẻ này viết sẵn trong file (headHtml()), nên bot nào cũng đọc được.
 */
(function (root) {
  root.EP = root.EP || {};

  var TITLE_MIN = 30, TITLE_MAX = 60;
  var DESC_MIN = 70, DESC_GOOD_MIN = 150, DESC_MAX = 160;
  var SITE_NAME = 'Xclipse';
  var ONLINE_RE = /zoom|google\s*meet|meet\.google|teams|webinar|online|tr[ựu]c\s*tuy[eế]n|livestream|youtube|facebook\s*live/i;
  var OFFLINE_HINT_RE = /\d|đường|duong|phố|pho|quận|quan|tp\.?|thành phố|hotel|khách sạn|trung tâm|tòa|toà|phòng/i;

  function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function cut(s, max) {
    s = clean(s);
    if (s.length <= max) return s;
    var c = s.slice(0, max - 1);
    var sp = c.lastIndexOf(' ');
    if (sp > max * 0.6) c = c.slice(0, sp);
    return c.replace(/[\s,.;:–-]+$/, '') + '…';
  }

  function shortDate(startAt) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(startAt || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }
  // 'YYYY-MM-DDTHH:mm' (giờ Việt Nam) → ISO có múi giờ +07:00
  function isoStart(startAt) {
    var m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?/.exec(startAt || '');
    if (m) return m[1] + 'T' + m[2] + ':' + (m[3] || '00') + '+07:00';
    var d = new Date(startAt);
    return isNaN(d) ? '' : d.toISOString();
  }
  function shortPlace(loc) {
    var first = clean(loc).split(/[,–-]/)[0];
    return cut(first, 24);
  }

  // Giá trị mặc định: "Tên sự kiện – 12/11/2026, Địa điểm" (rút dần cho vừa 60 ký tự)
  function defaults(ev, content) {
    ev = ev || {}; content = content || {};
    var name = clean(ev.name) || 'Sự kiện';
    var date = shortDate(ev.startAt), place = shortPlace(ev.location);
    var title = name;
    [date && place ? date + ', ' + place : '', date].forEach(function (tail) {
      if (!tail) return;
      var t = name + ' – ' + tail;
      if (title === name && t.length <= TITLE_MAX) title = t;
    });
    if (title === name && date) title = name + ' – ' + date;
    var desc = cut(content.description || ev.name || '', DESC_MAX);
    return { title: title, description: desc };
  }

  // Giá trị đang dùng = chỉnh tay (ev.seo) nếu có, không thì mặc định
  function resolve(ev, content) {
    var d = defaults(ev, content), s = (ev && ev.seo) || {};
    return { title: clean(s.title) || d.title, description: clean(s.description) || d.description };
  }

  // Đếm ký tự + mức: ok | warn | bad
  function counters(text, kind) {
    var n = clean(text).length;
    var max = kind === 'title' ? TITLE_MAX : DESC_MAX;
    var level;
    if (kind === 'title') level = n < TITLE_MIN || n > TITLE_MAX ? 'bad' : 'ok';
    else level = n < DESC_MIN || n > DESC_MAX ? 'bad' : n < DESC_GOOD_MIN ? 'warn' : 'ok';
    return { len: n, max: max, level: level, label: n + '/' + max + ' ký tự' };
  }

  function isHttp(u) { return /^https?:\/\/\S+$/i.test(u || ''); }
  function abs(u, base) { try { return new URL(u, base || root.location.href).href; } catch (e) { return ''; } }

  // Ảnh chia sẻ: ảnh bìa dạng link http(s); không có thì ảnh thu nhỏ của mẫu (không bao giờ dùng dataURL)
  function imageFor(ev, tpl, base) {
    var hero = ev && ev.images && ev.images.hero;
    if (isHttp(hero)) return hero;
    if (tpl && tpl.hero) return abs(String(tpl.hero).replace(/\.svg$/, '-thumb.jpg'), base);
    return abs('assets/og-image.jpg', base);
  }
  function hasShareImage(ev, tpl) { return !!(ev && ev.images && ev.images.hero) || !!(tpl && tpl.hero); }

  function attendance(loc) {
    var l = clean(loc);
    if (!l) return 'OfflineEventAttendanceMode';
    var online = ONLINE_RE.test(l);
    if (online && OFFLINE_HINT_RE.test(l.replace(ONLINE_RE, '')) && /\+|&|và|hybrid|kết hợp|vừa/i.test(l)) return 'MixedEventAttendanceMode';
    return online ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode';
  }

  // opts: { url, image, count, faq:[{q,a}] }
  function eventJsonLd(ev, content, opts) {
    opts = opts || {}; content = content || {};
    var seo = resolve(ev, content);
    var mode = attendance(ev.location);
    var url = opts.url || '';
    var brand = ev.brand && ev.brand.name ? clean(ev.brand.name) : '';
    var o = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: clean(ev.name),
      startDate: isoStart(ev.startAt),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/' + mode,
      description: seo.description,
      inLanguage: 'vi'
    };
    var loc = clean(ev.location);
    if (mode === 'OnlineEventAttendanceMode') {
      o.location = { '@type': 'VirtualLocation', url: (loc.match(/https?:\/\/\S+/) || [url])[0] || url, name: loc };
    } else if (mode === 'MixedEventAttendanceMode') {
      o.location = [{ '@type': 'Place', name: loc, address: loc }, { '@type': 'VirtualLocation', url: (loc.match(/https?:\/\/\S+/) || [url])[0] || url }];
    } else {
      o.location = { '@type': 'Place', name: loc || 'Đang cập nhật', address: { '@type': 'PostalAddress', streetAddress: loc, addressCountry: 'VN' } };
    }
    if (opts.image) o.image = [opts.image];
    var org = { '@type': 'Organization', name: brand || 'Ban tổ chức' };
    if (ev.brand && isHttp(ev.brand.website)) org.url = ev.brand.website;
    o.organizer = org;
    var sp = (ev.speakers || []).filter(function (s) { return s && clean(s.name); });
    if (sp.length) o.performer = sp.map(function (s) { var p = { '@type': 'Person', name: clean(s.name) }; if (clean(s.title)) p.jobTitle = clean(s.title); return p; });
    var cap = Number(ev.capacity) || 0, soldOut = cap > 0 && opts.count != null && Number(opts.count) >= cap;
    o.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
      availability: 'https://schema.org/' + (soldOut ? 'SoldOut' : 'InStock'),
      url: url,
      validFrom: new Date().toISOString().slice(0, 10)
    };
    if (opts.validFrom) o.offers.validFrom = opts.validFrom;
    if (!url) delete o.offers.url;
    return o;
  }

  function faqJsonLd(pairs) {
    pairs = (pairs || []).filter(function (p) { return p && clean(p.q) && clean(p.a); });
    if (!pairs.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map(function (p) { return { '@type': 'Question', name: clean(p.q), acceptedAnswer: { '@type': 'Answer', text: clean(p.a) } }; })
    };
  }

  // Lấy câu hỏi/đáp đang hiện trong khối FAQ của trang đã dựng
  function faqFromDom(container) {
    var out = [];
    if (!container) return out;
    container.querySelectorAll('.lp-block-faq details').forEach(function (d) {
      var q = d.querySelector('summary'), a = d.querySelector('p');
      if (q && a) out.push({ q: q.textContent, a: a.textContent });
    });
    return out;
  }

  function jsonScript(obj) { return JSON.stringify(obj).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, ''); }

  // meta: { title, description, url, image, robots, jsonld: [obj,...] }
  function metaList(meta) {
    var l = [
      ['name', 'description', meta.description],
      ['name', 'robots', meta.robots || 'index,follow'],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', meta.siteName || SITE_NAME],
      ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description],
      ['property', 'og:locale', 'vi_VN'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', meta.title],
      ['name', 'twitter:description', meta.description]
    ];
    if (meta.url) l.push(['property', 'og:url', meta.url]);
    if (meta.image) { l.push(['property', 'og:image', meta.image]); l.push(['name', 'twitter:image', meta.image]); }
    return l;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  // Chuỗi HTML các thẻ <head> (dùng cho file xuất)
  function headHtml(meta) {
    var s = '<title>' + esc(meta.title) + '</title>\n';
    metaList(meta).forEach(function (m) { s += '<meta ' + m[0] + '="' + m[1] + '" content="' + esc(m[2]) + '">\n'; });
    if (meta.url) s += '<link rel="canonical" href="' + esc(meta.url) + '">\n';
    s += '<meta name="theme-color" content="' + esc(meta.themeColor || '#131416') + '">\n';
    (meta.jsonld || []).forEach(function (o) { if (o) s += '<script type="application/ld+json">' + jsonScript(o) + '<\/script>\n'; });
    return s;
  }

  // Cập nhật <head> của trang đang mở (trang công khai ?e=<mã>)
  function applyHead(meta, doc) {
    doc = doc || document;
    var head = doc.head;
    function upsert(sel, make) { var el = head.querySelector(sel); if (!el) { el = make(); head.appendChild(el); } return el; }
    doc.title = meta.title;
    metaList(meta).forEach(function (m) {
      var el = upsert('meta[' + m[0] + '="' + m[1] + '"]', function () { var x = doc.createElement('meta'); x.setAttribute(m[0], m[1]); return x; });
      el.setAttribute('content', m[2]);
    });
    if (meta.url) {
      upsert('link[rel="canonical"]', function () { var x = doc.createElement('link'); x.rel = 'canonical'; return x; }).setAttribute('href', meta.url);
    }
    if (meta.themeColor) upsert('meta[name="theme-color"]', function () { var x = doc.createElement('meta'); x.name = 'theme-color'; return x; }).setAttribute('content', meta.themeColor);
    head.querySelectorAll('script[data-xc-jsonld]').forEach(function (x) { x.remove(); });
    (meta.jsonld || []).forEach(function (o) {
      if (!o) return;
      var sc = doc.createElement('script');
      sc.type = 'application/ld+json';
      sc.setAttribute('data-xc-jsonld', '');
      sc.textContent = jsonScript(o);
      head.appendChild(sc);
    });
  }

  root.EP.seo = {
    TITLE_MAX: TITLE_MAX, DESC_MAX: DESC_MAX,
    defaults: defaults, resolve: resolve, counters: counters, shortDate: shortDate, isoStart: isoStart,
    imageFor: imageFor, hasShareImage: hasShareImage, attendance: attendance,
    eventJsonLd: eventJsonLd, faqJsonLd: faqJsonLd, faqFromDom: faqFromDom,
    headHtml: headHtml, applyHead: applyHead
  };
})(typeof window !== 'undefined' ? window : this);
