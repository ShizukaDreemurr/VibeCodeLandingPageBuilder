/*
 * brands.js — Brand DNA: bộ nhận diện thương hiệu dùng lại cho nhiều landing page.
 * Một thương hiệu gồm: tên, khẩu hiệu, logo, màu, font, kiểu nút, bo góc, giọng văn
 * (từ nên dùng / nên tránh, khách hàng mục tiêu), chữ nút mặc định và thông tin liên hệ.
 * Lưu trong trình duyệt (ep_brands). Khi áp dụng, một bản sao gọn (event.brand) được gắn
 * vào sự kiện để trang đã xuất bản vẫn hiển thị đúng dù thương hiệu sau này bị sửa/xoá.
 */
(function (root) {
  var S = root.EP.storage;
  var KEY = 'brands';
  var FIELDS = ['name', 'tagline', 'logo', 'primary', 'accent', 'textColor', 'bgColor', 'headingFont', 'bodyFont',
    'button', 'radius', 'tone', 'voiceUse', 'voiceAvoid', 'audience', 'ctaText', 'hotline', 'website', 'fanpage'];

  function all() { return S.read(KEY, {}); }
  function list() {
    var a = all();
    return Object.keys(a).map(function (k) { return a[k]; })
      .sort(function (x, y) { return String(y.updatedAt || '').localeCompare(String(x.updatedAt || '')); });
  }
  function get(id) { return id ? all()[id] || null : null; }
  function blank() {
    return { id: S.newId('brand'), name: '', tagline: '', logo: '', primary: '', accent: '', textColor: '', bgColor: '',
      headingFont: '', bodyFont: '', button: '', radius: '', tone: 'formal', voiceUse: '', voiceAvoid: '', audience: '',
      ctaText: '', hotline: '', website: '', fanpage: '' };
  }
  function save(b) {
    var a = all();
    var clean = { id: b.id };
    FIELDS.forEach(function (f) { clean[f] = typeof b[f] === 'string' ? b[f].slice(0, f === 'logo' ? 130000 : 300) : (b[f] || ''); });
    clean.updatedAt = new Date().toISOString();
    a[b.id] = clean;
    return S.write(KEY, a) ? clean : null;
  }
  function remove(id) { var a = all(); delete a[id]; S.write(KEY, a); }

  function cleanPhone(v) { return String(v || '').replace(/[^\d+]/g, '').slice(0, 15); }
  function safeUrl(v) {
    v = String(v || '').trim();
    if (!v) return '';
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    return /^https?:\/\/[^\s"'<>]+\.[^\s"'<>]+$/i.test(v) ? v : '';
  }
  // Bản sao gọn gắn vào sự kiện (được xuất bản cùng trang)
  function snapshot(b) {
    return {
      id: b.id, name: b.name, tagline: b.tagline, logo: b.logo,
      hotline: cleanPhone(b.hotline), website: safeUrl(b.website), fanpage: safeUrl(b.fanpage),
      tone: b.tone, voiceUse: b.voiceUse, voiceAvoid: b.voiceAvoid, audience: b.audience
    };
  }

  // Áp Brand DNA vào sự kiện: giao diện (màu, font, nút, bo góc), chữ nút chính và thông tin thương hiệu.
  // Không đụng tới nội dung đã viết, bố cục và các chỉnh sửa riêng từng phần tử.
  function applyTo(ev, b) {
    var PS = root.EP.pageStyle;
    var st = Object.assign({}, ev.style || {});
    if (b.primary) { st.primary = b.primary; st.freeColors = true; }
    if (b.accent) st.accent = b.accent;
    if (b.textColor) st.textColor = b.textColor;
    if (b.bgColor) st.bgColor = b.bgColor;
    function font(keyF, keyC, name) {
      if (!name) return;
      var k = PS.keyForFamily(name);
      if (k) { st[keyF] = k; st[keyC] = ''; } else { st[keyF] = keyF === 'bodyFont' ? 'be-vietnam' : ''; st[keyC] = name; }
    }
    font('headingFont', 'headingFontCustom', b.headingFont);
    font('bodyFont', 'bodyFontCustom', b.bodyFont);
    if (b.button) { st.button = b.button; delete st.btnRadiusPx; }
    if (b.radius) { st.radius = b.radius; delete st.radiusPx; }
    ev.style = st;
    if (b.ctaText) { ev.texts = Object.assign({}, ev.texts || {}); ev.texts['hero.cta'] = b.ctaText; }
    ev.brandId = b.id;
    ev.brand = snapshot(b);
    return ev;
  }

  root.EP = root.EP || {};
  root.EP.brands = { list: list, get: get, blank: blank, save: save, remove: remove, applyTo: applyTo, snapshot: snapshot, safeUrl: safeUrl, cleanPhone: cleanPhone };
})(typeof window !== 'undefined' ? window : globalThis);
