// ExtractorRun Store (Partner Space only)
// Stores raw extractor outputs keyed by spaceId + customerId + timeKey.
// On save, parses Module 1 signals and materializes WeeklySignal items.

import { materializeWeeklySignals } from './weeklySignalStore';
import { canonicalHubOrgId, canonicalFocusId, canonicalVendorId, toIsoWeekKey } from '@/lib/partnerIds';

export interface ExtractorRunMeta {
  hubOrgId: string;
  focusId: string;
  vendorId: string;
  weekKey: string; // canonical ISO week YYYY-Www
}

export interface ExtractorRun {
  id: string;
  spaceId: 'partner';
  customerId: string;
  timeKey: string; // ISO week, e.g. "2026-W07"
  weekOfDate?: string; // optional ISO date
  rawText: string;
  createdAt: string;
  meta?: ExtractorRunMeta;
  // Prompt lineage (Phase 1 — optional, additive)
  promptId?: string;
  promptVersion?: string;
}

// ============= In-memory store =============

const store: ExtractorRun[] = [];
let nextId = 1;

// ============= Helpers =============

/** Convert a Date to ISO week key (e.g. "2026-W07") */
export function toTimeKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/** Get current ISO week key */
export function currentTimeKey(): string {
  return toTimeKey(new Date());
}

// ============= CRUD =============

export function saveExtractorRun(params: {
  customerId: string;
  timeKey?: string;
  weekOfDate?: string;
  rawText: string;
  hubOrgId?: string;
  vendorId?: string;
}): ExtractorRun {
  const timeKey = params.timeKey ?? currentTimeKey();
  const run: ExtractorRun = {
    id: `extr-${nextId++}`,
    spaceId: 'partner',
    customerId: params.customerId,
    timeKey,
    weekOfDate: params.weekOfDate,
    rawText: params.rawText,
    createdAt: new Date().toISOString(),
    meta: {
      hubOrgId: canonicalHubOrgId(params.hubOrgId),
      focusId: canonicalFocusId(params.customerId),
      vendorId: canonicalVendorId(params.vendorId),
      weekKey: toIsoWeekKey({ timeKey, weekOf: params.weekOfDate }),
    },
  };
  store.push(run);

  // Parse & materialize weekly signals from this run
  materializeWeeklySignals(run);

  return run;
}

export function listExtractorRuns(customerId: string, timeKey?: string): ExtractorRun[] {
  return store.filter((r) => {
    if (r.customerId !== customerId) return false;
    if (timeKey && r.timeKey !== timeKey) return false;
    return true;
  });
}

export function getExtractorRun(id: string): ExtractorRun | null {
  return store.find((r) => r.id === id) ?? null;
}
