// Space Header - Header component for /internal and /partner routes
// Uses SpaceContext instead of ExperienceContext

import { Search, ArrowLeftRight, Sparkles, Building2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '@/contexts/SpaceContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SpaceHeaderProps {
  title?: string;
  showSearch?: boolean;
  showGreeting?: boolean;
  className?: string;
}

export function SpaceHeader({ 
  title, 
  showSearch = false, 
  showGreeting = false,
  className 
}: SpaceHeaderProps) {
  const navigate = useNavigate();
  const { spaceType, spaceConfig } = useSpace();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSwitch = () => {
    navigate('/');
  };

  const SpaceIcon = spaceType === 'partner' ? Building2 : Sparkles;
  const displayName = spaceConfig.displayName;

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-gradient-header safe-top',
      'px-5 pt-6 pb-4',
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Space indicator */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-border",
              spaceType === 'partner' ? "bg-emerald-500/10" : "bg-primary/10"
            )}>
              <SpaceIcon className={cn(
                "w-6 h-6",
                spaceType === 'partner' ? "text-emerald-600" : "text-primary"
              )} />
            </div>
          </div>
          
          <div className="min-w-0">
            {showGreeting ? (
              <div>
                <p className="text-caption text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-title truncate">{displayName} Space</h1>
              </div>
            ) : title ? (
              <div>
                <p className="text-caption text-muted-foreground truncate">{displayName}</p>
                <h1 className="text-title truncate">{title}</h1>
              </div>
            ) : (
              <div>
                <p className="text-caption text-muted-foreground capitalize">{spaceType} Portal</p>
                <h1 className="text-title truncate">{displayName} Space</h1>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              onClick={() => {/* Search not implemented for space routes yet */}}
              className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          {/* Switch space button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
                title="Switch space"
              >
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-card-hover">
              <DropdownMenuItem onClick={handleSwitch} className="rounded-lg">
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Switch space
              </DropdownMenuItem>
              {spaceType === 'partner' && (
                <DropdownMenuItem onClick={() => navigate('/partner/strategy')} className="rounded-lg">
                  <Briefcase className="w-4 h-4 mr-2" />
                  AI Services Strategy
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
