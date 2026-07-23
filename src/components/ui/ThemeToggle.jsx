import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';

// Force dark mode always - the app is designed for dark mode
export default function ThemeToggle({ className }) {
 useEffect(() => {
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');
 }, []);

 // Still render the button but it does nothing visible
 // This prevents layout shifts from removing the component
 return (
 <button
  type="button"
  className={cn(
 "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
  className
  )}
  title="Dark mode"
  aria-label="Dark mode"
 >
  <Moon size={16} strokeWidth={1.75} />
 </button>
 );
}
