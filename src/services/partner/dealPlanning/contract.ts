// DealPlanning — canonical contract (v1)
// Keep existing Deal Plan output structure unchanged.

import type { DealPlan } from '@/data/partner/dealPlanStore';
import type { ScoredPack } from '@/data/partner/servicePackStore';
import type { AccountIntelligenceVM } from '../accountIntelligence/contract';
import type { PartnerProfileVM } from '../partnerProfile/contract';

export interface DealPlanningVM {
  account_id: string;
  mode: string | null;
  trigger: string | null;

  /** Current deal plan (if exists) */
  currentPlan: DealPlan | null;
  allPlans: DealPlan[];

  /** Recommended service packs (computed via scoring engine) */
  recommendedPacks: ScoredPack[];

  /** Readiness score + pillars from account intelligence */
  readiness: AccountIntelligenceVM['readiness'];

  /** Partner profile context (read-only) */
  partnerProfile: PartnerProfileVM;

  /** Account intelligence context (read-only) */
  accountIntelligence: AccountIntelligenceVM;
}
