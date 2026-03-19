const bcrypt = require('bcryptjs');
const db = require('../src/db');

function seedUsers() {
  console.log('Seeding users...');

  const adminPw = bcrypt.hashSync('Admin@123', 12);
  const modPw = bcrypt.hashSync('Mod@123', 12);
  const userPw = bcrypt.hashSync('User@123', 12);

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role, locale) VALUES (?, ?, ?, ?, ?)'
  );

  const adminResult = insertUser.run('Admin Khoa Nhật', 'admin@japanesefaculty.edu.vn', adminPw, 'admin', 'vi');
  const modResult = insertUser.run('Nguyễn Thị Hoa', 'moderator@japanesefaculty.edu.vn', modPw, 'moderator', 'vi');
  const user1Result = insertUser.run('Trần Văn Minh', 'user1@japanesefaculty.edu.vn', userPw, 'user', 'vi');
  const user2Result = insertUser.run('Lê Thị Mai', 'user2@japanesefaculty.edu.vn', userPw, 'user', 'vi');

  console.log('Users seeded: admin, moderator, 2 users.');
  return {
    adminId: adminResult.lastInsertRowid,
    modId: modResult.lastInsertRowid,
    user1Id: user1Result.lastInsertRowid,
    user2Id: user2Result.lastInsertRowid,
  };
}

function seedArticles(adminId) {
  console.log('Seeding articles...');

  const insertArticle = db.prepare(`
    INSERT INTO articles (slug, category, status, featured_image, author_id, published_at, translations)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const articles = [
    {
      slug: 'le-khai-giang-nam-hoc-2024-2025',
      category: 'news',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      published_at: '2024-09-02T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Lễ Khai Giảng Năm Học 2024-2025 Khoa Ngôn Ngữ Nhật',
          excerpt: 'Khoa Ngôn Ngữ Nhật tổ chức lễ khai giảng năm học mới với sự tham gia của hơn 500 sinh viên và giảng viên.',
          content: '<p>Sáng ngày 2 tháng 9 năm 2024, Khoa Ngôn Ngữ Nhật đã long trọng tổ chức lễ khai giảng năm học 2024-2025 với sự tham gia của hơn 500 sinh viên, cán bộ giảng viên và đại diện các doanh nghiệp Nhật Bản tại Việt Nam.</p><p>Phát biểu tại buổi lễ, Trưởng khoa PGS.TS. Nguyễn Văn Hùng nhấn mạnh về tầm quan trọng của việc học tiếng Nhật trong bối cảnh hội nhập kinh tế quốc tế.</p>',
          metaTitle: 'Lễ Khai Giảng 2024-2025 | Khoa Ngôn Ngữ Nhật',
          metaDescription: 'Khoa Ngôn Ngữ Nhật tổ chức lễ khai giảng năm học 2024-2025 với hơn 500 sinh viên tham dự.',
        },
        en: {
          title: 'Opening Ceremony for Academic Year 2024-2025 - Japanese Language Faculty',
          excerpt: 'The Japanese Language Faculty held the opening ceremony for the new academic year with over 500 students and lecturers.',
          content: '<p>On the morning of September 2, 2024, the Japanese Language Faculty solemnly held the opening ceremony for the 2024-2025 academic year with over 500 participants.</p>',
          metaTitle: 'Opening Ceremony 2024-2025 | Japanese Language Faculty',
          metaDescription: 'Japanese Language Faculty opening ceremony for academic year 2024-2025.',
        },
        jp: {
          title: '2024-2025年度 日本語学部 開学式',
          excerpt: '日本語学部は500名以上の学生と教員が参加する新学年の開学式を開催しました。',
          content: '<p>2024年9月2日の朝、日本語学部は2024-2025年度の開学式を厳粛に開催しました。</p>',
          metaTitle: '開学式 2024-2025 | 日本語学部',
          metaDescription: '日本語学部2024-2025年度開学式のお知らせ。',
        },
      },
    },
    {
      slug: 'hoi-thao-giao-luu-van-hoa-nhat-viet',
      category: 'events',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
      published_at: '2024-10-15T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Hội Thảo Giao Lưu Văn Hóa Nhật - Việt 2024',
          excerpt: 'Sự kiện giao lưu văn hóa lớn nhất năm với nhiều hoạt động trải nghiệm văn hóa Nhật Bản hấp dẫn.',
          content: '<p>Hội thảo Giao lưu Văn hóa Nhật - Việt 2024 diễn ra vào ngày 15/10 tại khuôn viên trường với hơn 1000 người tham dự.</p><p>Chương trình bao gồm: trình diễn trà đạo, ikebana, mặc thử yukata và kimono, thi viết thư pháp, ẩm thực Nhật Bản.</p>',
          metaTitle: 'Hội Thảo Giao Lưu Văn Hóa Nhật-Việt 2024',
          metaDescription: 'Hội thảo giao lưu văn hóa Nhật-Việt với nhiều hoạt động trải nghiệm đặc sắc.',
        },
        en: {
          title: 'Japan-Vietnam Cultural Exchange Seminar 2024',
          excerpt: 'The biggest cultural exchange event of the year with many exciting Japanese cultural experience activities.',
          content: '<p>The Japan-Vietnam Cultural Exchange Seminar 2024 took place on October 15 on campus with over 1000 attendees.</p>',
          metaTitle: 'Japan-Vietnam Cultural Exchange 2024',
          metaDescription: 'Annual cultural exchange event celebrating Japan-Vietnam friendship.',
        },
        jp: {
          title: '日越文化交流セミナー2024',
          excerpt: '多くの日本文化体験活動が行われる今年最大の文化交流イベント。',
          content: '<p>2024年の日越文化交流セミナーは10月15日にキャンパスで開催され、1000名以上が参加しました。</p>',
          metaTitle: '日越文化交流セミナー2024',
          metaDescription: '日越友好を祝う年次文化交流イベント。',
        },
      },
    },
    {
      slug: 'hoc-bong-chinh-phu-nhat-ban-monbukagakusho-2025',
      category: 'internship',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800',
      published_at: '2024-11-01T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Học Bổng Chính Phủ Nhật Bản (MEXT) 2025 - Thông Báo Tuyển Sinh',
          excerpt: 'Chương trình học bổng MEXT dành cho sinh viên Việt Nam muốn học tập tại Nhật Bản, ứng tuyển trước ngày 31/01/2025.',
          content: '<p>Bộ Giáo dục, Văn hóa, Thể thao, Khoa học và Công nghệ Nhật Bản (MEXT) thông báo tuyển sinh học bổng năm 2025 dành cho sinh viên quốc tế.</p><p><strong>Hạn nộp hồ sơ:</strong> 31/01/2025.</p>',
          metaTitle: 'Học Bổng MEXT 2025 | Khoa Ngôn Ngữ Nhật',
          metaDescription: 'Thông tin học bổng chính phủ Nhật Bản MEXT 2025 dành cho sinh viên Việt Nam.',
        },
        en: {
          title: 'Japanese Government MEXT Scholarship 2025 - Application Notice',
          excerpt: 'MEXT scholarship program for Vietnamese students wishing to study in Japan. Apply before January 31, 2025.',
          content: '<p>The Japanese Ministry of Education announces the 2025 scholarship for international students.</p><p><strong>Deadline:</strong> January 31, 2025.</p>',
          metaTitle: 'MEXT Scholarship 2025 | Japanese Language Faculty',
          metaDescription: 'MEXT Japanese Government Scholarship 2025 information for Vietnamese students.',
        },
        jp: {
          title: '日本政府奨学金（文部科学省）2025年 - 募集のお知らせ',
          excerpt: '日本への留学を希望するベトナム人学生向けの文部科学省奨学金。',
          content: '<p>文部科学省は2025年度奨学金の募集を発表します。</p><p><strong>応募締切：</strong>2025年1月31日</p>',
          metaTitle: '文部科学省奨学金2025 | 日本語学部',
          metaDescription: 'ベトナム人学生向け日本政府奨学金2025年度情報。',
        },
      },
    },
    {
      slug: 'ket-qua-thi-jlpt-thang-7-2024',
      category: 'news',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      published_at: '2024-08-20T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Kết Quả Kỳ Thi JLPT Tháng 7/2024 - Nhiều Sinh Viên Đạt N2, N1',
          excerpt: 'Kỳ thi JLPT tháng 7/2024 ghi nhận 85% sinh viên khoa đạt các cấp độ từ N5 đến N1, trong đó 12 sinh viên đạt N1.',
          content: '<p>Kỳ thi Năng lực Tiếng Nhật (JLPT) tháng 7/2024 vừa công bố kết quả với tỷ lệ đỗ 85%. Đáng chú ý là 12 sinh viên năm 4 đạt N1.</p>',
          metaTitle: 'Kết Quả JLPT Tháng 7/2024 | Khoa Ngôn Ngữ Nhật',
          metaDescription: '85% sinh viên khoa đạt JLPT tháng 7/2024, 12 sinh viên đạt N1.',
        },
        en: {
          title: 'JLPT July 2024 Results - Many Students Achieved N2, N1',
          excerpt: 'The July 2024 JLPT recorded 85% of faculty students passing levels from N5 to N1, with 12 students achieving N1.',
          content: '<p>The JLPT July 2024 announced results with an 85% pass rate. 12 fourth-year students achieved N1.</p>',
          metaTitle: 'JLPT July 2024 Results | Japanese Language Faculty',
          metaDescription: '85% pass rate in JLPT July 2024, 12 students achieved N1.',
        },
        jp: {
          title: '2024年7月JLPT結果発表 - 多くの学生がN2・N1合格',
          excerpt: '2024年7月のJLPTでは学部の学生の85%がN5からN1まで合格し、12名がN1を取得しました。',
          content: '<p>2024年7月のJLPT合格率は85%に達し、12名の4年生がN1を取得しました。</p>',
          metaTitle: '2024年7月JLPT結果 | 日本語学部',
          metaDescription: 'JLPT2024年7月合格率85%、12名がN1合格。',
        },
      },
    },
    {
      slug: 'hoi-nghi-quoc-te-nghien-cuu-nhat-ban-viet-nam-2024',
      category: 'conference',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      published_at: '2024-11-20T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Hội Nghị Quốc Tế Nghiên Cứu Nhật Bản tại Việt Nam 2024',
          excerpt: 'Hội nghị tập hợp hơn 200 nhà nghiên cứu từ 15 quốc gia để thảo luận về các xu hướng nghiên cứu Nhật Bản học.',
          content: '<p>Hội nghị Quốc tế Nghiên cứu Nhật Bản tại Việt Nam lần thứ 5 (ISNV 2024) thu hút hơn 200 nhà nghiên cứu đến từ 15 quốc gia.</p>',
          metaTitle: 'Hội Nghị Quốc Tế Nghiên Cứu Nhật Bản 2024',
          metaDescription: 'ISNV 2024 - Hội nghị với hơn 200 nhà nghiên cứu từ 15 quốc gia.',
        },
        en: {
          title: 'International Conference on Japanese Studies in Vietnam 2024',
          excerpt: 'Conference bringing together 200+ researchers from 15 countries to discuss Japanese Studies research trends.',
          content: '<p>The 5th ISNV 2024 attracted over 200 researchers from 15 countries, presenting 68 papers.</p>',
          metaTitle: 'International Conference Japanese Studies Vietnam 2024',
          metaDescription: 'ISNV 2024 - 200+ researchers from 15 countries discussing Japanese Studies.',
        },
        jp: {
          title: 'ベトナムにおける日本研究国際会議2024',
          excerpt: '15カ国から200名以上の研究者が集まり、日本学研究のトレンドについて議論する会議。',
          content: '<p>第5回ISNV 2024が開催され、15カ国から200名以上の研究者が参加しました。</p>',
          metaTitle: 'ベトナム日本研究国際会議2024',
          metaDescription: 'ISNV 2024 - 15カ国から200名以上の研究者。',
        },
      },
    },
    {
      slug: 'chuong-trinh-thuc-tap-doanh-nghiep-nhat-ban-2025',
      category: 'internship',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
      published_at: '2024-12-01T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Chương Trình Thực Tập Doanh Nghiệp Nhật Bản 2025 - Mở Đơn Đăng Ký',
          excerpt: 'Cơ hội thực tập tại các tập đoàn Nhật Bản hàng đầu: Toyota, Sony, Panasonic, Softbank với thời gian 3-6 tháng.',
          content: '<p>Khoa Ngôn Ngữ Nhật triển khai chương trình thực tập doanh nghiệp Nhật Bản 2025 tại Toyota, Sony, Panasonic, SoftBank và FPT Japan.</p>',
          metaTitle: 'Thực Tập Doanh Nghiệp Nhật 2025 | Khoa Ngôn Ngữ Nhật',
          metaDescription: 'Cơ hội thực tập tại Toyota, Sony, Panasonic, Softbank năm 2025.',
        },
        en: {
          title: 'Japanese Business Internship Program 2025 - Applications Open',
          excerpt: 'Internship opportunities at leading Japanese corporations: Toyota, Sony, Panasonic, Softbank for 3-6 months.',
          content: '<p>The Japanese Language Faculty launches the Japanese Business Internship Program 2025 at Toyota, Sony, Panasonic, and more.</p>',
          metaTitle: 'Japanese Business Internship 2025',
          metaDescription: 'Internship at Toyota, Sony, Panasonic for Japanese language students.',
        },
        jp: {
          title: '2025年日本企業インターンシッププログラム - 募集開始',
          excerpt: 'トヨタ、ソニー、パナソニック、ソフトバンクなどの日本企業で3〜6ヶ月のインターンシップ機会。',
          content: '<p>日本語学部は2025年日本企業インターンシッププログラムを実施します。採用パートナー：トヨタ、ソニー、パナソニックなど。</p>',
          metaTitle: '2025年日本企業インターンシップ',
          metaDescription: 'トヨタ、ソニー、パナソニックでのインターンシップ。',
        },
      },
    },
    {
      slug: 'giai-nhat-cuoc-thi-thuyet-trinh-tieng-nhat-toan-quoc',
      category: 'student',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      published_at: '2024-09-25T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Sinh Viên Khoa Đoạt Giải Nhất Cuộc Thi Thuyết Trình Tiếng Nhật Toàn Quốc',
          excerpt: 'Em Nguyễn Thị Lan Anh, sinh viên năm 4, xuất sắc giành giải Nhất trong cuộc thi Thuyết trình Tiếng Nhật toàn quốc 2024.',
          content: '<p>Nguyễn Thị Lan Anh, sinh viên năm 4 Khoa Ngôn Ngữ Nhật, giành giải Nhất tại cuộc thi Thuyết trình Tiếng Nhật toàn quốc 2024 ngày 25/9/2024.</p>',
          metaTitle: 'Giải Nhất Thuyết Trình Tiếng Nhật Toàn Quốc 2024',
          metaDescription: 'Sinh viên Nguyễn Thị Lan Anh giành giải nhất cuộc thi thuyết trình tiếng Nhật toàn quốc.',
        },
        en: {
          title: 'Faculty Student Wins First Prize in National Japanese Speech Contest',
          excerpt: 'Nguyen Thi Lan Anh, 4th year student, won first prize in the National Japanese Speech Contest 2024.',
          content: '<p>Nguyen Thi Lan Anh won the first prize at the National Japanese Speech Contest 2024 held in Ho Chi Minh City.</p>',
          metaTitle: 'First Prize National Japanese Speech Contest 2024',
          metaDescription: 'Student wins first prize in national Japanese speech competition.',
        },
        jp: {
          title: '全国日本語スピーチコンテスト1位獲得',
          excerpt: '4年生のグエン・ティ・ラン・アンさんが2024年全国日本語スピーチコンテストで1位を獲得しました。',
          content: '<p>日本語学部4年生のグエン・ティ・ラン・アンさんが全国日本語スピーチコンテストで1位を獲得しました。</p>',
          metaTitle: '全国日本語スピーチコンテスト2024 1位',
          metaDescription: '学生が全国日本語スピーチコンテストで1位を獲得。',
        },
      },
    },
    {
      slug: 'nghien-cuu-so-sanh-ngu-phap-nhat-viet',
      category: 'research',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      published_at: '2024-10-05T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Nghiên Cứu So Sánh Ngữ Pháp Tiếng Nhật và Tiếng Việt: Góc Nhìn Mới',
          excerpt: 'Công trình nghiên cứu mới về sự tương đồng và khác biệt trong cấu trúc ngữ pháp Nhật-Việt.',
          content: '<p>Nghiên cứu so sánh cấu trúc câu tiếng Nhật và tiếng Việt chỉ ra nhiều điểm tương đồng trong cách biểu đạt lịch sự và cấu trúc câu hỏi.</p>',
          metaTitle: 'Nghiên Cứu Ngữ Pháp Nhật-Việt | Khoa Ngôn Ngữ Nhật',
          metaDescription: 'Nghiên cứu so sánh ngữ pháp tiếng Nhật và tiếng Việt.',
        },
        en: {
          title: 'Comparative Study of Japanese and Vietnamese Grammar: New Perspectives',
          excerpt: 'New research on similarities and differences in Japanese-Vietnamese grammatical structures.',
          content: '<p>Research reveals interesting similarities in politeness expression, question structures, and particle usage between Japanese and Vietnamese.</p>',
          metaTitle: 'Japanese-Vietnamese Grammar Comparative Study',
          metaDescription: 'Research comparing Japanese and Vietnamese grammatical structures.',
        },
        jp: {
          title: '日本語とベトナム語の文法比較研究：新たな視点',
          excerpt: '日越文法構造の類似点と相違点に関する新研究。',
          content: '<p>本研究では、日本語とベトナム語が敬語表現、疑問文構造で共通点を持つことを示しています。</p>',
          metaTitle: '日越文法比較研究',
          metaDescription: '日本語とベトナム語の文法構造比較研究。',
        },
      },
    },
    {
      slug: 'gioi-thieu-giao-vien-moi-nam-hoc-2024',
      category: 'news',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
      published_at: '2024-09-10T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Giới Thiệu Đội Ngũ Giảng Viên Mới Năm Học 2024-2025',
          excerpt: 'Khoa chào đón 5 giảng viên mới, trong đó có 2 giáo sư người Nhật từ Đại học Osaka và Đại học Tokyo.',
          content: '<p>Năm học 2024-2025, Khoa Ngôn Ngữ Nhật hân hạnh chào đón 5 giảng viên mới, trong đó có GS. Tanaka Kenji (ĐH Osaka) và PGS. Suzuki Yuki (ĐH Tokyo).</p>',
          metaTitle: 'Giảng Viên Mới 2024-2025 | Khoa Ngôn Ngữ Nhật',
          metaDescription: '5 giảng viên mới gia nhập Khoa Ngôn Ngữ Nhật năm học 2024-2025.',
        },
        en: {
          title: 'Introducing New Faculty Members for Academic Year 2024-2025',
          excerpt: 'The faculty welcomes 5 new lecturers, including 2 Japanese professors from Osaka University and Tokyo University.',
          content: '<p>For 2024-2025, the faculty welcomes Prof. Tanaka Kenji (Osaka Univ.) and Assoc. Prof. Suzuki Yuki (Tokyo Univ.) among 5 new lecturers.</p>',
          metaTitle: 'New Faculty Members 2024-2025',
          metaDescription: '5 new lecturers join the Japanese Language Faculty.',
        },
        jp: {
          title: '2024-2025年度 新任教員紹介',
          excerpt: '大阪大学・東京大学からの日本人教授2名を含む5名の新任教員を紹介します。',
          content: '<p>2024-2025年度、田中賢二教授（大阪大学）と鈴木ゆき准教授（東京大学）を含む5名の新任教員を迎えます。</p>',
          metaTitle: '新任教員紹介2024-2025',
          metaDescription: '日本語学部2024-2025年度新任教員5名の紹介。',
        },
      },
    },
    {
      slug: 'workshop-ky-nang-viet-cv-xin-viec-nhat-ban',
      category: 'student',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      published_at: '2024-10-28T00:00:00.000Z',
      translations: {
        vi: {
          title: 'Workshop: Kỹ Năng Viết CV và Phỏng Vấn Xin Việc Tại Nhật Bản',
          excerpt: 'Workshop thực hành với chuyên gia HR từ các công ty Nhật Bản, giúp sinh viên chuẩn bị tốt nhất cho thị trường việc làm Nhật.',
          content: '<p>Ngày 28/10/2024, Khoa Ngôn Ngữ Nhật tổ chức workshop kỹ năng viết CV và phỏng vấn xin việc tại Nhật Bản với 3 chuyên gia HR từ các tập đoàn Nhật Bản.</p>',
          metaTitle: 'Workshop CV và Phỏng Vấn Nhật Bản 2024',
          metaDescription: 'Workshop kỹ năng viết CV và phỏng vấn xin việc tại Nhật Bản.',
        },
        en: {
          title: 'Workshop: CV Writing and Job Interview Skills for Japan',
          excerpt: 'Practical workshop with HR experts from Japanese companies, helping students best prepare for the Japanese job market.',
          content: '<p>On October 28, 2024, the faculty organized a workshop on CV writing and job interview skills with 3 HR experts from Japanese corporations.</p>',
          metaTitle: 'Japan CV and Interview Workshop 2024',
          metaDescription: 'Workshop on CV writing and interview skills for Japanese job market.',
        },
        jp: {
          title: 'ワークショップ：日本での就職活動スキル',
          excerpt: '日系企業のHR専門家による実践的ワークショップ。',
          content: '<p>2024年10月28日、3名の日系企業HR専門家を招いて就職スキルワークショップを開催しました。</p>',
          metaTitle: '日本就職ワークショップ2024',
          metaDescription: '日本就職のための履歴書作成・面接スキルワークショップ。',
        },
      },
    },
  ];

  const insertedIds = [];
  for (const a of articles) {
    const result = insertArticle.run(
      a.slug, a.category, a.status, a.featured_image,
      adminId, a.published_at, JSON.stringify(a.translations)
    );
    insertedIds.push(result.lastInsertRowid);
  }

  console.log(`${insertedIds.length} articles seeded.`);
  return insertedIds;
}

function seedPrograms() {
  console.log('Seeding programs...');

  const insertProgram = db.prepare(`
    INSERT INTO programs (slug, type, duration, level, featured_image, status, sort_order, translations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const programs = [
    {
      slug: 'cu-nhan-ngon-ngu-nhat', type: 'formal', duration: '4 năm', level: 'Đại học',
      status: 'published', sort_order: 1,
      featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
      translations: {
        vi: { name: 'Cử nhân Ngôn ngữ Nhật', description: 'Chương trình đào tạo cử nhân ngôn ngữ Nhật toàn diện.', objectives: 'Đào tạo nguồn nhân lực chất lượng cao. Sinh viên tốt nghiệp đạt JLPT N2 hoặc N1.', curriculum: ['Năm 1: Tiếng Nhật cơ bản I-IV', 'Năm 2: Tiếng Nhật trung cấp + Văn hóa Nhật Bản', 'Năm 3: Tiếng Nhật nâng cao + Biên phiên dịch', 'Năm 4: Thực tập + Khóa luận tốt nghiệp'], requirements: 'Tốt nghiệp THPT', tuition: '18,000,000 VNĐ/năm' },
        en: { name: 'Bachelor of Japanese Language', description: 'A comprehensive Japanese language bachelor\'s program.', objectives: 'Train high-quality human resources proficient in Japanese. Graduates achieve JLPT N2 or N1.', curriculum: ['Year 1: Basic Japanese I-IV', 'Year 2: Intermediate Japanese + Culture', 'Year 3: Advanced Japanese + Translation', 'Year 4: Internship + Thesis'], requirements: 'High school graduation', tuition: '18,000,000 VND/year' },
        jp: { name: '日本語学士', description: '包括的な日本語学士プログラム。', objectives: '高品質な人材を育成。卒業生はJLPT N2またはN1を取得。', curriculum: ['1年：基礎日本語I-IV', '2年：中級日本語＋文化', '3年：上級日本語＋翻訳', '4年：実習＋卒業論文'], requirements: '高校卒業', tuition: '1800万VND/年' },
      },
    },
    {
      slug: 'cu-nhan-su-pham-tieng-nhat', type: 'formal', duration: '4 năm', level: 'Đại học',
      status: 'published', sort_order: 2,
      featured_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600',
      translations: {
        vi: { name: 'Cử nhân Sư phạm Tiếng Nhật', description: 'Chương trình đào tạo giáo viên tiếng Nhật chuyên nghiệp.', objectives: 'Đào tạo giáo viên tiếng Nhật có chuyên môn cao.', curriculum: ['Năm 1-2: Nền tảng tiếng Nhật + Tâm lý học giáo dục', 'Năm 3: Phương pháp dạy tiếng Nhật + Thực hành', 'Năm 4: Thực tập sư phạm + Nghiên cứu'], requirements: 'Tốt nghiệp THPT', tuition: '16,000,000 VNĐ/năm' },
        en: { name: 'Bachelor of Japanese Language Education', description: 'A professional Japanese language teacher training program.', objectives: 'Train highly qualified Japanese language teachers.', curriculum: ['Year 1-2: Japanese Foundation + Educational Psychology', 'Year 3: Japanese Teaching Methods + Practice', 'Year 4: Teaching Internship + Research'], requirements: 'High school graduation', tuition: '16,000,000 VND/year' },
        jp: { name: '日本語教育学士', description: '専門的な日本語教師育成プログラム。', objectives: '高資質の日本語教師を育成。', curriculum: ['1-2年：日本語基礎＋教育心理学', '3年：日本語教授法＋実践', '4年：教育実習＋研究'], requirements: '高校卒業', tuition: '1600万VND/年' },
      },
    },
    {
      slug: 'cu-nhan-bien-phien-dich-nhat', type: 'formal', duration: '4 năm', level: 'Đại học',
      status: 'published', sort_order: 3,
      featured_image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
      translations: {
        vi: { name: 'Cử nhân Biên phiên dịch Nhật - Việt', description: 'Chương trình đào tạo chuyên sâu về dịch thuật song ngữ Nhật-Việt.', objectives: 'Đào tạo biên phiên dịch viên chuyên nghiệp.', curriculum: ['Năm 1-2: Nền tảng + Lý thuyết dịch thuật', 'Năm 3: Biên dịch chuyên ngành + Phiên dịch liên tục', 'Năm 4: Phiên dịch cabin + Thực tập + Khóa luận'], requirements: 'JLPT N3 khi nhập học được ưu tiên', tuition: '20,000,000 VNĐ/năm' },
        en: { name: 'Bachelor of Japanese-Vietnamese Translation and Interpretation', description: 'A specialized program in Japanese-Vietnamese bilingual translation.', objectives: 'Train professional translators and interpreters.', curriculum: ['Year 1-2: Foundation + Translation Theory', 'Year 3: Specialized Translation + Consecutive Interpretation', 'Year 4: Booth Interpretation + Internship + Thesis'], requirements: 'JLPT N3 at enrollment preferred', tuition: '20,000,000 VND/year' },
        jp: { name: '日越翻訳通訳学士', description: '日越バイリンガル翻訳の専門プログラム。', objectives: 'プロの翻訳者・通訳者を育成。', curriculum: ['1-2年：基礎＋翻訳理論', '3年：専門翻訳＋逐次通訳', '4年：ブース通訳＋実習＋卒業論文'], requirements: '入学時JLPT N3取得者優遇', tuition: '2000万VND/年' },
      },
    },
    {
      slug: 'tieng-nhat-giao-tiep-nguoi-di-lam', type: 'non-formal', duration: '6 tháng', level: 'Chứng chỉ',
      status: 'published', sort_order: 4,
      featured_image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600',
      translations: {
        vi: { name: 'Tiếng Nhật Giao Tiếp (Người Đi Làm)', description: 'Khóa học tiếng Nhật thực dụng cho người đi làm.', objectives: 'Giúp học viên đạt trình độ giao tiếp cơ bản đến trung cấp. Tương đương JLPT N4-N3.', curriculum: ['Module 1: Giao tiếp văn phòng', 'Module 2: Tiếng Nhật thương mại', 'Module 3: Văn hóa kinh doanh Nhật Bản', 'Module 4: Thực hành tình huống'], requirements: 'Không yêu cầu kiến thức tiếng Nhật trước', tuition: '8,000,000 VNĐ/khóa' },
        en: { name: 'Communicative Japanese (Working Professionals)', description: 'A practical Japanese course for working professionals.', objectives: 'Help learners achieve basic to intermediate proficiency. Equivalent to JLPT N4-N3.', curriculum: ['Module 1: Office communication', 'Module 2: Business Japanese', 'Module 3: Japanese business culture', 'Module 4: Real-scenario practice'], requirements: 'No prior Japanese knowledge required', tuition: '8,000,000 VND/course' },
        jp: { name: '実用日本語（社会人向け）', description: '社会人向けの実用的な日本語コース。', objectives: 'JLPT N4〜N3相当のコミュニケーション能力を習得。', curriculum: ['モジュール1：オフィスコミュニケーション', 'モジュール2：ビジネス日本語', 'モジュール3：日本のビジネス文化', 'モジュール4：実践演習'], requirements: '日本語の予備知識不要', tuition: '800万VND/コース' },
      },
    },
    {
      slug: 'thac-si-ngon-ngu-nhat', type: 'postgraduate', duration: '2 năm', level: 'Thạc sĩ',
      status: 'published', sort_order: 5,
      featured_image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
      translations: {
        vi: { name: 'Thạc sĩ Ngôn ngữ học Nhật Bản', description: 'Chương trình thạc sĩ chuyên sâu về ngôn ngữ học Nhật Bản.', objectives: 'Đào tạo nhà nghiên cứu ngôn ngữ học Nhật Bản.', curriculum: ['HK 1-2: Lý thuyết ngôn ngữ học nâng cao', 'HK 3: Phương pháp nghiên cứu + Chuyên đề', 'HK 4: Luận văn thạc sĩ'], requirements: 'Cử nhân ngôn ngữ Nhật, JLPT N2', tuition: '25,000,000 VNĐ/năm' },
        en: { name: 'Master of Japanese Linguistics', description: 'An advanced master\'s program in Japanese linguistics.', objectives: 'Train Japanese linguistics researchers.', curriculum: ['Semester 1-2: Advanced Linguistics Theory', 'Semester 3: Research Methods + Seminars', 'Semester 4: Master\'s Thesis'], requirements: 'Bachelor\'s in Japanese language, JLPT N2', tuition: '25,000,000 VND/year' },
        jp: { name: '日本語言語学修士', description: '日本語言語学の高度な修士プログラム。', objectives: '日本語言語学研究者を育成。', curriculum: ['第1-2学期：上級言語学理論', '第3学期：研究方法論＋ゼミ', '第4学期：修士論文'], requirements: '日本語学士、JLPT N2', tuition: '2500万VND/年' },
      },
    },
    {
      slug: 'tien-si-ngon-ngu-nhat', type: 'postgraduate', duration: '3-4 năm', level: 'Tiến sĩ',
      status: 'published', sort_order: 6,
      featured_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600',
      translations: {
        vi: { name: 'Tiến sĩ Ngôn ngữ học Nhật Bản', description: 'Chương trình tiến sĩ ở cấp độ nghiên cứu cao nhất về ngôn ngữ học Nhật Bản.', objectives: 'Đào tạo tiến sĩ có khả năng dẫn đầu nghiên cứu học thuật.', curriculum: ['Năm 1: Học phần tiến sĩ + Đề cương luận án', 'Năm 2-3: Nghiên cứu độc lập + Viết luận án', 'Năm 4: Bảo vệ luận án'], requirements: 'Thạc sĩ ngôn ngữ Nhật, JLPT N1, có công trình nghiên cứu', tuition: '30,000,000 VNĐ/năm' },
        en: { name: 'Doctor of Philosophy in Japanese Linguistics', description: 'The highest level doctoral program in Japanese linguistics.', objectives: 'Train doctors capable of leading academic research.', curriculum: ['Year 1: Doctoral courses + Dissertation outline', 'Year 2-3: Independent research + Dissertation writing', 'Year 4: Dissertation defense'], requirements: 'Master\'s in Japanese linguistics, JLPT N1', tuition: '30,000,000 VND/year' },
        jp: { name: '日本語言語学博士', description: '日本語言語学研究の最高レベルの博士プログラム。', objectives: '学術研究を主導できる博士を育成。', curriculum: ['1年：博士必修科目＋論文概要', '2-3年：独立研究＋論文執筆', '4年：博士論文審査'], requirements: '日本語言語学修士、JLPT N1', tuition: '3000万VND/年' },
      },
    },
  ];

  for (const p of programs) {
    insertProgram.run(p.slug, p.type, p.duration, p.level, p.featured_image, p.status, p.sort_order, JSON.stringify(p.translations));
  }

  console.log(`${programs.length} programs seeded.`);
}

function seedResearch() {
  console.log('Seeding research items...');

  const insertResearch = db.prepare(`
    INSERT INTO research (slug, type, year, authors, tags, featured_image, status, translations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const researches = [
    {
      slug: 'so-sanh-cam-tu-kinh-ngu-nhat-viet', type: 'faculty', year: 2024,
      authors: ['PGS.TS. Nguyễn Văn Hùng', 'GS. Tanaka Kenji', 'TS. Lê Thị Mai'],
      tags: ['ngôn ngữ học', 'kính ngữ', 'đối chiếu', 'Nhật-Việt'],
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
      translations: {
        vi: { title: 'So Sánh Hệ Thống Kính Ngữ Tiếng Nhật và Hệ Thống Ngôn Ngữ Lịch Sự Tiếng Việt', abstract: 'Nghiên cứu phân tích và so sánh hệ thống kính ngữ (keigo) trong tiếng Nhật với hệ thống ngôn ngữ lịch sự trong tiếng Việt.', content: '<p>Kết quả cho thấy cả hai ngôn ngữ đều có hệ thống biểu đạt lịch sự phong phú nhưng với cơ chế khác nhau.</p>', keywords: ['kính ngữ', 'keigo', 'lịch sự', 'đối chiếu ngôn ngữ', 'Nhật-Việt'] },
        en: { title: 'Comparing the Japanese Honorific System (Keigo) and the Vietnamese Politeness System', abstract: 'This study analyzes and compares the honorific system (keigo) in Japanese with the politeness system in Vietnamese.', content: '<p>Results show that both languages have rich systems for expressing politeness but with entirely different mechanisms.</p>', keywords: ['honorifics', 'keigo', 'politeness', 'contrastive linguistics', 'Japanese-Vietnamese'] },
        jp: { title: '日本語の敬語システムとベトナム語の丁寧表現システムの比較', abstract: '日本語の敬語とベトナム語の丁寧表現を分析・比較する研究。', content: '<p>両言語に丁寧表現システムが存在しますが、メカニズムは全く異なります。</p>', keywords: ['敬語', 'keigo', '丁寧さ', '対照言語学', '日越比較'] },
      },
    },
    {
      slug: 'anh-huong-manga-anime-hoc-tieng-nhat', type: 'faculty', year: 2023,
      authors: ['TS. Phạm Thị Lan', 'ThS. Nguyễn Minh Tuấn'],
      tags: ['manga', 'anime', 'động lực học', 'giảng dạy', 'phương tiện truyền thông'],
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
      translations: {
        vi: { title: 'Ảnh Hưởng Của Manga và Anime Đến Động Lực Học Tiếng Nhật Của Sinh Viên Việt Nam', abstract: 'Nghiên cứu khảo sát 450 sinh viên học tiếng Nhật tại Việt Nam để đánh giá vai trò của manga và anime.', content: '<p>Kết quả cho thấy 78% sinh viên bắt đầu học tiếng Nhật do ảnh hưởng của manga/anime.</p>', keywords: ['manga', 'anime', 'động lực học tập', 'tiếng Nhật', 'sinh viên Việt Nam'] },
        en: { title: 'The Influence of Manga and Anime on Vietnamese Students\' Motivation to Learn Japanese', abstract: 'A survey of 450 Japanese language learners in Vietnam to assess the role of manga and anime.', content: '<p>Results show that 78% of students began learning Japanese due to manga/anime influence.</p>', keywords: ['manga', 'anime', 'learning motivation', 'Japanese language', 'Vietnamese students'] },
        jp: { title: 'マンガとアニメがベトナム人学生の日本語学習意欲に与える影響', abstract: 'ベトナムで日本語を学ぶ450名の学生を調査した研究。', content: '<p>78%の学生がマンガ・アニメの影響で日本語学習を始めました。</p>', keywords: ['マンガ', 'アニメ', '学習動機', '日本語', 'ベトナム人学生'] },
      },
    },
    {
      slug: 'phan-tich-loi-sai-ngu-phap-sinh-vien-viet', type: 'student', year: 2024,
      authors: ['Trần Thị Bích Ngọc', 'GS. Suzuki Yuki (hướng dẫn)'],
      tags: ['phân tích lỗi', 'ngữ pháp', 'sinh viên Việt Nam', 'trợ từ'],
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
      translations: {
        vi: { title: 'Phân Tích Lỗi Sai Trong Sử Dụng Trợ Từ Tiếng Nhật Của Sinh Viên Người Việt', abstract: 'Phân tích các loại lỗi sai phổ biến trong việc sử dụng trợ từ tiếng Nhật của sinh viên Việt Nam.', content: '<p>Tỷ lệ nhầm lẫn giữa は và が cao nhất (34%).</p>', keywords: ['trợ từ', 'joshi', 'phân tích lỗi', 'người học tiếng Nhật', 'Việt Nam'] },
        en: { title: 'Error Analysis in Japanese Particle Usage by Vietnamese Students', abstract: 'Master\'s thesis analyzing common error types in the use of Japanese particles by Vietnamese students.', content: '<p>The confusion rate between は and が is highest (34%).</p>', keywords: ['particles', 'joshi', 'error analysis', 'Japanese learners', 'Vietnam'] },
        jp: { title: 'ベトナム人学生による日本語助詞使用の誤用分析', abstract: 'ベトナム人学生による日本語助詞の使用における誤用パターンを分析した修士論文。', content: '<p>はとがの混同率が最も高く（34%）。</p>', keywords: ['助詞', 'joshi', '誤用分析', '日本語学習者', 'ベトナム'] },
      },
    },
    {
      slug: 'dich-thuat-truyen-tranh-nhat-bang-ai', type: 'student', year: 2024,
      authors: ['Lê Văn Quang', 'Phạm Hữu Đức', 'TS. Nguyễn Thị Phương (hướng dẫn)'],
      tags: ['dịch máy', 'AI', 'manga', 'NLP', 'tiếng Nhật'],
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600',
      translations: {
        vi: { title: 'Ứng Dụng AI Trong Dịch Thuật Truyện Tranh Nhật Bản (Manga) Sang Tiếng Việt', abstract: 'Nghiên cứu thử nghiệm và đánh giá hiệu quả của các mô hình AI trong việc dịch manga.', content: '<p>GPT-4 đạt điểm BLEU cao nhất (0.72) nhưng vẫn gặp khó khăn với onomatopoeia.</p>', keywords: ['AI dịch thuật', 'manga', 'NLP', 'tiếng Nhật-Việt', 'GPT-4'] },
        en: { title: 'Applying AI in Translating Japanese Manga to Vietnamese', abstract: 'Research testing and evaluating AI models in translating manga from Japanese to Vietnamese.', content: '<p>GPT-4 achieves the highest BLEU score (0.72) but still struggles with manga-specific onomatopoeia.</p>', keywords: ['AI translation', 'manga', 'NLP', 'Japanese-Vietnamese', 'GPT-4'] },
        jp: { title: '日本語マンガのベトナム語翻訳へのAI応用', abstract: 'AIの日本語マンガからベトナム語への翻訳における有効性を検証する研究。', content: '<p>GPT-4が最も高いBLEUスコア（0.72）を達成しました。</p>', keywords: ['AI翻訳', 'マンガ', 'NLP', '日越翻訳', 'GPT-4'] },
      },
    },
  ];

  for (const r of researches) {
    insertResearch.run(
      r.slug, r.type, r.year,
      JSON.stringify(r.authors), JSON.stringify(r.tags),
      r.featured_image, r.status, JSON.stringify(r.translations)
    );
  }

  console.log(`${researches.length} research items seeded.`);
}

function seedTests() {
  console.log('Seeding tests...');

  const insertTest = db.prepare(`
    INSERT INTO tests (slug, category, duration, passing_score, status, translations, questions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const tests = [
    {
      slug: 'luyen-thi-jlpt-n5-co-ban', category: 'N5', duration: 20, passing_score: 60, status: 'active',
      translations: {
        vi: { title: 'Luyện Thi JLPT N5 - Từ Vựng Cơ Bản', description: 'Bài kiểm tra từ vựng và ngữ pháp cơ bản N5, phù hợp cho người mới bắt đầu học tiếng Nhật.' },
        en: { title: 'JLPT N5 Practice - Basic Vocabulary', description: 'Basic N5 vocabulary and grammar test, suitable for beginners learning Japanese.' },
        jp: { title: 'JLPT N5 練習 - 基本語彙', description: 'N5の基本語彙と文法テスト。日本語初心者向け。' },
      },
      questions: [
        { text: 'この___は何ですか？ Choose the correct word: "book" in Japanese', options: ['ほん (hon)', 'くるま (kuruma)', 'いぬ (inu)', 'たべもの (tabemono)'], correctIndex: 0, explanation: '「ほん（本）」は英語で "book" という意味です。' },
        { text: '「おはようございます」の意味は何ですか？', options: ['Good morning', 'Good evening', 'Good night', 'Goodbye'], correctIndex: 0, explanation: '「おはようございます」は朝の挨拶で "Good morning" という意味です。' },
        { text: 'わたしは___です。(I am a student.)', options: ['せんせい (sensei)', 'がくせい (gakusei)', 'いしゃ (isha)', 'かいしゃいん (kaishain)'], correctIndex: 1, explanation: '「がくせい（学生）」= student.' },
        { text: 'これは___えんぴつです。(This is _____ pencil.) Choose "my":', options: ['あなたの (anata no)', 'かれの (kare no)', 'わたしの (watashi no)', 'かのじょの (kanojo no)'], correctIndex: 2, explanation: '「わたしの（私の）」= my/mine.' },
        { text: '今___時ですか？ Choose the correct word for "time/hour":', options: ['ふん (fun)', 'じ (ji)', 'にち (nichi)', 'げつ (getsu)'], correctIndex: 1, explanation: '「じ（時）」は時間（hour/o\'clock）を表します。' },
        { text: 'What does 「みず（水）」mean?', options: ['Fire', 'Wind', 'Water', 'Earth'], correctIndex: 2, explanation: '「みず（水）」= water。' },
        { text: 'どこ___トイレはありますか？ Choose the correct particle:', options: ['が', 'を', 'に', 'の'], correctIndex: 2, explanation: '場所の存在を表す文では「に」を使います。' },
        { text: '私は毎日学校___行きます。 Choose the correct particle:', options: ['が', 'に', 'で', 'は'], correctIndex: 1, explanation: '方向・目的地を示すには「に」を使います。' },
        { text: '「たかい」の意味として正しいものはどれですか？', options: ['Cheap / Low', 'Expensive / High', 'Big / Large', 'Small / Little'], correctIndex: 1, explanation: '「たかい（高い）」= expensive or tall/high.' },
        { text: '___はりんごを食べます。 Choose "I" in Japanese:', options: ['あなた (anata)', 'かれ (kare)', 'わたし (watashi)', 'かのじょ (kanojo)'], correctIndex: 2, explanation: '「わたし（私）」= I/me。' },
      ],
    },
    {
      slug: 'luyen-thi-jlpt-n4-trung-cap', category: 'N4', duration: 25, passing_score: 60, status: 'active',
      translations: {
        vi: { title: 'Luyện Thi JLPT N4 - Ngữ Pháp Trung Cấp', description: 'Bài kiểm tra ngữ pháp và từ vựng N4, dành cho người học đã có nền tảng N5.' },
        en: { title: 'JLPT N4 Practice - Intermediate Grammar', description: 'N4 grammar and vocabulary test for learners who have an N5 foundation.' },
        jp: { title: 'JLPT N4 練習 - 中級文法', description: 'N5の基礎がある学習者向けのN4文法・語彙テスト。' },
      },
      questions: [
        { text: '彼女は歌が___。(She is good at singing.)', options: ['じょうずです (jouzu desu)', 'へたです (heta desu)', 'すきです (suki desu)', 'きらいです (kirai desu)'], correctIndex: 0, explanation: '「じょうず（上手）」= skilled/good at.' },
        { text: '雨が降って___、試合は中止になりました。', options: ['いたので', 'いたから', 'いたのに', 'いたし'], correctIndex: 1, explanation: '「〜から」は理由・原因を表す接続助詞です。' },
        { text: '日本語を___ようになりました。(I have become able to speak Japanese.)', options: ['話せる (hanaseru)', '話した (hanashita)', '話す (hanasu)', '話して (hanashite)'], correctIndex: 0, explanation: '「〜ようになる」前には可能形を使います。' },
        { text: 'この映画は___ことがあります。(I have seen this movie before.)', options: ['見る', '見た', '見ている', '見て'], correctIndex: 1, explanation: '「〜たことがある」は経験を表す表現です。' },
        { text: '友達に手紙を___もらいました。(I had my friend write a letter for me.)', options: ['書いて', '書いた', '書く', '書き'], correctIndex: 0, explanation: '「〜てもらう」= have someone do something for you.' },
        { text: '彼は学生___、アルバイトもしています。(Although he is a student, he also works part-time.)', options: ['なのに', 'だから', 'ので', 'でも'], correctIndex: 0, explanation: '「〜なのに」は逆接を表します。' },
        { text: '宿題を___しまいました。(I accidentally forgot to do my homework.)', options: ['忘れて', '忘れた', '忘れる', '忘れ'], correctIndex: 0, explanation: '「〜てしまう」は完了や後悔を表します。' },
        { text: '早く起きられる___、早めに寝てください。', options: ['ように', 'ために', 'から', 'ので'], correctIndex: 0, explanation: '「〜ように」は目標・目的を表す用法です。' },
        { text: '「けいけん」の漢字として正しいものはどれですか？', options: ['経験', '計画', '環境', '記念'], correctIndex: 0, explanation: '「けいけん（経験）」= experience.' },
        { text: '先生は学生___試験を受けさせました。', options: ['に', 'が', 'を', 'で'], correctIndex: 0, explanation: '使役形「〜させる」では行為をする人に「に」を使います。' },
      ],
    },
    {
      slug: 'tong-hop-van-hoa-nhat-ban', category: 'general', duration: 15, passing_score: 60, status: 'active',
      translations: {
        vi: { title: 'Kiến Thức Văn Hóa Nhật Bản Tổng Hợp', description: 'Bài kiểm tra kiến thức văn hóa, phong tục, lịch sử và xã hội Nhật Bản dành cho mọi trình độ.' },
        en: { title: 'Japanese Culture General Knowledge Quiz', description: 'A quiz on Japanese culture, customs, history, and society for all levels.' },
        jp: { title: '日本文化総合知識クイズ', description: 'すべてのレベル向けの日本の文化、習慣、歴史、社会に関するクイズ。' },
      },
      questions: [
        { text: 'Núi nào là biểu tượng nổi tiếng nhất của Nhật Bản?', options: ['Núi Fuji (富士山)', 'Núi Aso (阿蘇山)', 'Núi Koya (高野山)', 'Núi Hiei (比叡山)'], correctIndex: 0, explanation: '富士山（ふじさん）là ngọn núi cao nhất Nhật Bản (3,776m).' },
        { text: 'Lễ hội hoa anh đào của Nhật Bản được gọi là gì?', options: ['Hanami (花見)', 'Matsuri (祭り)', 'Obon (お盆)', 'Hatsumode (初詣)'], correctIndex: 0, explanation: '「花見（はなみ）」= flower viewing.' },
        { text: 'Đơn vị tiền tệ của Nhật Bản là gì?', options: ['Won (원)', 'Yen (円)', 'Baht (บาท)', 'Yuan (元)'], correctIndex: 1, explanation: '日本の通貨は「円（えん/Yen）」です。' },
        { text: 'Thủ đô của Nhật Bản là thành phố nào?', options: ['Osaka', 'Kyoto', 'Tokyo (東京)', 'Hiroshima'], correctIndex: 2, explanation: '東京（とうきょう）は日本の首都です。' },
        { text: 'Võ đạo truyền thống nào của Nhật Bản có nghĩa là "Con đường của kiếm"?', options: ['Judo (柔道)', 'Kendo (剣道)', 'Aikido (合気道)', 'Karate (空手)'], correctIndex: 1, explanation: '「剣道（けんどう）」= Kendo, 剣=sword, 道=way.' },
        { text: 'Nghệ thuật gấp giấy truyền thống của Nhật Bản được gọi là gì?', options: ['Ikebana (生け花)', 'Origami (折り紙)', 'Bonsai (盆栽)', 'Sumi-e (墨絵)'], correctIndex: 1, explanation: '「折り紙（おりがみ）」= origami. 折る=fold, 紙=paper.' },
        { text: 'Anime "Spirited Away" của đạo diễn Hayao Miyazaki có tên tiếng Nhật là gì?', options: ['となりのトトロ', 'もののけ姫', '千と千尋の神隠し', '風の谷のナウシカ'], correctIndex: 2, explanation: '「千と千尋の神隠し」= Spirited Away (2001).' },
        { text: 'Trang phục truyền thống của Nhật Bản là gì?', options: ['Hanbok (한복)', 'Kimono (着物)', 'Ao dai', 'Cheongsam (旗袍)'], correctIndex: 1, explanation: '「着物（きもの）」= kimono.' },
        { text: 'Mì Nhật Bản nào được làm từ kiều mạch (buckwheat)?', options: ['Ramen (ラーメン)', 'Udon (うどん)', 'Soba (そば)', 'Somen (そうめん)'], correctIndex: 2, explanation: '「そば（蕎麦）」= soba noodles, made from buckwheat flour.' },
        { text: 'Năm nào Nhật Bản tổ chức Thế vận hội Mùa hè lần đầu tiên tại Tokyo?', options: ['1952', '1960', '1964', '1972'], correctIndex: 2, explanation: 'Nhật Bản tổ chức Thế vận hội Mùa hè đầu tiên tại Tokyo vào năm 1964.' },
      ],
    },
  ];

  for (const t of tests) {
    insertTest.run(t.slug, t.category, t.duration, t.passing_score, t.status, JSON.stringify(t.translations), JSON.stringify(t.questions));
  }

  console.log(`${tests.length} tests seeded.`);
}

function seedComments(articleIds, user1Id, user2Id) {
  console.log('Seeding comments...');

  const insertComment = db.prepare(`
    INSERT INTO comments (article_id, author_id, guest_name, guest_email, content, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const comments = [
    { article_id: articleIds[0], author_id: user1Id, guest_name: null, guest_email: null, content: 'Thật vui khi nghe về lễ khai giảng! Năm nay khoa có nhiều hoạt động thú vị quá.', status: 'approved' },
    { article_id: articleIds[0], author_id: user2Id, guest_name: null, guest_email: null, content: 'Tôi là sinh viên năm nhất mới vào trường. Rất hào hứng với chương trình học năm nay!', status: 'approved' },
    { article_id: articleIds[1], author_id: null, guest_name: 'Nguyễn Văn An', guest_email: 'nguyenan@email.com', content: 'Hội thảo giao lưu văn hóa Nhật-Việt năm nay thật tuyệt! Phần trình diễn trống taiko là ấn tượng nhất.', status: 'approved' },
    { article_id: articleIds[2], author_id: user1Id, guest_name: null, guest_email: null, content: 'Cảm ơn khoa đã đăng thông tin học bổng MEXT! Tôi đang chuẩn bị hồ sơ.', status: 'approved' },
    { article_id: articleIds[6], author_id: null, guest_name: 'Trần Thị Hương', guest_email: 'thuong.tran@gmail.com', content: 'Chúc mừng bạn Lan Anh đã đạt giải Nhất! Thật tự hào cho khoa chúng ta.', status: 'approved' },
  ];

  for (const c of comments) {
    insertComment.run(c.article_id, c.author_id, c.guest_name, c.guest_email, c.content, c.status);
  }

  console.log(`${comments.length} comments seeded.`);
}

function main() {
  try {
      const { adminId, user1Id, user2Id } = seedUsers();
    const articleIds = seedArticles(adminId);
    seedPrograms();
    seedResearch();
    seedTests();
    seedComments(articleIds, user1Id, user2Id);

    console.log('\nSeed completed successfully!');
    console.log('-----------------------------------------');
    console.log('Admin Login:');
    console.log('  Email:    admin@japanesefaculty.edu.vn');
    console.log('  Password: Admin@123');
    console.log('-----------------------------------------');
    console.log('Moderator Login:');
    console.log('  Email:    moderator@japanesefaculty.edu.vn');
    console.log('  Password: Mod@123');
    console.log('-----------------------------------------');
    console.log('Test User Login:');
    console.log('  Email:    user1@japanesefaculty.edu.vn');
    console.log('  Password: User@123');
    console.log('-----------------------------------------');
    console.log('API Base URL: http://localhost:5010/api');
    console.log('-----------------------------------------');

  } catch (err) {
    console.error('Seed error:', err);
  }
}

main();
