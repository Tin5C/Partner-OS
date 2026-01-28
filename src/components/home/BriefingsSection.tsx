import * as React from 'react';
import { Play, BookOpen, Clock, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Briefing {
  id: string;
  title: string;
  description: string;
  duration: string;
  isNew: boolean;
  category: 'focus' | 'competitive' | 'industry' | 'objection';
}

const mockBriefings: Briefing[] = [
  {
    id: 'briefing-1',
    title: 'Top Focus',
    description: 'Your priority accounts and key updates this week',
    duration: '6 min',
    isNew: true,
    category: 'focus',
  },
  {
    id: 'briefing-2',
    title: 'Competitive Radar',
    description: 'What competitors are doing and how to respond',
    duration: '5 min',
    isNew: true,
    category: 'competitive',
  },
  {
    id: 'briefing-3',
    title: 'Industry Signals',
    description: 'Market trends and buyer behavior shifts',
    duration: '4 min',
    isNew: false,
    category: 'industry',
  },
  {
    id: 'briefing-4',
    title: 'Objection Handling',
    description: 'Common pushbacks and proven responses',
    duration: '5 min',
    isNew: false,
    category: 'objection',
  },
];

interface BriefingCardProps {
  briefing: Briefing;
  onPlay: () => void;
  onOpen: () => void;
  onSave: () => void;
}

function BriefingCard({ briefing, onPlay, onOpen, onSave }: BriefingCardProps) {
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
      {briefing.isNew && (
        <div className="absolute top-4 right-4">
          <span className="w-2 h-2 rounded-full bg-primary block" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-[15px] text-foreground mb-1">
        {briefing.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {briefing.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-4 mt-auto">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {briefing.duration}
        </span>
        {briefing.isNew && (
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
      </div>
    </article>
  );
}

interface BriefingsSectionProps {
  onPlay?: (briefingId: string) => void;
  onOpen?: (briefingId: string) => void;
}

export function BriefingsSection({ onPlay, onOpen }: BriefingsSectionProps) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Briefings</h2>
        <p className="text-sm text-muted-foreground">
          Executive summaries you can listen to or scan.
        </p>
      </div>

      {/* Briefings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {mockBriefings.map((briefing) => (
          <BriefingCard
            key={briefing.id}
            briefing={briefing}
            onPlay={() => onPlay?.(briefing.id)}
            onOpen={() => onOpen?.(briefing.id)}
            onSave={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
