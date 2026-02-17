// Deal Planning Signal Tags Store — in-memory, keyed by focusId
// Tracks signal tags promoted into the scoring engine for service pack recommendations.

const store: Map<string, string[]> = new Map();

export function getTags(focusId: string): string[] {
  return store.get(focusId) ?? [];
}

export function setTags(focusId: string, tags: string[]): void {
  store.set(focusId, [...new Set(tags)]);
}

export function addTags(focusId: string, tags: string[]): void {
  const existing = store.get(focusId) ?? [];
  const merged = [...new Set([...existing, ...tags])];
  store.set(focusId, merged);
}

export function clearTags(focusId: string): void {
  store.delete(focusId);
}
