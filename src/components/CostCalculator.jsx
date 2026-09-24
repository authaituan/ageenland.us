import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle, AlertCircle, Calendar, MapPin, Phone, User, Mail, FileText, Send, Sparkles } from 'lucide-react';
import { useSite } from '../site/SiteContext';
import { api, fmt } from '../lib/api';
import { formatMoney } from '../lib/format';

export default function CostCalculator({ selectedServiceId }) {
  const { settings, services, frequencyOptions } = useSite();
  const t = settings.calculator;
  const [serviceId, setServiceId] = useState(selectedServiceId || services[0]?.id);
  const [area, setArea] = useState(t.area_default);
  const [frequencyId, setFrequencyId] = useState(frequencyOptions[0]?.id);
  
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
  const currentService = services.find(s => s.id === serviceId) || services[0] || { id: '', calcName: '', pricePerM2: 0, basePrice: 0 };
  const currentFrequency = frequencyOptions.find(f => f.id === frequencyId) || frequencyOptions[0] || { id: null, label: '', discountPct: 0 };
  const discountPct = currentFrequency.discountPct || 0;

  // Ước tính hiển thị; giá chính thức do server tính lại khi lưu (cùng công thức)
  const estimatedCost = Math.round((currentService.basePrice + (area * currentService.pricePerM2)) * (100 - discountPct)) / 100;

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      setErrorMsg(t.error_required);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const data = await api('/quotes', {
        method: 'POST',
        body: {
          fullName,
          phone,
          email,
          serviceId: currentService.id,
          gardenArea: area,
          frequencyId: currentFrequency.id,
          frequency: currentFrequency.label,
          address,
          preferredDate,
          notes
        }
      });
      setLoading(false);

      if (data.success) {
        setSuccessMsg(fmt(t.success_message, { id: data.quoteId }));
        // Reset form
        setFullName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setNotes('');
      } else {
        setErrorMsg(data.message || t.error_failed);
      }
    } catch (err) {
      setLoading(false);
      // Lỗi nghiệp vụ từ server (400) có message; lỗi mạng thì báo không kết nối được
      setErrorMsg(err.status ? (err.message || t.error_failed) : t.error_network);
    }
  };

  return (
    <section id="calculator" className="py-24 bg-[#081C15] relative overflow-hidden border-t border-b border-white/10">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20E070]/10 border border-[#20E070]/30 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            {t.title} <span className="text-gradient">{t.title_highlight}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            {t.description}
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Estimator Controls */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-8 border border-white/15">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="w-5 h-5 text-[#20E070]" />
              <span>{t.step1_title}</span>
            </h3>

            {/* Service Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {t.service_label}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((item) => (
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
                    <span>{item.calcName}</span>
                    {serviceId === item.id && <CheckCircle className="w-4 h-4 text-[#20E070] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {t.area_label}
                </label>
                <div className="text-xl font-bold font-serif text-[#20E070] bg-[#07150E] px-4 py-1 rounded-lg border border-white/10">
                  {area.toLocaleString(settings.site.locale || 'en-US')} <span className="text-xs text-slate-400 font-sans">{t.area_unit}</span>
                </div>
              </div>
              <input 
                type="range" 
                min={t.area_min} 
                max={t.area_max} 
                step={t.area_step}
                value={area} 
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                <span>{t.area_hint_min}</span>
                <span>{t.area_hint_mid}</span>
                <span>{t.area_hint_max}</span>
              </div>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {t.frequency_label}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequencyOptions.map((freq) => (
                  <button
                    type="button"
                    key={freq.id}
                    onClick={() => setFrequencyId(freq.id)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                      currentFrequency.id === freq.id
                        ? 'bg-[#20E070] text-[#07150E] border-[#20E070] shadow-md'
                        : 'bg-[#07150E]/60 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {freq.label}
                    {freq.hint && <span className="block text-[9px] opacity-80">{freq.hint}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Display Box */}
            <div className="bg-gradient-to-br from-[#0D2B1D] to-[#07150E] p-6 rounded-2xl border border-[#20E070]/30 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>{t.summary_service}</span>
                <span className="font-semibold text-white">{currentService.calcName}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>{t.summary_rate}</span>
                <span>{fmt(t.summary_rate_format, { rate: formatMoney(currentService.pricePerM2, settings.site) })}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>{t.summary_discount}</span>
                <span className="text-[#20E070] font-semibold">
                  {discountPct === 0 ? t.summary_standard : fmt(t.summary_discount_format, { pct: discountPct })}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">{t.total_label}</span>
                  <span className="text-xs text-slate-400 italic">{t.total_note}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#20E070]">
                  {formatMoney(estimatedCost, settings.site)}{t.currency && <> <span className="text-sm font-sans font-normal text-slate-300">{t.currency}</span></>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Quote Form */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-6 border border-white/15">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Send className="w-5 h-5 text-[#20E070]" />
              <span>{t.step2_title}</span>
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
                    {t.name_label}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t.name_placeholder} 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#20E070]" />
                    {t.phone_label}
                  </label>
                  <input 
                    type="tel" 
                    placeholder={t.phone_placeholder} 
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
                    {t.email_label}
                  </label>
                  <input 
                    type="email" 
                    placeholder={t.email_placeholder} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#20E070]" />
                    {t.date_label}
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
                  {t.address_label}
                </label>
                <input 
                  type="text" 
                  placeholder={t.address_placeholder} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#20E070]" />
                  {t.notes_label}
                </label>
                <textarea 
                  rows="3" 
                  placeholder={t.notes_placeholder} 
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
                {loading ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
