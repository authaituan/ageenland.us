import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import CostCalculator from './CostCalculator';
import Portfolio from './Portfolio';
import Testimonials from './Testimonials';
import ContactSection from './ContactSection';
import Footer from './Footer';

export default function ClassicApp() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const handleOpenCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForCalculator = (serviceId) => {
    setSelectedServiceId(serviceId);
    handleOpenCalculator();
  };

  return (
    <div className="min-h-screen bg-[#07150E] text-slate-100 font-sans selection:bg-[#20E070] selection:text-[#07150E]">
      {/* Top Navbar */}
      <Navbar 
        onOpenCalculator={handleOpenCalculator}
      />

      {/* Main Content Sections */}
      <main>
        <Hero 
          onOpenCalculator={handleOpenCalculator}
          onSelectService={handleSelectServiceForCalculator}
        />

        <AboutSection />

        <ServicesSection 
          onSelectServiceForCalculator={handleSelectServiceForCalculator}
        />

        <CostCalculator 
          selectedServiceId={selectedServiceId}
        />

        <Portfolio />

        <Testimonials />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
