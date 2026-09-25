import React from 'react';
import { Star } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { SectionHeader } from './ui';

export default function Testimonials() {
  const { settings, testimonials } = useSite();
  const t = settings.testimonials_section;

  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="container space-y-12">
        <SectionHeader badge={t.badge} title={t.title} highlight={t.title_highlight} description={t.description} align="center" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <figure key={item.id} className="bg-white rounded-3xl border border-[#E3E4DA] p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(Math.max(0, Math.min(5, item.stars || 0)))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#2E6A45] text-[#2E6A45]" />
                  ))}
                </div>
                <blockquote className="text-[#16241B] text-base leading-relaxed">“{item.content}”</blockquote>
              </div>
              <figcaption className="flex items-center gap-3 pt-5 border-t border-[#E3E4DA]">
                <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover" />
                <span>
                  <span className="block font-semibold text-sm text-[#16241B]">{item.name}</span>
                  <span className="block text-xs text-[#5B6B60]">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
