// Focus Data Provider Interface
// Abstraction layer for Option A (precomputed) and Option B (live generation)

import type {
  HubOrg,
  Vendor,
  FocusEntity,
  ExtractionRun,
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  StoryCardsV1,
  PackageRecsV1,
} from './contracts';

// ============= Provider Interface =============

export interface FocusDataProvider {
  getHubOrg(): HubOrg;
  listVendors(): Vendor[];
  listFocusEntities(): FocusEntity[];

  getActiveRun(params: {
    hubOrgId: string;
    focusId: string;
    weekOfDate: string;
  }): ExtractionRun | null;

  getArtifact(params: {
    runId: string;
    artifactType: ArtifactType;
    persona?: PersonaType;
  }): DerivedArtifact | null;

  listStoryCards(params: {
    runId: string;
    focusId: string;
  }): DerivedArtifact<StoryCardsV1> | null;

  recommendPackages(params: {
    runId: string;
    focusId: string;
  }): DerivedArtifact<PackageRecsV1> | null;
}

// ============= Live Provider Stub (Option B — future) =============

export class LiveFocusDataProvider implements FocusDataProvider {
  getHubOrg(): HubOrg {
    return { id: '', name: '', motionType: 'PARTNER' };
  }
  listVendors(): Vendor[] {
    return [];
  }
  listFocusEntities(): FocusEntity[] {
    return [];
  }
  getActiveRun(): ExtractionRun | null {
    return null;
  }
  getArtifact(): DerivedArtifact | null {
    return null;
  }
  listStoryCards(): DerivedArtifact<StoryCardsV1> | null {
    return null;
  }
  recommendPackages(): DerivedArtifact<PackageRecsV1> | null {
    return null;
  }
}
