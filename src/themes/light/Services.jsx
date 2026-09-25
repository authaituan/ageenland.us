import React from 'react';
import { Scissors, Trees, Sparkles, Wind, Shovel, Droplets, ArrowUpRight, Check } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { fmt } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { SectionHeader } from './ui';

const ICONS = { Scissors, Trees, Sparkles, Wind, Shovel, Droplets };

export default function Services({ onSelectServiceForCalculator }) {
  const { settings, services } = useSite();
  const t = settings.services_section;

  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="container space-y-12">
        <SectionHeader badge={t.badge} title={t.title} highlight={t.title_highlight} description={t.description} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = ICONS[item.icon] || Scissors;
            return (
              <article key={item.id} className="group flex flex-col rounded-3xl bg-[#F7F6F1] border border-[#E3E4DA] overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 right-4 bg-white/95 rounded-full px-3 py-1 text-xs font-semibold text-[#183B29]">
                    {fmt(t.price_format, { price: formatMoney(item.pricePerM2, settings.site) })}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-6 pt-0">
                  <span className="-mt-7 mb-4 w-14 h-14 rounded-full bg-[#183B29] text-[#DCEFB0] flex items-center justify-center border-4 border-[#F7F6F1] relative">
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="text-xs font-semibold text-[#2E6A45]">{item.subtitle}</span>
                  <h3 className="text-2xl text-[#16241B] mt-1">{item.title}</h3>
                  <p className="text-sm text-[#5B6B60] mt-3 line-clamp-3">{item.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {item.features?.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[#16241B]"><Check className="w-3.5 h-3.5 text-[#2E6A45] shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onSelectServiceForCalculator(item.id)}
                    className="mt-6 pt-4 border-t border-[#E3E4DA] flex items-center justify-between text-sm font-semibold text-[#183B29] hover:text-[#2E6A45]"
                  >
                    {t.card_button}
                    <span className="w-9 h-9 rounded-full border border-[#183B29] flex items-center justify-center group-hover:bg-[#183B29] group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
