// Deal Hypothesis — compact block showing deal shape, sizing, timeline
// Partner-only, in-memory

import { Lightbulb, Clock, DollarSign, Package, Info } from 'lucide-react';
import type { DealHypothesis } from '@/partner/data/dealPlanning/planHydrationStore';

interface Props {
  hypothesis: DealHypothesis;
}

export function DealHypothesisBlock({ hypothesis }: Props) {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <p className="text-xs font-semibold text-foreground">Deal Hypothesis</p>
        <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
          <Info className="w-2.5 h-2.5" /> {hypothesis.confidence}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{hypothesis.dealShape}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-0.5">
            <Package className="w-3 h-3" /> Packs
          </p>
          <p className="text-[11px] text-foreground font-medium">{hypothesis.expectedPacks}</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-0.5">
            <Clock className="w-3 h-3" /> Timeline
          </p>
          <p className="text-[11px] text-foreground font-medium">{hypothesis.timeboxWeeks}</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-0.5">
            <DollarSign className="w-3 h-3" /> Sizing (range)
          </p>
          <p className="text-[11px] text-foreground font-medium">{hypothesis.sizingRange}</p>
        </div>
      </div>
    </div>
  );
}
