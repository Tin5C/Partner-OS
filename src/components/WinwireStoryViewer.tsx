import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share2, Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WinwireStory } from '@/lib/winwireStories';
import { cn } from '@/lib/utils';

interface WinwireStoryViewerProps {
  story: WinwireStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onMarkListened: (storyId: string) => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export function WinwireStoryViewer({
  story,
  open,
  onOpenChange,
  onClose,
  onMarkListened,
  isSaved,
  onToggleSave,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  currentIndex = 0,
  totalCount = 1,
}: WinwireStoryViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset state when story changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    
    // Attempt autoplay when story opens
    if (open && story && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked - user needs to interact
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [story?.id, open]);

  // Handle video time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !story) return;
    
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || story.durationSeconds;
    
    setProgress((current / duration) * 100);
    
    // Mark as listened at 80%
    if (current >= duration * 0.8) {
      onMarkListened(story.id);
    }
  }, [story, onMarkListened]);

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
    if (story) onMarkListened(story.id);
    
    // Auto-advance to next story
    setTimeout(() => {
      if (hasNext && onNext) {
        onNext();
      } else {
        onClose();
      }
    }, 500);
  }, [story, onMarkListened, hasNext, onNext, onClose]);

  // Toggle play/pause
  const handleViewerClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [isPlaying]);

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle share
  const handleShare = async () => {
    if (!story) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.subtitle,
        });
      } else {
        await navigator.clipboard.writeText(`${story.title}\n\n${story.subtitle}`);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch {
      // User cancelled share or error
    }
  };

  if (!story) return null;

  const hasVideo = story.media.videoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 gap-0 overflow-hidden bg-black",
          // Mobile: full screen
          "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
          // Desktop: wider modal for video content
          "sm:max-w-2xl sm:h-[80vh] sm:max-h-[700px] sm:rounded-2xl"
        )}
        onClick={handleViewerClick}
      >
        <DialogTitle className="sr-only">{story.title}</DialogTitle>

        {/* Video as centerpiece */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={story.media.videoUrl}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            preload="auto"
          />
        )}

        {/* Fallback background for non-video */}
        {!hasVideo && (
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              style={{
                backgroundImage: `url(${story.media.backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {/* Progress bar - thin at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div 
            className="h-full bg-amber-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header: Navigation + close - minimal */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
          {/* Story counter + navigation */}
          <div className="flex items-center gap-1.5">
            {hasPrev && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="text-[11px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
              {currentIndex + 1} / {totalCount}
            </span>
            {hasNext && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Close */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtle title overlay - top area, single line */}
        <div className="absolute top-12 left-3 right-3 z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-amber-500/90 text-white">
              {story.chipLabel}
            </span>
            {story.logoUrl && (
              <div className="w-5 h-5 rounded bg-white/90 flex items-center justify-center">
                <img src={story.logoUrl} alt="" className="w-4 h-4 object-contain" />
              </div>
            )}
          </div>
          <p className="text-sm text-white/90 mt-1.5 line-clamp-1 drop-shadow-md">
            {story.title}
          </p>
        </div>

        {/* Reactions - bottom right, enterprise-subtle */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
          {/* Like */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className={cn(
              "h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 transition-colors",
              isLiked ? "text-rose-500" : "text-white"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          {/* Save */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onToggleSave(story.id); }}
            className={cn(
              "h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 transition-colors",
              isSaved ? "text-amber-500" : "text-white"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 fill-current" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Share toast */}
        {showShareToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 text-slate-900 text-sm shadow-lg">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Link copied</span>
            </div>
          </div>
        )}

        {/* Tap to play indicator (shown when paused) */}
        {!isPlaying && hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
