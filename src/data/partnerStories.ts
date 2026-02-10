// Partner Stories - News → Implication → Action
// Partner-only: condensed, partner-relevant signals with clear "so what" + 1-tap action

export type PartnerSignalType = 'Vendor' | 'Regulatory' | 'LocalMarket';

export type PartnerActionType = 'ApplyToProject' | 'AddToBrief' | 'AddToQuickBrief' | 'OpenTrendingPack' | 'CreateBrief' | 'CreateQuickBrief';

export interface PartnerStoryAction {
  actionType: PartnerActionType;
  actionLabel: string;
  // Optional: link to trending pack if actionType is OpenTrendingPack
  trendingPackId?: string;
}

export interface PartnerStory {
  id: string;
  signalType: PartnerSignalType;
  headline: string; // 6-10 words
  soWhat: string; // max ~90 characters - the implication
  primaryAction: PartnerStoryAction;
  
  // Enriched detail fields (from StoryCardV1)
  whatChanged?: string;
  whatChangedBullets?: string[]; // max 2 short factual bullets
  whoCares?: string[]; // 2-4 relevant roles
  nextMove?: { talkTrack: string; proofToAsk: string };
  
  // Visual
  coverUrl?: string;
  logoUrl?: string; // For vendor signals
  personImageUrl?: string; // For news/customer signals
  
  // Metadata
  publishedAt: string;
  expiresAt: string; // Stories expire after 7-14 days
  sourceName?: string;
  sourceUrl?: string;
  tags?: string[];

  // Relevance fields (optional, render only when present)
  relevance_summary?: string;
  relevance_score?: number; // 0–100
  relevance_reasons?: string[];
}

// Helper to create expiry date
function getExpiryDate(daysFromNow: number = 10): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

// Check if story is expired
export function isStoryExpired(story: PartnerStory): boolean {
  return new Date(story.expiresAt) < new Date();
}

// Get non-expired stories
export function getActivePartnerStories(stories: PartnerStory[]): PartnerStory[] {
  return stories.filter(s => !isStoryExpired(s));
}

// Signal type styling
export const signalTypeColors: Record<PartnerSignalType, string> = {
  Vendor: 'bg-blue-50/90 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700',
  Regulatory: 'bg-[#EEF0FF] text-[#4F46E5] border-[#C7CCFF] dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700',
  LocalMarket: 'bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
};

export const signalTypeGradients: Record<PartnerSignalType, string> = {
  Vendor: 'from-blue-500 to-blue-700',
  Regulatory: 'from-[#6D6AF6] to-[#4F46E5]',
  LocalMarket: 'from-emerald-500 to-emerald-700',
};

// Seed mock Partner Stories (MVP)
export const partnerStories: PartnerStory[] = [
  // VENDOR SIGNALS (3)
  {
    id: 'ps-vendor-001',
    signalType: 'Vendor',
    headline: 'Copilot Governance Controls Now Generally Available',
    soWhat: 'Partners can now position admin controls as a key differentiator in security-conscious deals.',
    primaryAction: {
      actionType: 'AddToBrief',
      actionLabel: 'Add to Brief',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date().toISOString(),
    expiresAt: getExpiryDate(12),
    sourceName: 'Microsoft Partner Network',
    tags: ['Copilot', 'Governance', 'Security'],
  },
  {
    id: 'ps-vendor-002',
    signalType: 'Vendor',
    headline: 'Purview AI Hub Adds Auto-Classification',
    soWhat: 'Compliance-heavy verticals (finance, health) now have a faster path to AI data governance.',
    primaryAction: {
      actionType: 'OpenTrendingPack',
      actionLabel: 'See Responsible AI Pack',
      trendingPackId: 'tp-responsible-ai',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date().toISOString(),
    expiresAt: getExpiryDate(14),
    sourceName: 'Microsoft Tech Community',
    tags: ['Purview', 'Compliance', 'AI'],
  },
  {
    id: 'ps-vendor-003',
    signalType: 'Vendor',
    headline: 'Partner Incentives Updated for Azure AI',
    soWhat: 'New rebate tiers favor partners with certified AI workloads—check eligibility now.',
    primaryAction: {
      actionType: 'CreateQuickBrief',
      actionLabel: 'Quick Brief',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expiresAt: getExpiryDate(10),
    sourceName: 'Partner Center',
    tags: ['Incentives', 'Azure AI', 'Revenue'],
  },

  // REGULATORY SIGNALS (2)
  {
    id: 'ps-reg-001',
    signalType: 'Regulatory',
    headline: 'EU AI Act Enforcement Timeline Confirmed',
    soWhat: 'High-risk AI systems must comply by Aug 2026—position governance tooling now.',
    primaryAction: {
      actionType: 'OpenTrendingPack',
      actionLabel: 'See Responsible AI Pack',
      trendingPackId: 'tp-responsible-ai',
    },
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    expiresAt: getExpiryDate(14),
    sourceName: 'European Commission',
    tags: ['EU AI Act', 'Compliance', 'Governance'],
  },
  {
    id: 'ps-reg-002',
    signalType: 'Regulatory',
    headline: 'Data Residency Focus Intensifies in DACH',
    soWhat: 'German buyers now require explicit residency guarantees before shortlisting vendors.',
    primaryAction: {
      actionType: 'AddToBrief',
      actionLabel: 'Add to Brief',
    },
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    expiresAt: getExpiryDate(12),
    sourceName: 'Field Intel',
    tags: ['Data Residency', 'DACH', 'Security'],
  },

  // LOCAL MARKET SIGNALS (2)
  {
    id: 'ps-local-001',
    signalType: 'LocalMarket',
    headline: 'UK Public Sector AI Funding Round Opens',
    soWhat: '£50M allocated for AI modernization—partners with public sector expertise should engage now.',
    primaryAction: {
      actionType: 'CreateQuickBrief',
      actionLabel: 'Start Quick Brief',
    },
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    expiresAt: getExpiryDate(10),
    sourceName: 'UK Government Digital Service',
    tags: ['UK', 'Public Sector', 'Funding'],
  },
  {
    id: 'ps-local-002',
    signalType: 'LocalMarket',
    headline: 'Nordics Manufacturing AI Adoption Surges',
    soWhat: '40% of Nordic manufacturers now piloting AI—strong opportunity for implementation partners.',
    primaryAction: {
      actionType: 'AddToBrief',
      actionLabel: 'Add to Brief',
    },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    expiresAt: getExpiryDate(14),
    sourceName: 'Nordic Digital Report',
    tags: ['Nordics', 'Manufacturing', 'AI'],
  },

  // Extra vendor signal
  {
    id: 'ps-vendor-004',
    signalType: 'Vendor',
    headline: 'Azure OpenAI Regional Availability Expands',
    soWhat: 'New regions enable data residency compliance—key for regulated industry deals.',
    primaryAction: {
      actionType: 'AddToBrief',
      actionLabel: 'Add to Brief',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    expiresAt: getExpiryDate(8),
    sourceName: 'Azure Updates',
    tags: ['Azure OpenAI', 'Regions', 'Compliance'],
  },
];

// Get capped stories for homepage (max 8, non-expired)
export function getHomepagePartnerStories(maxCount: number = 8): PartnerStory[] {
  const active = getActivePartnerStories(partnerStories);
  // Sort by publishedAt (newest first)
  const sorted = active.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return sorted.slice(0, maxCount);
}
