import React from 'react';
import { Fade, GlowCard } from '../ui/Animations';
import { Brain, Users, MessageCircle, BarChart3, ArrowUpRight } from 'lucide-react';

const extensionCards = [
  { icon: Brain, name: 'AI Validation', desc: 'Submit ideas and get instant AI analysis with originality scoring and market intelligence.', color: '#FF6363', preview: (
    <div className="space-y-2 mt-4">
      <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden transition-colors"><div className="h-full w-[94%] bg-gradient-to-r from-green-500/40 to-green-400/20 rounded-full" /></div>
      <div className="flex justify-between text-[10px]"><span className="text-slate-500 dark:text-white/30">Originality</span><span className="text-green-600 dark:text-green-400/80 font-medium">94%</span></div>
      <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden mt-3 transition-colors"><div className="h-full w-[82%] bg-gradient-to-r from-blue-500/40 to-blue-400/20 rounded-full" /></div>
      <div className="flex justify-between text-[10px]"><span className="text-slate-500 dark:text-white/30">Demand</span><span className="text-blue-600 dark:text-blue-400/80 font-medium">High</span></div>
    </div>
  )},
  { icon: Users, name: 'Builder Discovery', desc: 'Find co-founders by what they\'ve actually built. Portfolio-verified, skill-matched.', color: '#818CF8', preview: (
    <div className="flex items-center mt-4">
      <div className="flex -space-x-2">
        {[...Array(5)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gradient-to-br dark:from-white/[0.08] dark:to-white/[0.02] border-2 border-white dark:border-[#0e1219] transition-colors" />)}
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0a0d12] border-2 border-white dark:border-[#0e1219] flex items-center justify-center text-[9px] font-medium text-slate-500 dark:text-white/40 transition-colors">+2k</div>
      </div>
    </div>
  )},
  { icon: MessageCircle, name: 'Team Chat', desc: 'End-to-end encrypted messaging with threads, reactions, and file sharing built in.', color: '#34D399', preview: (
    <div className="space-y-2 mt-4">
      <div className="flex gap-2 items-center"><div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/15" /><div className="h-[22px] bg-slate-100 dark:bg-white/[0.04] rounded-[8px] flex-1 border border-slate-200 dark:border-white/[0.02] transition-colors" /></div>
      <div className="flex gap-2 items-center justify-end"><div className="h-[22px] bg-red-100 dark:bg-[#FF6363]/10 border border-red-200 dark:border-[#FF6363]/10 rounded-[8px] w-3/4 transition-colors" /></div>
    </div>
  )},
  { icon: BarChart3, name: 'Analytics', desc: 'Track idea traction, builder engagement, and project velocity in real-time dashboards.', color: '#F59E0B', preview: (
    <div className="flex items-end gap-1.5 mt-4 h-12">
      {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
        <div key={i} className="flex-1 bg-gradient-to-t from-amber-200/50 dark:from-amber-500/20 to-transparent dark:to-amber-500/5 rounded-t-sm transition-colors" style={{ height: `${h}%` }} />
      ))}
    </div>
  )},
];

export const FeatureExtensionsSection = () => (
  <section id="features" className="py-28 px-6 bg-slate-50 dark:bg-[#050608] transition-colors duration-500">
    <div className="max-w-[1200px] mx-auto">
      <Fade>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-semibold text-slate-900 dark:text-white tracking-[-0.03em] leading-[1.1] mb-3 transition-colors duration-500">There's a tool for that.</h2>
            <p className="text-slate-500 dark:text-white/30 text-[16px] leading-[1.6] max-w-md font-medium transition-colors duration-500">Every feature designed to eliminate friction between having an idea and shipping a product.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Validation', 'Network', 'Workspace'].map((t, i) => (
              <button key={t} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${i === 0 ? 'bg-slate-200 dark:bg-white/[0.08] text-slate-900 dark:text-white/90 border border-slate-300 dark:border-white/[0.04]' : 'text-slate-500 dark:text-white/30 hover:text-slate-900 dark:hover:text-white/60 hover:bg-slate-200 dark:hover:bg-white/[0.03]'}`}>{t}</button>
            ))}
          </div>
        </div>
      </Fade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {extensionCards.map((card, i) => (
          <Fade key={card.name} delay={i * 0.08}>
            <GlowCard className="h-full">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-white dark:bg-transparent shadow-sm dark:shadow-none" style={{ backgroundColor: `var(--tw-dark) ? ${card.color}15 : undefined`, borderColor: card.color + '20', borderWidth: 1 }}>
                      <card.icon size={16} style={{ color: card.color }} />
                    </div>
                    <span className="text-[14px] text-slate-800 dark:text-white/90 font-semibold tracking-tight transition-colors duration-500">{card.name}</span>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400 dark:text-white/15 group-hover:text-slate-600 dark:group-hover:text-white/40 transition-colors" />
                </div>
                <p className="text-[13px] text-slate-600 dark:text-white/30 leading-[1.6] transition-colors duration-500">{card.desc}</p>
                <div className="mt-auto">{card.preview}</div>
              </div>
            </GlowCard>
          </Fade>
        ))}
      </div>
    </div>
  </section>
);
