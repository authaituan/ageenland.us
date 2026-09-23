import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, Calculator, Database } from 'lucide-react';

export default function Navbar({ onOpenCalculator, onOpenAdmin }) {
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
              Green<span className="text-[#20E070]">Land</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-emerald-300 font-semibold block mt-1">
              Cảnh Quan & Sân Vườn
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
          <a href="#about" className="hover:text-[#20E070] transition-colors">Về Chúng Tôi</a>
          <a href="#services" className="hover:text-[#20E070] transition-colors">Dịch Vụ</a>
          <a href="#calculator" className="hover:text-[#20E070] transition-colors flex items-center gap-1.5 text-[#20E070] font-semibold">
            <Calculator className="w-4 h-4" />
            <span>Tính Phí Online</span>
          </a>
          <a href="#portfolio" className="hover:text-[#20E070] transition-colors">Dự Án</a>
          <a href="#testimonials" className="hover:text-[#20E070] transition-colors">Đánh Giá</a>
          <a href="#contact" className="hover:text-[#20E070] transition-colors">Liên Hệ</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={onOpenAdmin} 
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/15 hover:border-white/40 bg-white/5 transition-all"
            title="Xem quản lý báo giá SQLite"
          >
            <Database className="w-3.5 h-3.5 text-[#20E070]" />
            <span>Quản Lý API</span>
          </button>
          
          <button 
            onClick={onOpenCalculator} 
            className="btn-emerald py-2.5 px-5 text-sm"
          >
            <Calculator className="w-4 h-4" />
            <span>Nhận Báo Giá Ngay</span>
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
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">Về Chúng Tôi</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">Dịch Vụ Cắt Cỏ & Cảnh Quan</a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#20E070] font-semibold">Tính Chi Phí Tự Động</a>
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">Dự Án Thực Tế</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">Khách Hàng Đánh Giá</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 hover:text-[#20E070]">Liên Hệ</a>
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenCalculator(); }} 
              className="btn-emerald w-full justify-center py-3"
            >
              <Calculator className="w-4 h-4" />
              <span>Báo Giá Nhanh</span>
            </button>
            
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }} 
              className="text-xs text-slate-300 text-center py-2.5 border border-white/15 rounded-xl bg-white/5"
            >
              Bảng Điều Khiển Quản Lý (SQLite)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
