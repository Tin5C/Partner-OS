// ContentRequest Store — "Ask Teammate" collaboration layer
// Scoped to account_id. No CRM logic. No notifications for MVP.

import { addMemoryItem, type MemoryItemType } from './accountMemoryStore';

export type RequestStatus = 'pending' | 'answered' | 'cancelled';

export type RequestType =
  | 'recording'
  | 'transcript_notes'
  | 'rfp_requirements'
  | 'architecture_diagram'
  | 'slides_deck'
  | 'news_article'
  | 'link'
  | 'other';

export interface ContentRequest {
  request_id: string;
  account_id: string;
  requested_from: string; // name / email
  request_type: RequestType;
  question_text: string;
  status: RequestStatus;
  response_memory_id: string | null;
  created_at: string;
}

// ============= In-memory store =============

const store: ContentRequest[] = [];

// ============= CRUD =============

export function createContentRequest(
  payload: Omit<ContentRequest, 'request_id' | 'status' | 'response_memory_id' | 'created_at'>,
): ContentRequest {
  const req: ContentRequest = {
    ...payload,
    request_id: crypto.randomUUID(),
    status: 'pending',
    response_memory_id: null,
    created_at: new Date().toISOString(),
  };
  store.push(req);
  return req;
}

export function listContentRequests(account_id: string): ContentRequest[] {
  return store
    .filter((r) => r.account_id === account_id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getContentRequest(request_id: string): ContentRequest | null {
  return store.find((r) => r.request_id === request_id) ?? null;
}

const REQUEST_TO_MEMORY: Record<RequestType, MemoryItemType> = {
  recording: 'recording',
  transcript_notes: 'transcript_notes',
  rfp_requirements: 'rfp_requirements',
  architecture_diagram: 'architecture_diagram',
  slides_deck: 'slides_deck',
  news_article: 'news_article',
  link: 'link',
  other: 'other',
};

export function answerContentRequest(
  request_id: string,
  answer: { title: string; content?: string; file_url?: string; file_name?: string },
): boolean {
  const req = store.find((r) => r.request_id === request_id);
  if (!req || req.status !== 'pending') return false;

  const memoryItem = addMemoryItem({
    account_id: req.account_id,
    type: REQUEST_TO_MEMORY[req.request_type] ?? 'other',
    title: answer.title,
    content_text: answer.content,
    file_url: answer.file_url,
    file_name: answer.file_name,
  });

  req.status = 'answered';
  req.response_memory_id = memoryItem.id;
  return true;
}

export function cancelContentRequest(request_id: string): boolean {
  const req = store.find((r) => r.request_id === request_id);
  if (!req || req.status !== 'pending') return false;
  req.status = 'cancelled';
  return true;
}
