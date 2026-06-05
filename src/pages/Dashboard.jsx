import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { contentService } from '../services/content.service';
import { useNavigate } from 'react-router-dom';
import { 
 Lightbulb, 
 Rocket, 
 Users,
 Activity,
 ArrowRight,
 Clock,
 CheckCircle2,
 TrendingUp,
 Sparkles,
 Plus,
 Zap,
 Search,
 MessageSquare
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import RankProgressWidget from '../components/RankProgressWidget';

const staggerContainer = {
 hidden: { opacity: 0 },
 show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
 hidden: { opacity: 0, y: 16 },
 show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
};

function AnimatedNumber({ value }) {
 const [count, setCount] = useState(0);
 useEffect(() => {
 let start = 0;
 const end = parseInt(value) || 0;
 if (start === end) return;
 const totalDuration = 900;
 const incrementTime = totalDuration / end;
 const timer = setInterval(() => {
 start += 1;
 setCount(start);
 if (start === end) clearInterval(timer);
 }, incrementTime);
 return () => clearInterval(timer);
 }, [value]);
 return <>{count}</>;
}

const STAT_CARDS = [
 {
 label: 'Active Ideas',
 key: 'ideas',
 icon: Lightbulb,
 },
 {
 label: 'Live Projects',
 key: 'projects',
 icon: Rocket,
 },
 {
 label: 'Connections',
 key: 'connections',
 icon: Users,
 },
];

export default function Dashboard() {
 const { profile } = useAuth();
 const navigate = useNavigate();
 const [stats, setStats] = useState({ ideas: 0, projects: 0, connections: 0 });
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
 setStats({ ideas: allIdeas.length, projects: allProjects.length, connections: connRes.data?.length || 0 });
 setRecentIdeas(allIdeas.slice(0, 3));
 } catch (error) {
 console.error('Error loading dashboard:', error);
 } finally {
 setLoading(false);
 }
 };
 loadDashboard();
 }, [profile?.id]);

 const greeting = () => {
 const h = new Date().getHours();
 if (h < 12) return 'Good morning';
 if (h < 17) return 'Good afternoon';
 return 'Good evening';
 };

 return (
 <AppShell>
 <PageContainer>
 <div className="space-y-8 pb-16 max-w-7xl mx-auto">

 {/* ── Hero Header ── */}
 <motion.div
 initial={{ opacity: 0, y: -12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="flex flex-col md:flex-row md:items-end justify-between gap-6"
 >
 <div>
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-bold mb-4 tracking-wide">
 <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
 Workspace Overview
 </div>
 <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
 {greeting()},{' '}
 <span className="text-accent">{profile?.displayName?.split(' ')[0] || 'Explorer'}</span>.
 </h1>
 <p className="text-muted-foreground mt-2 text-sm md:text-base">
 Here's what's happening in your network today.
 </p>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <Button
 onClick={() => navigate('/discover?tab=ideas')}
 variant="outline"
 className="h-10 px-4 text-sm gap-2"
 >
 <Plus size={16} /> New Idea
 </Button>
 <Button
 onClick={() => navigate('/discover')}
 variant="primary"
 className="h-10 px-5 text-sm gap-2"
 >
 <Activity size={16} /> Explore Network
 </Button>
 </div>
 </motion.div>

 {/* ── Stat Cards ── */}
 <motion.div
 variants={staggerContainer}
 initial="hidden"
 animate="show"
 className="grid grid-cols-1 md:grid-cols-3 gap-4"
 >
 {STAT_CARDS.map((s) => (
 <motion.div
 key={s.label}
 variants={fadeUp}
 onClick={() => {
 if (s.key === 'connections') navigate('/network');
 else navigate(`/discover?tab=${s.key}`);
 }}
 className="relative overflow-hidden rounded-xl border border-border bg-card p-5 group cursor-pointer transition-all duration-300 hover:border-muted-foreground/30 hover:bg-white/[0.02]"
 >
 <div className="flex items-center justify-between mb-4 relative z-10">
 <div className="text-muted-foreground group-hover:text-foreground transition-colors">
 <s.icon size={20} strokeWidth={1.5} />
 </div>
 <TrendingUp size={14} className="text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
 </div>
 <div className="relative z-10">
 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
 {s.label}
 </p>
 <p className="text-4xl font-normal tracking-tight text-foreground tabular-nums mt-1">
 {loading ? (
 <span className="inline-block w-12 h-9 bg-muted/60 rounded animate-pulse" />
 ) : (
 <AnimatedNumber value={stats[s.key]} />
 )}
 </p>
 </div>
 </motion.div>
 ))}
 </motion.div>

 {/* ── Main Grid ── */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

 {/* ── Recent Ideas (2/3 width) ── */}
 <motion.div
 initial={{ opacity: 0, x: -16 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.25 }}
 className="lg:col-span-2"
 >
 <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
 {/* Panel header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-border">
 <div>
 <h2 className="text-base font-bold text-foreground">Recent Ideas</h2>
 <p className="text-xs text-muted-foreground mt-0.5">Your latest shared concepts</p>
 </div>
 <button
 onClick={() => navigate(`/profile/${profile?.id}`)}
 className="text-xs font-bold text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1 hover:gap-1.5"
 >
 View all <ArrowRight size={13} />
 </button>
 </div>

 <div className="p-4 space-y-2 min-h-[260px]">
 {loading ? (
 Array(3).fill(0).map((_, i) => (
 <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/40 animate-pulse">
 <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
 <div className="space-y-2 flex-1">
 <div className="h-4 w-1/3 bg-muted rounded" />
 <div className="h-3 w-2/3 bg-muted rounded" />
 </div>
 </div>
 ))
 ) : recentIdeas.length > 0 ? (
 <AnimatePresence>
 {recentIdeas.map((idea, i) => (
 <motion.div
 key={idea.id}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.08 }}
 className="group flex gap-4 p-4 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/40 transition-all duration-200 cursor-pointer"
 onClick={() => navigate('/discover')}
 >
 <div className="text-muted-foreground shrink-0 group-hover:text-foreground transition-colors mt-0.5">
 <Lightbulb size={20} strokeWidth={1.5} />
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors truncate">
 {idea.title}
 </h3>
 <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{idea.description}</p>
 <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-medium">
 <span className="flex items-center gap-1">
 <Clock size={11} />
 {new Date(idea.createdAt?.seconds ? idea.createdAt.seconds * 1000 : idea.createdAt).toLocaleDateString()}
 </span>
 {idea.certified && (
 <span className="text-foreground font-semibold flex items-center gap-1">
 <Sparkles size={10} /> Certified
 </span>
 )}
 </div>
 </div>
 <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
 </motion.div>
 ))}
 </AnimatePresence>
 ) : (
 <div className="flex flex-col items-center justify-center h-52 text-center px-6">
 <div className="text-muted-foreground mb-4">
 <Lightbulb size={24} strokeWidth={1.5} />
 </div>
 <p className="font-bold text-foreground mb-1">No ideas yet</p>
 <p className="text-sm text-muted-foreground mb-5">Share your first concept with the network.</p>
 <Button onClick={() => navigate('/discover')} variant="outline" className="h-9 text-xs px-4">
 <Plus size={14} className="mr-1.5" /> Share an Idea
 </Button>
 </div>
 )}
 </div>
 </div>
 </motion.div>

 {/* ── Right Sidebar (1/3 width) ── */}
 <motion.div
 initial={{ opacity: 0, x: 16 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.35 }}
 className="space-y-4"
 >
 {/* Rank Widget */}
 <RankProgressWidget stats={stats} loading={loading} />

 {/* Quick Actions */}
 <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-5">
 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Quick Actions</p>
 <div className="space-y-2">
 {[
 { label: 'Browse Ideas', icon: Search, path: '/discover?tab=ideas' },
 { label: 'Find Collaborators', icon: Users, path: '/network' },
 { label: 'View Messages', icon: MessageSquare, path: '/messages' },
 ].map((a) => (
 <button
 key={a.label}
 onClick={() => navigate(a.path)}
 className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
 >
 <div className="text-muted-foreground group-hover:text-foreground transition-colors">
 <a.icon size={16} strokeWidth={1.5} />
 </div>
 <span className="text-sm font-semibold text-foreground">{a.label}</span>
 <ArrowRight size={13} className="ml-auto text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
 </button>
 ))}
 </div>
 </div>

 {/* Profile CTA */}
 {(!profile?.socialLinks?.github && !profile?.socialLinks?.linkedin) ? (
 <div className="rounded-2xl border border-border bg-secondary/50 p-5 relative overflow-hidden group">
 <div className="relative z-10">
 <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground mb-3 shadow-sm">
 <Rocket size={16} strokeWidth={2} />
 </div>
 <p className="text-sm font-bold text-foreground mb-1">Complete Profile</p>
 <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Add portfolio links to build trust and attract collaborators.</p>
 <Button onClick={() => navigate('/settings')} variant="outline" className="w-full h-9 text-xs">
 Edit Profile
 </Button>
 </div>
 </div>
 ) : (
 <div className="rounded-2xl border border-border bg-secondary/50 p-5 relative overflow-hidden group">
 <div className="relative z-10">
 <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-foreground mb-3 shadow-sm">
 <CheckCircle2 size={16} strokeWidth={2} />
 </div>
 <p className="text-sm font-bold text-foreground mb-1">Profile Complete</p>
 <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Your profile looks great! Keep sharing your ideas.</p>
 <Button onClick={() => navigate('/discover')} variant="outline" className="w-full h-9 text-xs">
 Explore Network
 </Button>
 </div>
 </div>
 )}
 </motion.div>
 </div>
 </div>
 </PageContainer>
 </AppShell>
 );
}
