import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Atom, Lightbulb, Hammer, Beaker, BookOpen, Rocket, ChevronRight } from 'lucide-react';

const TIERS = [
 {
 id: 'IOTA',
 label: 'IOTA',
 subtitle: 'Explorer',
 icon: Atom,
 icon: Atom,
 color: 'text-slate-500 dark:text-slate-400',
 hex: '#64748b',
 bg: 'from-slate-400/20 to-slate-500/10',
 condition: () => true,
 next: 'Share your first idea to level up',
 progress: ({ ideas }) => Math.min(ideas / 1, 0.99),
 },
 {
 id: 'EUREKA',
 label: 'EUREKA',
 subtitle: 'Ideator',
 icon: Lightbulb,
 color: 'text-amber-600 dark:text-yellow-400',
 hex: '#eab308',
 bg: 'from-yellow-400/20 to-amber-500/10',
 condition: ({ ideas }) => ideas >= 3,
 next: 'Post 10 ideas or projects combined',
 progress: ({ ideas, projects }) => Math.min((ideas + projects) / 10, 0.99),
 },
 {
 id: 'FORGE',
 label: 'FORGE',
 subtitle: 'Builder',
 icon: Hammer,
 color: 'text-orange-600 dark:text-orange-400',
 hex: '#f97316',
 bg: 'from-orange-400/20 to-orange-600/10',
 condition: ({ ideas, projects }) => ideas + projects >= 10,
 next: 'Make 5 connections',
 progress: ({ connections }) => Math.min(connections / 5, 0.99),
 },
 {
 id: 'NEWTON',
 label: 'NEWTON',
 subtitle: 'Innovator',
 icon: Beaker,
 color: 'text-sky-600 dark:text-sky-400',
 hex: '#0ea5e9',
 bg: 'from-sky-400/20 to-blue-500/10',
 condition: ({ connections }) => connections >= 5,
 next: 'Reach 15 ideas + 10 connections',
 progress: ({ ideas, connections }) =>
 Math.min((Math.min(ideas, 15) / 15 + Math.min(connections, 10) / 10) / 2, 0.99),
 },
 {
 id: 'KALAAM',
 label: 'KALAAM',
 subtitle: 'Visionary',
 icon: BookOpen,
 color: 'text-purple-600 dark:text-purple-400',
 hex: '#a855f7',
 bg: 'from-violet-400/20 to-purple-500/10',
 condition: ({ ideas, connections }) => ideas >= 15 && connections >= 10,
 next: '25 connections + 25 ideas/projects total',
 progress: ({ ideas, projects, connections }) =>
 Math.min(
 (Math.min(connections, 25) / 25 + Math.min(ideas + projects, 25) / 25) / 2,
 0.99
 ),
 },
 {
 id: 'VIKRAM',
 label: 'VIKRAM',
 subtitle: 'Pioneer',
 icon: Rocket,
 color: 'text-emerald-600 dark:text-emerald-400',
 hex: '#10b981',
 bg: 'from-lime-400/20 to-emerald-500/10',
 condition: ({ ideas, projects, connections }) => connections >= 25 && (ideas + projects) >= 25,
 next: null,
 progress: () => 1,
 },
];

function getTierIndex(stats) {
 let idx = 0;
 for (let i = TIERS.length - 1; i >= 0; i--) {
 if (TIERS[i].condition(stats)) { idx = i; break; }
 }
 return idx;
}

export default function RankProgressWidget({ stats = {}, loading = false }) {
 const tierIdx = useMemo(() => getTierIndex(stats), [stats]);
 const tier = TIERS[tierIdx];
 const nextTier = TIERS[tierIdx + 1] || null;
 const progress = useMemo(() => {
 if (tierIdx >= TIERS.length - 1) return 1;
 return TIERS[tierIdx].progress(stats);
 }, [stats, tierIdx]);
 const TierIcon = tier.icon;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:bg-card/60 group">
      {/* Top glowing orb */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-30 transition-all duration-1000 group-hover:opacity-60"
        style={{ background: tier.hex }}
      />
      
      {/* Subtle bottom glow */}
      <div 
        className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-all duration-1000"
        style={{ background: tier.hex }}
      />

      <div className="relative z-10 p-6 md:p-8">
        {/* Top row: icon + label */}
        <div className="flex items-start gap-4 mb-8">
          <div className="relative">
            {/* Glowing ring behind icon */}
            <motion.div 
              className="absolute inset-0 rounded-2xl opacity-50 blur-md"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: tier.hex }}
            />
            <div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md"
              style={{
                background: `color-mix(in srgb, ${tier.hex} 20%, rgba(255,255,255,0.05))`,
              }}
            >
              {loading ? (
                <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
              ) : (
                <TierIcon
                  size={28}
                  strokeWidth={2.5}
                  className={tier.color}
                  style={{ filter: `drop-shadow(0 0 8px ${tier.hex})` }}
                />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Current Status
            </p>
            {loading ? (
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
            ) : (
              <div className="flex flex-col">
                <h3 className="text-2xl font-black tracking-tight text-foreground leading-none mb-1">
                  {tier.label}
                </h3>
                <span className="text-sm font-semibold text-muted-foreground/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tier.hex }} />
                  {tier.subtitle}
                </span>
              </div>
            )}
          </div>
          
          {!loading && (
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black tracking-tighter" style={{ color: tier.hex }}>
                {tierIdx + 1}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                of {TIERS.length}
              </span>
            </div>
          )}
        </div>

        {/* Segmented tier track */}
        <div className="flex gap-1.5 mb-2">
          {TIERS.map((t, i) => {
            const reached = i <= tierIdx;
            const isCurrent = i === tierIdx;
            return (
              <motion.div
                key={t.id}
                className="flex-1 h-2 rounded-full relative overflow-hidden"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                style={{
                  background: 'var(--muted)',
                }}
              >
                <motion.div 
                  className="absolute inset-0 w-full h-full"
                  initial={{ x: '-100%' }}
                  animate={{ x: reached ? '0%' : '-100%' }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: isCurrent 
                      ? `linear-gradient(90deg, ${t.hex}, color-mix(in srgb, ${t.hex} 70%, white))`
                      : `color-mix(in srgb, ${t.hex} 40%, transparent)`,
                    boxShadow: isCurrent ? `0 0 10px ${t.hex}` : 'none',
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Tier abbreviation labels */}
        <div className="flex mb-8">
          {TIERS.map((t, i) => (
            <span
              key={t.id}
              className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                color: i <= tierIdx ? t.hex : 'var(--muted-foreground)',
                opacity: i <= tierIdx ? 1 : 0.3,
                textShadow: i === tierIdx ? `0 0 8px color-mix(in srgb, ${t.hex} 50%, transparent)` : 'none'
              }}
            >
              {t.label.slice(0, 3)}
            </span>
          ))}
        </div>

        {/* Progress to next */}
        {!loading && nextTier && (
          <div className="bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                Next Rank:
                <span className="font-bold text-foreground bg-background/50 px-2.5 py-0.5 rounded-md border border-border/50">
                  {nextTier.label}
                </span>
              </span>
              <span className="text-sm font-black tabular-nums" style={{ color: tier.hex }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
            
            <div className="w-full h-2.5 rounded-full bg-background border border-border/50 overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                className="absolute top-0 left-0 bottom-0 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${tier.hex}, ${nextTier.hex})`,
                  boxShadow: `0 0 10px ${tier.hex}`
                }}
              >
                {/* Shimmer effect on bar */}
                <motion.div 
                  className="absolute top-0 bottom-0 left-0 right-0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                  }}
                />
              </motion.div>
            </div>
            
            <div className="flex items-center gap-2 mt-3 p-2.5 bg-background/30 rounded-xl border border-white/5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-background shrink-0" style={{ color: tier.hex }}>
                <ChevronRight size={14} strokeWidth={3} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground/90 leading-tight">
                {tier.next}
              </p>
            </div>
          </div>
        )}

        {!loading && !nextTier && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center relative overflow-hidden group-hover:bg-emerald-500/20 transition-colors">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-8 -top-8 text-emerald-500/10"
            >
              <Rocket size={120} />
            </motion.div>
            <p className="text-lg font-black text-emerald-500 mb-1 flex items-center justify-center gap-2 relative z-10">
              <Rocket size={20} className="animate-bounce" /> 
              Max Rank — Pioneer
            </p>
            <p className="text-sm font-semibold text-emerald-600/70 dark:text-emerald-400/70 relative z-10">
              You've reached the top. Inspire others.
            </p>
          </div>
        )}

        {loading && (
          <div className="bg-secondary/30 rounded-2xl p-5 space-y-3 border border-white/5">
            <div className="h-3 w-full bg-white/10 rounded-full animate-pulse" />
            <div className="h-4 w-2/3 bg-white/10 rounded-lg animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
