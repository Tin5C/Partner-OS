// RecommendedPlaysPanel — vertical bar chart Recommended Plays
// Partner-only, non-breaking. Scoring/propensity logic unchanged.

import { useState, useMemo, useCallback } from 'react';
import {
  Sparkles, TrendingUp, ChevronRight, ChevronDown, Trash2, Zap, Info,
  X, Upload, FileText, Link2, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import { scorePlayPacks, type PropensityInput, type ScoredPlay } from '@/partner/lib/dealPlanning/propensity';
import { addSelectedPack, removeSelectedPack, getSelectedPacks, addContentRequest, getActivePlay, clearActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';
import { getByFocusId as getInitiatives } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrends } from '@/data/partner/industryAuthorityTrendsStore';
import { getActiveSignalIds } from '@/partner/data/dealPlanning/activeSignalsStore';
import { getActiveInitiativeIds } from '@/partner/data/dealPlanning/activeInitiativesStore';
import { getActiveTrendIds } from '@/partner/data/dealPlanning/activeTrendsStore';
import { buildSignalPool } from '@/partner/data/dealPlanning/signalPool';
import { listMemoryItems, addMemoryItem, type MemoryItemType } from '@/data/partner/accountMemoryStore';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '@/components/ui/popover';
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

// ============= Bar Color Palette =============

const BAR_COLORS = [
  'bg-primary',
  'bg-primary/70',
  'bg-primary/45',
];

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
  const [selectedPlayId, setSelectedPlayId] = useState<string | null>(null);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const [reviewTab, setReviewTab] = useState<'signals' | 'evidence' | 'initiatives' | 'trends'>('signals');
  const [evidenceVersion, setEvidenceVersion] = useState(0);
  const [addEvidenceMode, setAddEvidenceMode] = useState<'upload' | 'paste' | 'link' | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Active signals from the picker store
  const activeSignalIds = useMemo(() => getActiveSignalIds(accountId), [accountId, promotedSignals, showPicker]);
  const activeSignalCount = activeSignalIds.length;

  // Active initiatives & trends selections
  const activeInitiativeIds = useMemo(() => getActiveInitiativeIds(accountId), [accountId, showPicker]);
  const activeTrendIds = useMemo(() => getActiveTrendIds(accountId), [accountId, showPicker]);

  // Build promoted signals from active signal IDs by looking up in pool
  const activeAsPromoted = useMemo((): PromotedSignal[] => {
    if (activeSignalCount === 0) return promotedSignals;
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

  const signalsForScoring = activeSignalCount > 0 ? activeAsPromoted : promotedSignals;

  // Read canonical stores
  const allInitiativesTitles = useMemo(() => {
    const rec = getInitiatives(accountId);
    return rec?.public_it_initiatives ?? [];
  }, [accountId]);

  const allTrendsTitles = useMemo(() => {
    const pack = getTrends(accountId);
    return pack?.trends ?? [];
  }, [accountId]);

  const initiativesTitlesForScoring = useMemo(() => {
    if (activeInitiativeIds.length > 0) {
      const selectedSet = new Set(activeInitiativeIds);
      return allInitiativesTitles.filter((i) => selectedSet.has(i.id)).map((i) => i.title);
    }
    return allInitiativesTitles.map((i) => i.title);
  }, [allInitiativesTitles, activeInitiativeIds]);

  const trendsTitlesForScoring = useMemo(() => {
    if (activeTrendIds.length > 0) {
      const selectedSet = new Set(activeTrendIds);
      return allTrendsTitles.filter((t) => selectedSet.has(t.id)).map((t) => t.trend_title);
    }
    return allTrendsTitles.map((t) => t.trend_title);
  }, [allTrendsTitles, activeTrendIds]);

  // Score plays — logic unchanged
  const scoredPlays = useMemo(() => {
    const input: PropensityInput = {
      promotedSignals: signalsForScoring,
      engagementType,
      motion,
      readinessScore,
      initiatives: initiativesTitlesForScoring,
      trends: trendsTitlesForScoring,
    };
    const all = scorePlayPacks(PLAY_SERVICE_PACKS, input);
    return signalsForScoring.length === 0 ? all.slice(0, 2) : all.slice(0, 3);
  }, [signalsForScoring, engagementType, motion, readinessScore, initiativesTitlesForScoring, trendsTitlesForScoring]);

  const selectedPacks = useMemo(() => getSelectedPacks(accountId), [accountId, scoredPlays]);
  const activePlay = useMemo(() => getActivePlay(accountId), [accountId, scoredPlays]);
  const hasNoContext = signalsForScoring.length === 0 && allInitiativesTitles.length === 0 && allTrendsTitles.length === 0;

  // Default-select top-ranked play
  const effectiveSelectedId = selectedPlayId ?? scoredPlays[0]?.packId ?? null;
  const selectedPlay = scoredPlays.find((p) => p.packId === effectiveSelectedId) ?? null;

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

  const handleRemoveFromPlan = (play: ScoredPlay) => {
    removeSelectedPack(accountId, play.packId);
    if (activePlay?.playId === play.packId) {
      clearActivePlay(accountId);
    }
    toast.success(`"${play.packName}" removed from plan`);
    onRefresh?.();
  };

  // Display counts
  const displaySignalCount = activeSignalCount > 0 ? activeSignalCount : promotedSignals.length;
  const initiativeSummary = activeInitiativeIds.length > 0 ? `${activeInitiativeIds.length}/3` : 'All';
  const trendSummary = activeTrendIds.length > 0 ? `${activeTrendIds.length}/3` : 'All';

  // Max fit score for bar height normalisation
  const maxFit = Math.max(...scoredPlays.map((p) => p.engagementFitPct), 1);

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-4 space-y-4">
      {/* ===== Header ===== */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-foreground">Recommended approach</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline-offset-2 underline decoration-border hover:decoration-foreground">
              Based on Account Intelligence (Signals: {displaySignalCount}/3 selected)
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 space-y-3" align="start">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Selected drivers</p>

            {/* Signal chips */}
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground">Signals: {displaySignalCount}/3</p>
              {activeSignalIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    const pool = buildSignalPool(accountId, weekOf);
                    return activeSignalIds.map((id) => {
                      const found = pool.find((p) => p.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-border/60 bg-muted/30 text-foreground truncate max-w-[200px]"
                          title={found?.title ?? id}
                        >
                          {found?.title ?? id}
                        </span>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Initiative / trend counts */}
            <div className="space-y-0.5 text-[10px] text-muted-foreground">
              <p>Initiatives: {initiativeSummary}</p>
              <p>Trends: {trendSummary}</p>
            </div>

            <button
              onClick={onOpenPicker}
              className="w-full text-center text-[11px] font-medium text-primary hover:text-primary/80 transition-colors pt-1 border-t border-border/40"
            >
              Adjust drivers
            </button>
          </PopoverContent>
        </Popover>
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
        <>
          {/* ===== Bar Chart ===== */}
          <div className="flex justify-center items-end gap-6 pt-2 pb-1" style={{ minHeight: 180 }}>
            {scoredPlays.map((play, idx) => {
              const isSelected = play.packId === effectiveSelectedId;
              const isAdded = selectedPacks.includes(play.packId);
              const isActivePlan = activePlay?.playId === play.packId;
              const barHeight = Math.max(Math.round((play.engagementFitPct / maxFit) * 140), 28);

              return (
                <button
                  key={play.packId}
                  onClick={() => setSelectedPlayId(play.packId)}
                  className={cn(
                    'flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1 py-1 transition-all',
                    isSelected && 'scale-[1.03]',
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Select ${play.packName}`}
                >
                  {/* Score label */}
                  <span className={cn(
                    'text-[11px] font-semibold tabular-nums',
                    isSelected ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                    {play.engagementFitPct}%
                  </span>

                  {/* Bar */}
                  <div
                    className={cn(
                      'w-14 rounded-t-md transition-all',
                      BAR_COLORS[idx] ?? 'bg-primary/30',
                      isSelected ? 'ring-2 ring-primary/40 ring-offset-1 ring-offset-background' : 'opacity-70',
                    )}
                    style={{ height: barHeight }}
                  />

                  {/* Label */}
                  <span className={cn(
                    'text-[10px] text-center leading-tight max-w-[80px]',
                    isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}>
                    {play.packName}
                  </span>

                  {/* CTA */}
                  {(isAdded || isActivePlan) ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromPlan(play); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleRemoveFromPlan(play); } }}
                      className="text-[10px] font-medium text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Remove from Plan
                    </span>
                  ) : (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); handleAddToPlan(play); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleAddToPlan(play); } }}
                      className="text-[10px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded px-2 py-0.5 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Add to Plan
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ===== Selected Play Summary ===== */}
          {selectedPlay && (
            <div className="border-t border-border/40 pt-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">{selectedPlay.packName}</p>
              <p className="text-[11px] text-muted-foreground">
                {selectedPlay.drivers.length} signal{selectedPlay.drivers.length !== 1 ? 's' : ''}
                {' · '}
                {trendsTitlesForScoring.length} trend{trendsTitlesForScoring.length !== 1 ? 's' : ''}
                {' · '}
                {selectedPlay.gaps.length} gap{selectedPlay.gaps.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReadinessPlay(selectedPlay)}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Review Readiness
                </button>

                {/* Inline Explain Score */}
                {(() => {
                  const packDef = PLAY_SERVICE_PACKS.find((p) => p.id === selectedPlay.packId);
                  if (!packDef) return null;
                  return (
                    <ScoreBreakdownPanel
                      play={selectedPlay}
                      packTags={packDef.tags}
                      packBias={packDef.bias}
                      packMotionFit={packDef.motionFit}
                      packPrerequisites={packDef.prerequisites}
                      promotedSignals={signalsForScoring}
                      engagementType={engagementType}
                      motion={motion}
                      readinessScore={readinessScore}
                      initiatives={initiativesTitlesForScoring}
                      trends={trendsTitlesForScoring}
                      allInitiativeCount={allInitiativesTitles.length}
                      allTrendCount={allTrendsTitles.length}
                      selectedInitiativeCount={activeInitiativeIds.length}
                      selectedTrendCount={activeTrendIds.length}
                    />
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== Inputs Summary Row ===== */}
      {(() => {
        const evidenceCount = listMemoryItems(accountId).length + evidenceVersion * 0;
        return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/40">
            <p className="text-[11px] text-muted-foreground flex-1">
              <span className="font-medium text-foreground">Inputs:</span>{' '}
              Signals {displaySignalCount}/3 · Evidence {evidenceCount} · Initiatives {initiativeSummary} · Trends {trendSummary}
            </p>
            <button
              onClick={() => { setReviewTab('signals'); setShowReviewDrawer(true); }}
              className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap underline underline-offset-2"
            >
              Review &amp; edit inputs
            </button>
          </div>
        );
      })()}

      {/* ===== Review & Edit Inputs Drawer ===== */}
      {showReviewDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowReviewDrawer(false)}>
          <div
            className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-sm font-semibold text-foreground">Review &amp; edit inputs</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Manage the inputs that influence recommendations.</p>
              </div>
              <button onClick={() => setShowReviewDrawer(false)} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 flex-shrink-0">
              {(['signals', 'evidence', 'initiatives', 'trends'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setReviewTab(tab)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize',
                    reviewTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Signals tab */}
              {reviewTab === 'signals' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    Select up to 3 signals to influence recommendations.
                  </p>
                  <div className="space-y-1.5">
                    {(() => {
                      const pool = buildSignalPool(accountId, weekOf);
                      return activeSignalIds.map((id) => {
                        const found = pool.find((p) => p.id === id);
                        return (
                          <div key={id} className="flex items-center gap-2 p-2 rounded border border-border/40 bg-background">
                            <span className="text-[11px] text-foreground flex-1 truncate">{found?.title ?? id}</span>
                          </div>
                        );
                      });
                    })()}
                    {activeSignalIds.length === 0 && (
                      <p className="text-[10px] text-muted-foreground italic">No signals selected — using all available.</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowReviewDrawer(false); onOpenPicker(); }}
                    className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                  >
                    Adjust drivers
                  </button>
                </div>
              )}

              {/* Evidence tab */}
              {reviewTab === 'evidence' && (
                <div className="space-y-3">
                  {(() => {
                    const items = listMemoryItems(accountId);
                    return (
                      <>
                        {items.length > 0 ? (
                          <div className="space-y-1.5">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 p-2 rounded border border-border/40 bg-background">
                                <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] text-foreground truncate">{item.title}</p>
                                  <p className="text-[9px] text-muted-foreground">{item.type.replace(/_/g, ' ')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground italic">No evidence added yet.</p>
                        )}

                        {/* Add evidence inline */}
                        {!addEvidenceMode ? (
                          <button
                            onClick={() => setAddEvidenceMode('paste')}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add evidence
                          </button>
                        ) : (
                          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/10 p-3">
                            <div className="flex items-center gap-1">
                              {([
                                { key: 'upload' as const, icon: <Upload className="w-3 h-3" />, label: 'Upload' },
                                { key: 'paste' as const, icon: <FileText className="w-3 h-3" />, label: 'Paste text' },
                                { key: 'link' as const, icon: <Link2 className="w-3 h-3" />, label: 'Add link' },
                              ]).map((t) => (
                                <button
                                  key={t.key}
                                  onClick={() => setAddEvidenceMode(t.key)}
                                  className={cn(
                                    'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all',
                                    addEvidenceMode === t.key
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                                  )}
                                >
                                  {t.icon} {t.label}
                                </button>
                              ))}
                            </div>

                            {addEvidenceMode === 'upload' && (
                              <div className="rounded border border-dashed border-border/60 bg-background p-4 text-center">
                                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                                <p className="text-[10px] text-muted-foreground">File upload (simulated in demo)</p>
                                <button
                                  onClick={() => {
                                    addMemoryItem({ account_id: accountId, type: 'other', title: `Uploaded file — ${new Date().toLocaleDateString()}` });
                                    setAddEvidenceMode(null);
                                    setEvidenceVersion((v) => v + 1);
                                    onRefresh?.();
                                    toast.success('Evidence uploaded');
                                  }}
                                  className="mt-2 text-[10px] font-medium text-primary hover:text-primary/80"
                                >
                                  Simulate upload
                                </button>
                              </div>
                            )}

                            {addEvidenceMode === 'paste' && (
                              <div className="space-y-2">
                                <Textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Paste notes, transcript, or context…" className="text-xs min-h-[60px]" />
                                <button
                                  disabled={!pasteText.trim()}
                                  onClick={() => {
                                    addMemoryItem({ account_id: accountId, type: 'transcript_notes', title: pasteText.trim().slice(0, 60) || 'Pasted notes', content_text: pasteText.trim() });
                                    setPasteText(''); setAddEvidenceMode(null); setEvidenceVersion((v) => v + 1); onRefresh?.(); toast.success('Evidence saved');
                                  }}
                                  className={cn('h-7 px-3 rounded text-[10px] font-medium transition-colors', pasteText.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed')}
                                >
                                  Save
                                </button>
                              </div>
                            )}

                            {addEvidenceMode === 'link' && (
                              <div className="space-y-2">
                                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" className="text-xs h-8" />
                                <button
                                  disabled={!linkUrl.trim()}
                                  onClick={() => {
                                    addMemoryItem({ account_id: accountId, type: 'link', title: linkUrl.trim().slice(0, 80), url: linkUrl.trim() });
                                    setLinkUrl(''); setAddEvidenceMode(null); setEvidenceVersion((v) => v + 1); onRefresh?.(); toast.success('Link saved');
                                  }}
                                  className={cn('h-7 px-3 rounded text-[10px] font-medium transition-colors', linkUrl.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed')}
                                >
                                  Save
                                </button>
                              </div>
                            )}

                            <button onClick={() => setAddEvidenceMode(null)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Initiatives tab */}
              {reviewTab === 'initiatives' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    {activeInitiativeIds.length > 0 ? `${activeInitiativeIds.length} initiative(s) selected.` : 'All initiatives included by default.'}
                  </p>
                  <button onClick={() => { setShowReviewDrawer(false); onOpenPicker(); }} className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-2">Adjust drivers</button>
                </div>
              )}

              {/* Trends tab */}
              {reviewTab === 'trends' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    {activeTrendIds.length > 0 ? `${activeTrendIds.length} trend(s) selected.` : 'All trends included by default.'}
                  </p>
                  <button onClick={() => { setShowReviewDrawer(false); onOpenPicker(); }} className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-2">Adjust drivers</button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/40 flex-shrink-0">
              <button onClick={() => setShowReviewDrawer(false)} className="w-full h-9 rounded text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Collapsible Selected Drivers ===== */}
      {promotedSignals.length > 0 && (
        <Collapsible open={driversOpen} onOpenChange={setDriversOpen}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
            {driversOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <Zap className="w-3 h-3" />
            Promoted signals ({promotedSignals.length})
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
          initiativeCount={allInitiativesTitles.length}
          trendCount={allTrendsTitles.length}
          onClose={() => setReadinessPlay(null)}
          onAddToPlan={handleAddToPlan}
        />
      )}
    </div>
  );
}
