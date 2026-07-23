import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AuthLayout({
 children,
 eyebrow,
 title,
 lead,
 footer,
 progress,
 progressLabel,
 wide = false,
}) {
 const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

 return (
 <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden selection:bg-accent selection:text-white dark:selection:text-black">
 {/* Left Pane - Art/Brand */}
 <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-gradient-to-br from-background via-secondary/80 to-background border-r border-border p-12 flex-col justify-between relative overflow-hidden">
 {/* Animated gradient orbs */}
 <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-[120px] rounded-full pointer-events-none animate-auth-orb-1" />
 <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-blue-500/10 via-purple-500/10 to-transparent blur-[100px] rounded-full pointer-events-none animate-auth-orb-2" />
 
 {/* Subtle grid pattern */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

 <div className="relative z-10 flex justify-between items-center w-full">
 <Link to="/" className="text-xl font-bold tracking-tight text-foreground hover:text-accent transition-colors flex items-center gap-2.5 group">
 <span className="text-foreground transition-colors duration-300">ad</span>
 <span className="text-accent transition-colors duration-300 group-hover:text-emerald-400">yes</span>
 </Link>
 </div>
 
 <div className="relative z-10 max-w-md">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 >
 <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-6 text-foreground font-display">
 Build The <br />
 <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent drop-shadow-sm">
 Future.
 </span>
 </h1>
 <p className="text-muted-foreground font-medium text-lg leading-relaxed">
 The network state for next-gen builders. No noise. Just discovery.
 </p>
 </motion.div>
 </div>
 
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.5 }}
 className="relative z-10 flex items-center gap-4 text-sm font-semibold tracking-wide text-muted-foreground"
 >
 <div className="flex -space-x-3">
 <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 </div>
 <span>Join 10,000+ builders</span>
 </motion.div>
 </div>

 {/* Right Pane - Form content */}
 <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 relative z-10 bg-background h-screen overflow-y-auto">
 {/* Subtle background accent for right pane */}
 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
 
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease:"easeOut" }}
 className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} mx-auto relative z-10`}
 >
 {/* Mobile Logo */}
 <div className="md:hidden flex justify-center mb-10">
 <Link to="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 font-display">
 <span className="text-foreground">ad</span>
 <span className="text-accent">yes</span>
 </Link>
 </div>

 {progress && (
 <div className="mb-10 w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
 <div className="flex justify-between items-end text-sm font-semibold tracking-wide mb-2.5">
 <span className="text-muted-foreground text-xs uppercase tracking-widest">{progressLabel || 'Onboarding'}</span>
 <span className="text-accent font-bold text-sm">{pct}%</span>
 </div>
 <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
 <motion.div 
 className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-white dark:to-zinc-300 rounded-full"
 initial={{ width: 0 }}
 animate={{ width: `${pct}%` }}
 transition={{ duration: 0.5, ease:"easeOut" }}
 />
 </div>
 </div>
 )}

 <header className="mb-8 text-center md:text-left">
 {eyebrow && <p className="text-accent font-bold uppercase tracking-widest text-[11px] mb-3">{eyebrow}</p>}
 {title && <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3 font-display">{title}</h2>}
 {lead && <p className="text-muted-foreground text-sm sm:text-base font-medium">{lead}</p>}
 </header>

 <div className="bg-white/80 dark:bg-zinc-900/60 border border-border/80 dark:border-white/[0.06] shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/50 p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
 {children}
 </div>

 {footer && (
 <footer className="mt-8 text-center text-sm font-medium text-muted-foreground">
 {footer}
 </footer>
 )}
 </motion.div>
 </div>
 </div>
 );
}
