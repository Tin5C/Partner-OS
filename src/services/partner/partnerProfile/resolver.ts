// PartnerProfile Resolver — single source for partner capabilities + packs
// Service pack recommendations MUST read from this resolver only.

import type { PartnerProfileVM } from './contract';
import { partner_service_configuration } from '@/data/partner/partnerServiceConfiguration';
import { listPartnerProfiles } from '@/data/partner/partnerProfileStore';

export function resolvePartnerProfile(hub_org_id?: string): PartnerProfileVM {
  const config = partner_service_configuration;
  const orgId = hub_org_id ?? config.hub_org_id;

  const profiles = listPartnerProfiles(orgId);

  return {
    hub_org_id: orgId,
    vendor_posture: config.vendor_posture,
    partner_capabilities: config.partner_capabilities,
    service_packs: config.service_packs,
    profile: profiles[0] ?? null,
  };
}
