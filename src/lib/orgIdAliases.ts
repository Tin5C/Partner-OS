// Canonical org-ID alias resolution for Partner Space
// Single source of truth: "helioworks" is canonical; "alpnova" is a legacy alias.

export const CANONICAL_HUB_ORG_ID = 'helioworks' as const;

const ORG_ID_ALIASES: Record<string, string[]> = {
  helioworks: ['helioworks', 'alpnova'],
  alpnova: ['alpnova', 'helioworks'],
};

/** Collapse any known alias to the canonical hub org ID */
export function canonicalizeOrgId(input?: string | null): string {
  if (!input) return CANONICAL_HUB_ORG_ID;
  if (input === 'alpnova') return 'helioworks';
  return input;
}

/** Return all candidate org IDs to try when querying org-scoped stores */
export function orgIdCandidates(input?: string | null): string[] {
  const orgId = input ?? CANONICAL_HUB_ORG_ID;
  return ORG_ID_ALIASES[orgId] ?? [orgId];
}
