// PartnerDataProvider Interface
// Abstraction layer for Option A (precomputed) and Option B (live generation)

import type {
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  PlayType,
  FocusEntity,
  MotionType,
} from './contracts';

// ============= Active Context =============

export interface ActiveContext {
  runId: string;
  hubOrgId: string;
  focusId: string;
  primaryVendorId: string;
  weekOfDate: string;
  motionType: MotionType;
}

// ============= Provider Interface =============

export interface PartnerDataProvider {
  getActiveContext(): ActiveContext | null;

  getArtifact(params: {
    runId: string;
    artifactType: ArtifactType;
    persona?: PersonaType;
    playType?: PlayType;
  }): DerivedArtifact | null;

  listArtifacts(runId: string): DerivedArtifact[];

  listFocusEntities(): FocusEntity[];
}
