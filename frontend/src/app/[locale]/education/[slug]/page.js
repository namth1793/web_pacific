'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { programAPI } from '@/lib/api';
import { getTranslation } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FALLBACK = {
  id: 1, slug: 'cu-nhan-ngon-ngu-nhat', type: 'formal', level: 'Đại Học', duration: '4 năm',
  curriculum: ['Tiếng Nhật cơ bản N5-N4', 'Tiếng Nhật trung cấp N3-N2', 'Văn hóa Nhật Bản', 'Lịch sử Nhật Bản', 'Kinh tế Nhật Bản', 'Nhật ngữ thương mại', 'Biên phiên dịch', 'Thực tập doanh nghiệp'],
  requirements: ['Tốt nghiệp THPT hoặc tương đương', 'Điểm xét tuyển theo quy định', 'Không yêu cầu tiếng Nhật đầu vào'],
  tuition: '15,000,000 VND/học kỳ',
  translations: {
    vi: {
      title: 'Cử Nhân Ngôn Ngữ Nhật Bản',
      excerpt: 'Chương trình đào tạo 4 năm giúp sinh viên thành thạo tiếng Nhật và phát triển sự nghiệp trong môi trường quốc tế.',
      content: 'Chương trình Cử nhân Ngôn ngữ Nhật Bản được thiết kế toàn diện, giúp sinh viên nắm vững tiếng Nhật từ cơ bản đến nâng cao (đạt trình độ N2 sau khi tốt nghiệp), đồng thời trang bị kiến thức sâu rộng về văn hóa, lịch sử, kinh tế và xã hội Nhật Bản.\n\nSinh viên sẽ được thực hành ngôn ngữ trong môi trường thực tế thông qua chương trình trao đổi với các trường đại học đối tác tại Nhật Bản, thực tập tại các doanh nghiệp Nhật Bản hoạt động tại Việt Nam.\n\nCơ hội nghề nghiệp: Phiên dịch, biên dịch, chuyên viên quan hệ đối ngoại, giảng viên tiếng Nhật, chuyên viên tại công ty Nhật Bản.'
    },
    en: {
      title: 'Bachelor of Japanese Language',
      excerpt: '4-year program helping students master Japanese and develop careers in international environments.',
      content: 'The Bachelor of Japanese Language program is comprehensively designed to help students master Japanese from basic to advanced levels (achieving N2 proficiency upon graduation), while equipping broad knowledge about Japanese culture, history, economics and society.'
    }
  }
};

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    programAPI.getOne(slug)
      .then(res => setProgram(res.data?.program || res.data))
      .catch(() => setProgram(FALLBACK))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;

  const p = program || FALLBACK;
  const title = getTranslation(p, locale, 'title');
  const excerpt = getTranslation(p, locale, 'excerpt');
  const content = getTranslation(p, locale, 'content');

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-red-200 text-sm mb-3 flex items-center gap-2">
            <Link href={localePath('')} className="hover:text-white">Trang Chủ</Link>
            <span>/</span>
            <Link href={localePath('/education')} className="hover:text-white">Đào Tạo</Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-red-100 mt-2">{excerpt}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="prose prose-gray max-w-none mb-8">
                {content?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
                ))}
              </div>

              {p.curriculum && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-japanese-dark mb-4 flex items-center gap-3">
                    <span className="block h-6 w-1 bg-primary rounded" />
                    Chương Trình Học
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {p.curriculum.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-japanese-dark mb-4 flex items-center gap-3">
                    <span className="block h-6 w-1 bg-primary rounded" />
                    Yêu Cầu Đầu Vào
                  </h2>
                  <ul className="space-y-2">
                    {p.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-20 space-y-4"
            >
              <div className="bg-primary text-white rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Thông Tin Chương Trình</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-200">Trình Độ:</span>
                    <span className="font-medium">{p.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-200">Thời Gian:</span>
                    <span className="font-medium">{p.duration}</span>
                  </div>
                  {p.tuition && (
                    <div className="flex justify-between">
                      <span className="text-red-200">Học Phí:</span>
                      <span className="font-medium">{p.tuition}</span>
                    </div>
                  )}
                </div>
              </div>
              <Link href={localePath('/admission')} className="block">
                <button className="w-full btn-primary justify-center">Đăng Ký Tuyển Sinh</button>
              </Link>
              <Link href={localePath('/contact')} className="block">
                <button className="w-full btn-outline justify-center">Tư Vấn Thêm</button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
