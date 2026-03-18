'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const quickLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'education', href: '/education' },
  { key: 'activities', href: '/activities' },
  { key: 'research', href: '/research' },
  { key: 'exams', href: '/exams' },
  { key: 'students', href: '/students' },
  { key: 'admission', href: '/admission' },
  { key: 'contact', href: '/contact' },
];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('nav');

  const localePath = (href) => `/${locale}${href === '/' ? '' : href}`;

  return (
    <footer className="bg-japanese-dark text-gray-300">
      <div className="h-1 bg-primary w-full" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-xl" style={{ fontFamily: 'Noto Sans JP' }}>
                日
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Noto Sans JP' }}>日本語学部</div>
                <div className="text-xs text-gray-400 leading-tight">Khoa Nhật Bản Học</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Đào tạo nguồn nhân lực chất lượng cao, kết nối văn hóa Việt - Nhật, hướng đến tương lai toàn cầu.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Email">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.key}>
                  <Link
                    href={localePath(link.href)}
                    className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-150 flex items-center gap-1"
                  >
                    <span className="text-primary text-xs">›</span>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Thông Tin Liên Hệ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Đường Nguyễn Lương Bằng, Đà Nẵng, Việt Nam</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(+84) 236 3 456 789</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>khoanhattbanhoc@university.edu.vn</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>T2 - T6: 7:30 - 17:00<br />T7: 7:30 - 11:30</span>
              </li>
            </ul>
          </div>

          {/* Latest Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Chứng Chỉ Nhật Ngữ</h3>
            <div className="space-y-3">
              {[
                { name: 'JLPT', desc: 'Japanese Language Proficiency Test', color: 'bg-blue-600' },
                { name: 'J-Test', desc: 'Practical Japanese Proficiency Test', color: 'bg-green-600' },
                { name: 'NAT-Test', desc: 'Nihongo Achievement Test', color: 'bg-purple-600' },
              ].map((cert) => (
                <div key={cert.name} className="flex items-center gap-3">
                  <span className={`${cert.color} text-white text-xs font-bold px-2 py-0.5 rounded flex-shrink-0`}>{cert.name}</span>
                  <span className="text-xs text-gray-400">{cert.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
              <div className="text-white font-medium mb-1">Đăng Ký Thi</div>
              <Link href={localePath('/exams')} className="text-primary hover:underline">
                Xem lịch thi và đăng ký →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Khoa Nhật Bản Học. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href={localePath('/about')} className="hover:text-white transition-colors">Giới thiệu</Link>
            <Link href={localePath('/contact')} className="hover:text-white transition-colors">Liên hệ</Link>
            <Link href={localePath('/admin')} className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
