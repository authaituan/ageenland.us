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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
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
    <header className={`sticky top-0 z-50 bg-[#F7F6F1]/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_1px_0_#E3E4DA]' : ''}`}>
      <div className="container flex items-center justify-between h-20">
        <a href="#" className="shrink-0"><Logo brand={brand} /></a>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#16241B]">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-[#2E6A45]">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block"><button onClick={onOpenCalculator} className="lt-btn lt-btn-primary py-2.5 px-5 text-sm">{nav.cta}</button></span>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden p-2 rounded-full border border-[#E3E4DA] text-[#16241B]">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E3E4DA] bg-white py-4">
          <div className="container flex flex-col">
            {links.map(([href, , mobileLabel]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="py-3 border-b border-[#E3E4DA] last:border-0 text-[#16241B]">{mobileLabel}</a>
            ))}
            <button onClick={() => { setOpen(false); onOpenCalculator(); }} className="lt-btn lt-btn-primary mt-4">{nav.mobile_cta}</button>
          </div>
        </div>
      )}
    </header>
  );
}
