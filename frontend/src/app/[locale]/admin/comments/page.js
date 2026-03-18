'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { commentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';
import { useLocale } from 'next-intl';

export default function AdminCommentsPage() {
  const locale = useLocale();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState(null);

  const load = () => {
    setLoading(true);
    // Fetch all comments - get by a general endpoint or use article 0 as proxy
    commentAPI.getByArticle('all')
      .then(res => setComments(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await commentAPI.approve(id);
      toast.success('Đã duyệt bình luận!');
      setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await commentAPI.reject(id);
      toast.success('Đã từ chối bình luận!');
      setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa bình luận này?')) return;
    setProcessing(id);
    try {
      await commentAPI.delete(id);
      toast.success('Đã xóa bình luận!');
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = comments.filter(c => filter === 'all' || c.status === filter || (!c.status && filter === 'pending'));

  const STATUS_COLORS = {
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };

  const TABS = [
    { key: 'pending', label: 'Chờ Duyệt' },
    { key: 'approved', label: 'Đã Duyệt' },
    { key: 'rejected', label: 'Từ Chối' },
    { key: 'all', label: 'Tất Cả' },
  ];

  return (
    <AdminLayout title="Quản Lý Bình Luận">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl p-8 flex justify-center shadow-sm border border-gray-100">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
              Không có bình luận nào
            </div>
          ) : (
            filtered.map((comment, i) => (
              <motion.div
                key={comment.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {comment.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-japanese-dark text-sm">{comment.name || 'Anonymous'}</span>
                        {comment.email && <span className="text-xs text-gray-400">{comment.email}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[comment.status || 'pending']}`}>
                          {comment.status || 'pending'}
                        </span>
                      </div>
                      {comment.created_at && (
                        <p className="text-xs text-gray-400 mb-2">{formatDate(comment.created_at, locale)}</p>
                      )}
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      {comment.article_id && (
                        <p className="text-xs text-gray-400 mt-1">Bài viết ID: {comment.article_id}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {(!comment.status || comment.status === 'pending') && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id)}
                          disabled={processing === comment.id}
                          className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          disabled={processing === comment.id}
                          className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40"
                        >
                          ✗ Từ Chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={processing === comment.id}
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
