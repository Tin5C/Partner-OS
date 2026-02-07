// Tool Fit Panel — Shown in Tools & Agents tab for admin
// Evaluates tool fit against Partner Profile

import {
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getPartnerProfile,
  evaluateToolFit,
  CAPABILITY_LEVEL_LABELS,
  CapabilityLevel,
} from '@/data/partnerProfile';

interface ToolFitPanelProps {
  mappedPackageIds: string[];
}

const EFFORT_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300' },
  high: { label: 'High', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  watch: { label: 'Watch', color: 'text-muted-foreground bg-muted' },
  pilot: { label: 'Pilot', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300' },
  approved: { label: 'Approved', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
};

const CAP_LEVEL_COLORS: Record<CapabilityLevel, string> = {
  0: 'text-muted-foreground',
  1: 'text-amber-600 dark:text-amber-400',
  2: 'text-primary',
  3: 'text-green-600 dark:text-green-400',
};

export function ToolFitPanel({ mappedPackageIds }: ToolFitPanelProps) {
  const profile = getPartnerProfile();
  const fit = evaluateToolFit(mappedPackageIds, profile);

  if (fit.requiredCapabilities.length === 0) return null;

  const effortCfg = EFFORT_CONFIG[fit.enablementEffort];
  const statusCfg = STATUS_CONFIG[fit.suggestedStatus];

  return (
    <div className="mt-3 p-3 rounded-lg bg-muted/20 border border-border/60">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <BarChart3 className="w-3 h-3" />
        Fit with Partner Profile
      </p>

      {/* Capabilities */}
      <div className="space-y-1.5 mb-3">
        {fit.requiredCapabilities.map(cap => {
          const gap = cap.partnerLevel < cap.level;
          return (
            <div key={cap.label} className="flex items-center justify-between">
              <span className="text-[11px] text-foreground">{cap.label}</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-medium", CAP_LEVEL_COLORS[cap.partnerLevel])}>
                  {CAPABILITY_LEVEL_LABELS[cap.partnerLevel]}
                </span>
                {gap ? (
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Effort + Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">Enablement:</span>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", effortCfg.color)}>
            {effortCfg.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">Suggested:</span>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", statusCfg.color)}>
            {statusCfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
