// Generated Draft Store — ephemeral on-demand outputs with 7-day TTL
// Partner-only. Session-scoped (in-memory), no persistence.

export interface GeneratedDraft {
  id: string;
  createdAt: string;
  focusId?: string;
  vendor?: string;
  industry?: string;
  prompt: string;
  output: string;
  mode: 'on-demand';
  ttlDays: 7;
  promotedToStoryId?: string;
  promotedToDealPlanningId?: string;
  // Prompt lineage (Phase 1 — optional, additive)
  promptId?: string;
  promptVersion?: string;
  promptHash?: string;
}

let idCounter = 0;
const drafts: GeneratedDraft[] = [];

export function createGeneratedDraft(input: {
  focusId?: string;
  vendor?: string;
  industry?: string;
  prompt: string;
  output: string;
}): GeneratedDraft {
  idCounter++;
  const draft: GeneratedDraft = {
    id: `draft-${Date.now()}-${idCounter}`,
    createdAt: new Date().toISOString(),
    focusId: input.focusId,
    vendor: input.vendor,
    industry: input.industry,
    prompt: input.prompt,
    output: input.output,
    mode: 'on-demand',
    ttlDays: 7,
  };
  drafts.unshift(draft);
  // Prune expired (> 7 days)
  pruneExpired();
  return draft;
}

export function getGeneratedDraft(id: string): GeneratedDraft | null {
  pruneExpired();
  return drafts.find((d) => d.id === id) ?? null;
}

export function listGeneratedDrafts(focusId?: string): GeneratedDraft[] {
  pruneExpired();
  if (focusId) return drafts.filter((d) => d.focusId === focusId);
  return [...drafts];
}

export function promoteToStory(draftId: string, storyId: string): void {
  const d = drafts.find((x) => x.id === draftId);
  if (d) d.promotedToStoryId = storyId;
}

export function promoteToDealPlanning(draftId: string, dealPlanId: string): void {
  const d = drafts.find((x) => x.id === draftId);
  if (d) d.promotedToDealPlanningId = dealPlanId;
}

function pruneExpired() {
  const now = Date.now();
  const ttlMs = 7 * 24 * 60 * 60 * 1000;
  for (let i = drafts.length - 1; i >= 0; i--) {
    if (now - new Date(drafts[i].createdAt).getTime() > ttlMs) {
      drafts.splice(i, 1);
    }
  }
}
