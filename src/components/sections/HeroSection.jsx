import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DynamicText from '../kokonutui/dynamic-text';
import { ShieldCheck, Rocket, Zap, Users, ArrowRight, Play } from 'lucide-react';
import { Fade } from '../ui/Animations';

// MagicUI Components
import { RainbowButton } from '../ui/rainbow-button';
import { RetroGrid } from '../ui/retro-grid';
import BentoGrid from '../kokonutui/bento-grid';

const EcosystemBento = () => {
  const items = [
    {
      id: "validation",
      title: "Idea Validation Ecosystem",
      description: "Pitch your early-stage concepts to a community of ambitious builders and verified mentors.",
      feature: "spotlight",
      spotlightItems: [
        "Global Builder Network",
        "Constructive Feedback",
        "Mentor Certification",
        "Team Formation"
      ],
      className: "col-span-2 md:col-span-2",
    },
    {
      id: "execution",
      title: "Project Execution",
      description: "Turn validated concepts into deployed startups.",
      feature: "timeline",
      timeline: [
        { year: "Phase 1", event: "Post Concept" },
        { year: "Phase 2", event: "Get Certified" },
        { year: "Phase 3", event: "Build Team" }
      ],
      className: "col-span-2 md:col-span-2",
    },
    {
      id: "community",
      title: "Active Community",
      description: "Join thousands of builders turning ideas into reality.",
      feature: "counter",
      statistic: { label: "Builders", start: 0, end: 1250, suffix: "+" },
      className: "col-span-1",
    },
    {
      id: "mentors",
      title: "Verified Mentors",
      description: "Get direct guidance from industry experts.",
      feature: "chart",
      statistic: { label: "Approval Rate", end: 85, suffix: "%" },
      className: "col-span-1 md:col-span-1",
    },
  ];

  return (
    <div className="w-full max-w-[900px] mx-auto mt-24 relative z-10">
      <BentoGrid items={items} />
    </div>
  );
};

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative w-full min-h-screen pt-[160px] pb-24 flex flex-col items-center bg-background overflow-hidden font-sans">
      
      {/* MagicUI Retro Grid Background */}
      <RetroGrid className="opacity-50" />

      {/* Premium Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Text Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center">
        
        <Fade delay={0.1} yOffset={20}>
          <h1 className="text-[56px] md:text-[80px] lg:text-[100px] font-bold tracking-tighter leading-[0.95] text-foreground mb-6 max-w-[1000px]">
            The ecosystem for<br/>
            <span className="text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
              ambitious builders
            </span>
          </h1>
        </Fade>
        
        <Fade delay={0.2} yOffset={16}>
          <p className="text-[18px] md:text-[22px] text-muted-foreground leading-[1.6] max-w-[650px] mb-12 tracking-tight font-medium">
            Adyes is an open-source platform to share your ideas, get certified by industry mentors, and find the perfect team to build your startup.
          </p>
        </Fade>

        <Fade delay={0.3} yOffset={20} className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link to="/register">
              <RainbowButton className="h-12 px-8 text-base font-bold bg-foreground text-background shadow-xl group">
                Join the Network
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </RainbowButton>
            </Link>
            <Link to="/discover">
              <button className="h-12 px-8 rounded-full border border-border bg-background/50 backdrop-blur-md text-foreground font-semibold text-base transition-all hover:bg-secondary/80 flex items-center gap-2 group">
                <Play className="w-4 h-4 text-accent fill-accent" />
                Explore Ideas
              </button>
            </Link>
          </div>
        </Fade>
      </div>

      {/* DYNAMIC PIPELINE VISUAL */}
      <Fade delay={0.5} yOffset={40} className="w-full relative z-10 px-6">
        <EcosystemBento />
      </Fade>


    </section>
  );
};
