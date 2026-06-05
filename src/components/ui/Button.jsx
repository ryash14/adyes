import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, asChild = false, ...props }, ref) => {
 const Comp = asChild ? motion.div : motion.button;
 
 const variants = {
 primary: 'bg-accent text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] hover:-translate-y-0.5 border border-accent/50',
 secondary: 'bg-zinc-900/80 text-foreground border border-white/10 shadow-lg hover:-translate-y-0.5 hover:bg-zinc-800 hover:border-white/20',
 outline: 'bg-transparent text-foreground border border-white/10 shadow-sm hover:bg-white/5 hover:border-white/20',
 ghost: 'hover:bg-white/5 text-muted-foreground hover:text-foreground',
 link: 'underline-offset-4 hover:underline text-accent',
 };

 const sizes = {
 default: 'h-11 px-5 py-2',
 sm: 'h-9 px-4 text-xs',
 lg: 'h-14 px-8 text-lg',
 icon: 'h-10 w-10',
 };

 return (
 <Comp
 className={cn(
 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
 variants[variant],
 sizes[size],
 className
 )}
 ref={ref}
 whileTap={{ scale: 0.97 }}
 {...props}
 >
 {children}
 </Comp>
 );
});
Button.displayName = 'Button';

export { Button };
