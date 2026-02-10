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

  // Linking fields (optional, for cross-referencing)
  linked_accountSignalIds?: string[];
  linked_objectionIds?: string[];
  linked_briefingArtifactIds?: string[];
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
  // ── HelioWorks × Schindler stories (6) ──
  {
    id: 'hw-story-01',
    signalType: 'Vendor',
    headline: 'Governed pilot moment: results + procurement + scoping',
    soWhat: 'Budget scrutiny and booked scoping indicate readiness for a governed Copilot pilot.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'Schindler enters executive results cadence while procurement and IT actively scope AI.',
    whatChangedBullets: [
      'Q1 results review triggers exec scrutiny on AI spend.',
      'Procurement + IT scoping meetings booked for Feb.',
    ],
    whoCares: ['CFO/Finance', 'Procurement', 'CIO/IT Program', 'CISO/Security'],
    nextMove: {
      talkTrack: 'We can frame a governed pilot scope that satisfies both cost controls and security review.',
      proofToAsk: 'Cloud cost governance thresholds + approval workflow owner',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date().toISOString(),
    expiresAt: getExpiryDate(12),
    sourceName: 'Internal engagement signals',
    tags: ['Copilot', 'Governance', 'FinOps', 'Schindler'],
    relevance_summary: 'Budget + scoping convergence creates a narrow window for governance-first pilot positioning.',
    relevance_score: 88,
    relevance_reasons: ['Active procurement scoping', 'Exec results cadence', 'Cost governance gaps identified'],
    linked_accountSignalIds: ['sig_sch_01'],
    linked_objectionIds: ['obj_01'],
    linked_briefingArtifactIds: ['ba_account_microcast_01'],
  },
  {
    id: 'hw-story-02',
    signalType: 'Regulatory',
    headline: 'Security gating: governance + residency posture',
    soWhat: 'Security engagement is repeated and explicit — governance artifacts are preconditions.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'Security team repeatedly engages on governance; residency posture decisions pending.',
    whatChangedBullets: [
      'Security microcast replayed twice by CISO-adjacent role.',
      'Governance email reply confirms active evaluation thread.',
    ],
    whoCares: ['Security Lead/CISO', 'Enterprise Architect', 'Legal/Compliance', 'Procurement'],
    nextMove: {
      talkTrack: 'We should bring the RACI and residency posture docs to the next security touchpoint.',
      proofToAsk: 'Security questionnaire template',
    },
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: getExpiryDate(14),
    sourceName: 'Internal engagement signals',
    tags: ['Security', 'Governance', 'Residency', 'Schindler'],
    relevance_summary: 'Security is the gating function — governance artifacts unlock scope expansion.',
    relevance_score: 92,
    relevance_reasons: ['Repeated security content engagement', 'Residency posture unresolved', 'CISO actively involved'],
    linked_accountSignalIds: ['sig_sch_02'],
    linked_objectionIds: ['obj_01'],
    linked_briefingArtifactIds: ['ba_objection_briefing_01'],
  },
  {
    id: 'hw-story-03',
    signalType: 'Vendor',
    headline: 'RAG evidence pull: architecture proof needed',
    soWhat: 'Technical feasibility validation converges on grounded Copilot scenarios.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'RAG architecture doc opened and copied — technical evaluation is active.',
    whatChangedBullets: [
      'Architecture doc copied (likely shared with internal team).',
      'Knowledge base inventory still missing.',
    ],
    whoCares: ['Solution Architect', 'IT Program', 'Security/Compliance'],
    nextMove: {
      talkTrack: 'Let\'s map the in-scope knowledge bases and validate the permissions model together.',
      proofToAsk: 'Knowledge base inventory + in-scope systems',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: getExpiryDate(10),
    sourceName: 'Internal engagement signals',
    tags: ['RAG', 'Architecture', 'Copilot', 'Schindler'],
    relevance_summary: 'Architecture artifacts are circulating internally — feasibility validation is underway.',
    relevance_score: 78,
    relevance_reasons: ['Architecture doc copied', 'KB inventory gap', 'Technical evaluation active'],
    linked_accountSignalIds: ['sig_sch_03'],
    linked_objectionIds: ['obj_02'],
    linked_briefingArtifactIds: ['ba_account_microcast_01'],
  },
  {
    id: 'hw-story-04',
    signalType: 'LocalMarket',
    headline: 'Field service sponsor emerging: technician workflows',
    soWhat: 'Internal champion is amplifying field service use case to peers.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'Field service story forwarded internally — adoption advocacy building.',
    whatChangedBullets: [
      'Story forwarded to a colleague in field operations.',
      'Field ops hiring patterns suggest investment intent.',
    ],
    whoCares: ['Head of Field Service Ops', 'Solution Architect', 'IT Program'],
    nextMove: {
      talkTrack: 'We should identify the forwarded-to person and scope a field ops pilot.',
      proofToAsk: 'Technician tooling map + top workflows + success metrics',
    },
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: getExpiryDate(12),
    sourceName: 'Internal engagement signals',
    tags: ['Field Service', 'Adoption', 'Copilot', 'Schindler'],
    relevance_summary: 'Organic internal advocacy for field ops AI — sponsor identification opportunity.',
    relevance_score: 72,
    relevance_reasons: ['Story forwarded internally', 'Field ops hiring patterns', 'Adoption pull signal'],
    linked_accountSignalIds: ['sig_sch_03'],
    linked_objectionIds: ['obj_03'],
    linked_briefingArtifactIds: ['ba_industry_microcast_01'],
  },
  {
    id: 'hw-story-05',
    signalType: 'Vendor',
    headline: 'FinOps for AI: cost thresholds before rollout',
    soWhat: 'Seller consumed cost-governance content — likely preparing for CFO conversation.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'FinOps objection briefing fully completed by seller.',
    whatChangedBullets: [
      'Full completion of FinOps content signals imminent budget discussion.',
      'Cost threshold policy still undefined.',
    ],
    whoCares: ['CFO/Finance', 'Procurement', 'CIO/IT Program'],
    nextMove: {
      talkTrack: 'We can provide a cost threshold template and FinOps-for-AI workshop to de-risk the budget conversation.',
      proofToAsk: 'Cloud cost governance thresholds + approval workflow owner',
    },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: getExpiryDate(10),
    sourceName: 'Internal engagement signals',
    tags: ['FinOps', 'Cost Governance', 'Copilot', 'Schindler'],
    relevance_summary: 'FinOps content completion signals CFO conversation is imminent.',
    relevance_score: 82,
    relevance_reasons: ['Full content completion', 'Budget discussion pending', 'Cost policy gap'],
    linked_accountSignalIds: ['sig_sch_01'],
    linked_objectionIds: [],
    linked_briefingArtifactIds: ['ba_account_microcast_01'],
  },
  {
    id: 'hw-story-06',
    signalType: 'Regulatory',
    headline: 'Governance operating model: RACI + approvals',
    soWhat: 'Customer replied to governance follow-up — engagement loop is active.',
    primaryAction: { actionType: 'AddToQuickBrief', actionLabel: 'Add to Quick Brief' },
    whatChanged: 'Governance email reply confirms the thread is alive and customer is responsive.',
    whatChangedBullets: [
      'Email reply on governance thread received.',
      'Named model risk owner still unconfirmed.',
    ],
    whoCares: ['CISO/Security', 'Enterprise Architect', 'Legal/Compliance', 'Risk/Compliance'],
    nextMove: {
      talkTrack: 'Let\'s schedule the governance workshop and bring the audit artifacts checklist.',
      proofToAsk: 'Approval workflow + named model risk owner',
    },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: getExpiryDate(14),
    sourceName: 'Internal engagement signals',
    tags: ['Governance', 'RACI', 'Approvals', 'Schindler'],
    relevance_summary: 'Active customer engagement on governance — workshop scheduling opportunity.',
    relevance_score: 85,
    relevance_reasons: ['Email reply received', 'Governance thread active', 'Risk owner gap'],
    linked_accountSignalIds: ['sig_sch_02'],
    linked_objectionIds: ['obj_01'],
    linked_briefingArtifactIds: ['ba_objection_briefing_01'],
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
