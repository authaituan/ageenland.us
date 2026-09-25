import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useSite } from '../../site/SiteContext';

export default function Portfolio() {
  const { settings, projects } = useSite();
  const t = settings.portfolio;
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientXRat) => {
    if (clientXRat < 0) clientXRat = 0;
    if (clientXRat > 100) clientXRat = 100;
    setSliderPosition(clientXRat);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    handleMove((x / rect.width) * 100);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    handleMove((x / rect.width) * 100);
  };

  return (
    <section id="portfolio" className="py-24 bg-[#07150E] relative overflow-hidden">
      <div className="container relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            {t.badge}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            {t.title} <span className="text-gradient">{t.title_highlight}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            {t.description}
          </p>
        </div>

        {/* Interactive Before/After Comparison Slider */}
        <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-6 border border-emerald-500/30 shadow-2xl rounded-3xl">
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>{t.legend_before}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#20E070]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20E070] inline-block" />
              <span>{t.legend_after}</span>
            </div>
          </div>

          {/* Slider Container */}
          <div 
            className="relative h-[360px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/20"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full background) */}
            <img 
              src={t.after_image} 
              alt={t.after_alt} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#081C15]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#20E070] border border-[#20E070]/40">
              {t.after_badge}
            </div>

            {/* Before Image (Clipped overlay) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#20E070]"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={t.before_image} 
                alt={t.before_alt} 
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200 border border-white/20">
                {t.before_badge}
              </div>
            </div>

            {/* Slider Handle Divider */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#20E070] shadow-[0_0_15px_#20E070]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#20E070] text-[#07150E] flex items-center justify-center shadow-xl border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4 italic">
            {t.hint}
          </p>
        </div>

        {/* Featured Projects Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel p-6 space-y-4 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all">
              <div className="h-48 rounded-xl overflow-hidden">
                <img src={project.image} alt={project.imageAlt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#20E070] uppercase tracking-wider">{project.category}</span>
                <h3 className="text-lg font-bold font-serif text-white">{project.title}</h3>
                <p className="text-xs text-slate-300">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
