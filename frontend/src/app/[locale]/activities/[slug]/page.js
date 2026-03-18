'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { articleAPI } from '@/lib/api';
import { getTranslation, formatDate, getImageUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommentSection from '@/components/ui/CommentSection';

const FALLBACK = {
  id: 1, slug: 'hoi-thao-viet-nhat-2024', published_at: '2024-01-20', category: 'conference', cover_image: null,
  author: 'Ban Biên Tập',
  translations: {
    vi: {
      title: 'Hội Thảo Nghiên Cứu Việt - Nhật 2024',
      excerpt: 'Hội thảo quy tụ hơn 200 nhà nghiên cứu từ Việt Nam và Nhật Bản.',
      content: 'Hội thảo Nghiên cứu Việt - Nhật 2024 đã diễn ra thành công tốt đẹp tại Đại học Đà Nẵng, quy tụ hơn 200 nhà nghiên cứu đến từ hai quốc gia.\n\nChủ đề của hội thảo năm nay tập trung vào quan hệ kinh tế, văn hóa và giáo dục giữa Việt Nam và Nhật Bản trong bối cảnh toàn cầu hóa. Các báo cáo khoa học được trình bày bởi các học giả hàng đầu từ Tokyo University, Osaka University, Đại học Quốc gia Hà Nội và nhiều trường đại học uy tín khác.\n\nĐặc biệt, phiên thảo luận về hợp tác đào tạo nguồn nhân lực đã thu hút sự quan tâm đặc biệt với nhiều đề xuất hợp tác mới. Chương trình trao đổi sinh viên giữa các trường đại học hai nước cũng được thảo luận sôi nổi.\n\nHội thảo kết thúc với bản tuyên bố chung về tăng cường hợp tác nghiên cứu và đào tạo trong giai đoạn 2024-2028.'
    }
  }
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    articleAPI.getOne(slug)
      .then(res => setArticle(res.data?.article || res.data))
      .catch(() => setArticle(FALLBACK))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;

  const a = article || FALLBACK;
  const title = getTranslation(a, locale, 'title');
  const content = getTranslation(a, locale, 'content');

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-red-200 text-sm mb-3 flex items-center gap-2">
            <Link href={localePath('')} className="hover:text-white">Trang Chủ</Link>
            <span>/</span>
            <Link href={localePath('/activities')} className="hover:text-white">Hoạt Động</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h1>
          <div className="flex items-center gap-4 mt-3 text-red-100 text-sm">
            {a.author && <span>✍️ {a.author}</span>}
            {a.published_at && <span>📅 {formatDate(a.published_at, locale)}</span>}
            {a.category && <span className="bg-white/20 px-2 py-0.5 rounded capitalize">{a.category}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {a.cover_image && (
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image src={getImageUrl(a.cover_image)} alt={title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-gray max-w-none">
            {content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href={localePath('/activities')} className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
              ← Quay Lại Hoạt Động
            </Link>
          </div>

          <CommentSection articleId={a.id} />
        </motion.div>
      </div>
    </div>
  );
}
