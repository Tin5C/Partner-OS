import { useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, X, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';
import { FocusCard, focusEpisodes } from '@/lib/focusCards';
import { formatDuration } from '@/lib/data';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewDrawerProps {
  card: FocusCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDrawer({ card, open, onOpenChange }: PreviewDrawerProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { 
    currentEpisode, 
    isPlaying, 
    progress,
    playbackSpeed,
    play, 
    togglePlay, 
    skip,
    seek,
    setSpeed,
  } = usePlayer();

  if (!card) return null;

  const episode = focusEpisodes[card.id];
  const isCurrentCard = currentEpisode?.id === episode?.id;
  const isCardPlaying = isCurrentCard && isPlaying;

  const handlePlay = () => {
    if (episode) {
      if (isCurrentCard) {
        togglePlay();
      } else {
        play(episode);
      }
    }
  };

  const handleSecondaryAction = () => {
    if (card.secondaryAction?.action === 'open-playlist' && card.linkedPlaylistId) {
      onOpenChange(false);
      navigate(`/playlist/${card.linkedPlaylistId}`);
    } else if (card.secondaryAction?.action === 'view-scorecard') {
      // Could navigate to a scorecard page
      onOpenChange(false);
    }
  };

  const handleOpenPlaylist = () => {
    if (card.linkedPlaylistId) {
      onOpenChange(false);
      navigate(`/playlist/${card.linkedPlaylistId}`);
    }
  };

  const cycleSpeed = () => {
    const speeds: Array<1 | 1.25 | 1.5> = [1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    seek(newProgress);
  };

  const currentTime = isCurrentCard && episode 
    ? Math.floor((progress / 100) * episode.duration) 
    : 0;
  const totalDuration = episode?.duration || 360;
  const remainingTime = totalDuration - currentTime;

  const content = (
    <div className="flex flex-col h-full">
      {/* Header with Play Button */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-start gap-4">
          {/* Big Play Button */}
          <button
            onClick={handlePlay}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0',
              'bg-primary text-primary-foreground shadow-lg',
              'hover:scale-105 active:scale-95 transition-transform'
            )}
          >
            {isCardPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>

          <div className="flex-1 min-w-0 pt-1">
            <h2 className="font-semibold text-lg leading-tight">{card.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{card.subtitle}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {card.timeEstimate}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Controls - Show when playing this card */}
        {isCurrentCard && (
          <div className="mt-4 space-y-3">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div 
                className="h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDuration(currentTime)}</span>
                <span>-{formatDuration(remainingTime)}</span>
              </div>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={cycleSpeed}
                className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium hover:bg-muted/80 transition-colors min-w-[2.5rem]"
              >
                {playbackSpeed}x
              </button>
              
              <button
                onClick={() => skip(-15)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors relative"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="absolute text-[10px] font-medium">15</span>
              </button>
              
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <button
                onClick={() => skip(15)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors relative"
              >
                <RotateCw className="w-4 h-4" />
                <span className="absolute text-[10px] font-medium">15</span>
              </button>
              
              <div className="w-[2.5rem]" />
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Bullets */}
        <ul className="space-y-2">
          {card.previewBullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Insight Line */}
        {card.insightLine && (
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {card.insightLabel || 'Key insight'}
            </p>
            <p className="text-sm font-medium">{card.insightLine}</p>
          </div>
        )}

        {/* Listen For Chips */}
        {card.listenFor && card.listenFor.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Listen for</p>
            <div className="flex flex-wrap gap-2">
              {card.listenFor.map((term, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-tag text-tag-foreground text-xs"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Move */}
        {card.suggestedMove && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs font-medium text-primary mb-1">Suggested move</p>
            <p className="text-sm">{card.suggestedMove}</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground italic">{card.footer}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
            >
              {tag.label}: {tag.value}
            </span>
          ))}
          <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
            Time: {card.timeEstimate}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Last updated: {card.lastUpdated}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {card.primaryAction === 'play' ? (
            <button
              onClick={handlePlay}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {isCardPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isCardPlaying ? 'Pause' : 'Play'}
            </button>
          ) : (
            <button
              onClick={handleOpenPlaylist}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Open {card.title}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {card.secondaryAction && (
            <button
              onClick={handleSecondaryAction}
              className="py-3 px-4 rounded-xl bg-muted text-foreground font-medium flex items-center gap-2 hover:bg-muted/80 transition-colors"
            >
              {card.secondaryAction.label}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile: Bottom sheet (Drawer)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{card.title}</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Right side panel (Sheet)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] p-0 overflow-hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>{card.title}</SheetTitle>
        </SheetHeader>
        <div className="h-full pt-12">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
