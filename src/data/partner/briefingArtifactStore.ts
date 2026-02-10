// BriefingArtifact — generic model for uploaded MVP audio/text content
// Additive only; does not affect existing plays/packs/trending packs.

export type BriefingArtifactType =
  | 'vendor_product_updates'
  | 'account_microcast'
  | 'industry_microcast'
  | 'competitive_angle'
  | 'objection_briefing'
  | 'deal_risk_briefing';

export type BriefingArtifactFormat = 'text' | 'audio' | 'both';

export interface SourceObjectRef {
  type: string; // e.g. 'story', 'objection'
  id: string;
}

export interface BriefingArtifactRecord {
  id: string;
  org_id: string;
  created_at: string; // ISO
  updated_at: string; // ISO
  type: BriefingArtifactType;
  format: BriefingArtifactFormat;
  title: string;
  summary?: string;
  body_text?: string;
  audio_url?: string;
  duration_seconds?: number;
  tags?: string[];
  account_id?: string;
  source_object_refs?: SourceObjectRef[];
}

// ============= In-memory store =============

const store: BriefingArtifactRecord[] = [];

function now(): string {
  return new Date().toISOString();
}

// ============= CRUD helpers =============

export function listBriefingArtifacts(
  org_id: string,
  filters?: { type?: BriefingArtifactType; account_id?: string; tags?: string[] },
): BriefingArtifactRecord[] {
  return store.filter((a) => {
    if (a.org_id !== org_id) return false;
    if (filters?.type && a.type !== filters.type) return false;
    if (filters?.account_id && a.account_id !== filters.account_id) return false;
    if (filters?.tags?.length) {
      const has = filters.tags.some((t) => a.tags?.includes(t));
      if (!has) return false;
    }
    return true;
  });
}

export function getBriefingArtifact(id: string): BriefingArtifactRecord | null {
  return store.find((a) => a.id === id) ?? null;
}

export function createBriefingArtifact(
  payload: Omit<BriefingArtifactRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string },
): BriefingArtifactRecord {
  const record: BriefingArtifactRecord = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
    created_at: now(),
    updated_at: now(),
  };
  store.push(record);
  return record;
}

export function updateBriefingArtifact(
  id: string,
  payload: Partial<Omit<BriefingArtifactRecord, 'id' | 'created_at'>>,
): BriefingArtifactRecord | null {
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...payload, updated_at: now() };
  return store[idx];
}

// ============= Seed data =============

const SEEDS: Array<Omit<BriefingArtifactRecord, 'created_at' | 'updated_at'>> = [
  {
    id: 'ba-seed-acct-micro-text',
    org_id: 'alpnova',
    type: 'account_microcast',
    format: 'text',
    title: 'Schindler AI Adoption – Weekly Signal Digest',
    summary: 'Key signals from Schindler's recent AI evaluation cycle.',
    body_text:
      '## What changed\n- Schindler IT confirmed a Q3 pilot budget for predictive-maintenance AI.\n- New CISO hire is prioritising data-residency compliance.\n\n## So what\nPartners with Swiss-hosted AI workloads have a timing advantage.\n\n## Actions\n1. Request architecture review meeting.\n2. Share Azure Swiss data-centre collateral.\n3. Prepare ROI model for predictive-maintenance use case.',
    tags: ['Schindler', 'AI', 'Predictive Maintenance'],
    account_id: 'schindler',
  },
  {
    id: 'ba-seed-acct-micro-audio',
    org_id: 'alpnova',
    type: 'account_microcast',
    format: 'audio',
    title: 'Schindler Competitive Landscape – Audio Brief',
    audio_url: '/assets/audio/ubs-success-story.mp3', // reuse existing demo audio
    duration_seconds: 240,
    tags: ['Schindler', 'Competitive'],
    account_id: 'schindler',
  },
  {
    id: 'ba-seed-objection',
    org_id: 'alpnova',
    type: 'objection_briefing',
    format: 'both',
    title: 'Top Objections – Data Residency & Vendor Lock-in',
    summary: 'Pre-built responses for the two most common pushbacks in DACH regulated deals.',
    body_text:
      '## Objection 1: Data Residency\n**Pushback:** "We cannot store data outside Switzerland."\n**Response:** Azure Switzerland regions (Zurich & Geneva) provide full data residency. Reference: Microsoft Trust Center.\n\n## Objection 2: Vendor Lock-in\n**Pushback:** "We don\'t want to depend on a single cloud."\n**Response:** Open-standard APIs and Terraform-based IaC ensure portability. Offer a multi-cloud architecture review.',
    audio_url: '/assets/audio/ubs-success-story.mp3',
    duration_seconds: 180,
    tags: ['Objections', 'Data Residency', 'DACH'],
    account_id: 'schindler',
  },
];

export function seedBriefingArtifacts(): void {
  for (const seed of SEEDS) {
    if (!store.find((a) => a.id === seed.id)) {
      store.push({ ...seed, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
  }
}

// Auto-seed on import
seedBriefingArtifacts();
