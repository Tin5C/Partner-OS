// DealPlanningSelection — Partner-only in-memory store for preselected type/motion per focusId

export interface DealPlanningSelection {
  type: string;
  motion: string;
}

const store: Map<string, DealPlanningSelection> = new Map();

export function getDealPlanningSelection(focusId: string): DealPlanningSelection | null {
  return store.get(focusId) ?? null;
}

export function setDealPlanningSelection(focusId: string, selection: DealPlanningSelection): void {
  store.set(focusId, selection);
}

export function clearDealPlanningSelection(focusId: string): void {
  store.delete(focusId);
}
