// Quick Brief Output (Partner-only)
// Structured output: 3 "What changed" bullets, persona tabs, confidence, handoff

import { useState } from 'react';
import {
  Zap,
  Copy,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  Target,
  MessageSquare,
  Info,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type QuickBriefNeed = 'meeting-prep' | 'objection-help' | 'competitive-position' | 'intro-email' | 'value-pitch';

export interface WhatChangedBullet {
  headline: string;
  soWhat: string;
  whatToDo: string;
}

export interface QuickBriefResult {
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
  recommendedPlay?: {
    playType: string;
    title: string;
  };
  objections?: {
    theme: string;
    responses: string[];
    proofArtifact?: string;
  }[];
  contextLine?: string; // Optional context attribution line
}

type PersonaTab = 'seller' | 'engineer';

interface QuickBriefOutputProps {
  result: QuickBriefResult;
  onPromoteToDealBrief: () => void;
  onReset: () => void;
}

// Legacy generator removed — output now comes from provider artifacts

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
        b.soWhat ? `   So what: ${b.soWhat}` : '',
        `   Action: ${b.whatToDo}`,
        '',
      ].filter(Boolean)),
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
      ? 'text-[#6D6AF6]'
      : 'text-red-500';

  return (
    <div className="p-5 space-y-5">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#6D6AF6]" />
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
              {bullet.soWhat && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">So what:</span> {bullet.soWhat}
                </p>
              )}
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

        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What's missing
          </p>
          <div className="space-y-1.5">
            {result.whatsMissing.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-[#6D6AF6]/70 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Objection Help (when chip selected) */}
      {result.objections && result.objections.length > 0 && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Objection Help
          </p>
          <div className="space-y-3">
            {result.objections.map((obj, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-sm font-medium text-foreground">{obj.theme}</p>
                {obj.responses.map((r, ri) => (
                  <p key={ri} className="text-xs text-muted-foreground ml-3">→ {r}</p>
                ))}
                {obj.proofArtifact && (
                  <p className="text-[11px] text-primary ml-3">📎 {obj.proofArtifact}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Play */}
      {result.recommendedPlay && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
          <div className="flex items-center gap-1.5 mb-2">
            <Play className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended briefing
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{result.recommendedPlay.title}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{result.recommendedPlay.playType}</p>
            </div>
            <button
              onClick={() => toast.info('Briefing viewer coming soon')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
            >
              Open (read)
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

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
