import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Share2, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WinwireStory, WinwireSubtitle } from '@/lib/winwireStories';
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<WinwireSubtitle | null>(null);

  // Reset state when story changes
  useEffect(() => {
    setProgress(0);
    setCurrentTime(0);
    setCurrentSubtitle(null);
    setIsPlaying(false);
    
    // Attempt autoplay when story opens
    if (open && story && audioRef.current) {
      // Small delay to ensure audio element is ready
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked by browser - user needs to interact
          setIsMuted(true);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [story?.id, open]);

  // Update subtitle based on current time
  useEffect(() => {
    if (!story) return;
    
    const subtitle = story.subtitles.find(
      sub => currentTime >= sub.start && currentTime < sub.end
    );
    setCurrentSubtitle(subtitle || null);
  }, [currentTime, story]);

  // Handle audio time update
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current || !story) return;
    
    const current = audioRef.current.currentTime;
    const duration = story.durationSeconds;
    
    setCurrentTime(current);
    setProgress((current / duration) * 100);
    
    // Mark as listened at 80%
    if (current >= duration * 0.8) {
      onMarkListened(story.id);
    }
  }, [story, onMarkListened]);

  // Handle audio ended
  const handleAudioEnded = useCallback(() => {
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

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      
      // If unmuting and not playing, start playback
      if (isMuted && !isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [isMuted, isPlaying]);

  // Handle share
  const handleShare = async () => {
    if (!story) return;
    
    try {
      await navigator.share({
        title: story.title,
        text: story.subtitle,
      });
    } catch {
      navigator.clipboard.writeText(`${story.title}\n\n${story.subtitle}`);
    }
  };

  // Handle click on viewer to toggle play/pause
  const handleViewerClick = useCallback((e: React.MouseEvent) => {
    // Don't toggle if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [isPlaying]);

  if (!story) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 gap-0 overflow-hidden bg-black",
          // Mobile: full screen
          "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
          // Desktop: tall modal for story feel
          "sm:max-w-md sm:h-[80vh] sm:max-h-[700px] sm:rounded-2xl"
        )}
        onClick={handleViewerClick}
      >
        <DialogTitle className="sr-only">{story.title}</DialogTitle>
        
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={story.media.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          preload="auto"
        />

        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900"
            style={{
              backgroundImage: `url(${story.media.backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Progress bar - thin at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div 
            className="h-full bg-amber-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header: Navigation + close */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
          {/* Story counter + navigation */}
          <div className="flex items-center gap-2">
            {hasPrev && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full">
              {currentIndex + 1} / {totalCount}
            </span>
            {hasNext && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Mute + Close */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Winwire badge */}
        <div className="absolute top-16 left-4 z-20">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white">
            {story.chipLabel}
          </span>
        </div>

        {/* Title overlay - positioned in upper area */}
        <div className="absolute top-24 left-4 right-4 z-20">
          <h2 className="text-xl font-bold text-white drop-shadow-lg leading-tight">
            {story.title}
          </h2>
          <p className="text-sm text-white/70 mt-2">
            {story.industry}
          </p>
        </div>

        {/* Subtitle - Lower third overlay */}
        <div className="absolute bottom-24 left-0 right-0 z-20 pointer-events-none">
          <div className="px-4">
            <div 
              className={cn(
                "p-4 rounded-xl transition-opacity duration-300",
                "bg-black/70 backdrop-blur-sm",
                currentSubtitle ? "opacity-100" : "opacity-0"
              )}
            >
              <p className="text-lg text-white leading-relaxed text-center font-medium">
                {currentSubtitle?.text || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); onToggleSave(story.id); }}
            >
              {isSaved ? (
                <><BookmarkCheck className="h-4 w-4 mr-2" />Saved</>
              ) : (
                <><Bookmark className="h-4 w-4 mr-2" />Save</>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
            >
              <Share2 className="h-4 w-4 mr-2" />Share
            </Button>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {story.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tap to play/pause indicator (shown when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <span className="text-white text-sm font-medium">Tap to play</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
