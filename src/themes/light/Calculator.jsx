import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { fmt } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { useQuoteForm } from '../../site/forms';
import { SectionHeader } from './ui';
import { useReveal } from './useReveal';

export default function Calculator({ selectedServiceId }) {
  const { settings, services, frequencyOptions } = useSite();
  const t = settings.calculator;
  const q = useQuoteForm(selectedServiceId);
  const money = (v) => formatMoney(v, settings.site);
  const step1Ref = useReveal();
  const step2Ref = useReveal();

  return (
    <section id="calculator" className="py-24 lg:py-32 bg-[#F4F6F0]">
      <div className="container space-y-12">
        <SectionHeader
          badge={t.badge}
          title={t.title}
          highlight={t.title_highlight}
          description={t.description}
          align="center"
        />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Step 1: Estimation Card */}
          <div
            ref={step1Ref}
            className="lg:col-span-6 bg-white rounded-[24px] shadow-[0_12px_40px_rgba(24,59,41,0.08)] border border-[#E6E8E0] p-6 sm:p-8 space-y-7"
          >
            <h3 className="text-2xl font-extrabold text-[#16241B] flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#183B29] text-[#E5A93B] text-sm font-bold flex items-center justify-center shadow-md">
                1
              </span>
              {t.step1_title}
            </h3>

            {/* Service selector */}
            <div>
              <span className="lt-label">{t.service_label}</span>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {services.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => q.setServiceId(item.id)}
                    className={`px-4 py-3 rounded-[14px] border text-left text-sm font-semibold transition-all duration-200 ${
                      q.serviceId === item.id
                        ? 'bg-[#183B29] border-[#183B29] text-white shadow-md'
                        : 'bg-[#F4F6F0] border-[#E6E8E0] text-[#16241B] hover:border-[#2E6A45]'
                    }`}
                  >
                    {item.calcName}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="lt-label mb-0">{t.area_label}</span>
                <span className="font-serif text-3xl font-bold text-[#183B29]">
                  {q.area.toLocaleString(settings.site.locale || 'en-US')}{' '}
                  <span className="text-xs font-sans text-[#5B6B60] font-normal">{t.area_unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={t.area_min}
                max={t.area_max}
                step={t.area_step}
                value={q.area}
                onChange={(e) => q.setArea(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5B6B60] font-medium mt-2">
                <span>{t.area_hint_min}</span>
                <span>{t.area_hint_mid}</span>
                <span>{t.area_hint_max}</span>
              </div>
            </div>

            {/* Frequency selection */}
            <div>
              <span className="lt-label">{t.frequency_label}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequencyOptions.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => q.setFrequencyId(f.id)}
                    className={`px-2 py-3 rounded-[14px] border text-xs font-bold text-center transition-all duration-200 ${
                      q.currentFrequency.id === f.id
                        ? 'bg-[#183B29] border-[#183B29] text-white shadow-md'
                        : 'bg-[#F4F6F0] border-[#E6E8E0] text-[#16241B] hover:border-[#2E6A45]'
                    }`}
                  >
                    {f.label}
                    {f.hint && (
                      <span className={`block text-[10px] font-normal mt-0.5 ${q.currentFrequency.id === f.id ? 'text-[#E5A93B]' : 'text-[#5B6B60]'}`}>
                        {f.hint}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Cost Box */}
            <div className="rounded-[20px] bg-[#183B29] text-white p-6 sm:p-8 space-y-3 shadow-xl">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">{t.summary_service}</span>
                <span className="font-semibold text-white">{q.currentService.calcName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">{t.summary_rate}</span>
                <span>{fmt(t.summary_rate_format, { rate: money(q.currentService.pricePerM2) })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">{t.summary_discount}</span>
                <span className="text-[#E5A93B] font-bold">
                  {q.discountPct === 0 ? t.summary_standard : fmt(t.summary_discount_format, { pct: q.discountPct })}
                </span>
              </div>

              <div className="pt-4 mt-3 border-t border-white/15 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <span className="block text-xs font-medium text-white/70">{t.total_label}</span>
                  <span className="text-[11px] italic text-white/60">{t.total_note}</span>
                </div>
                <div className="font-serif text-3xl sm:text-5xl font-bold text-[#E5A93B] text-right">
                  {money(q.estimatedCost)}
                  {t.currency && <span className="text-sm font-sans text-white/80 font-normal"> {t.currency}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Request Form Card */}
          <div
            ref={step2Ref}
            className="lg:col-span-6 bg-white rounded-[24px] shadow-[0_12px_40px_rgba(24,59,41,0.08)] border border-[#E6E8E0] p-6 sm:p-8 space-y-6"
          >
            <h3 className="text-2xl font-extrabold text-[#16241B] flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#183B29] text-[#E5A93B] text-sm font-bold flex items-center justify-center shadow-md">
                2
              </span>
              {t.step2_title}
            </h3>

            {q.successMsg && (
              <div className="rounded-xl bg-[#183B29] text-[#E5A93B] p-4 text-sm font-medium flex gap-3 shadow-sm">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#E5A93B]" />
                {q.successMsg}
              </div>
            )}
            {q.errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-4 text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {q.errorMsg}
              </div>
            )}

            <form onSubmit={q.handleSubmitQuote} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="lt-label">{t.name_label}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.name_placeholder}
                    value={q.fullName}
                    onChange={(e) => q.setFullName(e.target.value)}
                    className="lt-input"
                  />
                </div>
                <div>
                  <label className="lt-label">{t.phone_label}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phone_placeholder}
                    value={q.phone}
                    onChange={(e) => q.setPhone(e.target.value)}
                    className="lt-input"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="lt-label">{t.email_label}</label>
                  <input
                    type="email"
                    placeholder={t.email_placeholder}
                    value={q.email}
                    onChange={(e) => q.setEmail(e.target.value)}
                    className="lt-input"
                  />
                </div>
                <div>
                  <label className="lt-label">{t.date_label}</label>
                  <input
                    type="date"
                    value={q.preferredDate}
                    onChange={(e) => q.setPreferredDate(e.target.value)}
                    className="lt-input"
                  />
                </div>
              </div>

              <div>
                <label className="lt-label">{t.address_label}</label>
                <input
                  type="text"
                  required
                  placeholder={t.address_placeholder}
                  value={q.address}
                  onChange={(e) => q.setAddress(e.target.value)}
                  className="lt-input"
                />
              </div>

              <div>
                <label className="lt-label">{t.notes_label}</label>
                <textarea
                  rows="3"
                  placeholder={t.notes_placeholder}
                  value={q.notes}
                  onChange={(e) => q.setNotes(e.target.value)}
                  className="lt-input"
                />
              </div>

              <button
                type="submit"
                disabled={q.loading}
                className="lt-btn lt-btn-amber w-full py-4 text-base font-bold shadow-md"
              >
                {q.loading ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
