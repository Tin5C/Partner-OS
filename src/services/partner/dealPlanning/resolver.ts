// DealPlanning Resolver — reads account context via AccountIntelligence,
// partner profile via PartnerProfile, and computes service pack recommendations.

import type { DealPlanningVM } from './contract';
import type { EngagementMode } from '@/components/partner/DealPlanMetadata';
import { resolveAccountIntelligence } from '../accountIntelligence/resolver';
import { resolvePartnerProfile } from '../partnerProfile/resolver';
import { getDealPlan, listDealPlans } from '@/data/partner/dealPlanStore';
import { scoreServicePacks } from '@/data/partner/servicePackStore';

export function resolveDealPlanning(
  account_id: string,
  options?: {
    mode?: EngagementMode | null;
    trigger?: string | null;
    weekOf?: string;
    hub_org_id?: string;
    hasPromotedSignals?: boolean;
  },
): DealPlanningVM {
  const mode = options?.mode ?? null;
  const trigger = options?.trigger ?? null;
  const weekOf = options?.weekOf ?? '2026-02-10';

  const accountIntelligence = resolveAccountIntelligence(account_id, {
    hasPromotedSignals: options?.hasPromotedSignals ?? false,
  });

  const partnerProfile = resolvePartnerProfile(options?.hub_org_id);

  const recommendedPacks = scoreServicePacks({
    mode,
    trigger,
    vendorPosture: partnerProfile.vendor_posture,
    partnerCapabilities: partnerProfile.partner_capabilities,
  });

  return {
    account_id,
    mode,
    trigger,
    currentPlan: getDealPlan(account_id, weekOf),
    allPlans: listDealPlans(account_id),
    recommendedPacks,
    readiness: accountIntelligence.readiness,
    partnerProfile,
    accountIntelligence,
  };
}
