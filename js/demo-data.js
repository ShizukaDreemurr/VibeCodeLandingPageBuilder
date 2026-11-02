/*
 * demo-data.js — dữ liệu mẫu cho lần mở đầu tiên (để người chấm xem được ngay, không cần tạo gì).
 * Ghi vào localStorage đúng định dạng thật của app (tiền tố ep_): events, current_id, brands,
 * regs_<id>, metrics_<id>. Mọi mục mẫu có id bắt đầu bằng "demo_" và cờ demo: true để xoá riêng.
 * Chạy TRƯỚC app.js nên app thấy đã có sự kiện và mở thẳng tab "Sự kiện của tôi".
 * Xác định (PRNG có hạt giống): ai mở cũng thấy cùng nội dung; ngày giờ tính theo thời điểm mở lần đầu.
 * Bỏ qua khi: trình duyệt tự động (navigator.webdriver) trừ khi URL có ?demo=1, trang công khai (?e=), đã có dữ liệu.
 */
(function (root) {
  var EP = root.EP = root.EP || {};
  var S = EP.storage;
  var DAY = 86400000;
  var PREFIX = 'demo_';
  var FLAG = 'demo_seeded';
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
  function at(now, days, hour, min) {
    var d = new Date(now.getTime() + days * DAY);
    d.setHours(hour, min || 0, 0, 0);
    return d;
  }

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
      return { key: k, visible: k === 'gallery' ? false : (optional ? opt.indexOf(k) >= 0 : true) };
    });
  }

  var SPECS = [
    { key: 'ai', templateId: 'tech', brand: 'demo_brand_techup', days: 12, hour: 9, tone: 'young',
      name: 'Workshop AI Marketing 2026', location: 'Hội trường Lotus, 12 Duy Tân, Cầu Giấy, Hà Nội', capacity: 150,
      speakers: [{ name: 'Nguyễn Hoài Nam', title: 'Head of Growth, startup thương mại điện tử' }, { name: 'Lê Thu Phương', title: 'Chuyên gia nội dung AI, 8 năm làm agency' }, { name: 'Trần Quang Vinh', title: 'Data Lead, nền tảng quảng cáo số' }],
      agenda: [['08:30', 'Đón khách & check-in'], ['09:00', 'Khai mạc: bức tranh AI trong marketing 2026'], ['09:30', 'Xây quy trình viết nội dung với AI có kiểm duyệt'], ['10:30', 'Giải lao & kết nối'], ['10:45', 'Thực hành: dựng chiến dịch 7 ngày bằng bộ prompt mẫu'], ['11:45', 'Hỏi đáp & nhận bộ tài liệu']],
      earlyBird: 'Giảm 30% học phí cho 50 học viên đăng ký đầu tiên', ebDays: 4,
      content: {
        headline: 'Một buổi sáng, một quy trình marketing chạy cùng AI',
        description: 'Workshop dành cho người làm marketing muốn dùng AI để viết nội dung, lên kế hoạch chiến dịch và đo hiệu quả nhanh hơn mà vẫn giữ giọng thương hiệu. Bạn sẽ thực hành trực tiếp trên bài toán thật và mang về bộ prompt, mẫu kế hoạch dùng được ngay từ thứ Hai.',
        benefits: ['Dựng được kế hoạch chiến dịch 7 ngày chỉ trong 45 phút thực hành', 'Nhận bộ 30 prompt và mẫu quy trình duyệt nội dung đã kiểm chứng', 'Hỏi trực tiếp 3 diễn giả đang làm nghề về những tình huống của riêng bạn'] },
      seo: { title: 'Workshop AI Marketing 2026 – TechUp Academy', description: 'Thực hành dùng AI để viết nội dung và lên kế hoạch chiến dịch trong một buổi sáng tại Hà Nội. Đăng ký giữ chỗ, giảm 30% cho 50 người đầu tiên.' },
      secs: ['testimonials', 'faq', 'map'],
      faq: [['Tôi chưa biết gì về AI có theo kịp không?', 'Có. Buổi học bắt đầu từ thao tác cơ bản và mọi bài thực hành đều có mẫu kèm theo.'], ['Có cần mang laptop không?', 'Nên mang laptop để thực hành. Ban tổ chức có sẵn wifi và ổ cắm tại mỗi bàn.'], ['Học phí và hình thức thanh toán thế nào?', 'Ban tổ chức sẽ gọi xác nhận và gửi hướng dẫn thanh toán sau khi bạn đăng ký. Chưa cần trả tiền ở bước này.']],
      quotes: [['“Mình áp dụng ngay bộ prompt vào kế hoạch tuần sau, tiết kiệm gần nửa ngày viết bài.”', 'Thu Hà · Marketing Manager, khoá trước'], ['“Diễn giả nói thẳng cái gì nên giao cho AI, cái gì phải tự làm. Rất thực tế.”', 'Quốc Bảo · chủ shop online, khoá trước']],
      regs: 105, launchDays: 26, sheet: false, funnel: 11 },
    { key: 'coffee', templateId: 'fnb', brand: 'demo_brand_moc', days: 7, hour: 8, tone: 'young',
      name: 'Khai trương Mộc Coffee chi nhánh Hồ Tây', location: '25 Quảng An, Tây Hồ, Hà Nội', capacity: 200,
      speakers: [{ name: 'Barista Minh Khôi', title: 'Barista trưởng, người pha ly signature' }, { name: 'Nguyễn Hà My', title: 'Nhà sáng lập Mộc Coffee' }, { name: 'Đức Anh', title: 'Ca sĩ acoustic, ban nhạc Chiều Hồ Tây' }],
      agenda: [['08:00', 'Cắt băng khai trương'], ['08:30', 'Mua 1 tặng 1 toàn menu đến 11:00'], ['10:00', 'Workshop pha cà phê phin cùng barista'], ['14:00', 'Thử vị cà phê rang xay (cupping)'], ['17:00', 'Giờ vàng: quà cho 100 khách đầu tiên'], ['19:00', 'Đêm nhạc acoustic bên hồ']],
      earlyBird: 'Tặng 1 ly cà phê signature cho 200 khách đăng ký trước ngày khai trương', ebDays: 5,
      content: {
        headline: 'Mộc Coffee Hồ Tây mở cửa: mời bạn ly cà phê đầu tiên',
        description: 'Sau hai năm ở Cầu Giấy, Mộc Coffee mở thêm góc nhỏ nhìn ra Hồ Tây: nhiều cây xanh, ghế ngồi làm việc thoải mái và hạt cà phê rang tại chỗ. Đăng ký để nhận quà khai trương, gặp barista và nghe nhạc acoustic cùng chúng mình.',
        benefits: ['Mua 1 tặng 1 toàn menu trong buổi sáng khai trương', 'Nhận ngay 1 ly signature miễn phí khi đăng ký trước và đến quán', 'Tham gia workshop pha phin và buổi thử vị cùng barista trưởng'] },
      seo: { title: 'Khai trương Mộc Coffee Hồ Tây – Mua 1 tặng 1', description: 'Mộc Coffee khai trương chi nhánh Hồ Tây: mua 1 tặng 1, workshop pha phin và đêm nhạc acoustic. Đăng ký trước để nhận ly signature miễn phí.' },
      secs: ['faq', 'cta2'],
      faq: [['Đăng ký rồi có bắt buộc đến đúng giờ không?', 'Bạn có thể đến bất cứ lúc nào trong ngày khai trương. Quà tặng nhận tại quầy khi xuất trình số điện thoại đăng ký.'], ['Quán có chỗ gửi xe không?', 'Có bãi xe máy miễn phí ngay trước quán và khu ô tô cách 50 m.'], ['Có mang thú cưng vào được không?', 'Khu sân vườn đón thú cưng nhỏ có dây dắt; khu trong nhà chưa nhận.']],
      quotes: [],
      regs: 64, launchDays: 18, funnel: 12 },
    { key: 'edu', templateId: 'edu', brand: '', days: 16, hour: 14, tone: 'formal',
      name: 'Hội thảo Định hướng Du học Úc & Canada 2027', location: 'Saigon Learning Hub, 88 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', capacity: 120,
      speakers: [{ name: 'ThS. Lê Minh Châu', title: 'Chuyên gia tư vấn du học, 12 năm kinh nghiệm' }, { name: 'Phạm Quỳnh Anh', title: 'Cựu sinh viên học bổng toàn phần tại Melbourne' }, { name: 'Ông David Nguyễn', title: 'Đại diện tuyển sinh khu vực Canada' }],
      agenda: [['14:00', 'Đón tiếp phụ huynh và học sinh'], ['14:30', 'Xu hướng du học Úc và Canada năm 2027'], ['15:15', 'Chia sẻ kinh nghiệm săn học bổng từ cựu sinh viên'], ['16:00', 'Giải lao và tham quan gian tư vấn'], ['16:20', 'Chi phí, visa và lộ trình hồ sơ'], ['17:00', 'Tư vấn riêng 1-1 theo hồ sơ']],
      earlyBird: 'Tặng bộ hồ sơ học bổng mẫu cho 100 gia đình đăng ký sớm', ebDays: 9,
      content: {
        headline: 'Chọn đúng nước, đúng trường, đúng ngân sách trước mùa nộp hồ sơ 2027',
        description: 'Một buổi chiều để phụ huynh và học sinh nắm rõ lộ trình du học Úc và Canada: ngành nào đang có học bổng, cần chuẩn bị gì trong 12 tháng tới và chi phí thực tế ra sao. Chương trình có tư vấn riêng theo từng hồ sơ, không bán khoá học tại chỗ.',
        benefits: ['Biết chính xác mốc thời gian, điểm số và chứng chỉ cần có cho từng quốc gia', 'Nghe cựu sinh viên kể cách chuẩn bị hồ sơ học bổng toàn phần', 'Được tư vấn riêng 1-1 về ngân sách, visa và phương án dự phòng'] },
      seo: { title: 'Hội thảo Du học Úc & Canada 2027 tại TP.HCM', description: 'Hội thảo miễn phí về lộ trình, học bổng và chi phí du học Úc, Canada 2027. Có tư vấn 1-1. Số chỗ có hạn, đăng ký để giữ chỗ.' },
      secs: ['testimonials', 'faq', 'sponsors'],
      faq: [['Hội thảo có thu phí không?', 'Hoàn toàn miễn phí. Bạn chỉ cần đăng ký trước để ban tổ chức chuẩn bị chỗ ngồi và tài liệu.'], ['Học sinh lớp 10, 11 có nên tham dự?', 'Rất nên. Chuẩn bị sớm giúp bạn chọn đúng môn, tích luỹ chứng chỉ và hồ sơ ngoại khoá từ bây giờ.'], ['Phụ huynh đi một mình được không?', 'Được. Mỗi gia đình đăng ký một suất, có thể đi cùng con hoặc đi riêng.']],
      quotes: [['“Con mình xác định được ngành và trường chỉ sau một buổi, tiết kiệm cả tháng tìm hiểu.”', 'Chị Thu Hằng · phụ huynh khoá trước'], ['“Phần chia sẻ hồ sơ học bổng rất chi tiết, mình chỉnh lại bài luận ngay hôm sau.”', 'Gia Bảo · du học sinh Úc']],
      sponsorNames: ['Đại học Melbourne (mẫu)', 'Hiệp hội Du học Việt Nam (mẫu)', 'Ngân hàng An Bình (mẫu)', 'Hội đồng Anh (mẫu)'],
      regs: 112, launchDays: 30, funnel: 9 },
    { key: 'beauty', templateId: 'beauty', brand: '', days: 9, hour: 15, tone: 'formal',
      name: 'Workshop Chăm sóc da mùa hanh khô', location: 'Lumi Skin Studio, 42 Lê Lợi, Quận 1, TP.HCM', capacity: 40,
      speakers: [{ name: 'BS. Hoàng Yến', title: 'Bác sĩ da liễu, 10 năm khám và điều trị' }, { name: 'Ngô Bảo Trân', title: 'Chuyên viên chăm sóc da, Lumi Skin Studio' }],
      agenda: [['15:00', 'Check-in và trà thảo mộc'], ['15:30', 'Hiểu làn da của bạn trong mùa hanh khô'], ['16:15', 'Quy trình skincare tối giản 5 bước'], ['17:00', 'Trải nghiệm liệu trình phục hồi mẫu'], ['17:45', 'Hỏi đáp và nhận quà']],
      earlyBird: 'Tặng voucher 300.000đ cho 20 khách đăng ký đầu tiên', ebDays: 3,
      content: {
        headline: 'Da khô, căng, bong tróc? Một buổi chiều để hiểu và chăm đúng cách',
        description: 'Workshop nhỏ, tối đa 40 khách, để bác sĩ da liễu trò chuyện trực tiếp về lớp màng bảo vệ da, cách chọn sản phẩm và những sai lầm thường gặp khi trời hanh khô. Bạn được soi da miễn phí và trải nghiệm một liệu trình phục hồi mẫu.',
        benefits: ['Được soi da và nhận gợi ý quy trình phù hợp riêng cho làn da của bạn', 'Biết cách chọn và dùng sản phẩm đúng thứ tự, tránh lãng phí', 'Trải nghiệm liệu trình phục hồi mẫu trong không gian riêng tư'] },
      seo: { title: 'Workshop Chăm sóc da mùa hanh khô – Lumi Skin Studio', description: 'Workshop 40 chỗ cùng bác sĩ da liễu: soi da miễn phí, quy trình 5 bước và liệu trình phục hồi mẫu tại Quận 1, TP.HCM. Đã hết chỗ, vào danh sách chờ.' },
      secs: ['testimonials', 'faq'],
      faq: [['Đã hết chỗ thì tôi làm sao?', 'Bạn vẫn có thể đăng ký vào danh sách chờ. Khi có người huỷ, ban tổ chức sẽ gọi báo theo thứ tự đăng ký.'], ['Da nhạy cảm có tham gia được không?', 'Được. Bác sĩ sẽ tư vấn riêng cho da nhạy cảm và chỉ làm mẫu trên sản phẩm dịu nhẹ.'], ['Tôi có cần chuẩn bị gì không?', 'Bạn nên đến với làn da sạch, không trang điểm đậm để soi da chính xác hơn.']],
      quotes: [['“Lần đầu có người giải thích vì sao da mình bong dù đã dùng rất nhiều kem.”', 'Khánh Linh · khách workshop trước'], ['“Không bị ép mua gì, quà tặng và trà chiều rất chu đáo.”', 'Phương Thảo · khách workshop trước']],
      regs: 54, launchDays: 14, funnel: 10 },
    { key: 'wedding', templateId: 'wedding', brand: 'demo_brand_anhduong', days: 38, hour: 11, tone: 'formal',
      name: 'Lễ cưới Minh Anh & Hoàng Nam', location: 'Trung tâm Tiệc cưới Riverside, 286 Nguyễn Văn Cừ, Long Biên, Hà Nội', capacity: 150,
      speakers: [{ name: 'Nguyễn Minh Anh', title: 'Cô dâu' }, { name: 'Trần Hoàng Nam', title: 'Chú rể' }],
      agenda: [['10:30', 'Đón khách'], ['11:00', 'Lễ thành hôn'], ['11:45', 'Khai tiệc'], ['13:30', 'Cắt bánh và chúc rượu'], ['14:00', 'Chụp ảnh lưu niệm cùng gia đình']],
      earlyBird: 'Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng mình', ebDays: 0,
      studioName: 'Ánh Dương Wedding Studio', studioUrl: 'https://anhduong-studio.example.com',
      content: {
        headline: 'Trân trọng kính mời bạn đến chung vui cùng Minh Anh & Hoàng Nam',
        description: 'Sau nhiều năm bên nhau, chúng mình quyết định về chung một nhà. Rất mong được đón bạn tại Riverside để cùng chứng kiến khoảnh khắc ấy. Bạn xác nhận tham dự giúp chúng mình để gia đình chuẩn bị chu đáo nhé.',
        benefits: ['Cùng chứng kiến lễ thành hôn của hai gia đình', 'Gặp lại bạn bè, người thân trong một buổi trưa ấm cúng', 'Xác nhận chỉ mất 30 giây, thông tin giờ giấc luôn có sẵn trên thiệp'] },
      seo: { title: 'Thiệp mời Minh Anh & Hoàng Nam', description: 'Trân trọng kính mời bạn đến dự lễ cưới của Minh Anh & Hoàng Nam tại Long Biên, Hà Nội. Bấm để xác nhận tham dự.' },
      secs: ['map', 'faq'],
      faq: [['Tôi có thể đi cùng người thân không?', 'Rất vui nếu có thể. Bạn hãy ghi rõ số người đi cùng khi gọi xác nhận để gia đình sắp xếp chỗ.'], ['Có chỗ gửi xe không?', 'Trung tâm có hầm gửi xe ô tô và bãi xe máy miễn phí cho khách mời.'], ['Dress code của buổi tiệc?', 'Không bắt buộc. Gam màu pastel nhẹ nhàng sẽ rất hợp với không gian buổi tiệc.']],
      quotes: [],
      regs: 86, launchDays: 32, funnel: 5 },
    { key: 'finance', templateId: 'finance', brand: '', days: -6, hour: 20, tone: 'formal',
      name: 'Webinar Quản lý tài chính cá nhân 2026', location: 'Trực tuyến qua Zoom (gửi link sau khi đăng ký)', capacity: 500,
      speakers: [{ name: 'Đỗ Thanh Tùng', title: 'Chuyên gia hoạch định tài chính cá nhân' }, { name: 'Nguyễn Hải Yến', title: 'Cố vấn đầu tư, 9 năm tại công ty chứng khoán' }],
      agenda: [['20:00', 'Bức tranh tài chính cá nhân của người đi làm'], ['20:30', 'Phân bổ thu nhập và quỹ dự phòng'], ['21:00', 'Đầu tư an toàn cho người mới bắt đầu'], ['21:30', 'Hỏi đáp trực tiếp']],
      earlyBird: 'Tặng e-book "Kế hoạch tài chính 12 tháng" cho người đăng ký trước', ebDays: -10,
      content: {
        headline: 'Quản lý tiền bạc rõ ràng ngay từ lương tháng này',
        description: 'Webinar 90 phút giúp người đi làm lập ngân sách, xây quỹ dự phòng và bắt đầu đầu tư với mức rủi ro vừa phải. Nội dung đi từ ví dụ số liệu thật, kèm bảng tính mẫu để bạn áp dụng ngay sau buổi học.',
        benefits: ['Lập được bảng ngân sách cá nhân theo quy tắc phân bổ thu nhập dễ áp dụng', 'Biết cần giữ bao nhiêu tháng chi phí làm quỹ dự phòng', 'Nhận bảng tính mẫu và e-book kế hoạch tài chính 12 tháng'] },
      seo: { title: 'Webinar Quản lý tài chính cá nhân 2026', description: 'Webinar trực tuyến về ngân sách, quỹ dự phòng và đầu tư cho người mới bắt đầu. Sự kiện đã diễn ra.' },
      secs: ['testimonials'],
      faq: [], quotes: [['“Bảng tính mẫu rất dễ dùng, tháng này mình đã tách được quỹ dự phòng.”', 'Hoàng Nhi · người tham dự'], ['“Phần hỏi đáp cuối buổi giải đáp trúng thắc mắc về đầu tư của mình.”', 'Minh Tuấn · người tham dự']],
      regs: 118, launchDays: 30, ended: true, funnel: 12 }
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
    var from = now.getTime() - spec.launchDays * DAY;
    var to = Math.min(now.getTime() - 60000, spec.ended ? startMs - 3 * 3600000 : now.getTime() - 60000);
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

  function buildEvent(spec, idx, now) {
    var start = at(now, spec.days, spec.hour, 0);
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
    if (spec.secs.indexOf('cta2') >= 0) {
      texts['cta2.title'] = 'Còn {con_cho} chỗ – giữ quà khai trương ngay';
      texts['cta2.text'] = 'Đã có {so_dang_ky} người đăng ký. Quán mở cửa sau {dem_nguoc} ngày nữa, hẹn gặp bạn bên Hồ Tây.';
    }
    var ev = {
      id: id, name: spec.name, startAt: localStr(start), location: spec.location, capacity: spec.capacity,
      speakers: spec.speakers,
      agenda: spec.agenda.map(function (a) { return { time: a[0], title: a[1] }; }),
      earlyBird: spec.earlyBird,
      earlyBirdUntil: spec.ebDays ? localStr(at(now, spec.ebDays, 23, 59)) : '',
      sheetUrl: '', templateId: spec.templateId,
      studioName: spec.studioName || '', studioUrl: spec.studioUrl || '',
      images: {}, sections: sections(spec.secs), style: null,
      texts: texts, elStyles: null, elStylesBy: null, rich: null,
      blocks: Object.keys(blocks).length ? blocks : null,
      brandId: '', brand: null, seo: spec.seo, published: false, demo: true
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
    S.write('current_id', PREFIX + 'evt_' + SPECS[0].key);
    S.write(FLAG, now.toISOString());
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

  var firstLoad = false;
  if (shouldSeed()) { seed(); firstLoad = true; }

  // ---------- Giao diện: banner + chân trang ----------
  function reload() { root.location.reload(); }
  function doRestore() {
    var msg = 'Khôi phục dữ liệu mẫu? Các sự kiện, đăng ký và thương hiệu mẫu sẽ được đặt lại như ban đầu. Dữ liệu của bạn không bị ảnh hưởng.';
    if (!root.confirm(msg)) return;
    removeDemo(); seed(); reload();
  }
  function doRemove() {
    if (!root.confirm('Xoá dữ liệu mẫu? Chỉ các sự kiện, đăng ký và thương hiệu mẫu bị xoá; dữ liệu của bạn được giữ nguyên.')) return;
    removeDemo(); reload();
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

  EP.demo = { seed: seed, remove: removeDemo, restore: function () { removeDemo(); seed(); }, hasDemo: hasDemo, isDemoId: isDemoId, brands: BRANDS };
})(window);
