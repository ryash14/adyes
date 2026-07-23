import React from 'react';
import { Fade, GlowCard } from '../ui/Animations';

export const CapabilitiesSection = () => {
  return (
    <section className="py-24 px-6 bg-[#000000] relative overflow-hidden border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <Fade>
              <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tighter leading-[1.1] mb-6">
                Work together.<br />Like in the office.
              </h2>
              <p className="text-[#888888] text-[18px] leading-[1.6] font-medium tracking-tight mb-10">
                Create customized virtual office spaces for any department or event with high quality collaboration tools natively integrated.
              </p>
              
              <ul className="space-y-8">
                <li>
                  <h3 className="text-white text-2xl font-bold mb-2">Customize workspace</h3>
                  <p className="text-[#888888] text-lg">Create your own offices and meeting rooms to suit your team's needs.</p>
                </li>
                <li>
                  <h3 className="text-white text-2xl font-bold mb-2">Audio and video calls</h3>
                  <p className="text-[#888888] text-lg">Collaborate efficiently and seamlessly with high quality virtual conferencing.</p>
                </li>
              </ul>
            </Fade>
          </div>

          {/* Visual Mockup */}
          <div className="lg:w-1/2 w-full">
            <Fade delay={0.2} className="relative w-full aspect-video rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex items-center justify-center p-8 hover:border-white/20 transition-colors shadow-2xl">
              
              {/* Subtle background glow for the mockup */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />

              {/* Video call UI mock */}
              <div className="w-full h-full relative z-10 flex flex-col justify-between">
                
                {/* Header */}
                <div>
                  <div className="text-white font-bold text-xl mb-1">Onboarding Meeting</div>
                  <div className="text-[#888888] text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    4 participants
                  </div>
                </div>

                {/* Floating Avatars / Video grids */}
                <div className="absolute inset-0 flex items-center justify-end pr-8">
                   <div className="flex flex-col gap-4">
                     <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md shadow-lg relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-500/20" />
                       <span className="text-white font-bold relative z-10">CP</span>
                     </div>
                     <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md shadow-lg relative overflow-hidden">
                       <div className="absolute inset-0 bg-emerald-500/20" />
                       <span className="text-white font-bold relative z-10">MB</span>
                     </div>
                   </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center shadow-lg" />
                  <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center shadow-lg" />
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shadow-lg" />
                  <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center shadow-lg" />
                </div>
              </div>
            </Fade>
          </div>

        </div>
      </div>
    </section>
  );
};
