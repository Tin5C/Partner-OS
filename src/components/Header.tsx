import { Search, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import userAvatar from '@/assets/user-avatar.jpg';

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
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
            <img 
              src={userAvatar} 
              alt={user?.name || 'User'} 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
            />
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
          
          {location.pathname !== '/' && (
            <button
              onClick={() => {
                logout();
                navigate('/gate');
              }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
