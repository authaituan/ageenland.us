import React, { useState } from 'react';
import './light.css';
import Navbar from './Navbar';
import Hero from './Hero';
import IntroBento from './IntroBento';
import Services from './Services';
import About from './About';
import Calculator from './Calculator';
import Portfolio from './Portfolio';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer from './Footer';

// Theme "light": nền sáng, bố cục thoáng, hiện đại theo spec TASK-LIGHT-THEME (v2).
// Dùng CHUNG nội dung CMS và logic (src/site/forms.js) với theme classic.
// Chỉ sửa giao diện trong thư mục này; không đổi tên trường nội dung, không tự tính giá/gửi form ở đây.
export default function LightApp() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const openCalculator = () =>
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  const selectService = (id) => {
    setSelectedServiceId(id);
    openCalculator();
  };

  return (
    <div className="min-h-screen bg-white text-[#16241B] font-sans selection:bg-[#E5A93B] selection:text-[#16241B]">
      <Navbar onOpenCalculator={openCalculator} />
      <main>
        <Hero onOpenCalculator={openCalculator} onSelectService={selectService} />
        <IntroBento />
        <Services onSelectServiceForCalculator={selectService} />
        <About />
        <Calculator selectedServiceId={selectedServiceId} />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
