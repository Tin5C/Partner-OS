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

type CreatingState = 'idle' | 'creating' | 'ready' | 'error';

interface CompetitiveState {
  status: CreatingState;
  audioUrl: string | null;
}

export function OnDemandBriefingsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [picks, setPicks] = useState<Record<string, Record<string, string>>>({});
  const [accountState, setAccountState] = useState<CreatingState>('idle');
  const [compState, setCompState] = useState<CompetitiveState>({ status: 'idle', audioUrl: null });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loaded: Record<string, Record<string, string>> = {};
    for (const card of CARDS) {
      const sel = getBriefingSelection(card.type);
      if (sel) loaded[card.type] = sel.picks;
    }
    setPicks(loaded);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (compTimerRef.current) clearTimeout(compTimerRef.current);
      compAbortRef.current?.abort();
    };
  }, []);

  const handlePick = (type: BriefingType, key: string, value: string) => {
    if (type === 'account_microcast') cancelCreation();
    if (type === 'competitive_microcast') cancelCompetitive();
    setPicks((prev) => {
      const updated = { ...prev, [type]: { ...(prev[type] ?? {}), [key]: value } };
      saveBriefingSelection(type, updated[type]);
      return updated;
    });
  };

  // === Account Microcast (Schindler) ===
  const cancelCreation = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setAccountState('idle');
  }, []);

  const handleGenerate = (card: CardConfig, cardPicks: Record<string, string>) => {
    if (card.type === 'competitive_microcast') {
      return handleGenerateCompetitive(cardPicks);
    }
    if (card.type !== 'account_microcast') {
      toast.info('Audio coming soon.');
      return;
    }
    const selectedAccount = cardPicks['account'];
    if (!selectedAccount) { toast.info('Please select an account first.'); return; }
    if (selectedAccount !== 'schindler') { toast.info('Audio coming soon.'); return; }

    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setAccountState('creating');
    timerRef.current = setTimeout(() => { timerRef.current = null; setAccountState('ready'); }, 15000);
  };

  const handleClosePlayer = () => setAccountState('idle');

  // === Competitive Angle (Google) ===
  const cancelCompetitive = useCallback(() => {
    if (compTimerRef.current) { clearTimeout(compTimerRef.current); compTimerRef.current = null; }
    compAbortRef.current?.abort();
    compAbortRef.current = null;
    setCompState({ status: 'idle', audioUrl: null });
  }, []);

  const handleGenerateCompetitive = (cardPicks: Record<string, string>) => {
    const selected = cardPicks['competitor'];
    if (!selected) { toast.info('Please select a competitor first.'); return; }
    if (selected !== 'google-cloud') { toast.info('Audio coming soon.'); return; }

    // Clear existing
    if (compTimerRef.current) { clearTimeout(compTimerRef.current); compTimerRef.current = null; }
    compAbortRef.current?.abort();

    setCompState({ status: 'creating', audioUrl: null });

    const controller = new AbortController();
    compAbortRef.current = controller;

    // 15s simulated thinking, then POST
    compTimerRef.current = setTimeout(async () => {
      compTimerRef.current = null;
      if (controller.signal.aborted) return;
      try {
        const res = await fetch('http://35.245.247.106:3000/generate_audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        if (controller.signal.aborted) return;
        if (data?.audio_url) {
          setCompState({ status: 'ready', audioUrl: data.audio_url });
        } else {
          throw new Error('No audio_url');
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setCompState({ status: 'error', audioUrl: null });
      }
    }, 15000);
  };

  const handleCloseCompPlayer = () => setCompState({ status: 'idle', audioUrl: null });

  return (
    <section className="space-y-4">
      {!hideHeader && (
        <div className="flex items-center gap-2">
          <SectionHeader
            title="On-Demand Briefings"
            subtitle="Select a topic then generate — audio briefings coming soon."
          />
          <BriefingModePill mode="on-demand" className="mt-0.5" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CARDS.map((card) => {
          const cardPicks = picks[card.type] ?? {};
          const isAccountCard = card.type === 'account_microcast';
          const isCompCard = card.type === 'competitive_microcast';
          const isCreating = isAccountCard && accountState === 'creating';
          const isReady = isAccountCard && accountState === 'ready';
          const isCompCreating = isCompCard && compState.status === 'creating';
          const isCompReady = isCompCard && compState.status === 'ready';
          const isCompError = isCompCard && compState.status === 'error';

          const disablePickers = isCreating || isCompCreating;

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
                    disabled={isAccountCard ? isCreating : isCompCard ? isCompCreating : false}
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

              {/* Account creating state */}
              {isCreating && (
                <div className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-xs text-primary font-medium">Creating microcast…</span>
                  </div>
                  <button onClick={cancelCreation} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                </div>
              )}

              {/* Account ready state */}
              {isReady && (
                <AccountMicrocastPlayer src={SCHINDLER_MP3} accountLabel="Schindler" onClose={handleClosePlayer} />
              )}

              {/* Competitive creating state */}
              {isCompCreating && (
                <div className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-xs text-primary font-medium">Analyzing Google positioning vs Microsoft…</span>
                  </div>
                  <button onClick={cancelCompetitive} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                </div>
              )}

              {/* Competitive ready state */}
              {isCompReady && compState.audioUrl && (
                <AccountMicrocastPlayer src={compState.audioUrl} accountLabel="Google Cloud" onClose={handleCloseCompPlayer} />
              )}

              {/* Competitive error state */}
              {isCompError && (
                <div className="py-1.5 px-2 rounded-lg bg-destructive/5 border border-destructive/10">
                  <p className="text-xs text-destructive">Competitive briefing unavailable. Please try again.</p>
                </div>
              )}

              {/* Generate button */}
              {!isCreating && !isReady && !isCompCreating && !isCompReady && (
                <GenerateButton card={card} cardPicks={cardPicks} onGenerate={handleGenerate} />
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
  const isCompCard = card.type === 'competitive_microcast';
  const allFilled = card.pickers.every((p) => cardPicks[p.key]);
  const isGeneratable = isAccountCard || isCompCard;

  if (!isGeneratable) {
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
