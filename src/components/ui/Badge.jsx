import { cn } from '../../utils/cn';

const VARIANTS = {
  default: 'bg-secondary text-foreground border border-border',
  secondary: 'bg-background text-foreground border border-border',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
  outline: 'bg-transparent text-foreground border border-border',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
      VARIANTS[variant] || VARIANTS.default,
      className
    )}>
      {children}
    </span>
  );
}
