import { Command } from 'lucide-react';

export default function LoadingState({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 text-center w-full h-full min-h-[300px]">
      <div className="loader"></div>
      
      <div className="space-y-2 relative z-10 mt-12">
        <p className="text-sm font-bold tracking-[0.2em] text-foreground uppercase animate-pulse">{text}</p>
        <p className="text-xs text-muted-foreground font-medium">Please wait a moment</p>
      </div>
    </div>
  );
}
