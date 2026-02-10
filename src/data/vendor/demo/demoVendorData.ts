// Demo Vendor Data — single source of truth for vendor space demo mode
// Completely isolated from partner data providers

import type {
  EnablementAtom,
  ProgramSignal,
  PublishingTarget,
  VendorInsightEvent,
} from '../contracts';

const now = new Date().toISOString();
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

// ============= Enablement Atoms =============

export const demoEnablementAtoms: EnablementAtom[] = [
  {
    id: 'atom-copilot-update',
    vendorId: 'vendor-microsoft',
    atomType: 'product_update',
    title: 'Copilot for M365 — New Features Q1 2026',
    body: `## What's New\n\n- **Copilot Pages**: collaborative canvas for AI-generated content\n- **Copilot Agents**: customizable task-specific agents for Sales, HR, Finance\n- **Priority Notifications**: AI-curated alerts in Teams\n\n## Partner Impact\nPartners can now position Copilot as a platform, not just a feature. Upsell path from M365 E3 → E5 + Copilot add-on.`,
    tags: ['copilot', 'M365', 'AI'],
    governance: { status: 'approved', lastReviewedAt: weekAgo, reviewedBy: 'Sarah Chen' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'atom-azure-ai-objection',
    vendorId: 'vendor-microsoft',
    atomType: 'objection',
    title: '"Azure AI is too expensive for mid-market"',
    body: `## Objection\n"We've heard Azure AI pricing isn't competitive for mid-market."\n\n## Approved Response\nAzure AI offers consumption-based pricing starting at $0.002/1K tokens for GPT-4o mini. For mid-market, the Azure AI Foundry provides a single interface to compare and select cost-optimal models. Partners should emphasize TCO vs. point-solution alternatives.\n\n## Evidence\n- Forrester TEI Study: 228% ROI over 3 years\n- Customer proof: Sulzer reduced AI inference costs by 40% using model routing`,
    tags: ['azure', 'AI', 'pricing', 'mid-market'],
    governance: { status: 'approved', lastReviewedAt: weekAgo, reviewedBy: 'Michael Torres' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'atom-fabric-proof',
    vendorId: 'vendor-microsoft',
    atomType: 'proof_artifact',
    title: 'Microsoft Fabric — Swiss Manufacturing Case Study',
    body: `## Customer\nSulzer AG (Industrial Manufacturing)\n\n## Challenge\nFragmented data across 12 legacy systems, 3-week reporting cycle.\n\n## Solution\nMicrosoft Fabric unified analytics platform deployed by partner.\n\n## Results\n- Reporting cycle: 3 weeks → 2 days\n- Data engineering effort reduced 60%\n- Single source of truth for 4,000 users`,
    tags: ['fabric', 'manufacturing', 'case-study'],
    governance: { status: 'approved', lastReviewedAt: now, reviewedBy: 'Sarah Chen' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'atom-security-guardrail',
    vendorId: 'vendor-microsoft',
    atomType: 'positioning_guardrail',
    title: 'Data Residency Claims — Switzerland',
    body: `## Guardrail\n**DO NOT** claim that all Azure AI services support Swiss data residency.\n\n## Approved Positioning\n- Azure OpenAI Service: Available in Switzerland North ✓\n- Copilot for M365: Data processed in EU region (not Switzerland-specific)\n- Azure AI Search: Available in Switzerland North ✓\n\n## Required Disclaimer\nAlways reference the [Azure Products by Region](https://azure.microsoft.com/regions/services/) page for current availability. Last verified: Jan 2026.`,
    tags: ['security', 'data-residency', 'switzerland'],
    governance: { status: 'approved', lastReviewedAt: now, reviewedBy: 'Legal Team' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'atom-draft-power-platform',
    vendorId: 'vendor-microsoft',
    atomType: 'product_update',
    title: 'Power Platform Governance Updates (Draft)',
    body: `## Pending Review\nNew managed environments and DLP policy changes for Power Platform.\n\nContent pending final review by product team.`,
    tags: ['power-platform', 'governance'],
    governance: { status: 'draft', lastReviewedAt: weekAgo, reviewedBy: 'Unassigned' },
    createdAt: now,
    isSimulated: true,
  },
  {
    id: 'atom-deprecated-windows-365',
    vendorId: 'vendor-microsoft',
    atomType: 'product_update',
    title: 'Windows 365 Frontline — Legacy Positioning',
    body: `## Deprecated\nThis positioning guide has been superseded by the updated Windows 365 Frontline v2 materials.`,
    tags: ['windows-365', 'frontline'],
    governance: { status: 'deprecated', lastReviewedAt: weekAgo, reviewedBy: 'Michael Torres' },
    createdAt: weekAgo,
    isSimulated: true,
  },
];

// ============= Program Signals =============

export const demoProgramSignals: ProgramSignal[] = [
  {
    id: 'signal-copilot-agents',
    vendorId: 'vendor-microsoft',
    title: 'Copilot Agents GA — Build Custom AI Assistants',
    summary: 'Microsoft announces general availability of Copilot Agents. Partners can now build and monetize custom AI agents within the M365 ecosystem.',
    signalType: 'product_launch',
    governance: { status: 'approved', lastReviewedAt: weekAgo, reviewedBy: 'Sarah Chen' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'signal-partner-incentive',
    vendorId: 'vendor-microsoft',
    title: 'FY26 H2 Partner Incentive: Azure AI Consumption',
    summary: 'New rebate program: 15% partner margin on incremental Azure AI consumption for qualified workloads. Effective Feb 2026.',
    signalType: 'incentive',
    governance: { status: 'approved', lastReviewedAt: now, reviewedBy: 'Partner Ops' },
    createdAt: now,
    isSimulated: true,
  },
  {
    id: 'signal-program-change',
    vendorId: 'vendor-microsoft',
    title: 'Solutions Partner Designation — Updated Requirements',
    summary: 'Microsoft updates partner competency thresholds for Solutions Partner for Data & AI. New certification paths available starting March 2026.',
    signalType: 'program_change',
    governance: { status: 'approved', lastReviewedAt: weekAgo, reviewedBy: 'Sarah Chen' },
    createdAt: weekAgo,
    isSimulated: true,
  },
  {
    id: 'signal-deprecation',
    vendorId: 'vendor-microsoft',
    title: 'Azure Machine Learning Classic — End of Support',
    summary: 'Azure ML Classic will reach end of support in June 2026. Partners should migrate customers to Azure AI Foundry.',
    signalType: 'deprecation',
    governance: { status: 'approved', lastReviewedAt: weekAgo, reviewedBy: 'Michael Torres' },
    createdAt: weekAgo,
    isSimulated: true,
  },
];

// ============= Publishing Targets =============

export const demoPublishingTargets: PublishingTarget[] = [
  {
    id: 'pub-copilot-all',
    atomId: 'atom-copilot-update',
    targetSegment: 'All Partners',
    publishedAt: weekAgo,
    briefingArtifactId: 'briefing-vendor-updates-microsoft',
  },
  {
    id: 'pub-objection-gold',
    atomId: 'atom-azure-ai-objection',
    targetSegment: 'Gold Tier',
    publishedAt: weekAgo,
  },
  {
    id: 'pub-fabric-dach',
    atomId: 'atom-fabric-proof',
    targetSegment: 'DACH Region',
    publishedAt: weekAgo,
  },
];

// ============= Insight Events =============

export const demoInsightEvents: VendorInsightEvent[] = [
  { id: 'insight-1', vendorId: 'vendor-microsoft', metric: 'Briefings Opened', value: 142, unit: 'total', period: 'Last 30 days', trend: 'up', isSimulated: true },
  { id: 'insight-2', vendorId: 'vendor-microsoft', metric: 'Atoms Viewed', value: 87, unit: 'total', period: 'Last 30 days', trend: 'up', isSimulated: true },
  { id: 'insight-3', vendorId: 'vendor-microsoft', metric: 'Partners Reached', value: 34, unit: 'orgs', period: 'Last 30 days', trend: 'flat', isSimulated: true },
  { id: 'insight-4', vendorId: 'vendor-microsoft', metric: 'Avg. Read Time', value: 3.2, unit: 'min', period: 'Last 30 days', trend: 'up', isSimulated: true },
];
