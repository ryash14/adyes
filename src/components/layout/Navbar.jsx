import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Command, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
 const { user } = useAuth();
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
 <Link to="/" className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.25em] group">
 <div className="h-10 w-10 bg-gradient-to-tr from-foreground to-foreground/80 text-background rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 shadow-lg">
 <Command size={20} strokeWidth={2.5} />
 </div>
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-500 hidden sm:block">Hub.</span>
 </Link>
 </div>
 
 <div className="hidden md:flex items-center gap-8">
 <a href="#features" className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all duration-300 relative group py-2">
 Features
 <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-blue-400 transition-all duration-500 group-hover:w-full rounded-full"></span>
 </a>
 <a href="#about" className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all duration-300 relative group py-2">
 About
 <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-blue-400 transition-all duration-500 group-hover:w-full rounded-full"></span>
 </a>
 <ThemeToggle />
 {user ? (
 <Button variant="primary" size="sm" className="rounded-full px-6 h-10 font-bold tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300" onClick={() => navigate('/dashboard')}>
 Dashboard
 </Button>
 ) : (
 <Button variant="primary" size="sm" className="rounded-full px-6 h-10 font-bold tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300" onClick={() => navigate('/login')}>
 Sign In
 </Button>
 )}
 </div>

 {/* Mobile controls */}
 <div className="flex md:hidden items-center gap-3">
 <ThemeToggle />
 <button 
 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
 className="p-2 -mr-2 text-foreground hover:bg-muted rounded-lg transition-colors"
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
 {user ? (
 <Button 
 variant="primary" 
 className="w-full mt-2" 
 onClick={() => {
 setIsMobileMenuOpen(false);
 navigate('/dashboard');
 }}
 >
 Dashboard
 </Button>
 ) : (
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
 )}
 </div>
 </motion.div>
 )}
 </motion.nav>
 );
}
