import { useState, useRef } from 'react';
import { Mic, Play } from 'lucide-react';
import { UnifiedStoryItem } from '@/lib/unifiedStories';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ListenedState } from '@/lib/stories';

interface VoiceTileProps {
  item: UnifiedStoryItem;
  listenedState: ListenedState;
  onClick: () => void;
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

export function VoiceTile({ item, listenedState, onClick }: VoiceTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [coverError, setCoverError] = useState(false);
  
  const hasValidCover = item.coverUrl && !coverError;
  const hasVideo = !!item.videoUrl;
  const recencyLabel = item.recencyLabel;

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
        // Aspect ratio 4:5 - same as signal tiles
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
          src={item.videoUrl}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[1]",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* Hover gradient overlay for video */}
      {hasVideo && isHovering && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[2]" />
      )}

      {/* Background - distinct Voice aesthetic with subtle gradient (shown when not hovering video) */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-300",
        hasVideo && isHovering ? "opacity-0" : "opacity-100",
        "bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-100",
        "dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-slate-900"
      )}>
        {/* Cover image with fade overlay if available */}
        {hasValidCover && (
          <>
            <img
              src={item.coverUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20"
              onError={() => setCoverError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/70 to-white/40 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-900/50" />
          </>
        )}
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

      {/* Content overlay */}
      <div className={cn(
        "absolute inset-0 flex flex-col p-3 text-left z-[5]",
        hasVideo && isHovering && "text-white"
      )}>
        {/* Top: Voice chip + recency */}
        <div className="flex items-center justify-between gap-1">
          <span className={cn(
            "flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-sm",
            hasVideo && isHovering
              ? "bg-violet-500/80 text-white border-violet-400/50"
              : "bg-violet-100/90 text-violet-700 border-violet-200 dark:bg-violet-900/80 dark:text-violet-200 dark:border-violet-700"
          )}>
            <Mic className="w-2.5 h-2.5" />
            Voice
          </span>
          
          {recencyLabel && !isHovering && (
            <span className="text-[9px] font-medium text-muted-foreground truncate">
              {recencyLabel}
            </span>
          )}
        </div>

        {/* Middle: Avatar + Name + Role (hidden when hovering video) */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center gap-1.5 py-2 transition-opacity duration-200",
          hasVideo && isHovering ? "opacity-0" : "opacity-100"
        )}>
          <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-800 shadow-md">
            {item.voiceAvatarUrl ? (
              <AvatarImage src={item.voiceAvatarUrl} alt={item.voiceName || ''} />
            ) : null}
            <AvatarFallback className="bg-violet-500 text-white text-sm font-semibold">
              {getInitials(item.voiceName || 'V')}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground truncate max-w-full">
              {item.voiceName}
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-full">
              {item.voiceRole}
            </p>
          </div>
        </div>

        {/* Bottom: Episode hook headline */}
        <div className="mt-auto">
          <p className={cn(
            "text-[12px] font-medium leading-tight line-clamp-2",
            hasVideo && isHovering ? "text-white drop-shadow-md" : "text-foreground"
          )}>
            {item.title}
          </p>
        </div>
      </div>

      {/* Play overlay on hover for video */}
      {hasVideo && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity z-10",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-11 h-11 rounded-full bg-violet-500/90 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Subtle waveform/notes icon indicator (hidden when hovering video) */}
      {(!hasVideo || !isHovering) && (
        <div className="absolute bottom-2.5 right-2.5 w-5 h-5 rounded-full bg-violet-500/20 dark:bg-violet-400/20 flex items-center justify-center z-10">
          <Mic className="w-2.5 h-2.5 text-violet-600 dark:text-violet-300" />
        </div>
      )}
    </button>
  );
}
