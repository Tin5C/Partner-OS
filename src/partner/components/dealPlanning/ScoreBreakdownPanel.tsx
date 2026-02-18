// ScoreBreakdownPanel — consolidated explainability panel for a Recommended Play
// Shows Drivers Referenced, Context, Rule Hits, Final Score, and Confidence guidance

import { useState } from 'react';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';
import type { ScoredPlay } from '@/partner/lib/dealPlanning/propensity';

// ============= Types =============

interface BreakdownStep {
  label: string;
  value: number;
  detail?: string;
}

interface ScoreBreakdown {
  context: { type: string | null; motion: string | null };
  signalCount: number;
  signalTitles: string[];
  initiativeCount: number;
  initiativeTitles: string[];
  trendCount: number;
  trendTitles: string[];
  steps: BreakdownStep[];
  base: number;
  boosts: number;
  penalties: number;
  final: number;
  confidence: string;
}

// ============= Breakdown Builder =============

function extractSignalTags(signals: PromotedSignal[]): string[] {
  const tags: string[] = [];
  for (const s of signals) {
    if (s.snapshot.type) tags.push(s.snapshot.type);
    const title = s.snapshot.title?.toLowerCase() ?? '';
    if (title.includes('ai') || title.includes('copilot')) tags.push('ai_readiness');
    if (title.includes('governance') || title.includes('compliance')) tags.push('ai_governance');
    if (title.includes('security') || title.includes('identity')) tags.push('security_identity');
    if (title.includes('data') || title.includes('platform')) tags.push('data_platform');
    if (title.includes('finops') || title.includes('cost')) tags.push('finops');
    if (title.includes('copilot') || title.includes('m365')) tags.push('m365_copilot');
    if (title.includes('rag') || title.includes('agent')) tags.push('rag_agents');
    if (title.includes('cloud') || title.includes('ops')) tags.push('cloud_ops');
    if (title.includes('adoption') || title.includes('change')) tags.push('adoption_change');
  }
  return [...new Set(tags)];
}

interface PackInfo {
  tags: string[];
  bias: 'new_logo' | 'existing_customer' | null;
  motionFit: string[];
  prerequisites: string[];
}

export function buildBreakdown(
  play: ScoredPlay,
  pack: PackInfo,
  promotedSignals: PromotedSignal[],
  engagementType: 'new_logo' | 'existing_customer' | null,
  motion: string | null,
  readinessScore: number | null | undefined,
  initiatives: string[],
  trends: string[],
): ScoreBreakdown {
  const signalTags = extractSignalTags(promotedSignals);
  const steps: BreakdownStep[] = [];

  const tagOverlap = pack.tags.filter((t) => signalTags.includes(t)).length;
  const tagScore = pack.tags.length > 0 ? Math.round((tagOverlap / pack.tags.length) * 40) : 0;
  steps.push({ label: 'Signal tag alignment (40%)', value: tagScore, detail: `${tagOverlap}/${pack.tags.length} tags matched` });

  const pillarOverlap = pack.tags.filter((t) =>
    initiatives.some((p) => p.toLowerCase().includes(t.replace(/_/g, ' ')))
  ).length;
  const pillarScore = initiatives.length > 0 ? Math.round((Math.min(pillarOverlap, 2) / 2) * 25) : 12;
  steps.push({ label: 'Initiative/pillar alignment (25%)', value: pillarScore, detail: initiatives.length > 0 ? `${pillarOverlap} overlap` : 'Neutral (no data)' });

  const initOverlap = pack.tags.filter((t) =>
    initiatives.some((i) => i.toLowerCase().includes(t.replace(/_/g, ' ')))
  ).length;
  const initScore = initiatives.length > 0 ? Math.round((Math.min(initOverlap, 2) / 2) * 20) : 10;
  steps.push({ label: 'Initiative detail alignment (20%)', value: initScore, detail: initiatives.length > 0 ? `${initOverlap} overlap` : 'Neutral (no data)' });

  const trendOverlap = pack.tags.filter((t) =>
    trends.some((tr) => tr.toLowerCase().includes(t.replace(/_/g, ' ')))
  ).length;
  const trendBoost = Math.min(trendOverlap * 3, 10);
  if (trendOverlap > 0) {
    steps.push({ label: 'Trend alignment boost', value: trendBoost, detail: `${trendOverlap} trend(s) matched` });
  }

  let readinessVal = 8;
  if (readinessScore != null) {
    readinessVal = Math.round((Math.min(readinessScore, 100) / 100) * 15);
  }
  steps.push({ label: 'Readiness feasibility (15%)', value: readinessVal, detail: readinessScore != null ? `Score: ${readinessScore}` : 'Neutral (no data)' });

  let typeModifier = 0;
  let typeDetail = '';
  if (engagementType === 'new_logo') {
    const isDiscovery = pack.tags.some((t) => ['ai_readiness', 'discovery'].includes(t));
    const isAdvanced = pack.tags.some((t) => ['cloud_ops', 'finops'].includes(t));
    if (isDiscovery) { typeModifier += 10; typeDetail = 'Discovery-fit for new logo (+10)'; }
    if (isAdvanced) { typeModifier -= 10; typeDetail = 'Advanced pack penalty for new logo (-10)'; }
  } else if (engagementType === 'existing_customer') {
    const isExpansion = pack.tags.some((t) => ['cloud_ops', 'adoption_change', 'm365_copilot', 'finops'].includes(t));
    if (isExpansion) { typeModifier += 10; typeDetail = 'Expansion-fit for existing customer (+10)'; }
  }
  if (typeModifier !== 0) {
    steps.push({ label: 'Type/Motion fit', value: typeModifier, detail: typeDetail });
  }

  let biasVal = 0;
  if (pack.bias && pack.bias === engagementType) biasVal = 5;
  else if (pack.bias && pack.bias !== engagementType && engagementType) biasVal = -5;
  if (biasVal !== 0) {
    steps.push({ label: 'Pack bias alignment', value: biasVal, detail: biasVal > 0 ? 'Matches engagement type' : 'Mismatched engagement type' });
  }

  let motionVal = 0;
  if (motion && pack.motionFit.includes(motion)) {
    motionVal = 5;
    steps.push({ label: 'Motion fit bonus', value: 5, detail: `Fits "${motion}"` });
  } else if (motion && !pack.motionFit.includes(motion)) {
    steps.push({ label: 'Motion fit', value: 0, detail: `Not optimized for "${motion}"` });
  }

  const base = tagScore + pillarScore + initScore + readinessVal;
  const boosts = (trendOverlap > 0 ? trendBoost : 0) + Math.max(typeModifier, 0) + Math.max(biasVal, 0) + motionVal;
  const penalties = Math.abs(Math.min(typeModifier, 0)) + Math.abs(Math.min(biasVal, 0));

  return {
    context: { type: engagementType, motion },
    signalCount: promotedSignals.length,
    signalTitles: promotedSignals.map((s) => s.snapshot.title ?? s.signalId),
    initiativeCount: initiatives.length,
    initiativeTitles: initiatives,
    trendCount: trends.length,
    trendTitles: trends,
    steps,
    base,
    boosts,
    penalties,
    final: play.engagementFitPct,
    confidence: play.confidence,
  };
}

// ============= Helper: render titled list with cap =============

function TitledList({ items, max = 4 }: { items: string[]; max?: number }) {
  if (items.length === 0) return <p className="text-muted-foreground ml-2">None selected</p>;
  const visible = items.slice(0, max);
  const remaining = items.length - max;
  return (
    <>
      {visible.map((t, i) => (
        <p key={i} className="text-muted-foreground leading-snug ml-2">· {t}</p>
      ))}
      {remaining > 0 && (
        <p className="text-muted-foreground ml-2">+{remaining} more</p>
      )}
    </>
  );
}

// ============= Section heading =============

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">{children}</p>
  );
}

// ============= Component =============

interface ScoreBreakdownPanelProps {
  play: ScoredPlay;
  packTags: string[];
  packBias: 'new_logo' | 'existing_customer' | null;
  packMotionFit: string[];
  packPrerequisites: string[];
  promotedSignals: PromotedSignal[];
  engagementType: 'new_logo' | 'existing_customer' | null;
  motion: string | null;
  readinessScore: number | null | undefined;
  initiatives: string[];
  trends: string[];
  allInitiativeCount?: number;
  allTrendCount?: number;
  selectedInitiativeCount?: number;
  selectedTrendCount?: number;
}

export function ScoreBreakdownPanel(props: ScoreBreakdownPanelProps) {
  const [open, setOpen] = useState(false);

  const bd = open
    ? buildBreakdown(
        props.play,
        { tags: props.packTags, bias: props.packBias, motionFit: props.packMotionFit, prerequisites: props.packPrerequisites },
        props.promotedSignals,
        props.engagementType,
        props.motion,
        props.readinessScore,
        props.initiatives,
        props.trends,
      )
    : null;

  return (
    <div className="pt-0.5">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        {open ? 'Hide score breakdown' : 'Explain score'}
      </button>

      {open && bd && (
        <div className="mt-2 border-t border-border/40 pt-2 space-y-2.5 text-[10px]">

          {/* A) Drivers Referenced */}
          <div className="space-y-1">
            <SectionTitle>Drivers Referenced</SectionTitle>
            <div className="space-y-0.5">
              <p className="text-muted-foreground font-medium">Signals: {bd.signalCount}</p>
              <TitledList items={bd.signalTitles} />
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground font-medium">
                Initiatives: {props.selectedInitiativeCount && props.selectedInitiativeCount > 0
                  ? `${props.selectedInitiativeCount} selected`
                  : `Using all (${bd.initiativeCount})`}
              </p>
              <TitledList items={bd.initiativeTitles} />
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground font-medium">
                Trends: {props.selectedTrendCount && props.selectedTrendCount > 0
                  ? `${props.selectedTrendCount} selected`
                  : `Using all (${bd.trendCount})`}
              </p>
              <TitledList items={bd.trendTitles} />
            </div>
          </div>

          <div className="border-t border-border/30" />

          {/* B) Context */}
          <div className="space-y-0.5">
            <SectionTitle>Context</SectionTitle>
            <p className="text-muted-foreground">Type: {bd.context.type ?? 'not set'}</p>
            <p className="text-muted-foreground">Motion: {bd.context.motion ?? 'not set'}</p>
          </div>

          <div className="border-t border-border/30" />

          {/* C) Rule Hits */}
          <div className="space-y-0.5">
            <SectionTitle>Rule Hits</SectionTitle>
            {bd.steps.map((step, i) => (
              <p key={i} className="text-muted-foreground leading-snug">
                <span className="font-medium">{step.value >= 0 ? '+' : ''}{step.value}</span>{' '}
                {step.label}{step.detail ? ` — ${step.detail}` : ''}
              </p>
            ))}
          </div>

          <div className="border-t border-border/30" />

          {/* D) Final Score Summary */}
          <div className="space-y-0.5">
            <SectionTitle>Final Score</SectionTitle>
            <p className="text-muted-foreground">Base: {bd.base}</p>
            <p className="text-muted-foreground">Boosts: +{bd.boosts}</p>
            <p className="text-muted-foreground">Penalties: -{bd.penalties}</p>
            <p className="text-foreground font-medium">Fit Score: {bd.final}% · {bd.confidence}</p>
          </div>

          <div className="border-t border-border/30" />

          {/* E) What Increases Confidence */}
          <div className="space-y-0.5">
            <SectionTitle>What Increases Confidence</SectionTitle>
            <p className="text-muted-foreground leading-snug ml-2">· Add relevant account signals</p>
            <p className="text-muted-foreground leading-snug ml-2">· Confirm executive sponsor</p>
            <p className="text-muted-foreground leading-snug ml-2">· Validate stakeholder coverage</p>
            <p className="text-muted-foreground leading-snug ml-2">· Attach proof artifacts</p>
          </div>
        </div>
      )}
    </div>
  );
}
