// PartnerProfile Resolver — single source for partner capabilities + packs
// Service pack recommendations MUST read from this resolver only.

import type { PartnerProfileVM } from './contract';
import { partner_service_configuration } from '@/data/partner/partnerServiceConfiguration';
import { listPartnerProfiles } from '@/data/partner/partnerProfileStore';
import { orgIdCandidates, canonicalizeOrgId } from '@/lib/orgIdAliases';

export function resolvePartnerProfile(hub_org_id?: string): PartnerProfileVM {
  const config = partner_service_configuration;
  const canonical = canonicalizeOrgId(hub_org_id ?? config.hub_org_id);

  // Try all alias candidates until a profile is found
  let profile = null;
  for (const id of orgIdCandidates(canonical)) {
    const candidates = listPartnerProfiles(id);
    if (candidates.length) {
      profile = candidates[0];
      break;
    }
  }

  return {
    hub_org_id: canonical,
    vendor_posture: config.vendor_posture,
    partner_capabilities: config.partner_capabilities,
    service_packs: config.service_packs,
    profile,
  };
}
