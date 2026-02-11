// Deal Plan Drivers View — reads from snapshot-based dealPlanStore
// Renders promoted signal snapshots with aggregated sections

import { useState, useMemo, useCallback } from 'react';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Link2,
  Trash2,
  Copy,
  Info,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  getDealPlan,
  removePromotedSignal,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';

const FOCUS_ID = 'schindler';
const WEEK_OF = '2026-02-10';

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
}

export function DealPlanDriversView({ onGoToQuickBrief }: DealPlanDriversViewProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const plan = useMemo(() => getDealPlan(FOCUS_ID, WEEK_OF), []);
  const drivers = plan?.promotedSignals ?? [];

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRemove = useCallback(
    (signalId: string) => {
      removePromotedSignal(FOCUS_ID, WEEK_OF, signalId);
      refresh();
      toast.success('Removed from Deal Planning');
    },
    [refresh],
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  // Aggregations from snapshots
  const aggregatedMissing = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.whatsMissing.forEach((m) => items.add(m)));
    return Array.from(items);
  }, [drivers]);

  const aggregatedProof = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.proofToRequest.forEach((p) => items.add(p)));
    return Array.from(items);
  }, [drivers]);

  const avgConfidence = useMemo(() => {
    if (drivers.length === 0) return null;
    const avg = Math.round(drivers.reduce((a, d) => a + d.snapshot.confidence, 0) / drivers.length);
    return { score: avg, label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low' };
  }, [drivers]);

  // Empty state
  if (drivers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">No promoted signals yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Promote signals from Quick Brief to start Deal Planning.
          </p>
        </div>
        <button
          onClick={onGoToQuickBrief}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Go to Quick Brief
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Deal Planning — {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          Curated from Quick Brief signals
        </p>
      </div>

      {/* 1) Drivers */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Drivers
        </p>
        <div className="space-y-2">
          {drivers.map((d) => {
            const s = d.snapshot;
            const isExpanded = expandedIds.has(d.signalId);

            return (
              <div key={d.signalId} className="rounded-xl border border-border/60 bg-muted/20">
                <div className="flex items-start gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.soWhat}</p>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                        &rarr; {s.recommendedAction}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleRemove(d.signalId)}
                      className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove from Deal Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(d.signalId)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3">
                    {/* Talk Track */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Talk track</p>
                        <button onClick={() => handleCopy(s.talkTrack)} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{s.talkTrack}</p>
                    </div>

                    {/* Confidence */}
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-bold', confidenceColor(s.confidence))}>{s.confidence}%</span>
                        <span className={cn('text-[11px] font-medium', confidenceColor(s.confidence))}>{s.confidenceLabel}</span>
                      </div>
                    </div>

                    {/* What's missing */}
                    {s.whatsMissing.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">What&apos;s missing</p>
                        <div className="space-y-1">
                          {s.whatsMissing.map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs">
                              <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                              <p className="text-muted-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proof to request */}
                    {s.proofToRequest.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Proof to request</p>
                        <div className="space-y-1">
                          {s.proofToRequest.map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs">
                              <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                              <p className="text-muted-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Who cares */}
                    {s.whoCares.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Who cares</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.whoCares.map((role, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground">
                              <Users className="w-2.5 h-2.5" />
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {s.sources.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Sources</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.sources.map((src, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground">{src}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2) Aggregated What's Missing */}
      {aggregatedMissing.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What&apos;s missing (aggregated)
          </p>
          <div className="space-y-1">
            {aggregatedMissing.map((item, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3) Aggregated Proof to Request */}
      {aggregatedProof.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Proof to request (aggregated)
          </p>
          <div className="space-y-1">
            {aggregatedProof.map((item, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4) Confidence Summary */}
      {avgConfidence && (
        <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Confidence summary
          </p>
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-bold', confidenceColor(avgConfidence.score))}>
              {avgConfidence.score}%
            </span>
            <span className={cn('text-[11px] font-medium', confidenceColor(avgConfidence.score))}>
              {avgConfidence.label} (avg across {drivers.length} signals)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
