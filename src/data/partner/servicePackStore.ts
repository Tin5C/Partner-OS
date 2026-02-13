// Service Pack Store — deterministic recommendation engine (v2)
// Uses servicePackScoringConfig for all weights and thresholds.

import type { EngagementMode } from '@/components/partner/DealPlanMetadata';
import {
  servicePackScoringConfig as cfg,
  type PackTag,
  type CapabilityLevel,
} from './servicePackScoringConfig';

// ============= Types =============

export interface ServicePack {
  id: string;
  name: string;
  description: string;
  tags: PackTag[];
  delivery_model: 'Workshop' | 'Sprint' | 'Managed' | 'Advisory' | 'Assessment';
  duration_band: string;
  pricing_band: string;
  proof_assets: string[];
  required_capabilities: PackTag[];
}

export interface ScoredPack {
  pack: ServicePack;
  score: number;
  rationale: string;
  why_recommended: string[];
}

// ============= Seed Packs =============

export const SERVICE_PACKS: ServicePack[] = [
  {
    id: 'sp-ai-readiness',
    name: 'AI Readiness Assessment',
    description: 'Evaluate organizational readiness for AI adoption across governance, data, and infrastructure.',
    tags: ['ai_readiness', 'ai_governance', 'data_platform'],
    delivery_model: 'Assessment',
    duration_band: '2–4 weeks',
    pricing_band: 'CHF 15K–30K',
    proof_assets: ['AI Maturity Framework', 'Governance Checklist', 'Readiness Scorecard'],
    required_capabilities: ['ai_readiness'],
  },
  {
    id: 'sp-copilot-activation',
    name: 'Copilot Activation Sprint',
    description: 'Deploy M365 Copilot for a pilot user group with governance guardrails and adoption metrics.',
    tags: ['m365_copilot', 'adoption_change', 'ai_governance'],
    delivery_model: 'Sprint',
    duration_band: '4–6 weeks',
    pricing_band: 'CHF 25K–50K',
    proof_assets: ['Copilot ROI Model', 'Adoption Dashboard Template', 'Data Classification Guide'],
    required_capabilities: ['m365_copilot', 'ai_governance'],
  },
  {
    id: 'sp-architecture-workshop',
    name: 'Azure Architecture Workshop',
    description: 'Design target-state cloud architecture aligned to compliance requirements and AI workloads.',
    tags: ['cloud_ops', 'data_platform', 'security_identity'],
    delivery_model: 'Workshop',
    duration_band: '1–2 weeks',
    pricing_band: 'CHF 10K–20K',
    proof_assets: ['Reference Architecture', 'Swiss Compliance Matrix', 'Migration Roadmap'],
    required_capabilities: ['cloud_ops'],
  },
  {
    id: 'sp-security-review',
    name: 'Security & Governance Review',
    description: 'Assess AI governance posture, data residency compliance, and RACI alignment.',
    tags: ['security_identity', 'ai_governance', 'finops'],
    delivery_model: 'Advisory',
    duration_band: '2–3 weeks',
    pricing_band: 'CHF 20K–35K',
    proof_assets: ['RACI Template', 'Data Residency Posture Map', 'Governance Maturity Assessment'],
    required_capabilities: ['security_identity', 'ai_governance'],
  },
  {
    id: 'sp-competitive-displacement',
    name: 'Competitive Displacement Sprint',
    description: 'Position Microsoft stack against incumbent cloud/AI vendors with proof-based objection handling.',
    tags: ['ai_governance', 'security_identity', 'data_platform', 'finops'],
    delivery_model: 'Sprint',
    duration_band: '3–4 weeks',
    pricing_band: 'CHF 20K–40K',
    proof_assets: ['Competitive Battle Card', 'TCO Comparison Model', 'Migration Risk Assessment'],
    required_capabilities: ['data_platform'],
  },
  {
    id: 'sp-finops-ai',
    name: 'FinOps for AI Workloads',
    description: 'Establish cost governance framework for AI consumption with forecasting and optimization.',
    tags: ['finops', 'ai_governance', 'cloud_ops'],
    delivery_model: 'Advisory',
    duration_band: '2–3 weeks',
    pricing_band: 'CHF 15K–25K',
    proof_assets: ['FinOps Framework', 'AI Cost Forecasting Model', 'Optimization Playbook'],
    required_capabilities: ['finops'],
  },
  {
    id: 'sp-rag-agents',
    name: 'RAG & AI Agents Sprint',
    description: 'Build retrieval-augmented generation pipeline with agentic orchestration for enterprise use cases.',
    tags: ['rag_agents', 'data_platform', 'ai_governance'],
    delivery_model: 'Sprint',
    duration_band: '4–8 weeks',
    pricing_band: 'CHF 40K–80K',
    proof_assets: ['RAG Reference Architecture', 'Agent Orchestration Pattern', 'Evaluation Framework'],
    required_capabilities: ['rag_agents', 'data_platform'],
  },
  {
    id: 'sp-adoption-change',
    name: 'Adoption & Change Management',
    description: 'Drive user adoption for AI/cloud rollouts with structured change management and training.',
    tags: ['adoption_change', 'm365_copilot', 'cloud_ops'],
    delivery_model: 'Managed',
    duration_band: '6–12 weeks',
    pricing_band: 'CHF 30K–60K',
    proof_assets: ['Change Readiness Assessment', 'Training Curriculum Template', 'Adoption Metrics Dashboard'],
    required_capabilities: ['adoption_change'],
  },
];

// ============= Scoring Engine =============

export interface ScoringInput {
  mode: EngagementMode | null;
  trigger: string | null;
  vendorPosture?: string | null;
  partnerCapabilities?: Record<string, CapabilityLevel>;
  signalTags?: string[];
}

function computePackScore(pack: ServicePack, input: ScoringInput): ScoredPack | null {
  const { mode, trigger, vendorPosture, partnerCapabilities, signalTags } = input;
  let score = 0;
  const reasons: string[] = [];

  // A) Mode tag weights (0–40)
  if (mode) {
    const weights = cfg.mode_tag_weights[mode] ?? {};
    let modeTotal = 0;
    for (const tag of pack.tags) {
      modeTotal += weights[tag] ?? 0;
    }
    modeTotal = Math.min(40, modeTotal);
    score += modeTotal;
    if (modeTotal > 0) reasons.push(`Aligned to ${mode} engagement`);
  }

  // B) Trigger boost (0–15)
  if (trigger) {
    const boosts = cfg.trigger_boosts[trigger] ?? {};
    let triggerTotal = 0;
    for (const tag of pack.tags) {
      triggerTotal += boosts[tag] ?? 0;
    }
    triggerTotal = Math.min(15, triggerTotal);
    score += triggerTotal;
    if (triggerTotal > 0) reasons.push(`Matches "${trigger}" trigger`);
  }

  // C) Vendor posture boost (0–10)
  if (vendorPosture) {
    const vBoosts = cfg.vendor_posture_boosts[vendorPosture] ?? {};
    let vTotal = 0;
    for (const tag of pack.tags) {
      vTotal += vBoosts[tag] ?? 0;
    }
    vTotal = Math.min(10, vTotal);
    score += vTotal;
    if (vTotal > 0) reasons.push(`Fits ${vendorPosture} vendor posture`);
  }

  // D) Capability feasibility (0–20 or exclude)
  if (partnerCapabilities && pack.required_capabilities.length > 0) {
    let capTotal = 0;
    let excluded = false;
    for (const reqCap of pack.required_capabilities) {
      const level = partnerCapabilities[reqCap] ?? 'None';
      const capScore = cfg.capability_scoring[level] ?? -50;
      if (cfg.capability_requirement_rule.excludeIfBelowMinLevel && level === 'None') {
        excluded = true;
        break;
      }
      capTotal += capScore;
    }
    if (excluded && cfg.thresholds.hardExcludeIfCapabilityMissing) return null;
    capTotal = Math.min(20, Math.max(0, Math.round(capTotal / pack.required_capabilities.length)));
    score += capTotal;
    if (capTotal >= 15) reasons.push('Required capabilities available');
  } else {
    // No capability data — assume met
    score += 20;
    reasons.push('Capability requirements assumed met');
  }

  // E) Proof availability bonus (0–10)
  const proofCount = pack.proof_assets.length;
  if (proofCount >= 2) {
    score += cfg.proof_bonus.twoOrMoreAssets;
    reasons.push('Proof materials included');
  } else if (proofCount === 1) {
    score += cfg.proof_bonus.oneAsset;
  }

  // F) Completeness bonus (0–5)
  if (pack.pricing_band) score += cfg.completeness_bonus.hasPricingBand;
  if (pack.duration_band) score += cfg.completeness_bonus.hasDurationBand;

  // G) Signal tag overlap bonus (0–10)
  if (signalTags && signalTags.length > 0) {
    const overlap = pack.tags.filter((t) => signalTags.includes(t)).length;
    const sigBonus = Math.min(cfg.signal_tag_bonus.max, overlap * cfg.signal_tag_bonus.perOverlappingTag);
    score += sigBonus;
    if (sigBonus > 0) reasons.push('Matches attached signal context');
  }

  const rationale = reasons.length > 0
    ? reasons[0]
    : 'General fit based on evidence readiness';

  return {
    pack,
    score,
    rationale,
    why_recommended: reasons.slice(0, cfg.explanations.maxBullets),
  };
}

export function scoreServicePacks(input: ScoringInput): ScoredPack[] {
  const results: ScoredPack[] = [];

  for (const pack of SERVICE_PACKS) {
    const scored = computePackScore(pack, input);
    if (scored && scored.score >= cfg.thresholds.minScoreToShow) {
      results.push(scored);
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, cfg.thresholds.maxPacksToRecommend);
}
