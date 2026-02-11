// Quick Brief Section (Partner-only)
// Reads from canonical signalStore + quickBriefStore

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Sparkles,
  Building2,
  Target,
  Shield,
  TrendingUp,
  MessageSquare,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickBriefOutput } from './QuickBriefOutput';
import type { QuickBriefNeed } from './QuickBriefOutput';
import { listSignals } from '@/data/partner/signalStore';
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

interface QuickBriefSectionProps {
  onOpenDealBrief?: () => void;
}

export function QuickBriefSection({ onOpenDealBrief }: QuickBriefSectionProps) {
  const [customerName, setCustomerName] = useState('');
  const [situation, setSituation] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<QuickBriefNeed[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const signals = useMemo(() => listSignals(FOCUS_ID, WEEK_OF), []);

  const canGenerate = customerName.trim() && selectedNeeds.length > 0;

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
  };

  const handlePromoteToDealBrief = () => {
    onOpenDealBrief?.();
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#6D6AF6]" />
          Quick Brief
        </h2>
        <p className="text-sm text-muted-foreground">
          Fast situational refresh before a call or meeting — 60 seconds.
        </p>
      </div>
      <div className={cn(
        "rounded-2xl border border-[#E0E3FF] bg-[#F6F7FF] dark:bg-[#6D6AF6]/5",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        showOutput && "border-solid border-border bg-card"
      )}>
        {!showOutput ? (
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
                <p className="text-xs font-medium text-muted-foreground">What do you need?</p>
                <p className="text-[10px] text-muted-foreground/70">
                  Pick up to 2 — this stays fast.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {NEED_OPTIONS.map((option) => {
                  const isSelected = selectedNeeds.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleToggleNeed(option.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                For deeper planning, use the AI Deal Brief below.
              </p>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl",
                  "bg-[#6D6AF6] text-white font-medium text-sm",
                  "shadow-sm hover:bg-[#5B59E0] transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        ) : (
          <QuickBriefOutput
            customerName={customerName.trim()}
            focusId={FOCUS_ID}
            weekOf={WEEK_OF}
            signals={signals}
            onPromoteToDealBrief={handlePromoteToDealBrief}
            onReset={handleReset}
          />
        )}
      </div>
    </section>
  );
}
