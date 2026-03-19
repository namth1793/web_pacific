'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { researchAPI } from '@/lib/api';
import { getTranslation, formatDate, truncate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FACULTY_RESEARCH = [
  { id: 1, slug: 'nghien-cuu-ngu-phap-tieng-nhat', published_at: '2024-01-10', author: 'PGS.TS. Tanaka Yuki', type: 'faculty', keywords: ['ngữ pháp', 'tiếng Nhật', 'so sánh đối chiếu'], translations: { vi: { title: 'Nghiên Cứu Cấu Trúc Ngữ Pháp Tiếng Nhật Hiện Đại', excerpt: 'Phân tích chuyên sâu về sự phát triển của ngữ pháp tiếng Nhật trong thế kỷ 21.' }, en: { title: 'Research on Modern Japanese Grammar Structure', excerpt: 'In-depth analysis of Japanese grammar development in the 21st century.' } } },
  { id: 2, slug: 'van-hoa-tra-dao-va-nen-giao-duc', published_at: '2024-01-25', author: 'TS. Trần Minh Đức', type: 'faculty', keywords: ['trà đạo', 'giáo dục', 'văn hóa'], translations: { vi: { title: 'Ảnh Hưởng Của Trà Đạo Đến Nền Giáo Dục Nhật Bản', excerpt: 'Khám phá mối liên hệ giữa trà đạo và các giá trị giáo dục truyền thống Nhật Bản.' }, en: { title: 'Influence of Tea Ceremony on Japanese Education', excerpt: 'Exploring the connection between tea ceremony and Japanese educational values.' } } },
  { id: 3, slug: 'kinh-te-nhat-ban-sau-covid', published_at: '2024-02-05', author: 'TS. Phạm Quang Huy', type: 'faculty', keywords: ['kinh tế', 'COVID-19', 'phục hồi'], translations: { vi: { title: 'Phục Hồi Kinh Tế Nhật Bản Sau Đại Dịch COVID-19', excerpt: 'Đánh giá toàn diện về quá trình phục hồi kinh tế Nhật Bản và bài học cho Việt Nam.' }, en: { title: 'Japanese Economic Recovery After COVID-19', excerpt: 'Comprehensive assessment of Japan\'s economic recovery and lessons for Vietnam.' } } },
];

const STUDENT_RESEARCH = [
  { id: 4, slug: 'khao-sat-hoc-tieng-nhat-sinh-vien', published_at: '2024-01-30', author: 'Nguyễn Thị Lan - K21', type: 'student', keywords: ['sinh viên', 'động lực học', 'khảo sát'], translations: { vi: { title: 'Khảo Sát Động Lực Học Tiếng Nhật Của Sinh Viên ĐN', excerpt: 'Nghiên cứu về các yếu tố ảnh hưởng đến động lực học tiếng Nhật của sinh viên tại Đà Nẵng.' }, en: { title: 'Survey on Japanese Learning Motivation Among Da Nang Students', excerpt: 'Research on factors affecting Japanese learning motivation among Da Nang students.' } } },
  { id: 5, slug: 'anime-va-van-hoa-gioi-tre', published_at: '2024-02-20', author: 'Trần Văn Minh - K22', type: 'student', keywords: ['anime', 'giới trẻ', 'văn hóa đại chúng'], translations: { vi: { title: 'Ảnh Hưởng Của Anime Đến Văn Hóa Giới Trẻ Việt Nam', excerpt: 'Phân tích tác động của văn hóa anime Nhật Bản đến lối sống và giá trị của thanh niên Việt Nam.' }, en: { title: 'Influence of Anime on Vietnamese Youth Culture', excerpt: 'Analysis of Japanese anime culture\'s impact on Vietnamese youth lifestyle and values.' } } },
];

function ResearchCard({ item, locale, localePath }) {
  const title = getTranslation(item, locale, 'title');
  const excerpt = getTranslation(item, locale, 'excerpt');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 text-lg">
          {item.type === 'faculty' ? '👨‍🔬' : '🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={localePath(`/research/${item.slug}`)}>
            <h3 className="font-bold text-japanese-dark text-sm leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{item.author}</span>
            <span>•</span>
            <span>{formatDate(item.published_at, locale)}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed mb-3">{truncate(excerpt, 120)}</p>
      {item.keywords && (
        <div className="flex flex-wrap gap-1">
          {item.keywords.map(kw => (
            <span key={kw} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">{kw}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function ResearchPage() {
  const t = useTranslations('research');
  const locale = useLocale();
  const [researchItems, setResearchItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    researchAPI.getAll()
      .then(res => setResearchItems(Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : [])))
      .catch(() => setResearchItems([...FACULTY_RESEARCH, ...STUDENT_RESEARCH]))
      .finally(() => setLoading(false));
  }, []);

  const allItems = researchItems.length > 0 ? researchItems : [...FACULTY_RESEARCH, ...STUDENT_RESEARCH];
  const facultyItems = allItems.filter(r => r.type === 'faculty');
  const studentItems = allItems.filter(r => r.type === 'student');

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-14">
            <div>
              <div className="japanese-divider mb-8">
                <h2 className="section-title mb-0">{t('faculty')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(facultyItems.length > 0 ? facultyItems : FACULTY_RESEARCH).map((item, idx) => (
                  <ResearchCard key={item.id || idx} item={item} locale={locale} localePath={localePath} />
                ))}
              </div>
            </div>

            <div>
              <div className="japanese-divider mb-8">
                <h2 className="section-title mb-0">{t('student')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(studentItems.length > 0 ? studentItems : STUDENT_RESEARCH).map((item, idx) => (
                  <ResearchCard key={item.id || idx} item={item} locale={locale} localePath={localePath} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
