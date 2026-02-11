// On-Demand Briefings Section — MVP: category pickers only (no generation)

import { useState, useEffect } from 'react';
import {
  Radio,
  Globe,
  Sword,
  Shield,
  Cpu,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import type { BriefingType } from '@/data/partner/briefingContracts';
import {
  VENDOR_OPTIONS,
  INDUSTRY_OPTIONS,
  ACCOUNT_OPTIONS,
  COMPETITIVE_ANGLE_OPTIONS,
  OBJECTION_CATEGORY_OPTIONS,
  type TaxonomyItem,
} from '@/data/partner/briefingTaxonomy';
import {
  getBriefingSelection,
  saveBriefingSelection,
  type BriefingSelection,
} from '@/data/partner/briefingSelectionStore';

// ============= Picker config per tile =============

interface PickerField {
  key: string;
  label: string;
  options: TaxonomyItem[];
  required: boolean;
}

interface BriefingCardConfig {
  type: BriefingType;
  label: string;
  description: string;
  icon: React.ReactNode;
  pickers: PickerField[];
}

const BRIEFING_CARDS: BriefingCardConfig[] = [
  {
    type: 'vendor_updates',
    label: 'Vendor Product Updates',
    description: 'Latest vendor changes relevant to your pipeline.',
    icon: <Cpu className="w-4 h-4" />,
    pickers: [
      { key: 'vendor', label: 'Vendor', options: VENDOR_OPTIONS, required: true },
    ],
  },
  {
    type: 'account_microcast',
    label: 'Account Microcast',
    description: 'Key signals and actions for a specific account.',
    icon: <Radio className="w-4 h-4" />,
    pickers: [
      { key: 'account', label: 'Account', options: ACCOUNT_OPTIONS, required: true },
    ],
  },
  {
    type: 'industry_microcast',
    label: 'Industry Microcast',
    description: 'Market trends and peer benchmarks.',
    icon: <Globe className="w-4 h-4" />,
    pickers: [
      { key: 'industry', label: 'Industry', options: INDUSTRY_OPTIONS, required: true },
    ],
  },
  {
    type: 'competitive_microcast',
    label: 'Competitive Angle',
    description: 'Positioning guidance against key competitors.',
    icon: <Sword className="w-4 h-4" />,
    pickers: [
      { key: 'angle', label: 'Competitive Angle', options: COMPETITIVE_ANGLE_OPTIONS, required: true },
      { key: 'vendor', label: 'Vendor (optional)', options: VENDOR_OPTIONS, required: false },
    ],
  },
  {
    type: 'objections_brief',
    label: 'Objection Briefing',
    description: 'Top objections with approved responses and evidence.',
    icon: <Shield className="w-4 h-4" />,
    pickers: [
      { key: 'objection', label: 'Objection Category', options: OBJECTION_CATEGORY_OPTIONS, required: true },
    ],
  },
];

// ============= Helpers =============

function lookupLabel(options: TaxonomyItem[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

function getChipsForSelection(card: BriefingCardConfig, sel: BriefingSelection | null): string[] {
  if (!sel) return [];
  return card.pickers
    .filter((p) => sel.picks[p.key])
    .map((p) => lookupLabel(p.options, sel.picks[p.key]));
}

// ============= Main Section =============

export function OnDemandBriefingsSection() {
  const [selections, setSelections] = useState<Record<string, BriefingSelection | null>>({});
  const [configCard, setConfigCard] = useState<BriefingCardConfig | null>(null);

  // Load persisted selections on mount
  useEffect(() => {
    const loaded: Record<string, BriefingSelection | null> = {};
    for (const card of BRIEFING_CARDS) {
      loaded[card.type] = getBriefingSelection(card.type);
    }
    setSelections(loaded);
  }, []);

  const handleSaved = (type: BriefingType) => {
    setSelections((prev) => ({ ...prev, [type]: getBriefingSelection(type) }));
    setConfigCard(null);
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="On-Demand Briefings"
        subtitle="Configure briefing topics — generation coming soon."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BRIEFING_CARDS.map((card) => {
          const sel = selections[card.type] ?? null;
          const chips = getChipsForSelection(card, sel);

          return (
            <div
              key={card.type}
              className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.description}</p>
                </div>
              </div>

              {/* Saved chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setConfigCard(card)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  chips.length > 0
                    ? "border border-border text-foreground hover:bg-muted/50"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Settings2 className="w-3 h-3" />
                {chips.length > 0 ? 'Reconfigure' : 'Configure'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Configure Modal */}
      {configCard && (
        <BriefingConfigModal
          card={configCard}
          existing={selections[configCard.type] ?? null}
          open={!!configCard}
          onOpenChange={(open) => { if (!open) setConfigCard(null); }}
          onSaved={() => handleSaved(configCard.type)}
        />
      )}
    </section>
  );
}

// ============= Config Modal =============

function BriefingConfigModal({
  card,
  existing,
  open,
  onOpenChange,
  onSaved,
}: {
  card: BriefingCardConfig;
  existing: BriefingSelection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [picks, setPicks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of card.pickers) {
      init[p.key] = existing?.picks[p.key] ?? '';
    }
    return init;
  });

  const requiredFilled = card.pickers
    .filter((p) => p.required)
    .every((p) => picks[p.key]);

  const handleSave = () => {
    // Strip empty optional picks
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(picks)) {
      if (v) cleaned[k] = v;
    }
    saveBriefingSelection(card.type, cleaned);
    toast.success('Selection saved');
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {card.icon}
          </div>
          {card.label}
        </DialogTitle>

        <div className="space-y-4 pt-2">
          {card.pickers.map((picker) => (
            <div key={picker.key} className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                {picker.label}
                {!picker.required && (
                  <span className="text-muted-foreground ml-1">(optional)</span>
                )}
              </label>
              <Select
                value={picks[picker.key] || undefined}
                onValueChange={(val) => setPicks((prev) => ({ ...prev, [picker.key]: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${picker.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {picker.options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button onClick={handleSave} disabled={!requiredFilled} size="sm">
            Save selection
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="sm" disabled className="gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Generate
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Generation in a later MVP step</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
