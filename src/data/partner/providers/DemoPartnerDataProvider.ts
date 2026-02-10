// Demo Partner Data Provider (Option A — precomputed artifacts)

import type {
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  PlayType,
  FocusEntity,
  FocusTouchpointContext,
  QuickBriefV1,
  StoryCardsV1,
  DealBriefV1,
  PlayV1,
  MicrocastV1,
  MicrocastType,
} from '../contracts';
import type { PartnerDataProvider, ActiveContext } from '../PartnerDataProvider';
import {
  assertQuickBriefV1,
  assertStoryCardsV1,
  assertDealBriefV1,
  assertPlayV1,
  assertMicrocastV1,
} from '../validation';
import {
  DEMO_CONTEXT,
  DEMO_ARTIFACTS,
  DEMO_FOCUS_ENTITIES,
} from '../demo/demoDataset';

export class DemoPartnerDataProvider implements PartnerDataProvider {
  private artifacts: DerivedArtifact[];
  private context: ActiveContext;

  constructor() {
    this.context = DEMO_CONTEXT;
    this.artifacts = DEMO_ARTIFACTS;
    this.validate();
  }

  private validate(): void {
    for (const a of this.artifacts) {
      if (a.artifactType === 'quickBrief') assertQuickBriefV1(a.content as QuickBriefV1);
      if (a.artifactType === 'storyCards') assertStoryCardsV1(a.content as StoryCardsV1);
      if (a.artifactType === 'dealBrief') assertDealBriefV1(a.content as DealBriefV1);
      if (a.artifactType === 'play') assertPlayV1(a.content as PlayV1);
      if (a.artifactType === 'microcast') assertMicrocastV1(a.content as MicrocastV1);
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

  getMicrocastByType(focusId: string, microcastType: MicrocastType): DerivedArtifact<MicrocastV1> | null {
    return (this.artifacts.find(
      (a) => a.artifactType === 'microcast' && a.focusId === focusId && (a.content as MicrocastV1).microcastType === microcastType
    ) as DerivedArtifact<MicrocastV1> | undefined) ?? null;
  }

  getMicrocastById(id: string): DerivedArtifact<MicrocastV1> | null {
    return (this.artifacts.find(
      (a) => a.artifactType === 'microcast' && (a.content as MicrocastV1).id === id
    ) as DerivedArtifact<MicrocastV1> | undefined) ?? null;
  }
}
