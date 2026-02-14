// AccountSnapshot — curated commercial/strategic profile per account
// In-memory singleton. Additive only.

export interface AccountSnapshot {
  focusId: string;
  hubOrgId: string;
  industry?: string;
  region?: string;
  revenue_band?: string;
  employee_band?: string;
  strategic_priority_tags?: string[];
  transformation_stage?: string;
  maturity_level?: string;
  primary_vendor_relationship?: string;
  competitive_pressure_level?: string;
}

const store: AccountSnapshot[] = [];

export function getByFocusId(focusId: string): AccountSnapshot | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(snapshot: AccountSnapshot): AccountSnapshot {
  const idx = store.findIndex((s) => s.focusId === snapshot.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...snapshot };
    return store[idx];
  }
  store.push(snapshot);
  return snapshot;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByFocusId('schindler')) return;
  upsert({
    focusId: 'schindler',
    hubOrgId: 'helioworks',
    industry: 'Industrial Manufacturing — Elevator & Escalator OEM',
    region: 'DACH / Global',
    revenue_band: 'CHF 10–15B',
    employee_band: '60,000–70,000',
    strategic_priority_tags: ['Predictive Maintenance', 'Digital Twins', 'Field Service AI', 'Data Residency'],
    transformation_stage: 'Scaling AI pilots → production',
    maturity_level: 'Advanced (selective AI adoption)',
    primary_vendor_relationship: 'Microsoft (Azure, M365, Dynamics)',
    competitive_pressure_level: 'High — Otis & KONE accelerating AI investment',
  });
}

seedDemoData();
