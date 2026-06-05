import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { 
 Command, 
 Lightbulb, 
 Rocket, 
 Users, 
 Target, 
 ArrowRight, 
 Zap, 
 Globe, 
 Sparkles,
 Search,
 Code,
 Shield,
 MessageSquare
} from 'lucide-react';
import { cn } from '../utils/cn';

// Enhanced FadeIn component with blur
const FadeIn = ({ children, delay = 0, direction = 'up', className = '', duration = 0.8, scale = 1 }) => {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true, margin:"-5%" });
 
 const directions = {
 up: { y: 60, opacity: 0, scale, filter:"blur(10px)" },
 down: { y: -60, opacity: 0, scale, filter:"blur(10px)" },
 left: { x: 60, opacity: 0, scale, filter:"blur(10px)" },
 right: { x: -60, opacity: 0, scale, filter:"blur(10px)" },
 none: { opacity: 0, scale, filter:"blur(10px)" }
 };

 return (
 <motion.div
 ref={ref}
 initial={directions[direction]}
 animate={isInView ? { x: 0, y: 0, opacity: 1, scale: 1, filter:"blur(0px)" } : directions[direction]}
 transition={{ type:"spring", stiffness: 60, damping: 20, delay, mass: 1 }}
 className={className}
 >
 {children}
 </motion.div>
 );
};

export default function LandingPage() {
 const navigate = useNavigate();
 const { scrollYProgress } = useScroll();
 const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
 const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
 const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

 return (
 <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-white dark:selection:text-black">
 <Navbar />
 
 <main>
 {/* HERO SECTION */}
 <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
 {/* Advanced Dynamic Background */}
 <motion.div 
 style={{ y: heroY, opacity: heroOpacity, scale }} 
 className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
 >
 {/* High-end grid */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
 </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pt-32 pb-16">
            
            <FadeIn scale={0.9} duration={1.2}>
              <div className="max-w-6xl mx-auto mb-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/20 dark:bg-accent/10 blur-[120px] rounded-[100%] pointer-events-none" />
                <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-foreground relative z-10">
                  Where Elite <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground drop-shadow-xl">
                    Builders Unite.
                  </span>
                </h1>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <p className="text-muted-foreground font-medium text-xl md:text-3xl max-w-4xl mx-auto mb-16 leading-[1.6]">
                The premier network state for next-gen innovators. Discover ideas, meet elite co-founders, and build the future with zero friction and maximum velocity.
              </p>
            </FadeIn>

 <FadeIn delay={0.4} direction="up">
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Button 
 variant="primary" 
 size="lg" 
 className="w-full sm:w-auto h-14 px-8 text-base font-semibold group rounded-2xl"
 onClick={() => navigate('/register')}
 >
 Start Building Free
 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
 </Button>
 <Button 
 variant="outline" 
 size="lg" 
 className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl border-border bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-muted"
 onClick={() => {
 document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
 }}
 >
 <Search size={18} className="mr-2 text-muted-foreground" />
 Explore Network
 </Button>
 </div>
 <p className="mt-6 text-sm text-muted-foreground font-medium">
 No credit card required. Join 10,000+ active builders.
 </p>
 </FadeIn>
 </div>
 
 </section>

 {/* BRANDS / SOCIAL PROOF MARQUEE */}
 <section className="py-16 border-y border-border bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden flex flex-col items-center">
 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10">Trusted by builders at top companies</p>
 <motion.div 
 animate={{ x: [0, -1000] }} 
 transition={{ repeat: Infinity, duration: 40, ease:"linear" }}
 className="flex items-center gap-24 whitespace-nowrap opacity-60 dark:opacity-40"
 >
 {[...Array(8)].map((_, i) => (
 <div key={i} className="flex items-center gap-20">
 <span className="text-2xl font-black uppercase tracking-widest">Vercel</span>
 <span className="text-2xl font-black uppercase tracking-widest">Stripe</span>
 <span className="text-2xl font-black uppercase tracking-widest">Linear</span>
 <span className="text-2xl font-black uppercase tracking-widest">OpenAI</span>
 </div>
 ))}
 </motion.div>
 </section>

 {/* ABOUT SECTION (Linear/Stripe Inspired) */}
 <section id="about" className="py-32 px-6 relative bg-background border-b border-border overflow-hidden">
 
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 <FadeIn direction="right">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
 <span className="w-2 h-2 rounded-full bg-accent" />
 Our Vision
 </div>
                <FadeIn delay={0.1}>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
                    A new era of
                  </h2>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground">
                    collaboration.
                  </h2>
                </FadeIn>
 <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
 <p>
 CollabHub was born out of a simple observation: the world is full of incredible ideas, but execution is blocked by a lack of access to the right talent.
 </p>
 <p>
 We've designed a platform that strips away the noise. No recruiters, no endless scrolling. Just a pure, high-signal network where builders can validate ideas, assemble elite squads, and ship products faster.
 </p>
 </div>
 <div className="mt-12 flex items-center gap-6">
 <div className="flex flex-col">
 <span className="text-4xl font-black text-foreground">10k+</span>
 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Active Builders</span>
 </div>
 <div className="w-px h-12 bg-border" />
 <div className="flex flex-col">
 <span className="text-4xl font-black text-foreground">50k+</span>
 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Connections</span>
 </div>
 </div>
 </FadeIn>
 
 <FadeIn direction="left" delay={0.2} className="relative">
 <div className="aspect-square max-h-[600px] w-full rounded-3xl bg-secondary border border-border relative overflow-hidden shadow-2xl">
 {/* Subtle Grid inside the card */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]" />
 
 {/* Abstract Glass Elements */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
 <div className="w-16 h-16 bg-foreground rounded-2xl shadow-xl flex items-center justify-center text-background">
 <Zap size={32} />
 </div>
 <div className="w-full space-y-4">
 <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
 <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
 </div>
 </div>
 
 <div className="absolute bottom-8 right-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
 <div className="absolute top-8 left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
 </div>
 </FadeIn>
 </div>
 </div>
 </section>

 {/* BENTO GRID FEATURES SECTION */}
 <section id="features" className="py-32 px-6 relative z-10 bg-background">
 <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-4xl mx-auto mb-24">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">Everything you need to</h2>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground">scale your vision.</h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
 We've stripped away the noise of traditional professional networks to bring you a hyper-focused suite of tools for actual creation.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
 {/* Feature 1 - Large */}
 <FadeIn className="md:col-span-2 group" delay={0.1}>
 <div className="h-full w-full bg-white dark:bg-card border border-border rounded-3xl p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-border">
 
 <div className="w-14 h-14 bg-secondary text-foreground rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-sm border border-border">
 <Target size={28} strokeWidth={2.5} />
 </div>
 <h3 className="text-2xl font-bold tracking-tight mb-4 relative z-10">Idea Validation Engine</h3>
 <p className="text-base text-muted-foreground font-medium leading-relaxed relative z-10 max-w-md">
 Pitch your concepts to a network of high-caliber builders. Get instant feedback, upvotes, and constructive criticism before writing a single line of code. Stop building in a vacuum.
 </p>
 
 {/* Decorative element */}
 <div className="absolute right-0 bottom-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0">
 <div className="w-48 h-32 bg-background rounded-xl border border-border shadow-2xl flex flex-col p-4 gap-2">
 <div className="w-3/4 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
 <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
 <div className="mt-auto flex items-center justify-between">
 <div className="flex -space-x-2">
 <div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-background" />
 <div className="w-6 h-6 rounded-full bg-zinc-400 dark:bg-zinc-600 border-2 border-background" />
 </div>
 <div className="text-accent font-bold text-xs">+124 Votes</div>
 </div>
 </div>
 </div>
 </div>
 </FadeIn>

 {/* Feature 2 */}
 <FadeIn className="group" delay={0.2}>
 <div className="h-full w-full bg-white dark:bg-card border border-border rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-border">
 <div className="w-12 h-12 bg-secondary text-foreground border border-border rounded-xl flex items-center justify-center mb-6 shadow-sm">
 <Users size={24} strokeWidth={2} />
 </div>
 <h3 className="text-xl font-bold tracking-tight mb-3">Talent Discovery</h3>
 <p className="text-muted-foreground font-medium text-sm leading-relaxed">
 Filter through verified portfolios. Find exact skill matches for your stack.
 </p>
 
 {/* Decorative */}
 <div className="mt-auto pt-6">
 <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-emerald-400" />
 <div>
 <div className="text-sm font-bold">Alex Chen</div>
 <div className="text-xs text-muted-foreground">Full Stack</div>
 </div>
 </div>
 </div>
 </div>
 </FadeIn>

 {/* Feature 3 */}
 <FadeIn className="group" delay={0.3}>
 <div className="h-full w-full bg-white dark:bg-card border border-border rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-border">
 <div className="w-12 h-12 bg-secondary text-foreground border border-border rounded-xl flex items-center justify-center mb-6 shadow-sm">
 <MessageSquare size={24} strokeWidth={2} />
 </div>
 <h3 className="text-xl font-bold tracking-tight mb-3">Real-time Chat</h3>
 <p className="text-muted-foreground font-medium text-sm leading-relaxed">
 Connect instantly with built-in encrypted messaging. Share assets and coordinate.
 </p>
 <div className="mt-auto w-full flex justify-end">
 <div className="bg-blue-500 text-white text-xs px-4 py-2 rounded-2xl rounded-br-sm shadow-md">
 Let's build this! 🚀
 </div>
 </div>
 </div>
 </FadeIn>

 {/* Feature 4 - Large */}
 <FadeIn className="md:col-span-2 group" delay={0.4}>
 <div className="h-full w-full bg-white dark:bg-card border border-border rounded-3xl p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-border">
 
 <div className="w-14 h-14 bg-secondary text-foreground rounded-2xl flex items-center justify-center mb-8 relative z-10">
 <Code size={28} strokeWidth={2.5} />
 </div>
 <h3 className="text-2xl font-bold tracking-tight mb-4 relative z-10">Proof of Work Architecture</h3>
 <p className="text-base text-muted-foreground font-medium leading-relaxed relative z-10 max-w-md">
 Talk is cheap. On CollabHub, your portfolio is your resume. Showcase your repos, design files, and live deployments to attract the best co-founders.
 </p>

 <div className="mt-auto flex items-center gap-4 relative z-10">
 <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-background border border-border shadow-sm">
 <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Demo
 </div>
 <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-background border border-border shadow-sm">
 <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
 Repository
 </div>
 </div>
 </div>
 </FadeIn>
 </div>
 </div>
 </section>

 {/* HOW IT WORKS */}
 <section className="py-40 px-6 relative bg-secondary/50 border-y border-border overflow-hidden">
 {/* subtle background glow */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
 
 <div className="max-w-7xl mx-auto relative z-10">
 <FadeIn>
 <h2 className="text-6xl md:text-8xl font-black tracking-tight text-center text-foreground">From idea to</h2>
 <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-24 text-center text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground">IPO.</h2>
 </FadeIn>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
 {/* Connecting line */}
 <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
 
 <FadeIn delay={0.1} className="relative z-10 flex flex-col items-center text-center">
 <div className="w-24 h-24 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center mb-6 relative group">
 <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
 <Lightbulb size={36} className="text-accent relative z-10" />
 </div>
 <h3 className="text-xl font-bold mb-3">1. Post Your Vision</h3>
 <p className="text-muted-foreground text-sm font-medium">Share your idea in the Discover feed. Let the community validate it and provide feedback.</p>
 </FadeIn>

 <FadeIn delay={0.3} className="relative z-10 flex flex-col items-center text-center">
 <div className="w-24 h-24 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center mb-6 relative group">
 <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
 <Users size={36} className="text-emerald-500 relative z-10" />
 </div>
 <h3 className="text-xl font-bold mb-3">2. Form the Squad</h3>
 <p className="text-muted-foreground text-sm font-medium">Find co-founders whose skills complement yours. Connect and align on equity and vision.</p>
 </FadeIn>

 <FadeIn delay={0.5} className="relative z-10 flex flex-col items-center text-center">
 <div className="w-24 h-24 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center mb-6 relative group">
 <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
 <Rocket size={36} className="text-blue-500 relative z-10" />
 </div>
 <h3 className="text-xl font-bold mb-3">3. Ship It</h3>
 <p className="text-muted-foreground text-sm font-medium">Use our integrated tools to track progress, chat, and deploy your MVP to the world.</p>
 </FadeIn>
 </div>
 </div>
 </section>

 {/* CTA SECTION */}
 <section className="py-32 px-6 bg-background relative overflow-hidden">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 to-transparent dark:from-accent/10" />
 
 <div className="max-w-4xl mx-auto text-center relative z-10">
 <FadeIn scale={0.9}>
 <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-8">
 <Command size={40} />
 </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-foreground">
                Stop Waiting.
              </h2>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground">
                Start Building.
              </h2>
 <p className="text-xl text-muted-foreground font-medium mb-10 max-w-2xl mx-auto">
 Join thousands of elite builders shaping the future of technology. Your next big venture starts here.
 </p>
 
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Button 
 variant="primary" 
 size="lg" 
 className="w-full sm:w-auto h-16 px-12 text-lg font-bold rounded-2xl shadow-xl shadow-accent/20"
 onClick={() => navigate('/register')}
 >
 Create Free Account
 <ArrowRight size={20} className="ml-2" />
 </Button>
 </div>
 </FadeIn>
 </div>
 </section>
 </main>

 <Footer />
 </div>
 );
}
