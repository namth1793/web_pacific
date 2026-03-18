'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';

const METHODS = [
  {
    key: 'exam', color: 'bg-blue-50 border-blue-200',
    title: 'Xét Tuyển Theo Điểm Thi THPT',
    desc: 'Xét tuyển dựa trên kết quả kỳ thi tốt nghiệp THPT Quốc Gia. Tổ hợp xét tuyển: D01 (Toán, Văn, Anh) hoặc D06 (Toán, Anh, Văn).',
    requirement: 'Điểm chuẩn: 18-22 điểm (3 môn)',
  },
  {
    key: 'record', color: 'bg-green-50 border-green-200',
    title: 'Xét Tuyển Học Bạ',
    desc: 'Xét tuyển dựa trên học lực THPT. Yêu cầu học lực Giỏi liên tục 3 năm hoặc điểm trung bình các môn tổ hợp từ 7.0 trở lên.',
    requirement: 'GPA >= 7.0 tất cả các môn tổ hợp',
  },
  {
    key: 'direct', color: 'bg-purple-50 border-purple-200',
    title: 'Tuyển Thẳng Xét Đặc Cách',
    desc: 'Dành cho học sinh đoạt giải Quốc gia, Quốc tế, hoặc có chứng chỉ tiếng Nhật JLPT N3 trở lên.',
    requirement: 'Giải QG/QT hoặc JLPT N3+',
  },
];

const SCHOLARSHIPS = [
  { name: 'Học Bổng Monbukagakusho (MEXT)', value: '100%', desc: 'Học bổng chính phủ Nhật Bản - toàn phần cho học sau đại học', color: 'text-red-600' },
  { name: 'Học Bổng JASSO', value: '80.000 JPY/tháng', desc: 'Hỗ trợ sinh hoạt phí cho sinh viên trao đổi tại Nhật', color: 'text-blue-600' },
  { name: 'Học Bổng Trường 100%', value: '100%', desc: 'Miễn toàn bộ học phí cho sinh viên xuất sắc đầu vào', color: 'text-green-600' },
  { name: 'Học Bổng Trường 50%', value: '50%', desc: 'Giảm 50% học phí cho sinh viên có điểm xét tuyển cao', color: 'text-purple-600' },
  { name: 'Học Bổng Doanh Nghiệp Nhật', value: '5-15tr/kỳ', desc: 'Hỗ trợ từ các công ty Nhật Bản như Toyota, Sony, Panasonic', color: 'text-orange-600' },
];

const TUITION = [
  { program: 'Cử Nhân Ngôn Ngữ Nhật Bản', level: 'Đại Học', fee: '15.000.000', unit: 'VND/học kỳ', note: '8 học kỳ' },
  { program: 'Nhật Bản Học', level: 'Đại Học', fee: '15.000.000', unit: 'VND/học kỳ', note: '8 học kỳ' },
  { program: 'Biên Phiên Dịch Tiếng Nhật', level: 'Đại Học', fee: '15.500.000', unit: 'VND/học kỳ', note: '8 học kỳ' },
  { program: 'Thạc Sĩ Nhật Bản Học', level: 'Sau Đại Học', fee: '22.000.000', unit: 'VND/học kỳ', note: '4 học kỳ' },
  { program: 'Luyện Thi JLPT', level: 'Chứng Chỉ', fee: '3.500.000', unit: 'VND/khóa', note: '3-6 tháng' },
];

const TIMELINE = [
  { date: 'T3-T5/2026', title: 'Nộp Hồ Sơ Xét Tuyển Học Bạ', desc: 'Nộp hồ sơ trực tuyến qua cổng tuyển sinh' },
  { date: 'T6/2026', title: 'Thi THPT Quốc Gia', desc: 'Kỳ thi tốt nghiệp THPT và xét tuyển ĐH' },
  { date: 'T7-T8/2026', title: 'Công Bố Điểm Chuẩn', desc: 'Công bố kết quả xét tuyển và nhập học' },
  { date: 'T9/2026', title: 'Khai Giảng Năm Học Mới', desc: 'Bắt đầu học kỳ I năm học 2026-2027' },
];

export default function AdmissionPage() {
  const t = useTranslations('admission');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const localePath = (href) => `/${locale}${href}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.submit({ ...form, type: 'admission' });
      setSubmitted(true);
      toast.success(t('form.success'));
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
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

      {/* Timeline */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">Lịch Tuyển Sinh 2026</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < TIMELINE.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-primary/20 z-0" />
                )}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs text-primary font-medium mb-1">{item.date}</div>
                    <h3 className="font-bold text-japanese-dark text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Methods */}
      <section className="py-14 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('methods')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METHODS.map((method, i) => (
              <motion.div
                key={method.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border rounded-xl p-6 ${method.color}`}
              >
                <h3 className="font-bold text-japanese-dark mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{method.desc}</p>
                <div className="bg-white/60 rounded-lg p-2 text-xs font-medium text-gray-700">
                  {method.requirement}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('tuition')}</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-5 py-3 text-left font-semibold">Chương Trình</th>
                  <th className="px-5 py-3 text-left font-semibold">Trình Độ</th>
                  <th className="px-5 py-3 text-right font-semibold">Học Phí</th>
                  <th className="px-5 py-3 text-left font-semibold">Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {TUITION.map((row, i) => (
                  <motion.tr
                    key={row.program}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-5 py-3 font-medium text-japanese-dark">{row.program}</td>
                    <td className="px-5 py-3">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{row.level}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-primary">{row.fee} <span className="text-xs font-normal text-gray-400">{row.unit}</span></td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{row.note}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Học phí có thể thay đổi theo năm học. Vui lòng liên hệ phòng tuyển sinh để xác nhận.</p>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-14 bg-japanese-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('scholarships')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHOLARSHIPS.map((sch, i) => (
              <motion.div
                key={sch.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className={`text-2xl font-bold mb-2 ${sch.color}`}>{sch.value}</div>
                <h3 className="font-bold text-japanese-dark text-sm mb-2">{sch.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{sch.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="japanese-divider mb-8">
            <h2 className="section-title mb-0">{t('consult')}</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-xl font-bold text-japanese-dark mb-2">Đăng Ký Thành Công!</h3>
                <p className="text-gray-500">{t('form.success')}</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">Đăng Ký Thêm</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.name')} *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" placeholder={t('form.name')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.phone')} *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="0901234567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.email')}</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.program')}</label>
                  <select value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-white">
                    <option value="">-- Chọn chương trình --</option>
                    <option value="cu-nhan-ngon-ngu-nhat">Cử Nhân Ngôn Ngữ Nhật Bản</option>
                    <option value="nhat-ban-hoc">Nhật Bản Học</option>
                    <option value="bien-phien-dich">Biên Phiên Dịch Tiếng Nhật</option>
                    <option value="thac-si">Thạc Sĩ Nhật Bản Học</option>
                    <option value="luyen-thi">Luyện Thi JLPT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.message')}</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Câu hỏi hoặc thông tin cần tư vấn..." />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base disabled:opacity-60">
                  {submitting ? 'Đang gửi...' : t('form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
