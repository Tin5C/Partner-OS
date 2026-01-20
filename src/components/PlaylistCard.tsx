import { useNavigate } from 'react-router-dom';
import { 
  Star, Building2, Radar, MessageCircle, Trophy, 
  Newspaper, Users, Briefcase, Calendar, UserCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Playlist } from '@/lib/data';

const iconMap = {
  star: Star,
  building: Building2,
  radar: Radar,
  'message-circle': MessageCircle,
  trophy: Trophy,
  newspaper: Newspaper,
  users: Users,
  briefcase: Briefcase,
  calendar: Calendar,
  'user-circle': UserCircle,
};

const categoryColors = {
  essentials: 'from-primary/20 to-primary/5',
  accounts: 'from-blue-500/20 to-blue-500/5',
  competitive: 'from-orange-500/20 to-orange-500/5',
  skills: 'from-purple-500/20 to-purple-500/5',
  news: 'from-emerald-500/20 to-emerald-500/5',
  wins: 'from-amber-500/20 to-amber-500/5',
  team: 'from-pink-500/20 to-pink-500/5',
  events: 'from-cyan-500/20 to-cyan-500/5',
  brand: 'from-violet-500/20 to-violet-500/5',
};

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: 'default' | 'compact';
  className?: string;
}

export function PlaylistCard({ playlist, variant = 'default', className }: PlaylistCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[playlist.icon as keyof typeof iconMap] || Briefcase;
  const gradient = categoryColors[playlist.category];

  if (variant === 'compact') {
    return (
      <button
        onClick={() => navigate(`/playlist/${playlist.id}`)}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-card text-left',
          'shadow-card hover:shadow-card-hover transition-all duration-200',
          'hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
      >
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          'bg-gradient-to-br',
          gradient
        )}>
          <Icon className="w-5 h-5 text-foreground/70" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{playlist.title}</h3>
          <p className="text-xs text-muted-foreground">
            {playlist.episodeCount} episodes · {playlist.totalMinutes} min
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className={cn(
        'flex flex-col p-4 rounded-2xl bg-card text-left',
        'shadow-card hover:shadow-card-hover transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
        'bg-gradient-to-br',
        gradient
      )}>
        <Icon className="w-6 h-6 text-foreground/70" />
      </div>
      <h3 className="font-semibold text-sm mb-1">{playlist.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {playlist.description}
      </p>
      <p className="text-xs text-muted-foreground mt-auto">
        {playlist.episodeCount} episodes · {playlist.totalMinutes} min
      </p>
    </button>
  );
}
