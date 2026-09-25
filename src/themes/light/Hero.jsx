import React from 'react';
import { ArrowRight, Check, PhoneCall, ShieldCheck } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { useLeadForm } from '../../site/forms';
import { Badge } from './ui';
import { useReveal } from './useReveal';

export default function Hero({ onOpenCalculator, onSelectService }) {
  const { settings, services } = useSite();
  const h = settings.hero;
  const { quickPhone, setQuickPhone, quickServiceId, setQuickServiceId, submitted, handleQuickRequest } = useLeadForm(onOpenCalculator);
  const heroRevealRef = useReveal();
  const formRevealRef = useReveal();

  const overlayOpacity = Math.max(0.4, (h.overlay_strength ?? 50) / 100);

  return (
    <div className="relative">
      {/* Fullscreen Hero Background Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-end text-white overflow-hidden bg-[#183B29]">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={h.background_image}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: h.background_position || 'center' }}
          />
          {/* Multi-stage gradient overlay for optimal readability (contrast >= 4.5:1) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B1B13]/95 via-[#0B1B13]/70 to-[#0B1B13]/30"
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B13]/85 via-transparent to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div ref={heroRevealRef} className="container relative z-10 pt-32 pb-24 lg:pb-36 space-y-8">
          <div className="max-w-4xl space-y-6">
            <Badge dark>{h.badge}</Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight text-white">
              {h.title_line1}{' '}
              <span className="font-serif italic font-normal text-[#E5A93B]">
                {h.title_highlight}
              </span>{' '}
              {h.title_line2}
            </h1>

            <p className="text-white/85 text-base sm:text-[17px] leading-[1.7] max-w-2xl">
              {h.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={onOpenCalculator} className="lt-btn lt-btn-amber">
                {h.cta_primary} <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#services" className="lt-btn lt-btn-ghost-white">
                {h.cta_secondary}
              </a>
            </div>

            {/* Value props */}
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {h.value_props.map((prop, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-white/90 font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#E5A93B] text-[#16241B] flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  {prop}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Bar inside Hero */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-2xl">
            {h.stats.map((s, idx) => (
              <div key={idx}>
                <div className="font-serif text-2xl sm:text-4xl font-bold text-[#E5A93B]">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80 leading-tight mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Quick Request Form */}
      <div className="container relative z-20 -mt-12 lg:-mt-20 mb-16 lg:mb-24">
        <div
          ref={formRevealRef}
          className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(24,59,41,0.12)] border border-[#E6E8E0] p-6 sm:p-8 grid lg:grid-cols-12 gap-6 items-center text-[#16241B]"
        >
          <div className="lg:col-span-4 flex items-start gap-4">
            <span className="w-12 h-12 rounded-full bg-[#183B29] text-[#E5A93B] flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241B] leading-tight">
                {h.form_title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6B60] mt-1">{h.form_subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleQuickRequest} className="lg:col-span-8 grid sm:grid-cols-3 gap-3.5 items-end">
            <div>
              <label className="lt-label">{h.form_service_label}</label>
              <select
                value={quickServiceId || services[0]?.id || ''}
                onChange={(e) => {
                  setQuickServiceId(e.target.value);
                  onSelectService(e.target.value);
                }}
                className="lt-input font-medium"
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.heroEmoji ? `${svc.heroEmoji} ${svc.heroLabel}` : svc.heroLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="lt-label">{h.form_phone_label}</label>
              <input
                type="tel"
                required
                placeholder={h.form_phone_placeholder}
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                className="lt-input"
              />
            </div>

            <button type="submit" className="lt-btn lt-btn-amber w-full py-3 font-bold text-sm">
              {submitted ? h.form_submitting : h.form_submit}
            </button>
          </form>

          <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6E8E0] text-xs text-[#5B6B60]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2E6A45]" />
              {h.trust_left}
            </span>
            <span className="font-bold text-[#2E6A45]">{h.trust_right}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
