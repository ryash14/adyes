import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#111111] text-zinc-100 flex flex-col items-center justify-center p-6 selection:bg-white/20 selection:text-white relative overflow-hidden font-sans">
      
      {/* Main Container */}
      <div className={`w-full ${wide ? 'max-w-md' : 'max-w-[360px]'} relative z-10 flex flex-col`}>
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-5 flex justify-center"
        >
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            <span className="text-white">ad</span>
            <span className="text-[#888888]">yes</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {progress && (
            <div className="mb-5 w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="flex justify-between items-end text-xs font-semibold tracking-wide mb-2.5">
                <span className="text-zinc-500 uppercase tracking-widest">{progressLabel || 'Onboarding'}</span>
                <span className="text-white">{pct}%</span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          )}

          <div className="mb-5 text-center">
            {title && (
              <h1 className="text-[24px] font-bold tracking-tight text-white mb-1.5">
                {title}
              </h1>
            )}
            {lead && (
              <p className="text-[#888888] text-sm">
                {lead}
              </p>
            )}
          </div>

          <div className="w-full">
            {children}
          </div>
        </motion.div>

        {/* Footer Links */}
        {footer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-[13px] text-[#888888] text-center"
          >
            {footer}
          </motion.div>
        )}

      </div>
    </div>
  );
}
