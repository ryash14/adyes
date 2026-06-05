import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';

const getPreferredTheme = () => {
 const saved = localStorage.getItem('theme');
 if (saved === 'light' || saved === 'dark') return saved;
 if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
 return 'light';
};

export default function ThemeToggle({ className }) {
 const [theme, setTheme] = useState(() => getPreferredTheme());

 const applyTheme = (nextTheme) => {
 if (nextTheme === 'dark') {
 document.documentElement.classList.add('dark');
 } else {
 document.documentElement.classList.remove('dark');
 }
 };

 useEffect(() => {
 applyTheme(theme);
 }, [theme]);

 useEffect(() => {
 const media = window.matchMedia?.('(prefers-color-scheme: dark)');
 if (!media) return undefined;

 const handleChange = (event) => {
 if (localStorage.getItem('theme')) return;
 setTheme(event.matches ? 'dark' : 'light');
 };

 media.addEventListener?.('change', handleChange);
 return () => media.removeEventListener?.('change', handleChange);
 }, []);

 const toggle = () => {
 const next = theme === 'dark' ? 'light' : 'dark';
 setTheme(next);
 localStorage.setItem('theme', next);
 };

 return (
 <button
 type="button"
 onClick={toggle}
 className={cn(
"inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
 className
 )}
 title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
 aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
 >
 {theme === 'dark' ? (
 <Sun size={16} strokeWidth={1.75} />
 ) : (
 <Moon size={16} strokeWidth={1.75} />
 )}
 </button>
 );
}
