import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { fmt } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { useQuoteForm } from '../../site/forms';
import { SectionHeader } from './ui';

export default function Calculator({ selectedServiceId }) {
  const { settings, services, frequencyOptions } = useSite();
  const t = settings.calculator;
  const q = useQuoteForm(selectedServiceId);
  const money = (v) => formatMoney(v, settings.site);

  return (
    <section id="calculator" className="py-20 sm:py-28 bg-[#EDF1E6]">
      <div className="container space-y-12">
        <SectionHeader badge={t.badge} title={t.title} highlight={t.title_highlight} description={t.description} align="center" />

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Bước 1: ước tính */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 space-y-7">
            <h3 className="text-2xl text-[#16241B] flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#183B29] text-white text-sm font-sans flex items-center justify-center">1</span>
              {t.step1_title}
            </h3>

            <div>
              <span className="lt-label">{t.service_label}</span>
              <div className="grid sm:grid-cols-2 gap-2">
                {services.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => q.setServiceId(item.id)}
                    className={`px-4 py-3 rounded-xl border text-left text-sm transition-colors ${
                      q.serviceId === item.id ? 'bg-[#183B29] border-[#183B29] text-white' : 'bg-[#F7F6F1] border-[#E3E4DA] text-[#16241B] hover:border-[#2E6A45]'
                    }`}
                  >
                    {item.calcName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="lt-label mb-0">{t.area_label}</span>
                <span className="font-serif text-2xl text-[#183B29]">
                  {q.area.toLocaleString(settings.site.locale || 'en-US')} <span className="text-xs font-sans text-[#5B6B60]">{t.area_unit}</span>
                </span>
              </div>
              <input type="range" min={t.area_min} max={t.area_max} step={t.area_step} value={q.area} onChange={(e) => q.setArea(Number(e.target.value))} className="w-full cursor-pointer" />
              <div className="flex justify-between text-[11px] text-[#5B6B60] mt-2">
                <span>{t.area_hint_min}</span><span>{t.area_hint_mid}</span><span>{t.area_hint_max}</span>
              </div>
            </div>

            <div>
              <span className="lt-label">{t.frequency_label}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequencyOptions.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => q.setFrequencyId(f.id)}
                    className={`px-2 py-2.5 rounded-xl border text-xs font-semibold text-center transition-colors ${
                      q.currentFrequency.id === f.id ? 'bg-[#DCEFB0] border-[#2E6A45] text-[#183B29]' : 'bg-[#F7F6F1] border-[#E3E4DA] text-[#16241B] hover:border-[#2E6A45]'
                    }`}
                  >
                    {f.label}
                    {f.hint && <span className="block text-[10px] font-normal opacity-80">{f.hint}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#183B29] text-white p-6 space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-white/70">{t.summary_service}</span><span className="font-semibold">{q.currentService.calcName}</span></div>
              <div className="flex justify-between"><span className="text-white/70">{t.summary_rate}</span><span>{fmt(t.summary_rate_format, { rate: money(q.currentService.pricePerM2) })}</span></div>
              <div className="flex justify-between"><span className="text-white/70">{t.summary_discount}</span><span className="text-[#DCEFB0] font-semibold">{q.discountPct === 0 ? t.summary_standard : fmt(t.summary_discount_format, { pct: q.discountPct })}</span></div>
              <div className="pt-4 mt-2 border-t border-white/15 flex justify-between items-end gap-4">
                <div>
                  <span className="block text-xs text-white/70">{t.total_label}</span>
                  <span className="text-[11px] italic text-white/60">{t.total_note}</span>
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-[#DCEFB0] text-right">
                  {money(q.estimatedCost)}{t.currency && <span className="text-sm font-sans text-white/70"> {t.currency}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Bước 2: gửi yêu cầu */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-2xl text-[#16241B] flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#183B29] text-white text-sm font-sans flex items-center justify-center">2</span>
              {t.step2_title}
            </h3>
            {q.successMsg && (
              <div className="rounded-xl bg-[#DCEFB0] text-[#183B29] p-4 text-sm flex gap-3"><CheckCircle className="w-5 h-5 shrink-0" />{q.successMsg}</div>
            )}
            {q.errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-4 text-sm flex gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{q.errorMsg}</div>
            )}
            <form onSubmit={q.handleSubmitQuote} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="lt-label">{t.name_label}</label><input type="text" required placeholder={t.name_placeholder} value={q.fullName} onChange={(e) => q.setFullName(e.target.value)} className="lt-input" /></div>
                <div><label className="lt-label">{t.phone_label}</label><input type="tel" required placeholder={t.phone_placeholder} value={q.phone} onChange={(e) => q.setPhone(e.target.value)} className="lt-input" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="lt-label">{t.email_label}</label><input type="email" placeholder={t.email_placeholder} value={q.email} onChange={(e) => q.setEmail(e.target.value)} className="lt-input" /></div>
                <div><label className="lt-label">{t.date_label}</label><input type="date" value={q.preferredDate} onChange={(e) => q.setPreferredDate(e.target.value)} className="lt-input" /></div>
              </div>
              <div><label className="lt-label">{t.address_label}</label><input type="text" required placeholder={t.address_placeholder} value={q.address} onChange={(e) => q.setAddress(e.target.value)} className="lt-input" /></div>
              <div><label className="lt-label">{t.notes_label}</label><textarea rows="3" placeholder={t.notes_placeholder} value={q.notes} onChange={(e) => q.setNotes(e.target.value)} className="lt-input" /></div>
              <button type="submit" disabled={q.loading} className="lt-btn lt-btn-primary w-full py-4">{q.loading ? t.submitting : t.submit}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
