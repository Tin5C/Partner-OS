import { Search, ArrowLeftRight, Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExperience } from '@/contexts/ExperienceContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TenantHeaderProps {
  title?: string;
  showSearch?: boolean;
  showGreeting?: boolean;
  className?: string;
}

export function TenantHeader({ 
  title, 
  showSearch = false, 
  showGreeting = false,
  className 
}: TenantHeaderProps) {
  const navigate = useNavigate();
  const { audience, tenantSlug, tenantConfig } = useExperience();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSwitch = () => {
    // Clear session and go to selector
    navigate('/');
  };

  const TenantIcon = audience === 'partner' ? Building2 : User;
  const displayName = tenantConfig?.displayName || tenantSlug;

  // Construct search path based on audience route
  const getSearchPath = () => {
    return `/${audience}/${tenantSlug}/search`;
  };

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-gradient-header safe-top',
      'px-5 pt-6 pb-4',
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Tenant indicator */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
              <TenantIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="min-w-0">
            {showGreeting ? (
              <div>
                <p className="text-caption text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-title truncate">{displayName}</h1>
              </div>
            ) : title ? (
              <div>
                <p className="text-caption text-muted-foreground truncate">{displayName}</p>
                <h1 className="text-title truncate">{title}</h1>
              </div>
            ) : (
              <div>
                <p className="text-caption text-muted-foreground capitalize">{audience} Portal</p>
                <h1 className="text-title truncate">{displayName}</h1>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              onClick={() => navigate(getSearchPath())}
              className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          {/* Switch tenant button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
                title="Switch portal"
              >
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-card-hover">
              <DropdownMenuItem onClick={handleSwitch} className="rounded-lg">
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Switch portal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
