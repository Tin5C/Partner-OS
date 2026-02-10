// Demo Dataset — Single Source of Truth for Partner Demo
// HUB ORG: AlpNova Digital | FOCUS: Schindler | VENDOR: Microsoft (primary)

import type {
  HubOrg,
  Vendor,
  FocusEntity,
  ExtractionRun,
  DerivedArtifact,
  QuickBriefV1,
  DealBriefV1,
  PackageRecsV1,
  StoryCardV1,
} from '../contracts';

// ============= Hub Org =============

export const DEMO_HUB_ORG: HubOrg = {
  id: 'hub-alpnova',
  name: 'AlpNova Digital',
  motionType: 'PARTNER',
  region: 'DACH',
  description: 'Mid-market SI specializing in Azure-based AI, modern workplace, and data platform services across DACH.',
};

// ============= Vendors =============

export const DEMO_VENDORS: Vendor[] = [
  { id: 'vendor-microsoft', name: 'Microsoft', isPrimary: true, tags: ['Azure', 'M365', 'Copilot'], logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { id: 'vendor-openai', name: 'OpenAI', isPrimary: false, tags: ['GPT', 'API'] },
  { id: 'vendor-anthropic', name: 'Anthropic', isPrimary: false, tags: ['Claude', 'Safety'] },
  { id: 'vendor-mistral', name: 'Mistral', isPrimary: false, tags: ['Open-weight', 'EU'] },
];

// ============= Focus Entities =============

export const DEMO_FOCUS_ENTITIES: FocusEntity[] = [
  {
    id: 'focus-schindler',
    name: 'Schindler',
    industry: 'Industrial / Elevator & Escalator',
    region: 'DACH (HQ: Ebikon, Switzerland)',
    description: 'Global leader in elevator and escalator manufacturing with 70,000+ employees. Exploring AI for predictive maintenance, field service optimization, and safety compliance.',
  },
];

// ============= Extraction Run =============

const WEEK_OF = '2026-02-09';

export const DEMO_EXTRACTION_RUN: ExtractionRun = {
  runId: 'run-demo-001',
  motionType: 'PARTNER',
  hubOrgId: 'hub-alpnova',
  focusId: 'focus-schindler',
  primaryVendorId: 'vendor-microsoft',
  weekOfDate: WEEK_OF,
  promptVersion: 'v0.1-demo',
  isSimulated: true,
  createdAt: '2026-02-10T08:00:00Z',
  modulePacks: {
    module0A_hubOrg: {
      profile: 'AlpNova Digital — Azure Expert MSP with AI specialization. 120 consultants, DACH focus. Strong in M365, Data & AI, Security.',
      capabilities: ['Azure AI', 'M365 Copilot', 'Data Platform', 'Security & Compliance', 'Managed Services'],
      attachSurfaces: ['M365 E5', 'Azure AI Services', 'Purview', 'Defender'],
    },
    module0V_vendor: {
      vendorId: 'vendor-microsoft',
      vendorName: 'Microsoft',
      recentUpdates: [
        'Copilot governance controls now GA — admin policies for data access and response behavior.',
        'Azure OpenAI expanded to Switzerland North — enables data residency for Swiss regulated workloads.',
        'Partner incentive tiers updated: AI workload certifications unlock higher rebate bands.',
      ],
      incentives: [
        'AI Cloud Partner Program: 15% rebate on Azure AI consumption above $50K/month',
        'Copilot deployment bonus: $5K per qualified deployment (min 150 seats)',
      ],
    },
    module0B_focus: {
      focusId: 'focus-schindler',
      focusName: 'Schindler',
      industry: 'Industrial / Elevator & Escalator',
      signals: [
        'Published sustainability report mentioning AI-driven energy optimization in buildings',
        'CTO spoke at Swiss Digital Economy conference about predictive maintenance ambitions',
        'Job postings for "AI/ML Engineer" and "Data Platform Architect" on their careers page',
      ],
      knownStack: ['Azure (confirmed)', 'SAP S/4HANA', 'ServiceNow', 'IoT Hub (pilot)'],
      painPoints: [
        'Field technician dispatching is reactive, not predictive',
        'Maintenance data siloed across 100+ country operations',
        'Regulatory compliance burden increasing (EU Machinery Regulation 2027)',
      ],
    },
    module1_weekly: {
      weekOfDate: WEEK_OF,
      selectedSignals: [
        {
          id: 'sig-001',
          signalType: 'Vendor',
          headline: 'Azure OpenAI Now Available in Switzerland North',
          soWhat: 'Removes the data residency objection for Swiss-regulated workloads — Schindler can now process data in-country.',
          action: 'Lead with this in the next meeting to unblock their compliance team.',
          source: 'Azure Updates Blog',
          publishedAt: '2026-02-07T10:00:00Z',
        },
        {
          id: 'sig-002',
          signalType: 'Regulatory',
          headline: 'EU Machinery Regulation Mandates Digital Twins by 2027',
          soWhat: 'Elevator OEMs like Schindler must provide digital documentation — creates urgency for AI/IoT investment.',
          action: 'Position AI readiness assessment as compliance prerequisite.',
          source: 'European Commission',
          publishedAt: '2026-02-05T14:00:00Z',
        },
        {
          id: 'sig-003',
          signalType: 'LocalMarket',
          headline: 'Swiss Manufacturing AI Adoption Reaches 35%',
          soWhat: 'Schindler risks falling behind peers if they delay AI investment — competitive pressure angle.',
          action: 'Reference industry benchmark in executive conversations.',
          source: 'Swiss Digital Economy Report 2026',
          publishedAt: '2026-02-03T09:00:00Z',
        },
        {
          id: 'sig-004',
          signalType: 'Vendor',
          headline: 'Copilot for Field Service Enters Public Preview',
          soWhat: 'Directly relevant to Schindler\'s 20,000+ field technicians — natural entry point for productivity gains.',
          action: 'Propose a Copilot Sprint scoped to field service team.',
          source: 'Microsoft Dynamics 365 Blog',
          publishedAt: '2026-02-08T11:00:00Z',
        },
      ],
      marketContext: [
        'DACH industrial sector AI spending up 28% YoY',
        'Swiss data residency requirements tightening for critical infrastructure',
        'Competitor Kone announced AI partnership with Google Cloud',
      ],
    },
  },
};

// ============= Derived Artifacts =============

// -- Quick Brief (Seller) --

export const DEMO_QUICK_BRIEF_SELLER: DerivedArtifact<QuickBriefV1> = {
  artifactId: 'art-qb-seller-001',
  runId: 'run-demo-001',
  artifactType: 'quickBrief',
  persona: 'seller',
  formatVersion: 'quickBrief.v1',
  isSimulated: true,
  createdAt: '2026-02-10T08:05:00Z',
  content: {
    whatChanged: [
      'Azure OpenAI is now available in Switzerland North — removes Schindler\'s data residency objection.',
      'EU Machinery Regulation mandates digital twins by 2027 — creates compliance urgency for elevator OEMs.',
      'Copilot for Field Service entered public preview — directly relevant to Schindler\'s 20K+ technicians.',
    ],
    soWhat: 'Schindler has a narrow window to act before regulatory deadlines and competitive pressure from Kone\'s Google Cloud partnership force reactive decisions.',
    actions: [
      'Lead next meeting with Switzerland North availability to unblock compliance team approval.',
      'Position AI Readiness Assessment as a compliance prerequisite for EU Machinery Regulation 2027.',
      'Propose a 30-day Copilot Sprint scoped to field service to demonstrate quick wins.',
    ],
    confidence: 'Medium',
    whatsMissing: [
      'Decision-maker authority level and budget ownership for AI initiatives.',
      'Current vendor relationships — are they already engaged with Google Cloud or AWS?',
      'Specific maintenance use case priorities from Schindler\'s operations team.',
    ],
    emailDraft: {
      subject: 'Quick thought on AI for Schindler\'s field operations',
      body: 'Hi [Name],\n\nWith Azure OpenAI now available in Switzerland North and the EU Machinery Regulation timeline firming up, I wanted to share a few thoughts on how AI could accelerate Schindler\'s predictive maintenance goals without the data residency concerns.\n\nWe\'ve helped similar industrial companies get from idea to working prototype in 4–6 weeks.\n\nWorth a 15-minute call this week?\n\nBest,\n[Your name]',
    },
    sources: [
      { label: 'Azure Updates Blog', sourceType: 'url', url: 'https://azure.microsoft.com/updates' },
      { label: 'EU Machinery Regulation', sourceType: 'url', url: 'https://ec.europa.eu' },
      { label: 'Schindler CTO conference notes', sourceType: 'internal_note' },
      { label: 'Partner Center incentive update', sourceType: 'url', url: 'https://partner.microsoft.com' },
    ],
  },
};

// -- Quick Brief (Engineer) --

export const DEMO_QUICK_BRIEF_ENGINEER: DerivedArtifact<QuickBriefV1> = {
  artifactId: 'art-qb-eng-001',
  runId: 'run-demo-001',
  artifactType: 'quickBrief',
  persona: 'engineer',
  formatVersion: 'quickBrief.v1',
  isSimulated: true,
  createdAt: '2026-02-10T08:05:00Z',
  content: {
    whatChanged: [
      'Azure OpenAI in Switzerland North enables in-country processing — validate Schindler\'s IoT Hub integration path.',
      'EU Machinery Regulation requires machine-readable documentation — assess RAG pipeline feasibility for maintenance manuals.',
      'Copilot for Field Service preview supports Dynamics 365 — check Schindler\'s ServiceNow vs. Dynamics positioning.',
    ],
    soWhat: 'Architecture decisions need to account for hybrid on-prem/cloud (SAP + Azure), strict data residency, and 100+ country data silo consolidation.',
    actions: [
      'Map Schindler\'s current IoT Hub pilot architecture before proposing any AI overlay.',
      'Validate data residency compliance path: Azure OpenAI Switzerland North + Purview for classification.',
      'Prepare a lightweight PoC architecture: IoT Hub → Azure OpenAI → predictive maintenance API.',
    ],
    confidence: 'Medium',
    whatsMissing: [
      'IoT Hub pilot architecture details and data volume estimates.',
      'SAP S/4HANA integration requirements and API availability.',
      'Security classification of maintenance data across country operations.',
    ],
    sources: [
      { label: 'Azure region availability', sourceType: 'url', url: 'https://azure.microsoft.com/regions' },
      { label: 'Schindler careers page — job postings', sourceType: 'url' },
      { label: 'IoT Hub architecture docs', sourceType: 'internal_note' },
    ],
  },
};

// -- Deal Brief Prefill --

export const DEMO_DEAL_BRIEF: DerivedArtifact<DealBriefV1> = {
  artifactId: 'art-db-001',
  runId: 'run-demo-001',
  artifactType: 'dealBrief',
  formatVersion: 'dealBrief.v1',
  isSimulated: true,
  createdAt: '2026-02-10T08:10:00Z',
  content: {
    customerName: 'Schindler',
    dealMotion: 'new-logo',
    scope: 'AI for predictive maintenance and field service optimization',
    aiUseCases: [
      'Predictive maintenance for elevator fleet using IoT sensor data',
      'Field technician dispatching optimization with AI scheduling',
      'Automated compliance documentation for EU Machinery Regulation',
    ],
    constraints: [
      'Data must remain in Switzerland (regulatory requirement)',
      'SAP S/4HANA integration required for maintenance workflows',
      'Security classification needed for cross-country data consolidation',
    ],
    sellerNarrative: 'Schindler is a global industrial leader exploring AI to transform reactive maintenance into predictive operations. With 70,000+ employees and regulatory pressure from the EU Machinery Regulation 2027, there\'s a clear window to position AlpNova as the implementation partner for their Azure AI journey.',
    engineerArchitecture: 'Recommended architecture: IoT Hub (existing pilot) → Event Grid → Azure OpenAI (Switzerland North) → Predictive Maintenance API → ServiceNow/SAP integration. Start with a RAG pipeline over maintenance manuals for the compliance documentation use case.',
    readinessScore: 42,
    topBlockers: [
      'No formal AI governance framework in place',
      'Maintenance data siloed across 100+ country operations',
      'IoT Hub pilot not yet connected to central AI processing',
    ],
    missingChecklist: [
      'Decision-maker identification and budget authority',
      'IoT Hub pilot technical architecture documentation',
      'Data residency requirements per country operation',
      'Current vendor evaluations (Google Cloud, AWS status)',
      'Maintenance data classification and access policies',
    ],
  },
};

// -- Package Recommendations --

export const DEMO_PACKAGE_RECS: DerivedArtifact<PackageRecsV1> = {
  artifactId: 'art-pkg-001',
  runId: 'run-demo-001',
  artifactType: 'packageRecs',
  formatVersion: 'packageRecs.v1',
  isSimulated: true,
  createdAt: '2026-02-10T08:10:00Z',
  content: {
    recommendations: [
      {
        packageId: 'pkg-readiness',
        packageName: 'AI Readiness & Use Case Prioritization',
        fitLabel: 'Easy attach',
        reason: 'Schindler has multiple AI ambitions but no prioritization framework — this package structures the conversation and builds the business case.',
        suggestedTier: 'better',
      },
      {
        packageId: 'pkg-governance',
        packageName: 'AI Governance Quickstart',
        fitLabel: 'Easy attach',
        reason: 'EU Machinery Regulation 2027 creates compliance urgency — governance framework is a prerequisite before scaling AI workloads.',
        suggestedTier: 'good',
      },
      {
        packageId: 'pkg-copilot',
        packageName: 'Copilot Adoption Sprint',
        fitLabel: 'Net-new build',
        reason: 'Copilot for Field Service preview is directly relevant to 20K+ technicians — but requires Dynamics 365 positioning vs. existing ServiceNow.',
        suggestedTier: 'good',
      },
    ],
  },
};

// -- Story Cards (derived from module1_weekly signals) --

function getExpiryDate(daysFromNow: number = 10): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

export const DEMO_STORY_CARDS: DerivedArtifact<StoryCardV1[]> = {
  artifactId: 'art-stories-001',
  runId: 'run-demo-001',
  artifactType: 'storyCards',
  formatVersion: 'storyCards.v1',
  isSimulated: true,
  createdAt: '2026-02-10T08:10:00Z',
  content: [
    {
      id: 'story-001',
      signalType: 'Vendor',
      headline: 'Azure OpenAI Now Available in Switzerland North',
      soWhat: 'Removes data residency objection for Swiss-regulated workloads.',
      action: 'Lead with this to unblock compliance team.',
      source: 'Azure Updates Blog',
      publishedAt: '2026-02-07T10:00:00Z',
      expiresAt: getExpiryDate(12),
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
    {
      id: 'story-002',
      signalType: 'Regulatory',
      headline: 'EU Machinery Regulation Mandates Digital Twins by 2027',
      soWhat: 'Creates compliance urgency for elevator OEMs like Schindler.',
      action: 'Position AI readiness as compliance prerequisite.',
      source: 'European Commission',
      publishedAt: '2026-02-05T14:00:00Z',
      expiresAt: getExpiryDate(14),
    },
    {
      id: 'story-003',
      signalType: 'LocalMarket',
      headline: 'Swiss Manufacturing AI Adoption Reaches 35%',
      soWhat: 'Schindler risks falling behind peers if they delay.',
      action: 'Reference benchmark in executive conversations.',
      source: 'Swiss Digital Economy Report 2026',
      publishedAt: '2026-02-03T09:00:00Z',
      expiresAt: getExpiryDate(10),
    },
    {
      id: 'story-004',
      signalType: 'Vendor',
      headline: 'Copilot for Field Service Enters Public Preview',
      soWhat: 'Directly relevant to Schindler\'s 20K+ field technicians.',
      action: 'Propose Copilot Sprint scoped to field service.',
      source: 'Microsoft Dynamics 365 Blog',
      publishedAt: '2026-02-08T11:00:00Z',
      expiresAt: getExpiryDate(12),
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
  ],
};

// ============= Canonical Packages (structured reference, not marketplace) =============

export interface CanonicalPackage {
  id: string;
  name: string;
  category: string;
  shortOutcome: string;
  timebox: string;
  indicativeRange: string;
}

export const CANONICAL_PACKAGES: CanonicalPackage[] = [
  { id: 'pkg-readiness', name: 'AI Readiness & Use Case Prioritization', category: 'data-readiness', shortOutcome: 'Prioritized AI use case roadmap with readiness score.', timebox: '2–3 weeks', indicativeRange: '$15K–$75K' },
  { id: 'pkg-governance', name: 'AI Governance Quickstart', category: 'governance', shortOutcome: 'Operational AI governance framework with policies and monitoring.', timebox: '3–4 weeks', indicativeRange: '$20K–$85K' },
  { id: 'pkg-copilot', name: 'Copilot Adoption Sprint', category: 'copilot-adoption', shortOutcome: 'Rapid Copilot deployment with measurable adoption in 4 weeks.', timebox: '4–6 weeks', indicativeRange: '$18K–$80K' },
  { id: 'pkg-rag', name: 'RAG Accelerator', category: 'rag', shortOutcome: 'Production-ready RAG pipeline from unstructured data to intelligent search.', timebox: '4–6 weeks', indicativeRange: '$25K–$90K' },
  { id: 'pkg-security', name: 'AI Security & Privacy Review', category: 'security-review', shortOutcome: 'Security assessment and remediation plan for AI workloads.', timebox: '2–3 weeks', indicativeRange: '$15K–$45K' },
  { id: 'pkg-finops', name: 'FinOps for AI', category: 'finops', shortOutcome: 'Cost monitoring and optimization framework for AI services.', timebox: '2–4 weeks', indicativeRange: '$12K–$40K' },
];

// ============= All Artifacts =============

export const DEMO_ARTIFACTS: DerivedArtifact[] = [
  DEMO_QUICK_BRIEF_SELLER,
  DEMO_QUICK_BRIEF_ENGINEER,
  DEMO_DEAL_BRIEF,
  DEMO_PACKAGE_RECS,
  DEMO_STORY_CARDS,
];
