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

const PILLAR_PRIORITY: { key: string; label: string; insight: string }[] = [
  { key: 'proof', label: 'Proof', insight: 'Missing proof artifacts.' },
  { key: 'stakeholders', label: 'Stakeholders', insight: 'Stakeholder coverage is missing.' },
  { key: 'technical', label: 'Technical', insight: 'Technical clarity is missing.' },
  { key: 'competitive', label: 'Competitive', insight: 'Competitive positioning is missing.' },
  { key: 'context', label: 'Context', insight: 'Account context is incomplete.' },
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
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Readiness
      </p>

      {/* Centered metric */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-3xl font-bold text-primary tabular-nums leading-none">
          {readinessPercent}%
        </span>
        <span className="text-xs font-medium text-muted-foreground">{stateLabel}</span>
      </div>

      {/* Thin progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all"
          style={{ width: `${readinessPercent}%` }}
        />
      </div>

      {/* Pillar indicators */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {PILLAR_PRIORITY.map((p) => {
          const active = !!pillars[p.key];
          return (
            <div key={p.key} className="flex items-center gap-1">
              {active ? (
                <Check className="w-3 h-3 text-primary" />
              ) : (
                <Minus className="w-3 h-3 text-muted-foreground/40" />
              )}
              <span className={cn(
                "text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground/50"
              )}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Micro insight */}
      <p className="text-[11px] text-muted-foreground text-center">{insight}</p>
    </div>
  );
}
