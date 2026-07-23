import React, { useRef, useCallback } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';

export const Fade = ({ children, delay = 0, yOffset = 20, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ type: "spring", stiffness: 60, damping: 22, delay }}
      className={className}
    >{children}</motion.div>
  );
};

export const GlowCard = ({ children, className = '' }) => {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const onMove = useCallback(({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mx.set(clientX - left); my.set(clientY - top);
  }, [mx, my]);
  
  return (
    <div onMouseMove={onMove} onMouseLeave={() => { mx.set(-200); my.set(-200); }}
      className={`group relative rounded-2xl bg-white dark:bg-[#0e1219] border border-black/5 dark:border-white/[0.06] overflow-hidden shadow-sm dark:shadow-none transition-colors ${className}`}>
      {/* Light Mode Glow */}
      <motion.div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
        style={{ background: useMotionTemplate`radial-gradient(300px circle at ${mx}px ${my}px, rgba(0,0,0,0.03), transparent 70%)` }} />
      {/* Dark Mode Glow */}
      <motion.div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
        style={{ background: useMotionTemplate`radial-gradient(300px circle at ${mx}px ${my}px, rgba(255,255,255,0.05), transparent 70%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
