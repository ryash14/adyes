import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-4 backdrop-blur-xl bg-background/70 border-b border-border shadow-md' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] group">
          <div className="h-10 w-10 bg-foreground text-background rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors shadow-lg">
            <Command size={20} strokeWidth={2.5} />
          </div>
          <span className="group-hover:text-accent transition-colors">Hub.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all relative group">
            Features
            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent transition-all group-hover:w-full"></span>
          </a>
          <a href="#about" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all relative group">
            About
            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent transition-all group-hover:w-full"></span>
          </a>
          <ThemeToggle />
          <Button variant="primary" size="sm" className="shadow-[4px_4px_0_0_#CCFF00] hover:shadow-[2px_2px_0_0_#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] transition-all" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
