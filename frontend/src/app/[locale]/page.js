'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { articleAPI, programAPI } from '@/lib/api';
import { formatDate, getTranslation, getImageUrl, truncate } from '@/lib/utils';
import Image from 'next/image';

const STATS = [
  { value: '1,200+', key: 'students', icon: '👨‍🎓' },
  { value: '45', key: 'teachers', icon: '👩‍🏫' },
  { value: '30+', key: 'partners', icon: '🤝' },
  { value: '25', key: 'years', icon: '📅' },
];

const PROGRAMS_FALLBACK = [
  {
    id: 1,
    slug: 'cu-nhan-ngon-ngu-nhat',
    translations: {
      vi: { title: 'Cử Nhân Ngôn Ngữ Nhật', excerpt: 'Chương trình đào tạo 4 năm, trang bị kỹ năng ngôn ngữ Nhật Bản toàn diện từ N5 đến N2.' },
      en: { title: 'Bachelor in Japanese Language', excerpt: '4-year program equipping comprehensive Japanese language skills from N5 to N2.' }
    },
    type: 'formal', level: 'Đại Học', duration: '4 năm'
  },
  {
    id: 2,
    slug: 'luyen-thi-jlpt',
    translations: {
      vi: { title: 'Luyện Thi JLPT N1-N5', excerpt: 'Khóa học luyện thi chứng chỉ quốc tế JLPT, hỗ trợ từ N5 đến N1 với giảng viên kinh nghiệm.' },
      en: { title: 'JLPT N1-N5 Preparation', excerpt: 'International JLPT certification prep course from N5 to N1 with experienced lecturers.' }
    },
    type: 'non_formal', level: 'Chứng Chỉ', duration: '6 tháng'
  },
  {
    id: 3,
    slug: 'thac-si-nhat-ban-hoc',
    translations: {
      vi: { title: 'Thạc Sĩ Nhật Bản Học', excerpt: 'Chương trình đào tạo sau đại học chuyên sâu về văn hóa, xã hội và kinh tế Nhật Bản.' },
      en: { title: 'Master in Japanese Studies', excerpt: 'Postgraduate program specializing in Japanese culture, society and economics.' }
    },
    type: 'postgraduate', level: 'Thạc Sĩ', duration: '2 năm'
  },
];

const ARTICLES_FALLBACK = [
  {
    id: 1,
    slug: 'ket-qua-jlpt-thang-12',
    published_at: '2024-01-15',
    category: 'Tin Tức',
    cover_image: null,
    translations: {
      vi: { title: 'Kết Quả Kỳ Thi JLPT Tháng 12/2023', excerpt: '95% sinh viên vượt qua kỳ thi JLPT với thành tích xuất sắc, nhiều em đạt N2 và N1.' },
      en: { title: 'JLPT December 2023 Results', excerpt: '95% of students passed JLPT with excellent results, many achieving N2 and N1.' }
    }
  },
  {
    id: 2,
    slug: 'hoi-thao-viet-nhat-2024',
    published_at: '2024-01-20',
    category: 'Sự Kiện',
    cover_image: null,
    translations: {
      vi: { title: 'Hội Thảo Nghiên Cứu Việt - Nhật 2024', excerpt: 'Hội thảo quy tụ hơn 200 nhà nghiên cứu từ Việt Nam và Nhật Bản thảo luận về quan hệ hai nước.' },
      en: { title: 'Vietnam-Japan Research Conference 2024', excerpt: 'Conference gathering 200+ researchers from Vietnam and Japan discussing bilateral relations.' }
    }
  },
  {
    id: 3,
    slug: 'sinh-vien-thuc-tap-nhat-ban',
    published_at: '2024-02-01',
    category: 'Sinh Viên',
    cover_image: null,
    translations: {
      vi: { title: '20 Sinh Viên Xuất Sắc Thực Tập Tại Nhật Bản', excerpt: 'Chương trình thực tập hợp tác với Toyota, Sony và Panasonic mang đến cơ hội quý báu cho sinh viên.' },
      en: { title: '20 Outstanding Students Intern in Japan', excerpt: 'Internship program with Toyota, Sony and Panasonic provides invaluable opportunities for students.' }
    }
  },
];

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [articles, setArticles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    articleAPI.getAll({ limit: 3, featured: true })
      .then(res => setArticles(res.data?.articles || res.data || []))
      .catch(() => setArticles(ARTICLES_FALLBACK))
      .finally(() => setLoadingArticles(false));

    programAPI.getAll({ limit: 3 })
      .then(res => setPrograms(res.data?.programs || res.data || []))
      .catch(() => setPrograms(PROGRAMS_FALLBACK))
      .finally(() => setLoadingPrograms(false));
  }, []);

  const localePath = (href) => `/${locale}${href}`;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-gray-50">
        {/* Decorative Japanese circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border-4 border-primary/5" />
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full border-4 border-primary/8" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-primary/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full border-2 border-primary/5" />
        </div>

        {/* Large Japanese character background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center overflow-hidden pointer-events-none">
          <span
            className="text-[280px] font-bold text-primary/5 select-none leading-none"
            style={{ fontFamily: 'Noto Sans JP' }}
          >
            日本語
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <span className="text-base" style={{ fontFamily: 'Noto Sans JP' }}>日本語学部</span>
              <span>•</span>
              <span>Khoa Nhật Bản Học</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-japanese-dark mb-4 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link href={localePath('/education')} className="btn-primary inline-flex items-center gap-2">
                {t('hero.cta_primary')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href={localePath('/admission')} className="btn-outline inline-flex items-center gap-2">
                {t('hero.cta_secondary')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-red-100 text-sm">{t(`intro.stats.${stat.key}`)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="japanese-divider">
                <h2 className="section-title mb-0">{t('intro.title')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-base">
                {t('intro.content')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-base">
                Với đội ngũ giảng viên giàu kinh nghiệm, cơ sở vật chất hiện đại và mạng lưới đối tác Nhật Bản rộng lớn, chúng tôi cam kết mang đến môi trường học tập tốt nhất cho sinh viên.
              </p>
              <Link href={localePath('/about')} className="btn-outline inline-flex items-center gap-2">
                Tìm Hiểu Thêm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-red-50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-8xl font-bold text-primary/10" style={{ fontFamily: 'Noto Sans JP' }}>学</div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {[
                    { label: 'Chương trình chính quy', value: '3 ngành', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                    { label: 'Chứng chỉ quốc tế', value: 'JLPT, J-Test', color: 'bg-green-50 border-green-200 text-green-700' },
                    { label: 'Học bổng Nhật Bản', value: '50+/năm', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                    { label: 'Tỷ lệ có việc làm', value: '98%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                  ].map((item) => (
                    <div key={item.label} className={`border rounded-lg p-3 ${item.color}`}>
                      <div className="font-bold text-lg">{item.value}</div>
                      <div className="text-xs opacity-80">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="japanese-divider">
              <h2 className="section-title mb-0">{t('programs')}</h2>
            </div>
            <Link href={localePath('/education')} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              {t('view_all')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingPrograms ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : (
              (programs.length > 0 ? programs : PROGRAMS_FALLBACK).slice(0, 3).map((program, idx) => {
                const title = getTranslation(program, locale, 'title');
                const excerpt = getTranslation(program, locale, 'excerpt');
                return (
                  <motion.div
                    key={program.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card group"
                  >
                    <div className="h-3 bg-primary" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">{program.level}</span>
                        <span className="text-gray-400 text-xs">{program.duration}</span>
                      </div>
                      <h3 className="font-bold text-japanese-dark mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{truncate(excerpt, 100)}</p>
                      <Link
                        href={localePath(`/education/${program.slug}`)}
                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Xem Chi Tiết →
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="japanese-divider">
              <h2 className="section-title mb-0">{t('featured_news')}</h2>
            </div>
            <Link href={localePath('/activities')} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              {t('view_all')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingArticles ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : (
              (articles.length > 0 ? articles : ARTICLES_FALLBACK).slice(0, 3).map((article, idx) => {
                const title = getTranslation(article, locale, 'title');
                const excerpt = getTranslation(article, locale, 'excerpt');
                return (
                  <motion.div
                    key={article.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card group"
                  >
                    <Link href={localePath(`/activities/${article.slug}`)}>
                      <div className="relative h-48 bg-gradient-to-br from-primary/8 to-red-50 flex items-center justify-center overflow-hidden">
                        {article.cover_image ? (
                          <Image
                            src={getImageUrl(article.cover_image)}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-5xl text-primary/20 font-bold" style={{ fontFamily: 'Noto Sans JP' }}>新</span>
                        )}
                        {article.category && (
                          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                            {article.category}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-2">{formatDate(article.published_at, locale)}</p>
                        <h3 className="font-semibold text-japanese-dark text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{truncate(excerpt, 120)}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[200px] font-bold text-white/5" style={{ fontFamily: 'Noto Sans JP' }}>
            入学
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-3">{t('admission_cta.title')}</h2>
            <p className="text-red-100 text-lg mb-8">{t('admission_cta.subtitle')}</p>
            <Link
              href={localePath('/admission')}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded hover:bg-red-50 transition-colors"
            >
              {t('admission_cta.button')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
