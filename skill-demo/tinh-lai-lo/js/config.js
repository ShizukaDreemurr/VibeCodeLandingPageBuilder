/* config.js - NƠI DUY NHẤT cần sửa khi bắt đầu đề mới: tên app, tiền tố lưu trữ, câu thông báo mock.
   Phải nạp TRƯỚC mọi file js khác. Nếu đổi `prefix`, đổi luôn khoá 'ep_theme' trong <head> của index.html. */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.config = {
    appName: 'Lãi Lỗ Shop',              // hiện ở thanh trên, tiêu đề tab, chân trang
    brandMark: 'L',                        // 1 ký tự trong ô logo
    heroLead: 'Mỗi đơn hàng,', heroEm: 'lãi hay lỗ?',
    tagline: 'Biết ngay mỗi đơn còn lãi bao nhiêu sau phí sàn, ship và quảng cáo.',
    prefix: 'll_',                         // tiền tố mọi khoá localStorage (đổi theo từng đề để khỏi lẫn dữ liệu)
    defaultRoute: 'home',                  // view mở đầu tiên
    defaultAiMode: 'mock',                 // 'mock' | 'gemini' | 'paste'
    mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI', // BẮT BUỘC hiển thị cạnh mọi kết quả mock
    locale: 'vi-VN',
    currency: 'VND'
  };
})(window);
