import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Fade } from '../ui/Animations';
import { 
  Inbox, CheckCircle2, Circle, Zap, Users, ShieldCheck, 
  Search, ChevronDown, Clock, Star, Bell, MoreHorizontal, 
  GitPullRequest, MessageSquare, Terminal, Layout, Activity, Link,
  Send, UserPlus, Code2, Network, ArrowRight
} from 'lucide-react';

// --- LINEAR STYLE COMPONENTS ---

const TypewriterText = ({ text, inView, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (inView) {
      let i = 0;
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (i < text.length) {
            setDisplayed(text.substring(0, i + 1));
            i++;
          } else {
            clearInterval(interval);
          }
        }, 15);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setDisplayed('');
    }
  }, [inView, text, delay]);

  return <span className="font-mono text-[11px] text-white/50">{displayed}</span>;
};

const SequentialActivityTasks = ({ inView }) => {
  const tasks = [
    { id: 1, text: "Idea originality validated by Adyes Agent (94%)", time: "4 min ago" },
    { id: 2, text: "Market demand analysis completed (High Demand)", time: "3 min ago" },
    { id: 3, text: "Sarah Jenkins accepted technical co-founder invite", time: "Just now", wait: true },
    { id: 4, text: "Alex Lee (Full Stack) joined the workspace", time: "Just now", wait: true, delayExtra: 800 }
  ];

  const [completed, setCompleted] = useState([1, 2]);

  useEffect(() => {
    if (inView) {
      const t1 = setTimeout(() => setCompleted(prev => [...prev, 3]), 2500);
      const t2 = setTimeout(() => setCompleted(prev => [...prev, 4]), 3800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setCompleted([1, 2]);
    }
  }, [inView]);

  return (
    <div className="space-y-6 mt-4 relative">
      <div className="absolute left-[13px] top-4 bottom-4 w-[1px] bg-white/[0.04]" />
      
      {tasks.map((task, idx) => {
        const isDone = completed.includes(task.id);
        if (task.wait && !isDone) return null;

        return (
          <motion.div 
            key={task.id}
            initial={task.wait ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 relative z-10"
          >
            <div className="w-[28px] h-[28px] rounded-full bg-[#121315] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
               {idx < 2 ? <Zap size={12} className="text-white/40" /> : <Users size={12} className="text-white/40" />}
            </div>
            <div className="pt-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-white/80">{task.text}</span>
                <span className="text-[11px] text-white/30">{task.time}</span>
              </div>
            </div>
          </motion.div>
        );
      })}

      {!completed.includes(4) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-start gap-4 relative z-10"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#121315] border border-white/[0.08] flex items-center justify-center shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
          </div>
          <div className="pt-2">
            <span className="text-[13px] text-white/40 italic">Waiting for builders to accept invites...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- SUB-VIEWS FOR INTERACTIVE PROTOTYPE ---

const WorkspaceView = ({ inView }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 max-w-[640px]">
    <h2 className="text-[24px] font-semibold text-white/90 mb-4 tracking-tight">AI Workflow Automator</h2>
    <p className="text-[14px] text-white/60 leading-relaxed mb-8">
      Validate market demand using the <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-white/70 text-[12px] font-mono">adyes_agent</code> before writing code, 
      then automatically match with Senior Backend Engineers to architect the RAG pipeline.
    </p>

    <div className="mb-6">
      <h3 className="text-[14px] font-semibold text-white/90 mb-4">Live Activity</h3>
      <SequentialActivityTasks inView={inView} />
    </div>

    <div className="mt-8 rounded-lg border border-white/[0.08] bg-[#0E0F11] p-3 flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6363] to-purple-500 shrink-0" />
      <input 
        type="text" 
        placeholder="Leave a comment or type '@' to mention..." 
        className="bg-transparent border-none outline-none text-[13px] text-white/80 w-full pt-0.5 placeholder:text-white/30"
        readOnly
      />
    </div>
  </motion.div>
);

const BuildersView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 max-w-[800px]">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-[24px] font-semibold text-white/90 mb-2 tracking-tight">Co-founder Matches</h2>
        <p className="text-[14px] text-white/50">Based on required skills for AI Workflow Automator</p>
      </div>
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-1.5 text-[12px] text-white/60">
        <FilterIcon /> 98% Match Threshold
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {[
        { name: "Sarah Jenkins", role: "Lead AI Engineer", match: "99%", skills: ["Python", "PyTorch", "LangChain"], status: "Invited" },
        { name: "Alex Lee", role: "Full Stack Developer", match: "96%", skills: ["React", "Node.js", "PostgreSQL"], status: "Accepted" },
        { name: "David Chen", role: "Product Designer", match: "91%", skills: ["Figma", "UI/UX", "Framer"], status: "Connect" },
        { name: "Emily Wang", role: "Backend Systems", match: "89%", skills: ["Go", "Kubernetes", "AWS"], status: "Connect" }
      ].map((builder) => (
        <div key={builder.name} className="p-4 rounded-xl border border-white/[0.06] bg-[#0E0F11] hover:bg-white/[0.02] cursor-pointer transition-colors group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1F] border border-white/[0.1] flex items-center justify-center text-white/40 font-bold text-[14px]">
                {builder.name.charAt(0)}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{builder.name}</p>
                <p className="text-[12px] text-white/50">{builder.role}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{builder.match} Match</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {builder.skills.map(s => <span key={s} className="text-[10px] text-white/60 bg-white/[0.04] px-1.5 py-0.5 rounded">{s}</span>)}
          </div>
          <button className={`w-full py-1.5 rounded-md text-[12px] font-semibold transition-colors ${builder.status === 'Connect' ? 'bg-white text-black hover:bg-white/90' : 'bg-white/[0.04] text-white/40'}`}>
            {builder.status}
          </button>
        </div>
      ))}
    </div>
  </motion.div>
);

const InboxView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col max-w-[700px] h-full border border-white/[0.06] rounded-xl bg-[#0E0F11] overflow-hidden">
    <div className="h-14 border-b border-white/[0.04] flex items-center px-4 bg-white/[0.01]">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-white/90"># backend-architecture</span>
        <span className="text-[12px] text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded">3 Members</span>
      </div>
    </div>
    
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-[#FF6363]/20 flex items-center justify-center text-[#FF6363] text-[12px] font-bold shrink-0">Y</div>
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[13px] font-semibold text-white/90">Yashwanth</span>
            <span className="text-[11px] text-white/30">10:42 AM</span>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed">Hey team! I've set up the initial repo for the AI Workflow Automator. Should we use Postgres or a dedicated Vector DB for the RAG pipeline?</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[12px] font-bold shrink-0">SJ</div>
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[13px] font-semibold text-white/90">Sarah Jenkins</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 rounded">LEAD AI ENG</span>
            <span className="text-[11px] text-white/30">10:45 AM</span>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed">Let's go with Pinecone for the Vector DB. It scales much better for our expected embedding workload. I can start setting up the LangChain connectors this afternoon.</p>
        </div>
      </div>
    </div>

    <div className="p-4 border-t border-white/[0.04] bg-[#121315]">
      <div className="bg-[#1C1C1F] border border-white/[0.08] rounded-lg flex items-center p-2">
        <input type="text" placeholder="Message #backend-architecture..." className="flex-1 bg-transparent border-none outline-none text-[13px] text-white/80 px-2 placeholder:text-white/30" readOnly />
        <button className="w-8 h-8 rounded-md bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-white/60 transition-colors"><Send size={14}/></button>
      </div>
    </div>
  </motion.div>
);

const FilterIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

export const HeroSection = ({ navigate }) => {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: false, margin: "-10%" });
  const [showOpus, setShowOpus] = useState(false);
  const [activeView, setActiveView] = useState('workspace'); // 'workspace', 'network', 'inbox'

  useEffect(() => {
    if (inView && activeView === 'workspace') {
      const t = setTimeout(() => setShowOpus(true), 1500);
      return () => clearTimeout(t);
    } else {
      setShowOpus(false);
    }
  }, [inView, activeView]);

  return (
    <section className="relative w-full min-h-[140svh] pt-[120px] pb-32 flex flex-col bg-[#080808] overflow-hidden selection:bg-white/10 font-sans">
      
      {/* LEFT-ALIGNED HERO TYPOGRAPHY */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 mb-12">
        <div className="max-w-[700px]">
          <Fade yOffset={20}>
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.04em] leading-[1.08] text-[#F4F4F5] mb-5">
              The operating system for ambitious builders
            </h1>
          </Fade>
          <Fade delay={0.1} yOffset={16}>
            <p className="text-[16px] md:text-[18px] text-[#A1A1AA] leading-[1.6] max-w-[540px] mb-8 tracking-tight font-medium">
              Purpose-built for modern teams with AI workflows at its core. Go from idea validation to pushing production code in one unified interface.
            </p>
          </Fade>
          <Fade delay={0.2} yOffset={12}>
            <div className="flex items-center gap-5">
              <button onClick={() => navigate('/register')} className="h-10 px-5 rounded-full bg-[#EDEDED] text-black text-[13px] font-semibold tracking-[-0.01em] hover:bg-white transition-colors">
                Start Building
              </button>
              <button onClick={() => navigate('/discover')} className="text-[#A1A1AA] text-[13px] font-medium hover:text-white transition-colors flex items-center gap-1.5 group">
                Discover Startups <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </Fade>
        </div>
      </div>

      {/* OS MOCKUP - INTERACTIVE PROTOTYPE */}
      <div 
        ref={containerRef}
        className="w-[94vw] max-w-[1280px] mx-auto h-[75vh] min-h-[640px] max-h-[800px] bg-[#121315] border border-white/[0.06] rounded-[12px] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden flex relative z-20"
      >
        
        {/* LEFT SIDEBAR */}
        <div className="w-[240px] bg-[#0E0F11] border-r border-white/[0.04] flex flex-col shrink-0">
          <div className="h-[44px] flex items-center px-4 gap-2 hover:bg-white/[0.02] cursor-pointer transition-colors mt-2">
            <div className="w-5 h-5 rounded-[4px] bg-white/[0.08] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border-[2px] border-white/60 border-t-transparent rotate-45" />
            </div>
            <span className="text-[13px] font-medium text-white/90">Adyes Platform</span>
          </div>

          <div className="px-3 mt-4 space-y-0.5">
            {[
              { id: 'inbox', icon: Inbox, label: 'Inbox' },
              { id: 'network', icon: Network, label: 'Co-Founders' },
              { id: 'mentors', icon: Users, label: 'Mentorship' }
            ].map(item => (
              <div 
                key={item.id} 
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${activeView === item.id ? 'bg-white/[0.08] text-white' : 'hover:bg-white/[0.04] text-white/60 hover:text-white/90'}`}
              >
                <item.icon size={14} className={activeView === item.id ? "text-white" : "text-white/40"} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="px-3 mt-8 space-y-0.5">
            <div className="px-2 mb-2 flex items-center justify-between text-white/30 group">
              <span className="text-[11px] font-semibold tracking-wide uppercase">Workspace</span>
            </div>
            <div 
              onClick={() => setActiveView('workspace')}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${activeView === 'workspace' ? 'bg-white/[0.08] text-white' : 'hover:bg-white/[0.04] text-white/60 hover:text-white/90'}`}
            >
              <Terminal size={14} className={activeView === 'workspace' ? "text-white" : "text-white/40"} />
              <span className="text-[13px] font-medium">Validation Feed</span>
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 flex flex-col bg-[#121315] relative overflow-hidden">
          
          {/* Top Breadcrumb Header */}
          <div className="h-[44px] flex items-center px-6 border-b border-white/[0.04] shrink-0">
            <div className="flex items-center gap-2">
               <span className="text-[12px] font-medium text-white/50 hover:text-white/80 cursor-pointer transition-colors">ADYES Workspace</span>
               <span className="text-white/20">/</span>
               <span className="text-[12px] font-medium text-white/90">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 flex">
             <AnimatePresence mode="wait">
               {activeView === 'workspace' && <WorkspaceView key="workspace" inView={inView} />}
               {activeView === 'network' && <BuildersView key="builders" />}
               {activeView === 'inbox' && <InboxView key="inbox" />}
             </AnimatePresence>
             
             {/* Show attributes column only on workspace view */}
             {activeView === 'workspace' && (
               <div className="w-[240px] ml-16 flex flex-col gap-5 pt-2 hidden lg:flex">
                 <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="w-[18px] h-[18px] flex items-center justify-center"><Circle size={14} className="text-[#F59E0B] fill-[#F59E0B]/20" /></div>
                   <span className="text-[12px] font-medium text-white/60 group-hover:text-white/90 transition-colors">Validating Phase</span>
                 </div>
                 <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="w-[18px] h-[18px] flex items-center justify-center"><Activity size={14} className="text-white/40" /></div>
                   <span className="text-[12px] font-medium text-white/60 group-hover:text-white/90 transition-colors">94% Originality</span>
                 </div>
                 <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="w-[18px] h-[18px] rounded-full bg-[#121315] border border-white/10 flex items-center justify-center"><Users size={10} className="text-white/40" /></div>
                   <span className="text-[12px] font-medium text-white/60 group-hover:text-white/90 transition-colors">3 Active Members</span>
                 </div>
               </div>
             )}
          </div>

          {/* FLOATING AGENT PANEL (Only on Workspace View) */}
          <AnimatePresence>
            {showOpus && activeView === 'workspace' && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-8 right-8 w-[340px] bg-[#1C1C1F] border border-white/[0.08] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
              >
                <div className="h-9 px-3 flex items-center justify-between border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center"><div className="w-1 h-1 bg-black rounded-full" /></div>
                    <span className="text-[12px] font-medium text-white/80">Adyes <span className="text-white/40 font-normal">Agent</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-white/30">
                    <span className="text-[14px] cursor-pointer hover:text-white/60" onClick={() => setShowOpus(false)}>×</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center"><Zap size={10} className="text-green-400" /></div>
                    <p className="text-[12px] text-white/60">Automated validation complete</p>
                  </div>
                  <p className="text-[12px] text-white/80 font-medium">Scanned 14,000 recent repositories...</p>
                  <p className="text-[11px] text-white/40 italic">Worked for 12s ✧</p>
                  
                  <div className="pt-2 border-t border-white/[0.04]">
                    <p className="text-[12px] text-white/80 mb-2 font-medium">Found 2 matching co-founders. Actions taken:</p>
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono text-white/60"><TypewriterText text="• Sent invite: Sarah (Lead AI Eng)" inView={showOpus} delay={500} /></p>
                      <p className="text-[11px] font-mono text-white/60"><TypewriterText text="• Sent invite: Alex (Full Stack)" inView={showOpus} delay={1800} /></p>
                    </div>
                  </div>
                </div>

                <div className="m-3 mt-0 p-2 rounded-md bg-[#27272A] border border-white/[0.04] flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Tell Adyes what to do next...</span>
                  <div className="flex items-center gap-2">
                    <Search size={12} className="text-white/30" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};
