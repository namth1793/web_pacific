'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { researchAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';
import { useLocale } from 'next-intl';

const EMPTY_FORM = {
  slug: '', type: 'faculty', author: '', published_at: new Date().toISOString().split('T')[0], keywords: '',
  translations: {
    vi: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' },
    jp: { title: '', excerpt: '', content: '' },
  }
};

export default function AdminResearchPage() {
  const locale = useLocale();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(EMPTY_FORM)));
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState('vi');

  const load = () => {
    setLoading(true);
    researchAPI.getAll()
      .then(res => setItems(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      slug: r.slug || '', type: r.type || 'faculty', author: r.author || '',
      published_at: r.published_at?.split('T')[0] || '',
      keywords: Array.isArray(r.keywords) ? r.keywords.join(', ') : (r.keywords || ''),
      translations: {
        vi: { title: r.translations?.vi?.title || '', excerpt: r.translations?.vi?.excerpt || '', content: r.translations?.vi?.content || '' },
        en: { title: r.translations?.en?.title || '', excerpt: r.translations?.en?.excerpt || '', content: r.translations?.en?.content || '' },
        jp: { title: r.translations?.jp?.title || '', excerpt: r.translations?.jp?.excerpt || '', content: r.translations?.jp?.content || '' },
      }
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) };
      if (editing) await researchAPI.update(editing.id, payload);
      else await researchAPI.create(payload);
      toast.success(editing ? 'Cập nhật thành công!' : 'Thêm nghiên cứu thành công!');
      setModal(false);
      load();
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa?')) return;
    try { await researchAPI.delete(id); toast.success('Đã xóa!'); load(); }
    catch { toast.error('Lỗi khi xóa!'); }
  };

  const setTrans = (lang, field, value) => {
    setForm(prev => ({ ...prev, translations: { ...prev.translations, [lang]: { ...prev.translations[lang], [field]: value } } }));
  };

  return (
    <AdminLayout title="Quản Lý Nghiên Cứu Khoa Học">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => { setEditing(null); setForm(JSON.parse(JSON.stringify(EMPTY_FORM))); setModal(true); }} className="btn-primary py-2 text-sm">
            🔬 Thêm Nghiên Cứu
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Chưa có nghiên cứu nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Tiêu Đề</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Tác Giả</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Loại</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Ngày</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={r.id || i} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-japanese-dark line-clamp-1">{r.translations?.vi?.title || r.slug || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.author || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${r.type === 'faculty' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {r.type === 'faculty' ? 'Giảng Viên' : 'Sinh Viên'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.published_at ? formatDate(r.published_at, locale) : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white flex items-center justify-between">
                <h2 className="font-bold text-japanese-dark">{editing ? 'Chỉnh Sửa' : 'Thêm Nghiên Cứu'}</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                    <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Loại</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="faculty">Giảng Viên</option>
                      <option value="student">Sinh Viên</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tác Giả</label>
                    <input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ngày Công Bố</label>
                    <input type="date" value={form.published_at} onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Từ Khóa (ngăn cách bởi dấu phẩy)</label>
                  <input value={form.keywords} onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="từ khóa 1, từ khóa 2" />
                </div>

                <div className="flex gap-1">
                  {['vi', 'en', 'jp'].map(lang => (
                    <button key={lang} type="button" onClick={() => setLangTab(lang)}
                      className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${langTab === lang ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <input value={form.translations[langTab].title} onChange={e => setTrans(langTab, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder={`Tiêu đề (${langTab})`} />
                  <textarea value={form.translations[langTab].excerpt} onChange={e => setTrans(langTab, 'excerpt', e.target.value)}
                    rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Tóm tắt..." />
                  <textarea value={form.translations[langTab].content} onChange={e => setTrans(langTab, 'content', e.target.value)}
                    rows={6} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Nội dung..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Hủy</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
