// Quick Brief Section (Partner-only)
// One-click, account-driven brief — instant signal feed
// Supports Curated (default) and On-Demand modes

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Zap,
  Sparkles,
  Building2,
  Target,
  Shield,
  TrendingUp,
  MessageSquare,
  Info,
  ArrowRightLeft,
  ArrowUpRight,
  Search,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickBriefOutput } from './QuickBriefOutput';
import type { QuickBriefNeed } from './QuickBriefOutput';
import { listSignals } from '@/data/partner/signalStore';
import { enrichSignals } from '@/data/partner/signalEnrichment';
import { listWeeklySignals } from '@/data/partner/weeklySignalStore';
import { createGeneratedDraft } from '@/data/partner/generatedDraftStore';
import { BriefingModePill } from './BriefingModePill';
import { toast } from 'sonner';
import { consumeQuickBriefTrigger, QUICK_BRIEF_TRIGGER_EVENT } from '@/data/partner/quickBriefTrigger';
import { resolveCanonicalMeta } from '@/services/ids';
import { toIsoWeekKey } from '@/lib/partnerIds';
import {
  addItem,
  makeInboxItemId,
  deriveImpactArea,
} from '@/data/partner/dealPlanningInboxStore';

const ACCOUNTS = [
  { id: 'schindler', label: 'Schindler' },
  { id: 'sulzer', label: 'Sulzer' },
  { id: 'ubs', label: 'UBS' },
];

const WEEK_OF = '2026-02-10';
const TIME_KEY = '2026-W07';
const BATCH_SIZE = 5;

type BriefMode = 'curated' | 'on-demand';

// Signal type → readable tag
const TYPE_TAGS: Record<string, string> = {
  vendor: 'Vendor',
  regulatory: 'Regulatory',
  internalActivity: 'Internal',
  competitive: 'Competitive',
  localMarket: 'Market',
};

const TYPE_COLORS: Record<string, string> = {
  vendor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  regulatory: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  internalActivity: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  competitive: 'bg-red-500/10 text-red-600 border-red-500/20',
  localMarket: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

// Signal type → origin label for MECE clarity
const ORIGIN_LABELS: Record<string, string> = {
  vendor: 'Vendor',
  regulatory: 'Regulatory',
  internalActivity: 'Focus',
  competitive: 'Competitor',
  localMarket: 'Industry',
};

interface QuickBriefSectionProps {
  onOpenDealBrief?: () => void;
}

export function QuickBriefSection({ onOpenDealBrief }: QuickBriefSectionProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [briefMode, setBriefMode] = useState<BriefMode>('curated');
  const [triggeredFrom, setTriggeredFrom] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // On-Demand state
  const [onDemandQuery, setOnDemandQuery] = useState('');
  const [onDemandOutput, setOnDemandOutput] = useState<string | null>(null);
  const [onDemandDraftId, setOnDemandDraftId] = useState<string | null>(null);

  // Listen for trigger events from Story modals
  const handleTrigger = useRef(() => {
    const ctx = consumeQuickBriefTrigger();
    if (ctx) {
      if (import.meta.env.DEV) {
        const focusId = 'schindler';
        const meta = ctx.canonicalMeta ?? resolveCanonicalMeta({ focusId, weekOf: WEEK_OF });
        console.log('[Quick Brief launch]', {
          focusId: meta.focusId,
          weekOf: WEEK_OF,
          weekKey: meta.weekKey,
          vendorId: meta.vendorId,
        });
      }

      // Auto-populate account from customer name
      if (ctx.customer) {
        const match = ACCOUNTS.find(
          (a) => a.label.toLowerCase() === ctx.customer!.toLowerCase()
        );
        if (match) setSelectedAccount(match.id);
      }
      setTriggeredFrom(ctx.storyTitle);
      setBriefMode('curated');
      // Auto-run
      setIsGenerating(true);
      setShowOutput(false);
      setVisibleCount(BATCH_SIZE);
      setTimeout(() => {
        setShowOutput(true);
        setIsGenerating(false);
      }, 600);
    }
  });

  useEffect(() => {
    const handler = () => handleTrigger.current();
    window.addEventListener(QUICK_BRIEF_TRIGGER_EVENT, handler);
    return () => window.removeEventListener(QUICK_BRIEF_TRIGGER_EVENT, handler);
  }, []);

  // Signal data for selected account
  const focusId = selectedAccount ?? 'schindler';
  const canonicalWeekKey = useMemo(() => toIsoWeekKey({ weekOf: WEEK_OF }), []);
  const rawSignals = useMemo(() => listSignals(focusId, WEEK_OF), [focusId]);
  const signals = useMemo(() => enrichSignals(rawSignals, focusId), [rawSignals, focusId]);

  const canGenerate = selectedAccount !== null;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setShowOutput(false);
    setVisibleCount(BATCH_SIZE);
    setTimeout(() => {
      setShowOutput(true);
      setIsGenerating(false);
    }, 500);
  };

  const handleReset = () => {
    setSelectedAccount(null);
    setShowOutput(false);
    setOnDemandOutput(null);
    setOnDemandDraftId(null);
    setOnDemandQuery('');
    setBriefMode('curated');
    setTriggeredFrom(null);
    setVisibleCount(BATCH_SIZE);
  };

  const handlePromoteToDealBrief = () => {
    onOpenDealBrief?.();
  };

  const handleSwitchMode = () => {
    setBriefMode((prev) => (prev === 'curated' ? 'on-demand' : 'curated'));
    setShowOutput(false);
    setOnDemandOutput(null);
    setOnDemandDraftId(null);
  };

  const handleOnDemandGenerate = () => {
    if (!onDemandQuery.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const output = generateOnDemandStub(onDemandQuery.trim(), selectedAccount ? ACCOUNTS.find(a => a.id === selectedAccount)?.label ?? '' : '');
      const draft = createGeneratedDraft({
        focusId,
        prompt: onDemandQuery.trim(),
        output,
      });
      setOnDemandOutput(output);
      setOnDemandDraftId(draft.id);
      setIsGenerating(false);
    }, 800);
  };

  const handleSaveAsStory = () => {
    toast.success('Saved as Story (linked to account)');
  };

  const handleSaveToDealPlanning = () => {
    onOpenDealBrief?.();
    toast.success('Added to Deal Planning');
  };

  // Visible signals (paginated)
  const visibleSignals = signals.slice(0, visibleCount);
  const hasMore = signals.length > visibleCount;

  const customerName = selectedAccount
    ? ACCOUNTS.find((a) => a.id === selectedAccount)?.label ?? selectedAccount
    : '';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Brief
          </h2>
          <p className="text-sm text-muted-foreground">
            Instant signal refresh — select an account and go.
          </p>
        </div>
        <button
          onClick={handleSwitchMode}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            briefMode === 'on-demand'
              ? 'bg-accent/10 text-accent-foreground border-accent/30'
              : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
          )}
        >
          <ArrowRightLeft className="w-3 h-3" />
          {briefMode === 'curated' ? 'Switch to On-Demand' : 'Switch to Curated'}
        </button>
      </div>

      <div className={cn(
        "rounded-2xl border border-[hsl(var(--primary)/0.15)] bg-primary/[0.02]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        showOutput && "border-solid border-border bg-card",
        onDemandOutput && "border-solid border-accent/20 bg-card"
      )}>
        {briefMode === 'curated' ? (
          /* ===== CURATED MODE ===== */
          !showOutput ? (
            <div className="p-5 space-y-4">
              {/* Account selector + Brief Me */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Account dropdown */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Account</span>
                  <div className="relative flex-1 sm:flex-none sm:w-[220px]">
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors",
                        selectedAccount
                          ? "border-primary/30 bg-background text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-left">
                        {selectedAccount
                          ? ACCOUNTS.find((a) => a.id === selectedAccount)?.label
                          : 'Select account…'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {accountDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                        {ACCOUNTS.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => {
                              setSelectedAccount(acc.id);
                              setAccountDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-3 py-2 text-sm hover:bg-muted/40 transition-colors',
                              selectedAccount === acc.id
                                ? 'text-primary font-medium'
                                : 'text-foreground'
                            )}
                          >
                            {acc.label}
                          </button>
                        ))}
                        <div className="border-t border-border/40 mt-1 pt-1">
                          <button
                            onClick={() => {
                              toast.info('Add account — coming soon');
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
                          >
                            <Plus className="w-3 h-3" />
                            Add new account
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Brief Me CTA */}
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl",
                    "font-semibold text-sm transition-all",
                    canGenerate
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Briefing…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Brief Me
                    </>
                  )}
                </button>
              </div>

              {!canGenerate && (
                <p className="text-[11px] text-muted-foreground text-center">
                  Select an account to generate your brief.
                </p>
              )}
            </div>
          ) : (
            /* ===== CURATED OUTPUT — instant signal feed ===== */
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Quick Brief: {customerName}
                  </h3>
                  <BriefingModePill mode="curated" />
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  New brief
                </button>
              </div>

              {triggeredFrom && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  Generated from: <span className="font-medium text-foreground/70">{triggeredFrom}</span>
                </p>
              )}

              {/* Signal cards — compact feed */}
              <div className="space-y-2">
                {visibleSignals.map((signal) => {
                  const tag = TYPE_TAGS[signal.type] ?? signal.type;
                  const tagColor = TYPE_COLORS[signal.type] ?? 'bg-muted text-muted-foreground border-border';

                  return (
                    <div
                      key={signal.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-primary/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', tagColor)}>
                            {tag}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-border/50 bg-muted/30 text-muted-foreground">
                            {ORIGIN_LABELS[signal.type] ?? 'Industry'}
                          </span>
                          <span className={cn(
                            'text-[10px] font-bold',
                            signal.confidence >= 60 ? 'text-green-600' : 'text-primary'
                          )}>
                            {signal.confidence}%
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {signal.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {signal.soWhat}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          addItem(focusId, {
                            id: makeInboxItemId(focusId, 'signal', signal.id),
                            focusId,
                            source_type: 'signal',
                            source_id: signal.id,
                            title: signal.title,
                            why_now: signal.soWhat.slice(0, 160),
                            impact_area: deriveImpactArea(signal.type),
                            tags: [signal.type],
                            created_at: new Date().toISOString(),
                          });
                          toast.success('Added to Deal Planning Inbox');
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/40 hover:border-primary/20 transition-colors flex-shrink-0 self-start mt-1"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        Deal Plan
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Show 5 more */}
              {hasMore && (
                <div className="flex justify-center pt-1">
                  <button
                    onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 border border-primary/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Show {Math.min(BATCH_SIZE, signals.length - visibleCount)} more
                  </button>
                </div>
              )}

              {/* Deeper analysis link */}
              <p className="text-[11px] text-muted-foreground/70 text-center italic">
                For deeper analysis, promote signals from the full view to Deal Planning.
              </p>
            </div>
          )
        ) : (
          /* ===== ON-DEMAND MODE ===== */
          !onDemandOutput ? (
            <OnDemandInput
              selectedAccount={selectedAccount}
              accounts={ACCOUNTS}
              onSelectAccount={setSelectedAccount}
              query={onDemandQuery}
              setQuery={setOnDemandQuery}
              isGenerating={isGenerating}
              onGenerate={handleOnDemandGenerate}
            />
          ) : (
            <OnDemandResult
              query={onDemandQuery}
              output={onDemandOutput}
              onSaveAsStory={handleSaveAsStory}
              onSaveToDealPlanning={handleSaveToDealPlanning}
              onReset={handleReset}
            />
          )
        )}
      </div>
    </section>
  );
}

/* ===== On-Demand Input ===== */

function OnDemandInput({
  selectedAccount, accounts, onSelectAccount,
  query, setQuery,
  isGenerating, onGenerate,
}: {
  selectedAccount: string | null;
  accounts: { id: string; label: string }[];
  onSelectAccount: (id: string) => void;
  query: string; setQuery: (v: string) => void;
  isGenerating: boolean; onGenerate: () => void;
}) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <BriefingModePill mode="on-demand" />
        <p className="text-xs text-muted-foreground">Ask anything — results generated instantly.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="sm:w-[220px]">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedAccount ?? ''}
              onChange={(e) => e.target.value && onSelectAccount(e.target.value)}
              className={cn(
                "w-full h-10 pl-9 pr-3 rounded-lg text-sm appearance-none",
                "bg-background border border-border",
                "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
              )}
            >
              <option value="">Account (optional)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
              placeholder="e.g. What's the latest on EU AI Act enforcement for elevators?"
              className={cn(
                "w-full h-10 pl-9 pr-3 rounded-lg text-sm",
                "bg-background border border-border",
                "placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Results are not saved unless you choose to keep them.
        </p>
        <button
          onClick={onGenerate}
          disabled={!query.trim() || isGenerating}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-accent text-accent-foreground font-medium text-sm",
            "shadow-sm hover:bg-accent/90 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ===== On-Demand Result ===== */

function OnDemandResult({
  query, output,
  onSaveAsStory, onSaveToDealPlanning, onReset,
}: {
  query: string; output: string;
  onSaveAsStory: () => void;
  onSaveToDealPlanning: () => void;
  onReset: () => void;
}) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-accent-foreground" />
          <h3 className="text-sm font-semibold text-foreground">On-Demand Result</h3>
          <BriefingModePill mode="on-demand" />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Your question</p>
        <p className="text-xs text-foreground">{query}</p>
      </div>

      <div className="prose prose-sm max-w-none text-sm text-foreground leading-relaxed whitespace-pre-line">
        {output}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <button
          onClick={onSaveAsStory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          Save as Story
        </button>
        <button
          onClick={onSaveToDealPlanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          <Target className="w-3 h-3" />
          Save to Deal Planning
        </button>
        <div className="flex-1" />
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          New brief
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/60 text-center">
        This result expires in 7 days unless saved.
      </p>
    </div>
  );
}

/* ===== On-Demand stub generator (demo) ===== */

function generateOnDemandStub(query: string, customer: string): string {
  const customerContext = customer ? ` for ${customer}` : '';
  return `Based on your question${customerContext}:\n\n"${query}"\n\nKey findings:\n\n• Recent regulatory developments suggest accelerated compliance timelines that directly affect operational planning. Organizations in this sector are moving toward proactive governance frameworks.\n\n• Competitive landscape analysis indicates 2–3 vendors are positioning similar capabilities, but differentiation lies in local data residency and industry-specific integrations.\n\n• Stakeholder alignment is critical — procurement, compliance, and engineering teams each have distinct priorities that need to be addressed in parallel.\n\nRecommended next steps:\n1. Validate findings with account stakeholders\n2. Cross-reference with existing account signals\n3. Consider promoting key insights to Deal Planning for structured follow-up`;
}
