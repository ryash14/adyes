import React from 'react';
import MouseEffectCard from '../kokonutui/mouse-effect-card';
import CardStackExample from '../kokonutui/card-stack';

export const HighlightCardsSection = () => {
  return (
    <section className="relative w-full py-24 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-3xl font-bold mb-10 text-center text-foreground tracking-tight">Interactive Network</h2>
            <MouseEffectCard 
              title="Explore Ideas"
              subtitle="Hover to reveal the hidden gems across our network"
              topText="Ideas"
              topSubtext="Discover & Validate"
              primaryCtaText="Browse Ideas"
              primaryCtaUrl="/discover"
              secondaryCtaText="Submit Yours"
              secondaryCtaUrl="/discover?tab=ideas"
              footerText="Powered by Community"
            />
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-3xl font-bold mb-10 text-center text-foreground tracking-tight">Ecosystem Benefits</h2>
            <CardStackExample />
          </div>

        </div>
      </div>
    </section>
  );
};
