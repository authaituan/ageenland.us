import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { SectionHeader } from './ui';
import { useReveal } from './useReveal';

export default function Portfolio() {
  const { settings, projects } = useSite();
  const t = settings.portfolio;
  const [pos, setPos] = useState(50);
  const headerRef = useReveal();
  const sliderRef = useReveal();

  const moveTo = (clientX, el) => {
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-white">
      <div className="container space-y-14">
        <div ref={headerRef}>
          <SectionHeader
            badge={t.badge}
            title={t.title}
            highlight={t.title_highlight}
            description={t.description}
          />
        </div>

        {/* Interactive Before / After Slider */}
        <div ref={sliderRef} className="space-y-4">
          <div
            className="relative h-[360px] sm:h-[540px] rounded-[24px] overflow-hidden cursor-ew-resize select-none shadow-2xl border border-[#E6E8E0]"
            onMouseMove={(e) => moveTo(e.clientX, e.currentTarget)}
            onTouchMove={(e) => moveTo(e.touches[0].clientX, e.currentTarget)}
          >
            {/* After Image (Background) */}
            <img
              src={t.after_image}
              alt={t.after_alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-5 right-5 bg-[#E5A93B] text-[#16241B] rounded-full px-4 py-1.5 text-xs font-extrabold shadow-lg">
              {t.after_badge}
            </span>

            {/* Before Image (Overlay clipped by width) */}
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img
                src={t.before_image}
                alt={t.before_alt}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%' }}
              />
              <span className="absolute top-5 left-5 bg-[#16241B] text-white rounded-full px-4 py-1.5 text-xs font-extrabold shadow-lg">
                {t.before_badge}
              </span>
            </div>

            {/* Handle Bar & Round Amber Knob */}
            <div className="absolute inset-y-0 w-1 bg-white shadow-2xl" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#E5A93B] text-[#16241B] shadow-2xl flex items-center justify-center border-2 border-white">
                <ArrowRightLeft className="w-5 h-5 stroke-[2.5]" />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 text-xs font-medium text-[#5B6B60] px-1">
            <span className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16241B]" />
                {t.legend_before}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E5A93B]" />
                {t.legend_after}
              </span>
            </span>
            <span className="italic">{t.hint}</span>
          </div>
        </div>

        {/* Featured Projects Grid ("Hồ sơ" card layout) */}
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          {projects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useReveal();

  return (
    <article
      ref={cardRef}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="group space-y-4 cursor-pointer"
    >
      <div className="aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F4F6F0] shadow-md border border-[#E6E8E0]">
        <img
          src={project.image}
          alt={project.imageAlt || ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div>
        <span className="text-xs font-extrabold tracking-wider text-[#2E6A45] uppercase block">
          {project.category}
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241B] mt-1 group-hover:text-[#2E6A45] transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-[#5B6B60] leading-relaxed mt-1.5">
          {project.description}
        </p>
      </div>
    </article>
  );
}
