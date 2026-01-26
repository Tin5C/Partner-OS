import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ListMusic, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: ListMusic, label: 'Playlists', path: '/playlists' },
  { icon: Plus, label: 'Create', path: null },
  { icon: Settings, label: 'Admin', path: '/admin', adminOnly: true },
];

const createOptions = [
  { 
    title: 'Win-Wire', 
    description: 'Turn a win into a reusable story in under 3 minutes.',
    path: '/create/win-wire',
    icon: '🏆'
  },
  { 
    title: 'Monthly Learnings', 
    description: 'Share 3 quick learnings with your team.',
    path: '/create/learnings',
    icon: '💡'
  },
  { 
    title: 'Request a Briefing', 
    description: 'Ask the team to create a briefing on a topic.',
    path: '/create/request',
    icon: '📝'
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { currentEpisode } = usePlayer();
  const [createOpen, setCreateOpen] = useState(false);

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-bottom shadow-card',
      'md:hidden',
      currentEpisode && 'bottom-[72px]'
    )}>
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => {
          const isActive = item.path === location.pathname;
          
          if (item.path === null) {
            return (
              <Sheet key={item.label} open={createOpen} onOpenChange={setCreateOpen}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center justify-center gap-1 px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center -mt-4 shadow-card">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xs font-medium text-muted-foreground">
                      {item.label}
                    </span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl border-t border-border shadow-card-hover">
                  <SheetHeader>
                    <SheetTitle className="text-left text-section">Create</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-3 mt-4 pb-safe-bottom">
                    {createOptions.map((option) => (
                      <button
                        key={option.path}
                        onClick={() => {
                          setCreateOpen(false);
                          navigate(option.path);
                        }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-secondary text-left hover:bg-secondary/80 hover:shadow-card transition-all duration-200 border border-border/50"
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <h3 className="font-semibold text-body">{option.title}</h3>
                          <p className="text-caption text-muted-foreground">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              <span className={cn('text-2xs', isActive ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
