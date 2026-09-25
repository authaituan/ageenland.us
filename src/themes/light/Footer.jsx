import React from 'react';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { Logo } from './ui';

export default function Footer() {
  const { settings, services } = useSite();
  const { brand, footer: t } = settings;

  return (
    <footer className="bg-[#12301F] text-white/75 pt-20 pb-10 border-t border-white/10">
      <div className="container space-y-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-5">
            <a href="#" className="inline-block focus:outline-none">
              <Logo brand={brand} dark />
            </a>
            <p className="text-sm leading-relaxed max-w-sm text-white/80 font-normal">
              {t.about}
            </p>
            <p className="text-xs font-semibold text-[#E5A93B]">
              {t.copyright}
            </p>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-lg font-extrabold tracking-tight">
              {t.services_title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-[#E5A93B] transition-colors duration-200">
                    {s.footerLabel}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-lg font-extrabold tracking-tight">
              {t.links_title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {t.links.map((l, idx) => (
                <li key={idx}>
                  <a href={l.href} className="hover:text-[#E5A93B] transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-lg font-extrabold tracking-tight">
              {t.support_title}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5A93B] shrink-0" />
                <span className="text-white font-bold">{t.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5A93B] shrink-0" />
                <span>{t.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5A93B] shrink-0 mt-0.5" />
                <span className="leading-snug">{t.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <span>{t.bottom_note}</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-bold text-white hover:text-[#E5A93B] transition-colors group"
          >
            {t.back_to_top}
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#E5A93B] group-hover:text-[#16241B] transition-colors">
              <ArrowUp className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
