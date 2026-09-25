import React from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { useContactForm } from '../../site/forms';
import { SectionHeader } from './ui';

export default function Contact() {
  const { settings } = useSite();
  const t = settings.contact;
  const c = useContactForm();

  const rows = [
    [MapPin, t.address_label, <span key="v">{t.address}</span>],
    [Phone, t.hotline_label, <a key="v" href={`tel:${t.hotline_tel}`} className="font-semibold text-[#DCEFB0] hover:underline">{t.hotline_text}</a>],
    [Mail, t.email_label, <span key="v">{t.email}</span>],
    [Clock, t.hours_label, <span key="v">{t.hours}</span>],
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="container space-y-12">
        <SectionHeader badge={t.badge} title={t.title} highlight={t.title_highlight} description={t.description} />
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-3xl bg-[#183B29] text-white p-7 sm:p-9 space-y-7">
            <h3 className="text-2xl">{t.office_title}</h3>
            <ul className="space-y-5 text-sm">
              {rows.map(([Icon, label, value], idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-white/10 text-[#DCEFB0] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                  <span className="text-white/80">
                    <strong className="block text-white font-semibold">{label}</strong>
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[#F7F6F1] border border-[#E3E4DA] p-7 sm:p-9 space-y-6">
            <h3 className="text-2xl text-[#16241B]">{t.form_title}</h3>
            {c.success && <div className="rounded-xl bg-[#DCEFB0] text-[#183B29] p-4 text-sm flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />{c.success}</div>}
            {c.error && <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-4 text-sm flex gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{c.error}</div>}
            <form onSubmit={c.handleSendContact} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="lt-label">{t.name_label}</label><input type="text" required placeholder={t.name_placeholder} value={c.name} onChange={(e) => c.setName(e.target.value)} className="lt-input bg-white" /></div>
                <div><label className="lt-label">{t.phone_label}</label><input type="tel" required placeholder={t.phone_placeholder} value={c.phone} onChange={(e) => c.setPhone(e.target.value)} className="lt-input bg-white" /></div>
              </div>
              <div><label className="lt-label">{t.email_field_label}</label><input type="email" placeholder={t.email_placeholder} value={c.email} onChange={(e) => c.setEmail(e.target.value)} className="lt-input bg-white" /></div>
              <div><label className="lt-label">{t.message_label}</label><textarea rows="4" required placeholder={t.message_placeholder} value={c.message} onChange={(e) => c.setMessage(e.target.value)} className="lt-input bg-white" /></div>
              <button type="submit" disabled={c.loading} className="lt-btn lt-btn-primary w-full sm:w-auto">{c.loading ? t.submitting : t.submit}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
