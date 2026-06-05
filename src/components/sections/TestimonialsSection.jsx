import React from 'react';

const testimonials = [
"THE CLEANEST UI I'VE SEEN.",
"FINALLY, A TOOL FOR ACTUAL BUILDERS.",
"COLLAB HUB CHANGED HOW WE SHIP.",
"NO MORE CLUTTER. JUST SPEED.",
"THE NEXT GENERATION OF NETWORKING.",
"INSANE PERFORMANCE."
];

export function TestimonialsSection() {
 return (
 <section className="py-12 bg-neon-accent border-y-4 border-black overflow-hidden select-none z-20 shadow-[0_8px_0_0_#000] -rotate-1 origin-center transition-colors duration-100">
 <div className="whitespace-nowrap animate-marquee flex items-center h-full">
 {/* Duplicate the array to create a seamless infinite loop */}
 {[...testimonials, ...testimonials, ...testimonials].map((text, idx) => (
 <span key={idx} className="text-black font-black text-[15px] md:text-[20px] tracking-[0.3em] mx-8 uppercase flex items-center shrink-0">
 <span className="text-[14px] mx-6">✦</span>
 {text}
 </span>
 ))}
 </div>
 </section>
 );
}
