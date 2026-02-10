// Engagement Tracking — raw events + derived signals
// Additive only; no aggregation jobs.

// ============= Content & Event enums =============

export type EngagementContentType =
  | 'story'
  | 'quick_brief'
  | 'microcast'
  | 'objection'
  | 'competitive'
  | 'deal_brief'
  | 'deep_dive'
  | 'package'
  | 'meeting';

export type EngagementEventType =
  | 'view'
  | 'open'
  | 'play'
  | 'complete'
  | 'copy'
  | 'forward'
  | 'replied'
  | 'requested_info'
  | 'booked_meeting'
  | 'promote_to_deal_brief';

// ============= EngagementEvent =============

export interface EngagementEvent {
  id: string;
  org_id: string;
  actor_user_id: string;
  actor_role?: string;
  timestamp: string; // ISO
  customer_account_id?: string;
  content_type: EngagementContentType;
  content_id: string;
  event_type: EngagementEventType;
  duration_seconds?: number;
  channel?: string;
  metadata?: Record<string, unknown>;
}

// ============= EngagementSignal =============

export type EngagementConfidence = 'Low' | 'Medium' | 'High';

export interface EngagementSignal {
  id: string;
  org_id: string;
  account_id: string;
  created_at: string; // ISO
  actor_role?: string;
  title: string;
  so_what: string;
  interpretation?: string;
  what_changed?: string[];
  who_cares?: string[];
  next_move?: string;
  recommended_next_moves?: string[];
  proof_to_ask_for?: string;
  confidence?: number | EngagementConfidence; // 0–100 or enum
  source_event_refs?: string[];
  tags?: string[];
}

// ============= In-memory stores =============

const eventStore: EngagementEvent[] = [];
const signalStore: EngagementSignal[] = [];

// ============= CRUD — Events =============

export function createEngagementEvent(
  payload: Omit<EngagementEvent, 'id' | 'timestamp'> & { id?: string; timestamp?: string },
): EngagementEvent {
  const record: EngagementEvent = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };
  eventStore.push(record);
  return record;
}

export function listEngagementEvents(org_id: string): EngagementEvent[] {
  return eventStore.filter((e) => e.org_id === org_id);
}

// ============= CRUD — Signals =============

export function createEngagementSignal(
  payload: Omit<EngagementSignal, 'id' | 'created_at'> & { id?: string; created_at?: string },
): EngagementSignal {
  const record: EngagementSignal = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
    created_at: payload.created_at ?? new Date().toISOString(),
  };
  signalStore.push(record);
  return record;
}

export function listEngagementSignals(
  org_id: string,
  filters?: { account_id?: string; tags?: string[] },
): EngagementSignal[] {
  return signalStore.filter((s) => {
    if (s.org_id !== org_id) return false;
    if (filters?.account_id && s.account_id !== filters.account_id) return false;
    if (filters?.tags?.length) {
      const has = filters.tags.some((t) => s.tags?.includes(t));
      if (!has) return false;
    }
    return true;
  });
}

// ============= Seed data =============

const SIGNAL_SEEDS: Array<Omit<EngagementSignal, 'created_at'> & { created_at?: string }> = [
  {
    id: 'es-seed-schindler-01',
    org_id: 'alpnova',
    account_id: 'schindler',
    title: 'Schindler team revisiting Copilot governance content',
    so_what: 'Multiple views on governance stories suggest active evaluation — ideal time to offer a workshop.',
    what_changed: [
      'Three team members viewed the Copilot Governance story within 48 h.',
      'One user promoted the story to Deal Planning.',
    ],
    who_cares: ['IT', 'Security', 'Compliance'],
    next_move: 'Propose a 30-min Copilot Governance workshop for IT + Security stakeholders.',
    proof_to_ask_for: 'Internal compliance checklist from Schindler IT',
    confidence: 72,
    source_event_refs: [],
    tags: ['Copilot', 'Governance', 'Schindler'],
  },
];

export function seedEngagementData(): void {
  for (const seed of SIGNAL_SEEDS) {
    if (!signalStore.find((s) => s.id === seed.id)) {
      signalStore.push({ ...seed, created_at: seed.created_at ?? new Date().toISOString() });
    }
  }
}

// Auto-seed on import
seedEngagementData();
