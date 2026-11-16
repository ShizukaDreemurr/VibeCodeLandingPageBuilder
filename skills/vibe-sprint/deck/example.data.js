/* ============================================================================
   EXAMPLE — bộ slide hoàn chỉnh của Xclipse (Đề 8, Bảng B). Chỉ để tham khảo.
   Mở: deck.html?data=example.data.js     Xuất PDF: node tools/export.cjs example.data.js
   Quy ước chữ:  **đậm**   {{nhấn màu gradient}}   \n = xuống dòng
   ============================================================================ */
window.DECK = {
  meta: {
    app: 'Xclipse',
    title: 'Xclipse · Pitch chung kết',
    footer: '**Xclipse** · Đề 8 · Bảng B',
    accent: '#6A57F2',            // đổi màu chủ đạo theo đề (mặc định tím Lucian)
    accent2: '#2F8FE0',
    liveUrl: 'https://xclipsex.github.io/VibeCodeLandingPageBuilder/',
    videoUrl: 'https://youtu.be/Wjn4xhXQXnc'
  },
  slides: [
    { type: 'cover', time: '0:15',
      app: 'Xclipse',
      tagline: 'Tạo landing page sự kiện trong **5 phút** bằng AI, đủ đăng ký, đếm ngược và QR.',
      de: 'Đề số 8', bang: 'Bảng B · Kinh tế', event: 'Chung kết 60 phút',
      team: 'Xclipse', members: ['Thành viên 1', 'Thành viên 2', 'Thành viên 3'], date: '2026',
      image: 'example/assets/03-thiet-ke-trang.png',
      notes: 'Chào BGK. Bọn em là đội Xclipse, đề 8 bảng B. Trong 60 phút bọn em làm ra công cụ giúp marketer có landing page sự kiện sau đúng 5 phút. Phần trình bày khoảng 6 phút, có demo trực tiếp.' },

    { type: 'problem', time: '0:40',
      eyebrow: 'Vấn đề',
      title: 'Marketer sự kiện **mất nhiều ngày** chỉ để có một trang đăng ký',
      persona: { name: 'Chị Lan', role: 'Marketing quán cà phê, sắp khai trương chi nhánh' },
      pains: [
        'Phải chờ designer, trang xong thì sự kiện còn vài ngày',
        'Danh sách đăng ký rải ở Zalo, inbox và Excel',
        'Không biết còn bao nhiêu chỗ, không có hạn ưu đãi tự động'
      ],
      scenarioLabel: 'Tình huống điển hình',
      scenario: 'Thứ Hai chị Lan cần trang đăng ký cho buổi khai trương **thứ Bảy**. Designer kín lịch, còn chị phải tự gom tên và số điện thoại bằng tay từ tin nhắn.',
      stat: { value: '5 phút', label: 'mục tiêu của Xclipse, từ form thông tin tới trang đăng ký chạy được' },
      notes: 'Persona: marketer của doanh nghiệp nhỏ. Nỗi đau lớn nhất là chờ và gom danh sách thủ công. Đây là tình huống điển hình bọn em dựng từ tìm hiểu người dùng, không phải số liệu khảo sát.' },

    { type: 'solution', time: '0:30',
      eyebrow: 'Giải pháp',
      oneLiner: 'Nhập thông tin một lần, AI viết chữ, ra ngay {{trang đăng ký hoàn chỉnh}}.',
      bullets: [
        { icon: 'wand', text: 'AI viết headline, mô tả, 3 lợi ích' },
        { icon: 'clock', text: 'Đếm ngược tới giờ G, số đăng ký tức thì' },
        { icon: 'qr', text: 'Chia sẻ bằng link hoặc mã QR' }
      ],
      image: 'example/assets/03-thiet-ke-trang.png', title: 'Màn hình thiết kế trang',
      notes: 'Một câu: nhập thông tin sự kiện, AI chỉ viết phần chữ, còn ngày giờ địa điểm luôn lấy đúng từ form. Ảnh bên phải là trình thiết kế sau khi bấm Tạo landing page.' },

    { type: 'features', time: '0:40',
      eyebrow: 'Năm tính năng theo đề',
      title: 'Đủ **5 tính năng** của đề, thêm vài thứ để dùng thật',
      items: [
        { icon: 'form', title: 'Form thông tin sự kiện', desc: 'Tên, thời gian, địa điểm, diễn giả, ưu đãi. Báo lỗi ngay dưới từng ô.' },
        { icon: 'sparkles', title: 'AI viết nội dung', desc: 'Headline, mô tả, 3 lợi ích. Ba chế độ: mô phỏng, Gemini thật, copy prompt.' },
        { icon: 'layout', title: 'Dựng landing page', desc: 'Hero, đếm ngược, diễn giả, agenda, ưu đãi. Sự kiện đã qua không đếm số âm.' },
        { icon: 'users', title: 'Đăng ký thời gian thực', desc: 'Trùng SĐT chỉ tính một lần, hết chỗ vào danh sách chờ, đếm cập nhật tức thì.' },
        { icon: 'list', title: 'Quản lý nhiều sự kiện', desc: 'Tạo trang mới, mở lại, nhân bản. Danh sách khách cho sale, xuất CSV.' }
      ],
      notes: 'Đi nhanh qua năm tính năng đúng theo đề. Nhấn mạnh hai quy tắc nghiệp vụ: trùng số điện thoại và hết chỗ. Phần mở rộng như 172 mẫu, builder, biểu đồ để hỏi đáp.' },

    { type: 'flow', time: '0:30',
      eyebrow: 'Luồng sử dụng',
      title: 'Từ ý tưởng đến người đăng ký trong **4 bước**',
      steps: [
        { icon: 'form', title: 'Nhập thông tin', desc: 'Tên, giờ, địa điểm, diễn giả' },
        { icon: 'sparkles', title: 'AI viết nội dung', desc: 'Headline, mô tả, 3 lợi ích' },
        { icon: 'layout', title: 'Tạo & chỉnh trang', desc: 'Chọn mẫu, màu, bố cục' },
        { icon: 'qr', title: 'Chia sẻ & thu lead', desc: 'Link hoặc QR, khách đăng ký' }
      ],
      note: 'Dữ liệu chưa xuất bản lưu trên trình duyệt; xuất bản thì dùng Cloud Firestore.',
      notes: 'Bốn bước, mỗi bước một thao tác. Người dùng không cần biết thiết kế hay code.' },

    { type: 'demo', time: '1:30',
      eyebrow: 'Demo trực tiếp',
      title: 'Landing page thật, đang chạy **ngay bây giờ**',
      url: 'https://xclipsex.github.io/VibeCodeLandingPageBuilder/',
      image: 'example/assets/04-landing-page.png', iframe: true,
      qrLabel: 'Quét để dùng thử',
      caption: 'Kịch bản: **điền dữ liệu mẫu** → **Tạo landing page** → đăng ký thử → thấy số đăng ký tăng.',
      notes: 'DEMO (1 phút 30): 1) Tab Thông tin, bấm Điền dữ liệu mẫu. 2) Bấm Tạo landing page, chỉ AI mô phỏng và dòng cảnh báo. 3) Mở trang công khai, đăng ký bằng số điện thoại, số đếm tăng. 4) Đăng ký lại cùng số để cho thấy báo trùng. Nếu mạng lỗi: dùng ảnh trên slide hoặc video youtu.be/Wjn4xhXQXnc.' },

    { type: 'ai', time: '0:50',
      eyebrow: 'AI trong sản phẩm',
      title: 'AI **chỉ viết chữ**, mọi dữ kiện lấy từ form',
      realTitle: 'AI thật', real: [
        'Gemini API do người dùng tự nhập key',
        'Copy prompt sang Claude, ChatGPT hoặc Gemini rồi dán JSON về'
      ],
      mockTitle: 'AI mô phỏng', mock: [
        'Chế độ offline ghép từ công thức copywriting',
        'Luôn hiện cảnh báo "Dữ liệu mô phỏng AI", nhắc đọc lại trước khi xuất bản'
      ],
      controlsTitle: 'Kiểm soát đầu ra', controls: [
        'Prompt cấm bịa ngày giờ, địa điểm, giá, tên người',
        'Key chỉ lưu ở trình duyệt, không có trong mã nguồn',
        'Tách JSON, sửa lỗi JSON thường gặp, kiểm tra đủ trường'
      ],
      pipeline: {
        steps: [
          { label: 'Prompt', sub: 'dữ kiện từ form' },
          { label: 'Gọi AI', sub: 'Gemini / dán tay', kind: 'key' },
          { label: 'Kiểm tra', sub: 'JSON, đủ trường, độ dài', kind: 'key' },
          { label: 'Hiển thị', sub: 'cho người dùng sửa', kind: 'ok' }
        ],
        fallbackAt: 2, fallbackLabel: 'lỗi hoặc thiếu trường',
        fallback: { label: 'Bù bằng bản mô phỏng', sub: 'và báo rõ cho người dùng' }
      },
      notes: 'Nói thật: ở bản demo, AI mặc định là chế độ mô phỏng; Gemini thật cần key của người dùng và nhóm chưa gọi được Gemini thật trong môi trường dev vì không có key. Điểm mạnh là kiểm soát: prompt cấm bịa, kết quả luôn được kiểm tra, thiếu thì bù và báo. Ca TC09 kiểm chứng điều này.' },

    { type: 'quality', time: '0:40',
      eyebrow: 'Kiểm thử',
      title: 'Kiểm thử bằng **trình duyệt thật**, đủ 3 loại ca',
      rows: [
        { id: 'TC01', kind: 'Bình thường', case: 'Điền dữ liệu mẫu rồi tạo landing page', result: 'Đủ 8 phần, có cảnh báo AI mô phỏng' },
        { id: 'TC02', kind: 'Nhập thiếu', case: 'Để trống tên sự kiện, bấm tạo', result: 'Báo "Vui lòng nhập tên sự kiện.", không tạo trang' },
        { id: 'TC03', kind: 'Nhập sai', case: 'SĐT "12345", email "abc"', result: 'Báo lỗi dưới từng ô, không lưu' },
        { id: 'TC05', kind: 'Biên', case: 'Đăng ký lại cùng số điện thoại', result: 'Báo đã đăng ký, số đếm giữ nguyên' },
        { id: 'TC07', kind: 'Biên', case: 'Sự kiện đã diễn ra', result: 'Hiện "Đã diễn ra", không đếm âm, ẩn form', status: 'warn', label: 'Đạt, 1 lưu ý' },
        { id: 'TC08', kind: 'Biên', case: 'Số chỗ 2, người thứ 3 đăng ký', result: 'Vào danh sách chờ, nút đổi chữ' },
        { id: 'TC09', kind: 'Sự cố AI', case: 'Dán JSON lỗi, thiếu 1 lợi ích', result: 'Đọc được, bù mục thiếu và báo rõ' },
        { id: 'TC14', kind: 'Bảo mật', case: 'Tài khoản lạ đọc danh sách đăng ký', result: 'permission-denied (Firestore rules)' }
      ],
      summary: { value: '15/15', label: 'ca trong bảng kiểm thử đạt, chạy lại 09/11/2026' },
      legend: [
        'Chạy bằng Playwright + Chromium thật',
        'TC07: nút đầu trang vẫn hiện, đã ghi nhận',
        'Thêm 33 ca quy tắc bảo mật Firestore'
      ],
      notes: 'Ba loại ca bắt buộc của bảng B: bình thường, nhập thiếu hoặc sai, biên. Mỗi ca có ảnh minh chứng trong docs/evidence. Nói thẳng TC07 còn một điểm nhỏ: nút Đăng ký ở đầu trang vẫn hiện khi sự kiện đã qua.' },

    { type: 'metrics', time: '0:25',
      eyebrow: 'Tác động',
      title: 'Con số **kiểm chứng được** trong repo',
      items: [
        { prefix: '≤', value: 5, suffix: ' phút', label: 'Từ form đến landing page', sub: 'Mục tiêu của đề, thao tác trong demo' },
        { value: 172, label: 'Mẫu theo ngành', sub: 'Lọc theo ngành, loại sự kiện, mục đích' },
        { value: 15, suffix: '/15', label: 'Ca kiểm thử đạt', sub: 'Bảng kiểm thử, có ảnh minh chứng' },
        { value: 33, label: 'Ca bảo mật Firestore', sub: 'Quy tắc đọc ghi, chống vượt chỗ' }
      ],
      note: 'Chưa kiểm chứng: Gemini API thật và Google Sheet với Apps Script thật (đã nêu rõ trong bảng kiểm thử).',
      notes: 'Chỉ nêu số có trong repo. Nhấn mạnh sự trung thực: phần chưa kiểm chứng được ghi rõ, và là việc đầu tiên trong lộ trình.' },

    { type: 'roadmap', time: '0:20',
      eyebrow: 'Bước tiếp theo',
      title: 'Lộ trình **sau chung kết**',
      items: [
        { when: 'Tuần 1', title: 'Kiểm chứng AI thật', desc: 'Chạy Gemini API với key thật, đo chất lượng nội dung tiếng Việt.', tag: 'Ưu tiên' },
        { when: 'Tuần 2', title: 'Google Sheet thật', desc: 'Đồng bộ đăng ký vào Sheet của ban tổ chức qua Apps Script.' },
        { when: 'Tháng 1', title: 'Nhắc lịch, check-in', desc: 'Email hoặc Zalo nhắc giờ G, quét QR check-in tại cửa.' },
        { when: 'Tháng 2', title: 'Đo hiệu quả chiến dịch', desc: 'Phễu xem trang → bấm đăng ký → tham dự theo từng nguồn.' }
      ],
      notes: 'Bốn bước tiếp theo, bước đầu là đóng nốt hai mục chưa kiểm chứng.' },

    { type: 'team', time: '0:15',
      eyebrow: 'Đội ngũ',
      title: 'Đội **Xclipse**, 60 phút, cùng làm với AI',
      members: [
        { name: 'Thành viên 1', role: 'Sản phẩm & UX', did: 'Chọn bài toán, kịch bản demo, kiểm thử bằng tay trên điện thoại.' },
        { name: 'Thành viên 2', role: 'Prompt & AI', did: 'Thiết kế prompt, kiểm soát đầu ra AI, xử lý ca lỗi.' },
        { name: 'Thành viên 3', role: 'Vibe code & QA', did: 'Cùng AI viết mã, chạy Playwright, sửa lỗi theo ảnh chụp.' }
      ],
      stack: ['HTML / CSS / JS thuần', 'Firebase Firestore', 'Gemini API', 'Claude', 'Playwright', 'GitHub Pages'],
      notes: 'Giới thiệu nhanh vai trò. Thay tên thật của thành viên trong file dữ liệu.' },

    { type: 'thanks', time: '0:15',
      eyebrow: 'Xclipse · Đề 8 · Bảng B',
      title: 'Cảm ơn!',
      subtitle: 'Quét mã để tạo landing page sự kiện đầu tiên của bạn.',
      cta: 'Hỏi đáp',
      url: 'https://xclipsex.github.io/VibeCodeLandingPageBuilder/',
      videoUrl: 'https://youtu.be/Wjn4xhXQXnc',
      qrLabel: 'Quét để dùng thử ngay',
      notes: 'Mời BGK quét QR dùng thử. Chuẩn bị sẵn trả lời: vì sao AI mô phỏng, chống bịa dữ kiện thế nào, quy tắc trùng và hết chỗ.' }
  ]
};
