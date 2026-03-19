'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { testAPI } from '@/lib/api';
import { getTranslation, truncate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CERT_INFO = [
  {
    key: 'jlpt', name: 'JLPT', fullName: 'Japanese Language Proficiency Test',
    color: 'bg-blue-600', lightColor: 'bg-blue-50 border-blue-200',
    levels: ['N1', 'N2', 'N3', 'N4', 'N5'],
    desc: 'Kỳ thi năng lực tiếng Nhật quốc tế được công nhận toàn cầu. Tổ chức 2 lần/năm (tháng 7 và tháng 12).',
    org: 'Japan Foundation'
  },
  {
    key: 'jtest', name: 'J-Test', fullName: 'Test of Practical Japanese',
    color: 'bg-green-600', lightColor: 'bg-green-50 border-green-200',
    levels: ['A-B', 'C-D', 'E-F'],
    desc: 'Kỳ thi tiếng Nhật thực hành được nhiều doanh nghiệp Nhật Bản yêu cầu. Tổ chức 6 lần/năm.',
    org: 'Japanese Language Society'
  },
  {
    key: 'nattest', name: 'NAT-Test', fullName: 'Nihongo Achievement Test',
    color: 'bg-purple-600', lightColor: 'bg-purple-50 border-purple-200',
    levels: ['N1', 'N2', 'N3', 'N4', 'N5'],
    desc: 'Kỳ thi kiểm tra thành tích học tiếng Nhật. Tổ chức 4 lần/năm tại nhiều thành phố Việt Nam.',
    org: 'NAT-Test Committee'
  },
];

const TESTS_FALLBACK = [
  {
    id: 1, slug: 'mini-test-n5-grammar', type: 'mini', level: 'N5',
    question_count: 20, time_limit: 30,
    translations: {
      vi: { title: 'Mini Test N5 - Ngữ Pháp', excerpt: 'Bài kiểm tra ngữ pháp N5 với 20 câu hỏi trắc nghiệm.' },
      en: { title: 'Mini Test N5 - Grammar', excerpt: 'N5 grammar test with 20 multiple choice questions.' }
    }
  },
  {
    id: 2, slug: 'mini-test-n4-vocabulary', type: 'mini', level: 'N4',
    question_count: 25, time_limit: 35,
    translations: {
      vi: { title: 'Mini Test N4 - Từ Vựng', excerpt: 'Bài kiểm tra từ vựng N4 với 25 câu hỏi.' },
      en: { title: 'Mini Test N4 - Vocabulary', excerpt: 'N4 vocabulary test with 25 questions.' }
    }
  },
  {
    id: 3, slug: 'mini-test-n3-reading', type: 'mini', level: 'N3',
    question_count: 15, time_limit: 25,
    translations: {
      vi: { title: 'Mini Test N3 - Đọc Hiểu', excerpt: 'Bài kiểm tra đọc hiểu N3 với 15 câu hỏi.' },
      en: { title: 'Mini Test N3 - Reading', excerpt: 'N3 reading comprehension test with 15 questions.' }
    }
  },
];

const MATERIALS = [
  { name: 'Minna no Nihongo I & II', type: 'Giáo Trình', level: 'N5-N4', icon: '📗' },
  { name: 'Nihongo So Matome N3', type: 'Luyện Thi', level: 'N3', icon: '📘' },
  { name: 'JLPT N2 Mock Exam', type: 'Đề Thi Mẫu', level: 'N2', icon: '📄' },
  { name: 'Kanji in Context', type: 'Hán Tự', level: 'N3-N2', icon: '🈳' },
  { name: 'Business Japanese Guide', type: 'Thương Mại', level: 'Nâng Cao', icon: '💼' },
  { name: 'Japanese Listening Practice', type: 'Nghe', level: 'N5-N3', icon: '🎧' },
];

export default function ExamsPage() {
  const t = useTranslations('exams');
  const locale = useLocale();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    testAPI.getAll()
      .then(res => setTests(Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : [])))
      .catch(() => setTests(TESTS_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

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

      {/* Certification Info */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">Các Kỳ Thi Chứng Chỉ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERT_INFO.map((cert, i) => (
              <motion.div
                key={cert.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border rounded-xl p-6 ${cert.lightColor}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${cert.color} text-white font-bold px-3 py-1 rounded text-sm`}>{cert.name}</span>
                  <span className="text-xs text-gray-500">{cert.org}</span>
                </div>
                <h3 className="font-bold text-japanese-dark mb-2">{cert.fullName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{cert.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {cert.levels.map(lv => (
                    <span key={lv} className="bg-white/80 text-gray-600 text-xs px-2 py-0.5 rounded border">{lv}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Tests */}
      <section className="py-14 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('mini')} - Luyện Thi Online</h2>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(tests.length > 0 ? tests : TESTS_FALLBACK).map((test, idx) => {
                const title = getTranslation(test, locale, 'title');
                const excerpt = getTranslation(test, locale, 'excerpt');
                return (
                  <motion.div
                    key={test.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="card p-6 group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">{test.level}</span>
                      {test.question_count && (
                        <span className="text-gray-400 text-xs">{test.question_count} câu</span>
                      )}
                      {test.time_limit && (
                        <span className="text-gray-400 text-xs">⏱ {test.time_limit} phút</span>
                      )}
                    </div>
                    <h3 className="font-bold text-japanese-dark mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{truncate(excerpt, 80)}</p>
                    <Link
                      href={localePath(`/exams/${test.slug}`)}
                      className="btn-primary text-sm py-2 inline-flex items-center gap-2"
                    >
                      🖊 {t('take_test')}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Study Materials */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('materials')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MATERIALS.map((mat, i) => (
              <motion.div
                key={mat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="text-3xl">{mat.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-japanese-dark text-sm group-hover:text-primary transition-colors">{mat.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{mat.type}</span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-xs text-primary font-medium">{mat.level}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
