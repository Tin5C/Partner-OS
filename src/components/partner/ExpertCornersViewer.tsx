// Partner Expert Corners Viewer
// Video-first fullscreen viewer with minimal chrome

import { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, BookOpen, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PartnerExpertEpisode } from '@/data/partnerExpertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornersViewerProps {
  episode: PartnerExpertEpisode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpertCornersViewer({ episode, open, onOpenChange }: ExpertCornersViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Reset state when episode changes
  useEffect(() => {
    if (episode && open) {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowSummary(false);
    }
  }, [episode, open]);

  // Handle video time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [episode]);

  if (!episode) return null;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleChapterClick = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[95vh] rounded-t-3xl p-0 flex flex-col sm:max-w-4xl sm:mx-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{episode.title}</SheetTitle>
        </SheetHeader>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold line-clamp-1">{episode.title}</h2>
            <p className="text-sm text-muted-foreground">
              {episode.expertName} · {episode.vendorTag}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!showSummary ? (
            <>
              {/* Video centerpiece */}
              <div className="relative flex-1 bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={episode.videoUrl}
                  poster={episode.coverImageUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  onClick={togglePlay}
                />

                {/* Play overlay when paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>

              {/* Video controls */}
              <div className="bg-card border-t border-border p-3 space-y-2">
                {/* Progress bar */}
                <div 
                  className="h-1.5 bg-muted rounded-full cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={togglePlay}>
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleMute}>
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {episode.readingSummary && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setShowSummary(true)}
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                        Read summary
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleFullscreen}>
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Chapters (if available) */}
                {episode.chapters && episode.chapters.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Chapters</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {episode.chapters.map((chapter, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChapterClick(chapter.time)}
                          className={cn(
                            "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            currentTime >= chapter.time && (episode.chapters![idx + 1] ? currentTime < episode.chapters![idx + 1].time : true)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {chapter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Reading summary view */
            <div className="flex-1 overflow-y-auto p-5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4 -ml-2"
                onClick={() => setShowSummary(false)}
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Back to video
              </Button>

              {episode.readingSummary && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      TL;DR
                    </h3>
                    <p className="text-base leading-relaxed">{episode.readingSummary.tldr}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {episode.readingSummary.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Action Items
                    </h3>
                    <ul className="space-y-2">
                      {episode.readingSummary.actionItems.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
