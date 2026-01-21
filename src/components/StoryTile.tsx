import { Play, Check } from 'lucide-react';
import { StoryItem, ListenedState, storyTypeColors, storyTypeLabels } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface StoryTileProps {
  story: StoryItem;
  listenedState: ListenedState;
  onClick: () => void;
}

export function StoryTile({ story, listenedState, onClick }: StoryTileProps) {
  const truncatedTitle = story.title.length > 42 
    ? story.title.slice(0, 39) + '...' 
    : story.title;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-36 h-44 rounded-xl",
        "bg-gradient-to-br from-muted/80 to-muted/40",
        "border transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        // Ring states based on listened state
        listenedState === 'unseen' && "border-border/50",
        listenedState === 'seen' && "border-primary/30 ring-1 ring-primary/20",
        listenedState === 'listened' && "border-primary ring-2 ring-primary/40"
      )}
    >
      {/* Listened check indicator */}
      {listenedState === 'listened' && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Play overlay on hover (desktop) */}
      {story.audioUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col h-full p-3 text-left">
        {/* Type pill */}
        <span className={cn(
          "self-start px-2 py-0.5 text-[10px] font-medium rounded-full border",
          storyTypeColors[story.type]
        )}>
          {storyTypeLabels[story.type]}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Title */}
        <p className="text-sm font-medium leading-tight line-clamp-3 text-foreground">
          {truncatedTitle}
        </p>
      </div>
    </button>
  );
}
