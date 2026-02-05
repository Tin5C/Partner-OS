// Partner Story Tile - Compact, enterprise-clean story card
// Shows signal type pill, headline, and logo/cover

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PartnerStory, signalTypeColors, signalTypeGradients } from '@/data/partnerStories';
import { ListenedState } from '@/lib/stories';
import { Check } from 'lucide-react';

interface PartnerStoryTileProps {
  story: PartnerStory;
  listenedState: ListenedState;
  onClick: () => void;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function PartnerStoryTile({ story, listenedState, onClick }: PartnerStoryTileProps) {
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const hasLogo = story.logoUrl && !logoError;
  const hasCover = story.coverUrl && !coverError;
  const hasPerson = story.personImageUrl && !coverError;

  // Render cover based on available assets
  const renderCover = () => {
    // Logo-based cover (Vendor signals)
    if (hasLogo) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted flex items-center justify-center p-6">
          <img
            src={story.logoUrl}
            alt="Vendor"
            className="w-full h-auto max-h-12 object-contain opacity-90 dark:opacity-80"
            onError={() => setLogoError(true)}
          />
        </div>
      );
    }

    // Person/face cover
    if (hasPerson) {
      return (
        <>
          <img
            src={story.personImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      );
    }

    // Generic cover image
    if (hasCover) {
      return (
        <>
          <img
            src={story.coverUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      );
    }

    // Monogram fallback
    return (
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        "bg-gradient-to-br",
        signalTypeGradients[story.signalType]
      )}>
        <span className="text-2xl font-bold text-white/90 drop-shadow-sm">
          {getInitials(story.headline)}
        </span>
      </div>
    );
  };

  const isLogoCover = hasLogo && !logoError;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-[140px] rounded-2xl overflow-hidden",
        "border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-[0.98]",
        "aspect-[4/5]",
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/30 ring-1 ring-primary/20",
        listenedState === 'listened' && "border-primary ring-2 ring-primary/40"
      )}
    >
      {/* Cover */}
      {renderCover()}

      {/* Listened indicator */}
      {listenedState === 'listened' && (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-sm">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col p-3 text-left z-[5]">
        {/* Signal type pill */}
        <span className={cn(
          "self-start px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-sm",
          isLogoCover
            ? "bg-white/90 dark:bg-black/70 border-border/50 text-foreground"
            : signalTypeColors[story.signalType]
        )}>
          {story.signalType}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Headline */}
        <p className={cn(
          "text-[13px] font-medium leading-tight line-clamp-3 drop-shadow-md",
          isLogoCover ? "text-foreground" : "text-white"
        )}>
          {story.headline}
        </p>
      </div>
    </button>
  );
}
