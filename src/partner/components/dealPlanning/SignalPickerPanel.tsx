// SignalPickerPanel — unified "Select drivers" panel with Signals / Initiatives / Trends tabs
// Partner-only, non-breaking. Max 3 per category.

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
import {
  getActiveInitiativeIds,
  toggleInitiative,
  clearActiveInitiatives,
  MAX_ACTIVE_INITIATIVES,
} from '@/partner/data/dealPlanning/activeInitiativesStore';
import {
  getActiveTrendIds,
  toggleTrend,
  clearActiveTrends,
  MAX_ACTIVE_TRENDS,
} from '@/partner/data/dealPlanning/activeTrendsStore';
import { getByFocusId as getInitiativesRecord } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrendsRecord } from '@/data/partner/industryAuthorityTrendsStore';

// ============= Types =============

type DriverTab = 'signals' | 'initiatives' | 'trends';

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

// ============= Replace Dialog (Signals only) =============

function ReplaceDialog({
  activeSignals,
  onReplace,
  onCancel,
}: {
  activeSignals: { id: string; title: string }[];
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

// ============= Generic Selectable Row =============

function SelectableRow({
  label,
  sublabel,
  isActive,
  onToggle,
  badges,
}: {
  label: string;
  sublabel?: string;
  isActive: boolean;
  onToggle: () => void;
  badges?: { text: string; className: string }[];
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
        <p className="text-[11px] font-medium text-foreground leading-snug">{label}</p>
        {sublabel && (
          <p className="text-[9px] text-muted-foreground">{sublabel}</p>
        )}
        {badges && badges.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {badges.map((b, i) => (
              <span key={i} className={cn('text-[8px] font-medium px-1.5 py-px rounded-full border', b.className)}>
                {b.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

// ============= Pool Section (Signals tab) =============

function PoolSection({
  title,
  signals,
  activeIds,
  onToggle,
}: {
  title: string;
  signals: PooledSignal[];
  activeIds: Set<string>;
  onToggle: (signal: PooledSignal) => void;
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
          <SelectableRow
            key={s.id}
            label={s.title}
            sublabel={s.weekOf ?? undefined}
            isActive={activeIds.has(s.id)}
            onToggle={() => onToggle(s)}
            badges={s.origins.map((o) => ({ text: o, className: ORIGIN_STYLE[o] }))}
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

  const [activeTab, setActiveTab] = useState<DriverTab>('signals');

  // ===== Signals data =====
  const pool = useMemo(() => buildSignalPool(accountId, weekOf), [accountId, weekOf]);
  const sections = useMemo(() => splitPoolBySections(pool, weekOf), [pool, weekOf]);
  const signalActiveIds = useMemo(() => new Set(getActiveSignalIds(accountId)), [accountId, forceUpdate]);
  const signalActiveCount = getActiveSignalIds(accountId).length;

  // Replace dialog state (signals only)
  const [pendingReplace, setPendingReplace] = useState<PooledSignal | null>(null);
  const activeSignalDetails = useMemo(() => {
    const ids = getActiveSignalIds(accountId);
    return ids.map((id) => {
      const found = pool.find((p) => p.id === id);
      return { id, title: found?.title ?? id };
    });
  }, [accountId, pool, signalActiveIds]);

  const handleSignalToggle = useCallback((signal: PooledSignal) => {
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

  const handleClearSignals = useCallback(() => {
    clearActiveSignals(accountId);
    rerender();
  }, [accountId, rerender]);

  // ===== Initiatives data =====
  const initiativesRecord = useMemo(() => getInitiativesRecord(accountId), [accountId]);
  const initiatives = initiativesRecord?.public_it_initiatives ?? [];
  const activeInitiativeIds = useMemo(() => new Set(getActiveInitiativeIds(accountId)), [accountId, forceUpdate]);
  const initActiveCount = getActiveInitiativeIds(accountId).length;

  const handleInitiativeToggle = useCallback((id: string) => {
    const success = toggleInitiative(accountId, id);
    if (!success) {
      // At max — could show a replace dialog but for simplicity just toast
      return;
    }
    rerender();
  }, [accountId, rerender]);

  const handleClearInitiatives = useCallback(() => {
    clearActiveInitiatives(accountId);
    rerender();
  }, [accountId, rerender]);

  // ===== Trends data =====
  const trendsRecord = useMemo(() => getTrendsRecord(accountId), [accountId]);
  const trends = trendsRecord?.trends ?? [];
  const activeTrendIds = useMemo(() => new Set(getActiveTrendIds(accountId)), [accountId, forceUpdate]);
  const trendActiveCount = getActiveTrendIds(accountId).length;

  const handleTrendToggle = useCallback((id: string) => {
    const success = toggleTrend(accountId, id);
    if (!success) return;
    rerender();
  }, [accountId, rerender]);

  const handleClearTrends = useCallback(() => {
    clearActiveTrends(accountId);
    rerender();
  }, [accountId, rerender]);

  // ===== Tab config =====
  const tabs: { key: DriverTab; label: string; count: number; max: number }[] = [
    { key: 'signals', label: 'Signals', count: signalActiveCount, max: MAX_ACTIVE_SIGNALS },
    { key: 'initiatives', label: 'Initiatives', count: initActiveCount, max: MAX_ACTIVE_INITIATIVES },
    { key: 'trends', label: 'Trends', count: trendActiveCount, max: MAX_ACTIVE_TRENDS },
  ];

  return (
    <div className="w-[440px] max-w-full border-l border-border bg-card flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Select drivers</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Choose up to 3 signals, initiatives, and trends to influence recommendations.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[11px] font-medium transition-all',
                activeTab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              {t.label}
              {t.count > 0 && (
                <span className="ml-1 text-[9px] opacity-80">({t.count}/{t.max})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ===== Signals Tab ===== */}
        {activeTab === 'signals' && (
          <>
            <p className="text-[11px] font-medium text-foreground">
              Active: {signalActiveCount}/{MAX_ACTIVE_SIGNALS}
            </p>

            {pendingReplace && (
              <ReplaceDialog
                activeSignals={activeSignalDetails}
                onReplace={handleReplace}
                onCancel={() => setPendingReplace(null)}
              />
            )}

            <PoolSection
              title="Extractor (This week)"
              signals={sections.extractor}
              activeIds={signalActiveIds}
              onToggle={handleSignalToggle}
            />

            {sections.quickBrief.length > 0 && <div className="border-t border-border/30" />}
            <PoolSection
              title="Quick Brief picks"
              signals={sections.quickBrief}
              activeIds={signalActiveIds}
              onToggle={handleSignalToggle}
            />

            {sections.history.length > 0 && <div className="border-t border-border/30" />}
            <PoolSection
              title="Recent history"
              signals={sections.history}
              activeIds={signalActiveIds}
              onToggle={handleSignalToggle}
            />

            {pool.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[11px] text-muted-foreground">No signals available for this account.</p>
              </div>
            )}
          </>
        )}

        {/* ===== Initiatives Tab ===== */}
        {activeTab === 'initiatives' && (
          <>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-foreground">
                Active: {initActiveCount}/{MAX_ACTIVE_INITIATIVES}
              </p>
              {initActiveCount === 0 && initiatives.length > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Using all initiatives by default. Select specific ones to narrow scoring.
                </p>
              )}
            </div>

            {initiatives.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[11px] text-muted-foreground">No initiatives available for this account.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {initiatives.map((init) => {
                  const dateLabel = init.announcement_date
                    ?? init.source_published_at
                    ?? (init.year ? String(init.year) : null)
                    ?? (init.source_published_year ? String(init.source_published_year) : null);
                  return (
                    <SelectableRow
                      key={init.id}
                      label={init.title}
                      sublabel={dateLabel ? `${init.initiative_type.replace(/_/g, ' ')} · ${dateLabel}` : init.initiative_type.replace(/_/g, ' ')}
                      isActive={activeInitiativeIds.has(init.id)}
                      onToggle={() => handleInitiativeToggle(init.id)}
                      badges={[{
                        text: init.confidence_level,
                        className: init.confidence_level === 'high'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border-border',
                      }]}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ===== Trends Tab ===== */}
        {activeTab === 'trends' && (
          <>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-foreground">
                Active: {trendActiveCount}/{MAX_ACTIVE_TRENDS}
              </p>
              {trendActiveCount === 0 && trends.length > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Using all trends by default. Select specific ones to narrow scoring.
                </p>
              )}
            </div>

            {trends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[11px] text-muted-foreground">No trends available for this account.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {trends.map((trend) => (
                  <SelectableRow
                    key={trend.id}
                    label={trend.trend_title}
                    sublabel={`${trend.source_org}${trend.source_published_at ? ` · ${trend.source_published_at}` : ''}`}
                    isActive={activeTrendIds.has(trend.id)}
                    onToggle={() => handleTrendToggle(trend.id)}
                    badges={[{
                      text: trend.confidence,
                      className: trend.confidence === 'High'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border',
                    }]}
                  />
                ))}
              </div>
            )}
          </>
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
        {activeTab === 'signals' && signalActiveCount > 0 && (
          <button
            onClick={handleClearSignals}
            className="h-9 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            Clear signals
          </button>
        )}
        {activeTab === 'initiatives' && initActiveCount > 0 && (
          <button
            onClick={handleClearInitiatives}
            className="h-9 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            Clear initiatives
          </button>
        )}
        {activeTab === 'trends' && trendActiveCount > 0 && (
          <button
            onClick={handleClearTrends}
            className="h-9 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            Clear trends
          </button>
        )}
      </div>
    </div>
  );
}
