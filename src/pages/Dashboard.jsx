import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { contentService } from '../services/content.service';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Rocket, 
  Users,
  Activity,
  ArrowRight,
  Clock,
  Star,
  Eye,
  CheckCircle2
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

// Animated Number Counter Component
function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ ideas: 0, projects: 0, connections: 0, saves: 0 });
  const [loading, setLoading] = useState(true);
  const [recentIdeas, setRecentIdeas] = useState([]);

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
        
        const totalSaves = 
          allIdeas.reduce((sum, item) => sum + (item.saves || 0), 0) +
          allProjects.reduce((sum, item) => sum + (item.saves || 0), 0);

        setStats({
          ideas: allIdeas.length,
          projects: allProjects.length,
          connections: connRes.data?.length || 0,
          saves: totalSaves
        });
        
        setRecentIdeas(allIdeas.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [profile?.id]);

  const STATS_CONFIG = [
    { label: 'Active Ideas', value: stats.ideas, icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { label: 'Live Projects', value: stats.projects, icon: Rocket, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
    { label: 'Network', value: stats.connections, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Total Saves', value: stats.saves, icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  ];

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-10 pb-12 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Workspace Overview
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, {profile?.displayName?.split(' ')[0] || 'Explorer'}.
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">Here's what's happening in your network today.</p>
            </div>
            <Button as={Link} to="/discover" variant="primary" className="shrink-0">
              <Activity size={18} className="mr-2" /> Explore Network
            </Button>
          </motion.div>

          {/* Stats Bento Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {STATS_CONFIG.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} className={`bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col relative overflow-hidden group transition-all duration-500 hover:bg-white/60 dark:hover:bg-zinc-900/60 shadow-sm`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${stat.bg} blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 opacity-50`} />
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 relative z-10">
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} shadow-inner shrink-0`}>
                    <stat.icon size={18} strokeWidth={2.5} className="md:w-5 md:h-5" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-muted-foreground break-words line-clamp-2 leading-tight">{stat.label}</span>
                </div>
                <div className="mt-auto relative z-10">
                  <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground truncate block">
                    {loading ? (
                      <span className="inline-block w-12 md:w-16 h-8 md:h-10 bg-white/5 rounded animate-pulse" />
                    ) : (
                      <AnimatedNumber value={stat.value} />
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-border/50 p-6 md:p-8 rounded-3xl min-h-[400px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Recent Ideas</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your latest shared concepts</p>
                  </div>
                  <Link to={`/profile/${profile?.id}`} className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1">
                    View all <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse border border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 shrink-0" />
                        <div className="space-y-2 flex-1 pt-1">
                          <div className="h-4 w-1/3 bg-black/10 dark:bg-white/10 rounded" />
                          <div className="h-3 w-2/3 bg-black/10 dark:bg-white/10 rounded" />
                        </div>
                      </div>
                    ))
                  ) : recentIdeas.length > 0 ? (
                    <AnimatePresence>
                      {recentIdeas.map((idea, i) => (
                        <motion.div 
                          key={idea.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group flex gap-5 p-5 rounded-2xl border border-border/50 bg-white dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-border transition-all cursor-pointer shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                            <Lightbulb size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors text-base">{idea.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{idea.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} /> 
                                {new Date(idea.createdAt?.seconds ? idea.createdAt.seconds * 1000 : idea.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1.5 text-accent"><Star size={14} /> {idea.saves || 0} Saves</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border/50 bg-white dark:bg-white/[0.02]">
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4 shadow-inner">
                        <Lightbulb size={28} strokeWidth={2} />
                      </div>
                      <p className="font-bold text-lg text-foreground">No ideas yet</p>
                      <p className="text-sm text-muted-foreground mt-2 mb-6">Start sharing your concepts with the network.</p>
                      <Button as={Link} to="/discover" variant="outline">Share an idea</Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar Widgets */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {(!profile?.socialLinks?.github && !profile?.socialLinks?.linkedin) ? (
                <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-accent/20 relative overflow-hidden group shadow-sm">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors" />
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 relative z-10 shadow-inner">
                    <Rocket size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 relative z-10 text-foreground">Complete Profile</h2>
                  <p className="text-sm text-muted-foreground mb-8 relative z-10 leading-relaxed">Add your portfolio links to stand out in the network and build trust.</p>
                  <Button as={Link} to="/settings" variant="primary" className="w-full relative z-10">
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden group shadow-sm">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors" />
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 relative z-10 shadow-inner">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 relative z-10 text-foreground">Profile Complete</h2>
                  <p className="text-sm text-muted-foreground mb-8 relative z-10 leading-relaxed">Your profile looks great! Keep sharing your ideas with the network.</p>
                  <Button as={Link} to="/discover" variant="outline" className="w-full relative z-10 hover:text-emerald-400 hover:border-emerald-500/50">
                    Explore Network
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
