// Service Pack Store — deterministic recommendation engine (v2)
// Uses servicePackScoringConfig for weights/thresholds.
// Uses partner_service_configuration for seed packs and capabilities.

import type { EngagementMode } from '@/components/partner/DealPlanMetadata';
import {
  servicePackScoringConfig as cfg,
  type PackTag,
  type CapabilityLevel,
} from './servicePackScoringConfig';
import {
  partner_service_configuration,
  type PartnerServicePack,
  type ProofAsset,
} from './partnerServiceConfiguration';

// ============= Types =============

export interface ServicePack {
  id: string;
  name: string;
  description: string;
  tags: PackTag[];
  delivery_model: string;
  duration_band: string;
  pricing_band: string;
  proof_assets: ProofAsset[];
  required_capabilities: string[];
}

export interface ScoredPack {
  pack: ServicePack;
  score: number;
  rationale: string;
  why_recommended: string[];
}

// ============= Service Packs (from seed config) =============

export const SERVICE_PACKS: ServicePack[] = partner_service_configuration.service_packs;

// ============= Scoring Engine =============

export interface ScoringInput {
  mode: EngagementMode | null;
  trigger: string | null;
  vendorPosture?: string | null;
  partnerCapabilities?: Record<string, CapabilityLevel>;
  signalTags?: string[];
}

/**
 * Resolve capability level for a required capability name.
 * Looks up the human-readable name in partner capabilities map.
 */
function resolveCapabilityLevel(
  capName: string,
  capabilities: Record<string, CapabilityLevel>,
): CapabilityLevel {
  // Direct match
  if (capabilities[capName]) return capabilities[capName];
  // Case-insensitive fallback
  const key = Object.keys(capabilities).find(
    (k) => k.toLowerCase() === capName.toLowerCase(),
  );
  return key ? capabilities[key] : 'None';
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
      const level = resolveCapabilityLevel(reqCap, partnerCapabilities);
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
