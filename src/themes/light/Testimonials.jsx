import React from 'react';
import { Star } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { SectionHeader } from './ui';
import { useReveal } from './useReveal';

export default function Testimonials() {
  const { settings, testimonials } = useSite();
  const t = settings.testimonials_section;
  const headerRef = useReveal();

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-[#F4F6F0]">
      <div className="container space-y-14">
        <div ref={headerRef}>
          <SectionHeader
            badge={t.badge}
            title={t.title}
            highlight={t.title_highlight}
            description={t.description}
            align="center"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <TestimonialCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, index }) {
  const cardRef = useReveal();

  return (
    <figure
      ref={cardRef}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(24,59,41,0.08)] border border-[#E6E8E0] p-7 sm:p-8 flex flex-col justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Decorative large light-yellow quotation mark */}
      <span className="font-serif text-8xl text-[#E5A93B]/20 absolute -top-2 right-4 pointer-events-none select-none">
        “
      </span>

      <div className="space-y-4 relative z-10">
        {/* Amber Stars */}
        <div className="flex gap-1">
          {[...Array(Math.max(0, Math.min(5, item.stars || 0)))].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#E5A93B] text-[#E5A93B]" />
          ))}
        </div>
        <blockquote className="text-[#16241B] text-base leading-relaxed font-medium">
          “{item.content}”
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3.5 pt-5 border-t border-[#E6E8E0] relative z-10">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#E6E8E0] shadow-sm"
        />
        <div>
          <span className="block font-extrabold text-sm text-[#16241B]">
            {item.name}
          </span>
          <span className="block text-xs font-medium text-[#5B6B60] mt-0.5">
            {item.role}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
