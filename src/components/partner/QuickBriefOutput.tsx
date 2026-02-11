// Quick Brief Output — expandable signal cards with selection & promote flow
// Now reads from canonical Signal objects directly

import { useState, useCallback } from 'react';
import {
  Zap,
  Copy,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  AlertTriangle,
  Info,
  Play,
  Check,
  Link2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Signal } from '@/data/partner/signalStore';
import { getSignal } from '@/data/partner/signalStore';
import { promoteSignalsToDealPlan } from '@/data/partner/dealPlanStore';
import { getSignalThumbnail } from '@/data/partner/signalThumbnails';

export type QuickBriefNeed = 'meeting-prep' | 'objection-help' | 'competitive-position' | 'intro-email' | 'value-pitch';

interface QuickBriefOutputProps {
  customerName: string;
  focusId: string;
  weekOf: string;
  signals: Signal[];
  onPromoteToDealBrief: () => void;
  onReset: () => void;
}

export function QuickBriefOutput({
  customerName,
  focusId,
  weekOf,
  signals,
  onPromoteToDealBrief,
  onReset,
}: QuickBriefOutputProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handlePromote = () => {
    if (selectedIds.size === 0) return;
    const selected = signals.filter((s) => selectedIds.has(s.id));
    if (selected.length === 0) return;

    try {
      const { addedCount } = promoteSignalsToDealPlan(focusId, weekOf, selected);
      if (addedCount > 0) {
        toast.success(`Added ${addedCount} signal${addedCount > 1 ? 's' : ''} to Deal Planning`);
      } else {
        toast.info('All selected signals are already in Deal Planning');
      }
      onPromoteToDealBrief();
    } catch {
      toast.error('Failed to promote signals');
    }
  };

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  if (signals.length === 0) return null;

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Quick Brief: {customerName}
          </h3>
        </div>
        <button
          onClick={handlePromote}
          disabled={selectedIds.size === 0}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            selectedIds.size > 0
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          <ArrowUpRight className="w-3 h-3" />
          Promote to Deal Planning
          {selectedIds.size > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-[10px]">
              {selectedIds.size}
            </span>
          )}
        </button>
      </div>

      {/* Speed controls */}
      <div className="flex items-center gap-3">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 flex-1">
          <Info className="w-3 h-3" />
          Based on your Dialogue activity
        </p>
        <button
          onClick={() => {
            const allSelected = signals.every((s) => selectedIds.has(s.id));
            if (allSelected) {
              setSelectedIds(new Set());
            } else {
              setSelectedIds(new Set(signals.map((s) => s.id)));
            }
          }}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          {signals.every((s) => selectedIds.has(s.id)) ? 'Deselect all' : 'Select all'}
        </button>
        {selectedIds.size > 0 && (
          <button
            onClick={() => setExpandedIds(new Set(selectedIds))}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ChevronDown className="w-3 h-3" />
            Expand selected
          </button>
        )}
      </div>

      {/* Signal Cards */}
      <div className="space-y-2">
        {signals.map((signal, idx) => {
          const isExpanded = expandedIds.has(signal.id);
          const isSelected = selectedIds.has(signal.id);
          const thumb = getSignalThumbnail(signal.id);

          // Signal type badge colors
          const typeColors: Record<string, string> = {
            vendor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            regulatory: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            internalActivity: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
            competitive: 'bg-red-500/10 text-red-600 border-red-500/20',
            localMarket: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          };
          const typeColor = typeColors[signal.type] ?? 'bg-muted text-muted-foreground border-border';

          return (
            <div
              key={signal.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                isSelected
                  ? 'border-primary/40 bg-primary/[0.02]'
                  : 'border-border/60 bg-card'
              )}
            >
              {/* Image strip at top */}
              {thumb && (
                <div className="relative h-24 w-full overflow-hidden bg-muted/30">
                  <img
                    src={thumb}
                    alt=""
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                  {/* Type badge overlay */}
                  <span className={cn(
                    'absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm',
                    typeColor
                  )}>
                    {signal.type}
                  </span>
                  {/* Confidence overlay */}
                  <span className={cn(
                    'absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/40',
                    signal.confidence >= 60 ? 'text-green-600' : 'text-primary'
                  )}>
                    {signal.confidence}%
                  </span>
                </div>
              )}

              {/* Collapsed header */}
              <div className="flex items-start gap-3 p-3">
                <button
                  onClick={() => toggleSelect(signal.id)}
                  className={cn(
                    'mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </button>

                {!thumb && (
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  {!thumb && (
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', typeColor)}>
                        {signal.type}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {signal.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {signal.soWhat}
                  </p>
                  {!isExpanded && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                      &rarr; {signal.recommendedAction}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => toggleExpand(signal.id)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded dropdown */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3 ml-[52px]">
                  {/* 1) Talk Track */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Talk track
                      </p>
                      <button
                        onClick={() => handleCopy(signal.talkTrack)}
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      {signal.talkTrack}
                    </p>
                  </div>

                  {/* 2) Confidence */}
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-bold', confidenceColor(signal.confidence))}>
                        {signal.confidence}%
                      </span>
                      <span className={cn('text-[11px] font-medium', confidenceColor(signal.confidence))}>
                        {signal.confidenceLabel}
                      </span>
                    </div>
                  </div>

                  {/* 3) What's missing */}
                  {signal.whatsMissing.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        What&apos;s missing
                      </p>
                      <div className="space-y-1">
                        {signal.whatsMissing.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4) Proof to request */}
                  {signal.proofToRequest.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Proof to request
                      </p>
                      <div className="space-y-1">
                        {signal.proofToRequest.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5) Who cares */}
                  {signal.whoCares.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Who cares
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {signal.whoCares.map((role, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground"
                          >
                            <Users className="w-2.5 h-2.5" />
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6) Sources */}
                  {signal.sources.length > 0 && (
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
                            {s}
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

      {/* Bottom promote CTA */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">
              {selectedIds.size} signal{selectedIds.size > 1 ? 's' : ''} selected
            </p>
            <p className="text-[11px] text-muted-foreground">
              Snapshots will be saved to Deal Planning.
            </p>
          </div>
          <button
            onClick={handlePromote}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Open Deal Planning
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Context + Reset */}
      <p className="text-[11px] text-muted-foreground/70 text-center italic">
        Context used: last touchpoint + upcoming meeting (simulated in demo).
      </p>
      <div className="flex justify-center pt-1">
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          New quick brief
        </button>
      </div>
    </div>
  );
}
