// Quick Brief Section (Partner-only)
// Reads from canonical signalStore + quickBriefStore
// Supports Curated (default) and On-Demand modes
// Auto-populates and auto-runs when triggered from a Story

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
  Search,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickBriefOutput } from './QuickBriefOutput';
import type { QuickBriefNeed } from './QuickBriefOutput';
import { listSignals } from '@/data/partner/signalStore';
import { enrichSignals } from '@/data/partner/signalEnrichment';
import { listWeeklySignals, hasWeeklySignals } from '@/data/partner/weeklySignalStore';
import { createGeneratedDraft } from '@/data/partner/generatedDraftStore';
import { BriefingModePill } from './BriefingModePill';
import { toast } from 'sonner';
import { consumeQuickBriefTrigger, QUICK_BRIEF_TRIGGER_EVENT } from '@/data/partner/quickBriefTrigger';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NEED_OPTIONS: { value: QuickBriefNeed; label: string; icon: React.ReactNode }[] = [
  { value: 'meeting-prep', label: 'Meeting prep', icon: <Target className="w-3.5 h-3.5" /> },
  { value: 'objection-help', label: 'Objection help', icon: <Shield className="w-3.5 h-3.5" /> },
  { value: 'competitive-position', label: 'Competitive angle', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'intro-email', label: 'Intro email', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { value: 'value-pitch', label: 'Value pitch', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const MAX_CHIPS = 2;
const FOCUS_ID = 'schindler';
const WEEK_OF = '2026-02-10';
const TIME_KEY = '2026-W07';

type BriefMode = 'curated' | 'on-demand';

interface QuickBriefSectionProps {
  onOpenDealBrief?: () => void;
}

export function QuickBriefSection({ onOpenDealBrief }: QuickBriefSectionProps) {
  const [customerName, setCustomerName] = useState('');
  const [situation, setSituation] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<QuickBriefNeed[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [briefMode, setBriefMode] = useState<BriefMode>('curated');
  const [triggeredFrom, setTriggeredFrom] = useState<string | null>(null);
  

  // On-Demand state
  const [onDemandQuery, setOnDemandQuery] = useState('');
  const [onDemandOutput, setOnDemandOutput] = useState<string | null>(null);
  const [onDemandDraftId, setOnDemandDraftId] = useState<string | null>(null);

  // Check for trigger context from Stories
  // Listen for trigger events from Story modals
  const handleTrigger = useRef(() => {
    const ctx = consumeQuickBriefTrigger();
    if (ctx) {
      // Auto-populate
      if (ctx.customer) setCustomerName(ctx.customer);
      setSituation(`Triggered from: ${ctx.storyTitle}`);
      setTriggeredFrom(ctx.storyTitle);
      setSelectedNeeds((prev) => prev.length === 0 ? ['meeting-prep'] : prev);
      setBriefMode('curated');
      // Auto-run
      setIsGenerating(true);
      setShowOutput(false);
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

  // Check WeeklySignal index first, fall back to legacy signalStore
  const weeklySignals = useMemo(() => listWeeklySignals(FOCUS_ID, TIME_KEY), []);
  const hasWeekly = weeklySignals.length > 0;

  const rawSignals = useMemo(() => listSignals(FOCUS_ID, WEEK_OF), []);
  const signals = useMemo(() => enrichSignals(rawSignals, FOCUS_ID), [rawSignals]);

  const noSignals = !hasWeekly && rawSignals.length === 0;

  const canGenerate = customerName.trim().length > 0;

  const handleToggleNeed = (value: QuickBriefNeed) => {
    setSelectedNeeds((prev) => {
      if (prev.includes(value)) return prev.filter((n) => n !== value);
      if (prev.length >= MAX_CHIPS) return [...prev.slice(0, MAX_CHIPS - 1), value];
      return [...prev, value];
    });
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => {
      setShowOutput(true);
      setIsGenerating(false);
    }, 600);
  };

  const handleReset = () => {
    setCustomerName('');
    setSituation('');
    setSelectedNeeds([]);
    setShowOutput(false);
    setOnDemandOutput(null);
    setOnDemandDraftId(null);
    setOnDemandQuery('');
    setBriefMode('curated');
    setTriggeredFrom(null);
    
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
      const output = generateOnDemandStub(onDemandQuery.trim(), customerName.trim());
      const draft = createGeneratedDraft({
        focusId: FOCUS_ID,
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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Brief
          </h2>
          <p className="text-sm text-muted-foreground">
            Fast situational refresh before a call or meeting — 60 seconds.
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
            <CuratedInput
              customerName={customerName}
              setCustomerName={setCustomerName}
              situation={situation}
              setSituation={setSituation}
              selectedNeeds={selectedNeeds}
              onToggleNeed={handleToggleNeed}
              canGenerate={canGenerate}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          ) : (
            <QuickBriefOutput
              customerName={customerName.trim()}
              focusId={FOCUS_ID}
              weekOf={WEEK_OF}
              signals={signals}
              onPromoteToDealBrief={handlePromoteToDealBrief}
              onReset={handleReset}
              triggeredFrom={triggeredFrom}
            />
          )
        ) : (
          /* ===== ON-DEMAND MODE ===== */
          !onDemandOutput ? (
            <OnDemandInput
              customerName={customerName}
              setCustomerName={setCustomerName}
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

/* ===== Curated Input (extracted for clarity) ===== */

function CuratedInput({
  customerName, setCustomerName,
  situation, setSituation,
  selectedNeeds, onToggleNeed,
  canGenerate, isGenerating, onGenerate,
}: {
  customerName: string; setCustomerName: (v: string) => void;
  situation: string; setSituation: (v: string) => void;
  selectedNeeds: QuickBriefNeed[]; onToggleNeed: (v: QuickBriefNeed) => void;
  canGenerate: boolean; isGenerating: boolean; onGenerate: () => void;
}) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="sm:w-[220px]">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer"
              className={cn(
                "w-full h-10 pl-9 pr-8 rounded-lg text-sm",
                "bg-background border border-border",
                "placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              )}
            />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[240px] text-xs">
                  Some context can auto-fill from CRM & calendar when connected. In this demo, results are based on simulated Dialogue activity.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="What's happening? e.g. Follow-up after Copilot demo with IT + Security"
            className={cn(
              "w-full h-10 px-3 rounded-lg text-sm",
              "bg-background border border-border",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            What do you need?
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-muted-foreground/50">
                    <Lock className="w-3 h-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-xs">
                  Enhanced brief modes — unlocking in next release.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {NEED_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-muted/30 text-muted-foreground/40 cursor-not-allowed select-none opacity-60"
            >
              {option.icon}
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          For deeper planning, use the AI Deal Brief below.
        </p>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-primary text-primary-foreground font-medium text-sm",
            "shadow-sm hover:bg-primary/90 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              Quick brief
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ===== On-Demand Input ===== */

function OnDemandInput({
  customerName, setCustomerName,
  query, setQuery,
  isGenerating, onGenerate,
}: {
  customerName: string; setCustomerName: (v: string) => void;
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
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer (optional)"
              className={cn(
                "w-full h-10 pl-9 pr-3 rounded-lg text-sm",
                "bg-background border border-border",
                "placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
              )}
            />
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
