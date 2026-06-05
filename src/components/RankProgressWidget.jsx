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
 <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm bg-card">
 {/* Gradient header strip */}
 <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.bg.replace('/20', '').replace('/10', '')}`} />

 {/* Subtle bg tint */}
 <div className={`absolute inset-0 bg-gradient-to-br ${tier.bg} pointer-events-none`} />

 <div className="relative z-10 p-5">
 {/* Top row: icon + label */}
 <div className="flex items-center gap-3 mb-4">
 <div
 className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10"
 style={{
 background: `color-mix(in srgb, ${tier.hex} 15%, transparent)`,
 }}
 >
 {loading ? (
 <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
 ) : (
 <TierIcon
 size={20}
 strokeWidth={2}
 className={tier.color}
 />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
 Current Rank
 </p>
 {loading ? (
 <div className="h-5 w-24 bg-muted rounded animate-pulse" />
 ) : (
 <div className="flex items-baseline gap-2">
 <h3 className="text-base font-black tracking-tight text-foreground leading-none">
 {tier.label}
 </h3>
 <span className="text-[11px] font-semibold text-muted-foreground">
 {tier.subtitle}
 </span>
 </div>
 )}
 </div>
 {!loading && (
 <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
 {tierIdx + 1}/{TIERS.length}
 </span>
 )}
 </div>

 {/* Segmented tier track */}
 <div className="flex gap-1 mb-1.5">
 {TIERS.map((t, i) => {
 const reached = i <= tierIdx;
 const isCurrent = i === tierIdx;
 return (
 <motion.div
 key={t.id}
 className="flex-1 h-1.5 rounded-full"
 initial={{ scaleX: 0, opacity: 0 }}
 animate={{ scaleX: 1, opacity: 1 }}
 transition={{ delay: i * 0.05, duration: 0.3 }}
 style={{
 background: reached
 ? isCurrent
 ? t.hex
 : `color-mix(in srgb, ${t.hex} 50%, transparent)`
 : 'var(--muted)',
 boxShadow: isCurrent ? `0 0 6px color-mix(in srgb, ${t.hex} 60%, transparent)` : 'none',
 }}
 />
 );
 })}
 </div>

 {/* Tier abbreviation labels */}
 <div className="flex mb-4">
 {TIERS.map((t, i) => (
 <span
 key={t.id}
 className="flex-1 text-center text-[8px] font-bold uppercase tracking-wider transition-colors"
 style={{
 color: i <= tierIdx ? t.hex : 'var(--muted-foreground)',
 opacity: i <= tierIdx ? 1 : 0.4,
 }}
 >
 {t.label.slice(0, 3)}
 </span>
 ))}
 </div>

 {/* Progress to next */}
 {!loading && nextTier && (
 <div className="bg-muted/60 rounded-xl p-3">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[11px] font-semibold text-muted-foreground">
 Next:{' '}
 <span className="font-bold text-foreground">{nextTier.label}</span>
 </span>
 <span className="text-[11px] font-bold tabular-nums" style={{ color: tier.hex }}>
 {Math.round(progress * 100)}%
 </span>
 </div>
 <div className="w-full h-2 rounded-full bg-border overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${progress * 100}%` }}
 transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
 className="h-full rounded-full"
 style={{ background: tier.hex }}
 />
 </div>
 <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
 <ChevronRight size={10} />
 {tier.next}
 </p>
 </div>
 )}

 {!loading && !nextTier && (
 <div className="bg-muted/60 rounded-xl p-3 text-center">
 <p className="text-sm font-bold text-foreground">🚀 Max Rank — Pioneer</p>
 <p className="text-[11px] text-muted-foreground mt-1">You've reached the top. Inspire others.</p>
 </div>
 )}

 {loading && (
 <div className="bg-muted/60 rounded-xl p-3 space-y-2">
 <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
 <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
 </div>
 )}
 </div>
 </div>
 );
}
