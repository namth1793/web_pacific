'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { articleAPI } from '@/lib/api';
import { getTranslation, formatDate, truncate, getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ARTICLES_FALLBACK = [
  { id: 1, slug: 'ket-qua-jlpt-thang-12', published_at: '2024-01-15', category: 'news', cover_image: null, translations: { vi: { title: 'Kết Quả Kỳ Thi JLPT Tháng 12/2023', excerpt: '95% sinh viên vượt qua kỳ thi JLPT với thành tích xuất sắc.' }, en: { title: 'JLPT December 2023 Results', excerpt: '95% of students passed JLPT with excellent results.' } } },
  { id: 2, slug: 'hoi-thao-viet-nhat-2024', published_at: '2024-01-20', category: 'conference', cover_image: null, translations: { vi: { title: 'Hội Thảo Nghiên Cứu Việt - Nhật 2024', excerpt: 'Hội thảo quy tụ hơn 200 nhà nghiên cứu từ Việt Nam và Nhật Bản.' }, en: { title: 'Vietnam-Japan Research Conference 2024', excerpt: 'Conference gathering 200+ researchers from Vietnam and Japan.' } } },
  { id: 3, slug: 'sinh-vien-thuc-tap-nhat-ban', published_at: '2024-02-01', category: 'internship', cover_image: null, translations: { vi: { title: '20 Sinh Viên Xuất Sắc Thực Tập Tại Nhật Bản', excerpt: 'Chương trình thực tập hợp tác với Toyota, Sony và Panasonic.' }, en: { title: '20 Outstanding Students Intern in Japan', excerpt: 'Internship program with Toyota, Sony and Panasonic.' } } },
  { id: 4, slug: 'le-van-hoa-nhat-ban-2024', published_at: '2024-02-10', category: 'news', cover_image: null, translations: { vi: { title: 'Lễ Hội Văn Hóa Nhật Bản 2024', excerpt: 'Sự kiện thường niên thu hút hơn 5000 lượt tham quan với nhiều hoạt động văn hóa đặc sắc.' }, en: { title: 'Japanese Cultural Festival 2024', excerpt: 'Annual event attracting 5000+ visitors with many cultural activities.' } } },
  { id: 5, slug: 'doi-tac-fujitsu', published_at: '2024-02-15', category: 'partners', cover_image: null, translations: { vi: { title: 'Ký Kết Hợp Tác Với Fujitsu Vietnam', excerpt: 'Thỏa thuận hợp tác đào tạo và tuyển dụng với công ty công nghệ Fujitsu.' }, en: { title: 'Partnership Agreement with Fujitsu Vietnam', excerpt: 'Training and recruitment cooperation agreement with Fujitsu technology company.' } } },
  { id: 6, slug: 'du-an-bien-dich-truyen-tranh', published_at: '2024-03-01', category: 'projects', cover_image: null, translations: { vi: { title: 'Dự Án Biên Dịch Manga Việt - Nhật', excerpt: 'Sinh viên tham gia dự án biên dịch 10 tập manga Nhật Bản sang tiếng Việt.' }, en: { title: 'Vietnamese-Japanese Manga Translation Project', excerpt: 'Students participate in translating 10 Japanese manga volumes into Vietnamese.' } } },
];

const TABS = [
  { key: 'all', label: 'Tất Cả' },
  { key: 'news', label: 'Tin Tức' },
  { key: 'conference', label: 'Hội Thảo' },
  { key: 'internship', label: 'Thực Tập' },
  { key: 'partners', label: 'Đối Tác' },
  { key: 'projects', label: 'Dự Án' },
];

export default function ActivitiesPage() {
  const t = useTranslations('activities');
  const locale = useLocale();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    articleAPI.getAll()
      .then(res => setArticles(Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : [])))
      .catch(() => setArticles(ARTICLES_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const allArticles = articles.length > 0 ? articles : ARTICLES_FALLBACK;
  const filtered = allArticles.filter(a => activeTab === 'all' || a.category === activeTab);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const displayed = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((article, idx) => {
                const title = getTranslation(article, locale, 'title');
                const excerpt = getTranslation(article, locale, 'excerpt');
                return (
                  <motion.div
                    key={article.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="card group"
                  >
                    <Link href={localePath(`/activities/${article.slug}`)}>
                      <div className="relative h-48 bg-gradient-to-br from-primary/8 to-red-50 flex items-center justify-center overflow-hidden">
                        {article.cover_image ? (
                          <Image src={getImageUrl(article.cover_image)} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <span className="text-5xl text-primary/20 font-bold" style={{ fontFamily: 'Noto Sans JP' }}>新</span>
                        )}
                        {article.category && (
                          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded capitalize">
                            {article.category}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-2">{formatDate(article.published_at, locale)}</p>
                        <h3 className="font-semibold text-japanese-dark text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{truncate(excerpt, 120)}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
