// Partner-only in-memory store for selected packs and content requests in Deal Planning

export interface ContentRequest {
  id: string;
  packId: string;
  packName: string;
  type: 'proof_request';
  createdAt: string;
}

const selectedPacks: Map<string, string[]> = new Map(); // focusId -> packIds
const contentRequests: Map<string, ContentRequest[]> = new Map(); // focusId -> requests

export function getSelectedPacks(focusId: string): string[] {
  return selectedPacks.get(focusId) ?? [];
}

export function addSelectedPack(focusId: string, packId: string): void {
  const existing = selectedPacks.get(focusId) ?? [];
  if (!existing.includes(packId)) {
    selectedPacks.set(focusId, [...existing, packId]);
  }
}

export function removeSelectedPack(focusId: string, packId: string): void {
  const existing = selectedPacks.get(focusId) ?? [];
  selectedPacks.set(focusId, existing.filter((id) => id !== packId));
}

export function getContentRequests(focusId: string): ContentRequest[] {
  return contentRequests.get(focusId) ?? [];
}

export function addContentRequest(focusId: string, packId: string, packName: string): ContentRequest {
  const req: ContentRequest = {
    id: crypto.randomUUID(),
    packId,
    packName,
    type: 'proof_request',
    createdAt: new Date().toISOString(),
  };
  const existing = contentRequests.get(focusId) ?? [];
  contentRequests.set(focusId, [...existing, req]);
  return req;
}
