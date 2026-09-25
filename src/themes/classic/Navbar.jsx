import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, Calculator } from 'lucide-react';
import { useSite } from '../../site/SiteContext';

export default function Navbar({ onOpenCalculator }) {
  const { settings } = useSite();
  const { brand, nav } = settings;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#081C15]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="container max-w-[1240px] mx-auto px-4 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform text-[#07150E]">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white block leading-none">
              {brand.name_part1}<span className="text-[#20E070]">{brand.name_part2}</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-emerald-300 font-semibold block mt-1">
              {brand.tagline}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
          <a href="#about" className="hover:text-[#20E070] transition-colors">{nav.about}</a>
          <a href="#services" className="hover:text-[#20E070] transition-colors">{nav.services}</a>
          <a href="#calculator" className="hover:text-[#20E070] transition-colors flex items-center gap-1.5 text-[#20E070] font-semibold">
            <Calculator className="w-4 h-4" />
            <span>{nav.calculator}</span>
          </a>
          <a href="#portfolio" className="hover:text-[#20E070] transition-colors">{nav.portfolio}</a>
          <a href="#testimonials" className="hover:text-[#20E070] transition-colors">{nav.testimonials}</a>
          <a href="#contact" className="hover:text-[#20E070] transition-colors">{nav.contact}</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={onOpenCalculator} 
            className="btn-emerald py-2.5 px-5 text-sm"
          >
            <Calculator className="w-4 h-4" />
            <span>{nav.cta}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D2B1D] border-b border-white/10 px-6 py-6 mt-3 space-y-4 animate-fadeIn">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">{nav.mobile_about}</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">{nav.mobile_services}</a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#20E070] font-semibold">{nav.mobile_calculator}</a>
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">{nav.mobile_portfolio}</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">{nav.mobile_testimonials}</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">{nav.mobile_contact}</a>
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenCalculator(); }} 
              className="btn-emerald w-full justify-center py-3"
            >
              <Calculator className="w-4 h-4" />
              <span>{nav.mobile_cta}</span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
