import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Search } from 'lucide-react';
import SmoothDrawer from '@/components/kokonutui/smooth-drawer';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import SlideTextButton from '@/components/kokonutui/slide-text-button';

const navItems = [
  { name: 'Ideas', href: '/discover?tab=ideas' },
  { name: 'Projects', href: '/discover?tab=projects' },
  { name: 'Mentors', href: '/discover?tab=mentors' },
  { name: 'Network', href: '/network' },
];

const NavLinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHoveredIndex(null)}>
      {navItems.map((item, index) => {
        const isActive = hoveredIndex === index;
        const isCurrent = location.pathname + location.search === item.href;
        
        return (
          <div key={item.name} className="relative" onMouseEnter={() => setHoveredIndex(index)}>
            <Link
              to={item.href}
              className={`relative px-4 py-1.5 text-[14px] font-medium tracking-tight transition-colors duration-200 block z-10 ${
                isCurrent 
                  ? 'text-foreground' 
                  : isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 bg-background rounded-full border border-border shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {item.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-[1400px]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center pl-2 group shrink-0">
            <span className="text-[20px] font-bold tracking-tight transition-transform duration-300 group-hover:scale-95">
              <span className="text-foreground">ad</span>
              <span className="text-accent">yes</span>
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <NavLinks />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0 pr-1">
            
            <AnimatedThemeToggler />

            {user ? (
              <SlideTextButton 
                text="Dashboard"
                hoverText="Go to App"
                href="/dashboard"
                className="hidden lg:flex h-10 px-5 text-sm md:min-w-32"
              />
            ) : (
              <div className="hidden lg:flex items-center gap-2 ml-1">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <SlideTextButton 
                  text="Sign up"
                  hoverText="Join Now"
                  href="/register"
                  className="h-10 px-5 text-sm md:min-w-28"
                />
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-2">
              <SmoothDrawer 
                title="Adyes Menu"
                description="Navigate through the platform."
                primaryButtonText={user ? "Dashboard" : "Sign Up"}
                secondaryButtonText={user ? "Sign Out" : "Log In"}
                onSecondaryAction={() => navigate(user ? '/logout' : '/login')}
                price={0}
                discountedPrice={0}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
