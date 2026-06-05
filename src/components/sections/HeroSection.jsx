import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
 const container = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.1,
 },
 },
 };

 const item = {
 hidden: { opacity: 0, y: 20 },
 show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
 };

 return (
 <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 pt-24">
 {/* Background glow */}
 <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
 <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-neon-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
 </div>
 
 {/* Content */}
 <motion.div 
 className="relative z-10 w-full max-w-5xl mx-auto text-center"
 variants={container}
 initial="hidden"
 animate="show"
 >
 <motion.div variants={item} className="mb-6 flex justify-center">
 <span className="inline-block py-1 px-3 rounded-full border border-border bg-background/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-foreground shadow-sm">
 <span className="inline-block w-2 h-2 rounded-full bg-neon-accent mr-2 animate-pulse"></span>
 Collab Hub v2.0
 </span>
 </motion.div>

 <motion.h1 
 variants={item}
 className="text-[12vw] sm:text-[8vw] md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-foreground uppercase mb-8"
 >
 <span className="block hover:translate-x-1 hover:-translate-y-1 hover:text-neon-accent transition-all duration-300">Build.</span>
 <span className="block hover:translate-x-1 hover:-translate-y-1 hover:text-neon-accent transition-all duration-300">Create.</span>
 <span className="block hover:translate-x-1 hover:-translate-y-1 hover:text-neon-accent transition-all duration-300">Together.</span>
 </motion.h1>

 <motion.p 
 variants={item}
 className="text-muted-foreground font-medium text-sm md:text-lg max-w-2xl mx-auto mb-12 tracking-wide"
 >
 THE ULTIMATE NETWORK STATE FOR NEXT-GEN BUILDERS. NO NOISE, JUST PURE COLLABORATION AND DISCOVERY.
 </motion.p>

 <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg">
 Start Building Free
 </Button>
 <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg">
 View Manifesto
 </Button>
 </motion.div>
 </motion.div>
 </section>
 );
}
