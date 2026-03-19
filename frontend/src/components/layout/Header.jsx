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

  const LOCALE_LABELS = { vi: 'VI', en: 'EN', jp: '日' };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : ''}`}>
      {/* Japanese red stripe — top */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary w-full" />

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            {/* Rising sun logo */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-primary/30 group-hover:shadow-md transition-shadow"
              style={{ fontFamily: 'Noto Serif JP' }}>
              日
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm text-japanese-dark leading-tight tracking-wide"
              style={{ fontFamily: 'Noto Serif JP' }}>日本語学部</div>
            <div className="text-[10px] text-japanese-muted leading-tight tracking-widest uppercase">Japanese Studies</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden xl:flex items-center">
          {navLinks.map(link => (
            <Link key={link.key} href={localePath(link.href)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap group ${
                isActive(link.href) ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              {t(link.key)}
              <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full transition-transform duration-200 origin-left ${
                isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language switcher — Japanese flag style */}
          <div className="flex items-center gap-1">
            {['vi', 'en', 'jp'].map((loc) => (
              <button key={loc} onClick={() => switchLocale(loc)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 ${
                  locale === loc
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                style={loc === 'jp' ? { fontFamily: 'Noto Serif JP' } : {}}
              >
                {LOCALE_LABELS[loc]}
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
