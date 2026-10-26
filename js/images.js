/*
 * images.js — chọn ảnh từ máy, tự cắt cho vừa khung và nén nhẹ để trang tải nhanh.
 * Kết quả là chuỗi dataURL (JPEG) lưu cùng dữ liệu sự kiện.
 */
(function (root) {
  var MAX_INPUT_BYTES = 15 * 1024 * 1024;

  // Kích thước theo loại ô ảnh: { w, h (null = giữ tỉ lệ), quality }
  var SLOTS = {
    hero: { w: 1400, h: null, quality: 0.72 },
    avatar: { w: 320, h: 320, quality: 0.8 },
    gallery: { w: 900, h: null, quality: 0.7 }
  };

  function pickFile() {
    return new Promise(function (resolve, reject) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/webp';
      input.addEventListener('change', function () {
        var file = input.files && input.files[0];
        if (!file) return reject(new Error('Chưa chọn ảnh.'));
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return reject(new Error('Chỉ nhận ảnh JPG, PNG hoặc WebP.'));
        if (file.size > MAX_INPUT_BYTES) return reject(new Error('Ảnh quá lớn (tối đa 15MB).'));
        resolve(file);
      });
      input.click();
    });
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Không đọc được ảnh này.')); };
      img.src = url;
    });
  }

  // Cắt giữa (nếu có chiều cao cố định) rồi thu nhỏ
  function resize(img, slot) {
    var cfg = SLOTS[slot] || SLOTS.hero;
    var sw = img.naturalWidth;
    var sh = img.naturalHeight;
    var sx = 0;
    var sy = 0;
    var tw = Math.min(cfg.w, sw);
    var th;
    if (cfg.h) {
      var ratio = cfg.w / cfg.h;
      if (sw / sh > ratio) { var nw = sh * ratio; sx = (sw - nw) / 2; sw = nw; } else { var nh = sw / ratio; sy = (sh - nh) / 2; sh = nh; }
      tw = Math.min(cfg.w, sw);
      th = Math.round(tw / ratio);
    } else {
      th = Math.round(tw * sh / sw);
    }
    var canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // nền trắng cho ảnh PNG trong suốt
    ctx.fillRect(0, 0, tw, th);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
    return canvas.toDataURL('image/jpeg', cfg.quality);
  }

  function pick(slot) {
    return pickFile().then(loadImage).then(function (img) { return resize(img, slot); });
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
  root.EP.images = { pick: pick, resize: resize, totalBytes: totalBytes, SLOTS: SLOTS };
})(window);
