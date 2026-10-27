/*
 * images.js — chọn ảnh từ máy, tự cắt cho vừa khung và TỰ NÉN cho tới khi vừa dung lượng.
 * - Mỗi loại ảnh có mức trần (max, byte của chuỗi dataURL): hạ chất lượng từng bậc, chưa đủ thì thu nhỏ dần.
 * - Ưu tiên WebP (nhẹ hơn JPEG ~25–35%, giữ được nền trong suốt cho logo); trình duyệt không hỗ trợ thì dùng JPEG/PNG.
 * - shrinkToFit(): khi tổng ảnh của trang vượt giới hạn, nén lại các ảnh nặng nhất cho tới khi vừa.
 * Kết quả là chuỗi dataURL lưu cùng dữ liệu sự kiện.
 */
(function (root) {
  var MAX_INPUT_BYTES = 25 * 1024 * 1024;

  // w, h (null = giữ tỉ lệ), quality: chất lượng khởi đầu, max: trần dung lượng, alpha: giữ nền trong suốt
  var SLOTS = {
    hero: { w: 1600, h: null, quality: 0.82, max: 320000 },
    avatar: { w: 320, h: 320, quality: 0.85, max: 40000 },
    gallery: { w: 1000, h: null, quality: 0.8, max: 150000 },
    logo: { w: 480, h: null, quality: 0.9, max: 60000, alpha: true }
  };
  var MIN_QUALITY = 0.42, MIN_WIDTH = 120;

  // Trình duyệt có xuất được WebP không (Safari cũ thì không)
  var WEBP = (function () {
    try { var c = document.createElement('canvas'); c.width = c.height = 1; return c.toDataURL('image/webp').indexOf('data:image/webp') === 0; } catch (e) { return false; }
  })();

  function pickFile() {
    return new Promise(function (resolve, reject) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/webp';
      input.addEventListener('change', function () {
        var file = input.files && input.files[0];
        if (!file) return reject(new Error('Chưa chọn ảnh.'));
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return reject(new Error('Chỉ nhận ảnh JPG, PNG hoặc WebP.'));
        if (file.size > MAX_INPUT_BYTES) return reject(new Error('Ảnh quá lớn (tối đa 25MB).'));
        resolve(file);
      });
      input.click();
    });
  }

  function loadFrom(src, revoke) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { if (revoke) URL.revokeObjectURL(src); resolve(img); };
      img.onerror = function () { if (revoke) URL.revokeObjectURL(src); reject(new Error('Không đọc được ảnh này.')); };
      img.src = src;
    });
  }
  function loadImage(file) { return loadFrom(URL.createObjectURL(file), true); }

  // Vẽ ảnh vào canvas: cắt giữa (nếu ô có tỉ lệ cố định) và thu về bề rộng tw
  function draw(img, cfg, tw) {
    var sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0, th;
    if (cfg.h) {
      var ratio = cfg.w / cfg.h;
      if (sw / sh > ratio) { var nw = sh * ratio; sx = (sw - nw) / 2; sw = nw; } else { var nh = sw / ratio; sy = (sh - nh) / 2; sh = nh; }
      tw = Math.min(tw, sw);
      th = Math.round(tw / ratio);
    } else {
      tw = Math.min(tw, sw);
      th = Math.round(tw * sh / sw);
    }
    var canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(tw));
    canvas.height = Math.max(1, th);
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (!cfg.alpha) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); } // nền trắng cho ảnh trong suốt
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  function encode(canvas, cfg, q) {
    if (WEBP) return canvas.toDataURL('image/webp', q);
    return cfg.alpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', q);
  }

  // Nén tới khi ≤ max: hạ chất lượng từng bậc 0.08, chạm sàn thì thu nhỏ 85% rồi thử lại
  function compress(img, cfg, max) {
    var width = Math.min(cfg.w, img.naturalWidth);
    var best = null;
    var lossy = WEBP || !cfg.alpha;
    for (var round = 0; round < 12; round++) {
      var canvas = draw(img, cfg, width);
      var q = cfg.quality;
      while (true) {
        var out = encode(canvas, cfg, q);
        if (!best || out.length < best.length) best = out;
        if (out.length <= max) return { data: out, width: canvas.width };
        if (!lossy || q <= MIN_QUALITY) break;
        q = Math.max(MIN_QUALITY, q - 0.08);
      }
      if (width <= MIN_WIDTH) break;
      width = Math.max(MIN_WIDTH, Math.round(width * 0.85));
    }
    return { data: best, width: width };
  }

  // Nén một canvas đã dựng sẵn (từ trình chỉnh ảnh) xuống ≤ max: hạ chất lượng, chưa đủ thì thu nhỏ 85%
  function compressCanvas(canvas, slot, max) {
    var cfg = typeof slot === 'string' ? (SLOTS[slot] || SLOTS.hero) : (slot || SLOTS.hero);
    max = max || cfg.max;
    var lossy = WEBP || !cfg.alpha;
    var cur = canvas, best = null;
    for (var round = 0; round < 12; round++) {
      var q = cfg.quality;
      while (true) {
        var out = encode(cur, cfg, q);
        if (!best || out.length < best.length) best = out;
        if (out.length <= max) return { data: out, width: cur.width, height: cur.height };
        if (!lossy || q <= MIN_QUALITY) break;
        q = Math.max(MIN_QUALITY, q - 0.08);
      }
      if (cur.width <= MIN_WIDTH) break;
      var next = document.createElement('canvas');
      next.width = Math.max(MIN_WIDTH, Math.round(cur.width * 0.85));
      next.height = Math.max(1, Math.round(cur.height * next.width / cur.width));
      var nctx = next.getContext('2d');
      nctx.imageSmoothingQuality = 'high';
      nctx.drawImage(cur, 0, 0, next.width, next.height);
      cur = next;
    }
    return { data: best, width: cur.width, height: cur.height };
  }

  var lastInfo = null;
  // Chọn ảnh từ máy → cắt, thu nhỏ, nén cho vừa trần của loại ảnh. Trả về dataURL
  function pick(slot) {
    var cfg = SLOTS[slot] || SLOTS.hero;
    return pickFile().then(function (file) {
      return loadImage(file).then(function (img) {
        var r = compress(img, cfg, cfg.max);
        lastInfo = { slot: slot, before: file.size, after: Math.round(r.data.length * 0.75), width: r.width };
        return r.data;
      });
    });
  }

  // Nén lại một ảnh đã có (dataURL) xuống ≤ max byte
  function recompress(dataUrl, slot, max) {
    var cfg = SLOTS[slot] || SLOTS.hero;
    return loadFrom(dataUrl).then(function (img) { return compress(img, cfg, max).data; });
  }

  // Tổng ảnh vượt budget → nén ảnh nặng nhất xuống ~70% (lặp lại) cho tới khi vừa.
  // images: { hero, speakers: {i: url}, gallery: [url] }. Trả về { images (bản sao), count (số ảnh đã nén), fits }
  function shrinkToFit(images, budget) {
    var copy = JSON.parse(JSON.stringify(images || {}));
    var touched = {};
    function slots() {
      var out = [];
      if (copy.hero) out.push({ get: function () { return copy.hero; }, set: function (v) { copy.hero = v; }, slot: 'hero', id: 'hero' });
      Object.keys(copy.speakers || {}).forEach(function (k) { if (copy.speakers[k]) out.push({ get: function () { return copy.speakers[k]; }, set: function (v) { copy.speakers[k] = v; }, slot: 'avatar', id: 's' + k }); });
      (copy.gallery || []).forEach(function (u, i) { if (u) out.push({ get: function () { return copy.gallery[i]; }, set: function (v) { copy.gallery[i] = v; }, slot: 'gallery', id: 'g' + i }); });
      return out;
    }
    function done(fits) { return { images: copy, count: Object.keys(touched).length, fits: fits }; }
    function step(guard) {
      if (totalBytes(copy) <= budget) return Promise.resolve(done(true));
      if (guard > 40) return Promise.resolve(done(false));
      var big = slots().sort(function (a, b) { return b.get().length - a.get().length; })[0];
      if (!big || big.get().length < 4000) return Promise.resolve(done(false));
      var before = big.get().length;
      return recompress(big.get(), big.slot, Math.round(before * 0.7)).then(function (v) {
        if (v.length >= before) return done(false);
        big.set(v); touched[big.id] = true;
        return step(guard + 1);
      });
    }
    return step(0);
  }

  // Ước lượng dung lượng (byte) của các ảnh để không vượt giới hạn 1MB/tài liệu của Firestore
  function totalBytes(images) {
    var sum = 0;
    (function walk(v) {
      if (typeof v === 'string') sum += v.length;
      else if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { walk(v[k]); });
    })(images || {});
    return sum;
  }

  root.EP = root.EP || {};
  root.EP.images = {
    pick: pick, recompress: recompress, compressCanvas: compressCanvas, load: loadFrom, shrinkToFit: shrinkToFit, totalBytes: totalBytes, SLOTS: SLOTS, webp: WEBP,
    lastInfo: function () { return lastInfo; }
  };
})(window);
