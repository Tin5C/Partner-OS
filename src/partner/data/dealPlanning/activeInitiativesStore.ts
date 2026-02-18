// Active Initiatives Store — in-memory per-account initiative selection for Deal Planning
// Max 3 active initiatives per account. Mirrors activeSignalsStore pattern.
// When empty, scoring uses ALL initiatives (preserving current default behavior).

const MAX_ACTIVE = 3;

const store: Map<string, string[]> = new Map(); // focusId → initiativeIds

export function getActiveInitiativeIds(focusId: string): string[] {
  return store.get(focusId) ?? [];
}

export function setActiveInitiativeIds(focusId: string, ids: string[]): void {
  store.set(focusId, ids.slice(0, MAX_ACTIVE));
}

export function toggleInitiative(focusId: string, id: string): boolean {
  const current = store.get(focusId) ?? [];
  if (current.includes(id)) {
    store.set(focusId, current.filter((x) => x !== id));
    return true;
  }
  if (current.length >= MAX_ACTIVE) return false;
  store.set(focusId, [...current, id]);
  return true;
}

export function clearActiveInitiatives(focusId: string): void {
  store.delete(focusId);
}

export const MAX_ACTIVE_INITIATIVES = MAX_ACTIVE;
