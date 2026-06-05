import { cn } from '../../utils/cn';

const SIZE_MAP = {
 xs: 'h-6 w-6 text-[10px]',
 sm: 'h-8 w-8 text-xs',
 md: 'h-10 w-10 text-sm',
 lg: 'h-14 w-14 text-base',
 xl: 'h-24 w-24 text-xl md:h-32 md:w-32 md:text-2xl',
};

export default function Avatar({ src, fallback, size = 'md', className = '' }) {
 const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

 return (
 <div className={cn(
"relative flex shrink-0 overflow-hidden rounded-full bg-secondary border border-border select-none",
 sizeClasses,
 className
 )}>
 {src ? (
 <img 
 src={src} 
 alt={fallback ||"User avatar"} 
 className="aspect-square h-full w-full object-cover" 
 loading="lazy" 
 referrerPolicy="no-referrer"
 />
 ) : (
 <div className="flex h-full w-full items-center justify-center font-semibold text-muted-foreground bg-secondary">
 {fallback || '?'}
 </div>
 )}
 </div>
 );
}
