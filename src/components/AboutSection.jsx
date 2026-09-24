import React from 'react';
import { Check } from 'lucide-react';
import { useSite } from '../site/SiteContext';

export default function AboutSection() {
  const { settings } = useSite();
  const t = settings.about;

  return (
    <section id="about" className="py-24 bg-[#07150E] relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Ảnh giới thiệu */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl">
          <img
            src={t.image}
            alt={t.image_alt}
            className="w-full h-full max-h-[480px] object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            {t.badge}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            {t.title} <span className="text-gradient">{t.title_highlight}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">{t.paragraph1}</p>
          <p className="text-slate-300 text-base sm:text-lg">{t.paragraph2}</p>

          <ul className="space-y-2.5">
            {t.highlights?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check className="w-4 h-4 text-[#20E070] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {t.stats?.map((s, idx) => (
              <div key={idx}>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#20E070]">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
