import { Search, LogOut, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import userAvatar from '@/assets/user-avatar.jpg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showGreeting?: boolean;
  className?: string;
}

export function Header({ 
  title, 
  showSearch = false, 
  showGreeting = false,
  className 
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchUser } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSwitchUser = () => {
    switchUser();
    navigate('/gate');
  };

  const handleLogout = () => {
    logout();
    navigate('/gate');
  };

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-gradient-header safe-top',
      'px-5 pt-6 pb-4',
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showGreeting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full">
                  <img 
                    src={userAvatar} 
                    alt={user?.name || 'User'} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-border hover:ring-primary/40 transition-all shadow-card"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-xl shadow-card-hover">
                <DropdownMenuItem onClick={handleSwitchUser} className="rounded-lg">
                  <Users className="w-4 h-4 mr-2" />
                  Switch user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="min-w-0">
            {showGreeting ? (
              <div>
                <p className="text-caption text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-title truncate">{user?.name}</h1>
              </div>
            ) : title ? (
              <h1 className="text-title truncate">{title}</h1>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              onClick={() => navigate('/search')}
              className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          {location.pathname !== '/' && !showGreeting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary hover:shadow-card transition-all duration-200 shadow-chip"
                  title="Account options"
                >
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-card-hover">
                <DropdownMenuItem onClick={handleSwitchUser} className="rounded-lg">
                  <Users className="w-4 h-4 mr-2" />
                  Switch user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
