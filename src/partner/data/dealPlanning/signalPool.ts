// Signal Pool Builder — 3-source union for Deal Planning signal picker
// Sources: 1) Extractor (signalStore), 2) Quick Brief (quickBriefStore), 3) History (accountSignalStore)
// Deduplicates by ID, assigns origin chips, ranks Extractor first.

import { listSignals, type Signal } from '@/data/partner/signalStore';
import { getQuickBrief } from '@/data/partner/quickBriefStore';
import { listAccountSignals, type AccountSignal } from '@/data/partner/accountSignalStore';

export type SignalOrigin = 'Extractor' | 'Quick Brief' | 'History';

export interface PooledSignal {
  id: string;
  title: string;
  type: string;
  origins: SignalOrigin[];
  weekOf?: string;
  confidence?: number;
  soWhat?: string;
  createdAt?: string;
}

/**
 * Build a union pool from 3 sources for a given account, deduplicating by ID.
 */
export function buildSignalPool(
  focusId: string,
  weekOf: string,
): PooledSignal[] {
  const pool = new Map<string, PooledSignal>();

  // 1) Extractor — signals from signalStore for this account (all weeks, current week first)
  const allSignals = listSignals(focusId);
  const weekSignals = allSignals.filter((s) => s.weekOf === weekOf);
  const otherSignals = allSignals.filter((s) => s.weekOf !== weekOf);
  const orderedSignals = [...weekSignals, ...otherSignals];

  for (const s of orderedSignals) {
    pool.set(s.id, {
      id: s.id,
      title: s.title,
      type: s.type,
      origins: ['Extractor'],
      weekOf: s.weekOf,
      confidence: s.confidence,
      soWhat: s.soWhat,
      createdAt: s.createdAt,
    });
  }

  // 2) Quick Brief — mark signals that appear in this week's Quick Brief
  const qb = getQuickBrief(focusId, weekOf);
  if (qb) {
    for (const sigId of qb.signalIds) {
      const existing = pool.get(sigId);
      if (existing) {
        if (!existing.origins.includes('Quick Brief')) {
          existing.origins.push('Quick Brief');
        }
      } else {
        // Signal referenced by QB but not in signalStore — try to find it
        const sig = allSignals.find((s) => s.id === sigId);
        if (sig) {
          pool.set(sig.id, {
            id: sig.id,
            title: sig.title,
            type: sig.type,
            origins: ['Quick Brief'],
            weekOf: sig.weekOf,
            confidence: sig.confidence,
            soWhat: sig.soWhat,
            createdAt: sig.createdAt,
          });
        }
      }
    }
  }

  // 3) History — accountSignalStore (different schema, map to PooledSignal)
  const historySignals = listAccountSignals('alpnova', { account_id: focusId });
  for (const h of historySignals) {
    const existing = pool.get(h.id);
    if (existing) {
      if (!existing.origins.includes('History')) {
        existing.origins.push('History');
      }
    } else {
      pool.set(h.id, {
        id: h.id,
        title: h.headline,
        type: 'history',
        origins: ['History'],
        weekOf: h.week_of,
        confidence: h.confidence === 'High' ? 80 : h.confidence === 'Medium' ? 50 : 30,
        soWhat: h.why_it_converts,
        createdAt: h.week_of,
      });
    }
  }

  // Sort: Extractor-origin first, then current week, then recency
  const result = Array.from(pool.values());
  result.sort((a, b) => {
    const aExt = a.origins.includes('Extractor') ? 0 : 1;
    const bExt = b.origins.includes('Extractor') ? 0 : 1;
    if (aExt !== bExt) return aExt - bExt;

    const aCurrentWeek = a.weekOf === weekOf ? 0 : 1;
    const bCurrentWeek = b.weekOf === weekOf ? 0 : 1;
    if (aCurrentWeek !== bCurrentWeek) return aCurrentWeek - bCurrentWeek;

    // Recency
    const aDate = a.createdAt ?? '';
    const bDate = b.createdAt ?? '';
    return bDate.localeCompare(aDate);
  });

  return result;
}

/**
 * Split pool into sections by origin for display
 */
export function splitPoolBySections(pool: PooledSignal[], weekOf: string) {
  const extractor = pool.filter((p) => p.origins.includes('Extractor') && p.weekOf === weekOf);
  const quickBrief = pool.filter((p) => p.origins.includes('Quick Brief') && !extractor.some((e) => e.id === p.id));
  const history = pool.filter((p) => p.origins.includes('History') && !extractor.some((e) => e.id === p.id) && !quickBrief.some((q) => q.id === p.id));
  return { extractor, quickBrief, history };
}
