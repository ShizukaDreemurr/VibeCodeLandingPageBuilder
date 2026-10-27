/*
 * templates.js — thư viện mẫu landing page theo ngành / loại / mục đích sự kiện.
 * Mỗi mẫu gồm: bảng màu (đã kiểm tra tương phản WCAG AA ≥ 4.5:1), nhãn các phần, dữ liệu mẫu.
 * Nội dung trang không phụ thuộc mẫu → đổi mẫu giữ nguyên nội dung.
 */
(function (root) {
  var FILTERS = {
    industry: { label: 'Ngành nghề', options: { tech: 'Công nghệ', education: 'Giáo dục', beauty: 'Làm đẹp / Spa', fnb: 'F&B', finance: 'Tài chính', personal: 'Sự kiện cá nhân',
      health: 'Sức khoẻ / Thể thao', realestate: 'Bất động sản', travel: 'Du lịch / Khách sạn', entertainment: 'Âm nhạc / Giải trí', community: 'Cộng đồng / Phi lợi nhuận',
      retail: 'Thời trang / Bán lẻ', art: 'Nghệ thuật / Sáng tạo', corporate: 'Doanh nghiệp / Nhân sự' } },
    type: { label: 'Loại sự kiện', options: { workshop: 'Workshop', seminar: 'Hội thảo', webinar: 'Webinar', opening: 'Khai trương', launch: 'Ra mắt sản phẩm', wedding: 'Đám cưới',
      concert: 'Hoà nhạc / Show', exhibition: 'Triển lãm / Hội chợ', networking: 'Networking / Meetup', training: 'Khoá học / Đào tạo', party: 'Tiệc / Gala',
      sports: 'Giải đấu / Chạy bộ', charity: 'Thiện nguyện / Gây quỹ', tour: 'Tour / Trải nghiệm', birthday: 'Sinh nhật / Kỷ niệm' } },
    goal: { label: 'Mục đích', options: { lead: 'Thu lead', enroll: 'Tuyển sinh', sales: 'Bán hàng', brand: 'Thương hiệu', gratitude: 'Tri ân / mời khách',
      community: 'Kết nối cộng đồng', recruit: 'Tuyển dụng', fundraise: 'Gây quỹ' } },
    // Bộ lọc nâng cao (theo báo cáo Deep Research): gắn nhãn ở tools/extra-tags.json
    scale: { label: 'Quy mô', advanced: true, options: { intimate: 'Thân mật (< 50 người)', medium: 'Vừa (50–200)', large: 'Lớn (200–1.000)', mass: 'Đại chúng (> 1.000)' } },
    format: { label: 'Hình thức', advanced: true, options: { offline: 'Trực tiếp', online: 'Trực tuyến', hybrid: 'Kết hợp' } },
    cost: { label: 'Chi phí tham dự', advanced: true, options: { free: 'Miễn phí', paid: 'Bán vé / có phí', donation: 'Quyên góp' } },
    audience: { label: 'Đối tượng khách', advanced: true, options: { b2b: 'Doanh nghiệp (B2B)', b2c: 'Khách tiêu dùng (B2C)', genz: 'Giới trẻ / Gen Z', family: 'Gia đình & trẻ em' } },
    season: { label: 'Mùa / dịp lễ', advanced: true, options: { tet: 'Tết & khai xuân', wedding_season: 'Mùa cưới', summer_enroll: 'Mùa hè & tuyển sinh', year_end: 'Cuối năm & Black Friday', midautumn: 'Trung thu', holiday: 'Ngày lễ khác (8/3, 20/10, 1/6…)' } }
  };

  var DEFAULT_LABELS = {
    countdown: 'Đếm ngược đến giờ G',
    about: 'Giới thiệu',
    benefits: 'Bạn nhận được gì khi tham dự?',
    speakers: 'Diễn giả',
    agenda: 'Chương trình',
    offer: 'Ưu đãi đăng ký sớm',
    register: 'Đăng ký tham gia',
    submit: 'Đăng ký tham gia',
    countSuffix: ' người đã đăng ký',
    success: 'Đăng ký thành công! Hẹn gặp bạn tại sự kiện.'
  };

  function future(days, hour) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  var TEMPLATES = [
    {
      id: 'tech',
      art: { motif: 'circuit', variant: 0 },
      name: 'Tech Workshop',
      tags: { industry: ['tech'], type: ['workshop', 'seminar'], goal: ['lead', 'brand'] },
      theme: { primary: '#1e2a78', accent: '#d6336c', surface: '#f4f5fb', bg: '#ffffff', text: '#16193a', muted: '#5b6078' },
      sample: function () {
        return {
          name: 'Workshop AI Marketing 2026', startAt: future(12, 9), location: 'Toà nhà FPT, Cầu Giấy, Hà Nội', capacity: 150,
          speakers: [{ name: 'Nguyễn Văn An', title: 'Chuyên gia AI Marketing' }, { name: 'Trần Thu Hà', title: 'Growth Director, Agency X' }],
          agenda: [{ time: '08:30', title: 'Đón khách & check-in' }, { time: '09:00', title: 'Khai mạc' }, { time: '09:15', title: 'Ứng dụng AI vào lập kế hoạch chiến dịch' }, { time: '10:30', title: 'Thực hành: tự động hoá nội dung' }, { time: '11:30', title: 'Hỏi đáp & kết nối' }],
          earlyBird: 'Giảm 30% học phí cho 50 người đăng ký đầu tiên', earlyBirdUntil: future(5, 23)
        };
      }
    },
    {
      id: 'edu',
      art: { motif: 'books', variant: 0 },
      name: 'Hội thảo Giáo dục',
      tags: { industry: ['education'], type: ['seminar', 'workshop'], goal: ['enroll', 'lead'] },
      theme: { primary: '#0b4f8a', accent: '#c2410c', surface: '#eef6fc', bg: '#ffffff', text: '#0f2537', muted: '#4a5a6a' },
      labels: { benefits: 'Học viên nhận được gì?', speakers: 'Giảng viên', submit: 'Giữ chỗ miễn phí' },
      sample: function () {
        return {
          name: 'Hội thảo Định hướng Du học 2027', startAt: future(10, 14), location: 'Trung tâm Hội nghị Quốc gia, Hà Nội', capacity: 300,
          speakers: [{ name: 'TS. Lê Minh Châu', title: 'Chuyên gia tư vấn du học' }, { name: 'Phạm Quỳnh Anh', title: 'Cựu du học sinh Úc' }],
          agenda: [{ time: '14:00', title: 'Đón tiếp phụ huynh & học sinh' }, { time: '14:30', title: 'Xu hướng du học 2027' }, { time: '15:30', title: 'Chia sẻ kinh nghiệm săn học bổng' }, { time: '16:30', title: 'Tư vấn 1-1' }],
          earlyBird: 'Tặng bộ tài liệu học bổng cho 100 người đăng ký sớm', earlyBirdUntil: future(6, 23)
        };
      }
    },
    {
      id: 'beauty',
      art: { motif: 'petals', variant: 0 },
      name: 'Workshop Làm đẹp',
      tags: { industry: ['beauty'], type: ['workshop', 'launch'], goal: ['sales', 'lead'] },
      theme: { primary: '#9d174d', accent: '#be185d', surface: '#fdf2f8', bg: '#ffffff', text: '#3b0a20', muted: '#7a4a5e' },
      labels: { speakers: 'Chuyên gia chia sẻ', submit: 'Nhận vé mời' },
      sample: function () {
        return {
          name: 'Workshop Chăm sóc da mùa lạnh', startAt: future(8, 15), location: 'Lumi Spa, Quận 1, TP.HCM', capacity: 40,
          speakers: [{ name: 'Bác sĩ Hoàng Yến', title: 'Bác sĩ da liễu' }],
          agenda: [{ time: '15:00', title: 'Check-in & trà chiều' }, { time: '15:30', title: 'Hiểu làn da của bạn' }, { time: '16:15', title: 'Trải nghiệm liệu trình mẫu' }],
          earlyBird: 'Tặng voucher 300.000đ cho 20 khách đăng ký đầu tiên', earlyBirdUntil: future(4, 23)
        };
      }
    },
    {
      id: 'fnb',
      art: { motif: 'coffee', variant: 0 },
      name: 'Khai trương Cửa hàng',
      tags: { industry: ['fnb', 'beauty'], type: ['opening', 'launch'], goal: ['sales', 'brand'] },
      theme: { primary: '#991b1b', accent: '#b45309', surface: '#fff7ed', bg: '#ffffff', text: '#3b1a0a', muted: '#6b4a3a' },
      labels: { countdown: 'Đếm ngược đến giờ khai trương', speakers: 'Khách mời đặc biệt', agenda: 'Lịch trình khai trương', offer: 'Quà tặng khai trương', submit: 'Đăng ký nhận quà' },
      sample: function () {
        return {
          name: 'Khai trương Mộc Coffee chi nhánh Cầu Giấy', startAt: future(7, 8), location: '25 Trần Thái Tông, Cầu Giấy, Hà Nội', capacity: 200,
          speakers: [{ name: 'Barista Minh Khôi', title: 'Quán quân Barista 2025' }],
          agenda: [{ time: '08:00', title: 'Cắt băng khai trương' }, { time: '08:30', title: 'Mua 1 tặng 1 toàn menu' }, { time: '19:00', title: 'Đêm nhạc acoustic' }],
          earlyBird: 'Tặng 1 ly cà phê miễn phí cho 200 khách đăng ký', earlyBirdUntil: future(6, 23)
        };
      }
    },
    {
      id: 'finance',
      art: { motif: 'chart', variant: 0 },
      name: 'Webinar Tài chính',
      tags: { industry: ['finance'], type: ['webinar', 'seminar'], goal: ['lead', 'brand'] },
      theme: { primary: '#065f46', accent: '#0369a1', surface: '#ecfdf5', bg: '#ffffff', text: '#0b2e24', muted: '#46635a' },
      labels: { submit: 'Nhận link tham dự' },
      sample: function () {
        return {
          name: 'Webinar Quản lý tài chính cá nhân 2026', startAt: future(9, 20), location: 'Trực tuyến qua Zoom (gửi link sau khi đăng ký)', capacity: 500,
          speakers: [{ name: 'Đỗ Thanh Tùng', title: 'Chuyên gia hoạch định tài chính' }],
          agenda: [{ time: '20:00', title: 'Bức tranh tài chính cá nhân' }, { time: '20:30', title: 'Phân bổ thu nhập & quỹ dự phòng' }, { time: '21:00', title: 'Hỏi đáp trực tiếp' }],
          earlyBird: 'Tặng e-book "Kế hoạch tài chính 12 tháng"', earlyBirdUntil: ''
        };
      }
    },
    {
      id: 'wedding',
      art: { motif: 'rings', variant: 0 },
      name: 'Thiệp cưới Online',
      wedding: true,
      tags: { industry: ['personal'], type: ['wedding'], goal: ['gratitude'] },
      theme: { primary: '#7f1d1d', accent: '#a16207', surface: '#fbefe1', bg: '#fffaf3', text: '#3a1512', muted: '#6e4b3f', headingFont: "'Playfair Display', Georgia, serif" },
      labels: {
        countdown: 'Đếm ngược đến ngày vui', about: 'Lời mời', benefits: 'Điều đặc biệt trong ngày vui', speakers: 'Cô dâu & Chú rể',
        agenda: 'Lịch trình buổi lễ', offer: 'Lời nhắn', register: 'Xác nhận tham dự', submit: 'Xác nhận tham dự',
        countSuffix: ' khách đã xác nhận', success: 'Cảm ơn bạn đã xác nhận! Hẹn gặp bạn trong ngày vui.'
      },
      sample: function () {
        return {
          name: 'Lễ cưới Minh Anh & Hoàng Nam', startAt: future(30, 11), location: 'Trung tâm Tiệc cưới Riverside, Long Biên, Hà Nội', capacity: 300,
          speakers: [{ name: 'Nguyễn Minh Anh', title: 'Cô dâu' }, { name: 'Trần Hoàng Nam', title: 'Chú rể' }],
          agenda: [{ time: '10:30', title: 'Đón khách' }, { time: '11:00', title: 'Lễ thành hôn' }, { time: '11:30', title: 'Khai tiệc' }],
          earlyBird: 'Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng mình', earlyBirdUntil: '',
          studioName: 'Studio Ánh Dương', studioUrl: 'https://www.facebook.com/studioanhduong.vn'
        };
      }
    }
  ];

  // 50 mẫu bổ sung (js/templates-data.js, sinh từ tools/templates.json bằng tools/build-templates.cjs)
  (root.EP && root.EP.templateData || []).forEach(function (d) {
    if (TEMPLATES.some(function (t) { return t.id === d.id; })) return;
    var smp = d.sample;
    TEMPLATES.push({
      id: d.id, name: d.name, tags: d.tags, theme: d.theme, labels: d.labels, wedding: !!d.wedding, art: d.art,
      sample: function () {
        return {
          name: smp.name, startAt: future(smp.startDays, smp.startHour), location: smp.location, capacity: smp.capacity,
          speakers: smp.speakers.slice(), agenda: smp.agenda.slice(), earlyBird: smp.earlyBird,
          earlyBirdUntil: smp.earlyBirdDays == null ? '' : future(smp.earlyBirdDays, 23),
          studioName: smp.studioName || '', studioUrl: smp.studioUrl || ''
        };
      }
    });
  });
  // Ảnh nền mặc định (vẽ sẵn, tools/make-art.cjs) và ảnh đại diện = ảnh chụp phần đầu trang (tools/make-thumbs.cjs)
  var EXTRA = (root.EP && root.EP.templateTags) || {};
  TEMPLATES.forEach(function (t) {
    var x = EXTRA[t.id] || {};
    ['scale', 'format', 'cost', 'audience', 'season'].forEach(function (k) { t.tags[k] = (x[k] || []).slice(); });
    t.hero = 'assets/templates/' + t.id + '.svg';
    t.thumb = 'assets/templates/' + t.id + '-thumb.jpg';
  });

  function get(id) {
    return TEMPLATES.find(function (t) { return t.id === id; }) || TEMPLATES[0];
  }

  function labels(id) {
    return Object.assign({}, DEFAULT_LABELS, get(id).labels || {});
  }

  // Điểm phù hợp: khớp bao nhiêu bộ lọc trong số bộ lọc đã chọn
  function score(t, filters) {
    var keys = Object.keys(filters).filter(function (k) { return filters[k]; });
    var hit = keys.filter(function (k) { return t.tags[k].indexOf(filters[k]) !== -1; }).length;
    return { hit: hit, total: keys.length };
  }

  function search(filters) {
    return TEMPLATES.map(function (t) { return { template: t, score: score(t, filters) }; })
      .sort(function (a, b) { return b.score.hit - a.score.hit; });
  }

  // Biến CSS áp lên landing page
  function cssVars(id) {
    var th = get(id).theme;
    return {
      '--lp-primary': th.primary, '--lp-accent': th.accent, '--lp-surface': th.surface,
      '--lp-bg': th.bg, '--lp-text': th.text, '--lp-muted': th.muted,
      '--lp-heading-font': th.headingFont || 'inherit'
    };
  }

  root.EP = root.EP || {};
  root.EP.templates = { FILTERS: FILTERS, list: TEMPLATES, get: get, labels: labels, search: search, cssVars: cssVars };
})(typeof window !== 'undefined' ? window : globalThis);
