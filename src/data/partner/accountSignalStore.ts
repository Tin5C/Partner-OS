// AccountSignals — extractor-derived intelligence per account per week
// Additive only; no changes to existing collections.

export type SignalConfidence = 'Low' | 'Medium' | 'High';

export interface AccountSignal {
  id: string;
  org_id: string;
  account_id: string;
  week_of: string; // YYYY-MM-DD
  depth: 1 | 2 | 3;
  headline: string;
  source_notes?: string;
  what_changed: string;
  execution_surface: string[];
  vendor: string;
  vendor_offer_clusters: string[];
  vendor_value_props: string[];
  partner_motion: string[];
  proof_artifacts_needed: string[];
  buyer_roles: string[];
  why_it_converts: string;
  gaps: string[];
  confidence: SignalConfidence;
}

// ============= In-memory store =============

const store: AccountSignal[] = [];

// ============= CRUD =============

export function createAccountSignal(
  payload: Omit<AccountSignal, 'id'> & { id?: string },
): AccountSignal {
  const record: AccountSignal = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
  };
  store.push(record);
  return record;
}

export function listAccountSignals(
  org_id: string,
  filters?: { account_id?: string; week_of?: string },
): AccountSignal[] {
  return store.filter((s) => {
    if (s.org_id !== org_id) return false;
    if (filters?.account_id && s.account_id !== filters.account_id) return false;
    if (filters?.week_of && s.week_of !== filters.week_of) return false;
    return true;
  });
}

export function getAccountSignal(id: string): AccountSignal | null {
  return store.find((s) => s.id === id) ?? null;
}

// ============= Seed =============

const SEEDS: Array<Omit<AccountSignal, 'id'> & { id: string }> = [
  {
    id: 'as-seed-schindler-01',
    org_id: 'alpnova',
    account_id: 'schindler',
    week_of: '2025-06-02',
    depth: 2,
    headline: 'Schindler evaluating predictive-maintenance AI on Azure',
    source_notes: 'IR + internal engagement',
    what_changed: 'Q3 pilot budget confirmed for predictive-maintenance AI; new CISO prioritising data-residency.',
    execution_surface: ['Azure AI', 'IoT Hub', 'Azure Swiss Regions'],
    vendor: 'Microsoft',
    vendor_offer_clusters: ['Azure AI', 'Azure IoT'],
    vendor_value_props: ['Swiss data residency', 'Predictive maintenance accelerator'],
    partner_motion: ['Architecture workshop', 'ROI model delivery'],
    proof_artifacts_needed: ['Data residency confirmation', 'Architecture diagram', 'ROI model'],
    buyer_roles: ['CTO', 'CISO', 'VP Engineering'],
    why_it_converts: 'Budget confirmed and compliance pressure creates urgency for a Swiss-hosted partner.',
    gaps: ['No existing IoT practice', 'Limited predictive-maintenance references'],
    confidence: 'High',
  },
];

export function seedAccountSignals(): void {
  for (const seed of SEEDS) {
    if (!store.find((s) => s.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedAccountSignals();
