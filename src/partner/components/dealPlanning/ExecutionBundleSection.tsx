// Execution Bundle — assets to run the selected play
// Partner-only, in-memory

import { useState } from 'react';
import { FileText, Presentation, Calculator, GraduationCap, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ExecutionAsset } from '@/partner/data/dealPlanning/planHydrationStore';

const GROUP_META: Record<string, { label: string; icon: React.ReactNode }> = {
  positioning: { label: 'Positioning', icon: <Presentation className="w-3 h-3" /> },
  delivery: { label: 'Delivery assets', icon: <FileText className="w-3 h-3" /> },
  commercial: { label: 'Commercial assets', icon: <Calculator className="w-3 h-3" /> },
  enablement: { label: 'Enablement', icon: <GraduationCap className="w-3 h-3" /> },
};

const GROUP_ORDER = ['positioning', 'delivery', 'commercial', 'enablement'];

interface Props {
  assets: ExecutionAsset[];
}

export function ExecutionBundleSection({ assets }: Props) {
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    ...GROUP_META[g],
    items: assets.filter((a) => a.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-3">
      {grouped.map(({ group, label, icon, items }) => (
        <div key={group}>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            {icon} {label}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((asset) => (
              <button
                key={asset.id}
                onClick={() => toast.info(`${asset.title} — template coming soon`)}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-left group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                    {asset.title}
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{asset.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
