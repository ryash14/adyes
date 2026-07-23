import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const isCurrentlyDark = root.classList.contains('dark');
    if (isCurrentlyDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button 
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
};

const navItems = [
  {
    name: 'Platform',
    dropdown: {
      cols: 2,
      items: [
        { title: 'Validation', desc: 'AI idea scoring engine' },
        { title: 'Network', desc: 'Portfolio-verified builders' },
        { title: 'Workspace', desc: 'Encrypted collaboration' },
        { title: 'Analytics', desc: 'Real-time project velocity' }
      ]
    }
  },
  {
    name: 'Solutions',
    dropdown: {
      cols: 2,
      items: [
        { title: 'For Founders', desc: 'Go from zero to one' },
        { title: 'For Engineers', desc: 'Find ambitious projects' },
        { title: 'For Designers', desc: 'Shape early products' },
        { title: 'For Teams', desc: 'Scale your workflow' }
      ]
    }
  },
  {
    name: 'Resources',
    dropdown: {
      cols: 2,
      items: [
        { title: 'Changelog', desc: 'Product updates' },
        { title: 'Documentation', desc: 'API & Guides' },
        { title: 'Community', desc: 'Discord server' },
        { title: 'Blog', desc: 'Insights and news' }
      ]
    }
  },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Enterprise', href: '#enterprise' },
];

const NavLinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHoveredIndex(null)}>
      {navItems.map((item, index) => {
        const isActive = hoveredIndex === index;
        return (
          <div 
            key={item.name} 
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <a
              href={item.href || `#${item.name.toLowerCase()}`}
              className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 block ${isActive ? 'text-slate-900 dark:text-white/90' : 'text-slate-500 dark:text-white/45'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 bg-slate-100 dark:bg-white/[0.06] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {item.name}
            </a>

            {/* Premium Iconless Grid Dropdown */}
            {item.dropdown && (
              <AnimatePresence>
                {isActive && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="w-max bg-white dark:bg-[#0a0d12] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] z-50 origin-top"
                    >
                      <div className={`grid grid-cols-${item.dropdown.cols} gap-x-8 gap-y-3`}>
                        {item.dropdown.items.map((drop, idx) => (
                          <a key={idx} href="#" className="flex flex-col gap-0.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group">
                            <p className="text-[13px] text-slate-800 dark:text-white/90 font-medium tracking-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{drop.title}</p>
                            <p className="text-[12px] text-slate-500 dark:text-white/40 leading-snug group-hover:text-slate-700 dark:group-hover:text-white/60 transition-colors">{drop.desc}</p>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
};

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
        <motion.nav 
          className="mx-auto max-w-[1100px] pointer-events-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div 
            className={`
              h-12 px-2 flex items-center justify-between rounded-full
              bg-white/95 dark:bg-[#0a0d12]/95 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] shadow-sm dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]
              transition-colors duration-500
            `}
          >
            {/* Left: Logo (Text Only) */}
            <Link to="/" className="flex items-center pl-3 group shrink-0">
              <span className="text-[16px] font-bold tracking-[-0.03em] transition-transform duration-300 group-hover:scale-95 group-active:scale-90">
                <span className="text-slate-900 dark:text-white transition-colors duration-500">ad</span>
                <span className="text-[#FF6363]">yes</span>
              </span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <NavLinks />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle />
              
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="h-8 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[13px] font-medium hover:scale-[0.97] transition-all duration-200 shadow-sm ml-1"
                >
                  Dashboard
                </button>
              ) : (
                <div className="hidden lg:flex items-center">
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-3.5 py-1.5 text-[13px] font-medium text-slate-500 dark:text-white/45 hover:text-slate-900 dark:hover:text-white/90 tracking-[-0.01em] transition-colors"
                  >
                    Log in
                  </button>
                  <div className="w-px h-3.5 bg-slate-200 dark:bg-white/[0.1] mx-1 transition-colors duration-500" />
                  <button 
                    onClick={() => navigate('/register')} 
                    className="ml-1 h-8 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[13px] font-medium tracking-[-0.01em] hover:scale-[0.97] hover:opacity-90 transition-all duration-200 shadow-sm"
                  >
                    Sign up
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/90 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors ml-1 mr-1"
              >
                <Menu size={16} />
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-[#0a0d12] flex flex-col transition-colors duration-500"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.04] transition-colors">
              <span className="text-[16px] font-bold tracking-[-0.03em]">
                <span className="text-slate-900 dark:text-white">ad</span>
                <span className="text-[#FF6363]">yes</span>
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/90 rounded-full bg-slate-100 dark:bg-white/[0.04] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 px-6 py-8 flex flex-col gap-8 overflow-y-auto">
              {navItems.map((item, i) => (
                <div key={item.name} className="flex flex-col gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a 
                      href={item.href || `#${item.name.toLowerCase()}`}
                      onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                      className="text-[24px] font-medium text-slate-800 dark:text-white/90 tracking-[-0.03em] transition-colors"
                    >
                      {item.name}
                    </a>
                  </motion.div>
                  
                  {item.dropdown && (
                    <div className="grid grid-cols-2 gap-4">
                      {item.dropdown.items.map((drop, idx) => (
                        <motion.a 
                          key={idx}
                          href="#"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 + idx * 0.05 + 0.1 }}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex flex-col group"
                        >
                          <span className="text-[14px] font-medium text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors">{drop.title}</span>
                          <span className="text-[12px] text-slate-400 dark:text-white/30 group-hover:text-slate-500 dark:group-hover:text-white/50 transition-colors mt-0.5">{drop.desc}</span>
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!user && (
              <div className="p-6 pb-12 flex flex-col gap-3 shrink-0 border-t border-slate-100 dark:border-white/[0.04] transition-colors">
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-800 dark:text-white/80 text-[15px] font-medium transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                  className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[15px] font-medium transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
