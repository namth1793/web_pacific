'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { programAPI } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';

const EMPTY_FORM = {
  slug: '', type: 'formal', level: '', duration: '',
  translations: {
    vi: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' },
    jp: { title: '', excerpt: '', content: '' },
  }
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(EMPTY_FORM)));
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState('vi');

  const load = () => {
    setLoading(true);
    programAPI.getAll()
      .then(res => setPrograms(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(JSON.parse(JSON.stringify(EMPTY_FORM)));
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      slug: p.slug || '',
      type: p.type || 'formal',
      level: p.level || '',
      duration: p.duration || '',
      translations: {
        vi: { title: p.translations?.vi?.title || '', excerpt: p.translations?.vi?.excerpt || '', content: p.translations?.vi?.content || '' },
        en: { title: p.translations?.en?.title || '', excerpt: p.translations?.en?.excerpt || '', content: p.translations?.en?.content || '' },
        jp: { title: p.translations?.jp?.title || '', excerpt: p.translations?.jp?.excerpt || '', content: p.translations?.jp?.content || '' },
      }
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await programAPI.update(editing.id, form);
        toast.success('Cập nhật thành công!');
      } else {
        await programAPI.create(form);
        toast.success('Tạo chương trình thành công!');
      }
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
    try {
      await programAPI.delete(id);
      toast.success('Đã xóa!');
      load();
    } catch {
      toast.error('Lỗi khi xóa!');
    }
  };

  const setTrans = (lang, field, value) => {
    setForm(prev => ({
      ...prev,
      translations: { ...prev.translations, [lang]: { ...prev.translations[lang], [field]: value } }
    }));
  };

  const TYPE_LABELS = { formal: 'Chính Quy', non_formal: 'Không Chính Quy', postgraduate: 'Sau Đại Học' };

  return (
    <AdminLayout title="Quản Lý Chương Trình Đào Tạo">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={openCreate} className="btn-primary py-2 text-sm">Thêm Chương Trình</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
          ) : programs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Chưa có chương trình nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tên Chương Trình</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Loại</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Trình Độ</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Thời Gian</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p, i) => (
                  <tr key={p.id || i} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-japanese-dark">{p.translations?.vi?.title || p.slug || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{TYPE_LABELS[p.type] || p.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.level || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.duration || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Xóa</button>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="font-bold text-japanese-dark">{editing ? 'Chỉnh Sửa Chương Trình' : 'Thêm Chương Trình'}</h2>
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
                      <option value="formal">Chính Quy</option>
                      <option value="non_formal">Không Chính Quy</option>
                      <option value="postgraduate">Sau Đại Học</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trình Độ</label>
                    <input value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Đại Học, Thạc Sĩ..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Thời Gian</label>
                    <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="4 năm, 6 tháng..." />
                  </div>
                </div>

                <div className="flex gap-1 mb-2">
                  {['vi', 'en', 'jp'].map(lang => (
                    <button key={lang} type="button" onClick={() => setLangTab(lang)}
                      className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${langTab === lang ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <input value={form.translations[langTab].title} onChange={e => setTrans(langTab, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder={`Tên chương trình (${langTab})`} />
                  <textarea value={form.translations[langTab].excerpt} onChange={e => setTrans(langTab, 'excerpt', e.target.value)}
                    rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Tóm tắt..." />
                  <textarea value={form.translations[langTab].content} onChange={e => setTrans(langTab, 'content', e.target.value)}
                    rows={6} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Nội dung chi tiết..." />
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
