// DealPlanSelection — links Quick Brief signals to Deal Planning
// Only stores references + included sections, never copies content.

export type DealPlanSectionKey =
  | 'talkTrack'
  | 'confidence'
  | 'whatsMissing'
  | 'proofToRequest'
  | 'recommendedBriefings'
  | 'sources';

export const ALL_SECTION_KEYS: DealPlanSectionKey[] = [
  'talkTrack',
  'whatsMissing',
  'proofToRequest',
  'recommendedBriefings',
  'sources',
];

export const SECTION_LABELS: Record<DealPlanSectionKey, string> = {
  talkTrack: 'Talk track',
  confidence: 'Confidence',
  whatsMissing: 'Missing',
  proofToRequest: 'Proof',
  recommendedBriefings: 'Briefings',
  sources: 'Sources',
};

export interface DealPlanSelection {
  id: string;
  accountId: string;
  userId?: string;
  createdAt: string; // ISO
  signalId: string;
  includedSections: DealPlanSectionKey[];
  note?: string;
}

// ============= In-memory store =============

const store: DealPlanSelection[] = [];

// ============= CRUD =============

export function listDealPlanSelections(accountId: string): DealPlanSelection[] {
  return store.filter((s) => s.accountId === accountId);
}

export function getDealPlanSelection(id: string): DealPlanSelection | null {
  return store.find((s) => s.id === id) ?? null;
}

export interface PromoteSelection {
  signalId: string;
  includedSections: DealPlanSectionKey[];
  note?: string;
}

/**
 * Upsert DealPlanSelection rows by (accountId, signalId).
 * Replace includedSections on conflict. Does NOT copy signal content.
 */
export function promoteSignalsToDealPlan(
  accountId: string,
  selections: PromoteSelection[],
): DealPlanSelection[] {
  const results: DealPlanSelection[] = [];

  for (const sel of selections) {
    const existing = store.find(
      (s) => s.accountId === accountId && s.signalId === sel.signalId,
    );

    if (existing) {
      existing.includedSections = sel.includedSections;
      existing.note = sel.note;
      results.push(existing);
    } else {
      const record: DealPlanSelection = {
        id: crypto.randomUUID(),
        accountId,
        createdAt: new Date().toISOString(),
        signalId: sel.signalId,
        includedSections: sel.includedSections,
        note: sel.note,
      };
      store.push(record);
      results.push(record);
    }
  }

  return results;
}
