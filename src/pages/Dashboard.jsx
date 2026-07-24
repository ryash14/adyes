import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { contentService } from '../services/content.service';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, Rocket, Users, Activity, ArrowRight, Clock, 
  CheckCircle2, TrendingUp, Sparkles, Plus, Search, 
  MessageSquare, MoreHorizontal, FileText, ChevronRight
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '../utils/cn';
import { RainbowButton } from '../components/ui/rainbow-button';
import { WarpBackground } from '../components/ui/warp-background';
import { ShineBorder } from '../components/ui/shine-border';
import MouseEffectCard from '../components/kokonutui/mouse-effect-card';
import { LiquidGlassCard } from '../components/kokonutui/liquid-glass-card';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
};

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) { setCount(end); return; }
    const totalDuration = 900;
    const incrementTime = totalDuration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) { setCount(end); clearInterval(timer); }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

const Sparkline = ({ colorClass }) => (
  <svg className="w-full h-12 mt-2 opacity-50 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
    <path
      d="M0 25 C 20 25, 20 5, 40 15 C 60 25, 70 5, 100 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={colorClass}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 25 C 20 25, 20 5, 40 15 C 60 25, 70 5, 100 10 L 100 30 L 0 30 Z"
      className={cn("fill-current opacity-10", colorClass)}
    />
  </svg>
);

const STAT_CARDS = [
  { label: 'Active Ideas', key: 'ideas', icon: Lightbulb, color: 'text-accent', trend: '+12% this week' },
  { label: 'Projects Shipped', key: 'projects', icon: Rocket, color: 'text-blue-500', trend: '+2 new projects' },
  { label: 'Network Growth', key: 'connections', icon: Users, color: 'text-emerald-500', trend: '+5 connections' },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ideas: 0, projects: 0, connections: 0 });
  const [loading, setLoading] = useState(true);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [pendingIdeas, setPendingIdeas] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!profile?.id) return;
        const [ideasRes, projectsRes, connRes] = await Promise.all([
          contentService.getUserIdeas(profile.id),
          contentService.getUserProjects(profile.id),
          import('../services/connection.service').then(m => m.connectionService.getUserConnections(profile.id))
        ]);
        const allIdeas = ideasRes.data || [];
        const allProjects = projectsRes.data || [];
        setStats({ ideas: allIdeas.length, projects: allProjects.length, connections: connRes.data?.length || 0 });
        setRecentIdeas(allIdeas.slice(0, 4));

        if (profile.role === 'mentor') {
          const pendingRes = await contentService.getPendingIdeasForMentor(profile.id);
          setPendingIdeas(pendingRes.data || []);
        }

        // Aggregate Real Activities
        const recentActivities = [];
        allIdeas.slice(0, 2).forEach(idea => {
          recentActivities.push({
            id: idea.id,
            type: 'idea',
            title: 'Idea Posted',
            description: `Shared "${idea.title}"`,
            date: idea.createdAt?.seconds ? idea.createdAt.seconds * 1000 : Date.now(),
            icon: Lightbulb,
            color: 'bg-accent text-black',
          });
        });
        allProjects.slice(0, 2).forEach(proj => {
          recentActivities.push({
            id: proj.id,
            type: 'project',
            title: 'Project Live',
            description: `Deployed "${proj.title}"`,
            date: proj.createdAt?.seconds ? proj.createdAt.seconds * 1000 : Date.now(),
            icon: Rocket,
            color: 'bg-blue-500 text-white',
          });
        });
        (connRes.data || []).slice(0, 2).forEach(conn => {
          recentActivities.push({
            id: conn.id,
            type: 'connection',
            title: 'New Connection',
            description: `Connected with a builder`,
            date: conn.createdAt?.seconds ? conn.createdAt.seconds * 1000 : Date.now(),
            icon: Users,
            color: 'bg-emerald-500 text-white',
          });
        });

        // Sort by date descending
        recentActivities.sort((a, b) => b.date - a.date);
        setActivities(recentActivities);

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [profile?.id, profile?.role]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-8 pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative pt-4">

          {/* ── Premium Hero Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full rounded-2xl overflow-hidden mb-8 border border-border/40 shadow-2xl"
          >
            <div className="w-full p-8 md:p-12 lg:p-16 rounded-2xl bg-card flex flex-col md:flex-row md:items-end justify-between gap-8 border border-border/40 shadow-sm">
              <div className="max-w-[70%] relative z-10">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight mb-3">
                  {greeting()}, <br className="hidden md:block" /><span>{profile?.displayName?.split(' ')[0] || 'Explorer'}</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl font-medium">
                  Monitor your ideas, active projects, and network growth with real-time insights and premium metrics.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                <Button onClick={() => navigate('/discover?tab=ideas')} className="h-11 px-6 text-sm gap-2 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus size={16} /> New Concept
                </Button>
                <Button onClick={() => navigate('/discover')} variant="outline" className="h-11 px-6 text-sm bg-background border-border hover:bg-secondary rounded-xl transition-all">
                  Explore Network
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── Premium Bento Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STAT_CARDS.map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(s.key === 'connections' ? '/network' : `/discover?tab=${s.key}`)} 
                className="cursor-pointer h-full transition-all group"
              >
                <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border/50 bg-card hover:bg-accent/5 transition-colors duration-300">
                  <div className="relative z-10 p-6 flex flex-col justify-between h-full rounded-2xl">
                    <div className="flex items-center justify-between w-full mb-8">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-secondary border border-border shadow-inner group-hover:scale-105 transition-transform duration-300", s.color)}>
                          <s.icon size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-[11px] font-black text-muted-foreground tracking-widest uppercase">
                          {s.label}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-secondary">
                        <TrendingUp size={16} className={cn("opacity-80 group-hover:opacity-100 transition-opacity", s.color)} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-3">
                        <p className="text-5xl font-black tracking-tighter text-foreground tabular-nums drop-shadow-sm">
                          {loading ? (
                            <span className="inline-block w-20 h-12 bg-secondary rounded-lg animate-pulse" />
                          ) : (
                            <AnimatedNumber value={stats[s.key]} />
                          )}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground mt-3 bg-secondary inline-block px-2.5 py-1.5 rounded-lg border border-border/50 shadow-sm">
                        {s.trend}
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Main Dashboard Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Col: Data Tables */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Mentor Requests List */}
              {profile?.role === 'mentor' && pendingIdeas.length > 0 && (
                <LiquidGlassCard className="mb-6 p-6 border-emerald-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-black text-emerald-500 flex items-center gap-2 drop-shadow-sm">
                        <Sparkles size={20} /> Action Required: Mentor Review
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {pendingIdeas.map((idea) => (
                      <div key={idea.id} className="p-4 rounded-xl bg-card/60 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm group">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-foreground truncate group-hover:text-emerald-400 transition-colors">{idea.title}</h3>
                          <p className="text-xs font-semibold text-muted-foreground truncate mt-1">Requested by <span className="text-foreground">{idea.authorName}</span></p>
                        </div>
                        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-9 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-lg">
                            Decline
                          </Button>
                          <Button size="sm" className="flex-1 sm:flex-none h-9 text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-md rounded-lg">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </LiquidGlassCard>
              )}

              {/* Premium Recent Ideas List */}
              <LiquidGlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                    <FileText size={20} className="text-accent" /> Recent Ideas
                  </h2>
                  <button onClick={() => navigate(`/profile/${profile?.id}`)} className="text-[11px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-secondary">
                    View All <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-4 rounded-xl bg-card border border-border flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-secondary rounded" />
                          <div className="h-3 w-48 bg-secondary rounded" />
                        </div>
                        <div className="h-6 w-16 bg-secondary rounded-full" />
                      </div>
                    ))
                  ) : recentIdeas.length > 0 ? (
                    recentIdeas.map((idea) => (
                      <div key={idea.id} className="p-4 rounded-xl bg-card/40 border border-border/60 hover:border-accent/50 hover:bg-accent/5 transition-all group flex items-center justify-between cursor-pointer" onClick={() => navigate('/discover')}>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-bold text-foreground text-sm truncate group-hover:text-accent transition-colors">{idea.title}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">{idea.description}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          {idea.certified ? (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20 shadow-sm">
                              <Sparkles size={10} /> CERTIFIED
                            </span>
                          ) : (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold border border-border">
                              PENDING
                            </span>
                          )}
                          <div className="text-xs text-muted-foreground font-medium hidden md:block">
                            {new Date(idea.createdAt?.seconds ? idea.createdAt.seconds * 1000 : idea.createdAt).toLocaleDateString()}
                          </div>
                          <button className="p-2 rounded-lg text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center rounded-xl bg-secondary/30 border border-dashed border-border">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                        <Lightbulb size={32} className="text-muted-foreground/50" />
                      </div>
                      <p className="text-base font-bold text-foreground">No ideas yet.</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">Your next big thing starts here.</p>
                      <RainbowButton onClick={() => navigate('/discover?tab=ideas')} className="h-9 px-4 text-xs">
                        Start Building
                      </RainbowButton>
                    </div>
                  )}
                </div>
              </LiquidGlassCard>
            </motion.div>

            {/* Right Col: Activity & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-6"
            >
              {/* Profile Completion Card */}
              {(!profile?.socialLinks?.github && !profile?.socialLinks?.linkedin) ? (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-background border border-accent/20 flex items-center justify-center text-accent mb-4 shadow-sm">
                      <Rocket size={18} />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Complete Profile</p>
                    <p className="text-xs text-muted-foreground mb-4">Add portfolio links to build trust.</p>
                    <Button onClick={() => navigate('/settings')} variant="outline" className="w-full h-9 text-xs rounded-lg border-accent/20 hover:bg-accent/10 hover:text-accent">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-background border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Profile Complete</p>
                    <p className="text-xs text-muted-foreground mb-4">Your profile looks great!</p>
                  </div>
                </div>
              )}

              {/* Premium Activity Feed */}
              <LiquidGlassCard className="p-6 border-border/40 bg-card/60">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2 mb-6">
                  <Activity size={20} className="text-blue-500" /> Activity Feed
                </h2>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                      <div key={`${activity.id}-${idx}`} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-xl border border-border/30">
                        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-inner", activity.color)}>
                          <activity.icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-sm font-bold text-foreground truncate">{activity.title}</div>
                          <div className="text-[12px] font-medium text-muted-foreground mt-0.5 truncate">{activity.description}</div>
                        </div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground shrink-0 mt-1 sm:mt-0">
                          {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-secondary/30 rounded-xl border border-dashed border-border">
                      <div className="text-sm font-semibold text-muted-foreground">No recent activity.</div>
                    </div>
                  )}
                </div>
              </LiquidGlassCard>

            </motion.div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
