// ProofArtifacts — public proof/success artifacts for an account
// In-memory singleton. Additive only.

export type ArtifactType =
  | 'case_study'
  | 'award'
  | 'conference_talk'
  | 'product_launch'
  | 'product_page'
  | 'analyst_report'
  | 'partnership_announcement'
  | 'other';

export type CapabilityProven =
  | 'field_service'
  | 'digital_services'
  | 'data'
  | 'ai'
  | 'security'
  | 'platform'
  | 'erp'
  | 'workplace'
  | 'other';

export interface ProofArtifact {
  id: string;
  year: number | null;
  title: string;
  artifact_type: ArtifactType;
  summary: string;
  capability_proven: CapabilityProven[];
  vendors_mentioned: string[];
  source_url: string;
  confidence_level: 'high' | 'medium' | 'low';
}

export interface ProofArtifactsRecord {
  focusId: string;
  hubOrgId: string;
  generated_at: string;
  time_range_years: number;
  proof_artifacts: ProofArtifact[];
}

const store: ProofArtifactsRecord[] = [];

export function getByFocusId(focusId: string): ProofArtifactsRecord | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(record: ProofArtifactsRecord): ProofArtifactsRecord {
  const idx = store.findIndex((s) => s.focusId === record.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...record };
    return store[idx];
  }
  store.push(record);
  return record;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByFocusId('schindler')) return;
  upsert({
    focusId: 'schindler',
    hubOrgId: 'helioworks',
    generated_at: '2026-02-14T19:30:00+01:00',
    time_range_years: 5,
    proof_artifacts: [
      {
        id: 'proof_schindler_0001',
        year: 2019,
        title: 'Ahead ActionBoard app recognized at Best of Swiss App',
        artifact_type: 'award',
        summary:
          'Schindler notes the Ahead ActionBoard app was awarded at Best of Swiss App (proof of product maturity).',
        capability_proven: ['digital_services', 'field_service', 'other'],
        vendors_mentioned: [],
        source_url: 'https://www.schindler.ch/de/medien/news/ahead-actionboard-app.html',
        confidence_level: 'high',
      },
      {
        id: 'proof_schindler_0002',
        year: null,
        title: 'ActionBoard product surface (official product site)',
        artifact_type: 'product_page',
        summary:
          'Official ActionBoard product site exists as a customer-facing surface (proof the digital capability is productized).',
        capability_proven: ['digital_services', 'field_service'],
        vendors_mentioned: [],
        source_url: 'https://actionboard.schindler.com/',
        confidence_level: 'medium',
      },
      {
        id: 'proof_schindler_0003',
        year: null,
        title: 'Developer Portal news surface',
        artifact_type: 'product_launch',
        summary:
          'Developer Portal news page indicates ongoing ecosystem enablement and product updates (platformization proof).',
        capability_proven: ['platform', 'data', 'other'],
        vendors_mentioned: [],
        source_url: 'https://developer.schindler.com/news',
        confidence_level: 'medium',
      },
    ],
  });
}

seedDemoData();
