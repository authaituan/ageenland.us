import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '../../site/SiteContext';
import { Logo } from './ui';

export default function Navbar({ onOpenCalculator }) {
  const { settings } = useSite();
  const { brand, nav } = settings;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['#about', nav.about, nav.mobile_about],
    ['#services', nav.services, nav.mobile_services],
    ['#calculator', nav.calculator, nav.mobile_calculator],
    ['#portfolio', nav.portfolio, nav.mobile_portfolio],
    ['#testimonials', nav.testimonials, nav.mobile_testimonials],
    ['#contact', nav.contact, nav.mobile_contact],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(24,59,41,0.06)] py-3'
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="shrink-0 focus:outline-none">
          <Logo brand={brand} scrolled={scrolled} />
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={`transition-colors duration-200 ${
                scrolled
                  ? 'text-[#16241B] hover:text-[#2E6A45]'
                  : 'text-white/90 hover:text-[#E5A93B]'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <button
              onClick={onOpenCalculator}
              className="lt-btn lt-btn-amber py-2.5 px-5 text-sm"
            >
              {nav.cta}
            </button>
          </div>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className={`lg:hidden p-2.5 rounded-full border transition-colors ${
              scrolled || open
                ? 'border-[#E6E8E0] bg-white text-[#16241B]'
                : 'border-white/30 bg-white/10 backdrop-blur-sm text-white'
            }`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E6E8E0] bg-white text-[#16241B] py-4 mt-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container flex flex-col">
            {links.map(([href, , mobileLabel]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-[#E6E8E0] last:border-0 font-medium text-sm text-[#16241B] hover:text-[#2E6A45]"
              >
                {mobileLabel}
              </a>
            ))}
            <div className="pt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenCalculator();
                }}
                className="lt-btn lt-btn-amber w-full py-3 text-sm font-bold"
              >
                {nav.mobile_cta}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
