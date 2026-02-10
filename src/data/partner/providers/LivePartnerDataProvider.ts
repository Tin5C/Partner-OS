// Live Partner Data Provider (Option B — future live generation)
// Returns empty/null but correct shapes

import type {
  DerivedArtifact,
  FocusEntity,
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
}
