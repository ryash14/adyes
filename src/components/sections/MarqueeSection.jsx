import React from 'react';
import { Rocket, Sparkles, Code2, Cpu, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import Avatar from '../ui/Avatar';

const CommunityCard = ({ name, role, project, tags, color }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="group flex w-[350px] flex-col gap-5 rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl shadow-sm transition-all duration-500 hover:border-border/80 hover:shadow-md hover:bg-card/50 cursor-default">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar fallback={initials} size="md" className={cn("ring-2 ring-background shadow-sm", color)} />
          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-foreground group-hover:text-accent transition-colors">{name}</span>
          <span className="text-xs font-semibold text-muted-foreground">{role}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground/90 line-clamp-1 mb-3">Building <span className="font-bold text-foreground">"{project}"</span></p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-secondary/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground border border-border/30 group-hover:border-border/60 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MOCK_DATA = [
  { name: "Sarah Chen", role: "AI Engineer @ Neural", project: "Neural API Gateway", tags: ["Python", "Rust", "LLMs"], color: "bg-blue-500/10 text-blue-500" },
  { name: "Alex Kumar", role: "Founder @ AuthX", project: "Decentralized Auth", tags: ["Web3", "Go", "Cryptography"], color: "bg-emerald-500/10 text-emerald-500" },
  { name: "Mia Wong", role: "Product Designer", project: "Glass UI Kit", tags: ["Design", "React", "Framer"], color: "bg-accent/10 text-accent" },
  { name: "James Dev", role: "Full Stack Developer", project: "Realtime Collaboration", tags: ["Node.js", "Redis", "WebSockets"], color: "bg-violet-500/10 text-violet-500" },
  { name: "Elena R.", role: "Hardware Engineer", project: "Open Compute Node", tags: ["C++", "Hardware", "IoT"], color: "bg-rose-500/10 text-rose-500" },
];

export const MarqueeSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center mb-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-secondary/30 text-muted-foreground text-xs font-semibold mb-6 tracking-wide shadow-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Global Builder Network
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6 max-w-2xl">
          Built by the community, <br className="hidden md:block"/> for the community.
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mb-8">
          Join thousands of verified founders, engineers, and designers turning ambitious ideas into reality every day.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Top Marquee */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max min-w-full shrink-0 animate-marquee items-center justify-around gap-6 py-4 [animation-duration:40s]">
            {[...MOCK_DATA, ...MOCK_DATA].map((data, i) => (
              <CommunityCard key={i} {...data} />
            ))}
          </div>
        </div>
        
        {/* Bottom Marquee (Reverse) */}
        <div className="flex w-full overflow-hidden mt-2">
          <div className="flex w-max min-w-full shrink-0 animate-marquee items-center justify-around gap-6 py-4 [animation-duration:50s] [animation-direction:reverse]">
            {[...MOCK_DATA.reverse(), ...MOCK_DATA.reverse()].map((data, i) => (
              <CommunityCard key={i} {...data} />
            ))}
          </div>
        </div>

        {/* Fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};
