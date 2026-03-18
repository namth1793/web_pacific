'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { programAPI } from '@/lib/api';
import { getTranslation, truncate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PROGRAMS_FALLBACK = [
  {
    id: 1, slug: 'cu-nhan-ngon-ngu-nhat', type: 'formal', level: 'Đại Học', duration: '4 năm',
    translations: {
      vi: { title: 'Cử Nhân Ngôn Ngữ Nhật Bản', excerpt: 'Chương trình đào tạo 4 năm giúp sinh viên thành thạo tiếng Nhật, hiểu biết về văn hóa Nhật Bản và được chuẩn bị kỹ cho thị trường lao động.' },
      en: { title: 'Bachelor of Japanese Language', excerpt: '4-year program helping students master Japanese language, understand Japanese culture and prepare for the job market.' }
    }
  },
  {
    id: 2, slug: 'nhat-ban-hoc', type: 'formal', level: 'Đại Học', duration: '4 năm',
    translations: {
      vi: { title: 'Nhật Bản Học', excerpt: 'Chương trình liên ngành nghiên cứu toàn diện về xã hội, kinh tế, lịch sử và văn hóa Nhật Bản.' },
      en: { title: 'Japanese Studies', excerpt: 'Interdisciplinary program comprehensively studying Japanese society, economy, history and culture.' }
    }
  },
  {
    id: 3, slug: 'bien-phien-dich-nhat', type: 'formal', level: 'Đại Học', duration: '4 năm',
    translations: {
      vi: { title: 'Biên Phiên Dịch Tiếng Nhật', excerpt: 'Chương trình đào tạo biên dịch và phiên dịch chuyên nghiệp, hướng đến làm việc trong môi trường doanh nghiệp Nhật Bản.' },
      en: { title: 'Japanese Translation & Interpretation', excerpt: 'Professional translation and interpretation training program, aiming for Japanese business environment.' }
    }
  },
  {
    id: 4, slug: 'luyen-thi-jlpt-n5-n4', type: 'non_formal', level: 'Sơ Cấp', duration: '6 tháng',
    translations: {
      vi: { title: 'Luyện Thi JLPT N5 - N4', excerpt: 'Khóa học cơ bản dành cho người mới bắt đầu học tiếng Nhật.' },
      en: { title: 'JLPT N5-N4 Preparation', excerpt: 'Basic course for beginners starting Japanese language study.' }
    }
  },
  {
    id: 5, slug: 'luyen-thi-jlpt-n3-n2', type: 'non_formal', level: 'Trung Cấp', duration: '8 tháng',
    translations: {
      vi: { title: 'Luyện Thi JLPT N3 - N2', excerpt: 'Khóa học trung cấp giúp sinh viên đạt chứng chỉ JLPT N3, N2.' },
      en: { title: 'JLPT N3-N2 Preparation', excerpt: 'Intermediate course helping students achieve JLPT N3, N2 certification.' }
    }
  },
  {
    id: 6, slug: 'nhat-ngu-thuong-mai', type: 'non_formal', level: 'Chuyên Nghiệp', duration: '6 tháng',
    translations: {
      vi: { title: 'Nhật Ngữ Thương Mại', excerpt: 'Khóa học tiếng Nhật dành cho môi trường kinh doanh, hướng đến làm việc tại công ty Nhật.' },
      en: { title: 'Business Japanese', excerpt: 'Japanese course for business environments, aimed at working in Japanese companies.' }
    }
  },
  {
    id: 7, slug: 'thac-si-nhat-ban-hoc', type: 'postgraduate', level: 'Thạc Sĩ', duration: '2 năm',
    translations: {
      vi: { title: 'Thạc Sĩ Nhật Bản Học', excerpt: 'Chương trình sau đại học chuyên sâu nghiên cứu về Nhật Bản dành cho người có bằng đại học.' },
      en: { title: 'Master in Japanese Studies', excerpt: 'Postgraduate program for in-depth research on Japan for those with a bachelor\'s degree.' }
    }
  },
];

const TYPE_LABELS = {
  formal: { vi: 'Chính Quy', en: 'Formal', jp: '正規課程', color: 'bg-blue-100 text-blue-700' },
  non_formal: { vi: 'Không Chính Quy', en: 'Non-Formal', jp: '非正規', color: 'bg-green-100 text-green-700' },
  postgraduate: { vi: 'Sau Đại Học', en: 'Postgraduate', jp: '大学院', color: 'bg-purple-100 text-purple-700' },
};

export default function EducationPage() {
  const t = useTranslations('education');
  const locale = useLocale();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    programAPI.getAll()
      .then(res => setPrograms(res.data?.programs || res.data || []))
      .catch(() => setPrograms(PROGRAMS_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'all', label: 'Tất Cả' },
    { key: 'formal', label: t('formal') },
    { key: 'non_formal', label: t('non_formal') },
    { key: 'postgraduate', label: t('postgraduate') },
  ];

  const displayed = (programs.length > 0 ? programs : PROGRAMS_FALLBACK).filter(
    p => activeTab === 'all' || p.type === activeTab
  );

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((program, idx) => {
              const title = getTranslation(program, locale, 'title');
              const excerpt = getTranslation(program, locale, 'excerpt');
              const typeInfo = TYPE_LABELS[program.type] || {};
              return (
                <motion.div
                  key={program.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="card group"
                >
                  <div className="h-2 bg-primary" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${typeInfo.color}`}>
                        {typeInfo[locale] || typeInfo.vi}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{program.level}</span>
                      {program.duration && (
                        <span className="text-gray-400 text-xs">⏱ {program.duration}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-japanese-dark text-base mb-2 group-hover:text-primary transition-colors leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{truncate(excerpt, 120)}</p>
                    <Link
                      href={localePath(`/education/${program.slug}`)}
                      className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                    >
                      Xem Chi Tiết →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
