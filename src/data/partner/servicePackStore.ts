// Service Pack Store — deterministic recommendation engine
// Each pack has tags, capabilities, and proof assets.
// Scoring: Mode (0-40) + Trigger (0-15) + Vendor (0-10) + Capability (0-20) + Proof (0-10) + Completeness (0-5)

import type { EngagementMode } from '@/components/partner/DealPlanMetadata';
import type { EvidencePillar } from './accountMemoryStore';

// ============= Types =============

export interface ServicePack {
  id: string;
  name: string;
  description: string;
  tags: string[];
  delivery_model: 'Workshop' | 'Sprint' | 'Managed' | 'Advisory' | 'Assessment';
  duration_band: string;
  pricing_band: string;
  proof_assets: string[];
  required_capabilities: string[];
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
    tags: ['discovery', 'governance', 'assessment'],
    delivery_model: 'Assessment',
    duration_band: '2–4 weeks',
    pricing_band: 'CHF 15K–30K',
    proof_assets: ['AI Maturity Framework', 'Governance Checklist', 'Readiness Scorecard'],
    required_capabilities: ['ai-strategy'],
  },
  {
    id: 'sp-copilot-activation',
    name: 'Copilot Activation Sprint',
    description: 'Deploy M365 Copilot for a pilot user group with governance guardrails and adoption metrics.',
    tags: ['delivery', 'copilot', 'adoption'],
    delivery_model: 'Sprint',
    duration_band: '4–6 weeks',
    pricing_band: 'CHF 25K–50K',
    proof_assets: ['Copilot ROI Model', 'Adoption Dashboard Template', 'Data Classification Guide'],
    required_capabilities: ['copilot', 'governance'],
  },
  {
    id: 'sp-architecture-workshop',
    name: 'Azure Architecture Workshop',
    description: 'Design target-state cloud architecture aligned to compliance requirements and AI workloads.',
    tags: ['architecture', 'technical', 'azure'],
    delivery_model: 'Workshop',
    duration_band: '1–2 weeks',
    pricing_band: 'CHF 10K–20K',
    proof_assets: ['Reference Architecture', 'Swiss Compliance Matrix', 'Migration Roadmap'],
    required_capabilities: ['azure-architecture'],
  },
  {
    id: 'sp-security-review',
    name: 'Security & Governance Review',
    description: 'Assess AI governance posture, data residency compliance, and RACI alignment.',
    tags: ['security', 'governance', 'compliance'],
    delivery_model: 'Advisory',
    duration_band: '2–3 weeks',
    pricing_band: 'CHF 20K–35K',
    proof_assets: ['RACI Template', 'Data Residency Posture Map', 'Governance Maturity Assessment'],
    required_capabilities: ['security', 'governance'],
  },
  {
    id: 'sp-competitive-displacement',
    name: 'Competitive Displacement Sprint',
    description: 'Position Microsoft stack against incumbent cloud/AI vendors with proof-based objection handling.',
    tags: ['competitive', 'positioning', 'takeout'],
    delivery_model: 'Sprint',
    duration_band: '3–4 weeks',
    pricing_band: 'CHF 20K–40K',
    proof_assets: ['Competitive Battle Card', 'TCO Comparison Model', 'Migration Risk Assessment'],
    required_capabilities: ['competitive-intel'],
  },
  {
    id: 'sp-finops-ai',
    name: 'FinOps for AI Workloads',
    description: 'Establish cost governance framework for AI consumption with forecasting and optimization.',
    tags: ['commercial', 'finops', 'optimization'],
    delivery_model: 'Advisory',
    duration_band: '2–3 weeks',
    pricing_band: 'CHF 15K–25K',
    proof_assets: ['FinOps Framework', 'AI Cost Forecasting Model', 'Optimization Playbook'],
    required_capabilities: ['finops'],
  },
];

// ============= Scoring =============

const MODE_TAG_WEIGHTS: Record<string, string[]> = {
  'Discovery / Qualification': ['discovery', 'assessment'],
  'Architecture & Technical Validation': ['architecture', 'technical', 'azure'],
  'Security / Governance Review': ['security', 'governance', 'compliance'],
  'Commercial / Procurement': ['commercial', 'finops', 'optimization'],
  'Delivery / Adoption': ['delivery', 'copilot', 'adoption'],
  'Competitive Takeout / Defense': ['competitive', 'positioning', 'takeout'],
};

const TRIGGER_TAG_BOOSTS: Record<string, string[]> = {
  'Customer request': ['discovery', 'assessment'],
  'RFP / Tender': ['architecture', 'technical', 'commercial'],
  'Competitive pressure': ['competitive', 'takeout', 'positioning'],
  'Vendor push': ['delivery', 'copilot', 'adoption'],
  'Renewal / Expansion': ['commercial', 'finops', 'delivery'],
  'Incident / Risk': ['security', 'governance', 'compliance'],
  'Internal growth target': ['discovery', 'assessment', 'delivery'],
};

export function scoreServicePacks(params: {
  mode: EngagementMode | null;
  trigger: string | null;
  coveredPillars: Record<EvidencePillar, boolean>;
  availableCapabilities?: string[];
}): ScoredPack[] {
  const { mode, trigger, coveredPillars, availableCapabilities } = params;

  const results: ScoredPack[] = [];

  for (const pack of SERVICE_PACKS) {
    let score = 0;
    const reasons: string[] = [];

    // A) Mode tag weights (0–40)
    if (mode) {
      const modeTags = MODE_TAG_WEIGHTS[mode] ?? [];
      const overlap = pack.tags.filter((t) => modeTags.includes(t)).length;
      const modeScore = Math.min(40, overlap * 20);
      score += modeScore;
      if (modeScore > 0) reasons.push(`Aligned to ${mode} engagement mode`);
    }

    // B) Trigger boost (0–15)
    if (trigger) {
      const triggerTags = TRIGGER_TAG_BOOSTS[trigger] ?? [];
      const overlap = pack.tags.filter((t) => triggerTags.includes(t)).length;
      const triggerScore = Math.min(15, overlap * 8);
      score += triggerScore;
      if (triggerScore > 0) reasons.push(`Matches "${trigger}" trigger`);
    }

    // C) Vendor posture boost (0–10) — if we have competitive pillar covered
    if (coveredPillars.competitive && pack.tags.includes('competitive')) {
      score += 10;
      reasons.push('Competitive intelligence available');
    }

    // D) Capability feasibility (0–20)
    if (availableCapabilities && availableCapabilities.length > 0) {
      const met = pack.required_capabilities.filter((c) => availableCapabilities.includes(c)).length;
      const capScore = pack.required_capabilities.length > 0
        ? Math.round((met / pack.required_capabilities.length) * 20)
        : 20;
      score += capScore;
      if (capScore >= 15) reasons.push('Required capabilities available');
    } else {
      // Default: assume all capabilities available
      score += 20;
      reasons.push('Capability requirements assumed met');
    }

    // E) Proof availability bonus (0–10)
    if (coveredPillars.proof) {
      score += 10;
      reasons.push('Proof materials on file');
    }

    // F) Completeness bonus (0–5)
    const pillarCount = Object.values(coveredPillars).filter(Boolean).length;
    score += pillarCount; // max 5

    // Exclude if no mode/trigger match at all
    if (mode === null && trigger === null) {
      score = Math.max(10, score); // still rank but lower
    }

    const rationale = reasons.length > 0
      ? reasons[0]
      : `General fit based on evidence readiness`;

    results.push({
      pack,
      score,
      rationale,
      why_recommended: reasons,
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
