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
      'sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top',
      'px-4 pt-4 pb-2',
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showGreeting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full">
                  <img 
                    src={userAvatar} 
                    alt={user?.name || 'User'} 
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={handleSwitchUser}>
                  <Users className="w-4 h-4 mr-2" />
                  Switch user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="min-w-0">
            {showGreeting ? (
              <div>
                <p className="text-sm text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-xl font-bold truncate">{user?.name}</h1>
              </div>
            ) : title ? (
              <h1 className="text-xl font-bold truncate">{title}</h1>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              onClick={() => navigate('/search')}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          
          {location.pathname !== '/' && !showGreeting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  title="Account options"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSwitchUser}>
                  <Users className="w-4 h-4 mr-2" />
                  Switch user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
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
