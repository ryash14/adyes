import { memo, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
 LayoutDashboard,
 Search,
 Users,
 MessageSquare,
 LogOut,
 Settings,
 Command,
 Menu,
 X,
 User
} from 'lucide-react';
import NotificationCenter from '../NotificationCenter';
import ThemeToggle from '../ui/ThemeToggle';
import Avatar from '../ui/Avatar';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
 { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
 { icon: Search, label: 'Discover', path: '/discover' },
 { icon: Users, label: 'Network', path: '/network' },
 { icon: MessageSquare, label: 'Messages', path: '/messages' },
];

export default function AppShell({ children, fullBleed = false }) {
 const navigate = useNavigate();
 const location = useLocation();
 const isMessages = location.pathname.startsWith('/messages');
 const { profile, signOut } = useAuth();
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const dropdownRef = useRef(null);

 const isActive = (path) =>
 location.pathname === path || location.pathname.startsWith(`${path}/`);

 const handleSignOut = async () => {
 await signOut();
 navigate('/login');
 };

 const initials = profile?.displayName?.charAt(0).toUpperCase() || '?';

 // Close dropdown when clicking outside
 useEffect(() => {
 function handleClickOutside(event) {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
 setDropdownOpen(false);
 }
 }
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [dropdownRef]);

 // Close mobile menu on route change
 useEffect(() => {
 setMobileMenuOpen(false);
 }, [location.pathname]);

 return (
 <div className={cn("bg-background font-sans antialiased text-foreground selection:bg-accent selection:text-black flex flex-col", isMessages ? "h-[100dvh] overflow-hidden" : "min-h-screen")}>
 {/* Top Navigation Bar */}
 <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-all">
 <div className="flex h-16 items-center justify-between px-4 md:px-6">
      {/* Left: Logo */}
      <div className="flex items-center w-auto md:w-[200px]">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-xl font-black tracking-tight group"
        >
          <span className="text-foreground transition-colors duration-300">ad</span>
          <span className="text-accent transition-colors duration-300 group-hover:text-emerald-400">yes</span>
        </Link>
      </div>

      {/* Middle: Desktop Nav Links */}
      <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2",
                active 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={16} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions & Profile */}
      <div className="flex items-center justify-end w-auto md:w-[200px] gap-3">
 <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-border">
 <ThemeToggle />
 <NotificationCenter placement="below" />
 </div>

 {/* Profile Dropdown */}
 <div className="relative" ref={dropdownRef}>
 <button
 type="button"
 onClick={() => setDropdownOpen(!dropdownOpen)}
 className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-accent/50 transition-all focus:outline-none"
 >
 <Avatar src={profile?.photoURL} fallback={initials} size="sm" />
 </button>

 {/* Dropdown Menu */}
 {dropdownOpen && (
 <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
 <div className="px-4 py-3 border-b border-border bg-muted/30">
 <p className="text-sm font-bold truncate">{profile?.displayName}</p>
 <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
 </div>
 <div className="p-1">
 <button
 onClick={() => { setDropdownOpen(false); navigate(`/profile/${profile?.id}`); }}
 className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
 >
 <User size={16} /> Profile
 </button>
 <button
 onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
 className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
 >
 <Settings size={16} /> Settings
 </button>
 
 {/* Mobile Only Quick Toggles inside Dropdown */}
 <div className="sm:hidden border-t border-border mt-1 pt-1">
 <div className="px-3 py-2 flex items-center justify-between">
 <span className="text-sm font-medium">Theme</span>
 <ThemeToggle />
 </div>
 <div className="px-3 py-2 flex items-center justify-between">
 <span className="text-sm font-medium">Notifications</span>
 <NotificationCenter placement="below" />
 </div>
 </div>

 <div className="border-t border-border mt-1 pt-1">
 <button
 onClick={handleSignOut}
 className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
 >
 <LogOut size={16} /> Sign out
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </header>

 {/* Mobile Menu Dropdown (Nav Links) */}
 {mobileMenuOpen && (
 <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl absolute top-16 left-0 w-full z-40 shadow-lg animate-in fade-in slide-in-from-top-2">
 <nav className="flex flex-col p-4 gap-1">
 {NAV_ITEMS.map((item) => {
 const active = isActive(item.path);
 return (
 <Link
 key={item.path}
 to={item.path}
 className={cn(
"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-colors",
 active 
 ?"bg-secondary text-foreground" 
 :"text-muted-foreground hover:text-foreground hover:bg-secondary/50"
 )}
 >
 <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
 {item.label}
 </Link>
 );
 })}
 </nav>
 </div>
 )}

 {/* Main Content */}
 <main className={cn(
"relative w-full",
 (fullBleed || isMessages) ?"flex-1 flex flex-col min-h-0" :"flex-1 max-w-[1400px] mx-auto w-full p-6 md:p-10"
 )}>
 {children}
 </main>
 </div>
 );
}
