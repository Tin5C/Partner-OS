// QuickBrief store — links 5 signals for a focus+week

import { resolveWeekAlias } from './weeklySignalStore';

export interface QuickBrief {
  id: string;
  focusId: string;
  weekOf: string;
  weekKey?: string; // canonical ISO week (additive)
  signalIds: [string, string, string, string, string];
  contextUsed: string;
  createdAt: string;
}

const store: QuickBrief[] = [];

/**
 * Get a Quick Brief, preferring canonical weekKey lookup, falling back to legacy weekOf.
 */
export function getQuickBrief(focusId: string, weekOfOrKey: string): QuickBrief | null {
  // Try exact match on weekOf first (legacy)
  const byWeekOf = store.find((q) => q.focusId === focusId && q.weekOf === weekOfOrKey);
  if (byWeekOf) return byWeekOf;

  // Try exact match on weekKey (canonical)
  const byWeekKey = store.find((q) => q.focusId === focusId && q.weekKey === weekOfOrKey);
  if (byWeekKey) return byWeekKey;

  // Try resolving alias (weekKey→weekOf or weekOf→weekKey)
  const alias = resolveWeekAlias(weekOfOrKey);
  if (alias) {
    const byAlias = store.find(
      (q) => q.focusId === focusId && (q.weekOf === alias || q.weekKey === alias)
    );
    if (byAlias) return byAlias;
  }

  return null;
}

export function createQuickBrief(payload: Omit<QuickBrief, 'id' | 'createdAt'>): QuickBrief {
  const record: QuickBrief = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.push(record);
  return record;
}

// Seed
const SEED: Omit<QuickBrief, 'id' | 'createdAt'> = {
  focusId: 'schindler',
  weekOf: '2026-02-10',
  signalIds: [
    'sig-sch-azure-swiss',
    'sig-sch-eu-machinery',
    'sig-sch-copilot-field',
    'sig-sch-finops-ai',
    'sig-sch-ai-governance',
  ],
  contextUsed: 'last touchpoint + upcoming meeting (simulated)',
};

export function seedQuickBriefs(): void {
  if (!store.find((q) => q.focusId === SEED.focusId && q.weekOf === SEED.weekOf)) {
    createQuickBrief(SEED);
  }
}

seedQuickBriefs();
