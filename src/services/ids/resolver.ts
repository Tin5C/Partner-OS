// IDs Resolver — read-only canonical meta resolution

import type { CanonicalMeta, CanonicalMetaInput } from './contract';
import {
  canonicalHubOrgId,
  canonicalFocusId,
  canonicalVendorId,
  toIsoWeekKey,
} from '@/lib/partnerIds';

/** Resolve canonical meta from any combination of known ID fields. Read-only. */
export function resolveCanonicalMeta(input: Partial<CanonicalMetaInput>): CanonicalMeta {
  return {
    hubOrgId: canonicalHubOrgId(input.hubOrgId ?? input.hub_org_id),
    focusId: canonicalFocusId(input.focusId ?? input.account_id),
    vendorId: canonicalVendorId(input.vendor_id ?? input.primaryVendorId),
    weekKey: toIsoWeekKey({
      weekKey: input.weekKey,
      timeKey: input.timeKey,
      weekOf: input.weekOf,
      week_of: input.week_of,
    }),
  };
}
