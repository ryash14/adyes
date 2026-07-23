import React from 'react';
import { Fade, GlowCard } from '../ui/Animations';
import { Target, CheckCircle2 } from 'lucide-react';

export const CapabilitiesSection = () => (
  <section className="py-28 px-6 bg-slate-50 dark:bg-[#050608] transition-colors duration-500">
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
      <Fade>
        <div className="lg:sticky lg:top-40">
          <h2 className="text-[28px] md:text-[40px] font-semibold text-slate-900 dark:text-white tracking-[-0.03em] leading-[1.1] mb-2 transition-colors duration-500">What else can adyes do?</h2>
          <h2 className="text-[28px] md:text-[40px] font-semibold text-slate-900 dark:text-white tracking-[-0.03em] leading-[1.1] mb-6 transition-colors duration-500">
            <span className="text-slate-400 dark:text-white/40">It can find you a CTO.</span>
          </h2>
          <p className="text-[18px] text-slate-500 dark:text-white/20 leading-[1.8] mb-1 font-medium tracking-tight transition-colors duration-500">Validate market fit. Analyze competitors.</p>
          <p className="text-[18px] text-slate-500 dark:text-white/20 leading-[1.8] mb-1 font-medium tracking-tight transition-colors duration-500">Match you with designers. Create workspaces.</p>
          <p className="text-[18px] text-slate-500 dark:text-white/20 leading-[1.8] mb-1 font-medium tracking-tight transition-colors duration-500">Manage tasks. Share files. Run sprints.</p>
          <p className="text-[18px] text-slate-500 dark:text-white/20 leading-[1.8] mb-1 font-medium tracking-tight transition-colors duration-500">Track project velocity. Score ideas.</p>
          <p className="text-[18px] text-slate-500 dark:text-white/20 leading-[1.8] mb-8 font-medium tracking-tight transition-colors duration-500">And much, much more.</p>
        </div>
      </Fade>

      <Fade delay={0.2}>
        <GlowCard>
          <div className="p-8">
            <div className="rounded-[16px] bg-white dark:bg-[#0a0d12] border border-slate-200 dark:border-white/[0.05] overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-500">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.04] flex items-center gap-3 transition-colors">
                <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-[#FF6363]/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-[#FF6363]" /></div>
                <span className="text-[13px] text-slate-500 dark:text-white/40 font-medium tracking-tight">Project Dashboard</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2.5"><Target size={15} className="text-[#FF6363]/80" /><span className="text-[13px] text-slate-700 dark:text-white/70 font-medium">Sprint 4 — Week 2</span></div>
                  <span className="text-[11px] text-green-600 dark:text-green-400/80 font-semibold px-2 py-1 rounded-md bg-green-100 dark:bg-green-400/10 border border-green-200 dark:border-green-400/20">On Track</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'Tasks', v: '24/31' }, { l: 'Velocity', v: '94' }, { l: 'Team', v: '5' }].map(s => (
                    <div key={s.l} className="p-3.5 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/[0.03] text-center transition-colors">
                      <p className="text-[20px] text-slate-800 dark:text-white/80 font-semibold tracking-tight">{s.v}</p>
                      <p className="text-[11px] text-slate-500 dark:text-white/30 mt-1 font-medium">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Implement OAuth2 flow', 'Design onboarding screens', 'Set up CI/CD pipeline'].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className={`w-5 h-5 rounded-[6px] border ${i === 0 ? 'bg-green-100 border-green-200 dark:bg-green-500/20 dark:border-green-500/30' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]'} flex items-center justify-center transition-colors`}>
                        {i === 0 && <CheckCircle2 size={12} className="text-green-500 dark:text-green-400" />}
                      </div>
                      <span className={`text-[13px] font-medium transition-colors ${i === 0 ? 'text-slate-400 dark:text-white/20 line-through' : 'text-slate-700 dark:text-white/60'}`}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlowCard>
      </Fade>
    </div>
  </section>
);
