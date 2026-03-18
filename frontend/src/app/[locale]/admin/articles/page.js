'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { articleAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';

const EMPTY_FORM = {
  slug: '',
  category: 'news',
  published_at: new Date().toISOString().split('T')[0],
  cover_image: '',
  is_featured: false,
  translations: {
    vi: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' },
    jp: { title: '', excerpt: '', content: '' },
  }
};

export default function AdminArticlesPage() {
  const locale = useLocale();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState('vi');
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    articleAPI.getAll()
      .then(res => setArticles(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(JSON.parse(JSON.stringify(EMPTY_FORM)));
    setModal(true);
  };

  const openEdit = (article) => {
    setEditing(article);
    setForm({
      slug: article.slug || '',
      category: article.category || 'news',
      published_at: article.published_at?.split('T')[0] || '',
      cover_image: article.cover_image || '',
      is_featured: !!article.is_featured,
      translations: {
        vi: { title: article.translations?.vi?.title || '', excerpt: article.translations?.vi?.excerpt || '', content: article.translations?.vi?.content || '' },
        en: { title: article.translations?.en?.title || '', excerpt: article.translations?.en?.excerpt || '', content: article.translations?.en?.content || '' },
        jp: { title: article.translations?.jp?.title || '', excerpt: article.translations?.jp?.excerpt || '', content: article.translations?.jp?.content || '' },
      }
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await articleAPI.update(editing.id, form);
        toast.success('Cập nhật thành công!');
      } else {
        await articleAPI.create(form);
        toast.success('Tạo bài viết thành công!');
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
    if (!confirm('Xác nhận xóa bài viết này?')) return;
    setDeleting(id);
    try {
      await articleAPI.delete(id);
      toast.success('Đã xóa!');
      load();
    } catch {
      toast.error('Có lỗi khi xóa!');
    } finally {
      setDeleting(null);
    }
  };

  const setTrans = (lang, field, value) => {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: { ...prev.translations[lang], [field]: value }
      }
    }));
  };

  return (
    <AdminLayout title="Quản Lý Bài Viết">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">{articles.length} bài viết</p>
          <button onClick={openCreate} className="btn-primary py-2 text-sm flex items-center gap-2">
            Thêm Bài Viết
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Chưa có bài viết nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tiêu Đề</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Danh Mục</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày Đăng</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nổi Bật</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, i) => (
                  <tr key={article.id || i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-japanese-dark line-clamp-1">
                        {article.translations?.vi?.title || article.slug || '—'}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{article.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{article.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {article.published_at ? formatDate(article.published_at, locale) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {article.is_featured ? <span className="text-yellow-500 text-xs font-medium">Nổi bật</span> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(article)} className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(article.id)} disabled={deleting === article.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40">
                        {deleting === article.id ? '...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
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
                <h2 className="font-bold text-japanese-dark">{editing ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                    <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="bai-viet-slug" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Danh Mục</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="news">Tin Tức</option>
                      <option value="conference">Hội Thảo</option>
                      <option value="internship">Thực Tập</option>
                      <option value="partners">Đối Tác</option>
                      <option value="projects">Dự Án</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ngày Đăng</label>
                    <input type="date" value={form.published_at} onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL Ảnh Bìa</label>
                    <input value={form.cover_image} onChange={e => setForm(p => ({ ...p, cover_image: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://..." />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="rounded" />
                  <span>Bài viết nổi bật</span>
                </label>

                {/* Language Tabs */}
                <div>
                  <div className="flex gap-1 mb-3">
                    {['vi', 'en', 'jp'].map(lang => (
                      <button key={lang} type="button" onClick={() => setLangTab(lang)}
                        className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${langTab === lang ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu Đề ({langTab})</label>
                      <input value={form.translations[langTab].title} onChange={e => setTrans(langTab, 'title', e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Tiêu đề bài viết..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tóm Tắt ({langTab})</label>
                      <textarea value={form.translations[langTab].excerpt} onChange={e => setTrans(langTab, 'excerpt', e.target.value)}
                        rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Tóm tắt..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nội Dung ({langTab})</label>
                      <textarea value={form.translations[langTab].content} onChange={e => setTrans(langTab, 'content', e.target.value)}
                        rows={8} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Nội dung bài viết..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Hủy</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                    {saving ? 'Đang lưu...' : (editing ? 'Cập Nhật' : 'Tạo Bài Viết')}
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
