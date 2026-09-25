import React from 'react';
import { ArrowRight, Check, PhoneCall, ShieldCheck } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { useLeadForm } from '../../site/forms';
import { Badge } from './ui';

export default function Hero({ onOpenCalculator, onSelectService }) {
  const { settings, services } = useSite();
  const h = settings.hero;
  const { quickPhone, setQuickPhone, quickServiceId, setQuickServiceId, submitted, handleQuickRequest } = useLeadForm(onOpenCalculator);

  return (
    <section className="pt-8 sm:pt-12 pb-16 sm:pb-24">
      <div className="container space-y-10 lg:space-y-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Chữ */}
          <div className="lg:col-span-6 space-y-6">
            <Badge>{h.badge}</Badge>
            <h1 className="text-[2.6rem] sm:text-6xl lg:text-[4.4rem] leading-[1.02] text-[#16241B]">
              {h.title_line1} <span className="text-[#2E6A45]">{h.title_highlight}</span> {h.title_line2}
            </h1>
            <p className="text-[#5B6B60] text-base sm:text-lg max-w-xl">{h.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={onOpenCalculator} className="lt-btn lt-btn-primary">
                {h.cta_primary} <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#services" className="lt-btn lt-btn-outline">{h.cta_secondary}</a>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-2">
              {h.value_props.map((prop, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-[#16241B]">
                  <span className="w-5 h-5 rounded-full bg-[#DCEFB0] text-[#183B29] flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></span>
                  {prop}
                </li>
              ))}
            </ul>
          </div>

          {/* Ảnh + số liệu */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] bg-[#EDF1E6]">
              <img
                src={h.background_image}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: h.background_position || 'center' }}
              />
            </div>
            <div className="absolute left-4 right-4 sm:left-auto sm:right-6 bottom-4 sm:bottom-6 bg-white rounded-2xl shadow-xl px-5 py-4 grid grid-cols-3 gap-4 sm:w-[380px]">
              {h.stats.map((s, idx) => (
                <div key={idx}>
                  <div className="font-serif text-2xl sm:text-3xl text-[#183B29]">{s.value}</div>
                  <div className="text-[11px] text-[#5B6B60] leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form đặt lịch nhanh */}
        <div className="bg-white rounded-3xl border border-[#E3E4DA] p-5 sm:p-7 grid lg:grid-cols-12 gap-5 lg:gap-8 items-end">
          <div className="lg:col-span-4 flex items-start gap-3">
            <span className="w-11 h-11 rounded-full bg-[#183B29] text-[#DCEFB0] flex items-center justify-center shrink-0"><PhoneCall className="w-5 h-5" /></span>
            <div>
              <h3 className="text-xl text-[#16241B] leading-tight">{h.form_title}</h3>
              <p className="text-xs text-[#5B6B60] mt-1">{h.form_subtitle}</p>
            </div>
          </div>
          <form onSubmit={handleQuickRequest} className="lg:col-span-8 grid sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="lt-label">{h.form_service_label}</label>
              <select
                value={quickServiceId || services[0]?.id || ''}
                onChange={(e) => { setQuickServiceId(e.target.value); onSelectService(e.target.value); }}
                className="lt-input"
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>{svc.heroEmoji ? `${svc.heroEmoji} ${svc.heroLabel}` : svc.heroLabel}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lt-label">{h.form_phone_label}</label>
              <input type="tel" required placeholder={h.form_phone_placeholder} value={quickPhone} onChange={(e) => setQuickPhone(e.target.value)} className="lt-input" />
            </div>
            <button type="submit" className="lt-btn lt-btn-primary w-full">{submitted ? h.form_submitting : h.form_submit}</button>
          </form>
          <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#E3E4DA] text-xs text-[#5B6B60]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#2E6A45]" />{h.trust_left}</span>
            <span className="font-semibold text-[#2E6A45]">{h.trust_right}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
