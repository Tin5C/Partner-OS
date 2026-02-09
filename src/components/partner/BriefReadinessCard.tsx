// Brief Readiness Card (Partner-only)
// Compact maturity score + blockers + missing checklist
// Driven by template-specific maturity dimensions

import { Gauge, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { MaturityScore } from '@/data/briefTemplates';

interface BriefReadinessCardProps {
  score: MaturityScore;
  templateLabel: string;
}

export function BriefReadinessCard({ score, templateLabel }: BriefReadinessCardProps) {
  const scoreColor =
    score.overall >= 75
      ? 'text-green-600'
      : score.overall >= 50
        ? 'text-primary'
        : score.overall >= 25
          ? 'text-[#6D6AF6]'
          : 'text-muted-foreground';

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Readiness</h3>
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            score.overall >= 50
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {score.label} — {score.overall}/100
        </span>
      </div>

      <Progress value={score.overall} className="h-2 mb-3" />

      {/* Top blockers */}
      {score.topBlockers.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#6D6AF6]/70" />
            Top blockers
          </p>
          <div className="space-y-1">
            {score.topBlockers.map((blocker, idx) => (
              <p key={idx} className="text-xs text-foreground">
                • {blocker}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Missing checklist */}
      <div className="space-y-1.5">
        {score.missingChecklist
          .filter((c) => !c.filled)
          .slice(0, 5)
          .map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm border border-muted-foreground/40 flex-shrink-0" />
              <span className="text-muted-foreground">
                {item.category}: {item.item}
              </span>
            </div>
          ))}
        {score.missingChecklist
          .filter((c) => c.filled)
          .slice(0, 3)
          .map((item, idx) => (
            <div key={`f-${idx}`} className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-foreground">
                {item.category}: {item.item}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
