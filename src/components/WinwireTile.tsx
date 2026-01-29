import { useState, useRef } from 'react';
import { Play, Check } from 'lucide-react';
import { WinwireStory, formatWinwireDuration } from '@/lib/winwireStories';
import { ListenedState } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface WinwireTileProps {
  story: WinwireStory;
  listenedState: ListenedState;
  onClick: () => void;
}

export function WinwireTile({ story, listenedState, onClick }: WinwireTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasVideo = story.media.videoUrl;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex-shrink-0 w-[140px] rounded-2xl overflow-hidden",
        "border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-[0.98]",
        // Aspect ratio 4:5 - matches other story tiles
        "aspect-[4/5]",
        // Ring states based on listened state
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/30 ring-1 ring-primary/20",
        listenedState === 'listened' && "border-primary ring-2 ring-primary/40"
      )}
    >
      {/* Video background (for hover preview) */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={story.media.videoUrl}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* Static background (shown by default) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isHovering && hasVideo ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Background with gradient fallback */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
          style={{
            backgroundImage: story.logoUrl ? `url(${story.logoUrl})` : undefined,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      {/* Hover overlay gradient */}
      {isHovering && hasVideo && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[3]" />
      )}

      {/* Winwire badge - subtle */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className="px-2 py-0.5 text-[10px] font-medium rounded border bg-amber-500/90 text-white border-amber-400/50 backdrop-blur-sm">
          {story.chipLabel}
        </span>
      </div>

      {/* Logo (if provided and not hovering video) */}
      {story.logoUrl && !isHovering && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-12 h-12 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md">
            <img 
              src={story.logoUrl} 
              alt="" 
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>
      )}

      {/* Duration badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-black/50 text-white/90 backdrop-blur-sm">
          {formatWinwireDuration(story.durationSeconds)}
        </span>
      </div>

      {/* VIDEO indicator when hovering */}
      {hasVideo && isHovering && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-black/60 text-white backdrop-blur-sm">
            VIDEO
          </span>
        </div>
      )}

      {/* Listened check indicator */}
      {listenedState === 'listened' && (
        <div className="absolute top-10 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-sm">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Play overlay on hover */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity bg-black/20 z-10",
        isHovering ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-11 h-11 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg">
          <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col p-3 text-left z-[5]">
        {/* Spacer */}
        <div className="flex-1" />

        {/* Title */}
        <p className="text-[13px] font-medium leading-tight line-clamp-3 text-white drop-shadow-md">
          {story.title}
        </p>
        
        {/* Industry tag */}
        <p className="text-[10px] text-white/70 mt-1 line-clamp-1">
          {story.industry}
        </p>
      </div>
    </button>
  );
}
