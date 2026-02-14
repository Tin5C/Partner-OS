// ReadinessPanel — premium readiness indicator for Account Intelligence
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadinessPanelProps {
  readinessPercent: number;
  pillars: Record<string, boolean>;
}

function getStateLabel(pct: number): string {
  if (pct >= 80) return 'Deal-ready';
  if (pct >= 60) return 'Strong';
  if (pct >= 40) return 'Developing';
  if (pct >= 20) return 'Early';
  return 'Not ready';
}

const PILLAR_PRIORITY: { key: string; label: string; shortLabel: string; insight: string }[] = [
  { key: 'proof', label: 'Proof', shortLabel: 'Proof', insight: 'Missing proof artifacts.' },
  { key: 'stakeholders', label: 'Stakeholders', shortLabel: 'Stakeh.', insight: 'Stakeholder coverage is missing.' },
  { key: 'technical', label: 'Technical', shortLabel: 'Tech.', insight: 'Technical clarity is missing.' },
  { key: 'competitive', label: 'Competitive', shortLabel: 'Comp.', insight: 'Competitive positioning is missing.' },
  { key: 'context', label: 'Context', shortLabel: 'Context', insight: 'Account context is incomplete.' },
];

function getMicroInsight(pillars: Record<string, boolean>): string {
  for (const p of PILLAR_PRIORITY) {
    if (!pillars[p.key]) return p.insight;
  }
  return 'Good baseline readiness.';
}

export function ReadinessPanel({ readinessPercent, pillars }: ReadinessPanelProps) {
  const stateLabel = getStateLabel(readinessPercent);
  const insight = getMicroInsight(pillars);

  return (
    <div className="rounded-xl border border-border/60 bg-card px-4 py-3 space-y-2">
      {/* Header row: label left, metric right */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Readiness
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-primary tabular-nums leading-none">
            {readinessPercent}%
          </span>
          <span className="text-xs font-medium text-muted-foreground">{stateLabel}</span>
        </div>
      </div>

      {/* Thin progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all"
          style={{ width: `${readinessPercent}%` }}
        />
      </div>

      {/* Pillar indicators — single row, no wrap */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {PILLAR_PRIORITY.map((p) => {
            const active = !!pillars[p.key];
            return (
              <div key={p.key} className="flex items-center gap-0.5">
                {active ? (
                  <Check className="w-2.5 h-2.5 text-primary" />
                ) : (
                  <Minus className="w-2.5 h-2.5 text-muted-foreground/40" />
                )}
                <span className={cn(
                  "text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground/50"
                )}>
                  {p.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
        {/* Micro insight — hidden on small screens */}
        <p className="hidden sm:block text-[10px] text-muted-foreground truncate max-w-[200px]">{insight}</p>
      </div>
    </div>
  );
}
