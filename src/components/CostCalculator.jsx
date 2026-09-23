import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle, AlertCircle, Calendar, MapPin, Phone, User, Mail, FileText, Send, Sparkles } from 'lucide-react';

const SERVICE_RATES = [
  { id: 'lawn-mowing', name: 'Cắt cỏ & Bảo dưỡng thảm cỏ', rate: 8000, base: 200000 },
  { id: 'tree-planting', name: 'Trồng cây & Cắt tỉa tạo hình', rate: 15000, base: 500000 },
  { id: 'landscape-design', name: 'Thiết kế & Xử lý cảnh quan sân vườn', rate: 45000, base: 1500000 },
  { id: 'leaf-cleanup', name: 'Thu dọn lá & Vệ sinh mùa', rate: 5000, base: 300000 },
  { id: 'mulching-soil', name: 'Phủ mùn & Cải tạo dinh dưỡng đất', rate: 12000, base: 350000 },
  { id: 'irrigation-system', name: 'Hệ thống tưới tự động thông minh', rate: 25000, base: 800000 }
];

export default function CostCalculator({ selectedServiceId }) {
  const [serviceId, setServiceId] = useState(selectedServiceId || 'lawn-mowing');
  const [area, setArea] = useState(150);
  const [frequency, setFrequency] = useState('Lần đầu');
  
  // Customer details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  // Calculate live estimate
  const currentService = SERVICE_RATES.find(s => s.id === serviceId) || SERVICE_RATES[0];
  
  let freqDiscount = 1.0;
  if (frequency === 'Hàng tuần') freqDiscount = 0.85; // 15% off
  if (frequency === '2 tuần/lần') freqDiscount = 0.90; // 10% off
  if (frequency === 'Hàng tháng') freqDiscount = 0.95; // 5% off

  const estimatedCost = Math.round((currentService.base + (area * currentService.rate)) * freqDiscount);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ thi công!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          serviceId: currentService.id,
          serviceName: currentService.name,
          gardenArea: area,
          frequency,
          address,
          preferredDate,
          notes,
          estimatedCost
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg(`Yêu cầu báo giá #${data.quoteId} đã được ghi nhận thành công! Đội ngũ GreenLand sẽ liên hệ lại với bạn ngay.`);
        // Reset form
        setFullName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setNotes('');
      } else {
        setErrorMsg(data.message || 'Gửi báo giá thất bại, vui lòng thử lại.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Không thể kết nối đến máy chủ Backend API. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <section id="calculator" className="py-24 bg-[#081C15] relative overflow-hidden border-t border-b border-white/10">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20E070]/10 border border-[#20E070]/30 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Công Cụ Báo Giá Tức Thì</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Ước Tính Chi Phí <span className="text-gradient">Chăm Sóc Sân Vườn</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Kéo chọn diện tích sân vườn ($m^2$) và loại dịch vụ để nhận ước tính minh bạch ngay lập tức.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Estimator Controls */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-8 border border-white/15">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="w-5 h-5 text-[#20E070]" />
              <span>1. Chọn Dịch Vụ & Diện Tích</span>
            </h3>

            {/* Service Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Loại dịch vụ thực hiện:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_RATES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setServiceId(item.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      serviceId === item.id 
                        ? 'bg-[#20E070]/15 border-[#20E070] text-white shadow-lg shadow-emerald-500/10' 
                        : 'bg-[#07150E]/60 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <span>{item.name}</span>
                    {serviceId === item.id && <CheckCircle className="w-4 h-4 text-[#20E070] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Diện tích khuôn viên:
                </label>
                <div className="text-xl font-bold font-serif text-[#20E070] bg-[#07150E] px-4 py-1 rounded-lg border border-white/10">
                  {area} <span className="text-xs text-slate-400 font-sans">m²</span>
                </div>
              </div>
              <input 
                type="range" 
                min="20" 
                max="1500" 
                step="10"
                value={area} 
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                <span>20 m² (Sân nhỏ)</span>
                <span>500 m² (Biệt thự)</span>
                <span>1,500 m² (Resort/KĐT)</span>
              </div>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Tần suất chăm sóc:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Lần đầu', 'Hàng tuần', '2 tuần/lần', 'Hàng tháng'].map((freq) => (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                      frequency === freq
                        ? 'bg-[#20E070] text-[#07150E] border-[#20E070] shadow-md'
                        : 'bg-[#07150E]/60 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {freq}
                    {freq !== 'Lần đầu' && <span className="block text-[9px] opacity-80">Giảm 5-15%</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Display Box */}
            <div className="bg-gradient-to-br from-[#0D2B1D] to-[#07150E] p-6 rounded-2xl border border-[#20E070]/30 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Dịch vụ đã chọn:</span>
                <span className="font-semibold text-white">{currentService.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Đơn giá ước tính:</span>
                <span>{currentService.rate.toLocaleString('vi-VN')}đ / m²</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Ưu đãi tần suất:</span>
                <span className="text-[#20E070] font-semibold">
                  {frequency === 'Lần đầu' ? 'Áp dụng giá chuẩn' : `Giảm ${Math.round((1 - freqDiscount)*100)}%`}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Chi Phí Ước Tính Trọn Gói:</span>
                  <span className="text-xs text-slate-400 italic">* Đã bao gồm máy móc & nhân công</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#20E070]">
                  {estimatedCost.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-slate-300">VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Quote Form */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-6 border border-white/15">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Send className="w-5 h-5 text-[#20E070]" />
              <span>2. Gửi Yêu Cầu Báo Giá Chính Thức</span>
            </h3>

            {successMsg && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-sm flex items-start gap-3 animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-[#20E070] shrink-0 mt-0.5" />
                <div>{successMsg}</div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-500/20 border border-rose-500/50 p-4 rounded-xl text-rose-300 text-sm flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#20E070]" />
                    Họ và tên *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#20E070]" />
                    Số điện thoại *
                  </label>
                  <input 
                    type="tel" 
                    placeholder="0988 123 456" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#20E070]" />
                    Email (Không bắt buộc)
                  </label>
                  <input 
                    type="email" 
                    placeholder="khachhang@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#20E070]" />
                    Ngày khảo sát mong muốn
                  </label>
                  <input 
                    type="date" 
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#20E070]" />
                  Địa chỉ thi công sân vườn *
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Khu biệt thự Ecopark, Phụ Phụng, Hà Nội..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#20E070]" />
                  Ghi chú thêm yêu cầu đặc biệt
                </label>
                <textarea 
                  rows="3" 
                  placeholder="Cần cắt bớt cây cổ thụ, loại cỏ mong muốn, độ dốc sân..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-emerald py-4 justify-center font-bold text-[#07150E] text-base shadow-xl shadow-emerald-500/20"
              >
                {loading ? 'Đang Xử Lý Gửi Báo Giá...' : 'Gửi Yêu Cầu & Lưu Hệ Thống SQLite'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
