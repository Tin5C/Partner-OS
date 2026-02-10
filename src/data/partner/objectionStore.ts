// Objections — canonical objection intelligence per account
// Additive only; no changes to existing collections.

export type ObjectionConfidence = 'Low' | 'Medium' | 'High';

export interface Objection {
  id: string;
  org_id: string;
  account_id: string;
  theme: string;
  trigger_signals: string[];
  root_cause: string;
  what_they_need_to_see: string[];
  confidence: ObjectionConfidence;
}

// ============= In-memory store =============

const store: Objection[] = [];

// ============= CRUD =============

export function createObjection(
  payload: Omit<Objection, 'id'> & { id?: string },
): Objection {
  const record: Objection = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
  };
  store.push(record);
  return record;
}

export function listObjections(
  org_id: string,
  filters?: { account_id?: string },
): Objection[] {
  return store.filter((o) => {
    if (o.org_id !== org_id) return false;
    if (filters?.account_id && o.account_id !== filters.account_id) return false;
    return true;
  });
}

export function getObjection(id: string): Objection | null {
  return store.find((o) => o.id === id) ?? null;
}

// ============= Seed =============

const SEEDS: Array<Omit<Objection, 'id'> & { id: string }> = [
  {
    id: 'obj-seed-schindler-residency',
    org_id: 'alpnova',
    account_id: 'schindler',
    theme: 'Data Residency',
    trigger_signals: ['New CISO hire', 'FINMA regulatory tightening'],
    root_cause: 'Swiss regulation requires data to remain within national borders for critical infrastructure.',
    what_they_need_to_see: [
      'Azure Switzerland region certification',
      'Data residency architecture diagram',
      'Reference from a similar Swiss industrial customer',
    ],
    confidence: 'High',
  },
];

export function seedObjections(): void {
  for (const seed of SEEDS) {
    if (!store.find((o) => o.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedObjections();
