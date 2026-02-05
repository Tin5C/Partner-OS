// Partner Expert Corners Tile
// Video-first tile with thumbnail, duration, progress indicator
// Shows EXPLAINER badge for synthetic doc explainers, VIDEO for human experts/YouTube
// Includes interactive "why recommended" popover with "Not relevant" action

import { useState } from 'react';
import { Play, Video, Sparkles, Check, X } from 'lucide-react';
import { PartnerExpertEpisode, isSyntheticExplainer, isYouTubeEpisode } from '@/data/partnerExpertCorners';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpertCornersTileProps {
  episode: PartnerExpertEpisode;
  onClick: () => void;
  reason?: string;
  matchedSignals?: string[];
  matchedContext?: string;
  isCompleted?: boolean;
  progressPercent?: number;
  onDownrank?: (topic: string) => void;
}

export function ExpertCornersTile({ 
  episode, 
  onClick, 
  reason,
  matchedSignals,
  matchedContext,
  isCompleted = false,
  progressPercent,
  onDownrank,
}: ExpertCornersTileProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const hasProgress = progressPercent !== undefined && progressPercent > 0;
  const isSynthetic = isSyntheticExplainer(episode);
  const isYouTube = isYouTubeEpisode(episode);
  const isGenerating = episode.generationStatus === 'generating';

  const handleDownrank = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Downrank the first topic tag
    if (episode.topicTags?.[0] && onDownrank) {
      onDownrank(episode.topicTags[0]);
    }
    setPopoverOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 w-[220px] rounded-xl overflow-hidden",
        "border border-border bg-card shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-border/80",
        isCompleted && "opacity-80"
      )}
    >
      {/* Clickable thumbnail area */}
      <button onClick={handleClick} className="w-full text-left">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {isGenerating ? (
            // Skeleton state for generating
            <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-muted-foreground animate-pulse" />
            </div>
          ) : (
            <img
              src={episode.coverImageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          {/* Play overlay */}
          {!isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
            {episode.durationMinutes} min
          </div>

          {/* Type indicator - EXPLAINER for synthetic, VIDEO for human/YouTube */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white/90">
            {isSynthetic && !isYouTube ? (
              <>
                <Sparkles className="w-3 h-3" />
                <span className="text-[9px] font-medium uppercase tracking-wide">Explainer</span>
              </>
            ) : (
              <>
                <Video className="w-3 h-3" />
                <span className="text-[9px] font-medium uppercase tracking-wide">Video</span>
              </>
            )}
          </div>
          
          {/* Completed badge */}
          {isCompleted && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-600 text-white">
              <Check className="w-3 h-3" />
              <span className="text-[9px] font-medium">Completed</span>
            </div>
          )}

          {/* Progress bar */}
          {hasProgress && !isCompleted && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
            {episode.title}
          </p>
          
          {/* Show expert name for human experts, topic tags for synthetic */}
          {isSynthetic ? (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {episode.topicTags?.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {episode.expertName}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
              {episode.vendorTag}
            </span>
            {hasProgress && !isCompleted && (
              <span className="text-[10px] text-muted-foreground">
                Continue
              </span>
            )}
            {isGenerating && (
              <span className="text-[10px] text-muted-foreground italic">
                Generating...
              </span>
            )}
          </div>
        </div>
      </button>
      
      {/* Why recommended (interactive popover) */}
      {reason && (
        <div className="px-3 pb-3 pt-0">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button 
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors line-clamp-1 italic text-left cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {reason}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-3" 
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">Why this is recommended</p>
                  <div className="space-y-1.5">
                    {matchedContext && (
                      <p className="text-xs text-muted-foreground">
                        Partner Brief scope: <span className="text-foreground">{matchedContext}</span>
                      </p>
                    )}
                    {matchedSignals && matchedSignals.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Detected: <span className="text-foreground">{matchedSignals.join(' + ')}</span>
                      </p>
                    )}
                    {!matchedContext && (!matchedSignals || matchedSignals.length === 0) && (
                      <p className="text-xs text-muted-foreground">{reason}</p>
                    )}
                  </div>
                </div>
                
                {episode.topicTags?.[0] && onDownrank && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-7 text-xs text-muted-foreground hover:text-destructive"
                    onClick={handleDownrank}
                  >
                    <X className="w-3 h-3 mr-1.5" />
                    Not relevant
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
