// PartnerProfiles — canonical partner profile intelligence
// Additive only; no changes to existing collections.

export interface PartnerProfile {
  id: string;
  org_id: string;
  partner_name: string;
  primary_vendor: string;
  positioning: string;
  core_strengths: string[];
  typical_buyers: string[];
  service_line_map?: string[];
  package_library?: string[];
  differentiators?: string[];
}

// ============= In-memory store =============

const store: PartnerProfile[] = [];

// ============= CRUD =============

export function createPartnerProfile(
  payload: Omit<PartnerProfile, 'id'> & { id?: string },
): PartnerProfile {
  const record: PartnerProfile = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
  };
  store.push(record);
  return record;
}

export function listPartnerProfiles(org_id: string): PartnerProfile[] {
  return store.filter((p) => p.org_id === org_id);
}

export function getPartnerProfile(id: string): PartnerProfile | null {
  return store.find((p) => p.id === id) ?? null;
}

// ============= Seed =============

const SEEDS: Array<Omit<PartnerProfile, 'id'> & { id: string }> = [
  {
    id: 'pp-seed-alpnova',
    org_id: 'alpnova',
    partner_name: 'AlpNova Digital',
    primary_vendor: 'Microsoft',
    positioning: 'Swiss-based Microsoft partner specialising in AI, data, and cloud modernisation for regulated industries.',
    core_strengths: ['Azure AI & ML', 'Data Platform', 'Cloud Migration', 'Security & Compliance'],
    typical_buyers: ['CTO', 'CIO', 'VP Engineering', 'CISO'],
    service_line_map: ['AI & Analytics', 'Modern Workplace', 'Cloud Infrastructure', 'Security'],
    package_library: ['Copilot Readiness', 'Azure AI Foundations', 'Data Residency Accelerator'],
    differentiators: ['Swiss data residency expertise', 'Regulated-industry references', 'Bilingual DE/FR delivery'],
  },
];

export function seedPartnerProfiles(): void {
  for (const seed of SEEDS) {
    if (!store.find((p) => p.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedPartnerProfiles();
