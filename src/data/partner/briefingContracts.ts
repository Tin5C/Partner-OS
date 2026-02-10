// On-Demand Briefing Contracts
// Types for BriefingRequest + BriefingArtifact

export type BriefingType =
  | 'vendor_updates'
  | 'account_microcast'
  | 'industry_microcast'
  | 'competitive_microcast'
  | 'objections_brief';

export const BRIEFING_TYPE_LABELS: Record<BriefingType, string> = {
  vendor_updates: 'Vendor Product Updates',
  account_microcast: 'Account Microcast',
  industry_microcast: 'Industry Microcast',
  competitive_microcast: 'Competitive Angle',
  objections_brief: 'Objection Briefing',
};

export type BriefingSourceMode = 'seeded_only' | 'seeded_then_generate';

// ============= Request =============

export interface BriefingRequest {
  id: string;
  hubOrgId: string;
  focusId?: string;
  vendorId?: string;
  briefingType: BriefingType;
  requestedByPersonId: string;
  tags?: string[];
  storyId?: string;
  createdAt: string; // ISO
  isSimulated: boolean;
}

// ============= Artifact =============

export interface BriefingAction {
  title: string;
  who: string;
  whatToClarify: string;
  howToThink: string;
}

export interface BriefingObjection {
  theme: string;
  pushback: string;
  response: string;
  evidence?: string;
}

export interface BriefingSource {
  name: string;
  title: string;
  url?: string;
  sourceType: string;
  isInternalNote: boolean;
}

export interface BriefingArtifact {
  id: string;
  requestId?: string;
  hubOrgId: string;
  focusId?: string;
  vendorId?: string;
  briefingType: BriefingType;
  title: string;
  estMinutes: number;
  scriptText: string;
  readText: string;
  actions: BriefingAction[];
  proofArtifacts: string[];
  objections?: BriefingObjection[];
  sources: BriefingSource[];
  createdAt: string; // ISO
  isSimulated: boolean;
}

// ============= Provider Response =============

export type BriefingResult =
  | { kind: 'found'; artifact: BriefingArtifact }
  | { kind: 'NotAvailableYet'; signature: string };
