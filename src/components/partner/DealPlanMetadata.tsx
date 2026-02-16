// DealPlan Metadata — compact row: engagement type, motion, readiness badge + next best adds
// Advisory only — does not modify deal plan structure

import { useMemo } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReadinessScore, type EvidencePillar } from '@/data/partner/accountMemoryStore';

// ============= Engagement Type =============

export const ENGAGEMENT_TYPES = ['New Logo', 'Existing Customer'] as const;
export type EngagementType = (typeof ENGAGEMENT_TYPES)[number];

// ============= Motion (dependent on Engagement Type) =============

export const MOTION_OPTIONS: Record<EngagementType, readonly string[]> = {
  'New Logo': [
    'Net-New Acquisition',
    'Competitive Displacement',
    'RFP / Tender',
    'Strategic Pursuit',
    'Partner-led Introduction',
  ],
  'Existing Customer': [
    'Upsell',
    'Cross-sell',
    'Renewal',
    'Expansion',
    'Transformation Program',
    'Incident / Recovery',
    'Compliance Upgrade',
  ],
};

export type Motion = string; // union of all motion values

// ============= Next Best Adds logic =============

const PILLAR_SUGGESTIONS: Record<EvidencePillar, { mode_match: string[]; suggestion: string }[]> = {
  context: [
    { mode_match: ['Net-New Acquisition', 'Strategic Pursuit'], suggestion: 'Add discovery call notes or meeting transcript' },
    { mode_match: [], suggestion: 'Add meeting notes or account context' },
  ],
  technical: [
    { mode_match: ['RFP / Tender'], suggestion: 'Add current architecture diagram or requirements' },
    { mode_match: [], suggestion: 'Add RFP, architecture docs, or technical requirements' },
  ],
  stakeholders: [
    { mode_match: [], suggestion: 'Add stakeholder map or org chart' },
  ],
  competitive: [
    { mode_match: ['Competitive Displacement'], suggestion: 'Add competitor positioning or objection notes' },
    { mode_match: [], suggestion: 'Add competitive intelligence or news articles' },
  ],
  proof: [
    { mode_match: ['Upsell', 'Cross-sell', 'Renewal'], suggestion: 'Add ROI model, case study, or pricing deck' },
    { mode_match: [], suggestion: 'Add slides, case studies, or proof materials' },
  ],
};

function getNextBestAdds(pillars: Record<EvidencePillar, boolean>, motion: Motion | null): string[] {
  const adds: string[] = [];
  for (const [pillar, covered] of Object.entries(pillars) as [EvidencePillar, boolean][]) {
    if (covered) continue;
    const suggestions = PILLAR_SUGGESTIONS[pillar] ?? [];
    const match = motion
      ? suggestions.find((s) => s.mode_match.includes(motion))
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
  engagementType: EngagementType | null;
  onEngagementTypeChange: (type: EngagementType | null) => void;
  motion: Motion | null;
  onMotionChange: (motion: Motion | null) => void;
}

export function DealPlanMetadata({
  accountId,
  hasPromotedSignals,
  engagementType,
  onEngagementTypeChange,
  motion,
  onMotionChange,
}: DealPlanMetadataProps) {
  const { score, pillars } = useMemo(
    () => getReadinessScore(accountId, hasPromotedSignals),
    [accountId, hasPromotedSignals],
  );

  const nextAdds = useMemo(
    () => getNextBestAdds(pillars, motion),
    [pillars, motion],
  );

  const motionOptions = engagementType ? MOTION_OPTIONS[engagementType] : [];

  return (
    <>
      {/* Engagement Type */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Type</span>
        <div className="relative">
          <select
            value={engagementType ?? ''}
            onChange={(e) => {
              const val = e.target.value as EngagementType | '';
              onEngagementTypeChange(val || null);
              // Reset motion when type changes since options differ
              onMotionChange(null);
            }}
            className="appearance-none text-xs font-medium text-foreground bg-muted/30 border border-border/60 rounded-lg px-2.5 py-1.5 pr-7 cursor-pointer hover:border-primary/30 transition-colors"
          >
            <option value="">Select type…</option>
            {ENGAGEMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Motion */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Motion</span>
        <div className="relative">
          <select
            value={motion ?? ''}
            onChange={(e) =>
              onMotionChange(e.target.value || null)
            }
            disabled={!engagementType}
            className={cn(
              "appearance-none text-xs font-medium text-foreground bg-muted/30 border border-border/60 rounded-lg px-2.5 py-1.5 pr-7 cursor-pointer hover:border-primary/30 transition-colors",
              !engagementType && "opacity-50 cursor-not-allowed"
            )}
          >
            <option value="">Select motion…</option>
            {motionOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Readiness — far right */}
      <span className="text-[11px] text-muted-foreground ml-auto whitespace-nowrap">
        Readiness: <span className={cn('font-medium', score >= 60 ? 'text-green-600' : 'text-muted-foreground')}>{score}%</span>
      </span>

      {/* Next Best Adds — render below the row via parent flex-wrap */}
      {nextAdds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 w-full">
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
    </>
  );
}

// ============= Legacy re-exports for backward compat =============
// These keep any downstream references compiling until business logic is updated.
export const ENGAGEMENT_MODES = ENGAGEMENT_TYPES;
export type EngagementMode = EngagementType;
export const TRIGGER_OPTIONS = ['Net-New Acquisition', 'Competitive Displacement', 'RFP / Tender', 'Upsell', 'Cross-sell', 'Renewal'] as const;
export type TriggerOption = string;
