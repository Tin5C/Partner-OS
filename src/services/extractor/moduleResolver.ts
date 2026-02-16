// Safe Module Alias Resolver
// Allows future module renaming without breaking reads.
// Usage: getModulePack(run, ['module2', 'public_it_initiatives'])

import type { ExtractionRun } from '@/data/partner/contracts';

/**
 * Resolve a module pack from an ExtractionRun by trying multiple possible keys.
 * Checks run.modulePacks[key] for each candidate, returning the first match.
 */
export function getModulePack<T = Record<string, unknown>>(
  run: ExtractionRun | null | undefined,
  possibleKeys: string[]
): T | null {
  if (!run?.modulePacks) return null;

  const packs = run.modulePacks as unknown as Record<string, unknown>;

  for (const key of possibleKeys) {
    if (packs[key] != null) return packs[key] as T;
  }

  return null;
}
