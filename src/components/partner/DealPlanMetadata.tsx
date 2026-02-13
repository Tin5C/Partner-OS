// DealPlan Metadata — compact row: engagement mode, trigger, readiness badge + next best adds
// Advisory only — does not modify deal plan structure

import { useMemo } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReadinessScore, type EvidencePillar } from '@/data/partner/accountMemoryStore';
import type { EngagementMode as EM } from '@/components/partner/DealPlanMetadata';

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

// ============= Next Best Adds logic =============

const PILLAR_SUGGESTIONS: Record<EvidencePillar, { mode_match: string[]; suggestion: string }[]> = {
  context: [
    { mode_match: ['Discovery / Qualification'], suggestion: 'Add discovery call notes or meeting transcript' },
    { mode_match: [], suggestion: 'Add meeting notes or account context' },
  ],
  technical: [
    { mode_match: ['Architecture & Technical Validation'], suggestion: 'Add current architecture diagram or requirements' },
    { mode_match: [], suggestion: 'Add RFP, architecture docs, or technical requirements' },
  ],
  stakeholders: [
    { mode_match: [], suggestion: 'Add stakeholder map or org chart' },
  ],
  competitive: [
    { mode_match: ['Competitive Takeout / Defense'], suggestion: 'Add competitor positioning or objection notes' },
    { mode_match: [], suggestion: 'Add competitive intelligence or news articles' },
  ],
  proof: [
    { mode_match: ['Commercial / Procurement'], suggestion: 'Add ROI model, case study, or pricing deck' },
    { mode_match: [], suggestion: 'Add slides, case studies, or proof materials' },
  ],
};

function getNextBestAdds(pillars: Record<EvidencePillar, boolean>, mode: EngagementMode | null): string[] {
  const adds: string[] = [];
  for (const [pillar, covered] of Object.entries(pillars) as [EvidencePillar, boolean][]) {
    if (covered) continue;
    const suggestions = PILLAR_SUGGESTIONS[pillar] ?? [];
    const match = mode
      ? suggestions.find((s) => s.mode_match.includes(mode))
      : null;
    adds.push(match?.suggestion ?? suggestions[suggestions.length - 1]?.suggestion ?? '');
    if (adds.length >= 3) break;
  }
  return adds.filter(Boolean);
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

  return (
    <div className="space-y-2">
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

        {/* Readiness — subtle badge */}
        <span className="text-[11px] text-muted-foreground ml-auto">
          Readiness: <span className={cn('font-medium', score >= 60 ? 'text-green-600' : 'text-muted-foreground')}>{score}%</span>
        </span>
      </div>

      {/* Next Best Adds — max 3 */}
      {nextAdds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {nextAdds.map((add, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary/80 border border-primary/10"
            >
              <Lightbulb className="w-2.5 h-2.5" />
              {add}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
