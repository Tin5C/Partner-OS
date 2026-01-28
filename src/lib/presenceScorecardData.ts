// Personal Brand Scorecard - Types and Mock Data
// MVP: All data is mock for UI preview

export interface ScorecardInput {
  name: string;
  employer: string;
  title: string;
  region: string;
  industry: string;
  productFocus: string;
}

export type IdentityStatus = 'confirmed' | 'ambiguous';
export type FindabilityVerdict = 'linkedin-contained' | 'cross-channel' | 'strong-external';
export type TierLevel = 0 | 1 | 2 | 3;

export const TIER_NAMES: Record<TierLevel, string> = {
  0: 'Unknown',
  1: 'Practitioner',
  2: 'Recognized voice',
  3: 'Category voice',
};

export interface QueryResult {
  query: string;
  dominantResult: string;
  nonLinkedInAppears: boolean;
}

export interface EvidenceItem {
  id: string;
  title: string;
  domain: string;
  url: string;
  labels: ('Visibility' | 'Relevance' | 'Credibility' | 'Consistency' | 'External validation')[];
  buyerRelevance: string;
}

export interface DimensionScore {
  dimension: string;
  weight: number;
  score: number; // 1-5
  justification: string;
}

export interface TierGatingCheck {
  label: string;
  required: boolean;
  met: boolean;
}

export interface ImprovementData {
  profileEdits: string[];
  postIdeas: { idea: string; theme: string }[];
  signaturePov: string;
  nextExternalMove: string;
}

export interface ScorecardResult {
  input: ScorecardInput;
  identity: {
    status: IdentityStatus;
    dataNeeded?: string;
  };
  findability: {
    queries: QueryResult[];
    verdict: FindabilityVerdict;
    linkedInPercent: number;
    externalPercent: number;
  };
  evidence: EvidenceItem[];
  dimensions: DimensionScore[];
  overall: {
    score: number; // 0-100
    tier: TierLevel;
    tierExplanation: string;
    gatingChecks: TierGatingCheck[];
  };
  improvements: ImprovementData;
}

// ================== MOCK DATA ==================

// Example 1: Strong LinkedIn, weak external (Tier 1)
export const MOCK_PERSONA_1: ScorecardResult = {
  input: {
    name: 'Sarah Chen',
    employer: 'Acme Solutions',
    title: 'Senior Account Executive',
    region: 'DACH',
    industry: 'Manufacturing',
    productFocus: 'Supply Chain Optimization',
  },
  identity: {
    status: 'confirmed',
  },
  findability: {
    queries: [
      { query: '"Sarah Chen"', dominantResult: 'LinkedIn profile appears in top 3', nonLinkedInAppears: false },
      { query: '"Sarah Chen" Senior Account Executive', dominantResult: 'LinkedIn dominates all results', nonLinkedInAppears: false },
      { query: '"Sarah Chen" Acme Solutions', dominantResult: 'LinkedIn profile + company page', nonLinkedInAppears: true },
      { query: '"Sarah Chen" Manufacturing', dominantResult: 'LinkedIn only, no external mentions', nonLinkedInAppears: false },
    ],
    verdict: 'linkedin-contained',
    linkedInPercent: 85,
    externalPercent: 15,
  },
  evidence: [
    { id: '1', title: 'LinkedIn Profile', domain: 'linkedin.com', url: 'https://linkedin.com/in/sarahchen', labels: ['Visibility', 'Credibility'], buyerRelevance: 'Primary digital presence for professional verification' },
    { id: '2', title: 'Company bio page', domain: 'acmesolutions.com', url: 'https://acmesolutions.com/team/sarah-chen', labels: ['Visibility', 'Relevance'], buyerRelevance: 'Validates current employment and role' },
    { id: '3', title: 'LinkedIn article on supply chain', domain: 'linkedin.com', url: 'https://linkedin.com/pulse/sarah-chen-supply-chain', labels: ['Visibility', 'Consistency'], buyerRelevance: 'Shows expertise in relevant domain' },
    { id: '4', title: 'LinkedIn post engagement', domain: 'linkedin.com', url: 'https://linkedin.com/posts/sarahchen-123', labels: ['Visibility'], buyerRelevance: 'Active presence signals availability' },
    { id: '5', title: 'XING profile (inactive)', domain: 'xing.com', url: 'https://xing.com/profile/sarah-chen', labels: ['Visibility'], buyerRelevance: 'Secondary professional network presence' },
    { id: '6', title: 'LinkedIn recommendation from CFO', domain: 'linkedin.com', url: 'https://linkedin.com/in/sarahchen#recommendations', labels: ['Credibility'], buyerRelevance: 'Third-party executive endorsement' },
    { id: '7', title: 'Acme case study mention', domain: 'acmesolutions.com', url: 'https://acmesolutions.com/cases/manufacturing-q3', labels: ['Relevance', 'Credibility'], buyerRelevance: 'Links name to concrete customer outcomes' },
    { id: '8', title: 'LinkedIn certification badge', domain: 'linkedin.com', url: 'https://linkedin.com/in/sarahchen#certifications', labels: ['Credibility'], buyerRelevance: 'Verified skill credentials' },
  ],
  dimensions: [
    { dimension: 'Positioning clarity', weight: 20, score: 4, justification: 'Clear headline and about section. Could be more specific to target buyer.' },
    { dimension: 'Buyer relevance', weight: 15, score: 3, justification: 'Content exists but not consistently tied to buyer pain points.' },
    { dimension: 'Credibility & proof', weight: 20, score: 3, justification: 'Some recommendations present but limited external validation.' },
    { dimension: 'POV strength', weight: 20, score: 2, justification: 'No distinctive perspective articulated. Generic industry commentary.' },
    { dimension: 'Consistency & craft', weight: 10, score: 4, justification: 'Professional presentation, regular posting cadence.' },
    { dimension: 'Distribution & validation', weight: 15, score: 1, justification: 'Almost entirely LinkedIn-contained. No external presence.' },
  ],
  overall: {
    score: 58,
    tier: 1,
    tierExplanation: 'Strong LinkedIn foundation but lacks external validation signals. Visibility is contained to one platform.',
    gatingChecks: [
      { label: 'At least 1 external validation signal', required: true, met: false },
      { label: 'At least 2 external validation signals across domains', required: true, met: false },
    ],
  },
  improvements: {
    profileEdits: [
      'Add a specific value proposition in your headline (e.g., "Helping manufacturers reduce supply chain costs by 20%")',
      'Include 2-3 quantified achievements in your About section',
      'Request recommendations from recent customers, not just colleagues',
    ],
    postIdeas: [
      { idea: 'Share a counterintuitive lesson from a recent deal', theme: 'Sovereignty' },
      { idea: 'Write about a common buyer objection and how to address it', theme: 'Cost pressure' },
      { idea: 'Comment on an industry trend with your perspective', theme: 'AI governance' },
    ],
    signaturePov: 'Most supply chain transformations fail because companies optimize for cost before understanding their actual constraints. Start with visibility, then optimize.',
    nextExternalMove: 'Submit a guest post to a manufacturing industry publication about supply chain visibility trends.',
  },
};

// Example 2: Cross-channel with speaker + podcast (Tier 2)
export const MOCK_PERSONA_2: ScorecardResult = {
  input: {
    name: 'Marcus Weber',
    employer: 'TechVentures GmbH',
    title: 'VP Sales EMEA',
    region: 'EMEA',
    industry: 'Technology',
    productFocus: 'Enterprise SaaS',
  },
  identity: {
    status: 'confirmed',
  },
  findability: {
    queries: [
      { query: '"Marcus Weber"', dominantResult: 'LinkedIn + conference speaker page', nonLinkedInAppears: true },
      { query: '"Marcus Weber" VP Sales', dominantResult: 'LinkedIn + podcast interview', nonLinkedInAppears: true },
      { query: '"Marcus Weber" TechVentures', dominantResult: 'Company page + press release', nonLinkedInAppears: true },
      { query: '"Marcus Weber" Enterprise SaaS', dominantResult: 'Podcast episode + article quote', nonLinkedInAppears: true },
    ],
    verdict: 'cross-channel',
    linkedInPercent: 55,
    externalPercent: 45,
  },
  evidence: [
    { id: '1', title: 'LinkedIn Profile', domain: 'linkedin.com', url: 'https://linkedin.com/in/marcusweber', labels: ['Visibility', 'Credibility'], buyerRelevance: 'Primary professional presence' },
    { id: '2', title: 'SaaStr Europa speaker bio', domain: 'saastreuropa.com', url: 'https://saastreuropa.com/speakers/marcus-weber', labels: ['Visibility', 'Credibility', 'External validation'], buyerRelevance: 'Selected to speak at premier industry event' },
    { id: '3', title: 'Sales Hacker podcast guest', domain: 'saleshacker.com', url: 'https://saleshacker.com/podcast/episode-234', labels: ['Visibility', 'Credibility', 'External validation'], buyerRelevance: 'Recognized expert invited to share insights' },
    { id: '4', title: 'Forbes DACH contributor quote', domain: 'forbes.de', url: 'https://forbes.de/enterprise-sales-2024', labels: ['Credibility', 'External validation'], buyerRelevance: 'Cited as industry expert by major publication' },
    { id: '5', title: 'Company leadership page', domain: 'techventures.de', url: 'https://techventures.de/leadership', labels: ['Visibility', 'Relevance'], buyerRelevance: 'Validates senior role and authority' },
    { id: '6', title: 'Medium article on EMEA expansion', domain: 'medium.com', url: 'https://medium.com/@marcusweber/emea-expansion', labels: ['Visibility', 'Consistency'], buyerRelevance: 'Demonstrates thought process and expertise' },
    { id: '7', title: 'LinkedIn article series', domain: 'linkedin.com', url: 'https://linkedin.com/pulse/marcus-weber', labels: ['Visibility', 'Consistency'], buyerRelevance: 'Regular content creation on platform' },
    { id: '8', title: 'Gartner webinar panelist', domain: 'gartner.com', url: 'https://gartner.com/webinars/saas-sales-2024', labels: ['Credibility', 'External validation'], buyerRelevance: 'Invited by research firm to share expertise' },
    { id: '9', title: 'Enterprise Sales newsletter', domain: 'substack.com', url: 'https://marcusweber.substack.com', labels: ['Visibility', 'Consistency'], buyerRelevance: 'Owned channel for direct audience building' },
    { id: '10', title: 'YouTube interview on scaling', domain: 'youtube.com', url: 'https://youtube.com/watch?v=abc123', labels: ['Visibility', 'External validation'], buyerRelevance: 'Video presence increases trust and recognition' },
    { id: '11', title: 'Company press release', domain: 'prnewswire.com', url: 'https://prnewswire.com/techventures-series-b', labels: ['Credibility', 'Relevance'], buyerRelevance: 'Associated with company growth milestones' },
    { id: '12', title: 'Sales conference panel recap', domain: 'salesforce.com', url: 'https://salesforce.com/events/recap-emea', labels: ['Credibility', 'External validation'], buyerRelevance: 'Featured in vendor ecosystem content' },
  ],
  dimensions: [
    { dimension: 'Positioning clarity', weight: 20, score: 5, justification: 'Crystal clear positioning as EMEA enterprise sales leader. Consistent across all channels.' },
    { dimension: 'Buyer relevance', weight: 15, score: 4, justification: 'Content directly addresses enterprise buyer challenges. Could be more specific to verticals.' },
    { dimension: 'Credibility & proof', weight: 20, score: 4, justification: 'Multiple third-party endorsements and speaking invitations. Strong recommendation set.' },
    { dimension: 'POV strength', weight: 20, score: 4, justification: 'Clear perspective on EMEA market dynamics. Newsletter establishes distinct voice.' },
    { dimension: 'Consistency & craft', weight: 10, score: 4, justification: 'Regular posting, professional visual presentation, cohesive messaging.' },
    { dimension: 'Distribution & validation', weight: 15, score: 4, justification: 'Presence across 4+ platforms. Multiple external validation signals.' },
  ],
  overall: {
    score: 82,
    tier: 2,
    tierExplanation: 'Recognized voice in EMEA enterprise sales. Strong cross-channel presence with multiple external validation signals.',
    gatingChecks: [
      { label: 'At least 1 external validation signal', required: true, met: true },
      { label: 'At least 2 external validation signals across domains', required: true, met: true },
    ],
  },
  improvements: {
    profileEdits: [
      'Add a featured section highlighting your best speaking engagements',
      'Pin your highest-performing LinkedIn post to profile',
      'Update banner image with personal branding or conference photo',
    ],
    postIdeas: [
      { idea: 'Share key takeaways from your SaaStr presentation', theme: 'Sovereignty' },
      { idea: 'Write a contrarian take on a common sales methodology', theme: 'Cost pressure' },
      { idea: 'Interview a customer on their buying journey', theme: 'AI governance' },
    ],
    signaturePov: "Enterprise sales in EMEA isn't about localizing US playbooks. It's about building trust-first relationships in markets where buyers expect consultants, not vendors.",
    nextExternalMove: 'Pitch a keynote session at a regional industry conference to expand beyond SaaS-focused events.',
  },
};

// Mock data for Tier 0 preview (Ambiguous identity)
export const MOCK_PERSONA_TIER_0: Partial<ScorecardResult> = {
  identity: {
    status: 'ambiguous',
    dataNeeded: 'LinkedIn URL or unique identifier',
  },
  overall: {
    score: 0,
    tier: 0,
    tierExplanation: 'Unable to establish identity. Multiple people with this name exist. Additional data required.',
    gatingChecks: [
      { label: 'At least 1 external validation signal', required: true, met: false },
      { label: 'At least 2 external validation signals across domains', required: true, met: false },
    ],
  },
};

// Mock data for Tier 3 preview (Category voice)
export const MOCK_PERSONA_TIER_3: Partial<ScorecardResult> = {
  overall: {
    score: 94,
    tier: 3,
    tierExplanation: 'Category voice in enterprise sales. Book author, keynote speaker, and recognized thought leader across multiple domains.',
    gatingChecks: [
      { label: 'At least 1 external validation signal', required: true, met: true },
      { label: 'At least 2 external validation signals across domains', required: true, met: true },
    ],
  },
};

// Region options
export const REGIONS = ['CH', 'DACH', 'EMEA', 'Global', 'APAC', 'Americas'];

// Industry options
export const INDUSTRIES = [
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail & Consumer',
  'Technology',
  'Energy & Utilities',
  'Government',
  'Education',
  'Professional Services',
  'Telecommunications',
];

// Theme tags for post ideas
export const CURRENT_THEMES = ['Sovereignty', 'Cost pressure', 'AI governance'];
