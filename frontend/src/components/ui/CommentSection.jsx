'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { commentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function CommentSection({ articleId }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    commentAPI.getByArticle(articleId)
      .then(res => setComments(res.data?.comments || res.data || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      await commentAPI.create({ ...form, article_id: articleId });
      setSubmitted(true);
      setForm({ name: '', email: '', content: '' });
      toast.success(t('comment_pending'));
    } catch {
      toast.error(t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-japanese-dark mb-6 flex items-center gap-3">
        <span className="block h-6 w-1 bg-primary rounded" />
        {t('comments')} {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm py-6 text-center border border-dashed border-gray-200 rounded-lg">
          {t('no_data')}
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {comments.map((comment, idx) => (
              <motion.div
                key={comment.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {comment.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-japanese-dark">{comment.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {comment.created_at ? formatDate(comment.created_at, locale) : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-10">{comment.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-japanese-dark mb-4">{t('leave_comment')}</h4>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm text-center"
          >
            ✓ {t('comment_pending')}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('your_name')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('your_name')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('your_email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('your_email')}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('your_comment')} *</label>
              <textarea
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                required
                rows={4}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder={t('your_comment')}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : t('post_comment')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
