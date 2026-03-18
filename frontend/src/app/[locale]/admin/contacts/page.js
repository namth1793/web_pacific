'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';
import { useLocale } from 'next-intl';

export default function AdminContactsPage() {
  const locale = useLocale();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    contactAPI.getAll()
      .then(res => setContacts(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await contactAPI.updateStatus(id, status);
      toast.success('Cập nhật trạng thái!');
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setUpdating(null);
    }
  };

  const STATUSES = {
    new: { label: 'Mới', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Đang Xử Lý', color: 'bg-blue-100 text-blue-700' },
    resolved: { label: 'Đã Xử Lý', color: 'bg-green-100 text-green-700' },
    closed: { label: 'Đã Đóng', color: 'bg-gray-100 text-gray-600' },
  };

  const TYPE_LABELS = { contact: 'Liên Hệ', admission: 'Tuyển Sinh', visit: 'Tham Quan' };

  const filtered = contacts.filter(c => filter === 'all' || c.status === filter || (!c.status && filter === 'new'));

  return (
    <AdminLayout title="Quản Lý Liên Hệ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>Tất Cả</button>
            {Object.entries(STATUSES).map(([key, s]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="bg-white rounded-xl p-8 flex justify-center shadow-sm border border-gray-100">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">Không có liên hệ nào</div>
            ) : (
              filtered.map((contact, i) => {
                const status = STATUSES[contact.status || 'new'] || STATUSES.new;
                return (
                  <motion.div
                    key={contact.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(contact)}
                    className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${selected?.id === contact.id ? 'border-primary' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                          {contact.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-japanese-dark text-sm truncate">{contact.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400 truncate">{contact.email || contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                        {contact.type && <span className="text-xs text-gray-400">{TYPE_LABELS[contact.type] || contact.type}</span>}
                      </div>
                    </div>
                    {contact.subject && (
                      <p className="text-xs text-gray-500 mt-2 pl-13 truncate">{contact.subject}</p>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-1">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-japanese-dark">Chi Tiết</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'Họ Tên', value: selected.name },
                  { label: 'Email', value: selected.email },
                  { label: 'Điện Thoại', value: selected.phone },
                  { label: 'Loại', value: TYPE_LABELS[selected.type] || selected.type },
                  { label: 'Ngày Gửi', value: selected.created_at ? formatDate(selected.created_at, locale) : '—' },
                ].map(item => item.value && (
                  <div key={item.label}>
                    <span className="text-xs text-gray-400 block">{item.label}</span>
                    <span className="text-sm text-japanese-dark font-medium">{item.value}</span>
                  </div>
                ))}

                {selected.subject && (
                  <div>
                    <span className="text-xs text-gray-400 block">Tiêu Đề</span>
                    <span className="text-sm text-japanese-dark font-medium">{selected.subject}</span>
                  </div>
                )}

                {selected.message && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Nội Dung</span>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3 leading-relaxed">{selected.message}</p>
                  </div>
                )}

                {selected.program && (
                  <div>
                    <span className="text-xs text-gray-400 block">Chương Trình</span>
                    <span className="text-sm text-japanese-dark">{selected.program}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Cập Nhật Trạng Thái:</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUSES).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusUpdate(selected.id, key)}
                      disabled={updating === selected.id || selected.status === key}
                      className={`py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-40 ${
                        selected.status === key ? s.color + ' cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
              <p className="text-4xl mb-3">📧</p>
              <p className="text-sm">Chọn một liên hệ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
