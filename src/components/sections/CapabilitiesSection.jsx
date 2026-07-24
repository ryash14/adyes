import React, { useRef } from 'react';
import { Fade } from '../ui/Animations';
import { Lightbulb, Rocket, Users, TrendingUp } from 'lucide-react';
import { Globe } from '../ui/globe';
import { Highlighter } from '../ui/highlighter';
import { AnimatedBeam } from '../ui/animated-beam';

export const CapabilitiesSection = () => {
  const containerRef = useRef(null);
  const fromRef1 = useRef(null);
  const fromRef2 = useRef(null);
  const globeRef = useRef(null);

  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden border-t border-border/50">
      <div className="max-w-[1200px] mx-auto relative" ref={containerRef}>
        
        <div className="flex flex-col lg:flex-row gap-20 items-center justify-between">
          
          {/* Text Content */}
          <div className="lg:w-1/2 relative z-10">
            <Fade>
              <h2 className="text-[40px] md:text-[56px] font-bold text-foreground tracking-tighter leading-[1.1] mb-6">
                Your entire startup ecosystem.<br />
                <span className="text-muted-foreground">In one dashboard.</span>
              </h2>
              <p className="text-muted-foreground text-[18px] leading-[1.6] font-medium tracking-tight mb-10">
                Manage your ideas, track your active projects, and connect with your builder network from a single, unified command center tailored for founders and engineers.
              </p>
              
              <ul className="space-y-8">
                <li className="flex gap-4 relative">
                  <div ref={fromRef1} className="mt-1 bg-accent/10 p-3 rounded-xl text-accent h-fit z-10 shadow-sm border border-accent/20">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-foreground text-2xl font-bold mb-2 tracking-tight">
                      <Highlighter action="highlight" color="rgba(255, 99, 99, 0.2)">
                        Track Your Growth
                      </Highlighter>
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">Monitor how many ideas you've shared, projects you're building, and collaborators you've connected with.</p>
                  </div>
                </li>
                <li className="flex gap-4 relative">
                  <div ref={fromRef2} className="mt-1 bg-emerald-500/10 p-3 rounded-xl text-emerald-500 h-fit z-10 shadow-sm border border-emerald-500/20">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-foreground text-2xl font-bold mb-2 tracking-tight">
                      Manage <Highlighter action="underline" color="#10B981">Mentor Requests</Highlighter>
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">If you're a mentor, easily view pending ideas from builders and provide official certification directly from your dashboard.</p>
                  </div>
                </li>
              </ul>
            </Fade>
          </div>

          {/* Visual Mockup - Globe for a global builder network vibe */}
          <div className="lg:w-1/2 w-full flex justify-center relative min-h-[400px]">
            <Fade delay={0.2} className="relative w-full max-w-[500px] flex items-center justify-center">
              
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-accent/10 blur-[100px] pointer-events-none rounded-full" />

              <div ref={globeRef} className="relative z-10 w-full aspect-square flex items-center justify-center overflow-hidden rounded-full border border-border/40 shadow-2xl bg-card/50 backdrop-blur-sm">
                <Globe className="scale-125 md:scale-150" />
              </div>
              
            </Fade>
          </div>
        </div>

        {/* Animated Beams */}
        <AnimatedBeam containerRef={containerRef} fromRef={fromRef1} toRef={globeRef} />
        <AnimatedBeam containerRef={containerRef} fromRef={fromRef2} toRef={globeRef} />

      </div>
    </section>
  );
};
