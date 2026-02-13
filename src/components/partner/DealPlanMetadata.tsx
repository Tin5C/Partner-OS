// DealPlan Metadata — engagement mode, trigger, readiness meter, next best adds
// Advisory only — does not modify deal plan structure

import { useMemo } from 'react';
import {
  Gauge,
  Lightbulb,
  ChevronDown,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getReadinessScore,
  type EvidencePillar,
} from '@/data/partner/accountMemoryStore';

// ============= Engagement Mode =============

export const ENGAGEMENT_MODES = [
  'Discovery / Qualification',
  'Architecture & Technical Validation',
  'Security / Governance Review',
  'Commercial / Procurement',
  'Delivery / Adoption',
  'Competitive Takeout / Defense',
] as const;

export type EngagementMode = (typeof ENGAGEMENT_MODES)[number];

// ============= Trigger =============

export const TRIGGER_OPTIONS = [
  'Customer request',
  'RFP / Tender',
  'Competitive pressure',
  'Vendor push',
  'Renewal / Expansion',
  'Incident / Risk',
  'Internal growth target',
] as const;

export type TriggerOption = (typeof TRIGGER_OPTIONS)[number];

// ============= Pillar labels =============

const PILLAR_LABELS: Record<EvidencePillar, string> = {
  context: 'Context',
  technical: 'Technical Reality',
  stakeholders: 'Stakeholders',
  competitive: 'Competitive',
  proof: 'Proof / Materials',
};

// ============= Next Best Adds Logic =============

interface NextAdd {
  text: string;
  pillar: EvidencePillar;
}

function getNextBestAdds(
  pillars: Record<EvidencePillar, boolean>,
  mode: EngagementMode | null,
): NextAdd[] {
  const adds: NextAdd[] = [];

  // Mode-specific suggestions first
  if (mode) {
    if (
      (mode === 'Architecture & Technical Validation' || mode === 'Security / Governance Review') &&
      !pillars.technical
    ) {
      adds.push({
        text: 'Add current architecture diagram or requirements',
        pillar: 'technical',
      });
    }
    if (
      (mode === 'Competitive Takeout / Defense') &&
      !pillars.competitive
    ) {
      adds.push({
        text: 'Add competitor positioning or objection notes',
        pillar: 'competitive',
      });
    }
    if (
      (mode === 'Commercial / Procurement') &&
      !pillars.proof
    ) {
      adds.push({
        text: 'Upload pricing deck, ROI model, or reference slides',
        pillar: 'proof',
      });
    }
    if (
      mode === 'Discovery / Qualification' &&
      !pillars.context
    ) {
      adds.push({
        text: 'Paste discovery call notes or meeting transcript',
        pillar: 'context',
      });
    }
  }

  // Generic missing-pillar suggestions
  if (!pillars.context && !adds.some((a) => a.pillar === 'context')) {
    adds.push({ text: 'Add meeting notes or call transcript', pillar: 'context' });
  }
  if (!pillars.technical && !adds.some((a) => a.pillar === 'technical')) {
    adds.push({ text: 'Upload RFP, requirements doc, or architecture diagram', pillar: 'technical' });
  }
  if (!pillars.competitive && !adds.some((a) => a.pillar === 'competitive')) {
    adds.push({ text: 'Add competitive intelligence or objection notes', pillar: 'competitive' });
  }
  if (!pillars.proof && !adds.some((a) => a.pillar === 'proof')) {
    adds.push({ text: 'Upload slides, case studies, or proof materials', pillar: 'proof' });
  }

  return adds.slice(0, 3);
}

// ============= Metadata Strip =============

interface DealPlanMetadataProps {
  accountId: string;
  hasPromotedSignals: boolean;
  engagementMode: EngagementMode | null;
  onEngagementModeChange: (mode: EngagementMode | null) => void;
  trigger: TriggerOption | null;
  onTriggerChange: (trigger: TriggerOption | null) => void;
}

export function DealPlanMetadata({
  accountId,
  hasPromotedSignals,
  engagementMode,
  onEngagementModeChange,
  trigger,
  onTriggerChange,
}: DealPlanMetadataProps) {
  const { score, pillars } = useMemo(
    () => getReadinessScore(accountId, hasPromotedSignals),
    [accountId, hasPromotedSignals],
  );

  const nextAdds = useMemo(
    () => getNextBestAdds(pillars, engagementMode),
    [pillars, engagementMode],
  );

  const scoreColor =
    score >= 80
      ? 'text-green-600'
      : score >= 40
        ? 'text-primary'
        : 'text-muted-foreground';

  return (
    <div className="space-y-3">
      {/* Top row: dropdowns + readiness */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Engagement Mode */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Mode</span>
          <div className="relative">
            <select
              value={engagementMode ?? ''}
              onChange={(e) =>
                onEngagementModeChange(
                  e.target.value ? (e.target.value as EngagementMode) : null,
                )
              }
              className="appearance-none text-xs font-medium text-foreground bg-muted/30 border border-border/60 rounded-lg px-2.5 py-1.5 pr-7 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="">Select mode…</option>
              {ENGAGEMENT_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Trigger */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Trigger</span>
          <div className="relative">
            <select
              value={trigger ?? ''}
              onChange={(e) =>
                onTriggerChange(
                  e.target.value ? (e.target.value as TriggerOption) : null,
                )
              }
              className="appearance-none text-xs font-medium text-foreground bg-muted/30 border border-border/60 rounded-lg px-2.5 py-1.5 pr-7 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="">Select trigger…</option>
              {TRIGGER_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Readiness */}
        <div className="flex items-center gap-2 ml-auto">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Readiness</span>
          <span className={cn('text-sm font-bold', scoreColor)}>{score}%</span>
        </div>
      </div>

      {/* Pillar indicators */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(PILLAR_LABELS) as [EvidencePillar, string][]).map(([key, label]) => (
          <div
            key={key}
            className={cn(
              'flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border',
              pillars[key]
                ? 'border-green-500/20 bg-green-500/5 text-green-600'
                : 'border-border/40 bg-muted/10 text-muted-foreground/60'
            )}
          >
            {pillars[key]
              ? <CheckCircle2 className="w-3 h-3" />
              : <Circle className="w-3 h-3" />}
            {label}
          </div>
        ))}
      </div>

      {/* Next best adds */}
      {nextAdds.length > 0 && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/[0.03] border border-primary/10">
          <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">Suggested next adds</p>
            {nextAdds.map((add, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                → {add.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
