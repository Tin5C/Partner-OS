// RecommendedPlaysPanel — unified Recommended Plays + Promoted Drivers section
// Partner-only, non-breaking

import { useState, useMemo } from 'react';
import {
  Sparkles, Plus, FileSearch, TrendingUp, AlertTriangle, Check, Info,
  ChevronRight, ChevronDown, Trash2, Zap, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import type { Signal } from '@/data/partner/signalStore';
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';
import { scorePlayPacks, type PropensityInput } from '@/partner/lib/dealPlanning/propensity';
import { addSelectedPack, getSelectedPacks, addContentRequest } from '@/partner/data/dealPlanning/selectedPackStore';
import { getByFocusId as getInitiatives } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrends } from '@/data/partner/industryAuthorityTrendsStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
}

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
}: RecommendedPlaysPanelProps) {
  const [driversOpen, setDriversOpen] = useState(false);

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
      promotedSignals,
      engagementType,
      motion,
      readinessScore,
      initiatives: initiativesTitles,
      trends: trendsTitles,
    };
    const all = scorePlayPacks(PLAY_SERVICE_PACKS, input);
    // Draft mode: show 1-2; normal: top 3
    return promotedSignals.length === 0 ? all.slice(0, 2) : all.slice(0, 3);
  }, [promotedSignals, engagementType, motion, readinessScore, initiativesTitles, trendsTitles]);

  const selectedPacks = useMemo(() => getSelectedPacks(accountId), [accountId, scoredPlays]);
  const isDraft = promotedSignals.length === 0;

  const handleAddToPlan = (packId: string, packName: string) => {
    addSelectedPack(accountId, packId);
    toast.success(`"${packName}" added to plan`);
    onRefresh?.();
  };

  const handleRequestProof = (packId: string, packName: string) => {
    addContentRequest(accountId, packId, packName);
    toast.success(`Proof request created for "${packName}"`);
    onRefresh?.();
  };

  const confidenceColor = (c: 'High' | 'Medium' | 'Low') =>
    c === 'High' ? 'text-green-600 bg-green-500/10 border-green-500/20'
    : c === 'Medium' ? 'text-primary bg-primary/10 border-primary/20'
    : 'text-muted-foreground bg-muted/40 border-border/40';

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
            {isDraft
              ? 'Draft suggestions based on Type/Motion and account context. Add signals to refine.'
              : 'Based on selected drivers + account context.'}
          </p>
        </div>
        <button
          onClick={onOpenPicker}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.02] transition-all flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add signals
        </button>
      </div>

      {/* ===== Drivers Used Strip ===== */}
      <div className="flex items-center gap-3 text-[10px]">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider">Drivers used:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(
                'font-medium inline-flex items-center gap-0.5',
                promotedSignals.length > 0 ? 'text-foreground' : 'text-muted-foreground/50 cursor-help'
              )}>
                <Zap className="w-3 h-3" />
                Signals: {promotedSignals.length}
                {promotedSignals.length === 0 && <Info className="w-2.5 h-2.5 ml-0.5" />}
              </span>
            </TooltipTrigger>
            {promotedSignals.length === 0 && (
              <TooltipContent side="top" className="text-[10px]">
                Add signals to increase precision.
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <span className="text-muted-foreground font-medium">Initiatives: {initiativesTitles.length}</span>
        <span className="text-muted-foreground font-medium">Trends: {trendsTitles.length}</span>
      </div>

      {/* ===== Inline Signal Picker ===== */}
      {showPicker && pickerNode && (
        <div>{pickerNode}</div>
      )}

      {/* ===== Play Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scoredPlays.map((play) => {
          const isAdded = selectedPacks.includes(play.packId);
          return (
            <div
              key={play.packId}
              className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2.5 flex flex-col"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground leading-snug">{play.packName}</p>
                  {isDraft && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">
                      DRAFT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-[10px] font-bold text-primary inline-flex items-center gap-0.5 cursor-help">
                          Engagement Fit: {play.engagementFitPct}%
                          <Info className="w-2.5 h-2.5 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                        Score based on promoted signals, public initiatives, and industry trends.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', confidenceColor(play.confidence))}>
                    {play.confidence}
                  </span>
                </div>
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
                        <span className="text-green-500 mt-px">•</span> {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {play.gaps.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> What's missing
                  </p>
                  <div className="space-y-0.5">
                    {play.gaps.map((g, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-destructive/60 mt-px">•</span> {g}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-auto pt-1">
                <button
                  onClick={() => handleAddToPlan(play.packId, play.packName)}
                  disabled={isAdded}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors',
                    isAdded
                      ? 'bg-green-500/10 text-green-600 cursor-default'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {isAdded ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add to Plan</>}
                </button>
                <button
                  onClick={() => handleRequestProof(play.packId, play.packName)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <FileSearch className="w-3 h-3" /> Request Proof
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
                  className="flex items-center gap-2.5 p-2 rounded-lg border border-border/40 bg-background"
                >
                  <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0', typeColor)}>
                    {d.snapshot.type}
                  </span>
                  <p className="text-[11px] text-foreground leading-snug flex-1 min-w-0 truncate">
                    {d.snapshot.title}
                  </p>
                  <button
                    onClick={() => onRemoveSignal(d.signalId)}
                    className="p-1 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
