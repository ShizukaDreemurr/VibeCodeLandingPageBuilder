/* Deck dry-run: Lãi Lỗ Shop (đề dự đoán #1: tính lợi nhuận sản phẩm bán online). */
window.DECK = {
  meta: {
    app: 'Lãi Lỗ Shop',
    title: 'Lãi Lỗ Shop · Pitch chung kết (dry-run)',
    footer: '**Lãi Lỗ Shop** · Đề dự đoán #1 · Bảng B',
    accent: '#0E4A8A', accent2: '#FD6E88',
    liveUrl: 'https://example.github.io/tinh-lai-lo/',
    videoUrl: 'https://youtu.be/XXXXXXXXXXX'
  },
  slides: [
    { type: 'cover', time: '0:15',
      app: 'Lãi Lỗ Shop',
      tagline: 'Biết ngay mỗi đơn **lãi hay lỗ** sau phí sàn, ship và quảng cáo.',
      de: 'Đề dự đoán #1', bang: 'Bảng B', event: 'Chung kết 60 phút (dry-run)',
      team: 'dry-run', members: ['Thành viên 1', 'Thành viên 2', 'Thành viên 3'], date: '2026',
      image: 'assets/01-man-hinh-chinh.png',
      notes: 'Chào BGK, tên đội, đề tính lợi nhuận sản phẩm bán online. Trong 6 phút sẽ thấy: nhập số, thấy lãi lỗ, AI gợi ý giá.' },

    { type: 'problem', time: '0:40', eyebrow: 'Vấn đề',
      title: 'Chủ shop bán hàng **nhưng không biết** mình có lãi không',
      persona: { name: 'Chị Hà', role: 'Chủ shop phụ kiện trên sàn, bán 600 đơn mỗi tháng' },
      pains: ['Phí sàn, ship, quảng cáo cộng lại ăn mất phần lớn lãi', 'Tính tay trong Excel, sai một ô là sai cả tháng', 'Chạy khuyến mãi xong mới biết đang bán lỗ'],
      scenarioLabel: 'Tình huống minh hoạ (dựng sẵn)',
      scenario: 'Chị Hà giảm giá tai nghe còn **249.000 đ** để chạy flash sale. Sau phí sàn 13%, ship và quảng cáo, mỗi đơn **lỗ 15.370 đ**, 90 đơn là mất **1,4 triệu**.',
      stat: { value: '15.370 đ', label: 'lỗ mỗi đơn, ví dụ tính từ dữ liệu demo của app' },
      notes: 'Tình huống là dữ liệu mẫu của đội, không phải chuyện thật. Nói rõ điều đó.' },

    { type: 'solution', time: '0:30', eyebrow: 'Giải pháp',
      oneLiner: 'Nhập giá vốn, giá bán, phí một lần, ra ngay {{lãi từng đơn và điểm hòa vốn}}.',
      bullets: [{ icon: 'bolt', text: 'Tính lãi, biên và hòa vốn ngay khi gõ' }, { icon: 'chart', text: 'So sánh sản phẩm, thấy hàng nào đang lỗ' }, { icon: 'sparkles', text: 'AI gợi ý giá không bao giờ dưới hòa vốn' }],
      image: 'assets/02-giai-phap.png', title: 'Danh sách sản phẩm',
      notes: 'Một câu giải pháp, chỉ vào cột Lãi/đơn màu đỏ và xanh.' },

    { type: 'features', time: '0:40', eyebrow: 'Năm tính năng theo đề',
      title: 'Đủ **5 tính năng** của đề',
      items: [
        { icon: 'form', title: 'Nhập sản phẩm', desc: 'Giá vốn, giá bán, phí sàn, ship, quảng cáo; báo lỗi từng ô.' },
        { icon: 'calendar', title: 'Tính nhanh', desc: 'Lãi mỗi đơn, biên lợi nhuận, hòa vốn theo số đơn.' },
        { icon: 'chart', title: 'So sánh sản phẩm', desc: 'Xếp theo tổng lãi, biên lãi hoặc lãi mỗi đơn, có biểu đồ.' },
        { icon: 'sparkles', title: 'AI gợi ý giá', desc: 'Giá tối thiểu và 2 phương án khuyến mãi không làm lỗ.' },
        { icon: 'list', title: 'Lưu và báo cáo', desc: 'Lưu trong trình duyệt, copy báo cáo text, tải CSV.' }
      ],
      notes: 'Nhấn hai quy tắc: số do code tính, AI chỉ viết lời; giá AI bị kẹp lại không dưới hòa vốn.' },

    { type: 'flow', time: '0:30', eyebrow: 'Luồng sử dụng',
      title: 'Từ số liệu đến quyết định giá trong **4 bước**',
      steps: [{ icon: 'form', title: 'Nhập', desc: 'Thêm sản phẩm hoặc gõ nhanh' }, { icon: 'bolt', title: 'Xem lãi lỗ', desc: 'Lãi/đơn, biên, hòa vốn' }, { icon: 'sparkles', title: 'Hỏi AI', desc: 'Giá tối thiểu, khuyến mãi' }, { icon: 'file', title: 'Báo cáo', desc: 'Copy hoặc CSV' }],
      note: 'Dữ liệu lưu trong trình duyệt của người dùng, có nút sao lưu JSON.' },

    { type: 'demo', time: '1:30', eyebrow: 'Demo trực tiếp',
      title: 'Đang chạy **ngay bây giờ**',
      image: 'assets/03-demo.png', iframe: false,
      caption: 'Kịch bản: **gõ số** ở Tính nhanh → **so sánh** 5 sản phẩm → **AI** gợi ý giá cho tai nghe đang lỗ. Ca sai: giá bán 0.',
      notes: 'Demo: giá bán 0 báo lỗi tiếng Việt; số đơn 0 không ra NaN.' },

    { type: 'ai', time: '0:50', eyebrow: 'AI trong sản phẩm',
      title: 'AI **làm gì**, kiểm soát thế nào',
      realTitle: 'AI thật', real: ['Chế độ Gemini bằng key người dùng nhập (chưa thử trong dry-run)'],
      mockTitle: 'Mô phỏng', mock: ['Mặc định chạy mô phỏng tất định, luôn có nhãn trên màn hình'],
      controlsTitle: 'Kiểm soát', controls: ['Số tiền do code tính, AI chỉ viết lời', 'Giá AI dưới hòa vốn bị nâng lại', 'Key không vào mã nguồn'],
      pipeline: { steps: [{ label: 'Prompt', sub: 'số đã tính sẵn' }, { label: 'Gọi AI', sub: 'mô phỏng / Gemini', kind: 'key' }, { label: 'Kiểm tra', sub: 'schema + kẹp giá', kind: 'key' }, { label: 'Hiển thị', sub: 'kèm nhãn mô phỏng', kind: 'ok' }],
        fallbackAt: 2, fallbackLabel: 'lỗi hoặc sai',
        fallback: { label: 'Dự phòng', sub: 'bản mô phỏng + báo rõ' } },
      notes: 'Trung thực: mặc định là mô phỏng, nói rõ.' },

    { type: 'quality', time: '0:40', eyebrow: 'Kiểm thử',
      title: 'Đủ **3 loại ca**: bình thường, nhập sai, biên',
      rows: [
        { id: 'TC01', kind: 'Bình thường', case: 'Áo thun: giá 159.000, vốn 62.000, phí 12%', result: 'Lãi 47.920 đ/đơn, hòa vốn 84 đơn', status: 'pass' },
        { id: 'TC02', kind: 'Nhập thiếu', case: 'Gửi form rỗng', result: 'Báo "Vui lòng nhập" dưới ô tên', status: 'pass' },
        { id: 'TC03', kind: 'Nhập sai', case: 'Giá bán 0, vốn âm, phí sàn 80%', result: 'Cả 3 ô bị từ chối bằng tiếng Việt', status: 'pass' },
        { id: 'TC04', kind: 'Biên', case: 'Giá bán 0 và 0 đơn ở Tính nhanh', result: 'Không ra NaN hay Infinity', status: 'pass' },
        { id: 'TC05', kind: 'Biên', case: 'Sản phẩm lỗ: tai nghe 249.000', result: 'Hiện lỗ 15.370 đ, biểu đồ có cột âm', status: 'pass' },
        { id: 'TC06', kind: 'Sự cố AI', case: 'Gemini giả trả 429', result: 'Đổi model rồi rơi về mô phỏng', status: 'pass', label: 'Đạt (Gemini giả)' }
      ],
      summary: { value: '105', label: 'kiểm tra tự động đạt, chạy bằng tests/smoke.cjs' },
      legend: ['Playwright tự động + xem ảnh', 'Gemini thật chưa thử'],
      notes: 'Chỉ nêu kết quả đã chạy thật.' },

    { type: 'metrics', time: '0:25', eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được**',
      items: [{ value: 5, label: 'Tính năng theo đề', sub: 'Đếm trong features/' }, { value: 105, label: 'Kiểm tra tự động đạt', sub: 'node tests/smoke.cjs' }, { value: 0, label: 'Lỗi console', sub: 'smoke test, 14 màn sáng/tối' }],
      note: 'Chưa đo với người dùng thật.' },

    { type: 'roadmap', time: '0:20', eyebrow: 'Bước tiếp theo',
      title: 'Lộ trình **sau chung kết**',
      items: [{ when: 'Tuần 1', title: 'Nhập từ file sàn', desc: 'Đọc CSV xuất từ sàn TMĐT.', tag: 'Ưu tiên' }, { when: 'Tuần 2', title: 'Thử Gemini thật', desc: 'Kiểm chứng với key thật.' }, { when: 'Tháng 1', title: 'Theo dõi theo ngày', desc: 'Lãi lỗ theo từng ngày bán.' }] },

    { type: 'team', time: '0:15', eyebrow: 'Đội ngũ',
      title: 'Đội **dry-run**',
      members: [{ name: 'Họ và tên 1', role: 'Điều phối', did: 'Chia việc, merge, test.' }, { name: 'Họ và tên 2', role: 'Giao diện', did: 'Kiểm tra mobile, sáng/tối.' }],
      stack: ['HTML/CSS/JS thuần', 'Playwright', 'GitHub Pages'] },

    { type: 'thanks', time: '0:15', eyebrow: 'Lãi Lỗ Shop · Đề dự đoán #1',
      title: 'Cảm ơn!', subtitle: 'Quét mã để dùng thử.', cta: 'Hỏi đáp', qrLabel: 'Quét để dùng thử ngay' }
  ]
};
