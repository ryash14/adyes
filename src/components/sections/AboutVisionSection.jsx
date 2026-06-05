import React from 'react';
import { motion } from 'framer-motion';

export function AboutVisionSection() {
 return (
 <section className="py-32 px-4 md:px-8 bg-neon-accent text-black relative z-10 border-y-2 border-black">
 <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-center">
 <motion.div 
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="flex-1"
 >
 <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
 We Refuse <br/> To Build <br/> Boring.
 </h2>
 </motion.div>
 
 <motion.div 
 initial={{ opacity: 0, x: 50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="flex-1"
 >
 <p className="text-xl md:text-2xl font-medium leading-relaxed font-mono">
 The era of cluttered, noisy, and uninspiring collaboration tools is over. 
 We are building a network state where design meets utility. 
 A platform that feels like magic and works like a machine.
 </p>
 <div className="mt-8 pt-8 border-t-2 border-black/20 flex gap-12">
 <div>
 <div className="text-4xl font-black">10k+</div>
 <div className="text-sm font-bold uppercase tracking-widest mt-1">Builders</div>
 </div>
 <div>
 <div className="text-4xl font-black">150+</div>
 <div className="text-sm font-bold uppercase tracking-widest mt-1">Countries</div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}
