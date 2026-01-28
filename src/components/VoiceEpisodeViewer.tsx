import { useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Mic, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { VoiceEpisode, Voice } from '@/lib/voices';
import { cn } from '@/lib/utils';

interface VoiceEpisodeViewerProps {
  episode: VoiceEpisode | null;
  voice: Voice | null;
  episodes: VoiceEpisode[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSeeAllClick?: () => void;
}

// Generate initials from a name
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function VoiceEpisodeViewer({
  episode,
  voice,
  episodes,
  open,
  onOpenChange,
  onClose,
  onSeeAllClick
}: VoiceEpisodeViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const sortedEpisodes = [...episodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  const currentIndex = episode ? sortedEpisodes.findIndex(ep => ep.id === episode.id) : -1;
  const hasNext = currentIndex < sortedEpisodes.length - 1;
  const hasPrev = currentIndex > 0;

  const navigateToEpisode = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < sortedEpisodes.length) {
      const newEpisode = sortedEpisodes[newIndex];
      setIsPlaying(false);
      setCoverError(false);
      // Dispatch custom event for navigation
      window.dispatchEvent(new CustomEvent('voice-episode-navigate', {
        detail: { episode: newEpisode, episodes: sortedEpisodes, voice }
      }));
    }
  }, [sortedEpisodes, voice]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      navigateToEpisode(currentIndex + 1);
    } else {
      onClose();
    }
  }, [hasNext, currentIndex, navigateToEpisode, onClose]);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      navigateToEpisode(currentIndex - 1);
    }
  }, [hasPrev, currentIndex, navigateToEpisode]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!episode || !voice) return null;

  const isVideo = episode.mediaType === 'video' && episode.videoUrl;
  const hasValidCover = episode.coverUrl && !coverError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        // Mobile: full screen
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        // Desktop: centered modal
        "sm:max-w-md sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{episode.hookTitle}</DialogTitle>
        
        {/* Header with Voice info + navigation */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {/* Voice avatar */}
            <Avatar className="w-10 h-10 border border-border">
              {voice.voiceAvatarUrl ? (
                <AvatarImage src={voice.voiceAvatarUrl} alt={voice.voiceName} />
              ) : null}
              <AvatarFallback className="bg-violet-500 text-white text-sm">
                {getInitials(voice.voiceName)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{voice.voiceName}</span>
                <span className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded border",
                  "bg-violet-100 text-violet-700 border-violet-200",
                  "dark:bg-violet-900/60 dark:text-violet-300 dark:border-violet-700"
                )}>
                  <Mic className="w-2.5 h-2.5" />
                  Voice
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{voice.voiceRole}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">
              {currentIndex + 1} / {sortedEpisodes.length}
            </span>
            {hasPrev && (
              <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {hasNext && (
              <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Media (image or video) */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
            {isVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={episode.videoUrl}
                  poster={episode.coverUrl}
                  className="w-full h-full object-cover"
                  playsInline
                  onClick={handlePlayVideo}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-violet-600 ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}
              </>
            ) : hasValidCover ? (
              <img 
                src={episode.coverUrl} 
                alt={episode.hookTitle}
                className="w-full h-full object-cover"
                onError={() => setCoverError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900">
                <Mic className="w-12 h-12 text-violet-400" />
              </div>
            )}
          </div>

          {/* Episode title */}
          <h2 className="text-xl font-semibold leading-tight">{episode.hookTitle}</h2>

          {/* Hook / Takeaway / Next Move structure */}
          <div className="space-y-4">
            {/* Hook */}
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm">
                <span className="font-medium text-muted-foreground">Hook: </span>
                {episode.hook}
              </p>
            </div>

            {/* Takeaway */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm">
                <span className="font-medium text-primary">Takeaway: </span>
                {episode.takeaway}
              </p>
            </div>

            {/* Next Move */}
            <div className="p-3 rounded-lg bg-violet-50 border border-violet-100 dark:bg-violet-950/30 dark:border-violet-900">
              <p className="text-sm">
                <span className="font-medium text-violet-700 dark:text-violet-300">Next Move: </span>
                <span className="italic">{episode.nextMove}</span>
              </p>
            </div>
          </div>

          {/* Tag chip */}
          {episode.tagLabel && (
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                {episode.tagLabel}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          {onSeeAllClick && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onSeeAllClick}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              See all from {voice.voiceName}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
