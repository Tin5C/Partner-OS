// Partner Data Contracts v0.1
// Canonical types for Option A (precomputed) and future Option B (live generation)

// ============= Core Invariants =============

export type MotionType = 'DIRECT' | 'PARTNER';

export type ArtifactType =
  | 'storyCards'
  | 'quickBrief'
  | 'dealBrief'
  | 'play'
  | 'packageRecs'
  | 'emailDraft'
  | 'microcast';

export type PersonaType = 'seller' | 'engineer';
export type PlayType = 'product' | 'competitive' | 'objection';

// ============= Entity Types =============

export interface HubOrg {
  id: string;
  name: string;
  motionType: MotionType;
  region?: string;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  logoUrl?: string;
  isPrimary: boolean;
  tags?: string[];
}

export interface FocusTouchpointContext {
  lastTouchpoint: { date: string; summary: string };
  nextMeeting?: { date: string; summary: string };
  keyAttendees: { name: string; role: string }[];
}

export interface FocusEntity {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  description?: string;
  touchpointContext?: FocusTouchpointContext; // Seeded CRM/calendar-like context
}

// ============= Source Reference =============

export interface ArtifactSource {
  label: string;
  sourceType: 'url' | 'internal_note';
  url?: string;
}

// ============= Derived Artifact (unified envelope) =============

export interface DerivedArtifact<T = unknown> {
  artifactId: string;
  runId: string;
  artifactType: ArtifactType;
  formatVersion: string;
  persona?: PersonaType;
  playType?: PlayType;
  focusId: string;
  hubOrgId: string;
  primaryVendorId: string;
  weekOfDate: string; // ISO
  motionType: MotionType;
  isSimulated: boolean;
  createdAt: string; // ISO
  content: T;
}

// ============= A) StoryCardsV1 =============

export interface StoryCardCTA {
  type: 'listen_microcast';
  microcastType: MicrocastType;
  label: string;
}

export interface StoryCardNextMove {
  talkTrack: string; // 1 sentence max
  proofToAsk: string; // concrete artifact to request
}

export interface StoryCardV1 {
  cardId: string;
  title: string;
  whatChanged: string;
  whatChangedBullets?: string[]; // max 2 short factual bullets
  whyItMatters: string;
  whoCares?: string[]; // 2-4 relevant roles (e.g., 'Compliance', 'Security')
  nextMove?: StoryCardNextMove;
  expiresAt: string; // ISO
  tags: string[];
  suggestedAction: string;
  packId?: string;
  confidence: 'High' | 'Medium' | 'Low';
  sources: ArtifactSource[];
  simulated: boolean;
  ctas?: StoryCardCTA[];

  // Relevance fields (optional, render only when present)
  relevance_summary?: string;
  relevance_score?: number; // 0–100
  relevance_reasons?: string[];

  // Linking fields (optional, for cross-referencing)
  linked_accountSignalIds?: string[];
  linked_objectionIds?: string[];
  linked_briefingArtifactIds?: string[];
}

export interface StoryCardsV1 {
  cards: StoryCardV1[]; // max 6
  simulated: boolean;
}

// ============= B) QuickBriefV1 =============

export interface QuickBriefV1 {
  whatChanged: [string, string, string];
  soWhat: string;
  actions: [string, string, string];
  confidence: 'High' | 'Medium' | 'Low';
  whatsMissing: [string, string, string];
  optionalEmail?: { subject: string; body: string };
  sources: ArtifactSource[];
  simulated: boolean;
}

// ============= C) DealBriefV1 =============

export interface DealBriefV1Stakeholder {
  name: string;
  role: string;
  stance?: string;
}

export interface DealBriefV1RecommendedPlay {
  playType: PlayType;
  title: string;
}

export interface DealBriefV1 {
  dealObjective: string;
  currentSituation?: string;
  topSignals: string[]; // <= 3
  stakeholders: DealBriefV1Stakeholder[]; // <= 12
  risks: string[];
  proofArtifactsToAskFor: string[];
  executionPlan: string[];
  recommendedPlays: DealBriefV1RecommendedPlay[]; // <= 3
  openQuestions: string[];
  sources: ArtifactSource[];
  simulated: boolean;
}

// ============= D) PlayV1 =============

export interface PlayV1Objection {
  objection: string;
  response: string;
  whatNotToSay: string;
  proofArtifact: string;
}

export interface PlayV1 {
  title: string;
  estMinutes: number; // 3–6
  modes: ('audio' | 'read')[];
  triggers: string[]; // 3–6
  objective: string;
  talkTrack: string[]; // 6–10
  objections: PlayV1Objection[]; // 5–8
  proofArtifacts: string[]; // 5–10
  discoveryPrompts: string[]; // 6–10
  nextActions: string[]; // 2–4
  redFlags: string[]; // 3–5
  sources: ArtifactSource[];
  lastReviewed: string; // ISO
  simulated: boolean;
}

// ============= Module Pack Types (ExtractionRun) =============

export interface Module0A_HubOrg {
  profile: string;
  capabilities: string[];
  attachSurfaces: string[];
}

export interface Module0V_Vendor {
  vendorId: string;
  vendorName: string;
  recentUpdates: string[];
  incentives: string[];
}

export interface Module0B_Focus {
  focusId: string;
  focusName: string;
  industry: string;
  signals: string[];
  knownStack: string[];
  painPoints: string[];
}

export interface Module1_Weekly {
  weekOfDate: string;
  selectedSignals: WeeklySignal[];
  marketContext: string[];
}

export interface WeeklySignal {
  id: string;
  signalType: 'Vendor' | 'Regulatory' | 'LocalMarket';
  headline: string;
  soWhat: string;
  action: string;
  source?: string;
  publishedAt: string;
}

export interface ModulePacks {
  module0A_hubOrg: Module0A_HubOrg;
  module0V_vendor: Module0V_Vendor;
  module0B_focus: Module0B_Focus;
  module1_weekly: Module1_Weekly;
  module2?: Record<string, unknown>;
  module3?: Record<string, unknown>;
  module4?: Record<string, unknown>;
  module5?: Record<string, unknown>;
  module6?: Record<string, unknown>;
}

export interface ExtractionRunMeta {
  hubOrgId: string;
  focusId: string;
  vendorId: string;
  weekKey: string; // canonical ISO week YYYY-Www
}

export interface ExtractionRun {
  runId: string;
  motionType: MotionType;
  hubOrgId: string;
  focusId: string;
  primaryVendorId: string;
  weekOfDate: string;
  promptVersion: string;
  isSimulated: boolean;
  createdAt: string;
  modulePacks: ModulePacks;
  meta?: ExtractionRunMeta;
}

// ============= Package Recs V1 =============

export interface PackageRecommendation {
  packageId: string;
  packageName: string;
  fitLabel: 'Easy attach' | 'Net-new build';
  reason: string;
  suggestedTier: 'good' | 'better' | 'best';
}

export interface PackageRecsV1 {
  recommendations: PackageRecommendation[];
}

// ============= Microcast V1 =============

export type MicrocastType = 'account' | 'industry';

export interface MicrocastV1 {
  id: string;
  microcastType: MicrocastType;
  title: string;
  estMinutes: number;
  scriptText: string;
  readText: string;
  actions: [string, string, string];
  proofArtifacts: [string, string, string];
  sources: ArtifactSource[];
  sourceStoryIds: string[];
  focusId: string;
  hubOrgId: string;
  weekOfDate: string;
  isSimulated: boolean;
  createdAt: string;
}
