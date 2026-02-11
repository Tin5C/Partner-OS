import { useRef, useState } from 'react';
import { Play, Check, Volume2, ArrowUpRight } from 'lucide-react';
import { StoryItem, ListenedState, storyTypeColors, storyTypeLabels } from '@/lib/stories';
import { cn } from '@/lib/utils';

import coverVendor from '@/assets/signals/cover-vendor.jpg';
import coverRegulatory from '@/assets/signals/cover-regulatory.jpg';
import coverLocalMarket from '@/assets/signals/cover-localmarket.jpg';
import coverCompetitive from '@/assets/signals/cover-competitive.jpg';

// Category-to-cover mapping for Internal stories
const CATEGORY_COVERS: Record<string, string> = {
  competitor: coverCompetitive,
  startup: coverVendor,
  customer: coverLocalMarket,
  industry: coverLocalMarket,
  expert: coverRegulatory,
  account: coverVendor,
  lead: coverVendor,
  event: coverRegulatory,
  success: coverLocalMarket,
};

interface StoryTileProps {
  story: StoryItem;
  listenedState: ListenedState;
  onClick: () => void;
}

export function StoryTile({ story, listenedState, onClick }: StoryTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasVideo = !!story.videoUrl;
  const isVideoStory = story.media_type === 'video' || hasVideo;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && hasVideo) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && hasVideo) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Resolve cover image: story-specific > person > logo > category fallback
  const coverImg = (!imgError && (story.coverImageUrl || story.personImageUrl || story.logoUrl))
    || CATEGORY_COVERS[story.type]
    || coverVendor;

  const durationLabel = story.duration_sec >= 60
    ? `${Math.round(story.duration_sec / 60)} min`
    : `${story.duration_sec}s`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex-shrink-0 w-[260px] rounded-xl overflow-hidden text-left",
        "bg-card border transition-all duration-300",
        "shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1",
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/20",
        listenedState === 'listened' && "border-primary/40"
      )}
    >
      {/* ===== Visual Context Area (16:9) ===== */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {/* Video layer */}
        {isVideoStory && hasVideo && (
          <video
            ref={videoRef}
            src={story.videoUrl}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[1]",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}

        {/* Cover image */}
        <img
          src={!imgError ? (story.coverImageUrl || story.personImageUrl || story.logoUrl || CATEGORY_COVERS[story.type] || coverVendor) : (CATEGORY_COVERS[story.type] || coverVendor)}
          alt=""
          onError={() => setImgError(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-105",
            isVideoStory && isHovered && "opacity-0"
          )}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[2]" />

        {/* Category badge */}
        <span className={cn(
          "absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-semibold rounded-full border backdrop-blur-md z-10",
          storyTypeColors[story.type]
        )}>
          {storyTypeLabels[story.type]}
        </span>

        {/* Video indicator */}
        {isVideoStory && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm z-10">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isHovered ? "bg-red-500 animate-pulse" : "bg-white/70"
            )} />
            <span className="text-[10px] font-medium text-white/90">VIDEO</span>
          </div>
        )}

        {/* Duration chip */}
        {!isVideoStory && (
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/50 backdrop-blur-sm text-white/90 z-10">
            {durationLabel}
          </span>
        )}

        {/* Listened check */}
        {listenedState === 'listened' && (
          <div className="absolute bottom-2 left-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* ===== Headline + One-liner ===== */}
      <div className="px-3.5 pt-3 pb-2 space-y-1">
        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">
          {story.headline}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {story.one_liner}
        </p>
      </div>

      {/* ===== Intelligence Strip ===== */}
      <div className="px-3.5 pb-3 pt-1 border-t border-border/40">
        <div className="flex items-center gap-2">
          {/* Tags */}
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
            {story.topic_tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/40 truncate max-w-[80px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Audio indicator */}
          {story.audioUrl && (
            <span className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center" title="Audio available">
              <Volume2 className="w-2.5 h-2.5 text-muted-foreground" />
            </span>
          )}
        </div>
      </div>

      {/* ===== Hover Actions ===== */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center gap-2 bg-background/80 backdrop-blur-sm transition-opacity duration-200 z-20",
        isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {isVideoStory ? (
          <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-sm flex items-center gap-1">
            <Play className="w-3 h-3" />
            Watch
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-sm flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Open
          </span>
        )}
      </div>
    </button>
  );
}
