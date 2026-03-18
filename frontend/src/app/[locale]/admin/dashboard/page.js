'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { articleAPI, programAPI, researchAPI, contactAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';

export default function DashboardPage() {
  const locale = useLocale();
  const localePath = (href) => `/${locale}${href}`;
  const [stats, setStats] = useState({ articles: 0, programs: 0, research: 0, contacts: 0 });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      articleAPI.getAll({ limit: 1 }),
      programAPI.getAll({ limit: 1 }),
      researchAPI.getAll({ limit: 1 }),
      contactAPI.getAll({ limit: 5 }),
    ]).then(([articles, programs, research, ctcts]) => {
      setStats({
        articles: articles.value?.data?.total || articles.value?.data?.length || 0,
        programs: programs.value?.data?.total || programs.value?.data?.length || 0,
        research: research.value?.data?.total || research.value?.data?.length || 0,
        contacts: ctcts.value?.data?.total || ctcts.value?.data?.length || 0,
      });
      setContacts(ctcts.value?.data?.contacts || ctcts.value?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Bài Viết', value: stats.articles || '—', href: '/admin/articles', color: 'bg-blue-50 text-blue-700' },
    { label: 'Chương Trình', value: stats.programs || '—', href: '/admin/programs', color: 'bg-green-50 text-green-700' },
    { label: 'Nghiên Cứu', value: stats.research || '—', href: '/admin/research', color: 'bg-purple-50 text-purple-700' },
    { label: 'Liên Hệ Mới', value: stats.contacts || '—', href: '/admin/contacts', color: 'bg-orange-50 text-orange-700' },
  ];

  const QUICK_LINKS = [
    { label: 'Thêm Bài Viết Mới', href: '/admin/articles' },
    { label: 'Duyệt Bình Luận', href: '/admin/comments' },
    { label: 'Xem Liên Hệ', href: '/admin/contacts' },
    { label: 'Thêm Bài Kiểm Tra', href: '/admin/tests' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={localePath(card.href)} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${card.color}`}>
                  <span className="text-lg font-bold">{card.value}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-japanese-dark mb-4">Thao Tác Nhanh</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map(link => (
                <Link key={link.label} href={localePath(link.href)}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-red-50 transition-all text-sm text-gray-700 hover:text-primary font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-japanese-dark">Liên Hệ Gần Đây</h2>
              <Link href={localePath('/admin/contacts')} className="text-xs text-primary hover:underline">Xem Tất Cả</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Chưa có liên hệ nào</p>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 5).map((contact, i) => (
                  <div key={contact.id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {contact.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-japanese-dark truncate">{contact.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.subject || contact.email || ''}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contact.status === 'resolved' ? 'bg-green-100 text-green-600' :
                        contact.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {contact.status || 'new'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-japanese-dark mb-4">Thông Tin Hệ Thống</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <p className="font-medium text-green-700">Backend API</p>
                <p className="text-green-600 text-xs">http://localhost:5010</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-500 text-xl">🌐</span>
              <div>
                <p className="font-medium text-blue-700">Frontend</p>
                <p className="text-blue-600 text-xs">http://localhost:3001</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-500 text-xl">🌍</span>
              <div>
                <p className="font-medium text-purple-700">Ngôn Ngữ</p>
                <p className="text-purple-600 text-xs">VI / EN / JP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
