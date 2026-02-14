// Briefing (Quick Brief) — canonical contract (v1)

import type { Signal } from '@/data/partner/signalStore';
import type { QuickBrief } from '@/data/partner/quickBriefStore';

export interface QuickBriefVM {
  account_id: string;
  weekOf: string;

  /** The quick brief record (if exists) */
  brief: QuickBrief | null;

  /** Resolved signals for the brief */
  signals: Signal[];

  /** All signals for the focus+week (superset) */
  allSignals: Signal[];
}
