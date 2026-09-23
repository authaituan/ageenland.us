import React from 'react';
import { Leaf, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useSite } from '../site/SiteContext';

export default function Footer() {
  const { settings, services } = useSite();
  const { brand, footer: t } = settings;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05100B] text-slate-400 border-t border-white/10 pt-16 pb-8 relative">
      <div className="container space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[#07150E]">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {brand.name_part1}<span className="text-[#20E070]">{brand.name_part2}</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.about}
            </p>
            <div className="pt-2 text-xs text-[#20E070] font-semibold">
              {t.copyright}
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">{t.services_title}</h4>
            <ul className="space-y-2 text-xs">
              {services.map((svc) => (
                <li key={svc.id}><a href="#services" className="hover:text-[#20E070]">{svc.footerLabel}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">{t.links_title}</h4>
            <ul className="space-y-2 text-xs">
              {t.links.map((link, idx) => (
                <li key={idx}><a href={link.href} className="hover:text-[#20E070]">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">{t.support_title}</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#20E070]" />
                <span className="text-white font-bold">{t.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#20E070]" />
                <span>{t.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#20E070] shrink-0 mt-0.5" />
                <span>{t.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>{t.bottom_note}</span>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#20E070] transition-colors"
          >
            <span>{t.back_to_top}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
