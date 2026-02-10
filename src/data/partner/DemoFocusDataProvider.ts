// Demo Focus Data Provider (Option A — precomputed artifacts)
// Reads from demoDataset.ts and validates invariants

import type {
  HubOrg,
  Vendor,
  FocusEntity,
  ExtractionRun,
  DerivedArtifact,
  ArtifactType,
  PersonaType,
  QuickBriefV1,
  PackageRecsV1,
  StoryCardV1,
} from './contracts';
import type { FocusDataProvider } from './FocusDataProvider';
import {
  DEMO_HUB_ORG,
  DEMO_VENDORS,
  DEMO_FOCUS_ENTITIES,
  DEMO_EXTRACTION_RUN,
  DEMO_ARTIFACTS,
} from './demo/demoDataset';

// ============= Validation Helpers =============

function validateQuickBriefV1(content: QuickBriefV1, artifactId: string): void {
  if (content.whatChanged.length !== 3) {
    throw new Error(`[DemoValidation] ${artifactId}: whatChanged must have exactly 3 items, got ${content.whatChanged.length}`);
  }
  if (content.actions.length !== 3) {
    throw new Error(`[DemoValidation] ${artifactId}: actions must have exactly 3 items, got ${content.actions.length}`);
  }
  if (content.whatsMissing.length !== 3) {
    throw new Error(`[DemoValidation] ${artifactId}: whatsMissing must have exactly 3 items, got ${content.whatsMissing.length}`);
  }
}

function validatePackageRecs(content: PackageRecsV1, artifactId: string): void {
  const count = content.recommendations.length;
  if (count < 1 || count > 3) {
    throw new Error(`[DemoValidation] ${artifactId}: packageRecs must recommend 1–3 packages, got ${count}`);
  }
}

// ============= Demo Provider =============

export class DemoFocusDataProvider implements FocusDataProvider {
  private artifacts: DerivedArtifact[];
  private run: ExtractionRun;

  constructor() {
    this.run = DEMO_EXTRACTION_RUN;
    this.artifacts = DEMO_ARTIFACTS;

    // Run validation on construction (demo safety)
    this.validate();
  }

  private validate(): void {
    for (const artifact of this.artifacts) {
      if (artifact.artifactType === 'quickBrief') {
        validateQuickBriefV1(artifact.content as QuickBriefV1, artifact.artifactId);
      }
      if (artifact.artifactType === 'packageRecs') {
        validatePackageRecs(artifact.content as PackageRecsV1, artifact.artifactId);
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
  }): DerivedArtifact<StoryCardV1[]> | null {
    const art = this.artifacts.find(
      (a) => a.runId === params.runId && a.artifactType === 'storyCards'
    );
    return (art as DerivedArtifact<StoryCardV1[]>) ?? null;
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
