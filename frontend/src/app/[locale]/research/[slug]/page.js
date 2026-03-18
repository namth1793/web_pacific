'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { researchAPI } from '@/lib/api';
import { getTranslation, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FALLBACK = {
  id: 1, slug: 'nghien-cuu-ngu-phap-tieng-nhat', published_at: '2024-01-10',
  author: 'PGS.TS. Tanaka Yuki', type: 'faculty',
  keywords: ['ngữ pháp', 'tiếng Nhật', 'so sánh đối chiếu', 'ngôn ngữ học'],
  abstract_vi: 'Nghiên cứu này phân tích sự phát triển của cấu trúc ngữ pháp tiếng Nhật trong thế kỷ 21, tập trung vào ảnh hưởng của công nghệ và toàn cầu hóa đến ngôn ngữ.',
  translations: {
    vi: {
      title: 'Nghiên Cứu Cấu Trúc Ngữ Pháp Tiếng Nhật Hiện Đại',
      excerpt: 'Phân tích chuyên sâu về sự phát triển của ngữ pháp tiếng Nhật trong thế kỷ 21.',
      content: 'Tóm tắt nghiên cứu:\n\nNghiên cứu này khảo sát những thay đổi đáng kể trong cấu trúc ngữ pháp tiếng Nhật hiện đại, đặc biệt trong bối cảnh số hóa và toàn cầu hóa.\n\nPhương pháp nghiên cứu:\n\nChúng tôi sử dụng phương pháp phân tích ngữ liệu corpus gồm 10 triệu từ từ các nguồn truyền thông Nhật Bản (2000-2023), kết hợp với phỏng vấn sâu 50 người bản ngữ thuộc các thế hệ khác nhau.\n\nKết quả chính:\n\nNghiên cứu chỉ ra xu hướng đơn giản hóa trong ngữ pháp kính ngữ (keigo), sự phổ biến của các cấu trúc ngữ pháp bắt nguồn từ tiếng Anh, và sự xuất hiện của nhiều từ ngữ mới phản ánh văn hóa internet.\n\nKết luận:\n\nNhững thay đổi này phản ánh sự thích nghi linh hoạt của tiếng Nhật trong thời đại số, đồng thời cho thấy sức mạnh bền vững của các yếu tố ngôn ngữ truyền thống.'
    }
  }
};

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    researchAPI.getOne(slug)
      .then(res => setResearch(res.data?.research || res.data))
      .catch(() => setResearch(FALLBACK))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;

  const r = research || FALLBACK;
  const title = getTranslation(r, locale, 'title');
  const content = getTranslation(r, locale, 'content');

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-red-200 text-sm mb-3 flex items-center gap-2">
            <Link href={localePath('')} className="hover:text-white">Trang Chủ</Link>
            <span>/</span>
            <Link href={localePath('/research')} className="hover:text-white">Nghiên Cứu</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block text-xs mb-1">Tác Giả</span>
                <span className="font-medium text-japanese-dark">{r.author}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">Ngày Công Bố</span>
                <span className="font-medium text-japanese-dark">{formatDate(r.published_at, locale)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">Loại Nghiên Cứu</span>
                <span className="font-medium text-japanese-dark capitalize">{r.type === 'faculty' ? 'Giảng Viên' : 'Sinh Viên'}</span>
              </div>
            </div>
          </div>

          {r.abstract_vi && (
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-5 mb-8">
              <h3 className="font-bold text-japanese-dark mb-2 text-sm uppercase tracking-wide">Tóm Tắt</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{r.abstract_vi}</p>
            </div>
          )}

          <div className="prose prose-gray max-w-none mb-8">
            {content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          {r.keywords && (
            <div className="mb-8">
              <h3 className="font-bold text-japanese-dark mb-3 text-sm">Từ Khóa:</h3>
              <div className="flex flex-wrap gap-2">
                {r.keywords.map(kw => (
                  <span key={kw} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <Link href={localePath('/research')} className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
              ← Quay Lại Nghiên Cứu
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
