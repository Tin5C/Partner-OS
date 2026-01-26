import { useRef, useState } from 'react';
import { Play, Check } from 'lucide-react';
import { StoryItem, ListenedState, storyTypeColors, storyTypeLabels } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface StoryTileProps {
  story: StoryItem;
  listenedState: ListenedState;
  onClick: () => void;
}

export function StoryTile({ story, listenedState, onClick }: StoryTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const hasVideo = !!story.videoUrl;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && hasVideo) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current && hasVideo) {
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
        "group relative flex-shrink-0 w-36 h-44 rounded-2xl overflow-hidden",
        "border shadow-card transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]",
        // Ring states based on listened state
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/30 ring-1 ring-primary/20",
        listenedState === 'listened' && "border-primary ring-2 ring-primary/40"
      )}
    >
      {/* Background video or image */}
      {hasVideo ? (
        <>
          {/* Video element - plays on hover */}
          <video
            ref={videoRef}
            src={story.videoUrl}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHovering ? "opacity-100" : "opacity-0"
            )}
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* Fallback image when not hovering */}
          <img 
            src={story.imageUrl} 
            alt={story.headline}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHovering ? "opacity-0" : "opacity-100"
            )}
          />
        </>
      ) : story.imageUrl ? (
        <img 
          src={story.imageUrl} 
          alt={story.headline}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Video indicator - only for video stories */}
      {hasVideo && (
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm z-10">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            isHovering ? "bg-red-500 animate-pulse" : "bg-white/70"
          )} />
          <span className="text-[10px] font-medium text-white/90">VIDEO</span>
        </div>
      )}

      {/* Listened check indicator */}
      {listenedState === 'listened' && (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-soft">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Play overlay on hover (desktop) - only for audio stories without video */}
      {story.audioUrl && !hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10">
          <div className="w-11 h-11 rounded-full bg-primary/90 flex items-center justify-center shadow-card">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col h-full p-3 text-left z-[5]">
        {/* Type pill */}
        <span className={cn(
          "self-start px-2.5 py-1 text-[10px] font-medium rounded-full border backdrop-blur-sm shadow-chip",
          storyTypeColors[story.type]
        )}>
          {storyTypeLabels[story.type]}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Headline */}
        <p className="text-sm font-medium leading-tight line-clamp-3 text-white drop-shadow-md">
          {story.headline}
        </p>
      </div>
    </button>
  );
}
