import { MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';

export default function EmptyState({ icon: Icon = MessageSquare, title, text, className }) {
 return (
 <div className={cn("flex flex-col items-center justify-center p-10 text-center space-y-4 animate-fade-in", className)}>
 <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
 <Icon size={22} strokeWidth={1.75} />
 </div>
 <div className="space-y-1">
 {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
 {text && <p className="text-sm text-muted-foreground max-w-[320px] mx-auto leading-relaxed">{text}</p>}
 </div>
 </div>
 );
}
