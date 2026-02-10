// Import helper: paste one Bundle Transformer JSON output → DerivedArtifact[]

import type { DerivedArtifact, ArtifactType, PersonaType, PlayType, MotionType } from '../contracts';
import { assertQuickBriefV1, assertStoryCardsV1, assertDealBriefV1, assertPlayV1, assertMicrocastV1 } from '../validation';
import type { QuickBriefV1, StoryCardsV1, DealBriefV1, PlayV1, MicrocastV1 } from '../contracts';

// ============= Bundle Format =============

export interface ArtifactBundleEntry {
  artifactType: ArtifactType;
  formatVersion: string;
  persona?: PersonaType;
  playType?: PlayType;
  artifactId?: string;
  content: unknown;
}

export interface ArtifactBundle {
  bundleVersion: string;
  runId: string;
  focusId: string;
  hubOrgId: string;
  primaryVendorId: string;
  weekOfDate: string;
  motionType: MotionType;
  simulated: boolean;
  artifacts: ArtifactBundleEntry[];
}

// ============= Normalize =============

export function normalizeBundle(bundle: ArtifactBundle): DerivedArtifact[] {
  const now = new Date().toISOString();

  const derived = bundle.artifacts.map<DerivedArtifact>((entry, idx) => ({
    artifactId: entry.artifactId ?? `${bundle.runId}-${entry.artifactType}-${entry.persona ?? entry.playType ?? idx}`,
    runId: bundle.runId,
    artifactType: entry.artifactType,
    formatVersion: entry.formatVersion,
    persona: entry.persona,
    playType: entry.playType,
    focusId: bundle.focusId,
    hubOrgId: bundle.hubOrgId,
    primaryVendorId: bundle.primaryVendorId,
    weekOfDate: bundle.weekOfDate,
    motionType: bundle.motionType,
    isSimulated: bundle.simulated,
    createdAt: now,
    content: entry.content,
  }));

  // Validate known artifact types
  for (const a of derived) {
    switch (a.artifactType) {
      case 'quickBrief':
        assertQuickBriefV1(a.content as QuickBriefV1);
        break;
      case 'storyCards':
        assertStoryCardsV1(a.content as StoryCardsV1);
        break;
      case 'dealBrief':
        assertDealBriefV1(a.content as DealBriefV1);
        break;
      case 'play':
        assertPlayV1(a.content as PlayV1);
        break;
      case 'microcast':
        assertMicrocastV1(a.content as MicrocastV1);
        break;
    }
  }

  return derived;
}
