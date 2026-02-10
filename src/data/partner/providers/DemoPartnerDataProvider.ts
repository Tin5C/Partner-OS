// Demo Partner Data Provider (Option A — precomputed artifacts)
// Reads from demoDataset.ts and validates on construction

import type {
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  PlayType,
  FocusEntity,
  QuickBriefV1,
  StoryCardsV1,
  DealBriefV1,
} from '../contracts';
import type { PartnerDataProvider, ActiveContext } from '../PartnerDataProvider';
import {
  assertQuickBriefV1,
  assertStoryCardsV1,
  assertDealBriefV1,
} from '../validation';
import {
  DEMO_EXTRACTION_RUN,
  DEMO_ARTIFACTS,
  DEMO_FOCUS_ENTITIES,
} from '../demo/demoDataset';

export class DemoPartnerDataProvider implements PartnerDataProvider {
  private artifacts: DerivedArtifact[];
  private context: ActiveContext;

  constructor() {
    const run = DEMO_EXTRACTION_RUN;
    this.context = {
      runId: run.runId,
      hubOrgId: run.hubOrgId,
      focusId: run.focusId,
      primaryVendorId: run.primaryVendorId,
      weekOfDate: run.weekOfDate,
      motionType: run.motionType,
    };
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

  getActiveContext(): ActiveContext {
    return this.context;
  }

  getArtifact(params: {
    runId: string;
    artifactType: ArtifactType;
    persona?: PersonaType;
    playType?: PlayType;
  }): DerivedArtifact | null {
    return (
      this.artifacts.find(
        (a) =>
          a.runId === params.runId &&
          a.artifactType === params.artifactType &&
          (params.persona ? a.persona === params.persona : true) &&
          (params.playType ? a.playType === params.playType : true)
      ) ?? null
    );
  }

  listArtifacts(runId: string): DerivedArtifact[] {
    return this.artifacts.filter((a) => a.runId === runId);
  }

  listFocusEntities(): FocusEntity[] {
    return DEMO_FOCUS_ENTITIES;
  }
}
