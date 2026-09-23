import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import CostCalculator from './components/CostCalculator';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
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
