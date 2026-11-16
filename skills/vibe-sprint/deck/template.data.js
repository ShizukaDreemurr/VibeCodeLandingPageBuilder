/* ============================================================================
   TEMPLATE — sao chép thành deck.data.js rồi điền 12 ô đánh số [1]…[12].
   Mở deck.html là thấy ngay. Không sửa deck.html. Xuất PDF: node tools/export.cjs
   Quy ước chữ:  **đậm**   {{nhấn màu gradient}}
   Ảnh: đặt trong assets/ (chụp bằng tools/capture.cjs). Thiếu ảnh thì khung hiện chữ nhắc.
   Mỗi slide có thể có  notes: '...'  (ghi chú trình bày, bấm N)  và  time: '0:40'  (gợi ý thời lượng).
   ============================================================================ */
window.DECK = {
  meta: {
    app: 'TÊN APP',                                    // [1] tên app
    title: 'TÊN APP · Pitch chung kết',
    footer: '**TÊN APP** · Đề X · Bảng Y',             // chân trang mỗi slide
    accent: '#6A57F2', accent2: '#2F8FE0',             // màu theo đề (bỏ dòng này để dùng tím–xanh mặc định)
    liveUrl: 'https://TEN.github.io/REPO/',            // [8] link app đang chạy (tự sinh QR)
    videoUrl: 'https://youtu.be/XXXXXXXXXXX'           // [8] link video demo
  },
  slides: [
    { type: 'cover', time: '0:15',
      app: 'TÊN APP',                                  // [1]
      tagline: 'Một câu: làm gì cho ai, nhanh/tốt hơn thế nào.',  // [2] tagline ≤ 15 từ
      de: 'Đề số X', bang: 'Bảng Y', event: 'Chung kết 60 phút',  // [3] đề + bảng
      team: 'TÊN ĐỘI', members: ['Thành viên 1', 'Thành viên 2'], date: '2026',  // [3]
      image: 'assets/01-man-hinh-chinh.png',
      notes: 'Chào BGK, tên đội, đề nào, 60 giây tới sẽ thấy gì.' },

    { type: 'problem', time: '0:40', eyebrow: 'Vấn đề',
      title: 'Một câu nêu **nỗi đau** của người dùng',
      persona: { name: 'Tên persona', role: 'Vai trò, bối cảnh' },       // [4] persona
      pains: ['Nỗi đau 1', 'Nỗi đau 2', 'Nỗi đau 3'],                    // [4] 2–4 nỗi đau
      scenarioLabel: 'Tình huống điển hình',                              // ghi "thật" chỉ khi đúng là chuyện thật
      scenario: 'Một tình huống cụ thể có **thời điểm, con số, hậu quả**.', // [5]
      stat: { value: 'X phút', label: 'mục tiêu / con số đo được' },
      notes: 'Nói như kể chuyện: ai, khi nào, đau ở đâu.' },

    { type: 'solution', time: '0:30', eyebrow: 'Giải pháp',
      oneLiner: 'Làm A một lần, ra ngay {{kết quả B}}.',                  // [6] giải pháp một câu
      bullets: [{ icon: 'wand', text: 'Điểm mạnh 1' }, { icon: 'clock', text: 'Điểm mạnh 2' }, { icon: 'qr', text: 'Điểm mạnh 3' }],
      image: 'assets/02-giai-phap.png', title: 'Màn hình chính',
      notes: 'Một câu giải pháp + chỉ vào ảnh.' },

    { type: 'features', time: '0:40', eyebrow: 'Tính năng',
      title: 'Đủ **5 tính năng** của đề',
      items: [                                                             // [7] 5 tính năng (icon: xem danh sách cuối file)
        { icon: 'form', title: 'Tính năng 1', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'sparkles', title: 'Tính năng 2', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'layout', title: 'Tính năng 3', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'users', title: 'Tính năng 4', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'list', title: 'Tính năng 5', desc: 'Mô tả ≤ 15 từ.' }
      ],
      notes: 'Đi nhanh, nhấn 1–2 quy tắc nghiệp vụ.' },

    { type: 'flow', time: '0:30', eyebrow: 'Luồng sử dụng',
      title: 'Từ A đến B trong **4 bước**',
      steps: [
        { icon: 'form', title: 'Bước 1', desc: 'Làm gì' },
        { icon: 'sparkles', title: 'Bước 2', desc: 'Làm gì' },
        { icon: 'layout', title: 'Bước 3', desc: 'Làm gì' },
        { icon: 'qr', title: 'Bước 4', desc: 'Làm gì' }
      ],
      note: 'Dữ liệu lưu ở đâu / điều cần biết (tuỳ chọn).' },

    { type: 'demo', time: '1:30', eyebrow: 'Demo trực tiếp',
      title: 'Đang chạy **ngay bây giờ**',
      image: 'assets/03-demo.png',                                         // ảnh dự phòng khi mất mạng
      iframe: true,                                                        // true = có nút "Chạy trực tiếp" nhúng link live (app phải cho phép iframe)
      caption: 'Kịch bản: **bước 1** → **bước 2** → **bước 3**.',
      notes: 'DEMO: liệt kê đúng các thao tác, ca nhập sai, ca biên. Mất mạng: dùng video.' },

    { type: 'ai', time: '0:50', eyebrow: 'AI trong sản phẩm',
      title: 'AI **làm gì**, kiểm soát thế nào',
      realTitle: 'AI thật', real: ['Phần nào gọi AI thật'],               // [9]
      mockTitle: 'Mô phỏng', mock: ['Phần nào là mô phỏng / dữ liệu mẫu (nói thẳng)'],  // [9]
      controlsTitle: 'Kiểm soát', controls: ['Chống bịa', 'Kiểm tra đầu ra', 'Bảo vệ khoá API'],
      pipeline: { steps: [
          { label: 'Prompt', sub: 'dữ kiện từ form' },
          { label: 'Gọi AI', sub: 'model / dán tay', kind: 'key' },
          { label: 'Kiểm tra', sub: 'định dạng, đủ trường', kind: 'key' },
          { label: 'Hiển thị', sub: 'người dùng sửa', kind: 'ok' } ],
        fallbackAt: 2, fallbackLabel: 'lỗi hoặc thiếu',
        fallback: { label: 'Dự phòng', sub: 'bản mô phỏng + báo rõ' } },
      notes: 'Trung thực: thật vs mô phỏng. Nêu cách kiểm soát và ca sự cố AI đã thử.' },

    { type: 'quality', time: '0:40', eyebrow: 'Kiểm thử',
      title: 'Đủ **3 loại ca**: bình thường, nhập sai, biên',
      rows: [                                                              // [10] ≥ 6 ca; status: 'pass' | 'warn' | 'fail'
        { id: 'TC01', kind: 'Bình thường', case: 'Ca 1', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC02', kind: 'Nhập thiếu', case: 'Ca 2', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC03', kind: 'Nhập sai', case: 'Ca 3', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC04', kind: 'Biên', case: 'Ca 4', result: 'Kết quả thực tế', status: 'pass' },
        { id: 'TC05', kind: 'Biên', case: 'Ca 5', result: 'Còn lỗi nhỏ, đã ghi nhận', status: 'warn', label: 'Đạt, 1 lưu ý' },
        { id: 'TC06', kind: 'Sự cố AI', case: 'Ca 6', result: 'Kết quả thực tế', status: 'pass' }
      ],
      summary: { value: '6/6', label: 'ca đạt, chạy ngày DD/MM' },
      legend: ['Cách kiểm thử (tay / tự động)', 'Lỗi còn lại nói thẳng'],
      notes: 'Chỉ nêu kết quả đã chạy thật.' },

    { type: 'metrics', time: '0:25', eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được**',
      items: [                                                             // [11] 3–4 con số có nguồn
        { value: 5, suffix: ' phút', label: 'Thời gian từ A đến B', sub: 'Nguồn / cách đo' },
        { value: 100, suffix: '%', label: 'Ca kiểm thử đạt', sub: 'Nguồn / cách đo' },
        { value: 12, label: 'Mẫu / dữ liệu', sub: 'Nguồn / cách đo' }
      ],
      note: 'Phần chưa kiểm chứng (nói thẳng).',
      notes: 'Chỉ dùng số bạn chứng minh được trong repo.' },

    { type: 'roadmap', time: '0:20', eyebrow: 'Bước tiếp theo',
      title: 'Lộ trình **sau chung kết**',
      items: [
        { when: 'Tuần 1', title: 'Việc 1', desc: 'Mô tả ngắn.', tag: 'Ưu tiên' },
        { when: 'Tuần 2', title: 'Việc 2', desc: 'Mô tả ngắn.' },
        { when: 'Tháng 1', title: 'Việc 3', desc: 'Mô tả ngắn.' }
      ] },

    { type: 'team', time: '0:15', eyebrow: 'Đội ngũ',
      title: 'Đội **TÊN ĐỘI**',
      members: [                                                           // [12] 2–4 thành viên
        { name: 'Họ và tên 1', role: 'Vai trò', did: 'Đã làm gì trong 60 phút.' },
        { name: 'Họ và tên 2', role: 'Vai trò', did: 'Đã làm gì trong 60 phút.' }
      ],
      stack: ['Công cụ 1', 'Công cụ 2'] },

    { type: 'thanks', time: '0:15', eyebrow: 'TÊN APP · Đề X · Bảng Y',
      title: 'Cảm ơn!', subtitle: 'Quét mã để dùng thử.', cta: 'Hỏi đáp',
      qrLabel: 'Quét để dùng thử ngay'                                      // url/video lấy từ meta ở trên
    }
  ]
};
/* Tên icon dùng được: form sparkles wand layout users user qr chart bolt shield clock check x alert globe phone file list
   calendar rocket target heart search edit lock cloud mail star code db arrow image link play money flag bell mic.
   (icon không có trong danh sách sẽ hiện nguyên chữ, ví dụ icon: '1' hoặc '%'.) */
