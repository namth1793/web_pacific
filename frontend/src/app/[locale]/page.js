'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { articleAPI, programAPI } from '@/lib/api';
import { formatDate, getTranslation, getImageUrl, truncate } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Fallback data
───────────────────────────────────────────── */
const PROGRAMS_FB = [
  {
    id: 1,
    slug: 'cu-nhan-ngon-ngu-nhat',
    kanji: '語',
    level: 'Đại Học',
    duration: '4 năm',
    gradient: 'from-red-900 to-red-700',
    translations: {
      vi: { title: 'Cử Nhân Ngôn Ngữ Nhật', excerpt: 'Chương trình đào tạo 4 năm, trang bị kỹ năng ngôn ngữ Nhật Bản toàn diện từ N5 đến N2.' },
      en: { title: 'Bachelor in Japanese Language', excerpt: '4-year program equipping comprehensive Japanese language skills from N5 to N2.' },
    },
  },
  {
    id: 2,
    slug: 'luyen-thi-jlpt',
    kanji: '試',
    level: 'Chứng Chỉ',
    duration: '6 tháng',
    gradient: 'from-slate-800 to-slate-600',
    translations: {
      vi: { title: 'Luyện Thi JLPT N1–N5', excerpt: 'Khóa học luyện thi chứng chỉ quốc tế JLPT, hỗ trợ từ N5 đến N1 với giảng viên kinh nghiệm.' },
      en: { title: 'JLPT N1–N5 Preparation', excerpt: 'International JLPT certification prep course from N5 to N1 with experienced lecturers.' },
    },
  },
  {
    id: 3,
    slug: 'thac-si-nhat-ban-hoc',
    kanji: '修',
    level: 'Thạc Sĩ',
    duration: '2 năm',
    gradient: 'from-zinc-800 to-zinc-600',
    translations: {
      vi: { title: 'Thạc Sĩ Nhật Bản Học', excerpt: 'Chương trình đào tạo sau đại học chuyên sâu về văn hóa, xã hội và kinh tế Nhật Bản.' },
      en: { title: 'Master in Japanese Studies', excerpt: 'Postgraduate program specializing in Japanese culture, society and economics.' },
    },
  },
];

const ARTICLES_FB = [
  {
    id: 1,
    slug: 'ket-qua-jlpt-thang-12',
    published_at: '2026-01-15',
    category: 'Tin Tức',
    featured_image: null,
    translations: {
      vi: { title: 'Kết Quả Kỳ Thi JLPT Tháng 12/2025', excerpt: '95% sinh viên vượt qua kỳ thi JLPT với thành tích xuất sắc, nhiều em đạt N2 và N1.' },
      en: { title: 'JLPT December 2025 Results', excerpt: '95% of students passed JLPT with excellent results, many achieving N2 and N1.' },
    },
  },
  {
    id: 2,
    slug: 'hoi-thao-viet-nhat-2026',
    published_at: '2026-01-20',
    category: 'Sự Kiện',
    featured_image: null,
    translations: {
      vi: { title: 'Hội Thảo Nghiên Cứu Việt – Nhật 2026', excerpt: 'Hội thảo quy tụ hơn 200 nhà nghiên cứu từ Việt Nam và Nhật Bản thảo luận về quan hệ hai nước.' },
      en: { title: 'Vietnam–Japan Research Conference 2026', excerpt: 'Conference gathering 200+ researchers from Vietnam and Japan discussing bilateral relations.' },
    },
  },
  {
    id: 3,
    slug: 'sinh-vien-thuc-tap-nhat-ban',
    published_at: '2026-02-01',
    category: 'Sinh Viên',
    featured_image: null,
    translations: {
      vi: { title: '20 Sinh Viên Xuất Sắc Thực Tập Tại Nhật Bản', excerpt: 'Chương trình thực tập hợp tác với Toyota, Sony và Panasonic mang đến cơ hội quý báu cho sinh viên.' },
      en: { title: '20 Outstanding Students Intern in Japan', excerpt: 'Internship program with Toyota, Sony and Panasonic provides invaluable opportunities for students.' },
    },
  },
];

const STATS = [
  { value: '1,200+', label: '学生', sub: 'Sinh viên' },
  { value: '45',     label: '教員', sub: 'Giảng viên' },
  { value: '30+',    label: '提携', sub: 'Đối tác' },
  { value: '25',     label: '年間', sub: 'Năm thành lập' },
];

const NEWS_FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
  'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
];
const NEWS_FALLBACK_KANJI = ['新', '話', '誌'];

/* ─────────────────────────────────────────────
   Helper: SakuraPetal SVG
───────────────────────────────────────────── */
function SakuraPetal({ style }) {
  return (
    <svg
      className="sakura-petal"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 5 petals radiating from center */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="12"
          rx="3.5"
          ry="6"
          fill={i % 2 === 0 ? '#f9a8d4' : '#fbcfe8'}
          fillOpacity="0.85"
          transform={`rotate(${angle} 12 12) translate(0 -4)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill="#fce7f3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Helper: FallingSakura — 18 petals
───────────────────────────────────────────── */
function FallingSakura() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 5.7 + 2) % 100}%`,
    animationDelay: `${(i * 0.65) % 9}s`,
    animationDuration: `${7 + (i * 0.37) % 5}s`,
    size: `${10 + (i * 0.53) % 8}px`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p, i) => (
        <SakuraPetal
          key={i}
          style={{
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Helper: RisingSun SVG
───────────────────────────────────────────── */
function RisingSun({ className = '', opacity = 0.05 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 95 * Math.cos(rad)}
            y2={100 + 95 * Math.sin(rad)}
            stroke="#BC002D"
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx="100" cy="100" r="28" fill="#BC002D" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Helper: WaveDivider SVG
───────────────────────────────────────────── */
function WaveDivider({ flip = false, color = '#FAFAF8' }) {
  return (
    <div
      style={{
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : 'none',
        overflow: 'hidden',
      }}
    >
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 56 }}>
        <path
          d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [articles, setArticles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], ['0%', '30%']);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // lp: locale-prefixed path helper
  const lp = (href) => `/${locale}${href}`;

  useEffect(() => {
    articleAPI.getAll({ limit: 3, featured: true })
      .then(res => setArticles(res.data?.articles || res.data || []))
      .catch(() => setArticles(ARTICLES_FB))
      .finally(() => setLoadingArticles(false));

    programAPI.getAll({ limit: 3 })
      .then(res => setPrograms(res.data?.programs || res.data || []))
      .catch(() => setPrograms(PROGRAMS_FB))
      .finally(() => setLoadingPrograms(false));
  }, []);

  const displayPrograms = (programs.length > 0 ? programs : PROGRAMS_FB).slice(0, 3).map((p, i) => ({
    ...p,
    kanji: p.kanji || PROGRAMS_FB[i]?.kanji || '語',
    gradient: p.gradient || PROGRAMS_FB[i]?.gradient || 'from-red-900 to-red-700',
  }));

  const displayArticles = (articles.length > 0 ? articles : ARTICLES_FB).slice(0, 3);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <Image
            src="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1600&q=85"
            alt="Cherry blossoms"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-japanese-dark/80 via-japanese-dark/60 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-japanese-dark/40 via-transparent to-transparent z-[1]" />

        {/* Falling sakura */}
        <div className="absolute inset-0 z-[2]">
          <FallingSakura />
        </div>

        {/* Rising sun decoration top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] z-[2] pointer-events-none">
          <RisingSun className="w-full h-full" opacity={0.05} />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-white/60" />
              <span
                className="text-white/80 text-sm tracking-widest uppercase"
                style={{ fontFamily: 'Noto Sans JP', letterSpacing: '0.2em' }}
              >
                日本語学部
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)', fontFamily: 'Noto Serif JP' }}
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/85 text-lg font-light leading-relaxed mb-8"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={lp('/education')}
                className="btn-primary inline-flex items-center gap-2"
                style={{ boxShadow: '0 8px 25px rgba(188,0,45,0.40)' }}
              >
                {t('hero.cta_primary')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={lp('/admission')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium text-white border border-white/30 bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200"
              >
                {t('hero.cta_secondary')}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">SCROLL</span>
          <motion.div
            className="w-px h-8 bg-white/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS
      ══════════════════════════════════════════ */}
      <section className="bg-primary relative overflow-hidden">
        {/* Subtle diagonal white line overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cline x1='0' y1='0' x2='40' y2='40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center text-white"
              >
                <div
                  className="text-4xl font-bold text-white/30 mb-1"
                  style={{ fontFamily: 'Noto Serif JP' }}
                >
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-red-200 text-sm">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. INTRODUCTION
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Rising sun decoration right */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] pointer-events-none">
          <RisingSun className="w-full h-full" opacity={0.03} />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="jp-badge mb-4">
                <span style={{ fontFamily: 'Noto Serif JP' }}>日本語学部</span>
                <span>•</span>
                <span>Khoa Nhật Bản Học</span>
              </span>
              <div className="japanese-divider mt-4">
                <h2 className="section-title mb-0">{t('intro.title')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-base">
                {t('intro.content')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-base">
                Với đội ngũ giảng viên giàu kinh nghiệm, cơ sở vật chất hiện đại và mạng lưới đối tác Nhật Bản rộng lớn, chúng tôi cam kết mang đến môi trường học tập tốt nhất cho sinh viên.
              </p>
              <Link href={lp('/about')} className="btn-outline inline-flex items-center gap-2">
                Tìm Hiểu Thêm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Right: 2×2 image grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
              style={{ gridTemplateRows: 'auto auto' }}
            >
              {/* Large first image (row-span-2) */}
              <motion.div
                className="overflow-hidden rounded-lg relative"
                style={{ gridRow: 'span 2', minHeight: 300 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80"
                  alt="Sakura"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Smaller images */}
              {[
                { src: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80', alt: 'Mount Fuji' },
                { src: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80', alt: 'Temple' },
                { src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', alt: 'Tokyo' },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-lg relative"
                  style={{ height: 140 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. KEY FIGURES
      ══════════════════════════════════════════ */}
      <section className="jp-pattern-bg relative">
        <WaveDivider flip={false} color="#FAFAF8" />
        <div className="py-14 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Chương trình', sub: '3 ngành', kanji: '学', color: 'text-blue-600', border: 'border-blue-100', bg: 'bg-blue-50/50' },
              { label: 'Chứng chỉ', sub: 'JLPT J-Test', kanji: '証', color: 'text-green-600', border: 'border-green-100', bg: 'bg-green-50/50' },
              { label: 'Học bổng', sub: '50+ / năm', kanji: '奨', color: 'text-purple-600', border: 'border-purple-100', bg: 'bg-purple-50/50' },
              { label: 'Tỉ lệ việc làm', sub: '98%', kanji: '職', color: 'text-orange-600', border: 'border-orange-100', bg: 'bg-orange-50/50' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden border ${item.border} ${item.bg} rounded-xl p-5`}
              >
                {/* Kanji watermark */}
                <div
                  className={`absolute top-2 right-3 text-5xl font-bold opacity-10 ${item.color} select-none`}
                  style={{ fontFamily: 'Noto Serif JP' }}
                >
                  {item.kanji}
                </div>
                <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.sub}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <WaveDivider flip={true} color="#FAFAF8" />
      </section>

      {/* ══════════════════════════════════════════
          5. PROGRAMS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="jp-badge mb-4">
              <span style={{ fontFamily: 'Noto Serif JP' }}>教育課程</span>
              <span>/</span>
              <span>Chương trình đào tạo</span>
            </span>
            <div className="japanese-divider mt-4 items-center justify-between">
              <h2 className="section-title mb-0">{t('programs')}</h2>
              <Link href={lp('/education')} className="text-primary text-sm font-medium ink-underline ml-auto">
                {t('view_all')} →
              </Link>
            </div>
          </motion.div>

          {/* Program cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingPrograms ? (
              [1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-36 bg-gray-200" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              displayPrograms.map((program, idx) => {
                const title = getTranslation(program, locale, 'title');
                const excerpt = getTranslation(program, locale, 'excerpt');
                return (
                  <motion.div
                    key={program.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card jp-card-accent group"
                  >
                    {/* Card header gradient with animated kanji */}
                    <div className={`h-36 bg-gradient-to-br ${program.gradient} relative overflow-hidden flex items-center justify-center`}>
                      <motion.span
                        className="text-[80px] font-bold text-white/20 select-none leading-none"
                        style={{ fontFamily: 'Noto Serif JP' }}
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {program.kanji}
                      </motion.span>
                      {/* Badges */}
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {program.level}
                        </span>
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {program.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3 className="font-bold text-japanese-dark mb-2 group-hover:text-primary transition-colors text-base leading-snug">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        {truncate(excerpt, 110)}
                      </p>
                      <Link
                        href={lp(`/education/${program.slug}`)}
                        className="text-primary text-sm font-medium ink-underline"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. JAPAN CULTURE BANNER
      ══════════════════════════════════════════ */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=80"
          alt="Mount Fuji"
          fill
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-japanese-dark/80 via-japanese-dark/40 to-transparent" />

        {/* Left content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-white/70 text-sm tracking-widest mb-3"
                style={{ fontFamily: 'Noto Serif JP' }}
              >
                — 日本の文化と言語 —
              </p>
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-5 leading-snug"
                style={{ fontFamily: 'Noto Serif JP' }}
              >
                Khám Phá Văn Hóa &amp; Ngôn Ngữ Nhật Bản
              </h2>
              <Link
                href={lp('/activities')}
                className="inline-flex items-center gap-2 border border-white/50 text-white px-5 py-2.5 rounded hover:bg-white/15 transition-all duration-200 text-sm font-medium"
              >
                Khám phá ngay
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Right: floating kanji */}
            <div className="hidden md:flex items-center justify-end gap-6">
              {['日', '本', '語'].map((char, i) => (
                <motion.span
                  key={i}
                  className="text-5xl font-bold text-white/30 select-none"
                  style={{ fontFamily: 'Noto Serif JP' }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. NEWS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="jp-badge mb-4">
              <span style={{ fontFamily: 'Noto Serif JP' }}>最新情報</span>
              <span>/</span>
              <span>Tin tức &amp; Sự kiện</span>
            </span>
            <div className="japanese-divider mt-4 items-center">
              <h2 className="section-title mb-0">{t('featured_news')}</h2>
              <Link href={lp('/activities')} className="text-primary text-sm font-medium ink-underline ml-auto">
                {t('view_all')} →
              </Link>
            </div>
          </motion.div>

          {/* Article cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingArticles ? (
              [1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))
            ) : (
              displayArticles.map((article, idx) => {
                const title = getTranslation(article, locale, 'title');
                const excerpt = getTranslation(article, locale, 'excerpt');
                const hasCover = !!(article.cover_image || article.featured_image);
                return (
                  <motion.div
                    key={article.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card group"
                  >
                    <Link href={lp(`/activities/${article.slug}`)}>
                      {/* Image area */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/8 to-red-50 overflow-hidden flex items-center justify-center">
                        {hasCover ? (
                          <Image
                            src={getImageUrl(article.cover_image || article.featured_image)}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <>
                            <Image
                              src={NEWS_FALLBACK_IMGS[idx % 3]}
                              alt={title}
                              fill
                              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                            />
                            <span
                              className="relative z-10 text-6xl font-bold text-primary/40 select-none"
                              style={{ fontFamily: 'Noto Serif JP' }}
                            >
                              {NEWS_FALLBACK_KANJI[idx % 3]}
                            </span>
                          </>
                        )}
                        {/* Category badge */}
                        {article.category && (
                          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded z-20">
                            {article.category}
                          </span>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(article.published_at, locale)}
                        </div>
                        <h3 className="font-semibold text-japanese-dark text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {truncate(excerpt, 120)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. QUOTE BAND
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Open quote */}
            <div
              className="text-5xl text-primary/20 leading-none mb-2 select-none"
              style={{ fontFamily: 'Noto Serif JP' }}
            >
              「
            </div>
            <p
              className="text-xl text-gray-700 font-light italic leading-relaxed mb-2"
              style={{ fontFamily: 'Noto Serif JP' }}
            >
              Ngôn ngữ là cầu nối giữa hai nền văn hóa, là chìa khóa mở ra những cơ hội vô tận trong cuộc sống và sự nghiệp.
            </p>
            {/* Close quote */}
            <div
              className="text-5xl text-primary/20 leading-none mb-6 select-none"
              style={{ fontFamily: 'Noto Serif JP' }}
            >
              」
            </div>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm" style={{ fontFamily: 'Noto Serif JP' }}>
                学
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-japanese-dark">GS. Nguyễn Văn Minh</div>
                <div className="text-xs text-gray-400">Trưởng Khoa Nhật Bản Học</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. CTA
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden">
        {/* Background */}
        <Image
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80"
          alt="Tokyo night"
          fill
          className="object-cover"
        />
        {/* Primary color overlay */}
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cline x1='20' y1='0' x2='20' y2='40'/%3E%3Cline x1='0' y1='20' x2='40' y2='20'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Large "入学" kanji right side */}
        <div className="absolute right-8 inset-y-0 flex items-center pointer-events-none select-none">
          <span
            className="text-[160px] font-bold text-white/5 leading-none"
            style={{ fontFamily: 'Noto Serif JP' }}
          >
            入学
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p
              className="text-white/70 text-sm tracking-widest mb-3"
              style={{ fontFamily: 'Noto Serif JP' }}
            >
              — 入学案内 2026 —
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Noto Serif JP' }}
            >
              {t('admission_cta.title')}
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto font-light">
              {t('admission_cta.subtitle')}
            </p>
            <Link
              href={lp('/admission')}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded hover:bg-red-50 transition-colors shadow-lg shadow-black/20"
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
