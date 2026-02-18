// Active Trends Store — in-memory per-account trend selection for Deal Planning
// Max 3 active trends per account. Mirrors activeSignalsStore pattern.
// When empty, scoring uses ALL trends (preserving current default behavior).

const MAX_ACTIVE = 3;

const store: Map<string, string[]> = new Map(); // focusId → trendIds

export function getActiveTrendIds(focusId: string): string[] {
  return store.get(focusId) ?? [];
}

export function setActiveTrendIds(focusId: string, ids: string[]): void {
  store.set(focusId, ids.slice(0, MAX_ACTIVE));
}

export function toggleTrend(focusId: string, id: string): boolean {
  const current = store.get(focusId) ?? [];
  if (current.includes(id)) {
    store.set(focusId, current.filter((x) => x !== id));
    return true;
  }
  if (current.length >= MAX_ACTIVE) return false;
  store.set(focusId, [...current, id]);
  return true;
}

export function clearActiveTrends(focusId: string): void {
  store.delete(focusId);
}

export const MAX_ACTIVE_TRENDS = MAX_ACTIVE;
