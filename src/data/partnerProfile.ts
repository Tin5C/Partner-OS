// Partner Profile — Commercial Baseline
// Data model, seed data, and helpers for partner capability & monetization profile

// ============= Types =============

export type ServiceType = 'managed-service' | 'advisory' | 'implementation';
export type ContractLength = '1-3mo' | '3-6mo' | '12mo+';
export type AttachScale = 'none' | 'low' | 'medium' | 'high';
export type CapabilityLevel = 0 | 1 | 2 | 3;
export type CapacitySignal = 'constrained' | 'balanced' | 'available';
export type DeliveryModelPref = 'fixed-price' | 'time-materials' | 'hybrid';
export type RiskAppetite = 'conservative' | 'balanced' | 'experimental';
export type VendorPosture = 'microsoft-first' | 'vendor-neutral' | 'mixed';
export type RevenueMixType = 'mostly-project' | 'balanced' | 'mostly-managed';

// Vendor Posture types
export type VendorPreferencePriority = 1 | 2 | 3;
export type VendorPreferenceReason = 'alliance' | 'delivery' | 'commercials' | 'demand' | 'other';
export type VendorMaturityLevel = 'exploring' | 'delivering' | 'expert';
export type VendorDisallowReason = 'compliance' | 'legal' | 'strategy' | 'bad-experience' | 'other';

export interface VendorPreference {
  vendorId: string;
  priority: VendorPreferencePriority;
  reason: VendorPreferenceReason;
}

export interface VendorCurrentEntry {
  vendorId: string;
  maturity: VendorMaturityLevel;
}

export interface VendorDisallowedEntry {
  vendorId: string;
  reason: VendorDisallowReason;
}

export interface VendorPostureConfig {
  preferredVendors: VendorPreference[];
  currentVendors: VendorCurrentEntry[];
  disallowedVendors: VendorDisallowedEntry[];
}

export interface ExistingService {
  id: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  contractLength: ContractLength;
  pricingBand?: string;
  regions?: string[];
  industries?: string[];
}

export interface AttachSurface {
  key: string;
  label: string;
  scale: AttachScale;
}

export interface CapabilityDimension {
  key: string;
  label: string;
  level: CapabilityLevel;
}

export interface PartnerProfile {
  // 1) Existing service catalog
  services: ExistingService[];

  // 2) Attach surface areas
  attachSurfaces: AttachSurface[];

  // 3) Delivery capability levels
  capabilities: CapabilityDimension[];

  // 4) Capacity signal
  capacity: CapacitySignal;
  capacityNotes: string;

  // 5) Commercial preferences
  deliveryModel: DeliveryModelPref;
  minimumRetainer?: string;
  riskAppetite: RiskAppetite;
  verticalFocus: string[];
  vendorPosture: VendorPosture;

  // 6) Revenue mix
  revenueMix: RevenueMixType;
  topServiceLines: string[];

  // 7) Vendor posture (admin-confirmed)
  vendorPostureConfig: VendorPostureConfig;

  updatedAt: string;
}

// ============= Constants =============

export const ATTACH_SURFACE_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'm365', label: 'M365' },
  { key: 'security-soc', label: 'Security / SOC services' },
  { key: 'data-platform', label: 'Data platform managed services' },
  { key: 'cloud-ops', label: 'Cloud ops / managed cloud' },
  { key: 'app-modernization', label: 'App modernization' },
  { key: 'contact-center', label: 'Contact center / CX platforms' },
  { key: 'erp-lob', label: 'ERP / Line-of-business integrations' },
];

export const CAPABILITY_DIMENSIONS: Array<{ key: string; label: string }> = [
  { key: 'governance-risk', label: 'Governance & Risk' },
  { key: 'security-identity', label: 'Security & Identity' },
  { key: 'data-engineering', label: 'Data Engineering & Data Readiness' },
  { key: 'architecture-rag-agents', label: 'Architecture (RAG / Agents patterns)' },
  { key: 'mlops-observability', label: 'MLOps-lite / Observability / Evals' },
  { key: 'finops-ai', label: 'FinOps for AI' },
  { key: 'adoption-change', label: 'Adoption / Change management' },
];

export const CAPABILITY_LEVEL_LABELS: Record<CapabilityLevel, string> = {
  0: 'None',
  1: 'Some',
  2: 'Strong',
  3: 'Recognized',
};

export const SCALE_LABELS: Record<AttachScale, string> = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'managed-service': 'Managed Service',
  advisory: 'Advisory',
  implementation: 'Implementation',
};

export const CONTRACT_LENGTH_LABELS: Record<ContractLength, string> = {
  '1-3mo': '1–3 months',
  '3-6mo': '3–6 months',
  '12mo+': '12+ months',
};

export const CAPACITY_LABELS: Record<CapacitySignal, string> = {
  constrained: 'Constrained',
  balanced: 'Balanced',
  available: 'Available',
};

export const DELIVERY_MODEL_LABELS: Record<DeliveryModelPref, string> = {
  'fixed-price': 'Fixed price',
  'time-materials': 'T&M',
  hybrid: 'Hybrid',
};

export const RISK_LABELS: Record<RiskAppetite, string> = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  experimental: 'Experimental',
};

export const VENDOR_POSTURE_LABELS: Record<VendorPosture, string> = {
  'microsoft-first': 'Microsoft-first',
  'vendor-neutral': 'Vendor-neutral',
  mixed: 'Mixed',
};

export const REVENUE_MIX_LABELS: Record<RevenueMixType, string> = {
  'mostly-project': 'Mostly project',
  balanced: 'Balanced',
  'mostly-managed': 'Mostly managed',
};

export const VENDOR_PREFERENCE_REASON_LABELS: Record<VendorPreferenceReason, string> = {
  alliance: 'Alliance',
  delivery: 'Delivery',
  commercials: 'Commercials',
  demand: 'Demand',
  other: 'Other',
};

export const VENDOR_MATURITY_LEVEL_LABELS: Record<VendorMaturityLevel, string> = {
  exploring: 'Exploring',
  delivering: 'Delivering',
  expert: 'Expert',
};

export const VENDOR_DISALLOW_REASON_LABELS: Record<VendorDisallowReason, string> = {
  compliance: 'Compliance',
  legal: 'Legal',
  strategy: 'Strategy',
  'bad-experience': 'Bad experience',
  other: 'Other',
};

// ============= Seed Data =============

export const SEED_PARTNER_PROFILE: PartnerProfile = {
  services: [
    {
      id: 'svc-1',
      name: 'Managed Cloud Operations',
      description: 'End-to-end Azure cloud management including monitoring, patching, and optimization.',
      serviceType: 'managed-service',
      contractLength: '12mo+',
      pricingBand: '$8K–$25K/mo',
      regions: ['CH', 'DACH'],
      industries: ['Financial Services', 'Manufacturing'],
    },
    {
      id: 'svc-2',
      name: 'Security Operations Center',
      description: 'Managed SOC with 24/7 monitoring, incident response, and compliance reporting.',
      serviceType: 'managed-service',
      contractLength: '12mo+',
      pricingBand: '$12K–$40K/mo',
      regions: ['CH', 'DACH', 'EMEA'],
    },
    {
      id: 'svc-3',
      name: 'M365 Deployment & Adoption',
      description: 'Full M365 rollout including migration, training, and change management.',
      serviceType: 'implementation',
      contractLength: '3-6mo',
      pricingBand: '$30K–$80K',
    },
    {
      id: 'svc-4',
      name: 'Data Platform Advisory',
      description: 'Azure data architecture design, migration strategy, and governance setup.',
      serviceType: 'advisory',
      contractLength: '1-3mo',
      pricingBand: '$15K–$45K',
    },
  ],
  attachSurfaces: [
    { key: 'm365', label: 'M365', scale: 'high' },
    { key: 'security-soc', label: 'Security / SOC services', scale: 'high' },
    { key: 'data-platform', label: 'Data platform managed services', scale: 'medium' },
    { key: 'cloud-ops', label: 'Cloud ops / managed cloud', scale: 'high' },
    { key: 'app-modernization', label: 'App modernization', scale: 'low' },
    { key: 'contact-center', label: 'Contact center / CX platforms', scale: 'none' },
    { key: 'erp-lob', label: 'ERP / Line-of-business integrations', scale: 'low' },
  ],
  capabilities: [
    { key: 'governance-risk', label: 'Governance & Risk', level: 2 },
    { key: 'security-identity', label: 'Security & Identity', level: 3 },
    { key: 'data-engineering', label: 'Data Engineering & Data Readiness', level: 2 },
    { key: 'architecture-rag-agents', label: 'Architecture (RAG / Agents patterns)', level: 1 },
    { key: 'mlops-observability', label: 'MLOps-lite / Observability / Evals', level: 0 },
    { key: 'finops-ai', label: 'FinOps for AI', level: 1 },
    { key: 'adoption-change', label: 'Adoption / Change management', level: 2 },
  ],
  capacity: 'balanced',
  capacityNotes: 'Hiring 2 AI engineers. Available capacity for 1-2 new projects per quarter.',
  deliveryModel: 'hybrid',
  minimumRetainer: '$5K/mo',
  riskAppetite: 'balanced',
  verticalFocus: ['Financial Services', 'Manufacturing', 'Healthcare'],
  vendorPosture: 'microsoft-first',
  revenueMix: 'balanced',
  topServiceLines: ['Managed Cloud Operations', 'Security Operations Center', 'M365 Deployment & Adoption'],
  vendorPostureConfig: {
    preferredVendors: [
      { vendorId: 'vendor-azure-openai', priority: 1, reason: 'alliance' },
      { vendorId: 'vendor-langchain', priority: 2, reason: 'delivery' },
    ],
    currentVendors: [
      { vendorId: 'vendor-azure-openai', maturity: 'expert' },
      { vendorId: 'vendor-purview', maturity: 'delivering' },
      { vendorId: 'vendor-langchain', maturity: 'exploring' },
    ],
    disallowedVendors: [],
  },
  updatedAt: '2026-02-01',
};

// ============= Local Storage =============

const PROFILE_KEY = 'partner-profile';

export function getPartnerProfile(): PartnerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : SEED_PARTNER_PROFILE;
  } catch {
    return SEED_PARTNER_PROFILE;
  }
}

export function savePartnerProfile(profile: PartnerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({
    ...profile,
    updatedAt: new Date().toISOString().split('T')[0],
  }));
}

// ============= Profile-Aware Recommendation Logic =============

import { AIPackage, SEED_PACKAGES, PackageCategory } from './partnerPackages';

/**
 * Maps package categories to capability dimension keys.
 * Used to determine if a package matches existing partner capabilities.
 */
const CATEGORY_TO_CAPABILITY: Record<PackageCategory, string[]> = {
  governance: ['governance-risk'],
  'copilot-adoption': ['adoption-change'],
  rag: ['architecture-rag-agents', 'data-engineering'],
  finops: ['finops-ai'],
  'security-review': ['security-identity', 'governance-risk'],
  'data-readiness': ['data-engineering'],
};

/**
 * Maps package categories to relevant attach surface keys.
 */
const CATEGORY_TO_SURFACES: Record<PackageCategory, string[]> = {
  governance: ['security-soc', 'data-platform'],
  'copilot-adoption': ['m365'],
  rag: ['data-platform', 'app-modernization'],
  finops: ['cloud-ops'],
  'security-review': ['security-soc'],
  'data-readiness': ['data-platform', 'cloud-ops'],
};

export type PackageFitType = 'easy-attach' | 'net-new';

export interface PackageFitResult {
  fitType: PackageFitType;
  reason: string;
  capabilityMatch: boolean;
  surfaceMatch: boolean;
  serviceMatch: boolean;
}

/**
 * Determine if a package is "Easy attach" or "Net-new build" based on Partner Profile.
 */
export function evaluatePackageFit(pkg: AIPackage, profile: PartnerProfile): PackageFitResult {
  const requiredCapKeys = CATEGORY_TO_CAPABILITY[pkg.category] || [];
  const relevantSurfaceKeys = CATEGORY_TO_SURFACES[pkg.category] || [];

  // Check capability match: partner has ≥2 in required dimensions
  const capLevels = requiredCapKeys.map(
    key => profile.capabilities.find(c => c.key === key)?.level ?? 0
  );
  const avgCap = capLevels.length > 0 ? capLevels.reduce((a, b) => a + b, 0) / capLevels.length : 0;
  const capabilityMatch = avgCap >= 2;

  // Check attach surface match: partner has ≥ medium in relevant surfaces
  const surfaceScales = relevantSurfaceKeys.map(
    key => profile.attachSurfaces.find(s => s.key === key)?.scale ?? 'none'
  );
  const surfaceMatch = surfaceScales.some(s => s === 'medium' || s === 'high');

  // Check existing service match: partner has a managed/advisory service in a related area
  const hasMatchingService = profile.services.some(svc => {
    const lcName = svc.name.toLowerCase();
    const lcDesc = svc.description.toLowerCase();
    const categoryTerms: Record<string, string[]> = {
      governance: ['governance', 'compliance', 'risk', 'audit'],
      'copilot-adoption': ['copilot', 'm365', 'adoption', 'workplace'],
      rag: ['rag', 'search', 'knowledge', 'document'],
      finops: ['finops', 'cost', 'cloud ops'],
      'security-review': ['security', 'soc', 'privacy', 'incident'],
      'data-readiness': ['data', 'analytics', 'platform'],
    };
    const terms = categoryTerms[pkg.category] || [];
    return terms.some(term => lcName.includes(term) || lcDesc.includes(term));
  });

  const isEasyAttach = capabilityMatch && (surfaceMatch || hasMatchingService);
  const fitType: PackageFitType = isEasyAttach ? 'easy-attach' : 'net-new';

  // Generate reason
  let reason: string;
  if (isEasyAttach) {
    if (hasMatchingService) {
      const matchedSvc = profile.services.find(svc => {
        const lc = (svc.name + ' ' + svc.description).toLowerCase();
        const terms: Record<string, string[]> = {
          governance: ['governance', 'compliance', 'risk'],
          'copilot-adoption': ['copilot', 'm365', 'adoption'],
          rag: ['rag', 'search', 'knowledge'],
          finops: ['finops', 'cost'],
          'security-review': ['security', 'soc', 'privacy'],
          'data-readiness': ['data', 'analytics', 'platform'],
        };
        return (terms[pkg.category] || []).some(t => lc.includes(t));
      });
      reason = `You already run ${matchedSvc?.name || 'related services'} → natural attach.`;
    } else {
      reason = 'Strong capability alignment with your existing delivery team.';
    }
  } else {
    const weakDims = requiredCapKeys
      .filter(key => (profile.capabilities.find(c => c.key === key)?.level ?? 0) < 2)
      .map(key => profile.capabilities.find(c => c.key === key)?.label || key.replace(/-/g, ' '));
    reason = weakDims.length > 0
      ? `Requires building capability in: ${weakDims.join(', ')}.`
      : 'No existing service line or surface area match — new market for you.';
  }

  return { fitType, reason, capabilityMatch, surfaceMatch, serviceMatch: hasMatchingService };
}

/**
 * Derive strategy recommendations from Partner Profile.
 */
export interface StrategyRecommendation {
  package: AIPackage;
  fitType: PackageFitType;
  reason: string;
}

export function deriveStrategyRecommendations(profile: PartnerProfile): {
  easyAttach: StrategyRecommendation[];
  netNew: StrategyRecommendation[];
} {
  const approved = SEED_PACKAGES.filter(p => p.status === 'approved');
  const easy: StrategyRecommendation[] = [];
  const netNew: StrategyRecommendation[] = [];

  for (const pkg of approved) {
    const fit = evaluatePackageFit(pkg, profile);
    const rec: StrategyRecommendation = {
      package: pkg,
      fitType: fit.fitType,
      reason: fit.reason,
    };
    if (fit.fitType === 'easy-attach') {
      easy.push(rec);
    } else {
      netNew.push(rec);
    }
  }

  return {
    easyAttach: easy.slice(0, 3),
    netNew: netNew.slice(0, 2),
  };
}

/**
 * Evaluate a tool/agent's fit with Partner Profile for the admin view.
 */
export interface ToolFitResult {
  requiredCapabilities: Array<{ label: string; level: CapabilityLevel; partnerLevel: CapabilityLevel }>;
  enablementEffort: 'low' | 'medium' | 'high';
  suggestedStatus: 'watch' | 'pilot' | 'approved';
}

export function evaluateToolFit(
  toolMappedPackageIds: string[],
  profile: PartnerProfile
): ToolFitResult {
  // Gather required capability dimensions from mapped packages
  const relevantPkgs = SEED_PACKAGES.filter(p => toolMappedPackageIds.includes(p.id));
  const allCapKeys = new Set<string>();
  for (const pkg of relevantPkgs) {
    const keys = CATEGORY_TO_CAPABILITY[pkg.category] || [];
    keys.forEach(k => allCapKeys.add(k));
  }

  const required = Array.from(allCapKeys).map(key => {
    const dim = profile.capabilities.find(c => c.key === key);
    return {
      label: dim?.label || key.replace(/-/g, ' '),
      level: 2 as CapabilityLevel, // Required level for effective use
      partnerLevel: (dim?.level ?? 0) as CapabilityLevel,
    };
  });

  // Determine enablement effort
  const gaps = required.filter(r => r.partnerLevel < r.level);
  const enablementEffort: 'low' | 'medium' | 'high' =
    gaps.length === 0 ? 'low' : gaps.length <= 1 ? 'medium' : 'high';

  // Determine suggested status
  let suggestedStatus: 'watch' | 'pilot' | 'approved' = 'approved';
  if (enablementEffort === 'high' && profile.riskAppetite === 'conservative') {
    suggestedStatus = 'watch';
  } else if (enablementEffort === 'high') {
    suggestedStatus = 'pilot';
  } else if (enablementEffort === 'medium') {
    suggestedStatus = profile.riskAppetite === 'experimental' ? 'approved' : 'pilot';
  }

  return { requiredCapabilities: required, enablementEffort, suggestedStatus };
}
