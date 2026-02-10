// Live Partner Data Provider (Option B — future live generation)
// Returns empty/null but correct shapes

import type {
  DerivedArtifact,
  FocusEntity,
  FocusTouchpointContext,
  MicrocastV1,
  MicrocastType,
} from '../contracts';
import type { PartnerDataProvider, ActiveContext } from '../PartnerDataProvider';

export class LivePartnerDataProvider implements PartnerDataProvider {
  getActiveContext(): ActiveContext | null {
    return null;
  }

  getArtifact(): DerivedArtifact | null {
    return null;
  }

  listArtifacts(): DerivedArtifact[] {
    return [];
  }

  listFocusEntities(): FocusEntity[] {
    return [];
  }

  getMicrocastByType(): DerivedArtifact<MicrocastV1> | null {
    return null;
  }

  getMicrocastById(): DerivedArtifact<MicrocastV1> | null {
    return null;
  }
}
