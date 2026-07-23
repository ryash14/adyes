import React from 'react';
import { Fade } from '../ui/Animations';

export const CTASection = ({ navigate }) => (
  <section className="py-40 px-6 relative overflow-hidden bg-slate-50 dark:bg-[#050608] transition-colors duration-500">
    <div className="max-w-[600px] mx-auto text-center relative z-10">
      <Fade><h2 className="text-[40px] md:text-[64px] font-bold tracking-[-0.04em] leading-[1.05] text-slate-900 dark:text-white mb-6 transition-colors duration-500">
        Start building today.
      </h2></Fade>
      <Fade delay={0.08}><p className="text-slate-500 dark:text-white/30 text-[18px] max-w-[420px] mx-auto mb-12 leading-[1.6] font-medium transition-colors duration-500">Join thousands of builders who ship faster together. Free to start, no credit card required.</p></Fade>
      <Fade delay={0.15}>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate('/register')} className="h-12 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[14px] font-semibold hover:scale-[0.98] transition-all duration-200 shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            Get Started Free
          </button>
        </div>
      </Fade>
    </div>
  </section>
);
