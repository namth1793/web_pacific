'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const CLUBS = [
  { name: 'CLB Tiếng Nhật', jp: '日本語クラブ', desc: 'Câu lạc bộ giao lưu và thực hành tiếng Nhật hàng tuần với người bản xứ.', icon: '🗣️', members: 120 },
  { name: 'CLB Văn Hóa Nhật', jp: '文化クラブ', desc: 'Khám phá trà đạo, thư pháp, ikebana và các nghệ thuật truyền thống Nhật Bản.', icon: '🍵', members: 80 },
  { name: 'CLB Anime & Manga', jp: 'アニメ部', desc: 'Cộng đồng yêu thích anime, manga và văn hóa đại chúng Nhật Bản.', icon: '🎌', members: 200 },
  { name: 'CLB Kinh Doanh Nhật', jp: 'ビジネス部', desc: 'Phát triển kỹ năng kinh doanh và nhật ngữ thương mại cho môi trường doanh nghiệp Nhật.', icon: '💼', members: 60 },
];

const COMPETITIONS = [
  { name: 'Cuộc Thi Hùng Biện Tiếng Nhật', date: '2024-03', level: 'Cấp Quốc Gia', result: '🥇 Giải Nhất - Nguyễn Thị Lan', icon: '🎤' },
  { name: 'Kỳ Thi JLPT N1 Xuất Sắc', date: '2023-12', level: 'Quốc Tế', result: '🏅 5 sinh viên đạt N1', icon: '📜' },
  { name: 'Olympic Tiếng Nhật Toàn Quốc', date: '2024-04', level: 'Cấp Quốc Gia', result: '🥈 Giải Nhì Toàn Đoàn', icon: '🏆' },
  { name: 'Cuộc Thi Dịch Thuật Manga', date: '2024-02', level: 'Cấp Trường', result: '🎖️ 3 giải thưởng', icon: '📚' },
];

const OUTSTANDING = [
  { name: 'Nguyễn Thị Lan', class: 'K21', achievement: 'JLPT N1 + Học bổng Monbukagakusho', avatar: '👩‍🎓' },
  { name: 'Trần Văn Minh', class: 'K22', achievement: 'Hùng biện tiếng Nhật quốc gia - Giải Nhất', avatar: '🧑‍🎓' },
  { name: 'Lê Thị Hoa', class: 'K20', achievement: 'Thực tập Toyota Japan - GPA 3.8/4.0', avatar: '👩‍💼' },
  { name: 'Phạm Quốc Anh', class: 'K21', achievement: 'NAT-Test A-B đạt 95% + Tuyển dụng Sony', avatar: '🧑‍💻' },
];

const ALUMNI = [
  { name: 'Võ Thị Nhung', year: '2018', job: 'Phiên dịch viên - Toyota Vietnam', company: 'Toyota' },
  { name: 'Nguyễn Đức Thành', year: '2019', job: 'Chuyên viên đối ngoại - Sony Vietnam', company: 'Sony' },
  { name: 'Trần Thị Kim Anh', year: '2020', job: 'Giảng viên tiếng Nhật - Đại học Đà Nẵng', company: 'UDN' },
  { name: 'Lê Hoàng Nam', year: '2017', job: 'Giám đốc kinh doanh - Công ty Nhật Bản', company: 'MIPRO' },
  { name: 'Đặng Minh Hằng', year: '2021', job: 'Kỹ sư phần mềm - Fujitsu Vietnam', company: 'Fujitsu' },
  { name: 'Phan Thanh Tùng', year: '2016', job: 'Nhà sáng lập - Công ty Dịch Thuật JP-VN', company: 'Tự kinh doanh' },
];

export default function StudentsPage() {
  const t = useTranslations('students');
  const locale = useLocale();
  const localePath = (href) => `/${locale}${href}`;

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="text-red-200 text-sm mb-3 flex items-center gap-2">
              <Link href={localePath('')} className="hover:text-white">Trang Chủ</Link>
              <span>/</span>
              <span className="text-white">{t('title')}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          </motion.div>
        </div>
      </div>

      {/* Clubs */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('clubs')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLUBS.map((club, i) => (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center group hover:border-primary/30"
              >
                <div className="text-4xl mb-3">{club.icon}</div>
                <h3 className="font-bold text-japanese-dark mb-1 group-hover:text-primary transition-colors">{club.name}</h3>
                <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'Noto Sans JP' }}>{club.jp}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{club.desc}</p>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{club.members} thành viên</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions */}
      <section className="py-14 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('competitions')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMPETITIONS.map((comp, i) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <div className="text-3xl">{comp.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-japanese-dark mb-1">{comp.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span>📅 {comp.date}</span>
                    <span>🏅 {comp.level}</span>
                  </div>
                  <p className="text-sm text-green-700 font-medium">{comp.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outstanding Students */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('outstanding')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OUTSTANDING.map((student, i) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 text-center"
              >
                <div className="text-4xl mb-3">{student.avatar}</div>
                <h3 className="font-bold text-japanese-dark">{student.name}</h3>
                <p className="text-xs text-gray-400 mb-2">Khóa {student.class}</p>
                <p className="text-sm text-primary font-medium leading-tight">{student.achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni */}
      <section className="py-14 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('alumni')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALUMNI.map((alumni, i) => (
              <motion.div
                key={alumni.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  {alumni.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-japanese-dark">{alumni.name}</h3>
                  <p className="text-xs text-gray-400">Tốt nghiệp {alumni.year}</p>
                  <p className="text-sm text-gray-600 mt-1">{alumni.job}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Abroad */}
      <section className="py-14 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[150px] font-bold text-white/5" style={{ fontFamily: 'Noto Sans JP' }}>留学</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-3">{t('abroad')}</h2>
            <p className="text-red-100 text-lg mb-6">Cơ hội học tập và trải nghiệm tại Nhật Bản với học bổng hấp dẫn</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Học Bổng/Năm', value: '50+' },
                { label: 'Trường ĐH Đối Tác', value: '12' },
                { label: 'Sinh Viên Đã Đi', value: '200+' },
                { label: 'Tỷ Lệ Thành Công', value: '95%' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-red-100 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <Link href={localePath('/admission')} className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded hover:bg-red-50 transition-colors">
              Tìm Hiểu Học Bổng →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
