import React from 'react';
import { Fade } from '../ui/Animations';
import { ArrowRight } from 'lucide-react';

export const CTASection = ({ navigate }) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-[#000000]">
      
      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Huge glowing banner container */}
        <div className="relative rounded-[40px] border border-white/10 bg-[#0a0a0a] p-16 md:p-24 overflow-hidden text-center flex flex-col items-center">
          
          {/* Abstract glows inside banner */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent blur-[60px] pointer-events-none" />

          <Fade>
            <h2 className="text-[48px] md:text-[72px] font-bold tracking-tighter leading-[1.0] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 relative z-10">
              Start building today.
            </h2>
          </Fade>
          
          <Fade delay={0.1}>
            <p className="text-[#888888] text-[20px] max-w-[500px] mx-auto mb-12 leading-[1.6] tracking-tight relative z-10">
              Join thousands of builders who ship faster together. Free to start, no credit card required.
            </p>
          </Fade>
          
          <Fade delay={0.2} className="relative z-10">
            <button 
              onClick={() => navigate('/register')} 
              className="group relative flex items-center justify-center h-14 px-10 rounded-full bg-white text-black text-[16px] font-bold tracking-tight hover:bg-zinc-200 transition-all active:scale-[0.98] overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span>Get Started Free</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Fade>
          
        </div>
      </div>
    </section>
  );
};
