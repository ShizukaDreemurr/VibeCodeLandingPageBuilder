/* page-style.js — tuỳ chỉnh giao diện "trong khuôn khổ":
   mọi lựa chọn là giá trị có sẵn hoặc màu đã được kiểm tra tương phản, nên trang luôn dễ đọc và chuẩn mobile. */
(function (root) {
  var FONTS = {
    'be-vietnam': { label: 'Be Vietnam Pro', css: "'Be Vietnam Pro', system-ui, sans-serif" },
    montserrat: { label: 'Montserrat', css: "'Montserrat', system-ui, sans-serif" },
    nunito: { label: 'Nunito (tròn, thân thiện)', css: "'Nunito', system-ui, sans-serif" },
    playfair: { label: 'Playfair Display (sang trọng)', css: "'Playfair Display', Georgia, serif" },
    lora: { label: 'Lora (cổ điển)', css: "'Lora', Georgia, serif" }
  };

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

  // Các lựa chọn của bảng điều khiển: [giá trị, nhãn]
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
    bullet: [['check', '✓'], ['star', '★'], ['arrow', '→'], ['dot', '●']],
    motion: [['full', 'Đầy đủ'], ['subtle', 'Nhẹ'], ['off', 'Tắt']],
    sectionBg: [['auto', 'Mặc định'], ['plain', 'Trắng'], ['tint', 'Nhạt'], ['primary', 'Màu chính']],
    sectionAlign: [['auto', 'Mặc định'], ['left', 'Trái'], ['center', 'Giữa']]
  };

  var DEFAULTS = {
    primary: '', accent: '', headingFont: '', bodyFont: 'be-vietnam', pageBg: 'white', headingSize: 'm',
    radius: 'soft', button: 'solid', shadow: 'none', heroAlign: '', heroHeight: 'normal', heroOverlay: 62,
    spacing: 'normal', countdown: 'boxes', bullet: 'check', motion: 'full', ctaText: '', sections: {}
  };

  function hexToRgb(hex) {
    var str = String(hex || '').trim().replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '#$1$1$2$2$3$3');
    var m = /^#?([0-9a-f]{6})$/i.exec(str);
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function toHex(rgb) { return '#' + rgb.map(function (v) { return ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2); }).join(''); }
  function luminance(hex) {
    var rgb = hexToRgb(hex) || [0, 0, 0];
    var c = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // Chữ trên nền màu: chọn trắng hoặc gần đen, cái nào tương phản hơn
  function textOn(hex) { return contrast(hex, '#ffffff') >= contrast(hex, '#16193a') ? '#ffffff' : '#16193a'; }
  // Làm đậm dần cho tới khi chữ trắng đọc được (≥ 4.5:1)
  function ensureDark(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return null;
    var out = hex, k = 0;
    while (contrast(out, '#ffffff') < 4.5 && k < 40) { rgb = rgb.map(function (v) { return v * 0.92; }); out = toHex(rgb); k++; }
    return out;
  }
  function mix(hex, other, t) {
    var a = hexToRgb(hex), b = hexToRgb(other);
    if (!a || !b) return hex;
    return toHex(a.map(function (v, i) { return v + (b[i] - v) * t; }));
  }

  function normalize(style) {
    var s = {};
    Object.keys(DEFAULTS).forEach(function (k) { s[k] = style && style[k] != null ? style[k] : DEFAULTS[k]; });
    s.sections = (style && style.sections) || {};
    if (s.primary && !hexToRgb(s.primary)) s.primary = '';
    if (s.accent && !hexToRgb(s.accent)) s.accent = '';
    s.heroOverlay = Math.max(30, Math.min(85, Number(s.heroOverlay) || 62));
    return s;
  }

  // Áp vào khung landing: biến CSS + class. theme = theme gốc của template.
  function apply(container, theme, style) {
    var s = normalize(style);
    var primary = s.primary ? ensureDark(s.primary) : theme.primary;
    var accent = s.accent || theme.accent;
    var vars = {
      '--lp-primary': primary,
      '--lp-accent': accent,
      '--lp-accent-contrast': textOn(accent),
      '--lp-surface': s.primary ? mix(primary, '#ffffff', 0.92) : theme.surface,
      '--lp-hero-overlay': (s.heroOverlay / 100).toFixed(2),
      '--lp-body-font': FONTS[s.bodyFont] ? FONTS[s.bodyFont].css : 'inherit'
    };
    if (s.headingFont && FONTS[s.headingFont]) vars['--lp-heading-font'] = FONTS[s.headingFont].css;
    if (s.pageBg === 'cream') vars['--lp-bg'] = '#fbf7ef';
    else if (s.pageBg === 'tint') vars['--lp-bg'] = mix(primary, '#ffffff', 0.96);
    else if (s.pageBg === 'white') vars['--lp-bg'] = '#ffffff';
    Object.keys(vars).forEach(function (k) { container.style.setProperty(k, vars[k]); });
    ['headingSize', 'radius', 'button', 'shadow', 'heroHeight', 'spacing', 'countdown', 'bullet', 'motion'].forEach(function (k) {
      container.classList.add('st-' + k + '-' + s[k]);
    });
    if (s.heroAlign) container.classList.add('st-heroAlign-' + s.heroAlign);
    return s;
  }

  root.EP = root.EP || {};
  root.EP.pageStyle = {
    FONTS: FONTS, PALETTES: PALETTES, OPTIONS: OPTIONS, DEFAULTS: DEFAULTS,
    normalize: normalize, apply: apply, contrast: contrast, textOn: textOn, ensureDark: ensureDark
  };
})(typeof window !== 'undefined' ? window : globalThis);
