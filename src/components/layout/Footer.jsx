import React from 'react';

export function Footer() {
 return (
 <footer className="py-12 px-6 border-t border-border bg-background">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
 <div className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground">
 COLLAB HUB.
 </div>
 <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
 <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
 <a href="#" className="hover:text-foreground transition-colors">Discord</a>
 <a href="#" className="hover:text-foreground transition-colors">Github</a>
 </div>
 <div className="text-[10px] font-medium tracking-widest text-muted-foreground">
 &copy; {new Date().getFullYear()} COLLAB HUB. ALL RIGHTS RESERVED.
 </div>
 </div>
 </footer>
 );
}
