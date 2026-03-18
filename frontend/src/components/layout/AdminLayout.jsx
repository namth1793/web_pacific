'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const Icons = {
  dashboard: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>,
  articles:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  programs:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12 12 0 0112 21.5a12 12 0 01-6.16-10.922L12 14z"/></svg>,
  research:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>,
  tests:     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  comments:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  contacts:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  logout:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  external:  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>,
};

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard',    icon: 'dashboard' },
  { href: '/admin/articles',  label: 'Bài Viết',     icon: 'articles'  },
  { href: '/admin/programs',  label: 'Chương Trình', icon: 'programs'  },
  { href: '/admin/research',  label: 'Nghiên Cứu',   icon: 'research'  },
  { href: '/admin/tests',     label: 'Bài Kiểm Tra', icon: 'tests'     },
  { href: '/admin/comments',  label: 'Bình Luận',    icon: 'comments'  },
  { href: '/admin/contacts',  label: 'Liên Hệ',      icon: 'contacts'  },
];

export default function AdminLayout({ children, title }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (!token) router.push(localePath('/admin/login'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push(localePath('/admin/login'));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className="bg-japanese-dark text-white flex-shrink-0 overflow-hidden relative"
        style={{ minHeight: '100vh' }}
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ fontFamily: 'Noto Sans JP' }}>
            日
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate">Admin Panel</div>
              <div className="text-xs text-gray-400 truncate">Khoa Nhật Bản Học</div>
            </div>
          )}
        </div>

        <nav className="p-2 space-y-0.5 mt-1">
          {NAV_ITEMS.map(item => {
            const active = pathname.includes(item.href);
            return (
              <Link key={item.href} href={localePath(item.href)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{Icons[item.icon]}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-2 space-y-0.5">
          <Link href={localePath('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <span className="flex-shrink-0">{Icons.external}</span>
            {sidebarOpen && <span>Xem Trang Web</span>}
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <span className="flex-shrink-0">{Icons.logout}</span>
            {sidebarOpen && <span>Đăng Xuất</span>}
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-semibold text-japanese-dark text-sm">{title}</h1>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
