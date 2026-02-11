// QuickBrief store — links 5 signals for a focus+week

export interface QuickBrief {
  id: string;
  focusId: string;
  weekOf: string;
  signalIds: [string, string, string, string, string];
  contextUsed: string;
  createdAt: string;
}

const store: QuickBrief[] = [];

export function getQuickBrief(focusId: string, weekOf: string): QuickBrief | null {
  return store.find((q) => q.focusId === focusId && q.weekOf === weekOf) ?? null;
}

export function createQuickBrief(payload: Omit<QuickBrief, 'id' | 'createdAt'>): QuickBrief {
  const record: QuickBrief = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.push(record);
  return record;
}

// Seed
const SEED: Omit<QuickBrief, 'id' | 'createdAt'> = {
  focusId: 'schindler',
  weekOf: '2026-02-10',
  signalIds: [
    'sig-sch-azure-swiss',
    'sig-sch-eu-machinery',
    'sig-sch-copilot-field',
    'sig-sch-finops-ai',
    'sig-sch-ai-governance',
  ],
  contextUsed: 'last touchpoint + upcoming meeting (simulated)',
};

export function seedQuickBriefs(): void {
  if (!store.find((q) => q.focusId === SEED.focusId && q.weekOf === SEED.weekOf)) {
    createQuickBrief(SEED);
  }
}

seedQuickBriefs();
