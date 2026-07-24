import { cn } from '../../utils/cn';

export function PageContainer({ children, className = '' }) {
 return (
 <div className={cn("w-[80%] max-w-[1400px] mx-auto py-10", className)}>
 {children}
 </div>
 );
}

export function PageHeader({ eyebrow, title, subtitle, actions, children, className }) {
 return (
 <div className={cn("flex flex-col gap-6 mb-10", className)}>
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div className="space-y-2">
 {eyebrow && (
 <p className="eyebrow">
 {eyebrow}
 </p>
 )}
 <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
 {title}
 </h1>
 {subtitle && (
 <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
 {subtitle}
 </p>
 )}
 </div>
 {actions && <div className="flex items-center gap-3">{actions}</div>}
 </div>
 {children}
 </div>
 );
}
