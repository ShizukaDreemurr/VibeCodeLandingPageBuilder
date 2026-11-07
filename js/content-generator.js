/*
 * content-generator.js — AI MÔ PHỎNG (chạy offline, không cần mạng).
 * Ghép headline, mô tả và 3 lợi ích từ các "công thức" copywriting theo nhóm mẫu (học / làm đẹp / F&B / chung)
 * và giọng văn. Khung: AIDA/PAS cho đoạn mô tả, 4U cho headline, FAB (đặc điểm → lợi thế → lợi ích) cho 3 ý lợi ích.
 * Chỉ dùng thông tin người dùng đã nhập (tên, diễn giả, địa điểm, ngày, sức chứa, ưu đãi). Không bịa số liệu.
 * Xác định theo hạt giống (seed): cùng đầu vào + cùng seed → cùng kết quả; "Tạo lại" tăng seed để ra phương án khác.
 */
(function (root) {
  // Nhóm theo mẫu (templateId). Mẫu lạ → 'general'.
  var CATEGORY = { tech: 'learn', edu: 'learn', finance: 'learn', beauty: 'care', fnb: 'fnb' };

  // ---- Headline: ≤ ~12 từ, đủ 4U khi có dữ liệu (Useful, Urgent, Unique, Ultra-specific) ----
  var HEADLINES = {
    learn: {
      formal: [
        '{name}: {speaker} chia sẻ cách làm đã kiểm chứng',
        'Một buổi {date} để biết chính xác nên làm gì tiếp theo',
        '{cap} chỗ, một buổi học đi thẳng vào việc cùng {speaker}'
      ],
      young: [
        'Một buổi, một việc làm xong: {name}',
        '{speaker} chỉ cách làm, bạn thử ngay tại chỗ',
        'Ngày {date}, đến với laptop, về với kết quả'
      ],
      urgent: [
        'Ngày {date}: {cap} chỗ cho buổi học cùng {speaker}',
        'Còn ít chỗ cho {name}, giữ chỗ trước ngày {date}',
        '{capShort} người đầu tiên sẽ có chỗ ngồi cạnh {speaker}'
      ]
    },
    care: {
      formal: [
        'Một buổi chiều ngày {date} dành riêng cho làn da của bạn',
        '{name}: {speaker} trực tiếp hướng dẫn, nhóm nhỏ',
        'Chăm đúng cách ngay từ {date}, cùng {speaker}'
      ],
      young: [
        'Ngày {date}, tặng bản thân một buổi chăm sóc ra trò',
        'Da ổn, tâm trạng ổn: hẹn bạn ngày {date}',
        '{name}: nhóm nhỏ, hỏi thoải mái, thử tại chỗ'
      ],
      urgent: [
        '{cap} chỗ cho {name}, giữ chỗ trước ngày {date}',
        'Nhóm nhỏ nên hết chỗ nhanh: đăng ký {name} ngay',
        'Ngày {date}: {capShort} người được {speaker} chăm riêng'
      ]
    },
    fnb: {
      formal: [
        '{name}: mời bạn ly đầu tiên ngày {date}',
        'Ngày {date}, mời bạn ghé {name}',
        'Một buổi khai trương đáng nhớ của {brand}'
      ],
      young: [
        '{brand} mở cửa ngày {date}, ly đầu tiên mời bạn',
        'Hẹn bạn sáng {date}, mùi cà phê thơm tới tận cửa',
        'Một buổi khai trương đáng nhớ của {brand}'
      ],
      urgent: [
        '{brand} mời {capShort} người đầu tiên, ngày {date}',
        'Ngày {date}: {cap} suất quà khai trương, đăng ký trước',
        'Giữ phần quà khai trương của {brand} trước ngày {date}'
      ]
    },
    general: {
      formal: [
        'Mời bạn đến {name} ngày {date}',
        '{name}: một buổi gặp gỡ đáng dành thời gian',
        'Ngày {date}, cùng {speaker} tại {name}'
      ],
      young: [
        'Ngày {date}, gặp {speaker} và mang ý tưởng về nhà',
        '{name}: ít lý thuyết, nhiều việc để làm',
        'Một buổi, vài người hay, ý tưởng đủ dùng cả tháng'
      ],
      urgent: [
        'Ngày {date}: {cap} chỗ cho {name}',
        'Đăng ký trước ngày {date} để giữ chỗ tại {name}',
        '{capShort} người đầu tiên có mặt cùng {speaker}'
      ]
    }
  };

  // ---- Mô tả: Vấn đề → Giải pháp → Hành động (PAS/AIDA) ----
  var PROBLEM = {
    learn: ['Kiến thức đọc được nhiều, nhưng đến lúc làm vẫn lúng túng.', 'Đọc hàng chục bài mà vẫn chưa biết bắt đầu từ đâu.'],
    care: ['Đã thử đủ cách mà vấn đề vẫn quay lại.', 'Mỗi người một làn da, lời khuyên chung chung ít khi hợp.'],
    fnb: ['Tìm một quán ngon, yên tĩnh, ngồi lâu được không dễ.', 'Một góc quen để làm việc hay gặp bạn bè luôn đáng tìm.'],
    general: ['Một buổi gặp thật đáng giá hơn nhiều bài viết trên mạng.', 'Có những thứ chỉ nghe tận nơi mới hiểu.']
  };
  var SOLUTION = {
    learn: ['{name} diễn ra {when} tại {location}. {speaker} sẽ chỉ từng bước và bạn thử ngay trong buổi.', 'Ngày {date}, {speaker} làm mẫu tại {location} và trả lời đúng câu hỏi của bạn.'],
    care: ['{name} diễn ra {when} tại {location}, nhóm nhỏ để ai cũng được hỏi và được hướng dẫn riêng.', 'Ngày {date}, {speaker} trực tiếp hướng dẫn tại {location}.'],
    fnb: ['{name} mở cửa {when} tại {location}. Bạn đến uống thử, nhìn tận mắt cách pha và chọn chỗ ngồi mình thích.', '{brand} khai trương {when} tại {location}, mời bạn ghé ly đầu tiên.'],
    general: ['{name} diễn ra {when} tại {location}, có {speaker} cùng bạn.', 'Ngày {date}, {name} đón bạn tại {location}.']
  };
  var CALL = {
    formal: ['Đăng ký trước để ban tổ chức chuẩn bị chỗ cho bạn.', 'Bạn đăng ký trước, ban tổ chức sẽ xác nhận lại với bạn.'],
    young: ['Đăng ký mất 30 giây.', 'Bấm đăng ký, mình giữ chỗ cho bạn.'],
    urgent: ['Chỗ có hạn, bạn đăng ký sớm cho chắc.', 'Giữ chỗ ngay hôm nay, hết chỗ là dừng nhận.']
  };

  // ---- Lợi ích theo FAB: đặc điểm → lợi thế → kết quả bạn nhận được. Mỗi nhóm 3 ý x 3 phương án ----
  var BENEFITS = {
    learn: [
      ['Nghe {speaker} kể thẳng cách làm ngoài thực tế, không lý thuyết suông', 'Hỏi {speaker} đúng câu bạn đang vướng và có câu trả lời ngay tại chỗ', 'Mang về cách làm của {sp}, tuần sau áp dụng được ngay'],
      ['Rời buổi {date} với một việc cụ thể đã làm xong, không chỉ ghi chú đầy vở', 'Thực hành ngay trong buổi để về nhà không phải mò lại từ đầu', 'Biết rõ bước tiếp theo cần làm, thay vì đoán mò'],
      ['Ngồi xuống là học, đến {location} không cần chuẩn bị gì thêm', 'Đăng ký 30 giây, giờ giấc và địa điểm có sẵn ngay trên trang này', 'Một buổi gọn, đi thẳng vào việc, không mất cả ngày của bạn']
    ],
    care: [
      ['Được {speaker} trực tiếp hướng dẫn, hỏi gì đáp nấy trong nhóm nhỏ', 'Hiểu rõ tình trạng của mình, biết nên bắt đầu từ đâu thay vì thử đại', 'Nghe {speaker} chỉ đúng cách, bớt đi những sai lầm hay gặp'],
      ['Về nhà với cách chăm gọn, đúng thứ tự, khỏi mua thừa', 'Trải nghiệm thử tại chỗ, thấy hợp rồi mới quyết định', 'Nhận gợi ý riêng cho bạn, không phải công thức chung cho mọi người'],
      ['Không gian yên tĩnh tại {location}, ngồi thoải mái và hỏi thoải mái', 'Đăng ký 30 giây, giờ giấc và địa điểm có sẵn ngay trên trang này', 'Nhóm nhỏ nên ai cũng được quan tâm']
    ],
    fnb: [
      ['Ly đầu tiên của {brand}: thơm mùi hạt vừa rang, nhấp một ngụm là tỉnh', 'Nếm thử tại chỗ và chọn món hợp vị mình trước khi quán đông', 'Gặp {speaker} và xem tận mắt ly cà phê của bạn được pha ra sao'],
      ['Có thêm một góc quen gần bạn tại {location} để làm việc hay gặp bạn bè', 'Chọn trước chỗ ngồi ưng ý trong ngày quán còn thong thả', 'Rủ bạn bè đi cùng, ngày {date} có quà dành cho khách đến sớm'],
      ['Đăng ký 30 giây, đến quầy đọc số điện thoại là nhận quà', 'Giờ giấc, địa chỉ có sẵn ngay trên trang này, đến là có chỗ', 'Không cần mang gì, chỉ cần đến']
    ],
    general: [
      ['Nghe trực tiếp từ {sp}, hỏi được đúng điều bạn muốn biết', 'Gặp {speaker} và mang về góc nhìn bạn khó tìm thấy trên mạng', 'Nghe người trong cuộc kể, hiểu nhanh hơn nhiều so với tự đọc'],
      ['Gặp những người cùng quan tâm và có thêm vài mối quen ngay trong buổi', 'Rời buổi {date} với ít nhất một ý tưởng làm được ngay', 'Biết thêm người, biết thêm cách làm, về nhà thấy đáng'],
      ['Đến {location}, ngồi xuống là tham gia, không cần chuẩn bị trước', 'Đăng ký 30 giây, giờ giấc và địa điểm có sẵn ngay trên trang này', 'Một buổi gọn gàng, đi thẳng vào việc']
    ]
  };

  // Thiệp cưới: giọng ấm áp, "lợi ích" thành điểm nhấn của ngày vui
  var WEDDING = {
    headlines: [
      '{couple} cưới rồi, mời bạn đến chung vui',
      '{couple} về chung một nhà, hẹn bạn ngày {date}',
      'Ngày {date}, mời bạn ngồi cùng bàn với {couple}'
    ],
    intro: [
      'Sau nhiều năm bên nhau, chúng mình quyết định về chung một nhà. Sẽ rất vui nếu hôm đó có bạn tại {location}. Bạn báo giúp một tiếng để gia đình sắp chỗ chu đáo nhé.',
      'Ngày {date} tại {location}, chúng mình làm lễ và mời bạn ở lại dùng bữa cùng gia đình. Bạn xác nhận giúp để chúng mình chuẩn bị chỗ ngồi cho bạn.'
    ],
    benefits: [
      ['Chứng kiến khoảnh khắc hai gia đình chính thức thành một nhà', 'Có mặt trong ngày chúng mình nói lời hứa trước người thân', 'Cùng nâng ly với gia đình hai bên trong ngày vui nhất'],
      ['Gặp lại bạn bè, người thân trong một bữa tiệc ấm cúng', 'Ngồi cùng bàn với những người quen, trò chuyện thoải mái', 'Chụp ảnh kỷ niệm cùng cô dâu chú rể'],
      ['Xác nhận tham dự trong 30 giây để chúng mình chuẩn bị chu đáo', 'Giờ giấc và đường đi nằm sẵn ngay trên thiệp này', 'Chỉ cần báo một tiếng, chỗ ngồi của bạn đã được giữ']
    ]
  };

  var TONES = {
    formal: { label: 'Trang trọng' },
    young: { label: 'Trẻ trung' },
    urgent: { label: 'Gấp rút' }
  };

  function fill(text, vars) {
    return text.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
  }
  function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // "Khai trương Mộc Coffee Hồ Tây" → "Mộc Coffee Hồ Tây"; dùng làm tên thương hiệu khi không có Brand DNA
  function shortName(name) {
    return String(name || '').replace(/^(khai trương|ra mắt|workshop|hội thảo|webinar|lễ|buổi)\s+/i, '').trim() || String(name || '');
  }

  function buildVars(ev) {
    var first = ev.speakers && ev.speakers[0];
    var count = (ev.speakers || []).filter(function (s) { return s && s.name; }).length;
    var d = ev.startAt ? new Date(ev.startAt) : null;
    var hasDate = d && !isNaN(d);
    var cap = parseInt(ev.capacity, 10);
    return {
      name: ev.name,
      brand: (ev.brand && ev.brand.name) || shortName(ev.name),
      speaker: first && first.name ? first.name : 'các diễn giả',
      speakerCount: count || 1,
      sp: count > 1 ? count + ' diễn giả' : (first && first.name ? first.name : 'các diễn giả'),
      location: ev.location,
      date: hasDate ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) : 'sắp tới',
      when: hasDate ? 'lúc ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' ngày ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) : 'sắp tới',
      cap: cap > 0 ? cap : 'số lượng có hạn',
      capShort: cap > 0 ? cap : 'những'
    };
  }

  // seed: số tăng dần mỗi lần bấm "Tạo lại" để ra phương án khác
  function generate(ev, tone, seed) {
    seed = seed || 0;
    var toneKey = TONES[tone] ? tone : 'formal';
    var vars = buildVars(ev);
    var tpl = root.EP.templates && root.EP.templates.get(ev.templateId);
    if (tpl && tpl.wedding) {
      vars.couple = (ev.speakers || []).map(function (sp) { return sp.name.trim().split(/\s+/).pop(); }).join(' & ') || ev.name;
      return {
        headline: fill(pick(WEDDING.headlines, seed), vars),
        description: fill(pick(WEDDING.intro, seed), vars),
        benefits: WEDDING.benefits.map(function (options, i) { return fill(pick(options, seed + i), vars); }),
        source: 'mock'
      };
    }
    var cat = CATEGORY[ev.templateId] || 'general';
    var headline = fill(pick(HEADLINES[cat][toneKey], seed), vars);
    if (headline.length > 100) headline = fill(pick(HEADLINES.general[toneKey].slice(0, 1), seed), vars);
    var description = [
      pick(PROBLEM[cat], seed),
      fill(pick(SOLUTION[cat], seed + 1), vars),
      pick(CALL[toneKey], seed)
    ].join(' ');
    if (description.length > 300) description = description.replace(pick(PROBLEM[cat], seed) + ' ', '');
    if (ev.earlyBird) description += ' ' + String(ev.earlyBird).replace(/[.\s]+$/, '') + '.';
    return {
      headline: headline,
      description: description,
      benefits: BENEFITS[cat].map(function (options, i) { return fill(pick(options, seed + i), vars); }),
      source: 'mock'
    };
  }

  root.EP = root.EP || {};
  root.EP.contentGenerator = { generate: generate, TONES: TONES };
})(typeof window !== 'undefined' ? window : globalThis);
