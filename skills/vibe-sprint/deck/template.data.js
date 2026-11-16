/* ============================================================================
   TEMPLATE — sao chép thành deck.data.js rồi điền các ô đánh số [1]…[11].
   Mở deck.html là thấy ngay. Không sửa deck.html. Xuất PDF: node tools/export.cjs
   Quy ước chữ:  **đậm**   {{nhấn màu gradient}}
   Ảnh: đặt trong assets/ (chụp bằng tools/capture.cjs). Thiếu ảnh thì khung hiện chữ nhắc.
   Mỗi slide có:  speaker: 'Tên'  (người nói, chỉ hiện trong ghi chú, KHÔNG hiện lên slide)  ·  time: '0:40'  (thời lượng gợi ý)  ·
   notes: '...'  (bấm N): dòng 1 Người nói, dòng 2 Mốc giờ, rồi V / T / S = 3 neo, cuối cùng Chuyền mic. Chi tiết: templates/KICH-BAN-DEMO.md.
   Bộ 11 slide cho pitch 10 phút: Diệu Anh 1–3 · Dũng 4–7 · Nguyên 8–11. Đổi tên người nói theo đội.
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
    { type: 'cover', time: '0:35', speaker: 'Diệu Anh',
      app: 'TÊN APP',                                  // [1]
      tagline: 'Một câu: làm gì cho ai, nhanh/tốt hơn thế nào.',  // [2] tagline ≤ 15 từ
      de: 'Đề số X', bang: 'Bảng Y', event: 'Chung kết 60 phút',  // [3] đề + bảng
      team: 'TÊN ĐỘI', members: ['Thành viên 1', 'Thành viên 2'], date: '2026',  // [3]
      image: 'assets/01-man-hinh-chinh.png',
      notes: 'Người nói: Diệu Anh\nMốc giờ: 00:00–00:35 (cứng 00:40)\nV: {{NHOM_NGUOI_DUNG}} đang mất {{VIEC_TON_THOI_GIAN}}\nT: tên app + 1 câu hứa\nS: {{SO_MUC_TIEU}}\nChuyền mic: —' },

    { type: 'problem', time: '0:55', speaker: 'Diệu Anh', eyebrow: 'Vấn đề',
      title: 'Một câu nêu **nỗi đau** của người dùng',
      persona: { name: 'Tên persona', role: 'Vai trò, bối cảnh' },       // [4] persona
      pains: ['Nỗi đau 1', 'Nỗi đau 2', 'Nỗi đau 3'],                    // [4] 2–4 nỗi đau
      scenarioLabel: 'Tình huống điển hình',                              // ghi "thật" chỉ khi đúng là chuyện thật
      scenario: 'Một tình huống cụ thể có **thời điểm, con số, hậu quả**.', // [5]
      stat: { value: 'X phút', label: 'mục tiêu / con số đo được' },
      notes: 'Người nói: Diệu Anh\nMốc giờ: 00:35–01:30 (cứng 01:35)\nV: {{NOI_DAU_CHINH}}\nT: kể 1 tình huống có giờ/số của persona\nS: {{SO_NOI_DAU}}\nChuyền mic: —' },

    { type: 'solution', time: '1:00', speaker: 'Diệu Anh', eyebrow: 'Giải pháp',
      oneLiner: 'Làm A một lần, ra ngay {{kết quả B}}.',                  // [6] giải pháp một câu
      bullets: [{ icon: 'wand', text: 'Điểm mạnh 1' }, { icon: 'clock', text: 'Điểm mạnh 2' }, { icon: 'qr', text: 'Điểm mạnh 3' }],
      image: 'assets/02-giai-phap.png', title: 'Màn hình chính',
      notes: 'Người nói: Diệu Anh\nMốc giờ: 01:30–02:30 (cứng 02:35)\nV: giải pháp 1 câu\nT: chỉ vào ảnh màn hình chính, nêu 1 điểm UI/UX\nS: {{SO_THAO_TAC_HOAN_THANH}}\nChuyền mic: Em xin gửi Dũng đi vào {{TINH_NANG_NOI_BAT}} và làm thử ngay cho mọi người xem.' },

    { type: 'features', time: '0:45', speaker: 'Vũ Trí Dũng', eyebrow: 'Tính năng',
      title: 'Đủ **5 tính năng** của đề',
      items: [                                                             // [7] 5 tính năng (icon: xem danh sách cuối file)
        { icon: 'form', title: 'Tính năng 1', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'sparkles', title: 'Tính năng 2', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'layout', title: 'Tính năng 3', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'users', title: 'Tính năng 4', desc: 'Mô tả ≤ 15 từ.' },
        { icon: 'list', title: 'Tính năng 5', desc: 'Mô tả ≤ 15 từ.' }
      ],
      notes: 'Người nói: Vũ Trí Dũng\nMốc giờ: 02:30–03:15 (cứng 03:20)\nV: 5 tính năng giải đúng đề\nT: nhấn 1 quy tắc nghiệp vụ\nS: {{SO_TINH_NANG}} tính năng chạy thật\nChuyền mic: —' },

    { type: 'flow', time: '0:40', speaker: 'Vũ Trí Dũng', eyebrow: 'Luồng sử dụng',
      title: 'Từ A đến B trong **4 bước**',
      steps: [
        { icon: 'form', title: 'Bước 1', desc: 'Làm gì' },
        { icon: 'sparkles', title: 'Bước 2', desc: 'Làm gì' },
        { icon: 'layout', title: 'Bước 3', desc: 'Làm gì' },
        { icon: 'qr', title: 'Bước 4', desc: 'Làm gì' }
      ],
      note: 'Dữ liệu lưu ở đâu / điều cần biết (tuỳ chọn).',
      notes: 'Người nói: Vũ Trí Dũng\nMốc giờ: 03:15–03:55 (cứng 04:00)\nV: người dùng đi qua bao nhiêu bước\nT: chỉ đúng các bước trên slide\nS: {{THOI_GIAN_LUONG_CHINH}} từ đầu đến kết quả\nChuyền mic: Giờ mình bấm thật.'
    },

    { type: 'demo', time: '1:15', speaker: 'Vũ Trí Dũng', eyebrow: 'Demo trực tiếp',
      title: 'Đang chạy **ngay bây giờ**',
      image: 'assets/03-demo.png',                                         // ảnh dự phòng khi mất mạng
      iframe: true,                                                        // true = có nút "Chạy trực tiếp" nhúng link live (app phải cho phép iframe)
      caption: 'Kịch bản: **bước 1** → **bước 2** → **bước 3**.',
      notes: 'Người nói: Vũ Trí Dũng\nMốc giờ: 03:55–05:10 (cứng 05:15)\nV: ca bình thường\nT: {{THAO_TAC_1}} → {{THAO_TAC_2}} → {{THAO_TAC_3}}, mỗi thao tác ≤ 25s\nS: kết quả hiện sau {{GIAY_PHAN_HOI}} giây\nChuyền mic: —' },

    { type: 'demo', time: '1:05', speaker: 'Vũ Trí Dũng', eyebrow: 'Demo: ca sai, ca biên, mobile',
      title: 'Nhập sai và ca biên: app **xử lý ra sao**',
      image: 'assets/04-demo-ca-sai.png',                                         // ảnh dự phòng khi mất mạng
      iframe: false,                                                       // true = có nút "Chạy trực tiếp" nhúng link live (app phải cho phép iframe)
      caption: 'Ca nhập sai → báo lỗi ngay · ca biên → xử lý đúng · thu nhỏ 390px, Sáng/Tối.',
      notes: 'Người nói: Vũ Trí Dũng\nMốc giờ: 05:10–06:15 (cứng 06:20)\nV: ca nhập sai + ca biên + mobile\nT: {{CA_SAI}} báo lỗi ngay; {{CA_BIEN}}; thu nhỏ 390px\nS: {{SO_CA_LOI_BAT_DUOC}} ca lỗi bị chặn\nChuyền mic: Phần bên trong chạy thế nào, mình xin nhường Nguyên.' },

    { type: 'ai', time: '1:00', speaker: 'Nguyên', eyebrow: 'AI trong sản phẩm',
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
      notes: 'Người nói: Nguyên\nMốc giờ: 06:15–07:15 (cứng 07:20)\nV: kiến trúc + AI/proxy gọn\nT: chỉ chỗ key không lộ + nhãn mô phỏng nguyên văn\nS: {{SO_MODULE_HOAC_DIEM_AI}}\nChuyền mic: —' },

    { type: 'quality', time: '1:00', speaker: 'Nguyên', eyebrow: 'Kiểm thử',
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
      notes: 'Người nói: Nguyên\nMốc giờ: 07:15–08:15 (cứng 08:20)\nV: kiểm thử + bảo mật\nT: chỉ 1 ca đã bắt lỗi thật\nS: {{SO_CA_DAT}}/{{TONG_CA}} ca đạt; quét key {{KET_QUA_QUET}}\nChuyền mic: —' },

    { type: 'metrics', time: '0:45', speaker: 'Nguyên', eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được**',
      items: [                                                             // [11] 3–4 con số có nguồn
        { value: 5, suffix: ' phút', label: 'Thời gian từ A đến B', sub: 'Nguồn / cách đo' },
        { value: 100, suffix: '%', label: 'Ca kiểm thử đạt', sub: 'Nguồn / cách đo' },
        { value: 12, label: 'Mẫu / dữ liệu', sub: 'Nguồn / cách đo' }
      ],
      note: 'Phần chưa kiểm chứng (nói thẳng).',
      notes: 'Người nói: Nguyên\nMốc giờ: 08:15–09:00 (cứng 09:05)\nV: giá trị đo được\nT: nói thẳng 1 giới hạn + bước tiếp theo\nS: {{SO_GIA_TRI}}\nChuyền mic: —' },

    { type: 'thanks', time: '0:45', speaker: 'Nguyên', eyebrow: 'TÊN APP · Đề X · Bảng Y',
      title: 'Cảm ơn!', subtitle: 'Quét mã để dùng thử.', cta: 'Hỏi đáp',
      qrLabel: 'Quét để dùng thử ngay'                                      // url/video lấy từ meta ở trên
    }
  ]
};
/* Tên icon dùng được: form sparkles wand layout users user qr chart bolt shield clock check x alert globe phone file list
   calendar rocket target heart search edit lock cloud mail star code db arrow image link play money flag bell mic.
   (icon không có trong danh sách sẽ hiện nguyên chữ, ví dụ icon: '1' hoặc '%'.) */
