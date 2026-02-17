// ReadinessAssessmentPanel — right-side slide panel for structured readiness assessment
// Partner-only, UI enhancement only, no new stores

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { ScoredPlay } from '@/partner/lib/dealPlanning/propensity';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';

// ============= Types =============

type RowStatus = 'Met' | 'Partial' | 'Missing';

interface ReadinessRow {
  id: string;
  label: string;
  status: RowStatus;
  evidence: string;
}

interface ReadinessSection {
  title: string;
  rows: ReadinessRow[];
}

// ============= Deterministic Assessment Generator =============

function generateAssessment(
  play: ScoredPlay,
  promotedSignals: PromotedSignal[],
  initiativeCount: number,
  trendCount: number,
): ReadinessSection[] {
  const hasSignals = promotedSignals.length > 0;
  const hasInitiatives = initiativeCount > 0;
  const hasTrends = trendCount > 0;

  const signalTypes = new Set(promotedSignals.map((s) => s.snapshot.type));
  const hasGovernance = signalTypes.has('regulatory') || play.packName.toLowerCase().includes('governance');
  const hasSecurity = promotedSignals.some((s) => s.snapshot.title?.toLowerCase().includes('security'));

  return [
    {
      title: 'Strategic Alignment',
      rows: [
        {
          id: 'sa_sponsor',
          label: 'Executive AI sponsor documented',
          status: hasInitiatives ? 'Partial' : 'Missing',
          evidence: hasInitiatives
            ? `${initiativeCount} initiative(s) detected — sponsor may be inferred.`
            : 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'sa_governance',
          label: 'Governance initiative visible',
          status: hasGovernance ? 'Met' : hasInitiatives ? 'Partial' : 'Missing',
          evidence: hasGovernance
            ? 'Governance-related signal or initiative detected.'
            : 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'sa_budget',
          label: 'Budget owner identified',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
      ],
    },
    {
      title: 'Stakeholder Coverage',
      rows: [
        {
          id: 'sc_ciso',
          label: 'CISO engaged',
          status: hasSecurity ? 'Partial' : 'Missing',
          evidence: hasSecurity
            ? 'Security-related signal detected — CISO engagement may be inferred.'
            : 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'sc_risk',
          label: 'Risk/compliance lead identified',
          status: hasGovernance ? 'Partial' : 'Missing',
          evidence: hasGovernance
            ? 'Regulatory signal detected — compliance contact may exist.'
            : 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'sc_sponsor',
          label: 'Business sponsor aligned',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
      ],
    },
    {
      title: 'Commercial Viability',
      rows: [
        {
          id: 'cv_timeline',
          label: 'Timeline defined',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'cv_funding',
          label: 'Funding pathway clarified',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'cv_competitive',
          label: 'Competitive context identified',
          status: hasSignals && signalTypes.has('competitive') ? 'Met' : 'Missing',
          evidence: signalTypes.has('competitive')
            ? 'Competitive signal detected.'
            : 'Not detected in signals, initiatives, or account inputs.',
        },
      ],
    },
    {
      title: 'Delivery Feasibility',
      rows: [
        {
          id: 'df_arch',
          label: 'Architecture assumptions reviewed',
          status: hasTrends ? 'Partial' : 'Missing',
          evidence: hasTrends
            ? `${trendCount} trend(s) detected — architecture context may be inferred.`
            : 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'df_data',
          label: 'Data constraints identified',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
        {
          id: 'df_integration',
          label: 'Integration dependencies mapped',
          status: 'Missing',
          evidence: 'Not detected in signals, initiatives, or account inputs.',
        },
      ],
    },
  ];
}

function computeOverallReadiness(sections: ReadinessSection[]): number {
  const allRows = sections.flatMap((s) => s.rows);
  const total = allRows.length;
  if (total === 0) return 0;
  const score = allRows.reduce((acc, r) => {
    if (r.status === 'Met') return acc + 1;
    if (r.status === 'Partial') return acc + 0.5;
    return acc;
  }, 0);
  return Math.round((score / total) * 100);
}

function readinessLabel(pct: number): string {
  if (pct >= 80) return 'Deal-ready';
  if (pct >= 60) return 'Progressing';
  if (pct >= 40) return 'Developing';
  if (pct >= 20) return 'Early';
  return 'Not ready';
}

// ============= Status Chip =============

function StatusChip({ status }: { status: RowStatus }) {
  const styles: Record<RowStatus, string> = {
    Met: 'bg-muted text-foreground',
    Partial: 'bg-secondary text-secondary-foreground',
    Missing: 'bg-muted/60 text-muted-foreground',
  };
  return (
    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded', styles[status])}>
      {status}
    </span>
  );
}

// ============= Props =============

interface ReadinessAssessmentPanelProps {
  play: ScoredPlay;
  promotedSignals: PromotedSignal[];
  initiativeCount: number;
  trendCount: number;
  onClose: () => void;
  onAddToPlan: (play: ScoredPlay) => void;
}

// ============= Main Component =============

export function ReadinessAssessmentPanel({
  play,
  promotedSignals,
  initiativeCount,
  trendCount,
  onClose,
  onAddToPlan,
}: ReadinessAssessmentPanelProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [outreachOpen, setOutreachOpen] = useState(false);

  const sections = useMemo(
    () => generateAssessment(play, promotedSignals, initiativeCount, trendCount),
    [play, promotedSignals, initiativeCount, trendCount],
  );

  const overallPct = useMemo(() => computeOverallReadiness(sections), [sections]);
  const stateLabel = readinessLabel(overallPct);

  // Primary gap drivers — first 2 missing rows
  const gapDrivers = useMemo(() => {
    return sections
      .flatMap((s) => s.rows)
      .filter((r) => r.status === 'Missing')
      .slice(0, 2)
      .map((r) => r.label);
  }, [sections]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-card z-50 border-l border-border flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{play.packName}</p>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Readiness Assessment</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Based on: {initiativeCount} initiative{initiativeCount !== 1 ? 's' : ''} · {trendCount} trend{trendCount !== 1 ? 's' : ''} · {promotedSignals.length} signal{promotedSignals.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Separator />

        {/* Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sections.map((section, si) => (
            <div key={section.title}>
              <div className="px-5 py-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.rows.map((row) => (
                    <div key={row.id}>
                      <button
                        onClick={() => toggleRow(row.id)}
                        className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-muted/40 transition-colors"
                      >
                        <span className="text-xs text-foreground">{row.label}</span>
                        <StatusChip status={row.status} />
                      </button>
                      {expandedRows.has(row.id) && (
                        <div className="ml-2 px-2 py-1.5 mb-1">
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {row.evidence}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {si < sections.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <Separator />

        {/* Summary Block */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Readiness</p>
            <p className="text-sm font-semibold text-foreground">{overallPct}% · {stateLabel}</p>
          </div>
          <Progress value={overallPct} className="h-1.5 bg-secondary" />

          {gapDrivers.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">Primary Gap Drivers</p>
              {gapDrivers.map((g, i) => (
                <p key={i} className="text-[11px] text-muted-foreground ml-2">• {g}</p>
              ))}
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground mb-1">Recommended Next Action</p>
            <p className="text-[11px] text-muted-foreground">
              {overallPct < 30
                ? 'Engage security leadership before formalizing proposal.'
                : overallPct < 60
                  ? 'Confirm stakeholder alignment and timeline before advancing.'
                  : 'Proceed with proposal — readiness supports engagement.'}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { onAddToPlan(play); onClose(); }}
              className="flex-1 px-3 py-2 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add to Plan Anyway
            </button>
            <button
              onClick={() => setOutreachOpen(true)}
              className="flex-1 px-3 py-2 rounded text-xs font-medium border border-border text-foreground hover:bg-muted/40 transition-colors"
            >
              Generate Security Outreach Draft
            </button>
          </div>
        </div>
      </div>

      {/* Outreach placeholder modal */}
      {outreachOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/20 z-[60]" onClick={() => setOutreachOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[90vw] bg-card border border-border rounded-md p-5 z-[61] animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Security Outreach Draft</p>
              <button onClick={() => setOutreachOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Subject: Exploring {play.packName} — Security & Governance Alignment</p>
              <p>Dear [CISO / Security Lead],</p>
              <p>We are evaluating an engagement around <span className="font-medium text-foreground">{play.packName}</span> and would value your input on security requirements, compliance considerations, and governance alignment.</p>
              <p>Would you be available for a 30-minute alignment session this week?</p>
              <p className="text-muted-foreground/60 italic mt-2">This is a placeholder template. Customize before sending.</p>
            </div>
            <button
              onClick={() => setOutreachOpen(false)}
              className="mt-4 w-full px-3 py-2 rounded text-xs font-medium border border-border text-foreground hover:bg-muted/40 transition-colors"
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}
