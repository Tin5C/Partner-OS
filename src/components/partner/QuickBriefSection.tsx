// Quick Brief Section (Partner-only)
// Fast situational refresh in 60 seconds
// MVP: blurred CRM/calendar hints, max 2 chips, persona output

import { useState } from 'react';
import {
  Zap,
  Sparkles,
  Building2,
  Target,
  Shield,
  TrendingUp,
  MessageSquare,
  Lock,
  Calendar,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  QuickBriefOutput,
  generateQuickBriefResult,
  QuickBriefNeed,
  QuickBriefResult,
} from './QuickBriefOutput';

const NEED_OPTIONS: { value: QuickBriefNeed; label: string; icon: React.ReactNode }[] = [
  { value: 'meeting-prep', label: 'Meeting prep', icon: <Target className="w-3.5 h-3.5" /> },
  { value: 'objection-help', label: 'Objection help', icon: <Shield className="w-3.5 h-3.5" /> },
  { value: 'competitive-position', label: 'Competitive angle', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'intro-email', label: 'Intro email', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { value: 'value-pitch', label: 'Value pitch', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const MAX_CHIPS = 2;

interface QuickBriefSectionProps {
  onOpenDealBrief?: () => void;
}

export function QuickBriefSection({ onOpenDealBrief }: QuickBriefSectionProps) {
  const [customerName, setCustomerName] = useState('');
  const [situation, setSituation] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<QuickBriefNeed[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<QuickBriefResult | null>(null);

  const canGenerate = customerName.trim() && selectedNeeds.length > 0;

  const handleToggleNeed = (value: QuickBriefNeed) => {
    setSelectedNeeds((prev) => {
      if (prev.includes(value)) {
        return prev.filter((n) => n !== value);
      }
      if (prev.length >= MAX_CHIPS) {
        // Replace the last one
        return [...prev.slice(0, MAX_CHIPS - 1), value];
      }
      return [...prev, value];
    });
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);

    setTimeout(() => {
      const result = generateQuickBriefResult(
        customerName.trim(),
        situation.trim(),
        selectedNeeds
      );
      setOutput(result);
      setIsGenerating(false);
    }, 800);
  };

  const handlePromoteToDealBrief = () => {
    // Scroll to deal brief and hand off context
    onOpenDealBrief?.();
  };

  const handleReset = () => {
    setCustomerName('');
    setSituation('');
    setSelectedNeeds([]);
    setOutput(null);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Brief
        </h2>
        <p className="text-sm text-muted-foreground">
          Fast situational refresh before a call or meeting — 60 seconds.
        </p>
      </div>

      {/* Card */}
      <div className={cn(
        "rounded-2xl border-2 border-dashed border-amber-300/50 bg-amber-50/20 dark:bg-amber-950/10",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        output && "border-solid border-border bg-card"
      )}>
        {!output ? (
          /* ─── Input Phase ─── */
          <div className="p-5 space-y-4">
            {/* Blurred Calendar Hint */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
              <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
              <p className="text-[11px] text-muted-foreground/70">
                Upcoming meeting context will auto-load here once calendar is connected.
              </p>
            </div>

            {/* Row: Customer + Situation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-[220px] space-y-1">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer (auto-detected from CRM / calendar later)"
                    className={cn(
                      "w-full h-10 pl-9 pr-3 rounded-lg text-sm",
                      "bg-background border border-border",
                      "placeholder:text-muted-foreground/60",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    )}
                  />
                </div>
                {/* Blurred CRM Hint */}
                <div className="flex items-center gap-1.5 px-1">
                  <Lock className="w-3 h-3 text-muted-foreground/50" />
                  <Database className="w-3 h-3 text-muted-foreground/50" />
                  <p className="text-[10px] text-muted-foreground/50">
                    CRM account history and contacts will appear here when connected.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="What's the situation? e.g. Follow-up after Copilot demo with IT + Security"
                  className={cn(
                    "w-full h-10 px-3 rounded-lg text-sm",
                    "bg-background border border-border",
                    "placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  )}
                />
              </div>
            </div>

            {/* Need selector — max 2 */}
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

            {/* Generate */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                For deeper planning, use the AI Deal Brief below.
              </p>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl",
                  "bg-amber-500 text-white font-medium text-sm",
                  "shadow-sm hover:bg-amber-600 transition-all",
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
          /* ─── Output Phase ─── */
          <QuickBriefOutput
            result={output}
            onPromoteToDealBrief={handlePromoteToDealBrief}
            onReset={handleReset}
          />
        )}
      </div>
    </section>
  );
}
