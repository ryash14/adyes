import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-border/50 dark:border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md px-4 py-2 text-sm font-medium transition-all duration-300 shadow-sm",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent/50 focus-visible:bg-zinc-50 dark:focus-visible:bg-zinc-900/60",
        "hover:border-border dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "text-foreground",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
