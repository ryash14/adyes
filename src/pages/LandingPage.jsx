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

// Enhanced FadeIn component for smooth scroll reveals
const FadeIn = ({ children, delay = 0, direction = 'up', className = '', duration = 0.8, scale = 1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const directions = {
    up: { y: 50, opacity: 0, scale },
    down: { y: -50, opacity: 0, scale },
    left: { x: 50, opacity: 0, scale },
    right: { x: -50, opacity: 0, scale },
    none: { opacity: 0, scale }
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { x: 0, y: 0, opacity: 1, scale: 1 } : directions[direction]}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay, mass: 1 }}
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
            {/* Glowing orbs */}
            <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-accent/20 dark:bg-accent/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }} />
            
            {/* High-end grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pt-20">
            {/* Removed Introducing CollabHub 2.0 pill as requested */}

            <FadeIn delay={0.2} scale={0.95} direction="up" className="max-w-6xl mx-auto">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] mb-8">
                Where Elite <br className="hidden sm:block" />
                Builders <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400 drop-shadow-[0_0_40px_rgba(37,99,235,0.3)] dark:drop-shadow-[0_0_40px_rgba(204,255,0,0.3)]">Unite.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} direction="up">
              <p className="text-muted-foreground font-medium text-lg md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed">
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
                  className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl border-border/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
          
          {/* Scroll Indicator Removed as requested */}
        </section>

        {/* BRANDS / SOCIAL PROOF MARQUEE */}
        <section className="py-16 border-y border-border/50 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden flex flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10">Trusted by builders at top companies</p>
          <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
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
        <section id="about" className="py-32 px-6 relative bg-background border-b border-border/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 dark:bg-accent/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-zinc-100 dark:bg-zinc-900 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Our Vision
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                  A new era of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">collaboration.</span>
                </h2>
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
                <div className="aspect-square max-h-[600px] w-full rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-border/50 relative overflow-hidden shadow-2xl">
                  {/* Subtle Grid inside the card */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                  
                  {/* Abstract Glass Elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
                    <div className="w-16 h-16 bg-accent rounded-2xl rotate-12 shadow-lg shadow-accent/20 flex items-center justify-center text-primary">
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
            <FadeIn>
              <div className="text-center max-w-4xl mx-auto mb-24">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">Everything you need to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400 drop-shadow-sm">scale your vision.</span></h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                  We've stripped away the noise of traditional professional networks to bring you a hyper-focused suite of tools for actual creation.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
              {/* Feature 1 - Large */}
              <FadeIn className="md:col-span-2 group" delay={0.1}>
                <div className="h-full w-full bg-white dark:bg-zinc-900/50 border border-border/50 rounded-3xl p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-accent/5">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-colors duration-700" />
                  
                  <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8 relative z-10">
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
                <div className="h-full w-full bg-white dark:bg-zinc-900/50 border border-border/50 rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-emerald-500/5">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                    <Users size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-3">Talent Discovery</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    Filter through verified portfolios. Find exact skill matches for your stack.
                  </p>
                  
                  {/* Decorative */}
                  <div className="mt-auto pt-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50">
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
                <div className="h-full w-full bg-white dark:bg-zinc-900/50 border border-border/50 rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-blue-500/5">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <MessageSquare size={24} strokeWidth={2.5} />
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
                <div className="h-full w-full bg-white dark:bg-zinc-900/50 border border-border/50 rounded-3xl p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-accent/5">
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-colors duration-700" />
                  
                  <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-2xl flex items-center justify-center mb-8 relative z-10">
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
        <section className="py-40 px-6 relative bg-zinc-50 dark:bg-zinc-950 border-y border-border/50 overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-24 text-center">From idea to <span className="text-accent drop-shadow-sm">IPO.</span></h2>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              
              <FadeIn delay={0.1} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-xl flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Lightbulb size={36} className="text-accent relative z-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Post Your Vision</h3>
                <p className="text-muted-foreground text-sm font-medium">Share your idea in the Discover feed. Let the community validate it and provide feedback.</p>
              </FadeIn>

              <FadeIn delay={0.3} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-xl flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Users size={36} className="text-emerald-500 relative z-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Form the Squad</h3>
                <p className="text-muted-foreground text-sm font-medium">Find co-founders whose skills complement yours. Connect and align on equity and vision.</p>
              </FadeIn>

              <FadeIn delay={0.5} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-xl flex items-center justify-center mb-6 relative group">
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.05)_0,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.1)_0,transparent_100%)]" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn scale={0.9}>
              <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Command size={40} />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
                Stop Waiting. <br/>Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Building.</span>
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
