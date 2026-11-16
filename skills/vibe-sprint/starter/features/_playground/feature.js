/* FEATURE "Mô-đun mẫu": minh hoạ nhanh các mô-đun tiện ích trong js/ (calc, checklist, quiz, chat + match, mock, metrics).
   Chép từng đoạn sang feature thật của bạn rồi XOÁ thư mục này + dòng <script> của nó trong index.html khi nộp bài. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  var FAQ = [
    { q: 'Giá sản phẩm bao nhiêu', keywords: ['giá', 'bao nhiêu', 'giá cả'], a: 'Sản phẩm có giá từ 99.000 ₫. Miễn phí vận chuyển cho đơn từ 300.000 ₫.' },
    { q: 'Giờ mở cửa', keywords: ['mở cửa', 'giờ làm việc', 'mấy giờ'], a: 'Cửa hàng mở cửa 8:00 - 21:00 mỗi ngày.' },
    { q: 'Đổi trả hàng', keywords: ['đổi trả', 'hoàn tiền', 'bảo hành'], a: 'Bạn được đổi trả trong 7 ngày nếu sản phẩm còn nguyên tem.' }
  ];
  var QUESTIONS = [
    { q: 'Thủ đô của Việt Nam là gì?', options: ['Đà Nẵng', 'Hà Nội', 'Huế', 'Cần Thơ'], answer: 1, explain: 'Hà Nội là thủ đô từ năm 1010.' },
    { q: '2 + 2 × 3 bằng bao nhiêu?', options: ['12', '8', '10', '6'], answer: 1, explain: 'Nhân trước, cộng sau: 2 + 6 = 8.' },
    { q: 'CSS viết tắt của cụm từ nào?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], answer: 0, explain: 'Cascading Style Sheets.' }
  ];
  var CHECK = [
    { id: 'title', label: 'Trang có tiêu đề rõ ràng', weight: 25, hint: 'Thêm thẻ <title> 10-60 ký tự.' },
    { id: 'desc', label: 'Có mô tả meta description', weight: 25, hint: 'Viết 120-160 ký tự.' },
    { id: 'h1', label: 'Có đúng một thẻ h1', weight: 30, hint: 'Mỗi trang một h1.' },
    { id: 'viewport', label: 'Có meta viewport cho di động', weight: 20, hint: 'Thêm width=device-width.' }
  ];

  var DEMOS = [
    { value: 'calc', label: 'Máy tính', mount: function (el) {
      EP.calc.mount(el, {
        title: 'Tính lợi nhuận đơn hàng',
        schema: {
          price: { label: 'Giá bán (₫)', type: 'number', rules: { required: true, min: 0 } },
          cost: { label: 'Giá vốn (₫)', type: 'number', rules: { required: true, min: 0 } },
          qty: { label: 'Số lượng', type: 'number', rules: { required: true, min: 1, integer: true } },
          ads: { label: 'Chi phí quảng cáo (₫)', type: 'number', rules: { min: 0 } }
        },
        defaults: { price: 250000, cost: 150000, qty: 20, ads: 400000 },
        compute: function (v) {
          var m = EP.metrics, revenue = v.price * v.qty, cogs = v.cost * v.qty, profit = revenue - cogs - (v.ads || 0);
          return {
            kpis: [{ label: 'Lợi nhuận', value: m.vnd(profit), hint: profit >= 0 ? 'Có lãi' : 'Đang lỗ' }, { label: 'Biên lợi nhuận', value: EP.fmt.percent(m.div(profit, revenue) * 100) }],
            rows: [['Doanh thu', m.vnd(revenue)], ['Giá vốn', m.vnd(cogs)], ['Quảng cáo', m.vnd(v.ads || 0)], ['ROAS', m.round(m.roas(revenue, v.ads), 2) + 'x']],
            notes: profit < 0 ? ['Bán dưới giá vốn hoặc quảng cáo quá cao. Thử tăng giá hoặc giảm chi phí.'] : [],
            chart: { type: 'donut', data: [{ label: 'Giá vốn', value: cogs }, { label: 'Quảng cáo', value: v.ads || 0 }, { label: 'Lợi nhuận', value: Math.max(profit, 0) }], opts: { format: m.vndShort, centerLabel: 'Doanh thu' } }
          };
        }
      });
    } },
    { value: 'checklist', label: 'Chấm điểm', mount: function (el) { EP.checklist.mount(el, { title: 'Kiểm tra trang web', items: CHECK }); } },
    { value: 'quiz', label: 'Đố vui', mount: function (el) { EP.quiz.mount(el, { title: 'Đố vui nhanh', questions: QUESTIONS, timePerQ: 20, boardName: 'demo' }); } },
    { value: 'chat', label: 'Chatbot', mount: function (el) {
      el.id = el.id || 'chat-demo';
      EP.chat.mount(el, {
        title: 'Trợ lý cửa hàng', quick: ['Giá bao nhiêu?', 'Giờ mở cửa', 'Đổi trả thế nào?'],
        reply: EP.chat.faqReply(FAQ, { quick: ['Giá bao nhiêu?', 'Giờ mở cửa'], action: { label: 'Để lại số điện thoại', onClick: function (c) { c.say('Cảm ơn bạn, nhân viên sẽ gọi lại sớm.'); } } })
      });
    } }
  ];

  EP.register({
    id: 'playground', label: 'Mô-đun', icon: 'calc', order: 30,
    title: 'Mô-đun tiện ích', desc: 'Máy tính, chấm điểm, đố vui và chatbot dựng sẵn để chép vào đề.',
    render: function (el) {
      el.innerHTML = '<div data-slot="pick"></div><div data-slot="demo" id="pg-demo"></div>';
      function show(v) { var d = DEMOS.filter(function (x) { return x.value === v; })[0], host = el.querySelector('[data-slot="demo"]'); host.innerHTML = ''; d.mount(host); }
      EP.ui.segmented(el.querySelector('[data-slot="pick"]'), { label: 'Chọn mô-đun', name: 'pg-pick', options: DEMOS, value: 'calc', onChange: show });
      show('calc');
    }
  });
})(window);
