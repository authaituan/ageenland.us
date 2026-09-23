import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Anh Trần Minh Tuấn',
    role: 'Chủ sở hữu Biệt thự Ecopark',
    content: 'Đội ngũ GreenLand cắt cỏ rất đúng kỹ thuật, thảm cỏ mịn và viền lối đi cực kỳ sắc nét. Hệ thống báo giá online chuẩn xác 100% không phát sinh chi phí.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Chị Lê Hoàng Anh',
    role: 'Quản lý Khu Đô Thị Ciputra',
    content: 'Dịch vụ dọn dẹp lá khô và tỉa cành cây mùa mưa bão rất nhanh nhẹn. Kỹ sư tới khảo sát chỉ sau 15 phút từ lúc tôi ấn đăng ký trên web.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Ông David Miller',
    role: 'Giám đốc Resort Cảnh Quan',
    content: 'GreenLand đã biến khu vườn hoang sơ thành thảm cỏ xanh mướt với hệ thống tưới tự động thông minh. Rất ấn tượng với quy trình làm việc chuyên nghiệp.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#081C15] relative overflow-hidden">
      <div className="container relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#20E070] text-xs font-semibold uppercase tracking-wider">
            Phản Hồi Từ Khách Hàng
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Khách Hàng Nói Gì Về <span className="text-gradient">GreenLand</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Sự hài lòng của chủ nhà và đối tác dự án là niềm tự hào lớn nhất của chúng tôi.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="glass-panel p-8 space-y-6 relative rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-10 h-10 text-[#20E070]/30" />
                <div className="flex gap-1">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#20E070]" />
                <div>
                  <h4 className="font-bold text-white text-sm font-serif">{item.name}</h4>
                  <span className="text-xs text-emerald-400 block">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
