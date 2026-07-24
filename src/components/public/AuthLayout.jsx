import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Particles } from '../ui/particles';
import { ShineBorder } from '../ui/shine-border';

export default function AuthLayout({
  children,
  title,
  lead,
  footer,
  progress,
  progressLabel,
  wide = false,
}) {
  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 relative selection:bg-accent/20 selection:text-foreground bg-background">
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={80}
        color="#0ea5e9"
        refresh
      />
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full ${wide ? 'max-w-xl' : 'max-w-[420px]'} relative z-10 flex flex-col p-8 sm:p-10 rounded-[32px] bg-card/80 backdrop-blur-3xl border border-border shadow-2xl`}
      >
        <ShineBorder 
          shineColor={["#0ea5e9", "#38bdf8", "#7dd3fc"]}
          borderWidth={1.5}
        />
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <Link to="/" className="text-[28px] font-bold tracking-tighter flex items-center gap-0.5 hover:scale-95 transition-transform duration-300">
              <span className="text-foreground">ad</span>
              <span className="text-accent">yes</span>
            </Link>
          </div>

          <div className="w-full relative">
            {progress && (
              <div className="mb-8 w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex justify-between items-end text-[10px] font-bold tracking-widest uppercase mb-3">
                  <span className="text-muted-foreground">{progressLabel || 'Onboarding'}</span>
                  <span className="text-emerald-500">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="mb-8 text-center">
              {title && (
                <h1 className="text-[28px] font-bold tracking-tight text-foreground mb-2 leading-tight">
                  {title}
                </h1>
              )}
              {lead && (
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  {lead}
                </p>
              )}
            </div>

            <div className="w-full">
              {children}
            </div>
          </div>

          {/* Footer Links */}
          {footer && (
            <div className="mt-8 pt-6 border-t border-border text-[14px] text-muted-foreground text-center font-medium relative z-20">
              {footer}
            </div>
          )}
      </motion.div>
    </div>
  );
}
