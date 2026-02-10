// Deal Plan Drivers View — consumes promoted DealPlanSelections
// Renders signal cards with only included sections, aggregated missing/proof/briefings

import { useState, useMemo, useCallback } from 'react';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Link2,
  Play,
  Target,
  Shield,
  Trash2,
  Copy,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  listDealPlanSelections,
  removeDealPlanSelection,
  SECTION_LABELS,
  type DealPlanSelection,
  type DealPlanSectionKey,
} from '@/data/partner/dealPlanSelectionStore';
import { listAccountSignals } from '@/data/partner/accountSignalStore';
import { listBriefingArtifacts } from '@/data/partner/briefingArtifactStore';
import type { QuickBriefSignal, SignalBriefingRef } from './QuickBriefOutput';

const ACCOUNT_ID = 'acct_schindler';

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
}

function buildSignalFromAccount(signalId: string): QuickBriefSignal | null {
  const accountSignals = listAccountSignals('demo_helioworks', { account_id: ACCOUNT_ID });
  const acctSig = accountSignals.find((s) => s.id === signalId);
  if (!acctSig) return null;

  const briefingArts = listBriefingArtifacts('demo_helioworks', { account_id: ACCOUNT_ID });

  const recommendedBriefings: SignalBriefingRef[] = [];
  // Simple mapping: first signal -> account microcast, etc.
  const idx = accountSignals.indexOf(acctSig);
  if (idx === 0) {
    const ba = briefingArts.find((b) => b.type === 'account_microcast');
    if (ba) recommendedBriefings.push({ id: ba.id, title: ba.title, type: ba.type });
  } else if (idx === 1) {
    const ba = briefingArts.find((b) => b.type === 'objection_briefing');
    if (ba) recommendedBriefings.push({ id: ba.id, title: ba.title, type: ba.type });
  } else if (idx === 2) {
    const ba = briefingArts.find((b) => b.type === 'industry_microcast');
    if (ba) recommendedBriefings.push({ id: ba.id, title: ba.title, type: ba.type });
  }

  return {
    id: acctSig.id,
    headline: acctSig.headline,
    soWhat: acctSig.why_it_converts,
    whatToDo: acctSig.partner_motion[0] ?? '',
    sellerTalkTrack: acctSig.partner_motion,
    engineerContext: acctSig.execution_surface,
    confidence: {
      score: acctSig.confidence === 'High' ? 75 : acctSig.confidence === 'Medium' ? 55 : 30,
      label: acctSig.confidence,
      reason: acctSig.why_it_converts,
    },
    whatsMissing: acctSig.gaps,
    proofToRequest: acctSig.proof_artifacts_needed,
    recommendedBriefings,
    sources: [],
  };
}

export function DealPlanDriversView({ onGoToQuickBrief }: DealPlanDriversViewProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const selections = useMemo(() => listDealPlanSelections(ACCOUNT_ID), []);

  // Build drivers: join selections to signal data
  const drivers = useMemo(() => {
    return selections
      .map((sel) => {
        const signal = buildSignalFromAccount(sel.signalId);
        if (!signal) return null;
        return { selection: sel, signal };
      })
      .filter(Boolean) as { selection: DealPlanSelection; signal: QuickBriefSignal }[];
  }, [selections]);

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
      removeDealPlanSelection(ACCOUNT_ID, signalId);
      refresh();
      toast.success('Removed from Deal Planning');
    },
    [refresh],
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Aggregate: What's Missing (deduplicated)
  const aggregatedMissing = useMemo(() => {
    const items = new Set<string>();
    for (const d of drivers) {
      if (d.selection.includedSections.includes('whatsMissing')) {
        d.signal.whatsMissing.forEach((m) => items.add(m));
      }
    }
    return Array.from(items);
  }, [drivers]);

  // Aggregate: Proof to Request (deduplicated)
  const aggregatedProof = useMemo(() => {
    const items = new Set<string>();
    for (const d of drivers) {
      if (d.selection.includedSections.includes('proofToRequest')) {
        d.signal.proofToRequest.forEach((p) => items.add(p));
      }
    }
    return Array.from(items);
  }, [drivers]);

  // Aggregate: Recommended Briefings (deduplicated by id)
  const aggregatedBriefings = useMemo(() => {
    const seen = new Map<string, SignalBriefingRef>();
    for (const d of drivers) {
      if (d.selection.includedSections.includes('recommendedBriefings')) {
        d.signal.recommendedBriefings.forEach((b) => {
          if (!seen.has(b.id)) seen.set(b.id, b);
        });
      }
    }
    return Array.from(seen.values());
  }, [drivers]);

  // Confidence summary
  const showConfidence = drivers.some((d) =>
    d.selection.includedSections.includes('confidence'),
  );
  const avgConfidence = useMemo(() => {
    if (!showConfidence) return null;
    const scores = drivers
      .filter((d) => d.selection.includedSections.includes('confidence'))
      .map((d) => d.signal.confidence.score);
    if (scores.length === 0) return null;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return {
      score: avg,
      label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low',
    };
  }, [drivers, showConfidence]);

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  // Empty state
  if (drivers.length === 0) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-dashed border-border bg-muted/10',
          'p-8 text-center space-y-4',
        )}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            No promoted signals yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Promote signals from Quick Brief to start Deal Planning.
          </p>
        </div>
        <button
          onClick={onGoToQuickBrief}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
            'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
          )}
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

      {/* 1) Drivers (Promoted Signals) */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Drivers
        </p>
        <div className="space-y-2">
          {drivers.map(({ selection, signal }) => {
            const isExpanded = expandedIds.has(signal.id);
            const has = (key: DealPlanSectionKey) =>
              selection.includedSections.includes(key);

            return (
              <div
                key={signal.id}
                className="rounded-xl border border-border/60 bg-muted/20"
              >
                {/* Collapsed header */}
                <div className="flex items-start gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {signal.headline}
                    </p>
                    {signal.soWhat && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {signal.soWhat}
                      </p>
                    )}
                    {signal.whatToDo && !isExpanded && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                        → {signal.whatToDo}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleRemove(signal.id)}
                      className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove from Deal Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(signal.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded: only included sections */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3">
                    {/* Included sections chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {selection.includedSections.map((key) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {SECTION_LABELS[key]}
                        </span>
                      ))}
                    </div>

                    {/* Talk Track */}
                    {has('talkTrack') && signal.sellerTalkTrack.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                            Talk track
                          </p>
                          <button
                            onClick={() =>
                              handleCopy(signal.sellerTalkTrack.join('\n'))
                            }
                            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {signal.sellerTalkTrack.map((point, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-foreground leading-relaxed">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confidence */}
                    {has('confidence') && (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-sm font-bold',
                              confidenceColor(signal.confidence.score),
                            )}
                          >
                            {signal.confidence.score}%
                          </span>
                          <span
                            className={cn(
                              'text-[11px] font-medium',
                              confidenceColor(signal.confidence.score),
                            )}
                          >
                            {signal.confidence.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {signal.confidence.reason}
                        </p>
                      </div>
                    )}

                    {/* What's missing */}
                    {has('whatsMissing') && signal.whatsMissing.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          What's missing
                        </p>
                        <div className="space-y-1">
                          {signal.whatsMissing.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1.5 text-xs"
                            >
                              <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                              <p className="text-muted-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proof to request */}
                    {has('proofToRequest') &&
                      signal.proofToRequest.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                            Proof to request
                          </p>
                          <div className="space-y-1">
                            {signal.proofToRequest.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-1.5 text-xs"
                              >
                                <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                                <p className="text-muted-foreground">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Recommended briefings */}
                    {has('recommendedBriefings') &&
                      signal.recommendedBriefings.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                            Recommended briefings
                          </p>
                          <div className="space-y-1.5">
                            {signal.recommendedBriefings.map((b) => (
                              <div
                                key={b.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/40"
                              >
                                <div>
                                  <p className="text-xs font-medium text-foreground">
                                    {b.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground capitalize">
                                    {b.type.replace(/_/g, ' ')}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    toast.info('Briefing viewer coming soon')
                                  }
                                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-primary hover:bg-primary/5 transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                  Open
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Sources */}
                    {has('sources') && signal.sources.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {signal.sources.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground"
                            >
                              {s.label}
                            </span>
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

      {/* 2) Aggregated: What's Missing */}
      {aggregatedMissing.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What's missing (aggregated)
          </p>
          <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1.5">
            {aggregatedMissing.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3) Aggregated: Proof to Request */}
      {aggregatedProof.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Proof to request (aggregated)
          </p>
          <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1.5">
            {aggregatedProof.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4) Aggregated: Recommended Briefings */}
      {aggregatedBriefings.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Recommended briefings (aggregated)
          </p>
          <div className="space-y-1.5">
            {aggregatedBriefings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/60"
              >
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {b.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {b.type.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={() => toast.info('Briefing viewer coming soon')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5) Confidence Summary */}
      {avgConfidence && (
        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Confidence summary
          </p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-bold',
                confidenceColor(avgConfidence.score),
              )}
            >
              {avgConfidence.score}%
            </span>
            <span
              className={cn(
                'text-[11px] font-medium',
                confidenceColor(avgConfidence.score),
              )}
            >
              {avgConfidence.label}
            </span>
            <span className="text-[10px] text-muted-foreground ml-1">
              (avg across {drivers.filter((d) => d.selection.includedSections.includes('confidence')).length} signal{drivers.filter((d) => d.selection.includedSections.includes('confidence')).length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
