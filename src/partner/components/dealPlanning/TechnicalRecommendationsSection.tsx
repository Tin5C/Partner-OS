// Technical Recommendations — top 3 technical packs with fit score, prerequisites, risks
// Partner-only, additive block for Technology View

import { useMemo } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, FileText, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import { TECHNICAL_PACKS } from '@/partner/data/dealPlanning/technicalPacks';
import { scorePlayPacks, type PropensityInput } from '@/partner/lib/dealPlanning/propensity';

interface TechnicalRecommendationsSectionProps {
  promotedSignals: PromotedSignal[];
  engagementType: 'new_logo' | 'existing_customer' | null;
  motion: string | null;
  readinessScore?: number | null;
}

export function TechnicalRecommendationsSection({
  promotedSignals,
  engagementType,
  motion,
  readinessScore,
}: TechnicalRecommendationsSectionProps) {
  const scoredPacks = useMemo(() => {
    const input: PropensityInput = {
      promotedSignals,
      engagementType,
      motion,
      readinessScore,
    };
    return scorePlayPacks(TECHNICAL_PACKS, input);
  }, [promotedSignals, engagementType, motion, readinessScore]);

  if (scoredPacks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">Technical Recommendations</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Promote signals to generate technical recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        <p className="text-xs font-semibold text-foreground">Technical Recommendations</p>
      </div>

      <div className="space-y-3">
        {scoredPacks.map((play) => {
          const techPack = TECHNICAL_PACKS.find((p) => p.id === play.packId);

          return (
            <div key={play.packId} className="rounded-lg border border-border/50 bg-background p-3.5 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">{play.packName}</p>
                  <span className="text-[10px] font-bold text-primary mt-0.5 inline-block">
                    Fit Score: {play.engagementFitPct}%
                  </span>
                </div>
                <span className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full border',
                  play.confidence === 'High' ? 'text-green-600 bg-green-500/10 border-green-500/20' :
                  play.confidence === 'Medium' ? 'text-primary bg-primary/10 border-primary/20' :
                  'text-muted-foreground bg-muted/40 border-border/40'
                )}>
                  {play.confidence}
                </span>
              </div>

              {/* Prerequisites */}
              {techPack && techPack.prerequisites.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Prerequisites
                  </p>
                  <div className="space-y-0.5">
                    {techPack.prerequisites.map((p, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary/40 mt-0.5">☐</span> {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Risks */}
              {techPack && techPack.keyRisks.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> Key Risks
                  </p>
                  <div className="space-y-0.5">
                    {techPack.keyRisks.map((r, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-destructive/60 mt-px">•</span> {r}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Artifacts */}
              {techPack && techPack.requiredArtifacts.length > 0 && (
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <FileText className="w-2.5 h-2.5" /> Required Artifacts
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {techPack.requiredArtifacts.map((a, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/30">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Drivers from scoring */}
              {play.drivers.length > 0 && (
                <div className="pt-1 border-t border-border/30">
                  <div className="space-y-0.5">
                    {play.drivers.map((d, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-green-500 mt-px">•</span> {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
