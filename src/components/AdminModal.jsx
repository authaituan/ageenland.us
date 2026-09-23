import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Clock, Database, Calendar, Phone, MapPin, DollarSign } from 'lucide-react';

export default function AdminModal({ isOpen, onClose }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/quotes');
      const data = await res.json();
      if (data.success) {
        setQuotes(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuotes();
    }
  }, [isOpen]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchQuotes();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#081C15] border border-emerald-500/30 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0D2B1D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20E070]/20 flex items-center justify-center text-[#20E070]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">Quản Lý Yêu Cầu Báo Giá (SQLite Database)</h3>
              <p className="text-xs text-slate-400">Danh sách báo giá được khách hàng gửi từ Frontend & lưu trữ Backend Node.js Express</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchQuotes}
              disabled={loading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title="Làm mới danh sách"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Table / List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {quotes.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Clock className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
              <p className="text-slate-400 text-sm">Chưa có yêu cầu báo giá nào trong cơ sở dữ liệu SQLite.</p>
              <p className="text-xs text-slate-500">Thử gửi báo giá từ công cụ tính chi phí trên website để kiểm tra!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <div key={q.id} className="bg-[#07150E] p-5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-[#20E070] border border-emerald-500/30">
                        #{q.id}
                      </span>
                      <h4 className="font-bold text-white text-base font-serif">{q.fullName}</h4>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        q.status === 'Completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : q.status === 'Confirmed'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                      }`}>
                        {q.status === 'Completed' ? 'Đã hoàn thành' : q.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#20E070]" />
                        <span>{q.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#20E070]" />
                        <span className="truncate max-w-[200px]">{q.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#20E070]" />
                        <span>{q.preferredDate || 'Chưa chọn ngày'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#20E070]" />
                        <span className="font-bold text-[#20E070]">{(q.estimatedCost || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5 mt-2">
                      <strong className="text-slate-200">Dịch vụ:</strong> {q.serviceName} ({q.gardenArea} m², {q.frequency})
                      {q.notes && <span className="block mt-1 italic">Ghi chú: {q.notes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleUpdateStatus(q.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/30 transition-all"
                    >
                      Xác Nhận
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(q.id, 'Completed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold border border-emerald-500/30 transition-all"
                    >
                      Hoàn Thành
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
