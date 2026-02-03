// Partner Expert Corners Tile
// Video-first tile with thumbnail, duration, progress indicator

import { Play, Video } from 'lucide-react';
import { PartnerExpertEpisode } from '@/data/partnerExpertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornersTileProps {
  episode: PartnerExpertEpisode;
  onClick: () => void;
}

export function ExpertCornersTile({ episode, onClick }: ExpertCornersTileProps) {
  const hasProgress = episode.progress && episode.progress > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-[200px] rounded-xl overflow-hidden",
        "border border-border bg-card shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-border/80 active:scale-[0.98]"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <img
          src={episode.coverImageUrl}
          alt={episode.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
          {episode.durationMinutes} min
        </div>

        {/* Video indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white/90">
          <Video className="w-3 h-3" />
          <span className="text-[9px] font-medium uppercase tracking-wide">Video</span>
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${episode.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 text-left">
        <p className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
          {episode.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {episode.expertName}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
            {episode.vendorTag}
          </span>
          {hasProgress && (
            <span className="text-[10px] text-muted-foreground">
              Continue
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
