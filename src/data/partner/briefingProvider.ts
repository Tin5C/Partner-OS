// Briefing Provider — signature-based lookup for On-Demand Briefings
// UI must only talk to this provider, never import seeded data directly.

import type {
  BriefingRequest,
  BriefingArtifact,
  BriefingType,
  BriefingResult,
  BriefingSourceMode,
} from './briefingContracts';
import { SEEDED_BRIEFINGS } from './demo/seededBriefings';

let idCounter = 0;

// ============= Signature =============

export function buildBriefingSignature(params: {
  hubOrgId: string;
  briefingType: BriefingType;
  focusId?: string;
  vendorId?: string;
  tags?: string[];
}): string {
  const normalizedTags = (params.tags ?? [])
    .map((t) => t.toLowerCase().trim())
    .sort()
    .join('|');
  return [
    params.hubOrgId,
    params.briefingType,
    params.focusId ?? '',
    params.vendorId ?? '',
    normalizedTags,
  ].join('::');
}

// ============= Seeded Store =============

const seededStore = new Map<string, BriefingArtifact>();

export function initSeededStore() {
  seededStore.clear();
  for (const artifact of SEEDED_BRIEFINGS) {
    const sig = buildBriefingSignature({
      hubOrgId: artifact.hubOrgId,
      briefingType: artifact.briefingType,
      focusId: artifact.focusId,
      vendorId: artifact.vendorId,
    });
    seededStore.set(sig, artifact);
  }
}

// Init on load
initSeededStore();

// ============= Recent briefings (session-only) =============

const recentBriefings: BriefingArtifact[] = [];

// ============= Provider Functions =============

export function createBriefingRequest(input: {
  hubOrgId: string;
  focusId?: string;
  vendorId?: string;
  briefingType: BriefingType;
  tags?: string[];
  storyId?: string;
}): BriefingRequest {
  idCounter++;
  return {
    id: `breq-${idCounter}`,
    hubOrgId: input.hubOrgId,
    focusId: input.focusId,
    vendorId: input.vendorId,
    briefingType: input.briefingType,
    requestedByPersonId: 'demo-user',
    tags: input.tags,
    storyId: input.storyId,
    createdAt: new Date().toISOString(),
    isSimulated: true,
  };
}

export function findPreseededBriefingArtifact(signature: string): BriefingArtifact | null {
  return seededStore.get(signature) ?? null;
}

export function generateBriefingArtifactFromRequest(
  req: BriefingRequest,
  sourceMode: BriefingSourceMode
): BriefingResult {
  const sig = buildBriefingSignature({
    hubOrgId: req.hubOrgId,
    briefingType: req.briefingType,
    focusId: req.focusId,
    vendorId: req.vendorId,
    tags: req.tags,
  });

  const seeded = findPreseededBriefingArtifact(sig);
  if (seeded) {
    // Track as recent
    if (!recentBriefings.find((b) => b.id === seeded.id)) {
      recentBriefings.unshift(seeded);
      if (recentBriefings.length > 10) recentBriefings.pop();
    }
    return { kind: 'found', artifact: seeded };
  }

  if (sourceMode === 'seeded_only') {
    return { kind: 'NotAvailableYet', signature: sig };
  }

  // seeded_then_generate: produce a deterministic stub (no OpenAI)
  const stub: BriefingArtifact = {
    id: `bgen-${Date.now()}`,
    requestId: req.id,
    hubOrgId: req.hubOrgId,
    focusId: req.focusId,
    vendorId: req.vendorId,
    briefingType: req.briefingType,
    title: `Generated ${req.briefingType.replace(/_/g, ' ')} briefing`,
    estMinutes: 4,
    scriptText: 'This is a generated demo stub. In production, this would be a full AI-generated script.',
    readText: '## Generated Briefing\n\nThis is a generated demo stub. In production, this would contain a full structured briefing.',
    actions: [
      { title: 'Review generated content', who: 'Seller', whatToClarify: 'Check relevance', howToThink: 'Validate with latest signals' },
      { title: 'Share with team', who: 'Seller', whatToClarify: 'Which stakeholders?', howToThink: 'Consider decision-makers' },
      { title: 'Follow up', who: 'Seller', whatToClarify: 'Timeline?', howToThink: 'Align with deal cycle' },
    ],
    proofArtifacts: ['Generated proof artifact placeholder'],
    sources: [{ name: 'Demo', title: 'Demo source', sourceType: 'internal_note', isInternalNote: true }],
    createdAt: new Date().toISOString(),
    isSimulated: true,
  };

  recentBriefings.unshift(stub);
  if (recentBriefings.length > 10) recentBriefings.pop();
  return { kind: 'found', artifact: stub };
}

export function listBriefingArtifacts(
  hubOrgId: string,
  focusId?: string,
  limit = 3
): BriefingArtifact[] {
  let results = recentBriefings.filter((b) => b.hubOrgId === hubOrgId);
  if (focusId) results = results.filter((b) => !b.focusId || b.focusId === focusId);
  return results.slice(0, limit);
}

export function getBriefingArtifact(id: string): BriefingArtifact | null {
  return recentBriefings.find((b) => b.id === id) ?? null;
}

// Get all seeded artifacts (for card availability check)
export function getSeededSignatures(): string[] {
  return Array.from(seededStore.keys());
}

export function hasSeededBriefing(params: {
  hubOrgId: string;
  briefingType: BriefingType;
  focusId?: string;
  vendorId?: string;
}): boolean {
  const sig = buildBriefingSignature(params);
  return seededStore.has(sig);
}
