import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

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
 <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-secondary/50 border-r border-border p-12 flex-col justify-between relative overflow-hidden">
 {/* Abstract Background Element */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 dark:bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
 
 <div className="relative z-10 flex justify-between items-center w-full">
 <Link to="/" className="text-xl font-bold tracking-tight text-foreground hover:text-accent transition-colors flex items-center gap-2">
 <div className="h-8 w-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
 </div>
 CollabHub
 </Link>
 </div>
 
 <div className="relative z-10 max-w-md">
 <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-6 text-foreground">
 Build The <br />
 <span className="text-accent drop-shadow-sm">Future.</span>
 </h1>
 <p className="text-muted-foreground font-medium text-lg leading-relaxed">
 The network state for next-gen builders. No noise. Just discovery.
 </p>
 </div>
 
 <div className="relative z-10 flex items-center gap-4 text-sm font-semibold tracking-wide text-muted-foreground">
 <div className="flex -space-x-3">
 <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="User" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
 </div>
 <span>Join 10,000+ builders</span>
 </div>
 </div>

 {/* Right Pane - Form content */}
 <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 relative z-10 bg-background h-screen overflow-y-auto">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease:"easeOut" }}
 className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} mx-auto`}
 >
 {/* Mobile Logo */}
 <div className="md:hidden flex justify-center mb-10">
 <Link to="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
 <div className="h-8 w-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
 </div>
 CollabHub
 </Link>
 </div>

 {progress && (
 <div className="mb-12 w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
 <div className="flex justify-between items-end text-sm font-semibold tracking-wide mb-2">
 <span className="text-muted-foreground">{progressLabel || 'Onboarding'}</span>
 <span className="text-accent font-bold">{pct}%</span>
 </div>
 <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
 <motion.div 
 className="h-full bg-accent rounded-full"
 initial={{ width: 0 }}
 animate={{ width: `${pct}%` }}
 transition={{ duration: 0.5, ease:"easeOut" }}
 />
 </div>
 </div>
 )}

 <header className="mb-8 text-center md:text-left">
 {eyebrow && <p className="text-accent font-bold uppercase tracking-widest text-[11px] mb-3">{eyebrow}</p>}
 {title && <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">{title}</h2>}
 {lead && <p className="text-muted-foreground text-sm sm:text-base font-medium">{lead}</p>}
 </header>

 <div className="bg-white/70 dark:bg-zinc-900/40 border border-border shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/50 p-6 sm:p-8 rounded-2xl backdrop-blur-xl">
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
