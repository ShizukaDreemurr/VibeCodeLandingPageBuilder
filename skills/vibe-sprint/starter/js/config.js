/* config.js - NƠI DUY NHẤT cần sửa khi bắt đầu đề mới: tên app, tiền tố lưu trữ, câu thông báo mock.
   Phải nạp TRƯỚC mọi file js khác. Nếu đổi `prefix`, đổi luôn khoá 'ep_theme' trong <head> của index.html. */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.config = {
    appName: 'Tên ứng dụng',              // hiện ở thanh trên, tiêu đề tab, chân trang
    brandMark: 'X',                        // 1 ký tự trong ô logo
    tagline: 'Mô tả ngắn một dòng về ứng dụng.',
    prefix: 'ep_',                         // tiền tố mọi khoá localStorage (đổi theo từng đề để khỏi lẫn dữ liệu)
    defaultRoute: 'home',                  // view mở đầu tiên
    defaultAiMode: 'mock',                 // 'mock' | 'gemini' | 'paste'
    mockNotice: 'Bản demo vòng loại - Dữ liệu mô phỏng AI', // BẮT BUỘC hiển thị cạnh mọi kết quả mock
    locale: 'vi-VN',
    currency: 'VND'
  };
})(window);
