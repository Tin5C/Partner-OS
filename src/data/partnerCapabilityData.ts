// Partner Capability & Brand Snapshot Data
// Persona-aware templates for Seller vs Engineer

export type PartnerPersona = 'seller' | 'engineer';

// Seller-specific types
export interface SellerProfile {
  industries: string[];
  solutions: string[];
  differentiationAngle: string;
  linkedinEvidence?: string;
  customerQuotes?: string[];
  decksUploaded?: number;
}

export interface SellerOutput {
  positioningStatement: string;
  proofPoints: string[];
  talkTrack: string;
  linkedinPostIdeas: string[];
}

// Engineer-specific types
export interface EngineerProfile {
  roles: string[];
  solutionAreas: string[];
  certifications: string[];
  deliveryProof?: {
    type: 'architecture' | 'runbook' | 'design-doc';
    filename: string;
  }[];
}

export interface EngineerOutput {
  capabilitySnapshot: string[];
  risksAssumptions: string[];
  technicalPostOutline?: string;
  nextArtifacts: string[];
}

// Signal scoring
export interface SignalScore {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  topThreeActions: string[];
}

// Seller signal weights
export const SELLER_SIGNALS = {
  linkedinPresence: { weight: 25, label: 'LinkedIn presence' },
  proofPoints: { weight: 20, label: 'Proof points / case references' },
  positioningClarity: { weight: 20, label: 'Positioning clarity' },
  industries: { weight: 15, label: 'Industries defined' },
  solutionsSold: { weight: 20, label: 'Solutions sold' },
};

// Engineer signal weights
export const ENGINEER_SIGNALS = {
  deliveryArtifacts: { weight: 30, label: 'Delivery artifacts' },
  architectureExamples: { weight: 25, label: 'Architecture examples' },
  certifications: { weight: 15, label: 'Certifications' },
  technicalTopics: { weight: 15, label: 'Technical topics' },
  projectEvidence: { weight: 15, label: 'Project evidence' },
};

// Industry options for sellers
export const SELLER_INDUSTRIES = [
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail & Consumer',
  'Public Sector',
  'Energy & Utilities',
  'Technology',
  'Professional Services',
] as const;

// Solution options for sellers
export const SELLER_SOLUTIONS = [
  'Azure Infrastructure',
  'Data & AI',
  'Modern Work / M365',
  'Security',
  'Business Applications',
  'Power Platform',
  'SAP on Azure',
] as const;

// Role options for engineers
export const ENGINEER_ROLES = [
  'Solutions Architect',
  'Sales Engineer',
  'Technical Consultant',
  'Cloud Architect',
  'Data Engineer',
  'DevOps Engineer',
] as const;

// Solution areas for engineers
export const ENGINEER_SOLUTION_AREAS = [
  'Azure Infrastructure',
  'Azure Data Platform',
  'Azure AI / ML',
  'Azure Security',
  'Azure Networking',
  'Power Platform',
  'M365 / Modern Work',
  'SAP on Azure',
  'Application Modernization',
] as const;

// Calculate seller signal score
export function calculateSellerScore(profile: Partial<SellerProfile>): SignalScore {
  let score = 0;
  const missing: string[] = [];

  if (profile.linkedinEvidence) {
    score += SELLER_SIGNALS.linkedinPresence.weight;
  } else {
    missing.push('Add LinkedIn profile or screenshot');
  }

  if (profile.customerQuotes && profile.customerQuotes.length > 0) {
    score += SELLER_SIGNALS.proofPoints.weight;
  } else {
    missing.push('Add customer quotes or case references');
  }

  if (profile.differentiationAngle && profile.differentiationAngle.length > 20) {
    score += SELLER_SIGNALS.positioningClarity.weight;
  } else {
    missing.push('Define your differentiation angle');
  }

  if (profile.industries && profile.industries.length > 0) {
    score += SELLER_SIGNALS.industries.weight;
  } else {
    missing.push('Select industries you sell into');
  }

  if (profile.solutions && profile.solutions.length > 0) {
    score += SELLER_SIGNALS.solutionsSold.weight;
  } else {
    missing.push('Select solutions you sell');
  }

  return {
    score,
    level: score < 40 ? 'Low' : score < 70 ? 'Medium' : 'High',
    topThreeActions: missing.slice(0, 3),
  };
}

// Calculate engineer signal score
export function calculateEngineerScore(profile: Partial<EngineerProfile>): SignalScore {
  let score = 0;
  const missing: string[] = [];

  if (profile.deliveryProof && profile.deliveryProof.length > 0) {
    score += ENGINEER_SIGNALS.deliveryArtifacts.weight;
  } else {
    missing.push('Upload a reference architecture or runbook');
  }

  if (profile.deliveryProof && profile.deliveryProof.some(p => p.type === 'architecture')) {
    score += ENGINEER_SIGNALS.architectureExamples.weight;
  } else {
    missing.push('Add an architecture diagram example');
  }

  if (profile.certifications && profile.certifications.length > 0) {
    score += ENGINEER_SIGNALS.certifications.weight;
  } else {
    missing.push('Add your certifications');
  }

  if (profile.solutionAreas && profile.solutionAreas.length > 0) {
    score += ENGINEER_SIGNALS.technicalTopics.weight;
  } else {
    missing.push('Select your solution areas');
  }

  if (profile.roles && profile.roles.length > 0) {
    score += ENGINEER_SIGNALS.projectEvidence.weight;
  } else {
    missing.push('Define your technical roles');
  }

  return {
    score,
    level: score < 40 ? 'Low' : score < 70 ? 'Medium' : 'High',
    topThreeActions: missing.slice(0, 3),
  };
}

// Generate seller outputs (mock for MVP)
export function generateSellerOutputs(profile: SellerProfile): SellerOutput {
  const industryText = profile.industries.length > 0 
    ? profile.industries.slice(0, 2).join(' and ') 
    : 'enterprise';
  
  const solutionText = profile.solutions.length > 0
    ? profile.solutions[0]
    : 'Microsoft solutions';

  return {
    positioningStatement: `Trusted ${industryText} advisor delivering measurable ${solutionText} outcomes.`,
    proofPoints: [
      `Delivered ${solutionText} implementations for multiple ${industryText} clients`,
      `Deep expertise in ${profile.differentiationAngle || 'complex enterprise transformations'}`,
      `Track record of accelerated time-to-value and reduced implementation risk`,
    ],
    talkTrack: `"We specialize in ${industryText}, where we've helped organizations like yours navigate ${solutionText} adoption. Our approach focuses on ${profile.differentiationAngle || 'rapid value realization'}—typically delivering first results within weeks, not months."`,
    linkedinPostIdeas: [
      `3 lessons from a recent ${solutionText} project in ${industryText}`,
      `Why ${profile.differentiationAngle || 'clarity'} matters in enterprise sales`,
    ],
  };
}

// Generate engineer outputs (mock for MVP)
export function generateEngineerOutputs(profile: EngineerProfile): EngineerOutput {
  const roleText = profile.roles.length > 0 ? profile.roles[0] : 'Technical Consultant';
  const areaText = profile.solutionAreas.length > 0
    ? profile.solutionAreas.slice(0, 2).join(', ')
    : 'Azure solutions';

  return {
    capabilitySnapshot: [
      `${roleText} with deep expertise in ${areaText}`,
      `Proven delivery experience with production-grade implementations`,
      `Strong documentation and architecture review capabilities`,
      profile.certifications.length > 0 
        ? `Certified in ${profile.certifications.slice(0, 2).join(', ')}`
        : 'Building certification portfolio',
    ],
    risksAssumptions: [
      'Verify customer has adequate Azure subscription limits',
      'Confirm networking topology and security requirements early',
      'Align on DevOps practices and deployment pipelines',
      'Clarify data residency and compliance requirements',
    ],
    technicalPostOutline: `How to approach ${areaText} in regulated industries: lessons from the field`,
    nextArtifacts: [
      profile.deliveryProof?.some(p => p.type === 'architecture') 
        ? 'Add a second architecture pattern' 
        : 'Upload a reference architecture diagram',
      'Document a recent runbook or deployment guide',
      'Create a pre-engagement checklist template',
    ],
  };
}

// Recommended deep dives based on persona and gaps
export function getRecommendedDeepDives(
  persona: PartnerPersona,
  score: SignalScore
): string[] {
  if (persona === 'seller') {
    const recommendations: string[] = [];
    if (score.topThreeActions.some(a => a.includes('positioning'))) {
      recommendations.push('Positioning for Premium Rates');
    }
    if (score.topThreeActions.some(a => a.includes('LinkedIn'))) {
      recommendations.push('LinkedIn for Enterprise Sellers');
    }
    if (score.topThreeActions.some(a => a.includes('proof') || a.includes('case'))) {
      recommendations.push('Building Proof Points That Convert');
    }
    return recommendations.length > 0 ? recommendations : ['Executive Messaging Masterclass'];
  } else {
    const recommendations: string[] = [];
    if (score.topThreeActions.some(a => a.includes('architecture'))) {
      recommendations.push('Architecture Documentation Best Practices');
    }
    if (score.topThreeActions.some(a => a.includes('certification'))) {
      recommendations.push('Azure Certification Pathways');
    }
    if (score.topThreeActions.some(a => a.includes('runbook'))) {
      recommendations.push('Creating Reusable Runbooks');
    }
    return recommendations.length > 0 ? recommendations : ['Technical Authority in Sales Cycles'];
  }
}
