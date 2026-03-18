'use client';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FACULTY_MEMBERS = [
  { name: 'PGS.TS. Tanaka Yuki', role: 'Language & Linguistics', role_vi: 'Ngôn Ngữ & Ngôn Ngữ Học', email: 'tanaka.yuki@university.edu.vn', jp_name: '田中雪' },
  { name: 'TS. Trần Minh Đức', role: 'Japanese Culture', role_vi: 'Văn Hóa Nhật Bản', email: 'tranminhduc@university.edu.vn', jp_name: '' },
  { name: 'ThS. Suzuki Kenji', role: 'Business Japanese', role_vi: 'Nhật Ngữ Thương Mại', email: 'suzuki.kenji@university.edu.vn', jp_name: '鈴木健二' },
  { name: 'TS. Lê Thị Mai', role: 'Japanese Literature', role_vi: 'Văn Học Nhật Bản', email: 'lethimai@university.edu.vn', jp_name: '' },
  { name: 'ThS. Yamamoto Ryota', role: 'Japanese History', role_vi: 'Lịch Sử Nhật Bản', email: 'yamamoto.ryota@university.edu.vn', jp_name: '山本涼太' },
  { name: 'TS. Phạm Quang Huy', role: 'Translation Studies', role_vi: 'Nghiên Cứu Dịch Thuật', email: 'phamquanghuy@university.edu.vn', jp_name: '' },
];

const PARTNERS = [
  { name: 'Toyota Motor Corporation', type: 'Doanh Nghiệp', country: '🇯🇵' },
  { name: 'Sony Group', type: 'Doanh Nghiệp', country: '🇯🇵' },
  { name: 'Waseda University', type: 'Đại Học', country: '🇯🇵' },
  { name: 'Osaka University', type: 'Đại Học', country: '🇯🇵' },
  { name: 'JICA Vietnam', type: 'Tổ Chức', country: '🇯🇵' },
  { name: 'Japan Foundation', type: 'Tổ Chức', country: '🇯🇵' },
];

const FACILITIES = [
  { name: 'Phòng Học Tiếng Nhật', desc: '8 phòng học chuyên dụng với thiết bị nghe nhìn hiện đại', icon: '🏫' },
  { name: 'Thư Viện Nhật Bản', desc: '5,000+ đầu sách và tài liệu tiếng Nhật', icon: '📚' },
  { name: 'Phòng Văn Hóa Nhật', desc: 'Không gian trải nghiệm văn hóa trà đạo, thư pháp', icon: '🍵' },
  { name: 'Phòng Lab Ngôn Ngữ', desc: 'Phòng thực hành nghe - nói với 40 booth cá nhân', icon: '🎧' },
];

function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10"
    >
      <div className="japanese-divider">
        <h2 className="section-title mb-0">{title}</h2>
      </div>
      {subtitle && <p className="text-japanese-muted">{subtitle}</p>}
    </motion.div>
  );
}

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="text-red-200 text-sm mb-3 flex items-center gap-2">
              <Link href={`/${locale}`} className="hover:text-white">Trang Chủ</Link>
              <span>/</span>
              <span className="text-white">{t('title')}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          </motion.div>
        </div>
      </div>

      {/* Dean's Message */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('dean_message')} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-primary/10 to-red-50 rounded-2xl p-8 text-center">
                <div className="w-28 h-28 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center text-5xl">
                  👩‍🎓
                </div>
                <h3 className="font-bold text-japanese-dark text-lg">GS.TS. Nguyễn Thị Hoa</h3>
                <p className="text-primary text-sm font-medium mt-1">Trưởng Khoa Nhật Bản Học</p>
                <p className="text-gray-500 text-xs mt-2">Tiến sĩ tại Đại học Tokyo</p>
                <p className="text-gray-500 text-xs">20+ năm kinh nghiệm nghiên cứu & giảng dạy</p>
                <div className="mt-4 pt-4 border-t border-primary/20 text-xs text-gray-500">
                  <div>nguyenthihoa@university.edu.vn</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="prose prose-gray max-w-none">
                <div className="text-4xl text-primary/20 font-serif leading-none mb-2">"</div>
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  Kính chào quý vị và các bạn sinh viên! Khoa Nhật Bản Học tự hào là cầu nối văn hóa giữa Việt Nam và Nhật Bản. Trong 25 năm hình thành và phát triển, chúng tôi không ngừng nỗ lực để nâng cao chất lượng đào tạo, nghiên cứu khoa học và hợp tác quốc tế.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  Với sứ mệnh đào tạo những chuyên gia Nhật Bản học có trình độ cao, am hiểu sâu sắc về ngôn ngữ, văn hóa, kinh tế và xã hội Nhật Bản, chúng tôi cam kết tạo ra môi trường học thuật năng động và cởi mở cho sinh viên phát triển toàn diện.
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  Tôi tin tưởng rằng việc học tiếng Nhật không chỉ mở ra cơ hội nghề nghiệp mà còn là hành trình khám phá một nền văn hóa phong phú và độc đáo. Hãy cùng chúng tôi xây dựng tương lai tươi sáng!
                </p>
                <div className="mt-6 text-sm text-gray-500 font-medium">
                  GS.TS. Nguyễn Thị Hoa — Trưởng Khoa Nhật Bản Học
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('vision')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🎯</div>
                <h3 className="text-xl font-bold text-japanese-dark">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trở thành trung tâm đào tạo Nhật Bản học hàng đầu khu vực Đông Nam Á, được công nhận bởi các trường đại học và doanh nghiệp Nhật Bản uy tín.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🚀</div>
                <h3 className="text-xl font-bold text-japanese-dark">Sứ Mệnh</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực Nhật Bản học; thúc đẩy nghiên cứu khoa học và hợp tác quốc tế; kết nối văn hóa Việt - Nhật vì sự phát triển bền vững.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: '🌏', title: 'Hội Nhập Quốc Tế', desc: 'Tích cực tham gia các chương trình trao đổi quốc tế với các trường ĐH Nhật Bản' },
              { icon: '💼', title: 'Định Hướng Nghề Nghiệp', desc: 'Kết nối sinh viên với doanh nghiệp Nhật Bản qua chương trình thực tập và tuyển dụng' },
              { icon: '🔬', title: 'Nghiên Cứu Khoa Học', desc: 'Thúc đẩy nghiên cứu về ngôn ngữ, văn hóa, kinh tế xã hội Nhật Bản' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-japanese-dark mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Members */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('faculty')} subtitle="Đội ngũ giảng viên giàu kinh nghiệm, nhiều người có bằng tiến sĩ từ Nhật Bản" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACULTY_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-red-50 mx-auto mb-4 flex items-center justify-center text-3xl">
                  👨‍🏫
                </div>
                <h3 className="font-bold text-japanese-dark mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                {member.jp_name && (
                  <p className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Noto Sans JP' }}>{member.jp_name}</p>
                )}
                <p className="text-primary text-sm font-medium mb-2">{member.role_vi}</p>
                <p className="text-gray-400 text-xs">{member.email}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('facilities')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.map((facility, i) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-3">{facility.icon}</div>
                <h4 className="font-bold text-japanese-dark mb-2 text-sm">{facility.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Japanese Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('partners')} subtitle="Mạng lưới đối tác rộng lớn tại Nhật Bản" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-gray-200 rounded-xl p-4 text-center hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">{partner.country}</div>
                <h4 className="font-semibold text-japanese-dark text-xs leading-tight mb-1">{partner.name}</h4>
                <span className="text-xs text-gray-400">{partner.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
