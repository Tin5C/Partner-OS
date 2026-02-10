// Demo Focus Data Provider (Option A — precomputed artifacts)
// Reads from demoDataset.ts and validates invariants

import type {
  HubOrg,
  Vendor,
  FocusEntity,
  FocusTouchpointContext,
  ExtractionRun,
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  QuickBriefV1,
  PackageRecsV1,
  StoryCardsV1,
  DealBriefV1,
} from './contracts';
import type { FocusDataProvider } from './FocusDataProvider';
import {
  assertQuickBriefV1,
  assertStoryCardsV1,
  assertDealBriefV1,
} from './validation';
import {
  DEMO_HUB_ORG,
  DEMO_VENDORS,
  DEMO_FOCUS_ENTITIES,
  DEMO_EXTRACTION_RUN,
  DEMO_ARTIFACTS,
} from './demo/demoDataset';

// ============= Demo Provider =============

export class DemoFocusDataProvider implements FocusDataProvider {
  private artifacts: DerivedArtifact[];
  private run: ExtractionRun;

  constructor() {
    this.run = DEMO_EXTRACTION_RUN;
    this.artifacts = DEMO_ARTIFACTS;
    this.validate();
  }

  private validate(): void {
    for (const artifact of this.artifacts) {
      if (artifact.artifactType === 'quickBrief') {
        assertQuickBriefV1(artifact.content as QuickBriefV1);
      }
      if (artifact.artifactType === 'storyCards') {
        assertStoryCardsV1(artifact.content as StoryCardsV1);
      }
      if (artifact.artifactType === 'dealBrief') {
        assertDealBriefV1(artifact.content as DealBriefV1);
      }
    }
  }

  getHubOrg(): HubOrg {
    return DEMO_HUB_ORG;
  }

  listVendors(): Vendor[] {
    return DEMO_VENDORS;
  }

  listFocusEntities(): FocusEntity[] {
    return DEMO_FOCUS_ENTITIES;
  }

  getActiveRun(params: {
    hubOrgId: string;
    focusId: string;
    weekOfDate: string;
  }): ExtractionRun | null {
    if (
      this.run.hubOrgId === params.hubOrgId &&
      this.run.focusId === params.focusId
    ) {
      return this.run;
    }
    return null;
  }

  getArtifact(params: {
    runId: string;
    artifactType: ArtifactType;
    persona?: PersonaType;
  }): DerivedArtifact | null {
    return (
      this.artifacts.find(
        (a) =>
          a.runId === params.runId &&
          a.artifactType === params.artifactType &&
          (params.persona ? a.persona === params.persona : true)
      ) ?? null
    );
  }

  listStoryCards(params: {
    runId: string;
    focusId: string;
  }): DerivedArtifact<StoryCardsV1> | null {
    const art = this.artifacts.find(
      (a) => a.runId === params.runId && a.artifactType === 'storyCards'
    );
    return (art as DerivedArtifact<StoryCardsV1>) ?? null;
  }

  recommendPackages(params: {
    runId: string;
    focusId: string;
  }): DerivedArtifact<PackageRecsV1> | null {
    const art = this.artifacts.find(
      (a) => a.runId === params.runId && a.artifactType === 'packageRecs'
    );
    return (art as DerivedArtifact<PackageRecsV1>) ?? null;
  }
}
