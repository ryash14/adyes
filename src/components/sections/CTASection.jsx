import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function CTASection() {
 return (
 <section className="py-32 px-4 md:px-8 bg-background relative overflow-hidden flex flex-col items-center justify-center text-center">
 {/* Background elements */}
 <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
 <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-accent/20 via-background to-background"></div>
 </div>
 
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="relative z-10 max-w-4xl mx-auto"
 >
 <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-foreground mb-8">
 Ready to <span className="text-neon-accent">Launch?</span>
 </h2>
 <p className="text-muted-foreground text-lg md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
 Join 10,000+ builders creating the future. Don't get left behind.
 </p>
 
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Button variant="primary" size="lg" className="text-xl px-12 h-16 shadow-brutal-lg hover:shadow-brutal-hover">
 Get Started Now
 </Button>
 </div>
 </motion.div>
 </section>
 );
}
