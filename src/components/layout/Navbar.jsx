import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Command, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] group">
            <div className="h-10 w-10 bg-foreground text-background rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors shadow-lg">
              <Command size={20} strokeWidth={2.5} />
            </div>
            <span className="group-hover:text-accent transition-colors hidden sm:block">Hub.</span>
          </Link>
        </div>
        
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

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border mt-4 bg-background/95 backdrop-blur-xl"
        >
          <div className="flex flex-col px-6 py-6 gap-6">
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
            >
              Features
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
            >
              About
            </a>
            <Button 
              variant="primary" 
              className="w-full mt-2" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
