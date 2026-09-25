import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { SectionHeader } from './ui';

export default function Portfolio() {
  const { settings, projects } = useSite();
  const t = settings.portfolio;
  const [pos, setPos] = useState(50);

  const moveTo = (clientX, el) => {
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-white">
      <div className="container space-y-12">
        <SectionHeader badge={t.badge} title={t.title} highlight={t.title_highlight} description={t.description} />

        {/* Trước / sau */}
        <div>
          <div
            className="relative h-[340px] sm:h-[520px] rounded-[2rem] overflow-hidden cursor-ew-resize select-none"
            onMouseMove={(e) => moveTo(e.clientX, e.currentTarget)}
            onTouchMove={(e) => moveTo(e.touches[0].clientX, e.currentTarget)}
          >
            <img src={t.after_image} alt={t.after_alt} className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute top-4 right-4 bg-white rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#183B29]">{t.after_badge}</span>
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img src={t.before_image} alt={t.before_alt} className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} />
              <span className="absolute top-4 left-4 bg-[#16241B] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold">{t.before_badge}</span>
            </div>
            <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-[#183B29] shadow-lg flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5" />
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 mt-4 text-xs text-[#5B6B60]">
            <span className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16241B]" />{t.legend_before}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2E6A45]" />{t.legend_after}</span>
            </span>
            <span className="italic">{t.hint}</span>
          </div>
        </div>

        {/* Dự án tiêu biểu */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id} className="group space-y-4">
              <div className="h-64 rounded-3xl overflow-hidden bg-[#EDF1E6]">
                <img src={p.image} alt={p.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#2E6A45]">{p.category}</span>
                <h3 className="text-2xl text-[#16241B] mt-1">{p.title}</h3>
                <p className="text-sm text-[#5B6B60] mt-2">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
