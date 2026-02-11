// On-Demand Briefings Section — MVP: inline dropdowns per card
// Account Microcast for Schindler: simulated 15s creation + autoplay

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Radio,
  Globe,
  Sword,
  Cpu,
  Sparkles,
  Loader2,
} from 'lucide-react';
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
import { BriefingModePill } from './BriefingModePill';
import type { BriefingType } from '@/data/partner/briefingContracts';
import type { TaxonomyItem } from '@/data/partner/briefingTaxonomy';
import {
  getBriefingSelection,
  saveBriefingSelection,
} from '@/data/partner/briefingSelectionStore';
import { AccountMicrocastPlayer } from './AccountMicrocastPlayer';

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

const SCHINDLER_MP3 = 'https://daq7nasbr6dck.cloudfront.net/misc/temp/temp1.mp3';

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

type CreatingState = 'idle' | 'creating' | 'ready';

export function OnDemandBriefingsSection() {
  const [picks, setPicks] = useState<Record<string, Record<string, string>>>({});
  const [accountState, setAccountState] = useState<CreatingState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loaded: Record<string, Record<string, string>> = {};
    for (const card of CARDS) {
      const sel = getBriefingSelection(card.type);
      if (sel) loaded[card.type] = sel.picks;
    }
    setPicks(loaded);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePick = (type: BriefingType, key: string, value: string) => {
    // If account microcast selection changes while ready, reset to idle
    if (type === 'account_microcast') {
      cancelCreation();
    }
    setPicks((prev) => {
      const updated = { ...prev, [type]: { ...(prev[type] ?? {}), [key]: value } };
      saveBriefingSelection(type, updated[type]);
      return updated;
    });
  };

  const cancelCreation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAccountState('idle');
  }, []);

  const handleGenerate = (card: CardConfig, cardPicks: Record<string, string>) => {
    if (card.type !== 'account_microcast') {
      toast.info('Audio coming soon.');
      return;
    }

    const selectedAccount = cardPicks['account'];
    if (!selectedAccount) {
      toast.info('Please select an account first.');
      return;
    }

    if (selectedAccount !== 'schindler') {
      toast.info('Audio coming soon.');
      return;
    }

    // Schindler: start 15s simulated creation
    // Clear any existing timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setAccountState('creating');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setAccountState('ready');
    }, 15000);
  };

  const handleClosePlayer = () => {
    setAccountState('idle');
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <SectionHeader
          title="On-Demand Briefings"
          subtitle="Select a topic then generate — audio briefings coming soon."
        />
        <BriefingModePill mode="on-demand" className="mt-0.5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CARDS.map((card) => {
          const cardPicks = picks[card.type] ?? {};
          const isAccountCard = card.type === 'account_microcast';
          const isCreating = isAccountCard && accountState === 'creating';
          const isReady = isAccountCard && accountState === 'ready';

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
                    disabled={isCreating}
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

              {/* Creating state */}
              {isCreating && (
                <div className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-xs text-primary font-medium">Creating microcast…</span>
                  </div>
                  <button
                    onClick={cancelCreation}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Ready state: show player */}
              {isReady && (
                <AccountMicrocastPlayer
                  src={SCHINDLER_MP3}
                  accountLabel="Schindler"
                  onClose={handleClosePlayer}
                />
              )}

              {/* Generate button */}
              {!isCreating && !isReady && (
                <GenerateButton
                  card={card}
                  cardPicks={cardPicks}
                  onGenerate={handleGenerate}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============= Sub-components =============

function GenerateButton({
  card,
  cardPicks,
  onGenerate,
}: {
  card: CardConfig;
  cardPicks: Record<string, string>;
  onGenerate: (card: CardConfig, picks: Record<string, string>) => void;
}) {
  const isAccountCard = card.type === 'account_microcast';
  const allFilled = card.pickers.every((p) => cardPicks[p.key]);
  const isDisabled = !isAccountCard || !allFilled;

  if (!isAccountCard) {
    // Non-account cards: keep disabled with tooltip
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block">
              <Button size="sm" disabled className="w-full gap-1.5 text-xs">
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
    );
  }

  return (
    <Button
      size="sm"
      disabled={!allFilled}
      className="w-full gap-1.5 text-xs"
      onClick={() => onGenerate(card, cardPicks)}
    >
      <Sparkles className="w-3 h-3" />
      Generate
    </Button>
  );
}
