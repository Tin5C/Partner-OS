import { useNavigate } from 'react-router-dom';
import { Play, Pause, Clock, User, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, formatDuration } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';

interface EpisodeRowProps {
  episode: Episode;
  showPlaylist?: boolean;
  showProgress?: boolean;
  progress?: number;
  variant?: 'default' | 'compact' | 'trending';
  className?: string;
}

export function EpisodeRow({ 
  episode, 
  showPlaylist = false,
  showProgress = false,
  progress = 0,
  variant = 'default',
  className 
}: EpisodeRowProps) {
  const navigate = useNavigate();
  const { currentEpisode, isPlaying, play, pause } = usePlayer();
  const { isAdmin } = useAuth();
  
  const isCurrentEpisode = currentEpisode?.id === episode.id;
  const isThisPlaying = isCurrentEpisode && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisPlaying) {
      pause();
    } else {
      play(episode);
    }
  };

  const handleRowClick = () => {
    navigate(`/episode/${episode.id}`);
  };

  if (variant === 'trending') {
    return (
      <button
        onClick={handleRowClick}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-card text-left w-full',
          'shadow-card hover:shadow-card-hover transition-all duration-200',
          'hover:scale-[1.01] active:scale-[0.99]',
          className
        )}
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{episode.title}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {episode.speaker} · {formatDuration(episode.duration)}
          </p>
        </div>
        <button
          onClick={handlePlayClick}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
        >
          {isThisPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleRowClick}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg text-left w-full',
          'hover:bg-muted/50 transition-colors',
          className
        )}
      >
        <button
          onClick={handlePlayClick}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {isThisPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{episode.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDuration(episode.duration)}</span>
            <span>·</span>
            <span>{episode.speaker}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleRowClick}
      className={cn(
        'flex flex-col gap-3 p-4 rounded-xl bg-card text-left w-full',
        'shadow-card hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handlePlayClick}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
            isThisPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
          )}
        >
          {isThisPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{episode.title}</h4>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {episode.speaker}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(episode.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {isAdmin && episode.plays && (
              <span className="text-primary font-medium">
                {episode.plays} plays
              </span>
            )}
          </div>

          {episode.takeaways.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
              Key: {episode.takeaways[0]}
            </p>
          )}
        </div>
      </div>

      {showProgress && progress > 0 && (
        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-progress rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
}
