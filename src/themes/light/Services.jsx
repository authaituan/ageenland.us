import React from 'react';
import { Scissors, Trees, Sparkles, Wind, Shovel, Droplets, ArrowUpRight, Check } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { fmt } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { SectionHeader } from './ui';
import { useReveal } from './useReveal';

const ICONS = { Scissors, Trees, Sparkles, Wind, Shovel, Droplets };

export default function Services({ onSelectServiceForCalculator }) {
  const { settings, services } = useSite();
  const t = settings.services_section;
  const headerRef = useReveal();

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#F4F6F0]">
      <div className="container space-y-12">
        <div ref={headerRef}>
          <SectionHeader
            badge={t.badge}
            title={t.title}
            highlight={t.title_highlight}
            description={t.description}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((item, idx) => {
            const Icon = ICONS[item.icon] || Scissors;
            return (
              <ServiceCard
                key={item.id}
                item={item}
                t={t}
                Icon={Icon}
                settings={settings}
                onSelectServiceForCalculator={onSelectServiceForCalculator}
                index={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item, t, Icon, settings, onSelectServiceForCalculator, index }) {
  const cardRef = useReveal();

  return (
    <article
      ref={cardRef}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="group flex flex-col rounded-[24px] bg-white border border-[#E6E8E0] p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(24,59,41,0.08)] hover:shadow-[0_20px_50px_rgba(24,59,41,0.14)] hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Inner Image Container with Padding */}
      <div className="relative h-56 rounded-[18px] overflow-hidden bg-[#F4F6F0]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[#183B29] shadow-sm border border-[#E6E8E0]/60">
          {fmt(t.price_format, { price: formatMoney(item.pricePerM2, settings.site) })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-3 pb-2">
        <span className="-mt-6 mb-3 w-12 h-12 rounded-full bg-[#F4F6F0] text-[#183B29] flex items-center justify-center border-4 border-white shadow-sm relative z-10 group-hover:bg-[#183B29] group-hover:text-[#E5A93B] transition-colors">
          <Icon className="w-5 h-5" />
        </span>

        <span className="text-xs font-bold tracking-wider uppercase text-[#2E6A45]">
          {item.subtitle}
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241B] mt-1">
          {item.title}
        </h3>
        <p className="text-sm text-[#5B6B60] leading-relaxed mt-2 line-clamp-3">
          {item.description}
        </p>

        {/* Features */}
        <ul className="mt-4 space-y-2 flex-1">
          {item.features?.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs font-medium text-[#16241B]">
              <Check className="w-3.5 h-3.5 text-[#2E6A45] shrink-0 stroke-[3]" />
              {f}
            </li>
          ))}
        </ul>

        {/* Button footer link */}
        <button
          onClick={() => onSelectServiceForCalculator(item.id)}
          className="mt-6 pt-4 border-t border-[#E6E8E0] flex items-center justify-between text-sm font-bold text-[#183B29] hover:text-[#2E6A45] group-hover:underline w-full text-left"
        >
          {t.card_button}
          <span className="w-9 h-9 rounded-full bg-[#F4F6F0] border border-[#E6E8E0] text-[#183B29] flex items-center justify-center group-hover:bg-[#183B29] group-hover:text-[#E5A93B] group-hover:border-[#183B29] transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </article>
  );
}
