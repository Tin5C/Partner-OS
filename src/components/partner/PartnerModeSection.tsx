// Partner Mode Section
// Toggles between Quick Brief (default) and Deal Planning modes
// Deal Planning expanded state renders from DealBriefV1 artifact

import { useState } from 'react';
import { Zap, Brain, Info, Users, AlertTriangle, Target, CheckCircle2, HelpCircle, Play, Copy, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickBriefSection } from './QuickBriefSection';
import { CustomerBriefSection } from './CustomerBriefSection';
import { usePartnerData } from '@/contexts/FocusDataContext';
import type { DealBriefV1 } from '@/data/partner/contracts';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type PartnerMode = 'quick-brief' | 'deal-planning';

export function PartnerModeSection() {
  const [mode, setMode] = useState<PartnerMode>('quick-brief');
  const [dealBriefExpanded, setDealBriefExpanded] = useState(false);

  const handlePromoteToDealBrief = () => {
    setMode('deal-planning');
    setDealBriefExpanded(true);
  };

  return (
    <section className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-muted/50 p-1 border border-border">
          <button
            onClick={() => setMode('quick-brief')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'quick-brief'
                ? "bg-[#6D6AF6] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="w-4 h-4" />
            Quick Brief
          </button>
          <button
            onClick={() => setMode('deal-planning')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'deal-planning'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Brain className="w-4 h-4" />
            Deal Planning
          </button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[260px] text-xs leading-relaxed">
              <p>Some fields auto-fill when CRM and calendar are connected.</p>
              <p className="mt-1 text-muted-foreground">Current results are based on your Dialogue activity.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mode Content */}
      {mode === 'quick-brief' ? (
        <QuickBriefSection onOpenDealBrief={handlePromoteToDealBrief} />
      ) : (
        <DealPlanningMode
          expanded={dealBriefExpanded}
          onExpand={() => setDealBriefExpanded(true)}
        />
      )}
    </section>
  );
}

// Deal Planning collapsed/expanded wrapper
function DealPlanningMode({
  expanded,
  onExpand,
}: {
  expanded: boolean;
  onExpand: () => void;
}) {
  const { provider } = usePartnerData();
  const ctx = provider.getActiveContext();

  if (!expanded) {
    return (
      <div className={cn(
        "rounded-2xl border border-border bg-card",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        "p-6"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">AI Deal Brief</h3>
              <p className="text-sm text-muted-foreground">
                Turn messy AI deal context into a deal-ready plan in 5–10 minutes.
              </p>
            </div>
          </div>
          <button
            onClick={onExpand}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  // If we have an artifact-backed deal brief, show it
  if (ctx) {
    const artifact = provider.getArtifact({ runId: ctx.runId, artifactType: 'dealBrief' });
    if (artifact) {
      const deal = artifact.content as DealBriefV1;
      return <DealBriefArtifactView deal={deal} />;
    }
  }

  // Fallback to the existing interactive form
  return <CustomerBriefSection />;
}

// Render a DealBriefV1 artifact as structured read-only view
function DealBriefArtifactView({ deal }: { deal: DealBriefV1 }) {
  const [objectionsOpen, setObjectionsOpen] = useState(false);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card",
      "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]",
      "p-6 space-y-6"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Deal Brief</h3>
            {deal.simulated && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" /> Demo artifact — simulated content
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => handleCopy(JSON.stringify(deal, null, 2))}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>

      {/* Deal Objective */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Deal objective</p>
        <p className="text-sm text-foreground leading-relaxed">{deal.dealObjective}</p>
      </div>

      {/* Current Situation */}
      {deal.currentSituation && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Current situation</p>
          <p className="text-sm text-foreground leading-relaxed">{deal.currentSituation}</p>
        </div>
      )}

      {/* Top Signals */}
      {deal.topSignals.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Top signals</p>
          <div className="space-y-2">
            {deal.topSignals.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stakeholders */}
      {deal.stakeholders.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Stakeholders
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {deal.stakeholders.map((sh, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                <p className="text-sm font-medium text-foreground">{sh.name}</p>
                <p className="text-xs text-muted-foreground">{sh.role}</p>
                {sh.stance && <p className="text-[11px] text-primary mt-0.5">{sh.stance}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {deal.risks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Risks
          </p>
          <div className="space-y-1.5">
            {deal.risks.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-3 h-3 text-destructive/60 mt-1 flex-shrink-0" />
                <p className="text-foreground">{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof Artifacts To Ask For */}
      {deal.proofArtifactsToAskFor.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Proof to request</p>
          <div className="space-y-1.5">
            {deal.proofArtifactsToAskFor.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-3 h-3 text-primary/60 mt-1 flex-shrink-0" />
                <p className="text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Plan */}
      {deal.executionPlan.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Execution plan
          </p>
          <div className="space-y-2">
            {deal.executionPlan.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Briefings */}
      {deal.recommendedPlays.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Recommended briefings
          </p>
          <div className="space-y-2">
            {deal.recommendedPlays.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/60">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{item.playType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.info('Briefing audio coming soon')}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Play (audio)
                  </button>
                  <button
                    onClick={() => toast.info('Briefing reader coming soon')}
                    className="text-xs text-primary font-medium hover:text-primary/80"
                  >
                    Open (read)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objections & Proof (collapsed by default) */}
      <div className="border border-border/60 rounded-xl overflow-hidden">
        <button
          onClick={() => setObjectionsOpen(!objectionsOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Objections & Proof
          </p>
          {objectionsOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {objectionsOpen && (
          <div className="px-3 pb-3 space-y-3">
            {/* Top 5 objection themes from the Play artifacts */}
            {[
              { theme: 'Not ready for AI', response: 'Readiness isn\'t binary. Propose an AI Readiness Assessment as the logical first step.', proof: 'AI Readiness Assessment sample output', stakeholder: 'CTO Office' },
              { theme: 'Data residency concerns', response: 'Azure OpenAI is now GA in Switzerland North — all processing stays in-country.', proof: 'Azure region availability matrix', stakeholder: 'CISO' },
              { theme: 'Data quality insufficient', response: 'You don\'t need perfect data. The assessment identifies gaps and prioritizes what to fix first.', proof: 'Data readiness framework', stakeholder: 'VP Operations' },
              { theme: 'Competitor chose Google Cloud', response: 'Kone\'s use case (consumer analytics) differs from your predictive maintenance needs. Azure is purpose-built for industrial IoT.', proof: 'Kone use case differentiation', stakeholder: 'CTO Office' },
              { theme: 'No board approval for AI', response: 'The readiness assessment produces exactly the business case your board needs — ROI, risk, and phased roadmap.', proof: 'Board-ready business case template', stakeholder: 'VP Operations' },
            ].map((obj, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                <p className="text-sm font-medium text-foreground">{obj.theme}</p>
                <p className="text-xs text-muted-foreground">{obj.response}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-primary">📎 {obj.proof}</p>
                  <p className="text-[10px] text-muted-foreground">Confirm with: {obj.stakeholder}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Questions */}
      {deal.openQuestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Open questions
          </p>
          <div className="space-y-1.5">
            {deal.openQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <HelpCircle className="w-3 h-3 text-muted-foreground/60 mt-1 flex-shrink-0" />
                <p className="text-foreground">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {deal.sources.length > 0 && (
        <div className="pt-2 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground mb-1.5">Sources</p>
          <div className="flex flex-wrap gap-1.5">
            {deal.sources.map((src, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40">
                {src.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
