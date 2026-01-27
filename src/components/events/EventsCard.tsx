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
      <article
        className={cn(
          'relative flex flex-col p-5 rounded-2xl text-left h-full',
          'bg-card border border-border',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]',
          'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)]',
          'hover:border-border/80 hover:-translate-y-0.5',
          'transition-all duration-200 ease-out',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-orange-100 dark:bg-orange-900/40">
            <Calendar className="w-5 h-5 text-foreground/70" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[15px] leading-snug mb-1.5 text-foreground tracking-tight">
          Events
        </h3>

        {/* Subtitle */}
        <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          Discover relevant events near you
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-md bg-secondary/60 text-xs text-muted-foreground border border-border/50">
            Networking
          </span>
          <span className="px-2 py-0.5 rounded-md bg-secondary/60 text-xs text-muted-foreground border border-border/50">
            Learning
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/60">
          <button
            onClick={() => setPanelOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-primary text-primary-foreground',
              'shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
              'hover:bg-primary/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12)]',
              'active:scale-[0.98] transition-all duration-150'
            )}
          >
            <CalendarSearch className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Find Events</span>
          </button>
        </div>
      </article>

      <EventsPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        tenantSlug={tenantSlug}
      />
    </>
  );
}
