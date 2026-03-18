'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { testAPI } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';

const EMPTY_FORM = {
  slug: '', level: 'N5', type: 'mini', time_limit: 30,
  translations: { vi: { title: '', description: '' }, en: { title: '', description: '' } },
  questions: [
    { id: 1, text: '', options: ['', '', '', ''], correct: 0 }
  ]
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(EMPTY_FORM)));
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState('vi');

  const load = () => {
    setLoading(true);
    testAPI.getAll()
      .then(res => setTests(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      slug: t.slug || '', level: t.level || 'N5', type: t.type || 'mini',
      time_limit: t.time_limit || 30,
      translations: {
        vi: { title: t.translations?.vi?.title || '', description: t.translations?.vi?.description || '' },
        en: { title: t.translations?.en?.title || '', description: t.translations?.en?.description || '' },
      },
      questions: t.questions || [{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }]
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await testAPI.update(editing.id, form);
      else await testAPI.create(form);
      toast.success(editing ? 'Cập nhật thành công!' : 'Thêm bài kiểm tra thành công!');
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
    try { await testAPI.delete(id); toast.success('Đã xóa!'); load(); }
    catch { toast.error('Lỗi khi xóa!'); }
  };

  const addQuestion = () => {
    setForm(p => ({
      ...p,
      questions: [...p.questions, { id: Date.now(), text: '', options: ['', '', '', ''], correct: 0 }]
    }));
  };

  const removeQuestion = (idx) => {
    setForm(p => ({ ...p, questions: p.questions.filter((_, i) => i !== idx) }));
  };

  const updateQuestion = (idx, field, value) => {
    setForm(p => {
      const qs = [...p.questions];
      qs[idx] = { ...qs[idx], [field]: value };
      return { ...p, questions: qs };
    });
  };

  const updateOption = (qIdx, optIdx, value) => {
    setForm(p => {
      const qs = [...p.questions];
      const opts = [...qs[qIdx].options];
      opts[optIdx] = value;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...p, questions: qs };
    });
  };

  const setTrans = (lang, field, value) => {
    setForm(p => ({ ...p, translations: { ...p.translations, [lang]: { ...p.translations[lang], [field]: value } } }));
  };

  return (
    <AdminLayout title="Quản Lý Bài Kiểm Tra">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => { setEditing(null); setForm(JSON.parse(JSON.stringify(EMPTY_FORM))); setModal(true); }} className="btn-primary py-2 text-sm">
            Thêm Bài Kiểm Tra
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" /></div>
          ) : tests.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Chưa có bài kiểm tra nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Tên Bài Kiểm Tra</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Cấp Độ</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Số Câu</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Thời Gian</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, i) => (
                  <tr key={t.id || i} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-japanese-dark">{t.translations?.vi?.title || t.slug || '—'}</td>
                    <td className="px-4 py-3"><span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{t.level}</span></td>
                    <td className="px-4 py-3 text-gray-500">{t.question_count || t.questions?.length || '—'} câu</td>
                    <td className="px-4 py-3 text-gray-500">{t.time_limit || '—'} phút</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(t)} className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-medium">Sửa</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Xóa</button>
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
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white flex items-center justify-between z-10">
                <h2 className="font-bold text-japanese-dark">{editing ? 'Chỉnh Sửa Bài Kiểm Tra' : 'Thêm Bài Kiểm Tra Mới'}</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                    <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cấp Độ</label>
                    <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                      {['N5','N4','N3','N2','N1','A-B','C-D','E-F'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Thời Gian (phút)</label>
                    <input type="number" value={form.time_limit} onChange={e => setForm(p => ({ ...p, time_limit: Number(e.target.value) }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex gap-1">
                  {['vi', 'en'].map(lang => (
                    <button key={lang} type="button" onClick={() => setLangTab(lang)}
                      className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${langTab === lang ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <input value={form.translations[langTab]?.title || ''} onChange={e => setTrans(langTab, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder={`Tên bài kiểm tra (${langTab})`} />
                  <textarea value={form.translations[langTab]?.description || ''} onChange={e => setTrans(langTab, 'description', e.target.value)}
                    rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Hướng dẫn..." />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-japanese-dark">Câu Hỏi ({form.questions.length})</label>
                    <button type="button" onClick={addQuestion} className="text-xs text-primary font-medium hover:underline">+ Thêm Câu</button>
                  </div>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                    {form.questions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-400 mt-2 flex-shrink-0">Q{qIdx + 1}</span>
                          <input value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                            className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary" placeholder="Nội dung câu hỏi..." />
                          <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 ml-6">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <input type="radio" checked={q.correct === optIdx} onChange={() => updateQuestion(qIdx, 'correct', optIdx)}
                                className="accent-primary flex-shrink-0" />
                              <span className="text-xs text-gray-500 font-medium w-4">{['A','B','C','D'][optIdx]}</span>
                              <input value={opt} onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary" placeholder={`Đáp án ${['A','B','C','D'][optIdx]}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Hủy</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                    {saving ? 'Đang lưu...' : 'Lưu Bài Kiểm Tra'}
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
