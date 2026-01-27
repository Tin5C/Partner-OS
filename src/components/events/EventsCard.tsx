import { useState } from 'react';
import { Clock, Calendar, CalendarSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventsPanel } from './EventsPanel';

interface EventsCardProps {
  className?: string;
  tenantSlug?: string;
}

export function EventsCard({ className, tenantSlug }: EventsCardProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col p-5 rounded-2xl text-left',
          'bg-card border border-border shadow-card',
          'hover:shadow-card-hover transition-all duration-200',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-soft bg-orange-100 dark:bg-orange-900/40">
            <Calendar className="w-5 h-5 text-foreground/70" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-body mb-1 text-foreground">
          Events
        </h3>

        {/* Subtitle */}
        <p className="text-caption text-muted-foreground line-clamp-1 mb-4">
          Discover relevant events near you
        </p>

        {/* Footer: Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-card text-caption text-muted-foreground border border-border shadow-chip">
            Networking
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-card text-caption text-muted-foreground border border-border shadow-chip">
            Learning
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <button
            onClick={() => setPanelOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-primary text-primary-foreground shadow-soft',
              'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
            )}
          >
            <CalendarSearch className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Find Events</span>
          </button>
        </div>
      </div>

      <EventsPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        tenantSlug={tenantSlug}
      />
    </>
  );
}
