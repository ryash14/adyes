import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ y: -5 }}
    className={cn(
      "rounded-xl border-2 border-border bg-card text-card-foreground shadow-brutal dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] p-6 transition-all duration-300",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
));
Card.displayName = "Card";

export { Card };
