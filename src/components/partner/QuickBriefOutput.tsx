// Quick Brief Output (Partner-only)
// Structured output: 3 "What changed" bullets, persona tabs, confidence, handoff

import { useState } from 'react';
import {
  Zap,
  Copy,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  Target,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type QuickBriefNeed = 'meeting-prep' | 'objection-help' | 'competitive-position' | 'intro-email' | 'value-pitch';

interface WhatChangedBullet {
  headline: string;
  soWhat: string;
  whatToDo: string;
}

interface QuickBriefResult {
  customerName: string;
  needs: QuickBriefNeed[];
  whatChanged: WhatChangedBullet[];
  sellerView: {
    talkTrack: string[];
    emailDraft?: string;
  };
  engineerView: {
    technicalContext: string[];
    architectureNotes: string;
  };
  confidence: {
    score: number;
    label: string;
    reason: string;
  };
  whatsMissing: string[];
}

type PersonaTab = 'seller' | 'engineer';

interface QuickBriefOutputProps {
  result: QuickBriefResult;
  onPromoteToDealBrief: () => void;
  onReset: () => void;
}

export type { QuickBriefNeed, WhatChangedBullet, QuickBriefResult };

export function generateQuickBriefResult(
  customerName: string,
  situation: string,
  needs: QuickBriefNeed[]
): QuickBriefResult {
  const hasEmail = needs.includes('intro-email');
  const hasCompetitive = needs.includes('competitive-position');
  const hasMeetingPrep = needs.includes('meeting-prep');
  const hasObjection = needs.includes('objection-help');

  return {
    customerName,
    needs,
    whatChanged: [
      {
        headline: `${customerName} exploring AI for operations`,
        soWhat: 'They are in active evaluation — timing is right to position practical outcomes.',
        whatToDo: 'Lead with a 30-day pilot framing to reduce perceived risk.',
      },
      {
        headline: 'Competitive pressure from hyperscaler-native offers',
        soWhat: 'Buyers are comparing you against bundled AI from platform vendors.',
        whatToDo: hasCompetitive
          ? 'Differentiate on implementation speed and local services capability.'
          : 'Reference specific customer wins where you outperformed bundled alternatives.',
      },
      {
        headline: 'Budget cycle closing in 6–8 weeks',
        soWhat: 'Any proposal needs to land within the current approval window.',
        whatToDo: 'Push for a decision meeting within 2 weeks to fit procurement timelines.',
      },
    ],
    sellerView: {
      talkTrack: [
        `Open with business outcomes — ${customerName} cares about measurable impact.`,
        'Reference their existing stack to show homework, not rip-and-replace.',
        'Position around a quick win (30-day pilot) to lower entry barrier.',
        hasObjection
          ? 'If they say "we tried AI before" — ask what stalled and why, then reframe.'
          : 'Gauge budget early — is this funded or exploratory?',
        'Close with a concrete next step: "Can we schedule a brief architecture session?"',
      ],
      emailDraft: hasEmail
        ? `Subject: Quick thought on AI for ${customerName}\n\nHi [Name],\n\nI noticed ${customerName} is exploring [area]. We've helped similar companies get from idea to working prototype in 4–6 weeks — without requiring a massive upfront commitment.\n\nWorth a 15-minute call to see if there's a fit?\n\nBest,\n[Your name]`
        : undefined,
    },
    engineerView: {
      technicalContext: [
        `Likely hybrid environment — check cloud vs on-prem split before proposing architecture.`,
        'Data residency requirements probable — confirm before any design.',
        hasCompetitive
          ? 'Competitor likely proposing a platform-native approach — counter with interoperability.'
          : 'Focus on integration with existing stack, not greenfield.',
        'Recommend starting with RAG pattern if unstructured data is available.',
      ],
      architectureNotes: `For ${customerName}, consider a lightweight PoC architecture: managed AI service + existing data layer + simple API integration. Avoid over-engineering — the goal is proof of value in 4 weeks.`,
    },
    confidence: {
      score: situation.trim() ? 55 : 35,
      label: situation.trim() ? 'Moderate' : 'Low',
      reason: situation.trim()
        ? 'Based on your Dialogue activity. Add a Deal Brief for higher confidence.'
        : 'Limited context. Add situation details or create a Deal Brief for better results.',
    },
    whatsMissing: [
      'Decision-maker role and authority level',
      'Current vendor relationships and contracts',
      'Specific use case or pain point details',
    ],
  };
}

export function QuickBriefOutput({ result, onPromoteToDealBrief, onReset }: QuickBriefOutputProps) {
  const [activeTab, setActiveTab] = useState<PersonaTab>('seller');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleCopyAll = () => {
    const lines = [
      `Quick Brief: ${result.customerName}`,
      '',
      '── What changed ──',
      ...result.whatChanged.flatMap((b, i) => [
        `${i + 1}. ${b.headline}`,
        `   So what: ${b.soWhat}`,
        `   Action: ${b.whatToDo}`,
        '',
      ]),
      activeTab === 'seller' ? '── Talk track (Seller) ──' : '── Technical context (Engineer) ──',
      ...(activeTab === 'seller'
        ? result.sellerView.talkTrack.map((t, i) => `${i + 1}. ${t}`)
        : result.engineerView.technicalContext.map((t, i) => `${i + 1}. ${t}`)),
      '',
      result.sellerView.emailDraft ? `── Email draft ──\n${result.sellerView.emailDraft}\n` : '',
      `Confidence: ${result.confidence.score}% (${result.confidence.label})`,
      '',
      '── What\'s missing ──',
      ...result.whatsMissing.map(m => `• ${m}`),
    ].filter(Boolean).join('\n');
    handleCopy(lines);
  };

  const confidenceColor = result.confidence.score >= 60
    ? 'text-green-600'
    : result.confidence.score >= 40
      ? 'text-amber-600'
      : 'text-red-500';

  return (
    <div className="p-5 space-y-5">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-foreground">
            Quick Brief: {result.customerName}
          </h3>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Copy className="w-3 h-3" />
          Copy all
        </button>
      </div>

      {/* Data Source Label */}
      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
        <Info className="w-3 h-3" />
        Based on your Dialogue activity
      </p>

      {/* What Changed — exactly 3 bullets */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          What changed
        </p>
        {result.whatChanged.map((bullet, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-foreground">{bullet.headline}</p>
            </div>
            <div className="ml-[30px] space-y-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">So what:</span> {bullet.soWhat}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">Action:</span> {bullet.whatToDo}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Persona Tabs */}
      <div>
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => setActiveTab('seller')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeTab === 'seller'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Target className="w-3 h-3 inline mr-1" />
            Seller view
          </button>
          <button
            onClick={() => setActiveTab('engineer')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeTab === 'engineer'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Shield className="w-3 h-3 inline mr-1" />
            Engineer view
          </button>
        </div>

        {activeTab === 'seller' ? (
          <div className="space-y-3">
            {/* Talk Track */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Talk track
                </p>
                <button
                  onClick={() => handleCopy(result.sellerView.talkTrack.join('\n'))}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              {result.sellerView.talkTrack.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            {/* Email Draft (if intro-email selected) */}
            {result.sellerView.emailDraft && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Intro email draft
                  </p>
                  <button
                    onClick={() => handleCopy(result.sellerView.emailDraft!)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {result.sellerView.emailDraft}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Technical Context */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Technical context
              </p>
              {result.engineerView.technicalContext.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            {/* Architecture Notes */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-semibold text-primary mb-1.5">Architecture notes</p>
              <p className="text-sm text-foreground leading-relaxed">
                {result.engineerView.architectureNotes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confidence + What's Missing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Confidence */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Confidence
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn("text-lg font-bold", confidenceColor)}>
              {result.confidence.score}%
            </span>
            <span className={cn("text-xs font-medium", confidenceColor)}>
              {result.confidence.label}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {result.confidence.reason}
          </p>
        </div>

        {/* What's Missing */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What's missing
          </p>
          <div className="space-y-1.5">
            {result.whatsMissing.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promote to AI Deal Brief */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
        <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-foreground font-medium">
            Need deeper planning?
          </p>
          <p className="text-[11px] text-muted-foreground">
            Quick Brief content will be added as context to your Deal Brief.
          </p>
        </div>
        <button
          onClick={onPromoteToDealBrief}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Promote to AI Deal Brief
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Reset */}
      <div className="flex justify-center pt-1">
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          New quick brief
        </button>
      </div>
    </div>
  );
}
