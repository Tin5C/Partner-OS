// In-memory store for hydrated plan data when "Add to Plan" is triggered
// Partner-only, non-breaking, no backend persistence

import type { ActivePlay } from './selectedPackStore';

// ============= Types =============

export type NeedStatus = 'missing' | 'have' | 'blocked';
export type NeedOwner = 'seller' | 'engineer' | 'customer';

export interface ChecklistItem {
  id: string;
  gate: 'security_compliance' | 'technical_readiness' | 'business_value' | 'procurement_commercial';
  title: string;
  whyNeeded: string;
  status: NeedStatus;
  owner: NeedOwner;
  notes: string;
}

export interface PoliticalRole {
  role: 'Sponsor' | 'Champion' | 'Blocker' | 'Procurement';
  title: string;
  notes: string;
}

export type RiskSeverity = 'low' | 'medium' | 'high';
export type RiskStatus = 'open' | 'mitigated';

export interface RiskItem {
  title: string;
  severity: RiskSeverity;
  mitigation: string;
  status: RiskStatus;
}

export interface ExecutionAsset {
  id: string;
  group: 'positioning' | 'delivery' | 'commercial' | 'enablement';
  title: string;
  description: string;
}

export interface DealHypothesis {
  dealShape: string;
  expectedPacks: string;
  timeboxWeeks: string;
  sizingRange: string;
  confidence: string;
}

export interface HydratedPlan {
  checklist: ChecklistItem[];
  politicalMap: PoliticalRole[];
  risks: RiskItem[];
  executionBundle: ExecutionAsset[];
  dealHypothesis: DealHypothesis;
}

// ============= In-memory store =============

const hydrated: Map<string, HydratedPlan> = new Map();

export function getHydratedPlan(focusId: string): HydratedPlan | null {
  return hydrated.get(focusId) ?? null;
}

export function setHydratedPlan(focusId: string, plan: HydratedPlan): void {
  hydrated.set(focusId, plan);
}

export function updateChecklistStatus(focusId: string, itemId: string, status: NeedStatus): void {
  const plan = hydrated.get(focusId);
  if (!plan) return;
  const item = plan.checklist.find((c) => c.id === itemId);
  if (item) item.status = status;
}

export function updateRiskStatus(focusId: string, idx: number, status: RiskStatus): void {
  const plan = hydrated.get(focusId);
  if (!plan || !plan.risks[idx]) return;
  plan.risks[idx].status = status;
}

// ============= Deterministic generation =============

const GATE_LABELS: Record<string, string> = {
  security_compliance: 'Security & Compliance',
  technical_readiness: 'Technical Readiness',
  business_value: 'Business Value',
  procurement_commercial: 'Procurement & Commercial',
};

function makeId(playId: string, slug: string) {
  return `need_${playId}_${slug}`;
}

function generateChecklist(
  playId: string,
  playName: string,
  engagementType: 'new_logo' | 'existing_customer' | null,
  gaps: string[],
): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: makeId(playId, 'data_classification'),
      gate: 'security_compliance',
      title: 'Data classification & residency confirmation',
      whyNeeded: 'Required to validate compliance posture before pilot.',
      status: 'missing', owner: 'customer', notes: '',
    },
    {
      id: makeId(playId, 'security_review'),
      gate: 'security_compliance',
      title: 'Security architecture review sign-off',
      whyNeeded: 'CISO gate for any new workload deployment.',
      status: 'missing', owner: 'engineer', notes: '',
    },
    {
      id: makeId(playId, 'env_access'),
      gate: 'technical_readiness',
      title: 'Environment access & subscription setup',
      whyNeeded: 'Technical prerequisite to begin delivery.',
      status: 'missing', owner: 'engineer', notes: '',
    },
    {
      id: makeId(playId, 'stakeholder_alignment'),
      gate: 'technical_readiness',
      title: 'Stakeholder alignment & kickoff confirmation',
      whyNeeded: 'Ensures sponsor and champion are committed before start.',
      status: 'missing', owner: 'seller', notes: '',
    },
    {
      id: makeId(playId, 'business_case'),
      gate: 'business_value',
      title: 'Business case / ROI outline',
      whyNeeded: 'Quantifies expected value to justify investment.',
      status: 'missing', owner: 'seller', notes: '',
    },
    {
      id: makeId(playId, 'success_criteria'),
      gate: 'business_value',
      title: 'Success criteria & KPIs defined',
      whyNeeded: 'Needed to measure pilot outcomes objectively.',
      status: 'missing', owner: 'customer', notes: '',
    },
    {
      id: makeId(playId, 'budget_approval'),
      gate: 'procurement_commercial',
      title: 'Budget approval & procurement timeline',
      whyNeeded: 'Commercial gate for engagement start.',
      status: 'missing', owner: 'customer', notes: '',
    },
    {
      id: makeId(playId, 'sow_draft'),
      gate: 'procurement_commercial',
      title: 'Statement of Work draft',
      whyNeeded: 'Formalises scope, timeline, and deliverables.',
      status: 'missing', owner: 'seller', notes: '',
    },
  ];

  // Extra items based on engagement type
  if (engagementType === 'new_logo') {
    items.push({
      id: makeId(playId, 'nda_msa'),
      gate: 'procurement_commercial',
      title: 'NDA / MSA execution',
      whyNeeded: 'Legal prerequisite for new customer engagements.',
      status: 'missing', owner: 'customer', notes: '',
    });
  } else if (engagementType === 'existing_customer') {
    items.push({
      id: makeId(playId, 'existing_contracts'),
      gate: 'procurement_commercial',
      title: 'Review existing contract terms for expansion',
      whyNeeded: 'Identify upsell/cross-sell clauses and pricing precedents.',
      status: 'missing', owner: 'seller', notes: '',
    });
  }

  // Gap-based item
  if (gaps.length > 0) {
    items.push({
      id: makeId(playId, 'gap_evidence'),
      gate: 'business_value',
      title: `Evidence to address: ${gaps[0].slice(0, 60)}`,
      whyNeeded: 'Identified gap that could reduce confidence if unresolved.',
      status: 'missing', owner: 'seller', notes: '',
    });
  }

  return items;
}

function generatePoliticalMap(playId: string): PoliticalRole[] {
  const isGovernance = playId.includes('governance') || playId.includes('competitive');
  const isDiscovery = playId.includes('discovery') || playId.includes('rag');

  if (isGovernance) {
    return [
      { role: 'Sponsor', title: 'CIO / VP Engineering', notes: '' },
      { role: 'Champion', title: 'Head of Digital Transformation / Data & AI', notes: '' },
      { role: 'Blocker', title: 'CISO', notes: '' },
      { role: 'Procurement', title: 'Head of Procurement', notes: '' },
    ];
  }
  if (isDiscovery) {
    return [
      { role: 'Sponsor', title: 'Business VP / Operations Lead', notes: '' },
      { role: 'Champion', title: 'Product / Innovation Lead', notes: '' },
      { role: 'Blocker', title: 'Enterprise Architect / Security', notes: '' },
      { role: 'Procurement', title: 'Procurement / FinOps', notes: '' },
    ];
  }
  // Default
  return [
    { role: 'Sponsor', title: 'VP Engineering / Business Sponsor', notes: '' },
    { role: 'Champion', title: 'Head of Digital Transformation', notes: '' },
    { role: 'Blocker', title: 'CISO / Enterprise Architect', notes: '' },
    { role: 'Procurement', title: 'Head of Procurement', notes: '' },
  ];
}

function generateRisks(gaps: string[], playName: string): RiskItem[] {
  const risks: RiskItem[] = [];

  // From play gaps
  for (const g of gaps.slice(0, 3)) {
    risks.push({
      title: g,
      severity: 'medium',
      mitigation: 'Address during discovery phase; align with relevant stakeholder.',
      status: 'open',
    });
  }

  // Generic template risks
  if (risks.length < 3) {
    risks.push({
      title: 'Stakeholder availability during pilot window',
      severity: 'medium',
      mitigation: 'Secure calendar commitments at kickoff; identify backup contacts.',
      status: 'open',
    });
  }
  if (risks.length < 4) {
    risks.push({
      title: 'Budget cycle misalignment',
      severity: 'low',
      mitigation: 'Position as current-quarter initiative with defined ROI timeline.',
      status: 'open',
    });
  }
  if (risks.length < 5) {
    risks.push({
      title: 'Competing internal priorities may delay decision',
      severity: 'low',
      mitigation: 'Link to existing strategic initiative to maintain urgency.',
      status: 'open',
    });
  }

  return risks.slice(0, 5);
}

function generateExecutionBundle(playId: string, playName: string): ExecutionAsset[] {
  return [
    { id: `eb_${playId}_pov`, group: 'positioning', title: 'Executive POV outline', description: `Tailored point-of-view document for ${playName}.` },
    { id: `eb_${playId}_talk`, group: 'positioning', title: 'Talk track (CIO / CISO / Procurement)', description: 'Role-specific messaging framework for executive conversations.' },
    { id: `eb_${playId}_agenda`, group: 'delivery', title: 'Discovery agenda', description: 'Structured agenda for initial discovery workshop.' },
    { id: `eb_${playId}_workshop`, group: 'delivery', title: 'Workshop plan', description: 'Half-day workshop template with exercises and outcomes.' },
    { id: `eb_${playId}_pilot`, group: 'delivery', title: 'Pilot scope template', description: 'Scope, success criteria, and timeline template for pilot engagements.' },
    { id: `eb_${playId}_sizing`, group: 'commercial', title: 'Sizing worksheet (range)', description: 'Deal sizing calculator with inputs and range estimates.' },
    { id: `eb_${playId}_roi`, group: 'commercial', title: 'ROI prompts / FinOps checklist', description: 'Structured ROI conversation guide and cost optimization checklist.' },
    { id: `eb_${playId}_seller_lp`, group: 'enablement', title: 'Seller learning path', description: 'Curated learning modules for seller enablement on this play.' },
    { id: `eb_${playId}_eng_lp`, group: 'enablement', title: 'Engineer learning path', description: 'Technical certification and lab path for delivery engineers.' },
  ];
}

function generateDealHypothesis(
  playName: string,
  engagementType: 'new_logo' | 'existing_customer' | null,
  motion: string | null,
): DealHypothesis {
  const isNewLogo = engagementType === 'new_logo';
  return {
    dealShape: isNewLogo
      ? `Initial engagement via ${playName} — discovery-led, with pilot expansion path.`
      : `Expansion engagement via ${playName} — building on existing footprint.`,
    expectedPacks: playName,
    timeboxWeeks: isNewLogo ? '6–10 weeks' : '4–8 weeks',
    sizingRange: isNewLogo ? 'CHF 40K–80K (initial engagement)' : 'CHF 60K–150K (expansion)',
    confidence: 'Estimate (placeholder) — refine with account-specific pricing.',
  };
}

// ============= Public hydrate function =============

export function hydratePlan(
  focusId: string,
  play: ActivePlay,
  engagementType: 'new_logo' | 'existing_customer' | null,
  motion: string | null,
  gaps: string[],
): HydratedPlan {
  const plan: HydratedPlan = {
    checklist: generateChecklist(play.playId, play.playTitle, engagementType, gaps),
    politicalMap: generatePoliticalMap(play.playId),
    risks: generateRisks(gaps, play.playTitle),
    executionBundle: generateExecutionBundle(play.playId, play.playTitle),
    dealHypothesis: generateDealHypothesis(play.playTitle, engagementType, motion),
  };
  setHydratedPlan(focusId, plan);
  return plan;
}
