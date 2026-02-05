// Partner Trending Packs data
// Time-bound, opinionated themes that reflect what buyers care about now

export interface TrendingPack {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  hasAudio: boolean;
  publishedAt: string;
  tags: string[];
  content: TrendingPackContent;
}

export interface TrendingPackContent {
  whyTrending: string[];
  buyerWorries: string[];
  partnerPositioning: string[];
  relevantServices: string[];
  nextBestActions: string[];
}

// Mock Trending Packs for MVP
export const partnerTrendingPacks: TrendingPack[] = [
  {
    id: 'responsible-ai',
    title: 'Responsible AI',
    description: 'Regulation and board-level scrutiny are making this a priority',
    estimatedTime: '5 min',
    hasAudio: true,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Purview', 'Azure AI'],
    content: {
      whyTrending: [
        'EU AI Act enforcement begins in 2025, creating compliance urgency',
        'Board-level scrutiny of AI investments is now standard practice',
        'High-profile AI failures are making executives cautious',
      ],
      buyerWorries: [
        '"We don\'t want to be the next AI headline for the wrong reasons"',
        '"How do we prove our AI is fair and explainable to regulators?"',
      ],
      partnerPositioning: [
        'Lead with governance, not just innovation — it\'s what unlocks budget',
        'Position Responsible AI as an accelerator, not a blocker to deployment',
        'Offer a Responsible AI assessment as a low-risk entry point',
      ],
      relevantServices: ['Microsoft Purview', 'Azure AI Content Safety', 'Responsible AI Dashboard'],
      nextBestActions: [
        'Propose a Responsible AI readiness workshop',
        'Share the Microsoft Responsible AI Impact Assessment template',
      ],
    },
  },
  {
    id: 'shadow-ai',
    title: 'Shadow AI',
    description: 'Unsanctioned AI usage is growing faster than IT can track',
    estimatedTime: '6 min',
    hasAudio: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['M365', 'Security', 'Governance'],
    content: {
      whyTrending: [
        'Employees are using personal ChatGPT accounts for work tasks',
        'IT has limited visibility into what AI tools are being used',
        'Data leakage risk is becoming a C-suite concern',
      ],
      buyerWorries: [
        '"We have no idea what our employees are putting into AI tools"',
        '"How do we give people AI without losing control of our data?"',
      ],
      partnerPositioning: [
        'Frame sanctioned AI (Copilot) as the solution to shadow AI, not an addition',
        'Offer discovery services to surface unsanctioned AI usage',
        'Position governance as enablement, not restriction',
      ],
      relevantServices: ['Microsoft 365 Copilot', 'Microsoft Defender for Cloud Apps', 'Purview DLP'],
      nextBestActions: [
        'Run a Shadow AI discovery assessment using Defender for Cloud Apps',
        'Position Copilot rollout as the governed alternative',
      ],
    },
  },
  {
    id: 'finops-ai',
    title: 'FinOps for AI',
    description: 'AI cost visibility is becoming a blocker for scale',
    estimatedTime: '5 min',
    hasAudio: false,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Azure Cost Management', 'Governance'],
    content: {
      whyTrending: [
        'AI workloads are creating unpredictable Azure consumption spikes',
        'CFOs are demanding cost accountability before approving expansion',
        'Token-based pricing models are confusing for traditional IT budgeting',
      ],
      buyerWorries: [
        '"Our AI pilot succeeded but we can\'t predict what production will cost"',
        '"How do we allocate AI costs back to business units?"',
      ],
      partnerPositioning: [
        'Offer AI-specific FinOps services as a natural extension of Azure managed services',
        'Help customers model token costs before they scale',
        'Position cost transparency as the enabler of AI expansion, not a barrier',
      ],
      relevantServices: ['Azure Cost Management', 'Azure Advisor', 'Azure Monitor'],
      nextBestActions: [
        'Include FinOps considerations in every AI proposal',
        'Offer a cost modeling workshop for AI workloads',
      ],
    },
  },
  {
    id: 'copilot-governance',
    title: 'Copilot Governance',
    description: 'Fast rollouts without guardrails are creating risk',
    estimatedTime: '7 min',
    hasAudio: true,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Copilot', 'Identity', 'Security'],
    content: {
      whyTrending: [
        'Organizations are rolling out Copilot faster than governance can keep up',
        'Oversharing issues are being exposed by Copilot\'s search capabilities',
        'Security teams are raising concerns about data access patterns',
      ],
      buyerWorries: [
        '"Copilot surfaced files that people shouldn\'t have access to"',
        '"We need to clean up our permissions before we can go broader"',
      ],
      partnerPositioning: [
        'Position governance as a prerequisite for successful Copilot rollout',
        'Offer permission hygiene services as a pre-deployment offering',
        'Frame governance work as risk reduction, not slowdown',
      ],
      relevantServices: ['Microsoft 365 Copilot', 'Microsoft Entra', 'SharePoint Advanced Management'],
      nextBestActions: [
        'Propose a SharePoint permission audit before Copilot expansion',
        'Offer a Copilot governance framework workshop',
      ],
    },
  },
];

// Get all trending packs (max 5)
export function getTrendingPacks(max: number = 5): TrendingPack[] {
  return partnerTrendingPacks
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, max);
}
