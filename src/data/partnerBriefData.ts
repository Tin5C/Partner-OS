// Partner Brief Data Model — AI Deal Brief
// Rules-based recommendations for AI-focused partner selling
// Supports Seller and Engineer persona outputs

// ============= Evidence & Extracted Signals Types =============

export interface EvidenceUpload {
  id: string;
  type: 'screenshot' | 'document';
  filename: string;
  uploadedAt: Date;
}

export interface EvidenceLink {
  id: string;
  url: string;
  type: 'website' | 'careers' | 'product' | 'other';
}

export interface ExtractedSignal {
  id: string;
  label: string;
  confidence: 'Low' | 'Medium' | 'High';
  confirmed: boolean;
}

export interface ExtractedSignals {
  applications: ExtractedSignal[];
  architecture: ExtractedSignal[];
  licenses: ExtractedSignal[];
}

export interface EvidenceState {
  uploads: EvidenceUpload[];
  links: EvidenceLink[];
  extractedSignals: ExtractedSignals;
}

// ============= Brief Scope, Input Mode & Persona Types =============

export type BriefScope = 'entire-account' | 'specific-area';
export type InputMode = 'guided' | 'brainstorm';
export type PersonaType = 'seller' | 'engineer';

// AI-specific constraint categories
export const AI_CONSTRAINTS = [
  { value: 'data-access', label: 'Data access / availability' },
  { value: 'security', label: 'Security / compliance' },
  { value: 'residency', label: 'Data residency' },
  { value: 'integration', label: 'Integration complexity' },
  { value: 'budget-timeline', label: 'Budget / timeline' },
  { value: 'governance', label: 'AI governance / policy' },
];

// AI use case suggestions
export const AI_USE_CASE_SUGGESTIONS = [
  'Document processing & extraction',
  'Customer service automation',
  'Knowledge base / RAG',
  'Code generation / dev productivity',
  'Predictive analytics / forecasting',
  'Content generation',
  'Process automation / agents',
  'Search & discovery',
];

// ============= Brief Input/Output Types =============

export interface PartnerBriefInput {
  customerName: string;
  dealMotion: string;
  industry?: string;
  region?: string;
  dealSizeBand?: string;
  timeline?: string;
  competitors?: string[];
  needsMost: string[];
  // Enhanced signal tracking
  painPoints?: string;
  applicationLandscape?: string;
  cloudFootprint?: string;
  knownLicenses?: string;
  // Evidence (new structure)
  evidence?: EvidenceState;
  // Public signal flags (placeholder for future)
  publicSignals?: {
    websiteScanned?: boolean;
    hiringScanned?: boolean;
    newsScanned?: boolean;
  };
  // Scope & Input Mode
  briefScope: BriefScope;
  specificArea?: string;
  inputMode: InputMode;
  brainstormNotes?: string;
  // AI Deal Brief additions
  personaType: PersonaType;
  aiUseCases?: string;
  aiConstraints?: string[];
  aiConstraintNotes?: string;
}

// Signal coverage for the brief
export interface SignalCoverage {
  score: number; // 0-100
  confidence: 'Low' | 'Medium' | 'High';
  breakdown: {
    sellerKnown: { score: number; max: number; items: string[] };
    evidenceUploads: { score: number; max: number; items: string[] };
    publicSignals: { score: number; max: number; items: string[] };
  };
}

// Capture plan item
export interface CaptureAction {
  action: string;
  category: 'seller' | 'upload' | 'public';
  timeEstimate: string;
}

// Conditional refinement
export interface ConditionalRefinement {
  condition: string;
  refinement: string;
}

// AI Opportunity area for structured output
export interface AIOpportunity {
  name: string;
  whyRelevant: string;
  partnerAction: string;
  effortVsImpact: 'Low' | 'Medium' | 'High';
}

// Seller-specific output
export interface SellerOutput {
  useCaseOutcome: string;
  valueFraming: string;
  talkTrack: string[];
  objections: Array<{ objection: string; response: string }>;
  pilotPath: string[];
  followUpEmail?: string;
}

// Engineer-specific output
export interface EngineerOutput {
  assumptions: string[];
  architecturePattern: { name: string; rationale: string };
  requiredServices: string[];
  risks: Array<{ risk: string; mitigation: string }>;
  validationChecklist: string[];
}

// AI Readiness score
export interface AIReadinessScore {
  score: number; // 0-100
  label: string; // 'Not ready' | 'Emerging' | 'Ready' | 'Advanced'
  missingChecklist: Array<{
    category: string;
    item: string;
    filled: boolean;
  }>;
}

export interface PartnerBriefOutput {
  // Signal coverage
  signalCoverage: SignalCoverage;
  capturePlan: CaptureAction[];
  conditionalRefinements: ConditionalRefinement[];
  // Extracted signals for display/editing
  extractedSignals: ExtractedSignals;
  // Scope & Mode metadata for display
  briefScope: BriefScope;
  specificArea?: string;
  inputMode: InputMode;
  personaType: PersonaType;
  // AI Opportunity Map (partner view)
  aiOpportunities: AIOpportunity[];
  // AI Readiness
  aiReadiness: AIReadinessScore;
  // Persona-specific outputs
  sellerOutput?: SellerOutput;
  engineerOutput?: EngineerOutput;
  
  topRecommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium';
  }>;
  programs: {
    coSell: {
      recommended: boolean;
      notes: string;
    };
    dealRegistration: {
      recommended: boolean;
      notes: string;
    };
    partnerPrograms: string[];
  };
  funding: {
    workshopFunding: string;
    pocSupport: string;
    evidenceNeeded: string[];
  };
  workshop?: {
    name: string;
    agenda: string[];
    expectedOutputs: string[];
  };
  routing: {
    contacts: string[];
    steps: string[];
  };
  assets: Array<{
    name: string;
    type: string;
    link?: string;
  }>;
  nextSevenDays: string[];
}

// Options for the form
export const DEAL_MOTIONS = [
  { value: 'new-logo', label: 'New logo' },
  { value: 'expansion', label: 'Expansion' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'migration', label: 'Migration / modernization' },
  { value: 'ai-copilot', label: 'AI / Copilot / GenAI' },
  { value: 'security', label: 'Security' },
  { value: 'data-platform', label: 'Data platform' },
  { value: 'other', label: 'Other' },
];

export const INDUSTRIES = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'public-sector', label: 'Public Sector' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'other', label: 'Other' },
];

export const REGIONS = [
  { value: 'north-america', label: 'North America' },
  { value: 'emea', label: 'EMEA' },
  { value: 'apac', label: 'APAC' },
  { value: 'latam', label: 'LATAM' },
];

export const DEAL_SIZE_BANDS = [
  { value: 'under-50k', label: 'Under $50K' },
  { value: '50k-250k', label: '$50K - $250K' },
  { value: '250k-1m', label: '$250K - $1M' },
  { value: 'over-1m', label: 'Over $1M' },
];

export const TIMELINES = [
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'next-quarter', label: 'Next quarter' },
  { value: '6-months', label: '6 months+' },
  { value: 'unknown', label: 'Unknown' },
];

export const COMPETITORS = [
  { value: 'aws', label: 'AWS' },
  { value: 'google-cloud', label: 'Google Cloud' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'sap', label: 'SAP' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'ibm', label: 'IBM' },
  { value: 'servicenow', label: 'ServiceNow' },
];

export const NEEDS_MOST = [
  { value: 'technical', label: 'Technical resources' },
  { value: 'funding', label: 'Funding for workshop/POC' },
  { value: 'cosell', label: 'Co-sell / Microsoft field engagement' },
  { value: 'assets', label: 'Pitch assets' },
  { value: 'objection', label: 'Objection handling' },
  { value: 'executive', label: 'Executive sponsor' },
];

export const APPLICATION_LANDSCAPES = [
  { value: 'sap', label: 'SAP / ERP' },
  { value: 'salesforce', label: 'Salesforce / CRM' },
  { value: 'legacy-custom', label: 'Legacy / Custom apps' },
  { value: 'modern-cloud', label: 'Modern cloud-native' },
  { value: 'mixed', label: 'Mixed environment' },
];

export const CLOUD_FOOTPRINTS = [
  { value: 'azure-primary', label: 'Azure primary' },
  { value: 'aws-primary', label: 'AWS primary' },
  { value: 'gcp-primary', label: 'GCP primary' },
  { value: 'multi-cloud', label: 'Multi-cloud' },
  { value: 'on-prem', label: 'On-premises' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const KNOWN_LICENSES = [
  { value: 'm365-e3', label: 'M365 E3' },
  { value: 'm365-e5', label: 'M365 E5' },
  { value: 'azure-enterprise', label: 'Azure Enterprise' },
  { value: 'dynamics', label: 'Dynamics 365' },
  { value: 'power-platform', label: 'Power Platform' },
  { value: 'security-suite', label: 'Security Suite' },
];

// Workshop templates
const WORKSHOPS: Record<string, { name: string; agenda: string[]; expectedOutputs: string[] }> = {
  'ai-copilot': {
    name: 'Copilot Value Discovery Workshop',
    agenda: [
      'Current productivity landscape assessment (30 min)',
      'Copilot demo and use case mapping (45 min)',
      'Security and governance overview (30 min)',
      'ROI modeling and next steps (15 min)',
    ],
    expectedOutputs: [
      'Prioritized use case roadmap',
      'Preliminary ROI estimate',
      'Pilot deployment plan',
    ],
  },
  'migration': {
    name: 'Cloud Migration Assessment Workshop',
    agenda: [
      'Current infrastructure discovery (45 min)',
      'Azure landing zone design (45 min)',
      'Migration prioritization matrix (30 min)',
      'Timeline and resource planning (30 min)',
    ],
    expectedOutputs: [
      'Migration roadmap document',
      'TCO comparison analysis',
      'Risk mitigation plan',
    ],
  },
  'security': {
    name: 'Security Posture Assessment Workshop',
    agenda: [
      'Threat landscape briefing (20 min)',
      'Current security stack review (40 min)',
      'Microsoft security solution mapping (40 min)',
      'Compliance gap analysis (20 min)',
    ],
    expectedOutputs: [
      'Security posture scorecard',
      'Recommended security roadmap',
      'Compliance checklist',
    ],
  },
  'data-platform': {
    name: 'Data & Analytics Strategy Workshop',
    agenda: [
      'Data estate assessment (30 min)',
      'Microsoft Fabric / Azure Data overview (45 min)',
      'Use case prioritization (30 min)',
      'Implementation approach (15 min)',
    ],
    expectedOutputs: [
      'Data platform architecture diagram',
      'Priority use case documentation',
      'Implementation timeline',
    ],
  },
};

// Mock extraction of signals from evidence (MVP)
function mockExtractSignals(input: PartnerBriefInput): ExtractedSignals {
  const hasEvidence = input.evidence && 
    (input.evidence.uploads.length > 0 || input.evidence.links.length > 0);
  
  if (!hasEvidence) {
    return {
      applications: [],
      architecture: [],
      licenses: [],
    };
  }

  // Generate mock extracted signals based on evidence
  const applications: ExtractedSignal[] = [];
  const architecture: ExtractedSignal[] = [];
  const licenses: ExtractedSignal[] = [];

  // If uploads exist, generate mock detections
  if (input.evidence?.uploads && input.evidence.uploads.length > 0) {
    // Mock app detections
    applications.push({
      id: 'app-1',
      label: 'SAP ECC',
      confidence: 'High',
      confirmed: false,
    });
    applications.push({
      id: 'app-2',
      label: 'Salesforce',
      confidence: 'Medium',
      confirmed: false,
    });
    
    // Mock architecture patterns
    architecture.push({
      id: 'arch-1',
      label: 'Hybrid infrastructure',
      confidence: 'High',
      confirmed: false,
    });
    architecture.push({
      id: 'arch-2',
      label: 'Data lakehouse pattern',
      confidence: 'Low',
      confirmed: false,
    });
    
    // Mock license signals
    licenses.push({
      id: 'lic-1',
      label: 'M365 E5 (detected)',
      confidence: 'High',
      confirmed: false,
    });
  }

  // If links exist, add more mock detections
  if (input.evidence?.links && input.evidence.links.length > 0) {
    if (!applications.some(a => a.label === 'ServiceNow')) {
      applications.push({
        id: 'app-3',
        label: 'ServiceNow',
        confidence: 'Medium',
        confirmed: false,
      });
    }
    
    if (!architecture.some(a => a.label.includes('security'))) {
      architecture.push({
        id: 'arch-3',
        label: 'Identity & security focus',
        confidence: 'Medium',
        confirmed: false,
      });
    }
    
    if (!licenses.some(l => l.label.includes('Azure'))) {
      licenses.push({
        id: 'lic-2',
        label: 'Azure consumption signal',
        confidence: 'Medium',
        confirmed: false,
      });
    }
  }

  return { applications, architecture, licenses };
}

// Count confirmed signals for scoring
function countConfirmedSignals(signals: ExtractedSignals): number {
  const confirmed = [
    ...signals.applications.filter(s => s.confirmed),
    ...signals.architecture.filter(s => s.confirmed),
    ...signals.licenses.filter(s => s.confirmed),
  ];
  return confirmed.length;
}

// Calculate signal coverage score
function calculateSignalCoverage(input: PartnerBriefInput, extractedSignals: ExtractedSignals): SignalCoverage {
  const sellerKnownItems: string[] = [];
  const evidenceItems: string[] = [];
  const publicItems: string[] = [];

  // Seller-known inputs (max 40 points)
  if (input.dealMotion) sellerKnownItems.push('Motion selected');
  if (input.competitors && input.competitors.length > 0) sellerKnownItems.push('Competitor provided');
  if (input.painPoints) sellerKnownItems.push('Pain points provided');
  if (input.applicationLandscape) sellerKnownItems.push('Application landscape');
  if (input.cloudFootprint) sellerKnownItems.push('Cloud footprint');
  if (input.knownLicenses) sellerKnownItems.push('Known licenses');
  
  const sellerScore = Math.min(40, sellerKnownItems.length * 7);

  // Evidence uploads (max 30 points)
  const hasUploads = input.evidence?.uploads && input.evidence.uploads.length > 0;
  const hasLinks = input.evidence?.links && input.evidence.links.length > 0;
  const confirmedCount = countConfirmedSignals(extractedSignals);
  
  if (hasUploads) evidenceItems.push('Evidence uploaded');
  if (hasLinks) evidenceItems.push('Links added');
  if (confirmedCount > 0) evidenceItems.push(`${confirmedCount} signals confirmed`);
  
  // Base evidence score + bonus for confirmed signals
  let evidenceScore = 0;
  if (hasUploads) evidenceScore += 10;
  if (hasLinks) evidenceScore += 5;
  evidenceScore += Math.min(15, confirmedCount * 5); // Up to 15 bonus for confirmations
  evidenceScore = Math.min(30, evidenceScore);

  // Public signals (max 30 points) - placeholder for future
  if (input.publicSignals?.websiteScanned) publicItems.push('Website signal');
  if (input.publicSignals?.hiringScanned) publicItems.push('Hiring signal');
  if (input.publicSignals?.newsScanned) publicItems.push('News/PR signal');
  
  const publicScore = Math.min(30, publicItems.length * 10);

  const totalScore = sellerScore + evidenceScore + publicScore;
  
  let confidence: 'Low' | 'Medium' | 'High' = 'Low';
  if (totalScore >= 70) confidence = 'High';
  else if (totalScore >= 40) confidence = 'Medium';

  return {
    score: totalScore,
    confidence,
    breakdown: {
      sellerKnown: { score: sellerScore, max: 40, items: sellerKnownItems },
      evidenceUploads: { score: evidenceScore, max: 30, items: evidenceItems },
      publicSignals: { score: publicScore, max: 30, items: publicItems },
    },
  };
}

// Generate capture plan based on missing signals
function generateCapturePlan(input: PartnerBriefInput, extractedSignals: ExtractedSignals): CaptureAction[] {
  const actions: CaptureAction[] = [];
  const hasUploads = input.evidence?.uploads && input.evidence.uploads.length > 0;
  const hasLinks = input.evidence?.links && input.evidence.links.length > 0;
  const hasExtractedApps = extractedSignals.applications.length > 0;
  const hasExtractedArch = extractedSignals.architecture.length > 0;
  const hasExtractedLicenses = extractedSignals.licenses.length > 0;

  // Seller inputs
  if (!input.painPoints) {
    actions.push({
      action: 'Add known pain points or business challenges',
      category: 'seller',
      timeEstimate: '2 min',
    });
  }
  if (!input.applicationLandscape && !hasExtractedApps) {
    actions.push({
      action: 'Upload architecture screenshot or customer deck',
      category: 'upload',
      timeEstimate: '3 min',
    });
  }
  if (!input.cloudFootprint) {
    actions.push({
      action: 'Indicate current cloud/platform footprint',
      category: 'seller',
      timeEstimate: '1 min',
    });
  }
  if (!input.knownLicenses && !hasExtractedLicenses) {
    actions.push({
      action: 'Add license signals or upload admin screenshot (redacted)',
      category: 'upload',
      timeEstimate: '2 min',
    });
  }

  // Evidence uploads
  if (!hasUploads) {
    actions.push({
      action: 'Upload 2 LinkedIn screenshots (About + Solutions page)',
      category: 'upload',
      timeEstimate: '3 min',
    });
  }
  if (!hasLinks) {
    actions.push({
      action: 'Paste link to customer website for signal scan',
      category: 'public',
      timeEstimate: '1 min',
    });
  }
  if (!hasExtractedArch && !input.applicationLandscape) {
    actions.push({
      action: 'Paste link to careers / tech blog for architecture signals',
      category: 'public',
      timeEstimate: '1 min',
    });
  }

  // Public signals
  if (!input.publicSignals?.hiringScanned) {
    actions.push({
      action: 'Paste link to customer careers page (for hiring signals)',
      category: 'public',
      timeEstimate: '1 min',
    });
  }

  return actions.slice(0, 6);
}

// Generate conditional refinements based on context
function generateConditionalRefinements(input: PartnerBriefInput): ConditionalRefinement[] {
  const refinements: ConditionalRefinement[] = [];

  // License-based refinements
  if (!input.knownLicenses) {
    refinements.push({
      condition: 'If we confirm M365 + security licensing',
      refinement: "We'd evaluate Copilot readiness + Defender/Sentinel attach opportunities.",
    });
  }

  // Application landscape refinements
  if (!input.applicationLandscape) {
    refinements.push({
      condition: 'If app landscape includes SAP',
      refinement: "We'd prioritize SAP on Azure modernization + reference cases.",
    });
    refinements.push({
      condition: 'If Salesforce is primary CRM',
      refinement: "We'd explore Dynamics migration path or integration strategy.",
    });
  }

  // Cloud footprint refinements
  if (!input.cloudFootprint) {
    refinements.push({
      condition: 'If AWS is current primary cloud',
      refinement: "We'd focus on Azure competitive positioning + migration incentives.",
    });
  }

  // Hiring-based refinements
  if (!input.publicSignals?.hiringScanned) {
    refinements.push({
      condition: 'If hiring indicates data engineering growth',
      refinement: "We'd push data foundation + AI readiness workshop.",
    });
  }

  // Deal motion specific
  if (input.dealMotion === 'ai-copilot') {
    refinements.push({
      condition: 'If M365 usage data is available',
      refinement: "We'd provide personalized Copilot ROI projection by department.",
    });
  }

  if (input.dealMotion === 'security') {
    refinements.push({
      condition: 'If current security stack is documented',
      refinement: "We'd map replacement/integration path for Microsoft Security suite.",
    });
  }

  return refinements.slice(0, 4);
}

// Generate AI Opportunity Map based on signals and scope
function generateAIOpportunities(input: PartnerBriefInput, extractedSignals: ExtractedSignals): AIOpportunity[] {
  const opportunities: AIOpportunity[] = [];
  const scopeFilter = input.briefScope === 'specific-area' && input.specificArea 
    ? input.specificArea.toLowerCase() 
    : null;

  // Motion-based opportunities
  if (input.dealMotion === 'ai-copilot') {
    opportunities.push({
      name: 'Copilot for M365 Deployment',
      whyRelevant: 'Direct alignment with AI/Copilot motion; high executive interest.',
      partnerAction: 'Lead Copilot readiness assessment + pilot deployment',
      effortVsImpact: 'Medium',
    });
  }

  if (input.dealMotion === 'migration' || input.dealMotion === 'data-platform') {
    opportunities.push({
      name: 'Azure Data & Analytics Modernization',
      whyRelevant: 'Migration motions create foundation for AI-ready data estate.',
      partnerAction: 'Propose Azure Synapse/Fabric migration + AI enrichment layer',
      effortVsImpact: 'High',
    });
  }

  if (input.dealMotion === 'security') {
    opportunities.push({
      name: 'Microsoft Security Suite Adoption',
      whyRelevant: 'Security focus aligns with Defender/Sentinel attach.',
      partnerAction: 'Conduct security posture assessment + XDR roadmap',
      effortVsImpact: 'Medium',
    });
  }

  // Signal-based opportunities from extracted signals
  const hasApps = extractedSignals.applications.length > 0;
  const hasSAP = extractedSignals.applications.some(a => a.label.toLowerCase().includes('sap'));
  const hasSalesforce = extractedSignals.applications.some(a => a.label.toLowerCase().includes('salesforce'));
  const hasHybrid = extractedSignals.architecture.some(a => a.label.toLowerCase().includes('hybrid'));

  if (hasSAP) {
    opportunities.push({
      name: 'SAP on Azure Modernization',
      whyRelevant: 'SAP detected in application landscape; prime target for RISE with SAP on Azure.',
      partnerAction: 'Propose SAP migration assessment + Azure infrastructure sizing',
      effortVsImpact: 'High',
    });
  }

  if (hasSalesforce && !opportunities.some(o => o.name.includes('Dynamics'))) {
    opportunities.push({
      name: 'Dynamics 365 Integration Strategy',
      whyRelevant: 'Salesforce presence suggests CRM modernization or integration opportunity.',
      partnerAction: 'Evaluate Dynamics migration or integration patterns',
      effortVsImpact: 'Medium',
    });
  }

  if (hasHybrid) {
    opportunities.push({
      name: 'Azure Arc Hybrid Management',
      whyRelevant: 'Hybrid infrastructure pattern detected; unified management opportunity.',
      partnerAction: 'Deploy Azure Arc for hybrid estate governance',
      effortVsImpact: 'Low',
    });
  }

  // General opportunities if list is short
  if (opportunities.length < 2) {
    opportunities.push({
      name: 'AI Readiness Assessment',
      whyRelevant: 'General AI opportunity applicable across most accounts.',
      partnerAction: 'Conduct AI maturity assessment + identify quick wins',
      effortVsImpact: 'Low',
    });
  }

  // Filter by scope if specific area
  if (scopeFilter) {
    const filtered = opportunities.filter(o => 
      o.name.toLowerCase().includes(scopeFilter) || 
      o.whyRelevant.toLowerCase().includes(scopeFilter) ||
      o.partnerAction.toLowerCase().includes(scopeFilter)
    );
    return filtered.length > 0 ? filtered.slice(0, 4) : opportunities.slice(0, 2);
  }

  return opportunities.slice(0, 4);
}

// Generate AI readiness score
function generateAIReadiness(input: PartnerBriefInput): AIReadinessScore {
  const checklist: AIReadinessScore['missingChecklist'] = [
    { category: 'Data', item: 'Data sources identified', filled: !!input.applicationLandscape || !!input.brainstormNotes },
    { category: 'Data', item: 'Data owners confirmed', filled: false },
    { category: 'Data', item: 'Data sensitivity classified', filled: !!input.aiConstraints?.includes('security') },
    { category: 'Security', item: 'Security stance documented', filled: !!input.aiConstraints?.includes('security') },
    { category: 'Security', item: 'Data residency requirements clear', filled: !!input.aiConstraints?.includes('residency') },
    { category: 'Integration', item: 'Integration points mapped', filled: !!input.applicationLandscape },
    { category: 'Integration', item: 'Current AI stack known', filled: !!input.cloudFootprint },
    { category: 'Business', item: 'AI use cases defined', filled: !!input.aiUseCases },
    { category: 'Business', item: 'Success criteria set', filled: false },
    { category: 'Governance', item: 'AI governance maturity assessed', filled: !!input.aiConstraints?.includes('governance') },
  ];

  const filledCount = checklist.filter(c => c.filled).length;
  const score = Math.round((filledCount / checklist.length) * 100);
  
  let label = 'Not ready';
  if (score >= 80) label = 'Advanced';
  else if (score >= 60) label = 'Ready';
  else if (score >= 30) label = 'Emerging';

  return { score, label, missingChecklist: checklist };
}

// Generate seller-specific output
function generateSellerOutput(input: PartnerBriefInput): SellerOutput {
  const useCaseText = input.aiUseCases || 'AI-driven productivity and automation';
  return {
    useCaseOutcome: `${useCaseText} — enabling measurable efficiency gains and competitive differentiation for ${input.customerName}.`,
    valueFraming: `By implementing AI solutions, ${input.customerName} can expect 20-40% reduction in manual effort for targeted processes, faster time-to-insight, and improved decision quality. The investment typically pays back within 6-12 months.`,
    talkTrack: [
      `"${input.customerName} is exploring AI to drive [business outcome]. We've helped similar organizations achieve [specific result]."`,
      '"The key question isn\'t whether to adopt AI, but where to start for maximum impact with minimum risk."',
      '"Our approach: identify 2-3 high-value use cases, validate with a pilot, then scale what works."',
    ],
    objections: [
      { objection: 'Data privacy concerns', response: 'Azure AI processes data within your tenant boundary. No customer data is used to train models. Full compliance with GDPR, SOC2, and industry-specific regulations.' },
      { objection: 'Hallucination / accuracy risks', response: 'We implement RAG patterns with grounding to your data, plus human-in-the-loop validation. Accuracy improves with better data quality and guardrails.' },
      { objection: 'IP / data leakage', response: 'Enterprise-grade controls: data never leaves your environment, model outputs are governed, and we audit all AI interactions.' },
      { objection: 'Cost unpredictability', response: 'We start with a scoped pilot with fixed costs. Production costs are predictable with reserved capacity and consumption monitoring.' },
    ],
    pilotPath: [
      'Week 1-2: Use case validation + data readiness assessment',
      'Week 3-4: Architecture design + security review',
      'Week 5-8: Pilot build + testing with real data',
      'Week 9-10: Success measurement + scale decision',
    ],
    followUpEmail: `Subject: AI Opportunity — Next Steps for ${input.customerName}

Hi [Name],

Thank you for the conversation about ${input.customerName}'s AI goals. As discussed, I'd recommend we start with a focused assessment to identify the highest-impact use cases.

Proposed next steps:
1. 30-min discovery session to map current data landscape
2. AI readiness assessment (1-2 days)
3. Pilot scoping with clear success criteria

I'll send a calendar invite for the discovery session. In the meantime, it would be helpful if your team could share any documentation on current data sources and architecture.

Looking forward to it.`,
  };
}

// Generate engineer-specific output
function generateEngineerOutput(input: PartnerBriefInput): EngineerOutput {
  const hasRAGSignal = input.aiUseCases?.toLowerCase().includes('knowledge') || 
                       input.aiUseCases?.toLowerCase().includes('search') ||
                       input.aiUseCases?.toLowerCase().includes('document');
  const hasAgentSignal = input.aiUseCases?.toLowerCase().includes('agent') ||
                         input.aiUseCases?.toLowerCase().includes('automation');

  let archPattern = { name: 'RAG (Retrieval-Augmented Generation)', rationale: 'Best for knowledge-heavy use cases. Grounds LLM responses in customer data without fine-tuning. Lower cost, faster to deploy, easier to update.' };
  
  if (hasAgentSignal) {
    archPattern = { name: 'Agentic Architecture', rationale: 'Multi-step reasoning with tool use. Suitable for process automation where the AI needs to take actions, not just answer questions.' };
  } else if (!hasRAGSignal && input.dealMotion === 'ai-copilot') {
    archPattern = { name: 'Copilot Extension + RAG', rationale: 'Extends M365 Copilot with custom plugins grounded in customer data. Leverages existing Copilot license investment.' };
  }

  return {
    assumptions: [
      'Customer has structured and/or unstructured data accessible via APIs or file shares',
      'Azure subscription with appropriate resource quotas is available or can be provisioned',
      input.cloudFootprint === 'azure-primary' 
        ? 'Azure is the primary cloud — native integration path available' 
        : 'Multi-cloud or non-Azure primary — may need data replication or hybrid architecture',
      'Identity management (Entra ID) is in place for authentication and RBAC',
      'No real-time (<100ms) inference requirements unless specified',
    ],
    architecturePattern: archPattern,
    requiredServices: [
      'Azure OpenAI Service (GPT-4o / GPT-4o mini)',
      'Azure AI Search (for RAG indexing)',
      'Azure Blob Storage / Data Lake',
      'Azure App Service or Container Apps (hosting)',
      'Azure Monitor + Application Insights',
      ...(input.aiConstraints?.includes('security') ? ['Azure Key Vault', 'Azure Private Link'] : []),
      ...(input.aiConstraints?.includes('governance') ? ['Azure AI Content Safety', 'Purview'] : []),
    ],
    risks: [
      { risk: 'Data quality issues affecting AI output accuracy', mitigation: 'Implement data profiling + cleansing pipeline before indexing. Set up quality monitoring.' },
      { risk: 'Token cost overruns during scaling', mitigation: 'Use GPT-4o mini for simple tasks, GPT-4o for complex. Implement caching and prompt optimization.' },
      { risk: 'Security: prompt injection or data exfiltration', mitigation: 'Input/output filtering, RBAC on data sources, audit logging, content safety filters.' },
      { risk: 'Governance: lack of AI usage policies', mitigation: 'Define acceptable use policy. Implement logging and human review for sensitive outputs.' },
    ],
    validationChecklist: [
      'Data connectivity validated (all sources accessible)',
      'Security review passed (networking, auth, data classification)',
      'Retrieval quality meets threshold (precision/recall on test set)',
      'Latency within acceptable bounds for user experience',
      'Cost model validated against projected usage',
      'User acceptance testing with representative scenarios',
      'Rollback and incident response plan documented',
    ],
  };
}

// Recommendation engine (MVP rules-based)
export function generatePartnerBrief(input: PartnerBriefInput): PartnerBriefOutput {
  const recommendations: PartnerBriefOutput['topRecommendations'] = [];
  const partnerPrograms: string[] = [];
  const contacts: string[] = [];
  const steps: string[] = [];
  const assets: PartnerBriefOutput['assets'] = [];
  const nextSevenDays: string[] = [];
  const evidenceNeeded: string[] = [];

  // Extract signals from evidence (mock for MVP)
  const extractedSignals = mockExtractSignals(input);

  // Calculate signal coverage with extracted signals
  const signalCoverage = calculateSignalCoverage(input, extractedSignals);
  const capturePlan = generateCapturePlan(input, extractedSignals);
  const conditionalRefinements = generateConditionalRefinements(input);
  const aiOpportunities = generateAIOpportunities(input, extractedSignals);
  const aiReadiness = generateAIReadiness(input);
  
  // Persona-specific outputs
  const sellerOutput = input.personaType === 'seller' ? generateSellerOutput(input) : undefined;
  const engineerOutput = input.personaType === 'engineer' ? generateEngineerOutput(input) : undefined;

  // Determine co-sell recommendation
  const isLargeDeal = input.dealSizeBand === '250k-1m' || input.dealSizeBand === 'over-1m';
  const isNewLogo = input.dealMotion === 'new-logo';
  const needsCoSell = input.needsMost.includes('cosell');

  const coSellRecommended = isLargeDeal || needsCoSell;
  const dealRegRecommended = isLargeDeal || isNewLogo;

  // Top recommendations based on motion and needs
  if (input.needsMost.includes('funding')) {
    recommendations.push({
      title: 'Apply for Partner Investment Funds',
      description: 'Based on deal size and motion, you may qualify for workshop/POC funding.',
      priority: 'high',
    });
  }

  if (coSellRecommended) {
    recommendations.push({
      title: 'Engage Microsoft Co-Sell Team',
      description: 'Large deals benefit from Microsoft field support. Initiate co-sell motion.',
      priority: 'high',
    });
    contacts.push('Partner Development Manager (PDM)');
    contacts.push('Technical Specialist (based on solution area)');
  }

  if (input.needsMost.includes('technical')) {
    recommendations.push({
      title: 'Request Technical Pre-Sales Support',
      description: 'Engage a Cloud Solution Architect for technical deep-dive and architecture review.',
      priority: 'high',
    });
    contacts.push('Cloud Solution Architect (CSA)');
  }

  if (input.needsMost.includes('executive')) {
    recommendations.push({
      title: 'Request Executive Sponsor Alignment',
      description: 'For strategic accounts, Microsoft exec engagement can accelerate deal velocity.',
      priority: 'medium',
    });
    contacts.push('Account Executive (if known)');
  }

  // Ensure at least 3 recommendations
  if (recommendations.length < 3) {
    if (!recommendations.some(r => r.title.includes('Assets'))) {
      recommendations.push({
        title: 'Leverage Partner Marketing Assets',
        description: 'Use Microsoft-approved pitch decks and battlecards for this solution area.',
        priority: 'medium',
      });
    }
  }

  // Partner programs
  if (isLargeDeal) {
    partnerPrograms.push('Enterprise Partner Incentives may apply');
  }
  if (input.dealMotion === 'ai-copilot') {
    partnerPrograms.push('AI Cloud Partner Program benefits available');
  }
  if (input.dealMotion === 'security') {
    partnerPrograms.push('Security Specialization incentives may apply');
  }

  // Funding info
  let workshopFunding = 'Standard workshop funding available through partner portal.';
  let pocSupport = 'Azure credits for POC can be requested via Partner Center.';

  if (isLargeDeal) {
    workshopFunding = 'Enhanced funding available for enterprise deals. Submit request via Partner Center.';
    pocSupport = 'Extended POC credits (up to $15K) available for deals over $250K.';
  }

  evidenceNeeded.push('Customer email confirming engagement');
  evidenceNeeded.push('Signed NDA or LOI (for larger funding requests)');
  if (isLargeDeal) {
    evidenceNeeded.push('Executive sponsor confirmation');
  }

  // Workshop suggestion
  const workshop = WORKSHOPS[input.dealMotion];

  // Routing steps
  steps.push('1. Log opportunity in Partner Center');
  if (dealRegRecommended) {
    steps.push('2. Submit deal registration for tracking');
  }
  if (coSellRecommended) {
    steps.push('3. Request co-sell support via Partner Center');
  }
  steps.push('4. Schedule kickoff with assigned Microsoft contacts');

  // Assets based on motion
  assets.push({
    name: 'Solution Pitch Deck',
    type: 'Presentation',
    link: '#',
  });
  assets.push({
    name: 'Customer Success Stories',
    type: 'Case Studies',
    link: '#',
  });

  if (input.competitors && input.competitors.length > 0) {
    assets.push({
      name: 'Competitive Battlecard',
      type: 'Sales Tool',
      link: '#',
    });
  }

  if (input.dealMotion === 'ai-copilot') {
    assets.push({
      name: 'Copilot ROI Calculator',
      type: 'Tool',
      link: '#',
    });
  }

  assets.push({
    name: 'Email Templates',
    type: 'Outreach',
    link: '#',
  });

  // Next 7 days
  nextSevenDays.push(`Confirm meeting with ${input.customerName} stakeholders`);
  nextSevenDays.push('Log opportunity in Partner Center');
  if (dealRegRecommended) {
    nextSevenDays.push('Submit deal registration');
  }
  if (input.needsMost.includes('funding')) {
    nextSevenDays.push('Prepare funding request documentation');
  }
  nextSevenDays.push('Review recommended assets and customize pitch');

  return {
    signalCoverage,
    capturePlan,
    conditionalRefinements,
    extractedSignals,
    briefScope: input.briefScope,
    specificArea: input.specificArea,
    inputMode: input.inputMode,
    personaType: input.personaType,
    aiOpportunities,
    aiReadiness,
    sellerOutput,
    engineerOutput,
    topRecommendations: recommendations.slice(0, 3),
    programs: {
      coSell: {
        recommended: coSellRecommended,
        notes: coSellRecommended
          ? 'Based on deal size and requirements, Microsoft co-sell engagement is recommended.'
          : 'Co-sell optional for this deal size. Consider if executive alignment is needed.',
      },
      dealRegistration: {
        recommended: dealRegRecommended,
        notes: dealRegRecommended
          ? 'Register this deal to unlock partner benefits and protect your opportunity.'
          : 'Deal registration optional but recommended for tracking and reporting.',
      },
      partnerPrograms,
    },
    funding: {
      workshopFunding,
      pocSupport,
      evidenceNeeded,
    },
    workshop,
    routing: {
      contacts: contacts.length > 0 ? contacts : ['Partner Development Manager (PDM)'],
      steps,
    },
    assets,
    nextSevenDays: nextSevenDays.slice(0, 5),
  };
}
