import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Fade } from '../ui/Animations';

export const HeroSection = ({ navigate }) => {
  return (
    <section className="relative w-full min-h-[110svh] pt-[160px] pb-32 flex flex-col items-center text-center bg-[#000000] overflow-hidden selection:bg-white/10 font-sans">
      
      {/* BACKGROUND GLOWS (Huly.io style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff15] via-[#ffffff05] to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center">
        
        <Fade yOffset={20}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-semibold mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Adyes 2.0 is now live
          </div>
        </Fade>

        <Fade delay={0.1} yOffset={20}>
          <h1 className="text-[56px] md:text-[80px] lg:text-[100px] font-bold tracking-tighter leading-[0.95] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-8 max-w-[900px]">
            Everything App for your ideas
          </h1>
        </Fade>
        
        <Fade delay={0.2} yOffset={16}>
          <p className="text-[18px] md:text-[22px] text-[#888888] leading-[1.5] max-w-[600px] mb-12 tracking-tight">
            Adyes is an open-source platform that serves as an all-in-one replacement for finding co-founders, managing projects, and accelerating your startup journey.
          </p>
        </Fade>

        <Fade delay={0.3} yOffset={12}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/register')} 
              className="group relative flex items-center justify-center h-12 px-8 rounded-full bg-white text-black text-[15px] font-bold tracking-tight hover:bg-zinc-200 transition-all active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span>Get Started</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/discover')} 
              className="flex items-center justify-center h-12 px-8 rounded-full border border-white/10 bg-white/5 text-white text-[15px] font-medium hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <Play size={16} className="mr-2 fill-white/80 text-white/80" />
              See in Action
            </button>
          </div>
        </Fade>
      </div>

      {/* DASHBOARD MOCKUP */}
      <Fade delay={0.5} yOffset={40} className="w-full mt-24 px-6 relative z-10 flex justify-center perspective-[2000px]">
        <div 
          className="w-full max-w-[1200px] h-[600px] rounded-[24px] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden relative"
          style={{ transform: "rotateX(10deg) scale(0.95)", transformOrigin: "top center" }}
        >
          {/* Mac window controls */}
          <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          {/* Abstract Interface lines to represent UI without text */}
          <div className="p-8 flex h-full gap-8 opacity-40">
            <div className="w-[200px] h-full flex flex-col gap-4">
              <div className="h-8 rounded-lg bg-white/10 w-full" />
              <div className="h-4 rounded bg-white/5 w-3/4 mt-4" />
              <div className="h-4 rounded bg-white/5 w-1/2" />
              <div className="h-4 rounded bg-white/5 w-2/3" />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/5" />
                <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/5" />
                <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/5" />
              </div>
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5 w-full" />
            </div>
          </div>
          
          {/* Overlay gradient to fade out the bottom of the mockup */}
          <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />
        </div>
      </Fade>

    </section>
  );
};
