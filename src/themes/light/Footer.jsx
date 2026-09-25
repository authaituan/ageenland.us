import React from 'react';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { Logo } from './ui';

export default function Footer() {
  const { settings, services } = useSite();
  const { brand, footer: t } = settings;

  return (
    <footer className="bg-[#183B29] text-white/70 pt-16 pb-8">
      <div className="container space-y-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <a href="#"><Logo brand={brand} dark /></a>
            <p className="text-sm leading-relaxed max-w-sm">{t.about}</p>
            <p className="text-xs text-[#DCEFB0]">{t.copyright}</p>
          </div>
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-lg">{t.services_title}</h4>
            <ul className="space-y-2 text-sm">
              {services.map((s) => <li key={s.id}><a href="#services" className="hover:text-white">{s.footerLabel}</a></li>)}
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-lg">{t.links_title}</h4>
            <ul className="space-y-2 text-sm">
              {t.links.map((l, idx) => <li key={idx}><a href={l.href} className="hover:text-white">{l.label}</a></li>)}
            </ul>
          </div>
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-lg">{t.support_title}</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#DCEFB0]" /><span className="text-white font-semibold">{t.phone}</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#DCEFB0]" />{t.email}</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#DCEFB0] shrink-0 mt-0.5" />{t.address}</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>{t.bottom_note}</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1.5 hover:text-white">
            {t.back_to_top} <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
