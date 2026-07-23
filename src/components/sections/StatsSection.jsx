import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Fade } from '../ui/Animations';

const Counter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0; const inc = value / 100;
    const t = setInterval(() => { s += inc; if (s >= value) { setCount(value); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [inView, value]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const StatsSection = () => {
  return (
    <section className="py-24 px-6 border-y border-white/5 bg-[#000000] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent blur-[80px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        {[
          { val: 10000, suf: '+', label: 'Active Builders' },
          { val: 5400, suf: '+', label: 'Ideas Validated' },
          { val: 1200, suf: '+', label: 'Projects Shipped' },
          { val: 98, suf: '%', label: 'Uptime' },
        ].map((s, i) => (
          <Fade key={s.label} delay={i * 0.1}>
            <div className="text-center group">
              <div className="text-[48px] md:text-[64px] font-bold tracking-tighter text-white leading-none mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500">
                <Counter value={s.val} suffix={s.suf} />
              </div>
              <p className="text-[#888888] text-[15px] font-medium tracking-wide uppercase">{s.label}</p>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
};
