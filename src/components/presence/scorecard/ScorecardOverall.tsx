import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, Circle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TierLevel, TIER_NAMES, TierGatingCheck } from '@/lib/presenceScorecardData';

interface ScorecardOverallProps {
  score: number;
  tier: TierLevel;
  tierExplanation: string;
  gatingChecks: TierGatingCheck[];
  onPreviewTier?: (tier: TierLevel) => void;
  showTierPreview?: boolean;
}

const TIER_COLORS: Record<TierLevel, string> = {
  0: 'bg-muted text-muted-foreground',
  1: 'bg-amber-500/10 text-amber-700',
  2: 'bg-blue-500/10 text-blue-700',
  3: 'bg-emerald-500/10 text-emerald-700',
};

const SCORE_COLORS: Record<number, string> = {
  0: 'text-muted-foreground',
  1: 'text-rose-600',
  2: 'text-amber-600',
  3: 'text-blue-600',
  4: 'text-emerald-600',
};

function getScoreColor(score: number): string {
  if (score >= 80) return SCORE_COLORS[4];
  if (score >= 60) return SCORE_COLORS[3];
  if (score >= 40) return SCORE_COLORS[2];
  if (score > 0) return SCORE_COLORS[1];
  return SCORE_COLORS[0];
}

export function ScorecardOverall({ 
  score, 
  tier, 
  tierExplanation, 
  gatingChecks,
  onPreviewTier,
  showTierPreview = true,
}: ScorecardOverallProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
          <Trophy className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Overall</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weighted score and tier placement</p>
        </div>

        {/* Tier Preview Dropdown */}
        {showTierPreview && onPreviewTier && (
          <Select value={String(tier)} onValueChange={(v) => onPreviewTier(Number(v) as TierLevel)}>
            <SelectTrigger className="w-[130px] h-7 text-xs">
              <SelectValue placeholder="Preview tier" />
            </SelectTrigger>
            <SelectContent>
              {([0, 1, 2, 3] as TierLevel[]).map((t) => (
                <SelectItem key={t} value={String(t)}>
                  Tier {t}: {TIER_NAMES[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="text-center">
          <p className={cn("text-5xl font-bold", getScoreColor(score))}>{score}</p>
          <p className="text-xs text-muted-foreground mt-1">out of 100</p>
        </div>
        <div className="h-12 w-px bg-border" />
        <div className="text-center">
          <span className={cn(
            "text-sm px-3 py-1.5 rounded-full font-medium inline-block",
            TIER_COLORS[tier]
          )}>
            Tier {tier}: {TIER_NAMES[tier]}
          </span>
        </div>
      </div>

      {/* Tier Explanation */}
      <p className="text-xs text-muted-foreground text-center">
        {tierExplanation}
      </p>

      {/* Gating Checklist */}
      <div className="pt-3 border-t border-border space-y-2">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Tier gating requirements
        </p>
        {gatingChecks.map((check, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {check.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <span className={cn(
              "text-xs",
              check.met ? "text-foreground" : "text-muted-foreground"
            )}>
              {check.label}
              {check.required && !check.met && (
                <span className="text-[10px] text-amber-600 ml-1">(required for Tier 2+)</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
