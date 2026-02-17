// RecommendedPlaysPanel — top-of-page panel showing top 3 recommended plays
// Partner-only, does NOT modify existing Deal Planning data shape

import { useMemo } from 'react';
import { Sparkles, Plus, FileSearch, TrendingUp, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';
import { scorePlayPacks, type PropensityInput } from '@/partner/lib/dealPlanning/propensity';
import { addSelectedPack, getSelectedPacks, addContentRequest } from '@/partner/data/dealPlanning/selectedPackStore';

interface RecommendedPlaysPanelProps {
  accountId: string;
  promotedSignals: PromotedSignal[];
  engagementType: 'new_logo' | 'existing_customer' | null;
  motion: string | null;
  readinessScore?: number | null;
  onRefresh?: () => void;
}

export function RecommendedPlaysPanel({
  accountId,
  promotedSignals,
  engagementType,
  motion,
  readinessScore,
  onRefresh,
}: RecommendedPlaysPanelProps) {
  const scoredPlays = useMemo(() => {
    const input: PropensityInput = {
      promotedSignals,
      engagementType,
      motion,
      readinessScore,
    };
    return scorePlayPacks(PLAY_SERVICE_PACKS, input);
  }, [promotedSignals, engagementType, motion, readinessScore]);

  const selectedPacks = useMemo(() => getSelectedPacks(accountId), [accountId, scoredPlays]);

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

  // Empty state
  if (promotedSignals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">Recommended Plays</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Promote signals to generate recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-4 space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-foreground">Recommended Plays</p>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Based on promoted signals, strategy pillars, and motion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scoredPlays.map((play) => {
          const isAdded = selectedPacks.includes(play.packId);
          return (
            <div
              key={play.packId}
              className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2.5 flex flex-col"
            >
              <div>
                <p className="text-xs font-semibold text-foreground leading-snug">{play.packName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-primary">
                    Engagement Fit: {play.engagementFitPct}%
                  </span>
                  <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', confidenceColor(play.confidence))}>
                    {play.confidence}
                  </span>
                </div>
              </div>

              {/* Drivers */}
              {play.drivers.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <TrendingUp className="w-2.5 h-2.5" /> Drivers
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
                    <AlertTriangle className="w-2.5 h-2.5" /> Gaps
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
    </div>
  );
}
