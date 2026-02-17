// Partner-only propensity scoring engine for Deal Planning Recommended Plays
// Deterministic, explainable, uses ONLY promoted items

import type { PromotedSignal } from '@/data/partner/dealPlanStore';

// ============= Types =============

export interface PropensityInput {
  promotedSignals: PromotedSignal[];
  engagementType: 'new_logo' | 'existing_customer' | null;
  motion: string | null;
  strategyPillars?: string[];
  initiatives?: string[];
  trends?: string[];
  readinessScore?: number | null;
}

export interface ScoredPlay {
  packId: string;
  packName: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  drivers: string[];
  gaps: string[];
  engagementFitPct: number;
}

interface PackLike {
  id: string;
  name: string;
  tags: string[];
  bias: 'new_logo' | 'existing_customer' | null;
  motionFit: string[];
  prerequisites: string[];
}

// ============= Scoring =============

function extractSignalTags(signals: PromotedSignal[]): string[] {
  const tags: string[] = [];
  for (const s of signals) {
    // Use signal type as tag
    if (s.snapshot.type) tags.push(s.snapshot.type);
    // Extract keywords from title for tag matching
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

function computeConfidence(
  input: PropensityInput,
): 'High' | 'Medium' | 'Low' {
  const hasPromoted = input.promotedSignals.length >= 2;
  const hasContext =
    (input.strategyPillars?.length ?? 0) > 0 ||
    (input.initiatives?.length ?? 0) > 0 ||
    (input.trends?.length ?? 0) > 0;

  if (hasPromoted && hasContext) return 'High';
  if (input.promotedSignals.length >= 1) return 'Medium';
  return 'Low';
}

export function scorePlayPacks<T extends PackLike>(
  packs: T[],
  input: PropensityInput,
): ScoredPlay[] {
  const signalTags = extractSignalTags(input.promotedSignals);
  const confidence = computeConfidence(input);
  const pillars = input.strategyPillars ?? [];
  const initiatives = input.initiatives ?? [];
  const trends = input.trends ?? [];

  const results: ScoredPlay[] = [];

  for (const pack of packs) {
    let score = 0;
    const drivers: string[] = [];
    const gaps: string[] = [];

    // A) Signal tag alignment (40%)
    const tagOverlap = pack.tags.filter((t) => signalTags.includes(t)).length;
    const tagScore = pack.tags.length > 0
      ? Math.round((tagOverlap / pack.tags.length) * 40)
      : 0;
    score += tagScore;
    if (tagOverlap > 0) drivers.push(`${tagOverlap} signal tag${tagOverlap > 1 ? 's' : ''} aligned`);
    if (tagOverlap === 0 && input.promotedSignals.length > 0) gaps.push('No signal tag overlap');

    // B) Strategy pillar alignment (25%)
    const pillarOverlap = pack.tags.filter((t) =>
      pillars.some((p) => p.toLowerCase().includes(t.replace(/_/g, ' ')))
    ).length;
    const pillarScore = pillars.length > 0
      ? Math.round((Math.min(pillarOverlap, 2) / 2) * 25)
      : 12; // neutral if no pillars
    score += pillarScore;
    if (pillarOverlap > 0) {
      const matchedPillar = pillars.find((p) => pack.tags.some((t) => p.toLowerCase().includes(t.replace(/_/g, ' '))));
      drivers.push(matchedPillar ? `Pillar: "${matchedPillar.slice(0, 50)}"` : 'Strategy pillar alignment');
    }
    if (pillars.length > 0 && pillarOverlap === 0) gaps.push('No strategy pillar match');

    // C) Initiative alignment (20%)
    const initOverlap = pack.tags.filter((t) =>
      initiatives.some((i) => i.toLowerCase().includes(t.replace(/_/g, ' ')))
    ).length;
    const initScore = initiatives.length > 0
      ? Math.round((Math.min(initOverlap, 2) / 2) * 20)
      : 10; // neutral
    score += initScore;
    if (initOverlap > 0) {
      const matchedInit = initiatives.find((i) => pack.tags.some((t) => i.toLowerCase().includes(t.replace(/_/g, ' '))));
      drivers.push(matchedInit ? `Initiative: "${matchedInit.slice(0, 50)}"` : 'Initiative alignment');
    }

    // C2) Trend alignment (bonus within the 20% bucket — additive context)
    const trendOverlap = pack.tags.filter((t) =>
      trends.some((tr) => tr.toLowerCase().includes(t.replace(/_/g, ' ')))
    ).length;
    if (trendOverlap > 0) {
      score += Math.min(trendOverlap * 3, 10); // small boost, capped
      const matchedTrend = trends.find((tr) => pack.tags.some((t) => tr.toLowerCase().includes(t.replace(/_/g, ' '))));
      drivers.push(matchedTrend ? `Trend: "${matchedTrend.slice(0, 50)}"` : 'Industry trend alignment');
    }

    // D) Readiness feasibility (15%)
    if (input.readinessScore != null) {
      const readinessNorm = Math.round((Math.min(input.readinessScore, 100) / 100) * 15);
      score += readinessNorm;
      if (input.readinessScore >= 60) drivers.push('Strong readiness score');
      if (input.readinessScore < 40) gaps.push('Low readiness score');
    } else {
      score += 8; // neutral
    }

    // E) Engagement type modifier
    if (input.engagementType === 'new_logo') {
      const isDiscovery = pack.tags.some((t) => ['ai_readiness', 'discovery'].includes(t));
      const isAdvanced = pack.tags.some((t) => ['cloud_ops', 'finops'].includes(t));
      if (isDiscovery) { score += 10; drivers.push('Discovery-fit for new logo'); }
      if (isAdvanced) { score -= 10; gaps.push('Advanced pack — less suited for new logo'); }
    } else if (input.engagementType === 'existing_customer') {
      const isExpansion = pack.tags.some((t) => ['cloud_ops', 'adoption_change', 'm365_copilot', 'finops'].includes(t));
      if (isExpansion) { score += 10; drivers.push('Expansion-fit for existing customer'); }
    }

    // F) Bias alignment
    if (pack.bias && pack.bias === input.engagementType) {
      score += 5;
    } else if (pack.bias && pack.bias !== input.engagementType && input.engagementType) {
      score -= 5;
    }

    // G) Motion fit
    if (input.motion && pack.motionFit.includes(input.motion)) {
      score += 5;
      drivers.push(`Fits "${input.motion}" motion`);
    } else if (input.motion && !pack.motionFit.includes(input.motion)) {
      gaps.push(`Not optimized for "${input.motion}" motion`);
    }

    // Prerequisites as gaps if no signal context
    if (input.promotedSignals.length === 0 && pack.prerequisites.length > 0) {
      gaps.push(`Requires: ${pack.prerequisites[0]}`);
    }

    // Clamp
    score = Math.max(0, Math.min(100, score));

    results.push({
      packId: pack.id,
      packName: pack.name,
      score,
      confidence,
      drivers: drivers.slice(0, 3),
      gaps: gaps.slice(0, 3),
      engagementFitPct: score,
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
