import { memo, useEffect, useState } from 'react';
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
  ChevronLeft,
  ChevronRight
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

const NavButton = memo(function NavButton({ item, active, onClick, variant = 'sidebar' }) {
  const Icon = item.icon;

  if (variant === 'bottom') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground transition-all duration-200",
          active && "text-accent font-medium"
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? "text-accent" : ""} />
        <span className="text-[10px] font-medium mt-1">{item.label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active 
          ? "bg-white/5 text-foreground shadow-[inset_2px_0_0_0_#CCFF00]" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon 
        size={20} 
        strokeWidth={active ? 2.5 : 2} 
        className={cn("transition-colors", active ? "text-accent" : "group-hover:text-foreground")} 
      />
      <span>{item.label}</span>
    </button>
  );
});

export default function AppShell({ children, fullBleed = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/messages');
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem('collabhub.sidebarVisible');
    return stored === null ? true : stored === 'true';
  });

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = profile?.displayName?.charAt(0).toUpperCase() || '?';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('collabhub.sidebarVisible', String(sidebarVisible));
  }, [sidebarVisible]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-accent selection:text-black">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-border/50 transition-transform duration-300",
        !sidebarVisible && "-translate-x-full md:hidden"
      )}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-border/50">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-lg font-bold tracking-tight hover:text-accent transition-colors"
          >
            <div className="h-10 w-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
              <Command size={20} strokeWidth={2.5} />
            </div>
            <span>CollabHub</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarVisible(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Hide sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
          <p className="px-4 mb-3 text-xs font-semibold text-muted-foreground">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </nav>

          <p className="px-4 mt-10 mb-3 text-xs font-semibold text-muted-foreground">
            Preferences
          </p>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className={cn(
                "group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive('/settings') ? "bg-white/5 text-foreground shadow-[inset_2px_0_0_0_#CCFF00]" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Settings size={20} strokeWidth={isActive('/settings') ? 2.5 : 2} className={isActive('/settings') ? "text-accent" : "group-hover:text-foreground"} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border/50">
          <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-4 flex flex-col gap-4 border border-border/50 shadow-sm">
            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-zinc-800 p-2"
              onClick={() => navigate(`/profile/${profile?.id}`)}
            >
              <Avatar
                src={profile?.photoURL}
                fallback={initials}
                size="md"
              />
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="text-sm font-bold truncate w-full group-hover:text-accent transition-colors">{profile?.displayName}</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member</span>
              </div>
            </button>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <NotificationCenter placement="above" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex md:hidden sticky top-0 z-40 h-16 w-full items-center justify-between border-b border-border bg-white dark:bg-zinc-950 px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-base font-black uppercase tracking-widest"
          >
            <div className="h-8 w-8 bg-foreground text-background rounded-lg flex items-center justify-center">
              <Command size={16} strokeWidth={2.5} />
            </div>
            <span>Hub.</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificationCenter placement="below" />
          <Link to={`/profile/${profile?.id}`}>
            <Avatar src={profile?.photoURL} fallback={initials} size="sm" />
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-[80%] max-w-sm bg-background border-r border-border p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.2em]"
              >
                <div className="h-10 w-10 bg-foreground text-background rounded-xl flex items-center justify-center">
                  <Command size={20} strokeWidth={2.5} />
                </div>
                <span>Hub.</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-8">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Workspace</p>
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <NavButton
                    key={item.path}
                    item={item}
                    active={isActive(item.path)}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                  />
                ))}
              </nav>
              <div className="mt-12">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Preferences</p>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setMobileOpen(false);
                  }}
                  className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-zinc-900 transition-colors"
                >
                  <Settings size={20} strokeWidth={2} className="group-hover:text-foreground" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border">
              <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-zinc-800 p-2"
                  onClick={() => { navigate(`/profile/${profile?.id}`); setMobileOpen(false); }}
                >
                  <Avatar
                    src={profile?.photoURL}
                    fallback={initials}
                    size="md"
                  />
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <span className="text-sm font-bold truncate w-full">{profile?.displayName}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Member</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border border-destructive text-destructive font-bold uppercase tracking-wider text-xs hover:bg-destructive hover:text-black transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen relative transition-all duration-300",
        sidebarVisible ? "md:pl-72" : "md:pl-0",
        (fullBleed || isMessages) ? "h-screen" : "pb-10"
      )}>
        {!sidebarVisible && (
          <button
            type="button"
            onClick={() => setSidebarVisible(true)}
            className="hidden md:inline-flex items-center justify-center rounded-xl border border-border bg-background h-10 w-10 text-muted-foreground shadow-sm hover:text-accent hover:border-accent fixed left-4 top-4 z-[60] transition-colors"
            aria-label="Show sidebar"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        )}
        <div className={cn(
          "h-full",
          !(fullBleed || isMessages) && "max-w-[1400px] mx-auto px-6 md:px-12 py-12"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
