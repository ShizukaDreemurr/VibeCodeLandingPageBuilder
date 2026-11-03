/*
 * demo-data.js — dữ liệu mẫu cho lần mở đầu tiên (để người chấm xem được ngay, không cần tạo gì).
 * Ghi vào localStorage đúng định dạng thật của app (tiền tố ep_): events, current_id, brands,
 * regs_<id>, metrics_<id>. Mọi mục mẫu có id bắt đầu bằng "demo_" và cờ demo: true để xoá riêng.
 * Chạy TRƯỚC app.js nên app thấy đã có sự kiện và mở thẳng tab "Sự kiện của tôi".
 * Xác định (PRNG có hạt giống): ai mở cũng thấy cùng nội dung; ngày giờ CỐ ĐỊNH (khai trương Mộc Coffee 28/11/2026) để luôn nằm trong tương lai suốt kỳ chấm.
 * Bỏ qua khi: trình duyệt tự động (navigator.webdriver) trừ khi URL có ?demo=1, trang công khai (?e=), đã có dữ liệu.
 */
(function (root) {
  var EP = root.EP = root.EP || {};
  var S = EP.storage;
  var DAY = 86400000;
  var PREFIX = 'demo_';
  var FLAG = 'demo_seeded';
  var VERSION_KEY = 'demo_version';
  var VERSION = '8'; // tăng khi đổi nội dung mẫu: trình duyệt có bản cũ sẽ được nâng cấp
  var MSG = 'Đây là dữ liệu mẫu để bạn xem nhanh. Bấm \'Tạo trang mới\' để làm trang của riêng bạn.';

  // ---------- PRNG ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function wpick(rng, items, weights) {
    var sum = weights.reduce(function (a, b) { return a + b; }, 0), r = rng() * sum;
    for (var i = 0; i < items.length; i++) { r -= weights[i]; if (r < 0) return items[i]; }
    return items[items.length - 1];
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function localStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  // ---------- Họ tên, SĐT, email ----------
  var SURNAMES = ['Nguyễn', 'Nguyễn', 'Nguyễn', 'Nguyễn', 'Trần', 'Trần', 'Lê', 'Lê', 'Phạm', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trương', 'Mai', 'Lương', 'Tạ', 'Cao'];
  var MID_M = ['Văn', 'Hữu', 'Minh', 'Quốc', 'Đức', 'Thanh', 'Anh', 'Gia', 'Hoàng', 'Công', 'Xuân', 'Tuấn'];
  var MID_F = ['Thị', 'Ngọc', 'Thu', 'Khánh', 'Phương', 'Mai', 'Hồng', 'Thanh', 'Bảo', 'Diệu', 'Kim', 'Hải'];
  var GIVEN_M = ['Hùng', 'Dũng', 'Nam', 'Khoa', 'Long', 'Phúc', 'Tuấn', 'Quân', 'Huy', 'Hiếu', 'Sơn', 'Bảo', 'Trung', 'Đạt', 'Khang', 'Thịnh', 'Kiên', 'Việt', 'Tâm', 'Bách', 'Duy', 'Thắng', 'Lâm', 'Hải', 'Nghĩa', 'Đức', 'Vinh', 'Toàn'];
  var GIVEN_F = ['Lan', 'Hương', 'Trang', 'Linh', 'Ngân', 'Thảo', 'Vy', 'Nhi', 'Hà', 'My', 'Quyên', 'Chi', 'Uyên', 'Giang', 'Yến', 'Oanh', 'Phượng', 'Thủy', 'Ánh', 'Diệp', 'Hạnh', 'Trâm', 'Ngọc', 'Châu', 'Mai', 'Nga', 'Thư', 'Hằng'];
  var PREFIXES = ['032', '033', '034', '035', '036', '037', '038', '039', '086', '096', '097', '098', // Viettel
    '081', '082', '083', '084', '085', '088', '091', '094', // VinaPhone
    '070', '076', '077', '078', '079', '089', '090', '093', // MobiFone
    '052', '056', '058', '092']; // Vietnamobile
  var COMPANY_DOMAINS = ['tanphatgroup.vn', 'vinasoft.com.vn', 'saigonlogistics.vn', 'hoangminh-jsc.vn', 'bluelotus.com.vn'];

  function ascii(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function makePerson(rng) {
    var female = rng() < 0.56;
    var sur = pick(rng, SURNAMES);
    var given = pick(rng, female ? GIVEN_F : GIVEN_M);
    var mid = rng() < 0.85 ? pick(rng, female ? MID_F : MID_M) : '';
    var name = [sur, mid, given].filter(Boolean).join(' ');
    var f = ascii(given), s = ascii(sur), m = mid ? ascii(mid)[0] : '';
    var yy = 82 + Math.floor(rng() * 24), dd = 1 + Math.floor(rng() * 28);
    var local = [f + '.' + s, f + s + pad(dd), s + f + yy, f + m + dd + pad(Math.floor(rng() * 12) + 1), f + (1985 + Math.floor(rng() * 20)), s + '.' + f + (m ? '.' + m : '')][Math.floor(rng() * 6)];
    var dom = wpick(rng, ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company'], [74, 8, 7, 3, 8]);
    if (dom === 'company') dom = pick(rng, COMPANY_DOMAINS);
    var digits = '';
    for (var i = 0; i < 7; i++) digits += Math.floor(rng() * 10);
    return { name: name, email: local + '@' + dom, phone: pick(rng, PREFIXES) + digits };
  }

  // Thời điểm đăng ký: dồn nhiều lúc mở bán và lúc gần hạn, giờ hành chính + tối
  var HOUR_W = [1, 1, 1, 1, 1, 1, 2, 3, 6, 10, 11, 9, 6, 7, 10, 10, 8, 7, 6, 8, 11, 10, 6, 3];
  function hourPick(rng) { return wpick(rng, HOUR_W.map(function (_, i) { return i; }), HOUR_W); }
  function expo(rng) { return Math.min(1, -Math.log(1 - rng() * 0.98) * 0.16); }
  function makeTime(rng, from, to) {
    var r = rng(), x = r < 0.45 ? expo(rng) : r < 0.8 ? 1 - expo(rng) : rng();
    var d = new Date(from + x * (to - from));
    d.setHours(hourPick(rng), Math.floor(rng() * 60), Math.floor(rng() * 60), 0);
    if (d.getTime() > to) d = new Date(d.getTime() - DAY);
    if (d.getTime() < from) d = new Date(from + rng() * (to - from));
    return d;
  }

  // ---------- Brand DNA ----------
  var BRANDS = [
    { id: 'demo_brand_techup', name: 'TechUp Academy', tagline: 'Học thật, làm được, đi làm ngay',
      primary: '#1e3a8a', accent: '#c2410c', textColor: '#0f172a', bgColor: '#ffffff',
      headingFont: 'Montserrat', bodyFont: 'Be Vietnam Pro', button: 'solid', radius: 'soft', tone: 'young',
      voiceUse: 'thực chiến, làm ngay, lộ trình rõ ràng, đồng hành', voiceAvoid: 'cam kết 100%, siêu hot, học là giàu, bí kíp',
      audience: 'Nhân viên marketing, chủ shop online và sinh viên năm cuối muốn ứng dụng AI vào công việc.',
      ctaText: 'Giữ chỗ ngay', hotline: '1900 6868', website: 'https://techup-academy.example.com', fanpage: 'https://facebook.com/techup.academy.demo' },
    { id: 'demo_brand_moc', name: 'Mộc Coffee', tagline: 'Một ly cà phê, một câu chuyện',
      primary: '#5b3a29', accent: '#b45309', textColor: '#2d1b12', bgColor: '#fffaf3',
      headingFont: 'Lora', bodyFont: 'Nunito', button: 'pill', radius: 'round', tone: 'young',
      voiceUse: 'ấm áp, mộc mạc, hạt cà phê, góc nhỏ bình yên', voiceAvoid: 'rẻ nhất, khuyến mãi sốc, cực kỳ hot',
      audience: 'Dân văn phòng và sinh viên 20–35 tuổi sống quanh khu vực chi nhánh, thích quán yên tĩnh để làm việc và gặp bạn.',
      ctaText: 'Đăng ký nhận quà', hotline: '1900 7979', website: 'https://moc-coffee.example.com', fanpage: 'https://facebook.com/moc.coffee.demo' },
    { id: 'demo_brand_anhduong', name: 'Ánh Dương Wedding Studio', tagline: 'Lưu giữ ngày đẹp nhất của bạn',
      primary: '#831843', accent: '#a16207', textColor: '#3b1f2b', bgColor: '#fff8f5',
      headingFont: 'Playfair Display', bodyFont: 'Lora', button: 'pill', radius: 'soft', tone: 'formal',
      voiceUse: 'trân trọng, ấm cúng, khoảnh khắc, kỷ niệm', voiceAvoid: 'giá sốc, chốt đơn, khuyến mại lớn',
      audience: 'Cặp đôi chuẩn bị cưới trong 3–12 tháng tới và gia đình hai bên, ưu tiên phong cách tự nhiên, nhẹ nhàng.',
      ctaText: 'Xác nhận tham dự', hotline: '1900 8686', website: 'https://anhduong-studio.example.com', fanpage: 'https://facebook.com/anhduong.studio.demo' }
  ];

  // ---------- Sự kiện ----------
  // opt: các khối thêm hiển thị (faq, testimonials, sponsors, map, cta2)
  function sections(opt) {
    var order = ['countdown', 'about', 'benefits', 'speakers', 'gallery', 'agenda', 'offer', 'testimonials', 'faq', 'sponsors', 'map', 'cta2', 'register'];
    return order.map(function (k) {
      var optional = ['testimonials', 'faq', 'sponsors', 'map', 'cta2'].indexOf(k) >= 0;
      return { key: k, visible: k === 'gallery' ? opt.indexOf('gallery') >= 0 : (optional ? opt.indexOf(k) >= 0 : true) };
    });
  }

  var SPECS = [
    { key: 'ai', templateId: 'tech', brand: 'demo_brand_techup', date: '2026-12-05T09:00', ebUntil: '2026-11-30T23:59', launch: '2026-10-20T08:00', tone: 'young',
      name: 'Workshop AI Marketing 2026', location: 'Hội trường Lotus, 12 Duy Tân, Cầu Giấy, Hà Nội', capacity: 150,
      speakers: [{ name: 'Nguyễn Hoài Nam', title: 'Head of Growth, startup thương mại điện tử' }, { name: 'Lê Thu Phương', title: 'Chuyên gia nội dung AI, 8 năm làm agency' }, { name: 'Trần Quang Vinh', title: 'Data Lead, nền tảng quảng cáo số' }],
      agenda: [['08:30', 'Check-in, nhận bộ tài liệu và ly cà phê đầu ngày'], ['09:00', 'Mở màn: 5 việc nên giao cho AI, 3 việc đừng bao giờ'], ['09:30', 'Viết nội dung có kiểm duyệt: giữ giọng thương hiệu ngay từ bản nháp'], ['10:30', 'Giải lao, làm quen người cùng nghề'], ['10:45', 'Thực hành: dựng chiến dịch 7 ngày từ bộ prompt mẫu'], ['11:45', 'Hỏi đáp và mang tài liệu về']],
      earlyBird: 'Giảm 30% học phí cho 50 người đăng ký đầu tiên',
      texts: { 'offer.title': 'Giảm 30% cho 50 người đến trước', 'register.title': 'Giữ chỗ trong 30 giây', 'benefits.title': 'Bạn mang gì về sau buổi sáng này?', 'about.title': 'Vì sao bài AI viết vẫn "nghe như robot"?' },
      content: {
        headline: 'Chỉ 45 phút để dựng xong kế hoạch marketing 7 ngày cùng AI',
        description: 'AI viết bài nhanh, nhưng bài ra vẫn nghe như robot và bạn lại mất cả buổi ngồi sửa. Sáng nay, 3 người đang làm nghề chỉ bạn cách giao đúng việc cho AI mà vẫn giữ giọng thương hiệu. Bạn thực hành trên bài toán của chính mình và về nhà với bộ prompt chạy được từ thứ Hai.',
        benefits: ['Rời phòng với kế hoạch chiến dịch 7 ngày của riêng bạn, dựng trong 45 phút thực hành', 'Bộ 30 prompt đã kiểm chứng: mở file, dán, chạy, bớt gần nửa buổi viết nội dung mỗi tuần', 'Hỏi thẳng 3 người đang làm nghề về đúng tình huống của bạn, không lý thuyết suông'] },
      seo: { title: 'Workshop AI Marketing 2026 – TechUp Academy', description: 'Một buổi sáng thực hành dựng kế hoạch marketing 7 ngày với AI, mang về 30 prompt dùng ngay. 150 chỗ tại Cầu Giấy, giảm 30% cho 50 người đầu tiên.' },
      secs: ['testimonials', 'faq', 'map'],
      faq: [['Chưa dùng AI bao giờ thì có theo kịp không?', 'Có. Chúng mình bắt đầu từ thao tác đầu tiên và mỗi bài thực hành đều có mẫu để làm theo. Người chưa dùng AI vẫn ra về với một kế hoạch hoàn chỉnh.'], ['Có cần mang laptop không?', 'Nên mang. Mỗi bàn có ổ cắm và wifi riêng nên bạn khỏi lo hết pin giữa buổi.'], ['Học phí và thanh toán thế nào?', 'Bạn đăng ký trước, chưa phải trả tiền. Ban tổ chức gọi xác nhận trong 24 giờ và gửi hướng dẫn thanh toán. Suất giảm 30% được giữ đến hết 30/11.']],
      quotes: [['“Mình áp dụng bộ prompt vào kế hoạch tuần sau và tiết kiệm gần nửa ngày viết bài.”', 'Thu Hà · Marketing Manager, học viên khoá trước'], ['“Diễn giả nói thẳng việc nào giao cho AI, việc nào phải tự làm. Nghe là áp dụng được.”', 'Quốc Bảo · chủ shop online, học viên khoá trước']],
      regs: 105, sheet: false, funnel: 11 },
    { key: 'coffee', templateId: 'fnb', pics: { hero: 'hero', about: 'about', offer: 'gift', gallery: ['opening', 'barista', 'tasting', 'beans', 'acoustic'] }, brand: 'demo_brand_moc', date: '2026-11-28T08:00', ebUntil: '2026-11-26T23:59', launch: '2026-10-20T08:00', tone: 'young',
      name: 'Khai trương Mộc Coffee Hồ Tây', location: '25 Quảng An, Tây Hồ, Hà Nội', capacity: 200,
      speakers: [{ name: 'Barista Minh Khôi', title: 'Quán quân Barista Hà Nội 2025, 9 năm pha chế' }, { name: 'Nguyễn Hà My', title: 'Nhà sáng lập, tự chọn từng mẻ hạt của Mộc' }, { name: 'Đức Anh', title: 'Ca sĩ acoustic, ban nhạc Chiều Hồ Tây' }],
      agenda: [['08:00', 'Cắt băng và mời ly đầu tiên trong ngày'], ['08:30', 'Mua 1 tặng 1 toàn menu đến 11:00, rủ cả team đi cùng'], ['10:00', 'Barista Minh Khôi dạy pha phin: tự tay pha, mang ly mình pha về bàn'], ['14:00', 'Bịt mắt nếm thử 3 loại hạt cà phê, xem bạn hợp với loại nào nhất'], ['17:00', 'Giờ vàng: 100 khách đầu tiên nhận gói hạt rang mang về'], ['19:00', 'Nhạc acoustic bên hồ, hồ lên đèn']],
      earlyBird: 'Ly signature (giá 55.000đ) mời miễn phí cho 200 khách đăng ký đầu tiên. Đến quầy, đọc số điện thoại đã đăng ký là nhận ly.',
      texts: {
        'hero.eyebrow': 'Khai trương chi nhánh thứ hai của Mộc',
        'countdown.title': 'Còn bao lâu đến ly cà phê đầu tiên?',
        'about.title': '☕ Mộc có một góc mới bên Hồ Tây, hẹn bạn sáng thứ Bảy này.',
        'benefits.title': 'Sáng 28/11, bạn mang về gì?',
        'speakers.title': 'Những người đứng sau ly cà phê',
        'agenda.title': 'Một ngày ở Mộc Hồ Tây',
        'offer.title': 'Ly signature đầu tiên, mời bạn',
        'register.title': 'Giữ phần cà phê của bạn',
        'form.submit': 'Giữ ly miễn phí cho tôi',
        'faq.title': 'Trước khi đăng ký, bạn có thể đang băn khoăn',
        'testimonials.title': 'Khách quen Mộc Cầu Giấy nói gì',
        'cta2.title': 'Còn {con_cho} ly signature chưa có tên',
        'cta2.text': 'Đã có {so_dang_ky} người giữ phần. Cửa quán mở sau {dem_nguoc} ngày nữa, 8:00 sáng thứ Bảy 28/11. Đủ 200 người là chúng mình dừng tặng, bạn đăng ký trước 26/11 để chắc phần.',
        'cta2.btn': 'Giữ ly của tôi'
      },
      content: {
        headline: 'Mộc Hồ Tây TẶNG MIỄN PHÍ 200 ly cà phê cho những khách hàng ĐẦU TIÊN!',
        description: 'Sau hai năm ở Cầu Giấy, Mộc mang câu chuyện cà phê của mình đến một nơi có thêm gió hồ, khoảng trời rộng và những buổi sáng thật chậm. Vẫn là hương cà phê được rang ngay tại quầy, thơm nức mỗi sớm mai. Chỉ khác là lần này, bạn có thể nhâm nhi một ly cà phê yêu thích bên Hồ Tây. 📍 8:00 sáng, thứ Bảy ngày 28/11, Mộc chính thức khai trương và dành tặng 1 ly cà phê signature cho 200 khách đầu tiên ghé thăm. Bạn chỉ mất khoảng 30 giây để đăng ký trước. Đến quán, đọc số điện thoại là có thể nhận quà. Một góc mới đã sẵn sàng. Còn bạn, mình hẹn nhau sáng thứ Bảy nhé! 🤎',
        // Đoạn giới thiệu chia đoạn (xuống dòng) bằng chữ có định dạng
        descriptionHtml: 'Sau hai năm ở Cầu Giấy, Mộc mang câu chuyện cà phê của mình đến một nơi có thêm gió hồ, khoảng trời rộng và những buổi sáng thật chậm.<br><br>Vẫn là hương cà phê được rang ngay tại quầy, thơm nức mỗi sớm mai. Chỉ khác là lần này, bạn có thể nhâm nhi một ly cà phê yêu thích bên Hồ Tây.<br><br>📍 8:00 sáng, thứ Bảy ngày 28/11, Mộc chính thức khai trương và dành tặng 1 ly cà phê signature cho 200 khách đầu tiên ghé thăm.<br><br>Bạn chỉ mất khoảng 30 giây để đăng ký trước. Đến quán, đọc số điện thoại là có thể nhận quà.<br><br>Một góc mới đã sẵn sàng. Còn bạn, mình hẹn nhau sáng thứ Bảy nhé! 🤎',
        benefits: ['Ly signature đầu tiên do chúng mình mời: béo dịu, hậu ngọt, thơm mùi hạt vừa rang sáng nay', 'Ngồi cạnh barista Minh Khôi, tự tay pha phin và nếm thử 3 loại hạt: Cầu Đất, Buôn Ma Thuột, Sơn La', 'Có ngay một góc quen nhìn ra Hồ Tây: ổ cắm, wifi, ghế êm, tối thứ Bảy có nhạc acoustic'] },
      seo: { title: 'Khai trương Mộc Coffee Hồ Tây – Ly signature miễn phí', description: 'Sáng thứ Bảy 28/11, Mộc Coffee Hồ Tây khai trương. 200 khách đăng ký đầu tiên nhận ly signature miễn phí, mua 1 tặng 1 đến 11:00, workshop pha phin và nhạc acoustic.', ogTitle: 'Mộc Hồ Tây khai trương – tặng 200 ly signature miễn phí', ogDescription: 'Đăng ký 30 giây, nhận ly cà phê signature bên Hồ Tây sáng thứ Bảy 28/11.', image: 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/assets/demo/moc-hero.webp' },
      secs: ['testimonials', 'faq', 'cta2'],
      faq: [['Đăng ký rồi có phải đến đúng 8:00 không?', 'Không. Bạn ghé lúc nào trong ngày 28/11 cũng được. Đến quầy đọc số điện thoại đã đăng ký là nhận ly. Quà dành cho 200 người đăng ký đầu tiên nên bạn đăng ký sớm cho chắc phần.'], ['Tôi đi một mình thì có ngại không?', 'Nhiều khách quen của Mộc đi một mình với cái laptop. Dọc cửa sổ có ổ cắm ở mọi bàn và wifi miễn phí, bạn cứ ngồi lâu.'], ['Gửi xe ở đâu?', 'Bãi xe máy miễn phí ngay trước quán. Ô tô đỗ ở khu cách quán 50 m.'], ['Mang thú cưng được không?', 'Khu sân vườn đón thú cưng nhỏ có dây dắt. Khu trong nhà chưa nhận.']],
      quotes: [['“Mình ngồi làm ở Mộc Cầu Giấy hai năm vì ly bạc xỉu ở đây chưa bao giờ bị loãng.”', 'Thu Trang · nhân viên thiết kế, khách quen Cầu Giấy'], ['“Sáng nào cũng ghé lấy ly phin mang lên văn phòng. Nghe có chi nhánh gần nhà là đăng ký liền.”', 'Anh Tuấn · kế toán, khách quen Cầu Giấy']],
      regs: 64, funnel: 12 },
    { key: 'edu', templateId: 'edu', brand: '', date: '2026-12-12T14:00', ebUntil: '2026-12-05T23:59', launch: '2026-10-20T08:00', tone: 'formal',
      name: 'Hội thảo Định hướng Du học Úc & Canada 2027', location: 'Saigon Learning Hub, 88 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', capacity: 120,
      speakers: [{ name: 'ThS. Lê Minh Châu', title: 'Chuyên gia tư vấn du học, 12 năm kinh nghiệm' }, { name: 'Phạm Quỳnh Anh', title: 'Cựu sinh viên học bổng toàn phần tại Melbourne' }, { name: 'Ông David Nguyễn', title: 'Đại diện tuyển sinh khu vực Canada' }],
      agenda: [['14:00', 'Đón tiếp, nhận bộ tài liệu theo từng quốc gia'], ['14:30', 'Úc hay Canada: ngành nào đang mở rộng cửa năm 2027'], ['15:15', 'Quỳnh Anh kể cách làm hồ sơ học bổng toàn phần'], ['16:00', 'Giải lao, hỏi nhanh tại các gian tư vấn'], ['16:20', 'Chi phí thật, visa và lộ trình hồ sơ 12 tháng'], ['17:00', 'Ngồi riêng với chuyên gia theo hồ sơ của con bạn']],
      earlyBird: 'Tặng bộ hồ sơ học bổng mẫu cho 100 gia đình đăng ký sớm',
      texts: { 'offer.title': 'Bộ hồ sơ học bổng mẫu, tặng 100 gia đình', 'register.title': 'Giữ chỗ miễn phí cho gia đình bạn' },
      content: {
        headline: 'Du học Úc hay Canada? Chốt trong một buổi chiều',
        description: 'Chọn sai nước, sai ngân sách là điều tốn kém nhất của mùa du học. Chiều 12/12, bạn nghe thẳng từ chuyên gia tư vấn 12 năm, một cựu sinh viên học bổng toàn phần và đại diện tuyển sinh Canada. Có tư vấn riêng theo hồ sơ, không bán khoá học tại chỗ.',
        benefits: ['Về nhà với bảng mốc thời gian, điểm số và chứng chỉ cho từng nước, không còn lo trễ hạn', 'Nghe Quỳnh Anh kể từng bước làm hồ sơ học bổng toàn phần Melbourne, bước nào làm trước', 'Ngồi riêng với chuyên gia để chốt ngân sách, visa và phương án dự phòng cho hồ sơ của con bạn'] },
      seo: { title: 'Hội thảo Du học Úc & Canada 2027 tại TP.HCM', description: 'Hội thảo miễn phí chiều 12/12 tại Quận 3: lộ trình, học bổng, chi phí du học Úc và Canada 2027, có tư vấn riêng theo hồ sơ. 120 chỗ.' },
      secs: ['testimonials', 'faq', 'sponsors'],
      faq: [['Hội thảo có thu phí không?', 'Không. Bạn chỉ cần đăng ký trước để ban tổ chức chuẩn bị chỗ ngồi và tài liệu.'], ['Con mới học lớp 10, 11 có nên đi không?', 'Nên. Biết sớm cần môn nào, chứng chỉ nào giúp con chuẩn bị từ bây giờ thay vì chạy nước rút năm lớp 12.'], ['Phụ huynh đi một mình được không?', 'Được. Mỗi gia đình đăng ký một suất, đi cùng con hoặc đi riêng đều được.']],
      quotes: [['“Con mình xác định được ngành và trường chỉ sau một buổi, đỡ cả tháng tìm hiểu.”', 'Chị Thu Hằng · phụ huynh khoá trước'], ['“Phần chia sẻ hồ sơ học bổng rất chi tiết, mình chỉnh lại bài luận ngay hôm sau.”', 'Gia Bảo · du học sinh Úc']],
      sponsorNames: ['Đại học Melbourne (mẫu)', 'Hiệp hội Du học Việt Nam (mẫu)', 'Ngân hàng An Bình (mẫu)', 'Hội đồng Anh (mẫu)'],
      regs: 112, funnel: 9 },
    { key: 'beauty', templateId: 'beauty', brand: '', date: '2026-12-02T15:00', ebUntil: '2026-11-25T23:59', launch: '2026-10-20T08:00', tone: 'formal',
      name: 'Workshop Chăm sóc da mùa hanh khô', location: 'Lumi Skin Studio, 42 Lê Lợi, Quận 1, TP.HCM', capacity: 40,
      speakers: [{ name: 'BS. Hoàng Yến', title: 'Bác sĩ da liễu, 10 năm khám và điều trị' }, { name: 'Ngô Bảo Trân', title: 'Chuyên viên chăm sóc da, Lumi Skin Studio' }],
      agenda: [['15:00', 'Check-in, tách trà thảo mộc ấm'], ['15:30', 'Vì sao da bạn bong dù đã thoa kem dày'], ['16:15', 'Quy trình 5 bước gọn, đúng thứ tự'], ['17:00', 'Nằm thử liệu trình phục hồi mẫu'], ['17:45', 'Hỏi đáp riêng và nhận quà']],
      earlyBird: 'Voucher 300.000đ cho 20 khách đăng ký đầu tiên',
      texts: { 'offer.title': 'Voucher 300.000đ cho 20 người đầu tiên', 'register.title': 'Vào danh sách chờ' },
      content: {
        headline: 'Da khô mãi không khỏi? Một buổi chiều để tìm ra nguyên nhân',
        description: 'Trời hanh, da căng rát, bong từng mảng, thoa kem dày hơn mà vẫn không đỡ. Thường là lớp màng bảo vệ da đang yếu, không phải thiếu kem. Bác sĩ da liễu sẽ soi da cho từng người, trong nhóm tối đa 40 khách để ai cũng được hỏi.',
        benefits: ['Được soi da miễn phí, biết da đang thiếu nước hay thiếu dầu trước khi mua thêm món nào', 'Ra về với quy trình 5 bước gọn, đúng thứ tự, khỏi lo mua trùng công dụng', 'Thử liệu trình phục hồi mẫu trong phòng riêng yên tĩnh, kèm tách trà thảo mộc ấm'] },
      seo: { title: 'Workshop Chăm sóc da mùa hanh khô – Lumi Skin Studio', description: 'Workshop 40 chỗ cùng bác sĩ da liễu: soi da miễn phí, quy trình 5 bước và liệu trình phục hồi mẫu tại Quận 1, TP.HCM. Đã hết chỗ, vào danh sách chờ.' },
      secs: ['testimonials', 'faq'],
      faq: [['Đã hết chỗ thì tôi làm sao?', 'Bạn đăng ký vào danh sách chờ. Khi có người huỷ, ban tổ chức gọi báo theo thứ tự đăng ký, thường trước buổi 1 đến 2 ngày.'], ['Da nhạy cảm có tham gia được không?', 'Được. Bác sĩ tư vấn riêng cho da nhạy cảm và chỉ làm mẫu trên sản phẩm dịu nhẹ.'], ['Tôi cần chuẩn bị gì?', 'Đến với làn da sạch, không trang điểm đậm để soi da chính xác hơn.']],
      quotes: [['“Lần đầu có người giải thích vì sao da mình bong dù đã dùng rất nhiều kem.”', 'Khánh Linh · khách workshop trước'], ['“Không ai ép mua gì. Trà chiều và quà tặng chu đáo hơn mình nghĩ.”', 'Phương Thảo · khách workshop trước']],
      regs: 54, funnel: 10 },
    { key: 'wedding', templateId: 'wedding', brand: 'demo_brand_anhduong', date: '2026-12-20T11:00', ebUntil: '', launch: '2026-10-20T08:00', tone: 'formal',
      name: 'Lễ cưới Minh Anh & Hoàng Nam', location: 'Trung tâm Tiệc cưới Riverside, 286 Nguyễn Văn Cừ, Long Biên, Hà Nội', capacity: 150,
      speakers: [{ name: 'Nguyễn Minh Anh', title: 'Cô dâu' }, { name: 'Trần Hoàng Nam', title: 'Chú rể' }],
      agenda: [['10:30', 'Đón khách, chụp ảnh cùng cô dâu chú rể'], ['11:00', 'Lễ thành hôn'], ['11:45', 'Khai tiệc'], ['13:30', 'Cắt bánh và nâng ly'], ['14:00', 'Ảnh gia đình và lưu bút']],
      earlyBird: 'Sự có mặt của bạn là món quà lớn nhất của gia đình chúng mình',
      studioName: 'Ánh Dương Wedding Studio', studioUrl: 'https://anhduong-studio.example.com',
      texts: { 'offer.title': 'Lời nhắn từ gia đình', 'register.title': 'Báo cho chúng mình biết bạn sẽ đến' },
      content: {
        headline: 'Minh Anh & Hoàng Nam cưới rồi, mời bạn đến chung vui',
        description: 'Sau nhiều năm bên nhau, chúng mình quyết định về chung một nhà. Sẽ rất vui nếu hôm đó có bạn ngồi cùng bàn. Bạn báo giúp một tiếng để gia đình sắp chỗ cho chu đáo nhé.',
        benefits: ['Chứng kiến khoảnh khắc hai gia đình chính thức thành một nhà', 'Gặp lại bạn cũ trong bữa trưa ấm cúng, có chỗ ngồi ghi sẵn tên bạn', 'Báo tham dự trong 30 giây, giờ giấc và đường đi nằm sẵn ngay trên thiệp này'] },
      seo: { title: 'Thiệp mời Minh Anh & Hoàng Nam', description: 'Mời bạn dự lễ cưới của Minh Anh & Hoàng Nam, 11:00 ngày 20/12/2026 tại Long Biên, Hà Nội. Bấm để báo tham dự.' },
      secs: ['map', 'faq'],
      faq: [['Tôi có thể đi cùng người thân không?', 'Rất vui nếu được. Bạn ghi số người đi cùng khi xác nhận để gia đình sắp chỗ.'], ['Có chỗ gửi xe không?', 'Trung tâm có hầm gửi ô tô và bãi xe máy miễn phí cho khách mời.'], ['Dress code thế nào?', 'Không bắt buộc. Gam màu pastel nhẹ sẽ rất hợp với không gian buổi tiệc.']],
      quotes: [],
      regs: 86, funnel: 5 },
    { key: 'finance', templateId: 'finance', brand: '', date: '2026-10-25T20:00', ebUntil: '2026-10-20T23:59', launch: '2026-09-25T08:00', tone: 'formal',
      name: 'Webinar Quản lý tài chính cá nhân 2026', location: 'Trực tuyến qua Zoom (gửi link sau khi đăng ký)', capacity: 500,
      speakers: [{ name: 'Đỗ Thanh Tùng', title: 'Chuyên gia hoạch định tài chính cá nhân' }, { name: 'Nguyễn Hải Yến', title: 'Cố vấn đầu tư, 9 năm tại công ty chứng khoán' }],
      agenda: [['20:00', 'Lương về đi đâu: bức tranh tài chính của người đi làm'], ['20:30', 'Chia lương thành các phần và dựng quỹ dự phòng'], ['21:00', 'Bước đầu tư an toàn cho người mới'], ['21:30', 'Hỏi đáp trực tiếp']],
      earlyBird: 'Tặng e-book "Kế hoạch tài chính 12 tháng" cho người đăng ký trước',
      texts: { 'offer.title': 'E-book kế hoạch tài chính 12 tháng' },
      content: {
        headline: 'Lương về là biết rõ từng đồng đi đâu',
        description: 'Webinar 90 phút cho người đi làm muốn hết cảnh cuối tháng hỏi "tiền đi đâu hết". Bạn lập ngân sách, dựng quỹ dự phòng và bắt đầu đầu tư với mức rủi ro vừa phải, trên số liệu thật và bảng tính mẫu dùng được ngay sau buổi.',
        benefits: ['Lập xong bảng ngân sách cá nhân theo quy tắc chia lương dễ nhớ, ngay trong buổi', 'Biết mình cần giữ bao nhiêu tháng chi phí để ngủ ngon khi có biến', 'Nhận bảng tính mẫu và e-book kế hoạch 12 tháng, mở ra là dùng'] },
      seo: { title: 'Webinar Quản lý tài chính cá nhân 2026', description: 'Webinar trực tuyến về ngân sách, quỹ dự phòng và đầu tư cho người mới bắt đầu. Sự kiện đã diễn ra ngày 25/10/2026.' },
      secs: ['testimonials'],
      faq: [], quotes: [['“Bảng tính mẫu rất dễ dùng, tháng này mình đã tách được quỹ dự phòng.”', 'Hoàng Nhi · người tham dự'], ['“Phần hỏi đáp cuối buổi giải đáp đúng thắc mắc về đầu tư của mình.”', 'Minh Tuấn · người tham dự']],
      regs: 118, ended: true, funnel: 12 }
  ];

  function leadFor(rng, recency, ended) {
    if (ended) return wpick(rng, ['won', 'contacted', 'lost', 'new'], [62, 10, 18, 10]);
    var pNew = 0.12 + 0.7 * recency;
    var r = rng();
    if (r < pNew) return 'new';
    return wpick(rng, ['contacted', 'won', 'lost'], [45, 45, 10]);
  }

  function buildRegs(spec, idx, now, startMs, eventId) {
    var rng = mulberry32(7919 * (idx + 1) + 13);
    // Mốc cố định: mở đăng ký từ spec.launch, kết thúc ở min(bây giờ, hạn ưu đãi hoặc giờ diễn ra) nên luôn nằm trong quá khứ
    var deadline = spec.ended ? startMs - 3 * 3600000 : (spec.ebUntil ? new Date(spec.ebUntil).getTime() : startMs);
    var to = Math.min(now.getTime() - 60000, deadline);
    var from = new Date(spec.launch).getTime();
    if (from >= to - DAY) from = to - 7 * DAY; // đồng hồ máy lệch quá xa thì vẫn hợp lệ
    var phones = {}, emails = {}, out = [], times = [];
    while (out.length < spec.regs) {
      var p = makePerson(rng);
      if (phones[p.phone] || emails[p.email]) continue;
      phones[p.phone] = emails[p.email] = true;
      out.push(p);
      times.push(makeTime(rng, from, to).getTime());
    }
    times.sort(function (a, b) { return a - b; });
    return out.map(function (p, i) {
      var waitlist = i >= spec.capacity;
      return {
        id: eventId.replace('demo_evt_', 'demo_reg_') + '_' + (i + 1),
        name: p.name, phone: p.phone, email: p.email,
        status: waitlist ? 'waitlist' : 'new',
        createdAt: new Date(times[i]).toISOString(),
        synced: true,
        leadStatus: leadFor(rng, (i + 1) / out.length, spec.ended)
      };
    });
  }

  // Ảnh minh hoạ (tạo bằng Gemini) nằm trong assets/demo; đường dẫn tuyệt đối để dùng được cả trong url() của CSS
  function demoPics(p) {
    if (!p) return {};
    var abs = function (n) { try { return new URL('assets/demo/moc-' + n + '.webp', document.baseURI).href; } catch (e) { return 'assets/demo/moc-' + n + '.webp'; } };
    return { hero: abs(p.hero), about: abs(p.about), offer: abs(p.offer), gallery: p.gallery.map(abs) };
  }

  function buildEvent(spec, idx, now) {
    var id = PREFIX + 'evt_' + spec.key;
    var texts = {};
    var blocks = {};
    if (spec.secs.indexOf('faq') >= 0 && spec.faq.length) {
      spec.faq.forEach(function (q, i) { texts['faq.q.' + i] = q[0]; texts['faq.a.' + i] = q[1]; });
      blocks.faq = { count: spec.faq.length };
    }
    if (spec.secs.indexOf('testimonials') >= 0 && spec.quotes.length) {
      spec.quotes.forEach(function (q, i) { texts['testimonials.q.' + i] = q[0]; texts['testimonials.by.' + i] = q[1]; });
      blocks.testimonials = { count: spec.quotes.length };
    }
    if (spec.sponsorNames) {
      spec.sponsorNames.forEach(function (n, i) { texts['sponsors.name.' + i] = n; });
      blocks.sponsors = { count: spec.sponsorNames.length };
    }
    Object.keys(spec.texts || {}).forEach(function (k) { texts[k] = spec.texts[k]; });
    var ev = {
      id: id, name: spec.name, startAt: spec.date, location: spec.location, capacity: spec.capacity,
      speakers: spec.speakers,
      agenda: spec.agenda.map(function (a) { return { time: a[0], title: a[1] }; }),
      earlyBird: spec.earlyBird,
      earlyBirdUntil: spec.ebUntil || '',
      sheetUrl: '', templateId: spec.templateId,
      studioName: spec.studioName || '', studioUrl: spec.studioUrl || '',
      images: demoPics(spec.pics), sections: sections(spec.pics ? spec.secs.concat('gallery') : spec.secs), style: null,
      texts: texts, elStyles: null, elStylesBy: null, rich: spec.content.descriptionHtml ? { description: { plain: spec.content.description, html: spec.content.descriptionHtml } } : null,
      blocks: Object.keys(blocks).length ? blocks : null,
      brandId: '', brand: null, seo: spec.seo, published: false, demo: true, demoPublished: true
    };
    var brand = spec.brand && BRANDS.filter(function (b) { return b.id === spec.brand; })[0];
    if (brand && EP.brands && EP.brands.applyTo) EP.brands.applyTo(ev, brand);
    var c = spec.content;
    return {
      event: ev,
      content: { headline: c.headline, description: c.description, benefits: c.benefits, source: 'manual' },
      tone: spec.tone, updatedAt: new Date(now.getTime() - idx * 3600000).toISOString(), demo: true
    };
  }

  function buildMetrics(spec, regs, idx) {
    var rng = mulberry32(104729 * (idx + 3));
    var n = regs.length;
    var views = Math.round(n * (spec.funnel + rng() * 2.5));
    var ctaClicks = Math.max(n + 8, Math.round(n * (2.3 + rng() * 0.9)));
    return { views: views, ctaClicks: ctaClicks, studioClicks: spec.studioName ? Math.round(n * 0.18) : 0, appClicks: Math.round(views * 0.012) + 3 };
  }

  // ---------- Gieo / xoá ----------
  function isDemoId(id) { return String(id || '').indexOf(PREFIX) === 0; }

  function seed() {
    var now = new Date();
    var events = S.read('events', {});
    var brands = S.read('brands', {});
    BRANDS.forEach(function (b) {
      var copy = Object.assign({ logo: '' }, b, { updatedAt: now.toISOString(), demo: true });
      brands[b.id] = copy;
    });
    S.write('brands', brands); // ghi trước để applyTo/ghim thương hiệu dùng được
    SPECS.forEach(function (spec, i) {
      var st = buildEvent(spec, i, now);
      var regs = buildRegs(spec, i, now, new Date(st.event.startAt).getTime(), st.event.id);
      events[st.event.id] = st;
      S.write('regs_' + st.event.id, regs);
      S.write('metrics_' + st.event.id, buildMetrics(spec, regs, i));
    });
    S.write('events', events);
    var cur = S.read('current_id', null);
    if (!cur || isDemoId(cur) || !events[cur]) S.write('current_id', PREFIX + 'evt_' + SPECS[0].key);
    S.write(FLAG, now.toISOString());
    S.write(VERSION_KEY, VERSION);
  }

  function removeDemo() {
    var events = S.read('events', {});
    Object.keys(events).forEach(function (id) {
      if (isDemoId(id) || (events[id] && events[id].demo)) {
        delete events[id];
        S.remove('regs_' + id);
        S.remove('metrics_' + id);
      }
    });
    S.write('events', events);
    var brands = S.read('brands', {});
    Object.keys(brands).forEach(function (id) { if (isDemoId(id) || (brands[id] && brands[id].demo)) delete brands[id]; });
    S.write('brands', brands);
    var cur = S.read('current_id', null);
    if (isDemoId(cur)) S.remove('current_id');
    S.write(FLAG, 'removed');
  }

  function hasDemo() {
    var events = S.read('events', {});
    return Object.keys(events).some(function (id) { return isDemoId(id); });
  }

  function shouldSeed() {
    var q = root.location.search || '';
    if (/[?&]e=/.test(q)) return false;                              // trang công khai của khách
    if (root.navigator && root.navigator.webdriver && !/[?&]demo=1\b/.test(q)) return false; // test tự động
    try {
      if (root.localStorage.getItem('ep_events') !== null) return false;
      if (root.localStorage.getItem('ep_' + FLAG) !== null) return false;
    } catch (e) { return false; }
    return true;
  }

  // Nâng cấp bản mẫu cũ: chỉ thay mục demo_, giữ nguyên dữ liệu của người dùng.
  // Không làm gì nếu người dùng đã xoá dữ liệu mẫu (cờ 'removed' hoặc không còn mục demo_ nào).
  function upgradeIfStale() {
    var q = root.location.search || '';
    if (/[?&]e=/.test(q)) return false;
    try {
      var flag = S.read(FLAG, null);
      if (!flag || flag === 'removed') return false;
      if (S.read(VERSION_KEY, '1') === VERSION) return false;
      if (!hasDemo()) return false;
      removeDemo();
      seed();
      return true;
    } catch (e) { return false; }
  }

  var firstLoad = false;
  if (shouldSeed()) { seed(); firstLoad = true; } else { upgradeIfStale(); }

  // ---------- Giao diện: banner + chân trang ----------
  function reload() { root.location.reload(); }
  function doRestore() {
    var msg = 'Khôi phục dữ liệu mẫu? Các sự kiện, đăng ký và thương hiệu mẫu sẽ được đặt lại như ban đầu. Dữ liệu của bạn không bị ảnh hưởng.';
    root.EP.popup.confirm({ tone: 'warn', title: 'Khôi phục dữ liệu mẫu?', body: msg.replace(/^Khôi phục dữ liệu mẫu\? /, ''), confirmLabel: 'Khôi phục' }).then(function (ok) { if (!ok) return; removeDemo(); seed(); reload(); });
  }
  function doRemove() {
    root.EP.popup.confirm({ tone: 'warn', title: 'Xoá dữ liệu mẫu?', body: 'Chỉ các sự kiện, đăng ký và thương hiệu mẫu bị xoá; dữ liệu của bạn được giữ nguyên.', confirmLabel: 'Xoá dữ liệu mẫu' }).then(function (ok) { if (!ok) return; removeDemo(); reload(); });
  }

  function mkBtn(text, cls, fn, id) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text;
    if (id) b.id = id;
    b.addEventListener('click', fn);
    return b;
  }

  function ui() {
    var grid = document.getElementById('event-grid');
    var dismissed = false;
    try { dismissed = root.localStorage.getItem('ep_demo_banner_off') === '1'; } catch (e) { /* bỏ qua */ }
    if (grid && hasDemo() && !dismissed) {
      var bar = document.createElement('div');
      bar.className = 'demo-banner'; bar.id = 'demo-banner'; bar.setAttribute('role', 'note');
      var t = document.createElement('p'); t.textContent = MSG;
      var acts = document.createElement('div'); acts.className = 'demo-banner-actions';
      acts.appendChild(mkBtn('Xoá dữ liệu mẫu', 'btn btn-ghost btn-small', doRemove, 'demo-remove-2'));
      acts.appendChild(mkBtn('Ẩn', 'btn btn-ghost btn-small', function () {
        try { root.localStorage.setItem('ep_demo_banner_off', '1'); } catch (e) { /* bỏ qua */ }
        bar.remove();
      }, 'demo-dismiss'));
      bar.appendChild(t); bar.appendChild(acts);
      grid.parentNode.insertBefore(bar, grid);
    }
    var meta = document.querySelector('#app-footer .app-footer-meta');
    if (meta) {
      var wrap = document.createElement('span');
      wrap.className = 'demo-footer';
      wrap.appendChild(mkBtn('Khôi phục dữ liệu mẫu', 'demo-link', doRestore, 'demo-restore'));
      wrap.appendChild(document.createTextNode(' · '));
      wrap.appendChild(mkBtn('Xoá dữ liệu mẫu', 'demo-link', doRemove, 'demo-remove'));
      meta.parentNode.insertBefore(wrap, meta);
    }
    if (firstLoad) {
      var tt = document.getElementById('toast');
      if (tt) {
        tt.textContent = MSG; tt.hidden = false;
        setTimeout(function () { if (tt.textContent === MSG) tt.hidden = true; }, 5000);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();

  // Trang mẫu "đã xuất bản sẵn": dựng lại từ dữ liệu đóng gói (không cần máy chủ), ai mở link ?e=<id> cũng xem được
  function publicEvent(id) {
    var now = new Date();
    for (var i = 0; i < SPECS.length; i++) {
      if (PREFIX + 'evt_' + SPECS[i].key !== id) continue;
      var st = buildEvent(SPECS[i], i, now);
      return { event: st.event, content: st.content, regs: buildRegs(SPECS[i], i, now, new Date(st.event.startAt).getTime(), st.event.id) };
    }
    return null;
  }

  EP.demo = { publicEvent: publicEvent, VERSION: VERSION, upgrade: upgradeIfStale, seed: seed, remove: removeDemo, restore: function () { removeDemo(); seed(); }, hasDemo: hasDemo, isDemoId: isDemoId, brands: BRANDS };
})(window);
