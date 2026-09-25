import React from 'react';

// Bảng màu theme light (khớp light.css):
// nền #F7F6F1 · nền phụ #EDF1E6 · chữ #16241B · chữ phụ #5B6B60 · viền #E3E4DA
// xanh #2E6A45 · xanh đậm #183B29 · xanh non #DCEFB0

export function Badge({ children }) {
  if (!children) return null;
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEFB0] text-[#183B29] text-xs font-semibold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2E6A45]" />
      {children}
    </span>
  );
}

// Tiêu đề section: căn giữa (align="center") hoặc chia 2 bên (tiêu đề trái, mô tả phải).
export function SectionHeader({ badge, title, highlight, description, align = 'split' }) {
  const heading = (
    <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.1] text-[#16241B]">
      {title} {highlight && <span className="text-[#2E6A45]">{highlight}</span>}
    </h2>
  );
  if (align === 'center') {
    return (
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge>{badge}</Badge>
        {heading}
        {description && <p className="text-[#5B6B60] text-base sm:text-lg">{description}</p>}
      </div>
    );
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end">
      <div className="space-y-4">
        <Badge>{badge}</Badge>
        {heading}
      </div>
      {description && <p className="text-[#5B6B60] text-base sm:text-lg lg:pb-2">{description}</p>}
    </div>
  );
}

export function Logo({ brand, dark = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? 'bg-[#DCEFB0] text-[#183B29]' : 'bg-[#183B29] text-[#DCEFB0]'}`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`font-serif text-xl sm:text-2xl ${dark ? 'text-white' : 'text-[#16241B]'}`}>
          {brand.name_part1}<span className={dark ? 'text-[#DCEFB0]' : 'text-[#2E6A45]'}>{brand.name_part2}</span>
        </span>
        {brand.tagline && <span className={`block text-[10px] tracking-wide mt-1 ${dark ? 'text-white/60' : 'text-[#5B6B60]'}`}>{brand.tagline}</span>}
      </span>
    </span>
  );
}
