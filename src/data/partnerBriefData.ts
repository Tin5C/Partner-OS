// Partner Brief Data Model
// Rules-based recommendations for Microsoft Partner support

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
  attachments?: {
    files?: File[];
    links?: string[];
    hasScreenshots?: boolean;
    hasDocs?: boolean;
  };
  // Public signal flags (placeholder for future)
  publicSignals?: {
    websiteScanned?: boolean;
    hiringScanned?: boolean;
    newsScanned?: boolean;
  };
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

export interface PartnerBriefOutput {
  // Signal coverage (new)
  signalCoverage: SignalCoverage;
  capturePlan: CaptureAction[];
  conditionalRefinements: ConditionalRefinement[];
  
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

// Calculate signal coverage score
function calculateSignalCoverage(input: PartnerBriefInput): SignalCoverage {
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
  if (input.attachments?.hasScreenshots) evidenceItems.push('Screenshots uploaded');
  if (input.attachments?.hasDocs) evidenceItems.push('Docs/PDF uploaded');
  if (input.attachments?.links && input.attachments.links.length > 0) evidenceItems.push('Links added');
  
  const evidenceScore = Math.min(30, evidenceItems.length * 10);

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
function generateCapturePlan(input: PartnerBriefInput): CaptureAction[] {
  const actions: CaptureAction[] = [];

  // Seller inputs
  if (!input.painPoints) {
    actions.push({
      action: 'Add known pain points or business challenges',
      category: 'seller',
      timeEstimate: '2 min',
    });
  }
  if (!input.applicationLandscape) {
    actions.push({
      action: 'Select application landscape pattern (SAP, Salesforce, etc.)',
      category: 'seller',
      timeEstimate: '1 min',
    });
  }
  if (!input.cloudFootprint) {
    actions.push({
      action: 'Indicate current cloud/platform footprint',
      category: 'seller',
      timeEstimate: '1 min',
    });
  }
  if (!input.knownLicenses) {
    actions.push({
      action: 'Add known Microsoft licenses (M365, Azure, etc.)',
      category: 'seller',
      timeEstimate: '1 min',
    });
  }

  // Evidence uploads
  if (!input.attachments?.hasScreenshots) {
    actions.push({
      action: 'Upload 2 LinkedIn screenshots (About + Solutions page)',
      category: 'upload',
      timeEstimate: '3 min',
    });
  }
  if (!input.attachments?.hasDocs) {
    actions.push({
      action: 'Add 1 customer deck or meeting notes',
      category: 'upload',
      timeEstimate: '2 min',
    });
  }

  // Public signals
  if (!input.publicSignals?.websiteScanned) {
    actions.push({
      action: 'Paste link to customer website (for signal scan)',
      category: 'public',
      timeEstimate: '1 min',
    });
  }
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

// Recommendation engine (MVP rules-based)
export function generatePartnerBrief(input: PartnerBriefInput): PartnerBriefOutput {
  const recommendations: PartnerBriefOutput['topRecommendations'] = [];
  const partnerPrograms: string[] = [];
  const contacts: string[] = [];
  const steps: string[] = [];
  const assets: PartnerBriefOutput['assets'] = [];
  const nextSevenDays: string[] = [];
  const evidenceNeeded: string[] = [];

  // Calculate signal coverage
  const signalCoverage = calculateSignalCoverage(input);
  const capturePlan = generateCapturePlan(input);
  const conditionalRefinements = generateConditionalRefinements(input);

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
