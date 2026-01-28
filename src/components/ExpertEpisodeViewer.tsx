import { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, ChevronLeft, ChevronRight, 
  Bookmark, Share2, Volume2, VolumeX 
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExpertEpisode, formatEpisodeDate } from '@/lib/expertCorners';
import { cn } from '@/lib/utils';

interface ExpertEpisodeViewerProps {
  episode: ExpertEpisode | null;
  episodes: ExpertEpisode[]; // All episodes for navigation
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function ExpertEpisodeViewer({ 
  episode, 
  episodes,
  open, 
  onOpenChange, 
  onClose 
}: ExpertEpisodeViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [coverError, setCoverError] = useState(false);

  const currentIndex = episode ? episodes.findIndex(ep => ep.id === episode.id) : -1;
  const hasNext = currentIndex < episodes.length - 1;
  const hasPrev = currentIndex > 0;

  // Reset state when episode changes
  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(true);
    setCoverError(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [episode?.id]);

  const handleNext = () => {
    if (hasNext) {
      const nextEpisode = episodes[currentIndex + 1];
      // This would need to be handled by parent - for now we'll use URL param approach
      window.dispatchEvent(new CustomEvent('expert-episode-navigate', { 
        detail: { episode: nextEpisode, episodes } 
      }));
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevEpisode = episodes[currentIndex - 1];
      window.dispatchEvent(new CustomEvent('expert-episode-navigate', { 
        detail: { episode: prevEpisode, episodes } 
      }));
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = async () => {
    if (!episode) return;
    
    try {
      await navigator.share({
        title: episode.title,
        text: `${episode.hook}\n\n${episode.takeaway}`,
      });
    } catch {
      navigator.clipboard.writeText(`${episode.title}\n\n${episode.hook}\n\n${episode.takeaway}`);
    }
  };

  if (!episode) return null;

  const isVideo = episode.mediaType === 'video' && episode.videoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        // Mobile: full screen
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        // Desktop: centered modal
        "sm:max-w-md sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{episode.title}</DialogTitle>
        
        {/* Header with navigation and close button */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-indigo-50/90 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700">
              Expert
            </span>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {episodes.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
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
          {/* Media section */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
            {isVideo && episode.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={episode.videoUrl}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  playsInline
                  loop
                  poster={episode.coverUrl}
                  onClick={togglePlay}
                />
                {/* Video controls overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={togglePlay}
                    className={cn(
                      "w-14 h-14 rounded-full bg-black/60 flex items-center justify-center transition-opacity",
                      isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>
                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </>
            ) : episode.coverUrl && !coverError ? (
              <img 
                src={episode.coverUrl} 
                alt={episode.title}
                className="w-full h-full object-cover"
                onError={() => setCoverError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700">
                <Play className="w-10 h-10 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Episode title and meta */}
          <div>
            <h2 className="text-xl font-semibold leading-tight">{episode.title}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
              <span>{formatEpisodeDate(episode.publishedAt)}</span>
              <span>·</span>
              <span>{episode.durationLabel}</span>
              <span>·</span>
              <span className="text-primary">{episode.tagLabel}</span>
            </div>
          </div>

          {/* Hook */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm">
              <span className="font-medium text-primary">Hook: </span>
              {episode.hook}
            </p>
          </div>

          {/* Takeaway */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-secondary">
            <p className="text-sm">
              <span className="font-medium">Takeaway: </span>
              {episode.takeaway}
            </p>
          </div>

          {/* Next Move */}
          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 dark:bg-amber-950/30 dark:border-amber-800/50">
            <p className="text-sm">
              <span className="font-medium text-amber-700 dark:text-amber-400">Next move: </span>
              <span className="italic">{episode.nextMove}</span>
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
