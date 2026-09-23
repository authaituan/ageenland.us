import React from 'react';
import { Leaf, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05100B] text-slate-400 border-t border-white/10 pt-16 pb-8 relative">
      <div className="container space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[#07150E]">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Green<span className="text-[#20E070]">Land</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Đơn vị hàng đầu về giải pháp chăm sóc thảm cỏ biệt thự, trồng cây bóng mát, xử lý & quy hoạch cảnh quan sân vườn chuyên nghiệp tại Việt Nam.
            </p>
            <div className="pt-2 text-xs text-[#20E070] font-semibold">
              © 2026 GreenLand Inc. All rights reserved.
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Dịch Vụ Chính</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-[#20E070]">Cắt Cỏ & Bảo Dưỡng Thảm Cỏ</a></li>
              <li><a href="#services" className="hover:text-[#20E070]">Trồng Cây & Tỉa Dáng Bonsai</a></li>
              <li><a href="#services" className="hover:text-[#20E070]">Thiết Kế Cảnh Quan Sân Vườn</a></li>
              <li><a href="#services" className="hover:text-[#20E070]">Thu Dọn Lá & Vệ Sinh Mùa</a></li>
              <li><a href="#services" className="hover:text-[#20E070]">Phủ Mùn & Cải Tạo Đất</a></li>
              <li><a href="#services" className="hover:text-[#20E070]">Tới Tự Động Thông Minh</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-[#20E070]">Về GreenLand</a></li>
              <li><a href="#calculator" className="hover:text-[#20E070]">Tính Chi Phí Trực Tuyến</a></li>
              <li><a href="#portfolio" className="hover:text-[#20E070]">Dự Án Trước / Sau</a></li>
              <li><a href="#testimonials" className="hover:text-[#20E070]">Đánh Giá Khách Hàng</a></li>
              <li><a href="#contact" className="hover:text-[#20E070]">Đăng Ký Khảo Sát</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Hỗ Trợ Khách Hàng</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#20E070]" />
                <span className="text-white font-bold">0988 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#20E070]" />
                <span>contact@agreenland.vn</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#20E070] shrink-0 mt-0.5" />
                <span>Ecopark / Thảo Điền / Hà Nội & TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>Thiết kế mẫu giao diện độc quyền cho dịch vụ Cắt cỏ, Trồng cây & Cảnh quan sân vườn.</span>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#20E070] transition-colors"
          >
            <span>Về Đầu Trang</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
