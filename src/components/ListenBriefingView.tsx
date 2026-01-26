import { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, RotateCw, FileText, Maximize2,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';
import { FocusCard, focusEpisodes, ListeningHighlight } from '@/lib/focusCards';
import { formatDuration } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ListenBriefingViewProps {
  card: FocusCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenExecSummary?: () => void;
  onOpenProjection?: () => void;
}

export function ListenBriefingView({ 
  card, 
  open, 
  onOpenChange,
  onOpenExecSummary,
  onOpenProjection
}: ListenBriefingViewProps) {
  const isMobile = useIsMobile();
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
  const highlightsRef = useRef<HTMLDivElement>(null);

  if (!card) return null;

  const episode = focusEpisodes[card.id];
  const isCurrentCard = currentEpisode?.id === episode?.id;
  const isCardPlaying = isCurrentCard && isPlaying;

  // Get current highlight based on progress
  const currentTime = isCurrentCard && episode 
    ? Math.floor((progress / 100) * episode.duration) 
    : 0;
  const totalDuration = episode?.duration || 360;
  const remainingTime = totalDuration - currentTime;

  const highlights = card.listeningHighlights || [];
  const currentHighlightIndex = highlights.findIndex(
    h => currentTime >= h.startTime && currentTime <= h.endTime
  );

  // Auto-scroll to current highlight
  useEffect(() => {
    if (currentHighlightIndex >= 0 && highlightsRef.current) {
      const highlightEl = highlightsRef.current.children[currentHighlightIndex] as HTMLElement;
      if (highlightEl) {
        highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentHighlightIndex]);

  const handlePlay = () => {
    if (episode) {
      if (isCurrentCard) {
        togglePlay();
      } else {
        play(episode);
      }
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

  const content = (
    <div className="flex flex-col h-full bg-gradient-header">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border shadow-soft">
        <div className={cn(
          "flex items-center justify-between gap-3",
          isMobile ? "px-5 py-4" : "px-6 py-4"
        )}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isMobile && (
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs text-primary font-semibold uppercase tracking-wider">Listen Briefing</p>
              <h1 className={cn(
                "font-semibold truncate text-foreground",
                isMobile ? "text-body" : "text-section"
              )}>
                {card.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onOpenProjection && (
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenProjection}
                className="h-10 w-10"
                aria-label="Project"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
            {!isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-10 w-10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Player Area */}
      <div className={cn(
        "flex-shrink-0 border-b border-border bg-card",
        isMobile ? "px-5 py-8" : "px-8 py-8"
      )}>
        {/* Album Art / Visual Placeholder */}
        <div className="flex justify-center mb-8">
          <div className={cn(
            "rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-secondary flex items-center justify-center shadow-card-hover",
            isMobile ? "w-52 h-52" : "w-60 h-60"
          )}>
            <button
              onClick={handlePlay}
              className={cn(
                "rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-card-hover",
                "hover:scale-105 active:scale-95 transition-all duration-200",
                isMobile ? "w-20 h-20" : "w-24 h-24"
              )}
            >
              {isCardPlaying ? (
                <Pause className={isMobile ? "w-10 h-10" : "w-12 h-12"} />
              ) : (
                <Play className={cn(isMobile ? "w-10 h-10" : "w-12 h-12", "ml-1")} />
              )}
            </button>
          </div>
        </div>

        {/* Title & Meta */}
        <div className="text-center mb-8">
          <h2 className={cn(
            "font-semibold text-foreground",
            isMobile ? "text-section" : "text-title"
          )}>{card.title}</h2>
          <p className="text-caption text-muted-foreground mt-2">{card.subtitle}</p>
          <p className="text-xs text-muted-foreground mt-2 px-3 py-1 rounded-full bg-secondary inline-block">{card.timeEstimate}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div 
            className="h-2.5 bg-secondary rounded-full cursor-pointer overflow-hidden shadow-soft"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary rounded-full transition-all duration-150"
              style={{ width: `${isCurrentCard ? progress : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>{formatDuration(currentTime)}</span>
            <span>-{formatDuration(remainingTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={cycleSpeed}
            className="px-4 py-2 rounded-xl bg-secondary text-caption font-semibold hover:bg-secondary/80 transition-all duration-200 min-w-[4rem] shadow-chip"
          >
            {playbackSpeed}x
          </button>
          
          <button
            onClick={() => skip(-15)}
            className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all duration-200 relative shadow-chip"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="absolute text-[10px] font-semibold">15</span>
          </button>
          
          <button
            onClick={handlePlay}
            className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all duration-200 shadow-card-hover"
          >
            {isCardPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>
          
          <button
            onClick={() => skip(15)}
            className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all duration-200 relative shadow-chip"
          >
            <RotateCw className="w-5 h-5" />
            <span className="absolute text-[10px] font-semibold">15</span>
          </button>

          <div className="w-[4rem]" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Follow Along Highlights */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className={cn(
          "space-y-1",
          isMobile ? "px-5 py-6" : "px-8 py-6"
        )}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">
            Follow Along
          </p>
          
          <div ref={highlightsRef} className="space-y-4">
            {highlights.length > 0 ? (
              highlights.map((highlight, idx) => (
                <div
                  key={highlight.id}
                  className={cn(
                    "p-5 rounded-2xl transition-all duration-300 cursor-pointer border",
                    idx === currentHighlightIndex
                      ? "bg-primary/5 border-primary/30 shadow-card"
                      : idx < currentHighlightIndex
                      ? "bg-muted/30 border-transparent opacity-60"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-card"
                  )}
                  onClick={() => {
                    if (episode) {
                      const newProgress = (highlight.startTime / totalDuration) * 100;
                      seek(newProgress);
                      if (!isPlaying) play(episode);
                    }
                  }}
                >
                  <p className={cn(
                    "leading-relaxed",
                    isMobile ? "text-body" : "text-section",
                    idx === currentHighlightIndex ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {highlight.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {formatDuration(highlight.startTime)}
                  </p>
                </div>
              ))
            ) : (
              card.previewBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-card border border-border shadow-soft"
                >
                  <p className={cn(
                    "text-muted-foreground leading-relaxed",
                    isMobile ? "text-body" : "text-section"
                  )}>
                    {bullet}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className={cn(
        "sticky bottom-0 border-t border-border bg-card/95 backdrop-blur-sm shadow-soft",
        isMobile ? "px-5 py-4 safe-bottom" : "px-8 py-4"
      )}>
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl"
          onClick={onOpenExecSummary}
        >
          <FileText className="w-4 h-4 mr-2" />
          Open Exec Summary
        </Button>
      </div>
    </div>
  );

  // Mobile: Bottom sheet (Drawer)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh]">
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
      <SheetContent 
        side="right" 
        className="w-[480px] sm:max-w-[480px] p-0 overflow-hidden"
        hideCloseButton
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{card.title}</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
