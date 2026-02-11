// Briefing Mode Pill — shows "Curated" or "On-Demand" with info tooltip
// Partner-only component. Do NOT use in Internal space.

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export type BriefingMode = 'curated' | 'on-demand';

interface BriefingModePillProps {
  mode: BriefingMode;
  className?: string;
}

export function BriefingModePill({ mode, className }: BriefingModePillProps) {
  const isCurated = mode === 'curated';

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
          isCurated
            ? 'bg-primary/8 text-primary border-primary/20'
            : 'bg-accent/8 text-accent border-accent/20'
        )}
      >
        {isCurated ? 'Curated' : 'On-Demand'}
      </span>

      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="p-0.5 rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            aria-label="Learn about Curated vs On-Demand"
          >
            <Info className="w-3 h-3" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="bottom"
          align="start"
          className="w-72 p-3 space-y-2.5"
        >
          <p className="text-xs font-semibold text-foreground">
            Curated vs On-Demand
          </p>

          <div className="space-y-2">
            <div>
              <p className="text-[11px] font-semibold text-primary mb-0.5">Curated</p>
              <ul className="space-y-0.5">
                <li className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                  Weekly updated, based on saved account signals + vendor context
                </li>
                <li className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                  Consistent across the team (same inputs)
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-accent mb-0.5">On-Demand</p>
              <ul className="space-y-0.5">
                <li className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-accent/60 shrink-0" />
                  Generated instantly from your request
                </li>
                <li className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-accent/60 shrink-0" />
                  Not saved unless you choose "Save as Story" or "Save to Account Brief"
                </li>
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/70 italic border-t border-border/40 pt-2">
            Tip: Use Curated for shared execution. Use On-Demand for new questions.
          </p>
        </HoverCardContent>
      </HoverCard>
    </span>
  );
}
