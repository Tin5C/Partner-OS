// Shared Pack Grid Component
// Renders a responsive grid of pack/briefing cards

import * as React from 'react';
import { Play, BookOpen, Clock, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from './SectionHeader';

export interface PackGridItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  isNew: boolean;
  icon?: string;
}

interface PackGridCardProps {
  item: PackGridItem;
  onPlay: () => void;
  onOpen: () => void;
  onSave?: () => void;
}

function PackGridCard({ item, onPlay, onOpen, onSave }: PackGridCardProps) {
  return (
    <article className={cn(
      "relative flex flex-col p-5 rounded-2xl",
      "bg-card border border-border",
      "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]",
      "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
      "hover:border-border/80",
      "transition-all duration-200"
    )}>
      {/* New Indicator */}
      {item.isNew && (
        <div className="absolute top-4 right-4">
          <span className="w-2 h-2 rounded-full bg-primary block" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-[15px] text-foreground mb-1">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {item.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-4 mt-auto">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {item.duration}
        </span>
        {item.isNew && (
          <span className="text-xs text-primary font-medium">New</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlay}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl",
            "bg-primary text-primary-foreground text-sm font-medium",
            "hover:bg-primary/90 transition-colors"
          )}
        >
          <Play className="w-4 h-4" />
          Play
        </button>
        <button
          onClick={onOpen}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl",
            "bg-muted/50 text-foreground text-sm font-medium border border-border/50",
            "hover:bg-muted transition-colors"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Open
        </button>
        {onSave && (
          <button
            onClick={onSave}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-muted/50 text-muted-foreground border border-border/50",
              "hover:bg-muted hover:text-foreground transition-colors"
            )}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
}

interface PackGridProps {
  title?: string;
  subtitle?: string;
  items: PackGridItem[];
  onPlay?: (itemId: string) => void;
  onOpen?: (itemId: string) => void;
  onSave?: (itemId: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function PackGrid({ 
  title,
  subtitle,
  items, 
  onPlay, 
  onOpen, 
  onSave,
  columns = 2,
  className 
}: PackGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={cn("space-y-4", className)}>
      {title && <SectionHeader title={title} subtitle={subtitle} />}

      <div className={cn("grid gap-4", gridCols[columns])}>
        {items.map((item) => (
          <PackGridCard
            key={item.id}
            item={item}
            onPlay={() => onPlay?.(item.id)}
            onOpen={() => onOpen?.(item.id)}
            onSave={onSave ? () => onSave(item.id) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
