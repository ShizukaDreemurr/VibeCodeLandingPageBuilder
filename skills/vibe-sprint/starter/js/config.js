/* config.js - NƠI DUY NHẤT cần sửa khi bắt đầu đề mới: tên app, tiền tố lưu trữ, câu thông báo mock.
   Phải nạp TRƯỚC mọi file js khác. Nếu đổi `prefix`, đổi luôn khoá '<prefix>theme' (mặc định 'ep_theme') trong <head> của index.html
   (new-project.sh tự làm việc này). */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.config = {
    appName: 'Tên ứng dụng',              // hiện ở thanh trên, tiêu đề tab, chân trang
    brandMark: 'X',                        // 1 ký tự trong ô logo
    heroLead: 'Giải pháp',                 // tiêu đề trang Tổng quan = heroLead + <em>heroEm</em> (đổi theo đề)
    heroEm: 'thông minh',
    tagline: 'Mô tả ngắn một dòng về ứng dụng.',
    prefix: 'ep_',                         // tiền tố mọi khoá localStorage (đổi theo từng đề để khỏi lẫn dữ liệu)
    defaultRoute: 'home',                  // view mở đầu tiên
    defaultAiMode: 'mock',                 // 'mock' | 'gemini' | 'paste'
    /* Proxy Gemini TUỲ CHỌN (xem proxy/README.md). Điền URL worker (vd 'https://vibe-gemini-proxy.ten.workers.dev') => chế độ Gemini không cần nhập key,
       key nằm ở máy chủ. appToken (tuỳ chọn) chỉ là làm rào, ai xem mã nguồn cũng thấy. Để '' = dùng key của người dùng như cũ. */
    ai: { proxyUrl: 'https://vibe-gemini-proxy.xclipse.workers.dev', appToken: '' },
    mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI', // BẮT BUỘC hiển thị cạnh mọi kết quả mock
    locale: 'vi-VN',
    currency: 'VND',
    /* Firebase TUỲ CHỌN, TẮT mặc định (enabled:false => không gọi mạng, dữ liệu chỉ ở localStorage). Xem README "Bật Firebase trong 5 phút".
       config = firebaseConfig công khai từ Firebase console. emulator:true => dùng Auth :9099 + Firestore :8080 trên máy. */
    firebase: { enabled: false, config: { apiKey: '', authDomain: '', projectId: '', appId: '' }, emulator: false }
  };
})(window);
