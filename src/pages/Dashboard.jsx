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

          {/* ── Hero Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50"
          >
            <div className="max-w-[70%]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border/50 bg-secondary/30 text-muted-foreground text-[10px] font-bold mb-4 tracking-widest uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Workspace Overview
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight mb-2">
                {greeting()}, <span className="text-foreground">{profile?.displayName?.split(' ')[0] || 'Explorer'}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                Monitor your ideas, active projects, and network growth from your command center.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button onClick={() => navigate('/discover?tab=ideas')} variant="outline" className="h-10 px-4 text-xs gap-2 rounded-lg bg-card border-border shadow-sm">
                <Plus size={14} /> New Concept
              </Button>
              <Button onClick={() => navigate('/discover')} className="h-10 px-5 text-xs bg-foreground text-background shadow-sm hover:bg-foreground/90 rounded-lg">
                Explore Network
              </Button>
            </div>
          </motion.div>

          {/* ── Stat Cards with Sparklines ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STAT_CARDS.map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(s.key === 'connections' ? '/network' : `/discover?tab=${s.key}`)} 
                className="cursor-pointer group relative overflow-hidden h-full bg-card/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-border/60 hover:border-border transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-background border border-border/50 shadow-sm group-hover:scale-105 transition-transform", s.color)}>
                      <s.icon size={18} strokeWidth={2} />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                      {s.label}
                    </p>
                  </div>
                  <TrendingUp size={16} className={cn("opacity-50", s.color)} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-black tracking-tight text-foreground tabular-nums">
                      {loading ? (
                        <span className="inline-block w-16 h-10 bg-secondary rounded-md animate-pulse" />
                      ) : (
                        <AnimatedNumber value={stats[s.key]} />
                      )}
                    </p>
                  </div>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-2 bg-secondary/50 inline-block px-2 py-1 rounded-md">
                    {s.trend}
                  </p>
                </div>

                {/* Background Sparkline */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none translate-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Sparkline colorClass={s.color} />
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
              {/* Mentor Requests Table */}
              {profile?.role === 'mentor' && pendingIdeas.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/20 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/10 bg-emerald-500/5">
                    <div>
                      <h2 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                        <Sparkles size={16} /> Action Required: Mentor Review
                      </h2>
                    </div>
                  </div>
                  <div className="divide-y divide-emerald-500/10">
                    {pendingIdeas.map((idea) => (
                      <div key={idea.id} className="p-4 hover:bg-emerald-500/5 transition-colors flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-bold text-sm text-foreground truncate">{idea.title}</h3>
                          <p className="text-xs text-muted-foreground truncate mt-1">Requested by {idea.authorName}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" className="h-8 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10">
                            Decline
                          </Button>
                          <Button size="sm" className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-none">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Ideas Data Table */}
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" /> Recent Ideas
                  </h2>
                  <button onClick={() => navigate(`/profile/${profile?.id}`)} className="text-[11px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-muted-foreground uppercase bg-secondary/30 border-b border-border/50 tracking-widest">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Project Name</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {loading ? (
                        Array(4).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-6 py-4"><div className="h-4 w-32 bg-secondary rounded" /></td>
                            <td className="px-6 py-4"><div className="h-4 w-16 bg-secondary rounded" /></td>
                            <td className="px-6 py-4"><div className="h-4 w-20 bg-secondary rounded" /></td>
                            <td className="px-6 py-4 text-right"><div className="h-4 w-8 bg-secondary rounded ml-auto" /></td>
                          </tr>
                        ))
                      ) : recentIdeas.length > 0 ? (
                        recentIdeas.map((idea) => (
                          <tr key={idea.id} className="hover:bg-secondary/20 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-foreground text-sm truncate max-w-[200px]">{idea.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">{idea.description}</p>
                            </td>
                            <td className="px-6 py-4">
                              {idea.certified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                                  <Sparkles size={10} /> Certified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-muted-foreground text-[10px] font-bold border border-border/50">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                              {new Date(idea.createdAt?.seconds ? idea.createdAt.seconds * 1000 : idea.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => navigate('/discover')} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-block">
                                <ChevronRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Lightbulb size={24} className="opacity-20" />
                              <p className="text-sm">No ideas yet. Start building!</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 relative overflow-hidden shadow-sm">
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
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 relative overflow-hidden shadow-sm">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-background border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Profile Complete</p>
                    <p className="text-xs text-muted-foreground mb-4">Your profile looks great!</p>
                  </div>
                </div>
              )}

              {/* Activity Feed (Mocked for premium feel) */}
              <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm shadow-sm p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                  <Activity size={14} /> Activity Feed
                </p>
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                  
                  {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                      <div key={`${activity.id}-${idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={cn("flex items-center justify-center w-6 h-6 rounded-full border-2 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10", activity.color)}>
                          <activity.icon size={10} strokeWidth={3} />
                        </div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-border/50 bg-secondary/20 shadow-sm ml-4 md:ml-0 hover:bg-secondary/40 transition-colors">
                          <p className="text-xs font-semibold text-foreground">{activity.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">No recent activity.</p>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
