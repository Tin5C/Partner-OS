// AccountMemory — lightweight inbox items scoped to account_id
// Stores files, notes, links, signals attached to a deal plan
// Separate from Extractor Packs (Modules 0–6)

export type MemoryItemType =
  | 'recording'
  | 'transcript_notes'
  | 'rfp_requirements'
  | 'architecture_diagram'
  | 'slides_deck'
  | 'news_article'
  | 'link'
  | 'other';

export const MEMORY_TYPE_OPTIONS: { value: MemoryItemType; label: string }[] = [
  { value: 'recording', label: 'Recording' },
  { value: 'transcript_notes', label: 'Transcript / Notes' },
  { value: 'rfp_requirements', label: 'RFP / Requirements' },
  { value: 'architecture_diagram', label: 'Architecture / Diagram' },
  { value: 'slides_deck', label: 'Slides / Deck' },
  { value: 'news_article', label: 'News / Article' },
  { value: 'link', label: 'Link' },
  { value: 'other', label: 'Other' },
];

export interface AccountMemoryItem {
  id: string;
  account_id: string;
  type: MemoryItemType;
  title: string;
  content_text?: string;    // for pasted text/notes
  url?: string;             // for links/recordings/articles
  file_url?: string;        // for uploaded files (reference only)
  file_name?: string;       // original file name
  created_at: string;
  updated_at: string;
  tags?: string[];
  scope_id?: string | null;
}

// ============= In-memory store =============

const store: AccountMemoryItem[] = [];

// ============= CRUD =============

export function addMemoryItem(
  payload: Omit<AccountMemoryItem, 'id' | 'created_at' | 'updated_at'>,
): AccountMemoryItem {
  const now = new Date().toISOString();
  const item: AccountMemoryItem = {
    ...payload,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
  store.push(item);
  return item;
}

export function listMemoryItems(account_id: string): AccountMemoryItem[] {
  return store
    .filter((i) => i.account_id === account_id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function updateMemoryType(id: string, type: MemoryItemType): boolean {
  const item = store.find((i) => i.id === id);
  if (!item) return false;
  item.type = type;
  item.updated_at = new Date().toISOString();
  return true;
}

export function deleteMemoryItem(id: string): boolean {
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

// ============= Evidence pillar mapping =============

export type EvidencePillar =
  | 'context'
  | 'technical'
  | 'stakeholders'
  | 'competitive'
  | 'proof';

const TYPE_TO_PILLAR: Record<MemoryItemType, EvidencePillar> = {
  recording: 'context',
  transcript_notes: 'context',
  rfp_requirements: 'technical',
  architecture_diagram: 'technical',
  slides_deck: 'proof',
  news_article: 'competitive',
  link: 'context',
  other: 'context',
};

export function getPillarForType(type: MemoryItemType): EvidencePillar {
  return TYPE_TO_PILLAR[type];
}

export function getReadinessScore(account_id: string, hasPromotedSignals: boolean): {
  score: number;
  pillars: Record<EvidencePillar, boolean>;
} {
  const items = listMemoryItems(account_id);
  const covered = new Set<EvidencePillar>();

  for (const item of items) {
    covered.add(getPillarForType(item.type));
  }

  // Stakeholders pillar: always true if plan is started (we have default stakeholder data)
  covered.add('stakeholders');

  // Competitive pillar: if promoted signals exist or news items exist
  if (hasPromotedSignals) covered.add('competitive');

  const pillars: Record<EvidencePillar, boolean> = {
    context: covered.has('context'),
    technical: covered.has('technical'),
    stakeholders: covered.has('stakeholders'),
    competitive: covered.has('competitive'),
    proof: covered.has('proof'),
  };

  const score = Object.values(pillars).filter(Boolean).length * 20;
  return { score, pillars };
}
