// Partner Data Contracts v0.1
// Canonical types for Option A (precomputed) and future Option B (live generation)

// ============= Core Invariants =============

export type MotionType = 'DIRECT' | 'PARTNER';

export interface CoreInvariants {
  motionType: MotionType;
  hubOrgId: string;
  focusId: string;
  primaryVendorId: string; // may equal hubOrgId in DIRECT
}

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

export interface FocusEntity {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  description?: string;
}

// ============= Module Pack Types =============

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

// ============= Extraction Run =============

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

export interface ExtractionRun {
  runId: string;
  motionType: MotionType;
  hubOrgId: string;
  focusId: string;
  primaryVendorId: string;
  weekOfDate: string; // ISO date string
  promptVersion: string;
  isSimulated: boolean;
  createdAt: string; // ISO
  modulePacks: ModulePacks;
}

// ============= Derived Artifact =============

export type ArtifactType =
  | 'quickBrief'
  | 'dealBrief'
  | 'emailDraft'
  | 'packageRecs'
  | 'storyCards';

export type PersonaType = 'seller' | 'engineer';

export interface DerivedArtifact<T = unknown> {
  artifactId: string;
  runId: string;
  artifactType: ArtifactType;
  persona?: PersonaType;
  formatVersion: string;
  isSimulated: boolean;
  createdAt: string; // ISO
  content: T;
}

// ============= Quick Brief V1 Content Shape =============

export interface QuickBriefV1Source {
  label: string;
  sourceType: 'internal_note' | 'url';
  url?: string;
}

export interface QuickBriefV1 {
  whatChanged: [string, string, string]; // MUST be length 3
  soWhat: string;
  actions: [string, string, string]; // MUST be length 3
  confidence: 'High' | 'Medium' | 'Low';
  whatsMissing: [string, string, string]; // MUST be length 3
  emailDraft?: { subject: string; body: string };
  sources: QuickBriefV1Source[];
}

// ============= Deal Brief V1 Content Shape =============

export interface DealBriefV1 {
  customerName: string;
  dealMotion: string;
  scope: string;
  aiUseCases: string[];
  constraints: string[];
  sellerNarrative: string;
  engineerArchitecture: string;
  readinessScore: number;
  topBlockers: string[];
  missingChecklist: string[];
}

// ============= Package Recs V1 Content Shape =============

export interface PackageRecsV1 {
  recommendations: PackageRecommendation[];
}

export interface PackageRecommendation {
  packageId: string;
  packageName: string;
  fitLabel: 'Easy attach' | 'Net-new build';
  reason: string;
  suggestedTier: 'good' | 'better' | 'best';
}

// ============= Story Cards V1 Content Shape =============

export interface StoryCardV1 {
  id: string;
  signalType: 'Vendor' | 'Regulatory' | 'LocalMarket';
  headline: string;
  soWhat: string;
  action: string;
  source?: string;
  publishedAt: string;
  expiresAt: string;
  logoUrl?: string;
}
