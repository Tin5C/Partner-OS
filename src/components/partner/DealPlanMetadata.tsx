// DealPlan Metadata — compact row: engagement mode, trigger, readiness badge
// Advisory only — does not modify deal plan structure

import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReadinessScore } from '@/data/partner/accountMemoryStore';

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
  const { score } = useMemo(
    () => getReadinessScore(accountId, hasPromotedSignals),
    [accountId, hasPromotedSignals],
  );

  return (
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
  );
}
