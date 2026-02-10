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
  StoryCardsV1,
  PlayV1,
} from '../contracts';
import type { ActiveContext } from '../PartnerDataProvider';

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
    industry: 'Industrial / Elevators',
    region: 'EMEA',
    description: 'Global leader in elevator and escalator manufacturing with 70,000+ employees.',
  },
];

// ============= Demo Context =============

const WEEK_OF = '2026-02-09';

export const DEMO_CONTEXT: ActiveContext = {
  runId: 'demo-run-001',
  motionType: 'PARTNER',
  hubOrgId: 'hub-alpnova',
  primaryVendorId: 'vendor-microsoft',
  focusId: 'focus-schindler',
  weekOfDate: WEEK_OF,
};

const ENV = {
  runId: DEMO_CONTEXT.runId,
  focusId: DEMO_CONTEXT.focusId,
  hubOrgId: DEMO_CONTEXT.hubOrgId,
  primaryVendorId: DEMO_CONTEXT.primaryVendorId,
  weekOfDate: WEEK_OF,
  motionType: 'PARTNER' as const,
  isSimulated: true,
};

// ============= Extraction Run =============

export const DEMO_EXTRACTION_RUN: ExtractionRun = {
  ...ENV,
  promptVersion: 'v0.1-demo',
  createdAt: '2026-02-10T08:00:00Z',
  modulePacks: {
    module0A_hubOrg: {
      profile: 'AlpNova Digital — Azure Expert MSP with AI specialization. 120 consultants, DACH focus.',
      capabilities: ['Azure AI', 'M365 Copilot', 'Data Platform', 'Security & Compliance', 'Managed Services'],
      attachSurfaces: ['M365 E5', 'Azure AI Services', 'Purview', 'Defender'],
    },
    module0V_vendor: {
      vendorId: 'vendor-microsoft',
      vendorName: 'Microsoft',
      recentUpdates: [
        'Copilot governance controls now GA.',
        'Azure OpenAI expanded to Switzerland North.',
        'Partner incentive tiers updated for AI workload certifications.',
      ],
      incentives: [
        'AI Cloud Partner Program: 15% rebate on Azure AI consumption above $50K/month',
        'Copilot deployment bonus: $5K per qualified deployment (min 150 seats)',
      ],
    },
    module0B_focus: {
      focusId: 'focus-schindler',
      focusName: 'Schindler',
      industry: 'Industrial / Elevators',
      signals: [
        'Published sustainability report mentioning AI-driven energy optimization',
        'CTO spoke at Swiss Digital Economy conference about predictive maintenance',
        'Job postings for AI/ML Engineer and Data Platform Architect',
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
        { id: 'sig-001', signalType: 'Vendor', headline: 'Azure OpenAI Now Available in Switzerland North', soWhat: 'Removes data residency objection for Swiss-regulated workloads.', action: 'Lead with this to unblock compliance team.', source: 'Azure Updates Blog', publishedAt: '2026-02-07T10:00:00Z' },
        { id: 'sig-002', signalType: 'Regulatory', headline: 'EU Machinery Regulation Mandates Digital Twins by 2027', soWhat: 'Creates compliance urgency for elevator OEMs.', action: 'Position AI readiness as compliance prerequisite.', source: 'European Commission', publishedAt: '2026-02-05T14:00:00Z' },
        { id: 'sig-003', signalType: 'LocalMarket', headline: 'Swiss Manufacturing AI Adoption Reaches 35%', soWhat: 'Schindler risks falling behind peers.', action: 'Reference benchmark in executive conversations.', source: 'Swiss Digital Economy Report 2026', publishedAt: '2026-02-03T09:00:00Z' },
        { id: 'sig-004', signalType: 'Vendor', headline: 'Copilot for Field Service Enters Public Preview', soWhat: 'Directly relevant to 20K+ field technicians.', action: 'Propose Copilot Sprint scoped to field service.', source: 'Microsoft Dynamics 365 Blog', publishedAt: '2026-02-08T11:00:00Z' },
      ],
      marketContext: [
        'DACH industrial sector AI spending up 28% YoY',
        'Swiss data residency requirements tightening for critical infrastructure',
        'Competitor Kone announced AI partnership with Google Cloud',
      ],
    },
  },
};

// ============= Helper =============

function expiry(days: number): string {
  const d = new Date('2026-02-10T08:00:00Z');
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ============= A) Story Cards =============

const DEMO_STORY_CARDS: DerivedArtifact<StoryCardsV1> = {
  ...ENV,
  artifactId: 'art-stories-001',
  artifactType: 'storyCards',
  formatVersion: 'storyCards.v1',
  createdAt: '2026-02-10T08:10:00Z',
  content: {
    cards: [
      { cardId: 'sc-001', title: 'Azure OpenAI Now in Switzerland North', whatChanged: 'Azure OpenAI expanded to Switzerland North region.', whyItMatters: 'Removes data residency objection for Swiss-regulated workloads like Schindler.', expiresAt: expiry(12), tags: ['Vendor', 'Azure', 'Data Residency'], suggestedAction: 'Lead with this to unblock compliance team.', confidence: 'High', sources: [{ label: 'Azure Updates Blog', sourceType: 'url', url: 'https://azure.microsoft.com/updates' }], simulated: true },
      { cardId: 'sc-002', title: 'EU Machinery Regulation: Digital Twins by 2027', whatChanged: 'EU regulation requires machine-readable documentation for machinery.', whyItMatters: 'Elevator OEMs like Schindler must invest in digital twins — compliance deadline creates urgency.', expiresAt: expiry(14), tags: ['Regulatory', 'EU', 'Compliance'], suggestedAction: 'Position AI readiness assessment as compliance prerequisite.', confidence: 'High', sources: [{ label: 'European Commission', sourceType: 'url', url: 'https://ec.europa.eu' }], simulated: true },
      { cardId: 'sc-003', title: 'Swiss Manufacturing AI Adoption at 35%', whatChanged: 'Industry benchmark shows 35% AI adoption in Swiss manufacturing.', whyItMatters: 'Schindler risks falling behind peers — competitive pressure angle.', expiresAt: expiry(10), tags: ['LocalMarket', 'Benchmark'], suggestedAction: 'Reference benchmark in executive conversations.', confidence: 'Medium', sources: [{ label: 'Swiss Digital Economy Report 2026', sourceType: 'url' }], simulated: true },
      { cardId: 'sc-004', title: 'Copilot for Field Service in Public Preview', whatChanged: 'Microsoft launched Copilot for Field Service in public preview.', whyItMatters: 'Directly relevant to Schindler\'s 20K+ field technicians.', expiresAt: expiry(12), tags: ['Vendor', 'Copilot', 'Field Service'], suggestedAction: 'Propose Copilot Sprint scoped to field service.', packId: 'pkg-copilot', confidence: 'Medium', sources: [{ label: 'Dynamics 365 Blog', sourceType: 'url' }], simulated: true },
      { cardId: 'sc-005', title: 'Kone Partners with Google Cloud for AI', whatChanged: 'Competitor Kone announced AI partnership with Google Cloud.', whyItMatters: 'Creates competitive pressure — Schindler may lose first-mover advantage on Azure.', expiresAt: expiry(10), tags: ['Competitive', 'Google Cloud'], suggestedAction: 'Use competitive urgency in next CTO conversation.', confidence: 'Medium', sources: [{ label: 'Industry news', sourceType: 'internal_note' }], simulated: true },
      { cardId: 'sc-006', title: 'Partner Incentive Tiers Updated for AI', whatChanged: 'Microsoft updated partner incentive bands for AI workload certifications.', whyItMatters: 'AlpNova can unlock higher rebate bands by accelerating AI deployments.', expiresAt: expiry(21), tags: ['Vendor', 'Incentives'], suggestedAction: 'Review updated tier requirements with practice lead.', confidence: 'High', sources: [{ label: 'Partner Center', sourceType: 'url', url: 'https://partner.microsoft.com' }], simulated: true },
    ],
    simulated: true,
  },
};

// ============= B) Quick Brief — Seller =============

const DEMO_QB_SELLER: DerivedArtifact<QuickBriefV1> = {
  ...ENV,
  artifactId: 'art-qb-seller-001',
  artifactType: 'quickBrief',
  persona: 'seller',
  formatVersion: 'quickBrief.v1',
  createdAt: '2026-02-10T08:05:00Z',
  content: {
    whatChanged: [
      'Azure OpenAI is now available in Switzerland North — removes Schindler\'s data residency objection.',
      'EU Machinery Regulation mandates digital twins by 2027 — creates compliance urgency for elevator OEMs.',
      'Copilot for Field Service entered public preview — directly relevant to Schindler\'s 20K+ technicians.',
    ],
    soWhat: 'Schindler has a narrow window to act before regulatory deadlines and competitive pressure from Kone\'s Google Cloud partnership force reactive decisions.',
    actions: [
      'Lead next meeting with Switzerland North availability to unblock compliance team.',
      'Position AI Readiness Assessment as a compliance prerequisite for EU Machinery Regulation 2027.',
      'Propose a 30-day Copilot Sprint scoped to field service to demonstrate quick wins.',
    ],
    confidence: 'Medium',
    whatsMissing: [
      'Decision-maker authority level and budget ownership for AI initiatives.',
      'Current vendor relationships — are they already engaged with Google Cloud or AWS?',
      'Specific maintenance use case priorities from Schindler\'s operations team.',
    ],
    optionalEmail: {
      subject: 'Quick thought on AI for Schindler\'s field operations',
      body: 'Hi [Name],\n\nWith Azure OpenAI now in Switzerland North and the EU Machinery Regulation timeline firming up, I wanted to share thoughts on how AI could accelerate Schindler\'s predictive maintenance goals without data residency concerns.\n\nWe\'ve helped similar industrial companies get from idea to working prototype in 4–6 weeks.\n\nWorth a 15-minute call this week?\n\nBest,\n[Your name]',
    },
    sources: [
      { label: 'Azure Updates Blog', sourceType: 'url', url: 'https://azure.microsoft.com/updates' },
      { label: 'EU Machinery Regulation', sourceType: 'url', url: 'https://ec.europa.eu' },
      { label: 'Schindler CTO conference notes', sourceType: 'internal_note' },
    ],
    simulated: true,
  },
};

// ============= C) Quick Brief — Engineer =============

const DEMO_QB_ENGINEER: DerivedArtifact<QuickBriefV1> = {
  ...ENV,
  artifactId: 'art-qb-eng-001',
  artifactType: 'quickBrief',
  persona: 'engineer',
  formatVersion: 'quickBrief.v1',
  createdAt: '2026-02-10T08:05:00Z',
  content: {
    whatChanged: [
      'Azure OpenAI in Switzerland North enables in-country processing — validate Schindler\'s IoT Hub integration path.',
      'EU Machinery Regulation requires machine-readable documentation — assess RAG pipeline feasibility for maintenance manuals.',
      'Copilot for Field Service preview supports Dynamics 365 — check Schindler\'s ServiceNow vs. Dynamics positioning.',
    ],
    soWhat: 'Architecture decisions must account for hybrid on-prem/cloud (SAP + Azure), strict data residency, and 100+ country data silo consolidation.',
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
    simulated: true,
  },
};

// ============= D) Deal Brief =============

const DEMO_DEAL_BRIEF: DerivedArtifact<DealBriefV1> = {
  ...ENV,
  artifactId: 'art-db-001',
  artifactType: 'dealBrief',
  formatVersion: 'dealBrief.v1',
  createdAt: '2026-02-10T08:10:00Z',
  content: {
    dealObjective: 'Position AlpNova as Schindler\'s AI implementation partner for predictive maintenance and field service optimization on Azure.',
    currentSituation: 'Schindler is exploring AI for predictive maintenance. IoT Hub pilot in progress, regulatory pressure from EU Machinery Regulation 2027. No formal AI governance yet.',
    topSignals: [
      'Azure OpenAI now in Switzerland North — removes data residency blocker.',
      'EU Machinery Regulation mandates digital twins by 2027.',
      'Copilot for Field Service entered public preview.',
    ],
    stakeholders: [
      { name: 'TBD — CTO Office', role: 'Technology strategy owner', stance: 'Sponsor (likely)' },
      { name: 'TBD — VP Operations', role: 'Maintenance & field service', stance: 'Champion (likely)' },
      { name: 'TBD — CISO', role: 'Security & compliance', stance: 'Gatekeeper' },
    ],
    risks: [
      'No formal AI governance framework in place',
      'Maintenance data siloed across 100+ country operations',
      'Potential competing engagement with Google Cloud (Kone precedent)',
    ],
    proofArtifactsToAskFor: [
      'IoT Hub pilot technical architecture documentation',
      'Data residency requirements per country operation',
      'Current vendor evaluation status (Google Cloud, AWS)',
    ],
    executionPlan: [
      'Week 1–2: AI Readiness Assessment with CTO office',
      'Week 3–4: Copilot Sprint scoped to field service (30-day pilot)',
      'Week 5–6: RAG PoC for maintenance manual documentation',
      'Week 7–8: Governance Quickstart for EU compliance',
    ],
    recommendedPlays: [
      { playType: 'product', title: 'Azure OpenAI Data Residency — Switzerland North' },
      { playType: 'competitive', title: 'Azure vs. Google Cloud for Industrial AI' },
      { playType: 'objection', title: 'Handling "We\'re not ready for AI yet"' },
    ],
    openQuestions: [
      'Who owns the AI budget — CTO or VP Operations?',
      'Is Schindler already engaged with Google Cloud or AWS?',
      'What is the timeline for EU Machinery Regulation compliance?',
    ],
    sources: [
      { label: 'Azure Updates Blog', sourceType: 'url', url: 'https://azure.microsoft.com/updates' },
      { label: 'EU Machinery Regulation', sourceType: 'url', url: 'https://ec.europa.eu' },
      { label: 'Schindler CTO conference notes', sourceType: 'internal_note' },
    ],
    simulated: true,
  },
};

// ============= E) Play — Product =============

const DEMO_PLAY_PRODUCT: DerivedArtifact<PlayV1> = {
  ...ENV,
  artifactId: 'art-play-product-001',
  artifactType: 'play',
  playType: 'product',
  formatVersion: 'play.v1',
  createdAt: '2026-02-10T08:15:00Z',
  content: {
    title: 'Azure OpenAI Data Residency — Switzerland North',
    estMinutes: 5,
    modes: ['audio', 'read'],
    triggers: [
      'Customer raises data residency or sovereignty concerns.',
      'Compliance team blocks AI adoption due to cross-border data processing.',
      'Customer is evaluating Google Cloud or AWS for data locality.',
      'New Azure region announcement relevant to customer geography.',
    ],
    objective: 'Demonstrate that Azure OpenAI in Switzerland North eliminates data residency objections and enables Schindler to process sensitive maintenance data in-country.',
    talkTrack: [
      'Start with the news: Azure OpenAI is now generally available in Switzerland North.',
      'Explain what this means: Schindler can process elevator telemetry and maintenance data entirely within Swiss borders.',
      'Address the compliance angle: This satisfies FINMA-adjacent requirements and Swiss data protection law.',
      'Show the architecture: IoT Hub → Event Grid → Azure OpenAI (Switzerland North) → Predictive Maintenance API.',
      'Differentiate from Google Cloud: GCP does not offer equivalent AI services in Switzerland.',
      'Quantify the benefit: Removes 4–6 week compliance review cycle for AI workloads.',
      'Close with the ask: Propose a 2-week PoC using Switzerland North for predictive maintenance.',
    ],
    objections: [
      { objection: 'We need data to stay in Switzerland.', response: 'Azure OpenAI is now GA in Switzerland North — all processing stays in-country.', whatNotToSay: 'Don\'t say "we can route through EU regions" — it undermines the Switzerland-specific message.', proofArtifact: 'Azure region availability matrix (link)' },
      { objection: 'Google Cloud also has a Zurich region.', response: 'True, but GCP doesn\'t offer equivalent AI model hosting in Switzerland. Azure OpenAI is unique here.', whatNotToSay: 'Don\'t dismiss Google Cloud entirely — acknowledge their Zurich presence.', proofArtifact: 'GCP vs Azure AI service comparison (internal doc)' },
      { objection: 'Our compliance team needs 6 months to approve.', response: 'We can run a sandboxed PoC in 2 weeks using anonymized data — no compliance approval needed for the pilot.', whatNotToSay: 'Don\'t promise compliance approval shortcuts.', proofArtifact: 'PoC sandbox architecture template' },
      { objection: 'We\'re not sure about Azure AI capabilities.', response: 'Azure OpenAI offers GPT-4, embeddings, and fine-tuning — same models as OpenAI but with enterprise controls.', whatNotToSay: 'Don\'t compare raw model benchmarks — focus on enterprise readiness.', proofArtifact: 'Azure OpenAI capabilities overview' },
      { objection: 'What about latency from Switzerland North?', response: 'Switzerland North is optimized for DACH workloads. Latency is comparable to West Europe for API calls.', whatNotToSay: 'Don\'t speculate on exact latency numbers without testing.', proofArtifact: 'Azure latency test results (internal)' },
    ],
    proofArtifacts: [
      'Azure region availability matrix — Switzerland North GA announcement',
      'Azure OpenAI Switzerland North architecture diagram',
      'GCP vs Azure AI service comparison for DACH region',
      'PoC sandbox architecture template for data residency workloads',
      'Case study: Swiss financial services firm using Azure OpenAI in-country',
    ],
    discoveryPrompts: [
      'What types of data would you want to process with AI? Maintenance logs, telemetry, manuals?',
      'Which compliance frameworks govern your data processing? FINMA, GDPR, Swiss DPA?',
      'Have you evaluated any other cloud providers for AI services in Switzerland?',
      'What\'s your current approval process for new cloud services?',
      'How are you handling data classification for IoT telemetry today?',
      'Who in your organization owns the data residency policy?',
    ],
    nextActions: [
      'Share Switzerland North architecture diagram with Schindler CTO office.',
      'Propose 2-week sandboxed PoC using anonymized maintenance data.',
      'Schedule technical deep-dive with Schindler\'s IoT team.',
    ],
    redFlags: [
      'Customer insists on on-premises only — no cloud appetite at all.',
      'Compliance team has a blanket ban on external AI services.',
      'Customer is already deep in a Google Cloud engagement with signed contracts.',
    ],
    sources: [
      { label: 'Azure Updates Blog', sourceType: 'url', url: 'https://azure.microsoft.com/updates' },
      { label: 'Azure region availability', sourceType: 'url', url: 'https://azure.microsoft.com/regions' },
      { label: 'Internal competitive analysis', sourceType: 'internal_note' },
    ],
    lastReviewed: '2026-02-10T08:00:00Z',
    simulated: true,
  },
};

// ============= F) Play — Competitive =============

const DEMO_PLAY_COMPETITIVE: DerivedArtifact<PlayV1> = {
  ...ENV,
  artifactId: 'art-play-competitive-001',
  artifactType: 'play',
  playType: 'competitive',
  formatVersion: 'play.v1',
  createdAt: '2026-02-10T08:15:00Z',
  content: {
    title: 'Azure vs. Google Cloud for Industrial AI',
    estMinutes: 6,
    modes: ['audio', 'read'],
    triggers: [
      'Customer mentions evaluating Google Cloud for AI workloads.',
      'Competitor (e.g. Kone) announces a Google Cloud AI partnership.',
      'Customer asks about multi-cloud AI strategy.',
      'Google Cloud announces new industrial AI capabilities.',
    ],
    objective: 'Position Azure as the superior platform for industrial AI workloads by emphasizing enterprise integration, data residency, and partner ecosystem advantages over Google Cloud.',
    talkTrack: [
      'Acknowledge Google Cloud\'s strengths: strong in data analytics and ML research.',
      'Pivot to enterprise readiness: Azure offers deeper integration with existing Microsoft stack (M365, Dynamics, SAP).',
      'Highlight data residency: Azure OpenAI in Switzerland North — GCP lacks equivalent AI hosting in Switzerland.',
      'Emphasize IoT integration: Azure IoT Hub + Digital Twins is purpose-built for industrial scenarios.',
      'Show the ecosystem: AlpNova + Microsoft partner network vs. Google\'s thinner partner coverage in DACH.',
      'Address the Kone precedent: Kone chose GCP, but their use case (consumer analytics) differs from Schindler\'s (maintenance/compliance).',
      'Quantify switching cost: Schindler is already on Azure — adding AI to existing stack is faster than multi-cloud.',
      'Close: Position Azure as the lower-risk, faster-to-value path for Schindler\'s specific needs.',
    ],
    objections: [
      { objection: 'Google Cloud has better AI/ML tools.', response: 'GCP excels at research-grade ML, but Azure OpenAI offers production-ready enterprise AI with governance and compliance built in.', whatNotToSay: 'Don\'t say GCP is bad at AI — acknowledge their strengths in ML research.', proofArtifact: 'Azure vs GCP enterprise AI comparison' },
      { objection: 'Kone chose Google Cloud — shouldn\'t we follow?', response: 'Kone\'s use case was consumer analytics. Schindler\'s priority is predictive maintenance with data residency — Azure is purpose-built for this.', whatNotToSay: 'Don\'t dismiss Kone\'s decision — instead differentiate the use case.', proofArtifact: 'Kone vs Schindler use case analysis (internal)' },
      { objection: 'We want to avoid vendor lock-in.', response: 'Azure supports open models (Llama, Mistral) alongside OpenAI. You\'re not locked into one model provider.', whatNotToSay: 'Don\'t claim Azure is fully open — acknowledge it\'s a platform choice.', proofArtifact: 'Azure AI model catalog documentation' },
      { objection: 'Google Cloud is cheaper for AI workloads.', response: 'Price depends on usage pattern. Azure\'s partner incentives (15% rebate above $50K/mo) can significantly reduce effective cost.', whatNotToSay: 'Don\'t get into a line-item price war — focus on total value.', proofArtifact: 'Azure AI pricing + partner incentive calculator' },
      { objection: 'We\'re considering a multi-cloud approach.', response: 'Multi-cloud adds complexity. For AI specifically, consolidating on Azure gives you better governance, simpler data pipelines, and faster time-to-value.', whatNotToSay: 'Don\'t say multi-cloud is always wrong — acknowledge the strategic appeal but quantify the cost.', proofArtifact: 'Multi-cloud complexity analysis for AI workloads' },
    ],
    proofArtifacts: [
      'Azure vs GCP enterprise AI feature comparison matrix',
      'Azure OpenAI Switzerland North vs GCP Zurich — AI service availability',
      'Kone vs Schindler use case differentiation analysis',
      'Azure AI model catalog — open model support documentation',
      'Partner incentive calculator for Azure AI workloads',
      'Case study: Industrial manufacturer migrating from GCP to Azure for AI',
    ],
    discoveryPrompts: [
      'What specifically attracted you to Google Cloud for AI?',
      'Are you looking at GCP for all workloads or specifically AI/ML?',
      'How important is data residency in your AI platform decision?',
      'What\'s your current Azure footprint — are you already running production workloads?',
      'Who is driving the multi-cloud evaluation — IT, procurement, or a specific business unit?',
      'Have you factored in integration costs with your existing SAP and ServiceNow stack?',
    ],
    nextActions: [
      'Prepare Azure vs GCP comparison tailored to Schindler\'s specific requirements.',
      'Schedule competitive positioning session with Microsoft field team.',
      'Share Kone use case differentiation with Schindler\'s CTO office.',
    ],
    redFlags: [
      'Customer has already signed a multi-year GCP commitment.',
      'Decision is driven purely by a single team\'s preference, not enterprise strategy.',
      'Customer\'s existing Azure footprint is minimal — switching cost argument weakens.',
    ],
    sources: [
      { label: 'Azure vs GCP competitive brief', sourceType: 'internal_note' },
      { label: 'Kone-Google Cloud announcement', sourceType: 'url' },
      { label: 'Azure AI model catalog', sourceType: 'url', url: 'https://azure.microsoft.com/products/ai-model-catalog' },
    ],
    lastReviewed: '2026-02-10T08:00:00Z',
    simulated: true,
  },
};

// ============= G) Play — Objection =============

const DEMO_PLAY_OBJECTION: DerivedArtifact<PlayV1> = {
  ...ENV,
  artifactId: 'art-play-objection-001',
  artifactType: 'play',
  playType: 'objection',
  formatVersion: 'play.v1',
  createdAt: '2026-02-10T08:15:00Z',
  content: {
    title: 'Handling "We\'re Not Ready for AI Yet"',
    estMinutes: 4,
    modes: ['audio', 'read'],
    triggers: [
      'Customer says "We\'re not ready for AI" or "It\'s too early for us."',
      'Stakeholder expresses skepticism about AI maturity.',
      'Budget holder pushes AI to next fiscal year.',
      'Technical team says data isn\'t clean enough for AI.',
    ],
    objective: 'Reframe "not ready" from a blocker into a starting point — position AI readiness assessment as the logical first step rather than a full AI deployment.',
    talkTrack: [
      'Validate the concern: "That\'s exactly the right question to ask — most companies aren\'t fully ready, and that\'s normal."',
      'Reframe readiness: "Being \'ready for AI\' isn\'t binary. It\'s about knowing where you are and what gaps to close first."',
      'Introduce the assessment: "An AI Readiness Assessment takes 2–3 weeks and gives you a clear picture of where to start."',
      'Show the output: "You\'ll get a prioritized use case roadmap, a readiness score, and a realistic timeline."',
      'Address the risk: "The bigger risk is waiting. Kone is already partnering with Google Cloud. Regulatory deadlines are approaching."',
      'Make it low-commitment: "This isn\'t a deployment — it\'s a diagnostic. No infrastructure changes, no production risk."',
      'Close: "Can we schedule a 90-minute workshop with your CTO office to scope the assessment?"',
    ],
    objections: [
      { objection: 'We don\'t have the data for AI.', response: 'You don\'t need perfect data to start. The readiness assessment identifies what data you have, what\'s missing, and how to close gaps.', whatNotToSay: 'Don\'t say "your data is fine" without evidence — validate their concern first.', proofArtifact: 'AI Readiness Assessment sample output' },
      { objection: 'Our team doesn\'t have AI skills.', response: 'That\'s exactly what a partner like AlpNova provides. We bring the AI expertise; your team brings the domain knowledge.', whatNotToSay: 'Don\'t imply their team is behind — position it as a partnership.', proofArtifact: 'AlpNova AI capability overview' },
      { objection: 'AI is overhyped — we\'ll wait for it to mature.', response: 'The technology is already production-ready. Azure OpenAI powers thousands of enterprise workloads. The question is when to start, not whether.', whatNotToSay: 'Don\'t argue about hype — redirect to concrete enterprise deployments.', proofArtifact: 'Azure OpenAI enterprise deployment case studies' },
      { objection: 'We have other priorities right now.', response: 'Understood. An AI readiness assessment actually helps you prioritize — it shows which AI use cases deliver ROI fastest relative to your existing initiatives.', whatNotToSay: 'Don\'t dismiss their other priorities — show how AI assessment complements them.', proofArtifact: 'Use case prioritization framework' },
      { objection: 'Our board hasn\'t approved AI investments.', response: 'The readiness assessment produces exactly the business case your board needs — ROI estimates, risk assessment, and a phased roadmap.', whatNotToSay: 'Don\'t bypass the board — help the champion build the case.', proofArtifact: 'Board-ready AI business case template' },
    ],
    proofArtifacts: [
      'AI Readiness Assessment sample output — anonymized industrial customer',
      'AlpNova AI capability overview and team credentials',
      'Azure OpenAI enterprise deployment case studies (3 examples)',
      'Use case prioritization framework with ROI scoring',
      'Board-ready AI business case template',
      'EU Machinery Regulation 2027 compliance timeline',
    ],
    discoveryPrompts: [
      'When you say "not ready," what specifically concerns you — data, skills, budget, or governance?',
      'Have you explored AI at all — even informal experiments or proofs of concept?',
      'What would "ready for AI" look like in your organization?',
      'Are there specific use cases your leadership has discussed, even informally?',
      'How does AI fit into your digital transformation roadmap?',
      'If you could solve one operational problem with AI, what would it be?',
      'What would you need to see to feel confident taking a first step?',
    ],
    nextActions: [
      'Send AI Readiness Assessment overview with sample output.',
      'Schedule 90-minute scoping workshop with CTO office.',
      'Share board-ready business case template as a preview of deliverables.',
    ],
    redFlags: [
      'Customer has a genuine technology moratorium — no new platform investments for 12+ months.',
      'Skepticism comes from the CEO, not just a single stakeholder.',
      'Customer recently had a failed AI/ML project and is risk-averse.',
      'No internal champion willing to sponsor even an exploratory engagement.',
    ],
    sources: [
      { label: 'AI Readiness Assessment methodology', sourceType: 'internal_note' },
      { label: 'Enterprise AI adoption benchmarks', sourceType: 'internal_note' },
      { label: 'EU Machinery Regulation overview', sourceType: 'url', url: 'https://ec.europa.eu' },
    ],
    lastReviewed: '2026-02-10T08:00:00Z',
    simulated: true,
  },
};

// ============= Package Recommendations =============

const DEMO_PACKAGE_RECS: DerivedArtifact<PackageRecsV1> = {
  ...ENV,
  artifactId: 'art-pkg-001',
  artifactType: 'packageRecs',
  formatVersion: 'packageRecs.v1',
  createdAt: '2026-02-10T08:10:00Z',
  content: {
    recommendations: [
      { packageId: 'pkg-readiness', packageName: 'AI Readiness & Use Case Prioritization', fitLabel: 'Easy attach', reason: 'Schindler has multiple AI ambitions but no prioritization framework.', suggestedTier: 'better' },
      { packageId: 'pkg-governance', packageName: 'AI Governance Quickstart', fitLabel: 'Easy attach', reason: 'EU Machinery Regulation 2027 creates compliance urgency.', suggestedTier: 'good' },
      { packageId: 'pkg-copilot', packageName: 'Copilot Adoption Sprint', fitLabel: 'Net-new build', reason: 'Copilot for Field Service preview is directly relevant to 20K+ technicians.', suggestedTier: 'good' },
    ],
  },
};

// ============= Canonical Packages =============

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
  { id: 'pkg-governance', name: 'AI Governance Quickstart', category: 'governance', shortOutcome: 'Operational AI governance framework.', timebox: '3–4 weeks', indicativeRange: '$20K–$85K' },
  { id: 'pkg-copilot', name: 'Copilot Adoption Sprint', category: 'copilot-adoption', shortOutcome: 'Rapid Copilot deployment with measurable adoption.', timebox: '4–6 weeks', indicativeRange: '$18K–$80K' },
  { id: 'pkg-rag', name: 'RAG Accelerator', category: 'rag', shortOutcome: 'Production-ready RAG pipeline.', timebox: '4–6 weeks', indicativeRange: '$25K–$90K' },
  { id: 'pkg-security', name: 'AI Security & Privacy Review', category: 'security-review', shortOutcome: 'Security assessment for AI workloads.', timebox: '2–3 weeks', indicativeRange: '$15K–$45K' },
  { id: 'pkg-finops', name: 'FinOps for AI', category: 'finops', shortOutcome: 'Cost optimization framework for AI services.', timebox: '2–4 weeks', indicativeRange: '$12K–$40K' },
];

// ============= All Artifacts =============

// Default: hand-crafted demo artifacts
const HANDCRAFTED_ARTIFACTS: DerivedArtifact[] = [
  DEMO_STORY_CARDS,
  DEMO_QB_SELLER,
  DEMO_QB_ENGINEER,
  DEMO_DEAL_BRIEF,
  DEMO_PLAY_PRODUCT,
  DEMO_PLAY_COMPETITIVE,
  DEMO_PLAY_OBJECTION,
  DEMO_PACKAGE_RECS,
];

// ============= Bundle Import (paste & uncomment to swap) =============
// import { normalizeBundle } from './importArtifactBundle';
// const IMPORTED_ARTIFACTS = normalizeBundle({ ...paste bundle JSON here... });

export const DEMO_ARTIFACTS: DerivedArtifact[] = HANDCRAFTED_ARTIFACTS;
// To use an imported bundle instead: export const DEMO_ARTIFACTS = IMPORTED_ARTIFACTS;
