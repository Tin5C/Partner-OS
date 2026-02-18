// RecommendedPlaysPanel — unified Recommended Plays + Promoted Drivers section
// Partner-only, non-breaking

import { useState, useMemo } from 'react';
import {
  Sparkles, TrendingUp, Check,
  ChevronRight, ChevronDown, Trash2, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import { scorePlayPacks, type PropensityInput, type ScoredPlay } from '@/partner/lib/dealPlanning/propensity';
import { addSelectedPack, getSelectedPacks, addContentRequest, getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';
import { getByFocusId as getInitiatives } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrends } from '@/data/partner/industryAuthorityTrendsStore';
import { getActiveSignalIds } from '@/partner/data/dealPlanning/activeSignalsStore';
import { buildSignalPool } from '@/partner/data/dealPlanning/signalPool';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ReadinessAssessmentPanel } from './ReadinessAssessmentPanel';
import { ScoreBreakdownPanel } from './ScoreBreakdownPanel';
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';

// ============= Signal Type Badge Colors =============

const TYPE_COLORS: Record<string, string> = {
  vendor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  regulatory: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  internalActivity: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  competitive: 'bg-red-500/10 text-red-600 border-red-500/20',
  localMarket: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

// ============= Props =============

interface RecommendedPlaysPanelProps {
  accountId: string;
  promotedSignals: PromotedSignal[];
  engagementType: 'new_logo' | 'existing_customer' | null;
  motion: string | null;
  readinessScore?: number | null;
  onRefresh?: () => void;
  onRemoveSignal: (signalId: string) => void;
  onOpenPicker: () => void;
  showPicker: boolean;
  pickerNode?: React.ReactNode;
  onPlaySelected?: (play: { packId: string; packName: string; drivers: string[]; gaps: string[] }) => void;
  weekOf?: string;
  onGoToAccountIntelligence?: () => void;
}

// ============= Main Component =============

export function RecommendedPlaysPanel({
  accountId,
  promotedSignals,
  engagementType,
  motion,
  readinessScore,
  onRefresh,
  onRemoveSignal,
  onOpenPicker,
  showPicker,
  pickerNode,
  onPlaySelected,
  weekOf = '2026-02-10',
  onGoToAccountIntelligence,
}: RecommendedPlaysPanelProps) {
  const [driversOpen, setDriversOpen] = useState(false);
  const [readinessPlay, setReadinessPlay] = useState<ScoredPlay | null>(null);

  // Active signals from the picker store
  const activeSignalIds = useMemo(() => getActiveSignalIds(accountId), [accountId, promotedSignals, showPicker]);
  const activeSignalCount = activeSignalIds.length;

  // Build promoted signals from active signal IDs by looking up in pool
  const activeAsPromoted = useMemo((): PromotedSignal[] => {
    if (activeSignalCount === 0) return promotedSignals; // fallback to legacy
    const pool = buildSignalPool(accountId, weekOf);
    return activeSignalIds.map((id) => {
      const found = pool.find((p) => p.id === id);
      return {
        signalId: id,
        snapshot: {
          type: (found?.type as any) ?? 'vendor',
          title: found?.title ?? id,
          whatChanged: [],
          soWhat: found?.soWhat ?? '',
          recommendedAction: '',
          whoCares: [],
          talkTrack: '',
          proofToRequest: [],
          whatsMissing: [],
          confidence: found?.confidence ?? 50,
          confidenceLabel: (found?.confidence ?? 50) >= 60 ? 'High' : 'Medium',
          sources: [],
        },
        promotedAt: new Date().toISOString(),
      } satisfies PromotedSignal;
    });
  }, [activeSignalIds, accountId, weekOf, promotedSignals]);

  // Use active signals for scoring if any selected, otherwise fall back to legacy promoted
  const signalsForScoring = activeSignalCount > 0 ? activeAsPromoted : promotedSignals;

  // Read canonical stores
  const initiativesTitles = useMemo(() => {
    const rec = getInitiatives(accountId);
    return rec?.public_it_initiatives?.map((i) => i.title) ?? [];
  }, [accountId]);

  const trendsTitles = useMemo(() => {
    const pack = getTrends(accountId);
    return pack?.trends?.map((t) => t.trend_title) ?? [];
  }, [accountId]);

  // Score plays
  const scoredPlays = useMemo(() => {
    const input: PropensityInput = {
      promotedSignals: signalsForScoring,
      engagementType,
      motion,
      readinessScore,
      initiatives: initiativesTitles,
      trends: trendsTitles,
    };
    const all = scorePlayPacks(PLAY_SERVICE_PACKS, input);
    return signalsForScoring.length === 0 ? all.slice(0, 2) : all.slice(0, 3);
  }, [signalsForScoring, engagementType, motion, readinessScore, initiativesTitles, trendsTitles]);

  const selectedPacks = useMemo(() => getSelectedPacks(accountId), [accountId, scoredPlays]);
  const activePlay = useMemo(() => getActivePlay(accountId), [accountId, scoredPlays]);
  const hasNoContext = signalsForScoring.length === 0 && initiativesTitles.length === 0 && trendsTitles.length === 0;

  const handleAddToPlan = (play: ScoredPlay) => {
    addSelectedPack(accountId, play.packId);
    onPlaySelected?.({
      packId: play.packId,
      packName: play.packName,
      drivers: play.drivers,
      gaps: play.gaps,
    });
    toast.success(`"${play.packName}" added to plan`);
    onRefresh?.();
  };

  const confidenceLabel = (c: 'High' | 'Medium' | 'Low') => c;

  // Display signal count: active signals if using picker, else legacy promoted
  const displaySignalCount = activeSignalCount > 0 ? activeSignalCount : promotedSignals.length;

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-4 space-y-3">
      {/* ===== Header Row ===== */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">Recommended Plays</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Account Intelligence–driven recommendations.
          </p>
        </div>
        <button
          onClick={onOpenPicker}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex-shrink-0"
        >
          Select drivers
        </button>
      </div>

      {/* ===== Selected Drivers Row ===== */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Selected drivers ({displaySignalCount}/3)
          </span>
          {activeSignalIds.length > 0 && (() => {
            const pool = buildSignalPool(accountId, weekOf);
            return activeSignalIds.map((id) => {
              const found = pool.find((p) => p.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-border/60 bg-muted/30 text-foreground truncate max-w-[180px]"
                  title={found?.title ?? id}
                >
                  {found?.title ?? id}
                </span>
              );
            });
          })()}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Also used: Initiatives: {initiativesTitles.length} · Trends: {trendsTitles.length}</span>
          {onGoToAccountIntelligence && (
            <>
              <span>·</span>
              <button
                onClick={onGoToAccountIntelligence}
                className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
              >
                Find more in Account Intelligence
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== Inline Signal Picker ===== */}
      {showPicker && pickerNode && (
        <div>{pickerNode}</div>
      )}

      {/* ===== Empty State ===== */}
      {hasNoContext ? (
        <div className="rounded border border-border/40 bg-muted/20 p-6 text-center">
          <p className="text-xs text-muted-foreground">
            No account context available yet. Recommendations will appear once intelligence is added.
          </p>
        </div>
      ) : (
        /* ===== Play Cards ===== */
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Recommended Plays
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Top entry plays for this account.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-[1fr]">
          {scoredPlays.map((play) => {
            const isAdded = selectedPacks.includes(play.packId);
            const isActivePlan = activePlay?.playId === play.packId;
            const gapCount = play.gaps.length;
            return (
              <div
                key={play.packId}
                className="rounded border border-border/60 bg-card p-3.5 flex flex-col"
              >
                {/* Content area — grows to fill */}
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <p className="text-xs font-semibold text-foreground leading-snug">{play.packName}</p>

                  {/* Fit Score Block */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fit Score</p>
                    <Progress value={play.engagementFitPct} className="h-1 bg-secondary" />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-foreground">
                        {play.engagementFitPct}% · {confidenceLabel(play.confidence)}
                      </span>
                    </div>
                    {gapCount > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {gapCount} readiness gap{gapCount !== 1 ? 's' : ''} identified
                      </p>
                    )}
                  </div>

                  {/* Drivers */}
                  {play.drivers.length > 0 && (
                    <div>
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                        <TrendingUp className="w-2.5 h-2.5" /> Why this play
                      </p>
                      <div className="space-y-0.5">
                        {play.drivers.map((d, i) => (
                          <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                            <span className="text-primary/60 mt-px">•</span> {d}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Readiness Gaps — inline, dot-separated */}
                  {play.gaps.length > 0 && (
                    <div>
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Readiness Gaps
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-snug">
                        {play.gaps.join(' · ')}
                      </p>
                    </div>
                  )}

                  {/* Score debug breakdown */}
                  {(() => {
                    const packDef = PLAY_SERVICE_PACKS.find((p) => p.id === play.packId);
                    if (!packDef) return null;
                    return (
                      <ScoreBreakdownPanel
                        play={play}
                        packTags={packDef.tags}
                        packBias={packDef.bias}
                        packMotionFit={packDef.motionFit}
                        packPrerequisites={packDef.prerequisites}
                        promotedSignals={signalsForScoring}
                        engagementType={engagementType}
                        motion={motion}
                        readinessScore={readinessScore}
                        initiatives={initiativesTitles}
                        trends={trendsTitles}
                      />
                    );
                  })()}
                </div>

                {/* Fixed footer — always at bottom */}
                <div className="flex items-center gap-3 pt-3 mt-auto">
                  <button
                    onClick={() => handleAddToPlan(play)}
                    disabled={isAdded || isActivePlan}
                    className={cn(
                      'h-9 px-3 rounded text-[11px] font-medium whitespace-nowrap transition-colors',
                      (isAdded || isActivePlan)
                        ? 'bg-secondary text-secondary-foreground cursor-default'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {isActivePlan ? 'In Plan' : isAdded ? 'Added' : 'Add to Plan'}
                  </button>
                  <button
                    onClick={() => setReadinessPlay(play)}
                    className="h-9 px-3 rounded text-[11px] font-medium whitespace-nowrap border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    Review Readiness
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* ===== Collapsible Selected Drivers ===== */}
      {promotedSignals.length > 0 && (
        <Collapsible open={driversOpen} onOpenChange={setDriversOpen}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
            {driversOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <Zap className="w-3 h-3" />
            Selected drivers ({promotedSignals.length})
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1.5">
            {promotedSignals.map((d) => {
              const typeColor = TYPE_COLORS[d.snapshot.type] ?? 'bg-muted text-muted-foreground border-border';
              return (
                <div
                  key={d.signalId}
                  className="flex items-center gap-2.5 p-2 rounded border border-border/40 bg-background"
                >
                  <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0', typeColor)}>
                    {d.snapshot.type}
                  </span>
                  <p className="text-[11px] text-foreground leading-snug flex-1 min-w-0 truncate">
                    {d.snapshot.title}
                  </p>
                  <button
                    onClick={() => onRemoveSignal(d.signalId)}
                    className="p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* ===== Readiness Assessment Panel ===== */}
      {readinessPlay && (
        <ReadinessAssessmentPanel
          play={readinessPlay}
          promotedSignals={signalsForScoring}
          initiativeCount={initiativesTitles.length}
          trendCount={trendsTitles.length}
          onClose={() => setReadinessPlay(null)}
          onAddToPlan={handleAddToPlan}
        />
      )}
    </div>
  );
}
