// Trending Pack Card for Partner homepage
// Compact, scannable card with theme-based content

import { Play, BookOpen, TrendingUp } from 'lucide-react';
import { TrendingPack } from '@/data/partnerTrendingPacks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrendingPackCardProps {
  pack: TrendingPack;
  onOpen: () => void;
  onPlay?: () => void;
}

export function TrendingPackCard({ pack, onOpen, onPlay }: TrendingPackCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col p-4 rounded-xl",
        "border border-border bg-card",
        "hover:shadow-md hover:border-border/80 transition-all duration-200"
      )}
    >
      {/* Header with trending indicator */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {pack.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {pack.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {pack.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer with time and actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <span className="text-[11px] text-muted-foreground">
          {pack.estimatedTime}
        </span>
        <div className="flex items-center gap-1.5">
          {pack.hasAudio && onPlay && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              <Play className="w-3 h-3 mr-1" />
              Play
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Open
          </Button>
        </div>
      </div>
    </div>
  );
}
