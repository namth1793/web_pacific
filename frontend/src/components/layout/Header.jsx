'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
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

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const localePath = (href) => `/${locale}${href === '/' ? '' : href}`;
  const isActive = (href) => {
    const full = localePath(href);
    return pathname === full || (href !== '/' && pathname.startsWith(full));
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="h-1 bg-primary w-full" />
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-xl" style={{ fontFamily: 'Noto Sans JP' }}>
            日
          </div>
          <div>
            <div className="font-bold text-sm text-japanese-dark leading-tight" style={{ fontFamily: 'Noto Sans JP' }}>日本語学部</div>
            <div className="text-xs text-japanese-muted leading-tight">Khoa Nhật Bản Học</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.key}
              href={localePath(link.href)}
              className={`px-3 py-2 text-sm rounded font-medium transition-colors whitespace-nowrap ${
                isActive(link.href)
                  ? 'text-primary bg-red-50'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center border border-gray-200 rounded overflow-hidden text-xs">
            {['vi', 'en', 'jp'].map((loc, i) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`px-2.5 py-1.5 font-medium transition-colors ${
                  locale === loc ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                } ${i > 0 ? 'border-l border-gray-200' : ''}`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.key}
                  href={localePath(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded font-medium transition-colors ${
                    isActive(link.href) ? 'text-primary bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
