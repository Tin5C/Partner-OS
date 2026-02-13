// Service Pack Scoring Config — deterministic recommendation engine
// Version: service_pack_scoring_v1

export const servicePackScoringConfig = {
  version: 'service_pack_scoring_v1',
  thresholds: {
    minScoreToShow: 40,
    maxPacksToRecommend: 3,
    hardExcludeIfCapabilityMissing: true,
  },
  tag_taxonomy: [
    'ai_readiness',
    'ai_governance',
    'rag_agents',
    'data_platform',
    'security_identity',
    'm365_copilot',
    'finops',
    'adoption_change',
    'cloud_ops',
    'app_modernization',
  ] as const,
  mode_tag_weights: {
    'Discovery / Qualification': {
      ai_readiness: 20,
      ai_governance: 10,
      data_platform: 10,
      m365_copilot: 5,
    },
    'Architecture & Technical Validation': {
      rag_agents: 20,
      data_platform: 15,
      security_identity: 5,
      cloud_ops: 5,
    },
    'Security / Governance Review': {
      ai_governance: 20,
      security_identity: 15,
      finops: 5,
    },
    'Commercial / Procurement': {
      finops: 15,
      adoption_change: 10,
      ai_governance: 5,
    },
    'Delivery / Adoption': {
      adoption_change: 20,
      cloud_ops: 10,
      m365_copilot: 10,
    },
    'Competitive Takeout / Defense': {
      ai_governance: 10,
      security_identity: 10,
      data_platform: 10,
      finops: 10,
    },
  } as Record<string, Record<string, number>>,
  trigger_boosts: {
    'Customer request': { ai_readiness: 10, m365_copilot: 10 },
    'RFP / Tender': { ai_governance: 5, data_platform: 5, security_identity: 5 },
    'Competitive pressure': { finops: 10, ai_governance: 10 },
    'Vendor push': { m365_copilot: 10, data_platform: 5 },
    'Renewal / Expansion': { cloud_ops: 10, adoption_change: 10 },
    'Incident / Risk': { security_identity: 10, ai_governance: 10 },
    'Internal growth target': { ai_readiness: 5, data_platform: 5, finops: 5 },
  } as Record<string, Record<string, number>>,
  vendor_posture_boosts: {
    'Microsoft-first': { m365_copilot: 5, security_identity: 3, data_platform: 2 },
    'Vendor-neutral': {},
    'Mixed': { data_platform: 3, security_identity: 2 },
  } as Record<string, Record<string, number>>,
  capability_scoring: {
    Strong: 20,
    Recognized: 15,
    Some: 8,
    None: -50,
  } as Record<string, number>,
  capability_requirement_rule: {
    minLevel: 'Some' as string,
    excludeIfBelowMinLevel: true,
  },
  proof_bonus: {
    none: 0,
    oneAsset: 5,
    twoOrMoreAssets: 10,
  },
  completeness_bonus: {
    hasPricingBand: 3,
    hasDurationBand: 2,
  },
  signal_tag_bonus: {
    perOverlappingTag: 3,
    max: 10,
  },
  explanations: {
    maxBullets: 3,
  },
} as const;

export type PackTag = (typeof servicePackScoringConfig.tag_taxonomy)[number];
export type CapabilityLevel = 'Strong' | 'Recognized' | 'Some' | 'None';
