import { useRef, useState } from 'react';
import { Play, Check, User } from 'lucide-react';
import { StoryItem, ListenedState, storyTypeColors, storyTypeLabels, storyTypeGradients } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface StoryTileProps {
  story: StoryItem;
  listenedState: ListenedState;
  onClick: () => void;
}

// Generate initials from a name/company
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Determine if story type uses logo-style cover
function usesLogoCover(type: StoryItem['type']): boolean {
  return type === 'competitor' || type === 'startup';
}

// Determine if story type uses portrait-style cover
function usesPortraitCover(type: StoryItem['type']): boolean {
  return type === 'customer' || type === 'expert' || type === 'account';
}

export function StoryTile({ story, listenedState, onClick }: StoryTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [personError, setPersonError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  
  const hasVideo = !!story.videoUrl;
  const isVideoStory = story.media_type === 'video' || hasVideo;

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

  // Render monogram fallback
  const renderMonogram = (name: string, gradient: string) => (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "bg-gradient-to-br",
      gradient
    )}>
      <span className="text-2xl font-bold text-white/90 drop-shadow-sm">
        {getInitials(name)}
      </span>
    </div>
  );

  // Render logo cover (Competitor/Startup)
  const renderLogoCover = () => {
    const hasValidLogo = story.logoUrl && !logoError;
    
    if (hasValidLogo) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 flex items-center justify-center p-6">
          <img
            src={story.logoUrl}
            alt={story.companyName}
            className="w-full h-auto max-h-14 object-contain opacity-90 dark:opacity-80"
            onError={() => setLogoError(true)}
          />
        </div>
      );
    }
    
    // Monogram fallback
    return renderMonogram(story.companyName, storyTypeGradients[story.type]);
  };

  // Render portrait cover (Customer/Expert/Account)
  const renderPortraitCover = () => {
    const hasValidPerson = story.personImageUrl && !personError;
    const hasValidCover = story.coverImageUrl && !coverError;
    
    if (hasValidPerson) {
      return (
        <>
          <img
            src={story.personImageUrl}
            alt={story.personName || story.companyName}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={() => setPersonError(true)}
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      );
    }
    
    if (hasValidCover) {
      return (
        <>
          <img
            src={story.coverImageUrl}
            alt={story.companyName}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      );
    }
    
    // Monogram avatar fallback
    return (
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-2",
        "bg-gradient-to-br",
        storyTypeGradients[story.type]
      )}>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <User className="w-7 h-7 text-white/80" />
        </div>
        <span className="text-xs font-medium text-white/80 px-3 text-center line-clamp-1">
          {story.personName || story.companyName}
        </span>
      </div>
    );
  };

  // Render default/image cover (Industry/Event/Lead)
  const renderDefaultCover = () => {
    const hasValidCover = story.coverImageUrl && !coverError;
    
    if (hasValidCover) {
      return (
        <>
          <img
            src={story.coverImageUrl}
            alt={story.headline}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      );
    }
    
    // Monogram fallback
    return renderMonogram(story.companyName, storyTypeGradients[story.type]);
  };

  // Render video cover
  const renderVideoCover = () => {
    const hasValidCover = story.coverImageUrl && !coverError;
    
    return (
      <>
        {/* Video element - plays on hover */}
        {hasVideo && (
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
        )}
        
        {/* Cover image (shown when not hovering or as fallback) */}
        {hasValidCover ? (
          <img
            src={story.coverImageUrl}
            alt={story.headline}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              hasVideo && isHovering ? "opacity-0" : "opacity-100"
            )}
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className={cn(
            "absolute inset-0 transition-opacity duration-300",
            hasVideo && isHovering ? "opacity-0" : "opacity-100"
          )}>
            {renderMonogram(story.companyName, storyTypeGradients[story.type])}
          </div>
        )}
        
        {/* Dark gradient overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </>
    );
  };

  // Main cover renderer
  const renderCover = () => {
    // Video stories get special treatment
    if (isVideoStory) {
      return renderVideoCover();
    }
    
    // Type-based cover rendering
    if (usesLogoCover(story.type)) {
      return renderLogoCover();
    }
    
    if (usesPortraitCover(story.type)) {
      return renderPortraitCover();
    }
    
    return renderDefaultCover();
  };

  // Determine if we need the gradient overlay (logo covers don't need it)
  const needsGradientOverlay = !usesLogoCover(story.type) || isVideoStory || logoError;

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex-shrink-0 w-[140px] rounded-2xl overflow-hidden",
        "border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-[0.98]",
        // Aspect ratio 4:5
        "aspect-[4/5]",
        // Ring states based on listened state
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/30 ring-1 ring-primary/20",
        listenedState === 'listened' && "border-primary ring-2 ring-primary/40"
      )}
    >
      {/* Cover */}
      {renderCover()}

      {/* Video indicator - only for video stories */}
      {isVideoStory && (
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
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-sm">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Play overlay on hover - for non-video stories with audio */}
      {story.audioUrl && !isVideoStory && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10">
          <div className="w-11 h-11 rounded-full bg-primary/90 flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Video play overlay - for video stories when not hovering */}
      {isVideoStory && !isHovering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col p-3 text-left z-[5]">
        {/* Type pill - always at top for non-video stories */}
        {!isVideoStory && (
          <span className={cn(
            "self-start px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-sm",
            usesLogoCover(story.type) && !logoError 
              ? "bg-white/90 dark:bg-black/70 border-border/50 text-foreground" 
              : storyTypeColors[story.type]
          )}>
            {storyTypeLabels[story.type]}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Headline - at bottom */}
        <p className={cn(
          "text-[13px] font-medium leading-tight line-clamp-2 drop-shadow-md",
          usesLogoCover(story.type) && !logoError && !isVideoStory
            ? "text-foreground"
            : "text-white"
        )}>
          {story.headline}
        </p>
      </div>
    </button>
  );
}