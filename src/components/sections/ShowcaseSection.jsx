import React from 'react';
import { motion } from 'framer-motion';

export function ShowcaseSection() {
 return (
 <section className="py-24 px-4 md:px-8 bg-background relative z-10 overflow-hidden">
 <div className="max-w-6xl mx-auto">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mb-16 text-center"
 >
 <span className="text-neon-accent font-bold tracking-[0.2em] uppercase text-sm block mb-4">/ Showcase</span>
 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
 See It In Action.
 </h2>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5 }}
 className="relative aspect-video rounded-2xl border-4 border-border overflow-hidden shadow-brutal-lg bg-zinc-900 group"
 >
 {/* Mockup UI placeholder */}
 <div className="absolute inset-0 flex flex-col">
 {/* Header bar */}
 <div className="h-12 border-b-2 border-border bg-black flex items-center px-4 gap-2">
 <div className="w-3 h-3 rounded-full bg-red-500"></div>
 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
 <div className="w-3 h-3 rounded-full bg-green-500"></div>
 <div className="ml-4 h-6 w-64 bg-zinc-800 rounded-md"></div>
 </div>
 {/* Body */}
 <div className="flex-1 flex p-4 gap-4">
 <div className="w-48 h-full bg-zinc-800 rounded-lg border-2 border-border animate-pulse hidden md:block"></div>
 <div className="flex-1 h-full bg-zinc-800 rounded-lg border-2 border-border animate-pulse delay-75"></div>
 <div className="w-64 h-full bg-zinc-800 rounded-lg border-2 border-border animate-pulse delay-150 hidden lg:block"></div>
 </div>
 </div>
 
 <div className="absolute inset-0 bg-neon-accent/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500"></div>
 </motion.div>
 </div>
 </section>
 );
}
