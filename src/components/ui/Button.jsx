import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, asChild = false, ...props }, ref) => {
 const Comp = asChild ? motion.div : motion.button;
 
 const variants = {
 primary: 'bg-white text-black font-semibold hover:bg-zinc-200 hover:-translate-y-0.5 border border-transparent',
 secondary: 'bg-[#1c1c1c] text-white border border-[#2a2a2a] hover:-translate-y-0.5 hover:bg-[#222222] hover:border-[#333333]',
 outline: 'bg-transparent text-white border border-[#2a2a2a] hover:bg-white/5 hover:border-[#444444]',
 ghost: 'hover:bg-white/5 text-[#888888] hover:text-white',
 link: 'underline-offset-4 hover:underline text-white',
 destructive: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
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
 'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
