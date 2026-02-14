// AccountIntelligence — canonical contract (v1)
// Single source of truth for all account-scoped context.

import type { AccountMemoryItem, EvidencePillar } from '@/data/partner/accountMemoryStore';
import type { AccountSignal } from '@/data/partner/accountSignalStore';
import type { Objection } from '@/data/partner/objectionStore';
import type { ContentRequest } from '@/data/partner/contentRequestStore';
import type { ExtractorRun } from '@/data/partner/extractorRunStore';
import type { CuratedWeeklySignal } from '@/data/partner/weeklySignalStore';

export interface AccountIntelligenceVM {
  account_id: string;

  /** Evidence items (files, notes, links) */
  evidenceItems: AccountMemoryItem[];

  /** Readiness score (0–100) and per-pillar status */
  readiness: {
    score: number;
    pillars: Record<EvidencePillar, boolean>;
  };

  /** Structured account signals (extractor-derived) */
  accountSignals: AccountSignal[];

  /** Objection intelligence */
  objections: Objection[];

  /** Teammate content requests */
  contentRequests: ContentRequest[];

  /** Extractor runs (raw pipeline outputs) */
  extractorRuns: ExtractorRun[];

  /** Curated weekly signals for a given time window */
  weeklySignals: CuratedWeeklySignal[];
}
