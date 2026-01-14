import { Play, Pause, RotateCcw, RotateCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

interface AudioPlayerProps {
  variant?: 'mini' | 'full';
  className?: string;
}

export function AudioPlayer({ variant = 'mini', className }: AudioPlayerProps) {
  const navigate = useNavigate();
  const { 
    currentEpisode, 
    isPlaying, 
    progress, 
    playbackSpeed,
    togglePlay, 
    skip, 
    seek,
    setSpeed,
    pause 
  } = usePlayer();

  if (!currentEpisode) return null;

  const currentTime = Math.floor((progress / 100) * currentEpisode.duration);
  const remainingTime = currentEpisode.duration - currentTime;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    seek(newProgress);
  };

  const cycleSpeed = () => {
    const speeds: Array<1 | 1.25 | 1.5> = [1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  if (variant === 'mini') {
    return (
      <div 
        className={cn(
          'fixed bottom-16 left-0 right-0 z-40 px-4 pb-2',
          'md:bottom-0 md:left-auto md:right-4 md:w-96 md:pb-4',
          className
        )}
      >
        <div className="bg-player rounded-2xl shadow-player p-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/episode/${currentEpisode.id}`)}
              className="flex-1 min-w-0 text-left"
            >
              <h4 className="font-medium text-sm text-player-foreground truncate">
                {currentEpisode.title}
              </h4>
              <p className="text-xs text-player-foreground/60 truncate">
                {currentEpisode.speaker}
              </p>
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              <button
                onClick={() => pause()}
                className="w-8 h-8 rounded-full text-player-foreground/60 hover:text-player-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div 
            className="mt-2 h-1 bg-player-foreground/20 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-progress rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full player
  return (
    <div className={cn('bg-card rounded-2xl p-6', className)}>
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div 
            className="h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-progress rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatDuration(currentTime)}</span>
            <span>-{formatDuration(remainingTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={cycleSpeed}
            className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition-colors min-w-[3.5rem]"
          >
            {playbackSpeed}x
          </button>
          
          <button
            onClick={() => skip(-15)}
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="absolute text-2xs font-medium">15</span>
          </button>
          
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>
          
          <button
            onClick={() => skip(15)}
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <RotateCw className="w-5 h-5" />
            <span className="absolute text-2xs font-medium">15</span>
          </button>

          <div className="w-[3.5rem]" /> {/* Spacer for symmetry */}
        </div>
      </div>
    </div>
  );
}
