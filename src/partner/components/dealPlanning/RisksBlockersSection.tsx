// Enhanced Risks & Blockers section with severity and mitigation
// Partner-only, in-memory

import { AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RiskItem, RiskStatus } from '@/partner/data/dealPlanning/planHydrationStore';
import { updateRiskStatus } from '@/partner/data/dealPlanning/planHydrationStore';

const SEV_STYLE: Record<string, string> = {
  high: 'text-red-600 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  low: 'text-muted-foreground bg-muted/40 border-border/40',
};

interface Props {
  risks: RiskItem[];
  focusId: string;
  onRefresh: () => void;
}

export function RisksBlockersSection({ risks, focusId, onRefresh }: Props) {
  const toggleStatus = (idx: number, current: RiskStatus) => {
    updateRiskStatus(focusId, idx, current === 'open' ? 'mitigated' : 'open');
    onRefresh();
  };

  return (
    <div className="space-y-2">
      {risks.map((risk, idx) => (
        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/40 bg-card">
          <button
            onClick={() => toggleStatus(idx, risk.status)}
            className={cn(
              'flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-medium flex-shrink-0 mt-0.5 transition-colors',
              risk.status === 'mitigated'
                ? 'text-green-600 bg-green-500/10 border-green-500/20'
                : SEV_STYLE[risk.severity]
            )}
            title="Click to toggle mitigated"
          >
            {risk.status === 'mitigated' ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            {risk.status === 'mitigated' ? 'Mitigated' : risk.severity}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-foreground leading-snug">{risk.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{risk.mitigation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
