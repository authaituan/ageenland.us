import React from 'react';
import { useSite } from '../../site/SiteContext';
import { Badge } from './ui';
import { useReveal } from './useReveal';

export default function About() {
  const { settings } = useSite();
  const t = settings.about;
  const darkBandRef = useReveal();
  const highlightsRef = useReveal();

  return (
    <section id="about" className="py-12 lg:py-20 bg-white">
      {/* Dark Green Band (#183B29) with Overlapping Image on Desktop */}
      <div className="bg-[#183B29] text-white py-16 lg:py-28 relative overflow-visible shadow-xl">
        <div ref={darkBandRef} className="container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Overlapping Image (desktop extends top/bottom) */}
            <div className="lg:col-span-5 relative z-10">
              <div className="rounded-[24px] overflow-hidden shadow-2xl border-4 border-white/10 lg:-my-24 bg-[#0B1B13]">
                <img
                  src={t.image}
                  alt={t.image_alt || ''}
                  className="w-full h-full max-h-[540px] object-cover"
                />
              </div>
            </div>

            {/* Content Right Column */}
            <div className="lg:col-span-7 space-y-6">
              <Badge dark>{t.badge}</Badge>

              <p className="text-white text-xl sm:text-2xl leading-[1.5]">
                {t.paragraph2}
              </p>

              {/* Stats */}
              {t.stats?.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
                  {t.stats.map((s, idx) => (
                    <div key={idx}>
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-[#E5A93B]">
                        {s.value}
                      </div>
                      <div className="text-xs sm:text-sm text-white/75 leading-tight mt-1">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Grid below Dark Band */}
      {t.highlights?.length > 0 && (
        <div className="container pt-16 lg:pt-24">
          <div ref={highlightsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] p-6 shadow-[0_12px_40px_rgba(24,59,41,0.06)] border border-[#E6E8E0] flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200"
              >
                <span className="w-11 h-11 rounded-full bg-[#E5A93B] text-[#16241B] font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-[#16241B] text-base leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
