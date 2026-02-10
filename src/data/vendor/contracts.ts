// Vendor Channel Management — Data Contracts
// Completely isolated from Partner execution models (BriefingRequest/BriefingArtifact)

// ============= Governance =============

export type GovernanceStatus = 'draft' | 'approved' | 'deprecated';

export interface GovernanceMetadata {
  status: GovernanceStatus;
  lastReviewedAt: string; // ISO
  reviewedBy: string;
}

// ============= Enablement Atom =============
// The core vendor content unit — product updates, objections, proof, guardrails

export type AtomType =
  | 'product_update'
  | 'objection'
  | 'proof_artifact'
  | 'positioning_guardrail';

export const ATOM_TYPE_LABELS: Record<AtomType, string> = {
  product_update: 'Product Update',
  objection: 'Objection & Response',
  proof_artifact: 'Proof Artifact',
  positioning_guardrail: 'Positioning Guardrail',
};

export interface EnablementAtom {
  id: string;
  vendorId: string;
  atomType: AtomType;
  title: string;
  body: string; // Markdown content
  tags: string[];
  governance: GovernanceMetadata;
  createdAt: string; // ISO
  isSimulated: boolean;
}

// ============= Publishing Target =============

export interface PublishingTarget {
  id: string;
  atomId: string;
  targetSegment: string; // e.g. "All Partners", "Gold Tier", "DACH Region"
  publishedAt?: string; // ISO, undefined if not yet published
  briefingArtifactId?: string; // ID of the created BriefingArtifact in partner system
}

// ============= Program Signal =============
// Vendor-originated announcements (maps to Stories in partner space)

export interface ProgramSignal {
  id: string;
  vendorId: string;
  title: string;
  summary: string;
  signalType: 'product_launch' | 'program_change' | 'incentive' | 'deprecation';
  governance: GovernanceMetadata;
  createdAt: string;
  isSimulated: boolean;
}

export const SIGNAL_TYPE_LABELS: Record<ProgramSignal['signalType'], string> = {
  product_launch: 'Product Launch',
  program_change: 'Program Change',
  incentive: 'Incentive',
  deprecation: 'Deprecation',
};

// ============= Vendor Insight Event =============

export interface VendorInsightEvent {
  id: string;
  vendorId: string;
  metric: string;
  value: number;
  unit: string;
  period: string;
  trend: 'up' | 'down' | 'flat';
  isSimulated: boolean;
}
