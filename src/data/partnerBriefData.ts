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
  attachments?: {
    files?: File[];
    links?: string[];
  };
}

export interface PartnerBriefOutput {
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

// Recommendation engine (MVP rules-based)
export function generatePartnerBrief(input: PartnerBriefInput): PartnerBriefOutput {
  const recommendations: PartnerBriefOutput['topRecommendations'] = [];
  const partnerPrograms: string[] = [];
  const contacts: string[] = [];
  const steps: string[] = [];
  const assets: PartnerBriefOutput['assets'] = [];
  const nextSevenDays: string[] = [];
  const evidenceNeeded: string[] = [];

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
