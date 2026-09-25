import React from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { useContactForm } from '../../site/forms';
import { SectionHeader } from './ui';
import { useReveal } from './useReveal';

export default function Contact() {
  const { settings } = useSite();
  const t = settings.contact;
  const c = useContactForm();
  const headerRef = useReveal();
  const infoRef = useReveal();
  const formRef = useReveal();

  const rows = [
    [MapPin, t.address_label, <span key="v">{t.address}</span>],
    [
      Phone,
      t.hotline_label,
      <a key="v" href={`tel:${t.hotline_tel}`} className="font-bold text-[#E5A93B] hover:underline">
        {t.hotline_text}
      </a>,
    ],
    [Mail, t.email_label, <span key="v">{t.email}</span>],
    [Clock, t.hours_label, <span key="v">{t.hours}</span>],
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="container space-y-14">
        <div ref={headerRef}>
          <SectionHeader
            badge={t.badge}
            title={t.title}
            highlight={t.title_highlight}
            description={t.description}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Info Block (Dark Green Background #183B29) */}
          <div
            ref={infoRef}
            className="lg:col-span-5 rounded-[24px] bg-[#183B29] text-white p-8 sm:p-10 space-y-8 shadow-xl relative overflow-hidden"
          >
            <h3 className="text-2xl font-extrabold text-white">{t.office_title}</h3>

            <ul className="space-y-6 text-sm">
              {rows.map(([Icon, label, value], idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="w-11 h-11 rounded-full bg-white/10 text-[#E5A93B] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="text-white/80 leading-relaxed pt-0.5">
                    <strong className="block text-white font-bold text-base mb-0.5">
                      {label}
                    </strong>
                    {value}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Block (Light Background #F4F6F0) */}
          <div
            ref={formRef}
            className="lg:col-span-7 rounded-[24px] bg-[#F4F6F0] border border-[#E6E8E0] p-8 sm:p-10 space-y-6 shadow-sm"
          >
            <h3 className="text-2xl font-extrabold text-[#16241B]">{t.form_title}</h3>

            {c.success && (
              <div className="rounded-xl bg-[#183B29] text-[#E5A93B] p-4 text-sm font-medium flex gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#E5A93B]" />
                {c.success}
              </div>
            )}
            {c.error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-4 text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {c.error}
              </div>
            )}

            {/* Preserved exact field order: Name -> Phone -> Email -> Message */}
            <form onSubmit={c.handleSendContact} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="lt-label">{t.name_label}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.name_placeholder}
                    value={c.name}
                    onChange={(e) => c.setName(e.target.value)}
                    className="lt-input bg-white"
                  />
                </div>
                <div>
                  <label className="lt-label">{t.phone_label}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phone_placeholder}
                    value={c.phone}
                    onChange={(e) => c.setPhone(e.target.value)}
                    className="lt-input bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="lt-label">{t.email_field_label}</label>
                <input
                  type="email"
                  placeholder={t.email_placeholder}
                  value={c.email}
                  onChange={(e) => c.setEmail(e.target.value)}
                  className="lt-input bg-white"
                />
              </div>

              <div>
                <label className="lt-label">{t.message_label}</label>
                <textarea
                  rows="4"
                  required
                  placeholder={t.message_placeholder}
                  value={c.message}
                  onChange={(e) => c.setMessage(e.target.value)}
                  className="lt-input bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={c.loading}
                className="lt-btn lt-btn-amber w-full sm:w-auto font-bold py-3.5 px-8 shadow-md"
              >
                {c.loading ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
