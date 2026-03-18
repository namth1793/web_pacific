'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      const token = res.data?.token || res.data?.access_token;
      if (token) {
        localStorage.setItem('admin_token', token);
        toast.success('Đăng nhập thành công!');
        router.push(`/${locale}/admin/dashboard`);
      } else {
        setError('Đăng nhập thất bại. Kiểm tra thông tin đăng nhập.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-japanese-gray flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4" style={{ fontFamily: 'Noto Sans JP' }}>
            日
          </div>
          <h1 className="text-2xl font-bold text-japanese-dark">Quản Trị Viên</h1>
          <p className="text-gray-400 text-sm mt-1">Khoa Nhật Bản Học</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-5"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@japanesefaculty.edu.vn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật Khẩu</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <a href={`/${locale}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
            Quay Về Trang Chủ
          </a>
        </div>
      </motion.div>
    </div>
  );
}
