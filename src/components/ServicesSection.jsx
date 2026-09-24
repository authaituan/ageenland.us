import React from 'react';
import { Scissors, Trees, Sparkles, Wind, Shovel, Droplets, ArrowRight, Check, Calculator } from 'lucide-react';
import { useSite } from '../site/SiteContext';
import { fmt } from '../lib/api';
import { formatMoney } from '../lib/format';

const ICON_MAP = {
  Scissors: Scissors,
  Trees: Trees,
  Sparkles: Sparkles,
  Wind: Wind,
  Shovel: Shovel,
  Droplets: Droplets
};

export default function ServicesSection({ onSelectServiceForCalculator }) {
  const { settings, services } = useSite();
  const t = settings.services_section;

  return (
    <section id="services" className="py-24 bg-[#07150E] relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Scissors;

            return (
              <div 
                key={item.id} 
                className="glass-panel group relative rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B1D] via-[#0D2B1D]/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-[#081C15]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#20E070] shadow-lg">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="absolute bottom-3 right-4 bg-[#081C15]/90 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-semibold text-[#20E070]">
                      {fmt(t.price_format, { price: formatMoney(item.pricePerM2, settings.site) })}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                        {item.subtitle}
                      </span>
                      <h3 className="text-xl font-bold font-serif text-white mt-1 group-hover:text-[#20E070] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {item.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#20E070] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  <button 
                    onClick={() => onSelectServiceForCalculator(item.id)}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#20E070] hover:text-[#07150E] text-slate-200 font-semibold text-sm border border-white/10 hover:border-[#20E070] transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Calculator className="w-4 h-4 text-[#20E070] group-hover/btn:text-[#07150E]" />
                    <span>{t.card_button}</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
