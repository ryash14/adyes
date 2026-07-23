import React from 'react';
import { Fade } from '../ui/Animations';
import SlideTextButton from '../kokonutui/slide-text-button';

export const CTASection = ({ navigate }) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-background">
      
      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Huge glowing banner container */}
        <div className="relative rounded-[40px] border border-border/50 bg-card p-16 md:p-24 overflow-hidden text-center flex flex-col items-center shadow-2xl">
          
          {/* Abstract glows inside banner */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

          <Fade>
            <h2 className="text-[48px] md:text-[72px] font-bold tracking-tighter leading-[1.0] text-foreground mb-6 relative z-10">
              Start building today.
            </h2>
          </Fade>
          
          <Fade delay={0.1}>
            <p className="text-muted-foreground text-[20px] max-w-[500px] mx-auto mb-12 leading-[1.6] tracking-tight relative z-10 font-medium">
              Join thousands of builders who ship faster together. Free to start, no credit card required.
            </p>
          </Fade>
          
          <Fade delay={0.2} className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <SlideTextButton 
              text="Get Started Free"
              hoverText="Join Now"
              href="/register"
              className="h-14 px-10 text-base md:min-w-48 shadow-lg shadow-accent/20"
            />
          </Fade>
          
        </div>
      </div>
    </section>
  );
};
