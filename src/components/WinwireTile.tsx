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
  return (
    <button
      onClick={onClick}
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900"
          style={{
            backgroundImage: `url(${story.media.backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Winwire badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md border bg-amber-500/90 text-white border-amber-400/50 backdrop-blur-sm">
          {story.chipLabel}
        </span>
      </div>

      {/* Duration badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-black/50 text-white/90 backdrop-blur-sm">
          {formatWinwireDuration(story.durationSeconds)}
        </span>
      </div>

      {/* Listened check indicator */}
      {listenedState === 'listened' && (
        <div className="absolute top-10 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-sm">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Play overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10">
        <div className="w-11 h-11 rounded-full bg-amber-500/90 flex items-center justify-center shadow-md">
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
