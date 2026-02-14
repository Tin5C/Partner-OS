// PartnerProfile — canonical contract (v1)
// Capabilities, service packs, vendor posture.

import type { CapabilityLevel } from '@/data/partner/servicePackScoringConfig';
import type { PartnerServicePack } from '@/data/partner/partnerServiceConfiguration';
import type { PartnerProfile } from '@/data/partner/partnerProfileStore';

export interface PartnerProfileVM {
  hub_org_id: string;
  vendor_posture: string;
  partner_capabilities: Record<string, CapabilityLevel>;
  service_packs: PartnerServicePack[];
  profile: PartnerProfile | null;
}
