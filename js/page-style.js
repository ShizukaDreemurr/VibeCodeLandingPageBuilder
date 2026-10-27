/* page-style.js — tuỳ chỉnh giao diện landing page.
   - Chế độ Đơn giản: lựa chọn có sẵn, màu chính tự làm đậm để chữ trắng luôn đọc được.
   - Chế độ Studio: chỉnh gần như mọi thông số (màu tự do, cỡ chữ, độ đậm, giãn chữ, khoảng cách…),
     tương phản chỉ cảnh báo chứ không ép. Mọi giá trị đều được kẹp trong giới hạn an toàn nên trang không vỡ. */
(function (root) {
  // google: tên family trên Google Fonts (đều có bộ chữ tiếng Việt)
  var FONTS = {
    'be-vietnam': { label: 'Be Vietnam Pro', google: 'Be Vietnam Pro', fallback: 'sans-serif' },
    inter: { label: 'Inter', google: 'Inter', fallback: 'sans-serif' },
    roboto: { label: 'Roboto', google: 'Roboto', fallback: 'sans-serif' },
    'open-sans': { label: 'Open Sans', google: 'Open Sans', fallback: 'sans-serif' },
    montserrat: { label: 'Montserrat', google: 'Montserrat', fallback: 'sans-serif' },
    nunito: { label: 'Nunito (tròn, thân thiện)', google: 'Nunito', fallback: 'sans-serif' },
    quicksand: { label: 'Quicksand (mềm mại)', google: 'Quicksand', fallback: 'sans-serif' },
    lexend: { label: 'Lexend (dễ đọc)', google: 'Lexend', fallback: 'sans-serif' },
    oswald: { label: 'Oswald (cao, mạnh)', google: 'Oswald', fallback: 'sans-serif' },
    playfair: { label: 'Playfair Display (sang trọng)', google: 'Playfair Display', fallback: 'serif' },
    lora: { label: 'Lora (cổ điển)', google: 'Lora', fallback: 'serif' },
    merriweather: { label: 'Merriweather', google: 'Merriweather', fallback: 'serif' },
    'noto-serif': { label: 'Noto Serif', google: 'Noto Serif', fallback: 'serif' },
    cormorant: { label: 'Cormorant Garamond (thanh lịch)', google: 'Cormorant Garamond', fallback: 'serif' },
    dancing: { label: 'Dancing Script (viết tay)', google: 'Dancing Script', fallback: 'cursive' },
    'great-vibes': { label: 'Great Vibes (thư pháp)', google: 'Great Vibes', fallback: 'cursive' }
  };
  var SIMPLE_FONTS = ['be-vietnam', 'montserrat', 'nunito', 'playfair', 'lora'];

  // Bảng màu gợi ý: màu chính luôn đủ tương phản với chữ trắng (≥ 4.5:1)
  var PALETTES = [
    { name: 'Navy – Hồng', primary: '#1e2a78', accent: '#e5396e' },
    { name: 'Xanh rêu – Vàng', primary: '#1f5c4a', accent: '#f2b632' },
    { name: 'Tím – Cam', primary: '#4b2a85', accent: '#ff8a3d' },
    { name: 'Đen – Chanh', primary: '#1d1f24', accent: '#c6f432' },
    { name: 'Đỏ đô – Kem', primary: '#7a1f2b', accent: '#f4d9a6' },
    { name: 'Xanh biển – Ngọc', primary: '#0b4f8a', accent: '#2ec4b6' },
    { name: 'Nâu – Hồng phấn', primary: '#5b3a29', accent: '#f2a7b5' },
    { name: 'Xám xanh – Đỏ cam', primary: '#2f3e4e', accent: '#ff5a36' }
  ];

  // Lựa chọn dạng nút bấm: [giá trị, nhãn]
  var OPTIONS = {
    pageBg: [['white', 'Trắng'], ['cream', 'Kem'], ['tint', 'Ngả màu chính']],
    headingSize: [['s', 'Nhỏ'], ['m', 'Vừa'], ['l', 'Lớn']],
    radius: [['square', 'Vuông'], ['soft', 'Bo vừa'], ['round', 'Bo tròn']],
    button: [['solid', 'Đặc'], ['outline', 'Viền'], ['pill', 'Viên thuốc']],
    shadow: [['none', 'Phẳng'], ['soft', 'Đổ bóng']],
    heroAlign: [['left', 'Trái'], ['center', 'Giữa']],
    heroHeight: [['compact', 'Gọn'], ['normal', 'Vừa'], ['full', 'Toàn màn hình']],
    spacing: [['compact', 'Gọn'], ['normal', 'Vừa'], ['airy', 'Thoáng']],
    countdown: [['boxes', 'Ô màu'], ['minimal', 'Tối giản']],
    bullet: [['check', 'Dấu tích'], ['star', 'Ngôi sao'], ['arrow', 'Mũi tên'], ['dot', 'Chấm tròn'], ['heart', 'Trái tim'], ['none', 'Không']],
    motion: [['full', 'Đầy đủ'], ['subtle', 'Nhẹ'], ['off', 'Tắt']],
    headingUpper: [['', 'Bình thường'], ['upper', 'VIẾT HOA']],
    sectionBg: [['auto', 'Mặc định'], ['plain', 'Trắng'], ['tint', 'Nhạt'], ['primary', 'Màu chính']],
    sectionAlign: [['auto', 'Mặc định'], ['left', 'Trái'], ['center', 'Giữa']]
  };

  // Thông số Studio dạng thanh trượt: [min, max, bước, đơn vị, nhãn]
  var RANGES = {
    h1Size: [22, 72, 1, 'px', 'Cỡ tiêu đề lớn'],
    h2Size: [16, 44, 1, 'px', 'Cỡ tiêu đề từng phần'],
    bodySize: [13, 21, 1, 'px', 'Cỡ chữ nội dung'],
    lineHeight: [1.2, 2, 0.05, '', 'Giãn dòng'],
    headingWeight: [300, 900, 100, '', 'Độ đậm tiêu đề'],
    letterSpacing: [-0.05, 0.2, 0.01, 'em', 'Giãn chữ tiêu đề'],
    radiusPx: [0, 32, 1, 'px', 'Bo góc khối'],
    btnRadiusPx: [0, 40, 1, 'px', 'Bo góc nút'],
    shadowLevel: [0, 3, 1, '', 'Độ đổ bóng'],
    sectionPad: [12, 120, 4, 'px', 'Khoảng cách trên/dưới mỗi phần'],
    maxWidth: [560, 1280, 20, 'px', 'Độ rộng nội dung tối đa'],
    heroPad: [16, 160, 4, 'px', 'Khoảng đệm phần đầu trang'],
    heroMinH: [0, 100, 5, 'vh', 'Chiều cao tối thiểu phần đầu'],
    heroOverlay: [0, 90, 1, '%', 'Độ tối lớp phủ ảnh bìa']
  };

  // Màu Studio: [khoá, nhãn, gợi ý]
  var COLORS = [
    ['primary', 'Màu chính', 'Nền phần đầu trang, tiêu đề'],
    ['accent', 'Màu nhấn', 'Nút đăng ký, số đếm, biểu tượng'],
    ['textColor', 'Màu chữ nội dung', ''],
    ['mutedColor', 'Màu chữ phụ', 'Chức danh, chú thích'],
    ['bgColor', 'Màu nền trang', ''],
    ['surfaceColor', 'Màu nền khối nhạt', 'Khối lợi ích, phần đếm ngược'],
    ['heroTextColor', 'Màu chữ phần đầu trang', ''],
    ['btnTextColor', 'Màu chữ trên nút', ''],
    ['overlayColor', 'Màu lớp phủ ảnh bìa', '']
  ];

  // Chọn ở chế độ Đơn giản thì xoá thông số Studio tương ứng (để lựa chọn mới có hiệu lực)
  var CHIP_CLEARS = {
    radius: ['radiusPx', 'btnRadiusPx'], button: ['btnRadiusPx'], headingSize: ['h1Size', 'h2Size'],
    spacing: ['sectionPad'], heroHeight: ['heroMinH', 'heroPad'], pageBg: ['bgColor'], shadow: ['shadowLevel']
  };

  var DEFAULTS = {
    primary: '', accent: '', headingFont: '', bodyFont: 'be-vietnam', headingFontCustom: '', bodyFontCustom: '',
    pageBg: 'white', headingSize: 'm', radius: 'soft', button: 'solid', shadow: 'none', heroAlign: '',
    heroHeight: 'normal', heroOverlay: 62, spacing: 'normal', countdown: 'boxes', bullet: 'check', motion: 'full',
    ctaText: '', headingUpper: '', freeColors: false, sections: {}
  };

  // ---------- Màu: nhận mọi cách viết ----------
  var NAMED_FALLBACK = { white: '#ffffff', black: '#000000', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00', orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', gray: '#808080', grey: '#808080', navy: '#000080', teal: '#008080', gold: '#ffd700' };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
    if (!s) return [l * 255, l * 255, l * 255];
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function f(t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  function num(x, scale) { x = String(x).trim(); return x.slice(-1) === '%' ? parseFloat(x) / 100 * scale : parseFloat(x); }
  // Trả về { r, g, b, a } hoặc null. Nhận: #rgb #rgba #rrggbb #rrggbbaa, rgb()/rgba() (dấu phẩy hoặc cách),
  // hsl()/hsla(), "255, 0, 0", "ff0000", tên màu CSS (red, tomato…)
  function parseColor(input) {
    var s = String(input == null ? '' : input).trim().toLowerCase();
    if (!s) return null;
    var m = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
    if (m) {
      var h = m[1];
      if (h.length <= 4) h = h.split('').map(function (c) { return c + c; }).join('');
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
    }
    m = /^(rgba?|hsla?)?\s*\(?\s*([^)]*?)\s*\)?$/.exec(s);
    if (m && /[\d.]/.test(m[2])) {
      var parts = m[2].split(/\s*[,/]\s*|\s+/).filter(Boolean);
      if (parts.length === 3 || parts.length === 4) {
        var a = parts.length === 4 ? num(parts[3], 1) : 1;
        if ((m[1] || '').indexOf('hsl') === 0) {
          var rgb = hslToRgb(parseFloat(parts[0]), num(parts[1], 1) > 1 ? num(parts[1], 1) / 100 : num(parts[1], 1), num(parts[2], 1) > 1 ? num(parts[2], 1) / 100 : num(parts[2], 1));
          return { r: rgb[0], g: rgb[1], b: rgb[2], a: clamp(a, 0, 1) };
        }
        var r = num(parts[0], 255), g = num(parts[1], 255), b = num(parts[2], 255);
        if ([r, g, b].every(function (v) { return !isNaN(v) && v >= 0 && v <= 255; }) && !isNaN(a)) return { r: r, g: g, b: b, a: clamp(a, 0, 1) };
      }
      return null;
    }
    if (/^[a-z]+$/.test(s)) {
      // Tên màu: nhờ trình duyệt dịch (nếu có), không thì dùng bảng nhỏ
      if (root.document && root.CSS && root.CSS.supports && root.CSS.supports('color', s)) {
        var el = root.document.createElement('span');
        el.style.color = s;
        root.document.body.appendChild(el);
        var out = parseColor(root.getComputedStyle(el).color);
        el.remove();
        return out;
      }
      return NAMED_FALLBACK[s] ? parseColor(NAMED_FALLBACK[s]) : null;
    }
    return null;
  }
  function hex2(v) { return ('0' + Math.round(clamp(v, 0, 255)).toString(16)).slice(-2); }
  // Chuẩn hoá để lưu: #rrggbb, hoặc rgba(...) nếu có độ trong suốt
  function formatColor(c) {
    if (!c) return '';
    if (c.a >= 1) return '#' + hex2(c.r) + hex2(c.g) + hex2(c.b);
    return 'rgba(' + Math.round(c.r) + ', ' + Math.round(c.g) + ', ' + Math.round(c.b) + ', ' + Math.round(c.a * 100) / 100 + ')';
  }
  function normalizeColor(input) { return formatColor(parseColor(input)); }
  function solidHex(input) { var c = parseColor(input); return c ? '#' + hex2(c.r) + hex2(c.g) + hex2(c.b) : ''; }

  function luminance(color) {
    var c = parseColor(color) || { r: 0, g: 0, b: 0 };
    var l = [c.r, c.g, c.b].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function textOn(color) { return contrast(color, '#ffffff') >= contrast(color, '#16193a') ? '#ffffff' : '#16193a'; }
  // Làm đậm dần cho tới khi chữ trắng đọc được (≥ 4.5:1)
  function ensureDark(color) {
    var c = parseColor(color);
    if (!c) return null;
    var out = solidHex(color), k = 0;
    while (contrast(out, '#ffffff') < 4.5 && k < 60) { c = { r: c.r * 0.92, g: c.g * 0.92, b: c.b * 0.92, a: 1 }; out = formatColor(c); k++; }
    return out;
  }
  function mix(a, b, t) {
    var x = parseColor(a), y = parseColor(b);
    if (!x || !y) return a;
    return formatColor({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t, a: 1 });
  }

  // ---------- Font: chỉ tải khi dùng ----------
  var loadedFonts = {};
  function fontFamilyName(key, custom) {
    if (custom && /^[A-Za-z0-9 ]{2,40}$/.test(custom.trim())) return { google: custom.trim(), fallback: 'sans-serif' };
    return FONTS[key] || null;
  }
  function loadFont(f) {
    if (!f || !root.document || loadedFonts[f.google]) return;
    loadedFonts[f.google] = true;
    var link = root.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f.google).replace(/%20/g, '+') + ':wght@300;400;500;600;700;800;900&display=swap';
    root.document.head.appendChild(link);
  }
  function fontCss(f) { return f ? "'" + f.google + "', " + f.fallback : ''; }

  function normalize(style) {
    var s = {};
    Object.keys(DEFAULTS).forEach(function (k) { s[k] = style && style[k] != null ? style[k] : DEFAULTS[k]; });
    Object.keys(RANGES).forEach(function (k) {
      if (k === 'heroOverlay') return;
      var v = style ? style[k] : null;
      s[k] = v === '' || v == null || isNaN(Number(v)) ? null : clamp(Number(v), RANGES[k][0], RANGES[k][1]);
    });
    s.heroOverlay = clamp(Number(s.heroOverlay), 0, 90);
    if (isNaN(s.heroOverlay)) s.heroOverlay = 62;
    COLORS.forEach(function (c) { var v = style && style[c[0]]; s[c[0]] = v ? normalizeColor(v) : ''; });
    s.sections = (style && style.sections) || {};
    return s;
  }

  // Áp vào khung landing: biến CSS + class. theme = theme gốc của template.
  function apply(container, theme, style) {
    var s = normalize(style);
    var primary = s.primary ? (s.freeColors ? solidHex(s.primary) : ensureDark(s.primary)) : theme.primary;
    var accent = s.accent || theme.accent;
    var px = function (v, unit) { return v == null ? null : v + (unit || 'px'); };
    var vars = {
      '--lp-primary': primary,
      '--lp-accent': accent,
      '--lp-accent-contrast': s.btnTextColor || textOn(accent),
      '--lp-surface': s.surfaceColor || (s.primary ? mix(primary, '#ffffff', 0.92) : theme.surface),
      '--lp-hero-overlay': (s.heroOverlay / 100).toFixed(2)
    };
    var headF = fontFamilyName(s.headingFont, s.headingFontCustom);
    var bodyF = fontFamilyName(s.bodyFont, s.bodyFontCustom);
    loadFont(headF); loadFont(bodyF);
    if (headF) vars['--lp-heading-font'] = fontCss(headF);
    if (bodyF) vars['--lp-body-font'] = fontCss(bodyF);
    if (s.bgColor) vars['--lp-bg'] = s.bgColor;
    else if (s.pageBg === 'cream') vars['--lp-bg'] = '#fbf7ef';
    else if (s.pageBg === 'tint') vars['--lp-bg'] = mix(primary, '#ffffff', 0.96);
    else if (s.pageBg === 'white') vars['--lp-bg'] = '#ffffff';
    if (s.textColor) vars['--lp-text'] = s.textColor;
    if (s.mutedColor) vars['--lp-muted'] = s.mutedColor;
    if (s.heroTextColor) vars['--lp-hero-text'] = s.heroTextColor;
    if (s.overlayColor) { var oc = parseColor(s.overlayColor); vars['--lp-overlay-rgb'] = Math.round(oc.r) + ', ' + Math.round(oc.g) + ', ' + Math.round(oc.b); }
    // Thông số Studio (để trống = theo lựa chọn Đơn giản)
    var studio = {
      '--lp-h1': s.h1Size == null ? null : 'min(' + s.h1Size + 'px, 10cqi)',
      '--lp-h2': s.h2Size == null ? null : 'min(' + s.h2Size + 'px, 8cqi)',
      '--lp-body': px(s.bodySize),
      '--lp-lh': s.lineHeight == null ? null : String(s.lineHeight),
      '--lp-hw': s.headingWeight == null ? null : String(s.headingWeight),
      '--lp-ls': px(s.letterSpacing, 'em'),
      '--lp-radius': px(s.radiusPx),
      '--lp-btn-radius': px(s.btnRadiusPx),
      '--lp-pad': px(s.sectionPad),
      '--lp-maxw': px(s.maxWidth),
      '--lp-hero-pad': px(s.heroPad),
      '--lp-hero-minh': s.heroMinH == null ? null : (s.heroMinH ? 'min(' + s.heroMinH + 'vh, 900px)' : 'auto'),
      '--lp-shadow': s.shadowLevel == null ? null : ['none', '0 2px 8px rgba(22,25,58,.08)', '0 6px 20px rgba(22,25,58,.12)', '0 14px 40px rgba(22,25,58,.18)'][s.shadowLevel]
    };
    Object.keys(studio).forEach(function (k) { if (studio[k] != null) vars[k] = studio[k]; });
    Object.keys(vars).forEach(function (k) { container.style.setProperty(k, vars[k]); });
    ['headingSize', 'radius', 'button', 'shadow', 'heroHeight', 'spacing', 'countdown', 'bullet', 'motion'].forEach(function (k) {
      container.classList.add('st-' + k + '-' + s[k]);
    });
    if (s.heroAlign) container.classList.add('st-heroAlign-' + s.heroAlign);
    if (s.headingUpper) container.classList.add('st-upper');
    return s;
  }

  // Màu riêng của một phần (Studio)
  function sectionInline(el, sec) {
    if (sec.bgColor) { var c = normalizeColor(sec.bgColor); if (c) { el.style.background = c; el.style.setProperty('--lp-section-bg', c); } }
    if (sec.textColor) { var t = normalizeColor(sec.textColor); if (t) { el.style.color = t; el.classList.add('lp-custom-text'); } }
  }

  root.EP = root.EP || {};
  root.EP.pageStyle = {
    FONTS: FONTS, SIMPLE_FONTS: SIMPLE_FONTS, PALETTES: PALETTES, OPTIONS: OPTIONS, RANGES: RANGES, COLORS: COLORS,
    CHIP_CLEARS: CHIP_CLEARS, DEFAULTS: DEFAULTS,
    normalize: normalize, apply: apply, sectionInline: sectionInline,
    parseColor: parseColor, normalizeColor: normalizeColor, solidHex: solidHex,
    contrast: contrast, textOn: textOn, ensureDark: ensureDark, loadFont: loadFont, fontFamilyName: fontFamilyName
  };
})(typeof window !== 'undefined' ? window : globalThis);
