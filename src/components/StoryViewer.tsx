import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Play, Pause, RotateCcw, RotateCw, 
  Bookmark, BookmarkCheck, Share2, ExternalLink 
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StoryItem, storyTypeColors, storyTypeLabels } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface StoryViewerProps {
  story: StoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onMarkListened: (storyId: string) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
}

type PlaybackSpeed = 1 | 1.25 | 1.5;

export function StoryViewer({ 
  story, 
  open, 
  onOpenChange, 
  onClose,
  onMarkListened,
  isSaved,
  onToggleSave 
}: StoryViewerProps) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);

  const hasAudio = !!story?.audioUrl;
  const durationSec = story?.durationSec || 20;

  // Reset state when story changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setPlaybackSpeed(1);
  }, [story?.id]);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying || !hasAudio) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = (100 / durationSec) * (playbackSpeed / 10);
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          setIsPlaying(false);
          if (story) onMarkListened(story.id);
          return 100;
        }
        
        // Mark as listened at 80%
        if (newProgress >= 80 && prev < 80 && story) {
          onMarkListened(story.id);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, hasAudio, durationSec, playbackSpeed, story, onMarkListened]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const skip = useCallback((seconds: number) => {
    const progressPerSecond = 100 / durationSec;
    setProgress(prev => Math.max(0, Math.min(100, prev + seconds * progressPerSecond)));
  }, [durationSec]);

  const cycleSpeed = useCallback(() => {
    setPlaybackSpeed(prev => {
      if (prev === 1) return 1.25;
      if (prev === 1.25) return 1.5;
      return 1;
    });
  }, []);

  const formatTime = (progressPercent: number) => {
    const seconds = Math.round((progressPercent / 100) * durationSec);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = () => {
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenFullEpisode = () => {
    if (story?.relatedEpisodeId) {
      navigate(`/episode/${story.relatedEpisodeId}`);
      onClose();
    } else if (story?.relatedPlaylistId) {
      navigate(`/playlists/${story.relatedPlaylistId}`);
      onClose();
    }
  };

  const handleShare = async () => {
    if (!story) return;
    
    try {
      await navigator.share({
        title: story.title,
        text: story.bullets.join('\n'),
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${story.title}\n\n${story.bullets.join('\n')}`);
    }
  };

  const canOpenEpisode = story?.relatedEpisodeId || story?.relatedPlaylistId;

  if (!story) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        // Mobile: full screen
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        // Desktop: centered modal
        "sm:max-w-md sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{story.title}</DialogTitle>
        
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <span className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border",
            storyTypeColors[story.type]
          )}>
            {storyTypeLabels[story.type]}
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Hero image */}
          {story.imageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <img 
                src={story.imageUrl} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold leading-tight">{story.title}</h2>

          {/* Source chip */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Source:</span>
            {story.sourceUrl ? (
              <a 
                href={story.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {story.sourceName}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-xs text-foreground">{story.sourceName}</span>
            )}
          </div>

          {/* Audio Controls or Read Highlights label */}
          {hasAudio ? (
            <div className="space-y-4 p-4 rounded-xl bg-muted/50">
              {/* Play button + controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => skip(-15)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-primary-foreground" fill="currentColor" />
                  ) : (
                    <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                  )}
                </button>

                <button 
                  onClick={() => skip(15)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <Progress value={progress} className="h-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(progress)}</span>
                  <span>{formatDuration()}</span>
                </div>
              </div>

              {/* Speed toggle */}
              <div className="flex justify-center">
                <button
                  onClick={cycleSpeed}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <span className="text-sm text-muted-foreground">Read highlights</span>
            </div>
          )}

          {/* Bullets */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Key highlights</h3>
            <ul className="space-y-2">
              {story.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why it matters */}
          {story.whyItMatters && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm">
                <span className="font-medium text-primary">Why it matters: </span>
                {story.whyItMatters}
              </p>
            </div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border/50 space-y-3">
          {/* Primary CTA */}
          <Button 
            className="w-full" 
            onClick={handleOpenFullEpisode}
            disabled={!canOpenEpisode}
          >
            {canOpenEpisode ? 'Open full episode' : 'Episode not linked yet'}
          </Button>

          {/* Secondary actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onToggleSave(story.id)}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share internally
            </Button>
          </div>

          {/* Mark as listened (manual) */}
          {hasAudio && progress < 80 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-muted-foreground"
              onClick={() => onMarkListened(story.id)}
            >
              Mark as listened
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
