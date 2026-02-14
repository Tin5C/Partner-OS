// CommercialFootprint — existing licenses, contracts, renewal windows
// In-memory singleton. Additive only.

export interface CommercialFootprint {
  focusId: string;
  hubOrgId: string;
  existing_licenses?: string[];
  contract_end_dates?: string[];
  renewal_windows?: string[];
  estimated_spend_band?: string;
}

const store: CommercialFootprint[] = [];

export function getByFocusId(focusId: string): CommercialFootprint | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(fp: CommercialFootprint): CommercialFootprint {
  const idx = store.findIndex((s) => s.focusId === fp.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...fp };
    return store[idx];
  }
  store.push(fp);
  return fp;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByFocusId('schindler')) return;
  upsert({
    focusId: 'schindler',
    hubOrgId: 'helioworks',
    existing_licenses: [
      'Microsoft 365 E5 (global)',
      'Azure EA — Switzerland North + West Europe',
      'Dynamics 365 Field Service (pilot — 200 seats)',
      'Power BI Pro (1,500 seats)',
    ],
    contract_end_dates: [
      'Azure EA: Sep 2027',
      'M365 E5: Mar 2028',
    ],
    renewal_windows: [
      'Azure EA renewal discussion starts Q1 2027',
      'Dynamics Field Service expansion decision by Q3 2026',
    ],
    estimated_spend_band: 'CHF 8–12M / year (Azure + M365)',
  });
}

seedDemoData();
