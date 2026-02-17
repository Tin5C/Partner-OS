// Deal Planning Inbox Store — in-memory, keyed by focusId
// Allows pushing signals/trends/initiatives into Deal Planning as structured inbox items.

export type InboxSourceType = 'signal' | 'trend' | 'initiative';
export type ImpactArea = 'Security' | 'Data' | 'Ops' | 'Finance' | 'Compliance' | 'Other';

export interface DealPlanningInboxItem {
  id: string;
  focusId: string;
  source_type: InboxSourceType;
  source_id: string;
  title: string;
  why_now: string;
  impact_area: ImpactArea;
  tags: string[];
  created_at: string;
}

export interface DealPlanningInbox {
  focusId: string;
  items: DealPlanningInboxItem[];
}

// ============= In-memory store =============

const store: Map<string, DealPlanningInboxItem[]> = new Map();

export function listByFocusId(focusId: string): DealPlanningInboxItem[] {
  return store.get(focusId) ?? [];
}

/** Idempotent add by source_id */
export function addItem(focusId: string, item: DealPlanningInboxItem): void {
  let items = store.get(focusId);
  if (!items) {
    items = [];
    store.set(focusId, items);
  }
  if (items.some((i) => i.source_id === item.source_id)) return;
  items.push(item);
}

export function removeItem(focusId: string, itemId: string): void {
  const items = store.get(focusId);
  if (!items) return;
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx !== -1) items.splice(idx, 1);
}

export function clearByFocusId(focusId: string): void {
  store.delete(focusId);
}

// ============= Helper: derive impact area from category/type =============

export function deriveImpactArea(category: string): ImpactArea {
  const c = category.toLowerCase();
  if (c.includes('regulat') || c.includes('compliance')) return 'Compliance';
  if (c.includes('security') || c.includes('cyber') || c.includes('identity')) return 'Security';
  if (c.includes('finops') || c.includes('cost') || c.includes('finance')) return 'Finance';
  if (c.includes('field') || c.includes('operations') || c.includes('ops')) return 'Ops';
  if (c.includes('data') || c.includes('platform') || c.includes('residency')) return 'Data';
  return 'Other';
}

/** Build a deterministic inbox item ID */
export function makeInboxItemId(focusId: string, sourceType: InboxSourceType, sourceId: string): string {
  return `dpi_${focusId}_${sourceType}_${sourceId}`;
}
