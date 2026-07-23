import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Sections
import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { FeatureExtensionsSection } from '@/components/sections/FeatureExtensionsSection';
import { HighlightCardsSection } from '@/components/sections/HighlightCardsSection';
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { CTASection } from '@/components/sections/CTASection';

export default function LandingPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, mouseMultiplier: 0.8 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent/20 font-sans">
      <Navbar />
      <main>
        <HeroSection navigate={navigate} />
        <HighlightCardsSection />
        <MarqueeSection />
        <FeatureExtensionsSection />
        <CapabilitiesSection />
        <StatsSection />
        <CTASection navigate={navigate} />
      </main>
      <Footer />
    </div>
  );
}
