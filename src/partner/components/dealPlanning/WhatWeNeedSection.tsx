// "What we need" — evidence checklist grouped by gate
// Partner-only, in-memory

import { useState } from 'react';
import { ClipboardCheck, Check, X, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem, NeedStatus } from '@/partner/data/dealPlanning/planHydrationStore';
import { updateChecklistStatus } from '@/partner/data/dealPlanning/planHydrationStore';

const GATE_LABELS: Record<string, string> = {
  security_compliance: 'Security & Compliance',
  technical_readiness: 'Technical Readiness',
  business_value: 'Business Value',
  procurement_commercial: 'Procurement & Commercial',
};

const GATE_ORDER = ['security_compliance', 'technical_readiness', 'business_value', 'procurement_commercial'];

const STATUS_STYLES: Record<NeedStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  missing: { label: 'Missing', icon: <AlertCircle className="w-3 h-3" />, cls: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  have: { label: 'Have', icon: <Check className="w-3 h-3" />, cls: 'text-green-600 bg-green-500/10 border-green-500/20' },
  blocked: { label: 'Blocked', icon: <X className="w-3 h-3" />, cls: 'text-red-600 bg-red-500/10 border-red-500/20' },
};

const STATUSES: NeedStatus[] = ['missing', 'have', 'blocked'];

interface Props {
  items: ChecklistItem[];
  focusId: string;
  onRefresh: () => void;
}

export function WhatWeNeedSection({ items, focusId, onRefresh }: Props) {
  const [expandedGates, setExpandedGates] = useState<Set<string>>(new Set(GATE_ORDER));

  const grouped = GATE_ORDER.map((gate) => ({
    gate,
    label: GATE_LABELS[gate],
    items: items.filter((i) => i.gate === gate),
  })).filter((g) => g.items.length > 0);

  const toggleGate = (gate: string) => {
    setExpandedGates((prev) => {
      const next = new Set(prev);
      if (next.has(gate)) next.delete(gate); else next.add(gate);
      return next;
    });
  };

  const cycleStatus = (itemId: string, current: NeedStatus) => {
    const idx = STATUSES.indexOf(current);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    updateChecklistStatus(focusId, itemId, next);
    onRefresh();
  };

  const total = items.length;
  const have = items.filter((i) => i.status === 'have').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          {have} of {total} items ready
        </p>
        <div className="flex items-center gap-3 text-[10px]">
          {STATUSES.map((s) => {
            const style = STATUS_STYLES[s];
            const count = items.filter((i) => i.status === s).length;
            return (
              <span key={s} className="flex items-center gap-1 text-muted-foreground">
                <span className={cn('w-2 h-2 rounded-full', s === 'missing' ? 'bg-amber-500' : s === 'have' ? 'bg-green-500' : 'bg-red-500')} />
                {style.label}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {grouped.map(({ gate, label, items: gateItems }) => {
        const isOpen = expandedGates.has(gate);
        return (
          <div key={gate} className="rounded-lg border border-border/40 bg-card overflow-hidden">
            <button
              onClick={() => toggleGate(gate)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
            >
              {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex-1">{label}</p>
              <span className="text-[10px] text-muted-foreground">
                {gateItems.filter((i) => i.status === 'have').length}/{gateItems.length}
              </span>
            </button>
            {isOpen && (
              <div className="px-3 pb-3 space-y-1.5">
                {gateItems.map((item) => {
                  const style = STATUS_STYLES[item.status];
                  return (
                    <div key={item.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/10 border border-border/30">
                      <button
                        onClick={() => cycleStatus(item.id, item.status)}
                        className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-medium flex-shrink-0 mt-0.5 transition-colors', style.cls)}
                        title="Click to cycle status"
                      >
                        {style.icon}
                        {style.label}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground leading-snug">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.whyNeeded}</p>
                        <span className="text-[9px] text-muted-foreground/60 mt-0.5 inline-block">Owner: {item.owner}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
