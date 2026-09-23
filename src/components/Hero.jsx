import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';

export default function Hero({ onOpenCalculator, onSelectService }) {
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickRequest = (e) => {
    e.preventDefault();
    if (!quickPhone) return;
    setSubmitted(true);
    setTimeout(() => {
      onOpenCalculator();
      setSubmitted(false);
    }, 1000);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[#07150E]">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity"
        style={{ backgroundImage: `url('/images/hero.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150E] via-[#081C15]/95 to-[#07150E]/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07150E]/50 to-[#07150E]" />

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#20E070]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 w-full max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#20E070]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-300">
                Dịch Vụ Cảnh Quan & Chăm Sóc Sân Vườn Cao Cấp
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Kiến Tạo Không Gian <br />
              <span className="text-gradient">Xanh Sang Trọng</span> & Đẳng Cấp
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              GreenLand mang đến giải pháp chăm sóc thảm cỏ, trồng cây nghệ thuật và thiết kế cảnh quan trọn gói. Đội ngũ kỹ sư & nghệ nhân kinh nghiệm giúp nâng tầm không gian sống của bạn.
            </p>

            {/* Value Props Pills */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#20E070] shrink-0" />
                <span>Thi công chuẩn kỹ thuật</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#20E070] shrink-0" />
                <span>Báo giá tự động 60s</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#20E070] shrink-0" />
                <span>Bảo hành cây & thảm cỏ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button 
                onClick={onOpenCalculator}
                className="btn-emerald text-sm sm:text-base py-3.5 px-8 shadow-xl shadow-emerald-500/25"
              >
                <span>Ước Tính Chi Phí Ngay</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a 
                href="#services" 
                className="btn-outline-glass text-sm sm:text-base py-3.5 px-7"
              >
                <span>Xem Các Dịch Vụ</span>
              </a>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-xl">
              <div>
                <div className="text-xl sm:text-3xl font-bold font-serif text-[#20E070]">45,000+</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">m² Cảnh quan đã thi công</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold font-serif text-[#20E070]">99.4%</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Khách hàng hài lòng</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold font-serif text-[#20E070]">15 Phút</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Phản hồi khảo sát tận nơi</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Quote Card */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border border-emerald-500/30 shadow-2xl rounded-2xl bg-[#0D2B1D]/90 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-[#20E070] shrink-0 border border-emerald-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-serif leading-tight">Đăng Ký Khảo Sát Miễn Phí</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Kỹ sư cảnh quan tới đo đạc & tư vấn tại nhà</p>
                </div>
              </div>

              <form onSubmit={handleQuickRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Dịch vụ bạn quan tâm
                  </label>
                  <select 
                    onChange={(e) => onSelectService(e.target.value)}
                    className="w-full bg-[#07150E] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none shadow-inner"
                  >
                    <option value="lawn-mowing">🌿 Cắt cỏ & Bảo dưỡng thảm cỏ</option>
                    <option value="tree-planting">🌳 Trồng cây & Cắt tỉa tạo hình</option>
                    <option value="landscape-design">✨ Thiết kế & Xử lý sân vườn trọn gói</option>
                    <option value="leaf-cleanup">🧹 Thu dọn lá & Vệ sinh mùa</option>
                    <option value="mulching-soil">🌱 Phủ mùn & Cải tạo đất</option>
                    <option value="irrigation-system">💧 Hệ thống tưới tự động thông minh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Số điện thoại nhận tư vấn
                  </label>
                  <input 
                    type="tel"
                    placeholder="Ví dụ: 0988 123 456"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    required
                    className="w-full bg-[#07150E] border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-400 focus:border-[#20E070] focus:outline-none shadow-inner"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-emerald py-3.5 px-4 justify-center font-bold text-[#07150E] text-sm mt-3 shadow-lg shadow-emerald-500/25"
                >
                  {submitted ? 'Đang Chuyển Đến Công Cụ Báo Giá...' : 'Gửi Yêu Cầu & Tính Giá Ngay'}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#20E070]" />
                  Bảo mật thông tin 100%
                </span>
                <span className="text-[#20E070] font-semibold">Tư vấn 24/7</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
