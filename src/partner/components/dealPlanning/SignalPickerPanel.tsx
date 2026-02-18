// SignalPickerPanel — right-side panel for selecting active signals in Deal Planning
// Shows 3 sections: Extractor, Quick Brief, History with origin chips and max 3 enforcement

import { useState, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { buildSignalPool, splitPoolBySections, type PooledSignal, type SignalOrigin } from '@/partner/data/dealPlanning/signalPool';
import {
  getActiveSignalIds,
  addActiveSignal,
  removeActiveSignal,
  replaceActiveSignal,
  clearActiveSignals,
  MAX_ACTIVE_SIGNALS,
} from '@/partner/data/dealPlanning/activeSignalsStore';

// ============= Origin chip colors =============

const ORIGIN_STYLE: Record<SignalOrigin, string> = {
  Extractor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Quick Brief': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  History: 'bg-muted text-muted-foreground border-border',
};

// ============= Props =============

interface SignalPickerPanelProps {
  accountId: string;
  weekOf: string;
  onClose: () => void;
  onChanged: () => void;
}

// ============= Replace Dialog =============

function ReplaceDialog({
  activeSignals,
  pendingSignal,
  onReplace,
  onCancel,
}: {
  activeSignals: { id: string; title: string }[];
  pendingSignal: PooledSignal;
  onReplace: (oldId: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded border border-border/60 bg-card p-3 space-y-2">
      <p className="text-[11px] font-medium text-foreground">
        You can use up to {MAX_ACTIVE_SIGNALS} signals. Replace one?
      </p>
      <div className="space-y-1.5">
        {activeSignals.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-2 p-2 rounded border border-border/40 bg-background">
            <p className="text-[10px] text-muted-foreground truncate flex-1">{s.title}</p>
            <button
              onClick={() => onReplace(s.id)}
              className="text-[10px] font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Replace
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

// ============= Signal Row =============

function SignalRow({
  signal,
  isActive,
  onToggle,
}: {
  signal: PooledSignal;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full text-left p-2.5 rounded border transition-all flex items-start gap-2.5',
        isActive
          ? 'border-primary/30 bg-primary/[0.03]'
          : 'border-border/40 bg-background hover:border-border hover:bg-muted/20',
      )}
    >
      <Checkbox
        checked={isActive}
        className="mt-0.5 pointer-events-none"
        tabIndex={-1}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[11px] font-medium text-foreground leading-snug">{signal.title}</p>
        {signal.weekOf && (
          <p className="text-[9px] text-muted-foreground">{signal.weekOf}</p>
        )}
        <div className="flex items-center gap-1 flex-wrap">
          {signal.origins.map((o) => (
            <span key={o} className={cn('text-[8px] font-medium px-1.5 py-px rounded-full border', ORIGIN_STYLE[o])}>
              {o}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ============= Section =============

function PoolSection({
  title,
  signals,
  activeIds,
  onToggle,
  defaultExpanded,
}: {
  title: string;
  signals: PooledSignal[];
  activeIds: Set<string>;
  onToggle: (signal: PooledSignal) => void;
  defaultExpanded: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? signals : signals.slice(0, 8);
  const hasMore = signals.length > 8;

  if (signals.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
        {title} ({signals.length})
      </p>
      <div className="space-y-1">
        {visible.map((s) => (
          <SignalRow
            key={s.id}
            signal={s}
            isActive={activeIds.has(s.id)}
            onToggle={() => onToggle(s)}
          />
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </button>
      )}
    </div>
  );
}

// ============= Main Component =============

export function SignalPickerPanel({ accountId, weekOf, onClose, onChanged }: SignalPickerPanelProps) {
  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => { forceUpdate((n) => n + 1); onChanged(); }, [onChanged]);

  const pool = useMemo(() => buildSignalPool(accountId, weekOf), [accountId, weekOf]);
  const sections = useMemo(() => splitPoolBySections(pool, weekOf), [pool, weekOf]);

  const activeIds = useMemo(() => new Set(getActiveSignalIds(accountId)), [accountId, forceUpdate]);

  // Replace dialog state
  const [pendingReplace, setPendingReplace] = useState<PooledSignal | null>(null);

  const activeSignalDetails = useMemo(() => {
    const ids = getActiveSignalIds(accountId);
    return ids.map((id) => {
      const found = pool.find((p) => p.id === id);
      return { id, title: found?.title ?? id };
    });
  }, [accountId, pool, activeIds]);

  const handleToggle = useCallback((signal: PooledSignal) => {
    const ids = getActiveSignalIds(accountId);
    if (ids.includes(signal.id)) {
      removeActiveSignal(accountId, signal.id);
      rerender();
    } else if (ids.length < MAX_ACTIVE_SIGNALS) {
      addActiveSignal(accountId, signal.id);
      rerender();
    } else {
      setPendingReplace(signal);
    }
  }, [accountId, rerender]);

  const handleReplace = useCallback((oldId: string) => {
    if (!pendingReplace) return;
    replaceActiveSignal(accountId, oldId, pendingReplace.id);
    setPendingReplace(null);
    rerender();
  }, [accountId, pendingReplace, rerender]);

  const handleClear = useCallback(() => {
    clearActiveSignals(accountId);
    rerender();
  }, [accountId, rerender]);

  const activeCount = getActiveSignalIds(accountId).length;

  return (
    <div className="w-[440px] max-w-full border-l border-border bg-card flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Signals</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Select up to {MAX_ACTIVE_SIGNALS} signals to sharpen recommendations.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] font-medium text-foreground mt-2">
          Active: {activeCount}/{MAX_ACTIVE_SIGNALS}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Replace dialog */}
        {pendingReplace && (
          <ReplaceDialog
            activeSignals={activeSignalDetails}
            pendingSignal={pendingReplace}
            onReplace={handleReplace}
            onCancel={() => setPendingReplace(null)}
          />
        )}

        <PoolSection
          title="Extractor (This week)"
          signals={sections.extractor}
          activeIds={activeIds}
          onToggle={handleToggle}
          defaultExpanded
        />

        {sections.quickBrief.length > 0 && <div className="border-t border-border/30" />}
        <PoolSection
          title="Quick Brief picks"
          signals={sections.quickBrief}
          activeIds={activeIds}
          onToggle={handleToggle}
          defaultExpanded
        />

        {sections.history.length > 0 && <div className="border-t border-border/30" />}
        <PoolSection
          title="Recent history"
          signals={sections.history}
          activeIds={activeIds}
          onToggle={handleToggle}
          defaultExpanded={false}
        />

        {pool.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-muted-foreground">No signals available for this account.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex-1 h-9 rounded text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="h-9 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            Clear active signals
          </button>
        )}
      </div>
    </div>
  );
}
