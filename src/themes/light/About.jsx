import React from 'react';
import { useSite } from '../../site/SiteContext';
import { Badge } from './ui';

export default function About() {
  const { settings } = useSite();
  const t = settings.about;

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="container space-y-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-[2rem] overflow-hidden bg-[#EDF1E6]">
            <img src={t.image} alt={t.image_alt} className="w-full h-full max-h-[560px] object-cover" />
          </div>
          <div className="space-y-6">
            <Badge>{t.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.1] text-[#16241B]">
              {t.title} <span className="text-[#2E6A45]">{t.title_highlight}</span>
            </h2>
            <p className="text-[#5B6B60] text-base sm:text-lg">{t.paragraph1}</p>
            <p className="text-[#5B6B60] text-base sm:text-lg">{t.paragraph2}</p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E3E4DA]">
              {t.stats?.map((s, idx) => (
                <div key={idx}>
                  <div className="font-serif text-3xl sm:text-4xl text-[#183B29]">{s.value}</div>
                  <div className="text-xs text-[#5B6B60] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Điểm nổi bật, đánh số 01, 02… */}
        {t.highlights?.length > 0 && (
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E3E4DA] rounded-3xl overflow-hidden border border-[#E3E4DA]">
            {t.highlights.map((item, idx) => (
              <li key={idx} className="bg-[#F7F6F1] p-6 sm:p-8 flex gap-4">
                <span className="font-serif text-3xl text-[#2E6A45] leading-none">{String(idx + 1).padStart(2, '0')}</span>
                <span className="text-[#16241B] text-base pt-1">{item}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
