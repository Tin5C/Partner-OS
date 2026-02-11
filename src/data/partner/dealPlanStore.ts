// DealPlan store — snapshot-based promotion from Quick Brief
// Idempotent: merge signals into existing plan for (focusId, weekOf)

import type { Signal } from './signalStore';

export interface PromotedSignal {
  signalId: string;
  snapshot: Omit<Signal, 'id' | 'focusId' | 'weekOf' | 'createdAt'>;
  promotedAt: string;
}

export interface DealPlan {
  id: string;
  focusId: string;
  weekOf: string;
  promotedSignals: PromotedSignal[];
  status: 'draft';
  createdAt: string;
  updatedAt: string;
}

const store: DealPlan[] = [];

export function getDealPlan(focusId: string, weekOf: string): DealPlan | null {
  return store.find((d) => d.focusId === focusId && d.weekOf === weekOf) ?? null;
}

export function listDealPlans(focusId: string): DealPlan[] {
  return store.filter((d) => d.focusId === focusId);
}

/**
 * Idempotent promote: find-or-create DealPlan for (focusId, weekOf),
 * then append new signals (skip duplicates). Returns count of newly added.
 */
export function promoteSignalsToDealPlan(
  focusId: string,
  weekOf: string,
  signals: Signal[],
): { dealPlan: DealPlan; addedCount: number } {
  let plan = getDealPlan(focusId, weekOf);
  const now = new Date().toISOString();

  if (!plan) {
    plan = {
      id: crypto.randomUUID(),
      focusId,
      weekOf,
      promotedSignals: [],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    store.push(plan);
  }

  let addedCount = 0;
  for (const sig of signals) {
    if (plan.promotedSignals.some((p) => p.signalId === sig.id)) continue;
    const { id: _id, focusId: _f, weekOf: _w, createdAt: _c, ...snapshot } = sig;
    plan.promotedSignals.push({ signalId: sig.id, snapshot, promotedAt: now });
    addedCount++;
  }

  plan.updatedAt = now;
  return { dealPlan: plan, addedCount };
}

/**
 * Remove a promoted signal from a DealPlan. Returns true if found & removed.
 */
export function removePromotedSignal(focusId: string, weekOf: string, signalId: string): boolean {
  const plan = getDealPlan(focusId, weekOf);
  if (!plan) return false;
  const idx = plan.promotedSignals.findIndex((p) => p.signalId === signalId);
  if (idx === -1) return false;
  plan.promotedSignals.splice(idx, 1);
  plan.updatedAt = new Date().toISOString();
  return true;
}
