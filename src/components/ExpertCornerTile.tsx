import { User } from 'lucide-react';
import { ExpertCorner, hasRecentEpisode, getRecencyLabel } from '@/lib/expertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornerTileProps {
  corner: ExpertCorner;
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

export function ExpertCornerTile({ corner, onClick }: ExpertCornerTileProps) {
  const isNew = hasRecentEpisode(corner, 7);
  const recencyLabel = getRecencyLabel(corner);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-[140px] rounded-2xl overflow-hidden",
        "border border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-[0.98]",
        "aspect-[4/5] bg-card"
      )}
    >
      {/* Cover image or avatar */}
      <div className="absolute inset-0">
        {corner.coverUrl ? (
          <>
            <img
              src={corner.coverUrl}
              alt={corner.title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700">
            {corner.hostName ? (
              <span className="text-2xl font-bold text-white/90">
                {getInitials(corner.hostName)}
              </span>
            ) : (
              <User className="w-10 h-10 text-white/80" />
            )}
          </div>
        )}
      </div>

      {/* NEW badge */}
      {isNew && (
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold z-10 shadow-sm">
          NEW
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 text-left z-[5]">
        {/* Recency label */}
        {recencyLabel && (
          <span className="text-[10px] text-white/70 mb-0.5">
            {recencyLabel}
          </span>
        )}
        
        {/* Show title */}
        <p className="text-[13px] font-semibold leading-tight text-white drop-shadow-md">
          {corner.title}
        </p>
        
        {/* Description */}
        <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
          {corner.description}
        </p>
      </div>
    </button>
  );
}
