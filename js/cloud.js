/*
 * cloud.js — lưu sự kiện và đăng ký lên Firebase (Firestore) để mọi thiết bị dùng chung.
 * Nếu không tải được Firebase (mất mạng, mở file trực tiếp…), app tự dùng localStorage như cũ.
 *
 * Cấu trúc dữ liệu:
 *   events/{eventId}                      nội dung trang (công khai), ownerUid
 *   events/{eventId}/stats/public         { count, waitlist, lastRegId } (công khai)
 *   events/{eventId}/registrations/{SĐT}  { name, phone, email, status, createdAt } (chỉ chủ sự kiện đọc)
 *   events/{eventId}/emails/{email}       { regId } (khoá chống trùng email)
 */
(function (root) {
  var fb = root.firebase;
  var available = !!(fb && root.EP_FIREBASE_CONFIG);
  var db = null;
  var auth = null;
  var MAX_RETRY = 3;
  var TIMEOUT_MS = 12000;

  var params = new URLSearchParams(root.location.search);
  var useEmulator = params.get('emulator') === '1';

  if (available) {
    try {
      fb.initializeApp(root.EP_FIREBASE_CONFIG);
      db = fb.firestore();
      auth = fb.auth();
      if (useEmulator) {
        db.useEmulator('127.0.0.1', 8085);
        auth.useEmulator('http://127.0.0.1:9099');
      }
    } catch (e) {
      available = false;
    }
  }

  function withTimeout(promise, message) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error(message || 'Máy chủ phản hồi quá lâu, vui lòng thử lại.')); }, TIMEOUT_MS);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function eventRef(id) { return db.collection('events').doc(id); }
  function statsRef(id) { return eventRef(id).collection('stats').doc('public'); }
  function metricsRef(id) { return eventRef(id).collection('metrics').doc('funnel'); }
  var EMPTY_METRICS = { views: 0, ctaClicks: 0, studioClicks: 0, appClicks: 0 };

  // ---------- Đăng nhập (chủ sự kiện) ----------
  function onAuth(callback) {
    if (!available) return callback(null);
    auth.onAuthStateChanged(callback);
  }

  function signIn() {
    if (!available) return Promise.reject(new Error('Chưa kết nối được Firebase.'));
    if (root.location.protocol === 'file:') {
      return Promise.reject(new Error('Đăng nhập Google cần mở app qua đường dẫn web (GitHub Pages hoặc localhost), không mở trực tiếp file.'));
    }
    var provider = new fb.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return auth.signInWithPopup(provider).catch(function (e) { throw new Error(authMessage(e)); });
  }

  // Dịch lỗi đăng nhập sang hướng dẫn dễ hiểu
  function authMessage(e) {
    var map = {
      'auth/popup-blocked': 'Trình duyệt đã chặn cửa sổ đăng nhập. Bấm biểu tượng chặn popup trên thanh địa chỉ, chọn "Luôn cho phép", rồi bấm lại.',
      'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất. Hãy bấm lại.',
      'auth/cancelled-popup-request': 'Đang có một cửa sổ đăng nhập khác mở. Hãy hoàn tất cửa sổ đó.',
      'auth/unauthorized-domain': 'Tên miền này chưa được cho phép đăng nhập. Thêm tên miền vào Firebase → Authentication → Settings → Authorized domains.',
      'auth/operation-not-allowed': 'Đăng nhập Google chưa được bật trong Firebase (Authentication → Sign-in method).',
      'auth/network-request-failed': 'Mất kết nối mạng khi đăng nhập. Kiểm tra mạng rồi thử lại.',
      'auth/internal-error': 'Google từ chối đăng nhập trên trình duyệt này. Hãy thử trình duyệt Chrome thông thường (không phải trình duyệt tự động).'
    };
    return (e && map[e.code]) || ('Không đăng nhập được: ' + ((e && e.message) || 'lỗi không xác định') + '.');
  }

  function signOut() { return available ? auth.signOut() : Promise.resolve(); }

  function currentUser() { return available ? auth.currentUser : null; }

  // ---------- Sự kiện ----------
  function toPublicDoc(ev, content, uid) {
    return {
      ownerUid: uid,
      name: ev.name,
      capacity: Number(ev.capacity) || 0,
      startAt: fb.firestore.Timestamp.fromDate(new Date(ev.startAt)),
      startAtLocal: ev.startAt,
      location: ev.location,
      speakers: ev.speakers || [],
      agenda: ev.agenda || [],
      earlyBird: ev.earlyBird || '',
      earlyBirdUntil: ev.earlyBirdUntil || '',
      sheetUrl: ev.sheetUrl || '',
      templateId: ev.templateId || 'tech',
      images: ev.images || {},
      studioName: ev.studioName || '',
      studioUrl: ev.studioUrl || '',
      sections: ev.sections || null,
      style: ev.style || null,
      texts: ev.texts || null,
      elStyles: ev.elStyles || null,
      content: { headline: content.headline, description: content.description, benefits: content.benefits, source: content.source },
      updatedAt: fb.firestore.FieldValue.serverTimestamp()
    };
  }

  // Lần đầu: tạo sự kiện + bộ đếm. Các lần sau: chỉ cập nhật nội dung.
  function publishEvent(ev, content, isNew) {
    var user = currentUser();
    if (!user) return Promise.reject(new Error('Vui lòng đăng nhập Google để xuất bản trang.'));
    var data = toPublicDoc(ev, content, user.uid);
    var op;
    if (isNew) {
      var batch = db.batch();
      batch.set(eventRef(ev.id), data);
      batch.set(statsRef(ev.id), { count: 0, waitlist: 0, lastRegId: '' });
      op = batch.commit().then(ensureMetrics.bind(null, ev.id));
    } else {
      op = eventRef(ev.id).set(data).then(ensureMetrics.bind(null, ev.id));
    }
    return withTimeout(op);
  }

  // Đọc sự kiện cho trang công khai (?e=...)
  function loadEvent(id) {
    if (!available) return Promise.reject(new Error('Không tải được dữ liệu sự kiện (chưa kết nối máy chủ).'));
    return withTimeout(eventRef(id).get()).then(function (snap) {
      if (!snap.exists) throw new Error('Không tìm thấy sự kiện. Đường dẫn có thể sai hoặc sự kiện đã bị xoá.');
      var d = snap.data();
      return {
        event: {
          id: id,
          name: d.name,
          startAt: d.startAtLocal || d.startAt.toDate().toISOString().slice(0, 16),
          location: d.location,
          capacity: d.capacity || '',
          speakers: d.speakers || [],
          agenda: d.agenda || [],
          earlyBird: d.earlyBird,
          earlyBirdUntil: d.earlyBirdUntil,
          sheetUrl: d.sheetUrl || '',
          templateId: d.templateId || 'tech',
          images: d.images || {},
          studioName: d.studioName || '',
          studioUrl: d.studioUrl || '',
          sections: d.sections || null,
          style: d.style || null,
          texts: d.texts || null,
          elStyles: d.elStyles || null,
          ownerUid: d.ownerUid,
          published: true
        },
        content: d.content
      };
    });
  }

  // Theo dõi số đăng ký theo thời gian thực
  function watchStats(id, callback) {
    if (!available) return function () {};
    return statsRef(id).onSnapshot(function (snap) {
      if (snap.exists) callback(snap.data());
    }, function () { /* mất quyền/mạng: giữ số cũ */ });
  }

  // ---------- Đăng ký ----------
  // rec: { name, phone (đã chuẩn hoá), email (chữ thường) }
  // Trả về { ok, duplicate, waitlist }
  function register(ev, rec) {
    var attempt = 0;
    var capacity = Number(ev.capacity) || 0;

    function readStats() {
      return withTimeout(statsRef(ev.id).get()).then(function (s) { return s.data() || { count: 0, waitlist: 0 }; });
    }

    function tryOnce(stats) {
      attempt++;
      var waitlist = capacity > 0 && stats.count >= capacity;
      var batch = db.batch();
      batch.set(eventRef(ev.id).collection('registrations').doc(rec.phone), {
        name: rec.name,
        phone: rec.phone,
        email: rec.email,
        status: waitlist ? 'waitlist' : 'new',
        createdAt: fb.firestore.FieldValue.serverTimestamp()
      });
      batch.set(eventRef(ev.id).collection('emails').doc(rec.email), { regId: rec.phone });
      batch.update(statsRef(ev.id), waitlist
        ? { waitlist: stats.waitlist + 1, lastRegId: rec.phone }
        : { count: stats.count + 1, lastRegId: rec.phone });

      return withTimeout(batch.commit()).then(function () {
        return { ok: true, waitlist: waitlist };
      }, function (err) {
        if (!err || err.code !== 'permission-denied') {
          throw new Error('Kết nối chậm hoặc mất mạng. Hãy thử lại; nếu hệ thống báo "đã đăng ký" nghĩa là lần trước đã gửi thành công.');
        }
        // Bị từ chối: hoặc người khác vừa đăng ký cùng lúc (số đếm đổi) → thử lại,
        // hoặc SĐT/email đã đăng ký → báo trùng.
        return readStats().then(function (fresh) {
          var changed = fresh.count !== stats.count || fresh.waitlist !== stats.waitlist;
          if (changed && attempt < MAX_RETRY) return tryOnce(fresh);
          return { ok: false, duplicate: true };
        });
      });
    }

    return readStats().then(tryOnce);
  }

  // ---------- Đo phễu: lượt xem, lượt bấm (số liệu tổng, không có thông tin cá nhân) ----------
  // Tạo bộ đếm nếu chưa có. Lỗi (ví dụ quy tắc chưa cập nhật) không chặn việc xuất bản.
  function ensureMetrics(id) {
    return metricsRef(id).get().then(function (snap) {
      if (!snap.exists) return metricsRef(id).set(EMPTY_METRICS);
    }).catch(function () {});
  }

  // field: views | ctaClicks | studioClicks | appClicks
  function track(id, field) {
    if (!available || !EMPTY_METRICS.hasOwnProperty(field)) return Promise.resolve();
    var data = {};
    data[field] = fb.firestore.FieldValue.increment(1);
    return metricsRef(id).update(data).catch(function () {});
  }

  function getMetrics(id) {
    return withTimeout(metricsRef(id).get()).then(function (snap) {
      return Object.assign({}, EMPTY_METRICS, snap.exists ? snap.data() : {});
    });
  }

  // Các sự kiện của tài khoản đang đăng nhập (để mở lại trên thiết bị khác)
  function listMyEvents() {
    var user = currentUser();
    if (!user) return Promise.resolve([]);
    return withTimeout(db.collection('events').where('ownerUid', '==', user.uid).get()).then(function (snap) {
      return snap.docs.map(function (d) {
        var x = d.data();
        return { id: d.id, name: x.name, startAt: x.startAtLocal || '', templateId: x.templateId || 'tech' };
      });
    });
  }

  function updateLead(eventId, regId, leadStatus) {
    return withTimeout(eventRef(eventId).collection('registrations').doc(regId).update({ leadStatus: leadStatus }));
  }

  // ---------- Quản trị (chỉ chủ sự kiện) ----------
  function listRegistrations(id) {
    return withTimeout(eventRef(id).collection('registrations').orderBy('createdAt').get()).then(function (snap) {
      return snap.docs.map(function (d) {
        var r = d.data();
        return {
          id: d.id, name: r.name, phone: r.phone, email: r.email, status: r.status, leadStatus: r.leadStatus || 'new',
          createdAt: r.createdAt ? r.createdAt.toDate().toISOString() : new Date().toISOString()
        };
      });
    });
  }

  function clearRegistrations(id) {
    var regs = eventRef(id).collection('registrations');
    var emails = eventRef(id).collection('emails');
    return Promise.all([regs.get(), emails.get()]).then(function (res) {
      var batch = db.batch();
      res[0].docs.concat(res[1].docs).forEach(function (d) { batch.delete(d.ref); });
      batch.update(statsRef(id), { count: 0, waitlist: 0, lastRegId: '' });
      return withTimeout(batch.commit());
    });
  }

  // Chỉ dùng khi chạy kiểm thử với Firebase Emulator
  function testSignIn(uid) {
    if (!useEmulator) return Promise.reject(new Error('Chỉ dùng với emulator.'));
    var token = JSON.stringify({ sub: uid, email: uid + '@test.local', email_verified: true });
    return auth.signInWithCredential(fb.auth.GoogleAuthProvider.credential(token));
  }

  root.EP = root.EP || {};
  root.EP.cloud = {
    available: available,
    onAuth: onAuth,
    signIn: signIn,
    signOut: signOut,
    currentUser: currentUser,
    publishEvent: publishEvent,
    loadEvent: loadEvent,
    watchStats: watchStats,
    register: register,
    listRegistrations: listRegistrations,
    listMyEvents: listMyEvents,
    updateLead: updateLead,
    track: track,
    getMetrics: getMetrics,
    clearRegistrations: clearRegistrations,
    testSignIn: testSignIn
  };
})(window);
