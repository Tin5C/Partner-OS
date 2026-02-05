// Quick Brief Section (Partner-only)
// Fast situational refresh in 60–120 seconds
// Lightweight alternative to full AI Deal Brief

import { useState } from 'react';
import {
  Zap,
  Sparkles,
  Building2,
  Copy,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Target,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type QuickBriefNeed = 'meeting-prep' | 'objection-help' | 'competitive-position' | 'intro-email' | 'value-pitch';

interface QuickBriefOutput {
  situationSummary: string;
  keyPoints: string[];
  suggestedOpener: string;
  watchOuts: string[];
  nextStep: string;
}

const NEED_OPTIONS: { value: QuickBriefNeed; label: string; icon: React.ReactNode }[] = [
  { value: 'meeting-prep', label: 'Meeting prep', icon: <Target className="w-3.5 h-3.5" /> },
  { value: 'objection-help', label: 'Objection help', icon: <Shield className="w-3.5 h-3.5" /> },
  { value: 'competitive-position', label: 'Competitive angle', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'intro-email', label: 'Intro email', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { value: 'value-pitch', label: 'Value pitch', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

function generateQuickBrief(
  customerName: string,
  situation: string,
  need: QuickBriefNeed
): QuickBriefOutput {
  const needLabel = NEED_OPTIONS.find(n => n.value === need)?.label || need;

  return {
    situationSummary: `${customerName} appears to be in an active evaluation phase. Based on your notes, they're exploring AI capabilities with a focus on practical outcomes. The ${needLabel.toLowerCase()} angle is the right entry point.`,
    keyPoints: [
      `Lead with business outcomes — ${customerName} cares about measurable impact, not technology for technology's sake.`,
      `Reference their existing stack to show you've done homework and can integrate, not rip-and-replace.`,
      `Position the conversation around a quick win (30-day pilot) to reduce perceived risk.`,
      need === 'competitive-position'
        ? 'Differentiate on implementation speed and local support — competitors often promise but under-deliver on services.'
        : `Frame the ${needLabel.toLowerCase()} around their specific context to avoid sounding generic.`,
    ],
    suggestedOpener: need === 'meeting-prep'
      ? `"I've been looking at how companies in your space are approaching AI — and I think there's a practical path we can explore together that doesn't require a massive upfront commitment."`
      : need === 'intro-email'
        ? `Subject: Quick thought on AI for ${customerName}\n\nHi [Name],\n\nI noticed ${customerName} is exploring [area]. We've helped similar companies get from idea to working prototype in 4–6 weeks.\n\nWorth a 15-minute call to see if there's a fit?\n\nBest,\n[Your name]`
        : `"Based on what I'm seeing in your industry, here's what's working for companies at your stage — and where I think ${customerName} has a real advantage."`,
    watchOuts: [
      'Don\'t oversell AI capabilities — be honest about what requires customization vs. what works out of the box.',
      'Check if they have data residency requirements before proposing any architecture.',
      need === 'objection-help'
        ? 'The "we tried AI and it didn\'t work" objection is common — ask what they tried and why it stalled.'
        : 'Budget conversations should happen early — gauge whether this is funded or exploratory.',
    ],
    nextStep: need === 'meeting-prep'
      ? `After the meeting, log key takeaways and upgrade to a full AI Deal Brief for structured planning.`
      : `Consider creating a full AI Deal Brief if this moves to a concrete opportunity.`,
  };
}

interface QuickBriefSectionProps {
  onOpenDealBrief?: () => void;
}

export function QuickBriefSection({ onOpenDealBrief }: QuickBriefSectionProps) {
  const [customerName, setCustomerName] = useState('');
  const [situation, setSituation] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<QuickBriefNeed | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<QuickBriefOutput | null>(null);

  const canGenerate = customerName.trim() && selectedNeed;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);

    setTimeout(() => {
      const result = generateQuickBrief(customerName.trim(), situation.trim(), selectedNeed!);
      setOutput(result);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleCopyAll = () => {
    if (!output) return;
    const all = [
      `Quick Brief: ${customerName}`,
      '',
      output.situationSummary,
      '',
      'Key points:',
      ...output.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      '',
      'Suggested opener:',
      output.suggestedOpener,
      '',
      'Watch outs:',
      ...output.watchOuts.map(w => `• ${w}`),
      '',
      `Next: ${output.nextStep}`,
    ].join('\n');
    handleCopy(all);
  };

  const handleReset = () => {
    setCustomerName('');
    setSituation('');
    setSelectedNeed(null);
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
          /* Input Phase */
          <div className="p-5 space-y-4">
            {/* Row: Customer + Situation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-[200px]">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name..."
                    className={cn(
                      "w-full h-10 pl-9 pr-3 rounded-lg text-sm",
                      "bg-background border border-border",
                      "placeholder:text-muted-foreground/60",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    )}
                  />
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="What's the situation? e.g., Follow-up after demo, cold outreach to CTO..."
                  className={cn(
                    "w-full h-10 px-3 rounded-lg text-sm",
                    "bg-background border border-border",
                    "placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  )}
                />
              </div>
            </div>

            {/* Need selector */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">What do you need?</p>
              <div className="flex flex-wrap gap-2">
                {NEED_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedNeed(option.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selectedNeed === option.value
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
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
          /* Output Phase */
          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  Quick Brief: {customerName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy all
                </button>
              </div>
            </div>

            {/* Situation Summary */}
            <p className="text-sm text-foreground leading-relaxed">
              {output.situationSummary}
            </p>

            {/* Key Points */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key points</p>
              {output.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            {/* Suggested Opener */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-primary">Suggested opener</p>
                <button
                  onClick={() => handleCopy(output.suggestedOpener)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-sm text-foreground italic leading-relaxed whitespace-pre-line">
                {output.suggestedOpener}
              </p>
            </div>

            {/* Watch Outs */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Watch outs</p>
              {output.watchOuts.map((w, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  <p className="text-muted-foreground">{w}</p>
                </div>
              ))}
            </div>

            {/* Next Step + Upgrade */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{output.nextStep}</p>
              </div>
              {onOpenDealBrief && (
                <button
                  onClick={onOpenDealBrief}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Full brief
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Reset */}
            <div className="flex justify-center pt-1">
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                New quick brief
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
