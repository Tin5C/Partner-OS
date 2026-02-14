// TechnicalLandscape — known vendor stack, apps, architecture patterns
// In-memory singleton. Additive only.

export interface TechnicalLandscape {
  focusId: string;
  hubOrgId: string;
  known_vendors?: string[];
  known_applications?: string[];
  architecture_patterns?: string[];
  cloud_strategy?: string;
}

const store: TechnicalLandscape[] = [];

export function getByFocusId(focusId: string): TechnicalLandscape | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(tl: TechnicalLandscape): TechnicalLandscape {
  const idx = store.findIndex((s) => s.focusId === tl.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...tl };
    return store[idx];
  }
  store.push(tl);
  return tl;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByFocusId('schindler')) return;
  upsert({
    focusId: 'schindler',
    hubOrgId: 'helioworks',
    known_vendors: ['Microsoft', 'SAP', 'ServiceNow', 'AWS (limited — legacy workloads)'],
    known_applications: [
      'SAP S/4HANA (ERP)',
      'ServiceNow ITSM',
      'Dynamics 365 Field Service (pilot)',
      'Azure IoT Hub (PoC)',
      'Power BI (enterprise reporting)',
    ],
    architecture_patterns: [
      'Hybrid cloud (Azure primary, on-prem SAP)',
      'Hub-and-spoke networking (Swiss + EU regions)',
      'API-first integration layer (Azure API Management)',
    ],
    cloud_strategy: 'Azure-first, multi-cloud tolerant. Swiss data residency required for AI/ML workloads.',
  });
}

seedDemoData();
