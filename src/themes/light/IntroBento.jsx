import React from 'react';
import { useSite } from '../../site/SiteContext';
import { Badge } from './ui';
import { useReveal } from './useReveal';

export default function IntroBento() {
  const { settings, services, projects } = useSite();
  const t = settings.about;
  const p = settings.portfolio;
  const h = settings.hero;
  const revealRef = useReveal();

  // Gather unique image URLs from CMS
  const rawImages = [
    t.image,
    p.after_image,
    ...(projects || []).map((item) => item.image),
    ...(services || []).map((item) => item.image),
    h.background_image,
  ];
  const images = Array.from(new Set(rawImages.filter(Boolean)));

  // Grid column span patterns for bento effect (up to 6 slots)
  const spans = [
    'col-span-12 md:col-span-6 h-64 sm:h-80',
    'col-span-12 sm:col-span-6 md:col-span-3 h-64 sm:h-80',
    'col-span-12 sm:col-span-6 md:col-span-3 h-64 sm:h-80',
    'col-span-12 sm:col-span-6 md:col-span-3 h-64 sm:h-80',
    'col-span-12 sm:col-span-6 md:col-span-3 h-64 sm:h-80',
    'col-span-12 md:col-span-6 h-64 sm:h-80',
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div ref={revealRef} className="container space-y-12">
        {/* Centered Intro Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge>{t.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold leading-[1.05] text-[#16241B]">
            {t.title}{' '}
            <span className="font-serif italic font-normal text-[#2E6A45]">
              {t.title_highlight}
            </span>
          </h2>
          <p className="text-[#5B6B60] text-[17px] leading-[1.7]">
            {t.paragraph1}
          </p>
        </div>

        {/* Bento Image Grid */}
        {images.length >= 3 && (
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {images.slice(0, 6).map((imgUrl, idx) => (
              <div
                key={idx}
                className={`${spans[idx % spans.length]} rounded-[24px] overflow-hidden shadow-sm border border-[#E6E8E0] bg-[#F4F6F0] group`}
              >
                <img
                  src={imgUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
