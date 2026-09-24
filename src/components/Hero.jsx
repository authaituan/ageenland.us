import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';
import { useSite } from '../site/SiteContext';
import { api } from '../lib/api';

export default function Hero({ onOpenCalculator, onSelectService }) {
  const { settings, services } = useSite();
  const h = settings.hero;
  const [quickPhone, setQuickPhone] = useState('');
  const [quickServiceId, setQuickServiceId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickRequest = (e) => {
    e.preventDefault();
    if (!quickPhone) return;
    setSubmitted(true);
    // Lưu lại số điện thoại khách đăng ký (trước đây bị bỏ qua)
    const svc = services.find((s) => s.id === quickServiceId) || services[0];
    api('/leads', { method: 'POST', body: { phone: quickPhone, serviceLabel: svc ? svc.heroLabel : '' } })
      .catch((err) => console.warn('Could not save quick request:', err.message));
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
        style={{ backgroundImage: `url('${h.background_image}')` }}
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
                {h.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              {h.title_line1} <br />
              <span className="text-gradient">{h.title_highlight}</span> {h.title_line2}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {h.description}
            </p>

            {/* Value Props Pills */}
            <div className="flex flex-wrap gap-4 pt-2">
              {h.value_props.map((prop, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#20E070] shrink-0" />
                  <span>{prop}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button 
                onClick={onOpenCalculator}
                className="btn-emerald text-sm sm:text-base py-3.5 px-8 shadow-xl shadow-emerald-500/25"
              >
                <span>{h.cta_primary}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a 
                href="#services" 
                className="btn-outline-glass text-sm sm:text-base py-3.5 px-7"
              >
                <span>{h.cta_secondary}</span>
              </a>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-xl">
              {h.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-xl sm:text-3xl font-bold font-serif text-[#20E070]">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
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
                  <h3 className="text-lg sm:text-xl font-bold text-white font-serif leading-tight">{h.form_title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{h.form_subtitle}</p>
                </div>
              </div>

              <form onSubmit={handleQuickRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    {h.form_service_label}
                  </label>
                  <select 
                    value={quickServiceId || services[0]?.id || ''}
                    onChange={(e) => { setQuickServiceId(e.target.value); onSelectService(e.target.value); }}
                    className="w-full bg-[#07150E] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none shadow-inner"
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>{svc.heroEmoji ? `${svc.heroEmoji} ${svc.heroLabel}` : svc.heroLabel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    {h.form_phone_label}
                  </label>
                  <input 
                    type="tel"
                    placeholder={h.form_phone_placeholder}
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
                  {submitted ? h.form_submitting : h.form_submit}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#20E070]" />
                  {h.trust_left}
                </span>
                <span className="text-[#20E070] font-semibold">{h.trust_right}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
