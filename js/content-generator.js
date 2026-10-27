/*
 * content-generator.js — AI MÔ PHỎNG (chạy offline, không cần mạng).
 * Ghép headline, mô tả và 3 lợi ích từ công thức copywriting có sẵn
 * dựa trên thông tin người dùng nhập. Không bịa thông tin ngoài form.
 */
(function (root) {
  var TONES = {
    formal: {
      label: 'Trang trọng',
      headlines: [
        '{name}: Cập nhật xu hướng, nâng tầm chuyên môn',
        '{name} – Nơi hội tụ chuyên gia và người làm nghề',
        'Tham dự {name}: Kiến thức thực tiễn từ {speaker}'
      ],
      intro: [
        '{name} là sự kiện dành cho những ai muốn cập nhật kiến thức và kết nối với cộng đồng chuyên môn.',
        'Sự kiện {name} mang đến góc nhìn thực tế và các bài học có thể áp dụng ngay vào công việc.'
      ]
    },
    young: {
      label: 'Trẻ trung',
      headlines: [
        '{name}: Học thật, chơi thật, kết nối thật!',
        'Đừng bỏ lỡ {name} – bùng nổ ý tưởng cùng {speaker}',
        '{name}: Một buổi, mở ra cả chục ý tưởng mới'
      ],
      intro: [
        '{name} là nơi bạn gặp gỡ những người cùng đam mê, nghe chia sẻ thật và mang về ý tưởng mới.',
        'Sẵn sàng cho {name} chưa? Một buổi gặp gỡ năng lượng, nhiều cảm hứng và cực kỳ thực tế.'
      ]
    },
    urgent: {
      label: 'Gấp rút',
      headlines: [
        '{name}: Số chỗ có hạn – giữ chỗ ngay hôm nay',
        'Chỉ còn ít ngày nữa: {name} cùng {speaker}',
        '{name} – Đăng ký sớm để không bỏ lỡ'
      ],
      intro: [
        '{name} sắp diễn ra và số chỗ có hạn. Đăng ký ngay để giữ chỗ của bạn.',
        'Thời gian không còn nhiều: {name} chỉ nhận số lượng người tham dự giới hạn.'
      ]
    }
  };

  // Công thức 3 lợi ích: giá trị cốt lõi – tính ứng dụng – giảm rủi ro
  var BENEFITS = [
    ['Nghe trực tiếp chia sẻ thực tế từ {speaker}', 'Tiếp cận kiến thức và kinh nghiệm từ {speakerCount} diễn giả tại {name}'],
    ['Mang về những bài học có thể áp dụng ngay vào công việc', 'Kết nối với cộng đồng cùng quan tâm và mở rộng cơ hội hợp tác'],
    ['Tham gia dễ dàng tại {location}, không cần chuẩn bị trước', 'Đặt câu hỏi trực tiếp và nhận giải đáp ngay trong buổi']
  ];

  // Thiệp cưới: giọng văn ấm áp, "lợi ích" thành điểm nhấn của ngày vui
  var WEDDING = {
    headlines: [
      'Trân trọng kính mời bạn đến chung vui cùng {couple}',
      '{couple}: Chúng mình về chung một nhà!',
      'Hẹn bạn trong ngày vui của {couple}'
    ],
    intro: [
      'Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng mình. Mời bạn đến chung vui tại {location}.',
      'Sau những năm tháng bên nhau, chúng mình quyết định về chung một nhà và rất mong được đón bạn tại {location}.'
    ],
    benefits: [
      ['Cùng chứng kiến khoảnh khắc thiêng liêng của hai gia đình', 'Gặp lại bạn bè, người thân trong một ngày thật ý nghĩa'],
      ['Thưởng thức tiệc cưới ấm cúng cùng gia đình hai bên', 'Lưu lại những bức ảnh kỷ niệm cùng cô dâu chú rể'],
      ['Xác nhận tham dự chỉ mất 30 giây để chúng mình chuẩn bị chu đáo', 'Thông tin giờ giấc, địa điểm luôn có sẵn trên thiệp này']
    ]
  };

  function fill(text, vars) {
    return text.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
  }

  function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }

  // seed: số tăng dần mỗi lần bấm "Tạo lại" để ra phương án khác
  function generate(ev, tone, seed) {
    seed = seed || 0;
    var t = TONES[tone] || TONES.formal;
    var first = ev.speakers && ev.speakers[0];
    var vars = {
      name: ev.name,
      speaker: first ? first.name : 'các diễn giả',
      speakerCount: (ev.speakers || []).length || 1,
      location: ev.location
    };
    if (root.EP.templates && root.EP.templates.get(ev.templateId).wedding) {
      vars.couple = (ev.speakers || []).map(function (sp) { return sp.name.trim().split(/\s+/).pop(); }).join(' & ') || ev.name;
      return {
        headline: fill(pick(WEDDING.headlines, seed), vars),
        description: fill(pick(WEDDING.intro, seed), vars),
        benefits: WEDDING.benefits.map(function (options, i) { return fill(pick(options, seed + i), vars); }),
        source: 'mock'
      };
    }
    var description = fill(pick(t.intro, seed), vars);
    if (ev.earlyBird) description += ' Ưu đãi đăng ký sớm: ' + ev.earlyBird + '.';
    return {
      headline: fill(pick(t.headlines, seed), vars),
      description: description,
      benefits: BENEFITS.map(function (options, i) { return fill(pick(options, seed + i), vars); }),
      source: 'mock'
    };
  }

  root.EP = root.EP || {};
  root.EP.contentGenerator = { generate: generate, TONES: TONES };
})(typeof window !== 'undefined' ? window : globalThis);
