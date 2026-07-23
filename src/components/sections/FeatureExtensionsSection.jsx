import React from 'react';
import { Fade } from '../ui/Animations';
import CardFlip from '../kokonutui/card-flip';
import { LiquidGlassCard } from '../kokonutui/liquid-glass-card';

export const FeatureExtensionsSection = () => {
  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      
      {/* Premium Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-accent/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-[1200px] mx-auto">
        <Fade>
          <div className="text-center mb-24">
            <h2 className="text-[32px] md:text-[48px] font-bold text-foreground tracking-tighter leading-tight mb-4">
              Everything you need to build.
            </h2>
            <p className="text-muted-foreground text-[18px] md:text-[20px] leading-[1.6] font-medium tracking-tight max-w-[600px] mx-auto">
              A complete ecosystem designed to take your ideas from raw concepts to verified startups.
            </p>
          </div>
        </Fade>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          
          <Fade delay={0.1} className="w-full flex justify-center">
            <CardFlip 
              title="Expert Mentorship"
              subtitle="Get industry validation"
              description="Connect with leading experts who will review, refine, and certify your startup concepts."
              features={["Concept Review", "Technical Guidance", "Mentor Certification", "Direct Feedback"]}
            />
          </Fade>

          <Fade delay={0.2} className="w-full flex justify-center">
            <CardFlip 
              title="Active Projects"
              subtitle="Build in public"
              description="Transform certified ideas into active projects. Showcase your roadmap and milestones."
              features={["Public Roadmaps", "Progress Tracking", "Version Control Link", "Milestone Updates"]}
            />
          </Fade>

          <Fade delay={0.3} className="w-full flex justify-center">
            <CardFlip 
              title="Team Discovery"
              subtitle="Find your co-founders"
              description="Recruit the perfect technical or business co-founders from a network of verified builders."
              features={["Skill Matching", "Role Requirements", "Team Assembly", "Direct Messaging"]}
            />
          </Fade>

        </div>

        {/* Liquid Glass Showcase */}
        <Fade delay={0.5} yOffset={40} className="mt-32 w-full max-w-[800px] mx-auto">
          <LiquidGlassCard className="rounded-3xl border border-border/60 bg-card p-8 md:p-12 shadow-2xl flex flex-col items-center text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stop building in isolation.
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-[500px]">
              Join thousands of founders and engineers who are already building the next generation of startups on Adyes.
            </p>
          </LiquidGlassCard>
        </Fade>

      </div>
    </section>
  );
};
