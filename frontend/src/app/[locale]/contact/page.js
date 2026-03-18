'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [visitForm, setVisitForm] = useState({ name: '', email: '', phone: '', date: '', group_size: '' });
  const [submitting, setSubmitting] = useState(false);
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  const localePath = (href) => `/${locale}${href}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.submit({ ...form, type: 'contact' });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success(t('form.success'));
    } catch {
      toast.error('Có lỗi xảy ra.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    setVisitSubmitting(true);
    try {
      await contactAPI.submit({ ...visitForm, type: 'visit' });
      setVisitSubmitted(true);
      toast.success('Đăng ký tham quan thành công!');
    } catch {
      toast.error('Có lỗi xảy ra.');
    } finally {
      setVisitSubmitting(false);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-5"
          >
            <div>
              <div className="japanese-divider mb-4">
                <h2 className="text-xl font-bold text-japanese-dark mb-0">Thông Tin Liên Hệ</h2>
              </div>
            </div>

            {[
              {
                icon: '📍', title: t('address'),
                content: '123 Đường Nguyễn Lương Bằng, Quận Liên Chiểu,\nĐà Nẵng, Việt Nam'
              },
              {
                icon: '📞', title: t('phone'),
                content: '(+84) 236 3 456 789\n(+84) 236 3 456 790 (Fax)'
              },
              {
                icon: '📧', title: t('email'),
                content: 'khoanhattbanhoc@university.edu.vn\ntuyensinh.nbs@university.edu.vn'
              },
              {
                icon: '🕐', title: t('hours'),
                content: 'Thứ 2 - Thứ 6: 7:30 - 17:00\nThứ 7: 7:30 - 11:30\nChủ Nhật: Nghỉ'
              },
            ].map(info => (
              <div key={info.title} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <h3 className="font-bold text-japanese-dark text-sm mb-1">{info.title}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{info.content}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {[
                { label: 'Facebook', icon: '📘', url: '#' },
                { label: 'YouTube', icon: '📺', url: '#' },
                { label: 'Zalo', icon: '💬', url: '#' },
              ].map(social => (
                <a key={social.label} href={social.url}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
                  <span>{social.icon}</span>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="japanese-divider mb-6">
              <h2 className="text-xl font-bold text-japanese-dark mb-0">Gửi Tin Nhắn</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              {submitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-japanese-dark mb-2">Tin Nhắn Đã Gửi!</h3>
                  <p className="text-gray-500 text-sm">{t('form.success')}</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline mt-4 text-sm py-2">Gửi Tin Nhắn Khác</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.name')} *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder={t('form.name')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.phone')}</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="0901234567" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.email')} *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.subject')} *</label>
                    <input type="text" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Tiêu đề tin nhắn..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.message')} *</label>
                    <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={5} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                      placeholder="Nội dung tin nhắn..." />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60">
                    {submitting ? 'Đang gửi...' : t('form.submit')}
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-6" style={{ height: '280px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.7697765800546!2d108.2188563!3d16.0544089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219d71c56e7b3%3A0x5a1a63c785fcaaee!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Visit Form */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="font-bold text-japanese-dark mb-4 flex items-center gap-2">
                🏫 {t('visit')}
              </h3>
              {visitSubmitted ? (
                <p className="text-green-600 text-sm font-medium">✅ Đăng ký tham quan thành công! Chúng tôi sẽ liên hệ xác nhận.</p>
              ) : (
                <form onSubmit={handleVisitSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" required placeholder="Họ tên *" value={visitForm.name} onChange={e => setVisitForm(p => ({ ...p, name: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  <input type="tel" required placeholder="Số điện thoại *" value={visitForm.phone} onChange={e => setVisitForm(p => ({ ...p, phone: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  <input type="date" required value={visitForm.date} onChange={e => setVisitForm(p => ({ ...p, date: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  <div className="sm:col-span-2">
                    <input type="email" placeholder="Email" value={visitForm.email} onChange={e => setVisitForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <button type="submit" disabled={visitSubmitting} className="btn-primary py-2 text-sm disabled:opacity-60">
                    {visitSubmitting ? '...' : 'Đăng Ký'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
