import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="relative mb-8">
          <div className="text-[120px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-900 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Page not found</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you typed the address incorrectly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            onClick={() => navigate('/')}
            variant="primary"
            className="h-12 px-8 w-full sm:w-auto"
          >
            <Home className="mr-2" size={18} />
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/discover')}
            variant="outline"
            className="h-12 px-8 w-full sm:w-auto"
          >
            <Search className="mr-2" size={18} />
            Discover Ideas
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
