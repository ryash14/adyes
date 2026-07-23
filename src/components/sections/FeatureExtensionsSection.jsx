import React from 'react';
import { Fade, GlowCard } from '../ui/Animations';
import { ArrowUpRight } from 'lucide-react';

export const FeatureExtensionsSection = () => {
  return (
    <section id="features" className="py-24 px-6 bg-[#000000] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <Fade>
          <div className="mb-16">
            <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tighter leading-[1.1] mb-6">
              Unmatched productivity
            </h2>
            <p className="text-[#888888] text-[18px] leading-[1.6] max-w-2xl font-medium tracking-tight">
              Adyes is a process, project, time, and knowledge management platform that provides amazing collaboration opportunities for developers and product teams alike.
            </p>
          </div>
        </Fade>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1 - Wide */}
          <Fade className="md:col-span-2" delay={0.1}>
            <div className="group relative h-[380px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000]/80 z-10" />
              
              {/* Abstract Visual (Keyboard shortcuts) */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 flex items-center justify-center">
                 <div className="grid grid-cols-3 gap-4 rotate-12 scale-150">
                    <div className="w-16 h-16 rounded-xl border border-white/20 flex items-center justify-center bg-white/5"><span className="text-white/40 font-mono text-xl">⌘</span></div>
                    <div className="w-16 h-16 rounded-xl border border-white/20 flex items-center justify-center bg-white/5"><span className="text-white/40 font-mono text-xl">K</span></div>
                 </div>
              </div>

              <div className="relative z-20">
                <h3 className="text-white text-2xl font-bold mb-2">Keyboard shortcuts.</h3>
                <p className="text-[#888888] text-lg max-w-md">Work efficiently with instant access to common actions. Never leave your keyboard.</p>
              </div>
            </div>
          </Fade>

          {/* Box 2 - Standard */}
          <Fade className="md:col-span-1" delay={0.2}>
            <div className="group relative h-[380px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000]/80 z-10" />
              
              {/* Abstract visual */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border border-emerald-500/20 bg-emerald-500/5 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-20">
                <h3 className="text-white text-2xl font-bold mb-2">Team Planner.</h3>
                <p className="text-[#888888] text-lg">Keep track of the bigger picture by viewing all tasks in one place.</p>
              </div>
            </div>
          </Fade>

          {/* Box 3 - Standard */}
          <Fade className="md:col-span-1" delay={0.3}>
            <div className="group relative h-[380px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000]/80 z-10" />
              
              {/* Abstract visual */}
              <div className="absolute top-8 right-8 flex gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full" /></div>
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full" /></div>
              </div>

              <div className="relative z-20">
                <h3 className="text-white text-2xl font-bold mb-2">Notifications.</h3>
                <p className="text-[#888888] text-lg">Keep up to date with any changes instantly across the network.</p>
              </div>
            </div>
          </Fade>

          {/* Box 4 - Wide */}
          <Fade className="md:col-span-2" delay={0.4}>
            <div className="group relative h-[380px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000]/80 z-10" />
              
              {/* Abstract Visual (Timeline) */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 flex flex-col justify-center px-16 gap-4">
                 <div className="h-8 rounded bg-white/10 w-full" />
                 <div className="h-8 rounded bg-white/10 w-3/4 ml-12" />
                 <div className="h-8 rounded bg-white/10 w-1/2 ml-24" />
              </div>

              <div className="relative z-20">
                <h3 className="text-white text-2xl font-bold mb-2">Time-blocking.</h3>
                <p className="text-[#888888] text-lg max-w-md">Transform daily tasks into structured time blocks for focused productivity.</p>
              </div>
            </div>
          </Fade>

        </div>
      </div>
    </section>
  );
};
