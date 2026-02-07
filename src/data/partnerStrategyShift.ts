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
  /** 2–3 short signal chips (e.g. "–30–50% delivery time") */
  signals: string[];
  /** Single sentence: "Impact: …" */
  impactLine: string;
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
  roadmap: 'Package Roadmap',
  vendors: 'Vendor Implications',
};

export const STRATEGY_CATEGORY_SUBTITLES: Record<StrategyCardCategory, string> = {
  economics: 'Structural changes affecting SI margins and delivery',
  roadmap: 'What to build, bundle, or retire next',
  vendors: 'Where platforms are reshaping partner value',
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
    title: 'Project revenue declining as AI compresses delivery scope',
    category: 'economics',
    signals: ['–30–50% delivery time', 'Fixed-fee margin risk', 'Shift to OPEX'],
    impactLine: 'Impact: Project-heavy models face margin pressure within 12–18 months.',
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
    signals: ['PoC → managed ops', 'Predictable monthly spend', 'Recurring revenue shift'],
    impactLine: 'Impact: Partners without managed service offerings leave recurring revenue on the table.',
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
    signals: ['EU AI Act timelines', 'Compliance-first procurement', 'Data residency blocking'],
    impactLine: 'Impact: Partners who deliver compliance-ready assessments unlock deals competitors cannot.',
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
    signals: ['Agent orchestration', 'Tool-use policies', 'High-margin advisory'],
    impactLine: 'Impact: First movers in agent governance capture advisory-heavy engagements.',
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
    signals: ['Eval-as-a-service', 'Quality benchmarks', 'Post-deploy stickiness'],
    impactLine: 'Impact: Adding an evaluation tier to RAG strengthens post-deployment retention.',
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
    signals: ['40–60% underutilization', 'ROI tracking demand', 'Microsoft incentives'],
    impactLine: 'Impact: Structured adoption programs convert one-time deployments into quarterly reviews.',
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
    signals: ['Multi-model strategy', '200K+ context window', 'Regulated industry adoption'],
    impactLine: 'Impact: Partners covering both Azure OpenAI and Anthropic widen addressable market.',
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
    signals: ['LangFuse / OpenLLMetry', 'Self-hosted option', 'Data residency fit'],
    impactLine: 'Impact: Tracking open-source options ensures coverage for sovereignty-sensitive buyers.',
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
