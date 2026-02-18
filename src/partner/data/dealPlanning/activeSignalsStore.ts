// Active Signals Store — in-memory per-account active signal selection for Deal Planning
// Max 3 active signals per account. Used by propensity engine for scoring.

const MAX_ACTIVE = 3;

const store: Map<string, string[]> = new Map(); // focusId → signalIds

export function getActiveSignalIds(focusId: string): string[] {
  return store.get(focusId) ?? [];
}

export function addActiveSignal(focusId: string, signalId: string): boolean {
  const current = store.get(focusId) ?? [];
  if (current.includes(signalId)) return true;
  if (current.length >= MAX_ACTIVE) return false; // caller must use replaceActiveSignal
  store.set(focusId, [...current, signalId]);
  return true;
}

export function removeActiveSignal(focusId: string, signalId: string): void {
  const current = store.get(focusId) ?? [];
  store.set(focusId, current.filter((id) => id !== signalId));
}

export function replaceActiveSignal(focusId: string, oldId: string, newId: string): void {
  const current = store.get(focusId) ?? [];
  store.set(focusId, current.map((id) => (id === oldId ? newId : id)));
}

export function clearActiveSignals(focusId: string): void {
  store.delete(focusId);
}

export function isAtMax(focusId: string): boolean {
  return (store.get(focusId) ?? []).length >= MAX_ACTIVE;
}

export const MAX_ACTIVE_SIGNALS = MAX_ACTIVE;
