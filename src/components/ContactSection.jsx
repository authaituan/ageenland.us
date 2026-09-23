import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../site/SiteContext';
import { api } from '../lib/api';

export default function ContactSection() {
  const { settings } = useSite();
  const t = settings.contact;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSendContact = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setError(t.error_required);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await api('/contact', { method: 'POST', body: { name, phone, email, message } });
      setLoading(false);

      if (data.success) {
        setSuccess(data.message);
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.status ? err.message : t.error_network);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#07150E] relative overflow-hidden">
      <div className="container relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            {t.badge}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            {t.title} <span className="text-gradient">{t.title_highlight}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            {t.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/10">
              <h3 className="text-xl font-bold font-serif text-white">{t.office_title}</h3>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#20E070] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">{t.address_label}</strong>
                    <span>{t.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#20E070] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">{t.hotline_label}</strong>
                    <a href={`tel:${t.hotline_tel}`} className="text-[#20E070] font-bold text-base hover:underline">
                      {t.hotline_text}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#20E070] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">{t.email_label}</strong>
                    <span>{t.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#20E070] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">{t.hours_label}</strong>
                    <span>{t.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-6 border border-white/10">
            <h3 className="text-xl font-bold font-serif text-white">{t.form_title}</h3>

            {success && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#20E070]" />
                <div>{success}</div>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/20 border border-rose-500/50 p-4 rounded-xl text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSendContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{t.name_label}</label>
                  <input 
                    type="text" 
                    placeholder={t.name_placeholder} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{t.phone_label}</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{t.email_field_label}</label>
                <input 
                  type="email" 
                  placeholder={t.email_placeholder} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{t.message_label}</label>
                <textarea 
                  rows="4" 
                  placeholder={t.message_placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full bg-[#07150E] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#20E070] focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-emerald py-3.5 px-8 w-full justify-center text-base font-bold text-[#07150E]"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? t.submitting : t.submit}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
