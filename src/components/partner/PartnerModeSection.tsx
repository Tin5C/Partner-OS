// Partner Mode Section
// Toggles between Quick Brief (default) and Deal Planning modes
// Only ONE mode is visible at a time

import { useState } from 'react';
import { Zap, Brain, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickBriefSection } from './QuickBriefSection';
import { CustomerBriefSection } from './CustomerBriefSection';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type PartnerMode = 'quick-brief' | 'deal-planning';

export function PartnerModeSection() {
  const [mode, setMode] = useState<PartnerMode>('quick-brief');
  const [dealBriefExpanded, setDealBriefExpanded] = useState(false);
  const [quickBriefCustomer, setQuickBriefCustomer] = useState('');

  const handlePromoteToDealBrief = () => {
    setMode('deal-planning');
    setDealBriefExpanded(true);
  };

  return (
    <section className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-muted/50 p-1 border border-border">
          <button
            onClick={() => setMode('quick-brief')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'quick-brief'
                ? "bg-[#6D6AF6] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="w-4 h-4" />
            Quick Brief
          </button>
          <button
            onClick={() => setMode('deal-planning')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'deal-planning'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Brain className="w-4 h-4" />
            Deal Planning
          </button>
        </div>

        {/* Integration info tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[260px] text-xs leading-relaxed">
              <p>Some fields auto-fill when CRM and calendar are connected.</p>
              <p className="mt-1 text-muted-foreground">Current results are based on your Dialogue activity.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mode Content */}
      {mode === 'quick-brief' ? (
        <QuickBriefSection onOpenDealBrief={handlePromoteToDealBrief} />
      ) : (
        <DealPlanningMode
          expanded={dealBriefExpanded}
          onExpand={() => setDealBriefExpanded(true)}
        />
      )}
    </section>
  );
}

// Deal Planning collapsed/expanded wrapper
function DealPlanningMode({
  expanded,
  onExpand,
}: {
  expanded: boolean;
  onExpand: () => void;
}) {
  if (!expanded) {
    return (
      <div className={cn(
        "rounded-2xl border border-border bg-card",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        "p-6"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">AI Deal Brief</h3>
              <p className="text-sm text-muted-foreground">
                Turn messy AI deal context into a deal-ready plan in 5–10 minutes.
              </p>
            </div>
          </div>
          <button
            onClick={onExpand}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  return <CustomerBriefSection />;
}
