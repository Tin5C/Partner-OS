// On-Demand Briefings Section — MVP: inline dropdowns per card, no modals

import { useState, useEffect } from 'react';
import {
  Radio,
  Globe,
  Sword,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { BriefingType } from '@/data/partner/briefingContracts';
import type { TaxonomyItem } from '@/data/partner/briefingTaxonomy';
import {
  getBriefingSelection,
  saveBriefingSelection,
} from '@/data/partner/briefingSelectionStore';

// ============= Inline picker config =============

interface PickerField {
  key: string;
  label: string;
  options: TaxonomyItem[];
}

interface CardConfig {
  type: BriefingType;
  label: string;
  description: string;
  icon: React.ReactNode;
  pickers: PickerField[];
}

const VENDORS: TaxonomyItem[] = [
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'google', label: 'Google' },
  { id: 'databricks', label: 'Databricks' },
];

const INDUSTRIES: TaxonomyItem[] = [
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'banking', label: 'Banking' },
  { id: 'entertainment', label: 'Entertainment & Sports' },
];

const ACCOUNTS: TaxonomyItem[] = [
  { id: 'schindler', label: 'Schindler' },
  { id: 'ubs', label: 'UBS' },
  { id: 'fifa', label: 'FIFA' },
  { id: 'pflanzer', label: 'Pflanzer' },
];

const COMPETITORS: TaxonomyItem[] = [
  { id: 'google-cloud', label: 'Google Cloud' },
  { id: 'aws', label: 'AWS' },
  { id: 'sap', label: 'SAP' },
  { id: 'servicenow', label: 'ServiceNow' },
];

const CARDS: CardConfig[] = [
  {
    type: 'vendor_updates',
    label: 'Vendor Product Updates',
    description: 'Latest vendor changes relevant to your pipeline.',
    icon: <Cpu className="w-4 h-4" />,
    pickers: [{ key: 'vendor', label: 'Vendor', options: VENDORS }],
  },
  {
    type: 'industry_microcast',
    label: 'Industry Microcast',
    description: 'Market trends and peer benchmarks.',
    icon: <Globe className="w-4 h-4" />,
    pickers: [{ key: 'industry', label: 'Industry', options: INDUSTRIES }],
  },
  {
    type: 'account_microcast',
    label: 'Account Microcast',
    description: 'Key signals and actions for a specific account.',
    icon: <Radio className="w-4 h-4" />,
    pickers: [{ key: 'account', label: 'Account', options: ACCOUNTS }],
  },
  {
    type: 'competitive_microcast',
    label: 'Competitive Angle',
    description: 'Positioning guidance against key competitors.',
    icon: <Sword className="w-4 h-4" />,
    pickers: [{ key: 'competitor', label: 'Competitor', options: COMPETITORS }],
  },
];

// ============= Main Section =============

export function OnDemandBriefingsSection() {
  // Local state mirrors persisted selections for reactivity
  const [picks, setPicks] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const loaded: Record<string, Record<string, string>> = {};
    for (const card of CARDS) {
      const sel = getBriefingSelection(card.type);
      if (sel) loaded[card.type] = sel.picks;
    }
    setPicks(loaded);
  }, []);

  const handlePick = (type: BriefingType, key: string, value: string) => {
    setPicks((prev) => {
      const updated = { ...prev, [type]: { ...(prev[type] ?? {}), [key]: value } };
      // Persist
      saveBriefingSelection(type, updated[type]);
      return updated;
    });
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="On-Demand Briefings"
        subtitle="Select a topic then generate — audio briefings coming soon."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CARDS.map((card) => {
          const cardPicks = picks[card.type] ?? {};
          const allFilled = card.pickers.every((p) => cardPicks[p.key]);

          return (
            <div
              key={card.type}
              className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Title row */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{card.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{card.description}</p>
                </div>
              </div>

              {/* Inline pickers */}
              {card.pickers.map((picker) => (
                <div key={picker.key} className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">{picker.label}</label>
                  <Select
                    value={cardPicks[picker.key] || undefined}
                    onValueChange={(val) => handlePick(card.type, picker.key, val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={`Select ${picker.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {picker.options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Generate button — disabled for MVP */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block">
                      <Button
                        size="sm"
                        disabled
                        className="w-full gap-1.5 text-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Generation in a later MVP step</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </section>
  );
}
