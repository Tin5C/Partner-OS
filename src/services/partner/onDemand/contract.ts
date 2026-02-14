// OnDemand Briefings — canonical contract (v1)

import type { BriefingArtifactRecord } from '@/data/partner/briefingArtifactStore';
import type { BriefingSelection } from '@/data/partner/briefingSelectionStore';

export type OnDemandScope =
  | { type: 'vendor'; vendor_id: string }
  | { type: 'industry'; industry_id: string }
  | { type: 'account'; account_id: string }
  | { type: 'competitive_angle'; angle_id: string };

export interface OnDemandVM {
  scope: OnDemandScope;

  /** Existing artifacts matching the scope */
  artifacts: BriefingArtifactRecord[];

  /** User's current selections per briefing type */
  selections: BriefingSelection[];
}
