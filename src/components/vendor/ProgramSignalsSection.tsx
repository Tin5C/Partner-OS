// Program Signals Section — Vendor Space
// Shows vendor announcements/updates (maps to Stories in Partner space)

import { Megaphone, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useVendorData } from '@/contexts/VendorDataContext';
import { SIGNAL_TYPE_LABELS } from '@/data/vendor/contracts';

export function ProgramSignalsSection() {
  const { provider } = useVendorData();
  const signals = provider.listProgramSignals();

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Program Signals"
        subtitle="Vendor announcements, launches, and updates."
      />

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className={cn(
              "flex-shrink-0 w-[260px] rounded-xl border bg-card p-4 space-y-3",
              "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
              "border-border hover:border-primary/30 transition-colors"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "inline-block text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded-md mb-1",
                  signal.signalType === 'deprecation'
                    ? "bg-destructive/10 text-destructive"
                    : signal.signalType === 'incentive'
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-primary/10 text-primary"
                )}>
                  {SIGNAL_TYPE_LABELS[signal.signalType]}
                </span>
                <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                  {signal.title}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{signal.summary}</p>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                signal.governance.status === 'approved'
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground"
              )}>
                {signal.governance.status}
              </span>
              <button className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary/80">
                View <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
