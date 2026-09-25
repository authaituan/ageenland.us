import React from 'react';

// Theme "light" UI Helpers:
// Nền #FFFFFF / #F4F6F0 · chữ #16241B · chữ phụ #5B6B60 · viền #E6E8E0
// Xanh #2E6A45 · Xanh đậm #183B29 · Amber nhấn #E5A93B

export function Badge({ children, dark = false }) {
  if (!children) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
        dark
          ? 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
          : 'bg-[#F4F6F0] text-[#183B29] border border-[#E6E8E0]'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${dark ? 'bg-[#E5A93B]' : 'bg-[#2E6A45]'}`} />
      {children}
    </span>
  );
}

// SectionHeader:
// Tiêu đề (h2): DM Sans 800, line-height 1.05.
// từ nhấn (highlight): DM Serif Display italic (#2E6A45 trên nền sáng, #E5A93B trên nền tối).
export function SectionHeader({ badge, title, highlight, description, align = 'split', dark = false }) {
  const heading = (
    <h2 className={`text-[2.1rem] sm:text-4xl lg:text-[3.25rem] font-extrabold leading-[1.05] tracking-tight ${dark ? 'text-white' : 'text-[#16241B]'}`}>
      {title}{' '}
      {highlight && (
        <span className={`font-serif italic font-normal ${dark ? 'text-[#E5A93B]' : 'text-[#2E6A45]'}`}>
          {highlight}
        </span>
      )}
    </h2>
  );

  if (align === 'center') {
    return (
      <div className="text-center max-w-3xl mx-auto space-y-4">
        {badge && <Badge dark={dark}>{badge}</Badge>}
        {heading}
        {description && (
          <p className={`text-[17px] leading-[1.7] ${dark ? 'text-white/80' : 'text-[#5B6B60]'}`}>
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
      <div className="lg:col-span-7 space-y-4">
        {badge && <Badge dark={dark}>{badge}</Badge>}
        {heading}
      </div>
      {description && (
        <div className="lg:col-span-5">
          <p className={`text-[17px] leading-[1.7] lg:pb-1 ${dark ? 'text-white/80' : 'text-[#5B6B60]'}`}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export function Logo({ brand, dark = false, scrolled = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          dark
            ? 'bg-[#E5A93B] text-[#183B29]'
            : scrolled
            ? 'bg-[#183B29] text-[#E5A93B]'
            : 'bg-white/20 text-white backdrop-blur-sm'
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
            dark
              ? 'text-white'
              : scrolled
              ? 'text-[#16241B]'
              : 'text-white'
          }`}
        >
          {brand.name_part1}
          <span className={dark ? 'text-[#E5A93B]' : scrolled ? 'text-[#2E6A45]' : 'text-[#E5A93B]'}>
            {brand.name_part2}
          </span>
        </span>
        {brand.tagline && (
          <span
            className={`block text-[10px] font-medium tracking-wider uppercase mt-1 transition-colors ${
              dark
                ? 'text-white/60'
                : scrolled
                ? 'text-[#5B6B60]'
                : 'text-white/80'
            }`}
          >
            {brand.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
