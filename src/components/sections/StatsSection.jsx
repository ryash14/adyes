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

export const StatsSection = () => (
  <section className="py-24 px-6 border-y border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-[#050608] transition-colors duration-500">
    <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { val: 10000, suf: '+', label: 'Active Builders' },
        { val: 5400, suf: '+', label: 'Ideas Validated' },
        { val: 1200, suf: '+', label: 'Projects Shipped' },
        { val: 98, suf: '%', label: 'Uptime' },
      ].map((s, i) => (
        <Fade key={s.label} delay={i * 0.06}>
          <div className="text-center">
            <div className="text-[40px] md:text-[56px] font-bold tracking-[-0.04em] text-slate-900 dark:text-white leading-none mb-2 transition-colors duration-500"><Counter value={s.val} suffix={s.suf} /></div>
            <p className="text-slate-500 dark:text-white/30 text-[13px] font-medium transition-colors duration-500">{s.label}</p>
          </div>
        </Fade>
      ))}
    </div>
  </section>
);
