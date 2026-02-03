// Partner Expert Corners Viewer
// Video-first fullscreen viewer with structured exec summary for synthetic explainers
// Includes progress tracking and expertise completion banners

import { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, BookOpen, ChevronRight, ExternalLink, Sparkles, AlertCircle, RefreshCw, Award } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PartnerExpertEpisode, isSyntheticExplainer } from '@/data/partnerExpertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornersViewerProps {
  episode: PartnerExpertEpisode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgressUpdate?: (episodeId: string, progressPercent: number) => void;
  recentlyCompletedTopic?: string | null;
  onClearCompletedTopic?: () => void;
}

// Summary section component
function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {children}
    </div>
  );
}

export function ExpertCornersViewer({ 
  episode, 
  open, 
  onOpenChange,
  onProgressUpdate,
  recentlyCompletedTopic,
  onClearCompletedTopic,
}: ExpertCornersViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showExpertiseBanner, setShowExpertiseBanner] = useState(false);
  const [bannerTopic, setBannerTopic] = useState<string | null>(null);

  const isSynthetic = episode ? isSyntheticExplainer(episode) : false;
  const isGenerating = episode?.generationStatus === 'generating';
  const isFailed = episode?.generationStatus === 'failed';

  // Reset state when episode changes
  useEffect(() => {
    if (episode && open) {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowSummary(false);
      setShowExpertiseBanner(false);
      setBannerTopic(null);
    }
  }, [episode, open]);
  
  // Show expertise banner when topic is newly completed
  useEffect(() => {
    if (recentlyCompletedTopic && open) {
      setBannerTopic(recentlyCompletedTopic);
      setShowExpertiseBanner(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowExpertiseBanner(false);
        onClearCompletedTopic?.();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recentlyCompletedTopic, open, onClearCompletedTopic]);

  // Handle video time update and report progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Report progress
      if (episode && onProgressUpdate && video.duration > 0) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        onProgressUpdate(episode.id, progressPercent);
      }
    };
    
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
  }, [episode, onProgressUpdate]);

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
        
        {/* Expertise Banner (shows on topic completion) */}
        {showExpertiseBanner && bannerTopic && (
          <div className="mx-4 mb-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <Award className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Expertise signal strengthened: {bannerTopic}
              </p>
              <p className="text-xs text-muted-foreground">
                Your expertise is being recognized.
              </p>
            </div>
            <button
              onClick={() => {
                setShowExpertiseBanner(false);
                onClearCompletedTopic?.();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {isSynthetic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
                  <Sparkles className="w-3 h-3" />
                  Synthetic Explainer
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold line-clamp-1">{episode.title}</h2>
            <p className="text-sm text-muted-foreground">
              {isSynthetic ? (
                <>
                  {episode.vendorTag}
                  {episode.topicTags && episode.topicTags.length > 0 && (
                    <> · {episode.topicTags.join(', ')}</>
                  )}
                </>
              ) : (
                <>{episode.expertName} · {episode.vendorTag}</>
              )}
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
                {isGenerating ? (
                  // Generating state - show skeleton with exec summary visible
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center space-y-3">
                      <Sparkles className="w-10 h-10 text-muted-foreground mx-auto animate-pulse" />
                      <p className="text-sm text-muted-foreground">Generating explainer video...</p>
                      <p className="text-xs text-muted-foreground">Exec summary is available below</p>
                    </div>
                  </div>
                ) : isFailed ? (
                  // Failed state
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
                      <p className="text-sm text-muted-foreground">Video generation failed</p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Video controls */}
              {!isGenerating && !isFailed && (
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
                      {(episode.execSummary || episode.readingSummary) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setShowSummary(true)}
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                          {isSynthetic ? 'Exec summary' : 'Read summary'}
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
              )}

              {/* Show exec summary button for generating state */}
              {isGenerating && episode.execSummary && (
                <div className="bg-card border-t border-border p-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full h-9 text-xs"
                    onClick={() => setShowSummary(true)}
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    View exec summary while video generates
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Summary view */
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

              {/* Synthetic Explainer Exec Summary */}
              {isSynthetic && episode.execSummary && (
                <div className="space-y-6">
                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-sm">
                    <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-xs">
                      This explainer is automatically generated from public documentation and references.
                    </p>
                  </div>

                  {/* What this covers */}
                  <SummarySection title="What this covers">
                    <ul className="space-y-2">
                      {episode.execSummary.whatThisCovers.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  {/* Why it matters for partners */}
                  <SummarySection title="Why it matters for partners">
                    <ul className="space-y-2">
                      {episode.execSummary.whyItMattersForPartners.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  {/* When to use in a deal */}
                  <SummarySection title="When to use this in a deal">
                    <ul className="space-y-2">
                      {episode.execSummary.whenToUseInDeal.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  {/* Partner talk track */}
                  <SummarySection title="Partner talk track">
                    <ul className="space-y-3">
                      {episode.execSummary.partnerTalkTrack.map((item, idx) => (
                        <li key={idx} className="text-sm italic bg-secondary/30 p-3 rounded-lg border-l-2 border-primary">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  {/* Common objections */}
                  {episode.execSummary.commonObjections && episode.execSummary.commonObjections.length > 0 && (
                    <SummarySection title="Common objections & responses">
                      <div className="space-y-4">
                        {episode.execSummary.commonObjections.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <p className="text-sm font-medium text-foreground">
                              "{item.objection}"
                            </p>
                            <p className="text-sm text-muted-foreground pl-4 border-l-2 border-border">
                              {item.response}
                            </p>
                          </div>
                        ))}
                      </div>
                    </SummarySection>
                  )}

                  {/* Next best actions */}
                  <SummarySection title="Next best actions">
                    <ul className="space-y-2">
                      {episode.execSummary.nextBestActions.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  {/* Sources */}
                  {episode.sourceReferences && episode.sourceReferences.length > 0 && (
                    <SummarySection title="Sources & references">
                      <ul className="space-y-2">
                        {episode.sourceReferences.map((url, idx) => (
                          <li key={idx}>
                            <a 
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{url}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </SummarySection>
                  )}
                </div>
              )}

              {/* Human Expert Reading Summary */}
              {!isSynthetic && episode.readingSummary && (
                <div className="space-y-6">
                  <SummarySection title="TL;DR">
                    <p className="text-sm text-foreground">{episode.readingSummary.tldr}</p>
                  </SummarySection>

                  <SummarySection title="Key Points">
                    <ul className="space-y-2">
                      {episode.readingSummary.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>

                  <SummarySection title="Action Items">
                    <ul className="space-y-2">
                      {episode.readingSummary.actionItems.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SummarySection>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
