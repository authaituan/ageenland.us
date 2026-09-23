import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useSite } from '../site/SiteContext';

export default function Testimonials() {
  const { settings, testimonials } = useSite();
  const t = settings.testimonials_section;

  return (
    <section id="testimonials" className="py-24 bg-[#081C15] relative overflow-hidden">
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

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="glass-panel p-8 space-y-6 relative rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-10 h-10 text-[#20E070]/30" />
                <div className="flex gap-1">
                  {[...Array(Math.max(0, Math.min(5, item.stars || 0)))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#20E070]" />
                <div>
                  <h4 className="font-bold text-white text-sm font-serif">{item.name}</h4>
                  <span className="text-xs text-emerald-400 block">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
