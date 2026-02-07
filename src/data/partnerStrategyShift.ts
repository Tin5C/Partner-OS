// Strategy Shift — seed data for SI business model change cards
// Admin-only, action-anchored to Packages / Profile / Vendors / Tools

export type StrategyCardCategory = 'economics' | 'roadmap' | 'vendors';

export type StrategyCardAction =
  | { type: 'create-package'; suggestedName: string; suggestedCategory: string }
  | { type: 'update-profile'; section: string }
  | { type: 'add-trending-vendor'; suggestedName: string; suggestedCategory: string }
  | { type: 'attach-tool'; toolName: string; targetPackageId: string };

export interface StrategyCard {
  id: string;
  title: string;
  category: StrategyCardCategory;
  whatChanged: string[];
  soWhatForPartners: string[];
  decisionPrompt: string;
  recommendedAction: StrategyCardAction;
  linkedEntities?: {
    packageId?: string;
    vendorId?: string;
    toolId?: string;
  };
  status: 'draft' | 'published';
  updatedAt: string;
}

export const STRATEGY_CATEGORY_LABELS: Record<StrategyCardCategory, string> = {
  economics: 'Economics Shifts',
  roadmap: 'Package Roadmap Recommendations',
  vendors: 'Vendor & Platform Implications',
};

export const STRATEGY_ACTION_LABELS: Record<StrategyCardAction['type'], string> = {
  'create-package': 'Create package draft',
  'update-profile': 'Update Partner Profile',
  'add-trending-vendor': 'Add vendor to Trending',
  'attach-tool': 'Attach tool to package',
};

// ── Seed cards ─────────────────────────────────────────

export const SEED_STRATEGY_CARDS: StrategyCard[] = [
  // ─── ECONOMICS SHIFTS ────────────────────────────────
  {
    id: 'strat-econ-1',
    title: 'Project revenue declining as AI reduces implementation scope',
    category: 'economics',
    whatChanged: [
      'LLM-based automation is compressing typical data migration and integration timelines by 30–50%.',
      'Buyers are expecting faster delivery and smaller teams for work that previously took months.',
      'Fixed-price projects carry higher margin risk when scope shrinks mid-engagement.',
    ],
    soWhatForPartners: [
      'Partners relying on large project teams face utilization pressure within 12–18 months.',
      'Shift toward managed services and recurring advisory preserves margin and client stickiness.',
    ],
    decisionPrompt: 'Should we package a recurring governance review to offset shrinking project scope?',
    recommendedAction: {
      type: 'create-package',
      suggestedName: 'Quarterly AI Governance Review',
      suggestedCategory: 'governance',
    },
    status: 'published',
    updatedAt: '2026-02-01',
  },
  {
    id: 'strat-econ-2',
    title: 'Buyers shifting budget from build to operate for AI workloads',
    category: 'economics',
    whatChanged: [
      'Enterprise AI budgets are moving from one-time PoC funding to ongoing operational spend.',
      'CIOs are requesting managed service models for model monitoring, drift detection, and retraining.',
      'Procurement teams prefer predictable monthly spend over variable project invoices.',
    ],
    soWhatForPartners: [
      'Partners with managed service offerings capture recurring revenue and reduce sales cycle friction.',
    ],
    decisionPrompt: 'Do we have a managed service offering for AI operations, or are we leaving recurring revenue on the table?',
    recommendedAction: {
      type: 'update-profile',
      section: 'services',
    },
    linkedEntities: { packageId: 'pkg-finops' },
    status: 'published',
    updatedAt: '2026-02-03',
  },
  {
    id: 'strat-econ-3',
    title: 'Security and compliance becoming mandatory gates for AI procurement',
    category: 'economics',
    whatChanged: [
      'EU AI Act enforcement timelines are driving compliance-first procurement for any AI tooling.',
      'Enterprise buyers now require security review documentation before any vendor or model approval.',
      'Compliance teams are blocking AI initiatives that lack clear data residency and audit trail commitments.',
    ],
    soWhatForPartners: [
      'Partners who can deliver compliance-ready assessments unlock deals that competitors cannot.',
      'Security review capability is shifting from nice-to-have to deal-qualifying.',
    ],
    decisionPrompt: 'Is our Security & Privacy Review package positioned as a deal-qualifier, or just an add-on?',
    recommendedAction: {
      type: 'update-profile',
      section: 'capabilities',
    },
    linkedEntities: { packageId: 'pkg-security' },
    status: 'published',
    updatedAt: '2026-01-28',
  },

  // ─── PACKAGE ROADMAP ─────────────────────────────────
  {
    id: 'strat-road-1',
    title: 'Enterprise demand growing for agentic workflow governance packages',
    category: 'roadmap',
    whatChanged: [
      'Agentic AI adoption is accelerating in customer service, finance operations, and IT automation.',
      'Buyers have limited internal capability to govern multi-agent workflows and tool-use policies.',
      'Existing governance packages do not explicitly cover agent orchestration and guardrails.',
    ],
    soWhatForPartners: [
      'First movers offering agent governance packages will capture advisory-heavy, high-margin engagements.',
    ],
    decisionPrompt: 'Should we create an "Agent Governance" package before competitors establish this category?',
    recommendedAction: {
      type: 'create-package',
      suggestedName: 'Agent Governance & Guardrails',
      suggestedCategory: 'governance',
    },
    status: 'published',
    updatedAt: '2026-02-05',
  },
  {
    id: 'strat-road-2',
    title: 'RAG evaluation maturity becoming a differentiator in competitive deals',
    category: 'roadmap',
    whatChanged: [
      'Buyers are moving past initial RAG deployments and asking for measurable quality benchmarks.',
      'Competitors are beginning to offer evaluation-as-a-service alongside RAG implementations.',
      'Without eval discipline, partners risk delivering RAG systems that degrade silently in production.',
    ],
    soWhatForPartners: [
      'Adding an evaluation tier to the RAG Accelerator package strengthens post-deployment stickiness.',
    ],
    decisionPrompt: 'Should we add an "Evals" tier to the RAG Accelerator as a recurring quality assurance service?',
    recommendedAction: {
      type: 'attach-tool',
      toolName: 'promptfoo',
      targetPackageId: 'pkg-rag',
    },
    linkedEntities: { packageId: 'pkg-rag' },
    status: 'published',
    updatedAt: '2026-02-04',
  },
  {
    id: 'strat-road-3',
    title: 'Copilot adoption stalling without structured change management',
    category: 'roadmap',
    whatChanged: [
      'Enterprise Copilot rollouts are seeing 40–60% underutilization within 90 days of deployment.',
      'IT leaders are requesting structured adoption programs with measurable usage and ROI tracking.',
      'Microsoft is incentivizing partners who can demonstrate sustained Copilot usage metrics.',
    ],
    soWhatForPartners: [
      'Partners offering structured adoption programs convert one-time deployments into quarterly reviews.',
    ],
    decisionPrompt: 'Should we extend Copilot Adoption Sprint into a quarterly managed adoption program?',
    recommendedAction: {
      type: 'create-package',
      suggestedName: 'Copilot Adoption — Quarterly Review',
      suggestedCategory: 'adoption',
    },
    linkedEntities: { packageId: 'pkg-copilot' },
    status: 'published',
    updatedAt: '2026-02-02',
  },

  // ─── VENDOR & PLATFORM IMPLICATIONS ──────────────────
  {
    id: 'strat-vendor-1',
    title: 'Anthropic gaining enterprise traction as governance-first alternative',
    category: 'vendors',
    whatChanged: [
      'Anthropic Claude models are being adopted by regulated industries seeking alternatives to Azure OpenAI.',
      'Long-context capabilities (200K+ tokens) are creating new use cases in document-heavy verticals.',
      'Enterprise buyers are requesting multi-model strategies to avoid single-vendor lock-in.',
    ],
    soWhatForPartners: [
      'Partners who can deliver on both Azure OpenAI and Anthropic have a wider addressable market.',
      'Governance and security review packages need to cover Anthropic deployment paths.',
    ],
    decisionPrompt: 'Should we formally verify Anthropic and complete the security/commercial data we currently lack?',
    recommendedAction: {
      type: 'update-profile',
      section: 'vendorPosture',
    },
    linkedEntities: { vendorId: 'vendor-anthropic' },
    status: 'published',
    updatedAt: '2026-02-06',
  },
  {
    id: 'strat-vendor-2',
    title: 'Open-source observability tools reducing vendor dependency in AI ops',
    category: 'vendors',
    whatChanged: [
      'Open-source LLM observability tools (e.g., LangFuse, OpenLLMetry) are maturing rapidly.',
      'Enterprise buyers are evaluating open-source alternatives to reduce per-seat observability costs.',
      'Self-hosted observability aligns with data residency requirements in regulated markets.',
    ],
    soWhatForPartners: [
      'Tracking open-source observability options ensures we can serve both commercial and sovereignty-sensitive buyers.',
    ],
    decisionPrompt: 'Should we add an open-source observability option to our Trending watchlist for formal evaluation?',
    recommendedAction: {
      type: 'add-trending-vendor',
      suggestedName: 'LangFuse',
      suggestedCategory: 'observability',
    },
    status: 'published',
    updatedAt: '2026-02-03',
  },
];

// ── Helpers ────────────────────────────────────────────

export function getStrategyCardsByCategory(category: StrategyCardCategory): StrategyCard[] {
  return SEED_STRATEGY_CARDS.filter(c => c.category === category && c.status === 'published');
}

export function getAllPublishedStrategyCards(): StrategyCard[] {
  return SEED_STRATEGY_CARDS.filter(c => c.status === 'published');
}
