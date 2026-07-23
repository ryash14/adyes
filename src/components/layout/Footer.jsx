import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Brand */}
        <Link to="/" className="flex items-center group">
          <span className="text-[20px] font-bold tracking-tight">
            <span className="text-foreground">ad</span>
            <span className="text-accent">yes</span>
          </span>
        </Link>
        
        {/* Center: Links */}
        <div className="flex items-center gap-8">
          <Link to="/discover?tab=ideas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ideas</Link>
          <Link to="/discover?tab=projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
          <Link to="/discover?tab=mentors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Mentors</Link>
          <a href="https://discord.gg" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Discord</a>
        </div>
        
        {/* Right: Copyright */}
        <div className="text-sm font-medium text-muted-foreground/50">
          &copy; {new Date().getFullYear()} Adyes
        </div>

      </div>
    </footer>
  );
}
